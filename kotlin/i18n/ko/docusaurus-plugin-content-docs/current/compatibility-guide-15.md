---
title: "Kotlin 1.5 호환성 가이드"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[Keeping the Language Modern](kotlin-evolution-principles)_ 및 _[Comfortable Updates](kotlin-evolution-principles)_는 Kotlin 언어 디자인의 기본 원칙에 속합니다. 전자는 언어 발전을 저해하는 구조는 제거해야 한다고 말하며, 후자는 이러한 제거가 코드 마이그레이션을 최대한 원활하게 하기 위해 사전에 잘 전달되어야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 Kotlin 1.4에서 Kotlin 1.5로의 마이그레이션을 위한 완전한 참조를 제공하면서 모든 내용을 요약합니다.

## 기본 용어

이 문서에서는 몇 가지 종류의 호환성을 소개합니다.

- _source_: 소스 비호환성 변경은 오류나 경고 없이 정상적으로 컴파일되던 코드가 더 이상 컴파일되지 않도록 합니다.
- _binary_: 두 개의 바이너리 아티팩트가 서로 교환되어도 로딩 또는 링크 오류가 발생하지 않으면 바이너리 호환성이 있다고 합니다.
- _behavioral_: 변경 사항이 적용되기 전과 후에 동일한 프로그램이 다른 동작을 보이는 경우 동작 비호환성 변경이라고 합니다.

이러한 정의는 순수 Kotlin에만 적용된다는 점을 기억하십시오. 다른 언어 관점에서 본 Kotlin 코드의 호환성
(예: Java)은 이 문서의 범위를 벗어납니다.

## 언어 및 stdlib

### 시그니처 다형적 호출에서 spread operator 금지

> **Issue**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5는 시그니처 다형적 호출에서 spread operator(*)의 사용을 금지합니다.
>
> **Deprecation cycle**:
>
> - < 1.5: 문제 있는 operator에 대한 경고를 호출 위치에 표시합니다.
> - &gt;= 1.5: 이 경고를 오류로 높입니다.
>  `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall`을 사용하여 임시로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 해당 클래스에서 보이지 않는 추상 멤버(internal/package-private)를 포함하는 비추상 클래스 금지

