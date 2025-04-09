---
title: "Kotlin 2.0 호환성 가이드"
---
_[언어의 현대성 유지](kotlin-evolution-principles)_ 및 _[편리한 업데이트](kotlin-evolution-principles)_는 Kotlin 언어 디자인의 기본 원칙에 속합니다. 전자는 언어 발전을 방해하는 구조는 제거되어야 한다고 말하며, 후자는 코드 마이그레이션을 최대한 원활하게 만들기 위해 이러한 제거 사항은 사전에 충분히 알려져야 한다고 말합니다.

대부분의 언어 변경 사항은 업데이트된 변경 로그 또는 컴파일러 경고와 같은 다른 채널을 통해 이미 발표되었지만, 이 문서에서는 Kotlin 1.9에서 Kotlin 2.0으로의 마이그레이션에 대한 완전한 참조를 제공합니다.

:::note
Kotlin K2 컴파일러는 Kotlin 2.0의 일부로 도입되었습니다. 새로운 컴파일러의 이점, 마이그레이션 중에 발생할 수 있는 변경 사항 및 이전 컴파일러로 롤백하는 방법에 대한 자세한 내용은 [K2 compiler migration guide](k2-compiler-migration-guide)를 참조하세요.

:::

## 기본 용어

이 문서에서는 여러 종류의 호환성을 소개합니다.

- _source_(소스): 소스 비호환성 변경은 오류나 경고 없이 정상적으로 컴파일되던 코드가 더 이상 컴파일되지 않도록 합니다.
- _binary_(바이너리): 두 바이너리 아티팩트를 서로 교환해도 로딩 또는 링키지 오류가 발생하지 않으면 바이너리 호환이 된다고 합니다.
- _behavioral_(동작): 변경 사항을 적용하기 전과 후에 동일한 프로그램이 다른 동작을 보이는 경우 동작 비호환성 변경이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 제공됩니다. 다른 언어 관점에서 본 Kotlin 코드의 호환성(예: Java)은 이 문서의 범위를 벗어납니다.

## 언어

<!--
### 제목

> **이슈**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **요약**:
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.6.20: 경고 보고
> - 1.8.0: 경고를 오류로 높임
-->

### 프로젝션된 수신기에 대한 합성 setter 사용 중단

