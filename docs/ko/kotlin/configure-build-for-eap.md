[//]: # (title: EAP용 빌드 설정하기)

<tldr>
    <!--  
    <p>No preview versions are currently available.</p>
    -->
    <p>최신 Kotlin EAP 릴리스: <strong>%kotlinEapVersion%</strong></p>
    <p><a href="eap.md#build-details">Kotlin EAP 릴리스 세부 정보 살펴보기</a></p>
</tldr>

Kotlin EAP 버전을 사용하도록 빌드를 구성하려면 다음을 수행해야 합니다.

*   Kotlin의 EAP 버전을 지정합니다. [사용 가능한 EAP 버전은 여기에 나열되어 있습니다](eap.md#build-details).
*   의존성 버전을 EAP 버전으로 변경합니다.
Kotlin EAP 버전은 이전에 릴리스된 버전의 라이브러리와 호환되지 않을 수 있습니다.

다음 절차는 Gradle 및 Maven에서 빌드를 구성하는 방법을 설명합니다.

*   [Gradle에서 구성](#configure-in-gradle)
*   [Maven에서 구성](#configure-in-maven)

## Gradle에서 구성

이 섹션에서는 다음 방법을 설명합니다.

*   [Kotlin 버전 조정](#adjust-the-kotlin-version)
*   [의존성 버전 조정](#adjust-versions-in-dependencies)

### Kotlin 버전 조정

`build.gradle(.kts)` 내의 `plugins` 블록에서 `KOTLIN-EAP-VERSION`을 실제 EAP 버전(예: `%kotlinEapVersion%`)으로 변경합니다. [사용 가능한 EAP 버전은 여기에 나열되어 있습니다](eap.md#build-details).

또는 `settings.gradle(.kts)` 파일의 `pluginManagement` 블록에서 EAP 버전을 지정할 수 있습니다. 자세한 내용은 [Gradle 문서](https://docs.gradle.org/current/userguide/plugins.html#sec:plugin_version_management)를 참조하세요.

다음은 멀티플랫폼 프로젝트의 예시입니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    java
    kotlin("multiplatform") version "KOTLIN-EAP-VERSION"
}

repositories {
    mavenCentral()
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'java'
    id 'org.jetbrains.kotlin.multiplatform' version 'KOTLIN-EAP-VERSION'
}

repositories {
    mavenCentral()
}
```

</tab>
</tabs>

### 의존성 버전 조정

프로젝트에서 kotlinx 라이브러리를 사용하는 경우, 라이브러리 버전이 Kotlin EAP 버전과 호환되지 않을 수 있습니다.

이 문제를 해결하려면 의존성에 호환되는 라이브러리 버전을 지정해야 합니다. 호환되는 라이브러리 목록은 [EAP 빌드 세부 정보](eap.md#build-details)를 참조하세요.

> 대부분의 경우 특정 릴리스의 첫 EAP 버전에 대해서만 라이브러리를 생성하며, 이 라이브러리들은 해당 릴리스의 후속 EAP 버전과 호환됩니다.
>
> 다음 EAP 버전에 호환되지 않는 변경 사항이 있는 경우, 새 버전의 라이브러리를 릴리스합니다.
>
{style="note"}

다음은 예시입니다.

**kotlinx.coroutines** 라이브러리의 경우, `%kotlinEapVersion%`과 호환되는 버전 번호인 `%coroutinesEapVersion%`을 추가합니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesEapVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesEapVersion%"
}
```

</tab>
</tabs>

## Maven에서 구성

샘플 Maven 프로젝트 정의에서 `KOTLIN-EAP-VERSION`을 실제 버전(예: `%kotlinEapVersion%`)으로 바꿉니다. [사용 가능한 EAP 버전은 여기에 나열되어 있습니다](eap.md#build-details).

```xml
<project ...>
    <properties>
        <kotlin.version>KOTLIN-EAP-VERSION</kotlin.version>
    </properties>

    <repositories>
        <repository>
           <id>mavenCentral</id>
           <url>https://repo1.maven.org/maven2/</url>
        </repository>
    </repositories>

    <pluginRepositories>
       <pluginRepository>
          <id>mavenCentral</id>
          <url>https://repo1.maven.org/maven2/</url>
       </pluginRepository>
    </pluginRepositories>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-maven-plugin</artifactId>
                <version>${kotlin.version}</version>
                ...
            </plugin>
        </plugins>
    </build>
</project>
```

## 문제 발생 시

*   [저희 이슈 트래커인 YouTrack](https://kotl.in/issue)에 문제를 보고하세요.
*   [#eap channel in Kotlin Slack](https://app.slack.com/client/T09229ZC6/C0KLZSCHF)에서 도움을 찾으세요 ([초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).
*   최신 안정 버전으로 롤백하세요: [빌드 스크립트 파일에서 변경](#adjust-the-kotlin-version).