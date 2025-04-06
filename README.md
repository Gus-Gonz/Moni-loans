# Loan Request System - MONI

This is a full-stack loan request system consisting of:

- **Frontend**: React app styled with Tailwind CSS.
- **Backend**: Django + DRF REST API.
- **Database**: PostgreSQL.
- **Docker** and `docker-compose` for local development.

---

## Getting Started

1. **Clone the repository**

```bash
git clone {URL}
cd moni-loans
```
2. **Environment Variables**

Environment variables are already configured in the docker-compose.yml.

Backend:
```
DB_NAME=loans_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432

ENVIRONMENT: local

LOAN_VALIDATION_API_KEY=YOUR_KEY_HERE
LOAN_VALIDATION_API_URL=https://YOUR_URL_HERE
```

**YOU WILL NEED TO UPDATE THE LAST 2**

Frontend (passed as a build ARG):
```
VITE_API_BASE_URL=http://localhost:8000/api
```

3. **Access the application**

Frontend: http://localhost:3000

Backend API: http://localhost:8000/api

4. **Test users**

**Admin:**
```
Username: Admin
Password: Admin1234
```
**Analyst:**
```
Username: Analyst
Password: Analyst1234
```

Loan management for authenticated users with roles:
  - 👩‍💼 **Analyst**: Can list and view loan requests
  - 👨‍💼 **Admin**: Can list, view, edit, approve, and reject loan requests
  
