[//]: # (title: 应用程序结构)

<link-summary>了解如何构建应用程序，使其在应用程序增长时保持可维护性。</link-summary>

Ktor 的强大之处在于它在应用程序结构方面提供了灵活性。与许多其他服务端框架不同，它没有强制我们遵循特定模式，例如必须将所有紧密相关的路由放在一个名为 `CustomerController` 的类中。虽然这当然是可行的，但并非必需。

在本节中，我们将探讨组织应用程序结构的不同选项。

## 按文件分组 {id="group_by_file"}

一种方法是将相关的路由分组到一个文件中。例如，如果我们的应用程序处理客户和订单，这意味着将有 `CustomerRoutes.kt` 和 `OrderRoutes.kt` 文件：

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

子路由会发生什么？例如 `order/shipment`？这在某种程度上取决于我们如何理解这个 URL。如果我们将这些视为资源（它们确实是），那么发货本身就可以是一个资源，并且可以轻松映射到另一个文件 `ShipmentRoutes.kt`。

## 路由定义分组 {id="group_routing_definitions"}

这种方法的一个优点是，我们还可以按文件对路由定义以及潜在的功能进行分组。例如，假设我们遵循上述按文件分组的布局。即使路由位于不同的文件中，我们也需要在 Application 级别声明它们。因此，我们的应用程序将看起来像以下这样：

```kotlin
routing {
    customerRouting()
    listOrdersRoute()
    getOrderRoute()
    totalizeOrderRoute()
}
```

如果我们的应用程序中有大量路由，这很快就会变得冗长和繁琐。然而，既然我们已经将路由按文件分组，我们就可以利用这一点，也在每个文件中定义路由。为此，我们可以为 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html) 创建一个扩展并定义路由：

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

现在，在我们的实际 `Application.module` 启动时，我们只需调用这些函数，无需 `routing` 块：

```kotlin
fun Application.module() {
    // Init....
    customerRoutes()
    orderRoutes()
}
```

我们甚至可以更进一步——根据需要为每个应用程序安装插件，尤其是在我们使用依赖于特定路由的身份验证插件时。然而，一个重要的注意事项是，Ktor 会通过抛出 `DuplicateApplicationPluginException` 异常来检测插件是否已被安装两次。

### 关于使用对象的一点说明

使用对象对路由函数进行分组不会带来任何性能或内存上的好处，因为 Ktor 中的顶层函数只会被实例化一次。虽然它能提供某种紧密结合的结构，我们可能希望共享通用功能，但如果我们担心任何开销，则无需使用对象。

## 按文件夹分组 {id="group_by_folder"}

随着文件增长，将所有内容放在一个文件中可能会变得有些繁琐。相反，我们可以使用文件夹（即包）来定义不同的区域，然后将每个路由放在自己的文件中。

![按文件夹分组](ktor-routing-1.png){width="350" border-effect="rounded"}

虽然这确实提供了在路由和各个操作方面布局良好的优点，但它肯定会导致“包过载”，并可能出现大量同名文件，使导航变得有些困难。另一方面，正如我们在下一个示例中将看到的，我们也可以仅仅为每个文件加上区域前缀（例如 `CustomerCreate.kt`）。

## 按功能分组 {id="group_by_feature"}

诸如 ASP.NET MVC 或 Ruby on Rails 等框架，具有使用三个文件夹组织应用程序结构的概念——Model、View 和 Controllers (Routes)。

![模型-视图-控制器](ktor-routing-2.png){width="350" border-effect="rounded"}

这与我们上面讨论的方案并非遥不可及，即在各自的包/文件中对路由进行分组，在 Ktor 的情况下，我们的视图位于 `resources` 文件夹中，当然，没有什么能阻止我们拥有一个包模型，其中放置我们想要显示或用于响应 HTTP 端点的数据。

虽然这种方法可能有效并且类似于其他框架，但有些人会争辩说，按功能对事物进行分组会更有意义，即，与其将项目按路由、模型和视图进行分发，不如按特定行为/功能进行分组，例如 `OrderProcessPayment`、`CustomerAddressChange` 等。

![功能分组](ktor-routing-3.png){width="350" border-effect="rounded"}

对于许多框架而言，如果没有严重修改底层约定，这种代码组织方式是不可行的。然而，对于 Ktor 来说，考虑到它的灵活性，原则上不应该是个问题。但有一个注意事项——当我们使用[模板引擎](server-templating.md)时，资源可能成为问题。但让我们看看如何解决这个问题。

这个问题如何解决在很大程度上取决于用于视图的技术。如果我们的应用程序仅仅是一个 HTTP 后端，并且我们使用客户端技术，那么通常所有渲染都在客户端进行。如果我们使用 Kotlinx.HTML，那么这也不是问题，因为页面可以从放置在任何地方的任何 Kotlin 文件生成。

问题更多地出现在我们使用诸如 FreeMarker 的模板引擎时。这些引擎在模板文件应该如何以及在哪里定位方面有些特殊。幸运的是，其中一些在模板加载方式上提供了灵活性。

例如，对于 FreeMarker，我们可以使用 `MultiTemplateLoader`，然后从不同的位置加载模板：

```kotlin
install(FreeMarker) {
    val customerTemplates = FileTemplateLoader(File("./customer/changeAddress"))
    val loaders = arrayOf<TemplateLoader>(customerTemplates)
    templateLoader = MultiTemplateLoader(loaders)
}
```

显然，这段代码并不理想，因为它除其他外使用了相对路径，但我们不难看出如何通过循环遍历文件夹来加载模板，甚至拥有一个自定义构建操作，在执行前将视图复制到 `resources` 文件夹。解决这个问题的方法有很多。

这种方法的优点是，我们可以将与相同功能相关的所有内容按功能分组，放在一个位置，而不是根据其技术/基础设施方面来分组。