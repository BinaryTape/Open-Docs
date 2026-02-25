[//]: # (title: KSP 常見問題)

### 為什麼選擇 KSP？

與 [kapt](kapt.md) 相比，KSP 具有以下幾項優勢：
* 速度更快。
* 對於 Kotlin 使用者而言，API 更加流暢。
* 支援對產生的 Kotlin 原始碼進行[多輪處理](ksp-multi-round.md)。
* 在設計時就考慮了多平台相容性。

### 為什麼 KSP 比 kapt 更快？

kapt 必須剖析並解析每個型別參照以產生 Java 虛設常式，而 KSP 則是按需解析參照。
委託給 javac 處理也需要時間。

此外，KSP 的[增量處理模型](ksp-incremental.md)具有比單純的隔離與聚合更細的粒度。它能發現更多避免重新處理所有內容的機會。同時，由於 KSP 會動態追蹤符號解析，檔案中的變更不太可能污染其他檔案，因此需要重新處理的檔案集會更小。這對 kapt 來說是不可能的，因為它將處理作業委託給了 javac。

### KSP 是 Kotlin 專用的嗎？

KSP 也可以處理 Java 原始碼。其 API 是統一的，這意味著當您剖析 Java 類別與 Kotlin 類別時，在 KSP 中會得到統一的資料結構。

### 如何升級 KSP？

KSP 包含 API 與實作。API 極少變動且具備回溯相容性：可能會增加新的介面，但舊介面絕不會更動。實作則與特定的編譯器版本繫結。隨著新版本的發佈，支援的編譯器版本可能會改變。

處理器僅依賴於 API，因此不與編譯器版本繫結。
然而，處理器的使用者在提升專案中的編譯器版本時，需要同步升級 KSP 版本。
否則，將會出現以下錯誤：

```text
ksp-a.b.c is too old for kotlin-x.y.z. Please upgrade ksp or downgrade kotlin-gradle-plugin
```

> 處理器的使用者不需要提升處理器的版本，因為處理器僅依賴於 API。
>
{style="note"}

例如，某個處理器是使用 KSP 1.0.1 發佈並測試的，該版本嚴格依賴於 Kotlin 1.6.0。
為了使其能與 Kotlin 1.6.20 搭配運作，您唯一需要做的就是將 KSP 升級到為 Kotlin 1.6.20 建置的版本（例如 KSP 1.1.0）。

### 我可以在舊版 Kotlin 編譯器中使用較新版本的 KSP 實作嗎？

如果語言版本相同，Kotlin 編譯器應該是回溯相容的。
在大多數情況下，提升 Kotlin 編譯器版本應該是非常簡單的。如果您需要較新版本的 KSP 實作，請相應地升級 Kotlin 編譯器。

### KSP 多久更新一次？

KSP 盡可能遵循[語意化版本](https://semver.org/)規範。
對於 KSP 版本號 `major.minor.patch`：
* `major`（主版本）保留給不相容的 API 變更。目前沒有預定的發佈時程。
* `minor`（次版本）保留給新功能。大約每季更新一次。
* `patch`（修訂版本）保留給錯誤修正與新的 Kotlin 版本發佈。大約每月更新一次。

通常在新的 Kotlin 版本發佈後的幾天內，就會提供對應的 KSP 版本，這也包括[預覽版本 (Beta 或 RC)](eap.md)。

### 除了 Kotlin 之外，對於程式庫還有其他的版本需求嗎？

以下是程式庫／基礎結構的需求清單：
* Android Gradle 外掛程式 7.1.3+
* Gradle 6.8.3+

### KSP 的未來藍圖是什麼？

已規劃以下項目：
* 支援[新的 Kotlin 編譯器](roadmap.md)
* 改進對多平台的支援。例如，在目標子集上執行 KSP，或在目標之間共享計算結果。
* 提升效能。還有許多最佳化工作待完成！
* 持續修正錯誤。

如果您想討論任何想法，歡迎在 [Kotlin Slack 的 #ksp 頻道](https://kotlinlang.slack.com/archives/C013BA8EQSE)與我們聯絡（[獲取邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。
也歡迎提交 [GitHub 問題／功能請求](https://github.com/google/ksp/issues)或提取要求！