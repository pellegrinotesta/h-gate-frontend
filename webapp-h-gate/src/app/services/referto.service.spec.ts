import { TestBed } from '@angular/core/testing';

import { RefertoService } from './referto.service';

describe('RefertoService', () => {
  let service: RefertoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefertoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
