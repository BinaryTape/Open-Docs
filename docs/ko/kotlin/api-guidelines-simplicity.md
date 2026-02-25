[//]: # (title: 단순성)

사용자가 이해해야 할 개념이 적고 이러한 개념이 명확하게 전달될수록, 사용자의 멘탈 모델(mental model)은 더 단순해질 가능성이 높습니다. 이는 API 내의 연산과 추상화의 수를 제한함으로써 달성할 수 있습니다.

라이브러리 내 선언의 [가시성(visibility)](visibility-modifiers.md)을 적절하게 설정하여 내부 구현 세부 사항이 공개 API에 노출되지 않도록 하세요. 명시적으로 설계되고 공개용으로 문서화된 API만 사용자가 접근할 수 있어야 합니다.

가이드의 다음 부분에서는 단순성을 증진하기 위한 몇 가지 가이드라인을 살펴보겠습니다.

## 명시적 API 모드 사용

Kotlin 컴파일러의 [명시적 API 모드(explicit API mode)](whatsnew14.md#explicit-api-mode-for-library-authors) 기능을 사용하는 것이 좋습니다. 이 기능을 사용하면 라이브러리용 API를 설계할 때 의도를 명확하게 밝히도록 강제할 수 있습니다.

명시적 API 모드를 사용하면 다음 사항을 준수해야 합니다.

* 기본 공개 가시성(default public visibility)에 의존하는 대신, 선언에 가시성 제어자를 추가하여 명시적으로 `public`으로 설정해야 합니다. 이를 통해 공개 API의 일부로 무엇을 노출할지 한 번 더 고려하게 됩니다.
* 모든 공개 함수 및 프로퍼티의 타입을 정의해야 합니다. 이를 통해 타입 추론으로 인해 API가 의도치 않게 변경되는 것을 방지할 수 있습니다.

## 기존 개념 재사용

API의 규모를 제한하는 한 가지 방법은 기존 타입을 재사용하는 것입니다. 예를 들어, 기간(duration)을 위한 새로운 타입을 만드는 대신 [`kotlin.time.Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)을 사용할 수 있습니다. 이 접근 방식은 개발 과정을 효율화할 뿐만 아니라 다른 라이브러리와의 상호 운용성도 개선합니다.

서드파티 라이브러리 타입이나 플랫폼 전용 타입에 의존할 때는 주의해야 합니다. 라이브러리가 해당 요소에 종속될 수 있기 때문입니다. 이런 경우에는 이점보다 비용이 더 클 수 있습니다.

`String`, `Long`, `Pair`, `Triple`과 같은 공통 타입을 재사용하는 것이 효과적일 수 있지만, 도메인 특화 로직을 더 잘 캡슐화할 수 있는 추상 데이터 타입(abstract data types) 개발을 주저해서는 안 됩니다.

## 핵심 API 정의 및 이를 기반으로 구축

단순성으로 가는 또 다른 길은 제한된 핵심 연산 세트를 기반으로 작은 개념 모델을 정의하는 것입니다. 이러한 연산의 동작이 명확하게 문서화되면, 핵심 함수를 직접 기반으로 하거나 결합하는 새로운 연산을 개발하여 API를 확장할 수 있습니다.

예를 들어:

* [Kotlin Flows API](flow.md)에서 [`filter`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html)와 [`map`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html) 같은 공통 연산은 [`transform`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/transform.html) 연산을 기반으로 구축되었습니다.
* [Kotlin Time API](time-measurement.md)에서 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 함수는 [`TimeSource.Monotonic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/-monotonic/)을 활용합니다.

추가 연산을 이러한 핵심 컴포넌트를 기반으로 두는 것이 유익한 경우가 많지만, 항상 필수적인 것은 아닙니다. 기능을 확장하거나 다양한 입력에 더 광범위하게 적응할 수 있는 최적화된 방식이나 플랫폼별 변형을 도입할 기회를 찾을 수도 있습니다.

사용자가 핵심 연산으로 복잡한 문제를 해결할 수 있고, 동작의 변화 없이 추가 연산을 사용하여 솔루션을 리팩터링할 수 있다면 개념 모델의 단순성은 유지됩니다.

## 다음 단계

가이드의 다음 부분에서는 가독성에 대해 알아봅니다. 

[다음 부분으로 진행하기](api-guidelines-readability.md)