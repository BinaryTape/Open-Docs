[//]: # (title: Maven Assembly 플러그인을 사용하여 팻 JAR 생성)

<tldr>
<p>
<control>샘플 프로젝트</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-get-started-maven">tutorial-server-get-started-maven</a>
</p>
</tldr>

[Maven Assembly 플러그인](http://maven.apache.org/plugins/maven-assembly-plugin/)은 프로젝트 결과물을 종속성, 모듈, 사이트 문서 및 기타 파일을 포함하는 단일 배포 가능한 아카이브로 결합하는 기능을 제공합니다.

## Assembly 플러그인 구성 {id="configure-plugin"}

어셈블리를 빌드하려면 Assembly 플러그인을 먼저 구성해야 합니다:

1.  **pom.xml** 파일로 이동하여 [메인 애플리케이션 클래스](server-dependencies.topic#create-entry-point)가 지정되어 있는지 확인하세요:
    [object Promise]

    > 만약 명시적인 `main()` 함수 없이 [EngineMain](server-create-and-configure.topic#engine-main)을 사용한다면, 애플리케이션의 메인 클래스는 사용된 엔진에 따라 달라지며 다음과 같을 수 있습니다: `io.ktor.server.netty.EngineMain`.
    {style="tip"}

2.  `plugins` 블록에 `maven-assembly-plugin`을 다음과 같이 추가합니다:
    [object Promise]

## 어셈블리 빌드 {id="build"}

애플리케이션을 위한 어셈블리를 빌드하려면, 터미널을 열고 다음 명령어를 실행하세요:

```Bash
mvn package
```

이것은 어셈블리를 위한 새로운 **target** 디렉토리를 생성하며, **.jar** 파일들을 포함합니다.

> 결과 패키지를 사용하여 Docker로 애플리케이션을 배포하는 방법을 배우려면, [](docker.md) 도움말 항목을 참조하세요.

## 애플리케이션 실행 {id="run"}

빌드된 애플리케이션을 실행하려면, 다음 단계를 따르세요:

1.  새로운 터미널 창에서, `java -jar` 명령어를 사용하여 애플리케이션을 실행하세요. 샘플 프로젝트의 경우 다음과 같습니다:
    ```Bash
    java -jar target/tutorial-server-get-started-maven-0.0.1-jar-with-dependencies.jar
    ```
2.  앱이 실행되면 확인 메시지가 나타납니다:
    ```Bash
    [main] INFO Application - Responding at http://0.0.0.0:8080
    ```
3.  URL 링크를 클릭하여 기본 브라우저에서 애플리케이션을 여세요:

    <img src="server_get_started_ktor_sample_app_output.png" alt="생성된 Ktor 프로젝트의 출력"
                       border-effect="rounded" width="706"/>