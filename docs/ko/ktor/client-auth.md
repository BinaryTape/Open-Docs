[//]: # (title: Ktor Client의 인증 및 권한 부여)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-client-auth</code>
</p>
</tldr>

<link-summary>
Auth 플러그인은 클라이언트 애플리케이션에서 인증 및 권한 부여를 처리합니다.
</link-summary>

Ktor는 클라이언트 애플리케이션에서 인증 및 권한 부여를 처리하기 위한 [Auth](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth/-auth) 플러그인을 제공합니다. 일반적인 사용 시나리오는 사용자 로그인 및 특정 리소스에 대한 접근 권한 획득을 포함합니다.

> 서버에서는 Ktor가 인증 및 권한 부여 처리를 위해 [Authentication](server-auth.md) 플러그인을 제공합니다.

## 지원되는 인증 유형 {id="supported"}

HTTP는 접근 제어 및 인증을 위한 [일반적인 프레임워크](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)를 제공합니다. Ktor 클라이언트에서는 다음 HTTP 인증 스키마를 사용할 수 있습니다.

*   [기본(Basic)](client-basic-auth.md) - `Base64` 인코딩을 사용하여 사용자 이름과 비밀번호를 제공합니다. 일반적으로 HTTPS와 함께 사용하지 않는다면 권장되지 않습니다.
*   [다이제스트(Digest)](client-digest-auth.md) - 사용자 이름과 비밀번호에 해시 함수를 적용하여 사용자 자격 증명을 암호화된 형태로 통신하는 인증 방식입니다.
*   [베어러(Bearer)](client-bearer-auth.md) - 베어러 토큰이라고 하는 보안 토큰을 포함하는 인증 스키마입니다. 예를 들어, 이 스키마를 OAuth 플로우의 일부로 사용하여 Google, Facebook, Twitter 등과 같은 외부 공급자를 통해 애플리케이션 사용자를 인증할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

인증을 활성화하려면 빌드 스크립트에 `ktor-client-auth` 아티팩트를 포함해야 합니다.

<var name="artifact_name" value="ktor-client-auth"/>

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
    

    <p>
        Ktor 클라이언트에 필요한 아티팩트에 대한 자세한 내용은 <Links href="/ktor/client-dependencies" summary="기존 프로젝트에 클라이언트 의존성을 추가하는 방법을 알아보세요.">클라이언트 의존성 추가</Links>에서 확인할 수 있습니다.
    </p>
    

## Auth 설치 {id="install_plugin"}
`Auth` 플러그인을 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내부의 `install` 함수에 전달합니다.

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
//...
val client = HttpClient(CIO) {
    install(Auth) {
        // Configure authentication
    }
}
```
이제 필요한 인증 공급자를 [구성](#configure_authentication)할 수 있습니다.

## 인증 구성 {id="configure_authentication"}

### 1단계: 인증 공급자 선택 {id="choose-provider"}

특정 인증 공급자([기본(basic)](client-basic-auth.md), [다이제스트(digest)](client-digest-auth.md), 또는 [베어러(bearer)](client-bearer-auth.md))를 사용하려면 `install` 블록 내에서 해당 함수를 호출해야 합니다. 예를 들어, `basic` 인증을 사용하려면 [basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 함수를 호출합니다.

```kotlin
install(Auth) {
    basic {
        // Configure basic authentication
    }
}
```
블록 내부에서 이 공급자에 특정한 설정을 구성할 수 있습니다.

### 2단계: (선택 사항) 렐름 구성 {id="realm"}

선택적으로 `realm` 속성을 사용하여 렐름을 구성할 수 있습니다.

```kotlin
install(Auth) {
    basic {
        realm = "Access to the '/' path"
        // ...
    }
}
```

다른 리소스에 접근하기 위해 여러 렐름을 가진 여러 공급자를 생성할 수 있습니다.

```kotlin
install(Auth) {
    basic {
        realm = "Access to the '/' path"
        // ...
    }
    basic {
        realm = "Access to the '/admin' path"
        // ...
    }
}
```

이 경우 클라이언트는 렐름을 포함하는 `WWW-Authenticate` 응답 헤더를 기반으로 필요한 공급자를 선택합니다.

### 3단계: 공급자 구성 {id="configure-provider"}

특정 [공급자](#supported)의 설정 구성 방법을 알아보려면 해당 주제를 참조하십시오.
*   [](client-basic-auth.md)
*   [](client-digest-auth.md)
*   [](client-bearer-auth.md)