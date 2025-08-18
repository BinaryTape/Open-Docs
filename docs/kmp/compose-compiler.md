[//]: # (title: 更新 Compose compiler)

Compose compiler 由一个 Gradle 插件补充，该插件简化了设置并提供了对编译器选项的更便捷访问。当与 Android Gradle 插件 (AGP) 一起应用时，此 Compose compiler 插件将覆盖 AGP 自动提供的 Compose compiler 的坐标。

自 Kotlin 2.0.0 起，Compose compiler 已合并到 Kotlin 版本库中。这有助于平稳迁移您的项目到 Kotlin 2.0.0 及更高版本，因为 Compose compiler 与 Kotlin 同步发布，并且将始终与相同版本的 Kotlin 兼容。

> 强烈建议您将使用 Kotlin 2.0.0 创建的 Compose Multiplatform 应用更新到 2.0.10 或更高版本。Compose compiler 2.0.0 存在一个问题，在包含非 JVM 目标的跨平台项目中，它有时会错误地推断类型的稳定性，这可能导致不必要的（甚至无限的）重组。
>
> 如果您的应用是使用 Compose compiler 2.0.10 或更高版本构建的，但使用了用 Compose compiler 2.0.0 构建的依赖项，这些旧的依赖项仍可能导致重组问题。
> 为防止此问题，请将您的依赖项更新到与您的应用使用相同 Compose compiler 构建的版本。
>
{style="warning"}

要在您的项目中启用新的 Compose compiler 插件，请将其应用于每个使用 Compose 的模块。关于如何[迁移 Compose Multiplatform 项目](#migrating-a-compose-multiplatform-project)的详细信息，请继续阅读。对于 Jetpack Compose 项目，关于[迁移指南](https://kotlinlang.org/docs/compose-compiler-migration-guide.html#migrating-a-jetpack-compose-project)请参考。

## 迁移 Compose Multiplatform 项目

从 Compose Multiplatform 1.6.10 开始，您应该将 `org.jetbrains.kotlin.plugin.compose` Gradle 插件应用于每个使用 `org.jetbrains.compose` 插件的模块：

1.  将 Compose compiler Gradle 插件添加到 [Gradle 版本目录](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)：

    ```
    [versions]
    # ...
    kotlin = "%kotlinVersion%"
    compose-plugin = "%org.jetbrains.compose%"
 
    [plugins]
    # ...
    jetbrainsCompose = { id = "org.jetbrains.compose", version.ref = "compose-plugin" }
    kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
    compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
    ```

2.  将 Gradle 插件添加到根 `build.gradle.kts` 文件：

    ```kotlin
    plugins {
     // ...
     alias(libs.plugins.jetbrainsCompose) apply false
     alias(libs.plugins.compose.compiler) apply false
    }
    ```

3.  将插件应用于每个使用 Compose Multiplatform 的模块：

    ```kotlin
    plugins { 
        // ...
        alias(libs.plugins.jetbrainsCompose)
        alias(libs.plugins.compose.compiler)
    }
    ```

4.  如果您正在使用 Jetpack Compose compiler 的编译器选项，请在 `composeCompiler {}` 代码块中设置它们。关于 [Compose compiler options DSL](https://kotlinlang.org/docs/compose-compiler-options.html) 请参考。

#### 可能的问题：“缺少路径资源”

从 Kotlin 1.9.0 切换到 2.0.0，或者从 2.0.0 切换到 1.9.0 时，您可能会遇到以下错误：

```
org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...
```

要解决此问题，请删除所有 `build` 目录：包括项目根目录下的和每个模块中的。

## 接下来

*   关于 Compose compiler 迁移到 Kotlin 版本库的 [Google 公告](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)，请参见。
*   关于 [Compose compiler options DSL](https://kotlinlang.org/docs/compose-compiler-options.html)，请参考。
*   要迁移 Jetpack Compose 应用，请查看 [Compose compiler 文档](https://kotlinlang.org/docs/compose-compiler-migration-guide.html)。