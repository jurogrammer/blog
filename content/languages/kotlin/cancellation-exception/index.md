---
title: "Why CancellationException Should Be Rethrown"
date: 2025-06-02T21:09:00+09:00
categories: ["Languages"]
tags: ["Languages", "Kotlin", "Exception"]
---

# Reference

- It's easier to understand if you think of a thread's interrupt as a job's cancel.
- When using `runCatching`, you must write code to rethrow the `CancellationException`. Kotlin does not provide a convenience method for this. - [Related Issue](https://github.com/Kotlin/kotlinx.coroutines/issues/1814)

# Reason

When a job is cancelled, it should not continue running. However, if you catch a `CancellationException`, the job may continue to run, so it is recommended to rethrow it.

## Problematic Code
If you do not rethrow, a job that is already cancelled may continue to run.

![problem-code](Screenshot_2025-05-29_at_10.03.47_am.png)

For example, `launch { testTask() }` continues to run even after its state has changed to cancelled, so both `apiCall Start` and `CancellationException` are printed in sequence.

## Correct Code
Therefore, if the job is finished, no more code should be executed, so you must throw a `CancellationException` to end code execution.

![correct-code](54af6f72-aee8-447e-aef2-ee1f3909efdc.png)

The principle is simple. If a function throws an exception, it will not execute any further.

# Reference

### Kotlin Deep Dive - It is recommended to rethrow `CancellationException`.

![deep-dive](e16b6ce4-6205-422a-a480-f6b0b55fc44f.png)

### Code Example - Coroutine Deep Dive
[https://github.com/MarcinMoskala/kotlin-coroutines-recipes/blob/master/src/commonMain/kotlin/retryWhen.kt#L19-L21](https://github.com/MarcinMoskala/kotlin-coroutines-recipes/blob/master/src/commonMain/kotlin/retryWhen.kt#L19-L21)

![code-example](8091e0fc-83f7-4b0a-8dd4-c3a8bc030b80.png) 