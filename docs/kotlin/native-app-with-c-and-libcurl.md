[//]: # (title: 使用 C 互操作和 libcurl 创建应用 – 教程)

本教程演示了如何使用 IntelliJ IDEA 创建命令行应用程序。您将学习如何使用 Kotlin/Native 和 libcurl 库创建一个简单的 HTTP 客户端，该客户端可以在指定平台上原生运行。

输出将是一个可在 macOS 和 Linux 上运行的、可执行的命令行应用程序，可以进行简单的 HTTP GET 请求。

您可以使用命令行直接生成 Kotlin 库，或通过脚本文件（例如 `.sh` 或 `.bat` 文件）生成。然而，这种方法对于拥有数百个文件和库的大型项目来说，扩展性不佳。使用构建系统可以简化流程，它会下载并缓存 Kotlin/Native 编译器二进制文件和带有传递性依赖的库，并运行编译器和测试。Kotlin/Native 可以通过 [Kotlin Multiplatform plugin](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 构建系统。

## 开始之前

1.  下载并安装最新版 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2.  在 IntelliJ IDEA 中选择 **File** | **New** | **Project from Version Control** 并使用此 URL 克隆 [项目模板](https://github.com/Kotlin/kmp-native-wizard)：

    ```none
    https://github.com/Kotlin/kmp-native-wizard
    ```  

3.  探索项目结构：

    ![Native application project structure](native-project-structure.png){width=700}

    该模板包含一个项目，其中有您开始所需的的文件和文件夹。重要的是要理解，如果代码没有平台特定要求，用 Kotlin/Native 编写的应用程序可以面向不同的平台。您的代码位于 `nativeMain` 目录中，并带有相应的 `nativeTest`。对于本教程，请保持文件夹结构不变。

4.  打开 `build.gradle.kts` 文件，它是包含项目设置的构建脚本。请特别注意构建文件中的以下内容：

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

    *   目标使用 `macosArm64`、`macosX64`、`linuxArm64`、`linuxX64` 和 `mingwX64` 定义，分别对应 macOS、Linux 和 Windows。请参阅 [支持的平台](native-target-support.md) 的完整列表。
    *   该条目本身定义了一系列属性，以指示二进制文件的生成方式和应用程序的入口点。这些可以保留为默认值。
    *   C 互操作性 (C interop) 在构建过程中作为额外步骤进行配置。默认情况下，所有 C 符号都导入到 `interop` 包中。您可能希望在 `.kt` 文件中导入整个包。了解更多关于 [如何配置](gradle-configure-project.md#targeting-multiple-platforms) 的信息。

## 创建定义文件

在编写原生应用程序时，您经常需要访问某些 [Kotlin 标准库](https://kotlinlang.org/api/latest/jvm/stdlib/) 中不包含的功能，例如发出 HTTP 请求、从磁盘读取和写入等。

Kotlin/Native 有助于使用标准 C 库，打开了一个功能生态系统，几乎可以满足您的任何需求。Kotlin/Native 已经附带了一组预构建的 [平台库](native-platform-libs.md)，它们为标准库提供了一些额外的通用功能。

互操作 (interop) 的理想场景是调用 C 函数，就像调用 Kotlin 函数一样，遵循相同的签名和约定。这时 cinterop 工具就派上用场了。它接受一个 C 库并生成相应的 Kotlin 绑定，以便该库可以像 Kotlin 代码一样使用。

为了生成这些绑定，每个库都需要一个定义文件，通常与库同名。这是一个属性文件，精确描述了库应如何被使用。

在此应用中，您将需要 libcurl 库来进行一些 HTTP 调用。要创建其定义文件：

1.  选择 `src` 文件夹，然后使用 **File | New | Directory** 创建一个新目录。
2.  将新目录命名为 **nativeInterop/cinterop**。这是头文件位置的默认约定，但如果您使用不同位置，可以在 `build.gradle.kts` 文件中覆盖此约定。
3.  选择此新子文件夹，然后使用 **File | New | File** 创建一个新的 `libcurl.def` 文件。
4.  使用以下代码更新您的文件：

    ```c
    headers = curl/curl.h
    headerFilter = curl/*
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

    *   `headers` 是要生成 Kotlin 存根 (stubs) 的头文件列表。您可以向此条目添加多个文件，每个文件之间用空格分隔。在此示例中，它只有 `curl.h`。引用的文件需要位于指定路径（在此示例中为 `/usr/include/curl`）上。
    *   `headerFilter` 显示了具体包含哪些内容。在 C 语言中，当一个文件使用 `#include` 指令引用另一个文件时，所有头文件也会被包含。有时这并非必要，您可以 [使用 glob 模式](https://en.wikipedia.org/wiki/Glob_(programming)) 添加此参数进行调整。

        如果您不想将外部依赖（例如系统 `stdint.h` 头文件）引入互操作 (interop) 库中，可以使用 `headerFilter`。此外，它可能有助于库大小优化，并解决系统与所提供的 Kotlin/Native 编译环境之间的潜在冲突。

    *   如果需要修改某个平台的行为，您可以使用 `compilerOpts.osx` 或 `compilerOpts.linux` 等格式为选项提供平台特定值。在此示例中，它们是 macOS（`.osx` 后缀）和 Linux（`.linux` 后缀）。不带后缀的参数（例如 `linkerOpts=`）也是可能的，并应用于所有平台。

    有关可用选项的完整列表，请参阅 [定义文件](native-definition-file.md#properties)。

> 您的系统上需要有 `curl` 库二进制文件才能使示例正常工作。在 macOS 和 Linux 上，它们通常已包含在内。在 Windows 上，您可以从 [源](https://curl.se/download.html) 构建它（您将需要 Microsoft Visual Studio 或 Windows SDK 命令行工具）。有关更多详细信息，请参阅 [相关博文](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/)。或者，您可能希望考虑使用 [MinGW/MSYS2](https://www.msys2.org/) 的 `curl` 二进制文件。
>
{style="note"}

## 将互操作性添加到构建过程

要使用头文件，请确保它们作为构建过程的一部分生成。为此，请将以下条目添加到 `build.gradle.kts` 文件中：

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

首先添加 `cinterops`，然后是定义文件的条目。默认情况下，使用文件名。您可以使用附加参数覆盖它：

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

现在您有了库和相应的 Kotlin 存根，可以在应用程序中使用它们了。对于本教程，将 [simple.c](https://curl.se/libcurl/c/simple.html) 示例转换为 Kotlin。

在 `src/nativeMain/kotlin/` 文件夹中，使用以下代码更新您的 `Main.kt` 文件：

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

如您所见，Kotlin 版本中消除了显式变量声明，但其他一切都与 C 版本大体相同。libcurl 库中所有您期望的调用都在 Kotlin 等效版本中可用。

> 这是逐行的字面翻译。您也可以用更符合 Kotlin 习惯的方式来编写。
>
{type="tip"}

## 编译并运行应用程序

1.  编译应用程序。为此，从任务列表中运行 `runDebugExecutableNative` Gradle 任务，或在终端中使用以下命令：
 
    ```bash
    ./gradlew runDebugExecutableNative
    ```

    在这种情况下，cinterop 工具生成的部分被隐式包含在构建中。

2.  如果在编译过程中没有错误，请单击 `main()` 函数旁边边栏中的绿色 **Run** 图标，或使用 <shortcut>Shift + Cmd + R</shortcut>/<shortcut>Shift + F10</shortcut> 快捷方式。

    IntelliJ IDEA 将打开 **Run** 选项卡并显示输出 — [example.com](https://example.com/) 的内容：

    ![Application output with HTML-code](native-output.png){width=700}

您可以看到实际输出，因为 `curl_easy_perform` 调用会将结果打印到标准输出。您可以使用 `curl_easy_setopt` 隐藏此输出。

> 您可以在我们的 [GitHub 仓库](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native) 中获取完整的项目代码。
>
{style="note"}

## 接下来

了解更多关于 [Kotlin 与 C 的互操作性](native-c-interop.md)。