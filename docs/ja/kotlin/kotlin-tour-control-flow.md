---
title: 制御フロー
---
<no-index/>

:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types (基本的な型)</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">Collections (コレクション)</a><br />
        <img src="/img/icon-4.svg" width="20" alt="Fourth step" /> <strong>Control flow (制御フロー)</strong><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">Functions (関数)</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">Classes (クラス)</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety (Null安全性)</a>
</p>

:::

他のプログラミング言語と同様に、Kotlin はコードが true と評価されるかどうかに基づいて判断を下すことができます。このようなコードを**条件式**と呼びます。Kotlin は、ループを作成して反復処理することもできます。

## Conditional expressions (条件式)

Kotlin には、条件式をチェックするための `if` と `when` が用意されています。

:::note
`if` と `when` のどちらかを選択する必要がある場合は、`when` を使用することをお勧めします。理由は次のとおりです。

* コードが読みやすくなる。
* 別のブランチを追加するのが容易になる。
* コード内のミスが少なくなる。

:::

### If (If文)

`if` を使用するには、丸括弧 `()` 内に条件式を追加し、結果が true の場合に実行するアクションを波括弧 `{}` 内に追加します。

```kotlin
fun main() {

    val d: Int
    val check = true

    if (check) {
        d = 1
    } else {
        d = 2
    }

    println(d)
    // 1

}
```

Kotlin には、三項演算子 `condition ? then : else` はありません。代わりに、`if` を式として使用できます。アクションごとにコードが 1 行しかない場合は、波括弧 `{}` はオプションです。

```kotlin
fun main() { 

    val a = 1
    val b = 2

    println(if (a > b) a else b) // Returns a value: 2

}
```

### When (When式)

複数のブランチを持つ条件式がある場合は、`when` を使用します。

`when` の使用方法:

* 評価する値を丸括弧 `()` 内に配置します。
* 波括弧 `{}` 内にブランチを配置します。
* 各ブランチで `->` を使用して、各チェックを、チェックが成功した場合に実行するアクションから分離します。

`when` は、ステートメントまたは式として使用できます。**ステートメント**は何も返しませんが、代わりにアクションを実行します。

`when` をステートメントとして使用する例を次に示します。

```kotlin
fun main() {

    val obj = "Hello"

    when (obj) {
        // Checks whether obj equals to "1"
        "1" `->` println("One")
        // Checks whether obj equals to "Hello"
        "Hello" `->` println("Greeting")
        // Default statement
        else `->` println("Unknown")     
    }
    // Greeting

}
```

:::note
すべてのブランチ条件は、いずれかが満たされるまで順番にチェックされることに注意してください。したがって、最初に該当するブランチのみが実行されます。

:::

**式**は、コードで後で使用できる値を返します。

`when` を式として使用する例を次に示します。`when` 式は変数に即座に割り当てられ、後で `println()` 関数で使用されます。

```kotlin
fun main() {

    val obj = "Hello"    
    
    val result = when (obj) {
        // If obj equals "1", sets result to "one"
        "1" `->` "One"
        // If obj equals "Hello", sets result to "Greeting"
        "Hello" `->` "Greeting"
        // Sets result to "Unknown" if no previous condition is satisfied
        else `->` "Unknown"
    }
    println(result)
    // Greeting

}
```

これまで見てきた `when` の例には、両方ともサブジェクト `obj` がありました。ただし、`when` はサブジェクトなしで使用することもできます。

次の例では、サブジェクト**なし**の `when` 式を使用して、Boolean 式のチェーンをチェックします。

```kotlin
fun main() {
    val trafficLightState = "Red" // This can be "Green", "Yellow", or "Red"

    val trafficAction = when {
        trafficLightState == "Green" `->` "Go"
        trafficLightState == "Yellow" `->` "Slow down"
        trafficLightState == "Red" `->` "Stop"
        else `->` "Malfunction"
    }

    println(trafficAction)
    // Stop
}
```

ただし、同じコードを `trafficLightState` をサブジェクトにして記述することもできます。

```kotlin
fun main() {
    val trafficLightState = "Red" // This can be "Green", "Yellow", or "Red"

    val trafficAction = when (trafficLightState) {
        "Green" `->` "Go"
        "Yellow" `->` "Slow down"
        "Red" `->` "Stop"
        else `->` "Malfunction"
    }

    println(trafficAction)  
    // Stop
}
```

サブジェクトを指定して `when` を使用すると、コードの読みやすさと保守性が向上します。`when` 式でサブジェクトを使用すると、Kotlin が考えられるすべてのケースが網羅されていることを確認するのに役立ちます。それ以外の場合、`when` 式でサブジェクトを使用しない場合は、else ブランチを指定する必要があります。

## Conditional expressions practice (条件式の練習)

### Exercise 1 (演習 1)

2 つのサイコロを振って同じ数が出たら勝ちとなる簡単なゲームを作成します。サイコロが一致する場合は `You win :)` を、そうでない場合は `You lose :(` を `if` を使用して出力します。

:::tip
この演習では、`Random.nextInt()` 関数を使用してランダムな `Int` を取得できるように、パッケージをインポートします。パッケージのインポートの詳細については、[Packages and imports (パッケージとインポート)](packages)を参照してください。

