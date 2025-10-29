[//]: # (title: HttpsRedirect)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HttpsRedirect"/>
<var name="package_name" value="io.ktor.server.plugins.httpsredirect"/>
<var name="artifact_name" value="ktor-server-http-redirect"/>

<tldr>
<p>
<b>必須依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-redirect"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">ネイティブサーバー</Links>サポート</b>: ✅
</p>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server-http-redirect/io.ktor.server.plugins.httpsredirect/-https-redirect.html) プラグインは、呼び出しを処理する前に、すべてのHTTPリクエストを[HTTPS版](server-ssl.md)にリダイレクトします。デフォルトでは、リソースは `301 Moved Permanently` を返しますが、`302 Found` に設定することも可能です。

## 依存関係を追加する {id="add_dependencies"}

<p>
    <code>%plugin_name%</code> を使用するには、ビルドスクリプトに <code>%artifact_name%</code> アーティファクトを含める必要があります。
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

## %plugin_name% をインストールする {id="install_plugin"}

<p>
    アプリケーションに <code>%plugin_name%</code> プラグインを<a href="#install">インストール</a>するには、
    指定された<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">モジュール</Links>内の <code>install</code> 関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code> をインストールする方法を示しています...
</p>
<list>
    <li>
        ... <code>embeddedServer</code> 関数呼び出し内。
    </li>
    <li>
        ... <code>Application</code> クラスの拡張関数である、明示的に定義された <code>module</code> 内。
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

上記のコードは、デフォルト設定で `%plugin_name%` プラグインをインストールします。

>リバースプロキシの背後にある場合、HTTPSリクエストを適切に検出するために、`ForwardedHeader`または`XForwardedHeader`プラグインをインストールする必要があります。これらのプラグインのいずれかをインストールした後に無限リダイレクトが発生する場合は、詳細について[このFAQエントリ](FAQ.topic#infinite-redirect)を確認してください。
>
{type="note"}

## %plugin_name% を設定する {id="configure"}

以下のコードスニペットは、目的のHTTPSポートを設定し、要求されたリソースに対して `301 Moved Permanently` を返す方法を示しています。

```kotlin
install(HttpsRedirect) {
    sslPort = 8443
    permanentRedirect = true
}
```

完全な例はこちらで確認できます: [ssl-engine-main-redirect](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-redirect)。