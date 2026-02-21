# Local Development Guide

## Prerequisites

Before running the application locally, ensure you have the following installed:

### Required Software

1. **Python 3.11+** - [Download](https://www.python.org/downloads/)
2. **Node.js 20+** - [Download](https://nodejs.org/)
3. **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/)
   - Or use Docker for PostgreSQL only (see below)

### Verify Installation

```bash
# Check Python
python --version  # Should be 3.11 or higher

# Check Node.js
node --version    # Should be 20 or higher

# Check PostgreSQL
psql --version    # Should be 15 or higher
```

## Database Setup

### Option 1: Local PostgreSQL

1. Install PostgreSQL 15
2. Create database and user:

```sql
CREATE DATABASE rental_portal;
CREATE USER admin WITH PASSWORD 'admin123';
GRANT ALL PRIVILEGES ON DATABASE rental_portal TO admin;
```

### Option 2: Docker PostgreSQL Only

If you don't want to install PostgreSQL locally, use Docker just for the database:

```bash
docker run -d \
  --name rental_db \
  -e POSTGRES_DB=rental_portal \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -p 5432:5432 \
  postgres:15-alpine
```

## Quick Start

### Windows

1. **Run Setup (First Time Only)**

```bash
setup-local.bat
```

This will:

- Check for Python and Node.js
- Create Python virtual environment
- Install all backend dependencies
- Install all frontend dependencies for both portals

2. **Start All Services**

```bash
run-local.bat
```

This will open 3 separate command windows:

- Backend API (Flask) on port 5000
- User Portal (Angular) on port 4200
- Admin Portal (Angular) on port 4201

### Linux / Mac

1. **Make scripts executable**

```bash
chmod +x setup-local.sh run-local.sh
```

2. **Run Setup (First Time Only)**

```bash
./setup-local.sh
```

3. **Start All Services**

```bash
./run-local.sh
```

All services will run in the same terminal. Press Ctrl+C to stop all.

## Access the Application

Once all services are running:

- **User Portal**: http://localhost:4200
- **Admin Portal**: http://localhost:4201
- **Backend API**: http://localhost:5000

### Demo Credentials

**User Login:**

- Email: `john@example.com`
- Password: `user123`

**Admin Login:**

- Email: `admin@rental.com`
- Password: `admin123`

## Manual Setup (Alternative)

If you prefer to set up manually:

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend
python app.py
```

### User Portal Setup

```bash
cd frontend/user-portal

# Install dependencies
npm install

# Run development server
npm start
```

### Admin Portal Setup

```bash
cd frontend/admin-portal

# Install dependencies
npm install

# Run development server (different port)
npm start
```

## Development Workflow

### Hot Reload

All services support hot reload:

- **Backend**: Flask auto-reloads on Python file changes
- **Frontends**: Angular watches for file changes and auto-recompiles

### Stopping Services

**Windows**: Close the command windows or press Ctrl+C in each

**Linux/Mac**: Press Ctrl+C in the terminal running run-local.sh

## Troubleshooting

### Port Already in Use

If ports 4200, 4201, or 5000 are already in use:

**Backend (Port 5000):**
Edit `backend/app.py`:

```python
app.run(host='0.0.0.0', port=5001, debug=True)  # Change to 5001
```

Update frontend environment files to match.

**User Portal (Port 4200):**

```bash
cd frontend/user-portal
ng serve --port 4202
```

**Admin Portal (Port 4201):**

```bash
cd frontend/admin-portal
ng serve --port 4203
```

### Database Connection Issues

1. Verify PostgreSQL is running:

```bash
pg_isready -h localhost -p 5432
```

2. Check database credentials in `backend/config.py`

3. Ensure database exists:

```bash
psql -U admin -d rental_portal
```

### Python Virtual Environment Issues

**Windows:**

```bash
# Delete and recreate
rmdir /s backend\venv
cd backend
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
```

**Linux/Mac:**

```bash
# Delete and recreate
rm -rf backend/venv
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Node Modules Issues

```bash
# Delete and reinstall
cd frontend/user-portal
rm -rf node_modules package-lock.json
npm install

cd ../admin-portal
rm -rf node_modules package-lock.json
npm install
```

### Database Not Seeding

If you need to reset and reseed the database:

1. Stop the backend
2. Delete the database:

```sql
DROP DATABASE rental_portal;
CREATE DATABASE rental_portal;
GRANT ALL PRIVILEGES ON DATABASE rental_portal TO admin;
```

3. Restart the backend - it will auto-create tables and seed data

## Environment Configuration

### Backend Configuration

Edit `backend/config.py` to change:

- Database URL
- JWT secret key
- Token expiration time

### Frontend Configuration

Edit environment files:

- `frontend/user-portal/src/environments/environment.ts`
- `frontend/admin-portal/src/environments/environment.ts`

Change `apiUrl` if backend is on different port.

## Building for Production

### Backend

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate.bat on Windows
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend

```bash
# User Portal
cd frontend/user-portal
npm run build
# Output in dist/user-portal

# Admin Portal
cd frontend/admin-portal
npm run build
# Output in dist/admin-portal
```

## IDE Setup

### VS Code (Recommended)

Install extensions:

- Python
- Angular Language Service
- Tailwind CSS IntelliSense
- ESLint
- Prettier

### PyCharm / WebStorm

Configure Python interpreter to use `backend/venv`

## Testing

### Backend Tests

```bash
cd backend
source venv/bin/activate
pytest  # If tests are added
```

### Frontend Tests

```bash
cd frontend/user-portal
npm test

cd ../admin-portal
npm test
```

## Performance Tips

1. **Use Production Build**: Angular development build is slower
2. **Database Indexing**: Production should add indexes
3. **Caching**: Implement Redis for session management
4. **API Optimization**: Add pagination for large datasets

## Support

For issues during local development:

1. Check the terminal/console for error messages
2. Verify all prerequisites are installed
3. Ensure PostgreSQL is running
4. Check firewall settings for ports 4200, 4201, 5000, 5432
5. Review the troubleshooting section above

---

**Ready to develop!** 🚀

Run `setup-local.bat` (Windows) or `./setup-local.sh` (Linux/Mac) to get started.
