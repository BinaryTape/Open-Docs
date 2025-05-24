---
title: "Kotlin/JS 리플렉션"
---
Kotlin/JS는 Kotlin [reflection API](reflection)에 대한 제한적인 지원을 제공합니다. API에서 지원되는 부분은 다음과 같습니다.

* [클래스 참조](reflection#class-references) (`::class`)
* [`KType` 및 `typeof()`](#ktype-and-typeof)
* [`KClass` 및 `createInstance()`](#kclass-and-createinstance)

## 클래스 참조

`::class` 구문은 인스턴스의 클래스 또는 주어진 타입에 해당하는 클래스에 대한 참조를 반환합니다. Kotlin/JS에서 `::class` 표현식의 값은 다음만 지원하는 간소화된 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 구현입니다.
* [simpleName](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/simple-name.html) 및 [isInstance()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/is-instance.html) 멤버.
* [cast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/cast.html) 및
[safeCast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/safe-cast.html) 확장 함수.

또한 [KClass.js](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html)를 사용하여 클래스에 해당하는 [JsClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-class/index.html) 인스턴스에 접근할 수 있습니다.
`JsClass` 인스턴스 자체는 생성자 함수에 대한 참조입니다.
이는 생성자에 대한 참조를 예상하는 JS 함수와 상호 작용하는 데 사용할 수 있습니다.

## KType 및 typeOf()

[`typeof()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 함수는 주어진 타입에 대해 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/)의 인스턴스를 생성합니다.
`KType` API는 Java 특정 부분을 제외하고 Kotlin/JS에서 완벽하게 지원됩니다.

## KClass 및 createInstance()

[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 인터페이스의 [`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html) 함수는
지정된 클래스의 새 인스턴스를 생성하며, 이는 Kotlin 클래스에 대한 런타임 참조를 얻는 데 유용합니다.

## 예제

다음은 Kotlin/JS에서 리플렉션 사용의 예입니다.

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