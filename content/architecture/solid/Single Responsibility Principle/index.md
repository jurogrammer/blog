---
title: "Single Responsibility Principle"
date: 2020-10-11
categories: ["Architecture"]
tags: ["Architecture", "OOP"]
---

# Single Responsibility Principle

## Source

[https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)

## Question

> What exactly is a reason to change?

## How people interpret "reason to change"

1. Bug fix?
2. Refactoring?

## Core Idea

Relate "reason to change" with "responsibility".

The above two are the programmer's responsibility.

=> **Who should the program's design respond to?!**

## Example

### 1. CEO
Reporting to the CEO is a C-Level decision (CFO, COO, CTO).

### 2. CFO
Responsible for controlling finance.

### 3. COO
Responsible for operating the company.

### 4. CTO
Responsible for the company's technical development.

```java
public class Employee {
  public Money calculatePay();
  public void save();
  public String reportHours();
}
```

The reason for change ultimately comes from people!

If an employee makes a mistake in calculatePay, the CFO will be responsible. If save() is wrong, the CTO will be responsible. So, the CFO will instruct to change the relevant function if something is wrong!

Other functions should not be changed in this case. When you change one thing, only that part should change. If other things change, it means changes for different reasons are affecting other functions.

### Restatement

Another wording for the Single Responsibility Principle is:

> Gather together the things that change for the same reasons. Separate those things that change for different reasons.

If you think about this, you'll realize that this is just another way to define cohesion and coupling.

**Cohesion**

The degree of closeness of functions and data within a module (how closely related they are).

**Coupling**

The degree to which one module depends on another. The less related the modules are, the lower the coupling, and the higher the independence between modules. 