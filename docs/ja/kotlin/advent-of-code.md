[//]: # (title: Idiomatic KotlinでのAdvent of Codeパズル)

[Advent of Code](https://adventofcode.com/)は毎年12月に開催されるイベントで、12月1日から12月25日まで毎日、ホリデーをテーマにしたパズルが公開されます。Advent of Codeの作成者である[Eric Wastl](http://was.tl/)氏の許可を得て、イディオマティックなKotlinスタイルを使用してこれらのパズルを解く方法を紹介します。

*   [Advent of Code 2024](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
*   [Advent of Code 2023](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
*   [](#advent-of-code-2022)
*   [](#advent-of-code-2021)
*   [](#advent-of-code-2020)

## Advent of Codeに備えよう

KotlinでAdvent of Codeの課題を解決するための基本的なヒントを紹介します。

*   プロジェクトを作成するには、[このGitHubテンプレート](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)を使用してください。
*   KotlinデベロッパーアドボケイトのSebastian Aignerによる歓迎ビデオをチェックしてください。

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

## Advent of Code 2022

### Day 1: カロリー計算

[Kotlin Advent of Codeテンプレート](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template)と、Kotlinでの文字列やコレクションを扱う便利な関数（`maxOf()`や`sumOf()`など）について学びます。拡張関数がソリューションをきれいに構成するのにどのように役立つかをご覧ください。

*   [Advent of Code](https://adventofcode.com/2022/day/1)でパズルの説明を読む
*   ビデオでソリューションを確認する:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 1 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### Day 2: じゃけん

Kotlinの`Char`型に対する操作を理解し、`Pair`型と`to`コンストラクタがパターンマッチングとどのようにうまく機能するかをご覧ください。`compareTo()`関数を使用して独自のオブジェクトを順序付ける方法を理解します。

*   [Advent of Code](https://adventofcode.com/2022/day/2)でパズルの説明を読む
*   ビデオでソリューションを確認する:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 2 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### Day 3: リュックサックの再編成

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark)ライブラリがコードのパフォーマンス特性を理解するのにどのように役立つかをご覧ください。`intersect`のようなセット操作が重複するデータの選択にどのように役立つか、また同じソリューションの異なる実装間のパフォーマンス比較をご覧ください。

*   [Advent of Code](https://adventofcode.com/2022/day/3)でパズルの説明を読む
*   ビデオでソリューションを確認する:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 3 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### Day 4: キャンプの片付け

`infix`関数と`operator`関数がコードをより表現豊かにし、`String`型と`IntRange`型の拡張関数が入力のパースをいかに簡単にするかをご覧ください。

*   [Advent of Code](https://adventofcode.com/2022/day/4)でパズルの説明を読む
*   ビデオでソリューションを確認する:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 4 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### Day 5: サプライスタック

ファクトリ関数を使ったより複雑なオブジェクトの構築、正規表現の使用方法、および両端キュー`ArrayDeque`型について学びます。

*   [Advent of Code](https://adventofcode.com/2022/day/5)でパズルの説明を読む
*   ビデオでソリューションを確認する:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 5 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### Day 6: チューニングのトラブル

[kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark)ライブラリを使ったより詳細なパフォーマンス調査をご覧になり、同じソリューションの16種類のバリエーションの特性を比較します。

*   [Advent of Code](https://adventofcode.com/2022/day/6)でパズルの説明を読む
*   ビデオでソリューションを確認する:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 6 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### Day 7: デバイスに残されたスペースなし

ツリー構造をモデリングする方法を学び、Kotlinコードをプログラムで生成するデモをご覧ください。

*   [Advent of Code](https://adventofcode.com/2022/day/7)でパズルの説明を読む
*   ビデオでソリューションを確認する:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 7 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### Day 8: 木の上のツリーハウス

`sequence`ビルダーの動作と、プログラムの初回ドラフトとイディオマティックなKotlinソリューションがどれほど異なるかをご覧ください（スペシャルゲストにRoman Elizarov！）。

*   [Advent of Code](https://adventofcode.com/2022/day/8)でパズルの説明を読む
*   ビデオでソリューションを確認する:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 8 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### Day 9: ロープ橋

`run`関数、ラベル付きリターン、`coerceIn`や`zipWithNext`といった便利な標準ライブラリ関数をご覧ください。`List`および`MutableList`コンストラクタを使用して指定されたサイズのリストを構築する方法を学び、Kotlinベースの問題記述の可視化を垣間見ることができます。

*   [Advent of Code](https://adventofcode.com/2022/day/9)でパズルの説明を読む
*   ビデオでソリューションを確認する:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 9 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### Day 10: 陰極線管

範囲と`in`演算子によって範囲のチェックが自然になること、関数パラメータをレシーバに変換できること、そして`tailrec`修飾子について簡単に学びます。

*   [Advent of Code](https://adventofcode.com/2022/day/10)でパズルの説明を読む
*   ビデオでソリューションを確認する:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 10 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### Day 11: 中央のサル

可変で命令的なコードから、不変および読み取り専用のデータ構造を利用する、より関数的なアプローチへ移行する方法をご覧ください。コンテキストレシーバーと、ゲストがAdvent of Codeのためだけに独自の可視化ライブラリを構築した方法について学びます。

*   [Advent of Code](https://adventofcode.com/2022/day/11)でパズルの説明を読む
*   ビデオでソリューションを確認する:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 11 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### Day 12: ヒルクライミングアルゴリズム

キュー、`ArrayDeque`、関数参照、および`tailrec`修飾子を使用して、Kotlinで経路探索問題を解決します。

*   [Advent of Code](https://adventofcode.com/2022/day/12)でパズルの説明を読む
*   ビデオでソリューションを確認する:

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2022 Day 12 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## Advent of Code 2021

> [Advent of Code 2021に関するブログ投稿](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)をご覧ください。
> 
{style="tip"}

### Day 1: ソナー掃引

`windowed`関数と`count`関数を適用して、整数のペアとトリプレットを扱います。

*   [Advent of Code](https://adventofcode.com/2021/day/1)でパズルの説明を読む
*   Anton Arhipovによるソリューションを[Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1)で確認するか、ビデオをご覧ください。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### Day 2: ダイブ！

分解宣言と`when`式について学びます。

*   [Advent of Code](https://adventofcode.com/2021/day/2)でパズルの説明を読む
*   Pasha Finkelshteynによるソリューションを[GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt)で確認するか、ビデオをご覧ください。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 2: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### Day 3: バイナリ診断

バイナリ数を扱うさまざまな方法を探ります。

*   [Advent of Code](https://adventofcode.com/2021/day/3)でパズルの説明を読む
*   Sebastian Aignerによるソリューションを[Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/)で確認するか、ビデオをご覧ください。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### Day 4: 巨大なイカ

入力をパースし、より便利な処理のためにドメインクラスを導入する方法を学びます。

*   [Advent of Code](https://adventofcode.com/2021/day/4)でパズルの説明を読む
*   Anton Arhipovによるソリューションを[GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt)で確認するか、ビデオをご覧ください。

![YouTube](youtube.svg){width=25}{type="joined"} [Advent of Code 2021 in Kotlin, Day 4: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## Advent of Code 2020

> Advent of Code 2020のすべてのソリューションは、[GitHubリポジトリ](https://github.com/kotlin-hands-on/advent-of-code-2020/)で見つけることができます。
>
{style="tip"}

### Day 1: レポートの修復

入力処理、リストのイテレーション、マップを構築するさまざまな方法、そしてコードを簡素化するための`let`関数の使用法を探ります。

*   [Advent of Code](https://adventofcode.com/2020/day/1)でパズルの説明を読む
*   Svetlana Isakovaによるソリューションを[Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/)で確認するか、ビデオをご覧ください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin With the Kotlin Team: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### Day 2: パスワード哲学

文字列ユーティリティ関数、正規表現、コレクションに対する操作、そして`let`関数が式を変換するのにいかに役立つかを探ります。

*   [Advent of Code](https://adventofcode.com/2020/day/2)でパズルの説明を読む
*   Svetlana Isakovaによるソリューションを[Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/)で確認するか、ビデオをご覧ください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with The Kotlin Team: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### Day 3: ソリの軌道

命令型とより関数的なコードスタイルを比較し、ペアと`reduce()`関数を扱い、列選択モードでコードを編集し、整数オーバーフローを修正します。

*   [Advent of Code](https://adventofcode.com/2020/day/3)でパズルの説明を読む
*   Mikhail Dvorkinによるソリューションを[GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt)で確認するか、ビデオをご覧ください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### Day 4: パスポート処理

`when`式を適用し、入力を検証するさまざまな方法を探ります。ユーティリティ関数、範囲の操作、セットのメンバーシップの確認、特定の正規表現への一致などです。

*   [Advent of Code](https://adventofcode.com/2020/day/4)でパズルの説明を読む
*   Sebastian Aignerによるソリューションを[Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/)で確認するか、ビデオをご覧ください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### Day 5: バイナリボーディング

Kotlin標準ライブラリ関数（`replace()`、`toInt()`、`find()`）を使用して数値のバイナリ表現を扱い、強力なローカル関数を探り、Kotlin 1.5の`max()`関数の使用方法を学びます。

*   [Advent of Code](https://adventofcode.com/2020/day/5)でパズルの説明を読む
*   Svetlana Isakovaによるソリューションを[Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/)で確認するか、ビデオをご覧ください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### Day 6: カスタム税関

標準ライブラリ関数（`map()`、`reduce()`、`sumOf()`、`intersect()`、`union()`）を使用して、文字列とコレクション内の文字をグループ化して数える方法を学びます。

*   [Advent of Code](https://adventofcode.com/2020/day/6)でパズルの説明を読む
*   Anton Arhipovによるソリューションを[Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/)で確認するか、ビデオをご覧ください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### Day 7: 便利な背負い袋

正規表現の使用方法、マップ内の値を動的に計算するためのKotlinからJavaのHashMapの`compute()`メソッドの使用方法、ファイルを読み込むための`forEachLine()`関数の使用方法、そして2種類の探索アルゴリズム（深さ優先と幅優先）の比較を学びます。

*   [Advent of Code](https://adventofcode.com/2020/day/7)でパズルの説明を読む
*   Pasha Finkelshteynによるソリューションを[Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/)で確認するか、ビデオをご覧ください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### Day 8: ハンドヘルドの停止

命令を表現するためにsealedクラスとラムダを適用し、プログラム実行中のループを発見するためにKotlinセットを適用し、遅延コレクションを構築するためにシーケンスと`sequence { }`ビルダー関数を使用し、パフォーマンスメトリクスを確認するために実験的な`measureTimedValue()`関数を試します。

*   [Advent of Code](https://adventofcode.com/2020/day/8)でパズルの説明を読む
*   Sebastian Aignerによるソリューションを[Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/)で確認するか、ビデオをご覧ください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### Day 9: エンコーディングエラー

`any()`、`firstOrNull()`、`firstNotNullOfOrNull()`、`windowed()`、`takeIf()`、`scan()`といった標準ライブラリ関数を使用し、イディオマティックなKotlinスタイルを示すKotlinでのリスト操作のさまざまな方法を探ります。

*   [Advent of Code](https://adventofcode.com/2020/day/9)でパズルの説明を読む
*   Svetlana Isakovaによるソリューションを[Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/)で確認するか、ビデオをご覧ください。

![YouTube](youtube.svg){width=25}{type="joined"} [Learn Kotlin with the Kotlin Team: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## 次は何をしますか？

*   [Kotlin Koans](koans.md)でさらに多くのタスクを完了する
*   JetBrains Academyが提供する無料の[Kotlin Coreトラック](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)で動作するアプリケーションを作成する