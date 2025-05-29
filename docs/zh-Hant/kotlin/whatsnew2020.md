[//]: # (title: Kotlin 2.0.20 的新功能)

_[發布日期：2024 年 8 月 22 日](releases.md#release-details)_

Kotlin 2.0.20 版本已發布！此版本包含 Kotlin 2.0.0 的效能改進和錯誤修復，我們在 Kotlin 2.0.0 中宣佈了 Kotlin K2 編譯器已進入穩定版。以下是此版本的一些額外亮點：

* [資料類別 (data class) 的複製函式與建構函式具備相同可見度](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
* [多平台專案中現在可使用預設目標層級中原始碼集的靜態存取器](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
* [垃圾收集器 (garbage collector) 中已實現 Kotlin/Native 的並行標記 (concurrent marking)](#concurrent-marking-in-garbage-collector)
* [Kotlin/Wasm 中的 `@ExperimentalWasmDsl` 註解有了新的位置](#new-location-of-experimentalwasmdsl-annotation)
* [已新增對 Gradle 8.6–8.8 版本的支援](#gradle)
* [新選項允許在 Gradle 專案之間以類別檔案形式共享 JVM 構件 (artifact)](#option-to-share-jvm-artifacts-between-projects-as-class-files)
* [Compose 編譯器已更新](#compose-compiler)
* [已新增對通用 Kotlin 標準函式庫中 UUID 的支援](#support-for-uuids-in-the-common-kotlin-standard-library)

## IDE 支援

支援 2.0.20 的 Kotlin 外掛程式已隨最新的 IntelliJ IDEA 和 Android Studio 一起捆綁。
您無需在 IDE 中更新 Kotlin 外掛程式。
您只需要在您的建置腳本中將 Kotlin 版本變更為 2.0.20 即可。

有關詳細資訊，請參閱 [更新至新版本](releases.md#update-to-a-new-kotlin-version)。

## 語言

Kotlin 2.0.20 開始引入變更，以改善資料類別 (data class) 的一致性，並取代實驗性 (Experimental) 上下文接收器 (context receivers) 功能。

### 資料類別的複製函式與建構函式具備相同可見度

目前，如果您使用 `private` 建構函式建立資料類別，自動生成的 `copy()` 函式不會具備相同的可見度。這可能會在您的程式碼中造成問題。在未來的 Kotlin 版本中，我們將引入 `copy()` 函式的預設可見度與建構函式相同的行為。這項變更將逐步引入，以協助您盡可能平穩地遷移程式碼。

我們的遷移計畫從 Kotlin 2.0.20 開始，它會在您的程式碼中發出警告，指示未來可見度將會變更。例如：

```kotlin
// Triggers a warning in 2.0.20
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // Triggers a warning in 2.0.20
    val negativeNumber = positiveNumber.copy(number = -1)
    // Warning: Non-public primary constructor is exposed via the generated 'copy()' method of the 'data' class.
    // The generated 'copy()' will change its visibility in future releases.
}
```

有關我們遷移計畫的最新資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-11914) 中的相應問題。

為了讓您更好地控制此行為，Kotlin 2.0.20 中我們引入了兩個註解：

*   `@ConsistentCopyVisibility` 在未來版本中將其設為預設值之前，現在選擇啟用 (opt-in) 此行為。
*   `@ExposedCopyVisibility` 選擇禁用 (opt out) 此行為並抑制聲明站點的警告。請注意，即使使用此註解，當呼叫 `copy()` 函式時，編譯器仍會報告警告。

如果您想在 2.0.20 中就為整個模組而不是單個類別啟用新行為，可以使用 `-Xconsistent-data-class-copy-visibility` 編譯器選項。此選項的效果與在模組中的所有資料類別上新增 `@ConsistentCopyVisibility` 註解相同。

### 逐步以上下文參數取代上下文接收器

在 Kotlin 1.6.20 中，我們引入了 [上下文接收器 (context receivers)](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm) 作為一項 [實驗性](components-stability.md#stability-levels-explained) 功能。在聽取社群回饋後，我們決定不再沿用此方法，並將採取不同的方向。

在未來的 Kotlin 版本中，上下文接收器將被上下文參數取代。上下文參數仍處於設計階段，您可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md) 中找到該提案。

由於上下文參數的實作需要對編譯器進行重大更改，我們決定不同時支援上下文接收器和上下文參數。此決定大大簡化了實作並最大程度地降低了不穩定行為的風險。

我們理解上下文接收器已被大量開發者使用。因此，我們將開始逐步移除對上下文接收器的支援。我們的遷移計畫從 Kotlin 2.0.20 開始，當使用 `-Xcontext-receivers` 編譯器選項時，您的程式碼中將發出關於使用上下文接收器的警告。例如：

```kotlin
class MyContext

context(MyContext)
// Warning: Experimental context receivers are deprecated and will be superseded by context parameters. 
// Please don't use context receivers. You can either pass parameters explicitly or use members with extensions.
fun someFunction() {
}
```

此警告將在未來的 Kotlin 版本中變為錯誤。

如果您在程式碼中使用上下文接收器，我們建議您將程式碼遷移為使用以下任一方式：

*   明確參數。

   <table>
      <tr>
          <td>之前 (Before)</td>
          <td>之後 (After)</td>
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

*   擴充成員函式 (如果可能)。

   <table>
      <tr>
          <td>之前 (Before)</td>
          <td>之後 (After)</td>
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

或者，您可以等到編譯器支援上下文參數的 Kotlin 版本發布。請注意，上下文參數最初將作為實驗性 (Experimental) 功能引入。

## Kotlin 多平台 (Kotlin Multiplatform)

Kotlin 2.0.20 帶來了多平台專案中原始碼集 (source set) 管理的改進，並由於 Gradle 的近期變更，棄用了與某些 Gradle Java 外掛程式的相容性。

### 預設目標層級中原始碼集的靜態存取器

自 Kotlin 1.9.20 起，[預設層級範本](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template) 會自動應用於所有 Kotlin 多平台專案。對於所有來自預設層級範本的原始碼集，Kotlin Gradle 外掛程式提供了型別安全的存取器。這樣一來，您最終可以存取所有指定目標的原始碼集，而無需使用 `by getting` 或 `by creating` 結構。

Kotlin 2.0.20 旨在進一步改善您的 IDE 體驗。它現在在 `sourceSets {}` 區塊中為預設層級範本中的所有原始碼集提供了靜態存取器。我們相信這項變更將使按名稱存取原始碼集變得更容易、更可預測。

現在每個這樣的原始碼集都有一個詳細的 KDoc 註解，其中包含範例和診斷訊息，如果嘗試在未先聲明相應目標的情況下存取原始碼集，則會發出警告：

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
        // Warning: accessing source set without registering the target
        iosX64Main { }
    }
}
```

![Accessing the source sets by name](accessing-sourse-sets.png){width=700}

進一步了解 [Kotlin 多平台中的分層專案結構](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html)。

### 棄用與 Kotlin 多平台 Gradle 外掛程式及 Gradle Java 外掛程式的相容性

在 Kotlin 2.0.20 中，當您在同一專案中同時應用 Kotlin 多平台 Gradle 外掛程式和以下任何 Gradle Java 外掛程式時，我們將引入棄用警告：[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 和 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)。當您的多平台專案中的另一個 Gradle 外掛程式應用 Gradle Java 外掛程式時，也會出現此警告。例如，[Spring Boot Gradle 外掛程式](https://docs.spring.io/spring-boot/gradle-plugin/index.html) 會自動應用 Application 外掛程式。

我們之所以新增此棄用警告，是因 Kotlin 多平台專案模型與 Gradle 的 Java 生態系統外掛程式之間存在根本的相容性問題。Gradle 的 Java 生態系統外掛程式目前未考慮到其他外掛程式可能：

*   以與 Java 生態系統外掛程式不同的方式發布或編譯 JVM 目標。
*   在同一專案中擁有兩個不同的 JVM 目標，例如 JVM 和 Android。
*   擁有複雜的多平台專案結構，可能包含多個非 JVM 目標。

遺憾的是，Gradle 目前未提供任何 API 來解決這些問題。

我們之前在 Kotlin 多平台中使用了一些變通方法來協助整合 Java 生態系統外掛程式。然而，這些變通方法從未真正解決相容性問題，而且自 Gradle 8.8 發布以來，這些變通方法已不再可行。有關詳細資訊，請參閱我們的 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)。

儘管我們尚不清楚確切如何解決此相容性問題，但我們致力於繼續支援您的 Kotlin 多平台專案中的某種形式的 Java 原始碼編譯。至少，我們將支援 Java 原始碼的編譯以及在您的多平台專案中使用 Gradle 的 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 外掛程式。

同時，如果您在多平台專案中看到此棄用警告，我們建議您：
1.  確定您的專案中是否確實需要 Gradle Java 外掛程式。如果不需要，請考慮將其移除。
2.  檢查 Gradle Java 外掛程式是否僅用於單個任務。如果是，您可能可以輕鬆移除該外掛程式。例如，如果任務使用 Gradle Java 外掛程式來建立 Javadoc JAR 檔案，您可以手動定義 Javadoc 任務。

否則，如果您想在您的多平台專案中同時使用 Kotlin 多平台 Gradle 外掛程式和這些 Java 的 Gradle 外掛程式，我們建議您：

1.  在您的多平台專案中建立一個單獨的子專案。
2.  在單獨的子專案中，應用 Java 的 Gradle 外掛程式。
3.  在單獨的子專案中，新增對父多平台專案的依賴。

> 該單獨的子專案**不得**是多平台專案，且您只能使用它來設定對您的多平台專案的依賴。
>
{style="warning"}

例如，您有一個名為 `my-main-project` 的多平台專案，並且您想使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle 外掛程式來執行 JVM 應用程式。

一旦您建立了一個子專案，我們稱之為 `subproject-A`，您的父專案結構應如下所示：

```text
.
├── build.gradle.kts
├── settings.gradle
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

在您的子專案的 `build.gradle.kts` 檔案中，在 `plugins {}` 區塊中應用 Application 外掛程式：

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

在您的子專案的 `build.gradle.kts` 檔案中，新增對父多平台專案的依賴：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 您父多平台專案的名稱
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // 您父多平台專案的名稱
}
```

</tab>
</tabs>

您的父專案現在已設定為可與兩個外掛程式一起工作。

## Kotlin/Native

Kotlin/Native 在垃圾收集器以及從 Swift/Objective-C 呼叫 Kotlin suspending 函式方面獲得改進。

### 垃圾收集器中的並行標記

在 Kotlin 2.0.20 中，JetBrains 團隊在改進 Kotlin/Native 執行時效能方面又邁出了一步。我們新增了垃圾收集器 (GC) 中並行標記 (concurrent marking) 的實驗性 (experimental) 支援。

預設情況下，當 GC 在堆中標記物件時，應用程式執行緒必須暫停。這極大地影響了 GC 暫停時間的持續時間，這對於延遲敏感型應用程式（例如使用 Compose Multiplatform 建置的 UI 應用程式）的效能至關重要。

現在，垃圾收集的標記階段可以與應用程式執行緒同時運行。這應該會顯著縮短 GC 暫停時間，並有助於提高應用程式的回應速度。

#### 如何啟用

該功能目前處於 [實驗性](components-stability.md#stability-levels-explained) 階段。
要啟用它，請在您的 `gradle.properties` 檔案中設定以下選項：

```none
kotlin.native.binary.gc=cms
```

請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 報告任何問題。

### 移除對 bitcode 嵌入的支援

從 Kotlin 2.0.20 開始，Kotlin/Native 編譯器不再支援 bitcode 嵌入。Bitcode 嵌入在 Xcode 14 中已棄用，並在 Xcode 15 中針對所有 Apple 目標移除。

現在，用於框架設定的 `embedBitcode` 參數，以及 `-Xembed-bitcode` 和 `-Xembed-bitcode-marker` 命令列參數均已棄用。

如果您仍使用早期版本的 Xcode 但想升級到 Kotlin 2.0.20，請在您的 Xcode 專案中禁用 bitcode 嵌入。

### 使用 signposts 監控 GC 效能的變更

Kotlin 2.0.0 使得透過 Xcode Instruments 監控 Kotlin/Native 垃圾收集器 (GC) 的效能成為可能。Instruments 包含 signposts 工具，該工具可以將 GC 暫停顯示為事件。這在檢查 iOS 應用程式中與 GC 相關的凍結時非常有用。

該功能預設啟用，但不幸的是，當應用程式與 Xcode Instruments 同時運行時，有時會導致崩潰。從 Kotlin 2.0.20 開始，它需要使用以下編譯器選項明確選擇啟用 (opt-in)：

```none
-Xbinary=enableSafepointSignposts=true
```

在[文件](native-memory-manager.md#monitor-gc-performance)中了解更多關於 GC 效能分析的資訊。

### 從 Swift/Objective-C 在非主執行緒上呼叫 Kotlin suspending 函式的能力

以前，Kotlin/Native 有一個預設限制，將從 Swift 和 Objective-C 呼叫 Kotlin suspending 函式的功能限制在主執行緒。Kotlin 2.0.20 解除了該限制，允許您從 Swift/Objective-C 在任何執行緒上運行 Kotlin `suspend` 函式。

如果您之前曾使用 `kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none` 二進位選項切換非主執行緒的預設行為，您現在可以將其從 `gradle.properties` 檔案中移除。

## Kotlin/Wasm

在 Kotlin 2.0.20 中，Kotlin/Wasm 繼續向命名匯出 (named exports) 遷移，並重新定位了 `@ExperimentalWasmDsl` 註解。

### 預設匯出使用中的錯誤

作為向命名匯出遷移的一部分，先前當在 JavaScript 中使用 Kotlin/Wasm 匯出的預設匯入時，控制台會列印一條警告訊息。

為了完全支援命名匯出，此警告現已升級為錯誤。如果您使用預設匯入，將遇到以下錯誤訊息：

```text
Do not use default import. Use the corresponding named import instead.
```

此變更是棄用週期的一部分，旨在遷移至命名匯出。以下是每個階段您可能遇到的情況：

*   **在 2.0.0 版本中**：控制台會列印一條警告訊息，解釋透過預設匯出導出實體已被棄用。
*   **在 2.0.20 版本中**：發生錯誤，要求使用相應的命名匯入。
*   **在 2.1.0 版本中**：預設匯入的使用將被完全移除。

### ExperimentalWasmDsl 註解的新位置

以前，WebAssembly (Wasm) 功能的 `@ExperimentalWasmDsl` 註解位於 Kotlin Gradle 外掛程式中的此位置：

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

在 2.0.20 中，`@ExperimentalWasmDsl` 註解已重新定位到：

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

以前的位置現已棄用，並可能導致建置失敗，出現未解析的引用。

為了反映 `@ExperimentalWasmDsl` 註解的新位置，請更新您的 Gradle 建置腳本中的 import 語句。為新的 `@ExperimentalWasmDsl` 位置使用明確的 import：

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

或者，從舊套件中移除此星號 import 語句：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JS 引入了一些實驗性 (Experimental) 功能，以支援 JavaScript 中的靜態成員以及從 JavaScript 建立 Kotlin 集合。

### 支援在 JavaScript 中使用 Kotlin 靜態成員

> 此功能為 [實驗性](components-stability.md#stability-levels-explained) 功能。它可能隨時被移除或變更。請僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 上提供回饋。
>
{style="warning"}

從 Kotlin 2.0.20 開始，您可以使用 `@JsStatic` 註解。它與 [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/) 類似，並指示編譯器為目標宣告生成額外的靜態方法。這有助於您直接在 JavaScript 中使用 Kotlin 程式碼中的靜態成員。

您可以將 `@JsStatic` 註解用於在命名物件中定義的函式，以及在類別和介面中宣告的伴生物件中。編譯器會生成物件的靜態方法和物件本身的實例方法。例如：

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
C.callStatic();              // 正常運作，存取靜態函式
C.callNonStatic();           // 錯誤，在生成的 JavaScript 中不是靜態函式
C.Companion.callStatic();    // 實例方法仍然存在
C.Companion.callNonStatic(); // 這是唯一有效的方式
```

也可以將 `@JsStatic` 註解應用於物件或伴生物件的屬性，使其 getter 和 setter 方法成為該物件或包含伴生物件的類別中的靜態成員。

### 從 JavaScript 建立 Kotlin 集合的能力

> 此功能為 [實驗性](components-stability.md#stability-levels-explained) 功能。它可能隨時被移除或變更。請僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript) 上提供回饋。
>
{style="warning"}

Kotlin 2.0.0 引入了將 Kotlin 集合匯出到 JavaScript (和 TypeScript) 的能力。現在，JetBrains 團隊正採取另一步驟來改進集合互通性。從 Kotlin 2.0.20 開始，可以直接從 JavaScript/TypeScript 端建立 Kotlin 集合。

您可以從 JavaScript 建立 Kotlin 集合，並將它們作為參數傳遞給匯出的建構函式或函式。一旦您在匯出宣告中提及集合，Kotlin 就會為該集合生成一個在 JavaScript/TypeScript 中可用的工廠。

請看以下匯出的函式：

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

由於提到了 `MutableMap` 集合，Kotlin 會生成一個帶有工廠方法的物件，該方法可從 JavaScript/TypeScript 獲得。然後，此工廠方法會從 JavaScript `Map` 建立一個 `MutableMap`：

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

Kotlin 2.0.20 與 Gradle 6.8.3 到 8.6 完全相容。Gradle 8.7 和 8.8 也受支援，只有一個例外：如果您使用 Kotlin 多平台 Gradle 外掛程式，在 JVM 目標中呼叫 `withJava()` 函式時，您的多平台專案可能會看到棄用警告。我們計畫盡快修復此問題。

有關詳細資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning) 中的問題。

您也可以使用最新版本的 Gradle，但如果您這樣做，請記住您可能會遇到棄用警告或某些新的 Gradle 功能可能無法運作。

此版本帶來了諸多變更，例如開始棄用基於 JVM 歷史檔案的舊式增量編譯 (incremental compilation) 方法，以及一種在專案之間共享 JVM 構件 (artifact) 的新方式。

### 棄用基於 JVM 歷史檔案的增量編譯

在 Kotlin 2.0.20 中，基於 JVM 歷史檔案的增量編譯方法已被棄用，取而代之的是自 Kotlin 1.8.20 以來預設啟用的新增量編譯方法。

基於 JVM 歷史檔案的增量編譯方法存在局限性，例如不適用於 [Gradle 的建置快取](https://docs.gradle.org/current/userguide/build_cache.html) 且不支援編譯避免 (compilation avoidance)。相較之下，新的增量編譯方法克服了這些局限性，並自引入以來表現良好。

鑒於新的增量編譯方法在過去兩個主要的 Kotlin 版本中已預設使用，`kotlin.incremental.useClasspathSnapshot` Gradle 屬性在 Kotlin 2.0.20 中已被棄用。因此，如果您使用它來選擇禁用 (opt out)，將會看到棄用警告。

### 選項：在專案之間以類別檔案形式共享 JVM 構件

> 此功能為 [實驗性](components-stability.md#stability-levels-explained) 功能。它可能隨時被移除或變更。請僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 上提供回饋。需要選擇啟用 (opt-in)（詳情請見下文）。
>
{style="warning"}

在 Kotlin 2.0.20 中，我們引入了一種新方法，改變了 Kotlin/JVM 編譯輸出（例如 JAR 檔案）在專案之間共享的方式。採用這種方法，Gradle 的 `apiElements` 設定現在有一個輔助變體，可提供對包含已編譯 `.class` 檔案的目錄的存取權限。設定後，您的專案會使用此目錄，而不是在編譯期間請求壓縮的 JAR 構件。這減少了 JAR 檔案壓縮和解壓縮的次數，特別是在增量建置中。

我們的測試顯示，這種新方法可以為 Linux 和 macOS 主機提供建置效能改進。然而，在 Windows 主機上，由於 Windows 處理檔案 I/O 操作的方式，我們發現效能有所下降。

要嘗試這種新方法，請將以下屬性添加到您的 `gradle.properties` 檔案中：

```none
kotlin.jvm.addClassesVariant=true
```

預設情況下，此屬性設定為 `false`，Gradle 中的 `apiElements` 變體會請求壓縮的 JAR 構件。

> Gradle 有一個相關屬性，您可以在純 Java 專案中使用它，以便在編譯期間僅公開壓縮的 JAR 構件，**而不是**包含已編譯 `.class` 檔案的目錄：
>
> ```none
> org.gradle.java.compile-classpath-packaging=true
> ```
>
> 有關此屬性及其用途的更多資訊，請參閱 Gradle 關於 [大型多專案在 Windows 上建置效能顯著下降](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance) 的文件。
>
{style="note"}

我們將感謝您對這種新方法的反饋。您在使用它時注意到任何效能改進嗎？請透過在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 中新增評論來告知我們。

### Kotlin Gradle 外掛程式與 java-test-fixtures 外掛程式的依賴行為對齊

在 Kotlin 2.0.20 之前，如果您在專案中使用 [`java-test-fixtures` 外掛程式](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)，Gradle 和 Kotlin Gradle 外掛程式在依賴項傳播方式上存在差異。

Kotlin Gradle 外掛程式傳播依賴項：

*   從 `java-test-fixtures` 外掛程式的 `implementation` 和 `api` 依賴類型到 `test` 原始碼集 (source set) 編譯類別路徑。
*   從主要原始碼集的 `implementation` 和 `api` 依賴類型到 `java-test-fixtures` 外掛程式的原始碼集編譯類別路徑。

然而，Gradle 僅傳播 `api` 依賴類型中的依賴項。

這種行為差異導致某些專案在類別路徑中多次找到資源檔案。

自 Kotlin 2.0.20 起，Kotlin Gradle 外掛程式的行為已與 Gradle 的 `java-test-fixtures` 外掛程式對齊，因此此問題不再發生於此或其他 Gradle 外掛程式。

由於此變更，`test` 和 `testFixtures` 原始碼集中的某些依賴項可能不再可存取。如果發生這種情況，請將依賴宣告類型從 `implementation` 變更為 `api`，或在受影響的原始碼集上新增依賴宣告。

### 在編譯任務缺少對構件的依賴的罕見情況下新增任務依賴

在 2.0.20 之前，我們發現有些情況下編譯任務缺少其構件輸入之一的任務依賴。這意味著依賴編譯任務的結果是不穩定的，因為有時構件會及時生成，但有時卻不會。

為了修復此問題，Kotlin Gradle 外掛程式現在會自動在這些情況下新增所需的任務依賴。

在極少數情況下，我們發現這種新行為可能導致循環依賴錯誤。例如，如果您有多個編譯，其中一個編譯可以看到另一個編譯的所有內部宣告，並且生成的構件依賴於兩個編譯任務的輸出，您可能會看到類似以下的錯誤：

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

為了修復此循環依賴錯誤，我們新增了一個 Gradle 屬性：`archivesTaskOutputAsFriendModule`。

預設情況下，此屬性設定為 `true` 以追蹤任務依賴。要禁用在編譯任務中使用構件，從而不需要任務依賴，請在您的 `gradle.properties` 檔案中新增以下內容：

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

有關詳細資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69330) 中的問題。

## Compose 編譯器

在 Kotlin 2.0.20 中，Compose 編譯器獲得了一些改進。

### 修正 2.0.0 中引入的不必要重新組合問題

Compose 編譯器 2.0.0 有一個問題，它有時會在具有非 JVM 目標的多平台專案中錯誤地推斷類型的穩定性。這可能導致不必要（甚至無限）的重新組合 (recomposition)。我們強烈建議將您為 Kotlin 2.0.0 建立的 Compose 應用程式更新到 2.0.10 或更新版本。

如果您的應用程式是使用 Compose 編譯器 2.0.10 或更新版本建置的，但使用了以 2.0.0 版本建置的依賴項，這些舊的依賴項可能仍會導致重新組合問題。為防止此問題，請將您的依賴項更新到與您的應用程式使用相同 Compose 編譯器建置的版本。

### 配置編譯器選項的新方式

我們引入了一種新的選項配置機制，以避免頂層參數的頻繁變更。對於 Compose 編譯器團隊來說，透過為 `composeCompiler {}` 區塊建立或移除頂層條目來測試事物更為困難。因此，諸如強跳過模式 (strong skipping mode) 和非跳過組優化 (non-skipping group optimizations) 等選項現在透過 `featureFlags` 屬性啟用。此屬性將用於測試新的 Compose 編譯器選項，這些選項最終將成為預設值。

此變更也已應用於 Compose 編譯器 Gradle 外掛程式。要繼續配置功能標誌，請使用以下語法（此程式碼將反轉所有預設值）：

```kotlin
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.IntrinsicRemember.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups,
        ComposeFeatureFlag.StrongSkipping.disabled()
    )
}
```

或者，如果您直接配置 Compose 編譯器，請使用以下語法：

```text
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=IntrinsicRemember
```

因此，`enableIntrinsicRemember`、`enableNonSkippingGroupOptimization` 和 `enableStrongSkippingMode` 屬性已被棄用。

我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags) 上對這種新方法的任何回饋。

### 強跳過模式預設啟用

Compose 編譯器的強跳過模式 (strong skipping mode) 現已預設啟用。

強跳過模式是 Compose 編譯器的一個配置選項，它改變了哪些可組合函數可以被跳過的規則。啟用強跳過模式後，帶有不穩定參數的可組合函數現在也可以被跳過。強跳過模式還會自動記住可組合函數中使用的 lambda，因此您不再需要用 `remember` 包裹您的 lambda 以避免重新組合。

有關詳細資訊，請參閱 [強跳過模式文件](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)。

### 組合追蹤標記預設啟用

在 Compose 編譯器 Gradle 外掛程式中，`includeTraceMarkers` 選項現在預設設定為 `true`，以匹配編譯器外掛程式中的預設值。這允許您在 Android Studio 系統追蹤分析器中查看可組合函數。有關組合追蹤的詳細資訊，請參閱這篇 [Android 開發者部落格文章](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535)。

### 非跳過組優化

此版本包含一個新的編譯器選項：啟用後，不可跳過 (non-skippable) 和不可重新啟動 (non-restartable) 的可組合函數將不再在可組合函數的主體周圍生成組。這會導致更少的分配，從而提高效能。此選項為實驗性功能，預設禁用，但可以透過功能標誌 `OptimizeNonSkippingGroups` 啟用，如[上文](#new-way-to-configure-compiler-options)所示。

此功能標誌現已準備好進行更廣泛的測試。啟用此功能時發現的任何問題都可以在 [Google 問題追蹤器](https://goo.gle/compose-feedback) 上提交。

### 抽象可組合函數中預設參數的支援

您現在可以為抽象可組合函數新增預設參數。

以前，Compose 編譯器在嘗試這樣做時會報告錯誤，儘管這是有效的 Kotlin 程式碼。我們現在已在 Compose 編譯器中新增了對此的支援，並且該限制已被移除。這對於包含預設 `Modifier` 值特別有用：

```kotlin
abstract class Composables {
    @Composable
    abstract fun Composable(modifier: Modifier = Modifier)
}
```

開放可組合函數的預設參數在 2.0.20 中仍然受到限制。此限制將在未來版本中解決。

## 標準函式庫

標準函式庫現在支援通用唯一識別碼 (universally unique identifiers) 作為實驗性 (Experimental) 功能，並包含對 Base64 解碼的一些變更。

### 通用 Kotlin 標準函式庫中對 UUID 的支援

> 此功能為 [實驗性](components-stability.md#stability-levels-explained) 功能。要啟用，請使用 `@ExperimentalUuidApi` 註解或編譯器選項 `-opt-in=kotlin.uuid.ExperimentalUuidApi`。
>
{style="warning"}

Kotlin 2.0.20 在通用 Kotlin 標準函式庫中引入了一個類別，用於表示 [UUID（通用唯一識別碼）](https://en.wikipedia.org/wiki/Universally_unique_identifier)，以解決唯一識別項目的挑戰。

此外，此功能提供以下 UUID 相關操作的 API：

*   生成 UUID。
*   從字串表示法解析 UUID 並將其格式化為字串表示法。
*   從指定的 128 位元值建立 UUID。
*   存取 UUID 的 128 位元。

以下程式碼範例展示了這些操作：

```kotlin
// 建立 UUID 的位元組陣列
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
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-minlength-hexformat" validate="false"}

為保持與使用 `java.util.UUID` 的 API 的相容性，Kotlin/JVM 中有兩個擴充函式，用於在 `java.util.UUID` 和 `kotlin.uuid.Uuid` 之間進行轉換：`.toJavaUuid()` 和 `.toKotlinUuid()`。例如：

```kotlin
val kotlinUuid = Uuid.parseHex("550e8400e29b41d4a716446655440000")
// 將 Kotlin UUID 轉換為 java.util.UUID
val javaUuid = kotlinUuid.toJavaUuid()

val javaUuid = java.util.UUID.fromString("550e8400-e29b-41d4-a716-446655440000")
// 將 Java UUID 轉換為 kotlin.uuid.Uuid
val kotlinUuid = javaUuid.toKotlinUuid()
```

此功能和所提供的 API 透過允許多平台之間的程式碼共享，簡化了多平台軟體開發。UUID 在難以生成唯一識別碼的環境中也十分理想。

涉及 UUID 的一些範例用例包括：

*   為資料庫記錄分配唯一 ID。
*   生成網路會話識別碼。
*   任何需要唯一識別或追蹤的場景。

### HexFormat 中對 minLength 的支援

> [`HexFormat` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 及其屬性為 [實驗性](components-stability.md#stability-levels-explained) 功能。要啟用，請使用 `@OptIn(ExperimentalStdlibApi::class)` 註解或編譯器選項 `-opt-in=kotlin.ExperimentalStdlibApi`。
>
{style="warning"}

Kotlin 2.0.20 為 [`NumberHexFormat` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/-number-hex-format/) 新增了一個新的 `minLength` 屬性，可透過 [`HexFormat.number`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/number.html) 存取。此屬性允許您指定數值十六進位表示中的最小位數，支援用零填充以滿足所需長度。此外，可以使用 `removeLeadingZeros` 屬性去除前導零：

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

`minLength` 屬性不影響解析。然而，如果額外的開頭數字為零，現在解析允許十六進位字串的位數多於類型寬度。

### Base64 解碼器行為的變更

> [`Base64` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.encoding/-base64/) 及其相關功能為 [實驗性](components-stability.md#stability-levels-explained) 功能。要啟用，請使用 `@OptIn(ExperimentalEncodingApi::class)` 註解或編譯器選項 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`。
>
{style="warning"}

Kotlin 2.0.20 對 Base64 解碼器的行為引入了兩項變更：

*   [Base64 解碼器現在需要填充](#the-base64-decoder-now-requires-padding)
*   [已新增 `withPadding` 函式用於填充配置](#withpadding-function-for-padding-configuration)

#### Base64 解碼器現在需要填充

Base64 編碼器現在預設會新增填充，解碼器在解碼時需要填充並禁止非零填充位。

#### 用於填充配置的 withPadding 函式

已引入一個新的 `.withPadding()` 函式，用於讓使用者控制 Base64 編碼和解碼的填充行為：

```kotlin
val base64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)
```

此函式支援使用不同的填充選項建立 `Base64` 實例：

| `PaddingOption`    | 編碼時 (On encode)    | 解碼時 (On decode)           |
|--------------------|--------------|---------------------|
| `PRESENT`          | 添加填充 (Add padding)  | 需要填充 (Padding is required) |
| `ABSENT`           | 忽略填充 (Omit padding) | 不允許填充 (No padding allowed)  |
| `PRESENT_OPTIONAL` | 添加填充 (Add padding)  | 填充是可選的 (Padding is optional) |
| `ABSENT_OPTIONAL`  | 忽略填充 (Omit padding) | 填充是可選的 (Padding is optional) |

您可以建立具有不同填充選項的 `Base64` 實例，並使用它們來編碼和解碼資料：

```kotlin
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
fun main() {
    // 要編碼的範例資料
    val data = "fooba".toByteArray()

    // 建立具有 URL 安全字母表和 PRESENT 填充的 Base64 實例
    val base64Present = Base64.UrlSafe.withPadding(Base64.PaddingOption.PRESENT)
    val encodedDataPresent = base64Present.encode(data)
    println("使用 PRESENT 填充的編碼資料：$encodedDataPresent")
    // 使用 PRESENT 填充的編碼資料：Zm9vYmE=

    // 建立具有 URL 安全字母表和 ABSENT 填充的 Base64 實例
    val base64Absent = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT)
    val encodedDataAbsent = base64Absent.encode(data)
    println("使用 ABSENT 填充的編碼資料：$encodedDataAbsent")
    // 使用 ABSENT 填充的編碼資料：Zm9vYmE

    // 解碼資料
    val decodedDataPresent = base64Present.decode(encodedDataPresent)
    println("使用 PRESENT 填充的解碼資料：${String(decodedDataPresent)}")
    // 使用 PRESENT 填充的解碼資料：fooba

    val decodedDataAbsent = base64Absent.decode(encodedDataAbsent)
    println("使用 ABSENT 填充的解碼資料：${String(decodedDataAbsent)}")
    // 使用 ABSENT 填充的解碼資料：fooba
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-base64-decoder" validate="false"}

## 文件更新

Kotlin 文件已獲得一些顯著變更：

*   改進的 [標準輸入頁面](standard-input.md) - 了解如何使用 Java Scanner 和 `readln()`。
*   改進的 [K2 編譯器遷移指南](k2-compiler-migration-guide.md) - 了解效能改進、與 Kotlin 函式庫的相容性以及如何處理您的自定義編譯器外掛程式。
*   改進的 [例外頁面](exceptions.md) - 了解例外、如何拋出和捕獲它們。
*   改進的 [在 JVM 中使用 JUnit 測試程式碼 - 教學](jvm-test-using-junit.md) - 了解如何使用 JUnit 建立測試。
*   改進的 [與 Swift/Objective-C 互通性頁面](native-objc-interop.md) - 了解如何在 Swift/Objective-C 程式碼中使用 Kotlin 宣告以及如何在 Kotlin 程式碼中使用 Objective-C 宣告。
*   改進的 [Swift 套件匯出設定頁面](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-spm-export.html) - 了解如何設定可由 Swift 套件管理器依賴項消費的 Kotlin/Native 輸出。

## 安裝 Kotlin 2.0.20

從 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛程式作為隨 IDE 捆綁的外掛程式分發。這意味著您無法再從 JetBrains Marketplace 安裝該外掛程式。

要更新到新的 Kotlin 版本，請在您的建置腳本中將 [Kotlin 版本](releases.md#update-to-a-new-kotlin-version) 變更為 2.0.20。