---
title: "Kotlin 和使用 TeamCity 的持續整合 (Continuous Integration)"
---
在本頁面中，您將學習如何設定 [TeamCity](https://www.jetbrains.com/teamcity/) 以建置您的 Kotlin 專案。
有關 TeamCity 的更多資訊和基礎知識，請查看[文件頁面](https://www.jetbrains.com/teamcity/documentation/)，
其中包含有關安裝、基本配置等的資訊。

Kotlin 適用於不同的建置工具，因此，如果您使用的是 Ant、Maven 或 Gradle 等標準工具，
則設定 Kotlin 專案的流程與整合這些工具的任何其他語言或程式庫沒有什麼不同。
當使用 IntelliJ IDEA 的內部建置系統時，會有一些小的要求和差異，
TeamCity 也支援該系統。

## Gradle、Maven 和 Ant

如果使用 Ant、Maven 或 Gradle，設定過程非常簡單。 所有需要做的就是定義建置步驟（Build Step）。
例如，如果使用 Gradle，只需定義所需的參數，例如步驟名稱和需要為 Runner Type 執行的 Gradle 任務。

<img src="/img/teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

由於 Kotlin 所需的所有依賴項都在 Gradle 檔案中定義，因此無需針對 Kotlin 進行任何其他配置即可正確執行。

如果使用 Ant 或 Maven，則應用相同的配置。 唯一的區別是 Runner Type 分別為 Ant 或 Maven。

## IntelliJ IDEA 建置系統

如果將 IntelliJ IDEA 建置系統與 TeamCity 結合使用，請確保 IntelliJ IDEA 使用的 Kotlin 版本
與 TeamCity 執行的版本相同。 您可能需要下載特定版本的 Kotlin 外掛程式（plugin）
並將其安裝在 TeamCity 上。

幸運的是，已經有一個 meta-runner 可用，它可以處理大部分手動工作。 如果不熟悉
TeamCity meta-runner 的概念，請查看[文件](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html)。
它們是一種非常簡單且強大的方式來引入自訂 Runner，而無需編寫外掛程式。

### 下載並安裝 meta-runner

Kotlin 的 meta-runner 可在 [GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity) 上取得。
下載該 meta-runner 並從 TeamCity 使用者介面導入它

<img src="/img/teamcity-metarunner.png" alt="Meta-runner" width="700"/>

### 設定 Kotlin 編譯器提取步驟

基本上，此步驟僅限於定義步驟名稱和所需的 Kotlin 版本。 可以使用標籤（Tags）。

<img src="/img/teamcity-setupkotlin.png" alt="Setup Kotlin Compiler" width="700"/>

runner 將根據 IntelliJ IDEA 專案中的路徑設定，將屬性 `system.path.macro.KOTLIN.BUNDLED` 的值設定為正確的值。
但是，需要在 TeamCity 中定義此值（並且可以將其設定為任何值）。
因此，您需要將其定義為系統變數。

### 設定 Kotlin 編譯步驟

最後一步是定義專案的實際編譯，它使用標準的 IntelliJ IDEA Runner Type。

<img src="/img/teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

這樣，我們的專案現在應該可以建置並產生相應的構件（artifacts）。

## 其他 CI 伺服器

如果使用與 TeamCity 不同的持續整合工具，只要它支援任何建置工具，
或呼叫命令列工具，就應該可以編譯 Kotlin 並自動執行 CI 流程中的事務。