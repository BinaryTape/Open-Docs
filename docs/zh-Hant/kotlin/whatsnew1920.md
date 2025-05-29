[//]: # (title: Kotlin 1.9.20 的新功能)

_[發布日期：2023 年 11 月 1 日](releases.md#release-details)_

Kotlin 1.9.20 版本已推出，[適用於所有目標的 K2 編譯器現已進入 Beta 階段](#new-kotlin-k2-compiler-updates)，
且 [Kotlin Multiplatform 現已穩定](#kotlin-multiplatform-is-stable)。此外，以下是一些主要亮點：

*   [用於設定多平台專案的新預設層級範本](#template-for-configuring-multiplatform-projects)
*   [Kotlin Multiplatform 中對 Gradle 配置快取的完整支援](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
*   [Kotlin/Native 中預設啟用自訂記憶體分配器](#custom-memory-allocator-enabled-by-default)
*   [Kotlin/Native 中垃圾回收器的效能改進](#performance-improvements-for-the-garbage-collector)
*   [Kotlin/Wasm 中新的和重新命名的目標](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
*   [標準函式庫中對 Kotlin/Wasm 的 WASI API 支援](#support-for-the-wasi-api-in-the-standard-library)

您也可以在以下影片中找到更新的簡短概述：

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

## IDE 支援

支援 1.9.20 的 Kotlin 外掛程式適用於：

| IDE            | 支援的版本                     |
|----------------|----------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x, 2023.x             |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |

> 從 IntelliJ IDEA 2023.3.x 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛程式會自動
> 包含並更新。您只需更新專案中的 Kotlin 版本即可。
>
{style="note"}

## 新的 Kotlin K2 編譯器更新

JetBrains 的 Kotlin 團隊正在持續穩定新的 K2 編譯器，這將帶來重大的效能改進，
加速新語言功能的開發，統一 Kotlin 支援的所有平台，並為多平台專案提供更好的架構。

K2 目前對所有目標都處於 **Beta** 階段。[請閱讀發布部落格文章了解更多](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### 支援 Kotlin/Wasm

自此版本以來，Kotlin/Wasm 支援新的 K2 編譯器。
[了解如何在專案中啟用它](#how-to-enable-the-kotlin-k2-compiler)。

### K2 的 kapt 編譯器外掛程式預覽

> kapt 編譯器外掛程式中對 K2 的支援是 [實驗性](components-stability.md) 的。
> 需要選擇啟用（詳情請見下文），且您應僅用於評估目的。
>
{style="warning"}

在 1.9.20 中，您可以嘗試將 [kapt 編譯器外掛程式](kapt.md) 與 K2 編譯器一起使用。
要在專案中使用 K2 編譯器，請將以下選項加入您的 `gradle.properties` 檔案：

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

或者，您可以透過完成以下步驟來為 kapt 啟用 K2：
1. 在您的 `build.gradle.kts` 檔案中，將 [語言版本設定](gradle-compiler-options.md#example-of-setting-languageversion) 為 `2.0`。
2. 在您的 `gradle.properties` 檔案中，新增 `kapt.use.k2=true`。

如果您在使用 kapt 與 K2 編譯器時遇到任何問題，請向我們的
[問題追蹤器](http://kotl.in/issue) 回報。

### 如何啟用 Kotlin K2 編譯器

#### 在 Gradle 中啟用 K2

要啟用和測試 Kotlin K2 編譯器，請使用具有以下編譯器選項的新語言版本：

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

要啟用和測試 Kotlin K2 編譯器，請更新您的 `pom.xml` 檔案的 `<project/>` 區段：

```xml
<properties>
    <kotlin.compiler.languageVersion>2.0</kotlin.compiler.languageVersion>
</properties>
```

#### 在 IntelliJ IDEA 中啟用 K2

要在 IntelliJ IDEA 中啟用和測試 Kotlin K2 編譯器，請前往 **Settings** | **Build, Execution, Deployment** |
**Compiler** | **Kotlin Compiler** 並將 **Language Version** 欄位更新為 `2.0 (experimental)`。

### 留下您對新 K2 編譯器的回饋

我們將不勝感激您的任何回饋！

*   直接在 Kotlin Slack 上向 K2 開發者提供回饋 – [取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
    並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
*   向 [我們的問題追蹤器](https://kotl.in/issue) 報告您使用新 K2 編譯器時遇到的任何問題。
*   [啟用「傳送使用統計資料」選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，
    以允許 JetBrains 收集有關 K2 使用的匿名資料。

## Kotlin/JVM

從版本 1.9.20 開始，編譯器可以生成包含 Java 21 位元組碼的類別。

## Kotlin/Native

Kotlin 1.9.20 包含一個穩定的記憶體管理器，預設啟用新的記憶體分配器，垃圾回收器效能改進以及其他更新：

*   [預設啟用自訂記憶體分配器](#custom-memory-allocator-enabled-by-default)
*   [垃圾回收器的效能改進](#performance-improvements-for-the-garbage-collector)
*   [`klib` 成品的增量編譯](#incremental-compilation-of-klib-artifacts)
*   [管理函式庫連結問題](#managing-library-linkage-issues)
*   [類別建構函式呼叫時的伴隨物件初始化](#companion-object-initialization-on-class-constructor-calls)
*   [所有 cinterop 宣告的選擇啟用要求](#opt-in-requirement-for-all-cinterop-declarations)
*   [連結器錯誤的自訂訊息](#custom-message-for-linker-errors)
*   [移除舊版記憶體管理器](#removal-of-the-legacy-memory-manager)
*   [更改我們的目標層級策略](#change-to-our-target-tiers-policy)

### 預設啟用自訂記憶體分配器

Kotlin 1.9.20 預設啟用新的記憶體分配器。它旨在取代先前的預設分配器 `mimalloc`，
以使垃圾回收更有效率，並改善 [Kotlin/Native 記憶體管理器](native-memory-manager.md) 的執行時效能。

新的自訂分配器將系統記憶體劃分為頁面，允許以連續順序獨立掃描。
每個分配都成為頁面內的記憶體區塊，頁面追蹤區塊大小。
不同的頁面類型針對各種分配大小進行了優化。
記憶體區塊的連續排列確保了對所有已分配區塊的有效迭代。

當執行緒分配記憶體時，它會根據分配大小搜尋合適的頁面。
執行緒維護一組用於不同大小類別的頁面。
通常，給定大小的當前頁面可以容納該分配。
如果不能，執行緒會從共享分配空間請求不同的頁面。
此頁面可能已經可用，需要掃描，或者必須先建立。

新的分配器允許同時存在多個獨立的分配空間，
這將使 Kotlin 團隊能夠實驗不同的頁面佈局，以進一步提高效能。

#### 如何啟用自訂記憶體分配器

從 Kotlin 1.9.20 開始，新的記憶體分配器是預設值。無需額外設定。

如果您遇到高記憶體消耗問題，可以在 Gradle 建置腳本中使用 `-Xallocator=mimalloc`
或 `-Xallocator=std` 切換回 `mimalloc` 或系統分配器。請在 [YouTrack](https://kotl.in/issue) 中回報此類問題，以幫助
我們改進新的記憶體分配器。

有關新分配器設計的技術細節，請參閱此 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。

### 垃圾回收器的效能改進

Kotlin 團隊持續改進新的 Kotlin/Native 記憶體管理器的效能和穩定性。
此版本對垃圾回收器 (GC) 進行了多項重大更改，包括以下 1.9.20 亮點：

*   [](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
*   [](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### 完全平行標記以減少 GC 的暫停時間

以前，預設的垃圾回收器只執行部分平行標記。當變異執行緒 (mutator thread) 暫停時，
它會從自己的根，例如執行緒局部變數和呼叫堆疊，開始標記 GC。
同時，一個單獨的 GC 執行緒負責從全域根以及所有正在執行原生程式碼且因此未暫停的變異執行緒的根開始標記。

這種方法在全域物件數量有限且變異執行緒花費大量時間在可執行狀態下執行 Kotlin 程式碼的情況下效果良好。然而，這對於典型的 iOS 應用程式而言並非如此。

現在 GC 使用完全平行標記，它結合了已暫停的變異執行緒、GC 執行緒和可選的標記執行緒來處理
標記佇列。預設情況下，標記過程由以下方式執行：

*   已暫停的變異執行緒。它們不處理自己的根然後在不積極執行程式碼時閒置，而是為整個標記過程做出貢獻。
*   GC 執行緒。這確保至少有一個執行緒會執行標記。

這種新方法使標記過程更有效率，減少了 GC 的暫停時間。

#### 以大區塊追蹤記憶體以改進分配效能

以前，GC 排程器單獨追蹤每個物件的分配。然而，新的預設自訂
分配器和 `mimalloc` 記憶體分配器都沒有為每個物件分配單獨的儲存空間；它們一次為多個物件分配大區域。

在 Kotlin 1.9.20 中，GC 追蹤區域而不是單個物件。這透過減少
每次分配時執行的任務數量，從而加速小物體的分配，並有助於最大限度地減少垃圾回收器的記憶體使用。

### `klib` 成品的增量編譯

> 此功能是 [實驗性](components-stability.md#stability-levels-explained) 的。
> 它可能隨時被放棄或更改。需要選擇啟用（詳情請見下文）。
> 僅用於評估目的。如果您有任何回饋，我們將不勝感激，請在 [YouTrack](https://kotl.in/issue) 中提供。
>
{style="warning"}

Kotlin 1.9.20 引入了針對 Kotlin/Native 的新編譯時間優化。
`klib` 成品編譯為原生程式碼現在是部分增量編譯。

在偵錯模式下將 Kotlin 原始碼編譯為原生二進位檔時，編譯會經過兩個階段：

1.  原始碼編譯為 `klib` 成品。
2.  `klib` 成品連同依賴項一起編譯為二進位檔。

為了優化第二階段的編譯時間，團隊已經為依賴項實作了編譯器快取。
它們只編譯為原生程式碼一次，並且每次編譯二進位檔時都會重複使用結果。
但從專案原始碼建置的 `klib` 成品在每次專案更改時總是完全重新編譯為原生程式碼。

透過新的增量編譯，如果專案模組更改只導致原始碼部分重新編譯為
`klib` 成品，則只有 `klib` 的一部分會進一步重新編譯為二進位檔。

要啟用增量編譯，請將以下選項新增到您的 `gradle.properties` 檔案中：

```none
kotlin.incremental.native=true
```

如果您遇到任何問題，請向 [YouTrack](https://kotl.in/issue) 回報。

### 管理函式庫連結問題

此版本改進了 Kotlin/Native 編譯器處理 Kotlin 函式庫中連結問題的方式。錯誤訊息現在
包含更具可讀性的宣告，因為它們使用簽章名稱而不是雜湊，幫助您更輕鬆地找到並解決問題。以下是一個範例：

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```
Kotlin/Native 編譯器檢測第三方 Kotlin 函式庫之間的連結問題並在執行時報告錯誤。
如果一個第三方 Kotlin 函式庫的作者對另一個第三方 Kotlin 函式庫使用的實驗性
API 進行了不相容的更改，您可能會遇到此類問題。

從 Kotlin 1.9.20 開始，編譯器預設在靜默模式下檢測連結問題。您可以在專案中調整此
設定：

*   如果您想將這些問題記錄在編譯日誌中，請使用 `-Xpartial-linkage-loglevel=WARNING` 編譯器選項啟用警告。
*   也可以使用 `-Xpartial-linkage-loglevel=ERROR` 將報告警告的嚴重性提高到編譯錯誤。
    在這種情況下，編譯會失敗，並且您會在編譯日誌中得到所有錯誤。使用此選項可以更仔細地檢查連結問題。

```kotlin
// 在 Gradle 建置檔案中傳遞編譯器選項的範例：
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // 將連結問題報告為警告：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=WARNING")

                // 將連結警告提高到錯誤：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```

如果您遇到此功能意外問題，您可以隨時使用
`-Xpartial-linkage=disable` 編譯器選項選擇退出。請隨時向 [我們的問題
追蹤器](https://kotl.in/issue) 回報此類情況。

### 類別建構函式呼叫時的伴隨物件初始化

從 Kotlin 1.9.20 開始，Kotlin/Native 後端在類別建構函式中呼叫伴隨物件的靜態初始化器：

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

現在此行為已與 Kotlin/JVM 統一，其中伴隨物件在載入（解析）相應類別時初始化，
這與 Java 靜態初始化器的語意相符。

現在此功能的實作在平台之間更加一致，在 Kotlin
Multiplatform 專案中共享程式碼變得更容易。

### 所有 cinterop 宣告的選擇啟用要求

從 Kotlin 1.9.20 開始，由 `cinterop` 工具從 C 和 Objective-C 函式庫（如 libcurl 和 libxml）生成的
所有 Kotlin 宣告都標有 `@ExperimentalForeignApi`。如果缺少選擇啟用註解，您的程式碼將無法編譯。

此要求反映了導入 C 和 Objective-C 函式庫的 [實驗性](components-stability.md#stability-levels-explained) 狀態。我們建議您將其使用範圍限制在專案的特定區域。這將使
我們開始穩定導入時，您的遷移更容易。

> 至於隨 Kotlin/Native 提供的原生平台函式庫（如 Foundation、UIKit 和 POSIX），只有
> 它們的一些 API 需要使用 `@ExperimentalForeignApi` 選擇啟用。在這種情況下，您會收到一個帶有選擇啟用要求的警告。
>
{style="note"}

### 連結器錯誤的自訂訊息

如果您是函式庫作者，您現在可以使用自訂訊息幫助使用者解決連結器錯誤。

如果您的 Kotlin 函式庫依賴於 C 或 Objective-C 函式庫，例如，使用 [CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)，
其使用者需要在機器上本地擁有這些依賴函式庫，或在專案建置腳本中明確配置它們。
如果不是這種情況，使用者通常會收到令人困惑的「找不到框架」訊息。

您現在可以在編譯失敗訊息中提供特定指令或連結。為此，請將 `-Xuser-setup-hint`
編譯器選項傳遞給 `cinterop`，或將 `userSetupHint=message` 屬性新增到您的 `.def` 檔案中。

### 移除舊版記憶體管理器

[新的記憶體管理器](native-memory-manager.md) 在 Kotlin 1.6.20 中引入，並在 1.7.20 中成為預設值。
從那時起，它一直獲得進一步的更新和效能改進，並已變得穩定。

現在是完成棄用週期並移除舊版記憶體管理器的時候了。如果您仍在使用它，請從 `gradle.properties` 中移除
`kotlin.native.binary.memoryModel=strict` 選項，並遵循我們的 [遷移指南](native-migration-guide.md)
進行必要的更改。

### 更改我們的目標層級策略

我們已決定提升對 [第 1 層支援](native-target-support.md#tier-1) 的要求。Kotlin 團隊現在
致力於為符合第 1 層資格的目標提供編譯器版本之間的原始碼和二進位檔相容性。它們還必須
定期使用 CI 工具進行測試，才能夠編譯和執行。目前，第 1 層包括 macOS 主機的以下目標：

*   `macosX64`
*   `macosArm64`
*   `iosSimulatorArm64`
*   `iosX64`

在 Kotlin 1.9.20 中，我們還移除了許多先前已棄用的目標，即：

*   `iosArm32`
*   `watchosX86`
*   `wasm32`
*   `mingwX86`
*   `linuxMips32`
*   `linuxMipsel32`

請參閱目前 [支援的目標](native-target-support.md) 的完整列表。

## Kotlin Multiplatform

Kotlin 1.9.20 專注於 Kotlin Multiplatform 的穩定化，並透過新的專案精靈和其他值得注意的功能，
在改進開發者體驗方面邁出了新的一步：

*   [Kotlin Multiplatform 已穩定](#kotlin-multiplatform-is-stable)
*   [配置多平台專案的範本](#template-for-configuring-multiplatform-projects)
*   [新的專案精靈](#new-project-wizard)
*   [對 Gradle 配置快取的完整支援](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
*   [在 Gradle 中更輕鬆地配置新標準函式庫版本](#easier-configuration-of-new-standard-library-versions-in-gradle)
*   [預設支援第三方 cinterop 函式庫](#default-support-for-third-party-cinterop-libraries)
*   [對 Compose Multiplatform 專案中 Kotlin/Native 編譯快取的支援](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
*   [相容性指南](#compatibility-guidelines)

### Kotlin Multiplatform 已穩定

1.9.20 版本標誌著 Kotlin 發展的一個重要里程碑：[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 最終
已穩定。這意味著該技術可以安全地用於您的專案，並且 100% 準備好用於生產環境。它也
意味著 Kotlin Multiplatform 的進一步開發將繼續遵循我們嚴格的 [向後相容性規則](https://kotlinfoundation.org/language-committee-guidelines/)。

請注意，Kotlin Multiplatform 的某些進階功能仍在發展中。使用它們時，您會收到一個警告，
描述您正在使用的功能的當前穩定狀態。在 IntelliJ IDEA 中使用任何實驗性功能之前，
您需要明確在 **Settings** | **Advanced Settings** | **Kotlin** | **Experimental Multiplatform** 中啟用它。

*   造訪 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)，了解更多關於 Kotlin Multiplatform 穩定化和未來計畫的資訊。
*   查閱 [Multiplatform 相容性指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html)，查看在穩定化過程中做出的重大更改。
*   閱讀 [預期與實際宣告機制](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html) 的資訊，這是 Kotlin Multiplatform 的重要部分，在此版本中也部分穩定。

### 配置多平台專案的範本

從 Kotlin 1.9.20 開始，Kotlin Gradle 外掛程式會為常見的多平台情境自動建立共享原始碼集。
如果您的專案設定屬於其中之一，則無需手動配置原始碼集層級。
只需明確指定專案所需的目標即可。

現在，由於預設層級範本（Kotlin Gradle 外掛程式的一項新功能）的緣故，設定變得更容易。
它是一個內建於外掛程式中的預定義原始碼集層級範本。
它包含 Kotlin 為您宣告的目標自動建立的中間原始碼集。
[查看完整範本](#see-the-full-hierarchy-template)。

#### 更輕鬆地建立您的專案

考慮一個同時針對 Android 和 iPhone 裝置，並在 Apple 晶片 MacBook 上開發的多平台專案。
比較此專案在不同 Kotlin 版本之間的設定方式：

<table>
   <tr>
       <td>Kotlin 1.9.0 及更早版本（標準設定）</td>
       <td>Kotlin 1.9.20</td>
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

    // The iosMain source set is created automatically
}
```

</td>
</tr>
</table>

請注意，使用預設層級範本如何顯著減少設定專案所需的樣板程式碼數量。

當您在程式碼中宣告 `androidTarget`、`iosArm64` 和 `iosSimulatorArm64` 目標時，Kotlin Gradle 外掛程式會從範本中找到
合適的共享原始碼集並為您建立。結果層級如下所示：

![預設目標層級的使用範例](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

綠色原始碼集實際已建立並包含在專案中，而預設範本中的灰色原始碼集則被忽略。

#### 使用原始碼集自動完成

為了讓建立的專案結構更容易使用，IntelliJ IDEA 現在為使用預設層級範本建立的原始碼集提供自動完成功能：

<img src="multiplatform-hierarchy-completion.animated.gif" alt="原始碼集名稱的 IDE 自動完成" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

如果您嘗試存取不存在的原始碼集，因為您尚未宣告相應的目標，Kotlin 也會發出警告。
在下面的範例中，沒有 JVM 目標（只有 `androidTarget`，這不相同）。但讓我們嘗試使用 `jvmMain` 原始碼集，
看看會發生什麼：

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

在這種情況下，Kotlin 會在建置日誌中報告一個警告：

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* <- register the 'jvm' target */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### 設定目標層級

從 Kotlin 1.9.20 開始，預設層級範本會自動啟用。在大多數情況下，無需額外設定。

然而，如果您正在遷移在 1.9.20 之前建立的現有專案，如果您之前曾手動透過 `dependsOn()`
呼叫引入中間原始碼，您可能會遇到警告。為了解決此問題，請執行以下操作：

*   如果您的中間原始碼集目前受預設層級範本涵蓋，請移除所有手動 `dependsOn()`
    呼叫和使用 `by creating` 建構建立的原始碼集。

    要檢查所有預設原始碼集的列表，請參閱 [完整層級範本](#see-the-full-hierarchy-template)。

*   如果您想擁有預設層級範本未提供的額外原始碼集，例如，在 macOS 和 JVM 目標之間
    共享程式碼的原始碼集，請透過使用 `applyDefaultHierarchyTemplate()` 明確重新應用範本
    並像往常一樣使用 `dependsOn()` 手動配置額外原始碼集來調整層級：

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()

        // 明確應用預設層級。它將建立例如 iosMain 原始碼集：
        applyDefaultHierarchyTemplate()

        sourceSets {
            // 建立一個額外的 jvmAndMacos 原始碼集
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }

            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

*   如果您的專案中已經存在與範本生成的名稱完全相同，但卻在不同目標集之間共享的原始碼集，
    目前沒有辦法修改範本原始碼集之間的預設 `dependsOn` 關係。

    您在這裡的一個選擇是為您的目的找到不同的原始碼集，無論是在預設層級範本中還是手動建立的。
    另一個選擇是完全選擇退出範本。

    要選擇退出，請在 `gradle.properties` 中新增 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 並手動配置所有其他
    原始碼集。

    我們目前正在開發一個 API，用於建立您自己的層級範本，以簡化此類情況下的設定過程。

#### 查看完整層級範本 {initial-collapse-state="collapsed" collapsible="true"}

當您宣告專案要編譯到的目標時，
外掛程式會相應地從範本中選取共享原始碼集並在您的專案中建立它們。

![預設層級範本](full-template-hierarchy.svg)

> 此範例僅顯示專案的生產部分，省略了 `Main` 後綴
> (例如，使用 `common` 而不是 `commonMain`)。然而，對於 `*Test` 原始碼也是一樣的。
>
{style="tip"}

### 新的專案精靈

JetBrains 團隊正在引入一種建立跨平台專案的新方式 – [Kotlin Multiplatform 網頁精靈](https://kmp.jetbrains.com)。

新的 Kotlin Multiplatform 精靈的首次實作涵蓋了最受歡迎的 Kotlin Multiplatform
用例。它整合了關於先前專案範本的所有回饋，並使架構盡可能穩健可靠。

新的精靈採用分散式架構，使我們能夠擁有統一的後端和
不同的前端，其中網頁版本是第一步。我們正在考慮未來實作 IDE 版本和
建立命令列工具。在網頁上，您總是能獲得最新版本的精靈，而在
IDE 中，您需要等待下一個版本。

透過新的精靈，專案設定比以往任何時候都更容易。您可以透過
選擇用於行動裝置、伺服器和桌面開發的目標平台來自訂您的專案。我們也計畫在未來版本中加入網頁開發。

<img src="multiplatform-web-wizard.png" alt="多平台網頁精靈" width="400"/>

新的專案精靈現在是使用 Kotlin 建立跨平台專案的首選方式。自 1.9.20 版以來，Kotlin
外掛程式不再在 IntelliJ IDEA 中提供 **Kotlin Multiplatform** 專案精靈。

新的精靈將輕鬆引導您完成初始設定，使新手入門過程更加順暢。
如果您遇到任何問題，請向 [YouTrack](https://kotl.in/issue) 回報，以幫助我們改進您的精靈使用體驗。

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="建立專案" style="block"/>
</a>

### 對 Gradle 配置快取的完整支援

以前，我們為 Kotlin 多平台函式庫引入了 Gradle 配置快取的[預覽](whatsnew19.md#preview-of-the-gradle-configuration-cache)。在 1.9.20 中，Kotlin Multiplatform 外掛程式更進一步。

它現在支援 [Kotlin CocoaPods Gradle 外掛程式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html) 中的 Gradle 配置快取，
以及 Xcode 建置所需的整合任務，例如 `embedAndSignAppleFrameworkForXcode`。

現在所有多平台專案都可以利用改進的建置時間。
Gradle 配置快取透過重複使用配置階段的結果來加速後續建置的過程。
有關更多詳細資訊和設定說明，請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)。

### 在 Gradle 中更輕鬆地配置新標準函式庫版本

當您建立多平台專案時，標準函式庫 (`stdlib`) 的依賴項會自動新增到每個
原始碼集中。這是開始使用多平台專案的最簡單方法。

以前，如果您想手動配置對標準函式庫的依賴，您需要單獨為每個原始碼集配置它。
從 `kotlin-stdlib:1.9.20` 開始，您只需在 `commonMain` 根原始碼集中**配置一次**依賴項：

<table>
   <tr>
       <td>標準函式庫版本 1.9.10 及更早版本</td>
       <td>標準函式庫版本 1.9.20</td>
   </tr>
   <tr>
<td>

```kotlin
kotlin {
    sourceSets {
        // 對於通用原始碼集
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-common:1.9.10")
            }
        }

        // 對於 JVM 原始碼集
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.10")
            }
        }

        // 對於 JS 原始碼集
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

此更改是透過在標準函式庫的 Gradle 後設資料中包含新資訊而實現的。這使得
Gradle 可以自動解析其他原始碼集的正確標準函式庫成品。

### 預設支援第三方 cinterop 函式庫

Kotlin 1.9.20 在應用了 [Kotlin CocoaPods Gradle](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) 外掛程式的專案中，
為所有 cinterop 依賴項新增了預設支援（而非選擇啟用支援）。

這意味著您現在可以共享更多原生程式碼，而不受平台特定依賴項的限制。例如，您可以新增
[對 Pod 函式庫的依賴](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html) 到 `iosMain` 共享原始碼集。

以前，這只適用於隨 Kotlin/Native 發行版提供的 [平台特定函式庫](native-platform-libs.md)
（如 Foundation、UIKit 和 POSIX）。現在所有第三方 Pod 函式庫預設在共享原始碼集中可用。
您不再需要指定單獨的 Gradle 屬性來支援它們。

### 對 Compose Multiplatform 專案中 Kotlin/Native 編譯快取的支援

此版本解決了與 Compose Multiplatform 編譯器外掛程式的相容性問題，該問題主要影響
適用於 iOS 的 Compose Multiplatform 專案。

為了解決此問題，您必須使用 `kotlin.native.cacheKind=none` Gradle 屬性停用快取。然而，此
解決方法會帶來效能成本：由於 Kotlin/Native 編譯器中快取無法運作，它會減慢編譯時間。

現在問題已解決，您可以從 `gradle.properties` 檔案中移除 `kotlin.native.cacheKind=none`，並在您的 Compose Multiplatform 專案中
享受改進的編譯時間。

有關改進編譯時間的更多技巧，請參閱 [Kotlin/Native 文件](native-improving-compilation-time.md)。

### 相容性指南

配置您的專案時，請檢查 Kotlin Multiplatform Gradle 外掛程式與可用 Gradle、Xcode
和 Android Gradle 外掛程式 (AGP) 版本的相容性：

| Kotlin Multiplatform Gradle 外掛程式 | Gradle | Android Gradle 外掛程式 | Xcode |
|---------------------------|------|----|----|
| 1.9.20        | 7.5 及更高版本 | 7.4.2–8.2 | 15.0。詳情請見下文 |

截至此版本，推薦的 Xcode 版本為 15.0。Xcode 15.0 隨附的函式庫已完全支援，
您可以從 Kotlin 程式碼中的任何地方存取它們。

然而，Xcode 14.3 在大多數情況下仍應能運作。請記住，如果您在本地機器上使用 14.3 版，
Xcode 15 隨附的函式庫將可見但無法存取。

## Kotlin/Wasm

在 1.9.20 中，Kotlin Wasm 達到了 [Alpha 穩定層級](components-stability.md)。

*   [與 Wasm GC 第 4 階段和最終操作碼的相容性](#compatibility-with-wasm-gc-phase-4-and-final-opcodes)
*   [新的 `wasm-wasi` 目標，以及將 `wasm` 目標重新命名為 `wasm-js`](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
*   [標準函式庫中對 WASI API 的支援](#support-for-the-wasi-api-in-the-standard-library)
*   [Kotlin/Wasm API 改進](#kotlin-wasm-api-improvements)

> Kotlin Wasm 是 [Alpha](components-stability.md) 版。
> 它隨時可能更改。僅用於評估目的。
>
> 如果您有任何回饋，我們將不勝感激，請在 [YouTrack](https://kotl.in/issue) 中提供。
>
{style="note"}

### 與 Wasm GC 第 4 階段和最終操作碼的相容性

Wasm GC 進入最終階段，它需要更新操作碼 – 二進位表示中使用的常數。
Kotlin 1.9.20 支援最新的操作碼，因此我們強烈建議您將 Wasm 專案更新到最新版本的 Kotlin。
我們還建議使用具有 Wasm 環境的最新版本瀏覽器：
*   Chrome 和基於 Chromium 的瀏覽器版本 119 或更高版本。
*   Firefox 版本 119 或更高版本。請注意，在 Firefox 119 中，您需要[手動啟用 Wasm GC](wasm-troubleshooting.md)。

### 新的 `wasm-wasi` 目標，以及將 `wasm` 目標重新命名為 `wasm-js`

在此版本中，我們將為 Kotlin/Wasm 引入一個新目標 – `wasm-wasi`。我們還將 `wasm` 目標重新命名為 `wasm-js`。
在 Gradle DSL 中，這些目標分別可用作 `wasmWasi {}` 和 `wasmJs {}`。

要在專案中使用這些目標，請更新 `build.gradle.kts` 檔案：

```kotlin
kotlin {
    wasmWasi {
        // ...
    }
    wasmJs {
        // ...
    }
}
```

先前引入的 `wasm {}` 區塊已棄用，改為使用 `wasmJs {}`。

要遷移您現有的 Kotlin/Wasm 專案，請執行以下操作：
*   在 `build.gradle.kts` 檔案中，將 `wasm {}` 區塊重新命名為 `wasmJs {}`。
*   在您的專案結構中，將 `wasmMain` 目錄重新命名為 `wasmJsMain`。

### 標準函式庫中對 WASI API 的支援

在此版本中，我們包含了對 [WASI](https://github.com/WebAssembly/WASI) 的支援，它是 Wasm 平台的系統介面。
WASI 支援使您更容易在瀏覽器之外使用 Kotlin/Wasm，例如在伺服器端應用程式中，
它提供了用於存取系統資源的標準化 API 集。此外，WASI 還提供了基於能力的安全性 – 存取外部資源時的另一層安全性。

要執行 Kotlin/Wasm 應用程式，您需要一個支援 Wasm 垃圾回收 (GC) 的 VM，例如 Node.js 或 Deno。
Wasmtime、WasmEdge 等仍在努力實現完整的 Wasm GC 支援。

要導入 WASI 函數，請使用 `@WasmImport` 註解：

```kotlin
import kotlin.wasm.WasmImport

@WasmImport("wasi_snapshot_preview1", "clock_time_get")
private external fun wasiRawClockTimeGet(clockId: Int, precision: Long, resultPtr: Int): Int
```

[您可以在我們的 GitHub 儲存庫中找到完整範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)。

> 在目標設定為 `wasmWasi` 時，無法使用 [與 JavaScript 的互通性](wasm-js-interop.md)。
>
{style="note"}

### Kotlin/Wasm API 改進

此版本為 Kotlin/Wasm API 帶來了多項使用體驗改進。
例如，您不再需要為 DOM 事件監聽器返回值：

<table>
   <tr>
       <td>1.9.20 之前</td>
       <td>1.9.20 版本</td>
   </tr>
   <tr>
<td>

```kotlin
fun main() {
    window.onload = {
        document.body?.sayHello()
        null
    }
}
```

</td>
<td>

```kotlin
fun main() {
    window.onload = { document.body?.sayHello() }
}
```

</td>
</tr>
</table>

## Gradle

Kotlin 1.9.20 完全相容於 Gradle 6.8.3 到 8.1。您也可以使用最新版本的 Gradle，
但請記住，您可能會遇到棄用警告或某些新的 Gradle 功能可能無法運作。

此版本帶來了以下更改：
*   [支援測試夾具存取內部宣告](#support-for-test-fixtures-to-access-internal-declarations)
*   [配置 Konan 目錄路徑的新屬性](#new-property-to-configure-paths-to-konan-directories)
*   [Kotlin/Native 任務的新建置報告指標](#new-build-report-metrics-for-kotlin-native-tasks)

### 支援測試夾具存取內部宣告

在 Kotlin 1.9.20 中，如果您使用 Gradle 的 `java-test-fixtures` 外掛程式，那麼您的 [測試夾具](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)
現在可以存取主原始碼集類別中的 `internal` 宣告。此外，任何測試原始碼也可以看到測試夾具類別中的任何
`internal` 宣告。

### 配置 Konan 目錄路徑的新屬性

在 Kotlin 1.9.20 中，`kotlin.data.dir` Gradle 屬性可用於自訂您的 `~/.konan` 目錄路徑，
這樣您就不必透過環境變數 `KONAN_DATA_DIR` 進行配置。

或者，您可以使用 `-Xkonan-data-dir` 編譯器選項，透過 `cinterop` 和 `konanc` 工具來配置您的自訂 `~/.konan` 目錄路徑。

### Kotlin/Native 任務的新建置報告指標

在 Kotlin 1.9.20 中，Gradle 建置報告現在包含 Kotlin/Native 任務的指標。以下是包含這些指標的建置報告範例：

```none
Total time for Kotlin tasks: 20.81 s (93.1 % of all tasks time)
Time   |% of Kotlin time|Task                            
15.24 s|73.2 %          |:compileCommonMainKotlinMetadata
5.57 s |26.8 %          |:compileNativeMainKotlinMetadata

Task ':compileCommonMainKotlinMetadata' finished in 15.24 s
Task info:
  Kotlin language version: 2.0
Time metrics:
  Total Gradle task time: 15.24 s
  Spent time before task action: 0.16 s
  Task action before worker execution: 0.21 s
  Run native in process: 2.70 s
    Run entry point: 2.64 s
Size metrics:
  Start time of task action: 2023-07-27T11:04:17

Task ':compileNativeMainKotlinMetadata' finished in 5.57 s
Task info:
  Kotlin language version: 2.0
Time metrics:
  Total Gradle task time: 5.57 s
  Spent time before task action: 0.04 s
  Task action before worker execution: 0.02 s
  Run native in process: 1.48 s
    Run entry point: 1.47 s
Size metrics:
  Start time of task action: 2023-07-27T11:04:32
```

此外，`kotlin.experimental.tryK2` 建置報告現在包含已編譯的任何 Kotlin/Native 任務，並列出
使用的語言版本：

```none
##### 'kotlin.experimental.tryK2' results #####
:lib:compileCommonMainKotlinMetadata: 2.0 language version
:lib:compileKotlinJvm: 2.0 language version
:lib:compileKotlinIosArm64: 2.0 language version
:lib:compileKotlinIosSimulatorArm64: 2.0 language version
:lib:compileKotlinLinuxX64: 2.0 language version
:lib:compileTestKotlinJvm: 2.0 language version
:lib:compileTestKotlinIosSimulatorArm64: 2.0 language version
:lib:compileTestKotlinLinuxX64: 2.0 language version
##### 100% (8/8) tasks have been compiled with Kotlin 2.0 #####
```

> 如果您使用 Gradle 8.0，您可能會遇到一些建置報告問題，尤其是在啟用 Gradle 配置快取時。
> 這是一個已知問題，已在 Gradle 8.1 及更高版本中修復。
>
{style="note"}

## 標準函式庫

在 Kotlin 1.9.20 中，[Kotlin/Native 標準函式庫已穩定](#the-kotlin-native-standard-library-becomes-stable)，
並有一些新功能：
*   [替換 Enum 類別的 values 泛型函數](#replacement-of-the-enum-class-values-generic-function)
*   [改進 Kotlin/JS 中 HashMap 操作的效能](#improved-performance-of-hashmap-operations-in-kotlin-js)

### 替換 Enum 類別的 values 泛型函數

> 此功能是 [實驗性](components-stability.md#stability-levels-explained) 的。它可能隨時被放棄或更改。
> 需要選擇啟用（詳情請見下文）。僅用於評估目的。如果您有任何回饋，我們將不勝感激，請在 [YouTrack](https://kotl.in/issue) 中提供。
>
{style="warning"}

在 Kotlin 1.9.0 中，列舉類別的 `entries` 屬性已穩定。`entries` 屬性是
`values()` 合成函數的現代且高效能替代方案。作為 Kotlin 1.9.20 的一部分，替換
泛型 `enumValues<T>()` 函數：`enumEntries<T>()`。

> 仍支援 `enumValues<T>()` 函數，但我們建議您改用 `enumEntries<T>()` 函數，
> 因為它對效能的影響較小。每次呼叫 `enumValues<T>()` 時，都會建立一個新陣列，
> 而每次呼叫 `enumEntries<T>()` 時，都會返回相同的列表，這效率更高。
>
{style="tip"}

例如：

```kotlin
enum class RGB { RED, GREEN, BLUE }

@OptIn(ExperimentalStdlibApi::class)
inline fun <reified T : Enum<T>> printAllValues() {
    print(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>()
// RED, GREEN, BLUE
```

#### 如何啟用 `enumEntries` 函數

要嘗試此功能，請選擇啟用 `@OptIn(ExperimentalStdlibApi)` 並使用語言版本 1.9 或更高版本。
如果您使用最新版本的 Kotlin Gradle 外掛程式，則無需指定語言版本即可測試該功能。

### Kotlin/Native 標準函式庫已穩定

在 Kotlin 1.9.0 中，我們[解釋](whatsnew19.md#the-kotlin-native-standard-library-s-journey-towards-stabilization) 了我們為使 Kotlin/Native 標準函式庫更接近穩定目標所採取的行動。
在 Kotlin 1.9.20 中，我們最終完成了這項工作，並使 Kotlin/Native 標準函式庫穩定。以下是此版本的一些亮點：

*   [`Vector128`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-vector128/) 類別已從 `kotlin.native` 套件移動到 `kotlinx.cinterop` 套件。
*   `ExperimentalNativeApi` 和 `NativeRuntimeApi` 註解（作為 Kotlin 1.9.0 的一部分引入）的選擇啟用要求級別已從 `WARNING` 提高到 `ERROR`。
*   Kotlin/Native 集合現在會檢測併發修改，例如在 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/) 和 [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/) 集合中。
*   `Throwable` 類別中的 [`printStackTrace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/print-stack-trace.html) 函數現在輸出到 `STDERR` 而不是 `STDOUT`。
  > `printStackTrace()` 的輸出格式不穩定且隨時可能更改。
  >
  {style="warning"}

#### Atomics API 的改進

在 Kotlin 1.9.0 中，我們表示當 Kotlin/Native 標準函式庫穩定時，Atomics API 將準備好穩定。
Kotlin 1.9.20 包含以下額外更改：

*   引入了實驗性 `AtomicIntArray`、`AtomicLongArray` 和 `AtomicArray<T>` 類別。這些新類別
    專門設計用於與 Java 的原子陣列保持一致，以便將來它們可以包含在通用標準函式庫中。
  > `AtomicIntArray`、`AtomicLongArray` 和 `AtomicArray<T>` 類別是
  > [實驗性](components-stability.md#stability-levels-explained) 的。它們可能隨時被放棄或更改。要
  > 嘗試它們，請選擇啟用 `@OptIn(ExperimentalStdlibApi)`。僅用於評估目的。如果您有任何回饋，我們將
  > 不勝感激，請在 [YouTrack](https://kotl.in/issue) 中提供。
  >
  {style="warning"}
*   在 `kotlin.native.concurrent` 套件中，在 Kotlin 1.9.0 中棄用級別為 `WARNING` 的 Atomics API 的棄用級別已提高到 `ERROR`。
*   在 `kotlin.concurrent` 套件中，[`AtomicInt`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-int/index.html) 和 [`AtomicLong`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-long/index.html) 類別中棄用級別為 `ERROR` 的成員函數已被移除。
*   `AtomicReference` 類別的所有 [成員函數](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-reference/#functions) 現在都使用原子內建函數。

有關 Kotlin 1.9.20 中所有更改的更多資訊，請參閱我們的 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-61028/Behavioural-changes-to-the-Native-stdlib-API)。

### 改進 Kotlin/JS 中 HashMap 操作的效能

Kotlin 1.9.20 改進了 Kotlin/JS 中 `HashMap` 操作的效能並減少了其記憶體佔用。在內部，
Kotlin/JS 已將其內部實作更改為開放定址。這意味著在以下情況下，您應該會看到效能改進：
*   將新元素插入 `HashMap`。
*   搜尋 `HashMap` 中現有元素。
*   迭代 `HashMap` 中的鍵或值。

## 文件更新

Kotlin 文件收到了一些值得注意的更改：
*   [JVM 後設資料](https://kotlinlang.org/api/kotlinx-metadata-jvm/) API 參考 – 探索如何使用 Kotlin/JVM 解析後設資料。
*   [時間測量指南](time-measurement.md) – 學習如何在 Kotlin 中計算和測量時間。
*   改進了 [Kotlin 之旅](kotlin-tour-welcome.md) 中的集合章節 – 學習 Kotlin 程式語言的基礎知識，其中包含理論和實踐。
*   [明確不可為空型別](generics.md#definitely-non-nullable-types) – 學習明確不可為空泛型型別。
*   改進的 [陣列頁面](arrays.md) – 學習陣列以及何時使用它們。
*   [Kotlin Multiplatform 中的預期與實際宣告](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html) – 學習 Kotlin Multiplatform 中預期與實際宣告的 Kotlin 機制。

## 安裝 Kotlin 1.9.20

### 檢查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2023.1.x 和 2023.2.x 自動建議將 Kotlin
外掛程式更新到 1.9.20 版。IntelliJ IDEA 2023.3 將包含 Kotlin 1.9.20 外掛程式。

Android Studio Hedgehog (231) 和 Iguana (232) 將在其即將推出的版本中支援 Kotlin 1.9.20。

新的命令列編譯器可在 [GitHub 發布頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.9.20) 下載。

### 配置 Gradle 設定

要下載 Kotlin 成品和依賴項，請更新您的 `settings.gradle(.kts)` 檔案以使用 Maven Central 儲存庫：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

如果未指定儲存庫，Gradle 將使用已停用的 JCenter 儲存庫，這可能導致 Kotlin 成品問題。

```
```