import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../../testing/test-providers';

import { TariffeDialogComponent } from './tariffe-dialog.component';

describe('TariffeDialogComponent', () => {
  let component: TariffeDialogComponent;
  let fixture: ComponentFixture<TariffeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: TEST_PROVIDERS,
      imports: [TariffeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TariffeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
