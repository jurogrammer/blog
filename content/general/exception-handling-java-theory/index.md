---
title: "Exception handling - Java Exception Handling (Theory)"
date: 2021-08-08T16:21:00+09:00
categories: ["General"]
tags: ["General", "Exception Handling", "Java"]
---

# Parent Topic

[Exception handling journey](/blog/general/exception-handling-journey/)

# References

- clean code
- effective java
- [oracle java docs](https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html)

This time, let's talk about what an exception is and how to handle exceptions.

# What is an exception?

Let's see how Oracle defines it:

> An exception is an event, which occurs during the execution of a program, that disrupts the normal flow of the program's instructions.

It means an event that disrupts the normal flow during program execution.

But what is "normal flow"? I defined normal flow as follows. Let's assume the following situation:

# Situation

```python
def divide(dividend, divisor):
    return dividend/divisor
```

### Each party's expectations

From the caller's perspective, what is expected from divide is the result of the division operation.
From divide's perspective, it expects the caller to provide valid values for division.

So, an operation like `divide(1,10)` returns 0.1 as expected.

### Abnormal flow

But what if you call divide(1,0)? This can't be calculated, right?
Not only can the caller not get the expected value, but divide also receives an invalid value it can't process.

In other words, since the normal flow is broken, divide has no choice but to throw an exception.

So, normal flow can be defined as: when you do not receive the expected result!

# What should you do about exceptions?

So, if the caller calls divide(1,0) and divide notifies that an exception occurred, what should the caller do?

Let's use an analogy.

### Convenience store part-timer

You are a part-timer at a convenience store. A customer asks for cigarettes, but you're out of stock. What do you do?

**Response 1. Borrow cigarettes from the next store.**

The next store has cigarettes, so you get stock from them and give it to the customer! This is the best response—you give the customer what they want and make a sale.

**Response 2. Report to the owner.**

The next store is also out of cigarettes... You don't know what to do, so you report the situation to the owner. The owner will handle it appropriately.

**Response 3. Do nothing.**

You don't like the owner, so you just tell the customer "we're out" and don't inform the owner. Until the owner checks and restocks, there will be no cigarette sales.

It's the same in computing.

Response 1 is recovery.
Response 2 is exception translation and rethrowing so the next caller can handle it.
Response 3 is not catching the exception.

# How it works

You probably know the syntax, so let's just explain the process.

[https://docs.oracle.com/javase/tutorial/essential/exceptions/definition.html](https://docs.oracle.com/javase/tutorial/essential/exceptions/definition.html)

- When an error occurs in a method, the method creates an exception object and passes it to the runtime system.
- This is called *throwing an exception*.
- The runtime system looks for something to handle the exception object. This is a list of methods in order—called the call stack.
- The runtime system looks for a code block in the call stack methods that can handle the exception. This code block is called an *exception handler*.
- It searches the call stack in reverse order of method calls, and if it finds a handler, it passes the error to it. The appropriate handler is found by exception type. Selecting a handler is called *catching the exception*.
- If the runtime system can't find an appropriate handler in the call stack, the runtime system terminates.

# Tools provided by Java

### checked exception - unchecked exception

A checked exception is an exception that must be declared in the method signature if the method can throw it. The caller must either catch the exception or declare it in its own signature.

On the other hand, unchecked exceptions do not need to be declared. These are general exceptions.

### type

You can define what kind of exception it is. On the handler side, you can catch and handle errors differently depending on the type.

Next, let's mention some skills from Clean Code and Effective Java.

## Clean Code

**1. Define exception classes according to the caller's requirements**

In practice, I used to define only one exception class and just change the message, but it felt awkward. So I thought I should define types, but wasn't sure what criteria to use. After reading Clean Code, it clicked.

In the end, you define classes so the client calling the method can handle each exception type differently!

## Effective Java

**1. When rethrowing, catch and include the error.**

```java
catch (CustomException e) {
    throw new CustomException(message, e);
}
```

Haha; I had problems because I didn't do this. If you only throw the message, the "caused by" is lost and the error stack trace is cut off.

**2. No need to log when rethrowing.**

```java
catch (CustomException e) {
    log.info("error occurred", e);
    throw new CustomException(message, e);
}
```

This is pretty strange code... If you rethrow the exception, you can check the message in the stack trace at the final error handling point. Just log it there.

If you print it twice, it's redundant; if the message is in the stack trace, you can follow the flow, but if you just print the message, it's not helpful. It's terrible.

That's it for the theory. Next, I'll refactor and discuss code based on these ideas. 