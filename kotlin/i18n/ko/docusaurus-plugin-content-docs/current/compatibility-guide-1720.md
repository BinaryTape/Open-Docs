---
title: "Kotlin 1.7.20 호환성 가이드"
---
_[언어의 현대성 유지](kotlin-evolution-principles)_ 및 _[편안한 업데이트](kotlin-evolution-principles)_는 Kotlin 언어 설계의 기본 원칙에 속합니다. 전자는 언어 진화를 방해하는 구조는 제거해야 한다고 말하며, 후자는 이러한 제거는 코드 마이그레이션을 최대한 원활하게 할 수 있도록 사전에 충분히 알려야 한다고 말합니다.

일반적으로 호환성이 깨지는 변경 사항은 기능 릴리스에서만 발생하지만, 이번에는 Kotlin 1.7의 변경 사항으로 인해 발생한 문제의 확산을 제한하기 위해 증분 릴리스에서 두 가지 변경 사항을 도입해야 합니다.

이 문서는 해당 내용을 요약하여 Kotlin 1.7.0 및 1.7.10에서 Kotlin 1.7.20으로의 마이그레이션에 대한 참조를 제공합니다.

## 기본 용어

이 문서에서는 다음과 같은 여러 종류의 호환성을 소개합니다.

- _source_: 소스 호환성이 깨지는 변경은 (오류나 경고 없이) 정상적으로 컴파일되던 코드가 더 이상 컴파일되지 않도록 만듭니다.
- _binary_: 두 개의 바이너리 아티팩트가 서로 교환해도 로딩 또는 링크 오류가 발생하지 않으면 바이너리 호환성이 있다고 합니다.
- _behavioral_: 변경 사항을 적용하기 전후에 동일한 프로그램이 다른 동작을 보이면 동작 호환성이 깨진다고 합니다.

이러한 정의는 순수한 Kotlin에 대해서만 제공된다는 점을 기억하십시오. 다른 언어의 관점에서 본 Kotlin 코드의 호환성
(예: Java)은 이 문서의 범위를 벗어납니다.

## 언어

<!--
### 제목

> **Issue**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**:
>
> **Deprecation cycle**:
>
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### 적절한 제약 조건 처리를 수정하려는 롤백 시도

> **Issue**: [KT-53813](https://youtrack.jetbrains.com/issue/KT-53813)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)에 설명된 변경 사항을 구현한 후 1.7.0에 나타난 타입 추론 제약 조건 처리 문제를 수정하려는 시도를 롤백합니다.
> 이 시도는 1.7.10에서 이루어졌지만, 결과적으로 새로운 문제가 발생했습니다.
>
> **Deprecation cycle**:
>
> - 1.7.20: 1.7.0 동작으로 롤백

### 여러 람다 및 확인과의 문제성 있는 상호 작용을 피하기 위해 일부 빌더 추론 케이스를 금지합니다.

> **Issue**: [KT-53797](https://youtrack.jetbrains.com/issue/KT-53797)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7은 제한 없는 빌더 추론이라는 기능을 도입하여 `@BuilderInference`로 어노테이션되지 않은 매개변수에 전달된 람다조차도 빌더 추론의 이점을 얻을 수 있도록 했습니다.
> 그러나 이러한 람다가 함수 호출에서 둘 이상 발생하면 여러 가지 문제가 발생할 수 있습니다.
>
> Kotlin 1.7.20은 해당 매개변수가 `@BuilderInference`로 어노테이션되지 않은 람다 함수가 둘 이상인 경우,
> 람다에서 타입 추론을 완료하기 위해 빌더 추론을 사용해야 하는 경우 오류를 보고합니다.
>
> **Deprecation cycle**:
>
> - 1.7.20: 이러한 람다 함수에서 오류를 보고합니다.
> `-XXLanguage:+NoBuilderInferenceWithoutAnnotationRestriction`을 사용하여 1.7.20 이전 동작으로 일시적으로 되돌릴 수 있습니다.