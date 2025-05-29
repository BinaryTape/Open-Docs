[//]: # (title: Kotlin 1.3 新功能一覽)

_發佈日期：2018 年 10 月 29 日_

## 協程 (Coroutines) 正式發佈

經過漫長而廣泛的實戰測試後，協程現在正式發佈了！這意味著從 Kotlin 1.3 開始，其語言支援和 API [完全穩定](components-stability.md)。請查看新的[協程概覽](coroutines-overview.md)頁面。

Kotlin 1.3 引入了暫停函式 (suspend-functions) 的可呼叫引用，並在反射 API 中支援協程。

## Kotlin/Native

Kotlin 1.3 持續改進和完善 Native 目標。請參閱 [Kotlin/Native 概覽](native-overview.md)以獲取詳細資訊。

## 多平台專案 (Multiplatform projects)

在 1.3 中，我們徹底重新設計了多平台專案的模型，以提升表達性與靈活性，並使共用通用程式碼更容易。此外，Kotlin/Native 現在作為其中一個目標受到支援！

與舊模型的關鍵差異在於：

  * 在舊模型中，通用程式碼和平台特定程式碼需要放置在單獨的模組中，透過 `expectedBy` 依賴項連結。現在，通用程式碼和平台特定程式碼放置在同一模組的不同原始碼根目錄中，使專案更容易配置。
  * 現在針對不同的支援平台，有大量[預設平台配置](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)。
  * [依賴項配置](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-add-dependencies.html)已更改；現在依賴項是為每個原始碼根目錄單獨指定。
  * 原始碼集 (Source sets) 現在可以在任意平台子集之間共用 (例如，在以 JS、Android 和 iOS 為目標的模組中，您可以有一個僅在 Android 和 iOS 之間共用的原始碼集)。
  * [發佈多平台函式庫](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)現在受到支援。

欲了解更多資訊，請參閱[多平台程式設計文件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)。

## 契約 (Contracts)

Kotlin 編譯器執行廣泛的靜態分析以提供警告並減少樣板程式碼。其中最顯著的功能之一是智慧型轉換 (smartcasts) — 能夠根據執行的型別檢查自動進行型別轉換：

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // 編譯器自動將 's' 轉換為 'String'
}
```

然而，一旦這些檢查被提取到單獨的函式中，所有的智慧型轉換就會立即消失：

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // 沒有智慧型轉換 :(
}
```

為了改進此類情況下的行為，Kotlin 1.3 引入了稱為 *契約* (contracts) 的實驗性機制。

*契約* 允許函式以編譯器理解的方式明確描述其行為。目前，支援兩大類情況：

* 透過宣告函式呼叫結果與傳入引數值之間的關係來改進智慧型轉換分析：

```kotlin
fun require(condition: Boolean) {
    // 這是告知編譯器的語法形式：
    // 「如果此函式成功返回，則傳入的 'condition' 為 true」
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // 這裡 's' 被智慧型轉換為 'String'，因為否則
    // 'require' 會拋出例外
}
```

* 在高階函式存在的情況下改進變數初始化分析：

```kotlin
fun synchronize(lock: Any?, block: () -> Unit) {
    // 它告訴編譯器：
    // 「此函式將在此時此地呼叫 'block'，且只呼叫一次」
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // 編譯器知道傳遞給 'synchronize' 的 lambda 會被呼叫
               // 且只呼叫一次，因此不會報告重新賦值
    }
    println(x) // 編譯器知道 lambda 將被確定呼叫，執行
               // 初始化，因此 'x' 在這裡被認為已初始化
}
```

### stdlib 中的契約

`stdlib` 已利用契約，這導致上述分析的改進。契約的這部分是 **穩定** 的，這意味著您現在無需任何額外選擇加入 (opt-in) 即可從改進的分析中受益：

