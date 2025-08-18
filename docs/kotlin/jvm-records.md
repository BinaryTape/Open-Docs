[//]: # (title: 在 Kotlin 中使用 Java 记录)

记录是 Java 中用于存储不可变数据的[类](https://openjdk.java.net/jeps/395)。记录带有一组固定的值——即记录组件。它们在 Java 中拥有简洁的语法，并能帮你省去编写样板代码的麻烦：

```java
// Java
public record Person (String name, int age) {}
```

编译器会自动生成一个继承自 [`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html) 的 final 类，包含以下成员：
* 为每个记录组件生成一个私有 final 字段
* 一个带有所有字段形参的公共构造函数
* 一组用于实现结构相等性的方法：`equals()`、`hashCode()`、`toString()`
* 一个用于读取每个记录组件的公共方法

记录与 Kotlin [数据类](data-classes.md) 非常相似。

## 在 Kotlin 代码中使用 Java 记录

你可以像在 Kotlin 中使用带属性的类一样，使用在 Java 中声明的记录类及其组件。要访问记录组件，只需像访问 [Kotlin 属性](properties.md) 那样使用其名称即可：

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## 在 Kotlin 中声明记录

Kotlin 仅支持针对数据类的记录声明，并且该数据类必须满足 [要求](#requirements)。

要在 Kotlin 中声明记录类，请使用 `@JvmRecord` 注解：

> 将 `@JvmRecord` 应用于现有类不是一个二进制兼容的变更。它会改变类属性访问器的命名约定。
>
{style="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

这个 JVM 特有的注解能够生成：

* 类文件中与类属性对应的记录组件
* 按照 Java 记录命名约定命名的属性访问器方法

该数据类提供 `equals()`、`hashCode()` 和 `toString()` 方法的实现。

### 要求

要使用 `@JvmRecord` 注解声明数据类，它必须满足以下要求：

* 该类必须位于面向 JVM 16 字节码的模块中（如果启用了 `-Xjvm-enable-preview` 编译器选项，也可以是 15）。
* 该类不能显式继承任何其他类（包括 `Any`），因为所有 JVM 记录都会隐式继承 `java.lang.Record`。但是，该类可以实现接口。
* 该类不能声明任何带有幕后字段的属性——但从相应主构造函数形参初始化的除外。
* 该类不能声明任何带有幕后字段的可变属性。
* 该类不能是局部类。
* 类的主构造函数必须与类本身具有相同的可见性。

### 启用 JVM 记录

JVM 记录要求生成的 JVM 字节码的目标版本为 `16` 或更高。

要显式指定它，请在 [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm) 或 [Maven](maven.md#attributes-specific-to-jvm) 中使用 `jvmTarget` 编译器选项。

## 在 Kotlin 中为记录组件添加注解

<primary-label ref="experimental-general"/>

在 Java 中，记录组件上的 [注解](annotations.md) 会自动传播到幕后字段、getter、setter 和构造函数形参。你可以通过使用 [`all`](annotations.md#all-meta-target) 使用点目标在 Kotlin 中复现此行为。

> 要使用 `all` 使用点目标，你必须选择启用。可以利用 `-Xannotation-target-all` 编译器选项，或者将以下内容添加到你的 `build.gradle.kts` 文件中：
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

当你将 `@JvmRecord` 与 `@all:` 一起使用时，Kotlin 会：

* 将注解传播到属性、幕后字段、构造函数形参、getter 和 setter。
* 如果注解支持 Java 的 `RECORD_COMPONENT`，则也会将注解应用于记录组件。

## 使注解适用于记录组件

要使 [注解](annotations.md) 同时适用于 Kotlin 属性**和** Java 记录组件，请将以下元注解添加到你的注解声明中：

* 对于 Kotlin：[`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)
* 对于 Java 记录组件：[`@java.lang.annotation.Target`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Target.html)

例如：

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class exampleClass
```

现在你可以将 `@ExampleClass` 应用于 Kotlin 类和属性，以及 Java 类和记录组件。

## 进一步讨论

关于更多技术细节和讨论，请参见此 [JVM 记录语言提案](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md)。