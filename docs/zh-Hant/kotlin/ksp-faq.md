[//]: # (title: KSP 常見問題)

### 為何選擇 KSP？

KSP 相較於 [kapt](kapt.md) 具有以下優勢：
*   速度更快。
*   對 Kotlin 使用者而言，其 API 更為流暢易用。
*   它支援對生成的 Kotlin 原始碼進行 [多輪處理](ksp-multi-round.md)。
*   設計時已考量到多平台 (multiplatform) 相容性。

### 為何 KSP 比 kapt 更快？

kapt 必須解析並解析所有型別引用 (type reference) 以生成 Java 存根 (stub)，而 KSP 則是依需求解析引用。將處理委託給 javac 也會耗費時間。

此外，KSP 的 [增量處理模型](ksp-incremental.md) 具有比單純隔離和聚合更精細的粒度 (granularity)。它能找到更多機會避免重新處理所有內容。而且，由於 KSP 會動態追蹤符號解析 (symbol resolution)，因此檔案中的變更較不容易影響其他檔案，從而減少了需要重新處理的檔案集。這對 kapt 而言是不可能的，因為它將處理委託給 javac。

### KSP 僅限於 Kotlin 嗎？

KSP 也能夠處理 Java 原始碼。其 API 是統一的，這表示當您解析 Java 類別和 Kotlin 類別時，在 KSP 中會獲得一個統一的資料結構。

### 如何升級 KSP？

KSP 包含 API 和實作 (implementation) 兩部分。API 很少變更且向下相容 (backward compatible)：可能會新增介面，但舊有介面絕不會變更。實作部分則綁定特定編譯器版本。隨著新版本發佈，支援的編譯器版本可能會有所變動。

處理器 (processor) 僅依賴於 API，因此不與編譯器版本綁定。然而，處理器的使用者在專案中提升編譯器版本時，需要同時提升 KSP 版本。否則，將會發生以下錯誤：

```text
ksp-a.b.c is too old for kotlin-x.y.z. Please upgrade ksp or downgrade kotlin-gradle-plugin
```

> 處理器的使用者無需提升處理器版本，因為處理器僅依賴於 API。
>
{style="note"}

舉例來說，某個處理器發佈時已在 KSP 1.0.1（嚴格依賴 Kotlin 1.6.0）下進行測試。若要使其與 Kotlin 1.6.20 搭配運作，您只需將 KSP 提升至為 Kotlin 1.6.20 構建的版本（例如 KSP 1.1.0）即可。

### 我可以使用較新的 KSP 實作搭配較舊的 Kotlin 編譯器嗎？

如果語言版本相同，Kotlin 編譯器理應向下相容。大多數情況下，提升 Kotlin 編譯器版本應該是輕而易舉的。如果您需要較新的 KSP 實作，請相應地升級 Kotlin 編譯器。

### KSP 的更新頻率為何？

KSP 盡力遵循 [語義化版本控制 (Semantic Versioning)](https://semver.org/) 的原則。
KSP 版本格式為 `major.minor.patch`，其中：
*   `major` 版本保留用於不相容的 API 變更。此類變更沒有預定排程。
*   `minor` 版本保留用於新功能。此版本大約每季更新。
*   `patch` 版本保留用於錯誤修復和新的 Kotlin 版本發佈。此版本大約每月更新。

通常，在新的 Kotlin 版本發佈後數日內，相應的 KSP 版本也會隨之提供，包括 [預發佈版本 (Beta 或 RC)](eap.md)。

### 除了 Kotlin 之外，是否有其他函式庫的版本要求？

以下是函式庫/基礎設施 (infrastructure) 的要求清單：
*   Android Gradle Plugin 7.1.3+
*   Gradle 6.8.3+

### KSP 的未來發展藍圖為何？

已規劃以下項目：
*   支援 [新的 Kotlin 編譯器](roadmap.md)
*   改善對多平台 (multiplatform) 的支援。例如，在目標子集上執行 KSP / 在目標之間共用計算。
*   提升效能。還有大量最佳化工作有待完成！
*   持續修復錯誤。

如果您有任何想法想與我們討論，請隨時透過 [#ksp channel in Kotlin Slack](https://kotlinlang.slack.com/archives/C013BA8EQSE)（[獲取邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）與我們聯繫。提交 [GitHub 問題 (issues)/功能請求 (feature requests)](https://github.com/google/ksp/issues) 或合併請求 (pull requests) 也非常歡迎！