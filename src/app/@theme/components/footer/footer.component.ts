import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by font-nunitoSans">{{common.amount | translate}} <span><a href="https://angelium.net" class="angelium-text" target="_blank">ANGELIUM</a></span></span>
    <div class="socials">
      <a href="https://t.me/Angelium_ANL" target="_blank" title="Telegram Global" class="ion ion-paper-airplane"></a>
      <a href="https://t.me/Angelium_cn" target="_blank" title="Telegram China" class="ion ion-paper-airplane"></a>
      <a href="https://t.me/Angelium_jp" target="_blank" title="Telegram Japan" class="ion ion-paper-airplane"></a>
    </div>
  `,
})
export class FooterComponent {
}
