[//]: # (title: 數字)
[//]: # (description: 了解如何在 Kotlin 中使用數字，包含數值型別、常值、轉換、算術運算、溢位以及 JVM 特有的行為。)

Kotlin 的數字型別代表：
* 整數值（[Byte](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-byte/)、
  [Short](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-short/)、
  [Int](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-int/)
  和 [Long](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-long/)）
* 浮點值（[Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/)
  和 [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/)）

使用數字型別來儲存和處理數值資料，例如算術、計數器、測量以及其他計算。

## 選擇數字型別

在大多數情況下，你可以參考以下規則來決定適合你任務的數字型別：

* 對於整數使用 `Int`。
* 對於超過 `Int` 範圍的整數使用 `Long`。
* 對於小數使用 `Double`。
* 當可接受或需要較低精度時使用 `Float`。
* 當 API 或資料格式需要時使用 `Byte` 和 `Short`。

> Kotlin 還提供了 [](unsigned-integer-types.md) 作為 Beta 功能。 
>
{style="tip"}

## 整數型別

Kotlin 提供四種具有不同大小和值範圍的整數型別：

| 型別 | 大小 (位元) | 最小值 | 最大值 |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte` | 8 | -128 | 127 |
| `Short` | 16 | -32768 | 32767 |
| `Int` | 32 | -2,147,483,648 (-2<sup>31</sup>) | 2,147,483,647 (2<sup>31</sup> - 1) |
| `Long` | 64 | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |

### 宣告整數值

Kotlin 支援以下整數值的常值形式：

* 十進位：`123`
* 十六進位：`0x0F`
* 二進位：`0b00001011`

> Kotlin 不支援八進位常值。
>
{style="note"}

若要宣告數值，請明確指定型別： 

```kotlin
val one: Int = 1

// 使用底線提高可讀性
val oneBillion: Long = 1_000_000_000
val hexBytes: Int = 0x7F_EC_DE_5E
val bytes: Int = 0b01010010_01101001_10010100_10010010

val oneByte: Byte = 1
val oneShort: Short = 1
```

你也可以加上 `L` 後綴來宣告 `Long` 值：

```kotlin
val oneLong = 1L
```

當你明確宣告數值型別時，編譯器會檢查該值是否符合該型別的範圍：

```kotlin
// 值符合 Byte 範圍
val oneByte: Byte = 1

// 錯誤：該值不符合 Byte 範圍
val tooBig: Byte = 128
```

當你沒有指定數值型別時，如果該值符合 `Int` 的範圍，Kotlin 會推論為 `Int`。否則，Kotlin 會推論為 `Long`：

```kotlin
val million = 1_000_000 // Int
val threeBillion = 3_000_000_000 // Long
```

如果值可能不存在，請使用可為 null 的型別：

```kotlin
val maybeAbsent: Int? = null
```

## 浮點型別

對於帶有小數部分的數字，Kotlin 提供 `Float` 和 `Double`。

浮點型別遵循 [IEEE 754 標準](https://en.wikipedia.org/wiki/IEEE_754)。
`Float` 代表*單精度*，`Double` 代表*倍精度*。

浮點型別在大小和精度上有所不同：

| 型別 | 大小 (位元) | 有效位元 | 指數位元 | 十進位位元 |
|----------|-------------|------------------|---------------|----------------|
| `Float` | 32 | 24 | 8 | 6-7 |
| `Double` | 64 | 53 | 11 | 15-16 |    

### 宣告浮點值

若要宣告浮點常值，請包含小數點 (`.`) 或使用指數標記法：

```kotlin
val pi = 3.14
val avogadro = 6.02214076e23
```

預設情況下，Kotlin 會將浮點常值推論為 `Double`。 
若要宣告 `Float`，請加上 `f` 或 `F` 後綴：

```kotlin
val pi = 3.14 // Double
val eFloat = 2.7182817f // Float
```

> Kotlin 會對包含超過 `Float` 所能儲存精度的 `Float` 常值進行四捨五入。
>
{style="note"}

如果值可能不存在，請使用可為 null 的型別：

```kotlin
val maybeAbsent: Double? = null
```

## 算術運算

Kotlin 支援對數字進行標準的算術運算：`+`、`-`、`*`、`/` 和 `%`。

使用這些運算子進行常見計算：

```kotlin
fun main() {
//sampleStart
    println(1 + 2) // 3
    println(2_500_000_000L - 1L) // 2499999999
    println(3.14 * 2.71) // 8.5094
    println(10.0 / 3) // 3.3333333333333335
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

結果型別取決於運算元的型別。進一步了解請參閱 [](#mixed-numeric-expressions)。

> 你可以在自訂數字類別中覆寫這些運算子。
> 欲了解更多資訊，請參閱 [運算子多載](operator-overloading.md)。
>
{style="tip"}

### 整數除法

整數值之間的除法總是傳回整數結果。編譯器會捨棄小數部分：

```kotlin
fun main() {
//sampleStart
    val intValue = 5 / 2
    println(intValue) // 2
    
    val longValue = 5L / 2
    println(longValue) // 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

若要傳回浮點結果，請讓至少一個運算元為 `Float` 或 `Double`：

```kotlin
fun main() {
//sampleStart
    val a = 5 / 2.0
    println(a) // 2.5
    
    val b = 5 / 2.toDouble()
    println(b) // 2.5
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 型別轉換

數值型別彼此並非子型別。Kotlin 需要明確轉換，以避免無聲的資料遺失和非預期的行為。

例如，一個預期 `Double` 的函式無法在不轉換的情況下接收 `Int` 或 `Float` 值：

```kotlin
fun main() {
//sampleStart
    fun printDouble(x: Double) { 
        print(x) 
    }

    val x = 1.0
    val xInt = 1
    val xFloat = 1.0f
    val one: Double = 1 // 錯誤：初始設定式型別不符 (initializer type mismatch)

    printDouble(x) // OK
    printDouble(xInt) // 錯誤：引數型別不符 (argument type mismatch)
    printDouble(xFloat) // 錯誤：引數型別不符 (argument type mismatch)
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

所有數字型別都支援轉換為其他數字型別。
若要將數字轉換為另一種型別，請使用明確轉換函式：

* `toByte()`
* `toShort()`
* `toInt()`
* `toLong()`
* `toFloat()`
* `toDouble()`

例如，以下程式碼將 `Int` 值轉換為 `Double`：

```kotlin
fun main() {
//sampleStart
    val intValue: Int = 1
    val doubleValue = intValue.toDouble()
    
    println(doubleValue) // 1.0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

當你將浮點值轉換為整數型別時，編譯器會捨棄小數部分：

```kotlin
fun main() {
//sampleStart
    val d: Double = 1.5
    val l: Long = d.toLong()
    
    println(l) // 1
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 混合數值運算式

Kotlin 不支援指派或函式引數的隱含轉換。 
然而，你可以在算術運算式中組合不同的數值型別。在這種情況下， 
Kotlin 會根據運算元型別決定結果型別， 
且算術運算子會自動處理轉換：

```kotlin
val intNumber: Int = 1
val longNumber: Long = 1000
val result = intNumber + longNumber // 1001, Long
```

如果你嘗試將結果指派給較小的型別，編譯器會報告錯誤：

```kotlin
val intNumber: Int = 1
val longNumber: Long = 1000
val result: Int = intNumber + longNumber 
// 錯誤：初始設定式型別不符 (Initializer type mismatch)
```

### 整數常值型別

在型別推論過程中，Kotlin 會將不具後綴的整數常值視為一種特殊的 [整數常值型別 (Integer Literal Type, ILT)](https://kotlinlang.org/spec/type-system.html#integer-literal-types)，直到周圍的上下文確定了具體型別為止：

```kotlin
//sampleStart
fun List<Any>.log() {
    println(joinToString(" | ") { it::class.simpleName ?: "Unknown" })
}

fun main() {
    listOf(1, 2).log()
    // Int | Int
    
    listOf(1L, 2L).log()
    // Long | Long
    
    // 編譯器將 1 解釋為 ILT 並將其解析為 Long
    listOf(1, 2L).log()
    // Long | Long
    
    // .toInt() 將常值轉換為 Int
    listOf(1.toInt(), 2L).log()
    // Int | Long
}
//sampleEnd
```
{kotlin-runnable="true"}

這點在使用 `Int` 與 `Long` 值時特別容易被忽略，因為它們在執行時具有相同的字串表示。若要避免這種情況，請指定預期型別或明確轉換數值：

```kotlin
//sampleStart
fun List<Any>.log() {
    println(joinToString(" | ") { it::class.simpleName ?: "Unknown" })
}

fun main() {
    val longValues: List<Long> = listOf(1, 2L)
    longValues.log()
    // Long | Long

    val numberValues: List<Number> = listOf(1.toInt(), 2L)
    numberValues.log()
    // Int | Long
}
//sampleEnd
```
{kotlin-runnable="true"}

你也可以使用顯式類型來捕捉非預期的型別推論：

```kotlin
fun main() {
//sampleStart
    val intValues: List<Int> = listOf(1, 2L)
    // 錯誤：初始設定式型別不符 (initializer type mismatch)
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

> 進一步了解 [整數常值型別 (Integer literal types)](https://kotlinlang.org/spec/type-system.html#integer-literal-types)。
> 
{style="tip"}

## 資料溢位

數值型別只能代表其定義範圍內的值。

如果運算的結果超出該範圍，就會發生溢位。 
如果你將一個值轉換為較小的數值型別，轉換後的值可能無法保留 
原始的數值。

即使編譯器接受，這種行為也可能影響你程式碼的結果。

### 運算中的溢位

每個整數型別只能儲存其定義範圍內的值。當算術運算的結果
超過該範圍時，就會發生*資料溢位*：

```kotlin
fun main(){
//sampleStart
    val intNumber: Int = 2147483647
    // Int 的最大值為 2147483647
    println(intNumber + 1) // -2147483648
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

在這裡，結果發生了繞回 (wrap around)，因為該值已不再符合 `Int` 的範圍。

> 當整數溢位發生時，編譯器不會自動產生錯誤。
>
{style="note"}

### 負號運算中的溢位

溢位也可能發生在負號運算期間。 
例如，你無法將 `Int.MIN_VALUE` 的正值對應項表示為 `Int`。

```kotlin
fun main(){
//sampleStart
    val min = Int.MIN_VALUE
    println(-min) // -2147483648
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 縮窄轉換

當你將一個值轉換為較小的整數型別時， 
結果可能無法保留原始的數值：

```kotlin
fun main() {
//sampleStart
    val large: Int = 130
    val narrowed: Byte = large.toByte()

    println(narrowed) // -126
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

然而，由於浮點型別遵循
[IEEE 754 標準](https://en.wikipedia.org/wiki/IEEE_754)，非常大的結果可能會變成 `Infinity`：

```kotlin
fun main() {
//sampleStart
    println(Double.MAX_VALUE * 2) // Infinity
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 位元運算

Kotlin 為 `Int` 和 `Long` 提供*位元運算*。這些運算由
一組 [中綴函式](functions.md#infix-notation) 和 `inv()` 表示。

```kotlin
fun main() {
//sampleStart
    val x = 1
    
    println(x shl 2) // 4
    println(x and 0x000FF000) // 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

位元運算包括：

* `shl()` – 有符號左移
* `shr()` – 有符號右移
* `ushr()` – 無符號右移
* `and()` – 位元 AND
* `or()` – 位元 OR
* `xor()` – 位元 XOR
* `inv()` – 位元反轉

## 浮點數比較

在 Kotlin 中，浮點數比較取決於運算元的靜態型別。

當運算元在靜態上已知為 `Float` 或 `Double` 時，
對數字及其形成的範圍之運算
遵循 [IEEE 754 浮點運算標準](https://en.wikipedia.org/wiki/IEEE_754)。

然而，在泛型使用案例中（例如 `Any`、`Comparable<...>` 或 `Collection<T>`），對於
非靜態型別化為浮點數的運算元，其行為會有所不同。在這些情況下，Kotlin
會使用 `Float` 和 `Double` 的 `equals()` 與 `compareTo()` 實作。 

結果如下：

* `NaN` 被視為等於其自身
* `NaN` 被視為大於任何其他元素，包括 `POSITIVE_INFINITY`
* `-0.0` 被視為小於 `0.0`

以下範例顯示了靜態型別化為浮點數的運算元
與透過泛型型別使用的運算元之間的差異：

```kotlin
//sampleStart  
fun generalizedEquals(a: Any, b: Any): Boolean {
    return a == b
}

fun main() {
    // 運算元靜態型別化為浮點數
    println(Double.NaN == Double.NaN) // false
    println(0.0 == -0.0) // true

    // 透過非浮點靜態型別使用的運算元
    println(generalizedEquals(Double.NaN, Double.NaN)) // true
    println(generalizedEquals(0.0, -0.0)) // false
}
//sampleEnd  
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}

## JVM 上的數字裝箱與快取

在 JVM 上，不可為 null 的數值通常使用原始型別（例如 `int`、`long` 或 `double`）儲存。
然而，當你使用 [泛型](generics.md) 或 `Int?` 等可為 null 的數字型別時，數值會被裝箱並
以物件表示。

JVM 對小型數字套用 [記憶體優化技術](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)，
快取它們的裝箱表示。因此，
具有相同值的裝箱數字在 [參照相等性](equality.md#referential-equality) 上可能是相等的。

例如，JVM 會快取 `-128` 到 `127` 範圍內的裝箱 `Integer` 值。因此，以下
程式碼會傳回 `true`：

```kotlin
fun main() {
//sampleStart
    val score: Int = 100
    val savedScore: Int? = score
    val displayedScore: Int? = score
    
    println(savedScore === displayedScore) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

對於快取範圍之外的值，裝箱值是獨立的物件。在這種情況下，
它們在參照上不相等，即使它們的值在 [結構相等性](equality.md#structural-equality) 上相等。
出於這個原因，請使用 `==` 來比較數值：

```kotlin
fun main() {
//sampleStart
    val score: Int = 10000
    val savedScore: Int? = score
    val displayedScore: Int? = score

    println(savedScore === displayedScore) // false
    println(savedScore == displayedScore) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}