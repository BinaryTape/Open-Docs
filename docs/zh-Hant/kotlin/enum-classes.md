[//]: # (title: 列舉類別)

列舉類別最基本的用例是實作類型安全的列舉：

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
每個列舉常數都是一個物件。列舉常數之間以逗號分隔。

由於每個列舉都是列舉類別的實例，它可以初始化為：

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 匿名類別

列舉常數可以宣告自己的匿名類別，包含其對應的方法，以及覆寫基礎方法。

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

如果列舉類別定義了任何成員，請使用分號將常數定義與成員定義分開。

## 在列舉類別中實作介面

列舉類別可以實作介面（但不能從類別衍生），為所有條目提供介面成員的通用實作，或為其匿名類別中的每個條目提供單獨的實作。這可以透過將您想要實作的介面新增到列舉類別宣告中來完成，如下所示：

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

所有列舉類別預設實作了 [Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 介面。列舉類別中的常數以自然順序定義。更多資訊，請參閱 [Ordering](collection-ordering.md)。

## 使用列舉常數

Kotlin 中的列舉類別具有合成屬性和方法，用於列出定義的列舉常數並依其名稱取得列舉常數。這些方法的簽名如下（假設列舉類別的名稱為 `EnumClass`）：

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.entries: EnumEntries<EnumClass> // specialized List<EnumClass>
```

以下是它們的實例：

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString()) // 列印 RED, GREEN, BLUE
    println("The first color is: ${RGB.valueOf("RED")}") // 列印 "The first color is: RED"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9" id="rgb-enums-kotlin"}

如果指定名稱與類別中定義的任何列舉常數不匹配，則 `valueOf()` 方法會拋出 `IllegalArgumentException`。

在 Kotlin 1.9.0 引入 `entries` 之前，`values()` 函式用於檢索列舉常數的陣列。

每個列舉常數也具有屬性：[`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html) 和 [`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html)，用於取得其名稱和在列舉類別宣告中的位置（從 0 開始）。

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    //sampleStart
    println(RGB.RED.name)    // 列印 RED
    println(RGB.RED.ordinal) // 列印 0
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="rgb-enums-properties-kotlin"}

> 為減少使用列舉條目時的重複，請嘗試情境感知解析（目前為預覽功能）。
> 此功能允許您在已知預期類型時省略列舉類別名稱，例如在 `when` 表達式中或將其賦值給有類型變數時。
>
> 更多資訊，請參閱 [情境感知解析預覽](whatsnew22.md#preview-of-context-sensitive-resolution) 或相關的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)。
>
{style="tip"}

您可以透過使用 [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 和 [`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html) 函式，以通用方式存取列舉類別中的常數。在 Kotlin 2.0.0 中，[`enumEntries<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.enums/enum-entries.html) 函式被引入，以取代 [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 函式。`enumEntries<T>()` 函式會回傳指定列舉類型 `T` 的所有列舉條目清單。

`enumValues<T>()` 函式仍然受支援，但我們建議您使用 `enumEntries<T>()` 函式，因為它對效能的影響較小。每次呼叫 `enumValues<T>()` 都會建立一個新陣列，而每次呼叫 `enumEntries<T>()` 都會回傳相同的清單，這效率更高。

例如：

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>() 
// RED, GREEN, BLUE
```
> 更多關於內聯函式和具體化類型參數的資訊，請參閱 [Inline functions](inline-functions.md)。
>
> {style="tip"}