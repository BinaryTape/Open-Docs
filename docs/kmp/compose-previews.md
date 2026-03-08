[//]: # (title: Compose UI 预览)

您可以创建 _preview_（预览）composable 函数，以便在 IDE（IntelliJ IDEA 和 Android Studio）中查看呈现的 UI，而无需运行模拟器。
这项 [Jetpack Compose 核心功能](https://developer.android.com/develop/ui/compose/tooling/previews) 允许您在各种配置中使用测试数据轻松地可视化单个组件。
此外，您可以使用 [Compose 热重载](compose-hot-reload.md) 立即查看代码更改在桌面 JVM 目标上运行的实时应用中的反映。

> 要在 Kotlin Multiplatform 项目的公共代码中启用 Compose 预览，您需要一个 Android 目标，因为预览依赖于 Android 库。
> 
{style="note"}

Compose Multiplatform 最初将受限的 `@Preview` 注解实现为一个自定义库，但从 1.10.0 版本开始，该实现已被弃用，因为原始的 AndroidX 注解现在已完全支持多平台。

在本页面中，您可以了解：

* [如何在不同项目配置的公共代码中启用预览](#preview-setup)，
* [如何使用以及通过额外参数自定义预览](#use-previews)，
* [支持的 Compose Multiplatform、AGP 和注解组合概览](#supported-configurations)。

## 预览设置

如果您是从零开始，可以使用 IDE 向导创建一个**新项目**，该向导已预先配置好。

首先，只需安装适用于 IntelliJ IDEA 和 Android Studio 的 [Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)。
新项目将包含一个可以直接使用的 `App` 函数，并带有 `@Preview` 注解：

![IDE 中的预览 composable 函数](compose-preview-split.png){width=700 style="block"}

要在**现有项目**中启用预览支持，请将必要的依赖项添加到 KMP 模块的 `build.gradle.kts` 文件中：

1. `commonMain` 源集的注解依赖项：根据 Compose Multiplatform 版本选择使用旧的或新的。
2. 类路径上的工具依赖项，其声明取决于 Android 配置。

注解依赖项应指向 `@Preview` 的其中一个实现，例如：

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            // 新注解，适用于 CMP 1.10.0 及更高版本
            implementation("org.jetbrains.compose.ui:ui-tooling-preview:1.10.0")
            // 导入新注解：
            // import androidx.compose.ui.tooling.preview.Preview

            // 旧注解，在 CMP 1.10.0 中已弃用
            implementation("org.jetbrains.compose.components:components-ui-tooling-preview:1.10.0")
            // 导入旧注解：
            // import org.jetbrains.compose.ui.tooling.preview.Preview
        }
    }
}
```

工具依赖项应根据您的 [Android 目标配置](#android-target-configurations)，通过以下两种方式之一在公共代码模块 `build.gradle.kts` 文件的根 `dependencies {}` 块中声明：

* 如果您使用的是 `com.android.application` 或 `com.android.library` 插件：

    ```kotlin
    dependencies {
        debugImplementation("org.jetbrains.compose.ui:ui-tooling:1.10.0")
    }
    ```
* If you're using the `com.android.kotlin.multiplatform.library` plugin:
* 如果您使用的是 `com.android.kotlin.multiplatform.library` 插件：

    ```kotlin
    dependencies {
        androidRuntimeClasspath("org.jetbrains.compose.ui:ui-tooling:1.10.0")
    }
    ```

## 使用预览

Compose Multiplatform 允许使用 Android 工具提供的完整预览功能。
您可以使预览具有交互性，将预览复制为图像，或者显示同一 `@Preview` composable 函数带不同参数的多个版本。
有关可用功能的更多详细信息，请查看 [Android 预览指南](https://developer.android.com/develop/ui/compose/tooling/previews)。

<video src="compose_preview_interactive_mode.mp4" alt="交互模式" width="350" preview-src="compose_preview_interactive_mode.png"/>

通过配置额外参数，您可以控制 `@Composable` 函数在设计时预览中的呈现方式。
Compose Multiplatform 支持 `@Preview` 注解的以下参数：

* `name`：预览的显示名称。
* `group`：预览的组名称，用于逻辑组织和选择性显示相关预览。
* `widthDp`：最大宽度，单位为 [dp](https://developer.android.com/reference/kotlin/androidx/compose/ui/unit/Dp)。
* `heightDp`：最大高度，单位为 dp。
* `locale`：应用的当前语言区域。
* `showBackground`：一个标志，用于确定是否为预览应用默认背景颜色。
* `backgroundColor`：一个 32 位 ARGB 颜色整数，定义预览的背景颜色。

## 支持的配置

根据您的依赖项版本和项目配置样式，有几种支持的组合可用于启用 Compose 预览：

* Compose Multiplatform 1.9，使用旧的 `@Preview` 注解，且 Android 通过 `androidTarget {}` 配置。
* Compose Multiplatform 1.10，使用旧的 `@Preview` 注解，且 Android 通过 `androidTarget {}` 配置。
* Compose Multiplatform 1.10，使用新的 `@Preview` 注解，且 Android 通过 `androidTarget {}` 配置。
* Compose Multiplatform 1.10，使用新的 `@Preview` 注解，且 Android 通过带有 AGP 9.0 的 `androidLibrary {}` 配置。
  有关升级 KMP 应用的详细信息，请参阅我们的 [AGP 9.0 迁移指南](multiplatform-project-agp-9-migration.md)。

> IntelliJ IDEA 即将支持 AGP 9.0，预计将于 2026 年第 1 季度推出。
>
{style="note"}

### 可用的注解

Compose Multiplatform 中有两个可用的 `@Preview` 注解：

* `androidx.compose.ui.tooling.preview.Preview`
  * 这是原始的 Android Jetpack 注解，在 Compose Multiplatform 1.10 中已支持多平台。它支持公共代码中 Android 声明的所有参数。
  * 必要的运行时依赖项为 `org.jetbrains.compose.ui:ui-tooling-preview`。
  * 这是今后推荐使用的注解。 
* `org.jetbrains.compose.ui.tooling.preview.Preview`
  * 这是该注解的第一个多平台实现，模拟了仅限 Android 的体验。它支持有限数量的参数，但提供了基础的预览功能。
  * 必要的运行时依赖项为 `org.jetbrains.compose.components:components-ui-tooling-preview`。
  * 此注解在 Compose Multiplatform 1.10 中已弃用。

要在共享代码中使用其中一个注解，请为您的 `commonMain` 源集添加相应的运行时依赖项，[如上所示](#preview-setup)。

### Android 目标配置

如果您的项目使用 Android Gradle 插件 8.x，则项目的 Kotlin Multiplatform 部分应使用 Android 应用程序 (`com.android.application`) 或 Android 库 (`com.android.library`) 插件，且 Android 配置包含在 `build.gradle.kts` 文件的 `androidTarget {}` 块中。

对于 Android Gradle 插件 9.0，有一个新的 [KMP Android 库插件](https://developer.android.com/kotlin/multiplatform/plugin) (`com.android.kotlin.multiplatform.library`)，它引入了用于 Android 配置的 `androidLibrary {}` 块。虽然也可以在 AGP 8.x 中使用此插件，但该组合存在已知问题，不建议使用。 

> 最新稳定版 Android Studio 已支持 AGP 9.0，但 IntelliJ IDEA 尚不支持，预计将于 2026 年第 1 季度支持。
>
{style="note"}

有关升级到 AGP 9.0 的详细信息，请参阅[我们的迁移页面](multiplatform-project-agp-9-migration.md)。