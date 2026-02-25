[//]: # (title: Hello world)

<no-index/>

<tldr>
    <p><img src="icon-1.svg" width="20" alt="ステップ 1" /> <strong>Hello world</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="ステップ 2" /> <a href="kotlin-tour-basic-types.md">基本型 (Basic types)</a><br />
        <img src="icon-3-todo.svg" width="20" alt="ステップ 3" /> <a href="kotlin-tour-collections.md">コレクション (Collections)</a><br />
        <img src="icon-4-todo.svg" width="20" alt="ステップ 4" /> <a href="kotlin-tour-control-flow.md">制御フロー (Control flow)</a><br />
        <img src="icon-5-todo.svg" width="20" alt="ステップ 5" /> <a href="kotlin-tour-functions.md">関数 (Functions)</a><br />
        <img src="icon-6-todo.svg" width="20" alt="ステップ 6" /> <a href="kotlin-tour-classes.md">クラス (Classes)</a><br />
        <img src="icon-7-todo.svg" width="20" alt="最終ステップ" /> <a href="kotlin-tour-null-safety.md">Null安全 (Null safety)</a></p>
</tldr>

> 読了時間: 3 分
> 
{style="tip"}

以下は、"Hello, world!" を出力するシンプルなプログラムです。

```kotlin
fun main() {
    println("Hello, world!")
    // Hello, world!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="hello-world-kotlin"}

Kotlin において：

* `fun` は関数を宣言するために使用されます
* `main()` 関数は、プログラムが開始される場所（エントリポイント）です
* 関数の本体は波括弧 `{}` の中に記述します
* [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) および [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) 関数は、引数を標準出力に出力します

関数とは、特定のタスクを実行する一連の命令の集まりです。一度関数を作成すれば、そのタスクを実行する必要があるときに、命令を何度も書き直すことなく、いつでも使用できます。関数については、後の章で詳しく説明します。それまでの間、すべての例では `main()` 関数を使用します。

## 変数 (Variables)

すべてのプログラムはデータを保存できる必要があり、変数はまさにそれを助けるためのものです。Kotlin では以下を宣言できます：

* `val` を使用した読み取り専用の変数
* `var` を使用した再代入可能な（ミュータブルな）変数

> 読み取り専用の変数は、一度値を代入すると変更できません。
>
{style="note"}

値を代入するには、代入演算子 `=` を使用します。

例：

```kotlin
fun main() { 
//sampleStart
    val popcorn = 5    // ポップコーンが5箱あります
    val hotdog = 7     // ホットドッグが7個あります
    var customers = 10 // 列に10人の客が並んでいます
    
    // 数名の客が列を離れます
    customers = 8
    println(customers)
    // 8
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-variables"}

> 変数はプログラムの冒頭、`main()` 関数の外側で宣言することもできます。このように宣言された変数は、**トップレベル**で宣言されていると言われます。
> 
{style="tip"}

`customers` は再代入可能な変数であるため、宣言した後にその値を再代入できます。

> すべての変数は、デフォルトで読み取り専用 (`val`) として宣言することをお勧めします。どうしても必要な場合にのみ、再代入可能な変数 (`var`) を使用してください。そうすることで、変更すべきでないものを誤って変更してしまう可能性を低くできます。
> 
{style="note"}

## 文字列テンプレート (String templates)

変数の内容を標準出力に出力する方法を知っておくと便利です。これは**文字列テンプレート**を使用して行えます。テンプレート式を使用すると、変数や他のオブジェクトに保存されたデータにアクセスし、それらを文字列に変換できます。文字列の値は、二重引用符 `"` で囲まれた文字の並びです。テンプレート式は常にドル記号 `$` で始まります。

テンプレート式の中でコードの一部を評価するには、ドル記号 `$` の後のコードを波括弧 `{}` で囲みます。

例：

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

詳細については、[String templates](strings.md#string-templates) を参照してください。

変数に対して型が宣言されていないことに気づくでしょう。Kotlin は型自体を推論しました：`Int`（整数型）。このツアーの[次の章](kotlin-tour-basic-types.md)では、Kotlin のさまざまな基本型と、それらの宣言方法について説明します。

## 練習 (Practice)

### 演習 {initial-collapse-state="collapsed" collapsible="true"}

プログラムが標準出力に `"Mary is 20 years old"` と出力するようにコードを完成させてください：

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    // ここにコードを書いてください
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

[基本型 (Basic types)](kotlin-tour-basic-types.md)