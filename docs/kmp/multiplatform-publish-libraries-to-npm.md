[//]: # (title: 将库发布到 npm – 教程)

<tldr>
<p>使用 <a href="https://npm-publish.petuska.dev/latest/">npm-publish Gradle 插件</a>，手动或通过 GitHub Actions 将 Kotlin 多平台库发布到 npm。</p>
</tldr>

要发布库，您需要：

1. 准备凭据，包括 [npm 帐号](https://docs.npmjs.com/creating-a-new-npm-user-account) 和 [访问令牌](https://docs.npmjs.com/creating-and-viewing-access-tokens)。
2. 在 Kotlin 多平台项目中配置发布插件。
3. 向发布插件提供凭据，或为持续集成设置受信任的发布者 (Trusted Publisher)。
4. 手动或使用 CI 运行发布任务。

在本教程中，我们使用 GitHub 托管项目，并利用 GitHub Actions 运行 CI。

## 示例库

您可以参考 [示例库项目](https://github.com/Kotlin/kotlin-multiplatform-web-library) 来跟随教程并查看运行配置。

如果您复用这些代码，请确保**将所有示例值替换**为您项目的具体值。

## 准备帐号和凭据

要发布到 npm，您需要[在 npm 门户登录](https://www.npmjs.com/login)。

在本教程中，您将需要一个组织和访问令牌来配置手动发布。

### 创建一个简单的组织

在本教程中，我们将库发布在 npm 组织下，以避免命名冲突。

要创建新组织，请参考 [npm 文档](https://docs.npmjs.com/creating-an-organization)。

### 生成访问令牌

要手动发布到 npm，您需要一个访问令牌，该令牌允许在您新创建的组织下发布软件包。
要生成此类令牌，请参考 [npm 指南](https://docs.npmjs.com/creating-and-viewing-access-tokens)。

对于本教程，请使用简化的安全配置：
* 启用 **Bypass two-factor authentication (2FA)**（绕过双重身份验证）选项。
* 将令牌的常规权限和组织权限都设置为 **Read and write**（读写）。

## 配置库项目

如果您使用[示例项目](https://github.com/Kotlin/kotlin-multiplatform-web-library)，
请在发布前更新默认名称。
这包括：

* 库模块的名称。
* 在 `settings.gradle.kts` 文件中设置的项目名称。 

设置好名称后，请按照以下步骤设置发布。

### 设置发布插件

本教程使用官方的 [npm-publish 插件](https://github.com/Kotlin/npm-publish) 来辅助发布到 npm。
要详细了解该插件和可用的配置选项，请参阅[插件文档](https://npm-publish.petuska.dev)。

将插件添加到您的 Kotlin 多平台项目中：

1. 打开库模块的 `build.gradle.kts` 文件。

2. 在 `plugins {}` 代码块中添加以下行： 

    ```kotlin
    // <模块目录>/build.gradle.kts
    
    plugins {
        kotlin("npm-publish") version "%npmPublishPlugin%"
    }
    ```
    
    > 有关插件的最新可用版本，请查看 [Releases](https://github.com/Kotlin/npm-publish/releases) 页面。
    > 
    {style="note"}

3. 添加以下配置。
   确保为您自己的库自定义这些值。
   唯一必需的参数是 `organization`、`authToken`、`packageName` 和 `version`。
   其余部分作为扩展示例给出：

    ```kotlin
    // <模块目录>/build.gradle.kts
    npmPublish {
        organization = "organization_name_without_the_@_sign"
        
        registries {
            npmjs {
                // 运行发布软件包的命令时，
                // 您将通过此环境变量传递 npm 令牌
                authToken = System.getenv("NPM_TOKEN")
            }
        }
    
        packages {
            named("js") {
                version = "0.0.1"
                packageName = "greetings"
                readme = file("../README.md")
    
                packageJson {
                    license = "Apache 2.0"
                    homepage = "https://github.com/Kotlin/kotlin-multiplatform-web-library#readme"
                    description = "Shared Kotlin/JS Greetings library"
                    keywords = listOf("kotlin", "kotlin-js", "greetings", "shared", "api")
                    author {
                        name = "Kotlin Developer Advocate"
                        url = "https://github.com/kotlin-hands-on/"
                    }
                    contributors = listOf(
                        Person {
                            name = "John Smith"
                            email = "john.smith@example.com"
                            url = "https://github.com/johnsmith"
                        },
                    )
                    repository {
                        type = "git"
                        url = "https://github.com/Kotlin/kotlin-multiplatform-web-library.git"
                    }
                }
            }
        }
    }
    ```

    > 要进行此配置，您还可以使用 [Gradle 属性](https://docs.gradle.org/current/userguide/build_environment.html)。
    > 
    {style="tip"}

`npmPublish {}` 代码块中的重要设置包括：

* `organization` 参数和 `registries {}` 代码块指定了身份验证详情。
  在此示例中，我们使用主要的 npm 仓库，以及运行发布任务时应保存令牌的 `NPM_TOKEN` 变量名。
* `packageName` 和 `version` 参数定义了强制性的软件包选项：
  * 可以省略 `version` 参数，以使用模块版本作为默认值。
  * 可以省略 `packageName` 参数，以使用模块名称作为默认值。
* `packageJson {}` 代码块包含各种元数据。

## 手动发布

当您仍在尝试项目结构，或者想要自己实现发布自动化时，手动发布非常有用。

现在您可以从本地计算机将库发布到 npm。
为此，请运行以下命令，并将您之前生成的访问令牌粘贴在 `YOUR_ACCESS_TOKEN` 处：

```bash
NPM_TOKEN=YOUR_ACCESS_TOKEN ./gradlew :shared:publishJsPackageToNpmjsRegistry
```

库发布后，您应该能在 npm 仓库中看到它。
打开您的 npm 组织页面并检查 **Packages** 选项卡（而不是在您的个人 **Packages** 页面）。

![在 npm 上发布的库](published-on-npm.png){width=700}

### 故障排除

手动发布过程中经常会出现的几点问题：

* 留意 `build.gradle.kts` 配置中的 `version` 字段：
  如果软件包已使用相同或更早的版本发布过，npm 将发布失败。
* 为限定组织作用域的软件包生成令牌时，请确保同时设置了常规权限**和**组织权限。

## 使用持续集成 (CI) 发布

npm 的受信任发布者 (Trusted Publishers) 机制允许您使用 OpenID Connect 快速设置 CI。
这种方法可以完全避免生成和维护令牌。

在此示例中，我们将使用 [GitHub Actions](https://docs.github.com/en/actions) 设置工作流。

### 创建 GitHub Actions 工作流文件

创建 `.github/workflows/publish.yml` 文件来配置 GitHub 操作：

```yaml
# .github/workflows/publish.yml

name: Publish

on:
  release:
    types: [released, prereleased]

permissions:
  id-token: write  # GitHub Actions 与 npm 受信任发布集成所需
  contents: read

jobs:
  publish:
    name: Release build and publish
    runs-on: ubuntu-latest
    steps:
      # 检出触发分支
      - name: Check out code
        uses: actions/checkout@v4

      # 设置 JDK 以运行 Gradle 任务
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: 21

      # 为库模块运行 Gradle 发布任务
      - name: Publish to npm
        run: ./gradlew :shared:publishJsPackageToNpmjsRegistry
```

一旦您将此文件提交并推送至托管项目的 GitHub 仓库中，每当您在该仓库中创建 GitHub 发布 (release) 时，该工作流就会运行。

> 您还可以将工作流配置为在[向仓库推送标签时触发](https://stackoverflow.com/a/61892639)。
> 
{style="tip"}

### 将 GitHub Actions 设置为受信任的发布者

既然已经发布了工作流，您可以使用 GitHub 操作将 [受信任的发布者](https://docs.npmjs.com/trusted-publishers) 添加到您的 npm 软件包中：

1. 打开[已发布软件包](#publish-manually)页面。
2. 打开 **Settings** 选项卡并找到 **Trusted Publisher** 部分。
3. 在 **Select your publisher** 下，点击 **GitHub Actions** 按钮。
4. 填写表单：
   * 您的 GitHub 名称（或组织）
   * 仓库名称
   * 工作流文件名称（在本教程中，我们使用了 [publish.yml](#create-a-github-actions-workflow-file)）。
5. 点击 **Setup connection** 按钮。

![为 GitHub Actions 设置 npm 受信任发布者](npm-trusted-publisher-github.png)

> [npm 不会验证提供的坐标](https://docs.npmjs.com/trusted-publishers#troubleshooting)，因此请务必确保正确输入详情。
> 
{style="warning"}

创建好的连接随后会列在软件包设置的 **Trusted Publishers** 部分，这意味着具有指定坐标的工作流现在已被授权发布到 npm。

### 在 GitHub 上创建版本

完成工作流和受信任发布者连接的设置后，您现在可以通过[创建 GitHub 发布 (release)](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release) 来触发发布：

1. 将 `build.gradle.kts` 配置中的软件包版本设置为您想要发布的版本。

   > 如果版本号已被使用或低于已发布的版本，npm 将不允许发布。
   > 
   > {style="note"}

2. 前往您的 GitHub 仓库。
3. 在右侧侧边栏中，点击 **Releases**。
4. 点击 **Draft a new release** 按钮（如果您以前从未为此仓库创建过发布，则点击 **Create a new release** 按钮）。
5. 创建或选择一个 Git 标签（如果可能，请与模块版本匹配，以保持各系统之间的编号一致）。
6. 设置发布标题（将发布名称设置为与标签相同会很方便）。
   
   为了记录清晰，您可能希望标签中的版本与您在 `build.gradle.kts` 文件中指定的库版本号相同。

   ![在 GitHub 上创建发布](create-release-and-tag-for-npm.png){width=700}

7. 点击 **Publish release** 按钮。

要检查操作是否被触发，请点击 GitHub 仓库页面顶部的 **Actions** 选项卡。
您应该会看到新发布的版本触发了发布工作流的运行。
点击工作流以查看发布任务的日志。

当工作流运行完成时，您软件包的新版本应该会列在 npm 仓库的软件包页面上。

![通过 CI/CD 在 npm 上发布第二个版本](published-second-version-on-npm.png){width=700}

## 下一步

* [在您的 README 中添加 shield.io 徽章](https://shields.io/badges/npm-version)
* [使用 Dokka 生成 API 文档](https://kotl.in/dokka)
* [使用 Renovate 自动化依赖更新](https://docs.renovatebot.com/)
* [在 Kotlin Slack 中向社区分享您的库](https://kotlinlang.slack.com/)
  （如需注册，请访问 https://kotl.in/slack）