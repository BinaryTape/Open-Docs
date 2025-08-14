<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="자동 재로딩"
       id="server-auto-reload" help-id="Auto_reload">
    <tldr>
        <p>
            <b>코드 예제</b>:
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-engine-main">autoreload-engine-main</a>,
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-embedded-server">autoreload-embedded-server</a>
        </p>
    </tldr>
    <link-summary>
        코드 변경 시 애플리케이션 클래스를 다시 로드하는 자동 재로딩 사용법을 학습합니다.
    </link-summary>
    <p>
        <Links href="/ktor/server-run" summary="서버 Ktor 애플리케이션 실행 방법을 학습합니다.">개발 중 서버를 재시작하는 데</Links> 시간이 걸릴 수 있습니다.
        Ktor는 코드 변경 시 애플리케이션 클래스를 다시 로드하여 빠른 피드백 루프를 제공하는 <emphasis>자동 재로딩</emphasis>을 사용하여 이러한 제약을 극복할 수 있도록 합니다.
        자동 재로딩을 사용하려면 다음 단계를 따르세요:
    </p>
    <list style="decimal">
        <li>
            <p>
                <a href="#enable">개발 모드 활성화</a>
            </p>
        </li>
        <li>
            <p>
                (선택 사항) <a href="#watch-paths">감시 경로 구성</a>
            </p>
        </li>
        <li>
            <p>
                <a href="#recompile">변경 시 재컴파일 활성화</a>
            </p>
        </li>
    </list>
    <chapter title="개발 모드 활성화" id="enable">
        <p>
            자동 재로딩을 사용하려면 먼저
            <a href="#enable">개발 모드</a>를 활성화해야 합니다.
            이는 <Links href="/ktor/server-create-and-configure" summary="애플리케이션 배포 요구 사항에 따라 서버를 생성하는 방법을 학습합니다.">서버를 생성하고 실행하는</Links> 방식에 따라 달라집니다:
        </p>
        <list>
            <li>
                <p>
                    <code>EngineMain</code>을 사용하여 서버를 실행하는 경우,
                    <a href="#application-conf">구성 파일</a>에서 개발 모드를 활성화하세요.
                </p>
            </li>
            <li>
                <p>
                    <code>embeddedServer</code>를 사용하여 서버를 실행하는 경우,
                    <a href="#system-property">io.ktor.development</a>
                    시스템 속성을 사용할 수 있습니다.
                </p>
            </li>
        </list>
        <p>
            개발 모드가 활성화되면 Ktor는 작업 디렉터리의 출력 파일을 자동으로 감시합니다.
            필요한 경우, <a href="#watch-paths">감시 경로</a>를 지정하여 감시 폴더 집합을 좁힐 수 있습니다.
        </p>
    </chapter>
    <chapter title="감시 경로 구성" id="watch-paths">
        <p>
            <a href="#enable">개발 모드</a>를 활성화하면
            Ktor는 작업 디렉터리의 출력 파일을 감시하기 시작합니다.
            예를 들어, Gradle로 빌드된 <Path>ktor-sample</Path> 프로젝트의 경우 다음 폴더가 감시됩니다:
        </p>
        [object Promise]
        <p>
            감시 경로는 감시할 폴더 집합을 좁힐 수 있도록 합니다.
            이를 위해 감시 경로의 일부를 지정할 수 있습니다.
            예를 들어, <Path>ktor-sample/build/classes</Path> 하위 폴더의 변경 사항을 모니터링하려면
            `classes`를 감시 경로로 전달합니다.
            서버를 실행하는 방식에 따라 다음과 같은 방법으로 감시 경로를 지정할 수 있습니다:
        </p>
        <list>
            <li>
                <p>
                    <Path>application.conf</Path> 또는 <Path>application.yaml</Path> 파일에서 `watch` 옵션을 지정합니다:
                </p>
                <tabs group="config">
                    <tab title="application.conf" group-key="hocon">
                        [object Promise]
                    </tab>
                    <tab title="application.yaml" group-key="yaml">
                        [object Promise]
                    </tab>
                </tabs>
                <p>
                    여러 개의 감시 경로를 지정할 수도 있습니다. 예를 들면:
                </p>
                <tabs group="config">
                    <tab title="application.conf" group-key="hocon">
                        [object Promise]
                    </tab>
                    <tab title="application.yaml" group-key="yaml">
                        [object Promise]
                    </tab>
                </tabs>
                <p>
                    전체 예시는 다음에서 확인할 수 있습니다: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-engine-main">autoreload-engine-main</a>.
                </p>
            </li>
            <li>
                <p>
                    <code>embeddedServer</code>를 사용하는 경우, `watchPaths`
                    매개변수로 감시 경로를 전달합니다:
                </p>
                [object Promise]
                <p>
                    전체 예시는 다음을 참조하세요:
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-embedded-server">
                        autoreload-embedded-server
                    </a>
                    .
                </p>
            </li>
        </list>
    </chapter>
    <chapter title="변경 시 재컴파일" id="recompile">
        <p>
            자동 재로딩은 출력 파일의 변경 사항을 감지하므로,
            프로젝트를 재빌드해야 합니다.
            IntelliJ IDEA에서 수동으로 이 작업을 수행하거나
            Gradle에서 `-t` 명령줄 옵션을 사용하여 지속적인 빌드 실행을 활성화할 수 있습니다.
        </p>
        <list>
            <li>
                <p>
                    IntelliJ IDEA에서 프로젝트를 수동으로 재빌드하려면,
                    주 메뉴에서 <ui-path>Build | Rebuild Project</ui-path>를 선택하세요.
                </p>
            </li>
            <li>
                <p>
                    Gradle을 사용하여 프로젝트를 자동으로 재빌드하려면,
                    터미널에서 `-t` 옵션과 함께 `build` 작업을 실행할 수 있습니다:
                </p>
                [object Promise]
                <tip>
                    <p>
                        프로젝트를 다시 로드할 때 테스트 실행을 건너뛰려면 `build` 작업에 `-x` 옵션을 전달할 수 있습니다:
                    </p>
                    [object Promise]
                </tip>
            </li>
        </list>
    </chapter>
</topic>