---
title: "支持 Gradle 插件变体"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Gradle 7.0 引入了一个针对 Gradle 插件作者的新特性 — [具有变体的插件](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)（plugins with variants）。
这个特性使得在保持与旧版本 Gradle 兼容性的同时，更容易添加对最新 Gradle 特性的支持。
了解更多关于 [Gradle 中的变体选择](https://docs.gradle.org/current/userguide/variant_model.html)（variant selection in Gradle）的信息。

通过 Gradle 插件变体，Kotlin 团队可以为不同的 Gradle 版本发布不同的 Kotlin Gradle 插件（KGP）变体。
目标是在 `main` 变体中支持基本的 Kotlin 编译，该变体对应于 Gradle 支持的最旧版本。
每个变体都将具有相应版本 Gradle 特性的实现。最新的变体将支持最新的 Gradle 特性集。通过这种方法，可以使用有限的功能扩展对旧版本 Gradle 的支持。

目前，Kotlin Gradle 插件有以下变体：

| 变体名称 | 对应的 Gradle 版本 |
|---|---|
| `main` | 7.6.0–7.6.3 |
| `gradle80` | 8.0–8.0.2 |
| `gradle81` | 8.1.1 |
| `gradle82` | 8.2.1–8.4 |
| `gradle85` | 8.5 及更高版本 |

在未来的 Kotlin 版本中，将添加更多变体。

要检查你的构建使用哪个变体，请启用 [`--info` 日志级别](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)，并在输出中找到以 `Using Kotlin Gradle plugin` 开头的字符串，例如 `Using Kotlin Gradle plugin main variant`。

## 问题排查

:::note
以下是 Gradle 中变体选择的一些已知问题的解决方法：
* [ResolutionStrategy in pluginManagement is not working for plugins with multivariants](https://github.com/gradle/gradle/issues/20545)
* [Plugin variants are ignored when a plugin is added as the `buildSrc` common dependency](https://github.com/gradle/gradle/issues/20847)

:::

### Gradle 无法在自定义配置中选择 KGP 变体

这是 Gradle 无法在自定义配置中选择 KGP 变体的预期情况。
如果你使用自定义 Gradle 配置：

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

并且想要添加对 Kotlin Gradle 插件的依赖，例如：

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

你需要将以下属性添加到你的 `customConfiguration` 中：

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

否则，你将收到类似于以下的错误：

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

## 接下来做什么？

了解更多关于 [Gradle 基础和细节](https://docs.gradle.org/current/userguide/userguide.html)。