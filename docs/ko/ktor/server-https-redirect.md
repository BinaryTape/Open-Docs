[//]: # (title: HttpsRedirect)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HttpsRedirect"/>
<var name="package_name" value="io.ktor.server.plugins.httpsredirect"/>
<var name="artifact_name" value="ktor-server-http-redirect"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-redirect"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-http-redirect/io.ktor.server.plugins.httpsredirect/-https-redirect.html) 플러그인은 호출을 처리하기 전에 모든 HTTP 요청을 [HTTPS에 해당하는 엔드포인트](server-ssl.md)로 리디렉션합니다. 기본적으로 리소스는 `301 Moved Permanently`를 반환하지만, `302 Found`로 설정할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## %plugin_name% 설치 {id="install_plugin"}

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
        지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션 구조를 만들 수 있습니다.">모듈</Links>에서 <code>install</code> 함수에 전달하면 됩니다.
        아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내에서.
        </li>
        <li>
            ... 명시적으로 정의된 <code>module</code> 내부에서, 이는 <code>Application</code> 클래스의 확장 함수입니다.
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

위 코드는 기본 설정으로 `%plugin_name%` 플러그인을 설치합니다.

>리버스 프록시 뒤에 있을 경우, HTTPS 요청을 올바르게 감지하려면 `ForwardedHeader` 또는 `XForwardedHeader` 플러그인을 설치해야 합니다. 이 플러그인 중 하나를 설치한 후 무한 리디렉션이 발생하는 경우, 자세한 내용은 [이 FAQ 항목](FAQ.topic#infinite-redirect)을 참조하십시오.
>
{type="note"}

## %plugin_name% 구성 {id="configure"}

아래 코드 스니펫은 원하는 HTTPS 포트를 구성하고 요청된 리소스에 대해 `301 Moved Permanently`를 반환하는 방법을 보여줍니다:

[object Promise]

전체 예시는 여기에서 찾을 수 있습니다: [ssl-engine-main-redirect](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-redirect).