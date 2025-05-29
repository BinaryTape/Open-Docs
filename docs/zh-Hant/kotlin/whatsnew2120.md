[//]: # (title: Kotlin 2.1.20 最新功能)

_[發佈日期：2025 年 3 月 20 日](releases.md#release-details)_

Kotlin 2.1.20 版本現已推出！以下為主要亮點：

*   **K2 編譯器更新**：[新的 kapt 和 Lombok 外掛程式更新](#kotlin-k2-compiler)
*   **Kotlin Multiplatform**：[取代 Gradle Application 外掛程式的新 DSL](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
*   **Kotlin/Native**：[支援 Xcode 16.3 和新的內聯優化](#kotlin-native)
*   **Kotlin/Wasm**：[預設自訂格式化程式、支援 DWARF 以及遷移至 Provider API](#kotlin-wasm)
*   **Gradle 支援**：[與 Gradle 的隔離專案 (Isolated Projects) 和自訂發佈變體 (publication variants) 相容](#gradle)
*   **標準函式庫**：[通用原子類型、改進的 UUID 支援以及新的時間追蹤功能](#standard-library)
*   **Compose 編譯器**：[@Composable 函數的限制放寬及其他更新](#compose-compiler)
*   **說明文件**：[Kotlin 說明文件的顯著改進](#documentation-updates)。

## IDE 支援

支援 2.1.20 的 Kotlin 外掛程式已捆綁在最新的 IntelliJ IDEA 和 Android Studio 中。
您無需在 IDE 中更新 Kotlin 外掛程式。
您只需在建置腳本中將 Kotlin 版本變更為 2.1.20。

詳情請參閱 [更新至新版本](releases.md#update-to-a-new-kotlin-version)。

### 在支援 OSGi 的專案中下載 Kotlin 構件 (artifacts) 的來源

`kotlin-osgi-bundle` 函式庫所有相依性的來源現已包含在其發佈版本中。這允許
IntelliJ IDEA 下載這些來源，以提供 Kotlin 符號的說明文件並改進除錯體驗。

## Kotlin K2 編譯器

我們持續改進對新的 Kotlin K2 編譯器的外掛程式支援。此版本帶來了新的 kapt
和 Lombok 外掛程式的更新。

### 新的預設 kapt 外掛程式
<primary-label ref="beta"/>

從 Kotlin 2.1.20 開始，kapt 編譯器外掛程式的 K2 實作預設對所有專案啟用。

JetBrains 團隊早在 Kotlin 1.9.20 中就與 K2 編譯器一起推出了 kapt 外掛程式的新實作。
從那時起，我們進一步開發了 K2 kapt 的內部實作，並使其行為與 K1 版本相似，
同時也顯著提高了其效能。

如果您在使用 kapt 和 K2 編譯器時遇到任何問題，
您可以暫時回復到先前的外掛程式實作。

為此，請將以下選項新增至您專案的 `gradle.properties` 檔案中：

```kotlin
kapt.use.k2=false
```

請向我們的 [問題追蹤器](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback) 報告任何問題。

### Lombok 編譯器外掛程式：支援 `@SuperBuilder` 和 `@Builder` 的更新
<primary-label ref="experimental-general"/>

[Kotlin Lombok 編譯器外掛程式](lombok.md) 現已支援 `@SuperBuilder` 註解，使
建立類別階層的建構器變得更加容易。此前，在 Kotlin 中使用 Lombok 的開發人員在處理
繼承時必須手動定義建構器。藉由 `@SuperBuilder`，建構器會自動繼承父類別欄位，
讓您可以在建構物件時初始化它們。

此外，此更新還包含多項改進和錯誤修正：

*   `@Builder` 註解現在可用於建構函式，允許更靈活地建立物件。如需更多詳細資訊，
    請參閱對應的 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-71547)。
*   已解決與 Lombok 在 Kotlin 中的程式碼產生相關的幾個問題，提高了整體相容性。
    如需更多詳細資訊，請參閱 [GitHub 變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)。

有關 `@SuperBuilder` 註解的更多資訊，請參閱官方 [Lombok 說明文件](https://projectlombok.org/features/experimental/SuperBuilder)。

## Kotlin Multiplatform：取代 Gradle Application 外掛程式的新 DSL
<primary-label ref="experimental-opt-in"/>

從 Gradle 8.7 開始，[Application](https://docs.gradle.org/current/userguide/application_plugin.html) 外掛程式
不再與 Kotlin Multiplatform Gradle 外掛程式相容。Kotlin 2.1.20 引入了一個實驗性的
DSL 來實現類似的功能。新的 `executable {}` 區塊為 JVM 目標設定執行任務和 Gradle
[發佈版本 (distributions)](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)。

在建置腳本中的 `executable {}` 區塊之前，新增以下 `@OptIn` 註解：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

例如：

```kotlin
kotlin {
    jvm {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        binaries {
            // Configures a JavaExec task named "runJvm" and a Gradle distribution for the "main" compilation in this target
            executable {
                mainClass.set("foo.MainKt")
            }

            // Configures a JavaExec task named "runJvmAnother" and a Gradle distribution for the "main" compilation
            executable(KotlinCompilation.MAIN_COMPILATION_NAME, "another") {
                // Set a different class
                mainClass.set("foo.MainAnotherKt")
            }

            // Configures a JavaExec task named "runJvmTest" and a Gradle distribution for the "test" compilation
            executable(KotlinCompilation.TEST_COMPILATION_NAME) {
                mainClass.set("foo.MainTestKt")
            }

            // Configures a JavaExec task named "runJvmTestAnother" and a Gradle distribution for the "test" compilation
            executable(KotlinCompilation.TEST_COMPILATION_NAME, "another") {
                mainClass.set("foo.MainAnotherTestKt")
            }
        }
    }
}
```

在此範例中，Gradle 的 [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)
外掛程式會套用於第一個 `executable {}` 區塊。

如果您遇到任何問題，請在我們的 [問題追蹤器](https://kotl.in/issue) 中報告，或在我們的 [公開 Slack 頻道](https://kotlinlang.slack.com/archives/C19FD9681) 中告知我們。

## Kotlin/Native

### 支援 Xcode 16.3

從 Kotlin **2.1.21** 開始，Kotlin/Native 編譯器支援 Xcode 16.3 – 最新穩定版本 Xcode。
您可以隨意更新 Xcode，並繼續在 Apple 作業系統上開發您的 Kotlin 專案。

2.1.21 版本也修復了相關的 [cinterop 問題](https://youtrack.jetbrains.com/issue/KT-75781/)，該問題導致
Kotlin Multiplatform 專案中的編譯失敗。

### 新的內聯 (inlining) 優化
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 引入了一個新的內聯 (inlining) 優化過程，它在實際程式碼產生階段之前進行。

Kotlin/Native 編譯器中的新內聯過程應比標準 LLVM 內聯器執行得更好，並提高
產生程式碼的執行時效能。

新的內聯過程目前為 [實驗性 (Experimental)](components-stability.md#stability-levels-explained)。若要試用，
請使用以下編譯器選項：

```none
-Xbinary=preCodegenInlineThreshold=40
```

我們的實驗顯示，將閾值設定為 40 個標記 (編譯器解析的程式碼單元) 為編譯優化提供了合理的
折衷方案。根據我們的基準測試，這提供了 9.5% 的整體效能提升。
當然，您也可以嘗試其他值。

如果您遇到二進位檔案大小增加或編譯時間增加的問題，請透過 [YouTrack](https://kotl.in/issue) 報告此類問題。

## Kotlin/Wasm

此版本改進了 Kotlin/Wasm 的除錯和屬性使用。自訂格式化程式現在在開發
建置中可以直接使用，而 DWARF 除錯則有助於程式碼檢查。此外，Provider API 簡化了
Kotlin/Wasm 和 Kotlin/JS 中的屬性使用。

### 自訂格式化程式預設啟用

此前，您必須 [手動設定](whatsnew21.md#improved-debugging-experience-for-kotlin-wasm) 自訂格式化程式
以在處理 Kotlin/Wasm 程式碼時改進網頁瀏覽器中的除錯。

在此版本中，自訂格式化程式在開發建置中預設啟用，因此您不需要額外的 Gradle
設定。

若要使用此功能，您只需確保瀏覽器開發人員工具中已啟用自訂格式化程式：

*   在 Chrome DevTools 中，於 **設定 | 偏好設定 | 主控台 (Settings | Preferences | Console)** 中找到自訂格式化程式核取方塊：

    ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=400}

*   在 Firefox DevTools 中，於 **設定 | 進階設定 (Settings | Advanced settings)** 中找到自訂格式化程式核取方塊：

    ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=400}

此變更主要影響 Kotlin/Wasm 的開發建置。如果您對生產建置有特定要求，
則需要相應地調整 Gradle 設定。為此，請將以下編譯器選項新增至 `wasmJs {}` 區塊：

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        // ...

        compilerOptions {
            freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
        }
    }
}
```

### 支援 DWARF 以除錯 Kotlin/Wasm 程式碼

Kotlin 2.1.20 在 Kotlin/Wasm 中引入了對 DWARF (任意記錄格式除錯) 的支援。

透過此變更，Kotlin/Wasm 編譯器能夠將 DWARF 資料嵌入到產生的 WebAssembly (Wasm) 二進位檔案中。
許多除錯器和虛擬機器可以讀取此資料，以提供對已編譯程式碼的深入了解。

DWARF 主要用於在獨立的 Wasm 虛擬機器 (VM) 內部除錯 Kotlin/Wasm 應用程式。若要使用此
功能，Wasm VM 和除錯器必須支援 DWARF。

藉由 DWARF 支援，您可以逐步執行 Kotlin/Wasm 應用程式、檢查變數並獲得程式碼洞察力。若要啟用
此功能，請使用以下編譯器選項：

```bash
-Xwasm-generate-dwarf
```
### 遷移至 Provider API 以用於 Kotlin/Wasm 和 Kotlin/JS 屬性

此前，Kotlin/Wasm 和 Kotlin/JS 擴充功能中的屬性是可變的 (`var`)，並直接在建置腳本中指定：

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

現在，屬性透過 [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html) 公開，
您必須使用 `.set()` 函數來指定值：

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API 確保值是惰性計算的，並與任務相依性正確整合，從而提高建置效能。

透過此變更，直接屬性指定已棄用，轉而使用 `*EnvSpec` 類別，
例如 `NodeJsEnvSpec` 和 `YarnRootEnvSpec`。

此外，已移除幾個別名任務以避免混淆：

| 已棄用任務        | 替代方案                                                     |
|------------------------|-----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` 或 `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` 或 `jsBrowserDistribution`         |

如果您僅在建置腳本中使用 Kotlin/JS 或 Kotlin/Wasm，則無需採取任何動作，因為 Gradle 會自動處理指定。

但是，如果您維護一個基於 Kotlin Gradle 外掛程式的外掛程式，並且您的外掛程式不套用 `kotlin-dsl`，
則必須更新屬性指定以使用 `.set()` 函數。

## Gradle

Kotlin 2.1.20 與 Gradle 7.6.3 到 8.11 完全相容。您也可以使用直到最新 Gradle 版本的 Gradle。
但是，請注意，這樣做可能會導致棄用警告，並且某些新的 Gradle 功能可能無法運作。

此版本的 Kotlin 包含 Kotlin Gradle 外掛程式與 Gradle 的隔離專案 (Isolated Projects) 的相容性，以及對自訂 Gradle 發佈變體 (publication variants) 的支援。

### Kotlin Gradle 外掛程式與 Gradle 的隔離專案 (Isolated Projects) 相容
<primary-label ref="experimental-opt-in"/>

> 此功能目前在 Gradle 中處於預 Alpha 狀態。目前不支援 JS 和 Wasm 目標。
> 僅搭配 Gradle 8.10 或更高版本使用，且僅用於評估目的。
>
{style="warning"}

自 Kotlin 2.1.0 起，您已能夠在專案中 [預覽 Gradle 的隔離專案功能](whatsnew21.md#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

此前，您必須設定 Kotlin Gradle 外掛程式，才能使您的專案與隔離專案功能相容。
在 Kotlin 2.1.20 中，不再需要此額外步驟。

現在，要啟用隔離專案功能，您只需要 [設定系統屬性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。

Kotlin Gradle 外掛程式支援 Gradle 的隔離專案功能，適用於多平台專案以及僅包含 JVM 或 Android 目標的專案。

具體而言，對於多平台專案，如果您在升級後發現 Gradle 建置有問題，可以透過新增以下內容來選擇退出新的 Kotlin Gradle 外掛程式行為：

```none
kotlin.kmp.isolated-projects.support=disable
```

但是，如果您在多平台專案中使用此 Gradle 屬性，則無法使用隔離專案功能。

請透過 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 告知我們您對此功能的體驗。

### 支援新增自訂 Gradle 發佈變體 (publication variants)
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 引入了對新增自訂 [Gradle 發佈變體 (publication variants)](https://docs.gradle.org/current/userguide/variant_attributes.html) 的支援。
此功能適用於多平台專案和目標 JVM 的專案。

> 您無法使用此功能修改現有的 Gradle 變體。
>
{style="note"}

此功能為 [實驗性 (Experimental)](components-stability.md#stability-levels-explained)。
若要啟用，請使用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 註解。

若要新增自訂 Gradle 發佈變體，請呼叫 `adhocSoftwareComponent()` 函數，它會傳回
[`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html) 的實例，
您可以在 Kotlin DSL 中設定它：

```kotlin
plugins {
    // Only JVM and Multiplatform are supported
    kotlin("jvm")
    // or
    kotlin("multiplatform")
}

kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    publishing {
        // Returns an instance of AdhocSoftwareComponent
        adhocSoftwareComponent()
        // Alternatively, you can configure AdhocSoftwareComponent in the DSL block as follows
        adhocSoftwareComponent {
            // Add your custom variants here using the AdhocSoftwareComponent API
        }
    }
}
```

> 有關變體的更多資訊，請參閱 Gradle 的 [自訂發佈指南](https://docs.gradle.org/current/userguide/publishing_customization.html)。
>
{style="tip"}

## 標準函式庫

此版本為標準函式庫帶來了新的實驗性功能：通用原子類型、改進的 UUID 支援以及新的時間追蹤功能。

### 通用原子類型
<primary-label ref="experimental-opt-in"/>

在 Kotlin 2.1.20 中，我們在標準函式庫的 `kotlin.concurrent.atomics`
套件中引入了通用原子類型，為執行緒安全操作啟用共享、平台獨立的程式碼。
這透過消除在不同原始碼集 (source sets) 中複製依賴原子操作的邏輯的需求，簡化了 Kotlin Multiplatform 專案的開發。

`kotlin.concurrent.atomics` 套件及其屬性為 [實驗性 (Experimental)](components-stability.md#stability-levels-explained)。
若要啟用，請使用 `@OptIn(ExperimentalAtomicApi::class)` 註解或編譯器選項 `-opt-in=kotlin.ExperimentalAtomicApi`。

以下範例說明如何使用 `AtomicInt` 在多個執行緒中安全地計數已處理的項目：

```kotlin
// 匯入必要的函式庫
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
suspend fun main() {
    // 初始化已處理項目的原子計數器
    var processedItems = AtomicInt(0)
    val totalItems = 100
    val items = List(totalItems) { "item$it" }
    // 將項目分割成區塊，供多個協程 (coroutines) 處理
    val chunkSize = 20
    val itemChunks = items.chunked(chunkSize)
    coroutineScope {
        for (chunk in itemChunks) {
            launch {
                for (item in chunk) {
                    println("Processing $item in thread ${Thread.currentThread()}")
                    processedItems += 1 // 以原子方式遞增計數器
                }
            }
         }
    }
//sampleEnd
    // 列印已處理的項目總數
    println("Total processed items: ${processedItems.load()}")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

為了在 Kotlin 的原子類型與 Java 的 [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html)
原子類型之間實現無縫互通性，API 提供了 `.asJavaAtomic()` 和 `.asKotlinAtomic()` 擴充功能。
在 JVM 上，Kotlin 原子類型和 Java 原子類型在執行時是相同的類型，因此您可以在 Java 原子類型和 Kotlin 原子類型之間轉換，而不會產生任何額外負荷。

以下範例說明 Kotlin 和 Java 原子類型如何協同運作：

```kotlin
// 匯入必要的函式庫
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
fun main() {
    // 將 Kotlin AtomicInt 轉換為 Java 的 AtomicInteger
    val kotlinAtomic = AtomicInt(42)
    val javaAtomic: AtomicInteger = kotlinAtomic.asJavaAtomic()
    println("Java atomic value: ${javaAtomic.get()}")
    // Java atomic value: 42

    // 將 Java 的 AtomicInteger 轉換回 Kotlin 的 AtomicInt
    val kotlinAgain: AtomicInt = javaAtomic.asKotlinAtomic()
    println("Kotlin atomic value: ${kotlinAgain.load()}")
    // Kotlin atomic value: 42
}
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### UUID 解析、格式化和可比較性變更
<primary-label ref="experimental-opt-in"/>

JetBrains 團隊持續改進對 [在 2.0.20 版本引入標準函式庫的](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library) UUID 的支援。

此前，`parse()` 函數僅接受十六進位與破折號格式的 UUID。藉由 Kotlin 2.1.20，
您可以將 `parse()` 用於 _十六進位與破折號_ 和 _純十六進位 (不含破折號)_ 兩種格式。

在此版本中，我們還引入了特定於十六進位與破折號格式操作的函數：

*   `parseHexDash()` 從十六進位與破折號格式解析 UUID。
*   `toHexDashString()` 將 `Uuid` 轉換為十六進位與破折號格式的 `String` (反映 `toString()` 的功能)。

這些函數的工作方式與此前為十六進位格式引入的 [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html)
和 [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) 相似。明確的解析和格式化功能命名應能提高
程式碼清晰度以及您使用 UUID 的整體體驗。

Kotlin 中的 UUID 現在是 `Comparable`。從 Kotlin 2.1.20 開始，您可以直接比較和排序 `Uuid`
類型的值。這使得可以使用 `<` 和 `>` 運算子以及專門用於
`Comparable` 類型或其集合 (例如 `sorted()`) 的標準函式庫擴充功能，並且還允許將 UUID 傳遞給任何需要 `Comparable` 介面的函數或 API。

請記住，標準函式庫中的 UUID 支援仍為 [實驗性 (Experimental)](components-stability.md#stability-levels-explained)。
若要啟用，請使用 `@OptIn(ExperimentalUuidApi::class)` 註解或編譯器選項 `-opt-in=kotlin.uuid.ExperimentalUuidApi`：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

//sampleStart
@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse() 接受純十六進位格式的 UUID
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // 將其轉換為十六進位與破折號格式
    val hexDashFormat = uuid.toHexDashString()
 
    // 以十六進位與破折號格式輸出 UUID
    println(hexDashFormat)

    // 以升序輸出 UUID
    println(
        listOf(
            uuid,
            Uuid.parse("780e8400e29b41d4a716446655440005"),
            Uuid.parse("5ab88400e29b41d4a716446655440076")
        ).sorted()
    )
   }
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### 新的時間追蹤功能
<primary-label ref="experimental-opt-in"/>

從 Kotlin 2.1.20 開始，標準函式庫提供了表示時間點的能力。此功能此前僅在
[`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) (一個 Kotlin 官方函式庫) 中可用。

[`kotlinx.datetime.Clock`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-clock/) 介面
以 `kotlin.time.Clock` 的形式引入標準函式庫，而 [`kotlinx.datetime.Instant`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-instant/)
類別則以 `kotlin.time.Instant` 的形式引入。這些概念與標準函式庫中的 `time` 套件自然契合，因為
它們僅關注時間點，而更複雜的日曆和時區功能則保留在 `kotlinx-datetime` 中。

`Instant` 和 `Clock` 在您需要精確時間追蹤而不考慮時區或日期時非常有用。例如，
您可以使用它們記錄帶有時間戳的事件、測量兩個時間點之間的持續時間，以及獲取系統程序的當前時刻。

為了提供與其他語言的互通性，還提供了額外的轉換函數：

*   `.toKotlinInstant()` 將時間值轉換為 `kotlin.time.Instant` 實例。
*   `.toJavaInstant()` 將 `kotlin.time.Instant` 值轉換為 `java.time.Instant` 值。
*   `Instant.toJSDate()` 將 `kotlin.time.Instant` 值轉換為 JS `Date` 類別的實例。此轉換
    不精確；JS 使用毫秒精度表示日期，而 Kotlin 允許奈秒解析度。

標準函式庫的新時間功能仍為 [實驗性 (Experimental)](components-stability.md#stability-levels-explained)。
若要啟用，請使用 `@OptIn(ExperimentalTime::class)` 註解：

```kotlin
import kotlin.time.*

@OptIn(ExperimentalTime::class)
fun main() {

    // 獲取當前時間點
    val currentInstant = Clock.System.now()
    println("Current time: $currentInstant")

    // 找出兩個時間點之間的差異
    val pastInstant = Instant.parse("2023-01-01T00:00:00Z")
    val duration = currentInstant - pastInstant

    println("Time elapsed since 2023-01-01: $duration")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

有關實作的更多資訊，請參閱此 [KEEP 提案](https://github.com/Kotlin/KEEP/pull/387/files)。

## Compose 編譯器

在 2.1.20 中，Compose 編譯器放寬了先前版本中引入的對 `@Composable` 函數的一些限制。
此外，Compose 編譯器 Gradle 外掛程式預設設定為包含來源資訊，使所有平台上的行為與 Android 對齊。

### 支援開放 `@Composable` 函數中的預設引數

此前，編譯器限制在開放的 `@Composable` 函數中使用預設引數，因為編譯器輸出不正確，
會導致執行時崩潰。底層問題現已解決，當與 Kotlin 2.1.20 或更高版本一起使用時，
預設引數完全支援。

Compose 編譯器在 [1.5.8 版本](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8) 之前允許在開放函數中使用預設引數，
因此支援取決於專案設定：

*   如果開放的可組合函數使用 Kotlin 2.1.20 或更高版本編譯，編譯器會為預設引數產生正確的包裝器。
    這包括與 1.5.8 之前的二進位檔案相容的包裝器，這意味著下游函式庫也能夠使用此開放函數。
*   如果開放的可組合函數使用早於 2.1.20 的 Kotlin 版本編譯，Compose 會使用相容模式，
    這可能會導致執行時崩潰。使用相容模式時，編譯器會發出警告以突出潛在問題。

### 最終覆寫函數允許重新啟動

虛擬函數 (`open` 和 `abstract` 的覆寫，包括介面) [在 2.1.0 版本中被強制為不可重新啟動](whatsnew21.md#changes-to-open-and-overridden-composable-functions)。
此限制現已放寬，適用於屬於最終類別成員或本身為 `final` 的函數 – 它們將照常重新啟動或跳過。

升級到 Kotlin 2.1.20 後，您可能會在受影響的函數中觀察到一些行為變更。若要強制使用先前版本的
不可重新啟動邏輯，請將 `@NonRestartableComposable` 註解套用於函數。

### `ComposableSingletons` 從公共 API 中移除

`ComposableSingletons` 是 Compose 編譯器在優化 `@Composable` lambda 時建立的類別。
不捕獲任何參數的 lambda 會被一次性分配並快取在類別的屬性中，從而節省執行時的分配。
該類別以內部可見性產生，僅用於優化編譯單元 (通常是一個檔案) 內的 lambda。

但是，此優化也套用於 `inline` 函數主體，導致單例 lambda 實例洩漏到公共 API 中。
為了解決此問題，從 2.1.20 開始，`@Composable` lambda 不再在內聯函數內部優化為單例。
同時，Compose 編譯器將繼續為內聯函數產生單例類別和 lambda，以支援在先前模型下編譯的模組的二進位相容性。

### 來源資訊預設包含

Compose 編譯器 Gradle 外掛程式在 Android 上已經預設啟用 [包含來源資訊](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html) 功能。
從 Kotlin 2.1.20 開始，此功能將在所有平台上預設啟用。

請記住檢查您是否使用 `freeCompilerArgs` 設定了此選項。
當與外掛程式一起使用時，此方法可能導致建置失敗，因為某個選項實際上被設定了兩次。

## 破壞性變更與棄用

*   為使 Kotlin Multiplatform 與 Gradle 即將發生的變更保持一致，我們正在逐步淘汰 `withJava()` 函數。
    [Java 來源集現在預設建立](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#java-source-sets-created-by-default)。如果您使用 [Java 測試夾具 (test fixtures)](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle 外掛程式，
    請直接升級到 [Kotlin 2.1.21](releases.md#release-details) 以避免相容性問題。
*   JetBrains 團隊正在繼續棄用 `kotlin-android-extensions` 外掛程式。如果您嘗試在專案中使用它，
    現在會收到設定錯誤，並且不會執行任何外掛程式程式碼。
*   舊版 `kotlin.incremental.classpath.snapshot.enabled` 屬性已從 Kotlin Gradle 外掛程式中移除。
    該屬性曾用於提供在 JVM 上回復到內建 ABI 快照的機會。該外掛程式現在使用其他方法來偵測並避免不必要的重新編譯，使該屬性過時。

## 說明文件更新

Kotlin 說明文件已收到一些顯著變更：

### 改版和新頁面

*   [Kotlin 路線圖](roadmap.md) – 查看 Kotlin 在語言和生態系統演進方面的優先級更新列表。
*   [Gradle 最佳實踐](gradle-best-practices.md) 頁面 – 學習優化 Gradle 建置和提高效能的基本最佳實踐。
*   [Compose Multiplatform 和 Jetpack Compose](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-and-jetpack-compose.html)
    – 兩個 UI 框架之間關係的概覽。
*   [Kotlin Multiplatform 和 Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html)
    – 查看兩個流行跨平台框架的比較。
*   [與 C 語言的互通性](native-c-interop.md) – 探索 Kotlin 與 C 語言互通性的詳細資訊。
*   [數字](numbers.md) – 了解表示數字的不同 Kotlin 類型。

### 新版和更新的教學課程

*   [將您的函式庫發佈到 Maven Central](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)
    – 學習如何將 KMP 函式庫構件發佈到最流行的 Maven 儲存庫。
*   [Kotlin/Native 作為動態函式庫](native-dynamic-libraries.md) – 建立一個動態 Kotlin 函式庫。
*   [Kotlin/Native 作為 Apple 框架](apple-framework.md) – 建立您自己的框架，並從 macOS 和 iOS 上的 Swift/Objective-C 應用程式中使用 Kotlin/Native 程式碼。

## 如何更新到 Kotlin 2.1.20

從 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛程式作為
捆綁在您的 IDE 中的外掛程式發佈。這表示您無法再從 JetBrains Marketplace 安裝此外掛程式。

若要更新到新的 Kotlin 版本，請在您的建置腳本中 [將 Kotlin 版本變更為](releases.md#update-to-a-new-kotlin-version) 2.1.20。