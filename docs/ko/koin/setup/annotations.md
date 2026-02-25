---
title: Koin 어노테이션
---

프로젝트를 위한 Koin 어노테이션 설정하기

## 현재 버전

모든 Koin 패키지는 [maven central](https://search.maven.org/search?q=io.insert-koin)에서 찾을 수 있습니다.

현재 사용 가능한 Koin 어노테이션 버전은 다음과 같습니다.

- **안정 버전(Stable)**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations/2.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 프로덕션 애플리케이션용
- **베타/RC(Beta/RC)**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations/2.2.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 향후 제공될 기능 미리보기

## KSP 플러그인

동작을 위해 [Google KSP](https://github.com/google/ksp)가 필요합니다. 공식 [KSP 설정 문서](https://kotlinlang.org/docs/ksp-quickstart.html)를 따르세요.

다음과 같이 Gradle 플러그인을 추가하기만 하면 됩니다.
```kotlin
plugins {
    id("com.google.devtools.ksp") version "$ksp_version"
}
```

**KSP 호환성**: 최신 Koin/KSP 호환 버전은 `2.1.21-2.0.2` (KSP2)입니다.

:::info
KSP 버전 형식: `[Kotlin 버전]-[KSP 버전]`. 사용 중인 Kotlin 버전과 호환되는 KSP 버전을 사용하고 있는지 확인하세요.
:::

## Android 및 Ktor 앱 KSP 설정

- KSP Gradle 플러그인 사용
- Koin 어노테이션 및 Koin KSP 컴파일러 의존성 추가
- sourceSet 설정

```kotlin
plugins {
    id("com.google.devtools.ksp") version "$ksp_version"
}

dependencies {
    // Koin
    implementation("io.insert-koin:koin-android:$koin_version")
    // Koin 어노테이션
    implementation("io.insert-koin:koin-annotations:$koin_annotations_version")
    // Koin 어노테이션 KSP 컴파일러
    ksp("io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
}
```

## Kotlin 멀티플랫폼 설정

표준 Kotlin/Kotlin 멀티플랫폼 프로젝트에서는 다음과 같이 KSP를 설정해야 합니다.

- KSP Gradle 플러그인 사용
- commonMain에 Koin 어노테이션 의존성 추가
- commonMain을 위한 sourceSet 설정
- Koin 컴파일러와 함께 KSP 의존성 작업 추가
- `kspCommonMainKotlinMetadata`에 대한 컴파일 작업 의존성 설정

```kotlin
plugins {
    id("com.google.devtools.ksp")
}

kotlin {

    sourceSets {
        
        // Koin 어노테이션 추가
        commonMain.dependencies {
            // Koin
            implementation("io.insert-koin:koin-core:$koin_version")
            // Koin 어노테이션
            api("io.insert-koin:koin-annotations:$koin_annotations_version")
        }
    }
    
    // KSP Common sourceSet
    sourceSets.named("commonMain").configure {
        kotlin.srcDir("build/generated/ksp/metadata/commonMain/kotlin")
    }       
}

// KSP 작업
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}

// Native 작업에서 Common Metadata 생성을 트리거
tasks.matching { it.name.startsWith("ksp") && it.name != "kspCommonMainKotlinMetadata" }.configureEach {
    dependsOn("kspCommonMainKotlinMetadata")
}