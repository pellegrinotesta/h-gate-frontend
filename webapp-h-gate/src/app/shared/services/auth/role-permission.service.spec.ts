import { TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../../../testing/test-providers';

import { RolePermissionService } from './role-permission.service';

describe('RolePermissionService', () => {
  let service: RolePermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: TEST_PROVIDERS });
    service = TestBed.inject(RolePermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
