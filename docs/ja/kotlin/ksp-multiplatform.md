[//]: # (title: Kotlin Multiplatform での KSP)

クイックスタートについては、KSP プロセッサーを定義している [Kotlin Multiplatform プロジェクトのサンプル](https://github.com/google/ksp/tree/main/examples/multiplatform) を参照してください。

KSP 1.0.1 以降、マルチプラットフォームプロジェクトへの KSP の適用は、シングルプラットフォームの JVM プロジェクトへの適用と同様です。主な違いは、dependencies 内で `ksp(...)` 設定を記述する代わりに、コンパイル前にどのコンパイルターゲットに対してシンボル処理（symbol processing）が必要かを指定するために、`add(ksp<Target>)` または `add(ksp<SourceSet>)` を使用する点です。

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
    add("kspJvmTest", project(":test-processor")) // JVM のテストソースセットが存在しないため、何も行われません
    // kspLinuxX64 が指定されていないため、Linux x64 のメインソースセットに対する処理は行われません
    // add("kspLinuxX64Test", project(":test-processor"))
}
```

## コンパイルと処理

マルチプラットフォームプロジェクトでは、各プラットフォームに対して Kotlin のコンパイルが複数回（`main`、`test`、またはその他のビルドフレーバー）発生することがあります。シンボル処理も同様です。Kotlin のコンパイルタスクが存在し、かつ対応する `ksp<Target>` または `ksp<SourceSet>` 設定が指定されている場合に、シンボル処理タスクが作成されます。

例えば、上記の `build.gradle.kts` には、4 つのコンパイルタスク（common/metadata、JVM main、Linux x64 main、Linux x64 test）と、3 つのシンボル処理タスク（common/metadata、JVM main、Linux x64 test）があります。

## KSP 1.0.1+ では ksp(...) 設定を避ける

KSP 1.0.1 より前は、統一された単一の `ksp(...)` 設定しか利用できませんでした。そのため、プロセッサーはすべてのコンパイルターゲットに適用されるか、あるいは全く適用されないかのどちらかでした。`ksp(...)` 設定は、メインのソースセットだけでなく、従来の非マルチプラットフォームプロジェクトであっても（テストソースセットが存在すれば）テストソースセットにも適用されることに注意してください。これはビルド時間に不要なオーバーヘッドをもたらしていました。

KSP 1.0.1 以降、上記の例のようにターゲットごとの設定が提供されるようになりました。将来的には以下のようになります：
1. マルチプラットフォームプロジェクトでは、`ksp(...)` 設定は非推奨となり、削除される予定です。
2. シングルプラットフォームプロジェクトでは、`ksp(...)` 設定はメインのデフォルトコンパイルにのみ適用されるようになります。`test` などの他のターゲットにプロセッサーを適用するには、`kspTest(...)` を指定する必要があります。

KSP 1.0.1 以降、より効率的な動作に切り替えるためのアーリーアクセスフラグ `-DallowAllTargetConfiguration=false` が用意されています。現在の動作によってパフォーマンス上の問題が発生している場合は、ぜひこのフラグをお試しください。このフラグのデフォルト値は、KSP 2.0 で `true` から `false` に切り替わる予定です。