[//]: # (title: 네이티브 서버)

<tldr>
<var name="example_name" value="embedded-server-native"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다.
</link-summary>

Ktor는 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다. 현재 Kotlin/Native 환경에서 Ktor 서버를 실행하는 데에는 다음과 같은 제한 사항이 있습니다:
*   `embeddedServer`를 사용하여 [서버를 생성](server-create-and-configure.topic)해야 합니다.
*   [CIO 엔진](server-engines.md)만 지원됩니다.
*   리버스 프록시 없는 [HTTPS](server-ssl.md)는 지원되지 않습니다.
*   Windows [타겟](server-platforms.md)은 지원되지 않습니다.

undefined

## 의존성 추가 {id="add-dependencies"}

Kotlin/Native 프로젝트의 Ktor 서버는 최소 두 가지 의존성을 필요로 합니다: `ktor-server-core` 의존성과 엔진 의존성 (CIO). 아래 코드 스니펫은 `build.gradle.kts` 파일의 `nativeMain` 소스 세트에 의존성을 추가하는 방법을 보여줍니다:

[object Promise]

네이티브 서버를 [테스트](server-testing.md)하려면 `ktor-server-test-host` 아티팩트를 `nativeTest` 소스 세트에 추가하세요:

[object Promise]

## 네이티브 타겟 구성 {id="native-target"}

필요한 네이티브 타겟을 지정하고 `binaries` 속성을 사용하여 [네이티브 바이너리를 선언](https://kotlinlang.org/docs/mpp-build-native-binaries.html)하세요:

[object Promise]

전체 예시는 다음에서 확인할 수 있습니다: [embedded-server-native](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-native).

## 서버 생성 {id="create-server"}

그래들 빌드 스크립트를 구성한 후, 여기 [](server-create-and-configure.topic)에 설명된 대로 Ktor 서버를 생성할 수 있습니다.