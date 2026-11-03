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
| `header/Header-1920x1080.png` | Promotional / In-App Event style header (icon + name) | 1920 × 1080 | When Connect asks for a header |
| `header/Header-1600x900.png` | Same header, 16:9 alternate | 1600 × 900 | Optional |
| `header/Header-1200x628.png` | Same header, compact / ads style | 1200 × 628 | Optional |
| `LISTING.md` | Listing copy | — | Paste into Connect |
| `PRIVACY.md` | Privacy policy source | — | Live at `/privacy/` |

## Why “file dimensions invalid” happens

App Store Connect’s **required** iPhone slot is now **medium Dynamic Island**, which only accepts:

- `1206 × 2622` or `1179 × 2556` (portrait)

Older **1290 × 2796** (6.7") files are valid only in the **large** Dynamic Island slot — not the medium one. Dropping them on the medium tab produces “file dimensions invalid.”

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
4. **Description fields** — copy from `LISTING.md`.
5. **URLs**
   - Support: `https://docbaran-commits.github.io/donorman/`
   - Privacy Policy: `https://docbaran-commits.github.io/donorman/privacy/`
6. **App Privacy** → **Data Not Collected**.
7. Attach the TestFlight build, paste review notes from `LISTING.md`, submit.

## Screenshot map

| File | Story |
| --- | --- |
| `01-phm-matching.png` | Defaults — both 5′7″ / 70 kg (PHM ~0.85, mild caution) |
| `02-size-ok.png` | Donor heavier — size OK band |
| `03-caution.png` | Clear undersize caution |

## After pulling these files

No Codemagic rebuild is required for listing screenshots. Download/pull this folder and upload the **iphone-medium** set into the medium Dynamic Island tab.
