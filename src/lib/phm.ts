/** Predicted Heart Mass (adult) — UNOS / ISHLT / MESA-based formulas. */

export type Sex = "female" | "male"
export type HeightUnit = "ftin" | "cm" | "m"
export type WeightUnit = "lb" | "kg"

export type PersonMetrics = {
  sex: Sex
  ageYears: number
  /** Height in meters (canonical). */
  heightM: number
  /** Weight in kilograms (canonical). */
  weightKg: number
}

export type PhmBreakdown = {
  leftVentricularMassG: number
  rightVentricularMassG: number
  predictedHeartMassG: number
  bmi: number
  /** Body surface area in m² (DuBois & DuBois). */
  bsaM2: number
}

export type MatchResult = {
  recipient: PhmBreakdown
  donor: PhmBreakdown
  /** donor PHM / recipient PHM */
  phmRatio: number
  /** ((donor − recipient) / recipient) × 100 — UNOS online calculator convention */
  phmPercentDifference: number
  /** donor BSA / recipient BSA */
  bsaRatio: number
  /** donor BMI / recipient BMI */
  bmiRatio: number
}

const LB_PER_KG = 2.2046226218
const IN_PER_M = 39.37007874

export function kgToLb(kg: number) {
  return kg * LB_PER_KG
}

export function lbToKg(lb: number) {
  return lb / LB_PER_KG
}

export function mToCm(m: number) {
  return m * 100
}

export function cmToM(cm: number) {
  return cm / 100
}

export function mToTotalInches(m: number) {
  return m * IN_PER_M
}

export function totalInchesToM(inches: number) {
  return inches / IN_PER_M
}

export function splitFeetInches(totalInches: number) {
  const clamped = Math.max(0, totalInches)
  let feet = Math.floor(clamped / 12)
  let inches = clamped - feet * 12
  // Keep inches in [0, 12) for display; allow 12.0 only as 1 ft bump when rounding.
  if (inches >= 11.999) {
    feet += 1
    inches = 0
  }
  return { feet, inches }
}

export function combineFeetInches(feet: number, inches: number) {
  return feet * 12 + inches
}

export function bodyMassIndex(heightM: number, weightKg: number) {
  if (heightM <= 0) return NaN
  return weightKg / (heightM * heightM)
}

/**
 * Body surface area (m²) — DuBois & DuBois (1916).
 * BSA = 0.007184 × weight_kg^0.425 × height_cm^0.725
 */
export function bodySurfaceArea(heightM: number, weightKg: number) {
  if (heightM <= 0 || weightKg <= 0) return NaN
  const heightCm = mToCm(heightM)
  return 0.007184 * weightKg ** 0.425 * heightCm ** 0.725
}

/**
 * Left ventricular mass (g) from Bluemke et al. / MESA.
 * Height in meters, weight in kg.
 */
export function leftVentricularMassG(sex: Sex, heightM: number, weightKg: number) {
  const a = sex === "female" ? 6.82 : 8.25
  return a * heightM ** 0.54 * weightKg ** 0.61
}

/**
 * Right ventricular mass (g) from Kawut et al. / MESA-RV.
 * Age in years, height in meters, weight in kg.
 */
export function rightVentricularMassG(
  sex: Sex,
  ageYears: number,
  heightM: number,
  weightKg: number
) {
  const a = sex === "female" ? 10.59 : 11.25
  return a * ageYears ** -0.32 * heightM ** 1.135 * weightKg ** 0.315
}

export function predictedHeartMass(person: PersonMetrics): PhmBreakdown {
  const leftVentricularMassGValue = leftVentricularMassG(
    person.sex,
    person.heightM,
    person.weightKg
  )
  const rightVentricularMassGValue = rightVentricularMassG(
    person.sex,
    person.ageYears,
    person.heightM,
    person.weightKg
  )
  return {
    leftVentricularMassG: leftVentricularMassGValue,
    rightVentricularMassG: rightVentricularMassGValue,
    predictedHeartMassG: leftVentricularMassGValue + rightVentricularMassGValue,
    bmi: bodyMassIndex(person.heightM, person.weightKg),
    bsaM2: bodySurfaceArea(person.heightM, person.weightKg),
  }
}

