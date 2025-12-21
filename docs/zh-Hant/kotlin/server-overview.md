[//]: # (title: Kotlin 用於伺服器端)

Kotlin 非常適合用於開發伺服器端應用程式。它讓您可以編寫簡潔且富有表達力的程式碼，同時與現有的基於 Java 的技術堆疊完全相容，而且學習曲線平緩：

*   **表達力**：Kotlin 創新的語言特性，例如對 [型別安全建構器](type-safe-builders.md) 和 [委派屬性](delegated-properties.md) 的支援，有助於建立功能強大且易於使用的抽象。
*   **可擴展性**：Kotlin 對於 [協程](coroutines-overview.md) 的支援，有助於以適度的硬體要求，建立可擴展至大量客戶端的伺服器端應用程式。
*   **互通性**：Kotlin 與所有基於 Java 的框架完全相容，因此您可以使用熟悉的技術堆疊，同時享受更現代語言帶來的益處。
*   **遷移**：Kotlin 支援將大型程式碼庫從 Java 逐步遷移到 Kotlin。您可以開始使用 Kotlin 編寫新程式碼，同時保留系統中較舊的部分為 Java。
*   **工具**：除了普遍出色的 IDE 支援外，Kotlin 還在 IntelliJ IDEA Ultimate 的外掛程式中提供框架特定的工具（例如，針對 Spring 和 Ktor）。
*   **學習曲線**：對於 Java 開發人員而言，開始使用 Kotlin 非常容易。Kotlin 外掛程式中包含的自動 Java-to-Kotlin 轉換器有助於您的入門。 [Kotlin Koans](koans.md) 透過一系列互動式練習引導您了解關鍵語言特性。像 [Ktor](https://ktor.io/) 這樣的 Kotlin 特定框架提供了一種簡單、直接的方法，沒有大型框架的隱藏複雜性。

## 適用於 Kotlin 伺服器端開發的框架

以下是一些適用於 Kotlin 的伺服器端框架範例：

*   [Spring](https://spring.io) 從 5.0 版本開始，利用 Kotlin 的語言特性提供 [更簡潔的 API](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0)。[線上專案產生器](https://start.spring.io/#!language=kotlin) 讓您能快速產生新的 Kotlin 專案。

*   [Ktor](https://github.com/kotlin/ktor) 是由 JetBrains 開發的框架，用於以 Kotlin 建立 Web 應用程式，利用協程實現高可擴展性，並提供易於使用且慣用 (idiomatic) 的 API。

*   [Quarkus](https://quarkus.io/guides/kotlin) 提供了對使用 Kotlin 的一流支援。該框架是開源的，由 Red Hat 維護。Quarkus 從頭開始為 Kubernetes 構建，透過利用不斷增長的數百種最佳程式庫列表，提供了一個連貫的全端框架。

*   [Vert.x](https://vertx.io) 是一個在 JVM 上構建反應式 Web 應用程式的框架，為 Kotlin 提供 [專門支援](https://github.com/vert-x3/vertx-lang-kotlin)，包括 [完整文件](https://vertx.io/docs/vertx-core/kotlin/)。

*   [kotlinx.html](https://github.com/kotlin/kotlinx.html) 是一種可用於在 Web 應用程式中構建 HTML 的 DSL。它作為傳統模板系統（如 JSP 和 FreeMarker）的替代方案。

*   [Micronaut](https://micronaut.io/) 是一個現代化的基於 JVM 的全端框架，用於構建模組化、易於測試的微服務和無伺服器應用程式。它帶有許多實用的內建功能。

*   [http4k](https://http4k.org/) 是一個用於 Kotlin HTTP 應用程式的功能性工具包，佔用空間小，以純 Kotlin 編寫。該程式庫基於 Twitter 的「Your Server as a Function」論文，並將 HTTP 伺服器和客戶端建模為可以組合在一起的簡單 Kotlin 函數。

*   [Javalin](https://javalin.io) 是一個非常輕量級的 Kotlin 和 Java Web 框架，支援 WebSockets、HTTP2 和非同步請求。

*   持久化的可用選項包括直接 JDBC 存取、JPA 以及透過其 Java 驅動程式使用 NoSQL 資料庫。對於 JPA，[kotlin-jpa 編譯器外掛程式](no-arg-plugin.md#jpa-support) 會使 Kotlin 編譯的類別適應框架的要求。

> 您可以在 [https://kotlin.link/](https://kotlin.link/resources) 找到更多框架。
>
{style="note"}

## 部署 Kotlin 伺服器端應用程式

Kotlin 應用程式可以部署到任何支援 Java Web 應用程式的主機，包括 Amazon Web Services、Google Cloud Platform 等。

要在 [Heroku](https://www.heroku.com) 上部署 Kotlin 應用程式，您可以參考 [Heroku 官方教學](https://devcenter.heroku.com/articles/getting-started-with-kotlin)。

AWS Labs 提供了一個 [範例專案](https://github.com/awslabs/serverless-photo-recognition)，展示了如何使用 Kotlin 編寫 [AWS Lambda](https://aws.amazon.com/lambda/) 函數。

Google Cloud Platform 提供一系列關於將 Kotlin 應用程式部署到 GCP 的教學，包括 [Ktor 和 App Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8) 以及 [Spring 和 App Engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8)。此外，還有一個 [互動式程式碼實驗室](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin) 用於部署 Kotlin Spring 應用程式。

## 伺服器端使用 Kotlin 的產品

[Corda](https://www.corda.net/) 是一個由主要銀行支持的開源分散式帳本平台，完全以 Kotlin 構建。

[JetBrains Account](https://account.jetbrains.com/)，負責 JetBrains 整個許可證銷售和驗證流程的系統，完全以 Kotlin 編寫，自 2015 年以來一直在生產環境中運行，沒有重大問題。

[Chess.com](https://www.chess.com/) 是一個致力於西洋棋及其全球數百萬愛好者的網站。Chess.com 使用 Ktor 來實現多個 HTTP 客戶端的無縫配置。

[Adobe](https://medium.com/adobetech/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a) 的工程師使用 Kotlin 進行伺服器端應用程式開發，並在 Adobe Experience Platform 中使用 Ktor 進行原型開發。該平台使組織能夠在應用資料科學和機器學習之前集中並標準化客戶資料。

## 後續步驟

*   要更深入地了解該語言，請查閱本網站上的 Kotlin 文件和 [Kotlin Koans](koans.md)。
*   探索如何使用 [Ktor 構建非同步伺服器應用程式](https://ktor.io/docs/server-create-a-new-project.html)，這是一個使用 Kotlin 協程的框架。
*   觀看網路研討會 ["Micronaut for microservices with Kotlin"](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/)，並探索詳細的 [指南](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)，其中展示了如何在 Micronaut 框架中使用 [Kotlin 擴展函數](extensions.md#extension-functions)。
*   http4k 提供 [CLI](https://toolbox.http4k.org) 以產生完整專案，以及一個 [starter](https://start.http4k.org) 儲存庫，只需一個 bash 命令即可使用 GitHub、Travis 和 Heroku 產生完整的 CI/CD 流水線。
*   想要從 Java 遷移到 Kotlin 嗎？了解如何在 [Java 和 Kotlin 中執行典型的字串任務](java-to-kotlin-idioms-strings.md)。