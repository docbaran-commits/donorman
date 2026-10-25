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
  const ratioPct = match ? Math.min(140, Math.max(0, match.phmRatio * 100)) : 0

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-[#efe8dc]/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="px-3 pt-2.5 pb-1.5 text-center">
          <h1 className="font-heading text-[1.55rem] leading-none tracking-tight text-stone-900">
            DonorMan
          </h1>
          {match && (
            <div className="mt-1.5" aria-live="polite">
              <p
                className={cn(
                  "text-[1.7rem] font-bold leading-none tabular-nums",
                  undersized ? "text-amber-700" : "text-stone-900"
                )}
              >
                {formatRatio(match.phmRatio)}
              </p>
              <p className="mt-0.5 text-[0.7rem] font-semibold tracking-wide text-stone-500 uppercase">
                PHM ratio
              </p>
            </div>
          )}
        </div>

        {match && (
          <div className="space-y-1 bg-white/90 px-3 py-1.5">
            <div className="relative h-2 overflow-hidden rounded-full bg-stone-200">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-teal-700 to-rose-700 transition-[width] duration-150"
                style={{ width: `${ratioPct}%` }}
              />
              <div
                className="absolute inset-y-0 w-0.5 bg-stone-900/70"
                style={{ left: `${PHM_UNDERSIZE_RATIO * 100}%` }}
                aria-hidden="true"
              />
            </div>
            <div className="flex items-center justify-between text-[0.75rem] font-medium text-stone-600">
              <span>{formatPercent(match.phmPercentDifference)}</span>
              <span className={undersized ? "font-bold text-amber-800" : undefined}>
                {undersized ? `< ${PHM_UNDERSIZE_RATIO}` : `mark ${PHM_UNDERSIZE_RATIO}`}
              </span>
            </div>
          </div>
        )}

        <div className="grid h-1 grid-cols-2" aria-hidden="true">
          <div className="bg-teal-700" />
          <div className="bg-rose-700" />
        </div>
      </header>

      <main className="grid flex-1 grid-cols-1 content-start gap-3 px-3 pt-3 sm:grid-cols-2">
        <PersonPanel
          title="Recipient"
          accent="recipient"
          value={recipient}
          onChange={setRecipient}
        />
        <PersonPanel title="Donor" accent="donor" value={donor} onChange={setDonor} />
      </main>

      {match && (
        <footer className="sticky bottom-0 z-20 border-t border-stone-200/80 bg-[#efe8dc]/95 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md">
          <div className="grid grid-cols-2 gap-2">
            <MassChip
              label="Recipient"
              mass={match.recipient.predictedHeartMassG}
              bmi={match.recipient.bmi}
              lv={match.recipient.leftVentricularMassG}
              rv={match.recipient.rightVentricularMassG}
              tone="recipient"
            />
            <MassChip
              label="Donor"
              mass={match.donor.predictedHeartMassG}
              bmi={match.donor.bmi}
              lv={match.donor.leftVentricularMassG}
              rv={match.donor.rightVentricularMassG}
              tone="donor"
            />
          </div>
        </footer>
      )}
    </div>
  )
}

function MassChip({
  label,
  mass,
  bmi,
  lv,
  rv,
  tone,
}: {
  label: string
  mass: number
  bmi: number
  lv: number
  rv: number
  tone: "recipient" | "donor"
}) {
  return (
    <div className="rounded-xl bg-white/95 px-2.5 py-2 ring-1 ring-stone-200">
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "size-2 rounded-full",
            tone === "recipient" ? "bg-teal-700" : "bg-rose-700"
          )}
        />
        <p
          className={cn(
            "text-[0.75rem] font-bold tracking-wide uppercase",
            tone === "recipient" ? "text-teal-800" : "text-rose-800"
          )}
        >
          {label}
        </p>
      </div>
      <p className="mt-1 text-[1.35rem] font-bold leading-none tabular-nums text-stone-900">
        {formatGrams(mass)}
      </p>
      <p className="mt-1 text-[0.8rem] font-medium tabular-nums text-stone-600">
        BMI {formatBmi(bmi)} · LV {formatGrams(lv)} · RV {formatGrams(rv)}
      </p>
    </div>
  )
}
