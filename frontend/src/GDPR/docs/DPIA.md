# Posouzení vlivu na ochranu osobních údajů (DPIA)

**Správce:** Omega-Aurora s.r.o.  
**Datum:** 2025-10-22  
**Zpracování:** SaaS platforma Ω Aurora Codex MVP  
**Kontakt:** privacy@quantum-codex.com

## 1. Popis zpracování
Aplikace zpracovává osobní údaje uživatelů (e-mail, jméno, aktivita, transakce) za účelem poskytování služby, správy účtů, analytiky a marketingu (opt-in). Data jsou ukládána v MongoDB, přístup přes FastAPI backend, autentizace přes Google OAuth, generování promptů přes OpenAI API.

## 2. Posouzení nezbytnosti a přiměřenosti
Zpracování je nezbytné pro poskytování služby (plnění smlouvy, Art. 6(1)(b) GDPR), analytika a administrace jsou v oprávněném zájmu správce (Art. 6(1)(f)), marketing pouze na základě souhlasu (Art. 6(1)(a)). Rozsah údajů je omezen na minimum potřebné pro provoz.

## 3. Identifikace a posouzení rizik
- Neoprávněný přístup k účtům (riziko: střední)
- Únik dat z cloudového úložiště (riziko: střední)
- Zneužití API klíčů (riziko: nízké)
- Chyby v implementaci souhlasů (riziko: nízké)
- Přenos dat do třetích zemí (OpenAI, riziko: nízké, SCC)

## 4. Opatření ke zmírnění rizik
- Šifrování dat v klidu i přenosu (Art. 32 GDPR)
- RBAC, audit logy, pravidelné revize přístupů
- Pseudonymizace a minimalizace dat
- Pravidelné penetrační testy a školení adminů
- Smluvní zajištění SCC pro OpenAI

## 5. Závěr
Na základě analýzy není zpracování vysoce rizikové pro práva a svobody subjektů údajů. DPIA není povinná dle Art. 35 GDPR, ale doporučujeme pravidelně přehodnocovat při rozšíření funkcí (profilování, biometrie apod.).

---

**Právní základ:** Art. 35 GDPR, metodika ÚOOÚ.
