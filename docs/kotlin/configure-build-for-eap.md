`[//]: # (title: 配置你的构建以使用 EAP)`

<tldr>
    <!-- <p>No preview versions are currently available</p> -->
    <p>最新的 Kotlin EAP 版本：<strong>%kotlinEapVersion%</strong></p>
    <p><a href="eap.md#build-details">探索 Kotlin EAP 版本详情</a></p>
</tldr>

要配置你的构建以使用 Kotlin 的 EAP 版本，你需要：

* 指定 Kotlin 的 EAP 版本。[此处列出了可用的 EAP 版本](eap.md#build-details)。
* 将依赖的版本更改为 EAP 版本。
Kotlin 的 EAP 版本可能无法与先前发布的库版本兼容。

以下步骤描述了如何在 Gradle 和 Maven 中配置你的构建：

* [在 Gradle 中配置](#configure-in-gradle)
* [在 Maven 中配置](#configure-in-maven)

## 在 Gradle 中配置

本节描述了如何：

* [调整 Kotlin 版本](#adjust-the-kotlin-version)
* [调整依赖中的版本](#adjust-versions-in-dependencies)

### 调整 Kotlin 版本

在 `build.gradle(.kts)` 文件中的 `plugins` 块中，将 `KOTLIN-EAP-VERSION` 更改为实际的 EAP 版本，
例如 `%kotlinEapVersion%`。[此处列出了可用的 EAP 版本](eap.md#build-details)。

或者，你可以在 `settings.gradle(.kts)` 文件中的 `pluginManagement` 块中指定 EAP 版本——有关详细信息，请参阅 [Gradle 文档](https://docs.gradle.org/current/userguide/plugins.html#sec:plugin_version_management)。

以下是一个多平台项目的示例。

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

### 调整依赖中的版本

如果在你的项目中使用了 `kotlinx` 库，这些库的版本可能与 Kotlin 的 EAP 版本不兼容。

要解决此问题，你需要在依赖中指定一个兼容库的版本。有关兼容库的列表，
请参阅 [EAP 构建详情](eap.md#build-details)。

> 大多数情况下，我们只为特定发布的第一个 EAP 版本创建库，并且这些库适用于该发布的后续 EAP 版本。
>
> 如果后续 EAP 版本中存在不兼容的更改，我们将发布新版本的库。
>
{style="note"}

以下是一个示例。

对于 **kotlinx.coroutines** 库，请添加与 `%kotlinEapVersion%` 兼容的版本号——`%coroutinesEapVersion%`。

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

## 在 Maven 中配置

在示例 Maven 项目定义中，将 `KOTLIN-EAP-VERSION` 替换为实际版本，例如 `%kotlinEapVersion%`。
[此处列出了可用的 EAP 版本](eap.md#build-details)。

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

## 如果你遇到任何问题

* 向 [我们的问题跟踪器 YouTrack](https://kotl.in/issue) 报告问题。
* 在 [Kotlin Slack 的 #eap 频道](https://app.slack.com/client/T09229ZC6/C0KLZSCHF) 中寻求帮助（[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。
* 回滚到最新的稳定版本：[在你的构建脚本文件中更改](#adjust-the-kotlin-version)。