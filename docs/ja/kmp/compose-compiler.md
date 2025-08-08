[//]: # (title: Composeコンパイラーの更新)

ComposeコンパイラーはGradleプラグインによって補完されており、これによりセットアップが簡素化され、コンパイラーオプションへのアクセスが容易になります。
Android Gradleプラグイン（AGP）とともに適用されると、このComposeコンパイラープラグインは、AGPによって自動的に提供されるComposeコンパイラーの座標を上書きします。

Composeコンパイラーは、Kotlin 2.0.0以降、Kotlinリポジトリに統合されています。
これは、ComposeコンパイラーがKotlinと同時に提供され、常に同じバージョンのKotlinと互換性があるため、プロジェクトのKotlin 2.0.0以降への移行をスムーズにするのに役立ちます。

> Kotlin 2.0.0で作成されたCompose Multiplatformアプリをバージョン2.0.10以降に更新することを強く推奨します。Composeコンパイラー2.0.0には、非JVMターゲットを持つマルチプラットフォームプロジェクトにおいて型の安定性を誤って推論する問題があり、不必要な（あるいは無限の）再コンポジションにつながる可能性があります。
>
> アプリがComposeコンパイラー2.0.10以降でビルドされているにもかかわらず、Composeコンパイラー2.0.0でビルドされた依存関係を使用している場合、これらの古い依存関係が依然として再コンポジションの問題を引き起こす可能性があります。これを防ぐには、依存関係をアプリと同じComposeコンパイラーでビルドされたバージョンに更新してください。
>
{style="warning"}

プロジェクトで新しいComposeコンパイラープラグインを使用するには、Composeを使用する各モジュールに適用します。
Compose Multiplatformプロジェクトの移行方法の詳細については、引き続きお読みください ([Compose Multiplatformプロジェクトの移行](#migrating-a-compose-multiplatform-project))。Jetpack Composeプロジェクトについては、[移行ガイド](https://kotlinlang.org/docs/compose-compiler-migration-guide.html#migrating-a-jetpack-compose-project)を参照してください。

## Compose Multiplatformプロジェクトの移行

Compose Multiplatform 1.6.10以降、`org.jetbrains.compose`プラグインを使用する各モジュールに`org.jetbrains.kotlin.plugin.compose` Gradleプラグインを適用する必要があります。

1. ComposeコンパイラーGradleプラグインを[Gradleバージョンカタログ](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)に追加します。

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

2. Gradleプラグインをルートの`build.gradle.kts`ファイルに追加します。

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

4. Jetpack Composeコンパイラーのコンパイラーオプションを使用している場合は、`composeCompiler {}`ブロックでそれらを設定します。
   参照については、[ComposeコンパイラーオプションDSL](https://kotlinlang.org/docs/compose-compiler-options.html)を参照してください。

#### 発生しうる問題: "Missing resource with path"

Kotlin 1.9.0から2.0.0へ、または2.0.0から1.9.0へ切り替える際に、以下のエラーに遭遇する可能性があります。

```
org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...
```

これを解決するには、プロジェクトのルートおよび各モジュール内にあるすべての`build`ディレクトリを削除してください。

## 次のステップ

* ComposeコンパイラーがKotlinリポジトリに移行することに関する[Googleのアナウンス](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)を参照してください。
* 参照として[ComposeコンパイラーオプションDSL](https://kotlinlang.org/docs/compose-compiler-options.html)を参照してください。
* Jetpack Composeアプリを移行するには、[Composeコンパイラーのドキュメント](https://kotlinlang.org/docs/compose-compiler-migration-guide.html)を確認してください。