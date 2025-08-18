[//]: # (title: KSP 常見問題)

### 為何選擇 KSP？

KSP 相較於 [kapt](kapt.md) 具有多項優勢：
* 速度更快。
* API 對於 Kotlin 使用者而言更為流暢。
* 它支援對生成的 Kotlin 原始碼進行[多輪處理](ksp-multi-round.md)。
* 其設計時已將多平台相容性納入考量。

### 為何 KSP 比 kapt 更快？

kapt 必須解析並解析每個型別引用才能生成 Java 存根，而 KSP 則是按需解析引用。委託給 javac 也會耗費時間。

此外，KSP 的[增量處理模型](ksp-incremental.md)比單純的隔離和聚合具有更細的粒度。它能找到更多機會來避免重新處理所有內容。此外，由於 KSP 動態追蹤符號解析，檔案中的變更較不容易污染其他檔案，因此需要重新處理的檔案集合會更小。這對於 kapt 來說是不可能的，因為它將處理委託給 javac。

### KSP 是否為 Kotlin 專用？

KSP 也能處理 Java 原始碼。API 是統一的，這表示當你解析一個 Java 類別和一個 Kotlin 類別時，你在 KSP 中會得到一個統一的資料結構。

### 如何升級 KSP？

KSP 包含 API 和實作。API 很少變更且向後相容：可以有新的介面，但舊的介面永不變更。實作綁定於特定的編譯器版本。隨著新版本的發布，支援的編譯器版本可能會改變。

處理器僅依賴於 API，因此不綁定於編譯器版本。然而，處理器的使用者在專案中提升編譯器版本時，需要提升 KSP 版本。否則，將會發生以下錯誤：

```text
ksp-a.b.c is too old for kotlin-x.y.z. Please upgrade ksp or downgrade kotlin-gradle-plugin
```

> 處理器的使用者不需要提升處理器的版本，因為處理器僅依賴於 API。
>
{style="note"}

例如，某個處理器是與 KSP 1.0.1（嚴格依賴於 Kotlin 1.6.0）一起發布和測試的。若要使其能與 Kotlin 1.6.20 協同工作，你唯一需要做的就是將 KSP 提升到為 Kotlin 1.6.20 構建的版本（例如，KSP 1.1.0）。

### 我可以使用較新的 KSP 實作搭配較舊的 Kotlin 編譯器嗎？

如果語言版本相同，Kotlin 編譯器應該是向後相容的。大多數時候提升 Kotlin 編譯器應該是輕而易舉的。如果你需要較新的 KSP 實作，請相應地升級 Kotlin 編譯器。

### 你們多久更新一次 KSP？

KSP 盡可能遵循 [語義化版本控制 (Semantic Versioning)](https://semver.org/)。
對於 KSP 版本 `major.minor.patch`，
* `major` 保留用於不相容的 API 變更。目前沒有預定的時程表。
* `minor` 保留用於新功能。這大約每季度更新一次。
* `patch` 保留用於錯誤修復和新的 Kotlin 版本發布。它大約每月更新一次。

通常在新的 Kotlin 版本發布後的幾天內，就會有對應的 KSP 版本可用，包括[預發布版本（Beta 或 RC）](eap.md)。

### 除了 Kotlin 之外，函式庫還有其他版本要求嗎？

以下是針對函式庫/基礎設施的要求列表：
* Android Gradle Plugin 7.1.3+
* Gradle 6.8.3+

### KSP 的未來藍圖為何？

以下項目已規劃：
* 支援[新的 Kotlin 編譯器](roadmap.md)
* 改進對多平台的支援。例如，在目標的子集上執行 KSP / 在目標之間共享計算。
* 提升效能。還有許多最佳化工作待完成！
* 持續修復錯誤。

如果你想討論任何想法，請隨時透過[Kotlin Slack 的 #ksp 頻道](https://kotlinlang.slack.com/archives/C013BA8EQSE)（[獲取邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）聯繫我們。也歡迎提交 [GitHub 問題/功能請求](https://github.com/google/ksp/issues) 或拉取請求！