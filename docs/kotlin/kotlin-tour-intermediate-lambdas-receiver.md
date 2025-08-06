[//]: # (title: 进阶：带接收者的 lambda 表达式)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3.svg" width="20" alt="Third step" /> <strong>带接收者的 lambda 表达式</strong><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类与接口</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类与特殊类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">空安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库与 API</a></p>
</tldr>

在本章中，你将学习如何在另一种函数类型——lambda 表达式——中使用接收者对象，以及它们如何帮助你创建领域特定语言。

## 带接收者的 lambda 表达式

在入门教程中，你学习了如何使用 [lambda 表达式](kotlin-tour-functions.md#lambda-expressions)。Lambda 表达式也可以拥有接收者。在这种情况下，lambda 表达式可以访问接收者对象的任何成员函数或属性，而无需每次都显式指定接收者对象。没有这些额外的引用，你的代码将更易于阅读和维护。

> 带接收者的 lambda 表达式也称为函数字面量带接收者。
>
{style="tip"}

定义函数类型时，带接收者的 lambda 表达式的语法有所不同。首先，编写你想要扩展的接收者类型。接下来，放置一个 `.`，然后完成你的函数类型定义的其余部分。例如：

```kotlin
MutableList<Int>.() -> Unit
```

此函数类型有：

*   `MutableList<Int>` 作为接收者类型。
*   圆括号 `()` 内没有函数形参。
*   没有返回值：`Unit`。

考虑以下扩展 `StringBuilder` 类的示例：

```kotlin
fun main() {
    // 带接收者的 lambda 表达式定义
    fun StringBuilder.appendText() { append("Hello!") }

    // 使用带接收者的 lambda 表达式
    val stringBuilder = StringBuilder()
    stringBuilder.appendText()
    println(stringBuilder.toString())
    // Hello!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver"}

在此示例中：

*   `StringBuilder` 类是接收者类型。
*   lambda 表达式的函数类型没有函数形参 `()` 也没有返回值 `Unit`。
*   lambda 表达式调用 `StringBuilder` 类中的 `append()` 成员函数，并使用字符串 `"Hello!"` 作为函数形参。
*   创建了 `StringBuilder` 类的一个实例。
*   在 `stringBuilder` 实例上调用了赋值给 `appendText` 的 lambda 表达式。
*   `stringBuilder` 实例通过 `toString()` 函数转换为字符串，并使用 `println()` 函数打印。

当你想要创建领域特定语言（DSL）时，带接收者的 lambda 表达式会很有帮助。由于你可以访问接收者对象的成员函数和属性，而无需显式引用接收者，因此你的代码会变得更简洁。

为了演示这一点，考虑一个配置菜单项的示例。让我们从一个 `MenuItem` 类和一个 `Menu` 类开始，`Menu` 类包含一个用于向菜单添加项的 `item()` 函数，以及所有菜单项的 `items` 列表：

```kotlin
class MenuItem(val name: String)

class Menu(val name: String) {
    val items = mutableListOf<MenuItem>()

    fun item(name: String) {
        items.add(MenuItem(name))
    }
}
```

让我们使用一个带接收者的 lambda 表达式，将其作为函数形参 (`init`) 传递给 `menu()` 函数，该函数将菜单作为起点进行构建。你会注意到代码遵循了与之前 `StringBuilder` 示例类似的方法：

```kotlin
fun menu(name: String, init: Menu.() -> Unit): Menu {
    // 创建 Menu 类的实例
    val menu = Menu(name)
    // 在类实例上调用带接收者的 lambda 表达式 init()
    menu.init()
    return menu
}
```

现在你可以使用 DSL 来配置菜单，并创建一个 `printMenu()` 函数来将菜单结构打印到控制台：

```kotlin
class MenuItem(val name: String)

class Menu(val name: String) {
    val items = mutableListOf<MenuItem>()

    fun item(name: String) {
        items.add(MenuItem(name))
    }
}

fun menu(name: String, init: Menu.() -> Unit): Menu {
    val menu = Menu(name)
    menu.init()
    return menu
}

//sampleStart
fun printMenu(menu: Menu) {
    println("Menu: ${menu.name}")
    menu.items.forEach { println("  Item: ${it.name}") }
}

// 使用 DSL
fun main() {
    // 创建菜单
    val mainMenu = menu("Main Menu") {
        // 向菜单添加项
        item("Home")
        item("Settings")
        item("Exit")
    }

    // 打印菜单
    printMenu(mainMenu)
    // Menu: Main Menu
    // Item: Home
    // Item: Settings
    // Item: Exit
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver-dsl"}

如你所见，使用带接收者的 lambda 表达式极大地简化了创建菜单所需的代码。Lambda 表达式不仅对设置和创建有用，也对配置有用。它们常用于构建 API、UI 框架和配置构建器的 DSL，以生成精简的代码，让你更容易专注于底层代码结构和逻辑。

Kotlin 的生态系统中有许多此设计模式的示例，例如标准库中的 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 和 [`buildString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) 函数。

> 带接收者的 lambda 表达式可以与 Kotlin 中的**类型安全的构建器**结合使用，以创建可以在编译期而非运行时检测类型问题的 DSL。关于更多信息，请参见 [类型安全的构建器](type-safe-builders.md)。
>
{style="tip"}

## 练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-1"}

你有一个 `fetchData()` 函数，它接受一个带接收者的 lambda 表达式。更新 lambda 表达式以使用 `append()` 函数，使你的代码输出为：`Data received - Processed`。

|---|---|
```kotlin
fun fetchData(callback: StringBuilder.() -> Unit) {
    val builder = StringBuilder("Data received")
    builder.callback()
}

fun main() {
    fetchData {
        // 在此处编写你的代码
        // Data received - Processed
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-receivers-exercise-1"}

|---|---|
```kotlin
fun fetchData(callback: StringBuilder.() -> Unit) {
    val builder = StringBuilder("Data received")
    builder.callback()
}

fun main() {
    fetchData {
        append(" - Processed")
        println(this.toString())
        // Data received - Processed
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-lambda-receivers-solution-1"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-2"}

你有一个 `Button` 类以及 `ButtonEvent` 和 `Position` 数据类。编写一些代码，触发 `Button` 类的 `onEvent()` 成员函数，以触发双击事件。你的代码应打印 `"Double click!"`。

```kotlin
class Button {
    fun onEvent(action: ButtonEvent.() -> Unit) {
        // 模拟双击事件（非右击）
        val event = ButtonEvent(isRightClick = false, amount = 2, position = Position(100, 200))
        event.action() // 触发事件回调
    }
}

data class ButtonEvent(
    val isRightClick: Boolean,
    val amount: Int,
    val position: Position
)

data class Position(
    val x: Int,
    val y: Int
)

fun main() {
    val button = Button()

    button.onEvent {
        // 在此处编写你的代码
        // Double click!
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-receivers-exercise-2"}

|---|---|
```kotlin
class Button {
    fun onEvent(action: ButtonEvent.() -> Unit) {
        // 模拟双击事件（非右击）
        val event = ButtonEvent(isRightClick = false, amount = 2, position = Position(100, 200))
        event.action() // 触发事件回调
    }
}

data class ButtonEvent(
    val isRightClick: Boolean,
    val amount: Int,
    val position: Position
)

data class Position(
    val x: Int,
    val y: Int
)

fun main() {
    val button = Button()
    
    button.onEvent {
        if (!isRightClick && amount == 2) {
            println("Double click!")
            // Double click!
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-lambda-receivers-solution-2"}

### 练习 3 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-3"}

编写一个函数，创建 `list` 整数的副本，其中每个元素递增 1。使用提供的扩展 `List<Int>` 的 `incremented` 函数骨架。

```kotlin
fun List<Int>.incremented(): List<Int> {
    val originalList = this
    return buildList {
        // 在此处编写你的代码
    }
}

fun main() {
    val originalList = listOf(1, 2, 3)
    val newList = originalList.incremented()
    println(newList)
    // [2, 3, 4]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-receivers-exercise-3"}

|---|---|
```kotlin
fun List<Int>.incremented(): List<Int> {
    val originalList = this
    return buildList {
        for (n in originalList) add(n + 1)
    }
}

fun main() {
    val originalList = listOf(1, 2, 3)
    val newList = originalList.incremented()
    println(newList)
    // [2, 3, 4]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-lambda-receivers-solution-3"}

## 下一步

[进阶：类与接口](kotlin-tour-intermediate-classes-interfaces.md)