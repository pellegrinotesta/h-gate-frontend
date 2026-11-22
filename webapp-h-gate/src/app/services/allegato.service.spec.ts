import { TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../testing/test-providers';

import { AllegatoService } from './allegato.service';

describe('AllegatoService', () => {
  let service: AllegatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(AllegatoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
