"use client"

import { useState } from "react"

import { FemaleIcon, MaleIcon } from "@/components/sex-icons"
import {
  MAX_WEIGHT_KG,
  MAX_WEIGHT_LB,
  MIN_WEIGHT_KG,
  MIN_WEIGHT_LB,
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
  className,
}: {
  title: string
  accent: "recipient" | "donor"
  value: PersonDraft
  onChange: (next: PersonDraft) => void
  className?: string
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
    <section
      className={cn(
        "flex flex-col rounded-2xl border border-stone-200/90 shadow-sm",
        soft,
        className
      )}
    >
      <div className={cn("h-1.5 w-full shrink-0 rounded-t-[0.9rem]", bar)} aria-hidden="true" />
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 px-3 py-3">
        <div className="flex shrink-0 items-center gap-2">
          <h2 className={cn("min-w-0 flex-1 truncate text-[1.1rem] font-bold tracking-tight", ink)}>
            {title}
          </h2>
          <label className="flex items-center gap-1 text-[0.85rem] font-semibold text-stone-600">
            Age
            <TinyNumber
              id={`${title}-age`}
              min={5}
              max={80}
              step={1}
              value={age}
              onChange={(ageYears) => patch({ ageYears: Math.round(ageYears) })}
              className="w-11"
            />
          </label>
          <div className="flex items-center gap-1" role="group" aria-label={`${title} sex`}>
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
                  "flex size-9 items-center justify-center rounded-lg border transition-colors",
                  value.sex === sex ? chipOn : "border-stone-300 bg-white text-stone-700"
                )}
              >
                <Icon className="size-5" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-white/80 px-2.5 pt-2.5 pb-1 ring-1 ring-stone-200/90">
          <div className="flex shrink-0 flex-nowrap items-center gap-1 overflow-x-auto">
            <p className="shrink-0 text-[0.95rem] font-bold text-stone-800">Ht</p>
            <UnitTabs
              options={HEIGHT_UNITS}
              value={value.heightUnit}
              onChange={(heightUnit) => patch({ heightUnit })}
            />
            {value.heightUnit === "ftin" && (
              <>
                <div
                  className="flex shrink-0 gap-0.5"
                  role="radiogroup"
                  aria-label={`${title} feet`}
                >
                  {FEET_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={feet === option}
                      onClick={() => setHeightFromFeetInches(option, inches)}
                      className={cn(
                        "size-7 rounded-md border text-[0.85rem] font-bold tabular-nums transition-colors",
                        feet === option ? chipOn : "border-stone-300 bg-white text-stone-800"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <span className="shrink-0 text-[0.75rem] font-semibold text-stone-500">ft</span>
                <TinyNumber
                  id={`${title}-inches`}
                  min={0}
                  max={11.5}
                  step={0.5}
                  value={inches}
                  onChange={(nextInches) => setHeightFromFeetInches(feet, nextInches)}
                  className="h-8 w-10"
                />
                <span className="shrink-0 text-[0.75rem] font-semibold text-stone-500">in</span>
              </>
            )}
            {value.heightUnit === "cm" && (
              <TinyNumber
                id={`${title}-cm`}
                min={140}
                max={210}
                step={1}
                value={clamp(cm, 140, 210)}
                onChange={(nextCm) => patch({ heightM: cmToM(Math.round(nextCm)) })}
                className="h-8 w-12"
              />
            )}
            {value.heightUnit === "m" && (
              <TinyNumber
                id={`${title}-m`}
                min={1.4}
                max={2.1}
                step={0.01}
                value={Number(clamp(value.heightM, 1.4, 2.1).toFixed(2))}
                onChange={(heightM) => patch({ heightM: Number(heightM.toFixed(2)) })}
                className="h-8 w-12"
              />
            )}
          </div>
          <div className="min-h-2 flex-1" aria-hidden="true" />
          <div className="shrink-0 px-0.5 pt-1">
            {value.heightUnit === "ftin" && (
              <input
                type="range"
                aria-label={`${title} inches`}
                min={0}
                max={11.5}
                step={0.5}
                value={inches}
                onInput={(event) =>
                  setHeightFromFeetInches(feet, Number((event.target as HTMLInputElement).value))
                }
                onChange={(event) => setHeightFromFeetInches(feet, Number(event.target.value))}
                className="metric-slider block w-full cursor-pointer accent-stone-900"
              />
            )}
            {value.heightUnit === "cm" && (
              <input
                type="range"
                aria-label={`${title} cm`}
                min={140}
                max={210}
                step={1}
                value={clamp(cm, 140, 210)}
                onInput={(event) =>
                  patch({ heightM: cmToM(Number((event.target as HTMLInputElement).value)) })
                }
                onChange={(event) => patch({ heightM: cmToM(Number(event.target.value)) })}
                className="metric-slider block w-full cursor-pointer accent-stone-900"
              />
            )}
            {value.heightUnit === "m" && (
              <input
                type="range"
                aria-label={`${title} m`}
                min={1.4}
                max={2.1}
                step={0.01}
                value={clamp(value.heightM, 1.4, 2.1)}
                onInput={(event) =>
                  patch({ heightM: Number((event.target as HTMLInputElement).value) })
                }
                onChange={(event) => patch({ heightM: Number(event.target.value) })}
                className="metric-slider block w-full cursor-pointer accent-stone-900"
              />
            )}
            {/* Solid spacer so the thumb never sits on the card edge */}
            <div className="h-5 w-full" aria-hidden="true" />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-white/80 px-2.5 pt-2.5 pb-1 ring-1 ring-stone-200/90">
          <div className="flex shrink-0 flex-nowrap items-center gap-1 overflow-x-auto">
            <p className="shrink-0 text-[0.95rem] font-bold text-stone-800">Wt</p>
            <UnitTabs
              options={WEIGHT_UNITS}
              value={value.weightUnit}
              onChange={(weightUnit) => patch({ weightUnit })}
            />
            {value.weightUnit === "lb" ? (
              <TinyNumber
                id={`${title}-lb`}
                min={MIN_WEIGHT_LB}
                max={MAX_WEIGHT_LB}
                step={1}
                value={clamp(lb, MIN_WEIGHT_LB, MAX_WEIGHT_LB)}
                onChange={(nextLb) => patch({ weightKg: lbToKg(Math.round(nextLb)) })}
                className="h-8 w-14"
              />
            ) : (
              <TinyNumber
                id={`${title}-kg`}
                min={MIN_WEIGHT_KG}
                max={MAX_WEIGHT_KG}
                step={1}
                value={clamp(kg, MIN_WEIGHT_KG, MAX_WEIGHT_KG)}
                onChange={(weightKg) => patch({ weightKg: Math.round(weightKg) })}
                className="h-8 w-14"
              />
            )}
          </div>
          <div className="min-h-2 flex-1" aria-hidden="true" />
          <div className="shrink-0 px-0.5 pt-1">
            {value.weightUnit === "lb" ? (
              <input
                type="range"
                aria-label={`${title} lb`}
                min={MIN_WEIGHT_LB}
                max={MAX_WEIGHT_LB}
                step={1}
                value={clamp(lb, MIN_WEIGHT_LB, MAX_WEIGHT_LB)}
                onInput={(event) =>
                  patch({ weightKg: lbToKg(Number((event.target as HTMLInputElement).value)) })
                }
                onChange={(event) => patch({ weightKg: lbToKg(Number(event.target.value)) })}
                className="metric-slider block w-full cursor-pointer accent-stone-900"
              />
            ) : (
              <input
                type="range"
                aria-label={`${title} kg`}
                min={MIN_WEIGHT_KG}
                max={MAX_WEIGHT_KG}
                step={1}
                value={clamp(kg, MIN_WEIGHT_KG, MAX_WEIGHT_KG)}
                onInput={(event) =>
                  patch({ weightKg: Number((event.target as HTMLInputElement).value) })
                }
                onChange={(event) => patch({ weightKg: Number(event.target.value) })}
                className="metric-slider block w-full cursor-pointer accent-stone-900"
              />
            )}
            <div className="h-5 w-full" aria-hidden="true" />
          </div>
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
    <div className="inline-flex shrink-0 rounded-full bg-stone-100 p-0.5 ring-1 ring-stone-300">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[0.7rem] font-bold transition-colors",
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

function TinyNumber({
  id,
  min,
  max,
  step,
  value,
  onChange,
  className,
}: {
  id: string
  min: number
  max: number
  step: number
  value: number
  onChange: (next: number) => void
  className?: string
}) {
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

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      enterKeyHint="done"
      autoComplete="off"
      value={draft ?? formatFieldValue(value, step)}
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
      className={cn(
        "h-8 rounded-lg border border-stone-300 bg-white px-1.5 text-center text-[1.05rem] font-bold tabular-nums text-stone-900 outline-none focus:border-stone-800 focus:ring-2 focus:ring-stone-800/20",
        className
      )}
    />
  )
}

