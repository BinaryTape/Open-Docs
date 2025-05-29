[//]: # (title: Kotlinのイディオムを使ったAdvent of Codeのパズル)

[Advent of Code](https://adventofcode.com/)は毎年12月に開催されるイベントで、12月1日から12月25日まで毎日、ホリデーがテーマのパズルが公開されます。
Advent of Codeの作成者である[Eric Wastl](http://was.tl/)氏の許可を得て、Kotlinらしい書き方でこれらのパズルを解く方法をご紹介します。

* [Advent of Code 2024](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
* [Advent of Code 2023](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
* [](#advent-of-code-2022)
* [](#advent-of-code-2021)
* [](#advent-of-code-2020)

## Advent of Codeの準備をしよう

KotlinでAdvent of Codeの課題を解決するために、すぐに始められる基本的なヒントを紹介します。

* プロジェクトの作成には[こちらのGitHubテンプレート](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)を使用する
* KotlinデベロッパーアドボケイトのSebastian Aignerによるウェルカムビデオをチェックする。

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

## Advent of Code 2022

### Day 1: カロリー計算

[Kotlin Advent of Codeテンプレート](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)と、Kotlinの文字列やコレクションを扱うための便利な関数（例: [`maxOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html)や[`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)）について学びます。
拡張関数がどのようにソリューションをきれいに構造化するのに役立つかを見てみましょう。

* [Advent of Code](https://adventofcode.com/2022/day/1)でパズルの説明を読む
* ビデオでソリューションをチェックする。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 1 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### Day 2: じゃんけん

Kotlinの`Char`型に対する操作を理解し、`Pair`型と`to`コンストラクタがパターンマッチングとどのようにうまく機能するかを確認します。
独自のオブジェクトを[`compareTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/compare-to.html)関数を使って順序付ける方法を理解します。

* [Advent of Code](https://adventofcode.com/2022/day/2)でパズルの説明を読む
* ビデオでソリューションをチェックする。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 2 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### Day 3: リュックサック再編成

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark)ライブラリがコードのパフォーマンス特性を理解するのにどのように役立つかを学びます。
また、`intersect`のような集合演算が、重複するデータを選択するのにどのように役立つか、そして同じソリューションの異なる実装間でのパフォーマンス比較を見てみましょう。

* [Advent of Code](https://adventofcode.com/2022/day/3)でパズルの説明を読む
* ビデオでソリューションをチェックする。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 3 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### Day 4: キャンプの片付け

`infix`関数と`operator`関数がコードをより表現豊かにし、`String`型と`IntRange`型に対する拡張関数が入力のパースをいかに簡単にするかを見てみましょう。

* [Advent of Code](https://adventofcode.com/2022/day/4)でパズルの説明を読む
* ビデオでソリューションをチェックする。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 4 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### Day 5: 荷物スタック

ファクトリ関数を使ったより複雑なオブジェクトの構築、正規表現の使用方法、そして両端キューである[`ArrayDeque`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/)型について学びます。

* [Advent of Code](https://adventofcode.com/2022/day/5)でパズルの説明を読む
* ビデオでソリューションをチェックする。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 5 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### Day 6: チューニングのトラブル

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark)ライブラリを使った、より詳細なパフォーマンス調査を見てみましょう。同じソリューションの16種類の異なるバリエーションの特性を比較します。

* [Advent of Code](https://adventofcode.com/2022/day/6)でパズルの説明を読む
* ビデオでソリューションをチェックする。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 6 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### Day 7: デバイスに空き容量なし

ツリー構造をモデル化する方法を学び、プログラムによるKotlinコード生成のデモを見てみましょう。

* [Advent of Code](https://adventofcode.com/2022/day/7)でパズルの説明を読む
* ビデオでソリューションをチェックする。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 7 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### Day 8: ツリーハウス

`sequence`ビルダーの動作と、プログラムの最初の草案とKotlinらしいソリューションがいかに異なるかを見てみましょう（スペシャルゲスト：Roman Elizarov！）。

* [Advent of Code](https://adventofcode.com/2022/day/8)でパズルの説明を読む
* ビデオでソリューションをチェックする。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 8 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### Day 9: ロープの橋

`run`関数、ラベル付きリターン、そして`coerceIn`や`zipWithNext`のような便利な標準ライブラリ関数を見てみましょう。
`List`および`MutableList`コンストラクタを使って指定されたサイズのリストを構築する方法、そして問題文のKotlinベースの可視化を垣間見ることができます。

* [Advent of Code](https://adventofcode.com/2022/day/9)でパズルの説明を読む
* ビデオでソリューションをチェックする。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 9 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### Day 10: 陰極線管

レンジと`in`演算子がいかにレンジのチェックを自然にするか、関数パラメータがどのようにレシーバーに変換されるか、そして`tailrec`修飾子の簡単な探求について学びます。

* [Advent of Code](https://adventofcode.com/2022/day/10)でパズルの説明を読む
* ビデオでソリューションをチェックする。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 10 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### Day 11: 真ん中の猿

可変で命令的なコードから、不変および読み取り専用のデータ構造を活用するより関数的なアプローチへ移行する方法を見てみましょう。
コンテキストレシーバーについて学び、私たちのゲストがAdvent of Codeのためだけに独自の可視化ライブラリを構築した方法について学びます。

* [Advent of Code](https://adventofcode.com/2022/day/11)でパズルの説明を読む
* ビデオでソリューションをチェックする。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 11 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### Day 12: 丘登りアルゴリズム

キュー、`ArrayDeque`、関数参照、および`tailrec`修飾子を使用して、Kotlinで経路探索問題を解決します。

* [Advent of Code](https://adventofcode.com/2022/day/12)でパズルの説明を読む
* ビデオでソリューションをチェックする。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 12 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## Advent of Code 2021

> [Advent of Code 2021に関するブログ投稿](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)を読む
>
{style="tip"}

### Day 1: ソナースイープ

windowed関数とcount関数を適用して、整数のペアとトリプレットを扱います。

* [Advent of Code](https://adventofcode.com/2021/day/1)でパズルの説明を読む
* Anton Arhipovによるソリューションを[Kotlinブログ](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1)で確認するか、ビデオを見る。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### Day 2: 潜水！

分割宣言と`when`式について学びます。

* [Advent of Code](https://adventofcode.com/2021/day/2)でパズルの説明を読む
* Pasha Finkelshteynによるソリューションを[GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt)で確認するか、ビデオを見る。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 2: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### Day 3: バイナリ診断

バイナリ数を扱うさまざまな方法を探ります。

* [Advent of Code](https://adventofcode.com/2021/day/3)でパズルの説明を読む
* Sebastian Aignerによるソリューションを[Kotlinブログ](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/)で確認するか、ビデオを見る。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### Day 4: 巨大なイカ

入力をパースし、より便利な処理のためにドメインクラスを導入する方法を学びます。

* [Advent of Code](https://adventofcode.com/2021/day/4)でパズルの説明を読む
* Anton Arhipovによるソリューションを[GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt)で確認するか、ビデオを見る。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 4: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## Advent of Code 2020

> Advent of Code 2020のパズルのすべてのソリューションは、[GitHubリポジトリ](https://github.com/kotlin-hands-on/advent-of-code-2020/)にあります。
>
{style="tip"}

### Day 1: レポートの修復

入力処理、リストの反復処理、マップを構築するさまざまな方法、そして[`let`](scope-functions.md#let)関数を使ってコードを簡素化する方法を探ります。

* [Advent of Code](https://adventofcode.com/2020/day/1)でパズルの説明を読む
* Svetlana Isakovaによるソリューションを[Kotlinブログ](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/)で確認するか、ビデオを見る。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin With the Kotlin Team: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### Day 2: パスワードの哲学

文字列ユーティリティ関数、正規表現、コレクションに対する操作、そして[`let`](scope-functions.md#let)関数が式を変換するのにどのように役立つかを探ります。

* [Advent of Code](https://adventofcode.com/2020/day/2)でパズルの説明を読む
* Svetlana Isakovaによるソリューションを[Kotlinブログ](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/)で確認するか、ビデオを見る。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with The Kotlin Team: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### Day 3: トボガンそり軌道

命令型とより関数的なコードスタイルを比較し、ペアと[`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)関数を扱い、列選択モードでコードを編集し、整数オーバーフローを修正します。

* [Advent of Code](https://adventofcode.com/2020/day/3)でパズルの説明を読む
* Mikhail Dvorkinによるソリューションを[GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt)で確認するか、ビデオを見る。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### Day 4: パスポート処理

[`when`](control-flow.md#when-expressions-and-statements)式を適用し、入力を検証するさまざまな方法（ユーティリティ関数、レンジの操作、集合のメンバーシップのチェック、特定の正規表現のマッチング）を探ります。

* [Advent of Code](https://adventofcode.com/2020/day/4)でパズルの説明を読む
* Sebastian Aignerによるソリューションを[Kotlinブログ](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/)で確認するか、ビデオを見る。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### Day 5: バイナリ搭乗

Kotlin標準ライブラリ関数（`replace()`、`toInt()`、`find()`）を使って数値のバイナリ表現を扱い、強力なローカル関数を探求し、Kotlin 1.5で`max()`関数を使う方法を学びます。

* [Advent of Code](https://adventofcode.com/2020/day/5)でパズルの説明を読む
* Svetlana Isakovaによるソリューションを[Kotlinブログ](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/)で確認するか、ビデオを見る。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### Day 6: カスタム税関

標準ライブラリ関数である`map()`、`reduce()`、`sumOf()`、`intersect()`、`union()`を使って、文字列やコレクション内の文字をグループ化し、数える方法を学びます。

* [Advent of Code](https://adventofcode.com/2020/day/6)でパズルの説明を読む
* Anton Arhipovによるソリューションを[Kotlinブログ](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/)で確認するか、ビデオを見る。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### Day 7: 便利なリュックサック

正規表現の使用方法、マップ内の値を動的に計算するためにKotlinからJavaの`compute()`メソッドをHashMapに適用する方法、ファイルを読み込むための`forEachLine()`関数の使用方法、そして深さ優先探索と幅優先探索という2種類の探索アルゴリズムの比較について学びます。

* [Advent of Code](https://adventofcode.com/2020/day/7)でパズルの説明を読む
* Pasha Finkelshteynによるソリューションを[Kotlinブログ](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/)で確認するか、ビデオを見る。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### Day 8: ハンドヘルドの停止

命令を表すためにシールクラスとラムダを適用し、プログラム実行におけるループを発見するためにKotlinのセットを適用し、シーケンスと`sequence { }`ビルダー関数を使って遅延コレクションを構築し、実験的な`measureTimedValue()`関数を試してパフォーマンスメトリクスをチェックします。

* [Advent of Code](https://adventofcode.com/2020/day/8)でパズルの説明を読む
* Sebastian Aignerによるソリューションを[Kotlinブログ](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/)で確認するか、ビデオを見る。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### Day 9: エンコードエラー

`any()`、`firstOrNull()`、`firstNotNullOfOrNull()`、`windowed()`、`takeIf()`、`scan()`関数を使ってKotlinでリストを操作するさまざまな方法を探ります。これらはKotlinらしい書き方を示しています。

* [Advent of Code](https://adventofcode.com/2020/day/9)でパズルの説明を読む
* Svetlana Isakovaによるソリューションを[Kotlinブログ](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/)で確認するか、ビデオを見る。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## 次のステップは？

* [Kotlin Koans](koans.md)でさらに多くのタスクを完了する
* JetBrains Academyによる無料の[Kotlin Coreトラック](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)で動作するアプリケーションを作成する