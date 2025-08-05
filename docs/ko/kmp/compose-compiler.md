[//]: # (title: Compose 컴파일러 업데이트)

Compose 컴파일러는 Gradle 플러그인으로 보완되어 설정을 간소화하고 컴파일러 옵션에 더 쉽게 접근할 수 있게 해줍니다.
Android Gradle 플러그인(AGP)과 함께 적용될 때, 이 Compose 컴파일러 플러그인은 AGP가 자동으로 제공하는 Compose 컴파일러의 코디네이트를 재정의합니다.

Compose 컴파일러는 Kotlin 2.0.0부터 Kotlin 리포지토리로 병합되었습니다.
이는 Compose 컴파일러가 Kotlin과 동시에 제공되며 항상 동일 버전의 Kotlin과 호환되므로, 프로젝트를 Kotlin 2.0.0 이상으로 마이그레이션하는 것을 원활하게 하는 데 도움이 됩니다.

> Kotlin 2.0.0으로 생성된 Compose Multiplatform 앱을 2.0.10 버전 이상으로 업데이트하는 것을 강력히 권장합니다. Compose 컴파일러 2.0.0에는 non-JVM 타겟을 사용하는 멀티플랫폼 프로젝트에서 타입의 안정성을 때때로 잘못 추론하는 문제가 있어 불필요하거나 (심지어 무한한) 리컴포지션을 유발할 수 있습니다.
>
> 앱이 Compose 컴파일러 2.0.10 이상으로 빌드되었지만 Compose 컴파일러 2.0.0으로 빌드된 의존성을 사용하는 경우, 이러한 오래된 의존성은 여전히 리컴포지션 문제를 야기할 수 있습니다.
> 이를 방지하려면 의존성을 앱과 동일한 Compose 컴파일러로 빌드된 버전으로 업데이트하세요.
>
{style="warning"}

프로젝트에서 새로운 Compose 컴파일러 플러그인을 사용하려면 Compose를 사용하는 각 모듈에 적용하세요.
[Compose Multiplatform 프로젝트 마이그레이션](#migrating-a-compose-multiplatform-project) 방법에 대한 자세한 내용은 계속 읽어보세요. Jetpack Compose 프로젝트의 경우, [마이그레이션 가이드](https://kotlinlang.org/docs/compose-compiler-migration-guide.html#migrating-a-jetpack-compose-project)를 참조하세요.

## Compose Multiplatform 프로젝트 마이그레이션

Compose Multiplatform 1.6.10부터는 `org.jetbrains.compose` 플러그인을 사용하는 각 모듈에 `org.jetbrains.kotlin.plugin.compose` Gradle 플러그인을 적용해야 합니다.

1.  Compose 컴파일러 Gradle 플러그인을 [Gradle 버전 카탈로그](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)에 추가합니다.

    ```
    [versions]
    # ...
    kotlin = "%kotlinVersion%"
    compose-plugin = "%org.jetbrains.compose%"
 
    [plugins]
    # ...
    jetbrainsCompose = { id = "org.jetbrains.compose", version.ref = "compose-plugin" }
    kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
    compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
    ```

2.  Gradle 플러그인을 루트 `build.gradle.kts` 파일에 추가합니다.

    ```kotlin
    plugins {
     // ...
     alias(libs.plugins.jetbrainsCompose) apply false
     alias(libs.plugins.compose.compiler) apply false
    }
    ```

3.  Compose Multiplatform을 사용하는 모든 모듈에 플러그인을 적용합니다.

    ```kotlin
    plugins { 
        // ...
        alias(libs.plugins.jetbrainsCompose)
        alias(libs.plugins.compose.compiler)
    }
    ```

4.  Jetpack Compose 컴파일러에 대한 컴파일러 옵션을 사용하는 경우, `composeCompiler {}` 블록에서 설정합니다.
    자세한 내용은 [Compose 컴파일러 옵션 DSL](https://kotlinlang.org/docs/compose-compiler-options.html)을 참조하세요.

#### 가능한 문제: "Missing resource with path"

Kotlin 1.9.0에서 2.0.0으로 또는 2.0.0에서 1.9.0으로 전환할 때 다음 오류가 발생할 수 있습니다.

```
org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...
```

이를 해결하려면 프로젝트 루트와 각 모듈에 있는 모든 `build` 디렉토리를 삭제하세요.

## 다음 단계

*   Compose 컴파일러가 Kotlin 리포지토리로 이동하는 것에 대한 [Google의 발표](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)를 참조하세요.
*   자세한 내용은 [Compose 컴파일러 옵션 DSL](https://kotlinlang.org/docs/compose-compiler-options.html)을 참조하세요.
*   Jetpack Compose 앱을 마이그레이션하려면 [Compose 컴파일러 문서](https://kotlinlang.org/docs/compose-compiler-migration-guide.html)를 확인하세요.