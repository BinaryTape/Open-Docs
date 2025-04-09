---
title: Kotlinの言語機能と提案
description: Kotlinの機能のライフサイクルについて学びます。このページには、Kotlinの言語機能と設計提案の完全なリストが含まれています。
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

JetBrainsは、実用的な設計に基づいて、[Kotlin言語の進化の原則](kotlin-evolution-principles)に従ってKotlin言語を進化させています。

:::note
言語機能の提案はKotlin 1.7.0以降のものです。

言語機能のステータスの説明については、
[Kotlinの進化の原則に関するドキュメント](kotlin-evolution-principles#pre-stable-features)を参照してください。

:::

<Tabs>
<TabItem value="all-proposals" label="すべて">

<!-- <include element-id="all-proposals" from="all-proposals.topic"/> -->

{/* START_SNIPPET: source */}
<table >

<!-- EXPLORATION AND DESIGN BLOCK -->
<tr filter="exploration-and-design">
<td width="200">

**探索と設計**
</td>
<td>

**Kotlinのstaticsとstatic extensions**

* KEEP提案: [statics.md](https://github.com/Kotlin/KEEP/blob/statics/proposals/statics)
* YouTrack issue: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**探索と設計**
</td>
<td>

**コレクションリテラル**

* KEEP提案: 未定義
* YouTrack issue: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**探索と設計**
</td>
<td>

**エラーと例外のUnion types**

* KEEP提案: 未定義
* YouTrack issue: [KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**探索と設計**
</td>
<td>

**Name-based destructuring**

* KEEP提案: 未定義
* YouTrack issue: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**探索と設計**
</td>
<td>

**Support immutability**

* KEEP notes: [immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes#immutability-and-value-classes)
* YouTrack issue: [KT-1179](https://youtrack.jetbrains.com/issue/KT-1179)
</td>
</tr>

<!-- END OF EXPLORATION AND DESIGN BLOCK -->

<!-- KEEP DISCUSSION BLOCK -->
<tr filter="keep">
<td width="200">

**KEEP議論**
</td>
<td>

**KMP Kotlin-to-Java direct actualization**

* KEEP提案: [kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization)
* YouTrack issue: [KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP議論**
</td>
<td>

**kotlin.time.Instant**

* KEEP提案: [Instant and Clock](https://github.com/dkhalanskyjb/KEEP/blob/dkhalanskyjb-instant/proposals/stdlib/instant)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP議論**
</td>
<td>

**Common Atomics and Atomic Arrays**

* KEEP提案: [Common atomics](https://github.com/Kotlin/KEEP/blob/mvicsokolova/common-atomics/proposals/common-atomics)
* YouTrack issue: [KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP議論**
</td>
<td>

**プロパティのアノテーションuse-site targetsの改善**

* KEEP提案: [Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/change-defaulting-rule/proposals/change-defaulting-rule)
* YouTrack issue: [KT-19289](https://youtrack.jetbrains.com/issue/KT-19289)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP議論**
</td>
<td>

**Nested (non-capturing) type aliases**

* KEEP提案: [Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/nested-typealias/proposals/nested-typealias)
* YouTrack issue: [KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP議論**
</td>
<td>

**KDoc ambiguity linksの合理化**

* KEEP提案: [streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references)
* GitHub issues: [dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP議論**
</td>
<td>

**KDoc内のextensionsへのリンクの解決**

* KEEP提案: [links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions)
* GitHub issue: [dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP議論**
</td>
<td>

**Uuid**

* KEEP提案: [uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid)
* YouTrack issue: [KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP議論**
</td>
<td>

**expected typeを使用した解決の改善**

* KEEP提案: [improved-resolution-expected-type.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/improved-resolution-expected-type)
* YouTrack issue: [KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP議論**
</td>
<td>

**JVMでboxed inline value classesを公開する**

* KEEP提案: [jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed)
* YouTrack issue: [KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP議論**
</td>
<td>

**Explicit backing fields: 同じプロパティに対して`public`と`private`の両方の型**

* KEEP提案: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields-re/proposals/explicit-backing-fields)
* YouTrack issue: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP議論**
</td>
<td>

**Context parameters: コンテキスト依存の宣言のサポート**

* KEEP提案: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters)
* YouTrack issue: [KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP議論**
</td>
<td>

**Java synthetic property references**

* KEEP提案: [references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties)
* YouTrack issue: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)
* Target version: 2.2.0
</td>
</tr>

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->
<tr filter="in-preview">
<td width="200">

**プレビュー**
</td>
<td>

**when-with-subjectのGuard conditions**

* KEEP提案: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards)
* YouTrack issue: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* Available since: 2.1.0
</td>
</tr>

<!-- the first td element should have the width="200" attribute -->
<tr filter="stable">
<td>

**安定版**
</td>
<td>

**Stabilized `@SubclassOptInRequired`**

* KEEP提案: [subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required)
* YouTrack issue: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* Available since: 2.1.0
</td>
</tr>
<tr filter="in-preview">
<td>

**プレビュー**
</td>
<td>

**Multidollar interpolation: 文字列リテラルにおける`$\\{`の処理の改善**

* KEEP提案: [dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape)
* YouTrack issue: [KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* Available since: 2.1.0
</td>
</tr>
<tr filter="in-preview">
<td>

**プレビュー**
</td>
<td>

**Non-local `break`と`continue`**

* KEEP提案: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas)
* YouTrack issue: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
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

**`Enum.entries`: `Enum.values()`のパフォーマンスの高い代替**

* KEEP提案: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries)
* YouTrack issue: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* Target version: 2.0.0
</td>
</tr>
<tr filter="stable">
<td>

**安定版**
</td>
<td>

**Data objects**

* KEEP提案: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects)
* YouTrack issue: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* Target version: 1.9.0
</td>
</tr>
<tr filter="stable">
<td>

**安定版**
</td>
<td>

**RangeUntil operator `..<`**

* KEEP提案: [open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges)
* YouTrack issue: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* Target version: 1.7.20
</td>
</tr>
<tr filter="stable">
<td>

**安定版**
</td>
<td>

**Definitely non-nullable types**

* KEEP提案: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types)
* YouTrack issue: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* Target version: 1.7.0
</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->
<tr filter="revoked">
<td width="200">

**Revoked**
</td>
<td>

**Context receivers**

* KEEP提案: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers)
* YouTrack issue: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
</td>
</tr>
</table>

{/* END_SNIPPET: source */}

<!-- END OF REVOKED BLOCK -->

</TabItem>

<TabItem value="exploration-and-design" label="探索と設計">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,exploration-and-design */}

</TabItem>

<TabItem value="keep-preparation" label="KEEP議論">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,keep */}

</TabItem>

<TabItem value="in-preview" label="プレビュー">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,in-preview */}

</TabItem>

<TabItem value="stable" label="安定版">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,stable */}

</TabItem>

<TabItem value="revoked" label="Revoked">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,revoked */}

</TabItem>
</Tabs>