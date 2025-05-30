---
title: "Composite Pattern"
date: 2020-10-12
categories: ["Design Pattern", "Structural Design Pattern"]
tags: ["design-pattern", "Pattern", "Composite", "composite-pattern", "컴포지트"]
---

# References

- [https://refactoring.guru/design-patterns/composite](https://refactoring.guru/design-patterns/composite)
- [https://en.wikipedia.org/wiki/Composite_pattern](https://en.wikipedia.org/wiki/Composite_pattern)

# What is the Composite Pattern?

- Structural design pattern
- Allows you to compose objects into tree structures (**part-whole hierarchies**)
- Lets you treat these objects as if they were individual objects.

<img src="composite.png" width="400px" />

# Situation

- Consider an ordering system.
- There are two types of objects: boxes and products.
- A large box can contain smaller boxes and products.
- An order can be an unpackaged **product** or a **box** containing products or other boxes.

### Goal

Let's find the price of a specific box or product in an order!

### What if we just unwrap everything and check the items?

Code isn't as simple as reality.

1. For each object, we need to check if its type is `Products` or `Boxes`.
2. We also need to check the level of each object (to know items within a specific box).

This method becomes nearly impossible as the size increases.

# Solution

### The answer is the Composite pattern!

Point: The relationship between products and boxes (the core model of the app) forms a tree structure, where higher-level boxes contain lower-level boxes and products (child nodes).

1. Abstract the method that calculates the item's price.
   This way, concrete classes like `products` or `Boxes` can perform the same method.
2. The method's content is as follows:
   1. If it's an item:
      Simply return the item's price.
   2. If it's a box:
      Ask for the price of the items in the box (delegate) and sum them up to return the box's price.
      Therefore, if there's a smaller box within this box, it also performs this operation recursively.

#### Biggest Advantage

1. You can get the price without worrying about the concrete classes that make up the tree.
   In other words, since you depend on the interface, you don't need to care if it's an item or a very complex box.

# Structure

<img src="composite-structure.png" width="400px" />

### 1. Component (Element, Part)

> The image above is added because Wikipedia explains content that guru separately mentions.

#### Implementation 1: Design for Uniformity

- Has only the operation methods that simple or complex elements need to perform. This way, all elements can be considered to work the same as this interface.
- However, with this implementation, Leaf nodes will have methods like adding and removing children, even though they don't have children.

#### Implementation 2: Design for Type Safety

- To prevent Leaf nodes from performing Composite-only operations, Component only includes common methods. Then, Composite-specific methods are added to Composite.
- However, this implementation provides Type Safety but loses Uniformity.

### 2. Leaf

- Leaf nodes belong to basic elements. They don't have sub-elements.

### 3. Composite (aka. Container)

- Has leaf nodes or containers as sub-elements.
- This container doesn't know the concrete class of its sub-elements; it knows them through Component.
- When it receives a request, it passes the request to its sub-elements, processes intermediate results, and then returns the final result to the client.

### 4. Client

- Communicates with elements through Component. It can handle any element in the same way.

##### Summary

> Component is a generalized term for Leaf and Composite.
>
> Component can be classified into Leaf and Composite.
>
> That Composite can then be composed of other Composites and Leaves.

# Pros and Cons

### Pros

1. You can handle complex tree structures conveniently.
2. Even if you add new element types, you don't need to modify existing code because you depend on the abstract class Component.

### Cons

1. It can be difficult to apply a common interface to different elements. Therefore, there's a risk of over-generalizing the component interface, which can make it harder to understand later. 