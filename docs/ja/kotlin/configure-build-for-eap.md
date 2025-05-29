[//]: # (title: EAP版のビルドを構成する)

<tldr>
    <!-- <p>No preview versions are currently available</p> -->
    <p>最新のKotlin EAPリリース: <strong>%kotlinEapVersion%</strong></p>
    <p><a href="eap.md#build-details">Kotlin EAPリリースの詳細を見る</a></p>
</tldr>

EAP版のKotlinを使用するようにビルドを構成するには、次の手順を実行します。

* KotlinのEAPバージョンを指定します。[利用可能なEAPバージョンはこちらに記載されています](eap.md#build-details)。
* 依存関係のバージョンをEAP版に変更します。
KotlinのEAPバージョンは、以前にリリースされたバージョンのライブラリと互換性がない場合があります。

以下の手順では、GradleとMavenでビルドを構成する方法について説明します。

* [Gradleで構成する](#configure-in-gradle)
* [Mavenで構成する](#configure-in-maven)

## Gradleで構成する

このセクションでは、次の方法について説明します。

* [Kotlinバージョンを調整する](#adjust-the-kotlin-version)
* [依存関係のバージョンを調整する](#adjust-versions-in-dependencies)

### Kotlinバージョンを調整する

`build.gradle(.kts)` 内の `plugins` ブロックで、`KOTLIN-EAP-VERSION` を `%kotlinEapVersion%` のような実際のEAPバージョンに変更します。[利用可能なEAPバージョンはこちらに記載されています](eap.md#build-details)。

または、`settings.gradle(.kts)` の `pluginManagement` ブロックでEAPバージョンを指定することもできます。詳細については、[Gradleドキュメント](https://docs.gradle.org/current/userguide/plugins.html#sec:plugin_version_management)を参照してください。

以下に、マルチプラットフォームプロジェクトの例を示します。

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

### 依存関係のバージョンを調整する

プロジェクトでkotlinxライブラリを使用している場合、それらのライブラリのバージョンがKotlinのEAPバージョンと互換性がない場合があります。

この問題を解決するには、互換性のあるライブラリのバージョンを依存関係で指定する必要があります。互換性のあるライブラリのリストについては、[EAPビルドの詳細](eap.md#build-details)を参照してください。

> ほとんどの場合、特定のリリースの最初のEAPバージョンに対してのみライブラリを作成し、それらのライブラリはそのリリースの以降のEAPバージョンでも動作します。
>
> 次のEAPバージョンで互換性のない変更がある場合は、ライブラリの新しいバージョンをリリースします。
>
{style="note"}

以下に例を示します。

**kotlinx.coroutines**ライブラリの場合、`%kotlinEapVersion%` と互換性のあるバージョン番号 `%coroutinesEapVersion%` を追加します。

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

## Mavenで構成する

Mavenプロジェクトのサンプル定義で、`KOTLIN-EAP-VERSION` を `%kotlinEapVersion%` のような実際のバージョンに置き換えます。[利用可能なEAPバージョンはこちらに記載されています](eap.md#build-details)。

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

* [弊社の課題トラッカー YouTrack](https://kotl.in/issue)に問題を報告してください。
* Kotlin Slackの [#eap チャネル](https://app.slack.com/client/T09229ZC6/C0KLZSCHF)でヘルプを見つけてください（[招待を受ける](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。
* 最新の安定版にロールバックする: [ビルドスクリプトファイルを変更する](#adjust-the-kotlin-version)。