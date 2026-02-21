# Residential Apartment Rental Portal

A comprehensive full-stack web application for managing residential apartment rentals with separate User and Admin portals. Built with Angular 20, Flask, PostgreSQL, and Docker.

## 🌟 Features

### User Portal

- **User Authentication**: Secure registration and login system
- **Browse Apartments**: View available flats with detailed information, images, and filters
- **Amenities**: Explore available amenities (gym, pool, parking, etc.) with booking capability
- **Booking Management**: Request amenity bookings and track their status
- **Responsive Design**: Beautiful UI with Tailwind CSS that works on all devices

### Admin Portal

- **Dashboard**: Comprehensive overview with occupancy stats, revenue tracking, and key metrics
- **Tower Management**: Add, edit, and delete residential towers
- **Unit Management**: Manage apartment units with status tracking (available, occupied, maintenance)
- **Amenity Management**: Control amenities availability and details
- **Booking Approval**: Review and approve/decline amenity booking requests
- **Tenant Management**: View and manage resident information
- **Analytics**: Occupancy rates, revenue reports, and booking statistics

## 🛠 Tech Stack

### Frontend

- **Angular 20**: Modern component-based framework with standalone components
- **Tailwind CSS**: Utility-first CSS framework for beautiful, responsive designs
- **RxJS**: Reactive programming for API calls and state management
- **TypeScript**: Type-safe development

### Backend

- **Flask**: Lightweight Python web framework
- **PostgreSQL**: Robust relational database
- **SQLAlchemy**: ORM for database operations
- **JWT**: Secure authentication with JSON Web Tokens
- **Flask-CORS**: Cross-origin resource sharing

### DevOps

- **Docker**: Containerization for all services
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Web server for production Angular apps

## 📁 Project Structure

