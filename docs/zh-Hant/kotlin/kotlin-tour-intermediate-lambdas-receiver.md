[//]: # (title: 進階：帶有接收者的 Lambda 表達式)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">擴充函數</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函數</a><br />
        <img src="icon-3.svg" width="20" alt="Third step" /> <strong>帶有接收者的 Lambda 表達式</strong><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">類別與介面</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">物件</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">開放類別與特殊類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">屬性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">空值安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">函式庫與 API</a></p>
</tldr>

在本章中，您將學習如何將接收者物件與另一種函數類型（Lambda 表達式）結合使用，以及它們如何幫助您建立領域特定語言 (DSL)。

## 帶有接收者的 Lambda 表達式

在初學者導覽中，您學習了如何使用 [Lambda 表達式](kotlin-tour-functions.md#lambda-expressions)。Lambda 表達式也可以帶有接收者。在這種情況下，Lambda 表達式可以存取接收者物件的任何成員函數或屬性，而無需每次都明確指定接收者物件。少了這些額外的引用，您的程式碼會更容易閱讀和維護。

> 帶有接收者的 Lambda 表達式也稱為附帶接收者的函數字面值。
>
{style="tip"}

當您定義函數類型時，帶有接收者的 Lambda 表達式語法有所不同。首先，寫下您要擴充的接收者物件。接著，放上 `.`，然後完成其餘的函數類型定義。例如：

```kotlin
MutableList<Int>.() -> Unit
```

此函數類型具有：

* `MutableList<Int)` 作為接收者類型。
* 括號 `()` 內沒有函數參數。
* 沒有回傳值：`Unit`。

考慮這個擴充 `StringBuilder` 類別的範例：

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

在此範例中：

* `StringBuilder` 類別是接收者類型。
* Lambda 表達式的函數類型沒有函數參數 `()`，也沒有回傳值 `Unit`。
* Lambda 表達式呼叫 `StringBuilder` 類別中的 `append()` 成員函數，並使用字串 `"Hello!"` 作為函數參數。
* `StringBuilder` 類別的一個實例被建立。
* 指派給 `appendText` 的 Lambda 表達式在 `stringBuilder` 實例上被呼叫。
* `stringBuilder` 實例透過 `toString()` 函數轉換為字串，並透過 `println()` 函數列印。

當您想要建立領域特定語言 (DSL) 時，帶有接收者的 Lambda 表達式會很有幫助。由於您可以存取接收者物件的成員函數和屬性，而無需明確引用接收者，因此您的程式碼變得更精簡。

為了展示這一點，考慮一個設定選單項目的範例。讓我們先從 `MenuItem` 類別和 `Menu` 類別開始，`Menu` 類別包含一個用於向選單新增項目的函數 `item()`，以及所有選單項目 `items` 的列表：

```kotlin
class MenuItem(val name: String)

class Menu(val name: String) {
    val items = mutableListOf<MenuItem>()

    fun item(name: String) {
        items.add(MenuItem(name))
    }
}
```

讓我們先使用一個帶有接收者的 Lambda 表達式，作為函數參數 (`init`) 傳遞給建構選單的 `menu()` 函數。您會注意到這段程式碼採用了與之前 `StringBuilder` 類別範例類似的方法：

```kotlin
fun menu(name: String, init: Menu.() -> Unit): Menu {
    // Creates an instance of the Menu class
    val menu = Menu(name)
    // Calls the lambda expression with receiver init() on the class instance
    menu.init()
    return menu
}
```

現在，您可以使用 DSL 來設定選單並建立一個 `printMenu()` 函數，將選單結構列印到控制台：

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

如您所見，使用帶有接收者的 Lambda 表達式極大地簡化了建立選單所需的程式碼。Lambda 表達式不僅可用於設定和建立，也可用於配置。它們通常用於為 API、UI 框架和配置建構器建構 DSL，以產生精簡的程式碼，讓您更容易專注於底層程式碼結構和邏輯。

Kotlin 的生態系統中有許多此設計模式的範例，例如標準函式庫中的 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 和 [`buildString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) 函數。

> 帶有接收者的 Lambda 表達式可以與 Kotlin 中的**類型安全建構器 (Type-safe builders)** 結合使用，以建立在編譯時而非執行時偵測類型問題的 DSL。要了解更多資訊，請參閱 [類型安全建構器](type-safe-builders.md)。
>
{style="tip"}

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-1"}

您有一個 `fetchData()` 函數，它接受一個帶有接收者的 Lambda 表達式。請更新該 Lambda 表達式以使用 `append()` 函數，使您的程式碼輸出為：`Data received - Processed`。

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

您有一個 `Button` 類別以及 `ButtonEvent` 和 `Position` 資料類別。請編寫程式碼，觸發 `Button` 類別的 `onEvent()` 成員函數以觸發雙擊事件。您的程式碼應列印 `"Double click!"`。

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

編寫一個函數，建立一個整數列表的副本，其中每個元素都遞增 1。使用提供的函數骨架，該骨架透過 `incremented` 函數擴充 `List<Int>`。

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

[進階：類別與介面](kotlin-tour-intermediate-classes-interfaces.md)