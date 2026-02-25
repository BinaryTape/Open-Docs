[//]: # (title: 自訂 LLVM 後端的小技巧)
<primary-label ref="advanced"/>

Kotlin/Native 編譯器使用 [LLVM](https://llvm.org/) 來針對不同目標平台進行最佳化並產生二進制執行檔。
編譯時間中有相當一部分消耗在 LLVM，對於大型應用程式而言，這可能會導致耗時長到無法接受。

您可以自訂 Kotlin/Native 使用 LLVM 的方式，並調整最佳化階段（optimization passes）清單。

## 檢查組建記錄

讓我們看看組建記錄，以了解有多少編譯時間花費在 LLVM 最佳化階段上：

1. 執行 `linkRelease*` Gradle 任務並加上 `-Pkotlin.internal.compiler.arguments.log.level=warning` 選項，讓 Gradle 輸出 LLVM 分析詳細資訊，例如：

   ```bash
   ./gradlew linkReleaseExecutableMacosArm64 -Pkotlin.internal.compiler.arguments.log.level=warning
   ```

   執行時，該任務會印出必要的編譯器引數，例如：

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

2. 使用提供的引數加上 `-Xprofile-phases` 引數來執行命令列編譯器，例如：

   ```bash
   /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/bin/kotlinc-native \
   -Xinclude=... \
   -library /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/klib/common/stdlib \
   ... \
   -Xprofile-phases
   ```

3. 檢查組建記錄中產生的輸出。記錄可能包含數萬行；帶有 LLVM 分析的部分位於末尾。

以下是執行一個簡單 Kotlin/Native 程式的摘錄：

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
   0.9778 ( 22.4 %)   0.5043 ( 21.0 %)   1.4821 ( 21.9 %)   1.4628 ( 21.8 %)  InstCombinePass
   0.3827 (  8.8 %)   0.2497 ( 10.4 %)   0.6323 (  9.3 %)   0.6283 (  9.4 %)  InlinerPass
   0.2815 (  6.4 %)   0.1792 (  7.5 %)   0.4608 (  6.8 %)   0.4555 (  6.8 %)  SimplifyCFGPass
...
   0.6444 (100.0 %)   0.5474 (100.0 %)   1.1917 (100.0 %)   1.1870 (100.0 %)  Total

ModuleBitcodeOptimization: 8118 msec
...
LTOBitcodeOptimization: 1399 msec
...
```

Kotlin/Native 編譯器執行兩個獨立的 LLVM 最佳化序列：模組階段（module passes）與連結時階段（link-time passes）。對於典型的編譯，這兩個管線會連續執行，唯一的實質區別在於它們執行的 LLVM 最佳化階段不同。

在上述記錄中，這兩個 LLVM 最佳化分別是 `ModuleBitcodeOptimization` 和 `LTOBitcodeOptimization`。格式化的表格是最佳化的輸出，包含每個階段的耗時。

## 自訂 LLVM 最佳化階段

如果上述其中一個階段看起來耗時長得不合理，您可以跳過它。但是，這可能會損害執行期效能，因此事後您應該檢查效能基準測試的效能變化。

目前沒有直接的方法可以[停用特定的階段](https://youtrack.jetbrains.com/issue/KT-69212)。然而，您可以透過使用以下編譯器選項來提供新的階段執行清單：

| **選項** | **Release 二進制檔的預設值** |
|------------------------|--------------------------------------|
| `-Xllvm-module-passes` | `"default<O3>"`                      |
| `-Xllvm-lto-passes`    | `"internalize,globaldce,lto<O3>"`    |

預設值會展開為一系列實際階段的長清單，您需要從中排除不想要的階段。

要取得實際階段的清單，請執行 [`opt`](https://llvm.org/docs/CommandGuide/opt.html) 工具，該工具會隨 LLVM 發行版自動下載到 `~/.konan/dependencies/llvm-{VERSION}-{ARCH}-{OS}-dev-{BUILD}/bin` 目錄中。

例如，要取得連結時階段的清單，請執行：

```bash
opt -print-pipeline-passes -passes="internalize,globaldce,lto<O3>" < /dev/null
```

這會輸出一個警告和一個長長的階段清單，具體取決於 LLVM 版本。

`opt` 工具提供的階段清單與 Kotlin/Native 編譯器實際執行的階段清單有兩點不同：

* 由於 `opt` 是一個偵錯工具，它包含一個或多個通常不會執行的 `verify` 階段。
* Kotlin/Native 停用了 `devirt` 階段，因為 Kotlin 編譯器本身已經完成了這些操作。

在停用任何階段後，請務必重新執行效能測試，以檢查執行期效能的退化是否在可接受範圍內。