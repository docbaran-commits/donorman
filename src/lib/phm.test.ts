import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  MAX_WEIGHT_KG,
  MAX_WEIGHT_LB,
  MIN_WEIGHT_KG,
  MIN_WEIGHT_LB,
  bodyMassIndex,
  bodySurfaceArea,
  combineFeetInches,
  isValidAdultMetrics,
  leftVentricularMassG,
  lbToKg,
  matchDonorRecipient,
  phmRatioBand,
  phmSizeCaution,
  predictedHeartMass,
  rightVentricularMassG,
  splitFeetInches,
  totalInchesToM,
} from "./phm.ts"

describe("units", () => {
  it("round-trips feet and inches through meters", () => {
    const total = combineFeetInches(5, 10)
    const meters = totalInchesToM(total)
    const back = splitFeetInches(meters * 39.37007874)
    assert.equal(back.feet, 5)
    assert.ok(Math.abs(back.inches - 10) < 0.01)
  })
})

describe("BMI", () => {
  it("matches the kg/m² definition", () => {
    assert.ok(Math.abs(bodyMassIndex(1.75, 80) - 26.122448979) < 1e-6)
  })
})

describe("BSA", () => {
  it("uses the DuBois formula", () => {
    const expected = 0.007184 * 80 ** 0.425 * 175 ** 0.725
    assert.ok(Math.abs(bodySurfaceArea(1.75, 80) - expected) < 1e-9)
  })

  it("includes BSA and donor/recipient BSA ratio in match results", () => {
    const recipient = {
      sex: "male" as const,
      ageYears: 55,
      heightM: 1.8,
      weightKg: 90,
    }
    const donor = {
      sex: "female" as const,
      ageYears: 40,
      heightM: 1.65,
      weightKg: 65,
    }
    const match = matchDonorRecipient(recipient, donor)
    assert.ok(Math.abs(match.recipient.bsaM2 - bodySurfaceArea(1.8, 90)) < 1e-9)
    assert.ok(Math.abs(match.donor.bsaM2 - bodySurfaceArea(1.65, 65)) < 1e-9)
    assert.ok(Math.abs(match.bsaRatio - match.donor.bsaM2 / match.recipient.bsaM2) < 1e-9)
  })
})

describe("PHM", () => {
  it("uses sex-specific LV coefficients", () => {
    const male = leftVentricularMassG("male", 1.75, 80)
    const female = leftVentricularMassG("female", 1.75, 80)
    assert.ok(male > female)
    assert.ok(Math.abs(male - 8.25 * 1.75 ** 0.54 * 80 ** 0.61) < 1e-9)
    assert.ok(Math.abs(female - 6.82 * 1.75 ** 0.54 * 80 ** 0.61) < 1e-9)
  })

  it("uses sex-specific RV coefficients with age", () => {
    const male = rightVentricularMassG("male", 55, 1.75, 80)
    const female = rightVentricularMassG("female", 55, 1.75, 80)
    assert.ok(male > female)
    assert.ok(
      Math.abs(male - 11.25 * 55 ** -0.32 * 1.75 ** 1.135 * 80 ** 0.315) < 1e-9
    )
  })

  it("sums LV and RV into predicted heart mass", () => {
    const person = {
      sex: "male" as const,
      ageYears: 55,
      heightM: 1.75,
      weightKg: 80,
    }
    const phm = predictedHeartMass(person)
    assert.equal(
      phm.predictedHeartMassG,
      phm.leftVentricularMassG + phm.rightVentricularMassG
    )
  })

  it("computes donor/recipient ratio and UNOS percent difference", () => {
    const recipient = {
      sex: "male" as const,
      ageYears: 55,
      heightM: 1.8,
      weightKg: 90,
    }
    const donor = {
      sex: "female" as const,
      ageYears: 40,
      heightM: 1.65,
      weightKg: 65,
    }
    const match = matchDonorRecipient(recipient, donor)
    assert.ok(match.phmRatio < 1)
    const expectedPct =
      ((match.donor.predictedHeartMassG - match.recipient.predictedHeartMassG) /
        match.recipient.predictedHeartMassG) *
      100
    assert.ok(Math.abs(match.phmPercentDifference - expectedPct) < 1e-9)
  })

  it("bands PHM ratio by 0.86 / 1.2 and 0.75 cutoffs", () => {
    assert.equal(phmRatioBand(0.86), "ok")
    assert.equal(phmRatioBand(1.0), "ok")
    assert.equal(phmRatioBand(1.2), "ok")
    assert.equal(phmRatioBand(0.85), "caution")
    assert.equal(phmRatioBand(0.75), "caution")
    assert.equal(phmRatioBand(1.21), "caution")
    assert.equal(phmRatioBand(0.749), "severe")
    assert.equal(phmRatioBand(0.5), "severe")
  })

  it("labels undersized and oversized PHM caution", () => {
    assert.equal(phmSizeCaution(0.85), "undersized")
    assert.equal(phmSizeCaution(0.86), null)
    assert.equal(phmSizeCaution(1.2), null)
    assert.equal(phmSizeCaution(1.21), "oversized")
  })

  it("accepts ages from 5 to 80", () => {
    const base = {
      sex: "female" as const,
      heightM: 1.4,
      weightKg: 40,
    }
    assert.equal(isValidAdultMetrics({ ...base, ageYears: 5 }), true)
    assert.equal(isValidAdultMetrics({ ...base, ageYears: 80 }), true)
    assert.equal(isValidAdultMetrics({ ...base, ageYears: 4 }), false)
    assert.equal(isValidAdultMetrics({ ...base, ageYears: 81 }), false)
  })

  it("accepts weights from 20 lb to 600 lb", () => {
    assert.equal(MIN_WEIGHT_LB, 20)
    assert.equal(MAX_WEIGHT_LB, 600)
    assert.equal(MIN_WEIGHT_KG, Math.round(lbToKg(20)))
    assert.equal(MAX_WEIGHT_KG, Math.round(lbToKg(600)))
    const base = {
      sex: "male" as const,
      ageYears: 40,
      heightM: 1.7,
    }
    assert.equal(isValidAdultMetrics({ ...base, weightKg: MIN_WEIGHT_KG }), true)
    assert.equal(isValidAdultMetrics({ ...base, weightKg: MAX_WEIGHT_KG }), true)
    assert.equal(isValidAdultMetrics({ ...base, weightKg: MIN_WEIGHT_KG - 1 }), false)
    assert.equal(isValidAdultMetrics({ ...base, weightKg: MAX_WEIGHT_KG + 1 }), false)
  })
})
