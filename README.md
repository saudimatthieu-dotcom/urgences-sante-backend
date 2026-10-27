# Urgences Santé (API)

Backend of **Urgences Santé**, a mobile app built as a team for the final project of the La Capsule full-stack bootcamp.

In a non-critical emergency, the app helps people find a nearby volunteer first responder (*secouriste*) and the hospital best suited to their situation. It is designed as a complement to the emergency services (15 / SAMU), never a substitute.

The mobile app (React Native) is in the team repository: [laurentveyrat/urgence-sante](https://github.com/laurentveyrat/urgence-sante).

## Features

- **Two kinds of users**: people asking for help, and certified volunteer first responders
- **Alerts**: a user sends an alert to a nearby first responder, who accepts it and closes it once the person has been helped
- **First responders**: availability on/off, live location, certifications (PSE1, PSE2…)
- **Hospitals** with their specialties and location
- **Health records** and practitioners linked to each user
- **Accounts**: sign up, sign in, profile with photo upload

## Stack

Node.js, Express, MongoDB (Mongoose), bcrypt and uid2 for authentication, Cloudinary for profile photos. Deployed on Vercel.

## API

| Route              | Endpoints |
| ------------------ | --------- |
| `/users`           | `POST /signup`, `POST /signin`, `GET /profile/:token`, `PUT /profile`, `POST /profile/upload`, `DELETE /profile/photo` |
| `/alerts`          | `POST /`, `GET /pending/:token`, `GET /:alertId`, `PUT /:alertId/accept`, `PUT /:alertId/close` |
| `/firstResponders` | `GET /`, `GET /me/:token`, `PUT /availability`, `PUT /location` |
| `/hospitals`       | `GET /` |
| `/healthRecords`   | `POST /`, `GET /:token` |
| `/practitioners`   | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |

## Getting started

```bash
npm install
npm start
```

Create a `.env` file with:

| Variable            | Description |
| ------------------- | ----------- |
| `CONNECTION_STRING` | MongoDB connection string |
| `CLOUDINARY_URL`    | Cloudinary credentials, for profile photos |

The `data/` folder holds fictional demo data (users, first responders, hospitals, health records) to import into MongoDB.
