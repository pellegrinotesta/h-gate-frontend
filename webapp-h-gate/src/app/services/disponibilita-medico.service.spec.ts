import { TestBed } from '@angular/core/testing';

import { DisponibilitaMedicoService } from './disponibilita-medico.service';

describe('DisponibilitaMedicoService', () => {
  let service: DisponibilitaMedicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisponibilitaMedicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
