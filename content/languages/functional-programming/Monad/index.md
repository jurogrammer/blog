---
title: "Is This a Monad?"
date: 2023-06-25T19:37:00+09:00
categories: ["Languages"]
tags: ["Languages", "FunctionalProgramming", "Monad", "Optional"]
math: true
---

# References

- Monad English Wiki: https://en.wikipedia.org/wiki/Monad_(functional_programming)
- Function English Wiki: https://en.wikipedia.org/wiki/Function_(mathematics)
- Function Korean Wiki: https://ko.wikipedia.org/wiki/함수

# Introduction

This time, I want to take a different approach. Instead of explaining what a monad is right away, let's consider the problems encountered when composing functions, and then present solutions to understand what can be called a monad.

So, let's first revisit what a function is, to improve understanding, and then explain the problematic example. Please note that this post contains personal opinions. As the title suggests, I can't confidently say "this is a monad!"

# Function

## Things That Can Be Called Functions

While spacing out at night, I thought that the following real-life expressions could be considered functions.

### case1) Past tense of a verb

$$
go \overset{past}{\longrightarrow} went
$$

$$
run \overset{past}{\longrightarrow} ran
$$

If you express the verb "go" in the past tense, it becomes "went."
If you express the verb "run" in the past tense, it becomes "ran."

### case2) Branch name

For issue number 5, please name the branch as follows: feature/issue-5

$$
issue \\#5 \overset{branch}{\longrightarrow} feature/issue-5
$$

For issue number 10, like this: feature/issue-10

$$
issue \\#10 \overset{branch}{\longrightarrow} feature/issue-10
$$

Does it look like a function to you? A specific rule or operation maps x to y. The way of expressing branch names in English is very similar to the mathematical notation for functions.

$$
X \overset{f}{\longrightarrow} Y
$$

Let's look at the definition of a function.

### Function

> In mathematics, a function (Korean: 함수, English: function) or mapping (Korean: 사상, English: map, mapping) is a binary relation that assigns each element of a set to a unique element of another set. - Korean Wiki

There is a rigorous mathematical definition, but according to the above, case1 and case2 can be described as follows:

#### case1) Past tense of a verb
- Set X: Present tense verbs
- Elements of X: {go, run}
- Function: Expressing present tense verbs as past tense verbs
- Set Y: Past tense verbs
- Elements of Y: {went, ran}

#### case2) Branch name
- Set X: Issue numbers
- Elements of X: {5, 10}
- Function: Expressing issue numbers as branch names
- Set Y: Branch names
- Elements of Y: {feature/issue-5, feature/issue-10}

Simply put, a function is something that maps one thing to another.

Let's stop here for functions and look at the problems when composing functions.

# Problems When Composing Functions

### The null Problem

Quoting from "Modern Java in Action" about the problems with null:

> 11.1.2 Problems with null
> null creates a big hole in the type system.
> null can be assigned to any reference type or other information, so it can be assigned to any reference type.
> Because of this, null can propagate to other systems (...truncated)

In other words, since null can be assigned to any reference type, variables declared as reference types can have two possibilities:
1. An object of the reference type
2. null

If you assume you have an object and call a method, a NullPointerException occurs.

How can we solve this with function composition? Let's look at an example in JavaScript and then in Java.

# Example

