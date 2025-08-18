[//]: # (title: Kotlin Multiplatform IDE 插件发布)

[Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)可帮助你开发适用于 Android、iOS、桌面和 Web 的跨平台应用程序。请确保你拥有最新版本的插件，以便使用 Kotlin Multiplatform 项目。

> 该 IDE 插件目前仅适用于 macOS，对 Windows 和 Linux 的支持正在开发中。
> 
{style="note"}

该插件兼容 IntelliJ IDEA（版本 2025.1.1.1 及更高）和 Android Studio（版本 Narwhal 2025.1.1 及更高）。

> 关于 Kotlin Multiplatform Gradle 插件的信息，请参见其 [DSL 参考](multiplatform-dsl-reference.md)和[兼容性指南](multiplatform-compatibility-guide.md)。
> 
{style="tip"}

## 更新到最新版本

你的 IDE 会在新的 Kotlin Multiplatform 插件版本发布后立即提示更新。如果你接受建议，插件将更新到最新版本。要完成插件安装，请重启 IDE。

你可以在 **Settings** | **Plugins** 中查看插件版本并手动更新。

你需要兼容的 Kotlin 版本才能使插件正常工作。你可以在[发布详情](#release-details)中找到兼容版本。要检查和更新你的 Kotlin 版本，请前往 **Settings** | **Plugins** 或 **Tools** | **Kotlin** | **Configure Kotlin in Project**。

> 如果你没有安装兼容的 Kotlin 版本，Kotlin Multiplatform 插件将被禁用。
> 更新你的 Kotlin 版本，然后再次在 **Settings** | **Plugins** 中启用该插件。
>
{style="note"}

## 发布详情

下表列出了 Kotlin Multiplatform IDE 插件的发布版本：

<table> 

<tr>
<th>
发布信息
</th>
<th>
发布亮点
</th>
<th>
兼容的 Kotlin 版本
</th>
</tr>

<tr id="0.9">
<td>

**0.9**

发布日期：2025 年 5 月 19 日

</td>
<td>

Kotlin Multiplatform 插件已彻底重构：

* 为受支持的 IDE 集成了**新建项目**向导。
* 预检环境检测，有助于查找和解决设置问题，包括 Java、Android、Xcode 和 Gradle。
* 为所有受支持的平台自动生成运行配置，并为 iOS 和 Android 提供设备选择器。
* 跨语言支持：Swift 和 Kotlin 的跨语言导航和调试，以及 Swift 语法高亮和快速文档。
* Compose Multiplatform 支持：Kotlin Multiplatform 插件现在支持 Compose Multiplatform 资源、自动补全以及通用代码的 UI 预览（可以安全卸载[之前的 Compose Multiplatform 插件](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support)）。
* Compose 热重载：无需重启应用即可即时查看 UI 更改（适用于桌面 JVM 目标）。
    更多信息请参见[热重载文档](compose-hot-reload.md)。

已知问题：

* 在 Android Studio 中，Compose 调试器目前不适用于 Kotlin 2.1.20 和 2.1.21。
    此问题将在 Kotlin 2.2.0-RC2 中修复。

</td>
<td>

该插件兼容[任何 Kotlin 版本](https://kotlinlang.org/docs/releases.html#release-details)，
但其大部分功能性依赖于 Kotlin 2.1.21。
更新到最新的稳定 Kotlin 版本可确保最佳体验。

此版本还需要 K2 模式，因此请务必启用它：
在 **Settings** | **Languages & Frameworks** | **Kotlin** 中，勾选 **Enable K2 mode**。

</td>
</tr>

<tr>
<td>

**0.8.4**

发布日期：2024 年 12 月 6 日

</td>
<td>

* 支持 Kotlin 的 [K2 模式](https://kotlinlang.org/docs/k2-compiler-migration-guide.html#support-in-ides)，以提高稳定性和代码分析能力。

</td>
<td>

[任何 Kotlin 插件版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.8.3**

发布日期：2024 年 7 月 23 日

</td>
<td>

* 修复了 Xcode 兼容性问题。

</td>
<td>

[任何 Kotlin 插件版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.8.2**

发布日期：2024 年 5 月 16 日

</td>
<td>

* 支持 Android Studio Jellyfish 和新的 Canary 版本 Koala。
* 在共享模块中添加了 `sourceCompatibility` 和 `targetCompatibility` 的声明。

</td>
<td>

[任何 Kotlin 插件版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.8.1**

发布日期：2023 年 11 月 9 日

</td>
<td>

* Kotlin 更新至 1.9.20。
* Jetpack Compose 更新至 1.5.4。
* 默认启用 Gradle 构建和配置缓存。
* 为新的 Kotlin 版本重构了构建配置。
* iOS framework 默认现在为静态类型。
* 修复了使用 Xcode 15 在 iOS 设备上运行的问题。

</td>
<td>

[任何 Kotlin 插件版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.8.0**

发布日期：2023 年 10 月 5 日

</td>
<td>

* [KT-60169](https://youtrack.jetbrains.com/issue/KT-60169) 迁移到 Gradle 版本目录。
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) 将 `android` 重命名为 `androidTarget`。
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) 更新了 Kotlin 和依赖项版本。
* [KTIJ-26773](https://youtrack.jetbrains.com/issue/KTIJ-26773) 重构为使用 `-destination` 实参代替 `-sdk` 和 `-arch`。
* [KTIJ-25839](https://youtrack.jetbrains.com/issue/KTIJ-25839) 重构了生成的文件名。
* [KTIJ-27058](https://youtrack.jetbrains.com/issue/KTIJ-27058) 添加了 JVM 目标配置。
* [KTIJ-27160](https://youtrack.jetbrains.com/issue/KTIJ-27160) 支持 Xcode 15.0。
* [KTIJ-27158](https://youtrack.jetbrains.com/issue/KTIJ-27158) 将新模块向导移至实验性状态。

</td>
<td>

[任何 Kotlin 插件版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.6.0**

发布日期：2023 年 5 月 24 日

</td>
<td>

* 支持新的 Canary Android Studio Hedgehog。
* 更新了 Multiplatform 项目中 Kotlin、Gradle 和库的版本。
* 在 Multiplatform 项目中应用了新的 [`targetHierarchy.default()`](https://kotlinlang.org/docs/whatsnew1820.html#new-approach-to-source-set-hierarchy)。
* 在 Multiplatform 项目中将源代码集名称后缀应用于平台特有的文件。

</td>
<td>

[任何 Kotlin 插件版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.5.3**

发布日期：2023 年 4 月 12 日

</td>
<td>

* 更新了 Kotlin 和 Compose 版本。
* 修复了 Xcode 项目方案解析。
* 添加了方案产品类型检测。
* 如果存在，`iosApp` 方案现在默认选中。

</td>
<td>

[任何 Kotlin 插件版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.5.2**

发布日期：2023 年 1 月 30 日

</td>
<td>

* [修复了 Kotlin/Native 调试器的问题（Spotlight 索引缓慢）](https://youtrack.jetbrains.com/issue/KT-55988)。
* [修复了多模块项目中的 Kotlin/Native 调试器问题](https://youtrack.jetbrains.com/issue/KT-24450)。
* [适用于 Android Studio Giraffe 2022.3.1 Canary 的新构建](https://youtrack.jetbrains.com/issue/KT-55274)。
* [为 iOS 应用构建添加了预配标志](https://youtrack.jetbrains.com/issue/KT-55204)。
* [在生成的 iOS 项目中将继承路径添加到“Framework Search Paths”选项](https://youtrack.jetbrains.com/issue/KT-55402)。

</td>
<td>

[任何 Kotlin 插件版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.5.1**

发布日期：2022 年 11 月 30 日

</td>
<td>

* [修复了新项目生成问题：删除了多余的“app”目录](https://youtrack.jetbrains.com/issue/KTIJ-23790)。

</td>
<td>

[Kotlin 1.7.0—*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.5.0**

发布日期：2022 年 11 月 22 日

</td>
<td>

* [更改了 iOS framework 分发的默认选项：现在是 **Regular framework**](https://youtrack.jetbrains.com/issue/KT-54086)。
* [在生成的 Android 项目中将 `MyApplicationTheme` 移至单独的文件](https://youtrack.jetbrains.com/issue/KT-53991)。
* [更新了生成的 Android 项目](https://youtrack.jetbrains.com/issue/KT-54658)。
* [修复了新项目目录意外擦除的问题](https://youtrack.jetbrains.com/issue/KTIJ-23707)。

</td>
<td>

[Kotlin 1.7.0—*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.4**

发布日期：2022 年 9 月 12 日

</td>
<td>

* [将 Android 应用迁移到 Jetpack Compose](https://youtrack.jetbrains.com/issue/KT-53162)。
* [移除了过时的 HMPP 标志](https://youtrack.jetbrains.com/issue/KT-52248)。
* [从 Android 清单中移除了包名](https://youtrack.jetbrains.com/issue/KTIJ-22633)。
* [更新了 Xcode 项目的 `.gitignore` 文件](https://youtrack.jetbrains.com/issue/KT-53703)。
* [更新了向导项目以更好地说明 expect/actual](https://youtrack.jetbrains.com/issue/KT-53928)。
* [更新了与 Canary 构建的 Android Studio 的兼容性](https://youtrack.jetbrains.com/issue/KTIJ-22063)。
* [将最低 Android SDK 更新到 21，适用于 Android 应用](https://youtrack.jetbrains.com/issue/KTIJ-22505)。
* [修复了安装 Xcode 后首次启动的问题](https://youtrack.jetbrains.com/issue/KTIJ-22645)。
* [修复了 Apple 运行配置在 M1 上的问题](https://youtrack.jetbrains.com/issue/KTIJ-21781)。
* [修复了 Windows 操作系统上 `local.properties` 的问题](https://youtrack.jetbrains.com/issue/KTIJ-22037)。
* [修复了 Canary 构建的 Android Studio 上 Kotlin/Native 调试器的问题](https://youtrack.jetbrains.com/issue/KT-53976)。

</td>
<td>

[Kotlin 1.7.0—1.7.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.3**

发布日期：2022 年 6 月 9 日

</td>
<td>

* 更新了对 Kotlin IDE 插件 1.7.0 的依赖。

</td>
<td>

[Kotlin 1.7.0—1.7.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.2**

发布日期：2022 年 4 月 4 日

</td>
<td>

* 修复了 Android Studio 2021.2 和 2021.3 上 iOS 应用程序调试的性能问题。

</td>
<td>

[Kotlin 1.5.0—1.6.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.1**

发布日期：2022 年 2 月 15 日

</td>
<td>

* [在 Kotlin Multiplatform Mobile 向导中启用了 M1 iOS 模拟器](https://youtrack.jetbrains.com/issue/KT-51105)。
* 改进了 XcProjects 的索引性能：[KT-49777](https://youtrack.jetbrains.com/issue/KT-49777)、[KT-50779](https://youtrack.jetbrains.com/issue/KT-50779)。
* 构建脚本清理：使用 `kotlin("test")` 代替 `kotlin("test-common")` 和 `kotlin("test-annotations-common")`。
* 提高了与 [Kotlin 插件版本](https://youtrack.jetbrains.com/issue/KTIJ-20167)的兼容性区间。
* [修复了 Windows 主机上的 JVM 调试问题](https://youtrack.jetbrains.com/issue/KT-50699)。
* [修复了禁用插件后版本无效的问题](https://youtrack.jetbrains.com/issue/KT-50966)。

</td>
<td>

[Kotlin 1.5.0—1.6.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.3.0**

发布日期：2021 年 11 月 16 日

</td>
<td>

* [新建 Kotlin Multiplatform 库向导](https://youtrack.jetbrains.com/issue/KTIJ-19367)。
* 支持新型 Kotlin Multiplatform 库分发：[XCFramework](multiplatform-build-native-binaries.md#build-xcframeworks)。
* 为新的跨平台移动项目启用了[分层项目结构](multiplatform-hierarchy.md#manual-configuration)。
* 支持[显式 iOS 目标声明](https://youtrack.jetbrains.com/issue/KT-46861)。
* [在非 Mac 机器上启用了 Kotlin Multiplatform Mobile 插件向导](https://youtrack.jetbrains.com/issue/KT-48614)。
* [支持 Kotlin Multiplatform 模块向导中的子文件夹](https://youtrack.jetbrains.com/issue/KT-47923)。
* [支持 Xcode `Assets.xcassets` 文件](https://youtrack.jetbrains.com/issue/KT-49571)。
* [修复了插件类加载器异常](https://youtrack.jetbrains.com/issue/KT-48103)。
* 更新了 CocoaPods Gradle 插件模板。
* Kotlin/Native 调试器类型求值改进。
* 修复了使用 Xcode 13 启动 iOS 设备的问题。

</td>
<td>

[Kotlin 1.6.0](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.7**

发布日期：2021 年 8 月 2 日

</td>
<td>

* [为 AppleRunConfiguration 添加了 Xcode 配置选项](https://youtrack.jetbrains.com/issue/KTIJ-19054)。
* [添加了对 Apple M1 模拟器的支持](https://youtrack.jetbrains.com/issue/KT-47618)。
* [在项目向导中添加了关于 Xcode 集成选项的信息](https://youtrack.jetbrains.com/issue/KT-47466)。
* [添加了错误通知，当生成了 CocoaPods 项目但未安装 CocoaPods gem 时](https://youtrack.jetbrains.com/issue/KT-47329)。
* [在生成的共享模块中添加了对 Kotlin 1.5.30 的 Apple M1 模拟器目标支持](https://youtrack.jetbrains.com/issue/KT-47631)。
* [清除了使用 Kotlin 1.5.20 生成的 Xcode 项目](https://youtrack.jetbrains.com/issue/KT-47465)。
* 修复了在真实 iOS 设备上启动 Xcode 发布配置的问题。
* 修复了使用 Xcode 12.5 启动模拟器的问题。

</td>
<td>

[Kotlin 1.5.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.6**

发布日期：2021 年 6 月 10 日

</td>
<td>

* 兼容 Android Studio Bumblebee Canary 1。
* 支持 [Kotlin 1.5.20](https://kotlinlang.org/docs/whatsnew1520.html)：在项目向导中使用 Kotlin/Native 的新 framework 打包任务。

</td>
<td>

[Kotlin 1.5.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.5**

发布日期：2021 年 5 月 25 日

</td>
<td>

* [修复了与 Android Studio Arctic Fox 2020.3.1 Beta 1 及更高版本的兼容性问题](https://youtrack.jetbrains.com/issue/KT-46834)。

</td>
<td>

[Kotlin 1.5.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.4**

发布日期：2021 年 5 月 5 日

</td>
<td>

请将此插件版本与 Android Studio 4.2 或 Android Studio 2020.3.1 Canary 8 及更高版本一起使用。
* 兼容 [Kotlin 1.5.0](https://kotlinlang.org/docs/whatsnew15.html)。
* [能够在 Kotlin Multiplatform 模块中使用 CocoaPods 依赖项管理器进行 iOS 集成](https://youtrack.jetbrains.com/issue/KT-45946)。

</td>
<td>

[Kotlin 1.5.0](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.3**

发布日期：2021 年 4 月 5 日

</td>
<td>

* [项目向导：模块命名改进](https://youtrack.jetbrains.com/issues?q=issue%20id:%20KT-43449,%20KT-44060,%20KT-41520,%20KT-45282)。
* [能够在项目向导中使用 CocoaPods 依赖项管理器进行 iOS 集成](https://youtrack.jetbrains.com/issue/KT-45478)。
* [提高了新项目中 gradle.properties 的可读性](https://youtrack.jetbrains.com/issue/KT-42908)。
* [如果“为共享模块添加示例测试”未勾选，则不再生成示例测试](https://youtrack.jetbrains.com/issue/KT-43441)。
* [修复及其他改进](https://youtrack.jetbrains.com/issues?q=Subsystems:%20%7BKMM%20Plugin%7D%20Type:%20Feature,%20Bug%20State:%20-Obsolete,%20-%7BAs%20designed%7D,%20-Answered,%20-Incomplete%20resolved%20date:%202021-03-10%20..%202021-03-25)。

</td>
<td>

[Kotlin 1.4.30](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.2**

发布日期：2021 年 3 月 3 日

</td>
<td>

* [能够使用 Xcode 打开 Xcode 相关文件](https://youtrack.jetbrains.com/issue/KT-44970)。
* [能够设置 Xcode 项目文件在 iOS 运行配置中的位置](https://youtrack.jetbrains.com/issue/KT-44968)。
* [支持 Android Studio 2020.3.1 Canary 8](https://youtrack.jetbrains.com/issue/KT-45162)。
* [修复及其他改进](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.2%20)。

</td>
<td>

[Kotlin 1.4.30](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.1**

发布日期：2021 年 2 月 15 日

</td>
<td>

请将此插件版本与 Android Studio 4.2 一起使用。
* 基础设施改进。
* [修复及其他改进](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.1%20)。

</td>
<td>

[Kotlin 1.4.30](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.2.0**

发布日期：2020 年 11 月 23 日

</td>
<td>

* [支持 iPad 设备](https://youtrack.jetbrains.com/issue/KT-41932)。
* [支持在 Xcode 中配置的自定义方案名称](https://youtrack.jetbrains.com/issue/KT-41677)。
* [能够为 iOS 运行配置添加自定义构建步骤](https://youtrack.jetbrains.com/issue/KT-41678)。
* [能够调试自定义 Kotlin/Native 二进制文件](https://youtrack.jetbrains.com/issue/KT-40954)。
* [简化了 Kotlin Multiplatform Mobile 向导生成的代码](https://youtrack.jetbrains.com/issue/KT-41712)。
* [移除了对 Kotlin Android Extensions 插件的支持](https://youtrack.jetbrains.com/issue/KT-42121)，该插件在 Kotlin 1.4.20 中已弃用。
* [修复了从主机断开连接后保存物理设备配置的问题](https://youtrack.jetbrains.com/issue/KT-42390)。
* 其他修复及改进。

</td>
<td>

[Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.1.3**

发布日期：2020 年 10 月 2 日

</td>
<td>

* 添加了对 iOS 14 和 Xcode 12 的兼容性。
* 修复了 Kotlin Multiplatform Mobile 向导创建的平台测试中的命名问题。

</td>
<td>

* [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)
* [Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.1.2**

发布日期：2020 年 9 月 29 日

</td>
<td>

 * 修复了与 [Kotlin 1.4.20-M1](https://youtrack.jetbrains.com/issue/KT-44970) 的兼容性。
 * 默认启用向 JetBrains 报告错误。

</td>
<td>

* [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)
* [Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.1.1**

发布日期：2020 年 9 月 10 日

</td>
<td>

* 修复了与 Android Studio Canary 8 及更高版本的兼容性。

</td>
<td>

* [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)
* [Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.1.0**

发布日期：2020 年 8 月 31 日

</td>
<td>

* Kotlin Multiplatform Mobile 插件的首个版本。在[博客文章](https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/)中了解更多信息。

</td>
<td>

* [Kotlin 1.4.0](https://kotlinlang.org/docs/releases.html#release-details)
* [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

</table>