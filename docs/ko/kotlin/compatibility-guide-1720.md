[//]: # (title: Kotlin 1.7.20 호환성 가이드)

_[언어를 현대적으로 유지하기](kotlin-evolution-principles.md)_와 _[편안한 업데이트](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 근본적인 원칙 중 하나입니다. 전자는 언어 발전을 저해하는 구성 요소를 제거해야 한다고 말하며, 후자는 코드 마이그레이션을 가능한 한 원활하게 하기 위해 이러한 제거는 사전에 잘 소통되어야 한다고 말합니다.

일반적으로 호환되지 않는 변경 사항은 기능 릴리스에서만 발생하지만, 이번에는 Kotlin 1.7의 변경 사항으로 인해 발생하는 문제의 확산을 제한하기 위해 증분 릴리스에 두 가지 이러한 변경 사항을 도입해야 합니다.

이 문서는 이러한 변경 사항을 요약하며, Kotlin 1.7.0 및 1.7.10에서 Kotlin 1.7.20으로의 마이그레이션을 위한 참고 자료를 제공합니다.

## 기본 용어

이 문서에서는 몇 가지 종류의 호환성을 소개합니다:

- _소스(Source)_: 소스 비호환 변경은 (오류나 경고 없이) 정상적으로 컴파일되던 코드가 더 이상 컴파일되지 않도록 합니다.
- _바이너리(Binary)_: 두 바이너리 아티팩트는 서로 교체하는 경우 로딩 또는 링키지 오류가 발생하지 않으면 바이너리 호환된다고 합니다.
- _동작(Behavioral)_: 변경 사항 적용 전후에 동일한 프로그램이 다른 동작을 보이는 경우 해당 변경은 동작 비호환이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 적용됨을 기억하십시오. 다른 언어의 관점(예: Java)에서 본 Kotlin 코드의 호환성은 이 문서의 범위를 벗어납니다.

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

### 적절한 제약 조건 처리 수정 시도 롤백

> **Issue**: [KT-53813](https://youtrack.jetbrains.com/issue/KT-53813)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)에 설명된 변경 사항을 구현한 후 1.7.0에서 나타난 타입 추론 제약 조건 처리 문제 수정 시도를 롤백합니다. 이 시도는 1.7.10에서 이루어졌지만, 결과적으로 새로운 문제를 야기했습니다.
>
> **Deprecation cycle**:
>
> - 1.7.20: 1.7.0 동작으로 롤백

### 다중 람다 및 해결(resolution)과의 문제적 상호 작용을 피하기 위해 일부 빌더 추론(builder inference) 사례 금지

> **Issue**: [KT-53797](https://youtrack.jetbrains.com/issue/KT-53797)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7은 무제한 빌더 추론(unrestricted builder inference)이라는 기능을 도입하여 `@BuilderInference` 어노테이션이 없는 파라미터에 전달된 람다조차도 빌더 추론(builder inference)의 이점을 누릴 수 있었습니다. 그러나 함수 호출에 그러한 람다가 둘 이상 나타나는 경우 여러 문제를 야기할 수 있었습니다.
>
> Kotlin 1.7.20은 `@BuilderInference` 어노테이션이 없는 해당 파라미터를 가진 람다 함수가 둘 이상이고, 람다 내의 타입 추론을 완료하기 위해 빌더 추론(builder inference) 사용이 필요한 경우 오류를 보고합니다.
>
> **Deprecation cycle**:
>
> - 1.7.20: 그러한 람다 함수에 대해 오류를 보고하며, `-XXLanguage:+NoBuilderInferenceWithoutAnnotationRestriction`를 사용하여 1.7.20 이전 동작으로 일시적으로 되돌릴 수 있습니다.