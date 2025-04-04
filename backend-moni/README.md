# MONI Loan Request Backend

Backend for managing loan requests. It provides a public API for users to apply for a loan, and an administrative interface protected by authentication and role-based permission control.

## Features

- Loan request submission without registration
- Automatic loan validation via an external API
- Loan management for authenticated users with roles:
  - 👩‍💼 **Analyst**: Can list and view loan requests
  - 👨‍💼 **Admin**: Can list, view, edit, approve, and reject loan requests
- JWT-based authentication system
- Unit testing included

---

## Technologies

- Python 3.13  
- Django + Django REST Framework  
- PostgreSQL  
- JWT (via `djangorestframework-simplejwt`)  
- Docker + Docker Compose  
- Poetry (for dependency management)

---

## 📝 Notes

- Signals are used to automatically create user groups, permissions, and example users.
- The `LoanValidationService` handles integration with the external API for loan validation.
- Access to the admin endpoints requires authentication and proper permissions.
