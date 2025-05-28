[//]: # (title: JSON Web 令牌)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Authentication JWT"/>

<tldr>
<p>
<b>必要依賴項</b>：<code>io.ktor:ktor-server-auth</code>, <code>io.ktor:ktor-server-auth-jwt</code>
</p>
<p>
<b>程式碼範例</b>：
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256">auth-jwt-hs256</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256">auth-jwt-rs256</a>
</p>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
%plugin_name% 插件允許您使用 JSON Web 令牌 (JSON Web Token) 來驗證客戶端身份。
</link-summary>

[JSON Web 令牌 (JWT)](https://jwt.io/) 是一個開放標準，定義了一種以 JSON 物件形式安全地在各方之間傳輸資訊的方式。由於它使用共享密鑰（透過 `HS256` 演算法）或公/私密鑰對（例如 `RS256`）進行簽署，因此可以驗證和信任此資訊。

Ktor 處理在 `Authorization` 標頭中透過 `Bearer` 方案傳遞的 JWT，並允許您：
* 驗證 JSON Web 令牌的簽章；
* 對 JWT 酬載執行額外驗證。

> 您可以在 [](server-auth.md) 章節中取得有關 Ktor 中身份驗證和授權的一般資訊。

## 新增依賴項 {id="add_dependencies"}
要啟用 `JWT` 身份驗證，您需要在建置腳本中包含 `ktor-server-auth` 和 `ktor-server-auth-jwt` 構件：

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" title="範例">
            implementation("io.ktor:ktor-server-auth:$ktor_version")
            implementation("io.ktor:ktor-server-auth-jwt:$ktor_version")
        </code-block>
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" title="範例">
            implementation "io.ktor:ktor-server-auth:$ktor_version"
            implementation "io.ktor:ktor-server-auth-jwt:$ktor_version"
        </code-block>
    </tab>
    <tab title="Maven" group-key="maven">
        <code-block lang="XML" title="範例">
&lt;dependency&gt;
&lt;groupId&gt;io.ktor&lt;/groupId&gt;
&lt;artifactId&gt;ktor-server-auth-jvm&lt;/artifactId&gt;
&lt;version&gt;${ktor_version}&lt;/version&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
&lt;groupId&gt;io.ktor&lt;/groupId&gt;
&lt;artifactId&gt;ktor-server-auth-jwt-jvm&lt;/artifactId&gt;
&lt;version&gt;${ktor_version}&lt;/version&gt;
&lt;/dependency&gt;
        </code-block>
   </tab>
</tabs>

## JWT 授權流程 {id="flow"}
Ktor 中的 JWT 授權流程可能如下所示：
1. 客戶端向伺服器應用程式中的特定身份驗證[路由](server-routing.md)發出帶有憑證的 `POST` 請求。以下範例顯示了一個[HTTP 客戶端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) `POST` 請求，其中憑證以 JSON 格式傳遞：
   ```HTTP
   ```
   {src="snippets/auth-jwt-hs256/requests.http" include-lines="2-8"}
2. 如果憑證有效，伺服器會生成一個 JSON Web 令牌並使用指定的演算法對其進行簽署。例如，這可能是帶有特定共享密鑰的 `HS256` 或帶有公/私密鑰對的 `RS256`。
3. 伺服器將生成的 JWT 發送給客戶端。
4. 客戶端現在可以向受保護的資源發出請求，並在 `Authorization` 標頭中透過 `Bearer` 方案傳遞 JSON Web 令牌。
   ```HTTP
   ```
   {src="snippets/auth-jwt-hs256/requests.http" include-lines="13-14"}
5. 伺服器接收到請求並執行以下驗證：
   * 驗證令牌的簽章。請注意，[驗證方式](#configure-verifier)取決於用於簽署令牌的演算法。
   * 對 JWT 酬載執行[額外驗證](#validate-payload)。
6. 驗證後，伺服器回應受保護資源的內容。

## 安裝 JWT {id="install"}
要安裝 `jwt` 身份驗證提供程式，請在 `install` 區塊內呼叫 [jwt](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/jwt.html) 函數：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
//...
install(Authentication) {
    jwt {
        // 配置 jwt 身份驗證
    }
}
```
您可以選擇指定一個[提供程式名稱](server-auth.md#provider-name)，該名稱可用於[驗證指定路由](#authenticate-route)。

## 配置 JWT {id="configure-jwt"}
在本節中，我們將探討如何在 Ktor 伺服器應用程式中使用 JSON Web 令牌。我們將演示兩種簽署令牌的方法，因為它們需要稍微不同的驗證方式：
* 使用指定共享密鑰的 `HS256`。
* 使用公/私密鑰對的 `RS256`。

您可以在此處找到完整的專案：[auth-jwt-hs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-hs256)、[auth-jwt-rs256](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-jwt-rs256)。

### 步驟 1：配置 JWT 設定 {id="jwt-settings"}

要配置 JWT 相關設定，您可以在[配置檔](server-configuration-file.topic)中建立一個自訂的 `jwt` 群組。例如，`application.conf` 檔案可能如下所示：

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

```
```
{style="block" src="snippets/auth-jwt-hs256/src/main/resources/application-custom.conf" include-lines="11-16"}

</tab>
<tab title="RS256" group-key="rs256">

```
```
{style="block" src="snippets/auth-jwt-rs256/src/main/resources/application.conf" include-lines="11-16"}

</tab>
</tabs>

> 請注意，機密資訊不應以純文字形式儲存在配置檔中。考慮使用[環境變數](server-configuration-file.topic#environment-variables)來指定此類參數。
>
{type="warning"}

您可以透過以下方式[在程式碼中存取這些設定](server-configuration-file.topic#read-configuration-in-code)：

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="24-27"}

</tab>
<tab title="RS256" group-key="rs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-rs256/src/main/kotlin/com/example/Application.kt" include-lines="31-34"}

</tab>
</tabs>

### 步驟 2：生成令牌 {id="generate"}

要生成 JSON Web 令牌，您可以使用 [JWTCreator.Builder](https://javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTCreator.Builder.html)。以下程式碼片段展示了如何為 `HS256` 和 `RS256` 演算法執行此操作：

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="50-61"}

</tab>
<tab title="RS256" group-key="rs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-rs256/src/main/kotlin/com/example/Application.kt" include-lines="58-72"}

</tab>
</tabs>

1. `post("/login")` 定義了一個用於接收 `POST` 請求的身份驗證[路由](server-routing.md)。
2. `call.receive<User>()` [接收](server-serialization.md#receive_data)以 JSON 物件形式發送的使用者憑證，並將其轉換為 `User` 類別物件。
3. `JWT.create()` 使用指定的 JWT 設定生成令牌，新增一個帶有接收到的使用者名稱的自訂聲明 (claim)，並使用指定的演算法簽署令牌：
   * 對於 `HS256`，使用共享密鑰來簽署令牌。
   * 對於 `RS256`，使用公/私密鑰對。
4. `call.respond` [將](server-serialization.md#send_data)令牌以 JSON 物件形式發送給客戶端。

### 步驟 3：配置領域 {id="realm"}
當存取[受保護路由](#authenticate-route)時，`realm` 屬性允許您設定要在 `WWW-Authenticate` 標頭中傳遞的領域。

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="27-30,46-47"}

### 步驟 4：配置令牌驗證器 {id="configure-verifier"}

`verifier` 函數允許您驗證令牌的格式及其簽章：
* 對於 `HS256`，您需要傳遞一個 [JWTVerifier](https://www.javadoc.io/doc/com.auth0/java-jwt/latest/com/auth0/jwt/JWTVerifier.html) 實例來驗證令牌。
* 對於 `RS256`，您需要傳遞 [JwkProvider](https://www.javadoc.io/doc/com.auth0/jwks-rsa/latest/com/auth0/jwk/JwkProvider.html)，它指定了一個 JWKS 端點，用於存取用於驗證令牌的公鑰。在我們的案例中，發行者 (issuer) 是 `http://0.0.0.0:8080`，因此 JWKS 端點地址將是 `http://0.0.0.0:8080/.well-known/jwks.json`。

<tabs group="sign-alg">
<tab title="HS256" group-key="hs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="24-35,46-47"}

</tab>
<tab title="RS256" group-key="rs256">

```kotlin
```
{style="block" src="snippets/auth-jwt-rs256/src/main/kotlin/com/example/Application.kt" include-lines="32-44,55-56"}

</tab>
</tabs>

### 步驟 5：驗證 JWT 酬載 {id="validate-payload"}

1. `validate` 函數允許您對 JWT 酬載執行額外驗證。檢查 `credential` 參數，它表示一個 [JWTCredential](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-credential/index.html) 物件並包含 JWT 酬載。在以下範例中，檢查了一個自訂 `username` 聲明的值。
   ```kotlin
   ```
   {style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="28-29,36-42,46-47"}

   在身份驗證成功的情況下，傳回 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html)。
2. `challenge` 函數允許您配置在身份驗證失敗時要傳送的回應。
   ```kotlin
   ```
   {style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="28-29,43-47"}

### 步驟 6：保護特定資源 {id="authenticate-route"}

配置 `jwt` 提供程式後，您可以使用 **[authenticate](server-auth.md#authenticate-route)** 函數保護應用程式中的特定資源。在身份驗證成功的情況下，您可以使用 `call.principal` 函數在路由處理程式內部檢索已驗證的 [JWTPrincipal](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth-jwt/io.ktor.server.auth.jwt/-j-w-t-principal/index.html) 並取得 JWT 酬載。在以下範例中，檢索了自訂 `username` 聲明的值和令牌過期時間。

```kotlin
```
{style="block" src="snippets/auth-jwt-hs256/src/main/kotlin/com/example/Application.kt" include-lines="49,63-71"}