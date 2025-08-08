---
title: "WebFlux Flow Chart"
date: 2025-08-07T00:00:00+09:00
draft: false
categories: ["LibraryFramework"]
tags: ["SpringBoot", "WebFlux", "Reactor", "Netty"]
---

<style>
.image-popup {
    cursor: pointer;
    transition: opacity 0.3s;
}

.image-popup:hover {
    opacity: 0.8;
}

.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.9);
    backdrop-filter: blur(5px);
}

.modal-content {
    margin: auto;
    display: block;
    max-width: 95%;
    max-height: 95%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.close {
    position: absolute;
    top: 15px;
    right: 35px;
    color: #f1f1f1;
    font-size: 40px;
    font-weight: bold;
    cursor: pointer;
    z-index: 1001;
}

.close:hover,
.close:focus {
    color: #bbb;
    text-decoration: none;
}
</style>

<div id="imageModal" class="modal">
    <span class="close">&times;</span>
    <img class="modal-content" id="modalImage">
</div>

<script>
// Get the modal
var modal = document.getElementById("imageModal");
var modalImg = document.getElementById("modalImage");
var closeBtn = document.getElementsByClassName("close")[0];

// Add click event to all images with class 'image-popup'
document.addEventListener('DOMContentLoaded', function() {
    var images = document.querySelectorAll('.image-popup');
    images.forEach(function(img) {
        img.onclick = function() {
            modal.style.display = "block";
            modalImg.src = this.src;
        }
    });
});

// Close modal when clicking the X
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Close modal when clicking outside the image
modal.onclick = function(e) {
    if (e.target === modal) {
        modal.style.display = "none";
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === "Escape" && modal.style.display === "block") {
        modal.style.display = "none";
    }
});
</script>

This post explains the flow of WebFlux request processing through detailed sequence diagrams.

## 1. Request (Before Receive Request Body)

<img src="request-before-body.png" alt="Request Before Body" class="image-popup" style="width: 100%; max-width: 1200px; height: auto; border: 1px solid #ddd; border-radius: 4px;">

## 2. Request (After Receive Request Body)

<img src="request-after-body.png" alt="Request After Body" class="image-popup" style="width: 100%; max-width: 1200px; height: auto; border: 1px solid #ddd; border-radius: 4px;">

## 3. Process Request Body

<img src="process-request-body.png" alt="Process Request Body" class="image-popup" style="width: 100%; max-width: 1200px; height: auto; border: 1px solid #ddd; border-radius: 4px;">

## 4. Process Response Body

<img src="process-response-body.png" alt="Process Response Body" class="image-popup" style="width: 100%; max-width: 1200px; height: auto; border: 1px solid #ddd; border-radius: 4px;">

## Summary

The WebFlux flow can be divided into four main phases:

1. **Request Reception**: Netty handles the initial HTTP request and passes it to ReactorNetty
2. **Request Processing**: The request flows through WebFlux's handler chain
3. **Request Body Processing**: The request body is read and deserialized
4. **Response Processing**: The response is serialized and sent back to the client

Each phase involves multiple components working together to provide reactive, non-blocking HTTP processing capabilities.
