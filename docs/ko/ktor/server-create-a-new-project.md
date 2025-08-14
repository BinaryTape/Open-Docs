<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="새 Ktor 프로젝트 생성, 열기 및 실행"
       id="server-create-a-new-project"
       help-id="server_create_a_new_project">
    <show-structure for="chapter" depth="2"/>
    <tldr>
        <var name="example_name" value="tutorial-server-get-started"/>
        <p>
            <b>코드 예시</b>:
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
                %example_name%
            </a>
        </p>
    </tldr>
    <link-summary>
        Ktor로 서버 애플리케이션을 열고, 실행하고, 테스트하는 방법을 알아봅니다.
    </link-summary>
    <web-summary>
        첫 Ktor 서버 애플리케이션 구축을 시작하세요. 이 튜토리얼에서는 새 Ktor 프로젝트를 생성, 열고 실행하는 방법을 배웁니다.
    </web-summary>
    <p>
        이 튜토리얼에서는 첫 Ktor 서버 프로젝트를 생성, 열고 실행하는 방법을 배웁니다. 일단 시작하고 나면, Ktor에 익숙해지기 위한 일련의 작업을 시도해볼 수 있습니다.
    </p>
    <p>
        이 튜토리얼은 Ktor를 사용하여 서버 애플리케이션 구축을 시작하는 데 도움이 되는 일련의 튜토리얼 중 첫 번째입니다. 각 튜토리얼을 독립적으로 수행할 수 있지만, 제시된 순서를 따르는 것을 강력히 권장합니다.
    </p>
    <list type="decimal">
        <li>새 Ktor 프로젝트 생성, 열기 및 실행.</li>
        <li><Links href="/ktor/server-requests-and-responses" summary="Ktor로 작업 관리자 애플리케이션을 구축하며 Kotlin에서 라우팅, 요청 처리 및 매개변수 사용의 기본 사항을 배웁니다.">요청 처리 및 응답 생성</Links>.</li>
        <li><Links href="/ktor/server-create-restful-apis" summary="Kotlin 및 Ktor를 사용하여 백엔드 서비스를 구축하는 방법을 배우고, JSON 파일을 생성하는 RESTful API 예시를 포함합니다.">JSON을 생성하는 RESTful API 생성</Links>.</li>
        <li><Links href="/ktor/server-create-website" summary="Ktor 및 Thymeleaf 템플릿을 사용하여 Kotlin으로 웹사이트를 구축하는 방법을 배웁니다.">Thymeleaf 템플릿을 사용하여 웹사이트 생성</Links>.</li>
        <li><Links href="/ktor/server-create-websocket-application" summary="WebSocket의 기능을 활용하여 콘텐츠를 송수신하는 방법을 배웁니다.">WebSocket 애플리케이션 생성</Links>.</li>
        <li><Links href="/ktor/server-integrate-database" summary="Exposed SQL 라이브러리를 사용하여 Ktor 서비스를 데이터베이스 리포지토리에 연결하는 과정을 배웁니다.">Exposed와 데이터베이스 통합</Links>.</li>
    </list>
    <chapter id="create-project" title="새 Ktor 프로젝트 생성">
        <p>
            새 Ktor 프로젝트를 생성하는 가장 빠른 방법 중 하나는 <a href="#create-project-with-the-ktor-project-generator">웹 기반 Ktor 프로젝트 생성기</a>를 사용하는 것입니다.
        </p>
        <p>
            또는 프로젝트를
            <a href="#create_project_with_intellij">IntelliJ IDEA Ultimate용 Ktor 전용 플러그인</a>
            또는
            <a href="#create_project_with_ktor_cli_tool">Ktor CLI 도구</a>를 사용하여
            생성할 수 있습니다.
        </p>
        <chapter title="Ktor 프로젝트 생성기 사용"
                 id="create-project-with-the-ktor-project-generator">
            <p>
                Ktor 프로젝트 생성기로 새 프로젝트를 생성하려면 다음 단계를 따르십시오.
            </p>
            <procedure>
                <step>
                    <p>Ktor 프로젝트 생성기<a href="https://start.ktor.io/">로 이동합니다</a>.</p>
                </step>
                <step>
                    <p>
                        <control>프로젝트 아티팩트</control>
                        필드에 프로젝트 아티팩트 이름으로
                        <Path>com.example.ktor-sample-app</Path>을
                        입력합니다.
                        <img src="ktor_project_generator_new_project_artifact_name.png"
                             alt="프로젝트 아티팩트 이름 org.example.ktor-sample-app이 있는 Ktor 프로젝트 생성기"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
                    <p>
                        <control>구성</control>을
                        클릭하여 설정 드롭다운 메뉴를 엽니다.
                        <img src="ktor_project_generator_new_project_configure.png"
                             style="block"
                             alt="Ktor 프로젝트 설정의 확장된 보기" border-effect="line" width="706"/>
                    </p>
                    <p>
                        다음 설정이 제공됩니다.
                    </p>
                    <list>
                        <li>
                            <p>
                                <control>빌드 시스템</control>
                                :
                                원하는 <Links href="/ktor/server-dependencies" summary="기존 Gradle/Maven 프로젝트에 Ktor 서버 종속성을 추가하는 방법을 배웁니다.">빌드 시스템</Links>을 선택합니다.
                                Kotlin 또는 Groovy DSL을 사용하는
                                <emphasis>Gradle</emphasis>
                                또는
                                <emphasis>Maven</emphasis>
                               일 수 있습니다.
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>Ktor 버전</control>
                                :
                                필요한 Ktor 버전을 선택합니다.
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>엔진</control>
                                :
                                서버를 실행하는 데 사용되는 <Links href="/ktor/server-engines" summary="네트워크 요청을 처리하는 엔진에 대해 알아봅니다.">엔진</Links>을 선택합니다.
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>구성</control>
                                :
                                구성 파일에서 <Links href="/ktor/server-configuration-file" summary="구성 파일에서 다양한 서버 매개변수를 구성하는 방법을 배웁니다.">YAML 또는 HOCON 파일</Links>로 서버 매개변수를 지정할지, 아니면
                                <Links href="/ktor/server-configuration-code" summary="코드에서 다양한 서버 매개변수를 구성하는 방법을 배웁니다.">코드</Links>에서 지정할지 선택합니다.
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>샘플 포함</control>
                                :
                                플러그인용 샘플 코드를 추가하려면 이 옵션을 활성화된 상태로 둡니다.
                            </p>
                        </li>
                    </list>
                    <p>이 튜토리얼에서는 이 설정들의 기본값을 그대로 사용할 수 있습니다.</p>
                </step>
                <step>
                    <p>
                        <control>완료</control>를
                        클릭하여 구성을 저장하고 메뉴를 닫습니다.
                    </p>
                </step>
                <step>
                    <p>아래에서 프로젝트에 추가할 수 있는 <Links href="/ktor/server-plugins" summary="플러그인은 직렬화, 콘텐츠 인코딩, 압축 등과 같은 공통 기능을 제공합니다.">플러그인</Links> 세트를 찾을 수 있습니다. 플러그인은 Ktor 애플리케이션에서 인증, 직렬화 및 콘텐츠 인코딩, 압축, 쿠키 지원 등과 같이 공통 기능을 제공하는 빌딩 블록입니다.
                    </p>
                    <p>이 튜토리얼에서는 이 단계에서 플러그인을 추가할 필요가 없습니다.</p>
                </step>
                <step>
                    <p>
                        <control>다운로드</control>
                        버튼을 클릭하여 Ktor 프로젝트를 생성하고 다운로드합니다.
                        <img src="ktor_project_generator_new_project_download.png"
                             alt="Ktor 프로젝트 생성기 다운로드 버튼"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <p>다운로드가 자동으로 시작될 것입니다.</p>
            </procedure>
            <p>새 프로젝트를 생성했으니, 이제 <a href="#unpacking">Ktor 프로젝트 압축 해제 및 실행</a>으로 이동하세요.</p>
        </chapter>
        <chapter title="IntelliJ IDEA Ultimate용 Ktor 플러그인 사용" id="create_project_with_intellij"
                 collapsible="true">
            <p>
                이 섹션에서는 Intellij IDEA Ultimate용 <a
                    href="https://plugins.jetbrains.com/plugin/16008-ktor">Ktor 플러그인</a>을 사용하여 프로젝트를 설정하는 방법을 설명합니다.
            </p>
            <p>
                새 Ktor 프로젝트를 생성하려면 <a href="https://www.jetbrains.com/help/idea/run-for-the-first-time.html">IntelliJ IDEA를 열고</a>, 다음 단계를 따르십시오.
            </p>
            <procedure>
                <step>
                    <p>
                        환영 화면에서 <control>새 프로젝트</control>를 클릭합니다.
                    </p>
                    <p>
                        그렇지 않으면, 메인 메뉴에서 <ui-path>파일 | 새로 만들기 | 프로젝트</ui-path>를 선택합니다.
                    </p>
                </step>
                <step>
                    <p>
                        <control>새 프로젝트</control>
                        마법사에서 왼쪽 목록에서
                        <control>Ktor</control>를
                        선택합니다.
                    </p>
                </step>
                <step>
                    <p>
                        오른쪽 창에서 다음 설정을 지정할 수 있습니다.
                    </p>
                    <img src="ktor_idea_new_project_settings.png" alt="Ktor 프로젝트 설정" width="706"
                         border-effect="rounded"/>
                    <list>
                        <li>
                            <p>
                                <control>이름</control>
                                :
                                프로젝트 이름을 지정합니다. 프로젝트 이름으로
                                <Path>ktor-sample-app</Path>을
                                입력합니다.
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>위치</control>
                                :
                                프로젝트 디렉터리를 지정합니다.
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>웹사이트</control>
                                :
                                패키지 이름을 생성하는 데 사용될 도메인을 지정합니다.
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>아티팩트</control>
                                :
                                이 필드는 생성된 아티팩트 이름을 보여줍니다.
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>엔진</control>
                                :
                                서버를 실행하는 데 사용되는 <Links href="/ktor/server-engines" summary="네트워크 요청을 처리하는 엔진에 대해 알아봅니다.">엔진</Links>을 선택합니다.
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>샘플 포함</control>
                                :
                                플러그인용 샘플 코드를 추가하려면 이 옵션을 활성화된 상태로 둡니다.
                            </p>
                        </li>
                    </list>
                </step>
                <step>
                    <p>
                        <control>고급 설정</control>을
                        클릭하여 추가 설정 메뉴를 확장합니다.
                    </p>
                    <img src="ktor_idea_new_project_advanced_settings.png" alt="Ktor 프로젝트 고급 설정"
                         width="706" border-effect="rounded"/>
                    <p>
                        다음 설정이 제공됩니다.
                    </p>
                    <list>
                        <li>
                            <p>
                                <control>빌드 시스템</control>
                                :
                                원하는 <Links href="/ktor/server-dependencies" summary="기존 Gradle/Maven 프로젝트에 Ktor 서버 종속성을 추가하는 방법을 배웁니다.">빌드 시스템</Links>을 선택합니다.
                                Kotlin 또는 Groovy DSL을 사용하는
                                <emphasis>Gradle</emphasis>
                                또는
                                <emphasis>Maven</emphasis>
                               일 수 있습니다.
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>Ktor 버전</control>
                                :
                                필요한 Ktor 버전을 선택합니다.
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>구성</control>
                                :
                                구성 파일에서 <Links href="/ktor/server-configuration-file" summary="구성 파일에서 다양한 서버 매개변수를 구성하는 방법을 배웁니다.">YAML 또는 HOCON 파일</Links>로 서버 매개변수를 지정할지, 아니면
                                <Links href="/ktor/server-configuration-code" summary="코드에서 다양한 서버 매개변수를 구성하는 방법을 배웁니다.">코드</Links>에서 지정할지 선택합니다.
                            </p>
                        </li>
                    </list>
                    <p>이 튜토리얼에서는 이 설정들의 기본값을 그대로 사용할 수 있습니다.</p>
                </step>
                <step>
                    <p>
                        <control>다음</control>을
                        클릭하여 다음 페이지로 이동합니다.
                    </p>
                    <img src="ktor_idea_new_project_plugins_list.png" alt="Ktor 플러그인" width="706"
                         border-effect="rounded"/>
                    <p>
                        이 페이지에서 <Links href="/ktor/server-plugins" summary="플러그인은 직렬화, 콘텐츠 인코딩, 압축 등과 같은 공통 기능을 제공합니다.">플러그인</Links> 세트를 선택할 수 있습니다. 예를 들어 인증, 직렬화 및 콘텐츠 인코딩, 압축, 쿠키 지원 등과 같이 Ktor 애플리케이션의 공통 기능을 제공하는 빌딩 블록입니다.
                    </p>
                    <p>이 튜토리얼에서는 이 단계에서 플러그인을 추가할 필요가 없습니다.</p>
                </step>
                <step>
                    <p>
                        <control>생성</control>을
                        클릭하고 IntelliJ IDEA가 프로젝트를 생성하고 종속성을 설치할 때까지 기다립니다.
                    </p>
                </step>
            </procedure>
            <p>
                이제 새 프로젝트를 생성했으니, 애플리케이션을 <a href="#open-explore-run">열고, 탐색하고, 실행하는</a> 방법을 계속 알아보세요.
            </p>
        </chapter>
        <chapter title="Ktor CLI 도구 사용" id="create_project_with_ktor_cli_tool"
                 collapsible="true">
            <p>
                이 섹션에서는 <a href="https://github.com/ktorio/ktor-cli">Ktor CLI 도구</a>를 사용하여 프로젝트를 설정하는 방법을 설명합니다.
            </p>
            <p>
                새 Ktor 프로젝트를 생성하려면 원하는 터미널을 열고 다음 단계를 따르십시오.
            </p>
            <procedure>
                <step>
                    다음 명령어 중 하나를 사용하여 Ktor CLI 도구를 설치합니다.
                    <tabs>
                        <tab title="macOS/Linux" id="macos-linux">
                            [object Promise]
                        </tab>
                        <tab title="Windows" id="windows">
                            [object Promise]
                        </tab>
                    </tabs>
                </step>
                <step>
                    대화형 모드에서 새 프로젝트를 생성하려면 다음 명령어를 사용합니다.
                    [object Promise]
                </step>
                <step>
                    프로젝트 이름으로
                    <Path>ktor-sample-app</Path>을
                    입력합니다.
                    <img src="server_create_cli_tool_name_dark.png"
                         alt="대화형 모드에서 Ktor CLI 도구 사용"
                         border-effect="rounded"
                         style="block"
                         width="706"/>
                    <p>
                        (선택 사항) 프로젝트 이름 아래의
                        <ui-path>위치</ui-path>
                        경로를 편집하여 프로젝트가 저장될 위치를 변경할 수도 있습니다.
                    </p>
                </step>
                <step>
                    <shortcut>Enter</shortcut>를
                    눌러 계속합니다.
                </step>
                <step>
                    다음 단계에서는 프로젝트에 <Links href="/ktor/server-plugins" summary="플러그인은 직렬화, 콘텐츠 인코딩, 압축 등과 같은 공통 기능을 제공합니다.">플러그인</Links>을 검색하고 추가할 수 있습니다. 플러그인은 Ktor 애플리케이션에서 인증, 직렬화 및 콘텐츠 인코딩, 압축, 쿠키 지원 등과 같이 공통 기능을 제공하는 빌딩 블록입니다.
                    <img src="server_create_cli_tool_add_plugins_dark.png"
                         alt="Ktor CLI 도구를 사용하여 프로젝트에 플러그인 추가"
                         border-effect="rounded"
                         style="block"
                         width="706"/>
                    <p>이 튜토리얼에서는 이 단계에서 플러그인을 추가할 필요가 없습니다.</p>
                </step>
                <step>
                    <shortcut>CTRL+G</shortcut>를
                    눌러 프로젝트를 생성합니다.
                    <p>
                        또는 <control>프로젝트 생성 (CTRL+G)</control>을 선택하고
                        <shortcut>Enter</shortcut>를
                        눌러 프로젝트를 생성할 수 있습니다.
                    </p>
                </step>
            </procedure>
        </chapter>
    </chapter>
    <chapter title="Ktor 프로젝트 압축 해제 및 실행" id="unpacking">
        <p>
            이 섹션에서는 명령줄에서 프로젝트를 압축 해제하고 빌드하며 실행하는 방법을 배웁니다. 아래 설명은 다음을 가정합니다.
        </p>
        <list type="bullet">
            <li><Path>ktor-sample-app</Path>이라는 프로젝트를 생성하고 다운로드했습니다.
            </li>
            <li>이 프로젝트는 홈 디렉터리의 <Path>myprojects</Path>라는 폴더에 있습니다.
            </li>
        </list>
        <p>필요한 경우, 자신의 설정에 맞게 이름과 경로를 변경하십시오.</p>
        <p>원하는 명령줄 도구를 열고 다음 단계를 따르십시오.</p>
        <procedure>
            <step>
                <p>터미널에서 프로젝트를 다운로드한 폴더로 이동합니다.</p>
                [object Promise]
            </step>
            <step>
                <p>ZIP 아카이브를 동일한 이름의 폴더로 압축 해제합니다.</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                    <tab title="Windows" group-key="windows">
                        [object Promise]
                    </tab>
                </tabs>
                <p>이제 디렉터리에 ZIP 아카이브와 압축이 해제된 폴더가 포함됩니다.</p>
            </step>
            <step>
                <p>해당 디렉터리에서 새로 생성된 폴더로 이동합니다.</p>
                [object Promise]
            </step>
            <step>
                <p>macOS/UNIX 시스템에서는 gradlew Gradle 헬퍼 스크립트를 실행 가능하게 만들어야 합니다. 이를 위해 <code>chmod</code> 명령어를 사용합니다.</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                </tabs>
            </step>
            <step>
                <p>프로젝트를 빌드하려면 다음 명령어를 사용합니다.</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                    <tab title="Windows" group-key="windows">
                        [object Promise]
                    </tab>
                </tabs>
                <p>빌드가 성공했음을 확인하면 Gradle을 통해 프로젝트를 다시 실행할 수 있습니다.</p>
            </step>
            <step>
                <p>프로젝트를 실행하려면 다음 명령어를 사용합니다.</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                    <tab title="Windows" group-key="windows">
                        [object Promise]
                    </tab>
                </tabs>
            </step>
            <step>
                <p>프로젝트가 실행 중인지 확인하려면 출력에 언급된 URL(<a
                        href="http://0.0.0.0:8080">http://0.0.0.0:8080</a>)로 브라우저를 엽니다.
                    화면에 "Hello World!" 메시지가 표시되어야 합니다.</p>
                <img src="server_get_started_ktor_sample_app_output.png" alt="생성된 Ktor 프로젝트의 출력"
                     border-effect="line" width="706"/>
            </step>
        </procedure>
        <p>축하합니다! Ktor 프로젝트를 성공적으로 시작했습니다.</p>
        <p>기본 프로세스가 Ktor 애플리케이션 실행으로 바쁘기 때문에 명령줄이 응답하지 않습니다. 애플리케이션을 종료하려면
            <shortcut>CTRL+C</shortcut>를
            누를 수 있습니다.
        </p>
    </chapter>
    <chapter title="IntelliJ IDEA에서 Ktor 프로젝트 열기, 탐색 및 실행" id="open-explore-run">
        <chapter title="프로젝트 열기" id="open">
            <p><a href="https://www.jetbrains.com/idea/">IntelliJ IDEA</a>가 설치되어 있다면 명령줄에서 프로젝트를 쉽게 열 수 있습니다.
            </p>
            <p>
                프로젝트 폴더에 있는지 확인한 다음, 현재 폴더를 나타내는 마침표와 함께 <code>idea</code> 명령을 입력합니다.
            </p>
            [object Promise]
            <p>
                또는 수동으로 IntelliJ IDEA를 실행하여 프로젝트를 열 수 있습니다.
            </p>
            <p>
                환영 화면이 열리면
                <control>열기</control>를
                클릭합니다. 그렇지 않으면, 메인 메뉴에서
                <ui-path>파일 | 열기</ui-path>로
                이동하여
                <Path>ktor-sample-app</Path>
                폴더를 선택하여 엽니다.
            </p>
            <tip>
                프로젝트 관리에 대한 자세한 내용은
                <a href="https://www.jetbrains.com/help/idea/creating-and-managing-projects.html">IntelliJ IDEA
                    문서</a>를 참조하십시오.
            </tip>
        </chapter>
        <chapter title="프로젝트 탐색" id="explore">
            <p>어떤 옵션을 선택하든 프로젝트는 아래와 같이 열릴 것입니다.</p>
            <img src="server_get_started_idea_project_view.png" alt="IDE에서 생성된 Ktor 프로젝트 뷰" width="706"/>
            <p>
                프로젝트 레이아웃을 설명하기 위해
                <control>프로젝트</control>
                뷰에서 구조를 확장하고
                <Path>settings-gradle.kts</Path>
                파일을 선택했습니다.
            </p>
            <p>
                애플리케이션 실행 코드는
                <Path>src/main/kotlin</Path>
                아래의 패키지에 있음을 알 수 있습니다. 기본 패키지는
                <Path>com.example</Path>이라고
                불리며,
                <Path>plugins</Path>라는
                하위 패키지를 포함합니다.
                이 패키지들 안에
                <Path>Application.kt</Path>
                및
                <Path>Routing.kt</Path>라는
                두 개의 파일이 생성되었습니다.
            </p>
            <img src="server_get_started_idea_main_folder.png" alt="Ktor 프로젝트 src 폴더 구조" width="400"/>
            <p>프로젝트 이름은
                <Path>settings-gradle.kts</Path>에
                구성됩니다.
            </p>
            <img src="server_get_started_idea_settings_file.png" alt="settings.gradle.kt 내용" width="706"/>
            <p>
                구성 파일 및 기타 유형의 콘텐츠는
                <Path>src/main/resources</Path>
                폴더 안에 있습니다.
            </p>
            <img src="server_get_started_idea_resources_folder.png" alt="Ktor 프로젝트 resources 폴더 구조"
                 width="400"/>
            <p>
                <Path>src/test/kotlin</Path>
                아래의 패키지에 스켈레톤 테스트가 생성되었습니다.
            </p>
            <img src="server_get_started_idea_test_folder.png" alt="Ktor 프로젝트 test 폴더 구조" width="400"/>
        </chapter>
        <chapter title="프로젝트 실행" id="run">
            <procedure>
                <p>IntelliJ IDEA 내에서 프로젝트를 실행하려면:</p>
                <step>
                    <p>오른쪽 사이드바에서 그레이들 아이콘(<img alt="IntelliJ IDEA 그레이들 아이콘"
                                                          src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)을
                        클릭하여 <a href="https://www.jetbrains.com/help/idea/jetgradle-tool-window.html">Gradle 도구 창</a>을 엽니다.</p>
                    <img src="server_get_started_idea_gradle_tab.png" alt="IntelliJ IDEA의 Gradle 탭"
                         border-effect="line" width="706"/>
                </step>
                <step>
                    <p>이 도구 창에서
                        <ui-path>작업 | application</ui-path>으로
                        이동하여
                        <control>실행</control>
                        작업을 두 번 클릭합니다.
                    </p>
                    <img src="server_get_started_idea_gradle_run.png" alt="IntelliJ IDEA의 Gradle 탭"
                         border-effect="line" width="450"/>
                </step>
                <step>
                    <p>Ktor 애플리케이션은 IDE 하단의 <a
                            href="https://www.jetbrains.com/help/idea/run-tool-window.html">실행 도구 창</a>에서 시작됩니다.</p>
                    <img src="server_get_started_idea_run_terminal.png" alt="터미널에서 실행 중인 프로젝트" width="706"/>
                    <p>이전에 명령줄에 표시되었던 메시지와 동일한 메시지가 이제
                        <ui-path>실행</ui-path>
                        도구 창에 표시됩니다.
                    </p>
                </step>
                <step>
                    <p>프로젝트가 실행 중임을 확인하려면 지정된 URL
                        (<a href="http://0.0.0.0:8080">http://0.0.0.0:8080</a>)로 브라우저를 엽니다.</p>
                    <p>화면에 다시 "Hello World!" 메시지가 표시되어야 합니다.</p>
                    <img src="server_get_started_ktor_sample_app_output.png" alt="브라우저 화면의 Hello World"
                         width="706"/>
                </step>
            </procedure>
            <p>
                <ui-path>실행</ui-path>
                도구 창을 통해 애플리케이션을 관리할 수 있습니다.
            </p>
            <list type="bullet">
                <li>
                    애플리케이션을 종료하려면 중지 버튼 <img src="intellij_idea_terminate_icon.svg"
                                                                             style="inline" height="16" width="16"
                                                                             alt="IntelliJ IDEA 종료 아이콘"/>을 클릭합니다.
                </li>
                <li>
                    프로세스를 다시 시작하려면 다시 실행 버튼 <img src="intellij_idea_rerun_icon.svg"
                                                                        style="inline" height="16" width="16"
                                                                        alt="IntelliJ IDEA 다시 실행 아이콘"/>을 클릭합니다.
                </li>
            </list>
            <p>
                이 옵션들은 <a href="https://www.jetbrains.com/help/idea/run-tool-window.html#run-toolbar">IntelliJ IDEA 실행 도구 창 문서</a>에서 더 자세히 설명됩니다.
            </p>
        </chapter>
    </chapter>
    <chapter title="시도해 볼 추가 작업" id="additional-tasks">
        <p>다음은 시도해 볼 만한 몇 가지 추가 작업입니다.</p>
        <list type="decimal">
            <li><a href="#change-the-default-port">기본 포트 변경.</a></li>
            <li><a href="#change-the-port-via-yaml">YAML을 통해 포트 변경.</a></li>
            <li><a href="#add-a-new-http-endpoint">새 HTTP 엔드포인트 추가.</a></li>
            <li><a href="#configure-static-content">정적 콘텐츠 구성.</a></li>
            <li><a href="#write-an-integration-test">통합 테스트 작성.</a></li>
            <li><a href="#register-error-handlers">오류 핸들러 등록.</a></li>
        </list>
        <p>
            이 작업들은 서로 의존하지 않지만, 점진적으로 복잡성이 증가합니다. 선언된 순서대로 시도하는 것이 점진적으로 배우는 가장 쉬운 방법입니다. 간결성을 위해, 그리고 중복을 피하기 위해, 아래 설명은 작업들을 순서대로 시도한다고 가정합니다.
        </p>
        <p>
            코딩이 필요한 경우 코드와 해당 임포트를 모두 지정했습니다. IDE가 자동으로 이러한 임포트를 추가할 수 있습니다.
        </p>
        <chapter title="기본 포트 변경" id="change-the-default-port">
            <p>
                <ui-path>프로젝트</ui-path>
                뷰에서 <Path>src/main/kotlin</Path>
                폴더로 이동한 다음 생성된 단일 패키지로 이동하여 다음 단계를 따르십시오.
            </p>
            <procedure>
                <step>
                    <p><Path>Application.kt</Path>
                        파일을 엽니다. 다음 코드와 유사한 코드를 찾을 수 있습니다.
                    </p>
                    [object Promise]
                </step>
                <step>
                    <p><code>embeddedServer()</code> 함수에서 <code>port</code> 매개변수를 원하는 다른 번호(예: "9292")로 변경합니다.</p>
                    [object Promise]
                </step>
                <step>
                    <p>애플리케이션을 다시 시작하려면 다시 실행 버튼(<img alt="IntelliJ IDEA 다시 실행 버튼 아이콘"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)을
                        클릭합니다.</p>
                </step>
                <step>
                    <p>새 포트 번호에서 애플리케이션이 실행 중임을 확인하려면 새 URL (<a
                            href="http://0.0.0.0:9292">http://0.0.0.0:9292</a>)로 브라우저를 열거나,
                        <a href="https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html#creating-http-request-files">IntelliJ IDEA에서
                            새 HTTP 요청 파일</a>을 생성할 수 있습니다.</p>
                    <img src="server_get_started_port_change.png"
                         alt="IntelliJ IDEA에서 HTTP 요청 파일로 포트 변경 테스트" width="706"/>
                </step>
            </procedure>
        </chapter>
        <chapter title="YAML을 통해 포트 변경" id="change-the-port-via-yaml">
            <p>
                새 Ktor 프로젝트를 생성할 때, YAML 또는 HOCON 파일 내에 외부적으로 구성을 저장하는 옵션이 있습니다.
            </p>
            <img src="ktor_project_generator_configuration_options.png" width="400"
                 alt="Ktor 프로젝트 생성기 구성 옵션"/>
            <p>
                만약 외부적으로 구성을 저장하도록 선택했다면, <Path>Application.kt</Path>의 코드는 다음과 같을 것입니다.
            </p>
            [object Promise]
            <p>
                이 값들은 <Path>src/main/resources/</Path> 내의 구성 파일에 저장될 것입니다.
            </p>
            <tabs>
                <tab title="application.yaml (YAML)" group-key="yaml">
                    [object Promise]
                </tab>
                <tab title="application.conf (HOCON)" group-key="hocon">
                    [object Promise]
                </tab>
            </tabs>
            <p>
                이 경우 포트 번호를 변경하기 위해 코드를 수정할 필요가 없습니다. YAML 또는 HOCON 파일의 값을 변경하고 애플리케이션을 다시 시작하기만 하면 됩니다. 변경 사항은 위 <a href="#change-the-default-port">기본 포트 변경</a>과 동일한 방식으로 확인할 수 있습니다.
            </p>
        </chapter>
        <chapter title="새 HTTP 엔드포인트 추가" id="add-a-new-http-endpoint">
            <p>다음으로, GET 요청에 응답하는 새 HTTP 엔드포인트를 생성합니다.</p>
            <p>
                <ui-path>프로젝트</ui-path>
                도구 창에서 <Path>src/main/kotlin/com/example</Path>
                폴더로 이동하여 다음 단계를 따르십시오.
            </p>
            <procedure>
                <step>
                    <p><Path>Application.kt</Path>
                        파일을 열고 <code>configureRouting()</code> 함수를 찾습니다.
                    </p>
                </step>
                <step>
                    <p>IntelliJ IDEA에서 함수 이름 위에 캐럿을 놓고
                        <shortcut>⌘Cmd+B</shortcut>를
                        눌러 <code>configureRouting()</code> 함수로 이동합니다.
                    </p>
                    <p>또는 <code>Routing.kt</code> 파일을 열어 함수로 이동할 수도 있습니다.</p>
                    <p>다음은 보게 될 코드입니다.</p>
                    [object Promise]
                </step>
                <step>
                    <p>새 엔드포인트를 생성하려면 아래 표시된 추가 다섯 줄의 코드를 삽입합니다.</p>
                    [object Promise]
                    <p><code>/test1</code> URL은 원하는 대로 변경할 수 있습니다.</p>
                </step>
                <step>
                    <p><code>ContentType</code>을 사용하기 위해 다음 임포트를 추가합니다.</p>
                    [object Promise]
                </step>
                <step>
                    <p>애플리케이션을 다시 시작하려면 다시 실행 버튼(<img alt="IntelliJ IDEA 다시 실행 버튼 아이콘"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)을
                        클릭합니다.</p>
                </step>
                <step>
                    <p>브라우저에서 새 URL(<a
                            href="http://0.0.0.0:9292/test1">http://0.0.0.0:9292/test1</a>)을 요청합니다.
                        사용해야 할 포트 번호는 첫 번째 작업(<a
                                href="#change-the-default-port">기본 포트 변경</a>)을 시도했는지 여부에 따라 달라집니다. 아래 표시된 출력을 볼 수 있어야 합니다.
                        .</p>
                    <img src="server_get_started_add_new_http_endpoint_output.png"
                         alt="Ktor에서 온 Hello를 표시하는 브라우저 화면" width="706"/>
                    <p>HTTP 요청 파일을 생성했다면 거기서도 새 엔드포인트를 확인할 수 있습니다.</p>
                    <img src="server_get_started_add_new_http_endpoint.png" alt="IntelliJ IDEA의 HTTP 요청 파일"
                         width="450"/>
                    <p>참고로, 서로 다른 요청을 구분하기 위해 세 개의 해시 (###)가 포함된 줄이 필요합니다.</p>
                </step>
            </procedure>
        </chapter>
        <chapter title="정적 콘텐츠 구성" id="configure-static-content">
            <p><ui-path>프로젝트</ui-path>
                도구 창에서 <Path>src/main/kotlin/com/example/plugins</Path>
                폴더로 이동하여 다음 단계를 따르십시오.
            </p>
            <procedure>
                <step>
                    <p><code>Routing.kt</code> 파일을 엽니다.</p>
                    <p>다시 한번, 이는 기본 콘텐츠여야 합니다.</p>
                    [object Promise]
                    <p>이 작업을 위해서는 <a href="#add-a-new-http-endpoint">새 HTTP 엔드포인트 추가</a>에 지정된 추가 엔드포인트에 대한 콘텐츠를 삽입했는지 여부는 중요하지 않습니다.</p>
                </step>
                <step>
                    <p>라우팅 섹션에 다음 줄을 추가합니다.</p>
                    [object Promise]
                    <p>이 줄의 의미는 다음과 같습니다.</p>
                    <list type="bullet">
                        <li><code>staticResources()</code>를 호출하는 것은 Ktor에게 우리 애플리케이션이 HTML 및 JavaScript 파일과 같은 표준 웹사이트 콘텐츠를 제공할 수 있도록 하기를 원한다는 것을 알려줍니다. 이 콘텐츠는 브라우저 내에서 실행될 수 있지만, 서버의 관점에서는 정적 콘텐츠로 간주됩니다.
                        </li>
                        <li>URL <code>/content</code>는 이 콘텐츠를 가져오는 데 사용되어야 할 경로를 지정합니다.
                        </li>
                        <li>경로 <code>mycontent</code>는 정적 콘텐츠가 존재할 폴더의 이름입니다. Ktor는 이 폴더를 <code>resources</code> 디렉터리 내에서 찾을 것입니다.
                        </li>
                    </list>
                </step>
                <step>
                    <p>다음 임포트를 추가합니다.</p>
                    [object Promise]
                </step>
                <step>
                    <p><control>프로젝트</control>
                        도구 창에서 <code>src/main/resources</code> 폴더를 마우스 오른쪽 버튼으로 클릭하고
                        <control>새로 만들기 | 디렉터리</control>를
                        선택합니다.
                    </p>
                    <p>또는 <code>src/main/resources</code> 폴더를 선택하고
                        <shortcut>⌘Сmd+N</shortcut>을
                        누른 다음
                        <control>디렉터리</control>를
                        클릭합니다.
                    </p>
                </step>
                <step>
                    <p>새 디렉터리 이름을 <code>mycontent</code>로 지정하고
                        <shortcut>↩Enter</shortcut>를
                        누릅니다.
                    </p>
                </step>
                <step>
                    <p>새로 생성된 폴더를 마우스 오른쪽 버튼으로 클릭하고
                        <control>새로 만들기 | 파일</control>을
                        클릭합니다.
                    </p>
                </step>
                <step>
                    <p>새 파일 이름을 "sample.html"로 지정하고
                        <shortcut>↩Enter</shortcut>를
                        누릅니다.
                    </p>
                </step>
                <step>
                    <p>새로 생성된 파일 페이지를 유효한 HTML로 채웁니다. 예를 들어:</p>
                    [object Promise]
                </step>
                <step>
                    <p>애플리케이션을 다시 시작하려면 다시 실행 버튼(<img alt="IntelliJ IDEA 다시 실행 버튼 아이콘"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)을
                        클릭합니다.</p>
                </step>
                <step>
                    <p><a href="http://0.0.0.0:9292/content/sample.html">http://0.0.0.0:9292/content/sample.html</a>로
                        브라우저를 열면 샘플 페이지의 콘텐츠가 표시되어야 합니다.</p>
                    <img src="server_get_started_configure_static_content_output.png"
                         alt="브라우저에서 정적 페이지의 출력" width="706"/>
                </step>
            </procedure>
        </chapter>
        <chapter title="통합 테스트 작성" id="write-an-integration-test">
            <p>
                Ktor는 <Links href="/ktor/server-testing" summary="특수 테스트 엔진을 사용하여 서버 애플리케이션을 테스트하는 방법을 배웁니다.">통합 테스트 생성</Links>을 지원하며, 생성된 프로젝트에는 이 기능이 번들로 제공됩니다.
            </p>
            <p>이를 활용하려면 다음 단계를 따르십시오.</p>
            <procedure>
                <step>
                    <p>
                        <Path>src</Path>
                        아래에 "test"라는 새 디렉터리를 생성하고, 그 안에 "kotlin"이라는 하위 디렉터리를 생성합니다.
                    </p>
                </step>
                <step>
                    <p><Path>src/test/kotlin</Path>
                        안에 "com.example"라는 새 패키지를 생성합니다.
                    </p>
                </step>
                <step>
                    <p>
                        <Path>src/test/kotlin/com.example</Path>
                        내에 "ApplicationTest.kt"라는 새 파일을 생성합니다.
                    </p>
                </step>
                <step>
                    <p><code>ApplicationTest.kt</code> 파일을 열고 아래 코드를 추가합니다.</p>
                    [object Promise]
                    <p><code>testApplication()</code> 메서드는 Ktor의 새 인스턴스를 생성합니다. 이 인스턴스는 Netty와 같은 서버와 달리 테스트 환경에서 실행됩니다.</p>
                    <p>그런 다음 <code>application()</code> 메서드를 사용하여 <code>embeddedServer()</code>에서 호출되는 것과 동일한 설정을 호출할 수 있습니다.</p>
                    <p>마지막으로, 내장된 <code>client</code> 객체와 JUnit 어설션을 사용하여 샘플 요청을 보내고 응답을 확인할 수 있습니다.</p>
                </step>
                <step>
                    <p>다음 필수 임포트를 추가합니다.</p>
                    [object Promise]
                </step>
            </procedure>
            <p>
                테스트는 IntelliJ IDEA에서 테스트를 실행하는 표준 방법 중 어떤 것이든 사용할 수 있습니다. Ktor의 새 인스턴스를 실행하고 있으므로 테스트의 성공 또는 실패는 애플리케이션이 0.0.0.0에서 실행 중인지 여부에 의존하지 않습니다.
            </p>
            <p>
                <a href="#add-a-new-http-endpoint">새 HTTP 엔드포인트 추가</a>를 성공적으로 완료했다면,
                다음 추가 테스트를 추가할 수 있어야 합니다.
            </p>
            [object Promise]
            <p>다음 추가 임포트가 필요합니다.</p>
            [object Promise]
        </chapter>
        <chapter title="오류 핸들러 등록" id="register-error-handlers">
            <p>
                Ktor 애플리케이션에서 <Links href="/ktor/server-status-pages" summary="%plugin_name%은 Ktor 애플리케이션이 발생한 예외 또는 상태 코드에 기반하여 모든 실패 상태에 적절하게 응답할 수 있도록 합니다.">StatusPages
                플러그인</Links>을 사용하여 오류를 처리할 수 있습니다.
            </p>
            <p>
                이 플러그인은 기본적으로 프로젝트에 포함되어 있지 않습니다. Ktor 프로젝트 생성기의
                <ui-path>플러그인</ui-path>
                섹션 또는 IntelliJ IDEA의 프로젝트 마법사를 통해 프로젝트에 추가할 수 있었습니다. 이미 프로젝트를 생성했으므로, 다음 단계에서는 플러그인을 수동으로 추가하고 구성하는 방법을 배울 것입니다.
            </p>
            <p>
                이를 달성하기 위한 네 가지 단계가 있습니다.
            </p>
            <list type="decimal">
                <li><a href="#add-dependency">Gradle 빌드 파일에 새 종속성 추가.</a></li>
                <li><a href="#install-plugin-and-specify-handler">플러그인 설치 및 예외 핸들러 지정.</a></li>
                <li><a href="#write-sample-code">핸들러를 트리거하는 샘플 코드 작성.</a></li>
                <li><a href="#restart-and-invoke">샘플 코드 재시작 및 호출.</a></li>
            </list>
            <procedure title="새 종속성 추가" id="add-dependency">
                <p><control>프로젝트</control>
                    도구 창에서 프로젝트 루트 폴더로 이동하여 다음 단계를 따르십시오.
                </p>
                <step>
                    <p><code>build.gradle.kts</code> 파일을 엽니다.</p>
                </step>
                <step>
                    <p>종속성 섹션에 아래와 같이 추가 종속성을 추가합니다.</p>
                    [object Promise]
                    <p>이 작업을 완료하면 새 종속성을 반영하기 위해 프로젝트를 다시 로드해야 합니다.</p>
                </step>
                <step>
                    <p>macOS에서는
                        <shortcut>Shift+⌘Cmd+I</shortcut>를,
                        Windows에서는
                        <shortcut>Ctrl+Shift+O</shortcut>를
                        눌러 프로젝트를 다시 로드합니다.
                    </p>
                </step>
            </procedure>
            <procedure title="플러그인 설치 및 예외 핸들러 지정"
                       id="install-plugin-and-specify-handler">
                <step>
                    <p><code>Routing.kt</code> 파일의 <code>configureRouting()</code> 메서드로 이동하여 다음 코드 줄을 추가합니다.</p>
                    [object Promise]
                    <p>이 줄들은 <code>StatusPages</code> 플러그인을 설치하고 <code>IllegalStateException</code> 유형의 예외가 발생할 때 취할 동작을 지정합니다.</p>
                </step>
                <step>
                    <p>다음 임포트를 추가합니다.</p>
                    [object Promise]
                </step>
            </procedure>
            <p>
                참고로, HTTP 오류 코드는 일반적으로 응답에 설정되지만, 이 작업의 목적상 출력은 브라우저에 직접 표시됩니다.
            </p>
            <procedure title="핸들러를 트리거하는 샘플 코드 작성" id="write-sample-code">
                <step>
                    <p><code>configureRouting()</code> 메서드 내에서 아래와 같이 추가 줄을 추가합니다.</p>
                    [object Promise]
                    <p>이제 URL <code>/error-test</code>를 가진 엔드포인트를 추가했습니다. 이 엔드포인트가 트리거되면 핸들러에 사용된 유형의 예외가 발생합니다.</p>
                </step>
            </procedure>
            <procedure title="샘플 코드 재시작 및 호출" id="restart-and-invoke">
                <step>
                    <p>애플리케이션을 다시 시작하려면 다시 실행 버튼(<img alt="IntelliJ IDEA 다시 실행 버튼 아이콘"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)을
                        클릭합니다.</p></step>
                <step>
                    <p>브라우저에서 URL <a href="http://0.0.0.0:9292/error-test">http://0.0.0.0:9292/error-test</a>로
                        이동합니다. 아래와 같이 오류 메시지가 표시되어야 합니다.</p>
                    <img src="server_get_started_register_error_handler_output.png"
                         alt="`App in illegal state as Too Busy` 메시지가 있는 브라우저 화면" width="706"/>
                </step>
            </procedure>
        </chapter>
    </chapter>
    <chapter title="다음 단계" id="next_steps">
        <p>
            추가 작업의 끝까지 완료했다면, 이제 Ktor 서버 구성, Ktor 플러그인 통합 및 새 라우트 구현에 대한 이해를 갖추게 됩니다. 하지만 이것은 시작에 불과합니다. Ktor의 기초 개념을 더 깊이 탐구하려면 이 가이드의 다음 튜토리얼로 계속 진행하십시오.
        </p>
        <p>
            다음으로, <Links href="/ktor/server-requests-and-responses" summary="Ktor로 작업 관리자 애플리케이션을 구축하며 Kotlin에서 라우팅, 요청 처리 및 매개변수 사용의 기본 사항을 배웁니다.">작업 관리자 애플리케이션을 생성하여 요청을 처리하고 응답을 생성하는</Links> 방법을 배울 것입니다.
        </p>
    </chapter>
</topic>