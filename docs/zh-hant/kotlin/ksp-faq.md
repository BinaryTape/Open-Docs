---
title: "KSP 常見問題"
---
### 為什麼選擇 KSP？

相較於 [kapt](kapt)，KSP 具有以下優勢：
* 速度更快。
* 對於 Kotlin 使用者來說，API 更加流暢。
* 它支援在產生的 Kotlin 原始碼上進行[多輪處理](ksp-multi-round)（Multiple Round Processing）。
* 它的設計考慮了多平台相容性（Multiplatform Compatibility）。

### 為什麼 KSP 比 kapt 快？

kapt 必須解析和解析每個類型引用才能產生 Java 存根（Java Stub），而 KSP 則根據需求解析引用。委派給 javac 也需要時間。

此外，KSP 的 [增量處理模型](ksp-incremental)（Incremental Processing Model）具有比僅隔離和聚合更精細的粒度。它可以找到更多避免重新處理所有內容的機會。此外，由於 KSP 動態追蹤符號解析（Symbol Resolution），因此檔案中的變更不太可能汙染其他檔案，因此需要重新處理的檔案集更小。kapt 無法做到這一點，因為它將處理委派給 javac。

### KSP 是否特定於 Kotlin？

KSP 也可以處理 Java 原始碼。API 是統一的，這意味著當您解析 Java 類別和 Kotlin 類別時，您會在 KSP 中獲得統一的資料結構。

### 如何升級 KSP？

KSP 具有 API 和實作（Implementation）。API 很少變更，並且是向後相容的：可以有新的介面，但舊的介面永遠不會變更。實作與特定的編譯器版本相關。隨著新版本的發布，支援的編譯器版本可能會變更。

處理器（Processor）僅依賴於 API，因此不受編譯器版本的限制。
但是，處理器的使用者需要在專案中提高編譯器版本時，也提高 KSP 版本。
否則，將發生以下錯誤：

```text
ksp-a.b.c is too old for kotlin-x.y.z. Please upgrade ksp or downgrade kotlin-gradle-plugin
```

:::note
處理器的使用者無需提高處理器的版本，因為處理器僅依賴於 API。

:::

例如，某些處理器是使用 KSP 1.0.1 發布和測試的，它嚴格依賴於 Kotlin 1.6.0。
為了使其與 Kotlin 1.6.20 搭配使用，您唯一需要做的就是將 KSP 提高到為 Kotlin 1.6.20 建置的版本（例如，KSP 1.1.0）。

### 我可以使用較新的 KSP 實作搭配較舊的 Kotlin 編譯器嗎？

如果語言版本相同，則 Kotlin 編譯器應向後相容。
在大多數情況下，升級 Kotlin 編譯器應該是簡單的。如果您需要較新的 KSP 實作，請相應地升級 Kotlin 編譯器。

### 你們多久更新一次 KSP？

KSP 嘗試盡可能接近地遵循 [語義化版本控制](https://semver.org/)（Semantic Versioning）。
對於 KSP 版本 `major.minor.patch`，
* `major` 保留給不相容的 API 變更。對此沒有預定的時間表。
* `minor` 保留給新功能。這將大約每季度更新一次。
* `patch` 保留給錯誤修復和新的 Kotlin 版本。它大約每月更新一次。

通常，在發布新 Kotlin 版本後的幾天內，就會提供相應的 KSP 版本，
包括[預發布版本（Beta 或 RC）](eap)。

### 除了 Kotlin 之外，函式庫還有其他版本要求嗎？

以下是函式庫/基礎結構的要求清單：
* Android Gradle Plugin 7.1.3+
* Gradle 6.8.3+

### KSP 未來的發展藍圖是什麼？

已計劃以下項目：
* 支援[新的 Kotlin 編譯器](https://kotlinlang.org/docs/roadmap.html)
* 改善對多平台（Multiplatform）的支援。例如，在目標的子集上執行 KSP/在目標之間共享計算。
* 提高效能。有很多最佳化需要完成！
* 繼續修復錯誤。

如果您想討論任何想法，請隨時透過[Kotlin Slack 中的 #ksp 頻道](https://kotlinlang.slack.com/archives/C013BA8EQSE)與我們聯繫
（[獲取邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。也歡迎提交 [GitHub 問題/功能請求](https://github.com/google/ksp/issues)
或發送 Pull Request！