[//]: # (title: 六大最受歡迎的跨平台應用程式開發框架)

[//]: # (description:本文將介紹六大最受歡迎的跨平台應用程式開發框架，並解釋在為您的專案選擇跨平台工具時需要考量的重要事項。)

多年來，跨平台應用程式開發已成為建構行動應用程式最受歡迎的方式之一。跨平台（或稱多平台）方法允許開發者建立可在不同行動平台上相似運行的應用程式。

從 2010 年至今，其關注度持續穩定增長，如 Google Trends 圖表所示：

![Google Trends 圖表顯示跨平台應用程式開發的關注度](google-trends-cross-platform.png){width=700}

快速發展的[跨平台行動開發](cross-platform-mobile-development.md#kotlin-multiplatform)技術日益普及，導致市場上出現了許多新工具。面對眾多選項，選擇最能滿足您需求的工具可能極具挑戰性。為了幫助您找到合適的工具，我們整理了六個最佳跨平台應用程式開發框架及其卓越功能清單。在本文末尾，您還將找到在為您的業務選擇多平台開發框架時需要注意的幾個關鍵事項。

## 什麼是跨平台應用程式開發框架？

行動工程師使用跨平台行動開發框架，透過單一程式碼庫為多個平台（例如 Android 和 iOS）建構外觀與原生應用程式相似的應用程式。可共用程式碼是此方法相較於原生應用程式開發的關鍵優勢之一。擁有單一程式碼庫意味著行動工程師可以節省時間，因為無需為每個作業系統撰寫程式碼，從而加速開發過程。

## 熱門跨平台應用程式開發框架

此清單並非詳盡無遺；市場上今天還有許多其他選項。重要的是要認識到，沒有適用於所有人的「一體適用 (one-size-fits-all)」工具。框架的選擇很大程度上取決於您的特定專案和目標，以及我們將在文章末尾涵蓋的其他具體細節。

儘管如此，我們仍試圖挑選出一些最佳的跨平台行動開發框架，為您的決策提供起點。

### Kotlin Multiplatform

[Kotlin Multiplatform (KMP)](https://kotlinlang.org/multiplatform/) 是一種由 JetBrains 開發的開源技術，它允許在不同平台間共用程式碼，同時保留原生程式設計的優勢。它使開發者能夠盡可能地重用程式碼，在需要時撰寫原生程式碼，並將共用的 Kotlin 程式碼無縫整合到任何專案中。您可以使用 Kotlin 搭配 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)（一個現代聲明式跨平台 UI 框架），共用高達 100% 的應用程式程式碼，包括 UI。

**程式語言：** Kotlin。

**行動應用程式範例：** Duolingo, McDonald's, Netflix, Forbes, 9GAG, Cash App, Philips。[閱讀更多關於 Kotlin Multiplatform 案例研究](https://kotlinlang.org/case-studies/?type=multiplatform)。

**主要功能：**

*   開發者可以在 Android、iOS、網頁、桌面和伺服器端重用程式碼，並在需要時保留原生程式碼。
*   Kotlin Multiplatform 可以無縫整合到任何專案中。開發者可以利用平台特定的 API，同時充分發揮原生和跨平台開發的優勢。
*   歸功於 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)，開發者擁有完整的程式碼共用靈活性，並且能夠同時共用邏輯和 UI。
*   當您已經在 Android 上使用 Kotlin 時，無需在您的程式碼庫中引入新語言。您可以重用您的 Kotlin 程式碼和專業知識，這使得遷移到 Kotlin Multiplatform 相較於其他技術風險更低。

儘管這個跨平台行動開發框架是我們清單上最年輕的之一，但它擁有成熟的社群。在 2023 年 11 月，JetBrains 將其升級為穩定版。在 Google I/O 2024 上，Google 宣布[官方支援使用 Kotlin Multiplatform 在 Android 和 iOS 之間共用業務邏輯](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html)。歸功於其定期更新的[文件](get-started.topic)和社群支援，您可以隨時找到問題的答案。更重要的是，許多[全球公司和新創公司已經使用 Kotlin Multiplatform](https://kotlinlang.org/case-studies/?type=multiplatform) 來開發具有類似原生使用者體驗的多平台應用程式。

[![啟動您的 Kotlin Multiplatform 旅程](kmp-journey-start.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

### Flutter

Flutter 於 2017 年由 Google 發布，是一個透過單一程式碼庫建構行動、網頁和桌面應用程式的熱門框架。要使用 Flutter 建構應用程式，您需要使用 Google 的程式語言 Dart。

**程式語言：** Dart。

**行動應用程式範例：** eBay Motors, Alibaba, Google Pay, ByteDance apps。

**主要功能：**

*   Flutter 的熱重載 (hot reload) 功能讓您在修改程式碼後立即看到應用程式的變化，無需重新編譯。
*   Flutter 支援 Google 的 Material Design，這是一個幫助開發者建構數位體驗的設計系統。在建構應用程式時，您可以使用多個視覺和行為小工具 (widgets)。
*   Flutter 不依賴網路瀏覽器技術。相反地，它擁有自己的渲染引擎來繪製小工具 (widgets)。

Flutter 在世界各地擁有相對活躍的使用者社群，並被許多開發者廣泛使用。根據 [Stack Overflow Trends](https://insights.stackoverflow.com/trends?tags=flutter%2Creact-native)，基於相應標籤的使用量增加，Flutter 的使用趨勢隨時間推移持續上升。

> 深入了解 [Kotlin Multiplatform 和 Flutter](kotlin-multiplatform-flutter.md)，以了解它們的優勢並為您的跨平台開發選擇最合適的方案。
>
{style="note"}

### React Native

React Native 是一個開源 UI 軟體框架，由 Meta Platforms（前身為 Facebook）於 2015 年（比 Flutter 稍早）開發。它基於 Facebook 的 JavaScript 函式庫 React，並允許開發者建構原生渲染的跨平台行動應用程式。

**程式語言：** JavaScript。

**行動應用程式範例：** React Native 用於 Microsoft 的 Office、Skype 和 Xbox Game Pass；Meta 的 Facebook、桌面版 Messenger 和 Oculus。請參閱 [React Native 展示](https://reactnative.dev/showcase)以了解更多。

**主要功能：**

*   由於 Fast Refresh 功能，開發者可以立即在其 React 元件 (components) 中看到變化。
*   React Native 的優勢之一是專注於使用者介面 (UI)。React 原語 (primitives) 渲染為原生平台 UI 元件 (components)，讓您能夠建構客製化且回應式的使用者介面。
*   在 0.62 及更高版本中，React Native 與行動應用程式除錯器 Flipper 之間的整合預設啟用。Flipper 用於除錯 Android、iOS 和 React Native 應用程式，它提供了諸如日誌檢視器、互動式佈局檢查器和網路檢查器等工具。

作為最受歡迎的跨平台應用程式開發框架之一，React Native 擁有龐大且強大的開發者社群，他們分享技術知識。由於這個社群，您在使用此框架建構行動應用程式時可以獲得所需的支援。

### Ionic

Ionic 是一個開源行動 UI 工具包，於 2013 年發布。它幫助開發者使用 HTML、CSS 和 JavaScript 等網路技術，並整合 Angular、React 和 Vue 框架，從單一程式碼庫建構跨平台行動應用程式。

**程式語言：** JavaScript。

**行動應用程式範例：** T-Mobile, BBC (Children's & Education apps), EA Games。

**主要功能：**

*   Ionic 基於專為行動作業系統設計的 SaaS (軟體即服務) UI 框架，並提供多個 UI 元件 (components) 用於建構應用程式。
*   Ionic 框架使用 Cordova 和 Capacitor 外掛程式 (plugins) 來提供對裝置內建功能的存取，例如相機、手電筒、GPS 和錄音機。
*   Ionic 擁有自己的命令列介面 (command-line interface)，即 Ionic CLI，它作為建構 Ionic 應用程式的首選工具。

Ionic 框架論壇上持續活躍，社群成員在此交流知識並互相協助克服開發挑戰。

### .NET MAUI

.NET 多平台應用程式 UI (.NET MAUI) 是一個跨平台框架，於 2022 年 5 月發布，由 Microsoft 擁有。它允許開發者使用 C# 和 XAML 建立原生行動和桌面應用程式。.NET MAUI 是 Xamarin.Forms 的演進版本，Xamarin.Forms 是 Xamarin 的其中一個功能，為 Xamarin 支援的平台提供原生控制項。

**程式語言：** C#, XAML。

**行動應用程式範例：** NBC Sports Next, Escola Agil, Irth Solutions。

**主要功能：**

*   .NET MAUI 提供跨平台 API，用於存取原生裝置功能，例如 GPS、加速計以及電池和網路狀態。
*   有一個單一專案系統，透過多重目標 (multi-targeting) 來針對 Android、iOS、macOS 和 Windows。
*   支援 .NET 熱重載 (hot reload) 功能，開發者可以在應用程式運行時修改其受管理原始碼。

儘管 .NET MAUI 仍是一個相對較新的框架，但它已經在開發者中獲得關注，並在 Stack Overflow 和 Microsoft Q&A 上擁有活躍的社群。

### NativeScript

這個開源行動應用程式開發框架最初於 2014 年發布。NativeScript 允許您使用 JavaScript 或可轉譯 (transpile) 為 JavaScript 的語言（例如 TypeScript）以及 Angular 和 Vue.js 等框架來建構 Android 和 iOS 行動應用程式。

**程式語言：** JavaScript, TypeScript。

**行動應用程式範例：** Daily Nanny, Strudel, Breethe。

**主要功能：**

*   NativeScript 允許開發者輕鬆存取原生 Android 和 iOS API。
*   該框架渲染平台原生的使用者介面 (UI)。使用 NativeScript 建構的應用程式直接在原生裝置上運行，不依賴於 WebViews，WebView 是一個 Android 作業系統的系統元件，允許 Android 應用程式在應用程式內部顯示來自網路的內容。
*   NativeScript 提供各種外掛程式 (plugins) 和預建的應用程式範本，無需第三方解決方案。

NativeScript 基於 JavaScript 和 Angular 等眾所周知的網路技術，這就是許多開發者選擇此框架的原因。儘管如此，它通常被小型公司和新創公司使用。

## 如何為您的專案選擇合適的跨平台應用程式開發框架？

除了上述提到的框架之外，還有其他跨平台框架，新工具將會繼續出現在市場上。面對如此廣泛的選項，您如何為您的下一個專案找到合適的工具？第一步是了解您的專案需求和目標，並清楚知道您未來的應用程式會是什麼樣子。接下來，您需要考量以下重要因素，以便為您的業務做出最佳選擇。

#### 1. 您團隊的專業知識

不同的跨平台行動開發框架基於不同的程式語言。在採用框架之前，請檢查它需要哪些技能，並確保您的行動工程師團隊擁有足夠的知識和經驗來使用它。

例如，如果您的團隊擁有高技能的 JavaScript 開發者，並且您沒有足夠的資源來引入新技術，那麼選擇使用此語言的框架（例如 React Native）可能更值得。

#### 2. 供應商的可靠性和支援

確保框架的維護者將長期持續支援它非常重要。了解更多關於開發和支援您正在考慮的框架的公司，並查看使用它們建構的行動應用程式。

#### 3. 使用者介面 (UI) 客製化

根據使用者介面對於您未來應用程式的重要性，您可能需要了解使用特定框架客製化 UI 的難易程度。例如，Kotlin Multiplatform 透過 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 提供完整的程式碼共用靈活性，後者是 JetBrains 推出的一個現代聲明式跨平台 UI 框架。它使開發者能夠在 Android、iOS、網頁和桌面（透過 JVM）之間共用 UI，並且基於 Kotlin 和 Jetpack Compose。

[![探索 Compose Multiplatform](explore-compose.svg){width="700"}](https://www.jetbrains.com/compose-multiplatform/)

#### 4. 框架成熟度

了解潛在框架的公共 API 和工具變更的頻率。例如，對原生作業系統元件的一些變更可能會破壞內部跨平台行為。最好了解在使用行動應用程式開發框架時可能面臨的挑戰。您還可以瀏覽 GitHub，檢查框架有多少錯誤以及這些錯誤是如何處理的。

#### 5. 框架能力

每個框架都有其自身的能力和限制。了解框架提供哪些功能和工具對於確定最適合您的解決方案至關重要。它是否具有程式碼分析器和單元測試框架？您能夠多快、多輕鬆地建構、除錯和測試您的應用程式？

#### 6. 安全性

當為業務建構關鍵行動應用程式時，例如包含支付系統的銀行和電子商務應用程式，安全性和隱私尤為重要。根據 [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)，行動應用程式最關鍵的安全風險包括不安全的資料儲存和身份驗證/授權。

您需要確保您選擇的多平台行動開發框架提供所需的安全級別。其中一種方法是瀏覽框架的問題追蹤器（如果有的話），查看其安全票證。

#### 7. 教育資源

關於框架的可用學習資源的數量和品質也可以幫助您了解在使用它時您的體驗會有多順暢。全面官方[文件](get-started.topic)、線上和線下會議以及教育課程都是一個好兆頭，表明您在需要時能夠找到足夠的產品基本資訊。

## 主要啟示

如果不考慮這些因素，很難選擇最能滿足您特定需求的跨平台行動開發框架。仔細審視您未來的應用程式需求，並將它們與各種框架的能力進行權衡。這樣做將使您能夠找到合適的跨平台解決方案，以幫助您交付高品質的應用程式。