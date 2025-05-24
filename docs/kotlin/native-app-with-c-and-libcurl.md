---
title: "使用 C 互操作和 libcurl 创建应用程序 – 教程"
---
本教程演示了如何使用 IntelliJ IDEA 创建一个命令行应用程序。您将学习如何创建一个简单的 HTTP 客户端，该客户端可以使用 Kotlin/Native 和 libcurl 库在指定的平台上以原生方式运行。

输出将是一个可执行的命令行应用程序，您可以在 macOS 和 Linux 上运行它，并发出简单的 HTTP GET 请求。

您可以使用命令行直接或通过脚本文件（例如 `.sh` 或 `.bat` 文件）生成 Kotlin 库。但是，这种方法对于具有数百个文件和库的大型项目来说效果不佳。使用构建系统可以通过下载和缓存 Kotlin/Native 编译器二进制文件和具有传递依赖项的库，以及运行编译器和测试来简化流程。Kotlin/Native 可以通过 [Kotlin Multiplatform plugin](gradle-configure-project#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 构建系统。

## 开始之前

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2. 通过在 IntelliJ IDEA 中选择 **File** | **New** | **Project from Version Control** 并使用以下 URL，克隆 [project template](https://github.com/Kotlin/kmp-native-wizard)：

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```

3. 浏览项目结构：

   <img src="/img/native-project-structure.png" alt="Native application project structure" width="700" style={{verticalAlign: 'middle'}}/>

   该模板包含一个项目，其中包含您入门所需的文件和文件夹。重要的是要理解，如果代码没有平台特定的要求，则用 Kotlin/Native 编写的应用程序可以针对不同的平台。您的代码位于 `nativeMain` 目录中，并带有相应的 `nativeTest`。对于本教程，请保持文件夹结构不变。

4. 打开 `build.gradle.kts` 文件，这是包含项目设置的构建脚本。请特别注意构建文件中的以下内容：

    ```kotlin
    kotlin {
        val hostOs = System.getProperty("os.name")
        val isArm64 = System.getProperty("os.arch") == "aarch64"
        val isMingwX64 = hostOs.startsWith("Windows")
        val nativeTarget = when {
            hostOs == "Mac OS X" && isArm64 `->` macosArm64("native")
            hostOs == "Mac OS X" && !isArm64 `->` macosX64("native")
            hostOs == "Linux" && isArm64 `->` linuxArm64("native")
            hostOs == "Linux" && !isArm64 `->` linuxX64("native")
            isMingwX64 `->` mingwX64("native")
            else `->` throw GradleException("Host OS is not supported in Kotlin/Native.")
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

   * 目标是使用 `macosArm64`、`macosX64`、`linuxArm64`、`linuxX64` 和 `mingwX64` 为 macOS、Linux 和 Windows 定义的。请参阅 [supported platforms](native-target-support) 的完整列表。
   * 条目本身定义了一系列属性，以指示如何生成二进制文件以及应用程序的入口点。这些可以保留为默认值。
   * C 互操作性配置为构建中的一个附加步骤。默认情况下，C 中的所有符号都导入到 `interop` 包中。您可能需要在 `.kt` 文件中导入整个包。了解有关 [how to configure](gradle-configure-project#targeting-multiple-platforms) 它的更多信息。

## 创建定义文件

在编写原生应用程序时，您通常需要访问某些未包含在 [Kotlin standard library](https://kotlinlang.org/api/latest/jvm/stdlib/) 中的功能，例如发出 HTTP 请求、从磁盘读取和写入等等。

Kotlin/Native 有助于使用标准 C 库，从而打开了可能需要的几乎任何功能的整个生态系统。Kotlin/Native 已经附带了一组预构建的 [platform libraries](native-platform-libs)，这些库为标准库提供了一些额外的常用功能。

互操作的理想方案是像调用 Kotlin 函数一样调用 C 函数，遵循相同的签名和约定。这时 cinterop 工具就派上用场了。它接受一个 C 库并生成相应的 Kotlin 绑定，以便该库可以像 Kotlin 代码一样使用。

为了生成这些绑定，每个库都需要一个定义文件，通常与库同名。这是一个属性文件，用于精确描述应如何使用该库。

在此应用程序中，您将需要 libcurl 库来发出一些 HTTP 调用。要创建其定义文件：

1. 选择 `src` 文件夹，然后使用 **File | New | Directory** 创建一个新目录。
2. 将新目录命名为 **nativeInterop/cinterop**。这是头文件位置的默认约定，但如果您使用其他位置，则可以在 `build.gradle.kts` 文件中覆盖它。
3. 选择这个新的子文件夹，然后使用 **File | New | File** 创建一个新的 `libcurl.def` 文件。
4. 使用以下代码更新您的文件：

    ```c
    headers = curl/curl.h
    headerFilter = curl/*
    
    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

   * `headers` 是要为其生成 Kotlin 桩的头文件列表。您可以将多个文件添加到此条目，并用空格分隔每个文件。在这种情况下，它只有 `curl.h`。引用的文件需要在指定的路径上可用（在本例中为 `/usr/include/curl`）。
   * `headerFilter` 显示了包含的具体内容。在 C 中，当一个文件使用 `#include` 指令引用另一个文件时，也会包含所有头文件。有时没有必要这样做，您可以使用此参数 [using glob patterns](https://en.wikipedia.org/wiki/Glob_(programming)) 进行调整。

     如果您不想将外部依赖项（例如系统 `stdint.h` 标头）提取到互操作库中，则可以使用 `headerFilter`。此外，它对于库大小优化和修复系统和提供的 Kotlin/Native 编译环境之间的潜在冲突可能很有用。

   * 如果需要修改某个平台的行为，可以使用 `compilerOpts.osx` 或 `compilerOpts.linux` 之类的格式为选项提供特定于平台的值。在这种情况下，它们是 macOS（`.osx` 后缀）和 Linux（`.linux` 后缀）。也可以使用没有后缀的参数（例如，`linkerOpts=`），并将其应用于所有平台。

   有关可用选项的完整列表，请参阅 [Definition file](native-definition-file#properties)。

:::note
您需要在系统上安装 `curl` 库二进制文件才能使示例正常工作。在 macOS 和 Linux 上，它们通常包含在内。在 Windows 上，您可以从 [sources](https://curl.se/download.html) 构建它（您需要 Microsoft Visual Studio 或 Windows SDK 命令行工具）。有关更多详细信息，请参阅 [related blog post](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/)。或者，您可能需要考虑使用 [MinGW/MSYS2](https://www.msys2.org/) `curl` 二进制文件。

:::

## 将互操作性添加到构建过程中

要使用头文件，请确保它们是作为构建过程的一部分生成的。为此，请将以下条目添加到 `build.gradle.kts` 文件中：

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

首先，添加 `cinterops`，然后添加定义文件的条目。默认情况下，使用文件的名称。您可以使用其他参数覆盖此设置：

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

现在您有了库和相应的 Kotlin 桩，您可以从应用程序中使用它们。对于本教程，请将 [simple.c](https://curl.se/libcurl/c/simple.html) 示例转换为 Kotlin。

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

正如您所看到的，在 Kotlin 版本中消除了显式变量声明，但其他所有内容几乎与 C 版本相同。您期望在 libcurl 库中找到的所有调用都可以在 Kotlin 等效项中使用。

:::note
这是一个逐行字面翻译。您也可以以更具 Kotlin 习惯用法的方式编写此代码。

:::

## 编译并运行应用程序

1. 编译应用程序。为此，请从任务列表中运行 `runDebugExecutableNative` Gradle 任务，或在终端中使用以下命令：
 
   ```bash
   ./gradlew runDebugExecutableNative
   ```

   在这种情况下，由 cinterop 工具生成的部分隐式包含在构建中。

2. 如果编译期间没有错误，请单击 `main()` 函数旁边的装订线中的绿色 **Run** 图标，或使用 <shortcut>Shift + Cmd + R</shortcut>/<shortcut>Shift + F10</shortcut> 快捷方式。

   IntelliJ IDEA 将打开 **Run** 选项卡并显示输出 — [example.com](https://example.com/) 的内容：

   <img src="/img/native-output.png" alt="Application output with HTML-code" width="700" style={{verticalAlign: 'middle'}}/>

您可以看到实际输出，因为调用 `curl_easy_perform` 会将结果打印到标准输出。您可以使用 `curl_easy_setopt` 隐藏此输出。

您可以在我们的 [GitHub repository](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native) 中获取完整的项目代码。

:::

## 接下来做什么

了解更多关于 [Kotlin's interoperability with C](native-c-interop)。