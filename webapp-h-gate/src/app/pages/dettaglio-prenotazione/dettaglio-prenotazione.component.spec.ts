import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../../testing/test-providers';

import { DettaglioPrenotazioneComponent } from './dettaglio-prenotazione.component';

describe('DettaglioPrenotazioneComponent', () => {
  let component: DettaglioPrenotazioneComponent;
  let fixture: ComponentFixture<DettaglioPrenotazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: TEST_PROVIDERS,
      imports: [DettaglioPrenotazioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettaglioPrenotazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
