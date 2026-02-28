import { TestBed } from '@angular/core/testing';

import { PercorsoTerapeuticoService } from './percorso-terapeutico.service';

describe('PercorsoTerapeuticoService', () => {
  let service: PercorsoTerapeuticoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PercorsoTerapeuticoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
