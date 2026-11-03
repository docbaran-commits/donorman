# App Store package for DonorMan

Everything you need to finish the App Store Connect listing for the TestFlight build.

Apple ID (Connect): **6829261100** · Bundle ID: **`com.docbaran.donorman`**

## Folder map

| Path | Connect slot | Exact size | Required? |
| --- | --- | --- | --- |
| `screenshots/iphone-medium/` | **iPhone with Dynamic Island (medium display)** | **1206 × 2622** | **Yes — upload these first** |
| `screenshots/iphone-large/` | iPhone with Dynamic Island (large display) | 1290 × 2796 | Optional |
| `screenshots/iphone-6.5/` | iPhone with Face ID (large display) | 1242 × 2688 | Optional |
| `screenshots/ipad-13/` | iPad 13" display | 2048 × 2732 | **Yes** (app supports iPad) |
| `screenshots/marketing/` | Not for Connect | various | Ads / social only |
| `icon/AppIcon-1024.png` | App Information icon | 1024 × 1024 | If not already from Xcode |
| `header/Header-3840x1646.png` | **Product page header** (21:9) | **3840 × 1646** | Creative asset |
| `header/Search-3840x2560.png` | **Search results** (3:2) | **3840 × 2560** | Creative asset |
| `header/Search-1920x1280.png` | Search results (3:2 min) | 1920 × 1280 | Alternate |
| `header/Universal-5244x2950.png` | Header **or** search (16:9 universal) | **5244 × 2950 PNG** | One file for both |
| `LISTING.md` | Listing copy | — | Paste into Connect |
| `PRIVACY.md` | Privacy policy source | — | Live at `/privacy/` |

## Header & search results (creative assets)

These go under **Product Page Information → Header and Search Results** (not the Screenshots well).

Apple only accepts these exact sizes ([spec](https://developer.apple.com/help/app-store-connect/reference/app-information/creative-assets-specifications/)):

| Placement | Upload this file |
| --- | --- |
| Header | `header/Header-3840x1646.png` **or** `header/Universal-5244x2950.png` |
| Search results | `header/Search-3840x2560.png` **or** the same universal PNG |

**Fastest path:** upload `Universal-5244x2950.png` as the header, then check **Use header asset in search results**.

Rules that cause “file dimensions invalid”:

- Wrong pixel size (1920×1080 / 1200×628 are **not** accepted for header/search)
- Alpha / transparency (these PNGs are flattened RGB)

## Why screenshot “file dimensions invalid” happens

App Store Connect’s **required** iPhone screenshot slot is **medium Dynamic Island**, which only accepts:

- `1206 × 2622` or `1179 × 2556` (portrait)

Older **1290 × 2796** (6.7") files are valid only in the **large** Dynamic Island slot — not the medium one.

## Upload checklist (App Store Connect)

1. Open **Apps → DonorMan → App Store → iOS App → 1.0 Prepare for Submission**.
2. **Screenshots — iPhone**
   - Open the tab **iPhone with Dynamic Island (medium display)**.
   - Upload, in order, from `screenshots/iphone-medium/`:
     1. `01-phm-matching.png`
     2. `02-size-ok.png`
     3. `03-caution.png`
   - (Optional) Also fill the large / 6.5" tabs from `iphone-large/` and `iphone-6.5/`.
3. **Screenshots — iPad**
   - Open **13" display**.
   - Upload `screenshots/ipad-13/01-phm-matching.png` (and optionally `02` / `03`).
4. **Header and Search Results**
   - Prefer `header/Universal-5244x2950.png`, or upload `Header-3840x1646.png` + `Search-3840x2560.png`.
5. **Description fields** — copy from `LISTING.md`.
6. **URLs**
   - Support: `https://docbaran-commits.github.io/donorman/`
   - Privacy Policy: `https://docbaran-commits.github.io/donorman/privacy/`
7. **App Privacy** → **Data Not Collected**.
8. Attach the TestFlight build, paste review notes from `LISTING.md`, submit.

## Screenshot map

| File | Story |
| --- | --- |
| `01-phm-matching.png` | Defaults — both 5′7″ / 70 kg (PHM ~0.85, mild caution) |
| `02-size-ok.png` | Donor heavier — size OK band |
| `03-caution.png` | Clear undersize caution |

## After pulling these files

No Codemagic rebuild is required for listing screenshots or creative assets. Download/pull this folder and upload into the matching Connect wells.
