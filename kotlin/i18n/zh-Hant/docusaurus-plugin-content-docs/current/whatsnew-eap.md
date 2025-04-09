---
title: "Kotlin 2.1.20-RC3 的新特性"
---
_[發布日期：2025 年 3 月 14 日](eap#build-details)_

:::note
本文檔未涵蓋「搶先體驗預覽版 (Early Access Preview, EAP)」的所有功能，
但重點介紹了一些重大改進。

請參閱 [GitHub 變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20-RC3) 以取得完整的變更清單。

:::

Kotlin 2.1.20-RC3 版本已發布！
以下是此 EAP 版本的一些詳細資訊：

* [](#kotlin-k2-compiler-new-default-kapt-plugin)
* [](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* [](#kotlin-native-new-inlining-optimization)
* [Kotlin/Wasm：預設自訂格式器及遷移至 Provider API](#kotlin-wasm)
* [Gradle：支援 Gradle 8.11、與 Isolated Projects 相容，以及自訂發布變體](#support-for-adding-custom-gradle-publication-variants)
* [標準函式庫：通用原子類型、改進的 UUID 支援及新的時間追蹤功能](#standard-library)
* [](#compose-compiler-source-information-included-by-default)

## IDE 支援

支援 2.1.20-RC3 的 Kotlin 外掛程式 (plugin) 捆綁在最新的 IntelliJ IDEA 和 Android Studio 中。
您無需更新 IDE 中的 Kotlin 外掛程式。
您只需在您的建置腳本中將 [Kotlin 版本變更](configure-build-for-eap) 為 2.1.20-RC3。

請參閱 [更新至新版本](releases#update-to-a-new-kotlin-version) 以取得詳細資訊。

## Kotlin K2 編譯器：新的預設 kapt 外掛程式

從 Kotlin 2.1.20-RC3 開始，kapt 編譯器外掛程式的 K2 實作預設為
所有專案啟用。

JetBrains 團隊早在 Kotlin 1.9.20 中就推出了具有 K2 編譯器的 kapt 外掛程式的新實作。
從那時起，我們進一步開發了 K2 kapt 的內部實作，並使其行為與
K1 版本的行為相似，同時顯著提高了其效能。

如果您在使用具有 K2 編譯器的 kapt 時遇到任何問題，
您可以暫時回復到先前的外掛程式實作。

為此，請將以下選項新增至您專案的 `gradle.properties` 檔案中：

```kotlin
kapt.use.k2=false
```

請將任何問題回報給我們的 [問題追蹤器 (issue tracker)](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)。

## Kotlin Multiplatform：新的 DSL 取代 Gradle 的 Application 外掛程式

從 Gradle 8.7 開始，[Application](https://docs.gradle.org/current/userguide/application_plugin.html) 外掛程式
不再與 Kotlin Multiplatform Gradle 外掛程式相容。Kotlin 2.1.20-RC3 引入了一個實驗性 (Experimental)
DSL 以實現類似的功能。新的 `executable {}` 區塊配置執行任務和適用於 JVM 目標的 Gradle
[發布 (distributions)](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)。

在使用 DSL 之前，請將以下內容新增至您的建置腳本：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

然後，新增新的 `executable {}` 區塊。例如：

```kotlin
kotlin {
    jvm {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        binaries {
            // 在此目標中，為 "main" 編譯配置名為 "runJvm" 的 JavaExec 任務和 Gradle 發布
            executable {
                mainClass.set("foo.MainKt")
            }

            // 配置名為 "runJvmAnother" 的 JavaExec 任務和適用於 "main" 編譯的 Gradle 發布
            executable(KotlinCompilation.MAIN_COMPILATION_NAME, "another") {
                // 設定不同的類別
                mainClass.set("foo.MainAnotherKt")
            }

            // 配置名為 "runJvmTest" 的 JavaExec 任務和適用於 "test" 編譯的 Gradle 發布
            executable(KotlinCompilation.TEST_COMPILATION_NAME) {
                mainClass.set("foo.MainTestKt")
            }

            // 配置名為 "runJvmTestAnother" 的 JavaExec 任務和適用於 "test" 編譯的 Gradle 發布
            executable(KotlinCompilation.TEST_COMPILATION_NAME, "another") {
                mainClass.set("foo.MainAnotherTestKt")
            }
        }
    }
}
```

在此範例中，Gradle 的 [發布 (Distribution)](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)
外掛程式應用於第一個 `executable {}` 區塊。

如果您遇到任何問題，請在我們的 [問題追蹤器](https://kotl.in/issue) 中回報，或在我們的
[公開 Slack 頻道](https://kotlinlang.slack.com/archives/C19FD9681) 中告知我們。

## Kotlin/Native：新的內聯最佳化

Kotlin 2.1.20-RC3 引入了新的內聯最佳化傳遞 (pass)，該傳遞發生在實際程式碼產生
階段之前。

Kotlin/Native 編譯器中的新內聯傳遞應比標準 LLVM 內聯器執行得更好，並提高
產生程式碼的執行階段效能。

新的內聯傳遞目前為 [實驗性](components-stability#stability-levels-explained)。若要試用，
請使用以下編譯器選項：

```none
-Xbinary=preCodegenInlineThreshold=40
```

我們的實驗表明，40 是最佳化的良好折衷閾值。根據我們的基準測試，這
可將整體效能提高 9.5%。當然，您也可以嘗試其他值。

如果您遇到二進位檔大小或編譯時間增加的情況，請在 [YouTrack](https://kotl.in/issue) 中回報此類問題。

## Kotlin/Wasm

### 預設啟用自訂格式器

以前，您必須 [手動配置](whatsnew21#improved-debugging-experience-for-kotlin-wasm) 自訂格式器
，以便在使用 Kotlin/Wasm 程式碼時改進 Web 瀏覽器中的偵錯。

在此版本中，自訂格式器預設在開發版本中啟用，因此不需要額外的 Gradle 配置。

若要使用此功能，您只需要確保在瀏覽器的開發人員工具中啟用自訂格式器：

* 在 Chrome DevTools 中，它可以透過 **Settings | Preferences | Console** 取得：

  <img src="/img/wasm-custom-formatters-chrome.png" alt="Enable custom formatters in Chrome" width="400" style={{verticalAlign: 'middle'}}/>

* 在 Firefox DevTools 中，它可以透過 **Settings | Advanced settings** 取得：

  <img src="/img/wasm-custom-formatters-firefox.png" alt="Enable custom formatters in Firefox" width="400" style={{verticalAlign: 'middle'}}/>

此變更主要影響開發版本。如果您對生產版本有特定要求，
則需要相應地調整您的 Gradle 配置。將以下編譯器選項新增至 `wasmJs {}` 區塊：

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

### Kotlin/Wasm 和 Kotlin/JS 屬性遷移至 Provider API

以前，Kotlin/Wasm 和 Kotlin/JS 擴充功能中的屬性是可變的 (`var`)，並直接在建置
腳本中指定：

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

現在，屬性透過 [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html) 公開，
您必須使用 `.set()` 函數來指定值：

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API 可確保延遲計算值，並與任務相依性正確整合，從而提高建置
效能。

透過此變更，直接屬性指定已棄用，而改用 `*EnvSpec` 類別，
例如 `NodeJsEnvSpec` 和 `YarnRootEnvSpec`。

此外，為了避免混淆，已移除多個別名任務：

| 已棄用任務           | 替換                                                            |
|------------------------|-----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` 或 `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` 或 `jsBrowserDistribution`         |

如果您僅在建置腳本中使用 Kotlin/JS 或 Kotlin/Wasm，則無需採取任何動作，因為 Gradle 會自動處理
指定。

但是，如果您維護基於 Kotlin Gradle 外掛程式的外掛程式，並且您的外掛程式未應用 `kotlin-dsl`，則
必須更新屬性指定以使用 `.set()` 函數。

## Gradle

### 支援 8.11 版
Kotlin %kotlinEapVersion% 現在與最新的穩定 Gradle 版本 8.11 相容，並支援其功能。

### Kotlin Gradle 外掛程式與 Gradle 的 Isolated Projects 相容

:::note
此功能目前在 Gradle 中處於預先 Alpha 狀態。
僅將其與 Gradle 8.10 或更高版本搭配使用，且僅用於評估目的。

自 Kotlin 2.1.0 起，您就可以在您的專案中 [預覽 Gradle 的 Isolated Projects 功能](whatsnew21#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

以前，您必須配置 Kotlin Gradle 外掛程式，才能使您的專案與 Isolated Projects
功能相容，然後才能試用它。在 Kotlin %kotlinEapVersion% 中，不再需要這個額外步驟。

現在，若要啟用 Isolated Projects 功能，您只需要 [設定系統屬性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。

Kotlin Gradle 外掛程式中支援 Gradle 的 Isolated Projects 功能，適用於多平台專案和
僅包含 JVM 或 Android 目標的專案。

特別是對於多平台專案，如果您在升級後注意到 Gradle 建置出現問題，您可以選擇退出
新的 Kotlin Gradle 外掛程式行為，方法是設定：

```none
kotlin.kmp.isolated-projects.support=disable
```

但是，如果您在您的多平台專案中使用此 Gradle 屬性，則無法使用 Isolated Projects 功能。

我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中提供有關此功能的意見反應。

### 支援新增自訂 Gradle 發布變體

Kotlin %kotlinEapVersion% 引入了對新增自訂 [Gradle 發布變體](https://docs.gradle.org/current/userguide/variant_attributes.html) 的支援。
此功能適用於多平台專案和以 JVM 為目標的專案。

您無法使用此功能修改現有的 Gradle 變體。

:::

此功能為 [實驗性](components-stability#stability-levels-explained)。
若要選擇加入，請使用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 註釋。

若要新增自訂 Gradle 發布變體，請叫用 `adhocSoftwareComponent()` 函數，該函數傳回
[`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html) 的執行個體
，您可以在 Kotlin DSL 中配置該執行個體：

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
        // 傳回 AdhocSoftwareComponent 的執行個體
        adhocSoftwareComponent()
        // 或者，您可以在 DSL 區塊中配置 AdhocSoftwareComponent，如下所示
        adhocSoftwareComponent {
            // 使用 AdhocSoftwareComponent API 在此處新增您的自訂變體
        }
    }
}
```

:::tip
有關變體的更多資訊，請參閱 Gradle 的 [自訂發布指南](https://docs.gradle.org/current/userguide/publishing_customization.html)。

:::

## 標準函式庫

### 通用原子類型

在 Kotlin %kotlinEapVersion% 中，我們正在標準函式庫的 `kotlin.concurrent.atomics`
套件中引入通用原子類型，從而能夠為執行緒安全操作提供共享的、與平台無關的程式碼。這簡化了 Kotlin
Multiplatform 專案的開發，因為無需跨來源集複製相依於原子的邏輯。

`kotlin.concurrent.atomics` 套件及其屬性為 [實驗性](components-stability#stability-levels-explained)。
若要選擇加入，請使用 `@OptIn(ExperimentalAtomicApi::class)` 註釋或編譯器選項 `-opt-in=kotlin.ExperimentalAtomicApi`。

以下範例顯示瞭如何使用 `AtomicInt` 安全地計算跨多個執行緒處理的項目：

```kotlin
// 匯入必要的函式庫
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

@OptIn(ExperimentalAtomicApi::class)
suspend fun main() {
    // 初始化已處理項目的原子計數器
    var processedItems = AtomicInt(0)
    val totalItems = 100
    val items = List(totalItems) { "item$it" }
    // 將項目分割成區塊，以供多個協程處理
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

    // 列印已處理項目的總數
    println("Total processed items: ${processedItems.load()}")
}
```

為了實現 Kotlin 的原子類型與 Java 的 [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html)
原子類型之間的無縫互通性，API 提供了 `.asJavaAtomic()` 和 `.asKotlinAtomic()` 擴充功能函數。在 JVM 上，Kotlin
原子類型和 Java 原子類型在執行階段是相同的類型，因此您可以將 Java 原子類型轉換為 Kotlin 原子類型，反之亦然，而不會產生任何額外負擔。

以下範例顯示瞭 Kotlin 和 Java 原子類型如何協同工作：

```kotlin
// 匯入必要的函式庫
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

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

```

### UUID 剖析、格式化和可比性方面的變更

JetBrains 團隊將繼續改進對 UUID 的支援，[該支援在 2.0.20 中引入到標準函式庫](whatsnew2020#support-for-uuids-in-the-common-kotlin-standard-library)。

以前，`parse()` 函數僅接受十六進位和破折號格式的 UUID。使用 Kotlin %kotlinEapVersion%，
您可以將 `parse()` 用於 _十六進位和破折號_格式和純十六進位 (沒有破折號) 格式。

我們也在此版本中引入了特定於使用十六進位和破折號格式的操作的函數：

* `parseHexDash()` 從十六進位和破折號格式剖析 UUID。
* `toHexDashString()` 將 `Uuid` 轉換為十六進位和破折號格式的 `String` (鏡像 `toString()` 的功能)。

這些函數的工作方式與 [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html)
和 [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) 類似，後者
是之前針對十六進位格式引入的。剖析和格式化功能的明確命名應可提高程式碼的清晰度，並改善您對 UUID 的整體體驗。

Kotlin 中的 UUID 現在是 `Comparable`。從 Kotlin %kotlinEapVersion% 開始，您可以直接比較和排序 `Uuid` 類型的值。
這能夠使用 `<` 和 `>` 運算子、標準函式庫擴充功能 (僅適用於 `Comparable` 類型或其集合，例如 `sorted()`)，
並允許將 UUID 傳遞給任何需要 `Comparable` 介面的函數或 API。

請記住，標準函式庫中的 UUID 支援仍然是 [實驗性](components-stability#stability-levels-explained)。
若要選擇加入，請使用 `@OptIn(ExperimentalUuidApi::class)` 註釋或編譯器選項 `-opt-in=kotlin.uuid.ExperimentalUuidApi`：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse() 接受純十六進位格式的 UUID
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // 將其轉換為十六進位和破折號格式
    val hexDashFormat = uuid.toHexDashString()

    // 以十六進位和破折號格式輸出 UUID
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

```

### 新的時間追蹤功能

從 Kotlin %kotlinEapVersion% 開始，標準函式庫提供表示時間點的能力。
此功能以前僅在 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) (一個官方 Kotlin 函式庫) 中可用。

[kotlinx.datetime.Clock](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-clock/)
介面作為 `kotlin.time.Clock` 引入到標準函式庫，而 [`kotlinx.datetime.Instant`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-instant/)
類別作為 `kotlin.time.Instant`。這些概念自然與標準函式庫中的 `time` 套件一致，因為
它們僅關注時間點，而不是更複雜的日曆和時區功能，而後者仍保留在 `kotlinx-datetime` 中。

當您需要精確的時間追蹤，而無需考慮時區或日期時，`Instant` 和 `Clock` 非常有用。
例如，您可以使用它們來記錄具有時間戳記的事件、測量兩個時間點之間的持續時間，
並取得系統程序的目前時刻。

為了提供與其他語言的互通性，還提供了其他轉換器函數：

* `.toKotlinInstant()` 將時間值轉換為 `kotlin.time.Instant` 執行個體。
* `.toJavaInstant()` 將 `kotlin.time.Instant` 值轉換為 `java.time.Instant` 值。
* `Instant.toJSDate()` 將 `kotlin.time.Instant` 值轉換為 JS `Date` 類別的執行個體。此轉換
  不精確，JS 使用毫秒精度來表示日期，而 Kotlin 允許奈秒解析度。

標準函式庫的新的時間功能仍然是 [實驗性](components-stability#stability-levels-explained)。
若要選擇加入，請使用 `@OptIn(ExperimentalTime::class)` 註釋：

```kotlin
import kotlin.time.*

@OptIn(ExperimentalTime::class)
fun main() {

    // 取得目前的時刻
    val currentInstant = Clock.System.now()
    println("Current time: $currentInstant")

    // 尋找兩個時刻之間的差異
    val pastInstant = Instant.parse("2023-01-01T00:00:00Z")
    val duration = currentInstant - pastInstant

    println("Time elapsed since 2023-01-01: $duration")
}
```

有關實作的更多資訊，請參閱此 [KEEP 提案](https://github.com/Kotlin/KEEP/pull/387/files)。

## Compose 編譯器：預設包含來源資訊

Compose 編譯器 Gradle 外掛程式能夠 [預設在所有平台上包含來源資訊](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html)。
`includeSourceInformation` 選項已為 Android 啟用，此變更使跨平台的外掛程式行為保持一致，並允許支援新的執行階段功能。

請記住檢查您是否使用 `freeCompilerArgs` 設定了此選項：當與外掛程式一起使用時，由於選項被設定兩次，它可能會導致
建置失敗。

## 重大變更和棄用

為了使 Kotlin Multiplatform 與 Gradle 中即將發生的變更保持一致，我們正在逐步淘汰 `withJava()` 函數。
[Java 來源集現在預設會建立](multiplatform-compatibility-guide#java-source-sets-created-by-default)。

## 如何更新至 Kotlin %kotlinEapVersion%

從 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛程式作為
捆綁外掛程式分發，該外掛程式包含在您的 IDE 中。這表示您無法再從 JetBrains Marketplace 安裝此外掛程式。
捆綁外掛程式支援即將推出的 Kotlin EAP 版本。

若要更新至新的 Kotlin EAP 版本，請在您的建置腳本中將 [Kotlin 版本變更](configure-build-for-eap#adjust-the-kotlin-version)
為 %kotlinEapVersion%。