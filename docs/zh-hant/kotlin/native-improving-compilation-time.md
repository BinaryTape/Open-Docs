---
title: 改善編譯時間的訣竅
---
<show-structure depth="1"/>

Kotlin/Native 編譯器不斷收到更新，以提高其效能。 藉由最新的 Kotlin/Native
編譯器和正確設定的建置環境，您可以顯著縮短具有 Kotlin/Native 目標之專案的編譯時間。

請繼續閱讀我們的提示，瞭解如何加速 Kotlin/Native 編譯程序。

## 一般建議

### 使用最新版本的 Kotlin

如此一來，您始終可以獲得最新的效能改進。 最新的 Kotlin 版本為 2.1.20。

### 避免建立過大的類別

嘗試避免建立過大的類別，因為這類別需要很長時間才能編譯並在執行期間載入。

### 在建置之間保留已下載和快取的元件

編譯專案時，Kotlin/Native 會下載所需的元件，並將其部分工作結果快取到 `$USER_HOME/.konan` 目錄。 編譯器會將此目錄用於後續的
編譯，從而縮短完成時間。

在容器（例如 Docker）中或使用持續整合系統進行建置時，編譯器可能必須針對每個建置從頭開始建立 `~/.konan` 目錄。 為了避免此步驟，請設定您的環境以在建置之間保留 `~/.konan`。 例如，使用 `kotlin.data.dir` Gradle 屬性重新定義其位置。

或者，您可以使用 `-Xkonan-data-dir` 編譯器選項，透過 `cinterop` 和 `konanc` 工具設定目錄的自訂路徑。

## Gradle 設定

由於需要下載依賴項、建置快取並執行其他步驟，因此使用 Gradle 進行的第一次編譯通常比後續編譯花費更多時間。 您應該至少建置您的專案兩次，以準確讀取
實際編譯時間。

以下是一些用於設定 Gradle 以獲得更好編譯效能的建議。

### 增加 Gradle 堆積大小

若要增加 [Gradle 堆積大小](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)，
請將 `org.gradle.jvmargs=-Xmx3g` 新增至您的 `gradle.properties` 檔案。

如果您使用[並行建置](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)，
您可能需要使用 `org.gradle.workers.max` 屬性或 `--max-workers` 命令列選項來選擇正確的工作人員數量。
預設值是 CPU 處理器的數量。

### 僅建置必要的二進位檔案

除非您確實需要，否則不要執行建置整個專案的 Gradle 任務，例如 `build` 或 `assemble`。
這些任務會多次建置相同的程式碼，從而增加編譯時間。 在一般情況下，例如從 IntelliJ IDEA 執行測試或從 Xcode 啟動應用程式，Kotlin 工具會避免執行不必要的任務。

如果您有非典型的情況或建置設定，您可能需要自己選擇任務：

* `linkDebug*`。 若要在開發期間執行您的程式碼，您通常只需要一個二進位檔案，因此執行對應的
  `linkDebug*` 任務應該就足夠了。
