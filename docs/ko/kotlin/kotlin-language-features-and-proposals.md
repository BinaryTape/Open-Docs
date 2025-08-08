[//]: # (title: Kotlin 언어 기능 및 제안)

<web-summary>Kotlin 기능의 수명 주기에 대해 알아보세요. 이 페이지에는 Kotlin 언어 기능 및 설계 제안의 전체 목록이 포함되어 있습니다.</web-summary>

JetBrains는 실용적인 설계를 기반으로 [Kotlin 언어 진화 원칙](kotlin-evolution-principles.md)에 따라 Kotlin 언어를 발전시킵니다.

> 언어 기능 제안은 Kotlin 1.7.0부터 나열됩니다.
>
> [Kotlin 진화 원칙 문서](kotlin-evolution-principles.md#pre-stable-features)에서 언어 기능 상태에 대한 설명을 확인하세요.
>
{style="note"}

<tabs>
<tab id="all-proposals" title="모두">

<!-- <include element-id="all-proposals" from="all-proposals.topic"/> -->

<snippet id="source">
<table style="header-column">

<!-- EXPLORATION AND DESIGN BLOCK -->

<tr filter="exploration-and-design">
<td width="200">

**탐색 및 설계**

</td>
<td>

**풍부한 오류: 오류 유니온 타입**

* KEEP 제안: 정의되지 않음
* YouTrack 이슈: [KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**탐색 및 설계**

</td>
<td>

**이름 기반 비구조화**

* KEEP 제안: [name-based-destructuring.md](https://github.com/Kotlin/KEEP/blob/name-based-destructuring/proposals/name-based-destructuring.md)
* YouTrack 이슈: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**탐색 및 설계**

</td>
<td>

**불변성 지원**

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

**Kotlin 스태틱 및 스태틱 확장**

* KEEP 제안: [statics.md](https://github.com/Kotlin/KEEP/blob/static-scope/proposals/static-member-type-extension.md)
* YouTrack 이슈: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**컬렉션 리터럴**

* KEEP 제안: [collection-literals.md](https://github.com/Kotlin/KEEP/blob/bobko/collection-literals/proposals/collection-literals.md)
* YouTrack 이슈: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**명시적 백킹 필드**

* KEEP
  제안: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)
* YouTrack 이슈: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**버전 오버로딩**

* KEEP
  제안: [version-overloading.md](https://github.com/Kotlin/KEEP/blob/version-overloading-proposal/proposals/version-overloading.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**사용되지 않는 반환 값 검사기**

* KEEP
  제안: [unused-return-value-checker.md](https://github.com/Kotlin/KEEP/blob/underscore-for-unused-local/proposals/unused-return-value-checker.md)
* YouTrack 이슈: [KT-12719](https://youtrack.jetbrains.com/issue/KT-12719)

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

**KDoc에서 확장 링크 해석**

* KEEP 제안: [links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions.md)
* GitHub 이슈: [dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)

</td>
</tr>

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->

<tr filter="in-preview">
<td width="200">

**미리보기**

</td>
<td>

**컨텍스트 파라미터: 컨텍스트 종속 선언 지원**

* KEEP
  제안: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack 이슈: [KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**프로퍼티의 어노테이션 사용-사이트 타겟 개선**

* KEEP
  제안: [Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/change-defaulting-rule/proposals/change-defaulting-rule.md)
* YouTrack 이슈: [KT-19289](https://youtrack.jetbrains.com/issue/KT-19289)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**중첩 (비캡처링) 타입 별칭**

* KEEP
  제안: [Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/nested-typealias/proposals/nested-typealias.md)
* YouTrack 이슈: [KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**컨텍스트-민감형 해석**

* KEEP
  제안: [context-sensitive-resolution.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)
* YouTrack 이슈: [KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**JVM에서 박스된 인라인 값 클래스 노출**

* KEEP
  제안: [jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack 이슈: [KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**kotlin.time.Instant**

* KEEP 제안: [Instant and Clock](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/instant.md)
* 사용 가능 버전: 2.1.0

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**Uuid**

* KEEP 제안: [uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack 이슈: [KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
* 사용 가능 버전: 2.0.20

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**공통 아토믹 및 아토믹 배열**

* KEEP
  제안: [Common atomics](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/common-atomics.md)
* YouTrack 이슈: [KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**KMP Kotlin-자바 직접 실제화**

* KEEP
  제안: [kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack 이슈: [KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
* 사용 가능 버전: 2.1.0

</td>
</tr>

<!-- the first td element should have the width="200" attribute -->

<!-- END OF IN PREVIEW BLOCK -->

<!-- STABLE BLOCK -->

<tr filter="stable">
<td width="200">

**안정**

</td>
<td>

**`when-with-subject`의 가드 조건**

* KEEP 제안: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack 이슈: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**안정**

</td>
<td>

**다중 달러 보간: 문자열 리터럴에서 달러 기호 처리 개선**

* KEEP 제안: [dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack 이슈: [KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**안정**

</td>
<td>

**비지역 `break` 및 `continue`**

* KEEP
  제안: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack 이슈: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**안정**

</td>
<td>

**안정화된 `@SubclassOptInRequired`**

* KEEP
  제안: [subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack 이슈: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 사용 가능 버전: 2.1.0

</td>
</tr>

<tr filter="stable">
<td width="200">

**안정**

</td>
<td>

**`Enum.entries`: `Enum.values()`의 고성능 대체**

* KEEP 제안: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack 이슈: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 대상 버전: 2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**안정**

</td>
<td>

**데이터 객체**

* KEEP 제안: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* YouTrack 이슈: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* 대상 버전: 1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**안정**

</td>
<td>

**RangeUntil 연산자 `..<`**

* KEEP 제안: [open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* YouTrack 이슈: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* 대상 버전: 1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**안정**

</td>
<td>

**확실히 널 불가능한 타입**

* KEEP 제안: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack 이슈: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 대상 버전: 1.7.0

</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->

<tr filter="revoked">
<td width="200">

**철회됨**

</td>
<td>

**컨텍스트 리시버**

* KEEP 제안: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack 이슈: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* 다음으로 대체됨: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)

</td>
</tr>

<tr filter="revoked">
<td>

**철회됨**

</td>
<td>

**자바 합성 프로퍼티 참조**

* KEEP
  제안: [references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack 이슈: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)

</td>
</tr>

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</tab>

<tab id="exploration-and-design" title="탐색 및 설계">

<table>
<tbody>
<tr filter="exploration-and-design">
<td width="200">

**탐색 및 설계**

</td>
<td>

**풍부한 오류: 오류 유니온 타입**

* KEEP 제안: 정의되지 않음
* YouTrack 이슈: [KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**탐색 및 설계**

</td>
<td>

**이름 기반 비구조화**

* KEEP 제안: [name-based-destructuring.md](https://github.com/Kotlin/KEEP/blob/name-based-destructuring/proposals/name-based-destructuring.md)
* YouTrack 이슈: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**탐색 및 설계**

</td>
<td>

**불변성 지원**

* KEEP 노트: [immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack 이슈: [KT-77734](https://youtrack.jetbrains.com/issue/KT-77734)

</td>
</tr>
</tbody>
</table>

</tab>

<tab id="keep-preparation" title="KEEP 논의">

<table>
<tbody>
<tr filter="keep">
<td width="200">

**KEEP 논의**

</td>
<td>

**Kotlin 스태틱 및 스태틱 확장**

* KEEP 제안: [statics.md](https://github.com/Kotlin/KEEP/blob/static-scope/proposals/static-member-type-extension.md)
* YouTrack 이슈: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**컬렉션 리터럴**

* KEEP 제안: [collection-literals.md](https://github.com/Kotlin/KEEP/blob/bobko/collection-literals/proposals/collection-literals.md)
* YouTrack 이슈: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**명시적 백킹 필드**

* KEEP
  제안: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)
* YouTrack 이슈: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**버전 오버로딩**

* KEEP
  제안: [version-overloading.md](https://github.com/Kotlin/KEEP/blob/version-overloading-proposal/proposals/version-overloading.md)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 논의**

</td>
<td>

**사용되지 않는 반환 값 검사기**

* KEEP
  제안: [unused-return-value-checker.md](https://github.com/Kotlin/KEEP/blob/underscore-for-unused-local/proposals/unused-return-value-checker.md)
* YouTrack 이슈: [KT-12719](https://youtrack.jetbrains.com/issue/KT-12719)

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

**KDoc에서 확장 링크 해석**

* KEEP 제안: [links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions.md)
* GitHub 이슈: [dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)

</td>
</tr>
</tbody>
</table>

</tab>

<tab id="in-preview" title="미리보기">

<table>
<tbody>
<tr filter="in-preview">
<td width="200">

**미리보기**

</td>
<td>

**컨텍스트 파라미터: 컨텍스트 종속 선언 지원**

* KEEP
  제안: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack 이슈: [KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**프로퍼티의 어노테이션 사용-사이트 타겟 개선**

* KEEP
  제안: [Improvements to annotation use-site targets on properties](https://github.com/Kotlin/KEEP/blob/change-defaulting-rule/proposals/change-defaulting-rule.md)
* YouTrack 이슈: [KT-19289](https://youtrack.jetbrains.com/issue/KT-19289)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**중첩 (비캡처링) 타입 별칭**

* KEEP
  제안: [Nested (non-capturing) type aliases](https://github.com/Kotlin/KEEP/blob/nested-typealias/proposals/nested-typealias.md)
* YouTrack 이슈: [KT-45285](https://youtrack.jetbrains.com/issue/KT-45285)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**컨텍스트-민감형 해석**

* KEEP
  제안: [context-sensitive-resolution.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)
* YouTrack 이슈: [KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**JVM에서 박스된 인라인 값 클래스 노출**

* KEEP
  제안: [jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack 이슈: [KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**kotlin.time.Instant**

* KEEP 제안: [Instant and Clock](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/instant.md)
* 사용 가능 버전: 2.1.0

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**Uuid**

* KEEP 제안: [uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack 이슈: [KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)
* 사용 가능 버전: 2.0.20

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**공통 아토믹 및 아토믹 배열**

* KEEP
  제안: [Common atomics](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/common-atomics.md)
* YouTrack 이슈: [KT-62423](https://youtrack.jetbrains.com/issue/KT-62423)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="in-preview">
<td>

**미리보기**

</td>
<td>

**KMP Kotlin-자바 직접 실제화**

* KEEP
  제안: [kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack 이슈: [KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)
* 사용 가능 버전: 2.1.0

</td>
</tr>
</tbody>
</table>

</tab>

<tab id="stable" title="안정">

<table>
<tbody>
<tr filter="stable">
<td width="200">

**안정**

</td>
<td>

**`when-with-subject`의 가드 조건**

* KEEP 제안: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack 이슈: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**안정**

</td>
<td>

**다중 달러 보간: 문자열 리터럴에서 달러 기호 처리 개선**

* KEEP 제안: [dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack 이슈: [KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**안정**

</td>
<td>

**비지역 `break` 및 `continue`**

* KEEP
  제안: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack 이슈: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 사용 가능 버전: 2.2.0

</td>
</tr>

<tr filter="stable">
<td>

**안정**

</td>
<td>

**안정화된 `@SubclassOptInRequired`**

* KEEP
  제안: [subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack 이슈: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 사용 가능 버전: 2.1.0

</td>
</tr>

<tr filter="stable">
<td width="200">

**안정**

</td>
<td>

**`Enum.entries`: `Enum.values()`의 고성능 대체**

* KEEP 제안: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack 이슈: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 대상 버전: 2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**안정**

</td>
<td>

**데이터 객체**

* KEEP 제안: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* YouTrack 이슈: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* 대상 버전: 1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**안정**

</td>
<td>

**RangeUntil 연산자 `..<`**

* KEEP 제안: [open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* YouTrack 이슈: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* 대상 버전: 1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**안정**

</td>
<td>

**확실히 널 불가능한 타입**

* KEEP 제안: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack 이슈: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 대상 버전: 1.7.0

</td>
</tr>
</tbody>
</table>

</tab>

<tab id="revoked" title="철회됨">

<table>
<tbody>
<tr filter="revoked">
<td width="200">

**철회됨**

</td>
<td>

**컨텍스트 리시버**

* KEEP 제안: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack 이슈: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* 다음으로 대체됨: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)

</td>
</tr>

<tr filter="revoked">
<td>

**철회됨**

</td>
<td>

**자바 합성 프로퍼티 참조**

* KEEP
  제안: [references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack 이슈: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)

</td>
</tr>
</tbody>
</table>

</tab>
</tabs>