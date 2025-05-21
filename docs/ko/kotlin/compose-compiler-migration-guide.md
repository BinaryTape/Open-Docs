---
title: "Compose 컴파일러 마이그레이션 가이드"
---
Compose 컴파일러는 Gradle 플러그인으로 보완되어 설정이 간소화되고 컴파일러 옵션에 더 쉽게 접근할 수 있습니다.
Android Gradle 플러그인(AGP)과 함께 적용하면 이 Compose 컴파일러 플러그인이 AGP에서 자동으로 제공하는 Compose 컴파일러의 좌표를 재정의합니다.

Compose 컴파일러는 Kotlin 2.0.0 이후 Kotlin 저장소에 병합되었습니다.
이를 통해 프로젝트를 Kotlin 2.0.0 이상으로 원활하게 마이그레이션할 수 있습니다. Compose 컴파일러는 Kotlin과 동시에 제공되며 항상 동일한 버전의 Kotlin과 호환되기 때문입니다.

프로젝트에서 새로운 Compose 컴파일러 플러그인을 사용하려면 Compose를 사용하는 각 모듈에 대해 플러그인을 적용합니다.
자세한 내용은 [Jetpack Compose 프로젝트 마이그레이션](#migrating-a-jetpack-compose-project)을 참조하세요. Compose Multiplatform 프로젝트의 경우, [multiplatform 마이그레이션 가이드](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html#migrating-a-compose-multiplatform-project)를 참조하세요.

## Jetpack Compose 프로젝트 마이그레이션

Kotlin 1.9에서 Kotlin 2.0.0 이상으로 마이그레이션할 때 Compose 컴파일러를 처리하는 방식에 따라 프로젝트 구성을 조정해야 합니다. Kotlin Gradle 플러그인과 Compose 컴파일러 Gradle 플러그인을 사용하여 구성 관리를 자동화하는 것이 좋습니다.

### Gradle 플러그인으로 Compose 컴파일러 관리

Android 모듈의 경우:

1. Compose 컴파일러 Gradle 플러그인을 [Gradle 버전 카탈로그](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)에 추가합니다.

 ```
 [versions]
 # ...
 kotlin = "2.1.20"
 
 [plugins]
 # ...
 org-jetbrains-kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
 compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
 ```

2. Gradle 플러그인을 루트 `build.gradle.kts` 파일에 추가합니다.

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler) apply false
 }
 ```

3. Jetpack Compose를 사용하는 모든 모듈에 플러그인을 적용합니다.

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler)
 }
 ```

4. Jetpack Compose 컴파일러에 대한 컴파일러 옵션을 사용하는 경우 `composeCompiler {}` 블록에서 설정합니다.
   자세한 내용은 [컴파일러 옵션 목록](compose-compiler-options)을 참조하세요.

5. Compose 컴파일러 아티팩트를 직접 참조하는 경우 이러한 참조를 제거하고 Gradle 플러그인이 처리하도록 할 수 있습니다.

### Gradle 플러그인 없이 Compose 컴파일러 사용

Gradle 플러그인을 사용하여 Compose 컴파일러를 관리하지 않는 경우 프로젝트에서 이전 Maven 아티팩트에 대한 직접 참조를 업데이트합니다.

* `androidx.compose.compiler:compiler`를 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin-embeddable`로 변경
* `androidx.compose.compiler:compiler-hosted`를 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin`으로 변경

## 다음 단계

* Compose 컴파일러가 Kotlin 저장소로 이동한 것에 대한 [Google의 발표](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)를 참조하세요.
* Jetpack Compose를 사용하여 Android 앱을 빌드하는 경우 [앱을 멀티플랫폼으로 만드는 방법에 대한 가이드](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html)를 확인하세요.