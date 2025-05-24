---
title: "Kotlin 1.8 호환성 가이드"
---
_[언어의 현대성 유지](kotlin-evolution-principles)_ 및 _[편리한 업데이트](kotlin-evolution-principles)_는 Kotlin 언어 디자인의 기본 원칙입니다. 전자는 언어 발전을 저해하는 구조는 제거해야 한다고 말하며, 후자는 코드 마이그레이션을 최대한 원활하게 하기 위해 이러한 제거 사항을 사전에 충분히 알려야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서에서는 이 모든 사항을 요약하여 Kotlin 1.7에서 Kotlin 1.8로의 마이그레이션을 위한 완전한 참조를 제공합니다.

## 기본 용어

이 문서에서는 다음과 같은 여러 종류의 호환성을 소개합니다.

- _source_: source-incompatible 변경 사항은 이전에는 (오류나 경고 없이) 정상적으로 컴파일되었던 코드가 더 이상 컴파일되지 않도록 합니다.
- _binary_: 두 개의 바이너리 아티팩트가 서로 교환되어도 로딩 또는 링키지 오류가 발생하지 않으면 바이너리 호환성이 있다고 합니다.
- _behavioral_: 변경 사항을 적용하기 전후에 동일한 프로그램이 다른 동작을 보이면 behavioral-incompatible 변경 사항이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 제공된다는 점을 기억하십시오. 다른 언어 관점에서의 Kotlin 코드 호환성
(예: Java)은 이 문서의 범위를 벗어납니다.

## 언어

<!--
### 제목

> **이슈**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**:
>
> **폐기 주기**:
>
> - 1.6.20: 경고 보고
> - 1.8.0: 경고를 오류로 격상
-->

### 추상 슈퍼클래스 멤버에 대한 슈퍼 호출의 위임을 금지합니다.

> **이슈**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
> 
> **간단한 요약**: Kotlin은 명시적 또는 암시적 슈퍼 호출이 슈퍼클래스의 _abstract_ 멤버에 위임될 때 컴파일 오류를 보고합니다.
> 슈퍼 인터페이스에 기본 구현이 있는 경우에도 마찬가지입니다.
>
> **폐기 주기**:
>
> - 1.5.20: 모든 추상 멤버를 오버라이드하지 않는 비추상 클래스가 사용될 때 경고를 표시합니다.
> - 1.7.0: 슈퍼 호출이 실제로 슈퍼클래스의 추상 멤버에 접근하는 경우 경고를 보고합니다.
> - 1.7.0: `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 호환성 모드를 활성화한 경우 영향을 받는 모든 케이스에서 오류를 보고합니다.
>   progressive 모드에서 오류를 보고합니다.
> - 1.8.0: 슈퍼클래스의 재정의되지 않은 추상 메서드를 가진 concrete 클래스를 선언하는 경우 오류를 보고하고
>   `Any` 메서드의 슈퍼 호출이 슈퍼클래스에서 추상으로 오버라이드됩니다.
> - 1.9.0: 슈퍼 클래스의 추상 메서드에 대한 명시적 슈퍼 호출을 포함하여 영향을 받는 모든 케이스에서 오류를 보고합니다.

### when-with-subject에서 혼란스러운 문법을 더 이상 사용하지 않습니다.

> **이슈**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.6은 `when` 조건식에서 몇 가지 혼란스러운 문법 구조를 더 이상 사용하지 않습니다.
>
> **폐기 주기**:
>
> - 1.6.20: 영향을 받는 식에 대한 폐기 경고를 도입합니다.
> - 1.8.0: 이 경고를 오류로 격상합니다.
>   `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.
> - &gt;= 1.9: 더 이상 사용되지 않는 일부 구조를 새로운 언어 기능에 재사용합니다.

### 다른 숫자 타입 간의 암시적 강제 변환을 방지합니다.

> **이슈**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환성 없는 변경 유형**: behavioral
>
> **간단한 요약**: Kotlin은 숫자 값을 해당 타입으로의 다운캐스트만 필요한 원시 숫자 타입으로 자동 변환하지 않습니다.
>
> **폐기 주기**:
>
> - < 1.5.30: 영향을 받는 모든 케이스에서 이전 동작을 유지합니다.
> - 1.5.30: 생성된 속성 대리자 접근자에서 다운캐스트 동작을 수정합니다.
>   `-Xuse-old-backend`를 사용하여 일시적으로 1.5.30 이전의 수정 동작으로 되돌릴 수 있습니다.
> - &gt;= 1.9: 다른 영향을 받는 케이스에서 다운캐스트 동작을 수정합니다.

