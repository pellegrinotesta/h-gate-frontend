import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../../../testing/test-providers';

import { GenericFormComponent } from './generic-form.component';

describe('GenericFormComponent', () => {
  let component: GenericFormComponent;
  let fixture: ComponentFixture<GenericFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: TEST_PROVIDERS,
      imports: [GenericFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
