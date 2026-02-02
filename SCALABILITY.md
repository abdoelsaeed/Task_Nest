# Scalability Considerations

This document explains how the Job Scheduler microservice can scale to handle higher load and multiple services, without changing the core design.

The focus here is on **design decisions and future considerations**, not on implementing complex infrastructure.

---

## 1. Database as the Single Source of Truth

All job-related data (status, next run time, last run time) is stored in the database.

This makes the system:
- Restart-safe
- Stateless at the application level
- Easy to scale horizontally

Any application instance can pick up jobs by querying the database.

---

## 2. Horizontal Scaling with Multiple Instances

The service can be scaled by running multiple instances of the application behind a load balancer.

- API traffic can be distributed across instances
- Each instance can run the scheduler loop
- All instances rely on the same database state

This allows the system to support thousands of users and services.

---

## 3. Polling-Based Scheduler

The scheduler uses a polling approach instead of in-memory timers.

Benefits of this approach:
- No dependency on a single running instance
- Jobs are not lost if an instance crashes
- Scheduling logic remains simple and predictable

The polling interval can be adjusted based on load and performance requirements.

---

## 4. Avoiding Duplicate Job Execution

In a multi-instance setup, there is a risk that the same job could be picked up by more than one instance.

Possible future improvements to handle this include:
- Using database-level locks
- Atomic updates when marking jobs as running
- Introducing a distributed locking mechanism

These approaches ensure that each job is executed only once.

---

## 5. API and Database Optimization

To handle high request volume:
- API endpoints use pagination and query limits
- Proper database indexing can be applied on frequently queried fields (e.g. status, nextRunAt)
- Read and write operations are kept simple and efficient

This helps the service scale to thousands of requests per minute.

---

## Summary

The scheduler is designed to scale by:
- Keeping state in the database
- Using stateless application instances
- Relying on simple and predictable polling logic

This design keeps the system easy to reason about while allowing future scalability improvements when needed.
