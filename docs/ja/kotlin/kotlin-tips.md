[//]: # (title: Kotlinのヒント)

Kotlinのヒントは、KotlinチームのメンバーがKotlinをより効率的かつイディオマティックに使用し、コードを書くのをさらに楽しくする方法を紹介する短いビデオシリーズです。

新しいKotlinのヒント動画を見逃さないように、[YouTubeチャンネルを購読](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)してください。

## Kotlinにおける null + null

Kotlinで`null + null`を追加すると何が起こり、何が返されるのでしょうか？Sebastian Aignerが最新のクイックヒントでこの謎に取り組んでいます。その中で彼は、nullables (ヌラブル) を恐れる必要がない理由も示しています。

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin Tips: null + null in Kotlin"/>

## コレクションアイテムの重複排除

重複を含むKotlinコレクションをお持ちですか？ユニークなアイテムのみを含むコレクションが必要ですか？このKotlinのヒントで、Sebastian Aignerがリストから重複を削除したり、セットに変換したりする方法をご紹介します。

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin Tips: Deduplicating Collection Items"/>

## suspendとinlineの謎

`repeat()`、`map()`、`filter()`のような関数は、そのシグネチャがコルーチンに対応していないにもかかわらず、ラムダでサスペンド関数を受け入れられるのはなぜでしょうか？このKotlinのヒントのエピソードで、Sebastian Aignerがその謎を解き明かします。それは`inline`修飾子と関係があるのです。

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin Tips: The Suspend and Inline Mystery"/>

## 完全修飾名による宣言のアンシャドウイング

シャドウイングとは、スコープ内に同じ名前の宣言が2つあることを意味します。では、どうやって選べばよいのでしょうか？このKotlinのヒントのエピソードで、Sebastian Aignerは、完全修飾名の力を使って、必要な関数を正確に呼び出すシンプルなKotlinのトリックを紹介します。

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin Tips: Unshadowing Declarations"/>

## Elvis演算子でreturnとthrow

[Elvis演算子](null-safety.md#elvis-operator)が再び登場！Sebastian Aignerは、この演算子が有名な歌手にちなんで名付けられた理由と、Kotlinで`?:`を使ってreturnしたりthrowしたりする方法を説明します。その舞台裏にある魔法は？[Nothing型](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)です。

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin Tips: Return and Throw with the Elvis Operator"/>

## 分解宣言

Kotlinの[分解宣言](destructuring-declarations.md)を使用すると、単一のオブジェクトから複数の変数を一度に作成できます。このビデオでは、Sebastian Aignerが分解できるもののいくつか（ペア、リスト、マップなど）を紹介します。そして、独自のオブジェクトについてはどうか？Kotlinのコンポーネント関数はそれらにも答えを提供します。

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin Tips: Destructuring Declarations"/>

## null許容値を持つ演算子関数

Kotlinでは、クラスの加算や減算のような演算子をオーバーライドして、独自のロジックを提供できます。しかし、左側と右側の両方でnull値を許可したい場合はどうでしょうか？このビデオで、Sebastian Aignerがこの質問に答えます。

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin Tips: Operator Functions With Nullable Values"/>

## コードの実行時間測定

Sebastian Aignerが`measureTimedValue()`関数に関する簡単な概要を説明し、コードの実行時間を測定する方法を学びましょう。

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin Tips: Timing Code"/>

## ループの改善

このビデオで、Sebastian Aignerは、コードをより読みやすく、理解しやすく、簡潔にするために、[ループ](control-flow.md#for-loops)を改善する方法を実演します。

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin Tips: Improving Loops"/>

## 文字列

このエピソードでは、Kate PetrovaがKotlinで[文字列](strings.md)を扱うのに役立つ3つのヒントを紹介します。

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin Tips: Strings"/>

## Elvis演算子をもっと活用する

このビデオでは、Sebastian Aignerが[Elvis演算子](null-safety.md#elvis-operator)により多くのロジックを追加する方法、例えば演算子の右側でのロギングなどについて示します。

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin Tips: The Elvis Operator"/>

## Kotlinコレクション

このエピソードでは、Kate Petrovaが[Kotlinコレクション](collections-overview.md)を扱うのに役立つ3つのヒントを紹介します。

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin Tips: Kotlin Collections"/>

## 次のステップ

*   [YouTubeプレイリスト](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7)でKotlinのヒントの全リストを見る
*   [一般的なケースでイディオマティックなKotlinコード](idioms.md)を書く方法を学ぶ