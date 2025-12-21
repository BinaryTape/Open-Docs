[//]: # (title: Kotlin 用于服务端)

Kotlin 非常适合开发服务端应用程序。它允许您编写简洁且富有表现力的代码，同时与现有的基于 Java 的技术栈完全兼容，所有这些都具有平滑的学习曲线：

*   **表达能力**：Kotlin 创新的语言特性，例如其对[类型安全的构建器](type-safe-builders.md)和[委托属性](delegated-properties.md)的支持，有助于构建强大且易于使用的抽象。
*   **可伸缩性**：Kotlin 对[协程](coroutines-overview.md)的支持有助于构建服务端应用程序，使其能够以适度的硬件要求伸缩到大量客户端。
*   **互操作性**：Kotlin 与所有基于 Java 的框架完全兼容，因此您可以继续使用您熟悉的技术栈，同时获得更现代语言的优势。
*   **迁移**：Kotlin 支持将大型代码库从 Java 渐进式迁移到 Kotlin。您可以开始用 Kotlin 编写新代码，同时将系统中较旧的部分保留在 Java 中。
*   **工具**：除了总体的 IDE 支持很棒之外，Kotlin 还为 IntelliJ IDEA Ultimate 插件提供了框架特有的工具（例如，针对 Spring 和 Ktor）。
*   **学习曲线**：对于 Java 开发者来说，开始使用 Kotlin 非常容易。Kotlin 插件中包含的自动化 Java 到 Kotlin 转换器有助于您的初步尝试。[Kotlin 心印](koans.md)通过一系列交互式练习引导您掌握关键语言特性。像 [Ktor](https://ktor.io/) 这样的 Kotlin 特有的框架提供了一种简单、直接的方法，没有大型框架的隐藏复杂性。

## 用于 Kotlin 服务端开发的框架

以下是一些用于 Kotlin 的服务端框架示例：

*   [Spring](https://spring.io) 利用 Kotlin 的语言特性提供了[更简洁的 API](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0)，从 5.0 版本开始。通过[在线项目生成器](https://start.spring.io/#!language=kotlin)，您可以快速生成一个新的 Kotlin 项目。

*   [Ktor](https://github.com/kotlin/ktor) 是 JetBrains 构建的、用于使用 Kotlin 创建 Web 应用程序的框架，它利用协程实现高可伸缩性，并提供易于使用且惯用的 API。

*   [Quarkus](https://quarkus.io/guides/kotlin) 为使用 Kotlin 提供了[一流支持](https://quarkus.io/guides/kotlin)。该框架是开源的，由 Red Hat 维护。Quarkus 专为 Kubernetes 从零开始构建，通过利用日益增长的数百个最佳库列表，提供了一个内聚的全栈框架。

*   [Vert.x](https://vertx.io) 是一个用于在 JVM 上构建反应式 Web 应用程序的框架，为 Kotlin 提供了[专门的支持](https://github.com/vert-x3/vertx-lang-kotlin)，包括[完整的文档](https://vertx.io/docs/vertx-core/kotlin/)。

*   [kotlinx.html](https://github.com/kotlin/kotlinx.html) 是一个 DSL，可用于在 Web 应用程序中构建 HTML。它可作为传统模板系统（例如 JSP 和 FreeMarker）的替代品。

*   [Micronaut](https://micronaut.io/) 是一个现代的、基于 JVM 的全栈框架，用于构建模块化、易于测试的微服务和无服务器应用程序。它附带了许多有用的内置特性。

*   [http4k](https://http4k.org/) 是一个功能工具包，占用空间小，用于 Kotlin HTTP 应用程序，完全使用纯 Kotlin 编写。该库基于 Twitter 的“您的服务器即函数”论文，将 HTTP 服务器和客户端都建模为可以组合在一起的简单 Kotlin 函数。

*   [Javalin](https://javalin.io) 是一个非常轻量级的 Kotlin 和 Java Web 框架，支持 WebSockets、HTTP2 和异步请求。

*   持久化的可用选项包括直接 JDBC 访问、JPA，以及通过其 Java 驱动程序使用 NoSQL 数据库。对于 JPA，[kotlin-jpa 编译器插件](no-arg-plugin.md#jpa-support)可使 Kotlin 编译的类适应框架的要求。
    
> 您可以在 [https://kotlin.link/](https://kotlin.link/resources) 找到更多框架。
>
{style="note"}

## 部署 Kotlin 服务端应用程序

Kotlin 应用程序可以部署到任何支持 Java Web 应用程序的主机，包括 Amazon Web Services、Google Cloud Platform 等。

要在 [Heroku](https://www.heroku.com) 上部署 Kotlin 应用程序，您可以按照[官方 Heroku 教程](https://devcenter.heroku.com/articles/getting-started-with-kotlin)进行操作。

AWS Labs 提供了一个[示例项目](https://github.com/awslabs/serverless-photo-recognition)，展示了如何使用 Kotlin 编写 [AWS Lambda](https://aws.amazon.com/lambda/) 函数。

Google Cloud Platform 提供了一系列将 Kotlin 应用程序部署到 GCP 的教程，包括针对 [Ktor 和 App Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8) 以及 [Spring 和 App Engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8) 的教程。此外，还有一个用于部署 Kotlin Spring 应用程序的[交互式代码实验](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin)。

## 在服务端使用 Kotlin 的产品

[Corda](https://www.corda.net/) 是一个开源分布式账本平台，它得到了主要银行的支持，并完全使用 Kotlin 构建。

[JetBrains Account](https://account.jetbrains.com/) 是 JetBrains 负责整个许可证销售和验证过程的系统，它完全使用 Kotlin 编写，自 2015 年以来一直在生产环境中运行，没有出现重大问题。

[Chess.com](https://www.chess.com/) 是一个致力于国际象棋和全球数百万热爱该游戏的玩家的网站。Chess.com 使用 Ktor 实现多个 HTTP 客户端的无缝配置。

[Adobe](https://medium.com/adobetech/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a) 的工程师使用 Kotlin 进行服务端应用开发，并使用 Ktor 在 Adobe Experience Platform 中进行原型开发，该平台使组织能够在应用数据科学和机器学习之前集中和标准化客户数据。

## 后续步骤

*   要对该语言有更深入的介绍，请查看本站上的 Kotlin 文档和 [Kotlin 心印](koans.md)。
*   探索如何[使用 Ktor 构建异步服务器应用程序](https://ktor.io/docs/server-create-a-new-project.html)，Ktor 是一个使用 Kotlin 协程的框架。
*   观看网络研讨会“[使用 Kotlin 的 Micronaut 微服务](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/)”，并查阅一份详细[指南](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)，其中展示了如何在 Micronaut 框架中使用 [Kotlin 扩展函数](extensions.md#extension-functions)。
*   http4k 提供了 [CLI](https://toolbox.http4k.org) 来生成完整的项目，以及一个[起始版本库](https://start.http4k.org)来通过一个 bash 命令使用 GitHub、Travis 和 Heroku 生成完整的 CD 流水线。
*   想要从 Java 迁移到 Kotlin？了解如何在 [Java 和 Kotlin 中处理字符串的典型任务](java-to-kotlin-idioms-strings.md)。