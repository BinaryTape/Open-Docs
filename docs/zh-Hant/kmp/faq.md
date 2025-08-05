[//]: # (title: 常見問題)

## Kotlin 多平台

### 什麼是 Kotlin 多平台？

[Kotlin 多平台](https://www.jetbrains.com/kotlin-multiplatform/) (KMP) 是 JetBrains 推出的一項開源技術，用於靈活的跨平台開發。它讓您能夠為各種平台建立應用程式，並在這些平台之間有效率地重複使用程式碼，同時保留原生程式設計的優勢。透過 Kotlin 多平台，您可以開發適用於 Android、iOS、桌面、網頁、伺服器端及其他平台的應用程式。

### 我可以使用 Kotlin 多平台共享使用者介面嗎？

是的，您可以使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 共享使用者介面。Compose Multiplatform 是 JetBrains 基於 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的宣告式 UI 框架。此框架允許您為 iOS、Android、桌面和網頁等平台建立共享 UI 元件，協助您在不同裝置和平台之間維持一致的使用者介面。

若要了解更多資訊，請參閱 [Compose Multiplatform](#compose-multiplatform) 章節。

### Kotlin 多平台支援哪些平台？

Kotlin 多平台支援 Android、iOS、桌面、網頁、伺服器端及其他平台。進一步了解 [支援的平台](supported-platforms.md)。

### 我應該在哪個 IDE 中開發我的跨平台應用程式？

我們建議使用 Android Studio IDE 來處理 Kotlin 多平台專案。在 [推薦的 IDE 和程式碼編輯器](recommended-ides.md) 中了解更多可用的替代方案。

### 如何建立新的 Kotlin 多平台專案？

[建立 Kotlin 多平台應用程式](get-started.topic) 教學課程提供了建立 Kotlin 多平台專案的逐步說明。您可以決定要共享什麼 – 僅邏輯，或者同時共享邏輯和使用者介面。

### 我有一個現有的 Android 應用程式。如何將其遷移到 Kotlin 多平台？

[讓您的 Android 應用程式在 iOS 上運作](multiplatform-integrate-in-existing-app.md) 逐步教學課程說明了如何讓您的 Android 應用程式透過原生 UI 在 iOS 上運作。如果您也想與 Compose Multiplatform 共享 UI，請參閱 [對應的答案](#i-have-an-existing-android-application-that-uses-jetpack-compose-what-should-i-do-to-migrate-it-to-other-platforms)。

### 我可以在哪裡找到完整的範例來試用？

以下是 [實際案例的清單](multiplatform-samples.md)。

### 我可以在哪裡找到實際的 Kotlin 多平台應用程式清單？哪些公司在生產環境中使用 KMP？

請查看我們的 [案例研究清單](case-studies.topic)，以向其他已在生產環境中採用 Kotlin 多平台的公司學習。

### 哪些作業系統可以與 Kotlin 多平台搭配使用？

如果您要處理共享程式碼或平台專屬程式碼，除了 iOS 以外，您可以在您的 IDE 支援的任何作業系統上工作。

進一步了解 [推薦的 IDE](recommended-ides.md)。

如果您想編寫 iOS 專屬程式碼並在模擬器或真實裝置上執行 iOS 應用程式，請使用搭載 macOS 的 Mac。這是因為根據 Apple 的要求，iOS 模擬器只能在 macOS 上執行，而不能在 Microsoft Windows 或 Linux 等其他作業系統上執行。

### 如何在 Kotlin 多平台專案中編寫並行程式碼？

您仍然可以在您的 Kotlin 多平台專案中使用協程和流程來編寫非同步程式碼。如何呼叫這些程式碼取決於您從何處呼叫它們。從 Kotlin 程式碼呼叫暫停函式和流程已被廣泛記載，特別是針對 Android。從 [Swift 程式碼中呼叫它們](https://kotlinlang.org/docs/native-arc-integration.html#completion-handlers) 需要更多工作，請參閱 [KT-47610](https://youtrack.jetbrains.com/issue/KT-47610) 以了解更多詳細資訊。

<!-- when adding SKIE back to the tutorial, add it here as well
and uncomment the paragraph below --> 

目前從 Swift 呼叫暫停函式和流程的最佳方法是使用外掛程式和函式庫，例如 [KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines)，並結合 Swift 的 `async`/`await` 或像 Combine 和 RxSwift 這樣的函式庫。

<!-- At the moment, KMP-NativeCoroutines is the more
tried-and-tested solution, and it supports `async`/`await`, Combine, and RxSwift approaches to concurrency. SKIE is easier
to set up and less verbose. For instance, it maps Kotlin `Flow` to Swift `AsyncSequence` directly. Both of these libraries
support the proper cancellation of coroutines. -->

若要了解如何使用它們，請參閱 [](multiplatform-upgrade-app.md)。

### 什麼是 Kotlin/Native，它與 Kotlin 多平台有何關係？

[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) 是一項用於將 Kotlin 程式碼編譯為原生二進位檔的技術，這些二進位檔無需虛擬機器即可執行。它包含一個基於 [LLVM](https://llvm.org/) 的 Kotlin 編譯器後端以及 Kotlin 標準函式庫的原生實作。

Kotlin/Native 主要旨在允許為不期望或不可能使用虛擬機器的平台進行編譯，例如嵌入式裝置和 iOS。當您需要產生一個不需要額外執行時或虛擬機器的自我包含程式時，它特別適用。

例如，在行動應用程式中，用 Kotlin 編寫的共享程式碼會透過 Kotlin/JVM 編譯為 Android 的 JVM 位元碼，並透過 Kotlin/Native 編譯為 iOS 的原生二進位檔。這使得與 Kotlin 多平台的整合在兩個平台上都無縫銜接。

![Kotlin/Native and Kotlin/JVM binaries](kotlin-native-and-jvm-binaries.png){width=350}

### 如何加速 Kotlin 多平台模組在原生平台 (iOS、macOS、Linux) 上的編譯？

請參閱這些 [提升 Kotlin/Native 編譯時間的技巧](https://kotlinlang.org/docs/native-improving-compilation-time.html)。

## Compose Multiplatform

### 什麼是 Compose Multiplatform？

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是 JetBrains 開發的現代化、宣告式且反應式的 UI 框架，它提供了一種使用少量 Kotlin 程式碼來建構使用者介面的簡單方法。它還允許您一次編寫 UI，並在任何支援的平台 — iOS、Android、桌面 (Windows、macOS、Linux) 和網頁 — 上執行。

### 它與適用於 Android 的 Jetpack Compose 有何關係？

Compose Multiplatform 與 Google 開發的 Android UI 框架 [Jetpack Compose](https://developer.android.com/jetpack/compose) 共享大部分 API。事實上，當您使用 Compose Multiplatform 鎖定 Android 時，您的應用程式僅在 Jetpack Compose 上執行。Compose Multiplatform 鎖定的其他平台可能在內部實作細節上與 Android 上的 Jetpack Compose 不同，但它們仍然為您提供相同的 API。

有關詳細資訊，請參閱 [框架相互關係概述](compose-multiplatform-and-jetpack-compose.md)。

### 我可以在哪些平台之間共享我的 UI？

我們希望您能夠選擇在任何熱門平台的組合之間共享 UI — Android、iOS、桌面 (Linux、macOS、Windows) 和網頁 (基於 Wasm)。目前 Compose Multiplatform 僅在 Android、iOS 和桌面平台達到穩定版。有關更多詳細資訊，請參閱 [支援的平台](supported-platforms.md)。

### 我可以在生產環境中使用 Compose Multiplatform 嗎？

Compose Multiplatform 的 Android、iOS 和桌面目標已達到穩定版。您可以在生產環境中使用它們。

基於 WebAssembly 的 Compose Multiplatform 網頁版本處於 Alpha 階段，這意味著它仍在積極開發中。您可以謹慎使用它，並預期會遇到遷移問題。它與適用於 iOS、Android 和桌面的 Compose Multiplatform 具有相同的 UI。

### 如何建立新的 Compose Multiplatform 專案？

[使用共享邏輯和 UI 建立 Compose Multiplatform 應用程式](compose-multiplatform-create-first-app.md) 教學課程提供了為 Android、iOS 和桌面建立帶有 Compose Multiplatform 的 Kotlin 多平台專案的逐步說明。您也可以觀看 Kotlin 開發者宣導者 Sebastian Aigner 在 YouTube 上建立的 [影片教學](https://www.youtube.com/watch?v=5_W5YKPShZ4)。

### 我應該使用哪個 IDE 來建構帶有 Compose Multiplatform 的應用程式？

我們建議使用 Android Studio IDE。有關更多詳細資訊，請參閱 [推薦的 IDE 和程式碼編輯器](recommended-ides.md)。

### 我可以試玩示範應用程式嗎？在哪裡可以找到它？

您可以試玩我們的 [範例](multiplatform-samples.md)。

### Compose Multiplatform 是否隨附小工具？

是的，Compose Multiplatform 提供對 [Material 3](https://m3.material.io/) 小工具的完整支援。

### 我可以在多大程度上自訂 Material 小工具的外觀？

您可以使用 Material 的主題化功能來自訂顏色、字體和間距。如果您想建立獨特設計，可以建立自訂小工具和佈局。

### 我可以在現有的 Kotlin 多平台應用程式中共享 UI 嗎？

如果您的應用程式使用原生 API 作為其 UI (這是最常見的情況)，您可以逐步將部分功能重寫為 Compose Multiplatform，因為它提供了互通性。您可以將原生 UI 替換為一個特殊的互通視圖，該視圖包裝了使用 Compose 編寫的通用 UI。

### 我有一個使用 Jetpack Compose 的現有 Android 應用程式。我應該怎麼做才能將其遷移到其他平台？

應用程式的遷移包含兩個部分：遷移 UI 和遷移邏輯。遷移的複雜度取決於您的應用程式的複雜度和您使用的 Android 專屬函式庫數量。您可以將大部分畫面遷移到 Compose Multiplatform 而無需更改。所有 Jetpack Compose 小工具都受到支援。然而，有些 API 僅在 Android 目標上運作 — 它們可能是 Android 專屬的，或者尚未移植到其他平台。例如，資源處理是 Android 專屬的，因此您需要遷移到 [Compose Multiplatform 資源函式庫](compose-multiplatform-resources.md) 或使用社群解決方案。Android 的 [Navigation 函式庫](https://developer.android.com/jetpack/androidx/releases/navigation) 也是 Android 專屬的，但有 [社群替代方案](compose-navigation-routing.md) 可用。有關僅適用於 Android 的元件的更多資訊，請參閱目前的 [僅限 Android API 清單](compose-android-only-components.md)。

您需要 [將業務邏輯遷移到 Kotlin 多平台](multiplatform-integrate-in-existing-app.md)。當您嘗試將程式碼移至共享模組時，使用 Android 依賴項的部分將停止編譯，您需要重寫它們。

* 您可以重寫使用僅限 Android 依賴項的程式碼，改為使用多平台函式庫。有些函式庫可能已經支援 Kotlin 多平台，因此無需更改。您可以查看 [KMP-awesome](https://github.com/terrakok/kmp-awesome) 函式庫清單。
* 或者，您可以將通用程式碼與平台專屬邏輯分開，並 [提供通用介面](multiplatform-connect-to-apis.md)，這些介面會根據平台以不同方式實作。在 Android 上，實作可以使用您現有的功能，而在其他平台（例如 iOS）上，您需要為通用介面提供新的實作。

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

### 當我的行動作業系統更新並更改系統元件的視覺樣式或其行為時會發生什麼？

您的 UI 在作業系統更新後將保持不變，因為所有元件都是繪製在畫布上的。如果您將原生 iOS 元件嵌入到您的畫面中，更新可能會影響它們的外觀。

## 未來計畫

### Kotlin 多平台的發展計畫是什麼？

我們 JetBrains 正在大力投入，以提供最佳的多平台開發體驗，並消除多平台使用者現有的痛點。我們計劃改進 Kotlin 多平台核心技術、與 Apple 生態系統的整合、工具以及我們的 Compose Multiplatform UI 框架。[查看我們的發展藍圖](https://blog.jetbrains.com/kotlin/2024/10/kotlin-multiplatform-development-roadmap-for-2025/)。

### Compose Multiplatform 何時會成為穩定版？

Compose Multiplatform 在 Android、iOS 和桌面上已達到穩定版，而網頁平台支援則處於 Alpha 階段。我們正在努力實現網頁平台的穩定版發布，確切日期將另行公布。

有關穩定性狀態的更多資訊，請參閱 [支援的平台](supported-platforms.md)。

### Kotlin 和 Compose Multiplatform 中網頁目標的未來支援如何？

我們目前將資源集中在 WebAssembly (Wasm) 上，它顯示出巨大潛力。您可以試驗我們新的 [Kotlin/Wasm 後端](https://kotlinlang.org/docs/wasm-overview.html) 以及由 Wasm 提供支援的 [Compose Multiplatform for Web](https://kotl.in/wasm-compose-example)。

至於 JS 目標，Kotlin/JS 後端已經達到穩定版。在 Compose Multiplatform 中，由於資源限制，我們已將重心從 JS Canvas 轉移到 Wasm，我們相信 Wasm 具有更大的前景。

我們還提供 Compose HTML，以前稱為 Compose Multiplatform for web。它是一個額外的函式庫，專為在 Kotlin/JS 中處理 DOM 而設計，不適用於跨平台共享 UI。

### 是否有任何計畫來改進多平台開發的工具？

是的，我們充分意識到目前多平台工具所面臨的挑戰，並正在積極努力在多個領域進行增強。

### 您是否會提供 Swift 互通性？

是的。我們目前正在研究各種方法，以提供與 Swift 的直接互通性，重點是將 Kotlin 程式碼匯出到 Swift。