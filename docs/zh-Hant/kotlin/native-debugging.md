[//]: # (title: 偵錯 Kotlin/Native)

Kotlin/Native 編譯器可以產生包含偵錯資訊的二進位檔，並為 [符號化當機報告](#debug-ios-applications) 建立偵錯符號檔。

偵錯資訊與 [DWARF 2](https://dwarfstd.org/download.html) 規範相容，因此 LLDB 和 GDB 等現代偵錯工具可以：

*   [設定中斷點](#set-breakpoints)
*   [使用單步執行](#use-stepping)
*   [檢查變數與型別資訊](#inspect-variables)

>支援 DWARF 2 規範表示偵錯工具會將 Kotlin 識別為 C89，因為在 DWARF 5 規範之前，規範中沒有 Kotlin 語言型別的識別碼。
>
{style="note"}

## 產生包含偵錯資訊的二進位檔

在 IntelliJ IDEA、Android Studio 或 Xcode 中偵錯時，會自動產生包含偵錯資訊的二進位檔（除非建構作業另行設定）。

您可以透過以下方式手動啟用偵錯，並產生包含偵錯資訊的二進位檔：

*   **使用 Gradle 任務**。若要取得偵錯二進位檔，請使用 `linkDebug*` Gradle 任務，例如：

    ```bash
    ./gradlew linkDebugFrameworkNative
    ```

    這些任務會因二進位檔型別（例如 `linkDebugSharedNative`）或目標（例如 `linkDebugExecutableMacosArm64`）而異。

*   **使用命令列編譯器**。在命令列中，使用 `-g` 選項編譯您的 Kotlin/Native 二進位檔：

    ```bash
    kotlinc-native hello.kt -g -o terminator
    ```

然後啟動您的偵錯工具。例如：

```bash
lldb terminator.kexe
```

偵錯工具輸出：

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

## 設定中斷點

現代偵錯器提供多種設定中斷點的方式。請參閱以下各工具的詳細說明：

### LLDB

*   按名稱：

    ```bash
    (lldb) b -n kfun:main(kotlin.Array<kotlin.String>)
    Breakpoint 4: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
    ```

    `-n` 是選用的，此旗標預設套用。

*   按位置（檔名、行號）：

    ```bash
    (lldb) b -f hello.kt -l 1
    Breakpoint 1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
    ```

*   按位址：

    ```bash
    (lldb) b -a 0x00000001000012e4
    Breakpoint 2: address = 0x00000001000012e4
    ```

*   按正規表達式。您可能會發現這對於偵錯產生的構件（例如匿名函式等）很有用（其中名稱使用了 `#` 符號）：

    ```bash
    (lldb) b -r main\(
    3: regex = 'main\(', locations = 1
      3.1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = terminator.kexe[0x00000001000012e4], unresolved, hit count = 0
    ```

### GDB

*   按正規表達式：

    ```bash
    (gdb) rbreak main(
    Breakpoint 1 at 0x1000109b4
    struct ktype:kotlin.Unit &kfun:main(kotlin.Array<kotlin.String>);
    ```

*   按名稱 **無法使用**，因為 `:` 是按位置設定中斷點的分隔符：

    ```bash
    (gdb) b kfun:main(kotlin.Array<kotlin.String>)
    No source file named kfun.
    Make breakpoint pending on future shared library load? (y or [n]) y
    Breakpoint 1 (kfun:main(kotlin.Array<kotlin.String>)) pending
    ```

*   按位置：

    ```bash
    (gdb) b hello.kt:1
    Breakpoint 2 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 1.
    ```

*   按位址：

    ```bash
    (gdb) b *0x100001704
    Note: breakpoint 2 also set at pc 0x100001704.
    Breakpoint 3 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 2.
    ```

## 使用單步執行

單步執行函式的功能與 C/C++ 程式大致相同。

## 檢查變數

對於 `var` 變數的變數檢查，基本型別和非基本型別都開箱即用：

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

## 偵錯 iOS 應用程式

偵錯 iOS 應用程式有時涉及詳細分析當機報告。當機報告通常需要符號化，這是一個將記憶體位址轉換為可讀原始碼位置的過程。

若要符號化 Kotlin 程式碼中的位址（例如，對應於 Kotlin 程式碼的堆疊追蹤元素），您需要一個特殊的偵錯符號檔 (`.dSYM`)。此檔案將當機報告中的記憶體位址映射到原始碼中的實際位置，例如函式或行號。

Kotlin/Native 編譯器依預設會為 Apple 平台上的發行版（最佳化）二進位檔產生 `.dSYM` 檔案。
在 Xcode 中建構時，IDE 會在標準位置尋找 `.dSYM` 檔案，並自動用於符號化。Xcode 會自動偵測從 IntelliJ IDEA 範本建立的專案中的 `.dSYM` 檔案。

在其他平台上，您可以使用 `-Xadd-light-debug` 編譯器選項，將偵錯資訊加入產生的二進位檔中（這會增加其大小）：

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

有關當機報告的更多資訊，請參閱 [Apple 文件](https://developer.apple.com/documentation/xcode/diagnosing-issues-using-crash-reports-and-device-logs)。

## 已知問題

*   Python 繫結的效能。
*   偵錯工具中的表達式求值不支援，目前也沒有實作計畫。