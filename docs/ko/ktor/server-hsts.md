[//]: # (title: HSTS)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HSTS"/>
<var name="package_name" value="io.ktor.server.plugins.hsts"/>
<var name="artifact_name" value="ktor-server-hsts"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-hsts"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 합니다.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s.html) 플러그인은 [RFC 6797](https://tools.ietf.org/html/rfc6797)에 따라 요청에 필요한 _HTTP Strict Transport Security_ 헤더를 추가합니다. 브라우저가 HSTS 정책 헤더를 받으면, 지정된 기간 동안 안전하지 않은 연결로 서버에 연결을 더 이상 시도하지 않습니다.

> 참고로 HSTS 정책 헤더는 안전하지 않은 HTTP 연결에서는 무시됩니다. HSTS가 적용되려면 [보안](server-ssl.md) 연결을 통해 제공되어야 합니다.

## 의존성 추가 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>을(를) 사용하려면 <code>%artifact_name%</code> 아티팩트를 빌드 스크립트에 포함해야 합니다:
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
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구성할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요.
        아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
    </p>
    <list>
        <li>
            ...<code>embeddedServer</code> 함수 호출 내부.
        </li>
        <li>
            ...<code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내부.
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
    

    <p>
        <code>%plugin_name%</code> 플러그인은 또한 <a href="#install-route">특정 라우트에 설치</a>될 수 있습니다.
        이는 다른 애플리케이션 리소스에 대해 다른 <code>%plugin_name%</code> 구성이 필요한 경우 유용할 수 있습니다.
    </p>
    

## %plugin_name% 구성 {id="configure"}

<code>%plugin_name%</code>은(는) [HSTSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s-config/index.html)를 통해 설정을 노출합니다. 아래 예시는 클라이언트가 알려진 HSTS 호스트 목록에 호스트를 얼마나 오래 유지해야 하는지 지정하기 위해 <code>maxAgeInSeconds</code> 속성을 사용하는 방법을 보여줍니다:

[object Promise]

<code>withHost</code>를 사용하여 다른 호스트에 대해 다른 HSTS 구성을 제공할 수도 있습니다:

[object Promise]

전체 예시는 다음에서 찾을 수 있습니다: [ssl-engine-main-hsts](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-hsts).