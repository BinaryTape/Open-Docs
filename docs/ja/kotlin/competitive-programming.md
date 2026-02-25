[//]: # (title: 競技プログラミングのための Kotlin)

このチュートリアルは、Kotlin を使用したことがない競技プログラマーと、競技プログラミングのイベントに参加したことがない Kotlin 開発者の両方を対象としています。
プログラミングに関する相応のスキルがあることを前提としています。

[競技プログラミング (Competitive programming)](https://en.wikipedia.org/wiki/Competitive_programming) は、
厳格な制約の下で、正確に指定されたアルゴリズムの問題を解くプログラムを作成するマインドスポーツです。
問題は、ソフトウェア開発者であれば誰でも解け、正解を得るために必要なコードが少なくて済む単純なものから、
特別なアルゴリズムやデータ構造の知識、そして多くの練習を必要とする複雑なものまで多岐にわたります。
Kotlin は競技プログラミング専用に設計されたわけではありませんが、副次的にこの領域に適しています。
プログラマーがコードを書いたり読んだりする際に必要な一般的なボイラープレートの量を、
動的型付けスクリプト言語に近いレベルまで削減しつつ、静的型付け言語のツールとパフォーマンスを兼ね備えています。

IntelliJ IDEA で Kotlin プロジェクトを作成する方法の詳細については、[コンソールアプリの作成](jvm-get-started.md) チュートリアルを参照してください。
競技プログラミングでは、通常 1 つのプロジェクトを作成し、各問題の解答を 1 つのソースファイルに記述します。

## シンプルな例: Reachable Numbers 問題

具体的な例を見てみましょう。

[Codeforces](https://codeforces.com/) Round 555 は、4月26日に第3部門（Division 3）向けに開催されました。
これは、開発者が誰でも挑戦できるような問題が出題されたことを意味します。
[このリンク](https://codeforces.com/contest/1157) から問題を読むことができます。
このセットの中で最も単純な問題は [問題 A: Reachable Numbers](https://codeforces.com/contest/1157/problem/A) です。
これは、問題文に記載された素直なアルゴリズムを実装することを求めています。

まずは、適当な名前の Kotlin ソースファイルを作成して解き始めましょう。`A.kt` で良いでしょう。
まず、問題文で次のように指定されている関数を実装する必要があります：

関数 f(x) を次のように定義します：x に 1 を加え、その結果の数値の末尾に 0 が 1 つ以上ある間、その 0 を削除します。

Kotlin は実用的で柔軟な言語であり、開発者にどちらかのスタイルを強いることなく、命令型と関数型の両方のプログラミングスタイルをサポートしています。
関数 `f` は、[末尾再帰 (tail recursion)](functions.md#tail-recursive-functions) などの Kotlin の機能を使用して、関数型スタイルで実装できます。

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

あるいは、伝統的な [while ループ](control-flow.md) と、Kotlin で [var](basic-syntax.md#variables) と表記される可変変数を使用して、命令型の実装を書くこともできます。

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

Kotlin では、型推論が広範囲で使用されるため、多くの場所で型を省略できますが、すべての宣言はコンパイル時に既知である明確に定義された静的な型を持っています。

あとは、入力を読み込み、問題文が求めている残りのアルゴリズムを実装する main 関数を書くだけです。
標準入力で与えられる初期値 `n` に対して関数 `f` を繰り返し適用したときに生成される、異なる整数の個数を計算します。

デフォルトでは、Kotlin は JVM 上で動作し、動的サイズの配列 (`ArrayList`)、ハッシュベースのマップとセット (`HashMap`/`HashSet`)、ツリーベースのソート済みマップとセット (`TreeMap`/`TreeSet`) など、汎用的なコレクションやデータ構造を備えた豊富で効率的なコレクションライブラリに直接アクセスできます。
整数のハッシュセットを使用して、関数 `f` を適用する際にすでに到達した値を追跡することで、この問題に対する素直な命令型バージョンの解答は次のように書けます。

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 以降" group-key="kotlin-1-6">

```kotlin
fun main() {
    var n = readln().toInt() // 入力から整数を読み込む
    val reached = HashSet<Int>() // 可変ハッシュセット 
    while (reached.add(n)) n = f(n) // 関数 f を繰り返す
    println(reached.size) // 答えを出力する
}
```

競技プログラミングでは、入力形式が正しくない場合を処理する必要はありません。
入力形式は常に厳密に指定されており、実際の入力が問題文の入力指定から外れることはありません。
そのため、Kotlin の [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 関数を使用できます。
この関数は入力文字列が存在することを前提とし、存在しない場合は例外をスローします。
同様に、[`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) 関数は入力文字列が整数でない場合に例外をスローします。

</tab>
<tab title="以前のバージョン" group-key="kotlin-1-5">

```kotlin
fun main() {
    var n = readLine()!!.toInt() // 入力から整数を読み込む
    val reached = HashSet<Int>() // 可変ハッシュセット 
    while (reached.add(n)) n = f(n) // 関数 f を繰り返す
    println(reached.size) // 答えを出力する
}
```

[`readLine()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html) 関数呼び出しの後に Kotlin の [非 null 表明演算子 (null-assertion operator)](null-safety.md#not-null-assertion-operator) `!!` を使用していることに注意してください。
Kotlin の `readLine()` 関数は、[null 許容型 (nullable type)](null-safety.md#nullable-types-and-non-nullable-types) `String?` を返すように定義されており、入力の終わりに `null` を返します。これにより、開発者は入力がない場合を明示的に処理することを強制されます。

競技プログラミングでは、入力形式が正しくない場合を処理する必要はありません。
競技プログラミングにおいて、入力形式は常に厳密に指定されており、実際の入力が問題文の入力指定から外れることはありません。
非 null 表明演算子 `!!` が本質的に行っているのは、入力文字列が存在することをアサートし、存在しない場合は例外をスローすることです。
同様に、[String.toInt()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) も同様の動作をします。

</tab>
</tabs>

すべてのオンライン競技プログラミングイベントでは、事前に作成したコードの使用が許可されているため、競技プログラミング向けのユーティリティ関数のライブラリを独自に定義して、実際の解答コードを読み書きしやすくすることができます。
その後、このコードを解答のテンプレートとして使用します。
たとえば、競技プログラミングで入力を読み込むための次のようなヘルパー関数を定義できます。

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 以降" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 文字列の 1 行
private fun readInt() = readStr().toInt() // 単一の Int
// 解答で使用する他の型についても同様
```

</tab>
<tab title="以前のバージョン" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 文字列の 1 行
private fun readInt() = readStr().toInt() // 単一の Int
// 解答で使用する他の型についても同様
```

</tab>
</tabs>

ここで `private` [可視性修飾子 (visibility modifier)](visibility-modifiers.md) を使用していることに注意してください。
可視性修飾子の概念自体は競技プログラミングでは重要ではありませんが、同じパッケージ内で公開宣言が衝突してエラーになることなく、同じテンプレートに基づいた複数の解答ファイルを配置できるようになります。

## 関数型演算子の例: Long Number 問題

より複雑な問題では、コレクションに対する Kotlin の豊富な関数型操作のライブラリが、ボイラープレートを最小限に抑え、コードを上から下へ、左から右へ流れるようなデータ変換パイプラインにするのに役立ちます。
たとえば、[問題 B: Long Number](https://codeforces.com/contest/1157/problem/B) は、単純な貪欲法（greedy algorithm）で実装できる問題であり、可変変数を 1 つも使わずにこのスタイルで記述できます。

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 以降" group-key="kotlin-1-6">

```kotlin
fun main() {
    // 入力を読み込む
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // ローカル関数 f を定義
    fun f(c: Char) = '0' + fl[c - '1']
    // 最初と最後のインデックスを貪欲に探す
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 回答を組み立てて出力
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
    // ローカル関数 f を定義
    fun f(c: Char) = '0' + fl[c - '1']
    // 最初と最後のインデックスを貪欲に探す
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 回答を組み立てて出力
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</tab>
</tabs>

この凝縮されたコードでは、コレクションの変換に加えて、ローカル関数や [エルビス演算子 (elvis operator)](null-safety.md#elvis-operator) `?:` といった便利な Kotlin の機能を確認できます。
これらにより、「値が正であればその値を取り、そうでなければ length を使う」といった [イディオム (idioms)](idioms.md) を、`.takeIf { it >= 0 } ?: s.length` のように簡潔で読みやすい式で表現できます。
もちろん、追加の可変変数を作成し、命令型スタイルで同じコードを記述しても、Kotlin では全く問題ありません。

このような競技プログラミングのタスクで入力を読み込むのをより簡潔にするために、次のような入力読み込み用のヘルパー関数のリストを用意しておくとよいでしょう。

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 以降" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 文字列の 1 行
private fun readInt() = readStr().toInt() // 単一の Int
private fun readStrings() = readStr().split(" ") // 文字列のリスト
private fun readInts() = readStrings().map { it.toInt() } // Int のリスト
```

</tab>
<tab title="以前のバージョン" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 文字列の 1 行
private fun readInt() = readStr().toInt() // 単一の Int
private fun readStrings() = readStr().split(" ") // 文字列のリスト
private fun readInts() = readStrings().map { it.toInt() } // Int のリスト
```

</tab>
</tabs>

これらのヘルパーを使用すると、入力を読み込むコード部分はよりシンプルになり、問題文の入力指定に 1 行ずつ密接に従うことができます。

```kotlin
// 入力を読み込む
val n = readInt()
val s = readStr()
val fl = readInts()
```

競技プログラミングでは、コードは一度だけ書かれ、その後メンテナンスされることはないため、産業用のプログラミングの実践よりも変数名を短くするのが一般的です。
しかし、これらの名前は通常、覚えやすいもの（mnemonic）になっています。配列には `a`、インデックスには `i`, `j` など、テーブルの行番号と列番号には `r` と `c`、座標には `x` と `y` などです。
問題文で与えられているのと同じ名前を入力データに使用するのが簡単です。
ただし、より複雑な問題ではより多くのコードが必要になるため、より長い自己説明的な変数名や関数名を使用することにつながります。

## その他のヒントとコツ

競技プログラミングの問題では、しばしば次のような入力があります：

入力の最初の行には、2 つの整数 `n` と `k` が含まれています。

Kotlin では、整数リストからの [分解宣言 (destructuring declaration)](destructuring-declarations.md) を使用して、この行を簡潔に解析できます。

```kotlin
val (n, k) = readInts()
```

構造化されていない入力形式を解析するために JVM の `java.util.Scanner` クラスを使いたくなるかもしれません。
Kotlin は JVM ライブラリとうまく相互運用できるように設計されているため、それらを Kotlin で非常に自然に使用できます。
ただし、`java.util.Scanner` は非常に遅いことに注意してください。
実際、非常に遅いため、10<sup>5</sup> 個以上の整数を解析すると、通常の 2 秒という制限時間に収まらない可能性がありますが、Kotlin の単純な `split(" ").map { it.toInt() }` であれば対処できます。

Kotlin での出力の記述は、通常 [`println(...)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) の呼び出しと Kotlin の [文字列テンプレート (string templates)](strings.md#string-templates) を使用することで簡単に行えます。
ただし、出力が 10<sup>5</sup> 行以上に及ぶ場合は注意が必要です。
Kotlin での出力は各行の後に自動的にフラッシュされるため、これほど多くの `println` を呼び出すのは非常に低速です。
配列やリストから多くの行を書き出すより速い方法は、`"
"` をセパレーターとして [`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 関数を使用することです。

```kotlin
println(a.joinToString("
")) // 配列/リストの各要素を個別の行に出力
```

## Kotlin を学ぶ

Kotlin は、特に Java をすでに知っている人にとっては学習が容易です。
ソフトウェア開発者向けの Kotlin の基本構文に関する短い紹介は、ウェブサイトのリファレンスセクションの [基本構文](basic-syntax.md) から始まるページで見つけることができます。

IDEA には [Java から Kotlin への変換ツール](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html) が組み込まれています。
Java に慣れている人が対応する Kotlin の構文構造を学ぶのに使用できますが、完璧ではないため、やはり Kotlin に慣れ親しみ、[Kotlin のイディオム](idioms.md) を学ぶ価値はあります。

Kotlin の構文と Kotlin 標準ライブラリの API を学習するための優れたリソースは [Kotlin Koans](koans.md) です。