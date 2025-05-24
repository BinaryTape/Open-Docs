---
title: "數字 (Numbers)"
---
## 整數類型 (Integer types)

Kotlin 提供了一組內建類型來表示數字。
對於整數，有四種類型具有不同的大小和值範圍：

| 類型 (Type)	    | 大小 (Size) (位元 (bits)) | 最小值 (Min value)                                    | 最大值 (Max value)                                      |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte`	  | 8           | -128                                         | 127                                            |
| `Short`	 | 16          | -32768                                       | 32767                                          |
| `Int`	   | 32          | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`	  | 64          | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |
:::note
除了有符號整數類型之外，Kotlin 還提供無符號整數類型。
由於無符號整數的目標是用於不同的使用場景，因此將它們單獨介紹。
請參閱 [](unsigned-integer-types)。

當您初始化一個沒有明確類型指定的變數時，編譯器會自動推斷類型，
從 `Int` 開始，使用足以表示該值的最小範圍。如果它不超過 `Int` 的範圍，則類型為 `Int`。
如果它確實超過了該範圍，則類型為 `Long`。要明確指定 `Long` 值，請在值後附加後綴 `L`。
要使用 `Byte` 或 `Short` 類型，請在宣告中明確指定它。
明確的類型指定會觸發編譯器檢查該值是否超過指定類型的範圍。

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

## 浮點數類型 (Floating-point types)

