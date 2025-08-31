# Customer Management CRUD App

This project is a full-stack Customer Management application built with **Laravel**, **React**, **MySQL**, and **Elasticsearch**. It allows you to create, read, update, delete, and search customer records.

## Features

- Add, edit, and delete customers.
- Search customers by name or email.
- Responsive React frontend with modals and toast notifications.
- Elasticsearch integration for fast search.
- Fully dockerized for one-command setup.

## Technologies

- **Backend:** Laravel 12.x
- **Frontend:** React + Bootstrap
- **Database:** MySQL
- **Search:** Elasticsearch
- **Containerization:** Docker & Docker Compose

## Requirements

- Docker
- Docker Compose

## Quick Start

Simply clone the repository and run:

```bash
docker compose up
```

This will:

1. Build and start containers for Laravel, React, MySQL, Elasticsearch, and Nginx.
2. Install PHP & Node dependencies automatically.
3. Run Laravel migrations and seed the database.
4. Sync customer data to Elasticsearch.
5. Serve the React frontend at `http://localhost:5173` and the API at `http://localhost:81`.

No additional setup is required.

## Usage

- **Frontend:** Open [http://localhost:5173](http://localhost:5173) in your browser.
- **API:** Available at [http://localhost:81/customers](http://localhost:81/customers).
- **Search:** Type in the search box to find customers by name or email (debounced for performance).
- **Toast Notifications:** After adding, updating, or deleting a customer, a toast alert will show the status.

## Docker Services

- **app:** Laravel backend
- **react:** React frontend
- **nginx:** Web server for Laravel
- **mysql:** MySQL database
- **elasticsearch:** Elasticsearch search engine

## Database

- MySQL credentials (set in `docker-compose.yml`):
  - **Database:** laravel
  - **User:** laravel
  - **Password:** laravel
  - **Root password:** root
- Migrations and seeders run automatically on container start.

## Notes

- The project is fully dockerized; the user only needs to run `docker compose up`.
- Elasticsearch sync happens automatically after database seeding.
- Contact numbers in the frontend accept only numeric input.

## License

MIT License

