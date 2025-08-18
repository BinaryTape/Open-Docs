[//]: # (title: Docker)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<web-summary>
KtorアプリケーションをDockerコンテナにデプロイし、ローカルまたは任意のクラウドプロバイダーで実行する方法を学びます。
</web-summary>

<link-summary>
アプリケーションをDockerコンテナにデプロイする方法を学びます。
</link-summary>

このセクションでは、[Ktor Gradle プラグイン](https://github.com/ktorio/ktor-build-plugins) を使って、[Docker](https://www.docker.com) を用いてアプリケーションをパッケージ化、実行、デプロイする方法を説明します。

## Ktorプラグインのインストール {id="install-plugin"}

Ktorプラグインをインストールするには、`build.gradle.(kts)`ファイルの`plugins`ブロックに追加します。

<Tabs group="languages">
<TabItem title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
plugins {
    id("io.ktor.plugin") version "%ktor_version%"
}
```

{interpolate-variables="true"}

</TabItem>
<TabItem title="Gradle (Groovy)" group-key="groovy">

```groovy
plugins {
    id "io.ktor.plugin" version "%ktor_version%"
}
```

{interpolate-variables="true"}

</TabItem>
</Tabs>

> Kotlin Multiplatform Gradle プラグインと Ktor Gradle プラグインを一緒に適用すると、Docker の統合は自動的に無効になります。
> それらを一緒に使用するには:
> 1. 上記のように Ktor Gradle プラグインを適用した JVM 専用プロジェクトを作成します。
> 2. その JVM 専用プロジェクトに Kotlin Multiplatform プロジェクトを依存関係として追加します。
>
> この回避策で問題が解決しない場合は、[KTOR-8464](https://youtrack.jetbrains.com/issue/KTOR-8464) にコメントを残してご連絡ください。
>
{style="warning"}

## プラグインタスク {id="tasks"}

プラグインを[インストール](#install-plugin)すると、アプリケーションのパッケージ化、実行、デプロイに以下のタスクが利用可能になります。

- `buildImage`: プロジェクトのDockerイメージをtarballとしてビルドします。このタスクは`build`ディレクトリに`jib-image.tar`ファイルを生成します。このイメージは、[docker load](https://docs.docker.com/engine/reference/commandline/load/)コマンドを使用してDockerデーモンにロードできます。
   ```Bash
   docker load < build/jib-image.tar
   ```
- `publishImageToLocalRegistry`: プロジェクトのDockerイメージをビルドし、ローカルレジストリに公開します。
- `runDocker`: プロジェクトのイメージをDockerデーモンにビルドし、実行します。このタスクを実行するとKtorサーバーが起動し、デフォルトで`http://0.0.0.0:8080`に応答します。サーバーが別のポートを使用するように構成されている場合は、[ポートマッピング](#port-mapping)を調整できます。
- `publishImage`: プロジェクトのDockerイメージを[Docker Hub](https://hub.docker.com/)や[Google Container Registry](https://cloud.google.com/container-registry)などの外部レジストリにビルドして公開します。このタスクでは、**[ktor.docker.externalRegistry](#external-registry)** プロパティを使用して外部レジストリを構成する必要があることに注意してください。

デフォルトでは、これらのタスクは`ktor-docker-image`という名前と`latest`タグでイメージをビルドします。これらの値は[プラグイン構成](#name-tag)でカスタマイズできます。

## Ktorプラグインの構成 {id="configure-plugin"}

Dockerタスクに関連するKtorプラグインの設定を構成するには、`build.gradle.(kts)`ファイルで`ktor.docker`拡張機能を使用します。

```kotlin
ktor {
    docker {
        // ...
    }
}
```

### JREバージョン {id="jre-version"}

`jreVersion`プロパティは、イメージで使用するJREのバージョンを指定します。

```kotlin
ktor {
    docker {
        jreVersion.set(JavaVersion.VERSION_17)
    }
}
```

### イメージ名とタグ {id="name-tag"}

イメージ名とタグをカスタマイズする必要がある場合は、それぞれ`localImageName`および`imageTag`プロパティを使用します。

```kotlin
ktor {
    docker {
        localImageName.set("sample-docker-image")
        imageTag.set("0.0.1-preview")
    }
}
```

### ポートマッピング {id="port-mapping"}

デフォルトでは、[runDocker](#tasks)タスクは`8080`コンテナポートを`8080`Dockerホストポートに公開します。
必要に応じて、`portMappings`プロパティを使用してこれらのポートを変更できます。
これは、サーバーが別のポートを使用するように[構成されている](server-configuration-file.topic#predefined-properties)場合に役立つことがあります。

以下の例は、`8080`コンテナポートを`80`Dockerホストポートにマッピングする方法を示しています。

```kotlin
ktor {
    docker {
        portMappings.set(listOf(
            io.ktor.plugin.features.DockerPortMapping(
                80,
                8080,
                io.ktor.plugin.features.DockerPortMappingProtocol.TCP
            )
        ))
    }
}
```

この場合、`http://0.0.0.0:80`でサーバーにアクセスできます。

### 外部レジストリ {id="external-registry"}

**[publishImage](#tasks)**タスクを使用してプロジェクトのDockerイメージを外部レジストリに公開する前に、`ktor.docker.externalRegistry`プロパティを使用して外部レジストリを構成する必要があります。このプロパティは、必要なレジストリタイプの構成を提供する`DockerImageRegistry`インスタンスを受け入れます。

- `DockerImageRegistry.dockerHub`: [Docker Hub](https://hub.docker.com/)用の`DockerImageRegistry`を作成します。
- `DockerImageRegistry.googleContainerRegistry`: [Google Container Registry](https://cloud.google.com/container-registry)用の`DockerImageRegistry`を作成します。

以下の例は、Docker Hubレジストリを構成する方法を示しています。

```kotlin
ktor {
    docker {
        externalRegistry.set(
            io.ktor.plugin.features.DockerImageRegistry.dockerHub(
                appName = provider { "ktor-app" },
                username = providers.environmentVariable("DOCKER_HUB_USERNAME"),
                password = providers.environmentVariable("DOCKER_HUB_PASSWORD")
            )
        )
    }
}
```

Docker Hubのユーザー名とパスワードは環境変数から取得されるため、`publishImage`タスクを実行する前にこれらの値を設定する必要があります。

<Tabs group="os">
<TabItem title="Linux/macOS" group-key="unix">

```Bash
export DOCKER_HUB_USERNAME=yourHubUsername
export DOCKER_HUB_PASSWORD=yourHubPassword
```

</TabItem>
<TabItem title="Windows" group-key="windows">

```Bash
setx DOCKER_HUB_USERNAME yourHubUsername
setx DOCKER_HUB_PASSWORD yourHubPassword
```

</TabItem>
</Tabs>

## 手動イメージ構成 {id="manual"}

必要に応じて、独自の`Dockerfile`を提供してKtorアプリケーションを含むイメージを組み立てることができます。

### アプリケーションのパッケージ化 {id="packagea-pp"}

最初のステップとして、アプリケーションをその依存関係と共にパッケージ化する必要があります。
例えば、これは[fat JAR](server-fatjar.md)または[実行可能なJVMアプリケーション](server-packaging.md)である場合があります。

### Dockerイメージの準備 {id="prepare-docker"}

アプリケーションをDocker化するには、[マルチステージビルド](https://docs.docker.com/develop/develop-images/multistage-build/)を使用します。

1. まず、Gradle/Mavenの依存関係のキャッシュを設定します。このステップは任意ですが、ビルド全体の速度が向上するため推奨されます。
2. 次に、`gradle`/`maven`イメージを使用して、アプリケーションを含むfat JARを生成します。
3. 最後に、生成されたディストリビューションは、JDKイメージに基づいて作成された環境で実行されます。

プロジェクトのルートフォルダーに、`Dockerfile`という名前のファイルを作成し、以下の内容を記述します。

<Tabs group="languages">
<TabItem title="Gradle" group-key="kotlin">

<code-block lang="Docker" code="# Stage 1: Cache Gradle dependencies&#10;FROM gradle:latest AS cache&#10;RUN mkdir -p /home/gradle/cache_home&#10;ENV GRADLE_USER_HOME=/home/gradle/cache_home&#10;COPY build.gradle.* gradle.properties /home/gradle/app/&#10;COPY gradle /home/gradle/app/gradle&#10;WORKDIR /home/gradle/app&#10;RUN gradle clean build -i --stacktrace&#10;&#10;# Stage 2: Build Application&#10;FROM gradle:latest AS build&#10;COPY --from=cache /home/gradle/cache_home /home/gradle/.gradle&#10;COPY --chown=gradle:gradle . /home/gradle/src&#10;WORKDIR /home/gradle/src&#10;# Build the fat JAR, Gradle also supports shadow&#10;# and boot JAR by default.&#10;RUN gradle buildFatJar --no-daemon&#10;&#10;# Stage 3: Create the Runtime Image&#10;FROM amazoncorretto:22 AS runtime&#10;EXPOSE 8080&#10;RUN mkdir /app&#10;COPY --from=build /home/gradle/src/build/libs/*.jar /app/ktor-docker-sample.jar&#10;ENTRYPOINT [&quot;java&quot;,&quot;-jar&quot;,&quot;/app/ktor-docker-sample.jar&quot;]"/>

</TabItem>
<TabItem title="Maven" group-key="maven">

```Docker
# Stage 1: Cache Maven dependencies
FROM maven:3.8-amazoncorretto-21 AS cache
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

# Stage 2: Build Application
FROM maven:3.8-amazoncorretto-21 AS build
WORKDIR /app
COPY --from=cache /root/.m2 /root/.m2
COPY . .
RUN mvn clean package

# Stage 3: Create the Runtime Image
FROM amazoncorretto:21-slim AS runtime
EXPOSE 8080
WORKDIR /app
COPY --from=build /app/target/*-with-dependencies.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

</TabItem>
</Tabs>

最初のステージは、ビルド関連のファイルに変更があった場合にのみ依存関係が再ダウンロードされるようにします。最初のステージを使用しない場合、または他のステージで依存関係がキャッシュされない場合、依存関係はすべてのビルドでインストールされます。

2番目のステージではfat JARがビルドされます。Gradleはデフォルトでshadow JARとboot JARもサポートしていることに注意してください。

ビルドの3番目のステージは次のように機能します。

* 使用するイメージを示します。
* 公開するポートを指定します（これは、コンテナの実行時に行われるポートの自動公開ではありません）。
* ビルド出力からフォルダにコンテンツをコピーします。
* アプリケーションを実行します（`ENTRYPOINT`）。

<tip id="jdk_image_replacement_tip">
  <p>
   この例ではAmazon Corretto Docker Imageを使用していますが、以下のようないくつかの適切な代替イメージと置き換えることができます。
  </p>
  <list>
    <li><a href="https://hub.docker.com/_/eclipse-temurin">Eclipse Temurin</a></li>
    <li><a href="https://hub.docker.com/_/ibm-semeru-runtimes">IBM Semeru</a></li>
    <li><a href="https://hub.docker.com/_/ibmjava">IBM Java</a></li>
    <li><a href="https://hub.docker.com/_/sapmachine">SAP Machine JDK</a></li>
  </list>
</tip>

### Dockerイメージのビルドと実行 {id="build-run"}

次のステップは、Dockerイメージをビルドしてタグ付けすることです。

```bash
docker build -t my-application .
```

最後に、イメージを起動します。

```bash
docker run -p 8080:8080 my-application
```

これにより、Ktorサーバーが起動し、`https://0.0.0.0:8080`に応答します。