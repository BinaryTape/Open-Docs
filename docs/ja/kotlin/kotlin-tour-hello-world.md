[//]: # (title: Hello world)

<no-index/>

<tldr>
    <p><img src="icon-1.svg" width="20" alt="最初のステップ" /> <strong>Hello world</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="2番目のステップ" /> <a href="kotlin-tour-basic-types.md">基本型</a><br />
        <img src="icon-3-todo.svg" width="20" alt="3番目のステップ" /> <a href="kotlin-tour-collections.md">コレクション</a><br />
        <img src="icon-4-todo.svg" width="20" alt="4番目のステップ" /> <a href="kotlin-tour-control-flow.md">制御フロー</a><br />
        <img src="icon-5-todo.svg" width="20" alt="5番目のステップ" /> <a href="kotlin-tour-functions.md">関数</a><br />
        <img src="icon-6-todo.svg" width="20" alt="6番目のステップ" /> <a href="kotlin-tour-classes.md">クラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="最終ステップ" /> <a href="kotlin-tour-null-safety.md">Null安全性</a></p>
</tldr>

以下は「Hello, world!」と出力するシンプルなプログラムです。

```kotlin
fun main() {
    println("Hello, world!")
    // Hello, world!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="hello-world-kotlin"}

Kotlinでは:

*   `fun` は関数を宣言するために使われます。
*   `main()` 関数はプログラムの開始点です。
*   関数の本体は波括弧 `{}` 内に記述します。
*   [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) および [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) 関数は、その引数を標準出力に出力します。

関数とは、特定のタスクを実行する命令の集まりです。一度関数を作成すれば、そのタスクを実行する必要があるたびに、命令をいちいち書き直すことなく関数を使用できます。関数については、いくつかの章で詳しく説明します。それまでは、すべての例で `main()` 関数を使用します。

## 変数

すべてのプログラムはデータを保存できる必要があり、変数はその手助けをします。Kotlinでは、以下を宣言できます。

*   `val` を使って読み取り専用変数を宣言します。
*   `var` を使ってミュータブル変数を宣言します。

> 読み取り専用変数に一度値を設定すると、その値を変更することはできません。
>
{style="note"}

値を割り当てるには、代入演算子 `=` を使用します。

例:

```kotlin
fun main() { 
//sampleStart
    val popcorn = 5    // There are 5 boxes of popcorn
    val hotdog = 7     // There are 7 hotdogs
    var customers = 10 // There are 10 customers in the queue
    
    // Some customers leave the queue
    customers = 8
    println(customers)
    // 8
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-variables"}

> 変数は、プログラムの開始時に `main()` 関数の外で宣言できます。このように宣言された変数は、**トップレベル**で宣言されたと呼ばれます。
> 
{style="tip"}

`customers` はミュータブル変数であるため、宣言後にその値を再代入できます。

> すべての変数は、デフォルトで読み取り専用（`val`）として宣言することをお勧めします。ミュータブル変数（`var`）は、本当に必要な場合にのみ使用してください。そうすることで、意図しない変更を誤って行ってしまう可能性を低くできます。
> 
{style="note"}

## 文字列テンプレート

変数の内容を標準出力に出力する方法を知っておくと便利です。これは**文字列テンプレート**を使って行えます。テンプレート式を使用すると、変数や他のオブジェクトに格納されているデータにアクセスし、それらを文字列に変換できます。文字列値は二重引用符 `"` で囲まれた文字のシーケンスです。テンプレート式は常にドル記号 `$` で始まります。テンプレート式でコードの一部を評価するには、ドル記号 `$` の後に波括弧 `{}` でコードを囲みます。

例:

```kotlin
fun main() { 
//sampleStart
    val customers = 10
    println("There are $customers customers")
    // There are 10 customers
    
    println("There are ${customers + 1} customers")
    // There are 11 customers
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-string-templates"}

詳細については、[文字列テンプレート](strings.md#string-templates)を参照してください。

変数に型が宣言されていないことに気づくでしょう。Kotlinは型を `Int` と推論しました。このツアーでは、次の章でKotlinの様々な基本型とそれらを宣言する方法を説明します。

## 練習

### 演習 {initial-collapse-state="collapsed" collapsible="true"}

プログラムが「Mary is 20 years old」を標準出力に出力するように、コードを完成させてください。

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    // ここにコードを記述してください
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-hello-world-exercise"}

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    println("$name is $age years old")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-hello-world-solution"}

## 次のステップ

[基本型](kotlin-tour-basic-types.md)