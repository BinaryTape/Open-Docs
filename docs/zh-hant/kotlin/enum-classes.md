---
title: "列舉類別 (Enum classes)"
---
enum 類別最基本的用例是實現型別安全的列舉（type-safe enums）：

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
每個 enum 常數都是一個物件。Enum 常數以逗號分隔。

由於每個 enum 都是 enum 類別的一個實例，因此可以像這樣初始化：

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 匿名類別（Anonymous classes）

Enum 常數可以宣告它們自己的匿名類別，這些類別帶有它們對應的方法，以及覆寫（overriding）基礎方法。

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

如果 enum 類別定義了任何成員，請用分號將常數定義與成員定義分開。

## 在 enum 類別中實作介面（Implementing interfaces in enum classes）

一個 enum 類別可以實作一個介面（但它不能繼承自一個類別），為所有條目提供介面成員的一個通用實作，或者為其匿名類別中的每個條目提供單獨的實作。
這是通過將您想要實作的介面添加到 enum 類別宣告中來完成的，如下所示：

```kotlin
import java.util.function.BinaryOperator
import java.util.function.IntBinaryOperator

enum class IntArithmetics : BinaryOperator<Int>, IntBinaryOperator {
    PLUS {
        override fun apply(t: Int, u: Int): Int = t + u
    },
    TIMES {
        override fun apply(t: Int, u: Int): Int = t * u
    };
    
    override fun applyAsInt(t: Int, u: Int) = apply(t, u)
}

fun main() {
    val a = 13
    val b = 31
    for (f in IntArithmetics.entries) {
        println("$f($a, $b) = ${f.apply(a, b)}")
    }
}
```

預設情況下，所有 enum 類別都實作了 [Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 介面。Enum 類別中的常數以自然順序定義。有關更多資訊，請參閱[排序](collection-ordering)。

## 使用 enum 常數（Working with enum constants）

Kotlin 中的 Enum 類別具有合成的屬性和方法，用於列出已定義的 enum 常數，並通過其名稱獲取 enum 常數。這些方法的簽名如下（假設 enum 類別的名稱為 `EnumClass`）：

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.entries: EnumEntries<EnumClass> // specialized List<EnumClass>
```

以下是它們在實際應用中的一個範例：

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString()) // prints RED, GREEN, BLUE
    println("The first color is: ${RGB.valueOf("RED")}") // prints "The first color is: RED"
}
```

如果指定的名稱與類別中定義的任何 enum 常數不匹配，則 `valueOf()` 方法會拋出 `IllegalArgumentException`。

在 Kotlin 1.9.0 中引入 `entries` 之前，`values()` 函數用於檢索 enum 常數的陣列。

每個 enum 常數也都有屬性：[`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html)
和 [`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html)，用於獲取其名稱以及在 enum 類別宣告中的位置（從 0 開始）：

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {

    println(RGB.RED.name)    // prints RED
    println(RGB.RED.ordinal) // prints 0

}
```

您可以使用 [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 和 [`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html) 函數以泛型方式存取 enum 類別中的常數。
在 Kotlin 2.0.0 中，引入了 [`enumEntries<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.enums/enum-entries.html) 函數來替代 [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 函數。`enumEntries<T>()` 函數返回給定 enum 類型 `T` 的所有 enum 條目的列表。

`enumValues<T>()` 函數仍然支援，但我們建議您改用 `enumEntries<T>()` 函數，
因為它對效能的影響較小。每次呼叫 `enumValues<T>()` 時都會創建一個新陣列，而每次
呼叫 `enumEntries<T>()` 時都會返回相同的列表，這效率更高。

例如：

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>() 
// RED, GREEN, BLUE
```
> 有關 inline 函數和具體化類型參數（reified type parameters）的更多資訊，請參閱[Inline 函數](inline-functions)。
>
>