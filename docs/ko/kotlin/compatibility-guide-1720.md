[//]: # (title: Kotlin 1.7.20 호환성 가이드)

_[언어를 현대적으로 유지하기](kotlin-evolution-principles.md)_ 및 _[편안한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 기본 원칙 중 하나입니다. 전자는 언어 발전을 저해하는 구성 요소는 제거되어야 한다고 말하며, 후자는 코드 마이그레이션을 최대한 원활하게 진행하기 위해 이러한 제거 사항을 사전에 충분히 알려야 한다고 말합니다.

일반적으로 호환되지 않는 변경 사항은 기능 릴리스에서만 발생하지만, 이번에는 Kotlin 1.7에서 도입된 변경 사항으로 인한 문제의 확산을 제한하기 위해 증분 릴리스에서 두 가지 변경 사항을 도입해야 합니다.

이 문서는 이러한 변경 사항을 요약하고, Kotlin 1.7.0 및 1.7.10에서 Kotlin 1.7.20으로 마이그레이션하기 위한 참조 자료를 제공합니다.

## 기본 용어

이 문서에서는 여러 종류의 호환성을 소개합니다.

-   _소스_: 소스 코드 비호환성(source-incompatible) 변경은 이전에 문제없이(오류나 경고 없이) 컴파일되던 코드가 더 이상 컴파일되지 못하게 만듭니다.
-   _바이너리_: 두 바이너리 아티팩트는 서로 교환해도 로딩 또는 링크 오류를 발생시키지 않으면 바이너리 호환성(binary-compatible)이 있다고 말합니다.
-   _동작_: 변경 사항 적용 전후에 동일한 프로그램이 다른 동작을 보이면 동작 비호환성(behavioral-incompatible) 변경이라고 말합니다.

이러한 정의는 순수한 Kotlin에만 적용된다는 점을 기억하십시오. 다른 언어(예: Java) 관점에서 본 Kotlin 코드의 호환성은 이 문서의 범위를 벗어납니다.

## 언어

<!--
### Title

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

### 올바른 제약 조건 처리를 수정하기 위한 롤백 시도

> **Issue**: [KT-53813](https://youtrack.jetbrains.com/issue/KT-53813)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)에 설명된 변경 사항 구현 후 1.7.0에 나타났던 타입 추론 제약 조건 처리 문제 수정 시도를 롤백합니다. 이 시도는 1.7.10에 이루어졌으나, 새로운 문제를 야기했습니다.
>
> **Deprecation cycle**:
>
> - 1.7.20: 1.7.0 동작으로 롤백

### 다중 람다 및 해결과의 문제성 상호 작용을 피하기 위해 일부 빌더 추론 사례 금지

> **Issue**: [KT-53797](https://youtrack.jetbrains.com/issue/KT-53797)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7은 `@BuilderInference` 어노테이션이 없는 매개변수에 전달된 람다조차도 빌더 추론의 이점을 얻을 수 있도록 무제한 빌더 추론(unrestricted builder inference)이라는 기능을 도입했습니다. 그러나 이는 함수 호출에 이러한 람다가 두 개 이상 나타날 경우 여러 문제를 일으킬 수 있습니다.
>
> Kotlin 1.7.20은 해당 매개변수가 `@BuilderInference` 어노테이션으로 어노테이션되지 않았고 람다 내의 타입 추론을 완료하기 위해 빌더 추론을 사용해야 하는 람다 함수가 두 개 이상인 경우 오류를 보고합니다.
>
> **Deprecation cycle**:
>
> - 1.7.20: 해당 람다 함수에 대해 오류 보고,
> `-XXLanguage:+NoBuilderInferenceWithoutAnnotationRestriction`을 사용하여 일시적으로 1.7.20 이전 동작으로 되돌릴 수 있습니다.