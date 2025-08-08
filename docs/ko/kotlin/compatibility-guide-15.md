[//]: # (title: Kotlin 1.5 호환성 가이드)

_[언어 현대성 유지](kotlin-evolution-principles.md)_ 및 _[편리한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 기본 원칙 중 일부입니다. 전자는 언어 발전을 방해하는 구조는 제거해야 한다고 말하며, 후자는 코드 마이그레이션을 가능한 한 원활하게 하기 위해 이러한 제거는 사전에 잘 전달되어야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 모든 변경 사항을 요약하여 Kotlin 1.4에서 Kotlin 1.5로 마이그레이션하기 위한 완전한 참조 자료를 제공합니다.

## 기본 용어

이 문서에서는 몇 가지 종류의 호환성을 소개합니다:

- _소스_: 소스 비호환 변경은 (오류나 경고 없이) 잘 컴파일되던 코드가 더 이상 컴파일되지 않게 합니다.
- _바이너리_: 두 바이너리 아티팩트는 서로 교체해도 로딩 또는 링크 오류가 발생하지 않으면 바이너리 호환된다고 합니다.
- _동작_: 동일한 프로그램이 변경 적용 전후에 다른 동작을 보이면 동작 비호환이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 주어진다는 점을 기억하십시오. 다른 언어 관점(예: Java)에서 본 Kotlin 코드의 호환성은 이 문서의 범위를 벗어납니다.

## 언어 및 표준 라이브러리

### 스프레드 연산자를 시그니처 다형성 호출에 사용하는 것을 금지

> **이슈**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **간략 요약**: Kotlin 1.5부터 시그니처 다형성 호출에 스프레드 연산자(`*`)를 사용하는 것이 금지됩니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 호출 지점에서 문제가 되는 연산자에 대한 경고 도입
> - `>= 1.5`: 이 경고를 오류로 격상
>   `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall`을 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 비추상 클래스가 해당 클래스에서 보이지 않는 추상 멤버(내부/패키지 비공개)를 포함하는 것을 금지

> **이슈**: [KT-27825](https://youtrack.jetbrains.com/issue/KT-27825)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **간략 요약**: Kotlin 1.5부터 비추상 클래스가 해당 클래스에서 보이지 않는 (내부/패키지 비공개) 추상 멤버를 포함하는 것이 금지됩니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 문제가 되는 클래스에 대한 경고 도입
> - `>= 1.5`: 이 경고를 오류로 격상
>   `-XXLanguage:-ProhibitInvisibleAbstractMethodsInSuperclasses`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### JVM에서 실체화되지 않은 타입 파라미터 기반 배열을 실체화된 타입 인수로 사용하는 것을 금지

> **이슈**: [KT-31227](https://youtrack.jetbrains.com/issue/KT-31227)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **간략 요약**: Kotlin 1.5부터 JVM에서 실체화되지 않은 타입 파라미터를 기반으로 한 배열을 실체화된 타입 인수로 사용하는 것이 금지됩니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 문제가 되는 호출에 대한 경고 도입
> - `>= 1.5`: 이 경고를 오류로 격상
>   `-XXLanguage:-ProhibitNonReifiedArraysAsReifiedTypeArguments`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 주 생성자에 위임하지 않는 보조 enum 클래스 생성자를 금지

> **이슈**: [KT-35870](https://youtrack.jetbrains.com/issue/KT-35870)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **간략 요약**: Kotlin 1.5부터 주 생성자에 위임하지 않는 보조 enum 클래스 생성자를 금지합니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 문제가 되는 생성자에 대한 경고 도입
> - `>= 1.5`: 이 경고를 오류로 격상
>   `-XXLanguage:-RequiredPrimaryConstructorDelegationCallInEnums`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 비공개 인라인 함수에서 익명 타입을 노출하는 것을 금지

> **이슈**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **간략 요약**: Kotlin 1.5부터 비공개 인라인 함수에서 익명 타입을 노출하는 것이 금지됩니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 문제가 되는 생성자에 대한 경고 도입
> - `>= 1.5`: 이 경고를 오류로 격상
>   `-XXLanguage:-ApproximateAnonymousReturnTypesInPrivateInlineFunctions`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### SAM 변환을 사용하는 인수 뒤에 스프레드되지 않은 배열을 전달하는 것을 금지

> **이슈**: [KT-35224](https://youtrack.jetbrains.com/issue/KT-35224)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **간략 요약**: Kotlin 1.5부터 SAM 변환을 사용하는 인수 뒤에 스프레드되지 않은 배열을 전달하는 것을 금지합니다.
>
> **사용 중단 주기**:
>
> - 1.3.70: 문제가 되는 호출에 대한 경고 도입
> - `>= 1.5`: 이 경고를 오류로 격상
>   `-XXLanguage:-ProhibitVarargAsArrayAfterSamArgument`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 밑줄 이름의 catch 블록 파라미터에 대한 특수 시맨틱 지원

> **이슈**: [KT-31567](https://youtrack.jetbrains.com/issue/KT-31567)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **간략 요약**: Kotlin 1.5부터 catch 블록에서 예외의 파라미터 이름을 생략하는 데 사용되는 밑줄 기호(`_`)에 대한 참조를 금지합니다.
>
> **사용 중단 주기**:
>
> - 1.4.20: 문제가 되는 참조에 대한 경고 도입
> - `>= 1.5`: 이 경고를 오류로 격상
>   `-XXLanguage:-ForbidReferencingToUnderscoreNamedParameterOfCatchBlock`을 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### SAM 변환의 구현 전략을 익명 클래스 기반에서 invokedynamic으로 변경

> **이슈**: [KT-44912](https://youtrack.jetbrains.com/issue/KT-44912)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환성 변경 유형**: 동작
>
> **간략 요약**: Kotlin 1.5부터 SAM(단일 추상 메서드) 변환의 구현 전략이 익명 클래스 생성 방식에서 `invokedynamic` JVM 명령어를 사용하는 방식으로 변경됩니다.
>
> **사용 중단 주기**:
>
> - 1.5: SAM 변환의 구현 전략 변경
>   `-Xsam-conversions=class`를 사용하여 구현 방식을 이전 방식으로 되돌릴 수 있습니다.

### JVM IR 기반 백엔드의 성능 문제

> **이슈**: [KT-48233](https://youtrack.jetbrains.com/issue/KT-48233)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환성 변경 유형**: 동작
>
> **간략 요약**: Kotlin 1.5는 Kotlin/JVM 컴파일러에 기본적으로 [IR 기반 백엔드](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)를 사용합니다. 이전 버전의 언어에는 여전히 이전 백엔드가 기본적으로 사용됩니다.
>
> Kotlin 1.5에서 새 컴파일러를 사용하면 일부 성능 저하 문제가 발생할 수 있습니다. 이러한 문제는 현재 수정 중입니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 기본적으로 이전 JVM 백엔드 사용
> - `>= 1.5`: 기본적으로 IR 기반 백엔드 사용. Kotlin 1.5에서 이전 백엔드를 사용해야 하는 경우, 일시적으로 1.5 이전 동작으로 되돌리려면 다음 줄을 프로젝트 구성 파일에 추가하십시오.
>
> Gradle:
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
> Maven:
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> 이 플래그에 대한 지원은 향후 릴리스에서 제거될 예정입니다.

### JVM IR 기반 백엔드의 새 필드 정렬

> **이슈**: [KT-46378](https://youtrack.jetbrains.com/issue/KT-46378)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환성 변경 유형**: 동작
>
> **간략 요약**: 버전 1.5부터 Kotlin은 JVM 바이트코드를 다르게 정렬하는 [IR 기반 백엔드](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)를 사용합니다. 즉, 생성자에 선언된 필드를 본문에 선언된 필드보다 먼저 생성하며, 이전 백엔드에서는 그 반대였습니다. 이 새로운 정렬 방식은 Java 직렬화와 같이 필드 순서에 의존하는 직렬화 프레임워크를 사용하는 프로그램의 동작을 변경할 수 있습니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 기본적으로 이전 JVM 백엔드 사용. 생성자에 선언된 필드보다 본문에 선언된 필드를 먼저 가집니다.
> - `>= 1.5`: 기본적으로 새 IR 기반 백엔드 사용. 생성자에 선언된 필드가 본문에 선언된 필드보다 먼저 생성됩니다. 임시 해결책으로, Kotlin 1.5에서 이전 백엔드로 전환할 수 있습니다. 이를 위해 다음 줄을 프로젝트 구성 파일에 추가하십시오.
>
> Gradle:
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
> Maven:
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> 이 플래그에 대한 지원은 향후 릴리스에서 제거될 예정입니다.

### 위임 표현식에 제네릭 호출이 있는 위임된 프로퍼티에 대한 널 가능성 단언 생성

> **이슈**: [KT-44304](https://youtrack.jetbrains.com/issue/KT-44304)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환성 변경 유형**: 동작
>
> **간략 요약**: Kotlin 1.5부터 Kotlin 컴파일러는 위임 표현식에 제네릭 호출이 있는 위임된 프로퍼티에 대해 널 가능성 단언을 발생시킵니다.
>
> **사용 중단 주기**:
>
> - 1.5: 위임된 프로퍼티에 대한 널 가능성 단언을 발생시킵니다(자세한 내용은 이슈 참고).
>   `-Xuse-old-backend` 또는 `-language-version 1.4`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### @OnlyInputTypes로 주석 처리된 타입 파라미터가 있는 호출의 경고를 오류로 전환

> **이슈**: [KT-45861](https://youtrack.jetbrains.com/issue/KT-45861)
>
> **컴포넌트**: 코어 언어
>
> **호환성 변경 유형**: 소스
>
> **간략 요약**: Kotlin 1.5부터는 타입 안전성을 개선하기 위해 `contains`, `indexOf`, `assertEquals`와 같은 호출에서 무의미한 인수를 사용하는 것을 금지합니다.
>
> **사용 중단 주기**:
>
> - 1.4.0: 문제가 되는 생성자에 대한 경고 도입
> - `>= 1.5`: 이 경고를 오류로 격상
>   `-XXLanguage:-StrictOnlyInputTypesChecks`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 이름 붙은 vararg가 있는 호출에서 인수의 올바른 실행 순서 사용

> **이슈**: [KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환성 변경 유형**: 동작
>
> **간략 요약**: Kotlin 1.5부터 이름 붙은 vararg가 있는 호출에서 인수 실행 순서가 변경됩니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 문제가 되는 생성자에 대한 경고 도입
> - `>= 1.5`: 이 경고를 오류로 격상
>   `-XXLanguage:-UseCorrectExecutionOrderForVarargArguments`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 연산자 함수 호출에서 파라미터의 기본값 사용

> **이슈**: [KT-42064](https://youtrack.jetbrains.com/issue/KT-42064)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환성 변경 유형**: 동작
>
> **간략 요약**: Kotlin 1.5부터 연산자 호출에서 파라미터의 기본값이 사용됩니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 이전 동작(자세한 내용은 이슈 참고)
> - `>= 1.5`: 동작 변경됨
>   `-XXLanguage:-JvmIrEnabledByDefault`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 정상 프로그레션이 비어 있는 경우 for 루프에서 빈 역방향 프로그레션 생성

> **이슈**: [KT-42533](https://youtrack.jetbrains.com/issue/KT-42533)
>
> **컴포넌트**: Kotlin/JVM
>
> **호환성 변경 유형**: 동작
>
> **간략 요약**: Kotlin 1.5부터 정상 프로그레션이 비어 있는 경우 for 루프에서 빈 역방향 프로그레션을 생성합니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 이전 동작(자세한 내용은 이슈 참고)
> - `>= 1.5`: 동작 변경됨
>   `-XXLanguage:-JvmIrEnabledByDefault`를 사용하여 일시적으로 1.5 이전 동작으로 되돌릴 수 있습니다.

### Char-코드 변환 및 Char-숫자 변환 정리

> **이슈**: [KT-23451](https://youtrack.jetbrains.com/issue/KT-23451)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환성 변경 유형**: 소스
>
> **간략 요약**: Kotlin 1.5부터 `Char`를 숫자 타입으로 변환하는 기능이 사용 중단됩니다.
>
> **사용 중단 주기**:
>
> - 1.5: `Char.toInt()/toShort()/toLong()/toByte()/toDouble()/toFloat()` 및 `Long.toChar()`와 같은 역방향 함수를 사용 중단하고 대체 함수를 제안합니다.

### kotlin.text 함수에서 대소문자 구분 없는 문자 비교의 비일관성

> **이슈**: [KT-45496](https://youtrack.jetbrains.com/issue/KT-45496)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환성 변경 유형**: 동작
>
> **간략 요약**: Kotlin 1.5부터 `Char.equals`는 대소문자를 구분하지 않는 비교에서 개선됩니다. 이는 먼저 문자의 대문자 변형이 같은지 비교한 다음, 해당 대문자 변형의 소문자 변형(문자 자체와 반대되는)이 같은지 비교하는 방식입니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 이전 동작(자세한 내용은 이슈 참고)
> - 1.5: `Char.equals` 함수의 동작 변경

### 기본 로케일 민감 대소문자 변환 API 제거

> **이슈**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **컴포넌트**: kotlin-stdlib
>
> **호환성 변경 유형**: 소스
>
> **간략 요약**: Kotlin 1.5부터 `String.toUpperCase()`와 같은 기본 로케일 민감 대소문자 변환 함수가 사용 중단됩니다.
>
> **사용 중단 주기**:
>
> - 1.5: 기본 로케일을 사용하는 대소문자 변환 함수를 사용 중단하고(자세한 내용은 이슈 참고) 대체 함수를 제안합니다.

### 컬렉션 min 및 max 함수의 반환 타입을 점진적으로 널 불가능으로 변경

> **이슈**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **컴포넌트**: kotlin-stdlib (JVM)
>
> **호환성 변경 유형**: 소스
>
> **간략 요약**: 컬렉션 `min` 및 `max` 함수의 반환 타입은 1.6에서 널 불가능으로 변경될 예정입니다.
>
> **사용 중단 주기**:
>
> - 1.4: `...OrNull` 함수를 동의어로 도입하고 영향을 받는 API를 사용 중단합니다(자세한 내용은 이슈 참고).
> - 1.5.0: 영향을 받는 API의 사용 중단 수준을 오류로 격상
> - `>= 1.6`: 영향을 받는 API를 널 불가능 반환 타입으로 재도입

### 부동 소수점 타입을 Short 및 Byte로 변환하는 것의 사용 중단 수준 격상

> **이슈**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **컴포넌트**: kotlin-stdlib (JVM)
>
> **호환성 변경 유형**: 소스
>
> **간략 요약**: Kotlin 1.4에서 `WARNING` 수준으로 사용 중단되었던 부동 소수점 타입을 `Short` 및 `Byte`로 변환하는 기능은 Kotlin 1.5.0부터 오류를 발생시킬 것입니다.
>
> **사용 중단 주기**:
>
> - 1.4: `Double.toShort()/toByte()` 및 `Float.toShort()/toByte()`를 사용 중단하고 대체 함수를 제안합니다.
> - 1.5.0: 사용 중단 수준을 오류로 격상

## 도구

### 단일 프로젝트에서 여러 JVM 버전의 kotlin-test를 혼합하지 않기

> **이슈**: [KT-40225](https://youtrack.jetbrains.com/issue/KT-40225)
>
> **컴포넌트**: Gradle
>
> **호환성 변경 유형**: 동작
>
> **간략 요약**: 서로 다른 테스트 프레임워크를 위한 여러 상호 배타적인 `kotlin-test` 변형이 전이적 의존성으로 인해 프로젝트에 존재할 수 있었습니다. 1.5.0부터 Gradle은 서로 다른 테스트 프레임워크를 위한 상호 배타적인 `kotlin-test` 변형을 허용하지 않을 것입니다.
>
> **사용 중단 주기**:
>
> - < 1.5: 서로 다른 테스트 프레임워크를 위한 여러 상호 배타적인 `kotlin-test` 변형을 허용합니다.
> - `>= 1.5`: 동작 변경됨.
>   Gradle은 "Cannot select module with conflict on capability..."와 같은 예외를 발생시킵니다. 가능한 해결책:
>    * 전이적 의존성이 가져오는 `kotlin-test` 변형 및 해당 테스트 프레임워크를 사용합니다.
>    * `kotlin-test` 변형을 전이적으로 가져오지 않는 다른 의존성 변형을 찾아, 사용하려는 테스트 프레임워크를 사용할 수 있도록 합니다.
>    * 사용하려는 테스트 프레임워크와 동일한 테스트 프레임워크를 사용하는 `kotlin-test` 변형을 전이적으로 가져오는 다른 의존성 변형을 찾습니다.
>    * 전이적으로 가져오는 테스트 프레임워크를 제외합니다. 다음 예시는 JUnit 4를 제외하는 방법입니다.
>      ```groovy
>      configurations {
>          testImplementation.get().exclude("org.jetbrains.kotlin", "kotlin-test-junit")
>      }
>      ```
>      테스트 프레임워크를 제외한 후 애플리케이션을 테스트하십시오. 작동하지 않는다면 제외 변경 사항을 롤백하고, 라이브러리와 동일한 테스트 프레임워크를 사용하며, 사용하던 테스트 프레임워크를 제외하십시오.