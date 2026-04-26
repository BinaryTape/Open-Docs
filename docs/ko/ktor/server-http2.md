[//]: # (title: HTTP/2)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>코드 예제</b>: <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/http2-netty">http2-netty</a>, <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/http2-jetty">http2-jetty</a>
</p>
</tldr>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2)는 HTTP/1.x를 대체하기 위해 설계된 현대적인 바이너리 양방향 멀티플렉싱(binary duplex multiplexing) 프로토콜입니다.

Jetty 및 Netty 엔진은 Ktor에서 사용할 수 있는 HTTP/2 구현을 제공합니다. 하지만 엔진 간에 중요한 차이점이 있으며, 각 엔진마다 추가 설정이 필요합니다.
호스트가 Ktor를 위해 올바르게 구성되면 HTTP/2 지원이 자동으로 활성화됩니다.

주요 요구 사항:

* SSL 인증서 (자가 서명 인증서 가능).
* 특정 엔진에 적합한 ALPN 구현 (Netty 및 Jetty에 대한 해당 섹션 참조).

## SSL 인증서 {id="ssl_certificate"}

명세(specification)에 따르면 HTTP/2는 암호화를 요구하지 않지만, 모든 브라우저는 HTTP/2와 함께 암호화된 연결을 사용할 것을 요구합니다.
따라서 작동하는 TLS 환경은 HTTP/2를 활성화하기 위한 필수 전제 조건입니다. 결과적으로 암호화를 활성화하려면 인증서가 필요합니다.
테스트 목적으로 JDK의 `keytool`을 사용하여 생성할 수 있습니다...

```bash
keytool -keystore test.jks -genkeypair -alias testkey -keyalg RSA -keysize 4096 -validity 5000 -dname 'CN=localhost, OU=ktor, O=ktor, L=Unspecified, ST=Unspecified, C=US'
```

... 또는 [buildKeyStore](server-ssl.md) 함수를 사용하여 생성할 수도 있습니다.

다음 단계는 사용자의 키스토어(keystore)를 사용하도록 Ktor를 설정하는 것입니다. 다음의 예제 `application.conf` / `application.yaml` [설정 파일](server-configuration-file.topic)을 참조하십시오.

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

HTTP/2를 사용하려면 ALPN ([Application-Layer Protocol Negotiation](https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation))이 활성화되어 있어야 합니다. 첫 번째 옵션은 부트 클래스패스(boot classpath)에 추가해야 하는 외부 ALPN 구현을 사용하는 것입니다.
또 다른 옵션은 OpenSSL 네이티브 바인딩 및 미리 컴파일된 네이티브 바이너리를 사용하는 것입니다.
또한, 각 특정 엔진은 이러한 방법 중 하나만 지원할 수 있습니다.

### Jetty {id="jetty"}

Java 8부터 ALPN API가 지원되므로 Jetty 엔진은 HTTP/2를 사용하기 위해 특별한 설정이 필요하지 않습니다. 따라서 다음 단계만 수행하면 됩니다.
1. Jetty 엔진으로 [서버를 생성](server-engines.md#choose-create-server)합니다.
2. [SSL 인증서](#ssl_certificate) 섹션의 설명에 따라 SSL 설정을 추가합니다.
3. `sslPort`를 설정합니다.

[http2-jetty](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/http2-jetty) 실행 예제에서 Jetty의 HTTP/2 지원을 확인할 수 있습니다.

### Netty {id="netty"}

Netty에서 HTTP/2를 활성화하려면 OpenSSL 바인딩([tcnative netty 포트](https://netty.io/wiki/forked-tomcat-native.html))을 사용하십시오.
아래 예제는 `build.gradle.kts` 파일에 네이티브 구현(OpenSSL의 포크인 정적 링크 BoringSSL 라이브러리)을 추가하는 방법을 보여줍니다.

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

`tc.native.classifier`는 `linux-x86_64`, `osx-x86_64`, 또는 `windows-x86_64` 중 하나여야 합니다.
[http2-netty](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/http2-netty) 실행 예제에서 Netty의 HTTP/2 지원을 활성화하는 방법을 확인할 수 있습니다.

#### TLS 없는 HTTP/2

Netty 엔진은 [HTTP/2 over cleartext (h2c)](https://httpwg.org/specs/rfc7540.html#discover-http)도 지원합니다.
이를 통해 암호화가 필요하지 않은 개인 네트워크 내에서 주로 사용되는 TLS 없는 HTTP/2 통신이 가능합니다.
클라이언트는 HTTP/1.1 요청으로 통신을 시작한 다음 HTTP/2로 업그레이드할 수 있습니다.

h2c를 활성화하려면 엔진 설정에서 `enableH2c` 플래그를 `true`로 설정하십시오.

```kotlin
embeddedServer(Netty, configure = {
    connector {
        port = 8080
    }
    enableHttp2 = true
    enableH2c = true
})
```

h2c는 `enableHttp2 = true` 설정이 필요하며, 서버에 SSL 커넥터가 구성된 경우에는 사용할 수 없습니다.