[//]: # (title: 실행)

<show-structure for="chapter" depth="2"/>

<link-summary>
Ktor 서버 애플리케이션을 실행하는 방법을 알아봅니다.
</link-summary>

Ktor 서버 애플리케이션을 실행할 때 다음 세부 사항을 고려하세요:
* [서버를 생성](server-create-and-configure.topic)하는 방식에 따라 [패키징된 Ktor 애플리케이션](#package)을 실행할 때 명령줄 인자를 전달하여 서버 매개변수를 재정의할 수 있는지 여부가 달라집니다.
* Gradle/Maven 빌드 스크립트는 [EngineMain](server-create-and-configure.topic#engine-main)을 사용하여 서버를 시작할 때 메인 클래스 이름을 지정해야 합니다.
* 애플리케이션을 [서블릿 컨테이너](server-war.md) 내에서 실행하려면 특정 서블릿 설정이 필요합니다.

이 토픽에서는 이러한 설정 세부 사항을 살펴보고, IntelliJ IDEA에서 Ktor 애플리케이션을 실행하는 방법과 패키징된 애플리케이션으로 실행하는 방법을 보여드리겠습니다.

## 설정 세부 사항 {id="specifics"}

### 설정: 코드 대 설정 파일 {id="code-vs-config"}

Ktor 애플리케이션 실행은 [서버를 생성](server-create-and-configure.topic)하는 방식(`embeddedServer` 또는 `EngineMain`)에 따라 달라집니다:
* `embeddedServer`의 경우, 서버 매개변수(예: 호스트 주소 및 포트)는 코드 내에서 설정되므로, 애플리케이션 실행 시 이 매개변수들을 변경할 수 없습니다.
* `EngineMain`의 경우, Ktor는 `HOCON` 또는 `YAML` 형식을 사용하는 외부 파일에서 설정을 로드합니다. 이 방식을 사용하면 명령줄에서 [패키징된 애플리케이션](#package)을 실행하고 해당 [명령줄 인자](server-configuration-file.topic#command-line)를 전달하여 필요한 서버 매개변수를 재정의할 수 있습니다.

### EngineMain 시작: Gradle 및 Maven 세부 사항 {id="gradle-maven"}

`EngineMain`을 사용하여 서버를 생성하는 경우, 원하는 [엔진](server-engines.md)으로 서버를 시작하기 위한 `main` 함수를 지정해야 합니다.
다음 [예제](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)는 Netty 엔진으로 서버를 실행하는 데 사용되는 `main` 함수를 보여줍니다:

```kotlin
```
{src="snippets/engine-main/src/main/kotlin/com/example/Application.kt" include-lines="7"}

`main` 함수 내에 엔진을 설정하지 않고 Gradle/Maven을 사용하여 Ktor 서버를 실행하려면, 빌드 스크립트에 메인 클래스 이름을 다음과 같이 지정해야 합니다:

<include from="server-engines.md" element-id="main-class-set-engine-main"/>

### WAR 세부 사항

Ktor를 사용하면 애플리케이션 내에서 원하는 엔진(예: Netty, Jetty 또는 Tomcat)으로 [서버를 생성하고 시작](server-create-and-configure.topic)할 수 있습니다. 이 경우, 애플리케이션이 엔진 설정, 연결 및 SSL 옵션을 제어합니다.

이 접근 방식과 대조적으로, 서블릿 컨테이너는 애플리케이션 라이프사이클과 연결 설정을 제어해야 합니다. Ktor는 애플리케이션 제어를 서블릿 컨테이너에 위임하는 특별한 `ServletApplicationEngine` 엔진을 제공합니다. [](server-war.md#configure-war)에서 애플리케이션을 설정하는 방법을 알아볼 수 있습니다.

## 애플리케이션 실행 {id="run"}
> 개발 중에 서버를 재시작하는 데 시간이 걸릴 수 있습니다. Ktor는 코드 변경 시 애플리케이션 클래스를 다시 로드하고 빠른 피드백 루프를 제공하는 [자동 재로드(Auto-reload)](server-auto-reload.topic)를 사용하여 이 제한을 극복할 수 있도록 합니다.

### Gradle/Maven을 사용하여 애플리케이션 실행 {id="gradle-maven-run"}

Gradle 또는 Maven을 사용하여 Ktor 애플리케이션을 실행하려면 해당 플러그인을 사용하세요:
* Gradle용 [애플리케이션(Application)](server-packaging.md) 플러그인. [네이티브 서버(Native server)](server-native.md)의 경우, [Kotlin Multiplatform](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.multiplatform) 플러그인을 사용하세요.
* Maven용 [Exec](https://www.mojohaus.org/exec-maven-plugin/) 플러그인.

> IntelliJ IDEA에서 Ktor 애플리케이션을 실행하는 방법을 알아보려면 IntelliJ IDEA 문서의 [Ktor 애플리케이션 실행](https://www.jetbrains.com/help/idea/ktor.html#run_ktor_app) 섹션을 참조하세요.

### 패키징된 애플리케이션 실행 {id="package"}

애플리케이션을 배포하기 전에 [](server-deployment.md#packaging) 섹션에 설명된 방법 중 하나로 패키징해야 합니다.
결과 패키지에서 Ktor 애플리케이션을 실행하는 방법은 패키지 유형에 따라 다르며 다음과 같을 수 있습니다:
* fat JAR로 패키징된 Ktor 서버를 실행하고 설정된 포트를 재정의하려면 다음 명령을 실행하세요:
   ```Bash
   java -jar sample-app.jar -port=8080
   ```
* Gradle [애플리케이션(Application)](server-packaging.md) 플러그인을 사용하여 패키징된 애플리케이션을 실행하려면 해당 실행 파일을 실행하세요:

   <include from="server-packaging.md" element-id="run_executable"/>
  
* 서블릿 Ktor 애플리케이션을 실행하려면 [Gretty](server-war.md#run) 플러그인의 `run` 태스크를 사용하세요.