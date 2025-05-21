---
title: "Kotlin 1.7 호환성 가이드"
---
_[최신 언어 유지](kotlin-evolution-principles)_ 및 _[편리한 업데이트](kotlin-evolution-principles)_는 Kotlin 언어 디자인의 기본 원칙에 속합니다. 전자는 언어 발전을 저해하는 구조는 제거해야 한다고 말하며, 후자는 코드 마이그레이션을 최대한 원활하게 하기 위해 이러한 제거 사항을 사전에 잘 알려야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그나 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 Kotlin 1.6에서 Kotlin 1.7로의 마이그레이션에 대한 완전한 참조를 제공하면서 모든 변경 사항을 요약합니다.

## 기본 용어

이 문서에서는 여러 종류의 호환성을 소개합니다.

- _source_(소스): 소스 비호환 변경은 오류나 경고 없이 정상적으로 컴파일되던 코드가 더 이상 컴파일되지 않도록 합니다.
- _binary_(바이너리): 두 바이너리 아티팩트가 서로 교환되어도 로딩 또는 링키지 오류가 발생하지 않으면 바이너리 호환된다고 합니다.
- _behavioral_(동작): 변경 사항 적용 전후에 동일한 프로그램이 다른 동작을 보이면 동작 비호환 변경이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 제공됩니다. 다른 언어 관점에서의 Kotlin 코드 호환성
(예: Java)은 이 문서의 범위를 벗어납니다.

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

### safe call 결과가 항상 nullable이 되도록 설정

