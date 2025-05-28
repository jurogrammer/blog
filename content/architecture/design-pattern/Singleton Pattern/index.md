---
title: "Singletone Pattern"
date: 2020-10-11
draft: false
categories: ["architecture"]
tags: ["architecture", "DesignPattern"]
---

> References:  
> [Refactoring Guru - Singleton Pattern](https://refactoring.guru/design-patterns/singleton)  
> [Wikipedia - Singleton Pattern](https://en.wikipedia.org/wiki/Singleton_pattern)  
> [jeong-pro 블로그](https://jeong-pro.tistory.com/86)

## What is the Singleton Pattern?

The Singleton Pattern is a **creational design pattern** that ensures a class has only one instance and provides a global point of access to it.

## When is it used?

It’s useful in situations where exactly one object is needed to coordinate actions across the system—like:

- Database connection
- A shared configuration object
- A centralized logging service

These are cases where a single, globally accessible instance makes sense.

## Structure
![img](image.png)
To implement a Singleton:

1. Make the constructor private so no other class can instantiate it.
2. Store the instance in a private static field.
3. Provide a public static method that returns the instance.  
   If the instance doesn't exist yet, create it. Otherwise, return the existing one.

## Implementations

### Thread-Safe: Synchronized Method

```java
public class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

This version is thread-safe but can be slow due to method synchronization.

---

### Double-Checked Locking

```java
public final class Singleton {
    private static volatile Singleton instance = null;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized(Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

This is a more efficient thread-safe version by reducing the overhead of acquiring a lock.

---

### Eager Initialization

```java
public final class Singleton {
    private static final Singleton INSTANCE = new Singleton();

    private Singleton() {}

    public static Singleton getInstance() {
        return INSTANCE;
    }
}
```

The instance is created when the class is loaded. Simple and thread-safe, but not lazy-loaded.

---

### Lazy Initialization with Static Holder

```java
public class Singleton {
    private Singleton() {}

    private static class LazyHolder {
        public static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return LazyHolder.INSTANCE;
    }
}
```

This uses the classloader mechanism to ensure that the instance is created only when accessed for the first time.

## Drawbacks

- **Difficult to test**: Since the constructor is private, creating different instances for testing is not possible.
- **Hidden dependencies**: Overuse can lead to tight coupling across the codebase.

## Related Patterns

Singleton is often used with:

- **Abstract Factory**
- **Builder**
- **Prototype**

These can all be implemented as singletons to maintain a single point of access for creation logic.