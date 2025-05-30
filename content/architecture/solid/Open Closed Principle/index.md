---
title: "Open Closed Principle"
date: 2020-10-11
categories: ["Architecture"]
tags: ["Architecture", "OOP"]
---
## Open-Closed Principle

Classes, modules, and functions should be open for extension but closed for modification.

_`- MEYER Bertrand(1988) Object-Oriented Software Construction`_

Allow extension, but do not allow modification.

In other words, a class should be extensible without modification.

## How to Implement the Principle

There are two methods. Both use generalization, but differ in their goals, techniques, and results.

### 1. Meyer's Open-Closed Principle

#### Method

Implement using inheritance.

#### Explanation

By using inheritance, the parent class can be implemented through inheritance, so it is open for extension. Since the parent class is accessed through the child class, the parent class can be hidden and thus closed for modification.

### 2. Polymorphic Open-Closed Principle

#### Method

Implement using abstract classes or interfaces.

#### Explanation

While Meyer refers to inheritance from concrete modules, Robert Martin's method uses abstract classes (or interfaces). In this way, the abstract class is closed for modification, and implementations can be open for extension.

## Robert C. Martin's 1996 Report

The OOD 5 principles were proposed by Robert Martin. Therefore, let's understand OCP based on the document where it was first introduced.

Robert C. Martin "The Open-Closed Principle", C++ Report, January 1996 [Archived](https://web.archive.org/web/20060822033314/http://www.objectmentor.com/resources/articles/ocp.pdf)

### Introduction

*Declare all member variables as private!*

*Avoid global variables!!*

*Run time type identification (RTTI) is dangerous!!*

**What is the fundamental reason for these heuristics?**

What makes these right or wrong?

**=> open-closed principle!**

When a change is needed, you can extend the behavior of a module by simply adding new code, **without modifying the existing working code**.

### Explanation

A module that follows the open-closed principle well has two main characteristics:

1. **Open For Extension**
   - The module can be made to behave in new and different ways to meet changing requirements or new application needs.
2. **Closed for Modification**
   - The module should not be changed (inviolate). Nothing should be able to modify this code.

These two may seem contradictory:

1. Usually, to extend a module, you have to modify it.
2. Generally, if a module cannot be changed, it means it has fixed behavior.

How can this be solved?

### Abstraction is the Key

1. By depending on a **fixed** abstraction, the module is closed for modification.
2. By implementing the abstraction, the module's behavior can be extended.

#### Example 1: Client-Server

If the client uses the server directly, changing (extending) the server means you have to change the server's name in the client code.

But if you depend on an Abstract Server, you can change the server implementation.

#### Example 2: Shape Abstraction

Suppose you have a function DrawAllShapes to draw circles and rectangles.

If a **new shape is added**, DrawAllShapes would need to be modified.

The key is abstraction, so DrawAllShapes should depend on the abstract **Shape** class that circles and rectangles inherit from.

### Strategic Closure

You can't always avoid closing a module for modification. Therefore, you must strategically decide which modules to close for modification.

(Content incomplete)

# Additional Notes

Priority point table 