<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="Kotlin RPC 入門" id="tutorial-first-steps-with-kotlin-rpc">
<show-structure for="chapter" depth="2"/>
<web-summary>
    在此綜合指南中，探索 RPC 的基本概念並深入比較 RPC 與 REST。學習如何使用 Kotlin RPC 建立您的第一個應用程式。
</web-summary>
<link-summary>
    學習如何使用 Kotlin RPC 和 Ktor 建立您的第一個應用程式。
</link-summary>
<card-summary>
    學習如何使用 Kotlin RPC 和 Ktor 建立您的第一個應用程式。
</card-summary>
<tldr>
    <var name="example_name" value="tutorial-kotlin-rpc-app"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
    <p>
        <b>使用的外掛程式</b>: <Links href="/ktor/server-routing" summary="路由是伺服器應用程式中用於處理傳入請求的核心外掛程式。">Routing</Links>,
        <a href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>,
        <a href="https://github.com/Kotlin/kotlinx-rpc">kotlinx.rpc</a>
    </p>
</tldr>
<p>
    Kotlin RPC (遠端程序呼叫) 是 Kotlin 生態系中一個令人興奮的新增功能，它建立在完善的基礎之上，
    並運行於 <code>kotlinx.rpc</code> 函式庫。
</p>
<p>
    <code>kotlinx.rpc</code> 函式庫使您能夠僅使用常規的 Kotlin 語言建構，即可跨網路邊界進行程序呼叫。
    因此，它提供了 REST 和 Google RPC (gRPC) 的替代方案。
</p>
<p>
    在本文中，我們將介紹 Kotlin RPC 的核心概念並建立一個簡單的應用程式。然後您可以在自己的專案中評估此函式庫。
</p>
<chapter title="先決條件" id="prerequisites">
    <p>
        本教學課程假設您對 Kotlin 程式設計有基本的理解。如果您是 Kotlin 初學者，請考慮查閱一些
        <a href="https://kotlinlang.org/docs/getting-started.html">入門材料</a>。
    </p>
    <p>為獲得最佳體驗，我們建議使用 <a
            href="https://www.jetbrains.com/idea/download">IntelliJ
        IDEA Ultimate</a> 作為您的整合式開發環境 (IDE)，因為它提供了全面的支援和工具，將有助於提升您的生產力。
    </p>
</chapter>
<chapter title="什麼是 RPC？" id="what-is-rpc">
    <chapter title="本地與遠端程序呼叫" id="local-vs-remote">
        <p>
            任何有程式設計經驗的人都會熟悉程序呼叫的概念。這是任何程式語言中的基本概念。從技術上講，這些是
            本地程序呼叫，因為它們始終發生在同一程式內。
        </p>
        <p>
            遠端程序呼叫是指函數呼叫和參數以某種方式透過網路傳輸，以便實作可以在獨立的虛擬機器/可執行檔中發生。
            回傳值則沿著相反的路徑傳回發出呼叫的機器。
        </p>
        <p>
            最簡單的理解是將發出呼叫的機器視為用戶端，將實作所在的機器視為伺服器。然而，這不一定是必須的。RPC
            呼叫可以雙向發生，作為對等式架構的一部分。但為了保持簡單，我們假設採用用戶端/伺服器部署。
        </p>
    </chapter>
    <chapter title="RPC 框架基礎" id="rpc-framework-fundamentals">
        <p>
            任何 RPC 框架都必須提供某些基本功能。在傳統 IT 基礎設施中實作遠端程序呼叫時，這些是不可避免的。
            術語可能有所不同，職責可以不同方式劃分，但每個 RPC 框架都必須提供：
        </p>
        <list type="decimal">
            <li>
                一種宣告將被遠端呼叫之程序的管道。在物件導向程式設計中，介面是邏輯上的選擇。這可以是當前語言提供的介面建構，
                或是某種語言中立標準，例如 <a
                    href="https://webidl.spec.whatwg.org/">W3C 使用的 Web IDL</a>
            </li>
            <li>
                一種指定用於參數和回傳值之型別的管道。同樣，您可以使用語言中立標準。然而，
                在當前語言中標註標準資料型別宣告可能更簡單。
            </li>
            <li>
                輔助類別，稱為
                <format style="italic">用戶端存根</format>
                ，用於將程序呼叫轉換為可透過網路傳送的格式，並解包結果回傳值。這些存根可以在
                編譯過程中或在執行時動態建立。
            </li>
            <li>
                一個底層的
                <format style="italic">RPC 執行時期</format>
                ，用於管理輔助類別並監督遠端程序呼叫的生命週期。在伺服器端，此執行時期需要嵌入某種伺服器中，
                以便持續處理請求。
            </li>
            <li>
                需要選擇（或定義）協定以表示被呼叫的程序、序列化正在傳送的資料，並在網路上轉換資訊。
                過去，一些技術從頭定義了新協定（CORBA 中的 IIOP），而另一些則專注於重用（SOAP 中的 HTTP POST）。
            </li>
        </list>
    </chapter>
    <chapter title="封送處理 (Marshaling) 與序列化 (Serialization)" id="marshaling-vs-serialization">
        <p>
            在 RPC 框架中，我們談到
            <format style="italic">封送處理</format>
            和
            <format style="italic">解封送處理</format>
            。這是封裝和解封裝要透過網路傳送的資訊的過程。它可被視為序列化的超集。在封送處理中，
            我們正在序列化物件，但我們還需要打包關於被呼叫程序及其呼叫上下文的資訊。
        </p>
    </chapter>
    <p>
        介紹了 RPC 的核心概念後，讓我們透過建立一個範例應用程式來看看它們如何在 <code>kotlinx.rpc</code> 中應用。
    </p>
