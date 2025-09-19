[//]: # (title: 常見問題)

## Kotlin Multiplatform

### 什麼是 Kotlin Multiplatform？

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) (KMP) 是 JetBrains 旗下的開源技術，用於靈活的跨平台開發。它讓您可以建立適用於各種平台的應用程式，並在它們之間高效重用程式碼，同時保留原生程式設計的優勢。透過 Kotlin Multiplatform，您可以開發適用於 Android、iOS、桌面、網頁、伺服器端及其他平台的應用程式。

### 我可以使用 Kotlin Multiplatform 共享 UI 嗎？

是的，您可以使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 分享 UI，這是 JetBrains 旗下的聲明式 UI 框架，基於 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 開發。此框架讓您可以建立適用於 iOS、Android、桌面和網頁等平台的共享 UI 元件，幫助您在不同裝置和平台之間保持使用者介面的一致性。

要了解更多資訊，請參閱 [Compose Multiplatform](#compose-multiplatform) 章節。

### Kotlin Multiplatform 支援哪些平台？

Kotlin Multiplatform 支援 Android、iOS、桌面、網頁、伺服器端及其他平台。了解更多關於 [支援平台](supported-platforms.md) 的資訊。

### 我應該在哪個 IDE 中開發我的跨平台應用程式？

我們建議使用 Android Studio IDE 來處理 Kotlin Multiplatform 專案。在 [推薦的 IDE 和程式碼編輯器](recommended-ides.md) 中閱讀更多關於可用替代方案的資訊。

### 如何建立新的 Kotlin Multiplatform 專案？

[建立 Kotlin Multiplatform 應用程式](get-started.topic) 教學課程提供了建立 Kotlin Multiplatform 專案的逐步說明。您可以決定要共享什麼 – 僅邏輯，或者同時共享邏輯和 UI。

### 我有一個現有的 Android 應用程式。如何將其遷移到 Kotlin Multiplatform？

[讓您的 Android 應用程式在 iOS 上執行](multiplatform-integrate-in-existing-app.md) 逐步教學課程解釋了如何讓您的 Android 應用程式在 iOS 上與原生 UI 一起執行。如果您還想與 Compose Multiplatform 共享 UI，請參閱 [相應的答案](#i-have-an-existing-android-application-that-uses-jetpack-compose-what-should-i-do-to-migrate-it-to-other-platforms)。

### 我可以在哪裡找到完整的範例來試玩？

這裡有 [真實範例列表](multiplatform-samples.md)。

### 我在哪裡可以找到真實的 Kotlin Multiplatform 應用程式列表？哪些公司在生產環境中使用 KMP？

查看我們的 [案例研究列表](case-studies.topic)，以了解其他已在生產環境中採用 Kotlin Multiplatform 的公司經驗。

### 哪些作業系統可以與 Kotlin Multiplatform 協同工作？

如果您要處理共享程式碼或平台特定程式碼，除了 iOS 之外，您可以在 IDE 支援的任何作業系統上工作。

了解更多關於 [推薦的 IDE](recommended-ides.md) 資訊。

如果您想編寫 iOS 特定程式碼並在模擬器或真實裝置上執行 iOS 應用程式，請使用搭載 macOS 的 Mac。這是因為根據 Apple 的要求，iOS 模擬器只能在 macOS 上執行，而不能在其他作業系統（如 Microsoft Windows 或 Linux）上執行。

### 如何在 Kotlin Multiplatform 專案中編寫並行程式碼？

您仍然可以在 Kotlin Multiplatform 專案中使用 coroutines 和 flows 編寫非同步程式碼。如何呼叫此程式碼取決於您從何處呼叫。從 Kotlin 程式碼呼叫 suspending functions 和 flows 已有廣泛文件記載，尤其是針對 Android。[從 Swift 程式碼呼叫它們](https://kotlinlang.org/docs/native-arc-integration.html#completion-handlers) 需要多一點工作，詳情請參閱 [KT-47610](https://youtrack.jetbrains.com/issue/KT-47610)。

<!-- when adding SKIE back to the tutorial, add it here as well
and uncomment the paragraph below --> 

目前從 Swift 呼叫 suspending functions 和 flows 的最佳方法是使用 [KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines) 等外掛程式和函式庫，並結合 Swift 的 `async`/`await` 或 Combine 和 RxSwift 等函式庫。

<!-- At the moment, KMP-NativeCoroutines is the more
tried-and-tested solution, and it supports `async`/`await`, Combine, and RxSwift approaches to concurrency. SKIE is easier
to set up and less verbose. For instance, it maps Kotlin `Flow` to Swift `AsyncSequence` directly. Both of these libraries
support the proper cancellation of coroutines. -->

要了解如何使用它們，請參閱 [在 iOS 和 Android 之間共享更多邏輯](multiplatform-upgrade-app.md)。

### 什麼是 Kotlin/Native，它與 Kotlin Multiplatform 有何關係？

[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) 是一種將 Kotlin 程式碼編譯為原生二進位檔案的技術，這些檔案無需虛擬機器即可執行。它包含一個用於 Kotlin 編譯器的 [基於 LLVM](https://llvm.org/) 的後端，以及 Kotlin 標準函式庫的原生實作。

Kotlin/Native 主要設計用於允許為不適用或不可能使用虛擬機器的平台進行編譯，例如嵌入式裝置和 iOS。當您需要產生不需要額外執行時或虛擬機器的獨立程式時，它特別適用。

例如，在行動應用程式中，用 Kotlin 編寫的共享程式碼會透過 Kotlin/JVM 編譯為 Android 的 JVM 位元組碼，並透過 Kotlin/Native 編譯為 iOS 的原生二進位檔案。這使得與 Kotlin Multiplatform 的整合在兩個平台上都無縫銜接。

![Kotlin/Native 和 Kotlin/JVM 二進位檔案](kotlin-native-and-jvm-binaries.png){width=350}

### 如何加快 Kotlin Multiplatform 模組在原生平台（iOS、macOS、Linux）上的編譯速度？

請參閱這些 [改善 Kotlin/Native 編譯時間的技巧](https://kotlinlang.org/docs/native-improving-compilation-time.html)。

## Compose Multiplatform

### 什麼是 Compose Multiplatform？

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是 JetBrains 開發的一個現代化聲明式、響應式 UI 框架，它提供了一種使用少量 Kotlin 程式碼構建使用者介面的簡單方法。它還允許您一次編寫 UI，並在任何支援的平台 – iOS、Android、桌面版 (Windows, macOS, Linux) 和網頁 – 上執行。

### 它與適用於 Android 的 Jetpack Compose 有何關係？

Compose Multiplatform 與 Google 開發的 Android UI 框架 [Jetpack Compose](https://developer.android.com/jetpack/compose) 共享其大部分 API。事實上，當您使用 Compose Multiplatform 以 Android 為目標時，您的應用程式僅在 Jetpack Compose 上執行。Compose Multiplatform 所針對的其他平台可能在底層實作細節上與 Android 上的 Jetpack Compose 不同，但它們仍然為您提供相同的 API。

有關詳細資訊，請參閱 [框架相互關係概覽](compose-multiplatform-and-jetpack-compose.md)。

### 我可以在哪些平台之間共享我的 UI？

我們希望您能夠選擇在任何熱門平台組合之間共享 UI – Android、iOS、桌面 (Linux, macOS, Windows) 和網頁 (基於 Wasm)。Compose Multiplatform 目前僅對 Android、iOS 和桌面平台穩定。有關更多詳細資訊，請參閱 [支援平台](supported-platforms.md)。

### 我可以在生產環境中使用 Compose Multiplatform 嗎？

Compose Multiplatform 的 Android、iOS 和桌面目標已穩定。您可以在生產環境中使用它們。

基於 WebAssembly 的 Compose Multiplatform 網頁版本處於 Beta 階段，這表示它已接近完成。您可以使用它，但仍可能發生遷移問題。它的 UI 與 Compose Multiplatform 針對 iOS、Android 和桌面平台的 UI 相同。

### 如何建立新的 Compose Multiplatform 專案？

[使用共享邏輯和 UI 建立 Compose Multiplatform 應用程式](compose-multiplatform-create-first-app.md) 教學課程提供了建立適用於 Android、iOS 和桌面平台的 Compose Multiplatform 專案的逐步說明。您也可以觀看 Kotlin 開發者倡導者 Sebastian Aigner 在 YouTube 上建立的 [影片教學](https://www.youtube.com/watch?v=5_W5YKPShZ4)。

### 我應該使用哪個 IDE 來建構使用 Compose Multiplatform 的應用程式？

我們建議使用 Android Studio IDE。有關更多詳細資訊，請參閱 [推薦的 IDE 和程式碼編輯器](recommended-ides.md)。

### 我可以試玩範例應用程式嗎？在哪裡可以找到它？

您可以試用我們的 [範例](multiplatform-samples.md)。

### Compose Multiplatform 附帶小工具嗎？

是的，Compose Multiplatform 提供對 [Material 3](https://m3.material.io/) 小工具的完整支援。

### 我可以在多大程度上自訂 Material 小工具的外觀？

您可以使用 Material 的主題功能來自訂顏色、字體和間距。如果您想建立獨特的設計，您可以建立自訂小工具和佈局。

### 我可以在現有的 Kotlin Multiplatform 應用程式中共享 UI 嗎？

如果您的應用程式使用原生 API 作為其 UI（這是最常見的情況），您可以逐步將部分重寫為 Compose Multiplatform，因為它為此提供了互通性。您可以用一個特殊的互通視圖替換原生 UI，該視圖封裝了用 Compose 編寫的通用 UI。

### 我有一個現有的 Android 應用程式，它使用 Jetpack Compose。我應該如何將其遷移到其他平台？

應用程式的遷移包含兩部分：遷移 UI 和遷移邏輯。遷移的複雜度取決於您的應用程式複雜度和您使用的 Android 特定函式庫數量。您可以在不改變的情況下將大部分畫面遷移到 Compose Multiplatform。所有 Jetpack Compose 小工具都受支援。然而，有些 API 僅在 Android 目標中有效 – 它們可能是 Android 特定的，或者尚未被移植到其他平台。例如，資源處理是 Android 特定的，因此您需要遷移到 [Compose Multiplatform 資源函式庫](compose-multiplatform-resources.md) 或使用社群解決方案。Android [導航函式庫](https://developer.android.com/jetpack/androidx/releases/navigation) 也是 Android 特定的，但有 [社群替代方案](compose-navigation-routing.md) 可用。有關僅適用於 Android 的元件的更多資訊，請參閱目前的 [Android 專用 API 列表](compose-android-only-components.md)。

您需要將 [業務邏輯遷移到 Kotlin Multiplatform](multiplatform-integrate-in-existing-app.md)。當您嘗試將程式碼移至共享模組時，使用 Android 依賴項的部分將停止編譯，您需要重寫它們。

*   您可以重寫使用 Android 專用依賴項的程式碼，改用多平台函式庫。某些函式庫可能已支援 Kotlin Multiplatform，因此無需更改。您可以查看 [KMP-awesome](https://github.com/terrakok/kmp-awesome) 函式庫列表。
*   或者，您可以將通用程式碼與平台特定邏輯分離，並 [提供通用介面](multiplatform-connect-to-apis.md)，這些介面會根據平台以不同方式實作。在 Android 上，實作可以使用您現有的功能；而在其他平台（如 iOS）上，您需要為通用介面提供新的實作。

### 我可以將 Compose 畫面整合到現有的 iOS 應用程式中嗎？

是的。Compose Multiplatform 支援不同的整合情境。有關與 iOS UI 框架整合的更多資訊，請參閱 [與 SwiftUI 整合](compose-swiftui-integration.md) 和 [與 UIKit 整合](compose-uikit-integration.md)。

### 我可以將 UIKit 或 SwiftUI 元件整合到 Compose 畫面中嗎？

是的，您可以。請參閱 [與 SwiftUI 整合](compose-swiftui-integration.md) 和 [與 UIKit 整合](compose-uikit-integration.md)。

<!-- Need to revise
### What happens when my mobile OS updates and introduces new platform capabilities?

You can use them in platform-specific parts of your codebase once Kotlin supports them. We do our best to support them
in the upcoming Kotlin version. All new Android capabilities provide Kotlin or Java APIs, and wrappers over iOS APIs are
generated automatically.
-->

### 當我的行動作業系統更新並更改系統元件的視覺樣式或行為時會發生什麼？

作業系統更新後，您的 UI 將保持不變，因為所有元件都是繪製在畫布上的。如果您在螢幕中嵌入原生 iOS 元件，更新可能會影響其外觀。

## 未來計劃

### Kotlin Multiplatform 的發展計劃是什麼？

我們 JetBrains 正在大力投入，旨在為多平台開發提供最佳體驗，並消除多平台使用者現有的痛點。我們計劃改進核心 Kotlin Multiplatform 技術、與 Apple 生態系統的整合、工具，以及我們的 Compose Multiplatform UI 框架。查看我們的 [發展藍圖](https://blog.jetbrains.com/kotlin/2024/10/kotlin-multiplatform-development-roadmap-for-2025/)。

### Compose Multiplatform 何時會變得穩定？

Compose Multiplatform 對於 Android、iOS 和桌面平台已穩定，而網頁平台支援則處於 Beta 階段。我們正朝著網頁平台的穩定版本努力，確切日期將另行公佈。

有關穩定狀態的更多資訊，請參閱 [支援平台](supported-platforms.md)。

### Kotlin 和 Compose Multiplatform 中網頁目標的未來支援如何？

我們目前正將資源集中於 WebAssembly (Wasm)，它展現了巨大的潛力。您可以試用我們新的 [Kotlin/Wasm 後端](https://kotlinlang.org/docs/wasm-overview.html) 和由 Wasm 驅動的 [Compose Multiplatform for Web](https://kotl.in/wasm-compose-example)。

至於 JS 目標，Kotlin/JS 後端已經達到穩定狀態。在 Compose Multiplatform 中，由於資源限制，我們已將重點從 JS Canvas 轉移到 Wasm，我們相信這更有前景。

我們還提供 Compose HTML，以前稱為 Compose Multiplatform for web。它是一個額外的函式庫，專為在 Kotlin/JS 中處理 DOM 而設計，不適用於跨平台共享 UI。

### 有沒有改善多平台開發工具的計劃？

是的，我們非常清楚多平台工具目前面臨的挑戰，並正在積極努力在多個領域進行改進。

### 您會提供 Swift 互通性嗎？

是的。我們目前正在研究提供與 Swift 直接互通性的各種方法，重點是將 Kotlin 程式碼匯出到 Swift。