[//]: # (title: Kotlin 1.8 호환성 가이드)

_[언어 현대성 유지](kotlin-evolution-principles.md)_와 _[편안한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 근본 원칙 중 일부입니다.
전자는 언어 발전을 저해하는 구성 요소는 제거되어야 한다고 명시하며,
후자는 코드 마이그레이션을 가능한 한 원활하게 하기 위해 이러한 제거는 사전에 충분히 공지되어야 한다고 명시합니다.

대부분의 언어 변경사항은 업데이트 변경 로그나 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만,
이 문서는 Kotlin 1.7에서 Kotlin 1.8로의 마이그레이션을 위한 완전한 참조 자료를 제공하며 모든 변경사항을 요약합니다.

## 기본 용어

이 문서에서는 몇 가지 호환성 유형을 소개합니다:

- _source_: 소스 비호환 변경은 (오류나 경고 없이) 정상적으로 컴파일되던 코드가 더 이상 컴파일되지 않도록 합니다.
- _binary_: 두 바이너리 아티팩트는 서로 교환해도 로딩 또는 링케지 오류가 발생하지 않는 경우 바이너리 호환이라고 합니다.
- _behavioral_: 변경 사항을 적용하기 전과 후에 동일한 프로그램이 다른 동작을 보이는 경우 동작 비호환이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 주어진다는 점을 기억하십시오.
다른 언어 관점(예: Java)에서 본 Kotlin 코드의 호환성은 이 문서의 범위를 벗어납니다.

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

### 추상 슈퍼클래스 멤버에 대한 super 호출 위임 금지

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin은 명시적 또는 암시적 `super` 호출이 슈퍼클래스의 _추상_ 멤버로 위임될 때, 심지어 슈퍼 인터페이스에 기본 구현이 있더라도 컴파일 오류를 보고할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.5.20: 모든 추상 멤버를 오버라이드하지 않는 비추상 클래스가 사용될 때 경고를 보고
> - 1.7.0: `super` 호출이 실제로 슈퍼클래스의 추상 멤버에 접근하는 경우 경고를 보고
> - 1.7.0: `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 호환성 모드가 활성화된 경우 모든 해당 사례에서 오류를 보고; 프로그레시브 모드에서 오류를 보고
> - 1.8.0: 슈퍼클래스의 오버라이드되지 않은 추상 메서드를 가진 구상 클래스를 선언하는 경우, 그리고 `Any` 메서드의 `super` 호출이 슈퍼클래스에서 추상으로 오버라이드된 경우 오류를 보고
> - 1.9.0: 슈퍼 클래스의 추상 메서드에 대한 명시적 `super` 호출을 포함하여 모든 해당 사례에서 오류를 보고

### `when` 문의 혼란스러운 문법 사용 중단

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.6은 `when` 조건 표현식에서 몇 가지 혼란스러운 문법 구문을 사용 중단했습니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 해당 표현식에 사용 중단 경고 도입
> - 1.8.0: 이 경고를 오류로 상향 조정,
>   `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있음
> - >= 1.9: 일부 사용 중단된 구문을 새 언어 기능에 재활용

### 다른 숫자 타입 간의 암시적 강제 변환 방지

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 동작
>
> **Short summary**: Kotlin은 의미론적으로 해당 타입으로의 다운캐스트만 필요한 경우, 숫자 값을 기본 숫자 타입으로 자동으로 변환하는 것을 피할 것입니다.
>
> **Deprecation cycle**:
>
> - < 1.5.30: 모든 해당 사례에서 이전 동작
> - 1.5.30: 생성된 프로퍼티 델리게이트 접근자에서 다운캐스트 동작 수정,
>   `-Xuse-old-backend`를 사용하여 일시적으로 1.5.30 수정 이전 동작으로 되돌릴 수 있음
> - >= 1.9: 다른 해당 사례에서 다운캐스트 동작 수정

### sealed 클래스의 private 생성자를 실제로 private으로 만들기

> **Issue**: [KT-44866](https://youtrack.jetbrains.com/issue/KT-44866)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: sealed 클래스의 상속자가 프로젝트 구조 내에서 선언될 수 있는 위치에 대한 제약이 완화된 후,
> sealed 클래스 생성자의 기본 가시성은 `protected`가 되었습니다. 그러나 1.8 이전까지 Kotlin은
> 해당 클래스의 스코프 외부에서 명시적으로 선언된 sealed 클래스 private 생성자를 호출하는 것을 여전히 허용했습니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: sealed 클래스의 private 생성자가 해당 클래스 외부에서 호출될 때 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 1.8.0: private 생성자에 대한 기본 가시성 규칙 사용 (private 생성자에 대한 호출은 해당 클래스 내에서만 해결될 수 있음),
>   `-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses` 컴파일러 인수를 지정하여 이전 동작을 일시적으로 되돌릴 수 있음

### 빌더 추론 컨텍스트에서 호환되지 않는 숫자 타입에 `==` 연산자 사용 금지

> **Issue**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.8부터는 빌더 추론 람다 함수 스코프 내에서 `Int`와 `Long` 같이 호환되지 않는 숫자 타입에 `==` 연산자를 사용하는 것이 금지됩니다. 이는 현재 다른 컨텍스트에서와 동일한 방식입니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 호환되지 않는 숫자 타입에 `==` 연산자가 사용될 때 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 1.8.0: 경고를 오류로 상향 조정,
>   `-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있음

### Elvis 연산자 우측에 `else` 없는 `if` 및 불완전한 `when` 금지

> **Issue**: [KT-44705](https://youtrack.jetbrains.com/issue/KT-44705)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.8부터는 Elvis 연산자(`?:`)의 우측에 불완전한 `when` 또는 `else` 브랜치 없는 `if` 표현식을 사용하는 것이 금지됩니다. 이전에는 Elvis 연산자의 결과가 표현식으로 사용되지 않는 경우 허용되었습니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 해당 불완전한 `if` 및 `when` 표현식에 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 1.8.0: 이 경고를 오류로 상향 조정,
>   `-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있음

### 제네릭 타입 별칭 사용 시 상한 위반 금지 (별칭 타입의 여러 타입 인수에 하나의 타입 파라미터가 사용되는 경우)

> **Issues**: [KT-29168](https://youtrack.jetbrains.com/issue/KT-29168)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.8부터는 타입 별칭 타입 파라미터가 별칭 타입의 여러 타입 인수에 사용되는 경우 (예: `typealias Alias<T> = Base<T, T>`), 해당 별칭 타입의 타입 파라미터에 대한 상한 제약을 위반하는 타입 인수를 가진 타입 별칭 사용을 금지합니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: 별칭 타입의 해당 타입 파라미터의 상한 제약을 위반하는 타입 인수를 가진 타입 별칭 사용에 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 1.8.0: 이 경고를 오류로 상향 조정,
>  `-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있음

### 제네릭 타입 별칭 사용 시 상한 위반 금지 (별칭 타입의 타입 인수의 제네릭 타입 인수에 타입 파라미터가 사용되는 경우)

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin은 타입 별칭 타입 파라미터가 별칭 타입의 타입 인수의 제네릭 타입 인수로 사용되는 경우 (예: `typealias Alias<T> = Base<List<T>>`), 해당 별칭 타입의 타입 파라미터에 대한 상한 제약을 위반하는 타입 인수를 가진 타입 별칭 사용을 금지할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.8.0: 제네릭 타입 별칭 사용이 별칭 타입의 해당 타입 파라미터의 상한 제약을 위반하는 타입 인수를 가질 때 경고 보고
> - >=1.10: 경고를 오류로 상향 조정

### 델리게이트 내에서 확장 프로퍼티에 선언된 타입 파라미터 사용 금지

> **Issue**: [KT-24643](https://youtrack.jetbrains.com/issue/KT-24643)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.8부터는 제네릭 타입의 확장 프로퍼티를 리시버의 타입 파라미터를 안전하지 않은 방식으로 사용하는 제네릭 타입에 위임하는 것을 금지할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 특정 방식으로 위임된 프로퍼티의 타입 인수에서 추론된 타입 파라미터를 사용하는 타입에 확장 프로퍼티를 위임할 때 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 1.8.0: 경고를 오류로 상향 조정,
>  `-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있음

### suspend 함수에 `@Synchronized` 애노테이션 금지

> **Issue**: [KT-48516](https://youtrack.jetbrains.com/issue/KT-48516)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.8부터는 `synchronized` 블록 내에서 suspend 호출이 허용되어서는 안 되므로, suspend 함수에 `@Synchronized` 애노테이션을 붙이는 것을 금지할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: `@Synchronized` 애노테이션이 붙은 suspend 함수에 경고를 보고,
>    이 경고는 프로그레시브 모드에서 오류로 보고됨
> - 1.8.0: 경고를 오류로 상향 조정,
>    `-XXLanguage:-SynchronizedSuspendError`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있음

### non-vararg 파라미터에 인수를 전달할 때 spread 연산자 사용 금지

> **Issue**: [KT-48162](https://youtrack.jetbrains.com/issue/KT-48162)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin은 특정 조건에서 spread 연산자(`*`)를 사용하여 배열을 non-vararg 배열 파라미터에 전달하는 것을 허용했습니다. Kotlin 1.8부터는 이것이 금지됩니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: non-vararg 배열 파라미터가 예상되는 곳에 spread 연산자를 사용할 때 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 1.8.0: 경고를 오류로 상향 조정,
>   `-XXLanguage:-ReportNonVarargSpreadOnGenericCalls`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있음

### 람다 반환 타입으로 오버로드된 함수에 전달된 람다에서 null 안전 위반 금지

> **Issue**: [KT-49658](https://youtrack.jetbrains.com/issue/KT-49658)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.8부터는 람다의 반환 타입으로 오버로드된 함수에 전달된 람다에서 `null`을 반환하는 것을 금지합니다.
> 이는 오버로드가 nullable 반환 타입을 허용하지 않는 경우에 해당합니다.
> 이전에는 `null`이 `when` 연산자의 브랜치 중 하나에서 반환될 때 허용되었습니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 타입 불일치 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 1.8.0: 경고를 오류로 상향 조정,
>   `-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있음

### public 시그니처에서 지역 타입을 근사화할 때 null 허용 여부 유지

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스, 바이너리
>
> **Short summary**: 명시적으로 지정된 반환 타입 없이 표현식 본문 함수에서 지역 또는 익명 타입이 반환될 때,
> Kotlin 컴파일러는 해당 타입의 알려진 슈퍼타입을 사용하여 반환 타입을 추론(또는 근사화)합니다.
> 이 과정에서 컴파일러는 실제로는 `null` 값이 반환될 수 있는 경우에도 non-nullable 타입을 추론할 수 있습니다.
>
> **Deprecation cycle**:
>
> - 1.8.0: 유연한 타입을 유연한 슈퍼타입으로 근사화
> - 1.8.0: 선언이 nullable이어야 하는 non-nullable 타입으로 추론될 때 경고를 보고하여 사용자에게 타입을 명시적으로 지정하도록 유도
> - 1.9.0: nullable 타입을 nullable 슈퍼타입으로 근사화,
>   `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType`을 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있음

### 오버라이드를 통해 사용 중단 전파 안 함

> **Issue**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.9부터는 슈퍼클래스의 사용 중단된 멤버에서 서브클래스의 오버라이드하는 멤버로 사용 중단 전파를 하지 않을 것입니다.
> 이는 슈퍼클래스의 멤버를 사용 중단하면서 서브클래스에서는 사용 중단되지 않은 상태로 두는 명시적인 메커니즘을 제공합니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 향후 동작 변경에 대한 메시지와 함께 경고를 보고하며, 이 경고를 억제하거나 사용 중단된 멤버의 오버라이드에 `@Deprecated` 애노테이션을 명시적으로 작성하도록 유도
> - 1.9.0: 오버라이드된 멤버로 사용 중단 상태 전파를 중단합니다. 이 변경은 프로그레시브 모드에서도 즉시 적용됩니다.

### 빌더 추론 컨텍스트에서 사용처 타입 정보가 없는 경우 타입 변수가 상한으로 암시적으로 추론되는 것을 금지

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.9부터는 빌더 추론 람다 함수 스코프 내에서 사용처 타입 정보가 없는 경우 타입 변수가 해당 타입 파라미터의 상한으로 추론되는 것을 금지할 것입니다. 이는 현재 다른 컨텍스트에서와 동일한 방식입니다.
>
> **Deprecation cycle**:
>
> - 1.7.20: 사용처 타입 정보가 없는 경우 타입 파라미터가 선언된 상한으로 추론될 때 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 1.9.0: 경고를 오류로 상향 조정,
>   `-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있음

### 애노테이션 클래스에서 파라미터 선언 외의 컬렉션 리터럴 사용 금지

> **Issue**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin은 제한된 방식으로 컬렉션 리터럴 사용을 허용합니다 – 애노테이션 클래스의 파라미터에 배열을 전달하거나 이러한 파라미터에 기본값을 지정하는 경우입니다.
> 그러나 그 외에도 Kotlin은 애노테이션 클래스 내부의 다른 곳, 예를 들어 중첩 객체 내부에서 컬렉션 리터럴을 사용하는 것을 허용했습니다. Kotlin 1.9부터는 애노테이션 클래스에서 파라미터의 기본값 선언 외의 다른 곳에서 컬렉션 리터럴을 사용하는 것을 금지할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: 애노테이션 클래스의 중첩 객체에 있는 배열 리터럴에 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 1.9.0: 경고를 오류로 상향 조정

### 기본값 표현식에서 기본값을 가진 파라미터의 전방 참조 금지

> **Issue**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.9부터는 다른 파라미터의 기본값 표현식에서 기본값을 가진 파라미터의 전방 참조를 금지할 것입니다. 이는 파라미터가 기본값 표현식에서 접근될 때쯤에는 이미 함수에 전달되었거나 자체 기본값 표현식으로 초기화된 값을 가지도록 보장합니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: 기본값을 가진 파라미터가 그보다 먼저 나오는 다른 파라미터의 기본값에서 참조될 때 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 1.9.0: 경고를 오류로 상향 조정,
>   `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있음

### inline 함수형 파라미터에 대한 확장 호출 금지

> **Issue**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin은 inline 함수형 파라미터를 다른 inline 함수의 리시버로 전달하는 것을 허용했지만, 이러한 코드를 컴파일할 때 항상 컴파일러 예외를 발생시켰습니다.
> Kotlin 1.9부터는 이를 금지하여 컴파일러 크래시 대신 오류를 보고할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.7.20: inline 함수형 파라미터에 대한 inline 확장 호출에 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 1.9.0: 경고를 오류로 상향 조정

### 익명 함수 인수를 사용하는 `suspend`라는 이름의 infix 함수 호출 금지

> **Issue**: [KT-49264](https://youtrack.com/issue/KT-49264)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.9부터는 단일 함수형 타입 인수를 익명 함수 리터럴로 받는 `suspend`라는 이름의 infix 함수를 호출하는 것을 더 이상 허용하지 않을 것입니다.
>
> **Deprecation cycle**:
>
> - 1.7.20: 익명 함수 리터럴을 가진 `suspend` infix 호출에 경고 보고
> - 1.9.0: 경고를 오류로 상향 조정,
>   `-XXLanguage:-ModifierNonBuiltinSuspendFunError`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있음
> - >=1.10: `suspend fun` 토큰 시퀀스가 파서에 의해 해석되는 방식 변경

### 이너 클래스에서 외부 클래스의 캡처된 타입 파라미터를 그들의 분산에 반하여 사용하는 것 금지

> **Issue**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.9부터는 외부 클래스의 `in` 또는 `out` 분산을 가진 타입 파라미터를 해당 클래스의 이너 클래스에서 타입 파라미터의 선언된 분산을 위반하는 위치에 사용하는 것을 금지할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: 외부 클래스의 타입 파라미터 사용 위치가 해당 파라미터의 분산 규칙을 위반할 때 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 1.9.0: 경고를 오류로 상향 조정,
>   `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있음

### 복합 할당 연산자에서 명시적 반환 타입 없는 함수의 재귀 호출 금지

> **Issue**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.9부터는 명시적으로 지정된 반환 타입 없는 함수를 해당 함수 본문 내의 복합 할당 연산자 인수에서 재귀적으로 호출하는 것을 금지할 것입니다. 이는 현재 해당 함수 본문 내의 다른 표현식에서와 동일한 방식입니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: 명시적으로 지정된 반환 타입 없는 함수가 복합 할당 연산자 인수에서 해당 함수 본문 내에서 재귀적으로 호출될 때 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 1.9.0: 경고를 오류로 상향 조정

### `@NotNull T`가 예상되고 nullable 바운드를 가진 Kotlin 제네릭 파라미터가 주어진 경우 안전하지 않은 호출 금지

> **Issue**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.9부터는 `@NotNull` 애노테이션이 붙은 Java 메서드의 파라미터에 잠재적으로 nullable 제네릭 타입의 값이 전달되는 메서드 호출을 금지할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.5.20: non-nullable 타입이 예상되는 곳에 제약 없는 제네릭 타입 파라미터가 전달될 때 경고 보고
> - 1.9.0: 위 경고 대신 타입 불일치 오류 보고,
>   `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있음

### enum 클래스의 컴패니언 멤버에 enum 엔트리 초기화에서 접근하는 것 금지

> **Issue**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.9부터는 enum 엔트리 초기화에서 enum의 컴패니언 객체에 대한 모든 종류의 접근을 금지할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 해당 컴패니언 멤버 접근에 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 1.9.0: 경고를 오류로 상향 조정,
>   `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있음

### Enum.declaringClass 합성 프로퍼티 사용 중단 및 제거

> **Issue**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin은 `Enum` 값에 대해 `declaringClass` 합성 프로퍼티를 사용하는 것을 허용했습니다. 이는 기본 Java 클래스 `java.lang.Enum`의 `getDeclaringClass()` 메서드로부터 생성된 것이지만, 이 메서드는 Kotlin `Enum` 타입에서는 사용할 수 없습니다. Kotlin 1.9부터는 이 프로퍼티 사용을 금지하고, 대신 확장 프로퍼티 `declaringJavaClass`로 마이그레이션할 것을 제안합니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: `declaringClass` 프로퍼티 사용에 경고(또는 프로그레시브 모드에서는 오류) 보고,
>   `declaringJavaClass` 확장으로의 마이그레이션 제안
> - 1.9.0: 경고를 오류로 상향 조정,
>   `-XXLanguage:-ProhibitEnumDeclaringClass`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있음
> - >=1.10: `declaringClass` 합성 프로퍼티 제거

### 컴파일러 옵션 `-Xjvm-default`의 `enable` 및 `compatibility` 모드 사용 중단

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.6.20은 컴파일러 옵션 `-Xjvm-default`의 `enable` 및 `compatibility` 모드 사용에 대해 경고합니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드에 경고 도입
> - >= 1.9: 이 경고를 오류로 상향 조정

## 표준 라이브러리

### Range/Progression이 Collection을 구현하기 시작할 때 잠재적 오버로드 해결 변경에 대한 경고

> **Issue**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **Component**: 코어 언어 / kotlin-stdlib
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.9에서는 표준 progression과 그로부터 상속된 구체적인 range에서 `Collection` 인터페이스를 구현할 계획입니다.
> 이는 어떤 메서드에 두 가지 오버로드(하나는 요소를 받고 다른 하나는 컬렉션을 받는)가 있는 경우, 오버로드 해결에서 다른 오버로드가 선택될 수 있도록 할 수 있습니다.
> Kotlin은 이러한 오버로드된 메서드가 range 또는 progression 인수로 호출될 때 경고 또는 오류를 보고하여 이러한 상황을 가시화할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 오버로드된 메서드가 표준 progression 또는 그 range 상속자를 인수로 호출될 때 경고 보고
>   (만약 이 progression/range에 `Collection` 인터페이스를 구현하면 향후 이 호출에서 다른 오버로드가 선택될 경우)
> - 1.8.0: 이 경고를 오류로 상향 조정
> - 1.9.0: 오류 보고 중단, progression에 `Collection` 인터페이스 구현하여 해당 사례에서 오버로드 해결 결과 변경

### `kotlin.dom` 및 `kotlin.browser` 패키지의 선언을 `kotlinx.*`로 마이그레이션

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 소스
>
> **Short summary**: `kotlin.dom` 및 `kotlin.browser` 패키지의 선언이 stdlib에서 추출하기 위한 준비로 해당 `kotlinx.*` 패키지로 이동되었습니다.
>
> **Deprecation cycle**:
>
> - 1.4.0: `kotlinx.dom` 및 `kotlinx.browser` 패키지에 대체 API 도입
> - 1.4.0: `kotlin.dom` 및 `kotlin.browser` 패키지의 API 사용 중단 및 새 API를 대체제로 제안
> - 1.6.0: 사용 중단 수준을 오류로 상향 조정
> - 1.8.20: JS-IR 타겟용 stdlib에서 사용 중단된 함수 제거
> - >= 1.9: `kotlinx.*` 패키지의 API를 별도의 라이브러리로 이동

### 일부 JS 전용 API 사용 중단

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 소스
>
> **Short summary**: stdlib의 여러 JS 전용 함수가 제거를 위해 사용 중단되었습니다. 여기에는 `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)` 및 비교 함수를 인수로 받는 배열의 `sort` 함수(예: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`)가 포함됩니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 해당 함수를 경고와 함께 사용 중단
> - 1.9.0: 사용 중단 수준을 오류로 상향 조정
> - >=1.10.0: 공개 API에서 사용 중단된 함수 제거

## 도구

### `KotlinCompile` 태스크의 `classpath` 프로퍼티 사용 중단 수준 상향

> **Issue**: [KT-51679](https://youtrack.jetbrains.com/issue/KT-51679)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: `KotlinCompile` 태스크의 `classpath` 프로퍼티는 사용 중단되었습니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: `classpath` 프로퍼티 사용 중단
> - 1.8.0: 사용 중단 수준을 오류로 상향 조정
> - >=1.9.0: 공개 API에서 사용 중단된 함수 제거

### `kapt.use.worker.api` Gradle 프로퍼티 제거

> **Issue**: [KT-48827](https://youtrack.jetbrains.com/issue/KT-48827)
>
> **Component**: Gradle
>
> **Incompatible change type**: 동작
>
> **Short summary**: Gradle Workers API를 통해 kapt를 실행할 수 있도록 허용했던 `kapt.use.worker.api` 프로퍼티(기본값: true)를 제거합니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 사용 중단 수준을 경고로 상향 조정
> - 1.8.0: 이 프로퍼티 제거

### `kotlin.compiler.execution.strategy` 시스템 프로퍼티 제거

> **Issue**: [KT-51831](https://youtrack.jetbrains.com/issue/KT-51831)
>
> **Component**: Gradle
>
> **Incompatible change type**: 동작
>
> **Short summary**: 컴파일러 실행 전략을 선택하는 데 사용되던 `kotlin.compiler.execution.strategy` 시스템 프로퍼티를 제거합니다.
> 대신 Gradle 프로퍼티 `kotlin.compiler.execution.strategy` 또는 컴파일 태스크 프로퍼티 `compilerExecutionStrategy`를 사용하십시오.
>
> **Deprecation cycle:**
>
> - 1.7.0: 사용 중단 수준을 경고로 상향 조정
> - 1.8.0: 프로퍼티 제거

### 컴파일러 옵션 변경사항

> **Issues**: [KT-27301](https://youtrack.jetbrains.com/issue/KT-27301), [KT-48532](https://youtrack.jetbrains.com/issue/KT-48532)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스, 바이너리
>
> **Short summary**: 이 변경은 Gradle 플러그인 작성자에게 영향을 줄 수 있습니다. `kotlin-gradle-plugin`에는 일부 내부 타입에 추가 제네릭 파라미터가 있습니다 (제네릭 타입 또는 `*`를 추가해야 합니다).
> `KotlinNativeLink` 태스크는 더 이상 `AbstractKotlinNativeCompile` 태스크를 상속하지 않습니다.
> `KotlinJsCompilerOptions.outputFile` 및 관련 `KotlinJsOptions.outputFile` 옵션은 사용 중단되었습니다.
> 대신 `Kotlin2JsCompile.outputFileProperty` 태스크 입력을 사용하십시오. `kotlinOptions` 태스크 입력과 `kotlinOptions{...}`
> 태스크 DSL은 지원 모드이며 향후 릴리스에서 사용 중단될 예정입니다. `compilerOptions` 및 `kotlinOptions`는 태스크 실행 단계에서 변경될 수 없습니다 (Kotlin 1.8의 새로운 기능에서 한 가지 예외 참조).
> `freeCompilerArgs`는 변경 불가능한 `List<String>`을 반환합니다 – `kotlinOptions.freeCompilerArgs.remove("something")`은 실패할 것입니다.
> 이전 JVM 백엔드를 사용할 수 있도록 허용했던 `useOldBackend` 프로퍼티가 제거되었습니다.
>
> **Deprecation cycle:**
>
> - 1.8.0: `KotlinNativeLink` 태스크는 `AbstractKotlinNativeCompile`을 상속하지 않습니다. `KotlinJsCompilerOptions.outputFile`
> 및 관련 `KotlinJsOptions.outputFile` 옵션은 사용 중단되었습니다. 이전 JVM 백엔드를 사용할 수 있도록 허용했던
> `useOldBackend` 프로퍼티가 제거되었습니다.

### `kotlin.internal.single.build.metrics.file` 프로퍼티 사용 중단

> **Issue**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: 빌드 보고서용 단일 파일을 정의하는 데 사용되던 `kotlin.internal.single.build.metrics.file` 프로퍼티를 사용 중단합니다.
> 대신 `kotlin.build.report.output=single_file`과 함께 `kotlin.build.report.single_file` 프로퍼티를 사용하십시오.
>
> **Deprecation cycle:**
>
> - 1.8.0: 사용 중단 수준을 경고로 상향 조정
> >= 1.9: 프로퍼티 삭제