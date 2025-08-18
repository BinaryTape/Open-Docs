[//]: # (title: HTTP/2)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>코드 예시</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty">http2-netty</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty">http2-jetty</a>
</p>
</tldr>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2)는 HTTP/1.x를 대체하도록 설계된 현대적인 바이너리 이중 멀티플렉싱 프로토콜입니다.

Jetty 및 Netty 엔진은 Ktor가 사용할 수 있는 HTTP/2 구현을 제공합니다. 하지만 상당한 차이가 있으며, 각 엔진은 추가적인 설정이 필요합니다. Ktor를 위해 호스트가 올바르게 설정되면, HTTP/2 지원이 자동으로 활성화됩니다.

주요 요구사항:

*   SSL 인증서 (자체 서명될 수 있습니다).
*   특정 엔진에 적합한 ALPN 구현 (Netty 및 Jetty에 대한 해당 섹션을 참조하세요).

## SSL 인증서 {id="ssl_certificate"}

사양에 따라 HTTP/2는 암호화를 요구하지 않지만, 모든 브라우저는 HTTP/2와 함께 암호화된 연결을 사용하도록 요구할 것입니다. 이것이 HTTP/2 활성화를 위한 필수 조건으로 작동하는 TLS 환경이 필요한 이유입니다. 따라서 암호화를 활성화하려면 인증서가 필요합니다. 테스트 목적으로, JDK의 `keytool`로 생성할 수 있습니다...

```bash
keytool -keystore test.jks -genkeypair -alias testkey -keyalg RSA -keysize 4096 -validity 5000 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

... 또는 [buildKeyStore](server-ssl.md) 함수를 사용하여 생성할 수 있습니다.

다음 단계는 Ktor가 키 저장소를 사용하도록 설정하는 것입니다. 예시 `application.conf` / `application.yaml` [설정 파일](server-configuration-file.topic)을 참조하세요:

<Tabs group="config">
<TabItem title="application.conf" group-key="hocon">

```shell
ktor {
    deployment {
        port = 8080
        sslPort = 8443
    }

    application {
        modules = [ com.example.ApplicationKt.main ]
    }

    security {
        ssl {
            keyStore = test.jks
            keyAlias = testkey
            keyStorePassword = foobar
            privateKeyPassword = foobar
        }
    }
}

```

</TabItem>
<TabItem title="application.yaml" group-key="yaml">

```yaml
ktor:
    deployment:
        port: 8080
        sslPort: 8443
    application:
        modules:
            - com.example.ApplicationKt.main

    security:
        ssl:
            keyStore: test.jks
            keyAlias: testkey
            keyStorePassword: foobar
            privateKeyPassword: foobar
```

</TabItem>
</Tabs>

## ALPN 구현 {id="apln_implementation"}

HTTP/2는 ALPN ([애플리케이션 계층 프로토콜 협상](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation))이 활성화되어야 합니다. 첫 번째 옵션은 부트 클래스패스에 추가되어야 하는 외부 ALPN 구현을 사용하는 것입니다. 다른 옵션은 OpenSSL 네이티브 바인딩과 사전 컴파일된 네이티브 바이너리를 사용하는 것입니다. 또한, 각 특정 엔진은 이 방법들 중 하나만 지원할 수 있습니다.

### Jetty {id="jetty"}

ALPN API가 Java 8부터 지원되므로, Jetty 엔진은 HTTP/2 사용을 위한 특별한 설정을 요구하지 않습니다. 따라서 다음을 수행하기만 하면 됩니다:
1.  Jetty 엔진으로 [서버를 생성합니다](server-engines.md#choose-create-server).
2.  [SSL 인증서](#ssl_certificate)에 설명된 대로 SSL 설정을 추가합니다.
3.  `sslPort`를 설정합니다.

[http2-jetty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-jetty) 실행 가능한 예시는 Jetty에 대한 HTTP/2 지원을 보여줍니다.

### Netty {id="netty"}

Netty에서 HTTP/2를 활성화하려면 OpenSSL 바인딩 ([tcnative netty port](https://netty.io/wiki/forked-tomcat-native.html))을 사용하세요. 아래 예시는 네이티브 구현(OpenSSL의 포크인 정적으로 링크된 BoringSSL 라이브러리)을 `build.gradle.kts` 파일에 추가하는 방법을 보여줍니다:

```kotlin
val osName = System.getProperty("os.name").lowercase()
val tcnative_classifier = when {
    osName.contains("win") -> "windows-x86_64"
    osName.contains("linux") -> "linux-x86_64"
    osName.contains("mac") -> "osx-x86_64"
    else -> null
}

dependencies {
    if (tcnative_classifier != null) {
        implementation("io.netty:netty-tcnative-boringssl-static:$tcnative_version:$tcnative_classifier")
    } else {
        implementation("io.netty:netty-tcnative-boringssl-static:$tcnative_version")
    }
}
```

`tc.native.classifier`는 다음 중 하나여야 합니다: `linux-x86_64`, `osx-x86_64`, 또는 `windows-x86_64`.
[http2-netty](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/http2-netty) 실행 가능한 예시는 Netty에서 HTTP/2 지원을 활성화하는 방법을 보여줍니다.