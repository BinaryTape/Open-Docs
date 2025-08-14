[//]: # (title: 모듈)

<tldr>
<p>
<b>코드 예시</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다.</link-summary>

Ktor에서는 모듈을 사용하여 특정 모듈 내부에 특정 [라우트](server-routing.md) 세트를 정의함으로써 애플리케이션을 [구조화](server-application-structure.md)할 수 있습니다. 모듈은 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html) 클래스의 _[확장 함수](https://kotlinlang.org/docs/extensions.html)_입니다. 아래 예시에서 `module1` 확장 함수는 `/module1` URL 경로로 이루어진 GET 요청을 수락하는 모듈을 정의합니다.

[object Promise]

애플리케이션에서 모듈을 로드하는 방법은 [서버를 생성](server-create-and-configure.topic)하는 방식에 따라 다릅니다. 즉, `embeddedServer` 함수를 사용하여 코드 내에서 생성하거나 `application.conf` 설정 파일을 사용하는 방식입니다.

> 특정 모듈에 설치된 [플러그인](server-plugins.md#install)은 다른 로드된 모듈에도 영향을 미칩니다.

## embeddedServer {id="embedded-server"}

일반적으로 `embeddedServer` 함수는 람다 인자로 모듈을 암시적으로 받습니다. [](server-create-and-configure.topic#embedded-server) 섹션에서 예시를 확인할 수 있습니다.
또한 애플리케이션 로직을 별도의 모듈로 추출하고 해당 모듈의 참조를 `module` 파라미터로 전달할 수도 있습니다.

[object Promise]

전체 예시는 여기에서 찾을 수 있습니다: [embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules).

## 설정 파일 {id="hocon"}

`application.conf` 또는 `application.yaml` 파일을 사용하여 서버를 구성하는 경우, `ktor.application.modules` 속성을 사용하여 로드할 모듈을 지정해야 합니다.

`com.example` 패키지에 두 개의 모듈이, `org.sample` 패키지에 하나의 모듈이 정의된 세 개의 모듈이 있다고 가정해 봅시다.

<tabs>
<tab title="Application.kt">

[object Promise]

</tab>
<tab title="Sample.kt">

[object Promise]

</tab>
</tabs>

설정 파일에서 이 모듈들을 참조하려면, 정규화된 이름(fully qualified names)을 제공해야 합니다.
정규화된 모듈 이름은 클래스의 정규화된 이름과 확장 함수 이름을 포함합니다.

<tabs group="config">
<tab title="application.conf" group-key="hocon">

[object Promise]

</tab>
<tab title="application.yaml" group-key="yaml">

[object Promise]

</tab>
</tabs>

전체 예시는 여기에서 찾을 수 있습니다: [engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules).

## 동시 모듈 로드

애플리케이션 모듈을 생성할 때 정지 함수(suspendable functions)를 사용할 수 있습니다. 이를 통해 애플리케이션 시작 시 이벤트가 비동기적으로 실행될 수 있습니다. 그렇게 하려면 `suspend` 키워드를 추가합니다:

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

또한 모든 애플리케이션 모듈을 독립적으로 시작할 수 있으므로, 하나가 정지되더라도 다른 모듈은 차단되지 않습니다.
이를 통해 의존성 주입을 위한 비순차적 로딩과, 경우에 따라 더 빠른 로딩이 가능합니다.

### 구성 옵션

다음 Gradle 구성 속성을 사용할 수 있습니다:

| Property                                | Type                        | Description                                          | Default      |
|-----------------------------------------|-----------------------------|------------------------------------------------------|--------------|
| `ktor.application.startup`              | `sequential` / `concurrent` | 애플리케이션 모듈이 로드되는 방식을 정의합니다       | `sequential` |
| `ktor.application.startupTimeoutMillis` | `Long`                      | 애플리케이션 모듈 로드 시간 초과(밀리초) | `100000`     |

### 동시 모듈 로드 활성화

동시 모듈 로드를 활성화하려면 `gradle.properties` 파일에 다음 속성을 추가하세요:

```none
ktor.application.startup = concurrent
```

의존성 주입의 경우, 다음 모듈을 나타나는 순서대로 문제없이 로드할 수 있습니다:

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

> 동시 모듈 로드는 단일 스레드 프로세스입니다. 이는 애플리케이션의 내부 공유 상태에서 안전하지 않은 컬렉션으로 인해 발생할 수 있는 스레딩 문제를 방지하는 데 도움이 됩니다.
>
{style="note"}