[//]: # (title: Kotlin 用於伺服器端)

Kotlin 非常適合開發伺服器端應用程式。它允許您編寫簡潔且富有表達力的程式碼，同時與現有的基於 Java 的技術棧保持完全相容，而且學習曲線平穩：

*   **表達性 (Expressiveness)**：Kotlin 創新的語言功能，例如對[型別安全建構器 (type-safe builders)](type-safe-builders.md) 和[委派屬性 (delegated properties)](delegated-properties.md) 的支援，有助於建立強大且易於使用的抽象。
*   **可擴充性 (Scalability)**：Kotlin 對於[協程 (coroutines)](coroutines-overview.md) 的支援，有助於建立能夠以適度的硬體需求擴充至大量客戶的伺服器端應用程式。
*   **互通性 (Interoperability)**：Kotlin 與所有基於 Java 的框架完全相容，因此您可以使用熟悉的技術棧，同時享受更現代語言的優勢。
*   **遷移 (Migration)**：Kotlin 支援將大型程式碼庫從 Java 逐步遷移到 Kotlin。您可以開始用 Kotlin 編寫新程式碼，同時將系統的舊部分保留在 Java 中。
*   **工具 (Tooling)**：除了普遍優秀的 IDE 支援外，Kotlin 還在 IntelliJ IDEA Ultimate 的外掛程式中提供框架專用工具（例如，針對 Spring 和 Ktor）。
*   **學習曲線 (Learning Curve)**：對於 Java 開發者來說，入門 Kotlin 非常容易。Kotlin 外掛程式中包含的自動化 Java-to-Kotlin 轉換器有助於您的首次嘗試。[Kotlin Koans](koans.md) 透過一系列互動式練習引導您了解關鍵語言功能。像 [Ktor](https://ktor.io/) 這樣專為 Kotlin 設計的框架提供了一種簡單、直接的方法，沒有大型框架的隱藏複雜性。

## 使用 Kotlin 進行伺服器端開發的框架

以下是一些用於 Kotlin 的伺服器端框架範例：

*   [Spring](https://spring.io) 利用 Kotlin 的語言功能，從 5.0 版開始提供[更簡潔的 API](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0)。[線上專案產生器 (online project generator)](https://start.spring.io/#!language=kotlin) 讓您可以快速產生一個新的 Kotlin 專案。

*   [Ktor](https://github.com/kotlin/ktor) 是由 JetBrains 建立的一個框架，用於在 Kotlin 中建立 Web 應用程式，它利用協程實現高可擴充性，並提供易於使用且慣用的 API。

*   [Quarkus](https://quarkus.io/guides/kotlin) 為使用 Kotlin 提供一流的支援。該框架是開源的，由 Red Hat 維護。Quarkus 從頭開始為 Kubernetes 構建，透過利用不斷增長的數百種最佳程式庫列表，提供一個連貫的全棧框架。

*   [Vert.x](https://vertx.io) 是一個用於在 JVM 上建立反應式 Web 應用程式的框架，它為 Kotlin 提供[專門支援](https://github.com/vert-x3/vertx-lang-kotlin)，包括[完整文件](https://vertx.io/docs/vertx-core/kotlin/)。

*   [kotlinx.html](https://github.com/kotlin/kotlinx.html) 是一個 DSL，可用於在 Web 應用程式中構建 HTML。它可作為傳統模板系統（例如 JSP 和 FreeMarker）的替代方案。

*   [Micronaut](https://micronaut.io/) 是一個現代的基於 JVM 的全棧框架，用於構建模組化、易於測試的微服務和無伺服器應用程式。它帶有許多有用的內建功能。

*   [http4k](https://http4k.org/) 是一個功能型工具包，佔用空間小，適用於 Kotlin HTTP 應用程式，以純 Kotlin 編寫。該函式庫基於 Twitter 的「您的伺服器即函數 (Your Server as a Function)」論文，並將 HTTP 伺服器和客戶端建模為可組合的簡單 Kotlin 函數。

*   [Javalin](https://javalin.io) 是一個非常輕量級的 Kotlin 和 Java Web 框架，支援 WebSockets、HTTP2 和非同步請求。

*   可用的持久化選項包括直接 JDBC 存取、JPA，以及透過其 Java 驅動程式使用 NoSQL 資料庫。對於 JPA，[kotlin-jpa 編譯器外掛程式 (compiler plugin)](no-arg-plugin.md#jpa-support) 會使 Kotlin 編譯的類別適應框架的要求。

> 您可以在 [https://kotlin.link/](https://kotlin.link/resources) 找到更多框架。
>
{style="note"}

## 部署 Kotlin 伺服器端應用程式

Kotlin 應用程式可以部署到任何支援 Java Web 應用程式的主機，包括 Amazon Web Services、Google Cloud Platform 等。

要在 [Heroku](https://www.heroku.com) 上部署 Kotlin 應用程式，您可以遵循[官方 Heroku 教學課程](https://devcenter.heroku.com/articles/getting-started-with-kotlin)。

AWS Labs 提供一個[範例專案](https://github.com/awslabs/serverless-photo-recognition)，展示如何使用 Kotlin 編寫 [AWS Lambda](https://aws.amazon.com/lambda/) 函數。

Google Cloud Platform 提供一系列教學課程，用於將 Kotlin 應用程式部署到 GCP，包括針對 [Ktor 和 App Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8) 以及 [Spring 和 App engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8) 的教學。此外，還有一個[互動式程式碼實驗室 (interactive code lab)](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin) 用於部署 Kotlin Spring 應用程式。

## 在伺服器端使用 Kotlin 的產品

[Corda](https://www.corda.net/) 是一個開源的分佈式分類帳平台，由主要銀行支援，並完全以 Kotlin 構建。

[JetBrains Account](https://account.jetbrains.com/)，JetBrains 負責整個許可證銷售和驗證過程的系統，是 100% 用 Kotlin 編寫的，自 2015 年以來一直在生產環境中運行，沒有重大問題。

[Chess.com](https://www.chess.com/) 是一個專門為西洋棋及其全球數百萬愛好者設立的網站。Chess.com 使用 Ktor 實現多個 HTTP 客戶端的無縫配置。

[Adobe](https://blog.developer.adobe.com/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a) 的工程師使用 Kotlin 進行伺服器端應用程式開發，並使用 Ktor 在 Adobe Experience Platform 中進行原型設計，該平台使組織能夠在應用數據科學和機器學習之前集中和標準化客戶數據。

## 後續步驟

*   若要更深入了解該語言，請查閱本網站上的 Kotlin 文件和 [Kotlin Koans](koans.md)。
*   探索如何使用 [Ktor](https://ktor.io/docs/server-create-a-new-project.html) 建立非同步伺服器應用程式，Ktor 是一個使用 Kotlin 協程的框架。
*   觀看網路研討會["使用 Kotlin 的微服務 Micronaut"](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/)，並探索詳細的[指南](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)，其中展示如何在 Micronaut 框架中使用 [Kotlin 擴充函數 (extension functions)](extensions.md#extension-functions)。
*   http4k 提供 [CLI](https://toolbox.http4k.org) 來產生完整的專案，以及一個[入門 (starter)](https://start.http4k.org) 儲存庫，以便使用 GitHub、Travis 和 Heroku，透過單個 bash 命令產生整個 CD 管道。
*   想要從 Java 遷移到 Kotlin 嗎？了解如何在 [Java 和 Kotlin 中執行典型的字串任務](java-to-kotlin-idioms-strings.md)。