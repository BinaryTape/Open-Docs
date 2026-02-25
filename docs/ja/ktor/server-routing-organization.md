[//]: # (title: ルーティングの構成)

<link-summary>
Ktorアプリケーションの成長に合わせて、ルーティングロジックをどのように構成し、構造化するかを学びます。
</link-summary>

Ktorの強みの1つは、その柔軟性にあり、特定のルーティング構成戦略を強制しないことです。
代わりに、アプリケーションの規模や複雑さに最も適した方法でルートを整理することができ、多くのプロジェクトでは以下で説明するパターンを組み合わせて使用しています。

このページでは、プロジェクトの成長に合わせてルーティングコードを整理するための一般的なパターンを紹介します。

## ファイルごとにグループ化する {id="group_by_file"}

ルーティングを整理する1つの方法は、関連するルートを別々のファイルに配置することです。これにより、ルート定義を小さく、読みやすい状態に保つことができます。

例えば、アプリケーションで顧客（customers）と注文（orders）を管理している場合、ルーティングロジックを <Path>CustomerRoutes.kt</Path> ファイルと <Path>OrderRoutes.kt</Path> ファイルに分割できます。

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

各ファイルは、同じドメイン領域に属するルートハンドラーをグループ化します。その後、各グループを `routing` ブロックに登録できます。

```kotlin
routing {
    customerRoutes()
    orderRoutes()
}
```

このアプローチは、各ドメイン領域に数個のルートしか含まれない、小規模または中規模のプロジェクトに適しています。

## パッケージ（フォルダ）ごとにグループ化する {id="group_by_folder"}

ファイルが大きくなると、ナビゲーションが難しくなることがあります。ルーティングロジックを小さく集中した状態に保つために、専用のパッケージ内の複数のファイルにルーティングロジックを分散させることができます。

```Generic
customer/
  ListCustomers.kt
  CreateCustomer.kt
  GetCustomer.kt
  UpdateCustomer.kt
  CustomerRoutes.kt 
```

各ファイルにはルーティングロジックの小さな一部が含まれ、フォルダがドメインを表します。

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

この構造により、エンドポイントの数が増えても、各ルート定義を小さく保ち、ナビゲーションを容易にすることができます。そのため、多くのエンドポイントを持つAPIなどの大規模なアプリケーションに最適です。

## パスごとにグループ化してリソースをネストする {id="group_by_path"}

同じパスに対するすべてのハンドラーをグループ化し、関連するリソースをネストすることでルートを整理できます。
ネストされたルーティングは、エンドポイントが同じリソースに対して複数の操作を含む場合に便利です。

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

パスごとにグループ化することで、関連するエンドポイントが視覚的に近くに配置され、HTTP APIの観点からルーティング構造が理解しやすくなります。

## 機能またはドメインごとにグループ化する {id="group_by_feature"}

アプリケーションが成長するにつれて、ドメインや機能（feature）ごとにグループ化する方がスケーラビリティが高くなります。

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

各機能には、そのドメインに関連するルーティングコードのみを含む独自のパッケージがあります。

例えば、上記の例の構造にある `CustomerRoutes` ファイルには、次のようなルート定義が含まれる場合があります。

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

このパターンは、特に各ドメイン領域に多くのエンドポイントが含まれる場合に、機能の境界を明確に保ち、ルーティングファイルが大きくなりすぎるのを防ぎます。