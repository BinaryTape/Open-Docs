[//]: # (title: 일관성)

API 설계에서 일관성은 사용 편의성을 보장하는 데 매우 중요합니다. 매개변수 순서, 명명 규칙 및 오류 처리 메커니즘을 일관되게 유지함으로써, 라이브러리는 사용자에게 더욱 직관적이고 신뢰할 수 있는 도구가 됩니다. 이러한 모범 사례를 따르면 혼동과 오용을 방지하여 더 나은 개발자 경험(Developer Experience)을 제공하고 더 견고한 애플리케이션을 만들 수 있습니다.

## 매개변수 순서, 명명 및 사용 방식 유지

라이브러리를 설계할 때는 인자(argument)의 순서, 명명 체계 및 오버로딩(overloading) 사용의 일관성을 유지하세요. 예를 들어, 기존 메서드 중 하나가 `offset`과 `length` 매개변수를 사용하고 있다면, 설득력 있는 이유가 없는 한 새로운 메서드에서 `startIndex`와 `endIndex` 같은 대안으로 바꾸지 말아야 합니다.

라이브러리에서 제공하는 오버로드된 함수들은 동일하게 동작해야 합니다. 사용자는 라이브러리에 전달하는 값의 타입을 변경하더라도 동작은 일관되게 유지되기를 기대합니다. 예를 들어, 다음 호출들은 입력값이 의미상 동일하므로 모두 동일한 인스턴스를 생성합니다.

```kotlin
BigDecimal(200)
BigDecimal(200L)
BigDecimal("200")
```

`startIndex` 및 `stopIndex`와 같은 매개변수 이름을 `beginIndex` 및 `endIndex`와 같은 유의어와 혼용하지 마세요. 마찬가지로 컬렉션의 요소에 대해서도 `element`, `item`, `entry` 또는 `entity` 중 하나를 선택하고 이를 고수하세요.

관련된 메서드의 이름은 일관되고 예측 가능하게 지으세요. 예를 들어, Kotlin 표준 라이브러리에는 `first`와 `firstOrNull`, `single`과 `singleOrNull` 같은 쌍이 포함되어 있습니다. 이러한 쌍은 일부는 `null`을 반환할 수 있고 다른 일부는 예외를 발생시킬 수 있음을 명확하게 나타냅니다. 매개변수는 일반적인 것에서 구체적인 순서로 선언하여, 필수 입력이 먼저 오고 선택적 입력이 마지막에 오도록 해야 합니다. 예를 들어, [`CharSequence.findAnyOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/find-any-of.html)에서는 `strings` 컬렉션이 먼저 오고, 그 뒤에 `startIndex`, 마지막으로 `ignoreCase` 플래그가 옵니다.

직원 기록을 관리하고 다음과 같은 직원 검색용 API를 제공하는 라이브러리를 가정해 보겠습니다.

```kotlin
fun findStaffBySeniority(
    startIndex: Int, 
    minYearsServiceExclusive: Int
): List<Employee>

fun findStaffByAge(
    minAgeInclusive: Int, 
    startIndex: Int
): List<Employee>
```

이 API는 정확하게 사용하기가 매우 어려울 것입니다. 동일한 타입의 여러 매개변수가 일관되지 않은 순서로 배치되어 있으며, 일관되지 않은 방식으로 사용되고 있습니다. 라이브러리 사용자는 기존 함수에서의 경험을 바탕으로 새로운 함수에 대해 잘못된 가정을 할 가능성이 큽니다.

## 데이터와 상태에 객체 지향 설계 사용

Kotlin은 객체 지향(Object-Oriented) 및 함수형(Functional) 프로그래밍 스타일을 모두 지원합니다. API에서 데이터와 상태를 표현할 때는 클래스를 사용하세요. 데이터와 상태가 계층 구조를 가질 때는 상속을 고려하세요.

필요한 모든 상태를 매개변수로 전달할 수 있다면 최상위 함수(top-level functions)를 사용하는 것이 좋습니다. 이러한 함수 호출이 체이닝(chaining)될 경우, 가독성을 높이기 위해 확장 함수(extension functions)로 작성하는 것을 고려해 보세요.

## 적절한 오류 처리 메커니즘 선택

Kotlin은 오류 처리를 위한 여러 메커니즘을 제공합니다. API는 예외(exception)를 던지거나, `null` 값을 반환하거나, 커스텀 결과 타입을 사용하거나, 내장된 [`Result`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/) 타입을 사용할 수 있습니다. 라이브러리가 이러한 옵션들을 일관되고 적절하게 사용하는지 확인하세요.

데이터를 가져오거나 계산할 수 없을 때는 널 허용(nullable) 반환 타입을 사용하고, 데이터가 없음을 나타내기 위해 `null`을 반환하세요. 그 외의 경우에는 예외를 던지거나 `Result` 타입을 반환하세요.

함수의 오버로드를 제공하여, 하나는 예외를 던지고 다른 하나는 대신 결과 타입으로 감싸서 반환하도록 하는 것을 고려해 보세요. 이 경우, 함수 내에서 예외가 캡처됨을 나타내기 위해 `Catching` 접미사를 사용하세요. 예를 들어, 표준 라이브러리에는 이 관례를 사용하는 [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) 및 [`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run-catching.html) 함수가 있으며, 코루틴 라이브러리에는 채널을 위한 [`receive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html) 및 [`receiveCatching`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive-catching.html) 메서드가 있습니다.

일반적인 제어 흐름(control flow)을 위해 예외를 사용하는 것은 피하세요. 작업을 시도하기 전에 조건 확인이 가능하도록 API를 설계하여 불필요한 오류 처리를 방지하세요. [명령 및 조회 분리(Command / Query Separation)](https://martinfowler.com/bliki/CommandQuerySeparation.html)는 여기서 적용할 수 있는 유용한 패턴입니다.

## 컨벤션 및 품질 유지

일관성의 마지막 측면은 라이브러리 자체의 설계가 아니라 높은 수준의 품질을 유지하는 것과 관련이 있습니다.

정적 분석을 위한 자동화 도구(린터)를 사용하여 코드가 일반적인 Kotlin 컨벤션과 프로젝트별 컨벤션을 모두 따르고 있는지 확인해야 합니다.

또한 Kotlin 라이브러리는 모든 API 엔트리 포인트의 문서화된 동작을 모두 다루는 유닛 및 통합 테스트 스위트를 제공해야 합니다. 테스트에는 광범위한 입력값, 특히 알려진 경계값(boundary cases) 및 엣지 케이스(edge cases)가 포함되어야 합니다. 테스트되지 않은 동작은 (기껏해야) 신뢰할 수 없는 것으로 간주해야 합니다.

개발 중에 이 테스트 스위트를 사용하여 변경 사항이 기존 동작을 손상시키지 않는지 확인하세요. 표준화된 빌드 및 배포 파이프라인의 일부로 모든 릴리스마다 이 테스트를 실행하세요. [Kover](https://github.com/Kotlin/kotlinx-kover)와 같은 도구를 빌드 프로세스에 통합하여 커버리지를 측정하고 보고서를 생성할 수 있습니다.

## 다음 단계

가이드의 다음 부분에서는 예측 가능성에 대해 알아봅니다.

[다음 파트로 진행하기](api-guidelines-predictability.md)