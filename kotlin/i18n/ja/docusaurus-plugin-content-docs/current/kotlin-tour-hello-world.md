---
title: "Hello world"
---
<no-index/>

:::info
<p>
   <img src="/img/icon-1.svg" width="20" alt="First step" /> <strong>Hello world</strong><br />
        <img src="/img/icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">基本的な型 (Basic types)</a><br />
        <img src="/img/icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">コレクション (Collections)</a><br />
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">制御フロー (Control flow)</a><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">関数 (Functions)</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">クラス (Classes)</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety</a>
</p>

:::

"Hello, world!"と出力する簡単なプログラムを以下に示します。

```kotlin
fun main() {
    println("Hello, world!")
    // Hello, world!
}
```

Kotlinでは:

*   `fun` は関数を宣言するために使用されます
*   `main()` 関数はプログラムの開始点です
*   関数の本体は波括弧`{}`の中に記述します
*   [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) および [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) 関数は、引数を標準出力に出力します

関数とは、特定のタスクを実行する一連の命令のことです。関数を作成すると、そのタスクを実行する必要がある場合に、命令を何度も記述しなくても、いつでも関数を使用できます。関数については、後の章で詳しく説明します。それまでは、すべての例で `main()` 関数を使用します。

## 変数 (Variables)

すべてのプログラムはデータを保存できる必要があり、変数はまさにそれを実現するのに役立ちます。 Kotlinでは、以下を宣言できます:

*   `val` を使用した読み取り専用変数
*   `var` を使用した可変変数

:::note
値を割り当てた後、読み取り専用変数を変更することはできません。

:::

値を割り当てるには、代入演算子 `=` を使用します。

例:

```kotlin
fun main() { 

    val popcorn = 5    // ポップコーンが5箱あります
    val hotdog = 7     // ホットドッグが7個あります
    var customers = 10 // キューに10人の顧客がいます
    
    // 一部の顧客がキューから離れます
    customers = 8
    println(customers)
    // 8

}
```

変数は、プログラムの先頭で `main()` 関数の外で宣言できます。このように宣言された変数は、**トップレベル**で宣言されたと言われます。

`customers` は可変変数であるため、宣言後に値を再割り当てできます。

デフォルトでは、すべての変数を読み取り専用 (`val`) として宣言することをお勧めします。可変変数 (`var`) は、必要な場合にのみ宣言してください。

:::

## 文字列テンプレート (String templates)

変数の内容を標準出力に出力する方法を知っておくと便利です。これは、**文字列テンプレート (string templates)** で実行できます。テンプレート式を使用すると、変数やその他のオブジェクトに保存されているデータにアクセスし、文字列に変換できます。文字列値は、二重引用符`"`で囲まれた一連の文字です。テンプレート式は常にドル記号`$`で始まります。

テンプレート式でコードを評価するには、ドル記号`$`の後に波括弧`{}`の中にコードを記述します。

例:

```kotlin
fun main() { 

    val customers = 10
    println("There are $customers customers")
    // There are 10 customers
    
    println("There are ${customers + 1} customers")
    // There are 11 customers

}
```

詳細については、[文字列テンプレート (String templates)](strings#string-templates)を参照してください。

変数に型が宣言されていないことに気付くでしょう。Kotlinは型自体を推論しました:`Int`。このツアーでは、Kotlinのさまざまな基本的な型と、[次の章](kotlin-tour-basic-types)でそれらを宣言する方法について説明します。

## 練習 (Practice)

### 演習 (Exercise)

コードを完成させて、プログラムが`"Mary is 20 years old"`を標準出力に出力するようにします:

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    // ここにコードを記述します
}
```

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    println("$name is $age years old")
}
```

## 次のステップ (Next step)

[基本的な型 (Basic types)](kotlin-tour-basic-types)
```