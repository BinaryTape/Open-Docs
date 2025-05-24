---
title: "Kotlin 1.9.20 的新特性"
---
_[發布日期：2023 年 11 月 1 日](releases#release-details)_

Kotlin 1.9.20 版本已發布，適用於所有目標平台的 [K2 編譯器現在已進入 Beta 階段](#new-kotlin-k2-compiler-updates)，並且 [Kotlin Multiplatform 現在已穩定](#kotlin-multiplatform-is-stable)。此外，以下是一些主要亮點：

* [用於設定多平台專案的新預設層級範本](#template-for-configuring-multiplatform-projects)
* [Kotlin Multiplatform 中對 Gradle 組態快取的完整支援](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [預設在 Kotlin/Native 中啟用的自訂記憶體分配器](#custom-memory-allocator-enabled-by-default)
* [Kotlin/Native 中垃圾收集器的效能改進](#performance-improvements-for-the-garbage-collector)
* [Kotlin/Wasm 中的新增和重新命名目標](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [Kotlin/Wasm 標準函式庫中對 WASI API 的支援](#support-for-the-wasi-api-in-the-standard-library)

您也可以在此影片中找到更新的簡短概述：

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

## IDE 支援

支援 1.9.20 的 Kotlin 外掛程式可用於：

| IDE            | 支援的版本                               |
|----------------|----------------------------------------|
| IntelliJ IDEA  | 2023.1.x、2023.2.x、2023.x             |
| Android Studio | Hedgehog (2023.1.1)、Iguana (2023.2.1) |
:::note
從 IntelliJ IDEA 2023.3.x 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛程式會自動
包含並更新。您只需更新專案中的 Kotlin 版本即可。

:::

## 新的 Kotlin K2 編譯器更新

JetBrains 的 Kotlin 團隊正在持續穩定新的 K2 編譯器，它將帶來重大的效能改進、
加速新語言功能的開發、統一 Kotlin 支援的所有平台，並為
多平台專案提供更好的架構。

K2 目前處於所有目標平台的 **Beta** 階段。[在發布部落格文章中閱讀更多內容](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### 支援 Kotlin/Wasm

自此版本起，Kotlin/Wasm 支援新的 K2 編譯器。
[瞭解如何在您的專案中啟用它](#how-to-enable-the-kotlin-k2-compiler)。

### 使用 K2 預覽 kapt 編譯器外掛程式

:::note
kapt 編譯器外掛程式中對 K2 的支援是 [實驗性 (Experimental)](components-stability) 的。
需要選擇加入（請參閱以下詳細資訊），您應該僅將其用於評估目的。

在 1.9.20 中，您可以嘗試將 [kapt 編譯器外掛程式](kapt) 與 K2 編譯器搭配使用。
若要在您的專案中使用 K2 編譯器，請將下列選項新增至您的 `gradle.properties` 檔案：

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

或者，您可以依照下列步驟啟用 K2 for kapt：
1. 在您的 `build.gradle.kts` 檔案中，[將語言版本設定](gradle-compiler-options#example-of-setting-languageversion)為 `2.0`。
2. 在您的 `gradle.properties` 檔案中，新增 `kapt.use.k2=true`。

如果您在使用 kapt 與 K2 編譯器時遇到任何問題，請將其回報給我們的
[問題追蹤器](http://kotl.in/issue)。

### 如何啟用 Kotlin K2 編譯器

#### 在 Gradle 中啟用 K2

若要啟用和測試 Kotlin K2 編譯器，請使用具有下列編譯器選項的新語言版本：

```bash
-language-version 2.0
```

您可以在您的 `build.gradle.kts` 檔案中指定它：

```kotlin
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = "2.0"
        }
    }
}
```

#### 在 Maven 中啟用 K2

若要啟用和測試 Kotlin K2 編譯器，請更新您的 `pom.xml` 檔案的 `<project/>` 區段：

```xml
<properties>
    <kotlin.compiler.languageVersion>2.0</kotlin.compiler.languageVersion>
</properties>
```

#### 在 IntelliJ IDEA 中啟用 K2

若要在 IntelliJ IDEA 中啟用和測試 Kotlin K2 編譯器，請前往 **Settings** | **Build, Execution, Deployment** |
**Compiler** | **Kotlin Compiler** 並將 **Language Version** 欄位更新為 `2.0 (experimental)`。

### 提供您對新的 K2 編譯器的意見反應

我們將感謝您的任何意見反應！

* 在 Kotlin 上直接向 K2 開發人員提供您的意見反應
  Slack – [取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
* 回報您在使用新的 K2 編譯器時遇到的任何問題
  在 [我們的問題追蹤器](https://kotl.in/issue) 上。
* [啟用傳送使用統計資料選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以
  允許 JetBrains 收集有關 K2 使用情況的匿名資料。

## Kotlin/JVM

從 1.9.20 版開始，編譯器可以產生包含 Java 21 位元組碼的類別。

## Kotlin/Native

Kotlin 1.9.20 包含一個具有預設啟用的新記憶體分配器的 Stable 記憶體管理器、垃圾收集器的效能改進和其他更新：

* [預設啟用的自訂記憶體分配器](#custom-memory-allocator-enabled-by-default)
* [垃圾收集器的效能改進](#performance-improvements-for-the-garbage-collector)
* [`klib` 構件的增量編譯](#incremental-compilation-of-klib-artifacts)
* [管理函式庫連結問題](#managing-library-linkage-issues)
* [類別建構函式呼叫時的伴生物件初始化](#companion-object-initialization-on-class-constructor-calls)
* [所有 cinterop 宣告都需要選擇加入](#opt-in-requirement-for-all-cinterop-declarations)
* [連結器錯誤的自訂訊息](#custom-message-for-linker-errors)
* [移除舊版記憶體管理器](#removal-of-the-legacy-memory-manager)
* [變更我們的目標層級原則](#change-to-our-target-tiers-policy)

### 預設啟用的自訂記憶體分配器

Kotlin 1.9.20 隨附預設啟用的新記憶體分配器。它旨在取代先前的預設分配器
`mimaloc`，以使垃圾收集更有效率並改善 [Kotlin/Native 記憶體管理器](native-memory-manager) 的執行時間效能。

新的自訂分配器將系統記憶體劃分為頁面，允許依序獨立清除。
每個分配都會成為頁面內的記憶體區塊，且頁面會追蹤區塊大小。
不同的頁面類型會針對各種分配大小進行最佳化。
記憶體區塊的連續排列可確保有效率地反覆運算所有已分配的區塊。

當執行緒分配記憶體時，它會根據分配大小搜尋合適的頁面。
執行緒會維護一組適用於不同大小類別的頁面。
通常，給定大小的目前頁面可以容納分配。
如果沒有，執行緒會從共用分配空間要求不同的頁面。
此頁面可能已可用、需要清除或必須先建立。

新的分配器允許同時存在多個獨立的分配空間，
這將使 Kotlin 團隊能夠試驗不同的頁面配置，以進一步改善效能。

#### 如何啟用自訂記憶體分配器

從 Kotlin 1.9.20 開始，新的記憶體分配器是預設值。不需要額外的設定。

如果您遇到高記憶體消耗，您可以使用 Gradle 建置指令碼中的 `-Xallocator=mimalloc` 切換回 `mimaloc` 或系統分配器
或 `-Xallocator=std`。請在 [YouTrack](https://kotl.in/issue) 中報告此類問題，以協助
我們改善新的記憶體分配器。

如需新分配器設計的技術詳細資訊，請參閱此 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README)。

### 垃圾收集器的效能改進

Kotlin 團隊持續改善新的 Kotlin/Native 記憶體管理器的效能和穩定性。
此版本對垃圾收集器 (GC) 進行了許多重大變更，包括以下 1.9.20 亮點：

* [](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
* [](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### 完整平行標記以減少 GC 的暫停時間

先前，預設垃圾收集器僅執行部分平行標記。當 mutator 執行緒暫停時，
它會從自己的根目錄標記 GC 的開始，例如執行緒本機變數和呼叫堆疊。
同時，單獨的 GC 執行緒負責從全域根目錄以及所有 mutator 的根目錄標記開始，
這些 mutator 正在主動執行原生程式碼，因此未暫停。

此方法在全域物件數量有限且 mutator 執行緒花費
大量時間處於可執行狀態執行 Kotlin 程式碼時運作良好。但是，對於典型的 iOS 應用程式而言，情況並非如此。

現在，GC 使用完整的平行標記，將暫停的 mutator、GC 執行緒和選用的標記執行緒組合起來以處理
標記佇列。依預設，標記程序由以下項目執行：

* 已暫停的 mutator。它們不是處理自己的根目錄，然後在未主動執行程式碼時閒置，而是有助於
整個標記程序。
* GC 執行緒。這可確保至少有一個執行緒會執行標記。

這種新方法使標記程序更有效率，從而減少了 GC 的暫停時間。

#### 以大區塊追蹤記憶體以改善分配效能

先前，GC 排程器會個別追蹤每個物件的分配。但是，無論是新的預設自訂
分配器還是 `mimalloc` 記憶體分配器，都不會為每個物件分配單獨的儲存空間；它們會同時為多個物件分配大的區域。

在 Kotlin 1.9.20 中，GC 會追蹤區域而不是個別物件。這透過減少
在每次分配時執行的任務數量來加速小型物件的分配，因此有助於最大限度地減少垃圾收集器的記憶體使用量。

### klib 構件的增量編譯

此功能是 [實驗性 (Experimental)](components-stability#stability-levels-explained) 的。
它可能會隨時遭到捨棄或變更。需要選擇加入（請參閱以下詳細資訊）。
僅將其用於評估目的。我們將感謝您在 [YouTrack](https://kotl.in/issue) 中提供關於它的意見反應。

Kotlin 1.9.20 為 Kotlin/Native 引入了一種新的編譯時間最佳化。
現在可以部分增量編譯 `klib` 構件到原生程式碼中。

在偵錯模式下將 Kotlin 原始程式碼編譯為原生二進位檔時，編譯會經歷兩個階段：

1. 原始程式碼會編譯為 `klib` 構件。
2. `klib` 構件以及相依性會編譯為二進位檔。

為了最佳化第二階段的編譯時間，該團隊已經為相依性實作了編譯器快取。
它們只會編譯為原生程式碼一次，且每次編譯二進位檔時都會重複使用結果。
但是，從專案來源建置的 `klib` 構件始終會在每次專案變更時完全重新編譯為原生程式碼。

透過新的增量編譯，如果專案模組變更僅導致將原始程式碼部分重新編譯為
`klib` 構件，則只有一部分 `klib` 會進一步重新編譯為二進位檔。

若要啟用增量編譯，請將下列選項新增至您的 `gradle.properties` 檔案：

```none
kotlin.incremental.native=true
```

如果您遇到任何問題，請將此類案例回報給 [YouTrack](https://kotl.in/issue)。

### 管理函式庫連結問題

此版本改善了 Kotlin/Native 編譯器處理 Kotlin 函式庫中連結問題的方式。錯誤訊息現在
包括更多可讀的宣告，因為它們使用簽章名稱而不是雜湊，從而協助您更輕鬆地找到並修正問題。以下是一個範例：

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```
Kotlin/Native 編譯器會偵測協力廠商 Kotlin 函式庫之間的連結問題，並在執行時間報告錯誤。
如果一個協力廠商 Kotlin 函式庫的作者對另一個協力廠商 Kotlin 函式庫使用的實驗性
API 進行不相容的變更，您可能會遇到此類問題。

從 Kotlin 1.9.20 開始，編譯器依預設會以靜默模式偵測連結問題。您可以在您的專案中調整此設定：

* 如果您想要在您的編譯記錄中記錄這些問題，請使用 `-Xpartial-linkage-loglevel=WARNING` 編譯器選項啟用警告。
* 也可以使用 `-Xpartial-linkage-loglevel=ERROR` 將報告的警告的嚴重性提高到編譯錯誤。
在這種情況下，編譯會失敗，且您會在編譯記錄中取得所有錯誤。使用此選項可更仔細地檢查連結問題。

```kotlin
// 在 Gradle 建置檔案中傳遞編譯器選項的範例：
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // 若要將連結問題報告為警告：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=WARNING")

                // 若要將連結警告提高到錯誤：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```

如果您遇到此功能的非預期問題，您隨時可以使用
`-Xpartial-linkage=disable` 編譯器選項選擇退出。請隨時將此類案例回報給 [我們的問題追蹤器](https://kotl.in/issue)。

### 類別建構函式呼叫時的伴生物件初始化

從 Kotlin 1.9.20 開始，Kotlin/Native 後端會在類別建構函式中呼叫伴生物件的靜態初始化子：

```kotlin
class Greeting {
    companion object {
        init {
            print("Hello, Kotlin!") 
        }
    }
}

fun main() {
    val start = Greeting() // Prints "Hello, Kotlin!"
}
```

現在，此行為與 Kotlin/JVM 統一，其中伴生物件會在載入（解析）與 Java 靜態初始化子語意相符的對應類別時初始化。

現在，此功能的實作在平台之間更加一致，因此在 Kotlin
Multiplatform 專案中共用程式碼變得更容易。

### 所有 cinterop 宣告都需要選擇加入

從 Kotlin 1.9.20 開始，所有由 `cinterop` 工具從 C 和 Objective-C 函式庫（如
libcurl 和 libxml）產生的 Kotlin 宣告都標記有 `@ExperimentalForeignApi`。如果缺少選擇加入註解，您的程式碼將無法編譯。

此需求反映了匯入 C
和 Objective-C 函式庫的 [實驗性 (Experimental)](components-stability#stability-levels-explained) 狀態。我們建議您將其使用限制在專案中的特定區域。一旦我們開始穩定匯入，這將使您的移轉更容易。

至於隨 Kotlin/Native 提供的原生平台函式庫（如 Foundation、UIKit 和 POSIX），只有其中一些
API 需要使用 `@ExperimentalForeignApi` 選擇加入。在這種情況下，您會收到包含選擇加入需求的警告。

:::

### 連結器錯誤的自訂訊息

如果您是函式庫作者，您現在可以使用自訂訊息來協助您的使用者解決連結器錯誤。

如果您的 Kotlin 函式庫相依於 C 或 Objective-C 函式庫，例如，使用 [CocoaPods 整合](native-cocoapods)，
其使用者需要在機器本機上擁有這些相依函式庫，或在專案建置指令碼中明確設定它們。
如果不是這種情況，使用者過去會收到令人困惑的「找不到 Framework」訊息。

您現在可以在編譯失敗訊息中提供特定指示或連結。若要執行此操作，請將 `-Xuser-setup-hint`
編譯器選項傳遞給 `cinterop`，或將 `userSetupHint=message` 屬性新增至您的 `.def` 檔案。

### 移除舊版記憶體管理器

[新的記憶體管理器](native-memory-manager) 在 Kotlin 1.6.20 中引入，並在 1.7.20 中成為預設值。
自那時起，它一直在接收進一步的更新和效能改善，並且已變得穩定。

現在是完成淘汰週期並移除舊版記憶體管理器的時機。如果您仍在使用它，請從您的 `gradle.properties` 中移除
`kotlin.native.binary.memoryModel=strict` 選項，並遵循我們的 [移轉指南](native-migration-guide)
進行必要的變更。

### 變更我們的目標層級原則

我們已決定升級 [第 1 層支援](native-target-support#tier-1) 的需求。Kotlin 團隊現在
承諾為符合第 1 層資格的目標提供編譯器版本之間的來源和二進位相容性。它們
還必須定期使用 CI 工具進行測試，才能編譯和執行。目前，第 1 層包含以下 macOS 主機的目標：

* `macosX64`
* `macosArm64`
* `iosSimulatorArm64`
* `iosX64`

在 Kotlin 1.9.20 中，我們也移除了一些先前已淘汰的目標，即：

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxMips32`
* `linuxMipsel32`

請參閱目前 [支援的目標](native-target-support) 的完整清單。

## Kotlin Multiplatform

Kotlin 1.9.20 著重於 Kotlin Multiplatform 的穩定化，並透過新的專案精靈和其他值得注意的功能，在改善開發人員體驗方面邁出了新的一步：

* [Kotlin Multiplatform 已穩定](#kotlin-multiplatform-is-stable)
* [用於設定多平台專案的範本](#template-for-configuring-multiplatform-projects)
* [新的專案精靈](#new-project-wizard)
* [對 Gradle 組態快取的完整支援](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [更輕鬆地在 Gradle 中設定新的標準函式庫版本](#easier-configuration-of-new-standard-library-versions-in-gradle)
* [對協力廠商 cinterop 函式庫的預設支援](#default-support-for-third-party-cinterop-libraries)
* [在 Compose Multiplatform 專案中支援 Kotlin/Native 編譯快取](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
* [相容性指南](#compatibility-guidelines)

### Kotlin Multiplatform 已穩定

1.9.20 版本標誌著 Kotlin 演進中的一個重要里程碑：[Kotlin Multiplatform](multiplatform-intro) 終於
變得穩定。這表示該技術在您的專案中可以安全使用，並且 100% 準備好投入生產。它也
表示 Kotlin Multiplatform 的進一步開發將根據我們嚴格的 [向後相容性規則](https://kotlinfoundation.org/language-committee-guidelines/) 繼續進行。

請注意，Kotlin Multiplatform 的一些進階功能仍在發展中。使用它們時，您會收到一個警告，描述
您目前使用的功能的穩定性狀態。在使用 IntelliJ IDEA 中的任何實驗性功能之前，
您需要在 **Settings** | **Advanced Settings** | **Kotlin** | **Experimental Multiplatform** 中明確啟用它。

* 造訪 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)，以瞭解關於 Kotlin Multiplatform 穩定化和未來計畫的更多資訊。
* 查看 [Multiplatform 相容性指南](multiplatform-compatibility-guide)，以瞭解在穩定化過程中進行了哪些重大變更。
* 閱讀關於 [預期和實際宣告機制](multiplatform-expect-actual)，這是 Kotlin Multiplatform 的一個重要部分，也在此版本中部分穩定。

### 用於設定多平台專案的範本

從 Kotlin 1.9.20 開始，Kotlin Gradle 外掛程式會自動為熱門的多平台情境建立共用的來源集合。
如果您的專案設定是其中之一，則您不需要手動設定來源集合層級。
只需明確指定您的專案所需的目標即可。

由於預設層級範本（Kotlin Gradle 外掛程式的一項新功能），設定現在更容易。
它是內建於外掛程式中的來源集合層級的預先定義範本。
它包含 Kotlin 自動為您宣告的目標建立的中繼來源集合。
[請參閱完整範本](#see-the-full-hierarchy-template)。

#### 更輕鬆地建立您的專案

考慮一個以 Android 和 iPhone 裝置為目標，並且在 Apple silicon MacBook 上開發的多平台專案。
比較此專案在不同 Kotlin 版本之間的設定方式：
<table>
<tr>
<td>
Kotlin 1.9.0 及更早版本（標準設定）
</td>
<td>
Kotlin 1.9.20
</td>
</tr>
<tr>
<td>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val commonMain by getting

        val iosMain by creating {
            dependsOn(commonMain)
        }

        val iosArm64Main by getting {
            dependsOn(iosMain)
        }

        val iosSimulatorArm64Main by getting {
            dependsOn(iosMain)
        }
    }
}
```
</td>
<td>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    // iosMain 來源集合會自動建立
}
```
</td>
</tr>
</table>

請注意，使用預設層級範本如何大大減少了設定您的專案所需的樣板程式碼數量。

當您在您的程式碼中宣告 `androidTarget`、`iosArm64` 和 `iosSimulatorArm64` 目標時，Kotlin Gradle 外掛程式會從範本中找到
合適的共用來源集合，並為您建立它們。產生的層級如下所示：

<img src="/img/default-hierarchy-example.svg" alt="正在使用中的預設目標層級的範例" width="350" style={{verticalAlign: 'middle'}}/>

綠色來源集合實際上已建立並包含在專案中，而來自預設範本的灰色來源集合則會被忽略。

#### 使用來源集合的完成功能

為了更容易地使用已建立的專案結構，IntelliJ IDEA 現在為使用預設層級範本建立的來源集合提供完成功能：

<img src="/img/multiplatform-hierarchy-completion.animated.gif" alt="來源集合名稱的 IDE 完成功能" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

如果您嘗試存取不存在的來源集合，因為您尚未宣告相應的目標，Kotlin 也會向您發出警告。
在下面的範例中，沒有 JVM 目標（只有 `androidTarget`，它並不相同）。但讓我們嘗試使用 `jvmMain` 來源集合
，看看會發生什麼事：

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        jvmMain {
        }
    }
}
```

在這種情況下，Kotlin 會在建置記錄中報告警告：

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* `<-` register the 'jvm' target */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### 設定目標層級

從 Kotlin 1.9.20 開始，預設層級範本會自動啟用。在大多數情況下，不需要額外的設定。

但是，如果您正在移轉 1.9.20 之前建立的現有專案，如果您之前已手動引入中繼來源與 `dependsOn()`
呼叫，您可能會遇到警告。若要解決此問題，請執行下列動作：

* 如果您的中繼來源集合目前由預設層級範本涵蓋，請移除所有手動 `dependsOn()`
  呼叫以及使用 `by creating` 建構建立的來源集合。

  若要檢查所有預設來源集合的清單，請參閱 [完整層級範本](#see-the-full-hierarchy-template)。

* 如果您想要具有預設層級範本未提供的其他來源集合，例如，在 macOS 和 JVM 目標之間共用程式碼的來源集合，
  請透過使用 `applyDefaultHierarchyTemplate()` 明確地重新套用範本來調整層級
  ，並像往常一樣使用 `dependsOn()` 手動設定其他來源集合：

  ```kotlin
  kotlin {
      jvm()
      macosArm64()
      iosArm64()
      iosSimulatorArm64()

      // 明確套用預設層級。它將建立，例如，iosMain 來源集合：
      applyDefaultHierarchyTemplate()

      sourceSets {
          // 建立其他 jvmAndMacos 來源集合
          val jvmAndMacos by creating {
              dependsOn(commonMain.get())
          }

          macosArm64Main.get().dependsOn(jvmAndMacos)
          jvmMain.get().dependsOn(jvmAndMacos)
      }
  }
  ```

* 如果您的專案中已經存在與範本產生的來源集合具有完全相同的名稱的來源集合
  ，但這些來源集合是在不同的目標集合之間共用的，則目前無法修改
  範本來源集合之間的預設 `dependsOn` 關係。

  您可以在預設層級範本中，或在手動建立的範本中，找到適用於您目的的其他來源集合。另一種方法是完全選擇退出範本。

  若要選擇退出，請將 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 新增至您的 `gradle.properties`，並手動設定所有其他
  來源集合。

  我們目前正在開發一個用於建立您自己的層級範本的 API，以簡化此類案例中的設定程序。

#### 請參閱完整層級範本

當您宣告您的專案編譯成的目標時，
外掛程式會從範本中相應地挑選共用的來源集合，並在您的專案中建立它們。

<img src="/img/full-template-hierarchy.svg" alt="預設層級範本" style={{verticalAlign: 'middle'}}/>
:::note
此範例僅顯示專案的生產部分，省略了 `Main` 字尾
（例如，使用 `common` 而不是 `commonMain`）。但是，對於 `*Test` 來源，一切都是相同的。

### 新的專案精靈

JetBrains 團隊正在引入一種建立跨平台專案的新方式 – [Kotlin Multiplatform 網頁精靈](https://kmp.jetbrains.com)。

此新的 Kotlin Multiplatform 精靈的第一個實作涵蓋了最熱門的 Kotlin Multiplatform
用例。它整合了關於先前專案範本的所有意見反應，並使架構盡可能健全和
可靠。

新的精靈具有分散式架構，允許我們擁有統一的後端和
不同的前端，而網頁版本是第一步。我們正在考慮在未來實作 IDE 版本和
建立命令列工具。在網頁上，您始終會取得最新版本的精靈，而在
IDE 中，您需要等待下一個版本。

使用新的精靈，專案設定比以往任何時候都容易。您可以透過
選擇行動裝置、伺服器和桌面開發的目標平台來根據您的需求量身定制您的專案。我們也計畫在未來的版本中新增網頁開發。

<img src="/img/multiplatform-web-wizard.png" alt="Multiplatform 網頁精靈" width="400"/>

新的專案精靈現在是使用 Kotlin 建立跨平台專案的慣用方式。自 1.9.20 以來，Kotlin
外掛程式不再在 IntelliJ IDEA 中提供 **Kotlin Multiplatform** 專案精靈。

新的精靈將引導您輕鬆完成初始設定，使入門流程更加順暢。
如果您遇到任何問題，請將其回報給 [YouTrack](https://kotl.in/issue)，以協助我們改善您使用
精靈的體驗。

<a href="https://kmp.jetbrains.com">
   <img src="/img/multiplatform-create-project-button.png" alt="建立專案" />
</a>

### Kotlin Multiplatform 中對 Gradle 組態快取的完整支援

先前，我們引入了 Gradle 組態
快取的 [預覽](whatsnew19#preview-of-the-gradle-configuration-cache)，該快取適用於 Kotlin 多平台函式庫。透過 1.9.20，Kotlin Multiplatform 外掛程式更進一步。

它現在支援 [Kotlin CocoaPods Gradle 外掛程式](native-cocoapods-dsl-reference) 中的 Gradle 組態快取，
以及 Xcode 建置所需的整合任務，例如 `embedAndSignAppleFrameworkForXcode`。

現在，所有多平台專案都可以利用改善的建置時間。
Gradle 組態快取透過重複使用後續建置的組態階段的結果來加速建置程序。
如需更多詳細資訊和設定指示，請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)。

### 更輕鬆地在 Gradle 中設定新的標準函式庫版本

當您建立多平台專案時，會自動將標準函式庫 (`stdlib`) 的相依性新增至每個
來源集合。這是開始使用您的多平台專案的最簡單方式。

先前，如果您想要手動設定標準函式庫的相依性，您需要為
每個來源集合個別設定它。從 `kotlin-stdlib:1.9.20` 開始，您只需要在
`commonMain` 根來源集合中設定相依性 **一次**：
<table>
<tr>
<td>
標準函式庫版本 1.9.10 及更早版本
</td>
<td>
標準函式庫版本 1.9.20
</td>
</tr>
<tr>
<td>

```kotlin
kotlin {
    sourceSets {
        // 用於通用來源集合
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-common:1.9.10")
            }
        }

        // 用於 JVM 來源集合
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.10")
            }
        }

        // 用於 JS 來源集合
        val jsMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-js:1.9.10")
            }
        }
    }
}
```
</td>
<td>

```kotlin
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.20")
            }
        }
    }
}
```
</td>
</tr>
</table>

此變更是透過在標準函式庫的 Gradle 中繼資料中包含新資訊來實現的。這允許
Gradle 自動解析其他來源集合的正確標準函式庫構件。

### 對協力廠商 cinterop 函式庫的預設支援

Kotlin 1.9.20 新增了對具有
[Kotlin CocoaPods Gradle](native-cocoapods) 外掛程式的所有專案中的所有 cinterop 相依性的預設支援（而不是透過選擇加入的支援）。

這表示您現在可以共用更多原生程式碼，而不受限於平台特定相依性。例如，您可以將
[Pod 函式庫的相依性](native-cocoapods-libraries) 新增至 `iosMain` 共用來源集合。

先前，這僅適用於 Kotlin/Native
發行版隨附的 [平台特定函式庫](native-platform-libs)（如 Foundation、UIKit 和 POSIX）。預設情況下，現在所有協力廠商 Pod 函式庫都可以在共用來源集合中使用。您不再需要指定單獨的 Gradle 屬性來支援它們。

### 在 Compose Multiplatform 專案中支援 Kotlin/Native 編譯快取

此版本解決了與 Compose Multiplatform 編譯器外掛程式的相容性問題，該問題主要影響
iOS 的 Compose Multiplatform 專案。

若要解決此問題，您必須使用 `kotlin.native.cacheKind=none` Gradle 屬性來停用快取。但是，這種
解決方案帶來了效能成本：它減慢了編譯時間，因為快取在 Kotlin/Native 編譯器中不起作用。

現在問題已解決，您可以從您的 `gradle.properties` 檔案中移除 `kotlin.native.cacheKind=none`，並享受
您的 Compose Multiplatform 專案中改善的編譯時間。

如需關於改善編譯時間的更多秘訣，請參閱 [Kotlin/Native 文件](native-improving-compilation-time)。

### 相容性指南

設定您的專