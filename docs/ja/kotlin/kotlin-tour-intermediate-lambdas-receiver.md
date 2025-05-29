[//]: # (title: 中級: レシーバ付きラムダ式)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">拡張関数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">スコープ関数</a><br />
        <img src="icon-3.svg" width="20" alt="Third step" /> <strong>レシーバ付きラムダ式</strong><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">クラスとインターフェース</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">open クラスと特殊なクラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">プロパティ</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null safety</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリとAPI</a></p>
</tldr>

この章では、別の種類の関数であるラムダ式でレシーバオブジェクトを使用する方法と、それらがドメイン固有言語 (DSL) を作成するのにどのように役立つかを学びます。

## レシーバ付きラムダ式

初級ツアーでは、[ラムダ式](kotlin-tour-functions.md#lambda-expressions) の使い方を学びました。ラムダ式はレシーバを持つこともできます。この場合、ラムダ式は、レシーバオブジェクトを毎回明示的に指定することなく、レシーバオブジェクトの任意のメンバー関数やプロパティにアクセスできます。これらの余分な参照がないため、コードは読みやすく保守しやすくなります。

> レシーバ付きラムダ式は、レシーバ付き関数リテラル (function literals with receiver) とも呼ばれます。
>
{style="tip"}

レシーバ付きラムダ式の構文は、関数型を定義する際に異なります。まず、拡張したいレシーバオブジェクトを記述します。次に、` . ` を置き、関数型の残りの定義を完成させます。例:

```kotlin
MutableList<Int>.() -> Unit
```

この関数型は以下を持ちます:

*   `MutableList<Int>` をレシーバ型とします。
*   丸括弧 `()` 内に関数パラメータはありません。
*   戻り値はありません: `Unit`。

`StringBuilder` クラスを拡張するこの例を考えてみましょう:

```kotlin
fun main() {
    // レシーバ付きラムダ式の定義
    fun StringBuilder.appendText() { append("Hello!") }

    // レシーバ付きラムダ式の使用
    val stringBuilder = StringBuilder()
    stringBuilder.appendText()
    println(stringBuilder.toString())
    // Hello!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver"}

この例では:

*   `StringBuilder` クラスがレシーバ型です。
*   ラムダ式の関数型は、関数パラメータ `()` がなく、戻り値 `Unit` もありません。
*   ラムダ式は `StringBuilder` クラスの `append()` メンバー関数を呼び出し、文字列 `"Hello!"` を関数パラメータとして使用します。
*   `StringBuilder` クラスのインスタンスが作成されます。
*   `appendText` に割り当てられたラムダ式が `stringBuilder` インスタンス上で呼び出されます。
*   `stringBuilder` インスタンスは `toString()` 関数で文字列に変換され、`println()` 関数を介して出力されます。

レシーバ付きラムダ式は、ドメイン固有言語 (DSL) を作成したい場合に役立ちます。レシーバを明示的に参照することなく、レシーバオブジェクトのメンバー関数やプロパティにアクセスできるため、コードがより簡潔になります。

これを説明するために、メニュー内の項目を設定する例を考えてみましょう。まず、`MenuItem` クラスと、`item()` と呼ばれるメニューに項目を追加する関数、およびすべてのメニュー項目を保持するリスト `items` を含む `Menu` クラスから始めます:

```kotlin
class MenuItem(val name: String)

class Menu(val name: String) {
    val items = mutableListOf<MenuItem>()

    fun item(name: String) {
        items.add(MenuItem(name))
    }
}
```

開始点としてメニューを構築する `menu()` 関数に、関数パラメータ (`init`) として渡されるレシーバ付きラムダ式を使用してみましょう。`StringBuilder` クラスの前の例と同様のアプローチに従っていることに気づくでしょう:

```kotlin
fun menu(name: String, init: Menu.() -> Unit): Menu {
    // Menu クラスのインスタンスを作成
    val menu = Menu(name)
    // クラスインスタンス上でレシーバ付きラムダ式 init() を呼び出す
    menu.init()
    return menu
}
```

これで、DSL を使用してメニューを設定し、メニュー構造をコンソールに出力する `printMenu()` 関数を作成できます:

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

// DSL を使用
fun main() {
    // メニューを作成
    val mainMenu = menu("Main Menu") {
        // メニューに項目を追加
        item("Home")
        item("Settings")
        item("Exit")
    }

    // メニューを印刷
    printMenu(mainMenu)
    // Menu: Main Menu
    // Item: Home
    // Item: Settings
    // Item: Exit
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver-dsl"}

ご覧のとおり、レシーバ付きラムダ式を使用すると、メニューを作成するために必要なコードが大幅に簡素化されます。ラムダ式は、セットアップや作成だけでなく、設定にも役立ちます。これらは、API、UIフレームワーク、および設定ビルダーのDSL構築で一般的に使用され、効率的なコードを生成し、基盤となるコード構造とロジックにより簡単に集中できるようになります。

Kotlinのエコシステムには、標準ライブラリの[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)や[`buildString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html)関数など、このデザインパターンの多くの例があります。

> レシーバ付きラムダ式は、Kotlin の **型安全なビルダー** と組み合わせて、実行時ではなくコンパイル時に型の問題を検出する DSL を作成できます。詳細については、[型安全なビルダー](type-safe-builders.md) を参照してください。
>
{style="tip"}

## 練習問題

### 練習問題 1 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-1"}

レシーバ付きラムダ式を受け入れる `fetchData()` 関数があります。コードの出力が `Data received - Processed` になるように、`append()` 関数を使用するようにラムダ式を更新してください。

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

### 練習問題 2 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-2"}

`Button` クラスと `ButtonEvent` および `Position` データクラスがあります。`Button` クラスの `onEvent()` メンバー関数をトリガーして、ダブルクリックイベントをトリガーするコードを記述してください。コードは `"Double click!"` と出力するはずです。

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

### 練習問題 3 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-3"}

すべての要素が1ずつインクリメントされた整数のリストのコピーを作成する関数を記述してください。`List<Int>` を `incremented` 関数で拡張する提供された関数スケルトンを使用してください。

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