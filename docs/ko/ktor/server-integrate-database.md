<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="Kotlin, Ktor, Exposed를 사용하여 데이터베이스 통합" id="server-integrate-database">
<show-structure for="chapter" depth="2"/>
<tldr>
        <var name="example_name" value="tutorial-server-db-integration"/>
    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
        <p>
            <b>사용된 플러그인</b>: <Links href="/ktor/server-routing" summary="라우팅은 서버 애플리케이션에서 들어오는 요청을 처리하기 위한 핵심 플러그인입니다.">Routing</Links>,<Links href="/ktor/server-static-content" summary="스타일시트, 스크립트, 이미지 등과 같은 정적 콘텐츠를 제공하는 방법을 알아보세요.">Static Content</Links>,
            <Links href="/ktor/server-serialization" summary="ContentNegotiation 플러그인은 클라이언트와 서버 간의 미디어 타입 협상 및 특정 형식으로 콘텐츠를 직렬화/역직렬화하는 두 가지 주요 목적을 제공합니다.">Content Negotiation</Links>, <Links href="/ktor/server-status-pages" summary="%plugin_name%는 Ktor 애플리케이션이 발생한 예외 또는 상태 코드에 따라 모든 실패 상태에 적절하게 응답할 수 있도록 합니다.">Status pages</Links>,
            <Links href="/ktor/server-serialization" summary="ContentNegotiation 플러그인은 클라이언트와 서버 간의 미디어 타입 협상 및 특정 형식으로 콘텐츠를 직렬화/역직렬화하는 두 가지 주요 목적을 제공합니다.">kotlinx.serialization</Links>,
            <a href="https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/exposed/2.2/documentation.md">Exposed</a>,
            <a href="https://github.com/ktorio/ktor-plugin-registry/blob/main/plugins/server/org.jetbrains/postgres/2.2/documentation.md">Postgres</a>
        </p>
</tldr>
<card-summary>
        Exposed SQL 라이브러리를 사용하여 Ktor 서비스를 데이터베이스 리포지토리에 연결하는 과정을 알아보세요.
</card-summary>
<link-summary>
        Exposed SQL 라이브러리를 사용하여 Ktor 서비스를 데이터베이스 리포지토리에 연결하는 과정을 알아보세요.
</link-summary>
<web-summary>
        Kotlin과 Ktor를 사용하여 RESTful 서비스가 데이터베이스 리포지토리에 연결되는 단일 페이지 애플리케이션(SPA)을 구축하는 방법을 알아보세요. 이 가이드는 Exposed SQL 라이브러리를 사용하며, 테스트를 위해 리포지토리를 가상화할 수 있도록 합니다.
</web-summary>
<p>
        이 문서에서는 Kotlin용 SQL 라이브러리인 <a
            href="https://github.com/JetBrains/Exposed">Exposed</a>를 사용하여 Ktor 서비스를 관계형 데이터베이스와 통합하는 방법을 배웁니다.
</p>
<p>이 튜토리얼을 마치면 다음을 수행하는 방법을 배우게 됩니다.</p>
<list>
        <li>JSON 직렬화를 사용하는 RESTful 서비스를 생성합니다.</li>
        <li>이러한 서비스에 다양한 리포지토리를 주입합니다.</li>
        <li>가상 리포지토리를 사용하여 서비스에 대한 단위 테스트를 생성합니다.</li>
        <li>Exposed 및 의존성 주입(DI)을 사용하여 작동하는 리포지토리를 구축합니다.</li>
        <li>외부 데이터베이스에 액세스하는 서비스를 배포합니다.</li>
</list>
<p>
        이전 튜토리얼에서는 Task Manager 예시를 사용하여 [요청 처리](/ktor/server-requests-and-responses),
        [RESTful API 생성](/ktor/server-create-restful-apis) 또는
        [Thymeleaf 템플릿으로 웹 앱 구축](/ktor/server-create-website)과 같은 기본 사항을 다뤘습니다.
        해당 튜토리얼들이 간단한 인메모리 <code>TaskRepository</code>를 사용하여 프론트엔드 기능에 중점을 두었지만,
        이 가이드는 Ktor 서비스가
        <a href="https://github.com/JetBrains/Exposed">Exposed SQL 라이브러리</a>를 통해
        관계형 데이터베이스와 상호 작용하는 방법을 보여주는 데 중점을 둡니다.
