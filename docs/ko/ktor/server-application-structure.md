[//]: # (title: 애플리케이션 구조)

<link-summary>애플리케이션이 성장함에 따라 유지보수성을 확보하기 위해 애플리케이션을 어떻게 구성해야 하는지 알아보세요.</link-summary>

Ktor의 강점 중 하나는 애플리케이션을 구성하는 데 있어 유연성을 제공한다는 점입니다. 다른 많은 서버 측 프레임워크와 달리, Ktor는 모든 응집성 있는 경로를 `CustomerController`와 같은 단일 클래스 이름에 배치해야 하는 등 특정 패턴을 강요하지 않습니다. 물론 그렇게 하는 것도 가능하지만, 필수는 아닙니다.

이 섹션에서는 애플리케이션을 구성할 수 있는 다양한 옵션을 살펴보겠습니다.

## 파일별 그룹화 {id="group_by_file"}

한 가지 접근 방식은 관련 경로를 단일 파일로 그룹화하는 것입니다. 예를 들어, 애플리케이션이 고객(Customers)과 주문(Orders)을 다룬다면, 이는 `CustomerRoutes.kt` 파일과 `OrderRoutes.kt` 파일을 가지는 것을 의미합니다.

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

하위 경로(sub-routes)는 어떻게 될까요? 예를 들어 `order/shipment`와 같은 경우는요? 이는 이 URL을 우리가 어떻게 이해하느냐에 따라 다소 달라집니다.
만약 이것들을 리소스(실제로 그렇습니다)로 간주한다면, `shipment` 자체도 리소스가 될 수 있으며, 쉽게 또 다른 파일인 `ShipmentRoutes.kt`에 매핑될 수 있습니다.

## 라우팅 정의 그룹화 {id="group_routing_definitions"}

이 접근 방식의 한 가지 장점은 라우팅 정의와 잠재적으로 기능을 파일별로 그룹화할 수도 있다는 것입니다.
예를 들어, 위에서 설명한 파일별 그룹화 레이아웃을 따른다고 가정해 봅시다. 경로가 다른 파일에 있더라도, 우리는 그 경로들을 애플리케이션 수준에서 선언해야 합니다.
따라서 우리의 앱은 다음과 같이 보일 것입니다.

```kotlin
routing {
    customerRouting()
    listOrdersRoute()
    getOrderRoute()
    totalizeOrderRoute()
}
```

앱에 수많은 경로가 있다면, 이는 빠르게 길고 번거로워질 수 있습니다.
그러나 경로가 파일별로 그룹화되어 있으므로, 이를 활용하여 각 파일 내에서 라우팅을 정의할 수도 있습니다.
이를 위해 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html)에 대한 확장 함수(extension)를 생성하고 경로를 정의할 수 있습니다.

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

이제 실제 `Application.module` 시작 시에는 `routing` 블록 없이 이 함수들을 호출하기만 하면 됩니다.

```kotlin
fun Application.module() {
    // Init....
    customerRoutes()
    orderRoutes()
}
```

한 걸음 더 나아가, 필요에 따라 애플리케이션별로 플러그인(plugins)을 설치할 수도 있습니다. 특히 특정 경로에 의존하는 인증(Authentication) 플러그인을 사용하는 경우 그렇습니다. 하지만 한 가지 중요한 점은 Ktor는 플러그인이 두 번 설치되었는지 감지하고 `DuplicateApplicationPluginException` 예외를 발생시킨다는 것입니다.

### 객체 사용에 대한 참고 사항

라우팅 함수를 그룹화하기 위해 객체(objects)를 사용하는 것은 성능이나 메모리 측면에서 어떤 종류의 이점도 제공하지 않습니다. Ktor의 최상위 함수(top-level functions)는 한 번만 인스턴스화되기 때문입니다. 공통 기능을 공유하고자 하는 경우에 응집성 있는 구조를 제공할 수 있지만, 어떤 종류의 오버헤드(overhead)에 대해 걱정하는 경우 객체를 사용할 필요는 없습니다.

## 폴더별 그룹화 {id="group_by_folder"}

모든 것을 단일 파일에 두는 것은 파일이 커짐에 따라 다소 번거로워질 수 있습니다.
대신 폴더(즉, 패키지)를 사용하여 다른 영역을 정의하고 각 경로를 자체 파일에 둘 수 있습니다.

