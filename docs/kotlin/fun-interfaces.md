---
title: "函数式 (SAM) 接口"
---
只有一个抽象成员函数的接口被称为 _函数式接口_ (functional interface)，或者 _单抽象方法（SAM）接口_ (Single Abstract Method (SAM) interface)。函数式接口可以有多个非抽象成员函数，但只能有一个抽象成员函数。

要在 Kotlin 中声明函数式接口，请使用 `fun` 修饰符。

```kotlin
fun interface KRunnable {
   fun invoke()
}
```

## SAM 转换 (SAM conversions)

对于函数式接口，你可以使用 SAM 转换 (SAM conversions)，通过使用 [lambda 表达式](lambdas#lambda-expressions-and-anonymous-functions) 来帮助你使代码更简洁和易读。

你可以使用 lambda 表达式来代替手动创建一个类来实现函数式接口。通过 SAM 转换 (SAM conversions)，Kotlin 可以将任何签名与接口的单个方法签名匹配的 lambda 表达式转换为代码，该代码会动态地实例化接口实现。

例如，考虑以下 Kotlin 函数式接口：

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}
```

如果不使用 SAM 转换 (SAM conversions)，你需要编写如下代码：

```kotlin
// 创建一个类的实例
val isEven = object : IntPredicate {
   override fun accept(i: Int): Boolean {
       return i % 2 == 0
   }
}
```

通过利用 Kotlin 的 SAM 转换 (SAM conversions)，你可以编写以下等效代码来代替：

```kotlin
// 使用 lambda 创建一个实例
val isEven = IntPredicate { it % 2 == 0 }
```

一个简短的 lambda 表达式替换了所有不必要的代码。

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven.accept(7)}")
}
```

你也可以将 [SAM 转换 (SAM conversions) 用于 Java 接口](java-interop#sam-conversions)。

## 从带有构造函数函数的接口迁移到函数式接口

从 1.6.20 开始，Kotlin 支持对函数式接口构造函数的 [可调用引用](reflection#callable-references)，这提供了一种源码兼容的方式，可以从带有构造函数函数的接口迁移到函数式接口。
考虑以下代码：

```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () `->` Unit): Printer = object : Printer { override fun print() = block() }
```

启用对函数式接口构造函数的可调用引用后，此代码可以仅替换为函数式接口声明：

```kotlin
fun interface Printer { 
    fun print()
}
```

它的构造函数将被隐式创建，并且任何使用 `::Printer` 函数引用的代码都将编译。例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```

通过使用 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 注解和 `DeprecationLevel.HIDDEN` 标记旧函数 `Printer` 来保留二进制兼容性：

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## 函数式接口 vs. 类型别名

你也可以简单地使用函数类型的 [类型别名](type-aliases) 重写上面的内容：

```kotlin
typealias IntPredicate = (i: Int) `->` Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven(7)}")
}
```

但是，函数式接口和 [类型别名](type-aliases) 的用途不同。
类型别名只是现有类型的名称——它们不会创建新类型，而函数式接口会创建新类型。
你可以提供特定于特定函数式接口的扩展，使其不适用于普通函数或其类型别名。

类型别名只能有一个成员，而函数式接口可以有多个非抽象成员函数和一个抽象成员函数。
函数式接口还可以实现和扩展其他接口。

函数式接口比类型别名更灵活，并提供更多功能，但它们在语法上和运行时上可能更昂贵，因为它们可能需要转换为特定接口。
在选择在代码中使用哪一个时，请考虑你的需求：
* 如果你的 API 需要接受具有某些特定参数和返回类型的函数（任何函数）——使用一个简单的函数类型或者定义一个类型别名来给相应的函数类型一个更短的名称。
* 如果你的 API 接受比函数更复杂的实体——例如，它具有非平凡的约定和/或对其进行无法用函数类型的签名表示的操作——则为其声明一个单独的函数式接口。