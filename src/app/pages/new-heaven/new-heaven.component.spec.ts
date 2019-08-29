import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHeavenComponent } from './new-heaven.component';

describe('NewHeavenComponent', () => {
  let component: NewHeavenComponent;
  let fixture: ComponentFixture<NewHeavenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewHeavenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHeavenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
