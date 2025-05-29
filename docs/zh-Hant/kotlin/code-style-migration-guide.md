[//]: # (title: 遷移至 Kotlin 程式碼風格)

## Kotlin 程式碼慣例與 IntelliJ IDEA 格式化工具

[Kotlin 程式碼慣例](coding-conventions.md) (Kotlin coding conventions) 影響了編寫慣用 Kotlin 的多個方面，其中一項就是一套旨在提高 Kotlin 程式碼可讀性的格式化建議。

遺憾的是，IntelliJ IDEA 內建的程式碼格式化工具在本文發佈前就已存在很長時間，並且現在的預設設定所產生的格式與目前推薦的有所不同。

將 IntelliJ IDEA 中的預設設定切換並使格式與 Kotlin 程式碼慣例保持一致，看似是消除這種不明確性的合理下一步。然而，這意味著所有現有的 Kotlin 專案在 Kotlin 外掛安裝時，都會啟用新的程式碼風格。這對於外掛更新而言，並非預期結果，對嗎？

因此，我們改為採用以下遷移計畫：

* 從 Kotlin 1.3 開始，預設啟用官方程式碼風格格式化，且僅限於新專案（舊格式可手動啟用）
* 現有專案的作者可選擇遷移至 Kotlin 程式碼慣例
* 現有專案的作者可選擇明確宣告在專案中使用舊的程式碼風格（這樣專案在未來切換為預設設定時不會受影響）
* 在 Kotlin 1.4 中切換到預設格式並使其與 Kotlin 程式碼慣例保持一致

## 「Kotlin 程式碼慣例」與「IntelliJ IDEA 預設程式碼風格」之間的差異

最顯著的變化在於續行縮排 (continuation indentation) 策略。有一個不錯的點子是使用雙倍縮排來表示多行表達式尚未在前一行結束。這是一個非常簡單且通用的規則，但當 Kotlin 的某些結構以這種方式格式化時，會顯得有些彆扭。在 Kotlin 程式碼慣例中，建議在之前強制使用長續行縮排的情況下，改用單一縮排。

<img src="code-formatting-diff.png" alt="Code formatting" width="700"/>

實際上，相當多的程式碼受到影響，因此這可以被視為一項重大的程式碼風格更新。

## 遷移至新程式碼風格的討論

如果從一個沒有以舊方式格式化程式碼的新專案開始，採用新的程式碼風格可能是一個非常自然的過程。這就是為什麼從 1.3 版本開始，Kotlin IntelliJ 外掛在建立新專案時，預設會啟用 [程式碼慣例](coding-conventions.md) 文件中的格式設定。

更改現有專案的格式是一項更具挑戰性的任務，應該首先與團隊討論所有注意事項。

在現有專案中更改程式碼風格的主要缺點是，版本控制系統 (VCS) 的 blame/annotate 功能會更頻繁地指向不相關的提交。雖然每個 VCS 都有某種方法來處理這個問題（IntelliJ IDEA 中可以使用 ["Annotate Previous Revision"](https://www.jetbrains.com/help/idea/investigate-changes.html)），但重要的是要決定新的風格是否值得付出這些努力。將重新格式化的提交與有意義的變更分開的做法，對於後續的調查有很大幫助。

此外，對於大型團隊而言，遷移可能更困難，因為在多個子系統中提交大量文件可能會在個人分支中產生合併衝突。儘管每個衝突解決通常都是微不足道的，但了解目前是否有正在進行中的大型功能分支仍然是明智之舉。

總體而言，對於小型專案，我們建議一次性轉換所有文件。

對於中型和大型專案，這個決定可能很艱難。如果您不準備立即更新許多文件，您可以決定逐模組遷移，或者只對修改過的文件進行漸進式遷移。

## 遷移至新程式碼風格

要切換到 Kotlin 程式碼慣例的程式碼風格，可以在 **設定/偏好設定** (Settings/Preferences) | **編輯器** (Editor) | **程式碼風格** (Code Style) | **Kotlin** 對話框中進行。將方案切換為 **專案** (Project) 並啟用 **設定自...** (Set from...) | **Kotlin 風格指南** (Kotlin style guide)。

為了讓所有專案開發者共享這些變更，`.idea/codeStyle` 資料夾必須提交到版本控制系統 (VCS)。

如果專案使用外部建置系統進行配置，並且決定不共享 `.idea/codeStyle` 資料夾，則可以透過一個額外的屬性來強制執行 Kotlin 程式碼慣例：

### 在 Gradle 中

在專案根目錄的 `gradle.properties` 文件中新增 `kotlin.code.style=official` 屬性，並將該文件提交到版本控制系統 (VCS)。

### 在 Maven 中

在根 `pom.xml` 專案文件中新增 `kotlin.code.style official` 屬性。

```
<properties>
  <kotlin.code.style>official</kotlin.code.style>
</properties>
```

>設定 **kotlin.code.style** 選項可能會在專案匯入期間修改程式碼風格方案，並可能變更程式碼風格設定。
>
{style="warning"}

更新程式碼風格設定後，在專案視圖中對所需範圍啟用 **重新格式化程式碼** (Reformat Code)。

<img src="reformat-code.png" alt="Reformat code" width="500"/>

對於漸進式遷移，可以啟用 **檔案未依專案設定格式化** (File is not formatted according to project settings) 檢查。它將標示出應重新格式化的位置。啟用 **僅應用於修改過的文件** (Apply only to modified files) 選項後，檢查將只在修改過的文件中顯示格式問題。這些文件無論如何都可能很快被提交。

## 在專案中儲存舊程式碼風格

始終可以將 IntelliJ IDEA 程式碼風格明確設定為專案的正確程式碼風格：

1. 在 **設定/偏好設定** (Settings/Preferences) | **編輯器** (Editor) | **程式碼風格** (Code Style) | **Kotlin** 中，切換到 **專案** (Project) 方案。
2. 開啟 **載入/儲存** (Load/Save) 標籤，並在 **使用預設來自** (Use defaults from) 中選擇 **Kotlin 廢棄的 IntelliJ IDEA 程式碼風格** (Kotlin obsolete IntelliJ IDEA codestyle)。

為了讓所有專案開發者共享這些變更，`.idea/codeStyle` 資料夾必須提交到版本控制系統 (VCS)。或者，對於使用 Gradle 或 Maven 配置的專案，可以使用 **kotlin.code.style**=**obsolete**。