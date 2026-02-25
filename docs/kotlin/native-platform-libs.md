[//]: # (title: 平台库)

为了提供对操作系统原生服务的访问，Kotlin/Native 分发版包含了一组针对每个目标的预构建库。这些被称为*平台库*。

平台库中的软件包默认可用。您无需指定额外的链接选项即可使用它们。Kotlin/Native 编译器会自动检测访问了哪些平台库并链接必要的库。

然而，编译器分发版中的平台库仅仅是原生库的包装器和绑定。这意味着您需要在本地计算机上安装原生库本身（`.so`、`.a`、`.dylib`、`.dll` 等）。

## POSIX 绑定

Kotlin 为所有基于 UNIX 和 Windows 的目标（包括 Android 和 iOS）提供 POSIX 平台库。
这些平台库包含对遵循 [POSIX 标准](https://en.wikipedia.org/wiki/POSIX) 的平台实现的绑定。

要使用该库，请将其导入您的项目：

```kotlin
import platform.posix.*
```

> 由于 POSIX 实现的差异，`platform.posix` 的内容在不同平台上有所不同。
>
{style="note"}

您可以在此处探索每个受支持平台的 `posix.def` 文件内容：

* [iOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/ios/posix.def)
* [macOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/osx/posix.def)
* [tvOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/tvos/posix.def)
* [watchOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/watchos/posix.def)
* [Linux](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/linux/posix.def)
* [Windows (MinGW)](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/mingw/posix.def)
* [Android](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/android/posix.def)

POSIX 平台库不适用于 [WebAssembly](wasm-overview.md) 目标。

## 流行原生库

Kotlin/Native 为不同平台上常用的各种流行原生库提供绑定，例如 OpenGL、zlib 和 Foundation。

在 Apple 平台上，包含 `objc` 库以实现与 [Objective-C API 的互操作性](native-objc-interop.md)。

您可以根据您的设置，在编译器分发版中探索适用于 Kotlin/Native 目标的可用原生库：

* 如果您[安装了独立 Kotlin/Native 编译器](native-get-started.md#download-and-install-the-compiler)：

  1. 转到解压缩后的编译器分发版归档文件，例如 `kotlin-native-prebuilt-macos-aarch64-2.1.0`。
  2. 导航到 `klib/platform` 目录。
  3. 选择对应目标的文件夹。

* 如果您在 IDE 中使用 Kotlin 插件（随 IntelliJ IDEA 和 Android Studio 捆绑）：

  1. 在您的命令行工具中，运行以下命令以导航到 `.konan` 文件夹：

     <tabs>
     <tab title="macOS and Linux">

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

  2. 打开 Kotlin/Native 编译器分发版，例如 `kotlin-native-prebuilt-macos-aarch64-2.1.0`。
  3. 导航到 `klib/platform` 目录。
  4. 选择对应目标的文件夹。

> 如果您想探索每个受支持平台库的定义文件：在编译器分发版文件夹中，导航到 `konan/platformDef` 目录并选择所需的目标。
> 
{style="tip"}

## 下一步

[详细了解与 Swift/Objective-C 的互操作性](native-objc-interop.md)