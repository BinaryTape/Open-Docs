---
title: ComposeコンパイラーオプションDSL
---
ComposeコンパイラーのGradleプラグインは、さまざまなコンパイラーオプション用のDSLを提供します。
これを使用して、プラグインを適用するモジュールの`build.gradle.kts`ファイルの`composeCompiler {}`ブロックでコンパイラーを構成できます。

指定できるオプションには、次の2種類があります。

* 一般的なコンパイラー設定。これは、特定のプロジェクトで必要に応じて無効または有効にできます。
* 新しい実験的な機能を有効または無効にするフィーチャーフラグ。これらは最終的にベースラインの一部になるはずです。

[利用可能な一般的な設定のリスト](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/)と、
[サポートされているフィーチャーフラグのリスト](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)
は、ComposeコンパイラーGradleプラグインのAPIリファレンスにあります。

構成例を次に示します。

```kotlin
composeCompiler {
   includeSourceInformation = true

   featureFlags = setOf(
           ComposeFeatureFlag.StrongSkipping.disabled(),
           ComposeFeatureFlag.OptimizeNonSkippingGroups
   )
}
```

:::caution
Gradleプラグインは、Kotlin 2.0より前に手動で指定されていたいくつかのComposeコンパイラーオプションのデフォルトを提供します。
たとえば、`freeCompilerArgs`で設定しているものがある場合、Gradleは重複オプションエラーを報告します。

:::

## フィーチャーフラグの目的と使用

フィーチャーフラグは、新しいフラグが継続的にロールアウトおよび非推奨になるにつれて、トップレベルのプロパティへの変更を最小限に抑えるために、個別のオプションセットに編成されています。

デフォルトで無効になっているフィーチャーフラグを有効にするには、セットで指定します。例：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

デフォルトで有効になっているフィーチャーフラグを無効にするには、その`disabled()`関数を呼び出します。例：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

Composeコンパイラーを直接構成する場合は、次の構文を使用してフィーチャーフラグを渡します。

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

[サポートされているフィーチャーフラグのリスト](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-Compose-feature-flag/-companion/)
を、ComposeコンパイラーGradleプラグインのAPIリファレンスで確認してください。