[//]: # (title: EAPビルドの構成)

<tldr>
    <!--  
    <p>No preview versions are currently currently available.</p>
    -->
    <p>最新のKotlin EAPリリース: <strong>%kotlinEapVersion%</strong></p>
    <p><a href="eap.md#build-details">Kotlin EAP リリースの詳細を確認する</a></p>
</tldr>

KotlinのEAPバージョンを使用するようにビルドを構成するには、以下を行う必要があります。

* KotlinのEAPバージョンを指定します。[利用可能なEAPバージョンはこちらに記載されています](eap.md#build-details)。
* 依存関係のバージョンをEAPバージョンに変更します。
KotlinのEAPバージョンは、以前にリリースされたバージョンのライブラリとは互換性がない場合があります。

以下の手順で、GradleおよびMavenでのビルド構成方法を説明します。

* [Gradleでの構成](#configure-in-gradle)
* [Mavenでの構成](#configure-in-maven)

## Gradleでの構成

このセクションでは、次の方法について説明します。

* [Kotlinのバージョンを調整する](#adjust-the-kotlin-version)
* [依存関係のバージョンを調整する](#adjust-versions-in-dependencies)

### Kotlinのバージョンを調整する

`build.gradle(.kts)`内の`plugins`ブロックで、`KOTLIN-EAP-VERSION`を実際のEAPバージョン（例: `%kotlinEapVersion%`）に変更します。[利用可能なEAPバージョンはこちらに記載されています](eap.md#build-details)。

あるいは、`settings.gradle(.kts)`の`pluginManagement`ブロックでEAPバージョンを指定することもできます。詳細は[Gradleドキュメント](https://docs.gradle.org/current/userguide/plugins.html#sec:plugin_version_management)を参照してください。

Multiplatformプロジェクトの例を次に示します。

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

プロジェクトでkotlinxライブラリを使用している場合、ライブラリのバージョンがKotlinのEAPバージョンと互換性がない場合があります。

この問題を解決するには、依存関係で互換性のあるライブラリのバージョンを指定する必要があります。互換性のあるライブラリのリストは、[EAPビルドの詳細](eap.md#build-details)を参照してください。

> ほとんどの場合、特定のリリース向けのライブラリは最初のEAPバージョンでのみ作成され、これらのライブラリはそのリリースの後続のEAPバージョンでも動作します。
> 
> 次のEAPバージョンで互換性のない変更がある場合は、新しいバージョンのライブラリをリリースします。
>
{style="note"}

例を次に示します。

`**kotlinx.coroutines**`ライブラリの場合、`%kotlinEapVersion%`と互換性のあるバージョン番号（`%coroutinesEapVersion%`）を追加します。

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

## Mavenでの構成

Mavenのサンプルプロジェクト定義で、`KOTLIN-EAP-VERSION`を実際のバージョン（例: `%kotlinEapVersion%`）に置き換えます。[利用可能なEAPバージョンはこちらに記載されています](eap.md#build-details)。

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

* [KotlinのIssueトラッカーであるYouTrack](https://kotl.in/issue)に問題を報告してください。
* Kotlin Slackの[#eapチャンネル](https://app.slack.com/client/T09229ZC6/C0KLZSCHF)でヘルプを見つけてください ([招待を受ける](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up))。
* 最新の安定版にロールバックする: [ビルドスクリプトファイルで変更します](#adjust-the-kotlin-version)。