[//]: # (title: 為 EAP 配置您的建置)

<tldr>
    <!--  
    <p>No preview versions are currently available.</p>
    -->
    <p>最新 Kotlin EAP 版本：<strong>%kotlinEapVersion%</strong></p>
    <p><a href="eap.md#build-details">探索 Kotlin EAP 版本詳細資訊</a></p>
</tldr>

若要配置您的建置以使用 Kotlin 的 EAP 版本，您需要： 

* 指定 Kotlin 的 EAP 版本。 [可用的 EAP 版本已列於此處](eap.md#build-details)。
* 將依賴項 (dependencies) 的版本變更為 EAP 版本。
Kotlin 的 EAP 版本可能無法與先前發布版本的函式庫 (libraries) 搭配使用。 

以下步驟說明如何在 Gradle 和 Maven 中配置您的建置：

* [在 Gradle 中配置](#configure-in-gradle)
* [在 Maven 中配置](#configure-in-maven)

## 在 Gradle 中配置 

本節說明如何：

* [調整 Kotlin 版本](#adjust-the-kotlin-version)
* [調整依賴項中的版本](#adjust-versions-in-dependencies)

### 調整 Kotlin 版本

在 `build.gradle(.kts)` 中的 `plugins` 區塊中，將 `KOTLIN-EAP-VERSION` 變更為實際的 EAP 版本，例如 `%kotlinEapVersion%`。 [可用的 EAP 版本已列於此處](eap.md#build-details)。

或者，您可以在 `settings.gradle(.kts)` 中的 `pluginManagement` 區塊中指定 EAP 版本 – 請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/plugins.html#sec:plugin_version_management) 以了解詳細資訊。

這是 Multiplatform 專案的一個範例。

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

### 調整依賴項中的版本

如果您在專案中使用 kotlinx 函式庫，您的函式庫版本可能與 Kotlin 的 EAP 版本不相容。

為了解決此問題，您需要在依賴項中指定相容函式庫的版本。有關相容函式庫的列表，請參閱 [EAP 建置詳細資訊](eap.md#build-details)。 

> 在大多數情況下，我們只為特定發布版的第一個 EAP 版本建立函式庫，這些函式庫也適用於此發布版的後續 EAP 版本。
> 
> 如果下一個 EAP 版本中有不相容的變更，我們將發布新版本的函式庫。
>
{style="note"}

這是一個範例。

對於 **kotlinx.coroutines** 函式庫，請新增與 `%kotlinEapVersion%` 相容的版本號碼 – `%coroutinesEapVersion%`。 

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

在範例 Maven 專案定義中，將 `KOTLIN-EAP-VERSION` 替換為實際版本，例如 `%kotlinEapVersion%`。 [可用的 EAP 版本已列於此處](eap.md#build-details)。

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

* 向 [我們的問題追蹤器 YouTrack](https://kotl.in/issue) 報告問題。
* 在 Kotlin Slack 中的 [#eap 頻道](https://app.slack.com/client/T09229ZC6/C0KLZSCHF) 中尋求幫助 ([獲取邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up))。
* 回溯到最新的穩定版本：[在您的建置指令碼檔案中進行變更](#adjust-the-kotlin-version)。