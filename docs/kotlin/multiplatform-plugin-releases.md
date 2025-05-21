---
title: "Kotlin Multiplatform 插件发布"
---
确保您拥有最新版本的 [Kotlin Multiplatform plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile) 以便继续在 Android Studio 中使用 Kotlin Multiplatform 项目。

## 更新到新版本

Android Studio 会在新 Kotlin Multiplatform 插件版本可用时立即建议更新。 如果您接受该建议，它将自动将插件更新到最新版本。您需要重启 Android Studio 才能完成插件安装。

您可以在 **Settings/Preferences** | **Plugins** 中检查插件版本并手动更新。

您需要与插件兼容的 Kotlin 版本才能正常工作。 您可以在 [发布详情](#release-details)中找到兼容的版本。您可以在 **Settings/Preferences** | **Plugins** 或 **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates** 中检查您的 Kotlin 版本并进行更新。

:::note
如果您没有安装兼容的 Kotlin 版本，Kotlin Multiplatform 插件将被禁用。 您需要更新您的 Kotlin 版本，然后在 **Settings/Preferences** | **Plugins** 中启用该插件。

:::

## 发布详情

下表列出了最新的 Kotlin Multiplatform 插件版本的详细信息：
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
<tr>
<td>

**0.8.4**

发布日期：2024 年 12 月 6 日
</td>
<td>

* 支持 Kotlin 的 [K2 模式](k2-compiler-migration-guide#support-in-ides)，以提高稳定性和代码分析能力。
</td>
<td>

* [任何 Kotlin 插件版本](releases#release-details)
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

* [任何 Kotlin 插件版本](releases#release-details)
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

* [任何 Kotlin 插件版本](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.8.1**

发布日期：2023 年 11 月 9 日
</td>
<td>

* 将 Kotlin 更新至 1.9.20。
* 将 Jetpack Compose 更新至 1.5.4。
* 默认启用 Gradle 构建和配置缓存。
* 为新的 Kotlin 版本重构了构建配置。
* iOS framework 现在默认为静态。
* 修复了在 Xcode 15 上运行 iOS 设备的问题。
</td>
<td>

* [任何 Kotlin 插件版本](releases#release-details)
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
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) 更新 Kotlin 和依赖版本。
* [KTIJ-26773](https://youtrack.jetbrains.com/issue/KTIJ-26773) 重构为使用 `-destination` 参数代替 `-sdk` 和 `-arch`。
* [KTIJ-25839](https://youtrack.jetbrains.com/issue/KTIJ-25839) 重构了生成的文件名。
* [KTIJ-27058](https://youtrack.jetbrains.com/issue/KTIJ-27058) 添加了 JVM target 配置。
* [KTIJ-27160](https://youtrack.jetbrains.com/issue/KTIJ-27160) 支持 Xcode 15.0。
* [KTIJ-27158](https://youtrack.jetbrains.com/issue/KTIJ-27158) 将新模块向导移至实验状态。
</td>
<td>

* [任何 Kotlin 插件版本](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.6.0**

发布日期：2023 年 5 月 24 日
</td>
<td>

* 支持新的 Canary Android Studio Hedgehog。
* 更新了 Multiplatform 项目中的 Kotlin、Gradle 和库的版本。
* 在 Multiplatform 项目中应用了新的 [`targetHierarchy.default()`](whatsnew1820#new-approach-to-source-set-hierarchy)。
* 在 Multiplatform 项目中将源集名称后缀应用于平台特定文件。
</td>
<td>

* [任何 Kotlin 插件版本](releases#release-details)
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
* 添加了方案产品类型检查。
* 如果存在，现在默认选择 `iosApp` 方案。
</td>
<td>

* [任何 Kotlin 插件版本](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.5.2**

发布日期：2023 年 1 月 30 日
</td>
<td>

* [修复了 Kotlin/Native 调试器的问题（Spotlight 索引速度慢）](https://youtrack.jetbrains.com/issue/KT-55988)。
* [修复了多模块项目中的 Kotlin/Native 调试器](https://youtrack.jetbrains.com/issue/KT-24450)。
* [Android Studio Giraffe 2022.3.1 Canary 的新构建](https://youtrack.jetbrains.com/issue/KT-55274)。
* [为 iOS 应用程序构建添加了 provisioning 标志](https://youtrack.jetbrains.com/issue/KT-55204)。
* [在生成的 iOS 项目中，将继承的路径添加到 **Framework Search Paths** 选项](https://youtrack.jetbrains.com/issue/KT-55402)。
</td>
<td>

* [任何 Kotlin 插件版本](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.5.1**

发布日期：2022 年 11 月 30 日
</td>
<td>

* [修复了新项目生成：删除多余的 "app" 目录](https://youtrack.jetbrains.com/issue/KTIJ-23790)。
</td>
<td>

* [Kotlin 1.7.0—*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.5.0**

发布日期：2022 年 11 月 22 日
</td>
<td>

* [更改了 iOS framework 分发的默认选项：现在是 **Regular framework**](https://youtrack.jetbrains.com/issue/KT-54086)。
* [在生成的 Android 项目中，将 `MyApplicationTheme` 移动到单独的文件](https://youtrack.jetbrains.com/issue/KT-53991)。
* [更新了生成的 Android 项目](https://youtrack.jetbrains.com/issue/KT-54658)。
* [修复了意外擦除新项目目录的问题](https://youtrack.jetbrains.com/issue/KTIJ-23707)。
</td>
<td>

* [Kotlin 1.7.0—*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.4**

发布日期：2022 年 9 月 12 日
</td>
<td>

* [将 Android 应用程序迁移到 Jetpack Compose](https://youtrack.jetbrains.com/issue/KT-53162)。
* [删除了过时的 HMPP 标志](https://youtrack.jetbrains.com/issue/KT-52248)。
* [从 Android 清单中删除包名](https://youtrack.jetbrains.com/issue/KTIJ-22633)。
* [更新了 Xcode 项目的 `.gitignore`](https://youtrack.jetbrains.com/issue/KT-53703)。
* [更新了向导项目，以更好地说明 expect/actual](https://youtrack.jetbrains.com/issue/KT-53928)。
* [更新了与 Android Studio Canary 版本的兼容性](https://youtrack.jetbrains.com/issue/KTIJ-22063)。
* [将 Android 应用程序的最低 Android SDK 更新为 21](https://youtrack.jetbrains.com/issue/KTIJ-22505)。
* [修复了安装 Xcode 后首次启动的问题](https://youtrack.jetbrains.com/issue/KTIJ-22645)。
* [修复了 M1 上的 Apple 运行配置问题](https://youtrack.jetbrains.com/issue/KTIJ-21781)。
* [修复了 Windows 操作系统上的 `local.properties` 问题](https://youtrack.jetbrains.com/issue/KTIJ-22037)。
* [修复了 Android Studio Canary 版本上的 Kotlin/Native 调试器问题](https://youtrack.jetbrains.com/issue/KT-53976)。
</td>
<td>

* [Kotlin 1.7.0—1.7.*](releases#release-details)
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

* [Kotlin 1.7.0—1.7.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.2**

发布日期：2022 年 4 月 4 日
</td>
<td>

* 修复了在 Android Studio 2021.2 和 2021.3 上调试 iOS 应用程序的性能问题。
</td>
<td>

* [Kotlin 1.5.0—1.6.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.1**

发布日期：2022 年 2 月 15 日
</td>
<td>

* [在 Kotlin Multiplatform Mobile 向导中启用了 M1 iOS 模拟器](https://youtrack.jetbrains.com/issue/KT-51105)。
* 提高了 XcProjects 索引的性能：[KT-49777](https://youtrack.jetbrains.com/issue/KT-49777), [KT-50779](https://youtrack.jetbrains.com/issue/KT-50779)。
* 构建脚本清理：使用 `kotlin("test")` 代替 `kotlin("test-common")` 和 `kotlin("test-annotations-common")`。
* 增加了与 [Kotlin 插件版本](https://youtrack.jetbrains.com/issue/KTIJ-20167) 的兼容性范围。
* [修复了 Windows 主机上的 JVM 调试问题](https://youtrack.jetbrains.com/issue/KT-50699)。
* [修复了禁用插件后版本无效的问题](https://youtrack.jetbrains.com/issue/KT-50966)。
</td>
<td>

* [Kotlin 1.5.0—1.6.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.0**

发布日期：2021 年 11 月 16 日
</td>
<td>

* [新的 Kotlin Multiplatform Library 向导](https://youtrack.jetbrains.com/issue/KTIJ-19367)。
* 支持新的 Kotlin Multiplatform 库分发类型：[XCFramework](multiplatform-build-native-binaries#build-xcframeworks)。
* 为新的跨平台移动项目启用了[分层项目结构](multiplatform-hierarchy#manual-configuration)。
* 支持 [显式的 iOS targets 声明](https://youtrack.jetbrains.com/issue/KT-46861)。
* [在非 Mac 机器上启用了 Kotlin Multiplatform Mobile 插件向导](https://youtrack.jetbrains.com/issue/KT-48614)。
* [支持 Kotlin Multiplatform 模块向导中的子文件夹](https://youtrack.jetbrains.com/issue/KT-47923)。
* [支持 Xcode `Assets.xcassets` 文件](https://youtrack.jetbrains.com/issue/KT-49571)。
* [修复了插件类加载器异常](https://youtrack.jetbrains.com/issue/KT-48103)。
* 更新了 CocoaPods Gradle 插件模板。
* Kotlin/Native 调试器类型评估改进。
* 修复了使用 Xcode 13 启动 iOS 设备的问题。
</td>
<td>

* [Kotlin 1.6.0](releases#release-details)
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
* [在 Project Wizard 中添加了有关 Xcode 集成选项的信息](https://youtrack.jetbrains.com/issue/KT-47466)。
* [添加了在生成带有 CocoaPods 的项目后，但尚未安装 CocoaPods gem 的错误通知](https://youtrack.jetbrains.com/issue/KT-47329)。
* [在 Kotlin 1.5.30 生成的共享模块中添加了对 Apple M1 模拟器目标的支持](https://youtrack.jetbrains.com/issue/KT-47631)。
* [使用 Kotlin 1.5.20 清理了生成的 Xcode 项目](https://youtrack.jetbrains.com/issue/KT-47465)。
* 修复了在真实 iOS 设备上启动 Xcode Release 配置的问题。
* 修复了使用 Xcode 12 启动模拟器的问题。
</td>
<td>

* [Kotlin 1.5.10](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.6**

发布日期：2021 年 6 月 10 日
</td>
<td>

* 与 Android Studio Bumblebee Canary 1 兼容。
* 支持 [Kotlin 1.5.20](whatsnew1520)：在 Project Wizard 中使用新的 framework-packing 任务用于 Kotlin/Native。
</td>
<td>

* [Kotlin 1.5.10](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.5**

发布日期：2021 年 5 月 25 日
</td>
<td>

* [修复了与 Android Studio Arctic Fox 2020.3.1 Beta 1 及更高版本的兼容性](https://youtrack.jetbrains.com/issue/KT-46834)。
</td>
<td>

* [Kotlin 1.5.10](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.4**

发布日期：2021 年 5 月 5 日
</td>
<td>

将此版本的插件与 Android Studio 4.2 或 Android Studio 2020.3.1 Canary 8 或更高版本一起使用。
* 与 [Kotlin 1.5.0](whatsnew15) 兼容。
* [能够在 Kotlin Multiplatform 模块中使用 CocoaPods 依赖管理器进行 iOS 集成](https://youtrack.jetbrains.com/issue/KT-45946)。
</td>
<td>

* [Kotlin 1.5.0](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.3**

发布日期：2021 年 4 月 5 日
</td>
<td>

* [Project Wizard：改进了模块命名](https://youtrack.jetbrains.com/issues?q=issue%20id:%20KT-43449,%20KT-44060,%20KT-41520,%20KT-45282)。
* [能够在 Project Wizard 中使用 CocoaPods 依赖管理器进行 iOS 集成](https://youtrack.jetbrains.com/issue/KT-45478)。
* [提高了新项目中 gradle.properties 的可读性](https://youtrack.jetbrains.com/issue/KT-42908)。
* [如果取消选中 "Add sample tests for Shared Module"，则不再生成示例测试](https://youtrack.jetbrains.com/issue/KT-43441)。
* [修复和其他改进](https://youtrack.jetbrains.com/issues?q=Subsystems:%20%7BKMM%20Plugin%7D%20Type:%20Feature,%20Bug%20State:%20-Obsolete,%20-%7BAs%20designed%7D,%20-Answered,%20-Incomplete%20resolved%20date:%202021-03-10%20..%202021-03-25)。
</td>
<td>

* [Kotlin 1.4.30](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.2**

发布日期：2021 年 3 月 3 日
</td>
<td>

* [能够在 Xcode 中打开与 Xcode 相关的文件](https://youtrack.jetbrains.com/issue/KT-44970)。
* [能够在 iOS 运行配置中设置 Xcode 项目文件的位置](https://youtrack.jetbrains.com/issue/KT-44968)。
* [支持 Android Studio 2020.3.1 Canary 8](https://youtrack.jetbrains.com/issue/KT-45162)。
* [修复和其他改进](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.2%20)。
</td>
<td>

* [Kotlin 1.4.30](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.1**

发布日期：2021 年 2 月 15 日
</td>
<td>

将此版本的插件与 Android Studio 4.2 一起使用。
* 基础设施改进。
* [修复和其他改进](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.1%20)。
</td>
<td>

* [Kotlin 1.4.30](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.0**

发布日期：2020 年 11 月 23 日
</td>
<td>

* [支持 iPad 设备](https://youtrack.jetbrains.com/issue/KT-41932)。
* [支持在 Xcode 中配置的自定义 scheme 名称](https://youtrack.jetbrains.com/issue/KT-41677)。
* [能够为 iOS 运行配置添加自定义构建步骤](https://youtrack.jetbrains.com/issue/KT-41678)。
* [能够调试自定义 Kotlin/Native 二进制文件](https://youtrack.jetbrains.com/issue/KT-40954)。
* [简化了 Kotlin Multiplatform Mobile Wizards 生成的代码](https://youtrack.jetbrains.com/issue/KT-41712)。
* [删除了对 Kotlin Android Extensions 插件的支持](https://youtrack.jetbrains.com/issue/KT-42121)，该插件在 Kotlin 1.4.20 中已弃用。
* [修复了断开与主机的连接后保存物理设备配置的问题](https://youtrack.jetbrains.com/issue/KT-42390)。
* 其他修复和改进。
</td>
<td>

* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.3**

发布日期：2020 年 10 月 2 日
</td>
<td>

* 添加了与 iOS 14 和 Xcode 12 的兼容性。
* 修复了 Kotlin Multiplatform Mobile Wizard 创建的平台测试中的命名。
</td>
<td>

* [Kotlin 1.4.10](releases#release-details)
* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.2**

发布日期：2020 年 9 月 29 日
</td>
<td>

 * 修复了与 [Kotlin 1.4.20-M1](eap#build-details) 的兼容性。
 * 默认启用向 JetBrains 报告错误。
</td>
<td>

* [Kotlin 1.4.10](releases#release-details)
* [Kotlin 1.4.20](releases#release-details)
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

* [Kotlin 1.4.10](releases#release-details)
* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.0**

发布日期：2020 年 8 月 31 日
</td>
<td>

* Kotlin Multiplatform Mobile 插件的第一个版本。 在[博客文章](https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/)中了解更多信息。
</td>
<td>

* [Kotlin 1.4.0](releases#release-details)
* [Kotlin 1.4.10](releases#release-details)
</td>
</tr>
</table>