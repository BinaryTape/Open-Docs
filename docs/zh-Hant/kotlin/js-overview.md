[//]: # (title: Kotlin/JavaScript)

Kotlin/JavaScript (Kotlin/JS) 讓您能夠將 Kotlin 程式碼、Kotlin 標準函式庫以及任何相容的依賴項轉譯為 JavaScript。透過這種方式，您的 Kotlin 應用程式可以在任何支援 JavaScript 的環境中執行。

透過 [Kotlin Multiplatform Gradle 插件](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html) (`kotlin.multiplatform`) 使用 Kotlin/JS，可以從單一位置設定和管理目標為 JavaScript 的 Kotlin 專案。

Kotlin Multiplatform Gradle 插件讓您能使用諸如控制應用程式的捆綁以及直接從 npm 添加 JavaScript 依賴項等功能。要概覽可用的設定選項，請參閱 [設定 Kotlin/JS 專案](js-project-setup.md)。

> Kotlin/JS 目前的實作目標是 [ES5](https://www.ecma-international.org/ecma-262/5.1/) 和 [ES2015](https://262.ecma-international.org/6.0/) 標準。
>
{style="tip"}

## Kotlin/JS 的使用案例

以下是一些使用 Kotlin/JS 的常見方式：

*   **在前端和 JVM 後端之間共享共同邏輯**

    如果您的後端是用 Kotlin 或其他 JVM 相容語言編寫的，您可以在網頁應用程式和後端之間共享共同程式碼。這包括資料傳輸物件 (DTOs)、驗證和身份驗證規則、REST API 端點的抽象化等等。

*   **在 Android、iOS 和網頁用戶端之間共享共同邏輯**

    您可以在網頁介面與 Android 和 iOS 行動應用程式之間共享業務邏輯，同時保留原生使用者介面。這避免了重複共同功能，例如 REST API 抽象化、使用者身份驗證、表單驗證和領域模型。

*   **使用 Kotlin/JS 建置前端網頁應用程式**

    使用 Kotlin 開發傳統網頁前端，同時與現有工具和函式庫整合：

    *   如果您熟悉 Android 開發，可以使用基於 Compose 的框架（例如 [Kobweb](https://kobweb.varabyte.com/) 或 [Kilua](https://kilua.dev/)）來建置網頁應用程式。
    *   透過 JetBrains 提供的 [Kotlin 對常用 JavaScript 函式庫的封裝器](https://github.com/JetBrains/kotlin-wrappers)，使用 Kotlin/JS 建置完全型別安全的 React 應用程式。這些 Kotlin 封裝器 (`kotlin-wrappers`) 為 React 和其他 JavaScript 框架提供了抽象化和整合。

        這些封裝器還支援互補的函式庫，例如 [React Redux](https://react-redux.js.org/)、[React Router](https://reactrouter.com/) 和 [styled-components](https://styled-components.com/)。您還可以透過與 JavaScript 生態系統的互通性來使用第三方 React 元件和元件函式庫。

    *   使用 [Kotlin/JS 框架](js-frameworks.md)，它們與 Kotlin 生態系統整合並支援簡潔而富有表達力的程式碼。

*   **建置支援舊版瀏覽器的多平台應用程式**

    透過 Compose Multiplatform，您可以使用 Kotlin 建置應用程式，並在網頁專案中重用行動裝置和桌面使用者介面。雖然 [Kotlin/Wasm](wasm-overview.md) 是主要目標，但您可以透過同時目標 Kotlin/JS 來將支援範圍擴展到舊版瀏覽器。

*   **使用 Kotlin/JS 建置伺服器端和無伺服器應用程式**

    Kotlin/JS 中的 Node.js 目標讓您可以在 JavaScript 執行環境上為伺服器端或無伺服器環境建立應用程式。這提供了快速啟動和低記憶體使用量。[`kotlinx-nodejs`](https://github.com/Kotlin/kotlinx-nodejs) 函式庫提供了從 Kotlin 對 [Node.js API](https://nodejs.org/docs/latest/api/) 的型別安全存取。

根據您的使用案例，Kotlin/JS 專案可以使用來自 Kotlin 生態系統的相容函式庫，以及來自 JavaScript 和 TypeScript 生態系統的第三方函式庫。

要從 Kotlin 程式碼中使用第三方函式庫，您可以建立自己的型別安全封裝器或使用社群維護的封裝器。此外，您可以使用 Kotlin/JS [動態型別](dynamic-type.md)，這讓您可以跳過嚴格型別檢查和函式庫封裝器，但犧牲了型別安全。

Kotlin/JS 也相容於最常見的模組系統：[ESM](https://tc39.es/ecma262/#sec-modules)、[CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules)、[UMD](https://github.com/umdjs/umd) 和 [AMD](https://github.com/amdjs/amdjs-api)。這讓您可以[產生和使用模組](js-modules.md)，並以有條理的方式與 JavaScript 生態系統整合。

### 分享您的使用案例

[Kotlin/JS 的使用案例](#use-cases-for-kotlin-js) 中的清單並非詳盡無遺。歡迎嘗試不同的方法，並找到最適合您專案的方式。

歡迎在官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道中，與 Kotlin/JS 社群和 Kotlin/JS 團隊聊天。

## Kotlin/JS 入門

探索開始使用 Kotlin/JS 的基本概念和初始步驟：

*   如果您是 Kotlin 新手，請先檢閱 [基本語法](basic-syntax.md) 並探索 [Kotlin 導覽](kotlin-tour-welcome.md)。
*   查看 [Kotlin/JS 範例專案](#sample-projects-for-kotlin-js) 清單以尋找靈感。這些範例包含有用的程式碼片段和模式，可以幫助您開始您的專案。
*   如果您是 Kotlin/JS 新手，請從 [設定指南](js-project-setup.md) 開始，然後再探索更進階的主題。

想親自試試看 Kotlin/JS 嗎？

<a href="js-get-started.md"><img src="js-get-started-button.svg" width="500" alt="開始使用 Kotlin/JS" style="block"/></a>

## Kotlin/JS 範例專案

下表列出了一組範例專案，展示了各種 Kotlin/JS 使用案例、架構和程式碼共享策略：

| Project                                                                                                                           | Description                                                                                                                                                                                                                                                                                                                      |
|-----------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Petclinic with common code between Spring and Angular](https://github.com/Kotlin/kmp-spring-petclinic/#readme)                   | 展示了企業應用程式如何透過共享資料傳輸物件、驗證和身份驗證規則，以及 REST API 端點的抽象化來避免程式碼重複。程式碼在 [Spring Boot](https://spring.io/projects/spring-boot) 後端和 [Angular](https://angular.dev/) 前端之間共享。                                                                                                    |
| [Fullstack Conference CMS](https://github.com/Kotlin/kmp-fullstack-conference-cms/#readme)                                        | 展示了多種程式碼共享方法，從最簡單到全面共享程式碼，涵蓋了 [Ktor](https://ktor.io/)、[Jetpack Compose](https://developer.android.com/compose) 和 [Vue.js](https://vuejs.org/) 應用程式。                                                                                                                         |
| [Todo App on a Compose-HTML-based Kobweb framework](https://github.com/varabyte/kobweb-templates/tree/main/examples/todo/#readme) | 展示了如何透過重用 Android 開發人員熟悉的方法來建立待辦事項應用程式。它建置了一個由 [Kobweb 框架](https://kobweb.varabyte.com/) 驅動的客戶端 UI 應用程式。                                                                                                                           |
| [Simple logic sharing between Android, iOS, and web](https://github.com/Kotlin/kmp-logic-sharing-simple-example/#readme)          | 包含了一個用於建置專案的範本，該專案具有 Kotlin 中的共同邏輯，並在 Android ([Jetpack Compose](https://developer.android.com/compose))、iOS ([SwiftUI](https://developer.apple.com/tutorials/swiftui/)) 和網頁 ([React](https://react.dev/)) 上的平台原生 UI 應用程式中使用。                                            |
| [Full-stack collaborative to-do list](https://github.com/kotlin-hands-on/jvm-js-fullstack/#readme)                                | 展示了如何使用 Kotlin Multiplatform 並以 JS 和 JVM 作為目標來建立協作待辦事項應用程式。它使用 [Ktor](https://ktor.io/) 作為後端，並使用 Kotlin/JS 和 React 作為前端。                                                                                                              |

## Kotlin/JS 框架

Kotlin/JS 框架透過提供即用型元件、路由、狀態管理以及其他用於建置現代網頁應用程式的工具來簡化網頁開發。

[查看由不同作者編寫的 Kotlin/JS 可用框架](js-frameworks.md)。

## 加入 Kotlin/JS 社群

您可以加入官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道中，與社群和 Kotlin/JS 團隊聊天。

## 接下來

*   [設定 Kotlin/JS 專案](js-project-setup.md)
*   [執行 Kotlin/JS 專案](running-kotlin-js.md)
*   [除錯 Kotlin/JS 程式碼](js-debugging.md)
*   [在 Kotlin/JS 中執行測試](js-running-tests.md)