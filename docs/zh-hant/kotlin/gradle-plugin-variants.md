---
title: "支援 Gradle 外掛程式變體"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Gradle 7.0 引入了一個針對 Gradle 外掛程式作者的新功能 — [具有變體的外掛程式](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)。此功能讓新增對最新 Gradle 功能的支援變得更容易，同時保持與舊版 Gradle 的相容性。 了解更多關於 [Gradle 中的變體選擇](https://docs.gradle.org/current/userguide/variant_model.html)。

透過 Gradle 外掛程式變體，Kotlin 團隊可以為不同的 Gradle 版本發布不同的 Kotlin Gradle 外掛程式 (Kotlin Gradle plugin, KGP) 變體。 目標是在 `main` 變體中支援基本的 Kotlin 編譯，此變體對應於最早支援的 Gradle 版本。 每個變體都將具有來自相應版本的 Gradle 功能的實現。 最新的變體將支援最新的 Gradle 功能集。 透過這種方法，可以使用有限的功能擴展對舊版 Gradle 的支援。

目前，Kotlin Gradle 外掛程式有以下變體：

| 變體名稱 | 對應的 Gradle 版本 |
|----------------|-------------------------------|
| `main`         | 7.6.0–7.6.3                   |
| `gradle80`     | 8.0–8.0.2                     |
| `gradle81`     | 8.1.1                         |
| `gradle82`     | 8.2.1–8.4                     |
| `gradle85`     | 8.5 及更高版本                |

在未來的 Kotlin 版本中，將添加更多變體。

要檢查您的建置使用哪個變體，請啟用 [`--info` 日誌級別](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level) 並在輸出中找到以 `Using Kotlin Gradle plugin` 開頭的字串，例如 `Using Kotlin Gradle plugin main variant`。

## 問題排查

:::note
以下是 Gradle 中變體選擇的一些已知問題的解決方案：
* [ResolutionStrategy in pluginManagement is not working for plugins with multivariants](https://github.com/gradle/gradle/issues/20545)
* [Plugin variants are ignored when a plugin is added as the `buildSrc` common dependency](https://github.com/gradle/gradle/issues/20847)

:::

### Gradle 無法在自定義配置中選擇 KGP 變體

這是 Gradle 無法在自定義配置中選擇 KGP 變體的預期情況。
如果您使用自定義 Gradle 配置：

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

並且想要添加對 Kotlin Gradle 外掛程式的依賴，例如：

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

您需要將以下屬性添加到您的 `customConfiguration`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
configurations {
    customConfiguration {
        attributes {
            attribute(
                Usage.USAGE_ATTRIBUTE,
                project.objects.named(Usage::class.java, Usage.JAVA_RUNTIME)
            )
            attribute(
                Category.CATEGORY_ATTRIBUTE,
                project.objects.named(Category::class.java, Category.LIBRARY)
            )
            // 如果您想依賴特定的 KGP 變體：
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
            // 如果您想依賴特定的 KGP 變體：
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

否則，您將收到類似於以下的錯誤：

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

## 接下來做什麼？

了解更多關於 [Gradle 基礎知識和細節](https://docs.gradle.org/current/userguide/userguide.html)。