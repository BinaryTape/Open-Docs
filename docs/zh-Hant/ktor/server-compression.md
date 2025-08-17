[//]: # (title: 壓縮)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-compression"/>
<var name="package_name" value="io.ktor.server.plugins.compression"/>
<var name="plugin_name" value="Compression"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="compression"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="模組允許您透過分組路由來組織應用程式。">原生伺服器</Links>支援</b>：✖️
</p>
</tldr>

Ktor 提供了使用 [Compression](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-compression/io.ktor.server.plugins.compression/-compression.html) 外掛程式壓縮回應主體和解壓縮請求主體的能力。
您可以使用不同的壓縮演算法，包括 `gzip` 和 `deflate`，指定壓縮資料所需的條件（例如內容類型或回應大小），甚至可以根據特定的請求參數壓縮資料。

> 請注意，`%plugin_name%` 外掛程式目前不支援 `SSE` 回應。
>
{style="warning"}

> 若要瞭解如何在 Ktor 中提供預壓縮的靜態檔案，請參閱 [預壓縮檔案](server-static-content.md#precompressed)。

## 新增依賴項 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
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
    若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，
    請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函數。
    下方的程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ...在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ...在明確定義的 <code>module</code> 內部，它是一個 <code>Application</code> 類別的擴充函數。
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

這會啟用伺服器上的 `gzip`、`deflate` 和 `identity` 編碼器。
在下一章中，我們將會看到如何只啟用特定的編碼器並設定資料壓縮的條件。請注意，每個新增的編碼器都將在需要時用於解壓縮請求主體。

## 設定壓縮設定 {id="configure"}

您可以透過多種方式設定壓縮：只啟用特定的編碼器、指定其優先級、只壓縮特定的內容類型等等。

### 新增特定的編碼器 {id="add_specific_encoders"}

若要只啟用特定的編碼器，請呼叫對應的擴充函數，例如：

```kotlin
install(Compression) {
    gzip()
    deflate()
}
```

您可以透過設定 `priority` 屬性來為每個壓縮演算法指定優先級：

```kotlin
install(Compression) {
    gzip {
        priority = 0.9
    }
    deflate {
        priority = 1.0
    }
}
```

在上述範例中，`deflate` 具有較高的優先級值，並優先於 `gzip`。請注意，伺服器會先查看 [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) 標頭中的 [品質](https://developer.mozilla.org/en-US/docs/Glossary/Quality_Values) 值，然後再考慮指定的優先級。

### 設定內容類型 {id="configure_content_type"}

預設情況下，Ktor 不會壓縮特定的內容類型，例如 `audio`、`video`、`image` 和 `text/event-stream`。
您可以透過呼叫 `matchContentType` 來選擇要壓縮的內容類型，或使用 `excludeContentType` 將所需的媒體類型從壓縮中排除。下方的程式碼片段展示了如何使用 `gzip` 壓縮 JavaScript 程式碼以及使用 `deflate` 壓縮所有文字子類型：

```kotlin
install(Compression) {
    gzip {
        matchContentType(
            ContentType.Application.JavaScript
        )
    }
    deflate {
        matchContentType(
            ContentType.Text.Any
        )
    }
}
```

您可以在此處找到完整範例：[compression](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/compression)。

### 設定回應大小 {id="configure_response_size"}

`%plugin_name%` 外掛程式允許您對大小不超過指定值的回應停用壓縮。為此，請將所需的值（以位元組為單位）傳遞給 `minimumSize` 函數：

```kotlin
    install(Compression) {
        deflate {
            minimumSize(1024)
        }
    }

```

### 指定自訂條件 {id="specify_custom_conditions"}

如有必要，您可以使用 `condition` 函數提供自訂條件，並根據特定的請求參數壓縮資料。下方的程式碼片段展示了如何壓縮指定 URI 的請求：

```kotlin
install(Compression) {
    gzip {
        condition {
            request.uri == "/orders"
        }
    }
}
```

## HTTPS 安全性 {id="security"}

啟用壓縮的 HTTPS 容易受到 [BREACH](https://en.wikipedia.org/wiki/BREACH) 攻擊。您可以使用多種方式來緩解此攻擊。例如，當 referrer 標頭指示跨站點請求時，您可以停用壓縮。在 Ktor 中，這可以透過檢查 referrer 標頭值來完成：

```kotlin
install(Compression) {
    gzip {
        condition {
            request.headers[HttpHeaders.Referrer]?.startsWith("https://my.domain/") == true
        }
    }
}
```

## 實作自訂編碼器 {id="custom_encoder"}

如有必要，您可以透過實作 [ContentEncoder](https://api.ktor.io/ktor-utils/io.ktor.util/-content-encoder/index.html) 介面來提供您自己的編碼器。
請參閱 [GzipEncoder](https://github.com/ktorio/ktor/blob/b5b59ca3ae61601e6175f334e6a1252609638e61/ktor-server/ktor-server-compression/jvm/src/io/ktor/server/plugins/compression/Encoders.kt#L41) 作為實作範例。