---
title: "Kotlin 2.1 호환성 가이드"
---
_[언어의 현대성 유지](kotlin-evolution-principles)_ 및 _[편리한 업데이트](kotlin-evolution-principles)_는 Kotlin 언어 디자인의 기본 원칙에 속합니다. 전자는 언어 발전을 저해하는 구조는 제거해야 한다고 말하며, 후자는 코드 마이그레이션을 최대한 원활하게 하기 위해 이러한 제거 사항을 사전에 충분히 알려야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그나 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서에서는 Kotlin 2.0에서 Kotlin 2.1로의 마이그레이션을 위한 완전한 참조를 제공하며 이 모든 것을 요약합니다.

## 기본 용어

이 문서에서는 다음과 같은 여러 종류의 호환성을 소개합니다.

- _source_ (소스): 소스 비호환성 변경은 오류나 경고 없이 정상적으로 컴파일되던 코드가 더 이상 컴파일되지 않도록 합니다.
- _binary_ (바이너리): 두 바이너리 아티팩트를 서로 교환해도 로딩 또는 연결 오류가 발생하지 않으면 바이너리 호환성이 있다고 합니다.
- _behavioral_ (동작): 변경 사항을 적용하기 전후에 동일한 프로그램이 다른 동작을 보이는 경우 동작 비호환성 변경이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 제공된다는 점을 기억하십시오. 다른 언어 관점에서 본 Kotlin 코드의 호환성
(예: Java)은 이 문서의 범위를 벗어납니다.

## 언어

### 언어 버전 1.4 및 1.5 제거

