[//]: # (title: 모듈)

<tldr>
<p>
<b>코드 예시</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.</link-summary>

Ktor를 사용하면 특정 모듈 내에서 특정 [경로](server-routing.md) 집합을 정의하여 애플리케이션을 [구조화](server-application-structure.md)하기 위해 모듈을 사용할 수 있습니다. 모듈은 `Application` 클래스의 _[확장 함수](https://kotlinlang.org/docs/extensions.html)_ 입니다. 아래 예시에서 `module1` 확장 함수는 `/module1` URL 경로로 이루어진 GET 요청을 수락하는 모듈을 정의합니다.

```kotlin
```
{src="snippets/engine-main-modules/src/main/kotlin/com/example/Application.kt" include-lines="3-6,9-15"}

애플리케이션에서 모듈을 로드하는 방식은 [서버를 생성](server-create-and-configure.topic)하는 방식에 따라 달라집니다. 즉, `embeddedServer` 함수를 사용하여 코드에서 생성하는 방식 또는 `application.conf` 설정 파일을 사용하는 방식에 따라 달라집니다.

> 참고: 특정 모듈에 설치된 [플러그인](server-plugins.md#install)은 다른 로드된 모듈에도 영향을 미칩니다.

## embeddedServer {id="embedded-server"}

일반적으로 `embeddedServer` 함수는 람다 인수로 모듈을 암묵적으로 받습니다. [](server-create-and-configure.topic#embedded-server) 섹션에서 예시를 확인할 수 있습니다. 애플리케이션 로직을 별도의 모듈로 추출하고 이 모듈에 대한 참조를 `module` 파라미터로 전달할 수도 있습니다:

```kotlin
```
{src="snippets/embedded-server-modules/src/main/kotlin/com/example/Application.kt"}

전체 예시는 다음에서 확인할 수 있습니다: [embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules).

## 설정 파일 {id="hocon"}

`application.conf` 또는 `application.yaml` 파일을 사용하여 서버를 설정하는 경우, `ktor.application.modules` 속성을 사용하여 로드할 모듈을 지정해야 합니다.

두 개의 패키지에 세 개의 모듈이 정의되어 있다고 가정해 보겠습니다: `com.example` 패키지에 두 개, `org.sample` 패키지에 하나입니다.

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

설정 파일에서 이 모듈들을 참조하려면 정규화된 이름(fully qualified name)을 제공해야 합니다. 정규화된 모듈 이름에는 클래스의 정규화된 이름과 확장 함수 이름이 포함됩니다.

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

전체 예시는 다음에서 확인할 수 있습니다: [engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules).