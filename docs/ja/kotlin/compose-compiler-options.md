[//]: # (title: Compose コンパイラ オプション DSL)

Compose コンパイラ Gradle プラグインは、さまざまなコンパイラオプションを設定するための DSL を提供しています。
プラグインを適用しているモジュールの `build.gradle.kts` ファイル内にある `composeCompiler {}` ブロックを使用して、コンパイラの設定を行うことができます。

指定できるオプションには以下の 2 種類があります。

* 一般的なコンパイラ設定。プロジェクトに応じて必要に応じて有効化または無効化できます。
* 新規および実験的な機能を有効化または無効化する機能フラグ（Feature flags）。これらは最終的にベースラインの一部となる予定のものです。

利用可能な[一般的な設定の一覧](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/)およびサポートされている[機能フラグの一覧](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)は、Compose コンパイラ Gradle プラグインの API リファレンスで確認できます。

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

> Gradle プラグインは、Kotlin 2.0 より前は手動でしか指定できなかったいくつかの Compose コンパイラオプションに対して、デフォルト値を提供します。
> たとえば、それらのいずれかを `freeCompilerArgs` で設定している場合、Gradle はオプションの重複エラーを報告します。
>
{style="warning"}

## 機能フラグの目的と使用方法

機能フラグは、新しいフラグの導入（ロールアウト）や非推奨化が継続的に行われる中で、トップレベルのプロパティへの変更を最小限に抑えるために、独立したオプションのセットとして整理されています。

デフォルトで無効になっている機能フラグを有効にするには、セット内でそれを指定します。例：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

デフォルトで有効になっている機能フラグを無効にするには、そのフラグに対して `disabled()` 関数を呼び出します。例：

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

Compose コンパイラを直接設定している場合は、以下の構文を使用して機能フラグを渡します。

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

Compose コンパイラ Gradle プラグインの API リファレンスにある[サポートされている機能フラグの一覧](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)を参照してください。