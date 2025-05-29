[//]: # (title: Kotlin 1.8 호환성 가이드)

_[언어를 현대적으로 유지하기](kotlin-evolution-principles.md)_ 및 _[편안한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 근본 원칙 중 일부입니다. 전자는 언어 진화를 방해하는 구성 요소는 제거되어야 한다고 말하며, 후자는 코드 마이그레이션이 가능한 한 원활하도록 이러한 제거가 사전에 잘 전달되어야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 Kotlin 1.7에서 Kotlin 1.8로의 마이그레이션을 위한 완전한 참조를 제공하기 위해 모든 변경 사항을 요약합니다.

## 기본 용어

이 문서에서는 몇 가지 종류의 호환성을 소개합니다:

- _소스_: 소스 비호환성 변경은 이전에 (오류나 경고 없이) 잘 컴파일되던 코드가 더 이상 컴파일되지 않도록 합니다.
- _바이너리_: 두 바이너리 아티팩트는 상호 교환 시 로딩 또는 링크 오류가 발생하지 않는 경우 바이너리 호환성을 가진다고 합니다.
- _동작_: 동일한 프로그램이 변경을 적용하기 전과 후에 다른 동작을 보일 경우 해당 변경은 동작 비호환성이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 주어진다는 점을 기억하십시오. 다른 언어 관점(예: Java)에서의 Kotlin 코드 호환성은 이 문서의 범위를 벗어납니다.

## 언어

<!--
### Title

> **Issue**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**:
>
> **Deprecation cycle**:
>
> - 1.6.20: report a warning
> - 1.8.0: raise the warning to an error
-->

### 추상 슈퍼클래스 멤버에 대한 `super` 호출 위임 금지

> **이슈**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin은 명시적 또는 암시적 `super` 호출이 슈퍼클래스의 _추상_ 멤버에 위임될 때, 슈퍼 인터페이스에 기본 구현이 있더라도 컴파일 오류를 보고합니다.
>
> **지원 중단 주기**:
>
> - 1.5.20: 모든 추상 멤버를 오버라이드하지 않는 비추상 클래스 사용 시 경고 보고
> - 1.7.0: `super` 호출이 실제로 슈퍼클래스의 추상 멤버에 접근하는 경우 경고 보고
> - 1.7.0: `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 호환성 모드가 활성화된 경우 영향을 받는 모든 경우에 오류 보고; 점진적 모드에서 오류 보고
> - 1.8.0: 슈퍼클래스에서 오버라이드되지 않은 추상 메서드를 가진 구체 클래스 선언 시, 그리고 `Any` 메서드의 `super` 호출이 슈퍼클래스에서 추상으로 오버라이드된 경우 오류 보고
> - 1.9.0: 명시적으로 슈퍼클래스의 추상 메서드를 `super` 호출하는 경우를 포함하여 영향을 받는 모든 경우에 오류 보고

### `when` 조건식에서 혼동을 야기하는 문법 지원 중단

> **이슈**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.6은 `when` 조건식에서 혼동을 야기하는 여러 문법 구성 요소를 지원 중단했습니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: 영향을 받는 표현식에 지원 중단 경고 도입
> - 1.8.0: 이 경고를 오류로 격상,
>   `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.
> - &gt;= 1.9: 일부 지원 중단된 구성 요소를 새 언어 기능에 재활용

### 다른 숫자 타입 간의 암시적 강제 변환 방지

> **이슈**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **구성 요소**: Kotlin/JVM
>
> **호환성 변경 유형**: 동작
>
> **요약**: Kotlin은 숫자 값을 의미상 해당 타입으로의 다운캐스트만 필요한 원시 숫자 타입으로 자동 변환하는 것을 피할 것입니다.
>
> **지원 중단 주기**:
>
> - < 1.5.30: 영향을 받는 모든 경우에서 이전 동작
> - 1.5.30: 생성된 프로퍼티 델리게이트 접근자에서 다운캐스트 동작 수정,
>   `-Xuse-old-backend`를 사용하여 일시적으로 1.5.30 이전 수정 동작으로 되돌릴 수 있습니다.
> - &gt;= 1.9: 영향을 받는 다른 경우에서 다운캐스트 동작 수정

### `sealed` 클래스의 `private` 생성자를 실제로 `private`으로 만들기

> **이슈**: [KT-44866](https://youtrack.jetbrains.com/issue/KT-44866)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: `sealed` 클래스의 상속자가 프로젝트 구조 어디에든 선언될 수 있도록 제한이 완화된 후, `sealed` 클래스 생성자의 기본 가시성이 `protected`로 변경되었습니다. 그러나 1.8 이전에는 Kotlin이 해당 클래스 스코프 외부에서 `sealed` 클래스의 명시적으로 선언된 `private` 생성자를 호출하는 것을 여전히 허용했습니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: `sealed` 클래스의 `private` 생성자가 해당 클래스 외부에서 호출될 때 경고(또는 점진적 모드에서는 오류) 보고
> - 1.8.0: `private` 생성자에 대해 기본 가시성 규칙 사용(private 생성자에 대한 호출은 해당 호출이 해당 클래스 내부에 있는 경우에만 해석될 수 있음),
>   `-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses` 컴파일러 인수를 지정하여 이전 동작을 일시적으로 되돌릴 수 있습니다.

### 빌더 추론 컨텍스트에서 호환되지 않는 숫자 타입에 대한 `==` 연산자 사용 금지

> **이슈**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.8은 빌더 추론 람다 함수의 스코프에서 `Int`와 `Long`과 같이 호환되지 않는 숫자 타입에 대한 `==` 연산자 사용을 금지하며, 이는 현재 다른 컨텍스트에서와 동일한 방식입니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: 호환되지 않는 숫자 타입에 `==` 연산자가 사용될 때 경고(또는 점진적 모드에서는 오류) 보고
> - 1.8.0: 이 경고를 오류로 격상,
>   `-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### `else` 없는 `if` 문과 `Elvis` 연산자의 우측에 있는 불완전한 `when` 문 금지

> **이슈**: [KT-44705](https://youtrack.jetbrains.com/issue/KT-44705)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.8은 `Elvis` 연산자(`?:`)의 우측에 불완전한 `when` 또는 `else` 브랜치 없는 `if` 표현식을 사용하는 것을 금지합니다. 이전에는 `Elvis` 연산자의 결과가 표현식으로 사용되지 않는 경우 허용되었습니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: 이러한 불완전한 `if` 및 `when` 표현식에 경고(또는 점진적 모드에서는 오류) 보고
> - 1.8.0: 이 경고를 오류로 격상,
>   `-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### 제네릭 타입 별칭 사용 시 상한 위반 금지 (별칭 타입의 여러 타입 인수에 하나의 타입 파라미터가 사용된 경우)

> **이슈**: [KT-29168](https://youtrack.jetbrains.com/issue/KT-29168)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.8은 하나의 타입 별칭 타입 파라미터가 별칭 타입의 여러 타입 인수에 사용되는 경우(예: `typealias Alias<T> = Base<T, T>`), 해당 타입 파라미터의 상한 제한을 위반하는 타입 인수로 타입 별칭을 사용하는 것을 금지합니다.
>
> **지원 중단 주기**:
>
> - 1.7.0: 해당 타입 파라미터의 상한 제약 조건을 위반하는 타입 인수를 가진 타입 별칭 사용 시 경고(또는 점진적 모드에서는 오류) 보고
> - 1.8.0: 이 경고를 오류로 격상,
>  `-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### 제네릭 타입 별칭 사용 시 상한 위반 금지 (별칭 타입의 타입 인수 중 제네릭 타입 인수로 타입 파라미터가 사용된 경우)

> **이슈**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin은 타입 별칭 타입 파라미터가 별칭 타입의 타입 인수 중 제네릭 타입 인수로 사용되는 경우(예: `typealias Alias<T> = Base<List<T>>`), 해당 타입 파라미터의 상한 제한을 위반하는 타입 인수로 타입 별칭을 사용하는 것을 금지합니다.
>
> **지원 중단 주기**:
>
> - 1.8.0: 제네릭 타입 별칭 사용에 해당 타입 파라미터의 상한 제약 조건을 위반하는 타입 인수가 있을 때 경고 보고
> - &gt;=1.10: 경고를 오류로 격상

### 델리게이트 내에서 확장 프로퍼티에 선언된 타입 파라미터 사용 금지

> **이슈**: [KT-24643](https://youtrack.jetbrains.com/issue/KT-24643)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.8은 제네릭 타입에 대한 확장 프로퍼티를 리시버의 타입 파라미터를 안전하지 않은 방식으로 사용하는 제네릭 타입에 위임하는 것을 금지합니다.
>
> **지원 중단 주기**:
>
> - 1.6.0: 특정 방식으로 위임된 프로퍼티의 타입 인자에서 추론된 타입 파라미터를 사용하는 타입에 확장 프로퍼티를 위임할 때 경고(또는 점진적 모드에서는 오류) 보고
> - 1.8.0: 경고를 오류로 격상,
>  `-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### `suspend` 함수에 `@Synchronized` 어노테이션 사용 금지

> **이슈**: [KT-48516](https://youtrack.jetbrains.com/issue/KT-48516)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.8은 `suspend` 함수에 `@Synchronized` 어노테이션을 배치하는 것을 금지합니다. 이는 `suspend` 호출이 동기화된 블록 내에서 발생하도록 허용되어서는 안 되기 때문입니다.
>
> **지원 중단 주기**:
>
> - 1.6.0: `@Synchronized` 어노테이션이 붙은 `suspend` 함수에 경고 보고,
>    점진적 모드에서는 경고가 오류로 보고됩니다.
> - 1.8.0: 경고를 오류로 격상,
>    `-XXLanguage:-SynchronizedSuspendError`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### 비가변 인자(non-vararg) 파라미터에 인자를 전달하기 위해 스프레드 연산자 사용 금지

> **이슈**: [KT-48162](https://youtrack.jetbrains.com/issue/KT-48162)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin은 특정 조건에서 스프레드 연산자(`*`)를 사용하여 배열을 비가변 인자 배열 파라미터에 전달하는 것을 허용했습니다. Kotlin 1.8부터는 이것이 금지됩니다.
>
> **지원 중단 주기**:
>
> - 1.6.0: 비가변 인자 배열 파라미터가 예상되는 곳에 스프레드 연산자를 사용할 때 경고(또는 점진적 모드에서는 오류) 보고
> - 1.8.0: 경고를 오류로 격상,
>   `-XXLanguage:-ReportNonVarargSpreadOnGenericCalls`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### 람다 반환 타입으로 오버로드된 함수에 전달된 람다 내 널 안정성 위반 금지

> **이슈**: [KT-49658](https://youtrack.jetbrains.com/issue/KT-49658)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.8은 람다 반환 타입으로 오버로드된 함수에 전달된 람다에서 `null`을 반환하는 것을 금지합니다. 특히, 오버로드된 함수가 널을 허용하지 않는 반환 타입을 가질 때 그렇습니다. 이전에는 `when` 연산자의 브랜치 중 하나에서 `null`이 반환되는 경우 허용되었습니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: 타입 불일치 경고(또는 점진적 모드에서는 오류) 보고
> - 1.8.0: 경고를 오류로 격상,
>   `-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### 공개 시그니처에서 지역 타입을 추정할 때 널 가능성 유지

> **이슈**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스, 바이너리
>
> **요약**: 명시적으로 지정된 반환 타입 없이 표현식 본문 함수에서 지역 또는 익명 타입이 반환될 때, Kotlin 컴파일러는 해당 타입의 알려진 슈퍼타입을 사용하여 반환 타입을 추론(또는 추정)합니다. 이 과정에서 컴파일러는 실제로는 널 값이 반환될 수 있는 경우에도 널을 허용하지 않는 타입을 추론할 수 있습니다.
>
> **지원 중단 주기**:
>
> - 1.8.0: 유연한 타입을 유연한 슈퍼타입으로 추정
> - 1.8.0: 선언이 널을 허용해야 하지만 널을 허용하지 않는 타입으로 추론될 때 경고를 보고하여 사용자에게 타입을 명시적으로 지정하도록 안내
> - 1.9.0: 널을 허용하는 타입을 널을 허용하는 슈퍼타입으로 추정,
>   `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.

### 오버라이드를 통한 지원 중단 전파 중지

> **이슈**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.9부터는 슈퍼클래스에 지원 중단된 멤버의 지원 중단 상태가 서브클래스에 있는 해당 오버라이딩 멤버로 더 이상 전파되지 않습니다. 따라서 슈퍼클래스 멤버를 지원 중단하면서 서브클래스에서는 지원 중단되지 않은 상태로 유지하는 명시적인 메커니즘을 제공합니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: 향후 동작 변경에 대한 메시지와 함께 경고를 보고하고, 이 경고를 억제하거나 지원 중단된 멤버를 오버라이드할 때 `@Deprecated` 어노테이션을 명시적으로 작성하도록 안내
> - 1.9.0: 오버라이드된 멤버로 지원 중단 상태 전파 중지. 이 변경 사항은 점진적 모드에서도 즉시 적용됩니다.

### 빌더 추론 컨텍스트에서 사용 지점 타입 정보 없이 타입 변수를 상한으로 암시적으로 추론하는 것 금지

> **이슈**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.9부터는 빌더 추론 람다 함수의 스코프에서 사용 지점 타입 정보가 없는 경우 타입 변수를 해당 타입 파라미터의 상한으로 추론하는 것을 금지합니다. 이는 현재 다른 컨텍스트에서와 동일한 방식입니다.
>
> **지원 중단 주기**:
>
> - 1.7.20: 사용 지점 타입 정보가 없는 경우 타입 파라미터가 선언된 상한으로 추론될 때 경고(또는 점진적 모드에서는 오류) 보고
> - 1.9.0: 경고를 오류로 격상,
>   `-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.

### 어노테이션 클래스 매개변수 선언 외부에 컬렉션 리터럴 사용 금지

> **이슈**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin은 어노테이션 클래스의 매개변수에 배열을 전달하거나 이 매개변수의 기본값을 지정하는 방식으로 제한적으로 컬렉션 리터럴 사용을 허용합니다. 그러나 그 외에도 Kotlin은 어노테이션 클래스 내부의 다른 모든 곳, 예를 들어 중첩 객체에서도 컬렉션 리터럴 사용을 허용했습니다. Kotlin 1.9는 어노테이션 클래스 매개변수의 기본값을 제외한 모든 곳에서 컬렉션 리터럴 사용을 금지합니다.
>
> **지원 중단 주기**:
>
> - 1.7.0: 어노테이션 클래스의 중첩 객체에 있는 배열 리터럴에 경고(또는 점진적 모드에서는 오류) 보고
> - 1.9.0: 경고를 오류로 격상

### 기본값이 있는 파라미터를 기본값 표현식에서 미리 참조하는 것 금지

> **이슈**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 다른 파라미터의 기본값 표현식에서 기본값이 있는 파라미터를 미리 참조하는 것을 금지합니다. 이는 파라미터가 기본값 표현식에서 접근될 때, 함수에 전달되었거나 자체 기본값 표현식에 의해 이미 초기화된 값을 갖도록 보장합니다.
>
> **지원 중단 주기**:
>
> - 1.7.0: 기본값이 있는 파라미터가 그보다 앞에 오는 다른 파라미터의 기본값에서 참조될 때 경고(또는 점진적 모드에서는 오류) 보고
> - 1.9.0: 경고를 오류로 격상,
>   `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.

### 인라인 함수형 파라미터에 대한 확장 호출 금지

> **이슈**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin은 인라인 함수형 파라미터를 다른 인라인 함수에 리시버로 전달하는 것을 허용했지만, 이러한 코드를 컴파일할 때 항상 컴파일러 예외가 발생했습니다. Kotlin 1.9는 이를 금지하여 컴파일러가 크래시되는 대신 오류를 보고합니다.
>
> **지원 중단 주기**:
>
> - 1.7.20: 인라인 함수형 파라미터에 대한 인라인 확장 호출에 경고(또는 점진적 모드에서는 오류) 보고
> - 1.9.0: 경고를 오류로 격상

### 익명 함수 인수를 가진 `suspend`라는 이름의 중위 함수 호출 금지

> **이슈**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.9부터는 `suspend`라는 이름의 중위 함수가 익명 함수 리터럴로 전달된 단일 함수형 타입 인수를 가질 때 더 이상 호출할 수 없습니다.
>
> **지원 중단 주기**:
>
> - 1.7.20: 익명 함수 리터럴을 사용하는 `suspend` 중위 호출에 경고 보고
> - 1.9.0: 경고를 오류로 격상,
>   `-XXLanguage:-ModifierNonBuiltinSuspendFunError`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.
> - &gt;=1.10: 파서가 `suspend fun` 토큰 시퀀스를 해석하는 방식 변경

### 내부 클래스에서 캡처된 타입 파라미터를 분산(variance) 규칙에 위배되게 사용하는 것 금지

> **이슈**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 `in` 또는 `out` 분산을 가진 외부 클래스의 타입 파라미터를 해당 클래스의 내부 클래스에서 해당 타입 파라미터의 선언된 분산 규칙을 위반하는 위치에서 사용하는 것을 금지합니다.
>
> **지원 중단 주기**:
>
> - 1.7.0: 외부 클래스의 타입 파라미터 사용 위치가 해당 파라미터의 분산 규칙을 위반할 때 경고(또는 점진적 모드에서는 오류) 보고
> - 1.9.0: 경고를 오류로 격상,
>   `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.

### 복합 할당 연산자에서 명시적 반환 타입 없는 함수의 재귀 호출 금지

> **이슈**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 명시적으로 지정된 반환 타입이 없는 함수를 해당 함수의 본문 내 복합 할당 연산자의 인자에서 재귀적으로 호출하는 것을 금지합니다. 이는 현재 해당 함수 본문 내 다른 표현식에서와 동일한 방식입니다.
>
> **지원 중단 주기**:
>
> - 1.7.0: 명시적으로 지정된 반환 타입이 없는 함수가 해당 함수의 본문 내 복합 할당 연산자 인자에서 재귀적으로 호출될 때 경고(또는 점진적 모드에서는 오류) 보고
> - 1.9.0: 경고를 오류로 격상

### `@NotNull T`가 예상되고 널 가능성이 있는 상한을 가진 Kotlin 제네릭 파라미터가 주어진 안전하지 않은 호출 금지

> **이슈**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **구성 요소**: Kotlin/JVM
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 잠재적으로 널을 허용하는 제네릭 타입의 값이 Java 메서드의 `@NotNull` 어노테이션이 붙은 파라미터에 전달되는 메서드 호출을 금지합니다.
>
> **지원 중단 주기**:
>
> - 1.5.20: 제약 없는 제네릭 타입 파라미터가 널을 허용하지 않는 타입이 예상되는 곳에 전달될 때 경고 보고
> - 1.9.0: 위 경고 대신 타입 불일치 오류 보고,
>   `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### 이 열거형의 항목 초기화자에서 열거형 클래스의 동반 객체 멤버에 대한 접근 금지

> **이슈**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **구성 요소**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 열거형 항목 초기화자에서 열거형의 동반 객체에 대한 모든 종류의 접근을 금지합니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: 이러한 동반 객체 멤버 접근에 경고(또는 점진적 모드에서는 오류) 보고
> - 1.9.0: 경고를 오류로 격상,
>   `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall`을 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### `Enum.declaringClass` 합성 프로퍼티 지원 중단 및 제거

> **이슈**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **구성 요소**: Kotlin/JVM
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin은 기본 Java 클래스 `java.lang.Enum`의 `getDeclaringClass()` 메서드에서 생성된 `Enum` 값에 `declaringClass` 합성 프로퍼티를 사용하는 것을 허용했습니다. 비록 이 메서드가 Kotlin `Enum` 타입에서는 사용할 수 없었음에도 말입니다. Kotlin 1.9는 이 프로퍼티 사용을 금지하고, 대신 `declaringJavaClass` 확장 프로퍼티로 마이그레이션할 것을 제안합니다.
>
> **지원 중단 주기**:
>
> - 1.7.0: `declaringClass` 프로퍼티 사용에 경고(또는 점진적 모드에서는 오류) 보고,
>   `declaringJavaClass` 확장으로 마이그레이션 제안
> - 1.9.0: 경고를 오류로 격상,
>   `-XXLanguage:-ProhibitEnumDeclaringClass`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.
> - &gt;=1.10: `declaringClass` 합성 프로퍼티 제거

### 컴파일러 옵션 `-Xjvm-default`의 `enable` 및 `compatibility` 모드 지원 중단

> **이슈**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **구성 요소**: Kotlin/JVM
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.6.20은 `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드 사용에 대해 경고합니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드에 경고 도입
> - &gt;= 1.9: 이 경고를 오류로 격상

## 표준 라이브러리

### Range/Progression이 Collection을 구현할 때 잠재적인 오버로드 해석 변경에 대한 경고

> **이슈**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **구성 요소**: 코어 언어 / kotlin-stdlib
>
> **호환성 변경 유형**: 소스
>
> **요약**: Kotlin 1.9에서는 표준 프로그레션 및 이들로부터 상속된 구체적인 범위에서 `Collection` 인터페이스를 구현할 예정입니다. 이는 어떤 메서드에 요소 하나를 받는 오버로드와 컬렉션을 받는 오버로드가 두 개 있는 경우 오버로드 해석에서 다른 오버로드가 선택될 수 있습니다. Kotlin은 이러한 상황을 범위 또는 프로그레션 인자와 함께 해당 오버로드된 메서드가 호출될 때 경고 또는 오류를 보고하여 가시화할 것입니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: 표준 프로그레션 또는 그 범위 상속자를 인수로 사용하여 오버로드된 메서드가 호출될 때 경고 보고
>   만약 이 프로그레션/범위에 `Collection` 인터페이스를 구현하면 향후 이 호출에서 다른 오버로드가 선택될 수 있습니다.
> - 1.8.0: 이 경고를 오류로 격상
> - 1.9.0: 오류 보고 중지, 프로그레션에 `Collection` 인터페이스 구현으로 인해 영향을 받는 경우 오버로드 해석 결과 변경

### `kotlin.dom` 및 `kotlin.browser` 패키지의 선언을 `kotlinx.*`로 마이그레이션

> **이슈**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **구성 요소**: kotlin-stdlib (JS)
>
> **호환성 변경 유형**: 소스
>
> **요약**: `kotlin.dom` 및 `kotlin.browser` 패키지의 선언은 `stdlib`에서 추출할 준비를 위해 해당 `kotlinx.*` 패키지로 이동됩니다.
>
> **지원 중단 주기**:
>
> - 1.4.0: `kotlinx.dom` 및 `kotlinx.browser` 패키지에 대체 API 도입
> - 1.4.0: `kotlin.dom` 및 `kotlin.browser` 패키지의 API 지원 중단 및 위 새 API를 대체로 제안
> - 1.6.0: 지원 중단 수준을 오류로 격상
> - 1.8.20: JS-IR 타겟용 `stdlib`에서 지원 중단된 함수 제거
> - &gt;= 1.9: `kotlinx.*` 패키지의 API를 별도 라이브러리로 이동

### 일부 JS 전용 API 지원 중단

> **이슈**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **구성 요소**: kotlin-stdlib (JS)
>
> **호환성 변경 유형**: 소스
>
> **요약**: `stdlib`의 여러 JS 전용 함수가 제거를 위해 지원 중단됩니다. 여기에는 `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)` 및 비교 함수를 받는 배열의 `sort` 함수(예: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`)가 포함됩니다.
>
> **지원 중단 주기**:
>
> - 1.6.0: 영향을 받는 함수에 경고와 함께 지원 중단
> - 1.9.0: 지원 중단 수준을 오류로 격상
> - &gt;=1.10.0: 공개 API에서 지원 중단된 함수 제거

## 도구

### `KotlinCompile` 태스크의 `classpath` 프로퍼티 지원 중단 수준 격상

> **이슈**: [KT-51679](https://youtrack.jetbrains.com/issue/KT-51679)
>
> **구성 요소**: Gradle
>
> **호환성 변경 유형**: 소스
>
> **요약**: `KotlinCompile` 태스크의 `classpath` 프로퍼티는 지원 중단됩니다.
>
> **지원 중단 주기**:
>
> - 1.7.0: `classpath` 프로퍼티 지원 중단
> - 1.8.0: 지원 중단 수준을 오류로 격상
> - &gt;=1.9.0: 공개 API에서 지원 중단된 함수 제거

### `kapt.use.worker.api` Gradle 프로퍼티 제거

> **이슈**: [KT-48827](https://youtrack.jetbrains.com/issue/KT-48827)
>
> **구성 요소**: Gradle
>
> **호환성 변경 유형**: 동작
>
> **요약**: Gradle Workers API를 통해 kapt를 실행할 수 있었던 `kapt.use.worker.api` 프로퍼티(기본값: true)를 제거합니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: 지원 중단 수준을 경고로 격상
> - 1.8.0: 이 프로퍼티 제거

### `kotlin.compiler.execution.strategy` 시스템 프로퍼티 제거

> **이슈**: [KT-51831](https://youtrack.jetbrains.com/issue/KT-51831)
>
> **구성 요소**: Gradle
>
> **호환성 변경 유형**: 동작
>
> **요약**: 컴파일러 실행 전략을 선택하는 데 사용되던 `kotlin.compiler.execution.strategy` 시스템 프로퍼티를 제거합니다.
> 대신 Gradle 프로퍼티 `kotlin.compiler.execution.strategy` 또는 컴파일 태스크 프로퍼티 `compilerExecutionStrategy`를 사용하십시오.
>
> **지원 중단 주기**:
>
> - 1.7.0: 지원 중단 수준을 경고로 격상
> - 1.8.0: 프로퍼티 제거

### 컴파일러 옵션 변경 사항

> **이슈**: [KT-27301](https://youtrack.jetbrains.com/issue/KT-27301), [KT-48532](https://youtrack.jetbrains.com/issue/KT-48532)
>
> **구성 요소**: Gradle
>
> **호환성 변경 유형**: 소스, 바이너리
>
> **요약**: 이 변경 사항은 Gradle 플러그인 작성자에게 영향을 미칠 수 있습니다. `kotlin-gradle-plugin`에는 일부 내부 타입에 추가 제네릭 파라미터가 있습니다(제네릭 타입 또는 `*`를 추가해야 합니다). `KotlinNativeLink` 태스크는 더 이상 `AbstractKotlinNativeCompile` 태스크를 상속하지 않습니다. `KotlinJsCompilerOptions.outputFile` 및 관련 `KotlinJsOptions.outputFile` 옵션은 지원 중단됩니다. 대신 `Kotlin2JsCompile.outputFileProperty` 태스크 입력을 사용하십시오. `kotlinOptions` 태스크 입력 및 `kotlinOptions{...}` 태스크 DSL은 지원 모드이며 향후 릴리스에서 지원 중단될 예정입니다. `compilerOptions` 및 `kotlinOptions`는 태스크 실행 단계에서 변경할 수 없습니다(Kotlin 1.8의 새로운 기능 문서 [What's new in Kotlin 1.8](whatsnew18.md#limitations)에서 한 가지 예외 참조). `freeCompilerArgs`는 변경 불가능한 `List<String>`을 반환합니다. – `kotlinOptions.freeCompilerArgs.remove("something")`은 실패합니다. 이전 JVM 백엔드를 사용할 수 있게 했던 `useOldBackend` 프로퍼티는 제거됩니다.
>
> **지원 중단 주기**:
>
> - 1.8.0: `KotlinNativeLink` 태스크는 `AbstractKotlinNativeCompile`을 상속하지 않습니다. `KotlinJsCompilerOptions.outputFile` 및 관련 `KotlinJsOptions.outputFile` 옵션은 지원 중단됩니다. 이전 JVM 백엔드를 사용할 수 있게 했던 `useOldBackend` 프로퍼티는 제거됩니다.

### `kotlin.internal.single.build.metrics.file` 프로퍼티 지원 중단

> **이슈**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **구성 요소**: Gradle
>
> **호환성 변경 유형**: 소스
>
> **요약**: 빌드 보고서를 위한 단일 파일을 정의하는 데 사용되던 `kotlin.internal.single.build.metrics.file` 프로퍼티를 지원 중단합니다.
> 대신 `kotlin.build.report.output=single_file`과 함께 `kotlin.build.report.single_file` 프로퍼티를 사용하십시오.
>
> **지원 중단 주기**:
>
> - 1.8.0: 지원 중단 수준을 경고로 격상
> &gt;= 1.9: 프로퍼티 삭제