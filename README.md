# STEP Footwear App 👟

A premium, production-ready mobile e-commerce application for footwear retail built with React Native (Expo) and Node.js/MongoDB backend.

---

## ✨ Features

### 🛍️ E-Commerce
- **Product Browsing**: Featured products, new arrivals, categories
- **Product Details**: Image carousel, size/color selection, quantity picker
- **Search**: Full-text search with filters
- **Shopping Cart**: Add, update, remove items with persistence
- **Wishlist/Favorites**: Save products for later
- **Checkout Flow**: Address selection, payment integration

### 🔐 Authentication
- Email/password sign in & sign up
- JWT-based authentication
- Secure token storage with AsyncStorage
- Onboarding carousel for new users

### 👤 User Profile
- Order history with status tracking
- Multiple delivery addresses
- Saved payment methods
- Notification preferences
- Language settings (8 Indian languages)
- Dark/Light theme toggle

### 💳 Payments
- Razorpay integration (ready for production)
- Cash on Delivery option
- Secure payment processing

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React Native** | Cross-platform mobile development |
| **Expo SDK 54** | Development framework & tooling |
| **Expo Router** | File-based navigation |
| **React Native Reanimated** | Smooth 60fps animations |
| **AsyncStorage** | Local data persistence |
| **Axios** | HTTP client with interceptors |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |

### Design System
- **Font**: Outfit (Google Fonts)
- **Icons**: Ionicons (@expo/vector-icons)
- **Styling**: Premium dark/light themes, glassmorphism, gradients

---

## 📁 Project Structure

```
Step/
├── app/                      # Expo Router screens
│   ├── (tabs)/               # Tab navigation screens
│   │   ├── index.tsx         # Home screen
│   │   ├── categories.tsx    # Categories
│   │   ├── cart.tsx          # Shopping cart
│   │   └── profile.tsx       # User profile
│   ├── auth/                 # Authentication screens
│   │   ├── signin.tsx        
│   │   └── signup.tsx        
│   ├── settings/             # Settings screens
│   │   ├── notifications.tsx 
│   │   └── language.tsx      
│   ├── support/              # Support screens
│   │   ├── help.tsx          
│   │   ├── contact.tsx       
│   │   └── terms.tsx         
│   ├── product/[id].tsx      # Product details
│   ├── checkout.tsx          # Checkout flow
│   ├── onboarding.tsx        # Onboarding carousel
│   └── _layout.tsx           # Root layout
│
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/           # Button, Card, Input, etc.
│   │   ├── navigation/       # Header, GlassTabBar
│   │   └── product/          # ProductCard, ImageCarousel
│   ├── constants/            # Colors, Fonts, Spacing
│   ├── contexts/             # React Context providers
│   │   ├── AuthContext.tsx   
│   │   ├── CartContext.tsx   
│   │   ├── ThemeContext.tsx  
│   │   └── FavoritesContext.tsx
│   ├── services/             # API services
│   ├── types/                # TypeScript types
│   └── utils/                # Utility functions
│
├── backend/                  # Express.js API
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Favorite.js
│   │   └── Order.js
│   ├── routes/               # API endpoints
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── favorites.js
│   │   └── orders.js
│   ├── middleware/           # Express middleware
│   │   └── auth.js           # JWT verification
│   └── server.js             # Entry point
│
└── assets/                   # Images, fonts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (for mobile testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/step-footwear.git
   cd step-footwear
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Configure environment variables**
   
   Create `.env` in root directory:
   ```env
   API_URL=http://localhost:3001/api
   RAZORPAY_KEY_ID=your_razorpay_key
   ```
   
   Create `.env` in `backend/` directory:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/step
   JWT_SECRET=your-super-secret-jwt-key
   ```

### Running the App

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start the Expo development server**
   ```bash
   # In a new terminal, from project root
   npm start
   ```

4. **Open the app**
   - Press `w` for web browser
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app

---

## 📱 Screenshots

| Home | Product | Cart | Profile |
|------|---------|------|---------|
| Premium home screen with featured products | Product details with image carousel | Shopping cart with checkout | User profile and settings |

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (paginated) |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products?search=term` | Search products |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update/:id` | Update quantity |
| DELETE | `/api/cart/remove/:id` | Remove item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user's orders |
| POST | `/api/orders/create` | Create new order |
| POST | `/api/orders/:id/cancel` | Cancel order |

---

## 🎨 Design Philosophy

- **Premium Aesthetic**: Glassmorphism, gradients, smooth animations
- **60fps Animations**: React Native Reanimated for butter-smooth UX
- **Dark Mode First**: Full dark/light theme support
- **Accessibility**: Proper contrast ratios and touch targets
- **Mobile-First**: Optimized for iOS and Android
---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---
