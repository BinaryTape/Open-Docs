[//]: # (title: Kotlin/Native 库)

## 库编译

您可以使用项目的构建文件或 Kotlin/Native 编译器为您的库生成 `*.klib` 构件。

### 使用 Gradle 构建文件

您可以通过在 Gradle 构建文件中指定 [Kotlin/Native 目标](native-target-support.md)来编译 `*.klib` 库构件：

1. 在您的 `build.gradle(.kts)` 文件中，声明至少一个 Kotlin/Native 目标。例如：

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }
 
   kotlin {
       macosArm64()    // 在 macOS 上
       // linuxArm64() // 在 Linux 上
       // mingwX64()   // 在 Windows 上
   }
   ```

2. 运行 `<target>Klib` 任务。例如：

   ```bash
   ./gradlew macosArm64Klib
   ```

Gradle 会自动为该目标编译源代码文件，并在项目的 `build/libs` 目录中生成 `.klib` 构件。

### 使用 Kotlin/Native 编译器

要使用 Kotlin/Native 编译器生成库：

1. [下载并安装 Kotlin/Native 编译器。](native-get-started.md#download-and-install-the-compiler)
2. 要将 Kotlin/Native 源代码文件编译为库，请使用 `-produce library` 或 `-p library` 选项：

   ```bash
   kotlinc-native foo.kt -p library -o bar
   ```

   此命令将 `foo.kt` 文件的内容编译为名为 `bar` 的库，并生成 `bar.klib` 构件。

3. 要将另一个文件链接到库，请使用 `-library <name>` 或 `-l <name>` 选项。例如：

   ```bash
   kotlinc-native qux.kt -l bar
   ```
   
   此命令会编译 `qux.kt` 源代码文件和 `bar.klib` 库的内容，并生成 `program.kexe` 最终可执行二进制文件。

## klib 工具

**klib** 库管理工具允许您使用以下语法检查库：

```bash
klib <command> <library path> [<option>]
```

目前提供以下命令：

| 命令 | 描述 |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `info`                        | 库的一般信息。 |
| `dump-abi`                    | 转储库的 ABI 快照。快照中的每一行对应一个声明。如果某个声明发生了 ABI 不兼容的更改，将在快照的相应行中可见。 |
| `dump-ir`                     | 将库声明的中间表示 (IR) 转储到输出。仅用于调试。 |
| `dump-ir-signatures`          | 转储所有非私有库声明以及该库使用的所有非私有声明（作为两个单独的列表）的 IR 签名。此命令完全依赖于 IR 中的数据。 |
| `dump-ir-inlinable-functions` | 将库中内联函数的 IR 转储到输出。仅用于调试。 |
| `dump-metadata`               | 将所有库声明的元数据转储到输出。仅用于调试。 |
| `dump-metadata-signatures`    | 基于库元数据转储所有非私有库声明的 IR 签名。在大多数情况下，其输出与基于 IR 渲染签名的 `dump-ir-signatures` 命令相同。但是，如果在编译期间使用了 IR 转换编译器插件（例如 Compose），则修补后的声明可能具有不同的签名。 |

以上所有转储命令都接受一个额外的 `-signature-version {N}` 参数，该参数指示 klib 工具在转储签名时渲染哪个 IR 签名版本。如果未提供，它将使用库支持的最现代版本。例如：

```bash
klib dump-metadata-signatures mylib.klib -signature-version 1
```

此外，`dump-metadata` 命令接受 `-print-signatures {true|false}` 参数，指示 klib 工具在输出中打印每个声明的 IR 签名。

## 创建并使用库

1. 通过将源代码放入 `kotlinizer.kt` 来创建一个库：

   ```kotlin
   package kotlinizer

   val String.kotlinized
       get() = "Kotlin $this"
   ```

2. 将库编译为 `.klib`：

   ```bash
   kotlinc-native kotlinizer.kt -p library -o kotlinizer
   ```

3. 检查当前目录中创建的库：

   ```bash
   ls kotlinizer.klib
   ```

4. 查看有关库的一般信息：

   ```bash
   klib info kotlinizer.klib
   ```

5. 在 `use.kt` 文件中创建一个简短程序：

   ```kotlin
   import kotlinizer.*

   fun main(args: Array<String>) {
       println("Hello, ${"world".kotlinized}!")
   }
   ```

6. 编译程序，将 `use.kt` 源代码文件链接到您的库：

   ```bash
   kotlinc-native use.kt -l kotlinizer -o kohello
   ```

7. 运行程序：

   ```bash
   ./kohello.kexe
   ```

您应该会在输出中看到 `Hello, Kotlin world!`。

## 库搜索序列

> 库搜索机制即将更改。请关注此部分的更新，并避免依赖已弃用的标记。
> 
{style="note"}

当给定 `-library foo` 选项时，编译器按以下顺序搜索 `foo` 库：

1. 当前编译目录或绝对路径。
2. 安装在默认仓库中的库。

   > 默认仓库为 `~/.konan`。您可以通过设置 `konan.data.dir` Gradle 属性来更改它。
   > 
   > 或者，您可以使用 `-Xkonan-data-dir` 编译器选项，通过 `cinterop` 和 `konanc` 工具配置自定义目录路径。
   > 
   {style="note"}

3. 安装在 `$installation/klib` 目录中的库。

## 库格式

Kotlin/Native 库是包含预定义目录结构的 zip 文件，布局如下：

`foo.klib` 解压缩为 `foo/` 时得到：

```text
- foo/
  - $component_name/
    - ir/
      - 序列化的 Kotlin IR。
    - targets/
      - $platform/
        - kotlin/
          - 编译为 LLVM 位码的 Kotlin。
        - native/
          - 其他原生对象的位码文件。
      - $another_platform/
        - 可能会有多个特定于平台的 kotlin 和原生对。
    - linkdata/
      - 一组包含序列化链接元数据的 ProtoBuf 文件。
    - resources/
      - 一般资源（如图像）。（尚未启用）。
    - manifest - 一个采用 Java 属性格式的、描述库的文件。
```

您可以在 Kotlin/Native 编译器安装目录的 `klib/common/stdlib` 目录中找到布局示例。

## 在 klib 中使用相对路径

源代码文件的序列化 IR 表示是 `klib` 库的[一部分](#library-format)。它包括用于生成正确调试信息的文件路径。默认情况下，存储的路径是绝对路径。

通过 `-Xklib-relative-path-base` 编译器选项，您可以更改格式并在构件中仅使用相对路径。要使其生效，请将源代码文件的一个或多个基路径作为参数传递：

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

## 下一步？

[了解如何使用 cinterop 工具生成 `*.klib` 构件](native-definition-file.md)