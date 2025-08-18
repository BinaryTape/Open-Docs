[//]: # (title: 테스트 용이성)

라이브러리 테스트 ([testing your library](api-guidelines-consistency.md#maintain-conventions-and-quality)) 외에도, 라이브러리를 사용하는 코드가 테스트 가능하도록 보장해야 합니다.

## 전역 상태 및 상태 저장 최상위 함수 피하기

여러분의 라이브러리는 전역 변수의 상태에 의존하거나 공개 API의 일부로 상태 저장 최상위 함수를 제공해서는 안 됩니다. 이러한 변수와 함수는 테스트가 전역 값을 제어할 방법을 찾아야 하므로 라이브러리를 사용하는 코드의 테스트를 어렵게 만듭니다.

예를 들어, 라이브러리가 현재 시간에 대한 접근을 제공하는 전역적으로 접근 가능한 함수를 정의할 수 있습니다.

```kotlin
val instant: Instant = Clock.now()
println(instant)
```

이 API를 사용하는 모든 코드는 테스트하기 어려울 것입니다. `now()` 함수 호출이 항상 실제 현재 시간을 반환하는 반면, 테스트에서는 가짜 값을 반환하는 것이 종종 바람직하기 때문입니다.

테스트 용이성을 확보하기 위해, [`kotlinx-datetime`](https://github.com/Kotlin/kotlinx-datetime) 라이브러리는 사용자가 `Clock` 인스턴스를 얻은 다음 이를 사용하여 현재 시간을 가져올 수 있도록 하는 API를 제공합니다.

```kotlin
val clock: Clock = Clock.System
val instant: Instant = clock.now()
println(instant)
```

이를 통해 라이브러리 사용자는 자신의 클래스에 `Clock` 인스턴스를 주입하고, 테스트 중에 실제 구현을 가짜 구현으로 대체할 수 있습니다.

## 다음 단계

아직 다음 페이지들을 살펴보지 않았다면 고려해 보세요.

*   [이전 버전과의 호환성](api-guidelines-backward-compatibility.md) 페이지에서 이전 버전과의 호환성을 유지하는 방법에 대해 알아보세요.
*   효과적인 문서화 관행에 대한 광범위한 개요는 [정보성 문서화](api-guidelines-informative-documentation.md)를 참조하세요.