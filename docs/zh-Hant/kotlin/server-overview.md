[//]: # (title: 伺服器端開發的 Kotlin)

Kotlin 非常適合開發伺服器端應用程式。它讓您能夠編寫簡潔且富有表現力的程式碼，同時保持與現有 Java 技術堆疊的完整相容性，且學習曲線平緩：

* **表現力**：Kotlin 創新的語言特性，例如對 [型別安全建構器](type-safe-builders.md) 和 [委派屬性](delegated-properties.md) 的支援，有助於建置強大且易於使用的抽象。
* **擴充性**：Kotlin 對 [協同程式](coroutines-overview.md) 的支援有助於建置伺服器端應用程式，使其能在較低的硬體需求下擴充至支援海量用戶端。
* **互通性**：Kotlin 與所有 Java 架構完全相容，因此您可以在享受現代語言優點的同時，繼續使用熟悉的技術堆疊。
* **遷移**：Kotlin 支援將大型程式碼庫從 Java 逐漸遷移到 Kotlin。您可以開始使用 Kotlin 編寫新程式碼，同時保留系統中較舊的 Java 部分。
* **工具支援**：除了優異的通用 IDE 支援外，Kotlin 還在 IntelliJ IDEA Ultimate 的外掛程式中針對特定架構（例如 Spring 和 Ktor）提供專屬工具。
* **學習曲線**：對於 Java 開發人員來說，開始使用 Kotlin 非常容易。Kotlin 外掛程式中包含的自動 Java 轉 Kotlin 轉換器可協助您邁出第一步。[Kotlin Koans](koans.md) 透過一系列互動式練習引導您了解關鍵的語言特性。像 [Ktor](https://ktor.io/) 這樣專為 Kotlin 設計的架構提供了一種簡單直觀的方法，沒有大型架構那種隱藏的複雜性。

## 使用 Kotlin 進行伺服器端開發的架構

以下是一些 Kotlin 伺服器端架構的範例：

* [Spring](https://spring.io) 從 5.0 版本開始利用 Kotlin 的語言特性來提供 [更簡潔的 API](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0)。[線上專案產生器](https://start.spring.io/#!language=kotlin) 讓您能快速產生新的 Kotlin 專案。

* [Ktor](https://github.com/kotlin/ktor) 是由 JetBrains 建置的架構，用於在 Kotlin 中建立 Web 應用程式，它利用協同程式實現高擴充性，並提供易於使用且慣用的 API。

* [Quarkus](https://quarkus.io/guides/kotlin) 為使用 Kotlin 提供了一流的支援。該架構為開源並由 Red Hat 維護。Quarkus 是專為 Kubernetes 從頭打造的，透過利用數百個不斷增加的頂級庫，提供了一個具有凝聚力的全端架構。

* [Vert.x](https://vertx.io) 是一個在 JVM 上建置回應式 Web 應用程式的架構，為 Kotlin 提供 [專屬支援](https://github.com/vert-x3/vertx-lang-kotlin)，包括 [完整文件](https://vertx.io/docs/vertx-core/kotlin/)。

* [kotlinx.html](https://github.com/kotlin/kotlinx.html) 是一個可用於在 Web 應用程式中建置 HTML 的 DSL。它可以作為 JSP 和 FreeMarker 等傳統範本系統的替代方案。

* [Micronaut](https://micronaut.io/) 是一個現代化的 JVM 全端架構，用於建置模組化、易於測試的微服務和無伺服器應用程式。它內建了許多實用的功能。

* [http4k](https://http4k.org/) 是一個純 Kotlin 編寫、占用空間極小的 Kotlin HTTP 應用程式功能性工具集。該程式庫基於 Twitter 的 "Your Server as a Function" 論文，將 HTTP 伺服器和用戶端都建模為可以組合在一起的簡單 Kotlin 函式。

* [Javalin](https://javalin.io) 是一個非常輕量級的 Kotlin 和 Java Web 架構，支援 WebSockets、HTTP2 和非同步請求。

* 持久化的可用選項包括直接 JDBC 存取、JPA，以及透過 Java 驅動程式使用 NoSQL 資料庫。對於 JPA，[kotlin-jpa 編譯器外掛程式](no-arg-plugin.md#jpa-support) 可使 Kotlin 編譯的類別適應架構的需求。
  
> 您可以在 [https://kotlin.link/](https://kotlin.link/resources) 找到更多架構。
>
{style="note"}

## 部署 Kotlin 伺服器端應用程式

Kotlin 應用程式可以部署到任何支援 Java Web 應用程式的主機，包括 Amazon Web Services、Google Cloud Platform 等。

要在 [Heroku](https://www.heroku.com) 上部署 Kotlin 應用程式，您可以參考 [Heroku 官方教學](https://devcenter.heroku.com/articles/getting-started-with-kotlin)。

AWS Labs 提供了一個 [範例專案](https://github.com/awslabs/serverless-photo-recognition)，展示如何使用 Kotlin 編寫 [AWS Lambda](https://aws.amazon.com/lambda/) 函式。

Google Cloud Platform 提供了一系列將 Kotlin 應用程式部署到 GCP 的教學，包括 [Ktor 和 App Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8) 以及 [Spring 和 App Engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8)。此外，還有一個用於部署 Kotlin Spring 應用程式的 [互動式程式碼研究室](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin)。

## 在伺服器端使用 Kotlin 的產品

[Corda](https://www.corda.net/) 是一個開源的分散式帳本平台，由各大銀行支援，且完全使用 Kotlin 建置。

[JetBrains Account](https://account.jetbrains.com/) 是負責 JetBrains 整個授權銷售和驗證流程的系統，100% 使用 Kotlin 編寫，自 2015 年以來一直在生產環境運行，未出現過重大問題。

[Chess.com](https://www.chess.com/) 是一個致力於西洋棋以及全球數百萬愛好者的網站。Chess.com 使用 Ktor 來無縫配置多個 HTTP 用戶端。

[Adobe](https://medium.com/adobetech/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a) 的工程師在 Adobe Experience Platform 中使用 Kotlin 進行伺服器端應用開發，並使用 Ktor 進行原型設計，該平台使組織能夠在應用資料科學與機器學習之前，集中化並標準化客戶資料。

## 後續步驟

* 若要更深入地了解該語言，請參閱本網站上的 Kotlin 文件和 [Kotlin Koans](koans.md)。
* 探索如何使用 [Ktor 建置非同步伺服器應用程式](https://ktor.io/docs/server-create-a-new-project.html)，這是一個使用 Kotlin 協同程式的架構。
* 觀看在線講座 ["Micronaut for microservices with Kotlin"](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/) 並探索詳細的 [指南](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)，了解如何在 Micronaut 架構中使用 [擴充方法](extensions.md#extension-functions)。
* http4k 提供了 [CLI](https://toolbox.http4k.org) 來產生完整的專案，以及一個 [入門](https://start.http4k.org) 存儲庫，只需一個 bash 指令即可使用 GitHub、Travis 和 Heroku 產生完整的 CD 管線。
* 想要從 Java 遷移到 Kotlin 嗎？了解如何 [在 Java 和 Kotlin 中執行字串的典型任務](java-to-kotlin-idioms-strings.md)。