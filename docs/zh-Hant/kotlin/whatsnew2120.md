[//]: # (title: Kotlin 2.1.20 有什麼新功能)

_[發佈日期：2025 年 3 月 20 日](releases.md#release-details)_

Kotlin 2.1.20 版本發佈啦！以下是主要亮點：

* **K2 編譯器更新**：[新 kapt 和 Lombok 外掛的更新](#kotlin-k2-compiler)
* **Kotlin Multiplatform**：[用於取代 Gradle 的 Application 外掛的新 DSL](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* **Kotlin/Native**：[支援 Xcode 16.3 及新的內聯最佳化](#kotlin-native)
* **Kotlin/Wasm**：[預設自訂格式器、支援 DWARF 及遷移至 Provider API](#kotlin-wasm)
* **Gradle 支援**：[與 Gradle 的 Isolated Projects 及自訂發佈變體相容](#gradle)
* **標準函式庫**：[通用原子型別、改進的 UUID 支援及新的時間追蹤功能](#standard-library)
* **Compose 編譯器**：[放寬對 `@Composable` 函數的限制及其他更新](#compose-compiler)
* **文件**：[Kotlin 文件顯著改進](#documentation-updates)。

## IDE 支援

支援 2.1.20 的 Kotlin 外掛已與最新版 IntelliJ IDEA 和 Android Studio 綁定。
您不需要在 IDE 中更新 Kotlin 外掛。
您只需在建置指令稿中將 Kotlin 版本更改為 2.1.20。

有關詳細資訊，請參閱[更新到新版本](releases.md#update-to-a-new-kotlin-version)。

### 在支援 OSGi 的專案中下載 Kotlin Artifact 的來源

`kotlin-osgi-bundle` 函式庫的所有依賴項來源現已包含在其發佈中。這使得
IntelliJ IDEA 能夠下載這些來源，以提供 Kotlin 符號的文件並改善除錯體驗。

## Kotlin K2 編譯器

我們正持續改進對新 Kotlin K2 編譯器的外掛支援。此版本帶來了對新 kapt 和 Lombok 外掛的更新。

### 新的預設 kapt 外掛
<primary-label ref="beta"/>

從 Kotlin 2.1.20 開始，kapt 編譯器外掛的 K2 實作預設對所有專案啟用。

JetBrains 團隊在 Kotlin 1.9.20 中推出了 kapt 外掛與 K2 編譯器的新實作。
自那時起，我們進一步開發了 K2 kapt 的內部實作，使其行為與 K1 版本相似，
同時也顯著提升了其效能。

如果您在使用 kapt 與 K2 編譯器時遇到任何問題，
您可以暫時恢復到先前的外掛實作。

為此，請將以下選項新增到您專案的 `gradle.properties` 檔案中：

```kotlin
kapt.use.k2=false
```

請將任何問題回報到我們的[問題追蹤器](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)。

### Lombok 編譯器外掛：支援 @SuperBuilder 及 @Builder 的更新
<primary-label ref="experimental-general"/>

[Kotlin Lombok 編譯器外掛](lombok.md)現在支援 `@SuperBuilder` 註解，使得為類別層次結構建立建構器變得更容易。過去，在 Kotlin 中使用 Lombok 的開發人員在處理繼承時必須手動定義建構器。透過 `@SuperBuilder`，建構器會自動繼承超類別欄位，讓您在建構物件時初始化這些欄位。

此外，本次更新還包含多項改進和錯誤修正：

*   `@Builder` 註解現在可用於建構函數，允許更靈活的物件建立。有關詳細資訊，請參閱對應的 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-71547)。
*   已解決多個與 Lombok 在 Kotlin 中產生程式碼相關的問題，提升了整體相容性。有關詳細資訊，請參閱 [GitHub 更新日誌](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)。

有關 `@SuperBuilder` 註解的更多資訊，請參閱官方 [Lombok 文件](https://projectlombok.org/features/experimental/SuperBuilder)。

## Kotlin Multiplatform：取代 Gradle Application 外掛的新 DSL
<primary-label ref="experimental-opt-in"/>

從 Gradle 8.7 開始，[Application](https://docs.gradle.org/current/userguide/application_plugin.html) 外掛不再與 Kotlin Multiplatform Gradle 外掛相容。Kotlin 2.1.20 引入了一個實驗性 DSL 來實現類似的功能。新的 `executable {}` 區塊為 JVM 目標設定執行任務和 Gradle [發佈](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)。

在您的建置指令稿中的 `executable {}` 區塊之前，新增以下 `@OptIn` 註解：

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

在此範例中，Gradle 的 [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) 外掛應用於第一個 `executable {}` 區塊。

如果您遇到任何問題，請在我們的[問題追蹤器](https://kotl.in/issue)中報告，或在我們的[公開 Slack 頻道](https://kotlinlang.slack.com/archives/C19FD9681)中告知我們。

## Kotlin/Native

### 支援 Xcode 16.3

從 Kotlin **2.1.21** 開始，Kotlin/Native 編譯器支援 Xcode 16.3 – Xcode 的最新穩定版本。請隨意更新您的 Xcode，並繼續在 Apple 作業系統上開發您的 Kotlin 專案。

2.1.21 版本也修正了相關的 [cinterop 問題](https://youtrack.jetbrains.com/issue/KT-75781/)，該問題導致 Kotlin Multiplatform 專案的編譯失敗。

### 新的內聯最佳化
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 引入了一種新的內聯最佳化傳遞，它發生在實際程式碼生成階段之前。

Kotlin/Native 編譯器中的新內聯傳遞應比標準 LLVM 內聯器表現更好，並提升生成程式碼的執行時效能。

新的內聯傳遞目前為[實驗性](components-stability.md#stability-levels-explained)。若要試用，請使用以下編譯器選項：

```none
-Xbinary=preCodegenInlineThreshold=40
```

我們的實驗表明，將閾值設定為 40 個 token（由編譯器解析的程式碼單元）在編譯最佳化方面提供了合理的折衷方案。根據我們的基準測試，這提供了 9.5% 的整體效能提升。當然，您也可以嘗試其他值。

如果您遇到二進位檔案大小增加或編譯時間延長的問題，請透過 [YouTrack](https://kotl.in/issue) 報告此類問題。

## Kotlin/Wasm

此版本改進了 Kotlin/Wasm 的除錯和屬性使用。自訂格式器現在在開發建置中可直接使用，而 DWARF 除錯則有助於程式碼檢查。此外，Provider API 簡化了 Kotlin/Wasm 和 Kotlin/JS 中的屬性使用。

### 預設啟用自訂格式器

以前，您必須[手動配置](whatsnew21.md#improved-debugging-experience-for-kotlin-wasm)自訂格式器，以在使用 Kotlin/Wasm 程式碼時改善網頁瀏覽器中的除錯體驗。

在此版本中，開發建置中預設啟用自訂格式器，因此您無需額外的 Gradle 配置。

若要使用此功能，您只需確保瀏覽器的開發者工具中已啟用自訂格式器：

*   在 Chrome DevTools 中，於 **Settings | Preferences | Console** 中找到自訂格式器核取方塊：

    ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=400}

*   在 Firefox DevTools 中，於 **Settings | Advanced settings** 中找到自訂格式器核取方塊：

    ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=400}

此更改主要影響 Kotlin/Wasm 的開發建置。如果您對生產建置有特定要求，您需要相應地調整您的 Gradle 配置。為此，請將以下編譯器選項新增到 `wasmJs {}` 區塊中：

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

Kotlin 2.1.20 引入了在 Kotlin/Wasm 中對 DWARF（任意記錄格式除錯）的支援。

透過此更改，Kotlin/Wasm 編譯器能夠將 DWARF 資料嵌入到生成的 WebAssembly (Wasm) 二進位檔案中。許多除錯器和虛擬機器可以讀取這些資料，以提供對編譯程式碼的深入了解。

DWARF 主要用於在獨立的 Wasm 虛擬機器 (VM) 中除錯 Kotlin/Wasm 應用程式。若要使用此功能，Wasm VM 和除錯器必須支援 DWARF。

透過 DWARF 支援，您可以逐步執行 Kotlin/Wasm 應用程式、檢查變數並獲得程式碼洞察。若要啟用此功能，請使用以下編譯器選項：

```bash
-Xwasm-generate-dwarf
```
### 遷移至 Provider API 以處理 Kotlin/Wasm 和 Kotlin/JS 屬性

以前，Kotlin/Wasm 和 Kotlin/JS 擴展中的屬性是可變的 (`var`)，並直接在建置指令稿中指定：

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

現在，屬性透過 [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html) 暴露，您必須使用 `.set()` 函數來指定值：

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API 確保值是惰性計算的，並與任務依賴項正確整合，從而提高了建置效能。

透過此更改，直接的屬性指定已被棄用，轉而使用 `*EnvSpec` 類別，例如 `NodeJsEnvSpec` 和 `YarnRootEnvSpec`。

此外，已移除多個別名任務，以避免混淆：

| 已棄用任務       | 替代方案                                                        |
|--------------------|---------------------------------------------------------------------|
| `wasmJsRun`        | `wasmJsBrowserDevelopmentRun`                                       |
| `wasmJsBrowserRun` | `wasmJsBrowserDevelopmentRun`                                       |
| `wasmJsNodeRun`    | `wasmJsNodeDevelopmentRun`                                          |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` 或 `wasmJsBrowserDistribution` |
| `jsRun`            | `jsBrowserDevelopmentRun`                                           |
| `jsBrowserRun`     | `jsBrowserDevelopmentRun`                                           |
| `jsNodeRun`        | `jsNodeDevelopmentRun`                                              |
| `jsBrowserWebpack` | `jsBrowserProductionWebpack` 或 `jsBrowserDistribution`             |

如果您只在建置指令稿中使用 Kotlin/JS 或 Kotlin/Wasm，則無需採取任何行動，因為 Gradle 會自動處理指定。

然而，如果您維護一個基於 Kotlin Gradle Plugin 的外掛，並且您的外掛未應用 `kotlin-dsl`，則必須更新屬性指定以使用 `.set()` 函數。

## Gradle

Kotlin 2.1.20 完全相容於 Gradle 7.6.3 至 8.11。您也可以使用高於或等於最新 Gradle 版本的 Gradle 版本。然而，請注意，這樣做可能會導致棄用警告，並且某些新的 Gradle 功能可能無法正常運作。

此版本的 Kotlin 包含 Kotlin Gradle 外掛與 Gradle 的 Isolated Projects 的相容性，以及對自訂 Gradle 發佈變體的支援。

### 與 Gradle Isolated Projects 相容的 Kotlin Gradle 外掛
<primary-label ref="experimental-opt-in"/>

> 此功能目前在 Gradle 中處於 Alpha 前期狀態。目前不支援 JS 和 Wasm 目標。
> 僅與 Gradle 8.10 或更高版本一起使用，且僅用於評估目的。
>
{style="warning"}

從 Kotlin 2.1.0 開始，您已能夠在專案中[預覽 Gradle 的 Isolated Projects 功能](whatsnew21.md#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

以前，您必須配置 Kotlin Gradle 外掛，才能使您的專案與 Isolated Projects 功能相容。在 Kotlin 2.1.20 中，此額外步驟已不再必要。

現在，若要啟用 Isolated Projects 功能，您只需[設定系統屬性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。

Kotlin Gradle 外掛支援 Gradle 的 Isolated Projects 功能，適用於多平台專案以及僅包含 JVM 或 Android 目標的專案。

特別是對於多平台專案，如果您在升級後發現 Gradle 建置有問題，您可以透過新增以下內容來選擇退出新的 Kotlin Gradle 外掛行為：

```none
kotlin.kmp.isolated-projects.support=disable
```

然而，如果您在多平台專案中使用此 Gradle 屬性，則無法使用 Isolated Projects 功能。

請在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 上告訴我們您對此功能的體驗。

### 支援新增自訂 Gradle 發佈變體
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 引入了支援新增自訂 [Gradle 發佈變體](https://docs.gradle.org/current/userguide/variant_attributes.html)的功能。此功能適用於多平台專案和以 JVM 為目標的專案。

> 您無法透過此功能修改現有的 Gradle 變體。
>
{style="note"}

此功能為[實驗性](components-stability.md#stability-levels-explained)。若要選擇啟用，請使用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 註解。

若要新增自訂 Gradle 發佈變體，請呼叫 `adhocSoftwareComponent()` 函數，它會返回一個 [`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html) 實例，您可以在 Kotlin DSL 中配置它：

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

> 有關變體的更多資訊，請參閱 Gradle 的[自訂發佈指南](https://docs.gradle.org/current/userguide/publishing_customization.html)。
>
{style="tip"}

## 標準函式庫

此版本為標準函式庫帶來了新的實驗性功能：通用原子型別、改進的 UUID 支援以及新的時間追蹤功能。

### 通用原子型別
<primary-label ref="experimental-opt-in"/>

在 Kotlin 2.1.20 中，我們在標準函式庫的 `kotlin.concurrent.atomics` 套件中引入了通用原子型別，為執行緒安全操作啟用共享、與平台無關的程式碼。這透過消除在不同原始碼集之間複製依賴原子型別的邏輯的需求，簡化了 Kotlin Multiplatform 專案的開發。

`kotlin.concurrent.atomics` 套件及其屬性為[實驗性](components-stability.md#stability-levels-explained)。若要選擇啟用，請使用 `@OptIn(ExperimentalAtomicApi::class)` 註解或編譯器選項 `-opt-in=kotlin.ExperimentalAtomicApi`。

以下範例展示了如何使用 `AtomicInt` 安全地計算多個執行緒中已處理的項目：

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
suspend fun main() {
    // Initializes the atomic counter for processed items
    var processedItems = AtomicInt(0)
    val totalItems = 100
    val items = List(totalItems) { "item$it" }
    // Splits the items into chunks for processing by multiple coroutines
    val chunkSize = 20
    val itemChunks = items.chunked(chunkSize)
    coroutineScope {
        for (chunk in itemChunks) {
            launch {
                for (item in chunk) {
                    println("Processing $item in thread ${Thread.currentThread()}")
                    processedItems += 1 // Increment counter atomically
                }
            }
         }
    }
//sampleEnd
    // Prints the total number of processed items
    println("Total processed items: ${processedItems.load()}")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

為了在 Kotlin 的原子型別和 Java 的 [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html) 原子型別之間實現無縫互通性，API 提供了 `.asJavaAtomic()` 和 `.asKotlinAtomic()` 擴展函數。在 JVM 上，Kotlin 原子型別和 Java 原子型別在執行時是相同的型別，因此您可以將 Java 原子型別轉換為 Kotlin 原子型別，反之亦然，而無需任何開銷。

以下範例展示了 Kotlin 和 Java 原子型別如何協同運作：

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
fun main() {
    // Converts Kotlin AtomicInt to Java's AtomicInteger
    val kotlinAtomic = AtomicInt(42)
    val javaAtomic: AtomicInteger = kotlinAtomic.asJavaAtomic()
    println("Java atomic value: ${javaAtomic.get()}")
    // Java atomic value: 42

    // Converts Java's AtomicInteger back to Kotlin's AtomicInt
    val kotlinAgain: AtomicInt = javaAtomic.asKotlinAtomic()
    println("Kotlin atomic value: ${kotlinAgain.load()}")
    // Kotlin atomic value: 42
}
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### UUID 解析、格式化和可比較性方面的變更
<primary-label ref="experimental-opt-in"/>

JetBrains 團隊持續改進對 [2.0.20 中引入標準函式庫的 UUID](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library) 的支援。

以前，`parse()` 函數只接受十六進制帶連字號的 UUID 格式。在 Kotlin 2.1.20 中，您可以使用 `parse()` 處理*兩種*格式：十六進制帶連字號和純十六進制（不帶連字號）。

在此版本中，我們還引入了專門用於十六進制帶連字號格式操作的函數：

*   `parseHexDash()` 從十六進制帶連字號格式解析 UUID。
*   `toHexDashString()` 將 `Uuid` 轉換為十六進制帶連字號格式的 `String`（與 `toString()` 的功能相同）。

這些函數的工作方式與先前為十六進制格式引入的 [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) 和 [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) 類似。明確命名解析和格式化功能應能提高程式碼清晰度，並改善您使用 UUID 的整體體驗。

Kotlin 中的 UUID 現在是 `Comparable`。從 Kotlin 2.1.20 開始，您可以直接比較和排序 `Uuid` 型別的值。這使得可以使用 `<` 和 `>` 運算子，以及專為 `Comparable` 型別或其集合（例如 `sorted()`）提供的標準函式庫擴展；它還允許將 UUID 傳遞給任何需要 `Comparable` 介面的函數或 API。

請記住，標準函式庫中的 UUID 支援仍為[實驗性](components-stability.md#stability-levels-explained)。若要選擇啟用，請使用 `@OptIn(ExperimentalUuidApi::class)` 註解或編譯器選項 `-opt-in=kotlin.uuid.ExperimentalUuidApi`：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

//sampleStart
@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse() accepts a UUID in a plain hexadecimal format
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // Converts it to the hex-and-dash format
    val hexDashFormat = uuid.toHexDashString()
 
    // Outputs the UUID in the hex-and-dash format
    println(hexDashFormat)

    // Outputs UUIDs in ascending order
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

從 Kotlin 2.1.20 開始，標準函式庫提供了表示時間點的能力。此功能以前僅在官方 Kotlin 函式庫 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 中可用。

[`kotlinx.datetime.Clock`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-clock/) 介面作為 `kotlin.time.Clock` 被引入標準函式庫，而 [`kotlinx.datetime.Instant`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-instant/) 類別則作為 `kotlin.time.Instant` 被引入。這些概念自然地與標準函式庫中的 `time` 套件對齊，因為它們只關注時間點，而 `kotlinx-datetime` 中保留了更複雜的日曆和時區功能。

`Instant` 和 `Clock` 在您需要精確時間追蹤而不考慮時區或日期時非常有用。例如，您可以使用它們來記錄帶有時間戳的事件、測量兩個時間點之間的持續時間，以及獲取系統進程的當前時間點。

為了提供與其他語言的互通性，還提供了額外的轉換函數：

*   `.toKotlinInstant()` 將時間值轉換為 `kotlin.time.Instant` 實例。
*   `.toJavaInstant()` 將 `kotlin.time.Instant` 值轉換為 `java.time.Instant` 值。
*   `Instant.toJSDate()` 將 `kotlin.time.Instant` 值轉換為 JS `Date` 類別的實例。此轉換不精確；JS 使用毫秒精度表示日期，而 Kotlin 允許奈秒解析度。

標準函式庫的新時間功能仍為[實驗性](components-stability.md#stability-levels-explained)。若要選擇啟用，請使用 `@OptIn(ExperimentalTime::class)` 註解：

```kotlin
import kotlin.time.*

@OptIn(ExperimentalTime::class)
fun main() {

    // Get the current moment in time
    val currentInstant = Clock.System.now()
    println("Current time: $currentInstant")

    // Find the difference between two moments in time
    val pastInstant = Instant.parse("2023-01-01T00:00:00Z")
    val duration = currentInstant - pastInstant

    println("Time elapsed since 2023-01-01: $duration")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

有關實作的更多資訊，請參閱此 [KEEP 提案](https://github.com/Kotlin/KEEP/pull/387/files)。

## Compose 編譯器

在 2.1.20 中，Compose 編譯器放寬了先前版本中引入的 `@Composable` 函數的一些限制。此外，Compose 編譯器 Gradle 外掛預設設定為包含來源資訊，使所有平台上的行為與 Android 對齊。

### 支援開放式 @Composable 函數中帶有預設值的參數

編譯器先前限制了開放式 `@Composable` 函數中帶有預設值的參數，因為不正確的編譯器輸出會導致執行時崩潰。底層問題現已解決，當與 Kotlin 2.1.20 或更高版本一起使用時，帶有預設值的參數將得到完全支援。

Compose 編譯器在 [1.5.8 版本](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8)之前允許開放式函數中帶有預設值的參數，因此支援取決於專案配置：

*   如果開放式可組合函數使用 Kotlin 2.1.20 或更高版本編譯，編譯器會為帶有預設值的參數生成正確的包裝器。這包括與 1.5.8 之前的二進位檔案相容的包裝器，這表示下游函式庫也能夠使用此開放式函數。
*   如果開放式可組合函數使用早於 2.1.20 的 Kotlin 版本編譯，Compose 會使用相容模式，這可能會導致執行時崩潰。使用相容模式時，編譯器會發出警告以指出潛在問題。

### 最終覆寫的函數允許可重啟

虛擬函數（`open` 和 `abstract` 的覆寫，包括介面）[在 2.1.0 版本中被強制為不可重啟](whatsnew21.md#changes-to-open-and-overridden-composable-functions)。現在，對於屬於 `final` 類別成員或本身為 `final` 的函數，此限制已放寬 – 它們將照常重啟或跳過。

升級到 Kotlin 2.1.20 後，您可能會在受影響的函數中觀察到一些行為變化。若要強制使用舊版中的不可重啟邏輯，請將 `@NonRestartableComposable` 註解應用於該函數。

### ComposableSingletons 從公共 API 中移除

`ComposableSingletons` 是 Compose 編譯器在最佳化 `@Composable` 匿名函數時建立的一個類別。不捕獲任何參數的匿名函數會被分配一次並快取在類別的一個屬性中，從而在執行時節省了分配。該類別以內部可見性生成，僅用於最佳化編譯單元（通常是一個檔案）內的匿名函數。

然而，此最佳化也應用於 `inline` 函數體，這導致單例匿名函數實例洩漏到公共 API 中。為了解決這個問題，從 2.1.20 開始，`@Composable` 匿名函數不再在內聯函數中最佳化為單例。同時，Compose 編譯器將繼續為內聯函數生成單例類別和匿名函數，以支援在舊模型下編譯的模組的二進位相容性。

### 預設包含來源資訊

Compose 編譯器 Gradle 外掛在 Android 上已預設啟用[包含來源資訊](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html)功能。從 Kotlin 2.1.20 開始，此功能將在所有平台預設啟用。

請記得檢查您是否使用 `freeCompilerArgs` 設定了此選項。當與外掛一起使用時，此方法可能導致建置失敗，因為一個選項實際上被設定了兩次。

## 重大變更與棄用

*   為了使 Kotlin Multiplatform 與 Gradle 即將推出的變更保持一致，我們正在逐步淘汰 `withJava()` 函數。[Java 原始碼集現在預設建立](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#java-source-sets-created-by-default)。如果您使用 [Java 測試夾具](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle 外掛，請直接升級到 [Kotlin 2.1.21](releases.md#release-details) 以避免相容性問題。
*   JetBrains 團隊正在推進 `kotlin-android-extensions` 外掛的棄用。如果您嘗試在專案中使用它，現在將會收到配置錯誤，並且不會執行任何外掛程式碼。
*   舊版 `kotlin.incremental.classpath.snapshot.enabled` 屬性已從 Kotlin Gradle 外掛中移除。該屬性過去提供了在 JVM 上回退到內建 ABI 快照的機會。該外掛現在使用其他方法來偵測和避免不必要的重新編譯，使得該屬性變得多餘。

## 文件更新

Kotlin 文件已進行了一些顯著的更改：

### 翻新與新增頁面

*   [Kotlin 路線圖](roadmap.md) – 查看 Kotlin 在語言和生態系統演進方面的優先級更新列表。
*   [Gradle 最佳實踐](gradle-best-practices.md)頁面 – 學習最佳化您的 Gradle 建置並提升效能的基本最佳實踐。
*   [Compose Multiplatform 與 Jetpack Compose](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-and-jetpack-compose.html) – 兩種 UI 框架之間關係的概述。
*   [Kotlin Multiplatform 與 Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html) – 查看兩種流行跨平台框架的比較。
*   [與 C 的互通性](native-c-interop.md) – 探索 Kotlin 與 C 的互通性細節。
*   [數字](numbers.md) – 了解不同用於表示數字的 Kotlin 型別。

### 新增與更新的教學

*   [將您的函式庫發佈到 Maven Central](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html) – 了解如何將 KMP 函式庫 artifact 發佈到最受歡迎的 Maven 儲存庫。
*   [Kotlin/Native 作為動態函式庫](native-dynamic-libraries.md) – 建立一個動態 Kotlin 函式庫。
*   [Kotlin/Native 作為 Apple 框架](apple-framework.md) – 建立您自己的框架，並在 macOS 和 iOS 上從 Swift/Objective-C 應用程式中使用 Kotlin/Native 程式碼。

## 如何更新到 Kotlin 2.1.20

從 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛作為一個綁定外掛包含在您的 IDE 中發佈。

這意味著您無法再從 JetBrains Marketplace 安裝該外掛。

若要更新到新的 Kotlin 版本，請在您的建置指令稿中將 [Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version)為 2.1.20。