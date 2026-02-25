[//]: # (title: iOS 应用的隐私清单)

如果您的应用旨在发布到 Apple App Store 且使用了 [required reasons API](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)，
App Store Connect 可能会发出警告，提示该应用没有正确的隐私清单：

![Required reasons 警告](app-store-required-reasons-warning.png){width=700}

这可能会影响任何 Apple 生态系统的应用，无论是原生应用还是多平台应用。您的应用可能通过第三方库或 SDK 使用了 required reason API，而这可能并不直观。Kotlin Multiplatform 可能是使用了您未察觉的 API 的框架之一。

在此页面中，您将找到该问题的详细描述以及解决该问题的建议。

> 本页面反映了 Kotlin 团队当前对该问题的理解。
> 随着我们获得更多关于公认方法和变通方案的数据和知识，我们将更新此页面以反映这些内容。
>
{style="tip"}

## 问题是什么

Apple 对 App Store 提交的要求[在 2024 年春季发生了变化](https://developer.apple.com/news/?id=r1henawx)。
[App Store Connect](https://appstoreconnect.apple.com) 不再接受未在其隐私清单中说明使用 required reason API 原因的应用。

这是一个自动检查，而非人工审核：系统会对您的应用代码进行分析，并向您发送包含问题列表的电子邮件。邮件将引用“ITMS-91053: Missing API declaration”问题，列出应用中使用的所有属于 [required reasons](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api) 类别的 API 分类。

理想情况下，您应用使用的所有 SDK 都会提供自己的隐私清单，您无需担心。
但如果您的某些依赖项没有这样做，您的 App Store 提交可能会被标记。

## 如何解决

在您尝试提交应用并收到来自 App Store 的详细问题列表后，您可以按照 Apple 文档构建您的清单：

* [隐私清单文件概述](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)
* [在隐私清单中描述数据使用情况](https://developer.apple.com/documentation/bundleresources/describing-data-use-in-privacy-manifests)
* [描述 required reason API 的使用情况](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)

生成的文件是一个字典集合。对于每个访问的 API 类型，请从提供的列表中选择一个或多个使用原因。Xcode 通过提供可视化布局和包含各字段有效值的下拉菜单，协助编辑 `.xcprivacy` 文件。

您可以使用[专用工具](#find-usages-of-required-reason-apis)来查找 Kotlin 框架依赖项中 required reason API 的用法，并使用[单独的插件](#place-the-xcprivacy-file-in-your-kotlin-artifacts)将 `.xcprivacy` 文件随 Kotlin 构件一起打包。

如果新的隐私清单无法满足 App Store 的要求，或者您无法弄清楚如何执行这些步骤，请联系我们并在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-67603)中分享您的案例。

## 查找 required reason API 的用法

您应用中的 Kotlin 代码或其中一个依赖项可能会访问来自 `platform.posix` 等库的 required reason API，例如 `fstat`：

```kotlin
import platform.posix.fstat

fun useRequiredReasonAPI() {
    fstat(...)
}
```

在某些情况下，可能很难确定哪些依赖项使用了 required reason API。
为了帮助您找到它们，我们构建了一个简单的工具。

要使用它，请在项目中声明 Kotlin 框架的目录中运行以下命令：

```shell
/usr/bin/python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"
```

您也可以单独[下载此脚本](https://github.com/JetBrains/kotlin/blob/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)，进行检查，然后使用 `python3` 运行它。

## 将 .xcprivacy 文件放置在您的 Kotlin 构件中

如果您需要将 `PrivacyInfo.xcprivacy` 文件随 Kotlin 构件一起打包，请使用 `apple-privacy-manifests` 插件：

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

## 已知用法

### Compose Multiplatform

使用 Compose Multiplatform 可能会导致您的二进制文件中出现 `fstat`、`stat` 和 `mach_absolute_time` 的用法。
尽管这些函数不用于跟踪或指纹采集，也不会从设备发送，但 Apple 仍可能将其标记为缺少 required reason 的 API。 

如果您必须为 `stat` 和 `fstat` 的用法指定原因，请使用 `0A2A.1`。对于 `mach_absolute_time`，请使用 `35F9.1`。

有关 Compose Multiplatform 中使用的 required reasons API 的进一步更新，请关注[此问题](https://github.com/JetBrains/compose-multiplatform/issues/4738)。

### 1.9.10 或更早版本中的 Kotlin/Native 运行时

`mach_absolute_time` API 被用于 Kotlin/Native 运行时的 `mimalloc` 分配器中。这是 Kotlin 1.9.10 及更早版本中的默认分配器。

我们建议升级到 Kotlin 1.9.20 或更高版本。如果无法升级，请更改内存分配器。
为此，请在您的 Gradle 构建脚本中为当前的 Kotlin 分配器设置 `-Xallocator=custom` 编译选项，或为系统分配器设置 `-Xallocator=std`。

有关更多信息，请参阅 [Kotlin/Native 内存管理](https://kotlinlang.org/docs/native-memory-manager.html)。