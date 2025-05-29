[//]: # (title: Kotlin 팁)

Kotlin 팁은 Kotlin 팀 구성원이 코드를 작성할 때 더 효율적이고 관용적인 방식으로 Kotlin을 사용하는 방법을 보여줌으로써 더 즐거움을 느낄 수 있도록 돕는 짧은 동영상 시리즈입니다.

[저희 YouTube 채널을 구독](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)하여 새로운 Kotlin 팁 동영상을 놓치지 마세요.

## Kotlin에서 null + null

Kotlin에서 `null + null`을 더하면 어떤 일이 발생하며, 무엇을 반환할까요? Sebastian Aigner가 최신 빠른 팁에서 이 미스터리를 다룹니다. 이 과정에서 그는 널러블(nullable)을 두려워할 필요가 없는 이유도 보여줍니다:

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin Tips: null + null in Kotlin"/>

## 컬렉션 항목 중복 제거

중복 항목을 포함하는 Kotlin 컬렉션이 있으신가요? 고유한 항목만 있는 컬렉션이 필요하신가요? Sebastian Aigner가 이 Kotlin 팁에서 리스트에서 중복을 제거하거나 세트(set)로 변환하는 방법을 보여드립니다:

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin Tips: Deduplicating Collection Items"/>

## suspend와 inline의 미스터리

[`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html), [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html), [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)와 같은 함수들이 시그니처가 코루틴을 인식하지 못하는데도 불구하고 람다에 suspending 함수를 허용하는 이유는 무엇일까요? Kotlin 팁의 이번 에피소드에서 Sebastian Aigner가 이 수수께끼를 풀어줍니다. 이는 `inline` 한정자(modifier)와 관련이 있습니다:

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin Tips: The Suspend and Inline Mystery"/>

## 완전한 이름으로 선언의 섀도잉 해제

섀도잉(Shadowing)은 한 스코프(scope) 내에 두 개의 선언(declaration)이 동일한 이름을 갖는 것을 의미합니다. 그렇다면 어떻게 선택해야 할까요? Kotlin 팁의 이번 에피소드에서 Sebastian Aigner가 완전한 이름(fully qualified names)의 힘을 사용하여 필요한 함수를 정확히 호출하는 간단한 Kotlin 트릭을 보여줍니다:

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin Tips: Unshadowing Declarations"/>

## 엘비스 연산자를 사용한 반환 및 throw

[엘비스](null-safety.md#elvis-operator)가 다시 등장했습니다! Sebastian Aigner는 이 연산자가 유명한 가수에게서 이름을 따온 이유와 Kotlin에서 `?:`를 사용하여 반환하거나 throw하는 방법을 설명합니다. 그 뒤에 숨겨진 마법은? [Nothing 타입](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)입니다.

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin Tips: Return and Throw with the Elvis Operator"/>

## 구조 분해 선언

Kotlin의 [구조 분해 선언](destructuring-declarations.md)을 사용하면 단일 객체에서 여러 변수를 한 번에 생성할 수 있습니다. 이 동영상에서 Sebastian Aigner는 구조 분해될 수 있는 다양한 것들, 즉 페어(pair), 리스트(list), 맵(map) 등을 보여줍니다. 그리고 사용자 정의 객체는요? Kotlin의 컴포넌트 함수(component functions)가 이에 대한 해답도 제공합니다:

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin Tips: Destructuring Declarations"/>

## 널러블 값과 함께 사용하는 연산자 함수

Kotlin에서는 클래스에 대해 덧셈과 뺄셈 같은 연산자를 오버라이드하고 자신만의 로직을 제공할 수 있습니다. 하지만 좌측과 우측 모두에 널(null) 값을 허용하고 싶다면 어떻게 해야 할까요? 이 동영상에서 Sebastian Aigner가 이 질문에 답합니다:

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin Tips: Operator Functions With Nullable Values"/>

## 코드 시간 측정

Sebastian Aigner가 [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 함수에 대한 빠른 개요를 제공하고, 코드를 측정하는 방법을 배워보세요:

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin Tips: Timing Code"/>

## 루프 개선

이 동영상에서 Sebastian Aigner는 코드를 더 읽기 쉽고, 이해하기 쉬우며, 간결하게 만들기 위해 [루프](control-flow.md#for-loops)를 개선하는 방법을 시연할 것입니다:

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin Tips: Improving Loops"/>

## 문자열

이번 에피소드에서 Kate Petrova는 Kotlin에서 [문자열](strings.md)을 다루는 데 도움이 되는 세 가지 팁을 보여줍니다:

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin Tips: Strings"/>

## 엘비스 연산자 더 효과적으로 사용하기

이 동영상에서 Sebastian Aigner는 [엘비스 연산자](null-safety.md#elvis-operator)에 더 많은 로직을 추가하는 방법, 예를 들어 연산자의 오른쪽 부분에 로깅하는 방법을 보여줄 것입니다:

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin Tips: The Elvis Operator"/>

## Kotlin 컬렉션

이번 에피소드에서 Kate Petrova는 [Kotlin 컬렉션](collections-overview.md)을 다루는 데 도움이 되는 세 가지 팁을 보여줍니다:

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin Tips: Kotlin Collections"/>

## 다음 단계는?

* 저희 [YouTube 재생목록](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7)에서 Kotlin 팁 전체 목록을 확인하세요.
* [일반적인 사례에 대한 관용적인 Kotlin 코드](idioms.md)를 작성하는 방법 알아보기