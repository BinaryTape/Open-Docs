[//]: # (title: Ktor Client에서 인증 및 권한 부여)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>필수 의존성</b>: `io.ktor:ktor-client-auth`
</p>
</tldr>

<link-summary>
Auth 플러그인은 클라이언트 애플리케이션에서 인증 및 권한 부여를 처리합니다.
</link-summary>

Ktor는 클라이언트 애플리케이션에서 인증 및 권한 부여를 처리하는 [Auth](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth/-auth) 플러그인을 제공합니다. 일반적인 사용 시나리오에는 사용자 로그인 및 특정 리소스에 대한 액세스 권한 획득이 포함됩니다.

> 서버에서 Ktor는 인증 및 권한 부여를 처리하기 위한 [Authentication](server-auth.md) 플러그인을 제공합니다.

## 지원되는 인증 유형 {id="supported"}

HTTP는 액세스 제어 및 인증을 위한 [일반적인 프레임워크](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)를 제공합니다. Ktor 클라이언트는 다음 HTTP 인증 스키마를 사용할 수 있도록 합니다:

* [Basic](client-basic-auth.md) - 사용자 이름과 비밀번호를 제공하기 위해 `Base64` 인코딩을 사용합니다. 일반적으로 HTTPS와 함께 사용하지 않는 한 권장되지 않습니다.
* [Digest](client-digest-auth.md) - 사용자 이름과 비밀번호에 해시 함수를 적용하여 사용자 자격 증명을 암호화된 형태로 전달하는 인증 방식입니다.
* [Bearer](client-bearer-auth.md) - 베어러 토큰이라고 불리는 보안 토큰을 포함하는 인증 스키마입니다. 예를 들어, 이 스키마를 OAuth 흐름의 일부로 사용하여 Google, Facebook, Twitter 등과 같은 외부 제공자를 통해 애플리케이션 사용자를 인증할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

인증을 활성화하려면 `ktor-client-auth` 아티팩트를 빌드 스크립트에 포함해야 합니다:

<var name="artifact_name" value="ktor-client-auth"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## Auth 설치 {id="install_plugin"}
`Auth` 플러그인을 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내 `install` 함수에 전달합니다:

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.auth.*
//...
val client = HttpClient(CIO) {
    install(Auth) {
        // 인증 구성
    }
}
```
이제 필요한 인증 제공자를 [구성](#configure_authentication)할 수 있습니다.

## 인증 구성 {id="configure_authentication"}

### 단계 1: 인증 제공자 선택 {id="choose-provider"}

특정 인증 제공자([basic](client-basic-auth.md), [digest](client-digest-auth.md), 또는 [bearer](client-bearer-auth.md))를 사용하려면 `install` 블록 내에서 해당 함수를 호출해야 합니다. 예를 들어, `basic` 인증을 사용하려면 [basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 함수를 호출합니다:

```kotlin
install(Auth) {
    basic {
        // 기본 인증 구성
    }
}
```
블록 내부에서 이 제공자에 특정한 설정을 구성할 수 있습니다.

### 단계 2: (선택 사항) Realm 구성 {id="realm"}

선택적으로, `realm` 속성을 사용하여 realm을 구성할 수 있습니다:

```kotlin
install(Auth) {
    basic {
        realm = "'/' 경로에 대한 접근"
        // ...
    }
}
```

다른 리소스에 접근하기 위해 여러 realm을 가진 여러 제공자를 생성할 수 있습니다:

```kotlin
install(Auth) {
    basic {
        realm = "'/' 경로에 대한 접근"
        // ...
    }
    basic {
        realm = "'/admin' 경로에 대한 접근"
        // ...
    }
}
```

이 경우 클라이언트는 realm을 포함하는 `WWW-Authenticate` 응답 헤더를 기반으로 필요한 제공자를 선택합니다.

### 단계 3: 제공자 구성 {id="configure-provider"}

특정 [제공자](#supported)에 대한 설정을 구성하는 방법을 알아보려면 해당 항목을 참조하십시오:
* [](client-basic-auth.md)
* [](client-digest-auth.md)
* [](client-bearer-auth.md)