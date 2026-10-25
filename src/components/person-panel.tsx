"use client"

import { useState } from "react"

import { FemaleIcon, MaleIcon } from "@/components/sex-icons"
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
  const soft = accent === "recipient" ? "bg-teal-50/90" : "bg-rose-50/90"
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
    <section className={cn("overflow-hidden rounded-2xl border border-stone-200/90 shadow-sm", soft)}>
      <div className={cn("h-1 w-full", bar)} aria-hidden="true" />
      <div className="space-y-2.5 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className={cn("text-[1.15rem] font-bold tracking-tight", ink)}>{title}</h2>
          <div className="flex items-center gap-1.5" role="group" aria-label={`${title} sex`}>
            {(
              [
                { sex: "female" as const, label: "Female", Icon: FemaleIcon },
                { sex: "male" as const, label: "Male", Icon: MaleIcon },
              ] as const
            ).map(({ sex, label, Icon }) => (
              <button
                key={sex}
                type="button"
                aria-label={label}
                aria-pressed={value.sex === sex}
                title={label}
                onClick={() => patch({ sex })}
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl border transition-colors",
                  value.sex === sex ? chipOn : "border-stone-300 bg-white text-stone-700"
                )}
              >
                <Icon className="size-6" />
              </button>
            ))}
          </div>
        </div>

        <CompactField
          idPrefix={title}
          label="Age"
          unit="yr"
          min={18}
          max={90}
          step={1}
          value={age}
          onChange={(ageYears) => patch({ ageYears: Math.round(ageYears) })}
        />

        <div className="space-y-2 rounded-xl bg-white/80 p-2.5 ring-1 ring-stone-200/90">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.95rem] font-semibold text-stone-800">Height</p>
            <UnitTabs
              options={HEIGHT_UNITS}
              value={value.heightUnit}
              onChange={(heightUnit) => patch({ heightUnit })}
            />
          </div>

          {value.heightUnit === "ftin" && (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label={`${title} feet`}>
                {FEET_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={feet === option}
                    onClick={() => setHeightFromFeetInches(option, inches)}
                    className={cn(
                      "min-h-10 rounded-xl border text-[1.05rem] font-bold tabular-nums transition-colors",
                      feet === option ? chipOn : "border-stone-300 bg-white text-stone-800"
                    )}
                  >
                    {option}′
                  </button>
                ))}
              </div>
              <CompactField
                idPrefix={title}
                label="In"
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
            <CompactField
              idPrefix={title}
              label="Cm"
              unit="cm"
              min={140}
              max={210}
              step={1}
              value={clamp(cm, 140, 210)}
              onChange={(nextCm) => patch({ heightM: cmToM(Math.round(nextCm)) })}
            />
          )}

          {value.heightUnit === "m" && (
            <CompactField
              idPrefix={title}
              label="M"
              unit="m"
              min={1.4}
              max={2.1}
              step={0.01}
              value={Number(clamp(value.heightM, 1.4, 2.1).toFixed(2))}
              onChange={(heightM) => patch({ heightM: Number(heightM.toFixed(2)) })}
            />
          )}
        </div>

        <div className="space-y-2 rounded-xl bg-white/80 p-2.5 ring-1 ring-stone-200/90">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.95rem] font-semibold text-stone-800">Weight</p>
            <UnitTabs
              options={WEIGHT_UNITS}
              value={value.weightUnit}
              onChange={(weightUnit) => patch({ weightUnit })}
            />
          </div>

          {value.weightUnit === "lb" ? (
            <CompactField
              idPrefix={title}
              label="Lb"
              unit="lb"
              min={80}
              max={400}
              step={1}
              value={clamp(lb, 80, 400)}
              onChange={(nextLb) => patch({ weightKg: lbToKg(Math.round(nextLb)) })}
            />
          ) : (
            <CompactField
              idPrefix={title}
              label="Kg"
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
    <div className="inline-flex rounded-full bg-stone-100 p-0.5 ring-1 ring-stone-300">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "rounded-full px-2 py-1 text-[0.8rem] font-bold transition-colors",
            value === option.id ? "bg-stone-900 text-white" : "text-stone-600"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function formatFieldValue(value: number, step: number) {
  if (!Number.isFinite(value)) return ""
  if (Number.isInteger(step)) return String(Math.round(value))
  const rounded = Math.round(value / step) * step
  if (step >= 0.1) return Number(rounded.toFixed(1)).toString()
  return Number(rounded.toFixed(2)).toString()
}

function CompactField({
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
  const [draft, setDraft] = useState<string | null>(null)

  function commit(raw: number) {
    if (!Number.isFinite(raw)) return
    onChange(clamp(raw, min, max))
  }

  function parseDraft(text: string) {
    const trimmed = text.trim()
    if (trimmed === "" || trimmed === "-" || trimmed === ".") return null
    const next = Number(trimmed)
    return Number.isFinite(next) ? next : null
  }

  const display = draft ?? formatFieldValue(value, step)

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <label className="min-w-[2.25rem] text-[0.95rem] font-semibold text-stone-700" htmlFor={fieldId}>
          {label}
        </label>
        <input
          id={fieldId}
          type="text"
          inputMode="decimal"
          enterKeyHint="done"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={display}
          onFocus={(event) => {
            setDraft(formatFieldValue(value, step))
            event.currentTarget.select()
          }}
          onChange={(event) => {
            const text = event.target.value.replace(/[^\d.-]/g, "")
            setDraft(text)
            const parsed = parseDraft(text)
            if (parsed !== null) commit(parsed)
          }}
          onBlur={() => {
            const parsed = parseDraft(draft ?? "")
            commit(parsed ?? value)
            setDraft(null)
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur()
          }}
          className="h-10 min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-2 text-right text-[1.15rem] font-semibold tabular-nums text-stone-900 outline-none focus:border-stone-800 focus:ring-2 focus:ring-stone-800/20"
        />
        <span className="w-7 text-[0.9rem] font-semibold text-stone-500">{unit}</span>
      </div>
      <input
        type="range"
        aria-label={`${idPrefix} ${label}`}
        min={min}
        max={max}
        step={step}
        value={clamp(value, min, max)}
        onInput={(event) => {
          const next = Number((event.target as HTMLInputElement).value)
          commit(next)
          if (draft !== null) setDraft(formatFieldValue(next, step))
        }}
        onChange={(event) => {
          const next = Number(event.target.value)
          commit(next)
          if (draft !== null) setDraft(formatFieldValue(next, step))
        }}
        className="block h-8 w-full cursor-pointer accent-stone-900"
      />
    </div>
  )
}
