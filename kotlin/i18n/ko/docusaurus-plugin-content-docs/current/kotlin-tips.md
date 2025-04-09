---
title: "Kotlin 팁"
---
Kotlin Tips는 Kotlin 팀 구성원들이 코드를 작성할 때 더욱 효율적이고 관용적인 방식으로 Kotlin을 사용하는 방법을 보여주는 짧은 비디오 시리즈입니다.

새로운 Kotlin Tips 비디오를 놓치지 않으려면 [YouTube 채널을 구독하세요](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw).

## Kotlin에서 null + null

Kotlin에서 `null + null`을 더하면 어떻게 되고, 어떤 값이 반환될까요? Sebastian Aigner가 최신 퀵 팁에서 이 미스터리를 다룹니다. 그 과정에서 nullables를 두려워할 이유가 없는 이유도 보여줍니다.

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin Tips: null + null in Kotlin"/>

## 컬렉션 아이템 중복 제거

중복 항목이 포함된 Kotlin 컬렉션이 있나요? 고유한 항목만 있는 컬렉션이 필요하신가요? Sebastian Aigner가 이 Kotlin 팁에서 목록에서 중복 항목을 제거하거나 세트로 변환하는 방법을 보여줍니다.

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin Tips: Deduplicating Collection Items"/>

## suspend 및 inline 미스터리

[`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html), [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 및 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)와 같은 함수가 코루틴을 인식하지 못하는 시그니처를 가졌음에도 불구하고 람다에서 일시 중단 함수를 허용하는 이유는 무엇일까요? 이번 Kotlin Tips 에피소드에서 Sebastian Aigner가 이 수수께끼를 해결합니다. 그것은 inline 수정자와 관련이 있습니다.

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin Tips: The Suspend and Inline Mystery"/>

## 정규화된 이름을 사용하여 선언의 Shadowing 해제

Shadowing은 스코프 내에서 동일한 이름을 가진 두 개의 선언을 갖는 것을 의미합니다. 그렇다면 어떻게 선택해야 할까요? 이번 Kotlin Tips 에피소드에서 Sebastian Aigner는 정규화된 이름의 힘을 사용하여 필요한 함수를 정확하게 호출하는 간단한 Kotlin 트릭을 보여줍니다.

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin Tips: Unshadowing Declarations"/>

## Elvis 연산자로 반환 및 throw하기

[Elvis](null-safety#elvis-operator)가 다시 등장했습니다! Sebastian Aigner는 왜 이 연산자가 유명한 가수의 이름을 따서 지어졌는지, 그리고 Kotlin에서 `?:`를 사용하여 반환하거나 throw하는 방법을 설명합니다. 이면의 마법은 무엇일까요? [The Nothing type](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)입니다.

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin Tips: Return and Throw with the Elvis Operator"/>

## 구조 분해 선언

Kotlin의 [구조 분해 선언](destructuring-declarations)을 사용하면 단일 객체에서 여러 변수를 한 번에 생성할 수 있습니다. 이 비디오에서 Sebastian Aigner는 구조 분해할 수 있는 것들(쌍, 목록, 맵 등)을 보여줍니다. 그리고 사용자 정의 객체는 어떻습니까? Kotlin의 component 함수가 이에 대한 해답을 제공합니다.

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin Tips: Destructuring Declarations"/>

## nullable 값을 사용하는 연산자 함수

Kotlin에서는 클래스에 대한 더하기 및 빼기와 같은 연산자를 재정의하고 자체 논리를 제공할 수 있습니다. 하지만 왼쪽과 오른쪽 모두에서 null 값을 허용하려면 어떻게 해야 할까요? 이 비디오에서 Sebastian Aigner는 이 질문에 답합니다.

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin Tips: Operator Functions With Nullable Values"/>

## 코드 시간 측정

Sebastian Aigner가 [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 함수에 대한 간략한 개요를 제공하고 코드를 시간 측정하는 방법을 알아보세요.

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin Tips: Timing Code"/>

## 루프 개선

이 비디오에서 Sebastian Aigner는 코드를 더 읽기 쉽고 이해하기 쉽고 간결하게 만들기 위해 [루프](control-flow#for-loops)를 개선하는 방법을 보여줍니다.

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin Tips: Improving Loops"/>

## 문자열

이번 에피소드에서 Kate Petrova는 Kotlin에서 [문자열](strings)을 사용하는 데 도움이 되는 세 가지 팁을 보여줍니다.

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin Tips: Strings"/>

## Elvis 연산자로 더 많은 작업 수행

이 비디오에서 Sebastian Aigner는 연산자의 오른쪽 부분에 로깅하는 것과 같이 [Elvis 연산자](null-safety#elvis-operator)에 더 많은 논리를 추가하는 방법을 보여줍니다.

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin Tips: The Elvis Operator"/>

## Kotlin 컬렉션

이번 에피소드에서 Kate Petrova는 [Kotlin 컬렉션](collections-overview)을 사용하는 데 도움이 되는 세 가지 팁을 보여줍니다.

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin Tips: Kotlin Collections"/>

## 다음은 무엇일까요?

* [YouTube 재생 목록](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7)에서 Kotlin Tips의 전체 목록을 확인하세요.
* [인기 있는 사례에 대한 관용적인 Kotlin 코드](idioms)를 작성하는 방법을 알아보세요.