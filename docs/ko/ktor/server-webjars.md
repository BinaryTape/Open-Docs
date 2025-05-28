[//]: # (title: Webjars)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Webjars"/>
<var name="package_name" value="io.ktor.server.webjars"/>
<var name="artifact_name" value="ktor-server-webjars"/>

<tldr>
<p>
<b>필수 의존성</b>: `io.ktor:%artifact_name%`
</p>
<var name="example_name" value="webjars"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
%plugin_name% 플러그인을 사용하면 WebJars에서 제공하는 클라이언트 측 라이브러리를 제공할 수 있습니다.
</link-summary>

[`%plugin_name%`](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-webjars/io.ktor.server.webjars/-webjars.html) 플러그인을 사용하면 [WebJars](https://www.webjars.org/)에서 제공하는 클라이언트 측 라이브러리를 제공할 수 있습니다. 이 플러그인을 사용하면 JavaScript 및 CSS 라이브러리와 같은 자산을 [팻 JAR(fat JAR)](server-fatjar.md)의 일부로 패키징할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}
`%plugin_name%`을 활성화하려면 빌드 스크립트에 다음 아티팩트를 포함해야 합니다.
* `%artifact_name%` 의존성을 추가합니다:

  <include from="lib.topic" element-id="add_ktor_artifact"/>

* 필요한 클라이언트 측 라이브러리에 대한 의존성을 추가합니다. 아래 예시는 Bootstrap 아티팩트를 추가하는 방법을 보여줍니다:

  <var name="group_id" value="org.webjars"/>
  <var name="artifact_name" value="bootstrap"/>
  <var name="version" value="bootstrap_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
  
  `$bootstrap_version`을 `bootstrap` 아티팩트의 필요한 버전, 예를 들어 `%bootstrap_version%`으로 대체할 수 있습니다.

## `%plugin_name%` 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## `%plugin_name%` 구성 {id="configure"}

기본적으로 `%plugin_name%`은 `/webjars` 경로에서 WebJars 자산을 제공합니다. 아래 예시는 이를 변경하여 모든 WebJars 자산을 `/assets` 경로에서 제공하는 방법을 보여줍니다.

```kotlin
```
{src="snippets/webjars/src/main/kotlin/com/example/Application.kt" include-lines="3,6-7,10-13,17"}

예를 들어, `org.webjars:bootstrap` 의존성을 설치했다면 다음과 같이 `bootstrap.css`를 추가할 수 있습니다.

```html
```
{src="snippets/webjars/src/main/resources/files/index.html" include-lines="3,8-9"}

`%plugin_name%`은 의존성을 로드하는 데 사용되는 경로를 변경하지 않고도 의존성 버전을 변경할 수 있도록 한다는 점에 유의하십시오.

> 전체 예시는 다음에서 찾을 수 있습니다: [webjars](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/webjars).