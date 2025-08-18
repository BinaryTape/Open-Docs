[//]: # (title: 실행)

<show-structure for="chapter" depth="2"/>

<link-summary>
Ktor 서버 애플리케이션을 실행하는 방법을 알아보세요.
</link-summary>

Ktor 서버 애플리케이션을 실행할 때 다음 세부 사항을 고려해야 합니다:
*   [서버를 생성하는](server-create-and-configure.topic) 방식은 [패키징된 Ktor 애플리케이션](#package)을 실행할 때 명령줄 인수를 전달하여 서버 파라미터를 재정의할 수 있는지 여부에 영향을 미칩니다.
*   Gradle/Maven 빌드 스크립트는 [EngineMain](server-create-and-configure.topic#engine-main)을 사용하여 서버를 시작할 때 메인 클래스 이름을 지정해야 합니다.
*   [서블릿 컨테이너](server-war.md) 내부에서 애플리케이션을 실행하려면 특정 서블릿 구성이 필요합니다.

이 토픽에서는 이러한 구성 세부 사항을 살펴보고 IntelliJ IDEA 및 패키징된 애플리케이션으로 Ktor 애플리케이션을 실행하는 방법을 보여드리겠습니다.

## 구성 세부 사항 {id="specifics"}

### 구성: 코드 vs 구성 파일 {id="code-vs-config"}

Ktor 애플리케이션 실행은 [서버를 생성하는](server-create-and-configure.topic) 데 사용한 방식, 즉 `embeddedServer` 또는 `EngineMain`에 따라 달라집니다.
*   `embeddedServer`의 경우, 서버 파라미터(예: 호스트 주소 및 포트)는 코드에 구성되므로 애플리케이션 실행 시 이 파라미터들을 변경할 수 없습니다.
*   `EngineMain`의 경우, Ktor는 `HOCON` 또는 `YAML` 형식을 사용하는 외부 파일에서 구성을 로드합니다. 이 방식을 사용하면 명령줄에서 [패키징된 애플리케이션](#package)을 실행하고 해당 [명령줄 인수](server-configuration-file.topic#command-line)를 전달하여 필요한 서버 파라미터를 재정의할 수 있습니다.

### EngineMain 시작: Gradle 및 Maven 세부 사항 {id="gradle-maven"}

`EngineMain`을 사용하여 서버를 생성하는 경우, 원하는 [엔진](server-engines.md)으로 서버를 시작하기 위한 `main` 함수를 지정해야 합니다.
아래 [예시](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)는 Netty 엔진으로 서버를 실행하는 데 사용되는 `main` 함수를 보여줍니다.

```kotlin
fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)
```

`main` 함수 내에서 엔진을 구성하지 않고 Gradle/Maven을 사용하여 Ktor 서버를 실행하려면 빌드 스크립트에서 다음과 같이 메인 클래스 이름을 지정해야 합니다.

<TabItem title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
application {
    mainClass.set("io.ktor.server.netty.EngineMain")
}
```

</TabItem>
<TabItem title="Gradle (Groovy)" group-key="groovy">

```groovy
mainClassName = "io.ktor.server.netty.EngineMain"
```

</TabItem>
<TabItem title="Maven" group-key="maven">

```xml
<properties>
    <main.class>io.ktor.server.netty.EngineMain</main.class>
</properties>
```

</TabItem>

### WAR 세부 사항

Ktor를 사용하면 애플리케이션 내에서 원하는 엔진(예: Netty, Jetty, Tomcat)으로 [서버를 생성하고 시작](server-create-and-configure.topic)할 수 있습니다. 이 경우, 애플리케이션이 엔진 설정, 연결 및 SSL 옵션을 제어합니다.

이 방식과 달리 서블릿 컨테이너는 애플리케이션 라이프사이클 및 연결 설정을 제어해야 합니다. Ktor는 애플리케이션 제어권을 서블릿 컨테이너에 위임하는 특별한 `ServletApplicationEngine` 엔진을 제공합니다. 애플리케이션을 구성하는 방법은 [War 구성](server-war.md#configure-war)에서 확인할 수 있습니다.

## 애플리케이션 실행 {id="run"}
> 개발 중에 서버를 재시작하는 데 시간이 걸릴 수 있습니다. Ktor는 코드 변경 시 애플리케이션 클래스를 다시 로드하고 빠른 피드백 루프를 제공하는 [자동 재로드(Auto-reload)](server-auto-reload.topic)를 사용하여 이러한 제한을 극복할 수 있도록 합니다.

### Gradle/Maven을 사용하여 애플리케이션 실행 {id="gradle-maven-run"}

Gradle 또는 Maven을 사용하여 Ktor 애플리케이션을 실행하려면 해당 플러그인을 사용하세요.
*   Gradle용 [Application](server-packaging.md) 플러그인. [네이티브 서버(Native server)](server-native.md)의 경우, [Kotlin Multiplatform](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.multiplatform) 플러그인을 사용하세요.
*   Maven용 [Exec](https://www.mojohaus.org/exec-maven-plugin/) 플러그인.

> IntelliJ IDEA에서 Ktor 애플리케이션을 실행하는 방법을 알아보려면 IntelliJ IDEA 문서의 [Ktor 애플리케이션 실행](https://www.jetbrains.com/help/idea/ktor.html#run_ktor_app) 섹션을 참조하세요.

### 패키징된 애플리케이션 실행 {id="package"}

애플리케이션을 배포하기 전에 [패키징](server-deployment.md#packaging) 섹션에 설명된 방법 중 하나로 패키징해야 합니다.
결과 패키지에서 Ktor 애플리케이션을 실행하는 것은 패키지 유형에 따라 다르며 다음과 같을 수 있습니다.
*   구성된 포트를 재정의하여 단일 JAR(fat JAR)로 패키징된 Ktor 서버를 실행하려면 다음 명령을 실행하세요.
   ```Bash
   java -jar sample-app.jar -port=8080
   ```
*   Gradle [Application](server-packaging.md) 플러그인을 사용하여 패키징된 애플리케이션을 실행하려면 해당 실행 파일을 실행하세요.

   <Tabs group="os">
   <TabItem title="Linux/macOS" group-key="unix">
   <code-block code="./ktor-sample"/>
   </TabItem>
   <TabItem title="Windows" group-key="windows">
   <code-block code="ktor-sample.bat"/>
   </TabItem>
   </Tabs>
  
*   서블릿 Ktor 애플리케이션을 실행하려면 [Gretty](server-war.md#run) 플러그인의 `run` 태스크를 사용하세요.