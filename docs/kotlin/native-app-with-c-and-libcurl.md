[//]: # (title: 使用 C 互操作和 libcurl 创建应用 – 教程)

> C 库的导入处于 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 阶段。所有由 cinterop 工具从 C 库生成的 Kotlin 声明都应带有 `@ExperimentalForeignApi` 注解。
>
> Kotlin/Native 附带的原生平台库（例如 Foundation、UIKit 和 POSIX）仅需对部分 API 进行 opt-in。
>
{style="note"}

本教程演示了如何使用 IntelliJ IDEA 创建命令行应用程序。你将学习如何使用 Kotlin/Native 和 libcurl 库创建可在指定平台上原生运行的简单 HTTP 客户端。

输出将是一个可执行的命令行应用，你可以在 macOS 和 Linux 上运行它并进行简单的 HTTP GET 请求。

你可以使用命令行生成 Kotlin 库，无论是直接生成还是通过脚本文件（例如 `.sh` 或 `.bat` 文件）生成。然而，对于拥有数百个文件和库的更大项目，这种方法的可伸缩性不佳。使用构建系统简化了该过程，它通过下载和缓存 Kotlin/Native 编译器二进制文件和具有传递性依赖项的库，以及运行编译器和测试来实现。Kotlin/Native 可以通过 [Kotlin Multiplatform plugin](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 构建系统。

## 开始之前

1.  下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2.  通过在 IntelliJ IDEA 中选择 **File** | **New** | **Project from Version Control** 并使用此 URL，克隆 [项目模板](https://github.com/Kotlin/kmp-native-wizard)：

    ```none
    https://github.com/Kotlin/kmp-native-wizard
    ```

3.  探查项目结构：

    ![原生应用程序项目结构](native-project-structure.png){width=700}

    模板包含一个项目，其中包含你入门所需的文件和文件夹。理解用 Kotlin/Native 编写的应用程序如果代码没有平台特有的要求，则可以面向不同的平台是很重要的。你的代码位于 `nativeMain` 目录中，并有相应的 `nativeTest`。对于本教程，请保持文件夹结构不变。

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

    *   目标使用 `macosArm64`、`macosX64`、`linuxArm64`、`linuxX64` 和 `mingwX64` 定义，分别对应 macOS、Linux 和 Windows。关于 [支持的平台](native-target-support.md) 的完整列表，请参见。
    *   `binaries {}` 代码块定义了二进制文件的生成方式和应用程序的入口点。这些可以保留为默认值。
    *   C 互操作被配置为构建中的一个额外步骤。默认情况下，所有来自 C 的符号都会导入到 `interop` 包中。你可能需要在 `.kt` 文件中导入整个包。关于 [如何配置](gradle-configure-project.md#targeting-multiple-platforms) 它，请参阅更多信息。

## 创建定义文件

在编写原生应用程序时，你通常需要访问 [Kotlin 标准库](https://kotlinlang.org/api/latest/jvm/stdlib/) 中未包含的某些功能性，例如进行 HTTP 请求、从磁盘读写等。

Kotlin/Native 有助于使用标准 C 库，这打开了一个包含几乎你所需所有功能性的完整生态系统。Kotlin/Native 已经附带了一组预构建的 [平台库](native-platform-libs.md)，它们为标准库提供了一些额外的公共功能性。

理想的互操作场景是调用 C 函数，就像调用 Kotlin 函数一样，遵循相同的签名和约定。这就是 cinterop 工具派上用场的时候。它接受一个 C 库并生成相应的 Kotlin 绑定，以便该库可以像 Kotlin 代码一样使用。

为了生成这些绑定，每个库都需要一个定义文件，通常与库同名。这是一个属性文件，精确描述了库应如何被使用。

在此应用中，你将需要 libcurl 库来发出一些 HTTP 调用。要创建其定义文件：

1.  选择 `src` 文件夹，然后通过 **File | New | Directory** 创建一个新目录。
2.  将新目录命名为 **nativeInterop/cinterop**。这是头文件位置的默认约定，但如果你使用不同的位置，可以在 `build.gradle.kts` 文件中覆盖它。
3.  选择此新子文件夹，然后通过 **File | New | File** 创建一个新文件 `libcurl.def`。
4.  使用以下代码更新你的文件：

    ```c
    headers = curl/curl.h
    headerFilter = curl/*
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

    *   `headers` 是用于生成 Kotlin 存根的头文件列表。你可以在此处添加多个文件，用空格分隔。在本例中，它只有 `curl.h`。引用的文件需要位于指定的路径上（在本例中，是 `/usr/include/curl`）。
    *   `headerFilter` 显示了具体包含哪些内容。在 C 语言中，当一个文件使用 `#include` 指令引用另一个文件时，所有头文件也会被包含进来。有时这并非必要，你可以 [使用 glob 模式](https://en.wikipedia.org/wiki/Glob_(programming)) 添加此形参以进行调整。

        如果你不想将外部依赖项（例如系统 `stdint.h` 头文件）引入互操作库中，可以使用 `headerFilter`。此外，它可能有助于优化库大小，并修复系统与提供的 Kotlin/Native 编译环境之间的潜在冲突。

    *   如果需要修改特定平台的行为，你可以使用 `compilerOpts.osx` 或 `compilerOpts.linux` 等格式，为选项提供平台特有的值。在本例中，它们是 macOS（`.osx` 后缀）和 Linux（`.linux` 后缀）。不带后缀的形参也是可能的（例如 `linkerOpts=`），并应用于所有平台。

    关于可用选项的完整列表，请参见 [定义文件](native-definition-file.md#properties)。

> 你的系统需要有 `curl` 库的二进制文件才能使示例正常工作。在 macOS 和 Linux 上，它们通常已包含在内。在 Windows 上，你可以从 [源代码](https://curl.se/download.html) 构建它（你需要 Microsoft Visual Studio 或 Windows SDK 命令行工具）。关于更多详细信息，请参见 [相关博客文章](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/)。或者，你也可以考虑使用 [MinGW/MSYS2](https://www.msys2.org/) 的 `curl` 二进制文件。
>
{style="note"}

## 将互操作添加到构建过程

要使用头文件，请确保它们作为构建过程的一部分生成。为此，将以下 `compilations {}` 代码块添加到 `build.gradle.kts` 文件中：

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

首先，添加 `cinterops`，然后是定义文件的条目。默认情况下，使用文件的名称。你可以通过额外的形参覆盖此项：

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

现在你已经有了库和相应的 Kotlin 存根，你可以在应用程序中使用它们。对于本教程，将 [simple.c](https://curl.se/libcurl/c/simple.html) 示例转换为 Kotlin。

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

如你所见，Kotlin 版本中消除了显式变量声明，但其他一切与 C 版本基本相同。libcurl 库中你期望的所有调用在等效的 Kotlin 中都可用。

> 这是一个逐行的字面翻译。你也可以用更具 Kotlin 惯用风格的方式编写此代码。
>
{type="tip"}

## 编译并运行应用程序

1.  编译应用程序。为此，从任务列表运行 `runDebugExecutableNative` Gradle 任务，或在终端中使用以下命令：

    ```bash
    ./gradlew runDebugExecutableNative
    ```

    在这种情况下，cinterop 工具生成的部分被隐式包含在构建中。

2.  如果编译过程中没有错误，点击 `main()` 函数旁边的绿色 **Run** 图标，或使用快捷键 <shortcut>Shift + Cmd + R</shortcut>/<shortcut>Shift + F10</shortcut>。

    IntelliJ IDEA 将打开 **Run** 选项卡并显示输出 — [example.com](https://example.com/) 的内容：

    ![带 HTML 代码的应用程序输出](native-output.png){width=700}

你可以看到实际的输出，因为调用 `curl_easy_perform` 会将结果打印到标准输出。你可以使用 `curl_easy_setopt` 隐藏此内容。

> 你可以在我们的 [GitHub 版本库](https://github.com/kotlin-hands-on/intro-kotlin-native) 中获取完整的项目代码。
>
{style="note"}

## 接下来

关于 [Kotlin 与 C 的互操作性](native-c-interop.md)，请参阅更多信息。