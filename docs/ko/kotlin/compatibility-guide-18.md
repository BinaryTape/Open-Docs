[//]: # (title: Kotlin 1.8.x 호환성 가이드)

_[언어를 현대적으로 유지하기](kotlin-evolution-principles.md)_와 _[편안한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 핵심 원칙 중 일부입니다. 전자는 언어의 진화를 방해하는 구조물은 제거해야 한다는 원칙이며, 후자는 이러한 제거가 코드 마이그레이션을 최대한 원활하게 할 수 있도록 사전에 잘 전달되어야 한다는 원칙입니다.

대부분의 언어 변경 사항은 업데이트 변경 로그나 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 이를 모두 요약하여 Kotlin 1.7에서 Kotlin 1.8로의 마이그레이션을 위한 완전한 참조를 제공합니다.

## 기본 용어

이 문서에서는 여러 종류의 호환성을 소개합니다.

- _소스(source)_: 소스 호환되지 않는 변경은 이전에 문제없이(에러나 경고 없이) 컴파일되던 코드가 더 이상 컴파일되지 않게 함을 의미합니다.
- _바이너리(binary)_: 두 바이너리 아티팩트가 서로 교체되어도 로딩 또는 링크 에러가 발생하지 않는 경우를 바이너리 호환된다고 합니다.
- _동작(behavioral)_: 변경 전후에 동일한 프로그램이 서로 다른 동작을 나타내는 경우를 동작 호환되지 않는 변경이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 적용됩니다. 다른 언어 관점(예: Java)에서의 Kotlin 코드 호환성은 이 문서의 범위를 벗어납니다.

## 언어(Language)

<!--
### 제목

> **이슈**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**:
>
> **폐지 주기**:
>
> - 1.6.20: 경고 보고
> - 1.8.0: 경고를 에러로 격상
-->

### 추상 상위 클래스 멤버로의 super 호출 위임 금지

> **이슈**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
> 
> **요약**: 상위 인터페이스에 기본 구현이 있더라도, 명시적 또는 암시적 super 호출이 상위 클래스의 _추상(abstract)_ 멤버로 위임되는 경우 Kotlin은 컴파일 에러를 보고합니다.
>
> **폐지 주기**:
>
> - 1.5.20: 모든 추상 멤버를 오버라이드하지 않은 비추상 클래스가 사용될 때 경고 도입
> - 1.7.0: super 호출이 실제로 상위 클래스의 추상 멤버에 접근하는 경우 경고 보고
> - 1.7.0: `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 호환 모드가 활성화된 경우 영향을 받는 모든 사례에서 에러 보고, 프로그레시브 모드에서 에러 보고
> - 1.8.0: 상위 클래스로부터 오버라이드되지 않은 추상 메서드를 가진 구체 클래스(concrete class)를 선언하는 경우와, 상위 클래스에서 추상으로 오버라이드된 `Any` 메서드에 대한 super 호출 사례에서 에러 보고
> - 1.9.0: 상위 클래스의 추상 메서드에 대한 명시적 super 호출을 포함하여 영향을 받는 모든 사례에서 에러 보고

### when-with-subject에서 혼동을 주는 문법 지원 중단

> **이슈**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.6은 `when` 조건식에서 혼동을 주는 몇 가지 문법 구조를 사용 중단(deprecated)했습니다.
>
> **폐지 주기**:
>
> - 1.6.20: 영향을 받는 식에 대해 지원 중단 경고 도입
> - 1.8.0: 이 경고를 에러로 격상, `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches`를 사용하여 일시적으로 1.8 이전의 동작으로 되돌릴 수 있음
> - &gt;= 1.9: 지원 중단된 일부 구조를 새로운 언어 기능을 위해 재사용

### 서로 다른 숫자 타입 간의 암시적 강제 변환 방지

> **이슈**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **컴포넌트**: Kotlin/JVM
>
> **비호환 변경 유형**: 동작
>
> **요약**: Kotlin은 의미상 해당 타입으로의 다운캐스트만 필요한 경우 숫자 값을 프리미티브 숫자 타입으로 자동 변환하는 것을 방지합니다.
>
> **폐지 주기**:
>
> - < 1.5.30: 모든 영향을 받는 사례에서 이전 동작 유지
> - 1.5.30: 생성된 프로퍼티 위임 접근자에서 다운캐스트 동작 수정, `-Xuse-old-backend`를 사용하여 일시적으로 1.5.30 이전의 수정 동작으로 되돌릴 수 있음
> - &gt;= 1.9: 영향을 받는 다른 사례에서도 다운캐스트 동작 수정

### 봉인된 클래스(sealed class)의 프라이빗 생성자를 실제로 프라이빗하게 수정

> **이슈**: [KT-44866](https://youtrack.jetbrains.com/issue/KT-44866)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: 프로젝트 구조 내에서 봉인된 클래스의 상속자를 선언할 수 있는 위치 제한이 완화된 후, 봉인된 클래스 생성자의 기본 가시성은 protected가 되었습니다. 그러나 1.8 전까지 Kotlin은 봉인된 클래스의 범위 밖에서 명시적으로 선언된 프라이빗 생성자를 호출하는 것을 여전히 허용했습니다.
>
> **폐지 주기**:
>
> - 1.6.20: 봉인된 클래스 외부에서 해당 클래스의 프라이빗 생성자가 호출될 때 경고 보고(또는 프로그레시브 모드에서 에러 보고)
> - 1.8.0: 프라이빗 생성자에 대해 기본 가시성 규칙 사용(프라이빗 생성자 호출은 해당 클래스 내부에서만 가능), `-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses` 컴파일러 인수를 지정하여 일시적으로 이전 동작을 복구할 수 있음

### 빌더 추론 컨텍스트에서 호환되지 않는 숫자 타입에 대한 operator == 사용 금지

> **이슈**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.8은 빌더 추론 람다 함수의 범위 내에서 `Int`와 `Long` 같이 호환되지 않는 숫자 타입에 대해 연산자 `==`를 사용하는 것을 현재 다른 컨텍스트에서와 동일하게 금지합니다.
>
> **폐지 주기**:
>
> - 1.6.20: 호환되지 않는 숫자 타입에 연산자 `==`가 사용될 때 경고 보고(또는 프로그레시브 모드에서 에러 보고)
> - 1.8.0: 경고를 에러로 격상, `-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls`를 사용하여 일시적으로 1.8 이전의 동작으로 되돌릴 수 있음

### 엘비스 연산자 우항에서 else가 없는 if 및 비포괄적 when 사용 금지

> **이슈**: [KT-44705](https://youtrack.jetbrains.com/issue/KT-44705)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.8은 엘비스 연산자(`?:`)의 우항에서 비포괄적(non-exhaustive) `when` 또는 `else` 분기가 없는 `if` 식을 사용하는 것을 금지합니다. 이전에는 엘비스 연산자의 결과가 식으로 사용되지 않는 경우 허용되었습니다.
>
> **폐지 주기**:
>
> - 1.6.20: 이러한 비포괄적 if 및 when 식에 대해 경고 보고(또는 프로그레시브 모드에서 에러 보고)
> - 1.8.0: 이 경고를 에러로 격상, `-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis`를 사용하여 일시적으로 1.8 이전의 동작으로 되돌릴 수 있음

### 제네릭 타입 별칭 사용 시 상한(upper bound) 위반 금지 (하나의 타입 매개변수가 별칭 타입의 여러 타입 인자에 사용되는 경우)

> **이슈**: [KT-29168](https://youtrack.jetbrains.com/issue/KT-29168)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.8은 `typealias Alias<T> = Base<T, T>`와 같이 하나의 타입 별칭 타입 매개변수가 별칭 타입의 여러 타입 인자에 사용되는 경우, 해당 타입 매개변수의 상한 제한을 위반하는 타입 인자와 함께 타입 별칭을 사용하는 것을 금지합니다.
>
> **폐지 주기**:
>
> - 1.7.0: 상한 제약 조건을 위반하는 타입 인자를 가진 타입 별칭 사용 시 경고 보고(또는 프로그레시브 모드에서 에러 보고)
> - 1.8.0: 이 경고를 에러로 격상, `-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes`를 사용하여 일시적으로 1.8 이전의 동작으로 되돌릴 수 있음

### 제네릭 타입 별칭 사용 시 상한 위반 금지 (타입 매개변수가 별칭 타입 인자의 제네릭 타입 인자로 사용되는 경우)

> **이슈**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin은 `typealias Alias<T> = Base<List<T>>`와 같이 타입 별칭 타입 매개변수가 별칭 타입의 타입 인자의 제네릭 타입 인자로 사용되는 경우, 해당 타입 매개변수의 상한 제한을 위반하는 타입 인자와 함께 타입 별칭을 사용하는 것을 금지합니다.
>
> **폐지 주기**:
>
> - 1.8.0: 제네릭 타입 별칭 사용 시 상한 제약 조건을 위반하는 타입 인자가 있는 경우 경고 보고
> - &gt;=1.10: 경고를 에러로 격상

### 위임(delegate) 내부에서 확장 프로퍼티를 위해 선언된 타입 매개변수 사용 금지

> **이슈**: [KT-24643](https://youtrack.jetbrains.com/issue/KT-24643)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.8은 제네릭 타입의 확장 프로퍼티를 수신 객체의 타입 매개변수를 안전하지 않은 방식으로 사용하는 제네릭 타입에 위임하는 것을 금지합니다.
>
> **폐지 주기**:
>
> - 1.6.0: 위임된 프로퍼티의 타입 인자로부터 추론된 타입 매개변수를 특정 방식으로 사용하는 타입에 확장 프로퍼티를 위임할 때 경고 보고(또는 프로그레시브 모드에서 에러 보고)
> - 1.8.0: 경고를 에러로 격상, `-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate`를 사용하여 일시적으로 1.8 이전의 동작으로 되돌릴 수 있음

### suspend 함수에 @Synchronized 어노테이션 금지

> **이슈**: [KT-48516](https://youtrack.jetbrains.com/issue/KT-48516)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.8은 suspend 함수에 `@Synchronized` 어노테이션을 부착하는 것을 금지합니다. 이는 synchronized 블록 내부에서 중단 호출(suspending call)이 발생하는 것을 허용해서는 안 되기 때문입니다.
>
> **폐지 주기**:
>
> - 1.6.0: `@Synchronized` 어노테이션이 부착된 suspend 함수에 대해 경고 보고, 프로그레시브 모드에서는 에러로 보고
> - 1.8.0: 경고를 에러로 격상, `-XXLanguage:-SynchronizedSuspendError`를 사용하여 일시적으로 1.8 이전의 동작으로 되돌릴 수 있음

### vararg가 아닌 매개변수에 인자를 전달할 때 스프레드 연산자(*) 사용 금지

> **이슈**: [KT-48162](https://youtrack.jetbrains.com/issue/KT-48162)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin은 특정 조건에서 vararg가 아닌 배열 매개변수에 스프레드 연산자(`*`)를 사용하여 배열을 전달하는 것을 허용했습니다. Kotlin 1.8부터는 이것이 금지됩니다.
>
> **폐지 주기**:
>
> - 1.6.0: vararg가 아닌 배열 매개변수가 예상되는 곳에 스프레드 연산자를 사용할 때 경고 보고(또는 프로그레시브 모드에서 에러 보고)
> - 1.8.0: 경고를 에러로 격상, `-XXLanguage:-ReportNonVarargSpreadOnGenericCalls`를 사용하여 일시적으로 1.8 이전의 동작으로 되돌릴 수 있음

### 람다 반환 타입으로 오버로드된 함수에 전달된 람다 내의 null 안전성 위반 금지

> **이슈**: [KT-49658](https://youtrack.jetbrains.com/issue/KT-49658)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.8은 오버로드된 함수들이 널 허용(nullable) 반환 타입을 허용하지 않는 경우, 해당 람다의 반환 타입으로 오버로드된 함수에 전달된 람다에서 `null`을 반환하는 것을 금지합니다. 이전에는 `null`이 `when` 연산자의 분기 중 하나에서 반환될 때 허용되었습니다.
>
> **폐지 주기**:
>
> - 1.6.20: 타입 불일치 경고 보고(또는 프로그레시브 모드에서 에러 보고)
> - 1.8.0: 경고를 에러로 격상, `-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType`을 사용하여 일시적으로 1.8 이전의 동작으로 되돌릴 수 있음

### 공개 시그니처에서 로컬 타입을 근사화(approximating)할 때 null 여부 유지

> **이슈**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스, 바이너리
>
> **요약**: 반환 타입이 명시적으로 지정되지 않은 식 본문 함수에서 로컬 또는 익명 타입이 반환될 때, Kotlin 컴파일러는 해당 타입의 알려진 상위 타입을 사용하여 반환 타입을 추론(또는 근사화)합니다. 이 과정에서 컴파일러는 실제로 null 값이 반환될 수 있음에도 불구하고 널 불가(non-nullable) 타입을 추론할 수 있었습니다.
>
> **폐지 주기**:
>
> - 1.8.0: 유연한 타입(flexible types)을 유연한 상위 타입으로 근사화
> - 1.8.0: 널 허용이어야 하는 선언이 널 불가 타입으로 추론될 때 경고를 보고하여 사용자가 타입을 명시적으로 지정하도록 유도
> - 1.9.0: 널 허용 타입을 널 허용 상위 타입으로 근사화, `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType`을 사용하여 일시적으로 1.9 이전의 동작으로 되돌릴 수 있음

### 오버라이드를 통한 지원 중단(deprecation) 전파 중단

> **이슈**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 상위 클래스의 지원 중단된 멤버에서 하위 클래스의 오버라이딩 멤버로 지원 중단 상태를 더 이상 전파하지 않습니다. 이를 통해 상위 클래스의 멤버는 지원 중단하되 하위 클래스에서는 지원 중단되지 않은 상태로 유지할 수 있는 명시적 메커니즘을 제공합니다.
>
> **폐지 주기**:
>
> - 1.6.20: 향후 동작 변경 메시지와 함께 경고를 표시하고, 이 경고를 억제하거나 오버라이드 멤버에 `@Deprecated` 어노테이션을 명시적으로 작성하도록 권장
> - 1.9.0: 오버라이드된 멤버로 지원 중단 상태를 전파하는 것을 중단. 이 변경 사항은 프로그레시브 모드에서도 즉시 적용됨

### 빌더 추론 컨텍스트에서 타입 변수를 상한으로 암시적 추론하는 것 금지

> **이슈**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 빌더 추론 람다 함수의 범위 내에서 사용처 타입 정보가 없는 경우 타입 변수를 해당 타입 매개변수의 상한(upper bound)으로 추론하는 것을 현재 다른 컨텍스트에서와 동일하게 금지합니다.
>
> **폐지 주기**:
>
> - 1.7.20: 사용처 타입 정보가 없는 상태에서 타입 매개변수가 선언된 상한으로 추론될 때 경고 보고(또는 프로그레시브 모드에서 에러 보고)
> - 1.9.0: 경고를 에러로 격상, `-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound`를 사용하여 일시적으로 1.9 이전의 동작으로 되돌릴 수 있음

### 어노테이션 클래스의 매개변수 선언 외의 장소에서 컬렉션 리터럴 사용 금지

> **이슈**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin은 어노테이션 클래스의 매개변수에 배열을 전달하거나 이 매개변수의 기본값을 지정하는 용도로만 컬렉션 리터럴을 제한적으로 사용할 수 있도록 허용합니다. 그러나 그 외에도 어노테이션 클래스 내부의 중첩 객체 등 다른 장소에서도 컬렉션 리터럴 사용을 허용해 왔습니다. Kotlin 1.9는 매개변수 기본값 외의 어노테이션 클래스 내 장소에서 컬렉션 리터럴 사용을 금지합니다.
>
> **폐지 주기**:
>
> - 1.7.0: 어노테이션 클래스 내부의 중첩 객체에서 배열 리터럴 사용 시 경고 보고(또는 프로그레시브 모드에서 에러 보고)
> - 1.9.0: 경고를 에러로 격상

### 기본값 식 내에서 기본값이 있는 매개변수의 전방 참조(forward referencing) 금지

> **이슈**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 다른 매개변수의 기본값 식에서 기본값이 있는 매개변수를 전방 참조하는 것을 금지합니다. 이는 기본값 식에서 매개변수에 접근할 때 해당 매개변수가 이미 함수로 전달되었거나 자체 기본값 식에 의해 초기화된 값을 가지고 있음을 보장하기 위함입니다.
>
> **폐지 주기**:
>
> - 1.7.0: 기본값이 있는 매개변수가 그보다 먼저 나오는 다른 매개변수의 기본값에서 참조될 때 경고 보고(또는 프로그레시브 모드에서 에러 보고)
> - 1.9.0: 경고를 에러로 격상, `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments`를 사용하여 일시적으로 1.9 이전의 동작으로 되돌릴 수 있음

### 인라인 함수형 매개변수에 대한 확장 호출(extension call) 금지

> **이슈**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin은 인라인 함수형 매개변수를 다른 인라인 함수의 수신 객체로 전달하는 것을 허용했으나, 이러한 코드를 컴파일할 때 항상 컴파일러 예외가 발생했습니다. Kotlin 1.9는 이를 금지하여 컴파일러 크래시 대신 에러를 보고하도록 수정합니다.
>
> **폐지 주기**:
>
> - 1.7.20: 인라인 함수형 매개변수에 대한 인라인 확장 호출 시 경고 보고(또는 프로그레시브 모드에서 에러 보고)
> - 1.9.0: 경고를 에러로 격상

### 익명 함수 인자를 사용하는 suspend라는 이름의 infix 함수 호출 금지

> **이슈**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 익명 함수 리터럴로 전달되는 함수형 타입의 단일 인자를 가진 `suspend`라는 이름의 infix 함수 호출을 더 이상 허용하지 않습니다.
>
> **폐지 주기**:
>
> - 1.7.20: 익명 함수 리터럴을 사용하는 suspend infix 호출에 대해 경고 보고
> - 1.9.0: 경고를 에러로 격상, `-XXLanguage:-ModifierNonBuiltinSuspendFunError`를 사용하여 일시적으로 1.9 이전의 동작으로 되돌릴 수 있음
> - &gt;=1.10: 파서가 `suspend fun` 토큰 시퀀스를 해석하는 방식을 변경

### 내부 클래스에서 캡처된 타입 매개변수를 가변성(variance)에 어긋나게 사용하는 것 금지

> **이슈**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 외부 클래스의 `in` 또는 `out` 가변성을 가진 타입 매개변수를 해당 클래스의 내부 클래스에서 선언된 가변성 규칙을 위반하는 위치에 사용하는 것을 금지합니다.
>
> **폐지 주기**:
>
> - 1.7.0: 외부 클래스의 타입 매개변수 사용 위치가 해당 매개변수의 가변성 규칙을 위반할 때 경고 보고(또는 프로그레시브 모드에서 에러 보고)
> - 1.9.0: 경고를 에러로 격상, `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments`를 사용하여 일시적으로 1.9 이전의 동작으로 되돌릴 수 있음

### 복합 대입 연산자(compound assignment operators)에서 명시적 반환 타입이 없는 함수의 재귀 호출 금지

> **이슈**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 명시적으로 반환 타입이 지정되지 않은 함수를 해당 함수 본문 내 복합 대입 연산자의 인자에서 호출하는 것을 금지합니다. 이는 현재 해당 함수 본문 내의 다른 식에서 재귀 호출을 금지하는 것과 동일합니다.
>
> **폐지 주기**:
>
> - 1.7.0: 명시적으로 지정된 반환 타입이 없는 함수가 해당 함수 본문의 복합 대입 연산자 인자에서 재귀적으로 호출될 때 경고 보고(또는 프로그레시브 모드에서 에러 보고)
> - 1.9.0: 경고를 에러로 격상

### @NotNull T가 예상되는 곳에 널 허용 상한을 가진 Kotlin 제네릭 매개변수를 전달하는 비정상적인 호출 금지

> **이슈**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **컴포넌트**: Kotlin/JVM
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 Java 메서드의 `@NotNull` 어노테이션이 붙은 매개변수에 잠재적으로 널 허용이 가능한 제네릭 타입의 값이 전달되는 메서드 호출을 금지합니다.
>
> **폐지 주기**:
>
> - 1.5.20: 널 불가 타입이 예상되는 곳에 제약이 없는 제네릭 타입 매개변수가 전달될 때 경고 보고
> - 1.9.0: 위의 경고 대신 타입 불일치 에러 보고, `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated`를 사용하여 일시적으로 1.8 이전의 동작으로 되돌릴 수 있음

### enum 항목 초기화 식에서 enum 클래스의 컴패니언 멤버 접근 금지

> **이슈**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **컴포넌트**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 enum 항목 초기화 식에서 enum의 컴패니언 객체에 대한 모든 종류의 접근을 금지합니다.
>
> **폐지 주기**:
>
> - 1.6.20: 이러한 컴패니언 멤버 접근 시 경고 보고(또는 프로그레시브 모드에서 에러 보고)
> - 1.9.0: 경고를 에러로 격상, `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall`을 사용하여 일시적으로 1.8 이전의 동작으로 되돌릴 수 있음

### Enum.declaringClass 합성 프로퍼티 지원 중단 및 제거

> **이슈**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **컴포넌트**: Kotlin/JVM
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin은 하위 Java 클래스인 `java.lang.Enum`의 `getDeclaringClass()` 메서드에서 생성된 합성 프로퍼티 `declaringClass`를 `Enum` 값에서 사용할 수 있도록 허용했으나, 이 메서드는 Kotlin `Enum` 타입에서 사용할 수 없습니다. Kotlin 1.9는 이 프로퍼티의 사용을 금지하며, 대신 확장 프로퍼티 `declaringJavaClass`로 마이그레이션할 것을 권장합니다.
>
> **폐지 주기**:
>
> - 1.7.0: `declaringClass` 프로퍼티 사용 시 경고 보고(또는 프로그레시브 모드에서 에러 보고), `declaringJavaClass` 확장으로 마이그레이션 제안
> - 1.9.0: 경고를 에러로 격상, `-XXLanguage:-ProhibitEnumDeclaringClass`를 사용하여 일시적으로 1.9 이전의 동작으로 되돌릴 수 있음
> - &gt;=1.10: `declaringClass` 합성 프로퍼티 제거

### 컴파일러 옵션 -Xjvm-default의 enable 및 compatibility 모드 지원 중단

> **이슈**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **컴포넌트**: Kotlin/JVM
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.6.20은 `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드 사용에 대해 경고합니다.
>
> **폐지 주기**:
>
> - 1.6.20: `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드에 대해 경고 도입
> - &gt;= 1.9: 이 경고를 에러로 격상

## 표준 라이브러리(Standard library)

### Range/Progression이 Collection을 구현함에 따른 잠재적인 오버로드 해소 변경 경고

> **이슈**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **컴포넌트**: 코어 언어 / kotlin-stdlib
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.9에서는 표준 progression과 여기에서 상속된 구체적인 range에 `Collection` 인터페이스를 구현할 계획입니다. 이로 인해 어떤 메서드에 요소(element)를 받는 오버로드와 컬렉션(collection)을 받는 오버로드 두 가지가 있는 경우, 오버로드 해소(resolution)에서 다른 오버로드가 선택될 수 있습니다. Kotlin은 이러한 오버로드된 메서드가 range나 progression 인자와 함께 호출될 때 경고 또는 에러를 보고하여 이 상황을 가시화합니다.
>
> **폐지 주기**:
>
> - 1.6.20: 표준 progression이나 그 자식 range를 인자로 하여 오버로드된 메서드를 호출할 때, 향후 해당 progression/range가 `Collection` 인터페이스를 구현함으로써 다른 오버로드가 선택될 가능성이 있는 경우 경고 보고
> - 1.8.0: 이 경고를 에러로 격상 
> - 1.9.0: 에러 보고를 중단하고 progression에서 `Collection` 인터페이스를 구현하여, 영향을 받는 사례에서 오버로드 해소 결과가 변경됨

### kotlin.dom 및 kotlin.browser 패키지의 선언을 kotlinx.*로 마이그레이션

> **이슈**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **컴포넌트**: kotlin-stdlib (JS)
>
> **비호환 변경 유형**: 소스
>
> **요약**: `kotlin.dom` 및 `kotlin.browser` 패키지의 선언들을 stdlib에서 분리하기 위해 해당 `kotlinx.*` 패키지로 이동했습니다.
>
> **폐지 주기**:
>
> - 1.4.0: `kotlinx.dom` 및 `kotlinx.browser` 패키지에 대체 API 도입
> - 1.4.0: `kotlin.dom` 및 `kotlin.browser` 패키지의 API를 지원 중단하고 위의 새로운 API를 대체제로 제안
> - 1.6.0: 지원 중단 레벨을 에러로 격상
> - 1.8.20: JS-IR 타겟의 stdlib에서 지원 중단된 함수 제거
> - &gt;= 1.9: kotlinx.* 패키지의 API를 별도의 라이브러리로 이동

### 일부 JS 전용 API 지원 중단

> **이슈**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **컴포넌트**: kotlin-stdlib (JS)
>
> **비호환 변경 유형**: 소스
>
> **요약**: stdlib의 다수 JS 전용 함수들이 제거를 위해 지원 중단되었습니다. 여기에는 `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)`, 그리고 비교 함수를 받는 배열의 `sort` 함수(예: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`)가 포함됩니다.
>
> **폐지 주기**:
>
> - 1.6.0: 영향을 받는 함수들을 경고와 함께 지원 중단
> - 1.9.0: 지원 중단 레벨을 에러로 격상
> - &gt;=1.10.0: 공개 API에서 지원 중단된 함수 제거

