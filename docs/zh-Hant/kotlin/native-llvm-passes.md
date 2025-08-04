[//]: # (title: 最佳化 LLVM 後端的秘訣)
<primary-label ref="advanced"/>

Kotlin/Native 編譯器使用 [LLVM](https://llvm.org/) 來優化並為不同目標平台生成二進位執行檔。
編譯時間中有很大一部分也花費在 LLVM 上，對於大型應用程式而言，這可能導致
無法接受的長時間。

您可以自訂 Kotlin/Native 如何使用 LLVM，並調整優化遍歷 (optimization passes) 的清單。

## 檢查建置日誌

讓我們看看建置日誌，了解有多少編譯時間花費在 LLVM 優化遍歷上：

1.  執行 `linkRelease*` Gradle 任務，並帶上 `-Pkotlin.internal.compiler.arguments.log.level=warning` 選項，讓 Gradle
    輸出 LLVM 效能分析細節，例如：

    ```bash
    ./gradlew linkReleaseExecutableMacosArm64 -Pkotlin.internal.compiler.arguments.log.level=warning
    ```

    執行時，任務會印出必要的編譯器引數，例如：

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

2.  使用提供的引數以及 `-Xprofile-phases` 引數執行命令列編譯器，例如：

    ```bash
    /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/bin/kotlinc-native \
    -Xinclude=... \
    -library /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/klib/common/stdlib \
    ... \
    -Xprofile-phases
    ```

3.  檢查建置日誌中生成的輸出。日誌可能包含數萬行；LLVM
    效能分析的部分位於結尾。

以下是一個簡單 Kotlin/Native 程式執行時的摘錄：

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

Kotlin/Native 編譯器執行兩組獨立的 LLVM 優化序列：模組遍歷 (module passes) 和連結時遍歷 (link-time passes)。對於典型編譯，這兩個管線會接續執行，唯一的實際區別在於它們執行哪些 LLVM 優化遍歷。

在上面的日誌中，這兩個 LLVM 優化是 `ModuleBitcodeOptimization` 和 `LTOBitcodeOptimization`。
格式化的表格是優化的輸出，其中包含每個遍歷的時間。

## 自訂 LLVM 優化遍歷

如果上述某個遍歷似乎耗時過長，您可以跳過它。但是，這可能會損害執行時效能，
因此之後您應該檢查基準測試的效能變化。

目前，沒有直接的方法可以 [停用給定的遍歷](https://youtrack.jetbrains.com/issue/KT-69212)。
但是，您可以使用以下編譯器選項提供新的遍歷清單來執行：

| **選項**             | **發行二進位檔的預設值** |
|------------------------|--------------------------------------|
| `-Xllvm-module-passes` | `"default<O3>"`                      |
| `-Xllvm-lto-passes`    | `"internalize,globaldce,lto<O3>"`    |

預設值會展開為一長串實際遍歷，您需要從中排除不想要的遍歷。

要獲取實際遍歷清單，請執行 [`opt`](https://llvm.org/docs/CommandGuide/opt.html) 工具，該工具會
隨 LLVM 發行版自動下載到
`~/.konan/dependencies/llvm-{VERSION}-{ARCH}-{OS}-dev-{BUILD}/bin` 目錄。

例如，要獲取連結時遍歷的清單，請執行：

```bash
opt -print-pipeline-passes -passes="internalize,globaldce,lto<O3>" < /dev/null
```

這將輸出一個警告和一長串遍歷，這取決於 LLVM 版本。

`opt` 工具輸出的遍歷清單與 Kotlin/Native
編譯器實際執行的遍歷之間有兩個區別：

*   由於 `opt` 是一個除錯工具，它包含一個或多個 `verify` 遍歷，這些遍歷通常不會執行。
*   Kotlin/Native 停用了 `devirt` 遍歷，因為 Kotlin 編譯器本身已經執行這些操作。

停用任何遍歷後，請務必重新執行效能測試，以檢查執行時效能下降是否可接受。