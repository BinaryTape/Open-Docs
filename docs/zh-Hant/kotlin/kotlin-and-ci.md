[//]: # (title: Kotlin 與 TeamCity 持續整合)

在此頁面，您將了解如何設定 [TeamCity](https://www.jetbrains.com/teamcity/) 來建置您的 Kotlin 專案。
如需 TeamCity 的更多資訊與基本知識，請參閱其[文件頁面](https://www.jetbrains.com/teamcity/documentation/)，其中包含安裝、基本組態等資訊。

Kotlin 可搭配不同的建置工具使用，因此如果您使用標準工具，例如 Ant、Maven 或 Gradle，設定 Kotlin 專案的流程與任何其他整合這些工具的語言或函式庫並無不同。
當使用 IntelliJ IDEA 的內部建置系統時，會有一些些微需求與差異，而 TeamCity 也支援此功能。

## Gradle、Maven 與 Ant

如果使用 Ant、Maven 或 Gradle，設定流程很簡單。所需的僅是定義建置步驟 (Build Step)。
例如，如果使用 Gradle，只需定義所需的參數，例如步驟名稱 (Step Name) 和需要執行以用於執行器類型 (Runner Type) 的 Gradle 任務。

<img src="teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

由於 Kotlin 所需的所有依賴項都定義在 Gradle 檔案中，因此無需專門為 Kotlin 正確執行而設定其他內容。

如果使用 Ant 或 Maven，適用相同的組態。唯一的差別在於執行器類型 (Runner Type) 分別為 Ant 或 Maven。

## IntelliJ IDEA 建置系統

如果將 IntelliJ IDEA 建置系統與 TeamCity 搭配使用，請確保 IntelliJ IDEA 使用的 Kotlin 版本與 TeamCity 執行的版本相同。您可能需要下載特定版本的 Kotlin 外掛程式 (plugin) 並安裝在 TeamCity 上。

幸運的是，已經有可用的元執行器 (meta-runner) 可以處理大部分手動工作。如果您不熟悉 TeamCity 元執行器 (meta-runner) 的概念，請參閱[文件](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html)。
它們是一種非常簡單且強大的方法，可以在無需編寫外掛程式 (plugins) 的情況下引入自訂執行器 (Runners)。

### 下載並安裝元執行器

Kotlin 的元執行器 (meta-runner) 可在 [GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity) 上取得。
下載該元執行器並從 TeamCity 使用者介面匯入

<img src="teamcity-metarunner.png" alt="Meta-runner" width="700"/>

### 設定 Kotlin 編譯器取得步驟

基本上，此步驟僅限於定義步驟名稱 (Step Name) 和您所需的 Kotlin 版本。可以使用標籤。

<img src="teamcity-setupkotlin.png" alt="Setup Kotlin Compiler" width="700"/>

該執行器會根據 IntelliJ IDEA 專案的路徑設定，將屬性 `system.path.macro.KOTLIN.BUNDLED` 的值設定為正確的值。然而，這個值需要在 TeamCity 中定義 (且可以設定為任何值)。
因此，您需要將其定義為系統變數。

### 設定 Kotlin 編譯步驟

最後一步是定義專案的實際編譯，它使用標準的 IntelliJ IDEA 執行器類型 (Runner Type)。

<img src="teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

如此一來，我們的專案現在應該可以建置並產生對應的產物 (artifacts)。

## 其他 CI 伺服器

如果使用不同於 TeamCity 的持續整合工具，只要它支援任何建置工具，或呼叫命令列工具，編譯 Kotlin 並將其自動化作為 CI 流程的一部分應該是可行的。