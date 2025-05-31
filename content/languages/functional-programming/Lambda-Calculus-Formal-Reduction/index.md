---
title: "Lambda Calculus - Formal Summary (Reduction)"
date: 2021-02-07
categories: ["Languages"]
tags: ["Languages", "FunctionalProgramming"]

---

# Source

- https://en.wikipedia.org/wiki/Lambda_calculus

# Reduction

The dictionary definition of reduction is as follows:

> the action or fact of making a specified thing smaller or less in amount, degree, or size.

In other words, it is the act or fact of reducing the amount, dimension, or size of something.

# Meaning

Wikipedia introduces reduction as follows:

> The meaning of lambda expression is defined by how expressions can be reduced

So, the meaning of lambda calculus depends on how expressions are reduced. The referenced title is:

> "A Proof-Theoretic Account of Programming and the Role of Reduction Rules".

It seems that with reduction rules, you can determine if abstractions are equivalent, just like in math where 1 + 1 + 1 = 1 x 3 = 3.

In lambda calculus, reduction means the operation that reduces a lambda expression.

# Types of Reduction

There are three types of reduction: α-conversion, β-reduction, and η-reduction. Let's go through them one by one.

### 1. α-conversion

#### Definition

Also called α-renaming, it refers to the operation of changing the name of a bound variable.

#### Example

λx.x, if you replace the bound variable x with y, it becomes λy.y.

#### Notes

##### 1) Terminology confusion

α-equivalent is a completely different concept. It is used when talking about equivalence.

##### 2) Rule application (bound variable)

Only the name of a variable bound by abstraction can be redefined.

Recall the explanation of free and bound variables:

> a variable is bound by its nearest abstraction.

Example: λx.y (λx.z x)

In this example, the rightmost x is bound by the second lambda.

So, λx.λx.x ⇒ λy.λx.x is correct, but λx.λx.x ⇒ λy.λx.y is incorrect. This is called variable shadowing.

> The variable names were confusing in the first place;

#### Substitution

This process of changing variable names is called substitution.

##### Definition

> written M[V := N], is the process of replacing all free occurrences of the variable V in the expression M with expression N.

##### Inductive definition

Let x, y be variables, and M, N be arbitrary lambda expressions.

1. x[x := N] = N
2. y[x := N] = y, if x ≠ y
3. (M1 M2)[x := N] = (M1[x := N]) (M2[x := N])
4. (λx.M)[x := N] = λx.M
5. (λy.M)[x := N] = λy.(M[x := N]), if x ≠ y and y ∉ FV(N)

### 2. β-reduction

As explained before, this is function application. For example, if f(x) = x*2, then f(2) = 2^2.

β-reduction is defined under the term substitution.

#### Definition

The β-reduction of (λV.M) N is M[V := N].

If you put N into V, all V in M are replaced with N. Simple!

Here, λV disappears by β-reduction, so it becomes M[V := N]. That's why it's called reduction.

> In English, they say "apply λV.M to N". It makes sense—function f transforms 2 into 2^2, so the term "apply" fits well.

### 3. η-reduction

This wasn't covered in the informal explanation.

#### Concept

This concept is based on extensionality.

Extensionality or extensional equality is a term from logic. If two things have the same external properties, they are considered equal.

For example, you may not know the essence of objects A and B, but if they look the same, are red, round, and make a clear sound when shaken, you can say A and B are extensionally equal.

#### Relation to reduction

Let's see how lambda operations are reduced.

Compare λx.f x and f.

If x does not appear as a free variable in f, then f can be represented as just f.

For example, if f(x) = 4, no matter what you put in for x, the result is always 4. That's the idea.

So, λx.f x can be reduced to f by η-reduction. The abstraction is reduced to a variable.

# Conclusion

In this chapter, we defined operations more formally, categorized types of reduction, and expressed substitution mathematically.

Now we've covered all the basics!

Next, I'll briefly explain how to represent natural numbers and perform arithmetic in lambda calculus.

Some of the content may not be directly related to programming, but since computers represent numbers like 1, 2, 3, 4, it's worth knowing.

We'll look at commonly used operations. I plan to refer more to this video than Wikipedia: https://www.youtube.com/watch?v=3VQ382QG-y4 