[//]: # (title: Kotlin/Native 記憶體管理)

Kotlin/Native 使用現代記憶體管理器，其類似於 JVM、Go 和其他主流技術，包含以下功能：

*   物件儲存在共享堆中，可從任何執行緒存取。
*   追蹤式垃圾收集會定期執行，以收集無法從「根」(roots) 觸及的物件，例如區域變數和全域變數。

## 垃圾收集器

Kotlin/Native 的垃圾收集器 (GC) 演算法持續演進。目前，其運作方式為「全域暫停標記並行清除」(stop-the-world mark and concurrent sweep) 收集器，不將堆區分為多個世代。

GC 在單獨的執行緒上執行，並根據記憶體壓力啟發法或計時器啟動。或者，也可以[手動呼叫](#enable-garbage-collection-manually)。

GC 在多個執行緒中並行處理標記佇列，包括應用程式執行緒、GC 執行緒和選用的標記執行緒。應用程式執行緒和至少一個 GC 執行緒參與標記過程。預設情況下，當 GC 在堆中標記物件時，應用程式執行緒必須暫停。

> 您可以使用 `kotlin.native.binary.gcMarkSingleThreaded=true` 編譯器選項來停用標記階段的並行處理。然而，這可能會增加垃圾收集器在大堆上的暫停時間。
>
{style="tip"}

當標記階段完成後，GC 處理弱引用，並將指向未標記物件的參考點設為 null。預設情況下，弱引用會並行處理，以減少 GC 暫停時間。

請參閱如何[監控](#monitor-gc-performance)和[最佳化](#optimize-gc-performance)垃圾收集。

### 手動啟用垃圾收集

若要強制啟動垃圾收集器，請呼叫 `kotlin.native.internal.GC.collect()`。此方法會觸發新的收集並等待其完成。

### 監控 GC 效能

若要監控 GC 效能，您可以查閱其日誌並診斷問題。若要啟用日誌記錄，請在您的 Gradle 建置腳本中設定以下編譯器選項：

```none
-Xruntime-logs=gc=info
```

目前，日誌僅列印到 `stderr`。

在 Apple 平台上，您可以利用 Xcode Instruments 工具套件來偵錯 iOS 應用程式效能。垃圾收集器會透過 Instruments 中可用的標示 (signposts) 報告暫停。標示可在您的應用程式中啟用自訂日誌記錄，讓您檢查 GC 暫停是否對應於應用程式凍結。

若要追蹤應用程式中與 GC 相關的暫停：

1.  若要啟用此功能，請在您的 `gradle.properties` 檔案中設定以下編譯器選項：
  
   ```none
   kotlin.native.binary.enableSafepointSignposts=true
   ```

2.  開啟 Xcode，前往 **Product** | **Profile** 或按下 <shortcut>Cmd + I</shortcut>。此動作會編譯您的應用程式並啟動 Instruments。
3.  在範本選取中，選取 **os_signpost**。
4.  透過指定 `org.kotlinlang.native.runtime` 為 **subsystem** 並 `safepoint` 為 **category** 來進行配置。
5.  按一下紅色錄製按鈕以執行您的應用程式並開始錄製標示事件：

   ![追蹤 GC 暫停作為標示](native-gc-signposts.png){width=700}

   在此，最下方圖表上的每個藍色點代表一個單獨的標示事件，即一個 GC 暫停。

### 最佳化 GC 效能

若要提升 GC 效能，您可以啟用並行標記以減少 GC 暫停時間。這允許垃圾收集的標記階段與應用程式執行緒同時運行。

此功能目前為[實驗性](components-stability.md#stability-levels-explained)。若要啟用它，請在您的 `gradle.properties` 檔案中設定以下編譯器選項：
  
```none
kotlin.native.binary.gc=cms
```

### 停用垃圾收集

建議保持 GC 啟用。然而，在某些情況下您可以停用它，例如用於測試目的，或者如果您遇到問題且程式執行時間很短。為此，請在您的 `gradle.properties` 檔案中設定以下二進位選項：

```none
kotlin.native.binary.gc=noop
```

> 啟用此選項後，GC 不會收集 Kotlin 物件，因此只要程式運行，記憶體消耗就會持續增加。請注意不要耗盡系統記憶體。
>
{style="warning"}

## 記憶體消耗

Kotlin/Native 使用其自己的[記憶體分配器](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。它將系統記憶體劃分為頁 (pages)，允許以連續順序獨立清除。每個分配都成為頁內的一個記憶體區塊，且該頁會追蹤區塊大小。不同頁類型針對各種分配大小進行了最佳化。記憶體區塊的連續排列確保了對所有已分配區塊的高效迭代。

當執行緒分配記憶體時，它會根據分配大小尋找合適的頁。執行緒會維護一組用於不同大小類別的頁。通常，給定大小的當前頁可以容納該分配。如果不行，執行緒會從共享分配空間請求不同的頁。此頁可能已經可用、需要清除或必須先建立。

Kotlin/Native 記憶體分配器帶有防止記憶體分配突然飆升的保護機制。它防止了突變器 (mutator) 開始快速分配大量垃圾而 GC 執行緒無法跟上的情況，導致記憶體使用量無限增長。在這種情況下，GC 會強制進入「全域暫停」(stop-the-world) 階段，直到迭代完成。

您可以自行監控記憶體消耗、檢查記憶體洩漏並調整記憶體消耗。

### 監控記憶體消耗

若要偵錯記憶體問題，您可以檢查記憶體管理器指標。此外，也可以在 Apple 平台上追蹤 Kotlin 的記憶體消耗。

#### 檢查記憶體洩漏

若要存取記憶體管理器指標，請呼叫 `kotlin.native.internal.GC.lastGCInfo()`。此方法會回傳上次垃圾收集器運行的統計資訊。這些統計資訊可用於：

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

#### 在 Apple 平台上追蹤記憶體消耗

在 Apple 平台上偵錯記憶體問題時，您可以看到 Kotlin 程式碼保留了多少記憶體。Kotlin 的份額會被標記一個識別碼，並可透過 Xcode Instruments 中的 VM Tracker 等工具追蹤。

此功能僅適用於預設的 Kotlin/Native 記憶體分配器，當**所有**以下條件都滿足時：

*   **標記已啟用**。記憶體應使用有效的識別碼進行標記。Apple 建議使用 240 到 255 之間的數字；預設值為 246。

    如果您設定 `kotlin.native.binary.mmapTag=0` Gradle 屬性，標記將停用。

*   **使用 mmap 分配**。分配器應使用 `mmap` 系統呼叫將檔案映射到記憶體中。

    如果您設定 `kotlin.native.binary.disableMmap=true` Gradle 屬性，預設分配器會使用 `malloc` 而非 `mmap`。

*   **分頁已啟用**。應啟用分配的分頁（緩衝）。

    如果您設定 [`kotlin.native.binary.pagedAllocator=false`](#disable-allocator-paging) Gradle 屬性，記憶體將改為按物件基礎保留。

### 調整記憶體消耗

如果您遇到意料之外的高記憶體消耗，嘗試以下解決方案：

#### 更新 Kotlin

將 Kotlin 更新到最新版本。我們正在持續改進記憶體管理器，因此即使是簡單的編譯器更新也可能改善記憶體消耗。

#### 停用分配器分頁 
<primary-label ref="experimental-opt-in"/>

您可以停用分配的分頁（緩衝），以便記憶體分配器按物件基礎保留記憶體。在某些情況下，這可能幫助您滿足嚴格的記憶體限制或減少應用程式啟動時的記憶體消耗。

為此，請在您的 `gradle.properties` 檔案中設定以下選項：

```none
kotlin.native.binary.pagedAllocator=false
```

> 停用分配器分頁後，[在 Apple 平台上追蹤記憶體消耗](#track-memory-consumption-on-apple-platforms)將不可能。
> 
{style="note"}

#### 啟用 Latin-1 字串支援 
<primary-label ref="experimental-opt-in"/>

預設情況下，Kotlin 中的字串使用 UTF-16 編碼儲存，其中每個字元由兩個位元組表示。在某些情況下，這會導致字串在二進位檔案中佔用比原始碼多兩倍的空間，並且讀取資料會佔用兩倍的記憶體。

為了減少應用程式的二進位檔案大小並調整記憶體消耗，您可以啟用對 Latin-1 編碼字串的支援。[Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) 編碼僅用一個位元組表示前 256 個 Unicode 字元。

若要啟用它，請在您的 `gradle.properties` 檔案中設定以下選項：

```none
kotlin.native.binary.latin1Strings=true
```

啟用 Latin-1 支援後，只要所有字元都在其範圍內，字串就會以 Latin-1 編碼儲存。否則，將使用預設的 UTF-16 編碼。

> 儘管此功能仍處於實驗階段，但 `cinterop` 擴充函數 [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html)、[`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 和 [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 的效率會降低。每次呼叫它們都可能觸發自動將字串轉換為 UTF-16。
> 
{style="note"}

如果這些選項都沒有幫助，請在 [YouTrack](https://kotl.in/issue) 中建立一個問題。

## 背景中的單元測試

在單元測試中，沒有任何東西處理主執行緒佇列，因此除非已模擬 `Dispatchers.Main`，否則不要使用它。可以透過呼叫 `kotlinx-coroutines-test` 中的 `Dispatchers.setMain` 來模擬它。

如果您不依賴 `kotlinx.coroutines` 或者如果 `Dispatchers.setMain` 因某些原因無法正常運作，嘗試以下解決方案來實作測試啟動器：

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

然後，使用 `-e testlauncher.mainBackground` 編譯器選項編譯測試二進位檔案。

## 接下來

*   [從舊版記憶體管理器遷移](native-migration-guide.md)
*   [檢查與 Swift/Objective-C ARC 整合的細節](native-arc-integration.md)