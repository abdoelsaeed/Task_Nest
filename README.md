# Job Scheduler Microservice

This project is a simple **job scheduler microservice** built as part of a backend technical assessment.

The main goal of the service is to allow creating scheduled jobs, storing their execution state in a database, and running them automatically based on a defined interval.

The actual job execution logic is intentionally kept **dummy** (for example, logging to the console), as the focus of this task is on system design, scheduling, and backend structure rather than business logic.

---

## 🚀 Tech Stack

- **Language:** TypeScript  
- **Framework:** NestJS  
- **Database:** PostgreSQL  
- **ORM:** TypeORM  
- **Testing:** Jest (End-to-End tests)

---

## 🧠 High-Level Design

- Jobs are created through REST APIs and stored in the database
- Each job contains scheduling metadata such as interval and execution timestamps
- A background scheduler runs using a **polling approach**
- The database acts as the **single source of truth**
- No external scheduling libraries are used

---

## 📦 Features

- Create scheduled jobs with custom payloads
- List jobs with pagination and optional filtering
- Retrieve job details by ID
- Background job execution based on scheduling metadata
- End-to-end testing covering API, database, and scheduler behavior

---

## 🗄️ Job Model (Simplified)

Each job contains the following fields:

- `id` (UUID)
- `name`
- `intervalInSeconds`
- `payload` (JSON)
- `status` (ACTIVE / PAUSED)
- `lastRunAt`
- `nextRunAt`
- `createdAt`
- `updatedAt`

---

## 🔌 API Endpoints

### ➕ Create Job
**POST** `/api/v1/jobs`

Example request body:
```json
{
  "name": "email-job",
  "intervalInSeconds": 10,
  "payload": {
    "type": "email",
    "to": "user@test.com"
  }
}
```

### 📄 List Jobs
**GET** `/api/v1/jobs?page=1&limit=10&status=ACTIVE`

Supports pagination and optional status filtering.

### 🔍 Get Job by ID
**GET** `/api/v1/jobs/:id`

The job ID is validated as a UUID.

---

## ⏱️ Scheduler Logic

- A background scheduler runs every 5 seconds
- It queries the database for jobs that:
  - Are marked as `ACTIVE`
  - Have `nextRunAt` less than or equal to the current time
- Each due job is executed using dummy logic
- After execution:
  - `lastRunAt` is updated
  - `nextRunAt` is recalculated based on the job interval

This approach keeps the scheduler:
- Simple
- Database-driven
- Safe across application restarts

---

## 🧪 Testing

The project includes an End-to-End (E2E) test that verifies:
- Creating a job through the API
- Persisting the job in the database
- Executing the job through the scheduler
- Updating execution timestamps

To keep the tests deterministic and avoid timing issues:
- The scheduler does not auto-run in test mode
- Jobs are manually marked as due inside the test
- The scheduler is triggered explicitly during the test

**Run E2E tests:**
```bash
set NODE_ENV=test && npm run test:e2e
```

---

## ⚙️ Running the Project Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Run database migrations:**
   ```bash
   npm run migration:run
   ```

4. **Start the application:**
   ```bash
   npm run start:dev
   ```

The service will be available at: `http://localhost:3000/api/v1`

---

## 📈 Scalability Notes

This service is designed with scalability in mind:

- The database is used as the single source of truth for scheduling
- Polling allows the service to run safely across multiple instances
- API endpoints use pagination and query limits to protect the database
- The service can scale horizontally by running multiple instances

**Future improvements could include:**
- Distributed locking to avoid duplicate job execution
- Separating the scheduler into its own service
- Optimizing polling frequency dynamically