[//]: # (title: Gradle プラグインのバリアントのサポート)

Gradle 7.0 では、Gradle プラグインの作成者向けに新機能である[バリアントを持つプラグイン](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)が導入されました。この機能により、以前の Gradle バージョンとの互換性を維持しながら、最新の Gradle 機能のサポートを簡単に追加できるようになります。[Gradle のバリアント選択](https://docs.gradle.org/current/userguide/variant_model.html)について詳しくはこちらをご覧ください。

Gradle プラグインのバリアントを使用すると、Kotlin チームはさまざまな Gradle バージョン向けに異なる Kotlin Gradle プラグイン (KGP) のバリアントを提供できます。目標は、Gradle の最も古いサポート対象バージョンに対応する `main` バリアントで、Kotlin の基本的なコンパイルをサポートすることです。各バリアントには、対応するリリースからの Gradle 機能の実装が含まれます。最新のバリアントは、最新の Gradle 機能セットをサポートします。このアプローチにより、限定された機能ではあるものの、古い Gradle バージョンのサポートを拡張することが可能です。

現在、Kotlin Gradle プラグインには以下のバリアントがあります。

| バリアント名 | 対応する Gradle バージョン |
|----------------|-------------------------------|
| `main`         | 7.6.0–7.6.3                   |
| `gradle80`     | 8.0–8.0.2                     |
| `gradle81`     | 8.1.1                         |
| `gradle82`     | 8.2.1–8.4                     |
| `gradle85`     | 8.5 and higher                |

今後の Kotlin リリースでは、さらに多くのバリアントが追加される予定です。

ビルドがどのバリアントを使用しているかを確認するには、[`--info` ログレベル](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)を有効にし、出力で `Using Kotlin Gradle plugin` から始まる文字列を探します。例えば、`Using Kotlin Gradle plugin main variant` のようになります。

## トラブルシューティング

> Gradle のバリアント選択に関するいくつかの既知の問題に対する回避策を以下に示します。
> * [ResolutionStrategy in pluginManagement is not working for plugins with multivariants](https://github.com/gradle/gradle/issues/20545)
> * [Plugin variants are ignored when a plugin is added as the `buildSrc` common dependency](https://github.com/gradle/gradle/issues/20847)
>
{style="note"}

### カスタム設定で KGP バリアントを Gradle が選択できない

これは、カスタム設定で Gradle が KGP バリアントを選択できないという、予期される状況です。
カスタム Gradle 設定を使用している場合：

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

そして、例えば Kotlin Gradle プラグインに依存関係を追加したい場合：

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

`customConfiguration` に以下の属性を追加する必要があります。

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
            // 特定の KGP バリアントに依存したい場合：
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
            // 特定の KGP バリアントに依存したい場合：
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

そうしないと、次のようなエラーが表示されます。

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

[Gradle の基本と詳細](https://docs.gradle.org/current/userguide/userguide.html)について詳しくはこちらをご覧ください。