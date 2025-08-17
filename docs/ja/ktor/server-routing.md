[//]: # (title: ルーティング)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<link-summary>
ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのコアプラグインです。
</link-summary>

ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのKtorのコア[プラグイン](server-plugins.md)です。クライアントが特定のURL（例: `/hello`）にリクエストを送信すると、ルーティングメカニズムによって、このリクエストをどのように処理するかを定義できます。

## ルーティングのインストール {id="install_plugin"}

「ルーティング」プラグインは、次の方法でインストールできます。

```Kotlin
import io.ktor.server.routing.*

install(RoutingRoot) {
    // ...
}
```

「ルーティング」プラグインはあらゆるアプリケーションで非常に一般的であるため、ルーティングのインストールを簡素化する便利な `routing` 関数があります。以下のコードスニペットでは、`install(RoutingRoot)` が `routing` 関数に置き換えられています。

```kotlin
import io.ktor.server.routing.*

routing {
    // ...
}
```

## ルートハンドラーの定義 {id="define_route"}

「ルーティング」プラグインを[インストール](#install_plugin)した後、`routing` 内で[route](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.routing/route.html) 関数を呼び出してルートを定義できます。
```kotlin
import io.ktor.server.routing.*
import io.ktor.http.*
import io.ktor.server.response.*

routing {
    route("/hello", HttpMethod.Get) {
        handle {
            call.respondText("Hello")
        }
    }
}
```

Ktorはまた、ルートハンドラーの定義をはるかに簡単かつ簡潔にする一連の関数も提供しています。例えば、前のコードは、URLとリクエストを処理するコードのみを必要とする[get](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.routing/get.html) 関数に置き換えることができます。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get("/hello") {
        call.respondText("Hello")
    }
}
```
同様に、Ktorは他のすべての動詞、つまり `put`、`post`、`head` などについても関数を提供しています。

要約すると、ルートを定義するには以下の設定を指定する必要があります。

*   **HTTP動詞**

    `GET`、`POST`、`PUT`などのHTTP動詞を選択します。最も便利な方法は、`get`、`post`、`put`などの専用動詞関数を使用することです。

*   **パスパターン**

    `/hello`、`/customer/{id}`などのURLパスを[照合](#match_url)するために使用されるパスパターンを指定します。パスパターンを `get`/`post`/などの関数に直接渡すことも、`route` 関数を使用して[ルートハンドラー](#multiple_routes)をグループ化し、[ネストされたルート](#nested_routes)を定義することもできます。

*   **ハンドラー**

    [リクエスト](server-requests.md)と[レスポンス](server-responses.md)を処理する方法を指定します。ハンドラー内では、`ApplicationCall` にアクセスし、クライアントリクエストを処理し、レスポンスを送信できます。

## パスパターンの指定 {id="match_url"}

[ルーティング](#define_route)関数（`route`、`get`、`post`など）に渡されるパスパターンは、URLの_パス_コンポーネントを照合するために使用されます。パスはスラッシュ `/` 文字で区切られた一連のパスセグメントを含むことができます。

> Ktorは末尾のスラッシュの有無でパスを区別することに注意してください。この動作は、`IgnoreTrailingSlash` プラグインを[インストール](server-plugins.md#install)することで変更できます。

以下にいくつかのパスの例を示します。
*   `/hello`
    単一のパスセグメントを含むパス。
*   `/order/shipment`
    複数のパスセグメントを含むパス。このようなパスは、そのまま[route/get/etc.](#define_route)関数に渡すことも、複数の `route` 関数を[ネスト](#multiple_routes)してサブルートを整理することもできます。
*   `/user/{login}`
    `login` [パスパラメータ](#path_parameter)を持つパスで、その値はルートハンドラー内でアクセスできます。
*   `/user/*`
    任意のパスセグメントにマッチする[ワイルドカード文字](#wildcard)を持つパス。
*   `/user/{...}`
    URLパスの残りのすべてにマッチする[テールカード](#tailcard)を持つパス。
*   `/user/{param...}`
    [テールカード付きパスパラメータ](#path_parameter_tailcard)を含むパス。
*   `Regex("/.+/hello")`
    `/hello` の最後の出現箇所を含むパスセグメントまでを照合する[正規表現](#regular_expression)を含むパス。

### ワイルドカード {id="wildcard"}
_ワイルドカード_ (`*`) は任意のパスセグメントにマッチし、省略することはできません。例えば、`/user/*` は `/user/john` にマッチしますが、`/user` にはマッチしません。

### テールカード {id="tailcard"}
_テールカード_ (`{...}`) はURLパスの残りのすべてにマッチし、複数のパスセグメントを含めることができ、空にすることもできます。例えば、`/user/{...}` は `/user/john/settings` および `/user` にマッチします。

### パスパラメータ {id="path_parameter"}
_パスパラメータ_ (`{param}`) はパスセグメントにマッチし、`param` という名前のパラメータとしてキャプチャします。このパスセグメントは必須ですが、疑問符を追加することでオプションにできます: `{param?}`。例えば、
*   `/user/{login}` は `/user/john` にマッチしますが、`/user` にはマッチしません。
*   `/user/{login?}` は `/user/john` および `/user` にマッチします。
   > オプションのパスパラメータ `{param?}` は、パスの末尾でのみ使用できることに注意してください。
   >
   {type="note"}

ルートハンドラー内でパラメータ値にアクセスするには、`call.parameters` プロパティを使用します。例えば、以下のコードスニペットの `call.parameters["login"]` は、`/user/admin` パスに対して _admin_ を返します。
```kotlin
get("/user/{login}") {
    if (call.parameters["login"] == "admin") {
        // ...
    }
}
```

> リクエストにクエリ文字列が含まれている場合、`call.parameters` にはそのクエリ文字列のパラメータも含まれます。ハンドラー内でクエリ文字列とそのパラメータにアクセスする方法については、[クエリパラメータ](server-requests.md#query_parameters)を参照してください。

### テールカード付きパスパラメータ {id="path_parameter_tailcard"}

テールカード付きパスパラメータ (`{param...}`) はURLパスの残りのすべてにマッチし、各パスセグメントの複数の値を `param` をキーとしてパラメータに格納します。例えば、`/user/{param...}` は `/user/john/settings` にマッチします。
ルートハンドラー内でパスセグメントの値にアクセスするには、`call.parameters.getAll("param")` を使用します。上記の例では、`getAll` 関数は _john_ と _settings_ の値を含む配列を返します。

### 正規表現 {id="regular_expression"}

正規表現は、`route`、`get`、`post` など、すべてのルートハンドラー定義関数で使用できます。

> 正規表現の詳細については、[Kotlinドキュメント](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/)を参照してください。

`/hello` で終わる任意のパスにマッチするルートを記述してみましょう。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex(".+/hello")) {
        call.respondText("Hello")
    }
}
```
このルート定義により、`/foo/hello`、`/bar/baz/hello` など、`/hello` で終わるパスへの受信リクエストはすべてマッチします。

#### ハンドラーでのパスの要素へのアクセス

正規表現において、名前付きグループは、パターンにマッチする文字列の特定の部分をキャプチャし、それに名前を割り当てる方法です。
`(?<name>pattern)` という構文は名前付きグループを定義するために使用され、`name` はグループの名前、
`pattern` はグループにマッチする正規表現パターンです。

ルート関数で名前付きグループを定義することで、パスの一部をキャプチャでき、その後ハンドラー関数で、
`call.parameters` オブジェクトを使用してキャプチャされたパラメータにアクセスできます。

例えば、整数識別子が続き、その後 `/hello` が続くパスへのリクエストにマッチするルートを定義できます。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex("""(?<id>\d+)/hello""")) {
        val id = call.parameters["id"]!!
        call.respondText(id)
    }
}
```
以下のコードでは、`(?<id>\d+)` 名前付きグループがリクエストされたパスから整数識別子 `id` をキャプチャするために使用され、
`call.parameters` プロパティがハンドラー関数でキャプチャされた `id` パラメータにアクセスするために使用されています。

無名グループは正規表現ルートハンドラー内ではアクセスできませんが、パスをマッチさせるために使用できます。例えば、`hello/world` というパスはマッチしますが、`hello/World` はマッチしません。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex("hello/([a-z]+)")) {
        call.respondText("Hello")
    }
}
```
また、パスセグメント全体が正規表現によって消費される必要があります。例えば、パスパターン `get(Regex("[a-z]+"))` はパス `"hello1"` にはマッチせず、パス `hello/1` の `hello` 部分にマッチし、`/1` を次のルートに残します。

## 複数のルートハンドラーの定義 {id="multiple_routes"}

### 動詞関数によるルートのグループ化 {id="group_by_verb"}

複数のルートハンドラーを定義したい場合（これはもちろんあらゆるアプリケーションに当てはまります）、それらを `routing` 関数に追加するだけで済みます。

```kotlin
routing {
    get("/customer/{id}") {

    }
    post("/customer") {

    }
    get("/order") {

    }
    get("/order/{id}") {

    }
}
```

この場合、各ルートは独自の関数を持ち、特定のエンドポイントとHTTP動詞に応答します。

### パスによるルートのグループ化 {id="group_by_path"}

別の方法として、パスでグループ化する方法があります。これは、パスを定義し、そのパスの動詞をネストされた関数として `route` 関数を使用して配置します。

```kotlin
routing {
    route("/customer") {
        get {

        }
        post {

        }
    }
    route("/order") {
        get {

        }
        get("/{id}") {

        }
    }
}
```

### ネストされたルート {id="nested_routes"}

グループ化の方法に関わらず、Ktorは `route` 関数のパラメータとしてサブルートを持つことも許可しています。これは、論理的に他のリソースの子であるリソースを定義するのに役立ちます。以下の例は、`/order/shipment` への `GET` および `POST` リクエストに応答する方法を示しています。

```kotlin
routing {
    route("/order") {
        route("/shipment") {
            get {

            }
            post {

            }
        }
    }
}
```

このように、各 `route` 呼び出しは個別のパスセグメントを生成します。

[ルーティング](#define_route)関数（`route`、`get`、`post`など）に渡されるパスパターンは、URLの_パス_コンポーネントを照合するために使用されます。パスはスラッシュ `/` 文字で区切られた一連のパスセグメントを含むことができます。

## ルート拡張関数 {id="route_extension_function"}

一般的なパターンとして、`Route` 型の拡張関数を使用して実際のルートを定義する方法があります。これにより、動詞への簡単なアクセスが可能になり、すべてのルートを単一のルーティング関数にまとめることによる煩雑さを解消できます。このパターンは、ルートのグループ化方法に関わらず適用できます。そのため、最初の例はよりクリーンな方法で表現できます。

```kotlin
routing {
    listOrdersRoute()
    getOrderRoute()
    totalizeOrderRoute()
}

fun Route.listOrdersRoute() {
    get("/order") {

    }
}

fun Route.getOrderRoute() {
    get("/order/{id}") {

    }
}

fun Route.totalizeOrderRoute() {
    get("/order/{id}/total") {

    }
}
```

このアプローチをデモンストレーションする完全な例については、[legacy-interactive-website](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/legacy-interactive-website) を参照してください。

> アプリケーションの保守性を考慮してスケールさせるには、特定の[構造パターン](server-application-structure.md)に従うことが推奨されます。

## ルートのトレース {id="trace_routes"}

[ロギング](server-logging.md)が構成されている場合、Ktorはルートトレースを有効にし、一部のルートが実行されない理由を特定するのに役立ちます。例えば、アプリケーションを[実行](server-run.md)し、指定されたエンドポイントにリクエストを行うと、アプリケーションの出力は次のようになる場合があります。

```Console
TRACE Application - Trace for [missing-page]
/, segment:0 -> SUCCESS @ /
  /, segment:0 -> SUCCESS @ /
    /(method:GET), segment:0 -> FAILURE "Not all segments matched" @ /(method:GET)
Matched routes:
  No results
Route resolve result:
  FAILURE "No matched subtrees found" @ /
```

> [Nativeサーバー](server-native.md)でルートトレースを有効にするには、アプリケーションを[実行](server-run.md)する際に `KTOR_LOG_LEVEL` 環境変数に _TRACE_ 値を渡します。