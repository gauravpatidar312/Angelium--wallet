import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackJackComponent } from './black-jack.component';

describe('BlackJackComponent', () => {
  let component: BlackJackComponent;
  let fixture: ComponentFixture<BlackJackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlackJackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackJackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
