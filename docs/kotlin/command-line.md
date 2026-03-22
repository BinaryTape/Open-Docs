[//]: # (title: Kotlin 命令行编译器)

每个 Kotlin 版本都附带一个独立版本的编译器。您可以手动下载最新版本，也可以通过软件包管理器下载。

> 安装命令行编译器并不是使用 Kotlin 的必要步骤。
> 通常的做法是使用官方支持 Kotlin 的 IDE 或代码编辑器编写 Kotlin 应用程序，
> 例如 [IntelliJ IDEA](https://www.jetbrains.com/idea/) 或 [Android Studio](https://developer.android.com/studio)。
> 它们开箱即用，提供完整的 Kotlin 支持。
> 
> 了解如何[在 IDE 中开始使用 Kotlin](getting-started.md)。
> 
{style="note"}

## 安装编译器

### 手动安装

要手动安装 Kotlin 编译器：

1. 从 [GitHub Releases](%kotlinLatestUrl%) 下载最新版本 (`kotlin-compiler-%kotlinVersion%.zip`)。
2. 将独立编译器解压缩到一个目录中，并可以根据需要将 `kotlinc/bin` 目录添加到系统路径。
`bin` 目录包含在 Windows、macOS 和 Linux 上编译和运行 Kotlin 所需的脚本。

> 如果您想在 Windows 上使用 Kotlin 命令行编译器，我们建议手动进行安装。
> 
{style="note"}

### SDKMAN!

在基于 UNIX 的系统（如 macOS、Linux、Cygwin、FreeBSD 和 Solaris）上安装 Kotlin 的一种更简便的方法是 [SDKMAN!](https://sdkman.io)。它也适用于 Bash 和 ZSH shell。[了解如何安装 SDKMAN!](https://sdkman.io/install)。

要通过 SDKMAN! 安装 Kotlin 编译器，请在终端中运行以下命令：

```bash
sdk install kotlin
```

### Homebrew

或者，在 macOS 上，您可以通过 [Homebrew](https://brew.sh/) 安装编译器：

```bash
brew update
brew install kotlin
```

### Snap 软件包

如果您在 Ubuntu 16.04 或更高版本上使用 [Snap](https://snapcraft.io/)，可以从命令行安装编译器：

```bash
sudo snap install --classic kotlin
```

## 创建并运行应用程序

1. 在 Kotlin 中创建一个简单的控制台 JVM 应用程序，显示 `"Hello, World!"`。 
   在代码编辑器中，创建一个名为 `hello.kt` 的新文件，并包含以下代码：

   ```kotlin
   fun main() {
       println("Hello, World!")
   }
   ```

2. 使用 Kotlin 编译器编译应用程序：

   ```bash
   kotlinc hello.kt -include-runtime -d hello.jar
   ```

   * `-d` 选项指示生成的类文件的输出路径，该路径可以是目录，也可以是 **.jar** 文件。
   * `-include-runtime` 选项通过在生成的 **.jar** 文件中包含 Kotlin 运行时库，使其成为自包含且可运行的文件。

   要查看所有可用选项，请运行：

   ```bash
   kotlinc -help
   ```

3. 运行应用程序：

   ```bash
   java -jar hello.jar
   ```

> 要编译 Kotlin/Native 应用程序，请使用 [Kotlin/Native 编译器](native-get-started.md#using-the-command-line-compiler)。
> 
{style="note"}

## 编译库

如果您正在开发供其他 Kotlin 应用程序使用的库，则可以在不包含 Kotlin 运行时的情况下构建 **.jar** 文件：

```bash
kotlinc hello.kt -d hello.jar
```

由于通过这种方式编译的二进制文件依赖于 Kotlin 运行时，因此您应确保在使用已编译的库时，类路径中存在该运行时。

您还可以使用 `kotlin` 脚本运行 Kotlin 编译器生成的二进制文件：

```bash
kotlin -classpath hello.jar HelloKt
```

`HelloKt` 是 Kotlin 编译器为名为 `hello.kt` 的文件生成的主类名。

> 要编译 Kotlin/Native 库，请使用 [Kotlin/Native 编译器](native-libraries.md#using-kotlin-native-compiler)。
>
{style="note"}

## 运行 REPL

使用 [`-Xrepl` 编译器选项](compiler-reference.md#xrepl)运行编译器，以获得一个交互式 shell。在此 shell 中，您可以输入任何有效的 Kotlin 代码并查看结果。

## 运行脚本

您可以将 Kotlin 用作脚本语言。
Kotlin 脚本是具有顶级可执行代码的 Kotlin 源文件 (`.kts`)。

```kotlin
import java.io.File

// 获取传入的路径，例如 "-d some/path"，或者使用当前路径。
val path = if (args.contains("-d")) args[1 + args.indexOf("-d")]
           else "."

val folders = File(path).listFiles { file -> file.isDirectory() }
folders?.forEach { folder -> println(folder) }
```

要运行脚本，请使用相应的脚本文件将 `-script` 选项传递给编译器：

```bash
kotlinc -script list_folders.kts -- -d <path_to_folder_to_inspect>
```

Kotlin 为脚本自定义提供实验性支持，例如添加外部属性、提供静态或动态依赖项等。
自定义由所谓的“脚本定义”来定义 —— 即带有适当支持代码的、带有注解的 Kotlin 类。
脚本文件扩展名用于选择适当的定义。
详细了解 [Kotlin 自定义脚本](custom-script-deps-tutorial.md)。

当编译类路径中包含适当的 jar 时，系统会自动检测并应用准备妥当的脚本定义。或者，您也可以通过向编译器传递 `-script-templates` 选项来手动指定定义：

```bash
kotlinc -script-templates org.example.CustomScriptDefinition -script custom.script1.kts
```

更多详情，请参阅 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)。

## 下一步做什么？

[创建一个基于 Kotlin/JVM 的控制台应用程序](jvm-get-started.md)。