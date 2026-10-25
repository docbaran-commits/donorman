import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  bodyMassIndex,
  combineFeetInches,
  leftVentricularMassG,
  matchDonorRecipient,
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
})
