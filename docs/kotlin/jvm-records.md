[//]: # (title: 在 Kotlin 中使用 Java records)

_记录 (Records)_ 是 Java 中用于存储[不可变数据](https://openjdk.java.net/jeps/395)的[类](https://openjdk.java.net/jeps/395)。记录携带着一组固定的值——即_记录组件_。
它们在 Java 中拥有简洁的语法，并使你免于编写样板代码：

```java
// Java
public record Person (String name, int age) {}
```

编译器会自动生成一个继承自 [`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html) 的 final 类，包含以下成员：
*   每个记录组件的私有 final 字段
*   一个带所有字段参数的公共构造函数
*   一组实现结构相等性的方法：`equals()`、`hashCode()`、`toString()`
*   一个读取每个记录组件的公共方法

记录与 Kotlin 的[数据类](data-classes.md)非常相似。

## 在 Kotlin 代码中使用 Java records

你可以像在 Kotlin 中使用带属性的类一样，使用在 Java 中声明的带组件的记录类。
要访问记录组件，只需使用其名称，就像你访问[Kotlin 属性](properties.md)一样：

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## 在 Kotlin 中声明记录

Kotlin 仅支持为数据类声明记录，并且数据类必须满足[要求](#requirements)。

要在 Kotlin 中声明一个记录类，请使用 `@JvmRecord` 注解：

> 将 `@JvmRecord` 应用于现有类不是一个二进制兼容的更改。它会改变类属性访问器的命名约定。
>
{style="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

这个 JVM 特定注解能够生成：

*   类文件中与类属性对应的记录组件
*   根据 Java record 命名约定命名的属性访问器方法

数据类提供了 `equals()`、`hashCode()` 和 `toString()` 方法实现。

### 要求

要声明一个带有 `@JvmRecord` 注解的数据类，它必须满足以下要求：

*   该类必须位于目标为 JVM 16 字节码（如果启用了 `-Xjvm-enable-preview` 编译器选项，也可以是 15）的模块中。
*   该类不能显式继承任何其他类（包括 `Any`），因为所有 JVM records 都隐式继承 `java.lang.Record`。但是，该类可以实现接口。
*   该类不能声明任何带幕后字段的属性——除了那些从相应的主构造函数参数初始化的属性。
*   该类不能声明任何带幕后字段的可变属性。
*   该类不能是局部类。
*   该类的主构造函数必须与类本身具有相同的可见性。

### 启用 JVM records

JVM records 要求生成的 JVM 字节码目标版本为 `16` 或更高。

要显式指定它，请在 [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm) 或 [Maven](maven.md#attributes-specific-to-jvm) 中使用 `jvmTarget` 编译器选项。

## 进一步讨论

有关更多技术细节和讨论，请参阅这份[JVM records 语言提案](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md)。