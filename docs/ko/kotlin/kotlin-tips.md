[//]: # (title: Kotlin 팁)

Kotlin 팁은 Kotlin 팀원들이 코드를 작성할 때 더 효율적이고 관용적인 방식으로 Kotlin을 사용하여 더 큰 즐거움을 얻을 수 있는 방법을 보여주는 짧은 비디오 시리즈입니다.

새로운 Kotlin 팁 비디오를 놓치지 않으려면 [저희 YouTube 채널을 구독](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)하세요.

## Kotlin에서 null + null

Kotlin에서 `null + null`을 더하면 어떤 일이 발생하고, 무엇을 반환할까요? Sebastian Aigner가 최신 빠른 팁에서 이 미스터리를 다룹니다. 그 과정에서 그는 널러블(nullable)을 두려워할 필요가 없는 이유도 보여줍니다:

<video width="560" height="315" src="https://www.youtube.com/v/wwplVknTza4" title="Kotlin 팁: Kotlin에서 null + null"/>

## 컬렉션 항목 중복 제거

중복을 포함하는 Kotlin 컬렉션이 있으신가요? 고유한 항목만 있는 컬렉션이 필요하신가요? 이 Kotlin 팁에서 Sebastian Aigner가 리스트에서 중복을 제거하거나, 세트(set)로 바꾸는 방법을 보여드립니다:

<video width="560" height="315" src="https://www.youtube.com/v/ECOf0PeSANw" title="Kotlin 팁: 컬렉션 항목 중복 제거"/>

## suspend와 inline의 미스터리

[`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html), [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html), [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)와 같은 함수는 어떻게 람다(lambda)에서 suspending 함수를 받을 수 있을까요? 이들 함수의 시그니처가 코루틴(coroutines)을 인식하지 못하는데도 말이죠? 이 Kotlin 팁 에피소드에서 Sebastian Aigner가 이 수수께끼를 풉니다. `inline` 변경자(modifier)와 관련이 있습니다:

<video width="560" height="315" src="https://www.youtube.com/v/R2395u7SdcI" title="Kotlin 팁: suspend와 inline의 미스터리"/>

## 완전 한정 이름으로 선언의 섀도잉 해제하기

섀도잉(shadowing)은 한 스코프(scope) 내에 두 개의 선언이 같은 이름을 갖는 것을 의미합니다. 그렇다면 어떻게 선택할까요? 이 Kotlin 팁 에피소드에서 Sebastian Aigner는 완전 한정 이름(fully qualified name)의 힘을 사용하여 필요한 함수를 정확하게 호출하는 간단한 Kotlin 트릭을 보여줍니다:

<video width="560" height="315" src="https://www.youtube.com/v/mJRzF9WtCpU" title="Kotlin 팁: 선언의 섀도잉 해제하기"/>

## Elvis 연산자로 반환 및 예외 발생시키기

[엘비스(Elvis)](null-safety.md#elvis-operator)가 다시 등장했습니다! Sebastian Aigner는 이 연산자가 유명 가수의 이름을 따서 명명된 이유와 Kotlin에서 `?:`를 사용하여 값을 반환하거나 예외를 발생(throw)시키는 방법을 설명합니다. 그 뒤에 숨겨진 마법은? [Nothing 타입](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)입니다.

<video width="560" height="315" src="https://www.youtube.com/v/L8aFK7QrbA8" title="Kotlin 팁: Elvis 연산자로 반환 및 예외 발생시키기"/>

## 비구조화 선언

Kotlin의 [비구조화 선언](destructuring-declarations.md)을 사용하면 단일 객체에서 여러 변수를 한 번에 만들 수 있습니다. 이 비디오에서 Sebastian Aigner는 비구조화(destructure)할 수 있는 다양한 것들을 보여줍니다. 예를 들어 페어(pair), 리스트(list), 맵(map) 등이 있습니다. 사용자 정의 객체는 어떨까요? Kotlin의 컴포넌트(component) 함수가 이에 대한 해답을 제공합니다:

<video width="560" height="315" src="https://www.youtube.com/v/zu1PUAvk_Lw" title="Kotlin 팁: 비구조화 선언"/>

## Nullable 값과 함께 사용하는 연산자 함수

Kotlin에서는 클래스에 대해 더하기 및 빼기와 같은 연산자를 재정의하고 자신만의 로직을 제공할 수 있습니다. 하지만 왼쪽과 오른쪽 모두에 null 값을 허용하려면 어떻게 해야 할까요? 이 비디오에서 Sebastian Aigner가 이 질문에 답합니다:

<video width="560" height="315" src="https://www.youtube.com/v/x2bZJv8i0vw" title="Kotlin 팁: Nullable 값과 함께 사용하는 연산자 함수"/>

## 코드 시간 측정하기

Sebastian Aigner가 [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 함수에 대한 간략한 개요를 제공하는 것을 시청하고, 코드 시간을 측정하는 방법을 알아보세요:

<video width="560" height="315" src="https://www.youtube.com/v/j_LEcry7Pms" title="Kotlin 팁: 코드 시간 측정하기"/>

## 루프 개선하기

이 비디오에서 Sebastian Aigner는 코드를 더 읽기 쉽고, 이해하기 쉬우며, 간결하게 만들기 위해 [루프](control-flow.md#for-loops)를 개선하는 방법을 보여줄 것입니다:

<video width="560" height="315" src="https://www.youtube.com/v/i-kyPp1qFBA" title="Kotlin 팁: 루프 개선하기"/>

## 문자열

이 에피소드에서 Kate Petrova는 Kotlin에서 [문자열](strings.md) 작업을 돕는 세 가지 팁을 보여줍니다:

<video width="560" height="315" src="https://www.youtube.com/v/IL3RLKvWJF4" title="Kotlin 팁: 문자열"/>

## Elvis 연산자 더 활용하기

이 비디오에서 Sebastian Aigner는 [Elvis 연산자](null-safety.md#elvis-operator)에 더 많은 로직을 추가하는 방법, 예를 들어 연산자의 오른쪽 부분에 로깅(logging)을 추가하는 방법을 보여줄 것입니다:

<video width="560" height="315" src="https://www.youtube.com/v/L9wqYQ-fXaM" title="Kotlin 팁: Elvis 연산자"/>

## Kotlin 컬렉션

이 에피소드에서 Kate Petrova는 [Kotlin 컬렉션](collections-overview.md) 작업을 돕는 세 가지 팁을 보여줍니다:

<video width="560" height="315" src="https://www.youtube.com/v/ApXbm1T_eI4" title="Kotlin 팁: Kotlin 컬렉션"/>

## 다음은 무엇인가요?

* 저희 [YouTube 플레이리스트](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7)에서 Kotlin 팁의 전체 목록을 확인하세요.
* [인기 있는 사용 사례를 위한 관용적인 Kotlin 코드](idioms.md)를 작성하는 방법을 알아보세요.