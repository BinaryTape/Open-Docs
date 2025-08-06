[//]: # (title: 디버깅 용이성)

라이브러리 사용자는 라이브러리의 기능을 기반으로 기능을 구축할 것이며, 그들이 구축하는 기능에는 식별하고 해결해야 할 오류가 포함될 것입니다. 이 오류 해결 프로세스는 개발 중에는 디버거 내에서 수행되거나, 프로덕션 환경에서는 로깅 및 관찰 가능성(observability) 도구를 사용하여 수행될 수 있습니다. 여러분의 라이브러리는 디버깅을 더 쉽게 만들기 위해 다음 모범 사례를 따를 수 있습니다.

## 상태 저장 타입(stateful types)에 `toString` 메서드 제공

상태를 포함하는 모든 타입에 대해 의미 있는 `toString` 구현을 제공하십시오. 이 구현은 내부 타입에 대해서도 인스턴스의 현재 내용을 이해할 수 있는 표현으로 반환해야 합니다.

`toString`으로 표현된 타입은 종종 로그에 기록되므로, 이 메서드를 구현할 때 보안을 고려하고 민감한 사용자 데이터를 반환하지 마십시오.

상태를 설명하는 데 사용되는 형식이 라이브러리의 여러 타입 전반에 걸쳐 가능한 한 일관되도록 보장하십시오. 이 형식은 API에 의해 구현되는 계약의 일부인 경우 명시적으로 설명되고 철저히 문서화되어야 합니다. `toString` 메서드의 출력은 예를 들어 자동화된 테스트 스위트에서 파싱(parsing)을 지원할 수 있습니다.

예를 들어, 서비스 구독을 지원하는 라이브러리의 다음 타입을 고려해 보십시오:

```kotlin
enum class SubscriptionResultReason {
    Success, InsufficientFunds, IncompatibleAccount
}

class SubscriptionResult(
    val result: Boolean,
    val reason: SubscriptionResultReason,
    val description: String
)
```

`toString` 메서드 없이 `SubscriptionResult` 인스턴스를 출력하는 것은 그다지 유용하지 않습니다:

```kotlin
fun main() {
    val result = SubscriptionResult(
       false,
       IncompatibleAccount,
       "Users account does not support this type of subscription"
    )
    
    //prints 'org.example.SubscriptionResult@13221655'
    println(result)
}
```

디버거에서도 정보가 쉽게 표시되지 않습니다:

![Results in the debugger](debugger-result.png){width=500}

간단한 `toString` 구현을 추가하면 두 경우 모두에서 출력이 크게 향상됩니다:

```kotlin
//prints 'Subscription failed (reason=IncompatibleAccount, description="Users 
// account does not support this type of subscription")'
override fun toString(): String {
    val resultText = if(result) "succeeded" else "failed"
    return "Subscription $resultText (reason=$reason, description=\"$description\")"
}
```

![Adding toString results in a much better result](debugger-result-tostring.png){width=700}

`toString` 메서드를 자동으로 얻기 위해 데이터 클래스를 사용하는 것이 유혹적일 수 있지만, 하위 호환성(backward compatibility) 문제로 인해 권장되지 않습니다. 데이터 클래스는 [API에서 데이터 클래스 사용 피하기](api-guidelines-backward-compatibility.md#avoid-using-data-classes-in-your-api) 섹션에서 더 자세히 논의됩니다.

`toString` 메서드에 설명된 상태가 문제 도메인(problem domain)의 정보일 필요는 없다는 점에 유의하십시오. 이는 진행 중인 요청의 상태(위 예시와 같이), 외부 서비스 연결 상태, 또는 진행 중인 작업 내의 중간 상태와 관련될 수 있습니다.

예를 들어, 다음 빌더 타입을 고려해 보십시오:

```kotlin
class Person(
    val name: String?,
    val age: Int?,
    val children: List<Person>
) {
    override fun toString(): String =
        "Person(name=$name, age=$age, children=$children)"
}

class PersonBuilder {
    var name: String? = null
    var age: Int? = null
    val children = arrayListOf<Person>()

    fun child(personBuilder: PersonBuilder.() -> Unit = {}) {
       children.add(person(personBuilder))
    }
    fun build(): Person = Person(name, age, children)
}

fun person(personBuilder: PersonBuilder.() -> Unit = {}): Person = 
    PersonBuilder().apply(personBuilder).build()
```

이 타입은 다음과 같이 사용됩니다:

![Using the builder type example](halt-breakpoint.png){width=500}

위 이미지에 표시된 중단점에서 코드를 중지하면 표시되는 정보는 도움이 되지 않을 것입니다:

![Halting code at the breakpoint result](halt-result.png){width=500}

간단한 `toString` 구현을 추가하면 훨씬 더 유용한 출력을 얻을 수 있습니다:

```kotlin
override fun toString(): String =
    "PersonBuilder(name=$name, age=$age, children=$children)"
```

이를 추가하면 디버거에 다음이 표시됩니다:

![Adding toString to the halt point](halt-tostring-result.png){width=700}

이 방법으로 어떤 필드가 설정되었고 어떤 필드가 설정되지 않았는지 즉시 확인할 수 있습니다.

## 예외 처리 정책 채택 및 문서화

[적절한 오류 처리 메커니즘 선택](api-guidelines-consistency.md#choose-the-appropriate-error-handling-mechanism) 섹션에서 논의된 바와 같이, 라이브러리가 오류를 알리기 위해 예외를 던지는 것이 적절한 경우가 있습니다. 이를 위해 자신만의 예외 타입을 생성할 수 있습니다.

저수준(low-level) API를 추상화하고 단순화하는 라이브러리는 해당 종속성(dependencies)에 의해 발생하는 예외도 처리해야 합니다. 라이브러리는 예외를 억제하거나, 있는 그대로 전달하거나, 다른 타입의 예외로 변환하거나, 다른 방식으로 사용자에게 오류를 알릴 수 있습니다.

이러한 옵션 중 어느 것이든 컨텍스트에 따라 유효할 수 있습니다. 예를 들어:

*   사용자가 라이브러리 B를 단순화하는 편의성만을 위해 라이브러리 A를 채택한다면, 라이브러리 A가 라이브러리 B에 의해 생성된 예외를 수정 없이 다시 던지는 것이 적절할 수 있습니다.
*   라이브러리 A가 라이브러리 B를 순전히 내부 구현 세부 사항으로 채택한다면, 라이브러리 B에 의해 발생하는 라이브러리별 예외는 라이브러리 A의 사용자에게 노출되어서는 안 됩니다.

사용자가 라이브러리를 생산적으로 활용할 수 있도록 예외 처리에 대한 일관된 접근 방식을 채택하고 문서화해야 합니다. 이는 디버깅에 특히 중요합니다. 라이브러리 사용자는 디버거와 로그에서 예외가 자신의 라이브러리에서 발생했음을 인식할 수 있어야 합니다.

예외의 타입은 오류의 타입을 나타내야 하며, 예외의 데이터는 사용자가 문제의 근본 원인(root cause)을 찾는 데 도움이 되어야 합니다. 일반적인 패턴은 저수준 예외를 라이브러리별 예외로 래핑(wrap)하고, 원래 예외는 `cause`로 접근 가능하게 하는 것입니다.

## 다음 단계

가이드의 다음 부분에서는 테스트 용이성(testability)에 대해 배울 것입니다.

[다음 파트로 진행](api-guidelines-testability.md)