---
title: "[Web] About Layered Architecture"
date: 2020-05-29T17:07:38+09:00
categories: ["General"]
tags: ["Layered Architecture", "Web", "Spring"]
---

# Layered Architecture

## References

1. [https://en.wikipedia.org/wiki/Multitier_architecture](https://en.wikipedia.org/wiki/Multitier_architecture)
2. [https://sites.google.com/site/telosystutorial/springmvc-jpa-springdatajpa/presentation/architecture](https://sites.google.com/site/telosystutorial/springmvc-jpa-springdatajpa/presentation/architecture)
3. [https://www.petrikainulainen.net/software-development/design/understanding-spring-web-application-architecture-the-classic-way/](https://www.petrikainulainen.net/software-development/design/understanding-spring-web-application-architecture-the-classic-way/) (Main reference)

Most of the content is based on reference 3. However, since I am sharing my own thoughts, if you feel something is missing, please check the third reference. The comments on that page are also very insightful.

## Concerns When Writing an API

What should be written in the controller, service, and dao?

- I know that the controller in the presentation layer receives and sends data.
- I know that the service in the service layer performs business logic.
- I know that the dao in the repository layer accesses the database.

But then, what exactly should I write in each?

- Should the controller receive and send multiple DTOs? The service could do that too. The service could create DTOs and send them to the controller. Or, the dao could create DTOs and send them up. If DTOs are just for data transfer, what's the difference? All three seem valid!

At some point, I wondered if I was just getting used to these conventions. Reading the references, I had to answer some fundamental questions:

**Why do we create layers in the first place? What is the criterion for creating them?**

## Layer

To answer directly: a Layer is a **collection of concerns**. The reason we call it a layer instead of a set is to express the hierarchical relationship between sets. That is, higher layers can control lower layers, but not vice versa.

The reason for grouping concerns into layers is to avoid making the structure too complex by splitting concerns too finely. By grouping related concerns, we keep the structure manageable.

- Creating new code means transferring data through each layer, which is costly.
- If others can't understand the structure, that's also costly.

There are two key principles for creating layers:

1. Clearly identify concerns when building software and assign them to layers. This clarifies the responsibilities of each layer.
2. Separate concerns, but don't create too many layers.

## So, in Web Applications?

From a Spring MVC perspective, concerns in web development can be divided as follows (see references):

- Respond to user requests appropriately
- Handle exceptions in user requests
- Handle transactions
- Handle authentication and authorization (to be added later)
- Implement business logic
- Communicate with external resources and internal data stores (to be added later)

After trial and error, these concerns are now divided into three layers: Presentation Layer, Service Layer, and Repository Layer.

## Responsibilities and Implementation by Layer

### 1. Presentation Layer
**Responsibilities:**
- Respond to user requests
- Handle exceptions in user requests

**Implementation:**
- Expose views (html, jsp, etc.) to users.
- Users make specific requests. The dispatcher servlet acts as a controller to receive requests and handle exceptions if needed.
- The dispatcher servlet is just a manager. Developers write controllers to handle specific requests.
- The dispatcher servlet passes requests to the appropriate controller.
- The controller requests data from lower layers and passes the output to the view.
- The controller is only responsible for passing data (the model), not accessing it directly. It requests data access from lower layers.

### 2. Service Layer
**Responsibilities:**
- Implement business logic
- Handle transactions

**Implementation:**
- Write code in the service object to perform business logic. The service does not directly access the DBMS; it only contains business logic and delegates data manipulation to lower layers.
- Sometimes, a business operation requires manipulating data as a single unit (e.g., a transfer service). The service manages transactions for this purpose. In Spring, this is done with @transaction.

#### What is Business Logic?

When I first heard the term, it didn't make sense. Some said business logic is the logic that frequently accesses the DBMS (busy logic). But as I worked on projects, I realized that business logic is simply the logic for handling business operations.

A web page is an interface between a company and its customers. For example, on a shopping page:

1. The customer visits the shopping page.
2. The customer clicks to purchase a product, making a request to the company.
3. The company processes the purchase request (business logic).
4. After processing, the presentation layer provides feedback to the customer.

In other words, the web page is a view for the company to do business, and the user makes requests. This is the essence of business logic.

### 3. Repository Layer
**Responsibilities:**
- Access internal data stores

**Implementation:**
- Use DAOs (Data Access Objects) to access data stores.

By dividing concerns into layers, we gain reusability. For example, if the client changes from a web page to a Windows application, the business logic and DBMS access don't change—only the presentation layer does.

To make the service layer easily separable, we separate the configuration for the presentation layer from the service and repository layers. Service interfaces are used to reduce dependencies between controllers.

- However, this is debated. If the service class is already complete, changing the controller doesn't really benefit from the interface. Also, if the service interface and implementation are 1:1, there's no benefit from polymorphism.

Data transfer between layers is done using DTOs.

## In Conclusion...

If you've read this far, you should have a clearer idea of what logic to implement in each layer. The key is to understand the responsibilities of each layer. Reading the references was eye-opening and clarifying.

One remaining question is about where to put open API calls. I think they should go in the service, not the controller, for reusability and because the controller should only handle business logic. But some articles put them in the controller, which is confusing. I'll decide after more experience.

If you find any mistakes, please let me know. 