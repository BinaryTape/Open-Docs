[//]: # (title: Compose コンパイラの移行ガイド)

Compose コンパイラは Gradle プラグインによって補完され、セットアップを簡素化し、コンパイラオプションへのアクセスを容易にします。
この Compose コンパイラプラグインが Android Gradle プラグイン (AGP) とともに適用されると、AGP によって自動的に提供される Compose コンパイラの座標を上書きします。

Compose コンパイラは Kotlin 2.0.0 から Kotlin リポジトリにマージされました。
これにより、Compose コンパイラが Kotlin と同時に提供され、常に同バージョンの Kotlin と互換性があるため、プロジェクトの Kotlin 2.0.0 以降への移行がスムーズになります。

プロジェクトで新しい Compose コンパイラプラグインを使用するには、Compose を使用するモジュールごとに適用します。
Jetpack Compose プロジェクトを移行する方法の詳細については、[こちら](#migrating-a-jetpack-compose-project)をお読みください。Compose Multiplatform プロジェクトについては、[Multiplatform 移行ガイド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html#migrating-a-compose-multiplatform-project)を参照してください。

## Jetpack Compose プロジェクトの移行

Kotlin 1.9 から Kotlin 2.0.0 以降に移行する場合、Compose コンパイラの扱い方に応じてプロジェクト設定を調整する必要があります。
設定管理を自動化するために、Kotlin Gradle プラグインと Compose コンパイラ Gradle プラグインを使用することをお勧めします。

### Gradle プラグインによる Compose コンパイラの管理

Android モジュールの場合：

1.  Compose コンパイラ Gradle プラグインを [Gradle バージョンカタログ](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)に追加します。

    ```
    [versions]
    # ...
    kotlin = "%kotlinVersion%"
    
    [plugins]
    # ...
    org-jetbrains-kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
    compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
    ```

2.  Gradle プラグインをルートの `build.gradle.kts` ファイルに追加します。

    ```kotlin
    plugins {
        // ...
        alias(libs.plugins.compose.compiler) apply false
    }
    ```

3.  Jetpack Compose を使用するすべてのモジュールにプラグインを適用します。

    ```kotlin
    plugins {
        // ...
        alias(libs.plugins.compose.compiler)
    }
    ```

4.  Jetpack Compose コンパイラのコンパイラオプションを使用している場合は、`composeCompiler {}` ブロックで設定します。
    詳細については、[コンパイラオプションのリスト](compose-compiler-options.md)を参照してください。

5.  Compose コンパイラのアーティファクトを直接参照している場合は、これらの参照を削除し、Gradle プラグインに任せることができます。

### Gradle プラグインを使用せずに Compose コンパイラを使用する

Gradle プラグインを使用して Compose コンパイラを管理していない場合は、プロジェクト内の古い Maven アーティファクトへの直接参照を更新します。

*   `androidx.compose.compiler:compiler` を `org.jetbrains.kotlin:kotlin-compose-compiler-plugin-embeddable` に変更します。
*   `androidx.compose.compiler:compiler-hosted` を `org.jetbrains.kotlin:kotlin-compose-compiler-plugin` に変更します。

## 次のステップ

*   Compose コンパイラが Kotlin リポジトリに移行することに関する [Google のアナウンス](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)を参照してください。
*   Jetpack Compose を使用して Android アプリを構築している場合は、[Multiplatform 化する方法に関するガイド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html)を確認してください。