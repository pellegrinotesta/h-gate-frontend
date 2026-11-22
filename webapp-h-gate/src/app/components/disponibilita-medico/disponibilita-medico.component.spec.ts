import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../../testing/test-providers';

import { DisponibilitaMedicoComponent } from './disponibilita-medico.component';

describe('DisponibilitaMedicoComponent', () => {
  let component: DisponibilitaMedicoComponent;
  let fixture: ComponentFixture<DisponibilitaMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: TEST_PROVIDERS,
      imports: [DisponibilitaMedicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisponibilitaMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
