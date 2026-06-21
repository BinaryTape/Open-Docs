[//]: # (title: シンプルさ)

ユーザーが理解すべき概念が少なく、それらがより明示的に伝えられるほど、ユーザーのメンタルモデルはよりシンプルになります。これは、APIにおける操作や抽象化の数を制限することで実現できます。

ライブラリ内の宣言の[可視性](visibility-modifiers.md)を適切に設定し、内部の実装の詳細がパブリックAPIに含まれないようにしてください。パブリックな利用のために明示的に設計およびドキュメント化されたAPIのみが、ユーザーからアクセス可能であるべきです。

ガイドの次のパートでは、シンプルさを促進するためのいくつかのガイドラインについて説明します。

## 明示的APIモードの使用

Kotlinコンパイラの[明示的API（explicit API）モード](whatsnew14.md#explicit-api-mode-for-library-authors)機能を使用することをお勧めします。これにより、ライブラリのAPIを設計する際に、意図を明示的に示すことが強制されます。

明示的APIモードでは、以下を行う必要があります：

* デフォルトのpublic可視性に依存するのではなく、宣言に可視性修飾子を追加して明示的にpublicにします。これにより、パブリックAPIの一部として何を公開しているかを確実に検討することになります。
* 推論された型による意図しないAPIの変更を防ぐために、すべてのパブリックな関数とプロパティの型を定義します。

## 既存の概念の再利用

APIのサイズを制限する一つの方法は、既存の型を再利用することです。例えば、期間（duration）のために新しい型を作成する代わりに、[`kotlin.time.Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) を使用できます。このアプローチは、開発を効率化するだけでなく、他のライブラリとの相互運用性も向上させます。

サードパーティライブラリの型やプラットフォーム固有の型に依存する場合は、それらがライブラリを特定の要素に縛り付ける可能性があるため、注意が必要です。そのような場合、コストがメリットを上回ることがあります。

`String`、`Long`、`Pair`、`Triple` などの共通の型を再利用することは効果的ですが、ドメイン固有のロジックをより適切にカプセル化できるのであれば、抽象データ型の開発をためらうべきではありません。

## コアAPIの定義とそれに基づいた構築

シンプルさへのもう一つの道は、限られたコア操作のセットを中心とした小さな概念モデルを定義することです。これらの操作の動作が明確にドキュメント化されたら、これらのコア関数を直接利用したり組み合わせたりする新しい操作を開発することで、APIを拡張できます。

例えば：

* [Kotlin Flows API](coroutines-flow.md)では、[`filter`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html) や [`map`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html) といった一般的な操作は、[`transform`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/transform.html) 操作の上に構築されています。
* [Kotlin Time API](time-measurement.md) では、[`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 関数が [`TimeSource.Monotonic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/-monotonic/) を利用しています。

追加の操作をこれらのコアコンポーネントに基づかせることは多くの場合有益ですが、必ずしも必要というわけではありません。機能を拡張したり、異なる入力により広く適応させたりするために、最適化されたバリエーションやプラットフォーム固有のバリエーションを導入する機会があるかもしれません。

ユーザーがコア操作で自明ではない問題を解決でき、動作を変更することなく追加の操作でソリューションをリファクタリングできる限り、概念モデルのシンプルさは維持されます。

## 次のステップ

ガイドの次のパートでは、読みやすさ（readability）について学びます。

[次のパートに進む](api-guidelines-readability.md)