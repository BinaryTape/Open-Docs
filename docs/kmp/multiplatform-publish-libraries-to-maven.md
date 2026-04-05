[//]: # (title: 将库发布到 Maven Central – 教程)

在本教程中，您将学习如何将您的 Kotlin Multiplatform 库发布到 [Maven Central](https://central.sonatype.com/) 仓库。

要发布您的库，您需要：

1. 设置凭据，包括 Maven Central 帐户和用于签名的 PGP 密钥。
2. 在您的库项目中配置发布插件。
3. 向发布插件提供您的凭据，以便它可以对您的构件进行签名并上传。
4. 运行发布任务，可以在本地运行，也可以使用持续集成运行。

本教程假设您：

* 正在创建一个开源库。
* 将库的代码存储在 GitHub 仓库中。
* 使用 macOS 或 Linux。如果您是 Windows 用户，请使用 [GnuPG 或 Gpg4win](https://gnupg.org/download) 生成密钥对。
* 尚未在 Maven Central 注册，或者拥有适合[发布到中央门户 (Central Portal)](https://central.sonatype.org/publish-ea/publish-ea-guide/) 的现有帐户（在 2024 年 3 月 12 日之后创建，或由其支持团队迁移到中央门户）。
* 使用 GitHub Actions 进行持续集成。

> 如果您使用不同的设置，此处的大多数步骤仍然适用，但可能需要考虑一些差异。
> 
> 一个[重要的限制](multiplatform-publish-lib-setup.md#host-requirements)是 Apple 目标必须在装有 macOS 的计算机上构建。
> 
{style="note"}

## 示例库

在本教程中，您将使用 [fibonacci](https://github.com/Kotlin/multiplatform-library-template/) 库作为示例。您可以参考该仓库的代码来查看发布配置的工作原理。

如果您想复用这些代码，您**必须将所有示例值替换为**特定于您项目的值。

## 准备帐户和凭据

要开始发布到 Maven Central，请在 [Maven Central](https://central.sonatype.com/) 门户登录（或创建新帐户）。

### 选择并验证命名空间

您需要一个经过验证的命名空间，以便在 Maven Central 上唯一标识您库的构件。

Maven 构件通过其[坐标](https://central.sonatype.org/publish/requirements/#correct-coordinates)进行标识，例如 `com.example:fibonacci-library:1.0.0`。这些坐标由三个部分组成，用冒号分隔：

* `groupId`：采用反向 DNS 形式，例如 `com.example`
* `artifactId`：库本身的唯一名称，例如 `fibonacci-library`
* `version`：版本字符串，例如 `1.0.0`。版本可以是任何字符串，但不能以 `-SNAPSHOT` 结尾

您注册的命名空间允许您在 Maven Central 上设置 `groupId` 的格式。例如，如果您注册了 `com.example` 命名空间，则可以发布 `groupId` 设置为 `com.example`、`com.example.libraryname`、`com.example.module.feature` 等的构件。

登录 Maven Central 后，导航到 [Namespaces](https://central.sonatype.com/publishing/namespaces) 页面。然后，点击 **Add Namespace** 按钮并注册您的命名空间：

<Tabs>
<TabItem id="github" title="使用 GitHub 仓库">

如果您没有域名，使用您的 GitHub 帐户创建命名空间是一个不错的选择：

1. 输入 `io.github.<your username>` 作为您的命名空间，例如 `io.github.kotlinhandson` 并点击 **Submit**。
2. 复制新创建的命名空间下显示的 **Verification Key**。
3. 在 GitHub 上，使用您使用的用户名登录，并创建一个新的公开仓库，以验证密钥作为仓库名称，例如 `http://github.com/kotlin-hands-on/ex4mpl3c0d`。
4. 返回 Maven Central 并点击 **Verify Namespace** 按钮。验证成功后，您可以删除创建的仓库。

</TabItem>
<TabItem id="domain" title="使用域名">

要使用您拥有的域名作为命名空间：

1. 以反向 DNS 形式输入您的域名作为命名空间。如果您的域名是 `example.com`，请输入 `com.example`。
2. 复制显示的 **Verification Key**。
3. 创建一个新的 TXT DNS 记录，其内容为验证密钥。

   有关如何在各种域名注册商处执行此操作的更多信息，请参阅 [Maven Central 的常见问题解答](https://central.sonatype.org/faq/how-to-set-txt-record/)。
4. 返回 Maven Central 并点击 **Verify Namespace** 按钮。验证成功后，您可以删除创建的 TXT 记录。

</TabItem>
</Tabs>

#### 生成密钥对

在向 Maven Central 发布内容之前，您需要使用 [PGP 签名](https://central.sonatype.org/publish/requirements/gpg/)对您的构件进行签名，这允许用户验证构件的来源。

要开始签名，您需要生成一个密钥对：

* _私钥_用于对您的构件进行签名，绝不应与他人共享。
* _公钥_可以与他人共享，以便他们验证您构件的签名。

<Tabs group ="key-pair-tools">
<TabItem title="使用 Kotlin Gradle 插件" group-key="kgp">

Kotlin Gradle 插件有一个 Gradle 任务，可用于生成密钥对。

1. 使用以下命令生成密钥对。请按以下格式提供私钥库的密码和您的姓名：

    ```bash
    ./gradlew -Psigning.password=example-password generatePgpKeys --name "John Smith <john@example.com>"
    ```

   密钥对存储在 `build/pgp` 目录中。

2. 将您的密钥对从 `build/pgp` 目录移动到一个安全位置，以防止意外删除或未经授权的访问。

</TabItem>
<TabItem title="使用 gpg 工具" group-key="gpg">

可以为您管理签名的 `gpg` 工具可在 [GnuPG 网站](https://gnupg.org/download/index.html)上找到。您也可以使用 [Homebrew](https://brew.sh/) 等软件包管理器安装它：

```bash 
brew install gpg
```

1. 使用以下命令开始生成密钥对，并在出现提示时提供所需的详细信息：

    ```bash
    gpg --full-generate-key
    ```

2. 为要创建的密钥类型选择推荐的默认值。您可以将选择留空并按 <shortcut>输入</shortcut> 键接受默认值。

    ```text
    Please select what kind of key you want:
        (1) RSA and RSA
        (2) DSA and Elgamal
        (3) DSA (sign only)
        (4) RSA (sign only)
        (9) ECC (sign and encrypt) *default*
        (10) ECC (sign only)
        (14) Existing key from card
    Your selection? 9
    
    Please select which elliptic curve you want:
        (1) Curve 25519 *default*
        (4) NIST P-384
        (6) Brainpool P-256
    Your selection? 1
    ```

   > 在撰写本文时，这是带有 `Curve 25519` 的 `ECC (sign and encrypt)`。较早版本的 `gpg` 可能默认为密钥大小为 `3072` 位的 `RSA`。
   >
   {style="note"}

3. 当提示指定密钥的有效期时，您可以选择不设过期日期的默认选项。

   如果您选择创建一个在设定时间后自动过期的密钥，则需要在密钥过期时[延长其有效期](https://central.sonatype.org/publish/requirements/gpg/#dealing-with-expired-keys)。

    ```text
    Please specify how long the key should be valid.
        0 = key does not expire
        <n>  = key expires in n days
        <n>w = key expires in n weeks
        <n>m = key expires in n months
        <n>y = key expires in n years
    Key is valid for? (0) 0
    Key does not expire at all
    
    Is this correct? (y/N) y
    ```

4. 输入您的姓名、电子邮件和可选注释，以将密钥与身份关联（您可以将注释字段留空）：

    ```text
    GnuPG needs to construct a user ID to identify your key.

    Real name: Jane Doe
    Email address: janedoe@example.com
    Comment:
    You selected this USER-ID:
        "Jane Doe <janedoe@example.com>"
    ```

5. 输入密码句以对密钥进行加密，并在出现提示时重复输入。

   请安全且私密地存储此密码句。稍后在对构件进行签名时，您将需要它来访问私钥。

6. 使用以下命令查看您创建的密钥：

   ```bash
   gpg --list-keys
   ```

   输出结果如下所示：

    ```text
    pub   ed25519 2024-10-06 [SC]
          F175482952A225BFD4A07A713EE6B5F76620B385CE
    uid   [ultimate] Jane Doe <janedoe@example.com>
          sub   cv25519 2024-10-06 [E]
    ```

    在接下来的步骤中，您需要使用输出中显示的密钥的完整长字母数字标识符。

</TabItem>
</Tabs>

#### 上传公钥

您需要[将公钥上传到密钥服务器](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)，以便它被 Maven Central 接受。有多个可用的密钥服务器，让我们使用 `keyserver.ubuntu.com` 作为默认选择。

<Tabs group ="key-pair-tools">
<TabItem title="使用 Kotlin Gradle 插件" group-key="kgp">

Kotlin Gradle 插件有一个 Gradle 任务，可用于上传公钥。

运行以下命令上传您的公钥，并提供其路径：

```bash
./gradlew uploadPublicPgpKey --keyring /path_to/build/pgp/public_KEY_ID.asc
```

</TabItem>
<TabItem title="使用 gpg 工具" group-key="gpg">

您需要[将公钥上传到密钥服务器](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)，以便它被 Maven Central 接受。有多个可用的密钥服务器，让我们使用 `keyserver.ubuntu.com` 作为默认选择。

运行以下命令使用 `gpg` 上传您的公钥，并在参数中**替换为您自己的密钥 ID**：

```bash
gpg --keyserver keyserver.ubuntu.com --send-keys F175482952A225BFC4A07A715EE6B5F76620B385CE
```

**导出您的私钥** {id="export-your-private-key"}

为了让您的 Gradle 项目访问您的私钥，您需要将其导出到文件中。系统会提示您输入创建密钥时使用的密码句。

使用以下命令，将**您自己的密钥 ID** 作为参数传入：

```bash
gpg --armor --export-secret-keys F175482952A225BFC4A07A715EE6B5F76620B385CE > key.gpg
```

此命令将创建一个包含您私钥的 `key.gpg` 文本文件。

> 绝不要与任何人共享您的私钥文件——只有您应该拥有它的访问权限，因为私钥允许使用您的凭据签署文件。
>
{style="warning"}

</TabItem>
</Tabs>

## 配置项目

### 准备您的库项目

如果您是从模板项目开始开发库的，那么现在是更改项目中任何默认名称以匹配您自己库名称的好时机。这包括库模块的名称以及顶级 `build.gradle.kts` 文件中根项目的名称。

如果您的项目中有 Android 目标，则应遵循[准备 Android 库发布的步骤](https://developer.android.com/build/publish-library/prep-lib-release)。此过程至少要求您为库[指定适当的命名空间](https://developer.android.com/build/publish-library/prep-lib-release#choose-namespace)，以便在编译其资源时生成唯一的 `R` 类。请注意，此命名空间与[之前创建](#choose-and-verify-a-namespace)的 Maven 命名空间不同。

```kotlin
// build.gradle.kts

android {
    namespace = "io.github.kotlinhandson.fibonacci"
}
```

### 设置发布插件

本教程使用 [vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin) 来辅助发布到 Maven Central。您可以在此处阅读有关该插件优势的[更多信息](https://vanniktech.github.io/gradle-maven-publish-plugin/#advantages-over-maven-publish)。请参阅[插件文档](https://vanniktech.github.io/gradle-maven-publish-plugin/central/)，详细了解其用法和可用的配置选项。

要将该插件添加到您的项目中，请在库模块的 `build.gradle.kts` 文件的 `plugins {}` 块中添加以下行：

```kotlin
// <module directory>/build.gradle.kts

plugins {
    id("com.vanniktech.maven.publish") version "%vanniktechPublishPlugin%" 
}
```

> 有关该插件的最新可用版本，请查看其 [Releases 页面](https://github.com/vanniktech/gradle-maven-publish-plugin/releases)。
> 
{style="note"}

在同一个文件中，添加以下配置，确保为您自己的库自定义所有值：

```kotlin
// <module directory>/build.gradle.kts

mavenPublishing {
    publishToMavenCentral()
    
    signAllPublications()
    
    coordinates(group.toString(), "fibonacci", version.toString())
    
    pom { 
        name = "Fibonacci library"
        description = "A mathematics calculation library."
        inceptionYear = "2024"
        url = "https://github.com/kotlin-hands-on/fibonacci/"
        licenses {
            license {
                name = "The Apache License, Version 2.0"
                url = "https://www.apache.org/licenses/LICENSE-2.0.txt"
                distribution = "https://www.apache.org/licenses/LICENSE-2.0.txt"
            }
        }
        developers {
            developer {
                id = "kotlin-hands-on"
                name = "Kotlin Developer Advocate"
                url = "https://github.com/kotlin-hands-on/"
            }
        }
        scm {
            url = "https://github.com/kotlin-hands-on/fibonacci/"
            connection = "scm:git:git://github.com/kotlin-hands-on/fibonacci.git"
            developerConnection = "scm:git:ssh://git@github.com/kotlin-hands-on/fibonacci.git"
        }
    }
}
```

> 要配置此项，您还可以使用 [Gradle 属性](https://docs.gradle.org/current/userguide/build_environment.html)。
> 
{style="tip"}

此处最重要的设置包括：

* `coordinates`：指定库的 `groupId`、`artifactId` 和 `version`。
* [许可证 (license)](https://central.sonatype.org/publish/requirements/#license-information)：发布库所采用的许可证。
* [开发者信息](https://central.sonatype.org/publish/requirements/#developer-information)：列出库的作者。
* [SCM (源代码管理) 信息](https://central.sonatype.org/publish/requirements/#scm-information)：指定库源代码托管的位置。

### 运行本地检查

在发布到 Maven Central 之前，最好在本地检查项目配置是否正确。

#### 本地检查签名

通过运行以下命令验证您的密钥是否已正确配置用于签名：

```bash
./gradlew checkSigningConfiguration
```

此 Gradle 任务会检查您的公钥是否已上传到 `keyserver.ubuntu.com` 或 `keys.openpgp.org` 密钥服务器。

如果任务报告错误，请查看输出以获取有关如何修复错误的详细信息。

#### 本地检查 `pom.xml` 文件

要将库发布到 Maven Central，`pom.xml` 文件必须符合 Maven Central 的[要求](https://central.sonatype.org/publish/requirements/#required-pom-metadata)。

对于您计划发布的每个库，请运行以下命令，并将 `<PUBLICATION_NAME>` 替换为发布名称：

```bash
./gradlew checkPomFileFor<PUBLICATION_NAME>Publication
```

使用 [vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin) 时，发布通常命名为 `Maven`。在这种情况下，命令变为：

```bash
./gradlew checkPomFileForMavenPublication
```

如果任务报告错误，请查看输出以获取有关如何修复错误的详细信息。

## 使用持续集成发布到 Maven Central

### 生成用户令牌

您需要一个 Maven 访问令牌，以便 Maven Central 授权您的发布请求。打开 [Setup Token-Based Authentication](https://central.sonatype.com/usertoken) 页面，点击 **Generate User Token** 按钮。

输出结果如下例所示，包含用户名和密码。如果您丢失了这些凭据，稍后需要重新生成，因为 Maven Central 不存储这些凭据。

```xml
<server>
    <id>${server}</id>
    <username>l2nfaPmz</username>
    <password>gh9jT9XfnGtUngWTZwTu/8141keYdmQpipqLPRKeDLTh</password>
</server>
```

### 向 GitHub 添加机密 (Secrets)

要在 GitHub Action 工作流中使用发布所需的密钥和凭据同时保持其私密性，您需要将这些值存储为机密 (Secrets)。

1. 在 GitHub 仓库的 **Settings** 页面上，点击 **Security** | **Secrets and variables** | **Actions**。
2. 点击 `New repository secret` 按钮并添加以下机密：

   * `MAVEN_CENTRAL_USERNAME` 和 `MAVEN_CENTRAL_PASSWORD` 是由中央门户网站为[用户令牌生成的](#generate-the-user-token)值。
   * `SIGNING_KEY_ID` 是签名密钥标识符的**最后 8 个字符**，例如 `F175482952A225BFC4A07A715EE6B5F76620B385CE` 的 `20B385CE`。
   * `SIGNING_PASSWORD` 是您在生成 GPG 密钥时提供的密码句。
   * `GPG_KEY_CONTENTS` 应包含 [您的 `key.gpg` 文件](#export-your-private-key) 的全部内容。

   ![向 GitHub 添加机密](github-secrets.png){width=700}

您将在下一步的 CI 配置中使用这些机密的名称。

### 将 GitHub Actions 工作流添加到项目中

您可以设置持续集成来自动构建并发布您的库。我们将以 [GitHub Actions](https://docs.github.com/en/actions) 为例。

首先，在仓库的 `.github/workflows/publish.yml` 文件中添加以下工作流：

```yaml
# .github/workflows/publish.yml

name: Publish
on:
  release:
    types: [released, prereleased]
jobs:
  publish:
    name: Release build and publish
    runs-on: macOS-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v4
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: 21
      - name: Publish to MavenCentral
        run: ./gradlew publishToMavenCentral --no-configuration-cache
        env:
          ORG_GRADLE_PROJECT_mavenCentralUsername: ${{ secrets.MAVEN_CENTRAL_USERNAME }}
          ORG_GRADLE_PROJECT_mavenCentralPassword: ${{ secrets.MAVEN_CENTRAL_PASSWORD }}
          ORG_GRADLE_PROJECT_signingInMemoryKeyId: ${{ secrets.SIGNING_KEY_ID }}
          ORG_GRADLE_PROJECT_signingInMemoryKeyPassword: ${{ secrets.SIGNING_PASSWORD }}
          ORG_GRADLE_PROJECT_signingInMemoryKey: ${{ secrets.GPG_KEY_CONTENTS }}
```

一旦您提交并推送此文件，每当您在托管项目的 GitHub 仓库中创建版本（包括预发布版本）时，工作流都会自动运行。该工作流会检出当前版本的代码，设置 JDK，然后运行 `publishToMavenCentral` Gradle 任务。

使用 `publishToMavenCentral` 任务时，您仍需要在 Maven Central 网站上检查并[手动发布您的部署](#create-a-release-on-github)。或者，您可以使用 `publishAndReleaseToMavenCentral` 任务来完全自动化发布过程。

您还可以将工作流配置为在[标记 (tag) 被推送到](https://stackoverflow.com/a/61892639)仓库时触发。

> 上述脚本通过在 Gradle 命令中添加 `--no-configuration-cache` 禁用了发布任务的 Gradle [配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)，因为发布插件尚不支持该功能（见此[未解决的问题](https://github.com/gradle/gradle/issues/22779)）。
>
{style="tip"}

此操作需要您的签名详情和 Maven Central 凭据，您已将其创建为[仓库机密](#add-secrets-to-github)。

工作流配置会自动将这些机密传输到环境变量中，使其可供 Gradle 构建过程使用。

### 在 GitHub 上创建版本

设置好工作流和机密后，您现在可以[创建版本](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)，这将触发库的发布。

1. 确保库的 `build.gradle.kts` 文件中指定的版本号是您想要发布的版本号。
2. 转到 GitHub 仓库的主页。
3. 在右侧侧边栏中，点击 **Releases**。
4. 点击 **Draft a new release** 按钮（如果您以前从未为此仓库创建过版本，则点击 **Create a new release** 按钮）。
5. 每个版本都有一个标记 (tag)。在标记下拉菜单中创建一个新标记，并设置版本标题（标记名称和标题可以相同）。
   
   您可能希望这些名称与您在 `build.gradle.kts` 文件中指定的库版本号相同。

   ![在 GitHub 上创建版本](create-release-and-tag.png){width=700}

6. 仔细检查您想要发布的目标分支（特别是如果它不是默认分支），并为您的新版本添加适当的发行说明。
7. 使用描述下方的复选框将版本标记为预发布版本（适用于 Alpha、Beta 或 RC 等早期体验版本）。
   
   您还可以将该版本标记为最新版本（如果您之前已经为此仓库发布过版本）。
8. 点击 **Publish release** 按钮以创建新版本。
9. 点击 GitHub 仓库页面顶部的 **Actions** 选项卡。在这里，您将看到新发布的版本触发了您的发布工作流。
    
   您可以点击工作流来查看发布任务的输出。
10. 工作流运行完成后，导航到 Maven Central 上的 [Deployments](https://central.sonatype.com/publishing/deployments) 仪表板。您应该在这里看到一个新的部署。

    在 Maven Central 执行检查时，此部署可能会在一段时间内保持在 _pending_（待处理）或 _validating_（验证中）状态。

11. 一旦您的部署处于 _validated_（已验证）状态，请检查它是否包含您上传的所有构件。如果一切看起来都正确，请点击 **Publish** 按钮来发布这些构件。

    ![发布设置](published-on-maven-central.png){width=700}

    > 发布后，构件需要一段时间（通常约为 15–30 分钟，但有时可能需要几个小时）才能在 Maven Central 仓库中公开可用。它们可能需要更长时间才能被索引并在 [Maven Central 网站](https://central.sonatype.com/)上被搜索到。
    >
    {style="tip"}

要在验证部署后自动发布构件，请将工作流中的 `publishToMavenCentral` 任务替换为 `publishAndReleaseToMavenCentral`。

## 下一步

* [详细了解设置多平台库发布和要求](multiplatform-publish-lib-setup.md)
* [将 shield.io 徽章添加到您的 README 中](https://shields.io/badges/maven-central-version)
* [使用 Dokka 为您的项目共享 API 文档](https://kotl.in/dokka)
* [添加 Renovate 以自动更新依赖项](https://docs.renovatebot.com/)
* [在 JetBrains 的搜索平台上推广您的库](https://klibs.io/)
* [在 Kotlin Slack 的 `#feed` 频道与社区分享您的库](https://kotlinlang.slack.com/)（要注册，请访问 https://kotl.in/slack）