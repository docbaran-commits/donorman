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
        <div className="flex items-end justify-between gap-3 px-4 pt-4 pb-3">
          <h1 className="font-heading text-[2.4rem] leading-none tracking-tight text-stone-900">
            DonorMan
          </h1>
          <span className="mb-1 text-[0.7rem] font-semibold tracking-[0.14em] text-teal-800 uppercase">
            PHM match
          </span>
        </div>

        {match && (
          <div className="space-y-3 bg-white/85 px-4 py-3" aria-live="polite">
            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
              <MassBlock
                label="Recipient"
                mass={match.recipient.predictedHeartMassG}
                bmi={match.recipient.bmi}
                tone="recipient"
              />
              <div className="pb-1 text-center">
                <p
                  className={cn(
                    "font-heading text-3xl leading-none tabular-nums",
                    undersized ? "text-amber-700" : "text-stone-900"
                  )}
                >
                  {formatRatio(match.phmRatio)}
                </p>
                <p className="mt-1 text-[0.65rem] font-medium tracking-wide text-stone-500 uppercase">
                  ratio
                </p>
              </div>
              <MassBlock
                label="Donor"
                mass={match.donor.predictedHeartMassG}
                bmi={match.donor.bmi}
                tone="donor"
                align="right"
              />
            </div>

            <div className="space-y-1.5">
              <div className="relative h-3 overflow-hidden rounded-full bg-stone-200">
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
              <div className="flex items-center justify-between text-[0.7rem] text-stone-500">
                <span>{formatPercent(match.phmPercentDifference)}</span>
                <span className={undersized ? "font-semibold text-amber-800" : undefined}>
                  {undersized ? `Below ${PHM_UNDERSIZE_RATIO}` : `Mark ${PHM_UNDERSIZE_RATIO}`}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid h-1.5 grid-cols-2" aria-hidden="true">
          <div className="bg-teal-700" />
          <div className="bg-rose-700" />
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-8">
        <PersonPanel
          title="Recipient"
          accent="recipient"
          value={recipient}
          onChange={setRecipient}
        />
        <PersonPanel title="Donor" accent="donor" value={donor} onChange={setDonor} />

        {match && (
          <section className="rounded-[1.75rem] border border-stone-200 bg-white px-4 py-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <DetailCard
                title="Recipient"
                tone="recipient"
                phm={match.recipient.predictedHeartMassG}
                bmi={match.recipient.bmi}
                lv={match.recipient.leftVentricularMassG}
                rv={match.recipient.rightVentricularMassG}
              />
              <DetailCard
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

        <p className="px-1 text-center text-[0.7rem] leading-relaxed text-stone-500">
          Adult PHM · MESA LV+RV · clinical support only
        </p>
      </main>
    </div>
  )
}

function MassBlock({
  label,
  mass,
  bmi,
  tone,
  align = "left",
}: {
  label: string
  mass: number
  bmi: number
  tone: "recipient" | "donor"
  align?: "left" | "right"
}) {
  return (
    <div className={cn(align === "right" && "text-right")}>
      <div
        className={cn(
          "mb-1 inline-flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-wide uppercase",
          tone === "recipient" ? "text-teal-800" : "text-rose-800",
          align === "right" && "flex-row-reverse"
        )}
      >
        <span
          className={cn(
            "size-2 rounded-full",
            tone === "recipient" ? "bg-teal-700" : "bg-rose-700"
          )}
        />
        {label}
      </div>
      <p className="font-heading text-[1.65rem] leading-none tabular-nums text-stone-900">
        {formatGrams(mass)}
      </p>
      <p className="mt-1 text-xs tabular-nums text-stone-500">BMI {formatBmi(bmi)}</p>
    </div>
  )
}

function DetailCard({
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
            "size-2 rounded-full",
            tone === "recipient" ? "bg-teal-700" : "bg-rose-700"
          )}
        />
        <h3 className="font-heading text-base text-stone-900">{title}</h3>
      </div>
      <p className="font-heading mt-2 text-2xl tabular-nums text-stone-900">
        {formatGrams(phm)}
      </p>
      <p className="mt-1 text-xs text-stone-500">BMI {formatBmi(bmi)}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-stone-200 pt-2 text-xs">
        <div>
          <p className="text-stone-500">LV</p>
          <p className="tabular-nums text-stone-800">{formatGrams(lv)}</p>
        </div>
        <div>
          <p className="text-stone-500">RV</p>
          <p className="tabular-nums text-stone-800">{formatGrams(rv)}</p>
        </div>
      </div>
    </div>
  )
}
