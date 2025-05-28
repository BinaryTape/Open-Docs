[//]: # (title: 애플리케이션 구조)

<link-summary>애플리케이션이 성장함에 따라 유지보수성을 유지하도록 애플리케이션을 구조화하는 방법을 알아보세요.</link-summary>

Ktor의 강점 중 하나는 애플리케이션 구조화 측면에서 제공하는 유연성입니다. 다른 많은 서버 측 프레임워크와 달리, Ktor는 예를 들어 모든 응집성 있는 라우트를 `CustomerController`라는 단일 클래스에 배치해야 하는 것과 같은 특정 패턴을 강요하지 않습니다. 물론 그렇게 할 수도 있지만, 필수는 아닙니다.

이 섹션에서는 애플리케이션을 구조화하기 위한 다양한 옵션들을 살펴보겠습니다.

## 파일별 그룹화 {id="group_by_file"}

한 가지 접근 방식은 관련 라우트를 단일 파일로 그룹화하는 것입니다. 예를 들어, 애플리케이션이 고객(Customer) 및 주문(Order)을 처리하는 경우, 이는 `CustomerRoutes.kt`와 `OrderRoutes.kt` 파일을 가지는 것을 의미합니다:

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

하위 라우트는 어떻게 될까요? 예를 들어 `order/shipment`와 같은 경우는요? 이는 이 URL을 어떻게 이해하느냐에 따라 다소 달라집니다. 만약 이것들을 리소스(실제로 그렇습니다)로 간주한다면, `shipment` 자체도 리소스가 될 수 있으며, 쉽게 다른 파일인 `ShipmentRoutes.kt`에 매핑될 수 있습니다.

## 라우팅 정의 그룹화 {id="group_routing_definitions"}

이 접근 방식의 한 가지 장점은 라우팅 정의와 잠재적으로 기능까지 파일별로 그룹화할 수 있다는 것입니다. 예를 들어, 위에서 설명한 파일별 그룹화 레이아웃을 따른다고 가정해 봅시다. 라우트가 다른 파일에 있더라도, `Application` 수준에서 선언해야 합니다. 따라서 우리 앱은 다음과 같은 모습이 될 것입니다:

```kotlin
routing {
    customerRouting()
    listOrdersRoute()
    getOrderRoute()
    totalizeOrderRoute()
}
```

만약 우리 앱에 수많은 라우트가 있다면, 이는 빠르게 길고 번거로워질 수 있습니다. 하지만 라우트가 파일별로 그룹화되어 있으므로, 이를 활용하여 각 파일에서 라우팅을 정의할 수도 있습니다. 이를 위해 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html)을 위한 확장 함수를 생성하고 라우트를 정의할 수 있습니다:

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

이제 실제 `Application.module` 시작 시에는 `routing` 블록 없이 단순히 이 함수들을 호출하면 됩니다:

```kotlin
fun Application.module() {
    // Init....
    customerRoutes()
    orderRoutes()
}
```

한 단계 더 나아가 애플리케이션별로 플러그인을 필요에 따라 설치할 수도 있습니다. 특히 특정 라우트에 의존하는 `Authentication` 플러그인을 사용하는 경우 그렇습니다. 하지만 한 가지 중요한 점은 Ktor가 플러그인이 두 번 설치되었는지 감지하여 `DuplicateApplicationPluginException` 예외를 발생시킨다는 것입니다.

### 객체 사용에 대한 참고 사항

객체를 사용하여 라우팅 함수를 그룹화하는 것은 성능이나 메모리 측면에서 이점을 제공하지 않습니다. Ktor의 최상위 함수는 한 번만 인스턴스화되기 때문입니다. 이는 공통 기능을 공유하려는 경우 일종의 응집성 있는 구조를 제공할 수 있지만, 어떤 종류의 오버헤드에 대해 걱정한다면 객체를 사용할 필요는 없습니다.

## 폴더별 그룹화 {id="group_by_folder"}

모든 것을 단일 파일에 두는 것은 파일이 커짐에 따라 다소 번거로워질 수 있습니다. 대신 할 수 있는 것은 폴더(즉, 패키지)를 사용하여 다른 영역을 정의하고 각 라우트를 자체 파일에 두는 것입니다.

