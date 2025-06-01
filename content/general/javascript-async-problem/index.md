---
title: "[JavaScript] Asynchronous Processing Problem"
date: 2020-05-23T18:18:37+09:00
categories: ["General"]
tags: ["JavaScript", "Async"]
---

# [JavaScript] Asynchronous Processing Problem

Recently, even after completing the edwith Boostcourse, I couldn't understand why callback hell occurs. I finally understood it while working on a Naver page.

## Problematic Process

![img1](img1.jpg)

1. Click the Tab UI.
2. Display the total list count
   - 2-1) Request the total list count via Ajax API. (If cached, go directly to 2-3)
   - 2-2) Cache the received API data.
   - 2-3) Display the total list count using the cached data.
3. Show the items under the UI tab
   - 3-1) Request product information (items) via Ajax API. (If cached, go directly to 3-3)
   - 3-2) Cache the received API data.
   - 3-3) Display the product information using the cached data.

This was the process, and I implemented it as follows:

```javascript
sendAjaxTotalCount();
renderTotalCount();

sendAjaxProducts();
renderProducts();
```

## What was the result?

It only displayed correctly after clicking twice.

## What was the problem?

The problem was asynchronous processing. JavaScript, when executing, delegates asynchronous functions to the event handler, which then moves them to the event queue. So the actual order was as follows:

1. sendAjax is handed over to the event handler. Once processed, it enters the event queue.
2. render() is executed.
3. The contents of the event queue are executed.

Because of this, when render() was called, there was no cached data (the function was waiting in the event queue). When clicked again, the event queue had been processed, so the cached data was available, and the desired result appeared.

## Solution?

This is where callback hell comes in. Since render() must be called after the Ajax request, you need to put render() inside the event handler.

```javascript
var oReq = new XMLHttpRequest();

oReq.addEventListener("load", () => {
    var data =  JSON.parse(oReq.responseText);
    render(data);
})

oReq.open(method, url);
oReq.send();
```

However, if you write code like this and have a lot of asynchronous processing, the depth increases and readability drops significantly.

1 works -> 2 works -> 3 works ...

(Here, the i-th operation only works correctly if the (i-1)-th operation is completed.)

Just looking at it is dreadful. That's why JavaScript provides `then` in promises.
A promise is literally a promise. It promises to process the function passed as an argument, and then (then) will process the next step.

For more details, see:

https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise

## Thoughts

Through this experience, I was able to better understand asynchronous functions.

Thanks to this, if I build an application, I can think about which parts to process first to provide a smooth user experience.

If I develop for Android, of course, it will provide asynchronous processing features...

These are the kinds of things I was able to consider. 