> **이슈**: [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **요약**: Java 클래스의 합성 setter를 사용하여 클래스의 프로젝션된 유형과 충돌하는 유형을 할당하면 오류가 트리거됩니다.
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.8.20: 합성 속성 setter에 반공변 위치에 프로젝션된 매개변수 유형이 있어 호출 위치 인수 유형과 호환되지 않는 경우 경고 보고
> - 2.0.0: 경고를 오류로 높임

### Java 하위 클래스에서 오버로드된 인라인 클래스 매개변수가 있는 함수를 호출할 때 올바른 이름 맹글링

> **이슈**: [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: behavioral
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 함수 호출에서 올바른 이름 맹글링 동작을 사용합니다. 이전 동작으로 되돌리려면 `-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses` 컴파일러 옵션을 사용하세요.

### 반공변 캡처된 유형에 대한 올바른 유형 근사 알고리즘

> **이슈**: [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.8.20: 문제가 있는 호출에 대한 경고 보고
> - 2.0.0: 경고를 오류로 높임

### 속성 초기화 전에 속성 값에 액세스하는 것을 금지합니다.

> **이슈**: [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 해당 컨텍스트에서 속성이 초기화되기 전에 액세스하면 오류를 보고합니다.

### 동일한 이름으로 가져온 클래스에 모호성이 있는 경우 오류 보고

> **이슈**: [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 별표 가져오기로 가져온 여러 패키지에 있는 클래스 이름을 확인할 때 오류를 보고합니다.

### 기본적으로 invokedynamic 및 LambdaMetafactory를 통해 Kotlin 람다 생성

> **이슈**: [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: behavioral
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 새로운 동작을 구현합니다. 람다는 기본적으로 `invokedynamic` 및 `LambdaMetafactory`를 사용하여 생성됩니다.

### 표현식이 필요한 경우 분기가 하나인 if 조건 금지

> **이슈**: [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: `if` 조건에 분기가 하나만 있는 경우 오류를 보고합니다.

### 제네릭 유형의 별표 프로젝션을 전달하여 자체 상한 위반을 금지합니다.

> **이슈**: [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 제네릭 유형의 별표 프로젝션을 전달하여 자체 상한을 위반하면 오류를 보고합니다.

### 개인 인라인 함수 반환 유형에서 익명 유형 근사화

> **이슈**: [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.9.0: 유추된 반환 유형에 익명 유형이 포함된 경우 개인 인라인 함수에 대한 경고를 보고합니다.
> - 2.0.0: 이러한 개인 인라인 함수의 반환 유형을 슈퍼 유형으로 근사화합니다.

### 로컬 함수 유형 속성의 호출 규칙보다 로컬 확장 함수 호출의 우선 순위를 지정하도록 오버로드 확인 동작 변경

> **이슈**: [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: behavioral
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 새로운 오버로드 확인 동작; 함수 호출은 호출 규칙보다 일관되게 우선 순위가 지정됩니다.

### 바이너리 종속성의 슈퍼 유형 변경으로 인해 상속된 멤버 충돌이 발생하면 오류 보고

> **이슈**: [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.7.0: 바이너리 종속성의 슈퍼 유형에서 상속된 멤버 충돌이 발생한 선언에 대해 CONFLICTING_INHERITED_MEMBERS_WARNING 경고를 보고합니다.
> - 2.0.0: 경고를 오류로 높입니다: CONFLICTING_INHERITED_MEMBERS

### 불변 유형의 매개변수에서 @UnsafeVariance 주석 무시

> **이슈**: [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 새로운 동작을 구현합니다. `@UnsafeVariance` 주석은 반공변 매개변수의 유형 불일치에 대한 오류를 보고할 때 무시됩니다.

### 컴패니언 객체 멤버에 대한 호출 외부 참조의 유형 변경

> **이슈**: [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.8.20: 바인딩되지 않은 참조로 유추된 컴패니언 객체 함수 참조 유형에 대한 경고 보고
> - 2.0.0: 컴패니언 객체 함수 참조가 모든 사용 컨텍스트에서 바인딩된 참조로 유추되도록 동작을 변경합니다.

### 개인 인라인 함수에서 익명 유형 노출 금지

> **이슈**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.3.0: 개인 인라인 함수에서 반환된 익명 객체의 자체 멤버 호출에 대한 경고 보고
> - 2.0.0: 이러한 개인 인라인 함수의 반환 유형을 슈퍼 유형으로 근사화하고 익명 객체 멤버에 대한 호출을 확인하지 않습니다.

### while-루프 중단 후 잘못된 스마트 캐스트에 대한 오류 보고

> **이슈**: [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 새로운 동작을 구현합니다. 이전 동작은 언어 버전 1.9로 전환하여 복원할 수 있습니다.

### 교차 유형의 변수에 해당 교차 유형의 하위 유형이 아닌 값을 할당하면 오류 보고

> **이슈**: [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 교차 유형을 갖는 변수에 해당 교차 유형의 하위 유형이 아닌 값을 할당하면 오류를 보고합니다.

### SAM 생성자로 생성된 인터페이스에 옵트인이 필요한 메서드가 포함된 경우 옵트인 필요

> **이슈**: [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.7.20: SAM 생성자를 통한 `OptIn` 사용에 대한 경고 보고
> - 2.0.0: SAM 생성자를 통한 `OptIn` 사용에 대한 경고를 오류로 높입니다(또는 `OptIn` 마커 심각도가 경고인 경우 경고를 계속 보고합니다).

### 유형 별칭 생성자에서 상한 위반 금지

> **이슈**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.8.0: 유형 별칭 생성자에서 상한이 위반된 경우에 대한 경고를 도입합니다.
> - 2.0.0: K2 컴파일러에서 경고를 오류로 높입니다.

### 지정된 경우 구조 분해 변수의 실제 유형을 명시적 유형과 일치시킵니다.

> **이슈**: [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 새로운 동작을 구현합니다. 구조 분해 변수의 실제 유형은 이제 지정된 경우 명시적 유형과 일치합니다.

### 옵트인이 필요한 기본값을 가진 매개변수 유형이 있는 생성자를 호출할 때 옵트인 필요

> **이슈**: [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.8.20: 옵트인이 필요한 매개변수 유형이 있는 생성자 호출에 대한 경고 보고
> - 2.0.0: 경고를 오류로 높입니다(또는 `OptIn` 마커 심각도가 경고인 경우 경고를 계속 보고합니다).

### 동일한 범위 수준에서 동일한 이름의 속성과 enum 항목 간의 모호성 보고

> **이슈**: [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.7.20: 컴파일러가 동일한 범위 수준에서 enum 항목 대신 속성으로 확인되면 경고를 보고합니다.
> - 2.0.0: 컴파일러가 동일한 이름의 속성과 enum 항목을 동일한 범위 수준에서 K2 컴파일러에서 모두 발견하면 모호성을 보고합니다(이전 컴파일러에서는 경고를 그대로 유지합니다).

### 컴패니언 속성을 enum 항목보다 우선하도록 한정자 확인 동작 변경

> **이슈**: [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 새로운 확인 동작을 구현합니다. 컴패니언 속성이 enum 항목보다 우선합니다.

### desugared 형식으로 작성된 것처럼 호출 호출 수신기 유형과 호출 함수 유형 확인

> **이슈**: [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 호출 호출 수신기 유형과 호출 함수 유형을 desugared 형식으로 작성된 것처럼 독립적으로 확인합니다.

### 비공개 인라인 함수를 통해 비공개 클래스 멤버 노출 금지

> **이슈**: [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.9.0: 내부 인라인 함수에서 비공개 클래스 컴패니언 객체 멤버를 호출할 때 `PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING` 경고를 보고합니다.
> - 2.0.0: 이 경고를 `PRIVATE_CLASS_MEMBER_FROM_INLINE` 오류로 높입니다.

### 프로젝션된 제네릭 유형에서 Definitely Non-Null 유형의 올바른 Nullable 여부

> **이슈**: [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 새로운 동작을 구현합니다. 프로젝션된 유형은 모든 제자리 Non-Null 유형을 고려합니다.

### 접두사 증분의 유추된 유형을 inc() 연산자의 반환 유형 대신 getter의 반환 유형과 일치하도록 변경

> **이슈**: [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 새로운 동작을 구현합니다. 접두사 증분의 유추된 유형이 `inc()` 연산자의 반환 유형 대신 getter의 반환 유형과 일치하도록 변경되었습니다.

### 슈퍼클래스에 선언된 제네릭 내부 클래스에서 내부 클래스를 상속할 때 바운드 검사 적용

> **이슈**: [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 제네릭 내부 슈퍼클래스의 유형 매개변수의 상한이 위반되면 오류를 보고합니다.

### 예상 유형이 함수 유형 매개변수가 있는 함수 유형일 때 SAM 유형이 있는 호출 가능 참조 할당 금지

> **이슈**: [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 예상 유형이 함수 유형 매개변수가 있는 함수 유형일 때 SAM 유형이 있는 호출 가능 참조에 대한 컴파일 오류를 보고합니다.

### 컴패니언 객체에서 주석 확인을 위해 컴패니언 객체 범위를 고려하십시오.

> **이슈**: [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: behavioral
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 새로운 동작을 구현합니다. 이제 컴패니언 객체에서 주석 확인 중 컴패니언 객체 범위가 무시되지 않습니다.

### 안전 호출 및 규칙 연산자의 조합에 대한 평가 의미 체계 변경

> **이슈**: [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: behavioral
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.4.0: 각 잘못된 호출에 대한 경고 보고
> - 2.0.0: 새로운 확인 동작을 구현합니다.

### 백업 필드와 사용자 지정 setter가 있는 속성은 즉시 초기화해야 합니다.

> **이슈**: [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)
> 
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: behavioral
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.9.20: 기본 생성자가 없는 경우 `MUST_BE_INITIALIZED` 경고를 도입합니다.
> - 2.0.0: 경고를 오류로 높입니다.

### 호출 연산자 규칙 호출에서 임의 식에 대한 Unit 변환 금지

> **이슈**: [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: behavioral
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 변수 및 호출 확인에서 Unit 변환이 임의 식에 적용되면 오류를 보고합니다. 영향을 받는 식으로 이전 동작을 유지하려면 `-XXLanguage:+UnitConversionsOnArbitraryExpressions` 컴파일러 옵션을 사용하십시오.

### 필드가 안전 호출로 액세스될 때 Nullable이 아닌 Java 필드에 Nullable 할당 금지

> **이슈**: [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: Nullable이 아닌 Java 필드에 Nullable이 할당되면 오류를 보고합니다.

### 원시 유형 매개변수를 포함하는 Java 메서드를 재정의할 때 별표 프로젝션된 유형 필요

> **이슈**: [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 새로운 동작을 구현합니다. 원시 유형 매개변수의 경우 재정의가 금지됩니다.

### V에 컴패니언이 있을 때 (V)::foo 참조 확인 변경

> **이슈**: [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: behavioral
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.6.0: 현재 컴패니언 객체 인스턴스에 바인딩된 호출 가능 참조에 대한 경고 보고
> - 2.0.0: 새로운 동작을 구현합니다. 유형 주위에 괄호를 추가해도 더 이상 유형의 컴패니언 객체 인스턴스에 대한 참조가 되지 않습니다.

### 효과적으로 공용 인라인 함수에서 암시적 비공용 API 액세스 금지

> **이슈**: [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.8.20: 공용 인라인 함수에서 암시적 비공용 API에 액세스할 때 컴파일 경고를 보고합니다.
> - 2.0.0: 경고를 오류로 높입니다.

### 속성 getter에서 사용 위치 get 주석 금지

> **이슈**: [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.9.0: getter에서 사용 위치 `get` 주석에 대한 경고(점진적 모드에서는 오류)를 보고합니다.
> - 2.0.0: 경고를 `INAPPLICABLE_TARGET_ON_PROPERTY` 오류로 높입니다.
>   `-XXLanguage:-ProhibitUseSiteGetTargetAnnotations`를 사용하여 경고로 되돌립니다.

### 빌더 유추 람다 함수에서 상한으로 유형 매개변수의 암시적 유추 방지

> **이슈**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.7.20: 유형 인수에 대한 유형 매개변수를 선언된 상한으로 유추할 수 없는 경우 경고(또는 점진적 모드에서는 오류)를 보고합니다.
> - 2.0.0: 경고를 오류로 높입니다.

### 공용 서명에서 로컬 유형을 근사화할 때 Nullable 여부 유지

> **이슈**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.8.0: 유연한 유형은 유연한 슈퍼 유형으로 근사화됩니다. 선언이 Nullable이 아닌 유형을 갖는 것으로 유추되어 NPE를 피하기 위해 유형을 명시적으로 지정하도록 프롬프트하는 경우 경고를 보고합니다.
> - 2.0.0: Nullable 유형은 Nullable 슈퍼 유형으로 근사화됩니다.

### 스마트 캐스팅 목적으로 false && ... 및 false || ...에 대한 특별 처리 제거

> **이슈**: [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 새로운 동작을 구현합니다. `false && ...` 및 `false || ...`에 대한 특별 처리가 없습니다.

### Enum에서 인라인 Open 함수 금지

> **이슈**: [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **구성 요소**: Core language
>
> **호환되지 않는 변경 유형**: source
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.8.0: Enum에서 인라인 Open 함수에 대한 경고 보고
> - 2.0.0: 경고를 오류로 높입니다.

## 도구

### Gradle의 가시성 변경

> **이슈**: [KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **구성 요소**: Gradle
>
> **호환되지 않는 변경 유형**: source
>
> **요약**: 이전에는 특정 DSL 컨텍스트를 위해 설계된 특정 Kotlin DSL 함수 및 속성이 실수로 다른 DSL 컨텍스트로 유출되었습니다. `@KotlinGradlePluginDsl` 주석을 추가했으며, 이는 Kotlin Gradle 플러그인 DSL 함수 및 속성이 사용할 수 없는 수준으로 노출되는 것을 방지합니다. 다음 수준은 서로 분리됩니다.
> * Kotlin 확장
> * Kotlin 대상
> * Kotlin 컴파일
> * Kotlin 컴파일 작업
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 가장 일반적인 경우, 빌드 스크립트가 잘못 구성된 경우 컴파일러는 수정 방법에 대한 제안과 함께 경고를 보고합니다. 그렇지 않으면 컴파일러에서 오류를 보고합니다.

### kotlinOptions DSL 사용 중단

> **이슈**: [KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **구성 요소**: Gradle
>
> **호환되지 않는 변경 유형**: source
>
> **요약**: `kotlinOptions` DSL 및 관련 `KotlinCompile<KotlinOptions>` 작업 인터페이스를 통해 컴파일러 옵션을 구성하는 기능이 더 이상 사용되지 않습니다.
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 경고 보고

### KotlinCompilation DSL에서 compilerOptions 사용 중단

> **이슈**: [KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **구성 요소**: Gradle
>
> **호환되지 않는 변경 유형**: source
>
> **요약**: `KotlinCompilation` DSL에서 `compilerOptions` 속성을 구성하는 기능이 더 이상 사용되지 않습니다.
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: 경고 보고

### CInteropProcess의 이전 방식 처리 중단

> **이슈**: [KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **구성 요소**: Gradle
>
> **호환되지 않는 변경 유형**: source
>
> **요약**: `CInteropProcess` 작업 및 `CInteropSettings` 클래스는 이제 `defFile` 및 `defFileProperty` 대신 `definitionFile` 속성을 사용합니다.
> 
> 이렇게 하면 `defFile`이 동적으로 생성될 때 `CInteropProcess` 작업과 `defFile`을 생성하는 작업 간에 추가 `dependsOn` 관계를 추가할 필요가 없습니다.
> 
> Kotlin/Native 프로젝트에서 Gradle은 이제 빌드 프로세스에서 연결된 작업이 나중에 실행된 후 `definitionFile` 속성의 존재를 지연적으로 확인합니다.
>
> **더 이상 사용되지 않는 주기**:
>
> - 2.0.0: `defFile` 및 `defFileProperty` 매개변수가 더 이상 사용되지 않습니다.

### kotlin.useK2 Gradle 속성 제거

> **이슈**: [KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **구성 요소**: Gradle
>
> **호환되지 않는 변경 유형**: behavioral
>
> **요약**: `kotlin.useK2` Gradle 속성이 제거되었습니다. Kotlin 1.9.*에서는 K2 컴파일러를 활성화하는 데 사용할 수 있었습니다. Kotlin 2.0.0 이상에서는 K2 컴파일러가 기본적으로 활성화되어 있으므로 속성이 적용되지 않으며 이전 컴파일러로 다시 전환하는 데 사용할 수 없습니다.
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.8.20: `kotlin.useK2` Gradle 속성이 더 이상 사용되지 않습니다.
> - 2.0.0: `kotlin.useK2` Gradle 속성이 제거되었습니다.

### 더 이상 사용되지 않는 플랫폼 플러그인 ID 제거

> **이슈**: [KT-65187](https://youtrack.jetbrains.com/issue/KT-65187)
>
> **구성 요소**: Gradle
>
> **호환되지 않는 변경 유형**: source
>
> **요약**: 이러한 플랫폼 플러그인 ID에 대한 지원이 제거되었습니다.
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.3: 플랫폼 플러그인 ID가 더 이상 사용되지 않습니다.
> - 2.0.0: 플랫폼 플러그인 ID가 더 이상 지원되지 않습니다.

### outputFile JavaScript 컴파일러 옵션 제거

> **이슈**: [KT-61116](https://youtrack.jetbrains.com/issue/KT-61116)
>
> **구성 요소**: Gradle
>
> **호환되지 않는 변경 유형**: source
>
> **요약**: `outputFile` JavaScript 컴파일러 옵션이 제거되었습니다. 대신 `Kotlin2JsCompile` 작업의 `destinationDirectory` 속성을 사용하여 컴파일된 JavaScript 출력 파일이 작성되는 디렉터리를 지정할 수 있습니다.
>
> **더 이상 사용되지 않는 주기**:
>
> - 1.9.25: `outputFile` 컴파일러 옵션이 더 이상 사용되지 않습니다.
> - 2.0.0: `outputFile` 컴파일러 옵션이 제거되었습니다.