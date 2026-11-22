import { TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../testing/test-providers';

import { ValutazionePsicologicaService } from './valutazione-psicologica.service';

describe('ValutazionePsicologicaService', () => {
  let service: ValutazionePsicologicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(ValutazionePsicologicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
