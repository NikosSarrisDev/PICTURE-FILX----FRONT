import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyTicketAddShowRemainingComponent } from './buy-ticket-add-show-remaining.component';

describe('BuyTicketAddShowRemainingComponent', () => {
  let component: BuyTicketAddShowRemainingComponent;
  let fixture: ComponentFixture<BuyTicketAddShowRemainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyTicketAddShowRemainingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyTicketAddShowRemainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
