[//]: # (title: Kotlin/JSのリフレクション)

Kotlin/JSは、Kotlinの[リフレクションAPI](reflection.md)に対する限定的なサポートを提供します。サポートされているAPIの機能は以下の通りです。

* [クラス参照](reflection.md#class-references) (`::class`)
* [`KType`と`typeof()`](#ktype-and-typeof)
* [`KClass`と`createInstance()`](#kclass-and-createinstance)

## クラス参照

`::class`構文は、インスタンスのクラス、または指定された型に対応するクラスへの参照を返します。
Kotlin/JSでは、`::class`式の値は、以下のメンバーのみをサポートする簡略化された[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/)実装です。
* [simpleName](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/simple-name.html)と[isInstance()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/is-instance.html)メンバー。
* [cast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/cast.html)と[safeCast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/safe-cast.html)拡張関数。

それに加えて、[KClass.js](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html)を使用して、クラスに対応する[JsClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-class/index.html)インスタンスにアクセスできます。
`JsClass`インスタンスそれ自体は、コンストラクタ関数への参照です。
これは、コンストラクタへの参照を期待するJS関数と連携するために使用できます。

## KTypeとtypeof()

[`typeof()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html)関数は、指定された型に対して[`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/)のインスタンスを構築します。
`KType` APIは、Java固有の部分を除いて、Kotlin/JSで完全にサポートされています。

## KClassとcreateInstance()

[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/)インターフェースの[`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html)関数は、指定されたクラスの新しいインスタンスを作成します。これは、Kotlinクラスのランタイム参照を取得するのに役立ちます。

## 例

以下は、Kotlin/JSにおけるリフレクションの使用例です。

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