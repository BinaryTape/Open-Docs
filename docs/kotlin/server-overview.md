[//]: # (title: 使用 Kotlin 进行后端开发)

<web-summary>使用 Spring、Ktor 和其他后端框架通过 Kotlin 构建服务器应用程序</web-summary>

Kotlin 非常适合开发服务器端应用程序。借助 Kotlin，您可以编写简洁且具有表现力的代码，同时保持与现有基于 Java 的技术栈的完全兼容性。

## 入门

Kotlin 支持将大型代码库从 Java 逐步迁移到 Kotlin。您可以开始用 Kotlin 编写测试或新的生产代码，同时保留项目的其他 Java 部分。

配置您的 Java 项目以使用 Kotlin，并利用 IntelliJ IDEA 中包含的自动 Java 到 Kotlin 转换器：

<a href="mixing-java-kotlin-intellij.md"><img src="backend-get-started-button.svg" alt="将 Kotlin 引入您的 Java 项目" style="block"/></a>

## 探索框架

Kotlin 与所有基于 Java 的框架完全兼容，因此您可以在沿用熟悉的技术栈的同时，从 Kotlin 语法中获益。除了出色的 IDE 支持外，Kotlin 还提供针对特定框架的工具支持，例如 IntelliJ IDEA Ultimate 中对 Spring 和 Ktor 的支持。

### Spring

[Spring](https://spring.io) 利用 Kotlin 的语言功能提供更简洁的 API。
[在线项目生成器](https://start.spring.io/#!language=kotlin)允许您快速生成一个新的 Kotlin 项目。

<a href="jvm-get-started-spring-boot.md"><img src="spring-get-started-button.svg" alt="开始使用 Spring Boot 和 Kotlin" style="block"/></a>

### Ktor

[Ktor](https://github.com/kotlin/ktor) 是由 JetBrains 构建的框架，用于在 Kotlin 中创建 Web 应用程序。
它利用协程实现高可扩展性，并提供易于使用且惯用的 API。

<a href="https://ktor.io/docs/server-create-a-new-project.html"><img src="ktor-get-started-button.svg" alt="创建一个新的 Ktor 项目" style="block"/></a>

### 其他框架

以下是 Kotlin 的其他一些后端框架示例：

| 框架 | 描述 |
|--------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Quarkus](https://quarkus.io/guides/kotlin)            | 一个为 Kotlin 提供一等支持的开源框架。Quarkus 从底层开始就为 Kubernetes 构建，通过利用数百个不断增长的最佳库，提供了一个具有凝聚力的全栈框架。 |
| [Vert.x](https://vertx.io)                             | 一个在 JVM 上构建响应式 Web 应用程序的框架。Vert.x 为 Kotlin 提供了[专门支持](https://github.com/vert-x3/vertx-lang-kotlin)，包括 [Kotlin 协程的集成](https://vertx.io/docs/vertx-lang-kotlin-coroutines/kotlin/)。 |
| [kotlinx.html](https://github.com/kotlin/kotlinx.html) | 一个可用于在 Web 应用程序中构建 HTML 的 DSL。它可以作为 JSP 和 FreeMarker 等传统模板系统的替代方案。 |
| [Micronaut](https://micronaut.io/)                     | 一个现代化的基于 JVM 的全栈框架，用于构建模块化、易于测试的微服务和无服务器应用程序。观看在线讲座[“使用 Kotlin 为微服务构建 Micronaut”](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/)，并查看详细[指南](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)，了解如何在 Micronaut 框架中使用 [Kotlin 扩展函数](extensions.md#extension-functions)。 |
| [http4k](https://http4k.org/)                          | 一个用纯 Kotlin 编写的、占用空间极小的函数式工具包，用于 Kotlin HTTP 应用程序。http4k 提供了[支持 CLI 的工具箱](https://toolbox.http4k.org)以生成完整的项目模板，以及一个基于 Web 的[项目向导](https://toolbox.http4k.org/project)，用于通过选定的后端、模块和构建工具引导一个可运行的 http4k 应用程序。 |
| [Javalin](https://javalin.io)                          | 一个非常轻量级的 Kotlin 和 Java Web 框架，支持 WebSockets、HTTP2 和异步请求。 |

## 部署您的应用程序

Kotlin 应用程序可以部署到任何支持 Java Web 应用程序的主机，包括 Amazon Web Services (AWS)、Google Cloud Platform (GCP) 等。

* **AWS** 提供了一个专门的 [Kotlin SDK](https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/home.html) 以与其服务进行交互。对于无服务器部署，您可以参考 [Kotlin 的 AWS Lambda 代码示例](https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/kotlin_lambda_code_examples.html)。
* **Ktor** 允许您将 Kotlin 应用程序发布到各种云提供商。例如，您可以按照 Ktor 教程详细了解如何部署到 [Google App Engine](https://ktor.io/docs/google-app-engine.html) 和其他服务。
* **Spring** 应用程序也与大多数主流云提供商兼容。请参阅[官方 Spring 文档](https://docs.spring.io/spring-boot/how-to/deployment/cloud.html)中关于如何将 Spring Boot 应用程序部署到云端的内容。

## 下一步

* [了解如何使用 Kotlin 和 JUnit 测试您的 Java Maven 项目](jvm-test-using-junit.md)
* [探索如何使用 Ktor 构建异步服务器应用程序](https://ktor.io/docs/server-create-a-new-project.html)