> **Issue**: [KT-60521](https://youtrack.jetbrains.com/issue/KT-60521)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.1은 언어 버전 2.1을 도입하고 언어 버전 1.4 및 1.5에 대한 지원을 제거합니다. 언어 버전 1.6 및 1.7은 더 이상 사용되지 않습니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 언어 버전 1.4에 대한 경고 보고
> - 1.9.0: 언어 버전 1.5에 대한 경고 보고
> - 2.1.0: 언어 버전 1.6 및 1.7에 대한 경고 보고; 언어 버전 1.4 및 1.5에 대한 경고를 오류로 격상

### Kotlin/Native에서 `typeOf()` 함수의 동작 변경

> **Issue**: [KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin/Native에서 `typeOf()` 함수의 동작이 Kotlin/JVM과 일치하도록 조정되어 플랫폼 간 일관성을 보장합니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: Kotlin/Native에서 `typeOf()` 함수의 동작을 조정

### 타입 파라미터 경계를 통해 타입을 노출하는 것 금지

> **Issue**: [KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 타입 파라미터 경계를 통해 가시성이 낮은 타입을 노출하는 것은 이제 금지되어, 타입 가시성 규칙의 불일치를 해결합니다.
> 이 변경 사항은 타입 파라미터의 경계가 클래스와 동일한 가시성 규칙을 따르도록 보장하여 JVM에서 IR 유효성 검사 오류와 같은 문제를 방지합니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: 가시성이 낮은 타입 파라미터 경계를 통해 타입을 노출하는 것에 대한 경고 보고
> - 2.2.0: 경고를 오류로 격상

### 동일한 이름의 추상 `var` 프로퍼티와 `val` 프로퍼티를 상속하는 것 금지

> **Issue**: [KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 클래스가 인터페이스에서 추상 `var` 프로퍼티를 상속하고 슈퍼클래스에서 동일한 이름의 `val` 프로퍼티를 상속하는 경우,
> 이제 컴파일 오류가 발생합니다. 이는 이러한 경우 누락된 setter로 인해 발생하는 런타임 충돌을 해결합니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: 클래스가 인터페이스에서 추상 `var` 프로퍼티를 상속하고 슈퍼클래스에서 동일한 이름의 `val` 프로퍼티를 상속할 때 경고 (또는 progressive 모드에서는 오류) 보고
> - 2.2.0: 경고를 오류로 격상

### 초기화되지 않은 enum 항목에 액세스할 때 오류 보고

> **Issue**: [KT-68451](https://youtrack.jetbrains.com/issue/KT-68451)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 컴파일러는 이제 enum 클래스 또는 항목 초기화 중에 초기화되지 않은 enum 항목에 액세스할 때 오류를 보고합니다.
> 이는 멤버 프로퍼티 초기화 규칙과 동작을 일치시켜 런타임 예외를 방지하고 일관된 논리를 보장합니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: 초기화되지 않은 enum 항목에 액세스할 때 오류 보고

### K2 스마트 캐스트 전파의 변경 사항

> **Issue**: [KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: K2 컴파일러는 `val x = y`와 같이 추론된 변수에 대한 타입 정보의 양방향 전파를 도입하여 스마트 캐스트 전파에 대한 동작을 변경합니다. `val x: T = y`와 같이 명시적으로 타입을 지정한 변수는
> 더 이상 타입 정보를 전파하지 않아 선언된 타입을 더 엄격하게 준수합니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: 새로운 동작 활성화

### Java 서브클래스에서 멤버 확장 프로퍼티 오버라이드의 처리 수정

> **Issue**: [KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Java 서브클래스에 의해 오버라이드된 멤버 확장 프로퍼티의 getter는 이제 서브클래스의 범위에서 숨겨져,
> 일반적인 Kotlin 프로퍼티와 동일한 동작을 합니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: 새로운 동작 활성화

### protected val을 오버라이드하는 var 프로퍼티의 getter 및 setter에 대한 가시성 정렬 수정

> **Issue**: [KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **Component**: Core language
>
> **Incompatible change type**: binary
> 
> **Short summary**: `protected val` 프로퍼티를 오버라이드하는 `var` 프로퍼티의 getter 및 setter의 가시성은 이제 일관성을 가지며, 둘 다 오버라이드된 `val` 프로퍼티의 가시성을 상속합니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: K2에서 getter와 setter 모두에 대해 일관된 가시성 적용; K1은 영향을 받지 않음

### JSpecify nullability 불일치 진단의 심각도를 오류로 높임

> **Issue**: [KTLC-11](https://youtrack.jetbrains.com/issue/KTLC-11)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: `@NonNull`, `@Nullable` 및 `@NullMarked`와 같은 `org.jspecify.annotations`의 Nullability 불일치는 이제 경고 대신 오류로 처리되어,
> Java 상호 운용성에 대한 더 엄격한 타입 안전성을 적용합니다. 이러한 진단의 심각도를 조정하려면 `-Xnullability-annotations` 컴파일러 옵션을 사용하십시오.
>
> **Deprecation cycle**:
>
> - 1.6.0: 잠재적인 nullability 불일치에 대한 경고 보고
> - 1.8.20: 경고를 `@Nullable`, `@NullnessUnspecified`, `@NullMarked` 및 `org.jspecify.nullness`의 레거시 어노테이션(JSpecify 0.2 이하)을 포함한 특정 JSpecify 어노테이션으로 확장
> - 2.0.0: `@NonNull` 어노테이션에 대한 지원 추가
> - 2.1.0: JSpecify 어노테이션에 대한 기본 모드를 `strict`로 변경하여 경고를 오류로 변환; `-Xnullability-annotations=@org.jspecify.annotations:warning` 또는 `-Xnullability-annotations=@org.jspecify.annotations:ignore`를 사용하여 기본 동작을 오버라이드

### 모호한 경우 invoke 호출보다 확장 함수를 우선시하도록 오버로드 해결 변경

> **Issue**: [KTLC-37](https://youtrack.jetbrains.com/issue/KTLC-37)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
> 
> **Short summary**: 오버로드 해결은 이제 모호한 경우 invoke 호출보다 확장 함수를 일관되게 우선시합니다.
> 이는 로컬 함수 및 프로퍼티에 대한 해결 논리의 불일치를 해결합니다. 이 변경 사항은 재컴파일 후에만 적용되며, 사전 컴파일된 바이너리에는 영향을 미치지 않습니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: 시그니처가 일치하는 확장 함수에 대해 `invoke` 호출보다 확장 함수를 일관되게 우선시하도록 오버로드 해결을 변경; 이 변경 사항은 재컴파일 후에만 적용되며 사전 컴파일된 바이너리에는 영향을 미치지 않습니다.

### JDK 함수 인터페이스의 SAM 생성자에서 람다로부터 nullable 값을 반환하는 것 금지

> **Issue**: [KTLC-42](https://youtrack.jetbrains.com/issue/KTLC-42)
>
> **Component**: Core language
>
> **Incompatible change type**: source
> 
> **Short summary**: 지정된 타입 인수가 non-nullable인 경우 JDK 함수 인터페이스의 SAM 생성자에서 람다로부터 nullable 값을 반환하면 이제 컴파일 오류가 발생합니다.
> 이는 nullability 불일치가 런타임 예외로 이어질 수 있는 문제를 해결하여 더 엄격한 타입 안전성을 보장합니다.
>
> **Deprecation cycle**:
>
> - 2.0.0: JDK 함수 인터페이스의 SAM 생성자에서 nullable 반환 값에 대한 사용 중단 경고 보고
> - 2.1.0: 기본적으로 새로운 동작 활성화

### Kotlin/Native에서 public 멤버와 충돌하는 private 멤버의 처리 수정

> **Issue**: [KTLC-43](https://youtrack.jetbrains.com/issue/KTLC-43)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
> 
> **Short summary**: Kotlin/Native에서 private 멤버는 더 이상 슈퍼클래스의 public 멤버를 오버라이드하거나 충돌하지 않아 Kotlin/JVM과 동작을 일치시킵니다.
> 이는 오버라이드 해결의 불일치를 해결하고 별도 컴파일로 인해 발생하는 예기치 않은 동작을 제거합니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: Kotlin/Native의 private 함수 및 프로퍼티는 더 이상 슈퍼클래스의 public 멤버를 오버라이드하거나 영향을 주지 않아 JVM 동작과 일치

### public inline 함수에서 private operator 함수에 대한 액세스 금지

> **Issue**: [KTLC-71](https://youtrack.jetbrains.com/issue/KTLC-71)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: `getValue()`, `setValue()`, `provideDelegate()`, `hasNext()` 및 `next()`와 같은 private operator 함수는 더 이상 public inline 함수에서 액세스할 수 없습니다.
>
> **Deprecation cycle**:
>
> - 2.0.0: public inline 함수에서 private operator 함수에 액세스하는 것에 대한 사용 중단 경고 보고
> - 2.1.0: 경고를 오류로 격상

### @UnsafeVariance로 어노테이션된 불변 파라미터에 잘못된 인수를 전달하는 것 금지

> **Issue**: [KTLC-72](https://youtrack.jetbrains.com/issue/KTLC-72)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 컴파일러는 이제 타입 검사 중에 `@UnsafeVariance` 어노테이션을 무시하여 불변 타입 파라미터에 대한 더 엄격한 타입 안전성을 적용합니다.
> 이는 예상되는 타입 검사를 우회하기 위해 `@UnsafeVariance`에 의존하는 잘못된 호출을 방지합니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: 새로운 동작 활성화

### 경고 수준 Java 타입의 오류 수준 nullable 인수에 대한 nullability 오류 보고

> **Issue**: [KTLC-100](https://youtrack.jetbrains.com/issue/KTLC-100)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 컴파일러는 이제 경고 수준
> nullable 타입이 더 엄격한 오류 수준 nullability를 가진 타입 인수를 포함하는 Java 메서드에서 nullability 불일치를 감지합니다.
> 이는 이전에 무시되었던 타입 인수의 오류가 올바르게 보고되도록 보장합니다.
>
> **Deprecation cycle**:
>
> - 2.0.0: 더 엄격한 타입 인수를 가진 Java 메서드에서 nullability 불일치에 대한 사용 중단 경고 보고
> - 2.1.0: 경고를 오류로 격상

### 액세스할 수 없는 타입의 암시적 사용 보고

> **Issue**: [KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 컴파일러는 이제 함수 리터럴 및 타입 인수에서 액세스할 수 없는 타입의 사용을 보고하여,
> 불완전한 타입 정보로 인해 발생하는 컴파일 및 런타임 오류를 방지합니다.
>
> **Deprecation cycle**:
>
> - 2.0.0: 액세스할 수 없는 비제네릭 타입의 파라미터 또는 수신기가 있는 함수 리터럴과 액세스할 수 없는 타입 인수가 있는 타입에 대한 경고 보고; 액세스할 수 없는 제네릭 타입의 파라미터 또는 수신기가 있는 함수 리터럴과 특정 시나리오에서 액세스할 수 없는 제네릭 타입 인수가 있는 타입에 대한 오류 보고
> - 2.1.0: 액세스할 수 없는 비제네릭 타입의 파라미터 및 수신기가 있는 함수 리터럴에 대한 경고를 오류로 격상
> - 2.2.0: 액세스할 수 없는 타입 인수가 있는 타입에 대한 경고를 오류로 격상

## 표준 라이브러리

### Char 및 String에 대한 로케일 종속 케이스 변환 함수 사용 중단

> **Issue**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: 다른 Kotlin 표준 라이브러리 API 중에서 `Char.toUpperCase()` 및 `String.toLowerCase()`와 같은 `Char` 및 `String`에 대한 로케일 종속 케이스 변환 함수가 더 이상 사용되지 않습니다.
> `String.lowercase()`와 같은 로케일 독립적인 대안으로 대체하거나 `String.lowercase(Locale.getDefault())`와 같이 로케일 종속 동작에 대한 로케일을 명시적으로 지정하십시오.
>
> Kotlin 2.1.0에서 더 이상 사용되지 않는 Kotlin 표준 라이브러리 API의 포괄적인 목록은 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628)을 참조하십시오.
>
> **Deprecation cycle**:
>
> - 1.4.30: 로케일 독립적인 대안을 실험적 API로 도입
> - 1.5.0: 경고와 함께 로케일 종속 케이스 변환 함수 사용 중단
> - 2.1.0: 경고를 오류로 격상

### kotlin-stdlib-common JAR 아티팩트 제거

> **Issue**: [KT-62159](https://youtrack.jetbrains.com/issue/KT-62159)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: binary
>
> **Short summary**:  이전에 레거시 멀티 플랫폼 선언 메타데이터에 사용되었던 `kotlin-stdlib-common.jar` 아티팩트는 더 이상 사용되지 않으며 공통 멀티 플랫폼 선언 메타데이터의 표준 형식으로 `.klib` 파일로 대체됩니다.
> 이 변경 사항은 주요 `kotlin-stdlib.jar` 또는 `kotlin-stdlib-all.jar` 아티팩트에는 영향을 미치지 않습니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: `kotlin-stdlib-common.jar` 아티팩트 사용 중단 및 제거

### appendln()을 appendLine()으로 대체

> **Issue**: [KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: `StringBuilder.appendln()`은 `StringBuilder.appendLine()`으로 대체되었습니다.
>
> **Deprecation cycle**:
>
> - 1.4.0: `appendln()` 함수는 사용 중단됨; 사용 시 경고 보고
> - 2.1.0: 경고를 오류로 격상

### Kotlin/Native에서 freezing 관련 API 사용 중단

> **Issue**: [KT-69545](https://youtrack.jetbrains.com/issue/KT-69545)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: 이전에 `@FreezingIsDeprecated` 어노테이션으로 표시되었던 Kotlin/Native의 freezing 관련 API는 이제 사용 중단되었습니다.
> 이는 스레드 공유를 위해 객체를 freezing할 필요성을 제거하는 새로운 메모리 관리자 도입과 일치합니다.
> 마이그레이션에 대한 자세한 내용은 [Kotlin/Native 마이그레이션 가이드](native-migration-guide#update-your-code)를 참조하십시오.
>
> **Deprecation cycle**:
>
> - 1.7.20: 경고와 함께 freezing 관련 API 사용 중단
> - 2.1.0: 경고를 오류로 격상

### Map.Entry 동작을 구조적 수정 시 fail-fast로 변경

> **Issue**: [KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 관련 맵이 구조적으로 수정된 후 `Map.Entry` 키-값 쌍에 액세스하면 이제 `ConcurrentModificationException`이 발생합니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: 맵 구조적 수정이 감지되면 예외 발생

## 도구

### KotlinCompilationOutput#resourcesDirProvider 사용 중단

> **Issue**: [KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinCompilationOutput#resourcesDirProvider` 필드는 사용 중단되었습니다.
> 추가 리소스 디렉토리를 추가하려면 Gradle 빌드 스크립트에서 대신 `KotlinSourceSet.resources`를 사용하십시오.
> 
> **Deprecation cycle**:
>
> - 2.1.0: `KotlinCompilationOutput#resourcesDirProvider`는 사용 중단됨

### registerKotlinJvmCompileTask(taskName, moduleName) 함수 사용 중단

> **Issue**: [KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinJvmCompilerOptions`를 허용하는 새로운 `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` 함수를 대신 사용하도록 `registerKotlinJvmCompileTask(taskName, moduleName)` 함수는 사용 중단되었습니다.
> 이를 통해 일반적으로 확장 또는 대상에서 `compilerOptions` 인스턴스를 전달할 수 있으며, 해당 값은 작업 옵션에 대한 규칙으로 사용됩니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: `registerKotlinJvmCompileTask(taskName, moduleName)` 함수는 사용 중단됨

### registerKaptGenerateStubsTask(taskName) 함수 사용 중단

> **Issue**: [KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` 함수를 대신 사용하도록 `registerKaptGenerateStubsTask(taskName)` 함수는 사용 중단되었습니다.
> 이 새로운 버전을 사용하면 관련 `KotlinJvmCompile` 작업에서 값을 규칙으로 연결하여 두 작업 모두 동일한 옵션 세트를 사용하도록 할 수 있습니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: `registerKaptGenerateStubsTask(taskName)` 함수는 사용 중단됨

### KotlinTopLevelExtension 및 KotlinTopLevelExtensionConfig 인터페이스 사용 중단

> **Issue**: [KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 새로운 `KotlinTopLevelExtension` 인터페이스를 대신 사용하도록 `KotlinTopLevelExtension` 및 `KotlinTopLevelExtensionConfig` 인터페이스는 사용 중단되었습니다.
> 이 인터페이스는 `KotlinTopLevelExtensionConfig`, `KotlinTopLevelExtension` 및 `KotlinProjectExtension`을 병합하여
> API 계층 구조를 간소화하고 JVM 툴체인 및 컴파일러 속성에 대한 공식 액세스를 제공합니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: `KotlinTopLevelExtension` 및 `KotlinTopLevelExtensionConfig` 인터페이스는 사용 중단됨

### 빌드 런타임 종속성에서 kotlin-compiler-embeddable 제거

> **Issue**: [KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin-compiler-embeddable` 종속성은 Kotlin Gradle Plugin (KGP)의 런타임에서 제거되었습니다.
> 필요한 모듈은 이제 KGP 아티팩트에 직접 포함되며, Kotlin 언어 버전은 8.2 미만의 버전에서 Gradle Kotlin 런타임과의 호환성을 지원하기 위해 2.0으로 제한됩니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: `kotlin-compiler-embeddable` 사용에 대한 경고 보고
> - 2.2.0: 경고를 오류로 격상

### Kotlin Gradle Plugin API에서 컴파일러 심볼 숨기기

> **Issue**: [KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinCompilerVersion`과 같은 Kotlin Gradle Plugin (KGP) 내에 번들된 컴파일러 모듈 심볼은
> 빌드 스크립트에서 의도하지 않은 액세스를 방지하기 위해 public API에서 숨겨집니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: 이러한 심볼에 액세스하는 것에 대한 경고 보고
> - 2.2.0: 경고를 오류로 격상

### 여러 안정성 구성 파일에 대한 지원 추가

> **Issue**: [KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Compose 확장 기능의 `stabilityConfigurationFile` 속성은
> 여러 구성 파일을 지정할 수 있는 새로운 `stabilityConfigurationFiles` 속성을 대신 사용하도록 사용 중단되었습니다.
>
> **Deprecation cycle**:
>
> - 2.1.0: `stabilityConfigurationFile` 속성은 사용 중단됨

### 더 이상 사용되지 않는 플랫폼 플러그인 ID 제거

> **Issue**: [KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 다음 플랫폼 플러그인 ID에 대한 지원이 제거되었습니다.
> * `kotlin-platform-common`
> * `org.jetbrains.kotlin.platform.common`
>
> **Deprecation cycle**:
>
> - 1.3: 플랫폼 플러그인 ID가 사용 중단됨
> - 2.1.0: 플랫폼 플러그인 ID는 더 이상 지원되지 않음