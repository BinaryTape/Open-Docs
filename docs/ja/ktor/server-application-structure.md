[//]: # (title: アプリケーションの構造)

<link-summary>アプリケーションが成長してもメンテナンスしやすい構造を維持する方法を学びます。</link-summary>

Ktorの強みの一つは、アプリケーションの構造化に関して提供する柔軟性です。他の多くのサーバーサイドフレームワークとは異なり、例えば、関連するすべてのルートを`CustomerController`という単一のクラス名に配置しなければならないといった、特定のパターンを強制することはありません。もちろん可能ですが、必須ではありません。

このセクションでは、アプリケーションを構造化するために利用可能な異なるオプションを検討します。

## ファイルごとにグループ化 {id="group_by_file"}

1つのアプローチは、関連するルートを単一のファイルにグループ化することです。例えば、アプリケーションが顧客（Customers）と注文（Orders）を扱っている場合、これは`CustomerRoutes.kt`ファイルと`OrderRoutes.kt`ファイルを持つことを意味します。

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

サブ ルート、例えば `order/shipment` のような場合はどうでしょうか？これは、このURLをどう理解するかによってある程度異なります。これらをリソースとして（実際にそうなのですが）考えるのであれば、出荷（shipment）自体がリソースとなり、`ShipmentRoutes.kt`という別のファイルに容易にマッピングできます。

## ルーティング定義をグループ化 {id="group_routing_definitions"}

このアプローチの利点の一つは、ファイルごとにルーティング定義、そして潜在的には機能もグループ化できることです。例えば、上記のようにファイルごとのレイアウトに従うと仮定しましょう。ルートが異なるファイルにあっても、それらを`Application`レベルで宣言する必要があります。そのため、私たちのアプリケーションは次のようになります。

```kotlin
routing {
    customerRouting()
    listOrdersRoute()
    getOrderRoute()
    totalizeOrderRoute()
}
```

アプリケーションに大量のルートがあると、これはすぐに長くなり、扱いにくくなる可能性があります。しかし、ルートをファイルごとにグループ化しているため、これを利用して各ファイル内でもルーティングを定義することができます。このために、[Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html)の拡張を作成し、ルートを定義できます。

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

これで、実際の`Application.module`の起動時に、`routing`ブロックは不要で、これらの関数を呼び出すだけでよくなります。

```kotlin
fun Application.module() {
    // Init....
    customerRoutes()
    orderRoutes()
}
```

さらに一歩進めて、特に認証プラグインのように特定のルートに依存している場合など、必要に応じてアプリケーションごとにプラグインをインストールすることもできます。ただし、Ktorはプラグインが2回インストールされたことを検出し、`DuplicateApplicationPluginException`例外をスローすることに注意してください。

### オブジェクトを使用することに関する注意点

ルーティング関数をグループ化するためにオブジェクトを使用しても、Ktorのトップレベル関数は一度だけインスタンス化されるため、パフォーマンスやメモリ上のメリットを一切提供しません。共通の機能を共有したい場合に、ある種のまとまりのある構造を提供できますが、あらゆる種類のオーバーヘッドを心配している場合に、オブジェクトを使用する必要はありません。

## フォルダーごとにグループ化 {id="group_by_folder"}

すべてを単一のファイルにまとめていると、ファイルが大きくなるにつれて、やや扱いにくくなることがあります。代わりにできることは、フォルダー（つまりパッケージ）を使用して異なる領域を定義し、各ルートを独自のファイルに持つことです。

![Grouping by folders](ktor-routing-1.png){width="350" border-effect="rounded"}

これはルートと個々のアクションに関して優れたレイアウトの利点を提供しますが、「パッケージの過負荷」につながる可能性があり、同じ名前のファイル名が大量に発生する可能性があり、ナビゲーションが多少難しくなります。一方で、次の例で示すように、各ファイルに領域を単にプレフィックスとして付けることもできます（例：`CustomerCreate.kt`）。

## 機能ごとにグループ化 {id="group_by_feature"}

ASP.NET MVCやRuby on Railsのようなフレームワークでは、モデル、ビュー、コントローラー（ルート）という3つのフォルダーを使用してアプリケーションを構造化するという概念があります。

![Model View Controller](ktor-routing-2.png){width="350" border-effect="rounded"}

これは、上記のルートを独自のパッケージ/ファイルにグループ化するスキーマと大差ありません。Ktorの場合、ビューは`resources`フォルダーにあり、もちろん、表示したいデータやHTTPエンドポイントで応答したいデータを配置するパッケージモデルを持つことを何も妨げるものではありません。

このアプローチは機能し、他のフレームワークと似ていますが、プロジェクトをルート、モデル、ビューで分散させるのではなく、特定の動作/機能でグループ化する、つまり`OrderProcessPayment`、`CustomerAddressChange`などのように、機能によってグループ化する方が理にかなっていると主張する人もいるでしょう。

![Feature grouping](ktor-routing-3.png){width="350" border-effect="rounded"}

多くのフレームワークでは、基盤となる規約を大幅に変更することなく、この種のコードの組織化は実現不可能です。しかし、Ktorでは、その柔軟性を考慮すると、原則として問題にはならないはずです。ただし、1つの注意点があります。それは、[テンプレートエンジン](server-templating.md)を使用している場合、リソースが問題になる可能性があるということです。しかし、これをどう解決できるか見てみましょう。

この問題の解決策は、ビューに何を使用するかによって大きく異なります。アプリケーションが単なるHTTPバックエンドであり、クライアントサイド技術を使用している場合、通常すべてのレンダリングはクライアントサイドで行われます。Kotlinx.HTMLを使用している場合、ページはどこに配置されたKotlinファイルからでも生成できるため、これも問題ありません。

問題は、FreeMarkerのようなテンプレートエンジンを使用している場合に、より発生します。これらは、テンプレートファイルの配置方法と場所に関して独特の特性を持っています。幸いなことに、それらの中にはテンプレートの読み込み方法に柔軟性を提供するものもあります。

例えば、FreeMarkerでは、MultiTemplateLoaderを使用することで、異なる場所からテンプレートを読み込むことができます。

```kotlin
install(FreeMarker) {
    val customerTemplates = FileTemplateLoader(File("./customer/changeAddress"))
    val loaders = arrayOf<TemplateLoader>(customerTemplates)
    templateLoader = MultiTemplateLoader(loaders)
}
```

もちろん、このコードは相対パスなどを使用しているため理想的ではありませんが、これがフォルダーをループしてテンプレートを読み込んだり、実行前にビューを`resources`フォルダーにコピーするカスタムビルドアクションを持ったりする方法は簡単に想像できます。この問題を解決する方法は数多くあります。

このアプローチの利点は、技術的/インフラストラクチャ的な側面ではなく、同じ機能に関連するすべてを単一の場所に、機能ごとにグループ化できることです。