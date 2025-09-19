<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="kotlin-multiplatform-react-native"
       title="Kotlin Multiplatform 對比 React Native：跨平台比較">
<include-in-head>
<![CDATA[
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [{
            "@type": "Question",
            "name": "Kotlin Multiplatform 是否已可用於正式環境？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "<p>Kotlin Multiplatform 是一項穩定技術，已可用於正式環境。這意味著您可以在生產環境中，跨 Android、iOS、桌面 (JVM)、伺服器端 (JVM) 和網頁共享程式碼，即使在最保守的使用情境下也無妨。Compose Multiplatform 是一個用於跨平台構建共享 UI 的框架 (由 Kotlin Multiplatform 和 Google 的 Jetpack Compose 提供支援)，在 iOS、Android 和桌面端已穩定。網頁支援目前處於 Beta 階段。</p>"
            }
          }, {
            "@type": "Question",
            "name": "Kotlin Multiplatform 比 React Native 更好嗎？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kotlin Multiplatform 和 React Native 各有其優點，選擇取決於您專案的特定目標、技術要求和團隊專業知識。在上述比較中，我們概述了程式碼共享、建構工具、編譯和生態系統等方面的關鍵差異，以幫助您決定哪種選項最適合您的使用情境。"
            }
          }, {
            "@type": "Question",
            "name": "Google 是否支援 Kotlin Multiplatform？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "在 Google I/O 2024 上，Google 宣布正式支援在 Android 上使用 Kotlin Multiplatform，以在 Android 和 iOS 之間共享業務邏輯。"
            }
          }, {
            "@type": "Question",
            "name": "學習 Kotlin Multiplatform 值得嗎？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "如果您有興趣在 Android、iOS、桌面和網頁之間共享程式碼，同時保留原生效能和彈性，那麼學習 Kotlin Multiplatform 是值得的。它由 JetBrains 支持，並由 Google 在 Android 上正式支援，以在 Android 和 iOS 之間共享業務邏輯。此外，KMP 與 Compose Multiplatform 正日益被構建多平台應用程式的公司用於正式環境中。"
            }
          }]
        }
        </script>
]]>
</include-in-head>
<web-summary>探索 Kotlin Multiplatform 搭配 Compose Multiplatform 與 React Native 在程式碼共享、生態系統和 UI 渲染方面的比較 — 了解哪種工具組合最適合您的團隊。
    </web-summary>
<tip>
        <p>這篇比較文章強調，Kotlin Multiplatform 在 Android 和 iOS 上提供真正的原生體驗，並可完全存取平台 API，表現卓越。
            KMP 對於注重效能、可維護性以及原生外觀和感覺的團隊特別有吸引力，尤其是在使用 Compose Multiplatform 共享 UI 程式碼時。
            同時，React Native 可能更適合具備 JavaScript 專業知識的團隊，特別是用於快速原型開發。</p>
    </tip>
<p>跨平台開發已顯著改變了團隊構建應用程式的方式，使其能夠從共享程式碼庫為多個平台交付應用程式。這種方法簡化了開發，並有助於確保跨裝置的使用者體驗更加一致。</p>
<p>過去，為 Android 和 iOS 進行開發意味著要維護兩個獨立的程式碼庫，通常由不同的團隊負責，這導致了重複的努力和平台之間顯著的差異。跨平台解決方案加速了產品上市時間並提高了整體效率。</p>
<p>在可用的工具中，Kotlin Multiplatform、React Native 和 Flutter 脫穎而出，成為三個最廣泛採用的選項。在本文中，我們將仔細探討這兩者，以幫助您為產品和團隊選擇合適的選項。</p>
<chapter title="Kotlin Multiplatform 與 Compose Multiplatform" id="kotlin-multiplatform-and-compose-multiplatform">
        <p><a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform (KMP)</a> 是一項由 JetBrains 開發的開源技術，可實現 Android、iOS、桌面 (Windows、macOS、Linux)、網頁和後端之間的程式碼共享。它允許開發人員在多個環境中重用 Kotlin，同時保持原生功能和效能。</p>
        <p>採用率正在穩步上升：在過去兩次 <a href="https://www.jetbrains.com/lp/devecosystem-2024/">開發人員生態系統調查</a> 的受訪者中，Kotlin Multiplatform 的使用量在一年內增加了一倍多 — 從 2024 年的 7% 增長到 2025 年的 18% — 這清楚表明了其日益增長的發展勢頭。</p>
        <img src="kmp-growth-deveco.svg"
             alt="KMP usage increased from 7% in 2024 to 18% in 2025 among respondents to the last two Developer Ecosystem surveys"
             width="700"/>
        <p><a href="https://www.jetbrains.com/kotlin-multiplatform/"><img src="discover-kmp.svg"
                                                                          alt="探索 Kotlin Multiplatform"
                                                                          style="block"
                                                                          width="500"/></a></p>
        <p>透過 KMP，您可以選擇您的共享策略：從共享所有程式碼（應用程式進入點除外），到共享單一邏輯 (例如網路或資料庫模組)，或共享業務邏輯同時保持 UI 原生。</p>
        <p>若要跨平台共享 UI 程式碼，您可以使用 <a
                href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/">Compose Multiplatform</a>
            — JetBrains 基於 Kotlin Multiplatform 和 Google 的 Jetpack Compose 構建的現代宣告式框架。它在 <a href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/?_gl=1*dcswc7*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTA2NzU0MzQkbzM2JGcxJHQxNzUwNjc1NjEwJGo2MCRsMCRoMA..">iOS</a>、Android 和桌面端已穩定，網頁支援目前處於 Beta 階段。</p>
        <p><a href="https://www.jetbrains.com/compose-multiplatform/"><img src="explore-compose.svg"
                                                                           alt="探索 Compose Multiplatform"
                                                                           style="block"
                                                                           width="500"/></a></p>
        <p>Kotlin Multiplatform 最初於 Kotlin 1.2 (2017) 推出，於 2023 年 11 月達到 <a
                href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/">穩定版狀態</a>。在 Google I/O 2024 上，Google 宣布 <a
                    href="https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html">正式支援在 Android 上使用 Kotlin Multiplatform</a>，以在 Android 和 iOS 之間共享業務邏輯。
        </p>
    </chapter>
