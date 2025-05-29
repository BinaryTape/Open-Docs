[//]: # (title: こんにちは、世界)

<no-index/>

<tldr>
    <p><img src="icon-1.svg" width="20" alt="First step" /> <strong>Hello world</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">基本型</a><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">コレクション</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">制御フロー</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">関数</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">クラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">Null安全性</a></p>
</tldr>

以下は、"Hello, world!" を出力するシンプルなプログラムです。

```kotlin
fun main() {
    println("Hello, world!")
    // Hello, world!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="hello-world-kotlin"}

Kotlinでは:

* `fun` は関数を宣言するために使用されます
* `main()` 関数はプログラムの開始点です
* 関数の本体は波括弧 `{}` 内に記述されます
* [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) および [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) 関数は、その引数を標準出力に出力します

関数は、特定のタスクを実行する一連の命令です。一度関数を作成すれば、そのタスクを実行する必要があるときにいつでも再記述することなく使用できます。関数については、後続のいくつかの章で詳しく説明します。それまでは、すべての例で `main()` 関数を使用します。

## 変数

すべてのプログラムはデータを保存できる必要があり、変数はまさにそれを実現するのに役立ちます。Kotlinでは、以下を宣言できます。

* `val` を使用した読み取り専用変数
* `var` を使用した可変変数

> 読み取り専用変数は、一度値を設定すると変更できません。
>
{style="note"}

値を割り当てるには、代入演算子 `=` を使用します。

例:

```kotlin
fun main() { 
//sampleStart
    val popcorn = 5    // ポップコーンが5箱あります
    val hotdog = 7     // ホットドッグが7つあります
    var customers = 10 // 行列に顧客が10人います
    
    // 顧客が何人か列を離れます
    customers = 8
    println(customers)
    // 8
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-variables"}

> 変数は、プログラムの冒頭で `main()` 関数の外側でも宣言できます。このように宣言された変数は、**トップレベル**で宣言されたと呼ばれます。
> 
{style="tip"}

`customers` は可変変数であるため、宣言後にその値を再割り当てできます。

> すべての変数はデフォルトで読み取り専用 (`val`) として宣言することを推奨します。可変変数 (`var`) は必要な場合にのみ宣言してください。
> 
{style="note"}

## 文字列テンプレート

変数の内容を標準出力にプリントする方法を知ることは有用です。これは**文字列テンプレート**を使用して行えます。テンプレート式を使用して、変数や他のオブジェクトに保存されたデータにアクセスし、それらを文字列に変換できます。文字列値は、二重引用符 `"` で囲まれた文字のシーケンスです。テンプレート式は常にドル記号 `$` で始まります。

テンプレート式でコードの一部を評価するには、ドル記号 `$` の後に波括弧 `{}` 内にコードを配置します。

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

変数に対して型が宣言されていないことに気づくでしょう。Kotlinは型自体を `Int` と推論しています。このツアーでは、次の章でKotlinの様々な基本型とそれらの宣言方法について説明します。

## 演習

### 演習 {initial-collapse-state="collapsed" collapsible="true"}

プログラムが標準出力に `"Mary is 20 years old"` を出力するようにコードを完成させてください:

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