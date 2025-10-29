[//]: # (title: コールロギング)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CallLogging"/>
<var name="package_name" value="io.ktor.server.plugins.calllogging"/>
<var name="artifact_name" value="ktor-server-call-logging"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="logging"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✖️
</p>
</tldr>

Ktorは、[SLF4J](http://www.slf4j.org/)ライブラリを使用してアプリケーションイベントをログに記録する機能を提供します。一般的なロギング設定については、[Ktorサーバーでのロギング](server-logging.md)のトピックを参照してください。

プラグイン`%plugin_name%`を使用すると、着信クライアントリクエストをログに記録できます。

## 依存関係を追加する {id="add_dependencies"}

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

## %plugin_name%をインストールする {id="install_plugin"}

<p>
    アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
</p>
<list>
    <li>
        ... <code>embeddedServer</code>関数呼び出し内。
    </li>
    <li>
        ... <code>Application</code>クラスの拡張関数である明示的に定義された<code>module</code>内。
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

## ロギング設定を構成する {id="configure"}

`%plugin_name%`は、複数の方法で構成できます。ロギングレベルの指定、指定された条件に基づくリクエストのフィルタリング、ログメッセージのカスタマイズなどです。利用可能な構成設定は、[CallLoggingConfig](https://api.ktor.io/ktor-server-call-logging/io.ktor.server.plugins.calllogging/-call-logging-config/index.html)で確認できます。

### ロギングレベルを設定する {id="logging_level"}

デフォルトでは、Ktorは`Level.INFO`ロギングレベルを使用します。これを変更するには、`level`プロパティを使用します。

```kotlin
install(CallLogging) {
    level = Level.INFO
}
```

### ログリクエストをフィルタリングする {id="filter"}

`filter`プロパティを使用すると、リクエストをフィルタリングするための条件を追加できます。以下の例では、`/api/v1`へのリクエストのみがログに記録されます。

```kotlin
install(CallLogging) {
    filter { call ->
        call.request.path().startsWith("/api/v1")
    }
}
```

### ログメッセージの形式をカスタマイズする {id="format"}

`format`関数を使用すると、リクエスト/レスポンスに関連する任意のデータをログに記録できます。以下の例は、各リクエストに対するレスポンスステータス、リクエストHTTPメソッド、および`User-Agent`ヘッダー値をログに記録する方法を示します。

```kotlin
install(CallLogging) {
    format { call ->
        val status = call.response.status()
        val httpMethod = call.request.httpMethod.value
        val userAgent = call.request.headers["User-Agent"]
        "Status: $status, HTTP method: $httpMethod, User agent: $userAgent"
    }
}
```

完全な例は、[logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging)で確認できます。

### コールパラメーターをMDCに配置する {id="mdc"}

`%plugin_name%`プラグインはMDC（Mapped Diagnostic Context）をサポートしています。`mdc`関数を使用して、指定された名前で目的のコンテキスト値をMDCに配置できます。たとえば、以下のコードスニペットでは、`name`クエリパラメーターがMDCに追加されます。

```kotlin
install(CallLogging) {
    mdc("name-parameter") { call ->
        call.request.queryParameters["name"]
    }
}
```

`ApplicationCall`のライフタイム中に、追加された値にアクセスできます。

```kotlin
import org.slf4j.MDC
// ...
MDC.get("name-parameter")