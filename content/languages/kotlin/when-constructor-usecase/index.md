---
title: "When Constructor Use Cases"
date: 2025-06-02T21:09:00+09:00
categories: ["Languages"]
tags: ["Kotlin"]
---

# Content

Summary of 'when' usage cases

Source - [Kotlin in Action](https://www.amazon.com/Kotlin-Action-Dmitry-Jemerov/dp/1617293296)

# What is 'when'?

A more powerful version of Java's switch.

### Java switch

- Improves readability of if-else branching by using switch.
- **However**, branch arguments are limited to constants (mainly enums, strings).

### Kotlin when

- Branches can use not only constants (enums, strings) but also arbitrary objects and expressions—no restrictions.
- A universal branching statement.

# Use Cases

## 1. Branching on enums to return a specific string

### enum class

```kotlin
enum class Color {
    RED, ORANGE, YELLOW, GREEN, BLUE, INDIGO, VIOLET
}
```

### when code

```kotlin
fun getMnemonic(color: Color) =
    when (color) {
        Color.RED -> "Richard"
        Color.ORANGE -> "Of"
        Color.YELLOW -> "York"
        Color.GREEN -> "Gave"
        Color.BLUE -> "Battle"
        Color.INDIGO -> "In"
        Color.VIOLET -> "Vain"
    }
```

---
- No need for break; can use arrows
    - With arrow functions in Java switch, this is now similar in Java

Up to here, you might think "Isn't this just like Java?"

## 2. Listing multiple arguments in a branch

```kotlin
// Get the warmth of a color
fun getWarmth(color: Color) = when(color) {
    Color.RED, Color.ORANGE, Color.YELLOW -> "warm"
    Color.GREEN -> "neutral"
    Color.BLUE, Color.INDIGO, Color.VIOLET -> "cold"
}
```

- Can list multiple values in a single branch
    - Also now possible in Java switch

Still seems similar to Java.

## 3. Using objects as arguments

```kotlin
// Mix colors
fun mix(c1: Color, c2: Color) =
        when (setOf(c1, c2)) {
            setOf(RED, YELLOW) -> ORANGE
            setOf(YELLOW, BLUE) -> GREEN
            setOf(BLUE, VIOLET) -> INDIGO
            else -> throw Exception("Dirty color")
        }
```

---
- Can use arbitrary objects as branch conditions
- Checks conditions in order from the top
- Uses equals for object comparison

Here, the difference from switch becomes clear.

## 4. Using expressions

```kotlin
fun mixOptimized(c1: Color, c2: Color) =
    when {
        (c1 == RED && c2 == YELLOW) ||
        (c1 == YELLOW && c2 == RED) ->
            ORANGE

        (c1 == YELLOW && c2 == BLUE) ||
        (c1 == BLUE && c2 == YELLOW) ->
            GREEN

        (c1 == BLUE && c2 == VIOLET) ||
        (c1 == VIOLET && c2 == BLUE) ->
            INDIGO

        else -> throw Exception("Dirty color")
    }
```

---
- No argument! **Major difference from switch**
- No need to create a set object, so can improve performance (though readability may decrease)
- Can use expressions as branches!
- The result of the expression must be Boolean.

At this point, it seems functionally similar to if-else. For most branching logic, you can use when.

## 5. Example using smart casts

### What is a smart cast?

- If you check an object's type, the compiler automatically casts it
    - `is` = `instanceof`

### Example

- Expressing operations like 1+3+5 in an object-oriented way (tree structure)
- Class relationships:
    - Expression type ← Num type (operand)
    - Expression type ← Sum type (operator)

```kotlin
// Class declarations
interface Expr
class Num(val value: Int) : Expr
class Sum(val left: Expr, val right: Expr) : Expr

// Function using when
fun eval(e: Expr): Int =
    when (e) {
        is Num ->
            e.value
        is Sum ->
            eval(e.right) + eval(e.left)
        else ->
            throw IllegalArgumentException("Unknown expression")
    }

fun main(args: Array<String>) {
    println(eval(Sum(Num(1), Num(2))))
}
```

---
- No need for explicit type casting thanks to smart casts
    - In Java 14+, similar pattern matching is available in if statements - [link](https://www.baeldung.com/java-pattern-matching-instanceof#pattern-matching)
- Using when instead of if improves readability
- If you declare as a [sealed interface](https://kotlinlang.org/docs/sealed-classes.html), else is not required.

## 6. Using `in` for ranges

```kotlin
fun rank(score: Int) = when (score) {
    in (4..5) -> 'A'
    in (2..3) -> 'B'
    in (0..1) -> 'F'
    else -> throw IllegalArgumentException("score must be between 0 and 5")
}
```

---
- Can use not only smart casts but also `in` for ranges, showing the versatility of when.

# Summary

If you have a lot of branches in if-else, use when.

**Advantages**
- Improves readability by removing if-else keywords
- Can use smart casts, `in`, and more
- Can be used for all branching logic
- If you list all enum values, the compiler checks at compile time, so no need for a default branch

**Disadvantages**
- What are they?
    - For enums, else is required, so you must write it
        - If not needed, write `else -> Unit`

# TMI - Refactoring the Expr Example

From an OOP perspective:

Instead of extracting values from objects to process logic, it's better to ask the object to process the logic itself.

So, by declaring an eval method in Expr, you can refactor as follows:

```kotlin
interface Expr {
    fun eval(): Int
}

class Num(val value: Int) : Expr {
    override fun eval() = value
}

class Sum(val left: Expr, val right: Expr) : Expr {
    override fun eval() = left.eval() + right.eval()
}

fun main(args: Array<String>) {
    val expression = Sum(Num(1), Num(2))
    println(expression.eval())
}
``` 