[//]: # (title: Ktor Serverにおけるリクエストのトレース)

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
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% サーバープラグインを使用すると、一意のコールIDを使用してクライアントリクエストをトレースできます。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-id/io.ktor.server.plugins.callid/-call-id.html)プラグインを使用すると、一意のリクエストIDまたはコールIDを使用して、クライアントリクエストをエンドツーエンドでトレースできます。通常、KtorでコールIDを扱う方法は次のようになります。
1. まず、以下のいずれかの方法で特定のリクエストのコールIDを取得する必要があります。
   * リバースプロキシ（Nginxなど）またはクラウドプロバイダ（[Heroku](heroku.md)など）が、特定のヘッダー（例: `X-Request-Id`）にコールIDを追加する場合があります。この場合、KtorではコールIDを[取得](#retrieve)できます。
   * それ以外の場合、リクエストにコールIDが含まれていない場合は、KtorサーバーでコールIDを[生成](#generate)できます。
2. 次に、Ktorは取得/生成されたコールIDを、事前に定義された辞書を使用して[検証](#verify)します。コールIDを検証するための独自の条件を提供することもできます。
3. 最後に、コールIDを特定のヘッダー（例: `X-Request-Id`）でクライアントに[送信](#send)できます。

%plugin_name%を[CallLogging](server-call-logging.md)と組み合わせて使用すると、MDCコンテキストに[コールIDを設定](#put-call-id-mdc)し、各リクエストのコールIDを表示するようにロガーを設定することで、呼び出しのトラブルシューティングに役立ちます。

> クライアント側では、Ktorはクライアントリクエストをトレースするための[CallId](client-call-id.md)プラグインを提供します。

## 依存関係の追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name%のインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## %plugin_name%の設定 {id="configure"}

### コールIDの取得 {id="retrieve"}

%plugin_name%は、コールIDを取得するためのいくつかの方法を提供します。

* 指定されたヘッダーからコールIDを取得するには、`retrieveFromHeader`関数を使用します。例:
   ```kotlin
   install(CallId) {
       retrieveFromHeader(HttpHeaders.XRequestId)
   }
   ```
   また、`header`関数を使用して、同じヘッダーでコールIDを[取得して送信](#send)することもできます。

* 必要に応じて、`ApplicationCall`からコールIDを取得できます。
   ```kotlin
   install(CallId) {
       retrieve { call ->
           call.request.header(HttpHeaders.XRequestId)
       }
   }
   ```
取得されたすべてのコールIDは、デフォルトの辞書を使用して[検証](#verify)されることに注意してください。

### コールIDの生成 {id="generate"}

受信リクエストにコールIDが含まれていない場合、`generate`関数を使用してコールIDを生成できます。
* 以下の例は、事前定義された辞書から特定の長さのコールIDを生成する方法を示しています。
   ```kotlin
   install(CallId) {
       generate(10, "abcde12345")
   }
   ```
* 以下の例では、`generate`関数はコールIDを生成するためのブロックを受け入れます。
   ```kotlin
   install(CallId) {
       val counter = atomic(0)
       generate {
           "generated-call-id-${counter.getAndIncrement()}"
       }
   }
   ```

### コールIDの検証 {id="verify"}

[取得](#retrieve)または[生成](#generate)されたすべてのコールIDは、次のようなデフォルトの辞書を使用して検証されます。

```kotlin
CALL_ID_DEFAULT_DICTIONARY: String = "abcdefghijklmnopqrstuvwxyz0123456789+/=-"
```
これは、大文字を含むコールIDは検証に合格しないことを意味します。必要に応じて、`verify`関数を使用してより厳密でないルールを適用できます。

```
{src="snippets/call-id/src/main/kotlin/com/example/Application.kt" include-lines="13,15-18"}

完全な例はこちらで見つけることができます: [call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。

### コールIDのクライアントへの送信 {id="send"}

コールIDを[取得](#retrieve)または[生成](#generate)した後、クライアントに送信できます。

* `header`関数は、コールIDを[取得](#retrieve)し、同じヘッダーで送信するために使用できます。

   ```
  {src="snippets/call-id/src/main/kotlin/com/example/Application.kt" include-lines="13-14,18"}

  完全な例はこちらで見つけることができます: [call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。

* `replyToHeader`関数は、指定されたヘッダーでコールIDを送信します。
   ```kotlin
   install(CallId) {
       replyToHeader(HttpHeaders.XRequestId)
   }
   ```

* 必要に応じて、`ApplicationCall`を使用して、[レスポンス](server-responses.md)でコールIDを送信できます。
   ```kotlin
   reply { call, callId ->
       call.response.header(HttpHeaders.XRequestId, callId)
   }
   ```

## MDCへのコールIDの挿入 {id="put-call-id-mdc"}

%plugin_name%を[CallLogging](server-call-logging.md)と組み合わせて使用すると、MDCコンテキストにコールIDを挿入し、各リクエストのコールIDを表示するようにロガーを設定することで、呼び出しのトラブルシューティングに役立ちます。これを行うには、`CallLogging`設定ブロック内で`callIdMdc`関数を呼び出し、MDCコンテキストに挿入する目的のキーを指定します。

```kotlin
```
{src="snippets/call-id/src/main/kotlin/com/example/Application.kt" include-lines="19-21"}

このキーは、ログにコールIDを表示するための[ロガー設定](server-logging.md#configure-logger)に渡すことができます。例えば、`logback.xml`ファイルは次のようになります。
```
```
{style="block" src="snippets/call-id/src/main/resources/logback.xml" include-lines="2-6"}

完全な例はこちらで見つけることができます: [call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)。