* `embedAndSignAppleFrameworkForXcode`。 由於 iOS 模擬器和裝置具有不同的處理器架構，
  因此常見的做法是將 Kotlin/Native 二進位檔案作為通用（胖）框架來發佈。

  但是，在本地開發期間，僅針對您正在使用的平台建置 `.framework` 檔案會更快。
  若要建置平台特定的框架，請使用 [embedAndSignAppleFrameworkForXcode](multiplatform-direct-integration#connect-the-framework-to-your-project) 任務。

### 僅針對必要的目標進行建置

與上述建議類似，不要一次為所有原生
平台建置二進位檔案。 例如，編譯 [XCFramework](multiplatform-build-native-binaries#build-xcframeworks)
（使用 `*XCFramework` 任務）會為所有目標建置相同的程式碼，這會比
針對單一目標進行建置花費更多時間。

如果您的設定確實需要 XCFramework，則可以減少目標數量。
例如，如果您不在基於 Intel 的 Mac 上的 iOS 模擬器上執行此專案，則不需要 `iosX64`。

:::note
針對不同目標的二進位檔案是使用 `linkDebug*$Target` 和 `linkRelease*$Target` Gradle 任務建置的。
您可以透過在建置記錄或
[Gradle 建置掃描](https://docs.gradle.org/current/userguide/build_scans.html)中尋找已執行的任務
來使用 `--scan` 選項執行 Gradle 建置。

### 不要建置不必要的發佈版本二進位檔案

Kotlin/Native 支援兩種建置模式，[偵錯和發佈版本](multiplatform-build-native-binaries#declare-binaries)。
發佈版本經過高度最佳化，這需要花費大量時間：編譯發佈版本二進位檔案花費的時間比偵錯版本二進位檔案多一個數量級。

除了實際發佈版本之外，所有這些最佳化在典型的開發週期中可能都是不必要的。
如果您在開發過程中使用了名稱中包含 `Release` 的任務，請考慮將其替換為 `Debug`。
同樣地，您可以執行 `assembleSharedDebugXCFramework`，而不是執行 `assembleXCFramework`。

發佈版本二進位檔案是使用 `linkRelease*` Gradle 任務建置的。 您可以在建置記錄或
[Gradle 建置掃描](https://docs.gradle.org/current/userguide/build_scans.html)中檢查它們，方法是使用 `--scan` 選項執行 Gradle 建置。

### 不要停用 Gradle 守護進程 (daemon)

如果沒有充分的理由，請勿停用 [Gradle 守護進程](https://docs.gradle.org/current/userguide/gradle_daemon.html)。 依預設，[Kotlin/Native 是從 Gradle 守護進程執行的](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。
啟用後，將使用相同的 JVM 程序，並且無需為每次編譯預熱。

### 不要使用可轉移匯出 (transitive export)

在許多情況下，使用 [`transitiveExport = true`](multiplatform-build-native-binaries#export-dependencies-to-binaries) 會停用無效
程式碼消除，因此編譯器必須處理大量未使用的程式碼。 這會增加編譯時間。
相反地，請明確使用 `export` 方法來匯出所需的專案和依賴項。

### 不要過度匯出模組

嘗試避免不必要的[模組匯出](multiplatform-build-native-binaries#export-dependencies-to-binaries)。
每個匯出的模組都會對編譯時間和二進位檔案大小產生負面影響。

### 使用 Gradle 建置快取

啟用 Gradle [建置快取](https://docs.gradle.org/current/userguide/build_cache.html)功能：

* **本地建置快取**。 對於本地快取，請將 `org.gradle.caching=true` 新增至您的 `gradle.properties` 檔案，或在命令列中使用 `--build-cache` 選項執行
  建置。
* **遠端建置快取**。 瞭解如何[設定遠端建置快取](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote)
  以用於持續整合環境。

### 使用 Gradle 組態快取

若要使用 Gradle [組態快取](https://docs.gradle.org/current/userguide/configuration_cache.html)，
請將 `org.gradle.configuration-cache=true` 新增至您的 `gradle.properties` 檔案。

組態快取也支援並行執行 `link*` 任務，這可能會嚴重負載機器，
特別是對於具有大量 CPU 核心的機器。 此問題將在 [KT-70915](https://youtrack.jetbrains.com/issue/KT-70915) 中修正。

:::

### 啟用先前停用的功能

有一些 Kotlin/Native 屬性會停用 Gradle 守護進程和編譯器快取：

* `kotlin.native.disableCompilerDaemon=true`
* `kotlin.native.cacheKind=none`
* `kotlin.native.cacheKind.$target=none`，其中 `$target` 是 Kotlin/Native 編譯目標，例如 `iosSimulatorArm64`。

如果您之前遇到過這些功能的問題，並將這些行新增至您的 `gradle.properties` 檔案或 Gradle 引數，
請移除它們並檢查建置是否成功完成。 這些屬性可能先前已新增
以解決已修正的問題。

### 嘗試 klib 成品 (artifact) 的增量編譯

使用增量編譯時，如果專案模組產生的 `klib` 成品只有一部分變更，
則只會將 `klib` 的一部分重新編譯為二進位檔案。

此功能為 [實驗性](components-stability#stability-levels-explained)。 若要啟用它，
請將 `kotlin.incremental.native=true` 選項新增至您的 `gradle.properties` 檔案。 如果您遇到任何問題，
請在 [YouTrack 中建立問題](https://kotl.in/issue)。

## Windows 設定

Windows 安全性可能會降低 Kotlin/Native 編譯器的速度。 您可以透過將 `.konan` 目錄（預設位於 `%\USERPROFILE%` 中）新增至 Windows 安全性排除項目來避免此情況。 瞭解如何[將排除項目新增至 Windows 安全性](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26)。