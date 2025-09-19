[//]: # (title: 中級: レシーバー付きラムダ式)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ" /> <a href="kotlin-tour-intermediate-extension-functions.md">拡張関数</a><br />
        <img src="icon-2-done.svg" width="20" alt="2番目のステップ" /> <a href="kotlin-tour-intermediate-scope-functions.md">スコープ関数</a><br />
        <img src="icon-3.svg" width="20" alt="3番目のステップ" /> <strong>レシーバー付きラムダ式</strong><br />
        <img src="icon-4-todo.svg" width="20" alt="4番目のステップ" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">クラスとインターフェース</a><br />
        <img src="icon-5-todo.svg" width="20" alt="5番目のステップ" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6-todo.svg" width="20" alt="6番目のステップ" /> <a href="kotlin-tour-intermediate-open-special-classes.md">オープンクラスと特殊なクラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="7番目のステップ" /> <a href="kotlin-tour-intermediate-properties.md">プロパティ</a><br />
        <img src="icon-8-todo.svg" width="20" alt="8番目のステップ" /> <a href="kotlin-tour-intermediate-null-safety.md">null安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="9番目のステップ" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリとAPI</a></p>
</tldr>

この章では、別の種類の関数であるラムダ式でレシーバーを使用する方法と、それがドメイン固有言語を作成するのにどのように役立つかを学習します。

## レシーバー付きラムダ式

入門編では、[ラムダ式](kotlin-tour-functions.md#lambda-expressions)の使用方法を学習しました。ラムダ式もレシーバーを持つことができます。
この場合、ラムダ式は、レシーバーを毎回明示的に指定することなく、レシーバーのメンバー関数やプロパティにアクセスできます。これらの余分な参照がないため、コードは読みやすく、保守しやすくなります。

> レシーバー付きラムダ式は、レシーバー付き関数リテラルとも呼ばれます。
>
{style="tip"}

レシーバー付きラムダ式の構文は、関数型を定義するときに異なります。まず、拡張したいレシーバーを記述します。次に、` . `を記述し、残りの関数型の定義を完了します。例:

```kotlin
MutableList<Int>.() -> Unit
```

この関数型は次の要素を持ちます。

*   `MutableList<Int>` をレシーバー型とする。
*   括弧 `()` 内に関数パラメータがない。
*   戻り値がない: `Unit`。

キャンバスに図形を描画するこの例を考えてみましょう。

```kotlin
class Canvas {
    fun drawCircle() = println("🟠 Drawing a circle")
    fun drawSquare() = println("🟥 Drawing a square")
}

// レシーバー付きラムダ式の定義
fun render(block: Canvas.() -> Unit): Canvas {
    val canvas = Canvas()
    // レシーバー付きラムダ式を使用
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

この例では:

*   `Canvas` クラスには、円や四角形を描画するシミュレーションを行う2つの関数があります。
*   `render()` 関数は `block` パラメータを受け取り、`Canvas` クラスのインスタンスを返します。
*   `block` パラメータはレシーバー付きラムダ式であり、`Canvas` クラスがレシーバーです。
*   `render()` 関数は `Canvas` クラスのインスタンスを作成し、`canvas` インスタンス上で `block()` ラムダ式をレシーバーとして呼び出します。
*   `main()` 関数は、`block` パラメータに渡されるラムダ式を使用して `render()` 関数を呼び出します。
*   `render()` 関数に渡されたラムダ式の内部では、プログラムは `Canvas` クラスのインスタンスに対して `drawCircle()` および `drawSquare()` 関数を呼び出します。

  `drawCircle()` および `drawSquare()` 関数はレシーバー付きラムダ式内で呼び出されるため、`Canvas` クラス内にあるかのように直接呼び出すことができます。

レシーバー付きラムダ式は、ドメイン固有言語 (DSL) を作成したい場合に役立ちます。レシーバーを明示的に参照することなく、レシーバーのメンバー関数とプロパティにアクセスできるため、コードがより簡潔になります。

これを実証するために、メニューの項目を構成する例を考えてみましょう。まず、`MenuItem` クラスと、メニューに項目を追加する `item()` 関数、およびすべてのメニュー項目 `items` のリストを含む `Menu` クラスから始めます。

```kotlin
class MenuItem(val name: String)

class Menu(val name: String) {
    val items = mutableListOf<MenuItem>()

    fun item(name: String) {
        items.add(MenuItem(name))
    }
}
```

開始点として、メニューを構築する `menu()` 関数に、関数パラメータ (`init`) として渡されるレシーバー付きラムダ式を使用してみましょう。

```kotlin
fun menu(name: String, init: Menu.() -> Unit): Menu {
    // Menuクラスのインスタンスを作成
    val menu = Menu(name)
    // クラスインスタンスに対してレシーバー付きラムダ式init()を呼び出す
    menu.init()
    return menu
}
```

これで、DSLを使用してメニューを構成し、`printMenu()` 関数を作成してメニュー構造をコンソールに出力できます。

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

// DSLを使用
fun main() {
    // メニューを作成
    val mainMenu = menu("Main Menu") {
        // メニューに項目を追加
        item("Home")
        item("Settings")
        item("Exit")
    }

    // メニューを出力
    printMenu(mainMenu)
    // Menu: Main Menu
    //   Item: Home
    //   Item: Settings
    //   Item: Exit
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver-dsl"}

ご覧のとおり、レシーバー付きラムダ式を使用すると、メニューを作成するために必要なコードが大幅に簡素化されます。ラムダ式は、設定と作成だけでなく、構成にも役立ちます。これらは、API、UIフレームワーク、および構成ビルダーのDSLを構築する際によく使用され、コードを合理化し、基礎となるコード構造とロジックに簡単に集中できるようにします。

Kotlinのエコシステムには、標準ライブラリの[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)関数や[`buildString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html)関数など、この設計パターンの多くの例があります。

> レシーバー付きラムダ式は、Kotlinの**型安全なビルダー**と組み合わせることで、実行時ではなくコンパイル時に型の問題を検出するDSLを作成できます。詳細については、[型安全なビルダー](type-safe-builders.md)を参照してください。
>
{style="tip"}

## 練習

### 演習 1 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-1"}

レシーバー付きラムダ式を受け入れる `fetchData()` 関数があります。コードの出力が `Data received - Processed` になるように、ラムダ式を `append()` 関数を使用するように更新してください。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-lambda-receivers-solution-1"}

### 演習 2 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-2"}

`Button` クラスと `ButtonEvent` および `Position` データクラスがあります。`Button` クラスの `onEvent()` メンバー関数をトリガーして、ダブルクリックイベントをトリガーするコードを記述してください。コードは `"Double click!"` を出力するはずです。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-lambda-receivers-solution-2"}

### 演習 3 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-3"}

各要素が1つずつインクリメントされた整数のリストのコピーを作成する関数を記述してください。`List<Int>` を `incremented` 関数で拡張する提供された関数スケルトンを使用してください。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-lambda-receivers-solution-3"}

## 次のステップ

[中級: クラスとインターフェース](kotlin-tour-intermediate-classes-interfaces.md)