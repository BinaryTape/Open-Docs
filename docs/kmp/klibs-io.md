[//]: # (title: klibs.io，Kotlin 多平台库目录)

[klibs.io](https://klibs.io) 解决了查找在 GitHub 和 Maven Central 上发布的 Kotlin 多平台库的问题。
这些库按受支持的平台进行索引、标记和分类，因此您可以快速筛选搜索结果，并为您的用例选择合适的库。

每个库页面都会渲染项目的 README，并补充额外信息，例如依赖项数量、项目活跃度和许可证。

<a as="button" href="https://klibs.io" mode="classic" icon="arrow-right" icon-position="right">浏览多平台库</a>

## AI 工作流中的 klibs.io {id="klibs-io-in-your-ai-workflow"}

通过提供的 MCP 接口和现成的智能体指令，将 klibs.io 集成到您的 AI 工作流中：

* 该服务背后的团队发布了一项智能体技能 [kmp-libraries-expert](https://github.com/JetBrains/klibs-io/blob/master/skills/README.md)，可帮助您让智能体专注于寻找合适的库。
* 专用的 [klibs.io MCP 服务器](https://github.com/JetBrains/klibs-io/tree/master/integrations/mcp) 可帮助您的智能体直接访问库索引，并使用更细粒度的工具来筛选搜索结果。
* 要为您的智能体设置通用指南，可以将以下部分添加到您的 [AGENTS.md](https://agents.md/) 文件中：

    ```markdown
    ## Kotlin 多平台库选择
    
    在选择或推荐 Kotlin 多平台依赖项时，请使用 klibs.io MCP 服务器 (https://api.klibs.io/mcp) 来访问和筛选多平台库目录。
    
    智能体可以使用该服务器来验证依赖项元数据并评估适用性：
    
    * 受支持的目标，
    * Maven 坐标，
    * 最新版本或最新稳定版本，
    * 许可证，
    * 维护与活跃度信号，
    * 可比的替代方案。
    ```
  
## 另请参阅 {id="see-also"}

有关更多信息，请参阅 [klibs.io 常见问题解答](https://klibs.io/faq)：
* 库是如何索引和排名的，
* 如何确保您的项目被列出，
* 未来的计划。

要报告问题或建议改进，请在 [klibs.io GitHub 仓库](https://github.com/JetBrains/klibs-io/issues) 中提交问题。

如需讨论和支持，请加入 Kotlin 公共 Slack：
[申请邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并加入 [#klibs-io 频道](https://kotlinlang.slack.com/archives/C081AF4JK70)。