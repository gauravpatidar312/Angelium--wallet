import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeavenComponent } from './heaven.component';

describe('HeavenComponent', () => {
  let component: HeavenComponent;
  let fixture: ComponentFixture<HeavenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeavenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeavenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
