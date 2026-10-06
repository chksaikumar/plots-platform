# Firebase Setup for PlotScape

The site works out of the box with the sample data in `src/data/listings.json`.
Follow these steps only when you want the real database: user accounts, an admin
panel, synced shortlists, and a leads inbox.

## 1. Create a Firebase project

1. Go to https://console.firebase.google.com and sign in with Google.
2. Click **Add project**, name it (e.g. `plotscape`), and create it.
   Google Analytics is optional.

## 2. Enable Firestore Database

1. In the left menu, open **Build > Firestore Database**.
2. Click **Create database**.
3. Choose **Start in production mode** (we deploy strict rules next).
4. Pick the closest region (e.g. `asia-south1` Mumbai for India).

## 3. Deploy the security rules

1. In Firestore, open the **Rules** tab.
2. Open the file `firestore.rules` in this repo, copy its full contents,
   paste into the rules editor, and click **Publish**.

The rules give you: public read of active listings, admin-only listing writes,
per-user favorites, and a public lead form with an admin-only inbox.

## 4. Enable Authentication

1. Open **Build > Authentication > Sign-in method**.
2. Enable **Google** (pick a support email when asked).
3. Enable **Email/Password**.

## 5. Register the web app and get the config

1. On the project overview page, click the **</>** (web) icon to add an app.
2. Give it a nickname (e.g. `plotscape-web`). Hosting setup is not needed here.
3. Copy the `firebaseConfig` values shown.

## 6. Set the environment variables

1. In the project root, copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Fill in the values from step 5:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
3. Restart the dev server after changing `.env`.

If these variables are missing, the site automatically falls back to the local
`src/data/listings.json` sample data with guest-only shortlists. Nothing breaks.

## 7. Make the first user an admin

1. On the live site, **Sign in with Google** (or sign up with email).
2. In the Firebase console, open **Firestore > users**. A document with your
   user id was created automatically on first sign-in.
3. Edit that document and change `role` from `user` to `admin`.
4. Sign out and sign back in on the site. The **Admin** link appears and
   `/admin` opens the admin panel.

## 8. Import the sample listings (optional)

The 24 sample listings live in `src/data/listings.json`. To manage them from
the admin panel instead of the JSON file:

1. In **Firestore > listings**, click **Add document** for each listing, or
   write a small import script with the Admin SDK.
2. Use the listing `id` (e.g. `emerald-enclave-shadnagar`) as the document id.
3. Copy the remaining fields as-is (camelCase names match the JSON file).
4. Set `active` to `true` for listings you want visible.

Once documents exist in the `listings` collection, the site reads from
Firestore instead of the JSON file.

## 9. Deploy

Build with `npm run build` and deploy the `dist/` folder to Netlify, Vercel,
Firebase Hosting, or Cloudflare Pages. Add the same six environment variables
in your hosting provider's dashboard so the live site connects to Firebase.

## Troubleshooting

- **Site shows sample data even with env vars set**: the `listings`
  collection is empty. Import listings (step 8) or add them in `/admin`.
- **Admin link not visible**: your `users/{uid}` doc still has
  `role: "user"`. Update it in the console and sign in again.
- **Google sign-in popup blocked**: allow popups for your site, or use the
  email/password option instead.
