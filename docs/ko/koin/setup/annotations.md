---
title: "Koin 어노테이션 (Koin Annotations)"
---
프로젝트를 위한 Koin Annotations 설정

## Version

[maven central](https://search.maven.org/search?q=io.insert-koin)에서 모든 Koin 패키지를 찾을 수 있습니다.

다음은 현재 사용 가능한 버전입니다.

## Setup & Current Version

다음은 현재 사용 가능한 Koin 프로젝트 버전입니다.

| Project   |      Version      |
|----------|:-------------:|
| koin-annotations-bom |  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations-bom)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations-bom) |
| koin-annotations |  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) |
| koin-ksp-compiler |  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-ksp-compiler)](https://mvnrepository.com/artifact/io.insert-koin/koin-ksp-compiler) |

## KSP Plugin

작업을 위해 KSP Plugin이 필요합니다 (https://github.com/google/ksp). 공식 (KSP Setup documentation)[https://kotlinlang.org/docs/ksp-quickstart.html]을 따르세요.

Gradle 플러그인을 추가하기만 하면 됩니다:
```groovy
plugins {
    id "com.google.devtools.ksp" version "$ksp_version"
}
```

최신 KSP 호환 버전: `1.9.24-1.0.20`

## Kotlin & Multiplatform

표준 Kotlin/Kotlin Multiplatform 프로젝트에서는 다음과 같이 KSP를 설정해야 합니다.

- KSP Gradle 플러그인 사용
- commonMain에 koin annotations에 대한 의존성 추가
- commonMain에 대한 sourceSet 설정
- koin 컴파일러를 사용하여 KSP 종속성 작업 추가
- 컴파일 작업 종속성을 `kspCommonMainKotlinMetadata`로 설정

```groovy
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
project.tasks.withType(KotlinCompilationTask::class.java).configureEach {
    if(name != "kspCommonMainKotlinMetadata") {
        dependsOn("kspCommonMainKotlinMetadata")
    }
}

```

## Android App Setup

- KSP Gradle 플러그인 사용
- koin annotations 및 koin ksp 컴파일러에 대한 종속성 추가
- sourceSet 설정

```groovy
plugins {
   id("com.google.devtools.ksp")
}

android {

    dependencies {
        // Koin
        implementation("io.insert-koin:koin-android:$koin_version")
        // Koin Annotations
        implementation("io.insert-koin:koin-annotations:$koin_annotations_version")
        // Koin Annotations KSP Compiler
        ksp("io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
    }

    // Set KSP sourceSet
    applicationVariants.all {
        val variantName = name
        sourceSets {
            getByName("main") {
                java.srcDir(File("build/generated/ksp/$variantName/kotlin"))
            }
        }
    }
}

```