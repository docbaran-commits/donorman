"use client"

import {
  cmToM,
  combineFeetInches,
  kgToLb,
  lbToKg,
  mToCm,
  mToTotalInches,
  splitFeetInches,
  type HeightUnit,
  type PersonMetrics,
  type Sex,
  type WeightUnit,
} from "@/lib/phm"
import { cn } from "@/lib/cn"

export type PersonDraft = PersonMetrics & {
  heightUnit: HeightUnit
  weightUnit: WeightUnit
}

const HEIGHT_UNITS: { id: HeightUnit; label: string }[] = [
  { id: "ftin", label: "ft / in" },
  { id: "cm", label: "cm" },
  { id: "m", label: "m" },
]

const WEIGHT_UNITS: { id: WeightUnit; label: string }[] = [
  { id: "lb", label: "lb" },
  { id: "kg", label: "kg" },
]

export function PersonPanel({
  title,
  accent,
  value,
  onChange,
}: {
  title: string
  accent: "recipient" | "donor"
  value: PersonDraft
  onChange: (next: PersonDraft) => void
}) {
  const totalIn = mToTotalInches(value.heightM)
  const { feet, inches } = splitFeetInches(totalIn)
  const cm = mToCm(value.heightM)
  const lb = kgToLb(value.weightKg)

  const bar = accent === "recipient" ? "bg-teal-700" : "bg-rose-700"
  const soft = accent === "recipient" ? "bg-teal-50" : "bg-rose-50"
  const ink = accent === "recipient" ? "text-teal-900" : "text-rose-950"

  function setHeightFromFeetInches(nextFeet: number, nextInches: number) {
    onChange({
      ...value,
      heightM: totalInchesToSafe(combineFeetInches(nextFeet, nextInches)),
    })
  }

  return (
    <section className={cn("overflow-hidden rounded-3xl border shadow-sm", soft)}>
      <div className={cn("h-1.5 w-full", bar)} aria-hidden="true" />
      <div className="space-y-5 px-4 py-4">
        <header>
          <h2 className={cn("font-heading text-2xl tracking-tight", ink)}>{title}</h2>
          <p className="mt-1 text-sm text-stone-600">
            Sex, age, height, and weight — units can differ.
          </p>
        </header>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-stone-800">Sex</legend>
          <div className="grid grid-cols-2 gap-2">
            {(["female", "male"] as Sex[]).map((sex) => (
              <button
                key={sex}
                type="button"
                aria-pressed={value.sex === sex}
                onClick={() => onChange({ ...value, sex })}
                className={cn(
                  "min-h-12 rounded-2xl border text-sm font-semibold capitalize transition-colors",
                  value.sex === sex
                    ? cn(bar, "border-transparent text-white")
                    : "border-stone-300 bg-white text-stone-800"
                )}
              >
                {sex}
              </button>
            ))}
          </div>
        </fieldset>

        <SliderField
          label="Age"
          display={`${Math.round(value.ageYears)} yr`}
          min={18}
          max={90}
          step={1}
          value={value.ageYears}
          onChange={(ageYears) => onChange({ ...value, ageYears })}
        />

        <div className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <p className="text-sm font-medium text-stone-800">Height</p>
            <UnitTabs
              options={HEIGHT_UNITS}
              value={value.heightUnit}
              onChange={(heightUnit) => onChange({ ...value, heightUnit })}
            />
          </div>

          {value.heightUnit === "ftin" && (
            <div className="space-y-3">
              <SliderField
                label="Feet"
                display={`${feet} ft`}
                min={4}
                max={7}
                step={1}
                value={feet}
                onChange={(nextFeet) => setHeightFromFeetInches(nextFeet, inches)}
              />
              <SliderField
                label="Inches"
                display={`${inches.toFixed(1)} in`}
                min={0}
                max={11.9}
                step={0.5}
                value={Math.min(11.9, inches)}
                onChange={(nextInches) => setHeightFromFeetInches(feet, nextInches)}
              />
            </div>
          )}

          {value.heightUnit === "cm" && (
            <SliderField
              label="Centimeters"
              display={`${cm.toFixed(0)} cm`}
              min={140}
              max={210}
              step={1}
              value={clamp(cm, 140, 210)}
              onChange={(nextCm) => onChange({ ...value, heightM: cmToM(nextCm) })}
            />
          )}

          {value.heightUnit === "m" && (
            <SliderField
              label="Meters"
              display={`${value.heightM.toFixed(2)} m`}
              min={1.4}
              max={2.1}
              step={0.01}
              value={clamp(value.heightM, 1.4, 2.1)}
              onChange={(heightM) => onChange({ ...value, heightM })}
            />
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <p className="text-sm font-medium text-stone-800">Weight</p>
            <UnitTabs
              options={WEIGHT_UNITS}
              value={value.weightUnit}
              onChange={(weightUnit) => onChange({ ...value, weightUnit })}
            />
          </div>

          {value.weightUnit === "lb" ? (
            <SliderField
              label="Pounds"
              display={`${lb.toFixed(0)} lb`}
              min={80}
              max={400}
              step={1}
              value={clamp(lb, 80, 400)}
              onChange={(nextLb) => onChange({ ...value, weightKg: lbToKg(nextLb) })}
            />
          ) : (
            <SliderField
              label="Kilograms"
              display={`${value.weightKg.toFixed(0)} kg`}
              min={35}
              max={180}
              step={1}
              value={clamp(value.weightKg, 35, 180)}
              onChange={(weightKg) => onChange({ ...value, weightKg })}
            />
          )}
        </div>
      </div>
    </section>
  )
}

function totalInchesToSafe(totalInches: number) {
  return Math.min(2.3, Math.max(1.2, totalInches / 39.37007874))
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function UnitTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (next: T) => void
}) {
  return (
    <div className="inline-flex rounded-full bg-white/80 p-1 ring-1 ring-stone-300">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
            value === option.id ? "bg-stone-900 text-white" : "text-stone-600"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function SliderField({
  label,
  display,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string
  display: string
  min: number
  max: number
  step: number
  value: number
  onChange: (next: number) => void
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-stone-700">{label}</span>
        <span className="font-heading text-lg tabular-nums text-stone-900">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-10 w-full accent-stone-900"
      />
    </label>
  )
}
