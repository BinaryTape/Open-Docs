[//]: # (title: 应用程序结构)

<link-summary>了解如何构建应用程序结构，以便随着应用程序的增长保持其可维护性。</link-summary>

Ktor 的一大优势在于它在应用程序结构方面的灵活性。与许多其他服务端框架不同，Ktor 不强制我们遵循特定的模式，例如必须将所有内聚的路由放在一个名为 `CustomerController` 的类中。虽然这样做当然是可行的，但并非必需。

在本节中，我们将探讨构建应用程序结构的不同选项。

## 按文件分组 {id="group_by_file"}

一种方法是将相关路由分组到单个文件中。例如，如果我们的应用程序处理客户和订单，这意味着我们会有 `CustomerRoutes.kt` 和 `OrderRoutes.kt` 文件：

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

子路由（例如 `order/shipment`）会怎样？这在某种程度上取决于我们对这个 URL 的理解。
如果我们将它们视为资源（它们确实是），那么 `shipment` 本身就可以是一个资源，并且可以很容易地映射到另一个文件 `ShipmentRoutes.kt`。

## 分组路由定义 {id="group_routing_definitions"}

这种方法的一个优点是，我们还可以按文件分组路由定义，以及潜在的功能性。
例如，假设我们遵循上述的按文件分组布局。即使路由位于不同的文件中，我们仍需要在 `Application` 级别声明它们。
因此，我们的应用程序将看起来像下面这样：

```kotlin
routing {
    customerRouting()
    listOrdersRoute()
    getOrderRoute()
    totalizeOrderRoute()
}
```

如果我们的应用中有大量路由，这很快就会变得冗长和繁琐。
然而，由于我们已经按文件对路由进行了分组，我们可以利用这一点，在每个文件中也定义路由。
为此，我们可以为 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html) 创建一个扩展，并定义路由：

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

现在，在我们实际的 `Application.module` 启动时，我们只需调用这些函数，而无需 `routing` 代码块：

```kotlin
fun Application.module() {
    // Init....
    customerRoutes()
    orderRoutes()
}
```

我们甚至可以更进一步——根据需要为每个应用程序安装插件，尤其是在使用依赖于特定路由的认证插件时。然而，一个重要的注意事项是，Ktor 如果检测到插件被重复安装，则会抛出 `DuplicateApplicationPluginException` 异常。

### 关于使用对象的说明

使用对象来分组路由函数不会提供任何性能或内存方面的优势，因为 Ktor 中的顶层函数只实例化一次。虽然它可以提供某种内聚的结构，我们可能希望共享通用功能，但如果我们担心任何类型的开销，则不必使用对象。

## 按文件夹分组 {id="group_by_folder"}

当文件增大时，将所有内容放在单个文件中可能会变得有些繁琐。
我们可以做的是使用文件夹（即包）来定义不同的区域，然后将每个路由放在其自己的文件中。

![Grouping by folders](ktor-routing-1.png){width="350" border-effect="rounded"}

虽然这确实在路由和独立操作方面提供了良好的布局优势，但它肯定会导致“包过多”的问题，并可能导致大量同名文件，从而使导航变得有些困难。
另一方面，正如我们在下一个示例中看到的，我们也可以仅仅为每个文件添加区域前缀（例如 `CustomerCreate.kt`）。

## 按特性分组 {id="group_by_feature"}

ASP.NET MVC 或 Ruby on Rails 等框架具有使用三个文件夹（模型、视图和控制器（路由））来组织应用程序的概念。

![Model View Controller](ktor-routing-2.png){width="350" border-effect="rounded"}

这与我们上面将路由分组到各自的包/文件中、在 Ktor 中将视图放在 `resources` 文件夹中以及当然没有任何东西阻止我们拥有一个包模型来放置我们想要显示或响应 HTTP 端点的数据的方案不无关联。

虽然这种方法可能可行，并且类似于其他框架，但有些人会争论说，按特性分组更有意义，即不按路由、模型和视图分发项目，而是按特定行为/特性分组这些内容，例如 `OrderProcessPayment`、`CustomerAddressChange` 等。

![Feature grouping](ktor-routing-3.png){width="350" border-effect="rounded"}

对于许多框架而言，这种代码组织方式在不严重修改底层约定的情况下是不可行的。然而，对于 Ktor，鉴于其灵活性，原则上这不成问题。但有一个注意事项——当我们使用[模板引擎](server-templating.md)时，资源可能会是一个问题。但让我们看看如何解决这个问题。

这个问题的解决方法很大程度上取决于用于视图的技术。如果我们的应用程序仅仅是一个 HTTP 后端，并且我们使用客户端技术，那么通常所有渲染都在客户端完成。如果我们使用 Kotlinx.HTML，那么这再次不是问题，因为页面可以从放置在任何位置的 Kotlin 文件中生成。

当使用 FreeMarker 等模板引擎时，问题会更多地出现。这些引擎在模板文件的存放位置和方式上具有特殊性。
幸运的是，其中一些提供了模板加载的灵活性。

例如，对于 FreeMarker，我们可以使用 `MultiTemplateLoader`，然后从不同的位置加载模板：

```kotlin
install(FreeMarker) {
    val customerTemplates = FileTemplateLoader(File("./customer/changeAddress"))
    val loaders = arrayOf<TemplateLoader>(customerTemplates)
    templateLoader = MultiTemplateLoader(loaders)
}
```

显然，这段代码并不理想，因为它使用了相对路径等等，但不难看出我们如何可以实际遍历文件夹并加载模板，甚至拥有一个自定义构建操作，在执行之前将视图复制到我们的 `resources` 文件夹。
解决这个问题的方法有很多。

这种方法的好处是，我们可以将所有与相同功能相关的内容分组到一个单一位置，即按特性分组，而不是按其技术/基础设施方面分组。