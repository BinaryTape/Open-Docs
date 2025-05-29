[//]: # (title: Kotlin/JS 反射)

Kotlin/JS 對 Kotlin 的 [反射 API](reflection.md) 僅提供有限支援。該 API 唯一支援的部分為：

*   [類別參考](reflection.md#class-references) (``::class``)
*   [`KType` 和 `typeof()`](#ktype-and-typeof)
*   [`KClass` 和 `createInstance()`](#kclass-and-createinstance)

## 類別參考

``::class`` 語法會返回一個實例的類別參考，或對應於給定型別的類別。
在 Kotlin/JS 中，``::class`` 表達式的值是一個精簡版 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 實作，僅支援：
*   [simpleName](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/simple-name.html) 和 [isInstance()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/is-instance.html) 成員。
*   [cast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/cast.html) 和 [safeCast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/safe-cast.html) 擴充函式。

此外，您可以使用 [KClass.js](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html) 存取對應於該類別的 [JsClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-class/index.html) 實例。
`JsClass` 實例本身就是對建構函式的參考。
這可用於與需要建構函式參考的 JS 函式進行互通。

## KType 和 typeof()

[``typeof()``](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 函式會針對給定型別建構一個 [``KType``](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/) 實例。
`KType` API 在 Kotlin/JS 中獲得完全支援，除了 Java 特定的部分之外。

## KClass 和 createInstance()

來自 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 介面的 [``createInstance()``](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html) 函式會建立指定類別的新實例，這對於取得 Kotlin 類別的執行時參考很有用。

## 範例

以下是 Kotlin/JS 中反射用法的範例。

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