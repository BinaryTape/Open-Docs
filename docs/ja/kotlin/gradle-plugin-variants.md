---
title: "Gradle plugin variantsのサポート"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Gradle 7.0では、Gradleプラグインの作成者向けの新機能である[plugins with variants](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)が導入されました。
この機能により、古いGradleバージョンとの互換性を維持しながら、最新のGradle機能のサポートを簡単に追加できます。
詳しくは、[variant selection in Gradle](https://docs.gradle.org/current/userguide/variant_model.html)をご覧ください。

Gradle plugin variantsを使用すると、Kotlinチームは、異なるGradleバージョンに対して異なるKotlin Gradle plugin (KGP) variantsを提供できます。
その目標は、Gradleのサポート対象の最も古いバージョンに対応する`main` variantで、ベースとなるKotlinコンパイルをサポートすることです。各variantには、対応するリリースからのGradle機能の実装が含まれます。最新のvariantは、最新のGradle機能セットをサポートします。このアプローチにより、機能が制限された古いGradleバージョンのサポートを拡張することが可能です。

現在、Kotlin Gradle pluginには以下のvariantsがあります。

| Variant's name | Corresponding Gradle versions |
|----------------|-------------------------------|
| `main`         | 7.6.0–7.6.3                   |
| `gradle80`     | 8.0–8.0.2                     |
| `gradle81`     | 8.1.1                         |
| `gradle82`     | 8.2.1–8.4                     |
| `gradle85`     | 8.5 and higher                |

将来のKotlinリリースでは、さらにvariantsが追加される予定です。

ビルドで使用するvariantを確認するには、[`--info` log level](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)を有効にして、出力内の`Using Kotlin Gradle plugin`で始まる文字列（例：`Using Kotlin Gradle plugin main variant`）を見つけてください。

## Troubleshooting

:::note
Gradleのvariant選択に関する既知の問題の回避策を以下に示します。
* [ResolutionStrategy in pluginManagement is not working for plugins with multivariants](https://github.com/gradle/gradle/issues/20545)
* [Plugin variants are ignored when a plugin is added as the `buildSrc` common dependency](https://github.com/gradle/gradle/issues/20847)

:::

### Gradleがカスタム構成でKGP variantを選択できない

これは、Gradleがカスタム構成でKGP variantを選択できない場合に想定される状況です。
カスタムGradle構成を使用する場合：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
configurations.register("customConfiguration") {
    // ...
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
configurations.register("customConfiguration") {
    // ...
}
```

</TabItem>
</Tabs>

たとえば、Kotlin Gradle pluginへの依存関係を追加したい場合は、以下のようにします。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    customConfiguration("org.jetbrains.kotlin:kotlin-gradle-plugin:2.1.20")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    customConfiguration 'org.jetbrains.kotlin:kotlin-gradle-plugin:2.1.20'
}
```

</TabItem>
</Tabs>

`customConfiguration`に次の属性を追加する必要があります。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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
            // If you want to depend on a specific KGP variant:
            attribute(
                GradlePluginApiVersion.GRADLE_PLUGIN_API_VERSION_ATTRIBUTE,
                project.objects.named("7.0")
            )
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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
            // If you want to depend on a specific KGP variant:
            attribute(
                GradlePluginApiVersion.GRADLE_PLUGIN_API_VERSION_ATTRIBUTE,
                project.objects.named('7.0')
            )
        }
    }
}
```

</TabItem>
</Tabs>

そうしないと、次のようなエラーが発生します。

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

## What's next?

Learn more about [Gradle basics and specifics](https://docs.gradle.org/current/userguide/userguide.html).