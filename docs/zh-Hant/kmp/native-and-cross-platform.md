<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="native-and-cross-platform"
       title="跨平台與原生應用程式開發：該如何選擇？">
    <web-summary>了解何時選擇原生或跨平台開發。查看 Kotlin Multiplatform 如何結合共享邏輯與原生效能。
    </web-summary>
    <p>2025–2026 年的行動應用程式開發是由不斷提高的使用者期望、多平台需求以及對高效能體驗的需求所定義的。使用者期望應用程式快速、反應靈敏，並能與他們的裝置無縫整合，無論他們使用的是 iOS 還是 Android。</p>
    <p>這為團隊帶來了一個關鍵的決定：他們應該投資於原生應用程式開發，還是採用跨平台行動應用程式開發來同時為多個平台進行組建？選擇正確的方法直接影響效能、開發速度和長期維護。</p>
    <p>在本指南中，我們將分析原生、跨平台和混合開發之間的差異，並協助您為您的專案選擇最佳方法。</p>
    <chapter title="原生、跨平台與混合應用程式開發：關鍵差異"
             id="native-cross-platform-and-hybrid-app-development-key-differences">
        <p>在選擇開發方法之前，瞭解原生、跨平台和混合應用程式在架構、效能和開發過程方面的差異非常重要。</p>
        <p>
            <b>原生應用程式開發：</b>
            原生應用程式是專門為單一平台（如 iOS 或 Android）組建的，使用平台特定的語言和工具，如 Swift、Objective-C、Kotlin 或 Java。這種方法提供最高水準的效能、對裝置硬體的完整存取權限，以及與作業系統完全整合的使用者體驗。
        </p>
        <p>
            <b>跨平台應用程式開發：</b>
            <a href="cross-platform-mobile-development.topic">跨平台開發</a>允許團隊使用共享程式碼庫為多個平台組建應用程式。現代架構如 <a
                href="https://kotlinlang.org/multiplatform/">Kotlin Multiplatform (KMP)</a>、Flutter 和 React Native 使開發人員能夠在 iOS 和 Android 之間重複使用商務邏輯。這種方法加快了開發速度並簡化了維護，同時仍提供接近原生的效能。
        </p>
        <p><a href="https://kotlinlang.org/multiplatform/"><img src="discover-kmp.svg"
                                                                alt="探索 Kotlin Multiplatform" width="600"/></a>
        </p>
        <p>
            <b>混合應用程式開發：</b>
            混合應用程式本質上是使用 HTML、CSS 和 JavaScript 組建的 Web 應用程式，封裝在原生容器中。雖然這種方法的實作速度快且具成本效益，但通常在效能、回應能力和裝置功能存取方面存在限制。
        </p>
        <p>最終的選擇取決於您的優先事項：您看重的是效能、更快的上市時間，還是團隊內的專業知識。</p>
    </chapter>
    <chapter title="比較開發方法" id="comparing-development-approaches">
        <p>在原生、跨平台和混合開發之間做出選擇，取決於每種方法如何平衡效能、開發速度和長期維護。</p>
        <chapter title="原生開發" id="native-development">
            <p>原生應用程式是使用平台特定的語言和 SDK 組建的，例如用於 iOS 的 Swift 或用於 Android 的 Kotlin 和 Java。它們提供對硬體功能的完整存取權限，使其成為效能密集型應用程式（如遊戲、AR/VR 體驗或具有複雜圖形的應用程式）的理想選擇。</p>
            <p>它們提供流暢且反應靈敏的使用者體驗、強大的離線功能，以及與平台準則的高度一致，這可以提高應用程式在線上商店的曝光度。然而，原生開發需要為每個平台提供獨立的程式碼庫，這增加了開發和維護成本。</p>
        </chapter>
        <chapter title="跨平台開發" id="cross-platform-development">
            <p>跨平台開發允許團隊在多個平台之間共享大部分程式碼（通常在 60% 至 95% 之間）。現今有多種開源的跨平台行動應用程式開發架構可供選擇。Kotlin Multiplatform、Flutter 和 React Native 等工具允許開發人員在保持實作彈性的同時重複使用程式碼。</p>
            <p>這種方法減少了組建和維護獨立程式碼庫的需求，可以顯著加快開發速度並降低總體成本。團隊可以更快地交付功能、重複使用現有邏輯，並同時跨平台套用更新，這使得跨平台開發對於具有複雜商務需求的產品特別有效。</p>
            <p>現代架構也使得在程式碼共享與平台特定自訂之間取得平衡變得更加容易。例如，在跨平台一致性更為重要的地方，開發人員可以共享核心邏輯，同時保持具有原生感的 UI，或根據需要重複使用個別 UI 組件。</p>
            <p>儘管如此，權衡仍然存在。根據所使用的架構，存取平台特定的 API 或實作高度專業化的功能可能需要額外的努力。效能通常接近原生，但在涉及密集圖形或即時處理的邊緣情況下可能會有所不同。</p>
            <note>
                <p>探索像 <a href="use-cases-examples.md">Kotlin Multiplatform 這樣的跨平台技術如何在不同行業和團隊結構的生產環境中使用</a>。</p>
            </note>
        </chapter>
        <chapter title="混合開發" id="hybrid-development">
            <p>混合應用程式在原生外殼中使用 Web 技術，使其成為最容易且最快組建的應用程式。它們適用於簡單的應用程式、原型或內部工具。</p>
            <p>然而，混合應用程式通常缺乏回應能力，且在效能以及與裝置功能的深度整合方面面臨挑戰，這使得它們不太適合生產級的消費型應用程式。</p>
        </chapter>
    </chapter>
    <chapter title="您應該在何時選擇原生應用程式開發？" id="when-should-you-choose-native-app-development">
        <p>在一些特定的案例中，選擇原生行動開發是有意義的。在以下情況下，您應該考慮原生開發：</p>
        <list>
            <li>
                <p>
                    <b>您只針對單一平台。</b>
                    如果您的產品僅專注於 iOS 或 Android，採用原生方式組建可以簡化開發，並允許您針對該生態系統進行全面優化。
                </p>
            </li>
            <li>
                <p>
                    <b>您的應用程式屬於硬體密集型。</b>
                    高度依賴裝置能力（如相機處理、GPS、感測器或即時互動）的應用程式，可從對平台 API 的完整存取中獲益。這包括擴增實境 (AR)、遊戲和影片處理等使用案例。
                </p>
            </li>
            <li>
                <p>
                    <b>使用者介面對您的應用程式至關重要。</b>
                    如果您的產品依賴於提供高度精緻、平台特定的介面，原生開發允許您充分利用平台設計模式和 UI 能力。然而，即使在這種情況下，您也不必完全放棄程式碼共享，因為像 Kotlin Multiplatform 這樣的現代多平台解決方案可以讓您跨平台共享商務邏輯，同時保持 UI 完全原生。
                </p>
            </li>
            <li>
                <p>
                    <b>您依賴於平台特定的功能或頻繁的 OS 更新。</b>
                    如果您的應用程式需要快速採用新的 iOS 或 Android 功能，原生開發允許您整合更新，而無需等待第三方架構的支援。
                </p>
            </li>
        </list>
        <note>
            <p>註：您可以在我們的文件中進一步了解 <a href="https://kotlinlang.org/docs/android-overview.html">Android 版 Kotlin</a>。</p>
        </note>
    </chapter>
    <chapter title="您應該在何時選擇跨平台應用程式開發？"
             id="when-should-you-choose-cross-platform-app-development">
        <p>當您需要高效地跨多個平台交付應用程式並維護共享程式碼庫時，跨平台應用程式開發是一個強大的選擇。</p>
        <p>在以下情況下，您應該考慮此方法：</p>
        <list>
            <li>
                <p>
                    <b>您同時針對 iOS 和 Android。</b>
                    如果您的產品需要觸及多個平台的使用者，跨平台開發讓您能夠組建並維護單一程式碼庫，而不是管理多個獨立的應用程式。
                </p>
            </li>
            <li>
                <p>
                    <b>上市時間至關重要。</b>
                    跨平台共享程式碼可減少開發工作並加快交付速度。這使得更快發佈新功能以及快速回應使用者回饋變得更加容易。
                </p>
            </li>
            <li>
                <p>
                    <b>您想要優化開發和維護成本。</b>
                    透過共享程式碼庫，團隊可以減少重複工作並簡化長期維護，這對於新創公司和成長中的產品尤為重要。
                </p>
            </li>
            <li>
                <p>
                    <b>您的應用程式具有複雜的商務邏輯。</b>
                    當您的應用程式邏輯中有大部分可以跨平台重複使用（例如網路連線、資料處理或領域邏輯）時，跨平台解決方案特別有效。
                </p>
            </li>
            <li>
                <p>
                    <b>您想要平衡程式碼共享與原生能力。</b>
                    並非所有的跨平台方法都相同。例如，Kotlin Multiplatform 允許您共享商務邏輯同時保持 UI 原生，在不犧牲效能或使用者體驗的情況下提供彈性。如果您還想跨平台共享 UI，<a
                        href="https://kotlinlang.org/compose-multiplatform/">Compose Multiplatform</a> 這款宣告式架構讓您能夠從單一程式碼庫重複使用 UI 程式碼，同時仍能針對多個平台。
                </p>
            </li>
        </list>
        <p>跨平台開發不斷演進，現代工具持續減少傳統上在效能與生產力之間的權衡。</p>
        <note>
            <p>查看展示 Kotlin Multiplatform 強大且獨特應用的專案列表 → <a href="multiplatform-samples.md">Kotlin Multiplatform 範例</a>。</p>
        </note>
    </chapter>
    <chapter title="熱門跨平台架構" id="popular-cross-platform-frameworks">
        <p>現今有幾種跨平台架構可供選擇，每種架構在程式碼共享、效能和開發人員體驗方面都有其獨特的方法。正確的選擇取決於您的專案需求和團隊專業知識。</p>
        <list>
            <li>
                <p>
                    <b>Kotlin Multiplatform (KMP)</b>。
                    來自 JetBrains 的開源技術，允許開發人員在 Android、iOS、桌面、Web 和伺服器端共享 Kotlin 程式碼，同時保留原生開發的優勢。
                </p>
            </li>
            <li>
                <p>
                    <b>Flutter</b>。
                    Google 的開源架構，用於從單一程式碼庫組建原生編譯的多平台應用程式。它以開發速度快和社群龐大而聞名。
                </p>
            </li>
            <li>
                <p>
                    <b>React Native</b>。
                    Meta 的開源架構，允許您使用 JavaScript 和 React 組建行動應用程式。它提供快速的反覆運算以及廣泛的程式庫和工具生態系統。
                </p>
            </li>
            <li>
                <p>
                    <b>.NET Multiplatform App UI (.NET MAUI)</b>。
                    適用於在 Microsoft 生態系統中工作的開發人員的跨平台解決方案。此架構能夠使用 C# 和 XAML 建立原生行動與桌面應用程式。
                </p>
            </li>
            <li>
                <p>
                    <b>Ionic</b>。
                    一款開源 UI 工具包，用於使用 Web 技術（HTML、CSS 和 JavaScript）組建跨平台行動應用程式，並整合了 Angular、React 和 Vue 等架構，實現從單一程式碼庫進行開發。
                </p>
            </li>
        </list>
        <p>您可以在我們的文章中閱讀有關熱門 <a href="cross-platform-frameworks.topic">跨平台架構</a> 的更詳細概述。</p>
    </chapter>
    <chapter title="Kotlin Multiplatform 如何彌合差距" id="how-kotlin-multiplatform-bridges-the-gap">
        <p>Kotlin Multiplatform 對跨平台開發採取了不同的方法，專注於共享有意義的部分，同時在關鍵的地方保留完全控制。</p>
        <p>根據您的需求，您可以為您的專案選擇合適的程式碼共享程度：</p>
        <list>
            <li>
                <p>
                    <b>共享邏輯與 UI。</b>
                    您可以將 Kotlin 與 Compose Multiplatform 結合使用，共享高達 100% 的應用程式程式碼（包括 UI），同時仍與原生 API 整合。
                </p>
            </li>
            <li>
                <p>
                    <b>共享邏輯，保持原生 UI。</b>
                    共享資料和商務邏輯，同時在每個平台上維護完全原生的 UI —— 當平台特定行為和 UX 忠實度是首要任務時，這是理想的選擇。
                </p>
            </li>
            <li>
                <p>
                    <b>共享小部分邏輯。</b>
                    從逐步共享所選組件（如驗證、領域邏輯或身份驗證）開始，在不進行重大架構更改的情況下提高一致性。
                </p>
            </li>
        </list>
        <img src="with-compose-multiplatform.svg"
             alt="透過 Kotlin Multiplatform 與 Compose Multiplatform：開發人員可以共享商務邏輯、呈現邏輯，甚至 UI 邏輯"
             width="700"/>
        <p>除了平台特定程式碼外，您幾乎可以共享任何內容。</p>
        <p>團隊在實務中取得的成果：</p>
        <p>
            <b>高程式碼重用率與完全的彈性。</b>
            團隊通常共享高達
            <b>90%–95% 的程式碼庫</b>
            ，在減少重複工作的同時，在必要時保留平台特定的實作。例如，<a
                href="https://kotlinlang.org/case-studies/#bitkey-by-block">Block 的 Bitkey 使用 Kotlin Multiplatform 共享了 95%</a> 的行動程式碼庫，確保其開源比特幣錢包的一致性。
        </p>
        <p>
            <b>更快的交付與反覆運算。</b>
            透過重複使用核心邏輯，團隊可以縮短開發週期並更快地交付功能，通常報告可縮短多達
            <b>30% 的發佈時程</b>。
            透過使用 Kotlin 和 Compose Multiplatform，<a href="https://kotlinlang.org/case-studies/#music-work">Music Work 降低了 30% 的開發和維護成本</a>，同時顯著加速了其部署週期。
        </p>
        <p>
            <b>改善團隊間的協作。</b>
            Android 和 iOS 開發人員可以在共享程式碼庫上工作，同時繼續使用他們偏好的工具和工作流程。例如，<a href="https://kotlinlang.org/case-studies/#prezzee">Prezzee 團隊分享了他們的 Kotlin Multiplatform 歷程</a>，在此過程中，他們轉型了行動開發方法，並組建了一個更強大、更具協作性的團隊。
        </p>
        <p><a href="https://kotlinlang.org/case-studies/?type=multiplatform"><img src="kmp-use-cases-1.svg"
                                                                                  alt="探索 Kotlin Multiplatform 使用案例"
                                                                                  width="600"/></a></p>
    </chapter>
    <chapter title="如何選擇：實用的決策指南" id="how-to-choose-a-practical-decision-guide">
        <p>在原生和跨平台開發之間做出選擇，取決於您的產品目標、技術需求和團隊配置。請使用以下步驟來引導您的決定：</p>
        <p>
            <b>1. 定義您的目標平台</b>
        </p>
        <p>決定您的應用程式將在 Android、iOS 還是兩者上執行。如果您從一開始就針對多個平台，跨平台開發可以幫助減少重複工作並簡化維護。</p>
        <p>
            <b>2. 評估效能和功能需求</b>
        </p>
        <p>考慮您的應用程式在效能、圖形和硬體存取方面的需求程度。高度依賴裝置能力（如即時處理、感測器或複雜動畫）的應用程式，可能會從原生方法中獲益。</p>
        <p>
            <b>3. 評估您團隊的專業知識</b>
        </p>
        <p>考慮您的團隊已經熟悉的程式語言和工具。原生開發通常需要平台特定的技能：開發人員需要瞭解 Objective-C 或 Swift 才能為 iOS 建立原生應用程式，而為 Android 建立原生應用程式則需要瞭解 Kotlin 或 Java。另一方面，跨平台架構 Flutter 需要 Dart 的知識。如果您使用 Kotlin Multiplatform，Kotlin 語法對於 iOS 開發人員來說很容易學習，因為它遵循與 Swift 類似的概念；對於 Android 開發人員來說也是如此，因為它是現代 Android 應用程式的主要語言。透過 Kotlin Multiplatform，團隊可以跨平台重複使用 Kotlin 技能，這可以簡化採用過程。</p>
        <p>
            <b>4. 平衡時程、預算與維護</b>
        </p>
        <p>跨平台開發可以透過跨平台共享程式碼來減少開發時間和成本，而原生開發可能需要獨立的實作。不僅要考慮初始開發工作，還要考慮長期維護和可擴充性。</p>
        <p>
            <b>5. 考慮長期可行性與生態系統</b>
        </p>
        <p>查看技術的成熟度、社群支援以及可用的學習資源。一個擁有活躍開發和文件的強大生態系統有助於確保長期穩定性並更快地解決問題。您可以查看我們精選的 <a href="kmp-learning-resources.md">Kotlin Multiplatform (KMP) 與 Compose Multiplatform 學習材料</a>列表。</p>
        <p>
            <b>6. 讓您的架構符合未來需求</b>
        </p>
        <p>選擇一種隨著產品演進而具有彈性的方法。像 Kotlin Multiplatform 這樣的解決方案讓您可以從小規模開始，僅共享部分程式碼，並逐步擴展，協助您適應不斷變化的需求而無需進行重大重寫。</p>
    </chapter>
    <chapter title="常見問題" id="frequently-asked-question">
        <p>
            <b>問：什麼是跨平台行動應用程式開發？</b>
        </p>
        <p>答：跨平台行動應用程式開發是使用共享程式碼庫組建可在多個平台（如 Android 和 iOS）上執行的應用程式的過程。開發人員可以跨平台重複使用部分程式碼，從而減少開發時間和維護工作。</p>
        <p>
            <b>問：原生或跨平台，哪種更好？</b>
        </p>
        <p>答：沒有一成不變的答案。原生開發提供最佳效能和對平台功能的完整存取，而跨平台開發則透過程式碼共享實現更快的交付和更低的維護成本。正確的選擇取決於您的專案需求、時程和團隊專業知識。</p>
        <p>
            <b>問：原生應用程式有哪些優點？</b>
        </p>
        <p>答：原生應用程式提供高效能、流暢且反應靈敏的互動，以及對裝置硬體和平台 API 的完整存取。它們還遵循平台特定的設計準則，從而提供更一致且直覺的使用者體驗。</p>
        <p>
            <b>問：跨平台應用程式使用哪些架構？</b>
        </p>
        <p>答：熱門的跨平台架構包括 Kotlin Multiplatform、Flutter、React Native、.NET MAUI（前身為 Xamarin）和 Ionic。每種架構在程式碼共享、效能和原生功能存取之間提供不同的平衡。</p>
        <p>
            <b>問：平台之間可以共享多少程式碼？</b>
        </p>
        <p>答：共享程式碼的數量取決於所使用的方法和工具。使用現代跨平台解決方案，團隊通常可以共享 60%–95% 的程式碼，尤其是在商務邏輯和資料處理方面。某些方法還允許共享 UI 程式碼，進一步提高重用率。</p>
    </chapter>
    <chapter title="總結 —— 做出正確的選擇" id="summary-making-the-right-choice">
        <p>在原生和跨平台開發之間做出選擇取決於您的優先事項。原生開發提供最佳效能、對裝置功能的完整存取，以及與平台準則一致的使用者體驗。跨平台開發則專注於效率，透過程式碼共享實現更快的交付、更低的成本和更簡單的維護。</p>
        <p>Kotlin 與 Compose Multiplatform 共同提供了一種靈活的跨平台共享程式碼方式 —— 從商務邏輯到 UI —— 同時保留對原生 API 的存取權限，協助您在效能、一致性和開發效率之間取得平衡。</p>
        <p><a href="get-started.topic"><img src="kmp-journey-start.svg" alt="開啟您的 KMP 旅程"
                                            width="600"/></a></p>
    </chapter>
</topic>