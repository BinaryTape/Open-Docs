---
title: "伺服器端 Kotlin"
---
Kotlin 非常適合用於開發伺服器端應用程式。它能讓您撰寫簡潔且富有表現力的程式碼，同時與現有的基於 Java 的技術堆疊保持完全相容性，並且學習曲線平滑：

* **表現力 (Expressiveness)**：Kotlin 的創新語言特性，例如它對[類型安全建構器 (type-safe builders)](type-safe-builders)和[委託屬性 (delegated properties)](delegated-properties)的支援，有助於構建強大且易於使用的抽象。
* **可擴展性 (Scalability)**：Kotlin 對[協程 (coroutines)](coroutines-overview)的支援有助於構建伺服器端應用程式，這些應用程式可以擴展到大量客戶端，而硬體需求不高。
* **互通性 (Interoperability)**：Kotlin 與所有基於 Java 的框架完全相容，因此您可以利用熟悉的技術堆疊，同時獲得更現代化語言的優勢。
* **遷移 (Migration)**：Kotlin 支援將大型程式碼庫從 Java 逐步遷移到 Kotlin。您可以開始用 Kotlin 撰寫新程式碼，同時將系統的舊部分保留在 Java 中。
* **工具 (Tooling)**：除了通常在 IDE 中提供出色的支援外，Kotlin 還在 IntelliJ IDEA Ultimate 的外掛程式中提供特定於框架的工具（例如，用於 Spring 和 Ktor）。
* **學習曲線 (Learning Curve)**：對於 Java 開發人員來說，開始使用 Kotlin 非常容易。Kotlin 外掛程式中包含的自動 Java 到 Kotlin 轉換器可幫助您完成第一步。[Kotlin Koans](koans) 通過一系列互動式練習指導您了解關鍵語言特性。諸如 [Ktor](https://ktor.io/) 之類的 Kotlin 特定框架提供了一種簡單、直接的方法，而沒有較大型框架的隱藏複雜性。

## 用於 Kotlin 的伺服器端開發框架

以下是用於 Kotlin 的一些伺服器端框架的範例：

* [Spring](https://spring.io) 利用 Kotlin 的語言特性來提供[更簡潔的 API](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0)，從 5.0 版本開始。[線上專案產生器](https://start.spring.io/#!language=kotlin) 允許您在 Kotlin 中快速產生一個新專案。

* [Ktor](https://github.com/kotlin/ktor) 是 JetBrains 構建的框架，用於在 Kotlin 中建立 Web 應用程式，利用協程實現高擴展性，並提供易於使用且符合語言習慣的 API。

* [Quarkus](https://quarkus.io/guides/kotlin) 提供對使用 Kotlin 的一流支援。該框架是開源的，由 Red Hat 維護。Quarkus 從頭開始為 Kubernetes 構建，並通過利用越來越多的數百個最佳庫來提供有凝聚力的完整堆疊框架。

* [Vert.x](https://vertx.io)，一個用於在 JVM 上構建反應式 Web 應用程式的框架，為 Kotlin 提供[專用支援](https://github.com/vert-x3/vertx-lang-kotlin)，包括[完整文件](https://vertx.io/docs/vertx-core/kotlin/)。

* [kotlinx.html](https://github.com/kotlin/kotlinx.html) 是一個 DSL，可用於在 Web 應用程式中構建 HTML。它可以替代傳統的模板系統，例如 JSP 和 FreeMarker。

* [Micronaut](https://micronaut.io/) 是一個現代的基於 JVM 的全堆疊框架，用於構建模組化、易於測試的微服務和無伺服器應用程式。它帶有許多有用的內建功能。

* [http4k](https://http4k.org/) 是用於 Kotlin HTTP 應用程式的功能工具包，佔用空間很小，以純 Kotlin 撰寫。該函式庫基於 Twitter 的 "Your Server as a Function" 論文，並表示將 HTTP 伺服器和客戶端建模為可以組合在一起的簡單 Kotlin 函數。

* [Javalin](https://javalin.io) 是一個非常輕量級的 Kotlin 和 Java Web 框架，支援 WebSockets、HTTP2 和異步請求。

* 可用的持久性選項包括直接 JDBC 存取、JPA 以及通過其 Java 驅動程式使用 NoSQL 資料庫。對於 JPA，[kotlin-jpa 編譯器外掛程式](no-arg-plugin#jpa-support) 調整 Kotlin 編譯的類別以滿足框架的要求。

:::note
您可以在 [https://kotlin.link/](https://kotlin.link/resources) 找到更多框架。

:::

## 部署 Kotlin 伺服器端應用程式

Kotlin 應用程式可以部署到任何支援 Java Web 應用程式的主機，包括 Amazon Web Services、Google Cloud Platform 等。

若要在 [Heroku](https://www.heroku.com) 上部署 Kotlin 應用程式，您可以按照 [官方 Heroku 教學](https://devcenter.heroku.com/articles/getting-started-with-kotlin) 進行操作。

AWS Labs 提供了一個[範例專案](https://github.com/awslabs/serverless-photo-recognition)，展示了如何使用 Kotlin 撰寫 [AWS Lambda](https://aws.amazon.com/lambda/) 函數。

Google Cloud Platform 提供了一系列將 Kotlin 應用程式部署到 GCP 的教學課程，包括 [Ktor 和 App Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8) 以及 [Spring 和 App engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8)。此外，還有一個[互動式程式碼實驗室](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin) 用於部署 Kotlin Spring 應用程式。

## 在伺服器端使用 Kotlin 的產品

[Corda](https://www.corda.net/) 是一個開源的分散式帳本平台，受到主要銀行的支持，並且完全使用 Kotlin 構建。

[JetBrains Account](https://account.jetbrains.com/)，該系統負責 JetBrains 的整個授權銷售和驗證流程，以 100% Kotlin 撰寫，自 2015 年以來一直在生產環境中運行，沒有出現重大問題。

[Chess.com](https://www.chess.com/) 是一個專注於西洋棋的網站，擁有來自世界各地數百萬熱愛這項遊戲的玩家。Chess.com 使用 Ktor 實現多個 HTTP 客戶端的無縫配置。

[Adobe](https://blog.developer.adobe.com/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a) 的工程師使用 Kotlin 進行伺服器端應用程式開發，並使用 Ktor 在 Adobe Experience Platform 中進行原型設計，這使組織能夠在應用資料科學和機器學習之前集中和標準化客戶資料。

## 後續步驟

* 有關更深入的語言介紹，請查看本網站上的 Kotlin 文件和 [Kotlin Koans](koans)。
* 探索如何使用 [Ktor](https://ktor.io/docs/server-create-a-new-project.html)（一個使用 Kotlin 協程的框架）[構建異步伺服器應用程式](https://ktor.io/docs/server-create-a-new-project.html)。
* 觀看網路研討會 ["Micronaut for microservices with Kotlin"](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/) 並瀏覽詳細的 [指南](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)，展示如何在 Micronaut 框架中使用 [Kotlin 擴展函數 (Kotlin extension functions)](extensions#extension-functions)。
* http4k 提供了 [CLI](https://toolbox.http4k.org) 來產生完全形成的專案，以及一個 [啟動器](https://start.http4k.org) 儲存庫，用於使用單個 bash 命令生成使用 GitHub、Travis 和 Heroku 的整個 CD 管道。
* 想要從 Java 遷移到 Kotlin 嗎？ 了解如何在 [Java 和 Kotlin 中執行字串的典型任務](java-to-kotlin-idioms-strings)。