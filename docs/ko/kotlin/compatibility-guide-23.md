[//]: # (title: Kotlin 2.3 호환성 가이드)

_[현대적인 언어 유지](kotlin-evolution-principles.md)_ 및 _[편안한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 기본 원칙 중 일부입니다. 전자는 언어 발전을 저해하는 구조는 제거되어야 한다고 말하며, 후자는 코드 마이그레이션을 최대한 원활하게 진행하기 위해 이러한 제거 사항이 미리 잘 소통되어야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서에서는 이러한 변경 사항을 모두 요약하여 Kotlin 2.2에서 Kotlin 2.3으로 마이그레이션하기 위한 완전한 참조 자료를 제공합니다. 이 문서에는 도구 관련 변경 사항에 대한 정보도 포함되어 있습니다.

## 기본 용어

이 문서에서는 몇 가지 종류의 호환성을 소개합니다:

-   _소스_: 소스 비호환 변경은 이전에는 문제없이(오류나 경고 없이) 컴파일되던 코드가 더 이상 컴파일되지 않게 하는 변경입니다.
-   _바이너리_: 두 바이너리 아티팩트는 서로 교환해도 로딩 또는 링크 오류가 발생하지 않는 경우 바이너리 호환된다고 합니다.
-   _동작_: 변경 사항은 동일한 프로그램이 변경 사항 적용 전후에 다른 동작을 보이는 경우 동작 비호환적이라고 합니다.

이러한 정의는 순수 Kotlin에만 적용된다는 점을 기억하십시오. 다른 언어(예: Java) 관점에서 Kotlin 코드의 호환성은 이 문서의 범위를 벗어납니다.

## 언어

### `-language-version`에서 1.8 및 1.9 지원 제거

> **이슈**: [KT-76343](https://youtrack.jetbrains.com/issue/KT-76343), [KT-76344](https://youtrack.jetbrains.com/issue/KT-76344).
>
> **구성 요소**: 컴파일러
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.3부터 컴파일러는 더 이상 [`-language-version=1.8`](compiler-reference.md#language-version-version)을 지원하지 않습니다. 비(非) JVM 플랫폼에 대한 `-language-version=1.9` 지원도 제거됩니다.
>
> **사용 중단 주기**:
>
> -   2.2.0: `-language-version`을 버전 1.8 및 1.9와 함께 사용할 때 경고를 보고합니다.
> -   2.3.0: 모든 플랫폼에서 버전 1.8의 `-language-version` 및 비(非) JVM 플랫폼에서 버전 1.9의 `-language-version`에 대한 경고를 오류로 격상합니다.

### 타입 별칭(typealias)이 있는 추론된 타입에 대한 상위 바운드 제약 조건 위반 오류 보고

> **이슈**: [KTLC-287](https://youtrack.jetbrains.com/issue/KTLC-287)
>
> **구성 요소**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: 이전에는 컴파일러가 추론된 타입에 대한 상위 바운드 위반 제약 조건 오류를 보고하지 않았습니다. 이 문제는 Kotlin 2.3.0에서 수정되어 모든 타입 파라미터에서 일관되게 오류가 보고됩니다.
>
> **사용 중단 주기**:
>
> -   2.2.20: 암시적 타입 인수에 의한 바운드 위반에 대한 사용 중단 경고를 보고합니다.
> -   2.3.0: 암시적 타입 인수에서 `UPPER_BOUND_VIOLATED` 경고를 오류로 격상합니다.

### `inline` 및 `crossinline` 람다에 `@JvmSerializableLambda` 어노테이션 사용 금지

> **이슈**: [KTLC-9](https://youtrack.jetbrains.com/issue/KTLC-9)
>
> **구성 요소**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: 더 이상 `@JvmSerializableLambda` 어노테이션을 `inline` 또는 `crossinline` 람다에 적용할 수 없습니다. 이러한 람다는 직렬화할 수 없으므로 `@JvmSerializableLambda`를 적용해도 효과가 없었습니다.
>
> **사용 중단 주기**:
>
> -   2.1.20: `@JvmSerializableLambda`가 `inline` 및 `crossinline` 람다에 적용될 때 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다; 이 변경 사항은 점진적 모드에서 활성화될 수 있습니다.

### 제네릭 시그니처가 일치하지 않을 때 Kotlin 인터페이스를 Java 클래스에 위임하는 것 금지

> **이슈**: [KTLC-267](https://youtrack.jetbrains.com/issue/KTLC-267)
>
> **구성 요소**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.3.0에서는 제네릭 인터페이스 메서드를 비제네릭 오버라이드로 구현하는 Java 클래스에 대한 위임을 금지합니다. 이전에는 이러한 동작을 허용하면 런타임에 타입 불일치 및 `ClassCastException`이 발생했습니다. 이 변경 사항은 오류 발생 시점을 런타임에서 컴파일 타임으로 옮깁니다.
>
> **사용 중단 주기**:
>
> -   2.1.20: 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### 명시적 반환 타입이 없는 표현식 본문 함수 내 `return` 사용 중단

> **이슈**: [KTLC-288](https://youtrack.jetbrains.com/issue/KTLC-288)
>
> **구성 요소**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin은 이제 함수의 반환 타입이 명시적으로 선언되지 않은 경우 표현식 본문 내에서 `return`을 사용하는 것을 사용 중단합니다.
>
> **사용 중단 주기**:
>
> -   2.3.0: 경고를 보고합니다.
> -   2.4.0: 경고를 오류로 격상합니다.

### 타입 별칭(typealias)을 통해 도입된 널 가능 슈퍼타입으로부터 상속 금지

> **이슈**: [KTLC-279](https://youtrack.jetbrains.com/issue/KTLC-279)
>
> **구성 요소**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin은 이제 널 가능 타입 별칭(typealias)에서 상속을 시도할 때 오류를 보고하며, 이는 직접적인 널 가능 슈퍼타입을 처리하는 방식과 일관됩니다.
>
> **사용 중단 주기**:
>
> -   2.2.0: 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### 최상위 람다 및 호출 인수에 대한 제네릭 시그니처 생성 통합

> **이슈**: [KTLC-277](https://youtrack.jetbrains.com/issue/KTLC-277)
>
> **구성 요소**: 리플렉션
>
> **비호환 변경 유형**: 동작
>
> **요약**: Kotlin 2.3.0은 최상위 람다에 대해 호출 인수로 전달된 람다와 동일한 타입 검사 로직을 사용하여 두 경우 모두에서 일관된 제네릭 시그니처 생성을 보장합니다.
>
> **사용 중단 주기**:
>
> -   2.3.0: 새로운 동작을 도입합니다; 점진적 모드에는 적용되지 않습니다.

### 재구성된(reified) 타입 파라미터가 교차 타입으로 추론되는 것 금지

> **이슈**: [KTLC-13](https://youtrack.jetbrains.com/issue/KTLC-13)
>
> **구성 요소**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.3.0은 재구성된(reified) 타입 파라미터가 교차 타입으로 추론되는 상황을 금지합니다. 이는 잘못된 런타임 동작으로 이어질 수 있기 때문입니다.
>
> **사용 중단 주기**:
>
> -   2.1.0: 재구성된 타입 파라미터가 교차 타입으로 추론될 때 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### 타입 파라미터 바운드를 통해 가시성이 더 낮은 타입 노출 금지

> **이슈**: [KTLC-275](https://youtrack.jetbrains.com/issue/KTLC-275)
>
> **구성 요소**: 코어 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.3.0은 함수 또는 선언 자체보다 더 제한적인 가시성을 가진 타입을 노출하는 타입 파라미터 바운드를 사용하는 것을 금지하며, 이는 함수에 대한 규칙을 클래스에 이미 적용된 규칙과 일치시킵니다.
>
> **사용 중단 주기**:
>
> -   2.1.0: 문제가 되는 타입 파라미터 바운드에 대해 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

## 표준 라이브러리

### Char-숫자 변환 사용 중단 및 명시적 숫자 및 코드 API 도입

> **이슈**: [KTLC-321](https://youtrack.jetbrains.com/issue/KTLC-321)
>
> **구성 요소**: kotlin-stdlib (코틀린 표준 라이브러리)
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.3.0은 숫자 타입에 대한 `Char.toX()` 및 `X.toChar()` 변환을 사용 중단하고, 문자의 코드와 숫자 값에 접근하기 위한 새롭고 명시적인 API를 도입합니다.
>
> **사용 중단 주기**:
>
> -   1.4.30: 새로운 함수를 실험적(Experimental)으로 도입합니다.
> -   1.5.0: 새로운 함수를 안정적(Stable)으로 승격합니다; 오래된 함수에 대한 경고와 대체 제안을 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### `Number.toChar()` 함수 사용 중단

> **이슈**: [KT-56822](https://youtrack.jetbrains.com/issue/KT-56822)
>
> **구성 요소**: kotlin-stdlib (코틀린 표준 라이브러리)
>
> **비호환 변경 유형**: 소스
>
> **요약**: `Number.toChar()` 함수는 사용 중단되었습니다. 대신 `toInt().toChar()` 또는 `Char` 생성자를 사용하십시오.
>
> **사용 중단 주기**:
>
> -   1.9.0: `Number.toChar()` 함수 사용 시 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### `String.subSequence(start, end)` 함수 사용 중단

> **이슈**: [KTLC-282](https://youtrack.jetbrains.com/issue/KTLC-282)
>
> **구성 요소**: kotlin-stdlib (코틀린 표준 라이브러리)
>
> **비호환 변경 유형**: 소스
>
> **요약**: `String.subSequence(start, end)` 함수는 사용 중단되었습니다. 대신 [`String.subSequence(startIndex, endIndex)`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/sub-sequence.html) 함수를 사용하십시오.
>
> **사용 중단 주기**:
>
> -   1.0: `String.subSequence(start, end)` 사용 시 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### `kotlin.io.createTempDirectory()` 및 `kotlin.io.createTempFile()` 함수 사용 중단

> **이슈**: [KTLC-281](https://youtrack.jetbrains.com/issue/KTLC-281)
>
> **구성 요소**: kotlin-stdlib (코틀린 표준 라이브러리)
>
> **비호환 변경 유형**: 소스
>
> **요약**: `kotlin.io.createTempDirectory()` 및 `kotlin.io.createTempFile()` 함수는 사용 중단되었습니다. 대신 [`kotlin.io.path.createTempDirectory()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.path/create-temp-directory.html) 및 [`kotlin.io.path.createTempFile()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.path/create-temp-file.html) 함수를 사용하십시오.
>
> **사용 중단 주기**:
>
> -   1.4.20: `kotlin.io.createTempDirectory()` 및 `kotlin.io.createTempFile()` 함수 사용 시 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### `InputStream.readBytes(Int)` 함수 숨김

> **이슈**: [KTLC-280](https://youtrack.jetbrains.com/issue/KTLC-280)
>
> **구성 요소**: kotlin-stdlib (코틀린 표준 라이브러리)
>
> **비호환 변경 유형**: 소스
>
> **요약**: 오랫동안 사용 중단된 후, `InputStream.readBytes(estimatedSize: Int = DEFAULT_BUFFER_SIZE): ByteArray` 함수는 이제 숨겨졌습니다.
>
> **사용 중단 주기**:
>
> -   1.3.0: 경고를 보고합니다.
> -   1.5.0: 경고를 오류로 격상합니다.
> -   2.3.0: 함수를 숨깁니다.

### Kotlin/Native 스택 트레이스 출력을 다른 플랫폼과 통합

> **이슈**: [KT-81431](https://youtrack.jetbrains.com/issue/KT-81431)
>
> **구성 요소**: Kotlin/Native
>
> **비호환 변경 유형**: 동작
>
> **요약**: 예외 스택 트레이스를 포맷할 때, 동일한 예외 원인이 이미 출력된 경우 추가 원인은 출력되지 않습니다.
>
> **사용 중단 주기**:
>
> -   2.3.20: Kotlin/Native 예외 스택 트레이스 포맷을 다른 Kotlin 플랫폼과 통합합니다.

### `Iterable<T>.intersect()` 및 `Iterable<T>.subtract()` 동작 수정

> **이슈**: [KTLC-268](https://youtrack.jetbrains.com/issue/KTLC-268)
>
> **구성 요소**: kotlin-stdlib (코틀린 표준 라이브러리)
>
> **비호환 변경 유형**: 동작
>
> **요약**: 이제 [`Iterable<T>.intersect()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/intersect.html) 및 [`Iterable<T>.subtract()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/subtract.html) 함수는 각 리시버(receiver) 요소를 결과 집합에 추가하기 전에 멤버십을 테스트합니다. 결과 집합은 `Any::equals`를 사용하여 요소를 비교하며, 인자 컬렉션이 참조 동등성(예: `IdentityHashMap.keys`)을 사용하는 경우에도 올바른 결과를 보장합니다.
>
> **사용 중단 주기**:
>
> -   2.3.0: 새로운 동작을 활성화합니다.

## 도구

### `kotlin-dsl` 및 `kotlin("jvm")` 플러그인 사용 시 지원되지 않는 KGP 버전 경고

> **이슈**: [KT-79851](https://youtrack.jetbrains.com/issue/KT-79851)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 동작
>
> **요약**: Kotlin 2.3에서 Gradle 프로젝트에 `kotlin-dsl`과 `kotlin("jvm")` 플러그인을 모두 사용하는 경우, 지원되지 않는 Kotlin Gradle 플러그인(KGP) 버전에 대한 Gradle 경고가 표시될 수 있습니다.
>
> **마이그레이션 단계**:
>
> 일반적으로 동일한 Gradle 프로젝트에서 `kotlin-dsl`과 `kotlin("jvm")` 플러그인을 모두 사용하는 것은 권장하지 않습니다. 이 설정은 지원되지 않습니다.
>
> 관례 플러그인(convention plugins), 사전 컴파일된 스크립트 플러그인 또는 게시되지 않은 빌드 로직의 다른 형태의 경우, 세 가지 옵션이 있습니다:
>
> 1.  `kotlin("jvm")` 플러그인을 명시적으로 적용하지 마십시오. 대신 `kotlin-dsl` 플러그인이 호환되는 KGP 버전을 자동으로 제공하도록 하십시오.
> 2.  `kotlin("jvm")` 플러그인을 명시적으로 적용하려면 [`embeddedKotlinVersion`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.kotlin.dsl/embedded-kotlin-version.html) 상수를 사용하여 내장된 Kotlin 버전을 지정하십시오.
>
>     내장된 Kotlin 및 언어 버전을 업그레이드하려면 Gradle 버전을 업데이트하십시오. Gradle의 [Kotlin 호환성 노트](https://docs.gradle.org/current/userguide/compatibility.html#kotlin)에서 호환되는 Gradle 버전을 찾을 수 있습니다.
> 3.  `kotlin-dsl` 플러그인을 사용하지 마십시오. 이는 특정 Gradle 버전에 묶여 있지 않은 바이너리 플러그인에 더 적합할 수 있습니다.
>
> 최후의 수단으로, `kotlin-dsl` 플러그인의 충돌하는 동작을 무시하도록 프로젝트를 언어 버전 2.1 이상을 사용하도록 구성할 수 있습니다. 그러나 그렇게 하지 않는 것을 강력히 권장합니다.
>
> 마이그레이션 중 어려움이 발생하면 [Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 #gradle 채널에서 지원을 요청하십시오.
>
> **사용 중단 주기**:
>
> -   2.3.0: 컴파일러의 호환되지 않는 언어 또는 API 버전과 함께 `kotlin-dsl` 플러그인이 사용될 때 이를 감지하는 진단 기능을 도입합니다.

### AGP 버전 9.0.0 이상에서 `kotlin-android` 플러그인 사용 중단

> **이슈**: [KT-81199](https://youtrack.jetbrains.com/issue/KT-81199)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.3.0에서 Android Gradle 플러그인(AGP) 버전 9.0.0 이상을 사용할 때 `org.jetbrains.kotlin.android` 플러그인은 사용 중단됩니다. AGP 9.0.0부터 [AGP는 Kotlin에 대한 내장 지원을 제공하므로](https://kotl.in/gradle/agp-built-in-kotlin), `kotlin-android` 플러그인은 더 이상 필요하지 않습니다.
>
> **사용 중단 주기**:
>
> -   2.3.0: `kotlin-android` 플러그인이 AGP 버전 9.0.0 이상과 함께 사용되고 `android.builtInKotlin` 및 `android.newDsl=false` Gradle 속성이 모두 `false`로 설정될 때 경고를 보고합니다.

### `testApi` 설정 사용 중단

> **이슈**: [KT-63285](https://youtrack.jetbrains.com/issue/KT-63285)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.3.0은 `testApi` 설정을 사용 중단합니다. 이 설정은 테스트 종속성 및 소스를 다른 모듈에 노출했지만, Gradle은 이 동작을 지원하지 않습니다.
>
> **마이그레이션 옵션**:
> `testApi()`의 모든 인스턴스를 `testImplementation()`으로 바꾸고, 다른 변형(variants)도 동일하게 처리하십시오. 예를 들어, `kotlin.sourceSets.commonTest.dependencies.api()`를 `kotlin.sourceSets.commonTest.dependencies.implementation()`으로 바꾸십시오.
>
> Kotlin/JVM 프로젝트의 경우, 대신 Gradle의 [테스트 픽스처(test fixtures)](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)를 사용하는 것을 고려하십시오.
> 다중 플랫폼 프로젝트에서 테스트 픽스처 지원을 원하시면, [YouTrack](https://youtrack.jetbrains.com/issue/KT-63142)에서 사용 사례를 공유하십시오.
>
> **사용 중단 주기**:
>
> -   2.3.0: 경고를 보고합니다.

### `createTestExecutionSpec()` 함수 사용 중단

> **이슈**: [KT-75449](https://youtrack.jetbrains.com/issue/KT-75449)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.3.0은 더 이상 사용되지 않으므로 `KotlinJsTestFramework` 인터페이스의 `createTestExecutionSpec()` 함수를 사용 중단합니다.
>
> **사용 중단 주기**:
>
> -   2.2.20: 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### `closureTo()`, `createResultSet()` 및 `KotlinToolingVersionOrNull()` 함수 제거

> **이슈**: [KT-64273](https://youtrack.jetbrains.com/issue/KT-64273)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.3.0은 `closure` DSL에서 더 이상 사용되지 않는 `closureTo()`, `createResultSet()` 함수를 제거합니다. 또한, `KotlinToolingVersionOrNull()` 함수가 제거됩니다. 대신 `KotlinToolingVersion()` 함수를 사용하십시오.
>
> **사용 중단 주기**:
>
> -   1.7.20: 오류를 보고합니다.
> -   2.3.0: 함수를 제거합니다.

### `ExtrasProperty` API 사용 중단

> **이슈**: [KT-74915](https://youtrack.jetbrains.com/issue/KT-74915)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.0.0부터 사용 중단된 `ExtrasProperty` API는 이제 Kotlin 2.3.0에서 내부화되었습니다. 대안으로 Gradle의 [`ExtraPropertiesExtension`](https://docs.gradle.org/current/dsl/org.gradle.api.plugins.ExtraPropertiesExtension.html) API를 사용하십시오.
>
> **사용 중단 주기**:
>
> -   2.0.0: 경고를 보고합니다.
> -   2.1.0: 경고를 오류로 격상합니다.
> -   2.3.0: API를 내부(internal)로 만듭니다.

### `KotlinCompilation` 내 `HasKotlinDependencies` 사용 중단

> **이슈**: [KT-67290](https://youtrack.jetbrains.com/issue/KT-67290)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.3.0은 [`KotlinCompilation`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compilation/) 인터페이스의 `HasKotlinDependencies`를 사용 중단합니다. 이제 종속성 관련 API는 [`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/) 인터페이스를 통해 노출됩니다.
>
> **사용 중단 주기**:
>
> -   2.3.0: 경고를 보고합니다.

### npm 및 Yarn 패키지 관리자 내부 함수 및 속성 사용 중단

> **이슈**: [KT-81009](https://youtrack.jetbrains.com/issue/KT-81009)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: npm 및 Yarn 패키지 관리자와 관련된 다음 함수 및 속성은 사용 중단됩니다:
>
> *   `CompositeDependency.dependencyName`, `CompositeDependency.dependencyVersion`, `CompositeDependency.includedBuildDir`.
> *   `KotlinNpmInstallTask.Companion.NAME`.
> *   `LockCopyTask.Companion.STORE_PACKAGE_LOCK_NAME`, `LockCopyTask.Companion.RESTORE_PACKAGE_LOCK_NAME`, `LockCopyTask.Companion.UPGRADE_PACKAGE_LOCK`.
> *   `Npm.npmExec()`.
> *   `NpmProject.require()`, `NpmProject.useTool()`.
> *   `PublicPackageJsonTask.jsIrCompilation`.
> *   `YarnBasics.yarnExec()`.
> *   `YarnPlugin.Companion.STORE_YARN_LOCK_NAME`, `YarnPlugin.Companion.RESTORE_YARN_LOCK_NAME`, `YarnPlugin.Companion.UPGRADE_YARN_LOCK`.
> *   `YarnSetupTask.Companion.NAME`.
>
> **사용 중단 주기**:
>
> -   2.2.0 및 2.2.20: 이 함수 또는 속성 사용 시 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### PhantomJS 지원 사용 중단

> **이슈**: [KT-76019](https://youtrack.jetbrains.com/issue/KT-76019)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: PhantomJS가 더 이상 유지 관리되지 않으므로 Kotlin 2.3.0은 `NpmVersions` API의 `karmaPhantomjsLauncher` 속성을 사용 중단합니다.
>
> **사용 중단 주기**:
>
> -   2.3.0: 경고를 보고합니다.

### 테스트 실행 또는 JavaScript 런타임을 설정하는 클래스의 서브클래싱 금지

> **이슈**: [KT-75869](https://youtrack.jetbrains.com/issue/KT-75869), [KT-81007](https://youtrack.jetbrains.com/issue/KT-81007)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.3.0은 다음 클래스들의 서브클래싱(subclassing)을 금지합니다:
> *   `KotlinTest`
> *   `KotlinNativeTest`
> *   `KotlinJsTest`
> *   `KotlinJsIrTarget`
> *   `KotlinNodeJsIr`
> *   `KotlinD8Ir`
> *   `KotlinKarma`
> *   `KotlinMocha`
> *   `KotlinWebpack`
> *   `TypeScriptValidationTask`
> *   `YarnRootExtension`
>
> 이 클래스들은 서브클래싱을 의도한 것이 아니었습니다. 이제 서브클래싱을 위한 모든 사용 사례는 Kotlin Gradle 플러그인 DSL이 제공하는 설정 블록으로 처리되어야 합니다.
> 이러한 태스크에 대한 기존 API가 테스트 실행 또는 JavaScript 런타임을 설정하는 데 필요한 기능을 충족하지 못하는 경우, [YouTrack](https://youtrack.jetbrains.com/issue/KT-75869)에 피드백을 공유하십시오.
>
> **사용 중단 주기**:
>
> -   2.2.0: 이 클래스에서 서브클래스를 생성하는 코드에 대해 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### `ExperimentalWasmDsl` 어노테이션 클래스 사용 중단

> **이슈**: [KT-81005](https://youtrack.jetbrains.com/issue/KT-81005)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: `ExperimentalWasmDsl` 어노테이션 클래스는 기능이 `kotlin-plugin-annotations` 모듈로 이동했으므로 사용 중단됩니다.
>
> **사용 중단 주기**:
>
> -   2.0.20: 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### `ExperimentalDceDsl` 어노테이션 클래스 사용 중단

> **이슈**: [KT-81008](https://youtrack.jetbrains.com/issue/KT-81008)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: `ExperimentalDceDsl` 어노테이션 클래스는 더 이상 사용되지 않으므로 사용 중단되었습니다.
>
> **사용 중단 주기**:
>
> -   2.2.0: 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### JavaScript 유틸리티 사용 중단

> **이슈**: [KT-81010](https://youtrack.jetbrains.com/issue/KT-81010)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: 다음 함수 및 속성은 내부적으로만 사용되므로 사용 중단되었습니다:
> *   `JsIrBinary.generateTs`
> *   `KotlinJsIrLink.mode`
> *   `NodeJsSetupTask.Companion.NAME`
> *   `Appendable.appendConfigsFromDir()`
> *   `ByteArray.toHex()`
> *   `FileHasher.calculateDirHash()`
> *   `String.jsQuoted()`
>
> **사용 중단 주기**:
>
> -   2.2.0: `KotlinJsIrLink.mode` 속성 사용 시 경고를 보고합니다.
> -   2.2.0: `NodeJsSetupTask.Companion.NAME` 속성 및 함수 사용 시 경고를 보고합니다.
> -   2.2.20: `JsIrBinary.generateTs` 속성 사용 시 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### 마이그레이션된 D8 및 Binaryen 속성 사용 중단

> **이슈**: [KT-81006](https://youtrack.jetbrains.com/issue/KT-81006)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: 다음 속성들은 `org.jetbrains.kotlin.gradle.targets.js` 패키지에서 `org.jetbrains.kotlin.gradle.targets.wasm` 패키지로 마이그레이션되었으므로 사용 중단됩니다:
>
> *   `binaryen.BinaryenEnvSpec`
> *   `binaryen.BinaryenExtension`
> *   `binaryen.BinaryenPlugin`
> *   `binaryen.BinaryenRootPlugin`
> *   `BinaryenSetupTask.Companion.NAME`
> *   `d8.D8EnvSpec`
> *   `d8.D8Plugin`
> *   `D8SetupTask.Companion.NAME`
>
> **사용 중단 주기**:
>
> -   2.2.0: 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### `NodeJsExec` DSL의 `create()` 함수 사용 중단

> **이슈**: [KT-81004](https://youtrack.jetbrains.com/issue/KT-81004)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: `NodeJsExec` DSL의 컴패니언 객체에 있는 `create()` 함수는 사용 중단되었습니다. 대신 `register()` 함수를 사용하십시오.
>
> **사용 중단 주기**:
>
> -   2.1.20: 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

### `kotlinOptions` DSL의 속성 사용 중단

> **이슈**: [KT-76720](https://youtrack.jetbrains.com/issue/KT-76720)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.2.0부터 `kotlinOptions` DSL 및 관련 `KotlinCompile<KotlinOptions>` 태스크 인터페이스를 통해 컴파일러 옵션을 설정하는 기능은 새로운 `compilerOptions` DSL을 선호하여 사용 중단되었습니다. Kotlin 2.3.0은 `kotlinOptions` 인터페이스의 모든 속성에 대한 사용 중단 주기를 계속합니다. 마이그레이션하려면 `compilerOptions` DSL을 사용하여 컴파일러 옵션을 구성하십시오. 마이그레이션에 대한 지침은 [`kotlinOptions {}`에서 `compilerOptions {}`로 마이그레이션](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)을 참조하십시오.
>
> **사용 중단 주기**:
>
> -   2.0.0: `kotlinOptions` DSL에 대해 경고를 보고합니다.
> -   2.2.0: 경고를 오류로 격상하고 `kotlinOptions`의 모든 속성을 사용 중단합니다.
> -   2.3.0: `kotlinOptions`의 모든 속성에 대해 경고를 오류로 격상합니다.

### `kotlinArtifacts` API 사용 중단

> **이슈**: [KT-77066](https://youtrack.jetbrains.com/issue/KT-77066)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: 실험적인 `kotlinArtifacts` API는 사용 중단되었습니다. Kotlin Gradle 플러그인에서 제공하는 현재 DSL을 사용하여 [최종 네이티브 바이너리(native binaries)를 빌드](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)하십시오. 마이그레이션에 충분하지 않다면, [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-74953)에 댓글을 남겨주십시오.
>
> **사용 중단 주기**:
>
> -   2.2.0: `kotlinArtifacts` API 사용 시 경고를 보고합니다.
> -   2.3.0: 이 경고를 오류로 격상합니다.

### `kotlin.mpp.resourcesResolutionStrategy` Gradle 속성 제거

> **이슈**: [KT-74955](https://youtrack.jetbrains.com/issue/KT-74955)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: 이전에는 `kotlin.mpp.resourcesResolutionStrategy` Gradle 속성이 사용되지 않아 사용 중단되었습니다. Kotlin 2.3.0에서는 이 Gradle 속성이 완전히 제거됩니다.
>
> **사용 중단 주기**:
>
> -   2.2.0: 설정 시간 진단(configuration-time diagnostic)을 보고합니다.
> -   2.3.0: Gradle 속성을 제거합니다.

### 다중 플랫폼 IDE 임포트의 이전 모드 사용 중단

> **이슈**: [KT-61127](https://youtrack.jetbrains.com/issue/KT-61127)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.3.0 이전에는 다중 플랫폼 IDE 임포트의 여러 모드를 지원했습니다. 이제 이전 모드는 사용 중단되었고, 하나의 모드만 사용 가능합니다. 이전에는 `kotlin.mpp.import.enableKgpDependencyResolution=false` Gradle 속성을 사용하여 이전 모드를 활성화했습니다. 이제 이 속성을 사용하면 사용 중단 경고가 발생합니다.
>
> **사용 중단 주기**:
>
> -   2.3.0: `kotlin.mpp.import.enableKgpDependencyResolution=false` Gradle 속성 사용 시 경고를 보고합니다.

### 정밀 컴파일 백업을 비활성화하는 속성 제거

> **이슈**: [KT-81038](https://youtrack.jetbrains.com/issue/KT-81038)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 1.9.0은 정밀 컴파일 백업(precise compilation backup)이라는 점진적 컴파일을 위한 실험적 최적화를 도입했습니다. 성공적인 테스트 후, 이 최적화는 Kotlin 2.0.0에서 기본적으로 활성화되었습니다. Kotlin 2.3.0은 이 최적화를 비활성화하는 `kotlin.compiler.preciseCompilationResultsBackup` 및 `kotlin.compiler.keepIncrementalCompilationCachesInMemory` Gradle 속성을 제거합니다.
>
> **사용 중단 주기**:
>
> -   2.1.20: 경고를 보고합니다.
> -   2.3.0: 속성을 제거합니다.

### `CInteropProcess` 내 `destinationDir` 사용 중단

> **이슈**: [KT-74910](https://youtrack.jetbrains.com/issue/KT-74910)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: `CInteropProcess` 태스크의 `destinationDir` 속성은 사용 중단되었습니다. 대신 `CInteropProcess.destinationDirectory.set()` 함수를 사용하십시오.
>
> **사용 중단 주기**:
>
> -   2.1.0: `destinationDir` 속성 사용 시 경고를 보고합니다.
> -   2.2.0: 이 경고를 오류로 격상합니다.
> -   2.3.0: `destinationDir` 속성을 숨깁니다.

### `CInteropProcess` 내 `konanVersion` 사용 중단

> **이슈**: [KT-74911](https://youtrack.jetbrains.com/issue/KT-74911)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: `CInteropProcess` 태스크의 `konanVersion` 속성은 사용 중단되었습니다. 대신 `CInteropProcess.kotlinNativeVersion`을 사용하십시오.
>
> **사용 중단 주기**:
>
> -   2.1.0: `konanVersion` 속성 사용 시 경고를 보고합니다.
> -   2.2.0: 이 경고를 오류로 격상합니다.
> -   2.3.0: `konanVersion` 속성을 숨깁니다.

### `KotlinCompile.classpathSnapshotProperties` 속성 제거

> **이슈**: [KT-76177](https://youtrack.jetbrains.com/issue/KT-76177)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: `kotlin.incremental.useClasspathSnapshot` Gradle 속성은 Kotlin 2.2.0에서 제거되었습니다. Kotlin 2.3.0에서는 다음 속성들도 제거됩니다:
> *   `KotlinCompile.classpathSnapshotProperties.useClasspathSnapshot`
> *   `KotlinCompile.classpathSnapshotProperties.classpath`
>
> **사용 중단 주기**:
>
> -   2.0.20: `kotlin.incremental.useClasspathSnapshot` 속성을 경고와 함께 사용 중단합니다.
> -   2.2.0: `kotlin.incremental.useClasspathSnapshot` 속성을 제거합니다.
> -   2.3.0: `KotlinCompile.classpathSnapshotProperties.useClasspathSnapshot` 및 `KotlinCompile.classpathSnapshotProperties.classpath` 속성을 제거합니다.

### `getPluginArtifactForNative()` 함수 사용 중단

> **이슈**: [KT-78870](https://youtrack.jetbrains.com/issue/KT-78870)
>
> **구성 요소**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.2.20에서 [`getPluginArtifactForNative()` 함수가 사용 중단되었습니다](whatsnew2220.md#reduced-size-of-kotlin-native-distribution). 대신 [`getPluginArtifact()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compiler-plugin-support-plugin/get-plugin-artifact.html) 함수를 사용하십시오.
>
> **사용 중단 주기**:
>
> -   2.2.20: 경고를 보고합니다.
> -   2.3.0: 경고를 오류로 격상합니다.

## 빌드 도구 제거

### Ant 지원 제거

> **이슈**: [KT-75875](https://youtrack.jetbrains.com/issue/KT-75875)
>
> **구성 요소**: Ant
>
> **요약**: Kotlin 2.3.0은 빌드 도구로서 Ant에 대한 지원을 제거합니다. 대신 [Gradle](gradle.md) 또는 [Maven](maven.md)을 사용하십시오.
>
> **사용 중단 주기**:
>
> -   2.2.0: 경고를 보고합니다.
> -   2.3.0: 지원을 제거합니다.