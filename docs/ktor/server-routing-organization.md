[//]: # (title: 路由组织)

<link-summary>
了解随着 Ktor 应用程序的增长，如何组织并构建路由逻辑。
</link-summary>

Ktor 的优势之一在于其灵活性，它并不强制要求单一的路由组织策略。
相反，您可以按照最适合应用程序规模和复杂度的方式来组织路由，许多项目会结合使用下述模式。

本页面展示了随着项目增长，组织路由代码的常用模式。

## 按文件分组 {id="group_by_file"}

组织路由的一种方式是将相关的路由放置在不同的文件中。这可以保持路由定义简短且易读。

例如，如果您的应用程序正在管理客户和订单，您可以将路由逻辑拆分到 <Path>CustomerRoutes.kt</Path> 和 <Path>OrderRoutes.kt</Path> 文件中：

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

每个文件将属于同一领域范畴的路由处理程序进行分组。然后，您可以在 `routing` 代码块中注册每个分组：

```kotlin
routing {
    customerRoutes()
    orderRoutes()
}
```

这种方法适用于中小型项目，其中每个领域范畴仅包含少量路由。

## 按软件包（文件夹）分组 {id="group_by_folder"}

随着文件的增长，导航可能会变得更加困难。为了保持路由逻辑简练且专注，您可以将路由逻辑分布到专用软件包内的多个文件中：

```Generic
customer/
  ListCustomers.kt
  CreateCustomer.kt
  GetCustomer.kt
  UpdateCustomer.kt
  CustomerRoutes.kt 
```

每个文件包含路由逻辑的一小部分，而文件夹则代表该领域。

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

这种结构使得随着端点数量的增加，每个路由定义依然保持简短且易于导航。因此，它非常适合大型应用程序，例如具有许多端点的 API。

## 按路径分组路由并嵌套资源 {id="group_by_path"}

您可以通过对同一路径的所有处理程序进行分组并嵌套相关资源来组织路由。
当一个端点包含对同一资源的多个操作时，嵌套路由非常有用：

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

按路径分组使相关的端点在视觉上更加接近，并使路由结构从 HTTP API 的角度更容易理解。

## 按功能或领域分组 {id="group_by_feature"}

随着应用程序的增长，按领域或功能分组变得更具扩展性。

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

每个功能都有自己的软件包，其中仅包含与该领域相关的路由代码。

例如，上述示例结构中的 `CustomerRoutes` 文件可能包含以下路由定义：

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
这种模式保持了功能边界清晰，并防止路由文件变得过大，尤其是当每个领域范畴包含许多端点时。