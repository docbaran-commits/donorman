# App Store package for DonorMan

Everything you need to finish the App Store Connect listing for the TestFlight build.

Apple ID (Connect): **6829261100** · Bundle ID: **`com.docbaran.donorman`**

## Folder map

| Path | Use |
| --- | --- |
| `LISTING.md` | Subtitle, description, keywords, review notes, URLs — paste into Connect |
| `PRIVACY.md` | Privacy policy source (also published at `/privacy/` on GitHub Pages) |
| `icon/AppIcon-1024.png` | 1024×1024 App Store icon (no alpha) |
| `screenshots/iphone-6.7/` | **Required** iPhone 6.7" (1290×2796) — upload these first |
| `screenshots/iphone-6.5/` | iPhone 6.5" (1242×2688) |
| `screenshots/ipad-12.9/` | iPad 12.9" / 13" (2048×2732) |
| `screenshots/marketing/` | Optional framed versions (same pixel sizes) for ads / social |

## Upload checklist (App Store Connect)

1. Open **Apps → DonorMan → App Store → iOS App → 1.0 Prepare for Submission** (or create version 1.0).
2. **Screenshots**
   - iPhone 6.7": upload `screenshots/iphone-6.7/01` → `02` → `03` in that order.
   - iPhone 6.5": upload the matching trio from `screenshots/iphone-6.5/`.
   - iPad 12.9": upload `screenshots/ipad-12.9/01-phm-matching.png`.
   - Prefer the **non-framed** folders for Connect; keep `marketing/` for other use.
3. **Description fields** — copy from `LISTING.md` (subtitle, promotional text, description, keywords, What’s New).
4. **URLs**
   - Support: `https://docbaran-commits.github.io/donorman/`
   - Privacy Policy: `https://docbaran-commits.github.io/donorman/privacy/`
   - (Optional) Marketing: same as Support.
5. **App Privacy** (App Store → App Privacy → Edit): choose **Data Not Collected**.
6. **Age Rating**: answer the questionnaire; for “Medical/Treatment Information” select the mild/infrequent option if asked.
7. **Export compliance**: already declared in the app (`ITSAppUsesNonExemptEncryption = false`). Confirm “No” for non-exempt encryption if Connect asks again.
8. **Build**: select the Codemagic / TestFlight build that processed successfully.
9. **App Review notes**: paste the block from `LISTING.md`.
10. Submit for review.

## Privacy URL go-live

The privacy page ships with this PR as:

- Source: `src/app/privacy/page.tsx`
- Published: `docs/privacy/` on `main` → [https://docbaran-commits.github.io/donorman/privacy/](https://docbaran-commits.github.io/donorman/privacy/)

Merge this PR (or at least publish `docs/privacy/`) **before** submitting for App Review so Apple can open the Privacy Policy URL.

## Screenshot map

| File | Story |
| --- | --- |
| `01-phm-matching.png` | Default demo — PHM 0.72, caution undersized |
| `02-size-ok.png` | Size OK band (~0.88) |
| `03-caution.png` | Severe undersize (~0.52) |

## After merge

No Codemagic rebuild is required for listing assets. Only merge + (if needed) wait for GitHub Pages to update the privacy URL, then finish the Connect form and submit.
