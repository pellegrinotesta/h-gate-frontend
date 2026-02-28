import { TestBed } from '@angular/core/testing';

import { ValutazionePsicologicaService } from './valutazione-psicologica.service';

describe('ValutazionePsicologicaService', () => {
  let service: ValutazionePsicologicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValutazionePsicologicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
