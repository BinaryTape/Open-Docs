[//]: # (title: ルーティング)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<link-summary>
ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのコアプラグインです。
</link-summary>

ルーティングは、サーバーアプリケーションで受信リクエストを処理するためのKtorのコア[プラグイン](server-plugins.md)です。クライアントが特定のURL（例: `/hello`）にリクエストを送信すると、ルーティングメカニズムによって、このリクエストをどのように処理するかを定義できます。

## ルーティングのインストール {id="install_plugin"}

ルーティングプラグインは、次の方法でインストールできます。

```Kotlin
import io.ktor.server.routing.*

install(RoutingRoot) {
    // ...
}
```

ルーティングプラグインはどのアプリケーションでも非常に一般的であるため、ルーティングのインストールを簡素化する便利な`routing`関数があります。以下のコードスニペットでは、`install(RoutingRoot)`が`routing`関数に置き換えられています。

```kotlin
import io.ktor.server.routing.*

routing {
    // ...
}
```

## ルートハンドラの定義 {id="define_route"}

ルーティングプラグインの[インストール](#install_plugin)後、`routing`内で`[route](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.routing/route.html)`関数を呼び出してルートを定義できます。
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

Ktorは、ルートハンドラの定義をはるかに簡単かつ簡潔にする一連の関数も提供しています。例えば、以前のコードを、URLとリクエストを処理するコードのみを必要とする`[get](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.routing/get.html)`関数に置き換えることができます。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get("/hello") {
        call.respondText("Hello")
    }
}
```
同様に、Ktorは`put`、`post`、`head`など、他のすべてのHTTP動詞に対する関数を提供しています。

要約すると、ルートを定義するには次の設定を指定する必要があります。

*   **HTTP動詞 (verb)**

    `GET`、`POST`、`PUT`などのHTTP動詞を選択します。最も便利な方法は、`get`、`post`、`put`などの専用の動詞関数を使用することです。

*   **パスパターン**

    [URLパスに一致させる](#match_url)ために使用されるパスパターン、例えば`/hello`や`/customer/{id}`を指定します。パスパターンを`get`/`post`/などの関数に直接渡すこともできますし、`route`関数を使用して[ルートハンドラ](#multiple_routes)をグループ化し、[ネストされたルート](#nested_routes)を定義することもできます。

*   **ハンドラ**

    [リクエスト](server-requests.md)と[レスポンス](server-responses.md)をどのように処理するかを指定します。ハンドラ内では、`ApplicationCall`にアクセスし、クライアントリクエストを処理し、レスポンスを送信できます。

## パスパターンの指定 {id="match_url"}

[ルーティング](#define_route)関数（`route`、`get`、`post`など）に渡されるパスパターンは、URLの_パス_コンポーネントに一致させるために使用されます。パスは、スラッシュ`/`文字で区切られた一連のパスセグメントを含むことができます。

> Ktorは、末尾のスラッシュがあるパスとないパスを区別することに注意してください。この動作は、`IgnoreTrailingSlash`プラグインを[インストール](server-plugins.md#install)することで変更できます。
>
{type="note"}

以下にいくつかのパスの例を示します。
*   `/hello`
    単一のパスセグメントを含むパスです。
*   `/order/shipment`
    複数のパスセグメントを含むパスです。[route/get/など](#define_route)関数にそのまま渡すことも、複数の`route`関数を[ネスト](#multiple_routes)してサブルートを整理することもできます。
*   `/user/{login}`
    `login` [パスパラメーター](#path_parameter)を持つパスです。その値はルートハンドラ内でアクセスできます。
*   `/user/*`
    任意のパスセグメントに一致する[ワイルドカード文字](#wildcard)を持つパスです。
*   `/user/{...}`
    URLパスの残りのすべてに一致する[テールカード](#tailcard)を持つパスです。
*   `/user/{param...}`
    [テールカードを持つパスパラメーター](#path_parameter_tailcard)を含むパスです。
*   `` `Regex("/.+/hello")` ``
    `/hello`の最後の出現までを含むパスセグメントに一致する[正規表現](#regular_expression)を含むパスです。

### ワイルドカード {id="wildcard"}
_ワイルドカード_（`*`）は任意のパスセグメントに一致し、省略することはできません。例えば、`/user/*`は`/user/john`に一致しますが、`/user`には一致しません。

### テールカード {id="tailcard"}
_テールカード_（`{...}`）はURLパスの残りのすべてに一致し、複数のパスセグメントを含むことができ、空にすることもできます。例えば、`/user/{...}`は`/user/john/settings`と`/user`の両方に一致します。

### パスパラメーター {id="path_parameter"}
_パスパラメーター_（`{param}`）はパスセグメントに一致し、それを`param`という名前のパラメーターとしてキャプチャします。このパスセグメントは必須ですが、疑問符を追加することでオプションにできます：`{param?}`。例えば：
*   `/user/{login}`は`/user/john`に一致しますが、`/user`には一致しません。
*   `/user/{login?}`は`/user/john`と`/user`の両方に一致します。
    > オプションのパスパラメーター`{param?}`はパスの末尾でのみ使用できることに注意してください。
    >
    {type="note"}

ルートハンドラ内でパラメーター値にアクセスするには、`call.parameters`プロパティを使用します。例えば、以下のコードスニペットの`call.parameters["login"]`は、`/user/admin`パスに対して_admin_を返します。
```kotlin
```
{src="snippets/_misc/RouteParameter.kt"}

> リクエストにクエリ文字列が含まれている場合、`call.parameters`にはこのクエリ文字列のパラメーターも含まれます。ハンドラ内でクエリ文字列とそのパラメーターにアクセスする方法については、[](server-requests.md#query_parameters)を参照してください。

### テールカードを持つパスパラメーター {id="path_parameter_tailcard"}

テールカードを持つパスパラメーター（`{param...}`）はURLパスの残りのすべてに一致し、各パスセグメントの複数の値を`param`をキーとしてパラメーターに入れます。例えば、`/user/{param...}`は`/user/john/settings`に一致します。
ルートハンドラ内でパスセグメントの値にアクセスするには、`call.parameters.getAll("param")`を使用します。上記の例では、`getAll`関数は_john_と_settings_の値を含む配列を返します。

### 正規表現 {id="regular_expression"}

正規表現は、すべてのルートハンドラ定義関数（`route`、`get`、`post`など）で使用できます。

> 正規表現の詳細については、[Kotlinドキュメント](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/)を参照してください。

`/hello`で終わる任意のパスに一致するルートを記述しましょう。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex(".+/hello")) {
        call.respondText("Hello")
    }
}
```
このルート定義により、`/foo/hello`、`/bar/baz/hello`など、`/hello`で終わるパスへのすべての受信リクエストが一致します。

#### ハンドラでのパスのパートへのアクセス

正規表現では、名前付きグループは、パターンに一致する文字列の特定の部分をキャプチャし、それに名前を割り当てる方法です。
構文`(?<name>pattern)`は名前付きグループを定義するために使用され、`name`はグループの名前、`pattern`はグループに一致する正規表現パターンです。

ルート関数で名前付きグループを定義することで、パスの一部をキャプチャし、ハンドラ関数で`call.parameters`オブジェクトを使用してキャプチャされたパラメーターにアクセスできます。

例えば、`/hello`の後に整数識別子が含まれるパスへのリクエストに一致するルートを定義できます。

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
以下のコードでは、`(?<id>\d+)`という名前付きグループは、リクエストされたパスから整数識別子`id`をキャプチャするために使用され、`call.parameters`プロパティは、ハンドラ関数でキャプチャされた`id`パラメーターにアクセスするために使用されます。

名前なしグループは正規表現ルートハンドラ内ではアクセスできませんが、パスに一致させるために使用できます。例えば、パス`hello/world`は一致しますが、`hello/World`は一致しません。

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex("hello/([a-z]+)")) {
        call.respondText("Hello")
    }
}
```
また、パスセグメント全体が正規表現によって消費される必要があります。例えば、パスパターン`get(Regex("[a-z]+"))`はパス`"hello1"`には一致しませんが、パス`hello/1`の`hello`部分に一致し、`/1`は次のルートのために残されます。

## 複数のルートハンドラの定義 {id="multiple_routes"}

### 動詞関数によるルートのグループ化 {id="group_by_verb"}

複数のルートハンドラを定義したい場合（これはもちろん、どのアプリケーションにも当てはまります）、それらを`routing`関数に追加するだけで済みます。

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

もう一つの方法は、これらをパスごとにグループ化することです。その際、パスを定義し、そのパスに対する動詞を`route`関数を使用してネストされた関数として配置します。

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

グループ化の方法に関わらず、Ktorは`route`関数のパラメーターとしてサブルートを持つこともできます。これは、他のリソースの論理的な子であるリソースを定義するのに役立ちます。
次の例は、`/order/shipment`への`GET`および`POST`リクエストに応答する方法を示しています。

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

つまり、各`route`呼び出しは、個別のパスセグメントを生成します。

[ルーティング](#define_route)関数（`route`、`get`、`post`など）に渡されるパスパターンは、URLの_パス_コンポーネントに一致させるために使用されます。パスは、スラッシュ`/`文字で区切られた一連のパスセグメントを含むことができます。

## ルート拡張関数 {id="route_extension_function"}

一般的なパターンは、`Route`型に対する拡張関数を使用して実際のルートを定義することです。これにより、動詞へのアクセスが容易になり、すべてのルートを単一のルーティング関数にまとめることによる煩雑さを解消できます。このパターンは、ルートをどのようにグループ化するかに関わらず適用できます。そのため、最初の例はよりクリーンな方法で表現できます。

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

> アプリケーションの保守性を考慮してスケールさせるためには、特定の[構造化パターン](server-application-structure.md)に従うことが推奨されます。

## ルートのトレース {id="trace_routes"}

[ロギング](server-logging.md)が設定されている場合、Ktorはルートトレースを有効にします。これは、一部のルートが実行されない理由を特定するのに役立ちます。
例えば、アプリケーションを[実行](server-run.md)し、指定されたエンドポイントにリクエストを送信すると、アプリケーションの出力は次のようになる場合があります。

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

> [Nativeサーバー](server-native.md)でルートトレースを有効にするには、アプリケーションを[実行](server-run.md)する際に`KTOR_LOG_LEVEL`環境変数に_TRACE_値を渡します。