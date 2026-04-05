[//]: # (title: ライブラリをnpmに公開する – チュートリアル)

<tldr>
<p><a href="https://npm-publish.petuska.dev/latest/">npm-publish Gradleプラグイン</a>を使用して、手動またはGitHub ActionsでKotlinマルチプラットフォームライブラリをnpmに公開します。</p>
</tldr>

ライブラリを公開するには、以下の準備が必要です：

1. [npmのアカウント](https://docs.npmjs.com/creating-a-new-npm-user-account)と[アクセストークン](https://docs.npmjs.com/creating-and-viewing-access-tokens)を含む、認証情報を準備する。
2. Kotlinマルチプラットフォームプロジェクトで公開用プラグインを設定する。
3. 公開用プラグインに認証情報を提供するか、継続的インテグレーション（CI）用に信頼されたパブリッシャー（Trusted Publisher）を設定する。
4. 手動またはCIを使用して、公開タスクを実行する。

このチュートリアルでは、プロジェクトのホストにGitHubを使用し、GitHub Actions経由でCIを実行します。

## サンプルライブラリ

[サンプルライブラリプロジェクト](https://github.com/Kotlin/kotlin-multiplatform-web-library)を使用して、
実際に動作する設定を確認しながら進めることができます。

コードを再利用する場合は、必ず**すべての例の値を、ご自身のプロジェクト固有の値に置き換えてください**。

## アカウントと認証情報の準備

npmに公開するには、[npmポータルにサインイン](https://www.npmjs.com/login)している必要があります。

このチュートリアルでは、手動公開の設定を行うために「組織（Organization）」と「アクセストークン」が必要になります。

### シンプルな組織の作成

このチュートリアルでは、名前の競合を避けるために、npmの組織（Organization）の下でライブラリを公開します。

新しい組織を作成するには、[npmのドキュメント](https://docs.npmjs.com/creating-an-organization)に従ってください。

### アクセストークンの生成

手動でnpmに公開するには、新しく作成した組織の下でパッケージを公開することを許可するアクセストークンが必要です。
トークンを生成するには、[npmのガイド](https://docs.npmjs.com/creating-and-viewing-access-tokens)に従ってください。

このチュートリアルでは、簡略化されたセキュリティ設定を使用します：
* **Bypass two-factor authentication (2FA)** オプションを有効にします。
* トークンの一般権限と組織権限の両方を **Read and write** に設定します。

## ライブラリプロジェクトの設定

[サンプルプロジェクト](https://github.com/Kotlin/kotlin-multiplatform-web-library)を使用する場合は、
公開前にデフォルトの名前を更新してください。
これには以下が含まれます：

* ライブラリモジュールの名前。
* `settings.gradle.kts` ファイルで設定されているプロジェクト名。

名前の設定が完了したら、次の手順に従って公開の設定を行います。

### 公開用プラグインのセットアップ

このチュートリアルでは、npmへの公開を支援する公式の [npm-publish プラグイン](https://github.com/Kotlin/npm-publish) を使用します。
プラグインの詳細や利用可能な設定オプションについては、[プラグインのドキュメント](https://npm-publish.petuska.dev)を参照してください。

Kotlinマルチプラットフォームプロジェクトにプラグインを追加します：

1. ライブラリモジュールの `build.gradle.kts` ファイルを開きます。

2. `plugins {}` ブロックに以下の行を追加します：

    ```kotlin
    // <module directory>/build.gradle.kts
    
    plugins {
        kotlin("npm-publish") version "%npmPublishPlugin%"
    }
    ```
    
    > プラグインの最新バージョンについては、[Releases](https://github.com/Kotlin/npm-publish/releases) ページを確認してください。
    > 
    {style="note"}

3. 以下の設定を追加します。
   ご自身のライブラリに合わせて値をカスタマイズしてください。
   必須のパラメータは `organization`、`authToken`、`packageName`、`version` のみです。
   その他は拡張例として示しています：

    ```kotlin
    // <module directory>/build.gradle.kts
    npmPublish {
        organization = "organization_name_without_the_@_sign"
        
        registries {
            npmjs {
                // パッケージを公開するコマンドを実行する際、
                // この環境変数としてnpmトークンを渡します
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

    > これを設定するために、[Gradle プロパティ](https://docs.gradle.org/current/userguide/build_environment.html)を使用することもできます。
    > 
    {style="tip"}

`npmPublish {}` ブロック内の重要な設定は以下の通りです：

* `organization` パラメータと `registries {}` ブロックは認証の詳細を指定します。
  このケースでは、メインのnpmレジストリを使用し、公開タスク実行時にトークンを保持すべき環境変数 `NPM_TOKEN` の名前を指定しています。
* `packageName` と `version` パラメータは必須のパッケージオプションを定義します：
  * `version` パラメータを省略すると、モジュールのバージョンがデフォルト値として使用されます。
  * `packageName` パラメータを省略すると、モジュールの名前がデフォルト値として使用されます。
* `packageJson {}` ブロックは様々なメタデータを保持します。

## 手動で公開する

手動での公開は、プロジェクトの構造をまだ試行錯誤している段階や、
公開の自動化を独自に実装したい場合に役立ちます。

これで、ローカルマシンからnpmにライブラリを公開できるようになりました。
公開するには、以下のコマンドを実行します。`YOUR_ACCESS_TOKEN` の部分には、先ほど生成したアクセストークンを貼り付けてください：

```bash
NPM_TOKEN=YOUR_ACCESS_TOKEN ./gradlew :shared:publishJsPackageToNpmjsRegistry
```

ライブラリが公開されると、npmレジストリで確認できるようになります。
npmの組織ページを開き、**Packages** タブを確認してください
（個人の **Packages** ページではないことに注意してください）。

![npmに公開されたライブラリ](published-on-npm.png){width=700}

### トラブルシューティング

手動公開でよく起こる問題がいくつかあります：

* `build.gradle.kts` 設定内の `version` フィールドに注意してください：
  同じバージョン、またはそれ以前のバージョンですでにパッケージが公開されている場合、npmは公開に失敗します。
* 組織スコープのパッケージ用にトークンを生成する際は、
  必ず一般権限（general permissions）**および**組織権限（organization permissions）の両方を設定してください。

## 継続的インテグレーション（CI）を使用して公開する

npmの信頼されたパブリッシャー（Trusted Publishers）という仕組みを利用すると、OpenID Connectを使用してCIを迅速にセットアップできます。
この方法では、トークンの生成や管理を一切行う必要がありません。

この例では、[GitHub Actions](https://docs.github.com/en/actions) を使用したワークフローをセットアップします。

### GitHub Actions ワークフローファイルの作成

GitHub Actionを設定する `.github/workflows/publish.yml` ファイルを作成します：

```yaml
# .github/workflows/publish.yml

name: Publish

on:
  release:
    types: [released, prereleased]

permissions:
  id-token: write  # GitHub Actionsがnpmの信頼されたパブリッシャーと
                   # 統合するために必要
  contents: read

jobs:
  publish:
    name: Release build and publish
    runs-on: ubuntu-latest
    steps:
      # トリガーとなったブランチをチェックアウト
      - name: Check out code
        uses: actions/checkout@v4

      # Gradleタスクを実行するためのJDKをセットアップ
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: 21

      # ライブラリモジュールの公開用Gradleタスクを実行
      - name: Publish to npm
        run: ./gradlew :shared:publishJsPackageToNpmjsRegistry
```

このファイルをプロジェクトをホストしているGitHubリポジトリにコミットしてプッシュすると、
そのリポジトリでGitHubリリースを作成するたびにワークフローが実行されます。

> ワークフローを[タグがプッシュされたときにトリガー](https://stackoverflow.com/a/61892639)するように設定することもできます。
> 
{style="tip"}

### GitHub Actionsを信頼されたパブリッシャーとして設定する

ワークフローを公開したら、GitHub Actionを使用してnpmパッケージに[信頼されたパブリッシャー（Trusted Publisher）](https://docs.npmjs.com/trusted-publishers)を追加できます：

1. [手動で公開](#publish-manually)したパッケージのページを開きます。
2. **Settings** タブを開き、**Trusted Publisher** セクションを見つけます。
3. **Select your publisher** の下にある **GitHub Actions** ボタンをクリックします。
4. フォームに入力します：
   * GitHub名（または組織名）
   * リポジトリ名
   * ワークフローファイルの名前（このチュートリアルでは [publish.yml](#create-a-github-actions-workflow-file) を使用しました）。
5. **Setup connection** ボタンをクリックします。

![GitHub Actions用のnpm Trusted Publisher設定](npm-trusted-publisher-github.png)

> [npmは提供された座標を検証しません](https://docs.npmjs.com/trusted-publishers#troubleshooting)。
> そのため、詳細を正しく入力したか必ず確認してください。
> 
{style="warning"}

作成された接続はパッケージ設定の **Trusted Publishers** セクションに表示されます。
これは、指定された座標を持つワークフローがnpmへの公開を許可されたことを意味します。

### GitHubでリリースを作成する

ワークフローと信頼されたパブリッシャーの接続が設定されたので、[GitHubリリースを作成](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)することで公開をトリガーする準備が整いました：

1. `build.gradle.kts` 設定のパッケージバージョンを、公開したいバージョンに設定します。

   > すでに使用されているバージョン番号、またはすでに公開されているバージョンより低い番号の場合、npmは公開を許可しません。
   > 
   > {style="note"}

2. GitHubリポジトリに移動します。
3. 右側のサイドバーで **Releases** をクリックします。
4. **Draft a new release** ボタン（このリポジトリでまだリリースを作成したことがない場合は **Create a new release** ボタン）をクリックします。
5. Gitタグを作成または選択します（システム間で番号を一致させるため、可能であればモジュールのバージョンと一致させてください）。
6. リリースのタイトルを設定します（タグと同じ名前にすると便利です）。
   
   すべてを把握しやすくするために、タグのバージョンを `build.gradle.kts` ファイルで指定したライブラリのバージョン番号と同じにすることをお勧めします。

   ![GitHubでリリースを作成する](create-release-and-tag-for-npm.png){width=700}

7. **Publish release** ボタンをクリックします。

Actionがトリガーされたかどうかを確認するには、GitHubリポジトリのページ上部にある **Actions** タブをクリックします。
新しく公開されたリリースによって、公開ワークフローの実行がトリガーされていることが確認できるはずです。
ワークフローをクリックして、公開タスクのログを確認します。

ワークフローの実行が完了すると、npmレジストリのパッケージページに新しいバージョンのパッケージが表示されます。

![CI/CDからnpmに公開されたライブラリの2番目のバージョン](published-second-version-on-npm.png){width=700}

## 次のステップ

* [READMEにshields.ioバッジを追加する](https://shields.io/badges/npm-version)
* [Dokkaを使用してAPIドキュメントを生成する](https://kotl.in/dokka)
* [Renovateを使用して依存関係の更新を自動化する](https://docs.renovatebot.com/)
* [Kotlin Slackでコミュニティとライブラリを共有する](https://kotlinlang.slack.com/)
  （登録は https://kotl.in/slack から）