> **Issue**: [KT-27825](https://youtrack.jetbrains.com/issue/KT-27825)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5는 해당 클래스에서 보이지 않는 추상 멤버(internal/package-private)를 포함하는 비추상 클래스를 금지합니다.
>
> **Deprecation cycle**:
>
> - < 1.5: 문제 있는 클래스에 대한 경고를 표시합니다.
> - &gt;= 1.5: 이 경고를 오류로 높입니다.
>  `-XXLanguage:-ProhibitInvisibleAbstractMethodsInSuperclasses`를 사용하여 임시로 1.5 이전 동작으로 되돌릴 수 있습니다.

### JVM에서 non-reified 타입 파라미터를 기반으로 하는 배열을 reified 타입 인수로 사용하는 것을 금지

> **Issue**: [KT-31227](https://youtrack.jetbrains.com/issue/KT-31227)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5는 JVM에서 non-reified 타입 파라미터를 기반으로 하는 배열을 reified 타입 인수로 사용하는 것을 금지합니다.
>
> **Deprecation cycle**:
>
> - < 1.5: 문제 있는 호출에 대한 경고를 표시합니다.
> - &gt;= 1.5: 이 경고를 오류로 높입니다.
>  `-XXLanguage:-ProhibitNonReifiedArraysAsReifiedTypeArguments`를 사용하여 임시로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 주 생성자에 위임하지 않는 보조 enum 클래스 생성자를 금지

> **Issue**: [KT-35870](https://youtrack.jetbrains.com/issue/KT-35870)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5는 주 생성자에 위임하지 않는 보조 enum 클래스 생성자를 금지합니다.
>
> **Deprecation cycle**:
>
> - < 1.5: 문제 있는 생성자에 대한 경고를 표시합니다.
> - &gt;= 1.5: 이 경고를 오류로 높입니다.
>  `-XXLanguage:-RequiredPrimaryConstructorDelegationCallInEnums`를 사용하여 임시로 1.5 이전 동작으로 되돌릴 수 있습니다.

### private inline 함수에서 익명 타입 노출 금지

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5는 private inline 함수에서 익명 타입 노출을 금지합니다.
>
> **Deprecation cycle**:
>
> - < 1.5: 문제 있는 생성자에 대한 경고를 표시합니다.
> - &gt;= 1.5: 이 경고를 오류로 높입니다.
>  `-XXLanguage:-ApproximateAnonymousReturnTypesInPrivateInlineFunctions`를 사용하여 임시로 1.5 이전 동작으로 되돌릴 수 있습니다.

### SAM-conversion을 사용하는 인수 뒤에 non-spread 배열을 전달하는 것을 금지

> **Issue**: [KT-35224](https://youtrack.jetbrains.com/issue/KT-35224)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5는 SAM-conversion을 사용하는 인수 뒤에 non-spread 배열을 전달하는 것을 금지합니다.
>
> **Deprecation cycle**:
>
> - 1.3.70: 문제 있는 호출에 대한 경고를 표시합니다.
> - &gt;= 1.5: 이 경고를 오류로 높입니다.
>  `-XXLanguage:-ProhibitVarargAsArrayAfterSamArgument`를 사용하여 임시로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 밑줄 이름이 지정된 catch 블록 파라미터에 대한 특수 의미 지원

> **Issue**: [KT-31567](https://youtrack.jetbrains.com/issue/KT-31567)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5는 catch 블록에서 예외 파라미터 이름을 생략하는 데 사용되는 밑줄 기호(`_`)에 대한 참조를 금지합니다.
>
> **Deprecation cycle**:
>
> - 1.4.20: 문제 있는 참조에 대한 경고를 표시합니다.
> - &gt;= 1.5: 이 경고를 오류로 높입니다.
>  `-XXLanguage:-ForbidReferencingToUnderscoreNamedParameterOfCatchBlock`을 사용하여 임시로 1.5 이전 동작으로 되돌릴 수 있습니다.

### SAM conversion 구현 전략을 익명 클래스 기반에서 invokedynamic으로 변경

> **Issue**: [KT-44912](https://youtrack.jetbrains.com/issue/KT-44912)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5부터 SAM(single abstract method) conversion의 구현 전략이 익명 클래스 생성이 아닌 `invokedynamic` JVM 명령어를 사용하는 것으로 변경됩니다.
>
> **Deprecation cycle**:
>
> - 1.5: SAM conversion의 구현 전략을 변경합니다.
>  `-Xsam-conversions=class`를 사용하여 구현 방식을 이전 방식으로 되돌릴 수 있습니다.

### JVM IR 기반 백엔드의 성능 문제

> **Issue**: [KT-48233](https://youtrack.jetbrains.com/issue/KT-48233)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5는 Kotlin/JVM 컴파일러에 대해 [IR 기반 백엔드](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)를 기본적으로 사용합니다. 이전 백엔드는 이전 언어 버전에 대해 여전히 기본적으로 사용됩니다.
>
> Kotlin 1.5에서 새 컴파일러를 사용할 때 일부 성능 저하 문제가 발생할 수 있습니다. 이러한 문제를 해결하기 위해 노력하고 있습니다.
>
> **Deprecation cycle**:
>
> - < 1.5: 기본적으로 이전 JVM 백엔드가 사용됩니다.
> - &gt;= 1.5: 기본적으로 IR 기반 백엔드가 사용됩니다. Kotlin 1.5에서 이전 백엔드를 사용해야 하는 경우 프로젝트 구성 파일에 다음 줄을 추가하여 임시로 1.5 이전 동작으로 되돌립니다.
>
> Gradle에서:
>
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
>
> Maven에서:
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> 이 플래그에 대한 지원은 향후 릴리스 중 하나에서 제거될 예정입니다.

### JVM IR 기반 백엔드의 새로운 필드 정렬

> **Issue**: [KT-46378](https://youtrack.jetbrains.com/issue/KT-46378)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 버전 1.5부터 Kotlin은 JVM 바이트코드를 다르게 정렬하는 [IR 기반 백엔드](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)를 사용합니다. 즉, 본문에 선언된 필드보다 생성자에 선언된 필드를 먼저 생성하는 반면, 이전 백엔드의 경우는 그 반대입니다. 새로운 정렬은 Java serialization과 같이 필드 순서에 의존하는 serialization 프레임워크를 사용하는 프로그램의 동작을 변경할 수 있습니다.
>
> **Deprecation cycle**:
>
> - < 1.5: 기본적으로 이전 JVM 백엔드가 사용됩니다. 생성자에 선언된 필드보다 본문에 선언된 필드가 먼저 있습니다.
> - &gt;= 1.5: 기본적으로 새로운 IR 기반 백엔드가 사용됩니다. 생성자에 선언된 필드가 본문에 선언된 필드보다 먼저 생성됩니다. 해결 방법으로 Kotlin 1.5에서 임시로 이전 백엔드로 전환할 수 있습니다. 이렇게 하려면 프로젝트 구성 파일에 다음 줄을 추가합니다.
>
> Gradle에서:
>
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
>
> Maven에서:
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> 이 플래그에 대한 지원은 향후 릴리스 중 하나에서 제거될 예정입니다.

### 델리게이트 표현식에 제네릭 호출이 있는 델리게이트 속성에 대한 nullability assertion 생성

> **Issue**: [KT-44304](https://youtrack.jetbrains.com/issue/KT-44304)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5부터 Kotlin 컴파일러는 델리게이트 표현식에 제네릭 호출이 있는 델리게이트 속성에 대해 nullability assertion을 내보냅니다.
>
> **Deprecation cycle**:
>
> - 1.5: 델리게이트 속성에 대한 nullability assertion을 내보냅니다(문제에서 자세한 내용 참조).
>  `-Xuse-old-backend` 또는 `-language-version 1.4`를 사용하여 임시로 1.5 이전 동작으로 되돌릴 수 있습니다.

### @OnlyInputTypes로 어노테이션된 타입 파라미터가 있는 호출에 대한 경고를 오류로 전환

> **Issue**: [KT-45861](https://youtrack.jetbrains.com/issue/KT-45861)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5는 타입 안전성을 향상시키기 위해 `contains`, `indexOf` 및 `assertEquals`와 같은 호출을 의미 없는 인수로 사용하는 것을 금지합니다.
>
> **Deprecation cycle**:
>
> - 1.4.0: 문제 있는 생성자에 대한 경고를 표시합니다.
> - &gt;= 1.5: 이 경고를 오류로 높입니다.
>  `-XXLanguage:-StrictOnlyInputTypesChecks`를 사용하여 임시로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 이름 지정된 vararg를 사용하는 호출에서 인수 실행의 올바른 순서 사용

> **Issue**: [KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5는 이름 지정된 vararg를 사용하는 호출에서 인수 실행 순서를 변경합니다.
>
> **Deprecation cycle**:
>
> - < 1.5: 문제 있는 생성자에 대한 경고를 표시합니다.
> - &gt;= 1.5: 이 경고를 오류로 높입니다.
>  `-XXLanguage:-UseCorrectExecutionOrderForVarargArguments`를 사용하여 임시로 1.5 이전 동작으로 되돌릴 수 있습니다.

### operator 함수 호출에서 파라미터의 기본값 사용

> **Issue**: [KT-42064](https://youtrack.jetbrains.com/issue/KT-42064)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5는 operator 호출에서 파라미터의 기본값을 사용합니다.
>
> **Deprecation cycle**:
>
> - < 1.5: 이전 동작(문제에서 자세한 내용 참조)
> - &gt;= 1.5: 동작 변경됨
>  `-XXLanguage:-JvmIrEnabledByDefault`를 사용하여 임시로 1.5 이전 동작으로 되돌릴 수 있습니다.

### 일반 progression이 비어 있는 경우 for 루프에서 빈 reversed progression 생성

> **Issue**: [KT-42533](https://youtrack.jetbrains.com/issue/KT-42533)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5는 일반 progression이 비어 있는 경우 for 루프에서 빈 reversed progression을 생성합니다.
>
> **Deprecation cycle**:
>
> - < 1.5: 이전 동작(문제에서 자세한 내용 참조)
> - &gt;= 1.5: 동작 변경됨
>  `-XXLanguage:-JvmIrEnabledByDefault`를 사용하여 임시로 1.5 이전 동작으로 되돌릴 수 있습니다.

### Char-to-code 및 Char-to-digit 변환 정리

> **Issue**: [KT-23451](https://youtrack.jetbrains.com/issue/KT-23451)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5부터 Char를 숫자 타입으로 변환하는 기능이 더 이상 사용되지 않습니다.
>
> **Deprecation cycle**:
>
> - 1.5: `Char.toInt()/toShort()/toLong()/toByte()/toDouble()/toFloat()` 및 `Long.toChar()`와 같은 역함수를 더 이상 사용하지 않으며 대체 함수를 제안합니다.

### kotlin.text 함수에서 대소문자를 구분하지 않는 문자 비교의 일관성 없는 문제

> **Issue**: [KT-45496](https://youtrack.jetbrains.com/issue/KT-45496)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5부터 `Char.equals`는 대소문자를 구분하지 않는 경우 문자의 대문자 변형이 같은지 먼저 비교한 다음 해당 대문자 변형의 소문자 변형(문자 자체와 반대)이 같은지 비교하여 개선됩니다.
>
> **Deprecation cycle**:
>
> - < 1.5: 이전 동작(문제에서 자세한 내용 참조)
> - 1.5: `Char.equals` 함수의 동작 변경

### 기본 로캘 종속적 대소문자 변환 API 제거

> **Issue**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5부터 `String.toUpperCase()`와 같은 기본 로캘 종속적 대소문자 변환 함수가 더 이상 사용되지 않습니다.
>
> **Deprecation cycle**:
>
> - 1.5: 기본 로캘을 사용하는 대소문자 변환 함수를 더 이상 사용하지 않으며(문제에서 자세한 내용 참조) 대체 함수를 제안합니다.

### 컬렉션 min 및 max 함수의 반환 타입을 non-nullable로 점진적으로 변경

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: source
>
> **Short summary**: 컬렉션 `min` 및 `max` 함수의 반환 타입이 1.6에서 non-nullable로 변경됩니다.
>
> **Deprecation cycle**:
>
> - 1.4: `...OrNull` 함수를 동의어로 도입하고 영향을 받는 API를 더 이상 사용하지 않습니다(문제에서 자세한 내용 참조).
> - 1.5.0: 영향을 받는 API의 더 이상 사용 수준을 오류로 높입니다.
> - &gt;=1.6: 영향을 받는 API를 non-nullable 반환 타입으로 다시 도입합니다.

### 부동 소수점 타입에서 Short 및 Byte로의 변환에 대한 더 이상 사용 수준을 높입니다.

> **Issue**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.4에서 `WARNING` 수준으로 더 이상 사용되지 않는 부동 소수점 타입에서 `Short` 및 `Byte`로의 변환은 Kotlin 1.5.0부터 오류를 발생시킵니다.
>
> **Deprecation cycle**:
>
> - 1.4: `Double.toShort()/toByte()` 및 `Float.toShort()/toByte()`를 더 이상 사용하지 않고 대체 함수를 제안합니다.
> - 1.5.0: 더 이상 사용 수준을 오류로 높입니다.

## Tools

### 단일 프로젝트에서 여러 JVM 변형의 kotlin-test를 혼합하지 마십시오.

> **Issue**: [KT-40225](https://youtrack.jetbrains.com/issue/KT-40225)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 서로 배타적인 여러 `kotlin-test` 변형이 전이적 종속성에 의해 프로젝트에 포함될 수 있습니다. 1.5.0부터 Gradle은 서로 배타적인 여러 `kotlin-test` 변형을 다른 테스팅 프레임워크에 대해 허용하지 않습니다.
>
> **Deprecation cycle**:
>
> - < 1.5: 서로 배타적인 여러 `kotlin-test` 변형을 다른 테스팅 프레임워크에 대해 허용합니다.
> - &gt;= 1.5: 동작이 변경되었습니다.
> Gradle은 "Cannot select module with conflict on capability..."와 같은 예외를 throw합니다. 가능한 해결 방법:
>    * 전이적 종속성이 제공하는 것과 동일한 `kotlin-test` 변형과 해당 테스팅 프레임워크를 사용합니다.
>    * 종속성의 다른 변형을 찾아 `kotlin-test` 변형을 전이적으로 제공하지 않으므로 사용하려는 테스팅 프레임워크를 사용할 수 있습니다.
>    * 사용하려는 것과 동일한 테스팅 프레임워크를 사용하는 다른 `kotlin-test` 변형을 전이적으로 제공하는 종속성의 다른 변형을 찾습니다.
>    * 전이적으로 제공되는 테스팅 프레임워크를 제외합니다. 다음 예제는 JUnit 4를 제외하는 방법입니다.
>      ```groovy
>      configurations { 
>          testImplementation.get().exclude("org.jetbrains.kotlin", "kotlin-test-junit")
>      }
>      ```
>      테스팅 프레임워크를 제외한 후 애플리케이션을 테스트합니다. 작동이 중단되면 제외 변경 사항을 롤백하고 라이브러리와 동일한 테스팅 프레임워크를 사용하고 테스팅 프레임워크를 제외합니다.