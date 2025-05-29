[//]: # (title: 包和导入)

源文件可以以包声明开头：

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```

源文件的所有内容，如类和函数，都包含在此包中。因此，在上面的示例中，`printMessage()` 的完整名称是 `org.example.printMessage`，`Message` 的完整名称是 `org.example.Message`。

如果未指定包，则此类文件的内容属于没有名称的 _默认_ 包。

## 默认导入

一些包默认导入到每个 Kotlin 文件中：

- [kotlin.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/index.html)
- [kotlin.io.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/index.html)

根据目标平台，还会导入额外的包：

- JVM:
  - java.lang.*
  - [kotlin.jvm.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JS:
  - [kotlin.js.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/index.html)

## 导入

除了默认导入之外，每个文件还可以包含自己的 `import` 指令。

你可以导入单个名称：

```kotlin
import org.example.Message // Message 现在无需限定即可访问
```

或者导入某个作用域的所有可访问内容：包、类、对象等：

```kotlin
import org.example.* // 'org.example' 中的所有内容都变得可访问
```

如果存在名称冲突，你可以使用 `as` 关键字局部重命名冲突实体以消除歧义：

```kotlin
import org.example.Message // Message 可访问
import org.test.Message as TestMessage // TestMessage 代表 'org.test.Message'
```

`import` 关键字不限于导入类；你也可以用它来导入其他声明：

  * 顶层函数和属性
  * 在[对象声明](object-declarations.md#object-declarations-overview)中声明的函数和属性
  * [枚举常量](enum-classes.md)

## 顶层声明的可见性

如果一个顶层声明被标记为 `private`，则它对其声明所在的文件私有（参见[可见性修饰符](visibility-modifiers.md)）。