[//]: # (title: 競技プログラミングのためのKotlin)

このチュートリアルは、Kotlinをこれまで使用したことのない競技プログラマーと、競技プログラミングイベントに参加したことのないKotlin開発者の両方を対象としています。対応するプログラミングスキルがあることを前提としています。

[競技プログラミング (Competitive programming)](https://en.wikipedia.org/wiki/Competitive_programming) は、競技者が厳密に指定されたアルゴリズム問題を厳格な制約内で解決するプログラムを作成するマインドスポーツです。問題は、どのようなソフトウェア開発者でも解決でき、正しい解答を得るためにほとんどコードを必要としない簡単なものから、特別なアルゴリズム、データ構造、および多くの実践に関する知識を必要とする複雑なものまで多岐にわたります。Kotlinは競技プログラミングのために特別に設計されたものではありませんが、偶然にもこの分野にうまく適合します。プログラマーがコードを扱う際に書いたり読んだりする必要がある典型的なボイラープレートの量を、動的型付けスクリプト言語が提供するレベルにまで削減しつつ、静的型付け言語のツールとパフォーマンスを兼ね備えています。

Kotlinの開発環境をセットアップする方法については、[Kotlin/JVMを使ってみる](jvm-get-started.md)を参照してください。競技プログラミングでは、通常1つのプロジェクトが作成され、各問題の解答は1つのソースファイルに記述されます。

## 簡単な例: Reachable Numbers 問題

具体的な例を見てみましょう。

[Codeforces](https://codeforces.com/) Round 555は4月26日に3rd Division向けに開催され、これはあらゆる開発者が挑戦できる問題が含まれていたことを意味します。[このリンク](https://codeforces.com/contest/1157)を使用して問題を読むことができます。セットの中で最も簡単な問題は、[問題A: Reachable Numbers](https://codeforces.com/contest/1157/problem/A)です。これは、問題文に記述されている単純なアルゴリズムを実装することが求められます。

まず、任意の名前でKotlinソースファイルを作成することから始めます。`A.kt`で十分でしょう。
最初に、問題文で次のように指定されている関数を実装する必要があります。

関数f(x)を次のように定義します。xに1を加え、その結果の数値に末尾のゼロが少なくとも1つある限り、そのゼロを削除します。

Kotlinは実用的で主張の少ない言語であり、開発者をどちらか一方に押し付けることなく、命令型プログラミングスタイルと関数型プログラミングスタイルの両方をサポートしています。関数`f`は、[末尾再帰](functions.md#tail-recursive-functions)のようなKotlinの機能を使用して、関数型スタイルで実装できます。

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

あるいは、従来の[whileループ](control-flow.md)と、Kotlinで[var](basic-syntax.md#variables)で示される可変変数を使用して、関数`f`の命令型実装を記述することもできます。

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

Kotlinでは、型推論が広く使用されているため、多くの場所で型はオプションですが、すべての宣言にはコンパイル時に既知の明確に定義された静的型があります。

さて、残るは、入力を読み込み、問題文で求められているアルゴリズムの残りの部分を実装するmain関数を記述することです。すなわち、標準入力で与えられた初期の数値`n`に関数`f`を繰り返し適用しながら生成される異なる整数の数を計算します。

デフォルトでは、KotlinはJVM上で動作し、動的サイズ配列（`ArrayList`）、ハッシュベースのマップとセット（`HashMap`/`HashSet`）、ツリーベースの順序付けされたマップとセット（`TreeMap`/`TreeSet`）などの汎用コレクションとデータ構造を備えた豊富で効率的なコレクションライブラリに直接アクセスできます。関数`f`を適用しながら既に到達した値を追跡するために整数のハッシュセットを使用すると、問題の単純な命令型ソリューションのバージョンを以下に示すように記述できます。

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 and later" group-key="kotlin-1-6">

```kotlin
fun main() {
    var n = readln().toInt() // read integer from the input
    val reached = HashSet<Int>() // a mutable hash set 
    while (reached.add(n)) n = f(n) // iterate function f
    println(reached.size) // print answer to the output
}
```

競技プログラミングでは、入力形式が不正なケースを処理する必要はありません。競技プログラミングでは、入力形式は常に厳密に指定されており、実際に入力される内容は問題文の入力仕様から逸脱することはありません。そのため、Kotlinの[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html)関数を使用できます。この関数は、入力文字列が存在することをアサートし、そうでない場合は例外をスローします。同様に、[`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)関数は、入力文字列が整数でない場合に例外をスローします。

</tab>
<tab title="Earlier versions" group-key="kotlin-1-5">

```kotlin
fun main() {
    var n = readLine()!!.toInt() // read integer from the input
    val reached = HashSet<Int>() // a mutable hash set 
    while (reached.add(n)) n = f(n) // iterate function f
    println(reached.size) // print answer to the output
}
```

[readLine()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html)関数の呼び出し後のKotlinの[非nullアサーション演算子](null-safety.md#not-null-assertion-operator) `!!`の使用に注意してください。Kotlinの`readLine()`関数は、[null許容型](null-safety.md#nullable-types-and-non-nullable-types)である`String?`を返すように定義されており、入力の終端で`null`を返します。これにより、開発者は入力が不足しているケースを明示的に処理する必要があります。

競技プログラミングでは、入力形式が不正なケースを処理する必要はありません。競技プログラミングでは、入力形式は常に厳密に指定されており、実際に入力される内容は問題文の入力仕様から逸脱することはありません。非nullアサーション演算子 `!!` は本質的にその役割を果たします。つまり、入力文字列が存在することをアサートし、そうでない場合は例外をスローします。同様に、[String.toInt()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)も同様です。

</tab>
</tabs>

すべてのオンライン競技プログラミングイベントでは、事前に記述されたコードの使用が許可されているため、競技プログラミングに特化した独自のユーティリティ関数ライブラリを定義して、実際の解答コードを読み書きしやすくすることができます。その後、このコードを解答のテンプレートとして使用します。例えば、競技プログラミングで入力を読み込むための以下のヘルパー関数を定義できます。

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 and later" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // string line
private fun readInt() = readStr().toInt() // single int
// similar for other types you'd use in your solutions
```

</tab>
<tab title="Earlier versions" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // string line
private fun readInt() = readStr().toInt() // single int
// similar for other types you'd use in your solutions
```

</tab>
</tabs>

ここでの`private` [可視性修飾子](visibility-modifiers.md)の使用に注意してください。可視性修飾子の概念は競技プログラミングには全く関係ありませんが、これを使用することで、同じテンプレートに基づく複数の解答ファイルを、同じパッケージ内のパブリック宣言の衝突エラーなしに配置できます。

## 関数演算子の例: Long Number 問題

より複雑な問題の場合、Kotlinの豊富なコレクションに対する関数操作ライブラリは、ボイラープレートを最小限に抑え、コードを上から下、左から右へと流れるような線形データ変換パイプラインに変えるのに役立ちます。例えば、[問題B: Long Number](https://codeforces.com/contest/1157/problem/B)は、単純な貪欲アルゴリズムを実装するもので、このスタイルで1つの可変変数も使用せずに記述できます。

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 and later" group-key="kotlin-1-6">

```kotlin
fun main() {
    // read input
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // define local function f
    fun f(c: Char) = '0' + fl[c - '1']
    // greedily find first and last indices
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // compose and write the answer
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") +
        s.substring(j)
    println(ans)
}
```

</tab>
<tab title="Earlier versions" group-key="kotlin-1-5">

```kotlin
fun main() {
    // read input
    val n = readLine()!!.toInt()
    val s = readLine()!!
    val fl = readLine()!!.split(" ").map { it.toInt() }
    // define local function f
    fun f(c: Char) = '0' + fl[c - '1']
    // greedily find first and last indices
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // compose and write the answer
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</tab>
</tabs>

この凝縮されたコードでは、コレクション変換に加えて、ローカル関数や[エルビス演算子](null-safety.md#elvis-operator) `?:`のような便利なKotlin機能を見ることができます。これらは、「値が正であればそれを使用し、そうでなければ長さを利用する」といった[イディオム](idioms.md)を、`.takeIf { it >= 0 } ?: s.length`のような簡潔で読みやすい式で表現することを可能にします。しかし、Kotlinでは追加の可変変数を作成し、同じコードを命令型スタイルで記述することも全く問題ありません。

このような競技プログラミングのタスクで入力をより簡潔に読み込むには、以下のヘルパー入力読み込み関数リストを使用できます。

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 and later" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // string line
private fun readInt() = readStr().toInt() // single int
private fun readStrings() = readStr().split(" ") // list of strings
private fun readInts() = readStrings().map { it.toInt() } // list of ints
```

</tab>
<tab title="Earlier versions" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // string line
private fun readInt() = readStr().toInt() // single int
private fun readStrings() = readStr().split(" ") // list of strings
private fun readInts() = readStrings().map { it.toInt() } // list of ints
```

</tab>
</tabs>

これらのヘルパーを使用すると、入力読み込みのためのコード部分がよりシンプルになり、問題文の入力仕様に沿って行ごとに記述できます。

```kotlin
// read input
val n = readInt()
val s = readStr()
val fl = readInts()
```

競技プログラミングでは、コードは一度だけ書かれ、その後はサポートされないため、一般的な産業プログラミングの慣行よりも変数に短い名前を付けるのが通例であることに注意してください。しかし、これらの名前は通常、依然として覚えやすいものです。配列には`a`、インデックスには`i`、`j`など、テーブルの行と列の番号には`r`と`c`、座標には`x`と`y`などが使用されます。入力データには、問題文に与えられたものと同じ名前を使用する方が簡単です。しかし、より複雑な問題ではより多くのコードが必要となり、その結果、より長く自己説明的な変数名や関数名を使用することになります。

## その他のヒントとテクニック

競技プログラミングの問題では、しばしば次のような入力があります。

入力の最初の行には2つの整数`n`と`k`が含まれています

Kotlinでは、この行は整数のリストから[分解宣言](destructuring-declarations.md)を使用して、次のステートメントで簡潔にパースできます。

```kotlin
val (n, k) = readInts()
```

構造化されていない入力形式をパースするために、JVMの`java.util.Scanner`クラスを使用したい誘惑に駆られるかもしれません。KotlinはJVMライブラリとの連携がうまくいくように設計されているため、Kotlinでのそれらの使用は非常に自然に感じられます。しかし、`java.util.Scanner`が非常に遅いことに注意してください。実際、非常に遅いため、10^5以上の整数をこれを使ってパースすると、一般的な2秒の時間制限に収まらない可能性があります。一方、Kotlinの単純な`split(" ").map { it.toInt() }`であれば処理できます。

Kotlinで出力を記述することは、通常、[println(...)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html)の呼び出しとKotlinの[文字列テンプレート](strings.md#string-templates)の使用によって簡単に行えます。しかし、出力が10^5行以上のオーダーになる場合は注意が必要です。Kotlinでは各行の後に自動的に出力がフラッシュされるため、これほど多くの`println`呼び出しを発行するのは遅すぎます。配列やリストから多数の行を書き出すより速い方法は、区切り文字として`"
"`を使用して[joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html)関数を使用することです。例えば以下のようになります。

```kotlin
println(a.joinToString("
")) // each element of array/list of a separate line
```

## Kotlinを学ぶ

Kotlinは、特にJavaを既に知っている人にとって学びやすい言語です。
ソフトウェア開発者向けのKotlinの基本構文に関する短い導入は、ウェブサイトのリファレンスセクションの[基本構文](basic-syntax.md)から直接見つけることができます。

IDEAには、組み込みの[Java-to-Kotlin変換ツール](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html)があります。Javaに慣れている人が対応するKotlinの構文構造を学ぶのに使用できますが、完璧ではないため、Kotlinに慣れ親しみ、[Kotlinイディオム](idioms.md)を学ぶ価値はまだあります。

Kotlinの構文とKotlin標準ライブラリのAPIを学習するための優れたリソースは、[Kotlin Koans](koans.md)です。