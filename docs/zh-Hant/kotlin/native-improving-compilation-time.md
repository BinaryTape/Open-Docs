[//]: # (title: 改善編譯時間的提示)

<show-structure depth="1"/>

Kotlin/Native 編譯器不斷接收更新，以提升其效能。藉由最新的 Kotlin/Native 編譯器和正確配置的建置環境，您可以顯著改善使用 Kotlin/Native 目標的專案之編譯時間。

請繼續閱讀我們關於如何加速 Kotlin/Native 編譯過程的提示。

## 一般建議

### 使用最新版本的 Kotlin

這樣，您將始終獲得最新的效能改進。最新的 Kotlin 版本為 %kotlinVersion%。

### 避免建立龐大的類別

盡量避免建立在編譯和執行載入時需要很長時間的龐大類別。

### 在建置之間保留已下載和快取的元件

在編譯專案時，Kotlin/Native 會下載所需的元件，並將其部分工作結果快取到 `$USER_HOME/.konan` 目錄。編譯器使用此目錄進行後續編譯，使其花費較少時間完成。

在容器（例如 Docker）或持續整合系統中建置時，編譯器可能必須為每次建置從頭建立 `~/.konan` 目錄。為避免此步驟，請配置您的環境以在建置之間保留 `~/.konan`。例如，使用 `kotlin.data.dir` Gradle 屬性重新定義其位置。

或者，您可以使用 `-Xkonan-data-dir` 編譯器選項，透過 `cinterop` 和 `konanc` 工具配置您自訂的目錄路徑。

## Gradle 配置

由於需要下載依賴項、建置快取並執行額外步驟，使用 Gradle 的首次編譯通常比後續編譯花費更多時間。您應至少建置您的專案兩次，以獲得實際編譯時間的準確讀數。

以下是關於如何配置 Gradle 以獲得更好編譯效能的一些建議。

### 增加 Gradle 堆積大小

要增加 [Gradle 堆積大小](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)，請將 `org.gradle.jvmargs=-Xmx3g` 加入您的 `gradle.properties` 檔案中。

如果您使用 [平行建置](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)，您可能需要使用 `org.gradle.workers.max` 屬性或 `--max-workers` 命令列選項來選擇合適的工作者數量。預設值為 CPU 處理器數量。

### 僅建置必要的二進位檔

除非您確實需要，否則不要執行會建置整個專案的 Gradle 任務，例如 `build` 或 `assemble`。這些任務會多次建置相同的程式碼，從而增加編譯時間。在典型情況下，例如從 IntelliJ IDEA 執行測試或從 Xcode 啟動應用程式時，Kotlin 工具會避免執行不必要的任務。

如果您有非典型情況或建置配置，您可能需要自行選擇任務：

*   `linkDebug*`。在開發期間執行您的程式碼時，您通常只需要一個二進位檔，因此執行對應的 `linkDebug*` 任務應該就足夠了。
*   `embedAndSignAppleFrameworkForXcode`。由於 iOS 模擬器和裝置具有不同的處理器架構，因此將 Kotlin/Native 二進位檔作為通用 (fat) 框架發布是一種常見方法。

    然而，在本地開發期間，僅為您使用的平台建置 `.framework` 檔案會更快。要建置特定平台框架，請使用 [embedAndSignAppleFrameworkForXcode](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html#connect-the-framework-to-your-project) 任務。

### 僅為必要的目標建置

與上述建議類似，不要一次為所有原生平台建置二進位檔。例如，編譯 [XCFramework](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#build-xcframeworks)（使用 `*XCFramework` 任務）會為所有目標建置相同的程式碼，這會比為單一目標建置花費成比例更多的時間。

如果您的設定確實需要 XCFramework，您可以減少目標數量。例如，如果您不在基於 Intel 的 Mac 上的 iOS 模擬器上執行此專案，則不需要 `iosX64`。

> 針對不同目標的二進位檔是透過 `linkDebug*$Target` 和 `linkRelease*$Target` Gradle 任務建置的。您可以透過執行帶有 `--scan` 選項的 Gradle 建置來在建置日誌或 [Gradle 建置掃描](https://docs.gradle.org/current/userguide/build_scans.html)中查找已執行的任務。
>
{style="tip"}

### 不要建置不必要的發行二進位檔

Kotlin/Native 支援兩種建置模式：[偵錯和發行](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#declare-binaries)。發行模式經過高度最佳化，這會花費大量時間：編譯發行二進位檔所花費的時間比偵錯二進位檔高一個數量級。

除了實際發行之外，在典型的開發週期中，所有這些最佳化可能是不必要的。如果您在開發過程中使用了名稱中包含 `Release` 的任務，請考慮將其替換為 `Debug`。同樣地，您可以執行 `assembleSharedDebugXCFramework`，而不是執行 `assembleXCFramework`。

> 發行二進位檔是透過 `linkRelease*` Gradle 任務建置的。您可以透過執行帶有 `--scan` 選項的 Gradle 建置，在建置日誌或 [Gradle 建置掃描](https://docs.gradle.org/current/userguide/build_scans.html)中檢查它們。
>
{style="tip"}

### 不要停用 Gradle 守護程式

如果沒有充分理由，不要停用 [Gradle 守護程式](https://docs.gradle.org/current/userguide/gradle_daemon.html)。預設情況下，[Kotlin/Native 從 Gradle 守護程式運行](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。當它啟用時，會使用相同的 JVM 程序，並且無需為每次編譯預熱它。

### 不要使用傳遞式匯出

使用 [`transitiveExport = true`](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#export-dependencies-to-binaries) 在許多情況下會停用死碼消除，因此編譯器必須處理大量未使用的程式碼。這會增加編譯時間。相反地，請明確使用 `export` 方法來匯出所需的專案和依賴項。

### 不要過度匯出模組

盡量避免不必要的 [模組匯出](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#export-dependencies-to-binaries)。每個匯出的模組都會對編譯時間和二進位檔大小產生負面影響。

### 使用 Gradle 建置快取

啟用 Gradle [建置快取](https://docs.gradle.org/current/userguide/build_cache.html)功能：

*   **本地建置快取**。對於本地快取，請將 `org.gradle.caching=true` 加入您的 `gradle.properties` 檔案中，或在命令列中執行帶有 `--build-cache` 選項的建置。
*   **遠端建置快取**。了解如何為持續整合環境 [配置遠端建置快取](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote)。

### 使用 Gradle 配置快取

要使用 Gradle [配置快取](https://docs.gradle.org/current/userguide/configuration_cache.html)，請將 `org.gradle.configuration-cache=true` 加入您的 `gradle.properties` 檔案中。

> 配置快取還支援平行執行 `link*` 任務，這可能會嚴重負載機器，特別是在 CPU 核心數量很多的情況下。此問題將在 [KT-70915](https://youtrack.jetbrains.com/issue/KT-70915) 中修復。
>
{style="note"}

### 啟用先前已禁用的功能

有 Kotlin/Native 屬性可以停用 Gradle 守護程式和編譯器快取：

*   `kotlin.native.disableCompilerDaemon=true`
*   `kotlin.native.cacheKind=none`
*   `kotlin.native.cacheKind.$target=none`，其中 `$target` 是 Kotlin/Native 編譯目標，例如 `iosSimulatorArm64`。

如果您之前遇到這些功能的問題，並將這些行加入您的 `gradle.properties` 檔案或 Gradle 參數中，請移除它們並檢查建置是否成功完成。這些屬性可能是在之前為了解決已修復的問題而添加的。

### 嘗試 klib 構件的增量編譯

透過增量編譯，如果專案模組產生的 `klib` 構件只有一部分發生變化，那麼只有 `klib` 的一部分會被進一步重新編譯為二進位檔。

此功能為[實驗性](components-stability.md#stability-levels-explained)。要啟用它，請將 `kotlin.incremental.native=true` 選項加入您的 `gradle.properties` 檔案中。如果您遇到任何問題，請在 [YouTrack](https://kotl.in/issue) 中建立一個議題。

## Windows 配置

Windows 安全性可能會減慢 Kotlin/Native 編譯器的速度。您可以透過將預設位於 `%\USERPROFILE%` 的 `.konan` 目錄加入 Windows 安全性排除項來避免此問題。了解如何[將排除項加入 Windows 安全性](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26)。

## LLVM 配置
<primary-label ref="advanced"/>

如果上述提示未能改善編譯時間，請考慮[自訂 LLVM 後端](native-llvm-passes.md)。