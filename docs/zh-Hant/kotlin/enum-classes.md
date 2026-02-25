[//]: # (title: 列舉類別)

列舉類別最基本的用法是實作型別安全的列舉：

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
每個列舉常數都是一個物件。列舉常數之間以逗號分隔。

由於每個列舉都是列舉類別的執行個體，因此可以按照以下方式進行初始化：

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 匿名類別

列舉常數可以宣告自己的匿名類別及其對應的方法，也可以覆寫基底方法。

```kotlin
enum class ProtocolState {
    WAITING {
        override fun signal() = TALKING
    },

    TALKING {
        override fun signal() = WAITING
    };

    abstract fun signal(): ProtocolState
}
```

如果列舉類別定義了任何成員，請使用分號將常數定義與成員定義隔開。

## 在列舉類別中實作介面

列舉類別可以實作介面（但不能繼承類別），並為所有項目提供介面成員的通用實作，或者在匿名類別中為每個項目提供單獨的實作。這可以透過在列舉類別宣告中加入要實作的介面來完成，如下所示：

```kotlin
import java.util.function.BinaryOperator
import java.util.function.IntBinaryOperator

//sampleStart
enum class IntArithmetics : BinaryOperator<Int>, IntBinaryOperator {
    PLUS {
        override fun apply(t: Int, u: Int): Int = t + u
    },
    TIMES {
        override fun apply(t: Int, u: Int): Int = t * u
    };
    
    override fun applyAsInt(t: Int, u: Int) = apply(t, u)
}
//sampleEnd

fun main() {
    val a = 13
    val b = 31
    for (f in IntArithmetics.entries) {
        println("$f($a, $b) = ${f.apply(a, b)}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9"}

所有列舉類別預設都實作了 [Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 介面。列舉類別中的常數是依自然順序定義的。若要了解更多資訊，請參閱[排序](collection-ordering.md)。

## 使用列舉常數

Kotlin 中的列舉類別具有合成屬性與方法，用於列出已定義的列舉常數，以及根據名稱取得列舉常數。這些方法的簽章如下（假設列舉類別的名稱為 `EnumClass`）：

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.entries: EnumEntries<EnumClass> // 特殊化的 List<EnumClass>
```

以下是其運作方式的範例：

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString()) // 印出 RED, GREEN, BLUE
    println("The first color is: ${RGB.valueOf("RED")}") // 印出 "The first color is: RED"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9" id="rgb-enums-kotlin"}

如果指定的名稱與類別中定義的任何列舉常數都不相符，`valueOf()` 方法將拋出 `IllegalArgumentException`。

在 Kotlin 1.9.0 引入 `entries` 之前，會使用 `values()` 函式來檢索列舉常數陣列。

每個列舉常數還具有屬性：[`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html) 和 [`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html)，用於在列舉類別宣告中獲取其名稱和位置（從 0 開始）：

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    //sampleStart
    println(RGB.RED.name)    // 印出 RED
    println(RGB.RED.ordinal) // 印出 0
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="rgb-enums-properties-kotlin"}

> 為了減少使用列舉項目時的重複作業，請嘗試上下文相關解析（目前為預覽版）。此特性允許在已知預期型別時省略列舉類別名稱，例如在 `when` 運算式中或指派給型別化變數時。
>
> 若要了解更多資訊，請參閱[上下文相關解析預覽](whatsnew22.md#preview-of-context-sensitive-resolution)或相關的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)。
>
{style="tip"}

你可以使用 [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 和 [`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html) 函式，以泛型的方式存取列舉類別中的常數。在 Kotlin 2.0.0 中，引入了 [`enumEntries<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.enums/enum-entries.html) 函式來取代 [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 函式。`enumEntries<T>()` 函式會傳回指定列舉型別 `T` 的所有列舉項目清單。

雖然仍支援 `enumValues<T>()` 函式，但我們建議你改用 `enumEntries<T>()` 函式，因為它的效能影響較小。每次呼叫 `enumValues<T>()` 時都會建立一個新陣列，而每次呼叫 `enumEntries<T>()` 時都會傳回相同的清單，這要高效得多。

例如：

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>() 
// RED, GREEN, BLUE
```
> 若要了解更多關於內嵌函式和具體化型別參數的資訊，請參閱[內嵌函式](inline-functions.md)。
>
> {style="tip"}