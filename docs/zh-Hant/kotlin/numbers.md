[//]: # (title: 數字)

## 整數型別

Kotlin 提供了一組內建型別來表示數字。
對於整數，有四種不同大小和值域的型別：

| 型別	    | 大小 (位元) | 最小值                                     | 最大值                                       |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte`	  | 8           | -128                                         | 127                                            |
| `Short`	 | 16          | -32768                                       | 32767                                          |
| `Int`	   | 32          | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`	  | 64          | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372_036,854_775_807 (2<sup>63</sup> - 1) |

> 除了有符號整數型別外，Kotlin 還提供了無符號整數型別。
> 由於無符號整數針對的是不同的使用情境，因此它們將在單獨的章節中介紹。
> 請參閱 [](unsigned-integer-types.md)。
> 
{style="tip"}

當您初始化一個沒有明確型別指定的變數時，編譯器會自動推斷出足以表示該值的最小範圍型別，從 `Int` 開始。如果該值不超出 `Int` 的範圍，則型別為 `Int`。如果超出該範圍，則型別為 `Long`。若要明確指定 `Long` 值，請在值後附加後綴 `L`。若要使用 `Byte` 或 `Short` 型別，請在宣告中明確指定。明確的型別指定會觸發編譯器檢查該值是否超出指定型別的範圍。

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

## 浮點數型別

對於實數，Kotlin 提供了 `Float` 和 `Double` 浮點數型別，它們遵循 [IEEE 754 標準](https://en.wikipedia.org/wiki/IEEE_754)。
`Float` 反映的是 IEEE 754 _單精度_，而 `Double` 反映的是 _雙精度_。

這些型別在大小上有所不同，並為不同精度的浮點數提供儲存空間：

| 型別	    | 大小 (位元) | 有效位元 | 指數位元 | 小數位數 |
|----------|-------------|------------------|---------------|----------------|
| `Float`	 | 32          | 24               | 8             | 6-7            |
| `Double` | 64          | 53               | 11            | 15-16          |    

您只能使用具有小數部分的數字來初始化 `Double` 和 `Float` 變數。
使用句點 (`.`) 將小數部分與整數部分分開。

對於使用分數數字初始化的變數，編譯器會推斷為 `Double` 型別：

```kotlin
val pi = 3.14          // Double

val one: Double = 1    // Int is inferred
// Initializer type mismatch

val oneDouble = 1.0    // Double
```
{validate="false"}

若要明確指定某個值的 `Float` 型別，請加上後綴 `f` 或 `F`。
如果以此方式提供的值包含超過 7 個小數位數，則會進行四捨五入：

```kotlin
val e = 2.7182818284          // Double
val eFloat = 2.7182818284f    // Float, actual value is 2.7182817
```

與某些其他語言不同，Kotlin 中的數字沒有隱式拓寬轉換。
例如，具有 `Double` 參數的函式只能在 `Double` 值上呼叫，而不能在 `Float`、`Int` 或其他數值上呼叫：

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

若要將數值轉換為不同的型別，請使用[明確的數字轉換](#explicit-number-conversions)。

## 數字字面常數

整數值有幾種類型的字面常數：

*   十進位數：`123`
*   長整數，以大寫 `L` 結尾：`123L`
*   十六進位數：`0x0F`
*   二進位數：`0b00001011`

> Kotlin 不支援八進位字面值。
>
{style="note"}

Kotlin 也支援浮點數的傳統表示法：

*   雙精度浮點數（當小數部分不以字母結尾時的預設值）：`123.5`、`123.5e10`
*   單精度浮點數，以字母 `f` 或 `F` 結尾：`123.5f`

您可以使用底線使數字常數更具可讀性：

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

> 無符號整數字面值也有特殊的後綴。
> 閱讀更多關於[無符號整數型別的字面值](unsigned-integer-types.md)。
> 
{style="tip"}

## Java 虛擬機器上的數值裝箱與快取

JVM 儲存數字的方式可能會導致您的程式碼行為出乎意料，因為預設會對小（位元組大小）數字使用快取。

JVM 將數字儲存為基本型別：`int`、`double` 等。
當您使用[泛型型別](generics.md)或建立可空的數字參考，例如 `Int?` 時，數字會被裝箱為 Java 類別，例如 `Integer` 或 `Double`。

JVM 對於表示介於 `-128` 和 `127` 之間的 `Integer` 及其他物件應用了[記憶體優化技術](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)。
所有對此類物件的可空參考都指向同一個快取物件。
例如，以下程式碼中的可空物件是[參考相等](equality.md#referential-equality)的：

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

對於超出此範圍的數字，可空物件是不同的，但[結構相等](equality.md#structural-equality)：

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

因此，Kotlin 會對使用可裝箱數字和字面值進行參考相等比較時發出警告，並顯示以下訊息：「`Identity equality for arguments of types ... and ... is prohibited.`」。
當比較 `Int`、`Short`、`Long` 和 `Byte` 型別（以及 `Char` 和 `Boolean`）時，請使用結構相等檢查以獲得一致的結果。

## 明確的數字轉換

由於表示方式不同，數字型別*不是*彼此的子型別。
因此，較小的型別*不會*隱式轉換為較大的型別，反之亦然。
例如，將 `Byte` 型別的值賦予 `Int` 變數需要明確轉換：

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

所有數字型別都支援轉換為其他型別：

*   `toByte(): Byte` (已針對 [Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) 和 [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html) 棄用)
*   `toShort(): Short`
*   `toInt(): Int`
*   `toLong(): Long`
*   `toFloat(): Float`
*   `toDouble(): Double`

在許多情況下，無需明確轉換，因為型別是從上下文中推斷出來的，並且算術運算子已多載以自動處理轉換。例如：

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

Kotlin 不支援隱式轉換，因為它們可能導致意外行為。

如果不同型別的數字被隱式轉換，我們有時可能會在不知不覺中丟失相等性和識別性。
例如，想像如果 `Int` 是 `Long` 的子型別：

```kotlin
// Hypothetical code, does not actually compile:
val a: Int? = 1    // A boxed Int (java.lang.Integer)
val b: Long? = a   // Implicit conversion yields a boxed Long (java.lang.Long)
print(b == a)      // Prints "false" as Long.equals() checks not only the value but whether the other number is Long as well
```

## 數字運算

Kotlin 支援對數字進行標準的算術運算集：`+`、`-`、`*`、`/`、`%`。它們被宣告為相應類別的成員：

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

您可以在自訂的數字類別中覆寫這些運算子。
有關詳細資訊，請參閱[運算子多載](operator-overloading.md)。

### 整數除法

整數之間的除法總是返回一個整數。任何小數部分都會被捨棄。

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

這適用於任何兩個整數型別之間的除法：

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

若要返回帶有小數部分的除法結果，請將其中一個引數明確轉換為浮點數型別：

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

Kotlin 提供了一組針對整數的*位元運算*。它們直接在數字表示的二進位層級上操作。
位元運算由可以中綴形式呼叫的函式表示。它們只能應用於 `Int` 和 `Long`：

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

位元運算的完整列表：

*   `shl(bits)` – 有符號左移 (signed shift left)
*   `shr(bits)` – 有符號右移 (signed shift right)
*   `ushr(bits)` – 無符號右移 (unsigned shift right)
*   `and(bits)` – 位元 AND
*   `or(bits)` – 位元 OR
*   `xor(bits)` – 位元 XOR
*   `inv()` – 位元反轉 (bitwise inversion)

### 浮點數比較

本節討論的浮點數運算包括：

*   相等性檢查：`a == b` 和 `a != b`
*   比較運算子：`a < b`、`a > b`、`a <= b`、`a >= b`
*   範圍實例化和範圍檢查：`a..b`、`x in a..b`、`x !in a..b`

當運算元 `a` 和 `b` 被靜態地判斷為 `Float` 或 `Double` 或其可空對應物（型別已宣告或推斷，或為[智慧型轉型](typecasts.md#smart-casts)的結果）時，數字上的運算及其形成的範圍遵循 [IEEE 754 浮點算術標準](https://en.wikipedia.org/wiki/IEEE_754)。

然而，為了支援泛型使用情境並提供全序，對於**未**靜態型別為浮點數的運算元，其行為會有所不同。例如，`Any`、`Comparable<...>` 或 `Collection<T>` 型別。在這種情況下，運算會使用 `Float` 和 `Double` 的 `equals` 和 `compareTo` 實作。結果如下：

*   `NaN` 被認為等於其本身
*   `NaN` 被認為大於包括 `POSITIVE_INFINITY` 在內的任何其他元素
*   `-0.0` 被認為小於 `0.0`

以下是一個範例，展示了靜態型別為浮點數的運算元 (`Double.NaN`) 與**未**靜態型別為浮點數的運算元 (`listOf(T)`) 之間行為的差異。

```kotlin
fun main() {
    //sampleStart
    // 靜態型別為浮點數的運算元
    println(Double.NaN == Double.NaN)                 // false
    
    // 未靜態型別為浮點數的運算元
    // 因此 NaN 等於其本身
    println(listOf(Double.NaN) == listOf(Double.NaN)) // true

    // 靜態型別為浮點數的運算元
    println(0.0 == -0.0)                              // true
    
    // 未靜態型別為浮點數的運算元
    // 因此 -0.0 小於 0.0
    println(listOf(0.0) == listOf(-0.0))              // false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // [-0.0, 0.0, Infinity, NaN]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}