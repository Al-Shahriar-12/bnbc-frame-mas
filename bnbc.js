/*
 * BNBC Frame MAS: checks of the BNBC 2020 engine inside index.html.
 * Reference values come from Design Assistant BNBC 2020 v3.12 recalculated with
 * real inputs, from the CE 410 worked example (Prof. Tahsin R. Hossain's notes,
 * slides 46–49), and from the code tables. Usage:  node tests/bnbc.js
 */
"use strict";
const fs = require("fs"), path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const a = html.indexOf("/* ================= BNBC 2020 tables"), b = html.indexOf("/* ================= Helpers");
if (a < 0 || b < 0) { console.error("BNBC engine not found in index.html"); process.exit(1); }
const { BC, BN } = new Function(html.slice(a, b).replace(/if \(typeof module[^\n]*/, "") + "\nreturn { BC, BN };")();
let fails = 0;
const check = (label, got, exp, tol) => { const ok = Math.abs(got - exp) <= tol; if (!ok) fails++; console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${+got.toFixed(6)} (expected ${exp})`); };
const same = (label, got, exp) => { const ok = got === exp; if (!ok) fails++; console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${got} (expected ${exp})`); };

console.log("— Equivalent static force: CE 410 demo building (kip, ft), the notes' rounded inputs");
const lv = [[0, 3.77], [5, 328.91], [15, 332.68], [25, 332.68], [35, 332.68], [45, 332.68], [55, 325.14]].map(([h, w]) => ({ h, w }));
let r = BC.eqStatic({ zone: 2, occ: "II", site: "SC", system: "imrf", R: (2 / 3) * 0.2 * 2.875 / 0.0767, xi: 5, T: 0.589, levels: lv });
check("W (kip)", r.W, 1988.54, 1e-9); check("V = 0.0767 W (kip)", r.V, 152.521018, 1e-6); check("k", r.k, 1.0445, 1e-12);
check("Roof force (kip)", r.F[6], 46.743, 0.001); check("GF force (kip)", r.F[1], 3.864, 0.001);
r = BC.eqStatic({ zone: 2, occ: "II", site: "SC", system: "imrf", xi: 5, T: 0.0466 * Math.pow(55 / 3.28, 0.9), levels: lv });
check("T = 0.0466(55/3.28)^0.9 (s)", r.T, 0.589, 0.0005); check("Cs", r.Cs, 2.875, 1e-12); check("Sa", r.Sa, 0.0767, 0.00005); check("Sa minimum 0.67βZIS", r.SaMin, 0.016951, 1e-6); same("SDC", r.sdc, "C");

console.log("\n— Excel EQ Static sheet, recalculated: SD, zone 2, occupancy II, R = 5, hn = 16 m");
r = BC.eqStatic({ zone: 2, occ: "II", site: "SD", system: "imrf", xi: 5, levels: [3.2, 6.4, 9.6, 12.8, 16].map(h => ({ h, w: 1 })) });
check("T (s)", r.T, 0.565059135995077, 1e-12); check("Sa", r.Sa, 0.09, 1e-12); check("k", r.k, 1.03252956799754, 1e-12); same("SDC", r.sdc, "D");

console.log("\n— Excel Wind sheet, recalculated: 30 × 20 m, 5 × 3.2 m, Dhaka, exposure B, I = 1");
const w = BC.wind({ V: 65.7, occ: "II", exposure: "B", LX: 30, LY: 20, levels: [3.2, 6.4, 9.6, 12.8, 16], T: BC.period("concrete", 16), beta: 0.02 });
check("qh (kN/m²)", w.qh, 2.48535, 0.00001); check("Gx", w.X.G, 0.871563769034802, 1e-12); check("Gy", w.Y.G, 0.864213217591375, 1e-12);
check("Cp leeward X (L/B = 1.5)", w.X.cpl, 0.4, 1e-12); check("Cp leeward Y (L/B = 0.667)", w.Y.cpl, 0.5, 1e-12);
check("Y leeward pressure uses Gy: qh·Gy·0.5", w.Y.floors[4].pl, w.qh * 0.864213217591375 * 0.5, 1e-12);

console.log("\n— Spectrum (Table 6.2.16), 5 % damping");
check("SE at T = 0.15 s (TB = 0.15 s)", BC.Cs(0.15, "SE"), 3.5, 1e-12); check("SE at T = 0.05 s", BC.Cs(0.05, "SE"), 2.1, 1e-12);
check("SC at T = TC exactly", BC.Cs(0.6, "SC"), 2.875, 1e-12); check("SD at T = 3 s", BC.Cs(3, "SD"), 2.5 * 1.35 * 0.8 * 2 / 9, 1e-12); check("η at 2 % damping", BC.eta(2), Math.sqrt(10 / 7), 1e-12);

console.log("\n— Site class from SPT (the Excel file's boreholes)");
check("BH-1, complete record", BC.boreholeN([1, 2, 12, 8, 6, 14, 17, 21, 23, 24, 38, 37, 45, 50, 50, 50, 50, 50, 50, 50], 1.5).N, 8.497688851650942, 1e-9);
const bh4 = BC.boreholeN([2, 2, 11, 9, 7, 8, 14, 18, 20, 22, 22, 23, 30, 42, "", "", "", "", "", ""], 1.5);
check("BH-4, readings to 21 m only (blank layers skipped)", bh4.N, 7.62, 0.005); check("BH-4 coverage (m)", bh4.cover, 21, 1e-12);
same("Class at N̄ = 14.99", BC.classFromN(14.99), "SD"); same("Class at N̄ = 15", BC.classFromN(15), "SC"); same("Class at N̄ = 50.1", BC.classFromN(50.1), "SB");

console.log("\n— Load combinations (Sec 2.7.3, 2.7.5)");
const c = BC.combos("C", 0.0767, true, true);
same("Number of combinations", c.length, 17);
same("Seismic gravity combination", c.find(x => x.factors.E === 1 && x.factors.L === 1).name, "1.277D + 1.0L + E");
same("Seismic uplift combination", c.find(x => x.factors.E === 1 && !x.factors.L).name, "0.823D + E");
same("Service wind combination", c.filter(x => x.kind === "service").map(x => x.name).join(" | "), "D + L (service) | D + 0.5L (service, long term) | D + 0.5L + 0.7W (service) | D + 0.5L − 0.7W (service)");

console.log("\n— Checks: drift, P-Delta, soft storey");
const ck = BC.checks({ lv: [{ name: "1F", h: 3.5, z: 3.5 }, { name: "2F", h: 3.2, z: 6.7 }], dE: [0.004, 0.009], dW: [0.002, 0.005], V: [300, 200], P: [5000, 2500], Cd: 4.5, Ie: 1, occ: "II", driftType: "other", T: 0.6 });
check("Δ, storey 1 = Cd·δ/I (m)", ck.rows[0].Dx, 0.018, 1e-12); check("Δa, storey 1 = 0.020·hsx (m)", ck.rows[0].Da, 0.07, 1e-12);
check("θ, storey 1 = PΔ/(V·h·Cd)", ck.rows[0].th, 5000 * 0.018 / (300 * 3.5 * 4.5), 1e-12); check("θmax = 0.5/Cd", ck.thMax, 0.5 / 4.5, 1e-12);
check("K ratio, storey 1 / storey 2", ck.rows[0].k1, (300 / 0.004) / (200 / 0.005), 1e-12); check("Sway limit H/500 (m)", ck.swayLim, 6.7 / 500, 1e-12);

console.log(`\n${fails ? fails + " FAILED" : "ALL PASSED"}`);
process.exit(fails ? 1 : 0);
