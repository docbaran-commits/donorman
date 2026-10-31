"use client"

import { useState } from "react"

import { PersonPanel, type PersonDraft } from "@/components/person-panel"
import {
  PHM_OVERSIZE_RATIO,
  PHM_UNDERSIZE_RATIO,
  formatBmi,
  formatBsa,
  formatGrams,
  formatPercent,
  formatRatio,
  isValidAdultMetrics,
  matchDonorRecipient,
  phmRatioBand,
  phmSizeCaution,
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
  const band = match ? phmRatioBand(match.phmRatio) : null
  const sizeCaution = match ? phmSizeCaution(match.phmRatio) : null
  const ratioPct = match ? Math.min(140, Math.max(0, match.phmRatio * 100)) : 0
  const pediatricRecipient = recipient.ageYears < 18

  return (
    <div className="mx-auto flex h-dvh max-h-dvh w-full max-w-lg flex-col overflow-hidden">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#efe8dc] pt-[env(safe-area-inset-top)]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 pt-2.5 pb-1">
          <h1 className="font-heading justify-self-start text-[1.35rem] leading-none tracking-tight text-stone-900 [transform:translateZ(0)]">
            DonorMan
          </h1>
          {match ? (
            <div className="flex flex-col items-center gap-0.5" aria-live="polite">
              <div className="flex items-baseline justify-center gap-1.5">
                <p
                  className={cn(
                    "text-[1.55rem] font-bold leading-none tabular-nums",
                    band === "ok" && "text-emerald-700",
                    band === "caution" && "text-amber-500",
                    band === "severe" && "text-red-600"
                  )}
                >
                  {formatRatio(match.phmRatio)}
                </p>
                <p className="text-[0.7rem] font-semibold tracking-wide text-stone-500 uppercase">
                  PHM ratio
                </p>
              </div>
              {sizeCaution && (
                <p
                  className={cn(
                    "text-[0.7rem] font-bold tracking-wide uppercase",
                    band === "severe" ? "text-red-600" : "text-amber-600"
                  )}
                >
                  Caution · {sizeCaution}
                </p>
              )}
            </div>
          ) : (
            <div />
          )}
          <div aria-hidden="true" />
        </div>

        {match && (
          <div className="space-y-1 bg-white px-3 py-1.5">
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
              <div
                className="absolute inset-y-0 w-0.5 bg-stone-900/70"
                style={{ left: `${Math.min(100, PHM_OVERSIZE_RATIO * 100)}%` }}
                aria-hidden="true"
              />
            </div>
            <div className="flex items-center justify-between text-[0.75rem] font-medium text-stone-600">
              <span>{formatPercent(match.phmPercentDifference)}</span>
              <span
                className={cn(
                  "font-bold",
                  band === "ok" && "text-emerald-700",
                  band === "caution" && "text-amber-600",
                  band === "severe" && "text-red-600"
                )}
              >
                {sizeCaution === "undersized"
                  ? `< ${PHM_UNDERSIZE_RATIO}`
                  : sizeCaution === "oversized"
                    ? `> ${PHM_OVERSIZE_RATIO}`
                    : `${PHM_UNDERSIZE_RATIO}–${PHM_OVERSIZE_RATIO}`}
              </span>
            </div>
          </div>
        )}

        <div className="grid h-1 grid-cols-2" aria-hidden="true">
          <div className="bg-teal-700" />
          <div className="bg-rose-700" />
        </div>

        {pediatricRecipient && (
          <p
            className="bg-amber-50 px-3 py-1.5 text-center text-[0.75rem] font-semibold leading-snug text-amber-900"
            role="status"
          >
            Not validated for pediatric recipients
          </p>
        )}
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 content-start gap-2 overflow-y-auto px-3 pt-2 pb-2 sm:grid-cols-2">
        <PersonPanel
          title="Recipient"
          accent="recipient"
          value={recipient}
          onChange={setRecipient}
        />
        <PersonPanel title="Donor" accent="donor" value={donor} onChange={setDonor} />
      </main>

      {match && (
        <footer className="shrink-0 border-t border-stone-200 bg-[#efe8dc] px-2.5 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom))]">
          <div className="rounded-lg bg-white px-2 py-1.5 ring-1 ring-stone-200">
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              <BmiBlock
                label="Recipient"
                bmi={match.recipient.bmi}
                bsaM2={match.recipient.bsaM2}
                tone="recipient"
              />
              <BmiBlock
                label="Donor"
                bmi={match.donor.bmi}
                bsaM2={match.donor.bsaM2}
                tone="donor"
              />
            </div>

            <p
              className="mt-1 text-center text-[0.8rem] font-bold tabular-nums text-stone-800"
              aria-live="polite"
            >
              Donor wt{" "}
              <span className="text-[0.95rem] text-stone-900">
                {formatWeightPercent(donor.weightKg, recipient.weightKg)}
              </span>{" "}
              <span className="font-semibold text-stone-500">of recipient</span>
            </p>

            <div className="mt-1 border-t border-stone-200/90 pt-1">
              <div className="grid grid-cols-2 gap-x-2">
                <HeartGrams
                  mass={match.recipient.predictedHeartMassG}
                  lv={match.recipient.leftVentricularMassG}
                  rv={match.recipient.rightVentricularMassG}
                  tone="recipient"
                />
                <HeartGrams
                  mass={match.donor.predictedHeartMassG}
                  lv={match.donor.leftVentricularMassG}
                  rv={match.donor.rightVentricularMassG}
                  tone="donor"
                />
              </div>
              <p
                className="mt-1 text-center text-[0.8rem] font-bold tabular-nums text-stone-800"
                aria-live="polite"
              >
                BSA ratio{" "}
                <span className="text-[0.95rem] text-stone-900">
                  {formatRatio(match.bsaRatio)}
                </span>{" "}
                <span className="font-semibold text-stone-500">donor ÷ recipient</span>
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

function formatWeightPercent(donorKg: number, recipientKg: number) {
  if (!Number.isFinite(donorKg) || !Number.isFinite(recipientKg) || recipientKg <= 0) {
    return "—"
  }
  return `${((donorKg / recipientKg) * 100).toFixed(0)}%`
}

function BmiBlock({
  label,
  bmi,
  bsaM2,
  tone,
}: {
  label: string
  bmi: number
  bsaM2: number
  tone: "recipient" | "donor"
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1">
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            tone === "recipient" ? "bg-teal-700" : "bg-rose-700"
          )}
        />
        <p
          className={cn(
            "text-[0.65rem] font-bold tracking-wide uppercase",
            tone === "recipient" ? "text-teal-800" : "text-rose-800"
          )}
        >
          {label}
        </p>
      </div>
      <p className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
        <span className="text-[0.65rem] font-bold tracking-wide text-stone-500 uppercase">
          BMI
        </span>
        <span className="text-[1.2rem] font-bold leading-none tabular-nums text-stone-900">
          {formatBmi(bmi)}
        </span>
        <span className="text-[0.7rem] font-semibold tabular-nums text-stone-600">
          · BSA {formatBsa(bsaM2)}
        </span>
      </p>
    </div>
  )
}

function HeartGrams({
  mass,
  lv,
  rv,
  tone,
}: {
  mass: number
  lv: number
  rv: number
  tone: "recipient" | "donor"
}) {
  return (
    <div className="min-w-0">
      <p
        className={cn(
          "text-[0.6rem] font-bold tracking-wide uppercase",
          tone === "recipient" ? "text-teal-800" : "text-rose-800"
        )}
      >
        Heart
      </p>
      <p className="text-[0.95rem] font-bold leading-none tabular-nums text-stone-800">
        {formatGrams(mass)}
      </p>
      <p className="mt-0.5 text-[0.65rem] font-medium tabular-nums text-stone-500">
        LV {formatGrams(lv)} · RV {formatGrams(rv)}
      </p>
    </div>
  )
}
