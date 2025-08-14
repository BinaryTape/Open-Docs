<topic xmlns="" xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="server-development-mode" title="開發模式"
       help-id="development_mode;development-mode">
<show-structure for="chapter" depth="2"/>
<p>
    Ktor 提供了一種專為開發而設計的特殊模式。此模式啟用以下功能：
</p>
<list>
    <li><Links href="/ktor/server-auto-reload" summary="了解如何使用自動重載在程式碼變更時重新載入應用程式類別。">自動重載 (Auto-reload)</Links>，用於重新載入應用程式類別而無需重新啟動伺服器。
    </li>
    <li>用於偵錯 <a href="#pipelines">管道 (pipelines)</a> 的擴展資訊（包含堆疊追蹤）。
    </li>
    <li>在發生 <emphasis>5**</emphasis> 伺服器錯誤時，<Links href="/ktor/server-status-pages" summary="%plugin_name% 允許 Ktor 應用程式根據拋出的異常或狀態碼，對任何失敗狀態做出適當回應。">回應頁面</Links> 上提供擴展的偵錯資訊。
    </li>
</list>
<note>
    <p>
        請注意，開發模式會影響效能，不應在生產環境中使用。
    </p>
</note>
<chapter title="啟用開發模式" id="enable">
    <p>
        您可以透過不同的方式啟用開發模式：在應用程式組態檔中、使用專用的系統屬性，或環境變數。
    </p>
    <chapter title="組態檔" id="application-conf">
        <p>
            要在
            <Links href="/ktor/server-configuration-file" summary="了解如何在組態檔中設定各種伺服器參數。">組態檔</Links> 中啟用開發模式，請將 <code>development</code> 選項設定為 <code>true</code>：
        </p>
        <tabs group="config">
            <tab title="application.conf" group-key="hocon">
                [object Promise]
            </tab>
            <tab title="application.yaml" group-key="yaml">
                [object Promise]
            </tab>
        </tabs>
    </chapter>
    <chapter title="<code>io.ktor.development</code> 系統屬性" id="system-property">
        <p>
            <control><code>io.ktor.development</code></control>
            <a href="https://docs.oracle.com/javase/tutorial/essential/environment/sysprop.html">系統屬性</a>
            允許您在執行應用程式時啟用開發模式。
        </p>
        <p>
            要在 IntelliJ IDEA 中以開發模式執行應用程式，
            請將 <code>io.ktor.development</code> 和 <code>-D</code> 標誌傳遞給
            <a href="https://www.jetbrains.com/help/idea/run-debug-configuration-kotlin.html#1">VM 選項</a>：
        </p>
        [object Promise]
        <p>
            如果您使用 <Links href="/ktor/server-dependencies" summary="了解如何將 Ktor 伺服器依賴項新增到現有的 Gradle/Maven 專案。">Gradle</Links> 任務執行應用程式，
            您可以透過以下兩種方式之一啟用開發模式：
        </p>
        <list>
            <li>
                <p>
                    在您的 <Path>build.gradle.kts</Path> 檔案中設定 <code>ktor</code> 區塊：
                </p>
                [object Promise]
            </li>
            <li>
                <p>
                    透過傳遞 Gradle CLI 標誌，為單次執行啟用開發模式：
                </p>
                [object Promise]
            </li>
        </list>
        <tip>
            <p>
                您也可以使用 <code>-ea</code> 標誌來啟用開發模式。
                請注意，使用 <code>-D</code> 標誌傳遞的 <code>io.ktor.development</code> 系統屬性優先於 <code>-ea</code>。
            </p>
        </tip>
    </chapter>
    <chapter title="<code>io.ktor.development</code> 環境變數" id="environment-variable">
        <p>
            要為 <a href="#native">原生客戶端 (Native client)</a> 啟用開發模式，
            請使用 <code>io.ktor.development</code> 環境變數。
        </p>
    </chapter>
</chapter>
</topic>