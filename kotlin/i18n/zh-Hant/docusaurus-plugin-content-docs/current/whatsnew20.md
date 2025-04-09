---
title: "Kotlin 2.0.0 的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[已發布：2024 年 5 月 21 日](releases#release-details)_

Kotlin 2.0.0 版本已發布，並且 [新的 Kotlin K2 編譯器](#kotlin-k2-compiler) 已經穩定！此外，以下是一些其他的重點：

* [新的 Compose 編譯器 Gradle 外掛程式](#new-compose-compiler-gradle-plugin)
* [使用 invokedynamic 生成 lambda 函數](#generation-of-lambda-functions-using-invokedynamic)
* [kotlinx-metadata-jvm 程式庫現在已穩定](#the-kotlinx-metadata-jvm-library-is-stable)
* [使用 Apple 平台上的信號標監控 Kotlin/Native 中的 GC 效能](#monitoring-gc-performance-with-signposts-on-apple-platforms)
* [使用 Objective-C 方法解決 Kotlin/Native 中的衝突](#resolving-conflicts-with-objective-c-methods)
* [支援 Kotlin/Wasm 中的具名導出](#support-for-named-export)
* [支援 Kotlin/Wasm 中具有 @JsExport 函數中的無符號基本類型](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
* [預設使用 Binaryen 優化生產版本](#optimized-production-builds-by-default-using-binaryen)
* [多平台專案中編譯器選項的新 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
* [enum class values 通用函數的穩定替換](#stable-replacement-of-the-enum-class-values-generic-function)
* [穩定 AutoCloseable 介面](#stable-autocloseable-interface)

Kotlin 2.0 是 JetBrains 團隊的一個巨大里程碑。此版本是 KotlinConf 2024 的中心。查看開幕
主題演講，我們在其中宣布了令人興奮的更新，並解決了最近在 Kotlin 語言方面的工作：

<video src="https://www.youtube.com/v/Ar73Axsz2YA" title="KotlinConf'24 - Keynote"/>

## IDE 支援

支援 Kotlin 2.0.0 的 Kotlin 外掛程式已捆綁在最新的 IntelliJ IDEA 和 Android Studio 中。
您無需在 IDE 中更新 Kotlin 外掛程式。
您只需要在建構腳本中[將 Kotlin 版本更改](releases#update-to-a-new-kotlin-version)為 Kotlin 2.0.0。

* 關於 IntelliJ IDEA 對 Kotlin K2 編譯器的支援的詳細資訊，請參閱 [IDE 中的支援](#support-in-ides)。
* 關於 IntelliJ IDEA 對 Kotlin 支援的更多詳細資訊，請參閱 [Kotlin 版本](releases#ide-support)。

## Kotlin K2 編譯器

通往 K2 編譯器的道路漫長，但現在 JetBrains 團隊終於準備好宣布其穩定性。
在 Kotlin 2.0.0 中，預設情況下使用新的 Kotlin K2 編譯器，並且對於所有目標平台（JVM、Native、Wasm 和 JS）來說，它是 [穩定的](components-stability)。新的編譯器帶來了重大的效能提升，加速了新的語言特性開發，統一了 Kotlin 支援的所有平台，並為多平台專案提供了更好的架構。

JetBrains 團隊透過成功編譯來自選定的使用者和內部專案的 1000 萬行程式碼來確保新編譯器的品質。18,000 名開發人員參與了穩定過程，測試了總共 80,000 個專案中的新 K2 編譯器，並報告了他們發現的任何問題。

為了使遷移到新編譯器的過程盡可能順利，我們建立了一個 [K2 編譯器遷移指南](k2-compiler-migration-guide)。
本指南說明了編譯器的許多優點，重點介紹了您可能遇到的任何變更，並描述了如何在必要時回滾到以前的版本。

在一篇 [部落格文章](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/) 中，
我們探討了 K2 編譯器在不同專案中的效能。如果您想查看關於 K2 編譯器效能的真實資料，並找到如何從您自己的專案中收集效能基準的說明，請查看該文章。

您還可以觀看 KotlinConf 2024 上的這個演講，其中首席語言設計師 Michail Zarečenskij 討論了 Kotlin 中的特性演變和 K2 編譯器：

<video src="https://www.youtube.com/v/tAGJ5zJXJ7w" title="Kotlin Language Features in 2.0 and Beyond"/>

### 目前 K2 編譯器的限制

在您的 Gradle 專案中啟用 K2 存在一些限制，這些限制可能會影響在以下情況下使用低於 8.3 的 Gradle 版本的專案：

* 編譯來自 `buildSrc` 的原始程式碼。
* 編譯包含的建構中的 Gradle 外掛程式。
* 如果其他 Gradle 外掛程式在低於 8.3 的 Gradle 版本的專案中使用，則編譯這些外掛程式。
* 建構 Gradle 外掛程式依賴項。

如果您遇到上述任何問題，您可以採取以下步驟來解決它們：

* 為 `buildSrc`、任何 Gradle 外掛程式及其依賴項設定語言版本：

  ```kotlin
  kotlin {
      compilerOptions {
          languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
          apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
      }
  }
  ```

  > 如果您為特定任務設定語言和 API 版本，這些值將覆寫 `compilerOptions` 擴充功能設定的值。在這種情況下，語言和 API 版本不應高於 1.9。
  >
  

* 將您專案中的 Gradle 版本更新到 8.3 或更高版本。

### 智慧型轉換改進

Kotlin 編譯器可以在特定情況下自動將物件轉換為類型，從而省去您必須自己顯式轉換它的麻煩。這稱為 [智慧型轉換](typecasts#smart-casts)。
Kotlin K2 編譯器現在在比以前更多的場景中執行智慧型轉換。

在 Kotlin 2.0.0 中，我們在以下領域對智慧型轉換進行了改進：

* [區域變數和更遠的範圍](#local-variables-and-further-scopes)
* [使用邏輯 `or` 運算符的類型檢查](#type-checks-with-logical-or-operator)
* [inline 函數](#inline-functions)
* [具有函數類型的屬性](#properties-with-function-types)
* [例外處理](#exception-handling)
* [遞增和遞減運算符](#increment-and-decrement-operators)

#### 區域變數和更遠的範圍

以前，如果在 `if` 條件中將變數評估為非 `null`，則該變數將被智慧型轉換。
關於此變數的資訊將在 `if` 區塊的範圍內進一步共享。

但是，如果您在 `if` 條件 **之外** 宣告變數，則在 `if` 條件內將無法使用關於該變數的任何資訊，因此無法對其進行智慧型轉換。在 `when` 表達式和 `while` 迴圈中也看到了這種行為。

從 Kotlin 2.0.0 開始，如果您在使用變數之前在 `if`、`when` 或 `while` 條件中宣告變數，則編譯器收集的關於該變數的任何資訊都將在相應的區塊中可用於智慧型轉換。

當您想要執行諸如將布林條件提取到變數中之類的操作時，這可能會很有用。然後，您可以為該變數指定一個有意義的名稱，這將提高程式碼的可讀性，並使其可以在程式碼中稍後重複使用該變數。例如：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // 在 Kotlin 2.0.0 中，編譯器可以存取
        // 關於 isCat 的資訊，因此它知道
        // animal 已被智慧型轉換為 Cat 類型。
        // 因此，可以呼叫 purr() 函數。
        // 在 Kotlin 1.9.20 中，編譯器不知道
        // 關於智慧型轉換，因此呼叫 purr()
        // 函數會觸發錯誤。
        animal.purr()
    }
}

fun main() {
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```

#### 使用邏輯 or 運算符的類型檢查

在 Kotlin 2.0.0 中，如果您使用 `or` 運算符 (`||`) 組合物件的類型檢查，則會對其最接近的通用超類型進行智慧型轉換。在此變更之前，始終會對 `Any` 類型進行智慧型轉換。

在這種情況下，您仍然必須在之後手動檢查物件類型，然後才能存取其任何屬性或呼叫其函數。例如：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus 被智慧型轉換為通用超類型 Status
        signalStatus.signal()
        // 在 Kotlin 2.0.0 之前，signalStatus 被智慧型轉換為 
        // Any 類型，因此呼叫 signal() 函數會觸發
        // Unresolved reference 錯誤。只能在另一個類型檢查之後
        // 成功呼叫 signal() 函數：

        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

:::note
通用超類型是聯合類型的 **近似值**。[聯合類型](https://en.wikipedia.org/wiki/Union_type)
在 Kotlin 中不受支援。

:::

#### inline 函數

在 Kotlin 2.0.0 中，K2 編譯器以不同的方式處理 inline 函數，
允許它結合其他編譯器分析來確定是否可以安全地進行智慧型轉換。

具體來說，inline 函數現在被視為具有隱式的 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)
契約。這意味著傳遞給 inline 函數的任何 lambda 函數都會被就地呼叫。由於 lambda 函數是就地呼叫的，因此編譯器知道 lambda 函數無法洩漏對其函數體中包含的任何變數的引用。

編譯器使用此知識以及其他編譯器分析來決定是否可以安全地對任何捕獲的變數進行智慧型轉換。例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () `->` Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 在 Kotlin 2.0.0 中，編譯器知道 processor 
        // 是一個區域變數，並且 inlineAction() 是一個 inline 函數，因此 
        // 無法洩漏對 processor 的引用。因此，可以安全地 
        // 對 processor 進行智慧型轉換。

        // 如果 processor 不是 null，則 processor 會被智慧型轉換
        if (processor != null) {
            // 編譯器知道 processor 不是 null，因此不需要安全呼叫
            // 是必要的
            processor.process()

            // 在 Kotlin 1.9.20 中，您必須執行安全呼叫：
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 具有函數類型的屬性

在以前的 Kotlin 版本中，存在一個錯誤，這意味著具有函數類型的類別屬性未被智慧型轉換。
我們在 Kotlin 2.0.0 和 K2 編譯器中修復了此行為。例如：

```kotlin
class Holder(val provider: (() `->` Unit)?) {
    fun process() {
        // 在 Kotlin 2.0.0 中，如果 provider 不是 null，則
        // provider 會被智慧型轉換
        if (provider != null) {
            // 編譯器知道 provider 不是 null
            provider()

            // 在 1.9.20 中，編譯器不知道 provider 不是 
            // null，因此它會觸發錯誤：
            // Reference has a nullable type '(() `->` Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

如果您重載 `invoke` 運算符，此變更也適用。例如：

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () `->` String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider()
            // 在 1.9.20 中，編譯器會觸發錯誤：
            // Reference has a nullable type 'Provider?' use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 例外處理

在 Kotlin 2.0.0 中，我們對例外處理進行了改進，以便可以將智慧型轉換資訊傳遞到 `catch`
和 `finally` 區塊。此變更使您的程式碼更安全，因為編譯器會追蹤您的物件是否具有可為 null 的類型。例如：

```kotlin

fun testString() {
    var stringInput: String? = null
    // stringInput 被智慧型轉換為 String 類型
    stringInput = ""
    try {
        // 編譯器知道 stringInput 不是 null
        println(stringInput.length)
        // 0

        // 編譯器拒絕 stringInput 的先前智慧型轉換資訊。現在 stringInput 具有 String? 類型。
        stringInput = null

        // 觸發例外
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 在 Kotlin 2.0.0 中，編譯器知道 stringInput 
        // 可以為 null，因此 stringInput 保持可為 null。
        println(stringInput?.length)
        // null

        // 在 Kotlin 1.9.20 中，編譯器表示不需要安全呼叫，但這是錯誤的。
    }
}

fun main() {
    testString()
}
```

#### 遞增和遞減運算符

在 Kotlin 2.0.0 之前，編譯器不瞭解在使用遞增或遞減運算符後物件的類型可能會變更。由於編譯器無法準確追蹤物件類型，因此您的程式碼可能會導致無法解析的引用錯誤。在 Kotlin 2.0.0 中，這已得到修復：

```kotlin
interface Rho {
    operator fun inc(): Sigma = TODO()
}

interface Sigma : Rho {
    fun sigma() = Unit
}

interface Tau {
    fun tau() = Unit
}

fun main(input: Rho) {
    var unknownObject: Rho = input

    // 檢查 unknownObject 是否從 Tau 介面繼承
    // 注意，unknownObject 可能同時從
    // Rho 和 Tau 介面繼承。
    if (unknownObject is Tau) {

        // 使用來自介面 Rho 的重載 inc() 運算符。
        // 在 Kotlin 2.0.0 中，unknownObject 的類型被智慧型轉換為
        // Sigma。
        ++unknownObject

        // 在 Kotlin 2.0.0 中，編譯器知道 unknownObject 具有類型
        // Sigma，因此可以成功呼叫 sigma() 函數。
        unknownObject.sigma()

        // 在 Kotlin 1.9.20 中，當呼叫 inc() 時，編譯器不會執行智慧型轉換
        // 因此編譯器仍然認為 
        // unknownObject 具有類型 Tau。呼叫 sigma() 函數
        // 會拋出編譯時錯誤。
        
        // 在 Kotlin 2.0.0 中，編譯器知道 unknownObject 具有類型
        // Sigma，因此呼叫 tau() 函數會拋出編譯時 
        // 錯誤。
        unknownObject.tau()
        // Unresolved reference 'tau'

        // 在 Kotlin 1.9.20 中，由於編譯器錯誤地認為 
        // unknownObject 具有類型 Tau，因此可以呼叫 tau() 函數，
        // 但它會拋出 ClassCastException。
    }
}
```

### Kotlin Multiplatform 改進

在 Kotlin 2.0.0 中，我們在以下領域對 Kotlin Multiplatform 相關的 K2 編譯器進行了改進：

* [在編譯期間分離通用和平台來源](#separation-of-common-and-platform-sources-during-compilation)
* [預期和實際宣告的不同可見性級別](#different-visibility-levels-of-expected-and-actual-declarations)

#### 在編譯期間分離通用和平台來源

以前，Kotlin 編譯器的設計阻止了它在編譯時保持通用和平台原始碼集的獨立性。
因此，通用程式碼可以存取平台程式碼，這導致平台之間的行為不同。
此外，來自通用程式碼的一些編譯器設定和依賴項過去會洩漏到平台程式碼中。

在 Kotlin 2.0.0 中，我們的新 Kotlin K2 編譯器的實作包含重新設計的編譯方案，以確保
通用和平台原始碼集之間嚴格分離。當您使用 [預期和實際函數](multiplatform-expect-actual#expected-and-actual-functions) 時，此變更最為明顯。
以前，通用程式碼中的函數呼叫可能會解析為平台程式碼中的函數。例如：
<table>
<tr>
<td>
通用程式碼
</td>
<td>
平台程式碼
</td>
</tr>
<tr>
<td>

```kotlin
fun foo(x: Any) = println("common foo")

fun exampleFunction() {
    foo(42)
}
```
</td>
<td>

```kotlin
// JVM
fun foo(x: Int) = println("platform foo")

// JavaScript
// 在 JavaScript 平台上沒有 foo() 函數重載
```
</td>
</tr>
</table>

在此範例中，通用程式碼的行為取決於它執行的平台：

* 在 JVM 平台上，呼叫通用程式碼中的 `foo()` 函數會導致呼叫來自平台程式碼的 `foo()` 函數，即 `platform foo`。
* 在 JavaScript 平台上，呼叫通用程式碼中的 `foo()` 函數會導致呼叫來自
  通用程式碼的 `foo()` 函數，即 `common foo`，因為平台程式碼中沒有此類函數可用。

在 Kotlin 2.0.0 中，通用程式碼無法存取平台程式碼，因此兩個平台都成功將 `foo()`
函數解析為通用程式碼中的 `foo()` 函數：`common foo`。

除了提高跨平台行為的一致性之外，我們還努力修復 IntelliJ IDEA 或 Android Studio 與編譯器之間存在衝突行為的情況。例如，當您使用 [預期和實際類別](multiplatform-expect-actual#expected-and-actual-classes) 時，
會發生以下情況：
<table>
<tr>
<td>
通用程式碼
</td>
<td>
平台程式碼
</td>
</tr>
<tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // 在 2.0.0 之前，
    // 它會觸發僅限 IDE 的錯誤
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : Expected class
    // Identity 沒有預設建構函式。
}
```
</td>
<td>

```kotlin
actual class Identity {
    actual fun confirmIdentity() = "expect class fun: jvm"
}
```
</td>
</tr>
</table>

在此範例中，預期類別 `Identity` 沒有預設建構函式，因此無法在通用程式碼中成功呼叫它。
以前，只有 IDE 會報告錯誤，但程式碼仍然可以在 JVM 上成功編譯。但是，現在編譯器會正確報告錯誤：

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 何時解析行為不變更

我們仍在遷移到新的編譯方案的過程中，因此當您呼叫不在同一原始碼集中的函數時，解析行為仍然相同。
當您在通用程式碼中使用來自多平台程式庫的重載時，您主要會注意到這種差異。

假設您有一個程式庫，它有兩個具有不同簽章的 `whichFun()` 函數：

```kotlin
// 範例程式庫

// MODULE: common
fun whichFun(x: Any) = println("common function")

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

如果您在通用程式碼中呼叫 `whichFun()` 函數，則會解析程式庫中具有最相關參數類型的函數：

```kotlin
// 一個使用 JVM 目標範例程式庫的專案

// MODULE: common
fun main() {
    whichFun(2)
    // platform function
}
```

相比之下，如果您在同一原始碼集中宣告 `whichFun()` 的重載，則會解析來自通用程式碼的函數，因為您的程式碼無法存取平台特定的版本：

```kotlin
// 未使用範例程式庫

// MODULE: common
fun whichFun(x: Any) = println("common function")

fun main() {
    whichFun(2)
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

與多平台程式庫類似，由於 `commonTest` 模組位於單獨的原始碼集中，因此它仍然可以存取平台特定的程式碼。
因此，對 `commonTest` 模組中函數的呼叫解析的行為與舊編譯方案中的行為相同。

將來，這些剩餘情況將與新的編譯方案更加一致。

#### 預期和實際宣告的不同可見性級別

在 Kotlin 2.0.0 之前，如果您在 Kotlin Multiplatform 專案中使用 [預期和實際宣告](multiplatform-expect-actual)，它們必須具有相同的 [可見性級別](visibility-modifiers)。
Kotlin 2.0.0 現在也支援不同的可見性級別，但 **僅** 當實際宣告 _比_ 預期宣告更寬鬆時。例如：

```kotlin
expect internal class Attribute // 可見性為 internal
actual class Attribute          // 可見性預設為 public，
                                // 這更寬鬆
```

同樣，如果您在實際宣告中使用 [類型別名](type-aliases)，則 **基礎類型** 的可見性
應與預期宣告相同或更寬鬆。例如：

```kotlin
expect internal class Attribute                 // 可見性為 internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 可見性預設為 public，
                                                // 這更寬鬆
```

### 編譯器外掛程式支援

目前，Kotlin K2 編譯器支援以下 Kotlin 編譯器外掛程式：

* [`all-open`](all-open-plugin)
* [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
* [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
* [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
* [kapt](whatsnew1920#preview-kapt-compiler-plugin-with-k2)
* [Lombok](lombok)
* [`no-arg`](no-arg-plugin)
* [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
* [SAM with receiver](sam-with-receiver-plugin)
* [serialization](serialization)
* [Power-assert](power-assert)

此外，Kotlin K2 編譯器支援：

* [Jetpack Compose](https://developer.android.com/jetpack/compose) 編譯器外掛程式 2.0.0，它已 [移至 Kotlin 儲存庫](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)。
* 自 [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 以來的 [Kotlin 符號處理 (KSP) 外掛程式](ksp-overview)。

:::note
如果您使用任何其他編譯器外掛程式，請查看其文件，以了解它們是否與 K2 相容。

### 實驗性 Kotlin Power-assert 編譯器外掛程式

Kotlin Power-assert 外掛程式是 [實驗性的](components-stability#stability-levels-explained)。
它可能會隨時變更。

Kotlin 2.0.0 引入了一個實驗性的 Power-assert 編譯器外掛程式。此外掛程式透過在失敗訊息中包含上下文資訊來改善編寫測試的體驗，從而使偵錯更容易且更有效率。

開發人員通常需要使用複雜的斷言程式庫來編寫有效的測試。Power-assert 外掛程式透過自動產生包含斷言表達式中間值的失敗訊息來簡化此過程。
這有助於開發人員快速瞭解測試失敗的原因。

當測試中的斷言失敗時，改進的錯誤訊息會顯示斷言中所有變數和子表達式的值，從而清楚地瞭解條件的哪個部分導致了失敗。這對於檢查多個條件的複雜斷言特別有用。

若要在專案中啟用此外掛程式，請在 `build.gradle(.kts)` 檔案中配置它：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.0.0"
    kotlin("plugin.power-assert") version "2.0.0"
}

powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.0.0'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '2.0.0'
}

powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue"]
}
```

</TabItem>
</Tabs>

在 [文件中](power-assert) 瞭解關於 Kotlin Power-assert 外掛程式的更多資訊。

### 如何啟用 Kotlin K2 編譯器

從 Kotlin 2.0.0 開始，預設情況下會啟用 Kotlin K2 編譯器。不需要其他操作。

### 在 Kotlin Playground 中試用 Kotlin K2 編譯器

Kotlin Playground 支援 2.0.0 版本。[立即查看！](https://pl.kotl.in/czuoQprce)

### IDE 中的支援

預設情況下，IntelliJ IDEA 和 Android Studio 仍然使用先前的編譯器進行程式碼分析、程式碼完成、
醒目顯示和其他 IDE 相關功能。若要在 IDE 中獲得完整的 Kotlin 2.0 體驗，請啟用 K2 模式。

在您的 IDE 中，前往 **Settings** | **Languages & Frameworks** | **Kotlin** 並選擇 **Enable K2 mode** 選項。
IDE 將使用其 K2 模式分析您的程式碼。

<img src="/img/k2-mode.png" alt="Enable K2 mode" width="200" style={{verticalAlign: 'middle'}}/>

啟用 K2 模式後，由於編譯器行為的變更，您可能會注意到 IDE 分析中的差異。在我們的 [遷移指南](k2-compiler-migration-guide) 中瞭解新的 K2 編譯器與先前的編譯器有何不同。

* 在 [我們的部落格](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/) 中瞭解關於 K2 模式的更多資訊。
* 我們正在積極收集關於 K2 模式的回饋，因此請在我們的 [公開 Slack 頻道](https://kotlinlang.slack.com/archives/C0B8H786P) 中分享您的想法。

### 留下您對新 K2 編譯器的回饋

我們將感謝您提供的任何回饋！

* 在 [我們的 issue tracker](https://kotl.in/issue) 中報告您使用新 K2 編譯器時遇到的任何問題。
* [啟用「傳送使用情況統計資訊」選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以
  允許 JetBrains 收集關於 K2 使用情況的匿名資料。

## Kotlin/JVM

從 2.0.0 版本開始，編譯器可以產生包含 Java 22 位元組碼的類別。
此版本還帶來了以下變更：

* [使用 invokedynamic 生成 lambda 函數](#generation-of-lambda-functions-using-invokedynamic)
* [kotlinx-metadata-jvm 程式庫現在已穩定](#the-kotlinx-metadata-jvm-library-is-stable)

### 使用 invokedynamic 生成 lambda 函數

Kotlin 2.0.0 引入了一種使用 `invokedynamic` 生成 lambda 函數的新預設方法。與傳統的匿名類別生成相比，此變更減少了應用程式的二進位大小。

自第一個版本以來，Kotlin 已將 lambdas 生成為匿名類別。但是，從 [Kotlin 1.5.0](whatsnew15#lambdas-via-invokedynamic) 開始，
可以使用 `-Xlambdas=indy` 編譯器選項來使用 `invokedynamic` 生成的選項。在 Kotlin
2.0.0 中，`invokedynamic` 已成為 lambda 生成的預設方法。此方法產生更輕的二進位檔，並使 Kotlin 與 JVM 優化對齊，確保應用程式受益於 JVM 效能的不斷發展和未來的改進。

目前，與普通 lambda 編譯相比，它有三個限制：

* 編譯為 `invokedynamic` 的 lambda 無法序列化。
* 實驗性 [`reflect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API 不支援由 `invokedynamic` 生成的 lambda。
* 在此類 lambda 上呼叫 `.toString()` 會產生可讀性較低的字串表示：

```kotlin
fun main() {
    println({})

    // 使用 Kotlin 1.9.24 和反射，傳回
    // () `->` kotlin.Unit
    
    // 使用 Kotlin 2.0.0，傳回
    // FileKt$Lambda$13/0x00007f88a0004608@506e1b77
}
```

若要保留生成 lambda 函數的舊版行為，您可以：

* 使用 `@JvmSerializableLambda` 註釋特定 lambda。
* 使用編譯器選項 `-Xlambdas=class` 來使用舊版方法在模組中生成所有 lambda。

### kotlinx-metadata-jvm 程式庫現在已穩定

在 Kotlin 2.0.0 中，`kotlinx-metadata-jvm` 程式庫變為 [穩定的](components-stability#stability-levels-explained)。現在該程式庫已變更為
`kotlin` 套件和座標，您可以將其找到為 `kotlin-metadata-jvm`（沒有「x」）。

以前，`kotlinx-metadata-jvm` 程式庫有自己的發布方案和版本。現在，我們將建構和發布
`kotlin-metadata-jvm` 更新作為 Kotlin 發布週期的一部分，具有與 Kotlin 標準程式庫相同的向後相容性保證。

`kotlin-metadata-jvm` 程式庫提供了一個 API 來讀取和修改由 Kotlin/JVM 編譯器生成的二進位檔案的中繼資料。

<!-- Learn more about the `kotlinx-metadata-jvm` library in the [documentation](kotlin-metadata-jvm.md). -->

## Kotlin/Native

此版本帶來了以下變更：

* [使用 Apple 平台上的信號標監控 GC 效能](#monitoring-gc-performance-with-signposts-on-apple-platforms)
* [使用 Objective-C 方法解決衝突](#resolving-conflicts-with-objective-c-methods)
* [變更了 Kotlin/Native 中編譯器參數的記錄級別](#changed-log-level-for-compiler-arguments)
* [將標準程式庫和平台依賴項明確新增到 Kotlin/Native](#explicitly-added-standard-library-and-platform-dependencies-to-kotlin-native)
* [Gradle 配置快取中的任務錯誤](#tasks-error-in-gradle-configuration-cache)

### 使用 Apple 平台上的信號標監控 GC 效能

以前，只能透過查看記錄來監控 Kotlin/Native 垃圾收集器 (GC) 的效能。
但是，這些記錄未與 Xcode Instruments 整合，Xcode Instruments 是用於調查 iOS
應用程式效能問題的常用工具包。

自 Kotlin 2.0.0 以來，GC 會使用 Instruments 中可用的信號標報告暫停。信號標允許在您的應用程式中進行自訂記錄，因此現在，當偵錯 iOS 應用程式效能時，您可以檢查 GC 暫停是否對應於
應用程式凍結。

在 [文件中](native-memory-manager#monitor-gc-performance) 瞭解關於 GC 效能分析的更多資訊。

### 使用 Objective-C 方法解決衝突

Objective-C 方法可以具有不同的名稱，但具有相同數量和類型的參數。例如，
[`locationManager:didEnterRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423560-locationmanager?language=objc)
和 [`locationManager:didExitRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423630-locationmanager?language=objc)。
在 Kotlin 中，這些方法具有相同的簽章，因此嘗試使用它們會觸發衝突的重載錯誤。

以前，您必須手動抑制衝突的重載才能避免此編譯錯誤。為了改善 Kotlin
與 Objective-C 的互通性，Kotlin 2.0.0 引入了新的 `@ObjCSignatureOverride` 註釋。

此外掛程式指示 Kotlin 編譯器忽略衝突的重載，以防從 Objective-C 類別繼承了具有相同參數類型但參數名稱不同的多個函數。

應用此註釋也比一般錯誤抑制更安全。此外掛程式只能用於覆寫受支援和測試的 Objective-C 方法的情況，而一般抑制可能會隱藏重要錯誤並導致程式碼在靜默情況下損壞。

### 變更了