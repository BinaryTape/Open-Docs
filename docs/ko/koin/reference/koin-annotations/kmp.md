---
title: Kotlin 멀티플랫폼 앱에서 정의 및 모듈을 위한 어노테이션
---

## KSP 설정

공식 문서의 [Kotlin 멀티플랫폼에서 KSP](https://kotlinlang.org/docs/ksp-multiplatform.html)에 설명된 대로 KSP를 설정하세요.

Koin 어노테이션의 기본 설정이 포함된 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 프로젝트를 확인할 수도 있습니다.

KSP 플러그인 추가

```kotlin
plugins {
    alias(libs.plugins.ksp)
}
```

공통 API에서 어노테이션 라이브러리 사용:

```kotlin
sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            api(libs.koin.annotations)
            // ...
        }
}
```

그리고 올바른 `sourceSet`에 KSP를 구성하는 것을 잊지 마세요:

```kotlin
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}
```

## 공통 모듈 및 KMP Expect 컴포넌트 선언하기

여러분의 `commonMain` `sourceSet`에서, `expect` 클래스나 함수의 네이티브 구현을 포함할 패키지를 스캔하기 위해 모듈을 선언하기만 하면 됩니다.

아래에는 `PlatformHelper` `expect` 클래스가 있는 `com.jetbrains.kmpapp.platform` 패키지를 스캔하는 `PlatformModule`이 있습니다. 이 모듈 클래스에는 `@Module`과 `@ComponentScan` 어노테이션이 붙어 있습니다.

```kotlin
// commonMain에서

@Module
@ComponentScan("com.jetbrains.kmpapp.platform")
class PlatformModule

// com.jetbrains.kmpapp.platform 패키지

@Single
expect class PlatformHelper {
    fun getName() : String
}
```

:::note
생성된 코드는 각 플랫폼 구현에서 이루어집니다. 모듈 패키지 스캔은 올바른 플랫폼 구현을 수집합니다.
:::

## 네이티브 컴포넌트에 어노테이션 달기

각 구현 `sourceSet`에서 이제 올바른 플랫폼 구현을 정의할 수 있습니다. 이 구현들은 `@Single` (다른 정의 어노테이션일 수도 있음) 어노테이션이 붙어 있습니다:

```kotlin
// androidMain에서
// com.jetbrains.kmpapp.platform 패키지

@Single
actual class PlatformHelper(
    val context: Context
){
    actual fun getName(): String = "I'm Android - $context"
}

// nativeMain에서
// com.jetbrains.kmpapp.platform 패키지

@Single
actual class PlatformHelper(){
    actual fun getName(): String = "I'm Native"
}