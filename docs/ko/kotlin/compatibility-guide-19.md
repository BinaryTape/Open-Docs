[//]: # (title: Kotlin 1.9.x 호환성 가이드)

_[언어의 현대성 유지(Keeping the Language Modern)](kotlin-evolution-principles.md)_ 및 _[편안한 업데이트(Comfortable Updates)](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 기본 원칙 중 일부입니다. 전자는 언어의 진화를 방해하는 구조를 제거해야 함을 의미하며, 후자는 코드 마이그레이션을 가능한 한 원활하게 만들기 위해 이러한 제거를 사전에 충분히 전달해야 함을 의미합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그나 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 Kotlin 1.8에서 Kotlin 1.9로의 마이그레이션을 위한 완전한 참조를 제공하기 위해 이들을 모두 요약합니다.

## 기본 용어

이 문서에서는 몇 가지 종류의 호환성을 소개합니다.

- _소스(source)_: 소스 호환되지 않는 변경은 이전에 (에러나 경고 없이) 잘 컴파일되던 코드의 컴파일을 중단시킵니다.
- _바이너리(binary)_: 두 바이너리 아티팩트를 서로 교체해도 로딩이나 링킹(linkage) 에러가 발생하지 않는다면 바이너리 호환된다고 합니다.
- _동작(behavioral)_: 동일한 프로그램이 변경 사항을 적용하기 전과 후에 서로 다른 동작을 보인다면 동작 호환되지 않는다고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 제공된다는 점을 기억하세요. 다른 언어 관점(예: Java)에서의 Kotlin 코드 호환성은 이 문서의 범위를 벗어납니다.

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

### 언어 버전 1.3 지원 제거

> **이슈**: [KT-61111](https://youtrack.jetbrains.com/issue/KT-61111/Remove-language-version-1.3)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.9에서는 언어 버전 1.9를 도입하고 언어 버전 1.3에 대한 지원을 제거합니다.
>
> **사용 중단 주기**:
>
> - 1.6.0: 경고 보고
> - 1.9.0: 경고를 에러로 격상

### 상위 인터페이스 타입이 함수 리터럴인 경우 super 생성자 호출 금지

> **이슈**: [KT-46344](https://youtrack.jetbrains.com/issue/KT-46344)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 인터페이스가 함수 리터럴 타입을 상속받는 경우, Kotlin 1.9에서는 해당 생성자가 존재하지 않으므로 super 생성자 호출을 금지합니다.
>
> **사용 중단 주기**:
> * 1.7.0: 경고 보고 (또는 프로그레시브 모드에서 에러 보고)
> * 1.9.0: 경고를 에러로 격상

### 애노테이션 파라미터 타입의 순환 참조 금지

> **이슈**: [KT-47932](https://youtrack.jetbrains.com/issue/KT-47932)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.9에서는 애노테이션의 타입이 해당 애노테이션의 파라미터 타입 중 하나로 직접적 또는 간접적으로 사용되는 것을 금지합니다. 이는 순환 참조가 생성되는 것을 방지합니다.
> 다만, 해당 애노테이션 타입의 `Array` 또는 `vararg`인 파라미터 타입은 허용됩니다.
>
> **사용 중단 주기**:
> * 1.7.0: 애노테이션 파라미터 타입의 순환 참조에 대해 경고 보고 (또는 프로그레시브 모드에서 에러 보고)
> * 1.9.0: 경고를 에러로 격상, `-XXLanguage:-ProhibitCyclesInAnnotations`를 사용하여 임시로 1.9 이전 동작으로 되돌릴 수 있음

### 파라미터가 없는 함수 타입에 @ExtensionFunctionType 애노테이션 사용 금지

> **이슈**: [KT-43527](https://youtrack.jetbrains.com/issue/KT-43527)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.9에서는 파라미터가 없는 함수 타입이나 함수 타입이 아닌 타입에 `@ExtensionFunctionType` 애노테이션을 사용하는 것을 금지합니다.
>
> **사용 중단 주기**:
> * 1.7.0: 함수 타입이 아닌 타입에 대한 애노테이션은 경고 보고, 함수 타입**인** 타입에 대한 애노테이션은 에러 보고
> * 1.9.0: 함수 타입에 대한 경고를 에러로 격상

### 할당 시 Java 필드 타입 불일치 금지

> **이슈**: [KT-48994](https://youtrack.jetbrains.com/issue/KT-48994)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.9에서는 Java 필드에 할당된 값의 타입이 Java 필드의 프로젝션된 타입(projected type)과 일치하지 않는 것을 감지하면 컴파일러 에러를 보고합니다.
>
> **사용 중단 주기**:
> * 1.6.0: 프로젝션된 Java 필드 타입이 할당된 값의 타입과 일치하지 않을 때 경고 보고 (또는 프로그레시브 모드에서 에러 보고)
> * 1.9.0: 경고를 에러로 격상, `-XXLanguage:-RefineTypeCheckingOnAssignmentsToJavaFields`를 사용하여 임시로 1.9 이전 동작으로 되돌릴 수 있음

### 플랫폼 타입의 null 허용 여부 단언 예외 시 소스 코드 발췌문 제외

> **이슈**: [KT-57570](https://youtrack.jetbrains.com/issue/KT-57570)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Kotlin 1.9에서는 식(expression)의 null 체크로 인한 예외 메시지에 소스 코드 발췌문이 포함되지 않습니다. 대신 메서드나 필드의 이름이 표시됩니다.
> 식이 메서드나 필드가 아닌 경우 메시지에 추가 정보가 제공되지 않습니다.
>
> **사용 중단 주기**:
>  * < 1.9.0: 식의 null 체크에 의해 생성된 예외 메시지에 소스 코드 발췌문이 포함됨
>  * 1.9.0: 식의 null 체크에 의해 생성된 예외 메시지에 메서드 또는 필드 이름만 포함됨, `-XXLanguage:-NoSourceCodeInNotNullAssertionExceptions`를 사용하여 임시로 1.9 이전 동작으로 되돌릴 수 있음

### 추상 상위 클래스 멤버로의 super 호출 위임 금지

> **이슈**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
> 
> **요약**: Kotlin은 상위 인터페이스에 기본 구현이 있더라도 명시적 또는 암시적 super 호출이 상위 클래스의 _추상(abstract)_ 멤버로 위임될 경우 컴파일 에러를 보고합니다.
>
> **사용 중단 주기**:
>
> - 1.5.20: 모든 추상 멤버를 오버라이드하지 않은 비추상 클래스가 사용될 때 경고 도입
> - 1.7.0: super 호출이 실제로 상위 클래스의 추상 멤버에 접근하는 경우 경고 보고
> - 1.7.0: `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 호환 모드가 활성화된 경우 영향을 받는 모든 사례에서 에러 보고, 프로그레시브 모드에서 에러 보고
> - 1.8.0: 상위 클래스로부터 오버라이드되지 않은 추상 메서드를 가진 구체 클래스를 선언하는 경우 및 `Any` 메서드의 super 호출이 상위 클래스에서 추상으로 오버라이드된 경우 에러 보고
> - 1.9.0: 상위 클래스의 추상 메서드에 대한 명시적 super 호출을 포함하여 영향을 받는 모든 사례에서 에러 보고

### 대상(subject)이 있는 when의 혼란스러운 문법 사용 중단

> **이슈**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.6에서는 `when` 조건식에서 몇 가지 혼란스러운 문법 구조를 사용 중단(deprecate)했습니다.
>
> **사용 중단 주기**:
>
> - 1.6.20: 영향을 받는 식에 대해 사용 중단 경고 도입
> - 1.8.0: 이 경고를 에러로 격상, `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches`를 사용하여 임시로 1.8 이전 동작으로 되돌릴 수 있음
> - &gt;= 2.1: 사용 중단된 일부 구조를 새로운 언어 기능을 위해 재사용

### 서로 다른 숫자 타입 간의 암시적 강제 변환 방지

> **이슈**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Kotlin은 의미론적으로 해당 타입으로의 다운캐스트(downcast)만 필요한 곳에서 숫자 값을 원시 숫자 타입으로 자동 변환하는 것을 피할 것입니다.
>
> **사용 중단 주기**:
>
> - < 1.5.30: 영향을 받는 모든 사례에서 기존 동작 유지
> - 1.5.30: 생성된 프로퍼티 위임 접근자(delegate accessors)에서의 다운캐스트 동작 수정, `-Xuse-old-backend`를 사용하여 임시로 1.5.30 수정 전 동작으로 되돌릴 수 있음
> - &gt;= 2.0: 영향을 받는 다른 사례에서의 다운캐스트 동작 수정

### 제네릭 타입 별칭 사용 시 상한 위반 금지 (타입 별칭의 타입 파라미터가 별칭 대상 타입의 타입 인자의 제네릭 타입 인자로 사용되는 경우)

> **이슈**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin은 타입 별칭의 타입 파라미터가 별칭 대상 타입의 타입 인자의 제네릭 타입 인자로 사용되는 경우(예: `typealias Alias<T> = Base<List<T>>`), 해당 타입 별칭의 타입 인자가 별칭 대상 타입의 해당 타입 파라미터의 상한(upper bound) 제약을 위반하는 사용을 금지합니다.
>
> **사용 중단 주기**:
>
> - 1.8.0: 제네릭 타입 별칭 사용 시 타입 인자가 별칭 대상 타입의 해당 타입 파라미터의 상한 제약을 위반하는 경우 경고 보고
> - 2.0.0: 경고를 에러로 격상

### 공개 시그니처에서 로컬 타입을 추론할 때 null 허용 여부 유지

> **이슈**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스, 바이너리
>
> **요약**: 반환 타입이 명시적으로 지정되지 않은 식 본문 함수(expression-body function)에서 로컬 또는 익명 타입이 반환될 때, Kotlin 컴파일러는 해당 타입의 알려진 상위 타입을 사용하여 반환 타입을 추론(또는 근사화)합니다. 이 과정에서 컴파일러가 실제로 null 값이 반환될 수 있는 상황에서 null을 허용하지 않는 타입으로 추론할 수 있었습니다.
>
> **사용 중단 주기**:
>
> - 1.8.0: 유연한 타입(flexible types)을 유연한 상위 타입으로 근사화
> - 1.8.0: 선언이 null을 허용해야 함에도 null을 허용하지 않는 타입으로 추론될 때 경고를 보고하고, 사용자에게 타입을 명시적으로 지정하도록 권고
> - 2.0.0: null 허용 타입을 null 허용 상위 타입으로 근사화, `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType`을 사용하여 임시로 2.0 이전 동작으로 되돌릴 수 있음

### 오버라이드를 통한 사용 중단(deprecation) 전파 중단

> **이슈**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 더 이상 상위 클래스의 사용 중단된(deprecated) 멤버로부터 하위 클래스의 오버라이딩 멤버로 사용 중단 상태를 전파하지 않습니다. 이를 통해 상위 클래스의 멤버는 사용 중단하면서 하위 클래스에서는 사용 중단되지 않은 상태로 유지할 수 있는 명시적인 메커니즘을 제공합니다.
>
> **사용 중단 주기**:
>
> - 1.6.20: 향후 동작 변경 메시지와 함께 이 경고를 무시하거나 사용 중단된 멤버의 오버라이드에 명시적으로 `@Deprecated` 애노테이션을 작성하라는 경고 보고
> - 1.9.0: 오버라이드된 멤버로의 사용 중단 상태 전파 중단. 이 변경 사항은 프로그레시브 모드에서도 즉시 적용됨

### 애노테이션 클래스의 파라미터 선언 외에 컬렉션 리터럴 사용 금지

> **이슈**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin은 애노테이션 클래스의 파라미터에 배열을 전달하거나 이 파라미터의 기본값을 지정하는 제한된 방식으로만 컬렉션 리터럴 사용을 허용합니다.
> 하지만 그 외에도 Kotlin은 애노테이션 클래스 내부의 어느 곳에서나(예: 중첩된 객체 내) 컬렉션 리터럴 사용을 허용하고 있었습니다. Kotlin 1.9는 파라미터의 기본값을 제외하고 애노테이션 클래스의 어느 곳에서도 컬렉션 리터럴 사용을 금지합니다.
>
> **사용 중단 주기**:
>
> - 1.7.0: 애노테이션 클래스의 중첩된 객체 내 배열 리터럴에 대해 경고 보고 (또는 프로그레시브 모드에서 에러 보고)
> - 1.9.0: 경고를 에러로 격상

### 기본값 식에서 파라미터의 전방 참조(forward referencing) 금지

> **이슈**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 다른 파라미터의 기본값 식에서 파라미터를 전방 참조하는 것을 금지합니다. 이는 파라미터가 기본값 식에서 액세스될 때, 해당 파라미터가 이미 함수에 전달된 값이거나 자체 기본값 식에 의해 초기화된 값을 가지고 있음을 보장합니다.
>
> **사용 중단 주기**:
>
> - 1.7.0: 기본값이 있는 파라미터가 자신보다 앞에 오는 다른 파라미터의 기본값에서 참조될 때 경고 보고 (또는 프로그레시브 모드에서 에러 보고)
> - 1.9.0: 경고를 에러로 격상, `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments`를 사용하여 임시로 1.9 이전 동작으로 되돌릴 수 있음

### 인라인 함수 파라미터에 대한 확장 호출 금지

> **이슈**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin은 인라인 함수 파라미터를 다른 인라인 함수의 수신객체(receiver)로 전달하는 것을 허용했지만, 이러한 코드를 컴파일할 때 항상 컴파일러 예외가 발생했습니다.
> Kotlin 1.9는 이를 금지하여 컴파일러 크래시 대신 에러를 보고합니다.
>
> **사용 중단 주기**:
>
> - 1.7.20: 인라인 함수 파라미터에 대한 인라인 확장 호출에 대해 경고 보고 (또는 프로그레시브 모드에서 에러 보고)
> - 1.9.0: 경고를 에러로 격상

### 익명 함수 인자를 가진 suspend라는 이름의 중위(infix) 함수 호출 금지

> **이슈**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 익명 함수 리터럴로 전달된 함수형 타입의 단일 인자를 가진 `suspend`라는 이름의 중위 함수 호출을 더 이상 허용하지 않습니다.
>
> **사용 중단 주기**:
>
> - 1.7.20: 익명 함수 리터럴을 사용한 suspend 중위 호출에 대해 경고 보고
> - 1.9.0: 경고를 에러로 격상, `-XXLanguage:-ModifierNonBuiltinSuspendFunError`를 사용하여 임시로 1.9 이전 동작으로 되돌릴 수 있음
> - TODO: 파서가 `suspend fun` 토큰 시퀀스를 해석하는 방식 변경

### 내부 클래스에서 캡처된 타입 파라미터를 가변성(variance)에 어긋나게 사용하는 것 금지

> **이슈**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 `in` 또는 `out` 가변성을 가진 외부 클래스의 타입 파라미터를 내부 클래스에서 해당 타입 파라미터의 선언된 가변성을 위반하는 위치에 사용하는 것을 금지합니다.
>
> **사용 중단 주기**:
>
> - 1.7.0: 외부 클래스의 타입 파라미터 사용 위치가 해당 파라미터의 가변성 규칙을 위반할 때 경고 보고 (또는 프로그레시브 모드에서 에러 보고)
> - 1.9.0: 경고를 에러로 격상, `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments`를 사용하여 임시로 1.9 이전 동작으로 되돌릴 수 있음

### 복합 할당 연산자에서 명시적 반환 타입이 없는 함수의 재귀 호출 금지

> **이슈**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 함수 본문 내부의 다른 식에서와 마찬가지로, 해당 함수 본문 내의 복합 할당 연산자 인자에서 명시적으로 반환 타입이 지정되지 않은 함수를 호출하는 것을 금지합니다.
>
> **사용 중단 주기**:
>
> - 1.7.0: 명시적으로 반환 타입이 지정되지 않은 함수가 해당 함수 본문의 복합 할당 연산자 인자에서 재귀적으로 호출될 때 경고 보고 (또는 프로그레시브 모드에서 에러 보고)
> - 1.9.0: 경고를 에러로 격상

### null 허용 경계가 있는 Kotlin 제네릭 파라미터가 제공되고 @NotNull T가 기대되는 비안전(unsound) 호출 금지

> **이슈**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 Java 메서드의 `@NotNull`이 붙은 파라미터에 null일 가능성이 있는 제네릭 타입의 값이 전달되는 메서드 호출을 금지합니다.
>
> **사용 중단 주기**:
>
> - 1.5.20: null을 허용하지 않는 타입이 기대되는 곳에 제약이 없는 제네릭 타입 파라미터가 전달될 때 경고 보고
> - 1.9.0: 위의 경고 대신 타입 불일치(type mismatch) 에러 보고, `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated`를 사용하여 임시로 1.8 이전 동작으로 되돌릴 수 있음

### 열거형 항목 초기화 식에서 해당 열거형 클래스의 동반 객체(companion object) 멤버 접근 금지

> **이슈**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 열거형 항목(enum entry) 초기화 식에서 열거형의 동반 객체에 대한 모든 종류의 접근을 금지합니다.
>
> **사용 중단 주기**:
>
> - 1.6.20: 그러한 동반 객체 멤버 접근에 대해 경고 보고 (또는 프로그레시브 모드에서 에러 보고)
> - 1.9.0: 경고를 에러로 격상, `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall`을 사용하여 임시로 1.8 이전 동작으로 되돌릴 수 있음

### Enum.declaringClass 합성 프로퍼티 사용 중단 및 제거

> **이슈**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin은 기반 Java 클래스인 `java.lang.Enum`의 `getDeclaringClass()` 메서드에서 생성된 합성 프로퍼티 `declaringClass`를 Kotlin `Enum` 값에서 사용하는 것을 허용해 왔으나, 이 메서드는 Kotlin `Enum` 타입에서 사용할 수 없습니다. Kotlin 1.9는 이 프로퍼티의 사용을 금지하며, 대신 확장 프로퍼티인 `declaringJavaClass`로 마이그레이션할 것을 권고합니다.
>
> **사용 중단 주기**:
>
> - 1.7.0: `declaringClass` 프로퍼티 사용 시 경고 보고 (또는 프로그레시브 모드에서 에러 보고), `declaringJavaClass` 확장으로의 마이그레이션 제안
> - 1.9.0: 경고를 에러로 격상, `-XXLanguage:-ProhibitEnumDeclaringClass`를 사용하여 임시로 1.9 이전 동작으로 되돌릴 수 있음
> - 2.0.0: `declaringClass` 합성 프로퍼티 제거

### 컴파일러 옵션 -Xjvm-default의 enable 및 compatibility 모드 사용 중단

> **이슈**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329), [KT-54746](https://youtrack.jetbrains.com/issue/KT-54746)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.9는 `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드 사용을 금지합니다.
>
> **사용 중단 주기**:
>
> - 1.6.20: `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드에 대해 경고 도입
> - 1.9.0: 이 경고를 에러로 격상

### 빌더 추론 컨텍스트에서 타입 변수가 상한으로 암시적 추론되는 것 금지

> **이슈**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 2.0은 빌더 추론 람다 함수의 범위 내에 사용 지점(use-site) 타입 정보가 없는 경우, 현재 다른 컨텍스트에서와 마찬가지로 타입 변수가 해당 타입 파라미터의 상한으로 추론되는 것을 금지합니다.
>
> **사용 중단 주기**:
>
> - 1.7.20: 사용 지점 타입 정보가 없는 상황에서 타입 파라미터가 선언된 상한으로 추론될 때 경고 보고 (또는 프로그레시브 모드에서 에러 보고)
> - 2.0.0: 경고를 에러로 격상

## 표준 라이브러리

### Range/Progression이 Collection을 구현함에 따라 발생할 수 있는 오버로드 해소(overload resolution) 변경 경고

> **이슈**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **컴포넌트**: 코어 언어 / kotlin-stdlib
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.9에서는 표준 Progression과 여기서 상속된 구체적인 Range에 `Collection` 인터페이스를 구현할 계획입니다. 이로 인해 특정 메서드의 오버로드가 두 개(하나의 요소를 받는 오버로드와 컬렉션을 받는 오버로드) 있을 경우, 오버로드 해소 과정에서 다른 오버로드가 선택될 수 있습니다. Kotlin은 이러한 오버로드된 메서드가 range나 progression 인자로 호출될 때 경고나 에러를 보고하여 이 상황을 가시화할 것입니다.
>
> **사용 중단 주기**:
>
> - 1.6.20: 표준 progression이나 그 range 상속자가 인자로 전달되어 오버로드된 메서드가 호출될 때, 향후 이 progression/range가 `Collection` 인터페이스를 구현함에 따라 다른 오버로드가 선택될 가능성이 있는 경우 경고 보고
> - 1.8.0: 이 경고를 에러로 격상
> - 2.1.0: 에러 보고를 중단하고 progression에 `Collection` 인터페이스를 구현하여, 영향을 받는 사례에서 오버로드 해소 결과를 변경

### kotlin.dom 및 kotlin.browser 패키지의 선언을 kotlinx.*로 마이그레이션

> **이슈**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **컴포넌트**: kotlin-stdlib (JS)
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `kotlin.dom` 및 `kotlin.browser` 패키지의 선언들이 stdlib에서 분리될 준비를 위해 해당 `kotlinx.*` 패키지로 이동되었습니다.
>
> **사용 중단 주기**:
>
> - 1.4.0: `kotlinx.dom` 및 `kotlinx.browser` 패키지에 대체 API 도입
> - 1.4.0: `kotlin.dom` 및 `kotlin.browser` 패키지의 API를 사용 중단하고 위의 새 API를 대체제로 제안
> - 1.6.0: 사용 중단 수준을 에러로 격상
> - 1.8.20: JS-IR 타겟의 stdlib에서 사용 중단된 함수 제거
> - &gt;= 2.0: kotlinx.* 패키지의 API를 별도의 라이브러리로 이동

### 일부 JS 전용 API 사용 중단

> **이슈**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **컴포넌트**: kotlin-stdlib (JS)
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: stdlib의 다수 JS 전용 함수들이 제거를 위해 사용 중단되었습니다. 여기에는 `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)`, 그리고 비교 함수를 받는 배열의 `sort` 함수(예: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`)가 포함됩니다.
>
> **사용 중단 주기**:
>
> - 1.6.0: 영향을 받는 함수들에 대해 경고와 함께 사용 중단
> - 1.9.0: 사용 중단 수준을 에러로 격상
> - &gt;=2.0: 공개 API에서 사용 중단된 함수 제거

## 도구

### Gradle 설정에서 enableEndorsedLibs 플래그 제거

> **이슈**: [KT-54098](https://youtrack.jetbrains.com/issue/KT-54098)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Gradle 설정에서 `enableEndorsedLibs` 플래그는 더 이상 지원되지 않습니다.
>
> **사용 중단 주기**:
>
> - < 1.9.0: Gradle 설정에서 `enableEndorsedLibs` 플래그가 지원됨
> - 1.9.0: Gradle 설정에서 `enableEndorsedLibs` 플래그가 지원되지 **않음**

### Gradle 컨벤션 제거

> **이슈**: [KT-52976](https://youtrack.jetbrains.com/issue/KT-52976)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Gradle 컨벤션(conventions)은 Gradle 7.1에서 사용 중단되었으며 Gradle 8에서 제거되었습니다.
>
> **사용 중단 주기**:
>
> - 1.7.20: Gradle 컨벤션 사용 중단
> - 1.9.0: Gradle 컨벤션 제거

### KotlinCompile 태스크의 classpath 프로퍼티 제거

> **이슈**: [KT-53748](https://youtrack.jetbrains.com/issue/KT-53748)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `KotlinCompile` 태스크의 `classpath` 프로퍼티가 제거되었습니다.
>
> **사용 중단 주기**:
>
> - 1.7.0: `classpath` 프로퍼티 사용 중단
> - 1.8.0: 사용 중단 수준을 에러로 격상
> - 1.9.0: 공개 API에서 사용 중단된 함수 제거

### kotlin.internal.single.build.metrics.file 프로퍼티 사용 중단

> **이슈**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 빌드 보고서를 위한 단일 파일을 정의하는 데 사용되는 `kotlin.internal.single.build.metrics.file` 프로퍼티를 사용 중단합니다.
> 대신 `kotlin.build.report.output=single_file`과 함께 `kotlin.build.report.single_file` 프로퍼티를 사용하세요.
>
> **사용 중단 주기**:
>
> * 1.8.0: 사용 중단 수준을 경고로 격상
> * &gt;= 1.9: 프로퍼티 삭제