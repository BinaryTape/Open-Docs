---
title: "Kotlin/JS 反射 (reflection)"
---
Kotlin/JS 對 Kotlin [reflection API](reflection) 提供了有限的支援。唯一支援的 API 部分有：

* [類別參考](reflection#class-references) (`::class`)
* [`KType` 和 `typeof()`](#ktype-and-typeof)
* [`KClass` 和 `createInstance()`](#kclass-and-createinstance)

## 類別參考 (Class references)

`::class` 語法會回傳一個實例的類別參考，或是對應於給定型別的類別。在 Kotlin/JS 中，`::class` 表達式的值是一個精簡版的 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 實作，僅支援：
* [simpleName](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/simple-name.html) 和 [isInstance()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/is-instance.html) 成員。
* [cast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/cast.html) 和
[safeCast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/safe-cast.html) 擴充函式 (extension functions)。

除此之外，您可以使用 [KClass.js](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html) 來存取對應於該類別的 [JsClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-class/index.html) 實例。`JsClass` 實例本身是對建構函式 (constructor function) 的參考。這可以用於與期望建構函式參考的 JS 函式進行互操作。

## KType 和 typeOf()

[`typeof()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 函式會為給定的型別建構一個 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/) 實例。除了特定於 Java 的部分之外，Kotlin/JS 完全支援 `KType` API。

## KClass 和 createInstance()

[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 介面中的 [`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html) 函式會建立指定類別的新實例，這對於取得 Kotlin 類別的執行階段參考 (runtime reference) 很有用。

## 範例 (Example)

以下是在 Kotlin/JS 中使用 reflection 的範例。

```kotlin
open class Shape
class Rectangle : Shape()

inline fun <reified T> accessReifiedTypeArg() =
    println(typeOf<T>().toString())

fun main() {
    val s = Shape()
    val r = Rectangle()

    println(r::class.simpleName) // Prints "Rectangle"
    println(Shape::class.simpleName) // Prints "Shape"
    println(Shape::class.js.name) // Prints "Shape"

    println(Shape::class.isInstance(r)) // Prints "true"
    println(Rectangle::class.isInstance(s)) // Prints "false"
    val rShape = Shape::class.cast(r) // Casts a Rectangle "r" to Shape

    accessReifiedTypeArg<Rectangle>() // Accesses the type via typeOf(). Prints "Rectangle"
}
```