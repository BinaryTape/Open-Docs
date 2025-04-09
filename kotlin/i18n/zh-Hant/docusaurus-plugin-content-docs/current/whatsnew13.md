---
title: "Kotlin 1.3 的新特性"
---
_發布日期：2018 年 10 月 29 日_

## 協程 (Coroutines) 發布

經過長時間且廣泛的測試，協程 (coroutines) 現在正式發布了！這表示從 Kotlin 1.3 開始，語言支援和 API 都是[完全穩定](components-stability)的。請查看新的[協程 (coroutines) 總覽](coroutines-overview)頁面。

Kotlin 1.3 引入了 `suspend` 函數的可調用參考 (callable references)，並支援 reflection API 中的協程 (coroutines)。

## Kotlin/Native

Kotlin 1.3 繼續改進和完善 Native 目標。有關詳細資訊，請參閱 [Kotlin/Native 總覽](native-overview)。

## 多平台專案 (Multiplatform projects)

在 1.3 中，我們完全重做了多平台專案 (multiplatform projects) 的模型，以提高表達性和靈活性，並使共享通用程式碼更容易。此外，Kotlin/Native 現在也支援作為目標之一！

與舊模型的主要區別在於：

  * 在舊模型中，通用程式碼和平台特定程式碼需要放置在單獨的模組中，並透過 `expectedBy` 依賴項連結。
    現在，通用程式碼和平台特定程式碼放置在同一模組的不同 source root 中，從而使專案更易於配置。
  * 現在有大量 [preset platform configurations](multiplatform-dsl-reference#targets) 用於不同的支援平台。
  * [dependencies configuration](multiplatform-add-dependencies) 已更改；現在可以為每個 source root 分別指定依賴項。
  * Source set 現在可以在任意平台子集之間共享
  (例如，在以 JS、Android 和 iOS 為目標的模組中，您可以擁有一個僅在 Android 和 iOS 之間共享的 source set)。
  * 現在支援[發布多平台函式庫 (multiplatform libraries)](multiplatform-publish-lib)。

有關更多資訊，請參閱 [multiplatform programming documentation](multiplatform-intro)。

## 契約 (Contracts)

Kotlin 編譯器會執行廣泛的靜態分析，以提供警告並減少樣板程式碼。最值得注意的功能之一是智能轉換 (smartcasts) — 能夠根據執行的類型檢查自動執行轉換：

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // 編譯器自動將 's' 轉換為 'String'
}
```

但是，一旦將這些檢查提取到單獨的函數中，所有智能轉換 (smartcasts) 都會立即消失：

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // 沒有智能轉換 (smartcast) :(
}
```

為了改善這種情況下的行為，Kotlin 1.3 引入了一種名為*契約 (contracts)* 的實驗性機制。

*契約 (Contracts)* 允許函數以編譯器可以理解的方式顯式描述其行為。
目前，支援兩大類案例：

* 透過宣告函數呼叫結果與傳遞的參數值之間的關係來改進智能轉換 (smartcasts) 分析：

```kotlin
fun require(condition: Boolean) {
    // 這是一種語法形式，它告訴編譯器：
    // “如果此函數成功返回，則傳遞的 'condition' 為 true”
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // 在此處將 s 智能轉換 (smartcast) 為 'String'，因為否則
    // 'require' 會拋出異常
}
```

* 在存在高階函數的情況下，改進變數初始化分析：

```kotlin
fun synchronize(lock: Any?, block: () `->` Unit) {
    // 它告訴編譯器：
    // “此函數將在此處和現在調用 'block'，並且只調用一次”
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // 編譯器知道傳遞給 'synchronize' 的 lambda 會被調用
               // 恰好一次，因此不會報告重新賦值
    }
    println(x) // 編譯器知道 lambda 肯定會被調用，執行
               // 初始化，因此 'x' 在此處被視為已初始化
}
```

### stdlib 中的契約 (Contracts)

`stdlib` 已經在使用契約 (contracts)，這會改進上述分析。
契約 (contracts) 的這部分是**穩定的**，這意味著您可以立即從改進的分析中受益，而無需任何額外的選擇加入 (opt-ins)：

```kotlin

fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // 耶，智能轉換 (smartcast) 為 not-null!
    }
}

fun main() {
    bar(null)
    bar("42")
}
```

### 自訂契約 (Custom contracts)

