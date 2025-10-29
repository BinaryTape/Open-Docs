[//]: # (title: WAR)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>코드 예시</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war">jetty-war</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war">tomcat-war</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl">tomcat-war-ssl</a>
</p>
</tldr>

<link-summary>
WAR 아카이브를 사용하여 서블릿 컨테이너 내에서 Ktor 애플리케이션을 실행하고 배포하는 방법을 알아보세요.
</link-summary>

Ktor 애플리케이션은 Tomcat 및 Jetty를 포함한 서블릿 컨테이너 내에서 실행하고 배포할 수 있습니다. 서블릿 컨테이너 내에 배포하려면 WAR 아카이브를 생성한 다음, WAR을 지원하는 서버 또는 클라우드 서비스에 배포해야 합니다.

이 토픽에서는 다음 방법을 보여드립니다:
*   서블릿 애플리케이션에서 Ktor를 사용하도록 구성하는 방법;
*   WAR 애플리케이션 실행 및 패키징을 위한 Gretty 및 War 플러그인을 적용하는 방법;
*   Ktor 서블릿 애플리케이션을 실행하는 방법;
*   WAR 아카이브를 생성하고 배포하는 방법.

## 서블릿 애플리케이션에서 Ktor 구성 {id="configure-ktor"}

Ktor를 사용하면 애플리케이션 내에서 바로 원하는 엔진(Netty, Jetty 또는 Tomcat 등)으로 [서버를 생성하고 시작](server-create-and-configure.topic)할 수 있습니다. 이 경우 애플리케이션은 엔진 설정, 연결 및 SSL 옵션을 제어할 수 있습니다.

위 접근 방식과 달리, 서블릿 컨테이너는 애플리케이션 라이프사이클 및 연결 설정을 제어해야 합니다. Ktor는 애플리케이션에 대한 제어 권한을 서블릿 컨테이너에 위임하는 특별한 [ServletApplicationEngine](https://api.ktor.io/ktor-server/ktor-server-servlet/io.ktor.server.servlet/-servlet-application-engine/index.html) 엔진을 제공합니다.

> 참고: Ktor 애플리케이션이 서블릿 컨테이너 내에 배포될 때는 [연결 및 SSL 설정](server-configuration-file.topic)이 적용되지 않습니다. 
> [tomcat-war-ssl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl) 샘플은 Tomcat에서 SSL을 구성하는 방법을 보여줍니다.

### 의존성 추가 {id="add-dependencies"}

서블릿 애플리케이션에서 Ktor를 사용하려면 빌드 스크립트에 `ktor-server-servlet-jakarta` 아티팩트를 포함해야 합니다:

<var name="artifact_name" value="ktor-server-servlet-jakarta"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

Tomcat/Jetty 9.x 또는 이전 버전을 사용하는 경우, 대신 `ktor-server-servlet` 아티팩트를 추가하세요.

> 참고: Ktor 애플리케이션이 서블릿 컨테이너 내에 배포될 때는 별도의 [Jetty 또는 Tomcat 아티팩트](server-engines.md#dependencies)가 필요하지 않습니다.

### 서블릿 구성 {id="configure-servlet"}

애플리케이션에 Ktor 서블릿을 등록하려면 `WEB-INF/web.xml` 파일을 열고 `servlet-class` 속성에 `ServletApplicationEngine`를 할당합니다:

<Tabs>
<TabItem title="Tomcat/Jetty v10.x+">

```xml
<servlet>
    <display-name>KtorServlet</display-name>
    <servlet-name>KtorServlet</servlet-name>
    <servlet-class>io.ktor.server.servlet.jakarta.ServletApplicationEngine</servlet-class>
    <init-param>
        <param-name>io.ktor.ktor.config</param-name>
        <param-value>application.conf</param-value>
    </init-param>
    <async-supported>true</async-supported>
</servlet>
```

</TabItem>
<TabItem title="Tomcat/Jetty v9.x">
<code-block lang="XML" code="&lt;servlet&gt;&#10;    &lt;display-name&gt;KtorServlet&lt;/display-name&gt;&#10;    &lt;servlet-name&gt;KtorServlet&lt;/servlet-name&gt;&#10;    &lt;servlet-class&gt;io.ktor.server.servlet.ServletApplicationEngine&lt;/servlet-class&gt;&#10;    &lt;init-param&gt;&#10;        &lt;param-name&gt;io.ktor.ktor.config&lt;/param-name&gt;&#10;        &lt;param-value&gt;application.conf&lt;/param-value&gt;&#10;    &lt;/init-param&gt;&#10;    &lt;async-supported&gt;true&lt;/async-supported&gt;&#10;&lt;/servlet&gt;"/>
</TabItem>
</Tabs>

그 다음, 이 서블릿의 URL 패턴을 구성합니다:

```xml
<servlet-mapping>
    <servlet-name>KtorServlet</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

## Gretty 구성 {id="configure-gretty"}

> Ktor 3.3.0은 Gretty에서 아직 지원되지 않는 Jetty 12를 필요로 합니다. 개발 또는 배포에 Gretty를 사용하는 경우, Gretty가 Jetty 12 지원을 추가할 때까지 Ktor 3.2.3을 대신 사용하세요.
>
{style="warning"}

[Gretty](https://plugins.gradle.org/plugin/org.gretty) 플러그인을 사용하면 Jetty 및 Tomcat에서 서블릿 애플리케이션을 [실행](#run)할 수 있습니다. 이 플러그인을 설치하려면 `build.gradle.kts` 파일을 열고 `plugins` 블록에 다음 코드를 추가하세요:

```groovy
plugins {
    id("org.gretty") version "4.1.7"
}
```

그런 다음, 다음과 같이 `gretty` 블록에서 이를 구성할 수 있습니다:

<Tabs>
<TabItem title="Jetty">

```groovy
gretty {
    servletContainer = "jetty11"
    contextPath = "/"
    logbackConfigFile = "src/main/resources/logback.xml"
}
```

</TabItem>
<TabItem title="Tomcat">

```groovy
gretty {
    servletContainer = "tomcat10"
    contextPath = "/"
    logbackConfigFile = "src/main/resources/logback.xml"
}
```

</TabItem>
</Tabs>

마지막으로, `run` 태스크를 구성합니다:

```groovy
afterEvaluate {
    tasks.getByName("run") {
        dependsOn("appRun")
    }
}
```

## War 구성 {id="configure-war"}

War 플러그인을 사용하면 WAR 아카이브를 [생성](#generate-war)할 수 있습니다. `build.gradle.kts` 파일의 `plugins` 블록에 다음 줄을 추가하여 설치할 수 있습니다:

```groovy
plugins {
    id("war")
}
```

## 애플리케이션 실행 {id="run"}

[구성된 Gretty 플러그인](#configure-gretty)을 사용하여 `run` 태스크를 통해 서블릿 애플리케이션을 실행할 수 있습니다. 예를 들어, 다음 명령은 [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 예시를 실행합니다:

```Bash
./gradlew :jetty-war:run
```

## WAR 아카이브 생성 및 배포 {id="generate-war"}

[War](#configure-war) 플러그인을 사용하여 애플리케이션으로 WAR 파일을 생성하려면 `war` 태스크를 실행합니다. [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 예시의 경우, 명령은 다음과 같습니다:

```Bash
./gradlew :jetty-war:war
```

`jetty-war.war` 파일은 `build/libs` 디렉토리에 생성됩니다. 생성된 아카이브를 `jetty/webapps` 디렉토리로 복사하여 서블릿 컨테이너 내에 배포할 수 있습니다. 예를 들어, 아래 `Dockerfile`은 생성된 WAR을 Jetty 또는 Tomcat 서블릿 컨테이너 내에서 실행하는 방법을 보여줍니다:

<Tabs>
<TabItem title="Jetty">

```Docker
FROM jetty:11.0.25
EXPOSE 8080:8080
COPY ./build/libs/jetty-war.war/ /var/lib/jetty/webapps
WORKDIR /var/lib/jetty
CMD ["java","-jar","/usr/local/jetty/start.jar"]

```

</TabItem>
<TabItem title="Tomcat">

```Docker
FROM tomcat:10.1.41
EXPOSE 8080:8080
COPY ./build/libs/tomcat-war.war/ /usr/local/tomcat/webapps
WORKDIR /usr/local/tomcat
CMD ["catalina.sh", "run"]

```

</TabItem>
</Tabs>

전체 예시는 다음에서 찾을 수 있습니다: [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 및 [tomcat-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war).