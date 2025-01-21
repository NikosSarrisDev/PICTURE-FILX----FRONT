import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDefaultComponent } from './room-default.component';

describe('RoomDefaultComponent', () => {
  let component: RoomDefaultComponent;
  let fixture: ComponentFixture<RoomDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomDefaultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
