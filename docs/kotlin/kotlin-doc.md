[//]: # (title: 文档化 Kotlin 代码: KDoc)

用于文档化 Kotlin 代码的语言（相当于 Java 的 Javadoc）被称为 **KDoc**。本质上，KDoc 结合了 Javadoc 用于块标签的语法（已扩展以支持 Kotlin 的特定构造）和 Markdown 用于内联标记。

> Kotlin 的文档引擎 Dokka 理解 KDoc，并可用于生成各种格式的文档。
> 欲了解更多信息，请阅读我们的 [Dokka 文档](dokka-introduction.md)。
>
{style="note"}

## KDoc 语法

与 Javadoc 类似，KDoc 注释以 `/**` 开头，以 `*/` 结尾。注释的每一行都可以以星号开头，星号不被视为注释内容的一部分。

按照惯例，文档文本的第一段（直到第一个空行为止的文本块）是元素的摘要描述，后续文本是详细描述。

每个块标签都另起一行，并以 `@` 字符开头。

以下是使用 KDoc 文档化的类示例：

```kotlin
/**
 * A group of *members*.
 *
 * This class has no useful logic; it's just a documentation example.
 *
 * @param T the type of a member in this group.
 * @property name the name of this group.
 * @constructor Creates an empty group.
 */
class Group<T>(val name: String) {
    /**
     * Adds a [member] to this group.
     * @return the new size of the group.
     */
    fun add(member: T): Int { ... }
}
```

### 块标签

KDoc 目前支持以下块标签：

### @param _name_

文档化函数的值参数，或类、属性或函数的类型参数。
为了更好地将参数名称与描述分离，如果愿意，可以将参数名称括在方括号中。因此，以下两种语法是等效的：

```none
@param name description.
@param[name] description.
```

### @return

文档化函数的返回值。

### @constructor

文档化类的主构造函数。

### @receiver

文档化扩展函数的接收者。

### @property _name_

文档化具有指定名称的类属性。此标签可用于文档化在主构造函数中声明的属性，因为直接将文档注释放在属性定义之前会显得笨拙。

### @throws _class_, @exception _class_

文档化方法可能抛出的异常。由于 Kotlin 没有受检查异常，因此也不期望所有可能的异常都得到文档化，但当它能为类的用户提供有用信息时，您仍然可以使用此标签。

### @sample _identifier_

将具有指定限定名称的函数体嵌入到当前元素的文档中，以展示该元素如何被使用。

### @see _identifier_

向文档的 **另请参阅** 块添加指向指定类或方法的链接。

### @author

指定被文档化元素的作者。

### @since

指定引入被文档化元素的软件版本。

### @suppress

将元素从生成的文档中排除。可用于那些不属于模块官方 API 但仍需外部可见的元素。

> KDoc 不支持 `@deprecated` 标签。请改用 [`@Deprecated`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-deprecated/) 注解。
>
{style="note"}

## 内联标记

对于内联标记，KDoc 使用常规的 [Markdown](https://daringfireball.net/projects/markdown/syntax) 语法，并扩展以支持链接到代码中其他元素的简写语法。

### 元素链接

要链接到另一个元素（类、方法、属性或参数），只需将其名称放在方括号中即可：

```none
Use the method [foo] for this purpose.
```

如果您想为链接指定自定义标签，请在元素链接之前再加一组方括号：

```none
Use [this method][foo] for this purpose.
```

您还可以在元素链接中使用限定名称。请注意，与 Javadoc 不同，限定名称总是使用点字符来分隔组件，即使是在方法名称之前也是如此：

```none
Use [kotlin.reflect.KClass.properties] to enumerate the properties of the class.
```

元素链接中的名称解析规则与名称在被文档化元素内部使用时的规则相同。特别是，这意味着如果您已将某个名称导入到当前文件，则在 KDoc 注释中使用它时，无需完全限定它。

请注意，KDoc 没有用于解析链接中重载成员的任何语法。由于 Kotlin 的文档生成工具将函数所有重载的文档放在同一页面上，因此链接的正常工作不需要识别特定的重载函数。

### 外部链接

要添加外部链接，请使用典型的 Markdown 语法：

```none
For more information about KDoc syntax, see [KDoc](<example-URL>).
```

## 下一步？

了解如何使用 Kotlin 的文档生成工具：[Dokka](dokka-introduction.md)。