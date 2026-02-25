[//]: # (title: 遷移至 Kotlin 程式碼風格)

<no-index/>

> 從 Kotlin 1.4.0 開始，IntelliJ IDEA 中的所有專案均預設啟用官方程式碼風格格式化。
> 
{style="note"}

## Kotlin 編碼慣例與 IntelliJ IDEA 格式化程序

[Kotlin 編碼慣例](coding-conventions.md)影響了編寫道地 Kotlin 的多個方面，其中包括一套旨在提高 Kotlin 程式碼可讀性的格式化建議。

IntelliJ IDEA 內建的程式碼格式化程序（formatter）過去使用預設設定，其產出的格式與目前的建議有所不同。

我們希望透過切換 IntelliJ IDEA 中的預設值，使格式化與 Kotlin 編碼慣例保持一致，從而消除這種不一致。這就是實作以下遷移計畫的原因：

* 從 Kotlin 1.3.0 開始，官方程式碼風格格式化僅對新專案預設啟用（舊格式化可以手動啟用）。
* 現有專案的作者可以選擇遷移到 Kotlin 編碼慣例。
* 現有專案的作者可以選擇在專案中明確宣告使用舊的程式碼風格（這樣專案就不會受到未來切換到預設值的影響）。
* 從 Kotlin 1.4.0 開始，所有專案都啟用預設格式化，以與 Kotlin 編碼慣例保持一致。

## 「Kotlin 編碼慣例」與「IntelliJ IDEA 預設程式碼風格」的差異

最顯著的變更在於續行縮排（continuation indentation）策略。使用雙倍縮排來顯示多行運算式尚未在前一行結束是一個不錯的想法。這是一個簡單且通用的規則，但當以這種方式格式化時，某些 Kotlin 結構看起來會有些彆扭。在 Kotlin 編碼慣例中，建議在以前強制使用長續行縮排的情況下改用單一縮排。

<img src="code-formatting-diff.png" alt="Code formatting" width="700"/>

在實務中，相當多程式碼會受到影響，因此這可以被視為一次重大的程式碼風格更新。

## 遷移至新程式碼風格的討論

如果從新專案開始，且沒有以舊方式格式化的程式碼，採用新程式碼風格可能會是一個非常自然的過程。這就是為什麼從 1.3.0 版本開始，Kotlin IntelliJ 外掛程式建立的新專案會預設啟用 [編碼慣例](coding-conventions.md) 文件中的格式化。

在現有專案中變更格式化是一項要求更高任務，應在與團隊討論所有注意事項後再開始。

在現有專案中變更程式碼風格的主要缺點是，版本控制系統（VCS）的 blame/annotate 功能會更頻繁地指向無關的提交。雖然每個 VCS 都有處理此問題的方法（IntelliJ IDEA 中可以使用 [「Annotate Previous Revision」](https://www.jetbrains.com/help/idea/investigate-changes.html)），但決定新風格是否值得投入這些努力仍然很重要。將重新格式化的提交與有意義的變更分開的做法，對於以後的調查會有很大幫助。

此外，對於較大的團隊來說，遷移可能會更困難，因為在多個子系統中提交大量檔案可能會在個人分支中產生合併衝突。雖然每次解決衝突通常都很簡單，但了解目前是否有正在進行的大型功能分支仍然是明智的。

一般來說，對於小型專案，我們建議一次轉換所有檔案。

對於中大型專案，這個決定可能很艱難。如果您還沒準備好立即更新許多檔案，您可以決定逐個模組進行遷移，或僅針對修改過的檔案繼續進行漸進式遷移。

## 遷移至新程式碼風格

切換到 Kotlin 編碼慣例程式碼風格可以在 **Settings/Preferences** | **Editor** | **Code Style** | **Kotlin** 對話方塊中完成。將配置（scheme）切換為 **Project**，並啟動 **Set from...** | **Kotlin style guide**。

若要與所有專案開發人員共享這些變更，必須將 `.idea/codeStyle` 資料夾提交至 VCS。

如果使用外部建置系統來配置專案，且決定不共享 `.idea/codeStyle` 資料夾，則可以使用額外屬性強制執行 Kotlin 編碼慣例：

### 在 Gradle 中

將 `kotlin.code.style=official` 屬性新增至專案根目錄的 `gradle.properties` 檔案，並將該檔案提交至 VCS。

### 在 Maven 中

將 `kotlin.code.style official` 屬性新增至根目錄的 `pom.xml` 專案檔中。

```
<properties>
  <kotlin.code.style>official</kotlin.code.style>
</properties>
```

>設定 **kotlin.code.style** 選項可能會在專案匯入期間修改程式碼風格配置，並可能變更程式碼風格設定。
>
{style="warning"}

更新程式碼風格設定後，在專案檢視中對所需的範圍啟動 **Reformat Code**。

<img src="reformat-code.png" alt="Reformat code" width="500"/>

對於漸進式遷移，可以啟用 **File is not formatted according to project settings** 檢查。它會醒目提示應該重新格式化的地方。啟用 **Apply only to modified files** 選項後，檢查將僅顯示已修改檔案中的格式化問題。這類檔案反正很可能很快就會被提交。

## 在專案中保留舊的程式碼風格

您隨時可以明確地將 IntelliJ IDEA 程式碼風格設定為專案的正確程式碼風格：

1. 在 **Settings/Preferences** | **Editor** | **Code Style** | **Kotlin** 中，切換到 **Project** 配置。
2. 開啟 **Load/Save** 標籤，在 **Use defaults from** 中選取 **Kotlin obsolete IntelliJ IDEA codestyle**。

若要在專案開發人員之間共享變更，必須將 `.idea/codeStyle` 資料夾提交至 VCS。或者，對於使用 Gradle 或 Maven 配置的專案，可以使用 **kotlin.code.style**=**obsolete**。