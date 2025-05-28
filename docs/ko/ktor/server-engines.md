[//]: # (title: 서버 엔진)

<show-structure for="chapter" depth="3"/>

<link-summary>
네트워크 요청을 처리하는 엔진에 대해 알아보세요.
</link-summary>

Ktor 서버 애플리케이션을 실행하려면 먼저 서버를 [생성](server-create-and-configure.topic)하고 구성해야 합니다.
서버 구성에는 다음과 같은 다양한 설정이 포함됩니다:
- 네트워크 요청을 처리하는 [엔진](#supported-engines);
- 서버 접근에 사용되는 호스트 및 포트 값;
- SSL 설정;
- ... 등이 있습니다.

## 지원되는 엔진 {id="supported-engines"}

아래 표에는 Ktor에서 지원하는 엔진과 지원되는 플랫폼이 나열되어 있습니다:

| 엔진                                  | 플랫폼                                            | HTTP/2 |
|-----------------------------------------|------------------------------------------------------|--------|
| `Netty`                                 | JVM                                                  | ✅      |
| `Jetty`                                 | JVM                                                  | ✅      |
| `Tomcat`                                | JVM                                                  | ✅      |
| `CIO` (Coroutine-based I/O)             | JVM, [Native](server-native.md), [GraalVM](graalvm.md) | ✖️     |
| [ServletApplicationEngine](server-war.md) | JVM                                                  | ✅      |

## 종속성 추가 {id="dependencies"}

원하는 엔진을 사용하기 전에 [빌드 스크립트](server-dependencies.topic)에 해당 종속성을 추가해야 합니다:

* `ktor-server-netty`
* `ktor-server-jetty-jakarta`
* `ktor-server-tomcat-jakarta`
* `ktor-server-cio`

아래는 Netty 종속성을 추가하는 예시입니다:

<var name="artifact_name" value="ktor-server-netty"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 서버 생성 방법 선택 {id="choose-create-server"}
Ktor 서버 애플리케이션은 두 가지 방식으로 [생성하고 실행할 수 있습니다](server-create-and-configure.topic#embedded): [embeddedServer](#embeddedServer)를 사용하여 코드에서 서버 매개변수를 빠르게 전달하는 방식, 또는 [EngineMain](#EngineMain)을 사용하여 외부 `application.conf` 또는 `application.yaml` 파일에서 구성을 로드하는 방식이 있습니다.

### embeddedServer {id="embeddedServer"}

[embeddedServer](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html) 함수는 특정 유형의 엔진을 생성하는 데 사용되는 엔진 팩토리를 허용합니다. 아래 예시에서는 Netty 엔진으로 서버를 실행하고 `8080` 포트에서 수신 대기하기 위해 [Netty](https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty/index.html) 팩토리를 전달합니다:

```kotlin
```

{src="snippets/embedded-server/src/main/kotlin/com/example/Application.kt" include-lines="3-7,13,28-35"}

### EngineMain {id="EngineMain"}

`EngineMain`은 서버를 실행하기 위한 엔진을 나타냅니다. 다음 엔진을 사용할 수 있습니다:

* `io.ktor.server.netty.EngineMain`
* `io.ktor.server.jetty.jakarta.EngineMain`
* `io.ktor.server.tomcat.jakarta.EngineMain`
* `io.ktor.server.cio.EngineMain`

`EngineMain.main` 함수는 선택된 엔진으로 서버를 시작하고 외부 [구성 파일](server-configuration-file.topic)에 지정된 [애플리케이션 모듈](server-modules.md)을 로드하는 데 사용됩니다. 아래 예시에서는 애플리케이션의 `main` 함수에서 서버를 시작합니다:

<tabs>
<tab title="Application.kt">

```kotlin
```

{src="snippets/engine-main/src/main/kotlin/com/example/Application.kt"}

</tab>

<tab title="application.conf">

```shell
```

{src="snippets/engine-main/src/main/resources/application.conf"}

</tab>

<tab title="application.yaml">

```yaml
```

{src="snippets/engine-main-yaml/src/main/resources/application.yaml"}

</tab>
</tabs>

빌드 시스템 작업을 사용하여 서버를 시작해야 하는 경우, 필요한 `EngineMain`을 메인 클래스로 구성해야 합니다:

<tabs group="languages" id="main-class-set-engine-main">
<tab title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
application {
    mainClass.set("io.ktor.server.netty.EngineMain")
}
```

</tab>
<tab title="Gradle (Groovy)" group-key="groovy">

```groovy
mainClassName = "io.ktor.server.netty.EngineMain"
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<properties>
    <main.class>io.ktor.server.netty.EngineMain</main.class>
</properties>
```

</tab>
</tabs>

## 엔진 구성 {id="configure-engine"}

이 섹션에서는 다양한 엔진별 옵션을 지정하는 방법을 살펴보겠습니다.

### 코드에서 {id="embedded-server-configure"}

<include from="server-configuration-code.topic" element-id="embedded-engine-configuration"/>

### 구성 파일에서 {id="engine-main-configure"}

<include from="server-configuration-file.topic" element-id="engine-main-configuration"/>