# Firebase Setup for PlotScape

PlotScape runs entirely on Firebase. Without a connected Firebase project the
site shows only the setup screen. Follow every step below to bring it online.

## 1. Create a Firebase project

1. Go to https://console.firebase.google.com and sign in with Google.
2. Click **Add project**, name it (e.g. `plots-platform`), and create it.
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

## 5. Authorize your production domain

Google sign-in only works on authorized domains. Without this step the
"Continue with Google" button fails on the live site.

1. Open **Build > Authentication > Settings > Authorized domains**.
2. Click **Add domain** and add your production domain
   (e.g. `plotscape.in`). `localhost` is already authorized for local testing.

## 6. Register the web app and get the config

1. On the project overview page, click the **</>** (web) icon to add an app.
2. Give it a nickname (e.g. `plots-web`). Hosting setup is not needed here.
3. Copy the `firebaseConfig` values shown.

## 7. Set the environment variables

1. In the project root, copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Fill in the values from step 6:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```
3. Restart the dev server after changing `.env`.

## 8. Make the first user an admin

1. On the live site, **Sign in with Google** (or sign up with email).
2. In the Firebase console, open **Firestore > users**. A document with your
   user id was created automatically on first sign-in.
3. Edit that document and change `role` from `user` to `admin`.
4. Sign out and sign back in on the site. The **Admin** link appears in the
   navbar and `/admin` opens the admin panel. Your signed-in email is shown
   at the top of the admin panel and your role badge on the account page
   reads "Administrator".

## 9. Seed the sample listings (optional)

The admin panel includes a **Seed sample listings** button on the Listings
tab. It imports the 24 bundled sample documents from
`src/data/listings.json` into the live `listings` collection, so you can
see the full site working before adding real inventory.

1. Open `/admin` and go to the **Listings** tab.
2. Click **Seed sample listings** and confirm.
3. Watch the progress message, then verify the listings appear on the map.

The JSON file is seed data only. The site never reads listings from it at
runtime. To change what the site shows, add, edit, or delete listings in
the admin panel or directly in Firestore.

## 10. Deploy

Build with `npm run build` and deploy the `dist/` folder to Netlify, Vercel,
Firebase Hosting, or Cloudflare Pages. Add the same six environment variables
in your hosting provider's dashboard so the live site connects to Firebase.

## Troubleshooting

- **Site shows only the setup screen**: the six `VITE_FIREBASE_*` variables
  are missing. Set them and rebuild.
- **"Could not load listings" banner**: the `listings` collection is empty.
  Add listings in `/admin` or use the seed button (step 9).
- **Admin link not visible**: your `users/{uid}` doc still has
  `role: "user"`. Update it in the console and sign in again.
- **Google sign-in popup blocked**: allow popups for your site, or use the
  email/password option instead.
- **Google sign-in fails on the live domain**: add the domain under
  Authentication > Settings > Authorized domains (step 5).
