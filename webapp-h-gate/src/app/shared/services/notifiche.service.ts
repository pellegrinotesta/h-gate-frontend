import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../environment/environment";
import { interval, startWith, switchMap, Observable, tap, catchError, of } from "rxjs";
import { Notifica } from "../../models/notifica.model";
import { ResponseDTO } from "../models/response.model";

@Injectable({
    providedIn: 'root'
})
export class NotificheService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.endpoints.notifiche;

    // Signal per le notifiche non lette - inizializzati con valori di default
    notificheNonLette = signal<Notifica[]>([]);
    conteggioNonLette = signal<number>(0);

    constructor() {
        // Polling ogni 30 secondi per aggiornare le notifiche
        this.startPolling();
    }

    /**
     * Avvia il polling automatico delle notifiche ogni 30 secondi
     */
    private startPolling(): void {
        interval(30000) // 30 secondi
            .pipe(
                startWith(0), // Esegui subito
                switchMap(() => this.loadNotificheNonLette())
            )
            .subscribe();
    }

    /**
     * Carica tutte le notifiche dell'utente (con paginazione)
     */
    getNotifiche(page: number = 0, size: number = 20): Observable<ResponseDTO<any>> {
        return this.http.get<ResponseDTO<any>>(
            `${this.baseUrl}?page=${page}&size=${size}`
        );
    }

    /**
     * Carica solo le notifiche non lette
     */
    getNotificheNonLette(): Observable<ResponseDTO<Notifica[]>> {
        return this.http.get<ResponseDTO<Notifica[]>>(`${this.baseUrl}/non-lette`);
    }

    /**
     * Carica le notifiche non lette e aggiorna i signal
     */
    private loadNotificheNonLette(): Observable<ResponseDTO<Notifica[]>> {
        return this.getNotificheNonLette().pipe(
            tap(response => {
                // Verifica che la risposta e i dati esistano
                if (response && response.data) {
                    this.notificheNonLette.set(response.data);
                    this.conteggioNonLette.set(response.data.length);
                } else {
                    // Fallback a array vuoto se non ci sono dati
                    console.warn('Risposta notifiche senza dati:', response);
                    this.notificheNonLette.set([]);
                    this.conteggioNonLette.set(0);
                }
            }),
            // Gestisci errori senza bloccare il polling
            catchError(error => {
                console.error('Errore caricamento notifiche:', error);
                return of({
                    data: [],
                    ok: false,
                    response_code: error.status || 500,
                    message: 'Errore caricamento notifiche'
                } as ResponseDTO<Notifica[]>);
            })
        );
    }

    /**
     * Ottiene il conteggio delle notifiche non lette
     */
    getConteggioNonLette(): Observable<ResponseDTO<number>> {
        return this.http.get<ResponseDTO<number>>(`${this.baseUrl}/conteggio-non-lette`);
    }

    /**
     * Marca una notifica come letta
     */
    marcaComeLetta(notificaId: number): Observable<ResponseDTO<void>> {
        return this.http.put<ResponseDTO<void>>(
            `${this.baseUrl}/${notificaId}/letta`,
            {}
        ).pipe(
            tap(() => {
                // Aggiorna i signal localmente
                this.notificheNonLette.update(notifiche =>
                    notifiche.filter(n => n.id !== notificaId)
                );
                this.conteggioNonLette.update(count => Math.max(0, count - 1));
            }),
            catchError(error => {
                console.error('Errore marca come letta:', error);
                throw error;
            })
        );
    }

    /**
     * Marca tutte le notifiche come lette
     */
    marcaTutteComeLette(): Observable<ResponseDTO<void>> {
        return this.http.put<ResponseDTO<void>>(
            `${this.baseUrl}/marca-tutte-lette`,
            {}
        ).pipe(
            tap(() => {
                // Reset dei signal
                this.notificheNonLette.set([]);
                this.conteggioNonLette.set(0);
            }),
            catchError(error => {
                console.error('Errore marca tutte come lette:', error);
                throw error;
            })
        );
    }

    /**
     * Elimina una notifica
     */
    eliminaNotifica(notificaId: number): Observable<ResponseDTO<void>> {
        return this.http.delete<ResponseDTO<void>>(`${this.baseUrl}/${notificaId}`).pipe(
            catchError(error => {
                console.error('Errore eliminazione notifica:', error);
                throw error;
            })
        );
    }

    /**
     * Forza il refresh delle notifiche
     */
    refreshNotifiche(): void {
        this.loadNotificheNonLette().subscribe();
    }
}