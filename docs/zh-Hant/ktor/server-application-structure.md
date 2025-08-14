[//]: # (title: 應用程式結構)

<link-summary>了解如何組織您的應用程式結構，使其隨著應用程式的增長保持可維護性。</link-summary>

Ktor 的一個強項在於其在應用程式結構組織上的彈性。不同於許多其他伺服器端框架，它不會強制我們採用特定的模式，例如將所有相關的路由都放在單一的類別名稱 `CustomerController` 中。儘管這當然是可行的，但並非強制要求。

在本節中，我們將探討組織應用程式結構的不同選項。

## 依檔案分組 {id="group_by_file"}

一種方法是將相關的路由分組到單一檔案中。例如，如果我們的應用程式處理客戶 (Customers) 和訂單 (Orders)，這意味著將會有 `CustomerRoutes.kt` 和 `OrderRoutes.kt` 檔案：

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

子路由會發生什麼情況？例如 `order/shipment`？這在某種程度上取決於我們對此 URL 的理解。如果我們將這些視為資源（它們確實是），那麼 `shipment` 本身就可以是一個資源，並且可以很容易地映射到另一個檔案 `ShipmentRoutes.kt`。

## 分組路由定義 {id="group_routing_definitions"}

這種方法的一個優點是，我們還可以依檔案分組路由定義，以及潛在的功能。例如，假設我們遵循上述的依檔案分組佈局。即使路由位於不同的檔案中，我們仍需要在 Application 層級宣告它們。因此，我們的應用程式看起來會像這樣：

```kotlin
routing {
    customerRouting()
    listOrdersRoute()
    getOrderRoute()
    totalizeOrderRoute()
}
```

如果我們的應用程式中有大量的路由，這可能會迅速變得冗長且繁瑣。然而，由於我們已將路由依檔案分組，我們可以利用這一點，在每個檔案中也定義路由。為此，我們可以為 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html) 建立一個擴展 (extension) 並定義路由：

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

現在在我們實際的 `Application.module` 啟動時，我們只需呼叫這些函式，而無需 `routing` 區塊：

```kotlin
fun Application.module() {
    // Init....
    customerRoutes()
    orderRoutes()
}
```

我們甚至可以更進一步——根據需要為每個應用程式安裝外掛程式 (plugin)，特別是當我們使用依賴於特定路由的 Authentication 外掛程式時。然而，一個重要的注意事項是，Ktor 會透過拋出 `DuplicateApplicationPluginException` 例外來檢測外掛程式是否已安裝兩次。

### 關於使用物件的注意事項

使用物件來分組路由函式並不會帶來任何效能或記憶體上的好處，因為 Ktor 中的頂層函式只會被實例化一次。雖然它可以提供某種內聚結構，讓我們可以共享通用功能，但如果我們擔心任何形式的開銷，則沒有必要使用物件。

## 依資料夾分組 {id="group_by_folder"}

將所有內容放在單一檔案中，隨著檔案的增長可能會變得有些繁瑣。我們可以改為使用資料夾（即套件 (packages)）來定義不同的區域，然後將每個路由放在其自己的檔案中。

![依資料夾分組](ktor-routing-1.png){width="350" border-effect="rounded"}

儘管這確實提供了在路由和個別動作方面擁有良好佈局的優勢，但它肯定會導致「套件過載」(package overload)，並可能導致大量檔案名稱相同，使導航變得有些困難。另一方面，正如我們在下一個範例中將看到的，我們也可以僅為每個檔案加上區域前綴（例如 `CustomerCreate.kt`）。

## 依功能分組 {id="group_by_feature"}

諸如 ASP.NET MVC 或 Ruby on Rails 等框架，具有使用三個資料夾——Model、View 和 Controller（路由）來組織應用程式的概念。

![Model View Controller](ktor-routing-2.png){width="350" border-effect="rounded"}

這與我們上面將路由分組到其各自的套件/檔案中，以及 Ktor 中將我們的視圖 (views) 放在 `resources` 資料夾的架構並不遙遠，當然，也沒有什麼能阻止我們擁有一個套件模型 (package model)，其中放置我們想要顯示或回應 HTTP 端點的任何資料。

儘管這種方法可能有效並且與其他框架類似，但有些人會認為按功能分組更有意義，即不是按照路由、模型和視圖來分佈專案，而是按照特定的行為/功能來分組，例如 `OrderProcessPayment`、`CustomerAddressChange` 等。

![功能分組](ktor-routing-3.png){width="350" border-effect="rounded"}

對於許多框架來說，如果不嚴重修改其底層約定，這種程式碼組織方式是不可行的。然而，Ktor 鑑於其高度的彈性，原則上這不應該是個問題。但有一個例外——當我們使用 [模板引擎 (template engine)](server-templating.md) 時，資源 (resources) 可能會成為問題。但讓我們看看如何解決這個問題。

這個問題的解決方式很大程度上取決於用於視圖 (Views) 的內容。如果我們的應用程式僅僅是一個 HTTP 後端，並且我們使用客戶端技術，那麼通常所有的渲染都在客戶端進行。如果我們使用 Kotlinx.HTML，那麼再次，這也不是問題，因為頁面可以從放置在任何位置的任何 Kotlin 檔案生成。

問題更多地出現在我們使用 FreeMarker 等模板引擎時。它們在模板檔案的存放位置和方式上有些特殊。幸運的是，其中一些提供了模板載入方式的彈性。

例如，使用 FreeMarker，我們可以使用 `MultiTemplateLoader`，然後從不同位置載入模板：

```kotlin
install(FreeMarker) {
    val customerTemplates = FileTemplateLoader(File("./customer/changeAddress"))
    val loaders = arrayOf<TemplateLoader>(customerTemplates)
    templateLoader = MultiTemplateLoader(loaders)
}
```

顯然，這段程式碼並非理想，因為它使用了相對路徑等，但我們不難想像如何讓它遍歷資料夾並載入模板，或者甚至建立一個自訂的建置動作 (build action)，在執行前將視圖複製到我們的 `resources` 資料夾。解決這個問題的方法有很多種。

這種方法的好處是，我們可以將所有與相同功能相關的內容，依功能分組到單一位置，而不是依據其技術/基礎設施層面。