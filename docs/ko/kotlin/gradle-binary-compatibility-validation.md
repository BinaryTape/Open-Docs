[//]: # (title: Kotlin Gradle 플러그인의 바이너리 호환성 검증)

<primary-label ref="experimental-general"/>

바이너리 호환성 검증은 라이브러리 작성자가 사용자들이 최신 버전으로 업그레이드할 때 코드를 손상시키지 않도록 보장하는 데 도움이 됩니다. 이는 원활한 업그레이드 경험을 제공하는 데 중요할 뿐만 아니라, 사용자들과 장기적인 신뢰를 구축하고 라이브러리의 지속적인 채택을 장려하는 데에도 중요합니다.

> 바이너리 호환성은 라이브러리의 두 버전의 컴파일된 바이트코드가 재컴파일 없이 상호 교환적으로 실행될 수 있음을 의미합니다.
>
{style="tip"}

버전 2.2.0부터 Kotlin Gradle 플러그인은 바이너리 호환성 검증을 지원합니다. 활성화되면 현재 코드로부터 애플리케이션 바이너리 인터페이스(Application Binary Interface, ABI) 덤프를 생성하고 이전 덤프와 비교하여 차이점을 강조합니다. 이러한 변경 사항을 검토하여 잠재적으로 바이너리 비호환적인 수정 사항을 찾고 이를 해결하기 위한 조치를 취할 수 있습니다.

## 활성화 방법

바이너리 호환성 검증을 활성화하려면 `build.gradle.kts` 파일의 `kotlin{}` 블록에 다음을 추가하세요:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // Use the set() function to ensure compatibility with older Gradle versions
        enabled.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    abiValidation {
        enabled = true
    }
}
```

</tab>
</tabs>

프로젝트에 여러 모듈이 있고 바이너리 호환성을 확인하려는 경우, 각 모듈을 개별적으로 구성하세요.

## 바이너리 호환성 문제 확인

코드 변경 후 잠재적으로 바이너리 비호환적인 문제를 확인하려면 IntelliJ IDEA에서 `checkLegacyAbi` Gradle 작업을 실행하거나 프로젝트 디렉토리에서 다음 명령을 사용하세요:

```bash
./gradlew checkLegacyAbi
```

이 작업은 ABI 덤프를 비교하고 감지된 모든 차이점을 오류로 출력합니다. 바이너리 호환성을 유지하기 위해 코드에 변경이 필요한지 확인하려면 출력을 주의 깊게 확인하세요.

## 참조 ABI 덤프 업데이트

Gradle이 최신 변경 사항을 확인하는 데 사용하는 참조 ABI 덤프를 업데이트하려면 IntelliJ IDEA에서 `updateLegacyAbi` 작업을 실행하거나 프로젝트 디렉토리에서 다음 명령을 사용하세요:

```bash
./gradlew updateLegacyAbi
```

변경 사항이 이전 버전과 바이너리 호환성을 유지한다고 확신할 때만 참조 덤프를 업데이트하세요.

## 필터 구성

필터를 정의하여 ABI 덤프에 포함할 클래스, 속성 및 함수를 제어할 수 있습니다. `filters {}` 블록을 사용하여 각각 `excluded {}` 및 `included {}` 블록으로 제외 및 포함 규칙을 추가하세요.

Gradle은 선언이 어떤 제외 규칙과도 일치하지 않는 경우에만 ABI 덤프에 선언을 포함합니다. 포함 규칙이 정의된 경우, 해당 선언은 그중 하나와 일치하거나 적어도 하나의 일치하는 멤버를 가져야 합니다.

규칙은 다음을 기반으로 할 수 있습니다:

*   클래스, 속성 또는 함수의 정규화된 이름(`byNames`).
*   BINARY 또는 RUNTIME [유지](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.annotation/-retention/) 정책을 가진 어노테이션의 이름(`annotatedWith`).

> 이름 규칙에 와일드카드 `**`, `*`, `?`를 사용할 수 있습니다.
> *   `**`는 마침표를 포함하여 0개 이상의 문자와 일치합니다.
> *   `*`는 마침표를 제외하고 0개 이상의 문자와 일치합니다. 단일 클래스 이름을 지정하는 데 사용하세요.
> *   `?`는 정확히 하나의 문자와 일치합니다.
>
{style = "tip"}

예시:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters {
            excluded {
                byNames.add("**.InternalUtils")
                annotatedWith.add("com.example.annotations.InternalApi")
            }

            included {
                byNames.add("com.example.api.**")
                annotatedWith.add("com.example.annotations.PublicApi")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    abiValidation {
        filters {
            excluded {
                byNames.add("**.InternalUtils")
                annotatedWith.add("com.example.annotations.InternalApi")
            }

            included {
                byNames.add("com.example.api.**")
                annotatedWith.add("com.example.annotations.PublicApi")
            }
        }
    }
}
```

</tab>
</tabs>

이 예시는 다음을 수행합니다:

*   제외:
    *   `InternalUtils` 클래스.
    *   `@InternalApi` 어노테이션이 지정된 선언.
*   포함:
    *   `com.example.api` 패키지 내의 모든 것.
    *   `@PublicApi` 어노테이션이 지정된 선언.

필터링에 대해 더 자세히 알아보려면 [Kotlin Gradle 플러그인 API 참조](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/-abi-filters-spec/)를 참조하세요.

## 지원되지 않는 타겟에 대한 추론된 변경 방지

멀티플랫폼 프로젝트에서 호스트 시스템이 모든 타겟을 컴파일할 수 없는 경우, Kotlin Gradle 플러그인은 사용 가능한 타겟으로부터 ABI 변경 사항을 추론하려고 시도합니다. 이는 나중에 더 많은 타겟을 지원하는 호스트로 전환할 때 오탐(false failure)을 방지하는 데 도움이 됩니다.

이 동작을 비활성화하려면 `build.gradle.kts` 파일에 다음을 추가하세요:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        klib {
            keepUnsupportedTargets.set(false)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    abiValidation {
        klib {
            keepUnsupportedTargets = false
        }
    }
}
```

</tab>
</tabs>

타겟이 지원되지 않고 추론이 비활성화된 경우, `checkLegacyAbi` 작업은 완전한 ABI 덤프를 생성할 수 없기 때문에 실패합니다. 이 동작은 바이너리 비호환 변경을 놓칠 위험을 감수하는 것보다 작업이 실패하는 것을 선호하는 경우 유용할 수 있습니다.