</p>
<p>
        이 가이드는 더 길고 복잡하지만, 여전히 빠르게 작동하는 코드를 생성하고 점진적으로 새로운 기능을 도입할 수 있습니다.
</p>
<p>이 가이드는 두 부분으로 나뉩니다.</p>
<list type="decimal">
        <li>
            <a href="#create-restful-service-and-repository">인메모리 리포지토리를 사용하여 애플리케이션 생성.</a>
        </li>
        <li>
            <a href="#add-postgresql-repository">인메모리 리포지토리를 PostgreSQL을 사용하는 리포지토리로 교체.</a>
        </li>
</list>
<chapter title="선행 조건" id="prerequisites">
        <p>
            이 튜토리얼을 독립적으로 수행할 수 있지만, 콘텐츠 협상 및 REST에 익숙해지기 위해 <Links href="/ktor/server-create-restful-apis" summary="Kotlin과 Ktor를 사용하여 백엔드 서비스를 구축하는 방법을 배우고, JSON 파일을 생성하는 RESTful API 예시를 제공합니다.">RESTful API 생성</Links> 튜토리얼을 완료하는 것을 권장합니다.
        </p>
        <p>
            <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
            IDEA</a>를 설치하는 것을 권장하지만, 원하는 다른 IDE를 사용할 수도 있습니다.
        </p>
</chapter>
<chapter title="RESTful 서비스 및 인메모리 리포지토리 생성" id="create-restful-service-and-repository">
        <p>
            먼저, Task Manager RESTful 서비스를 다시 생성합니다. 처음에는 인메모리 리포지토리를 사용하지만, 최소한의 노력으로 교체할 수 있는 디자인을 구성할 것입니다.
        </p>
        <p>다음 6단계로 진행합니다.</p>
<list type="decimal">
            <li>
                <a href="#create-project">초기 프로젝트 생성.</a>
            </li>
            <li>
                <a href="#add-starter-code">시작 코드 추가.</a>
            </li>
            <li>
                <a href="#add-routes">CRUD 경로 추가.</a>
            </li>
            <li>
                <a href="#add-client-page">단일 페이지 애플리케이션(SPA) 추가.</a>
            </li>
            <li>
                <a href="#test-manually">애플리케이션 수동 테스트.</a>
            </li>
            <li>
                <a href="#add-automated-tests">자동화된 테스트 추가.</a>
            </li>
