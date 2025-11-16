[//]: # (title: Kotlin 1.7.0 호환성 가이드)

_[언어의 현대성 유지](kotlin-evolution-principles.md)_ 및 _[편안한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 근본 원칙 중 일부입니다. 전자는 언어 발전을 저해하는 구조는 제거되어야 한다고 말하며, 후자는 코드 마이그레이션이 최대한 원활하게 진행될 수 있도록 이러한 제거를 사전에 충분히 알려야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 Kotlin 1.6에서 Kotlin 1.7로의 마이그레이션을 위한 완전한 참조 자료를 제공하며 모든 변경 사항을 요약합니다.

## 기본 용어

이 문서에서는 여러 종류의 호환성을 소개합니다:

-   _소스_: 소스 호환성이 없는 변경은 오류나 경고 없이 잘 컴파일되던 코드가 더 이상 컴파일되지 않도록 합니다.
-   _바이너리_: 두 바이너리 아티팩트가 바이너리 호환된다는 것은 서로 교환해도 로딩 또는 링크 오류가 발생하지 않는다는 의미입니다.
-   _동작_: 변경 사항이 동작 호환성이 없다는 것은 동일한 프로그램이 변경 사항을 적용하기 전과 후에 다른 동작을 보인다는 의미입니다.

이러한 정의는 순수 Kotlin에 대해서만 주어진 것임을 기억하세요. 다른 언어 관점에서의 Kotlin 코드의 호환성(예: Java에서)은 이 문서의 범위를 벗어납니다.

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
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### 안전 호출 결과는 항상 널러블로 만듭니다.

> **Issue**: [KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **Component**: 핵심 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.7에서는 안전 호출의 리시버(receiver)가 널러블이 아니더라도(non-nullable), 안전 호출 결과의 타입은 항상 널러블(nullable)인 것으로 간주합니다.
>
> **Deprecation cycle**:
>
> - &lt;1.3: 널러블이 아닌 리시버에 대한 불필요한 안전 호출에 경고 보고
> - 1.6.20: 불필요한 안전 호출의 결과 타입이 다음 버전에서 변경될 것임을 추가로 경고
> - 1.7.0: 안전 호출 결과의 타입을 널러블로 변경,  
> `-XXLanguage:-SafeCallsAreAlwaysNullable`를 사용하여 1.7 이전 동작으로 일시적으로 되돌릴 수 있습니다.

### 추상 슈퍼클래스 멤버에 대한 슈퍼 호출 위임 금지

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: 핵심 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin은 명시적 또는 암시적 슈퍼 호출이 슈퍼클래스의 _추상_ 멤버에 위임될 때 컴파일 오류를 보고합니다. 이는 슈퍼 인터페이스에 기본 구현이 있더라도 마찬가지입니다.
>
> **Deprecation cycle**:
>
> - 1.5.20: 모든 추상 멤버를 오버라이드하지 않는 비추상 클래스가 사용될 때 경고 도입
> - 1.7.0: 슈퍼 호출이 실제로 슈퍼클래스의 추상 멤버에 접근하는 경우 오류 보고
> - 1.7.0: `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 호환성 모드가 활성화된 경우 오류 보고;
>   프로그레시브 모드에서 오류 보고
> - &gt;=1.8.0: 모든 경우에 오류 보고

### 비공개 기본 생성자에서 선언된 비공개 타입을 가진 공개 프로퍼티 노출 금지

> **Issue**: [KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **Component**: 핵심 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin은 비공개 기본 생성자에서 비공개 타입을 가진 공개 프로퍼티를 선언하는 것을 방지합니다.
> 다른 패키지에서 이러한 프로퍼티에 접근하면 `IllegalAccessError`가 발생할 수 있습니다.
>
> **Deprecation cycle**:
>
> - 1.3.20: 비공개 생성자에서 선언되고 비공개 타입을 가진 공개 프로퍼티에 경고 보고
> - 1.6.20: 프로그레시브 모드에서 이 경고를 오류로 격상
> - 1.7.0: 이 경고를 오류로 격상

### enum 이름으로 한정된 초기화되지 않은 enum 엔트리에 대한 접근 금지

> **Issue**: [KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **Component**: 핵심 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.7에서는 enum 정적 초기화 블록에서 enum 이름으로 한정된 초기화되지 않은 enum 엔트리에 접근하는 것을 금지합니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: enum 정적 초기화 블록에서 초기화되지 않은 enum 엔트리에 접근할 때 오류 보고

### when 조건 분기 및 루프 조건에서 복잡한 불리언 표현식의 상수 값 계산 금지

> **Issue**: [KT-39883](https://youtrack.jetbrains.com/issue/KT-39883)
>
> **Component**: 핵심 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin은 리터럴 `true`와 `false`를 제외한 복잡한 상수 불리언 표현식을 기반으로 `when`의 완전성(exhaustiveness) 및 제어 흐름 추정(control flow assumptions)을 더 이상 수행하지 않습니다.
>
> **Deprecation cycle**:
>
> - 1.5.30: `when` 분기 또는 루프 조건에서 복잡한 상수 불리언 표현식을 기반으로 `when`의 완전성 또는 제어 흐름 도달성(reachability)이 결정될 때 경고 보고
> - 1.7.0: 이 경고를 오류로 격상

### enum, sealed, Boolean 주제를 가진 `when` 문은 기본적으로 완전(exhaustive)하도록 만듭니다.

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **Component**: 핵심 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.7에서는 enum, sealed, 또는 Boolean 주제를 가진 `when` 문이 완전하지 않을 때 오류를 보고합니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: enum, sealed, 또는 Boolean 주제를 가진 `when` 문이 완전하지 않을 때 경고 도입 (프로그레시브 모드에서는 오류)
> - 1.7.0: 이 경고를 오류로 격상

### when-with-subject에서 혼란스러운 문법 사용 중단

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: 핵심 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.6은 `when` 조건 표현식에서 몇 가지 혼란스러운 문법 구조를 지원 중단했습니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 영향을 받는 표현식에 대한 지원 중단 경고 도입
> - 1.8.0: 이 경고를 오류로 격상
> - &gt;= 1.8: 일부 지원 중단된 구조를 새로운 언어 기능에 재활용

### 타입 널러블성 향상 개선

> **Issue**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.7은 Java 코드에서 타입 널러블성 어노테이션(annotation)을 로드하고 해석하는 방식을 변경합니다.
>
> **Deprecation cycle**:
>
> - 1.4.30: 더 정확한 타입 널러블성이 오류로 이어질 수 있는 경우에 대한 경고 도입
> - 1.7.0: Java 타입의 널러블성을 더 정확하게 추론,
>   `-XXLanguage:-TypeEnhancementImprovementsInStrictMode`를 사용하여 1.7 이전 동작으로 일시적으로 되돌릴 수 있습니다.

### 다른 숫자 타입 간의 암시적 강제 변환 방지

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 동작
>
> **Short summary**: Kotlin은 의미상 해당 타입으로의 다운캐스트만 필요한 경우 숫자 값을 기본 숫자 타입으로 자동으로 변환하는 것을 피합니다.
>
> **Deprecation cycle**:
>
> - &lt; 1.5.30: 영향을 받는 모든 경우의 이전 동작
> - 1.5.30: 생성된 프로퍼티 위임 접근자(property delegate accessors)의 다운캐스트 동작 수정,
>   `-Xuse-old-backend`를 사용하여 1.5.30 이전 수정 동작으로 일시적으로 되돌릴 수 있습니다.
> - &gt;= 1.7.20: 영향을 받는 다른 경우의 다운캐스트 동작 수정

### 컴파일러 옵션 `-Xjvm-default`의 `enable` 및 `compatibility` 모드 지원 중단

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.6.20은 `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드 사용에 대해 경고합니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드에 대한 경고 도입
> - &gt;= 1.8.0: 이 경고를 오류로 격상

### 후행 람다를 사용하는 `suspend`라는 이름의 함수 호출 금지

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **Component**: 핵심 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.6부터는 함수 타입의 단일 인수를 후행 람다(trailing lambda)로 전달하는 `suspend`라는 이름의 사용자 함수를 호출하는 것이 더 이상 허용되지 않습니다.
>
> **Deprecation cycle**:
>
> - 1.3.0: 이러한 함수 호출에 경고 도입
> - 1.6.0: 이 경고를 오류로 격상
> - 1.7.0: `suspend`가 `{` 앞에 키워드로 파싱되도록 언어 문법 변경 도입

### 베이스 클래스가 다른 모듈에 있는 경우 베이스 클래스 프로퍼티에 대한 스마트 캐스트 금지

> **Issue**: [KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **Component**: 핵심 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.7부터는 슈퍼클래스가 다른 모듈에 위치한 경우 해당 슈퍼클래스의 프로퍼티에 대한 스마트 캐스트(smart cast)가 더 이상 허용되지 않습니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 다른 모듈에 있는 슈퍼클래스에 선언된 프로퍼티에 대한 스마트 캐스트에 경고 보고
> - 1.7.0: 이 경고를 오류로 격상,  
> `-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass`를 사용하여 1.7 이전 동작으로 일시적으로 되돌릴 수 있습니다.

### 타입 추론 시 의미 있는 제약 조건을 무시하지 않습니다.

> **Issue**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **Component**: 핵심 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.4-1.6에서는 잘못된 최적화로 인해 타입 추론 시 일부 타입 제약 조건을 무시했습니다.
> 이로 인해 불안정한(unsound) 코드를 작성하게 되어 런타임에 `ClassCastException`이 발생할 수 있었습니다.
> Kotlin 1.7은 이러한 제약 조건을 고려하여 불안정한 코드를 금지합니다.
>
> **Deprecation cycle**:
>
> - 1.5.20: 모든 타입 추론 제약 조건을 고려할 경우 타입 불일치가 발생하는 표현식에 경고 보고
> - 1.7.0: 모든 제약 조건을 고려하여 이 경고를 오류로 격상,  
> `-XXLanguage:-ProperTypeInferenceConstraintsProcessing`를 사용하여 1.7 이전 동작으로 일시적으로 되돌릴 수 있습니다.

## 표준 라이브러리

### 컬렉션 `min` 및 `max` 함수의 반환 타입을 점진적으로 널러블이 아닌(non-nullable) 것으로 변경합니다.

> **Issue**: [KT-38854](https://youtrack.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 소스
>
> **Short summary**: 컬렉션 `min` 및 `max` 함수의 반환 타입이 Kotlin 1.7에서 널러블이 아닌 것으로 변경됩니다.
>
> **Deprecation cycle**:
>
> - 1.4.0: `...OrNull` 함수를 동의어로 도입하고 영향을 받는 API 지원 중단 (이슈에서 자세한 내용 참조)
> - 1.5.0: 영향을 받는 API의 지원 중단 수준을 오류로 격상
> - 1.6.0: 공개 API에서 지원 중단된 함수 숨기기
> - 1.7.0: 영향을 받는 API를 재도입하되 널러블이 아닌 반환 타입으로 변경

### 부동 소수점 배열 함수: `contains`, `indexOf`, `lastIndexOf` 지원 중단

> **Issue**: [KT-28753](https://youtrack.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin은 전체 순서(total order) 대신 IEEE-754 순서로 값을 비교하는 부동 소수점 배열 함수 `contains`, `indexOf`, `lastIndexOf`를 지원 중단합니다.
>
> **Deprecation cycle**:
>
> - 1.4.0: 영향을 받는 함수를 경고와 함께 지원 중단
> - 1.6.0: 지원 중단 수준을 오류로 격상
> - 1.7.0: 공개 API에서 지원 중단된 함수 숨기기

### `kotlin.dom` 및 `kotlin.browser` 패키지의 선언을 `kotlinx.*`로 마이그레이션

> **Issue**: [KT-39330](https://youtrack.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 소스
>
> **Short summary**: `kotlin.dom` 및 `kotlin.browser` 패키지의 선언은 `stdlib`에서 분리할 준비를 위해 해당 `kotlinx.*` 패키지로 이동되었습니다.
>
> **Deprecation cycle**:
>
> - 1.4.0: `kotlinx.dom` 및 `kotlinx.browser` 패키지에 대체 API 도입
> - 1.4.0: `kotlin.dom` 및 `kotlin.browser` 패키지의 API를 지원 중단하고 위에서 언급한 새 API를 대체제로 제안
> - 1.6.0: 지원 중단 수준을 오류로 격상
> - &gt;= 1.8: `stdlib`에서 지원 중단된 함수 제거
> - &gt;= 1.8: `kotlinx.*` 패키지의 API를 별도 라이브러리로 이동

### 일부 JS 전용 API 지원 중단

> **Issue**: [KT-48587](https://youtrack.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 소스
>
> **Short summary**: `stdlib`의 일부 JS 전용 함수가 제거를 위해 지원 중단되었습니다. 여기에는 `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)` 및 비교 함수를 인수로 받는 배열의 `sort` 함수(예: `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`)가 포함됩니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 영향을 받는 함수를 경고와 함께 지원 중단
> - 1.8.0: 지원 중단 수준을 오류로 격상
> - 1.9.0: 공개 API에서 지원 중단된 함수 제거

## 도구

### `KotlinGradleSubplugin` 클래스 제거

> **Issue**: [KT-48831](https://youtrack.com/issue/KT-48831)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: `KotlinGradleSubplugin` 클래스를 제거합니다. 대신 `KotlinCompilerPluginSupportPlugin` 클래스를 사용하세요.
>
> **Deprecation cycle**:
>
> - 1.6.0: 지원 중단 수준을 오류로 격상
> - 1.7.0: 지원 중단된 클래스 제거

### `useIR` 컴파일러 옵션 제거

> **Issue**: [KT-48847](https://youtrack.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: 지원 중단되고 숨겨진 `useIR` 컴파일러 옵션을 제거합니다.
>
> **Deprecation cycle**:
>
> - 1.5.0: 지원 중단 수준을 경고로 격상
> - 1.6.0: 옵션 숨기기
> - 1.7.0: 지원 중단된 옵션 제거

### `kapt.use.worker.api` Gradle 프로퍼티 지원 중단

> **Issue**: [KT-48826](https://youtrack.com/issue/KT-48826)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: Gradle Workers API를 통해 kapt를 실행할 수 있도록 허용했던 `kapt.use.worker.api` 프로퍼티를 지원 중단합니다 (기본값: true).
>
> **Deprecation cycle**:
>
> - 1.6.20: 지원 중단 수준을 경고로 격상
> - &gt;= 1.8.0: 이 프로퍼티 제거

### `kotlin.experimental.coroutines` Gradle DSL 옵션 및 `kotlin.coroutines` Gradle 프로퍼티 제거

> **Issue**: [KT-50494](https://youtrack.com/issue/KT-50494)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: `kotlin.experimental.coroutines` Gradle DSL 옵션 및 `kotlin.coroutines` 프로퍼티를 제거합니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 지원 중단 수준을 경고로 격상
> - 1.7.0: DSL 옵션, 이를 포함하는 `experimental` 블록, 그리고 해당 프로퍼티 제거

### `useExperimentalAnnotation` 컴파일러 옵션 지원 중단

> **Issue**: [KT-47763](https://youtrack.com/issue/KT-47763)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: 모듈에서 API 사용을 옵트인(opt in)하는 데 사용되었던 숨겨진 `useExperimentalAnnotation()` Gradle 함수를 제거합니다.
> 대신 `optIn()` 함수를 사용할 수 있습니다.
>
> **Deprecation cycle:**
>
> - 1.6.0: 지원 중단 옵션 숨기기
> - 1.7.0: 지원 중단된 옵션 제거

### `kotlin.compiler.execution.strategy` 시스템 프로퍼티 지원 중단

> **Issue**: [KT-51830](https://youtrack.com/issue/KT-51830)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: 컴파일러 실행 전략을 선택하는 데 사용되었던 `kotlin.compiler.execution.strategy` 시스템 프로퍼티를 지원 중단합니다.
> 대신 Gradle 프로퍼티 `kotlin.compiler.execution.strategy` 또는 컴파일 태스크 프로퍼티 `compilerExecutionStrategy`를 사용하세요.
>
> **Deprecation cycle:**
>
> - 1.7.0: 지원 중단 수준을 경고로 격상
> - &gt; 1.7.0: 해당 프로퍼티 제거

### `kotlinOptions.jdkHome` 컴파일러 옵션 제거

> **Issue**: [KT-46541](https://youtrack.com/issue/KT-46541)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: 기본 `JAVA_HOME` 대신 지정된 위치의 커스텀 JDK를 클래스패스에 포함하는 데 사용되었던 `kotlinOptions.jdkHome` 컴파일러 옵션을 제거합니다.
> 대신 [Java 툴체인](gradle-configure-project.md#gradle-java-toolchains-support)을 사용하세요.
>
> **Deprecation cycle:**
>
> - 1.5.30: 지원 중단 수준을 경고로 격상
> - &gt; 1.7.0: 해당 옵션 제거

### `noStdlib` 컴파일러 옵션 제거

> **Issue**: [KT-49011](https://youtrack.com/issue/KT-49011)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: `noStdlib` 컴파일러 옵션을 제거합니다. Gradle 플러그인은 `kotlin.stdlib.default.dependency=true` 프로퍼티를 사용하여 Kotlin 표준 라이브러리 포함 여부를 제어합니다.
>
> **Deprecation cycle:**
>
> - 1.5.0: 지원 중단 수준을 경고로 격상
> - 1.7.0: 해당 옵션 제거

### `kotlin2js` 및 `kotlin-dce-plugin` 플러그인 제거

> **Issue**: [KT-48276](https://youtrack.com/issue/KT-48276)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: `kotlin2js` 및 `kotlin-dce-plugin` 플러그인을 제거합니다. `kotlin2js` 대신 새로운 `org.jetbrains.kotlin.js` 플러그인을 사용하세요.
> 데드 코드 제거(DCE)는 Kotlin/JS Gradle 플러그인이 올바르게 구성되면 작동합니다.
>
> **Deprecation cycle:**
>
> - 1.4.0: 지원 중단 수준을 경고로 격상
> - 1.7.0: 플러그인 제거

### 컴파일 태스크 변경 사항

> **Issue**: [KT-32805](https://youtrack.com/issue/KT-32805)
>
> **Component**: Gradle
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 컴파일 태스크는 더 이상 Gradle `AbstractCompile` 태스크를 상속하지 않으므로, `sourceCompatibility` 및 `targetCompatibility` 입력은 Kotlin 사용자 스크립트에서 더 이상 사용할 수 없습니다. `SourceTask.stableSources` 입력은 더 이상 사용할 수 없습니다. `sourceFilesExtensions` 입력은 제거되었습니다. 지원 중단된 `Gradle destinationDir: File` 출력은 `destinationDirectory: DirectoryProperty` 출력으로 대체되었습니다. `KotlinCompile` 태스크의 `classpath` 프로퍼티는 지원 중단되었습니다.
>
> **Deprecation cycle:**
>
> - 1.7.0: 입력 사용 불가, 출력 대체, `classpath` 프로퍼티 지원 중단