</chapter>
<chapter title="Hello, kotlinx.rpc" id="hello-kotlinx-rpc">
    <p>
        讓我們建立一個透過網路訂購披薩的應用程式。為了盡可能保持程式碼簡單，我們將使用基於主控台的用戶端。
    </p>
    <chapter title="建立專案" id="create-project">
        <p>首先，您將建立一個包含用戶端和伺服器實作的專案。</p>
        <p>
            在更複雜的應用程式中，為用戶端和伺服器使用獨立模組是最佳實踐。
            然而，為了本教學課程的簡便性，我們將兩者使用單一模組。
        </p>
        <procedure id="create-project-procedure">
            <step>
                啟動 <a href="https://www.jetbrains.com/idea/download/">IntelliJ IDEA</a>。
            </step>
            <step>
<p>
    在歡迎畫面，點擊 <control>新建專案</control>。
</p>
<p>
    或者，從主選單中，選擇 <ui-path>檔案 | 新建 | 專案</ui-path>。
</p>
            </step>
            <step>
                在
                <control>名稱</control>
                欄位中，輸入
                <Path>KotlinRpcPizzaApp</Path>
                作為您的專案名稱。
                <img src="tutorial_kotlin_rpc_intellij_project.png" alt="IntelliJ 新建 Kotlin 專案視窗"
                     style="block" width="706" border-effect="rounded"/>
            </step>
            <step>
                保留其餘的預設設定並點擊
                <control>建立</control>
                。
            </step>
        </procedure>
        <p>
            通常，您會立即設定專案建置檔案。然而，這是一個實作細節，不會增強您對該技術的理解，
            因此您將在最後回到該步驟。
        </p>
    </chapter>
    <chapter title="新增共享型別" id="shared-types">
        <p>
            任何 RPC 專案的核心都是定義將被遠端呼叫之程序的介面，以及在這些程序定義中使用的型別。
        </p>
        <p>
            在多模組專案中，這些型別需要被共享。然而，在此範例中，此步驟將不是必要的。
        </p>
        <procedure id="shared-types-procedure">
            <step>
                導航至
                <Path>src/main/kotlin</Path>
                資料夾並建立一個名為
                <Path>model</Path>
                的新子套件。
            </step>
            <step>
                在
                <Path>model</Path>
                套件內，建立一個新的
                <Path>PizzaShop.kt</Path>
                檔案，其包含以下實作：
                [object Promise]
                <p>
                    該介面需要有來自 <code>kotlinx.rpc</code> 函式庫的 <code>@Rpc</code> 註解。
                </p>
                <p>
                    因為您使用 <a href="https://github.com/Kotlin/kotlinx.serialization"><code>kotlinx.serialization</code></a>
                    來幫助透過網路傳輸資訊，所以參數中使用的型別必須標記 <code>Serializable</code> 註解。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="實作用戶端" id="client-implementation">
        <procedure id="client-impl-procedure">
            <step>
                導航至
                <Path>src/main/kotlin</Path>
                並建立一個新的
                <Path>Client.kt</Path>
                檔案。
            </step>
            <step>
                開啟
                <Path>Client.kt</Path>
                並新增以下實作：
                [object Promise]
            </step>
        </procedure>
        <p>
            您只需要 25 行程式碼即可準備並執行 RPC 呼叫。顯然，這裡發生了很多事情，
            所以讓我們將程式碼分成幾個部分。
        </p>
        <p>
            <code>kotlinx.rpc</code> 函式庫使用 <Links href="/ktor/client-create-new-application" summary="建立您的第一個用戶端應用程式以發送請求和接收回應。">Ktor
            用戶端</Links> 在用戶端託管其執行時期。該執行時期不與 Ktor 耦合，其他選擇也是可能的，
            但這促進了重用並使 <code>kotlinx.rpc</code> 易於整合到
            現有的 KMP 應用程式中。
        </p>
        <p>
            Ktor 用戶端和 Kotlin RPC 都圍繞協程建立，因此您使用 <code>runBlocking</code> 來
            建立初始協程，並在其中執行用戶端的其餘部分：
        </p>
        [object Promise]
        <tip>
            請注意，<code>runBlocking</code> 是為尖峰負載和測試而設計，而非用於生產程式碼。
        </tip>
        <p>
            接下來，您以標準方式建立 Ktor 用戶端的實例。<code>kotlinx.rpc</code> 在底層使用
            <Links href="/ktor/client-websockets" summary="Websockets 外掛程式允許您在伺服器和用戶端之間建立多向通訊會話。">WebSockets</Links> 外掛程式來傳輸資訊。您
            只需要透過使用 <code>installKrpc()</code> 函數來確保它已載入：
        </p>
        [object Promise]
        <p>
            建立此 Ktor 用戶端後，您接著建立一個 <code>KtorRpcClient</code> 物件以呼叫遠端
            程序。您需要設定伺服器的位置以及用於傳輸資訊的機制：
        </p>
        [object Promise]
        <p>
            至此，標準設定已完成，您已準備好使用特定於問題領域的功能。您可以使用該用戶端來建立一個
            實作 <code>PizzaShop</code> 介面方法的用戶端代理物件：
        </p>
        [object Promise]
        <p>
            然後您可以進行遠端程序呼叫並使用結果：
        </p>
        [object Promise]
        <p>
            請注意，此時正在為您完成大量工作。呼叫的所有細節和所有參數都必須轉換為訊息，
            透過網路發送，然後回傳值被接收和解碼。透明地發生這一事實是初始設定的回報。
        </p>
        <p>
            最後，我們需要照常關閉用戶端：
        </p>
        [object Promise]
    </chapter>
    <chapter title="實作伺服器" id="server-implementation">
        <p>
            伺服器端的實作分為兩個部分。首先，您需要建立我們介面的實作，其次，您需要在伺服器內託管它。
        </p>
        <procedure id="create-interface">
            <step>
                導航至
                <Path>src/main/kotlin</Path>
                並建立一個新的
                <Path>Server.kt</Path>
                檔案。
            </step>
            <step>
                開啟
                <Path>Server.kt</Path>
                並新增以下介面：
                [object Promise]
                <p>
                    顯然，這不是真實世界的實作，但足以讓我們的示範運行起來。
                </p>
                <p>
                    實作的第二部分建立在 Ktor 之上。
                </p>
            </step>
            <step>
                <p>
                    在同一個檔案中新增以下程式碼：
                </p>
                [object Promise]
                <p>以下是細節說明：</p>
                <p>
                    首先，您建立 Ktor/Netty 的實例，並使用指定的擴展函數進行設定：
                </p>
                [object Promise]
                <p>
                    然後，您宣告一個擴展 Ktor Application 型別的設定函數。這會安裝
                    <code>kotlinx.rpc</code> 外掛程式並宣告一個或多個路由：
                </p>
                [object Promise]
                <p>
                    在路由部分中，您使用 <code>kotlinx.rpc</code> 對 Ktor Routing DSL 的擴展
                    來宣告一個端點。與用戶端一樣，您指定 URL 並設定序列化。
                    但在這種情況下，我們的實作將在該 URL 監聽傳入的請求：
                </p>
                [object Promise]
                <p>
                    請注意，您使用 <code>registerService</code> 將您的介面實作提供給 RPC 執行時期。
                    您可能希望有多個實例，但那是後續文章的主題。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="新增依賴" id="add-dependencies">
        <p>
            您現在擁有了運行應用程式所需的所有程式碼，但目前，它甚至無法編譯，更不用說執行了。
            您可以使用 Ktor Project Generator 和 <a href="https://start.ktor.io/p/kotlinx-rpc">kotlinx.rpc</a> 外掛程式，
            或者您可以手動設定建置檔案。
            這也不是太複雜。
        </p>
        <procedure id="configure-build-files">
            <step>
                在
                <Path>build.gradle.kts</Path>
                檔案中，新增以下外掛程式：
                [object Promise]
                <p>
                    Kotlin 外掛程式的原因很明顯。解釋其他外掛程式：
                </p>
                <list>
                    <li>
                        需要 <code>kotlinx.serialization</code> 外掛程式來產生用於將 Kotlin 物件轉換為 JSON 的輔助型別。
                        請記住，<code>kotlinx.serialization</code> 不使用反射。
                    </li>
                    <li>
                        Ktor 外掛程式用於建置包含應用程式及其所有依賴項的胖 JAR。
                    </li>
                    <li>
                        需要 RPC 外掛程式來產生用戶端存根。
                    </li>
                </list>
            </step>
            <step>
                新增以下依賴項：
                [object Promise]
                <p>
                    這會新增 Ktor 用戶端和伺服器、<code>kotlinx.rpc</code> 執行時期的用戶端和伺服器部分，
                    以及用於整合 <code>kotlinx.rpc</code> 和 <code>kotlinx-serialization</code> 的函式庫。
                </p>
                <p>
                    有了這個，您現在可以運行專案並開始進行 RPC 呼叫。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="運行應用程式" id="run-application">
        <p>
            若要運行示範，請依照以下步驟操作：
        </p>
        <procedure id="run-app-procedure">
            <step>
                導航至
                <Path>Server.kt</Path>
                檔案。
            </step>
            <step>
                <p>在 IntelliJ IDEA 中，點擊運行按鈕
                    (<img src="intellij_idea_gutter_icon.svg"
                          style="inline" height="16" width="16"
                          alt="IntelliJ IDEA 運行圖示"/>)
                    旁邊的 <code>main()</code> 函數
                    以啟動應用程式。</p>
                <p>
                    您應該會在
                    <control>執行</control>
                    工具面板中看到輸出：
                </p>
                <img src="tutorial_kotlin_rpc_run_server.png" alt="IntelliJ IDEA 中的伺服器運行輸出"
                     style="block" width="706" border-effect="line"/>
            </step>
            <step>
                導航至
                <Path>Client.kt</Path>
                檔案並運行應用程式。您應該會在
                主控台中看到以下輸出：
                [object Promise]
            </step>
        </procedure>
    </chapter>
