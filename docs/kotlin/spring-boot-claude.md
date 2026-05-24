[//]: # (title: 使用 Spring Boot 和 Claude 创建任务管理器应用)

<web-summary>了解如何使用 Claude 和 Spring Boot 创建 Kotlin 应用。</web-summary>

在本教程中，您将学习如何使用 [Claude](https://claude.com/product/overview) 创建一个用于管理任务的 Kotlin 应用。本教程使用 Spring Boot 来管理后端基础架构，而 Claude 则负责规划和开发应用程序。

如果您更愿意在没有 AI 帮助的情况下创建应用，可以参考我们的[使用 Kotlin 和 Spring Boot 创建 Web 应用](jvm-get-started-spring-boot.md)教程。

> 与任何 AI 驱动的工具一样，Claude 可能会犯错。请仔细审查 Claude 的更改，并且仅在您信任的代码中使用它。
> 有关 Claude 安全政策的更多信息，请参阅 [Claude Code 文档](https://code.claude.com/docs/en/security)。
> 
{style="note"}

## 设置环境

> 本教程通过 JetBrains AI Assistant 使用 Claude，但您也可以在终端中使用 Claude Code 完成本教程的步骤。
>
{style="tip"}

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)。
2. 安装 [JetBrains AI Assistant](https://plugins.jetbrains.com/plugin/22282-jetbrains-ai-assistant) 插件。
3. 通过以下方式之一激活 Claude Agent：
   * [使用 JetBrains AI 订阅](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-claude-agent-with-jbai-subscription)
   * [使用 API 密钥](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-claude-agent-with-api-key)
   * [使用 Anthropic 控制台](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-agent-with-provider-specific-method)

## 创建项目

> 您也可以使用 [Spring 的基于 Web 的项目生成器](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin)来创建一个 Spring Boot 项目。
>
{style="tip"}

在 IntelliJ IDEA 中创建一个新的 Spring Boot 项目：

1. 在 IntelliJ IDEA 中，选择 **File**（文件） | **New**（新建） | **Project**（项目）。
2. 在左侧面板中，选择 **New Project**（新建项目） | **Spring Boot**。
3. 在 **New Project** 窗口中指定以下字段和选项：

   * **Name**（名称）：task-manager-demo
   * **Language**（语言）：Kotlin
   * **Type**（类型）：Gradle - Kotlin

     > 此选项指定了构建系统和 DSL。
     >
     {style="tip"}

   * **Package name**（软件包名称）：org.jetbrains.kotlin.taskmanagerdemo
   * **JDK**：jbr-21
   * **Java**：17

     > 如果您没有安装这些 Java 和 JDK 版本，可以从下拉列表中下载它们。
     >
     {style="tip"}

   ![创建 Spring Boot 项目](create-spring-claude-project.png){width=800}

4. 确保您已填写所有字段，然后点击 **Next**（下一步）。
5. 在 **Spring Boot** 字段中选择最新的稳定 Spring Boot 版本。
6. 选择 **Web | Spring Web** 依赖项。

   ![设置 Spring Boot 项目](spring-claude-dependency.png){width=800}

7. 点击 **Create**（创建）以生成并设置项目。

   IDE 将生成并打开新项目。下载和导入项目依赖项可能需要一些时间。

## 创建开发方案

在您的项目中：

1. 打开 ![AI Chat](toolWindowChat@20x20.svg){width=20} **AI Chat** 工具窗口。默认情况下会选中 **Chat** 模式。请选择 **Claude Agent**。

   ![选择 Claude Agent](select-claude-agent.png){width=300}

2. 点击 **Mode: Default**（模式：默认） ![操作模式](app-client.expui.general.chevronDownLarge.svg){width=20}{type="joined"} 并选择 **Mode: Plan Mode**（模式：规划模式）。
   Claude Agent 现在已准备好进行规划而不执行操作。

   ![选择规划模式](claude-plan-mode.png){width=400}

   > 有关不同操作模式的更多信息，请参阅[选择操作模式](https://www.jetbrains.com/help/ai-assistant/claude-agent.html#select-operation-mode)。
   >
   {style="tip"}

3. 编写一段提示词，要求 Claude 创建一个任务管理器应用。分享一些您认为应该包含的详细信息。例如：

   ```text
   I'd like to create a task manager application for managing tasks, such as a grocery list. 
   It should have a basic UI and include categories, due dates, priorities, and status tracking. 

   Use VCS while working. Work step by step and create commits at each stage so I can review the changes afterward.
   ```

   > 有关如何设计提示词的指导，请参阅 [Claude Code 最佳做法](https://code.claude.com/docs/en/best-practices)。
   >
   {style="tip"}

   Claude 会探索现有的项目结构并提出一个方案。

4. 在继续之前仔细审查该方案。如果您想进行一些修改，请选择 **No, keep planning**（不，继续规划）并分享您的后续意见。
5. 当您准备好继续时，请根据您希望对 Claude 的更改拥有多少控制权，选择相应的 **Yes ...**（是 ...）选项。

   ![准备编码](ready-to-code.png){width=600}

   > 有关不同选项的更多信息，请参阅 [Claude Code 权限模式](https://code.claude.com/docs/en/best-practices)。
   >
   {style="tip"}

6. Claude 将退出 **规划模式** 并开始工作。等待工作完成。

## 审查提交

在运行应用之前，请仔细审查生成的更改：

1. 打开 **Git** 工具窗口以查看提交列表。
2. 选择一个提交并双击每个修改过的文件，在 IntelliJ IDEA 的并排查看器中审查差异。

![并排查看器](side-by-side-viewer.png){width=800}

## 运行应用

当您对更改感到满意后，运行应用：

1. 运行 `bootRun` Gradle 任务或在终端中输入以下命令：

   ```bash
   ./gradlew bootRun
   ```

2. 在浏览器中打开本地主机 URL。默认通常为：

   ```text
   http://localhost:8080
   ```

   您现在应该能看到 Claude 创建的基础 UI。

   ![运行应用](run-spring-claude-app.png){width=800}

   > 由于 UI 是由 Claude 设计的，您的 UI 可能与本教程中的版本有所不同。
   >
   {style="tip"}

## 测试应用

现在是您测试应用的时候了。

### 手动测试 UI

首先测试 UI 功能。尝试一些简单的操作：

1. 创建一个任务并测试表单字段。
2. 编辑一个任务以检查更改是否已持久化。
3. 更改任务的状态。
4. 删除一个任务。
5. 更改任务的类别。

如果其中任何操作无法正常工作，请向 Claude 发送新的提示词，要求其调查并修复问题。

### 运行单元测试

Claude 还会自动创建一些测试。通过运行以下命令检查所有测试是否通过：

   ```bash
   ./gradlew test
   ```

或者，在 `src/test` 目录中，打开一个测试并点击装订区域中的运行图标 ![运行图标](app-client.expui.run.run.svg){width=20}。成功的测试会显示 ![运行成功图标](app-client.expui.gutter.runSuccess.svg){width=20}。

如果任何测试失败，请向 Claude 发送新的提示词，要求其调查并修复问题。

## 进行优化

既然初始任务已经完成，您可以进行进一步优化。例如，让我们改进 UI，以便用户可以直接在列表中编辑任务。

您可以发送如下提示词：

```text
As a next step, allow users to edit tasks inline. For example, let users click on a task title to edit it directly in the list,
and update fields like priority, due date, or status without leaving the current view. 
This change should make the app feel faster and more intuitive to use.
```

就像之前一样，Claude 会探索现有的项目结构并提出方案。
在您接受方案后，等待 Claude 完成工作，审查更改，然后再次运行应用。

<img src="make-refinements-claude.gif" alt="使用 Claude 优化您的 Spring Boot 应用" width="600"/>

恭喜！您已成功在 IntelliJ IDEA 中直接使用 Claude 来规划、构建、测试并优化了一个 Kotlin Spring Boot 应用程序。

## 下一步

* 了解 [](kotlin-ai-skills.md)
* 查看我们关于[配合 Kotlin AI 技能使用 Junie](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration-ai.html) 的教程