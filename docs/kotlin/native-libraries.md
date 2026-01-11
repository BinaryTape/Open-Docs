[//]: # (title: Kotlin/Native 库)

## 库编译

你可以使用项目的构建文件或 Kotlin/Native 编译器为你的库生成一个 `*.klib` 构件。

### 使用 Gradle 构建文件

你可以通过在 Gradle 构建文件中指定一个 [Kotlin/Native 目标平台](native-target-support.md)来编译一个 `*.klib` 库构件：

1.  在你的 `build.gradle(.kts)` 文件中，声明至少一个 Kotlin/Native 目标平台。例如：

    ```kotlin
    // build.gradle.kts
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }
 
    kotlin {
        macosArm64()    // on macOS
        // linuxArm64() // on Linux
        // mingwX64()   // on Windows
    }
    ```

2.  运行 `<target>Klib` 任务。例如：

    ```bash
    ./gradlew macosArm64Klib
    ```

Gradle 会自动编译该目标平台的源代码文件，并在项目的 `build/libs` 目录中生成 `.klib` 构件。

### 使用 Kotlin/Native 编译器

要使用 Kotlin/Native 编译器生成库：

1.  [下载并安装 Kotlin/Native 编译器。](native-get-started.md#download-and-install-the-compiler)
2.  要将 Kotlin/Native 源代码文件编译为库，请使用 `-produce library` 或 `-p library` 选项：

    ```bash
    kotlinc-native foo.kt -p library -o bar
    ```

    此命令会将 `foo.kt` 文件的内容编译为一个名为 `bar` 的库，生成一个 `bar.klib` 构件。

3.  要将另一个文件链接到库，请使用 `-library <name>` 或 `-l <name>` 选项。例如：

    ```bash
    kotlinc-native qux.kt -l bar
    ```
   
    此命令会编译 `qux.kt` 源代码文件和 `bar.klib` 库的内容，并生成 `program.kexe` 最终可执行二进制文件。

## klib 实用工具

**klib** 库管理实用工具允许你使用以下语法探查库：

```bash
klib <command> <library path> [<option>]
```

目前支持以下命令：

| 命令                          | 描述                                                                                                                                                                                                                                                                                                                                   |
|:------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `info`                        | 关于库的通用信息。                                                                                                                                                                                                                                                                                                                     |
| `dump-abi`                    | 转储库的 ABI 快照。快照中的每一行都对应一个声明。如果某个声明发生 ABI 不兼容的更改，将在快照的相应行中可见。                                                                                                                                                                                                                                |
| `dump-ir`                     | 将库声明的中间表示 (IR) 转储到输出。仅用于调试。                                                                                                                                                                                                                                                                                       |
| `dump-ir-signatures`          | 转储所有非私有库声明以及此库消费的所有非私有声明的 IR 签名（作为两个独立的列表）。此命令纯粹依赖于 IR 中的数据。                                                                                                                                                                                                                       |
| `dump-ir-inlinable-functions` | 将库中可内联函数的 IR 转储到输出。仅用于调试。                                                                                                                                                                                                                                                                                         |
| `dump-metadata`               | 将所有库声明的元数据转储到输出。仅用于调试。                                                                                                                                                                                                                                                                                           |
| `dump-metadata-signatures`    | 转储所有基于库元数据的非私有库声明的 IR 签名。在大多数情况下，其输出与 `dump-ir-signatures` 命令的输出相同，后者基于 IR 渲染签名。但是，如果在编译期间使用了 IR 转换编译器插件（例如 Compose），则修补后的声明可能具有不同的签名。 |

所有上述转储命令都接受一个附加的 `-signature-version {N}` 实参，该实参指示 klib 实用工具在转储签名时渲染哪个 IR 签名版本。如果未提供，它将使用库支持的最新版本。例如：

```bash
klib dump-metadata-signatures mylib.klib -signature-version 1
```

此外，`dump-metadata` 命令接受 `-print-signatures {true|false}` 实参，该实参指示 klib 实用工具打印输出中每个声明的 IR 签名。

## 创建和使用库

1.  通过将源代码放入 `kotlinizer.kt` 来创建库：

    ```kotlin
    package kotlinizer
    
    val String.kotlinized
        get() = "Kotlin $this"
    ```

2.  将库编译为 `.klib`：

    ```bash
    kotlinc-native kotlinizer.kt -p library -o kotlinizer
    ```

3.  检测当前目录中创建的库：

    ```bash
    ls kotlinizer.klib
    ```

4.  查看关于库的通用信息：

    ```bash
    klib info kotlinizer.klib
    ```

5.  在 `use.kt` 文件中创建一个简短程序：

    ```kotlin
    import kotlinizer.*
    
    fun main(args: Array<String>) {
        println("Hello, ${"world".kotlinized}!")
    }
    ```

6.  编译程序，将 `use.kt` 源代码文件链接到你的库：

    ```bash
    kotlinc-native use.kt -l kotlinizer -o kohello
    ```

7.  运行程序：

    ```bash
    ./kohello.kexe
    ```

你会在输出中看到 `Hello, Kotlin world!`。

## 库搜索序列

> 库搜索机制即将更改。请留意此部分的更新，并避免依赖已弃用的标志。
> 
{style="note"}

当给定 `-library foo` 选项时，编译器按以下顺序搜索 `foo` 库：

1.  当前编译目录或绝对路径。
2.  安装在默认版本库中的库。

    > 默认版本库是 `~/.konan`。你可以通过设置 `konan.data.dir` Gradle 属性来更改它。
    > 
    > 或者，你可以使用 `-Xkonan-data-dir` 编译器选项，通过 `cinterop` 和 `konanc` 工具来配置你的自定义目录路径。
    > 
    {style="note"}

3.  安装在 `$installation/klib` 目录中的库。

## 库格式

Kotlin/Native 库是包含预定义目录结构的 zip 文件，其布局如下：

当 `foo.klib` 被解包为 `foo/` 时，我们会得到：

```text
- foo/
  - $component_name/
    - ir/
      - 序列化的 Kotlin IR。
    - targets/
      - $platform/
        - kotlin/
          - 编译为 LLVM bitcode 的 Kotlin 代码。
        - native/
          - 附加原生对象的 Bitcode 文件。
      - $another_platform/
        - 可以有多个平台特有的 Kotlin 和原生对。
    - linkdata/
      - 一组包含序列化链接元数据的 ProtoBuf 文件。
    - resources/
      - 通用资源，例如图片。（尚未启用）。
    - manifest - 一个以 Java 属性格式描述库的文件。
```

你可以在 Kotlin/Native 编译器安装目录下的 `klib/common/stdlib` 目录中找到一个示例布局。

## 在 klib 中使用相对路径

源代码文件的序列化 IR 表示是 [klib 库的](#library-format) 一部分。它包含用于生成正确调试信息的文件路径。默认情况下，存储的路径是绝对的。

使用 `-Xklib-relative-path-base` 编译器选项，你可以更改格式并在构件中仅使用相对路径。为了使其工作，请将一个或多个源代码文件的基路径作为实参传递：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base 是源代码文件的基路径
    compilerOptions.freeCompilerArgs.add("-Xklib-relative-path-base=$base")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // $base 是源代码文件的基路径
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
``` 

</tab>
</tabs>

## 接下来是什么？

[了解如何使用 cinterop 工具生成 `*.klib` 构件](native-definition-file.md)