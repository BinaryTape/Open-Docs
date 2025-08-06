[//]: # (title: Kotlin 與 TeamCity 的持續整合)

在本頁面中，您將學習如何設定 [TeamCity](https://www.jetbrains.com/teamcity/) 以建置您的 Kotlin 專案。有關 TeamCity 的更多資訊和基礎知識，請參閱 [文件頁面](https://www.jetbrains.com/teamcity/documentation/)，其中包含安裝、基本配置等資訊。

Kotlin 可與不同的建置工具協同運作，因此如果您使用 Ant、Maven 或 Gradle 等標準工具，設定 Kotlin 專案的過程與任何其他與這些工具整合的語言或程式庫並無不同。當使用 IntelliJ IDEA 的內部建置系統時（TeamCity 也支援此系統），會有一些細微的要求和差異。

## Gradle、Maven 和 Ant

如果使用 Ant、Maven 或 Gradle，設定過程非常簡單。所需的僅是定義「建置步驟 (Build Step)」。例如，如果使用 Gradle，只需為「執行器類型 (Runner Type)」定義所需的參數，例如「步驟名稱 (Step Name)」和需要執行的 Gradle 任務。

<img src="teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

由於 Kotlin 所需的所有依賴項都已在 Gradle 檔案中定義，因此無需為 Kotlin 的正確執行進行其他特定配置。

如果使用 Ant 或 Maven，適用相同的配置。唯一的區別是「執行器類型 (Runner Type)」將分別為 Ant 或 Maven。

## IntelliJ IDEA 建置系統

如果將 IntelliJ IDEA 建置系統與 TeamCity 搭配使用，請確保 IntelliJ IDEA 使用的 Kotlin 版本與 TeamCity 執行的版本相同。您可能需要下載特定版本的 Kotlin 外掛程式並將其安裝到 TeamCity 上。

幸運的是，已經有一個「元執行器 (meta-runner)」可用，可以處理大部分手動工作。如果對 TeamCity 的元執行器概念不熟悉，請查閱 [文件](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html)。它們是一種非常簡單且強大的方式，無需編寫外掛程式即可引入自訂「執行器 (Runners)」。

### 下載並安裝元執行器

Kotlin 的元執行器可在 [GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity) 上取得。下載該元執行器並從 TeamCity 使用者介面匯入。

<img src="teamcity-metarunner.png" alt="Meta-runner" width="700"/>

### 設定 Kotlin 編譯器抓取步驟

基本上，此步驟僅限於定義「步驟名稱 (Step Name)」和所需的 Kotlin 版本。可以使用標籤。

<img src="teamcity-setupkotlin.png" alt="Setup Kotlin Compiler" width="700"/>

執行器將根據 IntelliJ IDEA 專案的路徑設定，將屬性 `system.path.macro.KOTLIN.BUNDLED` 的值設定為正確的值。然而，這個值需要在 TeamCity 中定義（並且可以設定為任何值）。因此，您需要將其定義為系統變數。

### 設定 Kotlin 編譯步驟

最後一步是定義專案的實際編譯，這使用了標準的 IntelliJ IDEA 「執行器類型 (Runner Type)」。

<img src="teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

有了這些，我們的專案現在應該能夠建置並產生對應的構件。

## 其他 CI 伺服器

如果使用不同於 TeamCity 的持續整合工具，只要它支援任何建置工具或呼叫命令列工具，那麼編譯 Kotlin 並自動化 CI 過程中的事項應該是可行的。