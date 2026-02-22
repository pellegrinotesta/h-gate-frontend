import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefertoDialogComponent } from './referto-dialog.component';

describe('RefertoDialogComponent', () => {
  let component: RefertoDialogComponent;
  let fixture: ComponentFixture<RefertoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefertoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefertoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
