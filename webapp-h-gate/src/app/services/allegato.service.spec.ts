import { TestBed } from '@angular/core/testing';

import { AllegatoService } from './allegato.service';

describe('AllegatoService', () => {
  let service: AllegatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllegatoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
