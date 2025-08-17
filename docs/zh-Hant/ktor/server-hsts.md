[//]: # (title: HSTS)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HSTS"/>
<var name="package_name" value="io.ktor.server.plugins.hsts"/>
<var name="artifact_name" value="ktor-server-hsts"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-hsts"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在沒有額外運行時或虛擬機器的情況下運行伺服器。">原生伺服器</Links>支援</b>: ✅
</p>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s.html) 外掛會根據 [RFC 6797](https://tools.ietf.org/html/rfc6797) 將所需的 *HTTP 嚴格傳輸安全性* 標頭添加到請求中。當瀏覽器收到 HSTS 策略標頭時，它在指定期間內不再嘗試使用不安全的連線連接到伺服器。

> 請注意，HSTS 策略標頭在不安全的 HTTP 連線下會被忽略。為了讓 HSTS 生效，它應該透過[安全](server-ssl.md)連線提供服務。

## 添加依賴項 {id="add_dependencies"}

<p>
    為了使用 <code>%plugin_name%</code>，您需要將 <code>%artifact_name%</code> artifact 包含在建置腳本中：
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 安裝 %plugin_name% {id="install_plugin"}

<p>
    為了將 <code>%plugin_name%</code> 外掛[安裝](#install)到應用程式中，請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函數。下面的程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫中。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 中，該 <code>module</code> 是 <code>Application</code> 類別的擴充函數。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>
<p>
    <code>%plugin_name%</code> 外掛也可以[安裝](#install-route)到特定路由。如果您需要針對不同的應用程式資源使用不同的 <code>%plugin_name%</code> 配置，這可能很有用。
</p>

## 配置 %plugin_name% {id="configure"}

<code>%plugin_name%</code> 透過 [HSTSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s-config/index.html) 公開其設定。下面的範例展示了如何使用 <code>maxAgeInSeconds</code> 屬性來指定客戶端應將主機保留在已知 HSTS 主機清單中的時間長度：

```kotlin
install(HSTS) {
    maxAgeInSeconds = 10
}
```

您還可以針對不同主機提供不同的 HSTS 配置，使用 <code>withHost</code>：

```kotlin
install(HSTS) {
    maxAgeInSeconds = 10
    withHost("sample-host") {
        maxAgeInSeconds = 60
        includeSubDomains = false
    }
}
```

您可以在這裡找到完整的範例：[ssl-engine-main-hsts](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-hsts)。