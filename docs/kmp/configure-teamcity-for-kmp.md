# 为 Kotlin Multiplatform 应用程序配置 TeamCity

<web-summary>了解如何为 Kotlin Multiplatform (KMP) 配置 TeamCity Cloud 或 On-Premises 项目。本教程使用支持动态 YAML 配置编辑和直观视觉编辑器的 TeamCity 流水线。</web-summary>

本文介绍如何配置 [TeamCity](https://www.jetbrains.com/teamcity/?source=google&medium=cpc&campaign=EMEA_en_DE_TeamCity_Branded&term=jetbrains%20teamcity&content=771411250243&gad_source=1&gad_campaignid=12704027475&gbraid=0AAAAADloJzi5LQxd_2GSPDer8jKk00xHY&gclid=CjwKCAjwyMnNBhBNEiwA-Kcgu9u9Gprgz8eDZs4p-aG14ZSEn3A3JARU_VXxZaEFPMrxGydCbvNJdxoCmToQAvD_BwE) 来构建、测试和部署您的 KMP 应用程序。TeamCity 支持所有主流版本控制系统提供商（GitHub、GitLab、Bitbucket、Azure DevOps、Perforce 等），通过本地和云端代理实现高度可扩展的混合工作流，并包含强大的功能，如用于高可用性的多节点设置、高级用户管理、问题跟踪器集成以及 AI 助手。

[在此处](https://www.jetbrains.com/teamcity/download/)获取您的免费 TeamCity 试用版：选择带有预配置了主要构建工具和 SDK 的 JetBrains 托管代理的 Cloud 版本，或者选择 TeamCity On-Premises 以获得最大控制权和免费的长久 Professional 许可证。

本教程基于 [JetCaster KMP 示例](https://github.com/kotlin-hands-on/jetcaster-kmp-migration/)。

## 创建新项目

每个 TeamCity 工作流都从项目开始。项目拥有诸如构建配置和流水线之类的实体，这些实体运行实际的 CI/CD 例程、存储用于启动云端代理的云配置集、与子对象共享参数等。

> 有关更多信息，请参阅以下 TeamCity 文档文章：
> * [项目管理员指南](https://www.jetbrains.com/help/teamcity/project-administrator-guide.html#Steps%2C+Configurations+and+Projects)
> * [创建和编辑项目](https://www.jetbrains.com/help/teamcity/creating-and-editing-projects.html#Create+New+Projects+in+Kotlin+DSL)
>
{style="tip"}

1. 点击侧边导航栏中的加号按钮开始新项目。
2. 指定项目名称，并根据需要提供描述。
3. 点击 **Create**（创建）后，TeamCity 会要求您选择将执行实际构建任务的对象类型：构建配置或流水线。

   <img src="teamcity-kmp-projectselector.png" width="500" alt="Choose configurations or pipelines"/>

   <deflist type="medium">
   <def title="构建配置">
   支持全套 TeamCity 功能，允许您将配置设置存储为 Kotlin DSL 代码，并提供无与伦比的自定义功能。但是，它可能需要更多的经验和手动设置。

   详细了解：[创建和编辑构建配置](https://www.jetbrains.com/help/teamcity/creating-and-editing-build-configurations.html)。
   </def>
   <def title="流水线">
   提供带有直观设计的视觉编辑器、可编辑的 YAML 配置和易于访问的设置。流水线专为经验较少的用户和更简单的工作流而设计。流水线是在 TeamCity 2025.11 中引入的，目前缺少构建配置中的某些功能。

   详细了解：[创建和编辑流水线](https://www.jetbrains.com/help/teamcity/create-and-edit-pipelines.html)。
   </def>
   </deflist>

   对于本教程，请选择流水线，因为它们更易于配置，并且支持构建和测试我们示例项目所需的所有功能。

4. 选择 **Connect new repository**（连接新仓库）并选择 **GitHub** 以创建指向 GitHub 的永久连接（可供未来项目重用），或者选择 **Any Git URL**（任意 Git URL）以建立指向特定仓库（示例 JetCaster 应用程序或您的个人复刻）的有限连接。

5. TeamCity 验证其可以访问所需的仓库后，将检索有关分支的信息，并要求您指定基本的流水线行为。

   <img src="teamcity-kmp-pipelinesettings.png" width="450" alt="Basic pipeline settings"/>

   保留默认设置，允许流水线跟踪所有仓库分支，使用 `main` 作为默认分支，并每当有更改提交到仓库时自动触发新的运行。

## 添加流水线作业

流水线准备就绪后，TeamCity 将导航到其设置页面。您可以使用左上角的开关在视觉编辑器和代码编辑器之间切换。

<img src="teamcity-kmp-clientarea.png" width="450" alt="Main client area"/>

TeamCity 流水线由作业组成，作业是连续执行的构建步骤的集合。构建步骤是 TeamCity 例程的最小单位，封装了一组特定的操作。

在 TeamCity UI 中，点击作业磁贴以编辑其设置，或者点击作业下方的较暗区域以修改全局流水线设置。

### 通用流水线设置

本教程不需要设置任何全局流水线选项。有关影响流水线内所有作业的设置（如以下内容），请参阅[这篇文章](https://www.jetbrains.com/help/teamcity/pipeline-settings.html)：

* **自动运行流水线** (Auto-run pipelines) —— 允许您配置流水线在远程仓库提交新更改时自动运行（默认启用）、为仓库打开拉取请求时或按设定的计划运行。
* **仓库** (Repository) —— 允许您检出并处理来自不同版本控制系统托管服务提供商的多个仓库。
* **集成** (Integrations) —— 让您连接外部 NPM 和 Docker 注册表。请注意，如果您计划在公共 Docker Hub 镜像中运行构建步骤，除非您的流水线运行频率高到超过了 Docker Hub 对匿名拉取的频率限制，否则无需配置相应的集成。

### 代理设置

构建任务由安装在裸机或云端机器上的构建代理处理。这些机器必须安装了给定构建任务所需的所有工具。例如，此流水线中的作业 2 需要 Android SDK，而作业 3 使用 Xcode 来构建应用程序的 iOS 版本。

* TeamCity Cloud 使用 [配备了各种构建工具](https://www.jetbrains.com/help/teamcity/cloud/jetbrains-hosted-agents.html#Agent+Software) 的 JetBrains 托管代理。对于本教程，您不需要连接任何额外的代理。
* If you're using TeamCity On-Premises, you need to make sure that every job can run on at least one agent. 
  有关更多详情，请参阅本文：[安装并启动 TeamCity 代理](https://www.jetbrains.com/help/teamcity/install-and-start-teamcity-agents.html)。

在本教程中，作业指定了代理要求，以确保它们仅分配给安装了必要工具的代理。

### 运行共享测试

切换到 YAML 流水线编辑器并粘贴以下标记以设置第一个作业：

```yaml
jobs:
  Job1:
    name: Run tests
    steps:
      - type: gradle
        use-gradle-wrapper: true
        name: Gradle test
        jdk-home: '%\env.JDK_17_0%'
        tasks: jvmTest
    files-publication:
      - path: '**/build/reports/tests/**/*'
        share-with-jobs: false
        publish-artifact: true
    allow-reuse: false
```

此作业使用 Java 17 运行 `jvmTest` Gradle 任务。它收集路径匹配 `.../build/reports/tests/...` 的所有文件，将它们分组在 `test-reports` 文件夹下，并将此文件夹作为工件发布。

您还可以启用 **Optimizations | Parallel tests**（优化 | 并行测试）作业选项，将测试套件拆分为较小的批次，在不同的构建代理上处理每个批次。这可以显著缩短总运行时间，但会消耗更多资源。要启用并行测试，请修改流水线 YAML 以包含 `parallelism` 设置，如下所示：

```yaml
    ...
    allow-reuse: false
    parallelism: 3
```

**Allow reuse**（允许重用）优化选项指定在流水线配置或源代码未发生更改的情况下，TeamCity 是否应跳过重新运行任务。

有关更多信息，请参阅[作业设置](https://www.jetbrains.com/help/teamcity/job-settings.html)和 [Gradle 构建步骤](https://www.jetbrains.com/help/teamcity/gradle.html)。

### 构建 Android 调试包

按如下方式修改流水线 YAML：

```yaml
jobs:
  Job1:
    name: Run tests
    ...
    Job2:
      name: Build Android
      steps:
        - type: gradle
          jdk-home: '%\env.JDK_17_0%'
          tasks: ':mobile:assembleDebug'
          use-gradle-wrapper: true
      files-publication:
        - path: mobile/build/outputs/apk/debug/*.apk
          share-with-jobs: false
          publish-artifact: true
      runs-on:
        self-hosted:
          - requirement: exists
            name: Android home
            parameter: env.ANDROID_HOME
      dependencies:
        - Job1
```

* `requirement` 块确保此作业仅分配给安装了 Android SDK 的代理。
* `dependencies` 部分保证此作业仅在 `Job1` 成功完成后开始。

### 构建 iOS 模拟器应用程序

对于最后一步，将以下标记添加到流水线 YAML：

```yaml
jobs:
  Job1:
    ...
  Job2:
    ...
  Job3:
    name: Build iOS
    steps:
      - type: script
        script-content: |-
          xcodebuild build \
            -project JetcasterMigration/JetcasterMigration.xcodeproj \
            -configuration Debug \
            -scheme JetcasterMigration \
            -sdk iphonesimulator \
            -derivedDataPath ./build \
            -verbose
    files-publication:
      - path: build/Build/Products/Debug-iphonesimulator/**/*
        share-with-jobs: false
        publish-artifact: true
    dependencies:
      - Job1
```

与前两个作业不同，**Build iOS** 使用通用的[命令行构建步骤](https://www.jetbrains.com/help/teamcity/command-line.html)，它允许您运行命令或与代理机器上安装的任何工具进行交互。

`dependencies` 部分指定了对 `Job1` 的依赖，这意味着 **Build Android** 和 **Build iOS** 作业都可以并行运行，但仅在 `Job1` 的测试例程完成后才会开始。

> 在处理构建配置时，您可以使用专门的 [Xcode Project 步骤](https://www.jetbrains.com/help/teamcity/xcode-project.html)来替换 Script 构建步骤。
>
{style="tip"}

## 运行流水线

点击右上角的 **Save and Run**（保存并运行）以启动您的工作流。作业完成后，它发布的任何工件都将在构建日志旁边的 **Artifacts**（工件）选项卡中可用。

<img src="teamcity-kmp-artifacts.png" alt="TeamCity artifacts" width="450"/>

`Job1` 还将显示一个 **Tests**（测试）选项卡，允许您检查测试结果。

<img src="teamcity-kmp-tests.png" alt="TeamCity tests" width="450"/>

## 后续步骤

您可以继续修改此示例以获得更多收益：

* **使用版本控制系统连接添加流水线**
 
  在[向项目添加新流水线](#create-a-new-project)时，选择 **GitHub** 而不是 **Any Git URL**。这种方法不仅允许您在未来的 GitHub 项目中跳过配置版本控制系统访问，还可以解锁额外的流水线功能：

    * TeamCity 可以直接向 GitHub [发布运行状态](https://www.jetbrains.com/help/teamcity/create-and-edit-pipelines.html#Publish+Run+Statuses+to+VCS)（成功、失败或运行中）。
    * [**On new changes**（有新更改时）触发器](https://www.jetbrains.com/help/teamcity/pipeline-settings.html#On+New+Changes)和[**Repository**（仓库）条目](https://www.jetbrains.com/help/teamcity/pipeline-settings.html#Repository)将包含一个 **Pull requests**（拉取请求）开关，允许您跟踪并构建尚未提交到稳定分支的更改。

* **探索高级构建配置**

  从流水线切换到[构建配置](https://www.jetbrains.com/help/teamcity/configuring-general-settings.html)以访问高级功能：

    * 使用[构建链](https://www.jetbrains.com/help/teamcity/build-chain.html)和[复合配置](https://www.jetbrains.com/help/teamcity/composite-build-configuration.html)来运行特定的工作流部分。例如，运行 **Test &rarr; Build iOS** 而不触发 **Build Android**，或者单独运行测试配置。
    * 享受全套 JetBrains 精心打造的构建步骤、社区配方以及未绑定的步骤，如 [GitHub releases](https://blog.jetbrains.com/teamcity/2025/09/teamcity-github-releases-plugin/)。
    * 将您的[代理部署在 Kubernetes 集群中](https://www.jetbrains.com/help/teamcity/setting-up-teamcity-for-kubernetes.html)，或者将其用作[外部执行器](https://www.jetbrains.com/help/teamcity/kubernetes-executor.html)。
    * 设置与[问题跟踪器](https://www.jetbrains.com/help/teamcity/integrating-teamcity-with-issue-tracker.html)和[机密库](https://www.jetbrains.com/help/teamcity/hashicorp-vault.html)的集成。