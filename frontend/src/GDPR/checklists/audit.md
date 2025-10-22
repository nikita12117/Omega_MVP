# GDPR Audit Checklist & QA pro SaaS platformu

## 1. Data audit
- [ ] Je aktuální RoPA (evidence zpracování) včetně všech účelů, kategorií dat, subjektů, právních základů?
- [ ] Jsou všechny datové toky a třetí strany zmapovány?
- [ ] Je provedena DPIA pro rizikové zpracování?

## 2. Privacy Policy & informování
- [ ] Je Privacy Policy zveřejněna v CZ/EN na webu?
- [ ] Jsou uživatelé informováni o svých právech (Art. 15–22 GDPR)?
- [ ] Je kontakt na DPO snadno dostupný?

## 3. Consent & cookies
- [ ] Funguje cookie banner s granularními toggly?
- [ ] Je souhlas správně ukládán a respektován (blokace skriptů)?
- [ ] Je možné souhlas kdykoliv odvolat?

## 4. Data Subject Rights (DSAR)
- [ ] Fungují endpointy pro přístup, výmaz, export údajů?
- [ ] Je workflow pro DSAR v souladu se SLA (30/60 dní)?
- [ ] Je evidence žádostí vedena?

## 5. DPA & třetí strany
- [ ] Jsou uzavřeny DPA se všemi procesory?
- [ ] Jsou sub-procesory schváleni a smluvně ošetřeni?
- [ ] Jsou mezinárodní přenosy pokryty SCC/adequacy?

## 6. Security & TOM
- [ ] Je aktivní šifrování dat v klidu i přenosu?
- [ ] Funguje RBAC, audit logy, MFA pro adminy?
- [ ] Probíhají pravidelné pen-testy a revize přístupů?
- [ ] Je aktivní SIEM/logování a alerting?

## 7. Breach response
- [ ] Je breach response plán aktuální a testovaný?
- [ ] Je evidence incidentů vedena?
- [ ] Proběhla notifikace ÚOOÚ/subjektům v případě incidentu?

## 8. QA testy
- [ ] Otestovány všechny DSAR endpointy (přístup, výmaz, export)?
- [ ] Ověřena funkčnost cookie banneru a blokace skriptů?
- [ ] Proveden audit třetích stran a smluv?

---

**Právní základ:** GDPR Art. 5, 6, 15–22, 28, 30, 32, 33–34, EDPB guidelines[web:101][web:111][web:112][web:115][web:117].
