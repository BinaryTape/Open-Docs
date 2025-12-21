[//]: # (title: 數字)

## 整數類型

Kotlin 提供了一組內建類型來表示數字。
對於整數，有四種不同大小和值範圍的類型：

| 類型	    | 大小 (位元) | 最小值                                    | 最大值                                      |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte`	  | 8           | -128                                         | 127                                            |
| `Short`	 | 16          | -32768                                       | 32767                                          |
| `Int`	   | 32          | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`	  | 64          | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |

> 除了有符號整數類型外，Kotlin 還提供無符號整數類型。
> 由於無符號整數旨在不同的使用案例，它們將單獨介紹。
> 請參閱 [](unsigned-integer-types.md)。
>
{style="tip"}

當您初始化一個沒有明確類型指定的變數時，編譯器會自動推斷從 `Int` 開始，足以表示該值的最小範圍類型。如果它不超過 `Int` 的範圍，則類型為 `Int`。如果超過該範圍，則類型為 `Long`。若要明確指定 `Long` 值，請在值後附加字尾 `L`。若要使用 `Byte` 或 `Short` 類型，請在宣告中明確指定。明確的類型指定會觸發編譯器檢查該值是否超過指定類型的範圍。

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

## 浮點類型

對於實數，Kotlin 提供了遵循 [IEEE 754 標準](https://en.wikipedia.org/wiki/IEEE_754) 的浮點類型 `Float` 和 `Double`。
`Float` 反映了 IEEE 754 的 _單精度_，而 `Double` 反映了 _雙精度_。

這些類型在大小上有所不同，並為不同精度的浮點數提供儲存空間：

| 類型	    | 大小 (位元) | 有效位元 | 指數位元 | 小數位數 |
|----------|-------------|------------------|---------------|----------------|
| `Float`	 | 32          | 24               | 8             | 6-7            |
| `Double` | 64          | 53               | 11            | 15-16          |

您只能使用帶有小數部分的數字來初始化 `Double` 和 `Float` 變數。
使用句點 (`.`) 將小數部分與整數部分分開。

對於使用小數數字初始化的變數，編譯器會推斷為 `Double` 類型：

```kotlin
val pi = 3.14          // Double

val one: Double = 1    // Int is inferred
// Initializer type mismatch

val oneDouble = 1.0    // Double
```
{validate="false"}

若要明確為值指定 `Float` 類型，請添加字尾 `f` 或 `F`。
如果以這種方式提供的值包含超過 7 個小數位，它將被捨入：

```kotlin
val e = 2.7182818284          // Double
val eFloat = 2.7182818284f    // Float, actual value is 2.7182817
```

與某些其他語言不同，Kotlin 中的數字沒有隱式擴展轉換。
例如，帶有 `Double` 參數的函數只能在 `Double` 值上呼叫，而不能在 `Float`、
`Int` 或其他數值上呼叫：

```kotlin
fun main() {
//sampleStart
    fun printDouble(x: Double) { print(x) }

    val x = 1.0
    val xInt = 1    
    val xFloat = 1.0f 

    printDouble(x)
    
    printDouble(xInt)   
    // Argument type mismatch
    
    printDouble(xFloat)
    // Argument type mismatch
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

若要將數值轉換為不同類型，請使用[明確的數值轉換](#explicit-number-conversions)。

## 數值的常數文字

整數值有幾種常數文字：

*   十進位數：`123`
*   長整數，以大寫 `L` 結尾：`123L`
*   十六進位數：`0x0F`
*   二進位數：`0b00001011`

> Kotlin 不支援八進位文字。
>
{style="note"}

Kotlin 也支援浮點數的傳統表示法：

*   雙精度浮點數（當小數部分不以字母結尾時為預設）：`123.5`、`123.5e10`
*   單精度浮點數，以字母 `f` 或 `F` 結尾：`123.5f`

您可以使用底線讓數字常數更易讀：

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

> 無符號整數文字也有特殊字尾。
> 請閱讀更多關於[無符號整數類型文字](unsigned-integer-types.md)的內容。
>
{style="tip"}

## Java 虛擬機器上的數值裝箱與快取

Java 虛擬機器 (JVM) 儲存數字的方式可能導致您的程式碼行為出乎意料，因為預設會對小型（位元組大小）數字使用快取。

JVM 將數字儲存為原始類型：`int`、`double` 等。
當您使用[泛型](generics.md)或建立可為 null 的數字參考，例如 `Int?` 時，數字會被裝箱（boxed）到 Java 類別中，例如 `Integer` 或 `Double`。

JVM 對於表示介於 `−128` 和 `127` 之間數字的 `Integer` 及其他物件應用了[記憶體優化技術](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)。
所有指向這類物件的可為 null 參考都指向同一個快取物件。
例如，下列程式碼中可為 null 的物件[參考相等](equality.md#referential-equality)：

```kotlin
fun main() {
//sampleStart
    val a: Int = 100
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a
    
    println(boxedA === anotherBoxedA) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

對於此範圍之外的數字，可為 null 的物件不同但[結構相等](equality.md#structural-equality)：

```kotlin
fun main() {
//sampleStart
    val b: Int = 10000
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b
    
    println(boxedB === anotherBoxedB) // false
    println(boxedB == anotherBoxedB) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

因此，Kotlin 會警告對可裝箱（boxable）數字和文字使用參考相等性（referential equality），並顯示以下訊息：「類型…與…的引數識別相等性被禁止。」當比較 `Int`、`Short`、`Long` 和 `Byte` 類型（以及 `Char` 和 `Boolean`）時，請使用結構相等性檢查以獲得一致的結果。

## 明確的數值轉換

由於表示方式不同，數字類型*彼此不是子類型*。
因此，較小的類型*不會*隱式轉換為較大的類型，反之亦然。
例如，將 `Byte` 類型的值賦予 `Int` 變數需要明確轉換：

```kotlin
fun main() {
//sampleStart
    val byte: Byte = 1
    // OK, literals are checked statically
    
    val intAssignedByte: Int = byte 
    // Initializer type mismatch
    
    val intConvertedByte: Int = byte.toInt()
    
    println(intConvertedByte)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

所有數字類型都支援轉換為其他類型：

*   `toByte(): Byte` (對於 [Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) 和 [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html) 已棄用)
*   `toShort(): Short`
*   `toInt(): Int`
*   `toLong(): Long`
*   `toFloat(): Float`
*   `toDouble(): Double`

在許多情況下，不需要明確轉換，因為類型會從上下文中推斷出來，並且算術運算符已被重載以自動處理轉換。例如：

```kotlin
fun main() {
//sampleStart
    val l = 1L + 3       // Long + Int => Long
    println(l is Long)   // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### 反對隱式轉換的理由

Kotlin 不支援隱式轉換，因為它們可能導致非預期的行為。

如果不同類型的數字被隱式轉換，我們有時可能會悄悄地失去相等性和識別。
例如，想像一下如果 `Int` 是 `Long` 的子類型：

```kotlin
// 假設性程式碼，實際上無法編譯：
val a: Int? = 1    // 裝箱的 Int (java.lang.Integer)
val b: Long? = a   // 隱式轉換產生裝箱的 Long (java.lang.Long)
print(b == a)      // 印出 "false"，因為 Long.equals() 不僅檢查值，還檢查另一個數字是否也是 Long
```

## 數值運算

Kotlin 支援標準的數字算術運算集：`+`、`-`、`*`、`/`、`%`。它們被宣告為相應類別的成員：

```kotlin
fun main() {
//sampleStart
    println(1 + 2)
    println(2_500_000_000L - 1L)
    println(3.14 * 2.71)
    println(10.0 / 3)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您可以在自訂數字類別中覆寫這些運算符。
請參閱[運算符重載](operator-overloading.md)以了解詳情。

### 整數除法

整數之間的除法總是返回一個整數。任何小數部分都會被捨棄。

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2
    println(x == 2.5) 
    // 運算符 '==' 不能應用於 'Int' 和 'Double'
    
    println(x == 2)   
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

這對於任何兩種整數類型之間的除法都成立：

```kotlin
fun main() {
//sampleStart
    val x = 5L / 2
    println (x == 2)
    // 錯誤，因為 Long (x) 不能與 Int (2) 比較
    
    println(x == 2L)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

若要返回帶有小數部分的除法結果，請明確將其中一個引數轉換為浮點類型：

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2.toDouble()
    println(x == 2.5)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 位元操作

Kotlin 提供了一組對整數執行的*位元操作*。它們直接在二進位層級上對數字的表示位元進行操作。
位元操作由可以中綴形式呼叫的函數表示。它們只能應用於 `Int` 和 `Long`：

```kotlin
fun main() {
//sampleStart
    val x = 1
    val xShiftedLeft = (x shl 2)
    println(xShiftedLeft)  
    // 4
    
    val xAnd = x and 0x000FF000
    println(xAnd)          
    // 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

位元操作的完整列表：

*   `shl(bits)` – 有符號左移
*   `shr(bits)` – 有符號右移
*   `ushr(bits)` – 無符號右移
*   `and(bits)` – 位元 **AND**
*   `or(bits)` – 位元 **OR**
*   `xor(bits)` – 位元 **XOR**
*   `inv()` – 位元反轉

### 浮點數比較

本節討論的浮點數操作包括：

*   相等性檢查：`a == b` 和 `a != b`
*   比較運算符：`a < b`、`a > b`、`a <= b`、`a >= b`
*   範圍實例化和範圍檢查：`a..b`、`x in a..b`、`x !in a..b`

當操作數 `a` 和 `b` 靜態地已知為 `Float` 或 `Double` 或其可為 null 的對應物時（類型已宣告或推斷，或是[智慧型轉型](typecasts.md#smart-casts)的結果），對這些數字的操作及其形成的範圍遵循 [IEEE 754 浮點算術標準](https://en.wikipedia.org/wiki/IEEE_754)。

然而，為了支援泛型使用案例並提供總體排序，對於*沒有*靜態類型為浮點數的操作數，其行為有所不同。例如，`Any`、`Comparable<...>` 或 `Collection<T>` 類型。在這種情況下，操作使用 `Float` 和 `Double` 的 `equals` 和 `compareTo` 實作。結果是：

*   `NaN` 被視為等於自身
*   `NaN` 被視為大於包括 `POSITIVE_INFINITY` 在內的任何其他元素
*   `-0.0` 被視為小於 `0.0`

這是一個範例，顯示了靜態類型為浮點數（`Double.NaN`）的操作數與*非*靜態類型為浮點數（`listOf(T)`）的操作數之間的行為差異。

```kotlin
fun main() {
    //sampleStart
    // 靜態類型為浮點數的操作數
    println(Double.NaN == Double.NaN)                 // false
    
    // 非靜態類型為浮點數的操作數
    // 因此 NaN 等於自身
    println(listOf(Double.NaN) == listOf(Double.NaN)) // true

    // 靜態類型為浮點數的操作數
    println(0.0 == -0.0)                              // true
    
    // 非靜態類型為浮點數的操作數
    // 因此 -0.0 小於 0.0
    println(listOf(0.0) == listOf(-0.0))              // false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // [-0.0, 0.0, Infinity, NaN]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}