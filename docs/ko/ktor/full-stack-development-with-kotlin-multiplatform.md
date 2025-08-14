```xml
<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="Kotlin Multiplatform로 풀스택 애플리케이션 빌드하기" id="full-stack-development-with-kotlin-multiplatform">
<show-structure for="chapter, procedure" depth="2"/>
<web-summary>
    Kotlin 및 Ktor를 사용하여 크로스 플랫폼 풀스택 애플리케이션을 개발하는 방법을 알아보세요. 이 튜토리얼에서는 Kotlin Multiplatform을 사용하여 Android, iOS, 데스크톱용 앱을 빌드하고 Ktor를 사용해 데이터를 손쉽게 처리하는 방법을 다룹니다.
</web-summary>
<link-summary>
    Kotlin 및 Ktor로 크로스 플랫폼 풀스택 애플리케이션을 개발하는 방법을 알아보세요.
</link-summary>
<card-summary>
    Kotlin 및 Ktor로 크로스 플랫폼 풀스택 애플리케이션을 개발하는 방법을 알아보세요.
</card-summary>
<tldr>
    <var name="example_name" value="full-stack-task-manager"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
    <p>
        <b>사용된 플러그인</b>: <Links href="/ktor/server-routing" summary="라우팅은 서버 애플리케이션에서 수신 요청을 처리하기 위한 핵심 플러그인입니다.">Routing</Links>,
        <a href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>,
        <Links href="/ktor/server-serialization" summary="Content Negotiation 플러그인은 클라이언트와 서버 간의 미디어 유형 협상 및 특정 형식으로 콘텐츠를 직렬화/역직렬화하는 두 가지 주요 목적을 제공합니다.">Content Negotiation</Links>,
        <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a>,
        <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html">Kotlin Multiplatform</a>
    </p>
</tldr>
<p>
    이 글에서는 Android, iOS 및 데스크톱 플랫폼에서 실행되는 Kotlin 풀스택 애플리케이션을 개발하고, Ktor를 활용하여 원활한 데이터 처리를 수행하는 방법을 알아봅니다.
</p>
<p>이 튜토리얼을 마치면 다음을 수행하는 방법을 알게 될 것입니다:</p>
<list>
    <li>Kotlin Multiplatform을 사용하여 풀스택 애플리케이션을 생성합니다.
    </li>
    <li>IntelliJ IDEA로 생성된 프로젝트를 이해합니다.</li>
    <li>Ktor 서비스를 호출하는 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 클라이언트를 생성합니다.
    </li>
    <li>설계의 다양한 계층에서 공유 유형을 재사용합니다.</li>
    <li>멀티플랫폼 라이브러리를 올바르게 포함하고 구성합니다.</li>
</list>
<p>
    이전 튜토리얼에서는 Task Manager 예시를 사용하여
    <Links href="/ktor/server-requests-and-responses" summary="Ktor와 Kotlin으로 태스크 관리자 애플리케이션을 빌드하여 라우팅, 요청 처리 및 매개변수 기본 사항을 배웁니다.">요청을 처리하고</Links>,
    <Links href="/ktor/server-create-restful-apis" summary="JSON 파일을 생성하는 RESTful API 예시를 통해 Kotlin 및 Ktor를 사용하여 백엔드 서비스를 빌드하는 방법을 배웁니다.">RESTful API를 생성하고</Links>,
    <Links href="/ktor/server-integrate-database" summary="Ktor 서비스와 Exposed SQL 라이브러리를 사용하여 데이터베이스 리포지토리를 연결하는 과정을 배웁니다.">Exposed로 데이터베이스를 통합</Links>했습니다.
    클라이언트 애플리케이션은 Ktor의 기본 사항을 학습하는 데 집중할 수 있도록 최소한으로 유지했습니다.
</p>
<p>
    Ktor 서비스를 사용하여 표시할 데이터를 가져오는 Android, iOS 및 데스크톱 플랫폼을 대상으로 하는 클라이언트를 생성합니다. 가능한 한 클라이언트와 서버 간에 데이터 유형을 공유하여 개발 속도를 높이고 오류 발생 가능성을 줄일 수 있습니다.
</p>
<chapter title="사전 요구 사항" id="prerequisites">
    <p>
        이전 글에서와 같이 IntelliJ IDEA를 IDE로 사용합니다. 환경을 설치하고 구성하려면
        <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html">
            Kotlin Multiplatform 빠른 시작
        </a> 가이드를 참조하세요.
    </p>
    <p>
        Compose Multiplatform을 처음 사용하는 경우, 이 튜토리얼을 시작하기 전에
        <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-getting-started.html">
            Compose Multiplatform 시작하기
        </a>
        튜토리얼을 완료하는 것이 좋습니다. 작업의 복잡성을 줄이려면
        단일 클라이언트 플랫폼에 집중할 수 있습니다. 예를 들어, iOS를 사용해 본 적이 없다면
        데스크톱 또는 Android 개발에 집중하는 것이 현명할 수 있습니다.
    </p>
</chapter>
<chapter title="새 프로젝트 생성" id="create-project">
    <p>
        Ktor 프로젝트 생성기 대신 IntelliJ IDEA의 Kotlin Multiplatform 프로젝트 마법사를 사용합니다.
        이 마법사는 클라이언트와 서비스로 확장할 수 있는 기본 멀티플랫폼 프로젝트를 생성합니다.
        클라이언트는 SwiftUI와 같은 네이티브 UI 라이브러리를 사용할 수도 있지만, 이 튜토리얼에서는
        <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a>을 사용하여
        모든 플랫폼에 공유 UI를 생성합니다.
    </p>
    <procedure id="generate-project">
        <step>
            IntelliJ IDEA를 실행합니다.
        </step>
        <step>
            IntelliJ IDEA에서 <ui-path>File | New | Project</ui-path>를 선택합니다.
        </step>
        <step>
            왼쪽 패널에서 <ui-path>Kotlin Multiplatform</ui-path>를 선택합니다.
        </step>
        <step>
            <ui-path>New Project</ui-path> 창에서 다음 필드를 지정합니다:
            <list>
                <li>
                    <ui-path>이름</ui-path>
                    : full-stack-task-manager
                </li>
                <li>
                    <ui-path>그룹</ui-path>
                    : com.example.ktor
                </li>
            </list>
        </step>
        <step>
            <p>
                대상 플랫폼으로 <ui-path>Android</ui-path>,
                <ui-path>Desktop</ui-path>, 그리고
                <ui-path>Server</ui-path>를 선택합니다.
            </p>
        </step>
        <step>
            <p>
                Mac을 사용하는 경우 <ui-path>iOS</ui-path>도 선택합니다. <ui-path>Share UI</ui-path>
                옵션이 선택되었는지 확인합니다.
                <img style="block" src="full_stack_development_tutorial_create_project.png"
                     alt="Kotlin Multiplatform 마법사 설정" width="706" border-effect="rounded"/>
            </p>
        </step>
        <step>
            <p>
                <control>Create</control>
                버튼을 클릭하고 IDE가 프로젝트를 생성하고 임포트할 때까지 기다립니다.
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="서비스 실행" id="run-service">
    <procedure id="run-service-procedure">
        <step>
            <ui-path>Project</ui-path>
            뷰에서 <Path>server/src/main/kotlin/com/example/ktor/full_stack_task_manager</Path>(으)로 이동하여
            <Path>Application.kt</Path>
            파일을 엽니다.
        </step>
        <step>
            애플리케이션을 시작하려면 <code>main()</code> 함수 옆에 있는
            <ui-path>Run</ui-path>
            버튼
            (<img src="intellij_idea_run_icon.svg"
                  style="inline" height="16" width="16"
                  alt="IntelliJ IDEA 실행 아이콘"/>)
            을 클릭합니다.
            <p>
                <ui-path>Run</ui-path>
                도구 창에 "Responding at http://0.0.0.0:8080" 메시지로 끝나는 로그가 포함된 새 탭이 열립니다.
            </p>
        </step>
        <step>
            <p>
                <a href="http://0.0.0.0:8080/">http://0.0.0.0:8080/</a>로 이동하여 애플리케이션을 엽니다.
                브라우저에 Ktor 메시지가 표시되어야 합니다.
                <img src="full_stack_development_tutorial_run.png"
                     alt="Ktor 서버 브라우저 응답" width="706"
                     border-effect="rounded" style="block"/>
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="프로젝트 살펴보기" id="examine-project">
    <p>
        프로젝트에는 세 개의 Kotlin 모듈이 있는데,
        <Path>server</Path>
        폴더는 그중 하나입니다. 다른 두 개는
        <Path>shared</Path>
        와
        <Path>composeApp</Path>
        입니다.
    </p>
    <p>
        <Path>server</Path>
        모듈의 구조는 <a href="https://start.ktor.io/">Ktor Project
        Generator</a>가 생성한 것과 매우 유사합니다.
        여기에는 플러그인과 의존성을 선언하는 전용 빌드 파일과 Ktor
        서비스를 빌드하고 시작하는 코드가 포함된 소스 세트가 있습니다:
    </p>
    <img src="full_stack_development_tutorial_server_folder.png"
         alt="Kotlin Multiplatform 프로젝트의 server 폴더 내용" width="300"
         border-effect="line"/>
    <p>
        <Path>Application.kt</Path>
        파일의 라우팅 지침을 살펴보면 <code>greet()</code> 함수 호출을 볼 수 있습니다:
    </p>
    [object Promise]
    <p>
        이것은 <code>Greeting</code> 유형의 인스턴스를 생성하고 <code>greet()</code> 메서드를 호출합니다.
        <code>Greeting</code> 클래스는 <Path>shared</Path> 모듈에 정의되어 있습니다:
        <img src="full_stack_development_tutorial_shared_module.png"
             alt="IntelliJ IDEA에서 Greeting.kt 및 Platform.kt 열기" width="706"
             border-effect="line" style="block"/>
    </p>
    <p>
        <Path>shared</Path>
        모듈에는 다양한 대상 플랫폼에서 사용될 코드가 포함되어 있습니다.
    </p>
    <p>
        <Path>shared</Path> 모듈 세트의 <Path>commonMain</Path> 소스는 모든 플랫폼에서 사용될 유형을 보유합니다.
        보시다시피 여기에 <code>Greeting</code> 유형이 정의되어 있습니다.
        또한 서버와 모든 클라이언트 플랫폼 간에 공유될 공통 코드를 여기에 배치합니다.
    </p>
    <p>
        <Path>shared</Path>
        모듈에는 클라이언트를 제공하려는 각 플랫폼에 대한 소스 세트도 포함되어 있습니다. 이는
        <Path>commonMain</Path>
        내에 선언된 유형이 대상 플랫폼에 따라 달라지는 기능을 요구할 수 있기 때문입니다.
        <code>Greeting</code> 유형의 경우 플랫폼별 API를 사용하여 현재 플랫폼의 이름을 가져오려 합니다.
        이는 <a
            href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html">예상(expected) 및 실제(actual) 선언</a>을 통해 달성됩니다.
    </p>
    <p>
        <Path>shared</Path>
        모듈의 <Path>commonMain</Path> 소스 세트에서 <code>expect</code> 키워드를 사용하여 <code>getPlatform()</code> 함수를 선언합니다:
    </p>
    <tabs>
        <tab title="commonMain/Platform.kt" id="commonMain">
            [object Promise]
        </tab>
    </tabs>
    <p>그러면 각 대상 플랫폼은 아래와 같이 <code>getPlatform()</code> 함수의 <code>actual</code> 선언을 제공해야 합니다:
    </p>
    <tabs>
        <tab title="Platform.ios.kt" id="iosMain">
            [object Promise]
        </tab>
        <tab title="Platform.android.kt" id="androidMain">
            [object Promise]
        </tab>
        <tab title="Platform.jvm.kt" id="jvmMain">
            [object Promise]
        </tab>
        <tab title="Platform.wasmJs.kt" id="wasmJsMain">
            [object Promise]
        </tab>
    </tabs>
    <p>
        프로젝트에는 <Path>composeApp</Path> 모듈이라는 추가 모듈이 하나 더 있습니다.
        여기에는 Android, iOS, 데스크톱 및 웹 클라이언트 앱에 대한 코드가 포함되어 있습니다.
        이 앱들은 현재 Ktor 서비스에 연결되어 있지 않지만, 공유된
        <code>Greeting</code> 클래스를 사용합니다.
    </p>
</chapter>
<chapter title="클라이언트 애플리케이션 실행" id="run-client-app">
    <p>
        대상에 대한 실행 구성을 실행하여 클라이언트 애플리케이션을 실행할 수 있습니다. iOS 시뮬레이터에서 애플리케이션을 실행하려면 아래 단계를 따릅니다:
    </p>
    <procedure id="run-ios-app-procedure">
        <step>
            IntelliJ IDEA에서
            <Path>iosApp</Path>
            실행 구성과 시뮬레이션된 장치를 선택합니다.
            <img src="full_stack_development_tutorial_run_configurations.png"
                 alt="실행 &amp; 디버그 창" width="400"
                 border-effect="line" style="block"/>
        </step>
        <step>
            구성을 실행하려면
            <ui-path>Run</ui-path>
            버튼
            (<img src="intellij_idea_run_icon.svg"
                  style="inline" height="16" width="16"
                  alt="IntelliJ IDEA 실행 아이콘"/>)
            을 클릭합니다.
        </step>
        <step>
            <p>
                iOS 앱을 실행하면 내부적으로 Xcode로 빌드되어 iOS 시뮬레이터에서 실행됩니다.
                앱은 클릭 시 이미지를 토글하는 버튼을 표시합니다.
                <img style="block" src="full_stack_development_tutorial_run_ios.gif"
                     alt="iOS 시뮬레이터에서 앱 실행 중" width="300" border-effect="rounded"/>
            </p>
            <p>
                버튼이 처음 눌리면 현재 플랫폼의 세부 정보가 텍스트에 추가됩니다. 이를 위한 코드는
                <Path>composeApp/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager/App.kt</Path>
                에서 찾을 수 있습니다:
            </p>
            [object Promise]
            <p>
                이것은 이 글에서 나중에 수정할 컴포저블 함수입니다. 현재 중요한 것은 이것이 UI를 표시하고 공유 <code>Greeting</code> 유형을 사용하며, 이 <code>Greeting</code> 유형은 다시 공통 <code>Platform</code> 인터페이스를 구현하는 플랫폼별 클래스를 사용한다는 것입니다.
            </p>
        </step>
    </procedure>
    <p>
        이제 생성된 프로젝트의 구조를 이해했으므로, 태스크 관리자 기능을 점진적으로 추가할 수 있습니다.
    </p>
</chapter>
<chapter title="모델 유형 추가" id="add-model-types">
    <p>
        먼저, 모델 유형을 추가하고 클라이언트와 서버 모두에서 액세스할 수 있는지 확인합니다.
    </p>
    <procedure id="add-model-types-procedure">
        <step>
            <Path>shared/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager</Path>(으)로 이동하여
            <Path>model</Path>
            이라는 새 패키지를 생성합니다.
        </step>
        <step>
            새 패키지 안에
            <Path>Task.kt</Path>
            라는 새 파일을 생성합니다.
        </step>
        <step>
            <p>
                우선순위를 나타내는 <code>enum</code>과 작업을 나타내는 <code>class</code>를 추가합니다. <code>Task</code>
                클래스는 <code>kotlinx.serialization</code>
                라이브러리의 <code>Serializable</code> 유형으로 주석 처리됩니다:
            </p>
            [object Promise]
            <p>
                임포트도, 주석도 컴파일되지 않는다는 것을 알 수 있습니다. 이는 프로젝트에 아직
                <code>kotlinx.serialization</code>
                라이브러리에 대한 의존성이 없기 때문입니다.
            </p>
        </step>
        <step>
            <p>
                <Path>shared/build.gradle.kts</Path>(으)로 이동하여 직렬화 플러그인을 추가합니다:
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                동일한 파일에서 <Path>commonMain</Path>
                소스 세트에 새 의존성을 추가합니다:
            </p>
            [object Promise]
        </step>
        <step>
            <Path>gradle/libs.versions.toml</Path>(으)로 이동하여 다음을 정의합니다:
            [object Promise]
        </step>
        <!-- the plugin version can also be set in the version catalog -->
        <step>
            IntelliJ IDEA에서 <ui-path>Build | Sync Project with Gradle Files</ui-path>를 선택하여 업데이트를 적용합니다. Gradle 임포트가 완료되면 <Path>Task.kt</Path> 파일이 성공적으로 컴파일되는 것을 확인할 수 있습니다.
        </step>
    </procedure>
    <!-- The following seems like a lot of nuance to cover for this newbie-oriented tutorial.
     I think at this point it's enough to know that the serialization library requires a Gradle plugin.
     If it's important, it would be nice to make the terminology more precise: earlier we said it won't compile, and now
     we're saying it would, so I'm not not sure what's going on in the end.
     -->
    <p>
        직렬화 플러그인을 포함하지 않아도 코드는 컴파일되었겠지만, 네트워크를 통해 <code>Task</code> 객체를 직렬화하는 데 필요한 유형은 생성되지 않았을 것입니다. 이로 인해 서비스를 호출하려 할 때 런타임 오류가 발생할 수 있습니다.
    </p>
    <p>
        직렬화 플러그인을 다른 모듈(<Path>server</Path>
        또는
        <Path>composeApp</Path>
        등)에 배치해도 빌드 시 오류가 발생하지는 않았을 것입니다. 하지만 다시 말하지만, 직렬화를 위해 필요한 추가 유형은 생성되지 않아 런타임 오류가 발생할 수 있습니다.
    </p>
</chapter>
<chapter title="서버 생성" id="create-server">
    <p>
        다음 단계는 태스크 관리자를 위한 서버 구현을 생성하는 것입니다.
    </p>
    <procedure id="create-server-procedure">
        <step>
            <Path>server/src/main/kotlin/com/example/ktor/full_stack_task_manager</Path>
            폴더로 이동하여 <Path>model</Path>
            이라는 하위 패키지를 생성합니다.
        </step>
        <step>
            <p>
                이 패키지 안에 새로운
                <Path>TaskRepository.kt</Path>
                파일을 생성하고 리포지토리를 위한 다음 인터페이스를 추가합니다:
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                동일한 패키지 안에 다음 클래스를 포함하는 새로운 파일을 생성합니다:
                <Path>InMemoryTaskRepository.kt</Path>
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                <Path>server/src/main/kotlin/.../Application.kt</Path>(으)로 이동하여
                기존 코드를 아래 구현으로 대체합니다:
            </p>
            [object Promise]
            <p>
                이 구현은 이전 튜토리얼의 구현과 매우 유사하지만, 이제 모든 라우팅 코드를 단순화를 위해 <code>Application.module()</code> 함수 안에 배치했다는 점이 다릅니다.
            </p>
            <p>
                이 코드를 입력하고 임포트를 추가하면 웹 클라이언트와 상호 작용하기 위한 <Links href="/ktor/server-cors" summary="필수 의존성: io.ktor:%artifact_name% 코드 예시: %example_name% 네이티브 서버 지원: ✅">CORS</Links> 플러그인을 포함하여 의존성으로 포함되어야 하는 여러 Ktor 플러그인을 사용하기 때문에 여러 컴파일러 오류가 발생할 수 있습니다.
            </p>
        </step>
        <step>
            <Path>gradle/libs.versions.toml</Path>
            파일을 열고 다음 라이브러리를 정의합니다:
            [object Promise]
        </step>
        <step>
            <p>
                서버 모듈 빌드 파일 (
                <Path>server/build.gradle.kts</Path>
                )을 열고 다음 의존성을 추가합니다:
            </p>
            [object Promise]
        </step>
        <step>
            다시 한번, 메인 메뉴에서 <ui-path>Build | Sync Project with Gradle Files</ui-path>를 선택합니다.
            임포트가 완료되면 <code>ContentNegotiation</code> 유형 및 <code>json()</code> 함수에 대한 임포트가 올바르게 작동하는 것을 확인할 수 있습니다.
        </step>
        <step>
            서버를 다시 실행합니다. 이제 브라우저에서 라우트에 접근할 수 있어야 합니다.
        </step>
        <step>
            <p>
                <a href="http://0.0.0.0:8080/tasks"></a>
                및 <a href="http://0.0.0.0:8080/tasks/byPriority/Medium"></a>
                으로 이동하여 JSON 형식으로 태스크가 포함된 서버 응답을 확인합니다.
                <img style="block" src="full_stack_development_tutorial_run_server.gif"
                     width="707" border-effect="rounded" alt="브라우저의 서버 응답"/>
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="클라이언트 생성" id="create-client">
    <p>
        클라이언트가 서버에 접근할 수 있도록 Ktor 클라이언트를 포함해야 합니다. 여기에는 세 가지 유형의 의존성이 관련됩니다:
    </p>
    <list>
        <li>Ktor 클라이언트의 핵심 기능.</li>
        <li>네트워킹을 처리하는 플랫폼별 엔진.</li>
        <li>콘텐츠 협상 및 직렬화 지원.</li>
    </list>
    <procedure id="create-client-procedure">
        <step>
            <Path>gradle/libs.versions.toml</Path>
            파일에 다음 라이브러리를 추가합니다:
            [object Promise]
        </step>
        <step>
            <p>
                <Path>composeApp/build.gradle.kts</Path>(으)로 이동하여 다음 의존성을 추가합니다:
            </p>
            [object Promise]
            <p>
                이 작업이 완료되면 클라이언트가 Ktor 클라이언트를 위한 얇은 래퍼(wrapper) 역할을 하도록 <code>TaskApi</code> 유형을 추가할 수 있습니다.
            </p>
        </step>
        <step>
            메인 메뉴에서 <ui-path>Build | Sync Project with Gradle Files</ui-path>를 선택하여
            빌드 파일의 변경 사항을 임포트합니다.
        </step>
        <step>
            <Path>composeApp/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager</Path>(으)로 이동하여
            <Path>network</Path>
            라는 새 패키지를 생성합니다.
        </step>
        <step>
            <p>
                새 패키지 안에 클라이언트 구성을 위한 새로운
                <Path>HttpClientManager.kt</Path>
                를 생성합니다:
            </p>
            [object Promise]
            <p>
                <code>1.2.3.4</code>를 현재 머신의 IP 주소로 바꿔야 합니다. Android 가상 기기나 iOS 시뮬레이터에서 실행되는 코드에서는 <code>0.0.0.0</code> 또는 <code>localhost</code>로 호출할 수 없습니다.
                <!-- should we include instructions on finding out the IP address?
                     `ipconfig getifaddr en0`or something -->
            </p>
        </step>
        <step>
            <p>
                동일한
                <Path>composeApp/.../full_stack_task_manager/network</Path>
                패키지 안에 다음 구현을 포함하는 새로운
                <Path>TaskApi.kt</Path>
                파일을 생성합니다:
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                <Path>commonMain/.../App.kt</Path>(으)로 이동하여
                App 컴포저블을 아래 구현으로 대체합니다.
                이 코드는 <code>TaskApi</code> 유형을 사용하여 서버에서 태스크 목록을 검색한 다음
                각 태스크의 이름을 열에 표시합니다:
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                서버가 실행 중인 동안, <ui-path>iosApp</ui-path> 실행 구성을 실행하여 iOS 애플리케이션을 테스트합니다.
            </p>
        </step>
        <step>
            <p>
                <control>Fetch Tasks</control>
                버튼을 클릭하여 태스크 목록을 표시합니다:
                <img style="block" src="full_stack_development_tutorial_run_iOS.png"
                     alt="iOS에서 앱 실행 중" width="363" border-effect="rounded"/>
            </p>
            <note>
                이 데모에서는 명확성을 위해 프로세스를 간소화했습니다. 실제 애플리케이션에서는 네트워크를 통해 암호화되지 않은 데이터를 보내는 것을 피하는 것이 중요합니다.
            </note>
        </step>
        <step>
            <p>
                Android 플랫폼에서는 애플리케이션에 네트워킹 권한을 명시적으로 부여하고
                데이터를 평문(cleartext)으로 주고받을 수 있도록 허용해야 합니다. 이러한 권한을 활성화하려면
                <Path>composeApp/src/androidMain/AndroidManifest.xml</Path>
                을 열고 다음 설정을 추가합니다:
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                <ui-path>composeApp</ui-path> 실행 구성을 사용하여 Android 애플리케이션을 실행합니다.
                이제 Android 클라이언트도 실행되는 것을 확인할 수 있습니다:
                <img style="block" src="full_stack_development_tutorial_run_android.png"
                     alt="Android에서 앱 실행 중" width="350" border-effect="rounded"/>
            </p>
        </step>
        <step>
            <p>
                데스크톱 클라이언트의 경우, 컨테이너 창에 크기와 제목을 할당해야 합니다.
                <Path>composeApp/src/desktopMain/.../main.kt</Path>
                파일을 열고 <code>title</code>을 변경하고 <code>state</code> 속성을 설정하여 코드를 수정합니다:
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                <ui-path>composeApp [desktop]</ui-path> 실행 구성을 사용하여 데스크톱 애플리케이션을 실행합니다:
                <img style="block" src="full_stack_development_tutorial_run_desktop_resized.png"
                     alt="데스크톱에서 앱 실행 중" width="400" border-effect="rounded"/>
            </p>
        </step>
        <step>
            <p>
                <ui-path>composeApp [wasmJs]</ui-path> 실행 구성을 사용하여 웹 클라이언트를 실행합니다:
            </p>
            <img style="block" src="full_stack_development_tutorial_run_web.png"
                 alt="데스크톱에서 앱 실행 중" width="400" border-effect="rounded"/>
        </step>
    </procedure>
</chapter>
<chapter title="UI 개선" id="improve-ui">
    <p>
        이제 클라이언트가 서버와 통신하지만, 이것은 매력적인 UI라고 할 수 없습니다.
    </p>
    <procedure id="improve-ui-procedure">
        <step>
            <p>
                <Path>composeApp/src/commonMain/.../full_stack_task_manager</Path>
                에 위치한 <Path>App.kt</Path>
                파일을 열고 기존 <code>App</code>을 아래의 <code>App</code> 및 <code>TaskCard</code>
                컴포저블로 대체합니다:
            </p>
            [object Promise]
            <p>
                이 구현을 통해 이제 클라이언트에 기본 기능이 추가되었습니다.
            </p>
            <p>
                <code>LaunchedEffect</code> 유형을 사용하면 모든 태스크가 시작 시 로드되며, <code>LazyColumn</code>
                컴포저블을 통해 사용자는 태스크를 스크롤할 수 있습니다.
            </p>
            <p>
                마지막으로, 별도의 <code>TaskCard</code> 컴포저블이 생성되었으며, 이는 다시
                <code>Card</code>를 사용하여 각 <code>Task</code>의 세부 정보를 표시합니다. 태스크를
                삭제하고 업데이트하는 버튼이 추가되었습니다.
            </p>
        </step>
        <step>
            <p>
                클라이언트 애플리케이션(예: Android 앱)을 다시 실행합니다.
                이제 태스크를 스크롤하고, 세부 정보를 확인하고, 삭제할 수 있습니다:
                <img style="block" src="full_stack_development_tutorial_improved_ui.gif"
                     alt="개선된 UI로 Android에서 앱 실행 중" width="350" border-effect="rounded"/>
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="업데이트 기능 추가" id="add-update-functionality">
    <p>
        클라이언트를 완성하려면 태스크 세부 정보를 업데이트할 수 있는 기능을 통합해야 합니다.
    </p>
    <procedure id="add-update-func-procedure">
        <step>
            <Path>composeApp/src/commonMain/.../full_stack_task_manager</Path>
            의 <Path>App.kt</Path>
            파일로 이동합니다.
        </step>
        <step>
            <p>
                <code>UpdateTaskDialog</code> 컴포저블과 필요한 임포트를 아래와 같이 추가합니다:
            </p>
            [object Promise]
            <p>
                이것은 <code>Task</code>의 세부 정보를 대화 상자로 표시하는 컴포저블입니다. <code>description</code>
                과 <code>priority</code>는 <code>TextField</code> 컴포저블 안에 배치되어 업데이트할 수 있습니다.
                사용자가 업데이트 버튼을 누르면 <code>onConfirm()</code> 콜백이 트리거됩니다.
            </p>
        </step>
        <step>
            <p>
                동일한 파일에서 <code>App</code> 컴포저블을 업데이트합니다:
            </p>
            [object Promise]
            <p>
                선택된 현재 태스크라는 추가적인 상태를 저장하고 있습니다. 이 값이 null이 아니면 <code>UpdateTaskDialog</code> 컴포저블을 호출하고, <code>onConfirm()</code> 콜백을 설정하여 <code>TaskApi</code>를 사용하여 서버에 POST 요청을 보냅니다.
            </p>
            <p>
                마지막으로, <code>TaskCard</code> 컴포저블을 생성할 때 <code>onUpdate()</code> 콜백을 사용하여
                <code>currentTask</code> 상태 변수를 설정합니다.
            </p>
        </step>
        <step>
            클라이언트 애플리케이션을 다시 실행합니다. 이제 버튼을 사용하여 각 태스크의 세부 정보를 업데이트할 수 있어야 합니다.
            <img style="block" src="full_stack_development_tutorial_update_task.gif"
                 alt="Android에서 태스크 삭제" width="350" border-effect="rounded"/>
        </p>
        </step>
    </procedure>
</chapter>
<chapter title="다음 단계" id="next-steps">
    <p>
        이 글에서는 Kotlin Multiplatform 애플리케이션 컨텍스트에서 Ktor를 사용했습니다. 이제 여러 서비스와 클라이언트를 포함하고 다양한 플랫폼을 대상으로 하는 프로젝트를 생성할 수 있습니다.
    </p>
    <p>
        보시다시피, 코드 중복이나 불필요한 코드 없이 기능을 구축할 수 있습니다. 프로젝트의 모든 계층에서 필요한 유형은
        <Path>shared</Path>
        멀티플랫폼 모듈에 배치할 수 있습니다. 서비스에만 필요한 기능은
        <Path>server</Path>
        모듈에, 클라이언트에만 필요한 기능은
        <Path>composeApp</Path>
        에 배치됩니다.
    </p>
    <p>
        이러한 종류의 개발은 필연적으로 클라이언트 및 서버 기술에 대한 지식을 요구합니다. 하지만 <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html">Kotlin
        Multiplatform</a> 라이브러리와 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">
        Compose Multiplatform</a>을 사용하여 학습해야 할 새로운 자료의 양을 최소화할 수 있습니다. 처음에는 단일 플랫폼에만 집중하더라도, 애플리케이션에 대한 수요가 증가함에 따라 다른 플랫폼을 쉽게 추가할 수 있습니다.
    </p>
</chapter>