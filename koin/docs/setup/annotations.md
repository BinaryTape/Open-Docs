---
title: "Koin 注解"
---
为你的项目设置 Koin 注解（Koin Annotations）

## 版本

你可以在 [maven central](https://search.maven.org/search?q=io.insert-koin) 上找到所有的 Koin 包。

以下是当前可用的版本：

## 设置 & 当前版本

以下是当前可用的 Koin 项目版本：

| 项目   |      版本      |
|----------|:-------------:|
| koin-annotations-bom |  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations-bom)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations-bom) |
| koin-annotations |  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) |
| koin-ksp-compiler |  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-ksp-compiler)](https://mvnrepository.com/artifact/io.insert-koin/koin-ksp-compiler) |

## KSP 插件（KSP Plugin）

我们需要 KSP 插件才能工作 (https://github.com/google/ksp)。请遵循官方的 (KSP 设置文档)[https://kotlinlang.org/docs/ksp-quickstart.html]

只需添加 Gradle 插件：
```groovy
plugins {
    id "com.google.devtools.ksp" version "$ksp_version"
}
```

最新的 KSP 兼容版本：`1.9.24-1.0.20`

## Kotlin & 多平台（Multiplatform）

在一个标准的 Kotlin/Kotlin 多平台项目中，你需要如下设置 KSP：

- 使用 KSP Gradle 插件
- 在 commonMain 中添加 koin 注解的依赖
- 为 commonMain 设置 sourceSet
- 添加带有 koin 编译器的 KSP 依赖任务
- 设置编译任务依赖于 `kspCommonMainKotlinMetadata`

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

## Android App 设置

- 使用 KSP Gradle 插件
- 添加 koin 注解和 koin ksp 编译器的依赖
- 设置 sourceSet

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