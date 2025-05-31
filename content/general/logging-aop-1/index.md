---
title: "Logging AOP Implementation - 1"
date: 2021-09-19T18:30:14+09:00
categories: ["General"]
tags: ["AOP", "Java"]
---

![profile](default_L.png)

# Introduction

Logging is not code for handling business logic, but rather for monitoring. That's why logging appearing in the middle of business logic is very uncomfortable to see.

Spring provides AOP, but I wanted to try implementing it myself without looking at Spring's implementation. So, this time, I want to think about how to implement a great logging AOP.

# Situation

Let's write a `sayHello` method in the `Person` class and call it from `main`. Here, let's assume the person object is provided by a framework.

### Person

```java
public class Person {
    private String firstName;
    private String lastName;
    private int age;

    public Person(String firstName, String lastName, int age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }

    public void sayHello(String statement) {
        System.out.println(String.format("%s, my name is %s, and age is %d", statement, firstName + lastName, age));
    }
}
```

Since we will create several styles of frameworks, let's define a framework interface.

### Framework

```java
public interface Framework {
    Person getPerson(String firstName, String lastName, int age);
}
```

Next, let's write the client code for execution. It receives a specific framework as a parameter, passes arguments to the framework to get a person object, and then executes the hello method.

### Runner

```java
public class Runner {
    public void frameworkRun(Framework framework) {
        Person person = framework.getPerson("juro", "grammer", 100);
        person.sayHello("nice to meet you~");
    }
}
```

# Methods That Come to Mind Immediately

Hmm... I learned about reflection before, but it's not magic. I thought there would be a function to detect method calls at runtime, but it wasn't in the reflection documentation.

So, recalling what I learned from Hibernate, I thought of passing instances using the proxy pattern. If you apply the proxy pattern, you can implement actions before and after method calls, and the client can use the proxy object without knowing it's a proxy.

So, let's think of some methods based on the keyword 'proxy pattern.'

## [Method 1] Classic Proxy Pattern (Using Interface)

Define an interface for the Person class to implement.

Then, both the Person class and ProxyPerson class implement this interface. Finally, when the client requests a person class, you return the ProxyPerson class.

### Problem

The developer is forced to implement the interface. Even if only the Person class is needed, you are forced to create an interface just for logging.

It felt wrong, so I didn't even implement it in code.

## [Method 2] Proxy Pattern Using Inheritance

Implement a ProxyPerson class that extends the Person class.

According to the Liskov Substitution Principle, passing a subclass works fine, so we use inheritance. The code is as follows:

**PersonProxy**

```java
public class PersonProxy extends Person {
    public PersonProxy(String firstName, String lastName, int age) {
        super(firstName, lastName, age);
    }

    @Override
    public void sayHello(String statement) {
        System.out.printf("current Time: %s%n", LocalDateTime.now());
        System.out.printf("current statement: %s%n", statement);
        super.sayHello(statement);
    }
}
```

Then, before calling the sayHello method, you log and then execute the method.

In the framework, when a Person object is requested, you should return this PersonProxy object.

**PersonFramework**

```java
public class ProxyFramework implements Framework {
    @Override
    public Person getPerson(String firstName, String lastName, int age) {
        return new PersonProxy(firstName, lastName, age);
    }
}
```

**run**

```java
@Test
@DisplayName("Apply AOP using proxy")
void apply_proxy_framework() {
    Framework proxyFramework = new ProxyFramework();
    runner.frameworkRun(proxyFramework);
}
```

**Output**

```
current Time: 2021-09-19T17:41:21.082118
current statement: nice to meet you~
nice to meet you~, my name is jurogrammer, and age is 100
```

### Problem

You have to write the ProxyPerson class... Who writes it? In the end, the developer using the framework has to write it. The same problem as the first method.

So, we need a way to manipulate things without writing the class...

## [Method 2] Anonymous Class

Then, let's not write a Proxy class! Instead, use an anonymous class!

In the anonymous class, you can access the Person class's methods via super. So, log first, then call the method.

**AnonymousFramework**

```java
public class AnonymousFramework implements Framework {
  @Override
  public Person getPerson(String firstName, String lastName, int age) {
      return new Person(firstName, lastName, age) {
          @Override
          public void sayHello(String statement) {
              System.out.printf("current Time: %s%n", LocalDateTime.now());
              System.out.printf("current statement: %s%n", statement);
              super.sayHello(statement);
          }
      };
  }
}
```

**run**

```java
@Test
@DisplayName("Apply AOP using anonymous class")
void apply_anonymous_framework() {
    Framework anonymousFramework = new AnonymousFramework();
    runner.frameworkRun(anonymousFramework);
}
```

**Output**

```
current Time: 2021-09-19T17:58:07.775068
current statement: nice to meet you~
nice to meet you~, my name is jurogrammer, and age is 100

Process finished with exit code 0
```

It prints well~ It works fine without the user having to write a proxy class file.

# Summary of Problems with These Methods

But... if you think about it, there are several problems.

### Can you apply logging to arbitrary classes?

As you can see from the method names, the framework knows about the Person class.

When developing the framework, you shouldn't even know the Person class exists, and you should be able to apply logging to various classes in the same way.

How can we generalize this?

I found a hint: dynamic proxy.

https://docs.oracle.com/javase/8/docs/technotes/guides/reflection/proxy.html

I'll cover this in the next post.

### What if you want to do something other than logging before a method call?

Right now, before super.sayHello, we log with system.out.println, but what if you need to do something else? You might think of the following problems:

1. The responsibility for changes increases.
2. How do you add code for additional tasks...?

I think... to handle these two, it's best to implement it using the observer pattern.

Before executing super.sayHello, dispatch an event like the following to an event store data structure:

```json
{
    "type": "preInvokeMethod",
    "targetClass": "Person",
    "info": {
        "parameterNames": [],
        ...
    }
}
```

The event store data structure stores subscribers by class and event type. When the dispatch method is executed, it passes the above argument to the subscriber and calls a specific method.

```java
for(Subscriber subscriber : subscribers) {
    subscriber.handle(event)
}
```

Wouldn't it work like this?

(Here, subscriber means logging objects, etc.)

# In Conclusion

This time, I implemented some very simple methods and looked at their problems. Next time, I'll implement a framework that can log not just for the Person class, but for any class. I'll develop it step by step~~ 