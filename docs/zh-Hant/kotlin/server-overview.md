[//]: # (title: 使用 Kotlin 進行後端開發)

<web-summary>使用 Spring、Ktor 和其他後端架構透過 Kotlin 建置伺服器應用程式</web-summary>

Kotlin 非常適合開發伺服器端應用程式。使用 Kotlin，您可以編寫簡潔且富有表現力的程式碼，同時保持與現有基於 Java 的技術堆疊的完整相容性。

## 開始使用

Kotlin 支援將大型程式碼庫從 Java 逐漸遷移到 Kotlin。您可以開始使用 Kotlin 編寫測試或新的生產環境程式碼，同時將專案的其他部分保留在 Java 中。

設定您的 Java 專案以搭配 Kotlin 使用，並利用 IntelliJ IDEA 中內建的自動 Java 轉 Kotlin 轉換器：

<a href="mixing-java-kotlin-intellij.md"><img src="backend-get-started-button.svg" alt="將 Kotlin 引入您的 Java 專案" style="block"/></a>

## 探索架構

Kotlin 與所有基於 Java 的架構完全相容，因此您可以在享受 Kotlin 語法優點的同時，繼續使用熟悉的技術堆疊。除了優異的 IDE 支援外，Kotlin 還針對特定架構提供專屬工具，例如 IntelliJ IDEA Ultimate 中對 Spring 和 Ktor 的支援。

### Spring

[Spring](https://spring.io) 利用 Kotlin 的語言特性來提供更簡潔的 API。[線上專案產生器](https://start.spring.io/#!language=kotlin) 讓您能快速產生新的 Kotlin 專案。

<a href="jvm-get-started-spring-boot.md"><img src="spring-get-started-button.svg" alt="開始使用 Spring Boot 和 Kotlin" style="block"/></a>

### Ktor

[Ktor](https://github.com/kotlin/ktor) 是由 JetBrains 建置的架構，用於在 Kotlin 中建立 Web 應用程式。它利用協同程式實現高擴充性，並提供易於使用且慣用的 API。

<a href="https://ktor.io/docs/server-create-a-new-project.html"><img src="ktor-get-started-button.svg" alt="建立新的 Ktor 專案" style="block"/></a>

### 其他架構

以下是一些用於 Kotlin 的後端架構範例：

| 架構 | 描述 |
|--------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Quarkus](https://quarkus.io/guides/kotlin) | 一個為使用 Kotlin 提供一流支援的開源架構。Quarkus 是專為 Kubernetes 從頭打造的，透過利用數百個不斷增加的頂級程式庫，提供了一個具有凝聚力的全端架構。 |
| [Vert.x](https://vertx.io) | 是一個在 JVM 上建置回應式 Web 應用程式的架構。Vert.x 為 Kotlin 提供 [專屬支援](https://github.com/vert-x3/vertx-lang-kotlin)，包括 [與 Kotlin 協同程式的整合](https://vertx.io/docs/vertx-lang-kotlin-coroutines/kotlin/)。 |
| [kotlinx.html](https://github.com/kotlin/kotlinx.html) | 是一個可用於在 Web 應用程式中建置 HTML 的 DSL。它可以作為 JSP 和 FreeMarker 等傳統範本系統的替代方案。 |
| [Micronaut](https://micronaut.io/) | 是一個現代化的基於 JVM 的全端架構，用於建置模組化、易於測試的微服務和無伺服器應用程式。觀看在線講座 [“Micronaut for microservices with Kotlin”](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/) 並探索詳細的 [指南](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)，了解如何在 Micronaut 架構中使用 [Kotlin 擴充方法](extensions.md#extension-functions)。 |
| [http4k](https://http4k.org/) | 是一個純 Kotlin 編寫、占用空間極小的 Kotlin HTTP 應用程式功能性工具集。http4k 提供了 [支援命令列介面 (CLI) 的工具箱](https://toolbox.http4k.org) 以產生完整的專案樣板，以及一個 Web 型 [專案精靈](https://toolbox.http4k.org/project) 來引導並建立包含所選後端、模組和建置工具的 http4k 應用程式。 |
| [Javalin](https://javalin.io) | 是一個非常輕量級的 Kotlin 和 Java Web 架構，支援 WebSockets、HTTP2 和非同步請求。 |

## 部署您的應用程式

Kotlin 應用程式可以部署到任何支援 Java Web 應用程式的主機，包括 Amazon Web Services (AWS)、Google Cloud Platform (GCP) 等。

* **AWS** 提供了專屬的 [Kotlin SDK](https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/home.html) 以與其服務互動。對於無伺服器部署，您可以參考 [AWS Lambda 的 Kotlin 程式碼範例](https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/kotlin_lambda_code_examples.html)。
* **Ktor** 允許您將 Kotlin 應用程式發佈到各種雲端供應商。例如，您可以參考 Ktor 教學以進一步了解如何部署到 [Google App Engine](https://ktor.io/docs/google-app-engine.html) 和其他服務。
* **Spring** 應用程式也與大多數熱門的雲端供應商相容。請參閱 [Spring 官方文件](https://docs.spring.io/spring-boot/how-to/deployment/cloud.html) 以了解如何將 Spring Boot 應用程式部署到雲端。

## 後續步驟

* [了解如何使用 Kotlin 和 JUnit 測試您的 Java Maven 專案](jvm-test-using-junit.md)
* [探索如何使用 Ktor 建置非同步伺服器應用程式](https://ktor.io/docs/server-create-a-new-project.html)