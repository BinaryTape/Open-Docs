[//]: # (title: 使用 Junie 将 Kotlin Multiplatform 项目从 CocoaPods 切换到 SwiftPM 依赖项)
<primary-label ref="Experimental"/>

如果你有一个带有 CocoaPods 依赖项的 KMP 模块，并希望使用 [SwiftPM 导入](multiplatform-spm-import.md) 切换到 Swift 软件包，你可以使用 AI 来提供帮助。
本指南介绍了如何使用 Junie 和 Kotlin AI 技能来简化此过程。

> 虽然本指南使用的是 Junie，但你可以使用任何具备 [Kotlin AI 技能](https://kotlinlang.org/docs/kotlin-ai-skills.html) 的 AI 工具来完成此过程。
> 
{style="tip"}

与所有 AI 工具一样，Junie 可能会出错。
如果你更倾向于手动迁移，请参阅 [将 Kotlin Multiplatform 项目从 CocoaPods 切换到 SwiftPM 依赖项](multiplatform-cocoapods-spm-migration.md)。

## 设置 Junie 命令行界面

在终端中，安装 Junie 命令行界面：

```bash
curl -fsSL https://junie.jetbrains.com/install.sh | bash
```

首次启动 Junie 命令行界面，以使用你的 JetBrains 帐户登录，或使用外部大语言模型：

```bash
junie
```

![Junie CLI 登录提示](cocoapods-spm-junie-login.png){width="500"}

请参阅 Junie 文档以详细了解 [身份验证选项](https://junie.jetbrains.com/docs/junie-cli.html#step-3-authenticate)。

## 安装 AI 技能

在终端中，导航到你的项目目录并安装相应的 Kotlin AI 技能：
<!-- Stable Junie CLI will support extensions soon https://junie.jetbrains.com/docs/junie-cli-extensions.html -->

```shell
npx skills add Kotlin/kotlin-agent-skills
```

> 你需要 5.2.0 或更高版本的 npm 才能使此命令生效。
> 
{style="note"}

在对话框中，选择 `kotlin-tooling-cocoapods-spm-migration` 技能，并选择 Junie 作为安装该技能的代理。
当询问作用域时，选择 `Project` 以将技能的作用域限制在当前项目中。

## 开始迁移

在开始之前，请确保你的项目正在使用版本控制系统，例如 Git。
这很重要，这样你就可以查看相对于初始状态以及每次迭代后的更改。

1. 打开终端并导航到你的项目目录。
2. 输入以下命令以交互模式启动 Junie：

    ```shell
    junie
    ```

3. 输入以下提示词：

    ```text
    Migrate <project-name> from CocoaPods to SwiftPM
    ```
   
Junie 会识别出你安装的技能适用于该任务，并开始迁移过程。

## 检查并测试更改

在项目的 Git 历史记录中检查 Junie 所做的所有更改。
使用 Git 客户端的并排差异查看器可以轻松检查所做的更改。
例如，在 IntelliJ IDEA 中：

![对 CocoaPods 依赖代码所做更改的并排差异视图](cocoapods-spm-junie-diff.png)

成功的迁移会修改：
* 依赖 CocoaPods 的模块中的 `build.gradle.kts` 文件：`cocoapods {}` 代码块应被替换为 `swiftPMDependencies {}` 代码块。
* 包含引用 CocoaPods API 的导入指令的 Kotlin 文件，并将其替换为 SwiftPM API 导入。

测试你的项目是否像以前一样运行。
如果你遇到问题，请检查日志中的错误消息并要求 Junie 解决这些问题。
如果你无法自行解决问题，请在 [Slack](https://kotlinlang.slack.com/archives/C8CFFCVAB) 中寻求支持。

> 要监控配额消耗情况，请在 Junie 的交互模式下运行 `/usage` 命令。
> 
{style="tip"}

## 后续步骤

* 查看这些示例项目，它们在 `main` 分支中使用 CocoaPods，在 `spm-import` 分支中使用 SwiftPM：
    * [Firebase 示例](https://github.com/Kotlin/kmp-with-cocoapods-firebase-sample/)
    * [Compose Multiplatform 示例](https://github.com/Kotlin/kmp-with-cocoapods-compose-sample/)
* 了解关于：
    * [Swift 软件包导出设置](multiplatform-spm-export.md)
    * [将 Swift 软件包作为依赖项添加到 KMP 模块](multiplatform-spm-import.md)
* 探索其他 [Kotlin AI 技能](https://kotlinlang.org/docs/kotlin-ai-skills.html)。