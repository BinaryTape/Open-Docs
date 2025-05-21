---
title: "Kotlin 언어 기능 및 제안"
description: "Kotlin 기능의 라이프사이클에 대해 알아보세요. 이 페이지에는 Kotlin 언어 기능 및 디자인 제안의 전체 목록이 포함되어 있습니다."
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

JetBrains는 실용적인 설계를 바탕으로 [Kotlin 언어 발전 원칙](kotlin-evolution-principles)에 따라 Kotlin 언어를 발전시키고 있습니다.

:::note
언어 기능 제안은 Kotlin 1.7.0부터 나열되어 있습니다.

언어 기능 상태에 대한 설명은 [Kotlin 발전 원칙 문서](kotlin-evolution-principles#pre-stable-features)를 참조하세요.

:::

<Tabs>
<TabItem value="all-proposals" label="전체">

<!-- <include element-id="all-proposals" from="all-proposals.topic"/> -->

{/* START_SNIPPET: source */}
<table >

<!-- EXPLORATION AND DESIGN BLOCK -->
<tr filter="exploration-and-design">
<td width="200">

**탐색 및 설계 (Exploration and design)**
</td>
<td>

**Kotlin statics and static extensions**

* KEEP proposal: [statics.md](https://github.com/Kotlin/KEEP/blob/statics/proposals/statics)
* YouTrack issue: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**탐색 및 설계 (Exploration and design)**
</td>
<td>

**컬렉션 리터럴 (Collection literals)**

* KEEP proposal: 정의되지 않음
* YouTrack issue: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**탐색 및 설계 (Exploration and design)**
</td>
<td>

**오류 및 예외에 대한 Union types**

* KEEP proposal: 정의되지 않음
* YouTrack issue: [KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**탐색 및 설계 (Exploration and design)**
</td>
<td>

**이름 기반 구조 분해 (Name-based destructuring)**

* KEEP proposal: 정의되지 않음
* YouTrack issue: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)
</td>
</tr>
<tr filter="exploration-and-design">
<td>

**탐색 및 설계 (Exploration and design)**
</td>
<td>

**불변성 지원 (Support immutability)**

* KEEP notes: [immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes#immutability-and-value-classes)
* YouTrack issue: [KT-1179](https://youtrack.jetbrains.com/issue/KT-1179)
</td>
</tr>

<!-- END OF EXPLORATION AND DESIGN BLOCK -->

<!-- KEEP DISCUSSION BLOCK -->
<tr filter="keep">
<td width="200">

**KEEP 토론 (KEEP discussion)**
</td>
<td>

**KMP Kotlin-to-Java direct actualization**

* KEEP proposal: [kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization)
* YouTrack issue: [KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 토론 (KEEP discussion)**
</td>
<td>

**kotlin.time.Instant**

* KEEP proposal: [Instant and Clock](https://github.com/dkhalanskyjb/KEEP/blob/dkhalanskyjb-instant/proposals/stdlib/instant)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 토론 (KEEP discussion)**
</td>
<td>

**Common Atomics and Atomic Arrays**

* KEEP proposal: [Common atomics](https://github.com/Kotlin/KEEP/blob/mvicsokolova/common-atomics/proposals/common-atomics)
* YouTrack issue: [KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 토론 (KEEP discussion)**
</td>
<td>

**속성에 대한 어노테이션 사용 위치 대상 개선 (Improvements to annotation use-site targets on properties)**

* KEEP proposal: [Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/change-defaulting-rule/proposals/change-defaulting-rule)
* YouTrack issue: [KT-19289](https://youtrack.jetbrains.com/issue/KT-19289)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 토론 (KEEP discussion)**
</td>
<td>

**중첩된 (캡처하지 않는) 타입 별칭 (Nested (non-capturing) type aliases)**

* KEEP proposal: [Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/nested-typealias/proposals/nested-typealias)
* YouTrack issue: [KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 토론 (KEEP discussion)**
</td>
<td>

**KDoc 모호성 링크 간소화 (Streamline KDoc ambiguity links)**

* KEEP proposal: [streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references)
* GitHub issues: [dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 토론 (KEEP discussion)**
</td>
<td>

**KDoc에서 확장 프로그램 링크 해결 (Resolution of links to extensions in KDoc)**

* KEEP proposal: [links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions)
* GitHub issue: [dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 토론 (KEEP discussion)**
</td>
<td>

**Uuid**

* KEEP proposal: [uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid)
* YouTrack issue: [KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 토론 (KEEP discussion)**
</td>
<td>

**예상되는 타입을 사용하여 해결 개선 (Improve resolution using expected type)**

* KEEP proposal: [improved-resolution-expected-type.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/improved-resolution-expected-type)
* YouTrack issue: [KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 토론 (KEEP discussion)**
</td>
<td>

**JVM에서 boxed inline value classes 노출 (Expose boxed inline value classes in JVM)**

* KEEP proposal: [jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed)
* YouTrack issue: [KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 토론 (KEEP discussion)**
</td>
<td>

**명시적 backing fields: 동일한 속성에 대한 `public` 및 `private` 타입 모두 (Explicit backing fields: both `public` and `private` type for the same property)**

* KEEP proposal: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields-re/proposals/explicit-backing-fields)
* YouTrack issue: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 토론 (KEEP discussion)**
</td>
<td>

**Context parameters: context-dependent 선언 지원 (Context parameters: support for context-dependent declarations)**

* KEEP proposal: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters)
* YouTrack issue: [KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)
</td>
</tr>
<tr filter="keep">
<td>

**KEEP 토론 (KEEP discussion)**
</td>
<td>

**Java synthetic property references**

* KEEP proposal: [references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties)
* YouTrack issue: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)
* Target version: 2.2.0
</td>
</tr>

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->
<tr filter="in-preview">
<td width="200">

**미리 보기 (In preview)**
</td>
<td>

**when-with-subject의 Guard conditions**

* KEEP proposal: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards)
* YouTrack issue: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* Available since: 2.1.0
</td>
</tr>

<!-- the first td element should have the width="200" attribute -->
<tr filter="stable">
<td>

**안정화 (Stable)**
</td>
<td>

**안정화된 `@SubclassOptInRequired`**

* KEEP proposal: [subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required)
* YouTrack issue: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* Available since: 2.1.0
</td>
</tr>
<tr filter="in-preview">
<td>

**미리 보기 (In preview)**
</td>
<td>

**Multidollar interpolation: 문자열 리터럴에서 `$` 개선된 처리 (Multidollar interpolation: improved handling of `$` in string literals)**

* KEEP proposal: [dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape)
* YouTrack issue: [KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* Available since: 2.1.0
</td>
</tr>
<tr filter="in-preview">
<td>

**미리 보기 (In preview)**
</td>
<td>

**Non-local `break` 및 `continue`**

* KEEP proposal: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas)
* YouTrack issue: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* Available since: 2.1.0
</td>
</tr>

<!-- END OF IN PREVIEW BLOCK -->

<!-- STABLE BLOCK -->
<tr filter="stable">
<td width="200">

**안정화 (Stable)**
</td>
<td>

**`Enum.entries`: `Enum.values()`의 성능이 좋은 대체 (performant replacement of the `Enum.values()`)**

* KEEP proposal: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries)
* YouTrack issue: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* Target version: 2.0.0
</td>
</tr>
<tr filter="stable">
<td>

**안정화 (Stable)**
</td>
<td>

**Data objects**

* KEEP proposal: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects)
* YouTrack issue: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* Target version: 1.9.0
</td>
</tr>
<tr filter="stable">
<td>

**안정화 (Stable)**
</td>
<td>

**RangeUntil operator `..<`**

* KEEP proposal: [open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges)
* YouTrack issue: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* Target version: 1.7.20
</td>
</tr>
<tr filter="stable">
<td>

**안정화 (Stable)**
</td>
<td>

**Definitely non-nullable types**

* KEEP proposal: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types)
* YouTrack issue: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* Target version: 1.7.0
</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->
<tr filter="revoked">
<td width="200">

**취소됨 (Revoked)**
</td>
<td>

**Context receivers**

* KEEP proposal: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers)
* YouTrack issue: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
</td>
</tr>
</table>

{/* END_SNIPPET: source */}

<!-- END OF REVOKED BLOCK -->

</TabItem>

<TabItem value="exploration-and-design" label="탐색 및 설계 (Exploration and design)">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,exploration-and-design */}

</TabItem>

<TabItem value="keep-preparation" label="KEEP 토론 (KEEP discussion)">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,keep */}

</TabItem>

<TabItem value="in-preview" label="미리 보기 (In preview)">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,in-preview */}

</TabItem>

<TabItem value="stable" label="안정화 (Stable)">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,stable */}

</TabItem>

<TabItem value="revoked" label="취소됨 (Revoked)">

{/* Note: This is an included content from kotlin-language-features-and-proposals.md, element source, with filters: empty,revoked */}

</TabItem>
</Tabs>