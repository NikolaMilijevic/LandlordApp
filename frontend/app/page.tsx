"use client";

import Image from "next/image";
import { DollarSign, User, Wrench, FileText, CheckCircle } from "lucide-react";

export default function Home() {

  return (
    <main className="min-h-screen bg-softGray text-navy font-sans">

      {/* NAV */}
      <nav className="flex items-center justify-between px-10 py-4 bg-navy border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image
            src="/lessor_logo_only_transparent.png"
            alt="Lessor logo"
            width={36}
            height={36}
            className="object-contain brightness-0 invert"
          />
          <span className="font-semibold text-lg text-white tracking-tight">
            Lessor
          </span>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-navy text-white px-6 pt-24 pb-28 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block bg-emerald/20 text-emerald text-xs font-medium px-4 py-1.5 rounded-full mb-8 border border-emerald/30">
            Early access — first 50 members get 3 months free
          </div>

          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
            Stop managing your rentals{" "}
            <span className="text-emerald">in spreadsheets</span>
          </h1>

          <p className="text-lg text-white/70 mb-10 leading-relaxed">
            A simple property management tool built for landlords with 1–10 units.
            Track rent, manage tenants, and handle maintenance — all in one place.
          </p>

          <button
            data-tally-open="Npb9vW"
            data-tally-emoji-text="👋"
            data-tally-emoji-animation="wave"
            data-tally-width="500"
            className="inline-flex items-center gap-2 bg-emerald text-navy font-semibold px-8 py-3.5 rounded-full hover:bg-emerald/90 transition text-base cursor-pointer"
          >
            Join the waitlist →
          </button>

          <p className="text-xs text-white/40 mt-3">
            No credit card. No commitment. Just early access.
          </p>
        </div>
      </section>

      {/* SOCIAL PROOF STRIP */}
      <section className="bg-royal py-4 px-6">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-8 text-sm text-white/80">
          {[
            "✓ Built for 1–10 unit landlords",
            "✓ No setup fees",
            "✓ Cancel anytime",
            "✓ First 50 get 3 months free",
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="bg-lightBlue py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-4 text-navy">
            Built for landlords who are done with this
          </h2>
          <p className="text-center text-navy/60 mb-12 text-base">
            Sound familiar?
          </p>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {[
              "Tracking rent in a spreadsheet that's always out of date",
              "Digging through WhatsApp to find what a tenant reported",
              "Missing lease renewals because nothing reminded you",
              "Scrambling to find documents when something goes wrong",
              "Paying hundreds a month for software built for 100+ unit managers",
            ].map((pain, i) => (
              <div
                key={pain}
                className={`flex items-start gap-4 px-6 py-4 ${i !== 4 ? "border-b border-gray-100" : ""}`}
              >
                <span className="text-red-400 font-bold text-base mt-0.5 flex-shrink-0">✕</span>
                <p className="text-sm text-navy/70 leading-relaxed">{pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white border-y border-gray-200 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-4 text-navy">
            Everything a small landlord actually needs
          </h2>
          <p className="text-center text-navy/60 mb-14 text-base">
            Nothing you don't.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: DollarSign,
                title: "Rent tracking",
                desc: "Know instantly who has paid and who hasn't. Automatic overdue alerts so you never chase rent manually.",
                color: "bg-mint text-emerald",
              },
              {
                icon: User,
                title: "Tenant management",
                desc: "All your tenant info, lease dates, and payment history in one place. Lease expiry reminders included.",
                color: "bg-lightBlue text-royal",
              },
              {
                icon: Wrench,
                title: "Maintenance requests",
                desc: "Log and track every issue with timestamps. A paper trail that protects you in any dispute.",
                color: "bg-mint text-emerald",
              },
              {
                icon: FileText,
                title: "Document storage",
                desc: "Store leases, insurance certificates, and receipts. Automatic expiry reminders before anything lapses.",
                color: "bg-lightBlue text-royal",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-softGray rounded-2xl p-6 border border-gray-200">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-navy">{f.title}</h3>
                  <p className="text-sm text-navy/60 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-lightBlue py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-4 text-navy">
            Simple by design
          </h2>
          <p className="text-center text-navy/60 mb-14 text-base">
            Set up in minutes. No training required.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Add your properties", desc: "Enter your properties and units in minutes. No complex setup." },
              { step: "02", title: "Add your tenants", desc: "Link tenants to units with lease dates and rent amounts." },
              { step: "03", title: "Track everything", desc: "Rent, maintenance, documents — all in one dashboard." },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="text-3xl font-bold text-emerald mb-4">{s.step}</div>
                <h3 className="text-base font-semibold mb-2 text-navy">{s.title}</h3>
                <p className="text-sm text-navy/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-4 text-navy">
            What early members get
          </h2>
          <p className="text-center text-navy/60 mb-12 text-base">
            Join before we launch and lock in a deal that won't be available later.
          </p>
          <div className="bg-navy rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-emerald mb-1">3 months</div>
              <div className="text-white/60 text-sm">completely free for the first 50 members</div>
            </div>
            {[
              "Full access to all features from day one",
              "Priority support during beta",
              "Your feedback shapes the product",
              "Then €12/month after — cancel anytime",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0" />
                <span className="text-sm text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WAITLIST FORM */}
      {/* WAITLIST */}
      <section id="waitlist" className="bg-navy py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get early access
          </h2>
          <p className="text-white/60 mb-2 text-base">
            First 50 members get 3 months free — then €12/month after that.
          </p>
          <p className="text-white/40 text-sm mb-10">
            No credit card required to join the waitlist.
          </p>

          <button
            data-tally-open="Npb9vW"
            data-tally-emoji-text="👋"
            data-tally-emoji-animation="wave"
            data-tally-width="500"
            className="inline-flex items-center gap-2 bg-emerald text-navy font-semibold px-10 py-4 rounded-full hover:bg-emerald/90 transition text-base cursor-pointer mx-auto"
          >
            Join the waitlist →
          </button>

          <p className="text-white/40 text-xs mt-4">
            A popup will open — takes 10 seconds to sign up.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-12">
            {[
              { num: "50", label: "Early access spots" },
              { num: "€0", label: "For first 3 months" },
              { num: "1–10", label: "Units supported" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-emerald">{stat.num}</div>
                <div className="text-xs text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
<footer className="px-6 sm:px-10 py-8 border-t border-gray-200 bg-white">
  <div className="mx-auto flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-4">
    <div className="flex items-center gap-3">
      <Image
        src="/lessor_logo_transparent.png"
        alt="Lessor logo"
        width={44}
        height={44}
        className="object-contain"
      />
      <div>
        <div className="font-semibold text-navy text-sm">Lessor</div>
        <div className="text-xs text-navy/50">Manage. Track. Grow.</div>
      </div>
    </div>
    <div className="text-xs text-navy/40 text-center">
      © {new Date().getFullYear()} Lessor. All rights reserved.
    </div>
  </div>
</footer>

    </main>
  );
}