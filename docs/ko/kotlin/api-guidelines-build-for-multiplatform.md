[//]: # (title: 멀티플랫폼용 Kotlin 라이브러리 구축)

Kotlin 라이브러리를 생성할 때는 **Kotlin Multiplatform 지원을 포함하여 빌드 및 [배포하는 것](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)을 고려해 보세요.** 이는 라이브러리의 대상 사용자를 넓히고 여러 플랫폼을 대상으로 하는 프로젝트와 호환되게 만듭니다.

다음 섹션에서는 Kotlin Multiplatform 라이브러리를 효과적으로 구축하는 데 도움이 되는 지침을 제공합니다.

## 도달 범위 극대화

라이브러리를 가능한 한 많은 프로젝트에서 의존성으로 사용할 수 있도록 하려면, 가능한 한 많은 Kotlin Multiplatform [대상 플랫폼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)을 지원하는 것을 목표로 하세요.

라이브러리가 멀티플랫폼 프로젝트(라이브러리든 애플리케이션이든)에서 사용하는 플랫폼을 지원하지 않으면, 해당 프로젝트가 라이브러리에 의존하기 어렵습니다. 이 경우, 프로젝트는 일부 플랫폼에서 라이브러리를 사용하고 다른 플랫폼에는 별도의 솔루션을 구현해야 하거나, 아예 모든 플랫폼을 지원하는 대체 라이브러리를 선택할 것입니다.

아티팩트(artifact) 생성을 간소화하기 위해, [크로스 컴파일](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html#host-requirements)을 사용하여 어떤 호스트에서도 Kotlin Multiplatform 라이브러리를 게시할 수 있습니다. 이를 통해 Apple 머신 없이도 Apple 대상을 위한 `.klib` 아티팩트를 생성할 수 있습니다.

> Kotlin/Native 대상의 경우, 모든 가능한 대상을 지원하기 위해 [계층적 접근 방식](native-target-support.md#for-library-authors)을 사용하는 것을 고려하세요.
>
{style="note"}

## 공통 코드에서 사용하기 위한 API 설계

라이브러리를 생성할 때, 플랫폼별 구현을 작성하는 대신 **API를 공통 Kotlin 코드에서 사용할 수 있도록 설계하세요.**

가능한 경우 합리적인 기본 구성을 제공하고 플랫폼별 구성 옵션을 포함하세요. 좋은 기본값은 사용자가 라이브러리 구성을 위해 플랫폼별 구현을 작성할 필요 없이 공통 Kotlin 코드에서 라이브러리의 API를 사용할 수 있도록 합니다.

다음 우선순위를 사용하여 API를 가장 광범위하게 관련된 소스 세트에 배치하세요.

*   **`commonMain` 소스 세트:** `commonMain` 소스 세트의 API는 라이브러리가 지원하는 모든 플랫폼에서 사용할 수 있습니다. 라이브러리 API의 대부분을 여기에 배치하는 것을 목표로 하세요.
*   **중간 소스 세트:** 일부 플랫폼이 특정 API를 지원하지 않는 경우, [중간 소스 세트](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html#intermediate-source-sets)를 사용하여 특정 플랫폼을 대상으로 합니다. 예를 들어, 멀티스레딩을 지원하는 대상용 `concurrent` 소스 세트나 모든 non-JVM 대상용 `nonJvm` 소스 세트를 생성할 수 있습니다.
*   **플랫폼별 소스 세트:** 플랫폼별 API의 경우 `androidMain`과 같은 소스 세트를 사용하세요.

> Kotlin Multiplatform 프로젝트의 소스 세트에 대해 자세히 알아보려면 [계층적 프로젝트 구조](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html)를 참조하세요.
>
{style="tip"}

## 플랫폼 간 일관된 동작 보장

라이브러리가 지원되는 모든 플랫폼에서 일관되게 동작하도록 하려면, 멀티플랫폼 라이브러리의 API는 **모든 플랫폼에서 동일한 범위의 유효한 입력을 수락하고, 동일한 작업을 수행하며, 동일한 결과를 반환해야 합니다.** 마찬가지로, 라이브러리는 유효하지 않은 입력을 균일하게 처리하고 모든 플랫폼에서 일관되게 오류를 보고하거나 예외를 발생시켜야 합니다.

일관성 없는 동작은 라이브러리를 사용하기 어렵게 만들고, 사용자가 플랫폼별 차이를 관리하기 위해 공통 코드에 조건부 로직을 추가하도록 강제합니다.

[`expect` 및 `actual` 선언](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)을 사용하여 공통 코드에서 함수를 선언할 수 있으며, 이 함수들은 각 플랫폼의 네이티브 API에 완전히 접근할 수 있는 플랫폼별 구현을 가질 수 있습니다. 이 구현들은 또한 공통 코드에서 안정적으로 사용될 수 있도록 동일한 동작을 가져야 합니다.

API가 플랫폼 간에 일관되게 동작할 때, `commonMain` 소스 세트에서 한 번만 문서화하면 됩니다.

> 플랫폼 간의 차이가 불가피한 경우(예: 한 플랫폼이 더 광범위한 입력을 지원하는 경우)에도 가능한 한 최소화하세요. 예를 들어, 한 플랫폼의 기능을 다른 플랫폼과 일치시키기 위해 제한하고 싶지 않을 수 있습니다. 이러한 경우, 특정 차이점을 명확히 문서화하세요.
>
{style="note"}

## 모든 플랫폼에서 테스트

멀티플랫폼 라이브러리는 모든 플랫폼에서 실행되는 공통 코드로 작성된 [멀티플랫폼 테스트](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)를 가질 수 있습니다. 지원되는 플랫폼에서 이 공통 테스트 스위트를 정기적으로 실행하면 라이브러리가 올바르고 일관되게 동작하는지 확인할 수 있습니다.

게시된 모든 플랫폼에서 Kotlin/Native 대상을 정기적으로 테스트하는 것은 어려울 수 있습니다. 그러나 더 넓은 호환성을 보장하기 위해, 호환성을 테스트할 때 [계층적 방식](native-target-support.md#for-library-authors)을 사용하여 지원할 수 있는 모든 대상을 위해 라이브러리를 게시하는 것을 고려하세요.

[`kotlin-test`](https://kotlinlang.org/api/latest/kotlin.test/) 라이브러리를 사용하여 공통 코드에서 테스트를 작성하고 플랫폼별 테스트 러너로 실행합니다.

## 비(非)Kotlin 사용자 고려

Kotlin Multiplatform은 지원되는 대상 플랫폼 전반에 걸쳐 네이티브 API 및 언어와의 상호 운용성을 제공합니다. Kotlin Multiplatform 라이브러리를 생성할 때, 사용자가 Kotlin 이외의 언어에서 라이브러리의 타입과 선언을 사용해야 할 수 있는지 고려하세요.

예를 들어, 라이브러리의 일부 타입이 상호 운용성을 통해 Swift 코드에 노출될 경우, Swift에서 쉽게 접근할 수 있도록 해당 타입들을 설계하세요. [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)는 Swift에서 호출될 때 Kotlin API가 어떻게 나타나는지에 대한 유용한 통찰력을 제공합니다.

## 라이브러리 홍보

귀하의 라이브러리는 [JetBrains의 검색 플랫폼](https://klibs.io/)에 소개될 수 있습니다. 이 플랫폼은 Kotlin Multiplatform 라이브러리를 대상 플랫폼을 기반으로 쉽게 찾을 수 있도록 설계되었습니다.

기준을 충족하는 라이브러리는 자동으로 추가됩니다. 라이브러리를 추가하는 방법에 대한 더 많은 정보는 [FAQ](https://klibs.io/faq)를 참조하세요.