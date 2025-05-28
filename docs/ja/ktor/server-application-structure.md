[//]: # (title: アプリケーションの構造)

<link-summary>アプリケーションの成長に合わせて保守性を維持するためのアプリケーションの構造化方法を学びましょう。</link-summary>

Ktorの強みの一つは、アプリケーションの構造化に関して提供する柔軟性です。他の多くのサーバーサイドフレームワークとは異なり、例えばすべてのまとまりのあるルートを`CustomerController`という単一のクラス名に配置する、といった特定のパターンを強制することはありません。それは確かに可能ですが、必須ではありません。

このセクションでは、アプリケーションを構造化するためのさまざまなオプションを検討します。

## ファイルごとにグループ化 {id="group_by_file"}

1つのアプローチは、関連するルートを単一のファイルにグループ化することです。たとえば、アプリケーションが顧客と注文を扱っている場合、これは`CustomerRoutes.kt`と`OrderRoutes.kt`というファイルを持つことを意味します。

<tabs>
<tab title="CustomerRoutes.kt">

```kotlin
fun Route.customerByIdRoute() {
    get("/customer/{id}") {

    }
}

fun Route.createCustomerRoute() {
    post("/customer") {

    }
}
```
</tab>
<tab title="OrderRoutes.kt">

```kotlin
fun Route.getOrderRoute() {
    get("/order/{id}") {

    }
}

fun Route.totalizeOrderRoute() {
    get("/order/{id}/total") {

    }
}
```
</tab>
</tabs>

サブルートはどうなるでしょうか？たとえば、order/shipmentのようなものです。それはこのURLから何が理解されるかに多少依存します。これらをリソースとして話す（事実、そうです）のであれば、`shipment`自体がリソースになり、簡単に別のファイル`ShipmentRoutes.kt`にマッピングできます。

## ルーティング定義をグループ化 {id="group_routing_definitions"}

このアプローチの利点の1つは、ルーティング定義、そして潜在的には機能もファイルごとにグループ化できることです。たとえば、前述のようにファイルごとのグループ化レイアウトに従うと仮定しましょう。ルートは別のファイルにあるにもかかわらず、アプリケーションレベルでそれらを宣言する必要があります。そのため、私たちのアプリは次のような形になります。

```kotlin
routing {
    customerRouting()
    listOrdersRoute()
    getOrderRoute()
    totalizeOrderRoute()
}
```

アプリにたくさんのルートがあると、これはすぐに長く、扱いにくくなる可能性があります。しかし、ルートはファイルごとにグループ化されているため、この利点を活用して各ファイルでもルーティングを定義できます。そのためには、[Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html)の拡張機能を作成し、ルートを定義できます。

<tabs>
<tab title="CustomerRoutes.kt">

```kotlin
fun Application.customerRoutes() {
    routing {
        listCustomersRoute()
        customerByIdRoute()
        createCustomerRoute()
        deleteCustomerRoute()
    }    
}
```
</tab>
<tab title="OrderRoutes.kt">

```kotlin
fun Application.orderRoutes() {
    routing {
        listOrdersRoute()
        getOrderRoute()
        totalizeOrderRoute()
    }
}
```
</tab>
</tabs>

これで、実際の`Application.module`の起動時には、`routing`ブロックを必要とせずに、これらの関数を単に呼び出すだけです。

```kotlin
fun Application.module() {
    // Init....
    customerRoutes()
    orderRoutes()
}
```

さらに一歩進んで、特に特定のルートに依存する`Authentication`プラグインを使用している場合など、必要に応じてアプリケーションごとにプラグインをインストールすることもできます。ただし、重要な注意点として、Ktorはプラグインが2回インストールされた場合に`DuplicateApplicationPluginException`例外をスローして検出します。

### オブジェクトの使用に関する注意

ルーティング関数をグループ化するためにオブジェクトを使用しても、Ktorのトップレベル関数は一度だけインスタンス化されるため、パフォーマンスやメモリの利点は得られません。共通の機能を共有したい場合に、ある種の凝集性のある構造を提供できますが、何らかのオーバーヘッドを心配している場合にオブジェクトを使用する必要はありません。

## フォルダーごとにグループ化 {id="group_by_folder"}

すべてを単一のファイルにまとめると、ファイルが大きくなるにつれて少々扱いにくくなることがあります。その代わりに、フォルダー（つまりパッケージ）を使用して異なる領域を定義し、各ルートを独自のファイルに持つことができます。

![Grouping by folders](ktor-routing-1.png){width="350" border-effect="rounded"}

これはルートと個々のアクションに関して優れたレイアウトという利点を提供しますが、確かに「パッケージの過負荷」につながる可能性があり、多数のファイル名が同じになることで、ナビゲーションが多少困難になる可能性があります。一方、次の例で示すように、各ファイルに単に領域をプレフィックスとして付けることもできます（例：`CustomerCreate.kt`）。

## 機能ごとにグループ化 {id="group_by_feature"}

ASP.NET MVCやRuby on Railsのようなフレームワークでは、モデル、ビュー、コントローラー（ルート）という3つのフォルダーを使用してアプリケーションを構造化するという概念があります。

![Model View Controller](ktor-routing-2.png){width="350" border-effect="rounded"}

これは、上記のスキーマ（ルートを独自のパッケージ/ファイルにグループ化し、Ktorの場合のビューは`resources`フォルダーに、そしてもちろん、表示したいデータやHTTPエンドポイントに応答したいデータを配置するパッケージモデルを持つことを妨げるものはありません）と大きくかけ離れたものではありません。

このアプローチは機能し、他のフレームワークと似ていますが、ルート、モデル、ビューでプロジェクトを分散させるのではなく、特定の振る舞い/機能（例：`OrderProcessPayment`、`CustomerAddressChange`など）でグループ化する方が理にかなっていると主張する人もいるでしょう。

![Feature grouping](ktor-routing-3.png){width="350" border-effect="rounded"}

多くのフレームワークでは、この種のコード編成は、基盤となる規約を大幅にハッキングしない限り実現できません。しかし、Ktorでは、その柔軟性を考えると、原則として問題ないはずです。ただし、1つ注意点があります。それは、[テンプレートエンジン](server-templating.md)を使用している場合、リソースが問題になる可能性があることです。しかし、これをどのように解決できるか見てみましょう。

この問題の解決方法は、ビューに何が使用されているかに大きく依存します。アプリケーションが単なるHTTPバックエンドであり、クライアントサイド技術を使用している場合、通常、すべてのレンダリングはクライアントサイドで行われます。Kotlinx.HTMLを使用している場合も、ページは任意の場所に配置されたKotlinファイルから生成できるため、問題ありません。

この問題は、FreeMarkerのようなテンプレートエンジンを使用している場合に多く発生します。これらはテンプレートファイルの配置方法と場所に関して特有のものです。幸いなことに、それらの中にはテンプレートの読み込み方法に柔軟性を提供するものもあります。

たとえば、FreeMarkerでは、`MultiTemplateLoader`を使用して、異なる場所からテンプレートを読み込むことができます。

```kotlin
install(FreeMarker) {
    val customerTemplates = FileTemplateLoader(File("./customer/changeAddress"))
    val loaders = arrayOf<TemplateLoader>(customerTemplates)
    templateLoader = MultiTemplateLoader(loaders)
}
```

明らかに、このコードは相対パスを使用していることなどから理想的ではありませんが、フォルダーをループしてテンプレートを読み込む方法、あるいは実行前にビューを`resources`フォルダーにコピーするカスタムビルドアクションを持つ方法も、そう難しくはありません。この問題を解決する方法は数多くあります。

このアプローチの利点は、技術的/インフラストラクチャ的な側面とは対照的に、同じ機能に関連するすべてを単一の場所に、機能ごとにグループ化できることです。