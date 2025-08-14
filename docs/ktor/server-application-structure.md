[//]: # (title: 应用程序结构)

<link-summary>了解如何组织应用程序结构，以便随着应用程序的增长保持其可维护性。</link-summary>

Ktor 的一个强大之处在于其在组织应用程序结构方面的灵活性。与其他许多服务器端框架不同，它不会强制我们采用特定的模式，例如必须将所有内聚路由都放在一个名为 `CustomerController` 的类中。虽然这当然是可能的，但并非必需。

在本小节中，我们将探讨组织应用程序结构的不同选项。

## 按文件分组 {id="group_by_file"}

一种方法是将相关的路由分组到一个文件中。例如，如果我们的应用程序处理客户和订单，这意味着将有一个 `CustomerRoutes.kt` 文件和一个 `OrderRoutes.kt` 文件：

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

那么子路由会怎么样呢？例如 order/shipment？这有点取决于我们如何理解这个 URL。
如果我们将这些视为资源（它们确实是），那么 shipment 本身也可以是一个资源，并且可以轻松映射
到另一个文件 `ShipmentRoutes.kt`。

## 分组路由定义 {id="group_routing_definitions"}

这种方法的一个优点是，我们还可以按文件分组路由定义，以及潜在的功能性。
例如，假设我们遵循如上所示的按文件分组布局。即使路由位于不同的文件中，我们仍然需要在应用程序级别声明它们。
因此，我们的应用看起来会像下面这样：

```kotlin
routing {
    customerRouting()
    listOrdersRoute()
    getOrderRoute()
    totalizeOrderRoute()
}
```

如果我们的应用程序中有大量路由，这很快就会变得冗长和繁琐。
但是，由于我们已按文件分组路由，因此可以利用这一点，在每个文件中也定义路由。
为此，我们可以为 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html) 创建一个扩展，并定义路由：

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

现在，在我们实际的 `Application.module` 启动中，我们只需调用这些函数，而无需 `routing` 代码块：

```kotlin
fun Application.module() {
    // Init....
    customerRoutes()
    orderRoutes()
}
```

我们甚至可以更进一步——根据需要为每个应用程序安装插件，尤其是在使用
依赖于特定路由的 Authentication 插件时。但一个重要的注意事项是，如果 Ktor
检测到插件被安装了两次，它将抛出 `DuplicateApplicationPluginException` 异常。

### 关于使用对象的注意事项

使用对象分组路由函数不会带来任何性能或内存优势，因为 Ktor 中的顶层函数
只会被实例化一次。虽然它可以在我们可能希望共享通用功能时提供某种内聚结构，但如果我们担心任何类型的开销，
则不必使用对象。

## 按文件夹分组 {id="group_by_folder"}

将所有内容放在一个文件中可能会随着文件增大而变得有些繁琐。
我们可以做的是使用文件夹（即包）来定义不同的区域，然后将每个路由放在自己的文件中。

![Grouping by folders](ktor-routing-1.png){width="350" border-effect="rounded"}

虽然这确实在路由和各个操作方面提供了良好的布局优势，但它肯定会导致“包过多”，并可能导致大量同名文件名，从而使导航变得有些困难。
另一方面，正如我们将在下一个示例中看到的，我们也可以仅仅使用区域作为每个文件的前缀（例如 `CustomerCreate.kt`）。

## 按特性分组 {id="group_by_feature"}

ASP.NET MVC 或 Ruby on Rails 等框架具有使用三个文件夹（模型、视图和控制器（路由））来组织应用程序的概念。

![Model View Controller](ktor-routing-2.png){width="350" border-effect="rounded"}

这与我们上面将路由分组到自己的包/文件、在 Ktor 中将视图分组到 `resources` 文件夹的方案并不遥远，当然，也没有什么能阻止我们拥有一个模型包，将我们想要显示或响应 HTTP 端点的任何数据放入其中。

虽然这种方法可能有效，并且与其他框架类似，但有些人会认为按特性分组更有意义，即不按路由、模型和视图分发项目，而是按特定行为/特性分组这些内容，例如 `OrderProcessPayment`、`CustomerAddressChange` 等。

![Feature grouping](ktor-routing-3.png){width="350" border-effect="rounded"}

对于许多框架，这种代码组织方式在不严重修改底层约定的情况下是不可行的。然而，对于 Ktor，鉴于其灵活性，
原则上这不应该是个问题。但有一个注意事项——当我们使用 [模板引擎](server-templating.md) 时，资源可能会成为问题。但让我们看看如何解决这个问题。

如何解决这个问题很大程度上取决于视图使用的技术。如果我们的应用程序仅仅是一个 HTTP 后端，并且我们使用客户端技术，那么通常所有渲染都在客户端完成。如果我们使用 Kotlinx.HTML，那么这也不是问题，因为页面可以从放置在任何地方的任何 Kotlin 文件生成。

当使用 FreeMarker 等模板引擎时，问题会更多地出现。这些引擎在模板文件的位置和加载方式上很特殊。
幸运的是，其中一些提供了在模板加载方面的灵活性。

例如，对于 FreeMarker，我们可以使用 `MultiTemplateLoader`，然后从不同位置加载模板：

```kotlin
install(FreeMarker) {
    val customerTemplates = FileTemplateLoader(File("./customer/changeAddress"))
    val loaders = arrayOf<TemplateLoader>(customerTemplates)
    templateLoader = MultiTemplateLoader(loaders)
}
```

显然，这段代码并不理想，因为它使用了相对路径等，但我们不难看出如何通过遍历文件夹来加载模板，甚至在执行之前进行自定义构建操作来将视图复制到 `resources` 文件夹。
解决这个问题的方法有很多种。

这种方法的优点是，我们可以将与相同功能性相关的所有内容集中在一个位置，按特性分组，而不是按照其技术/基础设施方面进行分组。