[//]: # (title: Kotlin 1.9.20 有什麼新功能)

_[發佈日期：2023 年 11 月 1 日](releases.md#release-details)_

Kotlin 1.9.20 版本現已推出，[所有目標平台的 K2 編譯器現已進入 Beta 階段](#new-kotlin-k2-compiler-updates)，
且 [Kotlin Multiplatform 現已穩定](#kotlin-multiplatform-is-stable)。此外，以下是一些主要亮點：

*   [設定多平台專案的新預設階層範本](#template-for-configuring-multiplatform-projects)
*   [Kotlin Multiplatform 中對 Gradle 配置快取的完整支援](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
*   [Kotlin/Native 中預設啟用自訂記憶體分配器](#custom-memory-allocator-enabled-by-default)
*   [Kotlin/Native 垃圾收集器的效能改進](#performance-improvements-for-the-garbage-collector)
*   [Kotlin/Wasm 中的新目標與重新命名目標](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
*   [Kotlin/Wasm 標準函式庫中對 WASI API 的支援](#support-for-the-wasi-api-in-the-standard-library)

您也可以在此影片中找到這些更新的簡要概述：

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

## IDE 支援

支援 1.9.20 的 Kotlin 外掛程式適用於：

| IDE | 支援版本 |
|---|---|
| IntelliJ IDEA | 2023.1.x, 2023.2.x, 2023.x |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |

> 自 IntelliJ IDEA 2023.3.x 和 Android Studio Iguana (2023.2.1) Canary 15 起，Kotlin 外掛程式會自動
> 包含並更新。您只需要更新專案中的 Kotlin 版本即可。
>
{style="note"}

## 新 Kotlin K2 編譯器更新

JetBrains 的 Kotlin 團隊持續穩定新的 K2 編譯器，這將帶來主要的效能改進、
加速新語言功能開發、統一 Kotlin 支援的所有平台，並為多平台專案提供更好的架構。

K2 目前已為所有目標平台進入 **Beta** 階段。[閱讀發佈部落格文章了解更多資訊](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### 支援 Kotlin/Wasm

自此版本以來，Kotlin/Wasm 支援新的 K2 編譯器。
[了解如何在專案中啟用它](#how-to-enable-the-kotlin-k2-compiler)。

### Kapt 編譯器外掛程式與 K2 的預覽

> kapt 編譯器外掛程式中對 K2 的支援是 [Experimental (實驗性功能)](components-stability.md)。
> 需要選用加入（請參閱下方詳細資訊），您應該僅將其用於評估目的。
>
{style="warning"}

在 1.9.20 中，您可以嘗試將 [kapt 編譯器外掛程式](kapt.md)與 K2 編譯器一起使用。
要在專案中使用 K2 編譯器，請將以下選項新增到 `gradle.properties` 檔案中：

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

或者，您可以透過完成以下步驟來啟用 kapt 的 K2：
1. 在您的 `build.gradle.kts` 檔案中，將 [語言版本設定](gradle-compiler-options.md#example-of-setting-languageversion) 為 `2.0`。
2. 在您的 `gradle.properties` 檔案中，新增 `kapt.use.k2=true`。

如果您在使用 kapt 與 K2 編譯器時遇到任何問題，請向我們的
[問題追蹤器](http://kotl.in/issue) 報告。

### 如何啟用 Kotlin K2 編譯器

#### 在 Gradle 中啟用 K2

要啟用和測試 Kotlin K2 編譯器，請使用以下編譯器選項的新語言版本：

```bash
-language-version 2.0
```

您可以在 `build.gradle.kts` 檔案中指定它：

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

要在 IntelliJ IDEA 中啟用和測試 Kotlin K2 編譯器，請前往 **Settings (設定)** | **Build, Execution, Deployment (建置、執行、部署)** |
**Compiler (編譯器)** | **Kotlin Compiler (Kotlin 編譯器)** 並將 **Language Version (語言版本)** 欄位更新為 `2.0 (experimental)`。

### 對新 K2 編譯器提供回饋意見

我們將會感謝您的任何回饋意見！

*   直接在 Kotlin Slack 上向 K2 開發人員提供您的回饋意見 – [取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
    並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
*   報告您在使用新 K2 編譯器時遇到的任何問題
    在 [我們的問題追蹤器](https://kotl.in/issue) 上。
*   [啟用 Send usage statistics (傳送使用統計資料) 選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以
    允許 JetBrains 收集有關 K2 使用情況的匿名資料。

## Kotlin/JVM

自 1.9.20 版本開始，編譯器可以產生包含 Java 21 位元碼的類別。

## Kotlin/Native

Kotlin 1.9.20 包含一個預設啟用新記憶體分配器的穩定版記憶體管理員、垃圾收集器的效能改進，以及其他更新：

*   [預設啟用自訂記憶體分配器](#custom-memory-allocator-enabled-by-default)
*   [垃圾收集器的效能改進](#performance-improvements-for-the-garbage-collector)
*   [klib 構件的增量編譯](#incremental-compilation-of-klib-artifacts)
*   [管理函式庫連結問題](#managing-library-linkage-issues)
*   [類別建構函式呼叫時的伴隨物件初始化](#companion-object-initialization-on-class-constructor-calls)
*   [所有 cinterop 宣告的選用加入要求](#opt-in-requirement-for-all-cinterop-declarations)
*   [連結器錯誤的自訂訊息](#custom-message-for-linker-errors)
*   [移除舊版記憶體管理員](#removal-of-the-legacy-memory-manager)
*   [變更我們的目標層級策略](#change-to-our-target-tiers-policy)

### 預設啟用自訂記憶體分配器

Kotlin 1.9.20 預設啟用新的記憶體分配器。它旨在取代先前的預設分配器 `mimalloc`，
以提高垃圾收集的效率並改善 [Kotlin/Native 記憶體管理員](native-memory-manager.md) 的執行時間效能。

新的自訂分配器將系統記憶體劃分為頁面，允許以連續順序獨立掃描。
每個分配都成為頁面內部的記憶體區塊，頁面會追蹤區塊大小。
不同的頁面類型針對各種分配大小進行了優化。
記憶體區塊的連續排列確保了對所有已分配區塊的高效迭代。

當執行緒分配記憶體時，它會根據分配大小搜尋適合的頁面。
執行緒為不同的記憶體大小類別維護一組頁面。
通常，給定大小的目前頁面可以容納分配。
如果不能，執行緒會從共用分配空間請求不同的頁面。
此頁面可能已經可用，需要掃描，或者必須先建立。

新的分配器允許同時存在多個獨立的分配空間，
這將使 Kotlin 團隊能夠嘗試不同的頁面佈局，以進一步提高效能。

#### 如何啟用自訂記憶體分配器

從 Kotlin 1.9.20 開始，新的記憶體分配器是預設值。無需額外設定。

如果您遇到高記憶體消耗問題，可以在 Gradle 建置腳本中使用 `-Xallocator=mimalloc`
或 `-Xallocator=std` 切換回 `mimalloc` 或系統分配器。請在 [YouTrack](https://kotl.in/issue) 中報告此類問題，以幫助我們改進新的記憶體分配器。

有關新分配器設計的技術細節，請參閱此 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。

### 垃圾收集器的效能改進

Kotlin 團隊持續改進新的 Kotlin/Native 記憶體管理員的效能和穩定性。
此版本對垃圾收集器 (GC) 進行了許多重大變更，包括以下 1.9.20 亮點：

*   [](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
*   [](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### 完全平行標記以減少 GC 的暫停時間

以前，預設的垃圾收集器僅執行部分平行標記。當變更者執行緒暫停時，
它會從自己的根，例如執行緒區域變數和呼叫堆疊，開始標記 GC。
同時，一個單獨的 GC 執行緒負責從全域根以及所有正在主動執行原生程式碼且因此未暫停的變更者的根開始標記。

這種方法在全域物件數量有限且變更者執行緒花費大量時間處於可執行狀態並執行 Kotlin 程式碼的情況下效果很好。然而，對於典型的 iOS 應用程式而言並非如此。

現在 GC 使用完全平行標記，它結合了暫停的變更者、GC 執行緒和可選的標記執行緒來處理
標記佇列。預設情況下，標記過程由以下執行：

*   暫停的變更者。它們不是處理自己的根然後在不主動執行程式碼時處於閒置狀態，而是參與
    整個標記過程。
*   GC 執行緒。這確保至少有一個執行緒會執行標記。

這種新方法使標記過程更有效率，減少了 GC 的暫停時間。

#### 以大塊追蹤記憶體以改進分配效能

以前，GC 排程器單獨追蹤每個物件的分配。然而，新的預設自訂
分配器和 `mimalloc` 記憶體分配器都不會為每個物件分配單獨的儲存空間；它們會一次為多個物件分配大面積空間。

在 Kotlin 1.9.20 中，GC 追蹤區域而不是單個物件。這透過減少
每次分配執行的任務數量，從而有助於最小化垃圾收集器的記憶體使用量來加快小型物件的分配。

### klib 構件的增量編譯

> 此功能是 [Experimental (實驗性功能)](components-stability.md#stability-levels-explained)。
> 它可能隨時被移除或變更。需要選用加入（請參閱下方詳細資訊）。
> 僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 中提供回饋意見。
>
{style="warning"}

Kotlin 1.9.20 為 Kotlin/Native 引入了一項新的編譯時間優化。
將 `klib` 構件編譯為原生程式碼現在是部分增量的。

在偵錯模式下將 Kotlin 原始碼編譯為原生二進位檔時，編譯會經過兩個階段：

1.  原始碼編譯為 `klib` 構件。
2.  `klib` 構件與依賴項一起編譯為二進位檔。

為了優化第二階段的編譯時間，團隊已經為依賴項實施了編譯器快取。
它們只會編譯為原生程式碼一次，結果會在每次編譯二進位檔時重複使用。
但是從專案原始碼建置的 `klib` 構件始終在每次專案變更時完全重新編譯為原生程式碼。

透過新的增量編譯，如果專案模組變更僅導致原始碼部分重新編譯為
`klib` 構件，則 `klib` 的一部分會進一步重新編譯為二進位檔。

要啟用增量編譯，請將以下選項新增到您的 `gradle.properties` 檔案中：

```none
kotlin.incremental.native=true
```

如果您遇到任何問題，請向 [YouTrack](https://kotl.in/issue) 報告此類情況。

### 管理函式庫連結問題

此版本改進了 Kotlin/Native 編譯器處理 Kotlin 函式庫中連結問題的方式。錯誤訊息現在
包含更可讀的宣告，因為它們使用簽章名稱而不是雜湊，幫助您更容易找到並修復問題。例如：

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```
Kotlin/Native 編譯器會偵測第三方 Kotlin 函式庫之間的連結問題，並在執行時報告錯誤。
如果某個第三方 Kotlin 函式庫的作者在另一個第三方 Kotlin 函式庫使用的實驗性
API 中進行了不相容的變更，您可能會遇到此類問題。

從 Kotlin 1.9.20 開始，編譯器預設以靜默模式偵測連結問題。您可以在專案中調整此設定：

*   如果您想將這些問題記錄在編譯日誌中，請使用 `-Xpartial-linkage-loglevel=WARNING` 編譯器選項啟用警告。
*   也可以使用 `-Xpartial-linkage-loglevel=ERROR` 將報告警告的嚴重性提高到編譯錯誤。
    在這種情況下，編譯會失敗，您會在編譯日誌中獲得所有錯誤。使用此選項可更仔細地檢查連結問題。

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

如果您遇到此功能的意外問題，您可以隨時使用
`-Xpartial-linkage=disable` 編譯器選項停用。請隨時向 [我們的問題
追蹤器](https://kotl.in/issue) 報告此類情況。

### 類別建構函式呼叫時的伴隨物件初始化

從 Kotlin 1.9.20 開始，Kotlin/Native 後端會在類別建構函式中呼叫伴隨物件的靜態初始化器：

```kotlin
class Greeting {
    companion object {
        init {
            print("Hello, Kotlin!") 
        }
    }
}

fun main() {
    val start = Greeting() // 輸出 "Hello, Kotlin!"
}
```

該行為現在與 Kotlin/JVM 統一，其中伴隨物件在載入（解析）與 Java 靜態初始化器語義相符的相應類別時進行初始化。

現在，此功能的實作在平台之間更加一致，在 Kotlin
Multiplatform 專案中共享程式碼變得更容易。

### 所有 cinterop 宣告的選用加入要求

從 Kotlin 1.9.20 開始，由 `cinterop` 工具從 C 和 Objective-C 函式庫（例如 libcurl 和 libxml）產生
的所有 Kotlin 宣告都標記為 `@ExperimentalForeignApi`。如果缺少選用加入註解，您的程式碼將無法編譯。

此要求反映了匯入 C
和 Objective-C 函式庫的 [Experimental (實驗性功能)](components-stability.md#stability-levels-explained) 狀態。我們建議您將其使用限制在專案中的特定區域。一旦我們開始穩定化匯入，這將使您的遷移更容易。

> 至於 Kotlin/Native 隨附的原生平台函式庫（例如 Foundation、UIKit 和 POSIX），
> 只有它們的一些 API 需要透過 `@ExperimentalForeignApi` 選用加入。在這種情況下，您會收到一個需要選用加入的警告。
>
{style="note"}

### 連結器錯誤的自訂訊息

如果您是函式庫作者，您現在可以透過自訂訊息幫助使用者解決連結器錯誤。

如果您的 Kotlin 函式庫依賴於 C 或 Objective-C 函式庫，例如，使用 [CocoaPods 整合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)，
其使用者需要將這些依賴函式庫在本機上或在專案建置腳本中明確配置它們。
如果不是這樣，使用者通常會收到令人困惑的「Framework not found」訊息。

您現在可以在編譯失敗訊息中提供特定的說明或連結。為此，請將 `-Xuser-setup-hint`
編譯器選項傳遞給 `cinterop` 或將 `userSetupHint=message` 屬性新增到您的 `.def` 檔案中。

### 移除舊版記憶體管理員

[新的記憶體管理員](native-memory-manager.md) 在 Kotlin 1.6.20 中引入，並在 1.7.20 中成為預設。
從那時起，它一直獲得進一步的更新和效能改進，並已變得穩定。

現在是完成棄用週期並移除舊版記憶體管理員的時候了。如果您仍在
使用它，請從 `gradle.properties` 中移除 `kotlin.native.binary.memoryModel=strict` 選項，並遵循我們的 [遷移指南](native-migration-guide.md)
進行必要的更改。

### 變更我們的目標層級策略

我們已決定升級 [層級 1 支援](native-target-support.md#tier-1) 的要求。Kotlin 團隊現在
致力於為符合層級 1 資格的目標提供編譯器版本之間的原始碼和二進位碼相容性。它們
還必須定期使用 CI 工具進行測試，才能編譯和執行。目前，層級 1 包含以下 macOS 主機目標：

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

查看目前 [支援目標](native-target-support.md) 的完整列表。

## Kotlin Multiplatform

Kotlin 1.9.20 專注於 Kotlin Multiplatform 的穩定化，並透過新的專案精靈和其他值得注意的功能，在改善開發人員體驗方面邁出了新的一步：

*   [Kotlin Multiplatform 穩定版](#kotlin-multiplatform-is-stable)
*   [配置多平台專案的範本](#template-for-configuring-multiplatform-projects)
*   [新專案精靈](#new-project-wizard)
*   [全面支援 Gradle 配置快取](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
*   [更輕鬆地在 Gradle 中配置新標準函式庫版本](#easier-configuration-of-new-standard-library-versions-in-gradle)
*   [預設支援第三方 cinterop 函式庫](#default-support-for-third-party-cinterop-libraries)
*   [支援 Compose Multiplatform 專案中的 Kotlin/Native 編譯快取](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
*   [相容性指南](#compatibility-guidelines)

### Kotlin Multiplatform 穩定版

1.9.20 版本標誌著 Kotlin 演變的重要里程碑：[Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 終於
變得穩定。這意味著該技術可以安全地用於您的專案，並且 100% 準備好用於生產環境。它還
意味著 Kotlin Multiplatform 的進一步開發將繼續遵循我們嚴格的 [向後相容性規則](https://kotlinfoundation.org/language-committee-guidelines/)。

請注意，Kotlin Multiplatform 的一些進階功能仍在發展中。使用它們時，您會收到一個警告，描述
您正在使用的功能的目前穩定狀態。在使用 IntelliJ IDEA 中的任何實驗性功能之前，
您需要明確地在 **Settings (設定)** | **Advanced Settings (進階設定)** | **Kotlin** | **Experimental Multiplatform (實驗性多平台)** 中啟用它。

*   造訪 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/) 以了解更多關於 Kotlin Multiplatform 穩定化和未來計畫的資訊。
*   查看 [Multiplatform 相容性指南](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html) 以了解在穩定化過程中進行了哪些重大變更。
*   閱讀有關 [預期和實際宣告機制](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) 的資訊，這是 Kotlin Multiplatform 的重要組成部分，在此版本中也部分穩定化。

### 配置多平台專案的範本

從 Kotlin 1.9.20 開始，Kotlin Gradle 外掛程式會自動為常見的多平台場景建立共用原始碼集。
如果您的專案設定屬於這些場景之一，您不需要手動配置原始碼集階層。
只需明確指定專案所需的目標平台即可。

現在，由於預設階層範本（Kotlin Gradle 外掛程式的新功能），設定變得更容易。
它是一個內建於外掛程式中的原始碼集階層預定義範本。
它包含 Kotlin 為您宣告的目標自動建立的中間原始碼集。
[查看完整範本](#see-the-full-hierarchy-template)。

#### 更輕鬆地建立專案

考慮一個同時針對 Android 和 iPhone 裝置的多平台專案，並在 Apple silicon MacBook 上開發。
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

請注意，使用預設階層範本如何大幅減少設定專案所需的樣板程式碼數量。

當您在程式碼中宣告 `androidTarget`、`iosArm64` 和 `iosSimulatorArm64` 目標時，Kotlin Gradle 外掛程式會從範本中找到
合適的共用原始碼集並為您建立它們。結果階層如下所示：

![預設目標階層的使用範例](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

綠色原始碼集是實際建立並包含在專案中的，而預設範本中的灰色原始碼集則被忽略。

#### 使用原始碼集的自動完成功能

為了讓使用建立的專案結構更容易，IntelliJ IDEA 現在為使用預設階層範本建立的原始碼集提供自動完成功能：

<img src="multiplatform-hierarchy-completion.animated.gif" alt="IDE 原始碼集名稱自動完成" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

如果您嘗試存取不存在的原始碼集，Kotlin 也會發出警告，因為您尚未宣告相應的目標。
在下面的範例中，沒有 JVM 目標（只有 `androidTarget`，這不相同）。但是，讓我們嘗試使用 `jvmMain` 原始碼集
，看看會發生什麼：

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

在這種情況下，Kotlin 會在建置日誌中報告警告：

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* <- register the 'jvm' target */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### 設定目標階層

從 Kotlin 1.9.20 開始，預設階層範本會自動啟用。在大多數情況下，無需額外設定。

但是，如果您正在遷移在 1.9.20 之前建立的現有專案，如果您之前
手動使用 `dependsOn()` 呼叫引入了中間原始碼，您可能會遇到警告。為了解決此問題，請執行以下操作：

*   如果您的中間原始碼集目前涵蓋在預設階層範本中，請移除所有手動的 `dependsOn()`
    呼叫和使用 `by creating` 建構建立的原始碼集。

    要檢查所有預設原始碼集的列表，請參閱 [完整階層範本](#see-the-full-hierarchy-template)。

*   如果您想要擁有預設階層範本未提供的額外原始碼集，例如，一個在 macOS 和 JVM 目標之間
    共用程式碼的原始碼集，請透過使用 `applyDefaultHierarchyTemplate()` 明確重新應用範本並像往常一樣使用 `dependsOn()` 手動配置額外原始碼集來調整階層：

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()

        // 明確應用預設階層。它將例如建立 iosMain 原始碼集：
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

*   如果您的專案中已經存在與範本產生的原始碼集名稱完全相同，但
    在不同目標集之間共用的原始碼集，則目前無法修改範本原始碼集之間的預設 `dependsOn` 關係。

    您在這裡的一個選項是為您的目的找到不同的原始碼集，無論是在預設階層範本中
    還是手動建立的原始碼集。另一個選項是完全停用範本。

    要停用，請將 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 新增到您的 `gradle.properties` 並手動配置所有其他
    原始碼集。

    我們目前正在開發一個用於建立您自己的階層範本的 API，以簡化此類情況下的設定過程。

#### 查看完整階層範本 {initial-collapse-state="collapsed" collapsible="true"}

當您宣告專案要編譯的目標時，
外掛程式會相應地從範本中選擇共用原始碼集並在您的專案中建立它們。

![Default hierarchy template](full-template-hierarchy.svg)

> 此範例僅顯示專案的生產部分，省略了 `Main` 後綴
> (例如，使用 `common` 而不是 `commonMain`)。然而，對於 `*Test` 原始碼，一切都是相同的。
>
{style="tip"}

### 新專案精靈

JetBrains 團隊正在引入一種新的跨平台專案建立方式 – [Kotlin Multiplatform 網路精靈](https://kmp.jetbrains.com)。

新的 Kotlin Multiplatform 精靈的首次實作涵蓋了最受歡迎的 Kotlin Multiplatform
用例。它整合了以前專案範本的所有回饋意見，並使架構盡可能穩健和可靠。

新的精靈採用分散式架構，允許我們擁有統一的後端和
不同的前端，其中網路版本是第一步。我們正在考慮在未來實作 IDE 版本和
建立命令列工具。在網路上，您始終可以獲得最新版本的精靈，而在
IDE 中，您需要等待下一個版本。

有了新的精靈，專案設定比以往任何時候都更容易。您可以透過
選擇行動、伺服器和桌面開發的目標平台來根據您的需求自訂專案。我們還計畫在未來版本中新增網路開發。

<img src="multiplatform-web-wizard.png" alt="多平台網路精靈" width="400"/>

新專案精靈現在是使用 Kotlin 建立跨平台專案的首選方式。自 1.9.20 起，Kotlin
外掛程式不再在 IntelliJ IDEA 中提供 **Kotlin Multiplatform** 專案精靈。

新的精靈將輕鬆引導您完成初始設定，使入門過程更加順暢。
如果您遇到任何問題，請將其報告給 [YouTrack](https://kotl.in/issue)，以幫助我們改善您的精靈使用體驗。

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="建立專案" style="block"/>
</a>

### 全面支援 Gradle 配置快取

以前，我們為 Kotlin 多平台函式庫引入了 Gradle 配置快取的 [預覽版](whatsnew19.md#preview-of-the-gradle-configuration-cache)。在 1.9.20 中，Kotlin Multiplatform 外掛程式更進一步。

它現在支援 [Kotlin CocoaPods Gradle 外掛程式](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html) 中的 Gradle 配置快取，
以及 Xcode 建置所需的整合任務，例如 `embedAndSignAppleFrameworkForXcode`。

現在所有多平台專案都可以利用改進的建置時間。
Gradle 配置快取透過重複使用配置階段的結果來加速建置過程。
有關更多詳細資訊和設定說明，請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)。

### 更輕鬆地在 Gradle 中配置新標準函式庫版本

當您建立多平台專案時，標準函式庫 (`stdlib`) 的依賴項會自動新增到每個
原始碼集中。這是開始使用多平台專案最簡單的方法。

以前，如果您想手動配置對標準函式庫的依賴項，您需要為
每個原始碼集單獨配置它。從 `kotlin-stdlib:1.9.20` 開始，您只需在
`commonMain` 根原始碼集中**配置一次**依賴項：

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
        // For the common source set
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-common:1.9.10")
            }
        }

        // For the JVM source set
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.10")
            }
        }

        // For the JS source set
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

此變更由於標準函式庫的 Gradle 後設資料中包含新資訊而成為可能。這允許
Gradle 自動解析其他原始碼集的正確標準函式庫構件。

### 預設支援第三方 cinterop 函式庫

Kotlin 1.9.20 新增了對所有 cinterop 依賴項的預設支援（而非選用加入），適用於套用了
[Kotlin CocoaPods Gradle](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) 外掛程式的專案。

這意味著您現在可以共用更多原生程式碼，而無需受限於平台特定的依賴項。例如，您可以將
[對 Pod 函式庫的依賴項](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-libraries.html) 新增到 `iosMain` 共用原始碼集。

以前，這僅適用於 Kotlin/Native
發行版隨附的[平台特定函式庫](native-platform-libs.md)（例如 Foundation、UIKit 和 POSIX）。所有第三方 Pod 函式庫現在預設在共用原始碼集中可用。您不再需要指定單獨的 Gradle 屬性來支援它們。

### 支援 Compose Multiplatform 專案中的 Kotlin/Native 編譯快取

此版本解決了與 Compose Multiplatform 編譯器外掛程式的相容性問題，該問題主要影響
iOS 的 Compose Multiplatform 專案。

為了解決此問題，您必須使用 `kotlin.native.cacheKind=none` Gradle 屬性停用快取。然而，此
解決方法會帶來效能成本：由於快取在 Kotlin/Native 編譯器中不起作用，它會降低編譯時間。

現在問題已修復，您可以從 `gradle.properties` 檔案中移除 `kotlin.native.cacheKind=none`，並在 Compose Multiplatform 專案中享受
改進的編譯時間。

有關提高編譯時間的更多提示，請參閱 [Kotlin/Native 文件](native-improving-compilation-time.md)。

### 相容性指南

配置專案時，請檢查 Kotlin Multiplatform Gradle 外掛程式與可用 Gradle、Xcode
和 Android Gradle 外掛程式 (AGP) 版本的相容性：

| Kotlin Multiplatform Gradle 外掛程式 | Gradle | Android Gradle 外掛程式 | Xcode |
|---|---|---|---|
| 1.9.20 | 7.5 及更高版本 | 7.4.2–8.2 | 15.0。請參閱下方詳細資訊 |

截至此版本，Xcode 的推薦版本為 15.0。Xcode 15.0 隨附的函式庫已完全支援，
您可以從 Kotlin 程式碼中的任何位置存取它們。

然而，Xcode 14.3 在大多數情況下仍應能正常運作。請記住，如果您在本機上使用 14.3 版，
Xcode 15 隨附的函式庫將可見但無法存取。

## Kotlin/Wasm

在 1.9.20 中，Kotlin Wasm 達到了 [Alpha (測試版) 穩定性](components-stability.md)。

*   [與 Wasm GC 第 4 階段和最終操作碼的相容性](#compatibility-with-wasm-gc-phase-4-and-final-opcodes)
*   [新的 `wasm-wasi` 目標，以及將 `wasm` 目標重新命名為 `wasm-js`](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
*   [標準函式庫中對 WASI API 的支援](#support-for-the-wasi-api-in-the-standard-library)
*   [Kotlin/Wasm API 改進](#kotlin-wasm-api-improvements)

> Kotlin Wasm 為 [Alpha (測試版)](components-stability.md)。
> 它可能隨時變更。僅供評估之用。
>
> 我們非常感謝您在 [YouTrack](https://kotl.in/issue) 中提供回饋意見。
>
{style="note"}

### 與 Wasm GC 第 4 階段和最終操作碼的相容性

Wasm GC 進入最後階段，需要更新操作碼 – 在二進位表示中使用的常數數字。
Kotlin 1.9.20 支援最新的操作碼，所以我們強烈建議您將 Wasm 專案更新到最新的 Kotlin 版本。
我們還建議在 Wasm 環境中使用最新版本的瀏覽器：
*   Chrome 和基於 Chromium 的瀏覽器版本 119 或更高版本。
*   Firefox 版本 119 或更高版本。請注意，在 Firefox 119 中，您需要[手動開啟 Wasm GC](wasm-configuration.md)。

### 新的 wasm-wasi 目標，以及將 wasm 目標重新命名為 wasm-js

在此版本中，我們為 Kotlin/Wasm 引入了一個新目標 – `wasm-wasi`。我們還將 `wasm` 目標重新命名為 `wasm-js`。
在 Gradle DSL 中，這些目標分別以 `wasmWasi {}` 和 `wasmJs {}` 的形式提供。

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

先前引入的 `wasm {}` 區塊已棄用，改用 `wasmJs {}`。

要遷移現有的 Kotlin/Wasm 專案，請執行以下操作：
*   在 `build.gradle.kts` 檔案中，將 `wasm {}` 區塊重新命名為 `wasmJs {}`。
*   在您的專案結構中，將 `wasmMain` 目錄重新命名為 `wasmJsMain`。

### 標準函式庫中對 WASI API 的支援

在此版本中，我們支援 [WASI](https://github.com/WebAssembly/WASI)，這是 Wasm 平台的系統介面。
WASI 支援讓您更容易在瀏覽器外部使用 Kotlin/Wasm，例如在伺服器端應用程式中，透過提供
一組標準化的 API 來存取系統資源。此外，WASI 還提供基於能力的安全性 – 存取外部資源時的另一層安全性。

要執行 Kotlin/Wasm 應用程式，您需要一個支援 Wasm 垃圾收集 (GC) 的 VM，例如 Node.js 或 Deno。
Wasmtime、WasmEdge 和其他 VM 仍在努力實現完整的 Wasm GC 支援。

要匯入 WASI 函式，請使用 `@WasmImport` 註解：

```kotlin
import kotlin.wasm.WasmImport

@WasmImport("wasi_snapshot_preview1", "clock_time_get")
private external fun wasiRawClockTimeGet(clockId: Int, precision: Long, resultPtr: Int): Int
```

[您可以在我們的 GitHub 儲存庫中找到完整範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)。

> 在以 `wasmWasi` 為目標時，無法使用 [與 JavaScript 的互操作性](wasm-js-interop.md)。
>
{style="note"}

### Kotlin/Wasm API 改進

此版本為 Kotlin/Wasm API 帶來了多項使用品質改進。
例如，您不再需要為 DOM 事件監聽器傳回值：

<table>
   <tr>
       <td>1.9.20 之前</td>
       <td>1.9.20 中</td>
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

Kotlin 1.9.20 與 Gradle 6.8.3 到 8.1 完全相容。您也可以使用到最新 Gradle
版本為止的 Gradle 版本，但如果您這樣做，請記住您可能會遇到棄用警告或一些新的 Gradle 功能可能無法使用。

此版本帶來了以下變更：
*   [支援測試夾具存取內部宣告](#support-for-test-fixtures-to-access-internal-declarations)
*   [配置 Konan 目錄路徑的新屬性](#new-property-to-configure-paths-to-konan-directories)
*   [Kotlin/Native 任務的新建置報告指標](#new-build-report-metrics-for-kotlin-native-tasks)

### 支援測試夾具存取內部宣告

在 Kotlin 1.9.20 中，如果您使用 Gradle 的 `java-test-fixtures` 外掛程式，則您的 [測試夾具](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)
現在可以存取主原始碼集類別中的 `internal` 宣告。此外，任何測試原始碼也可以看到測試夾具類別中的任何
`internal` 宣告。

### 配置 Konan 目錄路徑的新屬性

在 Kotlin 1.9.20 中，`kotlin.data.dir` Gradle 屬性可用於自訂您的 `~/.konan` 目錄路徑，
這樣您就不必透過環境變數 `KONAN_DATA_DIR` 進行配置。

或者，您可以使用 `-Xkonan-data-dir` 編譯器選項，透過 `cinterop` 和 `konanc` 工具配置您的自訂 `~/.konan` 目錄路徑。

### Kotlin/Native 任務的新建置報告指標

在 Kotlin 1.9.20 中，Gradle 建置報告現在包含 Kotlin/Native 任務的指標。這是一個包含這些指標的建置報告範例：

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

此外，`kotlin.experimental.tryK2` 建置報告現在包含任何已編譯的 Kotlin/Native 任務，並列出
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

> 如果您使用 Gradle 8.0，您可能會遇到一些建置報告問題，尤其是在啟用 Gradle 配置
> 快取時。這是一個已知問題，已在 Gradle 8.1 及更高版本中修復。
>
{style="note"}

## 標準函式庫

在 Kotlin 1.9.20 中，[Kotlin/Native 標準函式庫變得穩定](#the-kotlin-native-standard-library-becomes-stable)，
並有一些新功能：
*   [替換 Enum 類別值泛型函式](#replacement-of-the-enum-class-values-generic-function)
*   [Kotlin/JS 中 HashMap 操作的效能改進](#improved-performance-of-hashmap-operations-in-kotlin-js)

### 替換 Enum 類別值泛型函式

> 此功能是 [Experimental (實驗性功能)](components-stability.md#stability-levels-explained)。它可能隨時被移除或變更。
> 需要選用加入（請參閱下方詳細資訊）。僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 中提供回饋意見。
>
{style="warning"}

在 Kotlin 1.9.0 中，enum 類別的 `entries` 屬性變得穩定。`entries` 屬性是
`values()` 合成函式的現代高效能替代品。作為 Kotlin 1.9.20 的一部分，有
`enumEntries<T>()` 替換泛型 `enumValues<T>()` 函式。

> `enumValues<T>()` 函式仍受支援，但我們建議您改用 `enumEntries<T>()` 函式，
> 因為它的效能影響較小。每次呼叫 `enumValues<T>()` 時，都會建立一個新陣列，而每次
> 呼叫 `enumEntries<T>()` 時，都會傳回相同的列表，效率更高。
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

#### 如何啟用 enumEntries 函式

要嘗試此功能，請使用 `@OptIn(ExperimentalStdlibApi)` 選用加入，並使用語言版本 1.9 或更高版本。如果您使用
最新版本的 Kotlin Gradle 外掛程式，則無需指定語言版本即可測試該功能。

### Kotlin/Native 標準函式庫變得穩定

在 Kotlin 1.9.0 中，我們[解釋了](whatsnew19.md#the-kotlin-native-standard-library-s-journey-towards-stabilization)我們為使 Kotlin/Native 標準函式庫更接近穩定化目標所採取的行動。在 Kotlin 1.9.20 中，
我們最終完成了這項工作，並使 Kotlin/Native 標準函式庫穩定。以下是此版本的一些亮點：

*   [`Vector128`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-vector128/) 類別已從 `kotlin.native` 套件移至 `kotlinx.cinterop` 套件。
*   `ExperimentalNativeApi` 和 `NativeRuntimeApi` 註解（作為 Kotlin 1.9.0 的一部分引入）的選用加入要求等級已從 `WARNING` 提高到 `ERROR`。
*   Kotlin/Native 集合現在會偵測並行修改，例如在 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/) 和 [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/) 集合中。
*   `Throwable` 類別的 [`printStackTrace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/print-stack-trace.html) 函式現在會列印到 `STDERR` 而不是 `STDOUT`。
    > `printStackTrace()` 的輸出格式不穩定，可能隨時變更。
    >
    {style="warning"}

#### Atomics API 的改進

在 Kotlin 1.9.0 中，我們曾表示當 Kotlin/Native 標準函式庫穩定時，Atomics API 將準備好穩定。
Kotlin 1.9.20 包含以下額外變更：

*   引入了實驗性 `AtomicIntArray`、`AtomicLongArray` 和 `AtomicArray<T>` 類別。這些新類別
    專門設計用於與 Java 的原子陣列保持一致，以便將來它們可以包含在通用標準函式庫中。
    > `AtomicIntArray`、`AtomicLongArray` 和 `AtomicArray<T>` 類別是
    > [Experimental (實驗性功能)](components-stability.md#stability-levels-explained)。它們可能隨時被移除或變更。要
    > 嘗試它們，請使用 `@OptIn(ExperimentalStdlibApi)` 選用加入。僅將它們用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 中提供回饋意見。
    >
    {style="warning"}
*   在 `kotlin.native.concurrent` 套件中，在 Kotlin 1.9.0 中已棄用且棄用等級為 `WARNING` 的 Atomics API，其棄用等級已提高到 `ERROR`。
*   在 `kotlin.concurrent` 套件中，已移除 [`AtomicInt`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-int/index.html) 和 [`AtomicLong`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-long/index.html) 類別中棄用等級為 `ERROR` 的成員函式。
*   `AtomicReference` 類別的 [所有成員函式](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-reference/#functions) 現在都使用原子內聯函式。

有關 Kotlin 1.9.20 中所有變更的更多資訊，請參閱我們的 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-61028/Behavioural-changes-to-the-Native-stdlib-API)。

### Kotlin/JS 中 HashMap 操作的效能改進

Kotlin 1.9.20 改進了 Kotlin/JS 中 `HashMap` 操作的效能並減少了其記憶體佔用。在內部，
Kotlin/JS 已將其內部實作變更為開放定址。這意味著當您：
*   將新元素插入 `HashMap` 時，您應該會看到效能改進。
*   搜尋 `HashMap` 中現有元素時。
*   迭代 `HashMap` 中的鍵或值時。

## 文件更新

Kotlin 文件收到了一些值得注意的變更：
*   [JVM Metadata (JVM 中繼資料)](https://kotlinlang.org/api/kotlinx-metadata-jvm/) API 參考 – 探索如何使用 Kotlin/JVM 解析中繼資料。
*   [時間測量指南](time-measurement.md) – 學習如何在 Kotlin 中計算和測量時間。
*   [Kotlin 導覽](kotlin-tour-welcome.md) 中改進的集合章節 – 學習 Kotlin 程式設計語言的基礎知識，章節包括理論和實踐。
*   [明確不可為 null 的類型](generics.md#definitely-non-nullable-types) – 學習明確不可為 null 的泛型類型。
*   改進的 [陣列頁面](arrays.md) – 學習陣列以及何時使用它們。
*   [Expected and actual declarations in Kotlin Multiplatform (Kotlin Multiplatform 中的預期和實際宣告)](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) – 學習 Kotlin Multiplatform 中 Kotlin 預期和實際宣告機制。

## 安裝 Kotlin 1.9.20

### 檢查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2023.1.x 和 2023.2.x 會自動建議將 Kotlin
外掛程式更新到 1.9.20 版。IntelliJ IDEA 2023.3 將包含 Kotlin 1.9.20 外掛程式。

Android Studio Hedgehog (231) 和 Iguana (232) 將在其即將推出的版本中支援 Kotlin 1.9.20。

新的命令列編譯器可在 [GitHub 發佈頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.9.20) 下載。

### 配置 Gradle 設定

要下載 Kotlin 構件和依賴項，請更新您的 `settings.gradle(.kts)` 檔案以使用 Maven Central 儲存庫：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

如果未指定儲存庫，Gradle 會使用已棄用的 JCenter 儲存庫，這可能導致 Kotlin 構件問題。