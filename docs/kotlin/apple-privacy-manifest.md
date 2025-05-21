---
title: "iOS 应用的隐私清单"
---
如果你的应用的目标平台是 Apple App Store，并且使用了[需要声明原因的 API (required reasons APIs)](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)，App Store Connect 可能会发出警告，提示该应用没有正确的隐私清单 (privacy manifest)：

<img src="/img/app-store-required-reasons-warning.png" alt="Required reasons warning" width="700" style={{verticalAlign: 'middle'}}/>

这会影响任何 Apple 生态系统的应用，无论是原生应用还是多平台应用。 你的应用可能通过第三方库或 SDK 使用了需要声明原因的 API，这可能并不明显。 Kotlin Multiplatform 可能是使用了你未意识到的 API 的框架之一。

在本页面中，你将找到对该问题的详细描述以及处理建议。

:::tip
本页面反映了 Kotlin 团队目前对该问题的理解。 随着我们获得更多关于可接受的方法和变通方法的数据和知识，我们将更新页面以反映它们。

:::

## 问题是什么

Apple 对 App Store 提交的要求[已在 2024 年春季发生变化](https://developer.apple.com/news/?id=r1henawx)。 [App Store Connect](https://appstoreconnect.apple.com) 不再接受未在其隐私清单中指定使用需要声明原因的 API 的原因的应用。

这是一个自动检查，而不是手动审核：你的应用代码会被分析，并且你会收到一封包含问题列表的电子邮件。 该电子邮件将引用 "ITMS-91053: Missing API declaration" 问题，列出应用中使用的所有属于[需要声明原因 (required reasons)](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)类别的 API 类别。

理想情况下，你的应用使用的所有 SDK 都会提供自己的隐私清单，你无需担心这一点。 但是，如果你的某些依赖项没有这样做，你的 App Store 提交可能会被标记。

## 如何解决

在你尝试提交你的应用并收到来自 App Store 的详细问题列表后，你可以按照 Apple 文档构建你的清单：

* [隐私清单文件概述 (Privacy manifest files overview)](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
* [在隐私清单中描述数据使用 (Describing data use in privacy manifests)](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_data_use_in_privacy_manifests)
* [描述需要声明原因的 API 的使用 (Describing use of required reason API)](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)

生成的文件是一个字典集合。 对于每种被访问的 API 类型，从提供的列表中选择一个或多个使用它的原因。 Xcode 通过提供可视布局和带有每个字段有效值的下拉列表来帮助编辑 `.xcprivacy` 文件。

你可以使用一个[特殊工具](#find-usages-of-required-reason-apis)来查找 Kotlin 框架的依赖项中需要声明原因的 API 的使用情况，并使用一个[单独的插件](#place-the-xcprivacy-file-in-your-kotlin-artifacts)将 `.xcprivacy` 文件与你的 Kotlin artifacts 捆绑在一起。

如果新的隐私清单不能满足 App Store 的要求，或者你无法弄清楚如何完成这些步骤，请联系我们并在 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-67603) 中分享你的案例。

## 查找需要声明原因的 API 的使用情况

你的应用或其中一个依赖项中的 Kotlin 代码可能会访问来自 `platform.posix` 等库的需要声明原因的 API，例如 `fstat`：

```kotlin
import platform.posix.fstat

fun useRequiredReasonAPI() {
    fstat(...)
}
```

在某些情况下，可能难以确定哪些依赖项使用了需要声明原因的 API。 为了帮助你找到它们，我们构建了一个简单的工具。

要使用它，请在你项目中声明 Kotlin 框架的目录中运行以下命令：

```shell
/usr/bin/python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"
```

你也可以[单独下载此脚本](https://github.com/JetBrains/kotlin/blob/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)，检查它，并使用 `python3` 运行它。

## 将 .xcprivacy 文件放入你的 Kotlin artifacts 中

如果你需要将 `PrivacyInfo.xcprivacy` 文件与你的 Kotlin artifacts 捆绑在一起，请使用 `apple-privacy-manifests` 插件：

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

该插件会将隐私清单文件复制到[相应的输出位置](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/adding_a_privacy_manifest_to_your_app_or_third-party_sdk?language=objc)。

## 已知的使用情况

### Compose Multiplatform

使用 Compose Multiplatform 可能会导致你的二进制文件中出现 `fstat`、`stat` 和 `mach_absolute_time` 的使用。 即使这些函数不用于跟踪或指纹识别，并且没有从设备发送，Apple 仍然可以将它们标记为缺少所需原因的 API。

如果你必须指定 `stat` 和 `fstat` 用途的原因，请使用 `0A2A.1`。 对于 `mach_absolute_time`，使用 `35F9.1`。

有关 Compose Multiplatform 中使用的需要声明原因的 API 的进一步更新，请关注 [此 issue](https://github.com/JetBrains/compose-multiplatform/issues/4738)。

### Kotlin/Native runtime 在 1.9.10 或更早版本中

`mach_absolute_time` API 在 Kotlin/Native runtime 的 `mimalloc` 分配器中使用。 这是 Kotlin 1.9.10 及更早版本中的默认分配器。

我们建议升级到 Kotlin 1.9.20 或更高版本。 如果无法升级，请更改内存分配器。 为此，请在 Gradle 构建脚本中为当前的 Kotlin 分配器设置 `-Xallocator=custom` 编译选项，或者为系统分配器设置 `-Xallocator=std`。

有关更多信息，请参见 [Kotlin/Native 内存管理](native-memory-manager)。