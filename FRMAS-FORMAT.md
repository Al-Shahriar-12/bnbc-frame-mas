# The .frmas file format (schema 1)

A `.frmas` file is UTF-8 JSON with the MAS header shared by MAS Studio apps. Values are stored in base SI units whatever units the author was viewing, so a file opens identically everywhere.

## Header

| Field | Value |
| --- | --- |
| `format` | Always `"MAS"` |
| `app` | `"frame"` for Frame MAS files (`"flexure"` is Flexure MAS) |
| `appName`, `studio` | `"Frame MAS"`, `"MAS Studio"` |
| `kind` | `"frame2d"` |
| `schema` | `1`. Readers refuse files with a higher schema |
| `savedAt` | ISO 8601 time the file was written |
| `units.base` | Always `"SI-kN-m"` in schema 1 |
| `units.display` | `kN-m`, `N-mm`, `kip-ft`, `kip-in` or `lb-ft` |
| `project.title` | Project name |
| `settings.resultKey` | Result shown: `case:<id>`, `combo:<id>` or `env` |
| `settings.display` | `model`, `deformed`, `N`, `V`, `M` or `R` |

## Model (`model`)

**`grid`**: `{ "xs": [{ "label": "A", "x": 0 }], "ys": [{ "label": "Base", "y": 0 }], "snap": 0.5 }`, positions in m.

**`materials[]`**: `{ "id", "name", "E" (GPa), "nu", "rho" (kg/m³) }`.

**`sections[]`**: `{ "id", "name", "type", "material", ... }` where `type` is `I` (`d`, `bf`, `tf`, `tw` in mm), `rect` (`b`, `h`), `circle` (`D`), `pipe` (`D`, `t`) or `custom` (`A` in mm², `Iz` in 10⁶ mm⁴, `depth`, `width` in mm). Frame MAS bends members about the section’s strong axis.

**`nodes[]`**: `{ "id", "x", "y" (m), "support" }`, support one of `free`, `fixed`, `pin`, `rollerX` (slides along X), `rollerY` (slides along Y), `guidedX`, `guidedY`.

**`members[]`**: `{ "id", "i", "j" (node ids), "section", "releaseI", "releaseJ", "truss" }`. A release is a hinge at that end; a truss member is hinged at both ends.

**`cases[]`**: `{ "id", "name", "type", "selfWeight" }`, type one of `dead` (D), `live` (L), `roof` (Lr), `rain` (R), `snow` (S), `wind` (W), `quake` (E), `fluid` (F), `soil` (H) or `other`. The type decides how generated design combinations treat the case.

**`combos[]`**: `{ "id", "name", "factors": { "<case id>": factor } }`.

**`loads[]`**: every load names its `case` and is one of:

| `on` | Fields |
| --- | --- |
| `node` | `node`, `Fx`, `Fy` (kN), `Mz` (kN·m, anticlockwise positive) |
| `member`, `type: "dist"` | `member`, `dir`, `w1`, `w2` (kN/m), `full` (true for the whole length) or `x1`, `x2` (m from the start joint) |
| `member`, `type: "point"` | `member`, `dir`, `P` (kN), `a` (m from the start joint) |

`dir` is `gravity` (−Y), `up` (+Y), `px` (+X), `nx` (−X), `lneg` (normal, local −y) or `lpos` (normal, local +y). Local x runs from joint `i` to joint `j`; local +y is 90° anticlockwise from it.

## BNBC block (`bnbc`, BNBC Frame MAS only)

BNBC Frame MAS adds a top-level `bnbc` object holding the Building inputs, so a project reopens exactly. Frame MAS ignores it and opens the frame as usual. All values are SI.

| Field | Contents |
| --- | --- |
| `project` | `name`, `engineer` |
| `site` | `mode` (`spt` or `class`), `cls` (SA–SE when given), `dz` (reading interval, m), `bh[]` = `{ name, N[] }` with `""` for a missing reading |
| `bld` | `location`, `zone` (1–4), `occ` (I–IV), `system` (Table 6.2.19 key, e.g. `imrf`, `smrf`), `ct`, `xi` (%), `Tuser`, `LY`, `trib` (m), `base`, `bays` (text, m), `fc` (MPa), `gamma` (kN/m³), `storeys[]` = `{ name, h, cb, ch, bb, bh }` (m, mm), bottom to top |
| `grav` | `slab` (mm), `ff`, `part` (kN/m²), `partAs` (`dead` or `live`), `wall`, `parapet` (kN/m), `live`, `roofLive` (kN/m²) |
| `wind` | `on`, `exposure` (A–C), `Vuser`, `Kzt`, `Kd`, `beta` (%) |
| `eq`, `combo`, `drift`, `stiffness` | `eq.on`; `combo.irregV`; `drift.type`; `ultimate` or `service` |
| `built`, `frameSig` | Fingerprints used to tell when the frame no longer matches the inputs |
