[//]: # (title: 서버 엔진)

<show-structure for="chapter" depth="3"/>

<link-summary>
네트워크 요청을 처리하는 엔진에 대해 알아보세요.
</link-summary>

Ktor 서버 애플리케이션을 실행하려면 먼저 서버를 [생성](server-create-and-configure.topic)하고 구성해야 합니다.
서버 구성에는 다양한 설정이 포함됩니다.
- 네트워크 요청 처리를 위한 [엔진](#supported-engines)
- 서버 접근에 사용되는 호스트 및 포트 값
- SSL 설정
- ... 등

## 지원되는 엔진 {id="supported-engines"}

아래 표는 Ktor에서 지원하는 엔진과 지원되는 플랫폼을 나열합니다.

| 엔진                                  | 플랫폼                                            | HTTP/2 |
|-----------------------------------------|------------------------------------------------------|--------|
| `Netty`                                 | JVM                                                  | ✅      |
| `Jetty`                                 | JVM                                                  | ✅      |
| `Tomcat`                                | JVM                                                  | ✅      |
| `CIO` (Coroutine-based I/O)             | JVM, [Native](server-native.md), [GraalVM](graalvm.md) | ✖️     |
| [ServletApplicationEngine](server-war.md) | JVM                                                  | ✅      |

## 의존성 추가 {id="dependencies"}

원하는 엔진을 사용하기 전에 해당 의존성을 [빌드 스크립트](server-dependencies.topic)에 추가해야 합니다.

* `ktor-server-netty`
* `ktor-server-jetty-jakarta`
* `ktor-server-tomcat-jakarta`
* `ktor-server-cio`

아래는 Netty에 대한 의존성을 추가하는 예시입니다.

<var name="artifact_name" value="ktor-server-netty"/>

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## 서버 생성 방법 선택 {id="choose-create-server"}
Ktor 서버 애플리케이션은 [두 가지 방법](server-create-and-configure.topic#embedded)으로 생성 및 실행할 수 있습니다. 코드에서 서버 매개변수를 빠르게 전달하기 위해 [embeddedServer](#embeddedServer)를 사용하거나, 외부 `application.conf` 또는 `application.yaml` 파일에서 구성을 로드하기 위해 [EngineMain](#EngineMain)을 사용할 수 있습니다.

### embeddedServer {id="embeddedServer"}

[embeddedServer](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/embedded-server.html) 함수는 특정 유형의 엔진을 생성하는 데 사용되는 엔진 팩토리를 허용합니다. 아래 예시에서는 Netty 엔진으로 서버를 실행하고 `8080` 포트에서 수신하기 위해 [Netty](https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty/index.html) 팩토리를 전달합니다.

[object Promise]

### EngineMain {id="EngineMain"}

`EngineMain`은 서버 실행을 위한 엔진을 나타냅니다. 다음 엔진을 사용할 수 있습니다.

* `io.ktor.server.netty.EngineMain`
* `io.ktor.server.jetty.jakarta.EngineMain`
* `io.ktor.server.tomcat.jakarta.EngineMain`
* `io.ktor.server.cio.EngineMain`

`EngineMain.main` 함수는 선택된 엔진으로 서버를 시작하고 외부 [설정 파일](server-configuration-file.topic)에 지정된 [애플리케이션 모듈](server-modules.md)을 로드하는 데 사용됩니다. 아래 예시에서는 애플리케이션의 `main` 함수에서 서버를 시작합니다.

<tabs>
<tab title="Application.kt">

[object Promise]

</tab>

<tab title="application.conf">

[object Promise]

</tab>

<tab title="application.yaml">

[object Promise]

</tab>
</tabs>

빌드 시스템 작업을 사용하여 서버를 시작해야 하는 경우, 필요한 `EngineMain`을 메인 클래스로 구성해야 합니다.

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

        <p>
            <code>embeddedServer</code> 함수는 <code>configure</code> 매개변수를 사용하여 엔진별 옵션을 전달할 수 있도록 합니다. 이 매개변수에는 모든 엔진에 공통적이며
            <a href="https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-application-engine/-configuration/index.html">
                ApplicationEngine.Configuration
            </a>
            클래스에 의해 노출되는 옵션이 포함됩니다.
        </p>
        <p>
            아래 예시는 <code>Netty</code> 엔진을 사용하여 서버를 구성하는 방법을 보여줍니다. <code>configure</code> 블록 내에서 호스트와 포트를 지정하기 위한 <code>connector</code>를 정의하고 다양한 서버 매개변수를 사용자 정의합니다.
        </p>
        [object Promise]
        <p>
            <code>connectors.add()</code> 메서드는 지정된 호스트(<code>127.0.0.1</code>)와 포트(<code>8080</code>)를 가진 커넥터를 정의합니다.
        </p>
        <p>이러한 옵션 외에도 다른 엔진별 속성을 구성할 수 있습니다.</p>
        <chapter title="Netty" id="netty-code">
            <p>
                Netty 특정 옵션은
                <a href="https://api.ktor.io/ktor-server/ktor-server-netty/io.ktor.server.netty/-netty-application-engine/-configuration/index.html">
                    NettyApplicationEngine.Configuration
                </a>
                클래스에 의해 노출됩니다.
            </p>
            [object Promise]
        </chapter>
        <chapter title="Jetty" id="jetty-code">
            <p>
                Jetty 특정 옵션은
                <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/index.html">
                    JettyApplicationEngineBase.Configuration
                </a>
                클래스에 의해 노출됩니다.
            </p>
            <p>Jetty 서버는
                <a href="https://api.ktor.io/ktor-server/ktor-server-jetty-jakarta/io.ktor.server.jetty.jakarta/-jetty-application-engine-base/-configuration/configure-server.html">
                    configureServer
                </a>
                블록 내에서 구성할 수 있으며, 이 블록은
                <a href="https://www.eclipse.org/jetty/javadoc/jetty-11/org/eclipse/jetty/server/Server.html">Server</a>
                인스턴스에 대한 접근을 제공합니다.
            </p>
            <p>
                <code>idleTimeout</code> 속성을 사용하여 연결이 닫히기 전에 유휴 상태로 있을 수 있는 시간 길이를 지정하세요.
            </p>
            [object Promise]
        </chapter>
        <chapter title="CIO" id="cio-code">
            <p>CIO 특정 옵션은
                <a href="https://api.ktor.io/ktor-server/ktor-server-cio/io.ktor.server.cio/-c-i-o-application-engine/-configuration/index.html">
                    CIOApplicationEngine.Configuration
                </a>
                클래스에 의해 노출됩니다.
            </p>
            [object Promise]
        </chapter>
        <chapter title="Tomcat" id="tomcat-code">
            <p>Tomcat을 엔진으로 사용하는 경우,
                <a href="https://api.ktor.io/ktor-server/ktor-server-tomcat-jakarta/io.ktor.server.tomcat.jakarta/-tomcat-application-engine/-configuration/configure-tomcat.html">
                    configureTomcat
                </a>
                속성을 사용하여 구성할 수 있으며, 이 속성은
                <a href="https://tomcat.apache.org/tomcat-10.1-doc/api/org/apache/catalina/startup/Tomcat.html">Tomcat</a>
                인스턴스에 대한 접근을 제공합니다.
            </p>
            [object Promise]
        </chapter>
        

### 설정 파일에서 {id="engine-main-configure"}

            <p>
                <code>EngineMain</code>을 사용하는 경우, <code>ktor.deployment</code> 그룹 내에서 모든 엔진에 공통적인 옵션을 지정할 수 있습니다.
            </p>
            <tabs group="config">
                <tab title="application.conf" group-key="hocon" id="engine-main-conf">
                    [object Promise]
                </tab>
                <tab title="application.yaml" group-key="yaml" id="engine-main-yaml">
                    [object Promise]
                </tab>
            </tabs>
            <chapter title="Netty" id="netty-file">
                <p>
                    또한 <code>ktor.deployment</code> 그룹 내의 설정 파일에서 Netty 특정 옵션을 구성할 수 있습니다.
                </p>
                <tabs group="config">
                    <tab title="application.conf" group-key="hocon" id="application-conf-1">
                        [object Promise]
                    </tab>
                    <tab title="application.yaml" group-key="yaml" id="application-yaml-1">
                        [object Promise]
                    </tab>
                </tabs>
            </chapter>