![폴더별 그룹화](ktor-routing-1.png){width="350" border-effect="rounded"}

이것은 라우트 및 개별 액션과 관련하여 깔끔한 레이아웃의 이점을 제공하지만, 확실히 "패키지 과부하"로 이어질 수 있으며, 잠재적으로 수많은 파일 이름이 동일하게 명명되어 내비게이션을 다소 어렵게 만들 수 있습니다. 다른 한편으로는, 다음 예제에서 보듯이, 각 파일에 단순히 영역 접두사를 붙일 수도 있습니다(예: `CustomerCreate.kt`).

## 기능별 그룹화 {id="group_by_feature"}

ASP.NET MVC 또는 Ruby on Rails와 같은 프레임워크는 모델(Model), 뷰(View), 컨트롤러(Controller, 라우트)라는 세 가지 폴더를 사용하여 애플리케이션을 구조화하는 개념을 가지고 있습니다.

![모델 뷰 컨트롤러](ktor-routing-2.png){width="350" border-effect="rounded"}

이는 라우트를 자체 패키지/파일로 그룹화하고, Ktor의 경우 `resources` 폴더에 뷰를 배치하며, 물론 HTTP 엔드포인트에 표시하거나 응답할 데이터를 배치하는 모델 패키지를 갖는 것을 막을 것이 없는 위의 스키마와 크게 다르지 않습니다.

이 접근 방식은 효과적일 수 있고 다른 프레임워크와 유사하지만, 일부에서는 라우트, 모델, 뷰로 프로젝트를 분산하는 대신 `OrderProcessPayment`, `CustomerAddressChange` 등과 같이 특정 동작/기능별로 그룹화하는 것이 더 합리적이라고 주장할 수 있습니다.

![기능 그룹화](ktor-routing-3.png){width="350" border-effect="rounded"}

많은 프레임워크에서 이러한 코드 구성은 기본 컨벤션을 심각하게 해킹하지 않고는 실현 가능하지 않습니다. 하지만 Ktor는 매우 유연하기 때문에 원칙적으로는 문제가 되지 않습니다. 한 가지 주의할 점은 [템플릿 엔진](server-templating.md)을 사용할 때 리소스가 문제가 될 수 있다는 것입니다. 하지만 이것을 어떻게 해결할 수 있는지 살펴보겠습니다.

이 문제가 어떻게 해결되는지는 뷰(Views)에 무엇이 사용되는지에 따라 크게 달라집니다. 애플리케이션이 단순히 HTTP 백엔드이고 클라이언트 측 기술을 사용한다면, 일반적으로 모든 렌더링은 클라이언트 측에서 이루어집니다. Kotlinx.HTML을 사용한다면, 페이지를 어디에 있든 어떤 Kotlin 파일에서도 생성할 수 있으므로 다시 문제가 되지 않습니다.

문제는 FreeMarker와 같은 템플릿 엔진을 사용할 때 더 많이 발생합니다. 이러한 엔진은 템플릿 파일이 어디에, 어떻게 위치해야 하는지에 대해 특이한 점이 있습니다. 다행히 일부는 템플릿이 로드되는 방식에 유연성을 제공합니다.

예를 들어, FreeMarker를 사용하면 `MultiTemplateLoader`를 사용하여 다른 위치에서 템플릿을 로드할 수 있습니다:

```kotlin
install(FreeMarker) {
    val customerTemplates = FileTemplateLoader(File("./customer/changeAddress"))
    val loaders = arrayOf<TemplateLoader>(customerTemplates)
    templateLoader = MultiTemplateLoader(loaders)
}
```

분명히 이 코드는 다른 여러 이유로 이상적이지 않지만, 폴더를 순회하며 템플릿을 로드하거나, 실행 전에 뷰를 `resources` 폴더로 복사하는 사용자 지정 빌드 액션을 만드는 방법을 어렵지 않게 알 수 있습니다. 이 문제를 해결하는 방법은 꽤 많이 있습니다.

이 접근 방식의 이점은 기술/인프라 측면과 달리, 동일한 기능과 관련된 모든 것을 기능별로 단일 위치에 그룹화할 수 있다는 것입니다.