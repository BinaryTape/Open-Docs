[//]: # (title: 自定义 LLVM 后端的技巧)
<primary-label ref="advanced"/>

Kotlin/Native 编译器使用 [LLVM](https://llvm.org/) 为不同的目标平台优化和生成二进制可执行文件。编译时间的相当一部分也花在了 LLVM 上，对于大型应用，这最终可能会耗费过长的时间，令人难以接受。

你可以自定义 Kotlin/Native 如何使用 LLVM，并调整优化遍的列表。

## 检查构建日志

让我们查看构建日志，了解有多少编译时间耗费在 LLVM 优化遍上：

1. 运行 `linkRelease*` Gradle 任务，并使用 `-Pkotlin.internal.compiler.arguments.log.level=warning` 选项，以使 Gradle 输出 LLVM 性能分析详情，例如：

   ```bash
   ./gradlew linkReleaseExecutableMacosArm64 -Pkotlin.internal.compiler.arguments.log.level=warning
   ```

   执行时，该任务会打印必要的编译器实参，例如：

   ```none
   > Task :linkReleaseExecutableMacosArm64
   Run in-process tool "konanc"
   Entry point method = org.jetbrains.kotlin.cli.utilities.MainKt.daemonMain
   Classpath = [
           /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/konan/lib/kotlin-native-compiler-embeddable.jar
           /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/konan/lib/trove4j.jar
   ]
   Arguments = [
           -Xinclude=...
           -library
           /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/klib/common/stdlib
           -no-endorsed-libs
           -nostdlib
           ...
   ]
   ```

2. 运行命令行编译器，使用提供的实参，再加上 `-Xprofile-phases` 实参，例如：

   ```bash
   /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/bin/kotlinc-native \
   -Xinclude=... \
   -library /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/klib/common/stdlib \
   ... \
   -Xprofile-phases
   ```

3. 检查构建日志中生成的输出。日志可能包含数万行；LLVM 性能分析部分在末尾。

以下是运行一个简单 Kotlin/Native 程序时的摘录：

```none
Frontend: 275 msec
PsiToIr: 1186 msec
...
... 30k lines
...
LinkBitcodeDependencies: 476 msec
StackProtectorPhase: 0 msec
MandatoryBitcodeLLVMPostprocessingPhase: 2 msec
===-------------------------------------------------------------------------===
                          Pass execution timing report
===-------------------------------------------------------------------------===
  Total Execution Time: 6.7726 seconds (6.7192 wall clock)

   ---User Time---   --System Time--   --User+System--   ---Wall Time---  --- Name ---
   0.9778 ( 22.4%)   0.5043 ( 21.0%)   1.4821 ( 21.9%)   1.4628 ( 21.8%)  InstCombinePass
   0.3827 (  8.8%)   0.2497 ( 10.4%)   0.6323 (  9.3%)   0.6283 (  9.4%)  InlinerPass
   0.2815 (  6.4%)   0.1792 (  7.5%)   0.4608 (  6.8%)   0.4555 (  6.8%)  SimplifyCFGPass
...
   0.6444 (100.0%)   0.5474 (100.0%)   1.1917 (100.0%)   1.1870 (100.0%)  Total

ModuleBitcodeOptimization: 8118 msec
...
LTOBitcodeOptimization: 1399 msec
...
```

Kotlin/Native 编译器运行两组独立的 LLVM 优化序列：模块遍和链接时遍。对于典型的编译，这两个流水线是依次运行的，唯一真正的区别在于它们运行哪些 LLVM 优化遍。

在上述日志中，两个 LLVM 优化分别是 `ModuleBitcodeOptimization` 和 `LTOBitcodeOptimization`。格式化表格是优化的输出，其中包含每遍的计时信息。

## 自定义 LLVM 优化遍

如果上述某个遍的耗时显得过长，你可以跳过它。然而，这可能会损害运行时性能，因此之后你应该检测基准测试性能的变化。

目前，没有直接的方式来[禁用给定遍](https://youtrack.jetbrains.com/issue/KT-69212)。不过，你可以使用以下编译器选项来提供一个新的要运行的遍列表：

| **选项**             | **发布二进制文件的默认值** |
|------------------------|--------------------------------------|
| `-Xllvm-module-passes` | `"default<O3>"`                      |
| `-Xllvm-lto-passes`    | `"internalize,globaldce,lto<O3>"`    |

默认值会展开成一个很长的实际遍列表，你需要从中排除不需要的遍。

要获取实际遍列表，请运行 [`opt`](https://llvm.org/docs/CommandGuide/opt.html) 工具，该工具会随 LLVM 分发自动下载到 `~/.konan/dependencies/llvm-{VERSION}-{ARCH}-{OS}-dev-{BUILD}/bin` 目录。

例如，要获取链接时遍列表，请运行：

```bash
opt -print-pipeline-passes -passes="internalize,globaldce,lto<O3>" < /dev/null
```

这会输出一个警告和很长的遍列表，该列表取决于 LLVM 版本。

`opt` 工具生成的遍列表与 Kotlin/Native 编译器实际运行的遍之间存在两个区别：

* 由于 `opt` 是一个调试工具，它会包含一个或多个 `verify` 遍，这些遍通常不运行。
* Kotlin/Native 会禁用 `devirt` 遍，因为 Kotlin 编译器已经自行执行了它们。

禁用任何遍之后，请务必重新运行性能测试，以检测运行时性能下降是否可接受。