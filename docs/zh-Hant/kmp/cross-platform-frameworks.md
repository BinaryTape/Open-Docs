<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="cross-platform-frameworks" title="七款最受歡迎的跨平台應用程式開發架構">
    <p>多年來，跨平台應用程式開發已成為建置行動應用程式最受歡迎的方式之一。
        跨平台（或稱為多平台，multiplatform）方法允許開發者建立在不同行動平台上運作效果類似的應用程式。</p>
    <p>從 2010 年至今，大眾對此的興趣穩定增長，如下方的 Google Trends 圖表所示：</p>
    <img src="google-trends-cross-platform-new.png"
         alt="說明跨平台應用程式開發關注度的 Google Trends 圖表" width="700"/>
    <p>隨著快速進步的 <a href="cross-platform-mobile-development.topic">跨平台行動開發</a> 技術日益普及，市場上湧現了許多新工具。
        在眾多選項中，挑選最符合您需求的工具可能具有挑戰性。
        為了協助您找到合適的工具，我們整理了一份最佳跨平台應用程式開發架構及其特色功能的清單。
        在本文末尾，您還會發現為企業選擇多平台開發架構時需要注意的幾個關鍵事項。</p>
    <chapter title="什麼是跨平台應用程式開發架構？"
             id="what-is-a-cross-platform-app-development-framework">
        <p>行動工程師使用跨平台行動開發架構，透過單一程式碼庫為多個平台（如 Android 和 iOS）建置具有原生外觀的應用程式。可共享的程式碼是此方法優於原生應用程式開發的關鍵優勢之一。
            擁有單一程式碼庫意味著行動工程師可以節省時間，避免為每個作業系統編寫程式碼，從而加速開發過程。</p>
    </chapter>
    <chapter title="熱門的跨平台應用程式開發架構"
             id="popular-cross-platform-app-development-frameworks">
        <p>此清單並非窮舉；當今市場上還有許多其他選擇。重要的是要意識到，
            沒有哪一種工具是適合所有人的萬能工具。
            架構的選擇很大程度上取決於您的特定專案、目標以及我們將在本文末尾介紹的其他細節。</p>
        <p>儘管如此，我們仍嘗試挑選出一些最佳的跨平台行動開發架構，為您的決策提供起點。</p>
        <chapter title="Kotlin Multiplatform" id="kotlin-multiplatform">
            <p><a href="https://kotlinlang.org/multiplatform/">Kotlin Multiplatform (KMP)</a> 是由 JetBrains 開發的開源技術，允許在不同平台間共享程式碼，同時保留原生程式設計的優點。它使開發人員能夠根據需求重複使用儘可能多的程式碼，在必要時編寫原生程式碼，並將共用的 Kotlin 程式碼無縫整合到任何專案中。您可以將 Kotlin 與 <a
                        href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 搭配使用，這是一個現代化的宣告式跨平台 UI 架構，可用於共享高達 100% 的應用程式程式碼（包括 UI）。</p>
            <p>
                <control>程式語言：</control>
                Kotlin。
            </p>
            <p>
                <control>行動應用程式案例：</control>
                Duolingo、McDonald's、Netflix、Forbes、9GAG、Cash App、Philips。<a
                    href="https://kotlinlang.org/case-studies/?type=multiplatform">閱讀更多關於 Kotlin Multiplatform 的案例研究</a>。
            </p>
            <p>
                <control>關鍵特性：</control>
            </p>
            <list>
                <li><p>開發人員可以在 Android、iOS、Web、桌面和伺服器端重複使用程式碼，同時在需要時保留原生程式碼。</p></li>
                <li><p>Kotlin Multiplatform 可以無縫整合到任何專案中。開發人員可以利用平台特定的 API，同時發揮原生和跨平台開發的最大優勢。</p></li>
                <li><p>感謝 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a>，開發人員擁有充分的程式碼共享靈活性，並能同時共享邏輯與 UI。
                </p></li>
                <li><p>當您在 Android 開發中已使用 Kotlin 時，無需在程式碼庫中引入新語言。您可以重複使用 Kotlin 程式碼與專業知識，這使得遷移到 Kotlin Multiplatform 的風險低於其他技術。</p></li>
            </list>
            <p>儘管這款跨平台行動開發架構是清單中最年輕的成員之一，但它擁有成熟的社群。2023 年 11 月，JetBrains 將其提升至 Stable（穩定版）。在 Google I/O 2024 上，Google 宣布 <a
                        href="https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html">正式支援使用 Kotlin Multiplatform 在 Android 與 iOS 之間共享商業邏輯</a>。憑藉定期更新的 <a href="get-started.topic">文件</a> 與社群支援，您隨時可以找到問題的答案。此外，許多 <a
                        href="https://kotlinlang.org/case-studies/?type=multiplatform">全球性企業與新創公司已在使用 Kotlin Multiplatform</a> 來開發具有類原生使用者體驗的多平台應用程式。</p>
            <p><a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html"><img
                    src="kmp-journey-start.svg" alt="開啟您的 Kotlin Multiplatform 旅程" width="700"/></a></p>
        </chapter>
        <chapter title="Flutter" id="flutter">
            <p>Flutter 由 Google 於 2017 年發佈，是一款熱門架構，用於從單一程式碼庫建置行動、Web 和桌面應用程式。
                要使用 Flutter 建置應用程式，您需要使用 Google 的程式語言 Dart。</p>
            <p>
                <control>程式語言：</control>
                Dart。
            </p>
            <p>
                <control>行動應用程式案例：</control>
                eBay Motors、Alibaba、Google Pay、ByteDance 旗下的應用程式。
            </p>
            <p>
                <control>關鍵特性：</control>
            </p>
            <list>
                <li><p>Flutter 的熱重載（Hot reload）功能讓您在修改程式碼後能立即看到應用程式的變化，而無需重新編譯。</p></li>
                <li><p>Flutter 支援 Google 的 Material Design，這是一套協助開發者建置數位體驗的設計系統。
                    您在建置應用程式時可以使用多種視覺與行為小工具（widgets）。</p></li>
                <li><p>Flutter 不依賴瀏覽器技術，而是擁有自己的繪圖引擎來繪製小工具。</p></li>
            </list>
            <p>Flutter 在全球擁有相對活躍的使用者社群，並被許多開發者廣泛使用。
                根據 <a href="https://insights.stackoverflow.com/trends?tags=flutter%2Creact-native">Stack Overflow Trends</a>，基於相應標籤使用量的增加，Flutter 的使用率隨時間呈上升趨勢。</p>
            <note>
                <p>進一步了解 <a href="kotlin-multiplatform-flutter.md">Kotlin Multiplatform 與 Flutter</a> 以理解它們的優勢，並為您的跨平台開發選擇最合適的工具。</p>
            </note>
        </chapter>
        <chapter title="React Native" id="react-native">
            <p>React Native 是一款開源 UI 軟體架構，由 Meta Platforms（前身為 Facebook）於 2015 年開發。它基於 Facebook 的 JavaScript 程式庫 React，允許開發人員建置原生渲染的跨平台行動應用程式。</p>
            <p>
                <control>程式語言：</control>
                JavaScript。
            </p>
            <p>
                <control>行動應用程式案例：</control>
                React Native 被用於 Microsoft 的 Office、Skype 和 Xbox Game Pass；Meta 的 Facebook、桌面版 Messenger 和 Oculus。在 <a href="https://reactnative.dev/showcase">React Native 展示中心</a> 查看更多案例。
            </p>
            <p>
                <control>關鍵特性：</control>
            </p>
            <list>
                <li><p>感謝快速重新整理（Fast Refresh）功能，開發人員可以立即在 React 元件中看到變更。</p></li>
                <li><p>React Native 的優勢之一是專注於 UI。React 基本元素會渲染為原生平台 UI 組件，讓您能建置自訂且具備回應性的使用者介面。</p></li>
                <li><p>在 0.62 及更高版本中，預設啟用了 React Native 與行動應用程式偵錯工具 Flipper 之間的整合。Flipper 用於偵錯 Android、iOS 和 React native 應用程式，並提供日誌檢視器、互動式配置檢查器和網路檢查器等工具。</p></li>
            </list>
            <p>作為最受歡迎的跨平台應用程式開發架構之一，React Native 擁有龐大且強大的開發者社群來分享技術知識。感謝這個社群，您在建置行動應用程式時可以獲得所需的支援。</p>
        </chapter>
        <chapter title="Ionic" id="ionic">
            <p>Ionic 是一款於 2013 年發佈的開源行動 UI 工具包。它協助開發人員使用 Web 技術（如 HTML、CSS 和 JavaScript），並結合 Angular、React 和 Vue 架構的整合，從單一程式碼庫建置跨平台行動應用程式。</p>
            <p>
                <control>程式語言：</control>
                JavaScript。
            </p>
            <p>
                <control>行動應用程式案例：</control>
                T-Mobile、BBC（兒童與教育應用程式）、EA Games。
            </p>
            <p>
                <control>關鍵特性：</control>
            </p>
            <list>
                <li><p>Ionic 基於專為行動作業系統設計的 SaaS UI 架構，並提供多個用於建置應用程式的 UI 組件。</p></li>
                <li><p>Ionic 架構使用 Cordova 和 Capacitor 外掛程式來提供對裝置內建功能（如相機、手電筒、GPS 和錄音機）的存取。</p></li>
                <li><p>Ionic 擁有自己的命令列介面 Ionic CLI，這是建置 Ionic 應用程式的首選工具。</p></li>
            </list>
            <p>Ionic 架構論壇上有持續的活動，社群成員在此交流知識並互相幫助克服開發挑戰。</p>
        </chapter>
        <chapter title=".NET MAUI" id="net-maui">
            <p>.NET Multi-platform App UI (.NET MAUI) 是一款於 2022 年 5 月發佈的跨平台架構，隸屬於 Microsoft。它允許開發人員使用 C# 和 XAML 建立原生行動和桌面應用程式。.NET MAUI 是 Xamarin.Forms 的演進，後者是 Xamarin 的功能之一，為 Xamarin 支援的平台提供原生控制項。</p>
            <p>
                <control>程式語言：</control>
                C#、XAML。
            </p>
            <p>
                <control>行動應用程式案例：</control>
                NBC Sports Next、Escola Agil、Irth Solutions。
            </p>
            <p>
                <control>關鍵特性：</control>
            </p>
            <list>
                <li><p>.NET MAUI 提供跨平台 API，用於存取原生裝置功能，如 GPS、加速計、電池和網路狀態。</p></li>
                <li><p>具備單一專案系統，透過多目標定位功能來針對 Android、iOS、macOS 和 Windows 進行開發。</p></li>
                <li><p>透過支援 .NET 熱重載，開發人員可以在應用程式執行時修改受控原始碼。</p></li>
            </list>
            <p>儘管 .NET MAUI 仍是一款相對較新的架構，但它已在開發者中獲得關注，並在 Stack Overflow 和 Microsoft Q&amp;A 上擁有活躍的社群。</p>
        </chapter>
        <chapter title="Uno Platform" id="uno-platform">
            <p>Uno Platform 是一款靈活的開源技術堆疊，用於從單一共享程式碼庫建置現代跨平台 .NET 應用程式。憑藉企業級設計與內容感知 AI 工具，Uno Platform 讓開發人員能夠高效地使用 C# 和 XAML 建置原生行動、桌面、嵌入式與 WebAssembly 應用程式。Uno Platform 以將 WinUI/UWP 程式設計模型帶向 Windows 以外的多個平台而聞名，允許 .NET 開發人員在廣泛的目標平台上重複使用技能與程式碼。</p>
            <p>
                <control>程式語言：</control>
                C#、XAML。
            </p>
            <p>
                <control>應用程式案例：</control>
                來自 Toyota 與 Kahua 的遷移應用程式、TradeZero、基於 SkiaSharp 的企業級應用程式。
            </p>
            <p>
                <control>關鍵特性：</control>
            </p>
            <list>
                <li><p>Uno Platform 允許開發人員在多平台間（包括 Android、iOS、WebAssembly (WASM)、macOS、Linux 與 Windows）共享單一 UI 與商業邏輯層的同時，存取原生平台功能。它支援單一程式碼庫與專案結構，並透過多目標定位，使用與 WinUI 相容的 API 在多個平台上執行相同的應用程式。</p></li>
                <li><p>配合 Uno Platform Studio，.NET 開發人員可以透過具備熱重載（Hot Reload）功能的 Hot Design 視覺化設計器獲得顯著的生產力提升，實現最快的 C#/XAML 開發迴圈，並能利用可靠的 AI 代理（AI Agents）或 MCP 工具獲得內容感知 AI 智慧與技術堆疊的靈活性——這一切都旨在協助開發者從任何作業系統、編輯器或 AI 代理建置跨平台應用程式。</p></li>
            </list>
            <p>Uno Platform 擁有強大的開源社群，並被廣泛應用於企業級與業務營運應用程式，特別是那些已經投入 .NET 生態系統的團隊。</p>
        </chapter>
        <chapter title="NativeScript" id="nativescript">
            <p>這款開源行動應用程式開發架構最初於 2014 年發佈。NativeScript 允許您使用 JavaScript 或可轉譯為 JavaScript 的語言（如 TypeScript），以及 Angular 和 Vue.js 等架構來建置 Android 和 iOS 行動應用程式。</p>
            <p>
                <control>程式語言：</control>
                JavaScript、TypeScript。
            </p>
            <p>
                <control>行動應用程式案例：</control>
                Daily Nanny、Strudel、Breethe。
            </p>
            <p>
                <control>關鍵特性：</control>
            </p>
            <list>
                <li><p>NativeScript 允許開發人員輕鬆存取原生 Android 和 iOS API。</p></li>
                <li><p>該架構渲染平台原生 UI。使用 NativeScript 建置的應用程式直接在原生裝置上執行，而不依賴 WebViews（Android 作業系統的一種系統組件，允許 Android 應用程式在應用程式內部顯示來自 Web 的內容）。</p></li>
                <li><p>NativeScript 提供各種外掛程式和預建的應用程式範本，消除了對第三方解決方案的需求。</p></li>
            </list>
            <p>NativeScript 基於眾所周知的 Web 技術（如 JavaScript 和 Angular），這也是許多開發者選擇此架構的原因。儘管如此，它通常被小型公司和新創公司使用。</p>
        </chapter>
    </chapter>
    <chapter title="如何為您的專案選擇合適的跨平台應用程式開發架構？"
             id="how-do-you-choose-the-right-cross-platform-app-development-framework-for-your-project">
        <p>除了上述提到的架構外，還有其他的跨平台架構，而且新工具將會不斷在市場上出現。面對眾多選擇，您該如何為下一個專案找到合適的工具？第一步是了解專案的需求與目標，並清楚勾勒出未來應用程式的樣貌。接著，您需要考慮以下重要因素，以便決定最適合您企業的方案。</p>
        <chapter title="1. 團隊的專業知識" id="1-the-expertise-of-your-team">
            <p>不同的跨平台行動開發架構基於不同的程式語言。在採用架構之前，請檢查其所需的技能，並確保您的行動工程師團隊具備足夠的知識和經驗來使用它。</p>
            <p>例如，如果您的團隊擁有高技能的 JavaScript 開發人員，且您沒有足夠資源來引入新技術，那麼選擇使用此語言的架構（如 React Native）可能是值得的。</p>
        </chapter>
        <chapter title="2. 供應商的可信度與支援" id="2-vendor-reliability-and-support">
            <p>確保架構的維護者長期持續支援至關重要。進一步了解開發和支援您所考慮架構的公司，並查看使用這些架構建置的行動應用程式。</p>
        </chapter>
        <chapter title="3. UI 自訂化" id="3-ui-customization">
            <p>根據使用者介面對於您未來應用程式的重要性，您可能需要了解使用特定架構自訂 UI 的難易程度。例如，Kotlin Multiplatform 透過 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 提供充分的程式碼共享靈活性，這是由 JetBrains 開發的現代宣告式跨平台 UI 架構。它基於 Kotlin 和 Jetpack Compose，使開發人員能在 Android、iOS、Web 和桌面（透過 JVM）之間共享 UI。</p>
            <p><a href="https://www.jetbrains.com/compose-multiplatform/"><img src="explore-compose.svg"
                                                                               alt="探索 Compose Multiplatform"
                                                                               width="700"/></a></p>
        </chapter>
        <chapter title="4. 架構成熟度" id="4-framework-maturity">
            <p>了解預期架構的公開 API 和工具更迭頻率。例如，對原生作業系統組件的某些更改可能會破壞內部的跨平台行為。事先意識到在使用該行動應用程式開發架構時可能面臨的挑戰會更好。您也可以瀏覽 GitHub，查看該架構有多少錯誤（bugs）以及這些錯誤是如何被處理的。</p>
        </chapter>
        <chapter title="5. 架構功能" id="5-framework-capabilities">
            <p>每個架構都有其功能與限制。了解架構提供的功能與工具對於識別最佳解決方案至關重要。它是否具備程式碼分析器和單元測試架構？建置、偵錯和測試應用程式的速度與簡易度如何？</p>
        </chapter>
        <chapter title="6. 安全性" id="6-security">
            <p>在建置關鍵的企業行動應用程式（如包含支付系統的銀行和電子商務應用程式）時，安全性與隱私尤為重要。根據 <a
                        href="https://owasp.org/www-project-mobile-top-10/">OWASP Mobile Top 10</a>，行動應用程式最關鍵的安全風險包括不安全的資料存儲以及身份驗證/授權問題。</p>
            <p>您需要確保所選的多平台行動開發架構能提供所需的安全性水準。一種方法是瀏覽該架構的問題追蹤器（如果有的話）上的安全票證（security tickets）。</p>
        </chapter>
        <chapter title="7. 教育資源" id="7-educational-materials">
            <p>關於該架構的學習資源量與品質也能幫助您了解在使用它時的體驗是否流暢。詳盡的官方 <a href="get-started.topic">文件</a>、線上與實體會議以及教育課程，都是一個良好的信號，代表您在需要時能找到足夠的產品關鍵資訊。</p>
            <p>例如，我們整理了一份 <a href="kmp-learning-resources.md">詳盡的 Kotlin Multiplatform 學習材料清單</a>。</p>
        </chapter>
    </chapter>
    <chapter title="關鍵要點" id="key-takeaways">
        <p>若不考慮這些因素，很難選擇出最能滿足您特定需求的跨平台行動開發架構。仔細審視您未來的應用程式需求，並將其與各類架構的功能進行權衡。這樣做將能幫助您找到合適的跨平台解決方案，協助您交付高品質的應用程式。</p>
    </chapter>
    <chapter title="常見問題" id="frequently-asked-questions">
        <p>
            <control>問：什麼是跨平台應用程式開發架構？</control>
        </p>
        <p>答：跨平台應用程式開發架構是一套用於透過共享程式碼為多個平台建置應用程式的工具與程式庫。它支援 Android、iOS、桌面與 Web 等平台，同時在需要時仍允許編寫平台特定程式碼。</p>
        <p>
            <control>問：為什麼會有這麼多種跨平台應用程式開發架構？</control>
        </p>
        <p>答：之所以有多種跨平台應用程式開發架構，是因為不同的專案有不同的需求。這些架構在工具鏈、支援的平台以及生態系統成熟度等領域各有不同。</p>
        <p>
            <control>問：是什麼讓一款跨平台應用程式開發架構受歡迎？</control>
        </p>
        <p>答：當一款跨平台應用程式開發架構提供強大的工具、清晰的文件、可靠的平台支援以及活躍的社群時，它就會變得受歡迎。如果它被廣泛使用且定期維護，也更有可能保持受歡迎程度。</p>
        <p>
            <control>問：跨平台應用程式開發架構只用於行動應用程式嗎？</control>
        </p>
        <p>答：不一定。雖然許多跨平台應用程式開發架構主要用於行動應用程式，但根據其架構與支援的目標平台，有些架構也可以支援 Web 或桌面等額外平台。</p>
        <p>
            <control>問：跨平台應用程式開發架構支援原生平台功能嗎？</control>
        </p>
        <p>答：是的。大多數跨平台應用程式開發架構透過平台 API、外掛程式或橋接機制提供對原生平台功能的存取。這允許應用程式架構在共享通用程式碼的同時，支援平台特定的功能。</p>
        <p>
            <control>問：開發者應如何評估不同的跨平台應用程式開發架構？</control>
        </p>
        <p>答：開發者應根據平台支援、工具品質、生態系統成熟度、效能需求以及長期可維護性來評估跨平台應用程式開發架構。此外，考慮各應用程式架構與原生 API 的整合程度，以及是否符合團隊的技能與工作流程也非常有用。</p>
    </chapter>
</topic>