---
title: "Kotlin Multiplatform App에서 정의 및 모듈에 대한 어노테이션"
---
## KSP 설정

공식 문서에 설명된 대로 KSP 설정을 따르십시오: [Kotlin Multiplatform을 사용한 KSP](https://kotlinlang.org/docs/ksp-multiplatform.html)

Koin Annotations에 대한 기본 설정이 포함된 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 프로젝트를 확인할 수도 있습니다.

KSP 플러그인 추가

```kotlin
plugins {
    alias(libs.plugins.ksp)
}
```

common API에서 어노테이션 라이브러리 사용:

```kotlin
sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            api(libs.koin.annotations)
            // ...
        }
}
```

그리고 올바른 sourceSet에 KSP를 구성하는 것을 잊지 마십시오:

```kotlin
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}
```

## Common Modules & KMP Expect Components 선언

commonMain sourceSet에서 expect 클래스 또는 함수의 네이티브 구현을 가질 패키지를 스캔할 Module을 선언하기만 하면 됩니다.

아래에는 `PlatformHelper` expect 클래스가 있는 `com.jetbrains.kmpapp.platform` 패키지에서 스캔하는 `PlatformModule`이 있습니다. 모듈 클래스는 `@Module` 및 `@ComponentScan` 어노테이션으로 어노테이트됩니다.

```kotlin
// in commonMain

@Module
@ComponentScan("com.jetbrains.kmpapp.platform")
class PlatformModule

// package com.jetbrains.kmpapp.platform 

@Single
expect class PlatformHelper {
    fun getName() : String
}
```

:::note
생성된 코드는 각 플랫폼 구현에서 수행됩니다. 모듈 패키지 스캔은 올바른 플랫폼 구현을 수집합니다.
:::

## Native Components에 어노테이트

각 구현 sourceSet에서 올바른 플랫폼 구현을 정의할 수 있습니다. 이러한 구현은 `@Single` (다른 정의 어노테이션일 수 있음)로 어노테이트됩니다.

```kotlin
// in androidMain
// package com.jetbrains.kmpapp.platform

@Single
actual class PlatformHelper(
    val context: Context
){
    actual fun getName(): String = "I'm Android - $context"
}

// in nativeMain
// package com.jetbrains.kmpapp.platform

@Single
actual class PlatformHelper(){
    actual fun getName(): String = "I'm Native"
}