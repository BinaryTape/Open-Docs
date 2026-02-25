[//]: # (title: 自定义 LLVM 后端的技巧)
<primary-label ref="advanced"/>

Kotlin/Native 编译器使用 [LLVM](https://llvm.org/) 来优化并为不同的目标平台生成二进制可执行文件。
编译时间中很大一部分也花在了 LLVM 上，对于大型应用，这最终可能会消耗令人无法接受的长时间。

您可以自定义 Kotlin/Native 使用 LLVM 的方式，并调整优化 pass 列表。

## 查看构建日志

让我们查看构建日志，以了解 LLVM 优化 pass 在编译过程中占用了多少时间：

1. 运行 `linkRelease*` Gradle 任务并带有 `-Pkotlin.internal.compiler.arguments.log.level=warning` 选项，使 Gradle 输出 LLVM 分析（profiling）详细信息，例如：

   ```bash
   ./gradlew linkReleaseExecutableMacosArm64 -Pkotlin.internal.compiler.arguments.log.level=warning
   ```

   在执行时，该任务会打印必要的编译器参数，例如：

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

2. 使用提供的参数加上 `-Xprofile-phases` 参数运行命令行编译器，例如：

   ```bash
   /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/bin/kotlinc-native \
   -Xinclude=... \
   -library /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/klib/common/stdlib \
   ... \
   -Xprofile-phases
   ```

3. 检查构建日志中生成的输出。日志可能包含数万行；带有 LLVM 分析的部分位于末尾。

以下是一个简单的 Kotlin/Native 程序运行后的摘录：

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

Kotlin/Native 编译器运行两个独立的 LLVM 优化序列：模块 pass 和链接时 pass。对于典型的编译，这两个流水线是紧接着运行的，唯一的实际区别在于它们运行哪些 LLVM 优化 pass。

在上面的日志中，两个 LLVM 优化分别是 `ModuleBitcodeOptimization` 和 `LTOBitcodeOptimization`。格式化的表格是优化的输出，包含了每个 pass 的耗时。

## 自定义 LLVM 优化 pass

如果上述某个 pass 耗时过长得不合理，您可以将其跳过。但是，这可能会损害运行时性能，因此您应该在操作后检查基准测试性能的变化。

目前，没有直接的方法来[禁用给定 pass](https://youtrack.jetbrains.com/issue/KT-69212)。但是，您可以通过使用以下编译器选项来提供要运行的新 pass 列表：

| **选项**             | **Release 二进制文件的默认值** |
|------------------------|--------------------------------------|
| `-Xllvm-module-passes` | `"default<O3>"`                      |
| `-Xllvm-lto-passes`    | `"internalize,globaldce,lto<O3>"`    |

默认值会被展开为一长串实际的 pass，您需要从中排除不需要的 pass。

要获取实际的 pass 列表，请运行 [`opt`](https://llvm.org/docs/CommandGuide/opt.html) 工具，该工具会随 LLVM 分发自动下载到 `~/.konan/dependencies/llvm-{VERSION}-{ARCH}-{OS}-dev-{BUILD}/bin` 目录中。

例如，要获取链接时 pass 列表，请运行：

```bash
opt -print-pipeline-passes -passes="internalize,globaldce,lto<O3>" < /dev/null
```

这将输出一条警告和一长串 pass，具体内容取决于 LLVM 版本。

`opt` 工具提供的 pass 列表与 Kotlin/Native 编译器实际运行的 pass 之间存在两点差异：

* 由于 `opt` 是一个调试工具，它包含一个或多个 `verify` pass，这些 pass 通常不会运行。
* Kotlin/Native 禁用了 `devirt` pass，因为 Kotlin 编译器本身已经完成了这些操作。

在禁用任何 pass 后，请务必重新运行性能测试，以检查运行时性能的下降是否在可接受范围内。