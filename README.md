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

## Setup Instructions

### Prerequisite: Clone the repository

Before starting with either the Docker setup or manual setup, you need to clone the repository:

`git clone https://github.com/yourusername/dine-reservation.git`
`cd dine-reservation-service`

---

### Docker Setup

1. **Environment Variables**

- Add the `.env` file in the project root.
- Copy the contents of `.env.example` into `.env`.
- Replace any placeholder values in `.env` with the actual credentials:

`DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@localhost:5432/<DB_NAME>"`

2. **Run the application using Docker**

The project includes a `Dockerfile` for production builds and a `docker-compose.yml` for running the entire stack in Docker.

To build and run the app using Docker, use:

**`npm run docker:up`**

Once the app is running, it will be available at [http://localhost:3000](http://localhost:3000).

3. **Swagger Documentation**

Swagger is integrated using swagger-jsdoc for generating OpenAPI documentation and swagger-ui-express to serve the UI.

- Access the documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

---

### Manual Setup

1. **Install dependencies**

`npm install`

2. **Environment Variables**

- Add the `.env` file in the project root.
- Copy the contents of `.env.example` into `.env`.
- Replace any placeholder values in `.env` with the actual credentials:

`DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@localhost:5432/<DB_NAME>"`

3. **Prisma Database Migration**

Before starting the app for the first time, run the Prisma migration to set up the database schema:

`npm run prisma:migrate`

You can also view the database schema using Prisma Studio:

`npm run prisma:studio`

4. **Run the application**

To start the app manually:

`npm run start`

Once the app is running, it will be available at `http://localhost:3000`.

5. **Running Tests**

Unit and E2E tests are provided to ensure the correctness of the API.

- Run unit tests with Jest:

`npm run test`

6. **Build the Project**

To compile the TypeScript code into JavaScript, run the following command:

`npm run build`

---

## Time Zone Difference

The API expects all times to be provided in UTC. It does not handle any conversion from local time to UTC. For instance, if a client provides a reservation time in the restaurant's local time zone (e.g., 19:00-00.00), the correct UTC equivalent (17:00-22:00 UTC) must be provided when making the request. The server enforces this strict requirement, and reservations are processed according to UTC time only.

## Seat Availability

Each table in the restaurant has 4 seats. It is possible for different users to book up to 4 seats at the same table, as long as there are enough seats available for the requested time. For example, if a user books 2 seats at a table, 2 more seats remain available for other users to reserve during that time slot. The system ensures no overbooking by preventing more than 4 seats from being booked for a table.
