import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TariffeDialogComponent } from './tariffe-dialog.component';

describe('TariffeDialogComponent', () => {
  let component: TariffeDialogComponent;
  let fixture: ComponentFixture<TariffeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