```kotlin
//sampleStart
fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // 太棒了，智慧型轉換為非空！
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

可以為您自己的函式宣告契約，但此功能為 **實驗性功能**，因為目前的語法處於早期原型狀態，很可能會改變。另請注意，目前 Kotlin 編譯器不驗證契約，因此程式設計師有責任編寫正確且健全的契約。

自訂契約是透過呼叫 `contract` stdlib 函式引入的，該函式提供 DSL 作用域：

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

請參閱 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts.md) 中關於語法細節以及相容性注意事項。

## 在變數中捕獲 when 主體

在 Kotlin 1.3 中，現在可以將 `when` 主體捕獲到變數中：

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

雖然之前已經可以在 `when` 之前提取此變數，但 `when` 中的 `val` 將其作用域適當地限制在 `when` 的主體中，從而防止命名空間污染。 [請參閱此處的 `when` 完整文件](control-flow.md#when-expressions-and-statements)。

## 介面伴隨物件中的 @JvmStatic 和 @JvmField

在 Kotlin 1.3 中，可以為介面 `companion` 物件的成員標記 `@JvmStatic` 和 `@JvmField` 註解。在類別檔案 (classfile) 中，此類成員將提升到相應的介面並標記為 `static`。

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

在 Kotlin 1.3 中，註解可以擁有巢狀類別、介面、物件和伴隨物件：

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

## 無參數的 main 函式

按照慣例，Kotlin 程式的進入點是簽章類似 `main(args: Array<String>)` 的函式，其中 `args` 代表傳遞給程式的命令列引數。然而，並非每個應用程式都支援命令列引數，因此這個參數通常最終會未使用。

Kotlin 1.3 引入了一種不帶參數的更簡單形式的 `main`。現在 Kotlin 中的 "Hello, World" 短了 19 個字元！

```kotlin
fun main() {
    println("Hello, world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 具有大元數 (Big Arity) 的函式

在 Kotlin 中，函式型別表示為接受不同數量參數的泛型類別：`Function0<R>`、`Function1<P0, R>`、`Function2<P0, P1, R>` 等。這種方法存在一個問題，即此列表是有限的，目前以 `Function22` 結束。

Kotlin 1.3 放寬了此限制，並新增了對具有更大元數的函式支援：

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 42 more */, Any) -> Any) {
    block(Any(), Any(), ..., Any())
}
```

## 漸進模式 (Progressive mode)

Kotlin 非常重視程式碼的穩定性和向後相容性：Kotlin 相容性政策規定，破壞性變更 (例如，使過去可以正常編譯的程式碼現在無法編譯的變更) 只能在主要版本 (**1.2**、**1.3** 等) 中引入。

我們相信許多使用者可以採用更快的週期，其中關鍵編譯器錯誤修正會立即發佈，使程式碼更安全、更正確。因此，Kotlin 1.3 引入了 *漸進式* 編譯器模式，可以透過向編譯器傳遞參數 `-progressive` 來啟用。

在漸進模式下，語言語義上的一些修正可以立即發佈。所有這些修正都具有兩個重要特性：

* 它們保持原始碼與舊編譯器的向後相容性，這意味著所有可由漸進式編譯器編譯的程式碼都可以由非漸進式編譯器正常編譯。
* 它們在某種意義上只讓程式碼更 *安全* — 例如，一些不健全的智慧型轉換可能被禁止，生成的程式碼行為可能變得更可預測/穩定，等等。

啟用漸進模式可能要求您重寫部分程式碼，但數量不應太多 — 漸進模式下啟用的所有修正都經過精心挑選、審查，並提供工具遷移協助。我們期望漸進模式將是任何積極維護且快速更新到最新語言版本的程式碼庫的理想選擇。

## 行內類別 (Inline classes)

>行內類別目前處於 [Alpha](components-stability.md) 階段。它們可能產生不相容的變更並需要在未來手動遷移。
> 我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供回饋。
> 請參閱 [參考文件](inline-classes.md) 以獲取詳細資訊。
>
{style="warning"}

Kotlin 1.3 引入了一種新型的宣告 — `inline class`。行內類別可以看作是普通類別的受限版本，特別是，行內類別必須恰好有一個屬性：

```kotlin
inline class Name(val s: String)
```

Kotlin 編譯器將利用此限制來積極最佳化行內類別的執行時表示，並在可能的情況下將其實例替換為底層屬性的值，從而消除建構函式呼叫、減少垃圾收集 (GC) 壓力並啟用其他最佳化：

```kotlin
inline class Name(val s: String)
//sampleStart
fun main() {
    // 在下一行中，沒有建構函式呼叫發生，且
    // 在執行時 'name' 僅包含字串 "Kotlin"
    val name = Name("Kotlin")
    println(name.s) 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

請參閱行內類別的 [參考文件](inline-classes.md) 以獲取詳細資訊。

## 無符號整數 (Unsigned integers)

>無符號整數目前處於 [Beta](components-stability.md) 階段。
> 其實現已接近穩定，但未來可能需要遷移步驟。
> 我們將盡力減少您必須進行的任何變更。
>
{style="warning"}

Kotlin 1.3 引入了無符號整數型別：

* `kotlin.UByte`: 一個 8 位元無符號整數，範圍從 0 到 255
* `kotlin.UShort`: 一個 16 位元無符號整數，範圍從 0 到 65535
* `kotlin.UInt`: 一個 32 位元無符號整數，範圍從 0 到 2^32 - 1
* `kotlin.ULong`: 一個 64 位元無符號整數，範圍從 0 到 2^64 - 1

有符號型別的大部分功能也支援無符號對應型別：

```kotlin
fun main() {
//sampleStart
// 您可以使用字面量後綴定義無符號型別
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

請參閱 [參考文件](unsigned-integer-types.md) 以獲取詳細資訊。

## @JvmDefault

>`@JvmDefault` 是 [實驗性](components-stability.md) 功能。它可能隨時被捨棄或更改。
> 僅用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供回饋。
>
{style="warning"}

Kotlin 針對廣泛的 Java 版本，包括 Java 6 和 Java 7，其中介面中的預設方法不被允許。為方便起見，Kotlin 編譯器解決了該限制，但此解決方案與 Java 8 中引入的 `default` 方法不相容。

這可能是一個 Java 互通性問題，因此 Kotlin 1.3 引入了 `@JvmDefault` 註解。使用此註解標記的方法將為 JVM 生成為 `default` 方法：

```kotlin
interface Foo {
    // 將生成為 'default' 方法
    @JvmDefault
    fun foo(): Int = 42
}
```

> 警告！使用 `@JvmDefault` 註解您的 API 對二進位相容性有嚴重影響。
> 在生產環境中使用 `@JvmDefault` 之前，請務必仔細閱讀 [參考頁面](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)。
>
{style="warning"}

## 標準函式庫 (Standard library)

### 多平台亂數 (Multiplatform random)

在 Kotlin 1.3 之前，沒有統一的方式在所有平台上生成亂數 — 我們必須訴諸於平台特定解決方案，例如 JVM 上的 `java.util.Random`。此版本透過引入 `kotlin.random.Random` 類別解決了這個問題，該類別在所有平台上都可用：

```kotlin
import kotlin.random.Random

fun main() {
//sampleStart
    val number = Random.nextInt(42)  // 數字範圍為 [0, limit)
    println(number)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### isNullOrEmpty 和 orEmpty 擴充功能

`isNullOrEmpty` 和 `orEmpty` 擴充功能對於某些型別已存在於 stdlib 中。第一個在接收者為 `null` 或空時返回 `true`，第二個則在接收者為 `null` 時回退到空實例。Kotlin 1.3 在集合、映射和物件陣列上提供類似的擴充功能。

### 在兩個現有陣列之間複製元素

現有陣列型別 (包括無符號陣列) 的 `array.copyInto(targetArray, targetOffset, startIndex, endIndex)` 函式，使在純 Kotlin 中實現基於陣列的容器變得更容易。

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

### associateWith

擁有一個鍵列表並希望透過將每個鍵與某些值關聯來建構映射是一種很常見的情況。以前可以透過 `associate { it to getValue(it) }` 函式來實現，但現在我們引入了一種更高效且易於探索的替代方案：`keys.associateWith { getValue(it) }`。

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

集合、映射、物件陣列、字元序列和序列現在都具有 `ifEmpty` 函式，它允許指定一個回退值，如果接收者為空，則將其用於取代接收者：

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

此外，字元序列和字串還有 `ifBlank` 擴充功能，其作用與 `ifEmpty` 相同，但檢查字串是否全為空白字元而非空。

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

### 反射中的密封類別 (Sealed classes)

我們已向 `kotlin-reflect` 新增了一個新的 API，可用於列舉 `sealed` 類別的所有直接子型別，即 `KClass.sealedSubclasses`。

### 其他小幅變更

* `Boolean` 型別現在有伴隨物件 (companion)。
* `Any?.hashCode()` 擴充功能，對 `null` 返回 0。
* `Char` 現在提供 `MIN_VALUE` 和 `MAX_VALUE` 常數。
* 基本型別伴隨物件 (primitive type companions) 中的 `SIZE_BYTES` 和 `SIZE_BITS` 常數。

## 工具 (Tooling)

### IDE 中的程式碼風格支援

Kotlin 1.3 在 IntelliJ IDEA 中引入了對 [推薦程式碼風格](coding-conventions.md) 的支援。請查看[此頁面](code-style-migration-guide.md)以獲取遷移指南。

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 是一個提供 Kotlin 物件序列化和反序列化多平台支援的函式庫。以前，它是一個單獨的專案，但自 Kotlin 1.3 以來，它隨 Kotlin 編譯器發行版一起發布，與其他編譯器外掛程式地位相同。主要區別在於您無需手動注意序列化 IDE 外掛程式與您正在使用的 Kotlin IDE 外掛程式版本相容：現在 Kotlin IDE 外掛程式已包含序列化功能！

請參閱此處以獲取 [詳細資訊](https://github.com/Kotlin/kotlinx.serialization#current-project-status)。

> 即使 kotlinx.serialization 現在隨 Kotlin 編譯器發行版一起發布，它在 Kotlin 1.3 中仍被認為是實驗性功能。
>
{style="warning"}

### 指令碼更新 (Scripting update)

>指令碼目前處於 [實驗性](components-stability.md) 階段。它可能隨時被捨棄或更改。
> 僅用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供回饋。
>
{style="warning"}

Kotlin 1.3 持續演進並改進指令碼 API，引入了對指令碼客製化的一些實驗性支援，例如新增外部屬性、提供靜態或動態依賴項等等。

欲了解更多詳細資訊，請查閱 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)。

### 草稿檔案支援 (Scratches support)

Kotlin 1.3 引入了對可執行 Kotlin *草稿檔案* 的支援。*草稿檔案* 是一個 .kts 副檔名的 Kotlin 指令碼檔案，您可以在編輯器中直接執行並獲取評估結果。

請查閱一般的 [草稿檔案文件](https://www.jetbrains.com/help/idea/scratches.html) 以獲取詳細資訊。