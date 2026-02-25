[//]: # (title: 使用 C 互操作与 libcurl 创建应用 – 教程)

> C 库导入目前处于 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 阶段。由 cinterop 工具从 C 库生成的所有 Kotlin 声明都应带有 `@ExperimentalForeignApi` 注解。
>
> Kotlin/Native 附带的原生平台库（如 Foundation、UIKit 和 POSIX）仅针对某些 API 需要显式启用（opt-in）。
>
{style="note"}

本教程演示如何使用 IntelliJ IDEA 创建一个命令行应用程序。你将学习如何使用 Kotlin/Native 和 libcurl 库创建一个可以在指定平台上原生运行的简单 HTTP 客户端。

输出将是一个可执行的命令行应用，你可以在 macOS 和 Linux 上运行它并进行简单的 HTTP GET 请求。

你可以直接使用命令行或通过脚本文件（如 `.sh` 或 `.bat` 文件）来生成 Kotlin 库。然而，对于拥有数百个文件和库的大型项目，这种方法扩展性不佳。使用构建系统可以简化流程，它可以下载并缓存 Kotlin/Native 编译器二进制文件和带有传递依赖项的库，同时运行编译器和测试。Kotlin/Native 可以通过 [Kotlin Multiplatform 插件](gradle-configure-project.md#targeting-multiple-platforms)使用 [Gradle](https://gradle.org) 构建系统。

## 开始之前

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 在 IntelliJ IDEA 中选择 **File** | **New** | **Project from Version Control**，并使用以下 URL 克隆 [项目模板](https://github.com/Kotlin/kmp-native-wizard)：

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```  

3. 浏览项目结构：

   ![Native 应用程序项目结构](native-project-structure.png){width=700}

   该模板包含一个包含入门所需文件和文件夹的项目。需要理解的是，如果代码没有平台特定要求，使用 Kotlin/Native 编写的应用程序可以针对不同的平台。你的代码放置在 `nativeMain` 目录中，并配有相应的 `nativeTest`。在本教程中，请保持文件夹结构不变。

4. 打开 `build.gradle.kts` 文件，这是包含项目设置的构建脚本。特别注意构建文件中的以下内容：

    ```kotlin
    kotlin {
        val hostOs = System.getProperty("os.name")
        val isArm64 = System.getProperty("os.arch") == "aarch64"
        val isMingwX64 = hostOs.startsWith("Windows")
        val nativeTarget = when {
            hostOs == "Mac OS X" && isArm64 -> macosArm64("native")
            hostOs == "Mac OS X" && !isArm64 -> macosX64("native")
            hostOs == "Linux" && isArm64 -> linuxArm64("native")
            hostOs == "Linux" && !isArm64 -> linuxX64("native")
            isMingwX64 -> mingwX64("native")
            else -> throw GradleException("Host OS is not supported in Kotlin/Native.")
        }
    
        nativeTarget.apply {
            binaries {
                executable {
                    entryPoint = "main"
                }
            }
        }
    }
    
    ```

   * 针对 macOS、Linux 和 Windows 平台，分别使用 `macosArm64`、`macosX64`、`linuxArm64`、`linuxX64` 和 `mingwX64` 定义目标。请参阅 [支持的平台](native-target-support.md) 完整列表。
   * `binaries {}` 块定义了如何生成二进制文件以及应用程序的入口点。这些可以保留默认值。
   * C 互操作性在构建中被配置为一个额外步骤。默认情况下，来自 C 的所有符号都会导入到 `interop` 软件包中。你可能希望在 `.kt` 文件中导入整个软件包。详细了解 [如何配置](gradle-configure-project.md#targeting-multiple-platforms)。

## 创建定义文件

编写原生应用程序时，你通常需要访问某些不包含在 [Kotlin 标准库](https://kotlinlang.org/api/latest/jvm/stdlib/) 中的功能，例如发送 HTTP 请求、在磁盘上进行读写等。

Kotlin/Native 有助于取用标准 C 库，从而打开了几乎可以满足任何需求的整个功能生态系统。Kotlin/Native 已经附带了一组预构建的 [平台库](native-platform-libs.md)，它们为标准库提供了一些额外的通用功能。

互操作的理想情况是像调用 Kotlin 函数一样调用 C 函数，并遵循相同的签名和约定。这就是 cinterop 工具派上用场的时候。它接收一个 C 库并生成相应的 Kotlin 绑定，从而使该库可以像 Kotlin 代码一样被使用。

为了生成这些绑定，每个库都需要一个定义文件，通常与库同名。这是一个属性文件，用于准确描述应如何取用该库。

在此应用中，你需要 libcurl 库来发送一些 HTTP 调用。要创建其定义文件：

1. 选择 `src` 文件夹，并通过 **File | New | Directory** 创建一个新目录。
2. 将新目录命名为 **nativeInterop/cinterop**。这是头文件位置的默认约定，如果你使用不同的位置，可以在 `build.gradle.kts` 文件中进行覆盖。
3. 选择此新子文件夹，并通过 **File | New | File** 创建一个新文件 `libcurl.def`。
4. 使用以下代码更新你的文件：

    ```c
    headers = curl/curl.h
    headerFilter = curl/*
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

   * `headers` 是要为其生成 Kotlin 存根的头文件列表。你可以在此处添加多个文件，每个文件用空格分隔。在本例中，只有 `curl.h`。引用的文件需要位于指定路径（在本例中为 `/usr/include/curl`）中。
   * `headerFilter` 显示具体包含哪些内容。在 C 语言中，当一个文件通过 `#include` 指令引用另一个文件时，所有头文件也会被包含在内。有时这是不必要的，你可以 [使用 glob 模式](https://en.wikipedia.org/wiki/Glob_(programming)) 添加此参数进行调整。

     如果你不想将外部依赖项（如系统 `stdint.h` 头文件）获取到互操作库中，可以使用 `headerFilter`。此外，它对于库大小优化以及修复系统与提供的 Kotlin/Native 编译环境之间潜在的冲突也很有用。

   * 如果需要修改特定平台的行为，可以使用 `compilerOpts.osx` 或 `compilerOpts.linux` 之类的格式为选项提供平台特定值。在本例中，它们是 macOS（`.osx` 后缀）和 Linux（`.linux` 后缀）。不带后缀的参数也是可以的（例如 `linkerOpts=`），并适用于所有平台。

   有关可用选项的完整列表，请参阅 [定义文件](native-definition-file.md#properties)。

> 你需要在系统上拥有 `curl` 库二进制文件才能使示例正常运行。在 macOS 和 Linux 上，它们通常已包含。在 Windows 上，你可以从 [源代码](https://curl.se/download.html) 构建它（你需要 Microsoft Visual Studio 或 Windows SDK 命令行工具）。有关更多详细信息，请参阅 [相关博客文章](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/)。或者，你也可以考虑使用 [MinGW/MSYS2](https://www.msys2.org/) 的 `curl` 二进制文件。
>
{style="note"}

## 在构建过程中添加互操作性

要使用头文件，请确保它们是作为构建过程的一部分生成的。为此，请在 `build.gradle.kts` 文件中添加以下 `compilations {}` 块：

```kotlin
nativeTarget.apply {
    compilations.getByName("main") {
        cinterops {
            val libcurl by creating
        }
    }
    binaries {
        executable {
            entryPoint = "main"
        }
    }
}
```

首先，添加 `cinterops`，然后添加定义文件的条目。默认情况下，使用文件名。你可以使用其他参数覆盖此设置：

```kotlin
cinterops {
    val libcurl by creating {
        definitionFile.set(project.file("src/nativeInterop/cinterop/libcurl.def"))
        packageName("com.jetbrains.handson.http")
        compilerOpts("-I/path")
        includeDirs.allHeaders("path")
    }
}
```

## 编写应用程序代码

现在你已经拥有了库和相应的 Kotlin 存根，可以从你的应用程序中使用它们。在本教程中，将 [simple.c](https://curl.se/libcurl/c/simple.html) 示例转换为 Kotlin。

在 `src/nativeMain/kotlin/` 文件夹中，使用以下代码更新你的 `Main.kt` 文件：

```kotlin
import kotlinx.cinterop.*
import libcurl.*

@OptIn(ExperimentalForeignApi::class)
fun main(args: Array<String>) {
    val curl = curl_easy_init()
    if (curl != null) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://example.com")
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L)
        val res = curl_easy_perform(curl)
        if (res != CURLE_OK) {
            println("curl_easy_perform() failed ${curl_easy_strerror(res)?.toKString()}")
        }
        curl_easy_cleanup(curl)
    }
}
```

如你所见，Kotlin 版本中消除了显式的变量声明，但其他一切都与 C 版本几乎相同。libcurl 库中你期望的所有调用在 Kotlin 等效项中均可用。

> 这是一个逐行的字面翻译。你也可以用更符合 Kotlin 习惯的方式来编写。
>
{style="tip"}

## 编译并运行应用程序

1. 编译应用程序。为此，请从任务列表中运行 `runDebugExecutableNative` Gradle 任务，或在终端中使用以下命令：
 
   ```bash
   ./gradlew runDebugExecutableNative
   ```

   在这种情况下，由 cinterop 工具生成的部分会被隐式包含在构建中。

2. 如果编译过程中没有错误，请点击 `main()` 函数旁边装订区域中的绿色 **Run** 图标，或使用 <shortcut>Shift + Cmd + R</shortcut>/<shortcut>Shift + F10</shortcut> 快捷键。

   IntelliJ IDEA 将打开 **Run** 选项卡并显示输出 —— [example.com](https://example.com/) 的内容：

   ![包含 HTML 代码的应用程序输出](native-output.png){width=700}

你可以看到实际输出，因为调用 `curl_easy_perform` 会将结果打印到标准输出。你可以使用 `curl_easy_setopt` 隐藏它。

> 你可以在我们的 [GitHub 仓库](https://github.com/kotlin-hands-on/intro-kotlin-native) 中获取完整的项目代码。
>
{style="note"}

## 下一步

详细了解 [Kotlin 与 C 的互操作性](native-c-interop.md)。