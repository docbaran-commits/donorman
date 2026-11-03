# DonorMan — App Store Connect listing copy

Paste these fields into **App Store Connect → DonorMan → App Store → iOS App**.

## App information

| Field | Value |
| --- | --- |
| Name | DonorMan |
| Subtitle (≤30 chars) | Heart transplant size match |
| Bundle ID | `com.docbaran.donorman` |
| SKU (if needed) | `donorman-ios` |
| Primary category | Medical |
| Secondary category | Utilities (optional) |

**Subtitle character count:** 28

## Promotional text (≤170 chars, updatable anytime)

```
Fast predicted heart mass (PHM) matching for donor and recipient sizing—BMI, BSA, and caution flags when the graft is undersized or oversized.
```

## Description

```
DonorMan helps transplant clinicians size donor hearts to recipients using predicted heart mass (PHM).

Enter sex, age, height, and weight for the recipient and the donor. Units are independent—use ft/in with kg, or cm with lb, as you prefer.

WHAT YOU SEE
• Predicted heart mass (LV + RV) for recipient and donor
• BMI and body surface area (DuBois) for each person
• Donor ÷ recipient PHM ratio with a clear size band
• Percent difference vs the recipient (UNOS online calculator convention)
• Caution when PHM is undersized (< 0.86) or oversized (> 1.2)

Built for the phone: large controls, side-by-side panels in landscape, and a compact results strip that stays out of the way while you adjust values.

Formulas follow the adult MESA-based equations used by common UNOS / ISHLT PHM calculators.

IMPORTANT
DonorMan is a clinical calculation aid for adult sizing. It is not a substitute for clinical judgment, institutional protocols, or official listing tools. Not validated for pediatric recipients.
```

## Keywords (≤100 characters, comma-separated, no spaces after commas preferred)

```
heart,transplant,PHM,donor,recipient,sizing,BMI,BSA,cardiac,UNOS,ISHLT,mesa
```

**Keyword character count:** 72

## What’s New (1.0)

```
Initial release of DonorMan for iPhone and iPad.

• Predicted heart mass matching for donor and recipient
• BMI and DuBois BSA for each person
• Undersize / oversize caution bands
• Portrait equal panels and landscape side-by-side layout
```

## Support & URLs

Use these until you have custom pages. Privacy Policy is included in this folder and can be published with the GitHub Pages site.

| Field | Suggested value |
| --- | --- |
| Support URL | `https://docbaran-commits.github.io/donorman/` |
| Marketing URL (optional) | `https://docbaran-commits.github.io/donorman/` |
| Privacy Policy URL | `https://docbaran-commits.github.io/donorman/privacy/` |
| Copyright | `© 2026 David Baran` (adjust as needed) |

## Age rating / content

Typical answers for this app:

- No unrestricted web access
- No gambling, contests, or mature themes
- Medical/treatment information: **Yes — infrequent/mild** (clinical calculator)
- No user-generated content, messaging, or location tracking

## App Privacy (nutrition labels)

In **App Store Connect → App Privacy**:

- **Data collection:** Data Not Collected
- No tracking; no linked-to-user data; no used-for-tracking data

Rationale: calculator inputs stay on-device for the session and are not persisted or uploaded.

## Review notes (for App Review)

```
DonorMan is a clinical calculator for adult heart-transplant size matching using predicted heart mass (PHM).

No login. No account. No network calls for calculation—values are computed on device.

To try the app: open it, adjust recipient and donor height/weight with the sliders or number fields, and watch the PHM ratio and caution label update in the header. Landscape shows recipient and donor side by side.

Defaults are male recipient / female donor at 5′7″ and 70 kg (mild undersize caution from sex difference). Increase donor weight to move into the 0.86–1.2 band.
```

## Screenshots to upload

Upload from `screenshots/` in this folder. Match the **Connect tab name**, not the old inch labels.

### iPhone with Dynamic Island (medium display) — **required** — `screenshots/iphone-medium/` (1206×2622)
1. `01-phm-matching.png`
2. `02-size-ok.png`
3. `03-caution.png`

### iPhone with Dynamic Island (large display) — optional — `screenshots/iphone-large/` (1290×2796)
Same three files.

### iPhone with Face ID (large display) — optional — `screenshots/iphone-6.5/` (1242×2688)
Same three files.

### iPad 13" display — **required** — `screenshots/ipad-13/` (2048×2732)
1. `01-phm-matching.png`
2. `02-size-ok.png` (optional)
3. `03-caution.png` (optional)

Do **not** upload `screenshots/marketing/` into Connect (framed marketing art).

## App icon

Upload `icon/AppIcon-1024.png` (1024×1024, no alpha) under **App Store → App Information** if not already provided by the Xcode asset catalog.
