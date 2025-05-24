---
title: "Kotlin 1.6 호환성 가이드"
---
_[언어의 현대성 유지](kotlin-evolution-principles)_ 및 _[편리한 업데이트](kotlin-evolution-principles)_는 Kotlin 언어 설계의 기본 원칙에 속합니다. 전자는 언어 발전을 방해하는 구조는 제거해야 한다고 말하며, 후자는 코드 마이그레이션을 최대한 원활하게 할 수 있도록 이러한 제거 사항을 미리 충분히 알려야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 이 모든 내용을 요약하여 Kotlin 1.5에서 Kotlin 1.6으로의 마이그레이션에 대한 완전한 참조를 제공합니다.

## 기본 용어

이 문서에서는 여러 종류의 호환성을 소개합니다.

- _source_: source-incompatible 변경은 오류나 경고 없이 정상적으로 컴파일되던 코드가 더 이상 컴파일되지 않도록 합니다.
- _binary_: 두 개의 바이너리 아티팩트를 서로 교환해도 로딩 또는 링키지 오류가 발생하지 않으면 바이너리 호환성이 있다고 합니다.
- _behavioral_: 변경 사항을 적용하기 전과 후에 동일한 프로그램이 다른 동작을 보이면 behavioral-incompatible하다고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 제공된다는 점을 기억하십시오. 다른 언어 관점에서 본 Kotlin 코드의 호환성
(예: Java)은 이 문서의 범위를 벗어납니다.

## 언어

### enum, sealed 및 Boolean 피연산자를 사용하는 when 문을 기본적으로 완전하게 만들기

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6은 enum, sealed 또는 Boolean 피연산자를 사용하는 `when` 문이 완전하지 않은 경우 경고합니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: enum, sealed 또는 Boolean 피연산자를 사용하는 `when` 문이 완전하지 않은 경우 경고를 표시합니다 (프로그레시브 모드에서는 오류).
> - 1.7.0: 이 경고를 오류로 올립니다.

### when-with-subject에서 혼란스러운 문법을 사용 중단

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6은 `when` 조건 표현식에서 몇 가지 혼란스러운 문법 구조를 사용 중단합니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 영향을 받는 표현식에 대해 사용 중단 경고를 표시합니다.
> - 1.8.0: 이 경고를 오류로 올립니다.
> - &gt;= 1.8: 일부 사용 중단된 구조를 새로운 언어 기능에 맞게 변경합니다.

### 컴패니언 및 중첩된 객체의 슈퍼 생성자 호출에서 클래스 멤버에 대한 액세스 금지

