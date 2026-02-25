[//]: # (title: Composeコンパイラの更新)

ComposeコンパイラはGradleプラグインによって補完されており、これによりセットアップが簡素化され、コンパイラオプションへのアクセスが容易になります。
Android Gradleプラグイン（AGP）と一緒に適用すると、このComposeコンパイラプラグインは、AGPによって自動的に提供されるComposeコンパイラの座標（coordinates）を上書きします。

Composeコンパイラは、Kotlin 2.0.0からKotlinリポジトリに統合されました。
ComposeコンパイラはKotlinと同時にリリースされ、常に同じバージョンのKotlinと互換性を持つようになるため、プロジェクトのKotlin 2.0.0以降への移行がスムーズになります。

> Kotlin 2.0.0で作成されたCompose Multiplatformアプリを、バージョン2.0.10以降にアップデートすることを強く推奨します。Composeコンパイラ 2.0.0には、非JVMターゲットを持つマルチプラットフォームプロジェクトにおいて、型の安定性（stability of types）を誤って推論することがあり、不要な（あるいは無限の）再構成（recomposition）が発生するという問題があります。
>
> アプリがComposeコンパイラ 2.0.10以降でビルドされていても、Composeコンパイラ 2.0.0でビルドされた依存関係を使用している場合、それらの古い依存関係が依然として再構成の問題を引き起こす可能性があります。
> これを防ぐには、依存関係をアプリと同じComposeコンパイラでビルドされたバージョンにアップデートしてください。
>
{style="warning"}

プロジェクトで新しいComposeコンパイラプラグインを使用するには、Composeを使用する各モジュールに対してプラグインを適用してください。[Compose Multiplatformプロジェクトの移行](#migrating-a-compose-multiplatform-project)の詳細については、以下を読み進めてください。Jetpack Composeプロジェクトについては、[移行ガイド](https://kotlinlang.org/docs/compose-compiler-migration-guide.html#migrating-a-jetpack-compose-project)を参照してください。

## Compose Multiplatformプロジェクトの移行

Compose Multiplatform 1.6.10以降、`org.jetbrains.compose`プラグインを使用する各モジュールに対して、`org.jetbrains.kotlin.plugin.compose` Gradleプラグインを適用する必要があります。

1. Composeコンパイラ Gradleプラグインを[Gradleバージョンカタログ](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)に追加します。

    ```
    [versions]
    # ...
    kotlin = "%kotlinVersion%"
    compose-plugin = "%org.jetbrains.compose%"
 
    [plugins]
    # ...
    jetbrainsCompose = { id = "org.jetbrains.compose", version.ref = "compose-plugin" }
    kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
    compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
    ```

2. ルートの `build.gradle.kts` ファイルにGradleプラグインを追加します。

    ```kotlin
    plugins {
     // ...
     alias(libs.plugins.jetbrainsCompose) apply false
     alias(libs.plugins.compose.compiler) apply false
    }
    ```

3. Compose Multiplatformを使用するすべてのモジュールにプラグインを適用します。

    ```kotlin
    plugins { 
        // ...
        alias(libs.plugins.jetbrainsCompose)
        alias(libs.plugins.compose.compiler)
    }
    ```

4. Jetpack Composeコンパイラのコンパイラオプションを使用している場合は、それらを `composeCompiler {}` ブロック内で設定します。
   詳細は [ComposeコンパイラオプションDSL](https://kotlinlang.org/docs/compose-compiler-options.html) を参照してください。

#### 発生する可能性のある問題: "Missing resource with path"

Kotlin 1.9.0から2.0.0に、あるいは2.0.0から1.9.0に切り替える際、以下のエラーが発生することがあります。

```
org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...
```

これを解決するには、プロジェクトのルートおよび各モジュール内にあるすべての `build` ディレクトリを削除してください。

## 次のステップ

* ComposeコンパイラのKotlinリポジトリへの移行に関する [Googleのアナウンス](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html) を参照してください。
* [ComposeコンパイラオプションDSL](https://kotlinlang.org/docs/compose-compiler-options.html) を参照してください。
* Jetpack Composeアプリを移行するには、[Composeコンパイラドキュメント](https://kotlinlang.org/docs/compose-compiler-migration-guide.html) を確認してください。