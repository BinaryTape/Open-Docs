[//]: # (title: HTTP/2)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>코드 예시</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty">http2-netty</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty">http2-jetty</a>
</p>
</tldr>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2)는 HTTP/1.x의 대체제로 설계된 현대적인 이진 양방향 멀티플렉싱 프로토콜입니다.

Jetty 및 Netty 엔진은 Ktor가 사용할 수 있는 HTTP/2 구현을 제공합니다. 하지만 상당한 차이가 있으며, 각 엔진은 추가 구성이 필요합니다. 호스트가 Ktor에 맞게 적절히 구성되면 HTTP/2 지원이 자동으로 활성화됩니다.

주요 요구 사항:

*   SSL 인증서 (자체 서명될 수 있습니다.)
*   특정 엔진에 적합한 ALPN 구현 (Netty 및 Jetty의 해당 섹션 참조).

## SSL 인증서 {id="ssl_certificate"}

사양에 따르면 HTTP/2는 암호화를 요구하지 않지만, 모든 브라우저는 HTTP/2와 함께 사용하기 위해 암호화된 연결을 요구합니다. 그렇기 때문에 작동하는 TLS 환경은 HTTP/2를 활성화하기 위한 필수 조건입니다. 따라서 암호화를 활성화하려면 인증서가 필요합니다.
테스트 목적으로는 JDK의 `keytool`을 사용하여 생성할 수 있습니다...

```bash
keytool -keystore test.jks -genkeypair -alias testkey -keyalg RSA -keysize 4096 -validity 5000 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

...또는 [buildKeyStore](server-ssl.md) 함수를 사용합니다.

다음 단계는 Ktor가 키스토어를 사용하도록 구성하는 것입니다. 예시 `application.conf` / `application.yaml` [구성 파일](server-configuration-file.topic)을 참조하세요:

<tabs group="config">
<tab title="application.conf" group-key="hocon">

[object Promise]

</tab>
<tab title="application.yaml" group-key="yaml">

[object Promise]

</tab>
</tabs>

## ALPN 구현 {id="apln_implementation"}

HTTP/2는 ALPN ([Application-Layer Protocol Negotiation](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation))이 활성화되어야 합니다. 첫 번째 옵션은 부트 클래스패스에 추가해야 하는 외부 ALPN 구현을 사용하는 것입니다. 또 다른 옵션은 OpenSSL 네이티브 바인딩과 미리 컴파일된 네이티브 바이너리를 사용하는 것입니다. 또한, 각 특정 엔진은 이러한 방법 중 하나만 지원할 수 있습니다.

### Jetty {id="jetty"}

Java 8부터 ALPN API가 지원되므로, Jetty 엔진은 HTTP/2 사용을 위한 특별한 구성이 필요하지 않습니다. 따라서 다음만 수행하면 됩니다:
1.  Jetty 엔진으로 [서버를 생성합니다](server-engines.md#choose-create-server).
2.  [](#ssl_certificate)에 설명된 대로 SSL 구성을 추가합니다.
3.  `sslPort`를 구성합니다.

[http2-jetty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty) 실행 가능한 예제는 Jetty에 대한 HTTP/2 지원을 보여줍니다.

### Netty {id="netty"}

Netty에서 HTTP/2를 활성화하려면 OpenSSL 바인딩([tcnative Netty 포트](https://netty.io/wiki/forked-tomcat-native.html))을 사용하세요. 아래 예시는 `build.gradle.kts` 파일에 네이티브 구현(정적으로 링크된 BoringSSL 라이브러리, OpenSSL의 포크)을 추가하는 방법을 보여줍니다:

[object Promise]

`tc.native.classifier`는 `linux-x86_64`, `osx-x86_64`, 또는 `windows-x86_64` 중 하나여야 합니다. [http2-netty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty) 실행 가능한 예제는 Netty에 대한 HTTP/2 지원을 활성화하는 방법을 보여줍니다.