[//]: # (title: 應用程式結構)

<link-summary>了解如何組織您的應用程式結構，以便在應用程式成長時保持可維護性。</link-summary>

Ktor 的優點之一是其在應用程式結構上的靈活性。與許多其他伺服器端框架不同，它不會強迫我們採用特定的模式，例如將所有關聯的路由都放在單一的類別名稱（例如 `CustomerController`）中。雖然這樣做當然是可行的，但並非強制要求。

在本節中，我們將探討組織應用程式結構的不同選項。

## 依檔案分組 {id="group_by_file"}

一種方法是將相關的路由分組到單一檔案中。例如，如果我們的應用程式處理客戶 (Customers) 和訂單 (Orders)，這就意味著會有 `CustomerRoutes.kt` 和 `OrderRoutes.kt` 兩個檔案：

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

子路由會怎麼辦？例如像 `order/shipment` 這樣的路徑？這在某種程度上取決於我們如何理解這個 URL。如果我們將這些視為資源 (resources)（它們確實是），那麼 `shipment` 本身就可以是一個資源，並且可以輕鬆地對應到另一個檔案 `ShipmentRoutes.kt`。

## 路由定義分組 {id="group_routing_definitions"}

這種方法的一個優點是，我們還可以根據檔案將路由定義，以及潛在的功能性進行分組。例如，假設我們遵循上述的依檔案分組佈局。即使路由位於不同的檔案中，我們仍需要在應用程式 (Application) 層級宣告它們。因此，我們的應用程式會看起來像這樣：

```kotlin
routing {
    customerRouting()
    listOrdersRoute()
    getOrderRoute()
    totalizeOrderRoute()
}
```

如果我們的應用程式中有大量路由，這可能會很快變得冗長而笨重。然而，由於我們已將路由依檔案分組，我們可以利用這一點，也在每個檔案中定義路由。為此，我們可以為 [應用程式 (Application)](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html) 建立一個擴充 (extension)，並定義路由：

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

現在，在我們實際的 `Application.module` 啟動時，我們只需呼叫這些函式，而無需 `routing` 區塊：

```kotlin
fun Application.module() {
    // Init....
    customerRoutes()
    orderRoutes()
}
```

我們甚至可以更進一步——根據需要為每個應用程式安裝外掛 (plugins)，特別是當我們使用依賴於特定路由的身份驗證外掛時。然而，一個重要的注意事項是，Ktor 會透過拋出 `DuplicateApplicationPluginException` 異常來偵測外掛是否已安裝兩次。

### 關於使用物件的注意事項

使用物件來分組路由函式不會提供任何效能或記憶體上的好處，因為 Ktor 中的頂層函式只會被實例化一次。雖然它能提供某種聚合 (cohesive) 結構，使我們能夠共享通用功能，但如果我們擔心任何形式的開銷 (overhead)，則沒有必要使用物件。

## 依資料夾分組 {id="group_by_folder"}

隨著檔案的增長，將所有內容放在單一檔案中可能會變得有點笨重。相反地，我們可以選擇使用資料夾（即套件 (packages)）來定義不同的區域，然後將每個路由放在自己的檔案中。

![依資料夾分組](ktor-routing-1.png){width="350" border-effect="rounded"}

雖然這在路由和個別動作方面確實提供了良好的佈局優勢，但它肯定會導致「套件過載」(package overload)，並可能導致大量檔案名稱相同，使得導航變得有些困難。另一方面，正如我們在下一個範例中會看到的，我們也可以僅僅在每個檔案前面加上區域名稱（例如 `CustomerCreate.kt`）。

## 依功能分組 {id="group_by_feature"}

諸如 ASP.NET MVC 或 Ruby on Rails 等框架，具有使用三個資料夾（模型 (Model)、視圖 (View) 和控制器/路由 (Controllers/Routes)）來組織應用程式的概念。

![模型-視圖-控制器](ktor-routing-2.png){width="350" border-effect="rounded"}

這與我們上面將路由分組到自己的套件/檔案中，以及 Ktor 中將視圖放在 `resources` 資料夾的架構並無太大差異，當然，也沒有什麼能阻止我們擁有一個模型套件 (package model)，用於放置我們想要顯示或回應 HTTP 端點的任何資料。

雖然這種方法可行且與其他框架相似，但有些人會認為，依功能分組會更有意義，也就是說，不將專案依路由、模型和視圖分佈，而是根據特定的行為/功能來分組，例如 `OrderProcessPayment`、`CustomerAddressChange` 等。

![功能分組](ktor-routing-3.png){width="350" border-effect="rounded"}

對於許多框架來說，如果不嚴重破壞其底層慣例，這種程式碼組織方式是不可行的。然而，Ktor 鑑於其高度靈活性，原則上這應該不是問題。但有一個警告——當我們使用 [模板引擎 (template engine)](server-templating.md) 時，資源 (resources) 可能會成為一個問題。但讓我們看看如何解決這個問題。

這個問題的解決方式在很大程度上取決於用於視圖 (Views) 的內容。如果我們的應用程式僅僅是一個 HTTP 後端，並且我們使用客戶端技術 (client-side technology)，那麼通常所有的渲染都在客戶端進行。如果我們使用 Kotlinx.HTML，那麼這再次不是問題，因為頁面可以從放置在任何位置的 Kotlin 檔案生成。

當我們使用像 FreeMarker 這樣的模板引擎時，問題會更大。這些引擎在模板檔案的存放方式和位置上有其特殊性。幸運的是，其中一些提供了模板載入方式的靈活性。

例如，對於 FreeMarker，我們可以使用 `MultiTemplateLoader`，然後從不同的位置載入模板：

```kotlin
install(FreeMarker) {
    val customerTemplates = FileTemplateLoader(File("./customer/changeAddress"))
    val loaders = arrayOf<TemplateLoader>(customerTemplates)
    templateLoader = MultiTemplateLoader(loaders)
}
```

顯然，這段程式碼並不理想，因為它使用了相對路徑等問題，但我們不難看出如何讓它實際循環遍歷資料夾並載入模板，甚至可以有一個自訂建置動作 (custom build action)，在執行前將視圖複製到我們的 `resources` 資料夾。有許多方法可以解決這個問題。

這種方法的好處是，我們可以將所有與相同功能相關的內容按功能分組在單一位置，而不是依據其技術/基礎設施層面來分組。