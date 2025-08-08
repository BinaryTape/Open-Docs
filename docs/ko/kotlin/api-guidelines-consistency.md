[//]: # (title: 일관성)

API 디자인에서 일관성은 사용 편의성을 보장하는 데 중요합니다. 일관된 매개변수 순서, 명명 규칙 및 오류 처리 메커니즘을 유지함으로써 라이브러리는 사용자에게 더 직관적이고 신뢰할 수 있게 됩니다. 이러한 모범 사례를 따르면 혼동과 오용을 방지하고 더 나은 개발자 경험과 견고한 애플리케이션으로 이어질 수 있습니다.

## 매개변수 순서, 명명 및 사용법 유지

라이브러리를 설계할 때, 인자의 순서, 명명 체계, 그리고 오버로딩의 사용에 일관성을 유지해야 합니다. 예를 들어, 기존 메서드 중 하나에 `offset` 및 `length` 매개변수가 있는 경우, 강력한 이유가 없는 한 새 메서드에 `startIndex` 및 `endIndex`와 같은 대안으로 전환해서는 안 됩니다.

라이브러리에서 제공하는 오버로드된 함수는 동일하게 동작해야 합니다. 사용자는 라이브러리에 전달하는 값의 타입을 변경할 때 동작이 일관되게 유지될 것을 기대합니다. 예를 들어, 다음 호출은 입력이 의미상 동일하기 때문에 모두 동일한 인스턴스를 생성합니다.

```kotlin
BigDecimal(200)
BigDecimal(200L)
BigDecimal("200")
```

`startIndex` 및 `stopIndex`와 같은 매개변수 이름을 `beginIndex` 및 `endIndex`와 같은 동의어와 혼용하지 마십시오. 마찬가지로, 컬렉션의 값에 대해 `element`, `item`, `entry` 또는 `entity`와 같은 용어 중 하나를 선택하고 그것을 고수하십시오.

관련 메서드에 일관되고 예측 가능한 이름을 붙이십시오. 예를 들어, Kotlin 표준 라이브러리에는 `first`와 `firstOrNull`, `single` 또는 `singleOrNull`과 같은 쌍이 있습니다. 이 쌍들은 일부는 `null`을 반환할 수 있고 다른 일부는 예외를 발생시킬 수 있음을 명확히 나타냅니다. 매개변수는 일반적인 것에서 구체적인 것으로 선언되어야 하므로, 필수 입력은 먼저 나타나고 선택적 입력은 마지막에 나타나야 합니다. 예를 들어, [`CharSequence.findAnyOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/find-any-of.html)에서는 `strings` 컬렉션이 먼저 오고, 그 다음 `startIndex`, 마지막으로 `ignoreCase` 플래그가 옵니다.

직원 기록을 관리하고 직원을 검색하기 위한 다음 API를 제공하는 라이브러리를 고려해 보십시오:

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

이 API는 올바르게 사용하기 매우 어려울 것입니다. 동일한 타입의 여러 매개변수가 일관되지 않은 순서로 제시되고 일관되지 않은 방식으로 사용됩니다. 라이브러리 사용자는 기존 함수에 대한 경험을 바탕으로 새로운 함수에 대해 잘못된 가정을 할 가능성이 높습니다.

## 데이터와 상태에 객체 지향 디자인 사용

Kotlin은 객체 지향(Object-Oriented) 및 함수형 프로그래밍(Functional programming) 스타일을 모두 지원합니다. API에서 데이터와 상태를 표현하는 데 클래스를 사용하십시오. 데이터와 상태가 계층적일 때 상속(inheritance) 사용을 고려하십시오.

필요한 모든 상태가 매개변수로 전달될 수 있다면, 최상위 함수(top-level functions) 사용을 선호하십시오. 이러한 함수 호출이 체인(chained)될 경우, 가독성을 높이기 위해 확장 함수(extension functions)로 작성하는 것을 고려하십시오.

## 적절한 오류 처리 메커니즘 선택

Kotlin은 여러 오류 처리 메커니즘을 제공합니다. API는 예외(exception)를 던지거나, `null` 값을 반환하거나, 사용자 지정 결과 타입(custom result type)을 사용하거나, 내장된 [`Result`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/) 타입을 사용할 수 있습니다. 라이브러리가 이러한 옵션을 일관되고 적절하게 사용하도록 하십시오.

데이터를 가져오거나 계산할 수 없는 경우, 널 허용(nullable) 반환 타입을 사용하고 `null`을 반환하여 데이터 누락을 나타내십시오. 다른 경우에는 예외를 던지거나 `Result` 타입을 반환하십시오.

한 함수는 예외를 던지고 다른 함수는 대신 결과 타입으로 예외를 감싸는 함수 오버로딩을 제공하는 것을 고려해 보십시오. 이 경우, 함수에서 예외가 포착됨을 나타내기 위해 `Catching` 접미사를 사용하십시오. 예를 들어, 표준 라이브러리는 이 컨벤션을 사용하는 [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) 및 [`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run-catching.html) 함수를 가지고 있으며, 코루틴 라이브러리에는 채널을 위한 [`receive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html) 및 [`receiveCatching`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive-catching.html) 메서드가 있습니다.

일반적인 제어 흐름에 예외를 사용하는 것을 피하십시오. 불필요한 오류 처리를 방지하기 위해 작업 시도 전에 조건 검사를 허용하도록 API를 설계하십시오. [명령/질의 분리(Command / Query Separation)](https://martinfowler.com/bliki/CommandQuerySeparation.html)는 여기에 적용될 수 있는 유용한 패턴입니다.

## 컨벤션 및 품질 유지

일관성의 마지막 측면은 라이브러리 자체의 디자인보다는 높은 수준의 품질을 유지하는 것과 관련이 있습니다.

코드가 일반적인 Kotlin 컨벤션과 프로젝트별 컨벤션을 모두 따르도록 정적 분석을 위해 자동화된 도구(linters)를 사용해야 합니다.

Kotlin 라이브러리는 모든 API 진입점의 문서화된 모든 동작을 다루는 유닛 및 통합 테스트 스위트(suite)를 제공해야 합니다. 테스트는 광범위한 입력을 포함해야 하며, 특히 알려진 경계 및 예외적인 경우(edge cases)를 포함해야 합니다. 테스트되지 않은 모든 동작은 (최고의 경우에도) 신뢰할 수 없는 것으로 간주되어야 합니다.

개발 중 이 테스트 스위트를 사용하여 변경 사항이 기존 동작을 손상시키지 않는지 확인하십시오. 표준화된 빌드 및 릴리스 파이프라인의 일부로 모든 릴리스 시 이러한 테스트를 실행하십시오. [Kover](https://github.com/Kotlin/kotlinx-kover)와 같은 도구는 빌드 프로세스에 통합되어 커버리지를 측정하고 보고서를 생성할 수 있습니다.

## 다음 단계

가이드의 다음 부분에서는 예측 가능성에 대해 배울 것입니다.

[다음 부분으로 진행](api-guidelines-predictability.md)