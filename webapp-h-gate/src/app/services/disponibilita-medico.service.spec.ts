import { TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../testing/test-providers';

import { DisponibilitaMedicoService } from './disponibilita-medico.service';

describe('DisponibilitaMedicoService', () => {
  let service: DisponibilitaMedicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(DisponibilitaMedicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
