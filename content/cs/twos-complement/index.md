---
title: "Two's Complement"
date: 2022-07-15T20:45:00+09:00
categories: ["CS"]
tags: ["CS"]
---

# Two's Complement

## Introduction

In this post, I want to talk about two's complement.

You might wonder, "Is it necessary to write about such a simple topic?" But even after reading many articles, there were parts I personally didn't fully understand.

Here are the questions I had:

> What is two's complement?
> What is one's complement?
> What is a complement?

Of course, the methods for finding one's and two's complement are widely known. For example:

# Finding Complements

Given the binary number `0110`:

### One's Complement

The one's complement of `0110` is obtained by flipping each bit.

That is, `1001`.

### Two's Complement

Add 1 to the one's complement.

That is, `1010`.

But what exactly is a complement, and why do we call the results above one's and two's complement? Let's resolve this question in this post.

# What is a Complement?

Let's first understand what a complement is. That will help us understand what one's and two's complement mean.

### Definition

A complement is a number that "completes" another number to a certain value.

In Korean, it's written as:
- 補數 (보수): to help (보), number (수)

In English:
- complement: to complete or supplement

### Example

- The 10's complement of 1 is 9.
  - How much do you need to add to 1 to get 10?
  - It's 9, because 1 + 9 = 10.
- The 15's complement of 4 is 11.
  - How much do you need to add to 4 to get 15?
  - It's 11, because 4 + 11 = 15.

# Revisiting One's Complement

Let's look at one's complement in binary again.

The one's complement of `0110` is, as above, `1001`.

So, according to the earlier examples, shouldn't `0110` + `1001` = 1?

**But if you add them, you get `1111`!**

This doesn't match the earlier definition. This was confusing, but it turns out there was a misunderstanding about the term "one's complement"…

## Ones' Complement (Plural)

How do you say "one's complement" in English?

**ones' complement**

In English, the possessive of the plural "ones" is used, not the singular "one".

From the [English Wikipedia on ones' complement](https://en.wikipedia.org/wiki/Ones%27_complement):

> "ones' complement" (note this is possessive of the plural "ones", not of a singular "one")

So, for a 4-bit number, the string of ones is `1111`.

Therefore, the ones' complement of `0110` is `1001`.

And `0110` + `1001` = `1111`.

That's why the method for finding the ones' complement is to flip all the bits of the number.

# Revisiting Two's Complement

So what about two's complement? Why does adding 1 to the ones' complement give the two's complement?

If you add 1 to the ones' complement of `0110` (`1001`), you get `1010`.

And `0110` + `1010` = `10000`.

If it's two's complement, shouldn't the result be 2? But for 4 bits, you get 16 (which is 2^4).

## Two's Complement as a Radix Complement

From the [English Wikipedia on two's complement](https://en.wikipedia.org/wiki/Two%27s_complement):

> Two's complement is an example of a radix complement. The 'two' in the name refers to the term which, expanded fully in an N-bit system, is actually "two to the power of N" - 2^N

So, two's complement is a type of radix complement, and the "two" refers to 2^N in an N-bit system.

Given `0110` is 4 bits, N = 4, so two's complement means the complement to 2^4.

Therefore, the complement to 2^4 is `1010`. `0110` + `1010` = `10000` = 16 (in decimal).

That's why adding 1 to the ones' complement gives the two's complement.

# Negative Numbers in Computers

Now, it's easier to understand why two's complement is used to represent negative numbers in computers. There are some constraints:

1. Computers must represent negative numbers using only bits (0 and 1).
2. Computers only perform addition.
3. Adding a positive number and its negative counterpart should result in 0 (e.g., 10 + (-10) = 0).

Let's use the earlier example, `0110`:

|   | 0 | 1 | 1 | 0 |
|---|---|---|---|---|
| + | x | x | x | x |
|   | 0 | 0 | 0 | 0 |

If you add the value represented by `xxxx`, you should get `0000`. But how can adding to `0110` result in zero?

The key is that computers can discard the carry bit.

If you treat `0000` as `10000`, you can determine what `xxxx` should be.

|   |   | 0 | 1 | 1 | 0 |
|---|---|---|---|---|---|
| + |   | x | x | x | x |
|   | 1 | 0 | 0 | 0 | 0 |

Here, the carry (1) is discarded.

Therefore, the two's complement of `0110` (which is `1010`) is used to represent the negative value.

So, adding these two gives `0000`—which is zero! 