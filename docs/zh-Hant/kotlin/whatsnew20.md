[//]: # (title: Kotlin 2.0.0 有哪些新功能)

_[發佈日期：2024 年 5 月 21 日](releases.md#release-details)_

Kotlin 2.0.0 版本已推出，且 [新的 Kotlin K2 編譯器](#kotlin-k2-compiler) 已穩定！此外，還有以下重點：

*   [新的 Compose 編譯器 Gradle 外掛程式](#new-compose-compiler-gradle-plugin)
*   [使用 invokedynamic 生成 Lambda 函式](#generation-of-lambda-functions-using-invokedynamic)
*   [kotlinx-metadata-jvm 函式庫現已穩定](#the-kotlinx-metadata-jvm-library-is-stable)
*   [使用 Apple 平台上的標記監控 Kotlin/Native 中的 GC 效能](#monitoring-gc-performance-with-signposts-on-apple-platforms)
*   [解決 Kotlin/Native 與 Objective-C 方法的衝突](#resolving-conflicts-with-objective-c-methods)
*   [Kotlin/Wasm 支援命名匯出](#support-for-named-export)
*   [Kotlin/Wasm 中 @JsExport 函式對無符號基本類型的支援](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
*   [預設使用 Binaryen 優化生產建置](#optimized-production-builds-by-default-using-binaryen)
*   [多平台專案中編譯器選項的新 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
*   [enum 類別值泛型函式的穩定取代](#stable-replacement-of-the-enum-class-values-generic-function)
*   [穩定的 AutoCloseable 介面](#stable-autocloseable-interface)

Kotlin 2.0 是 JetBrains 團隊的一個重要里程碑。此版本是 KotlinConf 2024 的中心。請觀看開幕主題演講，我們在其中宣布了令人興奮的更新並討論了 Kotlin 語言的最新工作：

<video src="https://www.youtube.com/v/Ar73Axsz2YA" title="KotlinConf'24 - Keynote"/>

## IDE 支援

支援 Kotlin 2.0.0 的 Kotlin 外掛程式已捆綁在最新的 IntelliJ IDEA 和 Android Studio 中。
您不需要更新 IDE 中的 Kotlin 外掛程式。
您只需在建置指令碼中將 [Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version) 為 Kotlin 2.0.0 即可。

*   有關 IntelliJ IDEA 對 Kotlin K2 編譯器支援的詳細資訊，請參閱 [IDE 支援](#support-in-ides)。
*   有關 IntelliJ IDEA 對 Kotlin 支援的更多詳細資訊，請參閱 [Kotlin 版本](releases.md#ide-support)。

## Kotlin K2 編譯器

K2 編譯器之路漫長，但現在 JetBrains 團隊終於準備好宣布其穩定性。
在 Kotlin 2.0.0 中，新的 Kotlin K2 編譯器預設啟用，並且對於所有目標平台（JVM、Native、Wasm 和 JS）都已 [穩定](components-stability.md)。新的編譯器帶來了主要的效能改進，加速了新語言功能的開發，統一了 Kotlin 支援的所有平台，並為多平台專案提供了更好的架構。

JetBrains 團隊透過成功編譯來自選定使用者和內部專案的 1000 萬行程式碼，確保了新編譯器的品質。18,000 名開發人員參與了穩定化過程，在總計 80,000 個專案中測試了新的 K2 編譯器，並報告了他們發現的任何問題。

為了讓遷移到新編譯器的過程盡可能順暢，我們建立了 [K2 編譯器遷移指南](k2-compiler-migration-guide.md)。
本指南解釋了編譯器的許多優點，強調了您可能會遇到的任何變更，並描述了在必要時如何回溯到舊版本。

在 [部落格文章](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/) 中，
我們探討了 K2 編譯器在不同專案中的效能。如果您想了解 K2 編譯器的實際效能數據，並找到如何從您自己的專案中收集效能基準測試的說明，請查看該文章。

您還可以觀看 KotlinConf 2024 的這場演講，其中首席語言設計師 Michail Zarečenskij 討論了 Kotlin 和 K2 編譯器中的功能演進：

<video src="https://www.youtube.com/v/tAGJ5zJXJ7w" title="Kotlin Language Features in 2.0 and Beyond"/>

### 當前 K2 編譯器限制

在您的 Gradle 專案中啟用 K2 會帶來某些限制，這些限制可能會影響在以下情況中使用 Gradle 8.3 以下版本的專案：

*   編譯來自 `buildSrc` 的原始碼。
*   編譯包含建置中的 Gradle 外掛程式。
*   如果其他 Gradle 外掛程式在 Gradle 8.3 以下版本的專案中使用，則編譯它們。
*   建置 Gradle 外掛程式依賴項。

如果您遇到上述任何問題，可以採取以下步驟來解決：

*   為 `buildSrc`、任何 Gradle 外掛程式及其依賴項設定語言版本：

    ```kotlin
    kotlin {
        compilerOptions {
            languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
            apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        }
    }
    ```

    > 如果您為特定任務配置語言和 API 版本，這些值將覆寫 `compilerOptions` 擴充設定的值。在這種情況下，語言和 API 版本不應高於 1.9。
    >
    {style="note"}

*   將專案中的 Gradle 版本更新到 8.3 或更高版本。

### 智慧型轉型改進

Kotlin 編譯器可以在特定情況下自動將物件轉型為某種類型，省去了您明確轉型的麻煩。這稱為 [智慧型轉型](typecasts.md#smart-casts)。
Kotlin K2 編譯器現在在比以前更多的場景中執行智慧型轉型。

在 Kotlin 2.0.0 中，我們在以下領域對智慧型轉型進行了改進：

*   [區域變數和更多範圍](#local-variables-and-further-scopes)
*   [使用邏輯 `or` 運算子進行類型檢查](#type-checks-with-logical-or-operator)
*   [內聯函式](#inline-functions)
*   [具函式類型的屬性](#properties-with-function-types)
*   [例外處理](#exception-handling)
*   [遞增和遞減運算子](#increment-and-decrement-operators)

#### 區域變數和更多範圍

以前，如果變數在 `if` 條件中被評估為非 `null`，則該變數將進行智慧型轉型。
有關此變數的資訊將在 `if` 區塊的範圍內進一步共享。

但是，如果您在 `if` 條件 **之外** 宣告變數，則 `if` 條件中將沒有有關該變數的資訊，因此無法進行智慧型轉型。這種行為也出現在 `when` 表達式和 `while` 迴圈中。

從 Kotlin 2.0.0 開始，如果您在使用 `if`、`when` 或 `while` 條件之前宣告變數，那麼編譯器收集到的任何有關該變數的資訊都將在相應的區塊中可用於智慧型轉型。

當您想將布林條件提取到變數中時，這會很有用。然後，您可以為變數賦予有意義的名稱，這將提高您的程式碼可讀性，並使其在程式碼中可以重複使用。例如：

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
        // 有關 isCat 的資訊，因此它知道
        // animal 已智慧型轉型為 Cat 類型。
        // 因此，可以呼叫 purr() 函式。
        // 在 Kotlin 1.9.20 中，編譯器不知道
        // 智慧型轉型，因此呼叫 purr()
        // 函式會觸發錯誤。
        animal.purr()
    }
}

fun main() {
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-local-variables" validate="false"}

#### 使用邏輯或運算子進行類型檢查

在 Kotlin 2.0.0 中，如果您將物件的類型檢查與 `or` 運算子 (`||`) 結合使用，則會智慧型轉型為它們最接近的共同超類型。在此變更之前，智慧型轉型始終會轉型為 `Any` 類型。

在這種情況下，您仍然必須在之後手動檢查物件類型，才能存取其任何屬性或呼叫其函式。例如：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus 被智慧型轉型為共同超類型 Status
        signalStatus.signal()
        // 在 Kotlin 2.0.0 之前，signalStatus 被智慧型轉型
        // 為 Any 類型，因此呼叫 signal() 函式會觸發
        // 未解析的引用錯誤。signal() 函式只能在
        // 另一個類型檢查後成功呼叫：

        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 共同超類型是聯集類型（[Union types](https://en.wikipedia.org/wiki/Union_type)）的 **近似值**。Kotlin 不支援聯集類型。
>
{style="note"}

#### 內聯函式

在 Kotlin 2.0.0 中，K2 編譯器對內聯函式的處理方式有所不同，
使其能夠結合其他編譯器分析來判斷智慧型轉型是否安全。

具體來說，內聯函式現在被視為具有隱式 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)
契約。這表示傳遞給內聯函式的任何 Lambda 函式都會在原地呼叫。由於 Lambda 函式在原地呼叫，編譯器知道 Lambda 函式不會洩漏其函式主體中包含的任何變數的引用。

編譯器將此知識與其他編譯器分析結合使用，以決定智慧型轉型任何捕獲的變數是否安全。例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 在 Kotlin 2.0.0 中，編譯器知道 processor
        // 是一個區域變數，inlineAction() 是一個內聯函式，因此
        // processor 的引用不會被洩漏。因此，智慧型轉型
        // processor 是安全的。

        // 如果 processor 不為 null，則 processor 會被智慧型轉型
        if (processor != null) {
            // 編譯器知道 processor 不為 null，因此不需要安全呼叫
            processor.process()

            // 在 Kotlin 1.9.20 中，您必須執行安全呼叫：
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 具函式類型的屬性

在舊版 Kotlin 中，存在一個錯誤，導致具函式類型的類別屬性無法進行智慧型轉型。
我們已在 Kotlin 2.0.0 和 K2 編譯器中修復了此行為。例如：

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // 在 Kotlin 2.0.0 中，如果 provider 不為 null，則
        // provider 會進行智慧型轉型
        if (provider != null) {
            // 編譯器知道 provider 不為 null
            provider()

            // 在 1.9.20 中，編譯器不知道 provider 不為
            // null，因此它會觸發錯誤：
            // Reference has a nullable type '(() -> Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

此變更也適用於您重載 `invoke` 運算子的情況。例如：

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () -> String

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

在 Kotlin 2.0.0 中，我們改進了例外處理，以便智慧型轉型資訊可以傳遞給 `catch`
和 `finally` 區塊。此變更使您的程式碼更安全，因為編譯器會追蹤您的物件是否為可空類型。例如：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput 被智慧型轉型為 String 類型
    stringInput = ""
    try {
        // 編譯器知道 stringInput 不為 null
        println(stringInput.length)
        // 0

        // 編譯器拒絕了 stringInput 之前的智慧型轉型資訊。
        // 現在 stringInput 的類型為 String?。
        stringInput = null

        // 觸發例外
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 在 Kotlin 2.0.0 中，編譯器知道 stringInput
        // 可以為 null，因此 stringInput 保持可空。
        println(stringInput?.length)
        // null

        // 在 Kotlin 1.9.20 中，編譯器說不需要安全呼叫，
        // 但這是不正確的。
    }
}

//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### 遞增和遞減運算子

在 Kotlin 2.0.0 之前，編譯器不了解物件類型在使用遞增或遞減運算子後可能會改變。由於編譯器無法準確追蹤物件類型，您的程式碼可能導致未解析的引用錯誤。在 Kotlin 2.0.0 中，此問題已解決：

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

    // 檢查 unknownObject 是否繼承自 Tau 介面
    // 注意，unknownObject 可能同時繼承自 Rho 和 Tau 介面。
    if (unknownObject is Tau) {

        // 使用來自 Rho 介面的重載 inc() 運算子。
        // 在 Kotlin 2.0.0 中，unknownObject 的類型被智慧型轉型為
        // Sigma。
        ++unknownObject

        // 在 Kotlin 2.0.0 中，編譯器知道 unknownObject 的類型是
        // Sigma，因此 sigma() 函式可以成功呼叫。
        unknownObject.sigma()

        // 在 Kotlin 1.9.20 中，inc() 被呼叫時編譯器不會執行智慧型轉型，
        // 因此編譯器仍然認為 unknownObject 的類型是 Tau。
        // 呼叫 sigma() 函式會拋出編譯時錯誤。

        // 在 Kotlin 2.0.0 中，編譯器知道 unknownObject 的類型是
        // Sigma，因此呼叫 tau() 函式會拋出編譯時錯誤。
        unknownObject.tau()
        // Unresolved reference 'tau'

        // 在 Kotlin 1.9.20 中，由於編譯器錯誤地認為
        // unknownObject 的類型是 Tau，tau() 函式可以被呼叫，
        // 但會拋出 ClassCastException。
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin 多平台改進

在 Kotlin 2.0.0 中，我們在 K2 編譯器中對 Kotlin 多平台進行了以下改進：

*   [編譯期間共同和平台原始碼的分離](#separation-of-common-and-platform-sources-during-compilation)
*   [期望和實際宣告的不同可見性級別](#different-visibility-levels-of-expected-and-actual-declarations)

#### 編譯期間共同和平台原始碼的分離

以前，Kotlin 編譯器的設計使其無法在編譯時將共同原始碼集和平台原始碼集分離。因此，共同程式碼可以存取平台程式碼，這導致了平台之間的行為差異。此外，一些編譯器設定和來自共同程式碼的依賴項過去會洩漏到平台程式碼中。

在 Kotlin 2.0.0 中，我們在新的 Kotlin K2 編譯器實作中重新設計了編譯方案，以確保共同原始碼集和平台原始碼集之間嚴格分離。當您使用 [期望和實際函式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-functions) 時，此變更最為顯著。以前，在您的共同程式碼中呼叫函式可能會解析為平台程式碼中的函式。例如：

<table>
   <tr>
       <td>共同程式碼</td>
       <td>平台程式碼</td>
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
// JavaScript 平台沒有 foo() 函式重載
```

</td>
</tr>
</table>

在此範例中，共同程式碼的行為因其運行的平台而異：

*   在 JVM 平台，在共同程式碼中呼叫 `foo()` 函式會導致平台程式碼中的 `foo()` 函式被呼叫為 `platform foo`。
*   在 JavaScript 平台，在共同程式碼中呼叫 `foo()` 函式會導致共同程式碼中的 `foo()` 函式被呼叫為 `common foo`，因為平台程式碼中沒有此類函式可用。

在 Kotlin 2.0.0 中，共同程式碼無法存取平台程式碼，因此兩個平台都成功將 `foo()` 函式解析為共同程式碼中的 `foo()` 函式：`common foo`。

除了提高跨平台行為的一致性之外，我們還努力修復了 IntelliJ IDEA 或 Android Studio 與編譯器之間行為衝突的情況。例如，當您使用 [期望和實際類別](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-classes) 時，會發生以下情況：

<table>
   <tr>
       <td>共同程式碼</td>
       <td>平台程式碼</td>
   </tr>
   <tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // 2.0.0 之前，
    // 它會觸發僅限 IDE 的錯誤
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : Expected class
    // Identity has no default constructor.
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

在此範例中，期望類別 `Identity` 沒有預設建構子，因此無法在共同程式碼中成功呼叫。
以前，錯誤只由 IDE 報告，但程式碼在 JVM 上仍然成功編譯。然而，現在編譯器正確地報告了錯誤：

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 何時解析行為不變

我們仍在遷移到新的編譯方案，因此當您呼叫不在相同原始碼集內的函式時，解析行為仍然相同。您主要會在共同程式碼中使用多平台函式庫的重載時注意到此差異。

假設您有一個函式庫，它有兩個 `whichFun()` 函式，具有不同的簽名：

```kotlin
// 範例函式庫

// MODULE: common
fun whichFun(x: Any) = println("common function")

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

如果您在共同程式碼中呼叫 `whichFun()` 函式，則會解析函式庫中具有最相關引數類型的函式：

```kotlin
// 使用 JVM 目標的範例函式庫的專案

// MODULE: common
fun main() {
    whichFun(2)
    // platform function
}
```

相比之下，如果您在相同原始碼集中宣告 `whichFun()` 的重載，則會解析共同程式碼中的函式，因為您的程式碼無法存取平台特定版本：

```kotlin
// 未使用範例函式庫

// MODULE: common
fun whichFun(x: Any) = println("common function")

fun main() {
    whichFun(2)
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

與多平台函式庫類似，由於 `commonTest` 模組位於單獨的原始碼集，它仍然可以存取平台特定程式碼。因此，`commonTest` 模組中函式呼叫的解析表現出與舊編譯方案相同的行為。

將來，這些剩餘的案例將與新的編譯方案更加一致。

#### 期望和實際宣告的不同可見性級別

在 Kotlin 2.0.0 之前，如果您在 Kotlin 多平台專案中使用 [期望和實際宣告](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)，它們必須具有相同的 [可見性級別](visibility-modifiers.md)。
Kotlin 2.0.0 現在也支援不同的可見性級別，但 **僅限於** 實際宣告比期望宣告 _更寬鬆_ 的情況。例如：

```kotlin
expect internal class Attribute // 可見性為 internal
actual class Attribute          // 可見性預設為 public，
                                // 這更寬鬆
```

同樣，如果您在實際宣告中使用 [類型別名](type-aliases.md)，則 **基礎類型** 的可見性應與期望宣告相同或更寬鬆。例如：

```kotlin
expect internal class Attribute                 // 可見性為 internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 可見性預設為 public，
                                                // 這更寬鬆
```

### 編譯器外掛程式支援

目前，Kotlin K2 編譯器支援以下 Kotlin 編譯器外掛程式：

*   [`all-open`](all-open-plugin.md)
*   [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
*   [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
*   [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
*   [kapt](whatsnew1920.md#preview-kapt-compiler-plugin-with-k2)
*   [Lombok](lombok.md)
*   [`no-arg`](no-arg-plugin.md)
*   [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
*   [SAM with receiver](sam-with-receiver-plugin.md)
*   [serialization](serialization.md)
*   [Power-assert](power-assert.md)

此外，Kotlin K2 編譯器還支援：

*   [Jetpack Compose](https://developer.android.com/jetpack/compose) 編譯器外掛程式 2.0.0，該外掛程式已 [移入 Kotlin 儲存庫](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)。
*   [Kotlin Symbol Processing (KSP) 外掛程式](ksp-overview.md) 自 [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 起。

> 如果您使用任何額外的編譯器外掛程式，請檢查其文件以確定它們是否與 K2 相容。
>
{style="tip"}

### 實驗性 Kotlin Power-assert 編譯器外掛程式

> Kotlin Power-assert 外掛程式是 [實驗性](components-stability.md#stability-levels-explained) 功能。
> 它可能隨時更改。
>
{style="warning"}

Kotlin 2.0.0 引入了一個實驗性 Power-assert 編譯器外掛程式。此外掛程式透過在失敗訊息中包含上下文資訊來改善測試編寫體驗，從而使除錯更容易、更有效率。

開發人員通常需要使用複雜的斷言函式庫來編寫有效的測試。Power-assert 外掛程式透過自動生成包含斷言表達式中間值的失敗訊息來簡化此過程。這有助於開發人員快速了解測試失敗的原因。

當測試中的斷言失敗時，改進的錯誤訊息會顯示斷言中所有變數和子表達式的值，從而清楚地表明是條件的哪一部分導致了失敗。這對於檢查多個條件的複雜斷言特別有用。

要在您的專案中啟用此外掛程式，請在您的 `build.gradle(.kts)` 檔案中配置它：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "2.0.0"
    kotlin("plugin.power-assert") version "2.0.0"
}

powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.0.0'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '2.0.0'
}

powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue"]
}
```

</tab>
</tabs>

在 [文件](power-assert.md) 中了解有關 Kotlin Power-assert 外掛程式的更多資訊。

### 如何啟用 Kotlin K2 編譯器

從 Kotlin 2.0.0 開始，Kotlin K2 編譯器預設啟用。無需額外操作。

### 在 Kotlin Playground 中試用 Kotlin K2 編譯器

Kotlin Playground 支援 2.0.0 版本。 [查看！](https://pl.kotl.in/czuoQprce)

### IDE 支援

預設情況下，IntelliJ IDEA 和 Android Studio 仍然使用以前的編譯器進行程式碼分析、程式碼補齊、語法高亮和其他 IDE 相關功能。要在您的 IDE 中獲得完整的 Kotlin 2.0 體驗，請啟用 K2 模式。

在您的 IDE 中，前往 **設定** | **語言與框架** | **Kotlin**，然後選擇 **啟用 K2 模式** 選項。
IDE 將使用其 K2 模式分析您的程式碼。

![啟用 K2 模式](k2-mode.png){width=200}

啟用 K2 模式後，由於編譯器行為的變更，您可能會注意到 IDE 分析的差異。在我們的 [遷移指南](k2-compiler-migration-guide.md) 中了解新 K2 編譯器與舊編譯器的差異。

*   在 [我們的部落格](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/) 中了解有關 K2 模式的更多資訊。
*   我們正在積極收集有關 K2 模式的回饋，因此請在我們的 [公開 Slack 頻道](https://kotlinlang.slack.com/archives/C0B8H786P) 中分享您的想法。

### 留下您對新 K2 編譯器的回饋

我們將不勝感激您提供的任何回饋！

*   在我們的 [問題追蹤器](https://kotl.in/issue) 中報告您在使用新 K2 編譯器時遇到的任何問題。
*   [啟用「發送使用情況統計」選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以允許 JetBrains 收集有關 K2 使用情況的匿名數據。

## Kotlin/JVM

從 2.0.0 版本開始，編譯器可以生成包含 Java 22 位元碼的類別。
此版本還帶來以下變更：

*   [使用 invokedynamic 生成 Lambda 函式](#generation-of-lambda-functions-using-invokedynamic)
*   [kotlinx-metadata-jvm 函式庫現已穩定](#the-kotlinx-metadata-jvm-library-is-stable)

### 使用 invokedynamic 生成 Lambda 函式

Kotlin 2.0.0 引入了一種使用 `invokedynamic` 生成 Lambda 函式的新預設方法。此變更與傳統的匿名類別生成相比，減少了應用程式的二進位檔案大小。

從第一個版本開始，Kotlin 就將 Lambda 生成為匿名類別。然而，從 [Kotlin 1.5.0](whatsnew15.md#lambdas-via-invokedynamic) 開始，
`invokedynamic` 生成的選項已可透過使用 `-Xlambdas=indy` 編譯器選項提供。在 Kotlin
2.0.0 中，`invokedynamic` 已成為 Lambda 生成的預設方法。此方法產生更輕量級的二進位檔案，並使 Kotlin 與 JVM 優化保持一致，確保應用程式受益於 JVM 效能的持續和未來改進。

目前，與普通 Lambda 編譯相比，它有三個限制：

*   編譯成 `invokedynamic` 的 Lambda 不可序列化。
*   實驗性 [`reflect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API 不支援由 `invokedynamic` 生成的 Lambda。
*   在此類 Lambda 上呼叫 `.toString()` 會產生可讀性較差的字串表示：

```kotlin
fun main() {
    println({})

    // 使用 Kotlin 1.9.24 和反射，返回
    // () -> kotlin.Unit
    
    // 使用 Kotlin 2.0.0，返回
    // FileKt$Lambda$13/0x00007f88a0004608@506e1b77
}
```

為了保留生成 Lambda 函式的傳統行為，您可以：

*   使用 `@JvmSerializableLambda` 標註特定 Lambda。
*   使用編譯器選項 `-Xlambdas=class` 以使用傳統方法在模組中生成所有 Lambda。

### kotlinx-metadata-jvm 函式庫已穩定

在 Kotlin 2.0.0 中，`kotlinx-metadata-jvm` 函式庫已變得 [穩定](components-stability.md#stability-levels-explained)。現在該函式庫已更改為 `kotlin` 套件和座標，您可以將其找到為 `kotlin-metadata-jvm` (沒有「x」)。

以前，`kotlinx-metadata-jvm` 函式庫有自己的發佈方案和版本。現在，我們將作為 Kotlin 發佈週期的一部分建置和發佈 `kotlin-metadata-jvm` 更新，並與 Kotlin 標準函式庫具有相同的向後相容性保證。

`kotlin-metadata-jvm` 函式庫提供一個 API，用於讀取和修改由 Kotlin/JVM 編譯器生成的二進位檔案的中繼資料。

<!-- Learn more about the `kotlinx-metadata-jvm` library in the [documentation](kotlin-metadata-jvm.md). -->

## Kotlin/Native

此版本帶來以下變更：

*   [使用標記監控 GC 效能](#monitoring-gc-performance-with-signposts-on-apple-platforms)
*   [解決與 Objective-C 方法的衝突](#resolving-conflicts-with-objective-c-methods)
*   [Kotlin/Native 中編譯器引數的日誌級別已更改](#changed-log-level-for-compiler-arguments)
*   [明確新增標準函式庫和平台依賴項至 Kotlin/Native](#explicitly-added-standard-library-and-platform-dependencies-to-kotlin-native)
*   [Gradle 配置快取中的任務錯誤](#tasks-error-in-gradle-configuration-cache)

### 使用 Apple 平台上的標記監控 GC 效能

以前，只能透過查看日誌來監控 Kotlin/Native 的垃圾收集器 (GC) 效能。然而，這些日誌並未與 Xcode Instruments 整合，Xcode Instruments 是用於調查 iOS 應用程式效能問題的常用工具包。

自 Kotlin 2.0.0 起，GC 會使用 Instruments 中可用的標記報告暫停。標記允許在您的應用程式內進行自訂日誌記錄，因此現在，在除錯 iOS 應用程式效能時，您可以檢查 GC 暫停是否與應用程式凍結相對應。

在 [文件](native-memory-manager.md#monitor-gc-performance) 中了解有關 GC 效能分析的更多資訊。

### 解決與 Objective-C 方法的衝突

Objective-C 方法可以有不同的名稱，但參數的數量和類型相同。例如，
[`locationManager:didEnterRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423560-locationmanager?language=objc)
和 [`locationManager:didExitRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423630-locationmanager?language=objc)。
在 Kotlin 中，這些方法具有相同的簽名，因此嘗試使用它們會觸發衝突的重載錯誤。

以前，您必須手動抑制衝突的重載以避免此編譯錯誤。為了改進 Kotlin 與 Objective-C 的互通性，Kotlin 2.0.0 引入了新的 `@ObjCSignatureOverride` 註解。

此註解指示 Kotlin 編譯器忽略衝突的重載，以防多個具有相同引數類型但引數名稱不同的函式從 Objective-C 類別繼承而來。

應用此註解也比一般錯誤抑制更安全。此註解只能用於覆寫 Objective-C 方法的情況，這些方法已受支援並經過測試，而一般抑制可能會隱藏重要錯誤並導致程式碼悄然損壞。

### Kotlin/Native 中編譯器引數的日誌級別已更改

在此版本中，Kotlin/Native Gradle 任務（例如 `compile`、`link` 和 `cinterop`）中編譯器引數的日誌級別已從 `info` 更改為 `debug`。

預設值為 `debug`，日誌級別與其他 Gradle 編譯任務一致，並提供詳細的除錯資訊，包括所有編譯器引數。

### 明確新增標準函式庫和平台依賴項至 Kotlin/Native

以前，Kotlin/Native 編譯器會隱式解析標準函式庫和平台依賴項，這導致 Kotlin Gradle 外掛程式在 Kotlin 目標之間的工作方式不一致。

現在，每個 Kotlin/Native Gradle 編譯都透過 `compileDependencyFiles` [編譯參數](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compilation-parameters)
明確地將標準函式庫和平台依賴項包含在其編譯時函式庫路徑中。

### Gradle 配置快取中的任務錯誤

從 Kotlin 2.0.0 開始，您可能會遇到配置快取錯誤，訊息指示：
`invocation of Task.project at execution time is unsupported`。

此錯誤出現在 `NativeDistributionCommonizerTask` 和 `KotlinNativeCompile` 等任務中。

然而，這是一個誤報錯誤。根本問題是存在與 Gradle 配置快取不相容的任務，例如 `publish*` 任務。

這種差異可能不會立即顯現，因為錯誤訊息暗示了不同的根本原因。

由於錯誤報告中沒有明確說明精確原因，[Gradle 團隊已經在解決該問題以修復報告](https://github.com/gradle/gradle/issues/21290)。

## Kotlin/Wasm

Kotlin 2.0.0 提高了與 JavaScript 的效能和互通性：

*   [預設使用 Binaryen 優化生產建置](#optimized-production-builds-by-default-using-binaryen)
*   [支援命名匯出](#support-for-named-export)
*   [@JsExport 函式中對無符號基本類型的支援](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
*   [Kotlin/Wasm 中 TypeScript 宣告檔案的生成](#generation-of-typescript-declaration-files-in-kotlin-wasm)
*   [支援捕獲 JavaScript 例外](#support-for-catching-javascript-exceptions)
*   [新的例外處理提案現已作為選項支援](#new-exception-handling-proposal-is-now-supported-as-an-option)
*   [`withWasm()` 函式已分為 JS 和 WASI 變體](#the-withwasm-function-is-split-into-js-and-wasi-variants)

### 預設使用 Binaryen 優化生產建置

Kotlin/Wasm 工具鏈現在在生產編譯期間對所有專案應用 [Binaryen](https://github.com/WebAssembly/binaryen) 工具，
而不是以前的手動設定方法。根據我們的估計，它應該可以提高專案的執行時效能並減小二進位檔案大小。

> 此變更僅影響生產編譯。開發編譯流程保持不變。
>
{style="note"}

### 支援命名匯出

以前，所有從 Kotlin/Wasm 匯出的宣告都使用預設匯出匯入到 JavaScript 中：

```javascript
//JavaScript:
import Module from "./index.mjs"

Module.add()
```

現在，您可以按名稱匯入每個標註有 `@JsExport` 的 Kotlin 宣告：

```kotlin
// Kotlin:
@JsExport
fun add(a: Int, b: Int) = a + b
```

```javascript
//JavaScript:
import { add } from "./index.mjs"
```

命名匯出使 Kotlin 和 JavaScript 模組之間共用程式碼變得更容易。它們提高了可讀性，並有助於管理模組之間的依賴項。

### @JsExport 函式中對無符號基本類型的支援

從 Kotlin 2.0.0 開始，您可以在外部宣告和帶有 `@JsExport` 註解的函式內部使用 [無符號基本類型](unsigned-integer-types.md)，這使得 Kotlin/Wasm 函式在 JavaScript 程式碼中可用。

這有助於緩解以前的限制，即阻止 [無符號基本類型](unsigned-integer-types.md) 直接在匯出和外部宣告中使用。現在您可以匯出帶有無符號基本類型作為返回或參數類型的函式，並使用返回或使用無符號基本類型的外部宣告。

有關 Kotlin/Wasm 與 JavaScript 互通性的更多資訊，請參閱 [文件](wasm-js-interop.md#use-javascript-code-in-kotlin)。

### Kotlin/Wasm 中 TypeScript 宣告檔案的生成

> 在 Kotlin/Wasm 中生成 TypeScript 宣告檔案是 [實驗性](components-stability.md#stability-levels-explained) 功能。
> 它可能隨時刪除或更改。
>
{style="warning"}

在 Kotlin 2.0.0 中，Kotlin/Wasm 編譯器現在能夠從您的 Kotlin 程式碼中的任何 `@JsExport` 宣告生成 TypeScript 定義。這些定義可用於 IDE 和 JavaScript 工具，以提供程式碼自動補齊、協助類型檢查，並使在 JavaScript 中包含 Kotlin 程式碼更容易。

Kotlin/Wasm 編譯器會收集任何標註有 `@JsExport` 的 [頂層函式](wasm-js-interop.md#functions-with-the-jsexport-annotation)，並自動在 `.d.ts` 檔案中生成 TypeScript 定義。

要生成 TypeScript 定義，在您的 `build.gradle(.kts)` 檔案中的 `wasmJs {}` 區塊中，添加 `generateTypeScriptDefinitions()` 函式：

```kotlin
kotlin {
    wasmJs {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

### 支援捕獲 JavaScript 例外

以前，Kotlin/Wasm 程式碼無法捕獲 JavaScript 例外，這使得難以處理源自程式 JavaScript 端的錯誤。

在 Kotlin 2.0.0 中，我們實作了在 Kotlin/Wasm 中捕獲 JavaScript 例外的支援。此實作允許您使用 `try-catch` 區塊，以及 `Throwable` 或 `JsException` 等特定類型，以正確處理這些錯誤。

此外，`finally` 區塊（無論是否拋出例外都可幫助執行程式碼）也能正常工作。雖然我們引入了捕獲 JavaScript 例外的支援，但當 JavaScript 例外（例如呼叫堆疊）發生時，不提供額外資訊。然而，[我們正在開發這些實作](https://youtrack.jetbrains.com/issue/KT-68185/WasmJs-Attach-js-exception-object-to-JsException)。

### 新的例外處理提案現已作為選項支援

在此版本中，我們引入了在 Kotlin/Wasm 中對 WebAssembly [例外處理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md) 新版本的支援。

此更新確保新提案符合 Kotlin 要求，使得 Kotlin/Wasm 可以在僅支援最新版本提案的虛擬機器上使用。

透過使用 `-Xwasm-use-new-exception-proposal` 編譯器選項來啟動新的例外處理提案，該選項預設是關閉的。

### `withWasm()` 函式已分為 JS 和 WASI 變體

`withWasm()` 函式以前用於為階層模板提供 Wasm 目標，現已棄用，取而代之的是專門的 `withWasmJs()` 和 `withWasmWasi()` 函式。

現在您可以在樹狀定義中將 WASI 和 JS 目標分離到不同的組中。

## Kotlin/JS

除了其他變更之外，此版本還為 Kotlin 帶來了現代 JS 編譯，支援 ES2015 標準的更多功能：

*   [新編譯目標](#new-compilation-target)
*   [Suspend 函式作為 ES2015 產生器](#suspend-functions-as-es2015-generators)
*   [將引數傳遞給 main 函式](#passing-arguments-to-the-main-function)
*   [Kotlin/JS 專案的按檔案編譯](#per-file-compilation-for-kotlin-js-projects)
*   [改進的集合互通性](#improved-collection-interoperability)
*   [支援 createInstance()](#support-for-createinstance)
*   [支援類型安全的普通 JavaScript 物件](#support-for-type-safe-plain-javascript-objects)
*   [支援 npm 套件管理員](#support-for-npm-package-manager)
*   [編譯任務的變更](#changes-to-compilation-tasks)
*   [停止傳統 Kotlin/JS JAR Artifact](#discontinuing-legacy-kotlin-js-jar-artifacts)

### 新編譯目標

在 Kotlin 2.0.0 中，我們為 Kotlin/JS 添加了一個新的編譯目標 `es2015`。這是一種讓您一次啟用 Kotlin 中所有支援的 ES2015 功能的新方式。

您可以在 `build.gradle(.kts)` 檔案中這樣設定它：

```kotlin
kotlin {
    js {
        compilerOptions {
            target.set("es2015")
        }
    }
}
```

新目標會自動開啟 [ES 類別和模組](whatsnew19.md#experimental-support-for-es2015-classes-and-modules)
以及新支援的 [ES 產生器](#suspend-functions-as-es2015-generators)。

### Suspend 函式作為 ES2015 產生器

此版本引入了 [實驗性](components-stability.md#stability-levels-explained) 支援 ES2015 產生器，用於編譯 [Suspend 函式](composing-suspending-functions.md)。

使用產生器而非狀態機應能改善專案的最終程式碼包大小。例如，JetBrains 團隊透過使用 ES2015 產生器，成功將其 Space 專案的程式碼包大小減少了 20%。

[在官方文件](https://262.ecma-international.org/6.0/) 中了解有關 ES2015 (ECMAScript 2015, ES6) 的更多資訊。

### 將引數傳遞給 main 函式

從 Kotlin 2.0.0 開始，您可以為 `main()` 函式指定 `args` 的來源。此功能使得處理命令列和傳遞引數變得更容易。

為此，請定義 `js {}` 區塊，其中包含新的 `passAsArgumentToMainFunction()` 函式，該函式返回一個字串陣列：

```kotlin
kotlin {
    js {
        binary.executable()
        passAsArgumentToMainFunction("Deno.args")
    }
}
```

該函式在執行時執行。它接受 JavaScript 表達式並將其用作 `args: Array<String>` 引數，而不是 `main()` 函式呼叫。

此外，如果您使用 Node.js 執行時，您可以利用一個特殊別名。它允許您一次將 `process.argv` 傳遞給 `args` 參數，而不是每次都手動添加：

```kotlin
kotlin {
    js {
        binary.executable()
        nodejs {
            passProcessArgvToMainFunction()
        }
    }
}
```

### Kotlin/JS 專案的按檔案編譯

Kotlin 2.0.0 引入了 Kotlin/JS 專案輸出的一個新粒度選項。您現在可以設定按檔案編譯，為每個 Kotlin 檔案生成一個 JavaScript 檔案。這有助於顯著優化最終程式碼包的大小並改善程式的載入時間。

以前，只有兩個輸出選項。Kotlin/JS 編譯器可以為整個專案生成一個單一的 `.js` 檔案。然而，這個檔案可能太大且不便使用。每當您想要使用專案中的函式時，您都必須將整個 JavaScript 檔案作為依賴項包含進來。或者，您可以配置為每個專案模組編譯一個單獨的 `.js` 檔案。這仍然是預設選項。

由於模組檔案也可能太大，在 Kotlin 2.0.0 中，我們添加了更細粒度的輸出，為每個 Kotlin 檔案生成一個（如果檔案包含匯出宣告則為兩個）JavaScript 檔案。要啟用按檔案編譯模式：

1.  將 [`useEsModules()`](whatsnew19.md#experimental-support-for-es2015-classes-and-modules) 函式添加到您的建置檔案中以支援 ECMAScript 模組：

    ```kotlin
    // build.gradle.kts
    kotlin {
        js(IR) {
            useEsModules() // 啟用 ES2015 模組
            browser()
        }
    }
    ```

    您也可以使用新的 `es2015` [編譯目標](#new-compilation-target) 來實現。

2.  應用 `-Xir-per-file` 編譯器選項或更新您的 `gradle.properties` 檔案：

    ```none
    # gradle.properties
    kotlin.js.ir.output.granularity=per-file // `per-module` 是預設值
    ```

### 改進的集合互通性

從 Kotlin 2.0.0 開始，可以將簽名中包含 Kotlin 集合類型的宣告匯出到 JavaScript（和 TypeScript）。這適用於 `Set`、`Map` 和 `List` 集合類型及其可變對應項。

要在 JavaScript 中使用 Kotlin 集合，請先使用 [`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 註解標記必要的宣告：

```kotlin
// Kotlin
@JsExport
data class User(
    val name: String,
    val friends: List<User> = emptyList()
)

@JsExport
val me = User(
    name = "Me",
    friends = listOf(User(name = "Kodee"))
)
```

然後，您可以將它們作為常規 JavaScript 陣列從 JavaScript 中使用：

```javascript
// JavaScript
import { User, me, KtList } from "my-module"

const allMyFriendNames = me.friends
    .asJsReadonlyArrayView()
    .map(x => x.name) // ['Kodee']
```

> 不幸的是，從 JavaScript 建立 Kotlin 集合仍然不可用。我們計畫在 Kotlin 2.0.20 中添加此功能。
>
{style="note"}

### 支援 createInstance()

從 Kotlin 2.0.0 開始，您可以從 Kotlin/JS 目標使用 [`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html) 函式。以前，它僅在 JVM 上可用。

這個來自 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 介面的函式會建立指定類別的新實例，這對於獲取 Kotlin 類別的執行時引用非常有用。

### 支援類型安全的普通 JavaScript 物件

> `js-plain-objects` 外掛程式是 [實驗性](components-stability.md#stability-levels-explained) 功能。
> 它可能隨時刪除或更改。`js-plain-objects` 外掛程式 **僅** 支援 K2 編譯器。
>
{style="warning"}

為了讓使用 JavaScript API 更容易，在 Kotlin 2.0.0 中，我們提供了一個新外掛程式：[`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)，
您可以使用它來建立類型安全的普通 JavaScript 物件。此外掛程式會檢查您的程式碼中是否有任何帶有 `@JsPlainObject` 註解的 [外部介面](wasm-js-interop.md#external-interfaces)，並添加：

*   伴生物件內部的一個內聯 `invoke` 運算子函式，您可以將其用作建構子。
*   一個 `.copy()` 函式，您可以使用它來建立物件的副本，同時調整其某些屬性。

例如：

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface User {
    var name: String
    val age: Int
    val email: String?
}

fun main() {
    // 建立一個 JavaScript 物件
    val user = User(name = "Name", age = 10)
    // 複製物件並添加電子郵件
    val copy = user.copy(age = 11, email = "some@user.com")

    println(JSON.stringify(user))
    // { "name": "Name", "age": 10 }
    println(JSON.stringify(copy))
    // { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

使用這種方法建立的任何 JavaScript 物件都更安全，因為您不再只在執行時看到錯誤，
而可以在編譯時甚至由您的 IDE 標示出來。

考慮這個範例，它使用 `fetch()` 函式與 JavaScript API 交互，使用外部介面來描述 JavaScript 物件的形狀：

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface FetchOptions {
    val body: String?
    val method: String
}

// Window.fetch 的包裝器
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// 由於「metod」無法識別為方法，觸發編譯時錯誤
fetch("https://google.com", options = FetchOptions(metod = "POST"))
// 由於方法是必需的，觸發編譯時錯誤
fetch("https://google.com", options = FetchOptions(body = "SOME STRING")) 
```

相比之下，如果您改用 `js()` 函式來建立 JavaScript 物件，
錯誤只會在執行時找到或根本不會觸發：

```kotlin
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// 未觸發錯誤。由於「metod」無法識別，使用了錯誤的方法
// (GET)。
fetch("https://google.com", options = js("{ metod: 'POST' }"))

// 預設情況下，使用 GET 方法。由於不應該存在 body，觸發執行時錯誤。
fetch("https://google.com", options = js("{ body: 'SOME STRING' }"))
// TypeError: Window.fetch: HEAD or GET Request cannot have a body
```

要使用 `js-plain-objects` 外掛程式，請將以下內容添加到您的 `build.gradle(.kts)` 檔案中：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.js-plain-objects") version "2.0.0"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.js-plain-objects" version "2.0.0"
}
```

</tab>
</tabs>

### 支援 npm 套件管理員

以前，Kotlin 多平台 Gradle 外掛程式只能使用 [Yarn](https://yarnpkg.com/lang/en/)
作為套件管理員來下載和安裝 npm 依賴項。從 Kotlin 2.0.0 開始，您可以使用 [npm](https://www.npmjs.com/)
作為您的套件管理員。使用 npm 作為套件管理員意味著您在設定期間需要管理的工具少了一個。

為了向後相容性，Yarn 仍然是預設的套件管理員。要使用 npm 作為您的套件管理員，
請在您的 `gradle.properties` 檔案中設定以下屬性：

```none
kotlin.js.yarn = false
```

### 編譯任務的變更

以前，`webpack` 和 `distributeResources` 編譯任務都針對相同的目錄。此外，
`distribution` 任務也將 `dist` 聲明為其輸出目錄。這導致了輸出重疊並產生編譯警告。

因此，從 Kotlin 2.0.0 開始，我們實作了以下變更：

*   `webpack` 任務現在針對一個單獨的資料夾。
*   `distributeResources` 任務已完全移除。
*   `distribution` 任務現在具有 `Copy` 類型並針對 `dist` 資料夾。

### 停止傳統 Kotlin/JS JAR Artifact

從 Kotlin 2.0.0 開始，Kotlin 發佈不再包含帶有 `.jar` 副檔名的傳統 Kotlin/JS Artifact。傳統 Artifact 用於不受支援的舊 Kotlin/JS 編譯器，對於使用 `klib` 格式的 IR 編譯器來說是不必要的。

## Gradle 改進

Kotlin 2.0.0 完全相容於 Gradle 6.8.3 到 8.5。您也可以使用最新的 Gradle 版本，但如果您這樣做，請記住您可能會遇到棄用警告或某些新的 Gradle 功能可能無法運作。

此版本帶來以下變更：

*   [多平台專案中編譯器選項的新 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
*   [新的 Compose 編譯器 Gradle 外掛程式](#new-compose-compiler-gradle-plugin)
*   [區分 JVM 和 Android 發佈函式庫的新屬性](#new-attribute-to-distinguish-jvm-and-android-published-libraries)
*   [改進的 Kotlin/Native 中 CInteropProcess 的 Gradle 依賴處理](#improved-gradle-dependency-handling-for-cinteropprocess-in-kotlin-native)
*   [Gradle 中的可見性變更](#visibility-changes-in-gradle)
*   [Gradle 專案中 Kotlin 資料的新目錄](#new-directory-for-kotlin-data-in-gradle-projects)
*   [Kotlin/Native 編譯器按需下載](#kotlin-native-compiler-downloaded-when-needed)
*   [棄用舊的定義編譯器選項方法](#deprecated-old-ways-of-defining-compiler-options)
*   [提高最低支援的 AGP 版本](#bumped-minimum-supported-agp-version)
*   [用於嘗試最新語言版本的新 Gradle 屬性](#new-gradle-property-for-trying-the-latest-language-version)
*   [建置報告的新 JSON 輸出格式](#new-json-output-format-for-build-reports)
*   [kapt 配置繼承超級配置中的註解處理器](#kapt-configurations-inherit-annotation-processors-from-superconfigurations)
*   [Kotlin Gradle 外掛程式不再使用棄用的 Gradle 慣例](#kotlin-gradle-plugin-no-longer-uses-deprecated-gradle-conventions)

### 多平台專案中編譯器選項的新 Gradle DSL

> 此功能是 [實驗性](components-stability.md#stability-levels-explained) 功能。它可能隨時刪除或更改。
> 僅用於評估目的。我們將不勝感激您在 [YouTrack](https://kotl.in/issue) 中提供的回饋。
>
{style="warning"}

在 Kotlin 2.0.0 之前，在 Gradle 的多平台專案中配置編譯器選項只能在低層級進行，例如按任務、編譯或原始碼集。為了使在專案中更通用地配置編譯器選項變得更容易，Kotlin 2.0.0 帶有新的 Gradle DSL。

有了這個新的 DSL，您可以在擴充層級為所有目標和共享原始碼集（如 `commonMain`）以及在目標層級為特定目標配置編譯器選項：

```kotlin
kotlin {
    compilerOptions {
        // 擴充層級的共同編譯器選項，用作
        // 所有目標和共享原始碼集的預設值
        allWarningsAsErrors.set(true)
    }
    jvm {
        compilerOptions {
            // 目標層級的 JVM 編譯器選項，用作
            // 此目標中所有編譯的預設值
            noJdk.set(true)
        }
    }
}
```

整個專案配置現在有三個層次。最高的是擴充層級，其次是目標層級，最低的是編譯單元（通常是編譯任務）：

![Kotlin 編譯器選項層次](compiler-options-levels.svg){width=700}

較高層級的設定用作較低層級的慣例（預設值）：

*   擴充編譯器選項的值是目標編譯器選項的預設值，包括共享原始碼集，例如 `commonMain`、`nativeMain` 和 `commonTest`。
*   目標編譯器選項的值用作編譯單元（任務）編譯器選項的預設值，例如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任務。

反過來，在較低層級進行的配置會覆寫較高層級的相關設定：

*   任務層級的編譯器選項會覆寫目標或擴充層級的相關配置。
*   目標層級的編譯器選項會覆寫擴充層級的相關配置。

配置專案時，請記住一些舊的設定編譯器選項方法已 [棄用](#deprecated-old-ways-of-defining-compiler-options)。

我們鼓勵您在多平台專案中嘗試新的 DSL 並在 [YouTrack](https://kotl.in/issue) 中留下回饋，因為我們計畫將此 DSL 作為配置編譯器選項的推薦方法。

### 新的 Compose 編譯器 Gradle 外掛程式

Jetpack Compose 編譯器（將可組合項轉換為 Kotlin 程式碼）現已合併到 Kotlin 儲存庫中。這將有助於將 Compose 專案轉換為 Kotlin 2.0.0，因為 Compose 編譯器將始終與 Kotlin 同步發佈。這也將 Compose 編譯器版本提高到 2.0.0。

要在您的專案中使用新的 Compose 編譯器，請在您的 `build.gradle(.kts)` 檔案中套用 `org.jetbrains.kotlin.plugin.compose` Gradle 外掛程式，並將其版本設定為等於 Kotlin 2.0.0。

要了解有關此變更的更多資訊並查看遷移說明，請參閱 [Compose 編譯器](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html) 文件。

### 區分 JVM 和 Android 發佈函式庫的新屬性

從 Kotlin 2.0.0 開始，[`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes)
Gradle 屬性預設與所有 Kotlin 變體一起發佈。

此屬性有助於區分 Kotlin 多平台函式庫的 JVM 和 Android 變體。它表示某些函式庫變體更適合某些 JVM 環境。目標環境可以是「android」、「standard-jvm」或「no-jvm」。

發佈此屬性應能使 JVM 和 Android 目標的 Kotlin 多平台函式庫從非多平台客戶端（例如僅 Java 專案）消耗起來更健壯。

如有必要，您可以禁用屬性發佈。為此，請將以下 Gradle 選項添加到您的 `gradle.properties` 檔案中：

```none
kotlin.publishJvmEnvironmentAttribute=false
```

### 改進的 Kotlin/Native 中 CInteropProcess 的 Gradle 依賴處理

在此版本中，我們增強了 `defFile` 屬性的處理，以確保 Kotlin/Native 專案中更好的 Gradle 任務依賴管理。

在此更新之前，如果 `defFile` 屬性被指定為尚未執行的另一個任務的輸出，則 Gradle 建置可能會失敗。此問題的解決方法是添加對此任務的依賴項：

```kotlin
kotlin {
    macosArm64("native") {
        compilations.getByName("main") {
            cinterops {
                val cinterop by creating {
                    defFileProperty.set(createDefFileTask.flatMap { it.defFile.asFile })
                    project.tasks.named(interopProcessingTaskName).configure {
                        dependsOn(createDefFileTask)
                    }
                }
            }
        }
    }
}
```

為了解決此問題，現在有一個名為 `definitionFile` 的新 `RegularFileProperty` 屬性。現在，Gradle 在連接任務在建置過程的後期運行後，惰性驗證 `definitionFile` 屬性的存在。這種新方法消除了對額外依賴項的需求。

`CInteropProcess` 任務和 `CInteropSettings` 類別使用 `definitionFile` 屬性而不是 `defFile` 和 `defFileProperty`：

<tabs group ="build-script">
<tab id="kotlin" title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    macosArm64("native") {
        compilations.getByName("main") {
            cinterops {
                val cinterop by creating {
                    definitionFile.set(project.file("def-file.def"))
                }
            }
        }
    }
}
```

</tab>
<tab id="groovy" title="Groovy" group-key="groovy">

```groovy
kotlin {
    macosArm64("native") {
        compilations.main {
            cinterops {
                cinterop {
                    definitionFile.set(project.file("def-file.def"))
                }
            }
        }
    }
}
```

</tab>
</tabs>

> `defFile` 和 `defFileProperty` 參數已棄用。
>
{style="warning"}

### Gradle 中的可見性變更

> 此變更僅影響 Kotlin DSL 使用者。
>
{style="note"}

在 Kotlin 2.0.0 中，我們修改了 Kotlin Gradle 外掛程式，以更好地控制和安全地編寫您的建置指令碼。以前，某些旨在用於特定 DSL 上下文的 Kotlin DSL 函式和屬性會無意中洩漏到其他 DSL 上下文。這種洩漏可能導致使用不正確的編譯器選項、設定多次套用以及其他配置錯誤：

```kotlin
kotlin {
    // 目標 DSL 無法存取在
    // kotlin{} 擴充 DSL 中定義的方法和屬性
    jvm {
        // 編譯 DSL 無法存取在
        // kotlin{} 擴充 DSL 和 Kotlin jvm{} 目標 DSL 中定義的方法和屬性
        compilations.configureEach {
            // 編譯任務 DSL 無法存取在
            // kotlin{} 擴充、Kotlin jvm{} 目標或 Kotlin 編譯 DSL 中定義的方法和屬性
            compileTaskProvider.configure {
                // 例如：
                explicitApi()
                // ERROR，因為它在 kotlin{} 擴充 DSL 中定義
                mavenPublication {}
                // ERROR，因為它在 Kotlin jvm{} 目標 DSL 中定義
                defaultSourceSet {}
                // ERROR，因為它在 Kotlin 編譯 DSL 中定義
            }
        }
    }
}
```

為了解決此問題，我們添加了 `@KotlinGradlePluginDsl` 註解，防止 Kotlin Gradle 外掛程式 DSL 函式和屬性暴露到不應可用的層級。以下層級相互獨立：

*   Kotlin 擴充
*   Kotlin 目標
*   Kotlin 編譯
*   Kotlin 編譯任務

對於最常見的情況，如果您的建置指令碼配置不正確，我們已添加編譯器警告並提供如何修復它們的建議。例如：

```kotlin
kotlin {
    jvm {
        sourceSets.getByName("jvmMain").dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.7.3")
        }
    }
}
```

在這種情況下，`sourceSets` 的警告訊息是：

```none
[DEPRECATION] 'sourceSets: NamedDomainObjectContainer<KotlinSourceSet>' is deprecated.Accessing 'sourceSets' container on the Kotlin target level DSL is deprecated. Consider configuring 'sourceSets' on the Kotlin extension level.
```

我們將不勝感激您對此變更的回饋！請直接在我們的 [#gradle Slack 頻道](https://kotlinlang.slack.com/archives/C19FD9681) 中向 Kotlin 開發人員分享您的評論。[獲取 Slack 邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。

### Gradle 專案中 Kotlin 資料的新目錄

> 不要將 `.kotlin` 目錄提交到版本控制。
> 例如，如果您使用 Git，請將 `.kotlin` 添加到專案的 `.gitignore` 檔案中。
>
{style="warning"}

在 Kotlin 1.8.20 中，Kotlin Gradle 外掛程式切換到將其資料儲存在 Gradle 專案快取目錄中：`<project-root-directory>/.gradle/kotlin`。然而，`.gradle` 目錄僅保留給 Gradle，
因此它不是面向未來的。

為了解決這個問題，從 Kotlin 2.0.0 開始，我們預設會將 Kotlin 資料儲存在您的 `<project-root-directory>/.kotlin` 中。
為了向後相容性，我們將繼續將一些資料儲存在 `.gradle/kotlin` 目錄中。

您可以配置的新 Gradle 屬性是：

| Gradle 屬性                                     | 說明                                                                                                        |
|-----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | 配置儲存專案層級資料的位置。預設值：`<project-root-directory>/.kotlin`       |
| `kotlin.project.persistent.dir.gradle.disableWrite` | 控制是否禁用將 Kotlin 資料寫入 `.gradle` 目錄的布林值。預設值：`false` |

將這些屬性添加到您專案的 `gradle.properties` 檔案中，使其生效。

### Kotlin/Native 編譯器按需下載

在 Kotlin 2.0.0 之前，如果您在多平台專案的 Gradle 建置指令碼中配置了 [Kotlin/Native 目標](native-target-support.md)，Gradle 總是在 [配置階段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:configuration) 下載 Kotlin/Native 編譯器。

即使沒有任務需要在 [執行階段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution) 運行以編譯 Kotlin/Native 目標的程式碼，這種情況也會發生。以這種方式下載 Kotlin/Native 編譯器對於只想檢查專案中的 JVM 或 JavaScript 程式碼的使用者（例如，作為 CI 流程的一部分對其 Kotlin 專案執行測試或檢查）來說效率特別低。

在 Kotlin 2.0.0 中，我們在 Kotlin Gradle 外掛程式中更改了此行為，以便 Kotlin/Native
編譯器在 [執行階段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)
下載，並且 **僅當** 請求編譯 Kotlin/Native 目標時才下載。

反過來，Kotlin/Native 編譯器的依賴項現在也不再作為編譯器的一部分下載，而是在執行階段同時下載。

如果您遇到新行為的任何問題，您可以透過將以下 Gradle 屬性添加到您的 `gradle.properties` 檔案中，暫時切換回以前的行為：

```none
kotlin.native.toolchain.enabled=false
```

從 Kotlin 1.9.20-Beta 開始，Kotlin/Native 發佈版本已與 CDN 一起發佈到 [Maven Central](https://repo.maven.apache.org/maven2/org/jetbrains/kotlin/kotlin-native-prebuilt/)。

這允許我們更改 Kotlin 尋找和下載必要 Artifact 的方式。預設情況下，它現在使用您在專案的 `repositories {}` 區塊中指定的 Maven 儲存庫，而不是 CDN。

您可以透過將以下 Gradle 屬性設定到您的 `gradle.properties` 檔案中，暫時切換此行為：

```none
kotlin.native.distribution.downloadFromMaven=false
```

請將任何問題報告到我們的問題追蹤器 [YouTrack](https://kotl.in/issue)。這些更改預設行為的 Gradle 屬性都是暫時性的，並將在未來版本中移除。

### 棄用舊的定義編譯器選項方法

在此版本中，我們繼續優化您設定編譯器選項的方式。它應該能解決不同方式之間的歧義，並使專案配置更加直觀。

從 Kotlin 2.0.0 開始，以下用於指定編譯器選項的 DSL 已棄用：

*   來自實作所有 Kotlin 編譯任務的 `KotlinCompile` 介面的 `kotlinOptions` DSL。請改用 `KotlinCompilationTask<CompilerOptions>`。
*   來自 `KotlinCompilation` 介面且類型為 `HasCompilerOptions` 的 `compilerOptions` 屬性。此 DSL 與其他 DSL 不一致，並配置與 `KotlinCompilation.compileTaskProvider` 編譯任務中的 `compilerOptions` 相同的 `KotlinCommonCompilerOptions` 物件，這令人困惑。

    相反，我們建議使用 Kotlin 編譯任務中的 `compilerOptions` 屬性：

    ```kotlin
    kotlinCompilation.compileTaskProvider.configure {
        compilerOptions { ... }
    }
    ```

    例如：

    ```kotlin
    kotlin {
        js(IR) {
            compilations.all {
                compileTaskProvider.configure {
                    compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
                }
            }
        }
    }
    ```

*   來自 `KotlinCompilation` 介面的 `kotlinOptions` DSL。
*   來自 `KotlinNativeArtifactConfig` 介面、`KotlinNativeLink` 類別
    和 `KotlinNativeLinkArtifactTask` 類別的 `kotlinOptions` DSL。請改用 `toolOptions` DSL。
*   來自 `KotlinJsDce` 介面的 `dceOptions` DSL。請改用 `toolOptions` DSL。

有關如何在 Kotlin Gradle 外掛程式中指定編譯器選項的更多資訊，請參閱 [如何定義選項](gradle-compiler-options.md#how-to-define-options)。

### 提高最低支援的 AGP 版本

從 Kotlin 2.0.0 開始，最低支援的 Android Gradle 外掛程式版本為 7.1.3。

### 用於嘗試最新語言版本的新 Gradle 屬性

在 Kotlin 2.0.0 之前，我們有以下 Gradle 屬性來試用新的 K2 編譯器：`kotlin.experimental.tryK2`。
現在 K2 編譯器在 Kotlin 2.0.0 中預設啟用，我們決定將此屬性演進為一種新形式，您可以使用它在您的專案中嘗試最新的語言版本：`kotlin.experimental.tryNext`。當您在 `gradle.properties` 檔案中使用此屬性時，Kotlin Gradle 外掛程式會將語言版本增加到比您的 Kotlin 版本預設值高一級。例如，在 Kotlin 2.0.0 中，預設語言版本是 2.0，因此該屬性配置語言版本 2.1。

這個新的 Gradle 屬性在 [建置報告](gradle-compilation-and-caches.md#build-reports) 中產生與以前使用 `kotlin.experimental.tryK2` 相似的指標。配置的語言版本包含在輸出中。例如：

```none
##### 'kotlin.experimental.tryNext' results #####
:app:compileKotlin: 2.1 language version
:lib:compileKotlin: 2.1 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.1 #####
```

要了解有關如何啟用建置報告及其內容的更多資訊，請參閱 [建置報告](gradle-compilation-and-caches.md#build-reports)。

### kapt 配置繼承超級配置中的註解處理器

在 Kotlin 2.0.0 之前，如果您想在單獨的 Gradle 配置中定義一組共同的註解處理器，並在您的子專案的 kapt 特定配置中擴充此配置，kapt 將跳過註解處理，因為它找不到任何註解處理器。在 Kotlin 2.0.0 中，kapt 可以成功檢測到您的註解處理器存在間接依賴項。

例如，對於使用 [Dagger](https://dagger.dev/) 的子專案，在您的 `build.gradle(.kts)` 檔案中，使用以下配置：

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

在此範例中，`commonAnnotationProcessors` Gradle 配置是您希望用於所有專案的共同註解處理配置。您使用 [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom)
方法將 `commonAnnotationProcessors` 添加為超級配置。kapt 看到 `commonAnnotationProcessors`
Gradle 配置對 Dagger 註解處理器存在依賴項。因此，kapt 將 Dagger 註解處理器包含在其註解處理配置中。

感謝 Christoph Loy 的 [實作](https://github.com/JetBrains/kotlin/pull/5198)！

### Kotlin Gradle 外掛程式不再使用棄用的 Gradle 慣例

在 Kotlin 2.0.0 之前，如果您使用 Gradle 8.2 或更高版本，Kotlin Gradle 外掛程式錯誤地使用了在 Gradle 8.2 中已棄用的 Gradle 慣例。這導致 Gradle 報告建置棄用。在 Kotlin 2.0.0 中，Kotlin Gradle 外掛程式已更新，不再觸發這些棄用警告，當您使用 Gradle 8.2 或更高版本時。

## 標準函式庫

此版本進一步穩定 Kotlin 標準函式庫，並使更多現有函式對所有平台通用：

*   [enum 類別值泛型函式的穩定取代](#stable-replacement-of-the-enum-class-values-generic-function)
*   [穩定的 AutoCloseable 介面](#stable-autocloseable-interface)
*   [共同保護屬性 AbstractMutableList.modCount](#common-protected-property-abstractmutablelist-modcount)
*   [共同保護函式 AbstractMutableList.removeRange](#common-protected-function-abstractmutablelist-removerange)
*   [共同 String.toCharArray(destination)](#common-string-tochararray-destination-function)

### enum 類別值泛型函式的穩定取代

在 Kotlin 2.0.0 中，`enumEntries<T>()` 函式變得 [穩定](components-stability.md#stability-levels-explained)。
`enumEntries<T>()` 函式是泛型 `enumValues<T>()` 函式的取代。新函式返回給定列舉類型 `T` 的所有列舉條目列表。列舉類別的 `entries` 屬性以前已引入並穩定，以取代合成的 `values()` 函式。有關 `entries` 屬性的更多資訊，請參閱 [Kotlin 1.8.20 的新功能](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)。

> `enumValues<T>()` 函式仍然受支援，但我們建議您改用 `enumEntries<T>()` 函式，因為它對效能的影響較小。每次呼叫 `enumValues<T>()` 時，都會建立一個新陣列，而每次呼叫 `enumEntries<T>()` 時，每次都會返回相同的列表，這效率更高。
>
{style="tip"}

例如：

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>()
// RED, GREEN, BLUE
```

### 穩定的 AutoCloseable 介面

在 Kotlin 2.0.0 中，共同的 [`AutoCloseable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/)
介面變得 [穩定](components-stability.md#stability-levels-explained)。它允許您輕鬆關閉資源，並包含幾個有用的函式：

*   `use()` 擴充函式，它在選定的資源上執行給定的區塊函式，然後無論是否拋出例外，都正確關閉它。
*   `AutoCloseable()` 建構子函式，用於建立 `AutoCloseable` 介面的實例。

在下面的範例中，我們定義 `XMLWriter` 介面並假設存在實作它的資源。
例如，此資源可能是一個類別，它打開檔案，寫入 XML 內容，然後關閉它：

```kotlin
interface XMLWriter {
    fun document(encoding: String, version: String, content: XMLWriter.() -> Unit)
    fun element(name: String, content: XMLWriter.() -> Unit)
    fun attribute(name: String, value: String)
    fun text(value: String)

    fun flushAndClose()
}

fun writeBooksTo(writer: XMLWriter) {
    val autoCloseable = AutoCloseable { writer.flushAndClose() }
    autoCloseable.use {
        writer.document(encoding = "UTF-8", version = "1.0") {
            element("bookstore") {
                element("book") {
                    attribute("category", "fiction")
                    element("title") { text("Harry Potter and the Prisoner of Azkaban") }
                    element("author") { text("J. K. Rowling") }
                    element("year") { text("1999") }
                    element("price") { text("29.99") }
                }
                element("book") {
                    attribute("category", "programming")
                    element("title") { text("Kotlin in Action") }
                    element("author") { text("Dmitry Jemerov") }
                    element("author") { text("Svetlana Isakova") }
                    element("year") { text("2017") }
                    element("price") { text("25.19") }
                }
            }
        }
    }
}
```

### 共同保護屬性 AbstractMutableList.modCount

在此版本中，[`modCount`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/mod-count.html)
`protected` 屬性在 `AbstractMutableList` 介面中變為共同屬性。以前，`modCount` 屬性在每個平台上都可用，但對於共同目標則不可用。現在，您可以建立 `AbstractMutableList` 的自訂實作，並在共同程式碼中存取該屬性。

該屬性會追蹤對集合進行的結構性修改次數。這包括改變集合大小或以可能導致正在進行的迭代返回不正確結果的方式修改列表的操作。

在實作自訂列表時，您可以使用 `modCount` 屬性來註冊和檢測並發修改。

### 共同保護函式 AbstractMutableList.removeRange

在此版本中，[`removeRange()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/remove-range.html)
`protected` 函式在 `AbstractMutableList` 介面中變為共同函式。以前，它在每個平台上都可用，但對於共同目標則不可用。現在，您可以建立 `AbstractMutableList` 的自訂實作，並在共同程式碼中覆寫該函式。

該函式從此列表中移除指定範圍內的元素。透過覆寫此函式，您可以利用自訂實作並提高列表操作的效能。

### 共同 String.toCharArray(destination) 函式

此版本引入了一個共同的 [`String.toCharArray(destination)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html)
函式。以前，它僅在 JVM 上可用。

讓我們將它與現有的 [`String.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html) 函式進行比較。
它會建立一個新的 `CharArray`，其中包含指定字串的字元。然而，新的共同 `String.toCharArray(destination)`
函式會將 `String` 字元移至現有的目標 `CharArray` 中。如果您已經有一個要填充的緩衝區，這會很有用：

```kotlin
fun main() {
    val myString = "Kotlin is awesome!"
    val destinationArray = CharArray(myString.length)

    // 轉換字串並將其儲存在 destinationArray 中：
    myString.toCharArray(destinationArray)

    for (char in destinationArray) {
        print("$char ")
        // K o t l i n   i s   a w e s o m e ! 
    }
}
```
{kotlin-runnable="true"}

## 安裝 Kotlin 2.0.0

從 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛程式作為捆綁外掛程式隨您的 IDE 一起發佈。這表示您無法再從 JetBrains Marketplace 安裝此外掛程式。

要更新到新的 Kotlin 版本，請在您的建置指令碼中將 [Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version) 為 2.0.0。