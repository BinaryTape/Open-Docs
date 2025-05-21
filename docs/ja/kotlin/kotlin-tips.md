---
title: Kotlinのヒント
---
```markdown
  

Kotlin Tipsは、Kotlinチームのメンバーが、より効率的で慣用的な方法でKotlinを使用し、コードを書く際の楽しみを増やす方法を紹介する短い動画シリーズです。

[YouTubeチャンネルを登録](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)して、新しいKotlin Tipsの動画を見逃さないようにしましょう。

## Kotlinでのnull + null

Kotlinで`null + null`を追加するとどうなるのでしょうか？また、何が返されるのでしょうか？Sebastian Aignerが、最新のクイックヒントでこの謎に迫ります。また、彼はnullableを恐れる理由がないことも示しています。

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin Tips: null + null in Kotlin"/>

## コレクションアイテムの重複排除

重複を含むKotlinのコレクションをお持ちですか？ユニークなアイテムのみを含むコレクションが必要ですか？Sebastian Aignerが、リストから重複を削除したり、それらをセットに変換する方法をこのKotlinのヒントでご紹介します。

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin Tips: Deduplicating Collection Items"/>

## suspendとinlineの謎

[`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html)、[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)、[`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)のような関数は、そのシグネチャがコルーチンを意識していないにもかかわらず、なぜラムダでsuspend関数を受け入れるのでしょうか？このKotlin Tipsのエピソードで、Sebastian Aignerがその謎を解き明かします。それにはinline修飾子が関係しています。

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin Tips: The Suspend and Inline Mystery"/>

## 完全修飾名による宣言のアンシャドウイング

シャドウイングとは、スコープ内の2つの宣言が同じ名前を持つことを意味します。では、どのように選択すればよいのでしょうか？このKotlin Tipsのエピソードで、Sebastian Aignerが、完全修飾名の力を使って、必要な関数を正確に呼び出すための簡単なKotlinのトリックを紹介します。

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin Tips: Unshadowing Declarations"/>

## Elvis演算子によるreturnとthrow

[Elvis](null-safety#elvis-operator)が再び登場しました！Sebastian Aignerは、なぜこの演算子が有名な歌手にちなんで名付けられたのか、そしてKotlinで`?:`を使ってreturnまたはthrowを行う方法を説明します。舞台裏の魔法とは？[The Nothing type](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)です。

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin Tips: Return and Throw with the Elvis Operator"/>

## 分解宣言

Kotlinの[分解宣言](destructuring-declarations)を使用すると、1つのオブジェクトから複数の変数を一度に作成できます。このビデオで、Sebastian Aignerが、ペア、リスト、マップなど、分解できるもののセレクションを紹介します。そして、独自のオブジェクトはどうでしょうか？Kotlinのcomponent関数がそれらに対する答えを提供します。

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin Tips: Destructuring Declarations"/>

## nullable値を持つ演算子関数

Kotlinでは、クラスの加算や減算などの演算子をオーバーライドして、独自のロジックを提供できます。しかし、左側と右側の両方でnull値を許可したい場合はどうすればよいでしょうか？このビデオで、Sebastian Aignerがこの質問に答えます。

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin Tips: Operator Functions With Nullable Values"/>

## コードのタイミング計測

Sebastian Aignerが、[`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html)関数の簡単な概要を説明し、コードのタイミングを計測する方法を学びましょう。

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin Tips: Timing Code"/>

## ループの改善

このビデオで、Sebastian Aignerが[loops](control-flow#for-loops)を改善して、コードをより読みやすく、理解しやすく、簡潔にする方法を説明します。

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin Tips: Improving Loops"/>

## 文字列

このエピソードでは、Kate PetrovaがKotlinで[Strings](strings)を扱うのに役立つ3つのヒントを紹介します。

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin Tips: Strings"/>

## Elvis演算子でより多くのことを行う

このビデオで、Sebastian Aignerが[Elvis operator](null-safety#elvis-operator)に、演算子の右側の部分へのロギングなど、より多くのロジックを追加する方法を紹介します。

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin Tips: The Elvis Operator"/>

## Kotlinコレクション

このエピソードでは、Kate Petrovaが[Kotlin Collections](collections-overview)を扱うのに役立つ3つのヒントを紹介します。

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin Tips: Kotlin Collections"/>

## 次は何ですか？

* Kotlin Tipsの完全なリストは、[YouTubeプレイリスト](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7)をご覧ください。
* [一般的なケースに対する慣用的なKotlinコード](idioms)の書き方を学びましょう。