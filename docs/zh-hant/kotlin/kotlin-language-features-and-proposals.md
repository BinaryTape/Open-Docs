---
title: "Kotlin 語言特性與提案"
description: "瞭解 Kotlin 特性的生命週期。本頁包含 Kotlin 語言特性與設計提案的完整清單。"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

JetBrains 根據 [Kotlin 語言演進原則](kotlin-evolution-principles) 演進 Kotlin 語言，
並以務實的設計為指導。

:::note
語言特性提案列於 Kotlin 1.7.0 及更高版本。

請參閱
[Kotlin 演進原則文檔](kotlin-evolution-principles#pre-stable-features)中關於語言特性狀態的說明。

:::

<Tabs>
<TabItem value="all-proposals" label="All">

<!-- <include element-id="all-proposals" from="all-proposals.topic"/> -->

{/* START_SNIPPET: source */}
<table >

<!-- EXPLORATION AND DESIGN BLOCK -->
<tr filter="exploration-and-design">
<td width="200">

**探索與設計 (Exploration and design)**
</td>
<td>

**Kotlin 靜態和靜態擴展 (Kotlin statics and static extensions)**

* KEEP 提案：[statics.md](https://github.com/Kotlin/KEEP/blob/statics/proposals/statics)
* YouTrack issue: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**探索與設計 (Exploration and design)**
</td>
<td>

**集合字面量 (Collection literals)**

* KEEP 提案：未定義 (Not defined)
* YouTrack issue: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**探索與設計 (Exploration and design)**
</td>
<td>

**錯誤和異常的聯合類型 (Union types for errors and exceptions)**

* KEEP 提案：未定義 (Not defined)
* YouTrack issue: [KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**探索與設計 (Exploration and design)**
</td>
<td>

**基於名稱的解構 (Name-based destructuring)**

* KEEP 提案：未定義 (Not defined)
* YouTrack issue: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**探索與設計 (Exploration and design)**
</td>
<td>

**支持不可變性 (Support immutability)**

* KEEP notes: [immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes#immutability-and-value-classes)
* YouTrack issue: [KT-1179](https://youtrack.jetbrains.com/issue/KT-1179)
</td>
</tr>

<!-- END OF EXPLORATION AND DESIGN BLOCK -->

<!-- KEEP DISCUSSION BLOCK -->
<tr filter="keep">
<td width="200">

**KEEP 討論 (KEEP discussion)**
</td>
<td>

**KMP Kotlin-to-Java 直接實現 (KMP Kotlin-to-Java direct actualization)**

* KEEP 提案：[kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization)
* YouTrack issue: [KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 討論 (KEEP discussion)**
</td>
<td>

**kotlin.time.Instant**

* KEEP 提案：[Instant and Clock](https://github.com/dkhalanskyjb/KEEP/blob/dkhalanskyjb-instant/proposals/stdlib/instant)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 討論 (KEEP discussion)**
</td>
<td>

**Common Atomics and Atomic Arrays**

* KEEP 提案：[Common atomics](https://github.com/Kotlin/KEEP/blob/mvicsokolova/common-atomics/proposals/common-atomics)
* YouTrack issue: [KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 討論 (KEEP discussion)**
</td>
<td>

**改進屬性上的註解使用位置目標 (Improvements to annotation use-site targets on properties)**

* KEEP 提案：[Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/change-defaulting-rule/proposals/change-defaulting-rule)
* YouTrack issue: [KT-19289](https://youtrack.jetbrains.com/issue/KT-19289)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 討論 (KEEP discussion)**
</td>
<td>

**嵌套（非捕獲）類型別名 (Nested (non-capturing) type aliases)**

* KEEP 提案：[Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/nested-typealias/proposals/nested-typealias)
* YouTrack issue: [KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 討論 (KEEP discussion)**
</td>
<td>

**簡化 KDoc 歧義連結 (Streamline KDoc ambiguity links)**

* KEEP 提案：[streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references)
* GitHub issues: [dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 討論 (KEEP discussion)**
</td>
<td>

**解析 KDoc 中擴展的連結 (Resolution of links to extensions in KDoc)**

* KEEP 提案：[links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions)
* GitHub issue: [dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 討論 (KEEP discussion)**
</td>
<td>

**Uuid**

* KEEP 提案：[uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid)
* YouTrack issue: [KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 討論 (KEEP discussion)**
</td>
<td>

**使用預期類型改進解析 (Improve resolution using expected type)**

* KEEP 提案：[improved-resolution-expected-type.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/improved-resolution-expected-type)
* YouTrack issue: [KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 討論 (KEEP discussion)**
</td>
<td>

**在 JVM 中公開 boxed inline value classes**

* KEEP 提案：[jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed)
* YouTrack issue: [KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 討論 (KEEP discussion)**
</td>
<td>

**顯式後端欄位：同一屬性的 `public` 和 `private` 類型 (Explicit backing fields: both `public` and `private` type for the same property)**

* KEEP 提案：[explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields-re/proposals/explicit-backing-fields)
* YouTrack issue: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 討論 (KEEP discussion)**
</td>
<td>

**Context parameters: support for context-dependent declarations**

* KEEP 提案：[context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters)
* YouTrack issue: [KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 討論 (KEEP discussion)**
</td>
<td>

**Java synthetic property references**

* KEEP 提案：[references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties)
* YouTrack issue: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)
* Target version: 2.2.0
</td>
</tr>

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->
<tr filter="in-preview">
<td width="200">

**預覽中 (In preview)**
</td>
<td>

**when-with-subject 中的 Guard 條件 (Guard conditions in when-with-subject)**

* KEEP 提案：[guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards)
* YouTrack issue: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* Available since: 2.1.0
</td>
</tr>

<!-- the first td element should have the width="200" attribute -->
<tr filter="stable">
<td>

**穩定 (Stable)**
</td>
<td>

**穩定 `@SubclassOptInRequired`**

* KEEP 提案：[subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required)
* YouTrack issue: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* Available since: 2.1.0
</td>
</tr>
<tr filter="in-preview">
<td>

**預覽中 (In preview)**
</td>
<td>

**Multidollar interpolation: improved handling of `${}` in string literals**

* KEEP 提案：[dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape)
* YouTrack issue: [KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* Available since: 2.1.0
</td>
</tr>
<tr filter="in-preview">
<td>

**預覽中 (In preview)**
</td>
<td>

**Non-local `break` and `continue`**

* KEEP 提案：[break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas)
* YouTrack issue: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* Available since: 2.1.0
</td>
</tr>

<!-- END OF IN PREVIEW BLOCK -->

<!-- STABLE BLOCK -->
<tr filter="stable">
<td width="200">

**穩定 (Stable)**
</td>
<td>

**`Enum.entries`: `Enum.values()` 的高效替代方案**

* KEEP 提案：[enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries)
* YouTrack issue: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* Target version: 2.0.0
</td>
</tr>
<tr filter="stable">
<td>

**穩定 (Stable)**
</td>
<td>

**Data objects**

* KEEP 提案：[data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects)
* YouTrack issue: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* Target version: 1.9.0
</td>
</tr>
<tr filter="stable">
<td>

**穩定 (Stable)**
</td>
<td>

**RangeUntil operator `..<`**

* KEEP 提案：[open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges)
* YouTrack issue: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* Target version: 1.7.20
</td>
</tr>
<tr filter="stable">
<td>

**穩定 (Stable)**
</td>
<td>

**Definitely non-nullable types**

* KEEP 提案：[definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types)
* YouTrack issue: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* Target version: 1.7.0
</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->
<tr filter="revoked">
<td width="200">

**已撤銷 (Revoked)**
</td>
<td>

**Context receivers**

* KEEP 提案：[context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers)
* YouTrack issue: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
</td>
</tr>
</table>

{/* END_SNIPPET: source */}

<!-- END OF REVOKED BLOCK -->

</TabItem>

<TabItem value="exploration-and-design" label="Exploration and design">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,exploration-and-design */}

</TabItem>

<TabItem value="keep-preparation" label="KEEP discussion">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,keep */}

</TabItem>

<TabItem value="in-preview" label="In preview">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,in-preview */}

</TabItem>

<TabItem value="stable" label="Stable">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,stable */}

</TabItem>

<TabItem value="revoked" label="Revoked">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,revoked */}

</TabItem>
</Tabs>