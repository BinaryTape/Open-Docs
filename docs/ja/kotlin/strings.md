[//]: # (title: 文字列)

Kotlinの文字列は、[`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)型で表現されます。

> JVM上では、UTF-16エンコーディングの`String`型オブジェクトは、1文字あたり約2バイトを使用します。
>
{style="note"}

一般的に、文字列値は二重引用符 (`"`) で囲まれた文字のシーケンスです。

```kotlin
val str = "abcd 123"
```

文字列の要素は、インデックス操作 `s[i]` を介してアクセスできる文字です。
`for`ループを使用してこれらの文字を反復処理できます。

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

文字列は不変（immutable）です。一度文字列を初期化すると、その値を変更したり、新しい値を代入したりすることはできません。
文字列を変換するすべての操作は、新しい`String`オブジェクトとして結果を返し、元の文字列は変更されません。

```kotlin
fun main() {
//sampleStart
    val str = "abcd"
   
    // 新しいStringオブジェクトを作成して出力します
    println(str.uppercase())
    // ABCD
   
    // 元の文字列は同じままです
    println(str) 
    // abcd
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

文字列を連結するには、`+`演算子を使用します。これは、式内の最初の要素が文字列である限り、
他の型の値との文字列連結にも機能します。

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

_エスケープ文字列_は、エスケープ文字を含むことができます。
エスケープ文字列の例を次に示します。

```kotlin
val s = "Hello, world!
"
```

エスケープは、バックスラッシュ (`\`) を使用する従来の方法で行われます。
サポートされているエスケープシーケンスのリストについては、[文字](characters.md)のページを参照してください。

### 複数行文字列

_複数行文字列_は、改行や任意のテキストを含むことができます。三重引用符 (`"""`) で区切られ、
エスケープを含まず、改行やその他の文字を含むことができます。

```kotlin
val text = """
    for (c in "foo")
        print(c)
    """
```

複数行文字列の先頭の空白を削除するには、[`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html)関数を使用します。

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

デフォルトでは、パイプ記号 `|` がマージンプレフィックスとして使用されますが、`trimMargin(">")` のように別の文字を選択してパラメーターとして渡すこともできます。

## 文字列テンプレート

文字列リテラルには、_テンプレート式_を含めることができます。これは、評価され、その結果が文字列に連結されるコードの一部です。
テンプレート式が処理されるとき、Kotlinは式の結果を文字列に変換するために自動的に`.toString()`関数を呼び出します。
テンプレート式はドル記号 (`$`) で始まり、以下のいずれかで構成されます。

変数名:

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

または、中括弧内の式:

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

テンプレートは、複数行文字列とエスケープ文字列の両方で使用できます。ただし、複数行文字列はバックスラッシュエスケープをサポートしていません。
複数行文字列で[識別子](https://kotlinlang.org/docs/reference/grammar.html#identifiers)の先頭に許可されるシンボルの前にドル記号 (`$`) を挿入するには、次の構文を使用します。

```kotlin
val price = """
${'$'}9.99
"""
```

> 文字列内で`${'$'}`シーケンスを使用しないようにするには、試験段階の[複数ドル記号文字列補間 (Multi-dollar string interpolation) 機能](#multi-dollar-string-interpolation)を使用できます。
>
{style="note"}

### 複数ドル記号文字列補間

複数ドル記号文字列補間 (Multi-dollar string interpolation) を使用すると、補間をトリガーするために必要な連続するドル記号の数を指定できます。
補間とは、変数や式を文字列に直接埋め込むプロセスです。

単一行文字列では[リテラルをエスケープ](#escaped-strings)できますが、
Kotlinの複数行文字列はバックスラッシュエスケープをサポートしていません。
ドル記号 (`$`) をリテラル文字として含めるには、文字列補間を防ぐために`${'$'}`構文を使用する必要があります。
このアプローチは、特に文字列に複数のドル記号が含まれている場合、コードを読みにくくする可能性があります。

複数ドル記号文字列補間 (Multi-dollar string interpolation) は、
単一行文字列と複数行文字列の両方でドル記号をリテラル文字として扱えるようにすることで、これを簡素化します。
例：

```kotlin
val KClass<*>.jsonSchema : String
    get() = $"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta",
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

ここでは、`$$`プレフィックスは、文字列補間をトリガーするために2つの連続するドル記号が必要であることを指定しています。
単一のドル記号はリテラル文字のままです。

補間をトリガーするドル記号の数を調整できます。
例えば、3つの連続するドル記号 (`$$$`) を使用すると、`$`と`$$`がリテラルとして残り、`$$$`による補間が可能になります。

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

ここでは、`$$`プレフィックスにより、エスケープのために`${'$'}`構文を必要とせずに、文字列に`$`と`$$`を含めることができます。

複数ドル記号文字列補間は、単一ドル記号文字列補間を使用する既存のコードには影響しません。
これまでどおり単一の`$`を引き続き使用し、文字列内でリテラルドル記号を処理する必要がある場合に複数ドル記号を適用できます。

## 文字列フォーマット

> `String.format()`関数による文字列フォーマットは、Kotlin/JVMでのみ利用可能です。
>
{style="note"}

特定の要件に合わせて文字列をフォーマットするには、[`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html)関数を使用します。

`String.format()`関数は、フォーマット文字列と1つ以上の引数を受け入れます。フォーマット文字列には、指定された引数に対する1つのプレースホルダー（`%`で示されます）が、フォーマット指定子に続いて含まれます。
フォーマット指定子は、フラグ、幅、精度、変換タイプからなる、対応する引数に対するフォーマット指示です。これらフォーマット指定子全体で、出力のフォーマットを形成します。一般的なフォーマット指定子には、整数用の`%d`、浮動小数点数用の`%f`、文字列用の`%s`があります。また、`argument_index$`構文を使用して、フォーマット文字列内で同じ引数を異なるフォーマットで複数回参照することもできます。

> フォーマット指定子の詳細な理解と広範なリストについては、[JavaのClass Formatterドキュメント](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary)を参照してください。
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

    // 浮動小数点数をプラス記号と小数点以下4桁で表示するようにフォーマットします
    val floatNumber = String.format("%+.4f", 3.141592)
    println(floatNumber)
    // +3.1416

    // 2つの文字列を大文字にフォーマットし、それぞれが1つのプレースホルダーを取ります
    val helloString = String.format("%S %S", "hello", "world")
    println(helloString)
    // HELLO WORLD
    
    // 負の数を括弧で囲み、argument_index$を使用して同じ数を異なるフォーマット（括弧なし）で繰り返します。
    val negativeNumberInParentheses = String.format("%(d means %1\$d", -31416)
    println(negativeNumberInParentheses)
    //(31416) means -31416
//sampleEnd    
}
```
{interpolate-variables="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`String.format()`関数は文字列テンプレートと同様の機能を提供します。しかし、`String.format()`関数は、より多くのフォーマットオプションが利用できるため、より汎用性があります。

さらに、フォーマット文字列を変数から代入することができます。これは、例えばユーザーのロケールに依存するローカライズのケースなど、フォーマット文字列が変更される場合に役立ちます。

`String.format()`関数を使用する際には注意が必要です。引数の数や位置が対応するプレースホルダーと簡単に不一致になる可能性があるためです。