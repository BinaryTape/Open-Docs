---
title: "Kotlin Multiplatform 外掛程式發佈"
---
請確保您已安裝最新版本的 [Kotlin Multiplatform plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)，以便在 Android Studio 中繼續使用 Kotlin Multiplatform 專案。

## 更新至新版本

Android Studio 會在新版 Kotlin Multiplatform plugin 發佈時立即建議您更新。 如果您接受建議，它會自動將 plugin 更新到最新版本。 您需要重新啟動 Android Studio 才能完成 plugin 安裝。

您可以檢查 plugin 版本，並在 **Settings/Preferences** | **Plugins** 中手動更新。

您需要與 plugin 相容的 Kotlin 版本才能正常運作。 您可以在[版本詳細資訊](#release-details)中找到相容的版本。
您可以檢查您的 Kotlin 版本，並在 **Settings/Preferences** | **Plugins** 或 **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates** 中更新。

:::note
如果您未安裝相容的 Kotlin 版本，Kotlin Multiplatform plugin 將會停用。 您需要更新您的 Kotlin
版本，然後在 **Settings/Preferences** | **Plugins** 中啟用 plugin。

:::

## 版本詳細資訊

下表列出了最新 Kotlin Multiplatform plugin 版本的詳細資訊：
<table>
<tr>
<th>
版本資訊
</th>
<th>
版本重點
</th>
<th>
相容的 Kotlin 版本
</th>
</tr>
<tr>
<td>

**0.8.4**

發佈日期：2024 年 12 月 6 日
</td>
<td>

* 支援 Kotlin 的 [K2 模式](k2-compiler-migration-guide#support-in-ides)，以提高穩定性和程式碼分析能力。
</td>
<td>

* [任何 Kotlin plugin 版本](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.8.3**

發佈日期：2024 年 7 月 23 日
</td>
<td>

* 修正了 Xcode 相容性問題。
</td>
<td>

* [任何 Kotlin plugin 版本](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.8.2**

發佈日期：2024 年 5 月 16 日
</td>
<td>

* 支援 Android Studio Jellyfish 和新的 Canary 版本 Koala。
* 在共享模組中新增了 `sourceCompatibility` 和 `targetCompatibility` 的宣告。
</td>
<td>

* [任何 Kotlin plugin 版本](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.8.1**

發佈日期：2023 年 11 月 9 日
</td>
<td>

* 更新 Kotlin 至 1.9.20。
* 更新 Jetpack Compose 至 1.5.4。
* 預設啟用 Gradle 建置和配置快取。
* 為新的 Kotlin 版本重構了建置配置。
* iOS framework 現在預設為靜態。
* 修正了在 Xcode 15 上於 iOS 裝置上執行的問題。
</td>
<td>

* [任何 Kotlin plugin 版本](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.8.0**

發佈日期：2023 年 10 月 5 日
</td>
<td>

* [KT-60169](https://youtrack.jetbrains.com/issue/KT-60169) 遷移到 Gradle version catalog。
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) 將 `android` 重新命名為 `androidTarget`。
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) 更新 Kotlin 和依賴版本。
* [KTIJ-26773](https://youtrack.jetbrains.com/issue/KTIJ-26773) 重構為使用 `-destination` 參數而不是 `-sdk` 和 `-arch`。
* [KTIJ-25839](https://youtrack.jetbrains.com/issue/KTIJ-25839) 重構了產生的檔案名稱。
* [KTIJ-27058](https://youtrack.jetbrains.com/issue/KTIJ-27058) 新增了 JVM 目標配置。
* [KTIJ-27160](https://youtrack.jetbrains.com/issue/KTIJ-27160) 支援 Xcode 15.0。
* [KTIJ-27158](https://youtrack.jetbrains.com/issue/KTIJ-27158) 將新的模組精靈移至實驗狀態。
</td>
<td>

* [任何 Kotlin plugin 版本](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.6.0**

發佈日期：2023 年 5 月 24 日
</td>
<td>

* 支援新的 Canary Android Studio Hedgehog。
* 更新了 Multiplatform 專案中 Kotlin、Gradle 和函式庫的版本。
* 在 Multiplatform 專案中套用了新的 [`targetHierarchy.default()`](whatsnew1820#new-approach-to-source-set-hierarchy)。
* 在 Multiplatform 專案中，將原始碼集名稱後綴套用於平台特定的檔案。
</td>
<td>

* [任何 Kotlin plugin 版本](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.5.3**

發佈日期：2023 年 4 月 12 日
</td>
<td>

* 更新了 Kotlin 和 Compose 版本。
* 修正了 Xcode 專案配置解析。
* 新增了配置產品類型檢查。
* 如果存在 `iosApp` 配置，則現在預設會選取。
</td>
<td>

* [任何 Kotlin plugin 版本](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.5.2**

發佈日期：2023 年 1 月 30 日
</td>
<td>

* [修正了 Kotlin/Native 偵錯工具的問題（Spotlight 索引速度緩慢）](https://youtrack.jetbrains.com/issue/KT-55988)。
* [修正了多模組專案中的 Kotlin/Native 偵錯工具](https://youtrack.jetbrains.com/issue/KT-24450)。
* [Android Studio Giraffe 2022.3.1 Canary 的新版本](https://youtrack.jetbrains.com/issue/KT-55274)。
* [為 iOS 應用程式建置新增了 Provisioning 標誌](https://youtrack.jetbrains.com/issue/KT-55204)。
* [在產生的 iOS 專案中，將繼承的路徑新增至 **Framework Search Paths** 選項](https://youtrack.jetbrains.com/issue/KT-55402)。
</td>
<td>

* [任何 Kotlin plugin 版本](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.5.1**

發佈日期：2022 年 11 月 30 日
</td>
<td>

* [修正了新專案產生：刪除多餘的 "app" 目錄](https://youtrack.jetbrains.com/issue/KTIJ-23790)。
</td>
<td>

* [Kotlin 1.7.0—*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.5.0**

發佈日期：2022 年 11 月 22 日
</td>
<td>

* [變更了 iOS framework 發佈的預設選項：現在是 **Regular framework**](https://youtrack.jetbrains.com/issue/KT-54086)。
* [在產生的 Android 專案中，將 `MyApplicationTheme` 移至單獨的檔案](https://youtrack.jetbrains.com/issue/KT-53991)。
* [更新了產生的 Android 專案](https://youtrack.jetbrains.com/issue/KT-54658)。
* [修正了意外清除新專案目錄的問題](https://youtrack.jetbrains.com/issue/KTIJ-23707)。
</td>
<td>

* [Kotlin 1.7.0—*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.4**

發佈日期：2022 年 9 月 12 日
</td>
<td>

* [將 Android 應用程式遷移至 Jetpack Compose](https://youtrack.jetbrains.com/issue/KT-53162)。
* [移除了過時的 HMPP 標誌](https://youtrack.jetbrains.com/issue/KT-52248)。
* [從 Android 資訊清單中移除了套件名稱](https://youtrack.jetbrains.com/issue/KTIJ-22633)。
* [更新了 Xcode 專案的 `.gitignore`](https://youtrack.jetbrains.com/issue/KT-53703)。
* [更新了精靈專案，以更好地說明 expect/actual](https://youtrack.jetbrains.com/issue/KT-53928)。
* [更新了與 Android Studio 的 Canary 版本的相容性](https://youtrack.jetbrains.com/issue/KTIJ-22063)。
* [將 Android 應用程式的最低 Android SDK 更新至 21](https://youtrack.jetbrains.com/issue/KTIJ-22505)。
* [修正了安裝 Xcode 後首次啟動的問題](https://youtrack.jetbrains.com/issue/KTIJ-22645)。
* [修正了 M1 上 Apple 執行配置的問題](https://youtrack.jetbrains.com/issue/KTIJ-21781)。
* [修正了 Windows OS 上 `local.properties` 的問題](https://youtrack.jetbrains.com/issue/KTIJ-22037)。
* [修正了 Android Studio 的 Canary 版本上 Kotlin/Native 偵錯工具的問題](https://youtrack.jetbrains.com/issue/KT-53976)。
</td>
<td>

* [Kotlin 1.7.0—1.7.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.3**

發佈日期：2022 年 6 月 9 日
</td>
<td>

* 更新了 Kotlin IDE plugin 1.7.0 的依賴關係。
</td>
<td>

* [Kotlin 1.7.0—1.7.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.2**

發佈日期：2022 年 4 月 4 日
</td>
<td>

* 修正了在 Android Studio 2021.2 和 2021.3 上 iOS 應用程式偵錯的效能問題。
</td>
<td>

* [Kotlin 1.5.0—1.6.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.1**

發佈日期：2022 年 2 月 15 日
</td>
<td>

* [在 Kotlin Multiplatform Mobile 精靈中啟用了 M1 iOS 模擬器](https://youtrack.jetbrains.com/issue/KT-51105)。
* 提高了索引 XcProject 的效能：[KT-49777](https://youtrack.jetbrains.com/issue/KT-49777), [KT-50779](https://youtrack.jetbrains.com/issue/KT-50779)。
* 清理建置腳本：使用 `kotlin("test")` 而不是 `kotlin("test-common")` 和 `kotlin("test-annotations-common")`。
* 增加了與 [Kotlin plugin 版本](https://youtrack.jetbrains.com/issue/KTIJ-20167) 的相容性範圍。
* [修正了 Windows 主機上 JVM 偵錯的問題](https://youtrack.jetbrains.com/issue/KT-50699)。
* [修正了停用 plugin 後版本無效的問題](https://youtrack.jetbrains.com/issue/KT-50966)。
</td>
<td>

* [Kotlin 1.5.0—1.6.*](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.3.0**

發佈日期：2021 年 11 月 16 日
</td>
<td>

* [新的 Kotlin Multiplatform Library 精靈](https://youtrack.jetbrains.com/issue/KTIJ-19367)。
* 支援新型 Kotlin Multiplatform 函式庫發佈：[XCFramework](multiplatform-build-native-binaries#build-xcframeworks)。
* 為新的跨平台行動專案啟用[階層式專案結構](multiplatform-hierarchy#manual-configuration)。
* 支援[明確的 iOS 目標宣告](https://youtrack.jetbrains.com/issue/KT-46861)。
* [在非 Mac 機器上啟用了 Kotlin Multiplatform Mobile plugin 精靈](https://youtrack.jetbrains.com/issue/KT-48614)。
* [支援 Kotlin Multiplatform 模組精靈中的子資料夾](https://youtrack.jetbrains.com/issue/KT-47923)。
* [支援 Xcode `Assets.xcassets` 檔案](https://youtrack.jetbrains.com/issue/KT-49571)。
* [修正了 plugin 類別載入器異常](https://youtrack.jetbrains.com/issue/KT-48103)。
* 更新了 CocoaPods Gradle Plugin 範本。
* Kotlin/Native 偵錯工具類型評估改進。
* 修正了使用 Xcode 13 啟動 iOS 裝置的問題。
</td>
<td>

* [Kotlin 1.6.0](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.7**

發佈日期：2021 年 8 月 2 日
</td>
<td>

* [為 AppleRunConfiguration 新增了 Xcode 配置選項](https://youtrack.jetbrains.com/issue/KTIJ-19054)。
* [新增了對 Apple M1 模擬器的支援](https://youtrack.jetbrains.com/issue/KT-47618)。
* [在專案精靈中新增了有關 Xcode 整合選項的資訊](https://youtrack.jetbrains.com/issue/KT-47466)。
* [新增了在產生包含 CocoaPods 的專案後，但尚未安裝 CocoaPods gem 時的錯誤通知](https://youtrack.jetbrains.com/issue/KT-47329)。
* [在產生的共享模組中，使用 Kotlin 1.5.30 新增了對 Apple M1 模擬器目標的支援](https://youtrack.jetbrains.com/issue/KT-47631)。
* [使用 Kotlin 1.5.20 清除了產生的 Xcode 專案](https://youtrack.jetbrains.com/issue/KT-47465)。
* 修正了在實際 iOS 裝置上啟動 Xcode Release 配置的問題。
* 修正了使用 Xcode 12.5 啟動模擬器的問題。
</td>
<td>

* [Kotlin 1.5.10](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.6**

發佈日期：2021 年 6 月 10 日
</td>
<td>

* 與 Android Studio Bumblebee Canary 1 相容。
* 支援 [Kotlin 1.5.20](whatsnew1520)：在專案精靈中，將新的 framework-packing 任務用於 Kotlin/Native。
</td>
<td>

* [Kotlin 1.5.10](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.5**

發佈日期：2021 年 5 月 25 日
</td>
<td>

* [修正了與 Android Studio Arctic Fox 2020.3.1 Beta 1 及更高版本的相容性](https://youtrack.jetbrains.com/issue/KT-46834)。
</td>
<td>

* [Kotlin 1.5.10](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.4**

發佈日期：2021 年 5 月 5 日
</td>
<td>

將此版本的 plugin 與 Android Studio 4.2 或 Android Studio 2020.3.1 Canary 8 或更高版本搭配使用。
* 與 [Kotlin 1.5.0](whatsnew15) 相容。
* [能夠在 Kotlin Multiplatform 模組中使用 CocoaPods 依賴管理器進行 iOS 整合](https://youtrack.jetbrains.com/issue/KT-45946)。
</td>
<td>

* [Kotlin 1.5.0](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.3**

發佈日期：2021 年 4 月 5 日
</td>
<td>

* [專案精靈：改進了模組命名](https://youtrack.jetbrains.com/issues?q=issue%20id:%20KT-43449,%20KT-44060,%20KT-41520,%20KT-45282)。
* [能夠在專案精靈中使用 CocoaPods 依賴管理器進行 iOS 整合](https://youtrack.jetbrains.com/issue/KT-45478)。
* [提高了新專案中 gradle.properties 的可讀性](https://youtrack.jetbrains.com/issue/KT-42908)。
* [如果未勾選 "Add sample tests for Shared Module"，則不再產生範例測試](https://youtrack.jetbrains.com/issue/KT-43441)。
* [修正和其他改進](https://youtrack.jetbrains.com/issues?q=Subsystems:%20%7BKMM%20Plugin%7D%20Type:%20Feature,%20Bug%20State:%20-Obsolete,%20-%7BAs%20designed%7D,%20-Answered,%20-Incomplete%20resolved%20date:%202021-03-10%20..%202021-03-25)。
</td>
<td>

* [Kotlin 1.4.30](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.2**

發佈日期：2021 年 3 月 3 日
</td>
<td>

* [能夠在 Xcode 中開啟與 Xcode 相關的檔案](https://youtrack.jetbrains.com/issue/KT-44970)。
* [能夠在 iOS 執行配置中設定 Xcode 專案檔案的位置](https://youtrack.jetbrains.com/issue/KT-44968)。
* [支援 Android Studio 2020.3.1 Canary 8](https://youtrack.jetbrains.com/issue/KT-45162)。
* [修正和其他改進](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.2%20)。
</td>
<td>

* [Kotlin 1.4.30](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.1**

發佈日期：2021 年 2 月 15 日
</td>
<td>

將此版本的 plugin 與 Android Studio 4.2 搭配使用。
* 基礎架構改進。
* [修正和其他改進](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.1%20)。
</td>
<td>

* [Kotlin 1.4.30](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.2.0**

發佈日期：2020 年 11 月 23 日
</td>
<td>

* [支援 iPad 裝置](https://youtrack.jetbrains.com/issue/KT-41932)。
* [支援在 Xcode 中配置的自訂配置名稱](https://youtrack.jetbrains.com/issue/KT-41677)。
* [能夠為 iOS 執行配置新增自訂建置步驟](https://youtrack.jetbrains.com/issue/KT-41678)。
* [能夠偵錯自訂 Kotlin/Native 二進制檔案](https://youtrack.jetbrains.com/issue/KT-40954)。
* [簡化了 Kotlin Multiplatform Mobile Wizards 產生的程式碼](https://youtrack.jetbrains.com/issue/KT-41712)。
* [移除了對 Kotlin Android Extensions plugin 的支援](https://youtrack.jetbrains.com/issue/KT-42121)，該 plugin 在 Kotlin 1.4.20 中已棄用。
* [修正了從主機斷開連線後，儲存實體裝置配置的問題](https://youtrack.jetbrains.com/issue/KT-42390)。
* 其他修正和改進。
</td>
<td>

* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.3**

發佈日期：2020 年 10 月 2 日
</td>
<td>

* 新增了與 iOS 14 和 Xcode 12 的相容性。
* 修正了 Kotlin Multiplatform Mobile Wizard 建立的平台測試中的命名。
</td>
<td>

* [Kotlin 1.4.10](releases#release-details)
* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.2**

發佈日期：2020 年 9 月 29 日
</td>
<td>

* 修正了與 [Kotlin 1.4.20-M1](eap#build-details) 的相容性。
* 預設啟用向 JetBrains 報告錯誤。
</td>
<td>

* [Kotlin 1.4.10](releases#release-details)
* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.1**

發佈日期：2020 年 9 月 10 日
</td>
<td>

* 修正了與 Android Studio Canary 8 及更高版本的相容性。
</td>
<td>

* [Kotlin 1.4.10](releases#release-details)
* [Kotlin 1.4.20](releases#release-details)
</td>
</tr>
<tr>
<td>

**0.1.0**

發佈日期：2020 年 8 月 31 日
</td>
<td>

* Kotlin Multiplatform Mobile plugin 的第一個版本。 在[部落格文章](https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/)中了解更多資訊。
</td>
<td>

* [Kotlin 1.4.0](releases#release-details)
* [Kotlin 1.4.10](releases#release-details)
</td>
</tr>
</table>