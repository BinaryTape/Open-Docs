[//]: # (title: Kotlin 2.0.x 호환성 가이드)

_[언어 현대성 유지 (Keeping the Language Modern)](kotlin-evolution-principles.md)_ 및 _[편리한 업데이트 (Comfortable Updates)](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 근본적인 원칙 중 하나입니다. 전자는 언어 발전을 방해하는 구성 요소를 제거해야 한다고 말하며, 후자는 이러한 제거가 코드 마이그레이션을 최대한 원활하게 만들기 위해 사전에 잘 전달되어야 한다고 말합니다.

대부분의 언어 변경 사항은 이미 업데이트된 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 발표되었지만, 이 문서는 Kotlin 1.9에서 Kotlin 2.0으로 마이그레이션하기 위한 전체 참조를 제공합니다.

> Kotlin K2 컴파일러는 Kotlin 2.0의 일부로 도입됩니다. 새로운 컴파일러의 이점, 마이그레이션 중 발생할 수 있는 변경 사항, 이전 컴파일러로 되돌리는 방법에 대한 자세한 내용은 [K2 컴파일러 마이그레이션 가이드 (K2 compiler migration guide)](k2-compiler-migration-guide.md)를 참조하세요.
>
{style="note"}

## 기본 용어

이 문서에서는 여러 종류의 호환성을 소개합니다.

- _source_ (소스): 소스 비호환성 변경은 이전에 (오류나 경고 없이) 잘 컴파일되던 코드가 더 이상 컴파일되지 않도록 합니다.
- _binary_ (바이너리): 두 바이너리 아티팩트는 서로 교환해도 로딩 또는 링크 오류가 발생하지 않으면 바이너리 호환된다고 합니다.
- _behavioral_ (동작): 동일한 프로그램이 변경 사항을 적용하기 전과 후에 다른 동작을 보이면 동작 비호환성 변경이라고 합니다.

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

### 프로젝션된 리시버에 합성 세터 사용 중단

> **Issue**: [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Java 클래스의 합성 세터를 사용하여 클래스의 프로젝션된 타입과 충돌하는 타입을 할당하면 오류가 발생합니다.
>
> **Deprecation cycle**:
>
> - 1.8.20: 합성 속성 세터가 반변 위치에 프로젝션된 매개변수 타입을 가지므로 호출-사이트 인수 타입이 호환되지 않을 때 경고 보고
> - 2.0.0: 경고를 오류로 격상

### Java 서브클래스에서 오버로드된 인라인 클래스 매개변수를 가진 함수 호출 시 정확한 맹글링

> **Issue**: [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 동작
>
> **Deprecation cycle**:
>
> - 2.0.0: 함수 호출에서 올바른 맹글링(mangling) 동작 사용; 이전 동작으로 되돌리려면 `-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses` 컴파일러 옵션 사용.

### 반변 캡처된 타입에 대한 정확한 타입 근사 알고리즘

> **Issue**: [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.8.20: 문제성 호출에 대해 경고 보고
> - 2.0.0: 경고를 오류로 격상

### 속성 초기화 전 속성 값 접근 금지

> **Issue**: [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 영향받는 컨텍스트에서 속성 초기화 전에 속성에 접근할 때 오류 보고

### 동일한 이름의 임포트된 클래스에서 모호성이 있을 때 오류 보고

> **Issue**: [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 스타 임포트로 임포트된 여러 패키지에 존재하는 클래스 이름을 해결할 때 오류 보고

### 기본적으로 `invokedynamic` 및 `LambdaMetafactory`를 통해 Kotlin 람다 생성

> **Issue**: [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 동작
>
> **Deprecation cycle**:
>
> - 2.0.0: 새로운 동작 구현; 람다는 기본적으로 `invokedynamic` 및 `LambdaMetafactory`를 사용하여 생성됨

### 표현식이 필요할 때 단일 분기 `if` 조건 금지

> **Issue**: [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: `if` 조건에 단일 분기만 있는 경우 오류 보고

### 제네릭 타입의 스타-프로젝션을 전달하여 자체 상위 바운드 위반 금지

> **Issue**: [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 제네릭 타입의 스타-프로젝션을 전달하여 자체 상위 바운드가 위반될 때 오류 보고

### private 인라인 함수 반환 타입의 익명 타입 근사화

> **Issue**: [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.9.0: 추론된 반환 타입에 익명 타입이 포함된 private 인라인 함수에 대해 경고 보고
> - 2.0.0: 이러한 private 인라인 함수의 반환 타입을 상위 타입으로 근사화

### 오버로드 해결 동작 변경: 로컬 함수 타입 속성의 `invoke` 컨벤션보다 로컬 확장 함수 호출 우선순위 지정

> **Issue**: [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 동작
>
> **Deprecation cycle**:
>
> - 2.0.0: 새로운 오버로드 해결 동작; 함수 호출이 `invoke` 컨벤션보다 일관되게 우선순위를 가짐

### 바이너리 의존성으로부터의 상위 타입 변경으로 인해 상속된 멤버 충돌이 발생할 때 오류 보고

> **Issue**: [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.7.0: 바이너리 의존성으로부터의 상위 타입에서 상속된 멤버 충돌이 발생한 선언에 대해 `CONFLICTING_INHERITED_MEMBERS_WARNING` 경고 보고
> - 2.0.0: 경고를 `CONFLICTING_INHERITED_MEMBERS` 오류로 격상

### 불변 타입 매개변수의 `@UnsafeVariance` 어노테이션 무시

> **Issue**: [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 새로운 동작 구현; 반변 매개변수의 타입 불일치에 대한 오류를 보고할 때 `@UnsafeVariance` 어노테이션은 무시됨

### 컴패니언 객체 멤버에 대한 호출 외부 참조 타입 변경

> **Issue**: [KT-54316](https://youtrack.com/issue/KT-54316)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.8.20: 컴패니언 객체 함수 참조 타입이 언바운드 참조로 추론될 때 경고 보고
> - 2.0.0: 모든 사용 컨텍스트에서 컴패니언 객체 함수 참조가 바운드 참조로 추론되도록 동작 변경

### private 인라인 함수에서 익명 타입 노출 금지

> **Issue**: [KT-33917](https://youtrack.com/issue/KT-33917)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.3.0: private 인라인 함수에서 반환되는 익명 객체의 자체 멤버 호출에 대해 경고 보고
> - 2.0.0: 이러한 private 인라인 함수의 반환 타입을 상위 타입으로 근사화하고 익명 객체 멤버에 대한 호출을 해결하지 않음

### `while` 루프 `break` 후 불안정한 스마트 캐스트에 대해 오류 보고

> **Issue**: [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 새로운 동작 구현; 이전 동작은 언어 버전 1.9로 전환하여 복원할 수 있음

### 교차 타입 변수에 해당 교차 타입의 서브타입이 아닌 값이 할당될 때 오류 보고

> **Issue**: [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 교차 타입 변수에 해당 교차 타입의 서브타입이 아닌 값이 할당될 때 오류 보고

### SAM 생성자로 구성된 인터페이스에 opt-in이 필요한 메서드가 포함될 때 opt-in 요구

> **Issue**: [KT-52628](https://youtrack.com/issue/KT-52628)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.7.20: SAM 생성자를 통한 `OptIn` 사용에 대해 경고 보고
> - 2.0.0: SAM 생성자를 통한 `OptIn` 사용에 대해 경고를 오류로 격상 (또는 `OptIn` 마커 심각도가 경고인 경우 계속 경고 보고)

### 타입 별칭 생성자에서 상위 바운드 위반 금지

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.8.0: 타입 별칭 생성자에서 상위 바운드가 위반되는 경우 경고 도입
> - 2.0.0: K2 컴파일러에서 경고를 오류로 격상

### 비구조화 변수의 실제 타입을 지정된 명시적 타입과 일치시키기

> **Issue**: [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 새로운 동작 구현; 비구조화 변수의 실제 타입이 이제 지정된 경우 명시적 타입과 일치함

### opt-in이 필요한 기본값을 가진 매개변수 타입이 있는 생성자를 호출할 때 opt-in 요구

> **Issue**: [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.8.20: opt-in이 필요한 매개변수 타입을 가진 생성자 호출에 대해 경고 보고
> - 2.0.0: 경고를 오류로 격상 (또는 `OptIn` 마커 심각도가 경고인 경우 계속 경고 보고)

### 동일한 스코프 레벨에서 동일한 이름을 가진 속성과 enum 엔트리 간의 모호성 보고

> **Issue**: [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.7.20: 컴파일러가 동일한 스코프 레벨에서 enum 엔트리 대신 속성으로 해결할 때 경고 보고
> - 2.0.0: K2 컴파일러에서 동일한 스코프 레벨에 동일한 이름을 가진 속성과 enum 엔트리가 모두 있을 때 모호성 보고 (이전 컴파일러에서는 경고 유지)

### 한정자 해결 동작 변경: enum 엔트리보다 컴패니언 속성 선호

> **Issue**: [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 새로운 해결 동작 구현; 컴패니언 속성이 enum 엔트리보다 선호됨

### `invoke` 호출 리시버 타입과 `invoke` 함수 타입 해결

> **Issue**: [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: `invoke` 호출 리시버 타입과 `invoke` 함수 타입을 desugared 형태로 작성된 것처럼 독립적으로 해결

### 비-private 인라인 함수를 통해 private 클래스 멤버 노출 금지

> **Issue**: [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.9.0: 내부(internal) 인라인 함수에서 private 클래스 컴패니언 객체 멤버를 호출할 때 `PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING` 경고 보고
> - 2.0.0: 이 경고를 `PRIVATE_CLASS_MEMBER_FROM_INLINE` 오류로 격상

### 프로젝션된 제네릭 타입에서 확실히 non-null 타입의 널러블리티 수정

> **Issue**: [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 새로운 동작 구현; 프로젝션된 타입은 모든 인플레이스(in-place) non-null 타입을 고려함

### 접두사 증가의 추론된 타입을 `inc()` 연산자의 반환 타입 대신 getter의 반환 타입과 일치하도록 변경

> **Issue**: [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 새로운 동작 구현; 접두사 증가의 추론된 타입이 이제 `inc()` 연산자의 반환 타입 대신 getter의 반환 타입과 일치하도록 변경됨

### 상위 클래스에 선언된 제네릭 내부 클래스로부터 내부 클래스를 상속할 때 바운드 체크 강제

> **Issue**: [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 제네릭 내부 상위 클래스의 타입 매개변수의 상위 바운드가 위반될 때 오류 보고

### 예상 타입이 함수 타입 매개변수를 가진 함수 타입일 때 SAM 타입의 호출 가능 참조 할당 금지

> **Issue**: [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 예상 타입이 함수 타입 매개변수를 가진 함수 타입일 때 SAM 타입의 호출 가능 참조에 대해 컴파일 오류 보고

### 컴패니언 객체에 대한 어노테이션 해결 시 컴패니언 객체 스코프 고려

> **Issue**: [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 동작
>
> **Deprecation cycle**:
>
> - 2.0.0: 새로운 동작 구현; 컴패니언 객체에 대한 어노테이션 해결 시 이제 컴패니언 객체 스코프가 무시되지 않음

### 안전 호출 및 컨벤션 연산자 조합에 대한 평가 의미론 변경

> **Issue**: [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 동작
>
> **Deprecation cycle**:
>
> - 1.4.0: 각 잘못된 호출에 대해 경고 보고
> - 2.0.0: 새로운 해결 동작 구현

### backing field와 커스텀 세터가 있는 속성은 즉시 초기화되어야 함

> **Issue**: [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 동작
>
> **Deprecation cycle**:
>
> - 1.9.20: 주 생성자가 없는 경우 `MUST_BE_INITIALIZED` 경고 도입
> - 2.0.0: 경고를 오류로 격상

### invoke 연산자 컨벤션 호출에서 임의 표현식에 대한 Unit 변환 금지

> **Issue**: [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 동작
>
> **Deprecation cycle**:
>
> - 2.0.0: 변수 및 `invoke` 해결 시 임의 표현식에 Unit 변환이 적용될 때 오류 보고; 영향받는 표현식에 대해 이전 동작을 유지하려면 `-XXLanguage:+UnitConversionsOnArbitraryExpressions` 컴파일러 옵션 사용.

### 안전 호출로 필드에 접근할 때 널러블 값을 non-null Java 필드에 할당하는 것을 금지

> **Issue**: [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 널러블 값이 non-null Java 필드에 할당될 때 오류 보고

### raw-type 매개변수를 포함하는 Java 메서드를 오버라이딩할 때 스타-프로젝션된 타입 요구

> **Issue**: [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 새로운 동작 구현; raw 타입 매개변수에 대한 오버라이딩은 금지됨

### V가 컴패니언을 가질 때 `(V)::foo` 참조 해결 변경

> **Issue**: [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 동작
>
> **Deprecation cycle**:
>
> - 1.6.0: 현재 컴패니언 객체 인스턴스에 바인딩된 호출 가능 참조에 대해 경고 보고
> - 2.0.0: 새로운 동작 구현; 타입 주위에 괄호를 추가해도 더 이상 타입의 컴패니언 객체 인스턴스에 대한 참조가 아님

### 실질적으로 public인 인라인 함수에서 암시적 비-public API 접근 금지

> **Issue**: [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.8.20: public 인라인 함수에서 암시적 비-public API에 접근할 때 컴파일 경고 보고
> - 2.0.0: 경고를 오류로 격상

### 속성 getter에 대한 use-site `get` 어노테이션 금지

> **Issue**: [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.9.0: getter에 대한 use-site `get` 어노테이션에 대해 경고 보고 (프로그레시브 모드에서는 오류)
> - 2.0.0: 경고를 `INAPPLICABLE_TARGET_ON_PROPERTY` 오류로 격상; 경고로 되돌리려면 `-XXLanguage:-ProhibitUseSiteGetTargetAnnotations` 사용

### 빌더 추론 람다 함수에서 타입 매개변수가 상위 바운드로 암시적으로 추론되는 것을 방지

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.7.20: 타입 인수에 대한 타입 매개변수가 선언된 상위 바운드로 추론될 수 없을 때 경고 보고 (또는 프로그레시브 모드에서는 오류)
> - 2.0.0: 경고를 오류로 격상

### public 시그니처에서 로컬 타입을 근사화할 때 널러블리티 유지

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.8.0: 유연한 타입은 유연한 상위 타입으로 근사화됨; 널러블이어야 하는 non-null 타입으로 선언이 추론될 때 경고 보고하며, NPE를 피하기 위해 타입을 명시적으로 지정하도록 안내
> - 2.0.0: 널러블 타입은 널러블 상위 타입으로 근사화됨

### 스마트 캐스팅을 위해 `false && ...` 및 `false || ...`에 대한 특수 처리 제거

> **Issue**: [KT-65776](https://youtrack.com/issue/KT-65776)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 2.0.0: 새로운 동작 구현; `false && ...` 및 `false || ...`에 대한 특수 처리 없음

### enum 내 인라인 open 함수 금지

> **Issue**: [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Deprecation cycle**:
>
> - 1.8.0: enum 내 인라인 open 함수에 대해 경고 보고
> - 2.0.0: 경고를 오류로 격상

## 도구

### Gradle의 가시성 변경

> **Issue**: [KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: 이전에는 특정 DSL 컨텍스트를 위해 의도된 Kotlin DSL 함수와 속성이 의도치 않게 다른 DSL 컨텍스트로 유출되는 경우가 있었습니다. `KotlinGradlePluginDsl` 어노테이션이 추가되어, Kotlin Gradle 플러그인 DSL 함수 및 속성이 사용 가능하도록 의도되지 않은 레벨로 노출되는 것을 방지합니다. 다음 레벨들은 서로 분리됩니다:
> * Kotlin 확장 (Kotlin extension)
> * Kotlin 타겟 (Kotlin target)
> * Kotlin 컴파일 (Kotlin compilation)
> * Kotlin 컴파일 태스크 (Kotlin compilation task)
>
> **Deprecation cycle**:
>
> - 2.0.0: 대부분의 일반적인 경우, 빌드 스크립트가 잘못 구성된 경우 컴파일러가 수정 방법을 제안하는 경고를 보고합니다; 그렇지 않으면 컴파일러가 오류를 보고합니다.

### `kotlinOptions` DSL 사용 중단

> **Issue**: [KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: `kotlinOptions` DSL 및 관련 `KotlinCompile<KotlinOptions>` 태스크 인터페이스를 통한 컴파일러 옵션 구성 기능이 사용 중단되었습니다.
>
> **Deprecation cycle**:
>
> - 2.0.0: 경고 보고

### `KotlinCompilation` DSL에서 `compilerOptions` 사용 중단

> **Issue**: [KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: `KotlinCompilation` DSL에서 `compilerOptions` 속성을 구성하는 기능이 사용 중단되었습니다.
>
> **Deprecation cycle**:
>
> - 2.0.0: 경고 보고

### `CInteropProcess` 처리의 기존 방식 사용 중단

> **Issue**: [KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: `CInteropProcess` 태스크와 `CInteropSettings` 클래스는 이제 `defFile` 및 `defFileProperty` 대신 `definitionFile` 속성을 사용합니다.
>
> `defFile`이 동적으로 생성될 때 `CInteropProcess` 태스크와 `defFile`을 생성하는 태스크 사이에 추가 `dependsOn` 관계를 추가할 필요가 없어졌습니다.
>
> Kotlin/Native 프로젝트에서 Gradle은 이제 빌드 프로세스 후반에 연결된 태스크가 실행된 후 `definitionFile` 속성의 존재 여부를 지연 확인합니다.
>
> **Deprecation cycle**:
>
> - 2.0.0: `defFile` 및 `defFileProperty` 매개변수는 사용 중단됨

### `kotlin.useK2` Gradle 속성 제거

> **Issue**: [KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **Component**: Gradle
>
> **Incompatible change type**: 동작
>
> **Short summary**: `kotlin.useK2` Gradle 속성이 제거되었습니다. Kotlin 1.9.*에서는 K2 컴파일러를 활성화하는 데 사용될 수 있었습니다. Kotlin 2.0.0 이상에서는 K2 컴파일러가 기본적으로 활성화되어 있으므로 해당 속성은 효과가 없으며 이전 컴파일러로 되돌리는 데 사용할 수 없습니다.
>
> **Deprecation cycle**:
>
> - 1.8.20: `kotlin.useK2` Gradle 속성이 사용 중단됨
> - 2.0.0: `kotlin.useK2` Gradle 속성이 제거됨

### 사용 중단된 플랫폼 플러그인 ID 제거

> **Issue**: [KT-65187](https://youtrack.com/issue/KT-65187)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: 다음 플랫폼 플러그인 ID에 대한 지원이 제거되었습니다:
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **Deprecation cycle**:
>
> - 1.3: 플랫폼 플러그인 ID가 사용 중단됨
> - 2.0.0: 플랫폼 플러그인 ID가 더 이상 지원되지 않음

### `outputFile` JavaScript 컴파일러 옵션 제거

> **Issue**: [KT-61116](https://youtrack.jetbrains.com/issue/KT-61116)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: `outputFile` JavaScript 컴파일러 옵션이 제거되었습니다. 대신, `Kotlin2JsCompile` 태스크의 `destinationDirectory` 속성을 사용하여 컴파일된 JavaScript 출력 파일이 작성될 디렉토리를 지정할 수 있습니다.
>
> **Deprecation cycle**:
>
> - 1.9.25: `outputFile` 컴파일러 옵션이 사용 중단됨
> - 2.0.0: `outputFile` 컴파일러 옵션이 제거됨