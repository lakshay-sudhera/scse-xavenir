# 👨‍💻 Xavenir — SCSE Annual Tech Fest

Xavenir is the official annual fest of the **Society of Computer Science and Engineering (SCSE)** at **NIT Jamshedpur**.

This website serves as a full-stack event management system built to handle registrations, payments, authentication, admin controls, and media—designed for real-world scale and usability.

---

## 🌐 About SCSE

The **Society of Computer Science and Engineering (SCSE)** is a dynamic community of developers, innovators, and learners at NIT Jamshedpur.

We operate at the intersection of **code and creativity**, fostering:
- Knowledge sharing  
- Problem-solving  
- Innovation-driven thinking  

---

## ✨ Core Features

### 🔐 Authentication System
- Login / Register
- Google OAuth integration
- JWT-based authentication
- Forgot & Reset Password (email-based)

### 💳 Payment System
- Razorpay integration
- Secure payment verification
- Dedicated payment routes (`/payment`, `/payreg`)

### 📊 Admin Dashboard
- Manage users and registrations
- Track verified payments
- Admin-specific routes (`/admin`, `/dashboard`)

### 📁 Media Handling
- Cloudinary integration
- Image upload support (`/test-upload`, `/gallery`)

### 📢 Event System
- Dedicated events pages (`/events`)
- Registration flow integration

### 🎨 Frontend
- Modern UI with animations (Framer Motion)
- Component-based architecture
- Responsive design

---

## 🛠️ Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- Tailwind CSS + Custom Styling
- Framer Motion

### Backend
- Next.js API Routes
- Node.js ecosystem

### Database
- MongoDB with Mongoose

### Integrations
- Cloudinary (media storage)
- Razorpay (payments)
- Google OAuth
- Nodemailer (emails)

---

## 📁 Project Structure

```
src/
 ├── app/
 │   ├── about/
 │   ├── admin/
 │   ├── api/
 │   ├── contact/
 │   ├── dashboard/
 │   ├── events/
 │   ├── login/
 │   ├── register/
 │   ├── payment/
 │   ├── payreg/
 │   ├── forgotpassword/
 │   ├── resetpassword/
 │   ├── gallery/
 │   ├── sponsors/
 │   └── ...
 │
 ├── components/     # Reusable UI components
 ├── context/        # Global state management
 ├── dbConfig/       # Database connection setup
 ├── models/         # Mongoose schemas
 ├── utils/          # Utility functions
```

---

## ⚙️ Environment Variables

Create a `.env.local` file:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_URL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=

# Razorpay
RAZORPAY_API_KEY=
RAZORPAY_API_SECRET=
NEXT_PUBLIC_RAZORPAY_API_KEY=

# JWT
JWT_SECRET=

# Email (Nodemailer)
EMAIL_USER=
EMAIL_PASS=

# App
NEXT_PUBLIC_BASE_URL=
NODE_ENV=development
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/scse-xavenir.git
cd scse-xavenir
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 📦 Production Build

```bash
npm run build
npm run start
```

---

## 🔒 Key Architecture Highlights

- Modular API routes inside `app/api`
- Clean separation of concerns (models, utils, dbConfig)
- Secure auth using JWT + OAuth
- Payment verification pipeline (Razorpay → backend validation)
- Scalable structure for event-based systems

---

## 🚀 Deployment

- **Frontend + Backend:** Vercel (Next.js fullstack)
- Ensure all environment variables are configured in Vercel dashboard

---

## 📌 Future Improvements

- Real-time notifications
- Role-based access control (RBAC)
- Analytics dashboard for events
- AI-based participant insights

---

## 🤝 Contributing

1. Fork the repo  
2. Create a branch  
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit changes  
4. Push and open a Pull Request  

---

## 💙 Built By

Developed as part of SCSE, NIT Jamshedpur to power Xavenir with a seamless digital experience.

## 👨‍💻 Contributors

Thanks to these amazing people who contributed to **Xavenir** 💙

<p align="center">
  <a href="https://github.com/ayushv-nitj">
    <img src="https://github.com/ayushv-nitj.png" width="70px" style="border-radius:50%" />
  </a>
  <a href="https://github.com/priyanshuraj-dev">
    <img src="https://github.com/priyanshuraj-dev.png" width="70px" style="border-radius:50%" />
  </a>
  <a href="https://github.com/yashita7002-hub">
    <img src="https://github.com/yashita7002-hub.png" width="70px" style="border-radius:50%" />
  </a>
  <a href="https://github.com/deeptanshu-glitch">
    <img src="https://github.com/deeptanshu-glitch.png" width="70px" style="border-radius:50%" />
  </a>
  <a href="https://github.com/ayushsarkar314">
    <img src="https://github.com/ayushsarkar314.png" width="70px" style="border-radius:50%" />
  </a>
  <a href="https://github.com/lakshay-sudhera">
    <img src="https://github.com/lakshay-sudhera.png" width="70px" style="border-radius:50%" />
  </a>
  <a href="https://github.com/darshita44">
    <img src="https://github.com/darshita44.png" width="70px" style="border-radius:50%" />
  </a>
</p>

<p align="center">
  <sub>Built with collaboration, creativity, and a lot of late-night debugging ☕</sub>
</p>