> **Issue**: [KT-25289](https://youtrack.jetbrains.com/issue/KT-25289)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6은 컴패니언 및 일반 객체의 슈퍼 생성자 호출에 대한 인수가 해당 인수의 수신자가 포함된 선언을 참조하는 경우 오류를 보고합니다.
>
> **Deprecation cycle**:
>
> - 1.5.20: 문제가 있는 인수에 대해 경고를 표시합니다.
> - 1.6.0: 이 경고를 오류로 올립니다.
>  `-XXLanguage:-ProhibitSelfCallsInNestedObjects`를 사용하여 임시로 1.6 이전 동작으로 되돌릴 수 있습니다.

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
> - 1.4.30: 더 정확한 유형 nullability가 오류로 이어질 수 있는 경우에 대해 경고를 표시합니다.
> - 1.7.0: Java 유형의 더 정확한 nullability를 유추합니다.
>   `-XXLanguage:-TypeEnhancementImprovementsInStrictMode`를 사용하여 임시로 1.7 이전 동작으로 되돌릴 수 있습니다.

### 서로 다른 숫자 유형 간의 암시적 강제 변환 방지

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin은 의미상 해당 유형으로의 다운캐스트만 필요한 경우 숫자 값을 자동으로 기본 숫자 유형으로 변환하는 것을 방지합니다.
>
> **Deprecation cycle**:
>
> - < 1.5.30: 영향을 받는 모든 경우에서 이전 동작
> - 1.5.30: 생성된 속성 대리자 접근자에서 다운캐스트 동작을 수정합니다.
>   `-Xuse-old-backend`를 사용하여 임시로 1.5.30 이전 수정 동작으로 되돌릴 수 있습니다.
> - &gt;= 1.6.20: 다른 영향을 받는 경우에서 다운캐스트 동작을 수정합니다.

### 컨테이너 주석이 JLS를 위반하는 반복 가능한 주석 클래스의 선언 금지

> **Issue**: [KT-47928](https://youtrack.jetbrains.com/issue/KT-47928)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6은 반복 가능한 주석의 컨테이너 주석이 [JLS 9.6.3](https://docs.oracle.com/javase/specs/jls/se16/html/jls-9.html#jls-9.6.3)과 동일한 요구 사항 (배열 유형 값 메서드, 보존 및 대상)을 충족하는지 확인합니다.
>
> **Deprecation cycle**:
>
> - 1.5.30: JLS 요구 사항을 위반하는 반복 가능한 컨테이너 주석 선언에 대해 경고를 표시합니다 (프로그레시브 모드에서는 오류).
> - 1.6.0: 이 경고를 오류로 올립니다.
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints`를 사용하여 임시로 오류 보고를 비활성화할 수 있습니다.

### 반복 가능한 주석 클래스에서 Container라는 이름의 중첩 클래스 선언 금지

> **Issue**: [KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6은 Kotlin에서 선언된 반복 가능한 주석에 미리 정의된 이름 `Container`가 있는 중첩 클래스가 없는지 확인합니다.
>
> **Deprecation cycle**:
>
> - 1.5.30: Kotlin-반복 가능한 주석 클래스에서 이름이 `Container`인 중첩 클래스에 대해 경고를 표시합니다 (프로그레시브 모드에서는 오류).
> - 1.6.0: 이 경고를 오류로 올립니다.
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints`를 사용하여 임시로 오류 보고를 비활성화할 수 있습니다.

### 인터페이스 속성을 재정의하는 기본 생성자의 속성에 @JvmField 금지

> **Issue**: [KT-32753](https://youtrack.jetbrains.com/issue/KT-32753)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6은 인터페이스 속성을 `@JvmField` 주석으로 재정의하는 기본 생성자에서 선언된 속성에 주석을 추가하는 것을 금지합니다.
>
> **Deprecation cycle**:
>
> - 1.5.20: 기본 생성자에서 이러한 속성에 대한 `@JvmField` 주석에 대해 경고를 표시합니다.
> - 1.6.0: 이 경고를 오류로 올립니다.
>   `-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor`를 사용하여 임시로 오류 보고를 비활성화할 수 있습니다.

### 컴파일러 옵션 -Xjvm-default의 활성화 및 호환성 모드 사용 중단

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
> - 1.6.20: `-Xjvm-default` 컴파일러 옵션의 `enable` 및 `compatibility` 모드에 대해 경고를 표시합니다.
> - &gt;= 1.8.0: 이 경고를 오류로 올립니다.

### 공개 ABI 인라인 함수에서 슈퍼 호출 금지

> **Issue**: [KT-45379](https://youtrack.jetbrains.com/issue/KT-45379)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6은 공개 또는 보호된 인라인 함수 및 속성에서 `super` 한정자를 사용하여 함수를 호출하는 것을 금지합니다.
>
> **Deprecation cycle**:
>
> - 1.5.0: 공개 또는 보호된 인라인 함수 또는 속성 접근자에서 슈퍼 호출에 대해 경고를 표시합니다.
> - 1.6.0: 이 경고를 오류로 올립니다.
>   `-XXLanguage:-ProhibitSuperCallsFromPublicInline`을 사용하여 임시로 오류 보고를 비활성화할 수 있습니다.

### 공개 인라인 함수에서 보호된 생성자 호출 금지

> **Issue**: [KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6은 공개 또는 보호된 인라인 함수 및 속성에서 보호된 생성자를 호출하는 것을 금지합니다.
>
> **Deprecation cycle**:
>
> - 1.4.30: 공개 또는 보호된 인라인 함수 또는 속성 접근자에서 보호된 생성자 호출에 대해 경고를 표시합니다.
> - 1.6.0: 이 경고를 오류로 올립니다.
>   `-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline`을 사용하여 임시로 오류 보고를 비활성화할 수 있습니다.

### 파일 내부 유형에서 개인 중첩 유형 노출 금지

> **Issue**: [KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6은 파일 내부 유형에서 개인 중첩 유형 및 내부 클래스를 노출하는 것을 금지합니다.
>
> **Deprecation cycle**:
>
> - 1.5.0: 파일 내부 유형에서 노출된 개인 유형에 대해 경고를 표시합니다.
> - 1.6.0: 이 경고를 오류로 올립니다.
>   `-XXLanguage:-PrivateInFileEffectiveVisibility`를 사용하여 임시로 오류 보고를 비활성화할 수 있습니다.

### 유형에 대한 주석의 경우 여러 경우에서 주석 대상이 분석되지 않음

> **Issue**: [KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6은 더 이상 유형에 적용할 수 없는 유형에 대한 주석을 허용하지 않습니다.
>
> **Deprecation cycle**:
>
> - 1.5.20: 프로그레시브 모드에서 오류를 발생시킵니다.
> - 1.6.0: 오류를 발생시킵니다.
>   `-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions`를 사용하여 임시로 오류 보고를 비활성화할 수 있습니다.

### 후행 람다가 있는 suspend라는 이름의 함수 호출 금지

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6은 더 이상 후행 람다로 전달된 함수 유형의 단일 인수를 갖는 `suspend`라는 이름의 함수 호출을 허용하지 않습니다.
>
> **Deprecation cycle**:
>
> - 1.3.0: 이러한 함수 호출에 대해 경고를 표시합니다.
> - 1.6.0: 이 경고를 오류로 올립니다.
> - &gt;= 1.7.0: 언어 문법에 대한 변경 사항을 도입하여 `{` 앞의 `suspend`가 키워드로 구문 분석되도록 합니다.

## 표준 라이브러리

### minus/removeAll/retainAll에서 깨지기 쉬운 contains 최적화 제거

> **Issue**: [KT-45438](https://youtrack.jetbrains.com/issue/KT-45438)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.6은 더 이상 컬렉션/iterable/배열/시퀀스에서 여러 요소를 제거하는 함수 및 연산자의 인수에 대해 집합으로 변환을 수행하지 않습니다.
>
> **Deprecation cycle**:
>
> - < 1.6: 이전 동작: 일부 경우에서 인수가 집합으로 변환됩니다.
> - 1.6.0: 함수 인수가 컬렉션인 경우 더 이상 `Set`으로 변환되지 않습니다. 컬렉션이 아닌 경우 대신 `List`로 변환될 수 있습니다.
> 이전 동작은 시스템 속성 `kotlin.collections.convert_arg_to_set_in_removeAll=true`를 설정하여 JVM에서 임시로 다시 켤 수 있습니다.
> - &gt;= 1.7: 위의 시스템 속성은 더 이상 효과가 없습니다.

### Random.nextLong에서 값 생성 알고리즘 변경

> **Issue**: [KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.6은 지정된 범위를 벗어난 값 생성을 방지하기 위해 `Random.nextLong` 함수에서 값 생성 알고리즘을 변경합니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 동작이 즉시 수정됩니다.

### 컬렉션 min 및 max 함수의 반환 유형을 non-nullable로 점진적으로 변경

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: 컬렉션 `min` 및 `max` 함수의 반환 유형이 Kotlin 1.7에서 non-nullable로 변경됩니다.
>
> **Deprecation cycle**:
>
> - 1.4.0: `...OrNull` 함수를 동의어로 도입하고 영향을 받는 API를 사용 중단합니다 (자세한 내용은 문제 참조).
> - 1.5.0: 영향을 받는 API의 사용 중단 수준을 오류로 올립니다.
> - 1.6.0: 사용 중단된 함수를 공개 API에서 숨깁니다.
> - &gt;= 1.7: 영향을 받는 API를 다시 도입하지만 non-nullable 반환 유형을 사용합니다.

### 부동 소수점 배열 함수 사용 중단: contains, indexOf, lastIndexOf

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin은 총 순서 대신 IEEE-754 순서를 사용하여 값을 비교하는 부동 소수점 배열 함수 `contains`, `indexOf`, `lastIndexOf`를 사용 중단합니다.
>
> **Deprecation cycle**:
>
> - 1.4.0: 영향을 받는 함수를 경고와 함께 사용 중단합니다.
> - 1.6.0: 사용 중단 수준을 오류로 올립니다.
> - &gt;= 1.7: 사용 중단된 함수를 공개 API에서 숨깁니다.

### kotlin.dom 및 kotlin.browser 패키지에서 kotlinx.*로 선언 마이그레이션

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
> - 1.4.0: `kotlinx.dom` 및 `kotlinx.browser` 패키지에서 대체 API를 도입합니다.
> - 1.4.0: `kotlin.dom` 및 `kotlin.browser` 패키지에서 API를 사용 중단하고 위의 새 API를 대체로 제안합니다.
> - 1.6.0: 사용 중단 수준을 오류로 올립니다.
> - &gt;= 1.7: stdlib에서 사용 중단된 함수를 제거합니다.
> - &gt;= 1.7: kotlinx.* 패키지의 API를 별도의 라이브러리로 이동합니다.

### Kotlin/JS에서 Regex.replace 함수를 인라인하지 않도록 설정

> **Issue**: [KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: 함수형 `transform` 매개변수가 있는 `Regex.replace` 함수는 더 이상 Kotlin/JS에서 인라인되지 않습니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 영향을 받는 함수에서 `inline` 수정자를 제거합니다.

### 대체 문자열에 그룹 참조가 포함된 경우 JVM 및 JS에서 Regex.replace 함수의 동작이 다름

> **Issue**: [KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin/JS에서 대체 패턴 문자열이 있는 함수 `Regex.replace`는 Kotlin/JVM과 동일한 패턴 구문을 따릅니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: Kotlin/JS stdlib의 `Regex.replace`에서 대체 패턴 처리를 변경합니다.

### JS Regex에서 유니코드 대소문자 폴딩 사용

> **Issue**: [KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin/JS의 `Regex` 클래스는 유니코드 규칙에 따라 문자를 검색하고 비교하기 위해 기본 JS 정규식 엔진을 호출할 때 [`unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode) 플래그를 사용합니다.
> 이는 JS 환경에 대한 특정 버전 요구 사항을 발생시키고 정규식 패턴 문자열에서 불필요한 이스케이프에 대한 더 엄격한 유효성 검사를 유발합니다.
>
> **Deprecation cycle**:
>
> - 1.5.0: JS `Regex` 클래스의 대부분의 함수에서 유니코드 대소문자 폴딩을 활성화합니다.
> - 1.6.0: `Regex.replaceFirst` 함수에서 유니코드 대소문자 폴딩을 활성화합니다.

### 일부 JS 전용 API 사용 중단

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: stdlib의 여러 JS 전용 함수가 제거를 위해 사용 중단되었습니다. 여기에는 `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)` 및 비교 함수를 사용하는 배열의 `sort` 함수 (예: `Array<out T>.sort(comparison: (a: T, b: T) `->` Int)`)가 포함됩니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 영향을 받는 함수를 경고와 함께 사용 중단합니다.
> - 1.7.0: 사용 중단 수준을 오류로 올립니다.
> - 1.8.0: 사용 중단된 함수를 공개 API에서 제거합니다.

### Kotlin/JS에서 클래스의 공개 API에서 구현 및 interop 관련 함수 숨기기

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source, binary
>
> **Short summary**: 함수 `HashMap.createEntrySet` 및 `AbstactMutableCollection.toJSON`이 내부로 가시성을 변경합니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 함수를 내부로 만들어서 공개 API에서 제거합니다.

## 도구

### KotlinGradleSubplugin 클래스 사용 중단

> **Issue**: [KT-48830](https://youtrack.jetbrains.com/issue/KT-48830)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 클래스 `KotlinGradleSubplugin`은 `KotlinCompilerPluginSupportPlugin`을 선호하여 사용 중단됩니다.
>
> **Deprecation cycle**:
>
> - 1.6.0: 사용 중단 수준을 오류로 올립니다.
> - &gt;= 1.7.0: 사용 중단된 클래스를 제거합니다.

### kotlin.useFallbackCompilerSearch 빌드 옵션 제거

> **Issue**: [KT-46719](https://youtrack.jetbrains.com/issue/KT-46719)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 사용 중단된 'kotlin.useFallbackCompilerSearch' 빌드 옵션을 제거합니다.
>
> **Deprecation cycle**:
>
> - 1.5.0: 사용 중단 수준을 경고로 올립니다.
> - 1.6.0: 사용 중단된 옵션을 제거합니다.

### 여러 컴파일러 옵션 제거

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 사용 중단된 `noReflect` 및 `includeRuntime` 컴파일러 옵션을 제거합니다.
>
> **Deprecation cycle**:
>
> - 1.5.0: 사용 중단 수준을 오류로 올립니다.
> - 1.6.0: 사용 중단된 옵션을 제거합니다.

### useIR 컴파일러 옵션 사용 중단

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 사용 중단된 `useIR` 컴파일러 옵션을 숨깁니다.
>
> **Deprecation cycle**:
>
> - 1.5.0: 사용 중단 수준을 경고로 올립니다.
> - 1.6.0: 옵션을 숨깁니다.
> - &gt;= 1.7.0: 사용 중단된 옵션을 제거합니다.

### kapt.use.worker.api Gradle 속성 사용 중단

> **Issue**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Gradle Workers API를 통해 kapt를 실행할 수 있는 `kapt.use.worker.api` 속성 (기본값: true)을 사용 중단합니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 사용 중단 수준을 경고로 올립니다.
> - &gt;= 1.8.0: 이 속성을 제거합니다.

### kotlin.parallel.tasks.in.project Gradle 속성 제거

> **Issue**: [KT-46406](https://youtrack.jetbrains.com/issue/KT-46406)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.parallel.tasks.in.project` 속성을 제거합니다.
>
> **Deprecation cycle**:
>
> - 1.5.20: 사용 중단 수준을 경고로 올립니다.
> - 1.6.20: 이 속성을 제거합니다.

### kotlin.experimental.coroutines Gradle DSL 옵션 및 kotlin.coroutines Gradle 속성 사용 중단

> **Issue**: [KT-50369](https://youtrack.jetbrains.com/issue/KT-50369)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.experimental.coroutines` Gradle DSL 옵션 및 `kotlin.coroutines` 속성을 사용 중단합니다.
>
> **Deprecation cycle**:
>
> - 1.6.20: 사용 중단 수준을 경고로 올립니다.
> - &gt;= 1.7.0: DSL 옵션 및 속성을 제거합니다.