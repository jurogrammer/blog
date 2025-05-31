---
title: "Exception handling journey"
date: 2021-07-03T11:11:00+09:00
categories: ["General"]
tags: ["General", "Exception Handling"]
---

# First Step

An exception can be seen as an abnormal situation.

**Excerpt from Oracle docs**  
An exception is an event, which occurs during the execution of a program, that disrupts the normal flow of the program's instructions.

Therefore, **developers** should provide exception messages so that they can understand the situation when an exception occurs. Also, a **client** who calls the API should be given a different message from the developer.

So, to summarize the problems:

1. Where can developers see the logs?
2. How can we separate and deliver internal messages to users?
3. How can we show exception messages that are easy to understand?

This page shows the journey of exception handling. It's like an index page. Therefore, I will list the concerns I had and how I solved them, and attach links for more details.

## 1. How are logs left in the console or file?

You might wonder if this is something to worry about for point 1... Even if you print System.out.println in Java, depending on the AWS environment, sometimes it goes to the console, sometimes to a file, and sometimes an err.log file is created. So, even though I leave a log, where does it actually go? And depending on the purpose, you might need to store logs differently.

So, to simplify the problem, I tried to answer the most basic question:

**"How does the value I enter get printed to the console?"**

You can check the solution to this concern at the following URL:

[The process from keyboard input to console output](https://jurogrammer.tistory.com/155)

Through this, I learned about the concepts of redirection and pipeline, and dug deeper into redirection.

[Redirection](https://jurogrammer.tistory.com/156)

By exploring these two topics, it became clear. In AWS, standard output is redirected to .log, and standard error to err.log. Also, even if you leave a log at the error level in logback, it is output to standard output.

Additionally, if standard output can be abstracted, wouldn't it be possible for log libraries to send exceptions to Slack? It turns out, that's possible too. Since Unix abstracts data streams, you can write values to a socket.

Through concern 1, I was able to **think** about log output strategies.


## 2. About exception handling in Java

Next, let's look at how to handle exceptions in Java. Since I use Spring Boot in practice, I'll explain based on Java. The skills covered in this topic may be Java-specific, but I think the essence of the concerns and solutions is not different.

[Exception handling tools supported in Java](https://jurogrammer.tistory.com/157)

Next, based on the knowledge of exception handling, I will try to refactor code similar to what I wrote in practice.

## 3. Better code

[Let's refactor the code.](https://jurogrammer.tistory.com/158) 