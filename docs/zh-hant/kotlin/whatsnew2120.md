---
title: "Kotlin 2.1.20 的新特性"
---
_[發布日期：2025 年 3 月 20 日](releases#release-details)_

Kotlin 2.1.20 版本在此！以下是主要亮點：

* **K2 編譯器更新**：[新的 kapt 和 Lombok 外掛程式的更新](#kotlin-k2-compiler)
* **Kotlin Multiplatform (Kotlin 多平台)**：[新的 DSL (Domain Specific Language，領域特定語言)取代 Gradle 的 Application 外掛程式](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* **Kotlin/Native**：[新的內聯優化](#kotlin-native-new-inlining-optimization)
* **Kotlin/Wasm**：[預設自訂格式器、DWARF 支援以及遷移到 Provider API](#kotlin-wasm)
* **Gradle 支援**：[與 Gradle 的 Isolated Projects (隔離專案)和自訂發布變體的相容性](#gradle)
* **標準函式庫**：[通用原子類型、改進的 UUID 支援以及新的時間追蹤功能](#standard-library)
* **Compose 編譯器**：[放寬對 `@Composable` 函數的限制和其他更新](#compose-compiler)
* **文件**：[Kotlin 文件的重要改進](#documentation-updates)。

## IDE 支援

支援 2.1.20 的 Kotlin 外掛程式已捆綁在最新的 IntelliJ IDEA 和 Android Studio 中。
您無需更新 IDE 中的 Kotlin 外掛程式。
您只需在建置腳本中將 Kotlin 版本變更為 2.1.20 即可。

請參閱[更新到新版本](releases#update-to-a-new-kotlin-version)以取得詳細資訊。

### 下載具有 OSGi 支援的專案中 Kotlin 成品的來源

`kotlin-osgi-bundle` 函式庫的所有相依性的來源現在都包含在其發行版本中。這允許 IntelliJ IDEA 下載這些來源，以提供 Kotlin 符號的文件並改善偵錯體驗。

## Kotlin K2 編譯器

我們正在持續改進對新的 Kotlin K2 編譯器的外掛程式支援。此版本帶來了對新的 kapt 和 Lombok 外掛程式的更新。

### 新的預設 kapt 外掛程式

從 Kotlin 2.1.20 開始，kapt 編譯器外掛程式的 K2 實作預設為所有專案啟用。

JetBrains 團隊早在 Kotlin 1.9.20 就推出了使用 K2 編譯器的新 kapt 外掛程式實作。
從那時起，我們進一步開發了 K2 kapt 的內部實作，使其行為與 K1 版本相似，同時顯著提高了其效能。

如果您在使用 K2 編譯器的 kapt 時遇到任何問題，您可以暫時恢復到先前的外掛程式實作。

為此，請將以下選項新增至專案的 `gradle.properties` 檔案：

```kotlin
kapt.use.k2=false
```

請將任何問題回報給我們的 [issue tracker](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)。

### Lombok 編譯器外掛程式：支援 `@SuperBuilder` 以及 `@Builder` 的更新

[Kotlin Lombok 編譯器外掛程式](lombok)現在支援 `@SuperBuilder` 註解，使其更容易為類別階層建立建構器。
先前，在 Kotlin 中使用 Lombok 的開發人員必須在處理繼承時手動定義建構器。使用 `@SuperBuilder`，建構器會自動繼承超類別欄位，讓您在建構物件時初始化它們。

此外，此更新還包括多項改進和錯誤修正：

* `@Builder` 註解現在適用於建構子，允許更靈活的物件建立。如需更多詳細資訊，請參閱相應的 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-71547)。
* 已解決與 Kotlin 中 Lombok 的程式碼產生相關的幾個問題，從而提高了整體相容性。如需更多詳細資訊，請參閱 [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)。

如需有關 `@SuperBuilder` 註解的更多資訊，請參閱官方 [Lombok 文件](https://projectlombok.org/features/experimental/SuperBuilder)。

## Kotlin Multiplatform (Kotlin 多平台)：新的 DSL (Domain Specific Language，領域特定語言)取代 Gradle 的 Application 外掛程式

從 Gradle 8.7 開始，[Application](https://docs.gradle.org/current/userguide/application_plugin.html) 外掛程式不再與 Kotlin Multiplatform (Kotlin 多平台) Gradle 外掛程式相容。Kotlin 2.1.20 引入了 Experimental (實驗性) DSL (Domain Specific Language，領域特定語言) 來實現類似的功能。新的 `executable {}` 區塊會為 JVM 目標配置執行任務和 Gradle [distributions](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)。

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

在此範例中，Gradle 的 [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) 外掛程式會套用在第一個 `executable {}` 區塊上。

如果您遇到任何問題，請在我們的 [issue tracker](https://kotl.in/issue) 中回報，或在我們的 [public Slack channel](https://kotlinlang.slack.com/archives/C19FD9681) 中告知我們。

## Kotlin/Native：新的內聯優化

Kotlin 2.1.20 引入了新的內聯優化傳遞，該傳遞位於實際程式碼產生階段之前。

Kotlin/Native 編譯器中的新內聯傳遞應比標準 LLVM 內聯器執行得更好，並提高產生的程式碼的執行階段效能。

新的內聯傳遞目前為 [Experimental (實驗性)](components-stability#stability-levels-explained)。若要試用它，請使用以下編譯器選項：

```none
-Xbinary=preCodegenInlineThreshold=40
```

我們的實驗表明，將閾值設定為 40 個權杖（編譯器剖析的程式碼單元）為編譯優化提供了一個合理的折衷方案。根據我們的基準測試，這使整體效能提高了 9.5%。當然，您也可以嘗試其他值。

如果您遇到二進位檔大小或編譯時間增加的情況，請透過 [YouTrack](https://kotl.in/issue) 回報此類問題。

## Kotlin/Wasm

此版本改進了 Kotlin/Wasm 的偵錯和屬性使用。自訂格式器現在可在開發版本中直接使用，而 DWARF 偵錯有助於程式碼檢查。此外，Provider API 簡化了 Kotlin/Wasm 和 Kotlin/JS 中的屬性使用。

### 預設啟用自訂格式器

之前，您必須[手動配置](whatsnew21#improved-debugging-experience-for-kotlin-wasm)自訂格式器，以改善使用 Kotlin/Wasm 程式碼時在 Web 瀏覽器中的偵錯。

在此版本中，自訂格式器預設為在開發版本中啟用，因此您不需要額外的 Gradle 配置。

若要使用此功能，您只需確保在瀏覽器的開發人員工具中啟用自訂格式器即可：

* 在 Chrome DevTools 中，在 **Settings | Preferences | Console** 中找到自訂格式器核取方塊：

  <img src="/img/wasm-custom-formatters-chrome.png" alt="Enable custom formatters in Chrome" width="400" style={{verticalAlign: 'middle'}}/>

* 在 Firefox DevTools 中，在 **Settings | Advanced settings** 中找到自訂格式器核取方塊：

  <img src="/img/wasm-custom-formatters-firefox.png" alt="Enable custom formatters in Firefox" width="400" style={{verticalAlign: 'middle'}}/>

此變更主要影響 Kotlin/Wasm 開發版本。如果您對生產版本有特定要求，則需要相應地調整 Gradle 配置。為此，請將以下編譯器選項新增至 `wasmJs {}` 區塊：

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

### 支援使用 DWARF 偵錯 Kotlin/Wasm 程式碼

Kotlin 2.1.20 引入了對 Kotlin/Wasm 中 DWARF (使用任意記錄格式進行偵錯) 的支援。

透過此變更，Kotlin/Wasm 編譯器能夠將 DWARF 資料嵌入到產生的 WebAssembly (Wasm) 二進位檔中。
許多偵錯器和虛擬機器可以讀取此資料，以提供對已編譯程式碼的深入瞭解。

DWARF 主要用於在獨立 Wasm 虛擬機器 (VM) 內部偵錯 Kotlin/Wasm 應用程式。若要使用此功能，Wasm VM 和偵錯器必須支援 DWARF。

透過 DWARF 支援，您可以逐步執行 Kotlin/Wasm 應用程式、檢查變數並深入瞭解程式碼。若要啟用此功能，請使用以下編譯器選項：

```bash
-Xwasm-generate-dwarf
```
### 遷移到 Kotlin/Wasm 和 Kotlin/JS 屬性的 Provider API

先前，Kotlin/Wasm 和 Kotlin/JS 擴充功能中的屬性是可變的 (`var`)，並且直接在建置腳本中指派：

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

現在，屬性透過 [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html) 公開，並且您必須使用 `.set()` 函數來指派值：

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API 確保延遲計算值並將其與任務相依性正確整合，從而提高建置效能。

透過此變更，直接屬性指派已棄用，而改用 `*EnvSpec` 類別，例如 `NodeJsEnvSpec` 和 `YarnRootEnvSpec`。

此外，為了避免混淆，已移除幾個別名任務：

| 已棄用任務        | 替代方案                                                     |
|------------------------|-----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` or `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` or `jsBrowserDistribution`         |

如果您僅在建置腳本中使用 Kotlin/JS 或 Kotlin/Wasm，則不需要執行任何動作，因為 Gradle 會自動處理指派。

但是，如果您維護基於 Kotlin Gradle 外掛程式的外掛程式，並且您的外掛程式未套用 `kotlin-dsl`，則必須更新屬性指派以使用 `.set()` 函數。

## Gradle

Kotlin 2.1.20 完全相容於 Gradle 7.6.3 到 8.11。您也可以使用 Gradle 版本，直到最新的 Gradle 發行版本。但是，請注意，這樣做可能會導致棄用警告，並且某些新的 Gradle 功能可能無法運作。

此版本的 Kotlin 包括 Kotlin Gradle 外掛程式與 Gradle 的 Isolated Projects (隔離專案)的相容性，以及對自訂 Gradle 發布變體的支援。

### Kotlin Gradle 外掛程式與 Gradle 的 Isolated Projects (隔離專案)相容

:::note
此功能目前在 Gradle 中處於 pre-Alpha 狀態。目前不支援 JS 和 Wasm 目標。
僅將其與 Gradle 8.10 或更高版本搭配使用，並且僅用於評估目的。

自 Kotlin 2.1.0 起，您已能夠在專案中[預覽 Gradle 的 Isolated Projects (隔離專案)功能](whatsnew21#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

先前，您必須配置 Kotlin Gradle 外掛程式，以使您的專案與 Isolated Projects (隔離專案)功能相容，然後才能試用它。在 Kotlin 2.1.20 中，不再需要此額外步驟。

現在，若要啟用 Isolated Projects (隔離專案)功能，您只需[設定系統屬性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)即可。

Kotlin Gradle 外掛程式中的 Gradle Isolated Projects (隔離專案)功能支援多平台專案和僅包含 JVM 或 Android 目標的專案。

具體而言，對於多平台專案，如果您在升級後注意到 Gradle 建置存在問題，您可以透過新增以下內容來退出新的 Kotlin Gradle 外掛程式行為：

```none
kotlin.kmp.isolated-projects.support=disable
```

但是，如果您在多平台專案中使用此 Gradle 屬性，則無法使用 Isolated Projects (隔離專案)功能。

請在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中告訴我們您使用此功能的體驗。

### 支援新增自訂 Gradle 發布變體

Kotlin 2.1.20 引入了對新增自訂 [Gradle 發布變體](https://docs.gradle.org/current/userguide/variant_attributes.html)的支援。
此功能適用於多平台專案和以 JVM 為目標的專案。

您無法使用此功能修改現有的 Gradle 變體。

:::

此功能為 [Experimental (實驗性)](components-stability#stability-levels-explained)。
若要選擇加入，請使用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 註解。

若要新增自訂 Gradle 發布變體，請叫用 `adhocSoftwareComponent()` 函數，該函數會傳回 [`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html) 的執行個體，您可以在 Kotlin DSL (Domain Specific Language，領域特定語言) 中配置該執行個體：

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

:::tip
如需有關變體的更多資訊，請參閱 Gradle 的 [Customizing publishing guide](https://docs.gradle.org/current/userguide/publishing_customization.html)。

:::

## 標準函式庫

此版本為標準函式庫帶來了新的 Experimental (實驗性) 功能：通用原子類型、改進的 UUID 支援以及新的時間追蹤功能。

### 通用原子類型

在 Kotlin 2.1.20 中，我們在標準函式庫的 `kotlin.concurrent.atomics` 套件中引入了通用原子類型，從而實現了共享的、平台獨立的程式碼，用於執行緒安全操作。這簡化了 Kotlin Multiplatform (Kotlin 多平台) 專案的開發，因為它無需跨原始碼集複製原子相依的邏輯。

`kotlin.concurrent.atomics` 套件及其屬性為 [Experimental (實驗性)](components-stability#stability-levels-explained)。
若要選擇加入，請使用 `@OptIn(ExperimentalAtomicApi::class)` 註解或編譯器選項 `-opt-in=kotlin.ExperimentalAtomicApi`。

以下範例顯示了如何使用 `AtomicInt` 安全地計算多個執行緒中處理的項目：

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

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

    // Prints the total number of processed items
    println("Total processed items: ${processedItems.load()}")
}
```

為了實現 Kotlin 原子類型與 Java 的 [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html) 原子類型之間的無縫互操作性，API 提供了 `.asJavaAtomic()` 和 `.asKotlinAtomic()` 擴充功能函數。在 JVM 上，Kotlin 原子類型和 Java 原子類型在執行階段是相同的類型，因此您可以將 Java 原子類型轉換為 Kotlin 原子類型，反之亦然，而不會產生任何額外負擔。

以下範例顯示了 Kotlin 和 Java 原子類型如何協同工作：

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

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

```

### UUID 剖析、格式化和可比較性的變更

JetBrains 團隊將繼續改進對 UUID 的支援，[該支援在 2.0.20 中引入標準函式庫](whatsnew2020#support-for-uuids-in-the-common-kotlin-standard-library)。

先前，`parse()` 函數僅接受十六進位和破折號格式的 UUID。使用 Kotlin 2.1.20，您可以對十六進位和破折號格式 _以及_ 純十六進位 (不含破折號) 格式使用 `parse()`。

我們也在此版本中引入了專門用於處理十六進位和破折號格式的操作的函數：

* `parseHexDash()` 從十六進位和破折號格式剖析 UUID。
* `toHexDashString()` 將 `Uuid` 轉換為十六進位和破折號格式的 `String` (鏡像 `toString()` 的功能)。

這些函數的工作方式與 [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) 和 [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) 類似，後者是先前為十六進位格式引入的。剖析和格式化功能的明確命名應能提高程式碼清晰度以及您使用 UUID 的整體體驗。

Kotlin 中的 UUID 現在是 `Comparable`。從 Kotlin 2.1.20 開始，您可以直接比較和排序 `Uuid` 類型的值。這使得可以使用 `<` 和 `>` 運算符以及專門用於 `Comparable` 類型或其集合的標準函式庫擴充功能 (例如 `sorted()`)，並且還允許將 UUID 傳遞給任何需要 `Comparable` 介面的函數或 API。

請記住，標準函式庫中的 UUID 支援仍然是 [Experimental (實驗性)](components-stability#stability-levels-explained)。
若要選擇加入，請使用 `@OptIn(ExperimentalUuidApi::class)` 註解或編譯器選項 `-opt-in=kotlin.uuid.ExperimentalUuidApi`：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

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

```

### 新的時間追蹤功能

從 Kotlin 2.1.20 開始，標準函式庫提供了表示時間點的功能。此功能先前僅在官方 Kotlin 函式庫 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 中提供。

[`kotlinx.datetime.Clock`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-clock/) 介面作為 `kotlin.time.Clock` 引入標準函式庫，而 [`kotlinx.datetime.Instant`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-instant/) 類別作為 `kotlin.time.Instant` 引入。這些概念自然與標準函式庫中的 `time` 套件對齊，因為它們僅關注時間點，而不是更複雜的日曆和時區功能，後者仍然位於 `kotlinx-datetime` 中。

當您需要精確的時間追蹤而不考慮時區或日期時，`Instant` 和 `Clock` 非常有用。例如，您可以使用它們來記錄帶有時間戳記的事件、測量兩個時間點之間的持續時間以及取得系統程序的當前時刻。

為了提供與其他語言的互操作性，提供了額外的轉換器函數：

* `.toKotlinInstant()` 將時間值轉換為 `kotlin.time.Instant` 執行個體。
* `.toJavaInstant()` 將 `kotlin.time.Instant` 值轉換為 `java.time.Instant` 值。
* `Instant.toJSDate()` 將 `kotlin.time.Instant` 值轉換為 JS `Date` 類別的執行個體。此轉換不精確；JS 使用毫秒精度來表示日期，而 Kotlin 允許奈秒解析度。

標準函式庫的新時間功能仍然是 [Experimental (實驗性)](components-stability#stability-levels-explained)。
若要選擇加入，請使用 `@OptIn(ExperimentalTime::class)` 註解：

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

如需有關實作的更多資訊，請參閱此 [KEEP proposal](https://github.com/Kotlin/KEEP/pull/387/files)。

## Compose 編譯器

在 2.1.20 中，Compose 編譯器放寬了先前版本中引入的對 `@Composable` 函數的一些限制。
此外，Compose 編譯器 Gradle 外掛程式預設設定為包含原始碼資訊，從而使所有平台上的行為與 Android 對齊。

### 支援開放 `@Composable` 函數中的預設引數

編譯器先前限制了開放 `@Composable` 函數中的預設引數，因為編譯器輸出不正確，這會導致執行階段崩潰。現在已解決根本問題，並且完全支援與 Kotlin 2.1.20 或更高版本搭配使用時的預設引數。

Compose 編譯器在 [version 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8) 之前允許開放函數中的預設引數，因此支援取決於專案配置：

* 如果使用 Kotlin 2.1.20 或更高版本編譯開放可組合函數，則編譯器會為預設引數產生正確的包裝函式。這包括與 pre-1.5.8 二進位檔相容的包裝函式，這意味著下游函式庫也將能夠使用此開放函數。
* 如果使用早於 2.1.20 的 Kotlin 編譯開放可組合函數，則 Compose 使用相容性模式，這可能會導致執行階段崩潰。使用相容性模式時，編譯器會發出警告以強調潛在問題。

### 允許最終覆寫函數可重新啟動

虛擬函數 (對 `open` 和 `abstract` 的覆寫，包括介面) [在 2.1.0 版本中被迫不可重新啟動](whatsnew21#changes-to-open-and-overridden-composable-functions)。
對於最終類別的成員或本身為 `final` 的函數，現在放寬了此限制 – 它們將照常重新啟動或跳過。

在升級到 Kotlin 2.1.20 後，您可能會觀察到受影響函數中的一些行為變更。若要強制執行先前版本的不可重新啟動邏輯，請將 `@NonRestartableComposable` 註解套用到該函數。

### 從 Public API 移除 `ComposableSingletons`

`ComposableSingletons` 是 Compose 編譯器在最佳化 `@Composable` lambda 時建立的類別。不捕獲任何參數的 Lambda 會分配一次並緩存在類別的屬性中，從而節省執行階段的分配。該類別以內部可見性產生，僅用於最佳化編譯單元 (通常是檔案) 內部的 lambda。

但是，此最佳化也套用於 `inline` 函數主體，這導致 singleton lambda 執行個體洩漏到 Public API 中。為了修正此問題，從 2.1.20 開始，`@Composable` lambda 不再最佳化為 inline 函數內部的 singleton。同時，Compose 編譯器將繼續為 inline 函數產生 singleton 類別和 lambda，以支援在先前模型下編譯的模組的二進位檔相容性。

### 預設包含原始碼資訊

Compose 編譯器 Gradle 外掛程式已在 Android 上預設啟用 [包括原始碼資訊](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html) 功能。從 Kotlin 2.1.20 開始，此功能將在所有平台上預設啟用。

請記住檢查您是否使用 `freeCompilerArgs` 設定了此選項。當與外掛程式一起使用時，此方法可能會導致建置失敗，因為一個選項實際上已設定兩次。

## 重大變更和棄用

* 為了使 Kotlin Multiplatform (Kotlin 多平台)與 Gradle 中即將發生的變更保持一致，我們正在逐步淘汰 `withJava()` 函數。
  [Java 原始碼集現在預設建立](multiplatform-compatibility-guide#java-source-sets-created-by-default)。

* JetBrains 團隊正在繼續棄用 `kotlin-android-extensions` 外掛程式。如果您嘗試在專案中使用它，現在會收到配置錯誤，並且不會執行任何外掛程式程式碼。

* 遺留的 `kotlin.incremental.classpath.snapshot.enabled` 屬性已從 Kotlin Gradle 外掛程式中移除。
  該屬性過去提供了一個機會，可以回復到 JVM 上的內建 ABI 快照。該外掛程式現在使用其他方法來偵測和避免不必要的重新編譯，從而使該屬性過時。

## 文件更新

Kotlin 文件收到了一些值得注意的變更：

### 改造和新增頁面

* [Kotlin roadmap (Kotlin 路線圖)](roadmap) – 請參閱 Kotlin 在語言和生態系統演進方面的優先事項的更新清單。
* [Gradle best practices (Gradle 最佳實踐)](gradle-best-practices) 頁面 – 學習優化 Gradle 建置並提高效能的重要最佳實踐。
* [Compose Multiplatform (Compose 多平台) 和 Jetpack Compose](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-and-jetpack-compose.html)
  – 兩個 UI 框架之間關係的概述。
* [Kotlin Multiplatform (Kotlin 多平台) 和 Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html)
  – 請參閱兩個熱門跨平台框架的比較。
* [Interoperability with C (與 C 的互操作性)](native-c-interop) – 探索 Kotlin 與 C 的互操作性的詳細資訊。
* [Numbers (數字)](numbers) – 瞭解用於表示數字的不同 Kotlin 類型。

### 新增和更新的教學課程

* [Publish your library to Maven Central (將您的函式庫發佈到 Maven Central)](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)
  – 瞭解如何將 KMP 函式庫成品發佈到最熱門的 Maven 儲存庫。
* [Kotlin/Native as a dynamic library (Kotlin/Native 作為動態函式庫)](native-dynamic-libraries) – 建立動態 Kotlin 函式庫。
* [Kotlin/Native as an Apple framework (Kotlin/Native 作為 Apple 框架)](apple-framework) – 建立您自己的框架，並在 macOS 和 iOS 上的 Swift/Objective-C 應用程式中使用 Kotlin/Native 程式碼。

## 如何更新到 Kotlin 2.1.20

從 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛程式作為捆綁外掛程式發佈，該外掛程式包含在您的 IDE 中。這意味著您無法再從 JetBrains Marketplace 安裝外掛程式。

若要更新到新的 Kotlin 版本，請[變更 Kotlin 版本](releases#update-to-a-new-kotlin-version)
在您的建置腳本中變更為 2.1.20。