import { Injectable, inject, signal } from '@angular/core';
import { Paziente } from '../../models/paziente.model';
import { PazienteService } from '../../services/paziente.service';

@Injectable({ providedIn: 'root' })
export class MinoriStateService {

    private pazienteService = inject(PazienteService);

    private _minori = signal<Paziente[]>([]);
    private _loaded = false;
    private _loading = false;

    readonly minori = this._minori.asReadonly();

    /**
     * Carica i minori solo se non sono già stati caricati in questa sessione.
     * Chiamabile più volte senza effetti collaterali.
     */
    loadIfNeeded(): void {
        if (this._loaded || this._loading) return;
        this._loading = true;

        // Decommentare quando TutoreService è disponibile:
        this.pazienteService.getPazientiByTutore().subscribe({
            next: (res) => {
                this._minori.set(res.data ?? []);
                this._loaded = true;
                this._loading = false;
            },
            error: () => {
                this._loading = false;
            }
        });
    }

    /**
     * Forza il refresh (es. dopo aggiunta/rimozione di un minore)
     */
    reload(): void {
        this._loaded = false;
        this._loading = false;
        this.loadIfNeeded();
    }

    /**
     * Resetta lo stato al logout
     */
    clear(): void {
        this._minori.set([]);
        this._loaded = false;
        this._loading = false;
    }
}