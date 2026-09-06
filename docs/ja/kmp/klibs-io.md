[//]: # (title: klibs.io：Kotlin マルチプラットフォームライブラリカタログ)

[klibs.io](https://klibs.io) は、GitHub や Maven Central で公開されている Kotlin マルチプラットフォームライブラリを見つける際の課題を解決します。
ライブラリはインデックス化、タグ付けされ、サポートされているプラットフォームごとにカテゴリ分けされているため、検索結果を素早く絞り込み、ユースケースに適したライブラリを選択できます。

各ライブラリのページにはプロジェクトの README が表示され、依存プロジェクト数、プロジェクトの活動状況、ライセンスなどの追加情報が付加されています。

<a as="button" href="https://klibs.io" mode="classic" icon="arrow-right" icon-position="right">マルチプラットフォームライブラリを閲覧する</a>

## AI ワークフローにおける klibs.io

提供されている MCP インターフェースと準備済みのエージェント指示文を使用して、klibs.io を AI ワークフローに統合できます。

* サービスを提供しているチームは、エージェントが適切なライブラリを見つけるのを支援するエージェントスキル [kmp-libraries-expert](https://github.com/JetBrains/klibs-io/blob/master/skills/README.md) を公開しています。
* 専用の [klibs.io MCP サーバー](https://github.com/JetBrains/klibs-io/tree/master/integrations/mcp) を使用すると、エージェントがライブラリのインデックスに直接アクセスし、よりきめ細かなツールを使用して検索結果を絞り込むことができます。
* エージェントの一般的なガイドラインを設定するには、[AGENTS.md](https://agents.md/) ファイルに以下のセクションを追加してください。

    ```markdown
    ## Kotlin Multiplatform library selection
    
    When choosing or recommending Kotlin Multiplatform dependencies,
    use the klibs.io MCP server (https://api.klibs.io/mcp)
    to access and filter a catalog of multiplatform libraries.
    
    The agent can use the server to verify dependency metadata and gauge suitability:
    
    * supported targets,
    * Maven coordinates,
    * latest versions or latest stable versions,
    * license,
    * maintenance and activity signals,
    * comparable alternatives.
    ```
  
## 関連項目

詳細については、[klibs.io FAQ](https://klibs.io/faq) を参照してください。
* ライブラリがどのようにインデックス化され、ランク付けされるか
* 自分のプロジェクトが確実に掲載されるようにする方法
* 将来の計画について

問題の報告や改善の提案については、[klibs.io の GitHub リポジトリ](https://github.com/JetBrains/klibs-io/issues) の Issue を使用してください。

議論やサポートについては、Kotlin パブリック Slack に参加してください。
[招待をリクエスト](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) して [#klibs-io チャンネル](https://kotlinlang.slack.com/archives/C081AF4JK70) に参加してください。