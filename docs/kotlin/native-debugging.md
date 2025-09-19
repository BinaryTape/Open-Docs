[//]: # (title: 调试 Kotlin/Native)

Kotlin/Native 编译器可以生成包含调试信息的二进制文件，并为[符号化崩溃报告](#debug-ios-applications)创建调试符号文件。

调试信息兼容 [DWARF 2](https://dwarfstd.org/download.html) 规范，因此像 LLDB 和 GDB 这样的现代调试器工具可以：

* [设置断点](#set-breakpoints)
* [单步执行](#use-stepping)
* [探查变量和类型信息](#inspect-variables)

> 支持 DWARF 2 规范意味着调试器工具将 Kotlin 识别为 C89，因为在 DWARF 5 规范之前，规范中没有针对 Kotlin 语言类型的标识符。
>
{style="note"}

## 生成包含调试信息的二进制文件

在 IntelliJ IDEA、Android Studio 或 Xcode 中调试时，包含调试信息的二进制文件会自动生成（除非构建配置不同）。

您可以通过以下方式手动启用调试并生成包含调试信息的二进制文件：

* **使用 Gradle 任务**。要获取调试二进制文件，请使用 `linkDebug*` Gradle 任务，例如：

  ```bash
  ./gradlew linkDebugFrameworkNative
  ```

  这些任务因二进制类型（例如，`linkDebugSharedNative`）或您的目标平台（例如，`linkDebugExecutableMacosArm64`）而异。

* **使用命令行编译器**。在命令行中，编译您的 Kotlin/Native 二进制文件并带上 `-g` 选项：

  ```bash
  kotlinc-native hello.kt -g -o terminator
  ```

然后启动您的调试器工具。例如：

```bash
lldb terminator.kexe
```

调试器输出：

```bash
$ cat - > hello.kt
fun main(args: Array<String>) {
  println("Hello world")
  println("I need your clothes, your boots and your motorcycle")
}
$ dist/bin/konanc -g hello.kt -o terminator
KtFile: hello.kt
$ lldb terminator.kexe
(lldb) target create "terminator.kexe"
Current executable set to 'terminator.kexe' (x86_64).
(lldb) b kfun:main(kotlin.Array<kotlin.String>)
Breakpoint 1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
(lldb) r
Process 28473 launched: '/Users/minamoto/ws/.git-trees/debugger-fixes/terminator.kexe' (x86_64)
Process 28473 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x00000001000012e4 terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) at hello.kt:2
   1    fun main(args: Array<String>) {
-> 2      println("Hello world")
   3      println("I need your clothes, your boots and your motorcycle")
   4    }
(lldb) n
Hello world
Process 28473 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = step over
    frame #0: 0x00000001000012f0 terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) at hello.kt:3
   1    fun main(args: Array<String>) {
   2      println("Hello world")
-> 3      println("I need your clothes, your boots and your motorcycle")
   4    }
(lldb)
```

## 设置断点

现代调试器提供了几种设置断点的方式。请参阅下文按工具分类的详细说明：

### LLDB

* 按名称：

  ```bash
  (lldb) b -n kfun:main(kotlin.Array<kotlin.String>)
  Breakpoint 4: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
  ```

  `-n` 是可选的，此标志默认应用。

* 按位置（文件名、行号）：

  ```bash
  (lldb) b -f hello.kt -l 1
  Breakpoint 1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
  ```

* 按地址：

  ```bash
  (lldb) b -a 0x00000001000012e4
  Breakpoint 2: address = 0x00000001000012e4
  ```

* 按正则表达式。你可能会发现它在调试生成的构件时很有用，例如 lambda（名称中使用了 `#` 符号的地方）：

  ```bash
  (lldb) b -r main\(
  3: regex = 'main\(', locations = 1
    3.1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = terminator.kexe[0x00000001000012e4], unresolved, hit count = 0
  ```

### GDB

* 按正则表达式：

  ```bash
  (gdb) rbreak main(
  Breakpoint 1 at 0x1000109b4
  struct ktype:kotlin.Unit &kfun:main(kotlin.Array<kotlin.String>);
  ```

* 按名称 __不可用__，因为 `:` 是按位置设置断点的分隔符：

  ```bash
  (gdb) b kfun:main(kotlin.Array<kotlin.String>)
  No source file named kfun.
  Make breakpoint pending on future shared library load? (y or [n]) y
  Breakpoint 1 (kfun:main(kotlin.Array<kotlin.String>)) pending
  ```

* 按位置：

  ```bash
  (gdb) b hello.kt:1
  Breakpoint 2 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 1.
  ```

* 按地址：

  ```bash
  (gdb) b *0x100001704
  Note: breakpoint 2 also set at pc 0x100001704.
  Breakpoint 3 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 2.
  ```

## 单步执行

函数的单步执行方式与 C/C++ 程序大致相同。

## 探查变量

对 `var` 变量的探查对于原生类型和非原生类型都是开箱即用的：

```bash
$ cat -n main.kt
     1  fun main(args: Array<String>) {
     2      var x = 1
     3      var y = 2
     4      var p = Point(x, y)
     5      println("p = $p")
     6  }
     7 
     8  data class Point(val x: Int, val y: Int)

$ lldb ./program.kexe -o 'b main.kt:5' -o
(lldb) target create "./program.kexe"
Current executable set to './program.kexe' (x86_64).
(lldb) b main.kt:5
Breakpoint 1: where = program.kexe`kfun:main(kotlin.Array<kotlin.String>) + 289 at main.kt:5
(lldb) r
Process 4985 stopped
* thread #1, name = 'program.kexe', stop reason = breakpoint 1.1
    frame #0: program.kexe`kfun:main(kotlin.Array<kotlin.String>) at main.kt:5
   2        var x = 1
   3        var y = 2
   4        var p = Point(x, y)
-> 5        println("p = $p")
   6    }
   7   
   8    data class Point(val x: Int, val y: Int)

Process 4985 launched: './program.kexe' (x86_64)
(lldb) fr var
(int) x = 1
(int) y = 2
(ObjHeader *) p = Point(x=1, y=2)

(lldb) v p->x
(int32_t) p->x = 1
```

## 调试 iOS 应用程序

调试 iOS 应用程序有时涉及详细分析崩溃报告。崩溃报告通常需要符号化，即将内存地址转换为可读源代码位置的过程。

为了符号化 Kotlin 代码中的地址（例如，用于对应 Kotlin 代码的堆栈跟踪元素），您需要一个特殊的调试符号 (`.dSYM`) 文件。此文件将崩溃报告中的内存地址与源代码中的实际位置进行映射，例如函数或行号。

Kotlin/Native 编译器默认会为 Apple 平台上的发布（优化过的）二进制文件生成 `.dSYM` 文件。在 Xcode 中构建时，IDE 会在标准位置查找 `.dSYM` 文件并自动使用它们进行符号化。Xcode 会自动检测从 IntelliJ IDEA 模板创建的项目中的 `.dSYM` 文件。

在其他平台上，您可以通过使用 `-Xadd-light-debug` 编译器选项将调试信息添加到生成的二进制文件（这会增加它们的大小）：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=enable"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=enable"
        }
    }
}
```

</tab>
</tabs>

有关崩溃报告的更多信息，请参见 [Apple 文档](https://developer.apple.com/documentation/xcode/diagnosing-issues-using-crash-reports-and-device-logs)。

## 已知问题

* Python 绑定的性能。
* 调试器工具中不支持表达式求值，目前也没有实现它的计划。