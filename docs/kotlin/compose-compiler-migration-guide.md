[//]: # (title: Compose 编译器迁移指南)

Compose 编译器通过一个 Gradle 插件进行补充，该插件简化了设置，并提供了更便捷的编译器选项访问方式。
当与 Android Gradle 插件 (AGP) 一起使用时，此 Compose 编译器插件将覆盖 AGP 自动提供的 Compose 编译器坐标。

自 Kotlin 2.0.0 起，Compose 编译器已合并到 Kotlin 仓库中。
这有助于平滑地将您的项目迁移到 Kotlin 2.0.0 及更高版本，因为 Compose 编译器与 Kotlin 同步发布，并且始终与相同版本的 Kotlin 兼容。

要在项目中使用新的 Compose 编译器插件，请将其应用于每个使用 Compose 的模块。
继续阅读以了解有关如何[迁移 Jetpack Compose 项目](#migrating-a-jetpack-compose-project)的详情。对于 Compose Multiplatform 项目，请参阅[多平台迁移指南](https://kotlinlang.org/docs/multiplatform/compose-compiler.html#migrating-a-compose-multiplatform-project)。

## 迁移 Jetpack Compose 项目

从 1.9 迁移到 Kotlin 2.0.0 或更高版本时，应根据处理 Compose 编译器的方式调整项目配置。我们建议使用 Kotlin Gradle 插件和 Compose 编译器 Gradle 插件来自动进行配置管理。

### 使用 Gradle 插件管理 Compose 编译器

对于 Android 模块：

1. 将 Compose 编译器 Gradle 插件添加到 [Gradle 版本目录](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)中：

 ```
 [versions]
 # ...
 kotlin = "%kotlinVersion%"
 
 [plugins]
 # ...
 org-jetbrains-kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
 compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
 ```

> 如果您使用的是 AGP 9.0.0 或更高版本，则不再需要 `org-jetbrains-kotlin-android` 插件，因为 AGP 已内置 Kotlin 支持。
> 
{style ="note"}

2. 将 Gradle 插件添加到根 `build.gradle.kts` 文件中：

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler) apply false
 }
 ```

3. 将该插件应用于每个使用 Jetpack Compose 的模块：

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler)
 }
 ```

4. 如果您正在为 Jetpack Compose 编译器使用编译器选项，请在 `composeCompiler {}` 代码块中进行设置。请参阅[编译器选项列表](compose-compiler-options.md)以获取参考。

5. 如果您直接引用 Compose 编译器构件，可以移除这些引用，让 Gradle 插件来处理相关事务。

### 在不使用 Gradle 插件的情况下使用 Compose 编译器

如果您不使用 Gradle 插件来管理 Compose 编译器，请更新项目中对旧 Maven 构件的所有直接引用：

* 将 `androidx.compose.compiler:compiler` 更改为 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin-embeddable`
* 将 `androidx.compose.compiler:compiler-hosted` 更改为 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin`

## 下一步

* 查看 [Google 的公告](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)，了解有关 Compose 编译器移至 Kotlin 仓库的信息。
* 如果您正使用 Jetpack Compose 构建 Android 应用，请查看我们的[关于如何使其成为多平台的指南](https://kotlinlang.org/docs/multiplatform/multiplatform-integrate-in-existing-app.html)。