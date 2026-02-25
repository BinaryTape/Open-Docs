[//]: # (title: Kotlin 1.3 新功能)

<web-summary>閱讀 Kotlin 1.3 版本說明，涵蓋新的語言特性、Kotlin 多平台、JVM、Native、JS 的更新，以及 Gradle 和 Maven 的建置工具支援。</web-summary>

_發布日期：2018 年 10 月 29 日_

> 有關 Kotlin 發布週期的資訊，請參閱 [Kotlin 發布程序](releases.md)。
>
{style="tip"}

## 協同程式正式發布

經過長時間且廣泛的實戰測試，協同程式（coroutines）現在正式發布了！這意味著從 Kotlin 1.3 開始，語言支援和 API 已[完全穩定](components-stability.md)。請查看新的[協同程式概覽](coroutines-overview.md)頁面。

Kotlin 1.3 在 `suspend` 函式上引入了可呼叫參照，並在反射 API 中支援協同程式。

## Kotlin/Native

Kotlin 1.3 繼續改進並完善 Native 目標。詳情請參閱 [Kotlin/Native 概覽](native-overview.md)。

## 多平台專案

在 1.3 中，我們完全重構了多平台專案（multiplatform projects）的模型，以提高表達力和靈活性，並使共享通用程式碼更加容易。此外，Kotlin/Native 現在也作為支援的目標之一！

與舊模型的主要區別在於：

  * 在舊模型中，通用程式碼和平台特定程式碼需要放在不同的模組中，並透過 `expectedBy` 相依性進行連結。現在，通用程式碼和平台特定程式碼放在同一個模組的不同原始碼根目錄下，使專案配置更加容易。
  * 現在針對不同的支援平台提供了大量的[預設平台設定](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)。
  * [相依性配置](https://kotlinlang.org/docs/multiplatform/multiplatform-add-dependencies.html)已更改；現在為每個原始碼根目錄分別指定相依性。
  * 原始碼集（source sets）現在可以在任意平台子集之間共享（例如，在針對 JS、Android 和 iOS 的模組中，您可以擁有一個僅在 Android 和 iOS 之間共享的原始碼集）。
  * 現在支援[發布多平台程式庫](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html)。

欲了解更多資訊，請參閱[多平台程式設計文件](https://kotlinlang.org/docs/multiplatform/get-started.html)。

## 契約

Kotlin 編譯器執行廣泛的靜態分析以提供警告並減少樣板程式碼。其中最顯著的功能之一是智慧轉換（smartcasts）——能夠根據執行的型別檢查自動執行轉換：

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // 編譯器自動將 's' 轉換為 'String'
}
```

然而，一旦這些檢查被提取到單獨的函式中，所有的智慧轉換就會立即消失：

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // 沒有智慧轉換 :(
}
```

為了改善此類情況下的行為，Kotlin 1.3 引入了名為「契約（contracts）」的實驗性機制。

*契約*允許函式以編譯器能理解的方式明確描述其行為。目前支援兩大類案例：

* 透過宣告函式呼叫結果與傳遞的引數值之間的關係，改進智慧轉換分析：

```kotlin
fun require(condition: Boolean) {
    // 這是一種語法形式，告訴編譯器：
    // 「如果此函式成功回傳，則傳遞的 'condition' 為 true」
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // s 在這裡被智慧轉換為 'String'，因為否則
    // 'require' 會拋出例外
}
```

* 改進存在高階函式時的變數初始化分析：

```kotlin
fun synchronize(lock: Any?, block: () -> Unit) {
    // 它告訴編譯器：
    // 「此函式將在此時此地呼叫 'block'，且恰好一次」
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // 編譯器知道傳遞給 'synchronize' 的 lambda 會被呼叫
               // 恰好一次，因此不會回報重複指派
    }
    println(x) // 編譯器知道 lambda 一定會被呼叫並執行
               // 初始化，因此這裡認為 'x' 已初始化
}
```

### 標準函式庫中的契約

`stdlib` 已經使用了契約，這帶來了上述分析的改進。這部分契約是**穩定**的，這意味著您現在就可以從改進的分析中受益，而無需任何額外的選用（opt-ins）：

```kotlin
//sampleStart
fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // 耶，智慧轉換為非 null！
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

可以為您自己的函式宣告契約，但此功能是**實驗性的**，因為目前的語法處於早期原型階段，極有可能會發生變化。另外請注意，目前 Kotlin 編譯器不會驗證契約，因此編寫正確且合理的契約是程式設計師的責任。

自訂契約是透過呼叫 `contract` 標準函式庫函式引入的，該函式提供了 DSL 作用域：

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

有關語法詳情以及相容性通知，請參閱 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts.md)。

## 將 when 主體擷取到變數中

在 Kotlin 1.3 中，現在可以將 `when` 的主體擷取到變數中：

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

雖然以前也可以在 `when` 之前提取此變數，但 `when` 中的 `val` 將其作用域正確限制在 `when` 的主體內，從而防止命名空間污染。[在此處查看關於 `when` 的完整文件](control-flow.md#when-expressions-and-statements)。

## 介面伴隨物件中的 @JvmStatic 和 @JvmField

在 Kotlin 1.3 中，可以使用註解 `@JvmStatic` 和 `@JvmField` 標記介面的 `companion` 物件成員。在類別檔案中，此類成員將被提升到對應的介面並標記為 `static`。

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

它等同於這段 Java 程式碼：

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

## 無參數的 main

按照慣例，Kotlin 程式的入口點是一個簽章如 `main(args: Array<String>)` 的函式，其中 `args` 代表傳遞給程式的命令列引數。然而，並非每個應用程式都支援命令列引數，因此這個參數通常最終未被使用。

Kotlin 1.3 引入了一種更簡單的 `main` 形式，它不帶參數。現在 Kotlin 中的 "Hello, World" 縮短了 19 個字元！

```kotlin
fun main() {
    println("Hello, world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 具有大參數個數的函式

在 Kotlin 中，泛型類別代表函式型別，這些類別接受不同數量的參數：`Function0<R>`、`Function1<P0, R>`、`Function2<P0, P1, R>` 等。這種方法存在一個問題，即這個清單是有限的，目前以 `Function22` 結尾。

Kotlin 1.3 放寬了這一限制，並增加了對具有更大參數個數（arity）的函式的支援：

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 還有 42 個 */, Any) -> Any) {
    block(Any(), Any(), ..., Any())
}
```

## 漸進模式

Kotlin 非常重視程式碼的穩定性和回溯相容性：Kotlin 相容性政策規定，重大變更（例如，使以前編譯正常的程式碼現在無法編譯的變更）只能在主要版本（**1.2**、**1.3** 等）中引入。

我們相信許多使用者可以接受更快的週期，讓關鍵的編譯器錯誤修正立即送達，使程式碼更加安全和正確。因此，Kotlin 1.3 引入了「漸進（progressive）」編譯器模式，可以透過向編譯器傳遞引數 `-progressive` 來啟用。

在漸進模式下，語言語義中的一些修正可以立即送達。所有這些修正都有兩個重要的特性：

* 它們保持原始碼與舊編譯器的回溯相容性，這意味著所有由漸進編譯器編譯的程式碼都能被非漸進編譯器正常編譯。
* 在某種意義上，它們只會使程式碼更*安全*——例如，可以禁止一些不合理的智慧轉換，可以更改生成的程式碼行為以使其更具可預測性/穩定性，等等。

啟用漸進模式可能需要您重寫一些程式碼，但負擔不應太大——在漸進模式下啟用的所有修正都是經過仔細挑选、審核並提供工具遷移協助的。我們預期漸進模式對於任何主動維護且快速更新到最新語言版本的程式碼庫來說都是一個不錯的選擇。

## 內嵌類別

>內嵌類別（inline classes）目前處於 [Alpha](components-stability.md) 階段。它們可能會發生不相容的變更，並在未來需要手動遷移。
> 我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供回饋。
> 詳情請參閱[參考資料](inline-classes.md)。
>
{style="warning"}

Kotlin 1.3 引入了一種新的宣告類型——`inline class`。內嵌類別可以被視為普通類別的限制版本，特別是內嵌類別必須恰好有一個屬性：

```kotlin
inline class Name(val s: String)
```

Kotlin 編譯器將利用此限制來積極優化內嵌類別的執行時表示，並在可能的情況下將其實體替換為基礎屬性的值，從而消除建構函式呼叫、減輕 GC 壓力，並啟用其他優化：

```kotlin
inline class Name(val s: String)
//sampleStart
fun main() {
    // 在下一行中沒有發生建構函式呼叫，且
    // 在執行時 'name' 僅包含字串 "Kotlin"
    val name = Name("Kotlin")
    println(name.s) 
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

詳情請參閱內嵌類別的[參考資料](inline-classes.md)。

## 無符號整數

> 無符號整數（unsigned integers）目前處於 [Beta](components-stability.md) 階段。
> 它們的實作已趨於穩定，但未來可能需要遷移步驟。
> 我們將盡力減少您必須進行的任何更改。
>
{style="warning"}

Kotlin 1.3 引入了無符號整數型別：

* `kotlin.UByte`：無符號 8 位元整數，範圍從 0 到 255
* `kotlin.UShort`：無符號 16 位元整數，範圍從 0 到 65535
* `kotlin.UInt`：無符號 32 位元整數，範圍從 0 到 2^32 - 1
* `kotlin.ULong`：無符號 64 位元整數，範圍從 0 到 2^64 - 1

有無符號整數也支援有符號型別的大部分功能：

```kotlin
fun main() {
//sampleStart
// 您可以使用常值後綴定義無符號型別
val uint = 42u 
val ulong = 42uL
val ubyte: UByte = 255u

// 您可以透過標準函式庫擴充功能將有符號型別轉換為無符號型別，反之亦然：
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

詳情請參閱[參考資料](unsigned-integer-types.md)。

## @JvmDefault

>`@JvmDefault` 目前是[實驗性的](components-stability.md)。它隨時可能被刪除或更改。
> 僅將其用於評估目的。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供回饋。
>
{style="warning"}

Kotlin 針對廣泛的 Java 版本，包括不允許在介面中使用預設方法的 Java 6 和 Java 7。為了您的方便，Kotlin 編譯器解決了這個限制，但這種解決方法與 Java 8 中引入的 `default` 方法不相容。

這可能是 Java 互通性的問題，因此 Kotlin 1.3 引入了 `@JvmDefault` 註解。使用此註解標記的方法將為 JVM 生成為 `default` 方法：

```kotlin
interface Foo {
    // 將被生成為 'default' 方法
    @JvmDefault
    fun foo(): Int = 42
}
```

> 警告！使用 `@JvmDefault` 標記您的 API 會對二進位相容性產生嚴重影響。
在生產環境中使用 `@JvmDefault` 之前，請務必仔細閱讀[參考頁面](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)。
>
{style="warning"}

## 標準函式庫

### 多平台隨機數

在 Kotlin 1.3 之前，沒有統一的方法在所有平台上生成隨機數——我們必須求助於平台特定的解決方案，如 JVM 上的 `java.util.Random`。此版本透過引入類別 `kotlin.random.Random` 解決了這個問題，該類別在所有平台上都可用：

```kotlin
import kotlin.random.Random

fun main() {
//sampleStart
    val number = Random.nextInt(42)  // 數字在 [0, limit) 範圍內
    println(number)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### isNullOrEmpty 與 orEmpty 擴充功能

某些型別的 `isNullOrEmpty` 和 `orEmpty` 擴充功能已存在於標準函式庫中。第一個在接收者為 `null` 或為空時回傳 `true`，第二個在接收者為 `null` 時回退到空實體。Kotlin 1.3 在集合、映射和物件陣列上提供了類似的擴充功能。

### 在兩個現有陣列之間複製元素

針對現有陣列型別（包括無符號陣列）的 `array.copyInto(targetArray, targetOffset, startIndex, endIndex)` 函式，使得在純 Kotlin 中實作基於陣列的容器變得更加容易。

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

擁有鍵列表並希望透過將每個鍵與某個值關聯來建立映射是非常常見的情況。以前可以透過 `associate { it to getValue(it) }` 函式來實現，但現在我們引入了一個更高效且更易於探索的替代方案：`keys.associateWith { getValue(it) }`。

```kotlin
fun main() {
//sampleStart
    val keys = 'a'..'f'
    val map = keys.associateWith { it.toString().repeat(5).capitalize() }
    map.forEach { println(it) }
//sampleEnd
}
```

### ifEmpty 與 ifBlank 函式

集合、映射、物件陣列、字元序列和序列現在擁有 `ifEmpty` 函式，它允許指定一個回退值，如果接收者為空，則將使用該值代替接收者：

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

此外，字元序列和字串還擁有 `ifBlank` 擴充功能，其功能與 `ifEmpty` 相同，但它檢查字串是否全是空白字元而非僅檢查是否為空。

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

我們為 `kotlin-reflect` 增加了一個新的 API，可用於列舉 `sealed` 類別的所有直接子型別，即 `KClass.sealedSubclasses`。

### 較小的變更

* `Boolean` 型別現在有了伴隨物件。
* `Any?.hashCode()` 擴充功能，對 `null` 回傳 0。
* `Char` 現在提供 `MIN_VALUE` 和 `MAX_VALUE` 常數。
* 基本型別伴隨物件中的 `SIZE_BYTES` 和 `SIZE_BITS` 常數。

## 工具

### IDE 中的程式碼風格支援

Kotlin 1.3 在 IntelliJ IDEA 中引入了對[建議程式碼風格](coding-conventions.md)的支援。請查看[此頁面](code-style-migration-guide.md)了解遷移指南。

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 是一個為 Kotlin 提供多平台物件（反）序列化支援的程式庫。之前它是一個獨立的專案，但從 Kotlin 1.3 開始，它與 Kotlin 編譯器發行版一起提供，與其他編譯器外掛程式地位相同。主要區別在於您不需要手動關注序列化 IDE 外掛程式是否與您使用的 Kotlin IDE 外掛程式版本相容：現在 Kotlin IDE 外掛程式已經包含了序列化功能！

詳情請參閱[此處](https://github.com/Kotlin/kotlinx.serialization#current-project-status)。

> 儘管 kotlinx.serialization 現在隨 Kotlin 編譯器發行版一起提供，但它在 Kotlin 1.3 中仍被視為實驗性功能。
>
{style="warning"}

### 指令碼更新

>指令碼編寫（Scripting）目前是[實驗性的](components-stability.md)。它隨時可能被刪除或更改。
> 僅將其用於評估目的。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供回饋。
>
{style="warning"}

Kotlin 1.3 繼續發展並改進指令碼 API，引入了一些對指令碼自訂的實驗性支援，例如增加外部屬性、提供靜態或動態相依性等。

欲了解更多詳情，請參閱 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)。

### 暫存檔支援

Kotlin 1.3 引入了對可執行 Kotlin *暫存檔（scratch files）*的支援。*暫存檔*是一個副檔名為 .kts 的 Kotlin 指令碼檔案，您可以直接在編輯器中執行並取得評估結果。

詳情請參閱通用的[暫存檔文件](https://www.jetbrains.com/help/idea/scratches.html)。