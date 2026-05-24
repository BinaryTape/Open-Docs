[//]: # (title: Junie を使用して Kotlin Multiplatform プロジェクトを CocoaPods から SwiftPM 依存関係に切り替える)
<primary-label ref="Experimental"/>

CocoaPods 依存関係を持つ KMP モジュールがあり、[SwiftPM インポート](multiplatform-spm-import.md)を使用して Swift パッケージに切り替えたい場合は、AI を活用できます。
このガイドでは、Junie と Kotlin AI skills を使用して、このプロセスを容易にする方法を説明します。

> このガイドでは Junie を使用していますが、[Kotlin AI skills](https://kotlinlang.org/docs/kotlin-ai-skills.html) を備えた任意の AI ツールを使用してプロセスを完了できます。
> 
{style="tip"}

すべての AI ツールと同様に、Junie も間違いを犯す可能性があります。
手動で移行したい場合は、[Kotlin Multiplatform プロジェクトを CocoaPods から SwiftPM 依存関係に切り替える](multiplatform-cocoapods-spm-migration.md)を参照してください。

## Junie CLI のセットアップ

ターミナルで、Junie CLI をインストールします。

```bash
curl -fsSL https://junie.jetbrains.com/install.sh | bash
```

JetBrains アカウントでログインするか、外部 LLM を使用するために、初めて Junie CLI を起動します。

```bash
junie
```

![Junie CLI login prompt](cocoapods-spm-junie-login.png){width="500"}

[認証オプション](https://junie.jetbrains.com/docs/junie-cli.html#step-3-authenticate)の詳細については、Junie のドキュメントを参照してください。

## AI スキルのインストール

ターミナルでプロジェクトディレクトリに移動し、対応する Kotlin AI スキルをインストールします。
<!-- Stable Junie CLI will support extensions soon https://junie.jetbrains.com/docs/junie-cli-extensions.html -->

```shell
npx skills add Kotlin/kotlin-agent-skills
```

> このコマンドを実行するには、5.2.0 以降の npm が必要です。
> 
{style="note"}

ダイアログで、`kotlin-tooling-cocoapods-spm-migration` スキルと、それをインストールするエージェントとして Junie を選択します。
スコープを尋ねられたら、スキルの範囲を現在のプロジェクトに限定するために `Project` を選択します。

## 移行の開始

開始する前に、プロジェクトが Git などの VCS を使用していることを確認してください。
これは、初期状態から各イテレーション後の変更を確認するために重要です。

1. ターミナルを開き、プロジェクトディレクトリに移動します。
2. 次のコマンドを入力して、対話モードで Junie を起動します。

    ```shell
    junie
    ```

3. 次のプロンプトを入力します。

    ```text
    Migrate <project-name> from CocoaPods to SwiftPM
    ```
   
Junie は、インストールしたスキルがそのタスクに適していることを認識し、移行プロセスを開始します。

## 変更の確認とテスト

プロジェクトの Git 履歴で、Junie によって行われたすべての変更を確認します。
Git クライアントのサイドバイサイド（左右比較）差分ビューアーを使用して、行われた変更を簡単に確認してください。
たとえば、IntelliJ IDEA では以下のようになります。

![Side-by-side diff of changes made to the CocoaPods-dependent code](cocoapods-spm-junie-diff.png)

移行が成功すると、以下が変更されます。
* CocoaPods に依存するモジュールの `build.gradle.kts` ファイル：`cocoapods {}` ブロックが `swiftPMDependencies {}` ブロックに置き換えられます。
* CocoaPods API を参照するインポート文（import directives）を含む Kotlin ファイル：それらが SwiftPM API のインポートに置き換えられます。

プロジェクトが以前と同じように動作するかテストします。
問題が発生した場合は、ログのエラーメッセージを確認し、Junie に解決を依頼してください。
自分自身で問題を解決できない場合は、[Slack](https://kotlinlang.slack.com/archives/C8CFFCVAB) でサポートを求めてください。

> クォータの消費量を確認するには、Junie の対話モードで `/usage` コマンドを実行します。
> 
{style="tip"}

## 次のステップ

* `main` ブランチで CocoaPods を使用し、`spm-import` ブランチで SwiftPM を使用しているこれらのサンプルプロジェクトを確認してください。
    * [Firebase サンプル](https://github.com/Kotlin/kmp-with-cocoapods-firebase-sample/)
    * [Compose Multiplatform サンプル](https://github.com/Kotlin/kmp-with-cocoapods-compose-sample/)
* 以下について学ぶ：
    * [Swift パッケージのエクスポート設定](multiplatform-spm-export.md)
    * [KMP モジュールへの依存関係としての Swift パッケージの追加](multiplatform-spm-import.md)
* その他の [Kotlin AI skills](https://kotlinlang.org/docs/kotlin-ai-skills.html) を探索する。