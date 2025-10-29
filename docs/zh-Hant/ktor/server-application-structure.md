[//]: # (title: 應用程式結構)

<link-summary>了解如何組織應用程式結構，以便隨著應用程式成長保持可維護性。</link-summary>

Ktor 的優勢之一在於它在應用程式結構化方面提供了極大的彈性。與許多其他伺服器端框架不同，它不強迫我們遵循特定模式，例如將所有內聚的路由放置在名為 `CustomerController` 的單一類別中。雖然這當然是可行的，但並非強制要求。

在本節中，我們將探討組織應用程式結構的不同選項。

## 按檔案分組 {id="group_by_file"}

一種方法是將相關的路由分組到單一檔案中。例如，如果我們的應用程式處理客戶和訂單，這意味著將會有 `CustomerRoutes.kt` 和 `OrderRoutes.kt` 兩個檔案：

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

子路由會怎麼樣？例如 `order/shipment`？這在某種程度上取決於我們對此 URL 的理解。如果我們將這些視為資源（它們確實是），那麼 `shipment` 本身就可以是一個資源，並且可以輕鬆地映射到另一個檔案 `ShipmentRoutes.kt`。

## 分組路由定義 {id="group_routing_definitions"}

這種方法的一個優勢是，我們還可以按檔案分組路由定義，以及潛在的功能。例如，假設我們遵循上述的按檔案分組佈局。儘管路由位於不同的檔案中，我們仍需要在 `Application` 層級聲明它們。因此，我們的應用程式會看起來像這樣：

```kotlin
routing {
    customerRouting()
    listOrdersRoute()
    getOrderRoute()
    totalizeOrderRoute()
}
```

如果我們的應用程式中有大量的路由，這可能會很快變得冗長且繁瑣。然而，既然我們已經按檔案對路由進行了分組，我們可以利用這一點，並在每個檔案中也定義路由。為此，我們可以為 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html) 建立一個擴充功能並定義路由：

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

現在，在我們實際的 `Application.module` 啟動中，我們只需呼叫這些函式，無需 `routing` 區塊：

```kotlin
fun Application.module() {
    // Init....
    customerRoutes()
    orderRoutes()
}
```

我們甚至可以更進一步——根據需要為每個應用程式安裝外掛程式，特別是當我們使用依賴於特定路由的 `Authentication` 外掛程式時。然而，一個重要的注意事項是，如果外掛程式被安裝了兩次，Ktor 會透過拋出 `DuplicateApplicationPluginException` 異常來偵測到。

### 關於使用物件的說明

使用物件來分組路由函式不會提供任何效能或記憶體方面的優勢，因為 Ktor 中的頂層函式只會被實例化一次。雖然它可以提供某種內聚結構，以便我們可能希望共享通用功能，但如果我們擔心任何開銷，則沒有必要使用物件。

## 按資料夾分組 {id="group_by_folder"}

將所有內容都放在一個單一檔案中，隨著檔案的增長可能會變得有些繁瑣。我們可以做的是使用資料夾（即套件）來定義不同的區域，然後將每個路由放在其自己的檔案中。

![按資料夾分組](ktor-routing-1.png){width="350" border-effect="rounded"}

雖然這在路由和個別操作方面確實提供了良好的佈局優勢，但它肯定會導致「套件過載」，並且可能會有大量檔案名相同，使得導航變得有些困難。另一方面，正如我們在下一個範例中將看到的，我們也可以僅用區域前綴每個檔案（例如 `CustomerCreate.kt`）。

## 按功能分組 {id="group_by_feature"}

諸如 ASP.NET MVC 或 Ruby on Rails 等框架，具有使用三個資料夾（模型、視圖和控制器 (路由)）來構建應用程式的概念。

![模型、視圖、控制器](ktor-routing-2.png){width="350" border-effect="rounded"}

這與我們上面將路由分組到其自己的套件/檔案中、Ktor 中將視圖放在 `resources` 資料夾中、以及當然，沒有什麼能阻止我們擁有一個套件模型來放置我們想要顯示或響應 HTTP 端點的任何資料的模式並無二致。

雖然這種方法可能有效並類似於其他框架，但有些人會認為按功能分組更有意義，也就是說，不將專案按路由、模型和視圖分佈，而是按特定行為/功能（例如 `OrderProcessPayment`、`CustomerAddressChange` 等）來分組。

![功能分組](ktor-routing-3.png){width="350" border-effect="rounded"}

對於許多框架來說，如果不嚴重修改底層慣例，這種程式碼組織方式是不可行的。然而，對於 Ktor 來說，鑑於其靈活性，原則上這應該不是問題。但有一個例外——當我們使用 [模板引擎](server-templating.md) 時，資源可能會成為問題。但讓我們看看如何解決這個問題。

這個問題的解決方式很大程度上取決於視圖所使用的技術。如果我們的應用程式僅僅是一個 HTTP 後端，並且我們使用客戶端技術，那麼通常所有渲染都是在客戶端進行的。如果我們使用 `Kotlinx.HTML`，那麼這也不是問題，因為頁面可以從放置在任何地方的任何 Kotlin 檔案生成。

問題更多地出現在我們使用 FreeMarker 等模板引擎時。這些引擎在模板檔案的存放位置和載入方式上有些特殊。幸運的是，其中一些提供了模板載入方式的靈活性。

例如，使用 FreeMarker，我們可以使用 `MultiTemplateLoader`，然後從不同位置載入模板：

```kotlin
install(FreeMarker) {
    val customerTemplates = FileTemplateLoader(File("./customer/changeAddress"))
    val loaders = arrayOf<TemplateLoader>(customerTemplates)
    templateLoader = MultiTemplateLoader(loaders)
}
```

顯然，這段程式碼並不理想，因為它使用了相對路徑等問題，但我們不難看出如何讓它實際循環遍歷資料夾並載入模板，甚至可以有一個自定義的建構動作，在執行前將視圖複製到我們的 `resources` 資料夾中。解決這個問題的方法有很多種。

這種方法的好處是，我們可以將所有與相同功能相關的內容，按功能分組到單一位置，而不是按技術/基礎設施方面進行分組。