import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PROVIDERS } from '../../../testing/test-providers';

import { AnnullaPrenotazioneDialogComponent } from './annulla-prenotazione-dialog.component';

describe('AnnullaPrenotazioneDialogComponent', () => {
  let component: AnnullaPrenotazioneDialogComponent;
  let fixture: ComponentFixture<AnnullaPrenotazioneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: TEST_PROVIDERS,
      imports: [AnnullaPrenotazioneDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnullaPrenotazioneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
