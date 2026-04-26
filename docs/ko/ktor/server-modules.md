[//]: # (title: 모듈)

<tldr>
<p>
<b>코드 예제</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>모듈을 사용하면 라우트를 그룹화하여 애플리케이션의 구조를 설계할 수 있습니다.</link-summary>
<show-structure for="chapter" depth="2"/>

Ktor를 사용하면 특정 모듈 내에 특정 [라우트](server-routing.md) 세트를 정의하여 애플리케이션의 구조를 구성할 수 있습니다. 모듈은 라우트를 설정하고, 플러그인을 설치하며, 서비스를 구성하는 `Application`의 확장 함수입니다. 모듈을 사용하면 다음과 같은 이점이 있습니다:

- 관련된 라우트와 로직을 함께 그룹화합니다.
- 기능이나 도메인을 격리된 상태로 유지합니다.
- 더 쉬운 테스트와 모듈식 배포를 가능하게 합니다.

> 아키텍처 패턴 및 모듈 구성에 대한 자세한 내용은 [애플리케이션 구조](server-application-structure.md)를 참조하세요.

## 모듈 정의하기 {id="defining-a-module"}

모듈은 [`Application`](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application/index.html) 클래스의 _[확장 함수(extension function)](https://kotlinlang.org/docs/extensions.html)_입니다. 아래 예제에서 `module1` 확장 함수는 `/module1` URL 경로로 들어오는 GET 요청을 처리하는 모듈을 정의합니다.

```kotlin
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.module1() {
    routing {
        get("/module1") {
            call.respondText("Hello from 'module1'!")
        }
    }
}
```

애플리케이션에서 모듈을 로드하는 방법은 [서버 생성 방식](server-create-and-configure.topic)에 따라 달라집니다: `embeddedServer` 함수를 사용하는 코드 방식 또는 `application.conf` 설정 파일을 사용하는 방식이 있습니다.

> 특정 모듈에 설치된 [플러그인](server-plugins.md#install)은 로드된 다른 모듈에도 적용된다는 점에 유의하세요.

## 모듈 로드하기 {id="loading-modules"}
### 임베디드 서버 {id="embedded-server"}

일반적으로 `embeddedServer` 함수는 람다 인자를 통해 암시적으로 모듈을 허용합니다. 
[코드를 통한 구성](server-create-and-configure.topic#embedded-server) 섹션에서 예제를 확인할 수 있습니다.
또한 애플리케이션 로직을 별도의 모듈로 추출하고 이 모듈에 대한 참조를 `module` 매개변수로 전달할 수도 있습니다:

```kotlin
package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main() {
    embeddedServer(Netty, port = 8080, module = Application::module).start(wait = true)
}

fun Application.module() {
    module1()
    module2()
}

fun Application.module1() {
    routing {
        get("/module1") {
            call.respondText("Hello from 'module1'!")
        }
    }
}

fun Application.module2() {
    routing {
        get("/module2") {
            call.respondText("Hello from 'module2'!")
        }
    }
}

```

전체 예제는 여기에서 확인할 수 있습니다: [embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/embedded-server-modules).

### 설정 파일 {id="hocon"}

서버를 구성하기 위해 `application.conf` 또는 `application.yaml` 파일을 사용하는 경우, `ktor.application.modules` 속성을 사용하여 로드할 모듈을 지정해야 합니다.

두 개의 패키지에 세 개의 모듈이 정의되어 있다고 가정해 보겠습니다: `com.example` 패키지에 두 개의 모듈, `org.sample` 패키지에 한 개의 모듈이 있습니다.

<Tabs>
<TabItem title="Application.kt">

```kotlin
package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module1() {
    routing {
        get("/module1") {
            call.respondText("Hello from 'module1'!")
        }
    }
}

fun Application.module2() {
    routing {
        get("/module2") {
            call.respondText("Hello from 'module2'!")
        }
    }
}

```

</TabItem>
<TabItem title="Sample.kt">

```kotlin
package org.sample

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.module3() {
    routing {
        get("/module3") {
            call.respondText("Hello from 'module3'!")
        }
    }
}

```

</TabItem>
</Tabs>

설정 파일에서 이러한 모듈을 참조하려면 정규화된 이름(fully qualified names)을 제공해야 합니다.
모듈의 정규화된 이름에는 클래스의 정규화된 이름과 확장 함수 이름이 포함됩니다.

<Tabs group="config">
<TabItem title="application.conf" group-key="hocon">

```shell
ktor {
    application {
        modules = [ com.example.ApplicationKt.module1,
                    com.example.ApplicationKt.module2,
                    org.sample.SampleKt.module3 ]
    }
}
```

</TabItem>
<TabItem title="application.yaml" group-key="yaml">

```yaml
ktor:
    application:
        modules:
            - com.example.ApplicationKt.module1
            - com.example.ApplicationKt.module2
            - org.sample.SampleKt.module3
```

</TabItem>
</Tabs>

전체 예제는 여기에서 확인할 수 있습니다: [engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/engine-main-modules).

## 모듈 의존성

모듈은 종종 공통 서비스, 리포지토리 또는 구성을 공유해야 합니다. 모듈 내부에서 의존성을 생성하기보다 주입하는 방식이 테스트 가능성과 유연성을 향상시킵니다. Ktor는 프로젝트의 복잡성에 따라 여러 가지 접근 방식을 제공합니다.

### 매개변수를 통한 의존성 전달

의존성을 전달하는 가장 간단한 방법은 모듈 함수의 매개변수로 선언하는 것입니다:

```kotlin
fun main() {
    embeddedServer(CIO, port = 8080, host = "0.0.0.0") {
        // 의존성 인스턴스화
        val myService = MyService(property<MyServiceConfig>())
        // 매개변수로 모듈에 주입
        routingModule(myService)
        schedulingModule(myService)
    }.start(wait = true)
}
```

이 방식은 소규모 또는 중형 애플리케이션에서 잘 작동하며 의존성 관계를 명확하게 유지합니다. 하지만 모듈이 컴파일 타임에 강하게 결합되어 런타임에 쉽게 교체할 수 없다는 단점이 있습니다.

### 애플리케이션 속성 사용

모든 모듈에서 사용할 수 있는 타입 세이프(type-safe) 맵인 `Application.attributes`를 사용할 수 있습니다:

```kotlin
val customerServiceKey = AttributeKey<CustomerService>("CustomerService")

fun Application.servicesModule() {
    attributes[customerServiceKey] = CustomerService()
}

fun Application.customerModule() {
    val service = attributes[customerServiceKey]
    routing {
        get("/customers") { call.respond(service.all()) }
    }
}
```

이 방식은 모듈 간의 직접적인 참조를 피함으로써 느슨한 결합을 만듭니다.

### 의존성 주입 사용 {id="dependency_injection"}

Ktor에는 [의존성 주입(DI) 플러그인](server-dependency-injection.md)이 포함되어 있어, 경량 컨테이너를 사용하여 Ktor 애플리케이션 내부에서 직접 의존성을 선언하고 해결할 수 있습니다.

## 동시성 모듈 {id="concurrent-modules"}

애플리케이션 모듈을 생성할 때 중단 가능한 함수(suspendable functions)를 사용할 수 있습니다. 이를 통해 애플리케이션 시작 시 이벤트가 비동기적으로 실행될 수 있습니다. 이를 위해 `suspend` 키워드를 추가합니다:

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

또한 모든 애플리케이션 모듈을 독립적으로 실행할 수 있으므로, 하나의 모듈이 중단(suspended)되더라도 다른 모듈이 차단되지 않습니다. 이를 통해 의존성 주입을 위한 비순차적 로딩이 가능하며, 경우에 따라 더 빠른 로딩이 가능해집니다.

### 구성 옵션

다음 구성 속성들을 사용할 수 있습니다:

| 속성                                      | 타입                          | 설명                                         | 기본값          |
|-----------------------------------------|-----------------------------|--------------------------------------------|--------------|
| `ktor.application.startup`              | `sequential` / `concurrent` | 애플리케이션 모듈이 로드되는 방식을 정의합니다.                | `sequential` |
| `ktor.application.startupTimeoutMillis` | `Long`                      | 애플리케이션 모듈 로딩 제한 시간 (밀리초 단위)               | `10000`      |

### 동시성 모듈 로딩 활성화

동시성 모듈 로딩을 사용하려면 서버 설정 파일에 다음을 추가하세요:

```yaml
# application.conf

ktor {
    application {
        startup = concurrent
    }
}
```

의존성 주입의 경우, 다음과 같은 모듈들을 순서와 상관없이 문제없이 로드할 수 있습니다:

```kotlin
suspend fun Application.installEvents() {
    // 제공될 때까지 중단됨
    val kubernetesConnection = dependencies.resolve<KubernetesConnection>()
}

suspend fun Application.loadEventsConnection() {
    dependencies.provide<KubernetesConnection> {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

> 동시성 모듈 로딩은 단일 스레드 프로세스입니다. 이는 애플리케이션의 내부 공유 상태에서 안전하지 않은 컬렉션으로 인한 스레딩 문제를 방지하는 데 도움이 됩니다.
>
{style="note"}