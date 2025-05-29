[//]: # (title: Kotlin 用于服务端)

Kotlin 非常适合开发服务端应用程序。它允许你编写简洁且富有表现力的代码，同时与现有的基于 Java 的技术栈保持完全兼容，而且学习曲线平滑：

*   **表达力**：Kotlin 创新的语言特性，例如其对[类型安全构建器](type-safe-builders.md)和[委托属性](delegated-properties.md)的支持，有助于构建强大且易于使用的抽象。
*   **可伸缩性**：Kotlin 对[协程](coroutines-overview.md)的支持有助于构建服务端应用程序，使其能够以适度的硬件要求扩展到大量客户端。
*   **互操作性**：Kotlin 与所有基于 Java 的框架完全兼容，因此你可以在使用熟悉的技术栈的同时，获得更现代语言带来的好处。
*   **迁移**：Kotlin 支持将大型代码库从 Java 逐步迁移到 Kotlin。你可以开始用 Kotlin 编写新代码，同时保留系统中较旧的部分在 Java 中。
*   **工具支持**：除了出色的 IDE 支持外，Kotlin 在 IntelliJ IDEA Ultimate 插件中提供了针对特定框架的工具（例如，针对 Spring 和 Ktor）。
*   **学习曲线**：对于 Java 开发者来说，开始使用 Kotlin 非常容易。Kotlin 插件中包含的自动 Java 到 Kotlin 转换器有助于你的入门。[Kotlin Koans](koans.md) 通过一系列交互式练习指导你学习关键语言特性。[Ktor](https://ktor.io/) 等 Kotlin 特定的框架提供了一种简单、直接的方法，没有大型框架的隐藏复杂性。

## 用于 Kotlin 服务端开发的框架

以下是 Kotlin 服务端框架的一些示例：

*   [Spring](https://spring.io) 利用 Kotlin 的语言特性，从 5.0 版本开始提供[更简洁的 API](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0)。[在线项目生成器](https://start.spring.io/#!language=kotlin)允许你快速生成一个 Kotlin 新项目。

*   [Ktor](https://github.com/kotlin/ktor) 是 JetBrains 构建的一个用于在 Kotlin 中创建 Web 应用程序的框架，它利用协程实现高可伸缩性，并提供易于使用且符合习惯用法的 API。

*   [Quarkus](https://quarkus.io/guides/kotlin) 为使用 Kotlin 提供一流支持。该框架是开源的，由 Red Hat 维护。Quarkus 专为 Kubernetes 从零开始构建，通过利用不断增长的数百个同类最佳库，提供了一个有凝聚力的全栈框架。

*   [Vert.x](https://vertx.io) 是一个用于在 JVM 上构建响应式 Web 应用程序的框架，它为 Kotlin 提供[专门支持](https://github.com/vert-x3/vertx-lang-kotlin)，包括[完整文档](https://vertx.io/docs/vertx-core/kotlin/)。

*   [kotlinx.html](https://github.com/kotlin/kotlinx.html) 是一个可用于在 Web 应用程序中构建 HTML 的 DSL。它作为 JSP 和 FreeMarker 等传统模板系统的替代方案。

*   [Micronaut](https://micronaut.io/) 是一个现代的、基于 JVM 的全栈框架，用于构建模块化、易于测试的微服务和无服务器应用程序。它带有很多有用的内置功能。

*   [http4k](https://http4k.org/) 是一个功能性工具包，适用于 Kotlin HTTP 应用程序，体积小巧，纯 Kotlin 编写。该库基于 Twitter 的“您的服务器即函数”论文，将 HTTP 服务器和客户端建模为可以组合的简单 Kotlin 函数。

*   [Javalin](https://javalin.io) 是一个非常轻量级的 Kotlin 和 Java Web 框架，支持 WebSockets、HTTP2 和异步请求。

*   可用的持久化选项包括直接 JDBC 访问、JPA 以及通过其 Java 驱动程序使用 NoSQL 数据库。对于 JPA，[kotlin-jpa 编译器插件](no-arg-plugin.md#jpa-support)使 Kotlin 编译的类适应框架的要求。

> 你可以在 [https://kotlin.link/](https://kotlin.link/resources) 找到更多框架。
>
{style="note"}

## 部署 Kotlin 服务端应用程序

Kotlin 应用程序可以部署到任何支持 Java Web 应用程序的主机，包括 Amazon Web Services、Google Cloud Platform 等。

要在 [Heroku](https://www.heroku.com) 上部署 Kotlin 应用程序，你可以遵循[官方 Heroku 教程](https://devcenter.heroku.com/articles/getting-started-with-kotlin)。

AWS Labs 提供了一个[示例项目](https://github.com/awslabs/serverless-photo-recognition)，展示了如何使用 Kotlin 编写 [AWS Lambda](https://aws.amazon.com/lambda/) 函数。

Google Cloud Platform 提供了一系列教程，用于将 Kotlin 应用程序部署到 GCP，包括[Ktor 和 App Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8) 以及 [Spring 和 App Engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8)。此外，还有一个[交互式代码实验室](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin)用于部署 Kotlin Spring 应用程序。

## 在服务端使用 Kotlin 的产品

[Corda](https://www.corda.net/) 是一个由主要银行支持并完全用 Kotlin 构建的开源分布式账本平台。

[JetBrains Account](https://account.jetbrains.com/) 是 JetBrains 负责整个许可销售和验证流程的系统，它完全用 Kotlin 编写，自 2015 年以来一直在生产环境中运行，没有出现重大问题。

[Chess.com](https://www.chess.com/) 是一个致力于国际象棋的网站，服务于全球数百万热爱这项游戏的玩家。Chess.com 使用 Ktor 实现多个 HTTP 客户端的无缝配置。

[Adobe](https://blog.developer.adobe.com/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a) 的工程师使用 Kotlin 进行服务端应用程序开发，并在 Adobe Experience Platform 中使用 Ktor 进行原型设计，该平台使组织能够在应用数据科学和机器学习之前集中和标准化客户数据。

## 下一步

*   如需更深入地了解该语言，请查看本站点的 Kotlin 文档和 [Kotlin Koans](koans.md)。
*   探索如何使用 [Ktor](https://ktor.io/docs/server-create-a-new-project.html) 构建异步服务端应用程序，Ktor 是一个使用 Kotlin 协程的框架。
*   观看网络研讨会[“使用 Kotlin 的微服务 Micronaut”](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/)，并查阅详细[指南](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)，了解如何在 Micronaut 框架中使用[Kotlin 扩展函数](extensions.md#extension-functions)。
*   http4k 提供了[CLI](https://toolbox.http4k.org) 来生成完整的项目，以及一个[入门](https://start.http4k.org)仓库，可以通过一个简单的 bash 命令使用 GitHub、Travis 和 Heroku 生成整个 CD 管道。
*   想要从 Java 迁移到 Kotlin？了解如何执行[Java 和 Kotlin 中字符串的常见任务](java-to-kotlin-idioms-strings.md)。