```
Residential Apartment Rental Portal/
├── backend/
│   ├── app.py                  # Flask application entry point
│   ├── config.py               # Configuration settings
│   ├── models.py               # Database models
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── user-portal/            # User-facing Angular application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/  # UI components
│   │   │   │   ├── services/    # API services
│   │   │   │   ├── guards/      # Route guards
│   │   │   │   └── interceptors/ # HTTP interceptors
│   │   │   ├── styles.css
│   │   │   └── index.html
│   │   ├── package.json
│   │   ├── tailwind.config.js
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   └── admin-portal/           # Admin Angular application
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/  # Admin components
│       │   │   ├── services/    # API services
│       │   │   └── guards/      # Auth & admin guards
│       │   ├── styles.css
│       │   └── index.html
│       ├── package.json
│       ├── tailwind.config.js
│       ├── Dockerfile
│       └── nginx.conf
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- Git

### Installation & Running

1. **Clone the repository**

```bash
git clone <repository-url>
cd "Residential Apartment Rental Portal"
```

2. **Start all services with Docker Compose**

```bash
docker-compose up --build
```

This single command will:

- Build and start the PostgreSQL database
- Build and start the Flask backend API
- Build and start the User Portal (Angular)
- Build and start the Admin Portal (Angular)
- Set up networking between all containers
- Seed the database with initial data

3. **Access the applications**

- **User Portal**: http://localhost:4200
- **Admin Portal**: http://localhost:4201
- **Backend API**: http://localhost:5000

### Demo Credentials

#### User Portal

- **Email**: john@example.com
- **Password**: user123

or

- **Email**: jane@example.com
- **Password**: user123

#### Admin Portal

- **Email**: admin@rental.com
- **Password**: admin123

## 🗄 Database Schema

### Users

- Stores user information with role-based access (admin/resident)
- Password hashing with werkzeug security

### Towers

- Residential building information
- Multiple units per tower

### Units

- Individual apartment details
- Status tracking (available, occupied, maintenance)
- Pricing and specifications

### Amenities

- Facility information (gym, pool, parking, etc.)
- Availability and capacity management

### Bookings

- Amenity booking requests
- Status workflow (pending → approved/declined)
- Admin notes for feedback

### Leases

- Tenant-unit associations
- Lease period and payment tracking

### Payments

- Mock payment records
- Transaction history

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Units

- `GET /api/units` - List all units (with filters)
- `GET /api/units/:id` - Get unit details
- `POST /api/units` - Create unit (admin only)
- `PUT /api/units/:id` - Update unit (admin only)
- `DELETE /api/units/:id` - Delete unit (admin only)

### Towers

- `GET /api/towers` - List all towers
- `POST /api/towers` - Create tower (admin only)
- `PUT /api/towers/:id` - Update tower (admin only)
- `DELETE /api/towers/:id` - Delete tower (admin only)

### Amenities

- `GET /api/amenities` - List all amenities
- `POST /api/amenities` - Create amenity (admin only)
- `PUT /api/amenities/:id` - Update amenity (admin only)
- `DELETE /api/amenities/:id` - Delete amenity (admin only)

### Bookings

- `GET /api/bookings` - List bookings (user's own or all for admin)
- `POST /api/bookings` - Create booking request
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Dashboard

- `GET /api/stats/dashboard` - Get dashboard statistics (admin only)
- `GET /api/users` - List all users (admin only)

## 🎨 UI Features

### Responsive Design

- Mobile-first approach with Tailwind CSS
- Breakpoints for tablets, laptops, and desktops
- Touch-friendly navigation

### User Experience

- Loading states and spinners
- Form validation with error messages
- Success/error notifications
- Smooth transitions and animations
- Material Icons for consistent iconography

### Color Scheme

- Primary: Blue tones (#0284c7)
- Success: Green (#16a34a)
- Warning: Yellow (#eab308)
- Danger: Red (#dc2626)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Werkzeug password hashing
- **Role-Based Access Control**: Separate admin and user permissions
- **HTTP-Only Tokens**: Secure token storage
- **CORS Configuration**: Controlled cross-origin requests
- **Route Guards**: Protected routes in Angular
- **Input Validation**: Both frontend and backend validation

## 🐳 Docker Configuration

### Services

**PostgreSQL Database**

- Image: postgres:15-alpine
- Port: 5432
- Persistent volume for data

**Flask Backend**

- Python 3.11-slim base image
- Auto-reloads on code changes (development)
- Health checks for database connection

**User Portal (Angular)**

- Multi-stage build (Node 20 + Nginx)
- Optimized production build
- Port: 4200

**Admin Portal (Angular)**

- Multi-stage build (Node 20 + Nginx)
- Optimized production build
- Port: 4201

## 📝 Development

### Running Backend Locally

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Running User Portal Locally

```bash
cd frontend/user-portal
npm install
npm start
```

### Running Admin Portal Locally

```bash
cd frontend/admin-portal
npm install
npm start
```

## 🧪 Sample Data

The application comes pre-seeded with:

- 3 users (1 admin, 2 residents)
- 2 towers (Sunrise Tower, Sunset Tower)
- 5 apartment units
- 6 amenities (Pool, Gym, Parking, Club House, Tennis Court, Kids Play Area)
- Sample bookings and payments

## 🌐 Environment Variables

### Backend (backend/.env)

```env
DATABASE_URL=postgresql://admin:admin123@db:5432/rental_portal
JWT_SECRET_KEY=your-secret-key-change-in-production
FLASK_ENV=development
```

### Frontend (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:5000/api",
};
```

## 📊 Key Features Demonstrated

1. **Full-Stack Integration**: Complete data flow from UI to database
2. **RESTful API Design**: Clean, well-structured API endpoints
3. **Responsive UI**: Mobile-first design with Tailwind CSS
4. **Authentication & Authorization**: JWT-based secure access
5. **CRUD Operations**: Complete create, read, update, delete functionality
6. **Database Relations**: Properly normalized PostgreSQL schema
7. **Docker Deployment**: Production-ready containerized setup
8. **State Management**: RxJS observables for reactive data
9. **Route Protection**: Guards for authenticated and admin routes
10. **Form Validation**: Client and server-side validation

## 🤝 Contributing

This is a demonstration project. For a production deployment, consider:

- Adding SSL/TLS certificates
- Implementing refresh tokens
- Adding password reset functionality
- Implementing file upload for images
- Adding email notifications
- Implementing payment gateway integration
- Adding comprehensive testing (unit, integration, e2e)
- Setting up CI/CD pipeline
- Adding logging and monitoring
- Implementing rate limiting

## 📄 License

This project is created for educational and demonstration purposes.

## 👥 Support

For issues or questions:

- Check the browser console for errors
- Review Docker logs: `docker-compose logs -f`
- Ensure all containers are running: `docker-compose ps`

## 🎯 Future Enhancements

- Real-time notifications with WebSockets
- Advanced search and filtering
- Payment processing integration
- Document management system
- Maintenance request tracking
- Visitor management
- Mobile app (React Native/Flutter)
- Email/SMS notifications
- Advanced analytics and reports
- Multi-language support

---

**Built with ❤️ using Angular 20, Flask, PostgreSQL, and Docker**
