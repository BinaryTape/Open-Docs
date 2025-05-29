[//]: # (title: Kotlin 1.9 호환성 가이드)

_[언어 현대성 유지](kotlin-evolution-principles.md)_ 및 _[편리한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 기본 원칙 중 하나입니다. 전자는 언어 진화를 방해하는 구성 요소는 제거되어야 한다고 말하며, 후자는 이러한 제거가 코드 마이그레이션을 최대한 원활하게 진행하기 위해 사전에 잘 전달되어야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 Kotlin 1.8에서 Kotlin 1.9로의 마이그레이션을 위한 완전한 참조 자료를 제공하며 모든 변경 사항을 요약합니다.

## 기본 용어

이 문서에서는 몇 가지 유형의 호환성을 소개합니다:

- _소스_: 소스 비호환성 변경은 이전에는 (오류나 경고 없이) 잘 컴파일되던 코드가 더 이상 컴파일되지 않도록 합니다.
- _바이너리_: 두 바이너리 아티팩트(artifact)를 상호 교환할 때 로딩(loading) 또는 링크(linkage) 오류가 발생하지 않으면 바이너리 호환성이 있다고 말합니다.
- _동작_: 동일한 프로그램이 변경 사항을 적용하기 전과 후에 다른 동작을 보인다면 동작 비호환성 변경이라고 말합니다.

이러한 정의는 순수 Kotlin에만 적용된다는 점을 기억하세요. 다른 언어 관점(예: Java)에서의 Kotlin 코드 호환성은 이 문서의 범위를 벗어납니다.

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

### 언어 버전 1.3 제거

> **Issue**: [KT-61111](https://youtrack.jetbrains.com/issue/KT-61111/Remove-language-version-1.3)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9는 언어 버전 1.9를 도입하고 언어 버전 1.3에 대한 지원을 제거합니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 경고 보고
> - 1.9.0: 경고를 오류로 격상

### 슈퍼 인터페이스 유형이 함수 리터럴일 때 슈퍼 생성자 호출 금지

> **Issue**: [KT-46344](https://youtrack.jetbrains.com/issue/KT-46344)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 인터페이스가 함수 리터럴 유형을 상속하는 경우, Kotlin 1.9는 해당 생성자가 존재하지 않으므로 슈퍼 생성자 호출을 금지합니다.
>
> **Deprecation cycle**:
> * 1.7.0: 경고 보고 (또는 프로그레시브 모드에서는 오류)
> * 1.9.0: 경고를 오류로 격상

### 어노테이션 파라미터 유형의 순환 금지

> **Issue**: [KT-47932](https://youtrack.jetbrains.com/issue/KT-47932)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9는 어노테이션의 유형이 직간접적으로 자체 파라미터 유형 중 하나로 사용되는 것을 금지합니다. 이는 순환(cycle)이 생성되는 것을 방지합니다.
> 하지만 어노테이션 유형의 `Array` 또는 `vararg`인 파라미터 유형은 허용됩니다.
>
> **Deprecation cycle**:
> * 1.7.0: 어노테이션 파라미터 유형의 순환에 대해 경고 보고 (또는 프로그레시브 모드에서는 오류)
> * 1.9.0: 경고를 오류로 격상, `-XXLanguage:-ProhibitCyclesInAnnotations`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.

### 파라미터가 없는 함수 유형에 @ExtensionFunctionType 어노테이션 사용 금지

> **Issue**: [KT-43527](https://youtrack.jetbrains.com/issue/KT-43527)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9는 파라미터가 없는 함수 유형 또는 함수 유형이 아닌 유형에 `@ExtensionFunctionType` 어노테이션을 사용하는 것을 금지합니다.
>
> **Deprecation cycle**:
> * 1.7.0: 함수 유형이 아닌 유형에 대한 어노테이션에 대해 경고 보고, 함수 유형인 유형에 대한 어노테이션에 대해 오류 보고
> * 1.9.0: 함수 유형에 대한 경고를 오류로 격상

### 할당 시 Java 필드 유형 불일치 금지

> **Issue**: [KT-48994](https://youtrack.jetbrains.com/issue/KT-48994)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9는 Java 필드에 할당된 값의 유형이 해당 Java 필드의 예측 유형과 일치하지 않는 경우 컴파일러 오류를 보고합니다.
>
> **Deprecation cycle**:
> * 1.6.0: 예측된 Java 필드 유형이 할당된 값 유형과 일치하지 않을 때 경고 보고 (또는 프로그레시브 모드에서는 오류)
> * 1.9.0: 경고를 오류로 격상, `-XXLanguage:-RefineTypeCheckingOnAssignmentsToJavaFields`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.

### 플랫폼 유형 널러블 어설션 예외에 소스 코드 발췌 없음

> **Issue**: [KT-57570](https://youtrack.jetbrains.com/issue/KT-57570)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.9에서는 표현식 널(null) 검사에 대한 예외 메시지에 소스 코드 발췌가 포함되지 않습니다. 대신, 메서드 또는 필드의 이름이 표시됩니다.
> 표현식이 메서드나 필드가 아닌 경우, 메시지에 추가 정보가 제공되지 않습니다.
>
> **Deprecation cycle**:
> * < 1.9.0: 표현식 널 검사에 의해 생성된 예외 메시지에 소스 코드 발췌 포함
> * 1.9.0: 표현식 널 검사에 의해 생성된 예외 메시지에 메서드 또는 필드 이름만 포함, `-XXLanguage:-NoSourceCodeInNotNullAssertionExceptions`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.

### 슈퍼클래스 추상 멤버에 대한 슈퍼 호출 위임 금지

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin은 슈퍼클래스의 _추상_ 멤버에 명시적 또는 암시적 슈퍼 호출이 위임될 때 컴파일 오류를 보고합니다. 심지어 슈퍼 인터페이스에 기본 구현이 있더라도 마찬가지입니다.
>
> **Deprecation cycle**:
>
> - 1.5.20: 모든 추상 멤버를 오버라이드하지 않는 비추상 클래스가 사용될 때 경고 도입
> - 1.7.0: 슈퍼 호출이 실제로 슈퍼클래스의 추상 멤버에 접근하는 경우 경고 보고
> - 1.7.0: `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 호환성 모드가 활성화된 경우 모든 해당 사례에서 오류 보고; 프로그레시브 모드에서는 오류 보고
> - 1.8.0: 슈퍼클래스의 오버라이드되지 않은 추상 메서드를 가진 구체 클래스를 선언하는 경우 및 `Any` 메서드에 대한 슈퍼 호출이 슈퍼클래스에서 추상으로 오버라이드되는 경우 오류 보고
> - 1.9.0: 슈퍼클래스의 추상 메서드에 대한 명시적 슈퍼 호출을 포함하여 모든 해당 사례에서 오류 보고

### when-with-subject의 혼란스러운 문법 사용 중단

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6은 `when` 조건 표현식에서 여러 혼란스러운 문법 구문을 사용 중단했습니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 영향을 받는 표현식에 대해 사용 중단 경고 도입
> - 1.8.0: 이 경고를 오류로 격상, `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.
> - &gt;= 2.1: 일부 사용 중단된 구문을 새로운 언어 기능을 위해 재활용

### 다른 숫자 유형 간의 암시적 강제 변환 방지

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin은 의미적으로 해당 유형으로의 다운캐스트만 필요한 경우, 숫자 값을 자동으로 기본 숫자 유형으로 변환하는 것을 피할 것입니다.
>
> **Deprecation cycle**:
>
> - < 1.5.30: 모든 해당 사례에서 이전 동작
> - 1.5.30: 생성된 프로퍼티 델리게이트 접근자에서 다운캐스트 동작 수정, `-Xuse-old-backend`를 사용하여 일시적으로 1.5.30 이전 수정 동작으로 되돌릴 수 있습니다.
> - &gt;= 2.0: 다른 해당 사례에서 다운캐스트 동작 수정

### 제네릭 타입 별칭 사용 시 상한 위반 금지 (별칭 유형의 타입 인수의 제네릭 타입 인수에 사용된 타입 파라미터)

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin은 타입 별칭 타입 파라미터가 별칭된 타입의 타입 인수의 제네릭 타입 인수로 사용되는 경우 (예: `typealias Alias<T> = Base<List<T>>`), 타입 별칭의 해당 타입 파라미터의 상한 제약을 위반하는 타입 인수를 가진 타입 별칭 사용을 금지할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.8.0: 제네릭 타입 별칭 사용이 별칭된 타입의 해당 타입 파라미터의 상한 제약을 위반하는 타입 인수를 가질 때 경고 보고
> - 2.0.0: 경고를 오류로 격상

### 퍼블릭 시그니처에서 지역 유형 근사화 시 널러블성 유지

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source, binary
>
> **Short summary**: 명시적으로 지정된 반환 유형 없이 표현식 본문 함수에서 지역 또는 익명 유형이 반환될 때, Kotlin 컴파일러는 해당 유형의 알려진 슈퍼타입을 사용하여 반환 유형을 추론(또는 근사화)합니다.
> 이 과정에서 컴파일러는 실제로는 널(null) 값이 반환될 수 있는 상황에서 널러블(nullable)하지 않은 유형을 추론할 수 있습니다.
>
> **Deprecation cycle**:
>
> - 1.8.0: 유연한 슈퍼타입으로 유연한 타입 근사화
> - 1.8.0: 선언이 널러블이어야 하지만 널러블하지 않은 유형으로 추론될 때 경고 보고, 사용자에게 유형을 명시적으로 지정하도록 유도
> - 2.0.0: 널러블 슈퍼타입으로 널러블 타입 근사화, `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType`를 사용하여 일시적으로 2.0 이전 동작으로 되돌릴 수 있습니다.

### 오버라이드를 통한 사용 중단 전파 금지

> **Issue**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9는 더 이상 슈퍼클래스의 사용 중단된 멤버에서 서브클래스의 해당 오버라이딩 멤버로 사용 중단 상태를 전파하지 않을 것입니다. 이는 슈퍼클래스의 멤버를 사용 중단하면서도 서브클래스에서는 사용 중단되지 않은 상태로 유지하는 명시적인 메커니즘을 제공합니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 향후 동작 변경 메시지와 함께 경고를 보고하고, 이 경고를 억제하거나 사용 중단된 멤버의 오버라이드에 `@Deprecated` 어노테이션을 명시적으로 작성하도록 유도
> - 1.9.0: 오버라이드된 멤버로 사용 중단 상태 전파 중단. 이 변경 사항은 프로그레시브 모드에서도 즉시 적용됩니다.

### 어노테이션 클래스에서 파라미터 선언을 제외한 모든 곳에서 컬렉션 리터럴 사용 금지

> **Issue**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin은 어노테이션 클래스의 파라미터에 배열을 전달하거나 이 파라미터의 기본값을 지정하는 제한적인 방식으로 컬렉션 리터럴을 사용하는 것을 허용합니다.
> 하지만 그 외에도 Kotlin은 어노테이션 클래스 내부의 다른 모든 곳, 예를 들어 중첩 객체에서도 컬렉션 리터럴 사용을 허용했습니다. Kotlin 1.9는 어노테이션 클래스의 파라미터 기본값을 제외한 모든 곳에서 컬렉션 리터럴 사용을 금지할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: 어노테이션 클래스의 중첩 객체에 있는 배열 리터럴에 대해 경고 보고 (또는 프로그레시브 모드에서는 오류)
> - 1.9.0: 경고를 오류로 격상

### 기본값 표현식에서 파라미터의 전방 참조 금지

> **Issue**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9는 다른 파라미터의 기본값 표현식에서 파라미터의 전방 참조를 금지할 것입니다. 이는 파라미터가 기본값 표현식에서 접근될 때쯤에는 함수에 전달되었거나 자체 기본값 표현식에 의해 초기화된 값이 이미 존재하도록 보장합니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: 기본값을 가진 파라미터가 그 앞에 오는 다른 파라미터의 기본값에서 참조될 때 경고 보고 (또는 프로그레시브 모드에서는 오류)
> - 1.9.0: 경고를 오류로 격상, `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.

### 인라인 함수 파라미터에 대한 확장 호출 금지

> **Issue**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin은 인라인 함수 파라미터를 다른 인라인 함수에 리시버로 전달하는 것을 허용했지만, 그러한 코드를 컴파일할 때 항상 컴파일러 예외를 발생시켰습니다.
> Kotlin 1.9는 이를 금지하여, 컴파일러 충돌 대신 오류를 보고할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.7.20: 인라인 함수 파라미터에 대한 인라인 확장 호출에 대해 경고 보고 (또는 프로그레시브 모드에서는 오류)
> - 1.9.0: 경고를 오류로 격상

### 익명 함수 인수를 가진 suspend 이름의 중위 함수 호출 금지

> **Issue**: [KT-49264](https://youtrack.com/issue/KT-49264)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9는 익명 함수 리터럴로 전달된 함수 유형의 단일 인수를 가진 `suspend`라는 이름의 중위 함수 호출을 더 이상 허용하지 않을 것입니다.
>
> **Deprecation cycle**:
>
> - 1.7.20: 익명 함수 리터럴을 가진 suspend 중위 호출에 대해 경고 보고
> - 1.9.0: 경고를 오류로 격상, `-XXLanguage:-ModifierNonBuiltinSuspendFunError`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.
> - TODO: `suspend fun` 토큰 시퀀스가 파서에 의해 해석되는 방식 변경

### 이너 클래스에서 캡처된 타입 파라미터를 분산에 반하여 사용하는 것을 금지

> **Issue**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9는 외부 클래스의 `in` 또는 `out` 분산을 가진 타입 파라미터를 해당 타입 파라미터의 선언된 분산을 위반하는 위치에서 이너 클래스 내에서 사용하는 것을 금지할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: 외부 클래스의 타입 파라미터 사용 위치가 해당 파라미터의 분산 규칙을 위반할 때 경고 보고 (또는 프로그레시브 모드에서는 오류)
> - 1.9.0: 경고를 오류로 격상, `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.

### 복합 할당 연산자에서 명시적 반환 유형이 없는 함수의 재귀 호출 금지

> **Issue**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9는 함수 본문 내의 복합 할당 연산자 인수에 명시적으로 지정된 반환 유형이 없는 함수를 호출하는 것을 금지할 것입니다. 이는 현재 해당 함수 본문 내의 다른 표현식에서 금지하는 것과 동일합니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: 명시적으로 지정된 반환 유형이 없는 함수가 복합 할당 연산자 인수에 있는 해당 함수 본문 내에서 재귀적으로 호출될 때 경고 보고 (또는 프로그레시브 모드에서는 오류)
> - 1.9.0: 경고를 오류로 격상

### @NotNull T가 예상되고 널러블 바운드를 가진 Kotlin 제네릭 파라미터가 주어진 경우 비건전한 호출 금지

> **Issue**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9는 잠재적으로 널러블(nullable)한 제네릭 유형의 값이 Java 메서드의 `@NotNull` 어노테이션이 붙은 파라미터에 전달되는 메서드 호출을 금지할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.5.20: 널러블하지 않은 유형이 예상되는 곳에 제약 없는 제네릭 유형 파라미터가 전달될 때 경고 보고
> - 1.9.0: 위 경고 대신 유형 불일치 오류 보고, `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated`를 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### 이넘의 엔트리 이니셜라이저에서 이넘 클래스의 컴패니언 멤버 접근 금지

> **Issue**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9는 이넘 엔트리 이니셜라이저에서 이넘의 컴패니언 객체에 대한 모든 종류의 접근을 금지할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 그러한 컴패니언 멤버 접근에 대해 경고 보고 (또는 프로그레시브 모드에서는 오류)
> - 1.9.0: 경고를 오류로 격상, `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall`을 사용하여 일시적으로 1.8 이전 동작으로 되돌릴 수 있습니다.

### Enum.declaringClass 합성 프로퍼티 사용 중단 및 제거

> **Issue**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin은 기본 Java 클래스 `java.lang.Enum`의 `getDeclaringClass()` 메서드에서 생성된 `Enum` 값에 `declaringClass` 합성 프로퍼티를 사용하는 것을 허용했지만, 이 메서드는 Kotlin `Enum` 유형에서는 사용할 수 없습니다. Kotlin 1.9는 이 프로퍼티 사용을 금지하고, 대신 확장 프로퍼티 `declaringJavaClass`로 마이그레이션할 것을 제안할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: `declaringClass` 프로퍼티 사용에 대해 경고 보고 (또는 프로그레시브 모드에서는 오류), `declaringJavaClass` 확장으로의 마이그레이션 제안
> - 1.9.0: 경고를 오류로 격상, `-XXLanguage:-ProhibitEnumDeclaringClass`를 사용하여 일시적으로 1.9 이전 동작으로 되돌릴 수 있습니다.
> - 2.0.0: `declaringClass` 합성 프로퍼티 제거

### 컴파일러 옵션 -Xjvm-default의 enable 및 compatibility 모드 사용 중단

> **Issues**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329), [KT-54746](https://youtrack.jetbrains.com/issue/KT-54746)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9는 `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드 사용을 금지합니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드에 대해 경고 도입
> - 1.9.0: 이 경고를 오류로 격상

### 빌더 추론 컨텍스트에서 타입 변수가 상한으로 암시적으로 추론되는 것을 금지

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.0은 빌더 추론 람다 함수 범위 내에서 사용-사이트(use-site) 유형 정보가 없는 경우, 타입 변수가 해당 타입 파라미터의 상한으로 추론되는 것을 금지할 것입니다. 이는 현재 다른 컨텍스트에서와 동일한 방식입니다.
>
> **Deprecation cycle**:
>
> - 1.7.20: 사용-사이트 유형 정보가 없는 경우 타입 파라미터가 선언된 상한으로 추론될 때 경고 보고 (또는 프로그레시브 모드에서는 오류)
> - 2.0.0: 경고를 오류로 격상

## 표준 라이브러리

### Range/Progression이 Collection을 구현하기 시작할 때 잠재적 오버로드 해상도 변경에 대한 경고

> **Issue**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **Component**: Core language / kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9에서 표준 진행(progression)과 그로부터 상속된 구체적인 범위(range)에 `Collection` 인터페이스를 구현할 계획입니다. 이는 어떤 메서드에 두 가지 오버로드(하나는 요소를 받고 다른 하나는 컬렉션을 받는)가 있을 때 오버로드 해상도에서 다른 오버로드가 선택될 수 있게 합니다. Kotlin은 범위 또는 진행 인수로 그러한 오버로드된 메서드가 호출될 때 경고 또는 오류를 보고하여 이 상황을 가시화할 것입니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 표준 진행 또는 그 범위 상속자로 오버로드된 메서드가 호출될 때 경고 보고 (이 진행/범위에 `Collection` 인터페이스를 구현하는 것이 향후 이 호출에서 다른 오버로드가 선택되도록 하는 경우)
> - 1.8.0: 이 경고를 오류로 격상
> - 2.1.0: 오류 보고 중단, 진행에 `Collection` 인터페이스 구현하여 해당 사례에서 오버로드 해상도 결과 변경

### kotlin.dom 및 kotlin.browser 패키지의 선언을 kotlinx.*로 마이그레이션

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.dom` 및 `kotlin.browser` 패키지의 선언이 표준 라이브러리(stdlib)에서 추출될 준비를 위해 해당 `kotlinx.*` 패키지로 이동됩니다.
>
> **Deprecation cycle**:
>
> - 1.4.0: `kotlinx.dom` 및 `kotlinx.browser` 패키지에 대체 API 도입
> - 1.4.0: `kotlin.dom` 및 `kotlin.browser` 패키지의 API 사용 중단 및 위 새 API를 대체제로 제안
> - 1.6.0: 사용 중단 수준을 오류로 격상
> - 1.8.20: JS-IR 타겟용 표준 라이브러리에서 사용 중단된 함수 제거
> - &gt;= 2.0: kotlinx.* 패키지의 API를 별도 라이브러리로 이동

### 일부 JS 전용 API 사용 중단

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: 표준 라이브러리(stdlib)의 여러 JS 전용 함수가 제거를 위해 사용 중단됩니다. 여기에는 `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)` 및 비교 함수를 인수로 받는 배열의 `sort` 함수(예: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`)가 포함됩니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 영향을 받는 함수들을 경고와 함께 사용 중단
> - 1.9.0: 사용 중단 수준을 오류로 격상
> - &gt;=2.0: 퍼블릭 API에서 사용 중단된 함수 제거

## 도구

### Gradle 설정에서 enableEndorsedLibs 플래그 제거

> **Issue**: [KT-54098](https://youtrack.jetbrains.com/issue/KT-54098)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 이제 `enableEndorsedLibs` 플래그는 Gradle 설정에서 더 이상 지원되지 않습니다.
>
> **Deprecation cycle**:
>
> - < 1.9.0: `enableEndorsedLibs` 플래그는 Gradle 설정에서 지원됨
> - 1.9.0: `enableEndorsedLibs` 플래그는 Gradle 설정에서 **지원되지 않음**

### Gradle 컨벤션 제거

> **Issue**: [KT-52976](https://youtrack.jetbrains.com/issue/KT-52976)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Gradle 컨벤션은 Gradle 7.1에서 사용 중단되었으며 Gradle 8에서 제거되었습니다.
>
> **Deprecation cycle**:
>
> - 1.7.20: Gradle 컨벤션 사용 중단
> - 1.9.0: Gradle 컨벤션 제거

### KotlinCompile 태스크의 classpath 프로퍼티 제거

> **Issue**: [KT-53748](https://youtrack.jetbrains.com/issue/KT-53748)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: KotlinCompile 태스크의 `classpath` 프로퍼티가 제거됩니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: `classpath` 프로퍼티 사용 중단
> - 1.8.0: 사용 중단 수준을 오류로 격상
> - 1.9.0: 퍼블릭 API에서 사용 중단된 프로퍼티 제거

### kotlin.internal.single.build.metrics.file 프로퍼티 사용 중단

> **Issue**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 빌드 보고서에 단일 파일을 정의하는 데 사용되는 `kotlin.internal.single.build.metrics.file` 프로퍼티를 사용 중단합니다.
> 대신 `kotlin.build.report.output=single_file`과 함께 `kotlin.build.report.single_file` 프로퍼티를 사용하세요.
>
> **Deprecation cycle:**
>
> * 1.8.0: 사용 중단 수준을 경고로 격상
> * &gt;= 1.9: 프로퍼티 삭제