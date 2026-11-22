# h-gate-frontend
Interfaccia utente (UI) sviluppata con Angular per consumare i servizi esposti da H-Gate-API. Il suo obiettivo è fornire al Paziente/Operatore Sanitario un accesso intuitivo, reattivo e sicuro alle funzionalità core dell'applicazione.

## Test

```bash
cd webapp-h-gate
npx ng test --watch=false --browsers=ChromeHeadless
```

I provider comuni per i test (HTTP finto, router, dialog) sono in `src/testing/test-providers.ts`.
