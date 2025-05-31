---
title: "Formal System"
date: 2020-12-20
categories: ["Languages"]
tags: ["Languages", "FunctionalProgramming"]

---

# Overview

In this post, I will talk about the Formal System. Haha; I said I would talk about lambda calculus in detail, but as I studied, I realized I couldn't just gloss over this concept.

After going through lambda calculus, I thought, "What did I just learn?"

You define symbols, define rules, derive theorems... How is this related to lambda calculus? I was curious.

Haha; to conclude, lambda calculus is a Formal System, so learning about lambda calculus is learning about its Formal System.

So, in this post, let's find out what a Formal System is.

# Main Content

## Definition

### eng wiki

> A **formal system** is used for inferring theorems from axioms according to a set of rules

### ko wiki

> A formal system is a logical system that allows the derivation of theorems from axioms through inference rules. It also requires symbols for notation and grammar to construct sentences from them.

Read the definition a few times and reflect on it.

What I felt was: "Right~ It means systematically building up some knowledge." I got the idea.

Let's look at this feeling in more detail.

## Key Concepts

### 1. Axiom

An axiom is an assumption that is considered self-evidently true without proof.

For example, in the logical system of Euclidean geometry, it is assumed that a straight line can be drawn between any two points.

Logically, an axiom is the most fundamental proposition when giving reasons. If you keep asking "why?" about a proposition, the most basic reason supporting it is the axiom. It is knowledge that is judged to be self-evident and forms the foundation of the system.

### 2. Set of Rules (Inference Rules)

Rules for deriving one logical expression from another.

Also called a logical form made up of functions. It takes premises, analyzes the syntax, and draws a conclusion.

This is a bit difficult because it's connected to logic. But I recall something I read before... If you remember this, it might be easier to understand.

> A theory is not just a lump of knowledge, but knowledge systematically built up.

That's right... It's knowledge connected by rules. The structure is provided by the inference rules.

Another example is the syllogism: If P->Q and Q->R, then P->R.

This is also an inference rule.

### 3. Theorems

Theorems are propositions that are not self-evident, but are proven by axioms and inference rules.

You could think of them as new discoveries.

## Expression

So how do we "express" these things? It's the same as what you learn in math and computer languages.

You use symbols to represent objects of interest, and use grammar to construct sentences from these objects.

# Connection to Lambda Calculus

So, learning lambda calculus is learning about such a formal system! Then, what kind of formal system are we learning? Like chemistry, physics, or math, you systematically build up knowledge about objects of interest.

Let's read the definition again.

> Lambda calculus is a formal system in mathematical logic for expressing computation based on function abstraction and application using variable binding and substitution.

Lambda calculus is a formal system in mathematical logic for expressing computation using function abstraction and application, and it uses variable binding and substitution for computation.

I don't know exactly what function abstraction, function application, variable binding, or variable substitution are yet, so let's just say they're about certain operations in functions for now.

So, in summary, it's a formal system for certain operations in functions.

So, you learn about the symbols for those operations, the rules, and theorems. And each language like JavaScript, Go, Pascal, etc., implements these systems in its own way.

I hope this post makes what we're going to learn clearer. 