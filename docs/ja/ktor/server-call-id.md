[//]: # (title: Ktorサーバーでのリクエストトレース)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-call-id"/>
<var name="package_name" value="io.ktor.server.plugins.callid"/>
<var name="plugin_name" value="CallId"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="call-id"/>
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
%plugin_name%サーバープラグインを使用すると、一意のコールIDを使用してクライアントリクエストをトレースできます。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-id/io.ktor.server.plugins.callid/-call-id.html)プラグインを使用すると、一意のリクエストIDまたはコールIDを使用して、クライアントリクエストをエンドツーエンドでトレースできます。通常、KtorでコールIDを扱う方法は次のようになります。
1.  まず、特定の要求のコールIDを以下のいずれかの方法で取得する必要があります。
    *   リバースプロキシ（Nginxなど）やクラウドプロバイダー（[Heroku](heroku.md)など）が、特定のヘッダー（例: `X-Request-Id`）にコールIDを追加する場合があります。この場合、KtorではコールIDを[取得](#retrieve)できます。
    *   それ以外の場合、リクエストにコールIDが含まれていない場合は、KtorサーバーでコールIDを[生成](#generate)できます。
2.  次に、Ktorは取得または生成されたコールIDを、事前定義された辞書を使用して[検証](#verify)します。コールIDを検証するための独自の条件を提供することもできます。
3.  最後に、特定のヘッダー（例: `X-Request-Id`）でコールIDをクライアントに[送信](#send)できます。

`%plugin_name%`を[CallLogging](server-call-logging.md)と組み合わせて使用​​すると、コールIDをMDCコンテキストに[配置](#put-call-id-mdc)し、各リクエストのコールIDを表示するようにロガーを構成することで、コールのトラブルシューティングに役立ちます。

> クライアント側では、Ktorはクライアントリクエストをトレースするための[CallId](client-call-id.md)プラグインを提供します。

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
    アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
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

## %plugin_name%の構成 {id="configure"}

### コールIDの取得 {id="retrieve"}

`%plugin_name%`は、コールIDを取得するためのいくつかの方法を提供します。

*   指定されたヘッダーからコールIDを取得するには、`retrieveFromHeader`関数を使用します。例:
   ```kotlin
   install(CallId) {
       retrieveFromHeader(HttpHeaders.XRequestId)
   }
   ```
   `header`関数を使用して、同じヘッダーでコールIDを[取得および送信](#send)することもできます。

*   必要に応じて、`ApplicationCall`からコールIDを取得できます。
   ```kotlin
   install(CallId) {
       retrieve { call ->
           call.request.header(HttpHeaders.XRequestId)
       }
   }
   ```
取得されたすべてのコールIDは、デフォルトの辞書を使用して[検証](#verify)されることに注意してください。

### コールIDの生成 {id="generate"}

受信リクエストにコールIDが含まれていない場合は、`generate`関数を使用して生成できます。
*   以下の例は、事前定義された辞書から特定の長さのコールIDを生成する方法を示しています。
   ```kotlin
   install(CallId) {
       generate(10, "abcde12345")
   }
   ```
*   以下の例では、`generate`関数はコールIDを生成するためのブロックを受け入れます。
   ```kotlin
   install(CallId) {
       val counter = atomic(0)
       generate {
           "generated-call-id-${counter.getAndIncrement()}"
       }
   }
   ```

### コールIDの検証 {id="verify"}

[取得](#retrieve)または[生成](#generate)されたすべてのコールIDは、以下に示すデフォルトの辞書を使用して検証されます。

```kotlin
CALL_ID_DEFAULT_DICTIONARY: String = "abcdefghijklmnopqrstuvwxyz0123456789+/=-"
```
これは、大文字を含むコールIDは検証に合格しないことを意味します。必要に応じて、`verify`関数を使用してより緩いルールを適用できます。

```kotlin
install(CallId) {
    verify { callId: String ->
        callId.isNotEmpty()
    }
}
```

完全な例はこちらにあります: [call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。

### コールIDをクライアントに送信する {id="send"}

コールIDを[取得](#retrieve)/[生成](#generate)した後、クライアントに送信できます。

*   `header`関数は、コールIDを[取得](#retrieve)し、同じヘッダーで送信するために使用できます。

   ```kotlin
   install(CallId) {
       header(HttpHeaders.XRequestId)
   }
   ```

  完全な例はこちらにあります: [call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。

*   `replyToHeader`関数は、指定されたヘッダーにコールIDを送信します。
   ```kotlin
   install(CallId) {
       replyToHeader(HttpHeaders.XRequestId)
   }
   ```

*   必要に応じて、`ApplicationCall`を使用して、[レスポンス](server-responses.md)でコールIDを送信できます。
   ```kotlin
   reply { call, callId ->
       call.response.header(HttpHeaders.XRequestId, callId)
   }
   ```

## MDCにコールIDを設定する {id="put-call-id-mdc"}

`%plugin_name%`を[CallLogging](server-call-logging.md)と組み合わせて使用​​すると、コールIDをMDCコンテキストに設定し、各リクエストのコールIDを表示するようにロガーを構成することで、コールのトラブルシューティングに役立ちます。これを行うには、`CallLogging`設定ブロック内で`callIdMdc`関数を呼び出し、MDCコンテキストに設定するキーを指定します。

```kotlin
install(CallLogging) {
    callIdMdc("call-id")
}
```

このキーは、ログにコールIDを表示するために[ロガー設定](server-logging.md#configure-logger)に渡すことができます。たとえば、`logback.xml`ファイルは次のようになります。
```
<appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
        <pattern>%d{YYYY-MM-dd HH:mm:ss.SSS} [%thread] %X{call-id} %-5level %logger{36} - %msg%n</pattern>
    </encoder>
</appender>
```

完全な例はこちらにあります: [call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。