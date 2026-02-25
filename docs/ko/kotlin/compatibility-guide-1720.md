[//]: # (title: Kotlin 1.7.20 호환성 가이드)

_[현대적인 언어 유지(Keeping the Language Modern)](kotlin-evolution-principles.md)_ 및 _[편안한 업데이트(Comfortable Updates)](kotlin-evolution-principles.md)_는 Kotlin 언어 설계의 근본적인 원칙입니다. 전자는 언어의 진화를 방해하는 구조를 제거해야 함을 의미하며, 후자는 코드 마이그레이션이 최대한 매끄럽게 이루어질 수 있도록 이러한 제거 작업에 대해 사전에 충분히 소통해야 함을 의미합니다.

보통 호환되지 않는 변경 사항은 기능 릴리스(feature release)에서만 발생하지만, 이번에는 Kotlin 1.7에서 도입된 변경 사항으로 인한 문제의 확산을 제한하기 위해 마이너 업데이트(incremental release)에서 두 가지 변경 사항을 도입하게 되었습니다.

이 문서는 Kotlin 1.7.0 및 1.7.10에서 Kotlin 1.7.20으로 마이그레이션할 때 참고할 수 있도록 해당 내용을 요약합니다.

## 기본 용어

이 문서에서는 몇 가지 종류의 호환성을 소개합니다:

- _소스(source)_: 소스 비호환 변경은 이전에는 잘 컴파일되던(오류나 경고 없이) 코드가 더 이상 컴파일되지 않게 되는 경우를 말합니다.
- _바이너리(binary)_: 두 바이너리 아티팩트를 서로 교체해도 로드 또는 링크 오류가 발생하지 않는 경우 두 아티팩트가 바이너리 호환된다고 합니다.
- _동작(behavioral)_: 변경 사항을 적용하기 전과 후의 동일한 프로그램이 서로 다른 동작을 보여주는 경우 동작 비호환 변경이라고 합니다.

이러한 정의는 순수 Kotlin에 대해서만 적용된다는 점을 기억하십시오. 다른 언어 관점(예: Java)에서의 Kotlin 코드 호환성은 이 문서의 범위를 벗어납니다.

## 언어 (Language)

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

### 올바른 제약 조건 처리를 위한 수정 시도 롤백

> **이슈**: [KT-53813](https://youtrack.jetbrains.com/issue/KT-53813)
>
> **컴포넌트**: 핵심 언어 (Core language)
>
> **호환되지 않는 변경 유형**: 소스 (source)
>
> **요약**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)에서 설명된 변경 사항을 구현한 후 1.7.0에서 나타난 타입 추론 제약 조건(type inference constraints) 처리 이슈의 수정 시도를 롤백합니다. 1.7.10에서 수정을 시도했으나, 이로 인해 또 다른 새로운 문제가 발생했습니다.
>
> **지원 중단 주기**:
>
> - 1.7.20: 1.7.0 동작으로 롤백

### 복합 람다 및 해석과의 충돌을 방지하기 위해 일부 빌더 추론 사례 금지

> **이슈**: [KT-53797](https://youtrack.jetbrains.com/issue/KT-53797)
>
> **컴포넌트**: 핵심 언어 (Core language)
>
> **호환되지 않는 변경 유형**: 소스 (source)
>
> **요약**: Kotlin 1.7은 `@BuilderInference` 어노테이션이 붙지 않은 파라미터에 전달된 람다도 빌더 추론(builder inference)의 혜택을 받을 수 있도록 하는 '제한 없는 빌더 추론(unrestricted builder inference)' 기능을 도입했습니다. 그러나 함수 호출에 이러한 람다가 두 개 이상 나타나는 경우 몇 가지 문제가 발생할 수 있었습니다.
> 
> Kotlin 1.7.20에서는 람다 내의 타입 추론을 완료하기 위해 빌더 추론을 사용해야 하는 상황에서, 대응하는 파라미터에 `@BuilderInference`가 붙지 않은 람다 함수가 두 개 이상인 경우 오류를 보고합니다.
>
> **지원 중단 주기**:
>
> - 1.7.20: 해당 람다 함수들에 대해 오류 보고,  
> `-XXLanguage:+NoBuilderInferenceWithoutAnnotationRestriction`을 사용하여 일시적으로 1.7.20 이전의 동작으로 되돌릴 수 있음.