### sealed 클래스의 private 생성자를 실제로 private하게 만듭니다.

> **이슈**: [KT-44866](https://youtrack.jetbrains.com/issue/KT-44866)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: sealed 클래스의 상속자를 프로젝트 구조 내에서 선언할 수 있는 위치에 대한 제한을 완화한 후,
> sealed 클래스 생성자의 기본 가시성은 protected가 되었습니다. 그러나 1.8까지 Kotlin은 여전히 sealed 클래스의 명시적으로 선언된 private 생성자를 해당 클래스의 범위 밖에서 호출할 수 있도록 허용했습니다.
>
> **폐기 주기**:
>
> - 1.6.20: sealed 클래스의 private 생성자가 해당 클래스 외부에서 호출될 때 경고(또는 progressive 모드에서 오류)를 보고합니다.
> - 1.8.0: private 생성자에 대한 기본 가시성 규칙을 사용합니다(private 생성자에 대한 호출은 해당 클래스 내부에 있는 경우에만 해결될 수 있음).
>   `-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses` 컴파일러 인수를 지정하여 이전 동작을 일시적으로 복원할 수 있습니다.

### 빌더 추론 컨텍스트에서 호환되지 않는 숫자 타입에 대한 연산자 == 사용을 금지합니다.

> **이슈**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.8은 현재 다른 컨텍스트에서 수행하는 방식과 동일하게 빌더 추론 람다 함수의 범위에서 `Int` 및 `Long`과 같은 호환되지 않는 숫자 타입에 대해 연산자 `==`를 사용하는 것을 금지합니다.
>
> **폐기 주기**:
>
> - 1.6.20: 호환되지 않는 숫자 타입에 대해 연산자 `==`가 사용될 때 경고(또는 progressive 모드에서 오류)를 보고합니다.
> - 1.8.0: 경고를 오류로 격상합니다.
>   `-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### elvis 연산자의 오른쪽에서 else 없는 if 및 완전하지 않은 when을 금지합니다.

> **이슈**: [KT-44705](https://youtrack.jetbrains.com/issue/KT-44705)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.8은 완전하지 않은 `when` 또는 `else` 분기 없는 `if` 식을 Elvis 연산자(`?:`)의 오른쪽에서 사용하는 것을 금지합니다. 이전에는 Elvis 연산자의 결과가 식으로 사용되지 않은 경우 허용되었습니다.
>
> **폐기 주기**:
>
> - 1.6.20: 이러한 완전하지 않은 if 및 when 식에 대한 경고(또는 progressive 모드에서 오류)를 보고합니다.
> - 1.8.0: 이 경고를 오류로 격상합니다.
>   `-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### 제네릭 타입 별칭 사용 시 상한 위반을 금지합니다(별칭 타입의 여러 타입 인수에 사용되는 하나의 타입 매개변수).

> **이슈**: [KT-29168](https://youtrack.jetbrains.com/issue/KT-29168)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.8은 상한 제한을 위반하는 타입 인수가 있는 타입 별칭을 사용하는 것을 금지합니다.
> 하나의 타입 별칭 타입 매개변수가 별칭 타입의 여러 타입 인수에 사용되는 경우(예: `typealias Alias<T> = Base<T, T>`) 별칭 타입의 해당 타입 매개변수의 제한을 위반하는 경우를 금지합니다.
>
> **폐기 주기**:
>
> - 1.7.0: 별칭 타입의 해당 타입 매개변수의 상한 제약 조건을 위반하는 타입 인수가 있는 타입 별칭 사용에 대한 경고(또는 progressive 모드에서 오류)를 보고합니다.
> - 1.8.0: 이 경고를 오류로 격상합니다.
>  `-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### 제네릭 타입 별칭 사용 시 상한 위반을 금지합니다(타입 매개변수가 별칭 타입의 타입 인수의 제네릭 타입 인수로 사용되는 경우).

> **이슈**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin은 상한 제한을 위반하는 타입 인수가 있는 타입 별칭을 사용하는 것을 금지합니다.
> 타입 별칭 타입 매개변수가 별칭 타입의 타입 인수의 제네릭 타입 인수로 사용되는 경우(예: `typealias Alias<T> = Base<List<T>>`) 해당 별칭 타입의 타입 매개변수의 제한을 위반하는 경우를 금지합니다.
>
> **폐기 주기**:
>
> - 1.8.0: 제네릭 타입 별칭 사용에 별칭 타입의 해당 타입 매개변수의 상한 제약 조건을 위반하는 타입 인수가 있는 경우 경고를 보고합니다.
> - &gt;=1.10: 경고를 오류로 격상합니다.

### 대리자 내부에서 확장 속성에 대해 선언된 타입 매개변수 사용을 금지합니다.

> **이슈**: [KT-24643](https://youtrack.jetbrains.com/issue/KT-24643)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.8은 제네릭 타입에 대한 확장 속성을 안전하지 않은 방식으로 수신자의 타입 매개변수를 사용하는 제네릭 타입에 위임하는 것을 금지합니다.
>
> **폐기 주기**:
>
> - 1.6.0: 확장 속성을 특정 방식으로 위임된 속성의 타입 인수에서 추론된 타입 매개변수를 사용하는 타입에 위임할 때 경고(또는 progressive 모드에서 오류)를 보고합니다.
> - 1.8.0: 경고를 오류로 격상합니다.
>  `-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### suspend 함수에서 @Synchronized 어노테이션을 금지합니다.

> **이슈**: [KT-48516](https://youtrack.jetbrains.com/issue/KT-48516)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.8은 `@Synchronized` 어노테이션을 suspend 함수에 배치하는 것을 금지합니다.
> 서스펜딩 호출은 동기화된 블록 내에서 발생해서는 안 되기 때문입니다.
>
> **폐기 주기**:
>
> - 1.6.0: `@Synchronized` 어노테이션으로 어노테이션된 suspend 함수에 대한 경고를 보고합니다.
    경고는 progressive 모드에서 오류로 보고됩니다.
> - 1.8.0: 경고를 오류로 격상합니다.
    `-XXLanguage:-SynchronizedSuspendError`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### non-vararg 매개변수에 인수를 전달하기 위해 spread 연산자 사용을 금지합니다.

> **이슈**: [KT-48162](https://youtrack.jetbrains.com/issue/KT-48162)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin은 특정 조건에서 배열을 spread 연산자(`*`)로 non-vararg 배열 매개변수에 전달하는 것을 허용했습니다. Kotlin 1.8부터는 이것이 금지됩니다.
>
> **폐기 주기**:
>
> - 1.6.0: non-vararg 배열 매개변수가 예상되는 곳에서 spread 연산자를 사용하는 것에 대한 경고(또는 progressive 모드에서 오류)를 보고합니다.
> - 1.8.0: 경고를 오류로 격상합니다.
>   `-XXLanguage:-ReportNonVarargSpreadOnGenericCalls`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### 람다 반환 타입으로 오버로드된 함수에 전달된 람다에서 null-safety 위반을 금지합니다.

> **이슈**: [KT-49658](https://youtrack.jetbrains.com/issue/KT-49658)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.8은 해당 람다의 반환 타입으로 오버로드된 함수에 전달된 람다에서 `null`을 반환하는 것을 금지합니다.
> 오버로드가 nullable 반환 타입을 허용하지 않는 경우에 해당합니다.
> 이전에는 `null`이 `when` 연산자의 분기 중 하나에서 반환된 경우 허용되었습니다.
>
> **폐기 주기**:
>
> - 1.6.20: 타입 불일치 경고(또는 progressive 모드에서 오류)를 보고합니다.
> - 1.8.0: 경고를 오류로 격상합니다.
>   `-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### public 시그니처에서 로컬 타입을 근사할 때 nullability를 유지합니다.

> **이슈**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source, binary
>
> **간단한 요약**: 로컬 또는 익명 타입이 명시적으로 지정된 반환 타입이 없는 식 본문 함수에서 반환될 때,
> Kotlin 컴파일러는 해당 타입의 알려진 슈퍼타입을 사용하여 반환 타입을 추론(또는 근사)합니다.
> 이 과정에서 컴파일러는 실제로 null 값을 반환할 수 있는 non-nullable 타입을 추론할 수 있습니다.
>
> **폐기 주기**:
>
> - 1.8.0: flexible 타입을 flexible 슈퍼타입으로 근사합니다.
> - 1.8.0: 선언이 nullable이어야 하는 non-nullable 타입으로 추론될 때 경고를 보고하여 사용자에게 타입을 명시적으로 지정하도록 안내합니다.
> - 1.9.0: nullable 타입을 nullable 슈퍼타입으로 근사합니다.
>   `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.

### 오버라이드를 통해 폐기를 전파하지 않습니다.

> **이슈**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.9는 더 이상 슈퍼클래스의 폐기된 멤버에서 서브클래스의 오버라이드 멤버로 폐기를 전파하지 않습니다.
> 따라서 슈퍼클래스의 멤버를 서브클래스에서 폐기되지 않은 상태로 유지하면서 명시적으로 폐기할 수 있는 메커니즘을 제공합니다.
>
> **폐기 주기**:
>
> - 1.6.20: 향후 동작 변경에 대한 메시지와 함께 이 경고를 억제하거나 폐기된 멤버의 오버라이드에 `@Deprecated` 어노테이션을 명시적으로 작성하라는 메시지와 함께 경고를 보고합니다.
> - 1.9.0: 오버라이드된 멤버로 폐기 상태를 전파하는 것을 중단합니다. 이 변경 사항은 progressive 모드에서도 즉시 적용됩니다.

### 빌더 추론 컨텍스트에서 타입 변수를 상한으로 암시적으로 추론하는 것을 금지합니다.

> **이슈**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.9는 빌더 추론 람다 함수의 범위에서 사용 위치 타입 정보가 없는 경우 해당 타입 매개변수의 상한으로 타입 변수를 추론하는 것을 금지합니다.
> 현재 다른 컨텍스트에서 수행하는 방식과 동일합니다.
>
> **폐기 주기**:
>
> - 1.7.20: 사용 위치 타입 정보가 없는 경우 타입 매개변수가 선언된 상한으로 추론될 때 경고(또는 progressive 모드에서 오류)를 보고합니다.
> - 1.9.0: 경고를 오류로 격상합니다.
>   `-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.

### 어노테이션 클래스에서 해당 매개변수 선언을 제외한 모든 곳에서 컬렉션 리터럴을 사용하는 것을 금지합니다.

> **이슈**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin은 제한된 방식으로 컬렉션 리터럴을 사용할 수 있습니다. 어노테이션 클래스의 매개변수에 배열을 전달하거나 이러한 매개변수의 기본값을 지정하는 데 사용할 수 있습니다.
> 그러나 그 외에도 Kotlin은 어노테이션 클래스 내부의 다른 곳(예: 중첩된 객체)에서 컬렉션 리터럴을 사용할 수 있었습니다. Kotlin 1.9는 어노테이션 클래스에서 해당 매개변수의 기본값을 제외한 모든 곳에서 컬렉션 리터럴을 사용하는 것을 금지합니다.
>
> **폐기 주기**:
>
> - 1.7.0: 어노테이션 클래스의 중첩된 객체에서 배열 리터럴에 대한 경고(또는 progressive 모드에서 오류)를 보고합니다.
> - 1.9.0: 경고를 오류로 격상합니다.

### 기본값 표현식에서 기본값이 있는 매개변수의 순방향 참조를 금지합니다.

> **이슈**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.9는 다른 매개변수의 기본값 표현식에서 기본값이 있는 매개변수의 순방향 참조를 금지합니다.
> 이렇게 하면 매개변수가 기본값 표현식에서 접근될 때 함수에 전달되거나 자체 기본값 표현식으로 초기화된 값이 이미 있는지 확인할 수 있습니다.
>
> **폐기 주기**:
>
> - 1.7.0: 기본값이 있는 매개변수가 앞에 오는 다른 매개변수의 기본값에서 참조될 때 경고(또는 progressive 모드에서 오류)를 보고합니다.
> - 1.9.0: 경고를 오류로 격상합니다.
>   `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.

### 인라인 함수형 매개변수에서 확장 호출을 금지합니다.

> **이슈**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin은 인라인 함수형 매개변수를 수신자로 다른 인라인 함수에 전달할 수 있지만, 이러한 코드를 컴파일할 때 항상 컴파일러 예외가 발생했습니다.
> Kotlin 1.9는 이를 금지하여 컴파일러를 충돌시키는 대신 오류를 보고합니다.
>
> **폐기 주기**:
>
> - 1.7.20: 인라인 함수형 매개변수에서 인라인 확장 호출에 대한 경고(또는 progressive 모드에서 오류)를 보고합니다.
> - 1.9.0: 경고를 오류로 격상합니다.

### 익명 함수 인수를 사용하여 suspend라는 이름의 infix 함수에 대한 호출을 금지합니다.

> **이슈**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.9는 익명 함수 리터럴로 전달된 함수형 타입의 단일 인수를 갖는 `suspend`라는 이름의 infix 함수를 호출하는 것을 더 이상 허용하지 않습니다.
>
> **폐기 주기**:
>
> - 1.7.20: 익명 함수 리터럴을 사용하는 서스펜드 infix 호출에 대한 경고를 보고합니다.
> - 1.9.0: 경고를 오류로 격상합니다.
>   `-XXLanguage:-ModifierNonBuiltinSuspendFunError`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.
> - &gt;=1.10: 파서가 `suspend fun` 토큰 시퀀스를 해석하는 방법을 변경합니다.

### 내부 클래스에서 해당 분산에 반하여 캡처된 타입 매개변수를 사용하는 것을 금지합니다.

> **이슈**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.9는 해당 타입 매개변수의 선언된 분산을 위반하는 위치에서 해당 클래스의 내부 클래스에서 `in` 또는 `out` 분산을 갖는 외부 클래스의 타입 매개변수를 사용하는 것을 금지합니다.
>
> **폐기 주기**:
>
> - 1.7.0: 외부 클래스의 타입 매개변수 사용 위치가 해당 매개변수의 분산 규칙을 위반할 때 경고(또는 progressive 모드에서 오류)를 보고합니다.
> - 1.9.0: 경고를 오류로 격상합니다.
>   `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.

### 복합 할당 연산자에서 명시적 반환 타입이 없는 함수의 재귀 호출을 금지합니다.

> **이슈**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.9는 함수 본문 내부의 복합 할당 연산자 인수의 명시적으로 지정된 반환 타입이 없는 함수를 호출하는 것을 금지합니다.
> 현재 해당 함수의 본문 내부의 다른 식에서 수행하는 방식과 동일합니다.
>
> **폐기 주기**:
>
> - 1.7.0: 명시적으로 지정된 반환 타입이 없는 함수가 복합 할당 연산자 인수의 해당 함수 본문에서 재귀적으로 호출될 때 경고(또는 progressive 모드에서 오류)를 보고합니다.
> - 1.9.0: 경고를 오류로 격상합니다.

### 예상되는 @NotNull T와 주어진 Kotlin 제네릭 매개변수(nullable 바운드 포함)로 안전하지 않은 호출을 금지합니다.

> **이슈**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.9는 잠재적으로 nullable 제네릭 타입의 값이
> Java 메서드의 `@NotNull` 어노테이션이 있는 매개변수에 전달되는 메서드 호출을 금지합니다.
>
> **폐기 주기**:
>
> - 1.5.20: 제약 조건이 없는 제네릭 타입 매개변수가 non-nullable 타입이 예상되는 곳에 전달될 때 경고를 보고합니다.
> - 1.9.0: 위의 경고 대신 타입 불일치 오류를 보고합니다.
>   `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### 이 열거형의 항목 초기화 프로그램에서 열거형 클래스의 컴패니언 멤버에 대한 액세스를 금지합니다.

> **이슈**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **컴포넌트**: Core language
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.9는 열거형 항목 초기화 프로그램에서 열거형의 컴패니언 객체에 대한 모든 종류의 액세스를 금지합니다.
>
> **폐기 주기**:
>
> - 1.6.20: 이러한 컴패니언 멤버 액세스에 대한 경고(또는 progressive 모드에서 오류)를 보고합니다.
> - 1.9.0: 경고를 오류로 격상합니다.
>   `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### Enum.declaringClass 합성 속성을 더 이상 사용하지 않고 제거합니다.

> **이슈**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin은 `java.lang.Enum` 기본 Java 클래스의 `getDeclaringClass()` 메서드에서 생성된 `Enum` 값에 대해 합성 속성 `declaringClass`를 사용할 수 있도록 허용했습니다.
> 이 메서드는 Kotlin `Enum` 타입에서 사용할 수 없더라도 말입니다. Kotlin 1.9는 이 속성을 사용하는 것을 금지하고 대신 확장 속성 `declaringJavaClass`로 마이그레이션할 것을 제안합니다.
>
> **폐기 주기**:
>
> - 1.7.0: `declaringClass` 속성 사용에 대한 경고(또는 progressive 모드에서 오류)를 보고합니다.
>   `declaringJavaClass` 확장으로 마이그레이션을 제안합니다.
> - 1.9.0: 경고를 오류로 격상합니다.
>   `-XXLanguage:-ProhibitEnumDeclaringClass`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.
> - &gt;=1.10: `declaringClass` 합성 속성을 제거합니다.

### 컴파일러 옵션 -Xjvm-default의 활성화 및 호환성 모드를 더 이상 사용하지 않습니다.

> **이슈**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.6.20은 `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드 사용에 대해 경고합니다.
>
> **폐기 주기**:
>
> - 1.6.20: `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드에 대한 경고를 도입합니다.
> - &gt;= 1.9: 이 경고를 오류로 격상합니다.

## 표준 라이브러리

### Range/Progression이 Collection을 구현하기 시작할 때 잠재적인 오버로드 해결 변경 사항에 대해 경고합니다.

> **이슈**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **컴포넌트**: Core language / kotlin-stdlib
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: Kotlin 1.9에서 표준 progression 및 해당 progression에서 상속된 concrete range에서 `Collection` 인터페이스를 구현할 계획입니다.
> 이렇게 하면 일부 메서드의 오버로드가 두 개 있는 경우 오버로드 해결에서 다른 오버로드를 선택할 수 있습니다. 하나는 요소를 허용하고 다른 하나는 컬렉션을 허용합니다.
> Kotlin은 이러한 상황이 표시되도록 하여 해당 오버로드된 메서드가 범위 또는 progression 인수로 호출될 때 경고 또는 오류를 보고합니다.
>
> **폐기 주기**:
>
> - 1.6.20: 오버로드된 메서드가 표준 progression 또는 해당 범위 상속자를 인수로 호출될 때 경고를 보고합니다.
>   이 progression/범위가 `Collection` 인터페이스를 구현하면 이 호출에서 다른 오버로드가 선택되는 경우에 해당합니다.
> - 1.8.0: 이 경고를 오류로 격상합니다.
> - 1.9.0: 오류 보고를 중단하고 progression에서 `Collection` 인터페이스를 구현하여 영향을 받는 케이스에서 오버로드 해결 결과를 변경합니다.

### kotlin.dom 및 kotlin.browser 패키지에서 kotlinx.*로 선언을 마이그레이션합니다.

> **이슈**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **컴포넌트**: kotlin-stdlib (JS)
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: stdlib에서 추출할 준비를 위해 `kotlin.dom` 및 `kotlin.browser` 패키지의 선언이 해당 `kotlinx.*` 패키지로 이동되었습니다.
>
> **폐기 주기**:
>
> - 1.4.0: `kotlinx.dom` 및 `kotlinx.browser` 패키지에 대체 API를 도입합니다.
> - 1.4.0: `kotlin.dom` 및 `kotlin.browser` 패키지에서 API를 더 이상 사용하지 않고 위의 새 API를 대체 API로 제안합니다.
> - 1.6.0: 폐기 수준을 오류로 높입니다.
> - 1.8.20: JS-IR 타겟에 대한 stdlib에서 더 이상 사용되지 않는 함수를 제거합니다.
> - &gt;= 1.9: kotlinx.* 패키지의 API를 별도의 라이브러리로 이동합니다.

### 일부 JS 전용 API를 더 이상 사용하지 않습니다.

> **이슈**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **컴포넌트**: kotlin-stdlib (JS)
>
> **호환성 없는 변경 유형**: source
>
> **간단한 요약**: stdlib의 많은 JS 전용 함수가 제거를 위해 더 이상 사용되지 않습니다. 여기에는 `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)` 및 비교 함수를 사용하는 배열의 `sort` 함수(예: `Array<out T>.sort(comparison: (a: T, b: T) `->` Int)`)가 포함됩니다.
>
> **폐기 주기**:
>
> - 1.6.0: 영향을 받는 함수를 경고와 함께 더 이상 사용하지 않습니다.
> - 1.9.0: 폐기 수준을 오류로 높입니다.
> - &gt;=1.10.0: 더 이상 사용되지 않는 함수를 public API에서 제거합니다.

## 도구

### KotlinCompile 작업의 classpath 속성의 폐기 수준을 높입니다.

> **이슈**: [KT-51