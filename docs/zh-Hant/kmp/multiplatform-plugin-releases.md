[//]: # (title: Kotlin Multiplatform IDE 外掛程式發佈)

[Kotlin Multiplatform IDE 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform) 可協助您開發適用於 Android、iOS、桌面和網頁的跨平台應用程式。請確保您已安裝最新版本的外掛程式，以便使用 Kotlin Multiplatform 專案。

> 該 IDE 外掛程式目前僅適用於 macOS，對 Windows 和 Linux 的支援正在開發中。
>
{style="note"}

此外掛程式與 IntelliJ IDEA（從版本 2025.1.1.1 開始）和 Android Studio（從 Narwhal 2025.1.1 開始）均相容。

> 有關 Kotlin Multiplatform Gradle 外掛程式的資訊，請參閱其 [DSL 參考](multiplatform-dsl-reference.md) 和 [相容性指南](multiplatform-compatibility-guide.md)。
>
{style="tip"}

## 更新至最新發佈版本

您的 IDE 會在新版 Kotlin Multiplatform 外掛程式發佈後立即建議更新。如果您接受此建議，外掛程式將更新至最新版本。若要完成外掛程式安裝，請重新啟動 IDE。

您可以在 **Settings** | **Plugins** 中查看外掛程式版本並手動更新。

此外掛程式需要相容的 Kotlin 版本才能正常運作。您可以在 [發佈詳情](#release-details) 中找到相容的版本。若要檢查您的 Kotlin 版本並進行更新，請前往 **Settings** | **Plugins** 或 **Tools** | **Kotlin** | **Configure Kotlin in Project**。

> 如果您沒有安裝相容的 Kotlin 版本，Kotlin Multiplatform 外掛程式將會被禁用。請更新您的 Kotlin 版本，然後在 **Settings** | **Plugins** 中重新啟用此外掛程式。
>
{style="note"}

## 發佈詳情

下表列出了 Kotlin Multiplatform IDE 外掛程式的發佈版本：

<table>
<tr>
<th>
發佈資訊
</th>
<th>
發佈亮點
</th>
<th>
相容的 Kotlin 版本
</th>
</tr>
<tr id="0.9">
<td>

**0.9**

發佈日期：2025 年 5 月 19 日

</td>
<td>

Kotlin Multiplatform 外掛程式已從頭開始重新建構：

*   支援的 IDE 中整合了 **New Project** 精靈。
*   預檢環境檢查，有助於尋找並解決設定問題，包括 Java、Android、Xcode 和 Gradle。
*   為所有支援的平台自動產生執行設定，並提供 iOS 和 Android 的裝置選擇器。
*   跨語言支援：Swift 和 Kotlin 的跨語言導覽和偵錯，以及 Swift 語法高亮顯示和快速文件。
*   Compose Multiplatform 支援：Kotlin Multiplatform 外掛程式現在支援 Compose Multiplatform 資源、自動完成和通用程式碼的 UI 預覽（[先前的 Compose Multiplatform 外掛程式](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support) 可安全解除安裝）。
*   Compose Hot Reload：無需重新啟動應用程式即可立即查看 UI 變更（適用於桌面 JVM 目標）。有關更多資訊，請參閱 [Hot Reload 文件](compose-hot-reload.md)。

已知問題：

*   在 Android Studio 中，Compose 偵錯器目前不適用於 Kotlin 2.1.20 和 2.1.21。此問題將在 Kotlin 2.2.0-RC2 中修復。

</td>
<td>

此外掛程式可與 [任何 Kotlin 版本](https://kotlinlang.org/docs/releases.html#release-details) 搭配使用，但其大部分功能依賴於 Kotlin 2.1.21。更新到最新的穩定 Kotlin 版本可確保最佳體驗。

此版本還需要 K2 模式，因此請務必啟用它：在 **Settings** | **Languages & Frameworks** | **Kotlin** 中，勾選 **Enable K2 mode**。

</td>
</tr>
<tr>
<td>

**0.8.4**

發佈日期：2024 年 12 月 6 日

</td>
<td>

*   支援 Kotlin 的 [K2 mode](https://kotlinlang.org/docs/k2-compiler-migration-guide.html#support-in-ides)，以提高穩定性和程式碼分析。

</td>
<td>

[任何 Kotlin 外掛程式版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.8.3**

發佈日期：2024 年 7 月 23 日

</td>
<td>

*   修正 Xcode 相容性問題。

</td>
<td>

[任何 Kotlin 外掛程式版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.8.2**

發佈日期：2024 年 5 月 16 日

</td>
<td>

*   支援 Android Studio Jellyfish 和新的 Canary 版本 Koala。
*   在共享模組中新增了 `sourceCompatibility` 和 `targetCompatibility` 的宣告。

</td>
<td>

[任何 Kotlin 外掛程式版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.8.1**

發佈日期：2023 年 11 月 9 日

</td>
<td>

*   將 Kotlin 更新至 1.9.20。
*   將 Jetpack Compose 更新至 1.5.4。
*   預設啟用 Gradle 建構和配置快取。
*   為新 Kotlin 版本重構了建構設定。
*   iOS 框架現在預設為靜態。
*   修正使用 Xcode 15 在 iOS 裝置上執行的問題。

</td>
<td>

[任何 Kotlin 外掛程式版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.8.0**

發佈日期：2023 年 10 月 5 日

</td>
<td>

*   [KT-60169](https://youtrack.jetbrains.com/issue/KT-60169) 遷移至 Gradle 版本目錄。
*   [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) 將 `android` 重新命名為 `androidTarget`。
*   [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) 更新了 Kotlin 和依賴項版本。
*   [KTIJ-26773](https://youtrack.jetbrains.com/issue/KTIJ-26773) 重構為使用 `-destination` 參數，而非 `-sdk` 和 `-arch`。
*   [KTIJ-25839](https://youtrack.jetbrains.com/issue/KTIJ-25839) 重構了產生的檔案名稱。
*   [KTIJ-27058](https://youtrack.jetbrains.com/issue/KTIJ-27058) 新增了 JVM 目標設定。
*   [KTIJ-27160](https://youtrack.jetbrains.com/issue/KTIJ-27160) 支援 Xcode 15.0。
*   [KTIJ-27158](https://youtrack.jetbrains.com/issue/KTIJ-27158) 將新模組精靈移至實驗性狀態。

</td>
<td>

[任何 Kotlin 外掛程式版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.6.0**

發佈日期：2023 年 5 月 24 日

</td>
<td>

*   支援新的 Canary 版 Android Studio Hedgehog。
*   更新了 Multiplatform 專案中的 Kotlin、Gradle 和函式庫版本。
*   在 Multiplatform 專案中套用了新的 [`targetHierarchy.default()`](https://kotlinlang.org/docs/whatsnew1820.html#new-approach-to-source-set-hierarchy)。
*   在 Multiplatform 專案中將來源集名稱後綴套用到特定平台的檔案。

</td>
<td>

[任何 Kotlin 外掛程式版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.5.3**

發佈日期：2023 年 4 月 12 日

</td>
<td>

*   更新了 Kotlin 和 Compose 版本。
*   修正了 Xcode 專案方案解析問題。
*   新增了方案產品類型檢查。
*   如果存在 `iosApp` 方案，現在預設選中該方案。

</td>
<td>

[任何 Kotlin 外掛程式版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.5.2**

發佈日期：2023 年 1 月 30 日

</td>
<td>

*   [修正了 Kotlin/Native 偵錯器問題（Spotlight 索引緩慢）](https://youtrack.jetbrains.com/issue/KT-55988)。
*   [修正了多模組專案中的 Kotlin/Native 偵錯器](https://youtrack.jetbrains.com/issue/KT-24450)。
*   [適用於 Android Studio Giraffe 2022.3.1 Canary 的新建構版本](https://youtrack.jetbrains.com/issue/KT-55274)。
*   [為 iOS 應用程式建構新增了佈建旗標](https://youtrack.jetbrains.com/issue/KT-55204)。
*   [將繼承的路徑新增至產生之 iOS 專案中的 **Framework Search Paths** 選項](https://youtrack.jetbrains.com/issue/KT-55402)。

</td>
<td>

[任何 Kotlin 外掛程式版本](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.5.1**

發佈日期：2022 年 11 月 30 日

</td>
<td>

*   [修正新專案生成問題：刪除多餘的 "app" 目錄](https://youtrack.jetbrains.com/issue/KTIJ-23790)。

</td>
<td>

[Kotlin 1.7.0—*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.5.0**

發佈日期：2022 年 11 月 22 日

</td>
<td>

*   [變更了 iOS 框架分發的預設選項：現在為 **Regular framework**](https://youtrack.jetbrains.com/issue/KT-54086)。
*   [將 `MyApplicationTheme` 移至產生之 Android 專案中的單獨檔案](https://youtrack.jetbrains.com/issue/KT-53991)。
*   [更新了產生的 Android 專案](https://youtrack.jetbrains.com/issue/KT-54658)。
*   [修正了新專案目錄意外刪除的問題](https://youtrack.jetbrains.com/issue/KTIJ-23707)。

</td>
<td>

[Kotlin 1.7.0—*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.3.4**

發佈日期：2022 年 9 月 12 日

</td>
<td>

*   [將 Android 應用程式遷移至 Jetpack Compose](https://youtrack.jetbrains.com/issue/KT-53162)。
*   [移除了過時的 HMPP 旗標](https://youtrack.jetbrains.com/issue/KT-52248)。
*   [從 Android 資訊清單中移除了套件名稱](https://youtrack.jetbrains.com/issue/KTIJ-22633)。
*   [更新了 Xcode 專案的 `.gitignore`](https://youtrack.jetbrains.com/issue/KT-53703)。
*   [更新了精靈專案以更好地說明 expect/actual](https://youtrack.jetbrains.com/issue/KT-53928)。
*   [更新了與 Android Studio Canary 建構版本的相容性](https://youtrack.jetbrains.com/issue/KTIJ-22063)。
*   [將 Android 應用程式的最低 Android SDK 更新至 21](https://youtrack.jetbrains.com/issue/KTIJ-22505)。
*   [修正了安裝 Xcode 後首次啟動的問題](https://youtrack.jetbrains.com/issue/KTIJ-22645)。
*   [修正了 M1 上 Apple 執行設定的問題](https://youtrack.jetbrains.com/issue/KTIJ-21781)。
*   [修正了 Windows 作業系統上 `local.properties` 的問題](https://youtrack.jetbrains.com/issue/KTIJ-22037)。
*   [修正了 Android Studio Canary 建構版本上 Kotlin/Native 偵錯器的問題](https://youtrack.jetbrains.com/issue/KT-53976)。

</td>
<td>

[Kotlin 1.7.0—1.7.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.3.3**

發佈日期：2022 年 6 月 9 日

</td>
<td>

*   更新了對 Kotlin IDE 外掛程式 1.7.0 的依賴。

</td>
<td>

[Kotlin 1.7.0—1.7.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.3.2**

發佈日期：2022 年 4 月 4 日

</td>
<td>

*   修正了 Android Studio 2021.2 和 2021.3 上 iOS 應用程式偵錯的效能問題。

</td>
<td>

[Kotlin 1.5.0—1.6.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.3.1**

發佈日期：2022 年 2 月 15 日

</td>
<td>

*   [在 Kotlin Multiplatform Mobile 精靈中啟用 M1 iOS 模擬器](https://youtrack.jetbrains.com/issue/KT-51105)。
*   改善 XcProjects 索引的效能：[KT-49777](https://youtrack.jetbrains.com/issue/KT-49777)、[KT-50779](https://youtrack.jetbrains.com/issue/KT-50779)。
*   建構腳本清理：使用 `kotlin("test")` 取代 `kotlin("test-common")` 和 `kotlin("test-annotations-common")`。
*   提高與 [Kotlin 外掛程式版本](https://youtrack.jetbrains.com/issue/KTIJ-20167) 的相容性範圍。
*   [修正了 Windows 主機上 JVM 偵錯的問題](https://youtrack.jetbrains.com/issue/KT-50699)。
*   [修正了停用外掛程式後版本無效的問題](https://youtrack.jetbrains.com/issue/KT-50966)。

</td>
<td>

[Kotlin 1.5.0—1.6.*](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.3.0**

發佈日期：2021 年 11 月 16 日

</td>
<td>

*   [新 Kotlin Multiplatform 函式庫精靈](https://youtrack.jetbrains.com/issue/KTIJ-19367)。
*   支援新型 Kotlin Multiplatform 函式庫分發：[XCFramework](multiplatform-build-native-binaries.md#build-xcframeworks)。
*   為新的跨平台行動專案啟用 [階層式專案結構](multiplatform-hierarchy.md#manual-configuration)。
*   支援 [明確的 iOS 目標宣告](https://youtrack.jetbrains.com/issue/KT-46861)。
*   [在非 Mac 機器上啟用 Kotlin Multiplatform Mobile 外掛程式精靈](https://youtrack.jetbrains.com/issue/KT-48614)。
*   [支援 Kotlin Multiplatform 模組精靈中的子資料夾](https://youtrack.jetbrains.com/issue/KT-47923)。
*   [支援 Xcode `Assets.xcassets` 檔案](https://youtrack.jetbrains.com/issue/KT-49571)。
*   [修正了外掛程式類別載入器異常](https://youtrack.jetbrains.com/issue/KT-48103)。
*   更新了 CocoaPods Gradle 外掛程式模板。
*   Kotlin/Native 偵錯器類型評估改進。
*   修正使用 Xcode 13 啟動 iOS 裝置的問題。

</td>
<td>

[Kotlin 1.6.0](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.2.7**

發佈日期：2021 年 8 月 2 日

</td>
<td>

*   [為 AppleRunConfiguration 新增了 Xcode 設定選項](https://youtrack.jetbrains.com/issue/KTIJ-19054)。
*   [新增了對 Apple M1 模擬器的支援](https://youtrack.jetbrains.com/issue/KT-47618)。
*   [在專案精靈中新增了關於 Xcode 整合選項的資訊](https://youtrack.jetbrains.com/issue/KT-47466)。
*   [在生成包含 CocoaPods 的專案後，如果 CocoaPods gem 未安裝，則新增了錯誤通知](https://youtrack.jetbrains.com/issue/KT-47329)。
*   [在 Kotlin 1.5.30 產生的共享模組中新增了對 Apple M1 模擬器目標的支援](https://youtrack.jetbrains.com/issue/KT-47631)。
*   [使用 Kotlin 1.5.20 清理了產生的 Xcode 專案](https://youtrack.jetbrains.com/issue/KT-47465)。
*   修正了真實 iOS 裝置上 Xcode Release 設定的啟動問題。
*   修正了使用 Xcode 12.5 啟動模擬器的問題。

</td>
<td>

[Kotlin 1.5.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.2.6**

發佈日期：2021 年 6 月 10 日

</td>
<td>

*   與 Android Studio Bumblebee Canary 1 的相容性。
*   支援 [Kotlin 1.5.20](https://kotlinlang.org/docs/whatsnew1520.html)：在專案精靈中使用新的 Kotlin/Native 框架打包任務。

</td>
<td>

[Kotlin 1.5.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.2.5**

發佈日期：2021 年 5 月 25 日

</td>
<td>

*   [修正與 Android Studio Arctic Fox 2020.3.1 Beta 1 及更高版本的相容性](https://youtrack.jetbrains.com/issue/KT-46834)。

</td>
<td>

[Kotlin 1.5.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.2.4**

發佈日期：2021 年 5 月 5 日

</td>
<td>

請將此版本的外掛程式與 Android Studio 4.2 或 Android Studio 2020.3.1 Canary 8 或更高版本搭配使用。
*   與 [Kotlin 1.5.0](https://kotlinlang.org/docs/whatsnew15.html) 的相容性。
*   [在 Kotlin Multiplatform 模組中使用 CocoaPods 依賴管理器進行 iOS 整合的功能](https://youtrack.jetbrains.com/issue/KT-45946)。

</td>
<td>

[Kotlin 1.5.0](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.2.3**

發佈日期：2021 年 4 月 5 日

</td>
<td>

*   [專案精靈：模組命名方面的改進](https://youtrack.jetbrains.com/issues?q=issue%20id:%20KT-43449,%20KT-44060,%20KT-41520,%20KT-45282)。
*   [在專案精靈中使用 CocoaPods 依賴管理器進行 iOS 整合的功能](https://youtrack.jetbrains.com/issue/KT-45478)。
*   [新專案中 gradle.properties 的可讀性更好](https://youtrack.jetbrains.com/issue/KT-42908)。
*   [如果未勾選「為共享模組新增範例測試」，則不再產生範例測試](https://youtrack.jetbrains.com/issue/KT-43441)。
*   [修正及其他改進](https://youtrack.jetbrains.com/issues?q=Subsystems:%20%7BKMM%20Plugin%7D%20Type:%20Feature,%20Bug%20State:%20-Obsolete,%20-%7BAs%20designed%7D,%20-Answered,%20-Incomplete%20resolved%20date:%202021-03-10%20..%202021-03-25)。

</td>
<td>

[Kotlin 1.4.30](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.2.2**

發佈日期：2021 年 3 月 3 日

</td>
<td>

*   [在 Xcode 中開啟 Xcode 相關檔案的功能](https://youtrack.jetbrains.com/issue/KT-44970)。
*   [在 iOS 執行設定中設定 Xcode 專案檔位置的功能](https://youtrack.jetbrains.com/issue/KT-44968)。
*   [支援 Android Studio 2020.3.1 Canary 8](https://youtrack.jetbrains.com/issue/KT-45162)。
*   [修正及其他改進](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.2%20)。

</td>
<td>

[Kotlin 1.4.30](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.2.1**

發佈日期：2021 年 2 月 15 日

</td>
<td>

請將此版本的外掛程式與 Android Studio 4.2 搭配使用。
*   基礎設施改進。
*   [修正及其他改進](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.1%20)。

</td>
<td>

[Kotlin 1.4.30](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.2.0**

發佈日期：2020 年 11 月 23 日

</td>
<td>

*   [支援 iPad 裝置](https://youtrack.jetbrains.com/issue/KT-41932)。
*   [支援 Xcode 中設定的自訂方案名稱](https://youtrack.jetbrains.com/issue/KT-41677)。
*   [為 iOS 執行設定新增自訂建構步驟的功能](https://youtrack.jetbrains.com/issue/KT-41678)。
*   [偵錯自訂 Kotlin/Native 二進位檔的功能](https://youtrack.jetbrains.com/issue/KT-40954)。
*   [簡化 Kotlin Multiplatform Mobile 精靈產生的程式碼](https://youtrack.jetbrains.com/issue/KT-41712)。
*   [移除了對 Kotlin Android Extensions 外掛程式的支援](https://youtrack.jetbrains.com/issue/KT-42121)，該外掛程式在 Kotlin 1.4.20 中已棄用。
*   [修正從主機斷開連接後實體裝置設定無法儲存的問題](https://youtrack.jetbrains.com/issue/KT-42390)。
*   其他修正和改進。

</td>
<td>

[Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.1.3**

發佈日期：2020 年 10 月 2 日

</td>
<td>

*   新增了對 iOS 14 和 Xcode 12 的相容性。
*   修正了 Kotlin Multiplatform Mobile 精靈建立的平台測試中的命名問題。

</td>
<td>

*   [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)
*   [Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.1.2**

發佈日期：2020 年 9 月 29 日

</td>
<td>

*   修正了與 [Kotlin 1.4.20-M1](https://kotlinlang.org/docs/eap.html#build-details) 的相容性。
*   預設啟用向 JetBrains 報告錯誤。

</td>
<td>

*   [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)
*   [Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

<tr>
<td>

**0.1.1**

發佈日期：2020 年 9 月 10 日

</td>
<td>

*   修正了與 Android Studio Canary 8 及更高版本的相容性。

</td>
<td>

*   [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)
*   [Kotlin 1.4.20](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>
<tr>
<td>

**0.1.0**

發佈日期：2020 年 8 月 31 日

</td>
<td>

*   Kotlin Multiplatform Mobile 外掛程式的第一個版本。在[部落格文章](https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/)中了解更多資訊。

</td>
<td>

*   [Kotlin 1.4.0](https://kotlinlang.org/docs/releases.html#release-details)
*   [Kotlin 1.4.10](https://kotlinlang.org/docs/releases.html#release-details)

</td>
</tr>

</table>