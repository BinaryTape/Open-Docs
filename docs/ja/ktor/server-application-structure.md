[//]: # (title: アプリケーションの構造)

<link-summary>アプリケーションの成長に合わせて保守性を維持するための構造化方法を学びます。</link-summary>

Ktorの強みの一つは、アプリケーションの構造化に関して提供する柔軟性です。他の多くのサーバーサイドフレームワークとは異なり、例えばすべての凝集性の高いルートを`CustomerController`という単一のクラス名に配置するといった特定のパターンを強制することはありません。それはもちろん可能ですが、必須ではありません。

このセクションでは、アプリケーションを構造化するためのさまざまなオプションを検討します。

## ファイルごとにグループ化 {id="group_by_file"}

一つのアプローチは、関連するルートを単一のファイルにグループ化することです。例えば、アプリケーションが顧客と注文を扱っている場合、これは`CustomerRoutes.kt`と`OrderRoutes.kt`というファイルを持つことを意味します。

<Tabs>
<TabItem title="CustomerRoutes.kt">

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
</TabItem>
<TabItem title="OrderRoutes.kt">

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
</TabItem>
</Tabs>

サブルート（例：`order/shipment`）はどうなるでしょうか？これは、このURLで何を理解するかによって多少異なります。これらをリソースとして（実際にそうなのですが）捉えるのであれば、`shipment`自体もリソースになり得るので、別のファイル`ShipmentRoutes.kt`に簡単にマッピングできます。

## ルーティング定義のグループ化 {id="group_routing_definitions"}

このアプローチの利点の一つは、ルーティング定義、そして場合によっては機能もファイルごとにグループ化できることです。例えば、上記のようにファイルごとのレイアウトに従うとします。ルートが別のファイルにある場合でも、アプリケーションレベルでそれらを宣言する必要があります。そのため、私たちのアプリは次のようになります。

```kotlin
routing {
    customerRouting()
    listOrdersRoute()
    getOrderRoute()
    totalizeOrderRoute()
}
```

アプリに大量のルートがあると、これはすぐに長く、扱いにくくなる可能性があります。しかし、ルートはファイルごとにグループ化されているため、この利点を活用して、各ファイル内でもルーティングを定義できます。このために、[Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html)の拡張を作成し、ルートを定義できます。

<Tabs>
<TabItem title="CustomerRoutes.kt">

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
</TabItem>
<TabItem title="OrderRoutes.kt">

```kotlin
fun Application.orderRoutes() {
    routing {
        listOrdersRoute()
        getOrderRoute()
        totalizeOrderRoute()
    }
}
```
</TabItem>
</Tabs>

実際の`Application.module`の起動時には、`routing`ブロックを使用することなく、これらの関数を呼び出すだけになります。

```kotlin
fun Application.module() {
    // Init....
    customerRoutes()
    orderRoutes()
}
```

さらに一歩進んで、必要に応じてアプリケーションごとにプラグインをインストールすることもできます。特に、特定のルートに依存する`Authentication`プラグインを使用している場合などです。ただし、重要な注意点として、Ktorはプラグインが2回インストールされた場合、`DuplicateApplicationPluginException`例外をスローして検出します。

### オブジェクトの使用に関する注意

オブジェクトを使用してルーティング関数をグループ化しても、Ktorのトップレベル関数は一度だけインスタンス化されるため、パフォーマンスやメモリの利点は得られません。共通の機能を共有したい場合に、ある種の凝集性のある構造を提供できますが、何らかのオーバーヘッドを懸念してオブジェクトを使用する必要はありません。

## フォルダーごとのグループ化 {id="group_by_folder"}

すべてを単一のファイルにまとめていると、ファイルが肥大化するにつれて少し煩雑になる可能性があります。代わりにできることは、フォルダー（つまりパッケージ）を使用して異なる領域を定義し、各ルートを独自のファイルに配置することです。

![フォルダーごとのグループ化](ktor-routing-1.png){width="350" border-effect="rounded"}

これは、ルートや個々のアクションに関して優れたレイアウトという利点を提供しますが、確かに「パッケージ過多」や、場合によっては大量のファイル名が同じになることでナビゲーションが多少難しくなる可能性があります。一方で、次の例で見るように、各ファイルに領域をプレフィックスとして付けるだけ（例：`CustomerCreate.kt`など）でも可能です。

## 機能ごとのグループ化 {id="group_by_feature"}

ASP.NET MVCやRuby on Railsのようなフレームワークでは、アプリケーションをModel、View、Controllers (Routes) の3つのフォルダーを使用して構造化するという概念があります。

![モデル・ビュー・コントローラー](ktor-routing-2.png){width="350" border-effect="rounded"}

これは、上記で示した、ルートを独自のパッケージ/ファイルにグループ化し、Ktorの場合はビューを`resources`フォルダーに配置するスキーマと大差ありません。そしてもちろん、表示したいデータやHTTPエンドポイントに応答するデータを配置するパッケージモデルを持つことを妨げるものはありません。

このアプローチは機能し、他のフレームワークと似ていますが、ルート、モデル、ビューでプロジェクトを分散させるのではなく、`OrderProcessPayment`、`CustomerAddressChange`といった特定の振る舞い/機能ごとにグループ化する方が理にかなっていると主張する人もいます。

![機能ごとのグループ化](ktor-routing-3.png){width="350" border-effect="rounded"}

多くのフレームワークでは、この種のコードの整理は、基盤となる規約を大幅にハッキングしないと実現できません。しかし、Ktorは非常に柔軟であるため、原則として問題はないはずです。ただし、一つ注意点があります。それは、[テンプレートエンジン](server-templating.md)を使用している場合、リソースが問題になる可能性があることです。しかし、これをどのように解決できるか見てみましょう。

この問題がどのように解決されるかは、ビューに何を使用するかによって大きく異なります。アプリケーションが単なるHTTPバックエンドであり、クライアントサイド技術を使用している場合、通常、すべてのレンダリングはクライアントサイドで行われます。Kotlinx.HTMLを使用している場合は、どこに配置されたKotlinファイルからでもページを生成できるため、再び問題にはなりません。

FreeMarkerのようなテンプレートエンジンを使用している場合に、より問題が発生します。これらはテンプレートファイルがどのように、どこに配置されるべきかという点で特殊です。幸いなことに、それらの中にはテンプレートのロード方法に柔軟性を提供するものもあります。

例えば、FreeMarkerでは、`MultiTemplateLoader`を使用して、異なる場所からテンプレートをロードできます。

```kotlin
install(FreeMarker) {
    val customerTemplates = FileTemplateLoader(File("./customer/changeAddress"))
    val loaders = arrayOf<TemplateLoader>(customerTemplates)
    templateLoader = MultiTemplateLoader(loaders)
}
```

明らかに、このコードは相対パスを使用しているなどの理由で理想的ではありませんが、実際にフォルダーをループしてテンプレートをロードする方法や、実行前にビューを`resources`フォルダーにコピーするカスタムビルドアクションを持つ方法を理解することは難しくありません。この問題を解決する方法は数多く存在します。

このアプローチの利点は、技術的/インフラストラクチャ的な側面ではなく、同じ機能に関連するすべてを単一の場所、つまり機能ごとにグループ化できることです。