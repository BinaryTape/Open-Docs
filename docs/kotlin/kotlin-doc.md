[//]: # (title: 文档化 Kotlin 代码：KDoc)

用于文档化 Kotlin 代码的语言（等同于 Java 的 Javadoc）称为 **KDoc**。本质上，KDoc 结合了 Javadoc 用于块标签的语法（已扩展以支持 Kotlin 的特定构造）和 Markdown 用于内联标记。

> Kotlin 的文档引擎 Dokka 能够理解 KDoc，并可用于生成各种格式的文档。
> 更多信息，请参阅我们的 [Dokka 文档](dokka-introduction.md)。
>
{style="note"}

## KDoc 语法

与 Javadoc 一样，KDoc 注释以 `/**` 开头，以 `*/` 结尾。注释的每一行可以星号开头，星号不被视为注释内容的一部分。

按照惯例，文档文本的第一个段落（从文本开头到第一个空行之间的文本块）是元素的摘要描述，后续文本是详细描述。

每个块标签都在新行开始，并以 `@` 字符开头。

以下是一个使用 KDoc 文档化的类示例：

```kotlin
/**
 * 一组 *成员*。
 *
 * 这个类没有实际的逻辑；它只是一个文档示例。
 *
 * @param T 组中成员的类型。
 * @property name 此组的名称。
 * @constructor 创建一个空组。
 */
class Group<T>(val name: String) {
    /**
     * 向此组添加一个 [member]。
     * @return 组的新大小。
     */
    fun add(member: T): Int { ... }
}
```

### 块标签

KDoc 当前支持以下块标签：

### @param _name_

文档化函数的实参或类、属性或函数的类型形参。为了更好地将形参名与描述分离，如果您愿意，可以将形参名用方括号括起来。因此，以下两种语法是等效的：

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

文档化具有指定名称的类的属性。此标签可用于文档化在主构造函数中声明的属性，因为直接将文档注释放在属性定义之前会显得不自然。

### @throws _class_, @exception _class_

文档化方法可能抛出的异常。由于 Kotlin 没有检查型异常，因此不要求文档化所有可能抛出的异常，但当它能为类的使用者提供有用信息时，您仍然可以使用此标签。

### @sample _identifier_

将具有指定限定名称的函数的函数体嵌入当前元素的文档中，以展示如何使用该元素的示例。

### @see _identifier_

向文档的 **另请参见** 块添加指向指定类或方法的链接。

### @author

指定被文档化元素的作者。

### @since

指定引入被文档化元素的软件版本。

### @suppress

将元素从生成的文档中排除。可用于不属于模块官方 API 的一部分但仍需在外部可见的元素。

> KDoc 不支持 `@deprecated` 标签。请改用 [`@Deprecated`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-deprecated/) 注解。
>
{style="note"}

## 内联标记

对于内联标记，KDoc 使用常规的 [Markdown](https://daringfireball.net/projects/markdown/syntax) 语法，并扩展以支持链接到代码中其他元素的简写语法。

### 元素链接

要链接到另一个元素（类、方法、属性或形参），只需将其名称放在方括号中：

```none
Use the method [foo] for this purpose.
```

如果您想为链接指定自定义标签，请在元素链接之前将其添加在另一对方括号中：

```none
Use [this method][foo] for this purpose.
```

您也可以在元素链接中使用限定名称。请注意，与 Javadoc 不同的是，限定名称始终使用点字符分隔组件，即使在方法名称之前也是如此：

```none
Use [kotlin.reflect.KClass.properties] to enumerate the properties of the class.
```

元素链接中的名称使用与在被文档化元素内部使用名称相同的规则解析。特别地，这意味着如果您已将某个名称导入当前文件，则在使用 KDoc 注释时无需完全限定它。

请注意，KDoc 没有任何用于解析链接中重载成员的语法。由于 Kotlin 的文档生成工具将一个函数所有重载的文档放在同一页面，因此识别特定的重载函数对于链接起作用不是必需的。

### 外部链接

要添加外部链接，请使用典型的 Markdown 语法：

```none
For more information about KDoc syntax, see [KDoc](<example-URL>).
```

## 接下来是什么？

学习如何使用 Kotlin 的文档生成工具：[Dokka](dokka-introduction.md)。