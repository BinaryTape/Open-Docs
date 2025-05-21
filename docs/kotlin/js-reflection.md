---
title: "Kotlin/JS 反射"
---
Kotlin/JS 为 Kotlin [反射 API](reflection) 提供了有限的支持。唯一支持的 API 部分有：

* [类引用](reflection#class-references) (`::class`)
* [`KType` 和 `typeof()`](#ktype-and-typeof)
* [`KClass` 和 `createInstance()`](#kclass-and-createinstance)

## 类引用

`::class` 语法返回对实例的类，或与给定类型相对应的类的引用。在 Kotlin/JS 中，`::class` 表达式的值是一个精简的 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 实现，仅支持：
* [simpleName](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/simple-name.html) 和 [isInstance()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/is-instance.html) 成员。
* [cast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/cast.html) 和
[safeCast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/safe-cast.html) 扩展函数。

除此之外，你可以使用 [KClass.js](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html) 访问与该类对应的 [JsClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-class/index.html) 实例。`JsClass` 实例本身是对构造函数的引用。这可以用于与期望构造函数引用的 JS 函数进行互操作。

## KType 和 typeOf()

[`typeof()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 函数为给定类型构造一个 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/) 的实例。除了 Java 特定的部分外，Kotlin/JS 完全支持 `KType` API。

## KClass 和 createInstance()

[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 接口中的 [`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html) 函数创建一个指定类的新实例，这对于获取 Kotlin 类的运行时引用非常有用。

## 示例

这是一个 Kotlin/JS 中反射用法的示例。

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