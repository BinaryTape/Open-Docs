[//]: # (title: KotlinマルチプラットフォームでのKSP)

手っ取り早く始めるには、KSPプロセッサーを定義している[サンプルKotlinマルチプラットフォームプロジェクト](https://github.com/google/ksp/tree/main/examples/multiplatform)を参照してください。

KSP 1.0.1以降、マルチプラットフォームプロジェクトにKSPを適用する方法は、単一プラットフォームのJVMプロジェクトと同様です。主な違いは、依存関係に`ksp(...)`設定を記述する代わりに、コンパイル前にどのコンパイルターゲットがシンボル処理を必要とするかを指定するために、`add(ksp<Target>)`または`add(ksp<SourceSet>)`が使用される点です。

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
    add("kspJvmTest", project(":test-processor")) // JVM用のテストソースセットがないため、何も行われません
    // kspLinuxX64が指定されていないため、Linux x64のメインソースセットに対する処理はありません
    // add("kspLinuxX64Test", project(":test-processor"))
}
```

## コンパイルと処理

マルチプラットフォームプロジェクトでは、Kotlinのコンパイルは各プラットフォームで複数回（`main`、`test`、またはその他のビルドフレーバー）行われることがあります。シンボル処理も同様です。Kotlinのコンパイルタスクがあり、対応する`ksp<Target>`または`ksp<SourceSet>`設定が指定されている場合、常にシンボル処理タスクが作成されます。

例えば、上記の`build.gradle.kts`では、`common/metadata`、`JVM main`、`Linux x64 main`、`Linux x64 test`の4つのコンパイルタスクがあり、`common/metadata`、`JVM main`、`Linux x64 test`の3つのシンボル処理タスクがあります。

## KSP 1.0.1以降でのksp(...)設定の回避

KSP 1.0.1より前では、`ksp(...)`設定は統一されたものが1つしか利用できませんでした。そのため、プロセッサーはすべてのコンパイルターゲットに適用されるか、まったく適用されないかのどちらかでした。`ksp(...)`設定は、従来の非マルチプラットフォームプロジェクトであっても、メインソースセットだけでなく、テストソースセットが存在する場合はそちらにも適用されることに注意してください。これはビルド時間への不要なオーバーヘッドをもたらしました。

KSP 1.0.1以降、上記の例に示すように、ターゲットごとの設定が提供されています。将来的には、
1. マルチプラットフォームプロジェクトでは、`ksp(...)`設定は非推奨となり削除されます。
2. 単一プラットフォームプロジェクトでは、`ksp(...)`設定はメインのデフォルトコンパイルにのみ適用されます。`test`のような他のターゲットは、プロセッサーを適用するために`kspTest(...)`を指定する必要があります。

KSP 1.0.1以降、より効率的な動作に切り替えるための早期アクセスフラグ`-DallowAllTargetConfiguration=false`が提供されています。現在の動作がパフォーマンス上の問題を引き起こしている場合、ぜひお試しください。このフラグのデフォルト値は、KSP 2.0で`true`から`false`に反転されます。