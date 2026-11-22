import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../../testing/test-providers';

import { PrenotazioniListComponent } from './prenotazioni-list.component';

describe('PrenotazioniListComponent', () => {
  let component: PrenotazioniListComponent;
  let fixture: ComponentFixture<PrenotazioniListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: TEST_PROVIDERS,
      imports: [PrenotazioniListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrenotazioniListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
