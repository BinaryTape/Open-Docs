---
title: "Compose コンパイラ移行ガイド"
---
Composeコンパイラーは、セットアップを簡素化し、コンパイラーオプションへのアクセスを容易にするGradleプラグインによって補完されます。
このComposeコンパイラープラグインをAndroid Gradleプラグイン（AGP）と共に適用すると、AGPによって自動的に提供されるComposeコンパイラーの座標がオーバーライドされます。

Composeコンパイラーは、Kotlin 2.0.0以降、Kotlinリポジトリにマージされました。
これにより、ComposeコンパイラーがKotlinと同時に提供され、常に同じバージョンのKotlinと互換性があるため、プロジェクトのKotlin 2.0.0以降への移行がスムーズになります。

新しいComposeコンパイラープラグインをプロジェクトで使用するには、Composeを使用する各モジュールに適用します。
詳細については、[Jetpack Composeプロジェクトの移行](#migrating-a-jetpack-compose-project)をお読みください。Compose Multiplatformプロジェクトについては、[multiplatform移行ガイド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html#migrating-a-compose-multiplatform-project)を参照してください。

## Jetpack Composeプロジェクトの移行

Kotlin 1.9からKotlin 2.0.0以降に移行する場合は、Composeコンパイラーの処理方法に応じて、プロジェクト構成を調整する必要があります。
Kotlin GradleプラグインとComposeコンパイラーGradleプラグインを使用して、構成管理を自動化することをお勧めします。

### Gradleプラグインを使用したComposeコンパイラーの管理

Androidモジュールの場合：

1. ComposeコンパイラーGradleプラグインを[Gradleバージョンカタログ](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)に追加します。

 ```
 [versions]
 # ...
 kotlin = "2.1.20"
 
 [plugins]
 # ...
 org-jetbrains-kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
 compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
 ```

2. Gradleプラグインをルート`build.gradle.kts`ファイルに追加します。

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

4. Jetpack Composeコンパイラーのコンパイラーオプションを使用している場合は、`composeCompiler {}`ブロックで設定します。
   参照用に[コンパイラーオプションのリスト](compose-compiler-options)を参照してください。

5. Composeコンパイラーアーティファクトを直接参照している場合は、これらの参照を削除して、Gradleプラグインに処理させることができます。

### Gradleプラグインを使用しないComposeコンパイラーの使用

Gradleプラグインを使用してComposeコンパイラーを管理していない場合は、プロジェクト内の古いMavenアーティファクトへの直接参照を更新してください。

* `androidx.compose.compiler:compiler`を`org.jetbrains.kotlin:kotlin-compose-compiler-plugin-embeddable`に変更します。
* `androidx.compose.compiler:compiler-hosted`を`org.jetbrains.kotlin:kotlin-compose-compiler-plugin`に変更します。

## 次のステップ

* ComposeコンパイラーがKotlinリポジトリに移行することに関する[Googleの発表](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)を参照してください。
* Jetpack Composeを使用してAndroidアプリを構築している場合は、[マルチプラットフォームにする方法に関するガイド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html)を確認してください。