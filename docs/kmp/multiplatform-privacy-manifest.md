[//]: # (title: iOS 应用的隐私清单)

如果你的应用旨在 Apple App Store 发布，并使用了[必填理由 API](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)，App Store Connect 可能会发出警告，指出该应用没有正确的隐私清单：

![必填理由警告](app-store-required-reasons-warning.png){width=700}

这可能会影响任何 Apple 生态系统应用，无论是原生还是多平台应用。你的应用可能通过第三方库或 SDK 使用了必填理由 API，这可能不明显。Kotlin Multiplatform 可能是你不知情地使用了某些 API 的框架之一。

在此页面上，你将找到关于此问题的详细描述以及应对建议。

> 本页面反映了 Kotlin 团队对该问题的当前理解。
> 随着我们掌握更多关于已接受的方法和变通方案的数据和知识，我们将更新此页面以反映这些信息。
>
{style="tip"}

## 问题何在

Apple 对 App Store 提交的要求已在 [2024 年春季发生变化](https://developer.apple.com/news/?id=r1henawx)。[App Store Connect](https://appstoreconnect.apple.com) 不再接受那些未在其隐私清单中指定使用必填理由 API 的应用。

这是一种自动检测，而非人工审核：你的应用代码会受到分析，你会收到一封电子邮件，其中列出了问题。该电子邮件将提及“ITMS-91053: Missing API declaration”问题，列出应用中所有归入[必填理由](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)类别的 API 类别。

理想情况下，你的应用所使用的所有 SDK 都提供其自己的隐私清单，你无需担心。但如果你的某些依赖项没有这样做，你的 App Store 提交可能会被标记。

## 如何解决

在你尝试提交应用并从 App Store 收到详细问题列表后，你可以按照 Apple 文档构建你的清单：

* [隐私清单文件概述](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)
* [描述隐私清单中的数据使用](https://developer.apple.com/documentation/bundleresources/describing-data-use-in-privacy-manifests)
* [描述必填理由 API 的使用](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)

生成的文件是字典的集合。对于每种访问的 API 类型，请从提供的列表中选择一个或多个使用理由。Xcode 通过提供可视化布局和带有每个字段有效值的下拉列表来帮助编辑 `.xcprivacy` 文件。

你可以使用[专用工具](#find-usages-of-required-reason-apis)来查找你的 Kotlin 框架依赖项中必填理由 API 的用法，并使用[独立插件](#place-the-xcprivacy-file-in-your-kotlin-artifacts)将 `.xcprivacy` 文件与你的 Kotlin 构件捆绑在一起。

如果新的隐私清单无法满足 App Store 要求，或者你无法弄清如何执行这些步骤，请联系我们并在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-67603)中分享你的情况。

## 查找必填理由 API 的用法

你的应用或某个依赖项中的 Kotlin 代码可能会访问来自 `platform.posix` 等库的必填理由 API，例如 `fstat`：

```kotlin
import platform.posix.fstat

fun useRequiredReasonAPI() {
    fstat(...)
}
```

在某些情况下，可能难以确定哪些依赖项使用了必填理由 API。为了帮助你找到它们，我们构建了一个简单工具。

要使用它，请在你的项目声明 Kotlin 框架的目录中运行以下命令：

```shell
/usr/bin/python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"
```

你也可以单独[下载此脚本](https://github.com/JetBrains/kotlin/blob/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)，检查它，然后使用 `python3` 运行。

## 将 .xcprivacy 文件放入你的 Kotlin 构件中

如果你需要将 `PrivacyInfo.xcprivacy` 文件与你的 Kotlin 构件捆绑在一起，请使用 `apple-privacy-manifests` 插件：

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

该插件会将隐私清单文件复制到[对应的输出位置](https://developer.apple.com/documentation/bundleresources/adding-a-privacy-manifest-to-your-app-or-third-party-sdk?language=objc)。

## 已知用法

### Compose Multiplatform

使用 Compose Multiplatform 可能会导致你的二进制文件中出现 `fstat`、`stat` 和 `mach_absolute_time` 的用法。尽管这些函数不用于跟踪或指纹识别，也不会从设备发送，但 Apple 仍可能将其标记为缺少必填理由的 API。

如果你必须为 `stat` 和 `fstat` 的用法指定理由，请使用 `0A2A.1`。对于 `mach_absolute_time`，请使用 `35F9.1`。

有关 Compose Multiplatform 中使用的必填理由 API 的进一步更新，请关注[此问题](https://github.com/JetBrains/compose-multiplatform/issues/4738)。

### Kotlin/Native 运行时在 1.9.10 或更早版本中

`mach_absolute_time` API 在 Kotlin/Native 运行时中的 `mimalloc` 分配器中使用。这是 Kotlin 1.9.10 及更早版本中的默认分配器。

我们建议升级到 Kotlin 1.9.20 或更高版本。如果无法升级，请更改内存分配器。为此，请在你的 Gradle 构建脚本中为当前的 Kotlin 分配器设置 `-Xallocator=custom` 编译选项，或为系统分配器设置 `-Xallocator=std`。

有关更多信息，请参见[Kotlin/Native 内存管理](https://kotlinlang.org/docs/native-memory-manager.html)。