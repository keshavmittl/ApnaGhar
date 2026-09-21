# Apna Ghar — Real Estate Platform

Apna Ghar ("Our Home") is a full-stack real estate marketplace where users can browse property listings, search and filter by location and price, save and compare properties, chat with owners in real time, and publish or update their own listings. The project is built as a monorepo with separate frontend, backend API, and socket services.

## Features

- User registration and login with JWT cookie-based authentication
- Property listing creation, editing, browsing, and deletion
- Search, filtering, and map-based property discovery
- Saved properties, bought properties, and compare view
- Real-time buyer-seller chat using Socket.IO
- Cloudinary image uploads for avatars and property photos
- Razorpay payment order integration for property purchase flow

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Axios
- Zustand
- React Leaflet / Leaflet
- React Toastify
- Sass

### Backend

- Node.js
- Express
- Prisma ORM
- MongoDB
- JWT
- bcrypt
- Razorpay SDK

### Realtime

- Socket.IO

## Project Structure

```text
ApnaGhar/
├── api/        # Express API + Prisma + MongoDB
├── Frontend/   # React frontend
├── socket/     # Socket.IO server
└── README.md
```

## Screenshots

> The screenshots in `screenshots/` reflect the previous "UrbanLiving" design and should be re-captured against the current Apna Ghar UI.

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ApnaGhar
```

### 2. Backend setup

Copy `api/.env.example` to `api/.env` and fill in your values:

```env
DATABASE_URL="your_mongodb_connection_string"
JWT_SECRET_KEY="your_jwt_secret"
CLIENT_URL="http://localhost:5173"
PORT=8800
NODE_ENV=development
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="support.apnaghar@gmail.com"
SMTP_PASS="your_smtp_app_password"
CONTACT_TO="support.apnaghar@gmail.com"
```

Install and run:

```bash
cd api
npm install
npx prisma generate
npm run dev
```

### 3. Frontend setup

Copy `Frontend/.env.example` to `Frontend/.env` and fill in your values:

```env
VITE_API_BASE_URL="http://localhost:8800"
VITE_SOCKET_URL="http://localhost:4000"
VITE_RAZORPAY_KEY="your_razorpay_key_id"
VITE_CLOUDINARY_CLOUD_NAME="dvf3kntug"
VITE_CLOUDINARY_UPLOAD_PRESET="estate"
```

Install and run:

```bash
cd Frontend
npm install
npm run dev
```

### 4. Socket server setup

Copy `socket/.env.example` to `socket/.env`:

```env
PORT=4000
FRONTEND_URL="http://localhost:5173"
```

Install and run:

```bash
cd socket
npm install
node app.js
```

## Running the Project

Run all three services in separate terminals:

- Backend API: `http://localhost:8800`
- Frontend: `http://localhost:5173`
- Socket server: `http://localhost:4000`

## Seeding Demo Data

Once `api/.env` is configured with your `DATABASE_URL`, populate the database with sample users, listings, saved/bought relations, and chat history so the redesigned UI can be demoed end to end:

```bash
cd api
npm run seed
# or: npx prisma db seed
```

The seed script is **idempotent** — rerunning it upserts the demo users and replaces all demo-owned data without touching records created by real accounts.

Demo accounts (password for every account is `apnaghar123`):

| Username | Email               | What to try with them                                |
| -------- | ------------------- | ---------------------------------------------------- |
| `priya`  | priya@apnaghar.demo | Buyer profile — saved homes, a purchased (SOLD) listing, and an unread chat notification |
| `rahul`  | rahul@apnaghar.demo | Owner — My Listings, a coming-soon property, and an unread chat from `amit` |
| `anjali` | anjali@apnaghar.demo | Owner of the SOLD Dwarka condo and the Hauz Khas listing |
| `vikram` | vikram@apnaghar.demo | Owner with rentals and buy listings across South India |
| `amit`   | amit@apnaghar.demo   | Second buyer to demo owner-side chat                 |

Great first walkthrough: log in as **priya** — the navbar shows a notification badge (1 unread message from Anjali), the profile page shows her listings, saved homes (try the compare checkboxes), and the purchased property, and the Messages panel has full conversations. Then search Delhi to see the **SOLD** card on the Dwarka condo.

## Contact Form Delivery

The contact form submits to `POST /api/contact`, which validates the payload, rate-limits submissions per IP (5 per 10 minutes), and delivers the message by email over SMTP. Without SMTP credentials the endpoint answers `503` and the form explains that delivery isn't configured.

For Gmail (or Google Workspace), enable 2-Step Verification on the account and create an **app password** at https://myaccount.google.com/apppasswords — use that as `SMTP_PASS`. Messages are sent to `CONTACT_TO` and replies go to the visitor's address via `reply-to`.

## Payment Setup

To enable payments:

- create a Razorpay account
- generate test API keys
- add them to `api/.env` and `Frontend/.env`
- make sure the payment route is enabled in `api/app.js`

## Notes

- MongoDB Atlas is recommended if local MongoDB replica set setup is not available.
- Cloudinary upload presets must be valid for avatar and property image uploads to work.
- The backend uses protected routes for post creation, editing, saving, chat, and profile operations.# ApnaGhar
