---
title: 平台库
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

为了提供对操作系统的原生服务（native services）的访问，Kotlin/Native 的发行版包含了一组特定于每个目标平台的预构建库。这些被称为_平台库（platform libraries）_。

默认情况下，平台库中的包是可用的。 你不需要指定额外的链接选项（link options）来使用它们。 Kotlin/Native 编译器会自动检测哪些平台库被访问，并链接必要的库。

然而，编译器发行版中的平台库仅仅是原生库（native libraries）的包装器和绑定（wrappers and bindings）。 这意味着你需要在本地机器上安装原生库本身（`.so`、`.a`、`.dylib`、`.dll`等等）。

## POSIX 绑定

Kotlin 为所有基于 UNIX 和 Windows 的目标平台（包括 Android 和 iOS）提供了 POSIX 平台库。这些平台库包含了对平台实现的绑定，它遵循 [POSIX 标准](https://en.wikipedia.org/wiki/POSIX)。

要使用该库，请将其导入到你的项目中：

```kotlin
import platform.posix.*
```

:::note
`platform.posix` 的内容在不同平台之间有所不同，因为 POSIX 实现存在差异。

:::

你可以在这里浏览每个受支持平台的 `posix.def` 文件的内容：

* [iOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/ios/posix.def)
* [macOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/osx/posix.def)
* [tvOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/tvos/posix.def)
* [watchOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/watchos/posix.def)
* [Linux](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/linux/posix.def)
* [Windows (MinGW)](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/mingw/posix.def)
* [Android](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/android/posix.def)

POSIX 平台库不适用于 [WebAssembly](wasm-overview) 目标平台。

## 流行的原生库

Kotlin/Native 提供了对各种流行的原生库的绑定，这些原生库通常在不同的平台上使用，例如 OpenGL、zlib 和 Foundation。

在 Apple 平台上，包含了 `objc` 库，以实现与 [Objective-C](native-objc-interop) API 的互操作性。

你可以在你的编译器发行版中浏览可用于 Kotlin/Native 目标平台的原生库，具体取决于你的设置：

* 如果你[安装了独立的 Kotlin/Native 编译器](native-get-started#download-and-install-the-compiler)：

  1. 进入解压缩后的编译器发行版存档，例如，`kotlin-native-prebuilt-macos-aarch64-2.1.0`。
  2. 导航到 `klib/platform` 目录。
  3. 选择与目标平台对应的文件夹。

* 如果你在 IDE 中使用 Kotlin 插件（与 IntelliJ IDEA 和 Android Studio 捆绑在一起）：

  1. 在你的命令行工具中，运行以下命令以导航到 `.konan` 文件夹：

     <Tabs>
     <TabItem value="macOS and Linux" label="macOS and Linux">

     ```none
     ~/.konan/
     ```

     </TabItem>
     <TabItem value="Windows" label="Windows">

     ```none
     %\USERPROFILE%\.konan
     ```

     </TabItem>
     </Tabs>

  2. 打开 Kotlin/Native 编译器发行版，例如，`kotlin-native-prebuilt-macos-aarch64-2.1.0`。
  3. 导航到 `klib/platform` 目录。
  4. 选择与目标平台对应的文件夹。

:::tip
如果你想浏览每个受支持的平台库的定义文件：在编译器发行版文件夹中，导航到 `konan/platformDef` 目录并选择必要的目标平台。

:::

## 下一步

[了解更多关于与 Swift/Objective-C 互操作性的信息](native-objc-interop)