[//]: # (title: 更新 Compose 编译器)

Compose 编译器通过一个 Gradle 插件进行补充，该插件简化了设置并提供了更便捷的编译器选项访问。当与 Android Gradle 插件 (AGP) 一起应用时，此 Compose 编译器插件将覆盖 AGP 自动提供的 Compose 编译器的坐标。

自 Kotlin 2.0.0 起，Compose 编译器已合并到 Kotlin 版本库中。这有助于项目平稳迁移到 Kotlin 2.0.0 及更高版本，因为 Compose 编译器与 Kotlin 同时发布，并且将始终与相同版本的 Kotlin 兼容。

> 强烈建议您将使用 Kotlin 2.0.0 创建的 Compose Multiplatform 应用更新到 2.0.10 或更高版本。Compose 编译器 2.0.0 存在一个问题，在多平台项目中，对于非 JVM 目标，它有时会错误地推断类型稳定性，这可能导致不必要的（甚至无限的）重组。
>
> 如果您的应用使用 Compose 编译器 2.0.10 或更高版本构建，但使用了使用 Compose 编译器 2.0.0 构建的依赖项，则这些旧的依赖项仍可能导致重组问题。
> 为防止这种情况，请将您的依赖项更新到与您的应用使用相同 Compose 编译器构建的版本。
{style="warning"}

要在您的项目中使用新的 Compose 编译器插件，请将其应用于每个使用 Compose 的模块。关于如何[迁移 Compose Multiplatform 项目](#migrating-a-compose-multiplatform-project)的详细信息，请参阅下文。对于 Jetpack Compose 项目，请参考[迁移指南](https://kotlinlang.org/docs/compose-compiler-migration-guide.html#migrating-a-jetpack-compose-project)。

## 迁移 Compose Multiplatform 项目

从 Compose Multiplatform 1.6.10 开始，您应该将 `org.jetbrains.kotlin.plugin.compose` Gradle 插件应用于每个使用 `org.jetbrains.compose` 插件的模块：

1.  将 Compose 编译器 Gradle 插件添加到 [Gradle 版本目录](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)：

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

2.  将 Gradle 插件添加到根 `build.gradle.kts` 文件中：

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

4.  如果您正在为 Jetpack Compose 编译器使用编译器选项，请在 `composeCompiler {}` 代码块中设置它们。关于详细信息，请参见 [Compose compiler options DSL](https://kotlinlang.org/docs/compose-compiler-options.html)。

#### 可能的问题：“Missing resource with path”

当从 Kotlin 1.9.0 切换到 2.0.0，或从 2.0.0 切换到 1.9.0 时，您可能会遇到以下错误：

```
org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: ...
```

要解决此问题，请删除所有 `build` 目录：包括项目根目录下的和每个模块中的 `build` 目录。

## 下一步

*   关于 Compose 编译器迁移到 Kotlin 版本库的详细信息，请参见 [Google 的公告](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)。
*   关于详细信息，请参见 [Compose compiler options DSL](https://kotlinlang.org/docs/compose-compiler-options.html)。
*   要迁移 Jetpack Compose 应用，请查看 [Compose 编译器文档](https://kotlinlang.org/docs/compose-compiler-migration-guide.html)。