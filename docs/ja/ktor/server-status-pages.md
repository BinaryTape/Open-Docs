[//]: # (title: ステータスページ)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="StatusPages"/>
<var name="package_name" value="io.ktor.server.plugins.statuspages"/>
<var name="artifact_name" value="ktor-server-status-pages"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="status-pages"/>
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

<link-summary>
%plugin_name% は、Ktorアプリケーションがスローされた例外やステータスコードに基づいて、あらゆる失敗状態に適切に応答できるようにします。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-status-pages/io.ktor.server.plugins.statuspages/-status-pages.html)プラグインは、Ktorアプリケーションがスローされた例外やステータスコードに基づいて、あらゆる失敗状態に適切に[応答](server-responses.md)できるようにします。

## 依存関係の追加 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>を使用するには、<code>%artifact_name%</code>アーティファクトをビルドスクリプトに含める必要があります。
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
    指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>の<code>install</code>関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています。
</p>
<list>
    <li>
        <code>embeddedServer</code>関数呼び出しの内部。
    </li>
    <li>
        <code>Application</code>クラスの拡張関数である、明示的に定義された<code>module</code>の内部。
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

## %plugin_name%の設定 {id="configure"}

`%plugin_name%`プラグインには、主に3つの設定オプションがあります。

- [例外](#exceptions): マップされた例外クラスに基づいて応答を設定します
- [ステータス](#status): ステータスコード値に応答を設定します
- [ステータスファイル](#status-file): クラスパスからファイル応答を設定します

### 例外 {id="exceptions"}

`exception`ハンドラーを使用すると、`Throwable`例外が発生した呼び出しを処理できます。最も基本的なケースでは、任意の例外に対して`500` HTTPステータスコードを設定できます。

```kotlin
install(StatusPages) {
    exception<Throwable> { call, cause ->
        call.respondText(text = "500: $cause" , status = HttpStatusCode.InternalServerError)
    }
}
```

特定の例外をチェックし、必要なコンテンツで応答することもできます。

```kotlin
install(StatusPages) {
    exception<Throwable> { call, cause ->
        if(cause is AuthorizationException) {
            call.respondText(text = "403: $cause" , status = HttpStatusCode.Forbidden)
        } else {
            call.respondText(text = "500: $cause" , status = HttpStatusCode.InternalServerError)
        }
    }
}
```

### ステータス {id="status"}

`status`ハンドラーは、ステータスコードに基づいて特定のコンテンツで応答する機能を提供します。以下の例は、サーバーでリソースが見つからない場合（`404`ステータスコード）のリクエストに応答する方法を示しています。

```kotlin
install(StatusPages) {
    status(HttpStatusCode.NotFound) { call, status ->
        call.respondText(text = "404: Page Not Found", status = status)
    }
}
```

### ステータスファイル {id="status-file"}

`statusFile`ハンドラーを使用すると、ステータスコードに基づいてHTMLページを提供できます。プロジェクトの`resources`フォルダーに`error401.html`と`error402.html`というHTMLページが含まれているとします。この場合、`statusFile`を使用して`401`および`402`ステータスコードを次のように処理できます。
```kotlin
install(StatusPages) {
    statusFile(HttpStatusCode.Unauthorized, HttpStatusCode.PaymentRequired, filePattern = "error#.html")
}
```

`statusFile`ハンドラーは、設定されたステータスのリスト内で、`#`文字をステータスコードの値に置き換えます。

> 完全な例は[こちら](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/status-pages)にあります: [status-pages](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/status-pages)。