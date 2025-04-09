---
title: "移轉至 Kotlin 程式碼風格"
---
## Kotlin 編碼慣例與 IntelliJ IDEA 格式化工具

[Kotlin 編碼慣例](coding-conventions)會影響編寫慣用 Kotlin 的多個方面，其中一組格式化建議旨在提高 Kotlin 程式碼的可讀性。

遺憾的是，IntelliJ IDEA 內建的程式碼格式化工具必須在本文發布很久之前就開始工作，現在有一個預設設置，產生的格式與現在推薦的格式不同。

透過切換 IntelliJ IDEA 中的預設值，使格式與 Kotlin 編碼慣例保持一致，從而消除這種模糊性，這似乎是合乎邏輯的下一步。 但這意味著所有現有的 Kotlin 專案在安裝 Kotlin 外掛程式的那一刻都將啟用新的程式碼風格。 這並不是外掛程式更新的預期結果，對吧？

這就是我們採用以下遷移計畫的原因：

* 從 Kotlin 1.3 開始，預設啟用官方程式碼風格格式化，且僅適用於新專案（舊格式可以手動啟用）
* 現有專案的作者可以選擇遷移到 Kotlin 編碼慣例
* 現有專案的作者可以選擇在專案中明確宣告使用舊程式碼風格（這樣專案將不會受到將來切換到預設值的影響）
* 切換到預設格式化，並在 Kotlin 1.4 中使其與 Kotlin 編碼慣例保持一致

## “Kotlin 編碼慣例”與 “IntelliJ IDEA 預設程式碼風格”之間的差異

最顯著的變化在於連續縮排策略（continuation indentation policy）。 一個不錯的想法是使用雙重縮排來表明多行表達式尚未在前一行結束。 這是一個非常簡單且通用的規則，但是當以這種方式格式化時，一些 Kotlin 結構看起來有點尷尬。 在 Kotlin 編碼慣例中，建議在之前被迫使用長連續縮排的情況下使用單個縮排。

<img src="/img/code-formatting-diff.png" alt="Code formatting" width="700"/>

實際上，相當多的程式碼會受到影響，因此這可以被認為是一個主要的程式碼風格更新。

## 遷移到新的程式碼風格討論

如果從一個新專案開始，當沒有以舊方式格式化的程式碼時，採用新的程式碼風格可能是一個非常自然的過程。 這就是為什麼從 1.3 版開始，Kotlin IntelliJ 外掛程式會使用[編碼慣例](coding-conventions)文件中預設啟用的格式建立新專案。

更改現有專案中的格式是一項更艱鉅的任務，可能應該首先與團隊討論所有注意事項。

在現有專案中更改程式碼風格的主要缺點是，blame/annotate VCS 功能將更頻繁地指向不相關的提交。 雖然每個 VCS 都有某種方式來解決此問題（[Annotate Previous Revision](https://www.jetbrains.com/help/idea/investigate-changes.html) 可以在 IntelliJ IDEA 中使用），但重要的是要確定新的風格是否值得付出所有努力。 將重新格式化提交與有意義的更改分開的做法可以為以後的調查提供很大幫助。

此外，對於較大的團隊來說，遷移可能會更加困難，因為在多個子系統中提交大量檔案可能會在個人分支中產生合併衝突。 雖然每個衝突解決通常都很簡單，但最好還是知道目前是否有大型功能分支正在開發中。

通常，對於小型專案，我們建議一次轉換所有檔案。

對於中型和大型專案，決定可能很棘手。 如果您還沒有準備好立即更新許多檔案，您可以決定逐個模組遷移，或僅繼續對修改後的檔案進行逐步遷移。

## 遷移到新的程式碼風格

可以在**Settings/Preferences** | **Editor** | **Code Style** | **Kotlin**對話方塊中切換到 Kotlin 編碼慣例程式碼風格。 將方案（scheme）切換為 **Project** 並啟用 **Set from...** | **Kotlin style guide**。

為了與所有專案開發人員分享這些變更，必須將 `.idea/codeStyle` 資料夾提交到 VCS。

如果外部建置系統用於配置專案，並且已決定不共享 `.idea/codeStyle` 資料夾，則可以使用其他屬性強制執行 Kotlin 編碼慣例：

### 在 Gradle 中

將 `kotlin.code.style=official` 屬性新增到專案根目錄下的 `gradle.properties` 檔案，並將該檔案提交到 VCS。

### 在 Maven 中

將 `kotlin.code.style official` 屬性新增到根 `pom.xml` 專案檔案。

```
<properties>
  <kotlin.code.style>official</kotlin.code.style>
</properties>
```

:::caution
設定 **kotlin.code.style** 選項可能會在專案匯入期間修改程式碼風格方案，並可能更改程式碼風格設定。

:::

更新程式碼風格設定後，在所需的範圍內的專案視圖中啟用 **Reformat Code**。

<img src="/img/reformat-code.png" alt="Reformat code" width="500"/>

對於逐步遷移，可以啟用 **File is not formatted according to project settings** 檢查。 它將突出顯示應重新格式化的位置。 啟用 **Apply only to modified files** 選項後，檢查將僅顯示修改後的檔案中的格式問題。 這些檔案很可能很快就會被提交。

## 在專案中儲存舊程式碼風格

始終可以將 IntelliJ IDEA 程式碼風格明確設定為專案的正確程式碼風格：

1. 在 **Settings/Preferences** | **Editor** | **Code Style** | **Kotlin** 中，切換到 **Project** 方案。
2. 開啟 **Load/Save** 標籤，並在 **Use defaults from** 中，選擇 **Kotlin obsolete IntelliJ IDEA codestyle**。

為了在專案開發人員之間共享變更，必須將 `.idea/codeStyle` 資料夾提交到 VCS。 或者，對於使用 Gradle 或 Maven 配置的專案，可以使用 **kotlin.code.style**=**obsolete**。