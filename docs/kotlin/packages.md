---
title: 包和导入
---
一个源文件可以以包声明开始：

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```

源文件的所有内容，例如类和函数，都包含在这个包中。
因此，在上面的示例中，`printMessage()` 的完整名称是 `org.example.printMessage`，
`Message` 的完整名称是 `org.example.Message`。

如果未指定包，则此类文件的内容属于没有名称的 _default_（默认）包。

## Default imports（默认导入）

默认情况下，许多包会被导入到每个 Kotlin 文件中：

- [kotlin.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/index.html)
- [kotlin.io.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/index.html)

根据目标平台，还会导入其他包：

- JVM:
  - java.lang.*
  - [kotlin.jvm.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JS:    
  - [kotlin.js.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/index.html)

## Imports（导入）

除了默认导入外，每个文件都可以包含自己的 `import` 指令。

您可以导入单个名称：

```kotlin
import org.example.Message // 现在可以不加限定词访问 Message
```

或者导入作用域（包、类、对象等）的所有可访问内容：

```kotlin
import org.example.* // 'org.example' 中的所有内容都变为可访问
```

如果存在名称冲突，您可以使用 `as` 关键字来本地重命名冲突的实体，以消除歧义：

```kotlin
import org.example.Message // Message 可访问
import org.test.Message as TestMessage // TestMessage 代表 'org.test.Message'
```

`import` 关键字不限于导入类；您还可以使用它来导入其他声明：

  * 顶层函数和属性
  * 在 [对象声明](object-declarations#object-declarations-overview) 中声明的函数和属性
  * [枚举常量](enum-classes)

## Visibility of top-level declarations（顶层声明的可见性）

如果顶层声明被标记为 `private`，则它对于声明它的文件是私有的（请参阅 [可见性修饰符](visibility-modifiers)）。