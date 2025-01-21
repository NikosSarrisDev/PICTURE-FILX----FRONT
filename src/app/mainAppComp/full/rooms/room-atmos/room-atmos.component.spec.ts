import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAtmosComponent } from './room-atmos.component';

describe('RoomAtmosComponent', () => {
  let component: RoomAtmosComponent;
  let fixture: ComponentFixture<RoomAtmosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomAtmosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomAtmosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
