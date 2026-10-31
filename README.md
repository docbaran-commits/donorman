# DonorMan

Phone-first predicted heart mass (PHM) matching for heart transplant sizing.

Enter **recipient** and **donor** sex, age, height, and weight. Height and weight units are independent — for example feet/inches with kilograms, or centimeters with pounds.

## What it shows

- Predicted heart mass (LV + RV) for each person
- BMI for each person
- Donor ÷ recipient PHM ratio
- Percent difference vs recipient (UNOS online calculator convention)
- Caution labels when PHM is undersized (&lt; 0.86) or oversized (&gt; 1.2)

Formulas follow the adult MESA-based equations used by UNOS / ISHLT PHM calculators.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43210](http://127.0.0.1:43210).

## GitHub Pages (PWA)

Live site: [https://docbaran-commits.github.io/donorman/](https://docbaran-commits.github.io/donorman/)

On iPhone: open in **Safari** → Share → **Add to Home Screen**.

Pages are published from the `docs/` folder on `main`.

## App Store / TestFlight (Codemagic)

DonorMan’s native shell is a Capacitor iOS app (`ios/`) with bundle ID **`com.docbaran.donorman`**.  
`codemagic.yaml` builds that app and uploads the IPA to **TestFlight**.

### One-time Apple + Codemagic setup

1. **App Store Connect**
   - Create a new iOS app with bundle ID `com.docbaran.donorman` and name **DonorMan**.
   - Note the numeric **Apple ID** on the App Information page.
2. **App Store Connect API key**
   - Users and Access → Integrations → App Store Connect API → **+**.
   - Access: **App Manager**. Download the `.p8` once; copy **Issuer ID** and **Key ID**.
3. **Codemagic → Team settings → Integrations → Developer Portal → Manage keys**
   - Add the API key (name it e.g. `Codemagic` — must match `integrations.app_store_connect` in `codemagic.yaml`).
4. **Code signing in Codemagic**
   - Team settings → codemagic.yaml settings → Code signing identities.
   - Generate or upload an **Apple Distribution** certificate.
   - Fetch or create an **App Store** provisioning profile for `com.docbaran.donorman`.
5. **Edit `codemagic.yaml`**
   - Set `APP_STORE_APPLE_ID` to your app’s numeric Apple ID.
   - If your Developer Portal key name is not `Codemagic`, change `integrations.app_store_connect`.
6. **Add the GitHub repo in Codemagic** and run workflow **DonorMan → TestFlight**.

After a green build, the IPA appears in App Store Connect → TestFlight (processing can take a few minutes).

### Local iOS project (Mac + Xcode)

```bash
npm install
npm run build:ios
npx cap open ios
```

## Scripts

- `npm run dev` — local web app on port 43210
- `npm run test` — PHM / unit checks
- `npm run lint` — lint
- `npm run build` — static export (set `NEXT_PUBLIC_BASE_PATH=/donorman` for Pages)
- `npm run build:ios` — static export without basePath + `cap sync ios`
