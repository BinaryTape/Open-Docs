---
title: 文字列
---
Kotlinの文字列は、[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)型で表現されます。

:::note
JVM上では、UTF-16エンコーディングの`String`型オブジェクトは、1文字あたり約2バイトを使用します。

:::

一般的に、文字列の値はダブルクォーテーション（`"`）で囲まれた文字のシーケンスです。

```kotlin
val str = "abcd 123"
```

文字列の要素は文字であり、インデックス操作 `s[i]` でアクセスできます。
`for` ループでこれらの文字を反復処理できます。

```kotlin
fun main() {
    val str = "abcd" 

    for (c in str) {
        println(c)
    }

}
```

文字列はイミュータブル（不変）です。一度文字列を初期化すると、その値を変更したり、新しい値を割り当てたりすることはできません。
文字列を変換するすべての操作は、新しい `String` オブジェクトで結果を返し、元の文字列は変更されません。

```kotlin
fun main() {

    val str = "abcd"
   
    // 新しい String オブジェクトを作成して出力します
    println(str.uppercase())
    // ABCD
   
    // 元の文字列は変わりません
    println(str) 
    // abcd

}
```

文字列を連結するには、`+` 演算子を使用します。これは、式内の最初の要素が文字列である限り、文字列と他の型の値を連結する場合にも機能します。

```kotlin
fun main() {

    val s = "abc" + 1
    println(s + "def")
    // abc1def    

}
```

