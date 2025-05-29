---
title: "Flyweight Pattern"
date: 2020-10-12
 draft: false
categories: ["architecture"]
tags: ["architecture", "DesignPattern"]
---

> References:  
> [Refactoring Guru - Flyweight Pattern](https://refactoring.guru/design-patterns/flyweight)  
> [Original Korean post](https://jurogrammer.tistory.com/114)

## What is the Flyweight Pattern?

The Flyweight Pattern is a **structural design pattern** that saves memory by sharing common parts of state between multiple objects, instead of keeping all data in each object. In other words, it is a caching technique for objects.

## Situation

Imagine a shooting game where players fire various types of projectiles: bullets, missiles, and shotgun shells. Shortly after starting, the game runs out of memory and crashes.

### Cause of the Problem

Each projectile (particle) has its own x, y coordinates, vector, speed, color, and image. Every time a new bullet is created, all these properties are stored in memory. For example, if each bullet takes up 21KB, then 1 million bullets would consume 21GB of memory!

## Solution – Share Common Elements Among Objects!

Let's analyze the properties of a bullet:
- Each bullet has unique `x, y coordinates`, `vector`, and `speed`. These are called **extrinsic state** (values that change per object).
- However, the `color` and `image` are the same for all bullets of the same type. These are called **intrinsic state** (fixed values).

The Flyweight pattern ensures that only the intrinsic state is stored in the shared object, and the extrinsic state is passed in as needed. Objects that only contain intrinsic state are called **flyweights**.

Refactoring the example:
1. The `Particle` class only contains intrinsic properties like color and sprite.
2. Extrinsic properties are separated into a `MovingParticle` class.
3. The `MovingParticle` holds a reference to a shared `Particle` object, saving memory by not duplicating intrinsic data.
4. The `Game` class manages the creation and sharing of intrinsic objects, so new particles can reference existing ones.
5. The origin particle is selected by the `MovingParticles` object, and extrinsic values are passed to the `Particle`'s methods as needed.

### Implementation Note

Since intrinsic state is shared across different contexts, it **must be immutable**.

## Structure

In the example, the `Game` class is responsible for both resource management and creation, but typically, this responsibility is delegated to a `FlyweightFactory` (using the Factory Method pattern).

The term **original object** refers to the fact that the object's properties have been split into intrinsic and extrinsic parts.

### 1. FlyweightFactory
- Responsible for creating and managing flyweight objects.
- Only creates a new flyweight if one does not already exist for the requested state.

### 2. Flyweight
- Holds the shared (intrinsic) state.
- Methods accept unique (extrinsic) state as parameters.

### 3. Context
- Represents the combination of intrinsic and extrinsic state.
- Can be implemented in two ways:
  1. The flyweight object has a method that takes extrinsic state and performs operations. The context passes extrinsic state to the flyweight.
  2. The context class itself implements the operation, and the flyweight is just a data holder.

### 4. Client
- Calculates and stores extrinsic state.
- From the client's perspective, the flyweight is a template that can be used with different runtime data.
- For example, in a shooting game, the user's character fires a bullet (extrinsic: position) and the bullet image (intrinsic) is shared.

## Example Code – Drawing Trees

### Forest

```java
public class Forest extends JFrame {
    private List<Tree> trees = new ArrayList<>();

    public void plantTree(int x, int y, String name, Color color, String otherTreeData) {
        TreeType type = TreeFactory.getTreeType(name, color, otherTreeData);
        Tree tree = new Tree(x, y, type);
        trees.add(tree);
    }

    @Override
    public void paint(Graphics graphics) {
        for (Tree tree : trees) {
            tree.draw(graphics);
        }
    }
}
```

### Tree

```java
public class Tree {
    private int x;
    private int y;
    private TreeType type;

    public Tree(int x, int y, TreeType type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    public void draw(Graphics g) {
        type.draw(g, x, y);
    }
}
```

### TreeType

```java
public class TreeType {
    private String name;
    private Color color;
    private String otherTreeData;

    public TreeType(String name, Color color, String otherTreeData) {
        this.name = name;
        this.color = color;
        this.otherTreeData = otherTreeData;
    }

    public void draw(Graphics g, int x, int y) {
        g.setColor(Color.BLACK);
        g.fillRect(x - 1, y, 3, 5);
        g.setColor(color);
        g.fillOval(x - 5, y - 10, 10, 10);
    }
}
```

### TreeFactory

```java
public class TreeFactory {
    static Map<String, TreeType> treeTypes = new HashMap<>();

    public static TreeType getTreeType(String name, Color color, String otherTreeData) {
        TreeType result = treeTypes.get(name);
        if (result == null) {
            result = new TreeType(name, color, otherTreeData);
            treeTypes.put(name, result);
        }
        return result;
    }
}
```

## Notes
- When reusing objects in different contexts, always ensure intrinsic state is immutable.
- The Flyweight pattern is often used with the Composite pattern to share leaf nodes.

---

> Translated from [jurogrammer.tistory.com/114](https://jurogrammer.tistory.com/114) 