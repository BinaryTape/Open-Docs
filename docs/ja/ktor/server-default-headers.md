[//]: # (title: デフォルトヘッダー)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-default-headers"/>
<var name="package_name" value="io.ktor.server.plugins.defaultheaders"/>
<var name="plugin_name" value="DefaultHeaders"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-default-headers/io.ktor.server.plugins.defaultheaders/-default-headers.html"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](%plugin_api_link%)プラグインは、標準の`Server`ヘッダーと`Date`ヘッダーを各レスポンスに追加します。さらに、追加のデフォルトヘッダーを提供したり、`Server`ヘッダーをオーバーライドしたりできます。

## 依存関係の追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name%のインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## %plugin_name%の構成 {id="configure"}
### 追加ヘッダーの追加 {id="add"}
デフォルトヘッダーのリストをカスタマイズするには、`header(name, value)`関数を使用して、必要なヘッダーを`install`に渡します。`name`パラメーターは`HttpHeaders`値を受け入れます。例：
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.ETag, "7c876b7e")
    }
```
カスタムヘッダーを追加するには、その名前を文字列値として渡します。
```kotlin
    install(DefaultHeaders) {
        header("Custom-Header", "Some value")
    }
```

### ヘッダーのオーバーライド {id="override"}
`Server`ヘッダーをオーバーライドするには、対応する`HttpHeaders`値を使用します。
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.Server, "Custom")
    }
```
なお、`Date`ヘッダーはパフォーマンス上の理由からキャッシュされており、%plugin_name%を使用してオーバーライドすることはできません。