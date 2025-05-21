---
title: "为 EAP 配置你的构建"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   当前没有可用的预览版本
</p>
    <!-- <p>Latest Kotlin EAP release: <strong>2.1.20-RC3</strong></p> -->
<p>
   <a href="eap#build-details">查看 Kotlin EAP 版本的详细信息</a>
</p>

:::

要配置你的构建以使用 Kotlin 的 EAP 版本，你需要：

* 指定 Kotlin 的 EAP 版本。[可用的 EAP 版本在此处列出](eap#build-details)。
* 将依赖项的版本更改为 EAP 版本。
Kotlin 的 EAP 版本可能无法与先前发布的版本的库一起使用。

以下步骤描述了如何在 Gradle 和 Maven 中配置你的构建：

* [在 Gradle 中配置](#configure-in-gradle)
* [在 Maven 中配置](#configure-in-maven)

## 在 Gradle 中配置

本节介绍如何：

* [调整 Kotlin 版本](#adjust-the-kotlin-version)
* [调整依赖项中的版本](#adjust-versions-in-dependencies)

### 调整 Kotlin 版本

在 `build.gradle(.kts)` 中的 `plugins` 块中，将 `KOTLIN-EAP-VERSION` 更改为实际的 EAP 版本，例如 `2.1.20-RC3`。[可用的 EAP 版本在此处列出](eap#build-details)。

或者，你可以在 `settings.gradle(.kts)` 中的 `pluginManagement` 块中指定 EAP 版本 - 有关详细信息，请参阅 [Gradle 文档](https://docs.gradle.org/current/userguide/plugins.html#sec:plugin_version_management)。

这是一个 Multiplatform 项目的示例。

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

### 调整依赖项中的版本

如果在你的项目中使用 kotlinx 库，则你的库版本可能与 Kotlin 的 EAP 版本不兼容。

要解决此问题，你需要在依赖项中指定兼容库的版本。 有关兼容库的列表，请参阅 [EAP 构建详细信息](eap#build-details)。

:::note
在大多数情况下，我们仅为特定版本的第一个 EAP 版本创建库，并且这些库适用于此版本的后续 EAP 版本。

如果下一个 EAP 版本中存在不兼容的更改，我们将发布该库的新版本。

:::

这是一个例子。

对于 **kotlinx.coroutines** 库，添加与 `2.1.20-RC3` 兼容的版本号 – `1.10.1`。

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

## 在 Maven 中配置

在示例 Maven 项目定义中，将 `KOTLIN-EAP-VERSION` 替换为实际版本，例如 `2.1.20-RC3`。[可用的 EAP 版本在此处列出](eap#build-details)。

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

* 向 [我们的 issue 跟踪器 YouTrack](https://kotl.in/issue) 报告问题。
* 在 [Kotlin Slack 中的 #eap 频道](https://app.slack.com/client/T09229ZC6/C0KLZSCHF) 中寻求帮助 ([获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up))。
* 回滚到最新的稳定版本：[在你的构建脚本文件中更改它](#adjust-the-kotlin-version)。
  ```