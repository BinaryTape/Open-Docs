---
title: "Kotlin MultiplatformでのKSP"
---
手早く始めるには、KSPプロセッサを定義する[Kotlin Multiplatformプロジェクトのサンプル](https://github.com/google/ksp/tree/main/examples/multiplatform)をご覧ください。

KSP 1.0.1以降では、マルチプラットフォームプロジェクトへのKSPの適用は、単一プラットフォームであるJVMプロジェクトの場合と似ています。
主な違いは、依存関係で`ksp(...)`構成を記述する代わりに、コンパイルの前に、シンボル処理が必要なコンパイルターゲットを指定するために、`add(ksp<Target>)`または`add(ksp<SourceSet>)`が使用されることです。

```kotlin
plugins {
    kotlin("multiplatform")
    id("com.google.devtools.ksp")
}

kotlin {
    jvm()
    linuxX64 {
        binaries {
            executable()
        }
    }
}

dependencies {
    add("kspCommonMainMetadata", project(":test-processor"))
    add("kspJvm", project(":test-processor"))
    add("kspJvmTest", project(":test-processor")) // JVMのテストソースセットがないため、何も実行しません。
    // kspLinuxX64が指定されていないため、Linux x64メインソースセットの処理はありません。
    // add("kspLinuxX64Test", project(":test-processor"))
}
```

## コンパイルと処理

マルチプラットフォームプロジェクトでは、Kotlinコンパイルはプラットフォームごとに複数回（`main`、`test`、または他のビルドフレーバー）発生する可能性があります。
シンボル処理も同様です。 Kotlinコンパイルタスクと対応する`ksp<Target>`または`ksp<SourceSet>`構成が指定されるたびに、シンボル処理タスクが作成されます。

たとえば、上記の`build.gradle.kts`では、4つのコンパイルタスク（common/metadata、JVM main、Linux x64 main、Linux x64 test）と3つのシンボル処理タスク（common/metadata、JVM main、Linux x64 test）があります。

## KSP 1.0.1以降ではksp(...)構成を避ける

KSP 1.0.1より前は、統合された`ksp(...)`構成が1つしかありませんでした。 したがって、プロセッサはすべてのコンパイルターゲットに適用されるか、まったく適用されません。 `ksp(...)`構成は、メインソースセットだけでなく、従来の非マルチプラットフォームプロジェクトであっても、テストソースセットが存在する場合はテストソースセットにも適用されることに注意してください。 これにより、ビルド時間に不必要なオーバーヘッドが発生しました。

KSP 1.0.1以降では、上記の例に示すように、ターゲットごとの構成が提供されます。 将来的には：
1. マルチプラットフォームプロジェクトの場合、`ksp(...)`構成は非推奨となり、削除されます。
2. シングルプラットフォームプロジェクトの場合、`ksp(...)`構成はメインのデフォルトコンパイルにのみ適用されます。
   `test`などの他のターゲットは、プロセッサを適用するために`kspTest(...)`を指定する必要があります。

KSP 1.0.1以降では、より効率的な動作に切り替えるための早期アクセスフラグ`-DallowAllTargetConfiguration=false`があります。
現在の動作がパフォーマンスの問題を引き起こしている場合は、お試しください。
このフラグのデフォルト値は、KSP 2.0で`true`から`false`に反転します。