[//]: # (title: 支持 Gradle 插件变体)

Gradle 7.0 为 Gradle 插件作者引入了一项新功能 — [带有变体的插件](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)。此功能使得在添加对最新 Gradle 功能支持的同时，保持与旧版本 Gradle 的兼容性变得更加容易。了解更多关于 [Gradle 中的变体选择](https://docs.gradle.org/current/userguide/variant_model.html)。

借助 Gradle 插件变体，Kotlin 团队可以为不同的 Gradle 版本发布不同的 Kotlin Gradle 插件 (KGP) 变体。目标是在 `main` 变体中支持基本的 Kotlin 编译，该变体对应于最旧的受支持 Gradle 版本。每个变体都将包含对应版本 Gradle 功能的实现。最新的变体将支持最新的 Gradle 功能集。通过这种方法，可以扩展对旧版本 Gradle 的支持，但功能会受限。

目前，Kotlin Gradle 插件有以下变体：

| 变体名称 | 对应的 Gradle 版本 |
|----------------|-------------------------------|
| `main`         | 7.6.0–7.6.3                   |
| `gradle80`     | 8.0–8.0.2                     |
| `gradle81`     | 8.1.1                         |
| `gradle82`     | 8.2.1–8.4                     |
| `gradle85`     | 8.5 及更高版本                |

在未来的 Kotlin 版本中，将添加更多变体。

要检查你的构建使用了哪个变体，请启用 [`--info` 日志级别](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level) 并在输出中查找以 `Using Kotlin Gradle plugin` 开头的字符串，例如，`Using Kotlin Gradle plugin main variant`。

## 故障排除

> 以下是针对 Gradle 中变体选择的一些已知问题的解决方法：
> * [pluginManagement 中的 ResolutionStrategy 对多变体插件无效](https://github.com/gradle/gradle/issues/20545)
> * [当插件作为 `buildSrc` 共同依赖项添加时，插件变体会被忽略](https://github.com/gradle/gradle/issues/20847)
>
{style="note"}

### Gradle 无法在自定义配置中选择 KGP 变体

这是 Gradle 无法在自定义配置中选择 KGP 变体的预期情况。
如果你使用自定义 Gradle 配置：

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

并想添加对 Kotlin Gradle 插件的依赖，例如：

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

你需要向你的 `customConfiguration` 添加以下属性：

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
            // 如果你想依赖特定的 KGP 变体：
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
            // 如果你想依赖特定的 KGP 变体：
            attribute(
                GradlePluginApiVersion.GRADLE_PLUGIN_API_VERSION_VERSION_ATTRIBUTE,
                project.objects.named('7.0')
            )
        }
    }
}
```

</tab>
</tabs>

否则，你将收到一个类似以下的错误：

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

## 接下来是什么？

了解更多关于 [Gradle 基础知识和具体细节](https://docs.gradle.org/current/userguide/userguide.html)。