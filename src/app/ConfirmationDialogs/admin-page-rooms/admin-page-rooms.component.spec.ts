import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPageRoomsComponent } from './admin-page-rooms.component';

describe('AdminPageRoomsComponent', () => {
  let component: AdminPageRoomsComponent;
  let fixture: ComponentFixture<AdminPageRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPageRoomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPageRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
