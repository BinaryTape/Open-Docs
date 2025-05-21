---
title: "EAP 빌드 구성"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   현재 사용 가능한 미리 보기 버전이 없습니다.
</p>
    <!-- <p>Latest Kotlin EAP release: <strong>2.1.20-RC3</strong></p> -->
<p>
   <a href="eap#build-details">Kotlin EAP 릴리스 세부 정보 살펴보기</a>
</p>

:::

Kotlin EAP 버전을 사용하도록 빌드를 구성하려면 다음이 필요합니다.

* Kotlin의 EAP 버전을 지정합니다. [사용 가능한 EAP 버전은 여기에 나와 있습니다](eap#build-details).
* 종속성의 버전을 EAP 버전으로 변경합니다.
Kotlin EAP 버전은 이전에 릴리스된 버전의 라이브러리와 호환되지 않을 수 있습니다.

다음 절차에서는 Gradle 및 Maven에서 빌드를 구성하는 방법을 설명합니다.

* [Gradle에서 구성](#configure-in-gradle)
* [Maven에서 구성](#configure-in-maven)

## Gradle에서 구성

이 섹션에서는 다음을 수행하는 방법을 설명합니다.

* [Kotlin 버전 조정](#adjust-the-kotlin-version)
* [종속성의 버전 조정](#adjust-versions-in-dependencies)

### Kotlin 버전 조정

`build.gradle(.kts)` 내의 `plugins` 블록에서 `KOTLIN-EAP-VERSION`을 `2.1.20-RC3`과 같은 실제 EAP 버전으로 변경합니다. [사용 가능한 EAP 버전은 여기에 나와 있습니다](eap#build-details).

또는 `settings.gradle(.kts)`의 `pluginManagement` 블록에서 EAP 버전을 지정할 수 있습니다. 자세한 내용은 [Gradle 설명서](https://docs.gradle.org/current/userguide/plugins.html#sec:plugin_version_management)를 참조하세요.

다음은 Multiplatform 프로젝트의 예입니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    java
    kotlin("multiplatform") version "KOTLIN-EAP-VERSION"
}

repositories {
    mavenCentral()
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'java'
    id 'org.jetbrains.kotlin.multiplatform' version 'KOTLIN-EAP-VERSION'
}

repositories {
    mavenCentral()
}
```

</TabItem>
</Tabs>

### 종속성의 버전 조정

프로젝트에서 kotlinx 라이브러리를 사용하는 경우 라이브러리 버전이 Kotlin EAP 버전과 호환되지 않을 수 있습니다.

이 문제를 해결하려면 종속성에서 호환되는 라이브러리 버전을 지정해야 합니다. 호환되는 라이브러리 목록은 [EAP 빌드 세부 정보](eap#build-details)를 참조하세요.

:::note
대부분의 경우 특정 릴리스의 첫 번째 EAP 버전에 대해서만 라이브러리를 만들고 이러한 라이브러리는 이 릴리스의 후속 EAP 버전에서 작동합니다.

다음 EAP 버전에 호환되지 않는 변경 사항이 있는 경우 라이브러리의 새 버전을 릴리스합니다.

:::

다음은 그 예입니다.

**kotlinx.coroutines** 라이브러리의 경우 `2.1.20-RC3`과 호환되는 버전 번호 `1.10.1`을 추가합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1"
}
```

</TabItem>
</Tabs>

## Maven에서 구성

샘플 Maven 프로젝트 정의에서 `KOTLIN-EAP-VERSION`을 `2.1.20-RC3`과 같은 실제 버전으로 바꿉니다.
[사용 가능한 EAP 버전은 여기에 나와 있습니다](eap#build-details).

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

## 문제가 발생하는 경우

* [문제 추적기 YouTrack](https://kotl.in/issue)에 문제를 보고하세요.
* [Kotlin Slack의 #eap 채널](https://app.slack.com/client/T09229ZC6/C0KLZSCHF)에서 도움을 받으세요([초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).
* 최신 안정 버전으로 롤백합니다. [빌드 스크립트 파일에서 변경하세요](#adjust-the-kotlin-version).
  ```