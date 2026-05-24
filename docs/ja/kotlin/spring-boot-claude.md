[//]: # (title: Spring Boot と Claude を使用したタスク管理アプリの作成)

<web-summary>Claude と Spring Boot を使用して Kotlin アプリを作成する方法を学びます。</web-summary>

このチュートリアルでは、[Claude](https://claude.com/product/overview) を使用してタスクを管理する Kotlin アプリを作成する方法を学びます。このチュートリアルでは、バックエンドのインフラストラクチャの管理に Spring Boot を使用し、Claude がアプリケーションの計画と開発を行います。

AI の助けを借りずにアプリを作成したい場合は、[Kotlin と Spring Boot で Web アプリを作成する](jvm-get-started-spring-boot.md)チュートリアルに従ってください。

> 他の AI 搭載ツールと同様に、Claude も間違いを犯す可能性があります。Claude による変更を慎重に確認し、信頼できるコードのみに使用してください。
> Claude のセキュリティポリシーの詳細については、[Claude Code ドキュメント](https://code.claude.com/docs/en/security)を参照してください。
> 
{style="note"}

## 環境のセットアップ

> このチュートリアルでは JetBrains AI Assistant を通じて Claude を使用しますが、ターミナルで Claude Code を使用してチュートリアルの手順を進めることもできます。
>
{style="tip"}

1. 最新バージョンの [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) をダウンロードしてインストールします。
2. [JetBrains AI Assistant](https://plugins.jetbrains.com/plugin/22282-jetbrains-ai-assistant) をインストールします。
3. 次のいずれかの方法で Claude Agent を有効にします：
   * [JetBrains AI サブスクリプションを使用する](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-claude-agent-with-jbai-subscription)
   * [API キーを使用する](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-claude-agent-with-api-key)
   * [Anthropic Console を使用する](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-agent-with-provider-specific-method)

## プロジェクトの作成

> [Spring の Web ベースプロジェクトジェネレーター](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin)を使用して Spring Boot プロジェクトを作成することもできます。
>
{style="tip"}

IntelliJ IDEA で新しい Spring Boot プロジェクトを作成します：

1. IntelliJ IDEA で、**File** | **New** | **Project** を選択します。
2. 左側のパネルで、**New Project** | **Spring Boot** を選択します。
3. **New Project** ウィンドウで以下のフィールドとオプションを指定します：

   * **Name**: task-manager-demo
   * **Language**: Kotlin
   * **Type**: Gradle - Kotlin

     > このオプションは、ビルドシステムと DSL を指定します。
     >
     {style="tip"}

   * **Package name**: org.jetbrains.kotlin.taskmanagerdemo
   * **JDK**: jbr-21
   * **Java**: 17

     > これらの Java および JDK バージョンがインストールされていない場合は、ドロップダウンリストからダウンロードできます。
     >
     {style="tip"}

   ![Spring Boot プロジェクトの作成](create-spring-claude-project.png){width=800}

4. すべてのフィールドを指定したことを確認し、**Next** をクリックします。
5. **Spring Boot** フィールドで最新の安定した Spring Boot バージョンを選択します。
6. **Web | Spring Web** 依存関係を選択します。

   ![Spring Boot プロジェクトのセットアップ](spring-claude-dependency.png){width=800}

7. **Create** をクリックしてプロジェクトを生成し、セットアップします。

   IDE が新しいプロジェクトを生成して開きます。プロジェクトの依存関係のダウンロードとインポートには、しばらく時間がかかる場合があります。

## 開発計画の作成

プロジェクト内で以下の操作を行います：

1. ![AI Chat](toolWindowChat@20x20.svg){width=20} **AI Chat** ツールウィンドウを開きます。デフォルトでは、**Chat** モードが選択されています。**Claude Agent** を選択します。

   ![Claude Agent の選択](select-claude-agent.png){width=300}

2. **Mode: Default** ![Operation mode](app-client.expui.general.chevronDownLarge.svg){width=20}{type="joined"} をクリックし、**Mode: Plan Mode** を選択します。
   これで Claude Agent がアクションを実行せずに計画を立てる準備が整いました。

   ![Plan Mode の選択](claude-plan-mode.png){width=400}

   > さまざまな動作モードの詳細については、[操作モードの選択](https://www.jetbrains.com/help/ai-assistant/claude-agent.html#select-operation-mode)を参照してください。
   >
   {style="tip"}

3. Claude にタスク管理アプリの作成を依頼するプロンプトを入力します。含めるべきだと思う詳細を共有してください。例：

   ```text
   I'd like to create a task manager application for managing tasks, such as a grocery list. 
   It should have a basic UI and include categories, due dates, priorities, and status tracking. 

   Use VCS while working. Work step by step and create commits at each stage so I can review the changes afterward.
   ```

   > プロンプトの設計方法に関するガイダンスについては、[Claude Code のベストプラクティス](https://code.claude.com/docs/en/best-practices)を参照してください。
   >
   {style="tip"}

   Claude が既存のプロジェクト構造を調査し、計画を提案します。

4. 続行する前に、計画を注意深く確認してください。修正を加えたい場合は、**No, keep planning** を選択し、追記コメントを共有してください。
5. 続行する準備ができたら、Claude の変更をどの程度制御したいかに応じて、**Yes ...** オプションを選択します。

   ![開発の準備完了](ready-to-code.png){width=600}

   > 各オプションの詳細については、[Claude Code の権限モード](https://code.claude.com/docs/en/best-practices)を参照してください。
   >
   {style="tip"}

6. Claude が **Plan Mode** を終了し、作業を開始します。作業が完了するまで待ちます。

## コミットの確認

アプリを実行する前に、生成された変更を慎重に確認してください：

1. **Git** ツールウィンドウを開き、コミットのリストを表示します。
2. コミットを選択し、各変更ファイルをダブルクリックして、IntelliJ IDEA のサイドバイサイドビューアーで差分を確認します。

![サイドバイサイドビューアー](side-by-side-viewer.png){width=800}

## アプリの実行

変更に納得したら、アプリを実行します：

1. `bootRun` Gradle タスクを実行するか、ターミナルで次のコマンドを入力します：

   ```bash
   ./gradlew bootRun
   ```

2. ブラウザで localhost の URL を開きます。デフォルトは通常次の通りです：

   ```text
   http://localhost:8080
   ```

   Claude が作成した基本的な UI が表示されます。

   ![アプリの実行](run-spring-claude-app.png){width=800}

   > Claude が UI を設計するため、実際の UI はこのチュートリアルのバージョンとは異なる場合があります。
   >
   {style="tip"}

## アプリのテスト

次に、アプリをテストしてみましょう。

### UI を手動でテストする

まず UI の機能をテストします。いくつかの簡単なアクションを試してみてください：

1. タスクを作成し、フォームフィールドをテストします。
2. タスクを編集して、変更が保持されることを確認します。
3. タスクのステータスを変更します。
4. タスクを削除します。
5. タスクのカテゴリを変更します。

これらのアクションのいずれかが機能しない場合は、Claude に問題を調査して修正するよう新しいプロンプトを送信してください。

### ユニットテストの実行

Claude はいくつかのテストも自動的に作成します。次のコマンドを実行して、すべてのテストに合格することを確認してください：

   ```bash
   ./gradlew test
   ```

または、`src/test` ディレクトリでテストを開き、ガターにある実行アイコン ![実行アイコン](app-client.expui.run.run.svg){width=20} をクリックします。テストが成功すると ![テスト成功アイコン](app-client.expui.gutter.runSuccess.svg){width=20} が表示されます。

いずれかのテストが機能しない場合は、Claude に問題を調査して修正するよう新しいプロンプトを送信してください。

## 洗練させる

初期のタスクが完了したので、さらに洗練させることができます。例えば、ユーザーがリスト内で直接タスクを編集できるように UI を改善してみましょう。

次のようなプロンプトを送信できます：

```text
As a next step, allow users to edit tasks inline. For example, let users click on a task title to edit it directly in the list,
and update fields like priority, due date, or status without leaving the current view. 
This change should make the app feel faster and more intuitive to use.
```

以前と同様に、Claude が既存のプロジェクト構造を調査し、計画を提案します。
計画を承認したら、Claude が完了するのを待ち、変更を確認してから、アプリを再実行します。

<img src="make-refinements-claude.gif" alt="Claude で Spring Boot アプリを洗練させる" width="600"/>

おめでとうございます！Claude を使用して、IntelliJ IDEA で直接 Kotlin Spring Boot アプリケーションの計画、構築、テスト、洗練を行いました。

## 次は？

* [](kotlin-ai-skills.md) について学ぶ
* [Junie と Kotlin AI スキル](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration-ai.html)の使用に関するチュートリアルをチェックする