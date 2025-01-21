import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomGoldComponent } from './room-gold.component';

describe('RoomGoldComponent', () => {
  let component: RoomGoldComponent;
  let fixture: ComponentFixture<RoomGoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomGoldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomGoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
