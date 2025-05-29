[//]: # (title: Kotlin 語言功能與提案)
[//]: # (description: 了解 Kotlin 功能的生命週期。此頁面包含 Kotlin 語言功能和設計提案的完整列表。)

JetBrains 根據其 [Kotlin 語言演進原則](kotlin-evolution-principles.md)，以務實的設計引導 Kotlin 語言的演進。

> 語言功能提案自 Kotlin 1.7.0 起列出。
>
> 有關語言功能狀態的說明，請參閱 [Kotlin 演進原則文件](kotlin-evolution-principles.md#pre-stable-features)。
>
{style="note"}

<tabs>
<tab id="all-proposals" title="所有">

<!-- <include element-id="all-proposals" from="all-proposals.topic"/> -->

<snippet id="source">
<table style="header-column">

<!-- EXPLORATION AND DESIGN BLOCK -->

<tr filter="exploration-and-design">
<td width="200">

**探索與設計**

</td>
<td>

**Kotlin 靜態成員與靜態擴充 (static extensions)**

* KEEP 提案: [statics.md](https://github.com/Kotlin/KEEP/blob/statics/proposals/statics.md)
* YouTrack 問題: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索與設計**

</td>
<td>

**集合字面值 (Collection literals)**

* KEEP 提案: 未定義
* YouTrack 問題: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索與設計**

</td>
<td>

**錯誤與例外聯合型別 (Union types)**

* KEEP 提案: 未定義
* YouTrack 問題: [KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索與設計**

</td>
<td>

**基於名稱的解構 (Name-based destructuring)**

* KEEP 提案: 未定義
* YouTrack 問題: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索與設計**

</td>
<td>

**支援不可變性 (Immutability)**

* KEEP 備註: [immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack 問題: [KT-1179](https://youtrack.jetbrains.com/issue/KT-1179)

</td>
</tr>

<!-- END OF EXPLORATION AND DESIGN BLOCK -->

<!-- KEEP DISCUSSION BLOCK -->

<tr filter="keep">
<td width="200">

**KEEP 討論**

</td>
<td>

**KMP Kotlin 到 Java 直接實際化 (direct actualization)**

* KEEP 提案: [kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack 問題: [KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**kotlin.time.Instant**

* KEEP 提案: [Instant and Clock](https://github.com/dkhalanskyjb/KEEP/blob/dkhalanskyjb-instant/proposals/stdlib/instant.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**常見原子操作 (Common Atomics) 與原子陣列 (Atomic Arrays)**

* KEEP 提案: [Common atomics](https://github.com/Kotlin/KEEP/blob/mvicsokolova/common-atomics/proposals/common-atomics.md)
* YouTrack 問題: [KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**改善屬性上的註解使用點目標 (annotation use-site targets)**

* KEEP 提案: [Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/change-defaulting-rule/proposals/change-defaulting-rule.md)
* YouTrack 問題: [KT-19289](https://youtrack.jetbrains.com/issue/KT-19289)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**巢狀 (非捕獲) 型別別名 (type aliases)**

* KEEP 提案: [Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/nested-typealias/proposals/nested-typealias.md)
* YouTrack 問題: [KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**精簡 KDoc 歧義連結 (ambiguity links)**

* KEEP 提案: [streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references.md)
* GitHub 問題: [dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**KDoc 中擴充連結的解析 (Resolution of links to extensions)**

* KEEP 提案: [links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions.md)
* GitHub 問題: [dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**Uuid**

* KEEP 提案: [uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack 問題: [KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**改善使用預期型別 (expected type) 的解析 (resolution)**

* KEEP 提案: [improved-resolution-expected-type.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/improved-resolution-expected-type.md)
* YouTrack 問題: [KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**在 JVM 中公開裝箱的內聯值類別 (boxed inline value classes)**

* KEEP 提案: [jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack 問題: [KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**明確的後端欄位 (backing fields)：同一屬性同時具有 `public` 和 `private` 型別**

* KEEP 提案: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields-re/proposals/explicit-backing-fields.md)
* YouTrack 問題: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**上下文參數 (Context parameters)：支援上下文相關宣告 (context-dependent declarations)**

* KEEP 提案: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack 問題: [KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**Java 合成屬性參考 (synthetic property references)**

* KEEP 提案: [references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack 問題: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)
* 目標版本: 2.2.0

</td>
</tr>

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->

<tr filter="in-preview">
<td width="200">

**預覽中**

</td>
<td>

**`when` 陳述式 (when-with-subject) 中的守護條件 (Guard conditions)**

* KEEP 提案: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack 問題: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 適用版本: 2.1.0

</td>
</tr>

<!-- the first td element should have the width="200" attribute -->

<tr filter="stable">
<td>

**穩定版**

</td>
<td>

**穩定化 `@SubclassOptInRequired`**

* KEEP 提案: [subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack 問題: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 適用版本: 2.1.0

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**多美元符號字串插值 (Multidollar interpolation)：改進字串常值 (string literals) 中 `$` 的處理**

* KEEP 提案: [dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack 問題: [KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 適用版本: 2.1.0

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**非局部 `break` 和 `continue`**

* KEEP 提案: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack 問題: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 適用版本: 2.1.0

</td>
</tr>

<!-- END OF IN PREVIEW BLOCK -->

<!-- STABLE BLOCK -->

<tr filter="stable">
<td width="200">

**穩定版**

</td>
<td>

**`Enum.entries`：`Enum.values()` 的高效能替代方案**

* KEEP 提案: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack 問題: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 目標版本: 2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**穩定版**

</td>
<td>

**資料物件 (Data objects)**

* KEEP 提案: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* YouTrack 問題: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* 目標版本: 1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**穩定版**

</td>
<td>

**範圍至 (RangeUntil) 運算子 `..<`**

* KEEP 提案: [open-ended-ranges.md](https://github.com/Kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* YouTrack 問題: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* 目標版本: 1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**穩定版**

</td>
<td>

**明確非空型別 (Definitely non-nullable types)**

* KEEP 提案: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack 問題: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 目標版本: 1.7.0

</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->

<tr filter="revoked">
<td width="200">

**已撤銷**

</td>
<td>

**上下文接收者 (Context receivers)**

* KEEP 提案: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack 問題: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)

</td>
</tr>

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</tab>

<tab id="exploration-and-design" title="探索與設計">

<include element-id="source" use-filter="empty,exploration-and-design" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="keep-preparation" title="KEEP 討論">

<include element-id="source" use-filter="empty,keep" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="in-preview" title="預覽中">

<include element-id="source" use-filter="empty,in-preview" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="stable" title="穩定版">

<include element-id="source" use-filter="empty,stable" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="revoked" title="已撤銷">

<include element-id="source" use-filter="empty,revoked" from="kotlin-language-features-and-proposals.md"/>

</tab>
</tabs>