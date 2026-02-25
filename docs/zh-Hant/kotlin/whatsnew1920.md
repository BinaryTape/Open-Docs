[//]: # (title: Kotlin 1.9.20 的新功能)

<web-summary>閱讀 Kotlin 1.9.20 版本發佈說明，內容涵蓋新的語言特性、Kotlin Multiplatform、JVM、Native、JS 和 Wasm 的更新，以及 Gradle 和 Maven 的建置工具支援。</web-summary>

_[發佈日期：2023 年 11 月 1 日](releases.md#release-history)_

Kotlin 1.9.20 版本已發佈，[適用於所有目標的 K2 編譯器現已進入 Beta 階段](#new-kotlin-k2-compiler-updates)，且 [Kotlin Multiplatform 現已穩定](#kotlin-multiplatform-is-stable)。此外，以下是一些主要的亮點：

* [用於設定多平台專案的新預設階層範本](#template-for-configuring-multiplatform-projects)
* [Kotlin Multiplatform 完全支援 Gradle 配置快取](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [Kotlin/Native 預設啟用自訂記憶體分配器](#custom-memory-allocator-enabled-by-default)
* [Kotlin/Native 垃圾收集器的效能改進](#performance-improvements-for-the-garbage-collector)
* [Kotlin/Wasm 中新增和重新命名的目標](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [Kotlin/Wasm 標準程式庫支援 WASI API](#support-for-the-wasi-api-in-the-standard-library)

您也可以在此影片中找到更新內容的簡短概述：

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

> 有關 Kotlin 發佈週期的資訊，請參閱 [Kotlin 發佈程序](releases.md)。
>
{style="tip"}

## IDE 支援

支援 1.9.20 的 Kotlin 外掛程式可用於：

| IDE            | 支援的版本                              |
|----------------|----------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x, 2023.x             |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |

> 從 IntelliJ IDEA 2023.3.x 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛程式會自動包含並更新。您只需更新專案中的 Kotlin 版本。
>
{style="note"}

## 新的 Kotlin K2 編譯器更新

JetBrains 的 Kotlin 團隊持續穩定新的 K2 編譯器，這將帶來重大的效能提升，加速新語言特性的開發，統一 Kotlin 支援的所有平台，並為多平台專案提供更好的架構。

K2 目前在所有目標中都處於 **Beta** 階段。[在發佈部落格文章中了解更多](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### 支援 Kotlin/Wasm

自此版本起，Kotlin/Wasm 支援新的 K2 編譯器。
[了解如何在您的專案中啟用它](#how-to-enable-the-kotlin-k2-compiler)。

### K2 的 kapt 編譯器外掛程式預覽

> kapt 編譯器外掛程式對 K2 的支援是 [實驗性的](components-stability.md)。
> 需要選擇加入（詳見下文），且您應僅出於評估目的使用它。
>
{style="warning"}

在 1.9.20 中，您可以嘗試在 K2 編譯器下使用 [kapt 編譯器外掛程式](kapt.md)。
要在您的專案中使用 K2 編譯器，請將以下選項新增到您的 `gradle.properties` 檔案中：

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

或者，您可以透過完成以下步驟來啟用 kapt 的 K2：
1. 在您的 `build.gradle.kts` 檔案中，將 [語言版本設定](gradle-compiler-options.md#example-of-setting-languageversion) 為 `2.0`。
2. 在您的 `gradle.properties` 檔案中，新增 `kapt.use.k2=true`。

如果您在將 kapt 與 K2 編譯器搭配使用時遇到任何問題，請回報至我們的
[問題追蹤器](http://kotl.in/issue)。

### 如何啟用 Kotlin K2 編譯器

#### 在 Gradle 中啟用 K2

要啟用並測試 Kotlin K2 編譯器，請使用新的語言版本與以下編譯器選項：

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

要啟用並測試 Kotlin K2 編譯器，請更新 `pom.xml` 檔案的 `<project/>` 區段：

```xml
<properties>
    <kotlin.compiler.languageVersion>2.0</kotlin.compiler.languageVersion>
</properties>
```

#### 在 IntelliJ IDEA 中啟用 K2

要測試 IntelliJ IDEA 中的 Kotlin K2 編譯器，請前往 **Settings** | **Build, Execution, Deployment** |
**Compiler** | **Kotlin Compiler** 並將 **Language Version** 欄位更新為 `2.0 (experimental)`。

### 對新的 K2 編譯器留下您的回饋

我們非常感謝您提供的任何回饋！

* 直接在 Kotlin Slack 上向 K2 開發人員提供回饋 – [獲取邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  並加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 頻道。
* 在 [我們的問題追蹤器](https://kotl.in/issue) 上回報您在使用新 K2 編譯器時遇到的任何問題。
* [啟用傳送使用統計資料選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以
  允許 JetBrains 收集有關 K2 使用情況的匿名數據。

## Kotlin/JVM

從 1.9.20 版本開始，編譯器可以產生包含 Java 21 位元組碼的類別。

## Kotlin/Native

Kotlin 1.9.20 包含一個穩定的記憶體管理員，預設啟用新的記憶體分配器，垃圾收集器的效能改進，以及其他更新：

* [預設啟用自訂記憶體分配器](#custom-memory-allocator-enabled-by-default)
* [垃圾收集器的效能改進](#performance-improvements-for-the-garbage-collector)
* [`klib` 構件的增量編譯](#incremental-compilation-of-klib-artifacts)
* [管理程式庫連結問題](#managing-library-linkage-issues)
* [呼叫類別建構函式時初始化隨伴物件](#companion-object-initialization-on-class-constructor-calls)
* [所有 cinterop 宣告都需要選擇加入](#opt-in-requirement-for-all-cinterop-declarations)
* [連結器錯誤的自訂訊息](#custom-message-for-linker-errors)
* [移除舊版記憶體管理員](#removal-of-the-legacy-memory-manager)
* [目標分層政策的變更](#change-to-our-target-tiers-policy)

### 預設啟用自訂記憶體分配器

Kotlin 1.9.20 預設啟用了新的記憶體分配器。它旨在取代之前的預設分配器 `mimalloc`，使垃圾收集更有效率並提升 [Kotlin/Native 記憶體管理員](native-memory-manager.md) 的執行時期效能。

新的自訂分配器將系統記憶體劃分為多個頁面（page），允許按順序進行獨立掃除（sweeping）。
每次分配都會成為頁面內的一個記憶體區塊，頁面會追蹤區塊大小。
不同的頁面類型針對各種分配大小進行了最佳化。
記憶體區塊的連續排列確保了對所有已分配區塊的高效遍歷。

當執行緒分配記憶體時，它會根據分配大小搜尋適合的頁面。
執行緒為不同的大小類別維護一組頁面。
通常，給定大小的目前頁面可以容納分配。
如果不能，執行緒會從共用分配空間請求不同的頁面。
此頁面可能已經可用、需要掃除，或必須先建立。

新的分配器允許同時存在多個獨立的分配空間，
這將使 Kotlin 團隊能夠嘗試不同的頁面佈局，以進一步提升效能。

#### 如何啟用自訂記憶體分配器

從 Kotlin 1.9.20 開始，新的記憶體分配器是預設值。不需要額外的設定。

如果您遇到高記憶體消耗的情況，可以在 Gradle 組建腳本中使用 `-Xallocator=mimalloc` 或 `-Xallocator=std` 切換回 `mimalloc` 或系統分配器。請在 [YouTrack](https://kotl.in/issue) 中回報此類問題，以協助我們改進新的記憶體分配器。

有關新分配器設計的技術細節，請參閱此 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。

### 垃圾收集器的效能改進

Kotlin 團隊持續改進新 Kotlin/Native 記憶體管理員的效能和穩定性。
此版本對垃圾收集器 (GC) 進行了許多重大變更，包括以下 1.9.20 亮點：

* [](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
* [](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### 全平行標記以減少 GC 暫停時間

先前，預設的垃圾收集器僅執行部分平行標記。當 mutator 執行緒暫停時，它會從自己的根（如執行緒區域變數和呼叫堆疊）開始標記。同時，一個獨立的 GC 執行緒負責從全域根以及所有正在執行原生程式碼（因此未暫停）的 mutator 根開始標記。

這種方法在全域物件數量有限且 mutator 執行緒花費大量時間在可執行狀態執行 Kotlin 程式碼的情況下效果良好。然而，這並非典型的 iOS 應用程式情況。

現在，GC 使用全平行標記，結合暫停的 mutator、GC 執行緒和可選的標記執行緒來處理標記佇列。預設情況下，標記程序由以下人員執行：

* 暫停的 mutator。它們不再只是處理自己的根，然後在不執行程式碼時處於閒置狀態，而是參與整個標記過程。
* GC 執行緒。這確保了至少有一個執行緒會執行標記。

這種新方法使標記過程更有效率，減少了 GC 的暫停時間。

#### 以大區塊追蹤記憶體以提升分配效能

先前，GC 排程器會個別追蹤每個物件的分配。然而，無論是新的預設自訂分配器還是 `mimalloc` 記憶體分配器，都不會為每個物件分配獨立的存儲空間；它們會一次為多個物件分配大區域。

在 Kotlin 1.9.20 中，GC 追蹤的是區域而非個別物件。這透過減少每次分配時執行的任務數量來加速小物件的分配，從而有助於極小化垃圾收集器的記憶體使用量。

### klib 構件的增量編譯

> 此功能是 [實驗性的](components-stability.md#stability-levels-explained)。
> 它可能隨時被刪除或更改。需要選擇加入（詳見下文）。
> 僅將其用於評估目的。我們歡迎您在 [YouTrack](https://kotl.in/issue) 上提供回饋。
>
{style="warning"}

Kotlin 1.9.20 為 Kotlin/Native 引入了新的編譯時間最佳化。
現在將 `klib` 構件編譯為原生程式碼的過程是部分增量的。

在偵錯模式下將 Kotlin 原始碼編譯為原生二進位檔案時，編譯會經過兩個階段：

1. 原始碼被編譯成 `klib` 構件。
2. `klib` 構件連同相依性被編譯成二進位檔案。

為了最佳化第二階段的編譯時間，團隊已經實作了相依性的編譯器快取。
它們僅被編譯成原生程式碼一次，並且每次編譯二進位檔案時都會重複使用結果。
但是，從專案原始碼建置的 `klib` 構件在每次專案變更時都會完全重新編譯為原生程式碼。

透過新的增量編譯，如果專案模組的變更僅導致原始碼部分重新編譯為 `klib` 構件，則只有 `klib` 的一部分會進一步重新編譯為二進位檔案。

要啟用增量編譯，請將以下選項新增到您的 `gradle.properties` 檔案中：

```none
kotlin.incremental.native=true
```

如果您遇到任何問題，請將此類情況回報至 [YouTrack](https://kotl.in/issue)。

### 管理程式庫連結問題

此版本改進了 Kotlin/Native 編譯器處理 Kotlin 程式庫中連結問題的方式。錯誤訊息現在包含更具可讀性的宣告，因為它們使用簽章名稱而非雜湊值，幫助您更輕鬆地找到並修復問題。範例如下：

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```
Kotlin/Native 編譯器會偵測第三方 Kotlin 程式庫之間的連結問題，並在執行時期回報錯誤。
如果一個第三方 Kotlin 程式庫的作者在另一個第三方 Kotlin 程式庫使用的實驗性 API 中進行了不相容的變更，您可能會遇到此類問題。

從 Kotlin 1.9.20 開始，編譯器預設以靜默模式偵測連結問題。您可以在專案中調整此設定：

* 如果您想在編譯日誌中記錄這些問題，請使用 `-Xpartial-linkage-loglevel=WARNING` 編譯器選項啟用警告。
* 也可以使用 `-Xpartial-linkage-loglevel=ERROR` 將回報的警告嚴重性提升為編譯錯誤。
在此情況下，編譯會失敗，您會在編譯日誌中看到所有錯誤。使用此選項可更仔細地檢查連結問題。

```kotlin
// 在 Gradle 組建檔案中傳遞編譯器選項的範例：
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // 將連結問題回報為警告：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=WARNING")

                // 將連結警告提升為錯誤：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```

如果您在使用此功能時遇到非預期的問題，可以隨時使用 `-Xpartial-linkage=disable` 編譯器選項選擇退出。請務必向 [我們的問題追蹤器](https://kotl.in/issue) 回報此類情況。

### 呼叫類別建構函式時初始化隨伴物件

從 Kotlin 1.9.20 開始，Kotlin/Native 後端會在類別建構函式中呼叫隨伴物件的靜態初始設定式：

```kotlin
class Greeting {
    companion object {
        init {
            print("Hello, Kotlin!") 
        }
    }
}

fun main() {
    val start = Greeting() // 印出 "Hello, Kotlin!"
}
```

此行為現在與 Kotlin/JVM 統一，在 Kotlin/JVM 中，隨伴物件是在載入（解析）與 Java 靜態初始設定式語義相符的對應類別時初始化的。

既然此功能的實作在各平台之間更加一致，那麼在 Kotlin Multiplatform 專案中共享程式碼就會更容易。

### 所有 cinterop 宣告都需要選擇加入

從 Kotlin 1.9.20 開始，所有由 `cinterop` 工具從 C 和 Objective-C 程式庫（如 libcurl 和 libxml）產生的 Kotlin 宣告都會標記為 `@ExperimentalForeignApi`。如果缺少選擇加入註解，您的程式碼將無法編譯。

這項要求反映了匯入 C 和 Objective-C 程式庫的 [實驗性](components-stability.md#stability-levels-explained) 狀態。我們建議您將其使用限制在專案中的特定區域。這將在我們開始穩定匯入功能時讓您的遷移更輕鬆。

> 至於 Kotlin/Native 隨附的原生平台程式庫（如 Foundation、UIKit 和 POSIX），只有部分 API 需要使用 `@ExperimentalForeignApi` 進行選擇加入。在這種情況下，您會收到帶有選擇加入要求的警告。
>
{style="note"}

### 連結器錯誤的自訂訊息

如果您是程式庫作者，現在可以透過自訂訊息協助您的使用者解決連結器錯誤。

如果您的 Kotlin 程式庫相依於 C 或 Objective-C 程式庫，例如使用 [CocoaPods 整合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)，其使用者需要在本機電腦上擁有這些相依程式庫，或在專案組建腳本中明確配置它們。如果不是這種情況，使用者以前會收到令人困惑的 "Framework not found" 訊息。

您現在可以在編譯失敗訊息中提供特定說明或連結。為此，請將 `-Xuser-setup-hint` 編譯器選項傳遞給 `cinterop`，或在您的 `.def` 檔案中新增 `userSetupHint=message` 屬性。

### 移除舊版記憶體管理員

[新的記憶體管理員](native-memory-manager.md) 已在 Kotlin 1.6.20 中引入，並在 1.7.20 中成為預設。
自那時起，它不斷收到進一步的更新和效能改進，並已達到穩定版。

完成棄用週期並移除舊版記憶體管理員的時間已經到來。如果您仍在使用它，請從 `gradle.properties` 中移除 `kotlin.native.binary.memoryModel=strict` 選項，並按照我們的 [遷移指南](native-migration-guide.md) 進行必要的變更。

### 目標分層政策的變更

我們決定提升 [第 1 層級支援](native-target-support.md#tier-1) 的要求。Kotlin 團隊現在承諾為符合第 1 層級條件的目標在編譯器發佈版本之間提供原始碼和二進位檔案相容性。它們還必須定期使用 CI 工具進行測試，以確保能夠編譯和執行。目前，第 1 層級包括 macOS 主機的以下目標：

* `macosX64`
* `macosArm64`
* `iosSimulatorArm64`
* `iosX64`

在 Kotlin 1.9.20 中，我們也移除了一些先前已棄用的目標，即：

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxMips32`
* `linuxMipsel32`

請參閱目前 [支援的目標](native-target-support.md) 完整清單。

## Kotlin Multiplatform

Kotlin 1.9.20 專注於 Kotlin Multiplatform 的穩定化，並透過新的專案精靈和其他顯著功能在改進開發人員體驗方面邁出了新步伐：

* [Kotlin Multiplatform 已穩定](#kotlin-multiplatform-is-stable)
* [用於配置多平台專案的範本](#template-for-configuring-multiplatform-projects)
* [新的專案精靈](#new-project-wizard)
* [完全支援 Gradle 配置快取](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [在 Gradle 中更輕鬆地配置新的標準程式庫版本](#easier-configuration-of-new-standard-library-versions-in-gradle)
* [預設支援第三方 cinterop 程式庫](#default-support-for-third-party-cinterop-libraries)
* [Compose Multiplatform 專案支援 Kotlin/Native 編譯快取](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
* [相容性指南](#compatibility-guidelines)

### Kotlin Multiplatform 已穩定

1.9.20 版本標誌著 Kotlin 演進中的一個重要里程碑：[Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 終於進入穩定版。這意味著該技術可以安全地用於您的專案，並已 100% 準備好用於生產環境。這也意味著 Kotlin Multiplatform 的進一步開發將根據我們嚴格的 [向後相容性規則](https://kotlinfoundation.org/language-committee-guidelines/) 繼續進行。

請注意，Kotlin Multiplatform 的一些進階功能仍在演進中。使用它們時，您會收到一則警告，說明您正在使用的功能的目前穩定狀態。在 IntelliJ IDEA 中使用任何實驗性功能之前，您需要在 **Settings** | **Advanced Settings** | **Kotlin** | **Experimental Multiplatform** 中明確啟用它。

* 訪問 [Kotlin 部落格](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/) 以了解有關 Kotlin Multiplatform 穩定化和未來計劃的更多資訊。
* 查閱 [多平台相容性指南](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html) 以查看在穩定化過程中做出的重大變更。
* 閱讀 [預期宣告與實際宣告機制](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)，這是 Kotlin Multiplatform 的重要部分，在此版本中也得到了部分穩定。

### 用於配置多平台專案的範本

從 Kotlin 1.9.20 開始，Kotlin Gradle 外掛程式會自動為常見的多平台情境建立共享的原始碼集。
如果您的專案設置是其中之一，則無需手動配置原始碼集階層。
只需明確指定專案所需的目標即可。

得益於預設階層範本（Kotlin Gradle 外掛程式的一項新功能），設置現在變得更加容易。
它是內建在該外掛程式中的原始碼集階層預定義範本。
它包含了 Kotlin 根據您宣告的目標自動建立的中間原始碼集。
[參見完整範本](#see-the-full-hierarchy-template)。

#### 更輕鬆地建立您的專案

考慮一個同時針對 Android 和 iPhone 裝置並在 Apple 晶片 MacBook 上開發的多平台專案。
比較此專案在不同 Kotlin 版本之間的設置方式：

<table>
   <tr>
       <td>Kotlin 1.9.0 及更早版本（標準設置）</td>
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

    // 自動建立 iosMain 原始碼集
}
```

</td>
</tr>
</table>

請注意，使用預設階層範本如何顯著減少設置專案所需的樣板程式碼量。

當您在程式碼中宣告 `androidTarget`、`iosArm64` 和 `iosSimulatorArm64` 目標時，Kotlin Gradle 外掛程式會從範本中找到合適的共享原始碼集並為您建立它們。產生的階層如下所示：

![預設目標階層的使用範例](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

綠色的原始碼集是實際建立並包含在專案中的，而來自預設範本的灰色原始碼集則被忽略。

#### 為原始碼集使用補全功能

為了更輕鬆地處理建立的專案結構，IntelliJ IDEA 現在為使用預設階層範本建立的原始碼集提供補全功能：

<img src="multiplatform-hierarchy-completion.animated.gif" alt="IDE completion for source set names" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

如果您嘗試訪問由於未宣告相應目標而不存在的原始碼集，Kotlin 也會向您發出警告。
在下面的範例中，沒有 JVM 目標（只有 `androidTarget`，這是不一樣的）。但讓我們嘗試使用 `jvmMain` 原始碼集，看看會發生什麼：

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

在這種情況下，Kotlin 會在組建日誌中回報警告：

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* <- register the 'jvm' target */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### 設置目標階層

從 Kotlin 1.9.20 開始，預設階層範本會自動啟用。在大多數情況下，不需要額外的設置。

然而，如果您正在遷移 1.9.20 之前建立的現有專案，如果您先前透過 `dependsOn()` 呼叫手動引入了中間原始碼，則可能會遇到警告。要解決此問題，請執行以下操作：

* 如果您目前的中間原始碼集已涵蓋在預設階層範本中，請移除所有手動的 `dependsOn()` 呼叫以及使用 `by creating` 構造建立的原始碼集。

  要檢查所有預設原始碼集的清單，請參閱 [完整階層範本](#see-the-full-hierarchy-template)。

* 如果您希望擁有預設階層範本未提供的額外原始碼集，例如在 macOS 和 JVM 目標之間共享程式碼的原始碼集，請透過使用 `applyDefaultHierarchyTemplate()` 明確重新套用範本來調整階層，並像往常一樣使用 `dependsOn()` 手動配置額外的原始碼集：

  ```kotlin
  kotlin {
      jvm()
      macosArm64()
      iosArm64()
      iosSimulatorArm64()

      // 明確套用預設階層。例如，它會建立 iosMain 原始碼集：
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

* 如果您的專案中已經存在與範本產生的原始碼集名稱完全相同，但在不同的目標組合之間共享的原始碼集，則目前無法修改範本原始碼集之間預設的 `dependsOn` 關係。

  您可以在此處選擇在預設階層範本中尋找適合您用途的其他原始碼集，或手動建立。另一種選擇是完全退出該範本。

  要退出，請將 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 新增到您的 `gradle.properties` 並手動配置所有其他原始碼集。

  我們目前正在開發用於建立您自己的階層範本的 API，以簡化此類情況下的設置程序。

#### 查看完整階層範本 {initial-collapse-state="collapsed" collapsible="true"}

當您宣告專案編譯的目標時，外掛程式會據此從範本中挑選共享的原始碼集，並在您的專案中建立它們。

![預設階層範本](full-template-hierarchy.svg)

> 此範例僅顯示專案的生產部分，省略了 `Main` 後綴（例如，使用 `common` 而非 `commonMain`）。不過，對於 `*Test` 原始碼，一切都是一樣的。
>
{style="tip"}

### 新的專案精靈

JetBrains 團隊正在引入一種建立跨平台專案的新方式 – [Kotlin Multiplatform 網頁精靈](https://kmp.jetbrains.com)。

這個新 Kotlin Multiplatform 精靈的第一個實作涵蓋了最受歡迎的 Kotlin Multiplatform 使用案例。它整合了所有關於先前專案範本的回饋，並使架構盡可能穩健可靠。

新精靈採用分散式架構，這讓我們能擁有統一的後端和不同的前端，網頁版是第一步。我們正考慮在未來實作 IDE 版本並建立命令列工具。在網頁上，您始終能獲得最新版本的精靈，而在 IDE 中，您需要等待下一個版本發佈。

有了新精靈，專案設置比以往任何時候都更容易。您可以透過選擇行動、伺服器和桌面開發的目標平台來根據需求量身打造專案。我們還計劃在未來的版本中加入網頁開發。

<img src="multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

新的專案精靈現在是使用 Kotlin 建立跨平台專案的首選方式。自 1.9.20 起，Kotlin 外掛程式不再在 IntelliJ IDEA 中提供 **Kotlin Multiplatform** 專案精靈。

新精靈將引導您輕鬆完成初始設置，讓引導過程更加順暢。
如果您遇到任何問題，請將其回報至 [YouTrack](https://kotl.in/issue)，以幫助我們改進您的精靈體驗。

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="Create a project" style="block"/>
</a>

### Kotlin Multiplatform 完全支援 Gradle 配置快取

先前，我們引入了適用於 Kotlin 多平台程式庫的 Gradle 配置快取 [預覽](whatsnew19.md#preview-of-the-gradle-configuration-cache)。在 1.9.20 中，Kotlin Multiplatform 外掛程式更進一步。

它現在支援 [Kotlin CocoaPods Gradle 外掛程式](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html) 中的 Gradle 配置快取，以及 Xcode 組建所需的整合任務，例如 `embedAndSignAppleFrameworkForXcode`。

現在所有多平台專案都可以利用改進的組建時間。
Gradle 配置快取透過為後續組建重複使用配置階段的結果來加速組建過程。
有關詳細資訊和設置說明，請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)。

### 在 Gradle 中更輕鬆地配置新的標準程式庫版本

建立多平台專案時，標準程式庫 (`stdlib`) 的相依性會自動新增到每個原始碼集。這是開始使用多平台專案最簡單的方式。

先前，如果您想手動配置標準程式庫的相依性，您需要為每個原始碼集個別配置。從 `kotlin-stdlib:1.9.20` 開始，您只需在 `commonMain` 根原始碼集中配置 **一次** 相依性即可：

<table>
   <tr>
       <td>標準程式庫版本 1.9.10 及更早版本</td>
       <td>標準程式庫版本 1.9.20</td>
   </tr>
   <tr>
<td>

```kotlin
kotlin {
    sourceSets {
        // 對於 common 原始碼集
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

這項變更是透過在標準程式庫的 Gradle 中繼資料中包含新資訊實現的。這讓 Gradle 能夠自動為其他原始碼集解析正確的標準程式庫構件。

### 預設支援第三方 cinterop 程式庫

Kotlin 1.9.20 為所有套用了 [Kotlin CocoaPods Gradle](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) 外掛程式的專案中的 cinterop 相依性添加了預設支援（而非透過選擇加入的支援）。

這意味著您現在可以共享更多原生程式碼，而不受平台特定相依性的限制。例如，您可以將 [對 Pod 程式庫的相依性](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-libraries.html) 新增到 `iosMain` 共享原始碼集中。

先前，這僅適用於 Kotlin/Native 發行版隨附的 [平台特定程式庫](native-platform-libs.md)（如 Foundation、UIKit 和 POSIX）。現在，所有第三方 Pod 程式庫預設都可以在共享原始碼集中使用。您不再需要指定個別的 Gradle 屬性來支援它們。

### Compose Multiplatform 專案支援 Kotlin/Native 編譯快取

此版本解決了與 Compose Multiplatform 編譯器外掛程式的相容性問題，該問題主要影響 iOS 的 Compose Multiplatform 專案。

要解決此問題，您必須使用 `kotlin.native.cacheKind=none` Gradle 屬性停用快取。然而，這種解決方法會帶來效能代價：它減慢了編譯時間，因為快取在 Kotlin/Native 編譯器中不起作用。

既然問題已解決，您可以從 `gradle.properties` 檔案中移除 `kotlin.native.cacheKind=none`，並享受 Compose Multiplatform 專案中改進的編譯時間。

有關提高編譯時間的更多提示，請參閱 [Kotlin/Native 文件](native-improving-compilation-time.md)。

### 相容性指南

配置專案時，請檢查 Kotlin Multiplatform Gradle 外掛程式與可用 Gradle、Xcode 和 Android Gradle 外掛程式 (AGP) 版本的相容性：

| Kotlin Multiplatform Gradle 外掛程式 | Gradle | Android Gradle 外掛程式 | Xcode |
|---------------------------|------|----|----|
| 1.9.20        | 7.5 及更高版本 | 7.4.2–8.2 | 15.0。詳見下文 |

自此版本起，推薦的 Xcode 版本為 15.0。隨 Xcode 15.0 交付的程式庫已完全支援，您可以從 Kotlin 程式碼中的任何位置訪問它們。

不過，Xcode 14.3 在大多數情況下仍可運作。請記住，如果您在本機電腦上使用 14.3 版本，隨 Xcode 15 交付的程式庫將可見但不可訪問。

## Kotlin/Wasm

在 1.9.20 中，Kotlin Wasm 達到了 [Alpha 階段](components-stability.md) 的穩定性。

* [與 Wasm GC 第 4 階段和最終操作碼的相容性](#compatibility-with-wasm-gc-phase-4-and-final-opcodes)
* [新增 `wasm-wasi` 目標，並將 `wasm` 目標重新命名為 `wasm-js`](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [標準程式庫支援 WASI API](#support-for-the-wasi-api-in-the-standard-library)
* [Kotlin/Wasm API 改進](#kotlin-wasm-api-improvements)

> Kotlin Wasm 處於 [Alpha](components-stability.md) 階段。
> 它可能隨時更改。請僅出於評估目的使用它。
>
> 我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上提供的回饋。
>
{style="note"}

### 與 Wasm GC 第 4 階段和最終操作碼的相容性

Wasm GC 進入最終階段，需要更新操作碼（二進位表示中使用的常數數字）。
Kotlin 1.9.20 支援最新的操作碼，因此我們強烈建議您將 Wasm 專案更新到最新版本的 Kotlin。
我們還建議使用帶有 Wasm 環境的最新版本瀏覽器：
* Chrome 和基於 Chromium 的瀏覽器版本為 119 或更新。
* Firefox 版本為 119 或更新。請注意，在 Firefox 119 中，您需要 [手動開啟 Wasm GC](wasm-configuration.md)。

### 新的 wasm-wasi 目標，以及將 wasm 目標重新命名為 wasm-js

在此版本中，我們為 Kotlin/Wasm 引入了一個新目標 – `wasm-wasi`。我們也將 `wasm` 目標重新命名為 `wasm-js`。
在 Gradle DSL 中，這些目標分別以 `wasmWasi {}` 和 `wasmJs {}` 的形式提供。

要在您的專案中使用這些目標，請更新 `build.gradle.kts` 檔案：

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

先前引入的 `wasm {}` 區塊已被棄用，改用 `wasmJs {}`。

要遷移現有的 Kotlin/Wasm 專案，請執行以下操作：
* 在 `build.gradle.kts` 檔案中，將 `wasm {}` 區塊重新命名為 `wasmJs {}`。
* 在您的專案結構中，將 `wasmMain` 目錄重新命名為 `wasmJsMain`。

### 標準程式庫支援 WASI API

在此版本中，我們包含了對 [WASI](https://github.com/WebAssembly/WASI) 的支援，這是 Wasm 平台的系統介面。
WASI 支援讓您更容易在瀏覽器之外使用 Kotlin/Wasm，例如在伺服器端應用程式中，它提供了一組標準化的 API 來訪問系統資源。此外，WASI 還提供了基於能力的安全性 – 訪問外部資源時的另一層安全保護。

要執行 Kotlin/Wasm 應用程式，您需要一個支援 Wasm 垃圾收集 (GC) 的虛擬機，例如 Node.js 或 Deno。
Wasmtime、WasmEdge 等仍致力於提供完整的 Wasm GC 支援。

要匯入 WASI 函式，請使用 `@WasmImport` 註解：

```kotlin
import kotlin.wasm.WasmImport

@WasmImport("wasi_snapshot_preview1", "clock_time_get")
private external fun wasiRawClockTimeGet(clockId: Int, precision: Long, resultPtr: Int): Int
```

[您可以在我們的 GitHub 儲存庫中找到完整範例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)。

> 在針對 `wasmWasi` 時，無法使用 [與 JavaScript 的互通性](wasm-js-interop.md)。
>
{style="note"}

### Kotlin/Wasm API 改進

此版本對 Kotlin/Wasm API 進行了一些生活品質方面的改進。
例如，您不再需要為 DOM 事件監聽器回傳一個值：

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

Kotlin 1.9.20 與 Gradle 6.8.3 到 8.1 完全相容。您也可以使用最高到最新版本的 Gradle 版本，但如果這樣做，請記住您可能會遇到棄用警告，或者某些新的 Gradle 功能可能無法運作。

此版本帶來以下變更：
* [支援測試夾具訪問 internal 宣告](#support-for-test-fixtures-to-access-internal-declarations)
* [用於配置 Konan 目錄路徑的新屬性](#new-property-to-configure-paths-to-konan-directories)
* [Kotlin/Native 任務的新建置報告指標](#new-build-report-metrics-for-kotlin-native-tasks)

### 支援測試夾具訪問 internal 宣告

在 Kotlin 1.9.20 中，如果您使用 Gradle 的 `java-test-fixtures` 外掛程式，您的 [測試夾具](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) 現在可以訪問主原始碼集類別中的 `internal` 宣告。此外，任何測試原始碼也可以看到測試夾具類別中的任何 `internal` 宣告。

### 用於配置 Konan 目錄路徑的新屬性

在 Kotlin 1.9.20 中，可以使用 `konan.data.dir` Gradle 屬性來自訂您的 `~/.konan` 目錄路徑，這樣您就不必透過環境變數 `KONAN_DATA_DIR` 進行配置。

或者，您可以使用 `-Xkonan-data-dir` 編譯器選項，透過 `cinterop` 和 `konanc` 工具配置您的自訂 `~/.konan` 目錄路徑。

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

此外，`kotlin.experimental.tryK2` 建置報告現在包含任何已編譯的 Kotlin/Native 任務，並列出使用的語言版本：

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

> 如果您使用 Gradle 8.0，可能會遇到一些建置報告方面的問題，特別是在啟用 Gradle 配置快取時。這是一個已知問題，已在 Gradle 8.1 及更高版本中修復。
>
{style="note"}

## 標準程式庫

在 Kotlin 1.9.20 中，[Kotlin/Native 標準程式庫已趨於穩定](#the-kotlin-native-standard-library-becomes-stable)，並有一些新功能：
* [取代 Enum 類別 values 泛型函式](#replacement-of-the-enum-class-values-generic-function)
* [改進 Kotlin/JS 中 HashMap 操作的效能](#improved-performance-of-hashmap-operations-in-kotlin-js)

### 取代 Enum 類別 values 泛型函式

> 此功能是 [實驗性的](components-stability.md#stability-levels-explained)。它可能隨時被刪除或更改。
> 需要選擇加入（詳見下文）。僅出於評估目的使用它。我們歡迎您在 [YouTrack](https://kotl.in/issue) 上提供回饋。
>
{style="warning"}

在 Kotlin 1.9.0 中，列舉類別的 `entries` 屬性已趨於穩定。`entries` 屬性是合成 `values()` 函式的現代化且高效能的替代方案。作為 Kotlin 1.9.20 的一部分，泛型 `enumValues<T>()` 函式的替代方案是：`enumEntries<T>()`。

> 仍然支援 `enumValues<T>()` 函式，但我們建議您改用 `enumEntries<T>()` 函式，因為它的效能影響較小。每次呼叫 `enumValues<T>()` 時，都會建立一個新陣列，而每當您呼叫 `enumEntries<T>()` 時，每次都會回傳相同的清單，這要有效率得多。
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

要嘗試此功能，請使用 `@OptIn(ExperimentalStdlibApi)` 進行選擇加入，並使用 1.9 或更高版本的語言版本。如果您使用最新版本的 Kotlin Gradle 外掛程式，則無需指定語言版本即可測試該功能。

### Kotlin/Native 標準程式庫已穩定

在 Kotlin 1.9.0 中，我們 [解釋了](whatsnew19.md#the-kotlin-native-standard-library-s-journey-towards-stabilization) 為了使 Kotlin/Native 標準程式庫更接近穩定目標而採取的行動。在 Kotlin 1.9.20 中，我們終於完成了這項工作，使 Kotlin/Native 標準程式庫趨於穩定。以下是此版本的一些亮點：

* [`Vector128`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-vector128/) 類別從 `kotlin.native` 套件移動到 `kotlinx.cinterop` 套件。
* `ExperimentalNativeApi` 和 `NativeRuntimeApi` 註解（作為 Kotlin 1.9.0 的一部分引入）的選擇加入要求級別已從 `WARNING` 提高到 `ERROR`。
* Kotlin/Native 集合現在會偵測並行修改，例如在 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/) 和 [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/) 集合中。
* `Throwable` 類別的 [`printStackTrace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/print-stack-trace.html) 函式現在會印出到 `STDERR` 而非 `STDOUT`。
  > `printStackTrace()` 的輸出格式不穩定，可能會發生變化。
  >
  {style="warning"}

#### Atomics API 的改進

在 Kotlin 1.9.0 中，我們說過當 Kotlin/Native 標準程式庫穩定時，Atomics API 就會準備好穩定。Kotlin 1.9.20 包含以下額外變更：

* 引入了實驗性的 `AtomicIntArray`、`AtomicLongArray` 和 `AtomicArray<T>` 類別。這些新類別專為與 Java 的原子陣列保持一致而設計，以便將來可以包含在通用標準程式庫中。
  > `AtomicIntArray`、`AtomicLongArray` 和 `AtomicArray<T>` 類別是 [實驗性的](components-stability.md#stability-levels-explained)。它們可能隨時被刪除或更改。要嘗試它們，請使用 `@OptIn(ExperimentalStdlibApi)` 進行選擇加入。請僅出於評估目的使用它們。我們歡迎在 [YouTrack](https://kotl.in/issue) 上提供回饋。
  >
  {style="warning"}
* 在 `kotlin.native.concurrent` 套件中，在 Kotlin 1.9.0 中以 `WARNING` 棄用級別棄用的 Atomics API，其棄用級別已提高到 `ERROR`。
* 在 `kotlin.concurrent` 套件中，[`AtomicInt`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-int/index.html) 和 [`AtomicLong`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-long/index.html) 類別中棄用級別為 `ERROR` 的成員函數已被移除。
* `AtomicReference` 類別的所有 [成員函數](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-reference/#functions) 現在都使用原子內建（intrinsic）函式。

有關 Kotlin 1.9.20 中所有變更的更多資訊，請參閱我們的 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-61028/Behavioural-changes-to-the-Native-stdlib-API)。

### 改進 Kotlin/JS 中 HashMap 操作的效能

Kotlin 1.9.20 改進了 `HashMap` 操作的效能，並減少了它們在 Kotlin/JS 中的記憶體佔用。在內部，Kotlin/JS 已將其實作更改為開放定址（open addressing）。這意味著當您執行以下操作時，應該會看到效能改進：
* 將新元素插入 `HashMap`。
* 在 `HashMap` 中搜尋現有元素。
* 遍歷 `HashMap` 中的鍵或值。

## 文件更新

Kotlin 文件收到了一些顯著的變化：
* [JVM 中繼資料](https://kotlinlang.org/api/kotlinx-metadata-jvm/) API 參考 – 探索如何使用 Kotlin/JVM 解析中繼資料。
* [時間測量指南](time-measurement.md) – 了解如何在 Kotlin 中計算和測量時間。
* [Kotlin 導覽](kotlin-tour-welcome.md) 中改進的集合章節 – 透過包含理論與實踐的章節學習 Kotlin 程式語言的基礎知識。
* [絕對不可為 null 型別](generics.md#definitely-non-nullable-types) – 了解絕對不可為 null 的泛型型別。
* 改進的 [陣列頁面](arrays.md) – 了解陣列以及何時使用它們。
* [Kotlin Multiplatform 中的預期宣告與實際宣告](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) – 了解 Kotlin Multiplatform 中預期宣告與實際宣告的機制。

## 安裝 Kotlin 1.9.20

### 檢查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2023.1.x 和 2023.2.x 會自動建議將 Kotlin 外掛程式更新到 1.9.20 版本。IntelliJ IDEA 2023.3 將包含 Kotlin 1.9.20 外掛程式。

Android Studio Hedgehog (231) 和 Iguana (232) 將在即將發佈的版本中支援 Kotlin 1.9.20。

新的命令列編譯器可在 [GitHub 發佈頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.9.20) 下載。

### 配置 Gradle 設定

要下載 Kotlin 構件和相依性，請更新您的 `settings.gradle(.kts)` 檔案以使用 Maven Central 儲存庫：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

如果未指定儲存庫，Gradle 會使用即將關閉的 JCenter 儲存庫，這可能會導致 Kotlin 構件出現問題。