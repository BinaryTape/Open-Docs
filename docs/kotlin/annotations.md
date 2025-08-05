[//]: # (title: 注解)

注解是一种将元数据附加到代码的方式。要声明一个注解，请在类前加上 `annotation` 修饰符：

```kotlin
annotation class Fancy
```

注解的附加属性可以通过使用元注解注解注解类来指定：

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html) 指定了可以被该注解注解的元素种类（例如类、函数、属性和表达式）；
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html) 指定了注解是否存储在编译后的类文件中，以及它在运行时是否通过反射可见（默认情况下，两者都为 true）；
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html) 允许在单个元素上多次使用同一个注解；
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html) 指定该注解是公共 API 的一部分，并且应包含在生成的 API 文档中显示的类或方法签名中。

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

如果你需要注解一个类的主构造函数，你需要将 `constructor` 关键字添加到构造函数声明中，并在其前面添加注解：

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

你还可以注解属性访问器：

```kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```

## 构造函数

注解可以有接受形参的构造函数。

```kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```

允许的形参类型有：

 * 对应 Java 原生类型（Int、Long 等）的类型
 * 字符串
 * 类 (`Foo::class`)
 * 枚举
 * 其他注解
 * 上述类型的数组

注解形参不能具有可空类型，因为 JVM 不支持将 `null` 存储为注解属性的值。

如果一个注解被用作另一个注解的形参，其名称不带 `@` 字符前缀：

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

如果你需要指定一个类作为注解的实参，请使用 Kotlin 类（[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html)）。Kotlin 编译器将自动将其转换为 Java 类，以便 Java 代码可以正常访问注解和实参。

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## 实例化

在 Java 中，注解类型是一种接口形式，因此你可以实现它并使用一个实例。作为这种机制的替代方案，Kotlin 允许你在任意代码中调用注解类的构造函数，并以类似方式使用生成的实例。

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

有关注解类实例化的更多信息，请参见[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md)。

## Lambda 表达式

