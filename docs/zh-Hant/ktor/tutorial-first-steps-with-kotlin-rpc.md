<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
   title="Kotlin RPC 入門" id="tutorial-first-steps-with-kotlin-rpc">
<show-structure for="chapter" depth="2"/>
<web-summary>
    透過這份全面的指南，探索 RPC 的基礎知識，並詳細比較 RPC 與 REST。學習如何使用 Kotlin RPC 建立您的第一個應用程式。
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
        <b>使用外掛程式</b>: <Links href="/ktor/server-routing" summary="Routing 是用於處理伺服器應用程式中傳入請求的核心外掛程式。">Routing</Links>,
        <a href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>,
        <a href="https://github.com/Kotlin/kotlinx-rpc">kotlinx.rpc</a>
    </p>
</tldr>
<p>
    Kotlin RPC (Remote Procedure Call，遠端程序呼叫) 是 Kotlin 生態系統中一個令人興奮的新增功能，它建立在完善的基礎之上，並運行於 <code>kotlinx.rpc</code> 函式庫。
</p>
<p>
    <code>kotlinx.rpc</code> 函式庫讓您僅使用常規的 Kotlin 語言結構即可跨網路邊界進行程序呼叫。因此，它為 REST 和 Google RPC (gRPC) 提供了替代方案。
</p>
<p>
    在本文中，我們將介紹 Kotlin RPC 的核心概念並建構一個簡單的應用程式。然後您可以自行在專案中評估此函式庫。
</p>
<chapter title="前提條件" id="prerequisites">
    <p>
        本教學假設您對 Kotlin 程式設計有基本的了解。如果您是 Kotlin 的新手，請考慮查閱一些<a href="https://kotlinlang.org/docs/getting-started.html">
        入門資料</a>。
    </p>
    <p>為了獲得最佳體驗，我們建議您使用<a
            href="https://www.jetbrains.com/idea/download">IntelliJ
        IDEA Ultimate</a> 作為您的整合式開發環境 (IDE)，因為它提供全面的支援與工具，將提升您的生產力。
    </p>
</chapter>
<chapter title="什麼是 RPC？" id="what-is-rpc">
    <chapter title="本地 vs. 遠端程序呼叫" id="local-vs-remote">
        <p>
            任何有程式設計經驗的人都熟悉程序呼叫的概念。這是任何程式設計語言中的基本概念。從技術上講，這些是
            本地程序呼叫，因為它們總是在同一個程式中發生。
        </p>
        <p>
            遠端程序呼叫是指函數呼叫和參數以某種方式透過網路傳輸，以便實作可以在單獨的 VM/可執行檔中發生。回傳值沿相反的路徑返回到發出呼叫的機器。
        </p>
        <p>
            最簡單的理解方式是將發出呼叫的機器視為客戶端，將實作所在的機器視為伺服器。然而，這不一定是實際情況。RPC
            呼叫可以雙向發生，作為對等架構的一部分。但為了保持簡單，我們假設是客戶端/伺服器部署。
        </p>
    </chapter>
    <chapter title="RPC 框架基礎" id="rpc-framework-fundamentals">
        <p>
            任何 RPC 框架都必須提供某些基礎。在傳統 IT 基礎設施中實作遠端程序呼叫時，這些是不可避免的。術語可能會有所不同，職責也可能以不同的方式劃分，但每個 RPC 框架都必須提供：
        </p>
        <list type="decimal">
            <li>
                一種宣告將遠端呼叫的程序的方法。在物件導向程式設計中，介面是合理的選擇。這可以是當前語言提供的介面結構，也可以是某種語言中立的標準，例如<a
                    href="https://webidl.spec.whatwg.org/">W3C 使用的 Web IDL</a>。
            </li>
            <li>
                一種指定用於參數和回傳值的類型的方法。同樣，您可以使用語言中立的標準。然而，在當前語言中註解標準資料類型宣告可能會更簡單。
            </li>
            <li>
                輔助類別，稱為
                <format style="italic">客戶端存根</format>
                ，用於將程序呼叫轉換為可以在網路中傳送的格式，並解包結果回傳值。這些存根可以在編譯過程或執行時動態建立。
            </li>
            <li>
                一個底層的
                <format style="italic">RPC 執行時</format>
                ，用於管理輔助類別並監督遠端程序呼叫的生命週期。在伺服器端，這個執行時需要嵌入到某種伺服器中，以便能夠持續處理請求。
            </li>
            <li>
                需要選擇（或定義）協定來表示被呼叫的程序、序列化正在傳送的資料以及透過網路轉換資訊。過去，一些技術從頭定義了新協定（CORBA 中的 IIOP），而另一些則專注於重用（SOAP 中的 HTTP POST）。
            </li>
        </list>
    </chapter>
    <chapter title="封送處理 vs. 序列化" id="marshaling-vs-serialization">
        <p>
            在 RPC 框架中，我們談論
            <format style="italic">封送處理 (marshaling)</format>
            和
            <format style="italic">解封送處理 (unmarshaling)</format>
            。這是打包和解包要透過網路傳送的資訊的過程。它可以被視為序列化的超集。在封送處理中，我們正在序列化物件，但我們還需要打包有關被呼叫程序以及進行該呼叫的上下文的資訊。
        </p>
    </chapter>
    <p>
        介紹完 RPC 的核心概念後，讓我們透過建構範例應用程式來看看它們如何在 <code>kotlinx.rpc</code> 中應用。
    </p>