> **Issue**: [KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7은 safe call의 수신자가 non-nullable이더라도 safe call 결과의 유형을 항상 nullable로 간주합니다.
>
> **Deprecation cycle**:
>
> - &lt;1.3: non-nullable 수신자에 대한 불필요한 safe call에 대해 경고를 표시합니다.
> - 1.6.20: 불필요한 safe call의 결과가 다음 버전에서 유형을 변경한다는 경고를 추가합니다.
> - 1.7.0: safe call 결과의 유형을 nullable로 변경합니다.
> `-XXLanguage:-SafeCallsAreAlwaysNullable`을 사용하여 일시적으로 1.7 이전 동작으로 되돌릴 수 있습니다.

### superclass 멤버가 abstract인 super call의 위임을 금지합니다.

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin은 명시적 또는 묵시적 super call이 superclass의 _abstract_ 멤버에 위임될 때 컴파일 오류를 보고합니다.
> super interface에 기본 구현이 있는 경우에도 마찬가지입니다.
>
> **Deprecation cycle**:
>
> - 1.5.20: 모든 abstract 멤버를 override하지 않는 non-abstract 클래스가 사용될 때 경고를 도입합니다.
> - 1.7.0: super call이 실제로 superclass의 abstract 멤버에 접근하는 경우 오류를 보고합니다.
> - 1.7.0: `-Xjvm-default=all` 또는 `-Xjvm-default=all-compatibility` 호환성 모드가 활성화된 경우 오류를 보고합니다.
>   progressive 모드에서 오류를 보고합니다.
> - &gt;=1.8.0: 모든 경우에 오류를 보고합니다.

### non-public primary constructor에서 선언된 public 속성을 통해 non-public 유형을 노출하는 것을 금지합니다.

> **Issue**: [KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin은 private primary constructor에서 non-public 유형을 갖는 public 속성을 선언하는 것을 방지합니다.
> 다른 패키지에서 이러한 속성에 접근하면 `IllegalAccessError`가 발생할 수 있습니다.
>
> **Deprecation cycle**:
>
> - 1.3.20: non-public 유형을 갖고 non-public constructor에서 선언된 public 속성에 대해 경고를 보고합니다.
> - 1.6.20: progressive 모드에서 이 경고를 오류로 높입니다.
> - 1.7.0: 이 경고를 오류로 높입니다.

### enum 이름으로 한정된 초기화되지 않은 enum 항목에 대한 접근을 금지합니다.

> **Issue**: [KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7은 이러한 항목이 enum 이름으로 한정될 때 enum static initializer 블록에서 초기화되지 않은 enum 항목에 대한 접근을 금지합니다.
>
> **Deprecation cycle**:
>
> - 1.7.0: 초기화되지 않은 enum 항목이 enum static initializer 블록에서 접근될 때 오류를 보고합니다.

### when 조건 분기 및 루프 조건에서 복잡한 boolean 표현식의 상수 값 계산을 금지합니다.

> **Issue**: [KT-39883](https://youtrack.jetbrains.com/issue/KT-39883)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin은 더 이상 리터럴 `true` 및 `false` 이외의 상수 boolean 표현식을 기반으로 완전성 및 제어 흐름 가정을 하지 않습니다.
>
> **Deprecation cycle**:
>
> - 1.5.30: `when` 분기 또는 루프 조건에서 복잡한 상수 boolean 표현식을 기반으로 `when`의 완전성 또는 제어 흐름 도달 가능성이 결정될 때 경고를 보고합니다.
> - 1.7.0: 이 경고를 오류로 높입니다.

### enum, sealed 및 Boolean 주제를 사용하는 when 문을 기본적으로 완전하게 만듭니다.

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7은 enum, sealed 또는 Boolean 주제를 사용하는 `when` 문이 완전하지 않다는 오류를 보고합니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: enum, sealed 또는 Boolean 주제를 사용하는 `when` 문이 완전하지 않을 때 경고를 도입합니다(progressive 모드에서는 오류).
> - 1.7.0: 이 경고를 오류로 높입니다.

### when-with-subject에서 혼동스러운 문법을 더 이상 사용하지 않습니다.

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6은 `when` 조건 표현식에서 몇 가지 혼동스러운 문법 구조를 더 이상 사용하지 않습니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 영향을 받는 표현식에 대한 더 이상 사용 경고를 도입합니다.
> - 1.8.0: 이 경고를 오류로 높입니다.
> - &gt;= 1.8: 일부 더 이상 사용되지 않는 구조를 새로운 언어 기능에 맞게 변경합니다.

### 유형 nullability 개선 사항

> **Issue**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7은 Java 코드에서 유형 nullability 주석을 로드하고 해석하는 방식을 변경합니다.
>
> **Deprecation cycle**:
>
> - 1.4.30: 더 정확한 유형 nullability가 오류로 이어질 수 있는 경우에 대한 경고를 도입합니다.
> - 1.7.0: Java 유형의 더 정확한 nullability를 추론합니다.
> `-XXLanguage:-TypeEnhancementImprovementsInStrictMode`를 사용하여 일시적으로 1.7 이전 동작으로 되돌릴 수 있습니다.

### 서로 다른 숫자 유형 간의 묵시적 강제 변환을 방지합니다.

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin은 의미상 해당 유형으로의 다운캐스트만 필요한 경우 숫자 값을 기본 숫자 유형으로 자동 변환하는 것을 방지합니다.
>
> **Deprecation cycle**:
>
> - < 1.5.30: 영향을 받는 모든 경우의 이전 동작
> - 1.5.30: 생성된 속성 delegate 접근자에서 다운캐스트 동작을 수정합니다.
>   `-Xuse-old-backend`를 사용하여 일시적으로 1.5.30 이전 수정 동작으로 되돌릴 수 있습니다.
> - &gt;= 1.7.20: 다른 영향을 받는 경우에서 다운캐스트 동작을 수정합니다.

### 컴파일러 옵션 -Xjvm-default의 enable 및 compatibility 모드를 더 이상 사용하지 않습니다.

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6.20은 `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드 사용에 대해 경고합니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드에 대한 경고를 도입합니다.
> - &gt;= 1.8.0: 이 경고를 오류로 높입니다.

### trailing lambda를 사용하여 suspend라는 함수 호출을 금지합니다.

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6은 더 이상 함수 유형의 단일 인수가 trailing lambda로 전달되는 `suspend`라는 사용자 함수를 호출할 수 없습니다.
>
> **Deprecation cycle**:
>
> - 1.3.0: 이러한 함수 호출에 대한 경고를 도입합니다.
> - 1.6.0: 이 경고를 오류로 높입니다.
> - 1.7.0: `{` 앞의 `suspend`가 키워드로 구문 분석되도록 언어 문법을 변경합니다.

### base 클래스가 다른 모듈에 있는 경우 base 클래스 속성에 대한 스마트 캐스트를 금지합니다.

> **Issue**: [KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7은 해당 클래스가 다른 모듈에 있는 경우 superclass의 속성에 대한 스마트 캐스트를 더 이상 허용하지 않습니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 다른 모듈에 있는 superclass에서 선언된 속성에 대한 스마트 캐스트에 대해 경고를 보고합니다.
> - 1.7.0: 이 경고를 오류로 높입니다.
> `-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass`를 사용하여 일시적으로 1.7 이전 동작으로 되돌릴 수 있습니다.

### 유형 추론 중에 의미 있는 제약 조건을 무시하지 마십시오.

> **Issue**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.4−1.6은 잘못된 최적화로 인해 유형 추론 중에 일부 유형 제약 조건을 무시했습니다.
> 런타임에 `ClassCastException`을 일으키는 unsound 코드를 작성할 수 있습니다.
> Kotlin 1.7은 이러한 제약 조건을 고려하여 unsound 코드를 금지합니다.
>
> **Deprecation cycle**:
>
> - 1.5.20: 모든 유형 추론 제약 조건을 고려할 경우 유형 불일치가 발생하는 표현식에 대한 경고를 보고합니다.
> - 1.7.0: 모든 제약 조건을 고려하여 이 경고를 오류로 높입니다.
> `-XXLanguage:-ProperTypeInferenceConstraintsProcessing`을 사용하여 일시적으로 1.7 이전 동작으로 되돌릴 수 있습니다.

## 표준 라이브러리

### collection min 및 max 함수의 반환 유형을 점진적으로 non-nullable로 변경합니다.

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: collection `min` 및 `max` 함수의 반환 유형이 Kotlin 1.7에서 non-nullable로 변경됩니다.
>
> **Deprecation cycle**:
>
> - 1.4.0: `...OrNull` 함수를 동의어로 도입하고 영향을 받는 API를 더 이상 사용하지 않습니다(자세한 내용은 이슈 참조).
> - 1.5.0: 영향을 받는 API의 더 이상 사용 수준을 오류로 높입니다.
> - 1.6.0: 더 이상 사용되지 않는 함수를 public API에서 숨깁니다.
> - 1.7.0: 영향을 받는 API를 다시 도입하지만 non-nullable 반환 유형을 사용합니다.

### 부동 소수점 배열 함수 더 이상 사용하지 않음: contains, indexOf, lastIndexOf

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin은 전체 순서 대신 IEEE-754 순서를 사용하여 값을 비교하는 부동 소수점 배열 함수 `contains`, `indexOf`, `lastIndexOf`를 더 이상 사용하지 않습니다.
>
> **Deprecation cycle**:
>
> - 1.4.0: 경고와 함께 영향을 받는 함수를 더 이상 사용하지 않습니다.
> - 1.6.0: 더 이상 사용 수준을 오류로 높입니다.
> - 1.7.0: 더 이상 사용되지 않는 함수를 public API에서 숨깁니다.

### kotlin.dom 및 kotlin.browser 패키지의 선언을 kotlinx.*로 마이그레이션합니다.

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.dom` 및 `kotlin.browser` 패키지의 선언이 stdlib에서 추출할 준비를 하기 위해 해당 `kotlinx.*` 패키지로 이동되었습니다.
>
> **Deprecation cycle**:
>
> - 1.4.0: `kotlinx.dom` 및 `kotlinx.browser` 패키지에 대체 API를 도입합니다.
> - 1.4.0: `kotlin.dom` 및 `kotlin.browser` 패키지에서 API를 더 이상 사용하지 않고 위의 새 API를 대체 API로 제안합니다.
> - 1.6.0: 더 이상 사용 수준을 오류로 높입니다.
> - &gt;= 1.8: stdlib에서 더 이상 사용되지 않는 함수를 제거합니다.
> - &gt;= 1.8: kotlinx.* 패키지의 API를 별도의 라이브러리로 이동합니다.

### 일부 JS 전용 API를 더 이상 사용하지 않습니다.

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: stdlib의 여러 JS 전용 함수가 제거될 예정으로 더 이상 사용되지 않습니다. 여기에는 `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)` 및 비교 함수를 사용하는 배열의 `sort` 함수(예: `Array<out T>.sort(comparison: (a: T, b: T) `->` Int)`)가 포함됩니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 경고와 함께 영향을 받는 함수를 더 이상 사용하지 않습니다.
> - 1.8.0: 더 이상 사용 수준을 오류로 높입니다.
> - 1.9.0: public API에서 더 이상 사용되지 않는 함수를 제거합니다.

## 도구

### KotlinGradleSubplugin 클래스 제거

> **Issue**: [KT-48831](https://youtrack.jetbrains.com/issue/KT-48831)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinGradleSubplugin` 클래스를 제거합니다. 대신 `KotlinCompilerPluginSupportPlugin` 클래스를 사용합니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 더 이상 사용 수준을 오류로 높입니다.
> - 1.7.0: 더 이상 사용되지 않는 클래스를 제거합니다.

### useIR 컴파일러 옵션 제거

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 더 이상 사용되지 않고 숨겨진 `useIR` 컴파일러 옵션을 제거합니다.
>
> **Deprecation cycle**:
>
> - 1.5.0: 더 이상 사용 수준을 경고로 높입니다.
> - 1.6.0: 옵션을 숨깁니다.
> - 1.7.0: 더 이상 사용되지 않는 옵션을 제거합니다.

### kapt.use.worker.api Gradle 속성을 더 이상 사용하지 않습니다.

> **Issue**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Gradle Workers API를 통해 kapt를 실행할 수 있는 `kapt.use.worker.api` 속성(기본값: true)을 더 이상 사용하지 않습니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 더 이상 사용 수준을 경고로 높입니다.
> - &gt;= 1.8.0: 이 속성을 제거합니다.

### kotlin.experimental.coroutines Gradle DSL 옵션 및 kotlin.coroutines Gradle 속성 제거

> **Issue**: [KT-50494](https://youtrack.jetbrains.com/issue/KT-50494)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.experimental.coroutines` Gradle DSL 옵션과 `kotlin.coroutines` 속성을 제거합니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 더 이상 사용 수준을 경고로 높입니다.
> - 1.7.0: DSL 옵션, 이를 둘러싼 `experimental` 블록 및 속성을 제거합니다.

### useExperimentalAnnotation 컴파일러 옵션을 더 이상 사용하지 않습니다.

> **Issue**: [KT-47763](https://youtrack.jetbrains.com/issue/KT-47763)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 모듈에서 API를 사용하기 위해 옵트인하는 데 사용되는 숨겨진 `useExperimentalAnnotation()` Gradle 함수를 제거합니다.
> 대신 `optIn()` 함수를 사용할 수 있습니다.
> 
> **Deprecation cycle:**
> 
> - 1.6.0: 더 이상 사용 옵션을 숨깁니다.
> - 1.7.0: 더 이상 사용되지 않는 옵션을 제거합니다.

### kotlin.compiler.execution.strategy 시스템 속성을 더 이상 사용하지 않습니다.

> **Issue**: [KT-51830](https://youtrack.jetbrains.com/issue/KT-51830)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 컴파일러 실행 전략을 선택하는 데 사용되는 `kotlin.compiler.execution.strategy` 시스템 속성을 더 이상 사용하지 않습니다.
> 대신 Gradle 속성 `kotlin.compiler.execution.strategy` 또는 컴파일 작업 속성 `compilerExecutionStrategy`를 사용합니다.
>
> **Deprecation cycle:**
>
> - 1.7.0: 더 이상 사용 수준을 경고로 높입니다.
> - &gt; 1.7.0: 속성을 제거합니다.

### kotlinOptions.jdkHome 컴파일러 옵션 제거

> **Issue**: [KT-46541](https://youtrack.jetbrains.com/issue/KT-46541)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 지정된 위치에서 사용자 지정 JDK를 기본 `JAVA_HOME` 대신 classpath에 포함하는 데 사용되는 `kotlinOptions.jdkHome` 컴파일러 옵션을 제거합니다. 대신 [Java toolchains](gradle-configure-project#gradle-java-toolchains-support)를 사용하십시오.
>
> **Deprecation cycle:**
>
> - 1.5.30: 더 이상 사용 수준을 경고로 높입니다.
> - &gt; 1.7.0: 옵션을 제거합니다.

### noStdlib 컴파일러 옵션 제거

> **Issue**: [KT-49011](https://youtrack.jetbrains.com/issue/KT-49011)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `noStdlib` 컴파일러 옵션을 제거합니다. Gradle 플러그인은 `kotlin.stdlib.default.dependency=true` 속성을 사용하여 Kotlin 표준 라이브러리가 있는지 여부를 제어합니다.
>
> **Deprecation cycle:**
>
> - 1.5.0: 더 이상 사용 수준을 경고로 높입니다.
> - 1.7.0: 옵션을 제거합니다.

### kotlin2js 및 kotlin-dce-plugin 플러그인 제거

> **Issue**: [KT-48276](https://youtrack.jetbrains.com/issue/KT-48276)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin2js` 및 `kotlin-dce-plugin` 플러그인을 제거합니다. `kotlin2js` 대신 새 `org.jetbrains.kotlin.js` 플러그인을 사용합니다.
> Dead code elimination(DCE)은 Kotlin/JS Gradle 플러그인이 [제대로 구성된 경우](http://javascript-dce) 작동합니다.

>
> **Deprecation cycle:**
>
> - 1.4.0: 더 이상 사용 수준을 경고로 높입니다.
> - 1.7.0: 플러그인을 제거합니다.

### 컴파일 작업의 변경 사항

> **Issue**: [KT-32805](https://youtrack.jetbrains.com/issue/KT-32805)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 컴파일 작업은 더 이상 Gradle `AbstractCompile` 작업을 상속하지 않으므로 Kotlin 사용자 스크립트에서 `sourceCompatibility` 및 `targetCompatibility` 입력을 더 이상 사용할 수 없습니다.
> `SourceTask.stableSources` 입력을 더 이상 사용할 수 없습니다. `sourceFilesExtensions` 입력이 제거되었습니다.
> 더 이상 사용되지 않는 `Gradle destinationDir: File` 출력이 `destinationDirectory: DirectoryProperty` 출력으로 대체되었습니다.
> `KotlinCompile` 작업의 `classpath` 속성은 더 이상 사용되지 않습니다.
>
> **Deprecation cycle:**
>
> - 1.7.0: 입력을 사용할 수 없고 출력이 대체되었으며 `classpath` 속성이 더 이상 사용되지 않습니다.