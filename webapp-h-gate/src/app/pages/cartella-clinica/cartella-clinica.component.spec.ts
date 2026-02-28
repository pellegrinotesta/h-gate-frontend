import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartellaClinicaComponent } from './cartella-clinica.component';

describe('CartellaClinicaComponent', () => {
  let component: CartellaClinicaComponent;
  let fixture: ComponentFixture<CartellaClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartellaClinicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartellaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
