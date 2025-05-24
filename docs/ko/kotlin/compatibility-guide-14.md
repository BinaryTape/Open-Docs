---
title: "Kotlin 1.4 호환성 가이드"
---
_[Keeping the Language Modern](kotlin-evolution-principles)_ 및 _[Comfortable Updates](kotlin-evolution-principles)_ 는 Kotlin 언어 설계의 기본 원칙에 속합니다. 전자는 언어 발전을 저해하는 구조는 제거해야 한다고 말하며, 후자는 코드 마이그레이션을 최대한 원활하게 진행할 수 있도록 이러한 제거 사항을 사전에 충분히 알려야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 Kotlin 1.3에서 Kotlin 1.4로의 마이그레이션에 대한 완전한 참조를 제공하면서 이러한 모든 변경 사항을 요약합니다.

## 기본 용어

이 문서에서는 다음과 같은 여러 종류의 호환성을 소개합니다.

- _source_ (소스): 소스 비호환 변경은 오류나 경고 없이 정상적으로 컴파일되던 코드를 더 이상 컴파일할 수 없게 합니다.
- _binary_ (바이너리): 두 바이너리 아티팩트가 서로 교환되어도 로딩 또는 연결 오류가 발생하지 않으면 바이너리 호환성이 있다고 합니다.
- _behavioral_ (동작): 변경 사항을 적용하기 전후에 동일한 프로그램이 다른 동작을 보이는 경우 동작 비호환이라고 합니다.

이러한 정의는 순수 Kotlin에만 적용된다는 점을 기억하십시오. 다른 언어 관점(예: Java)에서 본 Kotlin 코드의 호환성은 이 문서의 범위를 벗어납니다.

## 언어 및 stdlib

### in infix 연산자 및 ConcurrentHashMap 관련 예기치 않은 동작

