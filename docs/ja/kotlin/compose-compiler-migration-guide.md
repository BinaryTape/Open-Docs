[//]: # (title: Composeコンパイラ移行ガイド)

ComposeコンパイラはGradleプラグインによって補完されており、これによりセットアップが簡素化され、コンパイラオプションへのアクセスが容易になります。
Android Gradleプラグイン（AGP）と一緒に適用すると、このComposeコンパイラプラグインは、AGPによって自動的に提供されるComposeコンパイラの座標（coordinates）を上書きします。

Composeコンパイラは、Kotlin 2.0.0以降、Kotlinリポジトリに統合されました。
これにより、ComposeコンパイラはKotlinと同時にリリースされ、常に同じバージョンのKotlinと互換性を持つようになるため、プロジェクトのKotlin 2.0.0以降への移行がスムーズになります。

プロジェクトで新しいComposeコンパイラプラグインを使用するには、Composeを使用する各モジュールにプラグインを適用してください。
移行方法の詳細については、[Jetpack Composeプロジェクトの移行](#migrating-a-jetpack-compose-project)を参照してください。Compose Multiplatformプロジェクトについては、[マルチプラットフォーム移行ガイド](https://kotlinlang.org/docs/multiplatform/compose-compiler.html#migrating-a-compose-multiplatform-project)を参照してください。

## Jetpack Composeプロジェクトの移行

1.9からKotlin 2.0.0以降に移行する場合、Composeコンパイラの取り扱い方法に応じてプロジェクト構成を調整する必要があります。構成管理を自動化するために、Kotlin GradleプラグインとComposeコンパイラGradleプラグインを使用することをお勧めします。

### GradleプラグインによるComposeコンパイラの管理

Androidモジュールの場合：

1. ComposeコンパイラGradleプラグインを[Gradleバージョンカタログ](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)に追加します。

 ```toml
 [versions]
 # ...
 kotlin = "%kotlinVersion%"
 
 [plugins]
 # ...
 org-jetbrains-kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
 compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
 ```

> AGP 9.0.0以降を使用している場合、AGPにはKotlinのサポートが組み込まれているため、`org-jetbrains-kotlin-android` プラグインは不要になります。
> 
{style ="note"}

2. ルートの `build.gradle.kts` ファイルにGradleプラグインを追加します。

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler) apply false
 }
 ```

3. Jetpack Composeを使用するすべてのモジュールにプラグインを適用します。

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler)
 }
 ```

4. Jetpack Composeコンパイラのコンパイラオプションを使用している場合は、`composeCompiler {}` ブロックで設定してください。詳細は [コンパイラオプションの一覧](compose-compiler-options.md) を参照してください。

5. Composeコンパイラのアーティファクトを直接参照している場合は、それらの参照を削除して、Gradleプラグインに処理を任せることができます。

### Gradleプラグインを使用せずにComposeコンパイラを使用する

Gradleプラグインを使用してComposeコンパイラを管理していない場合は、プロジェクト内の古いMavenアーティファクトへの直接参照を更新してください。

* `androidx.compose.compiler:compiler` を `org.jetbrains.kotlin:kotlin-compose-compiler-plugin-embeddable` に変更
* `androidx.compose.compiler:compiler-hosted` を `org.jetbrains.kotlin:kotlin-compose-compiler-plugin` に変更

## 次のステップ

* ComposeコンパイラのKotlinリポジトリへの移行に関する [Googleのアナウンス](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html) をご覧ください。
* Jetpack Composeを使用してAndroidアプリを構築している場合は、[マルチプラットフォーム化の方法に関するガイド](https://kotlinlang.org/docs/multiplatform/multiplatform-integrate-in-existing-app.html) を確認してください。