import { TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../testing/test-providers';

import { RefertoService } from './referto.service';

describe('RefertoService', () => {
  let service: RefertoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(RefertoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
