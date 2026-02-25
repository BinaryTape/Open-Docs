[//]: # (title: Compose 컴파일러 업데이트하기)

Compose 컴파일러는 Gradle 플러그인을 통해 보완되며, 이는 설정을 단순화하고 컴파일러 옵션에 더 쉽게 접근할 수 있게 해줍니다.
Android Gradle 플러그인(AGP)과 함께 적용하면, 이 Compose 컴파일러 플러그인은 AGP에 의해 자동으로 제공되는 Compose 컴파일러의 좌표(coordinates)를 재정의(override)합니다.

Compose 컴파일러는 Kotlin 2.0.0부터 Kotlin 리포지토리에 통합되었습니다.
Compose 컴파일러가 Kotlin과 동시에 출시되고 항상 동일한 버전의 Kotlin과 호환되므로, 이는 프로젝트를 Kotlin 2.0.0 이상으로 원활하게 마이그레이션하는 데 도움이 됩니다.

> Kotlin 2.0.0으로 생성된 Compose Multiplatform 앱을 2.0.10 이상 버전으로 업데이트하는 것을 강력히 권장합니다. Compose 컴파일러 2.0.0에는 비 JVM(non-JVM) 타겟이 포함된 멀티플랫폼 프로젝트에서 타입의 안정성(stability)을 잘못 추론하여 불필요한(또는 끝없는) 재구성(recompositions)이 발생할 수 있는 문제가 있습니다.
>
> 앱이 Compose 컴파일러 2.0.10 이상으로 빌드되었더라도 Compose 컴파일러 2.0.0으로 빌드된 의존성(dependencies)을 사용한다면, 이러한 이전 의존성들이 여전히 재구성 문제를 일으킬 수 있습니다.
> 이를 방지하려면 의존성을 앱과 동일한 Compose 컴파일러 버전으로 빌드된 버전으로 업데이트하세요.
>
{style="warning"}

프로젝트에서 새로운 Compose 컴파일러 플러그인을 사용하려면, Compose를 사용하는 각 모듈에 플러그인을 적용하세요. 자세한 내용은 [Compose Multiplatform 프로젝트 마이그레이션](#migrating-a-compose-multiplatform-project) 방법을 참고하세요. Jetpack Compose 프로젝트의 경우 [마이그레이션 가이드](https://kotlinlang.org/docs/compose-compiler-migration-guide.html#migrating-a-jetpack-compose-project)를 참조하시기 바랍니다.

## Compose Multiplatform 프로젝트 마이그레이션

Compose Multiplatform 1.6.10부터는 `org.jetbrains.compose` 플러그인을 사용하는 각 모듈에 `org.jetbrains.kotlin.plugin.compose` Gradle 플러그인을 적용해야 합니다.

1. Compose 컴파일러 Gradle 플러그인을 [Gradle 버전 카탈로그(version catalog)](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)에 추가합니다.

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

2. 루트 `build.gradle.kts` 파일에 Gradle 플러그인을 추가합니다.

    ```kotlin
    plugins {
     // ...
     alias(libs.plugins.jetbrainsCompose) apply false
     alias(libs.plugins.compose.compiler) apply false
    }
    ```

3. Compose Multiplatform을 사용하는 모든 모듈에 플러그인을 적용합니다.

    ```kotlin
    plugins { 
        // ...
        alias(libs.plugins.jetbrainsCompose)
        alias(libs.plugins.compose.compiler)
    }
    ```

4. Jetpack Compose 컴파일러용 컴파일러 옵션을 사용 중인 경우, `composeCompiler {}` 블록에서 설정하세요. 자세한 내용은 [Compose 컴파일러 옵션 DSL](https://kotlinlang.org/docs/compose-compiler-options.html)을 참조하세요.

#### 발생 가능한 문제: "Missing resource with path"

Kotlin 1.9.0에서 2.0.0으로, 또는 2.0.0에서 1.9.0으로 전환할 때 다음과 같은 오류가 발생할 수 있습니다.

```
org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...
```

이 문제를 해결하려면 프로젝트 루트와 각 모듈에 있는 모든 `build` 디렉터리를 삭제하세요.

## 다음 단계

* Compose 컴파일러가 Kotlin 리포지토리로 이동한다는 [Google의 발표](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)를 확인해 보세요.
* [Compose 컴파일러 옵션 DSL](https://kotlinlang.org/docs/compose-compiler-options.html)을 참조하세요.
* Jetpack Compose 앱을 마이그레이션하려면 [Compose 컴파일러 문서](https://kotlinlang.org/docs/compose-compiler-migration-guide.html)를 확인하세요.