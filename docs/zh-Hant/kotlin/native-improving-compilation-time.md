[//]: # (title: 提升編譯時間的秘訣)

<show-structure depth="1"/>

Kotlin/Native 編譯器持續接收更新，以改善其效能。透過最新的 Kotlin/Native 編譯器和正確配置的建置環境，您可以顯著改善專案中 Kotlin/Native 目標的編譯時間。

請繼續閱讀我們的秘訣，了解如何加快 Kotlin/Native 編譯過程。

## 一般建議

### 使用最新版本的 Kotlin

這樣，您總能獲得最新的效能改進。最新的 Kotlin 版本為 %kotlinVersion%。

### 避免建立龐大類別

盡量避免建立在執行時需要很長時間才能編譯和載入的龐大類別。

### 在建置之間保留下載和快取元件

編譯專案時，Kotlin/Native 會下載所需的元件，並將部分工作結果快取到 `$USER_HOME/.konan` 目錄中。編譯器使用此目錄進行後續編譯，使其完成時間縮短。

在使用容器 (例如 Docker) 或持續整合系統進行建置時，編譯器可能必須為每次建置從頭開始建立 `~/.konan` 目錄。為避免此步驟，請配置您的環境，以在建置之間保留 `~/.konan`。例如，使用 `kotlin.data.dir` Gradle 屬性重新定義其位置。

或者，您可以透過 `cinterop` 和 `konanc` 工具使用 `-Xkonan-data-dir` 編譯器選項來配置您的自訂目錄路徑。

## Gradle 配置

由於需要下載相依性、建置快取並執行額外步驟，Gradle 的首次編譯通常比後續編譯花費更多時間。您應該至少建置專案兩次，才能準確衡量實際的編譯時間。

以下是配置 Gradle 以獲得更好編譯效能的一些建議。

### 增加 Gradle 堆積大小

若要增加 [Gradle 堆積大小](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)，請將 `org.gradle.jvmargs=-Xmx3g` 加入您的 `gradle.properties` 檔案。

如果您使用[平行建置](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)，您可能需要使用 `org.gradle.workers.max` 屬性或 `--max-workers` 命令列選項來選擇正確的工作者數量。預設值是 CPU 處理器數量。

### 僅建置必要的二進位檔

除非您確實需要，否則不要執行會建置整個專案的 Gradle 任務，例如 `build` 或 `assemble`。這些任務會多次建置相同的程式碼，從而增加編譯時間。在典型情況下，例如從 IntelliJ IDEA 執行測試或從 Xcode 啟動應用程式，Kotlin 工具會避免執行不必要的任務。

如果您遇到非典型情況或建置配置，您可能需要自己選擇任務：

*   `linkDebug*`。要在開發期間執行您的程式碼，您通常只需要一個二進位檔，因此執行相應的 `linkDebug*` 任務就足夠了。
*   `embedAndSignAppleFrameworkForXcode`。由於 iOS 模擬器和裝置具有不同的處理器架構，因此將 Kotlin/Native 二進位檔作為通用 (fat) 框架分發是一種常見做法。

    然而，在本地開發期間，僅為您正在使用的平台建置 `.framework` 檔案會更快。若要建置特定平台框架，請使用 [embedAndSignAppleFrameworkForXcode](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html#connect-the-framework-to-your-project) 任務。

### 僅建置必要目標

與上述建議類似，不要一次為所有原生平台建置二進位檔。例如，編譯 [XCFramework](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#build-xcframeworks) (使用 `*XCFramework` 任務) 會為所有目標建置相同的程式碼，這比為單一目標建置花費的時間按比例更多。

如果您的設定確實需要 XCFrameworks，您可以減少目標數量。例如，如果您不在基於 Intel 的 Mac 上於 iOS 模擬器上執行此專案，則不需要 `iosX64`。

> 針對不同目標的二進位檔是透過 `linkDebug*$Target` 和 `linkRelease*$Target` Gradle 任務建置的。
> 您可以在建置日誌或透過執行帶有 `--scan` 選項的 Gradle 建置的 [Gradle 建置掃描](https://docs.gradle.org/current/userguide/build_scans.html) 中查看已執行的任務。
>
{style="tip"}

### 不要建置不必要的發布二進位檔

Kotlin/Native 支援兩種建置模式：[除錯和發布](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#declare-binaries)。發布版本高度優化，這需要大量時間：發布二進位檔的編譯時間比除錯二進位檔的編譯時間多一個數量級。

除了實際發布之外，在典型開發週期中，所有這些優化可能都是不必要的。如果您在開發過程中使用了名稱中帶有 `Release` 的任務，請考慮將其替換為 `Debug`。同樣地，除了執行 `assembleXCFramework`，您可以執行 `assembleSharedDebugXCFramework`，例如。

> 發布二進位檔是透過 `linkRelease*` Gradle 任務建置的。您可以在建置日誌或透過執行帶有 `--scan` 選項的 Gradle 建置的 [Gradle 建置掃描](https://docs.gradle.org/current/userguide/build_scans.html) 中查看它們。
>
{style="tip"}

### 不要停用 Gradle 精靈

沒有充分理由，不要停用 [Gradle 精靈](https://docs.gradle.org/current/userguide/gradle_daemon.html)。預設情況下，[Kotlin/Native 從 Gradle 精靈執行](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。當它啟用時，使用相同的 JVM 程序，並且不需要為每次編譯預熱它。

### 不要使用傳遞性匯出

使用 [`transitiveExport = true`](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#export-dependencies-to-binaries) 在許多情況下會停用無用代碼消除，因此編譯器必須處理大量未使用的代碼。這會增加編譯時間。相反，請明確使用 `export` 方法來匯出所需的專案和相依性。

### 不要過度匯出模組

盡量避免不必要的[模組匯出](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#export-dependencies-to-binaries)。每個匯出的模組都會對編譯時間和二進位檔大小產生負面影響。

### 使用 Gradle 建置快取

啟用 Gradle [建置快取](https://docs.gradle.org/current/userguide/build_cache.html) 功能：

*   **本地建置快取**。對於本地快取，請將 `org.gradle.caching=true` 加入您的 `gradle.properties` 檔案，或在命令列中執行帶有 `--build-cache` 選項的建置。
*   **遠端建置快取**。了解如何[配置遠端建置快取](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote)以用於持續整合環境。

### 使用 Gradle 配置快取

若要使用 Gradle [配置快取](https://docs.gradle.org/current/userguide/configuration_cache.html)，請將 `org.gradle.configuration-cache=true` 加入您的 `gradle.properties` 檔案。

> 配置快取還允許平行執行 `link*` 任務，這可能會嚴重負載機器，特別是當 CPU 核心數很多時。此問題將在 [KT-70915](https://youtrack.jetbrains.com/issue/KT-70915) 中修復。
>
{style="note"}

### 啟用先前停用的功能

有一些 Kotlin/Native 屬性會停用 Gradle 精靈和編譯器快取：

*   `kotlin.native.disableCompilerDaemon=true`
*   `kotlin.native.cacheKind=none`
*   `kotlin.native.cacheKind.$target=none`，其中 `$target` 是 Kotlin/Native 編譯目標，例如 `iosSimulatorArm64`。

如果您之前在這些功能方面遇到問題，並將這些行加入您的 `gradle.properties` 檔案或 Gradle 參數中，請將其刪除並檢查建置是否成功完成。這些屬性可能是在以前為解決已修復的問題而添加的。

### 嘗試 KLib Artifact 的增量編譯

透過增量編譯，如果專案模組產生的 `klib` artifact 只有部分變更，則只有 `klib` 的部分會進一步重新編譯成二進位檔。

此功能為[實驗性](components-stability.md#stability-levels-explained)。若要啟用它，請將 `kotlin.incremental.native=true` 選項加入您的 `gradle.properties` 檔案。如果您遇到任何問題，請在 [YouTrack 中建立問題](https://kotl.in/issue)。

## Windows 配置

Windows 安全性可能會減慢 Kotlin/Native 編譯器。您可以透過將預設位於 `%\USERPROFILE%` 的 `.konan` 目錄加入 Windows 安全性排除項目來避免此問題。了解如何[將排除項目加入 Windows 安全性](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26)。