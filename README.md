# CAMPUS STAY – College Accommodation Finder Web Application

> **Tagline:** *"Find Your Stay. Feel at Home."*

Campus Stay is a modern, responsive full-stack web application designed to help college students find hostels, PG accommodations, rental rooms, and shared apartments strictly within a **5 KM radius** of their selected college.

Built with **React.js + Vite + Tailwind CSS + OpenStreetMap (Leaflet.js)** on the frontend, **Java Spring Boot 3 + Spring Security + Spring Data JPA + JWT** on the backend, and **MySQL** for robust relational data storage.

---

## 1. Key Features

- **Strict 5 KM Proximity Search:** Enforced on the backend using the spherical **Haversine formula**. Properties located further than 5.0 KM from the college gates are automatically excluded.
- **Interactive OpenStreetMap + Leaflet.js:** Visualizes college gates with a special campus pin, draws a 5 KM translucent radius boundary circle, and pins all approved stays with interactive popup previews and rent tags.
- **Three Role-Based Login System:**
  - **Student:** Search stays, filter by amenities/sharing/rent, view distance, save favourites, send move-in booking requests, track booking status, and receive notifications.
  - **Accommodation Owner:** Manage listings, add properties (with auto-suggested coordinates and photo uploads), toggle room availability counters, review incoming student booking requests (Accept / Reject), and manage occupancy.
  - **Administrator:** Master dashboard statistics, review and approve/reject pending property listings with reason notes, verify owner identity documents, manage student & owner accounts, audit platform bookings.
- **Direct Booking Inquiries:** Direct request pipeline between students and owners with zero brokerage fees or intermediaries.
- **Robust Security:** JWT authentication with HMAC-SHA256, BCrypt password hashing, role-based Spring Security method protection, input validation, and CORS protection.

---

## 2. Technology Stack

### Frontend
- **React.js 18** (Modern functional components & Hooks)
- **Vite 5** (Ultra-fast build & development tool)
- **Tailwind CSS 3** (Custom navy & purple design system)
- **React Router DOM 6** (Protected client-side routing)
- **Leaflet.js & React-Leaflet** (Interactive OpenStreetMap rendering)
- **Lucide React** (Modern feather icons)
- **Axios** (JWT interceptor & HTTP client)

### Backend
- **Java 17+** (Compiled and tested on modern OpenJDK / Oracle JDK)
- **Spring Boot 3.3.4**
- **Spring Security 6** (Stateless JWT filter chain)
- **Spring Data JPA & Hibernate 6.5**
- **jjwt 0.12.5** (JSON Web Token authentication)
- **HikariCP** (Connection pooling)
- **Tomcat 10.1** (Embedded Servlet Container)

### Database
- **MySQL 8.0+** (Full relational schema with indexes, foreign keys, and seed scripts in `database/`)
- **H2 In-Memory Support** (Optional dev profile for zero-config offline evaluation)

---

## 3. Project Folder Structure

