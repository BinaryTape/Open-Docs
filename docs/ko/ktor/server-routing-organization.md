[//]: # (title: 라우팅 구성)

<link-summary>
Ktor 애플리케이션이 성장함에 따라 라우팅 로직을 구성하고 구조화하는 방법을 배워보세요.
</link-summary>

Ktor의 강점 중 하나는 유연성입니다. 특정 라우팅 구성 전략을 강요하지 않습니다.
대신, 애플리케이션의 규모와 복잡도에 가장 적합한 방식으로 라우트를 구성할 수 있으며, 많은 프로젝트에서 아래에 설명된 패턴들을 조합하여 사용합니다.

이 페이지에서는 프로젝트가 성장함에 따라 라우팅 코드를 구성하는 일반적인 패턴들을 보여줍니다.

## 파일별 그룹화 {id="group_by_file"}

라우팅을 구성하는 한 가지 방법은 관련 라우트를 별도의 파일에 배치하는 것입니다. 이렇게 하면 라우트 정의를 작고 읽기 쉽게 유지할 수 있습니다.

예를 들어, 애플리케이션에서 고객(customers)과 주문(orders)을 관리하는 경우, 라우팅 로직을 <Path>CustomerRoutes.kt</Path>와 <Path>OrderRoutes.kt</Path> 파일로 나눌 수 있습니다.

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

각 파일은 동일한 도메인 영역에 속하는 라우트 핸들러들을 그룹화합니다. 그런 다음 `routing` 블록에서 각 그룹을 등록할 수 있습니다.

```kotlin
routing {
    customerRoutes()
    orderRoutes()
}
```

이 접근 방식은 각 도메인 영역에 소수의 라우트만 포함된 소규모 또는 중간 규모의 프로젝트에 적합합니다.

## 패키지(폴더)별 그룹화 {id="group_by_folder"}

파일이 커질수록 탐색하기가 어려워질 수 있습니다. 라우팅 로직을 작고 집중된 상태로 유지하기 위해, 전용 패키지 내의 여러 파일로 라우팅 로직을 분산시킬 수 있습니다.

```Generic
customer/
  ListCustomers.kt
  CreateCustomer.kt
  GetCustomer.kt
  UpdateCustomer.kt
  CustomerRoutes.kt 
```

각 파일은 라우팅 로직의 작은 부분을 포함하며, 폴더는 도메인을 나타냅니다.

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

이 구조는 엔드포인트 수가 늘어남에 따라 각 라우트 정의를 작고 탐색하기 쉽게 유지해 줍니다. 따라서 많은 엔드포인트가 있는 API와 같은 대규모 애플리케이션에 이상적입니다.

## 경로별 그룹화 및 리소스 중첩 {id="group_by_path"}

동일한 경로의 모든 핸들러를 그룹화하고 관련 리소스를 중첩하여 라우트를 구성할 수 있습니다.
중첩 라우팅은 하나의 엔드포인트가 동일한 리소스에 대해 여러 작업을 포함할 때 유용합니다.

```kotlin
routing {
    route("/customer") {
        get { /* 고객 목록 조회 */ }
        post { /* 고객 생성 */ }

        route("/{id}") {
            get { /* 고객 상세 조회 */ }
            put { /* 고객 정보 수정 */ }
            delete { /* 고객 삭제 */ }
        }
    }
}
```

경로별로 그룹화하면 관련 엔드포인트가 시각적으로 가깝게 배치되어, HTTP API 관점에서 라우팅 구조를 더 쉽게 이해할 수 있습니다.

## 기능 또는 도메인별 그룹화 {id="group_by_feature"}

애플리케이션이 성장함에 따라 도메인이나 기능별로 그룹화하는 것이 더 확장성 있는 방법이 됩니다.

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

각 기능은 해당 도메인과 관련된 라우팅 코드만 포함하는 자체 패키지를 가집니다.

예를 들어, 위 예시 구조에서 `CustomerRoutes` 파일은 다음과 같은 라우트 정의를 포함할 수 있습니다.

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
이 패턴은 기능의 경계를 명확하게 유지하고, 특히 각 도메인 영역에 엔드포인트가 많을 때 라우팅 파일이 너무 커지는 것을 방지합니다.