[//]: # (title: シンプルさ)

ユーザーが理解する必要のある概念が少なく、それらがより明示的に伝達されるほど、彼らのメンタルモデルはよりシンプルになる可能性が高くなります。これは、APIにおける操作と抽象化の数を制限することによって達成できます。

ライブラリ内の宣言の[可視性](visibility-modifiers.md)が適切に設定され、内部実装の詳細が公開APIに含まれないようにしてください。公開利用のために明示的に設計およびドキュメント化されたAPIのみが、ユーザーにアクセス可能であるべきです。

ガイドの次のパートでは、シンプルさを促進するためのいくつかのガイドラインについて説明します。

## 明示的なAPIモードを使用する

ライブラリのAPIを設計する際に意図を明示的に示すことを強制する、Kotlinコンパイラの[明示的なAPIモード](whatsnew14.md#explicit-api-mode-for-library-authors)機能を使用することをお勧めします。

明示的なAPIモードでは、以下のことを行う必要があります。

*   デフォルトの公開可視性に依存する代わりに、宣言に可視性修飾子を追加して公開にします。これにより、公開APIの一部として何を公開するかを検討したことが保証されます。
*   推論された型によってAPIに意図しない変更が加わるのを防ぐため、すべての公開関数とプロパティの型を定義します。

## 既存の概念を再利用する

APIのサイズを制限する1つの方法は、既存の型を再利用することです。例えば、期間のために新しい型を作成する代わりに、[`kotlin.time.Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)を使用できます。このアプローチは、開発を効率化するだけでなく、他のライブラリとの相互運用性も向上させます。

サードパーティライブラリの型やプラットフォーム固有の型に依存する場合は注意が必要です。それらはあなたのライブラリをこれらの要素に結びつけてしまう可能性があります。そのような場合、コストがメリットを上回るかもしれません。

`String`、`Long`、`Pair`、`Triple`のような一般的な型を再利用することは効果的ですが、それらがドメイン固有のロジックをより適切にカプセル化するのであれば、抽象データ型を開発することを妨げるべきではありません。

## コアAPIを定義し、その上に構築する

シンプルさへのもう一つの道は、限られた数のコア操作を中心とした小さな概念モデルを定義することです。これらの操作の振る舞いが明確にドキュメント化されれば、これらのコア関数に直接基づくか、それらを組み合わせる新しい操作を開発することでAPIを拡張できます。

例:

*   [Kotlin Flows API](flow.md)では、[`filter`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html)や[`map`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html)のような一般的な操作は、[`transform`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/transform.html)操作の上に構築されています。
*   [Kotlin Time API](time-measurement.md)では、[`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)関数は[`TimeSource.Monotonic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/-monotonic/)を利用しています。

追加の操作をこれらのコアコンポーネントに基づいて構築することはしばしば有益ですが、常に必要というわけではありません。機能性を拡張したり、異なる入力により広範に適応したりする、最適化されたバリエーションやプラットフォーム固有のバリエーションを導入する機会を見つけるかもしれません。

ユーザーがコア操作で非自明な問題を解決でき、振る舞いを変更することなく追加の操作でソリューションをリファクタリングできる限り、概念モデルのシンプルさは維持されます。

## 次のステップ

ガイドの次のパートでは、可読性について学びます。

[次のパートに進む](api-guidelines-readability.md)