```text
campus-stay/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── campusstay/
│   │   │   │           ├── CampusStayApplication.java
│   │   │   │           ├── config/
│   │   │   │           │   └── DataInitializer.java
│   │   │   │           ├── controller/
│   │   │   │           │   ├── AdminController.java
│   │   │   │           │   ├── AuthController.java
│   │   │   │           │   ├── CollegeController.java
│   │   │   │           │   ├── FileUploadController.java
│   │   │   │           │   ├── OwnerController.java
│   │   │   │           │   ├── PropertyController.java
│   │   │   │           │   └── StudentController.java
│   │   │   │           ├── dto/
│   │   │   │           │   ├── ApiResponse.java
│   │   │   │           │   ├── AuthRequest.java
│   │   │   │           │   ├── AuthResponse.java
│   │   │   │           │   ├── BookingRequestDto.java
│   │   │   │           │   ├── BookingResponseDto.java
│   │   │   │           │   ├── BookingStatusUpdateRequest.java
│   │   │   │           │   ├── DashboardStatsDto.java
│   │   │   │           │   ├── OwnerRegisterRequest.java
│   │   │   │           │   ├── PropertyRequest.java
│   │   │   │           │   ├── PropertyResponse.java
│   │   │   │           │   ├── SearchFilterRequest.java
│   │   │   │           │   └── StudentRegisterRequest.java
│   │   │   │           ├── entity/
│   │   │   │           │   ├── Booking.java
│   │   │   │           │   ├── BookingStatus.java
│   │   │   │           │   ├── College.java
│   │   │   │           │   ├── Gender.java
│   │   │   │           │   ├── GenderPreference.java
│   │   │   │           │   ├── Notification.java
│   │   │   │           │   ├── OwnerVerification.java
│   │   │   │           │   ├── Property.java
│   │   │   │           │   ├── PropertyImage.java
│   │   │   │           │   ├── PropertyStatus.java
│   │   │   │           │   ├── PropertyType.java
│   │   │   │           │   ├── Review.java
│   │   │   │           │   ├── Role.java
│   │   │   │           │   ├── RoomSharingType.java
│   │   │   │           │   ├── SavedProperty.java
│   │   │   │           │   ├── User.java
│   │   │   │           │   ├── UserStatus.java
│   │   │   │           │   └── VerificationStatus.java
│   │   │   │           ├── exception/
│   │   │   │           │   └── GlobalExceptionHandler.java
│   │   │   │           ├── repository/
│   │   │   │           │   ├── BookingRepository.java
│   │   │   │           │   ├── CollegeRepository.java
│   │   │   │           │   ├── NotificationRepository.java
│   │   │   │           │   ├── OwnerVerificationRepository.java
│   │   │   │           │   ├── PropertyImageRepository.java
│   │   │   │           │   ├── PropertyRepository.java
│   │   │   │           │   ├── ReviewRepository.java
│   │   │   │           │   ├── SavedPropertyRepository.java
│   │   │   │           │   └── UserRepository.java
│   │   │   │           ├── security/
│   │   │   │           │   ├── AuthEntryPointJwt.java
│   │   │   │           │   ├── AuthTokenFilter.java
│   │   │   │           │   ├── JwtUtils.java
│   │   │   │           │   ├── SecurityConfig.java
│   │   │   │           │   ├── UserDetailsImpl.java
│   │   │   │           │   └── UserDetailsServiceImpl.java
│   │   │   │           └── service/
│   │   │   │               ├── AuthService.java
│   │   │   │               ├── BookingService.java
│   │   │   │               ├── CollegeService.java
│   │   │   │               ├── DashboardService.java
│   │   │   │               ├── FileStorageService.java
│   │   │   │               ├── HaversineService.java
│   │   │   │               ├── NotificationService.java
│   │   │   │               └── PropertyService.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-dev.properties
│   └── pom.xml
│
├── frontend/
│   ├── public/
│   │   └── logo.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardSidebar.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── PropertyDetailModal.jsx
│   │   │   ├── PropertyMap.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StatCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AboutPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── ExploreStaysPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── OwnerDashboardPage.jsx
│   │   │   ├── RegisterOwnerPage.jsx
│   │   │   ├── RegisterStudentPage.jsx
│   │   │   └── StudentDashboardPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
└── README.md
```

---

## 4. Explanation of the 5 KM Search Algorithm

### The Mathematical Model
The great-circle distance between two geographic coordinates is computed using the **Haversine formula**:

