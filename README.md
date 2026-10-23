# FINART - AI Finance Management App

A modern SaaS application that helps users track income, expenses, savings, investments, budgets and receive financial advice based on their financial data.

---

# 🚀 Tech Stack

## Core Frontend
- React
- JavaScript
- PWA

## UI & Styling
- Tailwind CSS
- shadcn/ui (Radix UI Components)
- Framer-motion
- Responsive Design

## Data & State Management
- React-hook-form
- Zod
- react-toastify
- Context API

## BaaS & Database
- Firebase

## Cloud Platforms
- Vercel

## Subscription Payment
- Paystack

## CI/CD Pipelines & Containerization
- GitHub Actions
  - Pull Request Validation
  - Automated testing
  - Automated Deployments

## Testing and Quality
- jest

## Version Control system
- Git
- GitHub

## SEO & Accessibility
- Darkmode theme settings
- react-helmet-async
- react-router SSR & SSG
- sitemap
- WCAG
- ARIA
- Keyboard navigation
- Screen Reader
- Focus Management

## Performance & Monitoring
- Lighthouse
- Sentry
- Code-spliting
- Caching
- Suspense
- Skeleton Loaders

## Auth & Security
- Firebase Auth
- Middleware

## Build & Dev Tools
- npm

## IDEs & AI-ASSIST Dev
- Vscode
- GitHub copilot
- Chatgpt

## AI Integration
- OpenAI API

---

# 📁 App Structure

```txt
src/
├── pages/
│   ├── landing/
│   ├── auth/
│   └── dashboard/
├── components/
│   ├── ui/
│   ├── header
│   ├── footer
│   └── marker
├── hooks/
├── services/
├── layout/
├── lib/
├── assets/
├── App.jsx
├── index.css
├── main.jsx

```

---
# 🔁 Application Flow
## Landing Page
### Sections
- Header
  - Logo
  - Features
  - Pricing
  - FAQ
  - Login
  - Start Free
- Hero Section
- Features Overview
  - Income Tracking
  - Budget Management
  - Financial Advicer
- Pricing
  - Basics
  - Pro
  - Premium
- FAQ
- Footer
---

## Authentication Flow
### Protected Routes
```txt
 /dashboard
```
### User Authentication
- Sign Up
  - Full Name
  - Email
  - Password
  - Confirm Password
  - Google Sign-In
- Email Verification
- Sign In
  - Email & Password
  - Google Sign-In
- Forgot Password

---

## Dashboard Layout
### Sections
- Sidebar Navigation
  - Logo
  - Overview
  - Transactions
  - Budgets
  - Recurring
  - Analytics
  - AI Advicer
  - Reports
  - Settings
  - Logout
- Top Navigation Bar
  - Welcome Message
  - Global Search
  - Notifications
  - User Profile Dropdown
- Dynamic Content Area

### Dashboard Modules
#### Overview
- Financial Summary Cards
  - Total Balance
  - Monthly Income
  - Monthly Expenses
  - Monthly Savings
  - Monthly Investments
  - Net Worth
  - Savings Rate
  - Financial Health Score
- Charts
  - Category Breakdown
    - Pie Chart
  - Finance Type Breakdown
    - Bar Chart
- Recent Activity
  - Recent Transactions
  - Budget Alerts
  - Upcoming Recurring Payments

#### Transactions
- Create Transaction
- Filters
  - By Type
  - By Category
  - By Date
- Search
  - Search Transactions
- Transaction History Table
```txt
| Date | Description | Category| Type | Amount | Actions(edit/delete) |
```

#### Budgets
- Budget Creation
  - Create Budget Per Category
- Budget Card
  - Category Name
  - Budget Amount
  - Amount Spent
  - Remaining Amount
  - Progress Indicator
- Alerts
  - Overspending Alert
  - Budget Limit Warning
- Recommended Budget Suggestions

#### Recurring
- Create upcoming Recurring Transaction
- Active Recurring Table
```txt
  | Date | Description | Category | Type | Amount | Frequency |
```
- Upcoming Recurring cards
```txt
| Date | Description | Category | Type | Amount | Frequency | action(pause/resume, delete) |
```

#### Analytics
- Filters
  - From Date
  - To Date
- Chart Components
  - Category Breakdown (Pie Chart)
  - Finance Type Breakdown (Bar Chart)
  - Income vs Expense Comparison
  - Savings Growth
  - Investment Growth
- Tables
  - Budget Analytics
  - Expense Trends
  - Income Trends
- Analysis
  - Spending Heatmap
  - Top Spending Categories
  - Cash Flow Analysis
  - Unusual Spending Alerts
  - Budget Warnings

#### AI Advicer
- Financial Assistant ( with Spending Analysis, Budget Recommendations, Savings Suggestions, Investment Insights, Unusual Spending Detection, Personalized Financial Tips, Analytics Explanation, Financial Predictions)

#### Reports
- Export Formats selection 
  - PDF (.pdf)
  - Excel (.xlsx)
  - CSV (.csv)
- Download Report
- Download History

#### Settings
- Profile
  - Update Name
  - Update Email
  - Upload Avatar
- Preferences
  - Currency Selection
  - Notification Preferences
  - Theme Selection (Light/Dark Mode)
- Security
  - Change Password
  - Logout All Devices
  - Delete Account

#### Notifications
- Budget Alerts
- Overspending Alerts
- Upcoming Recurring Payments
- Subscription Expiry Alerts
- Report Generation Alerts

---

# Subscription Plans
## Basic
###  Free Plan
- All Starter features
- 2 Currency Support
- Limited Financial Advice
- Limited Financial Analytics

## Pro
### Most popular plan
- All Pro features
- 3 Currency Support
- Limited Financial Advice
- Unlimited Financial Analytics

## Premium
### Exclusively for Premium users
- All Overdrive feature
- 8 Currency Support
- Unlimited Financial Advice
- Unlimited Financial Analytics

---

# 🚀 Production Check
* [ ] Security Check
* [ ] Production environment variables configured
* [ ] Sentry configured
* [ ] Authentication tested
* [ ] Subscription tested
* [ ] Lighthouse score above 90
* [ ] Mobile responsiveness verified
* [ ] Firebase Security Rules
* [ ] Protected Routes
* [ ] Logout From All Devices
* [ ] Settings tested
* [ ] Financial Advisor tested
* [ ] Components tested: Income, Transactions Creation, Budget Creation, reports Generation tested

---

# 🎯 Project Goal

Fina helps users understand their financial health, manage spending, track savings, monitor investments, create budgets, receive Finance Advice, and make smarter financial decisions through a secure and scalable SaaS platform.

---

# 📄 License
...

---


