[//]: # (title: Ktor 서버의 다이제스트 인증)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-server-auth"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="auth-digest"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 해줍니다.">네이티브 서버</Links> 지원</b>: ✖️
</p>
</tldr>

다이제스트(Digest) 인증 방식은 접근 제어 및 인증에 사용되는 [HTTP 프레임워크](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)의 일부입니다. 이 방식에서는 사용자 이름과 비밀번호를 네트워크를 통해 전송하기 전에 해시 함수를 적용합니다.

Ktor는 다이제스트 인증을 사용하여 사용자 로그인 및 특정 [라우트](server-routing.md)를 보호할 수 있도록 지원합니다. Ktor에서의 인증에 대한 일반적인 정보는 [Ktor 서버에서의 인증 및 인가](server-auth.md) 섹션에서 확인할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}
`digest` 인증을 활성화하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 포함해야 합니다.

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 다이제스트 인증 흐름 {id="flow"}

다이제스트 인증 흐름은 다음과 같습니다.

1. 클라이언트가 서버 애플리케이션의 특정 [라우트](server-routing.md)에 `Authorization` 헤더 없이 요청합니다.
2. 서버는 클라이언트에 `401` (Unauthorized) 응답 상태로 응답하고, `WWW-Authenticate` 응답 헤더를 사용하여 다이제스트 인증 방식이 라우트를 보호하는 데 사용된다는 정보를 제공합니다. 일반적인 `WWW-Authenticate` 헤더는 다음과 같습니다.

   ```
   WWW-Authenticate: Digest
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           algorithm="MD5"
   ```
   {style="block"}

   Ktor에서는 `digest` 인증 제공자를 [구성](#configure-provider)할 때 realm과 nonce 값을 생성하는 방법을 지정할 수 있습니다.

3. 일반적으로 클라이언트는 사용자가 자격 증명을 입력할 수 있는 로그인 대화 상자를 표시합니다. 그런 다음 클라이언트는 다음 `Authorization` 헤더와 함께 요청을 보냅니다.

   ```
   Authorization: Digest username="jetbrains",
           realm="Access to the '/' path",
           nonce="e4549c0548886bc2",
           uri="/",
           algorithm=MD5,
           response="6299988bb4f05c0d8ad44295873858cf"
   ```
   {style="block"}

   `response` 값은 다음 방식으로 생성됩니다.
   
   a. `HA1 = MD5(username:realm:password)`
   > 이 부분은 서버에 [저장](#digest-table)되며 Ktor가 사용자 자격 증명을 검증하는 데 사용될 수 있습니다.
   
   b. `HA2 = MD5(method:digestURI)`
   
   c. `response = MD5(HA1:nonce:HA2)`

4. 서버는 클라이언트가 보낸 자격 증명을 [검증](#configure-provider)하고 요청된 콘텐츠로 응답합니다.

## 다이제스트 인증 설치 {id="install"}
`digest` 인증 제공자를 설치하려면 `install` 블록 내에서 [digest](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/digest.html) 함수를 호출합니다.

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
// ...
install(Authentication) {
    digest {
        // Configure digest authentication
    }
}
```
선택적으로 [지정된 라우트를 인증](#authenticate-route)하는 데 사용될 수 있는 [제공자 이름](server-auth.md#provider-name)을 지정할 수 있습니다.

## 다이제스트 인증 구성 {id="configure"}

Ktor에서 다양한 인증 제공자를 구성하는 방법에 대한 일반적인 아이디어를 얻으려면 [인증 구성](server-auth.md#configure)을 참조하세요. 이 섹션에서는 `digest` 인증 제공자의 구성 세부 정보를 살펴보겠습니다.

### 1단계: 다이제스트가 포함된 사용자 테이블 제공 {id="digest-table"}

`digest` 인증 제공자는 다이제스트 메시지의 `HA1` 부분을 사용하여 사용자 자격 증명을 검증합니다. 따라서 사용자 이름과 해당 `HA1` 해시를 포함하는 사용자 테이블을 제공할 수 있습니다. 아래 예시에서는 `getMd5Digest` 함수가 `HA1` 해시를 생성하는 데 사용됩니다.

```kotlin
fun getMd5Digest(str: String): ByteArray = MessageDigest.getInstance("MD5").digest(str.toByteArray(UTF_8))

val myRealm = "Access to the '/' path"
val userTable: Map<String, ByteArray> = mapOf(
    "jetbrains" to getMd5Digest("jetbrains:$myRealm:foobar"),
    "admin" to getMd5Digest("admin:$myRealm:password")
)
```

### 2단계: 다이제스트 제공자 구성 {id="configure-provider"}

`digest` 인증 제공자는 [DigestAuthenticationProvider.Config](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/index.html) 클래스를 통해 설정을 노출합니다. 아래 예시에서는 다음 설정이 지정됩니다.
* `realm` 속성은 `WWW-Authenticate` 헤더에 전달될 realm을 설정합니다.
* `digestProvider` 함수는 지정된 사용자 이름에 대한 다이제스트의 `HA1` 부분을 가져옵니다.
* (선택 사항) `validate` 함수는 자격 증명을 사용자 정의 principal에 매핑할 수 있도록 합니다.

```kotlin
fun Application.main() {
    install(Authentication) {
        digest("auth-digest") {
            realm = myRealm
            digestProvider { userName, realm ->
                userTable[userName]
            }
            validate { credentials ->
                if (credentials.userName.isNotEmpty()) {
                    CustomPrincipal(credentials.userName, credentials.realm)
                } else {
                    null
                }
            }
        }
    }
}

data class CustomPrincipal(val userName: String, val realm: String)
```

또한 [nonceManager](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-digest-authentication-provider/-config/nonce-manager.html) 속성을 사용하여 nonce 값을 생성하는 방법을 지정할 수도 있습니다.

### 3단계: 특정 리소스 보호 {id="authenticate-route"}

`digest` 제공자를 구성한 후 **[authenticate](server-auth.md#authenticate-route)** 함수를 사용하여 애플리케이션의 특정 리소스를 보호할 수 있습니다. 인증에 성공한 경우 `call.principal` 함수를 사용하여 라우트 핸들러 내에서 인증된 [Principal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-principal/index.html)을 검색하고 인증된 사용자의 이름을 가져올 수 있습니다.

```kotlin
routing {
    authenticate("auth-digest") {
        get("/") {
            call.respondText("Hello, ${call.principal<CustomPrincipal>()?.userName}!")
        }
    }
}