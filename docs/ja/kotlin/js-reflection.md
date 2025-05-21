---
title: "Kotlin/JS リフレクション"
---
Kotlin/JS は、Kotlin の[reflection API](reflection)に対する限定的なサポートを提供します。API でサポートされているのは以下の部分のみです。

* [クラス参照](reflection#class-references) (`::class`)
* [`KType` と `typeof()`](#ktype-and-typeof)
* [`KClass` と `createInstance()`](#kclass-and-createinstance)

## クラス参照

`::class` 構文は、インスタンスのクラス、または指定された型に対応するクラスへの参照を返します。Kotlin/JS では、`::class` 式の値は、以下のもののみをサポートする、簡略化された[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/)実装です。
* [simpleName](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/simple-name.html) および [isInstance()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/is-instance.html) メンバ。
* [cast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/cast.html) および
[safeCast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/safe-cast.html) 拡張関数。

さらに、[KClass.js](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html) を使用して、クラスに対応する[JsClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-class/index.html) インスタンスにアクセスできます。`JsClass` インスタンス自体は、コンストラクタ関数への参照です。これは、コンストラクタへの参照を期待する JS 関数と相互運用するために使用できます。

## KType と typeOf()

[`typeof()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 関数は、指定された型の[`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/) のインスタンスを構築します。`KType` API は、Java 固有の部分を除き、Kotlin/JS で完全にサポートされています。

## KClass と createInstance()

[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) インターフェースの[`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html) 関数は、指定されたクラスの新しいインスタンスを作成します。これは、Kotlin クラスへのランタイム参照を取得するのに役立ちます。

## 例

Kotlin/JS でのリフレクションの使用例を以下に示します。

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