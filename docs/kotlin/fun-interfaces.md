[//]: # (title: 函数式 (SAM) 接口)

只有一个抽象成员函数的接口称为_函数式接口_，或_单一抽象方法 (SAM) 接口_。函数式接口可以有多个非抽象成员函数，但只能有一个抽象成员函数。

在 Kotlin 中声明函数式接口时，使用 `fun` 修饰符。

```kotlin
fun interface KRunnable {
   fun invoke()
}
```

## SAM 转换

对于函数式接口，你可以使用 SAM 转换，通过使用 [lambda 表达式](lambdas.md#lambda-expressions-and-anonymous-functions) 来使你的代码更简洁、更具可读性。

你可以使用 lambda 表达式，而不是手动创建实现函数式接口的类。通过 SAM 转换，Kotlin 可以将任何签名与接口的单一方法签名匹配的 lambda 表达式转换为代码，该代码动态实例化接口实现。

例如，考虑以下 Kotlin 函数式接口：

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}
```

如果你不使用 SAM 转换，你需要编写如下代码：

```kotlin
// Creating an instance of a class
val isEven = object : IntPredicate {
   override fun accept(i: Int): Boolean {
       return i % 2 == 0
   }
}
```

利用 Kotlin 的 SAM 转换，你可以编写以下等效代码：

```kotlin
// Creating an instance using lambda
val isEven = IntPredicate { it % 2 == 0 }
```

一个简短的 lambda 表达式替代了所有不必要的代码。

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

你也可以将 [SAM 转换用于 Java 接口](java-interop.md#sam-conversions)。

## 从带构造函数的接口迁移到函数式接口

从 1.6.20 版本开始，Kotlin 支持对函数式接口构造函数的[可调用引用](reflection.md#callable-references)，这提供了一种源代码兼容的方式，可以将带构造函数的接口迁移到函数式接口。
考虑以下代码：

```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

启用函数式接口构造函数的可调用引用后，这段代码可以被替换为简单的函数式接口声明：

```kotlin
fun interface Printer { 
    fun print()
}
```

它的构造函数将隐式创建，并且任何使用 `::Printer` 函数引用的代码都将编译通过。例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```

通过使用 `DeprecationLevel.HIDDEN` 的 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 注解标记遗留函数 `Printer` 来保持二进制兼容性：

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## 函数式接口与类型别名

你也可以简单地使用函数类型的[类型别名](type-aliases.md)来重写上述内容：

```kotlin
typealias IntPredicate = (i: Int) -> Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven(7)}")
}
```

然而，函数式接口和[类型别名](type-aliases.md)服务于不同的目的。类型别名只是现有类型的名称——它们不创建新类型，而函数式接口会。你可以提供特定于某个函数式接口的扩展，使其不适用于普通函数或其类型别名。

类型别名只能有一个成员，而函数式接口可以有多个非抽象成员函数和一个抽象成员函数。函数式接口还可以实现和扩展其他接口。

函数式接口比类型别名更灵活，并提供更多功能，但它们在语法上和运行时都可能代价更高，因为它们可能需要转换为特定的接口。当你选择在代码中使用哪种时，请考虑你的需求：
* 如果你的 API 需要接受一个具有特定参数和返回类型的函数（任何函数）——请使用简单的函数类型或定义一个类型别名来为相应的函数类型提供一个更短的名称。
* 如果你的 API 接受一个比函数更复杂的实体——例如，它具有非简单的契约和/或在其上无法用函数类型签名表达的操作——请为其声明一个单独的函数式接口。