![폴더별 그룹화](ktor-routing-1.png){width="350" border-effect="rounded"}

이것은 경로 및 개별 액션과 관련하여 깔끔한 레이아웃의 이점을 제공하지만, 확실히 "패키지 과부하"로 이어질 수 있으며, 잠재적으로 동일한 이름을 가진 수많은 파일이 있어 탐색을 다소 어렵게 만들 수 있습니다.
다른 한편으로, 다음 예제에서 볼 수 있듯이, 각 파일에 영역을 단순히 접두사로 붙일 수도 있습니다(예: `CustomerCreate.kt`).

## 기능별 그룹화 {id="group_by_feature"}

ASP.NET MVC 또는 Ruby on Rails와 같은 프레임워크는 모델(Model), 뷰(View), 컨트롤러(Controller, 경로)라는 세 가지 폴더를 사용하여 애플리케이션을 구성하는 개념을 가지고 있습니다.

![모델 뷰 컨트롤러](ktor-routing-2.png){width="350" border-effect="rounded"}

이는 위에서 설명한 스키마(경로를 자체 패키지/파일로 그룹화하고, Ktor의 경우 `resources` 폴더에 뷰를, 그리고 HTTP 엔드포인트에 표시하거나 응답할 데이터를 배치하는 모델 패키지를 가질 수 있다는 것)와 크게 다르지 않습니다.

이 접근 방식은 작동할 수 있으며 다른 프레임워크와 유사하지만, 일부는 프로젝트를 경로, 모델 및 뷰별로 분산하는 대신 `OrderProcessPayment`, `CustomerAddressChange` 등과 같이 특정 동작/기능별로 그룹화하는 것이 더 합리적이라고 주장할 수 있습니다.

![기능별 그룹화](ktor-routing-3.png){width="350" border-effect="rounded"}

많은 프레임워크에서는 기본 규칙을 심각하게 해킹하지 않고는 이러한 코드 구성이 불가능합니다. 그러나 Ktor는 유연성이 높기 때문에 원칙적으로는 문제가 되지 않습니다. 단 한 가지 예외는 [템플릿 엔진](server-templating.md)을 사용하는 경우 리소스가 문제가 될 수 있다는 것입니다. 하지만 이 문제를 어떻게 해결할 수 있는지 살펴보겠습니다.

이 문제가 어떻게 해결되는지는 뷰(Views)에 무엇이 사용되는지에 크게 좌우됩니다. 애플리케이션이 단순히 HTTP 백엔드이고 클라이언트 측 기술을 사용하는 경우, 일반적으로 모든 렌더링은 클라이언트 측에서 이루어집니다. `Kotlinx.HTML`을 사용하는 경우, 페이지는 어디에든 배치된 Kotlin 파일에서 생성될 수 있으므로 다시 문제가 되지 않습니다.

문제는 FreeMarker와 같은 템플릿 엔진을 사용할 때 더 많이 발생합니다. 이들은 템플릿 파일이 어디에, 어떻게 위치해야 하는지에 대해 특수한 요구사항이 있습니다. 다행히 일부 템플릿 엔진은 템플릿 로드 방식에 유연성을 제공합니다.

예를 들어, FreeMarker의 경우 MultiTemplateLoader를 사용하여 여러 위치에서 템플릿을 로드할 수 있습니다.

```kotlin
install(FreeMarker) {
    val customerTemplates = FileTemplateLoader(File("./customer/changeAddress"))
    val loaders = arrayOf<TemplateLoader>(customerTemplates)
    templateLoader = MultiTemplateLoader(loaders)
}
```

분명히 이 코드는 상대 경로(relative paths) 등을 사용하므로 이상적이지는 않지만, 폴더를 순회하며 템플릿을 로드하거나 실행 전에 뷰를 `resources` 폴더로 복사하는 사용자 지정 빌드 액션(build action)을 실제로 가질 수 있는 방법을 이해하기 어렵지 않습니다. 이 문제를 해결하는 방법은 상당히 많습니다.

이 접근 방식의 이점은 기술/인프라 측면이 아닌 기능별로 동일한 기능과 관련된 모든 것을 한 곳에 그룹화할 수 있다는 것입니다.