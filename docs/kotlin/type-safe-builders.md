[//]: # (title: 类型安全的构建器)

通过使用命名良好的函数作为**构建器**，并结合[**带有接收者**的**函数字面量**](lambdas.md#function-literals-with-receiver)，可以在 Kotlin 中创建**类型安全的**、**静态类型**的**构建器**。

**类型安全的构建器**允许创建基于 Kotlin 的**领域特定语言 (DSL)**，适用于以半声明式的方式构建复杂的**分层数据结构**。**构建器**的典型用例包括：

*   使用 Kotlin 代码生成标记，例如 [HTML](https://github.com/Kotlin/kotlinx.html) 或 XML
*   为 Web 服务器配置路由：[Ktor](https://ktor.io/docs/routing.html)

请看以下代码：

```kotlin
import com.example.html.* // see declarations below

fun result() =
    html {
        head {
            title {+"XML encoding with Kotlin"}
        }
        body {
            h1 {+"XML encoding with Kotlin"}
            p  {+"this format can be used as an alternative markup to XML"}

            // 一个带有属性和文本内容的元素
            a(href = "https://kotlinlang.org") {+"Kotlin"}

            // 混合内容
            p {
                +"This is some"
                b {+"mixed"}
                +"text. For more see the"
                a(href = "https://kotlinlang.org") {+"Kotlin"}
                +"project"
            }
            p {+"some text"}

            // 由此生成的内容
            p {
                for (arg in args)
                    +arg
            }
        }
    }
```

这是完全合法的 Kotlin 代码。
你可以在[此在线试用这段代码（可在浏览器中修改并运行）](https://play.kotlinlang.org/byExample/09_Kotlin_JS/06_HtmlBuilder)。

## 工作原理

假设你需要在 Kotlin 中实现一个**类型安全的构建器**。
首先，**定义**你想要**构建**的模型。在这种情况下，你需要为 HTML 标签建模。
这可以通过一系列类轻松完成。
**例如**，`HTML` 是一个描述 `<html>` 标签的类，它**定义**了 `<head>` 和 `<body>` 等子元素。
（关于它的**声明**，请参见[下文](#full-definition-of-the-com-example-html-package)。）

现在，让我们回顾一下为什么你可以在代码中这样写：

```kotlin
html {
 // ...
}
```

`html` 实际上是一个**函数调用**，它将一个 [**lambda 表达式**](lambdas.md) 作为**实参**。
这个**函数**的**定义**如下：

```kotlin
fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()
    html.init()
    return html
}
```

这个**函数**接受一个名为 `init` 的**形参**，它本身是一个**函数**。
这个**函数**的类型是 `HTML.() -> Unit`，这是一个**带有接收者**的**函数**类型。
这意味着你需要将 `HTML` 类型的一个**实例**（一个**接收者**）传递给该**函数**，并且你可以在该**函数**内部**调用**该**实例**的成员。

**接收者**可以通过 `this` 关键字访问：

```kotlin
html {
    this.head { ... }
    this.body { ... }
}
```

（`head` 和 `body` 是 `HTML` 的成员**函数**。）

现在，`this` 可以像往常一样省略，你会得到一个看起来很像**构建器**的东西：

```kotlin
html {
    head { ... }
    body { ... }
}
```

那么，这个**调用**做了什么？让我们看看上面**定义**的 `html` **函数体**。
它创建了一个新的 `HTML` **实例**，然后通过**调用**作为**实参**传递的**函数**来初始化它（在这个**示例**中，这归结为在 `HTML` **实例**上**调用** `head` 和 `body`），然后返回这个**实例**。
这正是**构建器**应该做的。

`HTML` 类中的 `head` 和 `body` **函数**的**定义**与 `html` 类似。
唯一的区别是它们将**构建**的**实例**添加到封闭 `HTML` **实例**的 `children` **集合**中：

```kotlin
fun head(init: Head.() -> Unit): Head {
    val head = Head()
    head.init()
    children.add(head)
    return head
}

fun body(init: Body.() -> Unit): Body {
    val body = Body()
    body.init()
    children.add(body)
    return body
}
```

实际上，这两个**函数**做的是同样的事情，所以你可以有一个泛型版本，`initTag`：

```kotlin
protected fun <T : Element> initTag(tag: T, init: T.() -> Unit): T {
    tag.init()
    children.add(tag)
    return tag
}
```

这样，你的**函数**现在就变得非常简单了：

```kotlin
fun head(init: Head.() -> Unit) = initTag(Head(), init)

fun body(init: Body.() -> Unit) = initTag(Body(), init)
```

你可以使用它们来**构建** `<head>` 和 `<body>` 标签。

这里要**讨论**的另一件事是如何将文本添加到标签主体。在上面的**示例**中，你这样写道：

```kotlin
html {
    head {
        title {+"XML encoding with Kotlin"}
    }
    // ...
}
```

所以基本上，你只是将一个字符串放入标签主体，但在它前面有一个小小的 `+`，因此它是一个**函数调用**，**调用**一个前缀 `unaryPlus()` **操作符**。
该**操作符**实际上由**扩展函数** `unaryPlus()` **定义**，它是 `TagWithText` 抽象类（`Title` 的父类）的一个成员：

```kotlin
operator fun String.unaryPlus() {
    children.add(TextElement(this))
}
```

因此，这里的前缀 `+` 的作用是将一个字符串包装到 `TextElement` 的一个**实例**中，并将其添加到 `children` **集合**中，使其成为标签树的合适的部分。

所有这些都**定义**在 `com.example.html` 包中，该包在上述**构建器示例**的顶部**导入**。
在最后一节中，你可以**参阅**这个包的完整**定义**。

## **作用域**控制：@DslMarker

在使用 DSL 时，可能会遇到在**上下文**中可以**调用**过多**函数**的问题。
你可以在 **lambda 表达式**内部**调用**每个可用的**隐式接收者**的方法，从而得到不一致的结果，例如在另一个 `head` 标签内部的 `head` 标签：

```kotlin
html {
    head {
        head {} // 应该禁止
    }
    // ...
}
```

在此**示例**中，只有最近的**隐式接收者** `this@head` 的成员必须是可用的；`head()` 是外部**接收者** `this@html` 的成员，因此**调用**它必须是非法的。

为了**解决**这个问题，有一个特殊机制来**控制接收者作用域**。

要让**编译器**开始**控制作用域**，你只需用相同的**标记注解**注解 DSL 中使用的所有**接收者**的类型。
**例如**，对于 HTML **构建器**，你**声明**一个注解 `@HTMLTagMarker`：

```kotlin
@DslMarker
annotation class HtmlTagMarker
```

如果一个注解类被 `@DslMarker` 注解，则它被称为 DSL 标记。

在我们的 DSL 中，所有标签类都**扩展**了相同的超类 `Tag`。
只需用 `@HtmlTagMarker` 注解超类就足够了，之后 Kotlin **编译器**会将所有**继承**的类都视为已注解：

```kotlin
@HtmlTagMarker
abstract class Tag(val name: String) { ... }
```

你不必用 `@HtmlTagMarker` 注解 `HTML` 或 `Head` 类，因为它们的超类已经注解过了：

```kotlin
class HTML() : Tag("html") { ... }

class Head() : Tag("head") { ... }
```

添加此注解后，Kotlin **编译器**会知道哪些**隐式接收者**属于同一个 DSL，并且只允许**调用**最近**接收者**的成员：

```kotlin
html {
    head {
        head { } // 错误：外部接收者的成员
    }
    // ...
}
```

请注意，仍然可以**调用**外部**接收者**的成员，但要这样做，你必须**显式指定**该**接收者**：

```kotlin
html {
    head {
        this@html.head { } // 可能
    }
    // ...
}
```

你还可以将 `@DslMarker` 注解直接应用于 [**函数**类型](lambdas.md#function-types)。
只需用 `@Target(AnnotationTarget.TYPE)` 注解 `@DslMarker` 注解即可：

```kotlin
@Target(AnnotationTarget.TYPE)
@DslMarker
annotation class HtmlTagMarker
```

因此，`@DslMarker` 注解可以应用于**函数**类型，最常见的是应用于**带有接收者**的 **lambda 表达式**。**例如**：

```kotlin
fun html(init: @HtmlTagMarker HTML.() -> Unit): HTML { ... }

fun HTML.head(init: @HtmlTagMarker Head.() -> Unit): Head { ... }

fun Head.title(init: @HtmlTagMarker Title.() -> Unit): Title { ... }
```

当你**调用**这些**函数**时，`@DslMarker` 注解会**限制**对被其标记的 **lambda 表达式****函数体**中外部**接收者**的访问，除非你**显式指定**它们：

```kotlin
html {
    head {
        title {
            // 在此处限制访问 title、head 或其他外部接收者的函数。
        }
    }
}
```

在 **lambda 表达式**内部，只有最近**接收者**的成员和**扩展**是可访问的，从而防止**嵌套作用域**之间产生意外**交互**。

当**隐式接收者**的成员和来自 [**上下文形参**](context-parameters.md) 的**声明**在同一**作用域**中具有相同名称时，**编译器**会报告警告，因为**隐式接收者**被**上下文形参**遮蔽。
为了**解决**这个问题，可以使用 `this` **限定符**来**显式****调用****接收者**，或者使用 `contextOf<T>()` 来**调用****上下文声明**：

```kotlin
interface HtmlTag {
    fun setAttribute(name: String, value: String)
}

// 声明一个同名的**顶层**函数，
// 该函数通过**上下文形参**可用
context(tag: HtmlTag)
fun setAttribute(name: String, value: String) { tag.setAttribute(name, value) }

fun test(head: HtmlTag, extraInfo: HtmlTag) {
    with(head) {
        // 在内部**作用域**中引入一个相同类型的**上下文**值
        context(extraInfo) {
            // 报告警告：
            // 使用被**上下文形参**遮蔽的**隐式接收者**
            setAttribute("user", "1234")

            // **显式调用****接收者**的成员
            this.setAttribute("user", "1234")

            // **显式调用****上下文声明**
            contextOf<HtmlTag>().setAttribute("user", "1234")
        }
    }
}
```

### `com.example.html` 包的完整**定义**

这是 `com.example.html` 包的**定义**方式（仅包含上述**示例**中使用的元素）。
它**构建**了一个 HTML 树。它大量使用了 [**扩展函数**](extensions.md) 和
[**带有接收者**的 **lambda 表达式**](lambdas.md#function-literals-with-receiver)。

```kotlin
package com.example.html

interface Element {
    fun render(builder: StringBuilder, indent: String)
}

class TextElement(val text: String) : Element {
    override fun render(builder: StringBuilder, indent: String) {
        builder.append("$indent$text
")
    }
}

@DslMarker
annotation class HtmlTagMarker

@HtmlTagMarker
abstract class Tag(val name: String) : Element {
    val children = arrayListOf<Element>()
    val attributes = hashMapOf<String, String>()

    protected fun <T : Element> initTag(tag: T, init: T.() -> Unit): T {
        tag.init()
        children.add(tag)
        return tag
    }

    override fun render(builder: StringBuilder, indent: String) {
        builder.append("$indent<$name${renderAttributes()}>
")
        for (c in children) {
            c.render(builder, indent + "  ")
        }
        builder.append("$indent</$name>
")
    }

    private fun renderAttributes(): String {
        val builder = StringBuilder()
        for ((attr, value) in attributes) {
            builder.append(" $attr=\"$value\"")
        }
        return builder.toString()
    }

    override fun toString(): String {
        val builder = StringBuilder()
        render(builder, "")
        return builder.toString()
    }
}

abstract class TagWithText(name: String) : Tag(name) {
    operator fun String.unaryPlus() {
        children.add(TextElement(this))
    }
}

class HTML : TagWithText("html") {
    fun head(init: Head.() -> Unit) = initTag(Head(), init)

    fun body(init: Body.() -> Unit) = initTag(Body(), init)
}

class Head : TagWithText("head") {
    fun title(init: Title.() -> Unit) = initTag(Title(), init)
}

class Title : TagWithText("title")

abstract class BodyTag(name: String) : TagWithText(name) {
    fun b(init: B.() -> Unit) = initTag(B(), init)
    fun p(init: P.() -> Unit) = initTag(P(), init)
    fun h1(init: H1.() -> Unit) = initTag(H1(), init)
    fun a(href: String, init: A.() -> Unit) {
        val a = initTag(A(), init)
        a.href = href
    }
}

class Body : BodyTag("body")
class B : BodyTag("b")
class P : BodyTag("p")
class H1 : BodyTag("h1")

class A : BodyTag("a") {
    var href: String
        get() = attributes["href"]!!
        set(value) {
            attributes["href"] = value
        }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()
    html.init()
    return html
}