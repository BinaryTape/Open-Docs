[//]: # (title: Kotlin 언어 기능 및 제안)

<web-summary>Kotlin 기능의 수명 주기에 대해 알아보세요. 이 페이지에는 Kotlin 언어 기능 및 디자인 제안의 전체 목록이 포함되어 있습니다.</web-summary>

JetBrains는 실용적인 디자인을 바탕으로 [Kotlin 언어 진화 원칙](kotlin-evolution-principles.md)에 따라 Kotlin 언어를 발전시키고 있습니다.

> 언어 기능 제안은 Kotlin 1.7.0부터 나열되어 있습니다. 
> 
> 언어 기능 상태에 대한 설명은 
> [Kotlin 진화 원칙 문서](kotlin-evolution-principles.md#pre-stable-features)를 참조하세요.
> 
{style="note"}

<tabs>
<tab id="all-proposals" title="전체">

<!-- <include element-id="all-proposals" from="all-proposals.topic"/> -->

<snippet id="source">
<table style="header-column">

<!-- the first td element should have the width="200" attribute -->

<!-- EXPLORATION AND DESIGN BLOCK -->

<tr filter="exploration-and-design">
<td width="200">

**탐색 및 디자인**

</td>
<td>

**불변성(Immutability) 지원**

* KEEP 노트: [immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack 이슈: [KT-77734](https://youtrack.jetbrains.com/issue/KT-77734)

</td>
</tr>

<!-- END OF EXPLORATION AND DESIGN BLOCK -->

<!-- KEEP DISCUSSION BLOCK -->

<tr filter="keep">
<td width="200">

**KEEP 논의**

</td>
<td>

**컨텍스트 파라미터로서의 `CoroutineContext`**

* KEEP 제안: [CoroutineContext-context-parameter.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0443-suspend-CoroutineContext-context-parameter.md)
* YouTrack 이슈: [KT-15555](https://youtrack.jetbrains.com/issue/KT-15555)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**Rich Errors: 동기 및 근거**

* KEEP 제안: [rich-errors-motivation.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0441-rich-errors-motivation.md)
* YouTrack 이슈: [KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**Kotlin 정적 멤버 및 정적 확장 (Kotlin statics and static extensions)**

* KEEP 제안: [statics.md](https://github.com/Kotlin/KEEP/blob/static-scope/proposals/static-member-type-extension.md)
* YouTrack 이슈: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**버전 오버로딩 (Version overloading)**

* KEEP 제안: [version-overloading.md](https://github.com/Kotlin/KEEP/blob/version-overloading-proposal/proposals/version-overloading.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**KDoc 모호성 링크 간소화**

* KEEP 제안: [streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references.md)
* GitHub 이슈: [dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**KDoc의 확장 링크 해결 (Resolution of links to extensions in KDoc)**

* KEEP 제안: [links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions.md)
* GitHub 이슈: [dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)

</td>
</tr>

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->

<tr filter="in-preview">
<td width="200">

**프리뷰 중**

</td>
<td>

**컬렉션 리터럴 (Collection literals)**

* KEEP 제안: [collection-literals.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0416-collection-literals.md)
* YouTrack 이슈: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.4.0

</td>
</tr>

<tr filter="in-preview">
<td width="200">

**프리뷰 중**

</td>
<td>

**컴파일 타임 상수 개선**

* KEEP 제안: [improve-compile-time-constants.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md)
* YouTrack 이슈: [KT-22505](https://youtrack.jetbrains.com/issue/KT-22505)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.4.0

</td>
</tr>

<tr filter="in-preview">
<td width="200">

**프리뷰 중**

</td>
<td>

**이름 기반 구조 분해 (Name-based destructuring)**

* KEEP 제안: [name-based-destructuring.md](https://github.com/Kotlin/KEEP/blob/name-based-destructuring/proposals/name-based-destructuring.md)
* YouTrack 이슈: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.3.20

</td>
</tr>

<tr filter="in-preview">
<td>

**프리뷰 중**

</td>
<td>

**사용되지 않는 반환 값 검사기 (Unused return value checker)**

* KEEP 제안: [unused-return-value-checker.md](https://github.com/Kotlin/KEEP/blob/underscore-for-unused-local/proposals/unused-return-value-checker.md)
* YouTrack 이슈: [KT-12719](https://youtrack.jetbrains.com/issue/KT-12719)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.3.0

</td>
</tr>

<tr filter="in-preview">
<td>

**프리뷰 중**

</td>
<td>

**문맥 민감형 해결 (Context-sensitive resolution)**

* KEEP 제안: [context-sensitive-resolution.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)
* YouTrack 이슈: [KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**프리뷰 중**

</td>
<td>

**JVM에서 박싱된 인라인 값 클래스 노출**

* KEEP 제안: [jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack 이슈: [KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**프리뷰 중**

</td>
<td>

**공통 원자성(Common Atomics) 및 원자성 배열**

* KEEP 제안: [Common atomics](https://github.com/Kotlin/KEEP/blob/main/proposals/stdlib/KEEP-0398-common-atomics.md)
* YouTrack 이슈: [KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**프리뷰 중**

</td>
<td>

**KMP Kotlin-to-Java 직접 실제화 (KMP Kotlin-to-Java direct actualization)**

* KEEP 제안: [kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack 이슈: [KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.1.0

</td>
</tr>

<!-- END OF IN PREVIEW BLOCK -->

<!-- STABLE BLOCK -->

<tr filter="stable">
<td width="200">

**안정화됨**

</td>
<td>

**컨텍스트 파라미터: 컨텍스트 의존적 선언 지원**

* KEEP 제안: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack 이슈: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* 사용 가능 버전: 2.2.0, 안정화 버전: 2.4.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**프로퍼티의 어노테이션 사용 지점 대상(use-site targets) 개선**

* KEEP 제안: [Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0402-annotation-target-in-properties.md)
* YouTrack 이슈: [KT-73255](https://youtrack.jetbrains.com/issue/KT-73255)
* 사용 가능 버전: 2.2.0, 안정화 버전: 2.4.0

</td>
</tr>

<tr filter="stable">
<td width="200">

**안정화됨**

</td>
<td>

**명시적 백킹 필드 (Explicit backing fields)**

* KEEP 제안: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)
* YouTrack 이슈: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)
* 사용 가능 버전: 2.3.0, 안정화 버전: 2.4.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**Uuid**

* KEEP 제안: [uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack 이슈: [KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
* 사용 가능 버전: 2.0.20, 안정화 버전: 2.4.0

</td>
</tr>

<tr filter="stable">
<td width="200">

**안정화됨**

</td>
<td>

**데이터 흐름 기반 완결성(Exhaustiveness) 검사**

* KEEP 제안: [dfa-exhaustiveness.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0442-dfa-exhaustiveness.md)
* YouTrack 이슈: [KT-8781](https://youtrack.jetbrains.com/issue/KT-8781)
* 사용 가능 버전: 2.2.20, 안정화 버전: 2.3.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**중첩된(비캡처링) 타입 별칭 (Nested non-capturing type aliases)**

* KEEP 제안: [Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md)
* YouTrack 이슈: [KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
* 사용 가능 버전: 2.2.0, 안정화 버전: 2.3.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**kotlin.time.Instant**

* KEEP 제안: [Instant and Clock](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/instant.md)
* YouTrack 이슈: [KT-80778](https://youtrack.jetbrains.com/issue/KT-80778)
* 사용 가능 버전: 2.1.0, 안정화 버전: 2.3.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**when-with-subject의 가드 조건 (Guard conditions in when-with-subject)**

* KEEP 제안: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack 이슈: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**멀티달러 보간: 문자열 리터럴 내 $ 처리 개선**

* KEEP 제안: [dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack 이슈: [KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**비로컬 `break` 및 `continue`**

* KEEP 제안: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack 이슈: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**`@SubclassOptInRequired` 안정화**

* KEEP 제안: [subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack 이슈: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 사용 가능 버전: 2.1.0

</td>
</tr>

<tr filter="stable">
<td width="200">

**안정화됨**

</td>
<td>

**`Enum.entries`: `Enum.values()`를 대체하는 성능 중심 기능**

* KEEP 제안: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack 이슈: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 사용 가능 버전: 2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**데이터 객체 (Data objects)**

* KEEP 제안: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* YouTrack 이슈: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* 사용 가능 버전: 1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**RangeUntil 연산자 `..<`**

* KEEP 제안: [open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* YouTrack 이슈: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* 사용 가능 버전: 1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**절대 널 불가(Definitely non-nullable) 타입**

* KEEP 제안: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack 이슈: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 사용 가능 버전: 1.7.0

</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->

<tr filter="revoked">
<td width="200">

**취소됨**

</td>
<td>

**컨텍스트 리시버 (Context receivers)**

* KEEP 제안: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack 이슈: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)로 대체됨

</td>
</tr>

<tr filter="revoked">
<td>

**취소됨**

</td>
<td>

**Java 가상(Synthetic) 프로퍼티 참조**

* KEEP 제안: [references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack 이슈: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)

</td>
</tr>

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</tab>

<tab id="exploration-and-design" title="탐색 및 디자인">

<table>
<tr filter="exploration-and-design">
<td width="200">

**탐색 및 디자인**

</td>
<td>

**불변성(Immutability) 지원**

* KEEP 노트: [immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack 이슈: [KT-77734](https://youtrack.jetbrains.com/issue/KT-77734)

</td>
</tr>
</table>

</tab>

<tab id="keep-preparation" title="KEEP 논의">

<table>
<tr filter="keep">
<td width="200">

**KEEP 논의**

</td>
<td>

**컨텍스트 파라미터로서의 `CoroutineContext`**

* KEEP 제안: [CoroutineContext-context-parameter.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0443-suspend-CoroutineContext-context-parameter.md)
* YouTrack 이슈: [KT-15555](https://youtrack.jetbrains.com/issue/KT-15555)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**Rich Errors: 동기 및 근거**

* KEEP 제안: [rich-errors-motivation.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0441-rich-errors-motivation.md)
* YouTrack 이슈: [KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**Kotlin 정적 멤버 및 정적 확장 (Kotlin statics and static extensions)**

* KEEP 제안: [statics.md](https://github.com/Kotlin/KEEP/blob/static-scope/proposals/static-member-type-extension.md)
* YouTrack 이슈: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**버전 오버로딩 (Version overloading)**

* KEEP 제안: [version-overloading.md](https://github.com/Kotlin/KEEP/blob/version-overloading-proposal/proposals/version-overloading.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**KDoc 모호성 링크 간소화**

* KEEP 제안: [streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references.md)
* GitHub 이슈: [dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**KDoc의 확장 링크 해결 (Resolution of links to extensions in KDoc)**

* KEEP 제안: [links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions.md)
* GitHub 이슈: [dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)

</td>
</tr>
</table>

</tab>

<tab id="in-preview" title="프리뷰 중">

<table>
<tr filter="in-preview">
<td width="200">

**프리뷰 중**

</td>
<td>

**컬렉션 리터럴 (Collection literals)**

* KEEP 제안: [collection-literals.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0416-collection-literals.md)
* YouTrack 이슈: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.4.0

</td>
</tr>

<tr filter="in-preview">
<td width="200">

**프리뷰 중**

</td>
<td>

**컴파일 타임 상수 개선**

* KEEP 제안: [improve-compile-time-constants.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md)
* YouTrack 이슈: [KT-22505](https://youtrack.jetbrains.com/issue/KT-22505)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.4.0

</td>
</tr>

<tr filter="in-preview">
<td width="200">

**프리뷰 중**

</td>
<td>

**이름 기반 구조 분해 (Name-based destructuring)**

* KEEP 제안: [name-based-destructuring.md](https://github.com/Kotlin/KEEP/blob/name-based-destructuring/proposals/name-based-destructuring.md)
* YouTrack 이슈: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.3.20

</td>
</tr>

<tr filter="in-preview">
<td>

**프리뷰 중**

</td>
<td>

**사용되지 않는 반환 값 검사기 (Unused return value checker)**

* KEEP 제안: [unused-return-value-checker.md](https://github.com/Kotlin/KEEP/blob/underscore-for-unused-local/proposals/unused-return-value-checker.md)
* YouTrack 이슈: [KT-12719](https://youtrack.jetbrains.com/issue/KT-12719)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.3.0

</td>
</tr>

<tr filter="in-preview">
<td>

**프리뷰 중**

</td>
<td>

**문맥 민감형 해결 (Context-sensitive resolution)**

* KEEP 제안: [context-sensitive-resolution.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)
* YouTrack 이슈: [KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**프리뷰 중**

</td>
<td>

**JVM에서 박싱된 인라인 값 클래스 노출**

* KEEP 제안: [jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack 이슈: [KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**프리뷰 중**

</td>
<td>

**공통 원자성(Common Atomics) 및 원자성 배열**

* KEEP 제안: [Common atomics](https://github.com/Kotlin/KEEP/blob/main/proposals/stdlib/KEEP-0398-common-atomics.md)
* YouTrack 이슈: [KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**프리뷰 중**

</td>
<td>

**KMP Kotlin-to-Java 직접 실제화 (KMP Kotlin-to-Java direct actualization)**

* KEEP 제안: [kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack 이슈: [KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
* 안정성 수준: [Experimental](components-stability.md#stability-levels-explained)
* 사용 가능 버전: 2.1.0

</td>
</tr>
</table>

</tab>

<tab id="stable" title="안정화됨">

<table>
<tr filter="stable">
<td width="200">

**안정화됨**

</td>
<td>

**컨텍스트 파라미터: 컨텍스트 의존적 선언 지원**

* KEEP 제안: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack 이슈: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* 사용 가능 버전: 2.2.0, 안정화 버전: 2.4.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**프로퍼티의 어노테이션 사용 지점 대상(use-site targets) 개선**

* KEEP 제안: [Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0402-annotation-target-in-properties.md)
* YouTrack 이슈: [KT-73255](https://youtrack.jetbrains.com/issue/KT-73255)
* 사용 가능 버전: 2.2.0, 안정화 버전: 2.4.0

</td>
</tr>

<tr filter="stable">
<td width="200">

**안정화됨**

</td>
<td>

**명시적 백킹 필드 (Explicit backing fields)**

* KEEP 제안: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)
* YouTrack 이슈: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)
* 사용 가능 버전: 2.3.0, 안정화 버전: 2.4.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**Uuid**

* KEEP 제안: [uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack 이슈: [KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
* 사용 가능 버전: 2.0.20, 안정화 버전: 2.4.0

</td>
</tr>

<tr filter="stable">
<td width="200">

**안정화됨**

</td>
<td>

**데이터 흐름 기반 완결성(Exhaustiveness) 검사**

* KEEP 제안: [dfa-exhaustiveness.md](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0442-dfa-exhaustiveness.md)
* YouTrack 이슈: [KT-8781](https://youtrack.jetbrains.com/issue/KT-8781)
* 사용 가능 버전: 2.2.20, 안정화 버전: 2.3.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**중첩된(비캡처링) 타입 별칭 (Nested non-capturing type aliases)**

* KEEP 제안: [Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md)
* YouTrack 이슈: [KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
* 사용 가능 버전: 2.2.0, 안정화 버전: 2.3.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**kotlin.time.Instant**

* KEEP 제안: [Instant and Clock](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/instant.md)
* YouTrack 이슈: [KT-80778](https://youtrack.jetbrains.com/issue/KT-80778)
* 사용 가능 버전: 2.1.0, 안정화 버전: 2.3.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**when-with-subject의 가드 조건 (Guard conditions in when-with-subject)**

* KEEP 제안: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack 이슈: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**멀티달러 보간: 문자열 리터럴 내 $ 처리 개선**

* KEEP 제안: [dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack 이슈: [KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**비로컬 `break` 및 `continue`**

* KEEP 제안: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack 이슈: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**`@SubclassOptInRequired` 안정화**

* KEEP 제안: [subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack 이슈: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 사용 가능 버전: 2.1.0

</td>
</tr>

<tr filter="stable">
<td width="200">

**안정화됨**

</td>
<td>

**`Enum.entries`: `Enum.values()`를 대체하는 성능 중심 기능**

* KEEP 제안: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack 이슈: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 사용 가능 버전: 2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**데이터 객체 (Data objects)**

* KEEP 제안: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* YouTrack 이슈: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* 사용 가능 버전: 1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**RangeUntil 연산자 `..<`**

* KEEP 제안: [open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* YouTrack 이슈: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* 사용 가능 버전: 1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**안정화됨**

</td>
<td>

**절대 널 불가(Definitely non-nullable) 타입**

* KEEP 제안: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack 이슈: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 사용 가능 버전: 1.7.0

</td>
</tr>
</table>

</tab>

<tab id="revoked" title="취소됨">

<table>
<tr filter="revoked">
<td width="200">

**취소됨**

</td>
<td>

**컨텍스트 리시버 (Context receivers)**

* KEEP 제안: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack 이슈: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)로 대체됨

</td>
</tr>

<tr filter="revoked">
<td>

**취소됨**

</td>
<td>

**Java 가상(Synthetic) 프로퍼티 참조**

* KEEP 제안: [references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack 이슈: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)

</td>
</tr>
</table>

</tab>
</tabs>