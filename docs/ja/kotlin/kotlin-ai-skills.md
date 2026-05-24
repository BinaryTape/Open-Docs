[//]: # (title: Kotlin AI スキル)
[//]: # (description: Kotlin AI スキルとは何か、AI エージェントをどのように支援するのか、利用可能なスキルをどこで見つけることができるかを学びます。)

Kotlin AI スキルは、AI エージェントが Kotlin 特有のタスクをより確実に実行できるように支援する、再利用可能な指示（インストラクション）です。

スキルは、AI エージェントがタスクの実行を開始する前に必要なコンテキストを提供します。
例えば、スキルは関連する API を示したり、前提条件を定義したり、ステップバイステップのワークフロー・ガイダンスを提供したりすることができます。

Kotlin AI スキルは、エージェントがより正確な結果を生成するのを助け、ユーザー自身がタスクを説明するのに費やす時間を短縮します。
チームにとって、スキルは共通タスクのための共有フレームワークも提供するため、全員が一致した結果を得ることができます。

<a href="https://github.com/Kotlin/kotlin-agent-skills"><img src="kotlin-ai-skills.svg" alt="Kotlin AI スキルを探索する" type="block"/></a>

Kotlin AI スキルは [Agent Skills 標準](https://agentskills.io/home)に従っているため、[Junie](https://www.jetbrains.com/junie/)、Claude Code、OpenAI Codex、Google Gemini、GitHub Copilot などの互換性のある AI エージェントで使用できます。

## サポートされているワークフロー

Kotlin AI スキルは、さまざまな Kotlin 特有のシナリオで使用できます。
以下の例は、AI スキルが役立つタスクの一部を示しています。

### Java ソースファイルを Kotlin に変換する

振る舞いを維持し、Kotlin 特有の慣習を適用しながら、Java ソースファイルを慣用的な (idiomatic) Kotlin に変換したい場合は、[kotlin-tooling-java-to-kotlin](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-java-to-kotlin) スキルを使用してください。

このシナリオの詳細は、[](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin) を参照してください。

### Android アプリを含むマルチプラットフォームプロジェクトを AGP 9 を使用するように移行する

Kotlin Multiplatform プロジェクトを AGP 9 に移行する必要があり、AI エージェントに必要なプロジェクトおよび Gradle 設定の変更を適用させたい場合は、[kotlin-tooling-agp9-migration](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-agp9-migration) スキルを使用してください。

このシナリオの詳細は、[Android アプリを含むマルチプラットフォームプロジェクトを AGP 9 を使用するように更新する](https://kotlinlang.org/docs/multiplatform/multiplatform-project-agp-9-migration.html)を参照してください。

### マルチプラットフォームプロジェクトを CocoaPods から SwiftPM 依存関係に移行する

Kotlin Multiplatform プロジェクトで iOS 統合に CocoaPods を使用しており、AI エージェントにセットアップを SwiftPM に移行させたい場合は、[kotlin-tooling-cocoapods-spm-migration](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-cocoapods-spm-migration) を使用してください。

このシナリオの詳細は、[マルチプラットフォームプロジェクトを CocoaPods から SwiftPM 依存関係に移行する](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration-ai.html)を参照してください。

## サポートを受ける

質問がある場合や問題が発生した場合は、![Slack](slack.svg){width=25}{type="joined"} Slack で助けを求めてください。[招待を受け取り](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)、`#ai` チャンネルであなたの経験を共有してください。