可以為您自己的函數宣告契約 (contracts)，但此功能是**實驗性的**，因為目前的語法
處於早期原型狀態，很可能會更改。另請注意，目前 Kotlin 編譯器
不驗證契約 (contracts)，因此編寫正確且合理的契約 (contracts) 是程式設計師的責任。

自訂契約 (custom contracts) 由對 `contract` stdlib 函數的呼叫引入，該函數提供 DSL 範圍：

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

請參閱 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts) 中的語法詳細資訊以及相容性注意事項。

## 在變數中捕獲 when 主題

在 Kotlin 1.3 中，現在可以將 `when` 主題捕獲到變數中：

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success `->` response.body
            is HttpError `->` throw HttpException(response.status)
        }
```

雖然已經可以在 `when` 之前提取此變數，但 `when` 中的 `val` 將其範圍正確地限制為
`when` 的主體，從而防止命名空間污染。[在此處查看有關 `when` 的完整文檔](control-flow#when-expressions-and-statements)。

## 介面同伴物件 (companions) 中的 @JvmStatic 和 @JvmField

使用 Kotlin 1.3，可以使用註解 `@JvmStatic` 和 `@JvmField` 標記介面的 `companion` 物件 (object) 的成員。
在 classfile 中，這些成員將被提升到相應的介面並標記為 `static`。

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

它等效於此 Java 程式碼：

```java
interface Foo {
    public static int answer = 42;
    public static void sayHello() {
        // ...
    }
}
```

## 註解類別 (annotation classes) 中的巢狀宣告 (Nested declarations)

在 Kotlin 1.3 中，註解 (annotations) 可以具有巢狀類別、介面、物件和同伴物件 (companions)：

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

## 無參數 main

按照慣例，Kotlin 程式的進入點是一個具有類似 `main(args: Array<String>)` 簽名的函數，
其中 `args` 表示傳遞給程式的命令列參數。但是，並非每個應用程式都支援命令列參數，
因此此參數通常最終未使用。

Kotlin 1.3 引入了一種更簡單的 `main` 形式，它不帶任何參數。現在 Kotlin 中的 "Hello, World" 短了 19 個字元！

```kotlin
fun main() {
    println("Hello, world!")
}
```

## 具有大 arity 的函數

在 Kotlin 中，函數類型表示為採用不同數量參數的泛型類別：`Function0<R>`、
`Function1<P0, R>`、`Function2<P0, P1, R>`、... 此方法存在一個問題，即此列表是有限的，並且目前以 `Function22` 結尾。

Kotlin 1.3 放寬了此限制，並增加了對具有更大 arity 的函數的支援：

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 42 more */, Any) `->` Any) {
    block(Any(), Any(), ..., Any())
}
```

## 漸進模式 (Progressive mode)

Kotlin 非常關心程式碼的穩定性和向後相容性：Kotlin 相容性策略聲明，破壞性變更
(例如，使過去可以正常編譯的程式碼不再編譯的變更) 只能在主要版本中引入 (**1.2**、**1.3** 等)。

我們相信，許多使用者可以使用更快的週期，讓關鍵編譯器錯誤修復立即到達，
從而使程式碼更安全和正確。因此，Kotlin 1.3 引入了*漸進式 (progressive)* 編譯器模式，可以透過
將參數 `-progressive` 傳遞給編譯器來啟用。

在漸進模式 (progressive mode) 中，可以立即收到對語言語義的一些修復。所有這些修復都具有兩個重要的屬性：

* 它們保留了原始碼與舊編譯器的向後相容性，這意味著漸進式 (progressive) 編譯器可編譯的所有程式碼
都將由非漸進式 (non-progressive) 編譯器正常編譯。
* 它們只會使程式碼在某種意義上*更安全* — 例如，可以禁止某些不健全的智能轉換 (smartcast)，生成程式碼的行為
可能會更改為更可預測/穩定，等等。

啟用漸進模式 (progressive mode) 可能需要您重寫一些程式碼，但不應該太多 — 所有修復
在漸進模式 (progressive) 下啟用的都經過仔細挑選、審查，並提供工具遷移協助。
我們希望漸進模式 (progressive mode) 對於任何積極維護並快速更新到
最新語言版本的程式碼庫來說都是一個不錯的選擇。

## 行內類別 (Inline classes)

:::caution
行內類別 (Inline classes) 處於 [Alpha](components-stability) 階段。它們將來可能會發生不相容的變更，並且需要手動遷移。
我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中對其提出的意見。
請參閱 [參考資料](inline-classes) 中的詳細資訊。

:::

