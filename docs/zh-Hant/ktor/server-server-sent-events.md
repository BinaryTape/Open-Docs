```xml
<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="server-server-sent-events" title="Ktor 伺服器中的伺服器傳送事件 (Server-Sent Events)" help-id="sse_server">
    <show-structure for="chapter" depth="2"/>
    <primary-label ref="server-plugin"/>
    <var name="plugin_name" value="SSE"/>
    <var name="example_name" value="server-sse"/>
    <var name="package_name" value="io.ktor.server.sse"/>
    <var name="artifact_name" value="ktor-server-sse"/>
    <tldr>
        <p>
            <b>必要依賴項</b>：<code>io.ktor:%artifact_name%</code>
        </p>
        <p>
            <b>程式碼範例</b>：
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
                %example_name%
            </a>
        </p>
    </tldr>
    <link-summary>
        SSE 插件允許伺服器透過 HTTP 連線向客戶端傳送基於事件的更新。
    </link-summary>
    <snippet id="sse-description">
        <p>
            伺服器傳送事件 (Server-Sent Events, SSE) 是一種技術，允許伺服器透過 HTTP 連線不斷向客戶端推送事件。
            當伺服器需要傳送基於事件的更新而無需客戶端重複輪詢伺服器時，這項技術特別有用。
        </p>
        <p>
            Ktor 支援的 SSE 插件提供了一種直接的方法，用於在伺服器和客戶端之間建立單向連線。
        </p>
    </snippet>
    <tip>
        <p>要了解更多關於客戶端支援的 SSE 插件，請參閱
            <Links href="/ktor/client-server-sent-events" summary="SSE 插件允許客戶端透過 HTTP 連線從伺服器接收基於事件的更新。">SSE 客戶端插件</Links>
            。
        </p>
    </tip>
    <note>
        <p>
            對於多向通訊，請考慮使用
            <Links href="/ktor/server-websockets" summary="Websockets 插件允許您在伺服器和客戶端之間建立多向通訊會話。">WebSockets</Links>
            。它們使用 Websocket 協定在伺服器和客戶端之間提供全雙工通訊。
        </p>
    </note>
    <chapter title="限制" id="limitations">
        <p>
            Ktor 不支援 SSE 回應的資料壓縮。
            如果您使用
            <Links href="/ktor/server-compression" summary="必要依賴項：io.ktor:%artifact_name% 程式碼範例：%example_name% 原生伺服器支援：✖️">Compression</Links>
            插件，它將預設跳過 SSE 回應的壓縮。
        </p>
    </chapter>
    <chapter title="新增依賴項" id="add_dependencies">
        <p>
            要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 構件：
        </p>
        <tabs group="languages">
            <tab title="Gradle (Kotlin)" group-key="kotlin">
                <code-block lang="Kotlin" code="                    implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
            </tab>
            <tab title="Gradle (Groovy)" group-key="groovy">
                <code-block lang="Groovy" code="                    implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
            </tab>
            <tab title="Maven" group-key="maven">
                <code-block lang="XML" code="                    &lt;dependency&gt;&#10;                        &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                        &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                        &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;                    &lt;/dependency&gt;"/>
            </tab>
        </tabs>
    </chapter>
    <chapter title="安裝 SSE" id="install_plugin">
        <p>
            要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>到應用程式中，請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函數。
            下面的程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
        </p>
        <list>
            <li>
                ... 在 <code>embeddedServer</code> 函數呼叫內部。
            </li>
            <li>
                ... 在明確定義的 <code>module</code> 內部，它是一個 <code>Application</code> 類別的擴充函數。
            </li>
        </list>
        <tabs>
            <tab title="embeddedServer">
                <code-block lang="kotlin" code="                    import io.ktor.server.engine.*&#10;                    import io.ktor.server.netty.*&#10;                    import io.ktor.server.application.*&#10;                    import %package_name%.*&#10;        &#10;                    fun main() {&#10;                        embeddedServer(Netty, port = 8080) {&#10;                            install(%plugin_name%)&#10;                            // ...&#10;                        }.start(wait = true)&#10;                    }"/>
            </tab>
            <tab title="module">
                <code-block lang="kotlin" code="                    import io.ktor.server.application.*&#10;                    import %package_name%.*&#10;                    // ...&#10;                    fun Application.module() {&#10;                        install(%plugin_name%)&#10;                        // ...&#10;                    }"/>
            </tab>
        </tabs>
    </chapter>
    <chapter title="處理 SSE 會話" id="handle-sessions">
        <p>
            安裝 <code>SSE</code> 插件後，您可以新增路由來處理 SSE 會話。
            為此，請在
            <a href="#define_route">路由</a>
            區塊內部呼叫 <code>sse()</code> 函數。有兩種方式可以設定 SSE 路由：
        </p>
        <list type="decimal">
            <li>
                <p>使用特定的 URL 路徑：</p>
                <code-block lang="kotlin" code="                    routing {&#10;                        sse(&amp;quot;/events&amp;quot;) {&#10;                            // send events to clients&#10;                        }&#10;                    }"/>
            </li>
            <li>
                <p>
                    不帶路徑：
                </p>
                <code-block lang="kotlin" code="                    routing {&#10;                        sse {&#10;                            // send events to clients&#10;                        }&#10;                    }"/>
            </li>
        </list>
        <chapter title="SSE 會話區塊" id="session-block">
            <p>
                在 <code>sse</code> 區塊中，您定義了指定路徑的處理器，該處理器由
                <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session/index.html">
                    <code>ServerSSESession</code>
                </a>
                類別表示。以下函數和屬性在此區塊中可用：</p>
            <deflist>
                <def id="send">
                    <title><code>send()</code></title>
                    建立並傳送 <code>ServerSentEvent</code> 到客戶端。
                </def>
                <def id="call">
                    <title><code>call</code></title>
                    關聯的、發起此會話的已接收 <code>ApplicationCall</code>。
                </def>
                <def id="close">
                    <title><code>close()</code></title>
                    關閉會話並終止與客戶端的連線。當所有 <code>send()</code> 操作完成後，<code>close()</code> 方法會自動呼叫。
                    <note>
                        使用 <code>close()</code> 函數關閉會話不會向客戶端傳送終止事件。要在關閉會話前指示 SSE 流的結束，請使用 <code>send()</code> 函數傳送特定事件。
                    </note>
                </def>
            </deflist>
        </chapter>
        <chapter title="範例：處理單一會話" id="handle-single-session">
            <p>
                以下範例展示了如何在 <code>/events</code> 端點上設定一個 SSE 會話，透過 SSE 通道傳送 6 個獨立事件，每個事件之間延遲 1 秒 (1000 毫秒)：
            </p>
            <code-block lang="kotlin" code="    routing {&#10;        sse(&quot;/events&quot;) {&#10;            repeat(6) {&#10;                send(ServerSentEvent(&quot;this is SSE #$it&quot;))&#10;                delay(1000)&#10;            }&#10;        }&#10;    }"/>
            <p>有關完整範例，請參閱
                <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-sse">server-sse</a>。
            </p>
        </chapter>
        <chapter title="SSE 心跳" id="heartbeat">
            <p>
                心跳確保 SSE 連線在閒置期間透過定期傳送事件保持活躍。
                只要會話保持活躍，伺服器就會以配置的間隔傳送指定事件。
            </p>
            <p>
                要啟用和配置心跳，請在 SSE 路由處理器中呼叫
                <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/heartbeat.html">
                    <code>.heartbeat()</code>
                </a>
                函數：
            </p>
            <code-block lang="kotlin" code="    routing {&#10;        sse(&quot;/heartbeat&quot;) {&#10;            heartbeat {&#10;                period = 10.milliseconds&#10;                event = ServerSentEvent(&quot;heartbeat&quot;)&#10;            }&#10;            // ...&#10;        }&#10;    }"/>
            <p>
                在此範例中，每 10 毫秒傳送一次心跳事件以維持連線。
            </p>
        </chapter>
        <chapter title="序列化" id="serialization">
            <p>
                要啟用序列化，請在 SSE 路由上使用 <code>serialize</code> 參數提供自訂序列化函數。
                在處理器內部，您可以使用
                <a href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sse/io.ktor.server.sse/-server-s-s-e-session-with-serialization/index.html">
                    <code>ServerSSESessionWithSerialization</code>
                </a>
                類別來傳送序列化事件：
            </p>
            <code-block lang="kotlin" code="@Serializable&#10;data class Customer(val id: Int, val firstName: String, val lastName: String)&#10;&#10;@Serializable&#10;data class Product(val id: Int, val prices: List&lt;Int&gt;)&#10;&#10;fun Application.module() {&#10;    install(SSE)&#10;&#10;    routing {&#10;        // example with serialization&#10;        sse(&quot;/json&quot;, serialize = { typeInfo, it -&gt;&#10;            val serializer = Json.serializersModule.serializer(typeInfo.kotlinType!!)&#10;            Json.encodeToString(serializer, it)&#10;        }) {&#10;            send(Customer(0, &quot;Jet&quot;, &quot;Brains&quot;))&#10;            send(Product(0, listOf(100, 200)))&#10;        }&#10;    }&#10;}"/>
            <p>
                此範例中的 <code>serialize</code> 函數負責將資料物件轉換為 JSON，然後將其放入 <code>ServerSentEvent</code> 的 <code>data</code> 欄位中。
            </p>
            <p>有關完整範例，請參閱
                <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-sse">server-sse</a>。
            </p>
        </chapter>
    </chapter>
</topic>