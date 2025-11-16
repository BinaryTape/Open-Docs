[//]: # (title: 競技プログラミングのためのKotlin)

このチュートリアルは、Kotlinをこれまで使用したことのない競技プログラマーと、競技プログラミングイベントにこれまで参加したことのないKotlin開発者の両方を対象としています。対応するプログラミングスキルがあることを前提としています。

[競技プログラミング (Competitive programming)](https://en.wikipedia.org/wiki/Competitive_programming) は、競技者が厳格な制約内で精密に指定されたアルゴリズム問題を解決するためにプログラムを書く頭脳スポーツです。問題は、あらゆるソフトウェア開発者が解決でき、正しいソリューションを得るためにほとんどコードを必要としない単純なものから、特別なアルゴリズム、データ構造の知識、および多くの練習を必要とする複雑なものまで多岐にわたります。Kotlinは競技プログラミングのために特別に設計されたわけではありませんが、この分野に偶然にもうまく適合しており、プログラマーがコードを扱う際に書いたり読んだりする必要がある典型的な[ボイラープレート (boilerplate)](https://en.wikipedia.org/wiki/Boilerplate_code) の量を、動的型付けスクリプト言語が提供するレベルまで削減しつつ、静的型付け言語のツールとパフォーマンスを兼ね備えています。

IntelliJ IDEAでKotlinプロジェクトを作成する方法の詳細については、[コンソールアプリの作成](jvm-get-started.md)チュートリアルを参照してください。競技プログラミングでは、通常、単一のプロジェクトが作成され、各問題のソリューションは単一のソースファイルに記述されます。

## 簡単な例：到達可能な数値問題

具体的な例を見てみましょう。

[Codeforces](https://codeforces.com/) Round 555は4月26日に第3ディビジョン向けに開催されました。これは、あらゆる開発者が試すのに適した問題があったことを意味します。問題を読むには[このリンク](https://codeforces.com/contest/1157)を使用できます。セットの中で最も簡単な問題は、[問題A: 到達可能な数値 (Reachable Numbers)](https://codeforces.com/contest/1157/problem/A) です。これは、問題文に記述されている簡単なアルゴリズムを実装するよう求めます。

まず、Kotlinソースファイルを任意の名前で作成することから始めます。`A.kt`で十分でしょう。
最初に、問題文で次のように指定されている関数を実装する必要があります。

関数 f(x) を次のように定義します。x に 1 を加算し、結果の数値に末尾のゼロが少なくとも1つ存在する限り、そのゼロを削除します。

Kotlin は実用的で特定の意見に偏らない言語であり、開発者をどちらか一方に押し付けることなく、命令型プログラミングスタイルと関数型プログラミングスタイルの両方をサポートしています。関数 `f` を、[末尾再帰 (tail recursion)](functions.md#tail-recursive-functions) のようなKotlinの機能を使って、関数型スタイルで実装できます。

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

あるいは、従来の[whileループ (while loop)](control-flow.md) とKotlinで[var](basic-syntax.md#variables) で示される[可変変数 (mutable variables)](basic-syntax.md#variables) を使って、関数 `f` の命令型実装を書くこともできます。

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

Kotlinでは、[型推論 (type-inference)](basic-syntax.md#type-inference) が広く使用されているため、多くの場所で型の指定はオプションですが、すべての宣言はコンパイル時に既知の明確な静的型を持っています。

残るは、入力を読み込み、問題文が要求するアルゴリズムの残りの部分を実装する main 関数を書くことです — 標準入力で与えられた初期の数値 `n` に関数 `f` を繰り返し適用する際に生成される異なる整数の数を計算します。

デフォルトでは、KotlinはJVM上で動作し、動的サイズ配列 (`ArrayList`)、ハッシュベースのマップとセット (`HashMap`/`HashSet`)、ツリーベースの順序付きマップとセット (`TreeMap`/`TreeSet`) のような汎用コレクションやデータ構造を備えた、豊富で効率的な[コレクションライブラリ (collections library)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/) に直接アクセスできます。関数 `f` を適用する際にすでに到達した値を追跡するために整数のハッシュセットを使用すると、問題に対する簡単な命令型バージョンのソリューションを以下に示すように記述できます。

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0以降" group-key="kotlin-1-6">

```kotlin
fun main() {
    var n = readln().toInt() // 入力から整数を読み込む
    val reached = HashSet<Int>() // 可変ハッシュセット
    while (reached.add(n)) n = f(n) // 関数fを反復
    println(reached.size) // 出力に解答を表示
}
```

競技プログラミングでは、不正な形式の入力を処理する必要はありません。入力形式は常に厳密に指定されており、実際の入力が問題文の入力仕様から逸脱することはありません。そのため、Kotlinの[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html)関数を使用できます。これは入力文字列が存在することをアサートし、存在しない場合は例外をスローします。同様に、[`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)関数は、入力文字列が整数でない場合に例外をスローします。

</tab>
<tab title="以前のバージョン" group-key="kotlin-1-5">

```kotlin
fun main() {
    var n = readLine()!!.toInt() // 入力から整数を読み込む
    val reached = HashSet<Int>() // 可変ハッシュセット
    while (reached.add(n)) n = f(n) // 関数fを反復
    println(reached.size) // 出力に解答を表示
}
```

`readLine()` 関数呼び出し後のKotlinの[nullアサーション演算子 (null-assertion operator)](null-safety.md#not-null-assertion-operator) `!!` の使用に注目してください。Kotlinの`readLine()`関数は[null許容型 (nullable type)](null-safety.md#nullable-types-and-non-nullable-types) `String?` を返すように定義されており、入力の終わりに`null`を返します。これにより、開発者は入力がない場合を明示的に処理するよう強制されます。

競技プログラミングでは、不正な形式の入力を処理する必要はありません。入力形式は常に厳密に指定されており、実際の入力が問題文の入力仕様から逸脱することはありません。nullアサーション演算子 `!!` が本質的に行っているのは、入力文字列が存在することをアサートし、存在しない場合は例外をスローすることです。同様に、[String.toInt()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)も同様です。

</tab>
</tabs>

すべてのオンライン競技プログラミングイベントでは、事前に書かれたコードの使用が許可されているため、競技プログラミングに特化した独自のユーティリティ関数ライブラリを定義して、実際のソリューションコードをいくらか読み書きしやすくすることができます。そして、このコードをソリューションのテンプレートとして使用します。例えば、競技プログラミングで入力を読み込むための以下のヘルパー関数を定義できます。

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0以降" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 文字列行
private fun readInt() = readStr().toInt() // 単一の整数
// ソリューションで使用する他の型についても同様
```

</tab>
<tab title="以前のバージョン" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 文字列行
private fun readInt() = readStr().toInt() // 単一の整数
// ソリューションで使用する他の型についても同様
```

</tab>
</tabs>

ここでの`private` [可視性修飾子 (visibility modifier)](visibility-modifiers.md) の使用に注目してください。可視性修飾子の概念は競技プログラミングには全く関係ありませんが、同じテンプレートに基づいて複数のソリューションファイルを配置しても、同じパッケージ内で公開宣言が競合するエラーが発生しないようにすることができます。

## 関数演算子の例：長い数値問題

より複雑な問題では、Kotlinの豊富なコレクションに対する[関数型操作 (functional operations)](https://kotlinlang.org/docs/reference/collection-overview.html#functional-operations) ライブラリが、ボイラープレートを最小限に抑え、コードを線形のトップダウンおよび左から右への流れるようなデータ変換パイプラインに変えるのに役立ちます。例えば、[問題B: 長い数値 (Long Number)](https://codeforces.com/contest/1157/problem/B) は、実装が簡単な[貪欲アルゴリズム (greedy algorithm)](https://en.wikipedia.org/wiki/Greedy_algorithm) を使用しており、このスタイルで単一の可変変数を使用せずに記述できます。

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0以降" group-key="kotlin-1-6">

```kotlin
fun main() {
    // 入力を読み込む
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // ローカル関数fを定義
    fun f(c: Char) = '0' + fl[c - '1']
    // 貪欲に最初と最後のインデックスを見つける
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 回答を構成して書き込む
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") +
        s.substring(j)
    println(ans)
}
```

</tab>
<tab title="以前のバージョン" group-key="kotlin-1-5">

```kotlin
fun main() {
    // 入力を読み込む
    val n = readLine()!!.toInt()
    val s = readLine()!!
    val fl = readLine()!!.split(" ").map { it.toInt() }
    // ローカル関数fを定義
    fun f(c: Char) = '0' + fl[c - '1']
    // 貪欲に最初と最後のインデックスを見つける
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 回答を構成して書き込む
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</tab>
</tabs>

この高密度なコードでは、コレクション変換に加えて、[ローカル関数 (local functions)](functions.md#local-functions) や[Elvis演算子 (Elvis operator)](null-safety.md#elvis-operator) `?:` のような便利なKotlinの機能を見ることができます。これらは、「値が正であればそれを使用し、そうでなければ長さを利用する」といった[イディオム (idioms)](idioms.md) を、`.takeIf { it >= 0 } ?: s.length` のような簡潔で読みやすい表現で記述することを可能にします。しかし、Kotlinでは、追加の可変変数を作成し、同じコードを命令型スタイルで表現することも全く問題ありません。

このような競技プログラミングタスクで入力をより簡潔に読み込むには、以下のヘルパー入力読み込み関数リストを使用できます。

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0以降" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 文字列行
private fun readInt() = readStr().toInt() // 単一の整数
private fun readStrings() = readStr().split(" ") // 文字列のリスト
private fun readInts() = readStrings().map { it.toInt() } // 整数のリスト
```

</tab>
<tab title="以前のバージョン" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 文字列行
private fun readInt() = readStr().toInt() // 単一の整数
private fun readStrings() = readStr().split(" ") // 文字列のリスト
private fun readInts() = readStrings().map { it.toInt() } // 整数のリスト
```

</tab>
</tabs>

これらのヘルパーを使用すると、入力読み込みのコード部分がよりシンプルになり、問題文の入力仕様に1行ずつ密接に従うようになります。

```kotlin
// 入力を読み込む
val n = readInt()
val s = readStr()
val fl = readInts()
```

競技プログラミングでは、コードは一度だけ書かれ、その後はサポートされないため、産業プログラミングの慣行で一般的な場合よりも変数に短い名前を付けるのが慣例であることに注意してください。しかし、これらの名前は通常、依然として記憶しやすいものです。例えば、配列には `a`、インデックスには `i`、`j` など、テーブルの行と列の番号には `r` と `c`、座標には `x` と `y` などです。入力データには問題文で与えられたものと同じ名前を維持する方が簡単です。ただし、より複雑な問題ではより多くのコードが必要となり、その結果、より長く自己説明的な変数名や関数名を使用することになります。

## さらにヒントとコツ

競技プログラミングの問題では、しばしば次のような入力があります。

入力の最初の行には2つの整数 `n` と `k` が含まれています

Kotlinでは、この行は整数のリストから[分割代入 (destructuring declaration)](destructuring-declarations.md) を使用して、以下の文で簡潔にパースできます。

```kotlin
val (n, k) = readInts()
```

JVMの`java.util.Scanner`クラスを使用して、あまり構造化されていない入力形式をパースしたくなるかもしれません。KotlinはJVMライブラリとの相互運用性が高く設計されているため、Kotlinでのそれらの使用は非常に自然に感じられます。しかし、`java.util.Scanner`は非常に遅いことに注意してください。実際、これで10<sup>5</sup>個以上の整数をパースすると、通常の2秒の時間制限に収まらない可能性があり、これはKotlinのシンプルな`split(" ").map { it.toInt() }`で処理できます。

Kotlinでの出力は、通常、[println(...)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) の呼び出しとKotlinの[文字列テンプレート (string templates)](strings.md#string-templates) を使用すれば簡単です。ただし、出力が10<sup>5</sup>行以上のオーダーになる場合は注意が必要です。Kotlinでは各行の後に自動的に出力がフラッシュされるため、これほど多くの`println`呼び出しを発行するのは遅すぎます。配列やリストから多くの行を書き出すより高速な方法は、`"
"` を区切り文字として[joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 関数を使用することです。例えば、以下のようになります。

```kotlin
println(a.joinToString("
")) // 配列/リストの各要素が別々の行になる
```

## Kotlinを学ぶ

Kotlinは、特にJavaをすでに知っている人にとっては学習しやすい言語です。ソフトウェア開発者向けのKotlinの基本構文に関する短い導入は、ウェブサイトのリファレンスセクションの[基本構文 (basic syntax)](basic-syntax.md)から直接見つけることができます。

IDEAには、組み込みの[Java-to-Kotlinコンバーター (Java-to-Kotlin converter)](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html)があります。これはJavaに慣れている人が対応するKotlinの構文構造を学ぶのに使用できますが、完璧ではありません。そのため、Kotlinに慣れ親しみ、[Kotlinのイディオム (Kotlin idioms)](idioms.md) を学ぶ価値はまだあります。

Kotlinの構文とKotlin標準ライブラリのAPIを学習するための優れたリソースは、[Kotlin Koans](koans.md)です。