---
title: "在 Kotlin 中使用 Java records (记录类)"
---
_Record (记录)_ 是 Java 中用于存储不可变数据的 [类](https://openjdk.java.net/jeps/395)。Record (记录) 携带一组固定的值——也就是 _record (记录) 的组成部分_。它们在 Java 中具有简洁的语法，可以让你免于编写样板代码：

```java
// Java
public record Person (String name, int age) {}
```

编译器会自动生成一个继承自 [`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html) 的 final 类，并包含以下成员：
* 为每个 record (记录) 组件设置一个私有的 final 字段
* 一个带有所有字段参数的公共构造函数
* 一组用于实现结构相等性的方法：`equals()`, `hashCode()`, `toString()`
* 一个用于读取每个 record (记录) 组件的公共方法

Record (记录) 与 Kotlin 的 [data class (数据类)](data-classes) 非常相似。

## 在 Kotlin 代码中使用 Java record (记录)

你可以像在 Kotlin 中使用带有 property (属性) 的类一样，使用在 Java 中声明的带有组件的 record (记录) 类。要访问 record (记录) 组件，只需像使用 [Kotlin property (属性)](properties) 一样使用它的名称：

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## 在 Kotlin 中声明 record (记录)

Kotlin 仅支持 data class (数据类) 的 record (记录) 声明，并且 data class (数据类) 必须满足[要求](#requirements)。

要在 Kotlin 中声明 record (记录) 类，请使用 `@JvmRecord` 注解：

:::note
将 `@JvmRecord` 应用于现有类不是二进制兼容的更改。它会更改类 property (属性) 访问器的命名约定。

:::

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

这个 JVM 特定的注解能够生成：

* 类文件中与类 property (属性) 对应的 record (记录) 组件
* 根据 Java record (记录) 命名约定命名的 property (属性) 访问器方法

data class (数据类) 提供了 `equals()`, `hashCode()`, 和 `toString()` 方法的实现。

### 要求

要使用 `@JvmRecord` 注解声明 data class (数据类)，它必须满足以下要求：

* 该类必须位于以 JVM 16 字节码（如果启用了 `-Xjvm-enable-preview` 编译器选项，则为 15）为目标的模块中。
* 该类不能显式继承任何其他类（包括 `Any`），因为所有 JVM record (记录) 都隐式继承 `java.lang.Record`。但是，该类可以实现接口。
* 除了从相应的主构造函数参数初始化的那些之外，该类不能声明任何带有 backing field (幕后字段) 的 property (属性)。
* 该类不能声明任何带有 backing field (幕后字段) 的可变 property (属性)。
* 该类不能是 local (本地) 的。
* 该类的主构造函数必须与类本身一样可见。

### 启用 JVM record (记录)

JVM record (记录) 需要生成的 JVM 字节码的 `16` 目标版本或更高版本。

要显式指定它，请在 [Gradle](gradle-compiler-options#attributes-specific-to-jvm) 或 [Maven](maven#attributes-specific-to-jvm) 中使用 `jvmTarget` 编译器选项。

## 进一步讨论

有关更多技术细节和讨论，请参阅此 [JVM record (记录) 的语言提案](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records)。