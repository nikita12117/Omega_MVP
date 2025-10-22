# Implementační manuál GDPR pro SaaS platformu Ω Aurora Codex

## 1. Frontend (React)
- Implementuj cookie banner s granularními toggly (nezbytné, analytické, marketingové).
- Ukládej consent do localStorage (`localStorage.setItem('consent', ...)`).
- Před inicializací analytických/marketingových skriptů ověř consent.
- Zobraz odkazy na Privacy Policy a DSAR kontakt v UI (footer, profil).
- Umožni uživateli kdykoliv změnit nebo odvolat souhlas (nastavení účtu).

## 2. Backend (FastAPI)
- Loguj všechny přístupy k osobním údajům (audit trail).
- Implementuj endpointy pro export a výmaz údajů na žádost uživatele (Art. 15, 17 GDPR).
- Nastav automatizované skripty pro retenci a mazání dat dle RoPA (např. cron job pro anonymizaci starých transakcí).
- Pseudonymizuj citlivé údaje v logu a analytice.
- Ukládej všechny časy v UTC (dle architektury).

## 3. Migrace a retence
- Při migraci dat vždy exportuj pouze nezbytné údaje (data minimization).
- Před importem do nového systému proveď anonymizaci testovacích dat.
- Nastav pravidla pro automatické mazání neaktivních účtů a transakcí po uplynutí retence.

## 4. Logging & monitoring
- Aktivuj SIEM nebo alespoň centralizované logování (např. ELK stack).
- Pravidelně kontroluj logy na podezřelé aktivity (automatizované alerty).
- Uchovávej logy min. 1 rok, poté anonymizuj nebo smaž.

## 5. Minimalizace a privacy by design
- Sbírej pouze údaje nezbytné pro provoz (e-mail, jméno, transakce).
- Pravidelně reviduj datové toky a třetí strany (OpenAI, Google).
- Umožni uživatelům snadno uplatnit svá práva (DSAR formulář, e-mail).

## 6. QA a testování
- Otestuj všechny DSAR endpointy (přístup, výmaz, export).
- Proveď penetrační testy (min. 1× ročně).
- Ověř funkčnost cookie banneru a správné blokování skriptů bez souhlasu.

---

**Právní základ:** GDPR Art. 5, 6, 15–22, 25, 32, EDPB guidelines.
