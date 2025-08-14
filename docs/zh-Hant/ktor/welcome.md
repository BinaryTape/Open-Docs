---
aside: false
---
<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="歡迎"
       id="welcome">
    <section-starting-page>
        <title>Ktor 文件</title>
        <description>
            Ktor 是一個用於輕鬆建構非同步伺服器端及用戶端應用程式的框架。
        </description>
        <spotlight>
            <card href="/ktor/server-create-a-new-project" summary="學習如何使用 Ktor 建立、執行及測試伺服器應用程式。">
                開始使用 Ktor 伺服器
            </card>
            <card href="/ktor/client-create-new-application" summary="學習如何使用 Ktor 建立、執行及測試用戶端應用程式。">
                開始使用 Ktor 用戶端
            </card>
        </spotlight>
        <primary>
            <title>Ktor 伺服器</title>
            <card href="/ktor/server-requests-and-responses" summary="透過建立任務管理器應用程式，學習 Ktor 中的路由和請求如何運作。">
                處理請求並產生回應
            </card>
            <card href="/ktor/server-create-restful-apis" summary="學習如何使用 Ktor 建構 RESTful API。本教學涵蓋了真實案例中的設定、路由和測試。">建立 RESTful API</card>
            <card href="/ktor/server-create-website" summary="學習如何使用 Kotlin、Ktor 及 Thymeleaf 範本建構網站。">建立網站</card>
            <card href="/ktor/server-create-websocket-application" summary="學習如何利用 WebSocket 的強大功能傳送及接收內容。">
                建立 WebSocket 應用程式
            </card>
            <card href="/ktor/server-integrate-database" summary="學習如何將 Ktor 服務透過 Exposed SQL 函式庫連接至資料庫儲存庫。">整合資料庫</card>
        </primary>
        <misc>
            <links narrow="true">
                <group>
                    <title>伺服器配置</title>
                    <Links href="/ktor/server-create-a-new-project" summary="學習如何開啟、執行及測試 Ktor 伺服器應用程式。">建立、開啟及執行新的 Ktor 專案</Links>
                    <Links href="/ktor/server-dependencies" summary="學習如何將 Ktor 伺服器依賴新增至現有 Gradle/Maven 專案。">新增伺服器依賴</Links>
                    <Links href="/ktor/server-create-and-configure" summary="學習如何根據您的應用程式部署需求建立伺服器。">建立伺服器</Links>
                    <Links href="/ktor/server-configuration-code" summary="學習如何在程式碼中配置各種伺服器參數。">程式碼中的配置</Links>
                    <Links href="/ktor/server-configuration-file" summary="學習如何在設定檔中配置各種伺服器參數。">檔案中的配置</Links>
                    <Links href="/ktor/server-plugins" summary="插件提供通用功能，例如序列化、內容編碼、壓縮等等。">伺服器插件</Links>
                </group>
                <group>
                    <title>路由</title>
                    <Links href="/ktor/server-routing" summary="路由是處理伺服器應用程式中傳入請求的核心插件。">路由</Links>
                    <Links href="/ktor/server-resources" summary="Resources 插件允許您實作型別安全路由。">型別安全路由</Links>
                    <Links href="/ktor/server-application-structure" summary="學習如何組織您的應用程式，使其在成長過程中保持可維護性。">應用程式結構</Links>
                    <Links href="/ktor/server-requests" summary="學習如何在路由處理器內部處理傳入請求。">處理請求</Links>
                    <Links href="/ktor/server-responses" summary="學習如何傳送不同類型的回應。">傳送回應</Links>
                    <Links href="/ktor/server-static-content" summary="學習如何提供靜態內容，例如樣式表、腳本、圖片等等。">提供靜態內容</Links>
                </group>
                <group>
                    <title>插件</title>
                    <Links href="/ktor/server-serialization" summary="ContentNegotiation 插件有兩個主要目的：在用戶端和伺服器之間協商媒體類型，以及以特定格式序列化/反序列化內容。">Ktor 伺服器中的內容協商與序列化</Links>
                    <Links href="/ktor/server-templating" summary="學習如何使用 HTML/CSS 或 JVM 範本引擎建構的視圖。">範本</Links>
                    <Links href="/ktor/server-auth" summary="Authentication 插件處理 Ktor 中的身份驗證與授權。">Ktor 伺服器中的身份驗證與授權</Links>
                    <Links href="/ktor/server-sessions" summary="Sessions 插件提供了一種在不同 HTTP 請求之間持久化資料的機制。">工作階段</Links>
                    <Links href="/ktor/server-websockets" summary="Websockets 插件允許您在伺服器和用戶端之間建立多向通訊工作階段。">Ktor 伺服器中的 WebSocket</Links>
                    <Links href="/ktor/server-server-sent-events" summary="SSE 插件允許伺服器透過 HTTP 連線向用戶端傳送基於事件的更新。">Ktor 伺服器中的 Server-Sent Events</Links>
                    <Links href="/ktor/server-swagger-ui" summary="SwaggerUI 插件允許您為專案產生 Swagger UI。">Swagger UI</Links> / <Links href="/ktor/server-openapi" summary="OpenAPI 插件允許您為專案產生 OpenAPI 文件。">OpenAPI</Links>
                    <Links href="/ktor/server-custom-plugins" summary="學習如何建立您自己的自訂插件。">自訂伺服器插件</Links>
                </group>
                <group>
                    <title>執行、除錯與測試</title>
                    <Links href="/ktor/server-run" summary="學習如何執行 Ktor 伺服器應用程式。">執行</Links>
                    <Links href="/ktor/server-auto-reload" summary="學習如何使用自動重新載入以在程式碼變更時重新載入應用程式類別。">自動重新載入</Links>
                    <Links href="/ktor/server-testing" summary="學習如何使用特殊測試引擎測試您的伺服器應用程式。">Ktor 伺服器中的測試</Links>
                </group>
                <group>
                    <title>部署</title>
                    <Links href="/ktor/server-fatjar" summary="學習如何使用 Ktor Gradle 插件建立並執行可執行 Fat JAR。">建立 Fat JAR</Links>
                    <Links href="/ktor/server-war" summary="學習如何使用 WAR 封存檔在 Servlet 容器中執行及部署 Ktor 應用程式。">WAR</Links>
                    <Links href="/ktor/graalvm" summary="學習如何在不同平台使用 GraalVM 建立原生映像。">GraalVM</Links>
                    <Links href="/ktor/docker" summary="學習如何將您的應用程式部署到 Docker 容器。">Docker</Links>
                    <Links href="/ktor/google-app-engine" summary="學習如何將您的專案部署到 Google App Engine 標準環境。">Google App Engine</Links>
                    <Links href="/ktor/heroku" summary="學習如何準備並將 Ktor 應用程式部署到 Heroku。">Heroku</Links>
                </group>
            </links>
            <cards>
                <title>Ktor 用戶端</title>
                <card href="/ktor/client-create-new-application" summary="使用 Ktor 建立用戶端應用程式。">
                    建立用戶端應用程式
                </card>
                <card href="/ktor/client-create-multiplatform-application" summary="建立 Kotlin 多平台行動應用程式，並學習如何使用 Ktor 用戶端發出請求及接收回應。">
                    建立跨平台行動應用程式
                </card>
            </cards>
            <links narrow="true">
                <group>
                    <title>用戶端設定</title>
                    <Links href="/ktor/client-create-new-application" summary="建立您的第一個用戶端應用程式，用於傳送請求及接收回應。">建立用戶端應用程式</Links>
                    <Links href="/ktor/client-dependencies" summary="學習如何將用戶端依賴新增至現有專案。">新增用戶端依賴</Links>
                    <Links href="/ktor/client-create-and-configure" summary="學習如何建立及配置 Ktor 用戶端。">建立及配置用戶端</Links>
                    <Links href="/ktor/client-engines" summary="了解處理網路請求的引擎。">用戶端引擎</Links>
                    <Links href="/ktor/client-plugins" summary="熟悉提供通用功能的插件，例如日誌記錄、序列化、授權等。">用戶端插件</Links>
                </group>
                <group>
                    <title>請求</title>
                    <Links href="/ktor/client-requests" summary="學習如何發出請求並指定各種請求參數：請求 URL、HTTP 方法、標頭以及請求主體。">發出請求</Links>
                    <Links href="/ktor/client-resources" summary="學習如何使用 Resources 插件發出型別安全請求。">型別安全請求</Links>
                    <Links href="/ktor/client-default-request" summary="DefaultRequest 插件允許您為所有請求配置預設參數。">預設請求</Links>
                    <Links href="/ktor/client-request-retry" summary="HttpRequestRetry 插件允許您為失敗的請求配置重試策略。">重試失敗的請求</Links>
                </group>
                <group>
                    <title>回應</title>
                    <Links href="/ktor/client-responses" summary="學習如何接收回應、取得回應主體及獲取回應參數。">接收回應</Links>
                    <Links href="/ktor/client-response-validation" summary="學習如何根據其狀態碼驗證回應。">回應驗證</Links>
                </group>
                <group>
                    <title>插件</title>
                    <Links href="/ktor/client-auth" summary="Auth 插件處理您的用戶端應用程式中的身份驗證與授權。">Ktor 用戶端中的身份驗證與授權</Links>
                    <Links href="/ktor/client-cookies" summary="HttpCookies 插件自動處理 Cookie 並將其保留在呼叫之間的儲存中。">Cookie</Links>
                    <Links href="/ktor/client-content-encoding" summary="ContentEncoding 插件允許您啟用指定的壓縮演算法（例如 'gzip' 和 'deflate'）並配置其設定。">內容編碼</Links>
                    <Links href="/ktor/client-bom-remover" summary="BOMRemover 插件允許您從回應主體中移除位元組順序標記 (BOM)。">BOM 移除器</Links>
                    <Links href="/ktor/client-caching" summary="HttpCache 插件允許您將先前獲取的資源儲存到記憶體中或持久性快取中。">快取</Links>
                    <Links href="/ktor/client-websockets" summary="Websockets 插件允許您在伺服器和用戶端之間建立多向通訊工作階段。">Ktor 用戶端中的 WebSocket</Links>
                    <Links href="/ktor/client-server-sent-events" summary="SSE 插件允許用戶端透過 HTTP 連線從伺服器接收基於事件的更新。">Ktor 用戶端中的 Server-Sent Events</Links>
                    <Links href="/ktor/client-custom-plugins" summary="學習如何建立您自己的自訂用戶端插件。">自訂用戶端插件</Links>
                </group>
                <group>
                    <title>測試</title>
                    <Links href="/ktor/client-testing" summary="學習如何使用 MockEngine 透過模擬 HTTP 呼叫來測試您的用戶端。">Ktor 用戶端中的測試</Links>
                </group>
            </links>
            <cards>
                <title>整合</title>
                <card href="/ktor//ktor/full-stack-development-with-kotlin-multiplatform" summary="學習如何使用 Kotlin 和 Ktor 開發跨平台全端應用程式。">使用 Kotlin 多平台建構全端應用程式</card>
                <card href="/ktor//ktor/tutorial-first-steps-with-kotlin-rpc" summary="學習如何使用 Kotlin RPC 和 Ktor 建立您的第一個應用程式。">Kotlin RPC 入門</card>
            </cards>
        </misc>
    </section-starting-page>
</topic>