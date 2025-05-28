[//]: # (title: デフォルトリクエスト)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-default-request"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
DefaultRequestプラグインを使用すると、すべてのリクエストのデフォルトパラメーターを設定できます。
</link-summary>

[DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html)プラグインを使用すると、すべての[リクエスト](client-requests.md)に対してデフォルトパラメーターを設定できます。具体的には、ベースURLの指定、ヘッダーの追加、クエリパラメーターの設定などです。

## 依存関係の追加 {id="add_dependencies"}

`DefaultRequest`は[ktor-client-core](client-dependencies.md)アーティファクトのみを必要とし、特定の依存関係は不要です。

## DefaultRequestのインストール {id="install_plugin"}

`DefaultRequest`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します...
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(DefaultRequest)
}
```

...または`defaultRequest`関数を呼び出して、必要なリクエストパラメーターを[設定](#configure)します。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    defaultRequest {
        // this: DefaultRequestBuilder
    }
}
```

## DefaultRequestの設定 {id="configure"}

### ベースURL {id="url"}

`DefaultRequest`を使用すると、[リクエストURL](client-requests.md#url)とマージされるURLのベース部分を設定できます。
例えば、以下の`url`関数はすべてのリクエストのベースURLを指定します。

```kotlin
defaultRequest {
    url("https://ktor.io/docs/")
}
```

上記の構成を持つクライアントを使用して以下のリクエストを行うと...

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="25"}

...結果のURLは以下のようになります: `https://ktor.io/docs/welcome.html`。
ベースURLとリクエストURLがどのようにマージされるかについては、[DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html)を参照してください。

### URLパラメーター {id="url-params"}

`url`関数は、URLのコンポーネントを個別に指定することもできます。例えば、

- HTTPスキーム
- ホスト名
- ベースURLパス
- クエリパラメーター

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="15-20"}

### ヘッダー {id="headers"}

各リクエストに特定のヘッダーを追加するには、`header`関数を使用します。

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="14,21-22"}

ヘッダーの重複を避けるために、`appendIfNameAbsent`、`appendIfNameAndValueAbsent`、`contains`関数を使用できます。

```kotlin
defaultRequest {
    headers.appendIfNameAbsent("X-Custom-Header", "Hello")
}
```

## 例 {id="example"}

以下の例では、以下の`DefaultRequest`構成を使用しています。
* `url`関数は、HTTPスキーム、ホスト、ベースURLパス、およびクエリパラメーターを定義します。
* `header`関数は、すべてのリクエストにカスタムヘッダーを追加します。

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="13-23"}

このクライアントで行われる以下のリクエストは、後のパスセグメントのみを指定し、`DefaultRequest`に設定されたパラメーターを自動的に適用します。

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="25-26"}

完全な例は以下で確認できます: [client-default-request](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-default-request)。