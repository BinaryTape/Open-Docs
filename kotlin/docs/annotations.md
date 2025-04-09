---
title: "注解 (Annotations)"
---
注解是向代码附加元数据的一种方式。要声明一个注解，请在类前面加上 `annotation` 修饰符：

```kotlin
annotation class Fancy
```

可以通过使用元注解来注解注解类，从而指定注解的附加属性：

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html) 指定可以使用该注解注解的元素种类（例如类、函数、属性和表达式）；
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html) 指定注解是否存储在已编译的类文件中，以及是否在运行时通过反射可见（默认情况下，两者都为 true）；
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html) 允许在单个元素上多次使用相同的注解；
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html) 指定注解是公共 API 的一部分，应包含在生成的 API 文档中显示的类或方法签名中。

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION,
        AnnotationTarget.TYPE_PARAMETER, AnnotationTarget.VALUE_PARAMETER, 
        AnnotationTarget.EXPRESSION)
@Retention(AnnotationRetention.SOURCE)
@MustBeDocumented
annotation class Fancy
```

## 用法

```kotlin
@Fancy class Foo {
    @Fancy fun baz(@Fancy foo: Int): Int {
        return (@Fancy 1)
    }
}
```

如果需要注解类的主构造函数，则需要在构造函数声明中添加 `constructor` 关键字，并在其前面添加注解：

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

你也可以注解属性的访问器 (accessor)：

```kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```

## 构造函数

注解可以有带参数的构造函数。

```kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```

允许的参数类型有：

 * 对应于 Java 原始类型的类型（Int、Long 等）
 * 字符串
 * 类 (`Foo::class`)
 * 枚举
 * 其他注解
 * 上述类型的数组

注解参数不能具有可空类型，因为 JVM 不支持将 `null` 存储为注解属性的值。

如果注解用作另一个注解的参数，则其名称不以 `@` 字符为前缀：

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

如果需要将类指定为注解的参数，请使用 Kotlin 类
([KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html))。Kotlin 编译器将
自动将其转换为 Java 类，以便 Java 代码可以正常访问注解和参数。

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## 实例化

在 Java 中，注解类型是接口的一种形式，因此你可以实现它并使用实例。
作为此机制的替代方法，Kotlin 允许你在任意代码中调用注解类的构造函数，
并类似地使用生成的实例。

```kotlin
annotation class InfoMarker(val info: String)

fun processInfo(marker: InfoMarker): Unit = TODO()

fun main(args: Array<String>) {
    if (args.isNotEmpty())
        processInfo(getAnnotationReflective(args))
    else
        processInfo(InfoMarker("default"))
}
```

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation) 中了解有关注解类实例化的更多信息。

## Lambda 表达式

注解也可以用在 lambda 表达式上。它们将被应用于生成 lambda 表达式主体的 `invoke()` 方法。这对于像 [Quasar](https://docs.paralleluniverse.co/quasar/) 这样的框架很有用，
它使用注解进行并发控制。

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## 注解的使用位置目标 (use-site target)

当你注解属性或主构造函数参数时，会从相应的 Kotlin 元素生成多个 Java 元素，
因此在生成的 Java 字节码中，注解可能有多个位置。要指定应如何准确生成注解，请使用以下语法：

```kotlin
class Example(@field:Ann val foo,    // 注解 Java 字段
              @get:Ann val bar,      // 注解 Java getter
              @param:Ann val quux)   // 注解 Java 构造函数参数
