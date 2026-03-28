# H-Gate Web Client

Dashboard reattiva per il personale medico e le famiglie, realizzata con **Angular 17**. Il progetto esplora le ultime innovazioni del framework per massimizzare le performance e la manutenibilità.

## Highlights Tecnologici
* **Reactive State Management:** Implementazione delle nuove **Signal API** per una gestione dello stato granulare e performante.
* **Architecture:** Uso esclusivo di **Standalone Components** per eliminare il sovraccarico dei moduli tradizionali.
* **Type Safety:** Sviluppo integrale in TypeScript con interfacce rigorose per il mapping dei DTO provenienti dal backend.

## Funzionalità Implementate
- Dashboard differenziate in base al ruolo (RBAC - Role Based Access Control).
- Form dinamici per l'inserimento di dati clinici sensibili.
- Interceptor HTTP per la gestione automatizzata del refresh dei token e dell'header Authorization.

## Guida all'avvio
1. Installazione dipendenze:
   ```bash
   npm install
   
## Configurazione
Modificare src/environments/environment.ts inserendo l'URL dell'istanza backend (locale o produzione).

## Avvio in dev mode
Bash
ng serve
