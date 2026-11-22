import { TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../testing/test-providers';

import { TariffeMediciService } from './tariffe-medici.service';

describe('TariffeMediciService', () => {
  let service: TariffeMediciService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(TariffeMediciService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
