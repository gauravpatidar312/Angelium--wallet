
//   /**
//    * @license
//    * Copyright Wesam Gerges. All Rights Reserved.
//    * Licensed under the Apache License, Version 2.0 (the "License");
//    * you may not use this file except in compliance with the License.
//    * You may obtain a copy of the License at
//    *
//    * http://www.apache.org/licenses/LICENSE-2.0
//    *
//    * Unless required by applicable law or agreed to in writing, software
//    * distributed under the License is distributed on an "AS IS" BASIS,
//    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    * See the License for the specific language governing permissions and
//    * limitations under the License.
//    * =============================================================================
//    */

class slideToUnlock {

    constructor(el, options) {
        this.$el = el;
        this.$drag;
        this.start = false;
        this.leftEdge;
        this.rightEdge;
        this.mouseX;

        this.settings = {
            // unlockText    : "Slide To Unlock",
            useData: false,
            unlockfn: function () {               
                $(document).trigger("veryfiedCaptcha", ['verified']);
            },
            lockfn: function () { },
            allowToLock: true,
            status: false
        }

        // Establish our default settings
        this.settings = Object.assign(this.settings, options);
        if (this.settings.useData) {
            if (!("unlockText" in this.settings) && this.$el.data("unlock-text")) {
                this.settings.unlockText = this.$el.data("unlock-text");
            }
            if (!("lockText" in this.settings) && this.$el.data("lock-text")) {
                this.settings.lockText = this.$el.data("lock-text");
            }

            this.settings.status = this.$el.data("status");
        }

        if (!("lockText" in this.settings)) {
            this.settings.lockText = "Slide To Unlock";
        }

        if (!("unlockText" in this.settings)) {
            this.settings.unlockText = this.settings.lockText;
        }

        this.init();
        return this;
    };

    init() {
        this.$el.addClass('slideToUnlock');
        this.leftEdge = this.$el.offset().left;
        this.rightEdge = this.leftEdge + this.$el.outerWidth();

        this.$el.addClass("locked");
        this.$el.append("<div class='progressBar unlocked'></div>");
        this.$el.append("<div class='text'>" + this.settings.lockText + "</div>");
        this.$el.append("<div class='drag locked_handle '>  </div>");

        this.$text = this.$el.find('.text');
        this.$drag = this.$el.find('.drag');
        this.$progressBar = this.$el.find(".progressBar");


        this.$drag.on("mousedown.slideToUnlock touchstart.slideToUnlock", this.touchStart.bind(this));

        if (this.settings.status) {
            this.$drag.css({ left: "auto", right: 0 });
            this.$progressBar.css({ width: "100%" });
        }
    }

    touchStart(event = window.event) {
        if (!this.settings.status) {
            this.start = true;
            this.leftEdge = Math.trunc(this.$el.offset().left);
            this.rightEdge = Math.trunc(this.leftEdge + this.$el.outerWidth());

            $(document).on("mousemove.slideToUnlock touchmove.slideToUnlock", this.touchMove.bind(this));
            $(document).on("mouseup.slideToUnlock touchend.slideToUnlock", this.touchEnd.bind(this));
            this.mouseX = (event.type == 'mousedown') ? event.pageX : event.originalEvent.touches[0].pageX;
        }

        event.preventDefault();
    }

    touchMove(event = window.event) {
        if (!this.start) return;
        var X = (event.type == 'mousemove') ? event.pageX : event.originalEvent.touches[0].pageX;
        var changeX = (X - this.mouseX);
        var edge = Math.trunc(this.$drag.offset().left) + changeX;
        this.mouseX = X;

        if (edge < this.leftEdge) {
            if (this.settings.status)
                this.settings.lockfn(this.$el);
            this.$text.text(this.settings.lockText);
            this.$drag.removeClass('unlocked_handle').addClass('locked_handle');
            this.start = false;
            this.settings.status = false;
            this.touchEnd();
            return;
        }

        if (edge > this.rightEdge - this.$drag.outerWidth()) {
            if (!this.settings.status) {
                this.settings.unlockfn(this.$el);
                // document.body.addEventListener("myEventName", doSomething, false);

            }
            this.$text.text(this.settings.unlockText);
            this.$drag.removeClass('locked_handle').addClass('unlocked_handle');
            if (!this.settings.allowToLock) {
                this.$drag.off("mousedown.slideToUnlock touchstart.slideToUnlock");
            }
            this.settings.status = true;
            this.start = false;
            this.touchEnd();
            return;
        }

        this.$drag.offset({ left: edge });
        this.$progressBar.css({ "width": edge - this.$el.offset().left + this.$drag.outerWidth() });

        event.stopImmediatePropagation();
    }

    touchEnd(event = window.event) {
        this.start = false;
        this.mouseX = 0;
        if (!this.settings.status) {
            this.$drag.animate({ left: 0, "margin-left": 0 });
            if (this.$progressBar.width() > this.$drag.width()) {
                this.$progressBar.animate({ width: this.$drag.width() }, function () {
                    this.$progressBar.css({ width: 0 });
                }.bind(this));
            }
        }

        if (this.settings.status) {
            this.$drag.animate({ "left": "100%", "margin-left": "-38px" });
            this.$progressBar.animate({ width: "100%" });
        }

        $(document).off("mousemove.slideToUnlock touchmove.slideToUnlock");
        $(document).off("mouseup.slideToUnlock touchend.slideToUnlock");
        event.stopImmediatePropagation();
    }
};
/*
* Add it to Jquery
*/
(($) => {

    $.fn.slideToUnlock = function (options) {
        $.each(this, function (i, el) {
            new slideToUnlock($(el), options);
        });
        return this;
    }
})(jQuery);


// (($) => {
//     $.fn.slideToClick = function () {
//         $(this).each(function () {
//             var button = $(this);
//             button.css({
//                 width: '0',
//                 height: '0',
//                 overflow: 'hidden',
//                 visibility: 'hidden',
//                 padding: '0',
//                 margin: '0'
//             });
//             var value = $(this).html();
//             if(button[0].tagname == 'INPUT') value = $(this).val();
//             var sliderContainer = $('<div class="text-center slide-to-click-slider-container">' + value + '</div>');
//             var slider = $('<div class="slide-to-click-slider">&#10095;</div>');
//             var dragging = false;
//             var offset = 0;
//             slider.on('mousedown', function(e){
//                 dragging = true;
//                 offset = e.pageX - slider.position().left;
//             });
//             $(document.body).on('mouseup', function(){
//                 dragging = false;
//                 slider.css('left', '2px');
//             });
//             $(document.body).on("mousemove", function(e) {
//                 if (dragging) {
//                     var measure = e.pageX - offset;
//                     if(measure < 2) measure = 2;
//                     if(measure + slider.width() > sliderContainer.width() - 5){
//                         slider.css('left', '2px');
//                         $(document.body).trigger('mouseup');
//                         button.click();
//                     }
//                     else slider.css('left', measure + 'px');
//                 }
//             });
//             sliderContainer.prepend(slider);
//             $(this).after(sliderContainer);
//         });
//     };
// })(jQuery);

/* =============================================== created by giovazzz89 - http://giovannimuzzolini.com ================================================ */
