---
title: "Kotlin 代码文档：KDoc"
---
用来记录 Kotlin 代码的语言（相当于 Java 的 Javadoc）被称为 **KDoc**。本质上，KDoc 结合了 Javadoc 的块标签（block tags）语法（扩展后支持 Kotlin 的特定结构）和 Markdown 的内联标记（inline markup）。

:::note
Kotlin 的文档引擎：Dokka，可以理解 KDoc，并可用于生成各种格式的文档。更多信息，请阅读我们的 [Dokka 文档](dokka-introduction)。

:::

## KDoc 语法

就像 Javadoc 一样，KDoc 注释以 `/**` 开头，以 `*/` 结尾。注释的每一行都可以以星号开头，星号不被视为注释内容的一部分。

按照惯例，文档文本的第一段（直到第一个空行为止的文本块）是元素的摘要描述，后面的文本是详细描述。

每个块标签（block tag）都从新的一行开始，并以 `@` 字符开头。

这是一个使用 KDoc 记录的类的示例：

```kotlin
/**
 * *成员* 的一个组。
 *
 * 这个类没有有用的逻辑；它只是一个文档示例。
 *
 * @param T 这个组中成员的类型。
 * @property name 这个组的名称。
 * @constructor 创建一个空组。
 */
class Group<T>(val name: String) {
    /**
     * 向这个组添加一个 [member]。
     * @return 这个组的新大小。
     */
    fun add(member: T): Int { ... }
}
```

### 块标签（Block tags）

KDoc 目前支持以下块标签：

### @param _name_

记录函数的值参数或类、属性或函数的类型参数。
为了更好地区分参数名称和描述，如果愿意，可以将参数名称放在方括号中。因此，以下两种语法是等效的：

```none
@param name description.
@param[name] description.
```

### @return

记录函数的返回值。

### @constructor

记录类的主构造函数。

### @receiver

记录扩展函数的接收者（receiver）。

### @property _name_

记录具有指定名称的类的属性。此标签可用于记录在主构造函数中声明的属性，在这种情况下，直接在属性定义之前放置文档注释会很麻烦。

### @throws _class_, @exception _class_

记录方法可能抛出的异常。由于 Kotlin 没有受检异常（checked exceptions），因此也不期望记录所有可能的异常，但是当它为类的用户提供有用的信息时，仍然可以使用此标签。

### @sample _identifier_

将具有指定限定名称的函数体嵌入到当前元素的文档中，以显示如何使用该元素的示例。

### @see _identifier_

将指向指定类或方法的链接添加到文档的 **See also** 块中。

### @author

指定被记录元素的作者。

### @since

指定引入被记录元素的软件版本。

### @suppress

从生成的文档中排除该元素。可用于不是模块官方 API 的一部分但仍必须在外部可见的元素。

:::note
KDoc 不支持 `@deprecated` 标签。请使用 [`@Deprecated`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-deprecated/) 注解代替。

:::

## 内联标记（Inline markup）

对于内联标记，KDoc 使用常规的 [Markdown](https://daringfireball.net/projects/markdown/syntax) 语法，并进行了扩展，以支持用于链接到代码中其他元素的简写语法。

### 链接到元素

要链接到另一个元素（类、方法、属性或参数），只需将其名称放在方括号中：

```none
Use the method [foo] for this purpose.
```

如果要为链接指定自定义标签，请在元素链接前添加另一组方括号：

```none
Use [this method][foo] for this purpose.
```

您也可以在元素链接中使用限定名称。请注意，与 Javadoc 不同，限定名称始终使用点字符来分隔组件，即使在方法名称之前也是如此：

```none
Use [kotlin.reflect.KClass.properties] to enumerate the properties of the class.
```

元素链接中的名称解析使用与在被记录元素内部使用名称时相同的规则。特别是，这意味着如果已将名称导入到当前文件中，则在 KDoc 注释中使用它时，无需完全限定它。

请注意，KDoc 没有任何用于解析链接中重载成员的语法。由于 Kotlin 的文档生成工具将函数的所有重载的文档放在同一页面上，因此不需要标识特定的重载函数即可使链接起作用。

### 外部链接

要添加外部链接，请使用典型的 Markdown 语法：

```none
For more information about KDoc syntax, see [KDoc](<example-URL>).
```

## 接下来做什么？

学习如何使用 Kotlin 的文档生成工具：[Dokka](dokka-introduction)。