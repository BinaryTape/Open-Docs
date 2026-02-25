[//]: # (title: Kotlin 팁)

Kotlin 팁(Kotlin Tips)은 Kotlin 팀의 멤버들이 Kotlin을 더욱 효율적이고 관용적인 방식으로 사용하여 코드를 작성할 때 더 즐거움을 느낄 수 있는 방법을 보여주는 짧은 동영상 시리즈입니다.

새로운 Kotlin 팁 동영상을 놓치지 않으려면 [저희 YouTube 채널을 구독](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)하세요.

## Kotlin에서의 null + null

Kotlin에서 `null + null`을 더하면 어떤 일이 일어나고, 무엇을 반환할까요? Sebastian Aigner가 최신 퀵 팁에서 이 미스터리를 해결합니다. 더불어, nullable(널 가능) 타입을 두려워할 이유가 없는 이유도 함께 보여줍니다.

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin Tips: null + null in Kotlin"/>

## 컬렉션 항목의 중복 제거

중복 항목이 포함된 Kotlin 컬렉션이 있나요? 고유한 항목만 있는 컬렉션이 필요하신가요? 이번 Kotlin 팁에서 Sebastian Aigner가 리스트에서 중복을 제거하거나 세트(set)로 변환하는 방법을 보여줍니다.

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin Tips: Deduplicating Collection Items"/>

## suspend와 inline의 비밀

`repeat()`, `map()`, `filter()`와 같은 함수들은 시그니처가 코루틴을 인식하지 못함에도 불구하고 어떻게 람다에서 일시 중단 함수(suspending functions)를 허용할까요? 이번 Kotlin 팁 에피소드에서 Sebastian Aigner가 그 수수께끼를 풉니다. 바로 `inline` 한정자(modifier)와 관련이 있습니다.

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin Tips: The Suspend and Inline Mystery"/>

## 완전한 이름(Fully Qualified Name)으로 선언 쉐도잉 해제하기

쉐도잉(Shadowing)이란 하나의 스코프 내에 이름이 같은 두 개의 선언이 있는 것을 의미합니다. 그렇다면 어떤 것을 선택해야 할까요? 이번 Kotlin 팁 에피소드에서 Sebastian Aigner가 완전한 이름(fully qualified names)의 강력한 기능을 사용하여 필요한 함수를 정확하게 호출하는 간단한 Kotlin 트릭을 보여줍니다.

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin Tips: Unshadowing Declarations"/>

## 엘비스 연산자를 사용한 return 및 throw

엘비스(Elvis)가 다시 돌아왔습니다! Sebastian Aigner가 이 연산자가 왜 유명 가수의 이름을 따서 명명되었는지, 그리고 Kotlin에서 `?:`를 사용하여 어떻게 return하거나 throw할 수 있는지 설명합니다. 이 이면에 숨겨진 마법은 무엇일까요? 바로 [Nothing 타입](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)입니다.

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin Tips: Return and Throw with the Elvis Operator"/>

## 구조 분해 선언

Kotlin의 [구조 분해 선언(destructuring declarations)](destructuring-declarations.md)을 사용하면 하나의 객체에서 여러 변수를 한 번에 생성할 수 있습니다. 이 비디오에서 Sebastian Aigner는 쌍(pairs), 리스트, 맵 등 구조 분해할 수 있는 다양한 것들을 보여줍니다. 여러분이 직접 만든 객체는 어떨까요? Kotlin의 컴포넌트 함수(component functions)가 그에 대한 답을 제공합니다.

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin Tips: Destructuring Declarations"/>

## Nullable 값을 사용하는 연산자 함수

Kotlin에서는 클래스에 대해 덧셈이나 뺄셈과 같은 연산자를 오버라이드하고 자신만의 로직을 제공할 수 있습니다. 하지만 연산자의 좌측과 우측 모두에 null 값을 허용하고 싶다면 어떻게 해야 할까요? 이 비디오에서 Sebastian Aigner가 이 질문에 답합니다.

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin Tips: Operator Functions With Nullable Values"/>

## 코드 실행 시간 측정

Sebastian Aigner가 [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 함수에 대해 간략하게 설명하고, 코드의 실행 시간을 측정하는 방법을 알아보세요.

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin Tips: Timing Code"/>

## 루프 개선하기

이 비디오에서 Sebastian Aigner는 코드를 더 읽기 쉽고, 이해하기 쉬우며, 간결하게 만들기 위해 [루프(loops)](control-flow.md#for-loops)를 개선하는 방법을 시연합니다.

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin Tips: Improving Loops"/>

## 문자열

이번 에피소드에서 Kate Petrova는 Kotlin에서 [문자열(Strings)](strings.md)을 다룰 때 도움이 되는 세 가지 팁을 소개합니다.

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin Tips: Strings"/>

## 엘비스 연산자 더 활용하기

이 비디오에서 Sebastian Aigner는 연산자의 우측 부분에 로깅을 추가하는 것과 같이 [엘비스 연산자(Elvis operator)](null-safety.md#elvis-operator)에 더 많은 로직을 추가하는 방법을 보여줍니다.

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin Tips: The Elvis Operator"/>

## Kotlin 컬렉션

이번 에피소드에서 Kate Petrova는 [Kotlin 컬렉션(Kotlin Collections)](collections-overview.md)을 다룰 때 도움이 되는 세 가지 팁을 소개합니다.

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin Tips: Kotlin Collections"/>

## 다음 단계

* [YouTube 재생목록](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7)에서 Kotlin 팁의 전체 목록을 확인하세요.
* [자주 발생하는 상황에 대해 관용적인 Kotlin 코드를 작성하는 방법](idioms.md)을 알아보세요.