[//]: # (title: Compose 컴파일러 옵션 DSL)

Compose 컴파일러 Gradle 플러그인은 다양한 컴파일러 옵션을 위한 DSL을 제공합니다.
이 DSL을 사용하여 플러그인을 적용하는 모듈의 `build.gradle.kts` 파일에 있는 `composeCompiler {}` 블록에서 컴파일러를 구성할 수 있습니다.

지정할 수 있는 옵션은 두 가지 종류가 있습니다:

*   주어진 프로젝트에서 필요에 따라 비활성화하거나 활성화할 수 있는 일반 컴파일러 설정
*   새롭고 실험적인 기능을 활성화하거나 비활성화하는 기능 플래그 (Feature flag), 이 기능은 결국 기준선(baseline)의 일부가 되어야 합니다.

[사용 가능한 일반 설정 목록](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/)과
[지원되는 기능 플래그 목록](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)은 Compose 컴파일러 Gradle 플러그인 API 참조에서 찾을 수 있습니다.

다음은 설정 예시입니다:

```kotlin
composeCompiler {
    includeSourceInformation = true

    featureFlags = setOf(
        ComposeFeatureFlag.StrongSkipping.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups
    )
}
```

> Gradle 플러그인은 Kotlin 2.0 이전에는 수동으로만 지정되던 몇 가지 Compose 컴파일러 옵션에 대한 기본값을 제공합니다.
> 예를 들어, 이러한 옵션 중 일부를 `freeCompilerArgs`로 설정한 경우, Gradle은 중복 옵션 오류를 보고합니다.
>
{style="warning"}

## 기능 플래그의 목적과 사용

기능 플래그는 새로운 플래그가 계속해서 출시되고 사용 중단됨에 따라 최상위 속성(top-level properties)에 대한 변경을 최소화하기 위해 별도의 옵션 세트로 구성됩니다.

기본적으로 비활성화된 기능 플래그를 활성화하려면, 세트에 지정합니다. 예를 들어:

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

기본적으로 활성화된 기능 플래그를 비활성화하려면, `disabled()` 함수를 호출합니다. 예를 들어:

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

Compose 컴파일러를 직접 구성하는 경우, 다음 구문을 사용하여 기능 플래그를 전달합니다:

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

[지원되는 기능 플래그 목록](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)은 Compose 컴파일러 Gradle 플러그인 API 참조를 확인하세요.