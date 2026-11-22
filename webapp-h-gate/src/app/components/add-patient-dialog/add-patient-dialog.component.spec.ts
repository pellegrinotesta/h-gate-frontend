import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../../testing/test-providers';

import { AddPatientDialogComponent } from './add-patient-dialog.component';

describe('AddPatientDialogComponent', () => {
  let component: AddPatientDialogComponent;
  let fixture: ComponentFixture<AddPatientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: TEST_PROVIDERS,
      imports: [AddPatientDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPatientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
