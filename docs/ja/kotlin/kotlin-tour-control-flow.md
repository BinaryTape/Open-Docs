[//]: # (title: 制御フロー)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="2番目のステップ" /> <a href="kotlin-tour-basic-types.md">基本型</a><br />
        <img src="icon-3-done.svg" width="20" alt="3番目のステップ" /> <a href="kotlin-tour-collections.md">コレクション</a><br />
        <img src="icon-4.svg" width="20" alt="4番目のステップ" /> <strong>制御フロー</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="5番目のステップ" /> <a href="kotlin-tour-functions.md">関数</a><br />
        <img src="icon-6-todo.svg" width="20" alt="6番目のステップ" /> <a href="kotlin-tour-classes.md">クラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="最後のステップ" /> <a href="kotlin-tour-null-safety.md">null安全性</a></p>
</tldr>

他のプログラミング言語と同様に、Kotlinはコードの評価が真であるかどうかに基づいて判断を下すことができます。このようなコードは**条件式**と呼ばれます。Kotlinはループを作成して反復処理することもできます。

## 条件式

Kotlinは条件式をチェックするために`if`と`when`を提供します。

> `if`と`when`のどちらかを選択する必要がある場合、`when`の使用をお勧めします。なぜなら、`when`は以下の利点があるためです。
>
> *   コードを読みやすくします。
> *   別の分岐を追加しやすくなります。
> *   コード内の間違いを減らすことができます。
>
{style="note"}

### If

`if`を使用するには、条件式を丸括弧`()`内に、結果が真である場合に実行するアクションを波括弧`{}`内に追加します。

```kotlin
fun main() {
//sampleStart
    val d: Int
    val check = true

    if (check) {
        d = 1
    } else {
        d = 2
    }

    println(d)
    // 1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if"}

Kotlinには三項演算子 `condition ? then : else` はありません。代わりに、`if`は式として使用できます。各アクションにコードが1行しかない場合、波括弧`{}`はオプションです。

```kotlin
fun main() { 
//sampleStart
    val a = 1
    val b = 2

    println(if (a > b) a else b) // 値を返します: 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if-expression"}

### When

複数の分岐を持つ条件式がある場合は、`when`を使用します。

`when`を使用するには、以下の手順を実行します。

*   評価したい値を丸括弧`()`内に配置します。
*   分岐を波括弧`{}`内に配置します。
*   各分岐で`->`を使用して、各チェックと、チェックが成功した場合に実行するアクションを区切ります。

`when`はステートメントとしても式としても使用できます。**ステートメント**は何も返さず、代わりにアクションを実行します。

`when`をステートメントとして使用する例を以下に示します。

```kotlin
fun main() {
//sampleStart
    val obj = "Hello"

    when (obj) {
        // objが"1"と等しいかどうかをチェックします
        "1" -> println("One")
        // objが"Hello"と等しいかどうかをチェックします
        "Hello" -> println("Greeting")
        // デフォルトのステートメント
        else -> println("Unknown")     
    }
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-statement"}

> すべての分岐条件は、いずれかが満たされるまで順番にチェックされることに注意してください。したがって、最初に合致する分岐のみが実行されます。
>
{style="note"}

**式**は、後でコードで使用できる値を返します。

`when`を式として使用する例を以下に示します。`when`式は変数に即座に割り当てられ、その変数は後で`println()`関数で使用されます。

```kotlin
fun main() {
//sampleStart    
    val obj = "Hello"    
    
    val result = when (obj) {
        // objが"1"と等しい場合、resultを"one"に設定します
        "1" -> "One"
        // objが"Hello"と等しい場合、resultを"Greeting"に設定します
        "Hello" -> "Greeting"
        // 以前の条件が満たされない場合、resultを"Unknown"に設定します
        else -> "Unknown"
    }
    println(result)
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression"}

ここまで見てきた`when`の例は、どちらも`obj`というサブジェクト（対象）を持っていました。しかし、`when`はサブジェクトなしでも使用できます。

この例では、サブジェクトなしの`when`式を使用して、一連のBoolean式をチェックします。

```kotlin
fun main() {
    val trafficLightState = "Red" // これは「Green」、「Yellow」、または「Red」になります

    val trafficAction = when {
        trafficLightState == "Green" -> "Go"
        trafficLightState == "Yellow" -> "Slow down"
        trafficLightState == "Red" -> "Stop"
        else -> "Malfunction"
    }

    println(trafficAction)
    // Stop
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression-boolean"}

ただし、`trafficLightState`をサブジェクトとして同じコードを記述することもできます。

```kotlin
fun main() {
    val trafficLightState = "Red" // これは「Green」、「Yellow」、または「Red」になります

    val trafficAction = when (trafficLightState) {
        "Green" -> "Go"
        "Yellow" -> "Slow down"
        "Red" -> "Stop"
        else -> "Malfunction"
    }

    println(trafficAction)  
    // Stop
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression-boolean-subject"}

サブジェクト付きで`when`を使用すると、コードが読みやすくなり、保守も容易になります。`when`式でサブジェクトを使用すると、Kotlinがすべての可能なケースが網羅されているかを確認するのにも役立ちます。そうしない場合、つまり`when`式でサブジェクトを使用しない場合は、`else`分岐を提供する必要があります。

## 条件式の練習

### 演習1 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-1"}

2つのサイコロを投げて同じ目が出たら勝ちとなるシンプルなゲームを作成してください。サイコロの目が一致したら`You win :)`を、そうでなければ`You lose :(`を`if`を使って出力してください。

> この演習では、`Random.nextInt()`関数を使用してランダムな`Int`を取得できるように、パッケージをインポートします。パッケージのインポートに関する詳細については、[パッケージとインポート](packages.md)を参照してください。
>
{style="tip"}

<deflist collapsible="true">
    <def title="ヒント">
        サイコロの結果を比較するために、<a href="operator-overloading.md#equality-and-inequality-operators">等価演算子</a> (<code>==</code>)を使用してください。
    </def>
</deflist>

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-conditional-exercise-1"}

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    if (firstResult == secondResult)
        println("You win :)")
    else
        println("You lose :(")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-control-flow-conditional-solution-1"}

### 演習2 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-2"}

`when`式を使用して、ゲームコンソールのボタン名を入力すると、対応するアクションが出力されるように以下のプログラムを更新してください。

| **ボタン** | **アクション** |
|------------|------------------------|
| A          | はい                    |
| B          | いいえ                  |
| X          | メニュー                 |
| Y          | 何もしない                |
| その他      | そのようなボタンはありません |

|---|---|
```kotlin
fun main() {
    val button = "A"

    println(
        // Write your code here
    )
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-conditional-exercise-2"}

|---|---|
```kotlin
fun main() {
    val button = "A"
    
    println(
        when (button) {
            "A" -> "Yes"
            "B" -> "No"
            "X" -> "Menu"
            "Y" -> "Nothing"
            else -> "There is no such button"
        }
    )
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-control-flow-conditional-solution-2"}

## レンジ

ループについて話す前に、ループが反復処理するレンジを構築する方法を知っておくと便利です。

Kotlinでレンジを作成する最も一般的な方法は、`..`演算子を使用することです。例えば、`1..4`は`1, 2, 3, 4`と同じです。

終端の値を含まないレンジを宣言するには、`..<`演算子を使用します。例えば、`1..<4`は`1, 2, 3`と同じです。

逆順のレンジを宣言するには、`downTo`を使用します。例えば、`4 downTo 1`は`4, 3, 2, 1`と同じです。

1以外のステップで増分するレンジを宣言するには、`step`と目的の増分値を使用します。
例えば、`1..5 step 2`は`1, 3, 5`と同じです。

`Char`レンジでも同様にできます。

*   `'a'..'d'`は`'a', 'b', 'c', 'd'`と同じです。
*   `'z' downTo 's' step 2`は`'z', 'x', 'v', 't'`と同じです。

## ループ

プログラミングで最も一般的な2つのループ構造は、`for`と`while`です。値のレンジを反復処理してアクションを実行するには`for`を使用し、特定の条件が満たされるまでアクションを継続するには`while`を使用します。

### For

レンジの新しい知識を使って、1から5までの数値を反復処理し、毎回その数値を出力する`for`ループを作成できます。

イテレータとレンジをキーワード`in`とともに丸括弧`()`内に配置します。完了したいアクションを波括弧`{}`内に追加します。

```kotlin
fun main() {
//sampleStart
    for (number in 1..5) { 
        // numberはイテレータで、1..5はレンジです
        print(number)
    }
    // 12345
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-loop"}

コレクションもループによって反復処理できます。

```kotlin
fun main() { 
//sampleStart
    val cakes = listOf("carrot", "cheese", "chocolate")

    for (cake in cakes) {
        println("Yummy, it's a $cake cake!")
    }
    // Yummy, it's a carrot cake!
    // Yummy, it's a cheese cake!
    // Yummy, it's a chocolate cake!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-collection-loop"}

### While

`while`は2つの方法で使用できます。

  *   条件式が真である間、コードブロックを実行する。（`while`）
  *   最初にコードブロックを実行し、その後条件式をチェックする。（`do-while`）

最初のユースケース（`while`）では:

*   `while`ループを継続するための条件式を丸括弧`()`内に宣言します。
*   完了したいアクションを波括弧`{}`内に追加します。

> 以下の例では、`cakesEaten`変数の値をインクリメントするために[インクリメント演算子](operator-overloading.md#increments-and-decrements) `++`を使用します。
>
{style="tip"}

```kotlin
fun main() {
//sampleStart
    var cakesEaten = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    // Eat a cake
    // Eat a cake
    // Eat a cake
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-while-loop"}

2番目のユースケース（`do-while`）では:

*   `while`ループを継続するための条件式を丸括弧`()`内に宣言します。
*   完了したいアクションをキーワード`do`とともに波括弧`{}`内で定義します。

```kotlin
fun main() {
//sampleStart
    var cakesEaten = 0
    var cakesBaked = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    do {
        println("Bake a cake")
        cakesBaked++
    } while (cakesBaked < cakesEaten)
    // Eat a cake
    // Eat a cake
    // Eat a cake
    // Bake a cake
    // Bake a cake
    // Bake a cake
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-while-do-loop"}

条件式とループに関する詳細および例については、[条件とループ](control-flow.md)を参照してください。

Kotlinの制御フローの基本を理解したところで、独自の[関数](kotlin-tour-functions.md)を記述する方法を学ぶ時が来ました。

## ループの練習

### 演習1 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-1"}

ピザが8切れになるまでピザの切れ数を数えるプログラムがあります。このプログラムを以下の2つの方法でリファクタリングしてください。

*   `while`ループを使用する。
*   `do-while`ループを使用する。

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    // ここからリファクタリングを開始
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    // ここでリファクタリングを終了
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-1"}

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    while ( pizzaSlices < 7 ) {
        pizzaSlices++
        println("There's only $pizzaSlices slice/s of pizza :(")
    }
    pizzaSlices++
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例1" id="kotlin-tour-control-flow-loops-exercise-1-solution-1"}

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    pizzaSlices++
    do {
        println("There's only $pizzaSlices slice/s of pizza :(")
        pizzaSlices++
    } while ( pizzaSlices < 8 )
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}

```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例2" id="kotlin-tour-control-flow-loops-exercise-1-solution-2"}

### 演習2 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-2"}

[Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz)ゲームをシミュレートするプログラムを記述してください。あなたのタスクは、1から100までの数を増分しながら出力し、3で割り切れる場合は「fizz」に、5で割り切れる場合は「buzz」に置き換えることです。3と5の両方で割り切れる場合は「fizzbuzz」に置き換えなければなりません。

<deflist collapsible="true">
    <def title="ヒント1">
        数を数えるには<code>for</code>ループを、各ステップで何を出力するかを決定するには<code>when</code>式を使用してください。
    </def>
</deflist>

<deflist collapsible="true">
    <def title="ヒント2">
        数を割った余りを返すには剰余演算子 (<code>%</code>) を使用してください。余りがゼロに等しいかどうかをチェックするには<a href="operator-overloading.md#equality-and-inequality-operators">等価演算子</a> (<code>==</code>) を使用してください。
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-2"}

|---|---|
```kotlin
fun main() {
    for (number in 1..100) {
        println(
            when {
                number % 15 == 0 -> "fizzbuzz"
                number % 3 == 0 -> "fizz"
                number % 5 == 0 -> "buzz"
                else -> "$number"
            }
        )
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-control-flow-loops-solution-2"}

### 演習3 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-3"}

単語のリストがあります。`for`と`if`を使用して、文字`l`で始まる単語のみを出力してください。

<deflist collapsible="true">
    <def title="ヒント">
        <code>String</code>型には<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/starts-with.html"><code>.startsWith()</code></a>関数を使用してください。
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // ここにコードを記述してください
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-3"}

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    for (w in words) {
        if (w.startsWith("l"))
            println(w)
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-control-flow-loops-solution-3"}

## 次のステップ

[関数](kotlin-tour-functions.md)