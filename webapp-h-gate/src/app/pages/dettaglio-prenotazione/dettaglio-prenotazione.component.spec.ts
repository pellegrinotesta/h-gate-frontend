import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioPrenotazioneComponent } from './dettaglio-prenotazione.component';

describe('DettaglioPrenotazioneComponent', () => {
  let component: DettaglioPrenotazioneComponent;
  let fixture: ComponentFixture<DettaglioPrenotazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
