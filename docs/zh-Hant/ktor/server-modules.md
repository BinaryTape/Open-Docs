[//]: # (title: 模組)

<tldr>
<p>
<b>程式碼範例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>模組允許您透過分組路由來組織您的應用程式。</link-summary>

Ktor 允許您使用模組，透過在特定模組內定義一組特定的[路由](server-routing.md)，來[組織](server-application-structure.md)您的應用程式。模組是 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html) 類別的_ [擴充函數](https://kotlinlang.org/docs/extensions.html)_。在下面的範例中，`module1` 擴充函數定義了一個模組，它接受對 `/module1` URL 路徑發出的 GET 請求。

```kotlin
```
{src="snippets/engine-main-modules/src/main/kotlin/com/example/Application.kt" include-lines="3-6,9-15"}

在您的應用程式中載入模組，取決於[建立伺服器](server-create-and-configure.topic)的方式：在程式碼中使用 `embeddedServer` 函數，或者使用 `application.conf` 設定檔。

> 請注意，安裝在指定模組中的[外掛](server-plugins.md#install)對於其他已載入的模組也有效。

## embeddedServer {id="embedded-server"}

通常，`embeddedServer` 函數會隱式地將模組作為一個 lambda 引數來接受。您可以在 [](server-create-and-configure.topic#embedded-server) 小節中看到該範例。您也可以將應用程式邏輯提取到一個單獨的模組中，並將該模組的參照作為 `module` 參數傳遞：

```kotlin
```
{src="snippets/embedded-server-modules/src/main/kotlin/com/example/Application.kt"}

您可以在這裡找到完整的範例：[embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules)。

## 設定檔 {id="hocon"}

如果您使用 `application.conf` 或 `application.yaml` 檔案來配置伺服器，您需要使用 `ktor.application.modules` 屬性來指定要載入的模組。

假設您在兩個套件中定義了三個模組：`com.example` 套件中有兩個模組，`org.sample` 套件中有一個模組。

<tabs>
<tab title="Application.kt">

```kotlin
```
{src="snippets/engine-main-modules/src/main/kotlin/com/example/Application.kt"}

</tab>
<tab title="Sample.kt">

```kotlin
```
{src="snippets/engine-main-modules/src/main/kotlin/org/sample/Sample.kt"}

</tab>
</tabs>

要在設定檔中參照這些模組，您需要提供它們的完全限定名稱。一個完全限定的模組名稱包含類別的完全限定名稱和擴充函數名稱。

<tabs group="config">
<tab title="application.conf" group-key="hocon">

```shell
```
{src="snippets/engine-main-modules/src/main/resources/application.conf" include-lines="1,5-10"}

</tab>
<tab title="application.yaml" group-key="yaml">

```yaml
```
{src="snippets/engine-main-modules/src/main/resources/_application.yaml" include-lines="1,4-8"}

</tab>
</tabs>

您可以在這裡找到完整的範例：[engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules)。