import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercorsoTerapeuticoComponent } from './percorso-terapeutico.component';

describe('PercorsoTerapeuticoComponent', () => {
  let component: PercorsoTerapeuticoComponent;
  let fixture: ComponentFixture<PercorsoTerapeuticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PercorsoTerapeuticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PercorsoTerapeuticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