:::
<h3>Hint</h3>
        <a href="operator-overloading#equality-and-inequality-operators">等価演算子</a> (`==`) を使用して、サイコロの結果を比較します。
    

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    // Write your code here
}
```

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

### Exercise 2 (演習 2)

`when` 式を使用して、ゲーム機のボタンの名前を入力したときに、対応するアクションが出力されるように次のプログラムを更新します。

| **Button** | **Action**             |
|------------|------------------------|
| A          | Yes                    |
| B          | No                     |
| X          | Menu                   |
| Y          | Nothing                |
| Other      | There is no such button |

|---|---|
```kotlin
fun main() {
    val button = "A"

    println(
        // Write your code here
    )
}
```

|---|---|
```kotlin
fun main() {
    val button = "A"
    
    println(
        when (button) {
            "A" `->` "Yes"
            "B" `->` "No"
            "X" `->` "Menu"
            "Y" `->` "Nothing"
            else `->` "There is no such button"
        }
    )
}
```

## Ranges (範囲)

ループについて説明する前に、ループで反復処理する範囲を構築する方法を知っておくと便利です。

Kotlin で範囲を作成する最も一般的な方法は、`..` 演算子を使用することです。たとえば、`1..4` は `1, 2, 3, 4` と同等です。

終了値を含まない範囲を宣言するには、`..<` 演算子を使用します。たとえば、`1..&lt;4` は `1, 2, 3` と同等です。

範囲を逆順で宣言するには、`downTo` を使用します。たとえば、`4 downTo 1` は `4, 3, 2, 1` と同等です。

1 ではないステップでインクリメントする範囲を宣言するには、`step` と目的のインクリメント値を使用します。たとえば、`1..5 step 2` は `1, 3, 5` と同等です。

`Char` 範囲でも同じことができます。

* `'a'..'d'` は `'a', 'b', 'c', 'd'` と同等です
* `'z' downTo 's' step 2` は `'z', 'x', 'v', 't'` と同等です

## Loops (ループ)

プログラミングで最も一般的なループ構造は `for` と `while` の 2 つです。`for` を使用して値の範囲を反復処理し、アクションを実行します。`while` を使用して、特定の条件が満たされるまでアクションを続行します。

### For (Forループ)

範囲に関する新しい知識を使用して、1 から 5 までの数値を反復処理し、毎回数値を出力する `for` ループを作成できます。

反復子と範囲をキーワード `in` を使用して丸括弧 `()` 内に配置します。完了するアクションを波括弧 `{}` 内に追加します。

```kotlin
fun main() {

    for (number in 1..5) { 
        // number is the iterator and 1..5 is the range
        print(number)
    }
    // 12345

}
```

コレクションもループで反復処理できます。

```kotlin
fun main() { 

    val cakes = listOf("carrot", "cheese", "chocolate")

    for (cake in cakes) {
        println("Yummy, it's a $cake cake!")
    }
    // Yummy, it's a carrot cake!
    // Yummy, it's a cheese cake!
    // Yummy, it's a chocolate cake!

}
```

### While (Whileループ)

`while` は、次の 2 つの方法で使用できます。

  * 条件式が true の間、コードブロックを実行します (`while`)。
  * 最初にコードブロックを実行し、次に条件式をチェックします (`do-while`)。

最初のユースケース (`while`) では:

* while ループを続行するための条件式を丸括弧 `()` 内に宣言します。
* 完了するアクションを波括弧 `{}` 内に追加します。

次の例では、[インクリメント演算子](operator-overloading#increments-and-decrements) `++` を使用して、`cakesEaten` 変数の値をインクリメントします。

:::

```kotlin
fun main() {

    var cakesEaten = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    // Eat a cake
    // Eat a cake
    // Eat a cake

}
```

2 番目のユースケース (`do-while`) では:

* while ループを続行するための条件式を丸括弧 `()` 内に宣言します。
* キーワード `do` を指定して、完了するアクションを波括弧 `{}` で定義します。

```kotlin
fun main() {

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

}
```

条件式とループの詳細および例については、[Conditions and loops (条件とループ)](control-flow)を参照してください。

Kotlin の制御フローの基礎を理解したので、独自の[functions (関数)](kotlin-tour-functions)を作成する方法を学ぶ時が来ました。

## Loops practice (ループの練習)

### Exercise 1 (演習 1)

8 スライスのピザ全体ができるまでピザのスライスを数えるプログラムがあります。このプログラムを次の 2 つの方法でリファクタリングします。

* `while` ループを使用します。
* `do-while` ループを使用します。

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

### Exercise 2 (演習 2)

[Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz) ゲームをシミュレートするプログラムを作成します。あなたのタスクは、1 から 100 までの数値を段階的に出力し、3 で割り切れる数値をすべて「fizz」という単語に、5 で割り切れる数値をすべて「buzz」という単語に置き換えることです。3 と 5 の両方で割り切れる数値は、「fizzbuzz」という単語に置き換える必要があります。
<h3>Hint 1</h3>
        `for` ループを使用して数値をカウントし、`when` 式を使用して各ステップで何を出力するかを決定します。
<h3>Hint 2</h3>
        剰余演算子 (`%`) を使用して、除算される数値の余りを返します。<a href="operator-overloading#equality-and-inequality-operators">等価演算子</a>
        (`==`) を使用して、余りがゼロに等しいかどうかをチェックします。
    

|---|---|
```kotlin
fun main() {
    // Write your code here
}
```

|---|---|
```kotlin
fun main() {
    for (number in 1..100) {
        println(
            when {
                number % 15 == 0 `->` "fizzbuzz"
                number % 3 == 0 `->` "fizz"
                number % 5 == 0 `->` "buzz"
                else `->` "$number"
            }
        )
    }
}
```

### Exercise 3 (演習 3)

単語のリストがあります。`for` と `if` を使用して、文字 `l` で始まる単語のみを出力します。
<h3>Hint</h3>
        `String` 型の <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/starts-with.html"> `.startsWith()`
        </a> 関数を使用します。
    

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // Write your code here
}
```

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

## Next step (次のステップ)

[Functions (関数)](kotlin-tour-functions)