</chapter>
<chapter title="你好，kotlinx.rpc" id="hello-kotlinx-rpc">
    <p>
        讓我們建立一個透過網路訂購披薩的應用程式。為了讓程式碼盡可能簡單，我們將使用一個基於主控台的客戶端。
    </p>
    <chapter title="建立專案" id="create-project">
        <p>首先，您將建立一個包含客戶端和伺服器實作的專案。</p>
        <p>
            在更複雜的應用程式中，為客戶端和伺服器使用獨立模組是最佳實踐。
            然而，為了本教學的簡潔性，我們將為兩者使用單一模組。
        </p>
        <procedure id="create-project-procedure">
            <step>
                啟動 <a href="https://www.jetbrains.com/idea/download/">IntelliJ IDEA</a>。
            </step>
            <step>
                <p>
                    在歡迎畫面中，點擊 <control>New Project</control> (新增專案)。
                </p>
                <p>
                    或者，從主選單中選擇 <ui-path>File | New | Project</ui-path> (檔案 | 新增 | 專案)。
                </p>
            </step>
            <step>
                在
                <control>Name</control> (名稱)
                欄位中，輸入
                <Path>KotlinRpcPizzaApp</Path>
                作為您的專案名稱。
                <img src="tutorial_kotlin_rpc_intellij_project.png" alt="IntelliJ 新 Kotlin 專案視窗"
                     style="block" width="706" border-effect="rounded"/>
            </step>
            <step>
                保留其餘的預設設定，然後點擊
                <control>Create</control> (建立)。
            </step>
        </procedure>
        <p>
            通常，您會立即配置專案的建置檔。然而，這是一個不會增強您對技術理解的實作細節，因此我們將在最後回到這一步。
        </p>
    </chapter>
    <chapter title="新增共享類型" id="shared-types">
        <p>
            任何 RPC 專案的核心都是定義要遠端呼叫的程序的介面，以及在這些程序的定義中使用的類型。
        </p>
        <p>
            在多模組專案中，這些類型將需要共享。然而，在此範例中，這一步並非必要。
        </p>
        <procedure id="shared-types-procedure">
            <step>
                導航至
                <Path>src/main/kotlin</Path>
                資料夾並建立一個新的子套件，命名為
                <Path>model</Path>
                。
            </step>
            <step>
                在
                <Path>model</Path>
                套件內，建立一個新的
                <Path>PizzaShop.kt</Path>
                檔案，並加入以下實作：
                <code-block lang="kotlin" code="package com.example.model&#10;&#10;import kotlinx.coroutines.flow.Flow&#10;import kotlinx.serialization.Serializable&#10;import kotlinx.rpc.annotations.Rpc&#10;&#10;@Rpc&#10;interface PizzaShop {&#10;    suspend fun orderPizza(pizza: Pizza): Receipt&#10;}&#10;&#10;@Serializable&#10;class Pizza(val name: String)&#10;&#10;@Serializable&#10;class Receipt(val amount: Double)"/>
                <p>
                    該介面需要來自 <code>kotlinx.rpc</code> 函式庫的 <code>@Rpc</code> 註解。
                </p>
                <p>
                    由於您正在使用 <a href="https://github.com/Kotlin/kotlinx.serialization"><code>kotlinx.serialization</code></a>
                    來協助在網路中傳輸資訊，因此參數中使用的類型必須標記有 <code>Serializable</code> 註解。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="實作客戶端" id="client-implementation">
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
                <code-block lang="kotlin" code="package com.example&#10;&#10;import com.example.model.Pizza&#10;import com.example.model.PizzaShop&#10;import io.ktor.client.*&#10;import io.ktor.http.*&#10;import kotlinx.coroutines.runBlocking&#10;import kotlinx.rpc.withService&#10;import kotlinx.rpc.krpc.serialization.json.json&#10;import kotlinx.rpc.krpc.ktor.client.KtorRpcClient&#10;import kotlinx.rpc.krpc.ktor.client.installKrpc&#10;import kotlinx.rpc.krpc.ktor.client.rpc&#10;import kotlinx.rpc.krpc.ktor.client.rpcConfig&#10;&#10;fun main() = runBlocking {&#10;    val ktorClient = HttpClient {&#10;        installKrpc {&#10;            waitForServices = true&#10;        }&#10;    }&#10;&#10;    val client: KtorRpcClient = ktorClient.rpc {&#10;        url {&#10;            host = &quot;localhost&quot;&#10;            port = 8080&#10;            encodedPath = &quot;pizza&quot;&#10;        }&#10;&#10;        rpcConfig {&#10;            serialization {&#10;                json()&#10;            }&#10;        }&#10;    }&#10;&#10;    val pizzaShop: PizzaShop = client.withService&lt;PizzaShop&gt;()&#10;&#10;    val receipt = pizzaShop.orderPizza(Pizza(&quot;Pepperoni&quot;))&#10;    println(&quot;Your pizza cost ${receipt.amount}&quot;)&#10;    ktorClient.close()&#10;}"/>
            </step>
        </procedure>
        <p>
            您只需要 25 行程式碼來準備和執行 RPC 呼叫。顯然，這裡發生了很多事情，所以讓我們將程式碼分解成各個部分。
        </p>
        <p>
            <code>kotlinx.rpc</code> 函式庫使用 <Links href="/ktor/client-create-new-application" summary="建立您的第一個客戶端應用程式以傳送請求並接收回應。">Ktor
            客戶端</Links> 在客戶端託管其執行時。該執行時不與 Ktor 耦合，也可以有其他選擇，但這促進了重用並使 <code>kotlinx.rpc</code> 易於整合到
            現有的 KMP 應用程式中。
        </p>
        <p>
            Ktor 客戶端和 Kotlin RPC 都圍繞協程建構，因此您使用 <code>runBlocking</code> 來
            建立初始協程，並在其中執行客戶端的其餘部分：
        </p>
        <code-block lang="kotlin" code="fun main() = runBlocking {&#10;}"/>
        <tip>
            請注意，<code>runBlocking</code> 旨在用於快速原型和測試，而非生產程式碼。
        </tip>
        <p>
            接下來，您以標準方式建立 Ktor 客戶端的實例。<code>kotlinx.rpc</code> 在底層使用 <Links href="/ktor/client-websockets" summary="Websockets 外掛程式允許您在伺服器和客戶端之間建立多向通訊會話。">WebSockets</Links> 外掛程式來傳輸資訊。您
            只需確保它透過使用 <code>installKrpc()</code> 函數載入：
        </p>
        <code-block lang="kotlin" code="    val ktorClient = HttpClient {&#10;        installKrpc {&#10;            waitForServices = true&#10;        }&#10;    }"/>
        <p>
            建立這個 Ktor 客戶端後，您接著建立一個 <code>KtorRpcClient</code> 物件來呼叫遠端
            程序。您需要配置伺服器位置以及用於
            傳輸資訊的機制：
        </p>
        <code-block lang="kotlin" code="    val client: KtorRpcClient = ktorClient.rpc {&#10;        url {&#10;            host = &quot;localhost&quot;&#10;            port = 8080&#10;            encodedPath = &quot;pizza&quot;&#10;        }&#10;&#10;        rpcConfig {&#10;            serialization {&#10;                json()&#10;            }&#10;        }&#10;    }"/>
        <p>
            至此，標準設定已完成，您已準備好使用特定於問題領域的功能。您可以使用客戶端建立一個客戶端代理物件，該物件實作了 <code>PizzaShop</code> 介面的方法：
        </p>
        <code-block lang="kotlin"
                    include-symbol="pizzaShop" code="package com.example&#10;&#10;import com.example.model.Pizza&#10;import com.example.model.PizzaShop&#10;import io.ktor.client.*&#10;import io.ktor.http.*&#10;import kotlinx.coroutines.runBlocking&#10;import kotlinx.rpc.withService&#10;import kotlinx.rpc.krpc.serialization.json.json&#10;import kotlinx.rpc.krpc.ktor.client.KtorRpcClient&#10;import kotlinx.rpc.krpc.ktor.client.installKrpc&#10;import kotlinx.rpc.krpc.ktor.client.rpc&#10;import kotlinx.rpc.krpc.ktor.client.rpcConfig&#10;&#10;fun main() = runBlocking {&#10;    val ktorClient = HttpClient {&#10;        installKrpc {&#10;            waitForServices = true&#10;        }&#10;    }&#10;&#10;    val client: KtorRpcClient = ktorClient.rpc {&#10;        url {&#10;            host = &quot;localhost&quot;&#10;            port = 8080&#10;            encodedPath = &quot;pizza&quot;&#10;        }&#10;&#10;        rpcConfig {&#10;            serialization {&#10;                json()&#10;            }&#10;        }&#10;    }&#10;&#10;    val pizzaShop: PizzaShop = client.withService&lt;PizzaShop&gt;()&#10;&#10;    /*&#10;    val receipt = pizzaShop.orderPizza(Pizza(&quot;Pepperoni&quot;))&#10;    println(&quot;Your pizza cost ${receipt.amount}&quot;)&#10;    */&#10;&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Pepperoni&quot;))&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Hawaiian&quot;))&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Calzone&quot;))&#10;&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;Margherita&quot;))&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;Sicilian&quot;))&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;California&quot;))&#10;&#10;    pizzaShop.viewOrders(&quot;AB12&quot;).collect {&#10;        println(&quot;AB12 ordered ${it.name}&quot;)&#10;    }&#10;&#10;    pizzaShop.viewOrders(&quot;CD34&quot;).collect {&#10;        println(&quot;CD34 ordered ${it.name}&quot;)&#10;    }&#10;&#10;    ktorClient.close()&#10;}"/>
        <p>
            然後您可以進行遠端程序呼叫並使用結果：
        </p>
        <code-block lang="kotlin" code="    val receipt = pizzaShop.orderPizza(Pizza(&quot;Pepperoni&quot;))&#10;    println(&quot;Your pizza cost ${receipt.amount}&quot;)"/>
        <p>
            請注意，此時正在為您完成大量工作。呼叫和所有參數的詳細資訊必須轉換成訊息，透過網路傳送，然後接收並解碼回傳值。這種透明地發生便是初始設定的回報。
        </p>
        <p>
            最後，我們需要像往常一樣關閉客戶端：
        </p>
        <code-block lang="kotlin" code="    ktorClient.close()"/>
    </chapter>
    <chapter title="實作伺服器" id="server-implementation">
        <p>
            伺服器端的實作分為兩個部分。首先，您需要建立我們介面的實作；其次，您需要將其託管在伺服器中。
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
                <code-block lang="kotlin" code="package com.example&#10;&#10;import com.example.model.*&#10;import io.ktor.server.application.*&#10;&#10;class PizzaShopImpl : PizzaShop {&#10;    override suspend fun orderPizza(pizza: Pizza): Receipt {&#10;        return Receipt(7.89)&#10;    }&#10;}"/>
                <p>
                    顯然，這不是一個實際應用實作，但它足以讓我們的示範執行起來。
                </p>
                <p>
                    實作的第二部分建立在 Ktor 之上。
                </p>
            </step>
            <step>
                <p>
                    將以下程式碼加入到同一個檔案中：
                </p>
                <code-block lang="kotlin" code="fun main() {&#10;    embeddedServer(Netty, port = 8080) {&#10;        module()&#10;        println(&quot;Server running&quot;)&#10;    }.start(wait = true)&#10;}&#10;&#10;fun Application.module() {&#10;    install(Krpc)&#10;&#10;    routing {&#10;        rpc(&quot;/pizza&quot;) {&#10;            rpcConfig {&#10;                serialization {&#10;                    json()&#10;                }&#10;            }&#10;&#10;            registerService&lt;PizzaShop&gt; { PizzaShopImpl() }&#10;        }&#10;    }&#10;}"/>
                <p>以下是細節說明：</p>
                <p>
                    首先，您建立一個 Ktor/Netty 的實例，並使用指定的擴充函數進行配置：
                </p>
                <code-block lang="kotlin" code="    embeddedServer(Netty, port = 8080) {&#10;        module()&#10;        println(&quot;Server running&quot;)&#10;    }.start(wait = true)"/>
                <p>
                    然後，您宣告一個擴充 Ktor Application 類型的設定函數。這將安裝 <code>kotlinx.rpc</code> 外掛程式並宣告一個或多個路由：
                </p>
                <code-block lang="kotlin" code="fun Application.module() {&#10;    install(Krpc)&#10;&#10;    routing {&#10;    }&#10;}"/>
                <p>
                    在路由部分內部，您使用 <code>kotlinx.rpc</code> 對 Ktor Routing DSL 的擴充功能來宣告端點。與客戶端一樣，您指定 URL 並配置序列化。
                    但在這種情況下，我們的實作將在該 URL 監聽傳入請求：
                </p>
                <code-block lang="kotlin" code="        rpc(&quot;/pizza&quot;) {&#10;            rpcConfig {&#10;                serialization {&#10;                    json()&#10;                }&#10;            }&#10;&#10;            registerService&lt;PizzaShop&gt; { PizzaShopImpl() }&#10;        }"/>
                <p>
                    請注意，您使用 <code>registerService</code> 向 RPC 執行時提供介面的實作。您可能希望有多個實例，但那是後續文章的主題。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="新增依賴項" id="add-dependencies">
        <p>
            您現在擁有了執行應用程式所需的所有程式碼，但目前它甚至無法編譯，更不用說執行了。
            您可以使用 Ktor 專案產生器搭配 <a href="https://start.ktor.io/p/kotlinx-rpc">kotlinx.rpc</a> 外掛程式，
            或者您可以手動配置建置檔。
            這也不是太複雜。
        </p>
        <procedure id="configure-build-files">
            <step>
                在
                <Path>build.gradle.kts</Path>
                檔案中，新增以下外掛程式：
                <code-block lang="kotlin" code="plugins {&#10;    kotlin(&quot;jvm&quot;) version &quot;2.2.0&quot;&#10;    kotlin(&quot;plugin.serialization&quot;) version &quot;2.2.0&quot;&#10;    id(&quot;io.ktor.plugin&quot;) version &quot;3.2.0&quot;&#10;    id(&quot;org.jetbrains.kotlinx.rpc.plugin&quot;) version &quot;0.9.1&quot;&#10;}"/>
                <p>
                    Kotlin 外掛程式的原因很明顯。要解釋其他外掛程式：
                </p>
                <list>
                    <li>
                        需要 <code>kotlinx.serialization</code> 外掛程式來產生輔助類型，用於將 Kotlin 物件轉換為 JSON。請記住 <code>kotlinx.serialization</code> 不使用反射。
                    </li>
                    <li>
                        Ktor 外掛程式用於建構將應用程式及其所有依賴項打包在一起的胖 JARs。
                    </li>
                    <li>
                        RPC 外掛程式用於產生客戶端存根。
                    </li>
                </list>
            </step>
            <step>
                新增以下依賴項：
                <code-block lang="kotlin" code="    implementation(&quot;io.ktor:ktor-client-cio-jvm&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-client:0.9.1&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-ktor-client:0.9.1&quot;)&#10;    implementation(&quot;io.ktor:ktor-server-netty-jvm&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-server:0.9.1&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-ktor-server:0.9.1&quot;)&#10;    implementation(&quot;org.jetbrains.kotlinx:kotlinx-rpc-krpc-serialization-json:0.9.1&quot;)&#10;    implementation(&quot;ch.qos.logback:logback-classic:1.5.18&quot;)&#10;    testImplementation(kotlin(&quot;test&quot;))&#10;}"/>
                <p>
                    這會新增 Ktor 客戶端和伺服器，<code>kotlinx.rpc</code> 執行時的客戶端和伺服器部分，以及整合 <code>kotlinx.rpc</code> 和
                    <code>kotlinx-serialization</code> 的函式庫。
                </p>
                <p>
                    有了這些，您現在可以執行專案並開始進行 RPC 呼叫。
                </p>
            </step>
        </procedure>
    </chapter>
    <chapter title="執行應用程式" id="run-application">
        <p>
            要執行示範，請依照以下步驟操作：
        </p>
        <procedure id="run-app-procedure">
            <step>
                導航至
                <Path>Server.kt</Path>
                檔案。
            </step>
            <step>
                <p>在 IntelliJ IDEA 中，點擊
                    (<img src="intellij_idea_gutter_icon.svg"
                          style="inline" height="16" width="16"
                          alt="IntelliJ IDEA 執行圖示"/>)
                    <code>main()</code> 函數旁邊的執行按鈕
                    來啟動應用程式。</p>
                <p>
                    您應該在
                    <control>Run</control> (執行)
                    工具面板中看到輸出：
                </p>
                <img src="tutorial_kotlin_rpc_run_server.png" alt="IntelliJ IDEA 中的伺服器執行輸出"
                     style="block" width="706" border-effect="line"/>
            </step>
            <step>
                導航至
                <Path>Client.kt</Path>
                檔案並執行應用程式。您應該在
                主控台中看到以下輸出：
                <code-block lang="shell" code="                        Your pizza cost 7.89&#10;&#10;                        Process finished with exit code 0"/>
            </step>
        </procedure>
    </chapter>
