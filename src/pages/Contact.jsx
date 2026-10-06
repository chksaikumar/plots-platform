import EnquiryForm from "../components/EnquiryForm";
import Reveal from "../components/Reveal";

export default function Contact() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <Reveal>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">Talk to a plot expert</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-500">
            Have questions about a venture, approvals, pricing or site visits? Send us a
            message and our team will get back to you within 2 business hours.
          </p>
          <div className="mt-8 space-y-4">
            {[
              { label: "Phone", value: "+91 40 4890 1234", icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" },
              { label: "Email", value: "hello@plotscape.in", icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
              { label: "Office", value: "PlotScape, HITEC City, Hyderabad, Telangana", icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">{c.label}</div>
                  <div className="mt-0.5 text-sm font-semibold text-ink-900">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <EnquiryForm />
        </Reveal>
      </div>
    </div>
  );
}
