[//]: # (title: Kotlin 1.3 有什麼新功能)

_發布日期：2018 年 10 月 29 日_

## 協程釋出

經過漫長而廣泛的實戰測試後，協程現已釋出！這意味著從 Kotlin 1.3 開始，語言支援和 API [已完全穩定](components-stability.md)。請查看新的[協程概述](coroutines-overview.md)頁面。

Kotlin 1.3 引入了 suspend 函式上的 callable references，並在 reflection API 中支援協程。

## Kotlin/Native

Kotlin 1.3 持續改進並完善 Native 目標。詳情請參閱 [Kotlin/Native 概述](native-overview.md)。

## 多平台專案

在 1.3 中，我們徹底重構了多平台專案的模型，以提高表達能力和彈性，並使共用共同程式碼變得更容易。此外，Kotlin/Native 現在也作為其中一個目標得到支援！

與舊模型的主要差異是：

  * 在舊模型中，共同程式碼和平台特定程式碼需要放置在不同的模組中，並透過 `expectedBy` 依賴項連結。現在，共同程式碼和平台特定程式碼放置在同一模組的不同原始碼根目錄中，使專案更容易配置。
  * 現在有大量[預設平台配置](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)用於不同的受支援平台。
  * [依賴項配置](https://kotlinlang.org/docs/multiplatform/multiplatform-add-dependencies.html)已更改；依賴項現在為每個原始碼根目錄單獨指定。
  * 原始碼集現在可以在平台的任意子集之間共用（例如，在一個以 JS、Android 和 iOS 為目標的模組中，您可以有一個只在 Android 和 iOS 之間共用的原始碼集）。
  * 現在支援[發佈多平台函式庫](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html)。

欲了解更多資訊，請參閱[多平台程式設計文件](https://kotlinlang.org/docs/multiplatform/get-started.html)。

## 契約

Kotlin 編譯器執行廣泛的靜態分析以提供警告並減少樣板程式碼。其中最顯著的功能之一是 smartcasts — 能夠根據執行的型別檢查自動執行轉換：

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // 編譯器自動將 's' 轉換為 'String'
}
```

然而，一旦這些檢查被提取到一個單獨的函式中，所有 smartcasts 會立即消失：

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // 沒有 smartcast :(
}
```

為了改進這種情況下的行為，Kotlin 1.3 引入了一種名為 *契約* 的實驗性機制。

*契約* 允許函式以編譯器理解的方式明確描述其行為。目前支援兩大類情況：

* 透過宣告函式呼叫結果與傳入引數值之間的關係來改進 smartcasts 分析：

```kotlin
fun require(condition: Boolean) {
    // 這是一種語法形式，它告訴編譯器：
    // "如果此函式成功返回，則傳入的 'condition' 為 true"
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // 's' 在這裡被 smartcast 到 'String'，因為否則
    // 'require' 會拋出例外
}
```

* 在存在高階函式的情況下，改進變數初始化分析：

```kotlin
fun synchronize(lock: Any?, block: () -> Unit) {
    // 它告訴編譯器：
    // "此函式將在此處立即呼叫 'block'，且只呼叫一次"
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // 編譯器知道傳遞給 'synchronize' 的 lambda 只會被呼叫
               // 恰好一次，因此不會報告重新賦值
    }
    println(x) // 編譯器知道 lambda 將被明確呼叫，執行
               // 初始化，因此 'x' 在此處被視為已初始化
}
```

### stdlib 中的契約

``stdlib`` 已使用契約，這導致上述分析得到改進。這部分的契約是**穩定**的，這意味著您現在無需任何額外選擇加入（opt-ins）即可從改進的分析中受益：

```kotlin
//sampleStart
fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // 太棒了，smartcast 到非 null！
    }
}
//sampleEnd
fun main() {
    bar(null)
    bar("42")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 自訂契約

您可以為自己的函式宣告契約，但此功能為**實驗性**，因為目前的語法處於早期原型狀態，很可能會更改。另請注意，目前 Kotlin 編譯器不驗證契約，因此編寫正確且健全的契約是程式設計師的責任。

自訂契約透過呼叫 `contract` stdlib 函式引入，該函式提供了 DSL 範圍：

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

有關語法詳細資訊以及相容性注意事項，請參閱 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts.md)。

## 在變數中捕獲 when 主體

在 Kotlin 1.3 中，現在可以將 `when` 主體捕獲到一個變數中：

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

雖然之前也可以在 `when` 之前提取此變數，但 `when` 中的 `val` 會將其範圍正確限制在 `when` 的主體內，從而防止命名空間污染。[請在此處查看 `when` 的完整文件](control-flow.md#when-expressions-and-statements)。

## 介面伴隨物件中的 @JvmStatic 和 @JvmField

在 Kotlin 1.3 中，現在可以使用註解 `@JvmStatic` 和 `@JvmField` 標記介面 `companion` 物件的成員。在類別檔案中，此類成員將被提升到對應的介面並標記為 `static`。

例如，以下 Kotlin 程式碼：

```kotlin
interface Foo {
    companion object {
        @JvmField
        val answer: Int = 42

        @JvmStatic
        fun sayHello() {
            println("Hello, world!")
        }
    }
}
```

它等同於以下 Java 程式碼：

```java
interface Foo {
    public static int answer = 42;
    public static void sayHello() {
        // ...
    }
}
```

## 註解類別中的巢狀宣告

在 Kotlin 1.3 中，註解現在可以擁有巢狀類別、介面、物件和伴隨物件：

```kotlin
annotation class Foo {
    enum class Direction { UP, DOWN, LEFT, RIGHT }
    
    annotation class Bar

    companion object {
        fun foo(): Int = 42
        val bar: Int = 42
    }
}
```

## 無參數 main 函式

按照慣例，Kotlin 程式的進入點是一個簽名類似 `main(args: Array<String>)` 的函式，其中 `args` 代表傳遞給程式的命令列引數。然而，並非每個應用程式都支援命令列引數，因此此參數通常最終不會被使用。

Kotlin 1.3 引入了一種更簡單的 `main` 形式，它不帶任何參數。現在 Kotlin 中的「Hello, World」縮短了 19 個字元！

```kotlin
fun main() {
    println("Hello, world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 具有大 arity 的函式

在 Kotlin 中，函式型別表示為採用不同參數數量的泛型類別：`Function0<R>`、`Function1<P0, R>`、`Function2<P0, P1, R>` 等。這種方法存在一個問題，即此列表是有限的，目前在 `Function22` 處結束。

Kotlin 1.3 放寬了此限制，並增加了對具有更大 arity 的函式的支援：

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 42 more */, Any) -> Any) {
    block(Any(), Any(), ..., Any())
}
```

## 漸進模式

Kotlin 非常重視程式碼的穩定性和向下相容性：Kotlin 相容性政策規定，破壞性變更（例如，使原本能正常編譯的程式碼無法再編譯的變更）只能在主要版本（**1.2**、**1.3** 等）中引入。

我們相信許多使用者可以採用更快的週期，讓關鍵的編譯器錯誤修復立即到位，使程式碼更安全、更正確。因此，Kotlin 1.3 引入了 *漸進式* 編譯器模式，可以透過向編譯器傳遞引數 `-progressive` 來啟用。

在漸進模式下，語言語義中的一些修復可以立即到位。所有這些修復都具有兩個重要特性：

* 它們保留了原始碼與舊版編譯器的向下相容性，這意味著所有可由漸進式編譯器編譯的程式碼，非漸進式編譯器也能正常編譯。
* 它們只在某種意義上使程式碼更*安全* — 例如，某些不健全的 smartcast 可能會被禁止，生成程式碼的行為可能會變得更可預測/穩定，等等。

啟用漸進模式可能需要您重寫部分程式碼，但應該不會太多 — 漸進模式下啟用的所有修復都經過精心挑選、審查，並提供工具遷移協助。我們期望漸進模式將是任何積極維護且能快速更新到最新語言版本的程式碼庫的絕佳選擇。

## 行內類別

>行內類別目前處於 [Alpha](components-stability.md) 階段。它們未來可能會有不相容的變更，並需要手動遷移。
> 我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供有關此功能的意見回饋。
> 詳情請參閱[參考文件](inline-classes.md)。
>
{style="warning"}

Kotlin 1.3 引入了一種新型宣告 — `inline class`。行內類別可以視為普通類別的受限版本，特別是，行內類別必須只有一個屬性：

```kotlin
inline class Name(val s: String)
```

Kotlin 編譯器將利用此限制積極優化行內類別的執行時表示，並在可能的情況下用底層屬性的值替換其實例，從而消除建構函式呼叫、GC 壓力，並啟用其他優化：

```kotlin
inline class Name(val s: String)
//sampleStart
fun main() {
    // 在下一行中沒有發生建構函式呼叫，並且
    // 在執行時 'name' 只包含字串 "Kotlin"
    val name = Name("Kotlin")
    println(name.s) 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

詳情請參閱行內類別的[參考文件](inline-classes.md)。

## 無符號整數

> 無符號整數目前處於 [Beta](components-stability.md) 階段。
> 其實現已接近穩定，但未來可能需要遷移步驟。
> 我們將盡力將您需要進行的任何變更降至最低。
>
{style="warning"}

Kotlin 1.3 引入了無符號整數型別：

* `kotlin.UByte`：一個無符號 8 位元整數，範圍從 0 到 255
* `kotlin.UShort`：一個無符號 16 位元整數，範圍從 0 到 65535
* `kotlin.UInt`：一個無符號 32 位元整數，範圍從 0 到 2^32 - 1
* `kotlin.ULong`：一個無符號 64 位元整數，範圍從 0 到 2^64 - 1

大多數有符號型別的功能也支援其無符號對應型別：

```kotlin
fun main() {
//sampleStart
// 您可以使用文字後綴定義無符號型別
val uint = 42u 
val ulong = 42uL
val ubyte: UByte = 255u

// 您可以透過 stdlib 擴充功能將有符號型別轉換為無符號型別，反之亦然：
val int = uint.toInt()
val byte = ubyte.toByte()
val ulong2 = byte.toULong()

// 無符號型別支援類似的運算子：
val x = 20u + 22u
val y = 1u shl 8
val z = "128".toUByte()
val range = 1u..5u
//sampleEnd
println("ubyte: $ubyte, byte: $byte, ulong2: $ulong2")
println("x: $x, y: $y, z: $z, range: $range")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

詳情請參閱[無符號整數型別的參考文件](unsigned-integer-types.md)。

## @JvmDefault

>`@JvmDefault` 為 [實驗性](components-stability.md) 功能。它可能隨時被移除或更改。
> 僅用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供有關此功能的意見回饋。
>
{style="warning"}

Kotlin 針對多種 Java 版本，包括 Java 6 和 Java 7，其中介面中的預設方法是不允許的。為了您的方便，Kotlin 編譯器會繞過該限制，但此變通方法與 Java 8 中引入的 `default` 方法不相容。

這可能是 Java 互通性的問題，因此 Kotlin 1.3 引入了 `@JvmDefault` 註解。使用此註解標記的方法將作為 JVM 的 `default` 方法生成：

```kotlin
interface Foo {
    // 將作為 'default' 方法生成
    @JvmDefault
    fun foo(): Int = 42
}
```

> 警告！使用 `@JvmDefault` 註解您的 API 對二進位制相容性有嚴重影響。
在生產環境中使用 `@JvmDefault` 之前，請務必仔細閱讀[參考頁面](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)。
>
{style="warning"}

## 標準函式庫

### 多平台隨機

在 Kotlin 1.3 之前，所有平台上都沒有統一的方法來生成亂數 — 我們不得不求助於平台特定的解決方案，例如 JVM 上的 `java.util.Random`。此版本透過引入 `kotlin.random.Random` 類別來解決此問題，該類別在所有平台上均可用：

```kotlin
import kotlin.random.Random

fun main() {
//sampleStart
    val number = Random.nextInt(42)  // 數字範圍在 [0, limit) 之間
    println(number)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### isNullOrEmpty 和 orEmpty 擴充功能

`isNullOrEmpty` 和 `orEmpty` 擴充功能針對某些型別已存在於 stdlib 中。第一個函式在接收者為 `null` 或為空時返回 `true`，第二個函式在接收者為 `null` 時回退到一個空的實例。Kotlin 1.3 在集合、映射和物件陣列上提供了類似的擴充功能。

### 在兩個現有陣列之間複製元素

針對現有陣列型別（包括無符號陣列）的 `array.copyInto(targetArray, targetOffset, startIndex, endIndex)` 函式，使得在純 Kotlin 中實現基於陣列的容器變得更容易。

```kotlin
fun main() {
//sampleStart
    val sourceArr = arrayOf("k", "o", "t", "l", "i", "n")
    val targetArr = sourceArr.copyInto(arrayOfNulls<String>(6), 3, startIndex = 3, endIndex = 6)
    println(targetArr.contentToString())
    
    sourceArr.copyInto(targetArr, startIndex = 0, endIndex = 3)
    println(targetArr.contentToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### associateWith 函式

擁有一個鍵列表並希望透過將每個鍵與某些值關聯來建構映射，這是一種很常見的情況。之前可以透過 `associate { it to getValue(it) }` 函式來實現，但現在我們引入了一種更高效且易於探索的替代方案：`keys.associateWith { getValue(it) }`。

```kotlin
fun main() {
//sampleStart
    val keys = 'a'..'f'
    val map = keys.associateWith { it.toString().repeat(5).capitalize() }
    map.forEach { println(it) }
//sampleEnd
}
```

### ifEmpty 和 ifBlank 函式

集合、映射、物件陣列、字元序列和序列現在都具有 `ifEmpty` 函式，它允許指定一個備用值，如果接收者為空，則將使用該值代替接收者：

```kotlin
fun main() {
//sampleStart
    fun printAllUppercase(data: List<String>) {
        val result = data
        .filter { it.all { c -> c.isUpperCase() } }
            .ifEmpty { listOf("<no uppercase>") }
        result.forEach { println(it) }
    }
    
    printAllUppercase(listOf("foo", "Bar"))
    printAllUppercase(listOf("FOO", "BAR"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此外，字元序列和字串還有一個 `ifBlank` 擴充功能，其作用與 `ifEmpty` 相同，但檢查字串是否全為空白，而不是是否為空。

```kotlin
fun main() {
//sampleStart
    val s = "    
"
    println(s.ifBlank { "<blank>" })
    println(s.ifBlank { null })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 反射中的密封類別

我們已向 `kotlin-reflect` 添加了一個新 API，可用於列舉 `sealed` 類別的所有直接子型別，即 `KClass.sealedSubclasses`。

### 小幅變更

* `Boolean` 型別現在擁有伴隨物件。
* `Any?.hashCode()` 擴充功能，對 `null` 返回 0。
* `Char` 現在提供 `MIN_VALUE` 和 `MAX_VALUE` 常數。
* `SIZE_BYTES` 和 `SIZE_BITS` 常數位於基本型別伴隨物件中。

## 工具

### IDE 中的程式碼風格支援

Kotlin 1.3 引入了對 IntelliJ IDEA 中[建議程式碼風格](coding-conventions.md)的支援。請查看[此頁面](code-style-migration-guide.md)以獲取遷移指南。

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 是一個函式庫，它提供在 Kotlin 中物件的跨平台（反）序列化支援。以前它是一個單獨的專案，但自 Kotlin 1.3 起，它隨 Kotlin 編譯器發佈，與其他編譯器外掛程式地位相同。主要區別在於，您不再需要手動留意 Serialization IDE 外掛程式與您正在使用的 Kotlin IDE 外掛程式版本是否相容：現在 Kotlin IDE 外掛程式已包含序列化！

詳情請參閱[此處](https://github.com/Kotlin/kotlinx.serialization#current-project-status)。

> 儘管 kotlinx.serialization 現已隨 Kotlin 編譯器發佈，但在 Kotlin 1.3 中它仍被視為實驗性功能。
>
{style="warning"}

### 腳本更新

>腳本為 [實驗性](components-stability.md) 功能。它可能隨時被移除或更改。
> 僅用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供有關此功能的意見回饋。
>
{style="warning"}

Kotlin 1.3 持續發展和改進腳本 API，引入了一些實驗性支援，用於腳本自訂，例如添加外部屬性、提供靜態或動態依賴項等。

欲了解更多詳細資訊，請參閱 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)。

### Scratch 檔案支援

Kotlin 1.3 引入了對可執行 Kotlin *Scratch 檔案* 的支援。*Scratch 檔案* 是一種副檔名為 .kts 的 Kotlin 腳本檔案，您可以在編輯器中直接運行並獲取評估結果。

有關詳細資訊，請參閱[Scratch 檔案的一般文件](https://www.jetbrains.com/help/idea/scratches.html)。