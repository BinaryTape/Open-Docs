---
title: "Kotlin 命令行编译器"
---
每个 Kotlin 版本都附带一个独立版本的编译器。你可以手动下载最新版本，也可以通过包管理器下载。

:::note
安装命令行编译器并不是使用 Kotlin 的必要步骤。
常见的做法是使用具有官方 Kotlin 支持的 IDE 或代码编辑器来编写 Kotlin 应用程序，
例如 [IntelliJ IDEA](https://www.jetbrains.com/idea/) 或 [Android Studio](https://developer.android.com/studio)。
它们提供了开箱即用的完整 Kotlin 支持。

了解如何在 [IDE 中开始使用 Kotlin](getting-started)。

:::

## 安装编译器

### 手动安装

要手动安装 Kotlin 编译器，请执行以下操作：

1. 从 [GitHub Releases](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) 下载最新版本 (`kotlin-compiler-2.1.20.zip`)。
2. 将独立的编译器解压缩到某个目录中，并可选择将 `bin` 目录添加到系统路径。
`bin` 目录包含在 Windows、macOS 和 Linux 上编译和运行 Kotlin 所需的脚本。

:::note
如果要在 Windows 上使用 Kotlin 命令行编译器，我们建议手动安装它。

:::

### SDKMAN!

在基于 UNIX 的系统（如 macOS、Linux、Cygwin、FreeBSD 和 Solaris）上安装 Kotlin 的一种更简单方法是
[SDKMAN!](https://sdkman.io)。它也适用于 Bash 和 ZSH shell。[了解如何安装 SDKMAN!](https://sdkman.io/install)。

要通过 SDKMAN! 安装 Kotlin 编译器，请在终端中运行以下命令：

```bash
sdk install kotlin
```

### Homebrew

或者，在 macOS 上，你可以通过 [Homebrew](https://brew.sh/) 安装编译器：

```bash
brew update
brew install kotlin
```

### Snap package

如果在 Ubuntu 16.04 或更高版本上使用 [Snap](https://snapcraft.io/)，则可以从命令行安装编译器：

```bash
sudo snap install --classic kotlin
```

## 创建并运行应用程序

1. 在 Kotlin 中创建一个简单的控制台 JVM 应用程序，显示 `"Hello, World!"`。
   在代码编辑器中，创建一个名为 `hello.kt` 的新文件，其中包含以下代码：

   ```kotlin
   fun main() {
       println("Hello, World!")
   }
   ```

2. 使用 Kotlin 编译器编译应用程序：

   ```bash
   kotlinc hello.kt -include-runtime -d hello.jar
   ```

   * `-d` 选项指示生成的 class 文件的输出路径，它可以是目录或 **.jar** 文件。
   * `-include-runtime` 选项通过在其中包含 Kotlin 运行时库，使生成的 **.jar** 文件成为自包含且可运行的文件。

   要查看所有可用选项，请运行：

   ```bash
   kotlinc -help
   ```

3. 运行应用程序：

   ```bash
   java -jar hello.jar
   ```

## 编译库

如果要开发供其他 Kotlin 应用程序使用的库，则可以构建 **.jar** 文件，而无需包含 Kotlin 运行时：

```bash
kotlinc hello.kt -d hello.jar
```

由于以这种方式编译的二进制文件依赖于 Kotlin 运行时，
因此应确保在使用已编译的库时，它存在于 classpath 中。

你还可以使用 `kotlin` 脚本来运行 Kotlin 编译器生成的二进制文件：

```bash
kotlin -classpath hello.jar HelloKt
```

`HelloKt` 是 Kotlin 编译器为名为 `hello.kt` 的文件生成的主类名称。

## 运行 REPL

你可以运行不带参数的编译器来获得一个交互式 shell。在此 shell 中，你可以键入任何有效的 Kotlin 代码并查看结果。

<img src="/img/kotlin-shell.png" alt="Shell" width="500"/>

## 运行脚本

你可以将 Kotlin 用作脚本语言。
Kotlin 脚本是一个 Kotlin 源文件 (`.kts`)，其中包含顶层可执行代码。

```kotlin
import java.io.File

// Get the passed in path, i.e. "-d some/path" or use the current path.
val path = if (args.contains("-d")) args[1 + args.indexOf("-d")]
           else "."

val folders = File(path).listFiles { file `->` file.isDirectory() }
folders?.forEach { folder `->` println(folder) }
```

要运行脚本，请将 `-script` 选项与相应的脚本文件一起传递给编译器：

```bash
kotlinc -script list_folders.kts -- -d <path_to_folder_to_inspect>
```

Kotlin 提供了对脚本自定义的实验性支持，例如添加外部属性、提供静态或动态依赖项等。
自定义由所谓的 _脚本定义_ 定义，即带有适当支持代码的带注解的 kotlin 类。
脚本文件名扩展名用于选择适当的定义。
了解更多关于 [Kotlin 自定义脚本](custom-script-deps-tutorial)。

当适当的 jar 包含在编译 classpath 中时，将自动检测并应用正确准备的脚本定义。或者，你可以通过将 `-script-templates` 选项传递给编译器来手动指定定义：

```bash
kotlinc -script-templates org.example.CustomScriptDefinition -script custom.script1.kts
```

有关更多详细信息，请参阅 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support)。