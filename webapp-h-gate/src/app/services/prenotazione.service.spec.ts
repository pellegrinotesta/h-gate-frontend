import { TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../testing/test-providers';

import { PrenotazioneService } from './prenotazione.service';

describe('PrenotazioneService', () => {
  let service: PrenotazioneService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(PrenotazioneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
