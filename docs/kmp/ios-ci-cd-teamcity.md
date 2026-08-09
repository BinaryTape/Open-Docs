[//]: # (title: 为您的 Kotlin Multiplatform 项目配置 iOS 交付流水线)

在本教程中，您将学习如何为包含 iOS 目标的 Kotlin Multiplatform 项目设置 TeamCity Cloud。
您将创建一个 CI 流水线，在托管的 macOS 构建代理上构建和测试您的 iOS 应用，
配置 Apple 签名凭据，将构建版本上传到 TestFlight，并实现流程自动化，以便在每次推送到 GitHub 仓库时启动新的构建。

[Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)将引导您直接从 IDE 完成整个设置过程——从将项目连接到 TeamCity Cloud 到发布您的 iOS 应用程序。

通过此工作流，TeamCity Cloud 会：

*   提供托管的 macOS 构建代理，因此您无需自行准备 Mac。
*   为您生成所需的流水线配置。
*   为您的构建进行签名并将其发布到 [TestFlight](https://developer.apple.com/testflight/)。
*   提供免费的入门层级，包含每月的构建分钟数和存储配额。

## 创建 TeamCity 流水线

### 从 IDE 开始 CI 设置

1.  提交并推送您的项目更改。如果尚未配置 CI，Kotlin Multiplatform IDE 插件将显示一个工具提示，提示您开始 CI 设置。
2.  点击 **Configure CI**（配置 CI）。
    ![推送更改后出现 Configure CI 工具提示](ios-pipeline-Configure-CI.png){width=450 style="block"}
    插件会生成在托管的 macOS 构建代理上构建和测试 iOS 应用所需的文件。
    这些文件会被添加到您的本地项目中，但尚未提交。
3.  如果未安装 TeamCity 插件，IDE 会提示您进行安装。
    点击 **Install TeamCity plugin**（安装 TeamCity 插件），然后返回设置流程。
    ![安装插件以设置 CI/CD](ios-pipeline-install-plugin.png){width=700 style="block"}

    > 您也可以直接从 JetBrains Marketplace 安装 [TeamCity](https://plugins.jetbrains.com/plugin/25142) 插件。
    >
    {style="note"}

4.  当 IDE 显示 **Pipeline is ready**（流水线已就绪）时，初始流水线配置即告完成。
    点击 **Continue**（继续），并在收到提示时允许 IDE 将生成的文件添加到 Git。
    这些文件将保持在本地，直到您将它们提交到仓库。

### 创建或连接 TeamCity Cloud 工作区

TeamCity 需要一个 Cloud 工作区才能在托管的 macOS 构建代理上运行构建。

1.  阅读并接受 TeamCity Cloud 服务条款。
2.  点击 **Create free account**（创建免费帐户）来创建 TeamCity Cloud 帐户。

    > TeamCity Cloud 由 JetBrains 托管并提供免费的入门层级。
    > 免费层级包括每月的构建分钟数和存储配额，
    > 这足以让您免费开始并测试此流水线。
    > 随着 CI/CD 需求的增长，您可以随时升级方案。
    >
    {style="note"}

3.  在浏览器中，点击 **Authorize JetBrains**（授权 JetBrains）以授权集成。

TeamCity 会创建或连接到工作区并准备构建环境。
这通常需要不到 30 秒的时间。

## 构建 iOS 应用

当工作区准备就绪时，IDE 会自动打开 **TeamCity** 选项卡并启动您的首次构建。

对于这第一次运行，TeamCity 使用您本地未提交的项目文件。
它会构建 iOS 应用程序并在托管的 macOS 构建代理上运行配置好的测试。
这让您可以在将任何生成的文件提交到仓库之前，验证流水线是否按预期工作。

![iOS 构建成功](ios-pipeline-first-build.png){width=700 style="block"}

当自动化构建成功时，点击 **Publish to TestFlight**（发布到 TestFlight）来配置签名和部署。

## 配置 Apple 签名和 TestFlight

要将构建版本上传到 TestFlight，TeamCity 需要 App Store Connect 的凭据和 Apple 代码签名。

### 创建 App Store Connect API 密钥

1.  登录 [App Store Connect](https://appstoreconnect.apple.com/)。
2.  转到 **Users and Access**（用户和访问）并选择 **Keys**（密钥）。
3.  创建一个具有上传应用所需权限的 API 密钥。
4.  下载私钥（`.p8` 文件）。
5.  记录该密钥显示的 **Issuer ID**（发行者 ID）和 **Key ID**（密钥 ID）。

您只能下载一次 `.p8` 文件，请务必妥善保存。

### 导出 Apple Distribution 证书

1.  在 Xcode 中，转到 **Settings**（设置）| **Accounts**（帐户），或打开 [Apple Developer Portal](https://developer.apple.com/account/)，
    然后创建或找到您的 Apple Distribution 证书。
2.  在 Mac 上，打开 **Keychain Access**（钥匙串访问）并在 **My Certificates**（我的证书）下找到该证书。
3.  右键点击该证书并选择 **Export**（导出），将其保存为 `.p12` 文件。
4.  设置导出密码并妥善保存；您稍后会用到它。

> 如果您无法使用 Mac，可以使用 OpenSSL 在 Windows 或 Linux 上 
> [生成](https://www.ssl.com/how-to/manually-generate-a-certificate-signing-request-csr-using-openssl/) 
> 证书签名请求 (CSR)，并将生成的证书 
> [转换](https://www.ssl.com/how-to/create-a-pfx-p12-certificate-file-using-openssl/) 为 `.p12` 文件。
>
{style="note"}

### 在 IDE 中添加 Apple 凭据

返回 IDE 并完成 **Add Apple signing credentials**（添加 Apple 签名凭据）表单。
TeamCity 将这些值存储为安全的部署凭据；它们不会被添加到您的项目源文件中。

| 字段 | 说明 |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------|
| **Issuer ID**     | 标识您的 App Store Connect API 集成。                                                                               |
| **Key ID**        | 标识您创建的 API 密钥。                                                                                         |
| **Private Key**   | 从 App Store Connect 下载的 `.p8` 文件。                                                                                |
| **Team ID**       | 您的 Apple Developer 团队标识符。                                                                                            |
| **Bundle ID**     | 您的应用的唯一标识符（例如 `com.company.app`），如应用目标中所配置并列在 App Store Connect 中。 |
| **Certificate**   | 包含私钥的 `.p12` 分发证书。                                                               |
| **.p12 password** | 您在导出证书时指定的密码。                                                                  |
{style="none"}

### 将首次构建上传到 TestFlight

添加凭据后，流水线将包含签名和部署步骤。

1.  点击 **Deploy to TestFlight**（部署到 TestFlight）。
    TeamCity 将重新运行流水线，创建一个经过签名的 iOS 构建版本，并将其上传到 App Store Connect。
2.  打开 App Store Connect 或 TestFlight 并验证构建版本是否已出现。

## 自动化构建与发布

### 连接仓库

要实现此流程的自动化，请将您的 GitHub 仓库连接到 TeamCity，以便每次推送都能触发新的构建。

1.  在第一个部署流水线成功完成后，在 IDE 中点击 **Connect repository**（连接仓库）。
    TeamCity 将在浏览器中打开并确认仓库已获得授权。
    它会自动检测您的仓库和分支，并将其附加到流水线。
2.  返回 IDE，然后提交并推送生成的流水线配置文件。

现在，每当您向配置的分支推送更改时，TeamCity 都会触发流水线。

### 验证流水线

您的 iOS 交付流水线现已就绪！每次向配置的分支推送代码都会触发 TeamCity 执行以下操作：

1.  在托管的 macOS 构建代理上启动构建。
2.  构建 Kotlin Multiplatform 项目。
3.  运行配置好的测试。
4.  为 iOS 应用程序签名。
5.  将新的构建版本上传到 TestFlight。

![iOS 交付流水线已就绪](ios-pipeline-success.png){width=700 style="block"}

点击 **Done**（完成）关闭设置流程。

从现在起，只需推送代码，其余工作均由 TeamCity 处理。

## 下一步

*   阅读更多关于 [TeamCity Cloud 流水线](https://www.jetbrains.com/help/teamcity/cloud/create-and-edit-pipelines.html) 的内容，以进一步自定义您的设置：创建更多项目、设置构建代理要求等。
*   了解如何[发布多平台应用](multiplatform-publish-apps.md)。
*   为 Kotlin Multiplatform 应用程序的持续集成[配置 GitHub Actions](github-actions-for-kmp.md)。