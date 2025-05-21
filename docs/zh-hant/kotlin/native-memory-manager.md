---
title: "Kotlin/Native 記憶體管理"
---
Kotlin/Native 使用一種現代化的記憶體管理器，其與 JVM、Go 和其他主流技術相似，包含以下特性：

* 物件儲存在一個共享堆積（shared heap）中，並且可以從任何執行緒訪問。
* 定期執行追蹤式垃圾回收（Tracing garbage collection），以回收從「根」（roots，例如本地和全域變數）無法訪問的物件。

## 垃圾回收器（Garbage collector）

Kotlin/Native 的垃圾回收器（GC）演算法不斷演進。目前，它的功能是一個停止世界（stop-the-world）標記和並發清除回收器，它不會將堆積分割成多個世代。

GC 在一個單獨的執行緒上執行，並基於記憶體壓力啟發法或計時器啟動。或者，可以[手動調用](#enable-garbage-collection-manually)。

GC 在多個執行緒上並行處理標記佇列，包括應用程式執行緒、GC 執行緒和可選的標記執行緒。應用程式執行緒和至少一個 GC 執行緒參與標記過程。預設情況下，當 GC 在堆積中標記物件時，必須暫停應用程式執行緒。

:::tip
您可以使用 `kotlin.native.binary.gcMarkSingleThreaded=true` 編譯器選項禁用標記階段的平行化。但是，這可能會增加大型堆積上垃圾回收器的暫停時間。

:::

當標記階段完成後，GC 會處理弱引用（weak references）並將對未標記物件的參考點設定為 null。預設情況下，弱引用會並發處理，以減少 GC 暫停時間。

請參閱如何[監控](#monitor-gc-performance)和[最佳化](#optimize-gc-performance)垃圾回收。

### 手動啟用垃圾回收（Enable garbage collection manually）

要強制啟動垃圾回收器，請呼叫 `kotlin.native.internal.GC.collect()`。此方法觸發一個新的回收並等待其完成。

### 監控 GC 效能（Monitor GC performance）

要監控 GC 效能，您可以查看其日誌並診斷問題。要啟用日誌記錄，請在您的 Gradle 建置腳本中設定以下編譯器選項：

```none
-Xruntime-logs=gc=info
```

目前，日誌僅列印到 `stderr`。

在 Apple 平台上，您可以利用 Xcode Instruments 工具組來偵錯 iOS 應用程式效能。垃圾回收器使用 Instruments 中提供的標誌柱（signposts）報告暫停。標誌柱支援在您的應用程式中進行自訂日誌記錄，讓您可以檢查 GC 暫停是否對應於應用程式凍結。

要追蹤應用程式中與 GC 相關的暫停：

1. 要啟用該功能，請在您的 `gradle.properties` 檔案中設定以下編譯器選項：
  
   ```none
   kotlin.native.binary.enableSafepointSignposts=true
   ```

2. 開啟 Xcode，前往 **Product** | **Profile** 或按下 <shortcut>Cmd + I</shortcut>。此操作會編譯您的應用程式並啟動 Instruments。
3. 在範本選擇中，選擇 **os_signpost**。
4. 通過指定 `org.kotlinlang.native.runtime` 作為 **subsystem** 和 `safepoint` 作為 **category** 來配置它。
5. 點擊紅色的錄製按鈕來執行您的應用程式並開始錄製標誌柱事件：

   <img src="/img/native-gc-signposts.png" alt="Tracking GC pauses as signposts" width="700" style={{verticalAlign: 'middle'}}/>

   在這裡，最下面的圖表上的每個藍色斑點代表一個單獨的標誌柱事件，這是一個 GC 暫停。

### 最佳化 GC 效能（Optimize GC performance）

要提高 GC 效能，您可以啟用並發標記（concurrent marking）以減少 GC 暫停時間。這允許垃圾回收的標記階段與應用程式執行緒同時執行。

該功能目前處於 [實驗性階段](components-stability#stability-levels-explained)。要啟用它，請在您的 `gradle.properties` 檔案中設定以下編譯器選項：
  
```none
kotlin.native.binary.gc=cms
```

### 禁用垃圾回收（Disable garbage collection）

建議保持啟用 GC。但是，您可以在某些情況下禁用它，例如用於測試目的，或者如果您遇到問題並擁有一個短暫的程式。要這樣做，請在您的 `gradle.properties` 檔案中設定以下二進制選項：

```none
kotlin.native.binary.gc=noop
```

:::caution
啟用此選項後，GC 不會收集 Kotlin 物件，因此只要程式執行，記憶體消耗就會不斷增加。小心不要耗盡系統記憶體。

:::

## 記憶體消耗（Memory consumption）

Kotlin/Native 使用自己的[記憶體分配器](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README)。它將系統記憶體劃分為頁面（pages），允許以連續的順序進行獨立的清除（sweeping）。每個分配都成為頁面中的一個記憶體塊（memory block），並且頁面會追蹤塊大小。不同的頁面類型針對各種分配大小進行了優化。記憶體塊的連續排列確保了有效率地迭代所有已分配的塊。

當一個執行緒分配記憶體時，它會根據分配大小搜尋合適的頁面。執行緒維護一組用於不同大小類別的頁面。通常，給定大小的目前頁面可以容納分配。如果沒有，則執行緒從共享分配空間請求一個不同的頁面。此頁面可能已可用、需要清除，或者必須首先建立。

Kotlin/Native 記憶體分配器具有針對記憶體分配突然激增的保護。它可以防止變異器（mutator）開始快速分配大量垃圾，而 GC 執行緒無法跟上它的情況，從而使記憶體使用量無限增長。在這種情況下，GC 會強制執行停止世界階段，直到迭代完成。

您可以自己監控記憶體消耗、檢查記憶體洩漏以及調整記憶體消耗。

### 檢查記憶體洩漏（Check for memory leaks）

要存取記憶體管理器度量，請呼叫 `kotlin.native.internal.GC.lastGCInfo()`。此方法會傳回上次執行垃圾回收器的統計資訊。這些統計資訊對於以下情況很有用：

* 在使用全域變數時偵錯記憶體洩漏
* 在執行測試時檢查洩漏

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

### 調整記憶體消耗（Adjust memory consumption）

如果程式中沒有記憶體洩漏，但您仍然看到意外的高記憶體消耗，請嘗試將 Kotlin 更新到最新版本。我們不斷改進記憶體管理器，因此即使是簡單的編譯器更新也可能會改善記憶體消耗。

如果您在更新後仍然遇到高記憶體消耗，請透過在您的 Gradle 建置腳本中使用以下編譯器選項來切換到系統記憶體分配器：

```none
-Xallocator=std
```

如果這不能改善您的記憶體消耗，請在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中報告一個問題。

## 背景中的單元測試（Unit tests in the background）

在單元測試中，沒有任何東西處理主執行緒佇列，因此不要使用 `Dispatchers.Main`，除非它被模擬（mocked）。模擬它可以透過從 `kotlinx-coroutines-test` 呼叫 `Dispatchers.setMain` 來完成。

如果您不依賴 `kotlinx.coroutines`，或者如果 `Dispatchers.setMain` 因為某些原因對您不起作用，請嘗試以下用於實作測試啟動器的解決方法：

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

然後，使用 `-e testlauncher.mainBackground` 編譯器選項編譯測試二進制檔案。

## 接下來的步驟（What's next）

* [從舊版記憶體管理器遷移](native-migration-guide)
* [檢查與 Swift/Objective-C ARC 整合的具體細節](native-arc-integration)

  ```