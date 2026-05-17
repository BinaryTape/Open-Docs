[//]: # (title: 常見問題)

## Kotlin Multiplatform

### 什麼是 Kotlin Multiplatform？

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/)（KMP）是由 JetBrains 開發的一項開源技術，用於靈活的跨平台開發。它允許您為各種平台建立應用程式，並在這些平台之間高效地重複使用程式碼，同時保留原生程式設計的優點。透過 Kotlin Multiplatform，您可以為 Android、iOS、桌面、Web、伺服器端以及其他平台開發應用程式。

### 我可以使用 Kotlin Multiplatform 共享 UI 程式碼嗎？

是的，您可以使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 共享 UI，這是 JetBrains 基於 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 開發的宣告式 UI 架構。該架構允許您為 iOS、Android、桌面和 Web 等平台建立共享的 UI 元件，幫助您在不同裝置和平台之間保持一致的使用者介面。

若要了解更多，請參閱 [Compose Multiplatform](#compose-multiplatform) 章節。

### Kotlin Multiplatform 支援哪些平台？

Kotlin Multiplatform 支援 Android、iOS、桌面、Web、伺服器端以及其他平台。進一步了解[支援的平台](supported-platforms.md)。

### 我應該在哪個 IDE 中開發我的跨平台應用程式？

我們建議使用 IntelliJ IDEA 或 Android Studio 來處理 Kotlin Multiplatform 專案。

如果您的 Kotlin Multiplatform 專案以 iOS 為目標，您的電腦上需要安裝 [Xcode](https://developer.apple.com/xcode/)，以便編寫 iOS 特定程式碼並執行 iOS 應用程式。

### 如何建立新的 Kotlin Multiplatform 專案？

[建立 Kotlin Multiplatform 應用程式](get-started.topic)教學提供了建立 Kotlin Multiplatform 專案的逐步說明。您可以決定要共享什麼內容——是僅限邏輯，還是同時共享邏輯與 UI。

### 我有一個現有的 Android 應用程式。該如何將其遷移到 Kotlin Multiplatform？

[讓您的 Android 應用程式在 iOS 上執行](multiplatform-integrate-in-existing-app.md)逐步教學說明了如何讓您的 Android 應用程式在具有原生 UI 的 iOS 上執行。

[將 Jetpack Compose 應用程式遷移到 Kotlin Multiplatform](migrate-from-android.md) 是一項進階教學，展示了將複雜的 Android 應用程式轉換為多平台的完整路徑，包括將 UI 遷移到 Compose Multiplatform。

### 在哪裡可以找到完整的範例來嘗試？

這裡有[實際範例清單](multiplatform-samples.md)。

### 在哪裡可以找到實際的 Kotlin Multiplatform 應用程式清單？哪些公司在生產環境中使用 KMP？

查看我們的[案例研究清單](https://kotlinlang.org/case-studies/?type=multiplatform)，向其他已經在生產環境中採用 Kotlin Multiplatform 的公司學習。

### 哪些作業系統可以配合 Kotlin Multiplatform 使用？

如果您要處理共享程式碼或平台特定程式碼（iOS 除外），您可以在 IDE 支援的任何作業系統上工作。

如果您想編寫 iOS 特定的程式碼並在模擬器或實際裝置上執行 iOS 應用程式，請使用裝有 macOS 的 Mac。這是因為根據 Apple 的要求，iOS 模擬器只能在 macOS 上執行，無法在 Microsoft Windows 或 Linux 等其他作業系統上執行。

進一步了解[推薦的 IDE](recommended-ides.md)。

### 如何在 Kotlin Multiplatform 專案中編寫並行程式碼？

您仍然可以使用協同程式（coroutine）與 flow 在您的 Kotlin Multiplatform 專案中編寫非同步程式碼。如何呼叫這些程式碼取決於您從何處呼叫。從 Kotlin 程式碼呼叫暫停函式（suspending function）與 flow 已有廣泛的文件說明，特別是針對 Android。[從 Swift 程式碼呼叫它們](https://kotlinlang.org/docs/native-arc-integration.html#completion-handlers)需要更多工作，詳情請參閱 [KT-47610](https://youtrack.jetbrains.com/issue/KT-47610)。

目前從 Swift 呼叫暫停函式與 flow 的最佳方法是使用 [KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines) 等外掛程式與程式庫，並搭配 Swift 的 `async`/`await` 或 Combine 和 RxSwift 等程式庫。

目前，KMP-NativeCoroutines 是較經受過考驗的解決方案，它支援 `async`/`await`、Combine 和 RxSwift 等並行方法。SKIE 的設定可能更簡單且不那麼冗長。例如，它直接將 Kotlin `Flow` 對應到 Swift `AsyncSequence`。這兩個程式庫都支援正確取消協同程式。

若要了解如何使用它們，請參閱[在 iOS 與 Android 之間共享更多邏輯](multiplatform-upgrade-app.md)教學。

### 什麼是 Kotlin/Native，它與 Kotlin Multiplatform 有什麼關係？

[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) 是一項將 Kotlin 程式碼編譯為原生二進位檔的技術，這些檔案可以在沒有虛擬機的情況下執行。它包含一個基於 [LLVM](https://llvm.org/) 的 Kotlin 編譯器後端以及 Kotlin 標準程式庫的原生實作。

Kotlin/Native 主要設計用於允許在不適合或無法使用虛擬機的平台（例如嵌入式裝置和 iOS）上進行編譯。當您需要產出一個不需要額外運行時或虛擬機的自包含程式時，它特別適合。

例如，在行動應用程式中，使用 Kotlin 編寫的共享程式碼會透過 Kotlin/JVM 為 Android 編譯成 JVM 位元組碼，並透過 Kotlin/Native 為 iOS 編譯成原生二進位檔。這使得與 Kotlin Multiplatform 的整合在兩個平台上都能無縫進行。

![Kotlin/Native 與 Kotlin/JVM 二進位檔](kotlin-native-and-jvm-binaries.png){width=350}

### 如何加快我的 Kotlin Multiplatform 模組在原生平台（iOS、macOS、Linux）上的編譯速度？

請參閱這些[改善 Kotlin/Native 編譯時間的技巧](https://kotlinlang.org/docs/native-improving-compilation-time.html)。

## Compose Multiplatform

### 什麼是 Compose Multiplatform？

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是由 JetBrains 開發的現代化宣告式且回應式 UI 架構，它提供了一種簡單的方法，只需少量的 Kotlin 程式碼即可建置使用者介面。它還允許您一次編寫 UI，並在任何支援的平台（iOS、Android、桌面（Windows、macOS、Linux）和 Web）上執行。

### 它與 Android 的 Jetpack Compose 有什麼關係？

Compose Multiplatform 與由 Google 開發的 Android UI 架構 [Jetpack Compose](https://developer.android.com/jetpack/compose) 共享大部分 API。事實上，當您使用 Compose Multiplatform 以 Android 為目標時，您的應用程式就是在 Jetpack Compose 上執行。Compose Multiplatform 目標的其他平台在底層實作細節上可能與 Android 上的 Jetpack Compose 不同，但它們仍然為您提供相同的 API。

詳情請參閱[架構相互關係概述](compose-multiplatform-and-jetpack-compose.md)。

### 我可以在哪些平台之間共享 UI？

我們希望讓您能夠在熱門平台的任何組合之間共享 UI——Android、iOS、桌面（Linux、macOS、Windows）和 Web（基於 Wasm）。目前 Compose Multiplatform 針對 Android、iOS 和桌面平台已是穩定版。更多詳情請參閱[支援的平台](supported-platforms.md)。

### 我可以在生產環境中使用 Compose Multiplatform 嗎？

Compose Multiplatform 的 Android、iOS 和桌面目標皆已達到穩定版。您可以在生產環境中使用它們。

基於 WebAssembly 的 Compose Multiplatform for Web 版本目前處於 Beta 階段，這意味著它已接近完成。您可以使用它，但仍可能發生遷移問題。它具有與 iOS、Android 和桌面版 Compose Multiplatform 相同的 UI。

### 如何建立新的 Compose Multiplatform 專案？

[使用共享邏輯與 UI 建立 Compose Multiplatform 應用程式](compose-multiplatform-create-first-app.md)教學提供了為 Android、iOS 和桌面建立帶有 Compose Multiplatform 的 Kotlin Multiplatform 專案的逐步說明。您也可以在 YouTube 上觀看由 Kotlin 技術傳教士 Sebastian Aigner 製作的[影片教學](https://www.youtube.com/watch?v=5_W5YKPShZ4)。

### 我應該使用什麼 IDE 來建置 Compose Multiplatform 應用程式？

我們建議使用已安裝 [KMP IDE 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform/) 的 IntelliJ IDEA 或 Android Studio IDE。

更多詳情請參閱[推薦的 IDE 與程式碼編輯器](recommended-ides.md)。

### 我可以嘗試展示應用程式嗎？在哪裡可以找到它？

您可以嘗試我們的[範例](multiplatform-samples.md)。

### Compose Multiplatform 是否附帶小工具？

是的，Compose Multiplatform 提供對 [Material 3](https://m3.material.io/) 小工具的完整支援。

### 我可以在多大程度上自訂 Material 小工具的外觀？

您可以使用 Material 的佈景主題化功能來自訂顏色、字體和間距。如果您想建立獨特的設計，可以建立自訂小工具與配置。

### 我可以在現有的 Kotlin Multiplatform 應用程式中共享 UI 嗎？

如果您的應用程式的 UI 使用原生 API（這是最常見的情況），您可以逐漸將某些部分重寫為 Compose Multiplatform，因為它對此提供了互通性。您可以使用包裝了以 Compose 編寫的通用 UI 的特殊互通檢視來替換原生 UI。

### 我有一個現有的 Android 應用程式使用 Jetpack Compose。我應該做些什麼來將它遷移到其他平台？

應用程式的遷移由兩部分組成：遷移 UI 和遷移邏輯。遷移的複雜程度取決於應用程式的複雜程度以及您使用的 Android 特定程式庫的數量。

有關複雜應用程式遷移的範例，請參閱[將 Jetpack Compose 應用程式遷移到 Kotlin Multiplatform](migrate-from-android.md) 指南。

您可以將大部分畫面遷移到 Compose Multiplatform 而無需更改。所有的 Jetpack Compose 小工具都受支援。但是，某些 API 僅在 Android 目標中運作——它們可能是 Android 特有的，或者尚未移植到其他平台。例如，資源處理是 Android 特有的，因此您需要遷移到 [Compose Multiplatform 資源程式庫](compose-multiplatform-resources.md)或使用社群解決方案。有關僅適用於 Android 的元件的更多資訊，請參閱目前的[僅限 Android API 清單](compose-android-only-components.md)。

您需要將[業務邏輯遷移到 Kotlin Multiplatform](multiplatform-integrate-in-existing-app.md)。當您嘗試將程式碼移至共享模組時，使用 Android 相依性的部分將停止編譯，您需要重寫它們。

* 您可以重寫使用僅限 Android 相依性的程式碼，改為使用多平台程式庫。某些程式庫可能已經支援 Kotlin Multiplatform，因此不需要更改。查看 [klibs.io](https://klibs.io/) 目錄或 [KMP-awesome](https://github.com/terrakok/kmp-awesome) 程式庫清單。
* 或者，您可以將通用程式碼與平台特定邏輯分離，並[提供通用介面](multiplatform-connect-to-apis.md)，根據平台進行不同的實作。在 Android 上，實作可以使用您現有的功能；在其他平台（如 iOS）上，您需要為通用介面提供新的實作。

### 我可以將 Compose 畫面整合到現有的 iOS 應用程式中嗎？

是的。Compose Multiplatform 支援不同的整合情境。有關與 iOS UI 架構整合的更多資訊，請參閱[與 SwiftUI 整合](compose-swiftui-integration.md)和[與 UIKit 整合](compose-uikit-integration.md)。

### 我可以將 UIKit 或 SwiftUI 元件整合到 Compose 畫面中嗎？

是的，可以。請參閱[與 SwiftUI 整合](compose-swiftui-integration.md)和[與 UIKit 整合](compose-uikit-integration.md)。

<!-- Need to revise
### 當我的行動作業系統更新並引入新的平台功能時會發生什麼事？

一旦 Kotlin 支援這些功能，您就可以在程式碼庫的平台特定部分中使用它們。我們會盡力在即將發佈的 Kotlin 版本中支援它們。所有新的 Android 功能都會提供 Kotlin 或 Java API，而 iOS API 的包裝函式則是自動產生的。
-->

### 當我的行動作業系統更新並更改系統元件的視覺風格或行為時會發生什麼事？

作業系統更新後，您的 UI 將保持不變，因為所有元件都是在畫布（canvas）上繪製的。如果您在畫面中嵌入了原生 iOS 元件，更新可能會影響它們的外觀。

## 未來計畫

### Kotlin Multiplatform 的演進計畫是什麼？

我們 JetBrains 正在投入大量資源，以提供多平台開發的最佳體驗，並消除多平台使用者現有的痛苦。我們計畫改進核心 Kotlin Multiplatform 技術、與 Apple 生態系統的整合、工具以及我們的 Compose Multiplatform UI 架構。
查看 [Kotlin 開發藍圖中的 Multiplatform 章節](https://kotlinlang.org/docs/roadmap.html#kotlin-roadmap-by-subsystem)。

### Compose Multiplatform 何時會達到穩定版？

Compose Multiplatform 對於 Android、iOS 和桌面平台已是穩定版，而基於 Wasm 的 Web 支援則處於 Beta 階段。我們正在努力實現 Web 平台的穩定版本，具體日期將另行公佈。

有關穩定性狀態的更多資訊，請參閱[支援的平台](supported-platforms.md)。

### 關於 Kotlin 和 Compose Multiplatform 對 Web 目標的未來支援如何？

我們目前正將資源集中在 WebAssembly (Wasm) 上，它展現了巨大的潛力。您可以嘗試我們新的 [Kotlin/Wasm 後端](https://kotlinlang.org/docs/wasm-overview.html)以及由 Wasm 提供支援的 [Compose Multiplatform for Web](https://kotl.in/wasm-compose-example)。

至於 JS 目標，Kotlin/JS 後端已經達到穩定版。在 Compose Multiplatform 中，由於資源限制，我們已將重心從 JS 畫布轉向 Wasm，我們相信 Wasm 更有前景。

我們還提供 Compose HTML，先前稱為 Compose Multiplatform for Web。這是一個專為在 Kotlin/JS 中處理 DOM（文件物件模型）而設計的額外程式庫，它並不打算用於跨平台共享 UI。

### 有任何改進多平台開發工具的計畫嗎？

是的，我們敏銳地意識到目前多平台工具面臨的挑戰，並正積極在多個領域進行增強。

### 你們會提供 Swift 互通性嗎？

是的。我們目前正在研究各種方法來提供與 Swift 的直接互通性，重點是將 Kotlin 程式碼匯出到 Swift。