[//]: # (title: 文字列)

Kotlinの文字列は、[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)型で表現されます。

> JVM上では、UTF-16エンコーディングの`String`型オブジェクトは1文字あたり約2バイトを使用します。
>
{style="note"}

一般的に、文字列値は二重引用符 (`"`) で囲まれた文字のシーケンスです。

```kotlin
val str = "abcd 123"
```

文字列の要素は、インデックス操作 `s[i]` でアクセスできる文字です。
`for`ループを使ってこれらの文字を反復処理できます。

```kotlin
fun main() {
    val str = "abcd"
//sampleStart
    for (c in str) {
        println(c)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

文字列はイミュータブル（不変）です。一度文字列を初期化すると、その値を変更したり、新しい値を代入したりすることはできません。
文字列を変換するすべての操作は、結果を新しい`String`オブジェクトとして返し、元の文字列は変更されません。

```kotlin
fun main() {
//sampleStart
    val str = "abcd"
   
    // 新しいStringオブジェクトを作成して出力します
    println(str.uppercase())
    // ABCD
   
    // 元の文字列は変更されません
    println(str)
    // abcd
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

文字列を連結するには、`+`演算子を使用します。これは、式内の最初の要素が文字列である限り、他の型の値との文字列連結にも機能します。

```kotlin
fun main() {
//sampleStart
    val s = "abc" + 1
    println(s + "def")
    // abc1def    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> ほとんどの場合、[文字列テンプレート](#string-templates)または[複数行文字列](#multiline-strings)を使用する方が、文字列連結よりも推奨されます。
>
{style="note"}

## 文字列リテラル

Kotlinには2種類の文字列リテラルがあります。

* [エスケープ文字列](#escaped-strings)
* [複数行文字列](#multiline-strings)

### エスケープ文字列

_エスケープ文字列_ は、エスケープ文字を含めることができます。
エスケープ文字列の例を次に示します。

```kotlin
val s = "Hello, world!
"
```

エスケープは、バックスラッシュ (`\`) を使用して慣例的な方法で行われます。
サポートされているエスケープシーケンスのリストについては、[Characters](characters.md)ページを参照してください。

### 複数行文字列

_複数行文字列_ は改行と任意のテキストを含めることができます。トリプルクォート (`"""`) で区切られ、
エスケープは不要で、改行やその他の任意の文字を含めることができます。

```kotlin
val text = """
    for (c in "foo")
        print(c)
    """
```

複数行文字列の行頭の空白を削除するには、[`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 関数を使用します。

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

デフォルトでは、パイプ記号 `|` がマージンプレフィックスとして使用されますが、別の文字を選択して、`trimMargin(">")`のようにパラメーターとして渡すこともできます。

## 文字列テンプレート

文字列リテラルには、_テンプレート式_ を含めることができます。これは評価され、その結果が文字列に連結されるコードの断片です。
テンプレート式が処理されると、Kotlinは式の結果に対して自動的に`.toString()`関数を呼び出し、文字列に変換します。テンプレート式はドル記号 (`$`) で始まり、変数名

```kotlin
fun main() {
//sampleStart
    val i = 10
    println("i = $i")
    // i = 10
    
    val letters = listOf("a","b","c","d","e")
    println("Letters: $letters")
    // Letters: [a, b, c, d, e]

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

または中括弧の式で構成されます。

```kotlin
fun main() {
//sampleStart
    val s = "abc"
    println("$s.length is ${s.length}")
    // abc.length is 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

テンプレートは複数行文字列とエスケープ文字列の両方で使用できます。ただし、複数行文字列はバックスラッシュエスケープをサポートしていません。
複数行文字列内で、[識別子](https://kotlinlang.org/docs/reference/grammar.html#identifiers)の先頭で許可されている記号の前にドル記号 `$` を挿入するには、次の構文を使用します。

```kotlin
val price = """
${'
    ```}_9.99
"""
```

> 文字列内の`${'
    ```}`シーケンスを避けるには、実験的な[マルチダラー文字列補間機能](#multi-dollar-string-interpolation)を使用できます。
>
{style="note"}

### マルチダラー文字列補間

> マルチダラー文字列補間は[実験的](components-stability.md#stability-levels-explained)な機能であり、オプトインが必要です（詳細は下記を参照）。
>
> これはいつでも変更される可能性があります。[YouTrack](https://youtrack.jetbrains.com/issue/KT-2425)でフィードバックをいただけると幸いです。
>
{style="warning"}

マルチダラー文字列補間を使用すると、補間をトリガーするために必要な連続するドル記号の数を指定できます。
補間とは、変数や式を文字列に直接埋め込むプロセスです。

1行文字列では[リテラルをエスケープ](#escaped-strings)できますが、
Kotlinの複数行文字列はバックスラッシュエスケープをサポートしていません。
ドル記号 (`$`) をリテラル文字として含めるには、文字列補間を防ぐために`${'
    ```}`構文を使用する必要があります。
このアプローチは、特に文字列に複数のドル記号が含まれる場合に、コードを読みにくくする可能性があります。

マルチダラー文字列補間は、
ドル記号を1行文字列と複数行文字列の両方でリテラル文字として扱えるようにすることで、これを簡素化します。
例:

```kotlin
val KClass<*>.jsonSchema : String
    get() = $"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta"
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

ここでは、`$$`プレフィックスは、文字列補間をトリガーするために2つの連続するドル記号が必要であることを指定しています。
単一のドル記号はリテラル文字として残ります。

補間をトリガーするドル記号の数を調整できます。
例えば、3つの連続するドル記号 (`$$$`) を使用すると、`$` と `$$` をリテラルとして残しつつ、`$$$` で補間を有効にすることができます。

```kotlin
val productName = "carrot"
val requestedData =
    $$"""{
      "currency": "$",
      "enteredAmount": "42.45 $",
      "$serviceField": "none",
      "product": "$$productName"
    }
    """

println(requestedData)
//{
//    "currency": "$",
//    "enteredAmount": "42.45 $",
//    "$serviceField": "none",
//    "product": "carrot"
//}
```

ここでは、`$$`プレフィックスにより、エスケープのために`${'
    ```}`構文を使用することなく、文字列に`$`と`$`を含めることができます。

この機能を有効にするには、コマンドラインで次のコンパイラオプションを使用します。

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

あるいは、Gradleビルドファイルの`compilerOptions {}`ブロックを更新します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

この機能は、単一ドル記号の文字列補間を使用している既存のコードには影響しません。
以前と同様に単一の`$`を使い続けることができ、文字列でリテラルのドル記号を処理する必要がある場合にマルチダラー記号を適用できます。

## 文字列の書式設定

> `String.format()`関数による文字列の書式設定は、Kotlin/JVMでのみ利用可能です。
>
{style="note"}

特定の要件に合わせて文字列を整形するには、[`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html) 関数を使用します。

`String.format()`関数は、フォーマット文字列と1つ以上の引数を受け取ります。フォーマット文字列には、指定された引数のためのプレースホルダーが1つ（`%`で示されます）含まれ、その後にフォーマット指定子が続きます。
フォーマット指定子は、対応する引数に対する書式設定の指示であり、フラグ、幅、精度、および変換タイプで構成されます。これら全体で、フォーマット指定子が出力の書式設定を決定します。一般的なフォーマット指定子には、整数用の`%d`、浮動小数点数用の`%f`、文字列用の`%s`があります。また、`argument_index$`構文を使用して、フォーマット文字列内で同じ引数を異なるフォーマットで複数回参照することもできます。

> 詳細な理解とフォーマット指定子の広範なリストについては、[JavaのClass Formatterドキュメント](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary)を参照してください。
>
{style="note"}

例を見てみましょう。

```kotlin
fun main() {
//sampleStart
    // 整数をフォーマットし、長さを7文字にするために先頭にゼロを追加します
    val integerNumber = String.format("%07d", 31416)
    println(integerNumber)
    // 0031416

    // 浮動小数点数をフォーマットし、+記号と小数点以下4桁で表示します
    val floatNumber = String.format("%+.4f", 3.141592)
    println(floatNumber)
    // +3.1416

    // 2つの文字列を大文字にフォーマットし、それぞれ1つのプレースホルダーを取ります
    val helloString = String.format("%S %S", "hello", "world")
    println(helloString)
    // HELLO WORLD
    
    // 負の数を括弧で囲んでフォーマットし、`argument_index$`を使用して同じ数を異なるフォーマット（括弧なし）で繰り返します。
    val negativeNumberInParentheses = String.format("%(d means %1\$d", -31416)
    println(negativeNumberInParentheses)
    //(31416) means -31416
//sampleEnd    
}
```
{interpolate-variables="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`String.format()`関数は文字列テンプレートと同様の機能を提供します。ただし、利用可能な書式設定オプションが多いため、`String.format()`関数はより多機能です。

さらに、フォーマット文字列を変数から割り当てることができます。これは、フォーマット文字列が変更される場合、例えばユーザーのロケールに依存するローカライズの場合などに役立ちます。

`String.format()`関数を使用する際は、引数の数や位置とそれに対応するプレースホルダーを不一致させやすいので注意してください。