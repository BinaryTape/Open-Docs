[//]: # (title: 클라이언트 의존성 추가)

<show-structure for="chapter" depth="2"/>

<link-summary>기존 프로젝트에 클라이언트 의존성을 추가하는 방법을 알아봅니다.</link-summary>

Ktor HTTP 클라이언트를 프로젝트에서 사용하려면, [저장소를 설정](#repositories)하고 다음 의존성을 추가해야 합니다:

- **[ktor-client-core](#client-dependency)**

  `ktor-client-core`는 핵심 Ktor 클라이언트 기능을 포함합니다.
- **[엔진 의존성](#engine-dependency)**

  엔진은 네트워크 요청을 처리하는 데 사용됩니다.
  [특정 플랫폼](client-supported-platforms.md)에는 네트워크 요청을 처리하는 특정 엔진이 필요할 수 있습니다.
- (선택 사항) **[로깅 의존성](#logging-dependency)**

  구조화되고 유연한 로깅 기능을 활성화하기 위해 로깅 프레임워크를 제공합니다.

- (선택 사항) **[플러그인 의존성](#plugin-dependency)**

  플러그인은 클라이언트에 특정 기능을 확장하는 데 사용됩니다.

undefined

## 의존성 추가 {id="add-ktor-dependencies"}

> [다양한 플랫폼](client-supported-platforms.md)의 경우, Ktor는 `-jvm` 또는 `-js`와 같은 접미사가 붙은 플랫폼별 아티팩트를 제공합니다. 예를 들어, `ktor-client-core-jvm`과 같습니다. Gradle은 주어진 플랫폼에 적합한 아티팩트를 자동으로 해결하지만, Maven은 이 기능을 지원하지 않습니다. 즉, Maven의 경우 플랫폼별 접미사를 수동으로 추가해야 합니다.
>
{type="tip"}

### 클라이언트 의존성 {id="client-dependency"}

주요 클라이언트 기능은 `ktor-client-core` 아티팩트에서 사용할 수 있습니다. 빌드 시스템에 따라 다음 방식으로 추가할 수 있습니다:

<var name="artifact_name" value="ktor-client-core"/>

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
    

`$ktor_version`을 필요한 Ktor 버전으로 바꿀 수 있습니다. 예를 들어, `%ktor_version%`과 같이 말이죠.

#### 멀티플랫폼 {id="client-dependency-multiplatform"}

멀티플랫폼 프로젝트의 경우, `gradle/libs.versions.toml` 파일에서 Ktor 버전과 `ktor-client-core` 아티팩트를 정의할 수 있습니다:

[object Promise]

그런 다음, `commonMain` 소스 세트에 `ktor-client-core`를 의존성으로 추가합니다:

[object Promise]

### 엔진 의존성 {id="engine-dependency"}

[엔진](client-engines.md)은 네트워크 요청을 처리하는 역할을 합니다. Apache, CIO, Android, iOS 등 다양한 플랫폼에서 사용할 수 있는 여러 클라이언트 엔진이 있습니다. 예를 들어, 다음과 같이 `CIO` 엔진 의존성을 추가할 수 있습니다:

<var name="artifact_name" value="ktor-client-cio"/>

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
    

#### 멀티플랫폼 {id="engine-dependency-multiplatform"}

멀티플랫폼 프로젝트의 경우, 필요한 엔진에 대한 의존성을 해당 소스 세트에 추가해야 합니다.

예를 들어, Android용 `OkHttp` 엔진 의존성을 추가하려면, 먼저 `gradle/libs.versions.toml` 파일에서 Ktor 버전과 `ktor-client-okhttp` 아티팩트를 정의할 수 있습니다:

[object Promise]

그런 다음, `androidMain` 소스 세트에 `ktor-client-okhttp`를 의존성으로 추가합니다:

[object Promise]

특정 엔진에 필요한 전체 의존성 목록은 [](client-engines.md#dependencies)를 참조하세요.

### 로깅 의존성

<snippet id="jvm-logging">
  <p>
[JVM](#jvm)에서 Ktor는 로깅을 위한 추상화 계층으로 Simple Logging Facade for Java
(<a href="http://www.slf4j.org/">SLF4J</a>)를 사용합니다. SLF4J는 로깅 API를 기본 로깅 구현으로부터 분리하여, 애플리케이션 요구 사항에 가장 적합한 로깅 프레임워크를 통합할 수 있도록 합니다.
일반적인 선택 사항으로는 <a href="https://logback.qos.ch/">Logback</a> 또는
<a href="https://logging.apache.org/log4j">Log4j</a>가 있습니다. 프레임워크가 제공되지 않으면 SLF4J는 기본적으로 no-operation (NOP) 구현으로 동작하며, 이는 본질적으로 로깅을 비활성화합니다.
  </p>

  <p>
로깅을 활성화하려면, <a href="https://logback.qos.ch/">Logback</a>과 같이 필요한 SLF4J 구현이 포함된 아티팩트를 추가하세요:
  </p>
  <var name="group_id" value="ch.qos.logback"/>
  <var name="artifact_name" value="logback-classic"/>
  <var name="version" value="logback_version"/>
  <include from="lib.topic" element-id="add_artifact"/>
</snippet>

Ktor 로깅에 대한 자세한 내용은 [](client-logging.md)를 참조하세요.

### 플러그인 의존성 {id="plugin-dependency"}

Ktor를 사용하면 기본적으로 제공되지 않는 추가 클라이언트 기능([플러그인](client-plugins.md))을 사용할 수 있습니다. 예를 들어 인증(authorization) 및 직렬화(serialization) 등이 있습니다. 이들 중 일부는 별도의 아티팩트로 제공됩니다. 필요한 플러그인에 대한 주제에서 어떤 의존성이 필요한지 확인할 수 있습니다.

> 멀티플랫폼 프로젝트의 경우, 플러그인 의존성은 `commonMain` 소스 세트에 추가해야 합니다. 일부 플러그인은 특정 플랫폼에 대한 [제한 사항](client-engines.md#limitations)을 가질 수 있습니다.

## Ktor 버전 일관성 유지

<chapter title="Ktor BOM 의존성 사용">

Ktor BOM은 각 의존성의 버전을 개별적으로 지정하지 않고도 모든 Ktor 모듈이 동일한 일관된 버전을 사용하도록 보장합니다.

Ktor BOM 의존성을 추가하려면, 빌드 스크립트에 다음과 같이 선언합니다:

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
</chapter>

<var name="target_module" value="client"/>
undefined