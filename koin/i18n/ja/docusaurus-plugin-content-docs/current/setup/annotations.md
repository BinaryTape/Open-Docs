---
title: "Koin Annotations"
---
Koin Annotationsをプロジェクトにセットアップする

## バージョン

Koinのすべてのパッケージは[maven central](https://search.maven.org/search?q=io.insert-koin)で確認できます。

現在の利用可能なバージョンは次のとおりです。

## セットアップと現在のバージョン

現在利用可能なKoinプロジェクトのバージョンは次のとおりです。

| プロジェクト   |      バージョン      |
|----------|:-------------:|
| koin-annotations-bom |  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations-bom)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations-bom) |
| koin-annotations |  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-annotations)](https://mvnrepository.com/artifact/io.insert-koin/koin-annotations) |
| koin-ksp-compiler |  [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-ksp-compiler)](https://mvnrepository.com/artifact/io.insert-koin/koin-ksp-compiler) |

## KSPプラグイン

動作にはKSPプラグインが必要です (https://github.com/google/ksp)。公式の(KSPセットアップドキュメント)[https://kotlinlang.org/docs/ksp-quickstart.html]に従ってください。

Gradleプラグインを追加するだけです:
```groovy
plugins {
    id "com.google.devtools.ksp" version "$ksp_version"
}
```

最新のKSP互換バージョン: `1.9.24-1.0.20`

## Kotlin & Multiplatform

標準的なKotlin/Kotlin Multiplatformプロジェクトでは、次のようにKSPをセットアップする必要があります。

- KSP Gradleプラグインを使用する
- commonMainにkoin annotationsの依存関係を追加する
- commonMainのsourceSetを設定する
- koinコンパイラでKSP依存関係タスクを追加する
- コンパイルタスクの依存関係を`kspCommonMainKotlinMetadata`に設定する

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

## Androidアプリのセットアップ

- KSP Gradleプラグインを使用する
- koin annotationsとkoin kspコンパイラの依存関係を追加する
- sourceSetを設定する

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