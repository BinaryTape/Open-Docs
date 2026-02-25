[//]: # (title: Kotlin 用于服务器端)

Kotlin 非常适合开发服务器端应用程序。它允许您编写简洁且具有表现力的代码，同时保持与现有基于 Java 的技术栈的完全兼容性，且学习曲线平缓：

* **表现力**：Kotlin 创新的语言功能，例如对[类型安全构建器](type-safe-builders.md)和[委托属性](delegated-properties.md)的支持，有助于构建强大且易于使用的抽象。
* **可扩展性**：Kotlin 对[协程](coroutines-overview.md)的支持有助于构建服务器端应用程序，使其能够以较低的硬件要求扩展到海量客户端。
* **互操作性**：Kotlin 与所有基于 Java 的框架完全兼容，因此您可以在沿用熟悉的技术栈的同时，获得现代语言带来的优势。
* **迁移**：Kotlin 支持将大型代码库从 Java 逐步迁移到 Kotlin。您可以开始用 Kotlin 编写新代码，同时保留系统中较旧的 Java 部分。
* **工具**：除了通用的出色 IDE 支持外，Kotlin 还在 IntelliJ IDEA Ultimate 插件中提供了针对特定框架（例如 Spring 和 Ktor）的工具支持。
* **学习曲线**：对于 Java 开发者来说，上手 Kotlin 非常容易。Kotlin 插件中包含的自动 Java 到 Kotlin 转换器可以助您迈出第一步。[Kotlin Koans](koans.md) 通过一系列交互式练习引导您掌握关键的语言功能。像 [Ktor](https://ktor.io/) 这样专门针对 Kotlin 的框架提供了一种简单直接的方法，避免了大型框架中隐藏的复杂性。

## 使用 Kotlin 进行服务器端开发的框架

以下是 Kotlin 的一些服务器端框架示例：

* [Spring](https://spring.io) 从 5.0 版本开始利用 Kotlin 的语言功能提供[更简洁的 API](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0)。[在线项目生成器](https://start.spring.io/#!language=kotlin)允许您快速生成一个新的 Kotlin 项目。

* [Ktor](https://github.com/kotlin/ktor) 是由 JetBrains 构建的框架，用于在 Kotlin 中创建 Web 应用程序。它利用协程实现高可扩展性，并提供易于使用且惯用的 API。

* [Quarkus](https://quarkus.io/guides/kotlin) 为使用 Kotlin 提供了一等支持。该框架是开源的，由 Red Hat 维护。Quarkus 从底层开始就为 Kubernetes 构建，通过利用数百个不断增长的最佳库，提供了一个具有凝聚力的全栈框架。

* [Vert.x](https://vertx.io) 是一个在 JVM 上构建响应式 Web 应用程序的框架，它为 Kotlin 提供了[专门支持](https://github.com/vert-x3/vertx-lang-kotlin)，包括[完整文档](https://vertx.io/docs/vertx-core/kotlin/)。

* [kotlinx.html](https://github.com/kotlin/kotlinx.html) 是一个可用于在 Web 应用程序中构建 HTML 的 DSL。它可以作为 JSP 和 FreeMarker 等传统模板系统的替代方案。

* [Micronaut](https://micronaut.io/) 是一个现代化的基于 JVM 的全栈框架，用于构建模块化、易于测试的微服务和无服务器应用程序。它自带许多实用的内置功能。

* [http4k](https://http4k.org/) 是一个用纯 Kotlin 编写的、占用空间极小的函数式工具包，用于 Kotlin HTTP 应用程序。该库基于 Twitter 的 "Your Server as a Function" 论文，将 HTTP 服务器和客户端建模为可以组合在一起的简单 Kotlin 函数。

* [Javalin](https://javalin.io) 是一个非常轻量级的 Kotlin 和 Java Web 框架，支持 WebSockets、HTTP2 和异步请求。

* 可用的持久化选项包括直接 JDBC 访问、JPA 以及通过 Java 驱动程序使用 NoSQL 数据库。对于 JPA，[kotlin-jpa 编译器插件](no-arg-plugin.md#jpa-support)使 Kotlin 编译的类能够适配该框架的要求。

> 您可以在 [https://kotlin.link/](https://kotlin.link/resources) 找到更多框架。
>
{style="note"}

## 部署 Kotlin 服务器端应用程序

Kotlin 应用程序可以部署到任何支持 Java Web 应用程序的主机，包括 Amazon Web Services、Google Cloud Platform 等。

要在 [Heroku](https://www.heroku.com) 上部署 Kotlin 应用程序，您可以按照 [Heroku 官方教程](https://devcenter.heroku.com/articles/getting-started-with-kotlin)操作。

AWS Labs 提供了一个[示例项目](https://github.com/awslabs/serverless-photo-recognition)，展示了如何使用 Kotlin 编写 [AWS Lambda](https://aws.amazon.com/lambda/) 函数。

Google Cloud Platform 提供了一系列关于将 Kotlin 应用程序部署到 GCP 的教程，包括 [Ktor 和 App Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8) 以及 [Spring 和 App Engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8)。此外，还有一个关于部署 Kotlin Spring 应用程序的[交互式代码实验室](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin)。

## 在服务器端使用 Kotlin 的产品

[Corda](https://www.corda.net/) 是一个开源的分布式账本平台，受到各大银行的支持，完全使用 Kotlin 构建。

[JetBrains Account](https://account.jetbrains.com/) 是负责 JetBrains 整个许可证销售和验证过程的系统，它 100% 由 Kotlin 编写，自 2015 年以来一直在生产环境中运行，未出现重大问题。

[Chess.com](https://www.chess.com/) 是一个致力于国际象棋以及全球数百万棋迷的网站。Chess.com 使用 Ktor 来实现多个 HTTP 客户端的无缝配置。

[Adobe](https://medium.com/adobetech/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a) 的工程师在 Adobe Experience Platform 中使用 Kotlin 进行服务器端应用开发，并使用 Ktor 进行原型设计。该平台使企业能够在应用数据科学和机器学习之前，集中并标准化客户数据。

## 下一步

* 欲更深入地了解该语言，请查看本站的 Kotlin 文档和 [Kotlin Koans](koans.md)。
* 探索如何使用 [Ktor 构建异步服务器应用程序](https://ktor.io/docs/server-create-a-new-project.html)，这是一个使用 Kotlin 协程的框架。
* 观看在线讲座[“使用 Kotlin 为微服务构建 Micronaut”](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/)，并查看详细[指南](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)，了解如何在 Micronaut 框架中使用 [Kotlin 扩展函数](extensions.md#extension-functions)。
* http4k 提供了 [CLI](https://toolbox.http4k.org) 用于生成完整的项目，以及一个[入门](https://start.http4k.org)仓库，只需一条 bash 命令即可使用 GitHub、Travis 和 Heroku 生成整个 CD 流水线。
* 想要从 Java 迁移到 Kotlin？了解如何[在 Java 和 Kotlin 中执行字符串相关的典型任务](java-to-kotlin-idioms-strings.md)。