> **Issue**: [KT-18053](https://youtrack.jetbrains.com/issue/KT-18053)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4에서는 Java로 작성된 `java.util.Map` 구현체에서 자동으로 제공되는 `contains` 연산자를 금지합니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 문제 있는 연산자에 대한 경고를 호출 위치에 표시합니다.
> - &gt;= 1.4: 이 경고를 오류로 승격합니다.
>  `-XXLanguage:-ProhibitConcurrentHashMapContains` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다.

### public inline 멤버 내에서 protected 멤버에 대한 접근 금지

> **Issue**: [KT-21178](https://youtrack.jetbrains.com/issue/KT-21178)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4에서는 public inline 멤버에서 protected 멤버에 대한 접근을 금지합니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 문제 있는 경우에 대한 경고를 호출 위치에 표시합니다.
> - 1.4: 이 경고를 오류로 승격합니다.
>  `-XXLanguage:-ProhibitProtectedCallFromInline` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다.

### 암시적 수신자가 있는 호출에 대한 Contracts

> **Issue**: [KT-28672](https://youtrack.jetbrains.com/issue/KT-28672)
> 
> **Component**: Core Language
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: 1.4에서는 contracts에서 스마트 캐스트를 암시적 수신자가 있는 호출에서 사용할 수 있습니다.
> 
> **Deprecation cycle**: 
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
>  `-XXLanguage:-ContractsOnCallsWithImplicitReceiver` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다.

### 부동 소수점 숫자 비교의 일관성 없는 동작

> **Issues**: [KT-22723](https://youtrack.jetbrains.com/issue/KT-22723)
> 
> **Component**: Core language
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: Kotlin 1.4부터 Kotlin 컴파일러는 IEEE 754 표준을 사용하여 부동 소수점 숫자를 비교합니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
>  `-XXLanguage:-ProperIeee754Comparisons` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다.

### 제네릭 람다의 마지막 표현식에 대한 스마트 캐스트 없음

> **Issue**: [KT-15020](https://youtrack.jetbrains.com/issue/KT-15020)
> 
> **Component**: Core Language
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: 람다의 마지막 표현식에 대한 스마트 캐스트는 1.4부터 올바르게 적용됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 결과를 Unit으로 강제 변환하기 위해 람다 인수의 순서에 의존하지 마십시오.

> **Issue**: [KT-36045](https://youtrack.jetbrains.com/issue/KT-36045)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 람다 인수는 `Unit`으로의 암시적 강제 변환 없이 독립적으로 확인됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 원시 타입과 정수 리터럴 타입 간의 잘못된 공통 상위 타입은 건전하지 못한 코드를 유발합니다.

> **Issue**: [KT-35681](https://youtrack.jetbrains.com/issue/KT-35681)
> 
> **Components**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 원시 `Comparable` 타입과 정수 리터럴 타입 간의 공통 상위 타입이 더 구체적으로 지정됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 여러 동일한 타입 변수가 다른 타입으로 인스턴스화되었기 때문에 발생하는 타입 안전성 문제

> **Issue**: [KT-35679](https://youtrack.jetbrains.com/issue/KT-35679)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 Kotlin 컴파일러는 동일한 타입 변수를 다른 타입으로 인스턴스화하는 것을 금지합니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 교차 타입에 대한 잘못된 서브타입 때문에 발생하는 타입 안전성 문제

> **Issues**: [KT-22474](https://youtrack.jetbrains.com/issue/KT-22474)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4에서는 교차 타입에 대한 서브타입이 더 올바르게 작동하도록 개선됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 람다 내부의 비어 있는 when 표현식으로 인한 타입 불일치 없음

> **Issue**: [KT-17995](https://youtrack.jetbrains.com/issue/KT-17995)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 비어 있는 `when` 표현식이 람다의 마지막 표현식으로 사용되는 경우 타입 불일치가 발생합니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 가능한 반환 값 중 하나에 정수 리터럴이 있는 조기 반환이 있는 람다에 대해 Any 반환 타입이 추론됩니다.

> **Issue**: [KT-20226](https://youtrack.jetbrains.com/issue/KT-20226)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 람다에서 반환되는 정수 타입은 조기 반환이 있는 경우 더 구체적으로 지정됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 재귀 타입이 있는 스타 프로젝션의 적절한 캡처

> **Issue**: [KT-33012](https://youtrack.jetbrains.com/issue/KT-33012)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 재귀 타입에 대한 캡처가 더 올바르게 작동하므로 더 많은 후보가 적용 가능하게 됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 적절하지 않은 타입과 유연한 타입 간의 공통 상위 타입 계산으로 인해 잘못된 결과가 발생합니다.

> **Issue**: [KT-37054](https://youtrack.jetbrains.com/issue/KT-37054)
> 
> **Component**: Core language
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: Kotlin 1.4부터 유연한 타입 간의 공통 상위 타입이 런타임 오류로부터 보호하는 더 구체적인 타입이 됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 널 가능 타입 인수에 대한 캡처된 변환이 부족하여 발생하는 타입 안전성 문제

> **Issue**: [KT-35487](https://youtrack.jetbrains.com/issue/KT-35487)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 캡처된 타입과 널 가능 타입 간의 서브타입이 런타임 오류로부터 보호하는 더 올바른 타입이 됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### unchecked 캐스트 후 공변 타입에 대한 교차 타입 유지

> **Issue**: [KT-37280](https://youtrack.jetbrains.com/issue/KT-37280)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 공변 타입의 unchecked 캐스트는 unchecked 캐스트의 타입이 아닌 스마트 캐스트에 대한 교차 타입을 생성합니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### this 표현식을 사용하여 빌더 추론에서 타입 변수가 유출됩니다.

> **Issue**: [KT-32126](https://youtrack.jetbrains.com/issue/KT-32126)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 적절한 제약 조건이 없는 경우 `sequence {}`와 같은 빌더 함수 내에서 `this`를 사용하는 것이 금지됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 널 가능 타입 인수가 있는 반공변 타입에 대한 잘못된 오버로드 확인

> **Issue**: [KT-31670](https://youtrack.jetbrains.com/issue/KT-31670)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 반공변 타입 인수를 사용하는 함수의 두 오버로드가 타입의 널 가능성(예: `In<T>` 및 `In<T?>`)에 의해서만 다른 경우, 널 가능 타입이 더 구체적인 것으로 간주됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 중첩되지 않은 재귀 제약 조건이 있는 빌더 추론

> **Issue**: [KT-34975](https://youtrack.jetbrains.com/issue/KT-34975)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 전달된 람다 내부의 재귀 제약 조건에 따라 달라지는 타입이 있는 `sequence {}`와 같은 빌더 함수는 컴파일러 오류를 발생시킵니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 조기 타입 변수 고정으로 인해 모순된 제약 조건 시스템이 발생합니다.

> **Issue**: [KT-25175](https://youtrack.jetbrains.com/issue/KT-25175)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 특정 경우에 타입 추론이 덜 적극적으로 작동하여 모순되지 않는 제약 조건 시스템을 찾을 수 있습니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
> `-XXLanguage:-NewInference` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### open 함수에서 tailrec 수정자 금지

> **Issue**: [KT-18541](https://youtrack.jetbrains.com/issue/KT-18541)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 함수는 `open` 및 `tailrec` 수정자를 동시에 가질 수 없습니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: `open` 및 `tailrec` 수정자를 함께 가진 함수에 대한 경고를 보고합니다 (프로그레시브 모드에서는 오류).
> - &gt;= 1.4: 이 경고를 오류로 승격합니다.

### 컴패니언 객체의 INSTANCE 필드가 컴패니언 객체 클래스 자체보다 더 많이 표시됩니다.

> **Issue**: [KT-11567](https://youtrack.jetbrains.com/issue/KT-11567)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 컴패니언 객체가 private인 경우 해당 필드 `INSTANCE`도 private이 됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 컴파일러는 더 이상 사용되지 않는 플래그로 객체 `INSTANCE`를 생성합니다.
> - &gt;= 1.4: 컴패니언 객체 `INSTANCE` 필드는 적절한 가시성을 가집니다.

### 반환 전에 삽입된 외부 finally 블록은 finally가 없는 내부 try 블록의 catch 간격에서 제외되지 않습니다.

> **Issue**: [KT-31923](https://youtrack.jetbrains.com/issue/KT-31923)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: Kotlin 1.4부터 catch 간격은 중첩된 `try/catch` 블록에 대해 적절하게 계산됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
>  `-XXLanguage:-ProperFinally` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다.

### 공변 및 제네릭 특수화된 오버라이드에 대한 반환 타입 위치에서 inline 클래스의 박싱된 버전을 사용합니다.

> **Issues**: [KT-30419](https://youtrack.jetbrains.com/issue/KT-30419)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: Kotlin 1.4부터 공변 및 제네릭 특수화된 오버라이드를 사용하는 함수는 inline 클래스의 박싱된 값을 반환합니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨

### Kotlin 인터페이스에 대한 위임을 사용하는 경우 JVM 바이트코드에서 확인된 예외를 선언하지 마십시오.

> **Issue**: [KT-35834](https://youtrack.jetbrains.com/issue/KT-35834)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4는 Kotlin 인터페이스에 대한 인터페이스 위임 중에 확인된 예외를 생성하지 않습니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
>  `-XXLanguage:-DoNotGenerateThrowsForDelegatedKotlinMembers` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다.

### 단일 vararg 파라미터가 있는 메서드에 대한 signature-polymorphic 호출의 동작이 변경되어 인수를 다른 배열로 래핑하지 않도록 합니다.

> **Issue**: [KT-35469](https://youtrack.jetbrains.com/issue/KT-35469)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4는 signature-polymorphic 호출에서 인수를 다른 배열로 래핑하지 않습니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨

### KClass가 제네릭 파라미터로 사용될 때 어노테이션의 잘못된 제네릭 서명

> **Issue**: [KT-35207](https://youtrack.jetbrains.com/issue/KT-35207)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4는 KClass가 제네릭 파라미터로 사용될 때 어노테이션의 잘못된 타입 매핑을 수정합니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨

### signature-polymorphic 호출에서 spread 연산자 금지

> **Issue**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4는 signature-polymorphic 호출에서 spread 연산자(*)의 사용을 금지합니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: signature-polymorphic 호출에서 spread 연산자 사용에 대한 경고를 보고합니다.
> - &gt;= 1.5: 이 경고를 오류로 승격합니다.
> `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다.

### tail-recursive 최적화된 함수에 대한 기본값의 초기화 순서 변경

> **Issue**: [KT-31540](https://youtrack.jetbrains.com/issue/KT-31540)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: Kotlin 1.4부터 tail-recursive 함수의 초기화 순서는 일반 함수와 동일합니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 문제 있는 함수에 대한 선언 위치에서 경고를 보고합니다.
> - &gt;= 1.4: 동작 변경됨,
>  `-XXLanguage:-ProperComputationOrderOfTailrecDefaultParameters` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다.

### non-const vals에 대한 ConstantValue 속성을 생성하지 마십시오.

> **Issue**: [KT-16615](https://youtrack.jetbrains.com/issue/KT-16615)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: Kotlin 1.4부터 컴파일러는 non-`const` `val`에 대해 `ConstantValue` 속성을 생성하지 않습니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: IntelliJ IDEA 검사를 통해 경고를 보고합니다.
> - &gt;= 1.4: 동작 변경됨,
>  `-XXLanguage:-NoConstantValueAttributeForNonConstVals` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다.

### open 메서드에 대한 @JvmOverloads에 대해 생성된 오버로드는 final이어야 합니다.

> **Issue**: [KT-33240](https://youtrack.jetbrains.com/issue/KT-33240)
> 
> **Components**: Kotlin/JVM
> 
> **Incompatible change type**: source
> 
> **Short summary**: `@JvmOverloads`가 있는 함수에 대한 오버로드는 `final`로 생성됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨,
>  `-XXLanguage:-GenerateJvmOverloadsAsFinal` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다.

### kotlin.Result를 반환하는 람다는 이제 unboxed 대신 박싱된 값을 반환합니다.

> **Issue**: [KT-39198](https://youtrack.jetbrains.com/issue/KT-39198)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: Kotlin 1.4부터 `kotlin.Result` 타입의 값을 반환하는 람다는 unboxed 대신 박싱된 값을 반환합니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨

### 널 검사에서 예외 통합

> **Issue**: [KT-22275](https://youtrack.jetbrains.com/issue/KT-22275)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: behavior
> 
> **Short summary**: Kotlin 1.4부터 모든 런타임 널 검사는 `java.lang.NullPointerException`을 발생시킵니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 런타임 널 검사는 `KotlinNullPointerException`, `IllegalStateException`, `IllegalArgumentException` 및 `TypeCastException`과 같은 다른 예외를 발생시킵니다.
> - &gt;= 1.4: 모든 런타임 널 검사는 `java.lang.NullPointerException`을 발생시킵니다.
>   `-Xno-unified-null-checks` 를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다.

### 배열/리스트 연산 contains, indexOf, lastIndexOf에서 부동 소수점 값 비교: IEEE 754 또는 전체 순서

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
> 
> **Component**: kotlin-stdlib (JVM)
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: `Double/FloatArray.asList()`에서 반환된 `List` 구현은 전체 순서 동일성을 사용하도록 `contains`, `indexOf` 및 `lastIndexOf`를 구현합니다.
> 
> **Deprecation cycle**: 
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨

### 컬렉션 min 및 max 함수의 반환 타입을 널 불가능으로 점진적으로 변경합니다.

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
> 
> **Component**: kotlin-stdlib (JVM)
> 
> **Incompatible change type**: source
> 
> **Short summary**: 컬렉션 `min` 및 `max` 함수의 반환 타입은 1.6에서 널 불가능으로 변경됩니다.
> 
> **Deprecation cycle**:
> 
> - 1.4: `...OrNull` 함수를 동의어로 도입하고 영향을 받는 API를 더 이상 사용되지 않도록 설정합니다 (자세한 내용은 이슈 참조).
> - 1.5.x: 영향을 받는 API의 더 이상 사용되지 않는 수준을 오류로 높입니다.
> - &gt;=1.6: 영향을 받는 API를 다시 도입하지만 널 불가능 반환 타입을 사용합니다.

### appendln을 appendLine으로 대체하기 위해 더 이상 사용되지 않도록 설정

> **Issue**: [KT-38754](https://youtrack.jetbrains.com/issue/KT-38754)
> 
> **Component**: kotlin-stdlib (JVM)
> 
> **Incompatible change type**: source
> 
> **Short summary**: `StringBuilder.appendln()`은 `StringBuilder.appendLine()`으로 대체하기 위해 더 이상 사용되지 않도록 설정됩니다.
> 
> **Deprecation cycle**:
> 
> - 1.4: `appendln`을 대체할 `appendLine` 함수를 도입하고 `appendln`을 더 이상 사용되지 않도록 설정합니다.
> - &gt;=1.5: 더 이상 사용되지 않는 수준을 오류로 높입니다.

### 부동 소수점 타입에서 Short 및 Byte로의 변환을 더 이상 사용되지 않도록 설정

> **Issue**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
> 
> **Component**: kotlin-stdlib (JVM)
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 부동 소수점 타입에서 `Short` 및 `Byte`로의 변환은 더 이상 사용되지 않도록 설정됩니다.
> 
> **Deprecation cycle**:
> 
> - 1.4: `Double.toShort()/toByte()` 및 `Float.toShort()/toByte()`를 더 이상 사용되지 않도록 설정하고 대체 항목을 제안합니다.
> - &gt;=1.5: 더 이상 사용되지 않는 수준을 오류로 높입니다.

### 잘못된 startIndex에서 Regex.findAll에서 빠르게 실패합니다.

> **Issue**: [KT-28356](https://youtrack.jetbrains.com/issue/KT-28356)
> 
> **Component**: kotlin-stdlib
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: Kotlin 1.4부터 `findAll`은 `startIndex`가 `findAll`에 들어가는 순간에 입력 char 시퀀스의 유효한 위치 인덱스 범위 내에 있는지 확인하고 그렇지 않은 경우 `IndexOutOfBoundsException`을 발생시키도록 개선됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: 이전 동작 (자세한 내용은 이슈 참조)
> - &gt;= 1.4: 동작 변경됨

### 더 이상 사용되지 않는 kotlin.coroutines.experimental 제거

> **Issue**: [KT-36083](https://youtrack.jetbrains.com/issue/KT-36083)
> 
> **Component**: kotlin-stdlib
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 더 이상 사용되지 않는 `kotlin.coroutines.experimental` API가 stdlib에서 제거됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: `kotlin.coroutines.experimental`는 `ERROR` 수준으로 더 이상 사용되지 않도록 설정됩니다.
> - &gt;= 1.4: `kotlin.coroutines.experimental`가 stdlib에서 제거됩니다. JVM에서는 별도의 호환성 아티팩트가 제공됩니다 (자세한 내용은 이슈 참조).

### 더 이상 사용되지 않는 mod 연산자 제거

> **Issue**: [KT-26654](https://youtrack.jetbrains.com/issue/KT-26654)
> 
> **Component**: kotlin-stdlib
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4부터 숫자 타입의 `mod` 연산자가 stdlib에서 제거됩니다.
> 
> **Deprecation cycle**:
> 
> - < 1.4: `mod`는 `ERROR` 수준으로 더 이상 사용되지 않도록 설정됩니다.
> - &gt;= 1.4: `mod`가 stdlib에서 제거됩니다.

### Throwable.addSuppressed 멤버를 숨기고 확장 함수를 대신 선호합니다.

> **Issue**: [KT-38777](https://youtrack.jetbrains.com/issue/KT-38777)
> 
> **Component**: kotlin-stdlib
>