[//]: # (title: Compose コンパイラのオプションDSL)

Compose コンパイラ Gradle プラグインは、さまざまなコンパイラオプションのDSLを提供します。
これを使用して、プラグインを適用するモジュールの `build.gradle.kts` ファイル内の `composeCompiler {}` ブロックでコンパイラを設定できます。

指定できるオプションには2種類あります。

*   一般的なコンパイラ設定。これらは、どのプロジェクトでも必要に応じて無効または有効にできます。
*   新しい実験的な機能を有効または無効にするフィーチャーフラグ。これらは最終的にベースラインの一部となる予定です。

利用可能な一般的な設定のリストと、サポートされているフィーチャーフラグのリストは、Compose コンパイラ Gradle プラグインのAPIリファレンスで確認できます。
[利用可能な一般的な設定のリスト](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/)
および[サポートされているフィーチャーフラグのリスト](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)

設定例を以下に示します。

```kotlin
composeCompiler {
    includeSourceInformation = true

    featureFlags = setOf(
        ComposeFeatureFlag.StrongSkipping.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups
    )
}
```

> Gradle プラグインは、Kotlin 2.0以前は手動でしか指定できなかったいくつかのComposeコンパイラオプションのデフォルト値を提供します。
> たとえば、それらのいずれかを `freeCompilerArgs` で設定している場合、Gradle はオプションの重複エラーを報告します。
>
{style="warning"}

## フィーチャーフラグの目的と使用方法

フィーチャーフラグは、新しいフラグが継続的に導入され非推奨になるにつれて、トップレベルのプロパティへの変更を最小限に抑えるために、オプションの個別のセットとして整理されています。

デフォルトで無効になっているフィーチャーフラグを有効にするには、セットで指定します。例:

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

デフォルトで有効になっているフィーチャーフラグを無効にするには、その `disabled()` 関数を呼び出します。例:

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

Compose コンパイラを直接設定する場合、次の構文を使用してフィーチャーフラグを渡します。

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

サポートされているフィーチャーフラグのリストは、Compose コンパイラ Gradle プラグインのAPIリファレンスで確認してください。
[サポートされているフィーチャーフラグのリスト](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)