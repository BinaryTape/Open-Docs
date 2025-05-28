[//]: # (title: 클라이언트 의존성 추가하기)

<show-structure for="chapter" depth="2"/>

<link-summary>기존 프로젝트에 클라이언트 의존성을 추가하는 방법을 알아봅니다.</link-summary>

프로젝트에서 Ktor HTTP 클라이언트를 사용하려면 [저장소를 구성](#repositories)하고 다음 의존성을 추가해야 합니다:

- **[ktor-client-core](#client-dependency)**

  `ktor-client-core`는 핵심 Ktor 클라이언트 기능을 포함합니다.
- **[엔진 의존성](#engine-dependency)**

  엔진은 네트워크 요청을 처리하는 데 사용됩니다.
  [특정 플랫폼](client-supported-platforms.md)에는 네트워크 요청을 처리하는 특정 엔진이 필요할 수 있습니다.
- (선택 사항) **[로깅 의존성](#logging-dependency)**

  구조화되고 유연한 로깅 기능을 활성화하려면 로깅 프레임워크를 제공하세요.

- (선택 사항) **[플러그인 의존성](#plugin-dependency)**

  플러그인은 특정 기능으로 클라이언트를 확장하는 데 사용됩니다.

<include from="server-dependencies.topic" element-id="repositories"/>

## 의존성 추가하기 {id="add-ktor-dependencies"}

> [다양한 플랫폼](client-supported-platforms.md)의 경우, Ktor는 `-jvm` 또는 `-js`와 같은 접미사가 붙은 플랫폼별 아티팩트(예: `ktor-client-core-jvm`)를 제공합니다. Gradle은 주어진 플랫폼에 적합한 아티팩트를 자동으로 해결하지만, Maven은 이 기능을 지원하지 않습니다. 따라서 Maven의 경우 플랫폼별 접미사를 수동으로 추가해야 합니다.
>
{type="tip"}

### 클라이언트 의존성 {id="client-dependency"}

주요 클라이언트 기능은 `ktor-client-core` 아티팩트에서 사용할 수 있습니다. 빌드 시스템에 따라 다음 방법으로 추가할 수 있습니다:

<var name="artifact_name" value="ktor-client-core"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

`$ktor_version`을 필요한 Ktor 버전으로 바꿀 수 있습니다. 예를 들어, `%ktor_version%`과 같이 사용할 수 있습니다.

#### 멀티플랫폼 {id="client-dependency-multiplatform"}

멀티플랫폼 프로젝트의 경우, `gradle/libs.versions.toml` 파일에서 Ktor 버전과 `ktor-client-core` 아티팩트를 정의할 수 있습니다:

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="1,5,10-11,19"}

그런 다음, `ktor-client-core`를 `commonMain` 소스 세트에 의존성으로 추가합니다:

```kotlin
```

{src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="26-28,30,40"}

### 엔진 의존성 {id="engine-dependency"}

[엔진](client-engines.md)은 네트워크 요청을 처리하는 역할을 합니다. Apache, CIO, Android, iOS 등 다양한 플랫폼에서 사용할 수 있는 여러 클라이언트 엔진이 있습니다. 예를 들어, 다음과 같이 `CIO` 엔진 의존성을 추가할 수 있습니다:

<var name="artifact_name" value="ktor-client-cio"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

#### 멀티플랫폼 {id="engine-dependency-multiplatform"}

멀티플랫폼 프로젝트의 경우, 필요한 엔진에 대한 의존성을 해당 소스 세트에 추가해야 합니다.

예를 들어, Android용 `OkHttp` 엔진 의존성을 추가하려면 먼저 `gradle/libs.versions.toml` 파일에서 Ktor 버전과 `ktor-client-okhttp` 아티팩트를 정의할 수 있습니다:

```kotlin
```

{src="snippets/tutorial-client-kmm/gradle/libs.versions.toml" include-lines="1,5,10-11,20"}

그런 다음, `ktor-client-okhttp`를 `androidMain` 소스 세트에 의존성으로 추가합니다:

```kotlin
```

{src="snippets/tutorial-client-kmm/shared/build.gradle.kts" include-lines="26,34-36,40"}

특정 엔진에 필요한 의존성 전체 목록은 [](client-engines.md#dependencies)를 참조하세요.

### 로깅 의존성

<include from="client-logging.md" element-id="jvm-logging"/>

Ktor의 로깅에 대한 자세한 내용은 [](client-logging.md)를 참조하세요.

### 플러그인 의존성 {id="plugin-dependency"}

Ktor를 사용하면 권한 부여 및 직렬화와 같이 기본적으로 제공되지 않는 추가 클라이언트 기능([플러그인](client-plugins.md))을 사용할 수 있습니다. 이들 중 일부는 별도의 아티팩트로 제공됩니다. 필요한 플러그인에 대한 항목에서 어떤 의존성이 필요한지 확인할 수 있습니다.

> 멀티플랫폼 프로젝트의 경우, 플러그인 의존성은 `commonMain` 소스 세트에 추가되어야 합니다. 일부 플러그인은 특정 플랫폼에 대해 [제한 사항](client-engines.md#limitations)이 있을 수 있습니다.