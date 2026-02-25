[//]: # (title: Kotlin のヒント)

Kotlin Tips は、Kotlin チームのメンバーが、コードを書く際により楽しく、より効率的でイディオマティック（慣用的）な Kotlin の使い方を紹介する短編動画シリーズです。

新しい Kotlin Tips の動画を見逃さないよう、[YouTube チャンネルを登録](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)してください。

## Kotlin における null + null

Kotlin で `null + null` を加算すると何が起こり、何を返すのでしょうか？Sebastian Aigner がこの謎について、最新のクイックチップで解説します。その過程で、nullable（ヌル可能）を恐れる必要がない理由についても説明します。

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin Tips: null + null in Kotlin"/>

## コレクション要素の重複排除

重複を含む Kotlin のコレクションがありますか？ユニークな要素だけのコレクションが必要ですか？Sebastian Aigner が、リストから重複を削除する方法や、それらをセットに変換する方法をこの Kotlin Tips で紹介します。

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin Tips: Deduplicating Collection Items"/>

## suspend と inline の謎

`repeat()`、`map()`、`filter()` のような関数は、シグネチャがコルーチンに対応していないにもかかわらず、なぜラムダ内でサスペンド関数を受け入れることができるのでしょうか？今回の Kotlin Tips では、Sebastian Aigner がその謎を解き明かします。それには `inline` 修飾子が関係しています。

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin Tips: The Suspend and Inline Mystery"/>

## 完全修飾名による宣言のアンシャドウイング

シャドウイング（Shadowing）とは、あるスコープ内に同じ名前を持つ 2 つの宣言が存在することを意味します。では、どのように選択すればよいのでしょうか？今回の Kotlin Tips では、Sebastian Aigner が、完全修飾名（fully qualified names）の力を使って、必要な関数を正確に呼び出すためのシンプルな Kotlin のテクニックを紹介します。

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin Tips: Unshadowing Declarations"/>

## Elvis 演算子を使用した return と throw

[Elvis](null-safety.md#elvis-operator) が再び登場しました！Sebastian Aigner が、なぜこの演算子が有名な歌手にちなんで名付けられたのか、そして Kotlin で `?:` を使って `return` や `throw` を行う方法を説明します。その舞台裏にある魔法とは？それは [Nothing 型](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)です。

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin Tips: Return and Throw with the Elvis Operator"/>

## 分解宣言

Kotlin の [分解宣言 (destructuring declarations)](destructuring-declarations.md) を使用すると、単一のオブジェクトから複数の変数を一度に作成できます。この動画では、Sebastian Aigner が、ペア、リスト、マップなど、分解可能な要素のバリエーションを紹介します。また、自作のオブジェクトについてはどうでしょうか？Kotlin の `component` 関数がその答えを提供します。

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin Tips: Destructuring Declarations"/>

## Nullable な値を持つ演算子関数

Kotlin では、クラスに対して加算や減算などの演算子をオーバーライドし、独自のロジックを提供できます。しかし、左辺と右辺の両方で null 値を許可したい場合はどうすればよいでしょうか？この動画で、Sebastian Aigner がその疑問にお答えします。

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin Tips: Operator Functions With Nullable Values"/>

## コードの実行時間の計測

Sebastian Aigner による [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 関数のクイック概要を見て、コードの実行時間を計測する方法を学びましょう。

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin Tips: Timing Code"/>

## ループの改善

この動画では、Sebastian Aigner が [ループ (loops)](control-flow.md#for-loops) を改善して、コードをより読みやすく、理解しやすく、簡潔にする方法を実演します。

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin Tips: Improving Loops"/>

## 文字列

今回の動画では、Kate Petrova が Kotlin で [文字列 (Strings)](strings.md) を扱うのに役立つ 3 つのヒントを紹介します。

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin Tips: Strings"/>

## Elvis 演算子の活用

この動画では、Sebastian Aigner が、演算子の右側にロギングを追加するなど、[Elvis 演算子](null-safety.md#elvis-operator)により多くのロジックを追加する方法を紹介します。

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin Tips: The Elvis Operator"/>

## Kotlin コレクション

今回の動画では、Kate Petrova が [Kotlin コレクション](collections-overview.md)を扱うのに役立つ 3 つのヒントを紹介します。

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin Tips: Kotlin Collections"/>

## 次のステップ

* [YouTube プレイリスト](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7)で Kotlin Tips の全リストを見る
* [一般的なケースでのイディオマティックな Kotlin コードの書き方](idioms.md)を学ぶ