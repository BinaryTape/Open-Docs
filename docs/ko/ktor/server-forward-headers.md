[//]: # (title: 전달된 헤더)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-forwarded-header"/>
<var name="package_name" value="io.ktor.server.plugins.forwardedheaders"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="forwarded-header"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 해줍니다.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

[ForwardedHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-forwarded-headers.html) 및 [XForwardedHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-x-forwarded-headers.html) 플러그인은 Ktor 서버가 리버스 프록시 뒤에 배치되었을 때 리버스 프록시 헤더를 처리하여 원본 [요청](server-requests.md)에 대한 정보를 얻을 수 있게 해줍니다. 이는 [로깅](server-logging.md) 목적에 유용할 수 있습니다.

*   `ForwardedHeaders`는 `Forwarded` 헤더([RFC 7239](https://tools.ietf.org/html/rfc7239))를 처리합니다.
*   `XForwardedHeaders`는 다음 `X-Forwarded-` 헤더를 처리합니다.
   - `X-Forwarded-Host`/`X-Forwarded-Server` 
   - `X-Forwarded-For` 
   - `X-Forwarded-By`
   - `X-Forwarded-Proto`/`X-Forwarded-Protocol`
   - `X-Forwarded-SSL`/`Front-End-Https`

> `Forwarded` 헤더 조작을 방지하려면, 애플리케이션이 리버스 프록시 연결만 허용하는 경우 이 플러그인들을 설치하세요.
> 
{type="note"}

## 의존성 추가 {id="add_dependencies"}
`ForwardedHeaders`/`XForwardedHeaders` 플러그인을 사용하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 포함해야 합니다.

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
    

## 플러그인 설치 {id="install_plugin"}

<tabs>
<tab title="ForwardedHeader">

<var name="plugin_name" value="ForwardedHeaders"/>

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
        지정된 <Links href="/ktor/server-modules" summary="모듈을 통해 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요.
        아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내에서.
        </li>
        <li>
            ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내에서.
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
    

</tab>

<tab title="XForwardedHeader">

<var name="plugin_name" value="XForwardedHeaders"/>

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
        지정된 <Links href="/ktor/server-modules" summary="모듈을 통해 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요.
        아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내에서.
        </li>
        <li>
            ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내에서.
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
    

</tab>
</tabs>

`ForwardedHeaders`/`XForwardedHeaders`를 설치한 후, [call.request.origin](#request_info) 속성을 사용하여 원본 요청에 대한 정보를 얻을 수 있습니다.

## 요청 정보 가져오기 {id="request_info"}

### 프록시 요청 정보 {id="proxy_request_info"}

프록시 요청에 대한 정보를 얻으려면, [경로 핸들러](server-routing.md#define_route) 내에서 [call.request.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html) 속성을 사용하세요.
아래 코드 스니펫은 프록시 주소와 요청이 이루어진 호스트에 대한 정보를 얻는 방법을 보여줍니다:

[object Promise]

### 원본 요청 정보 {id="original-request-information"}

원본 요청에 대한 정보를 읽으려면, [call.request.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html) 속성을 사용하세요:

[object Promise]

아래 표는 `ForwardedHeaders`/`XForwardedHeaders` 설치 여부에 따라 `call.request.origin`에 의해 노출되는 다양한 속성들의 값을 보여줍니다.

![Request diagram](forwarded-headers.png){width="706"}

| 속성               | ForwardedHeaders 없음 | ForwarderHeaders 사용 |
|------------------------|--------------------------|-----------------------|
| `origin.localHost`     | _web-server_             | _web-server_          |
| `origin.localPort`     | _8080_                   | _8080_                |
| `origin.serverHost`    | _web-server_             | _proxy_               |
| `origin.serverPort`    | _8080_                   | _80_                  |
| `origin.remoteHost`    | _proxy_                  | _client_              |
| `origin.remotePort`    | _32864_                  | _32864_               |

> 전체 예시는 여기에서 찾을 수 있습니다: [forwarded-header](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/forwarded-header).

## ForwardedHeaders 구성 {id="configure"}

요청이 여러 프록시를 통과하는 경우 `ForwardedHeaders`/`XForwardedHeaders`를 구성해야 할 수 있습니다.
이 경우, `X-Forwarded-For`는 각 연속적인 프록시의 모든 IP 주소를 포함합니다. 예를 들어:

```HTTP
X-Forwarded-For: <client>, <proxy1>, <proxy2>
```

기본적으로 `XForwardedHeader`는 `X-Forwarded-For`의 첫 번째 항목을 `call.request.origin.remoteHost` 속성에 할당합니다.
또한 [IP 주소를 선택하기 위한](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#selecting_an_ip_address) 사용자 지정 로직을 제공할 수도 있습니다.
[XForwardedHeadersConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-x-forwarded-headers-config/index.html)는 이를 위한 다음 API를 노출합니다:

- `useFirstProxy` 및 `useLastProxy`는 IP 주소 목록에서 각각 첫 번째 또는 마지막 값을 가져올 수 있게 합니다.
- `skipLastProxies`는 오른쪽에서부터 지정된 수의 항목을 건너뛰고 다음 항목을 가져옵니다.
   예를 들어, `proxiesCount` 파라미터가 `3`과 같으면, 아래 헤더에 대해 `origin.remoteHost`는 `10.0.0.123`을 반환합니다:
   ```HTTP
   X-Forwarded-For: 10.0.0.123, proxy-1, proxy-2, proxy-3
   ```
- `skipKnownProxies`는 목록에서 지정된 항목을 제거하고 마지막 항목을 가져옵니다.
   예를 들어, 이 함수에 `listOf("proxy-1", "proxy-3")`을 전달하면, 아래 헤더에 대해 `origin.remoteHost`는 `proxy-2`를 반환합니다:
   ```HTTP
   X-Forwarded-For: 10.0.0.123, proxy-1, proxy-2, proxy-3
   ```
- `extractEdgeProxy`는 `X-Forward-*` 헤더에서 값을 추출하기 위한 사용자 지정 로직을 제공할 수 있게 합니다.