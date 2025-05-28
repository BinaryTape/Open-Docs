[//]: # (title: Docker)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<web-summary>
KtorアプリケーションをDockerコンテナにデプロイし、ローカルまたはお好みのクラウドプロバイダーで実行する方法を学びます。
</web-summary>

<link-summary>
アプリケーションをDockerコンテナにデプロイする方法を学びます。
</link-summary>

このセクションでは、[Ktor Gradle plugin](https://github.com/ktorio/ktor-build-plugins) を使用して、[Docker](https://www.docker.com) を用いたアプリケーションのパッケージング、実行、デプロイを行う方法について説明します。

## Ktorプラグインのインストール {id="install-plugin"}

Ktorプラグインをインストールするには、`build.gradle.(kts)`ファイルの`plugins`ブロックに追加します。

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

## プラグインタスク {id="tasks"}

プラグインを[インストール](#install-plugin)すると、アプリケーションのパッケージング、実行、デプロイのために以下のタスクが利用可能になります。

- `buildImage`: プロジェクトのDockerイメージをtarボールとしてビルドします。このタスクは`build`ディレクトリに`jib-image.tar`ファイルを生成します。このイメージは、[docker load](https://docs.docker.com/engine/reference/commandline/load/)コマンドを使用してDockerデーモンにロードできます。
   ```Bash
   docker load < build/jib-image.tar
   ```
- `publishImageToLocalRegistry`: プロジェクトのDockerイメージをビルドし、ローカルレジストリに公開します。
- `runDocker`: プロジェクトのイメージをDockerデーモンにビルドして実行します。このタスクを実行するとKtorサーバーが起動し、デフォルトで`http://0.0.0.0:8080`に応答します。サーバーが別のポートを使用するように設定されている場合、[ポートマッピング](#port-mapping)を調整できます。
- `publishImage`: プロジェクトのDockerイメージを[Docker Hub](https://hub.docker.com/)や[Google Container Registry](https://cloud.google.com/container-registry)などの外部レジストリにビルドして公開します。このタスクには、**[ktor.docker.externalRegistry](#external-registry)**プロパティを使用して外部レジストリを設定する必要があることに注意してください。

デフォルトでは、これらのタスクはイメージを`ktor-docker-image`という名前と`latest`タグでビルドすることに注意してください。[プラグイン設定](#name-tag)でこれらの値をカスタマイズできます。

## Ktorプラグインの設定 {id="configure-plugin"}

Dockerタスクに関連するKtorプラグインの設定を構成するには、`build.gradle.(kts)`ファイルで`ktor.docker`拡張を使用します。

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
```

{src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28,33-34,52-53"}

### イメージ名とタグ {id="name-tag"}

イメージ名とタグをカスタマイズする必要がある場合は、それぞれ`localImageName`プロパティと`imageTag`プロパティを使用します。

```kotlin
```

{src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28,33,35-36,52-53"}

### ポートマッピング {id="port-mapping"}

デフォルトでは、[runDocker](#tasks)タスクは`8080`コンテナポートを`8080`Dockerホストポートに公開します。必要に応じて、`portMappings`プロパティを使用してこれらのポートを変更できます。これは、サーバーが別のポートを使用するように[設定](server-configuration-file.topic#predefined-properties)されている場合に役立つことがあります。

以下の例は、`8080`コンテナポートを`80`Dockerホストポートにマッピングする方法を示しています。

```kotlin
```

{src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28,33,37-43,52-53"}

この場合、`http://0.0.0.0:80`でサーバーにアクセスできます。

### 外部レジストリ {id="external-registry"}

**[publishImage](#tasks)**タスクを使用してプロジェクトのDockerイメージを外部レジストリに公開する前に、`ktor.docker.externalRegistry`プロパティを使用して外部レジストリを設定する必要があります。このプロパティは、必要なレジストリタイプの構成を提供する`DockerImageRegistry`インスタンスを受け入れます。

- `DockerImageRegistry.dockerHub`: [Docker Hub](https://hub.docker.com/)用の`DockerImageRegistry`を作成します。
- `DockerImageRegistry.googleContainerRegistry`: [Google Container Registry](https://cloud.google.com/container-registry)用の`DockerImageRegistry`を作成します。

以下の例は、Docker Hubレジストリを構成する方法を示しています。

```kotlin
```

{src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28,33,45-53"}

Docker Hubのユーザー名とパスワードは環境変数から取得されるため、`publishImage`タスクを実行する前にこれらの値を設定する必要があることに注意してください。

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

必要に応じて、独自の`Dockerfile`を提供してKtorアプリケーションを含むイメージを組み立てることができます。

### アプリケーションのパッケージング {id="packagea-pp"}

最初のステップとして、アプリケーションとその依存関係をパッケージングする必要があります。たとえば、これは[fat JAR](server-fatjar.md)または[実行可能なJVMアプリケーション](server-packaging.md)である場合があります。

### Dockerイメージの準備 {id="prepare-docker"}

アプリケーションをDocker化するために、[マルチステージビルド](https://docs.docker.com/develop/develop-images/multistage-build/)を使用します。

1. まず、Gradle/Mavenの依存関係のキャッシュを設定します。このステップは任意ですが、全体的なビルド速度が向上するため推奨されます。
2. 次に、`gradle`/`maven`イメージを使用して、アプリケーションを含むfat JARを生成します。
3. 最後に、生成されたディストリビューションは、JDKイメージに基づいて作成された環境で実行されます。

プロジェクトのルートフォルダに、`Dockerfile`という名前のファイルを以下の内容で作成します。

<tabs group="languages">
<tab title="Gradle" group-key="kotlin">

<code-block lang="Docker" src="snippets/tutorial-server-docker-compose/Dockerfile"/>

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

最初のステージは、ビルド関連ファイルに変更があった場合にのみ依存関係が再ダウンロードされるようにします。最初のステージを使用しない場合、または依存関係が他のステージでキャッシュされない場合、すべてのビルドで依存関係がインストールされます。

2番目のステージではfat JARがビルドされます。Gradleはデフォルトでshadow JARとboot JARもサポートしていることに注意してください。

ビルドの3番目のステージは次のように機能します。

* 使用するイメージを示します。
* 公開されるポートを指定します（これはポートを自動的に公開するものではなく、コンテナ実行時に行われます）。
* ビルド出力の内容をフォルダにコピーします。
* アプリケーションを実行します（`ENTRYPOINT`）。

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

これによりKtorサーバーが起動し、`https://0.0.0.0:8080`に応答します。