</chapter>
<chapter title="擴展範例" id="extend-the-example">
    <p>
        最後，讓我們增強我們的範例應用程式的複雜度，為未來的開發奠定堅實的基礎。
    </p>
    <procedure id="extend-server">
        <step>
            在
            <Path>PizzaShop.kt</Path>
            檔案中，擴展 <code>orderPizza</code> 方法，使其包含用戶端 ID，並新增一個
            <code>viewOrders</code> 方法，回傳指定用戶端的所有待處理訂單：
            [object Promise]
            <p>
                您可以透過回傳 <code>Flow</code> 而非 <code>List</code> 或 <code>Set</code> 來利用協程函式庫。
                這將允許您一次將一份披薩的資訊串流到用戶端。
            </p>
        </step>
        <step>
            導航至
            <Path>Server.kt</Path>
            檔案並透過將當前訂單儲存在一個列表映射中來實作此功能：
            [object Promise]
            <p>
                請注意，為每個用戶端實例建立一個新的 <code>PizzaShopImpl</code> 實例。
                這透過隔離其狀態來避免用戶端之間的衝突。然而，它不解決單一伺服器實例內的執行緒安全問題，
                特別是當多個服務同時存取同一實例時。
            </p>
        </step>
        <step>
            在
            <Path>Client.kt</Path>
            檔案中，使用兩個不同的用戶端 ID 提交多個訂單：
            [object Promise]
            <p>
                然後您使用 <code>Coroutines</code> 函式庫和 <code>collect</code> 方法迭代結果：
            </p>
            [object Promise]
        </step>
        <step>
            運行伺服器和用戶端。當您運行用戶端時，您將看到結果增量顯示：
            <img src="tutorial_kotlin_rpc_run_client.gif" alt="用戶端輸出增量顯示結果"
                 style="block" width="706" border-effect="line"/>
        </step>
    </procedure>
    <p>
        建立了可運行的範例後，讓我們深入探討一切是如何運作的。特別是，讓我們
        比較和對比 Kotlin RPC 與兩個主要替代方案 – REST 和 gRPC。
    </p>
