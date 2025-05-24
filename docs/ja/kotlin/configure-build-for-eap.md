---
title: "EAP 用のビルドを設定する"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   現在、プレビューバージョンは利用できません
</p>
    <!-- <p>Latest Kotlin EAP release: <strong>2.1.20-RC3</strong></p> -->
<p>
   <a href="eap#build-details">Kotlin EAP リリースの詳細を見る</a>
</p>

:::

KotlinのEAPバージョンを使用するようにビルドを構成するには、次の手順が必要です。

* KotlinのEAPバージョンを指定します。[利用可能なEAPバージョンはこちらに記載されています](eap#build-details)。
* 依存関係のバージョンをEAPのものに変更します。
KotlinのEAPバージョンは、以前にリリースされたバージョンのライブラリでは動作しない場合があります。

次の手順では、GradleとMavenでビルドを構成する方法について説明します。

* [Gradleでの構成](#configure-in-gradle)
* [Mavenでの構成](#configure-in-maven)

## Gradleでの構成

このセクションでは、次の方法について説明します。

* [Kotlinのバージョンを調整する](#adjust-the-kotlin-version)
* [依存関係のバージョンを調整する](#adjust-versions-in-dependencies)

### Kotlinのバージョンを調整する

`build.gradle(.kts)` 内の `plugins` ブロックで、`KOTLIN-EAP-VERSION` を実際のEAPバージョン（`2.1.20-RC3` など）に変更します。[利用可能なEAPバージョンはこちらに記載されています](eap#build-details)。

または、`settings.gradle(.kts)` の `pluginManagement` ブロックでEAPバージョンを指定することもできます。詳細については、[Gradleのドキュメント](https://docs.gradle.org/current/userguide/plugins.html#sec:plugin_version_management)を参照してください。

以下は、Multiplatformプロジェクトの例です。

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

### 依存関係のバージョンを調整する

プロジェクトで kotlinx ライブラリを使用している場合、ライブラリのバージョンはKotlinのEAPバージョンと互換性がない可能性があります。

この問題を解決するには、互換性のあるライブラリのバージョンを依存関係に指定する必要があります。互換性のあるライブラリのリストについては、[EAPビルドの詳細](eap#build-details)を参照してください。

:::note
ほとんどの場合、特定のリリースにおける最初のEAPバージョンに対してのみライブラリを作成し、これらのライブラリは、このリリースに対する後続のEAPバージョンで動作します。

次のEAPバージョンに互換性のない変更がある場合は、ライブラリの新しいバージョンをリリースします。

:::

以下に例を示します。

**kotlinx.coroutines** ライブラリの場合、`2.1.20-RC3` と互換性のあるバージョン番号 `1.10.1` を追加します。

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

## Mavenでの構成

サンプルのMavenプロジェクト定義で、`KOTLIN-EAP-VERSION` を実際のバージョン（`2.1.20-RC3` など）に置き換えます。[利用可能なEAPバージョンはこちらに記載されています](eap#build-details)。

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

## 問題が発生した場合

* [課題追跡システムであるYouTrack](https://kotl.in/issue)に問題を報告してください。
* [Kotlin Slackの#eapチャネル](https://app.slack.com/client/T09229ZC6/C0KLZSCHF)でヘルプを見つけてください（[招待状を入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。
* 最新の安定バージョンにロールバックしてください：[ビルドスクリプトファイルで変更します](#adjust-the-kotlin-version)。
  ```