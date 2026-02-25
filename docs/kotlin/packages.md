[//]: # (title: 软件包与导入)

源文件可以以软件包声明开头：

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```

源文件的所有内容（例如类和函数）都包含在该软件包中。
因此，在上面的示例中，`printMessage()` 的完整名称是 `org.example.printMessage`，
而 `Message` 的完整名称是 `org.example.Message`。 

如果未指定软件包，则该文件的内容属于没有名称的“默认”软件包。

## 默认导入

默认情况下，每个 Kotlin 文件都会导入许多软件包：

- [kotlin.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/index.html)
- [kotlin.io.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/index.html)

根据目标平台的不同，还会导入其他软件包：

- JVM:
  - java.lang.*
  - [kotlin.jvm.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JS:    
  - [kotlin.js.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/index.html)

## 导入

除了默认导入之外，每个文件还可以包含自己的 `import` 指令。

您可以导入单个名称：

```kotlin
import org.example.Message // 现在可以直接访问 Message 而无需限定符
```

或者作用域（软件包、类、对象等）中所有可访问的内容：

```kotlin
import org.example.* // 'org.example' 中的所有内容都变得可访问
```

如果存在名称冲突，您可以使用 `as` 关键字对冲突的实体进行本地重命名，以消除歧义：

```kotlin
import org.example.Message // Message 可访问
import org.test.Message as TestMessage // TestMessage 代表 'org.test.Message'
```

`import` 关键字不仅限于导入类；您还可以使用它来导入其他声明：

  * 顶层函数和属性
  * 在[对象声明](object-declarations.md#object-declarations-overview)中声明的函数和属性
  * [枚举常量](enum-classes.md)

## 顶层声明的可见性

如果顶层声明被标记为 `private`，则它对其所在的文件是私有的（参见[可见性修饰符](visibility-modifiers.md)）。