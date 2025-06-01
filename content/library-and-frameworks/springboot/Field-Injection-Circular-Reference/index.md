---
title: "[Spring] Circular Reference Error Caused by Field Injection"
date: 2020-06-01T23:24:36+09:00
categories: ["Library & Framework"]
tags: ["Spring", "Java"]
---

## References

- edwith DobiSocks reviewer
- [https://www.mimul.com/blog/di-constructor-injection/](https://www.mimul.com/blog/di-constructor-injection/) (Why DI is needed)
- [https://madplay.github.io/post/why-constructor-injection-is-better-than-field-injection](https://madplay.github.io/post/why-constructor-injection-is-better-than-field-injection) (Why constructor injection is recommended over field injection)
- [https://d2.naver.com/helloworld/1230](https://d2.naver.com/helloworld/1230) (JVM Internal)

## Overview

In an edwith course, I submitted a project using field injection for DI. However, the reviewer recommended constructor injection and kindly provided related materials. Although I understood most of the points, I didn't quite get how constructor injection prevents circular reference errors, so I decided to summarize it here.

## Assumption

Suppose class A needs an instance of class B, and class B needs an instance of class A.

### Field Injection

```java
public class A {
    @Autowired
    private B b;
}
```

```java
public class B {
    @Autowired
    private A a;
}
```

### Constructor Injection

```java
public class A {
    private final B b; // Can also be declared as private B b; The advantage is you can use final. Not explained here.

    @Autowired
    public A(B b) {
        this.b = b;
    }
}
```

```java
public class B {
    private final A a;

    @Autowired
    public B(A a) {
        this.a = a;
    }
}
```

## Class Loader

To understand the difference between the two types of injection, you need to know how the JVM class loader works.

The JVM class loader is dynamic. In other words, not all classes are loaded at compile time; instead, classes are loaded at runtime when needed by the class loader.

Keep this in mind as we look at the difference between field and constructor declarations.

## Difference Between Field and Constructor Declarations

### Field Declaration

When class A is loaded, it only has a reference variable of type B. That is, when an instance of class A is created, there is no need to create an instance of B.

### Constructor Declaration

As you know, the constructor is a method that runs when the object is created. So, when object A is created, object B is also created and assigned.

This is exactly the difference that allows Spring Framework to prevent circular reference errors.

## How Circular Reference Errors Are Prevented

Let's explain how Spring Framework prevents circular reference errors during startup.

1. DispatcherServlet and ContextLoader are created and read the configuration.
2. Based on the configuration, **bean objects are created**.

The key difference is in step 2.

If you use field injection, the referenced object is not declared, so initialization completes without a circular reference error. However, when class B or class A is loaded later, a circular reference error will occur.

In contrast, with constructor injection, a circular reference error occurs at the time of bean creation. This means you can catch circular reference errors before running the server.

That's why the reviewer said you should use constructor injection to prevent circular reference errors!

## In Conclusion...

This is one reason why you should use constructor injection. For other advantages, please refer to the two resources above.

I paid 21,000 won for this review, but I don't regret it at all! If I had done the project alone, I would have realized this much later. Now, I have more time to master it. Totally worth it~!

On the other hand, I gained another perspective on what clean code is. Code that is not only readable but also prevents errors in advance! I will keep this in mind when writing code.

To become not just a coder, but a great developer! 