[//]: # (title: Maven Assembly 플러그인을 사용하여 통합 JAR 생성하기)

<tldr>
<p>
<control>샘플 프로젝트</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-get-started-maven">tutorial-server-get-started-maven</a>
</p>
</tldr>

[Maven Assembly 플러그인](http://maven.apache.org/plugins/maven-assembly-plugin/)은 의존성, 모듈, 사이트 문서 및 기타 파일을 포함하는 단일 배포 가능한 아카이브로 프로젝트 결과물을 결합하는 기능을 제공합니다.

## Assembly 플러그인 구성하기 {id="configure-plugin"}

어셈블리를 빌드하려면 먼저 Assembly 플러그인을 구성해야 합니다:

1. **pom.xml** 파일로 이동하여 [메인 애플리케이션 클래스](server-dependencies.topic#create-entry-point)가 지정되어 있는지 확인하세요:
   ```xml
   ```
   {src="snippets/tutorial-server-get-started-maven/pom.xml" include-lines="10,18-19"}

   > 명시적인 `main()` 함수 없이 [EngineMain](server-create-and-configure.topic#engine-main)을 사용하는 경우, 애플리케이션의 메인 클래스는 사용된 엔진에 따라 다음과 같을 수 있습니다: `io.ktor.server.netty.EngineMain`.
   {style="tip"}

2. `plugins` 블록에 `maven-assembly-plugin`을 다음과 같이 추가하세요:
   ```xml
   ```
   {src="snippets/tutorial-server-get-started-maven/pom.xml" include-lines="111-135"}

## 어셈블리 빌드하기 {id="build"}

애플리케이션용 어셈블리를 빌드하려면, 터미널을 열고 다음 명령어를 실행하세요:

```Bash
mvn package
```

그러면 어셈블리를 위한 새로운 **target** 디렉터리가 생성되며, **.jar** 파일이 포함됩니다.

> 결과 패키지를 사용하여 Docker로 애플리케이션을 배포하는 방법을 알아보려면, [](docker.md) 도움말 항목을 참조하세요.

## 애플리케이션 실행하기 {id="run"}

빌드된 애플리케이션을 실행하려면, 아래 단계를 따르세요:

1. 새 터미널 창에서 `java -jar` 명령을 사용하여 애플리케이션을 실행하세요. 샘플 프로젝트의 경우 다음과 같습니다:
   ```Bash
   java -jar target/tutorial-server-get-started-maven-0.0.1-jar-with-dependencies.jar
   ```
2. 앱이 실행되면 확인 메시지가 나타납니다:
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
3. URL 링크를 클릭하여 기본 브라우저에서 애플리케이션을 여세요:

   <img src="server_get_started_ktor_sample_app_output.png" alt="Output of generated ktor project"
                     border-effect="rounded" width="706"/>