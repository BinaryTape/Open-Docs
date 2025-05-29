[//]: # (title: 制御フロー)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">基本型</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">コレクション</a><br />
        <img src="icon-4.svg" width="20" alt="Fourth step" /> <strong>制御フロー</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">関数</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">クラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">null安全性</a></p>
</tldr>

他のプログラミング言語と同様に、Kotlinはコードがtrueと評価されるかどうかに基づいて決定を下すことができます。このようなコードは**条件式**と呼ばれます。Kotlinはループを作成し、繰り返し処理を行うこともできます。

## 条件式

Kotlinは条件式をチェックするために`if`と`when`を提供しています。

> `if`と`when`のどちらかを選択しなければならない場合、`when`の使用をお勧めします。それは以下の理由によります。
>
> *   コードが読みやすくなります。
> *   別の分岐を追加しやすくなります。
> *   コード内の間違いが少なくなります。
>
{style="note"}

### If

`if`を使用するには、条件式を括弧`()`内に、結果がtrueの場合に実行するアクションを波括弧`{}`内に記述します。

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

Kotlinには三項演算子`condition ? then : else`はありません。代わりに、`if`は式として使用できます。各アクションのコードが1行のみの場合、波括弧`{}`は省略可能です。

```kotlin
fun main() { 
//sampleStart
    val a = 1
    val b = 2

    println(if (a > b) a else b) // Returns a value: 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if-expression"}

### When

複数の分岐を持つ条件式がある場合は、`when`を使用します。

`when`を使用するには：

*   評価したい値を括弧`()`内に配置します。
*   分岐を波括弧`{}`内に配置します。
*   各分岐で`->`を使用して、チェックと、チェックが成功した場合に実行するアクションを区切ります。

`when`は文 (statement) または式 (expression) として使用できます。**文 (statement)**は何も返しませんが、アクションを実行します。

`when`を文として使用する例を以下に示します。

```kotlin
fun main() {
//sampleStart
    val obj = "Hello"

    when (obj) {
        // Checks whether obj equals to "1"
        "1" -> println("One")
        // Checks whether obj equals to "Hello"
        "Hello" -> println("Greeting")
        // Default statement
        else -> println("Unknown")     
    }
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-statement"}

> すべての分岐条件は、いずれかが満たされるまで順次チェックされることに注意してください。したがって、最初に適合した分岐のみが実行されます。
>
{style="note"}

**式 (expression)**は、後でコードで使用できる値を返します。

`when`を式として使用する例を以下に示します。`when`式はすぐに変数に割り当てられ、後で`println()`関数で使用されます。

```kotlin
fun main() {
//sampleStart    
    val obj = "Hello"    
    
    val result = when (obj) {
        // If obj equals "1", sets result to "one"
        "1" -> "One"
        // If obj equals "Hello", sets result to "Greeting"
        "Hello" -> "Greeting"
        // Sets result to "Unknown" if no previous condition is satisfied
        else -> "Unknown"
    }
    println(result)
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression"}

これまでに見てきた`when`の例はどちらも主題 (`obj`) を持っていました。しかし、`when`は主題なしでも使用できます。

この例では、**主題なし**の`when`式を使用して、Boolean式の連鎖をチェックしています。

```kotlin
fun main() {
    val trafficLightState = "Red" // This can be "Green", "Yellow", or "Red"

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

ただし、`trafficLightState`を主題として同じコードを作成することもできます。

```kotlin
fun main() {
    val trafficLightState = "Red" // This can be "Green", "Yellow", or "Red"

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

`when`を主題とともに使用すると、コードが読みやすく、保守しやすくなります。`when`式を主題とともに使用すると、Kotlinがすべての可能なケースが網羅されていることを確認するのにも役立ちます。そうでない場合、`when`式を主題なしで使用すると、`else`分岐を提供する必要があります。

## 条件式の練習問題

### 練習問題 1 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-1"}

2つのサイコロを振って同じ数字が出た場合に勝利するシンプルなゲームを作成します。サイコロが一致した場合は`You win :)`と、そうでない場合は`You lose :(`と出力するために`if`を使用します。

> この演習では、ランダムな`Int`を取得するために`Random.nextInt()`関数を使用できるように、パッケージをインポートします。パッケージのインポートに関する詳細については、[パッケージとインポート](packages.md)を参照してください。
>
{style="tip"}

<deflist collapsible="true">
    <def title="ヒント">
        サイコロの結果を比較するには、<a href="operator-overloading.md#equality-and-inequality-operators">等価演算子</a>（<code>==</code>）を使用します。
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

### 練習問題 2 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-2"}

`when`式を使用して、ゲーム機のボタン名を入力したときに対応するアクションが出力されるように、次のプログラムを更新します。

| **ボタン** | **アクション** |
|------------|------------------------|
| A          | はい                    |
| B          | いいえ                   |
| X          | メニュー                 |
| Y          | 何もなし                |
| Other      | そのようなボタンはありません |

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

## 範囲 (Ranges)

ループが反復処理を行うための範囲を構築する方法を知っておくと、ループについて話す前に役立ちます。

Kotlinで範囲を作成する最も一般的な方法は、`..`演算子を使用することです。たとえば、`1..4`は`1, 2, 3, 4`と同等です。

終了値を含まない範囲を宣言するには、`..<`演算子を使用します。たとえば、`1..<4`は`1, 2, 3`と同等です。

逆順で範囲を宣言するには、`downTo`を使用します。たとえば、`4 downTo 1`は`4, 3, 2, 1`と同等です。

1ではないステップでインクリメントする範囲を宣言するには、`step`と希望する増分値を使用します。たとえば、`1..5 step 2`は`1, 3, 5`と同等です。

`Char`型の範囲でも同様に行うことができます。

*   `'a'..'d'`は`'a', 'b', 'c', 'd'`と同等
*   `'z' downTo 's' step 2`は`'z', 'x', 'v', 't'`と同等

## ループ

プログラミングで最も一般的な2つのループ構造は`for`と`while`です。`for`は値の範囲を反復処理し、アクションを実行するために使用します。`while`は特定の条件が満たされるまでアクションを続行するために使用します。

### For

範囲に関する新しい知識を使って、1から5までの数値を反復処理し、その都度数値を出力する`for`ループを作成できます。

イテレータと範囲をキーワード`in`とともに括弧`()`内に配置します。実行したいアクションを波括弧`{}`内に記述します。

```kotlin
fun main() {
//sampleStart
    for (number in 1..5) { 
        // number is the iterator and 1..5 is the range
        print(number)
    }
    // 12345
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-loop"}

コレクションもループで反復処理できます。

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

*   条件式がtrueである間、コードブロックを実行する。 (`while`)
*   まずコードブロックを実行し、その後に条件式をチェックする。 (`do-while`)

最初の使用例 (`while`) では：

*   `while`ループを続行するための条件式を括弧`()`内に宣言します。
*   実行したいアクションを波括弧`{}`内に記述します。

> 以下の例では、`cakesEaten`変数の値をインクリメントするために、[インクリメント演算子](operator-overloading.md#increments-and-decrements) `++`を使用しています。
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

2番目の使用例 (`do-while`) では：

*   `while`ループを続行するための条件式を括弧`()`内に宣言します。
*   キーワード`do`とともに、実行したいアクションを波括弧`{}`内に定義します。

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

条件式とループに関する詳細情報と例については、[条件とループ](control-flow.md)を参照してください。

Kotlinの制御フローの基本を理解したところで、独自の[関数](kotlin-tour-functions.md)の書き方を学ぶ時が来ました。

## ループの練習問題

### 練習問題 1 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-1"}

8切れのピザが丸ごとできるまでピザの切れ数を数えるプログラムがあります。このプログラムを2つの方法でリファクタリングします。

*   `while`ループを使用する。
*   `do-while`ループを使用する。

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    // Start refactoring here
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
    // End refactoring here
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例 1" id="kotlin-tour-control-flow-loops-exercise-1-solution-1"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例 2" id="kotlin-tour-control-flow-loops-exercise-1-solution-2"}

### 練習問題 2 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-2"}

[Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz)ゲームをシミュレートするプログラムを記述します。タスクは、1から100までの数字を段階的に出力し、3で割り切れる数字を「fizz」という単語に、5で割り切れる数字を「buzz」という単語に置き換えることです。3と5の両方で割り切れる数字は「fizzbuzz」という単語に置き換えなければなりません。

<deflist collapsible="true">
    <def title="ヒント 1">
        数値を数えるには<code>for</code>ループを、各ステップで何を出力するかを決定するには<code>when</code>式を使用します。
    </def>
</deflist>

<deflist collapsible="true">
    <def title="ヒント 2">
        数値を割った余りを返すには剰余演算子（<code>%</code>）を使用します。余りがゼロに等しいかどうかを確認するには、<a href="operator-overloading.md#equality-and-inequality-operators">等価演算子</a>（<code>==</code>）を使用します。
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

### 練習問題 3 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-3"}

単語のリストがあります。`for`と`if`を使用して、文字`l`で始まる単語のみを出力します。

<deflist collapsible="true">
    <def title="ヒント">
        <code>String</code>型に対する<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/starts-with.html"> <code>.startsWith()</code>
        </a>関数を使用します。
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // Write your code here
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