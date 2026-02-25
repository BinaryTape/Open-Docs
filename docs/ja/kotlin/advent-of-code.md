[//]: # (title: 慣用的な Kotlin で解く Advent of Code パズル)

[Advent of Code](https://adventofcode.com/) は、毎年 12 月に開催される恒例のイベントです。12 月 1 日から 12 月 25 日まで、クリスマスをテーマにしたパズルが毎日公開されます。Advent of Code の制作者である [Eric Wastl](http://was.tl/) 氏の許可を得て、これらのパズルを Kotlin らしい（idiomatic な）スタイルで解く方法を紹介します。

* [Advent of Code 2025](https://www.youtube.com/playlist?list=PLlFc5cFwUnmx9-VIcfxqhjHrwD3Lab4o4)
* [Advent of Code 2024](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
* [Advent of Code 2023](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
* [](#advent-of-code-2022)
* [](#advent-of-code-2021)
* [](#advent-of-code-2020)

## Advent of Code の準備をする

Kotlin を使用して Advent of Code の課題を解き始めるための、基本的なヒントを紹介します。

* プロジェクトの作成には、[こちらの GitHub テンプレート](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) を使用してください。
* Kotlin デベロッパーアドボケイトの Sebastian Aigner によるウェルカムビデオをチェックしてください。

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

## Advent of Code 2022

### Day 1: Calorie counting（カロリー計算）

[Kotlin Advent of Code テンプレート](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)や、[`maxOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html) や [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html) といった、Kotlin で文字列やコレクションを扱うための便利な関数について学びます。拡張関数がソリューションを綺麗に構造化するのにどのように役立つかを見ていきましょう。

* [Advent of Code](https://adventofcode.com/2022/day/1) でパズルの説明を読む
* ビデオでソリューションをチェックする：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 1 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### Day 2: Rock paper scissors（じゃんけん）

Kotlin における `Char` 型の操作を理解し、`Pair` 型と `to` コンストラクタがパターンマッチングとどのようにうまく機能するかを確認します。[`compareTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/compare-to.html) 関数を使用して、独自のオブジェクトを順序付けする方法を理解しましょう。

* [Advent of Code](https://adventofcode.com/2022/day/2) でパズルの説明を読む
* ビデオでソリューションをチェックする：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 2 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### Day 3: Rucksack reorganization（リュックサックの再整理）

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) ライブラリが、コードのパフォーマンス特性を理解するのにどのように役立つかを学びます。`intersect` のような集合演算が重複するデータの選択にどのように役立つかを確認し、同じソリューションの異なる実装間でのパフォーマンス比較を見ていきましょう。

* [Advent of Code](https://adventofcode.com/2022/day/3) でパズルの説明を読む
* ビデオでソリューションをチェックする：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 3 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### Day 4: Camp cleanup（キャンプの片付け）

`infix` 関数や `operator` 関数がコードをより表現豊かにする方法、また `String` 型や `IntRange` 型の拡張関数によって入力のパースがいかに容易になるかを確認します。

* [Advent of Code](https://adventofcode.com/2022/day/4) でパズルの説明を読む
* ビデオでソリューションをチェックする：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 4 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### Day 5: Supply stacks（サプライスタック）

ファクトリ関数を使用したより複雑なオブジェクトの構築方法、正規表現の使用方法、および両端キューである [`ArrayDeque`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 型について学びます。

* [Advent of Code](https://adventofcode.com/2022/day/5) でパズルの説明を読む
* ビデオでソリューションをチェックする：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 5 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### Day 6: Tuning trouble（チューニングのトラブル）

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) ライブラリを使用して、同じソリューションの 16 種類のバリエーションの特性を比較し、より詳細なパフォーマンス調査を行います。

* [Advent of Code](https://adventofcode.com/2022/day/6) でパズルの説明を読む
* ビデオでソリューションをチェックする：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 6 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### Day 7: No space left on device（デバイスに空き容量がありません）

木構造をモデリングする方法を学び、プログラムによって Kotlin コードを生成するデモをご覧ください。

* [Advent of Code](https://adventofcode.com/2022/day/7) でパズルの説明を読む
* ビデオでソリューションをチェックする：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 7 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### Day 8: Treetop tree house（木の上のツリーハウス）

`sequence` ビルダーの動作を確認します。また、プログラムの最初の草案と、慣用的な Kotlin のソリューションがいかに異なるかを見ていきましょう（特別ゲスト Roman Elizarov 氏が登場します！）。

* [Advent of Code](https://adventofcode.com/2022/day/8) でパズルの説明を読む
* ビデオでソリューションをチェックする：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 8 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### Day 9: Rope bridge（ロープの橋）

`run` 関数、ラベル付きリターン、そして `coerceIn` や `zipWithNext` といった便利な標準ライブラリ関数を確認します。`List` および `MutableList` コンストラクタを使用して指定されたサイズのリストを構築する方法を学び、Kotlin ベースの問題設定の可視化を覗いてみましょう。

* [Advent of Code](https://adventofcode.com/2022/day/9) でパズルの説明を読む
* ビデオでソリューションをチェックする：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 9 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### Day 10: Cathode-ray tube（ブラウン管）

レンジ（範囲）と `in` 演算子によって範囲チェックがいかに自然になるか、関数のパラメータをどのようにレシーバーに変換できるかを学び、`tailrec` 修飾子について簡単に探索します。

* [Advent of Code](https://adventofcode.com/2022/day/10) でパズルの説明を読む
* ビデオでソリューションをチェックする：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 10 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### Day 11: Monkey in the middle（真ん中のモンキー）

ミュータブルで命令的なコードから、不変で読み取り専用のデータ構造を活用する、より関数的なアプローチへと移行する方法を確認します。コンテキストレシーバーについて学び、ゲストが Advent of Code のためだけに独自の可視化ライブラリをどのように構築したかを紹介します。

* [Advent of Code](https://adventofcode.com/2022/day/11) でパズルの説明を読む
* ビデオでソリューションをチェックする：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 11 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### Day 12: Hill Climbing algorithm（登山アルゴリズム）

キュー、`ArrayDeque`、関数参照、および `tailrec` 修飾子を使用して、Kotlin で経路探索問題を解決します。

* [Advent of Code](https://adventofcode.com/2022/day/12) でパズルの説明を読む
* ビデオでソリューションをチェックする：

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 12 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## Advent of Code 2021

> [Advent of Code 2021 に関するブログ記事](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)（英語）をお読みください。
> 
{style="tip"}

### Day 1: Sonar sweep（ソナー調査）

windowed 関数と count 関数を適用して、整数のペアやトリプレットを処理します。

* [Advent of Code](https://adventofcode.com/2021/day/1) でパズルの説明を読む
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1) で Anton Arhipov によるソリューションをチェックするか、ビデオを視聴してください。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### Day 2: Dive!（潜水！）

分解宣言（destructuring declarations）と `when` 式について学びます。

* [Advent of Code](https://adventofcode.com/2021/day/2) でパズルの説明を読む
* [GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt) で Pasha Finkelshteyn によるソリューションをチェックするか、ビデオを視聴してください。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 2: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### Day 3: Binary diagnostic（バイナリ診断）

バイナリ（2 進数）を扱うさまざまな方法を探索します。

* [Advent of Code](https://adventofcode.com/2021/day/3) でパズルの説明を読む
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/) で Sebastian Aigner によるソリューションをチェックするか、ビデオを視聴してください。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### Day 4: Giant squid（巨大なイカ）

入力をパースする方法を学び、より便利な処理のためにいくつかのドメインクラスを導入します。

* [Advent of Code](https://adventofcode.com/2021/day/4) でパズルの説明を読む
* [GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt) で Anton Arhipov によるソリューションをチェックするか、ビデオを視聴してください。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 4: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## Advent of Code 2020

> Advent of Code 2020 パズルのすべてのソリューションは、[GitHub リポジトリ](https://github.com/kotlin-hands-on/advent-of-code-2020/)で見つけることができます。
>
{style="tip"}

### Day 1: Report repair（レポートの修復）

入力処理、リストの反復処理、マップを構築するさまざまな方法、およびコードを簡素化するための [`let`](scope-functions.md#let) 関数の使用方法を探索します。

* [Advent of Code](https://adventofcode.com/2020/day/1) でパズルの説明を読む
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/) で Svetlana Isakova によるソリューションをチェックするか、ビデオを視聴してください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin With the Kotlin Team: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### Day 2: Password philosophy（パスワードの哲学）

文字列ユーティリティ関数、正規表現、コレクションの操作、および式の変換に [`let`](scope-functions.md#let) 関数がどのように役立つかを探索します。

* [Advent of Code](https://adventofcode.com/2020/day/2) でパズルの説明を読む
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/) で Svetlana Isakova によるソリューションをチェックするか、ビデオを視聴してください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with The Kotlin Team: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### Day 3: Toboggan trajectory（トボガンの軌道）

命令的なコードスタイルとより関数的なコードスタイルを比較し、ペアと [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 関数の使い方、列選択モードでのコード編集、および整数のオーバーフローの修正について学びます。

* [Advent of Code](https://adventofcode.com/2020/day/3) でパズルの説明を読む
* [GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt) で Mikhail Dvorkin によるソリューションをチェックするか、ビデオを視聴してください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### Day 4: Passport processing（パスポートの処理）

[`when`](control-flow.md#when-expressions-and-statements) 式を適用し、入力を検証するさまざまな方法を探索します（ユーティリティ関数、範囲の使用、セットのメンバーシップ確認、特定の正規表現とのマッチングなど）。

* [Advent of Code](https://adventofcode.com/2020/day/4) でパズルの説明を読む
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/) で Sebastian Aigner によるソリューションをチェックするか、ビデオを視聴してください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### Day 5: Binary boarding（バイナリ搭乗券）

Kotlin 標準ライブラリ関数（`replace()`、`toInt()`、`find()`）を使用して数値のバイナリ表現を処理し、強力なローカル関数を探索し、Kotlin 1.5 で `max()` 関数を使用する方法を学びます。

* [Advent of Code](https://adventofcode.com/2020/day/5) でパズルの説明を読む
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/) で Svetlana Isakova によるソリューションをチェックするか、ビデオを視聴してください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### Day 6: Custom customs（カスタム税関）

標準ライブラリ関数（`map()`、`reduce()`、`sumOf()`、`intersect()`、`union()`）を使用して、文字列やコレクション内の文字をグループ化しカウントする方法を学びます。

* [Advent of Code](https://adventofcode.com/2020/day/6) でパズルの説明を読む
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/) で Anton Arhipov によるソリューションをチェックするか、ビデオを視聴してください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### Day 7: Handy haversacks（便利な手提げ袋）

正規表現の使用、Kotlin から HashMap の Java `compute()` メソッドを使用してマップ内の値を動的に計算する方法、`forEachLine()` 関数を使用したファイルの読み込み、および深さ優先探索と幅優先探索の 2 種類の探索アルゴリズムの比較を学びます。

* [Advent of Code](https://adventofcode.com/2020/day/7) でパズルの説明を読む
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/) で Pasha Finkelshteyn によるソリューションをチェックするか、ビデオを視聴してください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### Day 8: Handheld halting（携帯端末の停止）

命令を表すためにシールドクラスとラムダ式を適用し、プログラム実行中のループを発見するために Kotlin のセット（set）を適用し、シーケンスと `sequence { }` ビルダー関数を使用して遅延コレクションを構築し、パフォーマンスメトリクスを確認するために実験的な `measureTimedValue()` 関数を試します。

* [Advent of Code](https://adventofcode.com/2020/day/8) でパズルの説明を読む
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/) で Sebastian Aigner によるソリューションをチェックするか、ビデオを視聴してください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### Day 9: Encoding error（エンコーディングエラー）

慣用的な Kotlin スタイルの例として、`any()`、`firstOrNull()`、`firstNotNullOfOrNull()`、`windowed()`、`takeIf()`、および `scan()` 関数を使用して、Kotlin でリストを操作するさまざまな方法を探索します。

* [Advent of Code](https://adventofcode.com/2020/day/9) でパズルの説明を読む
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/) で Svetlana Isakova によるソリューションをチェックするか、ビデオを視聴してください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## 次のステップ

* [Kotlin Koans](koans.md) でさらに多くの課題に挑戦しましょう。
* JetBrains Academy による無料の [Kotlin Core トラック](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) で、実際に動作するアプリケーションを作成しましょう。