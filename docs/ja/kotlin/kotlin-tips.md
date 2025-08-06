[//]: # (title: Kotlinのヒント)

Kotlin Tipsは、Kotlinチームのメンバーが、より効率的かつイディオマティックな方法でKotlinを使用し、コードを書くことをより楽しくする方法を紹介する短編動画シリーズです。

新しいKotlin Tips動画を見逃さないように、[YouTubeチャンネルを購読](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)してください。

## Kotlinでの`null + null`

Kotlinで`null + null`を加算するとどうなるのか、そして何が返されるのでしょうか？Sebastian Aignerが最新のクイックヒントでこの謎を解き明かします。その過程で、彼はnullable型を恐れる必要がない理由も示します：

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin Tips: null + null in Kotlin"/>

## コレクションアイテムの重複排除

重複を含むKotlinのコレクションをお持ちですか？重複しないアイテムのみを含むコレクションが必要ですか？このKotlin Tipsで、Sebastian Aignerがリストから重複を削除する方法、またはそれらをセットに変換する方法を紹介します：

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin Tips: Deduplicating Collection Items"/>

## `suspend`と`inline`の謎

[`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html)、[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)、[`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)のような関数は、それらのシグネチャがコルーチンに対応していないにもかかわらず、ラムダで`suspend`関数を受け入れますが、これはなぜでしょうか？このKotlin Tipsのエピソードで、Sebastian Aignerがこの謎を解き明かします。それは`inline`修飾子と関係があります：

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin Tips: The Suspend and Inline Mystery"/>

## 完全修飾名による宣言のアンシャドウイング

シャドウイングとは、スコープ内に同じ名前の宣言が2つ存在することを意味します。では、どのように選択すればよいのでしょうか？このKotlin Tipsのエピソードで、Sebastian Aignerが完全修飾名の力を使って、必要な関数を正確に呼び出すシンプルなKotlinのトリックを紹介します：

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin Tips: Unshadowing Declarations"/>

## エルビス演算子による`return`と`throw`

[エルビス演算子](null-safety.md#elvis-operator)が再び登場！Sebastian Aignerが、なぜこの演算子が有名な歌手にちなんで名付けられたのか、そしてKotlinで`?:`を使って値を返すか、例外をスローする方法を説明します。その裏にある魔法とは？ [Nothing型](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)です。

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin Tips: Return and Throw with the Elvis Operator"/>

## 分割宣言

Kotlinの[分割宣言](destructuring-declarations.md)を使用すると、単一のオブジェクトから複数の変数を一度に作成できます。この動画では、Sebastian Aignerが分割できるものの一部、例えばペア、リスト、マップなどを紹介します。独自のオブジェクトについてはどうでしょうか？ Kotlinのコンポーネント関数がそれらにも対応します：

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin Tips: Destructuring Declarations"/>

## nullable値を持つ演算子関数

Kotlinでは、クラスに対して加算や減算などの演算子をオーバーライドし、独自のロジックを提供できます。しかし、左側と右側の両方でnull値を許可したい場合はどうでしょうか？この動画で、Sebastian Aignerがこの質問に答えます：

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin Tips: Operator Functions With Nullable Values"/>

## コードの実行時間計測

Sebastian Aignerが[`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html)関数の概要を簡単に説明し、コードの実行時間を計測する方法を学びましょう：

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin Tips: Timing Code"/>

## ループの改善

この動画では、Sebastian Aignerが[ループ](control-flow.md#for-loops)を改善して、コードをより読みやすく、理解しやすく、簡潔にする方法をデモンストレーションします：

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin Tips: Improving Loops"/>

## 文字列

このエピソードでは、Kate PetrovaがKotlinで[文字列](strings.md)を操作するのに役立つ3つのヒントを紹介します：

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin Tips: Strings"/>

## エルビス演算子をさらに活用する

この動画では、Sebastian Aignerが[エルビス演算子](null-safety.md#elvis-operator)にさらなるロジックを追加する方法、例えば、演算子の右側でログを記録する方法などを紹介します：

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin Tips: The Elvis Operator"/>

## Kotlinコレクション

このエピソードでは、Kate Petrovaが[Kotlinコレクション](collections-overview.md)を操作するのに役立つ3つのヒントを紹介します：

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin Tips: Kotlin Collections"/>

## 次のステップ

*   [YouTubeプレイリスト](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7)でKotlin Tipsの完全なリストを確認する
*   [一般的なケースでイディオマティックなKotlinコード](idioms.md)を書く方法を学びましょう