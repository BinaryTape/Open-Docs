[//]: # (title: Kotlin 1.6.x 호환성 가이드)

_[언어의 현대성 유지(Keeping the Language Modern)](kotlin-evolution-principles.md)_ 및 _[편안한 업데이트(Comfortable Updates)](kotlin-evolution-principles.md)_는 Kotlin 언어 디자인의 기본 원칙입니다. 전자는 언어의 진화를 방해하는 구조를 제거해야 함을 의미하며, 후자는 코드 마이그레이션을 가능한 한 원활하게 만들기 위해 이러한 제거가 사전에 잘 전달되어야 함을 의미합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그나 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 이를 모두 요약하여 Kotlin 1.5에서 Kotlin 1.6으로 마이그레이션하기 위한 전체 참조를 제공합니다.

## 기본 용어

이 문서에서는 몇 가지 종류의 호환성을 소개합니다.

- _소스(source)_: 소스 호환되지 않는 변경은 이전에 잘 컴파일되던 코드(오류나 경고 없이)가 더 이상 컴파일되지 않게 함을 의미합니다.
- _바이너리(binary)_: 두 바이너리 아티팩트를 서로 교체했을 때 로딩 또는 링크 오류가 발생하지 않는 경우 이를 바이너리 호환이라고 합니다.
- _동작(behavioral)_: 변경을 적용하기 전과 후에 동일한 프로그램이 서로 다른 동작을 보일 때 이를 동작 호환되지 않는 변경이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 제공된다는 점을 기억하십시오. 다른 언어 관점(예: Java)에서의 Kotlin 코드 호환성은 이 문서의 범위를 벗어납니다.

## 언어 (Language)

### enum, sealed, Boolean 대상을 가진 when 문을 기본적으로 망라적으로 만들기

> **이슈**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.6은 enum, sealed 또는 Boolean 대상을 가진 `when` 문이 망라적(exhaustive)이지 않은 경우 경고를 표시합니다.
>
> **지원 중단 주기**:
>
> - 1.6.0: enum, sealed 또는 Boolean 대상을 가진 `when` 문이 망라적이지 않은 경우 경고 도입 (progressive 모드에서는 오류)
> - 1.7.0: 이 경고를 오류로 격상

### when-with-subject에서 혼동을 주는 문법 지원 중단

> **이슈**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.6은 `when` 조건식에서 몇 가지 혼동을 주는 문법 구조를 지원 중단합니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: 해당 식에 대해 지원 중단 경고 도입
> - 1.8.0: 이 경고를 오류로 격상
> - &gt;= 1.8: 지원 중단된 일부 구조를 새로운 언어 기능을 위해 재사용

### 컴패니언 및 중첩 객체의 상위 생성자 호출에서 클래스 멤버 접근 금지

> **이슈**: [KT-25289](https://youtrack.jetbrains.com/issue/KT-25289)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.6은 컴패니언 및 일반 객체의 상위 생성자 호출 인자에서 해당 인자의 수신 객체가 포함된 선언을 참조하는 경우 오류를 보고합니다.
>
> **지원 중단 주기**:
>
> - 1.5.20: 문제가 되는 인자에 대해 경고 도입
> - 1.6.0: 이 경고를 오류로 격상,
>  `-XXLanguage:-ProhibitSelfCallsInNestedObjects`를 사용하여 일시적으로 1.6 이전의 동작으로 되돌릴 수 있음

### 타입 널 가능성 개선 사항

> **이슈**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.7은 Java 코드에서 타입 널 가능성(nullability) 어노테이션을 로드하고 해석하는 방식을 변경합니다.
>
> **지원 중단 주기**:
>
> - 1.4.30: 더 정밀한 타입 널 가능성이 오류로 이어질 수 있는 경우에 대해 경고 도입
> - 1.7.0: Java 타입의 널 가능성을 더 정밀하게 추론,
>   `-XXLanguage:-TypeEnhancementImprovementsInStrictMode`를 사용하여 일시적으로 1.7 이전의 동작으로 되돌릴 수 있음

### 서로 다른 숫자 타입 간의 암시적 강제 변환 방지

> **이슈**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Kotlin은 의미론적으로 해당 타입으로의 다운캐스트만 필요한 경우 숫자 값을 프리미티브 숫자 타입으로 자동으로 변환하는 것을 방지합니다.
>
> **지원 중단 주기**:
>
> - < 1.5.30: 영향을 받는 모든 사례에서 이전 동작 유지
> - 1.5.30: 생성된 프로퍼티 위임 접근자(property delegate accessors)에서의 다운캐스트 동작 수정,
>   `-Xuse-old-backend`를 사용하여 일시적으로 1.5.30 수정 이전의 동작으로 되돌릴 수 있음
> - &gt;= 1.6.20: 영향을 받는 다른 사례에서의 다운캐스트 동작 수정

### JLS를 위반하는 컨테이너 어노테이션을 가진 반복 가능한 어노테이션 클래스 선언 금지

> **이슈**: [KT-47928](https://youtrack.jetbrains.com/issue/KT-47928)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.6은 반복 가능한(repeatable) 어노테이션의 컨테이너 어노테이션이 [JLS 9.6.3](https://docs.oracle.com/javase/specs/jls/se16/html/jls-9.html#jls-9.6.3)과 동일한 요구 사항(배열 타입 값 메서드, 유지 정책(retention), 타겟)을 충족하는지 확인합니다.
>
> **지원 중단 주기**:
>
> - 1.5.30: JLS 요구 사항을 위반하는 반복 가능한 컨테이너 어노테이션 선언에 대해 경고 도입 (progressive 모드에서는 오류)
> - 1.6.0: 이 경고를 오류로 격상,
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints`를 사용하여 일시적으로 오류 보고를 비활성화할 수 있음

### 반복 가능한 어노테이션 클래스 내부에 Container라는 이름의 중첩 클래스 선언 금지

> **이슈**: [KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.6은 Kotlin에서 선언된 반복 가능한 어노테이션이 `Container`라는 미리 정의된 이름을 가진 중첩 클래스를 가지지 않는지 확인합니다.
>
> **지원 중단 주기**:
>
> - 1.5.30: Kotlin의 반복 가능한 어노테이션 클래스 내에 이름이 `Container`인 중첩 클래스가 있는 경우 경고 도입 (progressive 모드에서는 오류)
> - 1.6.0: 이 경고를 오류로 격상,
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints`를 사용하여 일시적으로 오류 보고를 비활성화할 수 있음

### 인터페이스 프로퍼티를 오버라이드하는 주 생성자의 프로퍼티에 @JvmField 사용 금지

> **이슈**: [KT-32753](https://youtrack.jetbrains.com/issue/KT-32753)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.6은 인터페이스 프로퍼티를 오버라이드하는 주 생성자에 선언된 프로퍼티에 `@JvmField` 어노테이션을 사용하는 것을 금지합니다.
>
> **지원 중단 주기**:
>
> - 1.5.20: 주 생성자의 이러한 프로퍼티에 `@JvmField` 어노테이션이 있는 경우 경고 도입
> - 1.6.0: 이 경고를 오류로 격상,
>   `-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor`를 사용하여 일시적으로 오류 보고를 비활성화할 수 있음

### 컴파일러 옵션 -Xjvm-default의 enable 및 compatibility 모드 지원 중단

> **이슈**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.6.20은 `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드 사용에 대해 경고합니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드에 대해 경고 도입
> - &gt;= 1.8.0: 이 경고를 오류로 격상

### public-abi 인라인 함수에서 super 호출 금지

> **이슈**: [KT-45379](https://youtrack.jetbrains.com/issue/KT-45379)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.6은 public 또는 protected 인라인 함수 및 프로퍼티에서 `super` 한정자를 사용하여 함수를 호출하는 것을 금지합니다.
>
> **지원 중단 주기**:
>
> - 1.5.0: public 또는 protected 인라인 함수나 프로퍼티 접근자에서 super 호출을 하는 경우 경고 도입
> - 1.6.0: 이 경고를 오류로 격상,
>   `-XXLanguage:-ProhibitSuperCallsFromPublicInline`를 사용하여 일시적으로 오류 보고를 비활성화할 수 있음

### public 인라인 함수에서 protected 생성자 호출 금지

> **이슈**: [KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.6은 public 또는 protected 인라인 함수 및 프로퍼티에서 protected 생성자를 호출하는 것을 금지합니다.
>
> **지원 중단 주기**:
>
> - 1.4.30: public 또는 protected 인라인 함수나 프로퍼티 접근자에서 protected 생성자를 호출하는 경우 경고 도입
> - 1.6.0: 이 경고를 오류로 격상,
>   `-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline`를 사용하여 일시적으로 오류 보고를 비활성화할 수 있음

### private-in-file 타입에서 private 중첩 타입 노출 금지

> **이슈**: [KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.6은 private-in-file 타입에서 private 중첩 타입 및 내부 클래스를 노출하는 것을 금지합니다.
>
> **지원 중단 주기**:
>
> - 1.5.0: private-in-file 타입에서 노출되는 private 타입에 대해 경고 도입
> - 1.6.0: 이 경고를 오류로 격상,
>   `-XXLanguage:-PrivateInFileEffectiveVisibility`를 사용하여 일시적으로 오류 보고를 비활성화할 수 있음

### 타입에 대한 어노테이션에서 어노테이션 타겟이 분석되지 않는 여러 경우

> **이슈**: [KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.6은 타입에 적용될 수 없는 어노테이션을 타입에 사용하는 것을 더 이상 허용하지 않습니다.
>
> **지원 중단 주기**:
>
> - 1.5.20: progressive 모드에서 오류 도입
> - 1.6.0: 오류 도입,
>   `-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions`를 사용하여 일시적으로 오류 보고를 비활성화할 수 있음

### 후행 람다와 함께 suspend라는 이름의 함수 호출 금지

> **이슈**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **컴포넌트**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.6은 함수형 타입의 단일 인자가 후행 람다로 전달되는 `suspend`라는 이름의 함수 호출을 더 이상 허용하지 않습니다.
>
> **지원 중단 주기**:
>
> - 1.3.0: 해당 함수 호출에 대해 경고 도입
> - 1.6.0: 이 경고를 오류로 격상
> - &gt;= 1.7.0: `{` 앞의 `suspend`가 키워드로 파싱되도록 언어 문법 변경 도입

## 표준 라이브러리 (Standard library)

### minus/removeAll/retainAll에서 취약한 contains 최적화 제거

> **이슈**: [KT-45438](https://youtrack.jetbrains.com/issue/KT-45438)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Kotlin 1.6은 컬렉션/iterable/배열/시퀀스에서 여러 요소를 제거하는 함수 및 연산자의 인자에 대해 더 이상 set으로의 변환을 수행하지 않습니다.
>
> **지원 중단 주기**:
>
> - < 1.6: 이전 동작: 일부 경우에 인자가 set으로 변환됨
> - 1.6.0: 함수 인자가 컬렉션인 경우 더 이상 `Set`으로 변환되지 않습니다. 컬렉션이 아닌 경우 대신 `List`로 변환될 수 있습니다.
>   JVM에서 시스템 속성 `kotlin.collections.convert_arg_to_set_in_removeAll=true`를 설정하여 이전 동작으로 일시적으로 되돌릴 수 있습니다.
> - &gt;= 1.7: 위의 시스템 속성은 더 이상 효과가 없습니다.

### Random.nextLong의 값 생성 알고리즘 변경

> **이슈**: [KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Kotlin 1.6은 지정된 범위를 벗어나는 값이 생성되는 것을 방지하기 위해 `Random.nextLong` 함수의 값 생성 알고리즘을 변경합니다.
>
> **지원 중단 주기**:
>
> - 1.6.0: 동작이 즉시 수정됨

### 컬렉션 min 및 max 함수의 반환 타입을 점진적으로 non-nullable로 변경

> **이슈**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 컬렉션 `min` 및 `max` 함수의 반환 타입이 Kotlin 1.7에서 non-nullable로 변경됩니다.
>
> **지원 중단 주기**:
>
> - 1.4.0: 동의어로 `...OrNull` 함수를 도입하고 영향을 받는 API를 지원 중단 (이슈의 세부 정보 참조)
> - 1.5.0: 영향을 받는 API의 지원 중단 수준을 오류로 격상
> - 1.6.0: 공용 API에서 지원 중단된 함수를 숨김
> - &gt;= 1.7: 반환 타입을 non-nullable로 하여 영향을 받는 API를 재도입

### 부동 소수점 배열 함수 지원 중단: contains, indexOf, lastIndexOf

> **이슈**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin은 총 순서(total order) 대신 IEEE-754 순서를 사용하여 값을 비교하는 부동 소수점 배열 함수 `contains`, `indexOf`, `lastIndexOf`를 지원 중단합니다.
>
> **지원 중단 주기**:
>
> - 1.4.0: 해당 함수들을 경고와 함께 지원 중단
> - 1.6.0: 지원 중단 수준을 오류로 격상
> - &gt;= 1.7: 공용 API에서 지원 중단된 함수를 숨김

### kotlin.dom 및 kotlin.browser 패키지의 선언을 kotlinx.*로 마이그레이션

> **이슈**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **컴포넌트**: kotlin-stdlib (JS)
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `kotlin.dom` 및 `kotlin.browser` 패키지의 선언들이 stdlib에서 추출될 준비를 위해 해당 `kotlinx.*` 패키지로 이동됩니다.
>
> **지원 중단 주기**:
>
> - 1.4.0: `kotlinx.dom` 및 `kotlinx.browser` 패키지에 대체 API 도입
> - 1.4.0: `kotlin.dom` 및 `kotlin.browser` 패키지의 API를 지원 중단하고 위의 새 API를 대체제로 제안
> - 1.6.0: 지원 중단 수준을 오류로 격상
> - &gt;= 1.7: stdlib에서 지원 중단된 함수 제거
> - &gt;= 1.7: kotlinx.* 패키지의 API를 별도의 라이브러리로 이동

### Kotlin/JS에서 Regex.replace 함수를 인라인이 아니게 변경

> **이슈**: [KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **컴포넌트**: kotlin-stdlib (JS)
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 함수형 `transform` 파라미터를 가진 `Regex.replace` 함수는 Kotlin/JS에서 더 이상 인라인(inline)이 아니게 됩니다.
>
> **지원 중단 주기**:
>
> - 1.6.0: 해당 함수에서 `inline` 한정자 제거

### 대체 문자열에 그룹 참조가 포함된 경우 JVM과 JS에서 Regex.replace 함수의 동작 차이

> **이슈**: [KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **컴포넌트**: kotlin-stdlib (JS)
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Kotlin/JS의 대체 패턴 문자열을 사용하는 `Regex.replace` 함수는 Kotlin/JVM에서와 동일한 패턴 문법을 따르게 됩니다.
>
> **지원 중단 주기**:
>
> - 1.6.0: Kotlin/JS stdlib의 `Regex.replace`에서 대체 패턴 처리 방식 변경

### JS Regex에서 유니코드 케이스 폴딩 사용

> **이슈**: [KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **컴포넌트**: kotlin-stdlib (JS)
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Kotlin/JS의 `Regex` 클래스는 유니코드 규칙에 따라 문자를 검색하고 비교하기 위해 기본 JS 정규식 엔진을 호출할 때 [`unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode) 플래그를 사용합니다.
> 이로 인해 JS 환경의 특정 버전 요구 사항이 생기며, 정규식 패턴 문자열에서 불필요한 이스케이프에 대해 더 엄격한 유효성 검사가 발생합니다.
>
> **지원 중단 주기**:
>
> - 1.5.0: JS `Regex` 클래스의 대부분의 함수에서 유니코드 케이스 폴딩 활성화
> - 1.6.0: `Regex.replaceFirst` 함수에서 유니코드 케이스 폴딩 활성화

### 일부 JS 전용 API 지원 중단

> **이슈**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **컴포넌트**: kotlin-stdlib (JS)
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: stdlib의 다수 JS 전용 함수가 제거를 위해 지원 중단됩니다. 여기에는 `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)`, 그리고 비교 함수를 받는 배열의 `sort` 함수들(예: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`)이 포함됩니다.
>
> **지원 중단 주기**:
>
> - 1.6.0: 해당 함수들을 경고와 함께 지원 중단
> - 1.7.0: 지원 중단 수준을 오류로 격상
> - 1.8.0: 공용 API에서 지원 중단된 함수 제거

### Kotlin/JS 클래스의 공용 API에서 구현 및 상호 운용성 관련 함수 숨기기

> **이슈**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **컴포넌트**: kotlin-stdlib (JS)
>
> **호환되지 않는 변경 유형**: 소스, 바이너리
>
> **요약**: `HashMap.createEntrySet` 및 `AbstactMutableCollection.toJSON` 함수의 가시성이 internal로 변경됩니다.
>
> **지원 중단 주기**:
>
> - 1.6.0: 함수를 internal로 변경하여 공용 API에서 제거

## 도구 (Tools)

### KotlinGradleSubplugin 클래스 지원 중단

> **이슈**: [KT-48830](https://youtrack.jetbrains.com/issue/KT-48830)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `KotlinGradleSubplugin` 클래스가 `KotlinCompilerPluginSupportPlugin`을 위해 지원 중단됩니다.
>
> **지원 중단 주기**:
>
> - 1.6.0: 지원 중단 수준을 오류로 격상
> - &gt;= 1.7.0: 지원 중단된 클래스 제거

### kotlin.useFallbackCompilerSearch 빌드 옵션 제거

> **이슈**: [KT-46719](https://youtrack.jetbrains.com/issue/KT-46719)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 지원 중단된 'kotlin.useFallbackCompilerSearch' 빌드 옵션을 제거합니다.
>
> **지원 중단 주기**:
>
> - 1.5.0: 지원 중단 수준을 경고로 격상
> - 1.6.0: 지원 중단된 옵션 제거

### 여러 컴파일러 옵션 제거

> **이슈**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 지원 중단된 `noReflect` 및 `includeRuntime` 컴파일러 옵션을 제거합니다.
>
> **지원 중단 주기**:
>
> - 1.5.0: 지원 중단 수준을 오류로 격상
> - 1.6.0: 지원 중단된 옵션 제거

### useIR 컴파일러 옵션 지원 중단

> **이슈**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 지원 중단된 `useIR` 컴파일러 옵션을 숨깁니다.
>
> **지원 중단 주기**:
>
> - 1.5.0: 지원 중단 수준을 경고로 격상
> - 1.6.0: 옵션을 숨김
> - &gt;= 1.7.0: 지원 중단된 옵션 제거

### kapt.use.worker.api Gradle 속성 지원 중단

> **이슈**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Gradle Workers API를 통해 kapt를 실행할 수 있게 했던 `kapt.use.worker.api` 속성을 지원 중단합니다. (기본값: true)
>
> **지원 중단 주기**:
>
> - 1.6.20: 지원 중단 수준을 경고로 격상
> - &gt;= 1.8.0: 이 속성 제거

### kotlin.parallel.tasks.in.project Gradle 속성 제거

> **이슈**: [KT-46406](https://youtrack.jetbrains.com/issue/KT-46406)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `kotlin.parallel.tasks.in.project` 속성을 제거합니다.
>
> **지원 중단 주기**:
>
> - 1.5.20: 지원 중단 수준을 경고로 격상
> - 1.6.20: 이 속성 제거

### kotlin.experimental.coroutines Gradle DSL 옵션 및 kotlin.coroutines Gradle 속성 지원 중단

> **이슈**: [KT-50369](https://youtrack.jetbrains.com/issue/KT-50369)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `kotlin.experimental.coroutines` Gradle DSL 옵션 및 `kotlin.coroutines` 속성을 지원 중단합니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: 지원 중단 수준을 경고로 격상
> - &gt;= 1.7.0: DSL 옵션 및 속성 제거