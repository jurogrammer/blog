---
title: "Asynchronous Programming - Summary"
date: 2022-08-29
categories: ["General"]
tags: ["General", "Async"]

---

I will elaborate further through Java API and technical blog introductions in the future.

# Asynchronous

## What is Asynchronous?

Processing tasks not in sequential order.

## When is it used?

Used for performance improvement.

- When there are I/O operations
- When there are CPU bounded jobs (batch jobs)

## Considerations when writing asynchronous programs

- How to use the results of asynchronous tasks?
    - callback
        - Pass a function (routine) to perform additional work upon completion.
    - blocking
        - Wait until all are completed
    - using buffer
        - Able to use data even if I/O is not finished
- What state are the asynchronous tasks in?
    - Responding according to state
        - If all are completed -> process
        - If in progress -> wait or proceed to the next process
        - If an error occurred -> fail the entire process, etc.
- How to handle asynchronous I/O tasks?
    - non-blocking (event loop method)
    - blocking (request I/O to Thread in the usual way)
- When splitting multiple jobs, how to handle completion or failure
    - If all are completed, success
        - How to determine if all succeeded?
    - If even one fails, all fail (fail fast)
        - How to determine if one failed?
    - If even one is completed, treat as success
        - How to determine?
    - Process in the order of completion
- Concurrency
    - Since the purpose of asynchronous tasks is performance improvement, multiple threads may be used. In this case, concurrency issues must be resolved when accessing the same resource.
    - volatile
        - Ensures that the value referenced is from main memory, not cached in the CPU register (to resolve shared resource inconsistency issues)
    - CompareAndSwap
        - Ensures atomicity of operations at the CPU level for Check Then Act. Only one thread can perform the operation.
        - Changes the value of a variable only if it contains the expected value.
        - Used instead of the synchronization keyword (lock). If a thread is blocked, it cannot immediately wake up from the blocked state.
    - ForkJoinPool
        - Work-stealing technique. Threads can steal jobs assigned to other threads.
        - Tasks cannot be perfectly evenly distributed among threads. Therefore, idle threads can take tasks from busy threads.

## Asynchronous processing at the system level?

- Use a message queue
- The producer sends a message about the work to the queue, and the consumer reads the message and processes the work
- Message queues are also used to decouple dependencies in event-driven design
- Transaction unit
    - Group up to message publishing as a single transaction.
    - Whether the asynchronous task is completed is not of concern.
- You can think of the message as a task. If the consumer fails to process due to an error, re-publishing is necessary. 