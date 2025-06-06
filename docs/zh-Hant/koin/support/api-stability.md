---
title: API 穩定性與發佈類型
custom_edit_url: null
---

## API 穩定性

Koin 專案致力於在不同版本間維持高度相容性。Kotzilla 團隊與所有活躍的維護者，努力確保新發佈版本中引入的任何變更、增強功能或最佳化，皆不會破壞現有應用程式。我們理解穩定且可預測的升級路徑對使用者而言至關重要，我們也努力在發展 API 時將中斷降至最低。

### 實驗性 API - @KoinExperimentalAPI

為促進創新並同時收集寶貴的社群回饋，我們在 `@KoinExperimentalAPI` 註解下引入新功能和 API。此指定表示：

-   **活躍開發中**: 該 API 仍處於設計階段，並且可能會變更。
-   **鼓勵提供回饋**: 我們邀請開發者測試這些功能並分享他們的經驗，協助我們完善並改進設計。
-   **潛在的破壞性變更**: 因為這些 API 屬於實驗性質，它們可能會在後續發佈版本中根據社群輸入進行修改或移除。

### 棄用政策 - @Deprecated

為確保 API 部分內容逐步淘汰時能順利過渡，Koin 使用 `@Deprecated` 註解明確標記這些區域。我們的棄用策略包括：

清晰的警告：棄用的 API 會附帶一則訊息，指出建議的替代方案或棄用的原因。

棄用級別：
-   **警告**: 表示儘管 API 仍可使用，但不鼓勵其使用，應盡早替換。
-   **錯誤**: 表示該 API 已不再打算使用，並且無法編譯，確保重要變更能及時處理。

這種方法有助於開發者識別和更新依賴過時 API 的程式碼，減少技術債務，並為更簡潔、更穩固的程式碼庫鋪平道路。`ReplaceWith` 可與 API 一併提供，視更新的複雜性而定。

### 內部 API - @KoinInternalAPI

對於嚴格用於 Koin 框架內部使用的功能，我們引入 `@KoinInternalAPI` 註解。這些 API 不屬於公開契約的一部分，並且：

-   **僅限內部使用**: 僅為 Koin 的內部機制而設計。
-   **可能變更**: 未來發佈版本中可能在不另行通知的情況下進行修改或移除。
-   **避免外部使用**: 為維持長期相容性，不鼓勵開發者在其應用程式碼中使用這些 API。

### 使用 Kotlin 的 @OptIn 註解選擇啟用

Koin 中實驗性 API 和棄用 API 的使用都需要選擇啟用，以確保開發者完全知曉該 API 的狀態和潛在風險。透過使用 Kotlin 的 `@OptIn` 註解，您明確承認您的程式碼依賴於屬於實驗性質或已標記為棄用的 API。

## 發佈類型

Koin 遵循語義化版本控制 (SemVer)，並帶有額外的字首識別符，以表示每個發佈版本的成熟度和預期用途。我們使用的字首包括：

-   **發佈候選版 (RC)**: 這些發佈版本是穩定版本的完整功能候選版。它們會進行最終測試和完善。雖然 RC 版本旨在高度相容，但根據最終回饋，在正式發佈之前仍可能發生微小變更。
-   **Alpha / Beta**: Alpha 和 Beta 版本主要用於測試和回饋。它們通常包含實驗性功能，並且可能不完全符合穩定 API 的保證。鼓勵開發者在非生產環境中試用這些發佈版本，以協助識別潛在問題並引導未來的改進。