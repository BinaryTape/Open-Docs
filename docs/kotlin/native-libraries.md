[//]: # (title: Kotlin/Native 库)

## Kotlin 编译器具体细节

要使用 Kotlin/Native 编译器生成库，请使用 `-produce library` 或 `-p library` 标志。例如：

```bash
$ kotlinc-native foo.kt -p library -o bar
```

此命令将生成一个 `bar.klib` 文件，其中包含 `foo.kt` 的编译内容。

要链接到库，请使用 `-library <name>` 或 `-l <name>` 标志。例如：

```bash
$ kotlinc-native qux.kt -l bar
```

此命令将从 `qux.kt` 和 `bar.klib` 生成一个 `program.kexe` 文件。

## cinterop 工具具体细节

**cinterop** 工具的主要输出是为原生库生成 `.klib` 封装器。例如，使用你的 Kotlin/Native 发行版中提供的简单 `libgit2.def` 原生库定义文件

```bash
$ cinterop -def samples/gitchurn/src/nativeInterop/cinterop/libgit2.def -compiler-option -I/usr/local/include -o libgit2
```

我们将得到 `libgit2.klib`。

更多详情请参见 [C Interop](native-c-interop.md)。

## klib 实用工具

**klib** 库管理实用工具允许你探查和安装库。

以下命令可用：

* `content` – 列出库内容：

  ```bash
  $ klib contents <name>
  ```

* `info` – 探查库的簿记详细信息

  ```bash
  $ klib info <name>
  ```

* `install` – 将库安装到默认位置

  ```bash
  $ klib install <name>
  ```

* `remove` – 从默认版本库中移除库

  ```bash
  $ klib remove <name>
  ```

所有上述命令都接受一个附加的 `-repository <directory>` 实参，用于指定一个不同于默认的版本库。

```bash
$ klib <command> <name> -repository <directory>
```

## 几个示例

首先，让我们创建一个库。
将这个小库的源代码放入 `kotlinizer.kt`：

```kotlin
package kotlinizer
val String.kotlinized
    get() = "Kotlin $this"
```

```bash
$ kotlinc-native kotlinizer.kt -p library -o kotlinizer
```

该库已在当前目录中创建：

```bash
$ ls kotlinizer.klib
kotlinizer.klib
```

现在让我们检测库的内容：

```bash
$ klib contents kotlinizer
```

你可以将 `kotlinizer` 安装到默认版本库中：

```bash
$ klib install kotlinizer
```

从当前目录中移除它的任何痕迹：

```bash
$ rm kotlinizer.klib
```

创建一个非常短的程序并将其放入 `use.kt` 中：

```kotlin
import kotlinizer.*

fun main(args: Array<String>) {
    println("Hello, ${"world".kotlinized}!")
}
```

现在，编译程序并链接你刚刚创建的库：

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

### 库搜索序列

当给定 `-library foo` 标志时，编译器按以下顺序搜索 `foo` 库：

* 当前编译目录或绝对路径。
* 所有使用 `-repo` 标志指定的版本库。
* 安装在默认版本库中的库。

   > 默认版本库是 `~/.konan`。你可以通过设置 `kotlin.data.dir` Gradle 属性来更改它。
   > 
   > 或者，你可以使用 `-Xkonan-data-dir` 编译器选项，通过 `cinterop` 和 `konanc` 工具来配置你的自定义目录路径。
   > 
   {style="note"}

* 安装在 `$installation/klib` 目录中的库。

### 库格式

Kotlin/Native 库是包含预定义内容的 zip 文件，具有以下布局的目录结构：

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

一个示例布局可以在你安装目录下的 `klib/stdlib` 目录中找到。

### 在 klib 中使用相对路径

> 在 klib 中使用相对路径自 Kotlin 1.6.20 版本起可用。
> 
{style="note"}

源代码的序列化 IR 表示是 `klib` 库的 [一部分](#library-format)。它包含用于生成正确调试信息的文件路径。默认情况下，存储的路径是绝对的。
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