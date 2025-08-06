[//]: # (title: 六個最受歡迎的跨平台應用程式開發框架)

[//]: # (description:本文介紹了六個最受歡迎的跨平台應用程式開發框架，並解釋了為您的專案選擇跨平台工具時應考慮的關鍵事項。)

多年來，跨平台應用程式開發已成為建構行動應用程式最受歡迎的方式之一。跨平台或多平台方法允許開發人員建立在不同行動平台上運行相似的應用程式。

如這張 Google Trends 圖表所示，從 2010 年至今，相關興趣穩步增長：

![Google Trends 圖表顯示對跨平台應用程式開發的興趣](google-trends-cross-platform.png){width=700}

快速進步的 [跨平台行動開發](cross-platform-mobile-development.md#kotlin-multiplatform) 技術日益普及，導致市場上出現了許多新工具。面對眾多選擇，要挑選最適合您需求的工具可能很具挑戰性。為了協助您找到合適的工具，我們整理了六個最佳跨平台應用程式開發框架的列表，並說明其卓越功能。在本文末尾，您還將找到為您的業務選擇多平台開發框架時應注意的幾個關鍵事項。

## 什麼是跨平台應用程式開發框架？

行動工程師使用跨平台行動開發框架，透過單一程式碼庫為多個平台（例如 Android 和 iOS）建構看起來像原生的應用程式。可共享的程式碼是此方法相較於原生應用程式開發的關鍵優勢之一。擁有單一程式碼庫意味著行動工程師可以節省時間，因為無需為每個作業系統編寫程式碼，從而加速開發流程。

## 熱門的跨平台應用程式開發框架

此列表並非詳盡無遺；當今市場上還有許多其他選擇。重要的是要意識到，沒有一體適用、對所有人都理想的工具。框架的選擇在很大程度上取決於您的特定專案和目標，以及我們將在文章末尾討論的其他細節。

儘管如此，我們還是盡力挑選了一些最佳的跨平台行動開發框架，為您的決策提供一個起點。

### Flutter

由 Google 於 2017 年發布的 Flutter 是一個流行的框架，可用於從單一程式碼庫建構行動、網頁和桌面應用程式。要使用 Flutter 建構應用程式，您需要使用 Google 的程式語言 Dart。

**程式語言：** Dart。

**行動應用程式範例：** eBay Motors、Alibaba、Google Pay、字節跳動應用程式。

**主要功能：**

*   Flutter 的熱重載 (hot reload) 功能讓您在修改程式碼後，無需重新編譯，即可立即看到應用程式的變化。
*   Flutter 支援 Google 的 Material Design，一個協助開發人員建立數位體驗的設計系統。在建構應用程式時，您可以使用多種視覺和行為小工具。
*   Flutter 不依賴網路瀏覽器技術。相反，它擁有自己的渲染引擎來繪製小工具。

Flutter 在全球擁有一群相對活躍的社群，並被許多開發人員廣泛使用。根據 [Stack Overflow Trends](https://insights.stackoverflow.com/trends?tags=flutter%2Creact-native)，Flutter 的使用率隨時間呈現上升趨勢，這是基於對應標籤使用率的增加。

> 更深入地了解 [Kotlin Multiplatform 和 Flutter](kotlin-multiplatform-flutter.md)，以理解它們的優勢，並為您的跨平台開發選擇最合適的方案。
> 
{style="note"}

### React Native

React Native 是一個開源 UI 軟體框架，由 Meta Platforms（前身為 Facebook）於 2015 年（比 Flutter 稍早）開發。它基於 Facebook 的 JavaScript 程式庫 React，允許開發人員建構可原生渲染的跨平台行動應用程式。

**程式語言：** JavaScript。

**行動應用程式範例：** Microsoft 的 Office、Skype 和 Xbox Game Pass；Meta 的 Facebook、桌面 Messenger 和 Oculus 中都使用了 React Native。在 [React Native showcase](https://reactnative.dev/showcase) 中查看更多。

**主要功能：**

*   多虧了 Fast Refresh 功能，開發人員可以立即看到他們的 React 元件中的變化。
*   React Native 的優勢之一是著重於 UI。React 原語 (primitives) 渲染至原生平台 UI 元件，讓您能夠建立客製化且響應式的使用者介面。
*   在 0.62 及更高版本中，React Native 與行動應用程式偵錯工具 Flipper 之間的整合預設啟用。Flipper 用於偵錯 Android、iOS 和 React Native 應用程式，它提供了日誌檢視器、互動式佈局檢測器和網路檢測器等工具。

作為最受歡迎的跨平台應用程式開發框架之一，React Native 擁有一群龐大且強大的開發人員社群，他們分享技術知識。多虧了這個社群，您在建構行動應用程式時可以獲得所需的支援。

### Kotlin Multiplatform

Kotlin Multiplatform (KMP) 是 JetBrains 建構的開源技術，允許在不同平台之間共享程式碼，同時保留原生程式設計的優勢。它使開發人員能夠根據需要盡量重複使用程式碼，在必要時編寫原生程式碼，並將共享的 Kotlin 程式碼無縫整合到任何專案中。

**程式語言：** Kotlin。

**行動應用程式範例：** McDonald's、Netflix、Forbes、9GAG、Cash App、Philips。[閱讀更多關於 Kotlin Multiplatform 案例研究](case-studies.topic)。

**主要功能：**

*   開發人員可以在 Android、iOS、網頁、桌面和伺服器端重複使用程式碼，同時在必要時保留原生程式碼。
*   Kotlin Multiplatform 可以無縫整合到任何專案中。開發人員可以利用平台專屬 APIs，同時充分利用原生和跨平台開發的優勢。
*   多虧了 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)，一個由 JetBrains 開發的現代化宣告式跨平台 UI 框架，開發人員擁有完整的程式碼共享靈活性以及共享邏輯和 UI 的能力。
*   如果您已經將 Kotlin 用於 Android，則無需在您的程式碼庫中引入新語言。您可以重複使用您的 Kotlin 程式碼和專業知識，這使得遷移到 Kotlin Multiplatform 相較於其他技術風險較低。

儘管這個跨平台行動開發框架是我們清單中最年輕的框架之一，但它擁有成熟的社群。2023 年 11 月，JetBrains 將其提升為 [穩定版 (Stable)](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)。它正在快速成長，並已在當今市場上留下獨特的印象。多虧了其定期更新的 [文件](get-started.topic) 和社群支援，您總能找到問題的答案。更重要的是，許多 [全球公司和新創公司已經使用 Kotlin Multiplatform](case-studies.topic) 來開發具有原生使用者體驗的多平台應用程式。

[![開啟您的 Kotlin Multiplatform 旅程](kmp-journey-start.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

### Ionic

Ionic 是一個開源行動 UI 工具包，於 2013 年發布。它協助開發人員使用網路技術（如 HTML、CSS 和 JavaScript）從單一程式碼庫建構跨平台行動應用程式，並與 Angular、React 和 Vue 框架整合。

**程式語言：** JavaScript。

**行動應用程式範例：** T-Mobile、BBC（兒童與教育應用程式）、EA Games。

**主要功能：**

*   Ionic 基於專為行動作業系統設計的 SaaS UI 框架，並提供多個 UI 元件用於建構應用程式。
*   Ionic 框架使用 Cordova 和 Capacitor 外掛程式，以提供對裝置內建功能（如相機、手電筒、GPS 和錄音機）的存取。
*   Ionic 擁有自己的命令列介面 Ionic CLI，它是建構 Ionic 應用程式的首選工具。

Ionic Framework 論壇上的持續活躍，社群成員在其中交流知識並互相協助克服開發挑戰。

### .NET MAUI

.NET Multi-platform App UI (.NET MAUI) 是一個跨平台框架，於 2022 年 5 月發布，由 Microsoft 所有。它允許開發人員使用 C# 和 XAML 建立原生行動和桌面應用程式。.NET MAUI 是 Xamarin.Forms 的演進，Xamarin.Forms 是 Xamarin 的功能之一，為 Xamarin 支援的平台提供原生控制項。

**程式語言：** C#、XAML。

**行動應用程式範例：** NBC Sports Next、Escola Agil、Irth Solutions。

**主要功能：**

*   .NET MAUI 提供跨平台 APIs，用於存取原生裝置功能，如 GPS、加速度計，以及電池和網路狀態。
*   有一個單一專案系統，透過多重目標設定 (multi-targeting) 啟用，以支援 Android、iOS、macOS 和 Windows。
*   透過支援 .NET 熱重載 (hot reload)，開發人員可以在應用程式執行時修改其託管原始碼。

儘管 .NET MAUI 仍是一個相對較新的框架，但它已在開發人員中獲得了關注，並在 Stack Overflow 和 Microsoft Q&A 上擁有活躍的社群。

### NativeScript

這個開源行動應用程式開發框架最初於 2014 年發布。NativeScript 允許您使用 JavaScript 或可轉譯為 JavaScript 的語言（如 TypeScript），以及 Angular 和 Vue.js 等框架來建構 Android 和 iOS 行動應用程式。

**程式語言：** JavaScript、TypeScript。

**行動應用程式範例：** Daily Nanny、Strudel、Breethe。

**主要功能：**

*   NativeScript 允許開發人員輕鬆存取原生 Android 和 iOS APIs。
*   該框架渲染平台原生 UI。使用 NativeScript 建構的應用程式直接在原生裝置上運行，不依賴 WebViews，WebViews 是 Android 作業系統的一個系統元件，允許 Android 應用程式在應用程式內部顯示網路內容。
*   NativeScript 提供各種外掛程式和預建應用程式範本，無需第三方解決方案。

NativeScript 基於 JavaScript 和 Angular 等知名網路技術，這就是許多開發人員選擇此框架的原因。然而，它通常被小型公司和新創公司使用。

## 如何為您的專案選擇合適的跨平台應用程式開發框架？

除了上述框架之外，還有其他跨平台框架，並且市場上將繼續出現新工具。面對眾多選擇，您如何為您的下一個專案找到合適的框架？第一步是了解您專案的需求和目標，並清楚了解您未來應用程式的預期樣貌。接下來，您需要考量以下重要因素，以便為您的業務做出最佳選擇。

#### 1. 您團隊的專業知識

不同的跨平台行動開發框架基於不同的程式語言。在採用框架之前，請檢查它需要哪些技能，並確保您的行動工程師團隊具備足夠的知識和經驗來使用它。

例如，如果您的團隊配備高技能的 JavaScript 開發人員，並且您沒有足夠的資源引入新技術，那麼選擇使用這種語言的框架（如 React Native）可能值得。

#### 2. 供應商可靠性與支援

確保框架的維護者將長期支援它非常重要。深入了解開發和支援這些框架的公司，並查看使用它們建構的行動應用程式。

#### 3. UI 客製化

根據使用者介面對於您未來應用程式的重要性，您可能需要了解使用特定框架客製化 UI 的難易程度。例如，Kotlin Multiplatform 透過 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 提供完整的程式碼共享靈活性，Compose Multiplatform 是由 JetBrains 開發的現代宣告式跨平台 UI 框架。它使開發人員能夠跨 Android、iOS、網頁和桌面（透過 JVM）共享 UI，並基於 Kotlin 和 Jetpack Compose。

[![探索 Compose Multiplatform](explore-compose.svg){width="700"}](https://www.jetbrains.com/compose-multiplatform/)

#### 4. 框架成熟度

了解潛在框架的公共 API 和工具的變更頻率。例如，對原生作業系統元件的一些變更會破壞內部跨平台行為。最好意識到您在使用行動應用程式開發框架時可能面臨的挑戰。您還可以瀏覽 GitHub 並檢查該框架有多少錯誤以及這些錯誤是如何處理的。

#### 5. 框架功能

每個框架都有自己的功能和限制。了解一個框架提供哪些功能和工具對於為您找到最佳解決方案至關重要。它是否擁有程式碼分析器和單元測試框架？您將能夠多快、多輕鬆地建立、偵錯和測試您的應用程式？

#### 6. 安全性

當為業務建構關鍵行動應用程式時，例如包含支付系統的銀行和電子商務應用程式，安全性和隱私尤為重要。根據 [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)，行動應用程式最關鍵的一些安全風險包括不安全的資料儲存和身份驗證/授權。

您需要確保您選擇的多平台行動開發框架提供所需的安全性等級。一種方法是，如果該框架有公開的問題追蹤器，則瀏覽其上的安全問題單。

#### 7. 教育資源

可用學習資源的數量和品質也可以協助您了解在使用框架時體驗將會多麼順暢。全面的官方 [文件](get-started.topic)、線上和線下會議以及教育課程都是一個很好的跡象，表明您將能夠在需要時找到足夠關於產品的基本資訊。

## 主要重點

在不考慮這些因素的情況下，很難選擇最能滿足您特定需求的跨平台行動開發框架。仔細審視您未來應用程式的需求，並將它們與各種框架的功能進行權衡。這樣做將使您能夠找到正確的跨平台解決方案，協助您交付高品質的應用程式。