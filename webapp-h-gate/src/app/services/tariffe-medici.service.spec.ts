import { TestBed } from '@angular/core/testing';

import { TariffeMediciService } from './tariffe-medici.service';

describe('TariffeMediciService', () => {
  let service: TariffeMediciService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TariffeMediciService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
