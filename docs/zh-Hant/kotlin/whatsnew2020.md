[//]: # (title: Kotlin 2.0.20 有什麼新功能)

_[發佈日期：2024 年 8 月 22 日](releases.md#release-details)_

Kotlin 2.0.20 版本現已發佈！此版本包括 Kotlin 2.0.0 的效能改進和錯誤修正，我們在該版本中宣布 Kotlin K2 編譯器為穩定版。以下是此版本的一些額外亮點：

*   [data class 的 copy 函數與建構函式具有相同可見性](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
*   [多平台專案中預設目標階層的原始碼集現在提供靜態存取器](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
*   [垃圾收集器中已實現 Kotlin/Native 的並行標記](#concurrent-marking-in-garbage-collector)
*   [Kotlin/Wasm 中的 `@ExperimentalWasmDsl` 註解有了新的位置](#new-location-of-experimentalwasmdsl-annotation)
*   [已新增對 Gradle 8.6–8.8 版本的支援](#gradle)
*   [一個新選項允許在 Gradle 專案之間以類別檔案形式共享 JVM 構件](#option-to-share-jvm-artifacts-between-projects-as-class-files)
*   [Compose 編譯器已更新](#compose-compiler)
*   [通用 Kotlin 標準函式庫已新增對 UUIDs 的支援](#support-for-uuids-in-the-common-kotlin-standard-library)

## IDE 支援

支援 2.0.20 的 Kotlin 外掛程式已捆綁在最新的 IntelliJ IDEA 和 Android Studio 中。
您無需在 IDE 中更新 Kotlin 外掛程式。
您只需在建構腳本中將 Kotlin 版本更改為 2.0.20 即可。

詳情請參閱[更新至新版本](releases.md#update-to-a-new-kotlin-version)。

## 語言

Kotlin 2.0.20 開始引入變更，以改進 data class 的一致性，並取代實驗性內容接收器功能。

### data class 的 copy 函數與建構函式具有相同可見性

目前，如果您使用 `private` 建構函式建立 data class，自動生成的 `copy()` 函數不會具有相同的可見性。這可能在您的程式碼中引起問題。在未來的 Kotlin 版本中，我們將引入 `copy()` 函數的預設可見性與建構函式相同的行為。此變更將逐步引入，以幫助您盡可能順暢地遷移程式碼。

我們的遷移計畫從 Kotlin 2.0.20 開始，它會在您的程式碼中發出警告，表示可見性將在未來發生變化。例如：

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

為使您能更好地控制此行為，在 Kotlin 2.0.20 中，我們引入了兩個註解：

*   `@ConsistentCopyVisibility` 以便在我們將其作為未來版本的預設行為之前，現在就選擇啟用該行為。
*   `@ExposedCopyVisibility` 以便選擇停用該行為並在宣告點抑制警告。
    請注意，即使使用此註解，編譯器在呼叫 `copy()` 函數時仍會報告警告。

如果您想在 2.0.20 中為整個模組（而不僅是個別類別）選擇啟用新行為，
您可以使用 `-Xconsistent-data-class-copy-visibility` 編譯器選項。
此選項與向模組中的所有 data class 添加 `@ConsistentCopyVisibility` 註解具有相同的效果。

### 內容接收器分階段替換為內容參數

在 Kotlin 1.6.20 中，我們引入了[內容接收器](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm)作為一項[實驗性](components-stability.md#stability-levels-explained)功能。在聽取社群回饋後，我們決定不繼續採用此方法，並將採取不同的方向。

在未來的 Kotlin 版本中，內容接收器將被內容參數取代。內容參數仍處於設計階段，您可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md) 中找到該提案。

由於內容參數的實作需要對編譯器進行重大修改，我們決定不同時支援內容接收器和內容參數。此決定極大地簡化了實作並最大程度地降低了不穩定行為的風險。

我們了解到內容接收器已經被大量開發者使用。因此，我們將開始逐步移除對內容接收器的支援。我們的遷移計畫從 Kotlin 2.0.20 開始，當使用 `-Xcontext-receivers` 編譯器選項時，您的程式碼中會在使用內容接收器時發出警告。例如：

```kotlin
class MyContext

context(MyContext)
// Warning: Experimental context receivers are deprecated and will be superseded by context parameters. 
// Please don't use context receivers. You can either pass parameters explicitly or use members with extensions.
fun someFunction() {
}
```

此警告將在未來的 Kotlin 版本中變成錯誤。

如果您在程式碼中使用了內容接收器，我們建議您將程式碼遷移為使用以下任一方式：

*   明確參數。

   <table>
      <tr>
          <td>之前</td>
          <td>之後</td>
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

*   擴充成員函式（如果可能）。

   <table>
      <tr>
          <td>之前</td>
          <td>之後</td>
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

或者，您可以等到編譯器支援內容參數的 Kotlin 版本。請注意，內容參數最初將作為實驗性功能引入。

## Kotlin 多平台

Kotlin 2.0.20 為多平台專案中的原始碼集管理帶來了改進，並由於 Gradle 的近期變更而棄用了與某些 Gradle Java 外掛程式的相容性。

### 預設目標階層的原始碼集提供靜態存取器

自 Kotlin 1.9.20 起，[預設階層範本](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)會自動套用於所有 Kotlin 多平台專案。
對於預設階層範本中的所有原始碼集，Kotlin Gradle 外掛程式提供了型別安全存取器。
這樣，您最終無需使用 `by getting` 或 `by creating` 結構即可存取所有指定目標的原始碼集。

Kotlin 2.0.20 旨在進一步改善您的 IDE 體驗。它現在在 `sourceSets {}` 區塊中為預設階層範本中的所有原始碼集提供了靜態存取器。
我們相信此變更將使按名稱存取原始碼集變得更輕鬆且更可預測。

現在，每個此類原始碼集都帶有詳細的 KDoc 註解，其中包含範例和診斷訊息，如果您在未先宣告相應目標的情況下嘗試存取原始碼集，則會發出警告：

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

了解更多關於 [Kotlin 多平台中的階層式專案結構](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html)。

### 棄用與 Kotlin Multiplatform Gradle 外掛程式和 Gradle Java 外掛程式的相容性

在 Kotlin 2.0.20 中，當您在同一專案中套用 Kotlin Multiplatform Gradle 外掛程式和以下任何 Gradle Java 外掛程式時，我們引入了棄用警告：[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、
[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 和 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)。
當您的多平台專案中的另一個 Gradle 外掛程式套用 Gradle Java 外掛程式時，也會出現警告。
例如，[Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html) 會自動套用 Application 外掛程式。

由於 Kotlin Multiplatform 的專案模型與 Gradle 的 Java 生態系統外掛程式之間存在根本性的相容性問題，我們新增了此棄用警告。Gradle 的 Java 生態系統外掛程式目前未考慮到其他外掛程式可能：

*   也以與 Java 生態系統外掛程式不同的方式發布或編譯 JVM 目標。
*   在同一專案中擁有兩個不同的 JVM 目標，例如 JVM 和 Android。
*   擁有複雜的多平台專案結構，可能包含多個非 JVM 目標。

不幸的是，Gradle 目前不提供任何 API 來解決這些問題。

我們之前在 Kotlin Multiplatform 中使用了一些變通方法來幫助整合 Java 生態系統外掛程式。
然而，這些變通方法從未真正解決相容性問題，並且自 Gradle 8.8 版本發布以來，這些變通方法已不再可行。更多資訊請參閱我們的 [YouTrack 問題](https://youtrack.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)。

雖然我們尚不確切知道如何解決此相容性問題，但我們承諾繼續支援您的 Kotlin 多平台專案中的某些形式的 Java 原始碼編譯。至少，我們將支援 Java 原始碼的編譯以及在您的多平台專案中使用 Gradle 的 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 外掛程式。

同時，如果您在多平台專案中看到此棄用警告，我們建議您：
1.  確定您的專案是否確實需要 Gradle Java 外掛程式。如果不需要，請考慮將其移除。
2.  檢查 Gradle Java 外掛程式是否僅用於單一任務。如果是這樣，您可能可以在不費力氣的情況下移除該外掛程式。例如，如果任務使用 Gradle Java 外掛程式建立 Javadoc JAR 檔案，您可以手動定義 Javadoc 任務。

否則，如果您想在多平台專案中同時使用 Kotlin Multiplatform Gradle 外掛程式和這些 Java 的 Gradle 外掛程式，我們建議您：

1.  在您的多平台專案中建立一個獨立的子專案。
2.  在獨立的子專案中，套用 Java 的 Gradle 外掛程式。
3.  在獨立的子專案中，新增對父多平台專案的依賴。

> 獨立子專案**不得**是多平台專案，您只能使用它來設定對多平台專案的依賴。
>
{style="warning"}

例如，您有一個名為 `my-main-project` 的多平台專案，並且您想
使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle 外掛程式來執行 JVM 應用程式。

建立子專案後，我們將其命名為 `subproject-A`，您的父專案結構應如下所示：

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
    implementation(project(":my-main-project")) // 您的父多平台專案的名稱
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // 您的父多平台專案的名稱
}
```

</tab>
</tabs>

您的父專案現在已設定為同時適用於這兩個外掛程式。

## Kotlin/Native

Kotlin/Native 在垃圾收集器以及從 Swift/Objective-C 呼叫 Kotlin 暫停函式方面獲得了改進。

### 垃圾收集器中的並行標記

在 Kotlin 2.0.20 中，JetBrains 團隊在改進 Kotlin/Native 執行期效能方面又邁出了一步。
我們已新增對垃圾收集器（GC）中並行標記的實驗性支援。

預設情況下，當 GC 在堆積中標記物件時，應用程式執行緒必須暫停。這極大地影響了 GC 暫停時間的持續時間，這對於對延遲敏感的應用程式（例如使用 Compose Multiplatform 建構的 UI 應用程式）的效能至關重要。

現在，垃圾收集的標記階段可以與應用程式執行緒同時運行。
這應該會顯著縮短 GC 暫停時間並有助於提高應用程式回應性。

#### 如何啟用

此功能目前為[實驗性](components-stability.md#stability-levels-explained)。
要啟用它，請在您的 `gradle.properties` 檔案中設定以下選項：

```none
kotlin.native.binary.gc=cms
```

請將任何問題報告到我們的問題追蹤器 [YouTrack](https://kotl.in/issue)。

### 移除位元碼嵌入支援

從 Kotlin 2.0.20 開始，Kotlin/Native 編譯器不再支援位元碼嵌入。
位元碼嵌入在 Xcode 14 中被棄用，並在 Xcode 15 中針對所有 Apple 目標被移除。

現在，框架配置的 `embedBitcode` 參數，
以及 `-Xembed-bitcode` 和 `-Xembed-bitcode-marker` 命令列引數均已棄用。

如果您仍使用較早版本的 Xcode 但想升級到 Kotlin 2.0.20，
請在您的 Xcode 專案中停用位元碼嵌入。

### 使用 signposts 變更 GC 效能監控

Kotlin 2.0.0 使通過 Xcode Instruments 監控 Kotlin/Native 垃圾收集器（GC）的效能成為可能。Instruments 包含 signposts 工具，可以將 GC 暫停顯示為事件。
這在檢查 iOS 應用程式中與 GC 相關的凍結時非常有用。

此功能預設為啟用，但不幸的是，
當應用程式與 Xcode Instruments 同時運行時，有時會導致崩潰。
從 Kotlin 2.0.20 開始，它需要明確選擇啟用以下編譯器選項：

```none
-Xbinary=enableSafepointSignposts=true
```

在[文件中](native-memory-manager.md#monitor-gc-performance)了解更多關於 GC 效能分析的資訊。

### 能夠從 Swift/Objective-C 在非主執行緒上呼叫 Kotlin 暫停函式

以前，Kotlin/Native 有一個預設限制，將從 Swift 和 Objective-C 呼叫 Kotlin 暫停函式的功能限制在主執行緒。Kotlin 2.0.20 解除了該限制，允許您從 Swift/Objective-C 在任何執行緒上執行 Kotlin `suspend` 函式。

如果您之前已使用 `kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none`
二進位選項切換了非主執行緒的預設行為，您現在可以將其從 `gradle.properties` 檔案中移除。

## Kotlin/Wasm

在 Kotlin 2.0.20 中，Kotlin/Wasm 持續轉向命名匯出並重新定位 `@ExperimentalWasmDsl` 註解。

### 預設匯出使用中的錯誤

作為轉向命名匯出的一部分，當在 JavaScript 中使用 Kotlin/Wasm 匯出的預設匯入時，之前會向主控台列印警告訊息。

為了完全支援命名匯出，此警告現在已升級為錯誤。如果您使用預設匯入，您會遇到以下錯誤訊息：

```text
Do not use default import. Use the corresponding named import instead.
```

此變更是棄用週期的一部分，旨在轉向命名匯出。以下是每個階段您可以預期的內容：

*   **在 2.0.0 版中**：主控台會列印警告訊息，解釋透過預設匯出匯出實體已被棄用。
*   **在 2.0.20 版中**：發生錯誤，要求使用相應的命名匯入。
*   **在 2.1.0 版中**：完全移除預設匯入的使用。

### ExperimentalWasmDsl 註解的新位置

以前，WebAssembly (Wasm) 功能的 `@ExperimentalWasmDsl` 註解位於 Kotlin Gradle 外掛程式中的此位置：

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

在 2.0.20 中，`@ExperimentalWasmDsl` 註解已重新定位到：

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

舊位置現在已被棄用，並可能導致建構失敗，出現未解析的引用。

為了反映 `@ExperimentalWasmDsl` 註解的新位置，請更新您的 Gradle 建構腳本中的 import 語句。
使用新 `@ExperimentalWasmDsl` 位置的明確 import：

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

或者，從舊套件中移除此星號 import 語句：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JS 引入了一些實驗性功能，以支援 JavaScript 中的靜態成員以及從 JavaScript 建立 Kotlin 集合。

### 支援在 JavaScript 中使用 Kotlin 靜態成員

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。
> 僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 中的回饋。
>
{style="warning"}

從 Kotlin 2.0.20 開始，您可以使用 `@JsStatic` 註解。它的工作方式類似於 [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/)
並指示編譯器為目標宣告生成額外的靜態方法。這有助於您直接在 JavaScript 中使用 Kotlin 程式碼中的靜態成員。

您可以將 `@JsStatic` 註解用於命名物件中定義的函式，以及在類別和介面內部宣告的伴隨物件中定義的函式。編譯器會生成物件的靜態方法和物件本身的實例方法。例如：

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
C.callStatic();              // Works, accessing the static function
C.callNonStatic();           // Error, not a static function in the generated JavaScript
C.Companion.callStatic();    // Instance method remains
C.Companion.callNonStatic(); // The only way it works
```

也可以將 `@JsStatic` 註解應用於物件或伴隨物件的屬性，使其 getter
和 setter 方法成為該物件或包含伴隨物件的類別中的靜態成員。

### 能夠從 JavaScript 建立 Kotlin 集合

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。它可能隨時被移除或更改。
> 僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript) 中的回饋。
>
{style="warning"}

Kotlin 2.0.0 引入了將 Kotlin 集合匯出到 JavaScript（和 TypeScript）的功能。現在，JetBrains 團隊
正在採取另一步驟來改進集合互通性。從 Kotlin 2.0.20 開始，可以直接從 JavaScript/TypeScript 端建立 Kotlin 集合。

您可以從 JavaScript 建立 Kotlin 集合並將其作為參數傳遞給匯出的建構函式或函式。
只要您在匯出的宣告中提及集合，Kotlin 就會為該集合生成一個在 JavaScript/TypeScript 中可用的工廠。

請看以下匯出函式：

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

由於提到了 `MutableMap` 集合，Kotlin 會生成一個物件，其中包含一個可從 JavaScript/TypeScript 存取的工廠方法。
此工廠方法接著從 JavaScript `Map` 建立一個 `MutableMap`：

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

此功能適用於 `Set`、`Map` 和 `List` Kotlin 集合型別及其可變對應項。

## Gradle

Kotlin 2.0.20 與 Gradle 6.8.3 到 8.6 完全相容。Gradle 8.7 和 8.8 也受支援，但只有一個
例外：如果您使用 Kotlin Multiplatform Gradle 外掛程式，您可能會在呼叫 JVM 目標中的 `withJava()` 函數的多平台專案中看到棄用警告。我們計畫盡快解決此問題。

更多資訊請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning) 中的問題。

您也可以使用最新 Gradle 版本之前的 Gradle 版本，但如果您這樣做，請記住您可能會遇到
棄用警告或某些新的 Gradle 功能可能無法正常運作。

此版本帶來了諸多變更，例如開始棄用基於 JVM 歷史檔案的舊式增量編譯方法，以及在專案之間共享 JVM 構件的新方式。

### 棄用基於 JVM 歷史檔案的增量編譯

在 Kotlin 2.0.20 中，基於 JVM 歷史檔案的增量編譯方法已被棄用，轉而使用自 Kotlin 1.8.20 以來預設啟用的新增量編譯方法。

基於 JVM 歷史檔案的增量編譯方法存在局限性，
例如不適用於 [Gradle 的建構快取](https://docs.gradle.org/current/userguide/build_cache.html)
且不支援編譯迴避。
相比之下，新的增量編譯方法克服了這些局限性，並且自引入以來表現良好。

鑑於新的增量編譯方法已預設用於過去兩個主要的 Kotlin 版本，
`kotlin.incremental.useClasspathSnapshot` Gradle 屬性在 Kotlin 2.0.20 中被棄用。
因此，如果您使用它來選擇停用，您將看到棄用警告。

### 選項：以類別檔案形式在專案之間共享 JVM 構件

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。
> 它可能隨時被移除或更改。僅用於評估目的。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 中的回饋。
> 需要選擇啟用（詳情如下）。
>
{style="warning"}

在 Kotlin 2.0.20 中，我們引入了一種新方法，改變了 Kotlin/JVM 編譯的輸出（例如 JAR 檔案）在專案之間共享的方式。透過這種方法，Gradle 的 `apiElements` 配置現在具有一個次要變體，提供對包含已編譯 `.class` 檔案的目錄的存取。當配置時，您的專案會使用此目錄，而不是在編譯期間請求壓縮的 JAR 構件。這減少了 JAR 檔案被壓縮和解壓縮的次數，特別是對於增量建構。

我們的測試顯示，這種新方法可以為 Linux 和 macOS 主機提供建構效能改進。
然而，在 Windows 主機上，由於 Windows 處理檔案 I/O 操作的方式，我們發現效能有所下降。

要嘗試這種新方法，請將以下屬性添加到您的 `gradle.properties` 檔案中：

```none
kotlin.jvm.addClassesVariant=true
```

預設情況下，此屬性設定為 `false`，並且 Gradle 中的 `apiElements` 變體請求壓縮的 JAR 構件。

> Gradle 有一個相關屬性，您可以在您的僅 Java 專案中使用它，以便在編譯期間**僅**公開壓縮的 JAR 構件，**而不**是包含已編譯 `.class` 檔案的目錄：
>
> ```none
> org.gradle.java.compile-classpath-packaging=true
> ```
>
> 有關此屬性及其用途的更多資訊，
> 請參閱 Gradle 文件中關於[大型多專案在 Windows 上建構效能顯著下降](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance)的內容。
>
{style="note"}

我們非常感謝您對這種新方法的回饋。您在使用它時是否注意到任何效能改進？
請透過在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 中新增評論來告訴我們。

### 調整 Kotlin Gradle 外掛程式與 java-test-fixtures 外掛程式的依賴行為

在 Kotlin 2.0.20 之前，如果您在專案中使用了 [`java-test-fixtures` 外掛程式](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)，則 Gradle 和 Kotlin Gradle 外掛程式在依賴傳播方式上存在差異。

Kotlin Gradle 外掛程式會傳播依賴：

*   從 `java-test-fixtures` 外掛程式的 `implementation` 和 `api` 依賴型別到 `test` 原始碼集編譯類別路徑。
*   從主原始碼集的 `implementation` 和 `api` 依賴型別到 `java-test-fixtures` 外掛程式的原始碼集編譯類別路徑。

然而，Gradle 只會傳播 `api` 依賴型別中的依賴。

這種行為差異導致一些專案在類別路徑中多次找到資源檔案。

自 Kotlin 2.0.20 起，Kotlin Gradle 外掛程式的行為與 Gradle 的 `java-test-fixtures` 外掛程式對齊，因此此問題不再發生於此或其他 Gradle 外掛程式。

由於此變更，`test` 和 `testFixtures` 原始碼集中的某些依賴可能不再可存取。
如果發生這種情況，請將依賴宣告型別從 `implementation` 變更為 `api`，或在受影響的原始碼集上新增新的依賴宣告。

### 為編譯任務缺少構件依賴的極少數情況新增任務依賴

在 2.0.20 之前，我們發現有些情況下，編譯任務缺少其一個構件輸入的任務依賴。這意味著依賴編譯任務的結果是不穩定的，因為有時構件會及時生成，但有時則不會。

為了修正此問題，Kotlin Gradle 外掛程式現在會在此類情況下自動新增所需的任務依賴。

在極少數情況下，我們發現這種新行為可能導致循環依賴錯誤。
例如，如果您有多個編譯，其中一個編譯可以看到另一個編譯的所有內部宣告，並且生成的構件依賴於兩個編譯任務的輸出，您可能會看到類似以下的錯誤：

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

為了修正此循環依賴錯誤，我們新增了一個 Gradle 屬性：`archivesTaskOutputAsFriendModule`。

預設情況下，此屬性設定為 `true` 以追蹤任務依賴。要停用在編譯任務中使用構件，以便不需要任務依賴，請在您的 `gradle.properties` 檔案中新增以下內容：

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

更多資訊請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69330) 中的問題。

## Compose 編譯器

在 Kotlin 2.0.20 中，Compose 編譯器獲得了一些改進。

### 修正 2.0.0 中引入的不必要重新組合問題

Compose 編譯器 2.0.0 有一個問題，它有時會錯誤地推斷多平台專案中具有非 JVM 目標的型別的穩定性。這可能導致不必要（甚至無止盡）的重新組合。我們強烈建議將您為 Kotlin 2.0.0 製作的 Compose 應用程式更新到 2.0.10 或更高版本。

如果您的應用程式是使用 Compose 編譯器 2.0.10 或更高版本建構的，但使用了版本 2.0.0 建構的依賴，
這些舊的依賴仍可能導致重新組合問題。
為防止這種情況，請將您的依賴更新到與您的應用程式使用相同 Compose 編譯器版本建構的版本。

### 配置編譯器選項的新方式

我們引入了一種新的選項配置機制，以避免頂層參數的變動。
對於 Compose 編譯器團隊來說，透過建立或移除 `composeCompiler {}` 區塊的頂層條目來測試東西會更困難。
因此，諸如強力跳過模式和非跳過群組優化等選項現在透過 `featureFlags` 屬性啟用。
此屬性將用於測試最終將成為預設值的新 Compose 編譯器選項。

此變更也已套用到 Compose 編譯器 Gradle 外掛程式。要配置未來的 feature flags，
請使用以下語法（此程式碼將反轉所有預設值）：

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

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags) 中對這種新方法的回饋。

### 強力跳過模式預設啟用

Compose 編譯器的強力跳過模式現在預設啟用。

強力跳過模式是一個 Compose 編譯器配置選項，它更改了哪些組合式函式可以被跳過的規則。
啟用強力跳過模式後，參數不穩定的組合式函式現在也可以被跳過。
強力跳過模式還會自動記住組合式函式中使用的 lambda，
因此您應該不再需要使用 `remember` 包裝您的 lambda 以避免重新組合。

更多詳情請參閱[強力跳過模式文件](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)。

### 組合追蹤標記預設啟用

`includeTraceMarkers` 選項現在在 Compose 編譯器 Gradle 外掛程式中預設設定為 `true`，以符合編譯器外掛程式中的預設值。這使您可以在 Android Studio 系統追蹤分析器中看到組合式函式。有關組合追蹤的詳情，請參閱這篇 [Android 開發者部落格文章](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535)。

### 非跳過群組優化

此版本包含一個新的編譯器選項：啟用後，不可跳過且不可重新啟動的組合式函式將不再在組合式函式主體周圍生成一個群組。這會導致更少的分配，從而提高效能。
此選項是實驗性的，預設為禁用，但可以使用功能標記 `OptimizeNonSkippingGroups` 啟用，如[上文](#new-way-to-configure-compiler-options)所示。

此功能標記現在已準備好進行更廣泛的測試。在啟用此功能時發現的任何問題都可以在 [Google 問題追蹤器](https://goo.gle/compose-feedback)中提出。

### 支援抽象組合式函式中的預設參數

您現在可以為抽象組合式函式新增預設參數。

以前，即使這是有效的 Kotlin 程式碼，Compose 編譯器也會在嘗試執行此操作時報告錯誤。
我們現在已在 Compose 編譯器中新增了對此的支援，並且該限制已被移除。
這對於包含預設 `Modifier` 值特別有用：

```kotlin
abstract class Composables {
    @Composable
    abstract fun Composable(modifier: Modifier = Modifier)
}
```

對於開放組合式函式的預設參數在 2.0.20 中仍然受限。此限制將在未來版本中解決。

## 標準函式庫

標準函式庫現在支援作為實驗性功能的全球唯一識別碼，並包括 Base64 解碼的一些變更。

### 通用 Kotlin 標準函式庫中對 UUIDs 的支援

> 此功能為[實驗性](components-stability.md#stability-levels-explained)。
> 若要選擇啟用，請使用 `@ExperimentalUuidApi` 註解或編譯器選項 `-opt-in=kotlin.uuid.ExperimentalUuidApi`。
>
{style="warning"}

Kotlin 2.0.20 在通用 Kotlin 標準函式庫中引入了一個用於表示 [UUIDs (全球唯一識別碼)](https://en.wikipedia.org/wiki/Universally_unique_identifier) 的類別，以解決唯一識別項目的挑戰。

此外，此功能還提供了用於以下 UUID 相關操作的 API：

*   生成 UUIDs。
*   從字串表示法解析 UUIDs 並將其格式化為字串。
*   從指定的 128 位元值建立 UUIDs。
*   存取 UUID 的 128 位元。

以下程式碼範例展示了這些操作：

```kotlin
// Constructs a byte array for UUID creation
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

// Accesses UUID bits
val version = uuid1.toLongs { mostSignificantBits, _ ->
    ((mostSignificantBits shr 12) and 0xF).toInt()
}
println(version)
// 4

// Generates a random UUID
val randomUuid = Uuid.random()

println(uuid1 == randomUuid)
// false
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-minlength-hexformat" validate="false"}

為了維持與使用 `java.util.UUID` 的 API 的相容性，Kotlin/JVM 中有兩個擴充函式用於在 `java.util.UUID` 和 `kotlin.uuid.Uuid` 之間進行轉換：`.toJavaUuid()` 和 `.toKotlinUuid()`。例如：

```kotlin
val kotlinUuid = Uuid.parseHex("550e8400e29b41d4a716446655440000")
// Converts Kotlin UUID to java.util.UUID
val javaUuid = kotlinUuid.toJavaUuid()

val javaUuid = java.util.UUID.fromString("550e8400-e29b-41d4-a716-446655440000")
// Converts Java UUID to kotlin.uuid.Uuid
val kotlinUuid = javaUuid.toKotlinUuid()
```

此功能和提供的 API 透過允許在多個平台之間共享程式碼來簡化多平台軟體開發。UUIDs 在難以生成唯一識別碼的環境中也十分理想。

涉及 UUIDs 的一些範例使用案例包括：

*   為資料庫記錄分配唯一 ID。
*   生成網路會話識別碼。
*   任何需要唯一識別或追蹤的情境。

### HexFormat 中的 minLength 支援

> [`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 類別及其屬性為
> [實驗性](components-stability.md#stability-levels-explained)。
> 若要選擇啟用，請使用 `@OptIn(ExperimentalStdlibApi::class)` 註解或編譯器
> 選項 `-opt-in=kotlin.ExperimentalStdlibApi`。
>
{style="warning"}

Kotlin 2.0.20 為 [`NumberHexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/-number-hex-format/) 類別新增了新的 `minLength` 屬性，
可透過 [`HexFormat.number`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/number.html) 存取。
此屬性讓您可以指定數值十六進位表示法中的最小位數，從而能夠用零填充以滿足所需長度。此外，可以使用 `removeLeadingZeros` 屬性修剪前導零：

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

`minLength` 屬性不影響解析。然而，解析現在允許十六進位字串的位數多於型別的寬度，如果額外的進位位元是零的話。

### Base64 解碼器行為的變更

> [`Base64` 類別](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.encoding/-base64/) 及其
> 相關功能為[實驗性](components-stability.md#stability-levels-explained)。
> 若要選擇啟用，請使用 `@OptIn(ExperimentalEncodingApi::class)`
> 註解或編譯器選項 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`。
>
{style="warning"}

Kotlin 2.0.20 中對 Base64 解碼器的行為引入了兩項變更：

*   [Base64 解碼器現在需要填充](#the-base64-decoder-now-requires-padding)
*   [已新增用於填充配置的 `withPadding` 函數](#withpadding-function-for-padding-configuration)

#### Base64 解碼器現在需要填充

Base64 編碼器現在預設新增填充，解碼器在解碼時需要填充並禁止非零填充位元。

#### 用於填充配置的 withPadding 函數

已引入新的 `.withPadding()` 函數，以便使用者控制 Base64 編碼和解碼的填充行為：

```kotlin
val base64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)
```

此函數允許建立具有不同填充選項的 `Base64` 實例：

| `PaddingOption`    | 編碼時       | 解碼時         |
|--------------------|--------------|---------------------|
| `PRESENT`          | 新增填充     | 需要填充       |
| `ABSENT`           | 忽略填充     | 不允許填充     |
| `PRESENT_OPTIONAL` | 新增填充    | 填充是可選的   |
| `ABSENT_OPTIONAL`  | 忽略填充    | 填充是可選的   |

您可以建立具有不同填充選項的 `Base64` 實例，並使用它們來編碼和解碼資料：

```kotlin
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
fun main() {
    // 範例編碼資料
    val data = "fooba".toByteArray()

    // 建立一個帶有 URL 安全字母表和 PRESENT 填充的 Base64 實例
    val base64Present = Base64.UrlSafe.withPadding(Base64.PaddingOption.PRESENT)
    val encodedDataPresent = base64Present.encode(data)
    println("Encoded data with PRESENT padding: $encodedDataPresent")
    // Encoded data with PRESENT padding: Zm9vYmE=

    // 建立一個帶有 URL 安全字母表和 ABSENT 填充的 Base64 實例
    val base64Absent = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT)
    val encodedDataAbsent = base64Absent.encode(data)
    println("Encoded data with ABSENT padding: $encodedDataAbsent")
    // Encoded data with ABSENT padding: Zm9vYmE

    // 解碼資料
    val decodedDataPresent = base64Present.decode(encodedDataPresent)
    println("Decoded data with PRESENT padding: ${String(decodedDataPresent)}")
    // Decoded data with PRESENT padding: fooba

    val decodedDataAbsent = base64Absent.decode(encodedDataAbsent)
    println("Decoded data with ABSENT padding: ${String(decodedDataAbsent)}")
    // Decoded data with ABSENT padding: fooba
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-base64-decoder" validate="false"}

## 文件更新

Kotlin 文件收到了一些顯著的變更：

*   改進了[標準輸入頁面](standard-input.md) - 學習如何使用 Java Scanner 和 `readln()`。
*   改進了[K2 編譯器遷移指南](k2-compiler-migration-guide.md) - 學習效能改進、與 Kotlin 函式庫的相容性以及如何處理您的自訂編譯器外掛程式。
*   改進了[異常頁面](exceptions.md) - 學習異常、如何拋出和捕捉它們。
*   改進了[在 JVM 中使用 JUnit 測試程式碼 – 教學課程](jvm-test-using-junit.md) - 學習如何使用 JUnit 建立測試。
*   改進了[與 Swift/Objective-C 的互通性頁面](native-objc-interop.md) - 學習如何在 Swift/Objective-C 程式碼中使用 Kotlin 宣告以及在 Kotlin 程式碼中使用 Objective-C 宣告。
*   改進了[Swift 套件匯出設定頁面](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-export.html) - 學習如何設定 Kotlin/Native 輸出，使其可由 Swift 套件管理器依賴使用。

## 安裝 Kotlin 2.0.20

從 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛程式作為捆綁外掛程式隨您的 IDE 一起發布。這意味著您無法再從 JetBrains Marketplace 安裝外掛程式。

要更新到新的 Kotlin 版本，請在您的建構腳本中[將 Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version)為 2.0.20。