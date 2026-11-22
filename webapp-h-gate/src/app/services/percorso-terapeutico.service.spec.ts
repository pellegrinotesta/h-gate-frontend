import { TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../testing/test-providers';

import { PercorsoTerapeuticoService } from './percorso-terapeutico.service';

describe('PercorsoTerapeuticoService', () => {
  let service: PercorsoTerapeuticoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(PercorsoTerapeuticoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
