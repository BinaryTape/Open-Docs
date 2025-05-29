[//]: # (title: Kotlin 1.4 호환성 가이드)

_[언어를 현대적으로 유지](kotlin-evolution-principles.md)_하고 _[편안한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 근본적인 원칙 중 하나입니다. 전자는 언어 발전을 저해하는 구조는 제거되어야 한다고 말하며, 후자는 코드 마이그레이션이 가능한 한 원활하게 이루어지도록 이러한 제거가 미리 잘 소통되어야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그나 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 Kotlin 1.3에서 Kotlin 1.4로의 마이그레이션을 위한 완전한 참고 자료를 제공하며 모든 변경 사항을 요약합니다.

## 기본 용어

이 문서에서는 몇 가지 호환성 유형을 소개합니다.

- _소스_: 소스 비호환 변경(source-incompatible change)은 이전에는 (오류나 경고 없이) 잘 컴파일되던 코드가 더 이상 컴파일되지 않게 만듭니다.
- _바이너리_: 두 바이너리 아티팩트는 서로 교체했을 때 로딩 또는 연결 오류가 발생하지 않는 경우 바이너리 호환(binary-compatible)이라고 합니다.
- _동작_: 동일한 프로그램이 변경 사항 적용 전후에 다른 동작을 보이는 경우 해당 변경은 동작 비호환(behavioral-incompatible)이라고 합니다.

이러한 정의는 순수 Kotlin에만 적용된다는 점을 기억하십시오. 다른 언어의 관점(예: Java)에서 본 Kotlin 코드의 호환성은 이 문서의 범위를 벗어납니다.

## 언어 및 표준 라이브러리

### `in` 중위 연산자와 `ConcurrentHashMap`의 예상치 못한 동작

> **이슈**: [KT-18053](https://youtrack.jetbrains.com/issue/KT-18053)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4는 Java로 작성된 `java.util.Map` 구현체에서 오는 `contains` 자동 연산자를 금지합니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 호출 시점에 문제가 있는 연산자에 대한 경고 도입
> - `>= 1.4`: 이 경고를 오류로 상향, `-XXLanguage:-ProhibitConcurrentHashMapContains`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다.

### public 인라인 멤버 내부에서 보호 멤버 접근 금지

> **이슈**: [KT-21178](https://youtrack.jetbrains.com/issue/KT-21178)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4는 public 인라인 멤버에서 보호(protected) 멤버에 대한 접근을 금지합니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 문제가 있는 경우 호출 시점에 경고 도입
> - `1.4`: 이 경고를 오류로 상향, `-XXLanguage:-ProhibitProtectedCallFromInline`을 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다.

### 암시적 리시버를 사용한 호출에 대한 계약(Contracts)

> **이슈**: [KT-28672](https://youtrack.jetbrains.com/issue/KT-28672)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: 계약(contracts)으로부터의 스마트 캐스트(smart casts)는 1.4에서 암시적 리시버(implicit receivers)를 사용한 호출에 대해 사용 가능해집니다.
> 
> **사용 중단 주기**: 
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-ContractsOnCallsWithImplicitReceiver`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다.

### 부동 소수점 숫자 비교의 일관성 없는 동작

> **이슈**: [KT-22723](https://youtrack.jetbrains.com/issue/KT-22723)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 Kotlin 컴파일러는 부동 소수점 숫자 비교에 IEEE 754 표준을 사용합니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-ProperIeee754Comparisons`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다.

### 제네릭 람다의 마지막 표현식에 스마트 캐스트 없음

> **이슈**: [KT-15020](https://youtrack.jetbrains.com/issue/KT-15020)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: 람다의 마지막 표현식에 대한 스마트 캐스트는 1.4부터 올바르게 적용됩니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 람다 인자의 순서에 의존하여 결과를 `Unit`으로 강제 변환하지 않음

> **이슈**: [KT-36045](https://youtrack.jetbrains.com/issue/KT-36045)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 람다 인자는 `Unit`으로의 암시적 강제 변환 없이 독립적으로 분석됩니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 원시 타입과 정수 리터럴 타입 간의 잘못된 공통 상위 타입으로 인해 불안정한 코드 발생

> **이슈**: [KT-35681](https://youtrack.jetbrains.com/issue/KT-35681)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 원시 `Comparable` 타입과 정수 리터럴 타입 간의 공통 상위 타입은 더 구체화됩니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 동일한 타입 변수가 다른 타입으로 인스턴스화되어 발생하는 타입 안전성 문제

> **이슈**: [KT-35679](https://youtrack.jetbrains.com/issue/KT-35679)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 Kotlin 컴파일러는 동일한 타입 변수를 다른 타입으로 인스턴스화하는 것을 금지합니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 교차 타입에 대한 부정확한 서브타이핑으로 인한 타입 안전성 문제

> **이슈**: [KT-22474](https://youtrack.jetbrains.com/issue/KT-22474)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4에서는 교차 타입(intersection types)에 대한 서브타이핑이 더 정확하게 작동하도록 개선됩니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 람다 내부의 빈 `when` 표현식에 타입 불일치 없음

> **이슈**: [KT-17995](https://youtrack.jetbrains.com/issue/KT-17995)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 빈 `when` 표현식이 람다의 마지막 표현식으로 사용될 경우 타입 불일치(type mismatch)가 발생합니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 가능한 반환 값 중 하나에 정수 리터럴이 있는 조기 반환 람다에 대해 `Any` 타입 추론

> **이슈**: [KT-20226](https://youtrack.jetbrains.com/issue/KT-20226)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 람다에서 반환되는 정수 타입은 조기 반환(early return)이 있는 경우 더 구체화됩니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 재귀 타입에 대한 스타 프로젝션의 적절한 캡처

> **이슈**: [KT-33012](https://youtrack.jetbrains.com/issue/KT-33012)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 재귀 타입에 대한 캡처가 더 정확하게 작동하여 더 많은 후보가 적용 가능해집니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 부적절한 타입과 유연한 타입 간의 공통 상위 타입 계산으로 인해 부정확한 결과 발생

> **이슈**: [KT-37054](https://youtrack.jetbrains.com/issue/KT-37054)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 유연한 타입 간의 공통 상위 타입이 런타임 오류로부터 보호하기 위해 더 구체화됩니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 널러블 타입 인자에 대한 캡처된 변환 부족으로 인한 타입 안전성 문제

> **이슈**: [KT-35487](https://youtrack.jetbrains.com/issue/KT-35487)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 캡처된 타입과 널러블 타입 간의 서브타이핑이 런타임 오류로부터 보호하기 위해 더 정확해집니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 비확인 캐스트 후 공변 타입에 대한 교차 타입 유지

> **이슈**: [KT-37280](https://youtrack.jetbrains.com/issue/KT-37280)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 공변 타입(covariant types)의 비확인 캐스트(unchecked cast)는 스마트 캐스트에 대해 비확인 캐스트의 타입이 아닌 교차 타입(intersection type)을 생성합니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### `this` 표현식 사용으로 인해 빌더 추론에서 타입 변수 누출

> **이슈**: [KT-32126](https://youtrack.jetbrains.com/issue/KT-32126)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 `sequence {}`와 같은 빌더 함수 내부에서 `this`를 사용하는 것은 다른 적절한 제약 조건이 없는 경우 금지됩니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 널러블 타입 인자를 가진 반공변 타입에 대한 잘못된 오버로드 분석

> **이슈**: [KT-31670](https://youtrack.jetbrains.com/issue/KT-31670)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 반공변 타입(contravariant types) 인자를 받는 함수(예: `In<T>` 및 `In<T?>`)의 두 오버로드가 타입의 널러블성만 다른 경우, 널러블 타입이 더 구체적인 것으로 간주됩니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 중첩되지 않은 재귀 제약 조건이 있는 빌더 추론

> **이슈**: [KT-34975](https://youtrack.jetbrains.com/issue/KT-34975)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 전달된 람다 내부에 재귀 제약 조건에 의존하는 타입이 있는 `sequence {}`와 같은 빌더 함수는 컴파일러 오류를 발생시킵니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### 조급한 타입 변수 고정으로 인한 모순된 제약 조건 시스템

> **이슈**: [KT-25175](https://youtrack.jetbrains.com/issue/KT-25175)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 특정 경우에 타입 추론이 덜 조급하게(less eagerly) 작동하여 모순되지 않는 제약 조건 시스템을 찾을 수 있습니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NewInference`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다. 참고로 이 플래그는 몇 가지 새로운 언어 기능도 비활성화합니다.

### `open` 함수에 `tailrec` 한정자 금지

> **이슈**: [KT-18541](https://youtrack.jetbrains.com/issue/KT-18541)
> 
> **구성 요소**: 코어 언어
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 함수는 `open`과 `tailrec` 한정자를 동시에 가질 수 없습니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: `open`과 `tailrec` 한정자를 함께 사용하는 함수에 경고 보고 (프로그레시브 모드(progressive mode)에서는 오류).
> - `>= 1.4`: 이 경고를 오류로 상향.

### 동반 객체 클래스 자체보다 `INSTANCE` 필드의 가시성이 더 높음

> **이슈**: [KT-11567](https://youtrack.jetbrains.com/issue/KT-11567)
> 
> **구성 요소**: Kotlin/JVM
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 동반 객체(companion object)가 private인 경우, 해당 `INSTANCE` 필드도 private이 됩니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 컴파일러가 사용 중단 플래그가 있는 `INSTANCE` 객체를 생성합니다.
> - `>= 1.4`: 동반 객체 `INSTANCE` 필드가 적절한 가시성을 가집니다.

### `return` 앞에 삽입된 외부 `finally` 블록이 `finally` 없는 내부 `try` 블록의 catch 구간에서 제외되지 않음

> **이슈**: [KT-31923](https://youtrack.jetbrains.com/issue/KT-31923)
> 
> **구성 요소**: Kotlin/JVM
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 중첩된 `try/catch` 블록에 대해 catch 구간이 올바르게 계산됩니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-ProperFinally`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다.

### 공변 및 제네릭 특수화 오버라이드에 대해 반환 타입 위치에서 인라인 클래스의 박싱된 버전 사용

> **이슈**: [KT-30419](https://youtrack.jetbrains.com/issue/KT-30419)
> 
> **구성 요소**: Kotlin/JVM
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 공변 및 제네릭 특수화 오버라이드(covariant and generic-specialized overrides)를 사용하는 함수는 인라인 클래스의 박싱된 값(boxed values)을 반환합니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경

### Kotlin 인터페이스 위임 시 JVM 바이트코드에 체크된 예외 선언 안 함

> **이슈**: [KT-35834](https://youtrack.jetbrains.com/issue/KT-35834)
> 
> **구성 요소**: Kotlin/JVM
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4는 Kotlin 인터페이스에 대한 인터페이스 위임 중 체크된 예외(checked exceptions)를 생성하지 않습니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-DoNotGenerateThrowsForDelegatedKotlinMembers`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다.

### 단일 `vararg` 매개변수를 가진 시그니처 다형성 호출 동작 변경 (인자를 다른 배열로 래핑하는 것을 방지)

> **이슈**: [KT-35469](https://youtrack.jetbrains.com/issue/KT-35469)
> 
> **구성 요소**: Kotlin/JVM
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4는 시그니처 다형성 호출(signature-polymorphic call)에서 인자를 다른 배열로 래핑하지 않습니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경

### `KClass`가 제네릭 매개변수로 사용될 때 애너테이션의 잘못된 제네릭 시그니처

> **이슈**: [KT-35207](https://youtrack.jetbrains.com/issue/KT-35207)
> 
> **구성 요소**: Kotlin/JVM
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4는 `KClass`가 제네릭 매개변수로 사용될 때 애너테이션의 잘못된 타입 매핑을 수정합니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경

### 시그니처 다형성 호출에서 스프레드 연산자 금지

> **이슈**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
> 
> **구성 요소**: Kotlin/JVM
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4는 시그니처 다형성 호출(signature-polymorphic calls)에서 스프레드 연산자(`*`) 사용을 금지합니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 시그니처 다형성 호출에서 스프레드 연산자 사용에 대한 경고 보고
> - `>= 1.5`: 이 경고를 오류로 상향, `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall`을 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다.

### 꼬리 재귀 최적화 함수의 기본값 초기화 순서 변경

> **이슈**: [KT-31540](https://youtrack.jetbrains.com/issue/KT-31540)
> 
> **구성 요소**: Kotlin/JVM
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 꼬리 재귀 함수(tail-recursive functions)의 초기화 순서는 일반 함수와 동일해집니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 문제가 있는 함수에 대해 선언 시점에 경고 보고
> - `>= 1.4`: 동작 변경, `-XXLanguage:-ProperComputationOrderOfTailrecDefaultParameters`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다.

### `const`가 아닌 `val`에 대해 `ConstantValue` 속성을 생성하지 않음

> **이슈**: [KT-16615](https://youtrack.jetbrains.com/issue/KT-16615)
> 
> **구성 요소**: Kotlin/JVM
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 컴파일러는 `const`가 아닌 `val`에 대해 `ConstantValue` 속성을 생성하지 않습니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: IntelliJ IDEA 인스펙션(inspection)을 통해 경고 보고
> - `>= 1.4`: 동작 변경, `-XXLanguage:-NoConstantValueAttributeForNonConstVals`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다.

### `open` 메서드의 `@JvmOverloads`에 대해 생성된 오버로드는 `final`이어야 합니다.

> **이슈**: [KT-33240](https://youtrack.jetbrains.com/issue/KT-33240)
> 
> **구성 요소**: Kotlin/JVM
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: `@JvmOverloads`가 있는 함수에 대한 오버로드는 `final`로 생성됩니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경, `-XXLanguage:-GenerateJvmOverloadsAsFinal`을 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다.

### `kotlin.Result`를 반환하는 람다가 이제 언박싱된 값 대신 박싱된 값을 반환합니다.

> **이슈**: [KT-39198](https://youtrack.jetbrains.com/issue/KT-39198)
> 
> **구성 요소**: Kotlin/JVM
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 `kotlin.Result` 타입 값을 반환하는 람다는 언박싱된 값 대신 박싱된 값(boxed value)을 반환합니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경

### 널 체크에서 발생하는 예외 통일

> **이슈**: [KT-22275](https://youtrack.jetbrains.com/issue/KT-22275)
> 
> **구성 요소**: Kotlin/JVM
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 모든 런타임 널 체크(null checks)는 `java.lang.NullPointerException`을 던집니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 런타임 널 체크가 `KotlinNullPointerException`, `IllegalStateException`, `IllegalArgumentException`, `TypeCastException`과 같은 다른 예외를 던집니다.
> - `>= 1.4`: 모든 런타임 널 체크가 `java.lang.NullPointerException`을 던집니다. `-Xno-unified-null-checks`를 사용하여 임시로 1.4 이전 동작으로 되돌릴 수 있습니다.

### 배열/리스트 연산 `contains`, `indexOf`, `lastIndexOf`에서 부동 소수점 값 비교: IEEE 754 또는 전체 순서

> **이슈**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
> 
> **구성 요소**: Kotlin 표준 라이브러리(JVM)
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: `Double/FloatArray.asList()`에서 반환되는 `List` 구현은 `contains`, `indexOf`, `lastIndexOf`를 구현하여 전체 순서 동등성(total order equality)을 사용합니다.
> 
> **사용 중단 주기**: 
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경

### 컬렉션 `min` 및 `max` 함수의 반환 타입을 점진적으로 널러블이 아닌 타입으로 변경

> **이슈**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
> 
> **구성 요소**: Kotlin 표준 라이브러리(JVM)
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: 컬렉션 `min` 및 `max` 함수의 반환 타입은 1.6에서 널러블이 아닌(non-nullable) 타입으로 변경됩니다.
> 
> **사용 중단 주기**:
> 
> - `1.4`: `...OrNull` 함수를 동의어로 도입하고 해당 API를 사용 중단 (이슈에서 자세한 내용 참조)
> - `1.5.x`: 해당 API의 사용 중단 수준을 오류로 상향
> - `>=1.6`: 해당 API를 널러블이 아닌 반환 타입으로 다시 도입

### `appendLine`을 위해 `appendln` 사용 중단

> **이슈**: [KT-38754](https://youtrack.jetbrains.com/issue/KT-38754)
> 
> **구성 요소**: Kotlin 표준 라이브러리(JVM)
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: `StringBuilder.appendln()`은 `StringBuilder.appendLine()`을 위해 사용 중단됩니다.
> 
> **사용 중단 주기**:
> 
> - `1.4`: `appendLine` 함수를 `appendln`의 대체 함수로 도입하고 `appendln` 사용 중단
> - `>=1.5`: 사용 중단 수준을 오류로 상향

### 부동 소수점 타입을 `Short` 및 `Byte`로 변환하는 기능 사용 중단

> **이슈**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
> 
> **구성 요소**: Kotlin 표준 라이브러리(JVM)
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 부동 소수점 타입을 `Short` 및 `Byte`로 변환하는 기능이 사용 중단됩니다.
> 
> **사용 중단 주기**:
> 
> - `1.4`: `Double.toShort()/toByte()` 및 `Float.toShort()/toByte()`를 사용 중단하고 대체 방법 제안
> - `>=1.5`: 사용 중단 수준을 오류로 상향

### `Regex.findAll`에서 잘못된 `startIndex`에 대해 조기 실패

> **이슈**: [KT-28356](https://youtrack.jetbrains.com/issue/KT-28356)
> 
> **구성 요소**: Kotlin 표준 라이브러리
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: Kotlin 1.4부터 `findAll`은 `startIndex`가 `findAll` 진입 시점의 입력 문자 시퀀스(input char sequence)의 유효한 위치 인덱스 범위 내에 있는지 확인하도록 개선되며, 그렇지 않은 경우 `IndexOutOfBoundsException`을 던집니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경

### 사용 중단된 `kotlin.coroutines.experimental` 제거

> **이슈**: [KT-36083](https://youtrack.jetbrains.com/issue/KT-36083)
> 
> **구성 요소**: Kotlin 표준 라이브러리
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 사용 중단된 `kotlin.coroutines.experimental` API가 표준 라이브러리에서 제거됩니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: `kotlin.coroutines.experimental`은 `ERROR` 수준으로 사용 중단됩니다.
> - `>= 1.4`: `kotlin.coroutines.experimental`은 표준 라이브러리에서 제거됩니다. JVM에서는 별도의 호환성 아티팩트가 제공됩니다 (이슈에서 자세한 내용 참조).

### 사용 중단된 `mod` 연산자 제거

> **이슈**: [KT-26654](https://youtrack.jetbrains.com/issue/KT-26654)
> 
> **구성 요소**: Kotlin 표준 라이브러리
> 
> **호환성 변경 유형**: 소스
> 
> **요약**: Kotlin 1.4부터 숫자 타입에 대한 `mod` 연산자가 표준 라이브러리에서 제거됩니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: `mod`는 `ERROR` 수준으로 사용 중단됩니다.
> - `>= 1.4`: `mod`는 표준 라이브러리에서 제거됩니다.

### `Throwable.addSuppressed` 멤버를 숨기고 대신 확장 함수 선호

> **이슈**: [KT-38777](https://youtrack.jetbrains.com/issue/KT-38777)
> 
> **구성 요소**: Kotlin 표준 라이브러리
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: 이제 `Throwable.addSuppressed()` 확장 함수가 `Throwable.addSuppressed()` 멤버 함수보다 선호됩니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이전 동작 (이슈에서 자세한 내용 참조)
> - `>= 1.4`: 동작 변경

### `capitalize`는 이중음자(digraphs)를 타이틀 케이스로 변환해야 합니다.

> **이슈**: [KT-38817](https://youtrack.jetbrains.com/issue/KT-38817)
> 
> **구성 요소**: Kotlin 표준 라이브러리
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: `String.capitalize()` 함수는 이제 [세르보-크로아티아어 가이 라틴 알파벳(Serbo-Croatian Gaj's Latin alphabet)](https://en.wikipedia.org/wiki/Gaj%27s_Latin_alphabet)의 이중음자를 타이틀 케이스(`ǅ` 대신 `Ǆ`)로 대문자화합니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 이중음자가 대문자(`Ǆ`)로 대문자화됩니다.
> - `>= 1.4`: 이중음자가 타이틀 케이스(`ǅ`)로 대문자화됩니다.

## 도구

### 구분 기호 문자가 포함된 컴파일러 인자는 Windows에서 이중 따옴표로 전달되어야 합니다.

> **이슈**: [KT-41309](https://youtrack.jetbrains.com/issue/KT-41309)
> 
> **구성 요소**: CLI
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: Windows에서 구분 기호 문자(공백, `=`, `;`, `,`)가 포함된 `kotlinc.bat` 인자는 이제 이중 따옴표(`"`)를 요구합니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 모든 컴파일러 인자가 따옴표 없이 전달됩니다.
> - `>= 1.4`: 구분 기호 문자(공백, `=`, `;`, `,`)가 포함된 컴파일러 인자는 이중 따옴표(`"`)를 요구합니다.

### KAPT: 프로퍼티에 대한 합성 `$annotations()` 메서드 이름이 변경되었습니다.

> **이슈**: [KT-36926](https://youtrack.jetbrains.com/issue/KT-36926)
> 
> **구성 요소**: KAPT
> 
> **호환성 변경 유형**: 동작
> 
> **요약**: KAPT가 프로퍼티에 대해 생성하는 합성 `$annotations()` 메서드 이름이 1.4에서 변경되었습니다.
> 
> **사용 중단 주기**:
> 
> - `< 1.4`: 프로퍼티에 대한 합성 `$annotations()` 메서드 이름은 `<propertyName>@annotations()` 템플릿을 따릅니다.
> - `>= 1.4`: 프로퍼티에 대한 합성 `$annotations()` 메서드 이름은 `get` 접두사를 포함합니다: `get<PropertyName>@annotations()`