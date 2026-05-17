[//]: # (title: Kotlin %kotlinEapVersion% 的新功能)

<primary-label ref="eap"/>

<show-structure depth="1"/>

<web-summary>閱讀 Kotlin 早期體驗預覽 (EAP) 版本說明，並在正式發佈前試用最新的實驗性 Kotlin 功能。</web-summary>

_[發佈日期：%kotlinEapReleaseDate%](eap.md#build-details)_

> 本文件並未涵蓋早期體驗預覽 (EAP) 發佈版的所有功能，但重點介紹了一些重大改進。
>
> 請參閱 [GitHub 變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%) 中的完整變更列表。
>
{style="note"}

Kotlin %kotlinEapVersion% 版本已發佈！以下是此 EAP 版本的一些詳細資訊：

* **語言**：[穩定版的上下文參數、顯式支援欄位，以及註解使用處目標的多項功能](#stable-features)
* **標準函式庫**：[穩定版的 UUID](#stable-uuids-in-the-common-kotlin-standard-library) 以及 [支援檢查排序順序](#support-for-checking-sorted-order)
* **Kotlin/JVM**：[支援 Java 26](#support-for-java-26) 以及 [預設啟用元資料中的註解](#annotations-in-metadata-enabled-by-default)
* **Kotlin/Native**：[支援將 Swift 套件作為相依性、Swift 匯出更新，以及預設 CMS GC](#kotlin-native)
* **Kotlin/Wasm**：[預設啟用增量編譯以及支援 WebAssembly 元件模型](#kotlin-wasm)
* **Kotlin/JS**：[支援數值類別匯出以及 JS 程式碼內嵌中的 ES2015 功能](#kotlin-js)
* **Gradle**：[與 Gradle 9.5.0 的相容性](#gradle)
* **Maven**：[Java 與 JVM 目標版本之間的自動對齊](#maven)
* **Kotlin 編譯器**：[在 `.klib` 編譯期間更一致的內嵌函式行為](#consistent-intra-module-function-inlining-during-klib-compilation)

> 有關 Kotlin 發佈週期的資訊，請參閱 [Kotlin 發佈程序](releases.md)。
>
{style="tip"}

## 更新到 Kotlin %kotlinEapVersion%

最新版本的 Kotlin 已包含在最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/studio) 中。

若要更新到新的 Kotlin 版本，請確保您的 IDE 已更新至最新版本，並在建置指令碼中[將 Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version)為 %kotlinEapVersion%。

## 新功能 {id=new-stable-features}
<primary-label ref="stable"/>

在先前的 Kotlin 版本中，有幾項新功能是以實驗性身份引入的。以下功能現已在 Kotlin %kotlinEapVersion% 中晉升為[穩定](components-stability.md#stability-levels-explained)階段，因此您不再需要選擇加入即可使用它們：

* [上下文參數](whatsnew22.md#preview-of-context-parameters)，除了[上下文引數](#explicit-context-arguments-for-context-parameters)和[可呼叫參照](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references)之外
* [屬性的 `@all` 中介目標](whatsnew22.md#all-meta-target-for-properties)
* [使用處註解目標的新預設規則](whatsnew22.md#new-defaulting-rules-for-use-site-annotation-targets)
* [顯式支援欄位](whatsnew23.md#explicit-backing-fields)
* [通用 Kotlin 標準函式庫中穩定的 UUID](#stable-uuids-in-the-common-kotlin-standard-library)
* [支援檢查排序順序](#support-for-checking-sorted-order)
* [在 JVM 上將無符號整數轉換為 `BigInteger` 的新 API](#new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm)
* [支援將數值類別匯出到 JavaScript/TypeScript](#support-for-value-class-export-to-javascript-typescript)
* [內嵌 JS 程式碼時支援 ES2015 功能](#support-for-es2015-features-when-inlining-js-code)
* [Maven：Java 與 JVM 目標版本之間的自動對齊](#automatic-alignment-between-java-and-jvm-target-versions)

## 新功能 {id=new-experimental-features}
<primary-label ref="experimental-exp"/>

* [上下文參數的顯式上下文引數](#explicit-context-arguments-for-context-parameters)
* [支援集合常值](#support-for-collection-literals)
* [改進的編譯期常數](#improved-compile-time-constants)
* [Swift 套件匯入](#swift-package-import)
* [Swift 匯出：支援匯出協同程式 flow](#swift-export-support-for-exporting-coroutine-flows)
* [支援 WebAssembly 元件模型](#support-for-the-webassembly-component-model)

## 語言

Kotlin %kotlinEapVersion% 將上下文參數、顯式支援欄位以及註解使用處目標功能晉升為[穩定](components-stability.md#stability-levels-explained)階段。此版本還引入了[上下文參數的顯式上下文引數](#explicit-context-arguments-for-context-parameters)。

### 穩定功能
<secondary-label ref="language"/>

Kotlin 2.2.0 以[實驗性](components-stability.md#stability-levels-explained)身份引入了一些語言特性。我們很高興地宣佈，以下語言特性在此版本中已達到[穩定](components-stability.md#stability-levels-explained)階段：

* [上下文參數](whatsnew22.md#preview-of-context-parameters)，除了[上下文引數](#explicit-context-arguments-for-context-parameters)和[可呼叫參照](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references)之外
* [屬性的 `@all` 中介目標](whatsnew22.md#all-meta-target-for-properties)
* [使用處註解目標的新預設規則](whatsnew22.md#new-defaulting-rules-for-use-site-annotation-targets)
* [顯式支援欄位](whatsnew23.md#explicit-backing-fields)

[參見 Kotlin 語言設計功能與提案的完整列表](kotlin-language-features-and-proposals.md)。

### 上下文參數的顯式上下文引數
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% 為[上下文參數](context-parameters.md)引入了顯式上下文引數。

Kotlin 2.3.20 [更改了上下文參數的多載解析](whatsnew2320.md#changes-to-overload-resolution-for-context-parameters)。因此，僅在上下文參數上有所不同的多載呼叫可能會變得具有歧義。

現在，您可以透過在呼叫點傳遞顯式上下文引數來解決此歧義。

範例如下：

```kotlin
class EmailSender
class SmsSender

context(emailSender: EmailSender)
fun sendNotification() {
    println("Sent email notification")
}

context(smsSender: SmsSender)
fun sendNotification() {
    println("Sent SMS notification")
}

context(defaultEmailSender: EmailSender, defaultSmsSender: SmsSender)
fun notifyUser() {
    
    // 選擇具有 EmailSender 上下文參數的多載
    sendNotification(emailSender = defaultEmailSender)

    // 選擇具有 SmsSender 上下文參數的多載
    sendNotification(smsSender = defaultSmsSender)
}
```

您還可以使用顯式上下文引數來代替 `context()` 函式，以減少巢狀並使某些呼叫更易於閱讀。如果您需要在多個呼叫中使用相同的上下文引數，請改用 `context()` 函式。

此功能目前處於[實驗性](components-stability.md#stability-levels-explained)階段。若要選擇啟用，請在您的建置檔案中新增以下編譯器選項：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexplicit-context-arguments")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xexplicit-context-arguments</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

如需更多資訊，請參閱該功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0448-explicit-context-arguments.md)。

### 支援集合常值
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% 引入了對集合常值的實驗性支援。您現在可以使用方括號 `[]` 以更簡單、更簡潔的方式建立集合。

例如：

```kotlin
fun main() {
    // 具有顯式型別宣告的可變列表
    // val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")

    // 使用方括號語法的可變列表
    val shapes: MutableList<String> = ["triangle", "square", "circle"]
    println(shapes)
    // [triangle, square, circle]
}
```
{validate="false"}

> 目前，集合常值不能用於建構在 Java 中定義的集合。如需更多資訊，請參閱 [KT-80494](https://youtrack.jetbrains.com/issue/KT-80494)。
>
{style="note"}

如果編譯器沒有足夠的資訊來推論集合型別，它會預設為 `List` 型別：

```kotlin
fun main() {
    val fruit = ["apple", "banana", "cherry"]
    
    println(fruit)
    // [apple, banana, cherry]
}
```
{validate="false"}

您也可以宣告自訂的 `operator fun of` 函式，以便對您自己的型別使用方括號語法。例如，如果您有以下 `DoubleMatrix` 類別：

```kotlin
class DoubleMatrix(vararg val rows: Row) {
    companion object {
        operator fun of(vararg rows: Row) = DoubleMatrix(*rows)
    }
    class Row(vararg val elements: Double) {
        companion object {
            operator fun of(vararg elements: Double) = Row(*elements)
        }
    }
}
```
{validate="false"}

您可以像這樣建立一個 `identityMatrix` 類別執行個體：

```kotlin
fun main() {
    val identityMatrix: DoubleMatrix = [
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0],
    ]
}
```
{validate="false"}

在此範例中，編譯器將巢狀的集合常值轉換為對相應 `operator fun of` 函式的呼叫。編譯器遞迴地解析這些呼叫，並使用預期型別來選擇正確的多載。

此功能目前處於[實驗性](components-stability.md#stability-levels-explained)階段。若要選擇啟用，請在您的建置檔案中新增以下編譯器選項：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcollection-literals")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xcollection-literals</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

如需更多資訊，請參閱該功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0416-collection-literals.md)。

### 改進的編譯期常數
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% 為[編譯期常數](properties.md#compile-time-constants)帶來了實驗性的改進，使數值和字串型別的支援更加一致且易於使用。這些改進包括支援：

* 無符號型別運算。
* 字串的標準函式庫函式，例如 `.lowercase()`、`.uppercase()` 和 `.trim()` 函式。
* 求值 [列舉常數](enum-classes.md#working-with-enum-constants) 的 `.name` 屬性和 [`KCallable` 介面](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-callable/)。

為了明確哪些函式在編譯時求值，Kotlin %kotlinEapVersion% 引入了 `IntrinsicConstEvaluation` 註解。有些函式在編譯時求值，但尚未加入該註解。後續版本將為剩餘的函式加入該註解。有關支援函式的列表，請參閱 KEEP [附錄](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md#appendix)。

此功能目前處於[實驗性](components-stability.md#stability-levels-explained)階段。若要選擇啟用，請在您的建置檔案中新增以下編譯器選項：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-XIntrinsic-const-evaluation")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-XIntrinsic-const-evaluation</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

如需更多資訊，請參閱該功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md)。

## 標準函式庫

Kotlin %kotlinEapVersion% 穩定了通用 Kotlin 標準函式庫中對 UUID 的支援。它還新增了用於在 JVM 上將無符號整數轉換為 `BigInteger` 的新擴充函式，以及對檢查排序順序的支援。

### 通用 Kotlin 標準函式庫中穩定的 UUID
<secondary-label ref="standard-library"/>

Kotlin 2.0.20 引入了一個[用於產生 UUID 的類別](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library)（通用唯一識別碼），並新增了對 Kotlin 和 Java UUID 之間轉換的支援。後續版本逐步改進了這項實驗性功能，增加了對以下內容的支援：

* [使用 `<` 和 `>` 運算子比較 UUID](whatsnew2120.md#changes-in-uuid-parsing-formatting-and-comparability)
* [從十六進制加連字號和純文字格式解析 UUID](whatsnew2120.md#changes-in-uuid-parsing-formatting-and-comparability)
* [解析無效 UUID 時回傳 `null`](whatsnew23.md#support-for-returning-null-when-parsing-invalid-uuids)。

在 Kotlin %kotlinEapVersion% 中，[`kotlin.uuid.Uuid` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/) 已達到[穩定](components-stability.md#stability-levels-explained)階段。唯一的例外是[用於產生 V4 和 V7 UUID 的函式](whatsnew23.md#support-for-generating-v7-uuids-for-specific-timestamps)，它們仍處於[實驗性](components-stability.md#stability-levels-explained)階段，仍需要選擇加入。

### 支援檢查排序順序
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% 新增了新的擴充函式，用於檢查可反覆運算物件、陣列和序列中的排序順序。

這包括以下擴充函式：

* `.isSorted()`
* `.isSortedDescending()`
* `.isSortedWith(comparator)`
* `.isSortedBy(selector)`
* `.isSortedByDescending(selector)`

您可以使用這些擴充函式來檢查元素是否已經排序，而無需再次進行排序或建立自己的幫助程式。如果元素按指定順序排列，或者元素少於兩個，則它們會回傳 `true`，否則回傳 `false`。這些函式在遇到無序配對時會立即停止，這使得它們處理大型輸入時非常高效。

以下是使用 `.isSorted()` 和 `.isSortedBy()` 函式檢查排序順序的範例：

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.isSorted())
    // true

    val users = listOf(
        User("Alice", 24),
        User("Bob", 31),
        User("Charlie", 29),
    )
    println(users.isSortedBy(User::age))
    // false
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.0-Beta2" id="kotlin-2-4-0-check-sorted-order"}

歡迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-78499) 中向我們提供您的回饋。

### 在 JVM 上將無符號整數轉換為 `BigInteger` 的新 API
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% 在 JVM 上引入了 `UInt.toBigInteger()` 和 `ULong.toBigInteger()` 擴充函式。

在此之前，將 `UInt` 和 `ULong` 值轉換為 `BigInteger` 需要基於字串的權宜之計或自訂轉換邏輯。從 Kotlin %kotlinEapVersion% 開始，您現在可以使用 `.toBigInteger()` 直接將無符號整數值轉換為 `BigInteger`。

範例如下：

```kotlin
fun main() {
    //sampleStart
    val unsignedLong = Long.MAX_VALUE.toULong() + 1uL
    val unsignedInt = UInt.MAX_VALUE

    println(unsignedLong.toBigInteger())
    // 9223372036854775808

    println(unsignedInt.toBigInteger())
    // 4294967295
   //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.0-Beta2" id="kotlin-2-4-0-convert-unsigned-int"}

歡迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-73111) 中向我們提供您的回饋。

## Kotlin/JVM

Kotlin %kotlinEapVersion% 支援新的 Java 版本，並預設啟用元資料中的註解。

### 支援 Java 26
<secondary-label ref="jvm"/>

從 Kotlin %kotlinEapVersion% 開始，編譯器可以產生包含 Java 26 位元組碼的類別。

### 預設啟用元資料中的註解
<secondary-label ref="jvm"/>

Kotlin 2.2.0 中的 Kotlin Metadata JVM 程式庫[引入了對讀取存儲在 Kotlin 元資料中註解的支援](whatsnew22.md#support-for-reading-and-writing-annotations-in-kotlin-metadata)。有了這項支援，Kotlin 編譯器會將註解與 JVM 位元組碼一起寫入元資料中，使 Kotlin Metadata JVM 程式庫可以存取它們。因此，註解處理器和其他工具可以在元資料層級理解和操作這些註解，而無需使用反射或修改原始碼。

在 Kotlin %kotlinEapVersion% 中，此支援已預設啟用。

## Kotlin/Native

Kotlin %kotlinEapVersion% 帶來了對 Swift 套件匯入的支援、透過 Swift 匯出改進的互通性，以及垃圾收集器中預設的並行標記。

### Swift 套件匯入
<primary-label ref="experimental-general"/>

<secondary-label ref="native"/>

Kotlin Multiplatform 專案現在可以在其 Gradle 配置中，將 [Swift 套件](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/) 宣告為 iOS 應用程式的相依性：

```kotlin
// build.gradle.kts
kotlin {

    swiftPMDependencies {
        swiftPackage(
            url = url("https://github.com/firebase/firebase-ios-sdk.git"),
            version = from("12.11.0"),
            products = listOf(
                product("FirebaseAI"),
                product("FirebaseAnalytics"),
                ...
}
```
{validate="false"}

有關操作範例 and 更詳細的資訊，請參閱 [SwiftPM 匯入](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-import.html)。

如果您的專案依賴 CocoaPods 相依性，您可以將目前的設定遷移為使用 Swift 套件。KMP 工具考慮到了這種使用案例，並能協助您自動重新設定專案。詳情請參閱我們的 [CocoaPods 遷移指南](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration.html)。

### Swift 匯出：支援匯出協同程式 flow
<primary-label ref="experimental-general"/>

<secondary-label ref="native"/>

Kotlin %kotlinEapVersion% 透過 Swift 匯出功能進一步改進了 Kotlin 與 Swift 的互通性，新增了將 `kotlinx.coroutines` flow 匯出到 Swift 的支援。

`kotlinx.coroutines` 中的 flow 代表可以並行發出和消耗的非同步資料流。它們通常用於反應式程式設計模式，例如監聽資料庫更新、網路請求或 UI 事件。

以前，將 [`kotlinx.coroutines.flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/) 中的 `Flow` 介面公開給 Swift 的唯一方法是透過第三方解決方案。現在，您可以開箱即用地將 flow 匯出到 Swift 對應的慣用語法中：[`AsyncSequence`](https://developer.apple.com/documentation/Swift/AsyncSequence)。

此功能預設啟用。您可以將任何具有 `Flow` 型別的公開 API 匯出到 Swift，同時保留型別資訊。例如：

```kotlin
// Kotlin
// 匯出 Flow 時保留了 String 型別
fun flowOfStrings(): Flow<String> = flowOf("hello", "any", "world")
```

```Swift
// Swift
var actual: [String] = []
// String 型別正確地從 Kotlin 推論出來
for try await element in flowOfStrings().asAsyncSequence() {
    actual.append(element)
}
```

有關 Swift 匯出的更多資訊，請參閱我們的[文件](native-swift-export.md)。

### 垃圾收集器中預設啟用並行標記
<secondary-label ref="native"/>

在 Kotlin 2.0.20 中，Kotlin 團隊 [引入了實驗性支援](whatsnew2020.md#concurrent-marking-in-garbage-collector)，用於並行標記與清除垃圾收集器 (CMS GC)。在處理使用者回饋並修復效能退化問題後，我們現在準備從 Kotlin %kotlinEapVersion% 開始預設啟用 CMS。

先前垃圾收集器中預設的平行標記並行清除 (PMCS) 設定在 GC 標記堆積中的物件時，必須暫停應用程式執行緒。相比之下，CMS 允許標記階段與應用程式執行緒並行執行。

這顯著縮短了 GC 暫停時間並提高了應用程式回應能力，這對於延遲敏感型應用程式的效能非常重要。CMS 已經在 [Compose Multiplatform](https://blog.jetbrains.com/kotlin/2024/10/compose-multiplatform-1-7-0-released/#performance-improvements-on-ios) 構建的 UI 應用程式基準測試中證明了其有效性。

如果您遇到問題，可以切換回 PMCS。為此，請在您的 `gradle.properties` 檔案中設定以下 [二進位選項](native-binary-options.md)：

```none
kotlin.native.binary.gc=pmcs
```

有關 Kotlin/Native 垃圾收集器的更多資訊，請參閱我們的[文件](native-memory-manager.md#garbage-collector)。

## Kotlin/Wasm

Kotlin %kotlinEapVersion% 預設為 Kotlin/Wasm 啟用增量編譯，並引入了對 WebAssembly 元件模型的支援。

### 增量編譯預設啟用

<secondary-label ref="wasm"/>

Kotlin/Wasm 在 2.1.0 中引入了增量編譯。從 Kotlin %kotlinEapVersion% 開始，它已達到[穩定](components-stability.md#stability-levels-explained)階段並預設啟用。有了這項功能，編譯器僅重新編譯受最近更改影響的檔案，這顯著減少了建置時間。

若要停用增量編譯，請在專案的 `local.properties` 或 `gradle.properties` 檔案中新增以下行：

```none
# gradle.properties
kotlin.incremental.wasm=false
```

如果您遇到任何問題，請在我們的 [YouTrack](https://kotl.in/issue) 中回報。

### 支援 WebAssembly 元件模型
<primary-label ref="experimental-general"/>

<secondary-label ref="wasm"/>

Kotlin/Wasm 在 Kotlin %kotlinEapVersion% 中更進一步，引入了對 [WebAssembly 元件模型](https://component-model.bytecodealliance.org/)的實驗性支援。該提案定義了一種透過標準化介面和型別從 Wasm 模組構建元件的方法。這種方法有助於 Wasm 從低階二進位指令格式演變為用於組成可重複使用的、與語言無關的元件的系統。它使 Kotlin/Wasm 能夠超越瀏覽器。例如，Kotlin 和 WebAssembly 非常適合函式即服務（也稱為 FaaS 或無伺服器）應用程式。

若要試用此功能，請查看[使用 `wasi:http` 構建的簡單伺服器](https://github.com/Kotlin/sample-wasi-http-kotlin/)。

<img src="kotlin-wasm-wasi-http.gif" alt="具有 WebAssembly 元件模型的 Kotlin/Wasm" width="600"/>

請在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-64569/Kotlin-Wasm-Support-Component-Model) 中分享您的回饋。

## Kotlin/JS

Kotlin %kotlinEapVersion% 新增了將數值類別匯出到 JavaScript/TypeScript 的支援，以及內嵌 JS 程式碼時支援 ES2015 功能。

### 支援將數值類別匯出到 JavaScript/TypeScript
<secondary-label ref="js"/>

先前，只有常規 Kotlin 類別可以匯出到 JavaScript/TypeScript。Kotlin %kotlinEapVersion% 取消了這項限制。您現在可以將 Kotlin 的[內嵌數值類別](inline-classes.md)作為常規 TypeScript 類別匯出。

若要匯出數值類別，請在 Kotlin 端使用 `@JsExport` 註解標記它：

```Kotlin
// Kotlin
@JsExport
@JvmInline
value class Email(val address: String) {
    init { require(address.contains("@")) { "Invalid email" } }
}

@JsExport
class AuthService {
    suspend fun login(email: Email): String = ...
}
```

從 TypeScript 端看，它就像一個常規類別：

```TypeScript
// TypeScript
import { AuthService, Email } from "..."
const auth = new AuthService();

console.log(await auth.login(new Email("jane@example.com"))); 
// "Welcome, jane@example.com!"
console.log(await auth.login(new Email("not-an-email"))); 
// "Invalid email"
```

如需更多資訊，請參閱 [`@JsExport` 註解](js-to-kotlin-interop.md#jsexport-annotation)。

### 內嵌 JS 程式碼時支援 ES2015 功能
<secondary-label ref="js"/>

從 Kotlin %kotlinEapVersion% 開始，JavaScript 程式碼內嵌已全面支援 [ES2015 功能](js-project-setup.md#support-for-es2015-features)。

這對於與第三方程式庫的互通性以及直接控制自動產生的應用程式程式碼非常有用。

現在，您可以在 [`js()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.js/js.html) 呼叫中使用現代 JS 功能，包括：

* Lambda（[箭頭函式](whatsnew21.md#support-for-generating-es2015-arrow-functions)）
* ES 類別
* 樣板字串
* 展開運算子
* `const` 和 `let` 變數宣告
* 產生器

請記住，`js()` 函式的參數應該是字串常數，因為它在編譯時被解析並「原樣」翻譯為 JavaScript 程式碼。例如，對於展開運算子，請使用：

```kotlin
fun spreadExample(): dynamic = js("""
    const add = (a, b, c) => a + b + c;

    const nums = [1, 2, 3];
    const sum = add(...nums);

    const a = [1, 2, 3];
    const b = [...a, 4, 5, 6];

    return { sum, b: b };
""")
```

有關內嵌內嵌 JavaScript 程式碼的更多資訊，請參閱[我們的文件](js-interop.md#inline-javascript)。

## Gradle

Kotlin %kotlinEapVersion% 與 Gradle 7.6.3 到 9.5.0 完全相容。您也可以使用截至最新 Gradle 版本。但是請注意，這樣做可能會導致棄用警告，且某些新的 Gradle 功能可能無法運作。

## Maven

Kotlin %kotlinEapVersion% 透過 Java 與 JVM 目標版本之間的自動對齊，使專案配置變得更加容易。

### Java 與 JVM 目標版本之間的自動對齊
<secondary-label ref="maven"/>

為了簡化專案配置並防止相容性問題，Kotlin Maven 外掛程式現在會自動將 JVM 目標版本與專案中配置的 Java 編譯器版本對齊。

這可確保 Kotlin 和 Maven 編譯器針對相同的位元組碼版本，從而避免 Kotlin 產生的位元組碼與專案其餘部分或預期部署環境不相容的問題。

啟用 `<extensions>` 選項後，您不需要 `kotlin.compiler.jvmTarget` 屬性。如果尚未定義，Kotlin Maven 外掛程式會按以下順序自動解析 JVM 目標版本：

1. 作為 `maven.compiler.release` 版本，定義為專案屬性或在 `maven-compiler-plugin` 配置中定義。

    在此情況下，`jvmTarget` 和 `jdkRelease` 編譯器選項都會為 Kotlin 編譯器設定，從而將 API 限制在特定的 JDK 版本。

2. 在未設定 Maven 發佈版本的情況下，作為 `maven.compiler.target` 版本。編譯器目標可以定義為專案屬性，也可以在 `maven-compiler-plugin` 配置中定義。

    在此情況下，僅設定 Kotlin 的 `jvmTarget`，且 API 不受特定 JDK 版本的限制。

這大大簡化了您的 Kotlin 專案配置，因此您的 `pom.xml` 檔案看起來如下所示：

```xml
<properties>
    <maven.compiler.release>17</maven.compiler.release>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>

<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
        </plugin>
    </plugins>
</build>
```

在組建期間，外掛程式會輸出類似的訊息：

```none
[INFO] Using jvmTarget=17 (derived from maven.compiler.release=17)
```

> `<extensions>` 選項僅檢查專案級屬性和全域 `maven-compiler-plugin` 配置。它不檢查外掛程式 `<executions>` 區段中定義的配置。
>
{style="note"}

有關自動專案配置的更多資訊，請參閱[我們的文件](maven-configure-project.md#automatic-configuration)。

## Kotlin 編譯器

Kotlin %kotlinEapVersion% 在 `.klib` 編譯期間，對宣告在同一模組中的內嵌函式提供了更一致的行為。

### 在 klib 編譯期間一致的模組內函式內嵌
<secondary-label ref="compiler"/>

先前，[函式內嵌](inline-functions.md)在不同的 Kotlin 平台上的行為並不一致。JetBrains 團隊正致力於在所有支援的平台上統一此行為，以確保相同的相容性保證。

在 Kotlin/JVM 上，函式內嵌發生在編譯時期。因此，當使用 Kotlin/JVM 編譯器編譯 Kotlin 原始碼時，產生的類別檔案在位元組碼中沒有內嵌函式呼叫，因為內嵌函式的內容已內嵌到其呼叫點中，所以它們的行為在編譯期間就已固定。

相反地，在 Kotlin/Native、Kotlin/JS 和 Kotlin/Wasm 上，函式內嵌並未發生在從原始碼到 klib 的編譯期間，而僅發生在二進制檔案產生期間。因此，內嵌函式的行為在 `.klib` 編譯期間並未固定，且 `.klib` 程式庫無法像 Kotlin/JVM 那樣為內嵌函式提供相同的相容性保證。

Kotlin %kotlinEapVersion% 在產生 `.klib` 建置產物時啟用了模組內內嵌，邁出了統一內嵌函式行為的第一步：

```kotlin
// 現有的 logging.klib 程式庫
inline fun logDebug(message: String) {
    println("[DEBUG] $message")
}
```

```kotlin
// 目前編譯的 App 模組
inline fun greetUser(name: String) {
    println("Hello, $name!")
}

fun main() {
    logDebug("App started") // 未內嵌：宣告在另一個模組中
    greetUser("Alice")      // 已內嵌：宣告在同一個模組中
}
```

編譯為 `.klib` 時，程式碼看起來如下所示：

```kotlin
// 虛擬程式碼
fun main() {
    logDebug("App started")  // 未內嵌，宣告在另一個模組中
    val tmp0 = "Alice"
    println("Hello, $tmp0!") // 從 greetUser() 內嵌
}
```

這意味著只有在同一模組中宣告的內嵌函式會在 `.klib` 編譯期間被內嵌。在此情況下，其他函式則會在產生平台特定二進制檔案的過程中被內嵌。

#### 如何啟用

從 %kotlinEapVersion% 開始，Kotlin/Native、Kotlin/JS 和 Kotlin/Wasm 預設啟用模組內內嵌。

如果您遇到此功能的意外問題，可以使用命令列中的以下編譯器選項將其停用：

```bash
-Xklib-ir-inliner=disabled
```

下一步是啟用跨模組內嵌，以確保專案中的所有內嵌函式都能一致地被內嵌。這項變更計劃在未來的 Kotlin 版本中推出，但您現在已經可以透過在命令列中使用以下編譯器選項來嘗試：

```bash
-Xklib-ir-inliner=full
```

請在 [YouTrack](https://kotl.in/issue) 中分享您的回饋並回報任何問題。