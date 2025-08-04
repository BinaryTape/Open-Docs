[//]: # (title: Kotlin 1.6 호환성 가이드)

_[언어 현대화 유지 (Keeping the Language Modern)](kotlin-evolution-principles.md)_ 및 _[편리한 업데이트 (Comfortable Updates)](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 근본적인 원칙 중 하나입니다. 전자는 언어 발전을 방해하는 구성 요소는 제거되어야 한다고 말하며, 후자는 이러한 제거가 코드 마이그레이션을 최대한 원활하게 하기 위해 사전에 충분히 공지되어야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 Kotlin 1.5에서 Kotlin 1.6으로 마이그레이션하기 위한 완전한 참조를 제공하며 모든 변경 사항을 요약합니다.

## 기본 용어

이 문서에서는 몇 가지 호환성 유형을 소개합니다:

-   _소스 (source)_: 소스 비호환성 변경은 이전에 오류나 경고 없이 문제 없이 컴파일되던 코드가 더 이상 컴파일되지 않도록 합니다.
-   _바이너리 (binary)_: 두 바이너리 아티팩트는 상호 교환 시 로딩 또는 링크 오류가 발생하지 않으면 바이너리 호환된다고 합니다.
-   _동작 (behavioral)_: 변경이 적용되기 전과 후에 동일한 프로그램이 다른 동작을 보인다면 해당 변경은 동작 비호환성이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 주어진 것임을 기억하십시오. 다른 언어 관점(예: Java)에서의 Kotlin 코드 호환성은 이 문서의 범위를 벗어납니다.

## 언어

### enum, sealed, Boolean 서브젝트를 사용하는 when 문을 기본적으로 완전하게 만들기

> **문제**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **구성 요소**: 코어 언어
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.6에서는 `enum`, `sealed`, `Boolean` 서브젝트를 사용하는 `when` 문이 불완전한 경우 경고를 표시합니다.
>
> **지원 중단 주기**:
>
> -   1.6.0: `enum`, `sealed`, `Boolean` 서브젝트를 사용하는 `when` 문이 불완전한 경우 경고를 도입합니다 (점진적 모드에서는 오류).
> -   1.7.0: 이 경고를 오류로 격상합니다.

### when-with-subject에서 혼란스러운 문법 사용 중단

> **문제**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **구성 요소**: 코어 언어
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.6에서는 `when` 조건식에서 몇 가지 혼란스러운 문법 구성을 사용 중단합니다.
>
> **지원 중단 주기**:
>
> -   1.6.20: 영향을 받는 표현식에 지원 중단 경고를 도입합니다.
> -   1.8.0: 이 경고를 오류로 격상합니다.
> -   >= 1.8: 일부 사용 중단된 구성 요소를 새 언어 기능으로 용도 변경합니다.

### 컴패니언 및 중첩 객체의 상위 생성자 호출에서 클래스 멤버에 대한 접근 금지

> **문제**: [KT-25289](https://youtrack.com/issue/KT-25289)
>
> **구성 요소**: 코어 언어
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.6에서는 컴패니언 및 일반 객체의 상위 생성자 호출 인수가 포함하는 선언을 참조하는 경우 오류를 보고합니다.
>
> **지원 중단 주기**:
>
> -   1.5.20: 문제성 인수에 경고를 도입합니다.
> -   1.6.0: 이 경고를 오류로 격상합니다.
>   `-XXLanguage:-ProhibitSelfCallsInNestedObjects`를 사용하여 일시적으로 1.6 이전 동작으로 되돌릴 수 있습니다.

### 타입 널 가능성 개선 사항

> **문제**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **구성 요소**: Kotlin/JVM
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.7에서는 Java 코드의 타입 널 가능성 어노테이션을 로드하고 해석하는 방식이 변경됩니다.
>
> **지원 중단 주기**:
>
> -   1.4.30: 더 정밀한 타입 널 가능성이 오류로 이어질 수 있는 경우에 경고를 도입합니다.
> -   1.7.0: Java 타입의 널 가능성을 더 정밀하게 추론합니다.
>   `-XXLanguage:-TypeEnhancementImprovementsInStrictMode`를 사용하여 일시적으로 1.7 이전 동작으로 되돌릴 수 있습니다.

### 서로 다른 숫자 타입 간의 암묵적 강제 변환 금지

> **문제**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **구성 요소**: Kotlin/JVM
>
> **비호환성 변경 유형**: 동작 (behavioral)
>
> **요약**: Kotlin은 의미상 다운캐스트만 필요한 기본 숫자 타입으로 숫자 값을 자동으로 변환하는 것을 피할 것입니다.
>
> **지원 중단 주기**:
>
> -   < 1.5.30: 모든 영향을 받는 경우에서 이전 동작.
> -   1.5.30: 생성된 프로퍼티 델리게이트 접근자에서 다운캐스트 동작을 수정합니다.
>   `-Xuse-old-backend`를 사용하여 일시적으로 1.5.30 수정 이전 동작으로 되돌릴 수 있습니다.
> -   >= 1.6.20: 기타 영향을 받는 경우에서 다운캐스트 동작을 수정합니다.

### 컨테이너 어노테이션이 JLS를 위반하는 반복 가능 어노테이션 클래스 선언 금지

> **문제**: [KT-47928](https://youtrack.jetbrains.com/issue/KT-47928)
>
> **구성 요소**: Kotlin/JVM
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.6에서는 반복 가능 어노테이션의 컨테이너 어노테이션이 [JLS 9.6.3](https://docs.oracle.com/javase/specs/jls/se16/html/jls-9.html#jls-9.6.3)과 동일한 요구 사항(배열 타입 값 메서드, 리텐션, 타겟)을 충족하는지 확인합니다.
>
> **지원 중단 주기**:
>
> -   1.5.30: JLS 요구 사항을 위반하는 반복 가능 컨테이너 어노테이션 선언에 경고를 도입합니다 (점진적 모드에서는 오류).
> -   1.6.0: 이 경고를 오류로 격상합니다.
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints`를 사용하여 일시적으로 오류 보고를 비활성화할 수 있습니다.

### 반복 가능 어노테이션 클래스 내에 Container라는 이름의 중첩 클래스 선언 금지

> **문제**: [KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **구성 요소**: Kotlin/JVM
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.6에서는 Kotlin에서 선언된 반복 가능 어노테이션에 미리 정의된 이름 `Container`를 가진 중첩 클래스가 없는지 확인합니다.
>
> **지원 중단 주기**:
>
> -   1.5.30: Kotlin 반복 가능 어노테이션 클래스 내에 `Container`라는 이름의 중첩 클래스에 경고를 도입합니다 (점진적 모드에서는 오류).
> -   1.6.0: 이 경고를 오류로 격상합니다.
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints`를 사용하여 일시적으로 오류 보고를 비활성화할 수 있습니다.

### 인터페이스 프로퍼티를 오버라이드하는 주 생성자 내 프로퍼티에 @JvmField 사용 금지

> **문제**: [KT-32753](https://youtrack.jetbrains.com/issue/KT-32753)
>
> **구성 요소**: Kotlin/JVM
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.6에서는 인터페이스 프로퍼티를 오버라이드하는 주 생성자 내에 선언된 프로퍼티에 `@JvmField` 어노테이션을 사용하는 것을 금지합니다.
>
> **지원 중단 주기**:
>
> -   1.5.20: 주 생성자 내 해당 프로퍼티에 `@JvmField` 어노테이션 사용 시 경고를 도입합니다.
> -   1.6.0: 이 경고를 오류로 격상합니다.
>   `-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor`를 사용하여 일시적으로 오류 보고를 비활성화할 수 있습니다.

### 컴파일러 옵션 -Xjvm-default의 enable 및 compatibility 모드 사용 중단

> **문제**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **구성 요소**: Kotlin/JVM
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.6.20에서는 `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드 사용에 대해 경고를 표시합니다.
>
> **지원 중단 주기**:
>
> -   1.6.20: `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드에 경고를 도입합니다.
> -   >= 1.8.0: 이 경고를 오류로 격상합니다.

### public-abi 인라인 함수에서의 super 호출 금지

> **문제**: [KT-45379](https://youtrack.jetbrains.com/issue/KT-45379)
>
> **구성 요소**: 코어 언어
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.6에서는 `public` 또는 `protected` 인라인 함수 및 프로퍼티에서 `super` 한정자를 가진 함수를 호출하는 것을 금지합니다.
>
> **지원 중단 주기**:
>
> -   1.5.0: `public` 또는 `protected` 인라인 함수 또는 프로퍼티 접근자에서 `super` 호출 시 경고를 도입합니다.
> -   1.6.0: 이 경고를 오류로 격상합니다.
>   `-XXLanguage:-ProhibitSuperCallsFromPublicInline`을 사용하여 일시적으로 오류 보고를 비활성화할 수 있습니다.

### public 인라인 함수에서의 protected 생성자 호출 금지

> **문제**: [KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **구성 요소**: 코어 언어
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.6에서는 `public` 또는 `protected` 인라인 함수 및 프로퍼티에서 `protected` 생성자를 호출하는 것을 금지합니다.
>
> **지원 중단 주기**:
>
> -   1.4.30: `public` 또는 `protected` 인라인 함수 또는 프로퍼티 접근자에서 `protected` 생성자 호출 시 경고를 도입합니다.
> -   1.6.0: 이 경고를 오류로 격상합니다.
>   `-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline`을 사용하여 일시적으로 오류 보고를 비활성화할 수 있습니다.

### 파일 내 private 타입에서 private 중첩 타입 노출 금지

> **문제**: [KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **구성 요소**: 코어 언어
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.6에서는 파일 내 `private` 타입에서 `private` 중첩 타입 및 내부 클래스를 노출하는 것을 금지합니다.
>
> **지원 중단 주기**:
>
> -   1.5.0: 파일 내 `private` 타입에서 노출되는 `private` 타입에 경고를 도입합니다.
> -   1.6.0: 이 경고를 오류로 격상합니다.
>   `-XXLanguage:-PrivateInFileEffectiveVisibility`를 사용하여 일시적으로 오류 보고를 비활성화할 수 있습니다.

### 타입에 대한 어노테이션의 경우, 일부 사례에서 어노테이션 타겟이 분석되지 않음

> **문제**: [KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **구성 요소**: 코어 언어
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.6에서는 타입에 적용되어서는 안 되는 어노테이션이 타입에 사용되는 것을 더 이상 허용하지 않습니다.
>
> **지원 중단 주기**:
>
> -   1.5.20: 점진적 모드에서 오류를 도입합니다.
> -   1.6.0: 오류를 도입합니다.
>   `-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions`를 사용하여 일시적으로 오류 보고를 비활성화할 수 있습니다.

### 후행 람다와 함께 suspend라는 이름의 함수 호출 금지

> **문제**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **구성 요소**: 코어 언어
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.6에서는 함수형 타입의 단일 인수를 후행 람다로 전달하는 `suspend`라는 이름의 함수를 호출하는 것을 더 이상 허용하지 않습니다.
>
> **지원 중단 주기**:
>
> -   1.3.0: 해당 함수 호출에 경고를 도입합니다.
> -   1.6.0: 이 경고를 오류로 격상합니다.
> -   >= 1.7.0: 언어 문법에 변경 사항을 도입하여 `{` 앞에 오는 `suspend`가 키워드로 파싱되도록 합니다.

## 표준 라이브러리

### minus/removeAll/retainAll에서 취약한 contains 최적화 제거

> **문제**: [KT-45438](https://youtrack.com/issue/KT-45438)
>
> **구성 요소**: kotlin-stdlib
>
> **비호환성 변경 유형**: 동작 (behavioral)
>
> **요약**: Kotlin 1.6에서는 컬렉션/이터러블/배열/시퀀스에서 여러 요소를 제거하는 함수 및 연산자의 인수에 대해 `Set`으로의 변환을 더 이상 수행하지 않습니다.
>
> **지원 중단 주기**:
>
> -   < 1.6: 이전 동작: 일부 경우에 인수가 `Set`으로 변환됨.
> -   1.6.0: 함수 인수가 컬렉션인 경우, 더 이상 `Set`으로 변환되지 않습니다. 컬렉션이 아닌 경우, 대신 `List`로 변환될 수 있습니다.
>   JVM에서 `kotlin.collections.convert_arg_to_set_in_removeAll=true` 시스템 프로퍼티를 설정하여 이전 동작을 일시적으로 다시 켤 수 있습니다.
> -   >= 1.7: 위 시스템 프로퍼티는 더 이상 영향을 미치지 않습니다.

### Random.nextLong의 값 생성 알고리즘 변경

> **문제**: [KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **구성 요소**: kotlin-stdlib
>
> **비호환성 변경 유형**: 동작 (behavioral)
>
> **요약**: Kotlin 1.6에서는 `Random.nextLong` 함수의 값 생성 알고리즘을 변경하여 지정된 범위 밖의 값이 생성되는 것을 방지합니다.
>
> **지원 중단 주기**:
>
> -   1.6.0: 동작이 즉시 수정됩니다.

### 컬렉션 min 및 max 함수의 반환 타입을 점진적으로 Non-nullable로 변경

> **문제**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **구성 요소**: kotlin-stdlib
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.7에서 컬렉션 `min` 및 `max` 함수의 반환 타입이 Non-nullable로 변경됩니다.
>
> **지원 중단 주기**:
>
> -   1.4.0: `...OrNull` 함수를 동의어로 도입하고 영향을 받는 API를 사용 중단합니다 (자세한 내용은 문제 참조).
> -   1.5.0: 영향을 받는 API의 지원 중단 수준을 오류로 격상합니다.
> -   1.6.0: 사용 중단된 함수를 `public` API에서 숨깁니다.
> -   >= 1.7: 영향을 받는 API를 Non-nullable 반환 타입으로 재도입합니다.

### 부동 소수점 배열 함수: contains, indexOf, lastIndexOf 사용 중단

> **문제**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **구성 요소**: kotlin-stdlib
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin은 전체 순서 대신 IEEE-754 순서를 사용하여 값을 비교하는 부동 소수점 배열 함수 `contains`, `indexOf`, `lastIndexOf`를 사용 중단합니다.
>
> **지원 중단 주기**:
>
> -   1.4.0: 영향을 받는 함수에 경고와 함께 사용 중단을 도입합니다.
> -   1.6.0: 지원 중단 수준을 오류로 격상합니다.
> -   >= 1.7: 사용 중단된 함수를 `public` API에서 숨깁니다.

### kotlin.dom 및 kotlin.browser 패키지의 선언을 kotlinx.*로 마이그레이션

> **문제**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **구성 요소**: kotlin-stdlib (JS)
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: `kotlin.dom` 및 `kotlin.browser` 패키지의 선언이 `stdlib`에서 추출할 준비를 위해 해당 `kotlinx.*` 패키지로 이동됩니다.
>
> **지원 중단 주기**:
>
> -   1.4.0: `kotlinx.dom` 및 `kotlinx.browser` 패키지에 대체 API를 도입합니다.
> -   1.4.0: `kotlin.dom` 및 `kotlin.browser` 패키지의 API를 사용 중단하고 위의 새 API를 대체용으로 제안합니다.
> -   1.6.0: 지원 중단 수준을 오류로 격상합니다.
> -   >= 1.7: `stdlib`에서 사용 중단된 함수를 제거합니다.
> -   >= 1.7: `kotlinx.*` 패키지의 API를 별도 라이브러리로 이동합니다.

### Kotlin/JS에서 Regex.replace 함수를 인라인이 아닌 함수로 만들기

> **문제**: [KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **구성 요소**: kotlin-stdlib (JS)
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Kotlin/JS에서 함수형 `transform` 파라미터를 가진 `Regex.replace` 함수는 더 이상 인라인이 아닙니다.
>
> **지원 중단 주기**:
>
> -   1.6.0: 영향을 받는 함수에서 `inline` 한정자를 제거합니다.

### 대체 문자열에 그룹 참조가 포함된 경우 JVM과 JS에서 Regex.replace 함수의 동작 차이

> **문제**: [KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **구성 요소**: kotlin-stdlib (JS)
>
> **비호환성 변경 유형**: 동작 (behavioral)
>
> **요약**: Kotlin/JS의 `Regex.replace` 함수에서 대체 패턴 문자열은 Kotlin/JVM과 동일한 패턴 문법을 따릅니다.
>
> **지원 중단 주기**:
>
> -   1.6.0: Kotlin/JS `stdlib`의 `Regex.replace`에서 대체 패턴 처리를 변경합니다.

### JS Regex에서 유니코드 대소문자 폴딩 사용

> **문제**: [KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **구성 요소**: kotlin-stdlib (JS)
>
> **비호환성 변경 유형**: 동작 (behavioral)
>
> **요약**: Kotlin/JS의 `Regex` 클래스는 기본 JS 정규 표현식 엔진을 호출할 때 유니코드 규칙에 따라 문자를 검색하고 비교하기 위해 [`unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode) 플래그를 사용합니다. 이는 JS 환경에 특정 버전 요구 사항을 가져오고 정규식 패턴 문자열에서 불필요한 이스케이프에 대한 더 엄격한 유효성 검사를 야기합니다.
>
> **지원 중단 주기**:
>
> -   1.5.0: JS `Regex` 클래스의 대부분 함수에서 유니코드 대소문자 폴딩을 활성화합니다.
> -   1.6.0: `Regex.replaceFirst` 함수에서 유니코드 대소문자 폴딩을 활성화합니다.

### 일부 JS 전용 API 사용 중단

> **문제**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **구성 요소**: kotlin-stdlib (JS)
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: `stdlib`의 여러 JS 전용 함수가 제거를 위해 사용 중단됩니다. 여기에는 `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)` 및 비교 함수를 인수로 받는 배열의 `sort` 함수(예: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`)가 포함됩니다.
>
> **지원 중단 주기**:
>
> -   1.6.0: 영향을 받는 함수에 경고와 함께 사용 중단을 도입합니다.
> -   1.7.0: 지원 중단 수준을 오류로 격상합니다.
> -   1.8.0: `public` API에서 사용 중단된 함수를 제거합니다.

### Kotlin/JS 클래스의 public API에서 구현 및 상호 운용성 관련 함수 숨기기

> **문제**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **구성 요소**: kotlin-stdlib (JS)
>
> **비호환성 변경 유형**: 소스 (source), 바이너리 (binary)
>
> **요약**: `HashMap.createEntrySet` 및 `AbstactMutableCollection.toJSON` 함수의 가시성이 `internal`로 변경됩니다.
>
> **지원 중단 주기**:
>
> -   1.6.0: 함수를 `internal`로 만들어 `public` API에서 제거합니다.

## 도구

### KotlinGradleSubplugin 클래스 사용 중단

> **문제**: [KT-48830](https://youtrack.jetbrains.com/issue/KT-48830)
>
> **구성 요소**: Gradle
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: `KotlinGradleSubplugin` 클래스는 `KotlinCompilerPluginSupportPlugin`을 선호하여 사용 중단됩니다.
>
> **지원 중단 주기**:
>
> -   1.6.0: 지원 중단 수준을 오류로 격상합니다.
> -   >= 1.7.0: 사용 중단된 클래스를 제거합니다.

### kotlin.useFallbackCompilerSearch 빌드 옵션 제거

> **문제**: [KT-46719](https://youtrack.jetbrains.com/issue/KT-46719)
>
> **구성 요소**: Gradle
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: 사용 중단된 `kotlin.useFallbackCompilerSearch` 빌드 옵션을 제거합니다.
>
> **지원 중단 주기**:
>
> -   1.5.0: 지원 중단 수준을 경고로 격상합니다.
> -   1.6.0: 사용 중단된 옵션을 제거합니다.

### 여러 컴파일러 옵션 제거

> **문제**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **구성 요소**: Gradle
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: 사용 중단된 `noReflect` 및 `includeRuntime` 컴파일러 옵션을 제거합니다.
>
> **지원 중단 주기**:
>
> -   1.5.0: 지원 중단 수준을 오류로 격상합니다.
> -   1.6.0: 사용 중단된 옵션을 제거합니다.

### useIR 컴파일러 옵션 사용 중단

> **문제**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **구성 요소**: Gradle
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: 사용 중단된 `useIR` 컴파일러 옵션을 숨깁니다.
>
> **지원 중단 주기**:
>
> -   1.5.0: 지원 중단 수준을 경고로 격상합니다.
> -   1.6.0: 옵션을 숨깁니다.
> -   >= 1.7.0: 사용 중단된 옵션을 제거합니다.

### kapt.use.worker.api Gradle 프로퍼티 사용 중단

> **문제**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **구성 요소**: Gradle
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: Gradle Workers API를 통해 kapt를 실행할 수 있었던 `kapt.use.worker.api` 프로퍼티(기본값: true)를 사용 중단합니다.
>
> **지원 중단 주기**:
>
> -   1.6.20: 지원 중단 수준을 경고로 격상합니다.
> -   >= 1.8.0: 이 프로퍼티를 제거합니다.

### kotlin.parallel.tasks.in.project Gradle 프로퍼티 제거

> **문제**: [KT-46406](https://youtrack.jetbrains.com/issue/KT-46406)
>
> **구성 요소**: Gradle
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: `kotlin.parallel.tasks.in.project` 프로퍼티를 제거합니다.
>
> **지원 중단 주기**:
>
> -   1.5.20: 지원 중단 수준을 경고로 격상합니다.
> -   1.6.20: 이 프로퍼티를 제거합니다.

### kotlin.experimental.coroutines Gradle DSL 옵션 및 kotlin.coroutines Gradle 프로퍼티 사용 중단

> **문제**: [KT-50369](https://youtrack.jetbrains.com/issue/KT-50369)
>
> **구성 요소**: Gradle
>
> **비호환성 변경 유형**: 소스 (source)
>
> **요약**: `kotlin.experimental.coroutines` Gradle DSL 옵션 및 `kotlin.coroutines` 프로퍼티를 사용 중단합니다.
>
> **지원 중단 주기**:
>
> -   1.6.20: 지원 중단 수준을 경고로 격상합니다.
> -   >= 1.7.0: DSL 옵션 및 프로퍼티를 제거합니다.