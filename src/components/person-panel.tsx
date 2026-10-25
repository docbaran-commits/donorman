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
  { id: "ftin", label: "ft/in" },
  { id: "cm", label: "cm" },
  { id: "m", label: "m" },
]

const WEIGHT_UNITS: { id: WeightUnit; label: string }[] = [
  { id: "lb", label: "lb" },
  { id: "kg", label: "kg" },
]

const FEET_OPTIONS = [4, 5, 6] as const

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
  const split = splitFeetInches(totalIn)
  const feet = FEET_OPTIONS.includes(split.feet as (typeof FEET_OPTIONS)[number])
    ? (split.feet as (typeof FEET_OPTIONS)[number])
    : clamp(split.feet, 4, 6)
  const inches = Math.round(split.inches * 2) / 2
  const cm = Math.round(mToCm(value.heightM))
  const lb = Math.round(kgToLb(value.weightKg))
  const kg = Math.round(value.weightKg)
  const age = Math.round(value.ageYears)

  const bar = accent === "recipient" ? "bg-teal-700" : "bg-rose-700"
  const soft = accent === "recipient" ? "bg-teal-50/80" : "bg-rose-50/80"
  const ink = accent === "recipient" ? "text-teal-900" : "text-rose-950"
  const chipOn =
    accent === "recipient"
      ? "bg-teal-700 text-white border-transparent"
      : "bg-rose-700 text-white border-transparent"

  function patch(partial: Partial<PersonDraft>) {
    onChange({ ...value, ...partial })
  }

  function setHeightFromFeetInches(nextFeet: number, nextInches: number) {
    const feetSafe = clamp(Math.round(nextFeet), 4, 6)
    const inchesSafe = clamp(nextInches, 0, 11.5)
    patch({ heightM: totalInchesToSafe(combineFeetInches(feetSafe, inchesSafe)) })
  }

  return (
    <section className={cn("overflow-hidden rounded-[1.75rem] border border-stone-200/80 shadow-sm", soft)}>
      <div className={cn("h-1.5 w-full", bar)} aria-hidden="true" />
      <div className="space-y-4 px-4 py-4">
        <h2 className={cn("font-heading text-[1.65rem] leading-none tracking-tight", ink)}>
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {(["female", "male"] as Sex[]).map((sex) => (
            <button
              key={sex}
              type="button"
              aria-pressed={value.sex === sex}
              onClick={() => patch({ sex })}
              className={cn(
                "min-h-11 rounded-2xl border text-sm font-semibold capitalize transition-colors",
                value.sex === sex ? chipOn : "border-stone-300 bg-white/90 text-stone-800"
              )}
            >
              {sex}
            </button>
          ))}
        </div>

        <NumberSliderField
          idPrefix={title}
          label="Age"
          unit="yr"
          min={18}
          max={90}
          step={1}
          value={age}
          onChange={(ageYears) => patch({ ageYears: Math.round(ageYears) })}
        />

        <div className="space-y-3 rounded-2xl bg-white/70 p-3 ring-1 ring-stone-200/80">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-stone-800">Height</p>
            <UnitTabs
              options={HEIGHT_UNITS}
              value={value.heightUnit}
              onChange={(heightUnit) => patch({ heightUnit })}
            />
          </div>

          {value.heightUnit === "ftin" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm text-stone-600">Feet</p>
                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={`${title} feet`}>
                  {FEET_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={feet === option}
                      onClick={() => setHeightFromFeetInches(option, inches)}
                      className={cn(
                        "min-h-12 rounded-2xl border text-base font-semibold tabular-nums transition-colors",
                        feet === option
                          ? chipOn
                          : "border-stone-300 bg-white text-stone-800"
                      )}
                    >
                      {option}′
                    </button>
                  ))}
                </div>
              </div>
              <NumberSliderField
                idPrefix={title}
                label="Inches"
                unit="in"
                min={0}
                max={11.5}
                step={0.5}
                value={inches}
                onChange={(nextInches) => setHeightFromFeetInches(feet, nextInches)}
              />
            </div>
          )}

          {value.heightUnit === "cm" && (
            <NumberSliderField
              idPrefix={title}
              label="Centimeters"
              unit="cm"
              min={140}
              max={210}
              step={1}
              value={clamp(cm, 140, 210)}
              onChange={(nextCm) => patch({ heightM: cmToM(Math.round(nextCm)) })}
            />
          )}

          {value.heightUnit === "m" && (
            <NumberSliderField
              idPrefix={title}
              label="Meters"
              unit="m"
              min={1.4}
              max={2.1}
              step={0.01}
              value={Number(clamp(value.heightM, 1.4, 2.1).toFixed(2))}
              onChange={(heightM) => patch({ heightM: Number(heightM.toFixed(2)) })}
            />
          )}
        </div>

        <div className="space-y-3 rounded-2xl bg-white/70 p-3 ring-1 ring-stone-200/80">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-stone-800">Weight</p>
            <UnitTabs
              options={WEIGHT_UNITS}
              value={value.weightUnit}
              onChange={(weightUnit) => patch({ weightUnit })}
            />
          </div>

          {value.weightUnit === "lb" ? (
            <NumberSliderField
              idPrefix={title}
              label="Pounds"
              unit="lb"
              min={80}
              max={400}
              step={1}
              value={clamp(lb, 80, 400)}
              onChange={(nextLb) => patch({ weightKg: lbToKg(Math.round(nextLb)) })}
            />
          ) : (
            <NumberSliderField
              idPrefix={title}
              label="Kilograms"
              unit="kg"
              min={35}
              max={180}
              step={1}
              value={clamp(kg, 35, 180)}
              onChange={(weightKg) => patch({ weightKg: Math.round(weightKg) })}
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
    <div className="inline-flex rounded-full bg-stone-100 p-1 ring-1 ring-stone-300">
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

function NumberSliderField({
  idPrefix,
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
}: {
  idPrefix: string
  label: string
  unit: string
  min: number
  max: number
  step: number
  value: number
  onChange: (next: number) => void
}) {
  const fieldId = `${idPrefix}-${label}`.toLowerCase().replace(/\s+/g, "-")

  function commit(raw: number) {
    if (!Number.isFinite(raw)) return
    onChange(clamp(raw, min, max))
  }

  const shown = Number.isInteger(step) ? Math.round(value) : value

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm text-stone-600" htmlFor={fieldId}>
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <input
            id={fieldId}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={shown}
            onChange={(event) => {
              const next = Number(event.target.value)
              if (event.target.value === "" || !Number.isFinite(next)) return
              commit(next)
            }}
            onBlur={(event) => {
              const next = Number(event.target.value)
              commit(Number.isFinite(next) ? next : value)
            }}
            className="h-11 w-[5.25rem] rounded-xl border border-stone-300 bg-white px-2 text-right font-heading text-lg tabular-nums text-stone-900 outline-none focus:border-stone-800 focus:ring-2 focus:ring-stone-800/20"
          />
          <span className="min-w-[1.5rem] text-sm font-medium text-stone-500">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        aria-label={`${idPrefix} ${label}`}
        min={min}
        max={max}
        step={step}
        value={clamp(value, min, max)}
        onInput={(event) => commit(Number((event.target as HTMLInputElement).value))}
        onChange={(event) => commit(Number(event.target.value))}
        className="block h-10 w-full cursor-pointer accent-stone-900"
      />
    </div>
  )
}
