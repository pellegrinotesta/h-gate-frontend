import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../../testing/test-providers';

import { NuovaPrenotazioneComponent } from './nuova-prenotazione.component';

describe('NuovaPrenotazioneComponent', () => {
  let component: NuovaPrenotazioneComponent;
  let fixture: ComponentFixture<NuovaPrenotazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: TEST_PROVIDERS,
      imports: [NuovaPrenotazioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuovaPrenotazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
