import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValutazionePsicologicaComponent } from './valutazione-psicologica.component';

describe('ValutazionePsicologicaComponent', () => {
  let component: ValutazionePsicologicaComponent;
  let fixture: ComponentFixture<ValutazionePsicologicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValutazionePsicologicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValutazionePsicologicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
