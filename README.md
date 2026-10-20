<p align="center"><img src="icon-192.png" width="96" alt="BNBC Frame MAS"></p>

<h1 align="center">BNBC Frame MAS</h1>

<p align="center"><b>A free BNBC 2020 frame design assistant for engineering students in Bangladesh.</b><br>
Site class from SPT, the equivalent static earthquake force, the analytical wind procedure, load combinations by seismic design category, plane-frame analysis with cracked-section stiffness, and drift, P-Delta, soft-storey, sway and deflection checks, in one guided workflow.</p>

<p align="center">
  <a href="https://al-shahriar-12.github.io/bnbc-frame-mas/"><b>Open BNBC Frame MAS</b></a> ·
  <a href="#how-to-use">How to use</a> ·
  <a href="#how-accurate-is-it">Accuracy</a> ·
  <a href="EXCEL-AUDIT.md">Excel audit</a> ·
  <a href="#author">Author</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/code-BNBC%202020-006A4E" alt="BNBC 2020">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License">
  <img src="https://img.shields.io/badge/works-offline-orange" alt="Works offline">
</p>

<p align="center">
  <img src="screenshots/screenshot-1-earthquake.png" width="220" alt="Earthquake step: base shear and every term of the calculation">
  <img src="screenshots/screenshot-2-wind.png" width="220" alt="Wind step: pressure profile and floor forces">
  <img src="screenshots/screenshot-3-checks.png" width="220" alt="Checks: earthquake drift, P-Delta, soft storey, wind drift, sway and deflection">
  <img src="screenshots/screenshot-4-frame.png" width="220" alt="Frame: bending moment under the seismic combination">
</p>

## What it does

The **Building** page walks through six steps and shows results live as you type:

1. **Project and site:** enter SPT readings for any number of boreholes, or paste them from Excel. N̄ = Σdᵢ/Σ(dᵢ/Nᵢ) over the top 30 m gives the site class (Table 6.2.13), with warnings for incomplete boreholes.
2. **Building and frame:** location (all 74 basic wind speeds of Table 6.2.8), seismic zone, occupancy, structural system (R, Ω₀, Cd and height limits of Table 6.2.19), bays, storeys, and column and beam sizes per storey.
3. **Gravity loads:** slab, floor finish, partitions (dead, or live per Sec 2.3.6), live loads from Table 6.2.3, walls and parapets. Gives beam loads and the seismic weight of each level (Sec 2.5.7.3).
4. **Earthquake:** T = Ct·hₙᵐ, Cs, Sa = (2/3)(ZI/R)Cs with its minimum, V = SaW, the exponent k, the storey forces, the SDC, the vertical-effect factor λ, and the response-spectrum table and scale factor for ETABS.
5. **Wind:** Kz, qz, the rigid or flexible gust factor with every term, Cp, the pressure profile and the floor forces on the frame.
6. **Combinations and build:** the BNBC 2020 strength and serviceability combinations for the SDC, then one button builds the frame model.

After building:

- **Frame, 3D and Summary:** moment, shear and axial diagrams, deflections and reactions under every load case and combination, with ultimate stiffness (beams 0.35, columns 0.70 EcIg) or service stiffness (beams 0.50, columns 1.00 EcIg).
- **Checks:** earthquake storey drift, P-Delta stability, soft storey, wind storey drift, sway (H/500), beam deflection (L/360, L/240), a Rayleigh period, and a torsional-irregularity calculator for 3D models.
- **Report:** a printable summary of every input, calculation and check.

## How to use

1. Open **https://al-shahriar-12.github.io/bnbc-frame-mas/** on a phone or computer.
2. Work through the six steps of **Building**. The right-hand panel shows the key results at all times.
3. Tap **Build frame**, then read the diagrams in **Frame** and the verdicts in **Checks**.
4. Open **Report** and print or save it as a PDF. Save the project with **Model → Project → Save .frmas**.

Two ready projects are in [`examples/`](examples): a six-storey IMRF in Dhaka (SDC C) and a ten-storey SMRF in Sylhet (SDC D). Both pass every check.

**Install it as an app:** on Android, open the site in Chrome and choose **Install app**. On iPhone, use Safari → Share → **Add to Home Screen**.

## How accurate is it?

The calculations started from **Design Assistant BNBC 2020 v3.12** and were checked three ways:

- **Against the workbook itself.** Copies were filled with real inputs and recalculated. For a rigid building, wind pressures, forces, the gust factors and the earthquake period, Sa and k match to about 10⁻¹⁵. The only differences are where the workbook has errors.
- **Against the CE 410 worked example** (Prof. Tahsin R. Hossain's notes, demo building by Prof. Khan Mahmud Amanat). With the notes' inputs, the base shear is 152.52 kip and the storey forces match an independent calculation exactly.
- **Against independent solvers.** The frame solver agrees with a separate Python solver to about 10⁻¹². Every check (drift, θ, stiffness ratios, sway) was recomputed independently to 10⁻¹⁵.

[EXCEL-AUDIT.md](EXCEL-AUDIT.md) lists the six errors found in the workbook and how this app corrects them. [verification.png](verification.png) plots the comparisons.

Run the checks yourself with Node.js:

```bash
node tests/verify.js    # 27 frame-solver checks against hand calculations
node tests/bnbc.js      # 41 BNBC checks against the workbook, the worked example and the code
```

Assumptions: linear elastic plane frames, small displacements, no shear deformation, and storey forces shared between the joints of each level. Use the app for learning and checking; confirm design work with BNBC 2020 and a qualified engineer.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | The whole app: BNBC engine, frame solver, interface, charts, 3D view, report |
| `three.min.js` | three.js r128 for the 3D view (MIT licence) |
| `manifest.webmanifest`, `sw.js`, icons | Installable app and offline use |
| `og-image.png`, `sitemap.xml` | Link previews and Google indexing |
| `EXCEL-AUDIT.md`, `verification.png` | The workbook audit and the comparison plots |
| `FRMAS-FORMAT.md` | The `.frmas` project file, including the `bnbc` block |
| `examples/`, `screenshots/`, `tests/` | Example projects, README pictures, test scripts |

## Licence

MIT: use, copy, change and share it freely, including in courses. three.js is MIT-licensed; the Barlow fonts in `index.html` use the SIL Open Font License ([OFL.txt](OFL.txt)).

## Also from MAS Studio

- **[Frame MAS](https://al-shahriar-12.github.io/frame-mas/)**: general 2D frame and truss analysis on an ETABS-style grid.
- **[Flexure MAS](https://al-shahriar-12.github.io/flexure-mas/)**: beam analysis with shear force, bending moment and deflection diagrams.

## Author

<img src="author.jpg" width="120" align="left" alt="MD Al Shahriar" style="border-radius:50%;margin-right:16px">

**MD Al Shahriar**<br>
BSc. in Civil Engineering, Bangladesh University of Engineering and Technology (BUET)<br>
MAS Studio · GitHub: [@Al-Shahriar-12](https://github.com/Al-Shahriar-12)

<br clear="left">

References: BNBC 2020 Part 6; CE 410 lecture notes by Prof. Tahsin R. Hossain and Prof. Khan Mahmud Amanat, BUET; Design Assistant BNBC 2020 v3.12. If this app helped you, please remember its author in your duas.
