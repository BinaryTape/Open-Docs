[//]: # (title: 什麼是跨平台行動開發？)

<web-summary>跨平台行動開發有助於您節省大量的時間與精力。了解為什麼許多開發人員已經轉向這項具備成本效益的技術。</web-summary>

現今，許多公司面臨著需要為多個平台建置行動應用程式的挑戰，特別是 Android 和 iOS。這就是為什麼跨平台行動開發解決方案已成為最熱門的軟體開發趨勢之一。

根據 Statista 的數據，2022 年第三季 Google Play 商店有 355 萬個行動應用程式，App Store 有 160 萬個，Android 和 iOS 合計佔據了 [全球行動作業系統市場的 99%](https://gs.statcounter.com/os-market-share/mobile/worldwide)。

該如何建立一個能觸及 Android 和 iOS 受眾的行動應用程式？在本文中，您將了解為什麼越來越多的行動工程師選擇跨平台或多平台（multiplatform）行動開發方法。

## 跨平台行動開發：定義與解決方案

多平台行動開發是一種允許您建置單個行動應用程式，並在多個作業系統上流暢執行的方法。在跨平台應用程式中，部分甚至全部的原始碼都可以共享。這意味著開發人員可以建立並部署在 Android 和 iOS 上都能運作的行動資產，而無需為每個平台重新編碼。

### 行動應用程式開發的不同方法

建立同時適用於 Android 和 iOS 的應用程式主要有四種方式。

#### 1. 為每個作業系統開發獨立的原生應用程式

在建立原生應用程式時，開發人員會針對特定的作業系統建置應用程式，並依賴專為單一平台設計的工具和程式語言：Android 使用 Kotlin 或 Java，iOS 使用 Objective-C 或 Swift。

這些工具和語言讓您可以存取特定作業系統的功能，並打造具有直觀介面的回應式應用程式。但如果您想觸及 Android 和 iOS 受眾，您必須建立獨立的應用程式，這會耗費大量的時間與精力。

#### 2. 漸進式 Web 應用程式 (PWAs)

漸進式 Web 應用程式結合了行動應用程式的功能與 Web 開發中使用的解決方案。粗略地說，它們提供了網站和行動應用程式的混合體。開發人員使用 JavaScript、HTML、CSS 和 WebAssembly 等 Web 技術來建置 PWA。

Web 應用程式不需要單獨打包或分發，可以直接在網路上發佈。它們可以透過電腦、智慧型手機和平板電腦上的瀏覽器存取，不需要透過 Google Play 或 App Store 安裝。

缺點是使用者在使用應用程式時無法利用其裝置的所有功能（例如聯絡人、行事曆、電話和其他資產），導致使用者體驗受限。就應用程式效能而言，原生應用程式仍處於領先地位。

#### 3. 跨平台應用程式

如前所述，多平台應用程式旨在不同的行動平台上以相同的方式執行。跨平台架構允許您編寫可共享且可重複使用的程式碼，以開發此類應用程式。

這種方法具有多項優點，例如在時間和成本方面的效率。我們將在後面的章節詳細探討跨平台行動開發的優缺點。

#### 4. 混合應用程式

在瀏覽網站和論壇時，您可能會注意到有些人會交替使用「跨平台行動開發」和「混合行動開發」這兩個術語。然而，這樣做並不完全準確。

對於跨平台應用程式，行動工程師可以編寫一次程式碼，然後在不同平台上重複使用。另一方面，混合應用程式開發是結合原生和 Web 技術的方法。它需要將以 Web 開發語言（如 HTML、CSS 或 JavaScript）編寫的程式碼嵌入到原生應用程式中。您可以藉助 Ionic Capacitor 和 Apache Cordova 等架構，使用額外的高掛外掛程式來存取平台的原生功能。

跨平台與混合開發唯一的相似之處是程式碼的可共享性。在效能方面，混合應用程式與原生應用程式不相上下。由於混合應用程式部署單一程式碼庫，某些功能是特定於特定作業系統的，在其他系統上可能運作不佳。

### 原生或跨平台應用程式開發：長久的爭論

[關於原生和跨平台開發的爭論](native-and-cross-platform.md)在技術社群中仍未解決。這兩項技術都在不斷演進，並各有利弊。

一些專家仍然偏好原生行動開發而非多平台解決方案，認為原生應用程式更強大的效能和更好的使用者體驗是其中一些最重要的優點。

然而，許多現代企業需要縮短上市時間並降低每個平台的開發成本，同時仍力求在 Android 和 iOS 上都有所建樹。這正是 [Kotlin Multiplatform (KMP)](https://kotlinlang.org/lp/multiplatform/) 等跨平台開發技術可以提供幫助的地方，正如 Netflix 的資深軟體工程師 David Henry 和 Mel Yahya 所[指出](https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23)：

> 不穩定的網路連線極大機率使我們傾向於採用行動解決方案，
> 以實現穩健的用戶端永續性與離線支援。對快速產品交付的需求
> 促使我們嘗試多平台架構。現在我們更進一步，
> 使用 Kotlin Multiplatform 在 Kotlin 中編寫一次與平台無關的商業邏輯，
> 並將其編譯為適用於 Android 的 Kotlin 程式庫以及適用於 iOS 的原生 Universal Framework。
>
> {style="tip"}

[![探索 Kotlin Multiplatform](discover-kmp.svg){width="700"}](https://www.jetbrains.com/kotlin-multiplatform/)

## 跨平台行動開發適合您嗎？

選擇適合您的行動開發方法取決於許多因素，例如業務需求、目標和任務。與任何其他解決方案一樣，跨平台行動開發也有其優缺點。

### 跨平台開發的優點

企業選擇這種方法而非其他選項的原因有很多。

#### 1. 可重複使用的程式碼

透過跨平台程式設計，行動工程師不需要為每個作業系統編寫新程式碼。使用單一程式碼庫可以讓開發人員減少執行重複性任務的時間，例如 API 呼叫、資料存儲、資料序列化和分析實作。

Kotlin Multiplatform 等技術讓您只需實作一次應用程式的資料層、商業層和呈現層。或者，您可以逐步採用 KMP：選擇一段經常變動且通常不同步的邏輯，例如資料驗證、篩選或排序；將其改為跨平台；然後將其作為微程式庫連接到您的專案中。

在 JetBrains，我們定期進行 Kotlin Multiplatform 調查，並詢問社群成員他們在不同平台之間共享哪些部分的程式碼。

![Kotlin Multiplatform 使用者可在平台之間共享的程式碼部分](survey-results-q1-q2-22.png){width=700}

#### 2. 節省時間

由於程式碼的可重複使用性，跨平台應用程式需要的程式碼更少，而在編碼時，少即是多。因為您不需要編寫那麼多程式碼，所以節省了時間。此外，程式碼行數減少，出現錯誤的空間也隨之減少，從而減少了測試和維護程式碼的時間。

#### 3. 有效的資源管理

建置獨立的應用程式非常昂貴。擁有單一程式碼庫有助於您有效地管理資源。您的 Android 和 iOS 開發團隊都可以學習如何編寫和使用共享程式碼。

#### 4. 對開發人員具有吸引力的機會

許多行動工程師將現代跨平台技術視為產品技術堆疊中理想的元素。開發人員在必須執行重複且例行的任務（例如 JSON 解析）時可能會感到厭倦。然而，新技術和任務可以帶回他們的興奮感、動力和工作樂趣。透過這種方式，擁有現代技術堆疊實際上可以讓您更容易招募行動開發團隊，並讓他們長期保持參與感和熱情。

#### 5. 觸及更廣泛受眾的機會

您不必在不同平台之間做出選擇。由於您的應用程式與多個作業系統相容，您可以滿足 Android 和 iOS 受眾的需求，並最大化您的觸及範圍。

#### 6. 更快的上市時間與自訂

由於您不需要為不同平台建置不同的應用程式，您可以更快地開發並發佈產品。更重要的是，如果您的應用程式需要自訂或轉型，程式設計師更容易對程式碼庫的特定部分進行微調。這也能讓您更快速地回應使用者回饋。

### 跨平台開發方法的挑戰

所有解決方案都有其局限性。技術社群中的一些人認為跨平台程式設計在效能相關的故障方面仍面臨挑戰。此外，專案負責人可能會擔心他們專注於優化開發過程可能會對應用程式的使用者體驗產生負面影響。

然而，隨著底層技術的改進，跨平台解決方案正變得日益[穩定](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)、可適應且靈活。

以下是相隔 6 個月進行的兩次關於架構使用的 Kotlin Multiplatform 使用者調查結果：

![Kotlin Multiplatform 使用情況調查結果](kmp-survey-results-2023.png){width=700}

另一個常見的擔憂是，多平台開發無法無縫支援平台的原生功能。然而，透過 Kotlin Multiplatform，您可以使用 Kotlin 的 [expected 和 actual 宣告](multiplatform-expect-actual.md)來讓您的多平台應用程式存取平台特定的 API。`expected` 和 `actual` 宣告允許您在公共程式碼中定義您「預期（expect）」能夠在多個平台呼叫相同的函式，並提供「實際（actual）」實作，由於 Kotlin 與 Java 和 Objective-C/Swift 的互通性，這些實作可以與任何平台特定的程式庫互動。

隨著現代多平台架構的不斷演進，它們越來越能讓行動工程師打造出類似原生的體驗。如果應用程式編寫得好，使用者將無法察覺差異。然而，產品的品質將很大程度上取決於您選擇的跨平台應用程式開發工具。

## 最受歡迎的跨平台解決方案

[最受歡迎的跨平台架構](cross-platform-frameworks.md)包括 Flutter、React Native 和 Kotlin Multiplatform。這些架構中的每一個都有其自身的功能和優勢。根據您使用的工具，您的開發過程和結果可能會有所不同。

### Flutter

Flutter 由 Google 建立，是一個使用 Dart 程式語言的跨平台開發架構。Flutter 支援原生功能，例如定位服務、相機功能和硬碟存取。如果您需要建立 Flutter 不支援的特定應用程式功能，您可以使用 [Platform Channel 技術](https://docs.flutter.dev/platform-integration/platform-channels)編寫平台特定程式碼。

使用 Flutter 建置的應用程式需要共享其所有的 UX 和 UI 層。這個架構最棒的優點之一是它的 Hot Reload 功能，它允許開發人員進行更改並即時查看。

在以下情況下，此架構可能是最佳選擇：

* 您希望在應用程式之間共享 UI 組件，但希望您的應用程式看起來接近原生。
* 預期應用程式會對 CPU/GPU 產生沉重負荷，且效能可能需要優化。
* 您需要開發一個 MVP（最小可行性產品）。

使用 Flutter 建置的最受歡迎應用程式包括 Google Ads、阿里巴巴的閑魚、eBay Motors 和 Hamilton。

詳細探索 [Kotlin Multiplatform 與 Flutter](kotlin-multiplatform-flutter.md)，以更好地了解它們的功能並為您的跨平台專案確定合適的選擇。

### React Native

Facebook 於 2015 年推出了 React Native，作為一個開源架構，旨在幫助行動工程師建置混合原生/跨平台應用程式。它基於 ReactJS —— 一個用於建置使用者介面的 JavaScript 程式庫。換句話說，它使用 JavaScript 為 Android 和 iOS 系統建置行動應用程式。

React Native 提供了對多個具有即用型組件的第三方 UI 程式庫的存取，幫助行動工程師在開發過程中節省時間。與 Flutter 一樣，由於 Fast Refresh 功能，它允許您立即看到所有更改。

在以下情況下，您應該考慮為您的應用程式使用 React Native：

* 您的應用程式相對簡單且預期會很輕量。
* 開發團隊精通 JavaScript 或 React。

使用 React Native 建置的應用程式包括 Facebook、Instagram、Skype 和 Uber Eats。

### Kotlin Multiplatform

Kotlin Multiplatform 是由 JetBrains 開發的一項開源技術，允許開發人員跨平台共享程式碼，同時保留原生程式設計的優點。其主要優點包括：

* 能夠在 Android、iOS、Web、桌面和伺服器端重複使用程式碼，同時在需要時保留原生程式碼。
* 與現有專案無縫整合。您可以利用平台特定的 API，同時充分利用原生和跨平台開發。
* 全面的程式碼共享靈活性，並且能夠共享邏輯和 UI，這要歸功於 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)，這是由 JetBrains 建立的現代宣告式跨平台 UI 架構。
* 當您已經在 Android 中使用 Kotlin 時，無需在程式碼庫中引入新語言。您可以重複使用您的 Kotlin 程式碼和專業知識，這使得遷移到 Kotlin Multiplatform 的風險低於其他技術。

如果您的團隊在採用新的多平台技術方面需要幫助，我們建議查閱我們的指南：[_如何向您的團隊介紹多平台開發_](multiplatform-introduce-your-team.md)。

[![開始使用 Kotlin Multiplatform](get-started-with-kmp.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

麥當勞、Netflix、9GAG、VMware、Cash App、飛利浦以及許多其他公司已經在利用 Kotlin Multiplatform 逐步整合的能力及其低採用風險。其中一些公司選擇透過共享現有 Kotlin 程式碼中特定、關鍵的部分來增強其應用程式穩定性。其他公司則旨在最大化程式碼重複使用而不損害應用程式品質，並跨行動、桌面、Web 和 TV 共享所有應用程式邏輯，同時在每個平台上保留原生 UI。這種方法的優點從已經採用它的公司的故事中可見一斑。

> 查看所有 [來自全球公司和新創公司的 Kotlin Multiplatform 案例研究](https://kotlinlang.org/case-studies/?type=multiplatform)。
>
{style="note"}

## 結論

隨著跨平台開發解決方案的不斷演進，與其提供的優點相比，其局限性已顯得微不足道。市場上有各種技術，都適合不同的工作流程和需求。本文討論的每種工具都為考慮嘗試跨平台的團隊提供了廣泛的支援。

最終，仔細考慮您特定的業務需求、目標和任務，並為您的應用程式制定明確的目標，將有助於您找到最適合的解決方案。