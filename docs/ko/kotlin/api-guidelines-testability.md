[//]: # (title: 테스트 가능성)

[라이브러리 테스트](api-guidelines-consistency.md#maintain-conventions-and-quality)뿐만 아니라, 여러분의 라이브러리를 사용하는 코드도 테스트 가능하도록 작성해야 합니다.

## 전역 상태 및 상태를 가지는 최상위 함수 피하기

라이브러리는 전역 변수의 상태에 의존하거나 공개 API의 일부로 상태를 가지는(stateful) 최상위 함수를 제공해서는 안 됩니다.
이러한 변수와 함수는 테스트 과정에서 해당 전역 값을 제어할 방법을 찾아야 하므로, 라이브러리를 사용하는 코드를 테스트하기 어렵게 만듭니다.

예를 들어, 어떤 라이브러리가 현재 시간에 접근할 수 있는 전역 함수를 정의한다고 가정해 보겠습니다.

```kotlin
val instant: Instant = Clock.now()
println(instant)
```

이 API를 사용하는 모든 코드는 테스트하기 어렵습니다. `now()` 함수를 호출하면 항상 실제 현재 시간이 반환되지만, 테스트 중에는 대신 가짜 값(fake values)을 반환하고 싶을 때가 많기 때문입니다.

테스트 가능성을 높이기 위해, [`kotlinx-datetime`](https://github.com/Kotlin/kotlinx-datetime) 라이브러리는 사용자가 `Clock` 인스턴스를 가져온 다음, 이를 사용하여 현재 시간을 가져올 수 있는 API를 제공합니다.

```kotlin
val clock: Clock = Clock.System
val instant: Instant = clock.now()
println(instant)
```

이를 통해 라이브러리 사용자는 자신의 클래스에 `Clock` 인스턴스를 주입(inject)하고, 테스트 중에는 실제 구현을 가짜 구현으로 대체할 수 있습니다.

## 다음 단계

아직 확인하지 않았다면 다음 페이지들을 살펴보는 것을 권장합니다.

* [하위 호환성(Backward compatibility)](api-guidelines-backward-compatibility.md) 페이지에서 하위 호환성을 유지하는 방법에 대해 알아보세요.
* 효과적인 문서화 관행에 대한 광범위한 개요는 [유익한 문서화(Informative Documentation)](api-guidelines-informative-documentation.md)를 참조하세요.