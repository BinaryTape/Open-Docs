[//]: # (title: Ktor Clientにおけるリクエストの追跡)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-call-id"/>
<var name="package_name" value="io.ktor.client.plugins.callid"/>
<var name="plugin_name" value="CallId"/>

<tldr>
<p>
<b>必要な依存関係</b>: `io.ktor:%artifact_name%`
</p>
<var name="example_name" value="client-call-id"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
%plugin_name%クライアントプラグインは、一意のコールIDを使用することで、クライアントリクエストを追跡することを可能にします。
</link-summary>

%plugin_name%プラグインを使用すると、一意のコールIDを使用してクライアントリクエストをエンドツーエンドで追跡できます。これは、リクエストがいくつのサービスを経由するかにかかわらず、コールを追跡するために、マイクロサービスアーキテクチャにおいて特に有用です。

呼び出しスコープには、すでにコルーチンコンテキストにコールIDが存在している場合があります。デフォルトでは、プラグインは現在のコンテキストを使用してコールIDを取得し、`HttpHeaders.XRequestId`ヘッダーを使用して特定のコールのコンテキストにそれを追加します。

さらに、スコープにコールIDがない場合は、[プラグインを設定](#configure)して新しいコールIDを生成し、適用できます。

> サーバー側では、Ktorはクライアントリクエストの追跡のために[CallId](server-call-id.md)プラグインを提供しています。

## 依存関係を追加する {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name%をインストールする {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## %plugin_name%を設定する {id="configure"}

[CallIdConfig](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-call-id/io.ktor.client.plugins.callid/-call-id-config/index.html)クラスによって提供される%plugin_name%プラグイン設定を使用すると、コールIDを生成し、それをコールコンテキストに追加できます。

### コールIDを生成する

特定のリクエストに対するコールIDは、次のいずれかの方法で生成できます。

*   デフォルトで有効な`useCoroutineContext`プロパティは、現在の`CoroutineContext`を使用してコールIDを取得するジェネレーターを追加します。この機能を無効にするには、`useCoroutineContext`を`false`に設定します。

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="34-35,37"}

> Ktorサーバーでは、[CallIdプラグイン](server-call-id.md)を使用して、`CoroutineContext`にコールIDを追加できます。

*   `generate()`関数は、送信リクエストのコールIDを生成することを可能にします。コールIDの生成に失敗した場合、`null`を返します。

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="34,36-37"}

コールIDを生成するために複数の方法を使用できます。この方法では、最初のnullでない値が適用されます。

### コールIDを追加する

コールIDを取得した後、リクエストにそれを追加するために以下のオプションが利用できます。

*   `intercept()`関数は、`CallIdInterceptor`を使用して、リクエストにコールIDを追加することを可能にします。

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/CallIdService.kt" include-lines="23-27"}

*   `addToHeader()`関数は、指定されたヘッダーにコールIDを追加します。これはパラメーターとしてヘッダーを取り、デフォルトで`HttpHeaders.XRequestId`になります。

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="18,20-21"}

## 例

以下の例では、Ktorクライアント用の%plugin_name%プラグインが、新しいコールIDを生成してヘッダーに追加するように設定されています。

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="17-22"}

このプラグインは、コルーチンコンテキストを使用してコールIDを取得し、`generate()`関数を利用して新しいものを生成します。そして、最初のnullでないコールIDが、`addToHeader()`関数を使用してリクエストヘッダーに適用されます。

Ktorサーバーでは、[サーバー用CallIdプラグイン](server-call-id.md)の[retrieve](server-call-id.md#retrieve)関数を使用して、コールIDをヘッダーから取得できます。

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/CallIdService.kt" include-lines="29-30,33"}

このようにして、Ktorサーバーはリクエストの指定されたヘッダーのIDを取得し、それをコールの`callId`プロパティに適用します。

完全な例については、[client-call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-call-id)を参照してください。