注解也可以用于 lambda 表达式。它们将应用于生成 lambda 主体的 `invoke()` 方法。这对于像 [Quasar](https://docs.paralleluniverse.co/quasar/) 这样的框架很有用，该框架使用注解进行并发控制。

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## 注解使用点目标

当你注解属性或主构造函数形参时，有多个从相应 Kotlin 元素生成的 Java 元素，因此在生成的 Java 字节码中注解可能有多个位置。要精确指定注解应如何生成，请使用以下语法：

```kotlin
class Example(@field:Ann val foo,    // annotate only the Java field
              @get:Ann val bar,      // annotate only the Java getter
              @param:Ann val quux)   // annotate only the Java constructor parameter
```

相同的语法可以用来注解整个文件。为此，请在文件的顶层，包指令之前或（如果文件在默认包中）所有导入之前，放置一个目标为 `file` 的注解：

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

如果你有多个具有相同目标的注解，可以通过在目标后面添加方括号并将所有注解放在方括号内来避免重复目标（`all` 元目标除外）：

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

支持的使用点目标完整列表如下：

  * `file`
  * `field`
  * `property`（具有此目标的注解在 Java 中不可见）
  * `get`（属性 getter）
  * `set`（属性 setter）
  * `all`（属性的实验性元目标，请参见[下文](#all-meta-target)了解其目的和用法）
  * `receiver`（扩展函数或属性的接收者形参）

    要注解扩展函数的接收者形参，请使用以下语法：

    ```kotlin
    fun @receiver:Fancy String.myExtension() { ... }
    ```
    
  * `param`（构造函数形参）
  * `setparam`（属性 setter 形参）
  * `delegate`（用于委托属性的委托实例的字段）

### 未指定使用点目标时的默认行为

如果你没有指定使用点目标，则会根据正在使用的注解的 `@Target` 注解来选择目标。如果存在多个适用目标，则使用以下列表中的第一个适用目标：

* `param`
* `property`
* `field`

我们以 [Jakarta Bean Validation](https://jakarta.ee/specifications/bean-validation/3.0/apidocs/jakarta/validation/constraints/email) 中的 `@Email` 注解为例：

```java
@Target(value={METHOD,FIELD,ANNOTATION_TYPE,CONSTRUCTOR,PARAMETER,TYPE_USE})
public @interface Email { }
```

使用此注解，考虑以下示例：

```kotlin
data class User(val username: String,
                // @Email is equivalent to @param:Email
                @Email val email: String) {
    // @Email is equivalent to @field:Email
    @Email val secondaryEmail: String? = null
}
```

Kotlin 2.2.0 引入了一个实验性的默认规则，该规则应该能使注解传播到形参、字段和属性的过程更可预测。

根据新规则，如果存在多个适用目标，则按以下方式选择一个或多个：

* 如果构造函数形参目标（`param`）适用，则使用它。
* 如果属性目标（`property`）适用，则使用它。
* 如果字段目标（`field`）适用而 `property` 不适用，则使用 `field`。

沿用相同的示例：

```kotlin
data class User(val username: String,
                // @Email is now equivalent to @param:Email @field:Email
                @Email val email: String) {
    // @Email is still equivalent to @field:Email
    @Email val secondaryEmail: String? = null
}
```

如果存在多个目标，且 `param`、`property` 或 `field` 均不适用，则该注解无效。

要启用新的默认规则，请在你的 Gradle 配置中添加以下行：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

无论何时你想使用旧行为，你可以：

* 在特定情况下，显式指定必要目标，例如，使用 `@param:Annotation` 而不是 `@Annotation`。
* 对于整个项目，请在你的 Gradle 构建文件中使用此标志：

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

### `all` 元目标

<primary-label ref="experimental-opt-in"/>

`all` 目标使得将同一个注解不仅应用于形参、属性或字段，而且应用于相应的 getter 和 setter 变得更加容易。

具体来说，标记为 `all` 的注解如果适用，会传播到：

* 如果属性定义在主构造函数中，则传播到构造函数形参（`param`）。
* 属性本身（`property`）。
* 如果属性有一个幕后字段，则传播到该字段（`field`）。
* getter（`get`）。
* 如果属性定义为 `var`，则传播到 setter 形参（`setparam`）。
* 如果类具有 `@JvmRecord` 注解，则传播到仅限 Java 的目标 `RECORD_COMPONENT`。

我们以 [Jakarta Bean Validation](https://jakarta.ee/specifications/bean-validation/3.0/apidocs/jakarta/validation/constraints/email) 中的 `@Email` 注解为例，其定义如下：

```java
@Target(value={METHOD,FIELD,ANNOTATION_TYPE,CONSTRUCTOR,PARAMETER,TYPE_USE})
public @interface Email { }
```

在下面的示例中，此 `@Email` 注解将应用于所有相关目标：

```kotlin
data class User(
    val username: String,
    // 将 `@Email` 应用于 `param`、`field` 和 `get`
    @all:Email val email: String,
    // 将 `@Email` 应用于 `param`、`field`、`get` 和 `set_param`
    @all:Email var name: String,
) {
    // 将 `@Email` 应用于 `field` 和 `getter`（没有 `param`，因为它不在构造函数中）
    @all:Email val secondaryEmail: String? = null
}
```

你可以在任何属性上使用 `all` 元目标，无论它是在主构造函数内部还是外部。

#### 限制

`all` 目标有一些限制：

* 它不会将注解传播到类型、潜在的扩展接收者或上下文接收者或形参。
* 它不能与多个注解一起使用：
    ```kotlin
    @all:[A B] // 禁止，请使用 `@all:A @all:B`
    val x: Int = 5
    ```
* 它不能与[委托属性](delegated-properties.md)一起使用。

#### 如何启用

要在你的项目中启用 `all` 元目标，请在命令行中使用以下编译器选项：

```Bash
-Xannotation-target-all
```

或将其添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

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

由于 Java 中编写的注解的形参顺序未定义，因此你不能使用常规函数调用语法来传递实参。相反，你需要使用命名实参语法：

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

就像在 Java 中一样，`value` 形参是一个特殊情况；无需显式名称即可指定其值：

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

### 数组作为注解形参

如果 Java 中的 `value` 实参具有数组类型，它在 Kotlin 中会变为 `vararg` 形参：

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

对于具有数组类型的其他实参，你需要使用数组字面量语法或 `arrayOf(...)`：

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

注解实例的值作为属性公开给 Kotlin 代码：

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

如果 Kotlin 注解在其 Kotlin 目标中包含 `TYPE`，则该注解会映射到其 Java 注解目标列表中的 `java.lang.annotation.ElementType.TYPE_USE`。这与 `TYPE_PARAMETER` Kotlin 目标映射到 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 目标的方式类似。对于 API 级别低于 26 的 Android 客户端来说，这是一个问题，因为它们的 API 中没有这些目标。

为避免生成 `TYPE_USE` 和 `TYPE_PARAMETER` 注解目标，请使用新的编译器实参 `-Xno-new-java-annotation-targets`。

## 可重复注解

就像[在 Java 中一样](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)，Kotlin 拥有可重复注解，它们可以多次应用于单个代码元素。要使你的注解可重复，请使用 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 元注解标记其声明。这将使其在 Kotlin 和 Java 中都可重复。Java 可重复注解也受 Kotlin 支持。

与 Java 中使用的方案的主要区别在于缺少 _容器注解_，Kotlin 编译器会以预定义名称自动生成它。对于下面的示例中的注解，它将生成容器注解 `@Tag.Container`：

```kotlin
@Repeatable
annotation class Tag(val name: String)

// 编译器会生成 @Tag.Container 容器注解
```

你可以通过应用 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元注解并传递一个显式声明的容器注解类作为实参来为容器注解设置自定义名称：

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

要通过反射提取 Kotlin 或 Java 可重复注解，请使用 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 函数。

有关 Kotlin 可重复注解的更多信息，请参见[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md)。