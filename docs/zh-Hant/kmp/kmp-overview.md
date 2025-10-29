[//]: # (title: 什麼是 Kotlin Multiplatform)
[//]: # (description: Kotlin Multiplatform 是 JetBrains 推出的一項開源技術，能夠在 Android、iOS、桌面、網頁和伺服器之間共用程式碼。)

Kotlin Multiplatform (KMP) 是 JetBrains 推出的一項開源技術，能夠在 Android、iOS、桌面、網頁和伺服器之間共用程式碼，同時保留原生開發的優勢。

藉由 Compose Multiplatform，您還可以在多個平台之間共用 UI 程式碼，以最大限度地重複使用程式碼。

## 企業為何選擇 KMP

### 成本效益與更快的交付速度

Kotlin Multiplatform 有助於簡化技術和組織流程：

*   您可以透過在不同平台間共用邏輯和 UI 程式碼，來降低重複工作和維護成本。這也使得在多個平台上同步發布功能成為可能。
*   團隊協作變得更加容易，因為統一的邏輯可以在共用程式碼中存取，這使得團隊成員之間更容易轉移知識，並減少專屬平台團隊之間的重複工作。

除了更快的上市時間外，**55%** 的使用者表示採用 KMP 後協作有所改善，**65%** 的團隊表示效能和品質有所提升（根據 2024 年第二季 KMP 調查）。

KMP 正在被從新創公司到全球企業的各種規模組織在生產環境中使用。Google、Duolingo、Forbes、Philips、McDonald's、Bolt、H&M、Baidu、Kuaishou 和 Bilibili 等公司已採用 KMP，因為其具備彈性、原生效能、提供原生使用者體驗的能力、成本效益以及對逐步採用的支援。[進一步了解採用 KMP 的公司](case-studies.topic)。

### 程式碼共用的彈性

您可以依照自己的方式共用程式碼：共用獨立模組，例如網路或儲存，並隨著時間逐步擴展共用程式碼。
您也可以共用所有業務邏輯，同時保持 UI 為原生，或使用 Compose Multiplatform 逐步遷移 UI。

![KMP 逐步採用的圖示：共用部分邏輯但不共用 UI、共用所有邏輯但不共用 UI、共用邏輯和 UI](kmp-graphic.png){width="700"}

### iOS 上的原生體驗

您可以完全使用 SwiftUI 或 UIKit 建構您的 UI，使用 Compose Multiplatform 在 Android 和 iOS 上建立統一的體驗，或根據需要混合搭配原生和共用 UI 程式碼。

無論採用哪種方法，您都可以產出在各個平台上都具有原生感受的應用程式：

<video src="https://www.youtube.com/watch?v=LB5a2FRrT94" width="700"/>

### 原生效能

Kotlin Multiplatform 利用 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) 來生成原生二進位檔案，並在虛擬機器不適用或不可能的情況下（例如在 iOS 上）直接存取平台 API。

這有助於在編寫與平台無關的程式碼的同時，實現接近原生的效能：

![顯示 Compose Multiplatform 和 SwiftUI 在 iPhone 13 和 iPhone 16 上 iOS 效能可比較圖表](cmp-ios-performance.png){width="700"}

### 無縫的開發工具

IntelliJ IDEA 和 Android Studio 透過 [Kotlin Multiplatform IDE 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform) 為 KMP 提供智慧型 IDE 支援，包括通用的 UI 預覽、[Compose Multiplatform 的熱重載](compose-hot-reload.md)、跨語言導航、重構以及 Kotlin 和 Swift 程式碼之間的除錯。

<video src="https://youtu.be/ACmerPEQAWA" width="700"/>

### AI 驅動的開發

讓 JetBrains 的 AI 編碼代理 [Junie](https://jetbrains.com/junie) 處理 KMP 任務，讓您的團隊能夠更快地推進。

## 探索 Kotlin Multiplatform 的使用案例

看看公司和開發人員如何享受共用 Kotlin 程式碼帶來的好處：

*   在我們的[案例研究頁面](case-studies.topic)了解公司如何在程式碼庫中成功採用 KMP。
*   在我們的[精選範例列表](multiplatform-samples.md)以及 GitHub 的 [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 主題中查看各種範例應用程式。
*   在 [klibs.io](https://klibs.io/) 上數千個已有的函式庫中搜尋特定的多平台函式庫。

## 學習基礎知識

若要快速了解 KMP 的實際運作，請嘗試[快速入門](quickstart.md)。您將設定您的環境，並在不同平台上執行範例應用程式。

選擇一個使用案例
: * 若要建立一個在不同平台之間共用 UI 和業務邏輯程式碼的應用程式，請參閱[共用邏輯和 UI 教學課程](compose-multiplatform-create-first-app.md)。
  * 若要了解如何將 Android 應用程式轉換為多平台應用程式，請查看我們的[遷移教學課程](multiplatform-integrate-in-existing-app.md)。
  * 若要了解如何在不共用 UI 實作的情況下共用部分程式碼，請參閱[共用邏輯教學課程](multiplatform-create-first-app.md)。

深入技術細節
: * 從[基本專案結構](multiplatform-discover-project.md)開始。
  * 了解可用的[程式碼共用機制](multiplatform-share-on-platforms.md)。
  * 查看依賴項在 KMP 專案中[如何運作](multiplatform-add-dependencies.md)。
  * 考慮不同的 [iOS 整合方法](multiplatform-ios-integration-overview.md)。
  * 了解 KMP 如何為各種目標[編譯程式碼](multiplatform-configure-compilations.md)和[建構二進位檔案](multiplatform-build-native-binaries.md)。
  * 閱讀有關[發布多平台應用程式](multiplatform-publish-apps.md)或[多平台函式庫](multiplatform-publish-lib-setup.md)的資訊。

## 大規模採用 Kotlin Multiplatform

在團隊中採用跨平台框架可能是一項挑戰。若要了解其優勢以及潛在問題的解決方案，請查看我們關於跨平台開發的高層次概述：

*   [什麼是跨平台行動開發？](cross-platform-mobile-development.md)：提供跨平台應用程式的不同方法和實作概述。
*   [如何向您的團隊介紹多平台行動開發](multiplatform-introduce-your-team.md)：提供在團隊中引入跨平台開發的策略。
*   [採用 Kotlin Multiplatform 並為您的專案增添動力的十個理由](multiplatform-reasons-to-try.md)：列出將 Kotlin Multiplatform 作為您的跨平台解決方案的理由。