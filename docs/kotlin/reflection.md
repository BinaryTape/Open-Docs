---
title: 反射
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_Reflection_（反射）是一组语言和库功能，允许你在运行时检查程序的结构。
函数和属性是 Kotlin 中的一等公民，因此当使用函数式或响应式风格时，能够检查它们（例如，在运行时了解属性或函数的名称或类型）至关重要。

:::note
Kotlin/JS 对反射功能的支持有限。[了解更多关于 Kotlin/JS 中的反射](js-reflection)。

:::

## JVM 依赖

在 JVM 平台上，Kotlin 编译器发行版包含使用反射功能所需的运行时组件，它是一个单独的
artifact（构件），`kotlin-reflect.jar`。这样做是为了减少不使用反射功能的应用程序所需的运行时
库的大小。

要在 Gradle 或 Maven 项目中使用反射，请添加对 `kotlin-reflect` 的依赖：

* 在 Gradle 中：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    dependencies {
        implementation(kotlin("reflect"))
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    dependencies {
        implementation "org.jetbrains.kotlin:kotlin-reflect:2.1.20"
    }
    ```

    </TabItem>
    </Tabs>

* 在 Maven 中：
    
    ```xml
    <dependencies>
      <dependency>
          <groupId>org.jetbrains.kotlin</groupId>
          <artifactId>kotlin-reflect</artifactId>
      </dependency>
    </dependencies>
    ```

如果你不使用 Gradle 或 Maven，请确保你的项目的 classpath（类路径）中包含 `kotlin-reflect.jar`。
在其他支持的情况下（使用命令行编译器或 Ant 的 IntelliJ IDEA 项目），
默认情况下会添加它。在命令行编译器和 Ant 中，你可以使用 `-no-reflect` 编译器选项将
`kotlin-reflect.jar` 从 classpath 中排除。

## Class references（类引用）

最基本的反射功能是获取 Kotlin 类的运行时引用。要获取对静态已知的 Kotlin 类的引用，可以使用 _class literal_（类字面量）语法：

```kotlin
val c = MyClass::class
```

该引用是 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html) 类型的值。

:::note
在 JVM 上：Kotlin 类引用与 Java 类引用不同。要获取 Java 类引用，
请使用 `KClass` 实例上的 `.java` 属性。

:::

### Bound class references（绑定类引用）

你可以使用相同的 `::class` 语法通过将对象用作 receiver（接收者）来获取对特定对象的类的引用：

```kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```

你将获得对对象的精确类的引用，例如，`GoodWidget` 或 `BadWidget`，
而不管 receiver 表达式的类型（`Widget`）。

## Callable references（可调用引用）

对函数、属性和构造函数的引用也可以
被调用或用作 [function types](lambdas#function-types)（函数类型）的实例。

所有可调用引用的公共超类型是 [`KCallable<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-callable/index.html)，
其中 `R` 是返回值类型。它是属性的属性类型，以及构造函数的构造类型。

### Function references（函数引用）

当你有一个声明如下的命名函数时，你可以直接调用它 (`isOdd(5)`)：

```kotlin
fun isOdd(x: Int) = x % 2 != 0
```

或者，你可以将该函数用作函数类型值，也就是说，将其传递
给另一个函数。为此，请使用 `::` 运算符：

```kotlin
fun isOdd(x: Int) = x % 2 != 0

fun main() {

    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd))

}
```

这里 `::isOdd` 是函数类型 `(Int) `->` Boolean` 的一个值。

函数引用属于 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 的
子类型之一，具体取决于参数计数。例如，`KFunction3<T1, T2, T3, R>`。

当从上下文中知道期望的类型时，`::` 可以与 overloaded functions（重载函数）一起使用。
例如：

```kotlin
fun main() {

    fun isOdd(x: Int) = x % 2 != 0
    fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"
    
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd)) // refers to isOdd(x: Int)

}
```

或者，你可以通过将方法引用存储在具有显式指定类型的变量中来提供必要的上下文：

```kotlin
val predicate: (String) `->` Boolean = ::isOdd   // refers to isOdd(x: String)
```

如果需要使用类成员或 extension function（扩展函数），则需要对其进行限定：`String::toCharArray`。

即使你使用对扩展函数的引用初始化变量，推断的函数类型也将
没有 receiver（接收者），但它将有一个额外的参数来接受 receiver（接收者）对象。要获得一个
带有 receiver（接收者）的函数类型，请显式指定类型：

```kotlin
val isEmptyStringList: List<String>.() `->` Boolean = List<String>::isEmpty
```

#### Example: function composition（示例：函数组合）

考虑以下函数：

```kotlin
fun <A, B, C> compose(f: (B) `->` C, g: (A) `->` B): (A) `->` C {
    return { x `->` f(g(x)) }
}
```

