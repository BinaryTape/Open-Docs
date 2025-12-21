[//]: # (title: Compose 编译器迁移指南)

Compose 编译器由一个 Gradle 插件补充，该插件简化了设置并提供了更便捷的编译器选项访问。
当与 Android Gradle 插件 (AGP) 一起应用时，此 Compose 编译器插件将覆盖 AGP 自动提供的 Compose 编译器的坐标。

自 Kotlin 2.0.0 起，Compose 编译器已合并到 Kotlin 版本库中。
这有助于顺利将您的项目迁移到 Kotlin 2.0.0 及更高版本，因为 Compose 编译器会与 Kotlin 同步发布，并且始终与相同版本的 Kotlin 兼容。

要在您的项目中使用新的 Compose 编译器插件，请为每个使用 Compose 的模块应用它。
关于如何[迁移 Jetpack Compose 项目](#migrating-a-jetpack-compose-project)的详细信息，请继续阅读。对于 Compose Multiplatform 项目，
请参考[多平台迁移指南](https://kotlinlang.org/docs/multiplatform/compose-compiler.html#migrating-a-compose-multiplatform-project)。

## 迁移 Jetpack Compose 项目

当从 Kotlin 1.9 迁移到 2.0.0 或更高版本时，您应该根据处理 Compose 编译器的方式调整您的项目配置。我们建议使用 Kotlin Gradle 插件和 Compose 编译器 Gradle 插件来自动化配置管理。

### 使用 Gradle 插件管理 Compose 编译器

对于 Android 模块：

1. 将 Compose 编译器 Gradle 插件添加到 [Gradle 版本目录](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml)：

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

2. 将 Gradle 插件添加到根 `build.gradle.kts` 文件：

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler) apply false
 }
 ```

3. 将插件应用于每个使用 Jetpack Compose 的模块：

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler)
 }
 ```

4. 如果您正在使用 Jetpack Compose 编译器的编译器选项，请在 `composeCompiler {}` 代码块中设置它们。
   关于[编译器选项列表](compose-compiler-options.md)，请参见。

5. 如果您直接引用 Compose 编译器构件，可以移除这些引用，让 Gradle 插件来处理。

### 不使用 Gradle 插件管理 Compose 编译器

如果您不使用 Gradle 插件来管理 Compose 编译器，请更新项目中对旧 Maven 构件的任何直接引用：

* 将 `androidx.compose.compiler:compiler` 更改为 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin-embeddable`
* 将 `androidx.compose.compiler:compiler-hosted` 更改为 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin`

## 后续步骤

* 关于 Compose 编译器迁移到 Kotlin 版本库，请参见 [Google 的公告](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)。
* 如果您正在使用 Jetpack Compose 构建 Android 应用，请查阅[关于如何使其支持多平台的指南](https://kotlinlang.org/docs/multiplatform/multiplatform-integrate-in-existing-app.html)。