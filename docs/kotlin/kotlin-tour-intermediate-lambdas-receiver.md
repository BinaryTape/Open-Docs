[//]: # (title: 中级: 带接收者的 Lambda 表达式)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3.svg" width="20" alt="Third step" /> <strong>带接收者的 Lambda 表达式</strong><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类与接口</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类与特殊类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">空安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库与 API</a></p>
</tldr>

本章中，你将学习如何将接收者对象与另一种函数类型——Lambda 表达式结合使用，以及它们如何帮助你创建领域特定语言。

## 带接收者的 Lambda 表达式

在初级教程中，你学习了如何使用 [Lambda 表达式](kotlin-tour-functions.md#lambda-expressions)。Lambda 表达式也可以拥有接收者。
在这种情况下，Lambda 表达式可以访问接收者对象的任何成员函数或属性，而无需每次都显式指定接收者对象。没有这些额外的引用，你的代码将更易于阅读和维护。

> 带接收者的 Lambda 表达式也称为带接收者的函数字面量。
>
{style="tip"}

定义函数类型时，带接收者的 Lambda 表达式的语法有所不同。首先，编写你想要扩展的接收者对象。接下来，加上一个 `.`，然后完成你的函数类型定义的其余部分。例如：

```kotlin
MutableList<Int>.() -> Unit
```

这种函数类型有：

* `MutableList<Int>` 作为接收者类型。
* 括号 `()` 内没有函数参数。
* 没有返回值：`Unit`。

考虑这个扩展 `StringBuilder` 类的例子：

```kotlin
fun main() {
    // Lambda expression with receiver definition
    fun StringBuilder.appendText() { append("Hello!") }

    // Use the lambda expression with receiver
    val stringBuilder = StringBuilder()
    stringBuilder.appendText()
    println(stringBuilder.toString())
    // Hello!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver"}

在此示例中：

* `StringBuilder` 类是接收者类型。
* Lambda 表达式的函数类型没有函数参数 `()` 且没有返回值 `Unit`。
* Lambda 表达式调用 `StringBuilder` 类的 `append()` 成员函数，并使用字符串 `"Hello!"` 作为函数参数。
* 创建了一个 `StringBuilder` 类的实例。
* 赋值给 `appendText` 的 Lambda 表达式在 `stringBuilder` 实例上被调用。
* `stringBuilder` 实例通过 `toString()` 函数转换为字符串，并通过 `println()` 函数打印出来。

当你想要创建领域特定语言 (DSL) 时，带接收者的 Lambda 表达式会很有帮助。由于你可以访问接收者对象的成员函数和属性，而无需显式引用接收者，因此你的代码变得更简洁。

为了演示这一点，考虑一个配置菜单项的例子。让我们从一个 `MenuItem` 类和一个 `Menu` 类开始，`Menu` 类包含一个用于向菜单添加项的函数 `item()`，以及一个包含所有菜单项的列表 `items`：

```kotlin
class MenuItem(val name: String)

class Menu(val name: String) {
    val items = mutableListOf<MenuItem>()

    fun item(name: String) {
        items.add(MenuItem(name))
    }
}
```

让我们使用一个带接收者的 Lambda 表达式作为函数参数（`init`）传递给 `menu()` 函数，以构建一个菜单作为起点。你会注意到这段代码遵循了与之前 `StringBuilder` 类示例类似的方法：

```kotlin
fun menu(name: String, init: Menu.() -> Unit): Menu {
    // Creates an instance of the Menu class
    val menu = Menu(name)
    // Calls the lambda expression with receiver init() on the class instance
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

// Use the DSL
fun main() {
    // Create the menu
    val mainMenu = menu("Main Menu") {
        // Add items to the menu
        item("Home")
        item("Settings")
        item("Exit")
    }

    // Print the menu
    printMenu(mainMenu)
    // Menu: Main Menu
    // Item: Home
    // Item: Settings
    // Item: Exit
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver-dsl"}

如你所见，使用带接收者的 Lambda 表达式极大地简化了创建菜单所需的代码。Lambda 表达式不仅适用于设置和创建，也适用于配置。它们常用于构建 API、UI 框架和配置构建器中的 DSL，以生成精简的代码，让你更容易专注于底层代码结构和逻辑。

Kotlin 的生态系统中有许多这种设计模式的例子，例如标准库中的 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 和 [`buildString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) 函数。

> 在 Kotlin 中，带接收者的 Lambda 表达式可以与**类型安全的构建器**结合使用，以创建能在编译时而非运行时检测类型问题的 DSL。要了解更多信息，请参阅 [类型安全的构建器](type-safe-builders.md)。
>
{style="tip"}

## 练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-1"}

你有一个接受带接收者的 Lambda 表达式的 `fetchData()` 函数。更新 Lambda 表达式以使用 `append()` 函数，使你的代码输出为：`Data received - Processed`。

|---|---|
```kotlin
fun fetchData(callback: StringBuilder.() -> Unit) {
    val builder = StringBuilder("Data received")
    builder.callback()
}

fun main() {
    fetchData {
        // Write your code here
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

你有一个 `Button` 类以及 `ButtonEvent` 和 `Position` 数据类。编写一些代码来触发 `Button` 类的 `onEvent()` 成员函数以触发双击事件。你的代码应该打印 `"Double click!"`。

```kotlin
class Button {
    fun onEvent(action: ButtonEvent.() -> Unit) {
        // Simulate a double-click event (not a right-click)
        val event = ButtonEvent(isRightClick = false, amount = 2, position = Position(100, 200))
        event.action() // Trigger the event callback
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
        // Write your code here
        // Double click!
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-receivers-exercise-2"}

|---|---|
```kotlin
class Button {
    fun onEvent(action: ButtonEvent.() -> Unit) {
        // Simulate a double-click event (not a right-click)
        val event = ButtonEvent(isRightClick = false, amount = 2, position = Position(100, 200))
        event.action() // Trigger the event callback
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

编写一个函数，创建整数列表的副本，其中每个元素都加 1。使用提供的函数骨架，该骨架通过 `incremented` 函数扩展 `List<Int>`。

```kotlin
fun List<Int>.incremented(): List<Int> {
    val originalList = this
    return buildList {
        // Write your code here
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

[中级：类与接口](kotlin-tour-intermediate-classes-interfaces.md)