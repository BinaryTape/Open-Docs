[//]: # (title: Kotlin 2.1.20 新功能)

<web-summary>閱讀 Kotlin 2.1.20 版本資訊，涵蓋新的語言特性、Kotlin Multiplatform、JVM、Native、JS 與 Wasm 的更新，以及 Gradle 和 Maven 的建置工具支援。</web-summary>

_[發佈日期：2025 年 3 月 20 日](releases.md#release-history)_

Kotlin 2.1.20 正式發佈！以下是主要亮點：

* **K2 編譯器更新**：[對新 kapt 和 Lombok 外掛程式的更新](#kotlin-k2-compiler)
* **Kotlin Multiplatform**：[用於取代 Gradle Application 外掛程式的新 DSL](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* **Kotlin/Native**：[支援 Xcode 16.3 以及新的內嵌優化](#kotlin-native)
* **Kotlin/Wasm**：[預設自訂格式化程式、支援 DWARF，以及遷移至 Provider API](#kotlin-wasm)
* **Gradle 支援**：[與 Gradle Isolated Projects 的相容性以及自訂發佈變體](#gradle)
* **標準函式庫**：[通用原子型別、改進的 UUID 支援以及新的時間追蹤功能](#standard-library)
* **Compose 編譯器**：[放寬對 `@Composable` 函式的限制及其他更新](#compose-compiler)
* **文件**：[Kotlin 文件的顯著改進](#documentation-updates)。

> 有關 Kotlin 發佈週期的資訊，請參閱 [Kotlin 發佈程序](releases.md)。
>
{style="tip"}

## IDE 支援

支援 2.1.20 的 Kotlin 外掛程式已內建在最新的 IntelliJ IDEA 和 Android Studio 中。
您不需要更新 IDE 中的 Kotlin 外掛程式。
您只需在建置指令碼中將 Kotlin 版本變更為 2.1.20 即可。

有關詳細資訊，請參閱[更新至新版本](releases.md#update-to-a-new-kotlin-version)。

### 為具備 OSGi 支援的專案下載 Kotlin 構件原始碼

`kotlin-osgi-bundle` 函式庫所有相依項的原始碼現在都已包含在其分發中。這讓
IntelliJ IDEA 能夠下載這些原始碼，以提供 Kotlin 符號的文件並改善偵錯體驗。

## Kotlin K2 編譯器

我們持續改善對新 Kotlin K2 編譯器的外掛程式支援。此版本帶來了對新 kapt
和 Lombok 外掛程式的更新。

### 新的預設 kapt 外掛程式
<primary-label ref="beta"/>

從 Kotlin 2.1.20 開始，kapt 編譯器外掛程式的 K2 實作對所有專案預設啟用。

JetBrains 小組早在 Kotlin 1.9.20 就推出了搭配 K2 編譯器的新 kapt 外掛程式實作。
從那時起，我們進一步開發了 K2 kapt 的內部實作，使其行為與 K1 版本相似，
同時也顯著提升了其效能。

如果您在將 kapt 與 K2 編譯器搭配使用時遇到任何問題，
可以暫時還原為之前的外掛程式實作。

若要執行此操作，請在專案的 `gradle.properties` 檔案中加入以下選項：

```kotlin
kapt.use.k2=false
```

請將任何問題回報至我們的[問題追蹤器](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)。

### Lombok 編譯器外掛程式：支援 `@SuperBuilder` 以及 `@Builder` 的更新
<primary-label ref="experimental-general"/>

[Kotlin Lombok 編譯器外掛程式](lombok.md)現在支援 `@SuperBuilder` 註解，讓建立
類別階層結構的產生器變得更容易。以前，在 Kotlin 中使用 Lombok 的開發人員在
處理繼承時必須手動定義產生器。有了 `@SuperBuilder`，產生器會自動繼承超類別欄位，讓您在
建構物件時能夠初始化它們。

此外，此更新還包括幾項改進和錯誤修正：

* `@Builder` 註解現在可用於建構函式，允許更靈活的物件建立。如需更多詳細資訊，
  請參閱對應的 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-71547)。
* 解決了數個與 Kotlin 中 Lombok 程式碼產生相關的問題，提高了整體的相容性。
  如需更多詳細資訊，請參閱 [GitHub 變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)。

有關 `@SuperBuilder` 註解的更多資訊，請參閱官方 [Lombok 文件](https://projectlombok.org/features/experimental/SuperBuilder)。

## Kotlin Multiplatform：用於取代 Gradle Application 外掛程式的新 DSL
<primary-label ref="experimental-opt-in"/>

從 Gradle 8.7 開始，[Application](https://docs.gradle.org/current/userguide/application_plugin.html) 外掛程式不再
與 Kotlin Multiplatform Gradle 外掛程式相容。Kotlin 2.1.20 引入了一個實驗性
DSL 以實現類似的功能。新的 `executable {}` 區塊為 JVM 目標配置執行任務和 Gradle
[發行版本](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)。

在建置指令碼的 `executable {}` 區塊之前，加入以下 `@OptIn` 註解：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

例如：

```kotlin
kotlin {
    jvm {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        binaries {
            // 配置名為 "runJvm" 的 JavaExec 任務，以及此目標中 "main" 編譯的 Gradle 發行版本
            executable {
                mainClass.set("foo.MainKt")
            }

            // 配置名為 "runJvmAnother" 的 JavaExec 任務，以及 "main" 編譯的 Gradle 發行版本
            executable(KotlinCompilation.MAIN_COMPILATION_NAME, "another") {
                // 設定不同的類別
                mainClass.set("foo.MainAnotherKt")
            }

            // 配置名為 "runJvmTest" 的 JavaExec 任務，以及 "test" 編譯的 Gradle 發行版本
            executable(KotlinCompilation.TEST_COMPILATION_NAME) {
                mainClass.set("foo.MainTestKt")
            }

            // 配置名為 "runJvmTestAnother" 的 JavaExec 任務，以及 "test" 編譯的 Gradle 發行版本
            executable(KotlinCompilation.TEST_COMPILATION_NAME, "another") {
                mainClass.set("foo.MainAnotherTestKt")
            }
        }
    }
}
```

在此範例中，Gradle 的 [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)
外掛程式會套用於第一個 `executable {}` 區塊。

如果您遇到任何問題，請在我們的[問題追蹤器](https://kotl.in/issue)中回報，或在我們的[公開 Slack 頻道](https://kotlinlang.slack.com/archives/C19FD9681)中告知我們。

## Kotlin/Native

### 支援 Xcode 16.3

從 Kotlin **2.1.21** 開始，Kotlin/Native 編譯器支援 Xcode 16.3 – 這是 Xcode 的最新穩定版本。
歡迎更新您的 Xcode，並繼續在 Apple 作業系統上開發 Kotlin 專案。

2.1.21 版本也修正了相關的 [cinterop 問題](https://youtrack.jetbrains.com/issue/KT-75781/)，該問題曾導致
Kotlin Multiplatform 專案建置失敗。

### 新的內嵌優化
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 引入了一個新的內嵌優化輪次，它位於實際的程式碼產生階段之前。

Kotlin/Native 編譯器中的新內嵌輪次應比標準的 LLVM 內嵌器表現更好，並提升產生的程式碼的執行階段效能。

新的內嵌輪次目前處於[實驗性](components-stability.md#stability-levels-explained)階段。若要嘗試，
請使用以下編譯器選項：

```none
-Xbinary=preCodegenInlineThreshold=40
```

我們的實驗顯示，將閾值設定為 40 個 token（編譯器剖析的程式碼單元）在編譯優化方面提供了一個合理的
折衷方案。根據我們的效能基準測試，這帶來了 9.5% 的整體效能提升。當然，您也可以嘗試其他數值。

如果您遇到二進制檔案大小增加或編譯時間延長的情況，請透過 [YouTrack](https://kotl.in/issue) 回報此類問題。

## Kotlin/Wasm

此版本改善了 Kotlin/Wasm 的偵錯和屬性使用。自訂格式化程式現在在開發建置中可以開箱即用，而 DWARF 偵錯則有利於程式碼檢查。此外，Provider API 簡化了 Kotlin/Wasm 和 Kotlin/JS 中的屬性使用。

### 預設啟用自訂格式化程式

以前，您必須[手動配置](whatsnew21.md#improved-debugging-experience-for-kotlin-wasm)自訂格式化程式，
以便在處理 Kotlin/Wasm 程式碼時改善網頁瀏覽器中的偵錯體驗。

在此版本中，開發建置預設啟用自訂格式化程式，因此您不需要額外的 Gradle 配置。

要使用此功能，您只需確保瀏覽器的開發者工具中已啟用自訂格式化程式：

* 在 Chrome 開發者工具中，於 **Settings | Preferences | Console** 找到 custom formatters 核取方塊：

  ![在 Chrome 中啟用自訂格式化程式](wasm-custom-formatters-chrome.png){width=400}

* 在 Firefox 開發者工具中，於 **Settings | Advanced settings** 找到 custom formatters 核取方塊：

  ![在 Firefox 中啟用自訂格式化程式](wasm-custom-formatters-firefox.png){width=400}

此變更主要影響 Kotlin/Wasm 開發建置。如果您對生產建置有特定需求，
則需要相應地調整您的 Gradle 配置。為此，請將以下編譯器選項加入 `wasmJs {}` 區塊：

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

### 支援 DWARF 以偵錯 Kotlin/Wasm 程式碼

Kotlin 2.1.20 引入了對 Kotlin/Wasm 中 DWARF（任意記錄格式偵錯）的支援。

透過此變更，Kotlin/Wasm 編譯器能夠將 DWARF 資料嵌入到產生的 WebAssembly (Wasm) 二進制檔中。
許多偵錯工具和虛擬機可以讀取這些資料，以提供對編譯程式碼的洞察。

DWARF 主要用於在獨立的 Wasm 虛擬機 (VM) 中偵錯 Kotlin/Wasm 應用程式。若要使用此
功能，Wasm VM 和偵錯工具必須支援 DWARF。

藉助 DWARF 支援，您可以單步執行 Kotlin/Wasm 應用程式、檢查變數並獲得程式碼智慧。若要啟用
此功能，請使用以下編譯器選項：

```bash
-Xwasm-generate-dwarf
```

### 遷移至 Provider API 以處理 Kotlin/Wasm 和 Kotlin/JS 屬性

以前，Kotlin/Wasm 和 Kotlin/JS 擴充套件中的屬性是可變的 (`var`)，並直接在建置指令碼中指派：

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

現在，屬性透過 [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html) 公開，
且您必須使用 `.set()` 函式來指派值：

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API 確保值是延遲計算的，並與任務相依性正確整合，從而提升建置效能。

透過此變更，直接屬性指派已被棄用，建議改用 `*EnvSpec` 類別，
例如 `NodeJsEnvSpec` 和 `YarnRootEnvSpec`。

此外，為了避免混淆，已移除了多個別名任務：

| 棄用的任務 | 替代方案 |
|------------------------|-----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` 或 `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` 或 `jsBrowserDistribution`         |

如果您僅在建置指令碼中使用 Kotlin/JS 或 Kotlin/Wasm，則無需執行任何操作，因為 Gradle 會自動處理指派。

但是，如果您維護一個基於 Kotlin Gradle 外掛程式的外掛程式，且您的外掛程式未套用 `kotlin-dsl`，
則您必須更新屬性指派以使用 `.set()` 函式。

## Gradle

Kotlin 2.1.20 與 Gradle 7.6.3 至 8.11 完全相容。您也可以使用截至最新發佈的 Gradle
版本。但請注意，這樣做可能會導致棄用警告，且某些新的 Gradle 功能可能無法運作。

此版本的 Kotlin 包含 Kotlin Gradle 外掛程式與 Gradle Isolated Projects 的相容性，以及對
自訂 Gradle 發佈變體的支援。

### Kotlin Gradle 外掛程式與 Gradle Isolated Projects 相容
<primary-label ref="experimental-opt-in"/>

> 此功能目前在 Gradle 中處於 pre-Alpha 階段。目前不支援 JS 和 Wasm 目標。
> 請僅在 Gradle 8.10 或更高版本中使用它，且僅供評估之用。
>
{style="warning"}

自 Kotlin 2.1.0 起，您已能在專案中[預覽 Gradle 的 Isolated Projects 功能](whatsnew21.md#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

以前，您必須配置 Kotlin Gradle 外掛程式以使您的專案與 Isolated Projects
功能相容，然後才能嘗試使用它。在 Kotlin 2.1.20 中，此額外步驟已不再需要。

現在，要啟用 Isolated Projects 功能，您只需[設定系統屬性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)即可。

多平台專案以及僅包含 JVM 或 Android 目標的專案，其 Kotlin Gradle 外掛程式皆支援 Gradle 的 Isolated Projects 功能。

特別是對於多平台專案，如果您在升級後發現 Gradle 建置出現問題，可以透過加入以下內容來選擇退出
新的 Kotlin Gradle 外掛程式行為：

```none
kotlin.kmp.isolated-projects.support=disable
```

但是，如果您在多平台專案中使用此 Gradle 屬性，則無法使用 Isolated Projects 功能。

請在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中讓我們知道您對此功能的體驗。

### 支援加入自訂 Gradle 發佈變體
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 引入了對加入自訂 [Gradle 發佈變體](https://docs.gradle.org/current/userguide/variant_attributes.html)的支援。
此功能適用於多平台專案和以 JVM 為目標的專案。

> 您無法使用此功能修改現有的 Gradle 變體。
>
{style="note"}

此功能處於[實驗性](components-stability.md#stability-levels-explained)階段。
若要加入，請使用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 註解。

若要加入自訂 Gradle 發佈變體，請呼叫 `adhocSoftwareComponent()` 函式，它會傳回一個
[`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html) 實體，
您可以在 Kotlin DSL 中進行配置：

```kotlin
plugins {
    // 僅支援 JVM 和 Multiplatform
    kotlin("jvm")
    // 或
    kotlin("multiplatform")
}

kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    publishing {
        // 傳回一個 AdhocSoftwareComponent 實體
        adhocSoftwareComponent()
        // 或者，您可以在 DSL 區塊中配置 AdhocSoftwareComponent，如下所示
        adhocSoftwareComponent {
            // 在此使用 AdhocSoftwareComponent API 加入您的自訂變體
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

在 Kotlin 2.1.20 中，我們在標準函式庫的 `kotlin.concurrent.atomics`
套件中引入了通用原子型別，實現了執行緒安全操作的共享、平台無關程式碼。這消除了在不同原始碼集之間重複原子相依邏輯的需求，從而簡化了 Kotlin Multiplatform 專案的開發。

`kotlin.concurrent.atomics` 套件及其屬性處於[實驗性](components-stability.md#stability-levels-explained)階段。
若要加入，請使用 `@OptIn(ExperimentalAtomicApi::class)` 註解或編譯器選項 `-opt-in=kotlin.ExperimentalAtomicApi`。

以下範例展示了如何使用 `AtomicInt` 在多個執行緒中安全地計數已處理的項目：

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
    // 將項目分成多個區塊，供多個協同程式處理
    val chunkSize = 20
    val itemChunks = items.chunked(chunkSize)
    coroutineScope {
        for (chunk in itemChunks) {
            launch {
                for (item in chunk) {
                    println("正在執行緒 ${Thread.currentThread()} 中處理 $item")
                    processedItems += 1 // 以原子方式遞增計數器
                }
            }
         }
    }
//sampleEnd
    // 列印已處理項目的總數
    println("已處理項目總數：${processedItems.load()}")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

為了實現 Kotlin 原子型別與 Java [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html)
原子型別之間的無縫互通，該 API 提供了 `.asJavaAtomic()` 和 `.asKotlinAtomic()` 擴充函式。在 JVM 上，Kotlin
原子和 Java 原子在執行階段是相同的型別，因此您可以將 Java 原子轉換為 Kotlin 原子，反之亦然，且沒有任何開銷。

以下範例展示了 Kotlin 和 Java 原子型別如何協同運作：

```kotlin
// 匯入必要的函式庫
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
fun main() {
    // 將 Kotlin 的 AtomicInt 轉換為 Java 的 AtomicInteger
    val kotlinAtomic = AtomicInt(42)
    val javaAtomic: AtomicInteger = kotlinAtomic.asJavaAtomic()
    println("Java 原子值：${javaAtomic.get()}")
    // Java 原子值：42

    // 將 Java 的 AtomicInteger 轉換回 Kotlin 的 AtomicInt
    val kotlinAgain: AtomicInt = javaAtomic.asKotlinAtomic()
    println("Kotlin 原子值：${kotlinAgain.load()}")
    // Kotlin 原子值：42
}
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### UUID 剖析、格式化和可比較性的變更
<primary-label ref="experimental-opt-in"/>

JetBrains 小組繼續改進對 UUID 的支援（該支援已於 [2.0.20 引入標準函式庫](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library)）。

以前，`parse()` 函式僅接受「十六進位加連字號」格式的 UUID。在 Kotlin 2.1.20 中，
您可以使用 `parse()` 處理「十六進位加連字號」_以及_ 純十六進位（不含連字號）格式。

我們在此版本中也引入了專門用於「十六進位加連字號」格式操作的函式：

* `parseHexDash()` 從「十六進位加連字號」格式剖析 UUID。
* `toHexDashString()` 將 `Uuid` 轉換為「十六進位加連字號」格式的 `String`（鏡像 `toString()` 的功能）。

這些函式的運作方式類似於先前為十六進位格式引入的 [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html)
和 [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html)。剖析和格式化功能的明確命名應能提高程式碼清晰度並改善您使用 UUID 的整體體驗。

Kotlin 中的 UUID 現在具備 `Comparable` 特性。從 Kotlin 2.1.20 開始，您可以直接比較和排序 `Uuid`
型別的值。這使得可以使用 `<` 和 `>` 運算子，以及僅適用於 `Comparable` 型別或其集合的標準函式庫擴充（例如 `sorted()`），並且還允許將 UUID 傳遞給任何需要 `Comparable` 介面的函式或 API。

請記住，標準函式庫中的 UUID 支援仍處於[實驗性](components-stability.md#stability-levels-explained)階段。
若要加入，請使用 `@OptIn(ExperimentalUuidApi::class)` 註解或編譯器選項 `-opt-in=kotlin.uuid.ExperimentalUuidApi`：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

//sampleStart
@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse() 接受純十六進位格式的 UUID
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // 將其轉換為十六進位加連字號格式
    val hexDashFormat = uuid.toHexDashString()
 
    // 輸出十六進位加連字號格式的 UUID
    println(hexDashFormat)

    // 以遞增順序輸出 UUID
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

從 Kotlin 2.1.20 開始，標準函式庫提供了表示某個時刻的能力。此功能
以前僅在 Kotlin 官方函式庫 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 中提供。

`kotlinx.datetime.Clock` 介面
作為 [`kotlin.time.Clock`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/-clock/) 引入標準函式庫，而 `kotlinx.datetime.Instant`
類別則作為 [`kotlin.time.Instant`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/-instant/) 引入。這些概念與標準函式庫中的 `time` 套件自然契合，因為
它們僅關注時刻，而較為複雜的行事曆和時區功能則保留在 `kotlinx-datetime` 中。

當您需要精確的時間追蹤而不考慮時區或日期時，`Instant` 和 `Clock` 非常有用。例如，
您可以使用它們來記錄帶有時間戳記的事件、測量兩個時間點之間的持續時間，以及獲取系統處理程序的當前時刻。

為了提供與其他語言的互通性，我們提供了額外的轉換函式：

* [`.toKotlinInstant()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-kotlin-instant.html) 將時間值轉換為 `kotlin.time.Instant` 實體。
* [`.toJavaInstant()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-java-instant.html) 將 `kotlin.time.Instant` 值轉換為 `java.time.Instant` 值。
* [`Instant.toJSDate()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-j-s-date.html) 將 `kotlin.time.Instant` 值轉換為 JS `Date` 類別的實體。此轉換
  不精確；JS 使用毫秒精度來表示日期，而 Kotlin 則允許納秒解析度。

標準函式庫的新時間功能仍處於[實驗性](components-stability.md#stability-levels-explained)階段。
若要加入，請使用 `@OptIn(ExperimentalTime::class)` 註解：

```kotlin
import kotlin.time.*

@OptIn(ExperimentalTime::class)
fun main() {

    // 獲取當前時刻
    val currentInstant = Clock.System.now()
    println("目前時間：$currentInstant")

    // 計算兩個時刻之間的差異
    val pastInstant = Instant.parse("2023-01-01T00:00:00Z")
    val duration = currentInstant - pastInstant

    println("自 2023-01-01 以來經過的時間：$duration")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

有關實作的更多資訊，請參閱此 [KEEP 提案](https://github.com/Kotlin/KEEP/pull/387/files)。

## Compose 編譯器

在 2.1.20 中，Compose 編譯器放寬了先前版本中對 `@Composable` 函式引入的一些限制。
此外，Compose 編譯器 Gradle 外掛程式預設設定為包含原始碼資訊，使所有平台上的行為與 Android 一致。

### 支援開放型 (open) `@Composable` 函式中具備預設值的參數

編譯器以前限制在開放型 `@Composable` 函式中使用具備預設值的參數，原因是編譯器輸出錯誤，
這會導致執行階段崩潰。根本問題現在已解決，且在使用 Kotlin 2.1.20 或更高版本時，完全支援具備預設值的參數。

Compose 編譯器在 [1.5.8 版本](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8)之前允許開放型函式中具備預設值的參數，
因此支援情況取決於專案配置：

* 如果開放型可組合函式是使用 Kotlin 2.1.20 或更高版本編譯的，編譯器會為具備預設值的參數產生正確的
  包裝函式。這包括與 1.5.8 之前版本二進制檔相容的包裝函式，這意味著下游函式庫也能夠使用此開放型函式。
* 如果開放型可組合函式是使用早於 2.1.20 的 Kotlin 版本編譯的，Compose 會使用相容模式，這
  可能會導致執行階段崩潰。使用相容模式時，編譯器會發出警告以突顯潛在問題。

### 允許最終覆寫 (final overridden) 函式為可重新啟動

虛擬函式（`open` 和 `abstract` 的覆寫，包括介面）[在 2.1.0 版本發佈時被強制要求為不可重新啟動](whatsnew21.md#changes-to-open-and-overridden-composable-functions)。
此限制現在對於身為最終類別成員或本身為 `final` 的函式放寬了 – 它們將像往常一樣被重新啟動或略過。

升級至 Kotlin 2.1.20 後，您可能會觀察到受影響函式的一些行為變化。若要強制執行先前版本中的不可重新啟動
邏輯，請將 `@NonRestartableComposable` 註解套用於該函式。

### `ComposableSingletons` 從公開 API 中移除

`ComposableSingletons` 是 Compose 編譯器在優化 `@Composable` lambda 時建立的一個類別。不擷取
任何參數的 lambda 會被分配一次並快取在類別的屬性中，從而節省執行階段的分配。
該類別產生時具有內部 (internal) 可見性，且僅旨在優化編譯單元（通常是檔案）內部的 lambda。

然而，此優化也套用於 `inline` 函式主體，這導致單例 lambda 實體洩漏到公開 API 中。為了修正此問題，從 2.1.20 開始，`@Composable` lambda 不再於內嵌函式內部優化為單例。同時，Compose 編譯器將繼續為內嵌函式產生單例類別
和 lambda，以支援在先前模型下編譯的模組的二進制相容性。

### 預設包含原始碼資訊

Compose 編譯器 Gradle 外掛程式已經在 Android 上預設啟用了[包含原始碼資訊](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html)
功能。從 Kotlin 2.1.20 開始，此功能將在所有平台上預設啟用。

請記得檢查您是否使用 `freeCompilerArgs` 設定了此選項。由於該選項實際上被設定了兩次，此方法在與外掛程式同時使用時
可能會導致建置失敗。

## 破壞性變更與棄用

* 為了使 Kotlin Multiplatform 與 Gradle 即將發生的變更保持一致，我們正在逐步淘汰 `withJava()` 函式。
  [Java 原始碼集現在預設建立](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#java-source-sets-created-by-default)。如果您使用 [Java 測試夾具](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle 外掛程式，
  請直接升級至 [Kotlin 2.1.21](releases.md#release-history) 以避免相容性問題。
* JetBrains 小組正繼續進行 `kotlin-android-extensions` 外掛程式的棄用工作。如果您嘗試在專案中
  使用它，現在會收到配置錯誤，且不會執行任何外掛程式程式碼。
* 舊有的 `kotlin.incremental.classpath.snapshot.enabled` 屬性已從 Kotlin Gradle 外掛程式中移除。
  該屬性曾用於提供在 JVM 上還原為內建 ABI 快照的機會。該外掛程式現在使用
  其他方法來偵測並避免不必要的重新編譯，這使得該屬性變得多餘。

## 文件更新

Kotlin 文件已收到一些顯著變更：

### 更新和新增的頁面

* [Kotlin 路線圖](roadmap.md) – 參閱更新後的 Kotlin 語言和生態系統演進優先順序清單。
* [Gradle 最佳實務](gradle-best-practices.md)頁面 – 學習優化 Gradle 建置並提高效能的關鍵最佳實務。
* [Compose Multiplatform 與 Jetpack Compose](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-and-jetpack-compose.html)
  – 這兩個 UI 框架之間關係的概覽。
* [Kotlin Multiplatform 與 Flutter](https://kotlinlang.org/docs/multiplatform/kotlin-multiplatform-flutter.html)
  – 參閱兩個流行跨平台框架的比較。
* [與 C 的互通性](native-c-interop.md) – 探索 Kotlin 與 C 互通性的詳細資訊。
* [數字](numbers.md) – 了解代表數字的不同 Kotlin 型別。

### 新增和更新的教學

* [將您的函式庫發佈至 Maven Central](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-libraries.html)
  – 了解如何將 KMP 函式庫構件發佈至最流行的 Maven 存儲庫。
* [將 Kotlin/Native 作為動態函式庫](native-dynamic-libraries.md) – 建立動態 Kotlin 函式庫。
* [將 Kotlin/Native 作為 Apple 框架](apple-framework.md) – 建立您自己的框架，並在 macOS 和 iOS 的
  Swift/Objective-C 應用程式中使用 Kotlin/Native 程式碼。

## 如何更新至 Kotlin 2.1.20

從 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛程式作為
IDE 隨附的外掛程式進行分發。這意味著您無法再從 JetBrains Marketplace 安裝該外掛程式。

若要更新至新的 Kotlin 版本，請在建置指令碼中[將 Kotlin 版本變更](releases.md#update-to-a-new-kotlin-version)
為 2.1.20。