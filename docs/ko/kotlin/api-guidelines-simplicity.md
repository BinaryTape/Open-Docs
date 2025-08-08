[//]: # (title: 간결성)

사용자가 이해해야 할 개념이 적고, 이러한 개념들이 더 명시적으로 전달될수록, 그들의 정신적 모델은 더 단순해질 가능성이 높습니다. 이는 API 내 연산과 추상화의 수를 제한함으로써 달성될 수 있습니다.

라이브러리 내 선언의 [가시성](visibility-modifiers.md)이 내부 구현 세부 정보를 공개 API에 노출하지 않도록 적절하게 설정되었는지 확인하세요. 공개적으로 사용하도록 명시적으로 설계되고 문서화된 API만 사용자에게 접근 가능해야 합니다.

이 가이드의 다음 부분에서는 간결성을 촉진하기 위한 몇 가지 가이드라인에 대해 논의할 것입니다.

## 명시적 API 모드 사용

Kotlin 컴파일러의 [명시적 API 모드](whatsnew14.md#explicit-api-mode-for-library-authors) 기능을 사용할 것을 권장합니다. 이 기능은 라이브러리용 API를 설계할 때 의도를 명시적으로 밝히도록 강제합니다.

명시적 API 모드를 사용하면 다음을 수행해야 합니다:

*   기본 `public` 가시성에 의존하는 대신, 선언에 가시성 변경자(visibility modifiers)를 추가하여 `public`으로 만드세요. 이는 공개 API의 일부로 무엇을 노출할지 고려했음을 보장합니다.
*   추론된 타입으로 인해 API가 의도치 않게 변경되는 것을 방지하기 위해 모든 `public` 함수와 프로퍼티의 타입을 명시적으로 정의하세요.

## 기존 개념 재사용

API의 크기를 제한하는 한 가지 방법은 기존 타입을 재사용하는 것입니다. 예를 들어, 지속 시간을 위한 새로운 타입을 생성하는 대신, [`kotlin.time.Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)을 사용할 수 있습니다. 이 접근 방식은 개발을 간소화할 뿐만 아니라 다른 라이브러리와의 상호 운용성도 향상시킵니다.

서드파티 라이브러리 또는 플랫폼별 타입에 의존할 때는 주의하세요. 이는 라이브러리를 해당 요소에 종속시킬 수 있기 때문입니다. 이러한 경우, 비용이 이점보다 클 수 있습니다.

`String`, `Long`, `Pair`, `Triple`과 같은 공통 타입을 재사용하는 것은 효과적일 수 있지만, 이러한 방식이 도메인 특화 로직을 더 잘 캡슐화하는 추상 데이터 타입(abstract data types) 개발을 막아서는 안 됩니다.

## 핵심 API 정의 및 기반 구축

간결성을 위한 또 다른 방법은 제한된 수의 핵심 연산을 중심으로 하는 작은 개념 모델을 정의하는 것입니다. 이러한 연산의 동작이 명확하게 문서화되면, 이 핵심 함수들을 직접 기반으로 하거나 결합하는 새로운 연산을 개발하여 API를 확장할 수 있습니다.

예를 들어:

*   [Kotlin Flows API](flow.md)에서는 [`filter`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html) 및 [`map`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html)과 같은 일반적인 연산이 [`transform`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/transform.html) 연산을 기반으로 구축됩니다.
*   [Kotlin Time API](time-measurement.md)에서는 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 함수가 [`TimeSource.Monotonic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/-monotonic/)을 활용합니다.

이러한 핵심 구성 요소를 기반으로 추가 연산을 구축하는 것이 종종 이점이 있지만, 항상 필요한 것은 아닙니다. 기능성을 확장하거나 다양한 입력에 더 광범위하게 적응하는 최적화되거나 플랫폼별 변형을 도입할 기회를 찾을 수도 있습니다.

사용자가 핵심 연산을 사용하여 간단하지 않은 문제(non-trivial problems)를 해결할 수 있고, 어떤 동작도 변경하지 않고 추가 연산으로 솔루션을 리팩토링할 수 있는 한, 개념 모델의 간결성은 유지됩니다.

## 다음 단계

이 가이드의 다음 부분에서는 가독성에 대해 배울 것입니다.

[다음 부분으로 진행하기](api-guidelines-readability.md)