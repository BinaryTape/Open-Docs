[//]: # (title: 类型安全的构建器)

通过使用命名良好的函数作为构建器，结合[带接收者的函数字面量](lambdas.md#function-literals-with-receiver)，可以在 Kotlin 中创建类型安全的静态类型构建器。

类型安全的构建器允许创建基于 Kotlin 的领域特定语言 (DSLs)，适用于以半声明式方式构建复杂的分层数据结构。构建器的示例用例如下：

*   使用 Kotlin 代码生成标记，例如 [HTML](https://github.com/Kotlin/kotlinx.html) 或 XML
*   配置 Web 服务器的路由：[Ktor](https://ktor.io/docs/routing.html)

考虑以下代码：

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

            // an element with attributes and text content
            a(href = "https://kotlinlang.org") {+"Kotlin"}

            // mixed content
            p {
                +"This is some"
                b {+"mixed"}
                +"text. For more see the"
                a(href = "https://kotlinlang.org") {+"Kotlin"}
                +"project"
            }
            p {+"some text"}

            // content generated by
            p {
                for (arg in args)
                    +arg
            }
        }
    }
```

这完全是合法的 Kotlin 代码。
你可以在[此处在线运行此代码（在浏览器中修改并运行）](https://play.kotlinlang.org/byExample/09_Kotlin_JS/06_HtmlBuilder)。

## 工作原理

假设你需要在 Kotlin 中实现一个类型安全的构建器。
首先，定义你想要构建的模型。在这种情况下，你需要为 HTML 标签建模。
这可以通过一系列类轻松完成。
例如，`HTML` 是一个描述 `<html>` 标签的类，它定义了 `<head>` 和 `<body>` 等子元素。
（参见其声明[如下](#full-definition-of-the-com-example-html-package)。）

现在，让我们回想一下为什么你可以在代码中编写类似这样的内容：

```kotlin
html {
 // ...
}
```

`html` 实际上是一个函数调用，它接受一个 [Lambda 表达式](lambdas.md)作为参数。
这个函数定义如下：

```kotlin
fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()
    html.init()
    return html
}
```

这个函数接受一个名为 `init` 的参数，它本身是一个函数。
该函数的类型是 `HTML.() -> Unit`，这是一个*带接收者的函数类型*。
这意味着你需要将 `HTML` 类型的一个实例（一个*接收者*）传入该函数，
并且可以在函数内部调用该实例的成员。

接收者可以通过 `this` 关键字访问：

```kotlin
html {
    this.head { ... }
    this.body { ... }
}
```

（`head` 和 `body` 是 `HTML` 的成员函数。）

现在，`this` 可以像往常一样省略，你将得到一个已经非常像构建器的东西：

```kotlin
html {
    head { ... }
    body { ... }
}
```

那么，这个调用做了什么？让我们看看上面定义的 `html` 函数的函数体。
它创建一个 `HTML` 的新实例，然后通过调用作为参数传入的函数来初始化它（在此示例中，这归结为在 `HTML` 实例上调用 `head` 和 `body`），然后返回此实例。这正是构建器应该做的事情。

`HTML` 类中的 `head` 和 `body` 函数的定义与 `html` 类似。
唯一的区别是它们将构建的实例添加到封闭的 `HTML` 实例的 `children` 集合中：

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

实际上，这两个函数的作用完全相同，因此你可以有一个泛型版本，名为 `initTag`：

```kotlin
protected fun <T : Element> initTag(tag: T, init: T.() -> Unit): T {
    tag.init()
    children.add(tag)
    return tag
}
```

所以，现在你的函数非常简单：

```kotlin
fun head(init: Head.() -> Unit) = initTag(Head(), init)

fun body(init: Body.() -> Unit) = initTag(Body(), init)
```

你可以使用它们来构建 `<head>` 和 `<body>` 标签。

这里要讨论的另一件事是如何将文本添加到标签体中。在上面的例子中，你会这样写：

```kotlin
html {
    head {
        title {+"XML encoding with Kotlin"}
    }
    // ...
}
```

所以基本上，你只是将一个字符串放入标签体中，但它前面有一个小小的 `+`，
因此它是一个调用前缀 `unaryPlus()` 操作的函数调用。
该操作实际上是由 `TagWithText` 抽象类（`Title` 的父类）的成员扩展函数 `unaryPlus()` 定义的：

```kotlin
operator fun String.unaryPlus() {
    children.add(TextElement(this))
}
```

所以，这里的前缀 `+` 所做的是将字符串封装成 `TextElement` 的实例并将其添加到 `children` 集合中，
从而使其成为标签树的正确组成部分。

所有这些都定义在 `com.example.html` 包中，该包在上述构建器示例的顶部导入。
在最后一节中，你可以完整阅读此包的定义。

## 作用域控制：@DslMarker

在使用 DSL 时，可能会遇到在上下文中可以调用过多函数的问题。
你可以在 Lambda 表达式内部调用每个可用的隐式接收者的成员，从而得到不一致的结果，
例如在另一个 `head` 内部出现 `head` 标签：

```kotlin
html {
    head {
        head {} // should be forbidden
    }
    // ...
}
```

在这个例子中，只有最近的隐式接收者 `this@head` 的成员必须可用；`head()` 是外部接收者 `this@html` 的成员，所以调用它必须是非法的。

为了解决这个问题，有一个特殊的机制来控制接收者作用域。

要让编译器开始控制作用域，你只需用相同的标记注解注解 DSL 中使用的所有接收者的类型。
例如，对于 HTML 构建器，你声明一个注解 `@HTMLTagMarker`：

```kotlin
@DslMarker
annotation class HtmlTagMarker
```

如果一个注解类被 `@DslMarker` 注解，则称其为 DSL 标记。

在我们的 DSL 中，所有的标签类都继承相同的超类 `Tag`。
只需注解超类为 `@HtmlTagMarker`，之后 Kotlin 编译器就会将所有继承的类都视为已被注解：

```kotlin
@HtmlTagMarker
abstract class Tag(val name: String) { ... }
```

你不需要注解 `HTML` 或 `Head` 类为 `@HtmlTagMarker`，因为它们的超类已经注解了：

```kotlin
class HTML() : Tag("html") { ... }

class Head() : Tag("head") { ... }
```

添加此注解后，Kotlin 编译器就知道哪些隐式接收者属于同一个 DSL，并且只允许调用最近的接收者的成员：

```kotlin
html {
    head {
        head { } // error: a member of outer receiver
    }
    // ...
}
```

请注意，仍然可以调用外部接收者的成员，但为此你必须显式指定此接收者：

```kotlin
html {
    head {
        this@html.head { } // possible
    }
    // ...
}
```

你还可以将 `@DslMarker` 注解直接应用于[函数类型](lambdas.md#function-types)。
只需使用 `@Target(AnnotationTarget.TYPE)` 注解 `@DslMarker` 注解：

```kotlin
@Target(AnnotationTarget.TYPE)
@DslMarker
annotation class HtmlTagMarker
```

结果是，`@DslMarker` 注解可以应用于函数类型，最常见的是应用于带接收者的 Lambda 表达式。例如：

```kotlin
fun html(init: @HtmlTagMarker HTML.() -> Unit): HTML { ... }

fun HTML.head(init: @HtmlTagMarker Head.() -> Unit): Head { ... }

fun Head.title(init: @HtmlTagMarker Title.() -> Unit): Title { ... }
```

当你调用这些函数时，`@DslMarker` 注解会限制在用它标记的 Lambda 表达式体中对外部接收者的访问，除非你显式指定它们：

```kotlin
html {
    head {
        title {
            // Access to title, head or other functions of outer receivers is restricted here.
        }
    }
}
```

Lambda 表达式中只能访问最近接收者的成员和扩展，从而防止嵌套作用域之间发生意外的交互。

### `com.example.html` 包的完整定义

以下是 `com.example.html` 包的定义方式（仅包含上述示例中使用的元素）。
它构建了一个 HTML 树。它大量使用了[扩展函数](extensions.md)和[带接收者的 Lambda 表达式](lambdas.md#function-literals-with-receiver)。

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
```