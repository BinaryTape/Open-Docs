[//]: # (title: Kotlin/Native 記憶體管理)

Kotlin/Native 使用與 JVM、Go 等主流技術類似的現代記憶體管理器，包含以下特性：

* 物件儲存於共享堆積中，並可從任何執行緒存取。
* 定期執行追蹤式垃圾回收（Tracing garbage collection），以回收無法從「根」（如區域變數與全域變數）到達的物件。

## 垃圾回收器

Kotlin/Native 的垃圾回收（GC）演算法正持續演進。目前，它的運作方式是 stop-the-world 標記與並行清除回收器，且不將堆積分為世代（generations）。

GC 在獨立的執行緒上執行，並根據記憶體壓力啟發式演算法或計時器啟動。此外，也可以[手動呼叫](#enable-garbage-collection-manually)。

GC 會在多個執行緒（包括應用程式執行緒、GC 執行緒以及選用的標記執行緒）上並行處理標記佇列。應用程式執行緒和至少一個 GC 執行緒會參與標記過程。預設情況下，當 GC 正在標記堆積中的物件時，應用程式執行緒必須暫停。

> 您可以使用 `kotlin.native.binary.gcMarkSingleThreaded=true` 編譯器選項停用標記階段的並行化。然而，這可能會增加大型堆積上的垃圾回收器暫停時間。
>
{style="tip"}

當標記階段完成後，GC 會處理弱參考（weak references），並將指向未標記物件的參考點設為 null。預設情況下，弱參考會並行處理，以減少 GC 暫停時間。

請參閱如何[監控](#monitor-gc-performance)與[優化](#optimize-gc-performance)垃圾回收。

### 手動啟用垃圾回收

若要強制啟動垃圾回收器，請呼叫 `kotlin.native.internal.GC.collect()`。此方法會觸發新的回收並等待其完成。

### 監控 GC 效能

要監控 GC 效能，您可以查看其記錄並診斷問題。若要啟用記錄，請在您的 Gradle 建置指令碼中設定以下編譯器選項：

```none
-Xruntime-logs=gc=info
```

目前，記錄僅列印到 `stderr`。

在 Apple 平台上，您可以利用 Xcode Instruments 工具組來偵錯 iOS 應用程式效能。垃圾回收器會透過 Instruments 中可用的 signpost 回報暫停。Signpost 可以在您的應用程式內進行自訂記錄，讓您檢查 GC 暫停是否與應用程式凍結相對應。

要在您的應用程式中追蹤 GC 相關的暫停：

1. 若要啟用此功能，請在 `gradle.properties` 檔案中設定以下編譯器選項：
  
   ```none
   kotlin.native.binary.enableSafepointSignposts=true
   ```

2. 開啟 Xcode，前往 **Product** | **Profile** 或按 <shortcut>Cmd + I</shortcut>。此操作會編譯您的應用程式並啟動 Instruments。
3. 在樣板選擇中，選擇 **os_signpost**。
4. 將 `org.kotlinlang.native.runtime` 指定為 **subsystem**，並將 `safepoint` 指定為 **category** 來進行配置。
5. 點擊紅色的錄製按鈕以執行您的應用程式並開始錄製 signpost 事件：

   ![將 GC 暫停追蹤為 signpost](native-gc-signposts.png){width=700}

   在此，最下方圖表上的每個藍色區塊代表一個獨立的 signpost 事件，即一次 GC 暫停。

### 優化 GC 效能

要提高 GC 效能，您可以啟用並行標記以減少 GC 暫停時間。這允許垃圾回收的標記階段與應用程式執行緒同時執行。

此功能目前處於[實驗性](components-stability.md#stability-levels-explained)階段。若要啟用，請在您的 `gradle.properties` 檔案中設定以下編譯器選項：
  
```none
kotlin.native.binary.gc=cms
```

### 停用垃圾回收

建議保持 GC 啟用。然而，在某些情況下您可以將其停用，例如為了測試目的，或者如果您遇到問題且程式是短時間執行的。若要停用，請在您的 `gradle.properties` 檔案中設定以下二進位選項：

```none
kotlin.native.binary.gc=noop
```

> 啟用此選項後，GC 不會回收 Kotlin 物件，因此只要程式持續執行，記憶體消耗就會不斷增加。請務必小心不要耗盡系統記憶體。
>
{style="warning"}

## 記憶體消耗

Kotlin/Native 使用自己的[記憶體分配器](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。它將系統記憶體劃分為頁（pages），允許按連續順序進行獨立清除。每次分配都會成為頁面內的一個記憶體區塊，頁面會追蹤區塊大小。不同類型的頁面針對各種分配大小進行了優化。記憶體區塊的連續排列確保了對所有已分配區塊的高效反覆運算。

當執行緒分配記憶體時，它會根據分配大小搜尋合適的頁面。執行緒會為不同的尺寸類別維護一組頁面。通常，給定尺寸的當前頁面可以容納該分配。如果不行，執行緒會從共享分配空間請求另一個頁面。該頁面可能已經可用、需要清除，或者必須先建立。

Kotlin/Native 記憶體分配器內建了防止記憶體分配突發尖峰的保護機制。它能防止 mutator 開始快速分配大量垃圾而 GC 執行緒無法跟上的情況，避免記憶體使用量無止境增長。在這種情況下，GC 會強制進入 stop-the-world 階段，直到反覆運算完成。

您可以自行監控記憶體消耗、檢查記憶體洩漏並調整記憶體消耗。

### 監控記憶體消耗

要偵錯記憶體問題，您可以檢查記憶體管理器指標。此外，也可以在 Apple 平台上追蹤 Kotlin 的記憶體消耗。

#### 檢查記憶體洩漏

若要存取記憶體管理器指標，請呼叫 `kotlin.native.internal.GC.lastGCInfo()`。此方法會傳回垃圾回收器最後一次執行的統計數據。這些統計數據可用於：

* 偵錯使用全域變數時的記憶體洩漏
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
    // 如果移除下一行，測試將會失敗
    global.clear()
}

@Test
fun test() {
    val before = getUsage()
    // 使用獨立的函式以確保所有暫時性物件都已清除
    run()
    val after = getUsage()
    assertEquals(before, after)
}
```

#### 在 Apple 平台上追蹤記憶體消耗

在 Apple 平台上偵錯記憶體問題時，您可以查看 Kotlin 程式碼保留了多少記憶體。Kotlin 的部分會標記一個識別符，並可以透過 Xcode Instruments 中的 VM Tracker 等工具進行追蹤。

此功能僅適用於預設的 Kotlin/Native 記憶體分配器，且必須滿足以下「所有」條件：

* **已啟用標記（Tagging enabled）**。記憶體應標記有效的識別符。Apple 建議使用 240 到 255 之間的數字；預設值為 246。

  如果您設定 `kotlin.native.binary.mmapTag=0` Gradle 屬性，則會停用標記。

* **使用 mmap 分配**。分配器應使用 `mmap` 系統呼叫將檔案映射到記憶體中。

  如果您設定 `kotlin.native.binary.disableMmap=true` Gradle 屬性，預設分配器會使用 `malloc` 而非 `mmap`。

* **已啟用分頁（Paging enabled）**。應啟用分配的分頁（緩衝）。

  如果您設定 [`kotlin.native.binary.pagedAllocator=false`](#disable-allocator-paging) Gradle 屬性，則記憶體會改為按物件進行保留。

### 調整記憶體消耗

如果您遇到異常高的記憶體消耗，請嘗試以下解決方案：

#### 更新 Kotlin

將 Kotlin 更新到最新版本。我們不斷在改進記憶體管理器，因此即使只是簡單的編譯器更新也可能改善記憶體消耗。

#### 停用分配器分頁
<primary-label ref="experimental-opt-in"/>

您可以停用分配的分頁（緩衝），讓記憶體分配器按物件保留記憶體。在某些情況下，這可能有助於滿足嚴格的記憶體限制，或減少應用程式啟動時的記憶體消耗。

若要執行此操作，請在您的 `gradle.properties` 檔案中設定以下選項：

```none
kotlin.native.binary.pagedAllocator=false
```

> 停用分配器分頁後，將無法[在 Apple 平台上追蹤記憶體消耗](#track-memory-consumption-on-apple-platforms)。
> 
{style="note"}

#### 啟用 Latin-1 字串支援
<primary-label ref="experimental-opt-in"/>

預設情況下，Kotlin 中的字串使用 UTF-16 編碼儲存，每個字元由兩個位元組表示。在某些情況下，這會導致字串在二進位檔中佔用的空間是原始碼的兩倍，讀取資料時佔用的記憶體也是兩倍。

為了減少應用程式的二進位檔案大小並調整記憶體消耗，您可以啟用 Latin-1 編碼字串的支援。[Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) 編碼僅用一個位元組表示前 256 個 Unicode 字元。

若要啟用，請在您的 `gradle.properties` 檔案中設定以下選項：

```none
kotlin.native.binary.latin1Strings=true
```

有了 Latin-1 支援，只要字串的所有字元都在其範圍內，就會以 Latin-1 編碼儲存。否則，將使用預設的 UTF-16 編碼。

> 雖然此功能目前為實驗性，但 cinterop 擴充功能 [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html)、[`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 以及 [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 的效率會降低。每次呼叫它們都可能觸發自動字串轉換為 UTF-16。
> 
{style="note"}

如果以上選項都沒有幫助，請在 [YouTrack](https://kotl.in/issue) 中建立問題。

## 背景執行單元測試

在單元測試中，沒有任何機制會處理主執行緒佇列，因此除非已進行 mock，否則請勿使用 `Dispatchers.Main`。可以使用 `kotlinx-coroutines-test` 中的 `Dispatchers.setMain` 來進行 mock。

如果您不依賴 `kotlinx.coroutines`，或者 `Dispatchers.setMain` 出於某種原因無法在您的環境中運作，請嘗試以下實作測試啟動器的因應措施：

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
    error("CFRunLoopRun 永遠不應回傳")
}
```
{initial-collapse-state="collapsed" collapsible="true"}

然後，使用 `-e testlauncher.mainBackground` 編譯器選項來編譯測試二進位檔。

## 後續步驟

* [從舊版記憶體管理器遷移](native-migration-guide.md)
* [查看與 Swift/Objective-C ARC 整合的細節](native-arc-integration.md)