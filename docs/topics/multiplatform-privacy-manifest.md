[//]: # (title: 适用于 iOS 应用程序的隐私清单)

如果您的应用程序旨在用于 Apple App Store 并使用 [Required Reasons API](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)，App Store Connect 可能会发出警告，指出该应用程序没有正确的隐私清单：

![Required reasons warning](app-store-required-reasons-warning.png){width=700}

这可能会影响任何 Apple 生态系统应用程序，无论是原生还是多平台。您的应用程序可能通过第三方库或 SDK 使用 Required Reasons API，这可能不明显。Kotlin Multiplatform 可能是使用您不了解的 API 的框架之一。

本页将详细描述此问题，并提供处理它的建议。

> 本页反映了 Kotlin 团队对该问题的当前理解。
> 随着我们获得更多关于公认方法和变通方案的数据和知识，我们将更新此页面以反映这些信息。
>
{style="tip"}

## 问题是什么

Apple 的 App Store 提交要求已在 [2024 年春季发生变化](https://developer.apple.com/news/?id=r1henawx)。[App Store Connect](https://appstoreconnect.apple.com) 不再接受在其隐私清单中未明确说明使用 Required Reasons API 原因的应用程序。

这是一项自动检测，而非人工审核：您的应用程序代码会被分析，并通过电子邮件收到问题列表。电子邮件将提及“ITMS-91053: Missing API declaration”问题，并列出应用程序中所有属于 [Required Reasons](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api) 类别使用的 API 类别。

理想情况下，您的应用程序使用的所有 SDK 都提供自己的隐私清单，您无需为此担心。但是，如果您的某些依赖项没有这样做，您的 App Store 提交可能会被标记。

## 如何解决

在您尝试提交应用程序并收到 App Store 提供的详细问题列表后，您可以按照 Apple 文档构建您的清单：

* [隐私清单文件概述](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)
* [在隐私清单中描述数据使用](https://developer.apple.com/documentation/bundleresources/describing-data-use-in-privacy-manifests)
* [描述 Required Reasons API 的使用](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)

生成的文件是一个字典集合。对于每种访问的 API 类型，请从提供的列表中选择一个或多个使用原因。Xcode 通过提供可视化布局和包含每个字段有效值的下拉列表来帮助编辑 `.xcprivacy` 文件。

您可以使用一个[专用工具](#find-usages-of-required-reason-apis)来查找您的 Kotlin framework 依赖项中 Required Reasons API 的使用情况，并使用一个[单独的插件](#place-the-xcprivacy-file-in-your-kotlin-artifacts)将 `.xcprivacy` 文件与您的 Kotlin 构件捆绑在一起。

如果新的隐私清单无法满足 App Store 要求，或者您无法弄清楚如何执行这些步骤，请联系我们并在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-67603)中分享您的情况。

## 查找 Required Reasons API 的使用情况

您的应用程序中的 Kotlin 代码或其中一个依赖项可能会访问来自 `platform.posix` 等库的 Required Reasons API，例如 `fstat`：

```kotlin
import platform.posix.fstat

fun useRequiredReasonAPI() {
    fstat(...)
}
```

在某些情况下，可能难以确定哪些依赖项使用 Required Reasons API。为了帮助您找到它们，我们构建了一个简单的工具。

要在声明 Kotlin framework 的项目目录中使用它，请运行以下命令：

```shell
/usr/bin/python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"
```

您也可以[单独下载此脚本](https://github.com/JetBrains/kotlin/blob/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)，检查它，并使用 `python3` 运行它。

## 将 .xcprivacy 文件放置到您的 Kotlin 构件中

如果您需要将 `PrivacyInfo.xcprivacy` 文件与您的 Kotlin 构件捆绑在一起，请使用 `apple-privacy-manifests` 插件：

```kotlin
plugins {
    kotlin("multiplatform")
    kotlin("apple-privacy-manifests") version "1.0.0"
}

kotlin {
    privacyManifest {
        embed(
            privacyManifest = layout.projectDirectory.file("PrivacyInfo.xcprivacy").asFile,
        )
    }
}
```

该插件会将隐私清单文件复制到[相应的输出位置](https://developer.apple.com/documentation/bundleresources/adding-a-privacy-manifest-to-your-app-or-third-party-sdk?language=objc)。

## 已知使用情况

### Compose Multiplatform

使用 Compose Multiplatform 可能会导致您的二进制文件中出现 `fstat`、`stat` 和 `mach_absolute_time` 的使用。尽管这些函数未用于跟踪或指纹识别，也未从设备发送，但 Apple 仍然可能将其标记为缺少 Required Reasons 的 API。

如果您必须为 `stat` 和 `fstat` 的使用指定原因，请使用 `0A2A.1`。对于 `mach_absolute_time`，请使用 `35F9.1`。

有关 Compose Multiplatform 中使用的 Required Reasons API 的进一步更新，请关注[此问题](https://github.com/JetBrains/compose-multiplatform/issues/4738)。

### 1.9.10 或更早版本中的 Kotlin/Native 运行时

`mach_absolute_time` API 在 Kotlin/Native 运行时的 `mimalloc` 分配器中使用。这是 Kotlin 1.9.10 及更早版本中的默认分配器。

我们建议升级到 Kotlin 1.9.20 或更高版本。如果无法升级，请更改内存分配器。为此，请在您的 Gradle 构建脚本中为当前的 Kotlin 分配器设置 `-Xallocator=custom` 编译选项，或为系统分配器设置 `-Xallocator=std`。

有关更多信息，请参见 [Kotlin/Native 内存管理](https://kotlinlang.org/docs/native-memory-manager.html)。