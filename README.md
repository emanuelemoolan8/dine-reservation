# DineReservationService

DineReservationService is a RESTful API for managing restaurant reservations. It supports user creation, reservation management, and fetching reservations by date range. The service ensures no overbooking and provides table availability in a restaurant with a fixed number of tables.

## Features

- User creation and management
- Reservation creation for a specific time slot (with no overbooking)
- Fetch reservations by date range
- OpenAPI documentation for API endpoints
- Functional programming principles using `fp-ts`
- SQL database integration using Prisma and PostgreSQL
- Validation using `io-ts` for type-safe validation
- Dockerized setup for easy deployment and local development
- Unit tests using Jest, Integration test using supertest
- Optional pagination support for reservation fetching

## Technologies Used

- **Node.js**
- **TypeScript**
- **Express** (API framework)
- **Prisma** (ORM for PostgreSQL)
- **PostgreSQL** (SQL database)
- **fp-ts** (Functional programming)
- **io-ts** (Type-safe validation)
- **Swagger** (API documentation)
- **Jest** (Unit testing)
- **Docker & Docker Compose**

## API Endpoints

### Users

- **Create User**: `POST /users`
- **Get All Users**: `GET /users`

### Reservations

- **Create Reservation**: `POST /reservations`
- **Fetch Reservations by Date Range**: `GET /reservations?start=<start>&end=<end>`
- **Cancel Reservation**: `DELETE /reservations/{id}`

## Requirements

To build and run the project, you need the following tools installed:

- Node.js (>= 18)
- PostgreSQL (as the database)
- Docker & Docker Compose (for local development and deployment)

## Setup Instructions

### 1. Clone the repository

git clone https://github.com/yourusername/dine-reservation-service.git
cd dine-reservation-service

### 2. Install dependencies

`npm install`

### 3. Environment Variables

Create a `.env` file in the project root and define the necessary environment variables:
Copy the `.env.example` file to `.env`
Replace the placeholder values with the actual credentials:

DATABASE_URL=postgres://<username>:<password>@db:5432/restaurant

### 4. Run the application

Docker Compose to start the entire stack (PostgreSQL and the API):

`npm run docker:up`

Once the app is running, it will be available at `http://localhost:3000`.

### 5. Prisma Database Migration

Before starting the app for the first time, run the Prisma migration to set up the database schema:

`npm run prisma:migrate`

You can also view the database schema using Prisma Studio:

`npm run prisma:studio`

### 6. Running Tests

Unit and E2E tests are provided to ensure the correctness of the API.

- Run unit tests with Jest:

`npm run test`

### 7. Build the Project

To compile the TypeScript code into JavaScript, run the following command:

`npm run build`

### 8. OpenAPI Documentation

You can access the Swagger documentation for the API at `http://localhost:3000/api-docs` once the app is running.

### Docker Setup

The project includes a `Dockerfile` for production builds and a `docker-compose.yml` for running the entire stack in Docker.

- **Dockerfile**: Multi-stage Dockerfile to create a lightweight production image.
- **Docker Compose**: Includes the API and PostgreSQL services.

To build and run the app using Docker, use:

`docker-compose up --build`

## Time Zone Difference

The API expects all times to be provided in UTC. It does not handle any conversion from local time to UTC. For instance, if a client provides a reservation time in the restaurant's local time zone (e.g., 19:00-00.00), the correct UTC equivalent (17:00-22:00 UTC) must be provided when making the request. The server enforces this strict requirement, and reservations are processed according to UTC time only.

## Seat Availability

Each table in the restaurant has 4 seats. It is possible for different users to book up to 4 seats at the same table, as long as there are enough seats available for the requested time. For example, if a user books 2 seats at a table, 2 more seats remain available for other users to reserve during that time slot. The system ensures no overbooking by preventing more than 4 seats from being booked for a table.
