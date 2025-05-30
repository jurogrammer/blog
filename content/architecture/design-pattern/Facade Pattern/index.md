---
title: "Facade Pattern"
date: 2020-10-12
categories: ["Design Pattern", "Structural Design Pattern"]
tags: ["design-pattern", "Pattern", "Facade", "facade-pattern", "파사드"]
---

# References

- [https://refactoring.guru/design-patterns/facade](https://refactoring.guru/design-patterns/facade)
  - The interface described here refers to the meaning of API or GUI, not Java's interface keyword.

> _Interface_ is the point or boundary where information or signals are exchanged between two different systems or devices.

# What is the Facade Pattern?

- Structural design pattern
- Provides a simplified interface to a library, framework, or a set of complex classes (or subsystems).

<img src="facade.png" width="400px" />

# Situation

- The application needs to work with objects from various complex libraries and frameworks.

### Problem

If the application directly uses libraries and frameworks, the business logic becomes tightly coupled to them.

# Solution

This problem arises because the application depends on concrete classes.

Therefore, create a class that connects the application and other objects. The key is to provide a common interface for the objects used by the application.

The object that implements this class is called the **facade object**.

There are two main benefits:

#### Benefits

1. By depending on the class that acts as the interface, coupling is reduced.
2. Complex logic can be hidden behind the interface (similar to the abstraction in the bridge pattern).
   For example, uploading an image may involve correction and compression. From the client's perspective, the interface can be simplified to 'please create an image to upload.'
   This is called a "context-specific interface."
   (provide a context-specific interface to more generic functionality)

# Structure
<img src="facade-structure.png" width="400px" /> 

### 1. Facade

Helps clients access specific subsystems conveniently. It knows where to connect client requests and how to operate parts of the subsystem.

### 2. Additional Facade

To prevent a single Facade from being polluted by unrelated features, you can create additional facades. These can be used by clients or other facades.

### 3. Complex Subsystem

These are the parts used by the facade. Multiple parts may be used for meaningful work. The subsystem does not know about the existence of the facade.

### 4. Client

The client accesses subsystem objects through the facade.

