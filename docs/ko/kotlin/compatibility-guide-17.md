[//]: # (title: Kotlin 1.7.0 호환성 가이드)

_[언어의 현대성 유지](kotlin-evolution-principles.md)_와 _[편안한 업데이트](kotlin-evolution-principles.md)_는 코틀린 언어 디자인의 핵심 원칙 중 일부입니다. 전자는 언어의 발전을 저해하는 구조는 제거해야 한다는 원칙이며, 후자는 이러한 제거가 코드 마이그레이션을 가능한 한 원활하게 할 수 있도록 사전에 충분히 안내되어야 한다는 원칙입니다.

대부분의 언어 변경 사항은 업데이트 변경 로그나 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 코틀린 1.6에서 코틀린 1.7로 마이그레이션하기 위한 완전한 참고 자료를 제공하기 위해 모든 내용을 요약하고 있습니다.

## 기본 용어

이 문서에서는 몇 가지 종류의 호환성을 소개합니다.

- _소스(source)_: 소스 호환성이 깨지는 변경은 기존에 잘 컴파일되던(에러나 경고 없이) 코드가 더 이상 컴파일되지 않게 되는 것을 의미합니다.
- _바이너리(binary)_: 두 바이너리 아티팩트를 서로 교체해도 로딩이나 링크 에러가 발생하지 않는 경우, 이를 바이너리 호환성이 있다고 합니다.
- _동작(behavioral)_: 변경 전후에 동일한 프로그램이 서로 다른 동작을 나타내는 경우, 동작 호환성이 깨지는 변경이라고 합니다.

이러한 정의는 순수 코틀린에 대해서만 적용된다는 점을 기억하세요. 다른 언어 관점(예: Java)에서의 코틀린 코드 호환성은 이 문서의 범위를 벗어납니다.

## 언어(Language)

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
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### 세이프 콜 결과의 타입을 항상 nullable로 변경

> **이슈**: [KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: 코틀린 1.7부터는 세이프 콜(safe call)의 수신 객체(receiver)가 non-nullable이더라도 세이프 콜 결과의 타입을 항상 nullable로 간주합니다.
>
> **지원 중단 주기(Deprecation cycle)**:
>
> - 1.3 미만: non-nullable 수신 객체에 대한 불필요한 세이프 콜에 경고를 리포트합니다.
> - 1.6.20: 불필요한 세이프 콜의 결과 타입이 다음 버전에서 변경될 것임을 추가로 경고합니다.
> - 1.7.0: 세이프 콜 결과의 타입을 nullable로 변경합니다.  
> `-XXLanguage:-SafeCallsAreAlwaysNullable`을 사용하여 코틀린 1.7 이전의 동작으로 일시적으로 되돌릴 수 있습니다.

### 추상 상위 클래스 멤버로의 super 호출 위임 금지

> **이슈**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
> 
> **요약**: 상위 인터페이스에 기본 구현(default implementation)이 있더라도, 명시적 또는 암시적인 `super` 호출이 상위 클래스의 _추상(abstract)_ 멤버로 위임되는 경우 컴파일 에러를 리포트합니다.
>
> **지원 중단 주기**:
>
> - 1.5.20: 모든 추상 멤버를 오버라이드하지 않은 비추상(non-abstract) 클래스가 사용될 때 경고를 도입합니다.
> - 1.7.0: `super` 호출이 실제로 상위 클래스의 추상 멤버에 액세스하는 경우 에러를 리포트합니다.
> - 1.7.0: `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 호환 모드가 활성화된 경우 에러를 리포트합니다. 프로그레시브 모드(progressive mode)에서 에러를 리포트합니다.
> - 1.8.0 이상: 모든 경우에 에러를 리포트합니다.

### 비공개(non-public) 기본 생성자에 선언된 공개(public) 프로퍼티를 통한 비공개 타입 노출 금지

> **이슈**: [KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: 코틀린은 비공개 기본 생성자에서 비공개 타입을 가지는 공개 프로퍼티를 선언하는 것을 금지합니다. 다른 패키지에서 이러한 프로퍼티에 액세스하면 `IllegalAccessError`가 발생할 수 있습니다.
>
> **지원 중단 주기**:
>
> - 1.3.20: 비공개 생성자에 선언되고 비공개 타입을 가지는 공개 프로퍼티에 대해 경고를 리포트합니다.
> - 1.6.20: 프로그레시브 모드에서 이 경고를 에러로 격상합니다.
> - 1.7.0: 이 경고를 에러로 격상합니다.

### 열거형 이름을 통해 한정된 초기화되지 않은 enum 엔트리에 대한 액세스 금지

> **이슈**: [KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: 코틀린 1.7은 enum 정적 초기화 블록에서 enum 엔트리가 enum 이름으로 한정되어(qualified) 액세스될 때, 초기화되지 않은 enum 엔트리에 대한 액세스를 금지합니다.
>
> **지원 중단 주기**:
>
> - 1.7.0: enum 정적 초기화 블록에서 초기화되지 않은 enum 엔트리에 액세스할 때 에러를 리포트합니다.

### when 조건 분기 및 루프 조건에서 복잡한 불리언 표현식의 상수 값 계산 금지

> **이슈**: [KT-39883](https://youtrack.jetbrains.com/issue/KT-39883)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: 코틀린은 더 이상 리터럴 `true` 및 `false` 이외의 상수 불리언 표현식을 기반으로 망라성(exhaustiveness) 및 제어 흐름 가정을 수행하지 않습니다.
>
> **지원 중단 주기**:
>
> - 1.5.30: `when`의 망라성 또는 제어 흐름 도달 가능성이 `when` 분기나 루프 조건의 복잡한 상수 불리언 표현식을 기반으로 결정될 때 경고를 리포트합니다.
> - 1.7.0: 이 경고를 에러로 격상합니다.

### enum, sealed, Boolean 대상의 when 문을 기본적으로 망라적으로 변경

> **이슈**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: 코틀린 1.7은 enum, sealed 또는 Boolean 대상의 `when` 문이 망라적이지 않은 경우 에러를 리포트합니다.
>
> **지원 중단 주기**:
>
> - 1.6.0: enum, sealed 또는 Boolean 대상의 `when` 문이 망라적이지 않은 경우 경고를 도입합니다 (프로그레시브 모드에서는 에러).
> - 1.7.0: 이 경고를 에러로 격상합니다.

### when-with-subject의 혼란스러운 문법 지원 중단

> **이슈**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: 코틀린 1.6에서 `when` 조건식의 몇 가지 혼란스러운 문법 구조에 대해 지원 중단(deprecated) 처리를 했습니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: 영향을 받는 표현식에 대해 지원 중단 경고를 도입합니다.
> - 1.8.0: 이 경고를 에러로 격상합니다.
> - 1.8 이상: 일부 지원 중단된 구조를 새로운 언어 기능을 위해 재사용합니다.

### 타입 널 허용성(nullability) 개선 사항

> **이슈**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환성 변경 유형**: 소스
>
> **요약**: 코틀린 1.7은 Java 코드의 타입 널 허용성 어노테이션을 로드하고 해석하는 방식을 변경합니다.
>
> **지원 중단 주기**:
>
> - 1.4.30: 더 정밀한 타입 널 허용성으로 인해 에러가 발생할 수 있는 경우에 대해 경고를 도입합니다.
> - 1.7.0: Java 타입의 더 정밀한 널 허용성을 추론합니다.  
> `-XXLanguage:-TypeEnhancementImprovementsInStrictMode`를 사용하여 코틀린 1.7 이전의 동작으로 일시적으로 되돌릴 수 있습니다.

### 서로 다른 숫자 타입 간의 암시적 강제 변환 방지

> **이슈**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환성 변경 유형**: 동작
>
> **요약**: 코틀린은 의미상 해당 타입으로의 다운캐스트(downcast)만 필요한 곳에서 숫자 값을 기본 숫자 타입으로 자동으로 변환하는 것을 피합니다.
>
> **지원 중단 주기**:
>
> - 1.5.30 미만: 모든 영향을 받는 케이스에 대해 기존 동작이 유지됩니다.
> - 1.5.30: 생성된 프로퍼티 위임 접근자(property delegate accessors)의 다운캐스트 동작을 수정합니다.  
> `-Xuse-old-backend`를 사용하여 1.5.30 수정 이전의 동작으로 일시적으로 되돌릴 수 있습니다.
> - 1.7.20 이상: 영향을 받는 다른 케이스의 다운캐스트 동작을 수정합니다.

### 컴파일러 옵션 -Xjvm-default의 enable 및 compatibility 모드 지원 중단

> **이슈**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환성 변경 유형**: 소스
>
> **요약**: 코틀린 1.6.20부터 `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드 사용에 대해 경고합니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드에 대해 경고를 도입합니다.
> - 1.8.0 이상: 이 경고를 에러로 격상합니다.

### 후행 람다를 사용하는 suspend라는 이름의 함수 호출 금지

> **이슈**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: 코틀린 1.6부터는 함수 타입의 단일 인자를 후행 람다(trailing lambda)로 전달받는 `suspend`라는 이름의 사용자 정의 함수 호출을 더 이상 허용하지 않습니다.
>
> **지원 중단 주기**:
>
> - 1.3.0: 이러한 함수 호출에 대해 경고를 도입합니다.
> - 1.6.0: 이 경고를 에러로 격상합니다.
> - 1.7.0: `{` 앞의 `suspend`가 키워드로 파싱되도록 언어 문법을 변경합니다.

### 기본 클래스가 다른 모듈에 있는 경우 기본 클래스 프로퍼티에 대한 스마트 캐스트 금지

> **이슈**: [KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: 코틀린 1.7부터 상위 클래스가 다른 모듈에 있는 경우 해당 클래스의 프로퍼티에 대한 스마트 캐스트를 더 이상 허용하지 않습니다.
>
> **지원 중단 주기**:
>
> - 1.6.0: 다른 모듈에 있는 상위 클래스에 선언된 프로퍼티에 대한 스마트 캐스트에 대해 경고를 리포트합니다.
> - 1.7.0: 이 경고를 에러로 격상합니다.  
> `-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass`를 사용하여 코틀린 1.7 이전의 동작으로 일시적으로 되돌릴 수 있습니다.

### 타입 추론 중 의미 있는 제약 조건 무시 금지

> **이슈**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **요약**: 코틀린 1.4~1.6에서는 잘못된 최적화로 인해 타입 추론 중에 일부 타입 제약 조건이 무시되었습니다. 이로 인해 런타임에 `ClassCastException`을 일으킬 수 있는 불안정한 코드가 허용될 수 있었습니다. 코틀린 1.7에서는 이러한 제약 조건을 고려하여 불안정한 코드를 금지합니다.
>
> **지원 중단 주기**:
>
> - 1.5.20: 모든 타입 추론 제약 조건을 고려했을 때 타입 불일치가 발생할 수 있는 표현식에 대해 경고를 리포트합니다.
> - 1.7.0: 모든 제약 조건을 고려하여 이 경고를 에러로 격상합니다.  
> `-XXLanguage:-ProperTypeInferenceConstraintsProcessing`을 사용하여 코틀린 1.7 이전의 동작으로 일시적으로 되돌릴 수 있습니다.

## 표준 라이브러리(Standard library)

### 컬렉션 min 및 max 함수의 반환 타입을 단계적으로 non-nullable로 변경

> **이슈**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환성 변경 유형**: 소스
>
> **요약**: 코틀린 1.7에서 컬렉션 `min` 및 `max` 함수의 반환 타입이 non-nullable로 변경됩니다.
>
> **지원 중단 주기**:
>
> - 1.4.0: `...OrNull` 함수를 동의어로 도입하고 영향을 받는 API를 지원 중단합니다(자세한 내용은 이슈 참고).
> - 1.5.0: 영향을 받는 API의 지원 중단 수준을 에러로 격상합니다.
> - 1.6.0: 지원 중단된 함수를 공개 API에서 숨깁니다.
> - 1.7.0: 영향을 받는 API를 non-nullable 반환 타입으로 다시 도입합니다.

### 부동 소수점 배열 함수 지원 중단: contains, indexOf, lastIndexOf

> **이슈**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환성 변경 유형**: 소스
>
> **요약**: 코틀린은 전체 순서(total order) 대신 IEEE-754 순서를 사용하여 값을 비교하는 부동 소수점 배열 함수 `contains`, `indexOf`, `lastIndexOf`를 지원 중단합니다.
>
> **지원 중단 주기**:
>
> - 1.4.0: 영향을 받는 함수를 경고와 함께 지원 중단합니다.
> - 1.6.0: 지원 중단 수준을 에러로 격상합니다.
> - 1.7.0: 지원 중단된 함수를 공개 API에서 숨깁니다.

### kotlin.dom 및 kotlin.browser 패키지의 선언을 kotlinx.*로 마이그레이션

> **이슈**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **컴포넌트**: kotlin-stdlib (JS)
>
> **호환성 변경 유형**: 소스
>
> **요약**: `kotlin.dom` 및 `kotlin.browser` 패키지의 선언을 stdlib에서 분리하기 위해 해당 `kotlinx.*` 패키지로 이동합니다.
>
> **지원 중단 주기**:
>
> - 1.4.0: `kotlinx.dom` 및 `kotlinx.browser` 패키지에 대체 API를 도입합니다.
> - 1.4.0: `kotlin.dom` 및 `kotlin.browser` 패키지의 API를 지원 중단하고 위의 새 API를 대체제로 제안합니다.
> - 1.6.0: 지원 중단 수준을 에러로 격상합니다.
> - 1.8 이상: stdlib에서 지원 중단된 함수를 제거합니다.
> - 1.8 이상: kotlinx.* 패키지의 API를 별도의 라이브러리로 이동합니다.

### 일부 JS 전용 API 지원 중단

> **이슈**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **컴포넌트**: kotlin-stdlib (JS)
>
> **호환성 변경 유형**: 소스
>
> **요약**: stdlib의 다수 JS 전용 함수들이 제거를 위해 지원 중단됩니다. 여기에는 `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)`, 그리고 비교 함수를 받는 배열의 `sort` 함수(예: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`)가 포함됩니다.
>
> **지원 중단 주기**:
>
> - 1.6.0: 영향을 받는 함수를 경고와 함께 지원 중단합니다.
> - 1.8.0: 지원 중단 수준을 에러로 격상합니다.
> - 1.9.0: 공개 API에서 지원 중단된 함수를 제거합니다.

## 도구(Tools)

### KotlinGradleSubplugin 클래스 제거

> **이슈**: [KT-48831](https://youtrack.jetbrains.com/issue/KT-48831)
>
> **컴포넌트**: Gradle
>
> **호환성 변경 유형**: 소스
>
> **요약**: `KotlinGradleSubplugin` 클래스를 제거합니다. 대신 `KotlinCompilerPluginSupportPlugin` 클래스를 사용하세요.
>
> **지원 중단 주기**:
>
> - 1.6.0: 지원 중단 수준을 에러로 격상합니다.
> - 1.7.0: 지원 중단된 클래스를 제거합니다.

### useIR 컴파일러 옵션 제거

> **이슈**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **컴포넌트**: Gradle
>
> **호환성 변경 유형**: 소스
>
> **요약**: 지원 중단되어 숨겨진 `useIR` 컴파일러 옵션을 제거합니다.
>
> **지원 중단 주기**:
>
> - 1.5.0: 지원 중단 수준을 경고로 격상합니다.
> - 1.6.0: 옵션을 숨깁니다.
> - 1.7.0: 지원 중단된 옵션을 제거합니다.

### kapt.use.worker.api Gradle 프로퍼티 지원 중단

> **이슈**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **컴포넌트**: Gradle
>
> **호환성 변경 유형**: 소스
>
> **요약**: Gradle Workers API를 통해 kapt를 실행할 수 있게 했던 `kapt.use.worker.api` 프로퍼티(기본값: true)를 지원 중단합니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: 지원 중단 수준을 경고로 격상합니다.
> - 1.8.0 이상: 이 프로퍼티를 제거합니다.

### kotlin.experimental.coroutines Gradle DSL 옵션 및 kotlin.coroutines Gradle 프로퍼티 제거

> **이슈**: [KT-50494](https://youtrack.jetbrains.com/issue/KT-50494)
>
> **컴포넌트**: Gradle
>
> **호환성 변경 유형**: 소스
>
> **요약**: `kotlin.experimental.coroutines` Gradle DSL 옵션과 `kotlin.coroutines` 프로퍼티를 제거합니다.
>
> **지원 중단 주기**:
>
> - 1.6.20: 지원 중단 수준을 경고로 격상합니다.
> - 1.7.0: DSL 옵션, 이를 감싸는 `experimental` 블록 및 해당 프로퍼티를 제거합니다.

### useExperimentalAnnotation 컴파일러 옵션 지원 중단

> **이슈**: [KT-47763](https://youtrack.jetbrains.com/issue/KT-47763)
>
> **컴포넌트**: Gradle
>
> **호환성 변경 유형**: 소스
>
> **요약**: 모듈에서 API 사용을 옵트인(opt in)하는 데 사용되던 숨겨진 `useExperimentalAnnotation()` Gradle 함수를 제거합니다. 대신 `optIn()` 함수를 사용할 수 있습니다.
> 
> **지원 중단 주기:**
> 
> - 1.6.0: 지원 중단 옵션을 숨깁니다.
> - 1.7.0: 지원 중단된 옵션을 제거합니다.

### kotlin.compiler.execution.strategy 시스템 프로퍼티 지원 중단

> **이슈**: [KT-51830](https://youtrack.jetbrains.com/issue/KT-51830)
>
> **컴포넌트**: Gradle
>
> **호환성 변경 유형**: 소스
>
> **요약**: 컴파일러 실행 전략을 선택하는 데 사용되는 `kotlin.compiler.execution.strategy` 시스템 프로퍼티를 지원 중단합니다. 대신 Gradle 프로퍼티 `kotlin.compiler.execution.strategy` 또는 컴파일 태스크 프로퍼티 `compilerExecutionStrategy`를 사용하세요.
>
> **지원 중단 주기:**
>
> - 1.7.0: 지원 중단 수준을 경고로 격상합니다.
> - 1.7.0 초과: 프로퍼티를 제거합니다.

### kotlinOptions.jdkHome 컴파일러 옵션 제거

> **이슈**: [KT-46541](https://youtrack.jetbrains.com/issue/KT-46541)
>
> **컴포넌트**: Gradle
>
> **호환성 변경 유형**: 소스
>
> **요약**: 기본 `JAVA_HOME` 대신 지정된 위치의 커스텀 JDK를 클래스패스에 포함하는 데 사용되던 `kotlinOptions.jdkHome` 컴파일러 옵션을 제거합니다. 대신 [Java 툴체인(Java toolchains)](gradle-configure-project.md#gradle-java-toolchains-support)을 사용하세요.
>
> **지원 중단 주기:**
>
> - 1.5.30: 지원 중단 수준을 경고로 격상합니다.
> - 1.7.0 초과: 옵션을 제거합니다.

### noStdlib 컴파일러 옵션 제거

> **이슈**: [KT-49011](https://youtrack.jetbrains.com/issue/KT-49011)
>
> **컴포넌트**: Gradle
>
> **호환성 변경 유형**: 소스
>
> **요약**: `noStdlib` 컴파일러 옵션을 제거합니다. Gradle 플러그인은 `kotlin.stdlib.default.dependency=true` 프로퍼티를 사용하여 코틀린 표준 라이브러리의 존재 여부를 제어합니다.
>
> **지원 중단 주기:**
>
> - 1.5.0: 지원 중단 수준을 경고로 격상합니다.
> - 1.7.0: 옵션을 제거합니다.

### kotlin2js 및 kotlin-dce-plugin 플러그인 제거

> **이슈**: [KT-48276](https://youtrack.jetbrains.com/issue/KT-48276)
>
> **컴포넌트**: Gradle
>
> **호환성 변경 유형**: 소스
>
> **요약**: `kotlin2js` 및 `kotlin-dce-plugin` 플러그인을 제거합니다. `kotlin2js` 대신 새로운 `org.jetbrains.kotlin.js` 플러그인을 사용하세요. 죽은 코드 제거(DCE)는 Kotlin/JS Gradle 플러그인이 올바르게 구성되었을 때 작동합니다.

>
> **지원 중단 주기:**
>
> - 1.4.0: 지원 중단 수준을 경고로 격상합니다.
> - 1.7.0: 플러그인을 제거합니다.

### 컴파일 태스크 변경 사항

> **이슈**: [KT-32805](https://youtrack.jetbrains.com/issue/KT-32805)
>
> **컴포넌트**: Gradle
>
> **호환성 변경 유형**: 소스
>
> **요약**: 코틀린 컴파일 태스크는 더 이상 Gradle의 `AbstractCompile` 태스크를 상속하지 않습니다. 이로 인해 코틀린 사용자 스크립트에서 `sourceCompatibility` 및 `targetCompatibility` 입력을 더 이상 사용할 수 없습니다. `SourceTask.stableSources` 입력도 더 이상 사용할 수 없습니다. `sourceFilesExtensions` 입력이 제거되었습니다. 지원 중단된 `Gradle destinationDir: File` 출력은 `destinationDirectory: DirectoryProperty` 출력으로 대체되었습니다. `KotlinCompile` 태스크의 `classpath` 프로퍼티는 지원 중단되었습니다.
>
> **지원 중단 주기:**
>
> - 1.7.0: 입력을 사용할 수 없으며, 출력이 대체되고, `classpath` 프로퍼티가 지원 중단됩니다.