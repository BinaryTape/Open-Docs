---
title: "競技プログラミングのための Kotlin"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

このチュートリアルは、これまで Kotlin を使用したことがない競技プログラミング参加者と、
これまで競技プログラミングイベントに参加したことのない Kotlin 開発者の両方を対象としています。
対応するプログラミングスキルを前提としています。

[競技プログラミング](https://en.wikipedia.org/wiki/Competitive_programming)
は、参加者が厳密な制約の中で正確に指定されたアルゴリズムの問題を解決するプログラムを作成する、
マインドスポーツです。問題は、ソフトウェア開発者なら誰でも解決でき、正しい解決策を得るためにほとんどコードを必要としない簡単なものから、
特別なアルゴリズム、データ構造、および多くの練習の知識を必要とする複雑なものまであります。Kotlin は、競技プログラミング用に特別に設計されたものではありませんが、
偶然にもこの分野によく適合し、プログラマがコードを操作するときに記述および読み取る必要のある典型的なボイラープレートの量を、
動的に型付けされたスクリプト言語によって提供されるレベルとほぼ同じレベルまで削減しながら、静的に型付けされた言語のツールとパフォーマンスを備えています。

Kotlin の開発環境のセットアップ方法については、[Kotlin/JVM の使用を開始する](jvm-get-started) を参照してください。
競技プログラミングでは、通常、単一のプロジェクトが作成され、各問題の解決策は単一のソースファイルに記述されます。

## 簡単な例：到達可能な数の問題

具体的な例を見てみましょう。

[Codeforces](https://codeforces.com/)
Round 555 は 4 月 26 日に第 3 部門向けに開催されました。つまり、すべての開発者が試すのに適した問題がありました。
[このリンク](https://codeforces.com/contest/1157) を使用して問題を読むことができます。
セットの中で最も簡単な問題は、
[Problem A: Reachable Numbers](https://codeforces.com/contest/1157/problem/A) です。
問題文に記載されている簡単なアルゴリズムを実装するように求められます。

まず、任意の名前の Kotlin ソースファイルを作成して、それを解決することから始めます。`A.kt` で十分でしょう。
まず、問題文で指定されている関数を次のように実装する必要があります。

関数 f(x) を次のように表します。x に 1 を加算し、結果の数値に末尾のゼロが少なくとも 1 つある場合は、そのゼロを削除します。

Kotlin は実用的で偏りのない言語であり、開発者をどちらかにプッシュすることなく、命令型と関数型の両方のプログラミングスタイルをサポートしています。
[末尾再帰](functions#tail-recursive-functions) などの Kotlin の機能を使用して、関数 `f` を関数型スタイルで実装できます。

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

または、従来の
[while ループ](control-flow) と、Kotlin で [var](basic-syntax#variables) で示される可変変数を使用して、関数 `f` の命令型実装を記述することもできます。

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

Kotlin の型は、型推論の普及により多くの場所でオプションですが、すべての宣言には、コンパイル時に既知の明確に定義された静的な型が依然として存在します。

残りは、入力を読み取り、問題文が要求するアルゴリズムの残りの部分、つまり、標準入力で指定された初期値 `n` に関数 `f` を繰り返し適用するときに生成される異なる整数の数を計算する main 関数を記述することです。

デフォルトでは、Kotlin は JVM で実行され、動的にサイズ変更された配列 (`ArrayList`)、
ハッシュベースのマップとセット (`HashMap`/`HashSet`)、ツリーベースの順序付けられたマップとセット (`TreeMap`/`TreeSet`) などの汎用コレクションとデータ構造を備えた、豊富で効率的なコレクションライブラリへの直接アクセスを提供します。
関数 `f` の適用中にすでに到達した値を追跡するために整数のハッシュセットを使用すると、問題の簡単な命令型バージョンの解決策を以下に示すように記述できます。

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 以降" default>

```kotlin
fun main() {
    var n = readln().toInt() // 入力から整数を読み取る
    val reached = HashSet<Int>() // 可変ハッシュセット
    while (reached.add(n)) n = f(n) // 関数 f を反復処理する
    println(reached.size) // 出力に応答を出力する
}
```

競技プログラミングでは、誤った形式の入力を処理する必要はありません。入力形式は常に
競技プログラミングで正確に指定されており、実際の入力が問題の入力仕様から逸脱することはありません
声明。そのため、Kotlin の [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 関数を使用できます。入力文字列が存在することをアサートし、
それ以外の場合は例外をスローします。同様に、入力文字列が整数でない場合、[`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)
関数は例外をスローします。

</TabItem>
<TabItem value="kotlin-1-5" label="以前のバージョン" default>

```kotlin
fun main() {
    var n = readLine()!!.toInt() // 入力から整数を読み取る
    val reached = HashSet<Int>() // 可変ハッシュセット
    while (reached.add(n)) n = f(n) // 関数 f を反復処理する
    println(reached.size) // 出力に応答を出力する
}
```

Kotlin の
[null 以外のassertion 演算子](null-safety#not-null-assertion-operator) `!!`
を [readLine()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html) 関数呼び出しの後に使用することに注意してください。
Kotlin の `readLine()` 関数は、
[Nullable 型](null-safety#nullable-types-and-non-nullable-types)
`String?` を返し、入力の最後に `null` を返して、開発者に
入力がない場合を明示的に処理させます。

競技プログラミングでは、誤った形式の入力を処理する必要はありません。
競技プログラミングでは、入力形式は常に正確に指定されており、実際の入力が
問題文の入力仕様から逸脱することはありません。それが null 以外のassertion 演算子 `!!` が本質的に行うことです。
入力文字列が存在することをアサートし、それ以外の場合は例外をスローします。同様に、
[String.toInt()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html) も同様です。

</TabItem>
</Tabs>

オンラインの競技プログラミングイベントではすべて、事前に記述されたコードの使用が許可されているため、実際のソリューションコードを読み書きしやすくするために、競技プログラミングに適したユーティリティ関数の独自のライブラリを定義できます。
その後、このコードをソリューションのテンプレートとして使用します。たとえば、競技プログラミングで入力を読み取るために、次のヘルパー関数を定義できます。

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 以降" default>

```kotlin
private fun readStr() = readln() // 文字列行
private fun readInt() = readStr().toInt() // 単一の int
// ソリューションで使用する他の型と同様
```

</TabItem>
<TabItem value="kotlin-1-5" label="以前のバージョン" default>

```kotlin
private fun readStr() = readLine()!! // 文字列行
private fun readInt() = readStr().toInt() // 単一の int
// ソリューションで使用する他の型と同様
```

</TabItem>
</Tabs>

ここでは、`private` [可視性修飾子](visibility-modifiers) の使用に注意してください。
可視性修飾子の概念は競技プログラミングにはまったく関係ありませんが、
同じパッケージ内の競合するパブリック宣言のエラーが発生することなく、同じテンプレートに基づいて複数のソリューションファイルを配置できます。

## 関数型演算子の例：長い数の問題

より複雑な問題の場合、Kotlin のコレクションに対する広範な関数型演算子のライブラリは、
ボイラープレートを最小限に抑え、コードを線形のトップからボトム、左から右への流れるデータ変換
パイプラインに変えるのに役立ちます。たとえば、
[Problem B: Long Number](https://codeforces.com/contest/1157/problem/B) 問題は、実装するために簡単な貪欲アルゴリズムを取り、単一の可変変数を使用せずにこのスタイルを使用して記述できます。

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 以降" default>

```kotlin
fun main() {
    // 入力を読み取る
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // ローカル関数 f を定義する
    fun f(c: Char) = '0' + fl[c - '1']
    // 貪欲に最初と最後のインデックスを見つける
    val i = s.indexOfFirst { c `->` f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) `->` j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 応答を作成して書き込む
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c `->` f(c) }.joinToString("") +
        s.substring(j)
    println(ans)
}
```

</TabItem>
<TabItem value="kotlin-1-5" label="以前のバージョン" default>

```kotlin
fun main() {
    // 入力を読み取る
    val n = readLine()!!.toInt()
    val s = readLine()!!
    val fl = readLine()!!.split(" ").map { it.toInt() }
    // ローカル関数 f を定義する
    fun f(c: Char) = '0' + fl[c - '1']
    // 貪欲に最初と最後のインデックスを見つける
    val i = s.indexOfFirst { c `->` f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) `->` j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 応答を作成して書き込む
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c `->` f(c) }.joinToString("") + 
        s.substring(j)
    println(ans)
}
```

</TabItem>
</Tabs>

この密なコードでは、コレクション変換に加えて、ローカル関数や
[elvis 演算子](null-safety#elvis-operator) `?:`
のような便利な Kotlin の機能を確認できます。
「値が正の場合は値を取り、そうでない場合は長さを使用する」のような [イディオム](idioms) を簡潔で読みやすい
式 `.takeIf { it >= 0 } ?: s.length` で表現できます。それでも、Kotlin では追加の可変変数を追加し、同じコードを命令型スタイルで表現することもできます。

このような競技プログラミングタスクで入力を読み取るのをより簡潔にするために、
次のヘルパー入力読み取り関数のリストを使用できます。

<Tabs groupId="kotlin-versions">
<TabItem value="kotlin-1-6" label="Kotlin 1.6.0 以降" default>

```kotlin
private fun readStr() = readln() // 文字列行
private fun readInt() = readStr().toInt() // 単一の int
private fun readStrings() = readStr().split(" ") // 文字列のリスト
private fun readInts() = readStrings().map { it.toInt() } // int のリスト
```

</TabItem>
<TabItem value="kotlin-1-5" label="以前のバージョン" default>

```kotlin
private fun readStr() = readLine()!! // 文字列行
private fun readInt() = readStr().toInt() // 単一の int
private fun readStrings() = readStr().split(" ") // 文字列のリスト
private fun readInts() = readStrings().map { it.toInt() } // int のリスト
```

</TabItem>
</Tabs>

これらのヘルパーを使用すると、入力の読み取り用のコード部分がより簡単になり、問題文の入力
仕様に1 行ずつ密接に従います。

```kotlin
// 入力を読み取る
val n = readInt()
val s = readStr()
val fl = readInts()
```

競技プログラミングでは、産業プログラミングの実践で一般的であるよりも短い名前を変数に付けるのが慣習であることに注意してください。コードは 1 回だけ記述され、その後はサポートされないためです。
ただし、これらの名前は通常、記憶しやすいものです。配列の場合は `a`、
インデックスの場合は `i`、`j` など、テーブルの行番号と列番号の場合は `r` と `c`、座標の場合は `x` と `y` などです。
問題文に示されているように、入力データに同じ名前を付けておく方が簡単です。
ただし、より複雑な問題ではより多くのコードが必要になり、より長い自己説明型の
変数名と関数名を使用する必要があります。

## その他のヒントとコツ

競技プログラミングの問題には、次のような入力が含まれることがよくあります。

入力の最初の行には、2 つの整数 `n` と `k` が含まれています。

Kotlin では、この行は、整数のリストからの
[分割代入](destructuring-declarations) を使用して、次のステートメントで簡潔に解析できます。

```kotlin
val (n, k) = readInts()
```

構造化されていない入力形式を解析するために、JVM の `java.util.Scanner` クラスを使用するのは魅力的かもしれません。Kotlin は JVM ライブラリと適切に連携するように設計されているため、Kotlin での使い心地は非常に自然です。
ただし、`java.util.Scanner` は非常に遅いことに注意してください。実際、それが非常に遅いため、10<sup>5</sup> 個以上の整数を解析すると、典型的な 2 秒の時間制限に収まらない可能性があり、単純な Kotlin の
`split(" ").map { it.toInt() }` で処理できます。

Kotlin での出力の書き込みは、通常、
[println(...)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html)
呼び出しと Kotlin の
[文字列テンプレート](strings#string-templates) を使用して簡単です。ただし、出力に 10<sup>5</sup> 行以上のオーダーが含まれている場合は注意が必要です。
非常に多くの `println` 呼び出しを発行すると、Kotlin での出力は各行の後に自動的にフラッシュされるため、時間がかかりすぎます。
配列またはリストから多くの行を書き込むより高速な方法は、次のように
[joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 関数を区切り文字として `"
"` を使用することです。

```kotlin
println(a.joinToString("
")) // 配列/リストの各要素を個別の行にする
```

## Kotlin の学習

Kotlin は、特に Java をすでに知っている人にとっては習得が簡単です。
ソフトウェア開発者向けの Kotlin の基本構文の簡単な紹介は、[基本構文](basic-syntax) から始まる Web サイトの参照セクションに直接記載されています。

IDEA には、組み込みの
[Java から Kotlin へのコンバーター](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html) があります。
Java に精通している人が対応する Kotlin 構文構造を学習するために使用できますが、完璧ではありません。Kotlin に慣れ、
[Kotlin イディオム](idioms) を学習する価値は依然としてあります。

Kotlin 構文と Kotlin 標準ライブラリの API を学習するための優れたリソースは
[Kotlin Koans](koans) です。