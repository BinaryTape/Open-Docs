---
title: "Kotlin 1.3 호환성 가이드"
---
_[최신 언어 유지](kotlin-evolution-principles)_ 및 _[편리한 업데이트](kotlin-evolution-principles)_는 Kotlin 언어 설계의 기본 원칙 중 일부입니다. 전자는 언어 진화를 방해하는 구조는 제거되어야 한다고 말하며, 후자는 이러한 제거가 코드 마이그레이션을 최대한 원활하게 만들기 위해 사전에 충분히 전달되어야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서는 Kotlin 1.2에서 Kotlin 1.3으로의 마이그레이션을 위한 완전한 참조를 제공하면서 모든 변경 사항을 요약합니다.

## 기본 용어

이 문서에서는 여러 종류의 호환성을 소개합니다.

- *Source*: source-incompatible 변경은 (오류나 경고 없이) 정상적으로 컴파일되던 코드가 더 이상 컴파일되지 않도록 합니다.
- *Binary*: 두 개의 바이너리 아티팩트가 서로 교환해도 로딩 또는 링키지 오류가 발생하지 않으면 바이너리 호환이 된다고 합니다.
- *Behavioral*: 변경 사항을 적용하기 전후에 동일한 프로그램이 다른 동작을 보이면 behavioral-incompatible 변경이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 제공된다는 점을 기억하십시오. 다른 언어 관점(예: Java)에서 본 Kotlin 코드의 호환성은 이 문서의 범위를 벗어납니다.

## 호환되지 않는 변경 사항

### &lt;clinit&gt; 호출 관련 생성자 인수의 평가 순서

