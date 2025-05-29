[//]: # (title: Composeコンパイラの移行ガイド)

ComposeコンパイラはGradleプラグインによって補完されており、セットアップを簡素化し、コンパイラオプションへのアクセスを容易にします。
Android Gradleプラグイン (AGP) と共に適用される場合、このComposeコンパイラプラグインは、AGPによって自動的に提供されるComposeコンパイラの座標を上書きします。

Composeコンパイラは、Kotlin 2.0.0以降、Kotlinリポジトリにマージされました。
これにより、ComposeコンパイラがKotlinと同時にリリースされ、常に同じバージョンのKotlinと互換性があるため、プロジェクトのKotlin 2.0.0以降への移行が円滑になります。

新しいComposeコンパイラプラグインをプロジェクトで使用するには、Composeを使用するモジュールごとに適用します。
[Jetpack Composeプロジェクトを移行する方法](#migrating-a-jetpack-compose-project)の詳細については、引き続きお読みください。Compose Multiplatformプロジェクトの場合は、[マルチプラットフォーム移行ガイド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html#migrating-a-compose-multiplatform-project)を参照してください。

## Jetpack Composeプロジェクトの移行

1.9からKotlin 2.0.0以降に移行する場合、Composeコンパイラの扱い方に応じてプロジェクト設定を調整する必要があります。設定管理を自動化するために、Kotlin GradleプラグインとComposeコンパイラGradleプラグインを使用することを推奨します。

### GradleプラグインによるComposeコンパイラの管理

Androidモジュールの場合:

1.  [Gradleバージョンカタログ](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml) にComposeコンパイラGradleプラグインを追加します:

    ```
    [versions]
    # ...
    kotlin = "%kotlinVersion%"
    
    [plugins]
    # ...
    org-jetbrains-kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
    compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
    ```

2.  ルートの`build.gradle.kts`ファイルにGradleプラグインを追加します:

    ```kotlin
    plugins {
        // ...
        alias(libs.plugins.compose.compiler) apply false
    }
    ```

3.  Jetpack Composeを使用するすべてのモジュールにプラグインを適用します:

    ```kotlin
    plugins {
        // ...
        alias(libs.plugins.compose.compiler)
    }
    ```

4.  Jetpack Composeコンパイラのコンパイラオプションを使用している場合は、`composeCompiler {}`ブロックでそれらを設定します。参考として、[コンパイラオプションのリスト](compose-compiler-options.md)を参照してください。

5.  Composeコンパイラのアーティファクトを直接参照している場合は、これらの参照を削除し、Gradleプラグインに処理を任せることができます。

### Gradleプラグインを使用しないComposeコンパイラの利用

Composeコンパイラの管理にGradleプラグインを使用していない場合は、プロジェクト内の古いMavenアーティファクトへの直接参照を更新してください:

*   `androidx.compose.compiler:compiler`を`org.jetbrains.kotlin:kotlin-compose-compiler-plugin-embeddable`に変更
*   `androidx.compose.compiler:compiler-hosted`を`org.jetbrains.kotlin:kotlin-compose-compiler-plugin`に変更

## 次に行うこと

*   ComposeコンパイラがKotlinリポジトリに移行することに関する[Googleのアナウンス](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)を参照してください。
*   Androidアプリを構築するためにJetpack Composeを使用している場合は、[マルチプラットフォーム化するためのガイド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html)を確認してください。