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
WAR 아카이브를 사용하여 서블릿 컨테이너 내에서 Ktor 애플리케이션을 실행하고 배포하는 방법을 알아봅니다.
</link-summary>

Ktor 애플리케이션은 Tomcat 및 Jetty를 포함하는 서블릿 컨테이너 내에서 실행하고 배포할 수 있습니다. 서블릿 컨테이너 내에 배포하려면 WAR 아카이브를 생성한 다음, WAR를 지원하는 서버 또는 클라우드 서비스에 배포해야 합니다.

이 토픽에서는 다음 방법을 보여드립니다:
* 서블릿 애플리케이션에서 Ktor를 사용하도록 구성하는 방법;
* WAR 애플리케이션 실행 및 패키징을 위해 Gretty 및 War 플러그인을 적용하는 방법;
* Ktor 서블릿 애플리케이션을 실행하는 방법;
* WAR 아카이브를 생성하고 배포하는 방법.

## 서블릿 애플리케이션에서 Ktor 구성하기 {id="configure-ktor"}

Ktor는 애플리케이션 내에서 원하는 엔진(예: Netty, Jetty, Tomcat)으로 [서버를 생성하고 시작할 수 있도록](server-create-and-configure.topic) 합니다. 이 경우, 애플리케이션은 엔진 설정, 연결 및 SSL 옵션을 제어할 수 있습니다.

위의 접근 방식과 달리, 서블릿 컨테이너는 애플리케이션 라이프사이클 및 연결 설정을 제어해야 합니다. Ktor는 애플리케이션 제어를 서블릿 컨테이너에 위임하는 특별한 [ServletApplicationEngine](https://api.ktor.io/ktor-server/ktor-server-servlet/io.ktor.server.servlet/-servlet-application-engine/index.html) 엔진을 제공합니다.

> Ktor 애플리케이션이 서블릿 컨테이너 내에 배포될 때 [연결 및 SSL 설정](server-configuration-file.topic)은 적용되지 않습니다. 
> [tomcat-war-ssl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war-ssl) 샘플은 Tomcat에서 SSL을 구성하는 방법을 보여줍니다.

### 의존성 추가 {id="add-dependencies"}

서블릿 애플리케이션에서 Ktor를 사용하려면 `ktor-server-servlet-jakarta` 아티팩트를 빌드 스크립트에 포함해야 합니다:

<var name="artifact_name" value="ktor-server-servlet-jakarta"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

Tomcat/Jetty 9.x 또는 이전 버전을 사용하는 경우, 대신 `ktor-server-servlet` 아티팩트를 추가하세요.

> Ktor 애플리케이션이 서블릿 컨테이너 내에 배포될 때 별도의 [Jetty 또는 Tomcat 아티팩트](server-engines.md#dependencies)는 필요하지 않습니다.

### 서블릿 구성하기 {id="configure-servlet"}

애플리케이션에 Ktor 서블릿을 등록하려면 `WEB-INF/web.xml` 파일을 열고 `ServletApplicationEngine`을 `servlet-class` 속성에 할당하세요:

<tabs>
<tab title="Tomcat/Jetty v10.x 이상">

```xml
```
{src="snippets/jetty-war/src/main/webapp/WEB-INF/web.xml" include-lines="7-16"}

</tab>
<tab title="Tomcat/Jetty v9.x">
<code-block lang="XML">
<![CDATA[
<servlet>
    <display-name>KtorServlet</display-name>
    <servlet-name>KtorServlet</servlet-name>
    <servlet-class>io.ktor.server.servlet.ServletApplicationEngine</servlet-class>
    <init-param>
        <param-name>io.ktor.ktor.config</param-name>
        <param-value>application.conf</param-value>
    </init-param>
    <async-supported>true</async-supported>
</servlet>
]]>
</code-block>
</tab>
</tabs>

그런 다음, 이 서블릿의 URL 패턴을 구성하세요:

```xml
```
{src="snippets/jetty-war/src/main/webapp/WEB-INF/web.xml" include-lines="18-21"}

## Gretty 구성하기 {id="configure-gretty"}

[Gretty](https://plugins.gradle.org/plugin/org.gretty) 플러그인을 사용하면 Jetty 및 Tomcat에서 서블릿 애플리케이션을 [실행](#run)할 수 있습니다. 이 플러그인을 설치하려면 `build.gradle.kts` 파일을 열고 `plugins` 블록에 다음 코드를 추가하세요:

```groovy
```
{src="snippets/jetty-war/build.gradle.kts" include-lines="5,8,10"}

그런 다음, `gretty` 블록에서 다음과 같이 구성할 수 있습니다:

<tabs>
<tab title="Jetty">

```groovy
```
{src="snippets/jetty-war/build.gradle.kts" include-lines="12-16"}

</tab>
<tab title="Tomcat">

```groovy
```
{src="snippets/tomcat-war/build.gradle.kts" include-lines="12-16"}

</tab>
</tabs>

마지막으로, `run` 태스크를 구성하세요:

```groovy
```
{src="snippets/jetty-war/build.gradle.kts" include-lines="32-36"}

## War 구성하기 {id="configure-war"}

War 플러그인을 사용하면 WAR 아카이브를 [생성](#generate-war)할 수 있습니다. 이 플러그인을 설치하려면 `build.gradle.kts` 파일의 `plugins` 블록에 다음 줄을 추가하면 됩니다:

```groovy
```
{src="snippets/jetty-war/build.gradle.kts" include-lines="5,9-10"}

## 애플리케이션 실행 {id="run"}

[구성된 Gretty 플러그인](#configure-gretty)이 있는 서블릿 애플리케이션을 `run` 태스크를 사용하여 실행할 수 있습니다. 예를 들어, 다음 명령은 [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 예시를 실행합니다:

```Bash
./gradlew :jetty-war:run
```

## WAR 아카이브 생성 및 배포 {id="generate-war"}

[War](#configure-war) 플러그인을 사용하여 애플리케이션이 포함된 WAR 파일을 생성하려면 `war` 태스크를 실행하세요. [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 예시의 경우, 명령은 다음과 같습니다:

```Bash
./gradlew :jetty-war:war
```

`jetty-war.war`는 `build/libs` 디렉터리에 생성됩니다. 생성된 아카이브를 `jetty/webapps` 디렉터리에 복사하여 서블릿 컨테이너 내에 배포할 수 있습니다. 예를 들어, 아래 `Dockerfile`은 생성된 WAR를 Jetty 또는 Tomcat 서블릿 컨테이너 내에서 실행하는 방법을 보여줍니다:

<tabs>
<tab title="Jetty">

```Docker
```
{src="snippets/jetty-war/Dockerfile"}

</tab>
<tab title="Tomcat">

```Docker
```
{src="snippets/tomcat-war/Dockerfile"}

</tab>
</tabs>

전체 예시는 여기에서 찾을 수 있습니다: [jetty-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jetty-war) 및 [tomcat-war](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tomcat-war).