---
title: Kotlin服务端开发
---
Kotlin 非常适合用于开发服务端应用程序。它允许您编写简洁而富有表现力的代码，同时与现有的基于 Java 的技术栈保持完全兼容，并且学习曲线平滑：

* **表现力 (Expressiveness)**：Kotlin 的创新语言特性，例如对[类型安全的构建器](type-safe-builders) (type-safe builders) 和[委托属性](delegated-properties) (delegated properties) 的支持，有助于构建强大且易于使用的抽象。
* **可伸缩性 (Scalability)**：Kotlin 对[协程](coroutines-overview) (coroutines) 的支持有助于构建服务端应用程序，这些应用程序可以扩展到大量客户端，而硬件要求不高。
* **互操作性 (Interoperability)**：Kotlin 与所有基于 Java 的框架完全兼容，因此您可以在享受更现代语言优势的同时，使用您熟悉的技术栈。
* **迁移 (Migration)**：Kotlin 支持将大型代码库从 Java 逐步迁移到 Kotlin。您可以开始用 Kotlin 编写新代码，同时将系统的旧部分保留在 Java 中。
* **工具 (Tooling)**：除了通常在 IDE 中提供的强大支持外，Kotlin 还在 IntelliJ IDEA Ultimate 的插件中提供了特定于框架的工具（例如，针对 Spring 和 Ktor）。
* **学习曲线 (Learning Curve)**：对于 Java 开发人员来说，开始使用 Kotlin 非常容易。Kotlin 插件中包含的自动 Java 到 Kotlin 转换器可帮助您完成第一步。[Kotlin Koans](koans) 通过一系列交互式练习指导您学习关键语言特性。像 [Ktor](https://ktor.io/) 这样的 Kotlin 特定框架提供了一种简单、直接的方法，而没有大型框架的隐藏复杂性。

## 用于 Kotlin 服务端开发的框架

以下是一些 Kotlin 服务端框架的示例：

* [Spring](https://spring.io) 利用 Kotlin 的语言特性，从 5.0 版本开始提供[更简洁的 API](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0)。[在线项目生成器](https://start.spring.io/#!language=kotlin)允许您快速生成 Kotlin 中的新项目。

* [Ktor](https://github.com/kotlin/ktor) 是 JetBrains 构建的框架，用于使用 Kotlin 创建 Web 应用程序，利用协程实现高可伸缩性，并提供易于使用且符合语言习惯的 API。

* [Quarkus](https://quarkus.io/guides/kotlin) 提供对使用 Kotlin 的一流支持。该框架是开源的，由 Red Hat 维护。Quarkus 从 Kubernetes 的基础上构建，并通过利用不断增长的数百个最佳库的列表，提供了一个有凝聚力的全栈框架。

* [Vert.x](https://vertx.io)，一个用于在 JVM 上构建响应式 Web 应用程序的框架，为 Kotlin 提供[专用支持](https://github.com/vert-x3/vertx-lang-kotlin)，包括[完整文档](https://vertx.io/docs/vertx-core/kotlin/)。

* [kotlinx.html](https://github.com/kotlin/kotlinx.html) 是一个 DSL，可用于在 Web 应用程序中构建 HTML。它可以替代传统的模板系统，如 JSP 和 FreeMarker。

* [Micronaut](https://micronaut.io/) 是一个现代的基于 JVM 的全栈框架，用于构建模块化、易于测试的微服务和无服务器应用程序。它带有许多有用的内置功能。

* [http4k](https://http4k.org/) 是一个功能工具包，具有用于 Kotlin HTTP 应用程序的微小占用空间，用纯 Kotlin 编写。该库基于 Twitter 的“Your Server as a Function”论文，表示将 HTTP 服务器和客户端建模为可以组合在一起的简单 Kotlin 函数。

* [Javalin](https://javalin.io) 是一个非常轻量级的 Kotlin 和 Java Web 框架，它支持 WebSockets、HTTP2 和异步请求。

* 用于持久化的可用选项包括直接 JDBC 访问、JPA，以及通过其 Java 驱动程序使用 NoSQL 数据库。对于 JPA，[kotlin-jpa 编译器插件](no-arg-plugin#jpa-support) (kotlin-jpa compiler plugin) 使 Kotlin 编译的类适应框架的要求。

:::note
您可以在 [https://kotlin.link/](https://kotlin.link/resources) 找到更多框架。

:::

## 部署 Kotlin 服务端应用程序

Kotlin 应用程序可以部署到任何支持 Java Web 应用程序的主机中，包括 Amazon Web Services、Google Cloud Platform 等。

要在 [Heroku](https://www.heroku.com) 上部署 Kotlin 应用程序，您可以按照 [官方 Heroku 教程](https://devcenter.heroku.com/articles/getting-started-with-kotlin) 进行操作。

AWS Labs 提供了一个 [示例项目](https://github.com/awslabs/serverless-photo-recognition)，展示了使用 Kotlin 编写 [AWS Lambda](https://aws.amazon.com/lambda/) 函数。

Google Cloud Platform 提供了一系列教程，用于将 Kotlin 应用程序部署到 GCP，包括针对 [Ktor 和 App Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8) 以及 [Spring 和 App engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8)。此外，还有一个 [交互式代码实验室](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin)，用于部署 Kotlin Spring 应用程序。

## 在服务端使用 Kotlin 的产品

[Corda](https://www.corda.net/) 是一个开源的分布式账本平台，受到主要银行的支持，并且完全用 Kotlin 构建。

[JetBrains Account](https://account.jetbrains.com/) 是负责 JetBrains 整个许可证销售和验证过程的系统，它用 100% Kotlin 编写，自 2015 年以来一直在生产环境中运行，没有出现重大问题。

[Chess.com](https://www.chess.com/) 是一个致力于国际象棋的网站，以及全球数百万热爱这款游戏的玩家。Chess.com 使用 Ktor 来无缝配置多个 HTTP 客户端。

[Adobe](https://blog.developer.adobe.com/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a) 的工程师使用 Kotlin 进行服务端应用程序开发，并使用 Ktor 在 Adobe Experience Platform 中进行原型设计，这使组织能够在应用数据科学和机器学习之前集中和标准化客户数据。

## 下一步

* 有关该语言的更深入介绍，请查看本网站上的 Kotlin 文档和 [Kotlin Koans](koans)。
* 探索如何使用 Kotlin 协程的框架 [Ktor 构建异步服务器应用程序](https://ktor.io/docs/server-create-a-new-project.html)。
* 观看网络研讨会 ["Micronaut for microservices with Kotlin"](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/) 并探索详细的 [指南](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)，展示如何在 Micronaut 框架中使用 [Kotlin 扩展函数](extensions#extension-functions)。
* http4k 提供了 [CLI](https://toolbox.http4k.org) 来生成完全形成的项目，并提供了一个 [starter](https://start.http4k.org) 存储库，可以使用单个 bash 命令生成使用 GitHub、Travis 和 Heroku 的整个 CD 管道。
* 想要从 Java 迁移到 Kotlin 吗？ 了解如何在 [Java 和 Kotlin 中执行字符串的典型任务](java-to-kotlin-idioms-strings)。