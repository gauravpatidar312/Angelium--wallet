import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketMasterComponent } from './ticket-master.component';

describe('TicketMasterComponent', () => {
  let component: TicketMasterComponent;
  let fixture: ComponentFixture<TicketMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