Kotlin 1.3 引入了一種新型宣告 — `inline class`。行內類別 (inline classes) 可以被視為受限制的版本
的常用類別，特別是，行內類別 (inline classes) 必須恰好有一個屬性：

```kotlin
inline class Name(val s: String)
```

Kotlin 編譯器將使用此限制來積極優化行內類別 (inline classes) 的執行時間表示形式，並且
在可能的情況下，用基礎屬性的值替換它們的實例，從而消除建構子呼叫、GC 壓力，
並啟用其他優化：

```kotlin
inline class Name(val s: String)

fun main() {
    // 在下一行中，沒有發生建構子呼叫，並且
    // 在執行時間，'name' 僅包含字串 "Kotlin"
    val name = Name("Kotlin")
    println(name.s) 
}

```

有關詳細資訊，請參閱行內類別 (inline classes) 的 [參考資料](inline-classes)。

## 無符號整數 (Unsigned integers)

:::caution
無符號整數 (Unsigned integers) 處於 [Beta](components-stability) 階段。
它們的實現幾乎穩定，但將來可能需要遷移步驟。
我們將盡力減少您必須進行的任何更改。

:::

Kotlin 1.3 引入了無符號整數類型：

* `kotlin.UByte`：一個無符號 8 位元整數，範圍從 0 到 255
* `kotlin.UShort`：一個無符號 16 位元整數，範圍從 0 到 65535
* `kotlin.UInt`：一個無符號 32 位元整數，範圍從 0 到 2^32 - 1
* `kotlin.ULong`：一個無符號 64 位元整數，範圍從 0 到 2^64 - 1

大多數帶符號類型的功能也支援無符號對應類型：

```kotlin
fun main() {

// 您可以使用文字後綴定義無符號類型
val uint = 42u 
val ulong = 42uL
val ubyte: UByte = 255u

// 您可以透過 stdlib 擴充功能將帶符號類型轉換為無符號類型，反之亦然：
val int = uint.toInt()
val byte = ubyte.toByte()
val ulong2 = byte.toULong()

// 無符號類型支援類似的運算子：
val x = 20u + 22u
val y = 1u shl 8
val z = "128".toUByte()
val range = 1u..5u

println("ubyte: $ubyte, byte: $byte, ulong2: $ulong2")
println("x: $x, y: $y, z: $z, range: $range")
}
```

有關詳細資訊，請參閱 [參考資料](unsigned-integer-types)。

## @JvmDefault

:::caution
`@JvmDefault` 是 [Experimental](components-stability) 的。它可能隨時被刪除或更改。
僅將其用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中對其提出的意見。

:::

Kotlin 以廣泛的 Java 版本為目標，包括 Java 6 和 Java 7，其中不允許介面中的預設方法。
為了您的方便，Kotlin 編譯器解決了該限制，但此解決方法與 Java 8 中引入的 `default` 方法不相容。

這可能是 Java 互通性的一個問題，因此 Kotlin 1.3 引入了 `@JvmDefault` 註解。
使用此註解標記的方法將作為 JVM 的 `default` 方法生成：

```kotlin
interface Foo {
    // 將作為 'default' 方法生成
    @JvmDefault
    fun foo(): Int = 42
}
```

:::caution
警告！使用 `@JvmDefault` 註解您的 API 會對二進制相容性產生嚴重影響。
在使用 `@JvmDefault` 進行生產之前，請務必仔細閱讀 [參考頁面](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)。

:::

## 標準函式庫 (Standard library)

### 多平台隨機 (Multiplatform random)

在 Kotlin 1.3 之前，沒有一種在所有平台上生成隨機數的統一方法 — 我們不得不求助於平台特定的解決方案，
例如 JVM 上的 `java.util.Random`。此版本透過引入類別 `kotlin.random.Random` 來解決此問題，該類別可在所有平台上使用：

```kotlin
import kotlin.random.Random

fun main() {

    val number = Random.nextInt(42)  // number 在範圍 [0, limit) 內
    println(number)

}
```

### isNullOrEmpty 和 orEmpty 擴充功能

`isNullOrEmpty` 和 `orEmpty` 擴充功能已存在於 stdlib 中的某些類型中。如果
接收者為 `null` 或空，則第一個返回 `true`，如果接收者為 `null`，則第二個返回到空實例。
Kotlin 1.3 在集合、映射和物件陣列上提供了類似的擴充功能。

### 在兩個現有陣列之間複製元素

