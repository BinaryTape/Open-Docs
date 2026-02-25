[//]: # (title: Kotlin 2.1.x 호환성 가이드)

_[언어를 현대적으로 유지하기](kotlin-evolution-principles.md)_와 _[편안한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 기본 원칙입니다. 전자는 언어의 진화를 방해하는 구조를 제거해야 한다는 원칙이며, 후자는 이러한 제거가 코드 마이그레이션을 가능한 한 원활하게 할 수 있도록 사전에 충분히 전달되어야 한다는 원칙입니다.

대부분의 언어 변경 사항은 업데이트 변경 로그나 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 이를 모두 요약하여 Kotlin 2.0에서 Kotlin 2.1로의 마이그레이션을 위한 완전한 참고 자료를 제공합니다.

## 기본 용어

이 문서에서는 몇 가지 종류의 호환성을 소개합니다.

- _소스(source)_: 소스 호환되지 않는 변경은 이전에 잘 컴파일되던 코드(에러나 경고 없이)가 더 이상 컴파일되지 않게 함을 의미합니다.
- _바이너리(binary)_: 두 바이너리 아티팩트가 서로 교체되어도 로딩이나 링크 에러가 발생하지 않는 경우, 이를 바이너리 호환된다고 합니다.
- _동작(behavioral)_: 변경 전후에 동일한 프로그램이 서로 다른 동작을 보일 경우, 해당 변경을 동작 호환되지 않는다고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 적용된다는 점을 기억하십시오. 다른 언어 관점(예: Java)에서의 Kotlin 코드 호환성은 이 문서의 범위를 벗어납니다.

## 언어 (Language)

### 언어 버전 1.4 및 1.5 제거

> **이슈**: [KT-60521](https://youtrack.jetbrains.com/issue/KT-60521)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 2.1은 언어 버전 2.1을 도입하고 언어 버전 1.4 및 1.5에 대한 지원을 제거합니다. 언어 버전 1.6 및 1.7은 지원 중단(deprecated)되었습니다.
>
> **지원 종료 주기**:
>
> - 1.6.0: 언어 버전 1.4에 대해 경고 보고
> - 1.9.0: 언어 버전 1.5에 대해 경고 보고
> - 2.1.0: 언어 버전 1.6 및 1.7에 대해 경고 보고, 언어 버전 1.4 및 1.5에 대한 경고를 에러로 격상

### Kotlin/Native에서 typeOf() 함수 동작 변경

> **이슈**: [KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: 플랫폼 간의 일관성을 보장하기 위해 Kotlin/Native에서의 `typeOf()` 함수 동작을 Kotlin/JVM과 맞췄습니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: Kotlin/Native에서 `typeOf()` 함수 동작 조정

### 타입 파라미터 바운드를 통한 타입 노출 금지

> **이슈**: [KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 타입 가시성 규칙의 불일치를 해결하기 위해, 타입 파라미터 바운드(type parameter bounds)를 통해 더 낮은 가시성을 가진 타입을 노출하는 것이 이제 금지됩니다. 이 변경을 통해 타입 파라미터의 바운드가 클래스와 동일한 가시성 규칙을 따르게 되어 JVM의 IR 검증 에러와 같은 문제를 방지합니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: 더 낮은 가시성을 가진 타입 파라미터 바운드를 통해 타입을 노출하는 경우 경고 보고
> - 2.2.0: 경고를 에러로 격상

### 동일한 이름을 가진 추상 var 프로퍼티와 val 프로퍼티의 상속 금지

> **이슈**: [KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 클래스가 인터페이스로부터 추상 `var` 프로퍼티를 상속받고, 상위 클래스로부터 동일한 이름의 `val` 프로퍼티를 상속받는 경우 이제 컴파일 에러가 발생합니다. 이는 이러한 경우 세터(setter)가 누락되어 발생하는 런타임 크래시를 해결합니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: 클래스가 인터페이스로부터 추상 `var` 프로퍼티를 상속받고 상위 클래스로부터 동일한 이름의 `val` 프로퍼티를 상속받을 때 경고(또는 progressive 모드에서 에러) 보고
> - 2.2.0: 경고를 에러로 격상

### 초기화되지 않은 열거형 항목 접근 시 에러 보고

> **이슈**: [KT-68451](https://youtrack.jetbrains.com/issue/KT-68451)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 열거형(enum) 클래스 또는 항목 초기화 중에 초기화되지 않은 열거형 항목에 접근하면 컴파일러가 이제 에러를 보고합니다. 이는 동작을 멤버 프로퍼티 초기화 규칙과 일치시켜 런타임 예외를 방지하고 일관된 로직을 보장합니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: 초기화되지 않은 열거형 항목 접근 시 에러 보고

### K2 스마트 캐스트 전파의 변경 사항

> **이슈**: [KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: K2 컴파일러는 `val x = y`와 같이 타입이 추론된 변수에 대해 타입 정보의 양방향 전파를 도입하여 스마트 캐스트(smart cast) 전파 동작을 변경합니다. `val x: T = y`와 같이 명시적으로 타입이 지정된 변수는 더 이상 타입 정보를 전파하지 않으므로 선언된 타입을 더 엄격하게 준수합니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: 새로운 동작 활성화

### Java 서브클래스에서 멤버 확장 프로퍼티 오버라이드 처리 수정

> **이슈**: [KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Java 서브클래스에 의해 오버라이드된 멤버 확장 프로퍼티(member-extension property)의 게터(getter)가 이제 서브클래스의 스코프에서 숨겨지며, 이는 일반적인 Kotlin 프로퍼티의 동작과 일치합니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: 새로운 동작 활성화

### protected val을 오버라이드하는 var 프로퍼티의 게터 및 세터 가시성 정렬 수정

> **이슈**: [KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 바이너리
> 
> **요약**: `protected val` 프로퍼티를 오버라이드하는 `var` 프로퍼티의 게터와 세터 가시성이 이제 일관되게 적용되며, 둘 다 오버라이드된 `val` 프로퍼티의 가시성을 상속받습니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: K2에서 게터와 세터 모두에 대해 일관된 가시성 강제 적용. K1은 영향받지 않음.

### JSpecify nullability 불일치 진단 심각도를 에러로 격상

> **이슈**: [KTLC-11](https://youtrack.jetbrains.com/issue/KTLC-11)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `@NonNull`, `@Nullable`, `@NullMarked`와 같은 `org.jspecify.annotations`의 Null 허용 여부(nullability) 불일치가 이제 경고 대신 에러로 처리되어 Java 상호운용성에 대해 더 엄격한 타입 안전성을 강제합니다. 이러한 진단의 심각도를 조정하려면 `-Xnullability-annotations` 컴파일러 옵션을 사용하십시오.
>
> **지원 종료 주기**:
>
> - 1.6.0: 잠재적인 null 허용 여부 불일치에 대해 경고 보고
> - 1.8.20: `@Nullable`, `@NullnessUnspecified`, `@NullMarked` 및 `org.jspecify.nullness`의 레거시 어노테이션(JSpecify 0.2 및 이전 버전)을 포함한 특정 JSpecify 어노테이션으로 경고 확장
> - 2.0.0: `@NonNull` 어노테이션 지원 추가
> - 2.1.0: JSpecify 어노테이션의 기본 모드를 `strict`로 변경하여 경고를 에러로 변환. 기본 동작을 덮어쓰려면 `-Xnullability-annotations=@org.jspecify.annotations:warning` 또는 `-Xnullability-annotations=@org.jspecify.annotations:ignore`를 사용

### 모호한 경우 invoke 호출보다 확장 함수를 우선하도록 오버로드 해제 변경

> **이슈**: [KTLC-37](https://youtrack.jetbrains.com/issue/KTLC-37)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 동작
> 
> **요약**: 오버로드 해제(overload resolution) 시 모호한 경우 이제 일관되게 invoke 호출보다 확장 함수를 우선합니다. 이는 로컬 함수 및 프로퍼티의 해제 로직 불일치를 해결합니다. 이 변경 사항은 재컴파일 후에만 적용되며, 이미 컴파일된 바이너리에는 영향을 미치지 않습니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: 시그니처가 일치하는 확장 함수에 대해 `invoke` 호출보다 확장 함수를 일관되게 우선하도록 오버로드 해제 변경. 이 변경 사항은 재컴파일 후에만 적용되며 이미 컴파일된 바이너리에는 영향을 미치지 않음

### JDK 함수형 인터페이스의 SAM 생성자 내 람다에서 nullable 값 반환 금지

> **이슈**: [KTLC-42](https://youtrack.jetbrains.com/issue/KTLC-42)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
> 
> **요약**: 지정된 타입 인자가 non-nullable인 경우 JDK 함수형 인터페이스의 SAM 생성자 내 람다에서 nullable 값을 반환하면 이제 컴파일 에러가 발생합니다. 이는 null 허용 여부 불일치로 인해 발생할 수 있는 런타임 예외 문제를 해결하여 더 엄격한 타입 안전성을 보장합니다.
>
> **지원 종료 주기**:
>
> - 2.0.0: JDK 함수형 인터페이스의 SAM 생성자 내 nullable 반환 값에 대해 지원 중단 경고 보고
> - 2.1.0: 기본적으로 새로운 동작 활성화

### Kotlin/Native에서 상위 클래스의 public 멤버와 충돌하는 private 멤버 처리 수정

> **이슈**: [KTLC-43](https://youtrack.jetbrains.com/issue/KTLC-43)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 동작
> 
> **요약**: Kotlin/Native에서 private 멤버는 더 이상 상위 클래스의 public 멤버를 오버라이드하거나 충돌하지 않으며, 이는 Kotlin/JVM과 동작이 일치합니다. 이는 오버라이드 해제의 불일치를 해결하고 별도 컴파일(separate compilation)로 인해 발생하는 예상치 못한 동작을 제거합니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: Kotlin/Native의 private 함수 및 프로퍼티가 더 이상 상위 클래스의 public 멤버를 오버라이드하거나 영향을 주지 않으며 JVM 동작과 일치하게 됨

### public inline 함수에서 private 연산자 함수 접근 금지

> **이슈**: [KTLC-71](https://youtrack.jetbrains.com/issue/KTLC-71)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `getValue()`, `setValue()`, `provideDelegate()`, `hasNext()`, `next()`와 같은 private 연산자 함수를 더 이상 public inline 함수에서 접근할 수 없습니다.
>
> **지원 종료 주기**:
>
> - 2.0.0: public inline 함수에서 private 연산자 함수 접근에 대해 지원 중단 경고 보고
> - 2.1.0: 경고를 에러로 격상

### @UnsafeVariance가 지정된 불변(invariant) 파라미터에 유효하지 않은 인자 전달 금지

> **이슈**: [KTLC-72](https://youtrack.jetbrains.com/issue/KTLC-72)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 컴파일러가 이제 타입 검사 중에 `@UnsafeVariance` 어노테이션을 무시하여 불변 타입 파라미터에 대해 더 엄격한 타입 안전성을 강제합니다. 이는 예상되는 타입 검사를 우회하기 위해 `@UnsafeVariance`에 의존하는 잘못된 호출을 방지합니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: 새로운 동작 활성화

### 경고 수준 Java 타입의 에러 수준 nullable 인자에 대해 null 허용 여부 에러 보고

> **이슈**: [KTLC-100](https://youtrack.jetbrains.com/issue/KTLC-100)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 경고 수준의 nullable 타입이 더 엄격한 에러 수준의 null 허용 여부를 가진 타입 인자를 포함하는 Java 메서드에서, 컴파일러가 이제 null 허용 여부 불일치를 감지합니다. 이를 통해 이전에는 무시되었던 타입 인자의 에러가 올바르게 보고됩니다.
>
> **지원 종료 주기**:
>
> - 2.0.0: 더 엄격한 타입 인자를 가진 Java 메서드의 null 허용 여부 불일치에 대해 지원 중단 경고 보고
> - 2.1.0: 경고를 에러로 격상

### 접근 불가능한 타입의 암시적 사용 보고

> **이슈**: [KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **컴포넌트**: 핵심 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 컴파일러가 이제 함수 리터럴(function literals) 및 타입 인자에서 접근 불가능한 타입의 사용을 보고하여, 불완전한 타입 정보로 인한 컴파일 및 런타임 실패를 방지합니다.
>
> **지원 종료 주기**:
>
> - 2.0.0: 접근 불가능한 비-제네릭 타입을 파라미터나 리시버로 가지는 함수 리터럴, 그리고 접근 불가능한 타입 인자를 가진 타입에 대해 경고 보고. 특정 시나리오에서 접근 불가능한 제네릭 타입을 파라미터나 리시버로 가지는 함수 리터럴, 그리고 접근 불가능한 제네릭 타입 인자를 가진 타입에 대해 에러 보고.
> - 2.1.0: 접근 불가능한 비-제네릭 타입을 파라미터나 리시버로 가지는 함수 리터럴에 대해 경고를 에러로 격상
> - 2.2.0: 접근 불가능한 타입 인자를 가진 타입에 대해 경고를 에러로 격상

## 표준 라이브러리 (Standard library)

### Char 및 String의 로케일 종속 대소문자 변환 함수 지원 중단

> **이슈**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 다른 Kotlin 표준 라이브러리 API들과 마찬가지로, `Char.toUpperCase()` 및 `String.toLowerCase()`와 같은 `Char` 및 `String`의 로케일 종속(locale-sensitive) 대소문자 변환 함수가 지원 중단되었습니다. 이를 `String.lowercase()`와 같은 로케일 무관(locale-agnostic) 대안으로 교체하거나, 로케일 종속 동작이 필요한 경우 `String.lowercase(Locale.getDefault())`와 같이 로케일을 명시적으로 지정하십시오.
>
> Kotlin 2.1.0에서 지원 중단된 Kotlin 표준 라이브러리 API의 전체 목록은 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628)을 참조하십시오.
>
> **지원 종료 주기**:
>
> - 1.4.30: 로케일 무관 대안을 실험적 API로 도입
> - 1.5.0: 로케일 종속 대소문자 변환 함수에 대해 경고와 함께 지원 중단
> - 2.1.0: 경고를 에러로 격상

### kotlin-stdlib-common JAR 아티팩트 제거

> **이슈**: [KT-62159](https://youtrack.jetbrains.com/issue/KT-62159)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환되지 않는 변경 유형**: 바이너리
>
> **요약**: 이전에 레거시 멀티플랫폼 선언 메타데이터에 사용되었던 `kotlin-stdlib-common.jar` 아티팩트가 지원 중단되었으며, 공통 멀티플랫폼 선언 메타데이터의 표준 형식인 `.klib` 파일로 대체되었습니다. 이 변경은 메인 `kotlin-stdlib.jar` 또는 `kotlin-stdlib-all.jar` 아티팩트에는 영향을 미치지 않습니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: `kotlin-stdlib-common.jar` 아티팩트 지원 중단 및 제거

### appendln()을 appendLine()으로 대체하기 위해 지원 중단

> **이슈**: [KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `StringBuilder.appendln()`이 `StringBuilder.appendLine()`으로 대체되기 위해 지원 중단되었습니다.
>
> **지원 종료 주기**:
>
> - 1.4.0: `appendln()` 함수 지원 중단, 사용 시 경고 보고
> - 2.1.0: 경고를 에러로 격상

### Kotlin/Native에서 프리징 관련 API 지원 중단

> **이슈**: [KT-69545](https://youtrack.jetbrains.com/issue/KT-69545)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 이전에 `@FreezingIsDeprecated` 어노테이션이 표시되었던 Kotlin/Native의 프리징(freezing) 관련 API가 이제 지원 중단되었습니다. 이는 스레드 공유를 위해 객체를 프리징할 필요가 없어진 새로운 메모리 관리자의 도입과 일치합니다. 마이그레이션 세부 사항은 [Kotlin/Native 마이그레이션 가이드](native-migration-guide.md#update-your-code)를 참조하십시오.
>
> **지원 종료 주기**:
>
> - 1.7.20: 프리징 관련 API에 대해 경고와 함께 지원 중단
> - 2.1.0: 경고를 에러로 격상

### 구조적 변경 시 Map.Entry가 fail-fast 하도록 동작 변경

> **이슈**: [KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: 연관된 맵이 구조적으로 수정된 후 `Map.Entry` 키-값 쌍에 접근하면 이제 `ConcurrentModificationException`이 발생합니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: 맵의 구조적 변경이 감지되면 예외 발생

## 도구 (Tools)

### KotlinCompilationOutput#resourcesDirProvider 지원 중단

> **이슈**: [KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `KotlinCompilationOutput#resourcesDirProvider` 필드가 지원 중단되었습니다. 추가 리소스 디렉토리를 추가하려면 대신 Gradle 빌드 스크립트에서 `KotlinSourceSet.resources`를 사용하십시오.
> 
> **지원 종료 주기**:
>
> - 2.1.0: `KotlinCompilationOutput#resourcesDirProvider` 지원 중단

### registerKotlinJvmCompileTask(taskName, moduleName) 함수 지원 중단

> **이슈**: [KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `registerKotlinJvmCompileTask(taskName, moduleName)` 함수가 이제 `KotlinJvmCompilerOptions`를 허용하는 새로운 `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` 함수를 위해 지원 중단되었습니다. 이를 통해 일반적으로 익스텐션이나 타겟에서 가져온 `compilerOptions` 인스턴스를 전달하여 해당 태스크의 옵션에 대한 규칙으로 사용할 수 있습니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: `registerKotlinJvmCompileTask(taskName, moduleName)` 함수 지원 중단

### registerKaptGenerateStubsTask(taskName) 함수 지원 중단

> **이슈**: [KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: `registerKaptGenerateStubsTask(taskName)` 함수가 지원 중단되었습니다. 대신 새로운 `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` 함수를 사용하십시오. 이 새로운 버전은 관련 `KotlinJvmCompile` 태스크의 값을 규칙으로 연결하여 두 태스크가 동일한 옵션 세트를 사용하도록 보장합니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: `registerKaptGenerateStubsTask(taskName)` 함수 지원 중단

### KotlinTopLevelExtension 및 KotlinTopLevelExtensionConfig 인터페이스 지원 중단

> **이슈**: [KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: `KotlinTopLevelExtension` 및 `KotlinTopLevelExtensionConfig` 인터페이스가 새로운 `KotlinTopLevelExtension` 인터페이스를 위해 지원 중단되었습니다. 이 인터페이스는 API 계층 구조를 간소화하고 JVM 툴체인 및 컴파일러 프로퍼티에 대한 공식적인 접근을 제공하기 위해 `KotlinTopLevelExtensionConfig`, `KotlinTopLevelExtension`, `KotlinProjectExtension`을 병합합니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: `KotlinTopLevelExtension` 및 `KotlinTopLevelExtensionConfig` 인터페이스 지원 중단

### 빌드 런타임 종속성에서 kotlin-compiler-embeddable 제거

> **이슈**: [KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin Gradle Plugin (KGP)의 런타임에서 `kotlin-compiler-embeddable` 종속성이 제거되었습니다. 필요한 모듈은 이제 KGP 아티팩트에 직접 포함되며, 8.2 미만 버전의 Gradle Kotlin 런타임과의 호환성을 지원하기 위해 Kotlin 언어 버전이 2.0으로 제한됩니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: `kotlin-compiler-embeddable` 사용 시 경고 보고
> - 2.2.0: 경고를 에러로 격상

### Kotlin Gradle Plugin API에서 컴파일러 심볼 숨김

> **이슈**: [KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 빌드 스크립트에서의 의도치 않은 접근을 방지하기 위해 `KotlinCompilerVersion`과 같이 Kotlin Gradle Plugin (KGP) 내에 번들로 포함된 컴파일러 모듈 심볼이 공개 API에서 숨겨집니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: 해당 심볼 접근 시 경고 보고
> - 2.2.0: 경고를 에러로 격상

### 다중 안정성 구성 파일 지원 추가

> **이슈**: [KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Compose 익스텐션의 `stabilityConfigurationFile` 프로퍼티가 여러 구성 파일을 지정할 수 있는 새로운 `stabilityConfigurationFiles` 프로퍼티를 위해 지원 중단되었습니다.
>
> **지원 종료 주기**:
>
> - 2.1.0: `stabilityConfigurationFile` 프로퍼티 지원 중단

### 지원 중단된 플랫폼 플러그인 ID 제거

> **이슈**: [KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **컴포넌트**: Gradle
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 다음 플랫폼 플러그인 ID에 대한 지원이 제거되었습니다:
> * `kotlin-platform-common`
> * `org.jetbrains.kotlin.platform.common`
>
> **지원 종료 주기**:
>
> - 1.3: 플랫폼 플러그인 ID 지원 중단
> - 2.1.0: 플랫폼 플러그인 ID가 더 이상 지원되지 않음