import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../../../testing/test-providers';

import { GenericCardComponent } from './generic-card.component';

describe('GenericCardComponent', () => {
  let component: GenericCardComponent;
  let fixture: ComponentFixture<GenericCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: TEST_PROVIDERS,
      imports: [GenericCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
