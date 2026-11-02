import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy — DonorMan",
  description:
    "DonorMan privacy policy: on-device clinical calculator with no accounts, analytics, or data collection.",
}

export default function PrivacyPage() {
  return (
    <div className="privacy-doc fixed inset-0 z-50 overflow-y-auto overscroll-y-contain bg-[#f3efe6] text-stone-900">
      <main className="mx-auto max-w-2xl px-5 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[max(2.5rem,env(safe-area-inset-top))]">
        <p className="font-heading text-3xl text-stone-900">DonorMan</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-stone-600">
          Effective date: November 2, 2026 · App ID{" "}
          <code className="rounded bg-white/70 px-1.5 py-0.5 text-[0.85em]">
            com.docbaran.donorman
          </code>
        </p>

        <div className="mt-8 space-y-6 text-[1.02rem] leading-relaxed text-stone-800">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">Summary</h2>
            <p>
              DonorMan is a clinical calculator. It does{" "}
              <strong>not</strong> collect, store, sell, or share personal data.
              Calculations run on your device. There is no account, no login, and
              no analytics.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">
              Information the app does not collect
            </h2>
            <p>DonorMan does not collect:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Names, contact details, or identifiers</li>
              <li>Health records or patient identifiers</li>
              <li>Location, photos, contacts, or microphone/camera data</li>
              <li>Usage analytics, crash reports, or advertising IDs</li>
              <li>
                Payment or purchase information (the app is free and has no
                in-app purchases)
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">
              Information you enter
            </h2>
            <p>
              You may enter sex, age, height, and weight for a recipient and a
              donor so the app can compute predicted heart mass (PHM), BMI, and
              body surface area.
            </p>
            <p>Those values:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Stay on your device for the current session</li>
              <li>Are not uploaded to a server</li>
              <li>
                Are not saved to iCloud, HealthKit, or any cloud account by
                DonorMan
              </li>
              <li>
                Are discarded when you leave or quit the app (the app does not
                persist them)
              </li>
            </ul>
            <p>
              Do not enter names, medical record numbers, or other identifiers.
              The calculator does not need them.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">Network use</h2>
            <p>
              PHM, BMI, and BSA are computed locally. DonorMan does not require a
              network connection to calculate results.
            </p>
            <p>
              The optional web / PWA version may load static assets from the
              hosting site when you open it in a browser. That hosting provider
              may see standard web server logs (for example IP address and user
              agent), which DonorMan does not control or combine with calculator
              inputs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">Third parties</h2>
            <p>
              DonorMan does not integrate advertising SDKs, analytics SDKs,
              social login, or crash-reporting services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">Children</h2>
            <p>
              DonorMan is intended for clinicians and other adults involved in
              transplant sizing. It is not directed at children under 13, and it
              does not knowingly collect children’s data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">
              Medical disclaimer
            </h2>
            <p>
              DonorMan is a calculation aid for adult heart-transplant size
              matching. It is not a medical device diagnosis tool, not a
              substitute for clinical judgment or institutional protocols, and
              not validated for pediatric recipients.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">Changes</h2>
            <p>
              If this policy changes, the updated text will be posted at this
              URL, with a revised effective date.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-stone-900">Contact</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                GitHub issues:{" "}
                <a
                  className="font-semibold text-teal-800 underline underline-offset-2"
                  href="https://github.com/docbaran-commits/donorman/issues"
                >
                  docbaran-commits/donorman
                </a>
              </li>
              <li>
                App site:{" "}
                <Link
                  className="font-semibold text-teal-800 underline underline-offset-2"
                  href="/"
                >
                  DonorMan home
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <p className="mt-10 text-sm text-stone-500">
          © 2026 David Baran · DonorMan
        </p>
      </main>
    </div>
  )
}
