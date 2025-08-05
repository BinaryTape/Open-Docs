[//]: # (title: Gradleプラグインバリアントのサポート)

Gradle 7.0では、Gradleプラグイン開発者向けに新しい機能である「[バリアントを持つプラグイン](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)」が導入されました。この機能により、古いGradleバージョンとの互換性を維持しながら、最新のGradle機能のサポートを追加しやすくなります。Gradleにおける[バリアント選択の詳細](https://docs.gradle.org/current/userguide/variant_model.html)については、こちらを参照してください。

Gradleプラグインバリアントを使用すると、Kotlinチームは異なるGradleバージョン向けの異なるKotlin Gradleプラグイン (KGP) バリアントを提供できます。その目標は、`main`バリアントで基本的なKotlinコンパイルをサポートすることであり、これはサポートされる最も古いGradleバージョンに対応します。各バリアントは、対応するリリースからのGradle機能の実装を持ちます。最新のバリアントは、最新のGradle機能セットをサポートします。このアプローチにより、制限された機能で古いGradleバージョンへのサポートを拡張することが可能です。

現在、Kotlin Gradleプラグインには以下のバリアントがあります。

| Variant's name | Corresponding Gradle versions |
|----------------|-------------------------------|
| `main`         | 7.6.0–7.6.3                   |
| `gradle80`     | 8.0–8.0.2                     |
| `gradle81`     | 8.1.1                         |
| `gradle82`     | 8.2.1–8.4                     |
| `gradle85`     | 8.5                           |
| `gradle86`     | 8.6-8.7                       |
| `gradle88`     | 8.8-8.10                      |
| `gradle811`    | 8.11-8.12                     |
| `gradle813`    | 8.13 and higher               |

今後のKotlinリリースでは、さらなるバリアントが追加される予定です。

ビルドがどのバリアントを使用しているかを確認するには、[`--info`ログレベル](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)を有効にし、出力の中から`Using Kotlin Gradle plugin`で始まる文字列（例：`Using Kotlin Gradle plugin main variant`）を探します。

## トラブルシューティング

> Gradleにおけるバリアント選択の既知の問題に対する回避策を以下に示します。
> * [ResolutionStrategy in pluginManagement is not working for plugins with multivariants](https://github.com/gradle/gradle/issues/20545)
> * [Plugin variants are ignored when a plugin is added as the `buildSrc` common dependency](https://github.com/gradle/gradle/issues/20847)
>
{style="note"}

### Gradleがカスタム設定でKGPバリアントを選択できない場合

これは、Gradleがカスタム設定でKGPバリアントを選択できないという想定される状況です。
カスタムGradle設定を使用する場合:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
configurations.register("customConfiguration") {
    // ...
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
configurations.register("customConfiguration") {
    // ...
}
```

</tab>
</tabs>

そして、例えばKotlin Gradleプラグインへの依存関係を追加したい場合:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    customConfiguration("org.jetbrains.kotlin:kotlin-gradle-plugin:%kotlinVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    customConfiguration 'org.jetbrains.kotlin:kotlin-gradle-plugin:%kotlinVersion%'
}
```

</tab>
</tabs>

`customConfiguration`に以下の属性を追加する必要があります:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
configurations {
    customConfiguration {
        attributes {
            attribute(
                Usage.USAGE_ATTRIBUTE,
                project.objects.named(Usage.class, Usage.JAVA_RUNTIME)
            )
            attribute(
                Category.CATEGORY_ATTRIBUTE,
                project.objects.named(Category.class, Category.LIBRARY)
            )
            // 特定のKGPバリアントに依存したい場合:
            attribute(
                GradlePluginApiVersion.GRADLE_PLUGIN_API_VERSION_ATTRIBUTE,
                project.objects.named("7.0")
            )
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
configurations {
    customConfiguration {
        attributes {
            attribute(
                Usage.USAGE_ATTRIBUTE,
                project.objects.named(Usage, Usage.JAVA_RUNTIME)
            )
            attribute(
                Category.CATEGORY_ATTRIBUTE,
                project.objects.named(Category, Category.LIBRARY)
            )
            // 特定のKGPバリアントに依存したい場合:
            attribute(
                GradlePluginApiVersion.GRADLE_PLUGIN_API_VERSION_ATTRIBUTE,
                project.objects.named('7.0')
            )
        }
    }
}
```

</tab>
</tabs>

そうしないと、以下のようなエラーが表示されます:

```none
 > Could not resolve all files for configuration ':customConfiguration'.
      > Could not resolve org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.0.
        Required by:
            project :
         > Cannot choose between the following variants of org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.0:
             - gradle70RuntimeElements
             - runtimeElements
           All of them match the consumer attributes:
             - Variant 'gradle70RuntimeElements' capability org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.0:
                 - Unmatched attributes:
```

## 次のステップ

[Gradleの基本と詳細](https://docs.gradle.org/current/userguide/userguide.html)について、さらに詳しく学ぶことができます。