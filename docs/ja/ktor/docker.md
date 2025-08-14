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
KtorアプリケーションをDockerコンテナにデプロイする方法を学びましょう。デプロイされたコンテナは、ローカルまたは選択したクラウドプロバイダーで実行できます。
</web-summary>

<link-summary>
アプリケーションをDockerコンテナにデプロイする方法を学びます。
</link-summary>

このセクションでは、[Docker](https://www.docker.com) を使用してアプリケーションをパッケージング、実行、デプロイするための [Ktor Gradleプラグイン](https://github.com/ktorio/ktor-build-plugins) の使い方を説明します。

## Ktorプラグインのインストール {id="install-plugin"}

Ktorプラグインをインストールするには、`build.gradle.(kts)` ファイルの `plugins` ブロックに以下を追加します。

<tabs group="languages">
<tab title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
plugins {
    id("io.ktor.plugin") version "%ktor_version%"
}
```

{interpolate-variables="true"}

</tab>
<tab title="Gradle (Groovy)" group-key="groovy">

```groovy
plugins {
    id "io.ktor.plugin" version "%ktor_version%"
}
```

{interpolate-variables="true"}

</tab>
</tabs>

> Ktor GradleプラグインをKotlin Multiplatform Gradleプラグインと同時に適用すると、Docker連携が自動的に無効になります。
> それらを一緒に使用できるようにするには：
> 1. 上記のようにKtor Gradleプラグインを適用したJVM専用プロジェクトを作成します。
> 2. そのJVM専用プロジェクトにKotlin Multiplatformプロジェクトを依存関係として追加します。
>
> この回避策で問題が解決しない場合は、[KTOR-8464](https://youtrack.jetbrains.com/issue/KTOR-8464) にコメントを残してご連絡ください。
>
{style="warning"}

## プラグインタスク {id="tasks"}

プラグインを[インストール](#install-plugin)すると、アプリケーションのパッケージング、実行、デプロイに以下のタスクが利用可能になります。

- `buildImage`: プロジェクトのDockerイメージをtarボールにビルドします。このタスクは `build` ディレクトリに `jib-image.tar` ファイルを生成します。このイメージは、[docker load](https://docs.docker.com/engine/reference/commandline/load/) コマンドを使用してDockerデーモンにロードできます。
   ```Bash
   docker load < build/jib-image.tar
   ```
- `publishImageToLocalRegistry`: プロジェクトのDockerイメージをビルドし、ローカルレジストリに公開します。
- `runDocker`: プロジェクトのイメージをDockerデーモンにビルドして実行します。このタスクを実行するとKtorサーバーが起動し、デフォルトで `http://0.0.0.0:8080` で応答します。サーバーが別のポートを使用するように設定されている場合は、[ポートマッピング](#port-mapping)を調整できます。
- `publishImage`: プロジェクトのDockerイメージを[Docker Hub](https://hub.docker.com/) や [Google Container Registry](https://cloud.google.com/container-registry) などの外部レジストリにビルドして公開します。このタスクを使用するには、**[ktor.docker.externalRegistry](#external-registry)** プロパティを使用して外部レジストリを設定する必要があることに注意してください。

デフォルトでは、これらのタスクは `ktor-docker-image` という名前と `latest` タグでイメージをビルドすることに注意してください。
これらの値は、[プラグイン設定](#name-tag)でカスタマイズできます。

## Ktorプラグインの設定 {id="configure-plugin"}

Dockerタスクに関連するKtorプラグインの設定を行うには、`build.gradle.(kts)` ファイルで `ktor.docker` 拡張を使用します。

```kotlin
ktor {
    docker {
        // ...
    }
}
```

### JREバージョン {id="jre-version"}

`jreVersion` プロパティは、イメージで使用するJREバージョンを指定します。

[object Promise]

### イメージ名とタグ {id="name-tag"}

イメージ名とタグをカスタマイズする必要がある場合は、それぞれ `localImageName` プロパティと `imageTag` プロパティを使用します。

[object Promise]

### ポートマッピング {id="port-mapping"}

デフォルトでは、[runDocker](#tasks) タスクは `8080` コンテナポートを `8080` Dockerホストポートに公開します。
必要に応じて、`portMappings` プロパティを使用してこれらのポートを変更できます。
これは、サーバーが別のポートを使用するように[設定](server-configuration-file.topic#predefined-properties)されている場合に役立つことがあります。

以下の例は、`8080` コンテナポートを `80` Dockerホストポートにマッピングする方法を示しています。

[object Promise]

この場合、`http://0.0.0.0:80` でサーバーにアクセスできます。

### 外部レジストリ {id="external-registry"}

**[publishImage](#tasks)** タスクを使用してプロジェクトのDockerイメージを外部レジストリに公開する前に、`ktor.docker.externalRegistry` プロパティを使用して外部レジストリを設定する必要があります。このプロパティは、必要なレジストリタイプの設定を提供する `DockerImageRegistry` インスタンスを受け入れます。

- `DockerImageRegistry.dockerHub`: [Docker Hub](https://hub.docker.com/) 用の `DockerImageRegistry` を作成します。
- `DockerImageRegistry.googleContainerRegistry`: [Google Container Registry](https://cloud.google.com/container-registry) 用の `DockerImageRegistry` を作成します。

以下の例は、Docker Hubレジストリを設定する方法を示しています。

[object Promise]

Docker Hubのユーザー名とパスワードは環境変数から取得されるため、`publishImage` タスクを実行する前にこれらの値を設定する必要があります。

<tabs group="os">
<tab title="Linux/macOS" group-key="unix">

```Bash
export DOCKER_HUB_USERNAME=yourHubUsername
export DOCKER_HUB_PASSWORD=yourHubPassword
```

</tab>
<tab title="Windows" group-key="windows">

```Bash
setx DOCKER_HUB_USERNAME yourHubUsername
setx DOCKER_HUB_PASSWORD yourHubPassword
```

</tab>
</tabs>

## 手動でのイメージ設定 {id="manual"}

必要に応じて、Ktorアプリケーションでイメージを組み立てるために独自の `Dockerfile` を提供できます。

### アプリケーションのパッケージング {id="packagea-pp"}

最初のステップとして、アプリケーションをその依存関係とともにパッケージングする必要があります。
例えば、これは [fat JAR](server-fatjar.md) または [実行可能なJVMアプリケーション](server-packaging.md) かもしれません。

### Dockerイメージの準備 {id="prepare-docker"}

アプリケーションをDocker化するには、[マルチステージビルド](https://docs.docker.com/develop/develop-images/multistage-build/) を使用します。

1. まず、Gradle/Mavenの依存関係のキャッシュを設定します。このステップはオプションですが、全体のビルド速度を向上させるため推奨されます。
2. 次に、`gradle`/`maven` イメージを使用して、アプリケーションを含むfat JARを生成します。
3. 最後に、生成されたディストリビューションは、JDKイメージに基づいて作成された環境で実行されます。

プロジェクトのルートフォルダに、以下の内容で `Dockerfile` という名前のファイルを作成します。

<tabs group="languages">
<tab title="Gradle" group-key="kotlin">

[object Promise]

</tab>
<tab title="Maven" group-key="maven">

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

</tab>
</tabs>

最初のステージは、ビルド関連のファイルに変更があった場合にのみ、依存関係が再ダウンロードされるようにします。最初のステージを使用しない場合、または依存関係が他のステージでキャッシュされない場合、依存関係はすべてのビルドでインストールされます。

第二ステージでは、fat JARがビルドされます。Gradleもデフォルトでshadow JARとboot JARをサポートしていることに注意してください。

ビルドの第三ステージは、以下の方法で動作します。

* 使用するイメージを示します。
* 公開するポートを指定します（これはコンテナ実行時に行われるため、自動的にポートを公開するものではありません）。
* ビルド出力からフォルダへコンテンツをコピーします。
* アプリケーションを実行します (`ENTRYPOINT`)。

<tip id="jdk_image_replacement_tip">
  <p>
   この例ではAmazon Corretto Dockerイメージを使用していますが、以下のようないくつかの適切な代替イメージと置き換えることができます。
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

これによりKtorサーバーが起動し、`https://0.0.0.0:8080` で応答します。