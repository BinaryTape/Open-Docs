[//]: # (title: 클라이언트 종속성 추가)

<show-structure for="chapter" depth="2"/>

<link-summary>기존 프로젝트에 클라이언트 종속성을 추가하는 방법을 알아봅니다.</link-summary>

프로젝트에서 Ktor HTTP 클라이언트를 사용하려면 [레포지토리 구성](#repositories)이 필요하며 다음 종속성을 추가해야 합니다.

-   **[ktor-client-core](#client-dependency)**

    `ktor-client-core`는 핵심 Ktor 클라이언트 기능을 포함합니다.
-   **[엔진 종속성](#engine-dependency)**

    엔진은 네트워크 요청을 처리하는 데 사용됩니다.
    [특정 플랫폼](client-supported-platforms.md)에는 네트워크 요청을 처리하는 특정 엔진이 필요할 수 있습니다.
-   (선택 사항) **[로깅 종속성](#logging-dependency)**

    구조화되고 유연한 로깅 기능을 활성화하기 위한 로깅 프레임워크를 제공합니다.

-   (선택 사항) **[플러그인 종속성](#plugin-dependency)**

    플러그인은 특정 기능으로 클라이언트를 확장하는 데 사용됩니다.

<p>
    Ktor 종속성을 추가하기 전에, 이 프로젝트의 레포지토리를 구성해야 합니다.
</p>
<list>
    <li>
        <p>
            <control>프로덕션</control>
        </p>
        <p>
            Ktor의 프로덕션 릴리스는 Maven 중앙 레포지토리에서 사용할 수 있습니다.
            빌드 스크립트에서 이 레포지토리를 다음과 같이 선언할 수 있습니다.
        </p>
        <Tabs group="languages">
            <TabItem title="Gradle (Kotlin)" group-key="kotlin">
                <code-block lang="Kotlin" code="                    repositories {&#10;                        mavenCentral()&#10;                    }"/>
            </TabItem>
            <TabItem title="Gradle (Groovy)" group-key="groovy">
                <code-block lang="Groovy" code="                    repositories {&#10;                        mavenCentral()&#10;                    }"/>
            </TabItem>
            <TabItem title="Maven" group-key="maven">
                <note>
                    <p>
                        프로젝트는 <a href="https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#super-pom">Super POM</a>으로부터 중앙 레포지토리를 상속하므로 <path>pom.xml</path> 파일에 Maven 중앙 레포지토리를 추가할 필요가 없습니다.
                    </p>
                </note>
            </TabItem>
        </Tabs>
    </li>
    <li>
        <p>
            <control>얼리 액세스 프로그램 (EAP)</control>
        </p>
        <p>
            Ktor의 <a href="https://ktor.io/eap/">EAP</a> 버전에 액세스하려면 <a href="https://maven.pkg.jetbrains.space/public/p/ktor/eap/io/ktor/">Space 레포지토리</a>를 참조해야 합니다.
        </p>
        <Tabs group="languages">
            <TabItem title="Gradle (Kotlin)" group-key="kotlin">
                <code-block lang="Kotlin" code="                    repositories {&#10;                        maven {&#10;                            url = uri(&quot;https://maven.pkg.jetbrains.space/public/p/ktor/eap&quot;)&#10;                        }&#10;                    }"/>
            </TabItem>
            <TabItem title="Gradle (Groovy)" group-key="groovy">
                <code-block lang="Groovy" code="                    repositories {&#10;                        maven {&#10;                            url &quot;https://maven.pkg.jetbrains.space/public/p/ktor/eap&quot;&#10;                        }&#10;                    }"/>
            </TabItem>
            <TabItem title="Maven" group-key="maven">
                <code-block lang="XML" code="                    &lt;repositories&gt;&#10;                        &lt;repository&gt;&#10;                            &lt;id&gt;ktor-eap&lt;/id&gt;&#10;                            &lt;url&gt;https://maven.pkg.jetbrains.space/public/p/ktor/eap&lt;/url&gt;&#10;                        &lt;/repository&gt;&#10;                    &lt;/repositories&gt;"/>
            </TabItem>
        </Tabs>
        <p>
            Ktor EAP는 <a href="https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev">Kotlin 개발 레포지토리</a>를 요구할 수 있습니다.
        </p>
        <Tabs group="languages">
            <TabItem title="Gradle (Kotlin)" group-key="kotlin">
                <code-block lang="Kotlin" code="                    repositories {&#10;                        maven {&#10;                            url = uri(&quot;https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev&quot;)&#10;                        }&#10;                    }"/>
            </TabItem>
            <TabItem title="Gradle (Groovy)" group-key="groovy">
                <code-block lang="Groovy" code="                    repositories {&#10;                        maven {&#10;                            url &quot;https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev&quot;&#10;                        }&#10;                    }"/>
            </TabItem>
            <TabItem title="Maven" group-key="maven">
                <code-block lang="XML" code="                    &lt;repositories&gt;&#10;                        &lt;repository&gt;&#10;                            &lt;id&gt;ktor-eap&lt;/id&gt;&#10;                            &lt;url&gt;https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev&lt;/url&gt;&#10;                        &lt;/repository&gt;&#10;                    &lt;/repositories&gt;"/>
            </TabItem>
        </Tabs>
    </li>
</list>

## 종속성 추가 {id="add-ktor-dependencies"}

> [다양한 플랫폼](client-supported-platforms.md)을 위해 Ktor는 `-jvm` 또는 `-js`와 같은 접미사가 붙은 플랫폼별 아티팩트를 제공합니다. 예를 들어, `ktor-client-core-jvm`과 같습니다. Gradle은 주어진 플랫폼에 적합한 아티팩트를 자동으로 해결하지만, Maven은 이 기능을 지원하지 않습니다. 이는 Maven의 경우 플랫폼별 접미사를 수동으로 추가해야 함을 의미합니다.
>
{type="tip"}

### 클라이언트 종속성 {id="client-dependency"}

주요 클라이언트 기능은 `ktor-client-core` 아티팩트에서 사용할 수 있습니다. 빌드 시스템에 따라 다음과 같이 추가할 수 있습니다.

<var name="artifact_name" value="ktor-client-core"/>
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

`$ktor_version`을 필요한 Ktor 버전으로 바꿀 수 있습니다. 예를 들어, `%ktor_version%`과 같이 말입니다.

#### 멀티플랫폼 {id="client-dependency-multiplatform"}

멀티플랫폼 프로젝트의 경우, `gradle/libs.versions.toml` 파일에서 Ktor 버전과 `ktor-client-core` 아티팩트를 정의할 수 있습니다.

```kotlin
[versions]
ktor = "3.3.1"

[libraries]
ktor-client-core = { module = "io.ktor:ktor-client-core", version.ref = "ktor" }
```

그런 다음, `commonMain` 소스 세트에 `ktor-client-core`를 종속성으로 추가합니다.

```kotlin
sourceSets {
    commonMain.dependencies {
        implementation(libs.ktor.client.core)
    }
}
```

### 엔진 종속성 {id="engine-dependency"}

[엔진](client-engines.md)은 네트워크 요청을 처리하는 역할을 합니다. Apache, CIO, Android, iOS 등 다양한 플랫폼에서 사용할 수 있는 여러 클라이언트 엔진이 있습니다. 예를 들어, `CIO` 엔진 종속성을 다음과 같이 추가할 수 있습니다.

<var name="artifact_name" value="ktor-client-cio"/>
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

#### 멀티플랫폼 {id="engine-dependency-multiplatform"}

멀티플랫폼 프로젝트의 경우, 해당 소스 세트에 필요한 엔진에 대한 종속성을 추가해야 합니다.

예를 들어, Android용 `OkHttp` 엔진 종속성을 추가하려면 먼저 `gradle/libs.versions.toml` 파일에서 Ktor 버전과 `ktor-client-okhttp` 아티팩트를 정의할 수 있습니다.

```kotlin
[versions]
ktor = "3.3.1"

[libraries]
ktor-client-okhttp = { module = "io.ktor:ktor-client-okhttp", version.ref = "ktor" }
```

그런 다음, `androidMain` 소스 세트에 `ktor-client-okhttp`를 종속성으로 추가합니다.

```kotlin
sourceSets {
    androidMain.dependencies {
        implementation(libs.ktor.client.okhttp)
    }
}
```

특정 엔진에 필요한 종속성의 전체 목록은 [엔진 종속성 추가](client-engines.md#dependencies)를 참조하십시오.

### 로깅 종속성

  <p>
    <a href="#jvm">JVM</a>에서 Ktor는 로깅을 위한 추상화 계층으로 Java용 Simple Logging Facade
    (<a href="http://www.slf4j.org/">SLF4J</a>)를 사용합니다. SLF4J는 로깅 API를 기본 로깅 구현으로부터 분리하여,
    애플리케이션의 요구 사항에 가장 적합한 로깅 프레임워크를 통합할 수 있도록 합니다.
    일반적인 선택 사항으로는 <a href="https://logback.qos.ch/">Logback</a> 또는
    <a href="https://logging.apache.org/log4j">Log4j</a>가 있습니다. 프레임워크가 제공되지 않으면 SLF4J는 기본적으로
    로깅을 비활성화하는 NOP(No-Operation) 구현으로 설정됩니다.
  </p>

  <p>
    로깅을 활성화하려면 <a href="https://logback.qos.ch/">Logback</a>과 같이 필요한 SLF4J 구현이 포함된 아티팩트를 포함합니다.
  </p>
  <var name="group_id" value="ch.qos.logback"/>
  <var name="artifact_name" value="logback-classic"/>
  <var name="version" value="logback_version"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                  &lt;version&gt;${%version%}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

Ktor의 로깅에 대한 자세한 내용은 [Ktor 클라이언트의 로깅](client-logging.md)을 참조하십시오.

### 플러그인 종속성 {id="plugin-dependency"}

Ktor를 사용하면 기본적으로 제공되지 않는 추가 클라이언트 기능([플러그인](client-plugins.md)) (예: 인증 및 직렬화)을 사용할 수 있습니다. 이 중 일부는 별도의 아티팩트로 제공됩니다. 필요한 플러그인에 대한 토픽에서 어떤 종속성이 필요한지 알 수 있습니다.

> 멀티플랫폼 프로젝트의 경우, 플러그인 종속성은 `commonMain` 소스 세트에 추가되어야 합니다. 일부 플러그인은 특정 플랫폼에 대한 [제한 사항](client-engines.md#limitations)이 있을 수 있습니다.

## Ktor 버전 일관성 보장

<chapter title="Ktor BOM 종속성 사용">

Ktor BOM은 각 종속성에 대해 개별적으로 버전을 지정하지 않고도 모든 Ktor 모듈이 동일하고 일관된 버전을 사용하도록 보장합니다.

Ktor BOM 종속성을 추가하려면 빌드 스크립트에서 다음과 같이 선언합니다.

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(platform(&quot;io.ktor:ktor-bom:$ktor_version&quot;))"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation platform &quot;io.ktor:ktor-bom:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependencyManagement&gt;&#10;              &lt;dependencies&gt;&#10;                  &lt;dependency&gt;&#10;                      &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                      &lt;artifactId&gt;ktor-bom&lt;/artifactId&gt;&#10;                      &lt;version&gt;%ktor_version%&lt;/version&gt;&#10;                      &lt;type&gt;pom&lt;/type&gt;&#10;                      &lt;scope&gt;import&lt;/scope&gt;&#10;                  &lt;/dependency&gt;&#10;              &lt;/dependencies&gt;&#10;          &lt;/dependencyManagement&gt;"/>
    </TabItem>
</Tabs>
</chapter>

<var name="target_module" value="client"/>
<p>
    게시된 버전 카탈로그를 사용하여 Ktor 종속성 선언을 중앙화할 수도 있습니다.
    이 접근 방식은 다음과 같은 이점을 제공합니다.
</p>
<list id="published-version-catalog-benefits">
    <li>
        자체 카탈로그에 Ktor 버전을 수동으로 선언할 필요가 없어집니다.
    </li>
    <li>
        모든 Ktor 모듈을 단일 네임스페이스 아래에 노출합니다.
    </li>
</list>
<p>
    카탈로그를 선언하려면, <path>settings.gradle.kts</path>에서 선택한 이름으로 버전 카탈로그를 생성하십시오.
</p>
<code-block lang="kotlin" code="    dependencyResolutionManagement {&#10;        versionCatalogs {&#10;            create(&quot;ktorLibs&quot;) {&#10;                from(&quot;io.ktor:ktor-version-catalog:%ktor_version%&quot;)&#10;            }&#10;        }&#10;    }"/>
<p>
    그런 다음, 모듈의 <path>build.gradle.kts</path>에서 카탈로그 이름을 참조하여 종속성을 추가할 수 있습니다.
</p>
<code-block lang="kotlin" code="    dependencies {&#10;        implementation(ktorLibs.%target_module%.core)&#10;        // ...&#10;    }"/>