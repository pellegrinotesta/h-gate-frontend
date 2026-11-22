import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../../testing/test-providers';

import { PrivacyContentDialogComponent } from './privacy-content-dialog.component';

describe('PrivacyContentDialogComponent', () => {
  let component: PrivacyContentDialogComponent;
  let fixture: ComponentFixture<PrivacyContentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: TEST_PROVIDERS,
      imports: [PrivacyContentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyContentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
