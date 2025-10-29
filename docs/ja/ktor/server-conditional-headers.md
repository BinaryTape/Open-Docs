[//]: # (title: 条件付きヘッダー)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-conditional-headers"/>
<var name="package_name" value="io.ktor.server.plugins.conditionalheaders"/>
<var name="plugin_name" value="ConditionalHeaders"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="conditional-headers"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
</p>
</tldr>

[ConditionalHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers.html)プラグインは、コンテンツが前回のリクエストから変更されていない場合、そのコンテンツのボディを送信しないようにします。これは、以下のヘッダーを使用することで実現されます。
* `Last-Modified`レスポンスヘッダーには、リソースの最終変更時刻が含まれます。例えば、クライアントのリクエストに`If-Modified-Since`の値が含まれている場合、Ktorは指定された日付の後にリソースが変更されている場合にのみ、完全なレスポンスを送信します。[静的ファイル](server-static-content.md)の場合、Ktorは`ConditionalHeaders`を[インストール](#install_plugin)すると自動的に`Last-Modified`ヘッダーを追加することに注意してください。
* `Etag`レスポンスヘッダーは、特定のリソースバージョンの識別子です。例えば、クライアントのリクエストに`If-None-Match`の値が含まれている場合、この値が`Etag`と一致すれば、Ktorは完全なレスポンスを送信しません。`Etag`の値は、`ConditionalHeaders`を[設定](#configure)する際に指定できます。

## 依存関係の追加 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります。
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

## %plugin_name%のインストール {id="install_plugin"}

<p>
    アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、
    指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>のインストール方法を示しています...
</p>
<list>
    <li>
        ... <code>embeddedServer</code>関数呼び出し内で。
    </li>
    <li>
        ... <code>Application</code>クラスの拡張関数である、明示的に定義された<code>module</code>内で。
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
    <code>%plugin_name%</code>プラグインは、<a href="#install-route">特定のルートにインストール</a>することもできます。
    これは、異なるアプリケーションリソースに対して異なる<code>%plugin_name%</code>設定が必要な場合に役立ちます。
</p>

## ヘッダーの設定 {id="configure"}

`%plugin_name%`を設定するには、`install`ブロック内で[version](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers-config/version.html)関数を呼び出す必要があります。この関数は、特定の`ApplicationCall`と`OutgoingContent`に対するリソースバージョンのリストへのアクセスを提供します。必要なバージョンは、[EntityTagVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-entity-tag-version/index.html)および[LastModifiedVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-last-modified-version/index.html)クラスオブジェクトを使用して指定できます。

以下のコードスニペットは、CSSに`Etag`と`Last-Modified`ヘッダーを追加する方法を示しています。
```kotlin
install(ConditionalHeaders) {
    val file = File("src/main/kotlin/com/example/Application.kt")
    version { call, outgoingContent ->
        when (outgoingContent.contentType?.withoutParameters()) {
            ContentType.Text.CSS -> listOf(
                EntityTagVersion(file.lastModified().hashCode().toString()),
                LastModifiedVersion(Date(file.lastModified()))
            )
            else -> emptyList()
        }
    }
}
```

完全な例はこちらで見つけることができます: [conditional-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/conditional-headers)。