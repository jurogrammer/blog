---
title: "Lambda Calculus - Formal Summary"
date: 2021-01-24
categories: ["Languages"]
tags: ["Languages", "FunctionalProgramming"]

---

# Reference

- https://en.wikipedia.org/wiki/Lambda_calculus#:~:text=Lambda%20calculus%20(also%20written%20as,to%20simulate%20any%20Turing%20machine

# Overview

In the previous post, I explained lambda calculus informally. This time, let's take a look at a more mathematical (formal) definition.

If you want to deeply understand lambda calculus, you need to get used to the formal definition. Most resources are written formally...

# Formal definition

### Components of a lambda expression

- variables v1, v2...
- the abstraction symbols λ (lambda) and . (dot)
- parentheses ()

### The set of lambda expressions (Λ) is defined inductively:

1. If x is a variable, then x ∈ Λ.
2. If x is a variable and M ∈ Λ, then (λx.M) ∈ Λ.
3. If M, N ∈ Λ, then (M N) ∈ Λ.

In summary: "If you apply lambda operations to lambda components, the result is still a lambda expression!"

Why define it this way? Think about function chaining (like currying). If an intermediate result was of a different type, currying wouldn't work. For example, if 1x2 yields 'tuna', then 'tuna'x5 doesn't make sense. That's why it's defined this way.

### Notation

To keep notation clean, the following conventions are used:

- Outermost parentheses are dropped: M N instead of (M N).
- Applications are left-associative: M N P means ((M N) P).
- The body of an abstraction extends as far right as possible: λx.M N means λx.(M N), not (λx.M) N.
- A sequence of abstractions is contracted: λx.λy.λz.N is abbreviated as λxyz.N

### Free and bound variables

1. The λ is called the abstraction operator; all variables in the body are said to be bound. An abstraction inside another abstraction is also bound.
2. In λx.M, λx is the binder, and x is bound in M. All other variables are free variables.
   - Example: λy.x x y — y is bound by λy, x is free.
   - By the third notation rule, the body of λy is x x y.
3. A variable is bound by the closest abstraction.
   - Example: λx.y (λx.z x) — the rightmost x is bound by the second abstraction.

The set of free variables in a lambda expression M is denoted FV(M) and defined recursively:

1. FV(x) = {x}, where x is a variable.
2. FV(λx.M) = FV(M) \ {x}
3. FV(M N) = FV(M) ∪ FV(N)

An expression with no free variables is called closed, also known as a combinator or combinatory logic.

> These terms may feel unfamiliar. For example, functions like f(x) = 4x are combinators. I'll dig deeper into this later.

Today, I formally conveyed what was previously explained informally. Next, I'll talk about operations (reductions) in lambda calculus. Once you know this, you can understand how mathematical operations are performed in lambda calculus!

See you in the next post! 