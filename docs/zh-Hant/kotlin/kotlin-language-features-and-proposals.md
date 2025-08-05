[//]: # (title: Kotlin 語言特性與提案)

<web-summary>瞭解 Kotlin 特性的生命週期。此頁面包含 Kotlin 語言特性和設計提案的完整列表。</web-summary>

JetBrains 根據 [Kotlin 語言演進原則](kotlin-evolution-principles.md)，以務實的設計為導向，持續發展 Kotlin 語言。

> 語言特性提案列出自 Kotlin 1.7.0 起的內容。
>
> 請參閱 [Kotlin 演進原則文件](kotlin-evolution-principles.md#pre-stable-features)中對語言特性狀態的說明。
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

**豐富錯誤：錯誤聯集型別**

* KEEP 提案：未定義
* YouTrack 問題：[KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索與設計**

</td>
<td>

**基於名稱的解構**

* KEEP 提案：[name-based-destructuring.md](https://github.com/Kotlin/KEEP/blob/name-based-destructuring/proposals/name-based-destructuring.md)
* YouTrack 問題：[KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索與設計**

</td>
<td>

**支援不可變性**

* KEEP 備註：[immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack 問題：[KT-77734](https://youtrack.jetbrains.com/issue/KT-77734)

</td>
</tr>

<!-- END OF EXPLORATION AND DESIGN BLOCK -->

<!-- KEEP DISCUSSION BLOCK -->

<tr filter="keep">
<td width="200">

**KEEP 討論**

</td>
<td>

**Kotlin 靜態與靜態擴充功能**

* KEEP 提案：[statics.md](https://github.com/Kotlin/KEEP/blob/static-scope/proposals/static-member-type-extension.md)
* YouTrack 問題：[KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**集合字面量**

* KEEP 提案：[collection-literals.md](https://github.com/Kotlin/KEEP/blob/bobko/collection-literals/proposals/collection-literals.md)
* YouTrack 問題：[KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**顯式支援欄位**

* KEEP
  提案：[explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)
* YouTrack 問題：[KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**版本重載**

* KEEP
  提案：[version-overloading.md](https://github.com/Kotlin/KEEP/blob/version-overloading-proposal/proposals/version-overloading.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**未使用的回傳值檢查器**

* KEEP
  提案：[unused-return-value-checker.md](https://github.com/Kotlin/KEEP/blob/underscore-for-unused-local/proposals/unused-return-value-checker.md)
* YouTrack 問題：[KT-12719](https://youtrack.jetbrains.com/issue/KT-12719)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**簡化 KDoc 歧義連結**

* KEEP 提案：[streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references.md)
* GitHub 問題：[dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**KDoc 中擴充功能連結的解析**

* KEEP 提案：[links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions.md)
* GitHub 問題：[dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)

</td>
</tr>

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->

<tr filter="in-preview">
<td width="200">

**預覽中**

</td>
<td>

**情境參數：支援情境相關宣告**

* KEEP
  提案：[context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack 問題：[KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**改進屬性上的註解使用點目標**

* KEEP
  提案：[Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/change-defaulting-rule/proposals/change-defaulting-rule.md)
* YouTrack 問題：[KT-19289](https://youtrack.jetbrains.com/issue/KT-19289)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**巢狀（非捕獲）型別別名**

* KEEP
  提案：[Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/nested-typealias/proposals/nested-typealias.md)
* YouTrack 問題：[KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**情境敏感解析**

* KEEP
  提案：[context-sensitive-resolution.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)
* YouTrack 問題：[KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**在 JVM 中公開裝箱的內聯值類別**

* KEEP
  提案：[jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack 問題：[KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**kotlin.time.Instant**

* KEEP 提案：[Instant and Clock](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/instant.md)
* 自 2.1.0 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**Uuid**

* KEEP 提案：[uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack 問題：[KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
* 自 2.0.20 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**通用原子操作與原子陣列**

* KEEP
  提案：[Common atomics](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/common-atomics.md)
* YouTrack 問題：[KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**KMP Kotlin 到 Java 直接實現**

* KEEP
  提案：[kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack 問題：[KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
* 自 2.1.0 起提供

</td>
</tr>

<!-- the first td element should have the width="200" attribute -->

<!-- END OF IN PREVIEW BLOCK -->

<!-- STABLE BLOCK -->

<tr filter="stable">
<td width="200">

**穩定**

</td>
<td>

**when-with-subject 中的守衛條件**

* KEEP 提案：[guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack 問題：[KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="stable">
<td>

**穩定**

</td>
<td>

**多美元符號插值：改進字串字面量中 `#` 的處理**

* KEEP 提案：[dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack 問題：[KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="stable">
<td>

**穩定**

</td>
<td>

**非局部 `break` 和 `continue`**

* KEEP
  提案：[break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack 問題：[KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="stable">
<td>

**穩定**

</td>
<td>

**穩定的 `@SubclassOptInRequired`**

* KEEP
  提案：[subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack 問題：[KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 自 2.1.0 起提供

</td>
</tr>

<tr filter="stable">
<td width="200">

**穩定**

</td>
<td>

**`Enum.entries`：`Enum.values()` 的高效能替代**

* KEEP 提案：[enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack 問題：[KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 目標版本：2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**穩定**

</td>
<td>

**資料物件**

* KEEP 提案：[data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* YouTrack 問題：[KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* 目標版本：1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**穩定**

</td>
<td>

**RangeUntil 運算子 `..<`**

* KEEP 提案：[open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* YouTrack 問題：[KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* 目標版本：1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**穩定**

</td>
<td>

**確定非空型別**

* KEEP 提案：[definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack 問題：[KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 目標版本：1.7.0

</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->

<tr filter="revoked">
<td width="200">

**已撤銷**

</td>
<td>

**情境接收器**

* KEEP 提案：[context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack 問題：[KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* 已取代為 [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)

</td>
</tr>

<tr filter="revoked">
<td>

**已撤銷**

</td>
<td>

**Java 合成屬性參考**

* KEEP
  提案：[references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack 問題：[KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)

</td>
</tr>

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</tab>

<tab id="exploration-and-design" title="探索與設計">

<table>
<tbody>
<tr filter="exploration-and-design">
<td width="200">

**探索與設計**

</td>
<td>

**豐富錯誤：錯誤聯集型別**

* KEEP 提案：未定義
* YouTrack 問題：[KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索與設計**

</td>
<td>

**基於名稱的解構**

* KEEP 提案：[name-based-destructuring.md](https://github.com/Kotlin/KEEP/blob/name-based-destructuring/proposals/name-based-destructuring.md)
* YouTrack 問題：[KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索與設計**

</td>
<td>

**支援不可變性**

* KEEP 備註：[immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack 問題：[KT-77734](https://youtrack.jetbrains.com/issue/KT-77734)

</td>
</tr>
</tbody>
</table>

</tab>

<tab id="keep-preparation" title="KEEP 討論">

<table>
<tbody>
<tr filter="keep">
<td width="200">

**KEEP 討論**

</td>
<td>

**Kotlin 靜態與靜態擴充功能**

* KEEP 提案：[statics.md](https://github.com/Kotlin/KEEP/blob/static-scope/proposals/static-member-type-extension.md)
* YouTrack 問題：[KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**集合字面量**

* KEEP 提案：[collection-literals.md](https://github.com/Kotlin/KEEP/blob/bobko/collection-literals/proposals/collection-literals.md)
* YouTrack 問題：[KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**顯式支援欄位**

* KEEP
  提案：[explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)
* YouTrack 問題：[KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**版本重載**

* KEEP
  提案：[version-overloading.md](https://github.com/Kotlin/KEEP/blob/version-overloading-proposal/proposals/version-overloading.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**未使用的回傳值檢查器**

* KEEP
  提案：[unused-return-value-checker.md](https://github.com/Kotlin/KEEP/blob/underscore-for-unused-local/proposals/unused-return-value-checker.md)
* YouTrack 問題：[KT-12719](https://youtrack.jetbrains.com/issue/KT-12719)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**簡化 KDoc 歧義連結**

* KEEP 提案：[streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references.md)
* GitHub 問題：[dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 討論**

</td>
<td>

**KDoc 中擴充功能連結的解析**

* KEEP 提案：[links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions.md)
* GitHub 問題：[dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)

</td>
</tr>
</tbody>
</table>

</tab>

<tab id="in-preview" title="預覽中">

<table>
<tbody>
<tr filter="in-preview">
<td width="200">

**預覽中**

</td>
<td>

**情境參數：支援情境相關宣告**

* KEEP
  提案：[context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack 問題：[KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**改進屬性上的註解使用點目標**

* KEEP
  提案：[Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/change-defaulting-rule/proposals/change-defaulting-rule.md)
* YouTrack 問題：[KT-19289](https://youtrack.jetbrains.com/issue/KT-19289)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**巢狀（非捕獲）型別別名**

* KEEP
  提案：[Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/nested-typealias/proposals/nested-typealias.md)
* YouTrack 問題：[KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**情境敏感解析**

* KEEP
  提案：[context-sensitive-resolution.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)
* YouTrack 問題：[KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**在 JVM 中公開裝箱的內聯值類別**

* KEEP
  提案：[jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack 問題：[KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**kotlin.time.Instant**

* KEEP 提案：[Instant and Clock](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/instant.md)
* 自 2.1.0 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**Uuid**

* KEEP 提案：[uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack 問題：[KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
* 自 2.0.20 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**通用原子操作與原子陣列**

* KEEP
  提案：[Common atomics](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/common-atomics.md)
* YouTrack 問題：[KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="in-preview">
<td>

**預覽中**

</td>
<td>

**KMP Kotlin 到 Java 直接實現**

* KEEP
  提案：[kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack 問題：[KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
* 自 2.1.0 起提供

</td>
</tr>
</tbody>
</table>

</tab>

<tab id="stable" title="穩定">

<table>
<tbody>
<tr filter="stable">
<td width="200">

**穩定**

</td>
<td>

**when-with-subject 中的守衛條件**

* KEEP 提案：[guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack 問題：[KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="stable">
<td>

**穩定**

</td>
<td>

**多美元符號插值：改進字串字面量中 `#` 的處理**

* KEEP 提案：[dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack 問題：[KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="stable">
<td>

**穩定**

</td>
<td>

**非局部 `break` 和 `continue`**

* KEEP
  提案：[break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack 問題：[KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 自 2.2.0 起提供

</td>
</tr>

<tr filter="stable">
<td>

**穩定**

</td>
<td>

**穩定的 `@SubclassOptInRequired`**

* KEEP
  提案：[subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack 問題：[KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 自 2.1.0 起提供

</td>
</tr>

<tr filter="stable">
<td width="200">

**穩定**

</td>
<td>

**`Enum.entries`：`Enum.values()` 的高效能替代**

* KEEP 提案：[enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack 問題：[KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 目標版本：2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**穩定**

</td>
<td>

**資料物件**

* KEEP 提案：[data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* YouTrack 問題：[KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* 目標版本：1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**穩定**

</td>
<td>

**RangeUntil 運算子 `..<`**

* KEEP 提案：[open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* YouTrack 問題：[KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* 目標版本：1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**穩定**

</td>
<td>

**確定非空型別**

* KEEP 提案：[definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack 問題：[KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 目標版本：1.7.0

</td>
</tr>
</tbody>
</table>

</tab>

<tab id="revoked" title="已撤銷">

<table>
<tbody>
<tr filter="revoked">
<td width="200">

**已撤銷**

</td>
<td>

**情境接收器**

* KEEP 提案：[context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack 問題：[KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* 已取代為 [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)

</td>
</tr>

<tr filter="revoked">
<td>

**已撤銷**

</td>
<td>

**Java 合成屬性參考**

* KEEP
  提案：[references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack 問題：[KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)

</td>
</tr>
</tbody>
</table>

</tab>
</tabs>