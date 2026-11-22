import { TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../testing/test-providers';

import { PazienteService } from './paziente.service';

describe('PazienteService', () => {
  let service: PazienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(PazienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