</chapter>
<chapter title="擴展範例" id="extend-the-example">
    <p>
        最後，讓我們增強範例應用程式的複雜性，為未來的開發建立堅實的基礎。
    </p>
    <procedure id="extend-server">
        <step>
            在
            <Path>PizzaShop.kt</Path>
            檔案中，透過包含客戶端 ID 來擴展 <code>orderPizza</code> 方法，並新增一個
            <code>viewOrders</code> 方法，該方法回傳指定客戶端所有待處理的訂單：
            <code-block lang="kotlin" code="package com.example.model&#10;&#10;import kotlinx.coroutines.flow.Flow&#10;import kotlinx.serialization.Serializable&#10;import kotlinx.rpc.annotations.Rpc&#10;&#10;@Rpc&#10;interface PizzaShop {&#10;    suspend fun orderPizza(clientID: String, pizza: Pizza): Receipt&#10;    fun viewOrders(clientID: String): Flow&lt;Pizza&gt;&#10;}"/>
            <p>
                您可以利用協程函式庫，透過回傳 <code>Flow</code> 而不是 <code>List</code> 或 <code>Set</code>。這將允許您一次一個披薩地將資訊串流傳輸到客戶端。
            </p>
        </step>
        <step>
            在
            <Path>Server.kt</Path>
            檔案中，透過將當前訂單儲存在列表映射中來實作此功能：
            <code-block lang="kotlin" code="class PizzaShopImpl : PizzaShop {&#10;    private val openOrders = mutableMapOf&lt;String, MutableList&lt;Pizza&gt;&gt;()&#10;&#10;    override suspend fun orderPizza(clientID: String, pizza: Pizza): Receipt {&#10;        if(openOrders.containsKey(clientID)) {&#10;            openOrders[clientID]?.add(pizza)&#10;        } else {&#10;            openOrders[clientID] = mutableListOf(pizza)&#10;        }&#10;        return Receipt(3.45)&#10;    }&#10;&#10;    override fun viewOrders(clientID: String): Flow&lt;Pizza&gt; {&#10;        val orders = openOrders[clientID]&#10;        if (orders != null) {&#10;            return flow {&#10;                for (order in orders) {&#10;                    emit(order)&#10;                    delay(1000)&#10;                }&#10;            }&#10;        }&#10;        return flow {}&#10;    }&#10;}"/>
            <p>
                請注意，每個客戶端實例都會建立一個新的 <code>PizzaShopImpl</code> 實例。
                這透過隔離客戶端的狀態來避免衝突。然而，它並未解決單一伺服器實例內的執行緒安全問題，特別是當多個服務同時存取同一個實例時。
            </p>
        </step>
        <step>
            在
            <Path>Client.kt</Path>
            檔案中，使用兩個不同的客戶端 ID 提交多個訂單：
            <code-block lang="kotlin" code="    val pizzaShop: PizzaShop = client.withService&lt;PizzaShop&gt;()&#10;&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Pepperoni&quot;))&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Hawaiian&quot;))&#10;    pizzaShop.orderPizza(&quot;AB12&quot;, Pizza(&quot;Calzone&quot;))&#10;&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;Margherita&quot;))&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;Sicilian&quot;))&#10;    pizzaShop.orderPizza(&quot;CD34&quot;, Pizza(&quot;California&quot;))"/>
            <p>
                然後您可以使用 <code>Coroutines</code> 函式庫和 <code>collect</code> 方法迭代結果：
            </p>
            <code-block lang="kotlin" code="    pizzaShop.viewOrders(&quot;AB12&quot;).collect {&#10;        println(&quot;AB12 ordered ${it.name}&quot;)&#10;    }&#10;&#10;    pizzaShop.viewOrders(&quot;CD34&quot;).collect {&#10;        println(&quot;CD34 ordered ${it.name}&quot;)&#10;    }"/>
        </step>
        <step>
            執行伺服器和客戶端。當您執行客戶端時，您將看到結果以增量方式顯示：
            <img src="tutorial_kotlin_rpc_run_client.gif" alt="客戶端輸出增量顯示結果"
                 style="block" width="706" border-effect="line"/>
        </step>
    </procedure>
    <p>
        建立了工作範例後，現在讓我們深入探討一切是如何運作的。特別是，讓我們比較並對比 Kotlin RPC 與另外兩種主要替代方案 — REST 和 gRPC。
    </p>
