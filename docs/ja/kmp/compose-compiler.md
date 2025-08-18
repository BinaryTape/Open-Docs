[//]: # (title: Composeコンパイラの更新)

ComposeコンパイラはGradleプラグインによって補完され、セットアップを簡素化し、コンパイラオプションへのアクセスを容易にします。
Android Gradleプラグイン (AGP) と一緒に適用すると、このComposeコンパイラプラグインは、AGPによって自動的に提供されるComposeコンパイラの座標を上書きします。

Composeコンパイラは、Kotlin 2.0.0以降、Kotlinリポジトリにマージされました。
これにより、ComposeコンパイラがKotlinと同時に出荷され、常に同じバージョンのKotlinと互換性があるため、プロジェクトのKotlin 2.0.0以降への移行がスムーズになります。

> Kotlin 2.0.0で作成されたCompose Multiplatformアプリをバージョン2.0.10以降に更新することを強くお勧めします。Compose
> コンパイラ2.0.0には、非JVMターゲットを持つマルチプラットフォームプロジェクトで型の安定性を誤って推論する場合があり、これが不必要な（あるいは無限の）再コンポジションにつながる可能性があります。
>
> アプリがComposeコンパイラ2.0.10以降でビルドされている場合でも、Composeコンパイラ2.0.0でビルドされた依存関係を使用している場合、これらの古い依存関係が再コンポジションの問題を引き起こす可能性があります。
> これを防ぐには、依存関係をアプリと同じComposeコンパイラでビルドされたバージョンに更新してください。
>
{style="warning"}

プロジェクトで新しいComposeコンパイラプラグインを使用するには、Composeを使用する各モジュールに適用します。
[Compose Multiplatformプロジェクトの移行](#migrating-a-compose-multiplatform-project)の詳細については、引き続きお読みください。Jetpack Composeプロジェクトについては、[移行ガイド](https://kotlinlang.org/docs/compose-compiler-migration-guide.html#migrating-a-jetpack-compose-project)を参照してください。

## Compose Multiplatformプロジェクトの移行

Compose Multiplatform 1.6.10以降では、`org.jetbrains.compose`プラグインを使用する各モジュールに`org.jetbrains.kotlin.plugin.compose` Gradleプラグインを適用する必要があります。

1. ComposeコンパイラGradleプラグインを[Gradleバージョンカタログ](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)に追加します。

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

2. ルートの`build.gradle.kts`ファイルにGradleプラグインを追加します。

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

4. Jetpack Composeコンパイラ用のコンパイラオプションを使用している場合は、`composeCompiler {}`ブロックで設定します。
   詳細については、[ComposeコンパイラオプションDSL](https://kotlinlang.org/docs/compose-compiler-options.html)を参照してください。

#### 可能性のある問題：「Missing resource with path」

Kotlin 1.9.0から2.0.0へ、または2.0.0から1.9.0へ切り替える際に、以下のエラーに遭遇する可能性があります。

```
org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...
```

これを解決するには、プロジェクトのルートおよび各モジュール内のすべての`build`ディレクトリを削除します。

## 次のステップ

*   ComposeコンパイラがKotlinリポジトリに移行することについての[Googleの発表](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)を参照してください。
*   詳細については、[ComposeコンパイラオプションDSL](https://kotlinlang.org/docs/compose-compiler-options.html)を参照してください。
*   Jetpack Composeアプリを移行するには、[Composeコンパイラのドキュメント](https://kotlinlang.org/docs/compose-compiler-migration-guide.html)を確認してください。