它返回传递给它的两个函数的组合：`compose(f, g) = f(g(*))`。
你可以将此函数应用于可调用引用：

```kotlin
fun <A, B, C> compose(f: (B) `->` C, g: (A) `->` B): (A) `->` C {
    return { x `->` f(g(x)) }
}

fun isOdd(x: Int) = x % 2 != 0

fun main() {

    fun length(s: String) = s.length
    
    val oddLength = compose(::isOdd, ::length)
    val strings = listOf("a", "ab", "abc")
    
    println(strings.filter(oddLength))

}
```

### Property references（属性引用）

要在 Kotlin 中将属性作为一等对象访问，请使用 `::` 运算符：

```kotlin
val x = 1

fun main() {
    println(::x.get())
    println(::x.name) 
}
```

表达式 `::x` 的计算结果为 `KProperty0<Int>` 类型属性对象。你可以使用 `get()` 读取它的
值，或者使用 `name` 属性检索属性名称。有关更多信息，请参见
[`KProperty` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html)（`KProperty` 类）上的文档。

对于诸如 `var y = 1` 之类的可变属性，`::y` 返回一个具有 [`KMutableProperty0<Int>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html) 类型的
值，该类型具有 `set()` 方法：

```kotlin
var y = 1

fun main() {
    ::y.set(2)
    println(y)
}
```

如果需要具有单个泛型参数的函数，则可以使用属性引用：

```kotlin
fun main() {

    val strs = listOf("a", "bc", "def")
    println(strs.map(String::length))

}
```

要访问作为类成员的属性，请按以下方式限定它：

```kotlin
fun main() {

    class A(val p: Int)
    val prop = A::p
    println(prop.get(A(1)))

}
```

对于 extension property（扩展属性）：

```kotlin
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println(String::lastChar.get("abc"))
}
```

### Interoperability with Java reflection（与 Java 反射的互操作性）

在 JVM 平台上，标准库包含 reflection classes（反射类）的扩展，这些扩展提供了与 Java
reflection objects（反射对象）的映射关系（请参见包 `kotlin.reflect.jvm`）。
例如，要查找支持字段或用作 Kotlin 属性的 getter 的 Java 方法，你可以编写如下代码：

```kotlin
import kotlin.reflect.jvm.*
 
class A(val p: Int)
 
fun main() {
    println(A::p.javaGetter) // prints "public final int A.getP()"
    println(A::p.javaField)  // prints "private final int A.p"
}
```

要获取与 Java 类相对应的 Kotlin 类，请使用 `.kotlin` 扩展属性：

```kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

### Constructor references（构造函数引用）

可以像引用方法和属性一样引用构造函数。你可以在程序期望一个函数类型对象的地方使用它们，
该函数类型对象采用与构造函数相同的参数并返回适当类型的对象。
通过使用 `::` 运算符并添加类名来引用构造函数。考虑以下函数
，该函数期望一个没有参数且返回类型为 `Foo` 的函数参数：

```kotlin
class Foo

fun function(factory: () `->` Foo) {
    val x: Foo = factory()
}
```

使用 `::Foo`，即类 `Foo` 的零参数构造函数，你可以这样调用它：

```kotlin
function(::Foo)
```

对构造函数的可调用引用被键入为
[`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 子类型之一，具体
取决于参数计数。

### Bound function and property references（绑定函数和属性引用）

你可以引用特定对象的实例方法：

```kotlin
fun main() {

    val numberRegex = "\\d+".toRegex()
    println(numberRegex.matches("29"))
     
    val isNumber = numberRegex::matches
    println(isNumber("29"))

}
```

该示例没有直接调用方法 `matches`，而是使用了对它的引用。
这种引用绑定到其 receiver（接收者）。
它可以直接调用（如上面的示例中所示），也可以在需要函数类型表达式时使用：

```kotlin
fun main() {

    val numberRegex = "\\d+".toRegex()
    val strings = listOf("abc", "124", "a70")
    println(strings.filter(numberRegex::matches))

}
```

比较绑定引用和未绑定引用的类型。
绑定的可调用引用将其 receiver（接收者）“附加”到它，因此 receiver（接收者）的类型不再是参数：

```kotlin
val isNumber: (CharSequence) `->` Boolean = numberRegex::matches

val matches: (Regex, CharSequence) `->` Boolean = Regex::matches
```

属性引用也可以绑定：

```kotlin
fun main() {

    val prop = "abc"::length
    println(prop.get())

}
```

你无需将 `this` 指定为 receiver（接收者）：`this::foo` 和 `::foo` 是等效的。

### Bound constructor references（绑定构造函数引用）

可以通过提供外部类的实例来获得对 [inner class](nested-classes#inner-classes)（内部类）的构造函数的绑定可调用引用：

```kotlin
class Outer {
    inner class Inner
}

val o = Outer()
val boundInnerCtor = o::Inner
```