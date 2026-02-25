[//]: # (title: Kotlin 2.0.20 的新功能)

<web-summary>閱讀 Kotlin 2.0.20 版本說明，涵蓋新語言功能、Kotlin Multiplatform、JVM、Native、JS 和 Wasm 的更新，以及 Gradle 和 Maven 的建置工具支援。</web-summary>

_[發布日期：2024 年 8 月 22 日](releases.md#release-history)_

Kotlin 2.0.20 正式發布！此版本包含了 Kotlin 2.0.0 的效能改進和錯誤修復，我們在 2.0.0 中已宣佈 Kotlin K2 編譯器進入 Stable（穩定）狀態。以下是此版本的一些額外亮點：

* [`data class` 的 `copy` 函式將具有與建構函式相同的可見性](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
* [現在在多平台專案中可以使用來自預設目標階層原始碼集的靜態存取子](#static-accessors-for-source-sets-from-default-target-hierarchy)
* [Kotlin/Native 的垃圾收集中已實現並行標記](#concurrent-marking-in-garbage-collector)
* [Kotlin/Wasm 中的 `@ExperimentalWasmDsl` 註解有了新位置](#new-location-of-experimentalwasmdsl-annotation)
* [新增對 Gradle 版本 8.6–8.8 的支援](#gradle)
* [新選項允許在 Gradle 專案之間以類別檔案形式共享 JVM 產物](#option-to-share-jvm-artifacts-between-projects-as-class-files)
* [Compose 編譯器已更新](#compose-compiler)
* [通用 Kotlin 標準程式庫新增對 UUID 的支援](#support-for-uuids-in-the-common-kotlin-standard-library)

> 有關 Kotlin 發布週期的資訊，請參閱 [Kotlin 發布流程](releases.md)。
>
{style="tip"}

## IDE 支援

支援 2.0.20 的 Kotlin 外掛程式已隨附在最新的 IntelliJ IDEA 和 Android Studio 中。
您不需要在 IDE 中更新 Kotlin 外掛程式。
您只需在建置指令碼中將 Kotlin 版本更改為 2.0.20 即可。

詳情請參閱[更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 語言

Kotlin 2.0.20 開始引入變更以提高 `data class` 的一致性，並取代實驗性的 context receivers 功能。

### data class 的 copy 函式將具有與建構函式相同的可見性

目前，如果您使用 `private` 建構函式建立 `data class`，自動生成的 `copy()` 函式並不具有相同的可見性。這可能會在以後的程式碼中導致問題。在未來的 Kotlin 版本中，我們將引入以下行為：`copy()` 函式的預設可見性將與建構函式相同。此變更將逐步引入，以幫助您盡可能順利地遷移程式碼。

我們的遷移計畫從 Kotlin 2.0.20 開始，對於未來可見性將發生變更的程式碼，編譯器會發出警告。例如：

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
    // 警告：Non-public primary constructor is exposed via the generated 'copy()' method of the 'data' class.
    // 生成的 'copy()' 將在未來版本中更改其可見性。
}
```

有關我們遷移計畫的最新資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-11914) 中的相應問題。

為了讓您能更精確地控制此行為，我們在 Kotlin 2.0.20 中引入了兩個註解：

* `@ConsistentCopyVisibility`：現在就選擇加入（opt-in）此行為，在我們於未來版本將其設為預設之前生效。
* `@ExposedCopyVisibility`：選擇退出（opt-out）此行為並隱藏宣告處的警告。
  請注意，即使使用了此註解，當呼叫 `copy()` 函式時，編譯器仍會報告警告。

如果您想在 2.0.20 中為整個模組而非個別類別選擇加入新行為，
可以使用 `-Xconsistent-data-class-copy-visibility` 編譯器選項。
此選項的效果等同於為模組中的所有 `data class` 新增 `@ConsistentCopyVisibility` 註解。

### 分階段將 context receivers 替換為 context parameters

在 Kotlin 1.6.20 中，我們引入了 [context receivers](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm) 作為一項[實驗性](components-stability.md#stability-levels-explained)功能。在聽取社群回饋後，我們決定不再繼續採用此方法，並將採取不同的方向。

在未來的 Kotlin 版本中，context receivers 將被 context parameters 取代。Context parameters 目前仍處於設計階段，您可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md) 中找到提案。

由於 context parameters 的實作需要對編譯器進行重大更改，我們決定不同時支援 context receivers 和 context parameters。這一決定大大簡化了實作過程，並最大限度地降低了行為不穩定的風險。

我們瞭解已有大量開發人員在使用 context receivers。因此，我們將開始逐步移除對 context receivers 的支援。我們的遷移計畫從 Kotlin 2.0.20 開始，當在程式碼中使用 `-Xcontext-receivers` 編譯器選項且使用 context receivers 時，編譯器會發出警告。例如：

```kotlin
class MyContext

context(MyContext)
// 警告：Experimental context receivers are deprecated and will be superseded by context parameters. 
// 請不要使用 context receivers。您可以明確傳遞參數，或使用帶有擴充功能的成員。
fun someFunction() {
}
```

此警告在未來的 Kotlin 版本中將變為錯誤。

如果您在程式碼中使用了 context receivers，我們建議您將程式碼遷移為使用以下任一方式：

* 明確參數。

   <table>
      <tr>
          <td>前</td>
          <td>後</td>
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
          <td>前</td>
          <td>後</td>
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

或者，您可以等到編譯器支援 context parameters 的 Kotlin 版本發布。請注意，context parameters 最初將作為實驗性功能引入。

## Kotlin Multiplatform

Kotlin 2.0.20 改進了多平台專案中的原始碼集管理，並因 Gradle 最近的變更而棄用了與某些 Gradle Java 外掛程式的相容性。

### 來自預設目標階層原始碼集的靜態存取子

自 Kotlin 1.9.20 起，[預設階層範本](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)會自動應用於所有 Kotlin Multiplatform 專案。
對於預設階層範本中的所有原始碼集，Kotlin Gradle 外掛程式都提供了型別安全存取子。
這樣，您終於可以存取所有指定目標的原始碼集，而無需使用 `by getting` 或 `by creating` 建構。

Kotlin 2.0.20 旨在進一步提升您的 IDE 體驗。現在，它在 `sourceSets {}` 區塊中為預設階層範本的所有原始碼集提供了靜態存取子。
我們相信此變更將使透過名稱存取原始碼集變得更簡單、更可預測。

每個此類原始碼集現在都有詳細的 KDoc 註解（包含範例），以及在您嘗試在未先宣告相應目標的情況下存取原始碼集時顯示的診斷警告訊息：

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
        // 警告：在未註冊目標的情況下存取原始碼集
        iosX64Main { }
    }
}
```

![依名稱存取原始碼集](accessing-sourse-sets.png){width=700}

進一步了解 [Kotlin Multiplatform 中的階層式專案結構](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html)。

### 棄用 Kotlin Multiplatform Gradle 外掛程式與 Gradle Java 外掛程式的相容性

在 Kotlin 2.0.20 中，當您在同一個專案中同時套用 Kotlin Multiplatform Gradle 外掛程式和以下任一 Gradle Java 外掛程式時，我們將發出棄用警告：[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 和 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)。
當多平台專案中的另一個 Gradle 外掛程式套用了 Gradle Java 外掛程式時，也會出現此警告。
例如，[Spring Boot Gradle 外掛程式](https://docs.spring.io/spring-boot/gradle-plugin/index.html)會自動套用 Application 外掛程式。

我們新增此棄用警告是由於 Kotlin Multiplatform 的專案模型與 Gradle 的 Java 生態系統外掛程式之間存在根本性的相容性問題。Gradle 的 Java 生態系統外掛程式目前未考慮到其他外掛程式可能會：

* 也以不同於 Java 生態系統外掛程式的方式為 JVM 目標進行發布或編譯。
* 在同一個專案中具有兩個不同的 JVM 目標，例如 JVM 和 Android。
* 具有複雜的多平台專案結構，且可能包含多個非 JVM 目標。

遺憾的是，Gradle 目前尚未提供任何 API 來解決這些問題。

我們之前在 Kotlin Multiplatform 中使用了一些權宜之計來協助整合 Java 生態系統外掛程式。
然而，這些權宜之計從未真正解決相容性問題，且自 Gradle 8.8 版本發布以來，這些權宜之計已不再可行。如需更多資訊，請參閱我們的 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)。

雖然我們尚不清楚如何解決此相容性問題，但我們致力於繼續支援在 Kotlin Multiplatform 專案中進行某種形式的 Java 原始碼編譯。至少，我們將支援 Java 原始碼的編譯，以及在多平台專案中使用 Gradle 的 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 外掛程式。

同時，如果您在多平台專案中看到此棄用警告，我們建議您：
1. 確定專案中是否真的需要 Gradle Java 外掛程式。如果不需要，請考慮將其移除。
2. 檢查 Gradle Java 外掛程式是否僅用於單個任務。如果是，您可能可以毫不費力地移除該外掛程式。例如，如果該任務使用 Gradle Java 外掛程式來建立 Javadoc JAR 檔案，您可以手動定義 Javadoc 任務。

否則，如果您想在多平台專案中同時使用 Kotlin Multiplatform Gradle 外掛程式和這些 Java 的 Gradle 外掛程式，我們建議您：

1. 在多平台專案中建立一個單獨的子專案。
2. 在單獨的子專案中，套用 Java 的 Gradle 外掛程式。
3. 在單獨的子專案中，新增對父多平台專案的相依性。

> 單獨的子專案**不得**是多平台專案，且您只能使用它來建立對多平台專案的相依性。
>
{style="warning"}

例如，您有一個名為 `my-main-project` 的多平台專案，並且想使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle 外掛程式來執行 JVM 應用程式。

建立子專案（假設名為 `subproject-A`）後，您的父專案結構應如下所示：

```text
.
├── build.gradle.kts
├── settings.gradle
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

在子專案的 `build.gradle.kts` 檔案中，於 `plugins {}` 區塊中套用 Application 外掛程式：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("application")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id('application')
}
```

</tab>
</tabs>

在子專案的 `build.gradle.kts` 檔案中，新增對父多平台專案的相依性：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 父多平台專案的名稱
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // 父多平台專案的名稱
}
```

</tab>
</tabs>

您的父專案現在已設定為可與這兩個外掛程式配合工作。

## Kotlin/Native

Kotlin/Native 在垃圾收集以及從 Swift/Objective-C 呼叫 Kotlin 暫停函式方面進行了改進。

### 垃圾收集中的並行標記

在 Kotlin 2.0.20 中，JetBrains 團隊在提高 Kotlin/Native 執行階段效能方面又邁出了一步。
我們在垃圾收集（GC）中新增了對並行標記的實驗性支援。

預設情況下，當 GC 在堆積中標記物件時，應用程式執行緒必須暫停。這會極大地影響 GC 暫停時間的持續時間，這對於延遲敏感型應用程式（例如使用 Compose Multiplatform 建置的 UI 應用程式）的效能至關重要。

現在，垃圾收集的標記階段可以與應用程式執行緒同時執行。
這應該會顯著縮短 GC 暫停時間並有助於提高應用程式回應性。

#### 如何啟用

該功能目前為[實驗性](components-stability.md#stability-levels-explained)。
要啟用它，請在 `gradle.properties` 檔案中設定以下選項：

```none
kotlin.native.binary.gc=cms
```

請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 報告任何問題。

### 移除對 bitcode 嵌入的支援

從 Kotlin 2.0.20 開始，Kotlin/Native 編譯器不再支援 bitcode 嵌入。
Bitcode 嵌入在 Xcode 14 中已棄用，並在 Xcode 15 中針對所有 Apple 目標移除。

現在，架構配置的 `embedBitcode` 參數以及 `-Xembed-bitcode` 和 `-Xembed-bitcode-marker` 命令列引數均已棄用。

如果您仍在使用較早版本的 Xcode 但想升級到 Kotlin 2.0.20，請在 Xcode 專案中停用 bitcode 嵌入。

### 使用 signpost 監控 GC 效能的變更

Kotlin 2.0.0 使得透過 Xcode Instruments 監控 Kotlin/Native 垃圾收集（GC）效能成為可能。Instruments 包含 signpost 工具，可以將 GC 暫停顯示為事件。
這在檢查 iOS 應用程式中與 GC 相關的凍結時非常有用。

該功能原本是預設啟用的，但遺憾的是，
當應用程式與 Xcode Instruments 同時執行時，有時會導致當機。
從 Kotlin 2.0.20 開始，它需要使用以下編譯器選項明確選擇加入：

```none
-Xbinary=enableSafepointSignposts=true
```

在[文件](native-memory-manager.md#monitor-gc-performance)中進一步了解 GC 效能分析。

### 在非主執行緒上從 Swift/Objective-C 呼叫 Kotlin 暫停函式的能力

此前，Kotlin/Native 有一項預設限制，將從 Swift 和 Objective-C 呼叫 Kotlin 暫停函式的能力限制在僅主執行緒。Kotlin 2.0.20 解除了該限制，允許您在任何執行緒上從 Swift/Objective-C 執行 Kotlin `suspend` 函式。

如果您之前使用 `kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none` 二進制選項切換了非主執行緒的預設行為，現在可以從 `gradle.properties` 檔案中將其移除。

## Kotlin/Wasm

在 Kotlin 2.0.20 中，Kotlin/Wasm 繼續向具名導出（named exports）遷移，並重新安置了 `@ExperimentalWasmDsl` 註解。

### 預設導出（default export）使用的錯誤

作為向具名導出遷移的一部分，先前在 JavaScript 中對 Kotlin/Wasm 導出使用預設匯入時，會在主控台列印警告訊息。

為了完全支援具名導出，此警告現在已升級為錯誤。如果您使用預設匯入，將遇到以下錯誤訊息：

```text
Do not use default import. Use the corresponding named import instead.
```

此變更是遷移至具名導出的棄用週期的一部分。以下是各個階段的預期情況：

* **在 2.0.0 版本中**：主控台會列印一條警告訊息，說明已棄用透過預設導出導出實體。
* **在 2.0.20 版本中**：發生錯誤，要求使用相應的具名匯入。
* **在 2.1.0 版本中**：完全移除對預設匯入的使用。

### ExperimentalWasmDsl 註解的新位置

先前，WebAssembly (Wasm) 功能的 `@ExperimentalWasmDsl` 註解位於 Kotlin Gradle 外掛程式的以下位置：

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

在 2.0.20 中，`@ExperimentalWasmDsl` 註解已重新安置至：

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

舊位置現已棄用，並可能因未解決的參考而導致建置失敗。

要反映 `@ExperimentalWasmDsl` 註解的新位置，請更新 Gradle 建置指令碼中的 import 陳述式。
為新的 `@ExperimentalWasmDsl` 位置使用明確匯入：

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

或者，從舊套件中移除此星號匯入陳述式：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JS 引入了一些實驗性功能，以支援 JavaScript 中的靜態成員，以及從 JavaScript 建立 Kotlin 集合。

### 支援在 JavaScript 中使用 Kotlin 靜態成員

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。隨時可能被棄用或更改。
> 僅用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 上提供的回饋。
>
{style="warning"}

從 Kotlin 2.0.20 開始，您可以使用 `@JsStatic` 註解。它的工作方式類似於 [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/)，並指示編譯器為目標宣告生成額外的靜態方法。這有助於您直接在 JavaScript 中使用 Kotlin 程式碼中的靜態成員。

您可以對具名物件中定義的函式以及在類別和介面內部宣告的伴隨物件（companion objects）使用 `@JsStatic` 註解。編譯器會生成物件的靜態方法和物件本身的實例方法。例如：

```kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

現在，`callStatic()` 在 JavaScript 中是靜態的，而 `callNonStatic()` 則不是：

```javascript
C.callStatic();              // 有效，存取靜態函式
C.callNonStatic();           // 錯誤，在生成的 JavaScript 中不是靜態函式
C.Companion.callStatic();    // 實例方法仍然存在
C.Companion.callNonStatic(); // 這是唯一有效的方式
```

也可以將 `@JsStatic` 註解應用於物件或伴隨物件的屬性，使其 getter 和 setter 方法成為該物件或包含該伴隨物件之類別中的靜態成員。

### 從 JavaScript 建立 Kotlin 集合的能力

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。隨時可能被棄用或更改。
> 僅用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript) 上提供的回饋。
>
{style="warning"}

Kotlin 2.0.0 引入了將 Kotlin 集合導出到 JavaScript（和 TypeScript）的功能。現在，JetBrains 團隊正邁出另一步來改進集合互通性。從 Kotlin 2.0.20 開始，可以直接從 JavaScript/TypeScript 側建立 Kotlin 集合。

您可以從 JavaScript 建立 Kotlin 集合，並將其作為引數傳遞給導出的建構函式或函式。
只要您在導出的宣告中提到集合，Kotlin 就會為該集合生成一個可在 JavaScript/TypeScript 中使用的工廠。

看看以下導出的函式：

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

由於提到了 `MutableMap` 集合，Kotlin 會生成一個帶有工廠方法的物件，該方法可從 JavaScript/TypeScript 呼叫。
然後此工廠方法從 JavaScript `Map` 建立一個 `MutableMap`：

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

此功能適用於 `Set`、`Map` 和 `List` Kotlin 集合類型及其可變對應類型。

## Gradle

Kotlin 2.0.20 與 Gradle 6.8.3 到 8.6 完全相容。Gradle 8.7 和 8.8 也受支援，但只有一個例外：如果您使用 Kotlin Multiplatform Gradle 外掛程式，您可能會在呼叫 JVM 目標中 `withJava()` 函式的多平台專案中看到棄用警告。我們計畫盡快修復此問題。

如需更多資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning) 中的問題。

您也可以使用最高到最新發布版本的 Gradle，但如果這樣做，請記住您可能會遇到棄用警告或某些新的 Gradle 功能可能無法正常運作。

此版本帶來的變更包括開始棄用基於 JVM 歷程記錄檔案的舊增量編譯方法，以及在專案之間共享 JVM 產物的新方式。

### 棄用基於 JVM 歷程記錄檔案的增量編譯

在 Kotlin 2.0.20 中，基於 JVM 歷程記錄檔案的增量編譯方法已被棄用，轉而使用自 Kotlin 1.8.20 以來預設啟用的新增量編譯方法。

基於 JVM 歷程記錄檔案的增量編譯方法存在一些限制，
例如無法與 [Gradle 的建置快取](https://docs.gradle.org/current/userguide/build_cache.html)配合使用，
且不支援編譯規避。
相比之下，新增量編譯方法克服了這些限制，且自推出以來表現良好。

鑑於新增量編譯方法在過去兩個主要的 Kotlin 版本中已被預設使用，
`kotlin.incremental.useClasspathSnapshot` Gradle 屬性在 Kotlin 2.0.20 中已被棄用。
因此，如果您使用它來選擇退出，將會看到棄用警告。

### 選項：以類別檔案形式在專案間共享 JVM 產物

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。
> 隨時可能被棄用或更改。僅用於評估目的。
> 我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 上提供的回饋。
> 需要選擇加入（詳見下文）。
>
{style="warning"}

在 Kotlin 2.0.20 中，我們引入了一種新方法，改變了 Kotlin/JVM 編譯輸出（如 JAR 檔案）在專案之間的共享方式。透過這種方式，Gradle 的 `apiElements` 組態現在有一個次要變體，可提供對包含已編譯 `.class` 檔案之目錄的存取。設定後，您的專案將在編譯期間使用此目錄，而不是請求壓縮的 JAR 產物。這減少了 JAR 檔案被壓縮和解壓縮的次數，特別是對於增量建置。

我們的測試顯示，這種新方法可以為 Linux 和 macOS 主機提供建置效能改進。
然而，在 Windows 主機上，我們觀察到效能下降，這是由於 Windows 處理檔案 I/O 作業的方式所致。

要嘗試此新方法，請在 `gradle.properties` 檔案中新增以下屬性：

```none
kotlin.jvm.addClassesVariant=true
```

預設情況下，此屬性設定為 `false`，且 Gradle 中的 `apiElements` 變體會請求壓縮的 JAR 產物。

> Gradle 有一個相關屬性，您可以在僅限 Java 的專案中使用它，以便在編譯期間**僅**公開壓縮的 JAR 產物，而不是包含已編譯 `.class` 檔案的目錄：
>
> ```none
> org.gradle.java.compile-classpath-packaging=true
> ```
>
> 有關此屬性及其用途的更多資訊，
> 請參閱 Gradle 有關 [Windows 上大型多專案建置效能顯著下降](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance)的文件。
>
{style="note"}

我們感謝您對此新方法的回饋。您在使用時是否注意到任何效能提升？
請透過在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 中發表評論來告訴我們。

### 將 Kotlin Gradle 外掛程式的相依性行為與 java-test-fixtures 外掛程式對齊

在 Kotlin 2.0.20 之前，如果您在專案中使用 [`java-test-fixtures` 外掛程式](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)，Gradle 和 Kotlin Gradle 外掛程式在相依性傳遞方式上存在差異。 

Kotlin Gradle 外掛程式會傳遞相依性：

* 從 `java-test-fixtures` 外掛程式的 `implementation` 和 `api` 相依性類型傳遞到 `test` 原始碼集編譯類別路徑。
* 從主原始碼集的 `implementation` 和 `api` 相依性類型傳遞到 `java-test-fixtures` 外掛程式的原始碼集編譯類別路徑。 

然而，Gradle 僅傳遞 `api` 相依性類型中的相依性。

這種行為差異導致某些專案在類別路徑中多次發現資源檔案。 

從 Kotlin 2.0.20 開始，Kotlin Gradle 外掛程式的行為與 Gradle 的 `java-test-fixtures` 外掛程式保持一致，因此此問題不再發生在此或其他 Gradle 外掛程式中。

由於此變更，`test` 和 `testFixtures` 原始碼集中的某些相依性可能不再可存取。
如果發生這種情況，請將相依性宣告類型從 `implementation` 更改為 `api`，或者在受影響的原始碼集上新增相依性宣告。

### 為編譯任務缺少相依性的罕見情況新增任務相依性

在 2.0.20 之前，我們發現某些情況下編譯任務缺少對其其中一個產物輸入的任務相依性。這意味著受影響的編譯任務結果是不穩定的，因為有時產物已及時生成，但有時則不然。

為了修復此問題，Kotlin Gradle 外掛程式現在會在這些情況下自動新增必要的任務相依性。

在極少數情況下，我們發現這種新行為可能會導致循環相依錯誤。
例如，如果您有多個編譯任務，其中一個編譯任務可以看到另一個任務的所有內部宣告，並且生成的產物依賴於這兩個編譯任務的輸出，您可能會看到如下錯誤：

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

為了修復此循環相依錯誤，我們新增了一個 Gradle 屬性：`archivesTaskOutputAsFriendModule`。

預設情況下，此屬性設定為 `true` 以追蹤任務相依性。要在編譯任務中停用該產物的使用（從而不需要任務相依性），請在 `gradle.properties` 檔案中新增以下內容：

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

如需更多資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69330) 中的問題。

## Compose 編譯器

在 Kotlin 2.0.20 中，Compose 編譯器獲得了幾項改進。

### 修復 2.0.0 中引入的不必要重新組合（recomposition）問題

Compose 編譯器 2.0.0 存在一個問題，即在具有非 JVM 目標的多平台專案中，它有時會錯誤地推斷類型的穩定性。這可能導致不必要的（甚至無止盡的）重新組合。我們強烈建議將針對 Kotlin 2.0.0 製作的 Compose 應用程式更新至 2.0.10 或更新版本。

如果您的應用程式是使用 Compose 編譯器 2.0.10 或更新版本建置的，但使用了以 2.0.0 版本建置的相依性，
這些舊的相依性可能仍會導致重新組合問題。
為了防止這種情況，請將您的相依性更新為與您的應用程式使用相同 Compose 編譯器版本建置的版本。

### 設定編譯器選項的新方式

我們引入了一種新的選項設定機制，以避免頂層參數頻繁變動。
對於 Compose 編譯器團隊來說，透過為 `composeCompiler {}` 區塊建立或移除頂層入口來進行測試是比較困難的。
因此，現在透過 `featureFlags` 屬性啟用諸如強力略過模式（strong skipping mode）和非略過群組最佳化（non-skipping group optimizations）等選項。
此屬性將用於測試最終將成為預設值的新 Compose 編譯器選項。

此變更也已應用於 Compose 編譯器 Gradle 外掛程式。要設定未來的特性標記，
請使用以下語法（此程式碼將切換所有預設值）：

```kotlin
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.IntrinsicRemember.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups,
        ComposeFeatureFlag.StrongSkipping.disabled()
    )
}
```

或者，如果您直接設定 Compose 編譯器，請使用以下語法：

```text
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=IntrinsicRemember
```

因此，`enableIntrinsicRemember`、`enableNonSkippingGroupOptimization` 和 `enableStrongSkippingMode` 屬性現已棄用。

我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags) 上對此新方法提供的任何回饋。

### 強力略過模式（Strong skipping mode）預設啟用

Compose 編譯器的強力略過模式現在預設啟用。

強力略過模式是一項 Compose 編譯器組態選項，它改變了可跳過的可組合項規則。
啟用強力略過模式後，具有不穩定參數的可組合項現在也可以被跳過。
強力略過模式還會自動記住（remember）可組合函式中使用的 lambda，
因此您不再需要用 `remember` 包裝您的 lambda 以避免重新組合。

有關更多詳細資訊，請參閱[強力略過模式文件](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)。

### 組合追蹤標記（Composition trace markers）預設啟用

Compose 編譯器 Gradle 外掛程式中的 `includeTraceMarkers` 選項現在預設設定為 `true`，以符合編譯器外掛程式中的預設值。這使您能夠在 Android Studio 系統追蹤分析器中看到可組合函式。有關組合追蹤的詳細資訊，請參閱這篇 [Android Developers 部落格文章](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535)。

### 非略過群組最佳化（Non-skipping group optimizations）

此版本包含一個新的編譯器選項：啟用後，不可略過且不可重新啟動的可組合函式將不再在可組合項主體周圍生成群組（group）。這會減少記憶體分配，從而提高效能。
此選項為實驗性且預設停用，但可以使用特性標記 `OptimizeNonSkippingGroups` 啟用，
如[上文](#new-way-to-configure-compiler-options)所示。

此特性標記現在已準備好進行更廣泛的測試。啟用該特性時發現的任何問題都可以在 [Google 問題追蹤器](https://goo.gle/compose-feedback)上提交。

### 支援抽象可組合函式中的預設參數

您現在可以為抽象可組合函式新增預設參數。

以前，即使這是有效的 Kotlin 程式碼，Compose 編譯器也會在嘗試執行此操作時報告錯誤。
我們現在已在 Compose 編譯器中新增了對此的支援，並且該限制已被移除。
這對於包含預設 `Modifier` 值特別有用：

```kotlin
abstract class Composables {
    @Composable
    abstract fun Composable(modifier: Modifier = Modifier)
}
```

open 可組合函式的預設參數在 2.0.20 中仍受到限制。此限制將在未來版本中解決。

## 標準程式庫

標準程式庫現在支援通用唯一識別碼（UUID）作為實驗性功能，並包含對 Base64 解碼的一些變更。

### 通用 Kotlin 標準程式庫對 UUID 的支援

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。
> 要選擇加入，請使用 `@ExperimentalUuidApi` 註解或編譯器選項 `-opt-in=kotlin.uuid.ExperimentalUuidApi`。
>
{style="warning"}

Kotlin 2.0.20 在通用 Kotlin 標準程式庫中引入了一個用於表示 [UUID（通用唯一識別碼）](https://en.wikipedia.org/wiki/Universally_unique_identifier) 的類別，以解決唯一標識項目的挑戰。

此外，此功能還為以下 UUID 相關操作提供了 API：

* 生成 UUID。
* 從字串表示形式解析 UUID 以及將其格式化為字串。
* 從指定的 128 位元值建立 UUID。
* 存取 UUID 的 128 位元。

以下程式碼範例示範了這些操作：

```kotlin
// 構建用於建立 UUID 的位元組陣列
val byteArray = byteArrayOf(
    0x55, 0x0E, 0x84.toByte(), 0x00, 0xE2.toByte(), 0x9B.toByte(), 0x41, 0xD4.toByte(),
    0xA7.toByte(), 0x16, 0x44, 0x66, 0x55, 0x44, 0x00, 0x00
)

val uuid1 = Uuid.fromByteArray(byteArray)
val uuid2 = Uuid.fromULongs(0x550E8400E29B41D4uL, 0xA716446655440000uL)
val uuid3 = Uuid.parse("550e8400-e29b-41d4-a716-446655440000")

println(uuid1)
// 550e8400-e29b-41d4-a716-446655440000
println(uuid1 == uuid2)
// true
println(uuid2 == uuid3)
// true

// 存取 UUID 位元
val version = uuid1.toLongs { mostSignificantBits, _ ->
    ((mostSignificantBits shr 12) and 0xF).toInt()
}
println(version)
// 4

// 生成隨機 UUID
val randomUuid = Uuid.random()

println(uuid1 == randomUuid)
// false
```

為了保持與使用 `java.util.UUID` 的 API 的相容性，Kotlin/JVM 中有兩個擴充功能函式可用於在 `java.util.UUID` 和 `kotlin.uuid.Uuid` 之間進行轉換：`.toJavaUuid()` 和 `.toKotlinUuid()`。例如：

```kotlin
val kotlinUuid = Uuid.parseHex("550e8400e29b41d4a716446655440000")
// 將 Kotlin UUID 轉換為 java.util.UUID
val javaUuid = kotlinUuid.toJavaUuid()

val javaUuid = java.util.UUID.fromString("550e8400-e29b-41d4-a716-446655440000")
// 將 Java UUID 轉換為 kotlin.uuid.Uuid
val kotlinUuid = javaUuid.toKotlinUuid()
```

此功能和提供的 API 允許在多個平台之間共享程式碼，從而簡化了多平台軟體開發。UUID 也非常適合難以生成唯一識別碼的環境。

UUID 的一些示例使用案例包括：

* 為資料庫記錄分配唯一 ID。
* 生成網頁工作階段（session）識別碼。
* 任何需要唯一識別或追蹤的場景。

### HexFormat 支援 minLength

> [`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 類別及其屬性為
> [實驗性](components-stability.md#stability-levels-explained)。
> 要選擇加入，請使用 `@OptIn(ExperimentalStdlibApi::class)` 註解或編譯器
> 選項 `-opt-in=kotlin.ExperimentalStdlibApi`。
>
{style="warning"}

Kotlin 2.0.20 在 [`NumberHexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/-number-hex-format/) 類別中新增了一個 `minLength` 屬性，
可透過 [`HexFormat.number`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/number.html) 存取。
此屬性讓您可以指定數值十六進位表示形式的最小位數，從而實現用零填充（padding）以滿足所需長度。此外，可以使用 `removeLeadingZeros` 屬性修剪前導零：

```kotlin
fun main() {
    println(93.toHexString(HexFormat {
        number.minLength = 4
        number.removeLeadingZeros = true
    }))
    // "005d"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-minlength-hexformat" validate="false"}

`minLength` 屬性不會影響解析。然而，如果額外的前導位數為零，解析現在允許十六進位字串具有比類型寬度更多的位數。

### Base64 解碼器行為的變更

> [`Base64` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.encoding/-base64/)及其
> 相關功能為[實驗性](components-stability.md#stability-levels-explained)。
> 要選擇加入，請使用 `@OptIn(ExperimentalEncodingApi::class)`
> 註解或編譯器選項 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`。
>
{style="warning"}

Kotlin 2.0.20 對 Base64 解碼器的行為引入了兩項變更：

* [Base64 解碼器現在需要填充](#the-base64-decoder-now-requires-padding)
* [新增了用於填充組態的 `withPadding` 函式](#withpadding-function-for-padding-configuration)

#### Base64 解碼器現在需要填充

Base64 編碼器現在預設新增填充（padding），解碼器在解碼時需要填充並禁止非零填充位。

#### 用於填充組態的 withPadding 函式

引入了一個新的 `.withPadding()` 函式，讓使用者能夠控制 Base64 編碼和解碼的填充行為：

```kotlin
val base64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)
```

此函式能夠建立具有不同填充選項的 `Base64` 實例：

| `PaddingOption`    | 編碼時       | 解碼時              |
|--------------------|--------------|---------------------|
| `PRESENT`          | 新增填充     | 需要填充            |
| `ABSENT`           | 省略填充     | 不允許填充          |
| `PRESENT_OPTIONAL` | 新增填充     | 填充是選用的        |
| `ABSENT_OPTIONAL`  | 省略填充     | 填充是選用的        |

您可以建立具有不同填充選項的 `Base64` 實例，並使用它們來編碼和解碼資料：

```kotlin
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
fun main() {
    // 待編碼的範例資料
    val data = "fooba".toByteArray()

    // 建立一個具有 URL 安全字母表和 PRESENT 填充的 Base64 實例
    val base64Present = Base64.UrlSafe.withPadding(Base64.PaddingOption.PRESENT)
    val encodedDataPresent = base64Present.encode(data)
    println("使用 PRESENT 填充編碼的資料: $encodedDataPresent")
    // 使用 PRESENT 填充編碼的資料: Zm9vYmE=

    // 建立一個具有 URL 安全字母表和 ABSENT 填充的 Base64 實例
    val base64Absent = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT)
    val encodedDataAbsent = base64Absent.encode(data)
    println("使用 ABSENT 填充編碼的資料: $encodedDataAbsent")
    // 使用 ABSENT 填充編碼的資料: Zm9vYmE

    // 將資料解碼回來
    val decodedDataPresent = base64Present.decode(encodedDataPresent)
    println("使用 PRESENT 填充解碼的資料: ${String(decodedDataPresent)}")
    // 使用 PRESENT 填充解碼的資料: fooba

    val decodedDataAbsent = base64Absent.decode(encodedDataAbsent)
    println("使用 ABSENT 填充解碼的資料: ${String(decodedDataAbsent)}")
    // 使用 ABSENT 填充解碼的資料: fooba
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-base64-decoder" validate="false"}

## 文件更新

Kotlin 文件進行了一些顯著的變更：

* 改進的[標準輸入頁面](standard-input.md) - 了解如何使用 Java Scanner 和 `readln()`。
* 改進的 [K2 編譯器遷移指南](k2-compiler-migration-guide.md) - 了解效能改進、與 Kotlin 程式庫的相容性以及如何處理您的自定義編譯器外掛程式。
* 改進的[例外頁面](exceptions.md) - 了解例外，以及如何拋出和捕捉它們。
* 改進的[在 JVM 中使用 JUnit 測試程式碼 - 教學](jvm-test-using-junit.md) - 了解如何使用 JUnit 建立測試。
* 改進的[與 Swift/Objective-C 的互通性頁面](native-objc-interop.md) - 了解如何在 Swift/Objective-C 程式碼中使用 Kotlin 宣告，以及在 Kotlin 程式碼中使用 Objective-C 宣告。
* 改進的 [Swift 套件導出設定頁面](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-export.html) - 了解如何設定可由 Swift 套件管理員相依項使用的 Kotlin/Native 輸出。

## 安裝 Kotlin 2.0.20

從 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛程式作為隨附外掛程式包含在您的 IDE 中。這意味著您無法再從 JetBrains Marketplace 安裝該外掛程式。

要更新到新的 Kotlin 版本，請在建置指令碼中將 [Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version)為 2.0.20。