```xml
<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="docker-compose" title="Docker Compose">
<show-structure for="chapter" depth="2"/>
<tldr>
    <p>
        <control>초기 프로젝트</control>
        : <a
            href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-db-integration">tutorial-server-db-integration</a>
    </p>
    <p>
        <control>최종 프로젝트</control>
        : <a
            href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-docker-compose">tutorial-server-docker-compose</a>
    </p>
</tldr>
<p>이 토픽에서는 <a href="https://docs.docker.com/compose/">Docker Compose</a> 환경에서 서버 Ktor 애플리케이션을 실행하는 방법을 보여드립니다. 이 프로젝트는
    <Links href="/ktor/server-integrate-database" summary="Exposed SQL 라이브러리를 사용하여 Ktor 서비스를 데이터베이스 리포지토리에 연결하는 과정을 알아봅니다.">Integrate a Database</Links> 튜토리얼에서 생성된 프로젝트를 사용하며, <a href="https://github.com/JetBrains/Exposed">Exposed</a>를 사용하여 데이터베이스와 웹 애플리케이션이 개별적으로 실행되는 <a href="https://www.postgresql.org/docs/">PostgreSQL</a> 데이터베이스에 연결합니다.</p>
<chapter title="애플리케이션 준비" id="prepare-app">
    <chapter title="데이터베이스 설정 추출" id="extract-db-settings">
        <p>
            <a href="server-integrate-database.topic#config-db-connection">Configure the database connection</a> 튜토리얼에서 생성된 프로젝트는 데이터베이스 연결을 설정하기 위해 하드코딩된 속성을 사용합니다.</p>
        <p>
            PostgreSQL 데이터베이스의 연결 설정을 <Links href="/ktor/server-configuration-file" summary="구성 파일에서 다양한 서버 매개변수를 구성하는 방법을 알아봅니다.">사용자 지정 구성 그룹</Links>으로 추출해봅시다.
        </p>
        <procedure>
            <step>
                <p>
                    <Path>src/main/resources</Path>에 있는 <Path>application.yaml</Path> 파일을 열고, <code>ktor</code> 그룹 외부에 <code>storage</code> 그룹을 다음과 같이 추가합니다:
                </p>
                [object Promise]
                <p>이 설정은 나중에 <a href="#configure-docker">
                    <Path>compose.yml</Path>
                </a> 파일에서 구성됩니다.
                </p>
            </step>
            <step>
                <p>
                    <Path>src/main/kotlin/com/example/plugins/</Path>에 있는 <Path>Databases.kt</Path> 파일을 열고, 구성 파일에서 스토리지 설정을 로드하도록 <code>configureDatabases()</code> 함수를 업데이트합니다:
                </p>
                [object Promise]
                <p>
                    이제 <code>configureDatabases()</code> 함수는 <code>ApplicationConfig</code>를 인자로 받아 <code>config.property</code>를 사용하여 사용자 지정 설정을 로드합니다.
                </p>
            </step>
            <step>
                <p>
                    <Path>src/main/kotlin/com/example/</Path>에 있는 <Path>Application.kt</Path> 파일을 열고, 애플리케이션 시작 시 연결 설정을 로드하도록 <code>environment.config</code>를 <code>configureDatabases()</code>에 전달합니다:
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="Ktor 플러그인 구성" id="configure-ktor-plugin">
        <p>Docker에서 실행하려면 애플리케이션에 필요한 모든 파일이 컨테이너에 배포되어야 합니다. 사용 중인 빌드 시스템에 따라 이를 수행하는 다양한 플러그인이 있습니다:</p>
        <list>
            <li><Links href="/ktor/server-fatjar" summary="Ktor Gradle 플러그인을 사용하여 실행 가능한 Fat JAR를 생성하고 실행하는 방법을 알아봅니다.">Ktor Gradle 플러그인을 사용하여 Fat JAR 생성</Links></li>
            <li><Links href="/ktor/maven-assembly-plugin" summary="샘플 프로젝트: tutorial-server-get-started-maven">Maven Assembly 플러그인을 사용하여 Fat JAR 생성</Links></li>
        </list>
        <p>이 예제에서는 Ktor 플러그인이 <Path>build.gradle.kts</Path> 파일에 이미 적용되어 있습니다.
        </p>
        [object Promise]
    </chapter>
</chapter>
<chapter title="Docker 구성" id="configure-docker">
    <chapter title="Docker 이미지 준비" id="prepare-docker-image">
        <p>
            애플리케이션을 Dockerize하려면 프로젝트의 루트 디렉터리에 새 <Path>Dockerfile</Path>을 생성하고 다음 내용을 삽입합니다:
        </p>
        [object Promise]
        <tip>
            이 다단계 빌드(multi-stage build)의 작동 방식에 대한 자세한 내용은 <a href="docker.md#prepare-docker">Docker 이미지 준비</a>를 참조하세요.
        </tip>
        <tip id="jdk_image_replacement_tip">
  <p>
   이 예제에서는 Amazon Corretto Docker 이미지를 사용하지만, 다음을 포함한 다른 적합한 대안으로 대체할 수 있습니다:
  </p>
  <list>
<li><a href="https://hub.docker.com/_/eclipse-temurin">Eclipse Temurin</a></li>
<li><a href="https://hub.docker.com/_/ibm-semeru-runtimes">IBM Semeru</a></li>
<li><a href="https://hub.docker.com/_/ibmjava">IBM Java</a></li>
<li><a href="https://hub.docker.com/_/sapmachine">SAP Machine JDK</a></li>
  </list>
</tip>
    </chapter>
    <chapter title="Docker Compose 구성" id="configure-docker-compose">
        <p>프로젝트의 루트 디렉터리에 새 <Path>compose.yml</Path> 파일을 생성하고 다음 내용을 추가합니다:
        </p>
        [object Promise]
        <list>
            <li><code>web</code> 서비스는 <a href="#prepare-docker-image">이미지</a> 안에 패키지된 Ktor 애플리케이션을 실행하는 데 사용됩니다.
            </li>
            <li><code>db</code> 서비스는 <code>postgres</code> 이미지를 사용하여 작업을 저장하기 위한 <code>ktor_tutorial_db</code> 데이터베이스를 생성합니다.
            </li>
        </list>
    </chapter>
</chapter>
<chapter title="서비스 빌드 및 실행" id="build-run">
    <procedure>
        <step>
            <p>
                Ktor 애플리케이션을 포함하는 <a href="#configure-ktor-plugin">Fat JAR</a>를 생성하려면 다음 명령을 실행합니다:
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                <code>docker compose up</code> 명령을 사용하여 이미지를 빌드하고 컨테이너를 시작합니다:
            </p>
            [object Promise]
        </step>
        <step>
            Docker Compose가 이미지 빌드를 마칠 때까지 기다립니다.
        </step>
        <step>
            <p>
                웹 애플리케이션을 열려면 <a href="http://localhost:8080/static/index.html">http://localhost:8080/static/index.html</a>로 이동하세요. 작업 필터링 및 새 작업 추가를 위한 세 가지 양식과 작업 테이블을 표시하는 작업 관리자 클라이언트(Task Manager Client) 페이지를 볼 수 있습니다.
            </p>
            <img src="tutorial_server_db_integration_manual_test.gif"
                 alt="작업 관리자 클라이언트를 표시하는 브라우저 창"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>
</topic>