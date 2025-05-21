---
title: "KotlinらしいAdvent of Codeパズル"
---
[Advent of Code](https://adventofcode.com/) は、12月1日から12月25日まで毎日、ホリデーをテーマにしたパズルが公開される毎年恒例の12月のイベントです。[Advent of Code](https://adventofcode.com/) の作成者である [Eric Wastl](http://was.tl/) 氏の許可を得て、これらのパズルを Kotlin のイディオム的なスタイルで解決する方法を紹介します。

* [Advent of Code 2024](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
* [Advent of Code 2023](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
* [](#advent-of-code-2022)
* [](#advent-of-code-2021)
* [](#advent-of-code-2020)

## Get ready for Advent of Code

Kotlin で Advent of Code の課題を解決するための基本的なヒントをご紹介します。

* [この GitHub テンプレート](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) を使用してプロジェクトを作成します。
* Kotlin Developer Advocate、Sebastian Aigner によるウェルカムビデオをご覧ください。

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

## Advent of Code 2022

### Day 1: Calorie counting

[Kotlin Advent of Code template](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) と、Kotlin での文字列とコレクションの操作に便利な関数、
たとえば [`maxOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html) や [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html) などについて学びます。
拡張関数が、ソリューションを適切な方法で構成するのにどのように役立つかを見てみましょう。

* [Advent of Code](https://adventofcode.com/2022/day/1) でパズルの説明をお読みください
* ビデオでソリューションをチェックしてください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 1 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### Day 2: Rock paper scissors

Kotlin の `Char` 型の操作を理解し、`Pair` 型と `to` コンストラクターがパターンマッチングとうまく連携する方法を見てみましょう。
[`compareTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/compare-to.html) 関数を使用して、独自のオブジェクトを並べ替える方法を理解しましょう。

* [Advent of Code](https://adventofcode.com/2022/day/2) でパズルの説明をお読みください
* ビデオでソリューションをチェックしてください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 2 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### Day 3: Rucksack reorganization

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) ライブラリが、コードのパフォーマンス特性を理解するのにどのように役立つかを学びましょう。
`intersect` のような集合演算が、重複するデータの選択にどのように役立つかを確認し、
同じソリューションのさまざまな実装間のパフォーマンス比較を見てみましょう。

* [Advent of Code](https://adventofcode.com/2022/day/3) でパズルの説明をお読みください
* ビデオでソリューションをチェックしてください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 3 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### Day 4: Camp cleanup

`infix` 関数と `operator` 関数がコードをより表現力豊かにする方法、
および `String` 型と `IntRange` 型の拡張関数が入力の解析を容易にする方法を見てみましょう。

* [Advent of Code](https://adventofcode.com/2022/day/4) でパズルの説明をお読みください
* ビデオでソリューションをチェックしてください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 4 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### Day 5: Supply stacks

ファクトリー関数を使用してより複雑なオブジェクトを構築する方法、
正規表現の使用方法、および両端 [`ArrayDeque`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 型について学びましょう。

* [Advent of Code](https://adventofcode.com/2022/day/5) でパズルの説明をお読みください
* ビデオでソリューションをチェックしてください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 5 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### Day 6: Tuning trouble

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) ライブラリを使用した、より詳細なパフォーマンス調査をご覧ください。
同じソリューションの 16 種類のバリエーションの特性を比較します。

* [Advent of Code](https://adventofcode.com/2022/day/6) でパズルの説明をお読みください
* ビデオでソリューションをチェックしてください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 6 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### Day 7: No space left on device

ツリー構造をモデル化する方法を学び、プログラムで Kotlin コードを生成するデモをご覧ください。

* [Advent of Code](https://adventofcode.com/2022/day/7) でパズルの説明をお読みください
* ビデオでソリューションをチェックしてください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 7 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### Day 8: Treetop tree house

動作中の `sequence` ビルダーをご覧ください。
また、プログラムの最初のドラフトとイディオム的な Kotlin ソリューションがどれだけ異なるかを見てみましょう（スペシャルゲスト Roman Elizarov！）。

* [Advent of Code](https://adventofcode.com/2022/day/8) でパズルの説明をお読みください
* ビデオでソリューションをチェックしてください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 8 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### Day 9: Rope bridge

`run` 関数、ラベル付きの戻り値、および `coerceIn` や `zipWithNext` のような便利な標準ライブラリ関数を見てみましょう。
`List` コンストラクターと `MutableList` コンストラクターを使用して、指定されたサイズのリストを構築する方法を見てみましょう。
また、問題文の Kotlin ベースの視覚化を垣間見ることができます。

* [Advent of Code](https://adventofcode.com/2022/day/9) でパズルの説明をお読みください
* ビデオでソリューションをチェックしてください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 9 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### Day 10: Cathode-ray tube

範囲と `in` 演算子が範囲のチェックを自然にする方法、
関数パラメーターを受信機に変える方法、および `tailrec` 修飾子の簡単な調査について学びましょう。

* [Advent of Code](https://adventofcode.com/2022/day/10) でパズルの説明をお読みください
* ビデオでソリューションをチェックしてください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 10 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### Day 11: Monkey in the middle

可変の
命令型コードから、不変および読み取り専用のデータ構造を利用する、より関数的なアプローチに移行する方法を見てみましょう。
コンテキストレシーバー、およびゲストが Advent of Code 専用に独自の視覚化ライブラリを構築した方法について学びましょう。

* [Advent of Code](https://adventofcode.com/2022/day/11) でパズルの説明をお読みください
* ビデオでソリューションをチェックしてください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 11 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### Day 12: Hill Climbing algorithm

Kotlin でキュー、`ArrayDeque`、関数参照、および `tailrec` 修飾子を使用して、パス検索の問題を解決します。

* [Advent of Code](https://adventofcode.com/2022/day/12) でパズルの説明をお読みください
* ビデオでソリューションをチェックしてください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2022 Day 12 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## Advent of Code 2021

:::tip
[Advent of Code 2021 に関するブログ投稿](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/) をお読みください。

:::

### Day 1: Sonar sweep

windowed 関数と count 関数を適用して、整数のペアとトリプレットを操作します。

* [Advent of Code](https://adventofcode.com/2021/day/1) でパズルの説明をお読みください
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1) で Anton Arhipov からソリューションを確認してください
  またはビデオをご覧ください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### Day 2: Dive!

デストラクチャリング宣言と `when` 式について学びます。

* [Advent of Code](https://adventofcode.com/2021/day/2) でパズルの説明をお読みください
* [GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt) で Pasha Finkelshteyn からソリューションを確認してください
  またはビデオをご覧ください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 2: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### Day 3: Binary diagnostic

2 進数を操作するさまざまな方法を探ります。

* [Advent of Code](https://adventofcode.com/2021/day/3) でパズルの説明をお読みください
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/) で Sebastian Aigner からソリューションを確認してください
  またはビデオをご覧ください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### Day 4: Giant squid

入力を解析し、より便利な処理のためにいくつかのドメインクラスを導入する方法を学びます。

* [Advent of Code](https://adventofcode.com/2021/day/4) でパズルの説明をお読みください
* [GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt) で Anton Arhipov からソリューションを確認してください
  またはビデオをご覧ください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Advent of Code 2021 in Kotlin, Day 4: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## Advent of Code 2020

:::tip
[GitHub リポジトリ](https://github.com/kotlin-hands-on/advent-of-code-2020/) で Advent of Code 2020 パズルのすべてのソリューションを見つけることができます。

:::

### Day 1: Report repair

入力の処理、リストの反復処理、マップを作成するさまざまな方法、およびコードを簡素化するための [`let`](scope-functions#let)
関数について学習します。

* [Advent of Code](https://adventofcode.com/2020/day/1) でパズルの説明をお読みください
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/) で Svetlana Isakova からソリューションを確認してください
またはビデオをご覧ください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin With the Kotlin Team: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### Day 2: Password philosophy

文字列ユーティリティ関数、正規表現、コレクションの操作、および式を変換するのに [`let`](scope-functions#let)
関数がどのように役立つかについて学習します。

* [Advent of Code](https://adventofcode.com/2020/day/2) でパズルの説明をお読みください
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/) で Svetlana Isakova からソリューションを確認してください
またはビデオをご覧ください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with The Kotlin Team: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### Day 3: Toboggan trajectory

命令型コードスタイルとより関数的なコードスタイルを比較し、ペアと [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)
関数を操作し、列選択モードでコードを編集し、整数のオーバーフローを修正します。

* [Advent of Code](https://adventofcode.com/2020/day/3) でパズルの説明をお読みください
* [GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt) で Mikhail Dvorkin からソリューションを確認してください
またはビデオをご覧ください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### Day 4: Passport processing

[`when`](control-flow#when-expressions-and-statements) 式を適用し、入力を検証するさまざまな方法を探ります。
ユーティリティ関数、範囲の操作、セットメンバーシップのチェック、および特定の正規表現との照合。

* [Advent of Code](https://adventofcode.com/2020/day/4) でパズルの説明をお読みください
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/) で Sebastian Aigner からソリューションを確認してください
またはビデオをご覧ください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### Day 5: Binary boarding

Kotlin 標準ライブラリ関数（`replace()`、`toInt()`、`find()`）を使用して、数値の 2 進数表現を操作し、
強力なローカル関数を探り、Kotlin 1.5 で `max()` 関数を使用する方法を学びます。

* [Advent of Code](https://adventofcode.com/2020/day/5) でパズルの説明をお読みください
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/) で Svetlana Isakova からソリューションを確認してください
またはビデオをご覧ください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### Day 6: Custom customs

標準ライブラリ関数 (`map()`、`reduce()`、`sumOf()`、`intersect()`、および `union()`) を使用して、文字列とコレクション内の文字をグループ化およびカウントする方法を学びます。

* [Advent of Code](https://adventofcode.com/2020/day/6) でパズルの説明をお読みください
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/) で Anton Arhipov からソリューションを確認してください
またはビデオをご覧ください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### Day 7: Handy haversacks

正規表現の使用方法、マップ内の値の動的な計算のために Kotlin から Java の `compute()` メソッドを HashMap で使用する方法、
`forEachLine()` 関数を使用してファイルを読み取る方法を学び、2 種類の検索アルゴリズムを比較します。
深さ優先と幅優先。

* [Advent of Code](https://adventofcode.com/2020/day/7) でパズルの説明をお読みください
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/) で Pasha Finkelshteyn からソリューションを確認してください
またはビデオをご覧ください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### Day 8: Handheld halting

シールドクラスとラムダを適用して命令を表し、Kotlin セットを適用してプログラムの実行でループを発見し、
シーケンスと `sequence { }` ビルダー関数を使用して遅延コレクションを構築し、実験的な
`measureTimedValue()` 関数を試して、パフォーマンスメトリクスを確認します。

* [Advent of Code](https://adventofcode.com/2020/day/8) でパズルの説明をお読みください
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/) で Sebastian Aigner からソリューションを確認してください
またはビデオをご覧ください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### Day 9: Encoding error

`any()`、`firstOrNull()`、`firstNotNullOfOrNull()`、`windowed()`、`takeIf()`、および`scan()` 関数を使用して、Kotlin でリストを操作するさまざまな方法を調べます。これらは、Kotlin のイディオム的なスタイルを示しています。

* [Advent of Code](https://adventofcode.com/2020/day/9) でパズルの説明をお読みください
* [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/) で Svetlana Isakova からソリューションを確認してください
またはビデオをご覧ください。

<img src="/img/youtube.svg" alt="YouTube" width="25" style={{verticalAlign: 'middle'}}/> [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## What's next?

* [Kotlin Koans](koans) でより多くのタスクを完了する
* JetBrains Academy の無料 [Kotlin Core track](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) で動作するアプリケーションを作成する