```

相同的语法可用于注解整个文件。为此，请将带有目标 `file` 的注解放在文件的顶层，
在 package 指令之前，或者如果文件位于默认 package 中，则在所有 import 语句之前：

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

如果你有多个具有相同目标的注解，则可以通过在目标后添加方括号并将所有注解放在方括号内来避免重复目标：

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

支持的 use-site target 的完整列表是：

  * `file`
  * `property`（带有此目标的注解对 Java 不可见）
  * `field`
  * `get`（属性 getter）
  * `set`（属性 setter）
  * `receiver`（扩展函数或属性的 receiver 参数）
  * `param`（构造函数参数）
  * `setparam`（属性 setter 参数）
  * `delegate`（存储委托属性的委托实例的字段）

要注解扩展函数的 receiver 参数，请使用以下语法：

```kotlin
fun @receiver:Fancy String.myExtension() { ... }
```

如果未指定 use-site target，则根据所使用的注解的 `@Target` 注解选择目标。
如果有多个适用的目标，则使用以下列表中第一个适用的目标：

  * `param`
  * `property`
  * `field`

## Java 注解

Java 注解与 Kotlin 100% 兼容：

```kotlin
import org.junit.Test
import org.junit.Assert.*
import org.junit.Rule
import org.junit.rules.*

class Tests {
    // 将 @Rule 注解应用于属性 getter
    @get:Rule val tempFolder = TemporaryFolder()

    @Test fun simple() {
        val f = tempFolder.newFile()
        assertEquals(42, getTheAnswer())
    }
}
```

由于用 Java 编写的注解的参数顺序未定义，因此不能使用常规函数调用语法来传递参数。
相反，你需要使用命名参数语法：

``` java
// Java
public @interface Ann {
    int intValue();
    String stringValue();
}
```

```kotlin
// Kotlin
@Ann(intValue = 1, stringValue = "abc") class C
```

与 Java 中一样，一个特例是 `value` 参数；可以在没有显式名称的情况下指定其值：

``` java
// Java
public @interface AnnWithValue {
    String value();
}
```

```kotlin
// Kotlin
@AnnWithValue("abc") class C
```

### 数组作为注解参数

如果 Java 中的 `value` 参数具有数组类型，则它在 Kotlin 中会成为 `vararg` 参数：

``` java
// Java
public @interface AnnWithArrayValue {
    String[] value();
}
```

```kotlin
// Kotlin
@AnnWithArrayValue("abc", "foo", "bar") class C
```

对于具有数组类型的其他参数，你需要使用数组字面量语法或 `arrayOf(...)`：

``` java
// Java
public @interface AnnWithArrayMethod {
    String[] names();
}
```

```kotlin
@AnnWithArrayMethod(names = ["abc", "foo", "bar"]) 
class C
```

### 访问注解实例的属性

注解实例的值作为属性暴露给 Kotlin 代码：

``` java
// Java
public @interface Ann {
    int value();
}
```

```kotlin
// Kotlin
fun foo(ann: Ann) {
    val i = ann.value
}
```

### 不生成 JVM 1.8+ 注解 target 的能力

如果 Kotlin 注解在其 Kotlin target 中包含 `TYPE`，则该注解会映射到其 Java 注解 target 列表中的 `java.lang.annotation.ElementType.TYPE_USE`。
这就像 `TYPE_PARAMETER` Kotlin target 映射到 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java target 的方式一样。
对于 API 级别低于 26 的 Android 客户端来说，这是一个问题，因为这些 target 不在 API 中。

要避免生成 `TYPE_USE` 和 `TYPE_PARAMETER` 注解 target，请使用新的编译器参数 `-Xno-new-java-annotation-targets`。

## 可重复注解

就像 [在 Java 中](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html) 一样，Kotlin 具有可重复注解，
可以多次应用于单个代码元素。要使你的注解可重复，请使用
[`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/)
元注解标记其声明。这将使其在 Kotlin 和 Java 中都可重复。Kotlin 端也支持 Java 可重复注解。

与 Java 中使用的方案的主要区别在于缺少 _包含注解_，Kotlin 编译器
使用预定义的名称自动生成该注解。对于下面示例中的注解，它将生成包含注解 `@Tag.Container`：

```kotlin
@Repeatable
annotation class Tag(val name: String)

// 编译器生成 @Tag.Container 包含注解
```

你可以通过应用
[`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元注解
并将显式声明的包含注解类作为参数传递来为包含注解设置自定义名称：

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

要通过反射提取 Kotlin 或 Java 可重复注解，请使用 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html)
函数。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations) 中了解有关 Kotlin 可重复注解的更多信息。