"use client"

import { useState } from "react"

import { PersonPanel, type PersonDraft } from "@/components/person-panel"
import {
  PHM_UNDERSIZE_RATIO,
  formatBmi,
  formatGrams,
  formatPercent,
  formatRatio,
  isValidAdultMetrics,
  matchDonorRecipient,
} from "@/lib/phm"
import { cn } from "@/lib/cn"

const defaultRecipient: PersonDraft = {
  sex: "male",
  ageYears: 55,
  heightM: 1.78,
  weightKg: 85,
  heightUnit: "ftin",
  weightUnit: "lb",
}

const defaultDonor: PersonDraft = {
  sex: "female",
  ageYears: 40,
  heightM: 1.65,
  weightKg: 68,
  heightUnit: "cm",
  weightUnit: "kg",
}

export function MatchBoard() {
  const [recipient, setRecipient] = useState<PersonDraft>(defaultRecipient)
  const [donor, setDonor] = useState<PersonDraft>(defaultDonor)

  const ready = isValidAdultMetrics(recipient) && isValidAdultMetrics(donor)
  const match = ready ? matchDonorRecipient(recipient, donor) : null
  const undersized = match !== null && match.phmRatio < PHM_UNDERSIZE_RATIO

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-[#f3efe6]/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="px-4 pt-5 pb-3">
          <p className="text-xs font-semibold tracking-[0.18em] text-teal-800 uppercase">
            Heart transplant sizing
          </p>
          <h1 className="font-heading mt-1 text-[2.35rem] leading-none tracking-tight text-stone-900">
            DonorMan
          </h1>
          <p className="mt-2 max-w-[22rem] text-sm leading-relaxed text-stone-600">
            Predicted heart mass for donor and recipient, with mixed English and metric
            inputs.
          </p>
        </div>

        {match && (
          <div
            className="border-t border-stone-200/80 bg-white/90 px-4 py-3"
            aria-live="polite"
          >
            <div className="grid grid-cols-3 gap-2 text-center">
              <LiveStat
                label="Recipient PHM"
                value={formatGrams(match.recipient.predictedHeartMassG)}
              />
              <LiveStat
                label="Ratio"
                value={formatRatio(match.phmRatio)}
                warn={undersized}
              />
              <LiveStat
                label="Donor PHM"
                value={formatGrams(match.donor.predictedHeartMassG)}
              />
            </div>
            <p className="mt-2 text-center text-xs text-stone-500">
              {formatPercent(match.phmPercentDifference)} vs recipient · updates as you
              change fields
            </p>
          </div>
        )}

        <div className="grid h-1.5 grid-cols-2" aria-hidden="true">
          <div className="bg-teal-700" />
          <div className="bg-rose-700" />
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-10">
        <PersonPanel
          title="Recipient"
          accent="recipient"
          value={recipient}
          onChange={setRecipient}
        />
        <PersonPanel title="Donor" accent="donor" value={donor} onChange={setDonor} />

        {match && (
          <section className="rounded-3xl border border-stone-300 bg-white px-4 py-5 shadow-sm">
            <h2 className="font-heading text-2xl text-stone-900">Match detail</h2>
            <p className="mt-1 text-sm text-stone-600">
              PHM ratio and percent difference use adult MESA-based formulas.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatCard
                label="PHM ratio"
                value={formatRatio(match.phmRatio)}
                hint="donor ÷ recipient"
                warn={undersized}
              />
              <StatCard
                label="PHM difference"
                value={formatPercent(match.phmPercentDifference)}
                hint="vs recipient"
                warn={undersized}
              />
            </div>

            {undersized && (
              <p
                className="mt-3 rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-950 ring-1 ring-amber-200"
                role="status"
              >
                Ratio below {PHM_UNDERSIZE_RATIO} is often treated as severe undersizing in
                published cohorts.
              </p>
            )}

            <div className="mt-5 grid gap-3">
              <PersonStats
                title="Recipient"
                tone="recipient"
                phm={match.recipient.predictedHeartMassG}
                bmi={match.recipient.bmi}
                lv={match.recipient.leftVentricularMassG}
                rv={match.recipient.rightVentricularMassG}
              />
              <PersonStats
                title="Donor"
                tone="donor"
                phm={match.donor.predictedHeartMassG}
                bmi={match.donor.bmi}
                lv={match.donor.leftVentricularMassG}
                rv={match.donor.rightVentricularMassG}
              />
            </div>
          </section>
        )}

        <p className="px-1 text-xs leading-relaxed text-stone-500">
          PHM = LV mass + RV mass (Bluemke / Kawut MESA equations; UNOS &amp; ISHLT adult
          calculator). Validated for adults only. For clinical decision support — not a
          substitute for judgment or program policy.
        </p>
      </main>
    </div>
  )
}

function LiveStat({
  label,
  value,
  warn,
}: {
  label: string
  value: string
  warn?: boolean
}) {
  return (
    <div>
      <p className="text-[0.65rem] font-medium tracking-wide text-stone-500 uppercase">
        {label}
      </p>
      <p
        className={cn(
          "font-heading mt-0.5 text-lg tabular-nums",
          warn ? "text-amber-800" : "text-stone-900"
        )}
      >
        {value}
      </p>
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  warn,
}: {
  label: string
  value: string
  hint: string
  warn?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-2xl px-3 py-3 ring-1",
        warn ? "bg-amber-50 ring-amber-200" : "bg-stone-50 ring-stone-200"
      )}
    >
      <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">{label}</p>
      <p className="font-heading mt-1 text-3xl tabular-nums text-stone-900">{value}</p>
      <p className="mt-1 text-xs text-stone-500">{hint}</p>
    </div>
  )
}

function PersonStats({
  title,
  tone,
  phm,
  bmi,
  lv,
  rv,
}: {
  title: string
  tone: "recipient" | "donor"
  phm: number
  bmi: number
  lv: number
  rv: number
}) {
  return (
    <div className="rounded-2xl bg-stone-50 px-3 py-3 ring-1 ring-stone-200">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "size-2.5 rounded-full",
            tone === "recipient" ? "bg-teal-700" : "bg-rose-700"
          )}
          aria-hidden="true"
        />
        <h3 className="font-heading text-lg text-stone-900">{title}</h3>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <div>
          <dt className="text-stone-500">Heart mass</dt>
          <dd className="font-medium tabular-nums text-stone-900">{formatGrams(phm)}</dd>
        </div>
        <div>
          <dt className="text-stone-500">BMI</dt>
          <dd className="font-medium tabular-nums text-stone-900">{formatBmi(bmi)}</dd>
        </div>
        <div>
          <dt className="text-stone-500">LV mass</dt>
          <dd className="tabular-nums text-stone-700">{formatGrams(lv)}</dd>
        </div>
        <div>
          <dt className="text-stone-500">RV mass</dt>
          <dd className="tabular-nums text-stone-700">{formatGrams(rv)}</dd>
        </div>
      </dl>
    </div>
  )
}
