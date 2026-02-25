[//]: # (title: 數字)

## 整數型別

Kotlin 提供了一組代表數字的內建型別。  
對於整數數字，有四種具有不同大小和值範圍的型別：

| 型別 | 大小 (位元) | 最小值 | 最大值 |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte` | 8 | -128 | 127 |
| `Short` | 16 | -32768 | 32767 |
| `Int` | 32 | -2,147,483,648 (-2<sup>31</sup>) | 2,147,483,647 (2<sup>31</sup> - 1) |
| `Long` | 64 | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |

> 除了有符號整數型別外，Kotlin 還提供了無符號整數型別。
> 由於無符號整數針對的是不同的使用案例，因此會另行介紹。
> 請參閱 [](unsigned-integer-types.md)。
> 
{style="tip"}

當你在初始化變數時沒有明確指定型別，編譯器會從 `Int` 開始自動推論出足以代表該值且範圍最小的型別。如果該值未超過 `Int` 的範圍，則型別為 `Int`；如果超過該範圍，則型別為 `Long`。若要明確指定 `Long` 值，請在該值後方加上後綴 `L`。若要使用 `Byte` 或 `Short` 型別，請在宣告中明確指定。明確型別指定會觸發編譯器檢查該值是否未超過指定型別的範圍。

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

## 浮點型別

對於實數，Kotlin 提供了符合 [IEEE 754 標準](https://en.wikipedia.org/wiki/IEEE_754) 的浮點型別 `Float` 和 `Double`。
`Float` 對應 IEEE 754 *單精度*，而 `Double` 則對應 *倍精度*。

這些型別的大小不同，並為具有不同精度的浮點數提供儲存空間：

| 型別 | 大小 (位元) | 有效位元 | 指數位元 | 十進位位元 |
|----------|-------------|------------------|---------------|----------------|
| `Float` | 32 | 24 | 8 | 6-7 |
| `Double` | 64 | 53 | 11 | 15-16 |    

你只能使用帶有小數部分的數字來初始化 `Double` 和 `Float` 變數。
使用句點 (`.`) 將小數部分與整數部分隔開。

對於使用小數初始化變數，編譯器會推論為 `Double` 型別：

```kotlin
val pi = 3.14          // Double

val one: Double = 1    // 推論為 Int
// Initializer type mismatch

val oneDouble = 1.0    // Double
```
{validate="false"}

若要為某個值明確指定 `Float` 型別，請加上後綴 `f` 或 `F`。
如果以這種方式提供的值包含超過 7 位十進位位元，則會進行四捨五入：

```kotlin
val e = 2.7182818284          // Double
val eFloat = 2.7182818284f    // Float，實際值為 2.7182817
```

與其他一些語言不同，Kotlin 中的數字沒有隱式的擴展轉換。
例如，具有 `Double` 參數的函式只能接收 `Double` 值，而不能接收 `Float`、`Int` 或其他數值：

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

若要將數值轉換為不同型別，請使用 [明確轉換](#explicit-number-conversions)。

## 數字的常值常數

整數值有幾種常值常數：

* 十進位：`123`
* Long，以大寫 `L` 結尾：`123L`
* 十六進位：`0x0F`
* 二進位：`0b00001011`

> Kotlin 不支援八進位常值。
>
{style="note"}

Kotlin 也支援浮點數的常規表示法：

* Double（小數部分不以字母結尾時的預設值）：`123.5`、`123.5e10`
* Float，以字母 `f` 或 `F` 結尾：`123.5f`

你可以使用底線使數字常數更具可讀性：

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

> 無符號整數常值也有特殊的後綴。  
> 進一步了解 [無符號整數型別的常值](unsigned-integer-types.md)。
> 
{style="tip"}

## Java 虛擬機上的數字裝箱與快取

由於預設情況下對於小型（Byte 大小）數字會使用快取，JVM 儲存數字的方式可能會讓你的程式碼行為不符合直覺。

JVM 將數字儲存為原始型別：`int`、`double` 等。
當你使用 [泛型](generics.md) 或建立可為 null 的數字參照（如 `Int?`）時，數字會被裝箱（boxed）在 Java 類別中，例如 `Integer` 或 `Double`。

JVM 對於代表 `-128` 到 `127` 之間數字的 `Integer` 與其他物件套用 [記憶體優化技術](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)。
指向此類物件的所有可為 null 參照都會指向同一個快取物件。
例如，以下程式碼中的可為 null 物件在 [參照相等性](equality.md#referential-equality) 上是相等的：

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

對於此範圍之外的數字，可為 null 物件是不同的，但在 [結構相等性](equality.md#structural-equality) 上是相等的：

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

出於這個原因，Kotlin 會對可裝箱數字和常值使用參照相等性發出警告，並顯示以下訊息：`"Identity equality for arguments of types ... and ... is prohibited."`（禁止對 ... 和 ... 型別的引數進行同一性相等檢查）。
比較 `Int`、`Short`、`Long` 和 `Byte` 型別（以及 `Char` 和 `Boolean`）時，請使用結構相等性檢查以獲得一致的結果。

## 明確數字轉換

由於表示方式不同，數字型別 *並非* 彼此的子型別。
因此，較小的型別 *不會* 隱式轉換為較大的型別，反之亦然。
例如，將 `Byte` 型別的值指派給 `Int` 變數需要進行明確轉換：

```kotlin
fun main() {
//sampleStart
    val byte: Byte = 1
    // OK，常值會進行靜態檢查
    
    val intAssignedByte: Int = byte 
    // Initializer type mismatch
    
    val intConvertedByte: Int = byte.toInt()
    
    println(intConvertedByte)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

所有數字型別都支援轉換為其他型別：

* `toByte(): Byte`（對 [Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) 和 [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html) 已棄用）
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`

在許多情況下不需要明確轉換，因為型別會從上下文中推論出來，且算術運算子已多載以自動處理轉換。例如：

```kotlin
fun main() {
//sampleStart
    val l = 1L + 3       // Long + Int => Long
    println(l is Long)   // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### 反對隱式轉換的原因

Kotlin 不支援隱式轉換，因為它們可能會導致非預期的行為。

如果不同型別的數字被隱式轉換，有時我們會默默地失去相等性和同一性。
例如，假設 `Int` 是 `Long` 的子型別：

```kotlin
// 假設的程式碼，實際上無法編譯：
val a: Int? = 1    // 裝箱的 Int (java.lang.Integer)
val b: Long? = a   // 隱式轉換產生裝箱的 Long (java.lang.Long)
print(b == a)      // 印出 "false"，因為 Long.equals() 不僅檢查值，還會檢查另一個數字是否也是 Long
```

## 數字運算

Kotlin 支援對數字進行標準的算術運算：`+`、`-`、`*`、`/`、`%`。它們被宣告為對應類別的成員：

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

你可以在自訂數字類別中覆寫這些運算子。
詳情請參閱 [運算子多載](operator-overloading.md)。

### 整數除法

整數之間的除法總是傳回一個整數。任何小數部分都會被捨棄。

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2
    println(x == 2.5) 
    // Operator '==' cannot be applied to 'Int' and 'Double'
    
    println(x == 2)   
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

對於任何兩個整數型別之間的除法都是如此：

```kotlin
fun main() {
//sampleStart
    val x = 5L / 2
    println (x == 2)
    // Error, as Long (x) cannot be compared to Int (2)
    
    println(x == 2L)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

若要傳回帶有小數部分的除法結果，請將其中一個引數明確轉換為浮點型別：

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2.toDouble()
    println(x == 2.5)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 位元運算

Kotlin 對整數提供了一組 *位元運算*。它們直接在二進制層級上對數字表示的位元進行操作。
位元運算由可以中綴形式呼叫的函式表示。它們僅能應用於 `Int` 和 `Long`：

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

位元運算的完整列表：

* `shl(bits)` – 有符號左移
* `shr(bits)` – 有符號右移
* `ushr(bits)` – 無符號右移
* `and(bits)` – 位元 **AND**
* `or(bits)` – 位元 **OR**
* `xor(bits)` – 位元 **XOR**
* `inv()` – 位元反轉

### 浮點數比較

本節討論的浮點數運算包括：

* 相等性檢查：`a == b` 與 `a != b`
* 比較運算子：`a < b`、`a > b`、`a <= b`、`a >= b`
* 範圍實例化與範圍檢查：`a..b`、`x in a..b`、`x !in a..b`

當運算元 `a` 和 `b` 經靜態檢查得知為 `Float` 或 `Double` 或其可為 null 的對應型別（型別已宣告、推論或為 [智慧轉型](typecasts.md#smart-casts) 的結果）時，對數字及其形成的範圍之運算將遵循 [IEEE 754 浮點運算標準](https://en.wikipedia.org/wiki/IEEE_754)。

然而，為了支援泛型案例並提供全序關係（total ordering），對於 **並非** 靜態型別化為浮點數的運算元，其行為會有所不同。例如 `Any`、`Comparable<...>` 或 `Collection<T>` 型別。在這種情況下，運算會使用 `Float` 和 `Double` 的 `equals` 和 `compareTo` 實作。結果如下：

* `NaN` 被視為等於其自身
* `NaN` 被視為大於任何其他元素，包括 `POSITIVE_INFINITY`
* `-0.0` 被視為小於 `0.0`

以下範例顯示了靜態型別化為浮點數的運算元 (`Double.NaN`) 與 **非** 靜態型別化為浮點數的運算元 (`listOf(T)`) 之間的行為差異。

```kotlin
fun main() {
    //sampleStart
    // 運算元靜態型別化為浮點數
    println(Double.NaN == Double.NaN)                 // false
    
    // 運算元並非靜態型別化為浮點數
    // 因此 NaN 等於其自身
    println(listOf(Double.NaN) == listOf(Double.NaN)) // true

    // 運算元靜態型別化為浮點數
    println(0.0 == -0.0)                              // true
    
    // 運算元並非靜態型別化為浮點數
    // 因此 -0.0 小於 0.0
    println(listOf(0.0) == listOf(-0.0))              // false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // [-0.0, 0.0, Infinity, NaN]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}