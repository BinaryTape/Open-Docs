[//]: # (title: 中級：帶接收者的 Lambda 表達式)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-intermediate-extension-functions.md">擴展函數</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-intermediate-scope-functions.md">範圍函數</a><br />
        <img src="icon-3.svg" width="20" alt="第三步" /> <strong>帶接收者的 Lambda 表達式</strong><br />
        <img src="icon-4-todo.svg" width="20" alt="第四步" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">類別與介面</a><br />
        <img src="icon-5-todo.svg" width="20" alt="第五步" /> <a href="kotlin-tour-intermediate-objects.md">物件</a><br />
        <img src="icon-6-todo.svg" width="20" alt="第六步" /> <a href="kotlin-tour-intermediate-open-special-classes.md">開放類別與特殊類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="第七步" /> <a href="kotlin-tour-intermediate-properties.md">屬性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="第八步" /> <a href="kotlin-tour-intermediate-null-safety.md">空值安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="第九步" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">程式庫與 API</a></p>
</tldr>

在本章中，你將學習如何在另一種函數類型——lambda 表達式——中使用接收者，以及它們如何幫助你建立領域特定語言。

## 帶接收者的 Lambda 表達式

在初學者課程中，你學習了如何使用 [lambda 表達式](kotlin-tour-functions.md#lambda-expressions)。Lambda 表達式也可以有接收者。在這種情況下，lambda 表達式可以存取接收者的任何成員函數或屬性，而無需每次都顯式指定接收者。少了這些額外的引用，你的程式碼將更容易閱讀和維護。

> 帶接收者的 Lambda 表達式也稱為帶接收者的函數字面值。
>
{style="tip"}

當你定義函數類型時，帶接收者的 lambda 表達式的語法是不同的。首先，寫下你要擴展的接收者。接著，放一個 `.`，然後完成你函數類型的其餘定義。例如：

```kotlin
MutableList<Int>.() -> Unit
```

這個函數類型具有：

*   `MutableList<Int>` 作為接收者。
*   在圓括號 `()` 內沒有函數參數。
*   沒有返回值：`Unit`。

考慮這個在畫布上繪製形狀的範例：

```kotlin
class Canvas {
    fun drawCircle() = println("🟠 Drawing a circle")
    fun drawSquare() = println("🟥 Drawing a square")
}

// Lambda expression with receiver definition
fun render(block: Canvas.() -> Unit): Canvas {
    val canvas = Canvas()
    // Use the lambda expression with receiver
    canvas.block()
    return canvas
}

fun main() {
    render {
        drawCircle()
        // 🟠 Drawing a circle
        drawSquare()
        // 🟥 Drawing a square
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver"}

在這個範例中：

*   `Canvas` 類別有兩個函數，模擬繪製圓形或方形。
*   `render()` 函數接受一個 `block` 參數並返回 `Canvas` 類別的一個實例。
*   `block` 參數是一個帶接收者的 lambda 表達式，其中 `Canvas` 類別是接收者。
*   `render()` 函數建立 `Canvas` 類別的一個實例，並在 `canvas` 實例上呼叫 `block()` lambda 表達式，將其作為接收者。
*   `main()` 函數呼叫 `render()` 函數並帶有一個 lambda 表達式，該 lambda 表達式被傳遞給 `block` 參數。
*   在傳遞給 `render()` 函數的 lambda 內部，程式碼在 `Canvas` 類別的實例上呼叫了 `drawCircle()` 和 `drawSquare()` 函數。

    因為 `drawCircle()` 和 `drawSquare()` 函數是在帶接收者的 lambda 表達式中被呼叫的，它們可以直接被呼叫，就像它們在 `Canvas` 類別內部一樣。

帶接收者的 lambda 表達式在你想建立領域特定語言 (DSL) 時很有幫助。由於你可以存取接收者的成員函數和屬性，而無需顯式引用接收者，你的程式碼變得更精簡。

為了證明這一點，考慮一個設定選單中項目的範例。讓我們從一個 `MenuItem` 類別和一個 `Menu` 類別開始，`Menu` 類別包含一個用於向選單添加項目的 `item()` 函數，以及一個包含所有選單項目的 `items` 列表：

```kotlin
class MenuItem(val name: String)

class Menu(val name: String) {
    val items = mutableListOf<MenuItem>()

    fun item(name: String) {
        items.add(MenuItem(name))
    }
}
```

讓我們使用一個作為函數參數 (`init`) 傳遞給 `menu()` 函數的帶接收者的 lambda 表達式，該函數作為起點建構一個選單：

```kotlin
fun menu(name: String, init: Menu.() -> Unit): Menu {
    // Creates an instance of the Menu class
    val menu = Menu(name)
    // Calls the lambda expression with receiver init() on the class instance
    menu.init()
    return menu
}
```

現在你可以使用 DSL 來配置選單並建立一個 `printMenu()` 函數來將選單結構印到控制台：

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
    //   Item: Home
    //   Item: Settings
    //   Item: Exit
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver-dsl"}

如你所見，使用帶接收者的 lambda 表達式極大地簡化了建立選單所需的程式碼。Lambda 表達式不僅適用於設定和建立，也適用於配置。它們通常用於建構 API、UI 框架和配置建構器的 DSL，以產生精簡的程式碼，讓你更容易專注於底層程式碼結構和邏輯。

Kotlin 的生態系統中有很多這種設計模式的範例，例如標準程式庫中的 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 和 [`buildString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) 函數。

> 帶接收者的 Lambda 表達式可以與 Kotlin 中的 **類型安全的建造者** 結合使用，以建立在編譯時期而非執行時期偵測任何類型問題的 DSL。若要了解更多資訊，請參閱 [類型安全的建造者](type-safe-builders.md)。
>
{style="tip"}

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-1"}

你有一個 `fetchData()` 函數，它接受一個帶接收者的 lambda 表達式。更新該 lambda 表達式以使用 `append()` 函數，使你的程式碼輸出為：`Data received - Processed`。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-lambda-receivers-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-2"}

你有一個 `Button` 類別以及 `ButtonEvent` 和 `Position` 資料類別。編寫程式碼觸發 `Button` 類別的 `onEvent()` 成員函數以觸發雙擊事件。你的程式碼應該印出 `"Double click!"`。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-lambda-receivers-solution-2"}

### 練習 3 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-3"}

編寫一個函數，建立一個整數列表的副本，其中每個元素都增加 1。使用提供的函數骨架，它擴展 `List<Int>` 並包含 `incremented` 函數。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-lambda-receivers-solution-3"}

## 下一步

[中級：類別與介面](kotlin-tour-intermediate-classes-interfaces.md)