現有陣列類型 (包括無符號陣列) 的 `array.copyInto(targetArray, targetOffset, startIndex, endIndex)` 函數，
使在純 Kotlin 中實作基於陣列的容器變得更容易。

```kotlin
fun main() {

    val sourceArr = arrayOf("k", "o", "t", "l", "i", "n")
    val targetArr = sourceArr.copyInto(arrayOfNulls<String>(6), 3, startIndex = 3, endIndex = 6)
    println(targetArr.contentToString())
    
    sourceArr.copyInto(targetArr, startIndex = 0, endIndex = 3)
    println(targetArr.contentToString())

}
```

### associateWith

擁有一個鍵列表並希望透過將每個鍵與某個值關聯來建立映射是一種非常常見的情況。
以前可以使用 `associate { it to getValue(it) }` 函數來執行此操作，但是現在我們引入了一個更有效
且易於探索的替代方案：`keys.associateWith { getValue(it) }`。

```kotlin
fun main() {

    val keys = 'a'..'f'
    val map = keys.associateWith { it.toString().repeat(5).capitalize() }
    map.forEach { println(it) }

}
```

### ifEmpty 和 ifBlank 函數

集合、映射、物件陣列、字元序列和序列現在具有 `ifEmpty` 函數，該函數允許指定
一個回退值，如果接收者為空，則將使用該值代替接收者：

```kotlin
fun main() {

    fun printAllUppercase(data: List<String>) {
        val result = data
        .filter { it.all { c `->` c.isUpperCase() } }
            .ifEmpty { listOf("<no uppercase>") }
        result.forEach { println(it) }
    }
    
    printAllUppercase(listOf("foo", "Bar"))
    printAllUppercase(listOf("FOO", "BAR"))

}
```

此外，字元序列和字串還具有 `ifBlank` 擴充功能，其作用與 `ifEmpty` 相同，但檢查
字串是否全部為空白，而不是為空。

```kotlin
fun main() {

    val s = "    
"
    println(s.ifBlank { "<blank>" })
    println(s.ifBlank { null })

}
```

### Reflection 中的密封類別 (Sealed classes)

我們已將一個新的 API 添加到 `kotlin-reflect`，該 API 可用於列舉 `sealed` 類別的所有直接子類型，即 `KClass.sealedSubclasses`。

### 較小的變更

* `Boolean` 類型現在具有同伴物件 (companion)。
* `Any?.hashCode()` 擴充功能，對於 `null` 返回 0。
* `Char` 現在提供 `MIN_VALUE` 和 `MAX_VALUE` 常數。
* 原始類型同伴物件 (companions) 中的 `SIZE_BYTES` 和 `SIZE_BITS` 常數。

## 工具 (Tooling)

### IDE 中的程式碼樣式支援

Kotlin 1.3 在 IntelliJ IDEA 中引入了對[建議的程式碼樣式](coding-conventions)的支援。
查看[此頁面](code-style-migration-guide)以獲取遷移指南。

### kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 是一個函式庫，它為
Kotlin 中的物件的 (反)序列化提供多平台支援。以前，它是一個單獨的專案，但是自 Kotlin 1.3 以來，它與 Kotlin 編譯器
發行版一起發布，與其他編譯器外掛程式並駕齊驅。主要區別在於您不需要手動留意
Serialization IDE Plugin 是否與您使用的 Kotlin IDE Plugin 版本相容：現在 Kotlin IDE Plugin
已經包含序列化 (serialization)！

請在此處查看[詳細資訊](https://github.com/Kotlin/kotlinx.serialization#current-project-status)。

:::caution
即使 kotlinx.serialization 現在與 Kotlin 編譯器發行版一起發布，但在 Kotlin 1.3 中，它仍然被認為是一項實驗性功能。

:::

### Scripting 更新

:::caution
Scripting 是 [Experimental](components-stability) 的。它可能隨時被刪除或更改。
僅將其用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中對其提出的意見。

:::

Kotlin 1.3 繼續發展和改進 scripting API，引入了一些實驗性支援以進行腳本 (scripts) 自定義，
例如添加外部屬性、提供靜態或動態依賴項等。

有關更多詳細資訊，請參閱 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support)。

### Scratches 支援

Kotlin 1.3 引入了對可執行 Kotlin *scratch files* 的支援。*Scratch file* 是一個帶有 .kts 擴充功能的 kotlin 腳本檔案，
您可以運行它並直接在編輯器中獲得評估結果。

有關詳細資訊，請參閱通用的 [Scratches 文檔](https://www.jetbrains.com/help/idea/scratches.html)。