</chapter>
<chapter title="RPC 與 REST 的比較" id="rpc-vs-rest">
    <p>
        RPC 的概念比 REST 早得多，<a
            href="https://en.wikipedia.org/wiki/Remote_procedure_call">至少可以追溯到 1981 年</a>。與 REST 相比，基於 RPC 的方法不會將您限制在統一的介面（例如 HTTP
        請求類型），在程式碼中更容易使用，並且由於二進位訊息傳遞而具有更高的效能。
    </p>
    <p>
        然而，REST 有三個主要優勢：
    </p>
    <list type="decimal">
        <li>
            它可以由瀏覽器中的 JavaScript 客戶端直接使用，因此可以作為單頁應用程式的一部分。由於 RPC 框架依賴於生成的存根和二進位訊息傳遞，它們與 JavaScript 生態系統的整合度不高。
        </li>
        <li>
            REST 明確指出某個功能是否涉及網路。這有助於避免 Martin Fowler 提出的<a
                href="https://martinfowler.com/articles/distributed-objects-microservices.html">分散式物件反模式</a>。當團隊將其物件導向設計拆分成兩個或多個部分時，如果沒有考慮將本地程序呼叫遠端化所帶來的效能和可靠性影響，就會發生這種情況。
        </li>
        <li>
            REST API 建立在一系列約定之上，這些約定使其相對容易建立、文件化、監控、偵錯和測試。有龐大的工具生態系統來支援這一點。
        </li>
    </list>
    <p>
        這些權衡意味著 Kotlin RPC 最適合用於兩種情境。首先，在透過 <a
            href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 使用 KMP 客戶端時；其次，
        在雲端中協作的微服務之間。 <a
            href="https://kotlinlang.org/docs/wasm-overview.html">Kotlin/Wasm</a> 的未來發展可能會使 <code>kotlinx.rpc</code>
        更適用於基於瀏覽器的應用程式。
    </p>
