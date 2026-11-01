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
    <div className="min-h-dvh w-full">
      {/*
        .phone-shell is position:fixed to the visual viewport (see globals.css)
        so the results strip can sit on the real iPhone bottom edge. Portrait
        stays phone-width; landscape goes full width with side-by-side panels.
      */}
      <div className="phone-shell flex flex-col overflow-hidden bg-[#f3efe6] min-[500px]:border-r min-[500px]:border-stone-300/70 min-[500px]:bg-[#f3efe6]/80 min-[500px]:shadow-[8px_0_28px_rgba(28,25,23,0.06)] landscape:border-0 landscape:bg-[#f3efe6] landscape:shadow-none">
      <header className="phone-header shrink-0 border-b border-stone-200 bg-[#efe8dc] pt-[max(0.25rem,env(safe-area-inset-top))] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 pt-2.5 pb-1 landscape:px-4 landscape:pt-1.5 landscape:pb-0.5">
          <h1 className="font-heading justify-self-start text-[1.35rem] leading-none tracking-tight text-stone-900 landscape:text-[1.2rem]">
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
          <div className="space-y-1 bg-white px-3 py-1.5 landscape:space-y-0.5 landscape:py-1">
            <div className="relative h-2 overflow-hidden rounded-full bg-stone-200 landscape:h-1.5">
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

      {/*
        .panels (globals.css) is a 1fr/1fr grid in portrait so Recipient and
        Donor get identical outer heights. Landscape: side by side.
      */}
      <main className="panels min-h-0 flex-1 gap-2 overflow-hidden px-3 pt-2 pb-1 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] landscape:gap-3 landscape:px-4 landscape:pt-2 landscape:pb-1">
        <PersonPanel
          title="Recipient"
          accent="recipient"
          value={recipient}
          onChange={setRecipient}
          className="min-h-0 w-full overflow-y-auto overscroll-y-contain"
        />
        <PersonPanel
          title="Donor"
          accent="donor"
          value={donor}
          onChange={setDonor}
          className="min-h-0 w-full overflow-y-auto overscroll-y-contain"
        />
      </main>

      {match && (
        <footer className="shrink-0 border-t border-stone-200 bg-white px-2.5 pt-1 pb-1.5 pl-[max(0.625rem,env(safe-area-inset-left))] pr-[max(0.625rem,env(safe-area-inset-right))] landscape:px-4 landscape:pt-1 landscape:pb-1">
          <div className="landscape:flex landscape:flex-wrap landscape:items-center landscape:justify-between landscape:gap-x-4 landscape:gap-y-1">
            <div className="grid grid-cols-2 gap-x-2 gap-y-0 landscape:flex landscape:flex-1 landscape:gap-x-4">
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
              className="mt-0.5 text-center text-[0.8rem] font-bold tabular-nums text-stone-800 landscape:mt-0 landscape:shrink-0"
              aria-live="polite"
            >
              Donor wt{" "}
              <span className="text-[0.95rem] text-stone-900">
                {formatWeightPercent(donor.weightKg, recipient.weightKg)}
              </span>{" "}
              <span className="font-semibold text-stone-500">of recipient</span>
            </p>

            <div className="mt-0.5 border-t border-stone-200/90 pt-0.5 landscape:mt-0 landscape:flex landscape:flex-1 landscape:items-center landscape:justify-end landscape:gap-x-4 landscape:border-t-0 landscape:pt-0">
              <div className="grid grid-cols-2 gap-x-2 landscape:flex landscape:gap-x-4">
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
                className="mt-0.5 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0 text-center text-[0.8rem] font-bold tabular-nums text-stone-800 landscape:mt-0 landscape:flex-col landscape:items-end landscape:gap-0"
                aria-live="polite"
              >
                <span>
                  BSA{" "}
                  <span className="text-[0.95rem] text-stone-900">
                    {formatRatio(match.bsaRatio)}
                  </span>
                  <span className="mx-1 text-stone-300" aria-hidden="true">
                    ·
                  </span>
                  BMI{" "}
                  <span className="text-[0.95rem] text-stone-900">
                    {formatRatio(match.bmiRatio)}
                  </span>
                </span>
                <span className="w-full text-[0.7rem] font-semibold text-stone-500 landscape:w-auto">
                  donor ÷ recipient
                </span>
              </p>
            </div>
          </div>
        </footer>
      )}
      </div>
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
