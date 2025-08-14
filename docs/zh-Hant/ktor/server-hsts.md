[//]: # (title: HSTS)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HSTS"/>
<var name="package_name" value="io.ktor.server.plugins.hsts"/>
<var name="artifact_name" value="ktor-server-hsts"/>

<tldr>
<p>
<b>所需依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-hsts"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在沒有額外執行時間或虛擬機器的情況下執行伺服器。">原生伺服器</Links> 支援</b>: ✅
    </p>
    
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s.html) 外掛程式根據 [RFC 6797](https://tools.ietf.org/html/rfc6797) 將所需的 _HTTP 嚴格傳輸安全_ 標頭新增至請求中。當瀏覽器收到 HSTS 策略標頭時，它在指定期間內將不再嘗試使用不安全的連線連接到伺服器。

> 請注意，HSTS 策略標頭在不安全的 HTTP 連線上會被忽略。為使 HSTS 生效，它應透過 [安全](server-ssl.md) 連線提供。

## 新增依賴 {id="add_dependencies"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要將 <code>%artifact_name%</code> artifact 包含在建置指令碼中：
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## 安裝 %plugin_name% {id="install_plugin"}

    <p>
        若要將 <code>%plugin_name%</code> 外掛程式 <a href="#install">安裝</a> 到應用程式中，
        請在指定的 <Links href="/ktor/server-modules" summary="模組可讓您透過分組路由來組織應用程式。">模組</Links> 中將其傳遞給 <code>install</code> 函數。
        下面的程式碼片段顯示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，它是 <code>Application</code> 類別的擴展函數。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

    <p>
        <code>%plugin_name%</code> 外掛程式也可以 <a href="#install-route">安裝到特定的路由</a>。
        如果您需要針對不同的應用程式資源使用不同的 <code>%plugin_name%</code> 配置，這可能很有用。
    </p>
    

## 配置 %plugin_name% {id="configure"}

`%plugin_name%` 透過 [HSTSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s-config/index.html) 暴露其設定。下面的範例展示了如何使用 <code>maxAgeInSeconds</code> 屬性來指定客戶端應將主機保留在已知 HSTS 主機列表中的時間長度：

[object Promise]

您也可以使用 <code>withHost</code> 為不同的主機提供不同的 HSTS 配置：

[object Promise]

您可以在此處找到完整的範例：[ssl-engine-main-hsts](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-hsts)。