</list>
        <chapter title="플러그인으로 새 프로젝트 생성" id="create-project">
            <p>
                Ktor 프로젝트 생성기를 사용하여 새 프로젝트를 생성하려면 다음 단계를 따르세요.
            </p>
            <procedure id="create-project-procedure">
                <step>
    <p>
        <a href="https://start.ktor.io/">Ktor 프로젝트 생성기</a>로 이동합니다.
    </p>
                </step>
                <step>
                    <p>
                        <control>프로젝트 아티팩트</control>
                        필드에 프로젝트 아티팩트 이름으로
                        <Path>com.example.ktor-exposed-task-app</Path>
                        을 입력합니다.
                        <img src="tutorial_server_db_integration_project_artifact.png"
                             alt="Ktor 프로젝트 생성기에서 프로젝트 아티팩트 이름 지정"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
                    <p>
                        플러그인 섹션에서 다음 플러그인을 검색하여
                        <control>추가</control>
                        버튼을 클릭하여 추가합니다.
                    </p>
                    <list type="bullet">
                        <li>Routing</li>
                        <li>Content Negotiation</li>
                        <li>Kotlinx.serialization</li>
                        <li>Static Content</li>
                        <li>Status Pages</li>
                        <li>Exposed</li>
                        <li>Postgres</li>
                    </list>
                    <p>
                        <img src="ktor_project_generator_add_plugins.gif"
                             alt="Ktor 프로젝트 생성기에 플러그인 추가"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
                    <p>
                        플러그인을 추가한 후, 플러그인 섹션의 오른쪽 상단에 있는
                        <control>7 plugins</control>
                        버튼을 클릭하여 추가된 플러그인을 확인합니다.
                    </p>
                    <p>그러면 프로젝트에 추가될 모든 플러그인 목록이 표시됩니다.
                        <img src="tutorial_server_db_integration_plugin_list.png"
                             alt="Ktor 프로젝트 생성기의 플러그인 드롭다운"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
    <p>
        <control>다운로드</control>
        버튼을 클릭하여 Ktor 프로젝트를 생성하고 다운로드합니다.
    </p>
                </step>
                <step>
                    <p>
                        생성된 프로젝트를
                        <a href="https://www.jetbrains.com/help/idea/installation-guide.html">IntelliJ
                            IDEA</a> 또는 원하는 다른 IDE에서 엽니다.
                    </p>
                </step>
                <step>
                    <p>
                        <Path>src/main/kotlin/com/example</Path>
                        로 이동하여
                        <Path>CitySchema.kt</Path>
                        및
                        <Path>UsersSchema.kt</Path>
                        파일을 삭제합니다.
                    </p>
                </step>
                <step id="delete-function">
                    <p>
                        <Path>Databases.kt</Path>
                        파일을 열고 <code>configureDatabases()</code> 함수의 내용을 제거합니다.
                    </p>
                    [object Promise]
                    <p>
                        이 기능을 제거하는 이유는 Ktor 프로젝트 생성기가 사용자와 도시에 대한 데이터를 HSQLDB 또는 PostgreSQL에 영구 저장하는 방법을 보여주는 샘플 코드를 추가했기 때문입니다. 이 튜토리얼에서는 해당 샘플 코드가 필요하지 않습니다.
                    </p>
                </step>
            </procedure>
        </chapter>
        <chapter title="시작 코드 추가" id="add-starter-code">
            <procedure id="add-starter-code-procedure">
                <step>
                    <Path>src/main/kotlin/com/example</Path>
                    로 이동하여
                    <Path>model</Path>
                    이라는 서브패키지를 생성합니다.
                </step>
                <step>
                    <Path>model</Path>
                    패키지 안에 새로운
                    <Path>Task.kt</Path>
                    파일을 생성합니다.
                </step>
                <step>
                    <p>
                        <Path>Task.kt</Path>
                        를 열고 우선순위를 나타내는 <code>enum</code>과 작업을 나타내는 <code>class</code>를 추가합니다.
                    </p>
                    [object Promise]
                    <p>
                        <code>Task</code> 클래스는 <Links href="/ktor/server-serialization" summary="ContentNegotiation 플러그인은 클라이언트와 서버 간의 미디어 타입 협상 및 특정 형식으로 콘텐츠를 직렬화/역직렬화하는 두 가지 주요 목적을 제공합니다.">kotlinx.serialization</Links> 라이브러리의 <code>Serializable</code> 타입으로 어노테이션되어 있습니다.
                    </p>
                    <p>
                        이전 튜토리얼에서와 마찬가지로 인메모리 리포지토리를 생성할 것입니다. 하지만 이번에는 나중에 쉽게 교체할 수 있도록 리포지토리가 <code>interface</code>를 구현하도록 합니다.
                    </p>
                </step>
                <step>
                    <Path>model</Path>
                    서브패키지 안에 새로운
                    <Path>TaskRepository.kt</Path>
                    파일을 생성합니다.
                </step>
                <step>
                    <p>
                        <Path>TaskRepository.kt</Path>
                        를 열고 다음 <code>interface</code>를 추가합니다.
                    </p>
                    [object Promise]
                </step>
                <step>
                    같은 디렉토리 안에 새로운
                    <Path>FakeTaskRepository.kt</Path>
                    파일을 생성합니다.
                </step>
                <step>
                    <p>
                        <Path>FakeTaskRepository.kt</Path>
                        를 열고 다음 <code>class</code>를 추가합니다.
                    </p>
                    [object Promise]
                </step>
            </procedure>
        </chapter>
        <chapter title="경로 추가" id="add-routes">
            <procedure id="add-routes-procedure">
                <step>
                    <Path>src/main/kotlin/com/example</Path>
                    에 있는
                    <Path>Serialization.kt</Path>
                    파일을 엽니다.
                </step>
                <step>
                    <p>
                        기존의 <code>Application.configureSerialization()</code> 함수를 아래 구현으로 대체합니다.
                    </p>
                    [object Promise]
                    <p>
                        이것은 <Links href="/ktor/server-create-restful-apis" summary="Kotlin과 Ktor를 사용하여 백엔드 서비스를 구축하는 방법을 배우고, JSON 파일을 생성하는 RESTful API 예시를 제공합니다.">RESTful API 생성</Links> 튜토리얼에서 구현했던 라우팅과 동일합니다. 다만, 이제 리포지토리를
                        <code>routing()</code> 함수
                        의 매개변수로 전달하고 있습니다. 매개변수의 타입이 <code>interface</code>이므로, 여러 다른 구현을 주입할 수 있습니다.
                    </p>
                    <p>
                        이제 <code>configureSerialization()</code>에 매개변수를 추가했으므로, 기존 호출은 더 이상 컴파일되지 않습니다. 다행히 이 함수는 한 번만 호출됩니다.
                    </p>
                </step>
                <step>
                    <Path>src/main/kotlin/com/example</Path>
                    내에 있는
                    <Path>Application.kt</Path>
                    파일을 엽니다.
                </step>
                <step>
                    <p>
                        <code>module()</code> 함수를 아래 구현으로 대체합니다.
                    </p>
                    [object Promise]
                    <p>
                        이제 <code>configureSerialization()</code>에 <code>FakeTaskRepository</code> 인스턴스를 주입하고 있습니다.
                        장기적인 목표는 이것을 <code>PostgresTaskRepository</code>로 교체할 수 있도록 하는 것입니다.
                    </p>
                </step>
            </procedure>
        </chapter>
        <chapter title="클라이언트 페이지 추가" id="add-client-page">
            <procedure id="add-client-page-procedure">
                <step>
                    <Path>src/main/resources/static</Path>
                    에 있는
                    <Path>index.html</Path>
                    파일을 엽니다.
                </step>
                <step>
                    <p>
                        현재 내용을 아래 구현으로 대체합니다.
                    </p>
                    [object Promise]
                    <p>
                        이것은 이전 튜토리얼에서 사용된 SPA와 동일합니다. JavaScript로 작성되었고 브라우저 내에서 사용 가능한 라이브러리만 사용하므로 클라이언트 측 의존성에 대해 걱정할 필요가 없습니다.
                    </p>
                </step>
            </procedure>
        </chapter>
        <chapter title="애플리케이션 수동 테스트" id="test-manually">
            <procedure id="test-manually-procedure">
                <p>
                    첫 번째 반복은 데이터베이스에 연결하는 대신 인메모리 리포지토리를 사용하므로, 애플리케이션이 올바르게 구성되었는지 확인해야 합니다.
                </p>
                <step>
                    <p>
                        <Path>src/main/resources/application.yaml</Path>
                        로 이동하여 <code>postgres</code> 구성을 제거합니다.
                    </p>
                    [object Promise]
                </step>
                <step>
    <p>IntelliJ IDEA에서 실행 버튼
        (<img src="intellij_idea_gutter_icon.svg"
              style="inline" height="16" width="16"
              alt="IntelliJ IDEA 실행 아이콘"/>)
        을 클릭하여 애플리케이션을 시작합니다.</p>
                </step>
                <step>
                    <p>
                        브라우저에서 <a
                            href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>로 이동합니다. 세 개의 폼과 필터링된 결과를 표시하는 테이블로 구성된 클라이언트 페이지가 표시되어야 합니다.
                    </p>
                    <img src="tutorial_server_db_integration_index_page.png"
                         alt="Task Manager 클라이언트를 보여주는 브라우저 창"
                         border-effect="rounded"
                         width="706"/>
                </step>
                <step>
                    <p>
                        <control>Go</control>
                        버튼을 사용하여 폼을 작성하고 전송하여 애플리케이션을 테스트합니다. 테이블 항목에서
                        <control>View</control>
                        및
                        <control>Delete</control>
                        버튼을 사용합니다.
                    </p>
                    <img src="tutorial_server_db_integration_manual_test.gif"
                         alt="Task Manager 클라이언트를 보여주는 브라우저 창"
                         border-effect="rounded"
                         width="706"/>
                </step>
            </procedure>
        </chapter>
        <chapter title="자동화된 단위 테스트 추가" id="add-automated-tests">
            <procedure id="add-automated-tests-procedure">
                <step>
                    <p>
                        <Path>src/test/kotlin/com/example</Path>
                        에 있는
                        <Path>ApplicationTest.kt</Path>
                        를 열고 다음 테스트를 추가합니다.
                    </p>
                    [object Promise]
                    <p>
                        이 테스트들이 컴파일되고 실행되려면 Ktor 클라이언트를 위한 <a
                            href="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-content-negotiation/io.ktor.server.plugins.contentnegotiation/-content-negotiation.html">콘텐츠 협상</a>
                        플러그인에 대한 의존성을 추가해야 합니다.
                    </p>
                </step>
                <step>
                    <p>
                        <Path>gradle/libs.versions.toml</Path>
                        파일을 열고 다음 라이브러리를 지정합니다.
                    </p>
                    [object Promise]
                </step>
                <step>
                    <p>
                        <Path>build.gradle.kts</Path>
                        를 열고 다음 의존성을 추가합니다.
                    </p>
                    [object Promise]
                </step>
                <step>
    <p>IntelliJ IDEA에서 편집기 오른쪽에 있는 알림 Gradle 아이콘
        (<img alt="IntelliJ IDEA Gradle 아이콘"
              src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
        을 클릭하여 Gradle 변경 사항을 로드합니다.</p>
                </step>
                <step>
    <p>IntelliJ IDEA에서 테스트 클래스 정의 옆에 있는 실행 버튼
        (<img src="intellij_idea_gutter_icon.svg"
              style="inline" height="16" width="16"
              alt="IntelliJ IDEA 실행 아이콘"/>)
        을 클릭하여 테스트를 실행합니다.</p>
                    <p>그러면
                        <control>실행</control>
                        창에 테스트가 성공적으로 실행된 것을 확인할 수 있습니다.
                    </p>
                    <img src="tutorial_server_db_integration_test_results.png"
                         alt="IntelliJ IDEA 실행 창에 성공적인 테스트 결과가 표시됨"
                         border-effect="line"
                         width="706"/>
                </step>
            </procedure>
        </chapter>
    </chapter>
    <chapter title="PostgreSQL 리포지토리 추가" id="add-postgresql-repository">
        <p>
            이제 인메모리 데이터를 사용하는 작동하는 애플리케이션이 있으므로, 다음 단계는 데이터 저장을 PostgreSQL 데이터베이스로 외부화하는 것입니다.
        </p>
        <p>
            다음과 같이 수행하여 이를 달성합니다.
        </p>
        <list type="decimal">
            <li><a href="#create-schema">PostgreSQL 내에 데이터베이스 스키마를 생성합니다.</a></li>
            <li><a href="#adapt-repo">비동기 액세스를 위해 <code>TaskRepository</code>를 조정합니다.</a></li>
            <li><a href="#config-db-connection">애플리케이션 내에서 데이터베이스 연결을 구성합니다.</a></li>
            <li><a href="#create-mapping"><code>Task</code> 타입을 연결된 데이터베이스 테이블에 매핑합니다.</a></li>
            <li><a href="#create-new-repo">이 매핑을 기반으로 새 리포지토리를 생성합니다.</a></li>
            <li><a href="#switch-repo">시작 코드에서 이 새 리포지토리로 전환합니다.</a></li>
        </list>
        <chapter title="데이터베이스 스키마 생성" id="create-schema">
            <procedure id="create-schema-procedure">
                <step>
                    <p>
                        선택한 데이터베이스 관리 도구를 사용하여 PostgreSQL 내에 새 데이터베이스를 생성합니다.
                        이름은 기억하기만 하면 중요하지 않습니다. 이 예시에서는
                        <Path>ktor_tutorial_db</Path>
                        를 사용합니다.
                    </p>
                    <tip>
                        <p>
                            PostgreSQL에 대한 자세한 내용은 <a
                                href="https://www.postgresql.org/docs/current/">공식
                            문서</a>를 참조하세요.
                        </p>
                        <p>
                            IntelliJ IDEA에서는 데이터베이스 도구를 사용하여 <a
                                href="https://www.jetbrains.com/help/idea/postgresql.html">PostgreSQL
                            데이터베이스에 연결하고 관리</a>할 수 있습니다.
                        </p>
                    </tip>
                </step>
                <step>
                    <p>
                        데이터베이스에 대해 아래 SQL 명령을 실행합니다. 이 명령은 데이터베이스 스키마를 생성하고 채웁니다.
                    </p>
                    [object Promise]
                    <p>
                        다음을 참고하세요.
                    </p>
                    <list>
                        <li>
                            <Path>task</Path>
                            라는 단일 테이블을 생성하며,
                            <Path>name</Path>
                            ,
                            <Path>description</Path>
                            ,
                            <Path>priority</Path>
                            에 대한 컬럼을 포함합니다. 이들은 <code>Task</code> 클래스의 속성에 매핑되어야 합니다.
                        </li>
                        <li>
                            테이블이 이미 존재하는 경우 다시 생성하므로, 스크립트를 반복적으로 실행할 수 있습니다.
                        </li>
                        <li>
                            <code>SERIAL</code> 타입의
                            <Path>id</Path>
                            라는 추가 컬럼이 있습니다. 이 컬럼은 각 행에 기본 키를 부여하는 데 사용되는 정수 값입니다. 이 값들은 데이터베이스에서 자동으로 할당됩니다.
                        </li>
                    </list>
                </step>
            </procedure>
        </chapter>
        <chapter title="기존 리포지토리 조정" id="adapt-repo">
            <procedure id="adapt-repo-procedure">
                <p>
                    데이터베이스에 대한 쿼리를 실행할 때, HTTP 요청을 처리하는 스레드를 차단하지 않도록 비동기적으로 실행하는 것이 좋습니다. Kotlin에서는 <a
                        href="https://kotlinlang.org/docs/coroutines-overview.html">코루틴</a>을 통해 이를 가장 잘 관리할 수 있습니다.
                </p>
                <step>
                    <p>
                        <Path>src/main/kotlin/com/example/model</Path>
                        에 있는
                        <Path>TaskRepository.kt</Path>
                        파일을 엽니다.
                    </p>
                </step>
                <step>
                    <p>
                        모든 인터페이스 메서드에 <code>suspend</code> 키워드를 추가합니다.
                    </p>
                    [object Promise]
                    <p>
                        이는 인터페이스 메서드의 구현이 다른 코루틴 디스패처에서 작업을 시작할 수 있도록 합니다.
                    </p>
                    <p>
                        이제 <code>FakeTaskRepository</code>의 메서드를 일치시키도록 조정해야 하지만, 해당 구현에서는 디스패처를 전환할 필요가 없습니다.
                    </p>
                </step>
                <step>
                    <p>
                        <Path>FakeTaskRepository.kt</Path>
                        파일을 열고 모든 메서드에 <code>suspend</code> 키워드를 추가합니다.
                    </p>
                    [object Promise]
                    <p>
                        이 시점까지는 새로운 기능을 도입하지 않았습니다. 대신, 데이터베이스에 대한 쿼리를 비동기적으로 실행할 <code>PostgresTaskRepository</code>를 생성하기 위한 기반을 마련했습니다.
                    </p>
                </step>
            </procedure>
        </chapter>
        <chapter title="데이터베이스 연결 구성" id="config-db-connection">
            <procedure id="config-db-connection-procedure">
                <p>
                    <a href="#delete-function">이 튜토리얼의 첫 번째 부분</a>에서 <Path>Databases.kt</Path> 파일 내의
                    <code>configureDatabases()</code> 메서드에 있는 샘플 코드를 삭제했습니다. 이제 자신만의 구현을 추가할 준비가 되었습니다.
                </p>
                <step>
                    <Path>src/main/kotlin/com/example</Path>
                    에 있는
                    <Path>Databases.kt</Path>
                    파일을 엽니다.
                </step>
                <step>
                    <p>
                        <code>Database.connect()</code> 함수를 사용하여 데이터베이스에 연결하고, 설정 값을 환경에 맞게 조정합니다.
                    </p>
                    [object Promise]
                    <p><code>url</code>에는 다음 구성 요소가 포함되어 있습니다.</p>
                    <list>
                        <li>
                            <code>localhost:5432</code>는 PostgreSQL 데이터베이스가 실행 중인 호스트 및 포트입니다.
                        </li>
                        <li>
                            <code>ktor_tutorial_db</code>는 서비스를 실행할 때 생성된 데이터베이스의 이름입니다.
                        </li>
                    </list>
                    <tip>
                        자세한 내용은
                        <a href="https://jetbrains.github.io/Exposed/database-and-datasource.html">
                            Exposed에서 데이터베이스 및 데이터소스 작업</a>을 참조하세요.
                    </tip>
                </step>
            </procedure>
        </chapter>
        <chapter title="객체/관계형 매핑 생성" id="create-mapping">
            <procedure id="create-mapping-procedure">
                <step>
                    <Path>src/main/kotlin/com/example</Path>
                    로 이동하여
                    <Path>db</Path>
                    라는 새 패키지를 생성합니다.
                </step>
                <step>
                    <Path>db</Path>
                    패키지 안에 새로운
                    <Path>mapping.kt</Path>
                    파일을 생성합니다.
                </step>
                <step>
                    <p>
                        <Path>mapping.kt</Path>
                        를 열고 <code>TaskTable</code> 및 <code>TaskDAO</code> 타입을 추가합니다.
                    </p>
                    [object Promise]
                    <p>
                        이러한 타입은 Exposed 라이브러리를 사용하여 <code>Task</code> 타입의 속성을 데이터베이스의
                        <Path>task</Path>
                        테이블에 있는 컬럼에 매핑합니다. <code>TaskTable</code> 타입은 기본 매핑을 정의하고,
                        <code>TaskDAO</code> 타입은 작업을 생성, 찾기, 업데이트, 삭제하는 헬퍼 메서드를 추가합니다.
                    </p>
                    <p>
                        DAO 타입에 대한 지원은 Ktor 프로젝트 생성기에 의해 추가되지 않았으므로, Gradle 빌드 파일에 관련 의존성을 추가해야 합니다.
                    </p>
                </step>
                <step>
                    <p>
                        <Path>gradle/libs.versions.toml</Path>
                        파일을 열고 다음 라이브러리를 지정합니다.
                    </p>
                    [object Promise]
                </step>
                <step>
                    <p>
                        <Path>build.gradle.kts</Path>
                        파일을 열고 다음 의존성을 추가합니다.
                    </p>
                    [object Promise]
                </step>
                <step>
    <p>IntelliJ IDEA에서 편집기 오른쪽에 있는 알림 Gradle 아이콘
        (<img alt="IntelliJ IDEA Gradle 아이콘"
              src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
        을 클릭하여 Gradle 변경 사항을 로드합니다.</p>
                </step>
                <step>
                    <p>
                        <Path>mapping.kt</Path>
                        파일로 돌아가 다음 두 헬퍼 함수를 추가합니다.
                    </p>
                    [object Promise]
                    <p>
                        <code>suspendTransaction()</code>은 코드 블록을 IO Dispatcher를 통해 데이터베이스 트랜잭션 내에서 실행합니다. 이는 블로킹 작업을 스레드 풀로 오프로드하도록 설계되었습니다.
                    </p>
                    <p>
                        <code>daoToModel()</code>은 <code>TaskDAO</code> 타입의 인스턴스를 <code>Task</code> 객체로 변환합니다.
                    </p>
                </step>
                <step>
                    <p>
                        다음 누락된 import를 추가합니다.
                    </p>
                    [object Promise]
                </step>
            </procedure>
        </chapter>
        <chapter title="새 리포지토리 작성" id="create-new-repo">
            <procedure id="create-new-repo-procedure">
                <p>이제 데이터베이스별 리포지토리를 생성하는 데 필요한 모든 리소스가 있습니다.</p>
                <step>
                    <Path>src/main/kotlin/com/example/model</Path>
                    로 이동하여 새로운
                    <Path>PostgresTaskRepository.kt</Path>
                    파일을 생성합니다.
                </step>
                <step>
                    <p>
                        <Path>PostgresTaskRepository.kt</Path>
                        파일을 열고 다음 구현으로 새 타입을 생성합니다.
                    </p>
                    [object Promise]
                    <p>
                        이 구현에서는 <code>TaskDAO</code> 및 <code>TaskTable</code> 타입의 헬퍼 메서드를 사용하여 데이터베이스와 상호 작용합니다. 이 새로운 리포지토리를 생성했으므로, 남은 유일한 작업은 경로 내에서 이 리포지토리를 사용하도록 전환하는 것입니다.
                    </p>
                </step>
            </procedure>
        </chapter>
        <chapter title="새 리포지토리로 전환" id="switch-repo">
            <procedure id="switch-repo-procedure">
                <p>외부 데이터베이스로 전환하려면 리포지토리 타입만 변경하면 됩니다.</p>
                <step>
                    <Path>src/main/kotlin/com/example</Path>
                    에 있는
                    <Path>Application.kt</Path>
                    파일을 엽니다.
                </step>
                <step>
                    <p>
                        <code>Application.module()</code> 함수에서 <code>FakeTaskRepository</code>를
                        <code>PostgresTaskRepository</code>로 대체합니다.
                    </p>
                    [object Promise]
                    <p>
                        인터페이스를 통해 의존성을 주입하고 있기 때문에, 구현 변경은 경로를 관리하는 코드에 투명하게 적용됩니다.
                    </p>
                </step>
                <step>
    <p>
        IntelliJ IDEA에서 다시 실행 버튼 (<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="IntelliJ IDEA 다시 실행 아이콘"/>)을 클릭하여 애플리케이션을 다시 시작합니다.
    </p>
                </step>
                <step>
                    <a
                        href="http://0.0.0.0:8080/static/index.html">http://0.0.0.0:8080/static/index.html</a>로 이동합니다.
                    UI는 변경되지 않지만, 이제 데이터베이스에서 데이터를 가져옵니다.
                </step>
                <step>
                    <p>
                        이를 확인하려면 폼을 사용하여 새 작업을 추가하고 PostgreSQL의 tasks 테이블에 저장된 데이터를 쿼리합니다.
                    </p>
                    <tip>
                        <p>
                            IntelliJ IDEA에서
                            <a href="https://www.jetbrains.com/help/idea/query-consoles.html#create_console">쿼리 콘솔</a>과 <code>SELECT</code> SQL 문을 사용하여 테이블 데이터를 쿼리할 수 있습니다.
                        </p>
                        [object Promise]
                        <p>
                            쿼리되면 새 작업을 포함하여
                            <ui-path>서비스</ui-path>
                            창에 데이터가 표시되어야 합니다.
                        </p>
                        <img src="tutorial_server_db_integration_task_table.png"
                             alt="IntelliJ IDEA 서비스 창에 표시된 작업 테이블"
                             border-effect="line"
                             width="706"/>
                    </tip>
                </step>
            </procedure>
        </chapter>
        <p>
            이로써 애플리케이션에 데이터베이스 통합을 성공적으로 완료했습니다.
        </p>
        <p>
            <code>FakeTaskRepository</code> 타입이 더 이상 프로덕션 코드에 필요하지 않으므로,
            <Path>src/test/com/example</Path>
            의 테스트 소스 세트로 이동할 수 있습니다.
        </p>
        <p>
            최종 프로젝트 구조는 다음과 같아야 합니다.
        </p>
        <img src="tutorial_server_db_integration_src_folder.png"
             alt="IntelliJ IDEA의 프로젝트 뷰에 src 폴더가 표시됨"
             border-effect="line"
             width="400"/>
    </chapter>
    <chapter title="다음 단계" id="next-steps">
        <p>
            이제 Ktor RESTful 서비스와 통신하는 애플리케이션이 있습니다. 이 애플리케이션은 [Exposed](https://github.com/JetBrains/Exposed)로 작성된 리포지토리를 사용하여
            [PostgreSQL](https://www.postgresql.org/docs/)에 액세스합니다. 또한 웹 서버나 데이터베이스 없이도 핵심 기능을 확인하는 [<a href="#add-automated-tests">테스트 스위트</a>]를 가지고 있습니다.
        </p>
        <p>
            이 구조는 필요한 경우 임의의 기능을 지원하도록 확장될 수 있지만, 먼저 내결함성, 보안 및 확장성과 같은 디자인의 비기능적 측면을 고려할 수 있습니다. [데이터베이스 설정 추출](docker-compose.topic#extract-db-settings)을 <Links href="/ktor/server-configuration-file" summary="구성 파일에서 다양한 서버 매개변수를 구성하는 방법을 배웁니다.">구성 파일</Links>로 시작할 수 있습니다.
        </p>
    </chapter>
</topic>