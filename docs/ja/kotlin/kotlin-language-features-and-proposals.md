[//]: # (title: Kotlin言語の機能と提案)
[//]: # (description: Kotlinの機能のライフサイクルについて学びます。このページには、Kotlin言語の機能と設計提案の全リストが含まれています。)

JetBrainsは、[Kotlin言語の進化原則](kotlin-evolution-principles.md)に従い、実用的な設計に導かれながらKotlin言語を進化させています。

> 言語機能の提案はKotlin 1.7.0以降のものが記載されています。
>
> 言語機能のステータスに関する説明は、[Kotlin進化原則のドキュメント](kotlin-evolution-principles.md#pre-stable-features)を参照してください。
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

**検討と設計**

</td>
<td>

**Kotlinの静的メンバーと静的拡張**

* KEEP提案: [statics.md](https://github.com/Kotlin/KEEP/blob/statics/proposals/statics.md)
* YouTrack Issue: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**検討と設計**

</td>
<td>

**コレクションリテラル**

* KEEP提案: 未定義
* YouTrack Issue: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**検討と設計**

</td>
<td>

**エラーと例外のためのUnion型**

* KEEP提案: 未定義
* YouTrack Issue: [KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**検討と設計**

</td>
<td>

**名前ベースの分割宣言**

* KEEP提案: 未定義
* YouTrack Issue: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**検討と設計**

</td>
<td>

**不変性のサポート**

* KEEPノート: [immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack Issue: [KT-1179](https://youtrack.jetbrains.com/issue/KT-1179)

</td>
</tr>

<!-- END OF EXPLORATION AND DESIGN BLOCK -->

<!-- KEEP DISCUSSION BLOCK -->

<tr filter="keep">
<td width="200">

**KEEP議論**

</td>
<td>

**KMP Kotlin-to-Java直接具象化**

* KEEP提案: [kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack Issue: [KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**kotlin.time.Instant**

* KEEP提案: [Instant and Clock](https://github.com/dkhalanskyjb/KEEP/blob/dkhalanskyjb-instant/proposals/stdlib/instant.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**共通アトミックとアトミック配列**

* KEEP提案: [Common atomics](https://github.com/Kotlin/KEEP/blob/mvicsokolova/common-atomics/proposals/common-atomics.md)
* YouTrack Issue: [KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**プロパティにおけるアノテーション使用サイトターゲットの改善**

* KEEP提案: [Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/change-defaulting-rule/proposals/change-defaulting-rule.md)
* YouTrack Issue: [KT-19289](https://youtrack.jetbrains.com/issue/KT-19289)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**ネストされた (非キャプチャ) 型エイリアス**

* KEEP提案: [Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/nested-typealias/proposals/nested-typealias.md)
* YouTrack Issue: [KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**KDocの曖昧なリンクの合理化**

* KEEP提案: [streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references.md)
* GitHub Issue: [dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**KDocにおける拡張機能へのリンクの解決**

* KEEP提案: [links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions.md)
* GitHub Issue: [dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**Uuid**

* KEEP提案: [uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack Issue: [KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**期待される型を使用した解決の改善**

* KEEP提案: [improved-resolution-expected-type.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/improved-resolution-expected-type.md)
* YouTrack Issue: [KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**JVMでのボックス化されたインライン値クラスの公開**

* KEEP提案: [jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack Issue: [KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**明示的なバッキングフィールド: 同じプロパティに対して`public`と`private`の両方の型**

* KEEP提案: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields-re/proposals/explicit-backing-fields.md)
* YouTrack Issue: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**コンテキストパラメータ: コンテキスト依存宣言のサポート**

* KEEP提案: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack Issue: [KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP議論**

</td>
<td>

**Javaの合成プロパティ参照**

* KEEP提案: [references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack Issue: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)
* Target version: 2.2.0

</td>
</tr>

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->

<tr filter="in-preview">
<td width="200">

**プレビュー中**

</td>
<td>

**`when`-with-subjectにおけるガード条件**

* KEEP提案: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack Issue: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* Available since: 2.1.0

</td>
</tr>

<!-- the first td element should have the width="200" attribute -->

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**`@SubclassOptInRequired`の安定化**

* KEEP提案: [subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack Issue: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* Available since: 2.1.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**マルチダラー補間: 文字列リテラル内の` ` `の処理の改善**

* KEEP提案: [dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack Issue: [KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* Available since: 2.1.0

</td>
</tr>

<tr filter="in-preview">
<td>

**プレビュー中**

</td>
<td>

**非ローカルな`break`と`continue`**

* KEEP提案: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack Issue: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* Available since: 2.1.0

</td>
</tr>

<!-- END OF IN PREVIEW BLOCK -->

<!-- STABLE BLOCK -->

<tr filter="stable">
<td width="200">

**安定版**

</td>
<td>

**`Enum.entries`: `Enum.values()`の高性能な代替**

* KEEP提案: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack Issue: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* Target version: 2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**データオブジェクト**

* KEEP提案: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* YouTrack Issue: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* Target version: 1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**`RangeUntil`演算子 `..<`**

* KEEP提案: [open-ended-ranges.md](https://github.com/Kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* YouTrack Issue: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* Target version: 1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**安定版**

</td>
<td>

**確定的に非Null型**

* KEEP提案: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack Issue: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* Target version: 1.7.0

</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->

<tr filter="revoked">
<td width="200">

**廃止**

</td>
<td>

**コンテキストレシーバー**

* KEEP提案: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack Issue: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)

</td>
</tr>

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</tab>

<tab id="exploration-and-design" title="検討と設計">

<include element-id="source" use-filter="empty,exploration-and-design" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="keep-preparation" title="KEEP議論">

<include element-id="source" use-filter="empty,keep" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="in-preview" title="プレビュー中">

<include element-id="source" use-filter="empty,in-preview" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="stable" title="安定版">

<include element-id="source" use-filter="empty,stable" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="revoked" title="廃止">

<include element-id="source" use-filter="empty,revoked" from="kotlin-language-features-and-proposals.md"/>

</tab>
</tabs>