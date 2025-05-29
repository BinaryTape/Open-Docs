[//]: # (title: Kotlin 2.0.0 的新功能)

[發佈日期：2024 年 5 月 21 日](releases.md#release-details)

Kotlin 2.0.0 版本已推出，且 [全新 Kotlin K2 編譯器](#kotlin-k2-compiler) 已趨穩定！此外，還有以下亮點：

*   [新的 Compose 編譯器 Gradle 外掛程式](#new-compose-compiler-gradle-plugin)
*   [使用 invokedynamic 產生 Lambda 函式](#generation-of-lambda-functions-using-invokedynamic)
*   [kotlinx-metadata-jvm 程式庫已趨穩定](#the-kotlinx-metadata-jvm-library-is-stable)
*   [在 Apple 平台使用 Signpost 監控 Kotlin/Native 中的 GC 效能](#monitoring-gc-performance-with-signposts-on-apple-platforms)
*   [解決 Kotlin/Native 與 Objective-C 方法的衝突](#resolving-conflicts-with-objective-c-methods)
*   [支援 Kotlin/Wasm 中的命名匯出](#support-for-named-export)
*   [支援 Kotlin/Wasm 中帶有 @JsExport 的函式中的無符號基本型別](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
*   [預設使用 Binaryen 優化生產建置](#optimized-production-builds-by-default-using-binaryen)
*   [多平台專案中編譯器選項的新 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
*   [enum 類別 values 泛型函式的穩定替換](#stable-replacement-of-the-enum-class-values-generic-function)
*   [穩定的 AutoCloseable 介面](#stable-autocloseable-interface)

Kotlin 2.0 是 JetBrains 團隊的一個重要里程碑。此次發佈是 KotlinConf 2024 的焦點。請觀看開幕主題演講，其中我們宣佈了令人興奮的更新並闡述了 Kotlin 語言的最新進展：

<video src="https://www.youtube.com/v/Ar73Axsz2YA" title="KotlinConf'24 - Keynote"/>

## IDE 支援

支援 Kotlin 2.0.0 的 Kotlin 外掛程式已捆綁在最新的 IntelliJ IDEA 和 Android Studio 中。您無需在 IDE 中更新 Kotlin 外掛程式。您只需在建置腳本中將 [Kotlin 版本變更](releases.md#update-to-a-new-kotlin-version) 為 Kotlin 2.0.0。

*   有關 IntelliJ IDEA 支援 Kotlin K2 編譯器的詳細資訊，請參閱 [IDE 支援](#support-in-ides)。
*   有關 IntelliJ IDEA 支援 Kotlin 的更多詳細資訊，請參閱 [Kotlin 發佈](releases.md#ide-support)。

## Kotlin K2 編譯器

K2 編譯器的歷程漫長，但現在 JetBrains 團隊終於準備好宣布其穩定化。在 Kotlin 2.0.0 中，全新的 Kotlin K2 編譯器已預設使用，並對所有目標平台（JVM、Native、Wasm 和 JS）[趨於穩定](components-stability.md)。這個新編譯器帶來了重大的效能改進，加速了新語言功能的開發，統一了 Kotlin 支援的所有平台，並為多平台專案提供了更好的架構。

JetBrains 團隊透過成功編譯選定使用者和內部專案的 1000 萬行程式碼，確保了新編譯器的品質。18,000 名開發人員參與了穩定化過程，在總計 80,000 個專案中測試了新的 K2 編譯器，並報告了他們發現的任何問題。

為了幫助將遷移到新編譯器的過程盡可能順暢，我們建立了 [K2 編譯器遷移指南](k2-compiler-migration-guide.md)。本指南解釋了編譯器的諸多優點，強調了您可能遇到的任何變更，並描述了在必要時如何回滾到先前的版本。

在 [部落格文章](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/) 中，我們探討了 K2 編譯器在不同專案中的效能。如果您想查看 K2 編譯器效能的實際資料，並找到從您自己的專案中收集效能基準的說明，請查看該文章。

您還可以觀看 KotlinConf 2024 的這場演講，其中首席語言設計師 Michail Zarečenskij 討論了 Kotlin 和 K2 編譯器的功能演進：

<video src="https://www.youtube.com/v/tAGJ5zJXJ7w" title="Kotlin Language Features in 2.0 and Beyond"/>

### 目前 K2 編譯器的限制

在您的 Gradle 專案中啟用 K2 帶有某些限制，這可能會在以下情況中影響使用 Gradle 8.3 以下版本的專案：

*   `buildSrc` 的原始碼編譯。
*   包含的建置中的 Gradle 外掛程式編譯。
*   如果其他 Gradle 外掛程式在 Gradle 8.3 以下版本的專案中使用，則它們的編譯。
*   建置 Gradle 外掛程式依賴項。

如果您遇到上述任何問題，您可以採取以下步驟解決：

*   設定 `buildSrc`、任何 Gradle 外掛程式及其依賴項的語言版本：

    ```kotlin
    kotlin {
        compilerOptions {
            languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
            apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        }
    }
    ```

    > 如果您為特定任務配置語言和 API 版本，這些值將覆蓋由 `compilerOptions` 擴充功能設定的值。在這種情況下，語言和 API 版本不應高於 1.9。
    >
    {style="note"}

*   將專案中的 Gradle 版本更新到 8.3 或更高版本。

### 智慧型轉換改進

Kotlin 編譯器可以在特定情況下自動將物件轉換為某個型別，省去了您手動明確轉換的麻煩。這稱為 [智慧型轉換 (smart casting)](typecasts.md#smart-casts)。Kotlin K2 編譯器現在在比以前更多的情境下執行智慧型轉換。

在 Kotlin 2.0.0 中，我們在以下領域對智慧型轉換進行了改進：

*   [區域變數與更廣泛的作用域](#local-variables-and-further-scopes)
*   [邏輯 OR 運算子型別檢查](#type-checks-with-logical-or-operator)
*   [內嵌函式](#inline-functions)
*   [函式型別屬性](#properties-with-function-types)
*   [例外處理](#exception-handling)
*   [遞增與遞減運算子](#increment-and-decrement-operators)

#### 區域變數與更廣泛的作用域

以前，如果變數在 `if` 條件式中被評估為非 `null`，則該變數會被智慧型轉換。然後，關於此變數的資訊將在 `if` 區塊的作用域內進一步共享。

然而，如果您在 `if` 條件式 **外部** 宣告變數，則在 `if` 條件式內將沒有關於該變數的資訊，因此無法進行智慧型轉換。這種行為也出現在 `when` 表達式和 `while` 迴圈中。

從 Kotlin 2.0.0 開始，如果您在使用變數之前在 `if`、`when` 或 `while` 條件式中宣告它，那麼編譯器收集的關於該變數的任何資訊將在相應的區塊中可存取，以進行智慧型轉換。

當您想做一些事情，例如將布林條件提取到變數中時，這會很有用。然後，您可以為變數賦予有意義的名稱，這將提高程式碼可讀性並使其能夠在程式碼中稍後重複使用。例如：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // In Kotlin 2.0.0, the compiler can access
        // information about isCat, so it knows that
        // animal was smart-cast to the type Cat.
        // Therefore, the purr() function can be called.
        // In Kotlin 1.9.20, the compiler doesn't know
        // about the smart cast, so calling the purr()
        // function triggers an error.
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

#### 邏輯 OR 運算子型別檢查

在 Kotlin 2.0.0 中，如果您使用 `or` 運算子 (`||`) 結合物件的型別檢查，會智慧型轉換為它們最接近的共同超型別。在此變更之前，智慧型轉換總是轉為 `Any` 型別。

在這種情況下，您仍然必須手動檢查物件型別，然後才能存取其任何屬性或呼叫其函式。例如：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus is smart-cast to a common supertype Status
        signalStatus.signal()
        // Prior to Kotlin 2.0.0, signalStatus is smart cast 
        // to type Any, so calling the signal() function triggered an
        // Unresolved reference error. The signal() function can only 
        // be called successfully after another type check:

        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 共同超型別是[聯合型別 (union type)](https://en.wikipedia.org/wiki/Union_type) 的近似值。Kotlin 不支援聯合型別。
>
{style="note"}

#### 內嵌函式

在 Kotlin 2.0.0 中，K2 編譯器對內嵌函式 (inline function) 的處理方式不同，使其能夠結合其他編譯器分析來判斷智慧型轉換是否安全。

具體而言，內嵌函式現在被視為具有隱式 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 契約 (contract)。這意味著傳遞給內嵌函式 (inline function) 的任何 Lambda 函式都會原地呼叫。由於 Lambda 函式會原地呼叫，編譯器知道 Lambda 函式不能洩漏對其函式體內任何變數的參照。

編譯器利用這項知識以及其他編譯器分析來決定是否安全地智慧型轉換任何捕獲的變數。例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // In Kotlin 2.0.0, the compiler knows that processor 
        // is a local variable, and inlineAction() is an inline function, so 
        // references to processor can't be leaked. Therefore, it's safe 
        // to smart-cast processor.

        // If processor isn't null, processor is smart-cast
        if (processor != null) {
            // The compiler knows that processor isn't null, so no safe call 
            // is needed
            processor.process()

            // In Kotlin 1.9.20, you have to perform a safe call:
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 函式型別屬性

在先前版本的 Kotlin 中，存在一個錯誤，即函式型別的類別屬性未被智慧型轉換。我們在 Kotlin 2.0.0 和 K2 編譯器中修復了此行為。例如：

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // In Kotlin 2.0.0, if provider isn't null, then
        // provider is smart-cast
        if (provider != null) {
            // The compiler knows that provider isn't null
            provider()

            // In 1.9.20, the compiler doesn't know that provider isn't 
            // null, so it triggers an error:
            // Reference has a nullable type '(() -> Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

此變更也適用於您重載 (overload) `invoke` 運算子的情況。例如：

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () -> String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider()
            // In 1.9.20, the compiler triggers an error: 
            // Reference has a nullable type 'Provider?' use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 例外處理

在 Kotlin 2.0.0 中，我們改進了例外處理，以便智慧型轉換資訊可以傳遞給 `catch` 和 `finally` 區塊。此變更使您的程式碼更安全，因為編譯器會追蹤您的物件是否為可空 (nullable) 型別。例如：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput is smart-cast to String type
    stringInput = ""
    try {
        // The compiler knows that stringInput isn't null
        println(stringInput.length)
        // 0

        // The compiler rejects previous smart cast information for 
        // stringInput. Now stringInput has the String? type.
        stringInput = null

        // Trigger an exception
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // In Kotlin 2.0.0, the compiler knows stringInput 
        // can be null, so stringInput stays nullable.
        println(stringInput?.length)
        // null

        // In Kotlin 1.9.20, the compiler says that a safe call isn't
        // needed, but this is incorrect.
    }
}

//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### 遞增與遞減運算子

在 Kotlin 2.0.0 之前，編譯器不理解物件型別在使用遞增或遞減運算子後可能發生變化。由於編譯器無法準確追蹤物件型別，您的程式碼可能導致無法解析的參照錯誤。在 Kotlin 2.0.0 中，這已得到修復：

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

    // Check if unknownObject inherits from the Tau interface
    // Note, it's possible that unknownObject inherits from both
    // Rho and Tau interfaces.
    if (unknownObject is Tau) {

        // Use the overloaded inc() operator from interface Rho.
        // In Kotlin 2.0.0, the type of unknownObject is smart-cast to
        // Sigma.
        ++unknownObject

        // In Kotlin 2.0.0, the compiler knows unknownObject has type
        // Sigma, so the sigma() function can be called successfully.
        unknownObject.sigma()

        // In Kotlin 1.9.20, the compiler doesn't perform a smart cast
        // when inc() is called so the compiler still thinks that 
        // unknownObject has type Tau. Calling the sigma() function 
        // throws a compile-time error.
        
        // In Kotlin 2.0.0, the compiler knows unknownObject has type
        // Sigma, so calling the tau() function throws a compile-time 
        // error.
        unknownObject.tau()
        // Unresolved reference 'tau'

        // In Kotlin 1.9.20, since the compiler mistakenly thinks that 
        // unknownObject has type Tau, the tau() function can be called,
        // but it throws a ClassCastException.
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin 多平台改進

在 Kotlin 2.0.0 中，我們改進了 K2 編譯器中與 Kotlin 多平台相關的以下領域：

*   [編譯期間通用與平台原始碼分離](#separation-of-common-and-platform-sources-during-compilation)
*   [預期 (expected) 和實際 (actual) 宣告的不同可見度層級](#different-visibility-levels-of-expected-and-actual-declarations)

#### 編譯期間通用與平台原始碼分離

以前，Kotlin 編譯器設計阻礙了它在編譯時保持通用和平台原始碼集分離。因此，通用程式碼可以存取平台程式碼，這導致了平台之間的行為差異。此外，通用程式碼中的某些編譯器設定和依賴項過去會洩漏到平台程式碼中。

在 Kotlin 2.0.0 中，我們實作了新的 Kotlin K2 編譯器，其中包含了對編譯方案的重新設計，以確保通用和平台原始碼集之間的嚴格分離。當您使用 [預期 (expected) 和實際 (actual) 函式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-functions) 時，此變更最為明顯。以前，通用程式碼中的函式呼叫可能會解析為平台程式碼中的函式。例如：

<table>
   <tr>
       <td>通用程式碼</td>
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
// There is no foo() function overload
// on the JavaScript platform
```

</td>
</tr>
</table>

在此範例中，通用程式碼的行為因其運行的平台而異：

*   在 JVM 平台，通用程式碼中呼叫 `foo()` 函式會導致呼叫平台程式碼中的 `foo()` 函式，顯示為 `platform foo`。
*   在 JavaScript 平台，通用程式碼中呼叫 `foo()` 函式會導致呼叫通用程式碼中的 `foo()` 函式，顯示為 `common foo`，因為平台程式碼中沒有此函式。

在 Kotlin 2.0.0 中，通用程式碼無法存取平台程式碼，因此兩個平台都成功地將 `foo()` 函式解析為通用程式碼中的 `foo()` 函式：`common foo`。

除了改進跨平台行為的一致性之外，我們還努力修復了 IntelliJ IDEA 或 Android Studio 與編譯器之間存在衝突行為的情況。例如，當您使用 [預期 (expected) 和實際 (actual) 類別](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-classes) 時，會發生以下情況：

<table>
   <tr>
       <td>通用程式碼</td>
       <td>平台程式碼</td>
   </tr>
   <tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // Before 2.0.0,
    // it triggers an IDE-only error
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

在此範例中，預期類別 `Identity` 沒有預設建構函式，因此無法在通用程式碼中成功呼叫。以前，只有 IDE 報告錯誤，但程式碼在 JVM 上仍然成功編譯。然而，現在編譯器正確地報告錯誤：

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 解析行為未變更時

我們仍在遷移到新的編譯方案的過程中，因此當您呼叫不在同一個原始碼集中的函式時，解析行為仍然相同。您會主要在使用多平台程式庫的重載時，於通用程式碼中注意到這種差異。

假設您有一個程式庫，其中有兩個簽章不同的 `whichFun()` 函式：

```kotlin
// Example library

// MODULE: common
fun whichFun(x: Any) = println("common function")

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

如果您在通用程式碼中呼叫 `whichFun()` 函式，則會解析為程式庫中具有最相關引數型別的函式：

```kotlin
// A project that uses the example library for the JVM target

// MODULE: common
fun main() {
    whichFun(2)
    // platform function
}
```

相比之下，如果您在同一個原始碼集中宣告 `whichFun()` 的重載，則會解析通用程式碼中的函式，因為您的程式碼無法存取平台特定版本：

```kotlin
// Example library isn't used

// MODULE: common
fun whichFun(x: Any) = println("common function")

fun main() {
    whichFun(2)
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

類似於多平台程式庫，由於 `commonTest` 模組位於單獨的原始碼集中，它也仍然可以存取平台特定程式碼。因此，對 `commonTest` 模組中函式的呼叫解析展現出與舊編譯方案相同的行為。

未來，這些剩餘案例將會與新的編譯方案更加一致。

#### 預期 (expected) 和實際 (actual) 宣告的不同可見度層級

在 Kotlin 2.0.0 之前，如果您在 Kotlin 多平台專案中使用了 [預期 (expected) 和實際 (actual) 宣告](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)，它們必須具有相同的 [可見度層級](visibility-modifiers.md)。Kotlin 2.0.0 現在也支援不同的可見度層級，但**僅限於**實際宣告比預期宣告 _更寬鬆_ 的情況。例如：

```kotlin
expect internal class Attribute // Visibility is internal
actual class Attribute          // Visibility is public by default,
                                // which is more permissive
```

同樣地，如果您在實際宣告中使用 [型別別名 (type alias)](type-aliases.md)，**底層型別** 的可見度應與預期宣告相同或更寬鬆。例如：

```kotlin
expect internal class Attribute                 // Visibility is internal
internal actual typealias Attribute = Expanded

class Expanded                                  // Visibility is public by default,
                                                // which is more permissive
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

此外，Kotlin K2 編譯器支援：

*   [Jetpack Compose](https://developer.android.com/jetpack/compose) 編譯器外掛程式 2.0.0，其已 [移至 Kotlin 儲存庫](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)。
*   [Kotlin 符號處理 (KSP) 外掛程式](ksp-overview.md) 自 [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 起。

> 如果您使用任何額外的編譯器外掛程式，請檢查其文件以確定它們是否與 K2 相容。
>
{style="tip"}

### 實驗性 Kotlin Power-assert 編譯器外掛程式

> Kotlin Power-assert 外掛程式處於 [實驗性 (Experimental)](components-stability.md#stability-levels-explained) 階段。它可能隨時變更。
>
{style="warning"}

Kotlin 2.0.0 引入了一個實驗性 Power-assert 編譯器外掛程式。此外掛程式透過在失敗訊息中包含上下文資訊來改進撰寫測試的體驗，使除錯更輕鬆高效。

開發人員通常需要使用複雜的斷言程式庫來撰寫有效的測試。Power-assert 外掛程式透過自動產生包含斷言表達式中間值的失敗訊息來簡化此過程。這有助於開發人員快速了解測試失敗的原因。

當測試中的斷言失敗時，改進的錯誤訊息會顯示斷言中所有變數和子表達式的值，清楚地指出條件的哪一部分導致了失敗。這對於檢查多個條件的複雜斷言特別有用。

要在專案中啟用此外掛程式，請在您的 `build.gradle(.kts)` 檔案中進行配置：

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

透過[文件](power-assert.md)了解更多關於 Kotlin Power-assert 外掛程式的資訊。

### 如何啟用 Kotlin K2 編譯器

從 Kotlin 2.0.0 開始，Kotlin K2 編譯器預設啟用。無需額外操作。

### 在 Kotlin Playground 中試用 Kotlin K2 編譯器

Kotlin Playground 支援 2.0.0 版本。 [試用一下！](https://pl.kotl.in/czuoQprce)

### IDE 支援

預設情況下，IntelliJ IDEA 和 Android Studio 仍使用先前的編譯器進行程式碼分析、程式碼補全、高亮顯示以及其他 IDE 相關功能。若要在 IDE 中獲得完整的 Kotlin 2.0 體驗，請啟用 K2 模式。

在您的 IDE 中，前往 **設定 (Settings)** | **語言與框架 (Languages & Frameworks)** | **Kotlin**，然後選擇 **啟用 K2 模式 (Enable K2 mode)** 選項。IDE 將使用其 K2 模式分析您的程式碼。

![Enable K2 mode](k2-mode.png){width=200}

啟用 K2 模式後，由於編譯器行為的變更，您可能會注意到 IDE 分析中的差異。在我們的 [遷移指南](k2-compiler-migration-guide.md) 中了解新的 K2 編譯器與先前版本的不同之處。

*   透過 [我們的部落格](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/) 了解更多關於 K2 模式的資訊。
*   我們正在積極收集關於 K2 模式的回饋，請在我們的 [公開 Slack 頻道](https://kotlinlang.slack.com/archives/C0B8H786P) 中分享您的想法。

### 提供新 K2 編譯器的意見回饋

我們感謝您的任何回饋！

*   在我們的 [問題追蹤器 (issue tracker)](https://kotl.in/issue) 中報告您遇到的任何新 K2 編譯器問題。
*   [啟用「傳送使用統計資料」(Send usage statistics) 選項](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，以允許 JetBrains 收集有關 K2 使用的匿名資料。

## Kotlin/JVM

從 2.0.0 版本開始，編譯器可以產生包含 Java 22 位元碼的類別。此版本還帶來了以下變更：

*   [使用 invokedynamic 產生 Lambda 函式](#generation-of-lambda-functions-using-invokedynamic)
*   [kotlinx-metadata-jvm 程式庫已趨穩定](#the-kotlinx-metadata-jvm-library-is-stable)

### 使用 invokedynamic 產生 Lambda 函式

Kotlin 2.0.0 引入了一種新的預設方法，用於使用 `invokedynamic` 產生 Lambda 函式。此變更與傳統匿名類別產生相比，減少了應用程式的二進位檔案大小。

從第一個版本開始，Kotlin 就將 Lambda 產生為匿名類別。然而，從 [Kotlin 1.5.0](whatsnew15.md#lambdas-via-invokedynamic) 開始，`invokedynamic` 產生選項已可透過使用 `-Xlambdas=indy` 編譯器選項來啟用。在 Kotlin 2.0.0 中，`invokedynamic` 已成為 Lambda 產生的預設方法。此方法產生更輕量的二進位檔案，並使 Kotlin 與 JVM 優化保持一致，確保應用程式受益於 JVM 效能的持續和未來改進。

目前，與普通 Lambda 編譯相比，它有三個限制：

*   編譯為 `invokedynamic` 的 Lambda 不可序列化 (not serializable)。
*   實驗性 [`reflect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API 不支援由 `invokedynamic` 產生的 Lambda。
*   在此類 Lambda 上呼叫 `.toString()` 會產生可讀性較差的字串表示：

    ```kotlin
    fun main() {
        println({})

        // With Kotlin 1.9.24 and reflection, returns
        // () -> kotlin.Unit
        
        // With Kotlin 2.0.0, returns
        // FileKt$Lambda$13/0x00007f88a0004608@506e1b77
    }
    ```

要保留產生 Lambda 函式的舊版行為，您可以：

*   使用 `@JvmSerializableLambda` 註解特定的 Lambda。
*   使用編譯器選項 `-Xlambdas=class`，以使用舊版方法產生模組中的所有 Lambda。

### kotlinx-metadata-jvm 程式庫已趨穩定

在 Kotlin 2.0.0 中，`kotlinx-metadata-jvm` 程式庫已趨於 [穩定](components-stability.md#stability-levels-explained)。現在，該程式庫已變更為 `kotlin` 套件和座標，您可以將其找到為 `kotlin-metadata-jvm`（沒有「x」）。

以前，`kotlinx-metadata-jvm` 程式庫有自己的發佈方案和版本。現在，我們將 `kotlin-metadata-jvm` 更新作為 Kotlin 發佈週期的一部分進行建置和發佈，並提供與 Kotlin 標準程式庫相同的向後相容性保證。

`kotlin-metadata-jvm` 程式庫提供了一個 API，用於讀取和修改由 Kotlin/JVM 編譯器產生的二進位檔案的中繼資料。

<!-- Learn more about the `kotlinx-metadata-jvm` library in the [documentation](kotlin-metadata-jvm.md). -->

## Kotlin/Native

此版本帶來了以下變更：

*   [在 Apple 平台使用 Signpost 監控 GC 效能](#monitoring-gc-performance-with-signposts-on-apple-platforms)
*   [解決與 Objective-C 方法的衝突](#resolving-conflicts-with-objective-c-methods)
*   [變更 Kotlin/Native 中編譯器引數的日誌級別](#changed-log-level-for-compiler-arguments)
*   [明確新增標準程式庫與平台依賴項至 Kotlin/Native](#explicitly-added-standard-library-and-platform-dependencies-to-kotlin-native)
*   [Gradle 設定快取中的任務錯誤](#tasks-error-in-gradle-configuration-cache)

### 在 Apple 平台使用 Signpost 監控 GC 效能

以前，只能透過查看日誌來監控 Kotlin/Native 垃圾收集器 (GC) 的效能。然而，這些日誌未與 Xcode Instruments（用於調查 iOS 應用程式效能問題的常用工具包）整合。

自 Kotlin 2.0.0 起，GC 會使用 Signpost 報告暫停，這些暫停在 Instruments 中可用。Signpost 允許在您的應用程式內進行自訂日誌記錄，因此現在，在除錯 iOS 應用程式效能時，您可以檢查 GC 暫停是否與應用程式凍結相對應。

透過[文件](native-memory-manager.md#monitor-gc-performance)了解更多關於 GC 效能分析的資訊。

### 解決與 Objective-C 方法的衝突

Objective-C 方法可以有不同的名稱，但參數的數量和型別相同。例如，[`locationManager:didEnterRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423560-locationmanager?language=objc) 和 [`locationManager:didExitRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423630-locationmanager?language=objc)。在 Kotlin 中，這些方法具有相同的簽章，因此嘗試使用它們會觸發衝突的重載錯誤。

以前，您必須手動抑制衝突的重載以避免此編譯錯誤。為了改進 Kotlin 與 Objective-C 的互通性，Kotlin 2.0.0 引入了新的 `@ObjCSignatureOverride` 註解。

該註解指示 Kotlin 編譯器忽略衝突的重載，以防多個具有相同引數型別但不同引數名稱的函式從 Objective-C 類別繼承。

應用此註解也比一般錯誤抑制更安全。此註解只能用於覆寫支援和測試的 Objective-C 方法，而一般抑制可能會隱藏重要錯誤並導致程式碼無聲地損壞。

### 變更 Kotlin/Native 中編譯器引數的日誌級別

在此版本中，Kotlin/Native Gradle 任務（例如 `compile`、`link` 和 `cinterop`）中編譯器引數的日誌級別已從 `info` 變更為 `debug`。

預設值為 `debug` 後，日誌級別與其他 Gradle 編譯任務保持一致，並提供詳細的除錯資訊，包括所有編譯器引數。

### 明確新增標準程式庫與平台依賴項至 Kotlin/Native

以前，Kotlin/Native 編譯器會隱式解析標準程式庫和平台依賴項，這導致 Kotlin Gradle 外掛程式在 Kotlin 目標之間的運作方式不一致。

現在，每個 Kotlin/Native Gradle 編譯都會透過 `compileDependencyFiles` [編譯參數](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compilation-parameters) 明確地將標準程式庫和平台依賴項包含在其編譯時程式庫路徑中。

### Gradle 設定快取中的任務錯誤

從 Kotlin 2.0.0 開始，您可能會遇到設定快取錯誤，訊息指示：`invocation of Task.project at execution time is unsupported`。

此錯誤出現在 `NativeDistributionCommonizerTask` 和 `KotlinNativeCompile` 等任務中。

然而，這是一個誤報 (false-positive) 錯誤。根本問題是存在與 Gradle 設定快取不相容的任務，例如 `publish*` 任務。

由於錯誤報告中未明確說明確切原因，[Gradle 團隊已在處理此問題以修復報告](https://github.com/gradle/gradle/issues/21290)。

## Kotlin/Wasm

Kotlin 2.0.0 提高了效能並改進了與 JavaScript 的互通性：

*   [預設使用 Binaryen 優化生產建置](#optimized-production-builds-by-default-using-binaryen)
*   [支援命名匯出](#support-for-named-export)
*   [支援 @JsExport 函式中的無符號基本型別](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
*   [在 Kotlin/Wasm 中產生 TypeScript 宣告檔](#generation-of-typescript-declaration-files-in-kotlin-wasm)
*   [支援捕捉 JavaScript 例外](#support-for-catching-javascript-exceptions)
*   [新的例外處理提案現已作為選項支援](#new-exception-handling-proposal-is-now-supported-as-an-option)
*   [withWasm() 函式拆分為 JS 和 WASI 變體](#the-withwasm-function-is-split-into-js-and-wasi-variants)

### 預設使用 Binaryen 優化生產建置

Kotlin/Wasm 工具鏈現在在生產編譯期間會將 [Binaryen](https://github.com/WebAssembly/binaryen) 工具應用於所有專案，而不是像以前那樣需要手動設定。根據我們的估計，這應該會提高您專案的執行時效能並減少二進位檔案大小。

> 此變更僅影響生產編譯。開發編譯過程保持不變。
>
{style="note"}

### 支援命名匯出

以前，所有從 Kotlin/Wasm 匯出的宣告都使用預設匯出 (default export) 匯入到 JavaScript：

```javascript
//JavaScript:
import Module from "./index.mjs"

Module.add()
```

現在，您可以按名稱匯入每個標記有 `@JsExport` 的 Kotlin 宣告：

```kotlin
// Kotlin:
@JsExport
fun add(a: Int, b: Int) = a + b
```

```javascript
//JavaScript:
import { add } from "./index.mjs"
```

命名匯出 (named export) 使 Kotlin 和 JavaScript 模組之間更容易分享程式碼。它們提高了可讀性並有助於您管理模組之間的依賴項。

### 支援 @JsExport 函式中的無符號基本型別

從 Kotlin 2.0.0 開始，您可以在外部宣告和帶有 `@JsExport` 註解的函式中使用 [無符號基本型別](unsigned-integer-types.md)，這使 Kotlin/Wasm 函式在 JavaScript 程式碼中可用。

這有助於緩解先前限制，即無法直接在匯出和外部宣告中使用[無符號基本型別](unsigned-integer-types.md)。現在您可以匯出具有無符號基本型別作為回傳或參數型別的函式，並消費回傳或消費無符號基本型別的外部宣告。

有關 Kotlin/Wasm 與 JavaScript 互通性的更多資訊，請參閱[文件](wasm-js-interop.md#use-javascript-code-in-kotlin)。

### 在 Kotlin/Wasm 中產生 TypeScript 宣告檔

> 在 Kotlin/Wasm 中產生 TypeScript 宣告檔處於 [實驗性 (Experimental)](components-stability.md#stability-levels-explained) 階段。它可能隨時被捨棄或更改。
>
{style="warning"}

在 Kotlin 2.0.0 中，Kotlin/Wasm 編譯器現在能夠從您 Kotlin 程式碼中的任何 `@JsExport` 宣告產生 TypeScript 定義。這些定義可用於 IDE 和 JavaScript 工具，以提供程式碼自動補全、協助進行型別檢查，並使將 Kotlin 程式碼包含在 JavaScript 中變得更容易。

Kotlin/Wasm 編譯器會收集任何標記有 `@JsExport` 的[頂層函式](wasm-js-interop.md#functions-with-the-jsexport-annotation)，並自動在 `.d.ts` 檔案中產生 TypeScript 定義。

要產生 TypeScript 定義，請在您的 `build.gradle(.kts)` 檔案中的 `wasmJs {}` 區塊中，添加 `generateTypeScriptDefinitions()` 函式：

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

您也可以為此使用新的 `es2015` [編譯目標](#new-compilation-target)。

### 支援捕捉 JavaScript 例外

以前，Kotlin/Wasm 程式碼無法捕捉 JavaScript 例外，這使得處理源自 JavaScript 端的程式碼錯誤變得困難。

在 Kotlin 2.0.0 中，我們實作了在 Kotlin/Wasm 中捕捉 JavaScript 例外的支援。此實作允許您使用 `try-catch` 區塊，並帶有 `Throwable` 或 `JsException` 等特定型別，以正確處理這些錯誤。

此外，`finally` 區塊（有助於無論例外是否拋出都能執行程式碼）也正常運作。雖然我們引入了捕捉 JavaScript 例外的支援，但在 JavaScript 例外（例如呼叫堆疊）發生時，沒有提供額外資訊。然而，[我們正在實作這些功能](https://youtrack.jetbrains.com/issue/KT-68185/WasmJs-Attach-js-exception-object-to-JsException)。

### 新的例外處理提案現已作為選項支援

在此版本中，我們在 Kotlin/Wasm 中引入了對 WebAssembly [例外處理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md) 新版本的支援。

此更新確保新提案符合 Kotlin 的要求，使其能夠在僅支援最新版本提案的虛擬機器上使用 Kotlin/Wasm。

透過使用預設關閉的 `-Xwasm-use-new-exception-proposal` 編譯器選項來啟用新的例外處理提案。

### withWasm() 函式拆分為 JS 和 WASI 變體

`withWasm()` 函式（以前用於為層次結構模板提供 Wasm 目標）已被棄用，轉而使用專門的 `withWasmJs()` 和 `withWasmWasi()` 函式。

現在，您可以在樹狀定義中將 WASI 和 JS 目標分離到不同的群組中。

## Kotlin/JS

除了其他變更之外，此版本還為 Kotlin 帶來了現代 JS 編譯，支援 ES2015 標準的更多功能：

*   [新的編譯目標](#new-compilation-target)
*   [暫停函式作為 ES2015 產生器](#suspend-functions-as-es2015-generators)
*   [傳遞引數至主函式](#passing-arguments-to-the-main-function)
*   [Kotlin/JS 專案的逐檔案編譯](#per-file-compilation-for-kotlin-js-projects)
*   [改進集合互通性](#improved-collection-interoperability)
*   [支援 createInstance()](#support-for-createinstance)
*   [支援型別安全的純 JavaScript 物件](#support-for-type-safe-plain-javascript-objects)
*   [支援 npm 套件管理器](#support-for-npm-package-manager)
*   [編譯任務的變更](#changes-to-compilation-tasks)
*   [停止支援舊版 Kotlin/JS JAR 構件](#discontinuing-legacy-kotlin-js-jar-artifacts)

### 新的編譯目標

在 Kotlin 2.0.0 中，我們為 Kotlin/JS 添加了一個新的編譯目標 `es2015`。這是一種新的方式，讓您一次性啟用 Kotlin 中支援的所有 ES2015 功能。

您可以在 `build.gradle(.kts)` 檔案中這樣設定：

```kotlin
kotlin {
    js {
        compilerOptions {
            target.set("es2015")
        }
    }
}
```

新目標會自動啟用 [ES 類別和模組](whatsnew19.md#experimental-support-for-es2015-classes-and-modules) 以及新支援的 [ES 產生器](#suspend-functions-as-es2015-generators)。

### 暫停函式作為 ES2015 產生器

此版本引入了 [實驗性 (Experimental)](components-stability.md#stability-levels-explained) 支援 ES2015 產生器，用於編譯 [暫停函式 (suspend function)](composing-suspending-functions.md)。

使用產生器而不是狀態機應該會改進專案最終綑綁包 (bundle) 的大小。例如，JetBrains 團隊透過使用 ES2015 產生器成功將其 Space 專案的綑綁包大小減少了 20%。

透過 [官方文件](https://262.ecma-international.org/6.0/) 了解更多關於 ES2015 (ECMAScript 2015, ES6) 的資訊。

### 傳遞引數至主函式

從 Kotlin 2.0.0 開始，您可以為 `main()` 函式指定 `args` 的來源。此功能使命令行操作和傳遞引數變得更容易。

為此，請定義 `js {}` 區塊，其中包含新的 `passAsArgumentToMainFunction()` 函式，它回傳一個字串陣列：

```kotlin
kotlin {
    js {
        binary.executable()
        passAsArgumentToMainFunction("Deno.args")
    }
}
```

該函式在執行時執行。它接受 JavaScript 表達式並將其用作 `args: Array<String>` 引數，而不是 `main()` 函式呼叫。

此外，如果您使用 Node.js 執行時，您可以利用特殊的別名。它允許您將 `process.argv` 一次性傳遞給 `args` 參數，而不是每次都手動添加：

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

### Kotlin/JS 專案的逐檔案編譯

Kotlin 2.0.0 為 Kotlin/JS 專案輸出引入了一個新的粒度選項。您現在可以設定逐檔案編譯，為每個 Kotlin 檔案產生一個 JavaScript 檔案。這有助於顯著優化最終綑綁包的大小並提高程式的載入時間。

以前，只有兩個輸出選項。Kotlin/JS 編譯器可以為整個專案產生單一的 `.js` 檔案。然而，此檔案可能過大且不便使用。每當您想使用專案中的函式時，都必須將整個 JavaScript 檔案作為依賴項包含。或者，您可以為每個專案模組配置單獨的 `.js` 檔案編譯。這仍然是預設選項。

由於模組檔案也可能過大，在 Kotlin 2.0.0 中，我們添加了更細粒度的輸出，為每個 Kotlin 檔案產生一個（或兩個，如果檔案包含匯出宣告）JavaScript 檔案。要啟用逐檔案編譯模式：

1.  將 [`useEsModules()`](whatsnew19.md#experimental-support-for-es2015-classes-and-modules) 函式添加到您的建置檔案中以支援 ECMAScript 模組：

    ```kotlin
    // build.gradle.kts
    kotlin {
        js(IR) {
            useEsModules() // Enables ES2015 modules
            browser()
        }
    }
    ```

    您也可以為此使用新的 `es2015` [編譯目標](#new-compilation-target)。

2.  應用 `-Xir-per-file` 編譯器選項或使用以下內容更新您的 `gradle.properties` 檔案：

    ```none
    # gradle.properties
    kotlin.js.ir.output.granularity=per-file // `per-module` is the default
    ```

### 改進集合互通性

從 Kotlin 2.0.0 開始，現在可以將簽章中帶有 Kotlin 集合型別的宣告匯出到 JavaScript（和 TypeScript）。這適用於 `Set`、`Map` 和 `List` 集合型別及其可變對應項。

要在 JavaScript 中使用 Kotlin 集合，首先使用 [`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 註解標記必要的宣告：

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

然後，您可以從 JavaScript 中將它們作為常規 JavaScript 陣列消費：

```javascript
// JavaScript
import { User, me, KtList } from "my-module"

const allMyFriendNames = me.friends
    .asJsReadonlyArrayView()
    .map(x => x.name) // ['Kodee']
```

> 不幸的是，從 JavaScript 建立 Kotlin 集合仍然不可用。我們計劃在 Kotlin 2.0.20 中添加此功能。
>
{style="note"}

### 支援 createInstance()

從 Kotlin 2.0.0 開始，您可以使用 Kotlin/JS 目標的 [`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html) 函式。以前，它僅在 JVM 上可用。

`KClass` 介面中的此函式會建立指定類別的新實例，這對於獲取 Kotlin 類別的執行時參照很有用。

### 支援型別安全的純 JavaScript 物件

> `js-plain-objects` 外掛程式處於 [實驗性 (Experimental)](components-stability.md#stability-levels-explained) 階段。它可能隨時被捨棄或更改。`js-plain-objects` 外掛程式**僅**支援 K2 編譯器。
>
{style="warning"}

為了更容易與 JavaScript API 協作，在 Kotlin 2.0.0 中，我們提供了一個新外掛程式：[`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)，您可以使用它來建立型別安全的純 JavaScript 物件。該外掛程式會檢查您的程式碼中是否有帶有 `@JsPlainObject` 註解的[外部介面](wasm-js-interop.md#external-interfaces)，並添加：

*   伴隨物件 (companion object) 中的內嵌 `invoke` 運算子函式，您可以將其用作建構函式。
*   一個 `.copy()` 函式，您可以用它來建立物件的副本，同時調整其某些屬性。

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
    // Creates a JavaScript object
    val user = User(name = "Name", age = 10)
    // Copies the object and adds an email
    val copy = user.copy(age = 11, email = "some@user.com")

    println(JSON.stringify(user))
    // { "name": "Name", "age": 10 }
    println(JSON.stringify(copy))
    // { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

透過這種方法建立的任何 JavaScript 物件都更安全，因為您不僅可以在執行時看到錯誤，還可以在編譯時甚至被 IDE 高亮顯示。

考慮以下範例，它使用 `fetch()` 函式透過外部介面與 JavaScript API 互動，以描述 JavaScript 物件的形狀：

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface FetchOptions {
    val body: String?
    val method: String
}

// A wrapper for Window.fetch
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// A compile-time error is triggered as "metod" is not recognized
// as method
fetch("https://google.com", options = FetchOptions(metod = "POST"))
// A compile-time error is triggered as method is required
fetch("https://google.com", options = FetchOptions(body = "SOME STRING")) 
```

相比之下，如果您改用 `js()` 函式建立 JavaScript 物件，錯誤只會在執行時發現或根本不會觸發：

```kotlin
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// No error is triggered. As "metod" is not recognized, the wrong method 
// (GET) is used.
fetch("https://google.com", options = js("{ metod: 'POST' }"))

// By default, the GET method is used. A runtime error is triggered as 
// body shouldn't be present.
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

### 支援 npm 套件管理器

以前，Kotlin 多平台 Gradle 外掛程式只能使用 [Yarn](https://yarnpkg.com/lang/en/) 作為套件管理器來下載和安裝 npm 依賴項。從 Kotlin 2.0.0 開始，您可以改用 [npm](https://www.npmjs.com/) 作為您的套件管理器。使用 npm 作為套件管理器意味著您在設置期間需要管理的工具減少了一個。

為了向後相容，Yarn 仍然是預設套件管理器。要使用 npm 作為您的套件管理器，請在您的 `gradle.properties` 檔案中設定以下屬性：

```kotlin
kotlin.js.yarn = false
```

### 編譯任務的變更

以前，`webpack` 和 `distributeResources` 編譯任務都指向相同的目錄。此外，`distribution` 任務也將 `dist` 聲明為其輸出目錄。這導致輸出重疊並產生編譯警告。

因此，從 Kotlin 2.0.0 開始，我們實作了以下變更：

*   `webpack` 任務現在指向單獨的資料夾。
*   `distributeResources` 任務已被完全移除。
*   `distribution` 任務現在具有 `Copy` 型別並指向 `dist` 資料夾。

### 停止支援舊版 Kotlin/JS JAR 構件

從 Kotlin 2.0.0 開始，Kotlin 發佈不再包含舊版 Kotlin/JS 構件（副檔名為 `.jar`）。舊版構件用於不受支援的舊 Kotlin/JS 編譯器，對於使用 `klib` 格式的 IR 編譯器來說是不必要的。

## Gradle 改進

Kotlin 2.0.0 完全相容於 Gradle 6.8.3 到 8.5。您也可以使用最新的 Gradle 版本，但請注意，您可能會遇到棄用警告或某些新的 Gradle 功能可能無法運作。

此版本帶來了以下變更：

*   [多平台專案中編譯器選項的新 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
*   [新的 Compose 編譯器 Gradle 外掛程式](#new-compose-compiler-gradle-plugin)
*   [區分 JVM 與 Android 發佈程式庫的新屬性](#new-attribute-to-distinguish-jvm-and-android-published-libraries)
*   [改進 Kotlin/Native 中 CInteropProcess 的 Gradle 依賴處理](#improved-gradle-dependency-handling-for-cinteropprocess-in-kotlin-native)
*   [Gradle 中的可見性變更](#visibility-changes-in-gradle)
*   [Gradle 專案中 Kotlin 資料的新目錄](#new-directory-for-kotlin-data-in-gradle-projects)
*   [Kotlin/Native 編譯器按需下載](#kotlin-native-compiler-downloaded-when-needed)
*   [棄用定義編譯器選項的舊方法](#deprecated-old-ways-of-defining-compiler-options)
*   [提高最低支援的 AGP 版本](#bumped-minimum-supported-agp-version)
*   [試用最新語言版本的新 Gradle 屬性](#new-gradle-property-for-trying-the-latest-language-version)
*   [建置報告的新 JSON 輸出格式](#new-json-output-format-for-build-reports)
*   [kapt 配置繼承其上層配置的註解處理器](#kapt-configurations-inherit-annotation-processors-from-superconfigurations)
*   [Kotlin Gradle 外掛程式不再使用棄用的 Gradle 慣例](#kotlin-gradle-plugin-no-longer-uses-deprecated-gradle-conventions)

### 多平台專案中編譯器選項的新 Gradle DSL

> 此功能處於 [實驗性 (Experimental)](components-stability.md#stability-levels-explained) 階段。它可能隨時被捨棄或更改。僅用於評估目的。我們非常感謝您在 [YouTrack](https://kotl.in/issue) 上提供關於它的回饋。
>
{style="warning"}

在 Kotlin 2.0.0 之前，在帶有 Gradle 的多平台專案中配置編譯器選項只能在低層級進行，例如按任務、編譯或原始碼集。為了更容易在專案中更通用地配置編譯器選項，Kotlin 2.0.0 帶有一個新的 Gradle DSL。

有了這個新的 DSL，您可以在擴充功能層級為所有目標和共享原始碼集（例如 `commonMain`）以及在目標層級為特定目標配置編譯器選項：

```kotlin
kotlin {
    compilerOptions {
        // Extension-level common compiler options that are used as defaults
        // for all targets and shared source sets
        allWarningsAsErrors.set(true)
    }
    jvm {
        compilerOptions {
            // Target-level JVM compiler options that are used as defaults
            // for all compilations in this target
            noJdk.set(true)
        }
    }
}
```

整體專案配置現在有三個層次。最高層次是擴充功能層級，然後是目標層級，最低層次是編譯單元（通常是編譯任務）：

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

較高層級的設定用作較低層級的慣例 (預設值)：

*   擴充功能編譯器選項的值是目標編譯器選項的預設值，包括共享原始碼集，例如 `commonMain`、`nativeMain` 和 `commonTest`。
*   目標編譯器選項的值用作編譯單元 (任務) 編譯器選項的預設值，例如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任務。

反過來，在較低層級進行的配置會覆蓋較高層級的相關設定：

*   任務層級編譯器選項會覆蓋目標或擴充功能層級的相關配置。
*   目標層級編譯器選項會覆蓋擴充功能層級的相關配置。

配置專案時，請記住某些舊的設定編譯器選項的方法已被 [棄用](#deprecated-old-ways-of-defining-compiler-options)。

我們鼓勵您在多平台專案中試用新的 DSL，並在 [YouTrack](https://kotl.in/issue) 中留下回饋，因為我們計劃將此 DSL 作為配置編譯器選項的推薦方法。

### 新的 Compose 編譯器 Gradle 外掛程式

Jetpack Compose 編譯器（將可組合項 (composables) 轉換為 Kotlin 程式碼）現已合併到 Kotlin 儲存庫中。這將有助於將 Compose 專案轉換為 Kotlin 2.0.0，因為 Compose 編譯器將始終與 Kotlin 同步發佈。這也將 Compose 編譯器版本提升為 2.0.0。

要在您的專案中使用新的 Compose 編譯器，請在 `build.gradle(.kts)` 檔案中應用 `org.jetbrains.kotlin.plugin.compose` Gradle 外掛程式，並將其版本設定為 Kotlin 2.0.0。

要了解有關此變更的更多資訊並查看遷移說明，請參閱 [Compose 編譯器](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html) 文件。

### 區分 JVM 與 Android 發佈程式庫的新屬性

從 Kotlin 2.0.0 開始，[`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes) Gradle 屬性預設隨所有 Kotlin 變體發佈。

該屬性有助於區分 Kotlin 多平台程式庫的 JVM 和 Android 變體。它表示某個程式庫變體更適合某個 JVM 環境。目標環境可以是「android」、「standard-jvm」或「no-jvm」。

發佈此屬性應使非多平台用戶端（例如僅限 Java 的專案）更穩健地消費帶有 JVM 和 Android 目標的 Kotlin 多平台程式庫。

如有必要，您可以禁用屬性發佈。為此，請將以下 Gradle 選項添加到您的 `gradle.properties` 檔案中：

```none
kotlin.publishJvmEnvironmentAttribute=false
```

### 改進 Kotlin/Native 中 CInteropProcess 的 Gradle 依賴處理

在此版本中，我們增強了對 `defFile` 屬性的處理，以確保在 Kotlin/Native 專案中更好地管理 Gradle 任務依賴項。

在本次更新之前，如果 `defFile` 屬性被指定為另一個尚未執行的任務的輸出，Gradle 建置可能會失敗。此問題的解決方法是添加對此任務的依賴：

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

為了解決這個問題，有一個名為 `definitionFile` 的新 `RegularFileProperty` 屬性。現在，Gradle 會在相關任務稍後在建置過程中執行後，延遲驗證 `definitionFile` 屬性的存在。這種新方法消除了對額外依賴項的需求。

`CInteropProcess` 任務和 `CInteropSettings` 類別使用 `definitionFile` 屬性代替 `defFile` 和 `defFileProperty`：

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

> 此變更僅影響 Kotlin DSL 用戶。
>
{style="note"}

在 Kotlin 2.0.0 中，我們修改了 Kotlin Gradle 外掛程式，以更好地控制和保護您的建置腳本。以前，某些用於特定 DSL 上下文的 Kotlin DSL 函式和屬性會無意中洩漏到其他 DSL 上下文中。這種洩漏可能導致使用不正確的編譯器選項、設定被多次應用以及其他錯誤配置：

```kotlin
kotlin {
    // Target DSL couldn't access methods and properties defined in the
    // kotlin{} extension DSL
    jvm {
        // Compilation DSL couldn't access methods and properties defined
        // in the kotlin{} extension DSL and Kotlin jvm{} target DSL
        compilations.configureEach {
            // Compilation task DSLs couldn't access methods and
            // properties defined in the kotlin{} extension, Kotlin jvm{}
            // target or Kotlin compilation DSL
            compileTaskProvider.configure {
                // For example:
                explicitApi()
                // ERROR as it is defined in the kotlin{} extension DSL
                mavenPublication {}
                // ERROR as it is defined in the Kotlin jvm{} target DSL
                defaultSourceSet {}
                // ERROR as it is defined in the Kotlin compilation DSL
            }
        }
    }
}
```

為了解決這個問題，我們添加了 `@KotlinGradlePluginDsl` 註解，防止 Kotlin Gradle 外掛程式 DSL 函式和屬性暴露到它們不應該可用的層次。以下層次彼此分離：

*   Kotlin 擴充功能
*   Kotlin 目標
*   Kotlin 編譯
*   Kotlin 編譯任務

對於最常見的情況，我們添加了編譯器警告，並附有如何修復建置腳本配置不正確的建議。例如：

```kotlin
kotlin {
    jvm {
        sourceSets.getByName("jvmMain").dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.7.3")
        }
    }
}
```

在此情況下，`sourceSets` 的警告訊息為：

```none
[DEPRECATION] 'sourceSets: NamedDomainObjectContainer<KotlinSourceSet>' is deprecated.Accessing 'sourceSets' container on the Kotlin target level DSL is deprecated. Consider configuring 'sourceSets' on the Kotlin extension level.
```

我們感謝您對此變更的回饋！請直接在我們的 [#gradle Slack 頻道](https://kotlinlang.slack.com/archives/C19FD9681) 中與 Kotlin 開發人員分享您的意見。 [獲取 Slack 邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。

### Gradle 專案中 Kotlin 資料的新目錄

> 請勿將 `.kotlin` 目錄提交到版本控制。
> 例如，如果您使用 Git，請將 `.kotlin` 添加到專案的 `.gitignore` 檔案中。
>
{style="warning"}

在 Kotlin 1.8.20 中，Kotlin Gradle 外掛程式切換為將其資料儲存在 Gradle 專案快取目錄中：`<project-root-directory>/.gradle/kotlin`。然而，`.gradle` 目錄僅供 Gradle 使用，因此不具備未來擴充性。

為了解決這個問題，從 Kotlin 2.0.0 開始，我們將預設將 Kotlin 資料儲存在您的 `<project-root-directory>/.kotlin` 中。我們將繼續將部分資料儲存在 `.gradle/kotlin` 目錄中以實現向後相容性。

您可以配置的新 Gradle 屬性包括：

| Gradle 屬性                                     | 說明                                                                                                        |
|-----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | 配置您的專案層級資料儲存位置。預設值：`<project-root-directory>/.kotlin`       |
| `kotlin.project.persistent.dir.gradle.disableWrite` | 一個布林值，控制是否禁用將 Kotlin 資料寫入 `.gradle` 目錄。預設值：`false` |

將這些屬性添加到您的專案的 `gradle.properties` 檔案中，使其生效。

### Kotlin/Native 編譯器按需下載

在 Kotlin 2.0.0 之前，如果您在多平台專案的 Gradle 建置腳本中配置了 [Kotlin/Native 目標](native-target-support.md)，Gradle 總是在[設定階段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:configuration)下載 Kotlin/Native 編譯器。

即使沒有任務要編譯要在[執行階段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)運行的 Kotlin/Native 目標的程式碼，這種情況也會發生。以這種方式下載 Kotlin/Native 編譯器對於只想檢查專案中 JVM 或 JavaScript 程式碼的使用者來說效率低下，例如作為 CI 流程的一部分執行測試或檢查。

在 Kotlin 2.0.0 中，我們更改了 Kotlin Gradle 外掛程式中的這種行為，以便 Kotlin/Native 編譯器在[執行階段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)下載，並且**僅在**請求編譯 Kotlin/Native 目標時下載。

反過來，Kotlin/Native 編譯器的依賴項現在不再作為編譯器的一部分下載，而是在執行階段下載。

如果您遇到新行為的任何問題，可以透過將以下 Gradle 屬性添加到您的 `gradle.properties` 檔案中來暫時切換回先前的行為：

```none
kotlin.native.toolchain.enabled=false
```

從 Kotlin 1.9.20-Beta 開始，Kotlin/Native 發佈版本已發佈到 [Maven Central](https://repo.maven.apache.org/maven2/org/jetbrains/kotlin/kotlin-native-prebuilt/) 以及 CDN。

這使我們能夠更改 Kotlin 尋找和下載必要構件的方式。預設情況下，它現在使用您在專案的 `repositories {}` 區塊中指定的 Maven 儲存庫，而不是 CDN。

您可以透過在 `gradle.properties` 檔案中設定以下 Gradle 屬性來暫時切換回此行為：

```none
kotlin.native.distribution.downloadFromMaven=false
```

請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 報告任何問題。這兩個更改預設行為的 Gradle 屬性都是暫時性的，將在未來版本中移除。

### 棄用定義編譯器選項的舊方法

在此版本中，我們繼續改進您設定編譯器選項的方式。它應該能解決不同方法之間的歧義，並使專案配置更加直接。

從 Kotlin 2.0.0 開始，以下用於指定編譯器選項的 DSL 已棄用：

*   來自實作所有 Kotlin 編譯任務的 `KotlinCompile` 介面的 `kotlinOptions` DSL。請改用 `KotlinCompilationTask<CompilerOptions>`。
*   來自 `KotlinCompilation` 介面中具有 `HasCompilerOptions` 型別的 `compilerOptions` 屬性。此 DSL 與其他 DSL 不一致，並配置與 `KotlinCompilation.compileTaskProvider` 編譯任務中的 `compilerOptions` 相同的 `KotlinCommonCompilerOptions` 物件，這令人困惑。

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
*   來自 `KotlinNativeArtifactConfig` 介面、`KotlinNativeLink` 類別和 `KotlinNativeLinkArtifactTask` 類別的 `kotlinOptions` DSL。請改用 `toolOptions` DSL。
*   來自 `KotlinJsDce` 介面的 `dceOptions` DSL。請改用 `toolOptions` DSL。

有關如何在 Kotlin Gradle 外掛程式中指定編譯器選項的更多資訊，請參閱 [如何定義選項](gradle-compiler-options.md#how-to-define-options)。

### 提高最低支援的 AGP 版本

從 Kotlin 2.0.0 開始，最低支援的 Android Gradle 外掛程式版本為 7.1.3。

### 試用最新語言版本的新 Gradle 屬性

在 Kotlin 2.0.0 之前，我們有以下 Gradle 屬性來試用新的 K2 編譯器：`kotlin.experimental.tryK2`。現在 K2 編譯器在 Kotlin 2.0.0 中預設啟用，我們決定將此屬性演變為新形式，您可以用它來試用專案中的最新語言版本：`kotlin.experimental.tryNext`。當您在 `gradle.properties` 檔案中使用此屬性時，Kotlin Gradle 外掛程式會將語言版本增加到比您的 Kotlin 版本的預設值高一個。例如，在 Kotlin 2.0.0 中，預設語言版本是 2.0，因此該屬性配置語言版本 2.1。

這個新的 Gradle 屬性在[建置報告](gradle-compilation-and-caches.md#build-reports)中產生與以前使用 `kotlin.experimental.tryK2` 相似的指標。配置的語言版本包含在輸出中。例如：

```none
##### 'kotlin.experimental.tryNext' results #####
:app:compileKotlin: 2.1 language version
:lib:compileKotlin: 2.1 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.1 #####
```

要了解更多關於如何啟用建置報告及其內容的資訊，請參閱 [建置報告](gradle-compilation-and-caches.md#build-reports)。

### 建置報告的新 JSON 輸出格式

在 Kotlin 1.7.0 中，我們引入了建置報告以幫助追蹤編譯器效能。隨著時間的推移，我們添加了更多指標，使這些報告在調查效能問題時更加詳細和有幫助。以前，本地檔案的唯一輸出格式是 `*.txt` 格式。在 Kotlin 2.0.0 中，我們支援 JSON 輸出格式，使其更容易使用其他工具進行分析。

要為您的建置報告配置 JSON 輸出格式，請在您的 `gradle.properties` 檔案中宣告以下屬性：

```none
kotlin.build.report.output=json

// The directory to store your build reports
kotlin.build.report.json.directory=my/directory/path
```

或者，您可以運行以下命令：

```shell
./gradlew assemble -Pkotlin.build.report.output=json -Pkotlin.build.report.json.directory="my/directory/path"
``` 

配置後，Gradle 會在您指定的目錄中產生您的建置報告，名稱為：`${project_name}-date-time-<sequence_number>.json`。

以下是帶有 JSON 輸出格式的建置報告範例片段，其中包含建置指標和彙總指標：

```json
"buildOperationRecord": [
    {
     "path": ":lib:compileKotlin",
      "classFqName": "org.jetbrains.kotlin.gradle.tasks.KotlinCompile_Decorated",
      "startTimeMs": 1714730820601,
      "totalTimeMs": 2724,
      "buildMetrics": {
        "buildTimes": {
          "buildTimesNs": {
            "CLEAR_OUTPUT": 713417,
            "SHRINK_AND_SAVE_CURRENT_CLASSPATH_SNAPSHOT_AFTER_COMPILATION": 19699333,
            "IR_TRANSLATION": 281000000,
            "NON_INCREMENTAL_LOAD_CURRENT_CLASSPATH_SNAPSHOT": 14088042,
            "CALCULATE_OUTPUT_SIZE": 1301500,
            "GRADLE_TASK": 2724000000,
            "COMPILER_INITIALIZATION": 263000000,
            "IR_GENERATION": 74000000,
...
          }
        }
...
 "aggregatedMetrics": {
    "buildTimes": {
      "buildTimesNs": {
        "CLEAR_OUTPUT": 782667,
        "SHRINK_AND_SAVE_CURRENT_CLASSPATH_SNAPSHOT_AFTER_COMPILATION": 22031833,
        "IR_TRANSLATION": 333000000,
        "NON_INCREMENTAL_LOAD_CURRENT_CLASSPATH_SNAPSHOT": 14890292,
        "CALCULATE_OUTPUT_SIZE": 2370750,
        "GRADLE_TASK": 3234000000,
        "COMPILER_INITIALIZATION": 292000000,
        "IR_GENERATION": 89000000,
...
      }
    }
```

### kapt 配置繼承其上層配置的註解處理器

在 Kotlin 2.0.0 之前，如果您想在單獨的 Gradle 配置中定義一組通用的註解處理器，並在子專案的 kapt 特定配置中擴展此配置，kapt 會跳過註解處理，因為它找不到任何註解處理器。在 Kotlin 2.0.0 中，kapt 可以成功檢測到存在對註解處理器的間接依賴。

例如，對於使用 [Dagger](https://dagger.dev/) 的子專案，在您的 `build.gradle(.kts)` 檔案中，使用以下配置：

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

在此範例中，`commonAnnotationProcessors` Gradle 配置是您希望用於所有專案的通用註解處理配置。您使用 [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom) 方法將 `commonAnnotationProcessors` 添加為上層配置 (superconfiguration)。kapt 看到 `commonAnnotationProcessors` Gradle 配置依賴於 Dagger 註解處理器。因此，kapt 將 Dagger 註解處理器包含在其註解處理配置中。

感謝 Christoph Loy 的[實作](https://github.com/JetBrains/kotlin/pull/5198)！

### Kotlin Gradle 外掛程式不再使用棄用的 Gradle 慣例

在 Kotlin 2.0.0 之前，如果您使用 Gradle 8.2 或更高版本，Kotlin Gradle 外掛程式錯誤地使用了在 Gradle 8.2 中已棄用的 Gradle 慣例。這導致 Gradle 報告建置棄用。在 Kotlin 2.0.0 中，Kotlin Gradle 外掛程式已更新為不再觸發這些棄用警告，當您使用 Gradle 8.2 或更高版本時。

## 標準程式庫

此版本為 Kotlin 標準程式庫帶來了進一步的穩定性，並使更多現有函式對所有平台通用：

*   [enum 類別 values 泛型函式的穩定替換](#stable-replacement-of-the-enum-class-values-generic-function)
*   [穩定的 AutoCloseable 介面](#stable-autocloseable-interface)
*   [通用保護屬性 AbstractMutableList.modCount](#common-protected-property-abstractmutablelist-modcount)
*   [通用保護函式 AbstractMutableList.removeRange](#common-protected-function-abstractmutablelist-removerange)
*   [通用 String.toCharArray(destination) 函式](#common-string-tochararray-destination-function)

### enum 類別 values 泛型函式的穩定替換

在 Kotlin 2.0.0 中，`enumEntries<T>()` 函式趨於 [穩定](components-stability.md#stability-levels-explained)。`enumEntries<T>()` 函式是泛型 `enumValues<T>()` 函式的替換。新函式回傳給定 enum 型別 `T` 的所有 enum 條目列表。enum 類別的 `entries` 屬性此前已引入並穩定化，以替換合成的 `values()` 函式。有關 `entries` 屬性的更多資訊，請參閱 [Kotlin 1.8.20 新功能](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)。

> `enumValues<T>()` 函式仍然支援，但我們建議您改用 `enumEntries<T>()` 函式，因為它對效能影響較小。每次呼叫 `enumValues<T>()` 時都會建立一個新陣列，而每次呼叫 `enumEntries<T>()` 時都會回傳相同的列表，這效率更高。
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

在 Kotlin 2.0.0 中，通用 [`AutoCloseable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) 介面趨於 [穩定](components-stability.md#stability-levels-explained)。它允許您輕鬆關閉資源，並包含幾個實用函式：

*   `use()` 擴充函式，它在選定的資源上執行給定的區塊函式，然後正確關閉它，無論是否拋出例外。
*   `AutoCloseable()` 建構函式，用於建立 `AutoCloseable` 介面的實例。

在下面的範例中，我們定義了 `XMLWriter` 介面，並假設存在一個實作它的資源。例如，這個資源可以是一個開啟檔案、寫入 XML 內容，然後關閉它的類別：

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

### 通用保護屬性 AbstractMutableList.modCount

在此版本中，`AbstractMutableList` 介面的 [`modCount`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/mod-count.html) 保護屬性 (protected property) 變為通用。以前，`modCount` 屬性在每個平台都可用，但在通用目標中不可用。現在，您可以建立 `AbstractMutableList` 的自訂實作，並在通用程式碼中存取該屬性。

該屬性追蹤對集合進行的結構修改次數。這包括改變集合大小或以可能導致進行中的迭代返回不正確結果的方式改變列表的操作。

您可以使用 `modCount` 屬性在實作自訂列表時註冊和檢測並發修改。

### 通用保護函式 AbstractMutableList.removeRange

在此版本中，`AbstractMutableList` 介面的 [`removeRange()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/remove-range.html) 保護函式 (protected function) 變為通用。以前，它在每個平台都可用，但在通用目標中不可用。現在，您可以建立 `AbstractMutableList` 的自訂實作，並在通用程式碼中覆寫該函式。

該函式會從此列表中移除指定範圍內的元素。透過覆寫此函式，您可以利用自訂實作並提高列表操作的效能。

### 通用 String.toCharArray(destination) 函式

此版本引入了通用 [`String.toCharArray(destination)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html) 函式。以前，它僅在 JVM 上可用。

讓我們將其與現有的 [`String.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html) 函式進行比較。它會建立一個新的 `CharArray`，其中包含指定字串中的字元。然而，新的通用 `String.toCharArray(destination)` 函式會將 `String` 字元移入現有的目標 `CharArray`。如果您已經有想要填充的緩衝區，這會很有用：

```kotlin
fun main() {
    val myString = "Kotlin is awesome!"
    val destinationArray = CharArray(myString.length)

    // Convert the string and store it in the destinationArray:
    myString.toCharArray(destinationArray)

    for (char in destinationArray) {
        print("$char ")
        // K o t l i n   i s   a w e s o m e ! 
    }
}
```
{kotlin-runnable="true"}

## 安裝 Kotlin 2.0.0

從 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 開始，Kotlin 外掛程式作為捆綁外掛程式包含在您的 IDE 中發佈。這意味著您無法再從 JetBrains Marketplace 安裝該外掛程式。

要更新到新的 Kotlin 版本，請在您的建置腳本中將 [Kotlin 版本變更](releases.md#update-to-a-new-kotlin-version) 為 2.0.0。