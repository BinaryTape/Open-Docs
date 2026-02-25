[//]: # (title: Kotlin 言語の機能と提案)

<web-summary>Kotlin の機能のライフサイクルについて学びましょう。このページには、Kotlin 言語の機能と設計提案の全リストが含まれています。</web-summary>

JetBrains は、実用的な設計に基づいた [Kotlin 言語進化の原則](kotlin-evolution-principles.md)に従って、Kotlin 言語を進化させています。

> 言語機能の提案は Kotlin 1.7.0 以降のものがリストされています。
>
> 言語機能のステータスの説明については、[Kotlin 進化の原則ドキュメント](kotlin-evolution-principles.md#pre-stable-features)を参照してください。
>
{style="note"}

<tabs>
<tab id="all-proposals" title="すべて">

<!-- <include element-id="all-proposals" from="all-proposals.topic"/> -->

<snippet id="source">
<table style="header-column">

<!-- the first td element should have the width="200" attribute -->

<!-- EXPLORATION AND DESIGN BLOCK -->

<tr filter="exploration-and-design">
<td width="200">

**検討および設計**

</td>
<td>

**名前ベースの分割代入 (Name-based destructuring)**

* KEEP 提案: [name-based-destructuring.md](https://github.com/Kotlin/KEEP/blob/name-based-destructuring/proposals/name-based-destructuring.md)
* YouTrack イシュー: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**検討および設計**

</td>
<td>

**不変性のサポート (Support immutability)**

* KEEP ノート: [immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack イシュー: [KT-77734](https://youtrack.jetbrains.com/issue/KT-77734)

</td>
</tr>

<!-- END OF EXPLORATION AND DESIGN BLOCK -->

<!-- KEEP DISCUSSION BLOCK -->

<tr filter="keep">
<td width="200">

**KEEP の議論**

</td>
<td>

**コンパイル時定数の改善**

* KEEP 提案: [improve-compile-time-constants.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md)
* YouTrack イシュー: [KT-22505](https://youtrack.jetbrains.com/issue/KT-22505)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP の議論**

</td>
<td>

**コンテキストパラメータとしての `CoroutineContext`**

* KEEP 提案: [CoroutineContext-context-parameter.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0443-suspend-CoroutineContext-context-parameter.md)
* YouTrack イシュー: [KT-15555](https://youtrack.jetbrains.com/issue/KT-15555)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP の議論**

</td>
<td>

**Rich Errors: 動機と根拠**

* KEEP 提案: [rich-errors-motivation.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0441-rich-errors-motivation.md)
* YouTrack イシュー: [KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP の議論**

</td>
<td>

**Kotlin の static および static 拡張**

* KEEP 提案: [statics.md](https://github.com/Kotlin/KEEP/blob/static-scope/proposals/static-member-type-extension.md)
* YouTrack イシュー: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP の議論**

</td>
<td>

**コレクションリテラル (Collection literals)**

* KEEP 提案: [collection-literals.md](https://github.com/Kotlin/KEEP/blob/bobko/collection-literals/proposals/collection-literals.md)
* YouTrack イシュー: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP の議論**

</td>
<td>

**バージョンオーバーロード (Version overloading)**

* KEEP 提案: [version-overloading.md](https://github.com/Kotlin/KEEP/blob/version-overloading-proposal/proposals/version-overloading.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP の議論**

</td>
<td>

**KDoc の曖昧なリンクの合理化**

* KEEP 提案: [streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references.md)
* GitHub イシュー: [dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP の議論**

</td>
<td>

**KDoc における拡張へのリンクの解決**

* KEEP 提案: [links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions.md)
* GitHub イシュー: [dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)

</td>
</tr>

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->

<tr filter="in-preview">
<td width="200">

**プレビュー中**

</td>
<td>

**明示的なバッキングフィールド (Explicit backing fields)**

* KEEP 提案: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)
* YouTrack イシュー: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.3.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**コンテキストパラメータ: コンテキストに依存した宣言のサポート**

* KEEP 提案: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack イシュー: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**未使用の戻り値チェッカー (Unused return value checker)**

* KEEP 提案: [unused-return-value-checker.md](https://github.com/Kotlin/KEEP/blob/underscore-for-unused-local/proposals/unused-return-value-checker.md)
* YouTrack イシュー: [KT-12719](https://youtrack.jetbrains.com/issue/KT-12719)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.3.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**プロパティにおけるアノテーションの使用場所ターゲット (use-site targets) の改善**

* KEEP 提案: [Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md)
* YouTrack イシュー: [KT-73255](https://youtrack.jetbrains.com/issue/KT-73255)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**コンテキストに依存した解決 (Context-sensitive resolution)**

* KEEP 提案: [context-sensitive-resolution.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)
* YouTrack イシュー: [KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**JVM でのボックス化されたインライン値クラスの公開**

* KEEP 提案: [jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack イシュー: [KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**Uuid**

* KEEP 提案: [uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack イシュー: [KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.0.20

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**共通の Atomic および Atomic 配列 (Common Atomics and Atomic Arrays)**

* KEEP 提案: [Common atomics](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/common-atomics.md)
* YouTrack イシュー: [KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**KMP Kotlin から Java への直接的な actual 実装 (direct actualization)**

* KEEP 提案: [kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack イシュー: [KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.1.0

</td>
</tr>

<!-- END OF IN PREVIEW BLOCK -->

<!-- STABLE BLOCK -->

<tr filter="stable">
<td width="200">

**安定版**

</td>
<td>

**データフローに基づく網羅性チェック (Data flow-based exhaustiveness checking)**

* KEEP 提案: [dfa-exhaustiveness.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0442-dfa-exhaustiveness.md)
* YouTrack イシュー: [KT-8781](https://youtrack.jetbrains.com/issue/KT-8781)
* 利用可能バージョン: 2.2.20, 2.3.0 以降で安定

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**ネストされた（キャプチャしない）型エイリアス**

* KEEP 提案: [Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md)
* YouTrack イシュー: [KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
* 利用可能バージョン: 2.2.0, 2.3.0 以降で安定

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**kotlin.time.Instant**

* KEEP 提案: [Instant and Clock](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/instant.md)
* YouTrack イシュー: [KT-80778](https://youtrack.jetbrains.com/issue/KT-80778)
* 利用可能バージョン: 2.1.0, 2.3.0 以降で安定

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**引数付き when におけるガード条件 (Guard conditions in when-with-subject)**

* KEEP 提案: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack イシュー: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**マルチダラー補間: 文字列リテラル内での `$` の扱いの改善**

* KEEP 提案: [dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack イシュー: [KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**非ローカルな `break` および `continue`**

* KEEP 提案: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack イシュー: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**`@SubclassOptInRequired` の安定化**

* KEEP 提案: [subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack イシュー: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 利用可能バージョン: 2.1.0

</td>
</tr>

<tr filter="stable">
<td width="200">

**安定版**

</td>
<td>

**`Enum.entries`: `Enum.values()` に代わる高パフォーマンスな代替手段**

* KEEP 提案: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack イシュー: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 利用可能バージョン: 2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**データオブジェクト (Data objects)**

* KEEP 提案: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* YouTrack イシュー: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* 利用可能バージョン: 1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**RangeUntil 演算子 `..<`**

* KEEP 提案: [open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* YouTrack イシュー: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* 利用可能バージョン: 1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**絶対に null にならない型 (Definitely non-nullable types)**

* KEEP 提案: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack イシュー: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 利用可能バージョン: 1.7.0

</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->

<tr filter="revoked">
<td width="200">

**取り消し済み**

</td>
<td>

**コンテキストレシーバー (Context receivers)**

* KEEP 提案: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack イシュー: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md) に置き換えられました

</td>
</tr>

<tr filter="revoked">
<td>

**取り消し済み**

</td>
<td>

**Java シンセティックプロパティへの参照**

* KEEP 提案: [references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack イシュー: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)

</td>
</tr>

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</tab>

<tab id="exploration-and-design" title="検討および設計">

<table>
<tr filter="exploration-and-design">
<td width="200">

**検討および設計**

</td>
<td>

**名前ベースの分割代入 (Name-based destructuring)**

* KEEP 提案: [name-based-destructuring.md](https://github.com/Kotlin/KEEP/blob/name-based-destructuring/proposals/name-based-destructuring.md)
* YouTrack イシュー: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**検討および設計**

</td>
<td>

**不変性のサポート (Support immutability)**

* KEEP ノート: [immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack イシュー: [KT-77734](https://youtrack.jetbrains.com/issue/KT-77734)

</td>
</tr>
</table>

</tab>

<tab id="keep-preparation" title="KEEP の議論">

<table>
<tr filter="keep">
<td width="200">

**KEEP の議論**

</td>
<td>

**コンパイル時定数の改善**

* KEEP 提案: [improve-compile-time-constants.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md)
* YouTrack イシュー: [KT-22505](https://youtrack.jetbrains.com/issue/KT-22505)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP の議論**

</td>
<td>

**コンテキストパラメータとしての `CoroutineContext`**

* KEEP 提案: [CoroutineContext-context-parameter.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0443-suspend-CoroutineContext-context-parameter.md)
* YouTrack イシュー: [KT-15555](https://youtrack.jetbrains.com/issue/KT-15555)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP の議論**

</td>
<td>

**Rich Errors: 動機と根拠**

* KEEP 提案: [rich-errors-motivation.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0441-rich-errors-motivation.md)
* YouTrack イシュー: [KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP の議論**

</td>
<td>

**Kotlin の static および static 拡張**

* KEEP 提案: [statics.md](https://github.com/Kotlin/KEEP/blob/static-scope/proposals/static-member-type-extension.md)
* YouTrack イシュー: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP の議論**

</td>
<td>

**コレクションリテラル (Collection literals)**

* KEEP 提案: [collection-literals.md](https://github.com/Kotlin/KEEP/blob/bobko/collection-literals/proposals/collection-literals.md)
* YouTrack イシュー: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP の議論**

</td>
<td>

**バージョンオーバーロード (Version overloading)**

* KEEP 提案: [version-overloading.md](https://github.com/Kotlin/KEEP/blob/version-overloading-proposal/proposals/version-overloading.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP の議論**

</td>
<td>

**KDoc の曖昧なリンクの合理化**

* KEEP 提案: [streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references.md)
* GitHub イシュー: [dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP の議論**

</td>
<td>

**KDoc における拡張へのリンクの解決**

* KEEP 提案: [links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions.md)
* GitHub イシュー: [dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)

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

**明示的なバッキングフィールド (Explicit backing fields)**

* KEEP 提案: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)
* YouTrack イシュー: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.3.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**コンテキストパラメータ: コンテキストに依存した宣言のサポート**

* KEEP 提案: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack イシュー: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**未使用の戻り値チェッカー (Unused return value checker)**

* KEEP 提案: [unused-return-value-checker.md](https://github.com/Kotlin/KEEP/blob/underscore-for-unused-local/proposals/unused-return-value-checker.md)
* YouTrack イシュー: [KT-12719](https://youtrack.jetbrains.com/issue/KT-12719)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.3.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**プロパティにおけるアノテーションの使用場所ターゲット (use-site targets) の改善**

* KEEP 提案: [Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md)
* YouTrack イシュー: [KT-73255](https://youtrack.jetbrains.com/issue/KT-73255)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**コンテキストに依存した解決 (Context-sensitive resolution)**

* KEEP 提案: [context-sensitive-resolution.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)
* YouTrack イシュー: [KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**JVM でのボックス化されたインライン値クラスの公開**

* KEEP 提案: [jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack イシュー: [KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**Uuid**

* KEEP 提案: [uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack イシュー: [KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.0.20

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**共通の Atomic および Atomic 配列 (Common Atomics and Atomic Arrays)**

* KEEP 提案: [Common atomics](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/common-atomics.md)
* YouTrack イシュー: [KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**KMP Kotlin から Java への直接的な actual 実装 (direct actualization)**

* KEEP 提案: [kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack イシュー: [KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
* 安定性レベル: [試験的 (Experimental)](components-stability.md#stability-levels-explained)
* 利用可能バージョン: 2.1.0

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

**データフローに基づく網羅性チェック (Data flow-based exhaustiveness checking)**

* KEEP 提案: [dfa-exhaustiveness.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0442-dfa-exhaustiveness.md)
* YouTrack イシュー: [KT-8781](https://youtrack.jetbrains.com/issue/KT-8781)
* 利用可能バージョン: 2.2.20, 2.3.0 以降で安定

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**ネストされた（キャプチャしない）型エイリアス**

* KEEP 提案: [Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md)
* YouTrack イシュー: [KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
* 利用可能バージョン: 2.2.0, 2.3.0 以降で安定

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**kotlin.time.Instant**

* KEEP 提案: [Instant and Clock](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/instant.md)
* YouTrack イシュー: [KT-80778](https://youtrack.jetbrains.com/issue/KT-80778)
* 利用可能バージョン: 2.1.0, 2.3.0 以降で安定

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**引数付き when におけるガード条件 (Guard conditions in when-with-subject)**

* KEEP 提案: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack イシュー: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**マルチダラー補間: 文字列リテラル内での `$` の扱いの改善**

* KEEP 提案: [dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack イシュー: [KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**非ローカルな `break` および `continue`**

* KEEP 提案: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack イシュー: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 利用可能バージョン: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**`@SubclassOptInRequired` の安定化**

* KEEP 提案: [subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack イシュー: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 利用可能バージョン: 2.1.0

</td>
</tr>

<tr filter="stable">
<td width="200">

**安定版**

</td>
<td>

**`Enum.entries`: `Enum.values()` に代わる高パフォーマンスな代替手段**

* KEEP 提案: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack イシュー: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 利用可能バージョン: 2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**データオブジェクト (Data objects)**

* KEEP 提案: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* YouTrack イシュー: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* 利用可能バージョン: 1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**RangeUntil 演算子 `..<`**

* KEEP 提案: [open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* YouTrack イシュー: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* 利用可能バージョン: 1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**絶対に null にならない型 (Definitely non-nullable types)**

* KEEP 提案: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack イシュー: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 利用可能バージョン: 1.7.0

</td>
</tr>
</table>

</tab>

<tab id="revoked" title="取り消し済み">

<table>
<tr filter="revoked">
<td width="200">

**取り消し済み**

</td>
<td>

**コンテキストレシーバー (Context receivers)**

* KEEP 提案: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack イシュー: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md) に置き換えられました

</td>
</tr>

<tr filter="revoked">
<td>

**取り消し済み**

</td>
<td>

**Java シンセティックプロパティへの参照**

* KEEP 提案: [references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack イシュー: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)

</td>
</tr>
</table>

</tab>
</tabs>