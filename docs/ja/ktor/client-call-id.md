[//]: # (title: Ktor Clientでのリクエストのトレース)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-call-id"/>
<var name="package_name" value="io.ktor.client.plugins.callid"/>
<var name="plugin_name" value="CallId"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-call-id"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
%plugin_name%クライアントプラグインを使用すると、一意のコールIDを使用してクライアントリクエストをトレースできます。
</link-summary>

%plugin_name%プラグインを使用すると、一意のコールIDを使用してクライアントリクエストをエンドツーエンドでトレースできます。これは、マイクロサービスアーキテクチャにおいて、リクエストがいくつのサービスを経由しても、コールを追跡するために特に役立ちます。

呼び出しスコープには、コルーチンコンテキストにすでにコールIDが含まれている場合があります。デフォルトでは、プラグインは現在のコンテキストを使用してコールIDを取得し、それを`HttpHeaders.XRequestId`ヘッダーを使用して特定のコールのコンテキストに追加します。

さらに、スコープにコールIDがない場合、[プラグインを構成](#configure)して新しいコールIDを生成し、適用することができます。

> サーバー側では、Ktorはクライアントリクエストのトレースに[CallId](server-call-id.md)プラグインを提供します。

## 依存関係の追加 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります:
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
    アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>の<code>install</code>関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
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

%plugin_name%プラグインの構成は、[CallIdConfig](https://api.ktor.io/ktor-client-call-id/io.ktor.client.plugins.callid/-call-id-config/index.html)クラスによって提供され、コールIDを生成してコールコンテキストに追加できます。

### コールIDの生成

特定の目的のコールIDを以下のいずれかの方法で生成します:

*   `useCoroutineContext`プロパティは、デフォルトで有効になっており、現在の`CoroutineContext`を使用してコールIDを取得するジェネレーターを追加します。この機能を無効にするには、`useCoroutineContext`を`false`に設定します:

 ```kotlin
 install(CallId) {
     useCoroutineContext = false
 }
 ```

> Ktorサーバーでは、[CallIdプラグイン](server-call-id.md)を使用して`CoroutineContext`にコールIDを追加します。

*   `generate()`関数は、送信リクエストのコールIDを生成できます。コールIDの生成に失敗した場合、`null`を返します。

 ```kotlin
 install(CallId) {
     generate { "call-id-client-2" }
 }
 ```

コールIDを生成するために複数のメソッドを使用できます。この方法では、最初の非null値が適用されます。

### コールIDの追加

コールIDを取得した後、リクエストに追加するための以下のオプションが利用可能です:

*   `intercept()`関数は、`CallIdInterceptor`を使用してリクエストにコールIDを追加できます。

 ```kotlin
 install(ClientCallId) {
     intercept { request, callId ->
         request.header(HttpHeaders.XRequestId, callId)
     }
 }
 ```

*   `addToHeader()`関数は、コールIDを指定されたヘッダーに追加します。ヘッダーをパラメータとして受け取り、デフォルトは`HttpHeaders.XRequestId`です。

 ```kotlin
 install(CallId) {
     addToHeader(HttpHeaders.XRequestId)
 }
 ```

## 例

以下の例では、Ktorクライアントの%plugin_name%プラグインが、新しいコールIDを生成してヘッダーに追加するように構成されています:

 ```kotlin
 val client = HttpClient(CIO) {
     install(CallId) {
         generate { "call-id-client" }
         addToHeader(HttpHeaders.XRequestId)
     }
 }
 ```

プラグインはコルーチンコンテキストを使用してコールIDを取得し、`generate()`関数を利用して新しいコールIDを生成します。最初の非nullのコールIDは、`addToHeader()`関数を使用してリクエストヘッダーに適用されます。

Ktorサーバーでは、[CallIdサーバープラグイン](server-call-id.md)の[`retrieve`](server-call-id.md#retrieve)関数を使用して、ヘッダーからコールIDを取得できます。

 ```kotlin
 install(CallId) {
     retrieveFromHeader(HttpHeaders.XRequestId)
 }
 ```

このようにして、Ktorサーバーはリクエストの指定されたヘッダーからIDを取得し、それをコールの`callId`プロパティに適用します。

完全な例については、[client-call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-call-id)を参照してください。