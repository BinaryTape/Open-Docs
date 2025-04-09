---
title: "Compose 컴파일러 옵션 DSL"
---
Compose 컴파일러 Gradle 플러그인은 다양한 컴파일러 옵션을 위한 DSL을 제공합니다.
플러그인을 적용하는 모듈의 `build.gradle.kts` 파일의 `composeCompiler {}` 블록에서 컴파일러를 구성하는 데 사용할 수 있습니다.

지정할 수 있는 옵션에는 두 가지 종류가 있습니다.

* 일반 컴파일러 설정: 특정 프로젝트에서 필요에 따라 비활성화하거나 활성화할 수 있습니다.
* 새로운 실험적 기능을 활성화 또는 비활성화하는 기능 플래그: 결국 기준선에 포함되어야 합니다.

[사용 가능한 일반 설정 목록](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/)과
[지원되는 기능 플래그 목록](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)은
Compose 컴파일러 Gradle 플러그인 API 참조에서 확인할 수 있습니다.

다음은 구성 예제입니다.

```kotlin
composeCompiler {
   includeSourceInformation = true

   featureFlags = setOf(
           ComposeFeatureFlag.StrongSkipping.disabled(),
           ComposeFeatureFlag.OptimizeNonSkippingGroups
   )
}
```

:::caution
Gradle 플러그인은 Kotlin 2.0 이전에는 수동으로만 지정되었던 여러 Compose 컴파일러 옵션에 대한 기본값을 제공합니다.
예를 들어 `freeCompilerArgs`로 설정한 경우 Gradle은 중복 옵션 오류를 보고합니다.

:::

## 기능 플래그의 목적 및 사용

기능 플래그는 새로운 플래그가 지속적으로 롤아웃되고 더 이상 사용되지 않으므로 최상위 속성에 대한 변경 사항을 최소화하기 위해 별도의 옵션 세트로 구성됩니다.

기본적으로 비활성화된 기능 플래그를 활성화하려면 집합에 지정합니다. 예를 들면 다음과 같습니다.

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

기본적으로 활성화된 기능 플래그를 비활성화하려면 해당 플래그에서 `disabled()` 함수를 호출합니다. 예를 들면 다음과 같습니다.

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

Compose 컴파일러를 직접 구성하는 경우 다음 구문을 사용하여 기능 플래그를 전달합니다.

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

Compose 컴파일러 Gradle 플러그인 API 참조에서 [지원되는 기능 플래그 목록](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)을 참조하세요.