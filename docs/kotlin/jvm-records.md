[//]: # (title: 在 Kotlin 中使用 Java record)

_Record_ 是 Java 中用于存储不可变数据的[类](https://openjdk.java.net/jeps/395)。Record 携带一组固定的值——即 _record 组件_。
它们在 Java 中语法简洁，可以免于编写模板代码：

```java
// Java
public record Person (String name, int age) {}
```

编译器会自动生成一个继承自 [`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html) 的 final 类，其中包含以下成员：
* 为每个 record 组件提供一个私有的 final 字段
* 一个包含所有字段参数的公有构造函数
* 一组实现结构相等的的方法：`equals()`、`hashCode()`、`toString()`
* 为读取每个 record 组件提供一个公有方法

Record 与 Kotlin 的[数据类](data-classes.md)非常相似。

## 在 Kotlin 代码中使用 Java record

您可以像在 Kotlin 中使用带属性的类一样，使用在 Java 中声明了组件的 record 类。
要访问 record 组件，只需像使用 [Kotlin 属性](properties.md)一样使用其名称即可：

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## 在 Kotlin 中声明 record

Kotlin 仅支持为数据类声明 record，且该数据类必须符合[要求](#requirements)。

要在 Kotlin 中声明 record 类，请使用 `@JvmRecord` 注解：

> 将 `@JvmRecord` 应用于现有类不是二进制兼容的变更。它会改变类属性访问器的命名约定。
>
{style="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

这个 JVM 特有的注解能够生成：

* 类文件中与类属性相对应的 record 组件
* 根据 Java record 命名约定命名的属性访问器方法

数据类提供了 `equals()`、`hashCode()` 和 `toString()` 方法的实现。

### 要求

要使用 `@JvmRecord` 注解声明数据类，必须满足以下要求：

* 该类必须位于以 JVM 16 字节码为目标的模块中（如果启用了 `-Xjvm-enable-preview` 编译器选项，则可以是 15）。
* 该类不能显式继承任何其他类（包括 `Any`），因为所有 JVM record 都隐式继承自 `java.lang.Record`。不过，该类可以实现接口。
* 该类不能声明任何带有支持字段的属性——除非这些属性是从对应的主构造函数参数初始化的。
* 该类不能声明任何带有支持字段的可变属性。
* 该类不能是局部类。
* 主构造函数的可见性必须与类本身一致。

### 启用 JVM record

JVM record 要求生成的 JVM 字节码目标版本为 `16` 或更高。

要显式指定该版本，请在 [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm) 或 [Maven](maven-compile-package.md#attributes-specific-to-jvm) 中使用 `jvmTarget` 编译器选项。

## 在 Kotlin 中为 record 组件添加注解

<primary-label ref="experimental-general"/>

在 Java 中，record 组件上的[注解](annotations.md)会自动传播到支持字段、getter、setter 和构造函数参数。
您可以在 Kotlin 中通过使用 [`all`](annotations.md#all-meta-target) 使用处目标来复制此行为。

> 要使用 `all` 使用处目标，您必须选择启用。可以使用 `-Xannotation-target-all` 编译器选项，或者在 `build.gradle.kts` 文件中添加以下内容：
>
> ```kotlin
> kotlin {
>     compilerOptions {
>         freeCompilerArgs.add("-Xannotation-target-all")
>     }
> }
> ```
>
{style="warning"}

例如：

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

当您将 `@JvmRecord` 与 `@all:` 配合使用时，Kotlin 会：

* 将注解传播到属性、支持字段、构造函数参数、getter 和 setter。
* 如果该注解支持 Java 的 `RECORD_COMPONENT`，也会将该注解应用到 record 组件上。

## 让注解支持 record 组件

要使一个[注解](annotations.md)同时适用于 Kotlin 属性**和** Java record 组件，请在注解声明中添加以下元注解：

* 对于 Kotlin：[`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)
* 对于 Java record 组件：[`@java.lang.annotation.Target`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Target.html)

例如：

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class ExampleClass
```

现在，您可以将 `@ExampleClass` 应用于 Kotlin 类和属性，以及 Java 类和 record 组件。

## 进一步讨论

有关更多技术细节和讨论，请参阅这份 [JVM record 语言提案](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md)。