export function matchDonorRecipient(
  recipient: PersonMetrics,
  donor: PersonMetrics
): MatchResult {
  const recipientBreakdown = predictedHeartMass(recipient)
  const donorBreakdown = predictedHeartMass(donor)
  const phmRatio =
    recipientBreakdown.predictedHeartMassG > 0
      ? donorBreakdown.predictedHeartMassG / recipientBreakdown.predictedHeartMassG
      : NaN
  const phmPercentDifference =
    recipientBreakdown.predictedHeartMassG > 0
      ? ((donorBreakdown.predictedHeartMassG - recipientBreakdown.predictedHeartMassG) /
          recipientBreakdown.predictedHeartMassG) *
        100
      : NaN
  const bsaRatio =
    recipientBreakdown.bsaM2 > 0 ? donorBreakdown.bsaM2 / recipientBreakdown.bsaM2 : NaN
  const bmiRatio =
    recipientBreakdown.bmi > 0 ? donorBreakdown.bmi / recipientBreakdown.bmi : NaN
  return {
    recipient: recipientBreakdown,
    donor: donorBreakdown,
    phmRatio,
    phmPercentDifference,
    bsaRatio,
    bmiRatio,
  }
}

/** Donor/recipient PHM ratio &lt; 0.86 = undersized caution. */
export const PHM_UNDERSIZE_RATIO = 0.86

/** Donor/recipient PHM ratio &gt; 1.2 = oversized caution. */
export const PHM_OVERSIZE_RATIO = 1.2

/** Deeper undersize band: donor/recipient PHM ratio &lt; 0.75. */
export const PHM_SEVERE_UNDERSIZE_RATIO = 0.75

export const MIN_AGE_YEARS = 5
export const MAX_AGE_YEARS = 80

/** Body-weight entry range (donor and recipient). */
export const MIN_WEIGHT_LB = 20
export const MAX_WEIGHT_LB = 600
export const MIN_WEIGHT_KG = Math.round(lbToKg(MIN_WEIGHT_LB))
export const MAX_WEIGHT_KG = Math.round(lbToKg(MAX_WEIGHT_LB))

export type PhmRatioBand = "ok" | "caution" | "severe"
export type PhmSizeCaution = "undersized" | "oversized" | null

/**
 * Color bands for the PHM number:
 * green when 0.86–1.2, yellow caution outside that (or mild undersize),
 * red when &lt; 0.75.
 */
export function phmRatioBand(ratio: number): PhmRatioBand {
  if (!Number.isFinite(ratio)) return "severe"
  if (ratio < PHM_SEVERE_UNDERSIZE_RATIO) return "severe"
  if (ratio < PHM_UNDERSIZE_RATIO) return "caution"
  if (ratio > PHM_OVERSIZE_RATIO) return "caution"
  return "ok"
}

/** Caution label: undersized below 0.86, oversized above 1.2. */
export function phmSizeCaution(ratio: number): PhmSizeCaution {
  if (!Number.isFinite(ratio)) return "undersized"
  if (ratio < PHM_UNDERSIZE_RATIO) return "undersized"
  if (ratio > PHM_OVERSIZE_RATIO) return "oversized"
  return null
}

export function isValidAdultMetrics(person: PersonMetrics) {
  if (person.sex !== "female" && person.sex !== "male") return false
  if (
    !Number.isFinite(person.ageYears) ||
    person.ageYears < MIN_AGE_YEARS ||
    person.ageYears > MAX_AGE_YEARS
  ) {
    return false
  }
  if (!Number.isFinite(person.heightM) || person.heightM < 0.9 || person.heightM > 2.3) {
    return false
  }
  if (
    !Number.isFinite(person.weightKg) ||
    person.weightKg < MIN_WEIGHT_KG ||
    person.weightKg > MAX_WEIGHT_KG
  ) {
    return false
  }
  return true
}

export function formatGrams(g: number) {
  if (!Number.isFinite(g)) return "—"
  return `${g.toFixed(0)} g`
}

export function formatBmi(bmi: number) {
  if (!Number.isFinite(bmi)) return "—"
  return bmi.toFixed(1)
}

export function formatBsa(bsaM2: number) {
  if (!Number.isFinite(bsaM2)) return "—"
  return `${bsaM2.toFixed(2)} m²`
}

export function formatRatio(ratio: number) {
  if (!Number.isFinite(ratio)) return "—"
  return ratio.toFixed(2)
}

export function formatPercent(pct: number) {
  if (!Number.isFinite(pct)) return "—"
  const sign = pct > 0 ? "+" : ""
  return `${sign}${pct.toFixed(1)}%`
}
