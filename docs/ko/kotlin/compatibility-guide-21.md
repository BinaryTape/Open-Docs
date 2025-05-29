[//]: # (title: Kotlin 2.1 호환성 가이드)

_[언어를 현대적으로 유지하기](kotlin-evolution-principles.md)_와 _[편안한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 근본 원칙 중 하나입니다. 전자는 언어 발전을 방해하는 구성 요소는 제거되어야 한다고 말하며, 후자는 코드 마이그레이션이 가능한 한 원활하도록 이러한 제거가 사전에 잘 소통되어야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 모든 내용을 요약하여 Kotlin 2.0에서 Kotlin 2.1으로의 마이그레이션을 위한 완전한 참조를 제공합니다.

## 기본 용어

이 문서에서는 몇 가지 종류의 호환성을 소개합니다.

- _소스_: 소스 비호환 변경은 (오류나 경고 없이) 잘 컴파일되던 코드가 더 이상 컴파일되지 않게 합니다.
- _바이너리_: 두 바이너리 아티팩트가 바이너리 호환된다고 하는 것은 이들을 상호 교환해도 로딩 또는 링크 오류가 발생하지 않는 경우를 말합니다.
- _동작_: 변경이 동작 비호환이라고 하는 것은 변경 사항을 적용하기 전과 후에 동일한 프로그램이 다른 동작을 보이는 경우를 말합니다.

이러한 정의는 순수 Kotlin에 대해서만 제공된다는 점을 기억하세요. 다른 언어 관점에서의 Kotlin 코드 호환성(예: Java에서)은 이 문서의 범위를 벗어납니다.

## 언어

### 언어 버전 1.4 및 1.5 제거

> **이슈**: [KT-60521](https://youtrack.jetbrains.com/issue/KT-60521)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: Kotlin 2.1은 언어 버전 2.1을 도입하고 언어 버전 1.4 및 1.5에 대한 지원을 제거합니다. 언어 버전 1.6 및 1.7은 사용 중단되었습니다.
>
> **사용 중단 주기**:
>
> - 1.6.0: 언어 버전 1.4에 대한 경고 보고
> - 1.9.0: 언어 버전 1.5에 대한 경고 보고
> - 2.1.0: 언어 버전 1.6 및 1.7에 대한 경고 보고; 언어 버전 1.4 및 1.5에 대한 경고를 오류로 격상

### Kotlin/Native에서 typeOf() 함수 동작 변경

> **이슈**: [KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 동작
>
> **요약**: Kotlin/Native의 `typeOf()` 함수 동작이 Kotlin/JVM과 일치하도록 조정되어 플랫폼 간 일관성을 보장합니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: Kotlin/Native에서 `typeOf()` 함수 동작 일치시키기

### 타입 파라미터의 바운드를 통해 타입 노출 금지

> **이슈**: [KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: 타입 파라미터 바운드를 통해 가시성이 낮은 타입을 노출하는 것이 이제 금지됩니다. 이는 타입 가시성 규칙의 불일치를 해결합니다. 이 변경 사항은 타입 파라미터의 바운드가 클래스와 동일한 가시성 규칙을 따르도록 하여 JVM에서의 IR 유효성 검사 오류와 같은 문제를 방지합니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: 가시성이 낮은 타입 파라미터 바운드를 통해 타입 노출 시 경고 보고
> - 2.2.0: 경고를 오류로 격상

### 동일한 이름을 가진 추상 var 프로퍼티와 val 프로퍼티의 상속 금지

> **이슈**: [KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: 클래스가 인터페이스로부터 추상 `var` 프로퍼티를 상속받고, 슈퍼클래스로부터 동일한 이름을 가진 `val` 프로퍼티를 상속받는 경우, 이제 컴파일 오류가 발생합니다. 이는 이러한 경우에 setter가 없어 발생하는 런타임 크래시를 해결합니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: 클래스가 인터페이스로부터 추상 `var` 프로퍼티를 상속받고 슈퍼클래스로부터 동일한 이름을 가진 `val` 프로퍼티를 상속받을 때 경고(또는 프로그레시브 모드에서는 오류) 보고
> - 2.2.0: 경고를 오류로 격상

### 초기화되지 않은 enum 엔트리 접근 시 오류 보고

> **이슈**: [KT-68451](https://youtrack.jetbrains.com/issue/KT-68451)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: 컴파일러는 이제 enum 클래스 또는 엔트리 초기화 중에 초기화되지 않은 enum 엔트리에 접근할 때 오류를 보고합니다. 이는 멤버 프로퍼티 초기화 규칙과 동작을 일치시켜 런타임 예외를 방지하고 일관된 로직을 보장합니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: 초기화되지 않은 enum 엔트리에 접근할 때 오류 보고

### K2 스마트 캐스트 전파 변경

> **이슈**: [KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 동작
>
> **요약**: K2 컴파일러는 `val x = y`와 같이 추론된 변수에 대한 타입 정보의 양방향 전파를 도입하여 스마트 캐스트 전파 동작을 변경합니다. `val x: T = y`와 같이 명시적으로 타입이 지정된 변수는 더 이상 타입 정보를 전파하지 않아 선언된 타입에 대한 엄격한 준수를 보장합니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: 새 동작 활성화

### Java 서브클래스에서 멤버 확장 프로퍼티 재정의 처리 수정

> **이슈**: [KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 동작
>
> **요약**: Java 서브클래스에 의해 재정의된 멤버 확장 프로퍼티의 getter는 이제 서브클래스의 스코프에서 숨겨져 일반 Kotlin 프로퍼티와 동작이 일치합니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: 새 동작 활성화

### protected val을 재정의하는 var 프로퍼티의 getter 및 setter에 대한 가시성 정렬 수정

> **이슈**: [KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 바이너리
>
> **요약**: `protected val` 프로퍼티를 재정의하는 `var` 프로퍼티의 getter 및 setter의 가시성은 이제 일관적이며, 둘 다 재정의된 `val` 프로퍼티의 가시성을 상속합니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: K2에서 getter 및 setter 모두에 대한 일관된 가시성 강제; K1은 영향을 받지 않음

### JSpecify nullability 불일치 진단 심각도를 오류로 격상

> **이슈**: [KTLC-11](https://youtrack.jetbrains.com/issue/KTLC-11)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: `@NonNull`, `@Nullable`, `@NullMarked`와 같은 `org.jspecify.annotations`에서 발생하는 nullability 불일치는 이제 경고 대신 오류로 처리되어 Java 상호 운용성을 위한 더 엄격한 타입 안전성을 강제합니다. 이러한 진단의 심각도를 조정하려면 `-Xnullability-annotations` 컴파일러 옵션을 사용하세요.
>
> **사용 중단 주기**:
>
> - 1.6.0: 잠재적인 nullability 불일치에 대한 경고 보고
> - 1.8.20: `@Nullable`, `@NullnessUnspecified`, `@NullMarked`를 포함한 특정 JSpecify 어노테이션 및 `org.jspecify.nullness`의 레거시 어노테이션(JSpecify 0.2 및 이전 버전)으로 경고 확장
> - 2.0.0: `@NonNull` 어노테이션 지원 추가
> - 2.1.0: JSpecify 어노테이션에 대한 기본 모드를 `strict`로 변경하여 경고를 오류로 변환; 기본 동작을 재정의하려면 `-Xnullability-annotations=@org.jspecify.annotations:warning` 또는 `-Xnullability-annotations=@org.jspecify.annotations:ignore` 사용

### 모호한 경우 오버로드 해결 시 확장 함수를 invoke 호출보다 우선하도록 변경

> **이슈**: [KTLC-37](https://youtrack.jetbrains.com/issue/KTLC-37)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 동작
>
> **요약**: 오버로드 해결은 이제 모호한 경우에 `invoke` 호출보다 확장 함수를 일관되게 우선합니다. 이는 로컬 함수 및 프로퍼티에 대한 해결 로직의 불일치를 해결합니다. 이 변경 사항은 재컴파일 후에만 적용되며, 미리 컴파일된 바이너리에는 영향을 미치지 않습니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: 일치하는 시그니처를 가진 확장 함수에 대한 오버로드 해결 시 `invoke` 호출보다 확장 함수를 일관되게 우선하도록 변경; 이 변경 사항은 재컴파일 후에만 적용되며 미리 컴파일된 바이너리에는 영향을 미치지 않습니다.

### JDK 함수 인터페이스의 SAM 생성자에서 람다로부터 널러블 값 반환 금지

> **이슈**: [KTLC-42](https://youtrack.jetbrains.com/issue/KTLC-42)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: JDK 함수 인터페이스의 SAM 생성자에서 람다로부터 널러블 값을 반환하는 것은 이제 지정된 타입 인수가 non-nullable인 경우 컴파일 오류를 발생시킵니다. 이는 nullability 불일치로 인해 런타임 예외가 발생할 수 있는 문제를 해결하여 더 엄격한 타입 안전성을 보장합니다.
>
> **사용 중단 주기**:
>
> - 2.0.0: JDK 함수 인터페이스의 SAM 생성자에서 널러블 반환 값에 대한 사용 중단 경고 보고
> - 2.1.0: 새 동작 기본적으로 활성화

### Kotlin/Native에서 private 멤버가 public 멤버와 충돌하는 경우 처리 수정

> **이슈**: [KTLC-43](https://youtrack.jetbrains.com/issue/KTLC-43)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 동작
>
> **요약**: Kotlin/Native에서 private 멤버는 더 이상 슈퍼클래스의 public 멤버를 재정의하거나 충돌하지 않으며, Kotlin/JVM과 동작이 일치합니다. 이는 재정의 해결의 불일치를 해결하고 별도 컴파일로 인해 발생하는 예기치 않은 동작을 제거합니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: Kotlin/Native에서 private 함수 및 프로퍼티는 더 이상 슈퍼클래스의 public 멤버를 재정의하거나 영향을 주지 않으며, JVM 동작과 일치합니다.

### public 인라인 함수에서 private 연산자 함수 접근 금지

> **이슈**: [KTLC-71](https://youtrack.jetbrains.com/issue/KTLC-71)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: `getValue()`, `setValue()`, `provideDelegate()`, `hasNext()`, `next()`와 같은 private 연산자 함수는 더 이상 public 인라인 함수에서 접근할 수 없습니다.
>
> **사용 중단 주기**:
>
> - 2.0.0: public 인라인 함수에서 private 연산자 함수에 접근할 때 사용 중단 경고 보고
> - 2.1.0: 경고를 오류로 격상

### @UnsafeVariance 어노테이션이 붙은 불변 파라미터에 유효하지 않은 인수 전달 금지

> **이슈**: [KTLC-72](https://youtrack.jetbrains.com/issue/KTLC-72)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: 컴파일러는 이제 타입 검사 중에 `@UnsafeVariance` 어노테이션을 무시하여 불변 타입 파라미터에 대한 더 엄격한 타입 안전성을 강제합니다. 이는 예상되는 타입 검사를 우회하기 위해 `@UnsafeVariance`에 의존하는 유효하지 않은 호출을 방지합니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: 새 동작 활성화

### 경고 수준 Java 타입의 오류 수준 널러블 인수에 대한 nullability 오류 보고

> **이슈**: [KTLC-100](https://youtrack.jetbrains.com/issue/KTLC-100)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: 컴파일러는 이제 경고 수준 널러블 타입이 더 엄격한 오류 수준 널러블성을 가진 타입 인수를 포함하는 Java 메서드에서 nullability 불일치를 감지합니다. 이는 이전에 무시되었던 타입 인수 오류가 올바르게 보고되도록 보장합니다.
>
> **사용 중단 주기**:
>
> - 2.0.0: 더 엄격한 타입 인수를 가진 Java 메서드에서 nullability 불일치에 대한 사용 중단 경고 보고
> - 2.1.0: 경고를 오류로 격상

### 접근 불가능한 타입의 암시적 사용 보고

> **이슈**: [KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **컴포넌트**: 핵심 언어
>
> **비호환 변경 유형**: 소스
>
> **요약**: 컴파일러는 이제 함수 리터럴 및 타입 인수에서 접근 불가능한 타입의 사용을 보고하여 불완전한 타입 정보로 인해 발생하는 컴파일 및 런타임 실패를 방지합니다.
>
> **사용 중단 주기**:
>
> - 2.0.0: 접근 불가능한 비제네릭 타입을 파라미터나 리시버로 가지는 함수 리터럴 및 접근 불가능한 타입 인수를 가지는 타입에 대해 경고 보고; 특정 시나리오에서 접근 불가능한 제네릭 타입을 파라미터나 리시버로 가지는 함수 리터럴 및 접근 불가능한 제네릭 타입 인수를 가지는 타입에 대해 오류 보고
> - 2.1.0: 접근 불가능한 비제네릭 타입을 파라미터와 리시버로 가지는 함수 리터럴에 대한 경고를 오류로 격상
> - 2.2.0: 접근 불가능한 타입 인수를 가지는 타입에 대한 경고를 오류로 격상

## 표준 라이브러리

### Char 및 String에 대한 로케일 민감 대소문자 변환 함수 사용 중단

> **이슈**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **컴포넌트**: kotlin-stdlib
>
> **비호환 변경 유형**: 소스
>
> **요약**: 다른 Kotlin 표준 라이브러리 API 중에서도 `Char.toUpperCase()` 및 `String.toLowerCase()`와 같은 `Char` 및 `String`에 대한 로케일 민감 대소문자 변환 함수가 사용 중단되었습니다. 이를 `String.lowercase()`와 같은 로케일 독립적 대안으로 바꾸거나, `String.lowercase(Locale.getDefault())`와 같이 로케일 민감 동작을 위해 로케일을 명시적으로 지정하세요.
>
> Kotlin 2.1.0에서 사용 중단된 Kotlin 표준 라이브러리 API의 전체 목록은 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628)을 참조하세요.
>
> **사용 중단 주기**:
>
> - 1.4.30: 로케일 독립적 대안을 실험적 API로 도입
> - 1.5.0: 로케일 민감 대소문자 변환 함수를 경고와 함께 사용 중단
> - 2.1.0: 경고를 오류로 격상

### kotlin-stdlib-common JAR 아티팩트 제거

> **이슈**: [KT-62159](https://youtrack.jetbrains.com/issue/KT-62159)
>
> **컴포넌트**: kotlin-stdlib
>
> **비호환 변경 유형**: 바이너리
>
> **요약**: 이전에 레거시 멀티플랫폼 선언 메타데이터에 사용되던 `kotlin-stdlib-common.jar` 아티팩트가 사용 중단되었으며, 공통 멀티플랫폼 선언 메타데이터의 표준 형식으로 `.klib` 파일로 대체되었습니다. 이 변경은 주요 `kotlin-stdlib.jar` 또는 `kotlin-stdlib-all.jar` 아티팩트에는 영향을 미치지 않습니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: `kotlin-stdlib-common.jar` 아티팩트 사용 중단 및 제거

### appendln()을 appendLine() 대신 사용 중단

> **이슈**: [KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **컴포넌트**: kotlin-stdlib
>
> **비호환 변경 유형**: 소스
>
> **요약**: `StringBuilder.appendln()`은 `StringBuilder.appendLine()` 대신 사용 중단되었습니다.
>
> **사용 중단 주기**:
>
> - 1.4.0: `appendln()` 함수는 사용 중단되었습니다; 사용 시 경고 보고
> - 2.1.0: 경고를 오류로 격상

### Kotlin/Native에서 동결 관련 API 사용 중단

> **이슈**: [KT-69545](https://youtrack.jetbrains.com/issue/KT-69545)
>
> **컴포넌트**: kotlin-stdlib
>
> **비호환 변경 유형**: 소스
>
> **요약**: 이전에 `@FreezingIsDeprecated` 어노테이션으로 표시되었던 Kotlin/Native의 동결 관련 API가 이제 사용 중단되었습니다. 이는 스레드 공유를 위해 객체를 동결할 필요가 없어진 새로운 메모리 관리자 도입과 일치합니다. 마이그레이션 세부 정보는 [Kotlin/Native 마이그레이션 가이드](native-migration-guide.md#update-your-code)를 참조하세요.
>
> **사용 중단 주기**:
>
> - 1.7.20: 동결 관련 API를 경고와 함께 사용 중단
> - 2.1.0: 경고를 오류로 격상

### Map.Entry 동작을 구조적 수정 시 fail-fast 방식으로 변경

> **이슈**: [KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **컴포넌트**: kotlin-stdlib
>
> **비호환 변경 유형**: 동작
>
> **요약**: `Map.Entry` 키-값 쌍에 접근할 때 관련 맵이 구조적으로 수정된 경우 이제 `ConcurrentModificationException`이 발생합니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: 맵 구조적 수정이 감지되면 예외 발생

## 도구

### KotlinCompilationOutput#resourcesDirProvider 사용 중단

> **이슈**: [KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **컴포넌트**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: `KotlinCompilationOutput#resourcesDirProvider` 필드가 사용 중단되었습니다. 추가 리소스 디렉터리를 추가하려면 Gradle 빌드 스크립트에서 대신 `KotlinSourceSet.resources`를 사용하세요.
>
> **사용 중단 주기**:
>
> - 2.1.0: `KotlinCompilationOutput#resourcesDirProvider`는 사용 중단되었습니다.

### registerKotlinJvmCompileTask(taskName, moduleName) 함수 사용 중단

> **이슈**: [KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **컴포넌트**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: `registerKotlinJvmCompileTask(taskName, moduleName)` 함수는 이제 `KotlinJvmCompilerOptions`를 허용하는 새로운 `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` 함수로 인해 사용 중단되었습니다. 이를 통해 일반적으로 확장 또는 타겟에서 가져온 `compilerOptions` 인스턴스를 전달하여 해당 값이 태스크 옵션의 관례로 사용될 수 있습니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: `registerKotlinJvmCompileTask(taskName, moduleName)` 함수는 사용 중단되었습니다.

### registerKaptGenerateStubsTask(taskName) 함수 사용 중단

> **이슈**: [KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **컴포넌트**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: `registerKaptGenerateStubsTask(taskName)` 함수는 사용 중단되었습니다. 대신 새로운 `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` 함수를 사용하세요. 이 새 버전은 관련 `KotlinJvmCompile` 태스크에서 값을 관례로 연결하여 두 태스크가 동일한 옵션 세트를 사용하도록 보장합니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: `registerKaptGenerateStubsTask(taskName)` 함수는 사용 중단되었습니다.

### KotlinTopLevelExtension 및 KotlinTopLevelExtensionConfig 인터페이스 사용 중단

> **이슈**: [KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **컴포넌트**: Gradle
>
> **비호환 변경 유형**: 동작
>
> **요약**: `KotlinTopLevelExtension` 및 `KotlinTopLevelExtensionConfig` 인터페이스는 새로운 `KotlinTopLevelExtension` 인터페이스로 인해 사용 중단되었습니다. 이 인터페이스는 `KotlinTopLevelExtensionConfig`, `KotlinTopLevelExtension`, `KotlinProjectExtension`을 병합하여 API 계층을 간소화하고 JVM 툴체인 및 컴파일러 프로퍼티에 대한 공식적인 접근을 제공합니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: `KotlinTopLevelExtension` 및 `KotlinTopLevelExtensionConfig` 인터페이스는 사용 중단되었습니다.

### 빌드 런타임 의존성에서 kotlin-compiler-embeddable 제거

> **이슈**: [KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **컴포넌트**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: `kotlin-compiler-embeddable` 의존성이 Kotlin Gradle 플러그인(KGP)의 런타임에서 제거되었습니다. 필수 모듈은 이제 KGP 아티팩트에 직접 포함되며, 8.2 미만 버전의 Gradle Kotlin 런타임과의 호환성을 지원하기 위해 Kotlin 언어 버전은 2.0으로 제한됩니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: `kotlin-compiler-embeddable` 사용 시 경고 보고
> - 2.2.0: 경고를 오류로 격상

### Kotlin Gradle 플러그인 API에서 컴파일러 심볼 숨기기

> **이슈**: [KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **컴포넌트**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: `KotlinCompilerVersion`과 같이 Kotlin Gradle 플러그인(KGP)에 번들된 컴파일러 모듈 심볼은 빌드 스크립트에서 의도치 않은 접근을 방지하기 위해 public API에서 숨겨졌습니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: 이 심볼에 접근 시 경고 보고
> - 2.2.0: 경고를 오류로 격상

### 다중 안정성 구성 파일 지원 추가

> **이슈**: [KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **컴포넌트**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: Compose 확장 기능의 `stabilityConfigurationFile` 프로퍼티는 여러 구성 파일을 지정할 수 있는 새로운 `stabilityConfigurationFiles` 프로퍼티로 인해 사용 중단되었습니다.
>
> **사용 중단 주기**:
>
> - 2.1.0: `stabilityConfigurationFile` 프로퍼티는 사용 중단되었습니다.

### 사용 중단된 플랫폼 플러그인 ID 제거

> **이슈**: [KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **컴포넌트**: Gradle
>
> **비호환 변경 유형**: 소스
>
> **요약**: 다음 플랫폼 플러그인 ID에 대한 지원이 제거되었습니다:
> * `kotlin-platform-common`
> * `org.jetbrains.kotlin.platform.common`
>
> **사용 중단 주기**:
>
> - 1.3: 플랫폼 플러그인 ID는 사용 중단되었습니다.
> - 2.1.0: 플랫폼 플러그인 ID는 더 이상 지원되지 않습니다.