(For simplicity, let's assume undefined and null are the same.)

### Problem Description

Names are input with spaces in between.

```javascript
const name1 = "Hong Gil Dong"
const name2 = "Young Hee"
```

Get the length of the third word. If there is no third word, return null.

The given functions are:

```javascript
// Third word
function getThirdCharacter(name) {
    return name.split(" ")[2];
}

// Length
function getLength(str) {
    return str.length;
}
```

#### Result

- name1 → 4
- name2 → null

## Method 1: Procedural

```javascript
function solution(name) {
    if(name == null) {
        return null;
    }

    let thirdCharacter = getThirdCharacter(name);

    if (thirdCharacter == null) {
        return null;
    }

    return getLength(thirdCharacter);
}
```

You have to check for null at every step, making the code longer and harder to read.

## Method 2: Simple Composition

```javascript
function solution(name) {
    return getLength(getThirdCharacter(name))
}
```

But if getThirdCharacter returns undefined, you get an error:

```javascript
TypeError: Cannot read properties of undefined (reading 'length')
```

How can we express this as function composition without errors, like in the procedural method?

# A New Approach

## The Problem: Two Different Return Values

The problem with method 2 is that the function can return different types. Let's look at the types:

- getLength: String → Number
- getThirdCharacter: String → String

But actually, getThirdCharacter can also return null:

- String → null

So, when composing functions, you get:

- case1: String → String → Number
- case2: String → null → (error)

## Define a New Type

If the problem is that the expected types are different, what if we define a third type X that wraps the values used in function composition (name, thirdCharacter), and define functions that always return X?

$$
X \overset{f}{\longrightarrow} X
$$

Now, you can compose functions without errors, since the result is always X.

Let's apply this idea.

### Type Definition

The problem was that the value could be present or absent. So, let's define a third type X that can wrap this value. We'll call it Maybe.

```javascript
class Maybe {
    value

    constructor(value) {
        this.value = value;
    }
}
```

### Type Converter

Let's declare a function that wraps a value in Maybe.

```javascript
function maybeConverter(value) {
    return new Maybe(value);
}
```

So, name becomes:

$$
name \overset{maybeConverter}{\longrightarrow} Maybe_{name}
$$

### Define a Composable Function for Maybe

You can't directly apply getThirdCharacter to Maybe_name, since getThirdCharacter expects a String. Let's define a function f that takes Maybe_name and getThirdCharacter, and returns Maybe_thirdCharacter. We'll call this function map.

```javascript
function map(maybe, mappingFunction) {
    if (maybe.value == null) {
        return maybeConverter(null);
    }
    const newValue = mappingFunction(maybe.value)
    return maybeConverter(newValue)
}
```

Now, you can use map for getLength as well:

$$
(Maybe_{thirdCharacter}, getLength) \overset{map}{\longrightarrow} Maybe_{length}
$$

So, the code becomes:

```javascript
function solution(name) {
    let maybeName = maybeConverter(name);
    let maybeThirdCharacter = map(maybeName, getThirdCharacter);
    let maybeLength = map(maybeThirdCharacter, getLength);
    return maybeLength.value;
}
```

Or, in one statement:

```javascript
function solution(name) {
    return map(map(maybeConverter(name), getThirdCharacter), getLength).value;
}
```

Result:

```javascript
const name1 = "Hong Gil Dong"
const name2 = "Young Hee"

console.log(solution(name1)) // 4
console.log(solution(name2)) // null
```

By defining a third type, you can express this as a composition of functions.

### What if the function returns Maybe?

Sometimes, the function itself returns Maybe:

```javascript
function getThirdCharacterWithMaybe(name) {
    return maybeConverter(name.split(" ")[2])
}
```

If you use map here, you get nested Maybes. What we want is to avoid this and just get Maybe_length. Let's call the function that does this flatMap.

```javascript
function flatMap(maybe, maybeReturnFunction) {
    if (maybe.value == null) {
        return maybeConverter(null);
    }
    return maybeReturnFunction(maybe.value);
}
```

# Object-Oriented Example (Java)

In Java, you can use Optional, which is a kind of Monad. Here is a simplified example:

```java
public class Solution {
    private static final Function<String, String> getThirdCharacter = name -> {
        String[] s = name.split(" ");
        if (s.length < 3) {
            return null;
        }
        return s[2];
    };
    private static final Function<String, Maybe<String>> getThirdCharacterWithMaybe = name -> {
        String[] s = name.split(" ");
        if (s.length < 3) {
            return Maybe.empty();
        }
        return Maybe.of(s[2]);
    };
    private static final Function<String, Integer> getLength = str -> str.length();
}
```

In the case of returning the third character, Java would throw an ArrayIndexOutOfBoundsException, so the code is modified to return null.

This is a test code, and all tests pass:

```java
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
class SolutionTest {
    Solution solution = new Solution();
    @Test
    void solution_3() {
        // 3 words
        String name1 = "Hong Gil Dong";
        Integer result1 = solution.solution3(name1);
        assertEquals(result1, 4);
        // 2 words
        String name2 = "Young Hee";
        Integer result2 = solution.solution3(name2);
        assertNull(result2);
    }
    @Test
    void solution_4() {
        // 3 words
        String name1 = "Hong Gil Dong";
        Integer result1 = solution.solution4(name1);
        assertEquals(result1, 4);
        // 2 words
        String name2 = "Young Hee";
        Integer result2 = solution.solution4(name2);
        assertNull(result2);
    }
}
```

Notice that in object-oriented languages, function composition often becomes method chaining!

# Optional…?

Yes, Maybe is Optional. Optional is considered a kind of Monad. Other examples include:
- JavaScript's Promise
- Webflux's Flux, Mono

These are monads that help you compose functions as if a value exists, even when it might not.

To sum up, a monad can be described as:

> A way to define a new type to overcome difficulties in composing functions continuously

From the wiki, the components of a monad are:
- A type constructor M that builds a monadic type M T
- A type converter, often called unit or return, that embeds an object x in the monad: unit : T → M T
- A combinator, typically called bind (>>=) or flatMap, that unwraps a monadic variable, then inserts it into a monadic function/expression, resulting in a new monadic value: (>>=) : (M T, T → M U) → M U

# Conclusion

Although I haven't strictly defined what a monad is, I think this is enough for a practical understanding. I'll keep refining this post for better examples and explanations. 