<chapter title="React Native" id="react-native">
        <p>React Native 是一個開源框架，用於使用 <a
                href="https://reactjs.org/">React</a> (一個用於網頁和原生使用者介面的函式庫) 以及應用程式平台的原生功能來構建 Android 和 iOS 應用程式。React Native 允許開發人員使用 JavaScript 來存取其平台的 API，並使用 React 元件 (可重用、可巢狀的程式碼包) 來描述 UI 的外觀和行為。</p>
        <p>React Native 於 2015 年 1 月在 React.js Conf 上首次宣布。同年晚些時候，Meta 在 F8 2015 上發布了 React Native，並從那時起一直維護它。</p>
        <p>儘管 Meta 負責監督 React Native 產品，但 <a
                href="https://github.com/facebook/react-native/blob/HEAD/ECOSYSTEM.md">React Native 生態系統</a>
            由合作夥伴、核心貢獻者和活躍社群組成。如今，該框架由全球個人和公司的貢獻所支持。</p>
    </chapter>
<chapter title="Kotlin Multiplatform 對比 React Native：並排比較"
             id="kotlin-multiplatform-vs-react-native-side-by-side-comparison">
        <table style="both">
            <tr>
                <td></td>
                <td><b>Kotlin Multiplatform</b></td>
                <td><b>React Native</b></td>
            </tr>
            <tr>
                <td><b>創始者</b></td>
                <td>JetBrains</td>
                <td>Meta</td>
            </tr>
            <tr>
                <td><b>語言</b></td>
                <td>Kotlin</td>
                <td>JavaScript、TypeScript</td>
            </tr>
            <tr>
                <td><b>彈性與程式碼重用</b></td>
                <td>您可以共享程式碼庫的任何部分，包括業務邏輯和/或 UI，從 1% 到 100% 不等。可以逐步採用，或從頭開始用於構建跨平台且具有原生體驗的應用程式。
                </td>
                <td>跨平台重用業務邏輯和 UI 元件，從單一功能到完整應用程式皆可。可將 React Native 添加到現有的原生應用程式中，以構建新的畫面或使用者流程。
                </td>
            </tr>
            <tr>
                <td><b>套件、依賴項與生態系統</b></td>
                <td>套件可從 <a href="https://central.sonatype.com/">Maven Central</a> 和其他儲存庫取得，包括
                    <p><a href="http://klibs.io">klibs.io</a> (Alpha 版本)，其旨在簡化 KMP 函式庫的搜尋。</p>
                    <p>此 <a href="https://github.com/terrakok/kmp-awesome">列表</a> 包含一些最受歡迎的 KMP 函式庫和工具。</p></td>
                <td><a href="https://reactnative.dev/docs/libraries">React Native 函式庫</a> 通常是從 <a href="https://www.npmjs.com/">npm registry</a> 使用 Node.js 套件管理器安裝，例如
                    <a href="https://docs.npmjs.com/cli/npm">npm CLI</a> 或 <a href="https://classic.yarnpkg.com/en/">Yarn Classic</a>。
                </td>
            </tr>
            <tr>
                <td><b>建構工具</b></td>
                <td>Gradle (加上 Xcode，用於針對 Apple 裝置的應用程式)。</td>
                <td>React Native 命令列工具和 <a href="https://metrobundler.dev/">Metro bundler</a>，它們在底層呼叫 Gradle 處理 Android，以及 Xcode 建構系統處理 iOS。
                </td>
            </tr>
            <tr>
                <td><b>目標環境</b></td>
                <td>Android、iOS、網頁、桌面和伺服器端。</td>
                <td>Android、iOS、網頁和桌面。
                    <p>對網頁和桌面的支援透過社群和合作夥伴主導的專案提供，例如 <a
                            href="https://github.com/necolas/react-native-web">React Native Web</a>、<a
                            href="https://github.com/microsoft/react-native-windows">React Native Windows</a> 和 <a
                            href="https://github.com/microsoft/react-native-macos">React Native macOS</a>。</p></td>
            </tr>
            <tr>
                <td><b>編譯</b></td>
                <td>編譯為桌面和 Android 的 JVM 位元碼，網頁上的 JavaScript 或 Wasm，以及原生平台的平台專屬二進位檔。
                </td>
                <td>React Native 使用 Metro 來建構 JavaScript 程式碼和資產。
                    <p>React Native 內建了 <a
                            href="https://reactnative.dev/docs/hermes">Hermes</a> 的版本，它在建構期間將 JavaScript 編譯為 Hermes 位元碼。React Native 也支援使用 JavaScriptCore 作為 <a
                                href="https://reactnative.dev/docs/javascript-environment">JavaScript 引擎</a>。</p>
                    <p>原生程式碼由 Android 上的 Gradle 和 iOS 上的 Xcode 編譯。</p></td>
            </tr>
            <tr>
                <td><b>與原生 API 通訊</b></td>
                <td>由於 Kotlin 與 Swift/Objective-C 和 JavaScript 之間的互通性，原生 API 可以直接從 Kotlin 程式碼存取。
                </td>
                <td>React Native 暴露了一組 API，用於將您的原生程式碼連接到 JavaScript 應用程式程式碼：原生模組 (Native Modules) 和原生元件 (Native Components)。新架構 (New Architecture) 使用 <a
                            href="https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md">Turbo Native Module</a> 和 <a
                            href="https://github.com/reactwg/react-native-new-architecture/blob/main/docs/fabric-native-components.md">Fabric Native Components</a> 來實現類似的結果。
                </td>
            </tr>
            <tr>
                <td><b>UI 渲染</b></td>
                <td><a href="https://www.jetbrains.com/compose-multiplatform/">Compose Multiplatform</a> 可用於跨平台共享 UI，其基於 Google 的 Jetpack Compose，並使用相容於 OpenGL、ANGLE (將 OpenGL ES 2 或 3 呼叫轉換為原生 API)、Vulkan 和 Metal 的 Skia 引擎。
                </td>
                <td>React Native 包含一組平台無關的核心原生元件，例如 <code>View</code>、
                    <code>Text</code> 和 <code>Image</code>，這些元件直接對應到平台的原生 UI 建構區塊，例如 iOS 上的 <code>UIView</code> 和 Android 上的 <code>android.view</code>。
                </td>
            </tr>
            <tr>
                <td><b>UI 開發迭代</b></td>
                <td>即使是通用程式碼也能提供 UI 預覽。
                    <p>透過 <a href="compose-hot-reload.md">Compose Hot Reload</a>，您可以立即看到 UI 變更，而無需重新啟動應用程式或丟失其狀態。</p></td>
                <td><a href="https://reactnative.dev/docs/fast-refresh">Fast Refresh</a> 是 React Native 的一項功能，讓您可以對 React 元件中的變更獲得近乎即時的回饋。
                </td>
            </tr>
            <tr>
                <td><b>使用該技術的公司</b></td>
                <td>
                    <a href="https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/">Forbes</a>、
                    <a href="https://www.youtube.com/watch?v=z-o9MqN86eE">Todoist</a>、<a
                        href="https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc">McDonald's</a>、
                    <a href="https://youtu.be/5lkZj4v4-ks?si=DoW00DU7CYkaMmKc">Google Workspace</a>、<a
                        href="https://www.youtube.com/watch?v=hZPL8QqiLi8">Philips</a>、<a
                        href="https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04">9gag</a>、
                    <a href="https://kotlinlang.org/lp/multiplatform/case-studies/baidu">Baidu</a>、<a
                        href="https://kotlinlang.org/lp/multiplatform/case-studies/autodesk/">Autodesk</a>、<a
                        href="https://touchlab.co/">TouchLab</a>、<a href="https://www.youtube.com/watch?v=YsQ-2lQYQ8M">Instabee</a>
                    等公司，在我們的 <a href="case-studies.topic">KMP 案例研究</a>中均有列出。</td>
                <td>Facebook、<a href="https://engineering.fb.com/2024/10/02/android/react-at-meta-connect-2024/">Instagram</a>、
                    <a href="https://devblogs.microsoft.com/react-native/">Microsoft Office</a>、<a
                            href="https://devblogs.microsoft.com/react-native/">Microsoft Outlook</a>、Amazon Shopping、
                    <a href="https://medium.com/mercari-engineering/why-we-decided-to-rewrite-our-ios-android-apps-from-scratch-in-react-native-9f1737558299">Mercari</a>、
                    Tableau、<a href="https://github.com/wordpress-mobile/gutenberg-mobile">WordPress</a>、<a
                            href="https://nearform.com/work/puma-scaling-across-the-globe/">Puma</a>、PlayStation App
                    等公司，在 <a href="https://reactnative.dev/showcase">React Native Showcase</a> 中均有列出。
                </td>
            </tr>
        </table>
        <p>您也可以參考 <a href="kotlin-multiplatform-flutter.md">Kotlin Multiplatform 和 Flutter</a> 的比較。</p>
    </chapter>