</chapter>
<chapter title="Kotlin RPC 與 Google RPC 的比較" id="kotlin-rpc-vs-google-rpc">
    <p>
        Google RPC 是目前軟體產業中佔主導地位的 RPC 技術。它使用一個名為 Protocol Buffers (protobuf) 的標準來定義資料結構和訊息負載，並使用語言中立的介面定義語言 (IDL)。這些 IDL 定義可以轉換成多種程式設計語言，並使用緊湊高效的二進位格式進行序列化。Quarkus 和 Micronaut 等微服務框架已支援 gRPC。
    </p>
    <p>
        Kotlin RPC 很難與 gRPC 競爭，而且對 Kotlin 社群也沒有好處。幸運的是，目前沒有這樣做的計畫。相反，其意圖是讓 kotlinx.rpc 與 gRPC 相容和互通。kotlinx.rpc 服務將可以使用 gRPC 作為其網路協定，而 kotlinx.rpc 客戶端可以呼叫 gRPC 服務。<code>kotlinx.rpc</code> 將使用<a
            href="https://kotlin.github.io/kotlinx-rpc/transport.html">自己的 kRPC 協定</a>作為預設選項（如我們當前範例所示），但沒有任何東西可以阻止您改為選擇 gRPC。
    </p>
</chapter>
<chapter title="後續步驟" id="next-steps">
    <p>
        Kotlin RPC 將 Kotlin 生態系統擴展到新的方向，為建立和消費服務提供了 REST 和 GraphQL 的替代方案。它建立在 Ktor、Coroutines 和 <code>kotlinx-serialization</code> 等經實證的函式庫和框架之上。對於尋求利用 Kotlin 多平台和 Compose 多平台的團隊，它將為分散式訊息傳遞提供一個簡單高效的選項。
    </p>
    <p>
        如果此介紹引起了您的興趣，請務必查閱
        <a href="https://kotlin.github.io/kotlinx-rpc/get-started.html">官方 <code>kotlinx.rpc</code>
        文件</a>和<a
            href="https://github.com/Kotlin/kotlinx-rpc/tree/main/samples">範例</a>。
    </p>
    <p>
        <code>kotlinx.rpc</code>
        函式庫仍處於早期階段，因此我們鼓勵您探索它並分享您的回饋。
        錯誤和功能請求可以在<a href="https://youtrack.jetbrains.com/issues/KRPC">YouTrack</a>上找到，
        而一般討論則在<a
            href="https://kotlinlang.slack.com/archives/C072YJ3Q91V">Slack</a>上進行（<a
            href="https://surveys.jetbrains.com/s3/kotlin-slack-sign-up">請求存取權限</a>）。
    </p>
</chapter>