:::note
ほとんどの場合、[文字列テンプレート](#string-templates)または[複数行文字列](#multiline-strings)を使用する方が、文字列連結よりも推奨されます。

:::

## 文字列リテラル

Kotlinには、次の2種類の文字列リテラルがあります。

* [エスケープ文字列](#escaped-strings)
* [複数行文字列](#multiline-strings)

### エスケープ文字列

_エスケープ文字列_は、エスケープされた文字を含むことができます。
エスケープ文字列の例を次に示します。

```kotlin
val s = "Hello, world!
"
```

エスケープは、バックスラッシュ（`\`)を使用して従来の方法で行われます。
サポートされているエスケープシーケンスのリストについては、[文字 (Characters)](characters)のページを参照してください。

### 複数行文字列

_複数行文字列_は、改行と任意のテキストを含むことができます。三重引用符（`"""`）で区切られ、
エスケープを含まず、改行やその他の文字を含むことができます。

```kotlin
val text = """
    for (c in "foo")
        print(c)
    """
```

複数行文字列から先頭の空白を削除するには、[`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html)関数を使用します。

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

デフォルトでは、パイプ記号 `|` がマージンプレフィックスとして使用されますが、別の文字を選択して `trimMargin(">")` のようにパラメータとして渡すことができます。

## 文字列テンプレート

文字列リテラルには、_テンプレート式_を含めることができます。これは、評価され、その結果が文字列に連結されるコードの一部です。
テンプレート式が処理されると、Kotlinは自動的に式の結果に対して `.toString()` 関数を呼び出して、
それを文字列に変換します。テンプレート式はドル記号（`$`）で始まり、変数名で構成されます。

```kotlin
fun main() {

    val i = 10
    println("i = $i") 
    // i = 10
    
    val letters = listOf("a","b","c","d","e")
    println("Letters: $letters") 
    // Letters: [a, b, c, d, e]

}
```

または、中括弧で囲まれた式です。

```kotlin
fun main() {

    val s = "abc"
    println("$s.length is ${s.length}") 
    // abc.length is 3

}
```

テンプレートは、複数行文字列とエスケープ文字列の両方で使用できます。ただし、複数行文字列はバックスラッシュエスケープをサポートしていません。
ドル記号（`$`）を複数行文字列に挿入するには、
[識別子](https://kotlinlang.org/docs/reference/grammar.html#identifiers)の先頭で許可されている記号の前に、
次の構文を使用します。

```kotlin
val price = """
${'$'}9.99
"""
```

:::note
文字列内の`${'$'}`シーケンスを回避するには、Experimental（試験的）な[複数ドル記号文字列補完機能](#multi-dollar-string-interpolation)を使用できます。

:::

### 複数ドル記号文字列補完

:::note
複数ドル記号文字列補完は[Experimental（試験的）](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained)であり、オプトインが必要です（詳細は下記参照）。

これはいつでも変更される可能性があります。[YouTrack](https://youtrack.jetbrains.com/issue/KT-2425)でフィードバックをお寄せいただければ幸いです。

複数ドル記号文字列補完を使用すると、補完をトリガーするために必要な連続するドル記号の数を指定できます。
補完とは、変数または式を文字列に直接埋め込むプロセスです。

[エスケープされたリテラル](#escaped-strings)をシングルライン文字列に使用できますが、
Kotlinの複数行文字列はバックスラッシュエスケープをサポートしていません。
ドル記号（`$`）をリテラル文字として含めるには、文字列補完を防ぐために`${'$'}`構文を使用する必要があります。
このアプローチは、特に文字列に複数のドル記号が含まれている場合、コードの可読性を低下させる可能性があります。

複数ドル記号文字列補完は、ドル記号をシングルライン文字列と複数行文字列の両方でリテラル文字として扱うことができるようにすることで、これを簡素化します。
例：

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

ここで、`$`プレフィックスは、文字列補完をトリガーするために2つの連続するドル記号が必要であることを指定します。
単一のドル記号はリテラル文字のままです。

補完をトリガーするドル記号の数を調整できます。
たとえば、3つの連続するドル記号（`$$$`）を使用すると、`$`と`$`をリテラルとして保持しながら、`$$$`で補完を有効にできます。

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

ここで、`$$$`プレフィックスを使用すると、エスケープに`${'$'}`構文を必要とせずに、文字列に`$`と`$`を含めることができます。

この機能を有効にするには、コマンドラインで次のコンパイラオプションを使用します。

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

または、Gradleビルドファイルの `compilerOptions {}` ブロックを更新します。

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

この機能は、シングルドル記号文字列補完を使用する既存のコードには影響しません。
これまでどおり単一の`$`を引き続き使用し、文字列内のリテラルドル記号を処理する必要がある場合は、複数ドル記号を適用できます。

## 文字列フォーマット

`String.format()` 関数を使用した文字列フォーマットは、Kotlin/JVMでのみ使用できます。

:::

特定の要件に合わせて文字列をフォーマットするには、[`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html)
関数を使用します。

`String.format()`関数は、フォーマット文字列と1つ以上の引数を受け入れます。フォーマット文字列には、特定の引数に対する1つのプレースホルダー（`%`で示される）が含まれ、その後にフォーマット指定子が続きます。
フォーマット指定子は、フラグ、幅、精度、および
変換型で構成される、それぞれの引数のフォーマット命令です。まとめて、フォーマット指定子は出力のフォーマットを形成します。一般的なフォーマット指定子には、
整数用の `%d`、浮動小数点数用の `%f`、文字列用の `%s` などがあります。`argument_index$`構文を使用して、
フォーマット文字列内で異なるフォーマットで同じ引数を複数回参照することもできます。

:::note
フォーマット指定子の詳細な理解と広範なリストについては、[JavaのClass Formatterのドキュメント](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary)を参照してください。

:::

例を見てみましょう。

```kotlin
fun main() { 

    // 整数をフォーマットし、先頭にゼロを追加して長さ7文字にします
    val integerNumber = String.format("%07d", 31416)
    println(integerNumber)
    // 0031416

    // 浮動小数点数をフォーマットして、+記号と小数点以下4桁で表示します
    val floatNumber = String.format("%+.4f", 3.141592)
    println(floatNumber)
    // +3.1416

    // 2つの文字列を大文字にフォーマットし、それぞれ1つのプレースホルダーを使用します
    val helloString = String.format("%S %S", "hello", "world")
    println(helloString)
    // HELLO WORLD
    
    // 負の数を括弧で囲むようにフォーマットし、`argument_index$`を使用して同じ数を別のフォーマット（括弧なし）で繰り返します。
    val negativeNumberInParentheses = String.format("%(d means %1\$d", -31416)
    println(negativeNumberInParentheses)
    //(31416) means -31416

}
```

`String.format()`関数は、文字列テンプレートと同様の機能を提供します。ただし、
`String.format()`関数の方が、より多くのフォーマットオプションが利用できるため、より汎用性があります。

さらに、変数からフォーマット文字列を割り当てることができます。これは、ユーザーロケールに依存するローカリゼーションのケースなど、フォーマット文字列が変更される場合に役立ちます。

`String.format()`関数を使用する場合は、引数の数や位置と、対応するプレースホルダーとの不一致が簡単に発生する可能性があるため、注意してください。