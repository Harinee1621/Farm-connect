# Farm Connect

Farm Connect is a React, TypeScript, and Tailwind marketplace prototype for direct farmer-to-consumer orders.

## Run locally

Requirements: Node.js 18 or newer.

```powershell
npm install
npm run dev
```

Create a production build with `npm run build`.

## Current app mode

The app starts with no sample farmer accounts, consumer accounts, products, or orders. Register as a farmer or consumer, then sign in using that role, email, and password. Passwords are PBKDF2-hashed before being stored with the account in this browser. Profiles, listings, orders, and notifications are stored in `localStorage` and synchronize between open tabs in the same browser profile.

This is still a local prototype, not production authentication or a shared database: browser data can be cleared or modified by the device owner, and accounts do not work across separate browsers or devices. Hardcoded demo accounts and their sample data are removed on startup. Existing user-created profiles, listings, and orders are retained; because the previous version did not save passwords, reclaim an existing profile by registering again with its same role and email and setting a password. Do not use this mode for real customer data or transactions.

The Supabase schema in `supabase/schema.sql` is a design reference only. Setting Supabase URL/key values does not connect marketplace reads or writes, authentication, image storage, or realtime notifications.

Order requests start in **Waiting for Farmer Approval**. Farmers can accept or reject their own requests in the demo flow, and product quantity is checked again on acceptance. Cash on delivery/pickup is available as a pending collection method. Online payment is disabled until a real payment provider is integrated; the app must not treat a request as paid merely because it was submitted or delivered.

## Production work still required

- Connect Supabase Auth and persist profile/product/order data using authenticated requests.
- Replace permissive database policies with verified, least-privilege RLS policies and transactional order/stock operations.
- Configure private/public image storage policies and upload product images.
- Add realtime subscriptions for order and message notifications.
- Integrate a payment provider with server-side verification before recording successful online payments.
- Provision administrator access securely; the local demo dashboard is not an access-control boundary.

Never put a Supabase service-role key or payment secret in the browser. Only a Supabase publishable/anon key may be exposed client-side, with correctly configured RLS.
