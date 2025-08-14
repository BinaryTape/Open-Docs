[//]: # (title: ルーティング)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<link-summary>
ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのコアプラグインです。
</link-summary>

ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのKtorのコア[プラグイン](server-plugins.md)です。クライアントが特定のURL（例：`/hello`）にリクエストを送信すると、ルーティングメカニズムによって、このリクエストをどのように処理するかを定義できます。

## ルーティングをインストールする {id="install_plugin"}

ルーティングプラグインは、次の方法でインストールできます。

```Kotlin
import io.ktor.server.routing.*

install(RoutingRoot) {
    // ...
}
```

ルーティングプラグインはどのアプリケーションでも非常に一般的であるため、ルーティングのインストールを簡素化する便利な `routing` 関数があります。以下のコードスニペットでは、`install(RoutingRoot)` が `routing` 関数に置き換えられています。

```kotlin
import io.ktor.server.routing.*

routing {
    // ...
}
```

## ルートハンドラを定義する {id="define_route"}

ルーティングプラグインを[インストール](#install_plugin)した後、`routing` 内で [route](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.routing/route.html) 関数を呼び出してルートを定義できます。
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

Ktorは、ルートハンドラの定義をはるかに簡単かつ簡潔にする一連の関数も提供しています。たとえば、前述のコードを、URLとリクエストを処理するコードのみを受け取る必要がある [get](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.routing/get.html) 関数に置き換えることができます。

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

*   **HTTP動詞**

    `GET`、`POST`、`PUT` など、HTTP動詞を選択します。最も便利な方法は、`get`、`post`、`put` などの専用の動詞関数を使用することです。

*   **パスパターン**

    `/hello`、`/customer/{id}` のように、[URLパスを照合](#match_url)するために使用されるパスパターンを指定します。パスパターンを `get`/`post` などの関数に直接渡すか、`route` 関数を使用して[ルートハンドラをグループ化](#multiple_routes)し、[ネストされたルート](#nested_routes)を定義できます。

*   **ハンドラ**

    [リクエスト](server-requests.md)と[レスポンス](server-responses.md)を処理する方法を指定します。ハンドラ内では、`ApplicationCall` にアクセスし、クライアントリクエストを処理し、レスポンスを送信できます。

## パスパターンを指定する {id="match_url"}

[ルーティング](#define_route)関数（`route`、`get`、`post`など）に渡されるパスパターンは、URLの_パス_コンポーネントを照合するために使用されます。パスは、スラッシュ `/` 文字で区切られた一連のパスセグメントを含むことができます。

> Ktorは末尾のスラッシュがあるパスとないパスを区別することに注意してください。この動作は、`IgnoreTrailingSlash` プラグインを[インストール](server-plugins.md#install)することで変更できます。

以下にいくつかのパスの例を示します。
*   `/hello`
    パスセグメントが1つ含まれるパス。
*   `/order/shipment`
    複数のパスセグメントを含むパス。このようなパスを[route/get/etc.](#define_route)関数にそのまま渡すことも、複数の `route` 関数を[ネスト](#multiple_routes)することでサブルートを整理することもできます。
*   `/user/{login}`
    `login` [パスパラメータ](#path_parameter)を含むパス。その値はルートハンドラ内でアクセスできます。
*   `/user/*`
    任意のパスセグメントに一致する[ワイルドカード文字](#wildcard)を含むパス。
*   `/user/{...}`
    URLパスの残りのすべてに一致する[テールカード](#tailcard)を含むパス。
*   `/user/{param...}`
    [テールカード付きパスパラメータ](#path_parameter_tailcard)を含むパス。
*   `Regex("/.+/hello")`
    `/hello`の最後の出現までを含むパスセグメントに一致する[正規表現](#regular_expression)を含むパス。

### ワイルドカード {id="wildcard"}
_ワイルドカード_ (`*`) は任意のパスセグメントに一致し、省略することはできません。たとえば、`/user/*` は `/user/john` に一致しますが、`/user` には一致しません。

### テールカード {id="tailcard"}
_テールカード_ (`{...}`) はURLパスの残りのすべてに一致し、複数のパスセグメントを含むことができ、空にすることもできます。たとえば、`/user/{...}` は `/user/john/settings` と `/user` の両方に一致します。

### パスパラメータ {id="path_parameter"}
_パスパラメータ_ (`{param}`) はパスセグメントに一致し、`param` という名前のパラメータとしてキャプチャします。このパスセグメントは必須ですが、疑問符を追加することでオプションにできます: `{param?}`。例:
*   `/user/{login}` は `/user/john` に一致しますが、`/user` には一致しません。
*   `/user/{login?}` は `/user/john` と `/user` の両方に一致します。
   > オプションのパスパラメータ `{param?}` はパスの末尾でのみ使用できることに注意してください。
   >
   {type="note"}

ルートハンドラ内でパラメータ値にアクセスするには、`call.parameters` プロパティを使用します。たとえば、以下のコードスニペットの `call.parameters["login"]` は、`/user/admin` パスに対して `admin` を返します: [object Promise]

> リクエストにクエリ文字列が含まれている場合、`call.parameters` にはそのクエリ文字列のパラメータも含まれます。ハンドラ内でクエリ文字列とそのパラメータにアクセスする方法については、[](server-requests.md#query_parameters)を参照してください。

### テールカード付きパスパラメータ {id="path_parameter_tailcard"}

テールカード付きパスパラメータ (`{param...}`) は、URLパスの残りのすべてに一致し、各パスセグメントの複数の値を `param` をキーとしてパラメータに入れます。たとえば、`/user/{param...}` は `/user/john/settings` に一致します。
ルートハンドラ内でパスセグメントの値にアクセスするには、`call.parameters.getAll("param")` を使用します。上記の例では、`getAll` 関数は `john` と `settings` の値を含む配列を返します。

### 正規表現 {id="regular_expression"}

正規表現は、すべてのルートハンドラ定義関数（`route`、`get`、`post`など）で使用できます。

> 正規表現の詳細については、[Kotlinドキュメント](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/)を参照してください。

`/hello` で終わる任意のパスに一致するルートを記述してみましょう。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex(".+/hello")) {
        call.respondText("Hello")
    }
}
```
このルート定義により、`/foo/hello`、`/bar/baz/hello` など、`/hello` で終わるパスへの受信リクエストはすべて一致します。

#### ハンドラでパスの部分にアクセスする

正規表現において、名前付きグループは、パターンに一致する文字列の特定の部分をキャプチャし、それに名前を割り当てる方法です。
構文 `(?<name>pattern)` は、名前付きグループを定義するために使用されます。ここで `name` はグループの名前であり、`pattern` はグループに一致する正規表現パターンです。

ルート関数で名前付きグループを定義することにより、パスの一部をキャプチャでき、ハンドラ関数で `call.parameters` オブジェクトを使用してキャプチャされたパラメータにアクセスできます。

たとえば、整数識別子とそれに続く `/hello` を含むパスへのリクエストに一致するルートを定義できます。

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
以下のコードでは、`(?<id>\d+)` という名前付きグループが、要求されたパスから整数識別子 `id` をキャプチャするために使用され、`call.parameters` プロパティが、ハンドラ関数でキャプチャされた `id` パラメータにアクセスするために使用されます。

名前なしグループは正規表現ルートハンドラ内からアクセスできませんが、パスを一致させるために使用できます。たとえば、パス `hello/world` は一致しますが、`hello/World` は一致しません。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex("hello/([a-z]+)")) {
        call.respondText("Hello")
    }
}
```
また、パスセグメント全体が正規表現によって消費される必要があります。たとえば、パスパターン `get(Regex("[a-z]+"))` はパス `"hello1"` には一致しませんが、パス `hello/1` の `hello` 部分には一致し、`/1` を次のルートに残します。

## 複数のルートハンドラを定義する {id="multiple_routes"}

### 動詞関数でルートをグループ化する {id="group_by_verb"}

もちろん、どのアプリケーションでもそうであるように、複数のルートハンドラを定義したい場合は、それらを `routing` 関数に追加するだけです。

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

### パスでルートをグループ化する {id="group_by_path"}

別の方法として、パスごとにグループ化する方法があります。この方法では、パスを定義し、そのパスに対する動詞を `route` 関数を使用してネストされた関数として配置します。

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

グループ化の方法に関わらず、Ktorは `route` 関数のパラメータとしてサブルートを持つことも可能です。これは、他のリソースの論理的な子であるリソースを定義するのに役立ちます。
次の例は、`/order/shipment` への `GET` および `POST` リクエストに応答する方法を示しています。

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

[ルーティング](#define_route)関数（`route`、`get`、`post`など）に渡されるパスパターンは、URLの_パス_コンポーネントを照合するために使用されます。パスは、スラッシュ `/` 文字で区切られた一連のパスセグメントを含むことができます。

## ルート拡張関数 {id="route_extension_function"}

一般的なパターンとして、`Route` 型の拡張関数を使用して実際のルートを定義する方法があります。これにより、動詞に簡単にアクセスでき、すべてのルートを単一のルーティング関数にまとめる煩雑さをなくすことができます。このパターンは、ルートのグループ化をどのように決定するかに関わらず適用できます。そのため、最初の例はよりクリーンな方法で表現できます。

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

このアプローチを示す完全な例については、[legacy-interactive-website](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/legacy-interactive-website)を参照してください。

> アプリケーションが保守性の点でスケールするためには、特定の[構造化パターン](server-application-structure.md)に従うことが推奨されます。

## ルートをトレースする {id="trace_routes"}

[ロギング](server-logging.md)が設定されている場合、Ktorはルートトレースを有効にし、一部のルートが実行されない理由を特定するのに役立ちます。
たとえば、アプリケーションを[実行](server-run.md)し、指定されたエンドポイントにリクエストを行うと、アプリケーションの出力は次のようになります。

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

> [ネイティブサーバー](server-native.md)でルートトレースを有効にするには、アプリケーションを[実行](server-run.md)する際に `KTOR_LOG_LEVEL` 環境変数に `_TRACE_` 値を渡します。

```