<chapter title="為您的專案選擇合適的跨平台技術"
             id="choosing-the-right-cross-platform-technology-for-your-project">
        <p>決定選擇哪種跨平台框架並非要找到一個萬能的解決方案 — 而是要為您的專案目標、技術要求和團隊專業知識選擇最合適的選項。無論您是構建一個具有複雜 UI 的功能豐富產品，還是旨在利用現有技能快速啟動，正確的選擇將取決於您的特定優先級。請考慮您對 UI 自訂的控制程度、長期穩定性的重要性，以及您計劃支援哪些平台。</p>
        <p>具有 JavaScript 經驗的團隊可能會發現 React Native 是一個實用的選擇，特別是用於快速原型開發。另一方面，Kotlin Multiplatform 提供不同層次的整合：它能產生完全原生的 Android 應用程式，並編譯為 iOS 上的原生二進位檔，可無縫存取原生 API。UI 可以完全原生，也可以透過 Compose Multiplatform 共享，後者使用高效能圖形引擎精美地呈現。這使得 KMP 對於那些優先考慮原生外觀和感覺、可維護性以及效能，同時仍能從程式碼共享中受益的團隊特別有吸引力。</p>
        <p>您可以在我們關於如何選擇適合您下一個專案的 <a
                href="cross-platform-frameworks.md">跨平台開發框架</a> 的詳細文章中找到更多指導。</p>
    </chapter>