</chapter>
<chapter title="RPC 與 REST 比較" id="rpc-vs-rest">
    <p>
        RPC 的概念比 REST 早得多，<a
            href="https://en.wikipedia.org/wiki/Remote_procedure_call">至少可追溯到 1981 年</a>。
        與 REST 相比，基於 RPC 的方法不會將您限制在統一介面（例如 HTTP
        請求類型），在程式碼中更容易使用，並且由於二進位訊息傳遞而效能更高。
    </p>
    <p>
        然而，REST 有三個主要優點：
    </p>
    <list type="decimal">
        <li>
            它可由瀏覽器中的 JavaScript 用戶端直接使用，因此可作為單頁
            應用程式的一部分。由於 RPC 框架依賴於生成的存根和二進位訊息傳遞，它們不太適合
            JavaScript 生態系。
        </li>
        <li>
            REST 使功能涉及網路時變得明顯。這有助於避免 Martin Fowler 識別出的
            <a href="https://martinfowler.com/articles/distributed-objects-microservices.html">分散式物件反模式</a>。
            當團隊將其物件導向設計拆分為兩個或更多部分，而不考慮將本地程序呼叫遠端化所帶來的效能和可靠性影響時，就會發生這種情況。
        </li>
        <li>
            REST API 建立在一系列約定之上，這些約定使其相對容易建立、文件化、監控、偵錯和測試。
            有一個龐大的工具生態系來支援這一點。
        </li>
    </list>
    <p>
        這些權衡意味著 Kotlin RPC 最適合在兩種情境下使用。首先，在 KMP 用戶端中使用 <a
            href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a>，其次，
        在雲端中協作的微服務之間。Kotlin/Wasm 的未來發展可能會使 <code>kotlinx.rpc</code>
        更適用於基於瀏覽器的應用程式。
    </p>
