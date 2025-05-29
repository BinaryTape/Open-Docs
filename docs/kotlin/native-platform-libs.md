[//]: # (title: 平台库)

为了提供对操作系统原生服务的访问，Kotlin/Native 发行版包含了一组针对每个目标平台的预构建库。这些库被称为 _平台库_。

平台库中的包默认可用。你无需指定额外的链接选项来使用它们。Kotlin/Native 编译器会自动检测哪些平台库被访问，并链接必要的库。

然而，编译器发行版中的平台库仅仅是针对原生库的封装器和绑定。这意味着你需要在本地机器上安装原生库本身（例如 `.so`、`.a`、`.dylib`、`.dll` 等）。

## POSIX 绑定

Kotlin 为所有基于 UNIX 和 Windows 的目标平台（包括 Android 和 iOS）提供了 POSIX 平台库。这些平台库包含了针对平台实现的绑定，这些实现遵循 [POSIX 标准](https://en.wikipedia.org/wiki/POSIX)。

要使用该库，请将其导入到你的项目中：

```kotlin
import platform.posix.*
```

> `platform.posix` 的内容因 POSIX 实现的差异而在不同平台之间有所不同。
>
{style="note"}

你可以在此处探究每个支持平台的 `posix.def` 文件内容：

* [iOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/ios/posix.def)
* [macOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/osx/posix.def)
* [tvOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/tvos/posix.def)
* [watchOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/watchos/posix.def)
* [Linux](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/linux/posix.def)
* [Windows (MinGW)](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/mingw/posix.def)
* [Android](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/android/posix.def)

POSIX 平台库不适用于 [WebAssembly](wasm-overview.md) 目标平台。

## 常用原生库

Kotlin/Native 提供了针对各种常用原生库的绑定，这些库普遍用于不同平台，例如 OpenGL、zlib 和 Foundation。

在 Apple 平台上，`objc` 库被包含进来，以启用与 [Objective-C](native-objc-interop.md) API 的互操作性。

根据你的设置，你可以在编译器发行版中探究 Kotlin/Native 目标平台可用的原生库：

* 如果你 [安装了独立的 Kotlin/Native 编译器](native-get-started.md#download-and-install-the-compiler)：

  1. 转到解压后的编译器发行版归档文件，例如 `kotlin-native-prebuilt-macos-aarch64-2.1.0`。
  2. 导航到 `klib/platform` 目录。
  3. 选择包含对应目标平台的文件夹。

* 如果你在 IDE 中使用 Kotlin 插件（与 IntelliJ IDEA 和 Android Studio 捆绑）：

  1. 在你的命令行工具中，运行以下命令导航到 `.konan` 文件夹：

     <tabs>
     <tab title="macOS 和 Linux">

     ```none
     ~/.konan/
     ```

     </tab>
     <tab title="Windows">

     ```none
     %\USERPROFILE%\.konan
     ```

     </tab>
     </tabs>

  2. 打开 Kotlin/Native 编译器发行版，例如 `kotlin-native-prebuilt-macos-aarch64-2.1.0`。
  3. 导航到 `klib/platform` 目录。
  4. 选择包含对应目标平台的文件夹。

> 如果你想探究每个支持平台库的定义文件：在编译器发行版文件夹中，
> 导航到 `konan/platformDef` 目录并选择所需的目标平台。
>
{style="tip"}

## 接下来

[了解更多关于与 Swift/Objective-C 的互操作性](native-objc-interop.md)