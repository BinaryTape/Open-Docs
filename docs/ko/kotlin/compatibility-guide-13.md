[//]: # (title: Kotlin 1.3.x 호환성 가이드)

_[언어 현대성 유지](kotlin-evolution-principles.md)_ 및 _[편리한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 기본 원칙 중 하나입니다. 전자는 언어 발전을 방해하는 구성 요소는 제거되어야 한다고 말하며, 후자는 이러한 제거가 코드 마이그레이션을 가능한 한 원활하게 만들기 위해 미리 잘 전달되어야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서에서는 모든 변경 사항을 요약하여 Kotlin 1.2에서 Kotlin 1.3으로 마이그레이션하기 위한 완전한 참조를 제공합니다.

## 기본 용어

이 문서에서는 몇 가지 호환성 유형을 소개합니다:

- *소스*: 소스 비호환 변경은 (오류나 경고 없이) 잘 컴파일되던 코드가 더 이상 컴파일되지 않도록 합니다.
- *바이너리*: 두 바이너리 아티팩트가 서로 교환되어도 로딩 또는 링크 오류가 발생하지 않으면 바이너리 호환된다고 합니다.
- *동작*: 변경 사항 적용 전후에 동일한 프로그램이 다른 동작을 보인다면 해당 변경은 동작 비호환이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 적용된다는 점을 기억하십시오.
다른 언어(예: Java)의 관점에서 본 Kotlin 코드의 호환성은 이 문서의 범위에 포함되지 않습니다.

## 비호환 변경 사항

### `<clinit>` 호출과 관련된 생성자 인자의 평가 순서

> **Issue**: [KT-19532](https://youtrack.jetbrains.com/issue/KT-19532)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 동작
>
> **Short summary**: 클래스 초기화와 관련하여 평가 순서가 1.3에서 변경되었습니다.
>
> **Deprecation cycle**: 
>
> - <1.3: 이전 동작 (자세한 내용은 Issue 참조)
> - `>= 1.3`: 동작이 변경되었으며,
> `-Xnormalize-constructor-calls=disable` 플래그를 사용하여 임시로 1.3 이전 동작으로 되돌릴 수 있습니다. 이 플래그에 대한 지원은 다음 주요 릴리스에서 제거될 예정입니다.

### 어노테이션 생성자 파라미터에 누락된 게터 대상 어노테이션

> **Issue**: [KT-25287](https://youtrack.jetbrains.com/issue/KT-25287)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 동작
>
> **Short summary**: 어노테이션 생성자 파라미터에 대한 게터 대상 어노테이션이 1.3에서 클래스 파일에 올바르게 기록됩니다.
>
> **Deprecation cycle**: 
>
> - <1.3: 어노테이션 생성자 파라미터에 대한 게터 대상 어노테이션이 적용되지 않습니다.
> - `>=1.3`: 어노테이션 생성자 파라미터에 대한 게터 대상 어노테이션이 올바르게 적용되고 생성된 코드에 기록됩니다.

### 클래스 생성자의 `@get:` 어노테이션에 누락된 오류

> **Issue**: [KT-19628](https://youtrack.jetbrains.com/issue/KT-19628)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: 게터 대상 어노테이션의 오류가 1.3에서 올바르게 보고됩니다.
>
> **Deprecation cycle**:
>
> - <1.2: 게터 대상 어노테이션의 컴파일 오류가 보고되지 않아, 잘못된 코드가 정상적으로 컴파일되었습니다.
> - 1.2.x: 오류는 도구에서만 보고되었으며, 컴파일러는 여전히 경고 없이 해당 코드를 컴파일했습니다.
> - `>=1.3`: 컴파일러에서도 오류가 보고되어, 오류가 있는 코드가 거부됩니다.

### @NotNull로 어노테이션된 Java 타입 접근 시 Nullability 검증

> **Issue**: [KT-20830](https://youtrack.jetbrains.com/issue/KT-20830)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 동작
>
> **Short summary**: 널이 아님(not-null) 어노테이션으로 어노테이션된 Java 타입에 대한 Nullability 검증이 더 적극적으로 생성되어, `null`을 전달하는 코드가 더 빨리 실패합니다.
>
> **Deprecation cycle**:
>
> - <1.3: 컴파일러가 타입 추론(type inference)이 관련된 경우 이러한 검증을 놓칠 수 있어, 바이너리 컴파일 시 잠재적인 `null` 전파를 허용했습니다 (자세한 내용은 Issue 참조).
> - `>=1.3`: 컴파일러가 누락된 검증을 생성합니다. 이로 인해 (오류로 인해) `null`을 전달하던 코드가 더 빨리 실패할 수 있습니다.
`-XXLanguage:-StrictJavaNullabilityAssertions` 플래그를 사용하여 임시로 1.3 이전 동작으로 되돌릴 수 있습니다. 이 플래그에 대한 지원은 다음 주요 릴리스에서 제거될 예정입니다.

### 열거형 멤버에 대한 안전하지 않은 스마트 캐스트

> **Issue**: [KT-20772](https://youtrack.jetbrains.com/issue/KT-20772)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: 하나의 열거형 엔트리 멤버에 대한 스마트 캐스트는 해당 열거형 엔트리에만 올바르게 적용됩니다.
>
> **Deprecation cycle**:
>
> - <1.3: 하나의 열거형 엔트리 멤버에 대한 스마트 캐스트가 다른 열거형 엔트리의 동일한 멤버에 대해 안전하지 않은 스마트 캐스트로 이어질 수 있었습니다.
> - `>=1.3`: 스마트 캐스트는 하나의 열거형 엔트리 멤버에만 올바르게 적용됩니다.
`-XXLanguage:-SoundSmartcastForEnumEntries` 플래그는 임시로 이전 동작으로 되돌립니다. 이 플래그에 대한 지원은 다음 주요 릴리스에서 제거될 예정입니다.

### 게터에서 `val` 백킹 필드 재할당

> **Issue**: [KT-16681](https://youtrack.jetbrains.com/issue/KT-16681)
>
> **Components**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: 이제 게터에서 `val` 프로퍼티의 백킹 필드 재할당이 금지됩니다.
>
> **Deprecation cycle**:
>
> - <1.2: Kotlin 컴파일러는 게터에서 `val`의 백킹 필드를 수정하는 것을 허용했습니다. 이는 Kotlin의 의미 체계를 위반할 뿐만 아니라, `final` 필드를 재할당하는 비정상적인 JVM 바이트코드를 생성합니다.
> - 1.2.X: `val`의 백킹 필드를 재할당하는 코드에 대해 사용 중단 경고가 보고됩니다.
> - `>=1.3`: 사용 중단 경고가 오류로 상향 조정됩니다.

### 반복되는 for-loop 이전에 배열 캡처

> **Issue**: [KT-21354](https://youtrack.jetbrains.com/issue/KT-21354)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 소스
>
> **Short summary**: for-loop 범위 내의 표현식이 루프 본문에서 업데이트되는 지역 변수인 경우, 이 변경은 루프 실행에 영향을 미칩니다. 이는 범위, 문자 시퀀스 및 컬렉션과 같은 다른 컨테이너를 반복하는 것과 일치하지 않습니다.
>
> **Deprecation cycle**:
>
> - <1.2: 설명된 코드 패턴은 정상적으로 컴파일되지만, 지역 변수에 대한 업데이트가 루프 실행에 영향을 미칩니다.
> - 1.2.X: for-loop의 범위 표현식이 루프 본문에서 할당되는 배열 타입의 지역 변수인 경우 사용 중단 경고가 보고됩니다.
> - 1.3: 이러한 경우 동작을 다른 컨테이너와 일관되게 변경합니다.

### 열거형 엔트리 내 중첩된 분류자

> **Issue**: [KT-16310](https://youtrack.jetbrains.com/issue/KT-16310)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.3부터 열거형 엔트리 내 중첩된 분류자(클래스, 객체, 인터페이스, 어노테이션 클래스, 열거형 클래스)가 금지됩니다.
>
> **Deprecation cycle**:
>
> - <1.2: 열거형 엔트리 내 중첩된 분류자는 정상적으로 컴파일되지만 런타임에 예외가 발생할 수 있습니다.
> - 1.2.X: 중첩된 분류자에 대해 사용 중단 경고가 보고됩니다.
> - `>=1.3`: 사용 중단 경고가 오류로 상향 조정됩니다.

### `copy` 재정의하는 데이터 클래스

> **Issue**: [KT-19618](https://youtrack.jetbrains.com/issue/KT-19618)
>
> **Components**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.3부터 데이터 클래스가 `copy()`를 재정의하는 것이 금지됩니다.
>
> **Deprecation cycle**:
>
> - <1.2: `copy()`를 재정의하는 데이터 클래스는 정상적으로 컴파일되지만 런타임에 실패하거나 이상한 동작을 보일 수 있습니다.
> - 1.2.X: `copy()`를 재정의하는 데이터 클래스에 대해 사용 중단 경고가 보고됩니다.
> - `>=1.3`: 사용 중단 경고가 오류로 상향 조정됩니다.

### 외부 클래스에서 제네릭 파라미터를 캡처하는 `Throwable`을 상속받는 내부 클래스

> **Issue**: [KT-17981](https://youtrack.jetbrains.com/issue/KT-17981)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.3부터 내부 클래스가 `Throwable`을 상속받는 것이 허용되지 않습니다.
>
> **Deprecation cycle**:
>
> - <1.2: `Throwable`을 상속받는 내부 클래스는 정상적으로 컴파일됩니다. 이러한 내부 클래스가 제네릭 파라미터를 캡처하는 경우, 런타임에 실패하는 이상한 코드 패턴으로 이어질 수 있습니다.
> - 1.2.X: `Throwable`을 상속받는 내부 클래스에 대해 사용 중단 경고가 보고됩니다.
> - `>=1.3`: 사용 중단 경고가 오류로 상향 조정됩니다.

### 동반 객체를 포함하는 복잡한 클래스 계층 구조에 대한 가시성 규칙

> **Issues**: [KT-21515](https://youtrack.jetbrains.com/issue/KT-21515), [KT-25333](https://youtrack.jetbrains.com/issue/KT-25333)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.3부터 동반 객체 및 중첩된 분류자를 포함하는 복잡한 클래스 계층 구조에 대해 짧은 이름(short name)에 의한 가시성 규칙이 더 엄격해집니다.
>
> **Deprecation cycle**:
>
> - <1.2: 이전 가시성 규칙 (자세한 내용은 Issue 참조)
> - 1.2.X: 더 이상 접근할 수 없는 짧은 이름에 대해 사용 중단 경고가 보고됩니다. 도구는 전체 이름을 추가하여 자동 마이그레이션을 제안합니다.
> - `>=1.3`: 사용 중단 경고가 오류로 상향 조정됩니다. 해당 코드는 전체 한정자(full qualifier) 또는 명시적 임포트를 추가해야 합니다.

### 비상수 가변 인자 어노테이션 파라미터

> **Issue**: [KT-23153](https://youtrack.jetbrains.com/issue/KT-23153)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.3부터 비상수 값을 가변 인자(vararg) 어노테이션 파라미터로 설정하는 것이 금지됩니다.
>
> **Deprecation cycle**:
>
> - <1.2: 컴파일러는 가변 인자(vararg) 어노테이션 파라미터에 비상수 값을 전달하는 것을 허용하지만, 바이트코드 생성 중에 해당 값을 실제로 삭제하여 명확하지 않은 동작으로 이어집니다.
> - 1.2.X: 이러한 코드 패턴에 대해 사용 중단 경고가 보고됩니다.
> - `>=1.3`: 사용 중단 경고가 오류로 상향 조정됩니다.

### 지역 어노테이션 클래스

> **Issue**: [KT-23277](https://youtrack.jetbrains.com/issue/KT-23277)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.3부터 지역 어노테이션 클래스가 지원되지 않습니다.
>
> **Deprecation cycle**:
>
> - <1.2: 컴파일러는 지역 어노테이션 클래스를 정상적으로 컴파일했습니다.
> - 1.2.X: 지역 어노테이션 클래스에 대해 사용 중단 경고가 보고됩니다.
> - `>=1.3`: 사용 중단 경고가 오류로 상향 조정됩니다.

### 지역 위임 프로퍼티에 대한 스마트 캐스트

> **Issue**: [KT-22517](https://youtrack.jetbrains.com/issue/KT-22517)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.3부터 지역 위임 프로퍼티에 대한 스마트 캐스트가 허용되지 않습니다.
>
> **Deprecation cycle**:
>
> - <1.2: 컴파일러는 지역 위임 프로퍼티에 대한 스마트 캐스트를 허용했으며, 이는 오동작하는 위임(delegate)의 경우 안전하지 않은 스마트 캐스트로 이어질 수 있었습니다.
> - 1.2.X: 지역 위임 프로퍼티에 대한 스마트 캐스트는 사용 중단(deprecated)으로 보고됩니다 (컴파일러가 경고를 발생시킵니다).
> - `>=1.3`: 사용 중단 경고가 오류로 상향 조정됩니다.

### `mod` 연산자 규칙

> **Issues**: [KT-24197](https://youtrack.jetbrains.com/issue/KT-24197)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.3부터 `mod` 연산자 선언이 금지되며, 이러한 선언으로 해석되는 호출도 금지됩니다.
>
> **Deprecation cycle**:
>
> - 1.1.X, 1.2.X: `operator mod` 선언 및 해당 선언으로 해석되는 호출에 대해 경고를 보고합니다.
> - 1.3.X: 경고가 오류로 상향 조정되지만, `operator mod` 선언으로 해석되는 것은 여전히 허용됩니다.
> - 1.4.X: 더 이상 `operator mod`에 대한 호출을 해석하지 않습니다.

### 단일 요소를 이름 지정 형태로 가변 인자에 전달

> **Issues**: [KT-20588](https://youtrack.jetbrains.com/issue/KT-20588), [KT-20589](https://youtrack.jetbrains.com/issue/KT-20589). 참조: [KT-20171](https://youtrack.jetbrains.com/issue/KT-20171)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.3에서는 단일 요소를 가변 인자에 할당하는 것이 사용 중단되었으며, 연속적인 스프레드(spread) 및 배열 생성으로 대체되어야 합니다.
>
> **Deprecation cycle**:
>
> - <1.2: 이름 지정 형태로 가변 인자에 단일 값 요소를 할당하는 것은 정상적으로 컴파일되며, 배열에 *단일* 요소를 할당하는 것으로 처리되어 배열을 가변 인자에 할당할 때 명확하지 않은 동작을 야기합니다.
> - 1.2.X: 이러한 할당에 대해 사용 중단 경고가 보고되며, 사용자에게 연속적인 스프레드(spread) 및 배열 생성으로 전환하도록 제안됩니다.
> - 1.3.X: 경고가 오류로 상향 조정됩니다.
> - `>= 1.4`: 단일 요소를 가변 인자에 할당하는 의미 체계를 변경하여, 배열 할당이 배열의 스프레드(spread) 할당과 동일하게 만듭니다.

### 대상 `EXPRESSION`을 가진 어노테이션의 보존(Retention)

> **Issue**: [KT-13762](https://youtrack.jetbrains.com/issue/KT-13762)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.3부터 대상이 `EXPRESSION`인 어노테이션에는 `SOURCE` 보존(retention)만 허용됩니다.
>
> **Deprecation cycle**:
>
> - <1.2: 대상이 `EXPRESSION`이고 `SOURCE` 외의 보존(retention)을 가진 어노테이션은 허용되었지만, 사용 시점에서 묵묵히 무시되었습니다.
> - 1.2.X: 이러한 어노테이션 선언에 대해 사용 중단 경고가 보고됩니다.
> - `>=1.3`: 경고가 오류로 상향 조정됩니다.

### 대상 `PARAMETER`를 가진 어노테이션은 파라미터의 타입에 적용할 수 없습니다.

> **Issue**: [KT-9580](https://youtrack.jetbrains.com/issue/KT-9580)
>
> **Component**: 코어 언어
>
> **Incompatible change type**: 소스
>
> **Short summary**: Kotlin 1.3부터 대상이 `PARAMETER`인 어노테이션이 파라미터의 타입에 적용될 때 잘못된 어노테이션 대상에 대한 오류가 올바르게 보고됩니다.
>
> **Deprecation cycle**:
>
> - <1.2: 위에서 언급된 코드 패턴은 정상적으로 컴파일되었습니다. 어노테이션은 묵묵히 무시되었으며 바이트코드에는 존재하지 않았습니다.
> - 1.2.X: 이러한 사용에 대해 사용 중단 경고가 보고됩니다.
> - `>=1.3`: 경고가 오류로 상향 조정됩니다.

### `Array.copyOfRange`는 반환된 배열을 확장하는 대신 인덱스가 범위를 벗어나면 예외를 발생시킵니다.

> **Issue**: [KT-19489](https://youtrack.jetbrains.com/issue/KT-19489)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 동작
>
> **Short summary**: Kotlin 1.3부터 복사될 범위의 독점적 끝을 나타내는 `Array.copyOfRange`의 `toIndex` 인자가 배열 크기보다 크지 않도록 하며, 크다면 `IllegalArgumentException`을 발생시킵니다.
>
> **Deprecation cycle**:
>
> - <1.3: `Array.copyOfRange` 호출에서 `toIndex`가 배열 크기보다 큰 경우, 범위 내의 누락된 요소는 `null`로 채워져 Kotlin 타입 시스템의 건전성(soundness)을 위반합니다.
> - `>=1.3`: `toIndex`가 배열 범위 내에 있는지 확인하고, 그렇지 않다면 예외를 발생시킵니다.

### Int.MIN_VALUE 및 Long.MIN_VALUE 단계를 가진 Int 및 Long의 Progression은 금지되며 인스턴스화될 수 없습니다.

> **Issue**: [KT-17176](https://youtrack.jetbrains.com/issue/KT-17176)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 동작
>
> **Short summary**: Kotlin 1.3부터 정수 Progression의 단계 값으로 해당 정수 타입(`Long` 또는 `Int`)의 최소 음수 값을 금지하여, `IntProgression.fromClosedRange(0, 1, step = Int.MIN_VALUE)` 호출 시 `IllegalArgumentException`이 발생하도록 합니다.
>
> **Deprecation cycle**:
>
> - <1.3: `Int.MIN_VALUE` 단계를 가진 `IntProgression`을 생성하는 것이 가능했으며, 이는 `[0, -2147483648]`이라는 두 값을 생성하여 명확하지 않은 동작을 보였습니다.
> - `>=1.3`: 단계가 해당 정수 타입의 최소 음수 값인 경우 `IllegalArgumentException`을 발생시킵니다.

### 매우 긴 시퀀스 작업 시 인덱스 오버플로 검사

> **Issue**: [KT-16097](https://youtrack.jetbrains.com/issue/KT-16097)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 동작
>
> **Short summary**: Kotlin 1.3부터 `index`, `count` 및 유사한 메서드가 긴 시퀀스에 대해 오버플로되지 않도록 합니다. 영향을 받는 전체 메서드 목록은 Issue를 참조하십시오.
>
> **Deprecation cycle**:
>
> - <1.3: 매우 긴 시퀀스에서 이러한 메서드를 호출하면 정수 오버플로로 인해 음수 결과가 발생할 수 있었습니다.
> - `>=1.3`: 이러한 메서드에서 오버플로를 감지하고 즉시 예외를 발생시킵니다.

### 플랫폼 전반에 걸쳐 빈 일치 정규식 결과로 분할(split) 통합

> **Issue**: [KT-21049](https://youtrack.jetbrains.com/issue/KT-21049)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 동작
>
> **Short summary**: Kotlin 1.3부터 모든 플랫폼에서 빈 일치 정규식에 의한 `split` 메서드의 동작을 통합합니다.
>
> **Deprecation cycle**:
>
> - <1.3: 설명된 호출의 동작은 JS, JRE 6, JRE 7과 JRE 8+를 비교할 때 달랐습니다.
> - `>=1.3`: 플랫폼 전반에 걸쳐 동작을 통합합니다.

### 컴파일러 배포에서 사용 중단된 아티팩트 중단

> **Issue**: [KT-23799](https://youtrack.jetbrains.com/issue/KT-23799)
>
> **Component**: 기타
>
> **Incompatible change type**: 바이너리
>
> **Short summary**: Kotlin 1.3은 다음 사용 중단된 바이너리 아티팩트를 중단합니다:
> - `kotlin-runtime`: 대신 `kotlin-stdlib`을 사용하십시오.
> - `kotlin-stdlib-jre7/8`: 대신 `kotlin-stdlib-jdk7/8`을 사용하십시오.
> - 컴파일러 배포의 `kotlin-jslib`: 대신 `kotlin-stdlib-js`를 사용하십시오.
>
> **Deprecation cycle**:
>
> - 1.2.X: 아티팩트가 사용 중단으로 표시되었으며, 컴파일러는 해당 아티팩트 사용에 대해 경고를 보고했습니다.
> - `>=1.3`: 아티팩트가 중단됩니다.

### 표준 라이브러리(stdlib) 내 어노테이션

> **Issue**: [KT-21784](https://youtrack.jetbrains.com/issue/KT-21784)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 바이너리
>
> **Short summary**: Kotlin 1.3은 `org.jetbrains.annotations` 패키지의 어노테이션을 표준 라이브러리(stdlib)에서 제거하고 컴파일러와 함께 제공되는 별도의 아티팩트인 `annotations-13.0.jar` 및 `mutability-annotations-compat.jar`로 이동합니다.
>
> **Deprecation cycle**:
>
> - <1.3: 어노테이션은 표준 라이브러리(stdlib) 아티팩트와 함께 제공되었습니다.
> - `>=1.3`: 어노테이션은 별도의 아티팩트로 제공됩니다.