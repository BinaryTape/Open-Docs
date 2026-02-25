[//]: # (title: Kotlin 1.4.x 호환성 가이드)

_[언어를 현대적으로 유지하기](kotlin-evolution-principles.md)_와 _[편안한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 기본 원칙 중 하나입니다. 전자는 언어의 발전을 방해하는 구조는 제거되어야 한다는 원칙이며, 후자는 코드 마이그레이션을 가능한 한 원활하게 만들기 위해 이러한 제거 작업이 사전에 충분히 전달되어야 한다는 원칙입니다.

대부분의 언어 변경 사항은 업데이트 변경 로그나 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 Kotlin 1.3에서 Kotlin 1.4로 마이그레이션하기 위한 완전한 참조를 제공하기 위해 모든 변경 사항을 요약합니다.

## 기본 용어

이 문서에서는 몇 가지 종류의 호환성을 소개합니다.

- _소스(source)_: 소스 호환성이 깨지는 변경이 발생하면 기존에 잘 컴파일되던 코드(에러나 경고 없이)가 더 이상 컴파일되지 않습니다.
- _바이너리(binary)_: 두 바이너리 아티팩트가 서로 교체되었을 때 로딩 또는 링크 에러가 발생하지 않는다면 바이너리 호환성이 있다고 합니다. 
- _동작(behavioral)_: 변경 전후에 동일한 프로그램이 서로 다른 동작을 나타내는 경우 동작 호환성이 깨진 것으로 간주합니다.

이러한 정의는 순수 Kotlin에 대해서만 적용된다는 점을 기억하세요. 다른 언어(예: Java)의 관점에서 본 Kotlin 코드의 호환성은 이 문서의 범위를 벗어납니다.

## 언어 및 표준 라이브러리 (stdlib)

### infix 연산자와 ConcurrentHashMap의 예기치 않은 동작

> **이슈**: [KT-18053](https://youtrack.jetbrains.com/issue/KT-18053)
> 
> **컴포넌트**: 핵심 언어 (Core language)
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4에서는 Java로 작성된 `java.util.Map` 구현체에서 발생하는 자동 `contains` 연산자 사용을 금지합니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 호출 지점에서 문제의 소지가 있는 연산자에 대해 경고 도입
> - 1.4 이상: 이 경고를 에러로 격상,
>  `-XXLanguage:-ProhibitConcurrentHashMapContains`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있음

### 공개 인라인 멤버 내에서 protected 멤버에 대한 접근 금지

> **이슈**: [KT-21178](https://youtrack.jetbrains.com/issue/KT-21178)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4에서는 공개 인라인(public inline) 멤버에서 protected 멤버에 접근하는 것을 금지합니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 문제의 소지가 있는 사례에 대해 호출 지점에서 경고 도입
> - 1.4: 이 경고를 에러로 격상,
>  `-XXLanguage:-ProhibitProtectedCallFromInline`을 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있음

### 암시적 수신 객체가 있는 호출에서의 계약 (Contracts)

> **이슈**: [KT-28672](https://youtrack.jetbrains.com/issue/KT-28672)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: 1.4부터는 암시적 수신 객체(implicit receivers)가 있는 호출에서도 계약(contracts)을 통한 스마트 캐스트(smart casts)를 사용할 수 있습니다.
> 
> **지원 중단 사이클**: 
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
>  `-XXLanguage:-ContractsOnCallsWithImplicitReceiver`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있음

### 부동 소수점 수 비교의 일관성 없는 동작

> **이슈**: [KT-22723](https://youtrack.jetbrains.com/issue/KT-22723)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 Kotlin 컴파일러는 부동 소수점 수를 비교할 때 IEEE 754 표준을 사용합니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
>  `-XXLanguage:-ProperIeee754Comparisons`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있음

### 제네릭 람다의 마지막 표현식에 스마트 캐스트가 적용되지 않음

> **이슈**: [KT-15020](https://youtrack.jetbrains.com/issue/KT-15020)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: 1.4부터 람다의 마지막 표현식에 대한 스마트 캐스트가 올바르게 적용됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요. 

### 결과값을 Unit으로 강제 변환할 때 람다 인자의 순서에 의존하지 않음

> **이슈**: [KT-36045](https://youtrack.jetbrains.com/issue/KT-36045)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 람다 인자는 `Unit`으로의 암시적 강제 변환(implicit coercion) 없이 독립적으로 해석됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요. 

### 로우 타입과 정수 리터럴 타입 사이의 잘못된 공통 상위 타입으로 인한 불안정한 코드

> **이슈**: [KT-35681](https://youtrack.jetbrains.com/issue/KT-35681)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 로우(raw) `Comparable` 타입과 정수 리터럴 타입 사이의 공통 상위 타입(common supertype)이 더 구체적으로 지정됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요. 

### 여러 동일한 타입 변수가 서로 다른 타입으로 인스턴스화되어 발생하는 타입 안전성 문제

> **이슈**: [KT-35679](https://youtrack.jetbrains.com/issue/KT-35679)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 Kotlin 컴파일러는 동일한 타입 변수를 서로 다른 타입으로 인스턴스화하는 것을 금지합니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요.

### 교차 타입에 대한 잘못된 하위 타입 지정으로 인한 타입 안전성 문제

> **이슈**: [KT-22474](https://youtrack.jetbrains.com/issue/KT-22474)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4에서는 교차 타입(intersection types)에 대한 하위 타입 지정(subtyping)이 더 정확하게 작동하도록 개선됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요.

### 람다 내부의 빈 when 표현식에 타입 불일치 에러가 발생하지 않음

> **이슈**: [KT-17995](https://youtrack.jetbrains.com/issue/KT-17995)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 비어 있는 `when` 표현식이 람다의 마지막 표현식으로 사용되는 경우 타입 불일치(type mismatch) 에러가 발생합니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요.

### 가능한 반환 값 중 하나에 정수 리터럴이 포함된 조기 반환 람다에 대해 반환 타입 Any가 추론됨

> **이슈**: [KT-20226](https://youtrack.jetbrains.com/issue/KT-20226)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 조기 반환(early return)이 있는 람다에서 반환되는 정수 타입이 더 구체적으로 추론됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요.

### 재귀 타입을 사용하는 스타 프로젝션의 적절한 캡처

> **이슈**: [KT-33012](https://youtrack.jetbrains.com/issue/KT-33012)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 재귀 타입에 대한 캡처(capturing)가 더 정확하게 작동하여 더 많은 후보들이 적용 가능해집니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요.

### 불완전한 타입과 유연한 타입이 섞인 공통 상위 타입 계산 시 잘못된 결과 발생

> **이슈**: [KT-37054](https://youtrack.jetbrains.com/issue/KT-37054)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 유연한 타입(flexible types) 사이의 공통 상위 타입이 더 구체적으로 지정되어 런타임 에러를 방지합니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요.

### nullable 타입 인자에 대한 캡처 변환 부족으로 인한 타입 안전성 문제

> **이슈**: [KT-35487](https://youtrack.jetbrains.com/issue/KT-35487)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 캡처된 타입과 nullable 타입 사이의 하위 타입 지정이 더 정확해져 런타임 에러를 방지합니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요.

### unchecked 캐스트 후 공변 타입에 대한 교차 타입 유지
 
> **이슈**: [KT-37280](https://youtrack.jetbrains.com/issue/KT-37280)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 공변(covariant) 타입에 대한 unchecked 캐스트는 스마트 캐스트 시 unchecked 캐스트의 타입이 아닌 교차 타입(intersection type)을 생성합니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요.

### this 표현식 사용으로 인해 빌더 추론에서 타입 변수가 유출됨
 
> **이슈**: [KT-32126](https://youtrack.jetbrains.com/issue/KT-32126)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 다른 적절한 제약 조건이 없는 경우 `sequence {}`와 같은 빌더 함수 내부에서 `this`를 사용하는 것이 금지됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요.

### nullable 타입 인자를 가진 반공변 타입에 대한 잘못된 오버로드 해소
 
> **이슈**: [KT-31670](https://youtrack.jetbrains.com/issue/KT-31670)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 반공변(contravariant) 타입 인자를 받는 함수의 두 오버로드가 타입의 null 허용 여부만 다른 경우(예: `In<T>`와 `In<T?>`), nullable 타입이 더 구체적인 것으로 간주됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요.

### 중첩되지 않은 재귀적 제약 조건이 있는 빌더 추론
 
> **이슈**: [KT-34975](https://youtrack.jetbrains.com/issue/KT-34975)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 전달된 람다 내부의 재귀적 제약 조건에 의존하는 타입을 가진 `sequence {}`와 같은 빌더 함수는 컴파일러 에러를 발생시킵니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요.

### 성급한 타입 변수 고정으로 인한 모순된 제약 시스템 발생
 
> **이슈**: [KT-25175](https://youtrack.jetbrains.com/issue/KT-25175)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 특정 상황에서 타입 추론이 덜 성급하게(less eagerly) 작동하여 모순되지 않는 제약 시스템을 찾을 수 있게 됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
> `-XXLanguage:-NewInference`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있습니다. 이 플래그는 몇 가지 새로운 언어 기능도 비활성화하므로 주의하세요.

### open 함수에서 tailrec 수정자 사용 금지

> **이슈**: [KT-18541](https://youtrack.jetbrains.com/issue/KT-18541)
> 
> **컴포넌트**: 핵심 언어
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 함수는 `open`과 `tailrec` 수정자를 동시에 가질 수 없습니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: `open`과 `tailrec` 수정자가 함께 있는 함수에 대해 경고 보고 (progressive 모드에서는 에러).
> - 1.4 이상: 이 경고를 에러로 격상.

### 컴패니언 객체의 INSTANCE 필드가 컴패니언 객체 클래스 자체보다 더 높은 가시성을 가짐

> **이슈**: [KT-11567](https://youtrack.jetbrains.com/issue/KT-11567)
> 
> **컴포넌트**: Kotlin/JVM
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 컴패니언 객체(companion object)가 private인 경우 해당 객체의 `INSTANCE` 필드도 private이 됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 컴파일러가 지원 중단(deprecated) 플래그와 함께 `INSTANCE` 객체를 생성
> - 1.4 이상: 컴패니언 객체의 `INSTANCE` 필드가 적절한 가시성을 가짐

### return 이전에 삽입된 외부 finally 블록이 finally가 없는 내부 try 블록의 catch 간격에서 제외되지 않음

> **이슈**: [KT-31923](https://youtrack.jetbrains.com/issue/KT-31923)
> 
> **컴포넌트**: Kotlin/JVM
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 중첩된 `try/catch` 블록에 대해 catch 간격이 올바르게 계산됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
>  `-XXLanguage:-ProperFinally`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있음

### 공변 및 제네릭 특화 오버라이드의 반환 타입 위치에서 인라인 클래스의 박싱된 버전 사용

> **이슈**: [KT-30419](https://youtrack.jetbrains.com/issue/KT-30419)
> 
> **컴포넌트**: Kotlin/JVM
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 공변 및 제네릭 특화 오버라이드를 사용하는 함수는 인라인 클래스의 박싱된(boxed) 값을 반환합니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨 

### Kotlin 인터페이스로의 위임 사용 시 JVM 바이트코드에서 체크 예외를 선언하지 않음

> **이슈**: [KT-35834](https://youtrack.jetbrains.com/issue/KT-35834)
> 
> **컴포넌트**: Kotlin/JVM
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4는 Kotlin 인터페이스에 대한 인터페이스 위임(delegation) 중에 체크 예외(checked exceptions)를 생성하지 않습니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
>  `-XXLanguage:-DoNotGenerateThrowsForDelegatedKotlinMembers`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있음

### 단일 가변 인자 매개변수를 가진 메서드에 대한 시그니처 다형성 호출의 동작 변경 (인자를 다른 배열로 래핑하지 않도록 함)

> **이슈**: [KT-35469](https://youtrack.jetbrains.com/issue/KT-35469)
> 
> **컴포넌트**: Kotlin/JVM
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4는 시그니처 다형성(signature-polymorphic) 호출 시 인자를 다른 배열로 래핑하지 않습니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨

### KClass가 제네릭 매개변수로 사용될 때 애너테이션 내의 잘못된 제네릭 시그니처 수정

> **이슈**: [KT-35207](https://youtrack.jetbrains.com/issue/KT-35207)
> 
> **컴포넌트**: Kotlin/JVM
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4는 KClass가 제네릭 매개변수로 사용될 때 애너테이션에서의 잘못된 타입 매핑을 수정합니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨

### 시그니처 다형성 호출에서 스프레드 연산자 금지

> **이슈**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
> 
> **컴포넌트**: Kotlin/JVM
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4는 시그니처 다형성 호출에서 스프레드 연산자(*)의 사용을 금지합니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 시그니처 다형성 호출에서의 스프레드 연산자 사용에 대해 경고 보고
> - 1.5 이상: 이 경고를 에러로 격상,
> `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall`을 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있음

### tail-recursive 최적화 함수의 기본값 초기화 순서 변경

> **이슈**: [KT-31540](https://youtrack.jetbrains.com/issue/KT-31540)
> 
> **컴포넌트**: Kotlin/JVM
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 tail-recursive 함수의 초기화 순서는 일반 함수와 동일하게 적용됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 문제의 소지가 있는 함수에 대해 선언 지점에서 경고 보고
> - 1.4 이상: 동작 변경됨,
>  `-XXLanguage:-ProperComputationOrderOfTailrecDefaultParameters`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있음

### non-const val에 대해 ConstantValue 속성을 생성하지 않음

> **이슈**: [KT-16615](https://youtrack.jetbrains.com/issue/KT-16615)
> 
> **컴포넌트**: Kotlin/JVM
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 컴파일러는 `const`가 아닌 `val`에 대해 `ConstantValue` 속성을 생성하지 않습니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: IntelliJ IDEA 검사를 통해 경고 보고
> - 1.4 이상: 동작 변경됨,
>  `-XXLanguage:-NoConstantValueAttributeForNonConstVals`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있음

### open 메서드에서 @JvmOverloads로 생성된 오버로드 함수는 final이어야 함

> **이슈**: [KT-33240](https://youtrack.jetbrains.com/issue/KT-33240)
> 
> **컴포넌트**: Kotlin/JVM
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: `@JvmOverloads`가 붙은 함수에 대해 생성된 오버로드들은 `final`로 생성됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨,
>  `-XXLanguage:-GenerateJvmOverloadsAsFinal`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있음

### kotlin.Result를 반환하는 람다가 이제 언박싱된 값 대신 박싱된 값을 반환함

> **이슈**: [KT-39198](https://youtrack.jetbrains.com/issue/KT-39198)
> 
> **컴포넌트**: Kotlin/JVM
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 `kotlin.Result` 타입을 반환하는 람다는 언박싱된 값 대신 박싱된 값을 반환합니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨

### null 체크 예외 통합

> **이슈**: [KT-22275](https://youtrack.jetbrains.com/issue/KT-22275)
> 
> **컴포넌트**: Kotlin/JVM
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 모든 런타임 null 체크는 `java.lang.NullPointerException`을 던집니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 런타임 null 체크 시 `KotlinNullPointerException`, `IllegalStateException`, `IllegalArgumentException`, `TypeCastException` 등 다양한 예외를 던짐
> - 1.4 이상: 모든 런타임 null 체크가 `java.lang.NullPointerException`을 던짐.
>   `-Xno-unified-null-checks`를 사용하여 일시적으로 1.4 이전 동작으로 되돌릴 수 있음

### 배열/리스트 연산(contains, indexOf, lastIndexOf)에서의 부동 소수점 비교: IEEE 754 또는 전체 순서 (total order)

> **이슈**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
> 
> **컴포넌트**: kotlin-stdlib (JVM)
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: `Double/FloatArray.asList()`에서 반환된 `List` 구현체는 `contains`, `indexOf`, `lastIndexOf`에서 전체 순서(total order) 동등성을 사용하도록 구현됩니다.
> 
> **지원 중단 사이클**: 
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨

### 컬렉션 min 및 max 함수의 반환 타입을 단계적으로 non-nullable로 변경

> **이슈**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
> 
> **컴포넌트**: kotlin-stdlib (JVM)
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: 컬렉션 `min` 및 `max` 함수의 반환 타입이 1.6에서 non-nullable로 변경됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4: 유의어로 `...OrNull` 함수를 도입하고 영향을 받는 API를 지원 중단 (이슈 상세 내용 참조)
> - 1.5.x: 영향을 받는 API의 지원 중단 레벨을 에러로 격상
> - 1.6 이상: 영향을 받는 API를 non-nullable 반환 타입으로 재도입

### appendln을 지양하고 appendLine을 권장

> **이슈**: [KT-38754](https://youtrack.jetbrains.com/issue/KT-38754)
> 
> **컴포넌트**: kotlin-stdlib (JVM)
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: `StringBuilder.appendln()`은 `StringBuilder.appendLine()`을 권장하며 지원 중단됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4: `appendln`의 대체제로 `appendLine` 함수를 도입하고 `appendln`을 지원 중단
> - 1.5 이상: 지원 중단 레벨을 에러로 격상

### 부동 소수점 타입을 Short 및 Byte로 변환하는 기능 지원 중단

> **이슈**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
> 
> **컴포넌트**: kotlin-stdlib (JVM)
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 부동 소수점 타입을 `Short` 및 `Byte`로 변환하는 기능이 지원 중단됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4: `Double.toShort()/toByte()` 및 `Float.toShort()/toByte()`를 지원 중단하고 대체제 제안
> - 1.5 이상: 지원 중단 레벨을 에러로 격상

### Regex.findAll에서 잘못된 startIndex 입력 시 즉시 실패 (Fail fast)

> **이슈**: [KT-28356](https://youtrack.jetbrains.com/issue/KT-28356)
> 
> **컴포넌트**: kotlin-stdlib
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 `findAll`은 `startIndex`가 입력 문자열의 유효한 인덱스 범위 내에 있는지 확인하도록 개선되었으며, 유효하지 않은 경우 `IndexOutOfBoundsException`을 던집니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨

### 지원 중단된 kotlin.coroutines.experimental 제거

> **이슈**: [KT-36083](https://youtrack.jetbrains.com/issue/KT-36083)
> 
> **컴포넌트**: kotlin-stdlib
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 지원 중단된 `kotlin.coroutines.experimental` API가 stdlib에서 제거됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: `kotlin.coroutines.experimental`이 `ERROR` 레벨로 지원 중단됨
> - 1.4 이상: `kotlin.coroutines.experimental`이 stdlib에서 제거됨. JVM의 경우 별도의 호환성 아티팩트가 제공됨 (이슈 상세 내용 참조).

### 지원 중단된 mod 연산자 제거

> **이슈**: [KT-26654](https://youtrack.jetbrains.com/issue/KT-26654)
> 
> **컴포넌트**: kotlin-stdlib
> 
> **호환성 저해 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 숫자 타입에 대한 `mod` 연산자가 stdlib에서 제거됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: `mod`가 `ERROR` 레벨로 지원 중단됨
> - 1.4 이상: `mod`가 stdlib에서 제거됨

### Throwable.addSuppressed 멤버를 숨기고 확장 함수를 우선함

> **이슈**: [KT-38777](https://youtrack.jetbrains.com/issue/KT-38777)
> 
> **컴포넌트**: kotlin-stdlib
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: 이제 `Throwable.addSuppressed()` 멤버 함수보다 `Throwable.addSuppressed()` 확장 함수가 우선적으로 사용됩니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이전 동작 (이슈 상세 내용 참조)
> - 1.4 이상: 동작 변경됨

### capitalize가 이중음자(digraphs)를 타이틀 케이스로 변환해야 함

> **이슈**: [KT-38817](https://youtrack.jetbrains.com/issue/KT-38817)
> 
> **컴포넌트**: kotlin-stdlib
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: `String.capitalize()` 함수가 이제 [세르보-크로아티아 가이 라틴 문자(Serbo-Croatian Gaj's Latin alphabet)](https://en.wikipedia.org/wiki/Gaj%27s_Latin_alphabet)의 이중음자(digraphs)를 타이틀 케이스(title case)로 변환합니다 (예: `Ǆ` 대신 `ǅ`).
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 이중음자가 대문자(`Ǆ`)로 변환됨
> - 1.4 이상: 이중음자가 타이틀 케이스(`ǅ`)로 변환됨

## 도구

### Windows에서 구분 기호 문자가 포함된 컴파일러 인자는 큰따옴표로 전달해야 함

> **이슈**: [KT-41309](https://youtrack.jetbrains.com/issue/KT-41309)
> 
> **컴포넌트**: CLI
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: Windows에서 구분 기호 문자(공백, `=`, `;`, `,`)를 포함하는 `kotlinc.bat` 인자는 이제 큰따옴표(`"`)가 필요합니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 모든 컴파일러 인자가 따옴표 없이 전달됨
> - 1.4 이상: 구분 기호 문자(공백, `=`, `;`, `,`)를 포함하는 컴파일러 인자는 큰따옴표(`"`)가 필요함

### KAPT: 프로퍼티에 대한 합성 $annotations() 메서드의 이름이 변경됨

> **이슈**: [KT-36926](https://youtrack.jetbrains.com/issue/KT-36926)
> 
> **컴포넌트**: KAPT
> 
> **호환성 저해 변경 유형**: 동작
> 
> **요약**: 1.4에서 프로퍼티를 위해 KAPT가 생성하는 합성 `$annotations()` 메서드의 이름이 변경되었습니다.
> 
> **지원 중단 사이클**:
> 
> - 1.4 미만: 프로퍼티에 대한 합성 `$annotations()` 메서드 이름이 `<propertyName>@annotations()` 템플릿을 따름
> - 1.4 이상: 프로퍼티에 대한 합성 `$annotations()` 메서드 이름에 `get` 접두사가 포함됨: `get<PropertyName>@annotations()`