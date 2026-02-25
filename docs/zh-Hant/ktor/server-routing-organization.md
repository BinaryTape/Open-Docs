[//]: # (title: Routing 組織)

<link-summary>
了解隨著 Ktor 應用程式的增長，如何組織和建構您的 routing 邏輯。
</link-summary>

Ktor 的強項之一是其靈活性，且不會強制執行單一的 routing 組織策略。
相反地，您可以按照最適合應用程式大小和複雜度的方式來組織 route，許多專案會結合使用以下描述的模式。

本頁面展示了隨著專案增長而組織 routing 程式碼的常見模式。

## 依檔案分組 {id="group_by_file"}

組織 routing 的一種方法是將相關的 route 放置在不同的檔案中。這可以保持 route 定義簡短且具備可讀性。

例如，如果您的應用程式正在管理客戶和訂單，您可以將 routing 邏輯拆分到 <Path>CustomerRoutes.kt</Path> 和 <Path>OrderRoutes.kt</Path> 檔案中：

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

每個檔案都會對屬於相同領域範疇的 route 處理常式進行分組。接著，您可以在 routing 區塊中註冊每個分組：

```kotlin
routing {
    customerRoutes()
    orderRoutes()
}
```

這種方法適用於每個領域範疇僅包含少數 route 的中小型專案。

## 依套件（資料夾）分組 {id="group_by_folder"}

隨著檔案增大，巡覽會變得更加困難。為了保持 routing 邏輯簡潔且專注，您可以將 routing 邏輯分散到專用套件中的多個檔案：

```Generic
customer/
  ListCustomers.kt
  CreateCustomer.kt
  GetCustomer.kt
  UpdateCustomer.kt
  CustomerRoutes.kt 
```

每個檔案包含一小部分 routing 邏輯，而資料夾則代表該領域。

<Tabs>
<TabItem title="CreateCustomer.kt">

```kotlin
fun Route.createCustomerRoute(service: CustomerService) {
    post("/customer") {
        val body = call.receive<CustomerDto>()
        call.respond(service.create(body))
    }
}
```
</TabItem>
<TabItem title="CustomerRoutes.kt">

```kotlin
fun Route.customerRoutes(service: CustomerService) {
    listCustomersRoute(service)
    getCustomerRoute(service)
    createCustomerRoute(service)
    updateCustomerRoute(service)
}
```
</TabItem>
</Tabs>

隨著端點數量的增加，這種結構可以保持每個 route 定義簡短且易於巡覽。因此，這對於大型應用程式（例如具有許多端點的 API）來說非常理想。

## 依路徑對 route 分組並巢狀處理資源 {id="group_by_path"}

您可以透過將相同路徑的所有處理常式分組並巢狀處理相關資源來組織 route。
當一個端點包含對同一資源的多個操作時，巢狀 routing 非常有用：

```kotlin
routing {
    route("/customer") {
        get { /* list customers */ }
        post { /* create customer */ }

        route("/{id}") {
            get { /* get customer */ }
            put { /* update customer */ }
            delete { /* delete customer */ }
        }
    }
}
```

依路徑分組可以讓相關端點在視覺上更加接近，並使 routing 結構從 HTTP API 的角度更容易理解。

## 依功能或領域分組 {id="group_by_feature"}

隨著應用程式的增長，依領域或功能進行分組會更具備可擴展性。

```generic
routes/
    customer/
        CustomerRoutes.kt
        Create.kt
        Details.kt
    order/
        OrderRoutes.kt
        Shipment.kt
```

每個功能都有自己的套件，其中僅包含與該領域相關的 routing 程式碼。

例如，上述範例結構中的 `CustomerRoutes` 檔案可能包含以下 route 定義：

```kotlin
fun Route.customerRoutes(
    service: CustomerService
) {
    route("/customer") {
        get("/{id}") { call.respond(service.get(call.parameters["id"]!!)) }
        post { call.respond(service.create(call.receive<CustomerDto>())) }
    }
}
```
這種模式保持了功能邊界清晰，並防止 routing 檔案變得過大，尤其是在每個領域範疇包含許多端點時。