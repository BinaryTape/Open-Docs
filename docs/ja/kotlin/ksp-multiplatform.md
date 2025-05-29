[//]: # (title: KSPとKotlin Multiplatform)

手早く始めるには、KSPプロセッサを定義している[サンプルKotlin Multiplatformプロジェクト](https://github.com/google/ksp/tree/main/examples/multiplatform)を参照してください。

KSP 1.0.1以降、マルチプラットフォームプロジェクトにKSPを適用することは、単一プラットフォームのJVMプロジェクトに適用するのと同様です。主な違いは、`dependencies`に`ksp(...)`設定を記述する代わりに、コンパイル前に`add(ksp<Target>)` または `add(ksp<SourceSet>)` を使用して、どのコンパイルターゲットがシンボル処理を必要とするかを指定することです。

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
    add("kspJvmTest", project(":test-processor")) // Not doing anything because there's no test source set for JVM
    // There is no processing for the Linux x64 main source set, because kspLinuxX64 isn't specified
    // add("kspLinuxX64Test", project(":test-processor"))
}
```

## コンパイルと処理

マルチプラットフォームプロジェクトでは、Kotlinのコンパイルが各プラットフォームに対して複数回（`main`、`test`、またはその他のビルドフレーバーとして）実行される場合があります。シンボル処理も同様です。Kotlinのコンパイルタスクが存在し、かつ対応する`ksp<Target>`または`ksp<SourceSet>`設定が指定されている場合、シンボル処理タスクが作成されます。

例えば、上記の`build.gradle.kts`では、4つのコンパイルタスク（common/metadata、JVM main、Linux x64 main、Linux x64 test）と、3つのシンボル処理タスク（common/metadata、JVM main、Linux x64 test）が存在します。

## KSP 1.0.1以降での`ksp(...)`設定の回避

KSP 1.0.1より前では、単一の統合された`ksp(...)`設定のみが利用可能でした。そのため、プロセッサはすべてのコンパイルターゲットに適用されるか、全く適用されないかのどちらかでした。注意点として、`ksp(...)`設定は、従来の非マルチプラットフォームプロジェクトにおいても、メインのソースセットだけでなく、テストソースセットが存在すればそちらにも適用されます。これはビルド時間への不要なオーバーヘッドをもたらしました。

KSP 1.0.1以降、上記の例に示すように、ターゲットごとの設定が提供されています。将来的には：
1.  マルチプラットフォームプロジェクトでは、`ksp(...)`設定は非推奨となり、削除されます。
2.  単一プラットフォームプロジェクトでは、`ksp(...)`設定は、メインのデフォルトコンパイルにのみ適用されます。`test`のような他のターゲットは、プロセッサを適用するために`kspTest(...)`を指定する必要があります。

KSP 1.0.1以降、より効率的な動作に切り替えるための早期アクセスフラグ`-DallowAllTargetConfiguration=false`が存在します。現在の動作がパフォーマンスの問題を引き起こしている場合、試してみてください。このフラグのデフォルト値は、KSP 2.0で`true`から`false`に反転されます。