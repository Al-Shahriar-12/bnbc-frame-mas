# Checks

Both scripts read the code straight out of `../index.html`. With Node.js 18 or newer, run them from the repository folder:

```bash
node tests/verify.js
node tests/bnbc.js
```

- `verify.js`: 27 frame-solver checks against hand calculations.
- `bnbc.js`: 41 BNBC 2020 checks against Design Assistant BNBC 2020 v3.12 recalculated with real inputs, the CE 410 worked example and the code tables.

Each prints PASS or FAIL per check and ends with ALL PASSED.
