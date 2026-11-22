import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../../testing/test-providers';

import { ListaMediciComponent } from './lista-medici.component';

describe('ListaMediciComponent', () => {
  let component: ListaMediciComponent;
  let fixture: ComponentFixture<ListaMediciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: TEST_PROVIDERS,
      imports: [ListaMediciComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaMediciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
