[//]: # (title: 编写 Kotlin 代码文档：KDoc)

用于为 Kotlin 代码编写文档的语言（相当于 Java 的 Javadoc）被称为 **KDoc**。从本质上讲，KDoc 结合了 Javadoc 的块标记语法（经过扩展以支持 Kotlin 的特定结构）和 Markdown 的内联标记。

> Kotlin 的文档引擎：Dokka，能够识别 KDoc，并可用于生成各种格式的文档。
> 欲了解更多信息，请阅读我们的 [Dokka 文档](dokka-introduction.md)。
>
{style="note"}

## KDoc 语法

与 Javadoc 类似，KDoc 注释以 `/**` 开头，以 `*/` 结尾。注释的每一行都可以以星号开头，该星号不被视为注释内容的一部分。

按照约定，文档文本的第一段（到第一个空行之前的文本块）是元素的概要描述，随后的文本是详细描述。

每个块标记都从新行开始，并以 `@` 字符开头。

下面是一个使用 KDoc 编写文档的类示例：

```kotlin
/**
 * 一组 *成员*。
 *
 * 此类没有实际逻辑；它只是一个文档示例。
 *
 * @param T 此组中成员的类型。
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

### 块标记

KDoc 目前支持以下块标记：

### @param _name_

记录函数的值形参或类、属性、函数的类型形参。
为了更好地将形参名称与描述分开，如果您愿意，可以将形参名称放在方括号中。因此，以下两种语法是等效的：

```none
@param name 描述。
@param[name] 描述。
```

### @return

记录函数的返回值。

### @constructor

记录类的主构造函数。

### @receiver

记录扩展函数的接收者。

### @property _name_

记录类中具有指定名称的属性。此标记可用于记录在主构造函数中声明的属性，在主构造函数中，直接在属性定义前放置文档注释会显得很尴尬。

### @throws _class_, @exception _class_

记录方法可能抛出的异常。由于 Kotlin 没有受检异常，因此也不期望记录所有可能的异常，但当它能为类的用户提供有用信息时，您仍然可以使用此标记。

### @sample _identifier_

将具有指定限定名称的函数体嵌入到当前元素的文档中，以展示该元素的使用示例。

### @see _identifier_

在文档的 **See also** 部分添加指向指定类或方法的链接。

### @author

指定被记录元素的作者。

### @since

指定引入被记录元素的软件版本。

### @suppress

从生成的文档中排除该元素。可用于那些不属于模块官方 API 但仍必须对外可见的元素。

> KDoc 不支持 `@deprecated` 标记。请改用 [`@Deprecated`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-deprecated/) 注解。
>
{style="note"}

## 内联标记

对于内联标记，KDoc 使用常规的 [Markdown](https://daringfireball.net/projects/markdown/syntax) 语法，并经过扩展以支持链接到代码中其他元素的简写语法。

### 链接到元素

要链接到另一个元素（类、方法、属性或形参），只需将其名称放在方括号中：

```none
为此目的请使用 [foo] 方法。
```

如果您想为链接指定自定义标签，请在元素链接前的另一组方括号中添加标签：

```none
为此目的请使用 [这个方法][foo]。
```

您还可以在元素链接中使用限定名称。请注意，与 Javadoc 不同，限定名称始终使用点字符来分隔组件，即使在方法名称之前也是如此：

```none
使用 [kotlin.reflect.KClass.properties] 来枚举类的属性。
```

元素链接中的名称解析规则与该名称在被记录元素内部使用时的规则相同。特别是，这意味着如果您已将某个名称导入到当前文件中，那么在 KDoc 注释中使用它时无需使用完全限定名称。

请注意，KDoc 没有任何用于在链接中解析重载成员的语法。由于 Kotlin 的文档生成工具会将函数所有重载的文档放在同一个页面上，因此链接生效并不需要标识特定的重载函数。

### 外部链接

要添加外部链接，请使用典型的 Markdown 语法：

```none
有关 KDoc 语法的更多信息，请参阅 [KDoc](<example-URL>)。
```

## 后续步骤

了解如何使用 Kotlin 的文档生成工具：[Dokka](dokka-introduction.md)。