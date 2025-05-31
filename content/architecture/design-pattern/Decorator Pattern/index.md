---
title: "Decorator Pattern"
date: 2020-10-12
categories: ["Design Pattern", "Structural Design Pattern"]
tags: [Design Pattern]
---

# References

- [https://refactoring.guru/design-patterns/decorator](https://refactoring.guru/design-patterns/decorator)

# What is the Decorator Pattern?

- Structural design pattern
- When you want to add new functionality to an existing object, you wrap the original object inside a wrapper object that has the new functionality.

<img src="decorator.png" width="400px" />

# Situation

This situation deals with problems that arise as features expand.

### Initial

- Imagine a notification library.
- This library takes a message and sends it via email.

#### Structure

1. Notifier  
   A library with notification functionality. It receives a message and sends it via email using the send method.
2. Application  
   Holds a Notifier and has a method to send messages through it.

### Extension 1

- Based on user feedback, you want to send notifications not only by email but also by SMS, Facebook, and Slack.
- This is solved by having SMS, Facebook, and Slack inherit from Notifier and implement `send()`.

### Extension 2

- More feedback: users want to send notifications through multiple channels at the same time.

#### Problematic Approach 1

- Create a class with methods for all notification features. (Application uses a single Notifier to send messages.)
- This would require 2^n-1 classes to cover all combinations (binomial theorem).

#### Problematic Approach 2

- What about just using inheritance? This has two problems:
  1. You can't change behavior at runtime (inheritance is determined at compile time).
  2. Most languages don't support multiple inheritance, so you can't inherit multiple features.

# Solution

### Prefer Aggregation or Composition over Inheritance

1. A whole object holds references to part objects. This is called a **Wrapper**.
2. An object can delegate work to other objects.

With this structure, you can decide the container's behavior at runtime and use the features of multiple classes via delegation.

Aggregation and composition are key elements of design patterns, and are also core to the **Decorator** pattern.

### So, use the Decorator pattern! (aka Wrapper)

Applying the Decorator pattern to the above problem gives the following structure:

#### Notifier

- The basic interface for sending messages.

#### E-MAIL Sender

- Acts as a leaf node. Implements the class for sending emails.
- Other feature classes become decorators.

#### BaseDecorator

- The base class for decorators.
- Has a field for a Notifier-type part and the same message-sending functionality.
- Facebook, Slack, etc. inherit from this decorator and implement their own features.

#### SMS, Facebook, Slack Decorator

- Call super:send(message) to invoke the wrapped object's send functionality.
- After that, perform their own message-sending feature.

#### Example code using this notifier in the application

```java
// Features are stacked like a stack.
Notifier stack = new EmailSender();
Notifier stack = new FacebookDecorator(stack);
Notifier stack = new SlackDecorator(stack);
app.setNotifier(stack)

app.doSomething(message);
```

# Structure

<img src="decorator-structure.png" width="400px" />

### 1. Component

- Declares the common interface for both wrappers and wrapped objects.

### 2. Concrete Component

- The class of objects being wrapped. Defines the basic behavior.

### 3. Base Decorator

- Has a field for referencing a wrapped object (of the component interface type).
- Delegates all operations to the wrapped object.

### 4. Concrete Decorators

- Define extra behaviors that can be added dynamically.
- Override methods and execute their behavior before or after calling the parent method.

### 5. Client

- Can wrap components in multiple layers of decorators, as long as it works with all objects via the component interface. 