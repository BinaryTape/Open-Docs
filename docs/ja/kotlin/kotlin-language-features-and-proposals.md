[//]: # (title: Kotlinの言語機能と提案)

<web-summary>Kotlinの機能のライフサイクルについて学びます。このページには、Kotlinの言語機能と設計提案の全リストが含まれています。</web-summary>

JetBrainsは、[Kotlin言語の進化原則](kotlin-evolution-principles.md)に従い、実用的な設計に導かれながらKotlin言語を進化させています。

> 言語機能の提案はKotlin 1.7.0からリストされています。
>
> 言語機能のステータスについては、[Kotlin進化原則のドキュメント](kotlin-evolution-principles.md#pre-stable-features)を参照してください。
>
{style="note"}

<tabs>
<tab id="all-proposals" title="すべて">

<!-- <include element-id="all-proposals" from="all-proposals.topic"/> -->

<snippet id="source">
<table style="header-column">

<!-- EXPLORATION AND DESIGN BLOCK -->

<tr filter="exploration-and-design">
<td width="200">

**探索と設計**

</td>
<td>

**名前ベースの分割代入**

* KEEP提案: [name-based-destructuring.md](https://github.com/Kotlin/KEEP/blob/name-based-destructuring/proposals/name-based-destructuring.md)
* YouTrack課題: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索と設計**

</td>
<td>

**不変性のサポート**

* KEEPノート: [immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack課題: [KT-77734](https://youtrack.jetbrains.com/issue/KT-77734)

</td>
</tr>

<!-- END OF EXPLORATION AND DESIGN BLOCK -->

<!-- KEEP DISCUSSION BLOCK -->

<tr filter="keep">
<td width="200">

**KEEP議論**

</td>
<td>

**コンパイル時定数の改善**

* KEEP提案: [improve-compile-time-constants.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md)
* YouTrack課題: [KT-22505](https://youtrack.jetbrains.com/issue/KT-22505)

</td>
</tr>

<tr filter="keep">
<td width="200">

**KEEP議論**

</td>
<td>

**`CoroutineContext`をコンテキストパラメータとして**

* KEEP提案: [CoroutineContext-context-parameter.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0443-suspend-CoroutineContext-context-parameter.md)
* YouTrack課題: [KT-15555](https://youtrack.jetbrains.com/issue/KT-15555)

</td>
</tr>

<tr filter="keep">
<td width="200">

**KEEP議論**

</td>
<td>

**リッチエラー: 動機と理論的根拠**

* KEEP提案: [rich-errors-motivation.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0441-rich-errors-motivation.md)
* YouTrack課題: [KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="keep">
<td width="200">

**KEEP議論**

</td>
<td>

**Kotlinの静的メンバーと静的拡張**

* KEEP提案: [statics.md](https://github.com/Kotlin/KEEP/blob/static-scope/proposals/static-member-type-extension.md)
* YouTrack課題: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**コレクションリテラル**

* KEEP提案: [collection-literals.md](https://github.com/Kotlin/KEEP/blob/bobko/collection-literals/proposals/collection-literals.md)
* YouTrack課題: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**明示的なバッキングフィールド**

* KEEP提案: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)
* YouTrack課題: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**バージョンオーバーロード**

* KEEP提案: [version-overloading.md](https://github.com/Kotlin/KEEP/blob/version-overloading-proposal/proposals/version-overloading.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**未使用の戻り値チェッカー**

* KEEP提案: [unused-return-value-checker.md](https://github.com/Kotlin/KEEP/blob/underscore-for-unused-local/proposals/unused-return-value-checker.md)
* YouTrack課題: [KT-12719](https://youtrack.jetbrains.com/issue/KT-12719)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**KDocの曖昧なリンクの合理化**

* KEEP提案: [streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references.md)
* GitHub課題: [dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**KDocにおける拡張へのリンクの解決**

* KEEP提案: [links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions.md)
* GitHub課題: [dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)

</td>
</tr>

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->

<tr filter="in-preview">
<td width="200">

**プレビュー中**

</td>
<td>

**データフローに基づく網羅性チェック**

* KEEP提案: [dfa-exhaustiveness.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0442-dfa-exhaustiveness.md)
* YouTrack課題: [KT-8781](https://youtrack.jetbrains.com/issue/KT-8781)
* 安定性レベル: [ベータ](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.2.20

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**コンテキストパラメータ: コンテキスト依存の宣言のサポート**

* KEEP提案: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack課題: [KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**プロパティのアノテーション利用サイトターゲットの改善**

* KEEP提案: [Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md)
* YouTrack課題: [KT-19289](https://youtrack.jetbrains.com/issue/KT-19289)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**ネストされた（非キャプチャ）型エイリアス**

* KEEP提案: [Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md)
* YouTrack課題: [KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
* 安定性レベル: [ベータ](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**コンテキスト依存の解決**

* KEEP提案: [context-sensitive-resolution.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)
* YouTrack課題: [KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**JVMでボックス化されたインライン値クラスの公開**

* KEEP提案: [jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack課題: [KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**kotlin.time.Instant**

* KEEP提案: [Instant and Clock](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/instant.md)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.1.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**Uuid**

* KEEP提案: [uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack課題: [KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.0.20

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**共通アトミックおよびアトミック配列**

* KEEP提案: [Common atomics](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/common-atomics.md)
* YouTrack課題: [KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**KMP Kotlin-から-Javaへの直接的な実体化**

* KEEP提案: [kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack課題: [KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.1.0

</td>
</tr>

<!-- the first td element should have the width="200" attribute -->

<!-- END OF IN PREVIEW BLOCK -->

<!-- STABLE BLOCK -->

<tr filter="stable">
<td width="200">

**安定版**

</td>
<td>

**`when-with-subject`におけるガード条件**

* KEEP提案: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack課題: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**複数ドル補間: 文字列リテラルにおける処理の改善**

* KEEP提案: [dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack課題: [KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**非ローカルな`break`と`continue`**

* KEEP提案: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack課題: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**`@SubclassOptInRequired`の安定化**

* KEEP提案: [subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack課題: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 提供開始バージョン: 2.1.0

</td>
</tr>

<tr filter="stable">
<td width="200">

**安定版**

</td>
<td>

**`Enum.entries`: `Enum.values()`の高性能な代替**

* KEEP提案: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack課題: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 提供開始バージョン: 2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**データオブジェクト**

* KEEP提案: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* YouTrack課題: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* 提供開始バージョン: 1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**RangeUntil演算子 `..<`**

* KEEP提案: [open-ended-ranges.md](https://github.com/Kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* YouTrack課題: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* 提供開始バージョン: 1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**確定的な非null可能型**

* KEEP提案: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack課題: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 提供開始バージョン: 1.7.0

</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->

<tr filter="revoked">
<td width="200">

**廃止済み**

</td>
<td>

**コンテキストレシーバー**

* KEEP提案: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack課題: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* 代替: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)

</td>
</tr>

<tr filter="revoked">
<td>

**廃止済み**

</td>
<td>

**Javaの合成プロパティ参照**

* KEEP提案: [references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack課題: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)

</td>
</tr>

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</tab>

<tab id="exploration-and-design" title="探索と設計">

<table>
<tr filter="exploration-and-design">
<td width="200">

**探索と設計**

</td>
<td>

**名前ベースの分割代入**

* KEEP提案: [name-based-destructuring.md](https://github.com/Kotlin/KEEP/blob/name-based-destructuring/proposals/name-based-destructuring.md)
* YouTrack課題: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索と設計**

</td>
<td>

**不変性のサポート**

* KEEPノート: [immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack課題: [KT-77734](https://youtrack.jetbrains.com/issue/KT-77734)

</td>
</tr>
</table>

</tab>

<tab id="keep-preparation" title="KEEP議論">

<table>
<tr filter="keep">
<td width="200">

**KEEP議論**

</td>
<td>

**コンパイル時定数の改善**

* KEEP提案: [improve-compile-time-constants.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md)
* YouTrack課題: [KT-22505](https://youtrack.jetbrains.com/issue/KT-22505)

</td>
</tr>

<tr filter="keep">
<td width="200">

**KEEP議論**

</td>
<td>

**`CoroutineContext`をコンテキストパラメータとして**

* KEEP提案: [CoroutineContext-context-parameter.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0443-suspend-CoroutineContext-context-parameter.md)
* YouTrack課題: [KT-15555](https://youtrack.jetbrains.com/issue/KT-15555)

</td>
</tr>

<tr filter="keep">
<td width="200">

**KEEP議論**

</td>
<td>

**リッチエラー: 動機と理論的根拠**

* KEEP提案: [rich-errors-motivation.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0441-rich-errors-motivation.md)
* YouTrack課題: [KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="keep">
<td width="200">

**KEEP議論**

</td>
<td>

**Kotlinの静的メンバーと静的拡張**

* KEEP提案: [statics.md](https://github.com/Kotlin/KEEP/blob/static-scope/proposals/static-member-type-extension.md)
* YouTrack課題: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**コレクションリテラル**

* KEEP提案: [collection-literals.md](https://github.com/Kotlin/KEEP/blob/bobko/collection-literals/proposals/collection-literals.md)
* YouTrack課題: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**明示的なバッキングフィールド**

* KEEP提案: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)
* YouTrack課題: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**バージョンオーバーロード**

* KEEP提案: [version-overloading.md](https://github.com/Kotlin/KEEP/blob/version-overloading-proposal/proposals/version-overloading.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**未使用の戻り値チェッカー**

* KEEP提案: [unused-return-value-checker.md](https://github.com/Kotlin/KEEP/blob/underscore-for-unused-local/proposals/unused-return-value-checker.md)
* YouTrack課題: [KT-12719](https://youtrack.jetbrains.01.com/issue/KT-12719)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**KDocの曖昧なリンクの合理化**

* KEEP提案: [streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references.md)
* GitHub課題: [dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**KDocにおける拡張へのリンクの解決**

* KEEP提案: [links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions.md)
* GitHub課題: [dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)

</td>
</tr>
</table>

</tab>

<tab id="in-preview" title="プレビュー中">

<table>
<tr filter="in-preview">
<td width="200">

**プレビュー中**

</td>
<td>

**データフローに基づく網羅性チェック**

* KEEP提案: [dfa-exhaustiveness.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0442-dfa-exhaustiveness.md)
* YouTrack課題: [KT-8781](https://youtrack.jetbrains.com/issue/KT-8781)
* 安定性レベル: [ベータ](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.2.20

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**コンテキストパラメータ: コンテキスト依存の宣言のサポート**

* KEEP提案: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack課題: [KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**プロパティのアノテーション利用サイトターゲットの改善**

* KEEP提案: [Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md)
* YouTrack課題: [KT-19289](https://youtrack.jetbrains.com/issue/KT-19289)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**ネストされた（非キャプチャ）型エイリアス**

* KEEP提案: [Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md)
* YouTrack課題: [KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
* 安定性レベル: [ベータ](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**コンテキスト依存の解決**

* KEEP提案: [context-sensitive-resolution.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)
* YouTrack課題: [KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**JVMでボックス化されたインライン値クラスの公開**

* KEEP提案: [jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack課題: [KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**kotlin.time.Instant**

* KEEP提案: [Instant and Clock](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/instant.md)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.1.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**Uuid**

* KEEP提案: [uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack課題: [KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.0.20

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**共通アトミックおよびアトミック配列**

* KEEP提案: [Common atomics](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/common-atomics.md)
* YouTrack課題: [KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**KMP Kotlin-から-Javaへの直接的な実体化**

* KEEP提案: [kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack課題: [KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
* 安定性レベル: [実験的](components-stability.md#stability-levels-explained)
* 提供開始バージョン: 2.1.0

</td>
</tr>
</table>

</tab>

<tab id="stable" title="安定版">

<table>
<tr filter="stable">
<td width="200">

**安定版**

</td>
<td>

**`when-with-subject`におけるガード条件**

* KEEP提案: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack課題: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**複数ドル補間: 文字列リテラルにおける処理の改善**

* KEEP提案: [dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack課題: [KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**非ローカルな`break`と`continue`**

* KEEP提案: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack課題: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 提供開始バージョン: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**`@SubclassOptInRequired`の安定化**

* KEEP提案: [subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack課題: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 提供開始バージョン: 2.1.0

</td>
</tr>

<tr filter="stable">
<td width="200">

**安定版**

</td>
<td>

**`Enum.entries`: `Enum.values()`の高性能な代替**

* KEEP提案: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack課題: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 提供開始バージョン: 2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**データオブジェクト**

* KEEP提案: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* YouTrack課題: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* 提供開始バージョン: 1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**RangeUntil演算子 `..<`**

* KEEP提案: [open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* YouTrack課題: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* 提供開始バージョン: 1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**確定的な非null可能型**

* KEEP提案: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack課題: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 提供開始バージョン: 1.7.0

</td>
</tr>
</table>

</tab>

<tab id="revoked" title="廃止済み">

<table>
<tr filter="revoked">
<td width="200">

**廃止済み**

</td>
<td>

**コンテキストレシーバー**

* KEEP提案: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack課題: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* 代替: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)

</td>
</tr>

<tr filter="revoked">
<td>

**廃止済み**

</td>
<td>

**Javaの合成プロパティ参照**

* KEEP提案: [references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack課題: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)

</td>
</tr>
</table>

</tab>
</tabs>