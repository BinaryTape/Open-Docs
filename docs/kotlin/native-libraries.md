---
title: "Kotlin/Native 库"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Kotlin 编译器特性

要使用 Kotlin/Native 编译器生成库，请使用 `-produce library` 或 `-p library` 标志。 例如：

```bash
$ kotlinc-native foo.kt -p library -o bar
```

此命令将生成一个包含 `foo.kt` 编译内容的 `bar.klib`。

要链接到库，请使用 `-library <name>` 或 `-l <name>` 标志。 例如：

```bash
$ kotlinc-native qux.kt -l bar
```

此命令将从 `qux.kt` 和 `bar.klib` 生成一个 `program.kexe`。

## cinterop 工具特性

**cinterop** 工具主要生成原生库的 `.klib` 包装器作为其主要输出。
例如，使用 Kotlin/Native 发行版中提供的简单 `libgit2.def` 原生库定义文件

```bash
$ cinterop -def samples/gitchurn/src/nativeInterop/cinterop/libgit2.def -compiler-option -I/usr/local/include -o libgit2
```

我们将获得 `libgit2.klib`。

有关更多详细信息，请参见 [C Interop](native-c-interop)。

## klib 实用程序

**klib** 库管理实用程序允许您检查和安装库。

以下命令可用：

* `content` – 列出库内容：

  ```bash
  $ klib contents <name>
  ```

* `info` – 检查库的簿记详细信息

  ```bash
  $ klib info <name>
  ```

* `install` – 将库安装到默认位置

  ```bash
  $ klib install <name>
  ```

* `remove` – 从默认存储库中删除库

  ```bash
  $ klib remove <name>
  ```

以上所有命令都接受一个额外的 `-repository <directory>` 参数，用于指定与默认存储库不同的存储库。

```bash
$ klib <command> <name> -repository <directory>
```

## 几个例子

首先，让我们创建一个库。
将微型库源代码放入 `kotlinizer.kt`：

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

现在，让我们检查一下库的内容：

```bash
$ klib contents kotlinizer
```

您可以将 `kotlinizer` 安装到默认存储库：

```bash
$ klib install kotlinizer
```

从当前目录中删除所有痕迹：

```bash
$ rm kotlinizer.klib
```

创建一个非常短的程序，并将其放入 `use.kt` 中：

```kotlin
import kotlinizer.*

fun main(args: Array<String>) {
    println("Hello, ${"world".kotlinized}!")
}
```

现在，编译该程序，并链接到您刚刚创建的库：

```bash
$ kotlinc-native use.kt -l kotlinizer -o kohello
```

并运行该程序：

```bash
$ ./kohello.kexe
Hello, Kotlin world!
```

玩得开心！

## 进阶主题

### 库搜索顺序

当给定一个 `-library foo` 标志时，编译器按以下顺序搜索 `foo` 库：

* 当前编译目录或绝对路径。
* 所有用 `-repo` 标志指定的存储库。
* 安装在默认存储库中的库。

   > 默认存储库是 `~/.konan`。 您可以通过设置 `kotlin.data.dir` Gradle 属性来更改它。
   > 
   > 或者，您可以使用 `-Xkonan-data-dir` 编译器选项，通过 `cinterop` 和 `konanc` 工具配置到该目录的自定义路径。
   > 
   

* 安装在 `$installation/klib` 目录中的库。

### 库格式

Kotlin/Native 库是 zip 文件，包含预定义的目录结构，具有以下布局：

解压缩为 `foo/` 时，`foo.klib` 为我们提供：

```text
  - foo/
    - $component_name/
      - ir/
        - 序列化的 Kotlin IR (Serialized Kotlin IR)。
      - targets/
        - $platform/
          - kotlin/
            - 编译为 LLVM bitcode 的 Kotlin。
          - native/
            - 其他原生对象的 Bitcode 文件。
        - $another_platform/
          - 可以有多个特定于平台的 kotlin 和 native 对。
      - linkdata/
        - 一组包含序列化链接元数据的 ProtoBuf 文件。
      - resources/
        - 常规资源，例如图像。（尚未使用）。
      - manifest - 以 java 属性格式描述库的文件。
```

可以在安装的 `klib/stdlib` 目录中找到示例布局。

### 在 klib 中使用相对路径

:::note
在 klib 中使用相对路径从 Kotlin 1.6.20 开始可用。

:::

源文件的序列化 IR 表示形式是 `klib` 库的 [一部分](#library-format)。 它包括用于生成正确的调试信息的文件路径。 默认情况下，存储的路径是绝对路径。 使用 `-Xklib-relative-path-base` 编译器选项，您可以更改格式并在构件中使用相对路径。 为了使其工作，请传递一个或多个源文件的基本路径作为参数：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base 是源文件的基本路径
    compilerOptions.freeCompilerArgs.add("-Xklib-relative-path-base=$base")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // $base 是源文件的基本路径
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
``` 

</TabItem>
</Tabs>