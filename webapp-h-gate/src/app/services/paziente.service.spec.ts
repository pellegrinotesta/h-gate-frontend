import { TestBed } from '@angular/core/testing';

import { PazienteService } from './paziente.service';

describe('PazienteService', () => {
  let service: PazienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PazienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
