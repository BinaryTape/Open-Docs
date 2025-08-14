[//]: # (title: Ktorサーバーでのリクエストのトレース)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-call-id"/>
<var name="package_name" value="io.ktor.server.plugins.callid"/>
<var name="plugin_name" value="CallId"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-call-id</code>
</p>
<var name="example_name" value="call-id"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id">
            call-id
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
    </p>
    
</tldr>

<link-summary>
CallIdサーバープラグインを使用すると、一意のコールIDを使用してクライアントリクエストをトレースできます。
</link-summary>

[CallId](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-id/io.ktor.server.plugins.callid/-call-id.html)プラグインを使用すると、一意のリクエストIDまたはコールIDを使用してクライアントリクエストをエンドツーエンドでトレースできます。通常、KtorでコールIDを扱うには次のような手順で行います。
1. まず、以下のいずれかの方法で特定のリクエストのコールIDを取得する必要があります。
   *   リバースプロキシ（Nginxなど）やクラウドプロバイダー（[Heroku](heroku.md)など）が、特定のヘッダー（例: `X-Request-Id`）にコールIDを追加する場合があります。この場合、KtorではコールIDを[取得](#retrieve)できます。
   *   それ以外の場合、リクエストにコールIDが含まれていない場合は、KtorサーバーでコールIDを[生成](#generate)できます。
2. 次に、Ktorは取得/生成されたコールIDを、事前定義された辞書を使用して[検証](#verify)します。独自の条件を提供してコールIDを検証することもできます。
3. 最後に、コールIDを特定のヘッダー（例: `X-Request-Id`）でクライアントに[送信](#send)できます。

`CallId`を[CallLogging](server-call-logging.md)と組み合わせて使用すると、コールIDをMDCコンテキストに[配置](#put-call-id-mdc)し、各リクエストのコールIDを表示するようにロガーを設定することで、呼び出しのトラブルシューティングに役立ちます。

> クライアント側では、Ktorはクライアントリクエストをトレースするための[CallId](client-call-id.md)プラグインを提供しています。

## 依存関係を追加する {id="add_dependencies"}

    <p>
        <code>CallId</code>を使用するには、ビルドスクリプトに<code>ktor-server-call-id</code>アーティファクトを含める必要があります。
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
    

## CallIdをインストールする {id="install_plugin"}

    <p>
        アプリケーションに<code>CallId</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>CallId</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出しの内部
        </li>
        <li>
            ... <code>Application</code>クラスの拡張関数である、明示的に定義された<code>module</code>の内部
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
    

## CallIdを構成する {id="configure"}

### コールIDを取得する {id="retrieve"}

`CallId`は、コールIDを取得するためのいくつかの方法を提供します。

*   指定されたヘッダーからコールIDを取得するには、`retrieveFromHeader`関数を使用します。例えば、
   ```kotlin
   install(CallId) {
       retrieveFromHeader(HttpHeaders.XRequestId)
   }
   ```
   `header`関数を使用して、同じヘッダーでコールIDを[取得して送信](#send)することもできます。

*   必要であれば、`ApplicationCall`からコールIDを取得できます。
   ```kotlin
   install(CallId) {
       retrieve { call ->
           call.request.header(HttpHeaders.XRequestId)
       }
   }
   ```
取得されたすべてのコールIDは、デフォルトの辞書を使用して[検証](#verify)されることに注意してください。

### コールIDを生成する {id="generate"}

受信リクエストにコールIDが含まれていない場合、`generate`関数を使用して生成できます。
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

### コールIDを検証する {id="verify"}

[取得](#retrieve)または[生成](#generate)されたすべてのコールIDは、以下に示すデフォルトの辞書を使用して検証されます。

```kotlin
CALL_ID_DEFAULT_DICTIONARY: String = "abcdefghijklmnopqrstuvwxyz0123456789+/=-"
```
これは、大文字を含むコールIDは検証に合格しないことを意味します。必要に応じて、`verify`関数を使用してより厳密でないルールを適用できます。

[object Promise]

完全な例は[こちら](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)で確認できます：[call-id]。

### クライアントにコールIDを送信する {id="send"}

コールIDを[取得](#retrieve)または[生成](#generate)した後、それをクライアントに送信できます。

*   `header`関数は、コールIDを[取得](#retrieve)し、同じヘッダーで送信するために使用できます。

   [object Promise]

  完全な例は[こちら](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)で確認できます：[call-id]。

*   `replyToHeader`関数は、指定されたヘッダーにコールIDを送信します。
   ```kotlin
   install(CallId) {
       replyToHeader(HttpHeaders.XRequestId)
   }
   ```

*   必要であれば、`ApplicationCall`を使用して[レスポンス](server-responses.md)にコールIDを送信できます。
   ```kotlin
   reply { call, callId ->
       call.response.header(HttpHeaders.XRequestId, callId)
   }
   ```

## コールIDをMDCに配置する {id="put-call-id-mdc"}

`CallId`を[CallLogging](server-call-logging.md)と組み合わせて使用すると、コールIDをMDCコンテキストに配置し、各リクエストのコールIDを表示するようにロガーを設定することで、呼び出しのトラブルシューティングに役立ちます。これを行うには、`CallLogging`設定ブロック内で`callIdMdc`関数を呼び出し、MDCコンテキストに配置するキーを指定します。

[object Promise]

このキーは、ログにコールIDを表示するために[ロガー設定](server-logging.md#configure-logger)に渡すことができます。例えば、`logback.xml`ファイルは次のようになるでしょう。
[object Promise]

完全な例は[こちら](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id)で確認できます：[call-id]。