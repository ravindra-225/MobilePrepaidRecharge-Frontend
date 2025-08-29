# 📱 Mobile Prepaid Recharge System - Frontend

## 📌 Overview
This repository contains the **Angular frontend** for the Mobile Prepaid Recharge System.  
It provides a **responsive UI** for:
- User Registration, Login & Validation
- Admin Registration & Login
- Mobile Recharge workflows
- Viewing Recharge History
- Role-based navigation (User vs Admin)

The frontend integrates seamlessly with the [Backend APIs](../mobile-prepaid-recharge-backend) (Spring Boot + JWT).

---

## 🚀 Features
- 🔑 **JWT Authentication** with secure login/logout
- 👨‍💼 Admin module: Register, Login, Manage subscribers
- 👤 User module: Register, Validate mobile, Recharge, View history
- 💳 Recharge workflows integrated with backend APIs
- 📜 History view with dynamic data
- 📱 Responsive layout (Angular + Bootstrap/Material)
- 🧩 Modular architecture with reusable components & services

---

## 🛠️ Tech Stack
- **Frontend**: Angular 16+, TypeScript
- **UI**: HTML5, CSS3, Bootstrap / Angular Material
- **State Mgmt**: Services with RxJS
- **API Integration**: HttpClient (REST calls to Spring Boot backend)

---

## 📂 Project Structure
src/app/  
├── components/  
│ ├── admin-login/ # Admin login UI  
│ ├── admin-register/ # Admin registration  
│ ├── user-register/ # User registration  
│ ├── user-validate/ # User validation  
│ ├── recharge/ # Recharge component  
│ ├── user-history/ # Recharge history view  
│ ├── footer/ # Footer component  
│ └── app.component.ts # Root component  
│  
├── services/  
│ ├── admin.service.ts # Admin API integration  
│ ├── auth.service.ts # Authentication & JWT handling  
│ ├── recharge.service.ts # Recharge API integration  
│  
├── app.config.ts # Angular app config  
├── app.routes.ts # Routing configuration  
└── app.module.ts # Module definitions  

---

## ⚡ Screens & Workflows
- **Admin Login/Register** → Authenticate & access admin-only pages  
- **User Register/Login/Validate** → Create account & verify mobile  
- **Recharge Page** → Select plan, make payment, confirm recharge  
- **User History** → View past recharges by mobile number  

---

## ▶️ Getting Started
1. Clone the repository  
   ```bash
   git clone https://github.com/yourusername/mobile-prepaid-recharge-frontend.git
   cd mobile-prepaid-recharge-frontend  
- Install dependencies  
- npm install  

2. Run the development server  
ng serve
Open http://localhost:4200 in your browser

---

## 🔗 Backend Integration    
The frontend consumes REST APIs from the backend service:
👉 https://github.com/ravindra-225/MobilePrepaidRecharge-backend

Update the backend URL in auth.service.ts & other services before running.  

---  
## 📌 Future Enhancements
- Better error handling & toast notifications
- Pagination & filtering in history & plan views
- Unit testing with Jasmine/Karma  