</chapter>
<chapter title="Kotlin RPC 與 Google RPC 比較" id="kotlin-rpc-vs-google-rpc">
    <p>
        Google RPC 是目前軟體產業中佔主導地位的 RPC 技術。一種稱為 Protocol
        Buffers (protobuf) 的標準用於使用語言中立的介面定義語言 (IDL) 定義資料結構和訊息負載。
        這些 IDL 定義可以轉換成各種程式設計語言，並使用緊湊高效的二進位格式序列化。
        Quarkus 和 Micronaut 等微服務框架已支援 gRPC。
    </p>
    <p>
        Kotlin RPC 難以與 gRPC 競爭，這對 Kotlin 社群沒有益處。值得慶幸的是，沒有這樣做的計畫。
        相反，意圖是讓 <code>kotlinx.rpc</code> 與 gRPC 相容且可互通。
        <code>kotlinx.rpc</code> 服務將可以使用 gRPC 作為其網路協定，並且 <code>kotlinx.rpc</code> 用戶端可以呼叫 gRPC 服務。
        <code>kotlinx.rpc</code> 將使用 <a
            href="https://kotlin.github.io/kotlinx-rpc/transport.html">其自身的 kRPC 協定</a> 作為預設選項
        （如我們當前範例所示），但沒有什麼能阻止您選擇 gRPC。
    </p>
</chapter>
<chapter title="後續步驟" id="next-steps">
    <p>
        Kotlin RPC 將 Kotlin 生態系擴展到一個新的方向，為建立和使用服務提供了 REST 和 GraphQL 的替代方案。
        它建立在經過驗證的函式庫和框架之上，例如 Ktor、Coroutines 和 <code>kotlinx-serialization</code>。
        對於尋求利用 Kotlin Multiplatform 和 Compose Multiplatform 的團隊，它將為分散式訊息傳遞提供簡單高效的選項。
    </p>
    <p>
        如果這篇介紹引起了您的興趣，請務必查閱
        <a href="https://kotlin.github.io/kotlinx-rpc/get-started.html">官方 <code>kotlinx.rpc</code>
        文件</a> 和 <a
            href="https://github.com/Kotlin/kotlinx-rpc/tree/main/samples">範例</a>。
    </p>
    <p>
        <code>kotlinx.rpc</code>
        函式庫處於早期階段，因此我們鼓勵您探索它並分享您的回饋。
        錯誤和功能請求可以在 <a href="https://youtrack.jetbrains.com/issues/KRPC">YouTrack</a> 上找到，
        而一般討論則在 <a
            href="https://kotlinlang.slack.com/archives/C072YJ3Q91V">Slack</a> (<a
            href="https://surveys.jetbrains.com/s3/kotlin-slack-sign-up">請求存取</a>) 上進行。
    </p>
</chapter>