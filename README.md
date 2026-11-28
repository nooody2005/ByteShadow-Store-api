# 🎨 Byte Shadow — Full-Stack Art Marketplace

<p align="center">
  <strong>Where Art Meets Technology ✨</strong>
</p>

**Byte Shadow** is a full-stack online art marketplace created to showcase and sell unique handmade paintings through an interactive shopping and auction experience.

Unlike a traditional online store, Byte Shadow combines an artwork gallery with a complete auction system, allowing users to explore paintings, place bids, compete for artwork, win auctions, complete payments, and track their purchases.

Built from scratch using **Node.js, Express.js, MongoDB, Mongoose, and Pug**, the project covers the complete development journey — from designing the frontend and building the backend to integrating online payments and deploying the application.

🌍 **Live Project:** [Byte Shadow](https://byteshadow.art)

---

## 🌟 Project Highlights

- 🎨 A complete online marketplace dedicated to handmade paintings.
- 🏗️ Full-stack application developed from scratch.
- 🔐 JWT-based authentication and role-based authorization.
- 🔨 Interactive auction and bidding system.
- ⏰ Automated auction completion using scheduled jobs.
- 🏆 Automatic winner determination and order creation.
- 💳 Paymob payment integration with webhook verification.
- 📦 Order management and shipping status tracking.
- 👤 Personalized user account with bidding and purchase history.
- ☁️ Deployed on Render and publicly accessible online.
- 🔎 Indexed by Google and promoted through an online advertising campaign.

---

## ✨ Main Features

### 🎨 1. Artwork Gallery

Explore a collection of unique handmade paintings through an art-focused interface.

- Display available paintings dynamically from MongoDB.
- View painting images, names, descriptions, sizes, and prices.
- Browse paintings through category filters:
  - All
  - Expressive
  - Romantic
  - Nature
- Display painting availability and auction status.
- Navigate to dedicated painting details pages.

### 🖼️ 2. Painting Details

Every painting has its own dedicated details page.

- Main artwork image and descriptions.
- Painting dimensions and current price.
- Auction starting and ending dates.
- Current highest bid.
- Decoration inspiration images.
- Painting process and stage images.
- Dynamic bidding interface based on painting status.

### 🔐 3. Authentication & Authorization

A complete authentication system built with JWT.

- User registration and login.
- Secure password hashing.
- JWT-based authentication.
- HTTP-only cookie authentication.
- Protected routes and APIs.
- Role-based authorization.
- User and administrator roles.
- Logout functionality.
- Password update and reset endpoints.

### 👤 4. User Account

Each registered user has a personalized account area.

**Account Settings**
- Update personal information.
- Manage phone number and address.
- Update profile information.
- Change password.

**My Bids**
- View previously placed bids.
- Track bidding activity.
- Check painting and auction status.

**Favorites**
- Access the Favorites section.

**My Purchases**
- View personal orders.
- Check payment status.
- Access available payment actions.
- Track shipping progress.

### 🔨 5. Auction & Bidding System

One of the core features of Byte Shadow is its dynamic auction system.

Users can participate in eligible painting auctions and compete by placing bids.

**Bid Validation**
- Authentication is required before bidding.
- Users must provide their phone number and address.
- The painting must be eligible for bidding.
- The auction must be within its valid time range.
- Each new bid must exceed the current highest price.

**Bid Processing**

When a valid bid is submitted:

1. The backend validates the painting and auction status.
2. The bid amount is checked against the current price.
3. A new bid record is created.
4. The painting's current price is updated.
5. The highest bidder is updated.
6. The total bid count is incremented.

**Guest Bidding Experience**

If a guest tries to place a bid:

- They are redirected to the login page.
- The original painting URL is preserved.
- After successful login, they can return to the painting they wanted to bid on.

### ⏰ 6. Automated Auction Management

Auction completion is handled automatically through a scheduled backend job.

The auction job periodically checks for expired active auctions.

**When an auction ends with bids:**

1. The highest bidder is selected as the winner.
2. The final price is recorded.
3. The painting status changes to `reserved`.
4. An order is automatically created for the winner.

**When an auction ends without bids:**

- The auction is marked as `ended`.
- No winner order is created.

**Auction Restart**

An ended auction with no bids can be restarted when a new bid is placed.

- The auction starts again from the current time.
- The new auction duration is 14 days.
- The painting returns to the `active` state.

### 🏆 7. Automatic Order Creation

After an auction ends with a winner, the backend creates an order associated with:

- The winning user.
- The corresponding painting.
- The final auction price.

The order begins in an unpaid state and proceeds to the payment stage.

### 💳 8. Paymob Payment Integration

Byte Shadow integrates **Paymob** to process online payments.

The payment workflow includes:

- Creating payment intentions through the backend.
- Redirecting customers to Paymob Unified Checkout.
- Associating payments with the correct orders.
- Handling payment notifications through webhooks.
- Verifying webhook authenticity using HMAC.
- Validating payment amounts before updating order records.

**Payment Flow**

```text
User opens My Purchases
        ↓
Selects an unpaid order
        ↓
Clicks Pay Now
        ↓
Backend creates Paymob Payment Intention
        ↓
User is redirected to Unified Checkout
        ↓
User completes payment
        ↓
Paymob sends webhook notification
        ↓
Backend verifies HMAC and payment amount
        ↓
Order and painting statuses are updated
```

**Payment Results**

| Payment Result | Order Status | Painting Status |
|---|---|---|
| Pending | `pending` | `reserved` |
| Failed | `pending` | `reserved` |
| Successful | `paid` | `sold` |

Payment verification is handled on the backend rather than trusting the frontend redirect.

### 📦 9. Order & Shipping Tracking

Orders have separate payment and shipping states.

**Order Status**
- `pending`
- `paid`
- `cancelled`

**Payment Status**
- `unpaid`
- `paid`
- `failed`

**Shipping Status**
- `processing`
- `shipped`
- `delivered`

The shipping lifecycle:

```text
Payment Successful
        ↓
Processing
        ↓
Shipped
        ↓
Delivered
```

This separation makes it possible to distinguish a successful payment from the actual delivery of the artwork.

---

## 🏗️ Application Architecture

Byte Shadow follows the **Model–View–Controller (MVC)** architectural pattern using Express.js.

```text
                  Browser
                     |
                     ▼
              Express Server
                     |
          ┌──────────┴──────────┐
          ▼                     ▼
       Routes              Middleware
          |              Authentication
          |              Authorization
          |              Validation
          ▼
      Controllers
          |
          ▼
        Models
          |
          ▼
       MongoDB
```

**Main Responsibilities**

| Layer | Responsibility |
|---|---|
| Models | Database schemas, relationships, and data operations. |
| Views | Server-rendered pages using Pug templates. |
| Controllers | Application logic and business rules. |
| Routes | Mapping URLs to controllers and middleware. |
| Middleware | Authentication, authorization, and request processing. |
| Utils | Shared helpers, error handling, auction jobs, and payment utilities. |

---

## 🛠️ Technology Stack

### Backend

| Technology | Usage |
|---|---|
| 🟢 Node.js | JavaScript runtime. |
| 🚂 Express.js | Backend framework and REST API development. |
| 🍃 MongoDB Atlas | Cloud database. |
| Mongoose | MongoDB object modeling and relationships. |
| Pug | Server-side rendering and dynamic templates. |
| JWT | Authentication and authorization. |
| Axios | HTTP requests from the frontend. |
| Node Cron | Scheduled auction processing. |
| Paymob | Online payment integration. |

### Frontend

- HTML5
- CSS3
- JavaScript (ES6+)
- Pug Templates
- Parcel
- Font Awesome
- Google Fonts

### Security & Middleware

- Helmet
- Express Rate Limit
- Express Mongo Sanitize
- HPP
- XSS Protection Middleware
- Cookie Parser
- Method Override

### Deployment & Tools

- Git & GitHub
- Render
- MongoDB Atlas
- Parcel
- Postman

---

## 📂 Project Structure

The following is a simplified overview of the main application structure:

```text
ByteShadow-Store/
│
├── 📁 controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── paintingController.js
│   ├── bidController.js
│   ├── orderController.js
│   ├── viewsController.js
│   └── errorController.js
│
├── 📁 models/
│   ├── userModel.js
│   ├── paintingModel.js
│   ├── bidModel.js
│   └── orderModel.js
│
├── 📁 routes/
│   ├── userRoutes.js
│   ├── paintingRoutes.js
│   ├── bidRoutes.js
│   ├── orderRoutes.js
│   └── viewRouter.js
│
├── 📁 utils/
│   ├── appError.js
│   ├── catchAsync.js
│   ├── auctionJob.js
│   └── paymob.js
│
├── 📁 views/
│   ├── base.pug
│   ├── overview.pug
│   ├── painting.pug
│   ├── login.pug
│   ├── signup.pug
│   ├── account.pug
│   └── 📁 admin/
│
├── 📁 public/
│   ├── 📁 css/
│   ├── 📁 js/
│   └── 📁 img/
│       └── 📁 paintings/
│
├── app.js
├── server.js
├── database.js
├── package.json
└── .gitignore
```

---

## 🔌 API Overview

The application exposes RESTful API endpoints for its main resources.

### Authentication & Users

Base URL:

```text
/api/v1/users
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new user. |
| POST | `/login` | Authenticate a user. |
| GET | `/logout` | Log out. |
| GET | `/me` | Get current user information. |
| PATCH | `/updateMe` | Update profile information. |
| PATCH | `/updateMyPassword` | Update password. |
| POST | `/forgetPassword` | Request password reset. |
| PATCH | `/resetPassword/:token` | Reset password. |

### Paintings & Bidding

Base URL:

```text
/api/v1/paintings
```

The painting API handles painting data and auction-related operations.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/:paintingId/bids` | Place a bid on a painting. |

### Bids

Base URL:

```text
/api/v1/bids
```

The bidding API supports retrieving bid records and user bidding history.

### Orders & Payments

Base URL:

```text
/api/v1/orders
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/:orderId/pay` | Initiate payment for an order. |
| POST | `/paymob-webhook` | Receive Paymob payment notifications. |

*Note: This is a selected API overview, not the complete route inventory.*

---

## 🔐 Security Considerations

Security is an important part of the application, especially when handling user accounts, auctions, and payments.

Implemented security-related mechanisms include:

- Password hashing.
- JWT-based authentication.
- HTTP-only authentication cookies.
- Protected routes.
- Role-based authorization.
- Rate limiting.
- Security headers.
- MongoDB query sanitization.
- HTTP parameter pollution protection.
- Payment webhook HMAC verification.
- Payment amount validation.
- Server-side bid validation.
- Order ownership checks.

Sensitive configuration values are managed through environment variables and should never be committed to the repository.

---

## ☁️ Deployment

Byte Shadow is deployed on **Render**, with MongoDB Atlas providing the hosted database.

The deployment process includes:

1. Preparing the application for production.
2. Pushing the project source code to GitHub.
3. Connecting the repository to Render.
4. Configuring production environment variables.
5. Connecting the application to MongoDB Atlas.
6. Deploying the Express application.
7. Testing the live website and its main features.

The project also went beyond development and deployment:

- 🌍 Published as a live website.
- 🔎 Made discoverable through Google Search indexing.
- 📢 Promoted through an online advertising campaign.

This provided practical experience with the journey from building a web application to making it publicly accessible.

---

## 🧠 Challenges & Technical Experience

Building Byte Shadow involved solving practical challenges beyond writing application code.

Some of the important areas included:

- Designing the relationship between users, paintings, bids, and orders.
- Handling auction timing and automatic winner selection.
- Preventing invalid bids and unauthorized actions.
- Keeping painting, order, payment, and shipping states consistent.
- Integrating an external payment provider.
- Verifying payment notifications securely.
- Managing image files and their paths across local development and deployment.
- Handling database connectivity and production configuration.
- Organizing frontend assets and JavaScript build workflows.
- Debugging server-side errors and deployment issues.

These challenges helped turn the project into a practical full-stack development experience.

---

## 🚀 Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/nooody2005/ByteShadow-Store-api.git
```

### 2. Navigate to the Project

```bash
cd ByteShadow-Store-api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create the environment file expected by the application and configure the required values.

Typical configuration includes:

```env
PORT=8000
BASE_URL=http://localhost:8000

DATABASE=your_mongodb_connection_string

PAYMOB_API_KEY=your_paymob_api_key
PAYMOB_SECRET_KEY=your_paymob_secret_key
PAYMOB_INTEGRATION_ID=your_paymob_integration_id
PAYMOB_PUBLIC_KEY=your_paymob_public_key
PAYMOB_HMAC_SECRET=your_paymob_hmac_secret
```

Make sure to use the exact variable names and environment file expected by the current application.

**Never commit real credentials or secret values to GitHub.**

### 5. Start the Application

```bash
npm start
```

The application runs on the configured port.

---

## 📚 Key Concepts & Skills Demonstrated

Through Byte Shadow, I gained practical experience in:

- Full-stack web application development.
- MVC architecture.
- RESTful API design.
- Express middleware and routing.
- MongoDB data modeling and Mongoose relationships.
- JWT authentication and role-based authorization.
- Server-side rendering with Pug.
- Asynchronous JavaScript and error handling.
- Business logic implementation.
- Auction and bidding system design.
- Scheduled background jobs.
- Third-party payment integration.
- Webhook handling and HMAC verification.
- Environment variables and production configuration.
- Frontend bundling with Parcel.
- Git and GitHub workflows.
- Cloud deployment and production troubleshooting.

---

## 🎯 Project Purpose

Byte Shadow started as a personal idea: creating an online space where handmade artwork could be presented and sold.

What began as a frontend design evolved into a complete full-stack application with real business workflows, database integration, automated auctions, online payments, and deployment.

It represents my practical journey in turning an idea into a working web product — from designing the interface to implementing the backend logic and publishing the website online.

---

<p align="center">
  <strong>🎨 Byte Shadow — Where Every Painting Has a Story.</strong>
  <br/>
  <strong>Built with creativity, persistence, and a passion for technology. 💙</strong>
</p>
