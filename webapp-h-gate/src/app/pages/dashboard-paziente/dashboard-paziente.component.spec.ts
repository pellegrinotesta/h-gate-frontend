import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPazienteComponent } from './dashboard-paziente.component';

describe('DashboardPazienteComponent', () => {
  let component: DashboardPazienteComponent;
  let fixture: ComponentFixture<DashboardPazienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPazienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPazienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
