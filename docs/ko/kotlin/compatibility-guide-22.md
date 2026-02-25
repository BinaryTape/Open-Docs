[//]: # (title: Kotlin 2.2.x 호환성 가이드)

_[언어를 현대적으로 유지하기](kotlin-evolution-principles.md)_ 및 _[편안한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 핵심 원칙 중 일부입니다. 전자는 언어의 진화를 방해하는 구조를 제거해야 함을 의미하며, 후자는 코드 마이그레이션을 가능한 한 원활하게 만들기 위해 이러한 제거 작업이 사전에 충분히 전달되어야 함을 의미합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그나 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 이를 모두 요약하여 Kotlin 2.1에서 Kotlin 2.2로 마이그레이션하기 위한 전체 참조를 제공합니다.

## 기본 용어

이 문서에서는 여러 종류의 호환성을 소개합니다.

- _소스(source)_: 소스 호환되지 않는 변경은 이전에 정상적으로 컴파일되던 코드(오류나 경고 없이)가 더 이상 컴파일되지 않게 합니다.
- _바이너리(binary)_: 두 바이너리 아티팩트를 서로 교체해도 로딩 또는 링크 오류가 발생하지 않는 경우 이를 바이너리 호환이라고 합니다.
- _동작(behavioral)_: 변경 전후에 동일한 프로그램이 서로 다른 동작을 나타내는 경우 동작 호환되지 않는 변경이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 제공된다는 점에 유의하세요. 다른 언어 관점(예: Java)에서의 Kotlin 코드 호환성은 이 문서의 범위를 벗어납니다.

## 언어(Language)

### `-language-version`에서 1.6 및 1.7 지원 중단

> **이슈**: [KT-71793](https://youtrack.jetbrains.com/issue/KT-71793)
>
> **컴포넌트**: 컴파일러
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 2.2부터 컴파일러는 더 이상 [`-language-version=1.6`](compiler-reference.md#language-version-version) 또는 `-language-version=1.7`을 지원하지 않습니다. 이는 1.8보다 오래된 언어 기능 세트가 더 이상 지원되지 않음을 의미합니다. 그러나 언어 자체는 여전히 Kotlin 1.0과 완전히 하위 호환됩니다.
>
> **지원 중단 주기**:
>
> - 2.1.0: 버전 1.6 및 1.7에서 `-language-version`을 사용할 때 경고 보고
> - 2.2.0: 버전 1.8 및 1.9에서 `-language-version`을 사용할 때 경고 보고, 버전 1.6 및 1.7에 대한 경고를 오류로 격상

### 어노테이션이 있는 람다에 대해 기본적으로 invokedynamic 활성화

> **이슈**: [KTLC-278](https://youtrack.jetbrains.com/issue/KTLC-278)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: 어노테이션이 있는 람다는 이제 기본적으로 `LambdaMetafactory`를 통한 `invokedynamic`을 사용하여 Java 람다와 동작을 일치시킵니다. 이는 생성된 람다 클래스에서 어노테이션을 검색하는 데 의존했던 리플렉션 기반 코드에 영향을 미칩니다. 이전 동작으로 되돌리려면 `-Xindy-allow-annotated-lambdas=false` 컴파일러 옵션을 사용하세요.
>
> **지원 중단 주기**:
>
> - 2.2.0: 어노테이션이 있는 람다에 대해 기본적으로 `invokedynamic` 활성화

### K2에서 가변성(variance)이 있는 확장 타입의 타입 별칭에 대한 생성자 호출 및 상속 금지

> **이슈**: [KTLC-4](https://youtrack.jetbrains.com/issue/KTLC-4)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `out`과 같은 가변성 수정자를 사용하는 타입으로 확장되는 타입 별칭(type aliases)을 사용한 생성자 호출 및 상속이 K2 컴파일러에서 더 이상 지원되지 않습니다. 이는 원래 타입을 사용하는 것은 허용되지 않았지만, 타입 별칭을 통한 동일한 사용은 허용되었던 불일치를 해결합니다. 마이그레이션하려면 필요한 곳에 원래 타입을 명시적으로 사용하세요.
>
> **지원 중단 주기**:
>
> - 2.0.0: 가변성 수정자가 있는 타입으로 확장되는 타입 별칭에 대한 생성자 호출 또는 상위 타입 사용 시 경고 보고
> - 2.2.0: 경고를 오류로 격상

### Kotlin 게터로부터의 합성 프로퍼티(synthetic properties) 금지

> **이슈**: [KTLC-272](https://youtrack.jetbrains.com/issue/KTLC-272)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin에서 정의된 게터(getter)에 대해 합성 프로퍼티가 더 이상 허용되지 않습니다. 이는 Java 클래스가 Kotlin 클래스를 확장하는 경우와 `java.util.LinkedHashSet`과 같은 매핑된 타입을 다룰 때 영향을 미칩니다. 마이그레이션하려면 프로퍼티 액세스를 해당 게터 함수에 대한 직접 호출로 대체하세요.
>
> **지원 중단 주기**:
>
> - 2.0.0: Kotlin 게터에서 생성된 합성 프로퍼티에 액세스할 때 경고 보고
> - 2.2.0: 경고를 오류로 격상

### JVM에서 인터페이스 함수에 대한 기본 메서드(default method) 생성 변경

> **이슈**: [KTLC-269](https://youtrack.jetbrains.com/issue/KTLC-269)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 바이너리
>
> **요약**: 인터페이스에 선언된 함수는 별도로 구성되지 않는 한 이제 JVM 기본 메서드(default methods)로 컴파일됩니다. 이로 인해 관련 없는 상위 타입이 충돌하는 구현을 정의할 때 Java 코드에서 컴파일 오류가 발생할 수 있습니다. 이 동작은 안정적인 `-jvm-default` 컴파일러 옵션에 의해 제어되며, 이 옵션은 이제 더 이상 사용되지 않는 `-Xjvm-default` 옵션을 대체합니다. 기본 구현이 `DefaultImpls` 클래스 및 서브클래스에서만 생성되던 이전 동작으로 복원하려면 `-jvm-default=disable`을 사용하세요.
>
> **지원 중단 주기**:
>
> - 2.2.0: `-jvm-default` 컴파일러 옵션이 기본적으로 `enable`로 설정됨

### 어노테이션 프로퍼티에 대한 필드 대상(field-targeted) 어노테이션 금지

> **이슈**: [KTLC-7](https://youtrack.jetbrains.com/issue/KTLC-7)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 어노테이션 프로퍼티에 필드 대상(field-targeted) 어노테이션이 더 이상 허용되지 않습니다. 이러한 어노테이션은 관찰 가능한 효과가 없었지만, 이 변경 사항은 이에 의존했던 커스텀 IR 플러그인에 영향을 미칠 수 있습니다. 마이그레이션하려면 프로퍼티에서 필드 대상 어노테이션을 제거하세요.
>
> **지원 중단 주기**:
>
> - 2.1.0: 어노테이션 프로퍼티에서 `@JvmField` 어노테이션 사용이 경고와 함께 중단됨
> - 2.1.20: 어노테이션 프로퍼티의 모든 필드 대상 어노테이션에 대해 경고 보고
> - 2.2.0: 경고를 오류로 격상

### 타입 별칭에서 실체화된(reified) 타입 파라미터 금지

> **이슈**: [KTLC-5](https://youtrack.jetbrains.com/issue/KTLC-5)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 타입 별칭의 타입 파라미터에서 `reified` 수정자가 더 이상 허용되지 않습니다. 실체화된 타입 파라미터는 인라인 함수에서만 유효하므로 타입 별칭에서 이를 사용하는 것은 아무런 효과가 없었습니다. 마이그레이션하려면 `typealias` 선언에서 `reified` 수정자를 제거하세요.
>
> **지원 중단 주기**:
>
> - 2.1.0: 타입 별칭에서 실체화된 타입 파라미터에 대해 경고 보고
> - 2.2.0: 경고를 오류로 격상

### `Number` 및 `Comparable`에 대한 인라인 값 클래스의 타입 검사 수정

> **이슈**: [KTLC-21](https://youtrack.jetbrains.com/issue/KTLC-21)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: 인라인 값 클래스는 이제 `is` 및 `as` 검사에서 `java.lang.Number` 또는 `java.lang.Comparable`의 구현체로 취급되지 않습니다. 이러한 검사는 이전에 박싱된 인라인 클래스에 적용될 때 잘못된 결과를 반환했습니다. 이제 최적화는 원시 타입(primitive types)과 그 래퍼(wrappers)에만 적용됩니다.
>
> **지원 중단 주기**:
>
> - 2.2.0: 새로운 동작 활성화

### 간접 의존성으로부터의 접근 불가능한 제네릭 타입 금지

> **이슈**: [KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: K2 컴파일러는 이제 컴파일러에 보이지 않는 간접 의존성의 타입을 사용할 때 오류를 보고합니다. 이는 람다 파라미터나 제네릭 타입 인자와 같이 누락된 의존성으로 인해 참조된 타입을 사용할 수 없는 경우에 영향을 미칩니다.
>
> **지원 중단 주기**:
>
> - 2.0.0: 람다의 접근 불가능한 제네릭 타입 및 접근 불가능한 제네릭 타입 인자의 선택된 사용에 대해 오류 보고, 람다의 접근 불가능한 비제네릭 타입 및 표현식 및 상위 타입의 접근 불가능한 타입 인자에 대해 경고 보고
> - 2.1.0: 람다의 접근 불가능한 비제네릭 타입에 대한 경고를 오류로 격상
> - 2.2.0: 표현식 타입의 접근 불가능한 타입 인자에 대한 경고를 오류로 격상

### 타입 파라미터 제약(bounds)에 대한 가시성 검사 적용

> **이슈**: [KTLC-274](https://youtrack.jetbrains.com/issue/KTLC-274)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 함수와 프로퍼티는 이제 선언 자체보다 더 제한적인 가시성을 가진 타입 파라미터 제약(bound)을 사용할 수 없습니다. 이는 이전에는 오류 없이 컴파일되었지만 일부 사례에서 런타임 실패나 IR 유효성 검사 오류를 유발했던 접근 불가능한 타입의 간접 노출을 방지합니다.
>
> **지원 중단 주기**:
>
> - 2.1.0: 타입 파라미터가 선언의 가시성 범위에서 보이지 않는 제약을 가질 때 경고 보고
> - 2.2.0: 경고를 오류로 격상

### 비공개(non-private) 인라인 함수에서 비공개 타입 노출 시 오류 보고

> **이슈**: [KT-70916](https://youtrack.jetbrains.com/issue/KT-70916)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 비공개(non-private) 인라인 함수에서 비공개 타입, 함수 또는 프로퍼티에 액세스하는 것이 더 이상 허용되지 않습니다. 마이그레이션하려면 비공개 엔티티를 참조하지 않거나, 함수를 비공개로 만들거나, `inline` 수정자를 제거하세요. `inline`을 제거하면 바이너리 호환성이 깨진다는 점에 유의하세요.
>
> **지원 중단 주기**:
>
> - 2.2.0: 비공개 인라인 함수에서 비공개 타입 또는 멤버에 액세스할 때 오류 보고

### 파라미터의 기본값으로 사용된 람다 내에서 비로컬 반환(non-local return) 금지

> **이슈**: [KTLC-286](https://youtrack.jetbrains.com/issue/KTLC-286)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 파라미터의 기본값으로 사용된 람다에서는 비로컬 반환(non-local return) 문이 더 이상 허용되지 않습니다. 이 패턴은 이전에는 컴파일되었지만 런타임 충돌을 유발했습니다. 마이그레이션하려면 비로컬 반환을 피하도록 람다를 다시 작성하거나 로직을 기본값 밖으로 이동하세요.
>
> **지원 중단 주기**:
>
> - 2.2.0: 파라미터의 기본값으로 사용된 람다에서 비로컬 반환에 대해 오류 보고

## 표준 라이브러리(Standard library)

### `kotlin.native.Throws` 지원 중단

> **이슈**: [KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **컴포넌트**: Kotlin/Native
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `kotlin.native.Throws`가 지원 중단되었습니다. 대신 공통 [`kotlin.Throws`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-throws/) 어노테이션을 사용하세요. 
>
> **지원 중단 주기**:
>
> - 1.9.0: `kotlin.native.Throws` 사용 시 경고 보고
> - 2.2.0: 경고를 오류로 격상

### `AbstractDoubleTimeSource` 지원 중단

> **이슈**: [KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `AbstractDoubleTimeSource`가 지원 중단되었습니다. 대신 [`AbstractLongTimeSource`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/-abstract-long-time-source/)를 사용하세요.
>
> **지원 중단 주기**:
>
> - 1.8.20: `AbstractDoubleTimeSource` 사용 시 경고 보고
> - 2.2.0: 경고를 오류로 격상

## 도구(Tools)

### 소스를 대체하도록 `KotlinCompileTool`의 `setSource()` 함수 수정

> **이슈**: [KT-59632](https://youtrack.jetbrains.com/issue/KT-59632)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: [`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) 인터페이스의 [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 함수는 이제 구성된 소스에 추가하는 대신 대체합니다. 기존 소스를 대체하지 않고 소스를 추가하려면 [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 함수를 사용하세요.
>
> **지원 중단 주기**:
>
> - 2.2.0: 새로운 동작 활성화

### `KotlinCompilationOutput#resourcesDirProvider` 프로퍼티 지원 중단

> **이슈**: [KT-70620](https://youtrack.jetbrains.com/issue/KT-70620)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `KotlinCompilationOutput#resourcesDirProvider` 프로퍼티가 지원 중단되었습니다. 추가 리소스 디렉터리를 추가하려면 Gradle 빌드 스크립트에서 대신 [`KotlinSourceSet.resources`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/resources.html)를 사용하세요.
>
> **지원 중단 주기**:
>
> - 2.1.0: `KotlinCompilationOutput#resourcesDirProvider`가 경고와 함께 중단됨
> - 2.2.0: 경고를 오류로 격상

### `BaseKapt.annotationProcessorOptionProviders` 프로퍼티 지원 중단

> **이슈**: [KT-58009](https://youtrack.jetbrains.com/issue/KT-58009)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: [`BaseKapt.annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) 프로퍼티가 `MutableList<Any>` 대신 `ListProperty<CommandLineArgumentProvider>`를 허용하는 `BaseKapt.annotationProcessorOptionsProviders`를 위해 지원 중단되었습니다. 이는 예상되는 요소 타입을 명확하게 정의하고 중첩된 리스트와 같은 잘못된 요소를 추가하여 발생하는 런타임 실패를 방지합니다. 현재 코드가 리스트를 단일 요소로 추가하는 경우, `add()` 함수를 `addAll()` 함수로 교체하세요.
>
> **지원 중단 주기**:
>
> - 2.2.0: API에서 새로운 타입 적용

### `kotlin-android-extensions` 플러그인 지원 중단

> **이슈**: [KT-72341](https://youtrack.jetbrains.com/issue/KT-72341/)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `kotlin-android-extensions` 플러그인이 지원 중단되었습니다. `Parcelable` 구현 생성기에는 별도의 플러그인인 [`kotlin-parcelize`](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)를 사용하고, 합성 뷰(synthetic views) 대신 Android Jetpack의 [뷰 바인딩(view binding)](https://developer.android.com/topic/libraries/view-binding)을 사용하세요.
>
> **지원 중단 주기**:
>
> - 1.4.20: 플러그인 지원 중단
> - 2.1.20: 구성 오류가 도입되고 플러그인 코드가 실행되지 않음
> - 2.2.0: 플러그인 코드 제거

### `kotlinOptions` DSL 지원 중단

> **이슈**: [KT-54110](https://youtrack.jetbrains.com/issue/KT-54110)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `kotlinOptions` DSL 및 관련 `KotlinCompile<KotlinOptions>` 태스크 인터페이스를 통해 컴파일러 옵션을 구성하는 기능이 새로운 `compilerOptions` DSL을 위해 지원 중단되었습니다. 이 지원 중단의 일환으로 `kotlinOptions` 인터페이스의 모든 프로퍼티도 이제 개별적으로 지원 중단된 것으로 표시됩니다. 마이그레이션하려면 `compilerOptions` DSL을 사용하여 컴파일러 옵션을 구성하세요. 마이그레이션에 대한 안내는 [`kotlinOptions {}`에서 `compilerOptions {}`로 마이그레이션](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)을 참조하세요.
>
> **지원 중단 주기**:
>
> - 2.0.0: `kotlinOptions` DSL에 대해 경고 보고
> - 2.2.0: 경고를 오류로 격상하고 `kotlinOptions`의 모든 프로퍼티 지원 중단

### `kotlin.incremental.useClasspathSnapshot` 프로퍼티 제거

> **이슈**: [KT-62963](https://youtrack.jetbrains.com/issue/KT-62963)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `kotlin.incremental.useClasspathSnapshot` Gradle 프로퍼티가 제거되었습니다. 이 프로퍼티는 더 이상 사용되지 않는 JVM 히스토리 기반 증분 컴파일 모드를 제어했으며, 이는 Kotlin 1.8.20부터 기본적으로 활성화된 클래스패스 기반 접근 방식으로 대체되었습니다.
>
> **지원 중단 주기**:
>
> - 2.0.20: `kotlin.incremental.useClasspathSnapshot` 프로퍼티를 경고와 함께 중단
> - 2.2.0: 프로퍼티 제거

### Kotlin 스크립팅 관련 지원 중단 사항

> **이슈**: [KT-71685](https://youtrack.jetbrains.com/issue/KT-71685), [KT-75632](https://youtrack.jetbrains.com/issue/KT-75632/), [KT-76196](https://youtrack.jetbrains.com/issue/KT-76196/).
>
> **컴포넌트**: 스크립팅
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 2.2.0은 다음에 대한 지원을 중단합니다.
>   * REPL: `kotlinc`를 통해 REPL을 계속 사용하려면 `-Xrepl` 컴파일러 옵션으로 옵트인하세요.
>   * JSR-223: [JSR](https://jcp.org/en/jsr/detail?id=223)이 **Withdrawn** 상태이기 때문입니다. JSR-223 구현은 언어 버전 1.9에서 계속 작동하지만 향후 K2 컴파일러로 마이그레이션할 계획은 없습니다.
>   * `KotlinScriptMojo` Maven 플러그인. 계속 사용할 경우 컴파일러 경고가 표시됩니다.
>
> 자세한 내용은 [블로그 포스트](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)를 참조하세요.
>
> **지원 중단 주기**:
>
> - 2.1.0: `kotlinc`에서 REPL 사용을 경고와 함께 중단
> - 2.2.0: `kotlinc`를 통해 REPL을 사용하려면 `-Xrepl` 컴파일러 옵션으로 옵트인; JSR-223 지원 중단(언어 버전 1.9로 전환하여 지원 복구 가능); `KotlinScriptMojo` Maven 플러그인 지원 중단

### 명확화 분류기(disambiguation classifier) 프로퍼티 지원 중단

> **이슈**: [KT-58231](https://youtrack.jetbrains.com/issue/KT-58231)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin Gradle 플러그인이 소스 세트 이름 및 IDE 임포트를 명확하게 구분하는 방식을 제어하는 데 사용되었던 옵션이 구식이 되었습니다. 따라서 `KotlinTarget` 인터페이스에서 다음 프로퍼티가 이제 지원 중단되었습니다.
>
> * `useDisambiguationClassifierAsSourceSetNamePrefix`
> * `overrideDisambiguationClassifierOnIdeImport`
>
> **지원 중단 주기**:
>
> - 2.0.0: Gradle 프로퍼티 사용 시 경고 보고
> - 2.1.0: 이 경고를 오류로 격상
> - 2.2.0: Gradle 프로퍼티 제거

### 공통화(commonization) 파라미터 지원 중단

> **이슈**: [KT-75161](https://youtrack.jetbrains.com/issue/KT-75161)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 실험적인 공통화 모드에 대한 파라미터가 Kotlin Gradle 플러그인에서 지원 중단되었습니다. 이러한 파라미터는 유효하지 않은 컴파일 아티팩트를 생성하여 캐시될 수 있습니다. 영향을 받는 아티팩트를 삭제하려면:
>
> 1. `gradle.properties` 파일에서 다음 옵션을 제거하세요.
>
>    ```none
>    kotlin.mpp.enableOptimisticNumberCommonization
>    kotlin.mpp.enablePlatformIntegerCommonization
>    ```
>
> 2. `~/.konan/*/klib/commonized` 디렉터리의 공통화 캐시를 지우거나 다음 명령을 실행하세요. 
>
>    ```bash
>    ./gradlew cleanNativeDistributionCommonization
>    ```
>
> **지원 중단 주기**:
>
> - 2.2.0: 공통화 파라미터를 오류와 함께 중단
> - 2.2.20: 공통화 파라미터 제거

### 레거시 메타데이터 컴파일 지원 중단

> **이슈**: [KT-61817](https://youtrack.jetbrains.com/issue/KT-61817)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 계층 구조를 설정하고 공통 소스 세트와 중간 소스 세트 사이에 중간 소스 세트를 생성하는 데 사용되었던 옵션이 구식이 되었습니다. 다음 컴파일러 옵션이 제거됩니다.
> 
> * `isCompatibilityMetadataVariantEnabled`
> * `withGranularMetadata`
> * `isKotlinGranularMetadataEnabled`
>
> **지원 중단 주기**:
>
> - 2.2.0: Kotlin Gradle 플러그인에서 컴파일러 옵션 제거

### `KotlinCompilation.source` API 지원 중단

> **이슈**: [KT-64991](https://youtrack.jetbrains.com/issue/KT-64991)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 컴파일에 Kotlin 소스 세트를 직접 추가할 수 있었던 `KotlinCompilation.source` API에 대한 액세스가 지원 중단되었습니다.
>
> **지원 중단 주기**:
>
> - 1.9.0: `KotlinCompilation.source` 사용 시 경고 보고
> - 1.9.20: 이 경고를 오류로 격상
> - 2.2.0: Kotlin Gradle 플러그인에서 `KotlinCompilation.source` 제거. 빌드 스크립트 컴파일 중에 이를 사용하려고 시도하면 "unresolved reference" 오류가 발생함

### 타겟 프리셋(preset) API 지원 중단

> **이슈**: [KT-71698](https://youtrack.jetbrains.com/issue/KT-71698)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin Multiplatform 타겟에 대한 타겟 프리셋이 구식이 되었습니다. `jvm()` 또는 `iosSimulatorArm64()`와 같은 타겟 DSL 함수가 이제 동일한 유스케이스를 커버합니다. 모든 프리셋 관련 API가 지원 중단되었습니다.
> 
> * `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension`의 `presets` 프로퍼티
> * `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` 인터페이스 및 모든 상속자
> * `fromPreset` 오버로드
>
> **지원 중단 주기**:
>
> - 1.9.20: 프리셋 관련 API 사용 시 경고 보고
> - 2.0.0: 이 경고를 오류로 격상
> - 2.2.0: Kotlin Gradle 플러그인의 공개 API에서 프리셋 관련 API 제거. 여전히 이를 사용하는 소스는 "unresolved reference" 오류로 실패하며, 바이너리(예: Gradle 플러그인)는 최신 버전의 Kotlin Gradle 플러그인에 대해 다시 컴파일되지 않는 한 링크 오류로 실패할 수 있음

### Apple 타겟 단축 기능(shortcuts) 지원 중단

> **이슈**: [KT-70615](https://youtrack.jetbrains.com/issue/KT-70615)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin Multiplatform DSL에서 `ios()`, `watchos()` 및 `tvos()` 타겟 단축 기능이 지원 중단되었습니다. 이 단축 기능들은 Apple 타겟에 대한 소스 세트 계층 구조를 부분적으로 생성하도록 설계되었습니다. 이제 Kotlin Multiplatform Gradle 플러그인은 내장된 계층 구조 템플릿을 제공합니다. 단축 기능 대신 타겟 목록을 지정하면 플러그인이 자동으로 중간 소스 세트를 설정합니다.
>
> **지원 중단 주기**:
>
> - 1.9.20: 타겟 단축 기능 사용 시 경고 보고, 대신 기본 계층 구조 템플릿이 기본적으로 활성화됨
> - 2.1.0: 타겟 단축 기능 사용 시 오류 보고
> - 2.2.0: Kotlin Multiplatform Gradle 플러그인에서 타겟 단축 기능 DSL 제거

### `publishAllLibraryVariants()` 함수 지원 중단

> **이슈**: [KT-60623](https://youtrack.jetbrains.com/issue/KT-60623)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `publishAllLibraryVariants()` 함수가 지원 중단되었습니다. 이 함수는 Android 타겟에 대한 모든 빌드 변리언트를 게시하도록 설계되었습니다. 이 접근 방식은 특히 여러 flavor와 빌드 타입이 사용될 때 변리언트 확인 문제를 일으킬 수 있으므로 현재는 권장되지 않습니다. 대신 빌드 변리언트를 지정하는 `publishLibraryVariants()` 함수를 사용하세요.
>
> **지원 중단 주기**:
>
> - 2.2.0: `publishAllLibraryVariants()` 지원 중단

### `android` 타겟 지원 중단

> **이슈**: [KT-71608](https://youtrack.jetbrains.com/issue/KT-71608)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 현재 Kotlin DSL에서 `android` 타겟 이름이 지원 중단되었습니다. 대신 `androidTarget`을 사용하세요.
>
> **지원 중단 주기**:
>
> - 1.9.0: Kotlin Multiplatform 프로젝트에서 `android` 이름을 사용할 때 지원 중단 경고 도입
> - 2.1.0: 이 경고를 오류로 격상
> - 2.2.0: Kotlin Multiplatform Gradle 플러그인에서 `android` 타겟 DSL 제거

### `CInteropProcess`의 `konanVersion` 지원 중단

> **이슈**: [KT-71069](https://youtrack.jetbrains.com/issue/KT-71069)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `CInteropProcess` 태스크의 `konanVersion` 프로퍼티가 지원 중단되었습니다. 대신 `CInteropProcess.kotlinNativeVersion`을 사용하세요.
>
> **지원 중단 주기**:
>
> - 2.1.0: `konanVersion` 프로퍼티 사용 시 경고 보고
> - 2.2.0: 이 경고를 오류로 격상
> - 2.3.0: Kotlin Gradle 플러그인에서 `konanVersion` 프로퍼티 제거

### `CInteropProcess`의 `destinationDir` 지원 중단

> **이슈**: [KT-71068](https://youtrack.jetbrains.com/issue/KT-71068)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `CInteropProcess` 태스크의 `destinationDir` 프로퍼티가 지원 중단되었습니다. 대신 `CInteropProcess.destinationDirectory.set()` 함수를 사용하세요.
>
> **지원 중단 주기**:
>
> - 2.1.0: `destinationDir` 프로퍼티 사용 시 경고 보고
> - 2.2.0: 이 경고를 오류로 격상
> - 2.3.0: Kotlin Gradle 플러그인에서 `destinationDir` 프로퍼티 제거

### `kotlinArtifacts` API 지원 중단

> **이슈**: [KT-74953](https://youtrack.jetbrains.com/issue/KT-74953)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 실험적인 `kotlinArtifacts` API가 지원 중단되었습니다. [최종 네이티브 바이너리를 빌드](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)하려면 Kotlin Gradle 플러그인에서 제공하는 현재 DSL을 사용하세요. 마이그레이션에 부족한 점이 있다면 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-74953)에 의견을 남겨주세요.
>
> **지원 중단 주기**:
>
> - 2.2.0: `kotlinArtifacts` API 사용 시 경고 보고
> - 2.3.0: 이 경고를 오류로 격상