<chapter title="常見問題" id="frequently-asked-questions">
        <p>
            <control>Q: Kotlin Multiplatform 是否已可用於正式環境？</control>
        </p>
        <p>A: Kotlin Multiplatform 是一項<a
                href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/">穩定技術，已可用於正式環境</a>。這意味著您可以在生產環境中，跨 Android、iOS、桌面 (JVM)、伺服器端 (JVM) 和網頁共享程式碼，即使在最保守的使用情境下也無妨。</p>
        <p>Compose Multiplatform 是一個用於跨平台構建共享 UI 的框架 (由 Kotlin Multiplatform 和 Google 的 Jetpack Compose 提供支援)，在 iOS、Android 和桌面端已穩定。網頁支援目前處於 Beta 階段。</p>
        <p>
            <control>Q: Kotlin Multiplatform 比 React Native 更好嗎？</control>
        </p>
        <p>A: Kotlin Multiplatform 和 React Native 各有其優點，選擇取決於您專案的特定目標、技術要求和團隊專業知識。在上述比較中，我們概述了程式碼共享、建構工具、編譯和生態系統等方面的關鍵差異，以幫助您決定哪種選項最適合您的使用情境。</p>
        <p>
            <control>Q: Google 是否支援 Kotlin Multiplatform？</control>
        </p>
        <p>A: 在 Google I/O 2024 上，Google 宣布 <a
                href="https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html">正式支援在 Android 上使用 Kotlin Multiplatform</a>，以在 Android 和 iOS 之間共享業務邏輯。</p>
        <p>
            <control>Q: 學習 Kotlin Multiplatform 值得嗎？</control>
        </p>
        <p>A: 如果您有興趣在 Android、iOS、桌面和網頁之間共享程式碼，同時保留原生效能和彈性，那麼學習 Kotlin Multiplatform 是值得的。它由 JetBrains 支持，並由 Google 在 Android 上正式支援，以在 Android 和 iOS 之間共享業務邏輯。此外，KMP 與 Compose Multiplatform 正日益被構建多平台應用程式的公司用於正式環境中。</p>
    </chapter>
</topic>