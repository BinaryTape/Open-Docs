[//]: # (title: 函数式 (SAM) 接口)

只有一个抽象成员函数的接口被称为 *函数式接口*，或 *单一抽象方法 (SAM) 接口*。函数式接口可以拥有多个非抽象成员函数，但只能有一个抽象成员函数。

要在 Kotlin 中声明函数式接口，请使用 `fun` 修饰符。

```kotlin
fun interface KRunnable {
    fun invoke()
}
```

## SAM 转换

对于函数式接口，你可以使用 SAM 转换，通过使用 [lambda表达式](lambdas.md#lambda-expressions-and-anonymous-functions) 来使代码更简洁、更具可读性。

你可以使用 lambda 表达式来代替手动创建实现函数式接口的类。通过 SAM 转换，Kotlin 可以将任何签名与该接口单一方法的签名相匹配的 lambda 表达式转换为动态实例化该接口实现的代碼。

例如，考虑以下 Kotlin 函数式接口：

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}
```

如果不使用 SAM 转换，你需要编写如下代码：

```kotlin
// 创建一个类的实例
val isEven = object : IntPredicate {
    override fun accept(i: Int): Boolean {
        return i % 2 == 0
    }
}
```

通过利用 Kotlin 的 SAM 转换，你可以编写以下等效代码：

```kotlin
// 使用 lambda 创建实例
val isEven = IntPredicate { it % 2 == 0 }
```

一段简短的 lambda 表达式即可替换所有不必要的代码。

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() {
    println("Is 7 even? - ${isEven.accept(7)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

你还可以使用 [针对 Java 接口的 SAM 转换](java-interop.md#sam-conversions)。

## 从带有构造函数的接口迁移到函数式接口

从 1.6.20 开始，Kotlin 支持对函数式接口构造函数的 [可调用引用](reflection.md#callable-references)，这增加了一种源码兼容的方式，用于从带有构造函数的接口迁移到函数式接口。考虑以下代码：

```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () -> Unit): Printer = object : Printer {
    override fun print() = block()
}
```

通过启用对函数式接口构造函数的可调用引用，这段代码可以替换为仅一个函数式接口声明：

```kotlin
fun interface Printer { 
    fun print()
}
```

它的构造函数将被隐式创建，任何使用 `::Printer` 函数引用的代码都将通过编译。例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```

通过使用 `DeprecationLevel.HIDDEN` 的 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 注解标记旧版函数 `Printer` 来保持二进制兼容性：

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## 函数式接口 vs. 类型别名

你也可以简单地使用针对函数类型的 [类型别名](type-aliases.md) 来重写上述内容：

```kotlin
typealias IntPredicate = (i: Int) -> Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
    println("Is 7 even? - ${isEven(7)}")
}
```

然而，函数式接口和 [类型别名](type-aliases.md) 的用途不同。类型别名只是现有类型的名称——它们不会创建新类型，而函数式接口会。你可以提供特定于某个特定函数式接口的扩展，使其不适用于普通函数或其类型别名。

类型别名只能有一个成员，而函数式接口可以有多个非抽象成员函数和一个抽象成员函数。函数式接口还可以实现和扩展其他接口。

函数式接口比类型别名更灵活，提供更多能力，但它们在语法和运行时上的开销可能更高，因为它们可能需要转换为特定的接口。在选择使用哪一种时，请考虑你的需求：
* 如果你的 API 需要接受一个具有特定参数和返回值类型的函数（任何函数）——请使用简单的函数类型或定义类型别名来为相应的函数类型命名。
* 如果你的 API 接受比函数更复杂的实体——例如，它具有非琐碎的契约和/或无法在函数类型签名中表达的操作——请为其声明一个单独的函数式接口。