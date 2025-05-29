[//]: # (title: ComposeコンパイラオプションのDSL)

ComposeコンパイラのGradleプラグインは、さまざまなコンパイラオプションのDSLを提供します。
プラグインを適用するモジュールの`build.gradle.kts`ファイルの`composeCompiler {}`ブロックで、これを使用してコンパイラを設定できます。

指定できるオプションは2種類あります。

*   一般的なコンパイラ設定。これは、どのプロジェクトでも必要に応じて無効化または有効化できます。
*   新しい実験的な機能を有効または無効にするフィーチャーフラグ (Feature flags)。これらは最終的にはベースラインの一部となるべきものです。

ComposeコンパイラのGradleプラグインAPIリファレンスで、[利用可能な一般的な設定のリスト](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/)と[サポートされているフィーチャーフラグのリスト](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)を確認できます。

以下に設定例を示します。

```kotlin
composeCompiler {
    includeSourceInformation = true

    featureFlags = setOf(
        ComposeFeatureFlag.StrongSkipping.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups
    )
}
```

> Gradleプラグインは、Kotlin 2.0より前は手動でのみ指定されていたいくつかのComposeコンパイラオプションのデフォルト値を提供します。
> 例えば、それらのいずれかを`freeCompilerArgs`で設定している場合、Gradleは重複オプションエラーを報告します。
>
{style="warning"}

## フィーチャーフラグの目的と使用法

フィーチャーフラグは、新しいフラグが継続的に導入され、非推奨となるにつれて、トップレベルのプロパティへの変更を最小限に抑えるために、個別のオプションセットとして構成されています。

デフォルトで無効になっているフィーチャーフラグを有効にするには、次のようにセットで指定します。

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

デフォルトで有効になっているフィーチャーフラグを無効にするには、次のように`disabled()`関数を呼び出します。

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

Composeコンパイラを直接構成している場合、フィーチャーフラグを渡すには以下の構文を使用します。

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

ComposeコンパイラのGradleプラグインAPIリファレンスで、[サポートされているフィーチャーフラグのリスト](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)を参照してください。