[//]: # (title: 모듈)

<tldr>
<p>
<b>코드 예시</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다.</link-summary>

Ktor는 특정 모듈 내에 특정 [라우트](server-routing.md) 세트를 정의하여 애플리케이션을 [구조화](server-application-structure.md)하기 위해 모듈을 사용할 수 있도록 합니다. 모듈은 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html) 클래스의 _[확장 함수](https://kotlinlang.org/docs/extensions.html)_입니다. 아래 예시에서, `module1` 확장 함수는 `/module1` URL 경로로 이루어진 GET 요청을 수락하는 모듈을 정의합니다.

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

애플리케이션에서 모듈을 로드하는 방법은 [서버를 생성하는](server-create-and-configure.topic) 방식에 따라 달라집니다. 이는 `embeddedServer` 함수를 사용하여 코드 내에서 생성하거나 `application.conf` 설정 파일을 사용하는 방식입니다.

> 참고: 지정된 모듈에 설치된 [플러그인](server-plugins.md#install)은 다른 로드된 모듈에도 영향을 미칩니다.

## embeddedServer {id="embedded-server"}

일반적으로, `embeddedServer` 함수는 모듈을 람다 인자(argument)로 암시적으로 받습니다. 
예시는 [코드 내 설정](server-create-and-configure.topic#embedded-server) 섹션에서 확인할 수 있습니다.
또한, 애플리케이션 로직을 별도의 모듈로 추출하고 
이 모듈에 대한 참조를 `module` 파라미터로 전달할 수 있습니다:

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

전체 예시는 다음에서 확인할 수 있습니다: [embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules).

## 설정 파일 {id="hocon"}

서버를 설정하기 위해 `application.conf` 또는 `application.yaml` 파일을 사용하는 경우, `ktor.application.modules` 속성을 사용하여 로드할 모듈을 지정해야 합니다. 

두 개의 패키지에 세 개의 모듈이 정의되어 있다고 가정해 보겠습니다. `com.example` 패키지에 두 개, `org.sample` 패키지에 한 개의 모듈이 있습니다.

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

설정 파일에서 이 모듈들을 참조하려면 정규화된 이름(fully qualified name)을 제공해야 합니다.
정규화된 모듈 이름은 클래스의 정규화된 이름과 확장 함수 이름을 포함합니다.

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

전체 예시는 다음에서 확인할 수 있습니다: [engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules).

## 동시 모듈 로딩

애플리케이션 모듈을 생성할 때 일시 중단 함수(suspendable function)를 사용할 수 있습니다. 이는 애플리케이션 시작 시 이벤트를 비동기적으로 실행할 수 있도록 합니다. 이를 위해 `suspend` 키워드를 추가합니다:

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

또한, 모든 애플리케이션 모듈을 독립적으로 시작할 수 있으므로, 하나의 모듈이 일시 중단되어도 다른 모듈은 차단되지 않습니다.
이를 통해 의존성 주입(dependency injection)을 위한 비순차적 로딩과 경우에 따라 더 빠른 로딩이 가능합니다.

### 설정 옵션

다음 Gradle 설정 속성을 사용할 수 있습니다:

| 속성                                | 유형                        | 설명                                              | 기본값      |
|-----------------------------------------|-----------------------------|----------------------------------------------------------|--------------|
| `ktor.application.startup`              | `sequential` / `concurrent` | 애플리케이션 모듈이 로드되는 방식을 정의합니다. | `sequential` |
| `ktor.application.startupTimeoutMillis` | `Long`                      | 애플리케이션 모듈 로딩 타임아웃 (밀리초 단위) | `100000`     |

### 동시 모듈 로딩 활성화

동시 모듈 로딩을 선택하려면, `gradle.properties` 파일에 다음 속성을 추가합니다:

```none
ktor.application.startup = concurrent
```

의존성 주입의 경우, 다음 모듈들을 나타나는 순서대로 문제없이 로드할 수 있습니다:

```kotlin
suspend fun Application.installEvents() {
    // Suspends until provided
    val kubernetesConnection = dependencies.resolve<KubernetesConnection>()
}

suspend fun Application.loadEventsConnection() {
    dependencies.provide<KubernetesConnection> {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

> 동시 모듈 로딩은 단일 스레드 프로세스입니다. 이는 애플리케이션의 내부 공유 상태(internal shared state)에서 안전하지 않은 컬렉션(unsafe collections)으로 인한 스레딩 문제를 방지하는 데 도움이 됩니다.
>
{style="note"}