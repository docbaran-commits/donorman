# DonorMan

Phone-first predicted heart mass (PHM) matching for adult heart transplant sizing.

Enter **recipient** and **donor** sex, age, height, and weight. Height and weight units are independent — for example feet/inches with kilograms, or centimeters with pounds.

## What it shows

- Predicted heart mass (LV + RV) for each person
- BMI for each person
- Donor ÷ recipient PHM ratio
- Percent difference vs recipient (UNOS online calculator convention)

Formulas follow the adult MESA-based equations used by UNOS / ISHLT PHM calculators. Validated for adults only.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43210](http://127.0.0.1:43210).

## GitHub Pages

Pushing `main` runs `.github/workflows/pages.yml`.

Site: [https://docbaran-commits.github.io/donorman/](https://docbaran-commits.github.io/donorman/)

## Put it on your iPhone

1. Open the site in **Safari**
2. Share → **Add to Home Screen**

## Scripts

- `npm run dev` — local app on port 43210
- `npm run test` — PHM / unit checks
- `npm run lint` — lint
- `npm run build` — static export
