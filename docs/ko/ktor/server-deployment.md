[//]: # (title: 배포)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

이 토픽에서는 Ktor 애플리케이션을 배포하는 방법에 대해 간략히 살펴보겠습니다.

> 서버 Ktor 애플리케이션의 배포 프로세스를 간소화하려면 [Ktor](https://github.com/ktorio/ktor-build-plugins) Gradle 플러그인을 사용할 수 있으며, 이 플러그인은 다음 기능을 제공합니다:
> - Fat JAR 빌드.
> - 애플리케이션 도커화.

## Ktor 배포의 특징 {id="ktor-specifics"}
서버 Ktor 애플리케이션의 배포 프로세스는 다음 특징에 따라 달라집니다:
*   애플리케이션을 자체 포함 패키지로 배포할지 또는 서블릿 컨테이너 내부에 배포할지 여부.
*   서버를 생성하고 구성하는 데 어떤 접근 방식을 사용하는지.

### 자체 포함 앱 vs 서블릿 컨테이너 {id="self-contained-vs-servlet"}

Ktor를 사용하면 애플리케이션 내에서 원하는 네트워크 [엔진](server-engines.md)(예: Netty, Jetty 또는 Tomcat)으로 서버를 생성하고 시작할 수 있습니다. 이 경우 엔진은 애플리케이션의 일부입니다. 애플리케이션이 엔진 설정, 연결 및 SSL 옵션을 제어합니다. 애플리케이션을 배포하려면 [패키징](#packaging)하여 fat JAR 또는 실행 가능한 JVM 애플리케이션으로 만들 수 있습니다.

위 접근 방식과 달리, 서블릿 컨테이너는 애플리케이션 라이프사이클과 연결 설정을 제어해야 합니다. Ktor는 애플리케이션 제어를 서블릿 컨테이너에 위임하는 특수 `ServletApplicationEngine` 엔진을 제공합니다. 서블릿 컨테이너 내부에 배포하려면 [WAR 아카이브](server-war.md)를 생성해야 합니다.

### 구성: 코드 vs 구성 파일 {id="code-vs-config"}

배포를 위한 자체 포함 Ktor 애플리케이션 구성은 [서버를 생성하고 구성하는](server-create-and-configure.topic) 데 사용된 접근 방식, 즉 코드에서 직접 하거나 [구성 파일](server-configuration-file.topic)을 사용하는 방식에 따라 달라질 수 있습니다. 예를 들어, [호스팅 제공업체](#publishing)는 들어오는 요청을 수신하는 데 사용되는 포트를 지정하도록 요구할 수 있습니다. 이 경우 코드 또는 `application.conf`/`application.yaml` 파일에서 포트를 [구성](server-configuration-file.topic)해야 합니다.

## 패키징 {id="packaging"}

애플리케이션을 배포하기 전에 다음 방법 중 하나로 패키징해야 합니다:

*   **Fat JAR**

    Fat JAR는 모든 코드 종속성을 포함하는 실행 가능한 JAR입니다. Fat JAR를 지원하는 모든 [클라우드 서비스](#publishing)에 배포할 수 있습니다. GraalVM용 네이티브 바이너리를 생성해야 하는 경우에도 Fat JAR가 필요합니다. Fat JAR를 생성하려면 Gradle용 [Ktor](server-fatjar.md) 플러그인 또는 Maven용 [Assembly](maven-assembly-plugin.md) 플러그인을 사용할 수 있습니다.

*   **실행 가능한 JVM 애플리케이션**

    실행 가능한 JVM 애플리케이션은 코드 종속성과 생성된 시작 스크립트를 포함하는 패키징된 애플리케이션입니다. Gradle의 경우 [Application](server-packaging.md) 플러그인을 사용하여 애플리케이션을 생성할 수 있습니다.

*   **WAR**

    [WAR 아카이브](server-war.md)를 사용하면 Tomcat 또는 Jetty와 같은 서블릿 컨테이너 내부에 애플리케이션을 배포할 수 있습니다.

*   **GraalVM**

    Ktor 서버 애플리케이션은 다양한 플랫폼을 위한 네이티브 이미지를 생성하기 위해 [GraalVM](graalvm.md)을 활용할 수 있습니다.

## 컨테이너화 {id="containerizing"}

애플리케이션을 패키징한 후(예: 실행 가능한 JVM 애플리케이션 또는 fat JAR로), 이 애플리케이션이 포함된 [Docker 이미지](docker.md)를 준비할 수 있습니다. 이 이미지는 Kubernetes, Swarm 또는 필요한 클라우드 서비스 컨테이너 인스턴스에서 애플리케이션을 실행하는 데 사용될 수 있습니다.

## 배포 {id="publishing"}

아래 튜토리얼은 Ktor 애플리케이션을 특정 클라우드 제공업체에 배포하는 방법을 보여줍니다:
*   [Google App Engine](google-app-engine.md)
*   [Heroku](heroku.md)
*   [AWS Elastic Beanstalk](elastic-beanstalk.md)

## SSL {id="ssl"}

Ktor 서버가 리버스 프록시(예: Nginx 또는 Apache) 뒤에 있거나 서블릿 컨테이너(Tomcat 또는 Jetty) 내에서 실행되는 경우, SSL 설정은 리버스 프록시 또는 서블릿 컨테이너에 의해 관리됩니다. 필요한 경우 Java KeyStore를 사용하여 Ktor가 [SSL을 직접 제공](server-ssl.md)하도록 구성할 수 있습니다.

> Ktor 애플리케이션이 서블릿 컨테이너 내부에 배포될 때는 SSL 설정이 적용되지 않습니다.