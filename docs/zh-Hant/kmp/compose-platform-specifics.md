[//]: # (title: 不同平台上的預設 UI 行為)

Compose Multiplatform 旨在協助您在不同平台上，建立行為盡可能一致的應用程式。
在本頁面上，您將了解使用 Compose Multiplatform 為不同平台編寫共用 UI 程式碼時，應預期的不可避免差異或暫時性權衡。

## 專案結構

無論您鎖定哪個平台，每個平台都需要專用的進入點：

*   對於 Android，這是 `Activity`，其職責是從通用程式碼中顯示主要的可組合項。
*   對於 iOS 應用程式，這是初始化應用程式的 `@main` 類別或結構。
*   對於 JVM 應用程式，這是啟動應用程式並啟用主要通用可組合項的 `main()` 函數。
*   對於 Kotlin/JS 或 Kotlin/Wasm 應用程式，這是將主要通用程式碼可組合項附加到網頁上的 `main()` 函數。

您的應用程式所需的某些平台特定 API 可能不支援多平台，您將需要在平台特定原始碼集中實作呼叫這些 API。
在此之前，請查看 [klibs.io](https://klibs.io/)，這是一個 JetBrains 專案，旨在全面收錄所有可用的 Kotlin Multiplatform 函式庫。
目前已有可用於網路程式碼、資料庫、協程等函式庫。

## 輸入方法

### 軟體鍵盤

每個平台處理軟體鍵盤的方式可能略有不同，包括文字欄位啟用時鍵盤的出現方式。

Compose Multiplatform 採用 [Compose 視窗內嵌 (insets) 方法](https://developer.android.com/develop/ui/compose/system/insets)
並在 iOS 上模擬此方法，以考量 [安全區域](https://developer.apple.com/documentation/UIKit/positioning-content-relative-to-the-safe-area)。
根據您的實作，軟體鍵盤在 iOS 上的位置可能會略有不同。
請務必檢查鍵盤是否遮蓋了兩個平台上的重要 UI 元素。

### 觸控與滑鼠支援

目前的桌面實作將所有指標操作解讀為滑鼠手勢，因此不支援多點觸控手勢。
例如，由於需要同時處理兩次觸控，因此桌面版的 Compose Multiplatform 無法實作常見的雙指縮放手勢。

## UI 行為與外觀

### 平台特定功能

某些常見的 UI 元素不在 Compose Multiplatform 的範圍內，且無法使用該框架進行自訂。
因此，您應該預期它們在不同平台上的外觀會有所不同。

原生彈出式檢視就是一個例子：
當您在 Compose Multiplatform 文字欄位中選取文字時，預設的建議動作，例如 **複製** 或 **翻譯**，
將會是應用程式執行所在平台特有的。

### 滾動物理

對於 Android 和 iOS，滾動的手感與平台保持一致。
對於桌面，滾動支援僅限於滑鼠滾輪（如 [undefined](#touch-and-mouse-support) 中所述）。

### 互通檢視

如果您想在通用可組合項中嵌入原生檢視，反之亦然，
您將需要熟悉 Compose Multiplatform 支援的平台特定機制。

對於 iOS，有關於與 [SwiftUI](compose-swiftui-integration.md) 和 [UIKit](compose-uikit-integration.md) 互通 (interop) 程式碼的單獨指南。

對於桌面，Compose Multiplatform 支援 [Swing 互通性](compose-desktop-swing-interoperability.md)。

### 返回手勢

Android 裝置預設支援返回手勢，每個畫面都會以某種方式回應 **返回** 按鈕。

在 iOS 上，預設沒有返回手勢，儘管鼓勵開發人員實作類似功能以符合使用者體驗預期。
適用於 iOS 的 Compose Multiplatform 預設支援返回手勢，以模仿 Android 功能。

在桌面，Compose Multiplatform 使用 **Esc** 鍵作為預設的返回觸發器。

詳細資訊請參閱 [undefined](compose-navigation.md#back-gesture) 部分。

### 文字

在文字方面，Compose Multiplatform 不保證不同平台之間有像素級的精確對應關係：

*   如果您未明確設定字體，每個系統都會為您的文字指定不同的預設字體。
*   即使是相同的字體，每個平台特有的字型反鋸齒機制也可能導致明顯的差異。

這對使用者體驗沒有顯著影響。相反地，預設字體在每個平台上都按預期顯示。
然而，像素差異可能會干擾螢幕截圖測試等情況。

<!-- this should be covered in benchmarking, not as a baseline Compose Multiplatform limitation
### Initial performance

On iOS, you may notice a delay in the initial performance of individual screens compared to Android.
This can happen because Compose Multiplatform compiles UI shaders on demand.
So, if a particular shader is not cached yet, compiling it may delay rendering of a scene.

This issue affects only the first launch of each screen.
Once all necessary shaders are cached, subsequent launches are not delayed by compilation.
-->

## 開發者體驗

### 預覽

_預覽_ 是 IDE 中可用的可組合項的非互動式佈局呈現。

若要查看可組合項的預覽：

1.  如果您的專案中沒有 Android 目標，請新增一個（預覽機制使用 Android 函式庫）。
    > 從 Compose Multiplatform [1.10.0](whats-new-compose-110.md#unified-preview-annotation) 開始，您可以在 `commonMain` 原始碼集中為所有目標平台使用 `@Preview` 註解。
    >
    >{style="note"}
2.  在通用程式碼中，使用 `@Preview` 註解標記您希望可預覽的可組合項。
3.  切換到編輯器視窗中的 **分割** 或 **設計** 檢視。
    如果您尚未這麼做，它將提示您首次建置專案。

在 IntelliJ IDEA 和 Android Studio 中，您將能夠看到目前檔案中，每個標註 `@Preview` 的可組合項的初始佈局。

### 熱重載

_熱重載_ 指的是應用程式即時反映程式碼變更，而無需額外輸入。
在 Compose Multiplatform 中，熱重載功能僅適用於 JVM（桌面）目標。
然而，您可以使用它來快速排除故障，然後再切換到您預期的平台進行微調。

若要了解更多資訊，請參閱我們的 [Compose 熱重載](compose-hot-reload.md) 文章。

## 後續步驟

閱讀更多關於以下組件的 Compose Multiplatform 實作：
*   [資源](compose-multiplatform-resources.md)
*   [生命週期](compose-lifecycle.md)
*   [通用 ViewModel](compose-viewmodel.md)
*   [導航與路由](compose-navigation-routing.md)