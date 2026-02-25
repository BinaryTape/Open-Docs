[//]: # (title: 不同平台上的預設 UI 行為)

Compose Multiplatform 旨在協助您開發在不同平台上行為盡可能一致的應用程式。
在本頁面中，您可以了解在使用 Compose Multiplatform 為不同平台編寫共享 UI 程式碼時，
可能會遇到的不可避免的差異或暫時性的權衡。

## 專案結構

不論您的目標平台為何，每個平台都需要一個專屬的入口點：

* 對於 Android，是 `Activity`，其職責是顯示來自通用程式碼的主要可組合項。
* 對於 iOS 應用程式，是初始化應用程式的 `@main` 類別或結構。
* 對於 JVM 應用程式，是啟動應用程式並執行主要通用可組合項的 `main()` 函式。
* 對於 Kotlin/JS 或 Kotlin/Wasm 應用程式，是將主要通用程式碼可組合項附加到網頁的 `main()` 函式。

您的應用程式可能需要某些尚未支援多平台的平台特定 API，
對此您必須在平台特定的原始碼集中實作這些 API 的呼叫。
在實作之前，請查看 [klibs.io](https://klibs.io/)，這是一個 JetBrains 專案，旨在全面編目所有可用的 Kotlin Multiplatform 程式庫。
目前已有可用於網路程式碼、資料庫、協同程式 (coroutine) 等功能的程式庫。

## 輸入方法

### 軟體鍵盤

每個平台處理軟體鍵盤的方式可能略有不同，包括當文字欄位變為活動狀態時鍵盤出現的方式。

Compose Multiplatform 採用了 [Compose 視窗內縮 (window insets) 做法](https://developer.android.com/develop/ui/compose/system/insets)
並在 iOS 上模擬此行為，以考慮到 [安全區域 (safe areas)](https://developer.apple.com/documentation/UIKit/positioning-content-relative-to-the-safe-area)。
根據您的實作方式，軟體鍵盤在 iOS 上的位置可能稍有不同。
請務必檢查鍵盤在兩個平台上都不會遮擋重要的 UI 元素。

### 觸控與滑鼠支援

目前的桌面版實作將所有指標 (pointer) 操作解釋為滑鼠手勢，
因此不支援多點觸控手勢。
例如，通用的捏合縮放 (pinch-to-zoom) 手勢無法在 Compose Multiplatform 桌面版中實作，
因為它需要同時處理兩個觸控點。

## UI 行為與外觀

### 平台特定功能

Compose Multiplatform 並未涵蓋某些通用的 UI 元素，且無法使用該框架進行自訂。
因此，您可以預期它們在不同平台上看起來會有所不同。

原生快顯視圖 (pop-up view) 就是一個例子：
當您在 Compose Multiplatform 文字欄位中選取文字時，預設建議的操作（如 **複製** 或 **翻譯**）
會依據應用程式執行的平台而有所不同。

### 滾動物理特性

對於 Android 和 iOS，滾動感會與平台保持一致。
對於桌面版，滾動支援僅限於滑鼠輪（如 [觸控與滑鼠支援](#touch-and-mouse-support) 中所述）。

### 互通視圖 (Interop views)

如果您想在通用可組合項中嵌入原生視圖，或反之亦然，
您需要熟悉 Compose Multiplatform 支援的平台特定機制。

對於 iOS，有分別針對 [SwiftUI](compose-swiftui-integration.md) 與 [UIKit](compose-uikit-integration.md) 互通程式碼的指南。

對於桌面版，Compose Multiplatform 支援 [Swing 互通性](compose-desktop-swing-interoperability.md)。

### 返回手勢

Android 裝置預設支援返回手勢，且每個畫面都會以某種方式對 **返回** 按鈕做出反應。

在 iOS 上，預設沒有返回手勢，儘管建議開發者實作類似功能以符合使用者體驗預期。
Compose Multiplatform 為 iOS 預設支援返回手勢，以模擬 Android 的功能。

在桌面版上，Compose Multiplatform 使用 **Esc** 鍵作為預設的返回觸發器。

如需詳細資訊，請參閱 [返回手勢](compose-navigation.md#back-gesture) 章節。

### 文字

在文字方面，Compose Multiplatform 不保證不同平台之間具有像素級完美的對應：

* 如果您未明確設定字型，每個系統都會為您的文字分配不同的預設字型。
* 即使是相同的字型，各平台特有的消除鋸齒 (aliasing) 機制也可能導致明顯的差異。

這對使用者體驗不會產生重大影響。相反地，預設字型在各平台上會以符合預期的方式呈現。
然而，像素差異可能會干擾例如螢幕截圖測試等作業。

<!-- this should be covered in benchmarking, not as a baseline Compose Multiplatform limitation 
### Initial performance

On iOS, you may notice a delay in the initial performance of individual screens compared to Android.
This can happen because Compose Multiplatform compiles UI shaders on demand.
So, if a particular shader is not cached yet, compiling it may delay rendering of a scene.

This issue affects only the first launch of each screen.
Once all necessary shaders are cached, subsequent launches are not delayed by compilation.
-->

## 開發人員體驗

### 預覽 (Previews)

*預覽 (Previews)* 是帶有 `@Preview` 註解的可組合項版面配置呈現，可以在 IntelliJ IDEA 和 Android Studio 中與共享 UI 程式碼併列呈現。

預覽需要特定的專案組態與明確的相依性。
請參閱 [Compose UI 預覽](compose-previews.md) 以了解如何在您的專案中啟用預覽。

### 熱重載 (Hot reload)

*熱重載 (Hot reload)* 指的是應用程式即時反映程式碼變更，而不需要額外的輸入。
在 Compose Multiplatform 中，熱重載功能僅適用於 JVM（桌面版）目標。
然而，您可以在切換到預期平台進行微調之前，使用它來快速進行疑難排解。

若要了解更多，請參閱我們的 [Compose 熱重載](compose-hot-reload.md) 文章。

## 後續步驟

閱讀更多關於以下組件在 Compose Multiplatform 中的實作：
  * [資源](compose-multiplatform-resources.md)
  * [生命週期](compose-lifecycle.md)
  * [通用 ViewModel](compose-viewmodel.md)
  * [導覽與路由](compose-navigation-routing.md)