$$\Delta\phi = \text{lat}_2 - \text{lat}_1$$
$$\Delta\lambda = \text{lon}_2 - \text{lon}_1$$
$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\text{lat}_1)\cdot\cos(\text{lat}_2)\cdot\sin^2\left(\frac{\Delta\lambda}{2}\right)$$
$$c = 2 \cdot \operatorname{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$
$$d = R \cdot c$$

where $R = 6371\text{ km}$ (mean Earth radius).

### Backend Enforcement Workflow
1. The student or visitor selects a target college (e.g., *Indian Institute of Technology Delhi* at `28.5450, 77.1926`).
2. If browser geolocation is granted by the student, the user's GPS point is used; if denied, the selected college landmark coordinates serve as the immutable search anchor.
3. The Spring Boot backend executes `propertyRepository.findAllApprovedAndAvailable()` to retrieve only admin-approved stays with vacant rooms (`availableRooms > 0`).
4. `HaversineService` evaluates each candidate property against the anchor.
5. **Strict Cutoff:** Any property with `distanceKm > 5.0` is discarded on the backend. It is never transmitted across the network.
6. The surviving results are enriched with their calculated distance (`distanceKm`), sorted by nearest distance by default (or rent asc/desc if filtered), and rendered on Leaflet with dynamic map pins and a 5 KM radius ring.

---

## 5. Development & Testing Credentials

All pre-seeded demo accounts use standard development passwords:

| Role | Email Address | Password | Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@campusstay.com` | `admin123` | System Administrator with full moderation rights |
| **Owner** | `owner.rajesh@gmail.com` | `password123` | Owner with properties near IIT Delhi |
| **Owner** | `owner.sunita@gmail.com` | `password123` | Owner with properties near RVCE Bengaluru |
| **Owner** | `owner.vikram@gmail.com` | `password123` | Owner with properties near St. Xavier's Mumbai |
| **Student** | `student.aarav@gmail.com` | `password123` | 2nd Year CS student at IIT Delhi |
| **Student** | `student.priya@gmail.com` | `password123` | 3rd Year IS student at RVCE Bengaluru |
| **Student** | `student.rohan@gmail.com` | `password123` | 1st Year student at St. Xavier's Mumbai |

> **Convenience Feature:** The Login page includes **one-click demo autofill buttons** (`Fill Student`, `Fill Owner`, `Fill Admin`) to make manual testing instantaneous.

---

## 6. Database Setup Instructions

### Option A: MySQL Server Setup
1. Ensure MySQL Server is running locally on port `3306`.
2. Connect to your MySQL instance:
   ```bash
   mysql -u root -p
   ```
3. Run the schema script:
   ```sql
   source /path/to/campus-stay/database/schema.sql;
   ```
4. Run the seed script:
   ```sql
   source /path/to/campus-stay/database/seed.sql;
   ```
5. Configure your database credentials via environment variables or in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/campus_stay_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

### Option B: Zero-Config Standalone Dev Mode (H2 in MySQL Mode)
If MySQL is not installed or running as a service, the application comes with a zero-config dev profile that uses an in-memory database with MySQL syntax compatibility. The built-in `DataInitializer` seeds all colleges, owners, students, properties, bookings, and notifications automatically on startup.
- Simply pass `-Dspring-boot.run.profiles=dev` when running the backend.

---

## 7. Execution Instructions

### Quick Start (One-Click Launchers on Windows)
- Double click **`start-all.bat`** in the project root to automatically spin up both the Spring Boot backend and the React frontend in separate terminal windows.
- Alternatively, launch each component individually using **`start-backend.bat`** or **`start-frontend.bat`**.

### Manual Command Line Launch

#### A. Run Backend (Spring Boot)
1. Open a terminal and navigate to `backend/`:
   ```bash
   cd campus-stay/backend
   ```
2. Build and start the backend:
   ```bash
   # Connect to MySQL (Default profile):
   mvn spring-boot:run

   # OR run with zero-config in-memory dev profile:
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```
3. The backend starts on **`http://localhost:8080`**.
   - H2 Web Console (dev mode): `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:campus_stay_db`, User: `sa`, Password: empty).

#### B. Run Frontend (React + Vite)
1. Open a second terminal and navigate to `frontend/`:
   ```bash
   cd campus-stay/frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **`http://localhost:5173`**.

---

## 8. Step-by-Step Testing Guide

1. **Verify Home Page & College Search:**
   - Go to `http://localhost:5173/`.
   - In the hero search box, select **IIT Delhi** and click **Search 5 KM Stays**.
   - Notice the redirect to `/explore?collegeId=1`.
2. **Verify the 5 KM Strict Radius Filter:**
   - On the Explore page, notice that 5 properties are shown within 0.6 km to 4.4 km of IIT Delhi.
   - Note that **Connaught Grand Deluxe Rooms** (~10.5 km away) is **strictly excluded** from the list and map.
   - Adjust the radius slider to 2.0 km to see only the 3 closest stays.
3. **Test Student Registration & Booking:**
   - Click **Register -> Student Account**.
   - Register a new student (or use the one-click `Fill Student` button on the Login page).
   - In the Explore page or Student Dashboard, select a property and click **View Details & Book**.
   - Choose a future move-in date, enter a message, and click **Submit Booking Request**.
   - Check the **My Bookings** tab in the Student Dashboard to verify the `PENDING` request.
4. **Test Owner Property Management & Booking Acceptance:**
   - Log out and log in as an owner (or click `Fill Owner` -> `owner.rajesh@gmail.com`).
   - Go to **Booking Requests**: the incoming student request is visible with student details and move-in date.
   - Enter an acceptance note and click **Accept Booking**.
   - Go to **My Properties**: notice the available rooms counter decremented automatically.
   - Click **Add New Property**, fill the details (coordinates are auto-suggested based on selected campus), and submit.
   - Notice that the new property enters `PENDING` status.
5. **Test Admin Property Approval & Moderation:**
   - Log out and log in as Admin (`Fill Admin` -> `admin@campusstay.com`).
   - Open **Pending Approvals**: review the newly submitted property.
   - Click **Approve & Publish Listing**: the listing becomes immediately `APPROVED` and visible to students.
   - Check **Owner Verifications** to approve or reject pending identity documents.
   - Check **All Bookings** to inspect platform-wide activity.

