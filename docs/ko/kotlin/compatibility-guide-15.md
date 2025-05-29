[//]: # (title: Kotlin 1.5 호환성 가이드)

_[언어를 현대적으로 유지](kotlin-evolution-principles.md)_하고 _[편리한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 근본 원칙 중 하나입니다. 전자는 언어 발전을 저해하는 구조는 제거되어야 한다고 말하며, 후자는 코드 마이그레이션을 가능한 한 원활하게 만들기 위해 이러한 제거가 미리 잘 전달되어야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그나 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 Kotlin 1.4에서 Kotlin 1.5로 마이그레이션하기 위한 완벽한 참조 자료를 제공하며 모든 내용을 요약합니다.

## 기본 용어

이 문서에서는 몇 가지 호환성 유형을 소개합니다:

- _소스(source)_: 소스 호환성이 없는 변경은 (오류나 경고 없이) 잘 컴파일되던 코드가 더 이상 컴파일되지 않게 만듭니다.
- _바이너리(binary)_: 두 바이너리 아티팩트(artifact)는 서로 교환해도 로딩 또는 링크 오류가 발생하지 않을 경우 바이너리 호환성이 있다고 말합니다.
- _동작(behavioral)_: 동일한 프로그램이 변경 사항 적용 전후에 다른 동작을 보일 경우 동작 호환성이 없다고 말합니다.

이 정의는 순수한 Kotlin에 대해서만 주어진다는 것을 기억하십시오. 다른 언어의 관점에서 본 Kotlin 코드의 호환성(예: Java)은 이 문서의 범위를 벗어납니다.

## 언어 및 표준 라이브러리(stdlib)

### 시그니처 다형성 호출에서 스프레드 연산자 사용 금지

> **문제**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **구성 요소**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.5부터는 시그니처 다형성 호출에 스프레드 연산자(`*`)를 사용하는 것이 금지됩니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 호출 지점에서 문제가 되는 연산자에 대한 경고 도입
> - &gt;= 1.5: 이 경고를 오류로 격상,
>  `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall`을 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 해당 클래스에서 보이지 않는(internal/package-private) 추상 멤버를 포함하는 비추상 클래스 금지

> **문제**: [KT-27825](https://youtrack.jetbrains.com/issue/KT-27825)
>
> **구성 요소**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.5부터는 해당 클래스에서 보이지 않는(internal/package-private) 추상 멤버를 포함하는 비추상 클래스가 금지됩니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 문제가 되는 클래스에 대한 경고 도입
> - &gt;= 1.5: 이 경고를 오류로 격상,
>  `-XXLanguage:-ProhibitInvisibleAbstractMethodsInSuperclasses`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### JVM에서 비-reified 타입 파라미터 기반의 배열을 reified 타입 인자로 사용하는 것 금지

> **문제**: [KT-31227](https://youtrack.com/issue/KT-31227)
>
> **구성 요소**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.5부터는 JVM에서 비-reified 타입 파라미터 기반의 배열을 reified 타입 인자로 사용하는 것이 금지됩니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 문제가 되는 호출에 대한 경고 도입
> - &gt;= 1.5: 이 경고를 오류로 격상,
>  `-XXLanguage:-ProhibitNonReifiedArraysAsReifiedTypeArguments`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 주 생성자에게 위임하지 않는 보조 enum 클래스 생성자 금지

> **문제**: [KT-35870](https://youtrack.jetbrains.com/issue/KT-35870)
>
> **구성 요소**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.5부터는 주 생성자에게 위임하지 않는 보조 enum 클래스 생성자가 금지됩니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 문제가 되는 생성자에 대한 경고 도입
> - &gt;= 1.5: 이 경고를 오류로 격상,
>  `-XXLanguage:-RequiredPrimaryConstructorDelegationCallInEnums`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 비공개 인라인 함수에서 익명 타입 노출 금지

> **문제**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **구성 요소**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.5부터는 비공개 인라인 함수에서 익명 타입 노출이 금지됩니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 문제가 되는 생성자에 대한 경고 도입
> - &gt;= 1.5: 이 경고를 오류로 격상,
>  `-XXLanguage:-ApproximateAnonymousReturnTypesInPrivateInlineFunctions`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### SAM 변환을 사용한 인자 뒤에 비-스프레드 배열 전달 금지

> **문제**: [KT-35224](https://youtrack.jetbrains.com/issue/KT-35224)
>
> **구성 요소**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.5부터는 SAM 변환을 사용한 인자 뒤에 비-스프레드 배열을 전달하는 것이 금지됩니다.
>
> **사용 중단 주기**:
>
> - 1.3.70: 문제가 되는 호출에 대한 경고 도입
> - &gt;= 1.5: 이 경고를 오류로 격상,
>  `-XXLanguage:-ProhibitVarargAsArrayAfterSamArgument`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 밑줄(_)로 이름 붙여진 catch 블록 파라미터에 대한 특수 의미 지원

> **문제**: [KT-31567](https://youtrack.jetbrains.com/issue/KT-31567)
>
> **구성 요소**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.5부터는 `catch` 블록에서 예외의 파라미터 이름을 생략하는 데 사용되는 밑줄(`_`) 기호에 대한 참조가 금지됩니다.
>
> **사용 중단 주기**:
>
> - 1.4.20: 문제가 되는 참조에 대한 경고 도입
> - &gt;= 1.5: 이 경고를 오류로 격상,
>  `-XXLanguage:-ForbidReferencingToUnderscoreNamedParameterOfCatchBlock`을 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### SAM 변환 구현 전략을 익명 클래스 기반에서 invokedynamic으로 변경

> **문제**: [KT-44912](https://youtrack.jetbrains.com/issue/KT-44912)
>
> **구성 요소**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Kotlin 1.5부터 SAM(단일 추상 메서드) 변환의 구현 전략이 익명 클래스 생성에서 `invokedynamic` JVM 명령어 사용으로 변경됩니다.
>
> **사용 중단 주기**:
>
> - 1.5: SAM 변환 구현 전략 변경,
>  `-Xsam-conversions=class`를 사용하여 구현 방식을 이전으로 되돌릴 수 있습니다.

### JVM IR 기반 백엔드(backend)의 성능 문제

> **문제**: [KT-48233](https://youtrack.jetbrains.com/issue/KT-48233)
>
> **구성 요소**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Kotlin 1.5는 Kotlin/JVM 컴파일러에 기본적으로 [IR 기반 백엔드](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)를 사용합니다. 이전 백엔드는 이전 언어 버전에서 기본적으로 여전히 사용됩니다.
>
> Kotlin 1.5에서 새 컴파일러를 사용할 경우 일부 성능 저하 문제가 발생할 수 있습니다. 이러한 문제는 수정 중입니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 기본적으로 이전 JVM 백엔드가 사용됩니다.
> - &gt;= 1.5: 기본적으로 IR 기반 백엔드가 사용됩니다. Kotlin 1.5에서 이전 백엔드를 사용해야 하는 경우,
> 프로젝트 구성 파일에 다음 줄을 추가하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.
>
> 그레이들(Gradle)에서:
>
> <tabs>
>
> ```kotlin
> tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> ```groovy
> tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> </tabs>
>
> 메이븐(Maven)에서:
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> 이 플래그(flag)에 대한 지원은 향후 릴리스에서 제거될 예정입니다.

### JVM IR 기반 백엔드에서 필드 정렬 방식 변경

> **문제**: [KT-46378](https://youtrack.jetbrains.com/issue/KT-46378)
>
> **구성 요소**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: 버전 1.5부터 Kotlin은 [IR 기반 백엔드](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)를 사용하여 JVM 바이트코드(bytecode)를 다르게 정렬합니다. 이전 백엔드는 본문에서 선언된 필드를 생성자에서 선언된 필드보다 먼저 생성하는 반면, 새 백엔드는 생성자에서 선언된 필드를 본문에서 선언된 필드보다 먼저 생성합니다. 새 정렬 방식은 Java 직렬화와 같이 필드 순서에 의존하는 직렬화 프레임워크를 사용하는 프로그램의 동작을 변경할 수 있습니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 기본적으로 이전 JVM 백엔드가 사용됩니다. 이 백엔드는 본문에서 선언된 필드를 생성자에서 선언된 필드보다 먼저 생성합니다.
> - &gt;= 1.5: 기본적으로 새 IR 기반 백엔드가 사용됩니다. 생성자에서 선언된 필드는 본문에서 선언된 필드보다 먼저 생성됩니다. 해결 방법으로 Kotlin 1.5에서 일시적으로 이전 백엔드로 전환할 수 있습니다. 그렇게 하려면 프로젝트 구성 파일에 다음 줄을 추가하십시오.
>
> 그레이들(Gradle)에서:
>
> <tabs>
>
> ```kotlin
> tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> ```groovy
> tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> </tabs>
>
> 메이븐(Maven)에서:
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> 이 플래그(flag)에 대한 지원은 향후 릴리스에서 제거될 예정입니다.

### 위임 표현식에 제네릭(generic) 호출이 있는 위임된 프로퍼티(property)에 대한 널 허용(nullability) 단언문(assertion) 생성

> **문제**: [KT-44304](https://youtrack.jetbrains.com/issue/KT-44304)
>
> **구성 요소**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Kotlin 1.5부터 Kotlin 컴파일러는 위임 표현식에 제네릭 호출이 있는 위임된 프로퍼티에 대해 널 허용 단언문을 발행합니다.
>
> **사용 중단 주기**:
>
> - 1.5: 위임된 프로퍼티에 대해 널 허용 단언문 발행(자세한 내용은 이슈 참조),
>  `-Xuse-old-backend` 또는 `-language-version 1.4`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### `@OnlyInputTypes` 어노테이션이 지정된 타입 파라미터를 사용하는 호출에 대한 경고를 오류로 전환

> **문제**: [KT-45861](https://youtrack.jetbrains.com/issue/KT-45861)
>
> **구성 요소**: 코어 언어
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.5부터는 타입 안정성(type safety)을 개선하기 위해 `contains`, `indexOf`, `assertEquals`와 같은 무의미한 인자를 사용하는 호출이 금지됩니다.
>
> **사용 중단 주기**:
>
> - 1.4.0: 문제가 되는 생성자에 대한 경고 도입
> - &gt;= 1.5: 이 경고를 오류로 격상,
>  `-XXLanguage:-StrictOnlyInputTypesChecks`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 명명된 `vararg`가 있는 호출에서 인자 실행의 올바른 순서 사용

> **문제**: [KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **구성 요소**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Kotlin 1.5부터는 명명된 `vararg`가 있는 호출에서 인자 실행 순서가 변경됩니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 문제가 되는 생성자에 대한 경고 도입
> - &gt;= 1.5: 이 경고를 오류로 격상,
>  `-XXLanguage:-UseCorrectExecutionOrderForVarargArguments`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 연산자 함수 호출에서 파라미터의 기본값 사용

> **문제**: [KT-42064](https://youtrack.jetbrains.com/issue/KT-42064)
>
> **구성 요소**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Kotlin 1.5부터는 연산자 호출에서 파라미터의 기본값을 사용합니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 이전 동작(자세한 내용은 이슈 참조)
> - &gt;= 1.5: 동작 변경,
>  `-XXLanguage:-JvmIrEnabledByDefault`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 정규 진행(progression)이 비어 있는 경우 `for` 루프에서 빈 역진행(reversed progression) 생성

> **문제**: [KT-42533](https://youtrack.jetbrains.com/issue/KT-42533)
>
> **구성 요소**: Kotlin/JVM
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Kotlin 1.5부터는 정규 진행이 비어 있는 경우 `for` 루프에서 빈 역진행을 생성합니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 이전 동작(자세한 내용은 이슈 참조)
> - &gt;= 1.5: 동작 변경,
>  `-XXLanguage:-JvmIrEnabledByDefault`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### `Char`를 코드 및 숫자로 변환하는 방식 정리

> **문제**: [KT-23451](https://youtrack.jetbrains.com/issue/KT-23451)
>
> **구성 요소**: kotlin-stdlib
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.5부터 `Char`를 숫자 타입으로 변환하는 것이 사용 중단됩니다.
>
> **사용 중단 주기**:
>
> - 1.5: `Char.toInt()/toShort()/toLong()/toByte()/toDouble()/toFloat()` 및 `Long.toChar()`와 같은 역 함수 사용 중단, 대체 방안 제안

### `kotlin.text` 함수에서 일관성 없는 대소문자 구분 없는 문자 비교

> **문제**: [KT-45496](https://youtrack.jetbrains.com/issue/KT-45496)
>
> **구성 요소**: kotlin-stdlib
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: Kotlin 1.5부터 `Char.equals`는 대소문자를 구분하지 않는 비교 시 먼저 문자의 대문자 변형이 같은지 비교한 다음, 해당 대문자 변형의 소문자 변형(문자 자체와는 반대로)이 같은지 비교하여 개선됩니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 이전 동작(자세한 내용은 이슈 참조)
> - 1.5: `Char.equals` 함수의 동작 변경

### 기본 로케일(locale)에 민감한 대소문자 변환 API 제거

> **문제**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **구성 요소**: kotlin-stdlib
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.5부터 `String.toUpperCase()`와 같은 기본 로케일 민감 대소문자 변환 함수가 사용 중단됩니다.
>
> **사용 중단 주기**:
>
> - 1.5: 기본 로케일의 대소문자 변환 함수 사용 중단(자세한 내용은 이슈 참조), 대체 방안 제안

### 컬렉션 `min` 및 `max` 함수의 반환 타입을 점진적으로 널 불가능(non-nullable)으로 변경

> **문제**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **구성 요소**: kotlin-stdlib (JVM)
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: 컬렉션 `min` 및 `max` 함수의 반환 타입이 1.6에서 널 불가능으로 변경될 예정입니다.
>
> **사용 중단 주기**:
>
> - 1.4: `...OrNull` 함수를 동의어(synonym)로 도입하고 영향을 받는 API 사용 중단(자세한 내용은 이슈 참조)
> - 1.5.0: 영향을 받는 API의 사용 중단 수준을 오류로 격상
> - &gt;= 1.6: 영향을 받는 API를 널 불가능 반환 타입으로 다시 도입

### 부동 소수점(floating-point) 타입을 `Short` 및 `Byte`로 변환하는 것의 사용 중단 수준 격상

> **문제**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **구성 요소**: kotlin-stdlib (JVM)
>
> **호환되지 않는 변경 유형**: 소스
>
> **요약**: Kotlin 1.4에서 `WARNING` 수준으로 사용 중단되었던 부동 소수점 타입을 `Short` 및 `Byte`로 변환하는 것은 Kotlin 1.5.0부터 오류를 발생시킵니다.
>
> **사용 중단 주기**:
>
> - 1.4: `Double.toShort()/toByte()` 및 `Float.toShort()/toByte()` 사용 중단 및 대체 방안 제안
> - 1.5.0: 사용 중단 수준을 오류로 격상

## 도구

### 단일 프로젝트에서 여러 JVM `kotlin-test` 변형을 혼합하지 마십시오.

> **문제**: [KT-40225](https://youtrack.jetbrains.com/issue/KT-40225)
>
> **구성 요소**: 그레이들(Gradle)
>
> **호환되지 않는 변경 유형**: 동작
>
> **요약**: 여러 상호 배타적인 `kotlin-test` 변형은 하나가 전이적 의존성으로 인해 포함될 경우 단일 프로젝트에 존재할 수 있었습니다. 1.5.0부터 그레이들은 다른 테스트 프레임워크에 대한 상호 배타적인 `kotlin-test` 변형을 허용하지 않습니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 다른 테스트 프레임워크에 대한 여러 상호 배타적인 `kotlin-test` 변형을 허용
> - &gt;= 1.5: 동작 변경,
>  그레이들은 "Cannot select module with conflict on capability..."와 같은 예외를 발생시킵니다. 가능한 해결책:
>    *   전이적 의존성이 가져오는 것과 동일한 `kotlin-test` 변형 및 해당 테스트 프레임워크를 사용하십시오.
>    *   `kotlin-test` 변형을 전이적으로 가져오지 않는 다른 의존성 변형을 찾아, 사용하고 싶은 테스트 프레임워크를 사용할 수 있도록 하십시오.
>    *   원하는 테스트 프레임워크와 동일한 `kotlin-test` 변형을 전이적으로 가져오는 다른 의존성 변형을 찾으십시오.
>    *   전이적으로 가져와지는 테스트 프레임워크를 제외하십시오. 다음 예시는 JUnit 4를 제외하는 방법입니다:
>      ```groovy
>      configurations {
>          testImplementation.get().exclude("org.jetbrains.kotlin", "kotlin-test-junit")
>      }
>      ```
>      테스트 프레임워크를 제외한 후 애플리케이션을 테스트하십시오. 만약 작동이 중단되면, 제외 변경 사항을 롤백(rollback)하고 라이브러리가 사용하는 것과 동일한 테스트 프레임워크를 사용하며, 사용자(자신)의 테스트 프레임워크를 제외하십시오.