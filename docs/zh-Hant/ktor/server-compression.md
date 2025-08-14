[//]: # (title: 壓縮)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-compression"/>
<var name="package_name" value="io.ktor.server.plugins.compression"/>
<var name="plugin_name" value="Compression"/>

<tldr>
<p>
<b>必要依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="compression"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生伺服器</Links>支援</b>：✖️
    </p>
    
</tldr>

Ktor 提供透過使用 [Compression](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-compression/io.ktor.server.plugins.compression/-compression.html) 插件來壓縮回應主體和解壓縮請求主體的能力。
您可以使用不同的壓縮演算法，包括 `gzip` 和 `deflate`，指定壓縮資料的必要條件（例如內容類型或回應大小），甚至根據特定的請求參數來壓縮資料。

> 請注意，`%plugin_name%` 插件目前不支援 `SSE` 回應。
>
{style="warning"}

> 若要了解如何在 Ktor 中提供預先壓縮的靜態檔案，請參閱 [](server-static-content.md#precompressed)。

## 新增依賴項 {id="add_dependencies"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
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
        若要將 <code>%plugin_name%</code> 插件 <a href="#install">安裝</a> 到應用程式，
        請將其傳遞給指定 <Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">模組</Links> 中的 <code>install</code> 函數。
        以下程式碼片段顯示了如何安裝 <code>%plugin_name%</code>...
    </p>
    <list>
        <li>
            ...在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ...在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類別的擴展函數。
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
    

這會在伺服器上啟用 `gzip`、`deflate` 和 `identity` 編碼器。
在下一章中，我們將會看到如何僅啟用特定的編碼器並配置資料壓縮的條件。
請注意，每個新增的編碼器都將在需要時用於解壓縮請求主體。

## 配置壓縮設定 {id="configure"}

您可以透過多種方式配置壓縮：僅啟用特定編碼器、指定其優先級、僅壓縮特定內容類型等等。

### 新增特定編碼器 {id="add_specific_encoders"}

若要僅啟用特定編碼器，請呼叫對應的擴展函數，例如：

```kotlin
install(Compression) {
    gzip()
    deflate()
}
```

您可以透過設定 `priority` 屬性來指定每個壓縮演算法的優先級：

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

在上面的範例中，`deflate` 具有更高的優先級值並優先於 `gzip`。請注意，伺服器會先查看 [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) 標頭中的 [quality](https://developer.mozilla.org/en-US/docs/Glossary/Quality_Values) 值，然後再考慮指定的優先級。

### 配置內容類型 {id="configure_content_type"}

預設情況下，Ktor 不會壓縮特定內容類型，例如 `audio`、`video`、`image` 和 `text/event-stream`。
您可以透過呼叫 `matchContentType` 來選擇要壓縮的內容類型，或使用 `excludeContentType` 將所需的媒體類型從壓縮中排除。以下程式碼片段顯示了如何使用 `gzip` 壓縮 JavaScript 程式碼，以及如何使用 `deflate` 壓縮所有文字子類型：

[object Promise]

您可以在這裡找到完整範例：[compression](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/compression)。

### 配置回應大小 {id="configure_response_size"}

`%plugin_name%` 插件允許您禁用大小不超過指定值的回應壓縮。為此，請將所需值（以位元組為單位）傳遞給 `minimumSize` 函數：

```kotlin
    install(Compression) {
        deflate {
            minimumSize(1024)
        }
    }

```

### 指定自訂條件 {id="specify_custom_conditions"}

如有必要，您可以使用 `condition` 函數提供自訂條件，並根據特定的請求參數壓縮資料。以下程式碼片段顯示了如何壓縮指定 URI 的請求：

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

啟用壓縮的 HTTPS 容易受到 [BREACH](https://en.wikipedia.org/wiki/BREACH) 攻擊。您可以使用多種方式來緩解此攻擊。例如，當 referrer 標頭指示跨站請求時，您可以禁用壓縮。在 Ktor 中，這可以透過檢查 referrer 標頭值來完成：

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
請參閱 [GzipEncoder](https://github.com/ktorio/ktor/blob/b5b59ca3ae61601e6175f334e6a1252609638e61/ktor-server/ktor-server-plugins/ktor-server-compression/jvm/src/io/ktor/server/plugins/compression/Encoders.kt#L41) 作為實作範例。