> **Issue**: [KT-19532](https://youtrack.jetbrains.com/issue/KT-19532)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 클래스 초기화와 관련된 평가 순서가 1.3에서 변경되었습니다.
>
> **Deprecation cycle**: 
>
> - &lt;1.3: 이전 동작 (문제에 대한 자세한 내용 참조)
> - &gt;= 1.3: 동작 변경됨.
> `-Xnormalize-constructor-calls=disable`을 사용하여 일시적으로 1.3 이전 동작으로 되돌릴 수 있습니다. 이 플래그에 대한 지원은 다음 주요 릴리스에서 제거될 예정입니다.

### 어노테이션 생성자 파라미터에 getter-targeted 어노테이션이 누락됨

> **Issue**: [KT-25287](https://youtrack.jetbrains.com/issue/KT-25287)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 어노테이션 생성자 파라미터에 대한 getter-target 어노테이션이 1.3에서 class 파일에 올바르게 작성됩니다.
>
> **Deprecation cycle**: 
>
> - &lt;1.3: 어노테이션 생성자 파라미터에 대한 getter-target 어노테이션이 적용되지 않습니다.
> - &gt;=1.3: 어노테이션 생성자 파라미터에 대한 getter-target 어노테이션이 올바르게 적용되고 생성된 코드에 작성됩니다.

### 클래스 생성자의 @get: 어노테이션에서 오류가 누락됨

> **Issue**: [KT-19628](https://youtrack.jetbrains.com/issue/KT-19628)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: getter-target 어노테이션의 오류가 1.3에서 올바르게 보고됩니다.
>
> **Deprecation cycle**:
>
> - &lt;1.2: getter-target 어노테이션의 컴파일 오류가 보고되지 않아 잘못된 코드가 정상적으로 컴파일되었습니다.
> - 1.2.x: 오류는 도구에 의해서만 보고되며, 컴파일러는 여전히 경고 없이 해당 코드를 컴파일합니다.
> - &gt;=1.3: 컴파일러에서도 오류를 보고하여 잘못된 코드가 거부됩니다.

### @NotNull로 어노테이션된 Java 타입에 접근 시 Nullability assertions

> **Issue**: [KT-20830](https://youtrack.jetbrains.com/issue/KT-20830)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: not-null 어노테이션으로 어노테이션된 Java 타입에 대한 nullability assertions가 더 적극적으로 생성되어 여기에 `null`을 전달하는 코드가 더 빨리 실패합니다.
>
> **Deprecation cycle**:
>
> - &lt;1.3: 타입 추론이 관련된 경우 컴파일러가 이러한 assertions를 놓쳐 컴파일 중에 잠재적인 `null` 전파를 허용할 수 있습니다 (자세한 내용은 이슈 참조).
> - &gt;=1.3: 컴파일러는 누락된 assertions를 생성합니다. 이로 인해 (잘못되게) `null`을 전달하는 코드가 더 빨리 실패할 수 있습니다.
>  `-XXLanguage:-StrictJavaNullabilityAssertions`을 사용하여 일시적으로 1.3 이전 동작으로 되돌릴 수 있습니다. 이 플래그에 대한 지원은 다음 주요 릴리스에서 제거될 예정입니다.

### enum 멤버에 대한 잘못된 스마트 캐스트

> **Issue**: [KT-20772](https://youtrack.jetbrains.com/issue/KT-20772)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: 하나의 enum 항목의 멤버에 대한 스마트 캐스트는 이 enum 항목에만 올바르게 적용됩니다.
>
> **Deprecation cycle**:
>
> - &lt;1.3: 하나의 enum 항목의 멤버에 대한 스마트 캐스트는 다른 enum 항목의 동일한 멤버에 대한 잘못된 스마트 캐스트로 이어질 수 있습니다.
> - &gt;=1.3: 스마트 캐스트는 하나의 enum 항목의 멤버에만 올바르게 적용됩니다.
> `-XXLanguage:-SoundSmartcastForEnumEntries`는 이전 동작을 일시적으로 반환합니다. 이 플래그에 대한 지원은 다음 주요 릴리스에서 제거될 예정입니다.

### getter의 val backing field 재할당

> **Issue**: [KT-16681](https://youtrack.jetbrains.com/issue/KT-16681)
>
> **Components**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: getter에서 `val` 속성의 backing field 재할당이 이제 금지됩니다.
>
> **Deprecation cycle**:
>
> - &lt;1.2: Kotlin 컴파일러는 getter에서 `val`의 backing field를 수정할 수 있도록 허용했습니다. 이는 Kotlin 의미 체계를 위반할 뿐만 아니라 `final` 필드를 재할당하는 잘못된 JVM 바이트 코드를 생성합니다.
> - 1.2.X: `val`의 backing field를 재할당하는 코드에 대해 deprecation 경고가 보고됩니다.
> - &gt;=1.3: deprecation 경고가 오류로 승격됩니다.

### 반복되는 for-loop 전에 Array 캡처

> **Issue**: [KT-21354](https://youtrack.jetbrains.com/issue/KT-21354)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: Source
>
> **Short summary**: for-loop 범위의 표현식이 루프 본문에서 업데이트된 지역 변수인 경우 이 변경 사항은 루프 실행에 영향을 줍니다. 이는 범위, 문자 시퀀스 및 컬렉션과 같은 다른 컨테이너를 반복하는 것과 일치하지 않습니다.
>
> **Deprecation cycle**:
> 
> - &lt;1.2: 설명된 코드 패턴은 정상적으로 컴파일되지만 지역 변수 업데이트는 루프 실행에 영향을 미칩니다.
> - 1.2.X: for-loop의 범위 표현식이 루프 본문에서 할당된 array 타입의 지역 변수인 경우 deprecation 경고가 보고됩니다.
> - 1.3: 이러한 경우의 동작을 다른 컨테이너와 일관되게 변경합니다.

### enum 항목의 중첩된 분류자

> **Issue**: [KT-16310](https://youtrack.jetbrains.com/issue/KT-16310)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3부터 enum 항목의 중첩된 분류자 (클래스, 객체, 인터페이스, 어노테이션 클래스, enum 클래스)는 금지됩니다.
>
> **Deprecation cycle**:
>
> - &lt;1.2: enum 항목의 중첩된 분류자는 정상적으로 컴파일되지만 런타임에 예외가 발생할 수 있습니다.
> - 1.2.X: 중첩된 분류자에 대한 deprecation 경고가 보고됩니다.
> - &gt;=1.3: deprecation 경고가 오류로 승격됩니다.

### Data class copy 오버라이드

> **Issue**: [KT-19618](https://youtrack.jetbrains.com/issue/KT-19618)
>
> **Components**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3부터 data class는 `copy()`를 오버라이드하는 것이 금지됩니다.
>
> **Deprecation cycle**:
>
> - &lt;1.2: `copy()`를 오버라이드하는 data class는 정상적으로 컴파일되지만 런타임에 실패하거나 이상한 동작을 노출할 수 있습니다.
> - 1.2.X: `copy()`를 오버라이드하는 data class에 대한 deprecation 경고가 보고됩니다.
> - &gt;=1.3: deprecation 경고가 오류로 승격됩니다.

### 외부 클래스에서 제네릭 파라미터를 캡처하는 Throwable을 상속하는 Inner 클래스

> **Issue**: [KT-17981](https://youtrack.jetbrains.com/issue/KT-17981)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3부터 inner 클래스는 `Throwable`을 상속할 수 없습니다.
>
> **Deprecation cycle**:
>
> - &lt;1.2: `Throwable`을 상속하는 inner 클래스는 정상적으로 컴파일됩니다. 이러한 inner 클래스가 제네릭 파라미터를 캡처하는 경우 런타임에 실패하는 이상한 코드 패턴으로 이어질 수 있습니다.
> - 1.2.X: `Throwable`을 상속하는 inner 클래스에 대한 deprecation 경고가 보고됩니다.
> - &gt;=1.3: deprecation 경고가 오류로 승격됩니다.

### Companion 객체를 포함하는 복잡한 클래스 계층 구조와 관련된 가시성 규칙

> **Issues**: [KT-21515](https://youtrack.jetbrains.com/issue/KT-21515), [KT-25333](https://youtrack.jetbrains.com/issue/KT-25333)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3부터 companion 객체 및 중첩된 분류자를 포함하는 복잡한 클래스 계층 구조에 대한 짧은 이름으로 된 가시성 규칙이 더 엄격해집니다.
>
> **Deprecation cycle**:
>
> - &lt;1.2: 이전 가시성 규칙 (자세한 내용은 이슈 참조)
> - 1.2.X: 더 이상 액세스할 수 없는 짧은 이름에 대한 deprecation 경고가 보고됩니다. 도구는 전체 이름을 추가하여 자동 마이그레이션을 제안합니다.
> - &gt;=1.3: deprecation 경고가 오류로 승격됩니다. 문제가 되는 코드는 전체 한정자 또는 명시적 import를 추가해야 합니다.

### 상수가 아닌 vararg 어노테이션 파라미터

> **Issue**: [KT-23153](https://youtrack.jetbrains.com/issue/KT-23153)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3부터 상수 값이 아닌 값을 vararg 어노테이션 파라미터로 설정하는 것은 금지됩니다.
>
> **Deprecation cycle**:
>
> - &lt;1.2: 컴파일러는 vararg 어노테이션 파라미터에 대해 상수 값이 아닌 값을 전달할 수 있지만 실제로 바이트 코드 생성 중에 해당 값을 삭제하여 명확하지 않은 동작을 유발합니다.
> - 1.2.X: 이러한 코드 패턴에 대한 deprecation 경고가 보고됩니다.
> - &gt;=1.3: deprecation 경고가 오류로 승격됩니다.

### 지역 어노테이션 클래스

> **Issue**: [KT-23277](https://youtrack.jetbrains.com/issue/KT-23277)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3부터 지역 어노테이션 클래스는 지원되지 않습니다.
>
> **Deprecation cycle**:
>
> - &lt;1.2: 컴파일러는 지역 어노테이션 클래스를 정상적으로 컴파일했습니다.
> - 1.2.X: 지역 어노테이션 클래스에 대한 deprecation 경고가 보고됩니다.
> - &gt;=1.3: deprecation 경고가 오류로 승격됩니다.

### 지역 delegated 속성에 대한 스마트 캐스트

> **Issue**: [KT-22517](https://youtrack.jetbrains.com/issue/KT-22517)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3부터 지역 delegated 속성에 대한 스마트 캐스트는 허용되지 않습니다.
>
> **Deprecation cycle**:
>
> - &lt;1.2: 컴파일러는 지역 delegated 속성을 스마트 캐스트할 수 있도록 허용했는데, 이는 잘못된 delegate의 경우 잘못된 스마트 캐스트로 이어질 수 있습니다.
> - 1.2.X: 지역 delegated 속성에 대한 스마트 캐스트는 더 이상 사용되지 않는 것으로 보고됩니다 (컴파일러는 경고를 표시합니다).
> - &gt;=1.3: deprecation 경고가 오류로 승격됩니다.

### mod 연산자 규칙

> **Issues**: [KT-24197](https://youtrack.jetbrains.com/issue/KT-24197)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3부터 `mod` 연산자 선언 및 이러한 선언으로 확인되는 호출은 금지됩니다.
>
> **Deprecation cycle**:
>
> - 1.1.X, 1.2.X: `operator mod` 선언 및 해당 선언으로 확인되는 호출에 대한 경고를 보고합니다.
> - 1.3.X: 경고를 오류로 승격하지만 여전히 `operator mod` 선언으로 확인될 수 있도록 허용합니다.
> - 1.4.X: 더 이상 `operator mod`에 대한 호출을 확인하지 않습니다.

### 이름 지정된 형식으로 vararg에 단일 요소 전달

> **Issues**: [KT-20588](https://youtrack.jetbrains.com/issue/KT-20588), [KT-20589](https://youtrack.jetbrains.com/issue/KT-20589). [KT-20171](https://youtrack.jetbrains.com/issue/KT-20171) 참조
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3에서 vararg에 단일 요소를 할당하는 것은 더 이상 사용되지 않으며 연속적인 spread 및 array 구성으로 대체해야 합니다.
>
> **Deprecation cycle**:
>
> - &lt;1.2: 이름 지정된 형식으로 vararg에 하나의 값 요소를 할당하는 것은 정상적으로 컴파일되며 array에 *단일* 요소를 할당하는 것으로 처리되어 array를 vararg에 할당할 때 명확하지 않은 동작을 유발합니다.
> - 1.2.X: 이러한 할당에 대한 deprecation 경고가 보고되고 사용자는 연속적인 spread 및 array 구성으로 전환하도록 제안됩니다.
> - 1.3.X: 경고가 오류로 승격됩니다.
> - &gt;= 1.4: vararg에 단일 요소를 할당하는 의미 체계를 변경하여 array의 할당을 array의 spread 할당과 동일하게 만듭니다.

### 대상 EXPRESSION이 있는 어노테이션의 보존

> **Issue**: [KT-13762](https://youtrack.jetbrains.com/issue/KT-13762)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3부터 대상 `EXPRESSION`이 있는 어노테이션에는 `SOURCE` 보존만 허용됩니다.
>
> **Deprecation cycle**:
>
> - &lt;1.2: 대상 `EXPRESSION`과 `SOURCE`가 아닌 보존이 있는 어노테이션은 허용되지만 사용 위치에서 자동으로 무시됩니다.
> - 1.2.X: 이러한 어노테이션 선언에 대한 deprecation 경고가 보고됩니다.
> - &gt;=1.3: 경고가 오류로 승격됩니다.

### 대상 PARAMETER가 있는 어노테이션은 파라미터 타입에 적용할 수 없습니다.

> **Issue**: [KT-9580](https://youtrack.jetbrains.com/issue/KT-9580)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: Kotlin 1.3부터 대상 `PARAMETER`가 있는 어노테이션이 파라미터 타입에 적용될 때 잘못된 어노테이션 대상에 대한 오류가 올바르게 보고됩니다.
>
> **Deprecation cycle**:
>
> - &lt;1.2: 위에 언급한 코드 패턴은 정상적으로 컴파일됩니다. 어노테이션은 자동으로 무시되고 바이트 코드에 존재하지 않습니다.
> - 1.2.X: 이러한 사용법에 대한 deprecation 경고가 보고됩니다.
> - &gt;=1.3: 경고가 오류로 승격됩니다.

### Array.copyOfRange는 반환된 array를 확대하는 대신 인덱스가 범위를 벗어나면 예외를 발생시킵니다.

> **Issue**: [KT-19489](https://youtrack.jetbrains.com/issue/KT-19489)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: Kotlin 1.3부터 복사되는 범위의 exclusive 끝을 나타내는 `Array.copyOfRange`의 `toIndex` 인수가 array 크기보다 크지 않도록 하고, 큰 경우 `IllegalArgumentException`을 발생시킵니다.
>
> **Deprecation cycle**:
>
> - &lt;1.3: `Array.copyOfRange` 호출에서 `toIndex`가 array 크기보다 큰 경우 범위의 누락된 요소는 `null`로 채워져 Kotlin 타입 시스템의 건전성을 위반합니다.
> - &gt;=1.3: `toIndex`가 array 범위 내에 있는지 확인하고, 그렇지 않은 경우 예외를 발생시킵니다.

### Int.MIN_VALUE 및 Long.MIN_VALUE 단계의 Int 및 Long 프로그레션은 금지되며 인스턴스화할 수 없습니다.

> **Issue**: [KT-17176](https://youtrack.jetbrains.com/issue/KT-17176)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: Kotlin 1.3부터 정수 프로그레션에 대한 단계 값을 해당 정수 타입 (`Long` 또는 `Int`)의 최소 음수 값으로 금지하여 `IntProgression.fromClosedRange(0, 1, step = Int.MIN_VALUE)`를 호출하면 `IllegalArgumentException`이 발생합니다.
>
> **Deprecation cycle**:
>
> - &lt;1.3: `Int.MIN_VALUE` 단계로 `IntProgression`을 만들 수 있었는데, 이는 두 개의 값 `[0, -2147483648]`을 산출하여 명확하지 않은 동작을 보입니다.
> - &gt;=1.3: 단계가 해당 정수 타입의 최소 음수 값인 경우 `IllegalArgumentException`을 발생시킵니다.

### 매우 긴 시퀀스에 대한 작업에서 인덱스 오버플로 확인

> **Issue**: [KT-16097](https://youtrack.jetbrains.com/issue/KT-16097)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: Kotlin 1.3부터 `index`, `count` 및 유사한 메서드가 긴 시퀀스에 대해 오버플로되지 않도록 합니다. 영향을 받는 전체 메서드 목록은 이슈를 참조하십시오.
>
> **Deprecation cycle**:
>
> - &lt;1.3: 매우 긴 시퀀스에서 이러한 메서드를 호출하면 정수 오버플로로 인해 음수 결과가 생성될 수 있습니다.
> - &gt;=1.3: 이러한 메서드에서 오버플로를 감지하고 즉시 예외를 발생시킵니다.

### 플랫폼 간의 빈 일치 정규식 결과로 분할 통합

> **Issue**: [KT-21049](https://youtrack.jetbrains.com/issue/KT-21049)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: Kotlin 1.3부터 모든 플랫폼에서 빈 일치 정규식으로 `split` 메서드의 동작을 통합합니다.
>
> **Deprecation cycle**:
>
> - &lt;1.3: 설명된 호출의 동작은 JS, JRE 6, JRE 7과 JRE 8+를 비교할 때 다릅니다.
> - &gt;=1.3: 플랫폼 간의 동작을 통합합니다.

### 컴파일러 배포에서 중단된 더 이상 사용되지 않는 아티팩트

> **Issue**: [KT-23799](https://youtrack.jetbrains.com/issue/KT-23799)
>
> **Component**: other
>
> **Incompatible change type**: Binary
>
> **Short summary**: Kotlin 1.3은 다음 더 이상 사용되지 않는 바이너리 아티팩트를 중단합니다.
> - `kotlin-runtime`: 대신 `kotlin-stdlib`를 사용하십시오.
> - `kotlin-stdlib-jre7/8`: 대신 `kotlin-stdlib-jdk7/8`를 사용하십시오.
> - 컴파일러 배포의 `kotlin-jslib`: 대신 `kotlin-stdlib-js`를 사용하십시오.
>
> **Deprecation cycle**:
>
> - 1.2.X: 아티팩트는 더 이상 사용되지 않는 것으로 표시되었고, 컴파일러는 해당 아티팩트 사용에 대한 경고를 보고했습니다.
> - &gt;=1.3: 아티팩트가 중단되었습니다.

### stdlib의 어노테이션

> **Issue**: [KT-21784](https://youtrack.jetbrains.com/issue/KT-21784)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Binary
>
> **Short summary**: Kotlin 1.3은 `org.jetbrains.annotations` 패키지의 어노테이션을 stdlib에서 제거하고 컴파일러와 함께 제공되는 별도의 아티팩트 (`annotations-13.0.jar` 및 `mutability-annotations-compat.jar`)로 이동합니다.
>
> **Deprecation cycle**:
>
> - &lt;1.3: 어노테이션은 stdlib 아티팩트와 함께 제공되었습니다.
> - &gt;=1.3: 어노테이션은 별도의 아티팩트로 제공됩니다.