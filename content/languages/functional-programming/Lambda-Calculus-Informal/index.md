---
title: "Lambda Calculus - Informal Summary"
date: 2021-01-10
categories: ["Languages"]
tags: ["Languages", "FunctionalProgramming"]

---

# Source

- https://en.wikipedia.org/wiki/Lambda_calculus

# Prerequisite Materials

- [https://jurogrammer.tistory.com/131](https://jurogrammer.tistory.com/131) Lambda Calculus Intro
- [https://jurogrammer.tistory.com/132](https://jurogrammer.tistory.com/132) Formal System

# Overview

In this post, I will explain lambda calculus informally. Right, if you start with a formal explanation, it's hard to understand and hard to grasp the context. So, we'll look at formal definitions, arithmetic, booleans, and simulation next time.

To explain lambda calculus again:

It's a formal system, a mathematical logic for expressing computation.

What kind of computation?

- function abstraction  
  The abstract form of a function
- function application using variable binding and substitution  
  Applying a function by binding and substituting variables

Since it's a formal system, there are **symbols** and **notation** used, and there are **inference rules (or operations)** for those symbols, right?

Let's organize the notation first.

# Notation

## Notation

Since we're learning a formal system, we need to know what is a valid expression! In lambda calculus, that's called valid notation.

Valid notation? You might wonder what that means, especially if you're not used to formal systems. I was like that too, haha.

For example, let me write an expression:

```
 ㄱ x 1 = @
```

Doesn't it feel odd? There's multiplication and an equation, but... you don't know what ㄱ or @ are, so you can't call it a mathematical expression.

This discomfort comes from "not using the proper notation defined in mathematics." So, in lambda calculus, you must use valid notation. These valid expressions are called lambda terms.

Let's see what lambda terms look like.

## Lambda Terms

| Syntax     | Name        | Description                    |
|------------|-------------|--------------------------------|
| x          | Variable    | A character or string representing a parameter or mathematical/logical value. |
| (λx.M)     | Abstraction | Function definition (M is a lambda term). The variable x becomes bound in the expression. |
| (M N)      | Application | Applying a function to an argument. M and N are lambda terms. |

This table from Wikipedia shows that there are only three notations used in lambda calculus! Simple, right? The meanings aren't much different from our intuition.

### 1. Variable

This means the variable we usually talk about. But it can mean two things: a parameter or a mathematical/logical value.

Parameter and argument, in other words.

A parameter is a variable used inside a function.

An argument is the value you put in the parameter position to invoke a function. The explanation is a bit more detailed here.

Allowed values are mathematical or logical values.

In math, values are integers like 1, 2, 3, and in logic, values are true or false.

### 2. Abstraction

Abstraction is simply setting up a function. It's not calling it! You haven't put in a value yet.

f(x) = x^2 + 2 and f(2) = 2^2 + 2 are different: the left is just defining the function.

Let's rewrite f(x) = x^2 + 2 in abstraction notation.

The abstraction notation is (λx.M).

x corresponds to the x in f(x), and M corresponds to x^2 + 2.

To put it in words:

> It's a function (λ), and if you put in x, it returns (or substitutes, transforms) M.

For example, (λx.t) is a definition of an anonymous function that can take a single input x and substitute it into the expression t.

And as defined, the value of x on the left affects the x in M. Like f(2) = 2^2 + 2.

They could be different variables, but now they're connected. In other words, abstraction binds the variable x in M.

And as the table says, M must also be a lambda term to be a valid expression.

### 3. Application

Simply put, application means plugging a value into a lambda function.

For example, plugging 2 into f(x) = x^2 + 2 is written as (λx.x^2+2) (2). In English:

> ts represents the application of a function t to an input s, that is, it represents the act of calling function t on input s to produce t(s).

So, in contrast to abstraction (defining a function), application means executing the function!

## Additional Notes

In lambda calculus, there are no variable declarations.

If you write λx.x+y, y is just considered undefined.

So, λx.x+y means: if you put in input x, you add y (which is still undefined) to x. This is still valid notation.

> This is interesting. In programming languages, if you have an undefined variable in the result, you get an error. In high school math, you only operate on already defined variables.
>
> But as mentioned in the motivation for the lambda calculus intro post, if you define it this way for intermediate results, it makes sense. Like x -> y -> x^2+y^2.
>
> If you look at y -> x^2 + y^2, x^2 is undefined, but intuitively, x -> y -> x^2 + y^2 makes sense. These details are interesting.

# Operation

Just as you define symbols and notation and make inference rules in a formal system, in lambda calculus, you define operations on lambda terms.

| Operation | Name           | Description |
|-----------|----------------|-------------|
| (λx.M[x]) → (λy.M[y]) | α-conversion | Renaming the bound variables in the expression. Used to avoid name collisions. |
| ((λx.M) E) → (M[x := E]) | β-reduction | Replacing the bound variables with the argument expression in the body of the abstraction. |

There are only two! They're not much different from our intuition. The expressions look complicated, but they're simple. Let's look at them step by step.

## 1. α-conversion

As shown in the Operation column, it just changes the variable name. The meaning is the same, but the symbol is replaced.

For example, f(x) = x^2 + 2 and f(t) = t^2 + 2 are the same in terms of function behavior. Lambda calculus is called anonymous functions because it focuses on function behavior.

The reason for defining this operation is to avoid name collisions.

For example, the x in λx.x^2+2 and the x in λx.x+2 are different, but you could get confused when operating on them. That's why this operation is defined.

Intuitively, we might say, "Oh, they're different x's, so I'll use a different variable name," but formally, we say:

> "To avoid name collisions, we substitute with a different variable, and this is called α-conversion!"

A bound variable is, as seen in abstraction lambda terms, a variable x that is bound in M.

## 2. β-reduction

There's a strange symbol, x := E. It's called beta reduction. But it's nothing special...

In f(x) = x^2 + 2, plugging in 2 gives f(2) = 2^2 + 2.

That's β-reduction.

x is bound in x^2 + 2, and you substitute 2 for x in x^2 + 2 (the abstraction body).

((λx.M) E) becomes (M[x := E]). That is, you substitute E for x in M.

For example, (λx.x^2+2) (2) are two lambda terms, and λx.x^2+2[x:=2] or 6 is a single lambda term, so the term "reduction" fits.

## Additional Concepts

There are four more things to know:

### Free variables

If you write λx.x^2+2, x is bound in x^2 + 2. But there can also be free variables! If you're quick, you'll realize this is related to undefined variables.

Free variables are defined inductively:

1. If the lambda term is just a variable x, then x itself is a free variable.
2. The set of free variables in λx.t is the set of free variables in t, excluding x.
3. The set of free variables in ts is the union of the free variables in t and s.

For example, in λx.x:

1. The x on the right is a free variable by rule 1.
2. For the lambda term λx.x, applying rule 2, the free variable in x is x, but we exclude the x bound by λ, so the set is empty.

How about λx.yx?

Intuitively, it's y! But let's be precise using the three rules above.

In short, the logical order is:

1 (for y) -> 1 (for x) -> 3 (for yx) -> 2 (for λx.yx)

So, the free variable is y.

### Capture-avoiding substitutions

Related to α-conversion. Capturing is similar to binding.

"To avoid different meanings being captured as the same, we substitute."

There are formulas related to freshness, but I'll explain them formally next time.

### Use of brackets (parentheses)

Used to remove ambiguity. Just like in math, parentheses determine the order of operations.

### Functions that operate on functions

In lambda calculus, functions are treated as first-class values. So, a function can be an input or an output.

From the perspective of lambda terms and operations:

1. Operations can be performed on anything that's a lambda term.
2. Lambda terms include abstractions (functions).
3. So, you can operate not just on values, but also on functions!

# Summary

After writing all this, it's not much different from the function operations we already know. It's just a more simplified and defined version of what we do in math.

If the definition of lambda calculus didn't make sense at first, let's look at it again. Now you'll say, "Ah, that's what it means!"

It's a formal system, a mathematical logic for expressing computation.

What kind of computation?

- function abstraction  
  The abstract form of a function
- function application using variable binding and substitution  
  Applying a function by binding and substituting variables

If those two don't make sense yet, function abstraction is the lambda itself, as we learned in the abstraction of lambda terms.

Function application is the third application in lambda terms and, in operations, means β-reduction. Nice~

Next time, we'll look at the formal definition and how things like arithmetic are simulated! 