// Shown when Firebase is not configured. The whole app is gated behind
// Firebase, so this is the only thing an unconfigured deployment renders.
const STEPS = [
  {
    title: "Create a Firebase project",
    body: "Go to console.firebase.google.com, sign in with Google, and create a project. Google Analytics is optional.",
  },
  {
    title: "Enable Firestore Database",
    body: "Open Build, then Firestore Database, and create a database in production mode. Pick the region closest to your users, for example asia-south1 (Mumbai) for India.",
  },
  {
    title: "Enable Authentication",
    body: "Open Build, then Authentication, then Sign-in method. Enable the Google provider and the Email/Password provider.",
  },
  {
    title: "Add the web app config to .env",
    body: "Register a web app in Project settings, copy the firebaseConfig values, and paste them into a .env file in the project root. See .env.example for the exact variable names.",
  },
  {
    title: "Publish the security rules",
    body: "Copy the contents of firestore.rules from this repo into the Firestore Rules tab in the console and click Publish.",
  },
  {
    title: "Rebuild and deploy",
    body: "Run npm run build and deploy the dist folder. Add the same environment variables in your hosting provider's dashboard.",
  },
];

export default function SetupScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-950 px-4 py-16 font-sans text-white antialiased">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500 font-display text-xl font-bold text-brand-950">
            P
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight">
            Plot<span className="text-gold-400">Scape</span>
          </span>
        </div>

        <h1 className="mt-8 text-center font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Connect Firebase to launch PlotScape
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-white/70 sm:text-base">
          This site runs entirely on Firebase: the listings database, user
          sign-in, shortlists, and the admin panel. Complete the steps below
          to bring it online.
        </p>

        <div className="mt-10 space-y-3">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="flex gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-inset ring-white/10"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 font-display text-base font-bold text-brand-950">
                {i + 1}
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold">{s.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-white/65">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-white/50">
          Full details, including making the first user an admin and seeding
          sample listings, are in FIREBASE_SETUP.md in the project.
        </p>
      </div>
    </div>
  );
}
