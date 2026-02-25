[//]: # (title: Compose 컴파일러 옵션 DSL)

Compose 컴파일러 Gradle 플러그인은 다양한 컴파일러 옵션을 위한 DSL을 제공합니다.
이 플러그인을 적용한 모듈의 `build.gradle.kts` 파일 내 `composeCompiler {}` 블록에서 컴파일러를 설정하는 데 사용할 수 있습니다.

지정할 수 있는 옵션에는 두 가지 종류가 있습니다.

* 일반 컴파일러 설정: 필요에 따라 모든 프로젝트에서 활성화하거나 비활성화할 수 있습니다.
* 기능 플래그(Feature flags): 결국 기본 기능(baseline)의 일부가 될 신규 및 실험적 기능을 활성화하거나 비활성화합니다.

Compose 컴파일러 Gradle 플러그인 API 레퍼런스에서 [사용 가능한 일반 설정 목록](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/)과 [지원되는 기능 플래그 목록](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)을 확인할 수 있습니다.

설정 예시는 다음과 같습니다.

```kotlin
composeCompiler {
    includeSourceInformation = true

    featureFlags = setOf(
        ComposeFeatureFlag.StrongSkipping.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups
    )
}
```

> Gradle 플러그인은 Kotlin 2.0 이전에는 수동으로만 지정할 수 있었던 여러 Compose 컴파일러 옵션에 대해 기본값을 제공합니다.
> 예를 들어 `freeCompilerArgs`를 통해 해당 옵션 중 하나라도 설정한 경우, Gradle은 중복 옵션 오류를 보고합니다.
>
{style="warning"}

## 기능 플래그의 목적 및 사용

기능 플래그는 새로운 플래그가 계속 출시되고 지원 중단(deprecated)됨에 따라 최상위 속성(top-level properties)에 대한 변경을 최소화하기 위해 별도의 옵션 세트로 구성됩니다.

기본적으로 비활성화된 기능 플래그를 활성화하려면 다음과 같이 세트에 지정하십시오.

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

기본적으로 활성화된 기능 플래그를 비활성화하려면 다음과 같이 해당 플래그에서 `disabled()` 함수를 호출하십시오.

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

Compose 컴파일러를 직접 구성하는 경우, 다음 구문을 사용하여 기능 플래그를 전달하십시오.

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

Compose 컴파일러 Gradle 플러그인 API 레퍼런스에서 [지원되는 기능 플래그 목록](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)을 확인하세요.