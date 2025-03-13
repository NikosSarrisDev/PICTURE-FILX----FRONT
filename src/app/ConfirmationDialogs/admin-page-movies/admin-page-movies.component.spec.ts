import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPageMoviesComponent } from './admin-page-movies.component';

describe('AdminPageMoviesComponent', () => {
  let component: AdminPageMoviesComponent;
  let fixture: ComponentFixture<AdminPageMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPageMoviesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPageMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
