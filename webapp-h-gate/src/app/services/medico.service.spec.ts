import { TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../testing/test-providers';

import { MedicoService } from './medico.service';

describe('MedicoService', () => {
  let service: MedicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(MedicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
