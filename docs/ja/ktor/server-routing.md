[//]: # (title: ルーティング)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<link-summary>
ルーティングは、サーバーアプリケーションにおいて着信リクエストを処理するためのコアとなるプラグインです。
</link-summary>

ルーティングは、サーバーアプリケーションにおける着信リクエストを処理するための、コアとなるKtor[プラグイン](server-plugins.md)です。クライアントが特定のURL（例えば `/hello`）に対してリクエストを送信した際、ルーティングメカニズムを使用して、そのリクエストをどのように処理するかを定義できます。

## ルーティングのインストール {id="install_plugin"}

Routingプラグインは、以下の方法でインストールできます。

```Kotlin
import io.ktor.server.routing.*

install(RoutingRoot) {
    // ...
}
```

Routingプラグインは、あらゆるアプリケーションにおいて非常に一般的であるため、ルーティングのインストールをより簡単にする便利な `routing` 関数が用意されています。以下のコードスニペットでは、`install(RoutingRoot)` が `routing` 関数に置き換えられています。

```kotlin
import io.ktor.server.routing.*

routing {
    // ...
}
```

## ルートハンドラーの定義 {id="define_route"}

Routingプラグインを[インストール](#install_plugin)した後、`routing` 内で [route](https://api.ktor.io/ktor-server-core/io.ktor.server.routing/route.html) 関数を呼び出してルートを定義できます。
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

Ktorは、ルートハンドラーの定義をより簡単かつ簡潔にする一連の関数も提供しています。例えば、上記のコードを [get](https://api.ktor.io/ktor-server-core/io.ktor.server.routing/get.html) 関数に置き換えることができます。この関数は、URLとリクエストを処理するコードを指定するだけで済みます。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get("/hello") {
        call.respondText("Hello")
    }
}
```
同様に、Ktorは `put`、`post`、`head` など、他のすべての動詞に対応する関数を提供しています。

まとめると、ルートを定義するには以下の設定を指定する必要があります。

* **HTTP動詞**

  `GET`、`POST`、`PUT` などのHTTP動詞を選択します。最も便利な方法は、`get`、`post`、`put` などの専用の動詞関数を使用することです。

* **パスパターン**

  [URLパスとのマッチング](#match_url)に使用されるパスパターンを指定します（例： `/hello`、`/customer/{id}`）。パスパターンは `get`/`post` などの関数に直接渡すことができます。また、`route` 関数を使用して[ルートハンドラー](#multiple_routes)をグループ化したり、[ネストされたルート](#nested_routes)を定義したりすることもできます。
  
* **ハンドラー**

  [リクエスト](server-requests.md)と[レスポンス](server-responses.md)をどのように処理するかを指定します。ハンドラー内では、`ApplicationCall` にアクセスして、クライアントのリクエストを処理したりレスポンスを送信したりできます。

## パスパターンの指定 {id="match_url"}

[ルーティング](#define_route)関数（`route`、`get`、`post` など）に渡されるパスパターンは、URLの「パス」コンポーネントとのマッチングに使用されます。パスには、スラッシュ `/` 文字で区切られた一連のパスセグメントを含めることができます。

> Ktorは、末尾にスラッシュがあるパスとないパスを区別することに注意してください。この動作は、`IgnoreTrailingSlash` プラグインを[インストール](server-plugins.md#install)することで変更できます。

以下は、いくつかのパスの例です。
* `/hello`  
  単一のパスセグメントを含むパス。
* `/order/shipment`  
  複数のパスセグメントを含むパス。このようなパスは、[route/getなど](#define_route)の関数にそのまま渡すことも、複数の `route` 関数を[ネスト](#multiple_routes)してサブルートを構成することもできます。
* `/user/{login}`  
  `login` [パスパラメータ](#path_parameter)を含むパス。その値はルートハンドラー内でアクセスできます。
* `/user/*`  
  任意のパスセグメントにマッチする[ワイルドカード文字](#wildcard)を含むパス。
* `/user/{...}`  
  URLパスの残りの部分すべてにマッチする[テールカード (tailcard)](#tailcard)を含むパス。
* `/user/{param...}`  
  [テールカード付きパスパラメータ](#path_parameter_tailcard)を含むパス。
* `Regex("/.+/hello")`  
  最後に現れる `/hello` までのパスセグメントにマッチする[正規表現](#regular_expression)を含むパス。

### ワイルドカード {id="wildcard"}
「ワイルドカード」 (`*`) は、任意の1つのパスセグメントにマッチし、省略することはできません。例えば、`/user/*` は `/user/john` にはマッチしますが、`/user` にはマッチしません。

### テールカード {id="tailcard"}
「テールカード」 (`{...}`) は、URLパスの残りの部分すべてにマッチします。複数のパスセグメントを含むことができ、空でも構いません。例えば、`/user/{...}` は `/user/john/settings` と `/user` の両方にマッチします。

### パスパラメータ {id="path_parameter"}
「パスパラメータ」 (`{param}`) は1つのパスセグメントにマッチし、それを `param` という名前のパラメータとしてキャプチャします。このパスセグメントは必須ですが、疑問符を追加して `{param?}` とすることでオプションにできます。例えば：
* `/user/{login}` は `/user/john` にはマッチしますが、`/user` にはマッチしません。
* `/user/{login?}` は `/user/john` と `/user` の両方にマッチします。
   > オプションのパスパラメータ `{param?}` は、パスの最後にのみ使用できます。
   >
   {type="note"}

ルートハンドラー内でパラメータ値にアクセスするには、`call.parameters` プロパティを使用します。例えば、以下のコードスニペットの `call.parameters["login"]` は、パス `/user/admin` に対して _admin_ を返します。
```kotlin
get("/user/{login}") {
    if (call.parameters["login"] == "admin") {
        // ...
    }
}
```

> リクエストにクエリ文字列が含まれている場合、`call.parameters` にはそのクエリ文字列のパラメータも含まれます。ハンドラー内でクエリ文字列とそのパラメータにアクセスする方法については、[クエリパラメータ](server-requests.md#query_parameters)を参照してください。

### テールカード付きパスパラメータ {id="path_parameter_tailcard"}

テールカード付きパスパラメータ (`{param...}`) は、URLパスの残りの部分すべてにマッチし、各パスセグメントの複数の値を `param` をキーとしてパラメータに格納します。例えば、`/user/{param...}` は `/user/john/settings` にマッチします。
ルートハンドラー内でパスセグメントの値にアクセスするには、`call.parameters.getAll("param")` を使用します。上記の例では、`getAll` 関数は _john_ と _settings_ の値を含む配列を返します。

### 正規表現 {id="regular_expression"}

正規表現は、`route`、`get`、`post` など、すべてのルートハンドラー定義関数で使用できます。

> 正規表現の詳細については、[Kotlinドキュメント](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/)を参照してください。

`/hello` で終わる任意のパスにマッチするルートを書いてみましょう。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex(".+/hello")) {
        call.respondText("Hello")
    }
}
```
このルート定義により、`/foo/hello` や `/bar/baz/hello` など、パスが `/hello` で終わるすべての着信リクエストがマッチします。

#### ハンドラー内でのパス部分へのアクセス

正規表現において、名前付きグループ (named groups) は、パターンに一致する文字列の特定の部分をキャプチャし、それに名前を割り当てる方法です。
`(?<name>pattern)` という構文が名前付きグループの定義に使用され、ここで `name` はグループの名前、`pattern` はグループに一致する正規表現パターンです。

ルート関数で名前付きグループを定義することで、パスの一部をキャプチャし、ハンドラー関数内で `call.parameters` オブジェクトを使用してそのキャプチャされたパラメータにアクセスできます。

例えば、整数の識別子の後に `/hello` が続くパスへのリクエストにマッチするルートを定義できます。

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
上記のコードでは、`(?<id>\d+)` 名前付きグループを使用してリクエストされたパスから整数の識別子 `id` をキャプチャし、ハンドラー関数で `call.parameters` プロパティを使用してキャプチャされた `id` パラメータにアクセスしています。

名前なしグループは、正規表現ルートハンドラー内ではアクセスできませんが、パスのマッチングには使用できます。例えば、パス `hello/world` はマッチしますが、`hello/World` はマッチしません。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex("hello/([a-z]+)")) {
        call.respondText("Hello")
    }
}
```
また、パスセグメント全体が正規表現によって消費される必要があります。例えば、パスパターン `get(Regex("[a-z]+"))` は、パス `"hello1"` にはマッチしませんが、パス `hello/1` の `hello` 部分にはマッチし、`/1` を次のルートのために残します。

## 複数のルートハンドラーの定義 {id="multiple_routes"}

### 動詞関数ごとにルートをグループ化する {id="group_by_verb"}

複数のルートハンドラーを定義する場合（当然、どのようなアプリケーションでもそうなります）、単にそれらを `routing` 関数に追加できます。

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

### パスごとにルートをグループ化する {id="group_by_path"}

別の方法として、これらをパスごとにグループ化することもできます。`route` 関数を使用してパスを定義し、その中にネストされた関数としてそのパスの動詞を配置します。

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

グループ化の方法にかかわらず、Ktorでは `route` 関数のパラメータとしてサブルートを持たせることも可能です。
これは、論理的に他のリソースの子であるリソースを定義するのに便利です。
以下の例は、`/order/shipment` への `GET` および `POST` リクエストに応答する方法を示しています。

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

このように、各 `route` 呼び出しが個別のパスセグメントを生成します。

[ルーティング](#define_route)関数（`route`、`get`、`post` など）に渡されるパスパターンは、URLの「パス」コンポーネントとのマッチングに使用されます。パスには、スラッシュ `/` 文字で区切られた一連のパスセグメントを含めることができます。

## ルート拡張関数 {id="route_extension_function"}

一般的なパターンは、`Route` 型に拡張関数を使用して実際のルートを定義することです。これにより、各動詞へのアクセスが容易になり、すべてのルートを単一のルーティング関数に記述することによる煩雑さを回避できます。このパターンは、ルートをどのようにグループ化するかに関わらず適用できます。そのため、最初の例はよりクリーンな方法で表現できます。

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

このアプローチを示す完全な例については、[legacy-interactive-website](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/legacy-interactive-website) を参照してください。

> アプリケーションの保守性を高めるためには、特定の[構造化パターン](server-routing-organization.md)に従うことが推奨されます。

## ルートのトレース {id="trace_routes"}

[ロギング](server-logging.md)を設定すると、Ktorはルートのトレースを有効にします。これにより、なぜ一部のルートが実行されていないのかを特定するのに役立ちます。
例えば、アプリケーションを[実行](server-run.md)し、指定されたエンドポイントにリクエストを送信すると、アプリケーションの出力は以下のようになります。

```Console
TRACE Application - Trace for [missing-page]
/, segment:0 -> SUCCESS @ /
  /, segment:0 -> SUCCESS @ /
    / [(method:GET)], segment:0 -> FAILURE "Not all segments matched" @ / [(method:GET)]
Matched routes:
  No results
Route resolve result:
  FAILURE "No matched subtrees found" @ /
```

> [Nativeサーバー](server-native.md)でルートトレースを有効にするには、アプリケーションの[実行](server-run.md)時に `KTOR_LOG_LEVEL` 環境変数に _TRACE_ 値を渡してください。