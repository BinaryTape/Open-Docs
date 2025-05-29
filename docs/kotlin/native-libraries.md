[//]: # (title: Kotlin/Native 库)

## Kotlin 编译器详情

要使用 Kotlin/Native 编译器生成库，请使用 `-produce library` 或 `-p library` 标志。例如：

```bash
$ kotlinc-native foo.kt -p library -o bar
```

此命令将生成一个包含 `foo.kt` 编译内容的 `bar.klib` 文件。

要链接到库，请使用 `-library <name>` 或 `-l <name>` 标志。例如：

```bash
$ kotlinc-native qux.kt -l bar
```

此命令将从 `qux.kt` 和 `bar.klib` 生成 `program.kexe`。

## cinterop 工具详情

**cinterop** 工具的主要输出是为原生库生成的 `.klib` 包装器。
例如，使用你的 Kotlin/Native 发行版中提供的简单原生库定义文件 `libgit2.def`：

```bash
$ cinterop -def samples/gitchurn/src/nativeInterop/cinterop/libgit2.def -compiler-option -I/usr/local/include -o libgit2
```

我们将得到 `libgit2.klib`。

更多详情请参见 [C 互操作](native-c-interop.md)。

## klib 工具

**klib** 库管理工具允许你检查和安装库。

以下命令可用：

*   `content` – 列出库内容：

    ```bash
    $ klib contents <name>
    ```

*   `info` – 检查库的簿记详情

    ```bash
    $ klib info <name>
    ```

*   `install` – 将库安装到默认位置：

    ```bash
    $ klib install <name>
    ```

*   `remove` – 从默认仓库中移除库：

    ```bash
    $ klib remove <name>
    ```

上述所有命令都接受一个额外的 `-repository <directory>` 参数，用于指定与默认仓库不同的仓库。

```bash
$ klib <command> <name> -repository <directory>
```

## 几个示例

首先，让我们创建一个库。
将这个小型库的源代码放入 `kotlinizer.kt`：

```kotlin
package kotlinizer
val String.kotlinized
    get() = "Kotlin $this"
```

```bash
$ kotlinc-native kotlinizer.kt -p library -o kotlinizer
```

库已在当前目录中创建：

```bash
$ ls kotlinizer.klib
kotlinizer.klib
```

现在，让我们检查库的内容：

```bash
$ klib contents kotlinizer
```

你可以将 `kotlinizer` 安装到默认仓库：

```bash
$ klib install kotlinizer
```

从当前目录中删除它的所有痕迹：

```bash
$ rm kotlinizer.klib
```

创建一个非常短的程序并将其放入 `use.kt`：

```kotlin
import kotlinizer.*

fun main(args: Array<String>) {
    println("Hello, ${"world".kotlinized}!")
}
```

现在，编译程序并链接到你刚刚创建的库：

```bash
$ kotlinc-native use.kt -l kotlinizer -o kohello
```

并运行程序：

```bash
$ ./kohello.kexe
Hello, Kotlin world!
```

玩得开心！

## 高级主题

### 库搜索顺序

当给定 `-library foo` 标志时，编译器会按以下顺序搜索 `foo` 库：

*   当前编译目录或绝对路径。
*   所有通过 `-repo` 标志指定的仓库。
*   安装在默认仓库中的库。

    > 默认仓库是 `~/.konan`。你可以通过设置 `kotlin.data.dir` Gradle 属性来更改它。
    >
    > 或者，你可以使用 `-Xkonan-data-dir` 编译器选项，通过 `cinterop` 和 `konanc` 工具配置你的自定义目录路径。
    >
    {style="note"}

*   安装在 `$installation/klib` 目录中的库。

### 库格式

Kotlin/Native 库是包含预定义目录结构的 zip 文件，其布局如下：

当 `foo.klib` 解压为 `foo/` 时，我们会得到：

```text
  - foo/
    - $component_name/
      - ir/
        - 序列化的 Kotlin IR。
      - targets/
        - $platform/
          - kotlin/
            - 编译为 LLVM 比特码的 Kotlin 代码。
          - native/
            - 附加原生对象的比特码文件。
        - $another_platform/
          - 可以有多个特定于平台的 kotlin 和 native 对。
      - linkdata/
        - 一组包含序列化链接元数据的 ProtoBuf 文件。
      - resources/
        - 通用资源，例如图像。（尚未启用）。
      - manifest - 描述库的 Java 属性格式文件。
```

一个示例布局可以在你的安装目录中的 `klib/stdlib` 目录中找到。

### 在 klibs 中使用相对路径

> 在 klibs 中使用相对路径的功能自 Kotlin 1.6.20 起可用。
>
{style="note"}

源文件的序列化 IR 表示是 `klib` 库的[一部分](#library-format)。它包含用于生成正确调试信息的文件路径。默认情况下，存储的路径是绝对路径。
通过 `-Xklib-relative-path-base` 编译器选项，你可以更改格式并在工件中仅使用相对路径。要使其工作，请将一个或多个源文件的基路径作为参数传递：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base 是源文件的基路径
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
        // $base 是源文件的基路径
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
```

</tab>
</tabs>