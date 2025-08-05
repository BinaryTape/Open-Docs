[//]: # (title: 不同平台上的預設 UI 行為)

Compose Multiplatform 旨在協助您在不同平台上產生行為盡可能相似的應用程式。在此頁面上，您可以了解使用 Compose Multiplatform 為不同平台編寫共享 UI 程式碼時，應預期會遇到的不可避免的差異或暫時性權衡。

## 專案結構

無論您鎖定的平台為何，每個平台都需要一個專用的進入點：

*   對於 Android，那是 `Activity`，其職責是顯示來自通用程式碼的主 composable。
*   對於 iOS 應用程式，那是初始化應用程式的 `@main` 類別或結構。
*   對於 JVM 應用程式，那是啟動應用程式並啟動主要通用 composable 的 `main()` 函式。
*   對於 Kotlin/JS 或 Kotlin/Wasm 應用程式，那是將主要通用程式碼 composable 附加到網頁的 `main()` 函式。

您的應用程式所需的某些平台專屬 API 可能沒有多平台支援，您將必須在平台專屬的原始碼集實作呼叫這些 API。在執行此操作之前，請查閱 [klibs.io](https://klibs.io/)，這是一個 JetBrains 專案，旨在全面收錄所有可用的 Kotlin Multiplatform 函式庫。目前已有適用於網路程式碼、資料庫、協程 (coroutines) 等的函式庫。

## 輸入方法

### 軟體鍵盤

每個平台處理軟體鍵盤的方式可能略有不同，包括文字欄位啟用時鍵盤的出現方式。

Compose Multiplatform 採用 [Compose 視窗內嵌](https://developer.android.com/develop/ui/compose/system/insets) 方法，並在 iOS 上模仿它，以考量 [安全區域](https://developer.apple.com/documentation/UIKit/positioning-content-relative-to-the-safe-area)。根據您的實作，軟體鍵盤在 iOS 上的位置可能會略有不同。請確保鍵盤不會遮蓋兩個平台上的重要 UI 元素。

Compose Multiplatform 目前不支援變更預設的 IME 動作，例如，顯示放大鏡或勾號圖示，而不是常見的 &crarr; 圖示。

### 觸控與滑鼠支援

目前的桌面實作將所有指標操作解釋為滑鼠手勢，因此不支援多點觸控手勢。例如，桌面版的 Compose Multiplatform 無法實作常見的雙指縮放手勢，因為它需要同時處理兩次觸控。

## UI 行為與外觀

### 平台專屬功能

某些常見的 UI 元素未包含在 Compose Multiplatform 中，也無法使用此框架進行自訂。因此，您應該預期它們在不同平台上的外觀會有所不同。

原生彈出視窗就是一個例子：當您在 Compose Multiplatform 文字欄位中選取文字時，預設的建議動作（如 **複製** 或 **翻譯**）會依據應用程式執行的平台而定。

### 捲動手感

對於 Android 和 iOS，捲動的手感與平台保持一致。對於桌面版，捲動支援僅限於滑鼠滾輪（如 [](#touch-and-mouse-support) 中所述）。

### Interop 視圖

如果您想在通用 composable 中嵌入原生視圖，反之亦然，您需要熟悉 Compose Multiplatform 支援的平台專屬機制。

對於 iOS，有關於與 [SwiftUI](compose-swiftui-integration.md) 和 [UIKit](compose-uikit-integration.md) 進行 interop 程式碼的獨立指南。

對於桌面版，Compose Multiplatform 支援 [](compose-desktop-swing-interoperability.md)。

### 返回手勢

Android 裝置預設支援返回手勢，每個螢幕都會以某種方式響應「**返回**」按鈕。

在 iOS 上，預設沒有返回手勢，儘管鼓勵開發人員實作類似功能以符合使用者體驗預期。適用於 iOS 的 Compose Multiplatform 預設支援返回手勢，以模仿 Android 功能。

在桌面版上，Compose Multiplatform 使用 **Esc** 鍵作為預設的返回觸發器。

有關詳細資訊，請參閱 [](compose-navigation.md#back-gesture) 部分。

### 文字

在文字方面，Compose Multiplatform 不保證不同平台之間有像素級的精確對應：

*   如果您沒有明確設定字體，每個系統會為您的文字分配不同的預設字體。
*   即使是相同的字體，每個平台專屬的字母消除鋸齒機制也可能導致顯著差異。

這對使用者體驗沒有顯著影響。相反地，預設字體在每個平台上都按預期顯示。然而，像素差異可能會干擾螢幕截圖測試等。

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

_預覽_ 是 IDE 中可用的 composable 的非互動式版面配置呈現。

若要查看 composable 的預覽：

1.  如果您的專案中沒有 Android 目標，請新增一個（預覽機制使用 Android 函式庫）。
2.  在通用程式碼中，使用 `@Preview` 註解標記您希望可預覽的 composable。
3.  切換到編輯器視窗中的「**分割 (Split)**」或「**設計 (Design)**」檢視。
    如果您尚未建置專案，它會提示您首次建置。

在 IntelliJ IDEA 和 Android Studio 中，您將能夠看到目前檔案中每個標有 `@Preview` 註解的 composable 的初始版面配置。

### 熱重載 (Hot reload)

_熱重載 (Hot reload)_ 指的是應用程式即時反映程式碼變更，而無需額外輸入。在 Compose Multiplatform 中，熱重載功能僅適用於 JVM（桌面）目標。然而，您可以使用它來快速排除問題，然後再切換到您預期的平台進行微調。

若要了解更多資訊，請參閱我們的 [](compose-hot-reload.md) 文章。

## 後續步驟

閱讀更多關於以下元件的 Compose Multiplatform 實作：
*   [資源](compose-multiplatform-resources.md)
*   [](compose-lifecycle.md)
*   [](compose-viewmodel.md)
*   [](compose-navigation-routing.md)