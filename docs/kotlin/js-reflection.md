[//]: # (title: Kotlin/JS 反射)

Kotlin/JS 为 Kotlin [反射 API](reflection.md) 提供有限支持。API 中唯一支持的部分是：

* [类引用](reflection.md#class-references) (``::class``)
* [``KType`` 和 ``typeof()``](#ktype-and-typeof)
* [``KClass`` 和 ``createInstance()``](#kclass-and-createinstance)

## 类引用

``::class`` 语法返回实例的类引用，或给定类型对应的类。
在 Kotlin/JS 中，``::class`` 表达式的值是一个精简的 [``KClass``](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 实现，仅支持：
* [``simpleName``](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/simple-name.html) 和 [``isInstance()``](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/is-instance.html) 成员。
* [``cast()``](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/cast.html) 和 [``safeCast()``](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/safe-cast.html) 扩展函数。

此外，你可以使用 [``KClass.js``](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html) 访问与该类对应的 [``JsClass``](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-class/index.html) 实例。
``JsClass`` 实例本身是对构造函数的引用。
这可用于与期望接收构造函数引用的 JS 函数进行互操作。

## KType 和 typeof()

[`typeof()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 函数构造一个 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/) 实例，用于给定类型。
``KType`` API 在 Kotlin/JS 中完全支持，除了 Java 特有的部分。

## KClass 和 createInstance()

来自 [``KClass``](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 接口的 [`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html) 函数创建指定类的新实例，这对于获取 Kotlin 类的运行时引用很有用。

## 示例

以下是 Kotlin/JS 中反射用法的示例。

```kotlin
open class Shape
class Rectangle : Shape()

inline fun <reified T> accessReifiedTypeArg() =
    println(typeOf<T>().toString())

fun main() {
    val s = Shape()
    val r = Rectangle()

    println(r::class.simpleName) // 打印 "Rectangle"
    println(Shape::class.simpleName) // 打印 "Shape"
    println(Shape::class.js.name) // 打印 "Shape"

    println(Shape::class.isInstance(r)) // 打印 "true"
    println(Rectangle::class.isInstance(s)) // 打印 "false"
    val rShape = Shape::class.cast(r) // 将 Rectangle "r" 转换为 Shape

    accessReifiedTypeArg<Rectangle>() // 通过 typeOf() 访问类型。打印 "Rectangle"
}
```