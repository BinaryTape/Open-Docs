[//]: # (title: Kotlin 與 TeamCity 的持續整合)

在此頁面中，您將學習如何設定 [TeamCity](https://www.jetbrains.com/teamcity/) 來組建您的 Kotlin 專案。
如需更多資訊和 TeamCity 的基礎知識，請查看 [文件頁面](https://www.jetbrains.com/teamcity/documentation/)，其中包含有關安裝、基本配置等資訊。

Kotlin 可搭配不同的建置工具使用，因此如果您使用的是 Maven 或 Gradle 等標準工具，設定 Kotlin 專案的流程與整合這些工具的其他語言或程式庫並無二致。
在使用 IntelliJ IDEA 的內部組建系統時，會有一些微小的需求和差異，TeamCity 也支援該系統。

## Gradle 與 Maven

如果使用 Maven 或 Gradle，設定流程非常簡單。只需要定義建置步驟即可。
例如，如果使用 Gradle，只需為 Runner Type 定義所需的參數，例如 Step Name 和需要執行的 Gradle 任務（tasks）。

<img src="teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

由於 Kotlin 所需的所有相依性都已在 Gradle 檔案中定義，因此不需要為了讓 Kotlin 正確執行而進行任何額外的特定設定。

如果使用 Maven，適用相同的配置。唯一的區別在於 Runner Type 將會是 Maven。

## IntelliJ IDEA 組建系統

如果將 IntelliJ IDEA 組建系統與 TeamCity 搭配使用，請確保 IntelliJ IDEA 使用的 Kotlin 版本與 TeamCity 執行的版本相同。您可能需要下載特定版本的 Kotlin 外掛程式並將其安裝在 TeamCity 上。

幸運的是，目前已有一個 Meta-runner 可以處理大部分的手動工作。如果您不熟悉 TeamCity Meta-runner 的概念，請參閱 [文件](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html)。它們是引入自訂 Runner 的一種非常簡單且強大的方式，無需編寫外掛程式。

### 下載並安裝 Meta-runner

Kotlin 的 Meta-runner 可在 [GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity) 上取得。
下載該 Meta-runner 並從 TeamCity 使用者介面匯入

<img src="teamcity-metarunner.png" alt="Meta-runner" width="700"/>

### 設定 Kotlin 編譯器獲取步驟

基本上，此步驟僅限於定義 Step Name 和您所需的 Kotlin 版本。可以使用標籤。

<img src="teamcity-setupkotlin.png" alt="Setup Kotlin Compiler" width="700"/>

執行器會根據 IntelliJ IDEA 專案的路徑設定，將屬性 `system.path.macro.KOTLIN.BUNDLED` 的值設定為正確的值。然而，這個值必須在 TeamCity 中定義（且可以設定為任何值）。
因此，您需要將其定義為系統變數。

### 設定 Kotlin 編譯步驟

最後一個步驟是定義專案的實際編譯，這會使用標準的 IntelliJ IDEA Runner Type。

<img src="teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

至此，我們的專案現在應該可以組建並產出對應的建置產物。

## 其他 CI 伺服器

如果使用與 TeamCity 不同的持續整合工具，只要它支援任何建置工具或呼叫命令列工具，就應該可以編譯 Kotlin 並將自動化作業作為 CI 流程的一部分。