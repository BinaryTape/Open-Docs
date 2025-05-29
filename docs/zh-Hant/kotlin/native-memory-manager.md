[//]: # (title: Kotlin/Native 記憶體管理)

Kotlin/Native 使用現代記憶體管理器，它類似於 JVM、Go 和其他主流技術，具有以下特性：

*   物件儲存在共享堆中，可從任何執行緒存取。
*   定期執行追蹤式垃圾回收 (tracing garbage collection)，以回收無法從「根 (roots)」（例如區域變數和全域變數）觸及的物件。

## 垃圾回收器

Kotlin/Native 的垃圾回收器 (GC) 演算法持續演進。目前，它作為停頓世界標記並行清除收集器 (stop-the-world mark and concurrent sweep collector) 運作，不將堆區分為世代 (generations)。

GC 在單獨的執行緒上執行，並根據記憶體壓力啟發式演算法或計時器啟動。此外，它也可以[手動呼叫](#enable-garbage-collection-manually)。

GC 在多個執行緒中並行處理標記佇列，包括應用程式執行緒、GC 執行緒和可選的標記執行緒。應用程式執行緒和至少一個 GC 執行緒會參與標記過程。預設情況下，當 GC 標記堆中的物件時，應用程式執行緒必須暫停。

> 您可以使用 `kotlin.native.binary.gcMarkSingleThreaded=true` 編譯器選項停用標記階段的並行化。然而，這可能會增加垃圾回收器在大型堆中的暫停時間。
>
{style="tip"}

標記階段完成後，GC 會處理弱引用並將指向未標記物件的參照點設為空 (nullify)。預設情況下，弱引用會並行處理以減少 GC 暫停時間。

請參閱如何[監控](#monitor-gc-performance)和[優化](#optimize-gc-performance)垃圾回收。

### 手動啟用垃圾回收

若要強制啟動垃圾回收器，請呼叫 `kotlin.native.internal.GC.collect()`。此方法會觸發一次新的回收並等待其完成。

### 監控 GC 效能

若要監控 GC 效能，您可以檢視其日誌並診斷問題。若要啟用日誌記錄，請在您的 Gradle 建置腳本中設定以下編譯器選項：

```none
-Xruntime-logs=gc=info
```

目前，日誌僅輸出到 `stderr`。

在 Apple 平台上，您可以利用 Xcode Instruments 工具組來偵錯 iOS 應用程式效能。垃圾回收器會使用 Instruments 中可用的標記 (signposts) 報告暫停。標記 (Signposts) 可讓您在應用程式中進行自訂日誌記錄，讓您可以檢查 GC 暫停是否與應用程式凍結相對應。

若要追蹤應用程式中與 GC 相關的暫停：

1.  若要啟用此功能，請在您的 `gradle.properties` 檔案中設定以下編譯器選項：
    
    ```none
    kotlin.native.binary.enableSafepointSignposts=true
    ```

2.  開啟 Xcode，移至 **Product** | **Profile** 或按下 <shortcut>Cmd + I</shortcut>。此操作會編譯您的應用程式並啟動 Instruments。
3.  在範本選擇中，選擇 **os_signpost**。
4.  透過指定 `org.kotlinlang.native.runtime` 作為**子系統 (subsystem)** 和 `safepoint` 作為**類別 (category)** 來設定它。
5.  點擊紅色錄製按鈕以執行您的應用程式並開始錄製標記 (signpost) 事件：

    ![將 GC 暫停追蹤為標記 (signposts)](native-gc-signposts.png){width=700}

    最下方圖表中的每個藍色圓點代表一個獨立的標記 (signpost) 事件，即一次 GC 暫停。

### 優化 GC 效能

若要提升 GC 效能，您可以啟用並行標記 (concurrent marking) 以減少 GC 暫停時間。這允許垃圾回收的標記階段與應用程式執行緒同時執行。

此功能目前為 [實驗性 (Experimental)](components-stability.md#stability-levels-explained)。若要啟用它，請在您的 `gradle.properties` 檔案中設定以下編譯器選項：
  
```none
kotlin.native.binary.gc=cms
```

### 停用垃圾回收

建議保持 GC 啟用。然而，在某些情況下您可以停用它，例如用於測試目的，或者如果您遇到問題且程式生命週期較短。為此，請在您的 `gradle.properties` 檔案中設定以下二進位選項：

```none
kotlin.native.binary.gc=noop
```

> 啟用此選項後，GC 不會回收 Kotlin 物件，因此只要程式執行，記憶體消耗將持續增加。請注意不要耗盡系統記憶體。
>
{style="warning"}

## 記憶體消耗

Kotlin/Native 使用其自己的[記憶體分配器 (memory allocator)](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。它將系統記憶體劃分為頁面 (pages)，允許以連續順序獨立清除。每個分配都成為頁面內的一個記憶體區塊，頁面會追蹤區塊大小。不同類型的頁面會針對各種分配大小進行優化。記憶體區塊的連續排列確保了對所有已分配區塊的高效率迭代。

當執行緒分配記憶體時，它會根據分配大小尋找合適的頁面。執行緒會維護一組用於不同大小類別的頁面。通常，給定大小的目前頁面可以容納該分配。如果不能，執行緒會從共享分配空間請求不同的頁面。此頁面可能已經可用、需要清除，或者必須先建立。

Kotlin/Native 記憶體分配器提供了防止記憶體分配突然飆升的保護。它防止了變異器 (mutator) 開始快速分配大量垃圾而 GC 執行緒無法跟上的情況，導致記憶體使用量無限增長。在這種情況下，GC 會強制進入停頓世界 (stop-the-world) 階段，直到迭代完成。

您可以自行監控記憶體消耗、檢查記憶體洩漏 (memory leaks)，並調整記憶體消耗。

### 檢查記憶體洩漏

若要存取記憶體管理器指標 (metrics)，請呼叫 `kotlin.native.internal.GC.lastGCInfo()`。此方法會回傳垃圾回收器上次執行的統計資料。這些統計資料可用於：

*   偵錯使用全域變數時的記憶體洩漏
*   執行測試時檢查洩漏

```kotlin
import kotlin.native.internal.*
import kotlin.test.*

class Resource

val global = mutableListOf<Resource>()

@OptIn(ExperimentalStdlibApi::class)
fun getUsage(): Long {
    GC.collect()
    return GC.lastGCInfo!!.memoryUsageAfter["heap"]!!.totalObjectsSizeBytes
}

fun run() {
    global.add(Resource())
    // The test will fail if you remove the next line
    global.clear()
}

@Test
fun test() {
    val before = getUsage()
    // A separate function is used to ensure that all temporary objects are cleared
    run()
    val after = getUsage()
    assertEquals(before, after)
}
```

### 調整記憶體消耗

如果程式中沒有記憶體洩漏，但您仍然看到異常高的記憶體消耗，嘗試將 Kotlin 更新到最新版本。我們正在持續改進記憶體管理器，因此即使是簡單的編譯器更新也可能改善記憶體消耗。

如果您在更新後仍然遇到高記憶體消耗，請透過在您的 Gradle 建置腳本中使用以下編譯器選項，切換到系統記憶體分配器：

```none
-Xallocator=std
```

如果這沒有改善您的記憶體消耗，請在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中報告問題。

## 背景中的單元測試

在單元測試中，沒有任何東西處理主執行緒佇列，因此不要使用 `Dispatchers.Main`，除非它已被模擬 (mocked)。可以透過從 `kotlinx-coroutines-test` 呼叫 `Dispatchers.setMain` 來模擬它。

如果您不依賴 `kotlinx.coroutines` 或者如果 `Dispatchers.setMain` 因某些原因對您不起作用，嘗試以下解決方法來實作測試啟動器：

```kotlin
package testlauncher

import platform.CoreFoundation.*
import kotlin.native.concurrent.*
import kotlin.native.internal.test.*
import kotlin.system.*

fun mainBackground(args: Array<String>) {
    val worker = Worker.start(name = "main-background")
    worker.execute(TransferMode.SAFE, { args.freeze() }) {
        val result = testLauncherEntryPoint(it)
        exitProcess(result)
    }
    CFRunLoopRun()
    error("CFRunLoopRun should never return")
}
```
{initial-collapse-state="collapsed" collapsible="true"}

然後，使用 `-e testlauncher.mainBackground` 編譯器選項編譯測試二進位檔。

## 接下來

*   [從舊版記憶體管理器遷移](native-migration-guide.md)
*   [檢查與 Swift/Objective-C ARC 整合的細節](native-arc-integration.md)