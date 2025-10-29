---
title: Koin 어노테이션
---

프로젝트에 Koin 어노테이션을 설정합니다.

## 현재 버전

모든 Koin 패키지는 [Maven Central](https://search.maven.org/search?q=io.insert-koin)에서 찾을 수 있습니다.

현재 사용 가능한 Koin 어노테이션 버전은 다음과 같습니다:

- **안정**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations/2.1.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 프로덕션 애플리케이션에 사용하십시오.
- **베타/RC**: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations/2.2.0)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) - 향후 기능 미리보기

## KSP 플러그인

[Google KSP](https://github.com/google/ksp)가 작동해야 합니다. 공식 [KSP 설정 문서](https://kotlinlang.org/docs/ksp-quickstart.html)를 따르십시오.

다음 Gradle 플러그인을 추가하세요:
```kotlin
plugins {
    id("com.google.devtools.ksp") version "$ksp_version"
}
```

**KSP 호환성**: 최신 Koin/KSP 호환 버전은 `2.1.21-2.0.2` (KSP2)입니다.

:::info
KSP 버전 형식: `[Kotlin version]-[KSP version]`. KSP 버전이 Kotlin 버전과 호환되는지 확인하세요.
:::

## Android 및 Ktor 앱 KSP 설정

- KSP Gradle 플러그인 사용
- koin 어노테이션 및 koin ksp 컴파일러에 대한 의존성 추가
- sourceSet 설정

```kotlin
plugins {
    id("com.google.devtools.ksp") version "$ksp_version"
}

dependencies {
    // Koin
    implementation("io.insert-koin:koin-android:$koin_version")
    // Koin Annotations
    implementation("io.insert-koin:koin-annotations:$koin_annotations_version")
    // Koin Annotations KSP Compiler
    ksp("io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
}
```

## Kotlin 멀티플랫폼 설정

표준 Kotlin/Kotlin 멀티플랫폼 프로젝트에서 KSP를 다음과 같이 설정해야 합니다:

- KSP Gradle 플러그인 사용
- commonMain에 koin 어노테이션에 대한 의존성 추가
- commonMain에 대한 sourceSet 설정
- koin 컴파일러와 함께 KSP 의존성 태스크 추가
- 컴파일 태스크 의존성을 `kspCommonMainKotlinMetadata`로 설정

```kotlin
plugins {
    id("com.google.devtools.ksp")
}

kotlin {

    sourceSets {
        
        // Add Koin Annotations
        commonMain.dependencies {
            // Koin
            implementation("io.insert-koin:koin-core:$koin_version")
            // Koin Annotations
            api("io.insert-koin:koin-annotations:$koin_annotations_version")
        }
    }
    
    // KSP Common sourceSet
    sourceSets.named("commonMain").configure {
        kotlin.srcDir("build/generated/ksp/metadata/commonMain/kotlin")
    }       
}

// KSP Tasks
dependencies {
    add("kspCommonMainMetadata", libs.koin.ksp.compiler)
    add("kspAndroid", libs.koin.ksp.compiler)
    add("kspIosX64", libs.koin.ksp.compiler)
    add("kspIosArm64", libs.koin.ksp.compiler)
    add("kspIosSimulatorArm64", libs.koin.ksp.compiler)
}

// Trigger Common Metadata Generation from Native tasks
tasks.matching { it.name.startsWith("ksp") && it.name != "kspCommonMainKotlinMetadata" }.configureEach {
    dependsOn("kspCommonMainKotlinMetadata")
}
```