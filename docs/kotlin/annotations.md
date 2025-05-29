[//]: # (title: 注解)

注解是一种将元数据附加到代码的方式。要声明注解，请在类前面加上 `annotation` 修饰符：

```kotlin
annotation class Fancy
```

注解的额外属性可以通过使用元注解标注注解类来指定：

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html) 用于指定可以应用该注解的元素类型（例如类、函数、属性和表达式）；
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html) 指定注解是否保留在编译后的类文件中，以及在运行时是否可通过反射可见（默认情况下，两者均为 true）；
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html) 允许在单个元素上多次使用相同的注解；
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html) 指定注解是公共 API 的一部分，并且应包含在生成的 API 文档中显示的类或方法签名中。

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

如果您需要注解类的主构造函数，您需要在构造函数声明前添加 `constructor` 关键字，并在其前面添加注解：

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

您也可以注解属性访问器：

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

 * 对应 Java 基本类型（如 Int、Long 等）的类型
 * 字符串
 * 类（`Foo::class`）
 * 枚举
 * 其他注解
 * 上述类型的数组

注解参数不能是可空类型，因为 JVM 不支持将 `null` 作为注解属性的值存储。

如果一个注解被用作另一个注解的参数，其名称不带 `@` 字符前缀：

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

如果您需要将类指定为注解的参数，请使用 Kotlin 类（[`KClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html)）。Kotlin 编译器会自动将其转换为 Java 类，以便 Java 代码可以正常访问注解和参数。

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## 实例化

在 Java 中，注解类型是一种接口形式，因此您可以实现它并使用一个实例。作为此机制的替代方案，Kotlin 允许您在任意代码中调用注解类的构造函数，并以类似方式使用生成的实例。

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

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) 中了解更多关于注解类实例化的信息。

## Lambda 表达式

注解也可以用于 Lambda 表达式。它们将被应用于生成 Lambda 表达式体所用的 `invoke()` 方法。这对于像 [Quasar](https://docs.paralleluniverse.co/quasar/) 这样的框架非常有用，它使用注解进行并发控制。

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## 注解使用点目标

当您注解一个属性或主构造函数参数时，从对应的 Kotlin 元素会生成多个 Java 元素，因此在生成的 Java 字节码中，注解有多个可能的放置位置。为了精确指定注解应该如何生成，请使用以下语法：

```kotlin
class Example(@field:Ann val foo,    // annotate Java field
              @get:Ann val bar,      // annotate Java getter
              @param:Ann val quux)   // annotate Java constructor parameter
```

同样的语法也可以用于注解整个文件。为此，将一个目标为 `file` 的注解放在文件的顶层，即在包声明之前，或者如果文件在默认包中，则在所有导入之前：

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

如果您有多个具有相同目标的注解，您可以通过在目标后添加方括号并将所有注解放在方括号内来避免重复目标：

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

支持的使用点目标完整列表为：

  * `file`
  * `property`（带有此目标的注解对 Java 不可见）
  * `field`
  * `get`（属性 getter）
  * `set`（属性 setter）
  * `receiver`（扩展函数或属性的接收者参数）
  * `param`（构造函数参数）
  * `setparam`（属性 setter 参数）
  * `delegate`（存储委托属性的委托实例的字段）

要注解扩展函数的接收者参数，请使用以下语法：

```kotlin
fun @receiver:Fancy String.myExtension() { ... }
```

如果您没有指定使用点目标，则目标会根据所用注解的 `@Target` 注解来选择。如果存在多个适用目标，则使用以下列表中的第一个适用目标：

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
    // apply @Rule annotation to property getter
    @get:Rule val tempFolder = TemporaryFolder()

    @Test fun simple() {
        val f = tempFolder.newFile()
        assertEquals(42, getTheAnswer())
    }
}
```

由于 Java 中编写的注解的参数顺序未定义，您不能使用常规函数调用语法来传递参数。相反，您需要使用命名参数语法：

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

就像在 Java 中一样，`value` 参数是一个特例；它的值可以在没有明确名称的情况下指定：

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

如果 Java 中的 `value` 参数具有数组类型，它在 Kotlin 中会变成 `vararg` 参数：

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

对于其他具有数组类型的参数，您需要使用数组字面量语法或 `arrayOf(...)`：

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

注解实例的值以属性的形式暴露给 Kotlin 代码：

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

### 不生成 JVM 1.8+ 注解目标的能力

如果 Kotlin 注解在其 Kotlin 目标中包含 `TYPE`，则该注解会映射到其 Java 注解目标列表中的 `java.lang.annotation.ElementType.TYPE_USE`。这与 `TYPE_PARAMETER` Kotlin 目标映射到 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 目标的方式类似。这对于 API 级别低于 26 的 Android 客户端来说是一个问题，因为这些 API 中不包含这些目标。

为避免生成 `TYPE_USE` 和 `TYPE_PARAMETER` 注解目标，请使用新的编译器参数 `-Xno-new-java-annotation-targets`。

## 可重复注解

正如 [在 Java 中](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html) 一样，Kotlin 也有可重复注解，可以多次应用于单个代码元素。要使您的注解可重复，请使用 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 元注解标记其声明。这将使其在 Kotlin 和 Java 中都可重复。Kotlin 侧也支持 Java 可重复注解。

与 Java 中使用的方案主要区别在于缺少 _容器注解_，Kotlin 编译器会以预定义名称自动生成它。对于以下示例中的注解，它将生成容器注解 `@Tag.Container`：

```kotlin
@Repeatable
annotation class Tag(val name: String)

// 编译器生成 @Tag.Container 容器注解
```

您可以通过应用 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元注解并传递显式声明的容器注解类作为参数，为容器注解设置自定义名称：

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

要通过反射提取 Kotlin 或 Java 可重复注解，请使用 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 函数。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md) 中了解更多关于 Kotlin 可重复注解的信息。