---
title: "針對 EAP 配置您的建置"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   目前沒有可用的預覽版本
</p>
    <!-- <p>Latest Kotlin EAP release: <strong>2.1.20-RC3</strong></p> -->
<p>
   <a href="eap#build-details">瀏覽 Kotlin EAP 版本詳細資訊</a>
</p>

:::

要配置您的建置以使用 Kotlin 的 EAP 版本，您需要：

* 指定 Kotlin 的 EAP 版本。[可用的 EAP 版本在此處列出](eap#build-details)。
* 將相依項的版本變更為 EAP 版本。
Kotlin 的 EAP 版本可能無法與先前發佈版本的函式庫一起使用。

以下程序描述如何在 Gradle 和 Maven 中配置您的建置：

* [在 Gradle 中配置](#configure-in-gradle)
* [在 Maven 中配置](#configure-in-maven)

## 在 Gradle 中配置

本節描述如何：

* [調整 Kotlin 版本](#adjust-the-kotlin-version)
* [調整相依項中的版本](#adjust-versions-in-dependencies)

### 調整 Kotlin 版本

在 `build.gradle(.kts)` 內的 `plugins` 區塊中，將 `KOTLIN-EAP-VERSION` 變更為實際的 EAP 版本，例如 `2.1.20-RC3`。[可用的 EAP 版本在此處列出](eap#build-details)。

或者，您可以在 `settings.gradle(.kts)` 中的 `pluginManagement` 區塊中指定 EAP 版本 – 有關詳細資訊，請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/plugins.html#sec:plugin_version_management)。

這是 Multiplatform 專案的範例。

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

### 調整相依項中的版本

如果您在專案中使用 kotlinx 函式庫，則函式庫的版本可能與 Kotlin 的 EAP 版本不相容。

要解決此問題，您需要在相依項中指定相容函式庫的版本。 有關相容函式庫的列表，請參閱 [EAP 建置詳細資訊](eap#build-details)。

:::note
在大多數情況下，我們僅針對特定版本的首個 EAP 版本建立函式庫，並且這些函式庫適用於此版本的後續 EAP 版本。

如果下一個 EAP 版本中存在不相容的變更，我們將發布新版本的函式庫。

:::

這是一個範例。

對於 **kotlinx.coroutines** 函式庫，添加與 `2.1.20-RC3` 相容的版本號碼 – `1.10.1`。

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

在範例 Maven 專案定義中，將 `KOTLIN-EAP-VERSION` 替換為實際版本，例如 `2.1.20-RC3`。[可用的 EAP 版本在此處列出](eap#build-details)。

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

## 如果您遇到任何問題

* 向 [我們的 issue 追蹤器 YouTrack](https://kotl.in/issue) 回報 issue。
* 在 [Kotlin Slack 中的 #eap 頻道](https://app.slack.com/client/T09229ZC6/C0KLZSCHF) 中尋求協助 ([取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up))。
* 回滾到最新的穩定版本：[在您的建置腳本檔案中變更它](#adjust-the-kotlin-version)。
  ```