## 도구(Tools)

### KotlinCompile 태스크의 classpath 프로퍼티 지원 중단 레벨 격상

> **이슈**: [KT-51679](https://youtrack.jetbrains.com/issue/KT-51679)
>
> **컴포넌트**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: `KotlinCompile` 태스크의 `classpath` 프로퍼티가 지원 중단되었습니다.
>
> **폐지 주기**:
>
> - 1.7.0: `classpath` 프로퍼티 지원 중단
> - 1.8.0: 지원 중단 레벨을 에러로 격상
> - &gt;=1.9.0: 공개 API에서 지원 중단된 함수 제거

### kapt.use.worker.api Gradle 프로퍼티 제거

> **이슈**: [KT-48827](https://youtrack.jetbrains.com/issue/KT-48827)
>
> **컴포넌트**: Gradle
>
> **비호환 변경 유형**: 동작
>
> **요약**: Gradle Workers API를 통해 kapt를 실행할 수 있게 했던 `kapt.use.worker.api` 프로퍼티를 제거합니다(기본값: true).
>
> **폐지 주기**:
>
> - 1.6.20: 지원 중단 레벨을 경고로 격상
> - 1.8.0: 이 프로퍼티 제거

### kotlin.compiler.execution.strategy 시스템 프로퍼티 제거

> **이슈**: [KT-51831](https://youtrack.jetbrains.com/issue/KT-51831)
>
> **컴포넌트**: Gradle
>
> **비호환 변경 유형**: 동작
>
> **요약**: 컴파일러 실행 전략을 선택하는 데 사용되던 `kotlin.compiler.execution.strategy` 시스템 프로퍼티를 제거합니다. 대신 Gradle 프로퍼티 `kotlin.compiler.execution.strategy` 또는 컴파일 태스크 프로퍼티 `compilerExecutionStrategy`를 사용하십시오.
>
> **폐지 주기:**
>
> - 1.7.0: 지원 중단 레벨을 경고로 격상
> - 1.8.0: 프로퍼티 제거

### 컴파일러 옵션 변경 사항

> **이슈**: [KT-27301](https://youtrack.jetbrains.com/issue/KT-27301), [KT-48532](https://youtrack.jetbrains.com/issue/KT-48532)
>
> **컴포넌트**: Gradle
>
> **비호환 변경 유형**: 소스, 바이너리
>
> **요약**: 이 변경 사항은 Gradle 플러그인 작성자에게 영향을 줄 수 있습니다. `kotlin-gradle-plugin`에서 일부 내부 타입에 추가적인 제네릭 매개변수가 생겼습니다(제네릭 타입을 추가하거나 `*`를 사용해야 합니다). `KotlinNativeLink` 태스크는 더 이상 `AbstractKotlinNativeCompile` 태스크를 상속하지 않습니다. `KotlinJsCompilerOptions.outputFile` 및 관련 `KotlinJsOptions.outputFile` 옵션이 지원 중단되었습니다. 대신 `Kotlin2JsCompile.outputFileProperty` 태스크 입력을 사용하십시오. `kotlinOptions` 태스크 입력과 `kotlinOptions{...}` 태스크 DSL은 지원 모드(support mode)에 있으며 향후 릴리스에서 지원 중단될 예정입니다. `compilerOptions`와 `kotlinOptions`는 태스크 실행 단계에서 변경할 수 없습니다([Kotlin 1.8의 새로운 기능](whatsnew18.md#limitations)의 예외 사항 참조). `freeCompilerArgs`는 불변(immutable) `List<String>`을 반환하므로 `kotlinOptions.freeCompilerArgs.remove("something")`는 실패합니다. 이전 JVM 백엔드를 사용할 수 있게 했던 `useOldBackend` 프로퍼티가 제거되었습니다.
>
> **폐지 주기:**
>
> - 1.8.0: `KotlinNativeLink` 태스크가 `AbstractKotlinNativeCompile`을 상속하지 않음. `KotlinJsCompilerOptions.outputFile` 및 관련 `KotlinJsOptions.outputFile` 옵션이 지원 중단됨. 이전 JVM 백엔드를 사용할 수 있게 했던 `useOldBackend` 프로퍼티가 제거됨.

### kotlin.internal.single.build.metrics.file 프로퍼티 지원 중단

> **이슈**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **컴포넌트**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: 빌드 보고서를 위한 단일 파일을 정의하는 데 사용되던 `kotlin.internal.single.build.metrics.file` 프로퍼티를 지원 중단합니다. 대신 `kotlin.build.report.output=single_file`과 함께 `kotlin.build.report.single_file` 프로퍼티를 사용하십시오.
>
> **폐지 주기:**
>
> - 1.8.0: 지원 중단 레벨을 경고로 격상
> - &gt;= 1.9: 프로퍼티 삭제