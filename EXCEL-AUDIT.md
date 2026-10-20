# Audit of Design Assistant BNBC 2020 v3.12

Every sheet of the workbook was read formula by formula, its tables were compared with BNBC 2020 as reproduced in the BUET CE 410 notes, and copies were recalculated with real inputs in LibreOffice. Six errors were found. BNBC Frame MAS corrects all of them; everything else in the workbook was confirmed.

| # | Sheet | Error | Effect | Correction in the app |
| --- | --- | --- | --- | --- |
| 1 | Site Classification | A blank SPT reading gives dᵢ/Nᵢ = 0 through `IFERROR(...,0)`, while Σdᵢ stays 30 m | Blank layers count as infinitely strong soil. In the workbook's data, BH-4 (readings only to 21 m) shows N̄ = 10.88 instead of 7.62 (43 % high); BH-5 to BH-7 are 11 % high | Layers without a reading are skipped; incomplete boreholes are flagged |
| 2 | Site Classification | The site mean divides by the number of boreholes entered (10), not those with data (7) | Mean N̄ 9.87 instead of 14.09 (12.68 after correction 1) | The mean uses only boreholes with data |
| 3 | Response Spectrum | The SE column uses TB = 0.20 s; Table 6.2.16 (and the workbook's own EQ Static table) gives 0.15 s | Of 405 tabulated values, the 3 SE values at T = 0.05, 0.10, 0.15 s are 8.3 %, 12.5 % and 15.0 % low | TB = 0.15 s for SE |
| 4 | EQ Static | The four spectrum branches are joined as text with `&` | At T exactly equal to TB, TC or TD two branches are true and Sa becomes blank; nothing is returned for T > 4 s | Exact branch boundaries, any period |
| 5 | Wind | Y-direction leeward pressure (`BG38`, `AY38`) uses `$AT$23` (Gx) instead of `$AT$24` (Gy) | Y leeward pressure 0.84 % off for a rigid test building and 2.9 % for a flexible one | Gy for the Y direction |
| 6 | Wind | The resonant factor uses Rn = 7.4·N₁/(1 + 10.3N₁)^(5/3); BNBC uses 7.47 | Rn 0.95 % low for flexible buildings (G about 0.1 % low) | 7.47 |

Smaller points that are not errors: several `ROUNDUP`s are slightly conservative (Cs, λ, reported pressures), and the area conversion uses 3.28² instead of 3.2808².

## Confirmed correct

The site-factor, zone, importance, SDC, Ct/m and exposure tables; T = Ct·hₙᵐ; η = √(10/(5+ξ)) ≥ 0.55; Sa = (2/3)(ZI/R)Cs ≥ 0.67βZIS; k; Ev = 0.5·aₕ·D with aₕ = (2/3)ZS; Kz, qz, Iz̄, Lz̄, Q and the rigid and flexible gust factors; leeward Cp interpolation; the combinations expanded by SDC; the P-Delta stability coefficient; the soft-storey ratios; the earthquake and wind drift limits; and the H/500 sway limit.

## How the comparison was done

- Inputs were written into copies of the workbook and recalculated with LibreOffice, then every unrounded intermediate column was compared with BNBC Frame MAS. The `tests/bnbc.js` script keeps the key reference values.
- The 405 spectrum cells were checked one by one against the code formula.
- The CE 410 demo-building example was reproduced, and its small differences were traced to hand rounding in the notes.
