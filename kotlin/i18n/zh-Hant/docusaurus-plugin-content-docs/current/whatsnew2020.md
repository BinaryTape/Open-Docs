---
title: "Kotlin 2.0.20 的新功能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[已發布：2024 年 8 月 22 日](releases#release-details)_

Kotlin 2.0.20 版本已發布！此版本包含 Kotlin 2.0.0 的效能改進和錯誤修復，其中我們
宣布 Kotlin K2 編譯器為 Stable（穩定版）。以下是此版本的一些其他重點：

* [資料類別 (data class) 的 copy 函式將具有與建構子相同的可見性](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
* [預設目標階層結構中來源集 (source set) 的靜態存取器現在可用於多平台專案](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
* [Kotlin/Native 中已可在垃圾回收器中進行並行標記](#concurrent-marking-in-garbage-collector)
* [Kotlin/Wasm 中的 `@ExperimentalWasmDsl` 註解有一個新的位置](#new-location-of-experimentalwasmdsl-annotation)
* [已新增對 Gradle 版本 8.6–8.8 的支援](#gradle)
* [新增一個選項，允許在 Gradle 專案之間以類別檔案形式共享 JVM 成品](#option-to-share-jvm-artifacts-between-projects-as-class-files)
* [Compose 編譯器已更新](#compose-compiler)
* [已將 UUID 支援新增至 common Kotlin 標準函式庫](#support-for-uuids-in-the-common-kotlin-standard-library)

## IDE 支援

支援 2.0.20 的 Kotlin 外掛程式 (plugin) 已捆綁在最新的 IntelliJ IDEA 和 Android Studio 中。
您無需更新 IDE 中的 Kotlin 外掛程式。
您只需在組建腳本中將 Kotlin 版本變更為 2.0.20 即可。

請參閱[更新至新版本](releases#update-to-a-new-kotlin-version)以取得詳細資訊。

## 語言

Kotlin 2.0.20 開始引入變更，以提高資料類別的一致性並替換 Experimental（實驗性）的 context receivers (上下文接收器) 功能。

### 資料類別的 copy 函式將具有與建構子相同的可見性

目前，如果您使用 `private` 建構子建立資料類別，則自動產生的 `copy()` 函式不具有
相同的可見性。這可能會在稍後的程式碼中造成問題。在未來的 Kotlin 版本中，我們將引入
`copy()` 函式的預設可見性與建構子相同的行為。此變更將逐步引入，以幫助您盡可能順利地移轉程式碼。

我們的移轉計畫從 Kotlin 2.0.20 開始，它會在您的程式碼中發出警告，指出可見性將在
未來變更。例如：

```kotlin
// 在 2.0.20 中觸發警告
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // 在 2.0.20 中觸發警告
    val negativeNumber = positiveNumber.copy(number = -1)
    // Warning: Non-public primary constructor is exposed via the generated 'copy()' method of the 'data' class.
    // The generated 'copy()' will change its visibility in future releases.
}
```

有關我們移轉計畫的最新資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-11914) 中的相應問題。

為了讓您更好地控制此行為，我們在 Kotlin 2.0.20 中引入了兩個註解：

* `@ConsistentCopyVisibility` 可讓您選擇立即加入此行為，然後我們會在稍後的版本中將其設為預設行為。
* `@ExposedCopyVisibility` 可讓您選擇退出此行為，並在宣告位置抑制警告。
  請注意，即使使用此註解，當呼叫 `copy()` 函式時，編譯器仍然會報告警告。

如果您想在 2.0.20 中為整個模組而不是在個別類別中選擇加入新行為，
您可以使用 `-Xconsistent-data-class-copy-visibility` 編譯器選項。
此選項的效果與將 `@ConsistentCopyVisibility` 註解新增至模組中的所有資料類別相同。

### 使用 context parameters (上下文參數) 分階段替換 context receivers

在 Kotlin 1.6.20 中，我們引入了 [context receivers](whatsnew1620#prototype-of-context-receivers-for-kotlin-jvm) 作為一個
[Experimental](components-stability#stability-levels-explained) 的功能。在聽取社群回饋後，我們
已決定不繼續採用此方法，而是採取不同的方向。

在未來的 Kotlin 版本中，context receivers 將由 context parameters 替換。Context parameters 仍在
設計階段，您可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters) 中找到提案。

由於 context parameters 的實作需要對編譯器進行重大變更，因此我們已決定不支援
同時使用 context receivers 和 context parameters。此決定大大簡化了實作，並最大限度地降低了
不穩定行為的風險。

我們理解 context receivers 已被大量開發人員使用。因此，我們將開始
逐步移除對 context receivers 的支援。我們的移轉計畫從 Kotlin 2.0.20 開始，當使用 `-Xcontext-receivers` 編譯器選項時，您的程式碼中會發出警告。例如：

```kotlin
class MyContext

context(MyContext)
// Warning: Experimental context receivers are deprecated and will be superseded by context parameters. 
// Please don't use context receivers. You can either pass parameters explicitly or use members with extensions.
fun someFunction() {
}
```

此警告將在未來的 Kotlin 版本中變成錯誤。

如果您在程式碼中使用 context receivers，我們建議您將程式碼移轉為使用以下任一項：

* 顯式參數。
<table>
<tr>
<td>
之前
</td>
<td>
之後
</td>
</tr>
<tr>
<td>

   ```kotlin
   context(ContextReceiverType)
   fun someFunction() {
       contextReceiverMember()
   }
   ```
</td>
<td>

   ```kotlin
   fun someFunction(explicitContext: ContextReceiverType) {
       explicitContext.contextReceiverMember()
   }
   ```
</td>
</tr>
</table>

* 擴充成員函式（如果可能）。
<table>
<tr>
<td>
之前
</td>
<td>
之後
</td>
</tr>
<tr>
<td>

   ```kotlin
   context(ContextReceiverType)
   fun contextReceiverMember() = TODO()
   
   context(ContextReceiverType)
   fun someFunction() {
       contextReceiverMember()
   }
   ```
</td>
<td>

   ```kotlin
   class ContextReceiverType {
       fun contextReceiverMember() = TODO()
   }
   
   fun ContextReceiverType.someFunction() {
       contextReceiverMember()
   }
   ```
</td>
</tr>
</table>

或者，您可以等到 Kotlin 版本在編譯器中支援 context parameters。請注意，
context parameters 最初將作為 Experimental 功能引入。

## Kotlin Multiplatform (Kotlin 多平台)

Kotlin 2.0.20 針對多平台專案中的來源集管理進行了改進，並棄用了與某些 Gradle Java 外掛程式的相容性，原因是 Gradle 最近進行了變更。

### 預設目標階層結構中來源集的靜態存取器

自 Kotlin 1.9.20 起，[預設階層結構範本](multiplatform-hierarchy#default-hierarchy-template)
會自動套用至所有 Kotlin Multiplatform 專案。
對於預設階層結構範本中的所有來源集，Kotlin Gradle 外掛程式提供了類型安全的存取器。
這樣，您最終可以存取所有指定目標的來源集，而無需使用 `by getting` 或 `by creating` 結構。

Kotlin 2.0.20 旨在進一步改善您的 IDE 體驗。它現在在
`sourceSets {}` 區塊中為預設階層結構範本中的所有來源集提供靜態存取器。
我們相信此變更將使按名稱存取來源集更容易且更可預測。

現在，每個此類來源集都有一個詳細的 KDoc 註解，其中包含範例和診斷訊息以及警告
，以防您嘗試存取來源集而不先宣告相應的目標：

```kotlin
kotlin {
    jvm()
    linuxX64()
    linuxArm64()
    mingwX64()
  
    sourceSets {
        commonMain.languageSettings {
            progressiveMode = true
        }

        jvmMain { }
        linuxX64Main { }
        linuxArm64Main { }
        linuxArm64Main { }
        // Warning: accessing source set without registering the target
        iosX64Main { }
    }
}
```

<img src="/img/accessing-sourse-sets.png" alt="Accessing the source sets by name" width="700" style={{verticalAlign: 'middle'}}/>

了解更多關於 [Kotlin Multiplatform 中階層式專案結構](multiplatform-hierarchy) 的資訊。

### 棄用 Kotlin Multiplatform Gradle 外掛程式與 Gradle Java 外掛程式的相容性

在 Kotlin 2.0.20 中，當您將 Kotlin Multiplatform Gradle 外掛程式
和以下任何 Gradle Java 外掛程式套用至同一個專案時，我們會引入棄用警告：[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、
[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 和 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)。
當您的多平台專案中的另一個 Gradle 外掛程式套用 Gradle Java 外掛程式時，也會顯示該警告。
例如，[Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html) 會自動套用 Application 外掛程式。

我們新增此棄用警告的原因是 Kotlin Multiplatform 的專案模型
與 Gradle 的 Java 生態系統外掛程式之間存在根本的相容性問題。Gradle 的 Java 生態系統外掛程式目前未考慮到其他外掛程式可能：

* 也以與 Java 生態系統外掛程式不同的方式發布或編譯 JVM 目標。
* 在同一個專案中具有兩個不同的 JVM 目標，例如 JVM 和 Android。
* 具有複雜的多平台專案結構，可能有多個非 JVM 目標。

遺憾的是，Gradle 目前未提供任何 API 來解決這些問題。

我們之前在 Kotlin Multiplatform 中使用了一些解決方法，以協助整合 Java 生態系統外掛程式。
但是，這些解決方法從未真正解決相容性問題，並且自 Gradle 8.8 發布以來，這些解決方法
已不再可行。如需更多資訊，請參閱我們的 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)。

雖然我們尚不清楚如何解決此相容性問題，但我們致力於繼續支援
在您的 Kotlin Multiplatform 專案中進行某種形式的 Java 來源編譯。至少，我們將支援編譯
Java 來源並在您的多平台專案中使用 Gradle 的 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html)
外掛程式。

同時，如果您在多平台專案中看到此棄用警告，我們建議您：
1. 確定您是否確實需要在專案中使用 Gradle Java 外掛程式。如果不需要，請考慮將其移除。
2. 檢查 Gradle Java 外掛程式是否僅用於單一任務。如果是這樣，您或許可以移除該外掛程式，而無需
   花費太多精力。例如，如果該任務使用 Gradle Java 外掛程式來建立 Javadoc JAR 檔案，您可以改為手動定義 Javadoc
   任務。

否則，如果您想在您的多平台專案中同時使用 Kotlin Multiplatform Gradle 外掛程式和這些用於
Java 的 Gradle 外掛程式，我們建議您：

1. 在您的多平台專案中建立一個單獨的子專案。
2. 在單獨的子專案中，套用適用於 Java 的 Gradle 外掛程式。
3. 在單獨的子專案中，新增對您的父多平台專案的依賴。

:::note
單獨的子專案不得為多平台專案，您必須僅使用它來設定對您的多平台專案的依賴。

例如，您有一個名為 `my-main-project` 的多平台專案，並且您想
使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle 外掛程式來執行 JVM 應用程式。

建立子專案後，我們將其稱為 `subproject-A`，您的父專案結構應如下所示：

```text
.
├── build.gradle.kts
├── settings.gradle
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

在您的子專案的 `build.gradle.kts` 檔案中，在 `plugins {}` 區塊中套用 Application 外掛程式：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("application")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id('application')
}
```

</TabItem>
</Tabs>

在您的子專案的 `build.gradle.kts` 檔案中，新增對您的父多平台專案的依賴：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 您的父多平台專案的名稱
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation project(':my-main-project') // 您的父多平台專案的名稱
}
```

</TabItem>
</Tabs>

您的父專案現在已設定為可與兩個外掛程式搭配使用。

## Kotlin/Native

Kotlin/Native 在垃圾回收器中進行了改進，並且可以從 Swift/Objective-C 呼叫 Kotlin 暫停函式。

### 垃圾回收器中的並行標記

在 Kotlin 2.0.20 中，JetBrains 團隊朝著改善 Kotlin/Native 執行階段效能邁出了另一步。
我們已新增對垃圾回收器 (GC) 中並行標記的實驗性支援。

依預設，當 GC 標記堆積中的物件時，必須暫停應用程式執行緒。這會極大地影響
GC 暫停時間的長度，這對於延遲關鍵應用程式（例如使用 Compose Multiplatform 建構的 UI 應用程式）的效能非常重要。

現在，垃圾回收的標記階段可以與應用程式執行緒同時執行。
這應顯著縮短 GC 暫停時間，並有助於提高應用程式的回應能力。

#### 如何啟用

此功能目前為 [Experimental](components-stability#stability-levels-explained)。
若要啟用它，請在您的 `gradle.properties` 檔案中設定以下選項：

```none
kotlin.native.binary.gc=cms
```

請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 報告任何問題。

### 已移除對 bitcode 嵌入的支援

從 Kotlin 2.0.20 開始，Kotlin/Native 編譯器不再支援 bitcode 嵌入。
Bitcode 嵌入已在 Xcode 14 中棄用，並在 Xcode 15 中針對所有 Apple 目標移除。

現在，framework 組態的 `embedBitcode` 參數
以及 `-Xembed-bitcode` 和 `-Xembed-bitcode-marker` 命令列引數已棄用。

如果您仍然使用較早版本的 Xcode，但想要升級到 Kotlin 2.0.20，
請在您的 Xcode 專案中停用 bitcode 嵌入。

### 使用 signposts 變更 GC 效能監控

Kotlin 2.0.0 使透過 Xcode Instruments 監控 Kotlin/Native 垃圾回收器
(GC) 的效能成為可能。Instruments 包含 signposts 工具，該工具可以將 GC 暫停顯示為事件。
這在檢查 iOS 應用程式中與 GC 相關的凍結時非常方便。

此功能依預設已啟用，但不幸的是，
當應用程式與 Xcode Instruments 同時執行時，它有時會導致崩潰。
從 Kotlin 2.0.20 開始，它需要使用以下編譯器選項明確選擇加入：

```none
-Xbinary=enableSafepointSignposts=true
```

在[文件中](native-memory-manager#monitor-gc-performance)了解更多關於 GC 效能分析的資訊。

### 能夠從非主要執行緒上的 Swift/Objective-C 呼叫 Kotlin 暫停函式

先前，Kotlin/Native 有一個預設限制，將從 Swift
和 Objective-C 呼叫 Kotlin 暫停函式的能力限制為僅限主要執行緒。Kotlin 2.0.20 解除了該限制，允許您從 Swift/Objective-C 在任何執行緒上執行 Kotlin
`suspend` 函式。

如果您先前已使用 `kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none`
二進位選項切換非主要執行緒的預設行為，您現在可以從您的 `gradle.properties` 檔案中移除它。

## Kotlin/Wasm

在 Kotlin 2.0.20 中，Kotlin/Wasm 繼續朝命名匯出移轉，並重新定位 `@ExperimentalWasmDsl` 註解。

### 預設匯出使用中的錯誤

作為朝命名匯出移轉的一部分，先前在使用預設匯入
JavaScript 中 Kotlin/Wasm 匯出時，會將警告訊息列印到控制台。

為了完全支援命名匯出，此警告現在已升級為錯誤。如果您使用預設匯入，您會遇到
以下錯誤訊息：

```text
Do not use default import. Use the corresponding named import instead.
```

此變更是朝命名匯出移轉的棄用週期的一部分。以下是您可以在每個階段預期的內容：

* **在 2.0.0 版本中**：會將警告訊息列印到控制台，說明透過預設匯出匯出實體已棄用。
* **在 2.0.20 版本中**：發生錯誤，要求使用相應的命名匯入。
* **在 2.1.0 版本中**：完全移除預設匯入的使用。

### ExperimentalWasmDsl 註解的新位置

先前，WebAssembly (Wasm) 功能的 `@ExperimentalWasmDsl` 註解位於 Kotlin Gradle 外掛程式中的以下位置：

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

在 2.0.20 中，`@ExperimentalWasmDsl` 註解已重新定位到：

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

先前的位置現在已棄用，並可能導致建構失敗，並出現未解析的參考。

若要反映 `@ExperimentalWasmDsl` 註解的新位置，請更新您的 Gradle 組建腳本中的匯入陳述式。
對新的 `@ExperimentalWasmDsl` 位置使用明確的匯入：

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

或者，從舊套件中移除此星號匯入陳述式：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JS 引入了一些 Experimental 功能，以支援 JavaScript 中的靜態成員，並從 JavaScript 建立 Kotlin 集合。

### 支援在 JavaScript 中使用 Kotlin 靜態成員

此功能為 [Experimental](components-stability#stability-levels-explained)。它可能會隨時被刪除或變更。
僅將其用於評估目的。我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 上提供關於它的意見回饋。

從 Kotlin 2.0.20 開始，您可以使用 `@JsStatic` 註解。它的工作方式與 [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/) 類似
，並指示編譯器為目標宣告產生額外的靜態方法。這有助於您直接在 JavaScript 中使用來自您的 Kotlin 程式碼的靜態成員。

您可以將 `@JsStatic` 註解用於在具名物件中定義的函式，以及在類別和介面中宣告的伴生物件。
編譯器會產生物件的靜態方法和物件本身中的實例方法。例如：

```kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

現在，`callStatic()` 在 JavaScript 中是靜態的，而 `callNonStatic()` 不是：

```javascript
C.callStatic();              // 有效，存取靜態函式
C.callNonStatic();           // 錯誤，在產生的 JavaScript 中不是靜態函式
C.Companion.callStatic();    // 實例方法保持不變
C.Companion.callNonStatic(); // 這是唯一有效的方式
```

也可以將 `@JsStatic` 註解套用至物件或伴生物件的屬性，使其 getter
和 setter 方法成為該物件或包含伴生物件的類別中的靜態成員。

### 能夠從 JavaScript 建立 Kotlin 集合

此功能為 [Experimental](components-stability#stability-levels-explained)。它可能會隨時被刪除或變更。
僅將其用於評估目的。我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript) 上提供關於它的意見回饋。

Kotlin 2.0.0 引入了將 Kotlin 集合匯出到 JavaScript（和 TypeScript）的功能。現在，JetBrains 團隊
正在採取另一步驟來改善集合互通性。從 Kotlin 2.0.20 開始，可以
直接從 JavaScript/TypeScript 端建立 Kotlin 集合。

您可以從 JavaScript 建立 Kotlin 集合，並將它們作為引數傳遞給匯出的建構子或函式。
只要您在匯出的宣告中提及集合，Kotlin 就會為集合產生一個工廠，該工廠在 JavaScript/TypeScript 中可用。

查看以下匯出的函式：

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

由於提到了 `MutableMap` 集合，因此 Kotlin 會產生一個物件，其中包含一個可從 JavaScript/TypeScript 取得的工廠方法。
然後，此工廠方法會從 JavaScript `Map` 建立一個 `MutableMap`：

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

此功能適用於 `Set`、`Map` 和 `List` Kotlin 集合類型及其可變對應項。

## Gradle

Kotlin 2.0.20 完全相容於 Gradle 6.8.3 至 8.6。Gradle 8.7 和 8.8 也受支援，但只有一個
例外：如果您使用 Kotlin Multiplatform Gradle 外掛程式，您可能會在您的多平台專案中看到棄用警告
在 JVM 目標中呼叫 `withJava()` 函式。我們計劃盡快解決此問題。

如需更多資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning) 中的問題。

您也可以使用高達最新 Gradle 版本的 Gradle 版本，但如果您這樣做，請記住您可能會遇到
棄用警告或某些新的 Gradle 功能可能無法運作。

此版本帶來了一些變更，例如開始棄用基於 JVM 歷史記錄檔案的舊增量編譯方法，
以及一種在專案之間共享 JVM 成品的新方法。

### 已棄用基於 JVM 歷史記錄檔案的增量編譯

在 Kotlin 2.0.20 中，基於 JVM 歷史記錄檔案的增量編譯方法已棄用，取而代之的是
自 Kotlin 1.8.20 起預設已啟用的新增量編譯方法。

基於 JVM 歷史記錄檔案的增量編譯方法存在限制，
例如不適用於 [Gradle 的組建快取](https://docs.gradle.org/current/userguide/build_cache.html)
並且不支援編譯迴避。
相比之下，新的增量編譯方法克服了這些限制，並且自引入以來一直表現良好。

鑑於新的增量編譯方法已在過去兩個主要的 Kotlin 版本中預設使用，
因此 `kotlin.incremental.useClasspathSnapshot` Gradle 屬性已在 Kotlin 2.0.20 中棄用。
因此，如果您使用它來選擇退出，您將會看到棄用警告。

### 用於在專案之間以類別檔案形式共享 JVM 成品的選項

此功能為 [Experimental](components-stability#stability-levels-explained)。
它可能會隨時被刪除或變更。僅將其用於評估目的。
我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 上提供關於它的意見回饋。
需要選擇加入（請參閱以下詳細資訊）。

在 Kotlin 2.0.20 中，我們引入了一種新方法，該方法變更了 Kotlin/JVM 編譯（例如 JAR 檔案）的
輸出在專案之間共享的方式。透過此方法，Gradle 的 `apiElements` 組態現在有一個次要
變體，可提供對包含已編譯 `.class` 檔案的目錄的存取權。設定後，您的專案會使用此
目錄，而不是在編譯期間要求壓縮的 JAR 成品。這減少了 JAR 檔案壓縮和解壓縮的次數，尤其是在增量組建中。

我們的測試顯示，這種新方法可以為 Linux 和 macOS 主機提供組建效能改進。
但是，在 Windows 主機上，由於 Windows 在處理檔案時處理 I/O 作業的方式，我們看到了效能下降。

若要嘗試這種新方法，請將以下屬性新增至您的 `gradle.properties` 檔案：

```none
kotlin.jvm.addClassesVariant=true
```

依預設，此屬性設定為 `false`，並且 Gradle 中的 `apiElements` 變體會要求壓縮的 JAR 成品。

Gradle 有一個相關的屬性，您可以在僅限 Java 的專案中使用該屬性，以便僅公開編譯期間的壓縮 JAR 成品，**而不是**包含已編譯 `.class` 檔案的目錄：

```none
org.gradle.java.compile-classpath-packaging=true
```

如需關於此屬性及其用途的更多資訊，
請參閱 Gradle 關於 [巨大多專案在 Windows 上顯著降低組建效能](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance) 的文件。

:::

我們將感謝您提供關於這種新方法的意見回饋。您在使用它時是否注意到任何效能改進？
請在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 中新增評論來告訴我們。

### 使 Kotlin Gradle 外掛程式的依賴行為與 java-test-fixtures 外掛程式的行為保持一致

在 Kotlin 2.0.20 之前，如果您在專案中使用 [`java-test-fixtures` 外掛程式](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)
，則 Gradle 和 Kotlin Gradle 外掛程式在依賴項傳播方式上存在差異。

Kotlin Gradle 外掛程式會傳播依賴項：

* 從 `java-test-fixtures` 外掛程式的 `implementation` 和 `api` 依賴類型到 `test` 來源集編譯類別路徑。
* 從主要來源集的 `implementation` 和 `api` 依賴類型到 `java-test-fixtures` 外掛程式的來源集編譯類別路徑。

但是，Gradle 僅在 `api` 依賴類型中傳播依賴項。

這種行為上的差異導致某些專案在類別路徑中多次找到資源檔案。

自 Kotlin 2.0.20 起，Kotlin Gradle 外掛程式的行為與 Gradle 的 `java-test-fixtures` 外掛程式保持一致，因此這種
問題不會再發生於此或其他 Gradle 外掛程式。

由於此變更，`test` 和 `testFixtures` 來源集中的某些依賴項可能不再可存取。
如果發生這種情況，請將依賴項宣告類型從 `implementation` 變更為 `api`，或在受影響的來源集中新增新的依賴項
宣告。

### 為編譯任務缺少成品依賴項的罕見情況新增任務依賴項

在 2.0.20 之前，我們發現有些情況下，編譯任務缺少其一個成品輸入的任務依賴項。
這意味著相依編譯任務的結果不穩定，因為有時會及時產生成品，但有時則不會。

為了修正此問題，Kotlin Gradle 外掛程式現在會在這些情況下自動新增所需的任務依賴項。

在極少數情況下，我們發現這種新行為可能會導致循環依賴錯誤。
例如，如果您有多個編譯，其中一個編譯可以看到另一個編譯的所有內部宣告，
並且產生的成品依賴於兩個編譯任務的輸出，您可能會看到類似以下的錯誤：

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

若要修正此循環依賴錯誤，我們已新增 Gradle 屬性：`archivesTaskOutputAsFriendModule`。

依預設，此屬性設定為 `true` 以追蹤任務依賴項。若要停用在編譯中使用的成品
任務，因此不需要任務依賴項，請在您的 `gradle.properties` 檔案中新增以下內容：

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

如需更多資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69330) 中的問題。

## Compose 編譯器

在 Kotlin 2.0.20 中，Compose 編譯器獲得了一些改進。

### 修復了 2.0.0 中引入的不必要的重組問題

Compose 編譯器 2.0.0 存在一個問題，有時會在具有非 JVM 目標的多平台專案中錯誤地推斷類型的穩定性。
這可能會導致不必要的（甚至無止境的）重組。我們強烈建議您將使用 Kotlin 2.0.0 製作的 Compose 應用程式更新
到 2.0.10 或更新版本。

如果您的應用程式是使用 Compose 編譯器 2.0.10 或更新版本建構的，但使用使用 2.0.0 版本建構的依賴項，
這些較舊的依賴項可能仍然會導致重組問題。
為了防止這種情況發生，請將您的依賴項更新到使用與您的應用程式相同的 Compose 編譯器建構的版本。

### 設定編譯器選項的新方法

我們引入了一種新的選項設定機制，以避免頂層參數的變動。
Compose 編譯器團隊很難透過建立或移除 `composeCompiler {}` 區塊的頂層項目來測試事物。
因此，現在透過 `featureFlags` 屬性啟用強跳過模式和非跳過群組最佳化等選項。
此屬性將用於測試最終將成為預設值的新 Compose 編譯器選項。

此變更也已套用至 Compose 編譯器 Gradle 外掛程式。若要設定未來的特徵旗標，
請使用以下語法（此程式碼會反轉所有預設值）：

```kotlin
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.IntrinsicRemember.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups,
        ComposeFeatureFlag.StrongSkipping.disabled()
    )
}
```

或者，如果您要直接設定 Compose 編譯器，請使用以下語法：

```text
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=IntrinsicRemember
```

因此，`enableIntrinsicRemember`、`enableNonSkippingGroupOptimization` 和 `enableStrongSkippingMode` 屬性已棄用。

我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags) 中提供關於這種新方法的任何意見回饋。

### 依預設啟用強跳過模式

Compose 編譯器的強跳過模式現在依預設已啟用。

強跳過模式是一種 Compose 編譯器組態選項，它變更了可以跳過哪些 composable 的規則。
啟用強跳過模式後，現在也可以跳過具有不穩定參數的 composable。
強跳過模式也會自動記住 composable 函式中使用的 lambda，
因此您不再需要使用 `remember` 包裝您的 lambda，以避免重組。

如需更多詳細資訊，請參閱 [強跳過模式文件](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)。

### 依預設啟用組合追蹤標記

`includeTraceMarkers` 選項現在在 Compose 編譯器 Gradle 外掛程式中依預設設定為 `true`，以符合
編譯器外掛程式中的預設值。這可讓您在 Android Studio 系統追蹤分析器中查看 composable 函式。如需關於
組合追蹤的詳細資訊，請參閱此 [Android Developers 網誌文章](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535)。