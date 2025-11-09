[//]: # (title: 将你的库发布到 Maven Central – 教程)

在本教程中，你将学习如何将你的 Kotlin Multiplatform 库发布到 [Maven Central](https://central.sonatype.com/) 版本库。

要发布你的库，你需要：

1.  设置凭据，包括 Maven Central 账户和用于签名的 PGP 密钥。
2.  在你的库的**项目**中配置发布插件。
3.  向发布插件提供你的凭据，以便它可以签署和上传你的**构件**。
4.  运行发布**任务**，无论是在本地还是使用持续集成。

本教程假设你：

*   正在创建一个开源库。
*   将库的代码存储在 GitHub 版本库中。
*   正在使用的是 macOS 或 Linux。如果你是 Windows 用户，请使用 [GnuPG 或 Gpg4win](https://gnupg.org/download) 生成密钥对。
*   尚未在 Maven Central 注册，或者已有一个适合[发布到 Central Portal](https://central.sonatype.org/publish-ea/publish-ea-guide/) 的现有账户（在 2024 年 3 月 12 日之后创建，或已由其支持迁移到 Central Portal）。
*   使用 GitHub Actions 进行持续集成。

> 即使你使用的是不同的设置，这里的大多数步骤仍然适用，但可能需要考虑一些差异。
>
> 一个[重要限制](multiplatform-publish-lib-setup.md#host-requirements)是 Apple **目标平台**必须在 macOS 机器上构建。
>
{style="note"}

## 示例库

在本教程中，你将使用 [fibonacci](https://github.com/Kotlin/multiplatform-library-template/) 库作为示例。
你可以参考该版本库的代码，了解发布设置的工作原理。

如果你想重用代码，**必须将所有示例值替换**为你**项目特有的**值。

## 准备账户和凭据

要开始发布到 Maven Central，请在 [Maven Central](https://central.sonatype.com/) portal 上登录（或创建新账户）。

### 选择并验证命名空间

你需要一个已验证的命名空间，以唯一标识你的库在 Maven Central 上的**构件**。

Maven **构件**通过其[坐标](https://central.sonatype.org/publish/requirements/#correct-coordinates)进行标识，例如 `com.example:fibonacci-library:1.0.0`。这些坐标由三个部分组成，以冒号分隔：

*   `groupId` 以反向 DNS 形式表示，例如 `com.example`
*   `artifactId`：库本身的唯一名称，例如 `fibonacci-library`
*   `version`：版本字符串，例如 `1.0.0`。版本可以是任何字符串，但不能以 `-SNAPSHOT` 结尾

你注册的命名空间允许你设置 Maven Central 上 `groupId` 的格式。例如，如果你注册 `com.example` 命名空间，则可以发布 `groupId` 设置为 `com.example`、`com.example.libraryname`、`com.example.module.feature` 等的**构件**。

登录 Maven Central 后，导航到[命名空间](https://central.sonatype.com/publishing/namespaces)页面。
然后，点击 **Add Namespace** 按钮并注册你的命名空间：

<Tabs>
<TabItem id="github" title="使用 GitHub 版本库">

如果你没有域名，使用 GitHub 账户创建命名空间是一个不错的选择：

1.  输入 `io.github.<你的用户名>` 作为你的命名空间，例如 `io.github.kotlinhandson`，然后点击 **Submit**。
2.  复制新创建命名空间下方显示的**验证密钥**。
3.  在 GitHub 上，使用你使用的用户名登录，并创建一个新的公共版本库，将验证密钥作为版本库的名称，例如 `http://github.com/kotlin-hands-on/ex4mpl3c0d`。
4.  返回 Maven Central 并点击 **Verify Namespace** 按钮。验证成功后，你可以删除你创建的版本库。

</TabItem>
<TabItem id="domain" title="使用域名">

要使用你拥有的域名作为命名空间：

1.  以反向 DNS 形式输入你的域名作为命名空间。如果你的域名是 `example.com`，请输入 `com.example`。
2.  复制显示的**验证密钥**。
3.  创建一个新的 TXT DNS 记录，其内容为验证密钥。

   有关如何使用各种域名注册商执行此操作的更多信息，请参阅 [Maven Central 的常见问题](https://central.sonatype.org/faq/how-to-set-txt-record/)。
4.  返回 Maven Central 并点击 **Verify Namespace** 按钮。验证成功后，你可以删除你创建的 TXT 记录。

</TabItem>
</Tabs>

#### 生成密钥对

在你发布内容到 Maven Central 之前，你需要使用 [PGP 签名](https://central.sonatype.org/publish/requirements/gpg/)签署你的**构件**，这允许用户验证**构件**的来源。

要开始签名，你需要生成一个密钥对：

*   _私钥_ 用于签署你的**构件**，绝不应与他人共享。
*   _公钥_ 可以与他人共享，以便他们可以验证你的**构件**的签名。

<Tabs group ="key-pair-tools">
<TabItem title="使用 Kotlin Gradle 插件" group-key="kgp">

Kotlin Gradle 插件有一个 Gradle **任务**，你可以用它来生成密钥对。

1.  使用以下命令生成密钥对。以 `“John Smith <john@example.com>”` 格式提供私钥库的密码和你的姓名：

    ```bash
    ./gradlew -Psigning.password=example-password generatePgpKeys --name "John Smith <john@example.com>"
    ```

   密钥对存储在 `build/pgp` 目录中。

2.  将你的密钥对从 `build/pgp` 目录移动到安全位置，以防止意外删除或未经授权的访问。

</TabItem>
<TabItem title="使用 gpg 工具" group-key="gpg">

用于管理签名的 `gpg` 工具可在 [GnuPG 网站](https://gnupg.org/download/index.html)上获取。
你也可以使用 [Homebrew](https://brew.sh/) 等包管理器安装它：

```bash
brew install gpg
```

1.  使用以下命令开始生成密钥对，并在提示时提供所需详细信息：

    ```bash
    gpg --full-generate-key
    ```

2.  为要创建的密钥类型选择推荐的默认值。
   你可以留空并按 <shortcut>Enter</shortcut> 接受默认值。

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

   > 在撰写本文时，这是 `ECC (签名和加密)`，使用 `Curve 25519`。
   > 较旧的 `gpg` 版本可能默认为 `RSA`，密钥大小为 `3072` 位。
   >
   {style="note"}

3.  当提示指定密钥有效期时，你可以选择不设置过期日期的默认选项。

   如果你选择创建在设定的时间后自动过期的密钥，则在密钥过期时需要[延长其有效期](https://central.sonatype.org/publish/requirements/gpg/#dealing-with-expired-keys)。

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

4.  输入你的姓名、电子邮件和可选注释，以将密钥与身份关联（注释字段可以留空）：

    ```text
    GnuPG needs to construct a user ID to identify your key.

    Real name: Jane Doe
    Email address: janedoe@example.com
    Comment:
    You selected this USER-ID:
        "Jane Doe <janedoe@example.com>"
    ```

5.  输入密码短语来加密密钥，并在提示时重复输入。

   请妥善安全地保管此密码短语。稍后签署**构件**时，你需要它来访问私钥。

6.  使用以下命令查看你创建的密钥：

    ```bash
    gpg --list-keys
    ```

   输出将类似于：

    ```text
    pub   ed25519 2024-10-06 [SC]
          F175482952A225BFD4A07A713EE6B5F76620B385CE
    uid   [ultimate] Jane Doe <janedoe@example.com>
          sub   cv25519 2024-10-06 [E]
    ```

    在接下来的步骤中，你需要使用输出中出现的密钥长字母数字标识符。

</TabItem>
</Tabs>

#### 上传公钥

你需要[将公钥上传到密钥服务器](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)，以便 Maven Central 接受它。有多个可用密钥服务器，我们选择 `keyserver.ubuntu.com` 作为默认选项。

<Tabs group ="key-pair-tools">
<TabItem title="使用 Kotlin Gradle 插件" group-key="kgp">

Kotlin Gradle 插件有一个 Gradle **任务**，你可以用它来上传公钥。

运行以下命令以上传你的公钥，提供其路径：

```bash
./gradlew uploadPublicPgpKey --keyring /path_to/build/pgp/public_KEY_ID.asc
```

</TabItem>
<TabItem title="使用 gpg 工具" group-key="gpg">

你需要[将公钥上传到密钥服务器](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)，以便 Maven Central 接受它。有多个可用密钥服务器，我们选择 `keyserver.ubuntu.com` 作为默认选项。

运行以下命令，使用 `gpg` 上传你的公钥，**在参数中替换为你自己的密钥 ID**：

```bash
gpg --keyserver keyserver.ubuntu.com --send-keys F175482952A225BFC4A07A715EE6B5F76620B385CE
```

**导出私钥** {id="export-your-private-key"}

为了让你的 Gradle **项目**访问你的私钥，你需要将其导出为二进制文件。
系统将提示你输入创建密钥时使用的密码短语。

使用以下命令，**将你自己的密钥 ID 作为参数传入**：

```bash
gpg --no-armor --export-secret-keys F175482952A225BFC4A07A715EE6B5F76620B385CE > key.gpg
```

此命令将创建一个包含你私钥的 `key.gpg` 二进制文件（请确保**不要**使用 `--armor` 标志，因为它只会创建密钥的纯文本版本）。

> 切勿与任何人分享你的私钥文件 – 只有你才能访问它，因为私钥能让你使用凭据签署文件。
>
{style="warning"}

</TabItem>
</Tabs>

## 配置**项目**

### 准备你的库**项目**

如果你从模板**项目**开始开发库，现在是更改**项目**中所有默认名称以匹配你自己的库名称的好时机。这包括你的库模块名称和你的**顶层** `build.gradle.kts` 文件中根**项目**的名称。

如果你的**项目**中包含 Android **目标平台**，你应该遵循[准备 Android 库发布](https://developer.android.com/build/publish-library/prep-lib-release)的步骤。
至少，此过程要求你为库[指定适当的命名空间](https://developer.android.com/build/publish-library/prep-lib-release#choose-namespace)，以便在编译其资源时生成唯一的 `R` 类。
请注意，该命名空间与[之前创建的](#choose-and-verify-a-namespace) Maven 命名空间不同。

```kotlin
// build.gradle.kts

android {
    namespace = "io.github.kotlinhandson.fibonacci"
}
```

### 设置发布插件

本教程使用 [vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin) 帮助发布到 Maven Central。
你可以在[这里](https://vanniktech.github.io/gradle-maven-publish-plugin/#advantages-over-maven-publish)阅读更多关于该插件的优势。
请参阅[插件文档](https://vanniktech.github.io/gradle-maven-publish-plugin/central/)，了解有关其用法和可用配置选项的更多信息。

要将插件添加到你的**项目**，请将以下行添加到你的库模块的 `build.gradle.kts` 文件的 `plugins {}` **代码块**中：

```kotlin
// <module directory>/build.gradle.kts

plugins {
    id("com.vanniktech.maven.publish") version "%vanniktechPublishPlugin%"
}
```

> 有关插件的最新可用版本，请查看其 [Releases 页面](https://github.com/vanniktech/gradle-maven-publish-plugin/releases)。
>
{style="note"}

在同一文件中，添加以下配置，确保为你的库自定义所有值：

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

> 要配置此项，你还可以使用 [Gradle 属性](https://docs.gradle.org/current/userguide/build_environment.html)。
>
{style="tip"}

这里最重要的设置是：

*   `coordinates`，它指定库的 `groupId`、`artifactId` 和 `version`。
*   [许可](https://central.sonatype.org/publish/requirements/#license-information)，你的库在此许可下发布。
*   [开发者信息](https://central.sonatype.org/publish/requirements/#developer-information)，列出库的作者。
*   [SCM（源代码管理）信息](https://central.sonatype.org/publish/requirements/#scm-information)，它指定库源代码的托管位置。

### 运行本地检测

在发布到 Maven Central 之前，最好在本地**检测**你的**项目**是否配置正确。

#### 本地检测签名

运行以下命令来验证你的密钥是否已正确配置用于签名：

```bash
./gradlew checkSigningConfiguration
```

这个 Gradle **任务**会**检测**你的公钥是否已上传到 `keyserver.ubuntu.com` 或 `keys.openpgp.org` 密钥服务器。

如果**任务**报告错误，请查看输出以获取有关如何修复的详细信息。

#### 本地检测 `pom.xml` 文件

要将你的库发布到 Maven Central，`pom.xml` 文件必须满足 Maven Central 的[要求](https://central.sonatype.org/publish/requirements/#required-pom-metadata)。

对于你计划发布的每个库，运行以下命令，将 `<PUBLICATION_NAME>` 替换为发布项名称：

```bash
./gradlew checkPomFileFor<PUBLICATION_NAME>Publication
```

使用 [vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin) 时，发布项通常命名为 `Maven`。在这种情况下，该**任务**变为：

```bash
./gradlew checkPomFileForMavenPublication
```

如果**任务**报告错误，请查看输出以获取有关如何修复的详细信息。

## 使用持续集成发布到 Maven Central

### 生成用户令牌

你需要一个 Maven 访问令牌，以便 Maven Central 授权你的发布请求。
打开[设置基于令牌的身份验证](https://central.sonatype.com/usertoken)页面，然后点击 **Generate User Token** 按钮。

输出类似于以下示例，包含用户名和密码。
如果你丢失了这些凭据，稍后需要生成新的凭据，因为 Maven Central 不会存储它们。

```xml
<server>
    <id>${server}</id>
    <username>l2nfaPmz</username>
    <password>gh9jT9XfnGtUngWTZwTu/8141keYdmQpipqLPRKeDLTh</password>
</server>
```

### 将密钥添加到 GitHub

为了在 GitHub Actions 工作流中使用发布所需的密钥和凭据，同时保持其私密性，你需要将这些值存储为密钥。

1.  在你的 GitHub **版本库**的**设置**页面上，点击 **Security** | **Secrets and variables** | **Actions**。
2.  点击 `New repository secret` 按钮并添加以下密钥：

   *   `MAVEN_CENTRAL_USERNAME` 和 `MAVEN_CENTRAL_PASSWORD` 是由 Central Portal 网站[为用户令牌生成的值](#generate-the-user-token)。
   *   `SIGNING_KEY_ID` 是你的签名密钥标识符的**最后 8 个字符**，例如，`F175482952A225BFC4A07A715EE6B5F76620B385CE` 的 `20B385CE`。
   *   `SIGNING_PASSWORD` 是你生成 GPG 密钥时提供的密码短语。
   *   `GPG_KEY_CONTENTS` 应包含[你的 `key.gpg` 文件](#export-your-private-key)的全部内容。

   ![Add secrets to GitHub](github_secrets.png){width=700}

你将在下一步的 CI 配置中使用这些密钥的名称。

### 将 GitHub Actions 工作流添加到你的**项目**

你可以设置持续集成来自动构建和发布你的库。
我们将使用 [GitHub Actions](https://docs.github.com/en/actions) 作为示例。

首先，将以下工作流添加到你的**版本库**中的 `.github/workflows/publish.yml` 文件：

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

提交并推送此文件后，每当你在托管**项目**的 GitHub **版本库**中创建发布（包括预发布版本）时，工作流将自动运行。该工作流会检出你当前版本的代码，设置 JDK，然后运行 `publishToMavenCentral` Gradle **任务**。

使用 `publishToMavenCentral` **任务**时，你仍然需要在 Maven Central 网站上[手动检测并发布你的部署](#create-a-release-on-github)。或者，你可以使用 `publishAndReleaseToMavenCentral` **任务**来完全自动化发布过程。

你还可以配置工作流以[在推送标签时触发](https://stackoverflow.com/a/61892639)到你的**版本库**。

> 上述脚本通过在 Gradle 命令中添加 `--no-configuration-cache` 来禁用发布**任务**的 Gradle [配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)，因为发布插件不支持它（参见此[开放问题](https://github.com/gradle/gradle/issues/22779)）。
>
{style="tip"}

此 action 需要你的签名详细信息和 Maven Central 凭据，这些凭据是你作为[**版本库**密钥](#add-secrets-to-github)创建的。

工作流配置会自动将这些密钥传输到环境变量中，使它们可供 Gradle 构建过程使用。

### 在 GitHub 上创建发布

设置好工作流和密钥后，你现在可以[创建发布](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)来触发你的库的发布。

1.  确保你的库的 `build.gradle.kts` 文件中指定的版本号是你想要发布的版本。
2.  进入你的 GitHub **版本库**主页。
3.  在右侧边栏中，点击 **Releases**。
4.  点击 `Draft a new release` 按钮（如果你以前从未为此**版本库**创建过发布，则点击 `Create a new release` 按钮）。
5.  每个发布都有一个标签。在标签下拉菜单中创建一个新标签，并设置发布标题（标签名称和标题可以相同）。

   你可能希望它们与你在 `build.gradle.kts` 文件中指定的库版本号相同。

   ![Create a release on GitHub](create_release_and_tag.png){width=700}

6.  仔细**检测**你想要发布的目标分支（尤其如果它不是默认分支），并为你的新版本添加适当的发布说明。
7.  使用描述下方的复选框将发布标记为预发布版本（对于**抢先体验预览**版本如 alpha、beta 或 RC 很有用）。

   你也可以将发布标记为最新版本（如果你之前已经为此**版本库**创建过发布）。
8.  点击 **Publish release** 按钮以创建新发布。
9.  点击你的 GitHub **版本库**页面顶部的 **Actions** 选项卡。在这里，你将看到新发布触发了你的发布工作流。

   你可以点击工作流查看发布**任务**的输出。
10. 工作流运行完成后，导航到 Maven Central 上的[部署](https://central.sonatype.com/publishing/deployments)仪表板。你应该会在这里看到一个新部署。

    在 Maven Central 执行**检测**时，此部署可能会在 _pending_ 或 _validating_ 状态下停留一段时间。

11. 一旦你的部署进入 _validated_ 状态，**检测**它是否包含你上传的所有**构件**。
    如果一切看起来正确，点击 **Publish** 按钮以发布这些**构件**。

    ![Publishing settings](published_on_maven_central.png){width=700}

    > 发布后，**构件**需要一些时间（通常约为 15–30 分钟，但可能需要数小时）才能在 Maven Central **版本库**中公开可用。它们可能需要更长时间才能被索引并在 [Maven Central 网站](https://central.sonatype.com/)上可搜索。
    >
    {style="tip"}

要一旦部署验证完成就自动发布**构件**，请将工作流中的 `publishToMavenCentral` **任务**替换为 `publishAndReleaseToMavenCentral`。

## 下一步

*   [了解更多关于设置多平台库发布和要求的信息](multiplatform-publish-lib-setup.md)
*   [将 shield.io 徽章添加到你的 README](https://shields.io/badges/maven-central-version)
*   [使用 Dokka 分享你**项目**的 API 文档](https://kotl.in/dokka)
*   [添加 Renovate 自动更新**依赖项**](https://docs.renovatebot.com/)
*   [在 JetBrains 搜索平台上推广你的库](https://klibs.io/)
*   [在 `#feed` Kotlin Slack 频道中与社区分享你的库](https://kotlinlang.slack.com/) （要注册，请访问 https://kotl.in/slack）