對於實數，Kotlin 提供了浮點數類型 `Float` 和 `Double`，它們符合 [IEEE 754 標準](https://en.wikipedia.org/wiki/IEEE_754)。
`Float` 反映了 IEEE 754 _單精度 (single precision)_，而 `Double` 反映了 _雙精度 (double precision)_。

這些類型的大小不同，並為具有不同精度的浮點數提供儲存空間：

| 類型 (Type)	    | 大小 (Size) (位元 (bits)) | 有效位數 (Significant bits) | 指數 (Exponent bits) | 十進制位數 (Decimal digits) |
|----------|-------------|------------------|---------------|----------------|
| `Float`	 | 32          | 24               | 8             | 6-7            |
| `Double` | 64          | 53               | 11            | 15-16          |

您只能使用具有小數部分的數字來初始化 `Double` 和 `Float` 變數。
使用句點 (`.`) 將小數部分與整數部分分開。

對於使用小數初始化的變數，編譯器會推斷 `Double` 類型：

```kotlin
val pi = 3.14          // Double

val one: Double = 1    // Int 被推斷
// Initializer type mismatch

val oneDouble = 1.0    // Double
```

要明確指定值的 `Float` 類型，請新增後綴 `f` 或 `F`。
如果以此方式提供的值包含超過 7 個十進制數字，則會將其四捨五入：

```kotlin
val e = 2.7182818284          // Double
val eFloat = 2.7182818284f    // Float, actual value is 2.7182817
```

與某些其他語言不同，Kotlin 中數字沒有隱式擴展轉換 (implicit widening conversions)。
例如，具有 `Double` 參數的函式只能在 `Double` 值上呼叫，而不能在 `Float`、`Int` 或其他數值上呼叫：

```kotlin
fun main() {

    fun printDouble(x: Double) { print(x) }

    val x = 1.0
    val xInt = 1    
    val xFloat = 1.0f 

    printDouble(x)
    
    printDouble(xInt)   
    // Argument type mismatch
    
    printDouble(xFloat)
    // Argument type mismatch

}
```

要將數值轉換為不同的類型，請使用 [顯式轉換](#explicit-number-conversions)。

## 數值的文字常量 (Literal constants)

整數值有幾種文字常量：

* 十進制 (Decimals): `123`
* Longs，以大寫 `L` 結尾: `123L`
* 十六進制 (Hexadecimals): `0x0F`
* 二進制 (Binaries): `0b00001011`

Kotlin 不支援八進制文字。

:::

Kotlin 也支援浮點數的傳統表示法：

* Doubles (當小數部分不以字母結尾時的預設值): `123.5`, `123.5e10`
* Floats，以字母 `f` 或 `F` 結尾: `123.5f`

您可以使用底線使數字常量更具可讀性：

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

:::tip
無符號整數文字也有特殊的後綴。
閱讀有關 [無符號整數類型的文字](unsigned-integer-types)的更多資訊。

:::

## 在 Java 虛擬機器 (Java Virtual Machine) 上裝箱 (Boxing) 和快取 (Caching) 數字

JVM 儲存數字的方式可能會使您的程式碼產生違反直覺的行為，因為預設情況下快取用於小（位元組大小）數字。

JVM 將數字儲存為基本類型：`int`、`double` 等。
當您使用 [泛型類型](generics) 或建立可空數字參考 (nullable number reference)（例如 `Int?`）時，數字會被裝箱在 Java 類別中，例如 `Integer` 或 `Double`。

JVM 將 [記憶體優化技術](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7) 應用於 `Integer` 和其他表示 `−128` 到 `127` 之間的數字的物件。
對此類物件的所有可空參考都指向同一個快取物件。
例如，以下程式碼中的可空物件是 [參考相等 (referentially equal)](equality#referential-equality)：

```kotlin
fun main() {

    val a: Int = 100
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a
    
    println(boxedA === anotherBoxedA) // true

}
```

對於此範圍之外的數字，可空物件是不同的，但 [結構相等 (structurally equal)](equality#structural-equality)：

```kotlin
fun main() {

    val b: Int = 10000
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b
    
    println(boxedB === anotherBoxedB) // false
    println(boxedB == anotherBoxedB) // true

}
```

因此，Kotlin 會警告不要對可裝箱數字和文字使用參考相等性，並顯示以下訊息：`"Identity equality for arguments of types ... and ... is prohibited."`
在比較 `Int`、`Short`、`Long` 和 `Byte` 類型（以及 `Char` 和 `Boolean`）時，請使用結構相等性檢查以獲得一致的結果。

## 顯式數字轉換 (Explicit number conversions)

由於表示方式不同，數字類型彼此_不是子類型 (subtypes)_。
因此，較小的類型_不會_隱式轉換為較大的類型，反之亦然。
例如，將 `Byte` 類型的值分配給 `Int` 變數需要顯式轉換：

```kotlin
fun main() {

    val byte: Byte = 1
    // OK, literals are checked statically
    
    val intAssignedByte: Int = byte 
    // Initializer type mismatch
    
    val intConvertedByte: Int = byte.toInt()
    
    println(intConvertedByte)

}
```

所有數字類型都支援轉換為其他類型：

* `toByte(): Byte` (已棄用 [Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) 和 [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html))
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`

在許多情況下，不需要顯式轉換，因為類型是從上下文推斷的，並且算術運算符經過重載以自動處理轉換。例如：

```kotlin
fun main() {

    val l = 1L + 3       // Long + Int => Long
    println(l is Long)   // true

}
```

### 反對隱式轉換的原因 (Reasoning against implicit conversions)

Kotlin 不支援隱式轉換，因為它們可能導致意外行為。

如果不同類型的數字被隱式轉換，我們有時可能會靜默地失去相等性和身份。
例如，假設 `Int` 是 `Long` 的子類型：

```kotlin
// Hypothetical code, does not actually compile:
val a: Int? = 1    // A boxed Int (java.lang.Integer)
val b: Long? = a   // Implicit conversion yields a boxed Long (java.lang.Long)
print(b == a)      // Prints "false" as Long.equals() checks not only the value but whether the other number is Long as well
```

## 數字運算 (Operations on numbers)

Kotlin 支援對數字進行的標準算術運算集：`+`、`-`、`*`、`/`、`%`。它們被宣告為適當類別的成員：

```kotlin
fun main() {

    println(1 + 2)
    println(2_500_000_000L - 1L)
    println(3.14 * 2.71)
    println(10.0 / 3)

}
```

您可以在自定義數字類別中覆寫這些運算符。
有關詳細資訊，請參閱 [運算符重載](operator-overloading)。

### 整數除法 (Division of integers)

整數之間的除法總是返回一個整數。任何小數部分都會被丟棄。

```kotlin
fun main() {

    val x = 5 / 2
    println(x == 2.5) 
    // Operator '==' cannot be applied to 'Int' and 'Double'
    
    println(x == 2)   
    // true

}
```

對於任何兩個整數類型之間的除法都是如此：

```kotlin
fun main() {

    val x = 5L / 2
    println (x == 2)
    // Error, as Long (x) cannot be compared to Int (2)
    
    println(x == 2L)
    // true

}
```

要返回帶有小數部分的除法結果，請將其中一個參數顯式轉換為浮點類型：

```kotlin
fun main() {

    val x = 5 / 2.toDouble()
    println(x == 2.5)

}
```

### 位元運算 (Bitwise operations)

Kotlin 提供了一組對整數進行的_位元運算_。它們直接在二進制級別上使用數字表示的位元進行運算。
位元運算由可以以中綴形式呼叫的函式表示。它們只能應用於 `Int` 和 `Long`：

```kotlin
fun main() {

    val x = 1
    val xShiftedLeft = (x shl 2)
    println(xShiftedLeft)  
    // 4
    
    val xAnd = x and 0x000FF000
    println(xAnd)          
    // 0

}
```

位元運算的完整列表：

* `shl(bits)` – 有符號左移 (signed shift left)
* `shr(bits)` – 有符號右移 (signed shift right)
* `ushr(bits)` – 無符號右移 (unsigned shift right)
* `and(bits)` – 按位 **AND**
* `or(bits)` – 按位 **OR**
* `xor(bits)` – 按位 **XOR**
* `inv()` – 按位反轉 (bitwise inversion)

### 浮點數比較 (Floating-point numbers comparison)

本節討論的浮點數運算有：

* 相等性檢查 (Equality checks)：`a == b` 和 `a != b`
* 比較運算符 (Comparison operators)：`a < b`、`a > b`、`a <= b`、`a >= b`
* 範圍實例化和範圍檢查 (Range instantiation and range checks)：`a..b`、`x in a..b`、`x !in a..b`

當運算元 `a` 和 `b` 在靜態上已知為 `Float` 或 `Double` 或它們的可空對應項時（類型已聲明或推斷，或是 [智能轉換](typecasts#smart-casts) 的結果），對數字及其形成的範圍的運算遵循 [IEEE 754 浮點算術標準](https://en.wikipedia.org/wiki/IEEE_754)。

但是，為了支援泛型使用案例並提供總排序 (total ordering)，對於**未**靜態類型化為浮點數的運算元，行為是不同的。例如，`Any`、`Comparable<...>` 或 `Collection<T>` 類型。在這種情況下，運算使用 `Float` 和 `Double` 的 `equals` 和 `compareTo` 實現。因此：

* `NaN` 被認為等於自身
* `NaN` 被認為大於任何其他元素，包括 `POSITIVE_INFINITY`
* `-0.0` 被認為小於 `0.0`

以下範例顯示了靜態類型化為浮點數 (`Double.NaN`) 的運算元與**未**靜態類型化為浮點數 (`listOf(T)`) 的運算元之間的行為差異。

```kotlin
fun main() {

    // Operand statically typed as floating-point number
    println(Double.NaN == Double.NaN)                 // false
    
    // Operand NOT statically typed as floating-point number
    // So NaN is equal to itself
    println(listOf(Double.NaN) == listOf(Double.NaN)) // true

    // Operand statically typed as floating-point number
    println(0.0 == -0.0)                              // true
    
    // Operand NOT statically typed as floating-point number
    // So -0.0 is less than 0.0
    println(listOf(0.0) == listOf(-0.0))              // false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // [-0.0, 0.0, Infinity, NaN]

}
```