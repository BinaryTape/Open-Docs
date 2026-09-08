[//]: # (title: Kotlin Multiplatformプロジェクト向けiOSデリバリーパイプラインの設定)

このチュートリアルでは、iOSターゲットを持つKotlin Multiplatformプロジェクト向けにTeamCity Cloudをセットアップする方法を学びます。
ホストされたmacOSエージェント上でiOSアプリをビルドおよびテストするCIパイプラインを作成し、Apple署名資格情報を設定し、ビルドをTestFlightにアップロードし、GitHubリポジトリへのプッシュごとに新しいビルドを開始するプロセスを自動化します。

[Kotlin Multiplatform IDEプラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)を使用すると、プロジェクトのTeamCity Cloudへの接続からiOSアプリケーションの公開まで、セットアップ全体をIDEから直接進めることができます。

このワークフローにより、TeamCity Cloudは以下の機能を提供します：

* ホストされたmacOSエージェントを提供するため、自分でMacを用意する必要がありません。
* 必要なパイプライン構成を自動的に生成します。
* ビルドに署名し、[TestFlight](https://developer.apple.com/testflight/)に公開します。
* 月間のビルド時間とストレージの許容量が含まれる無料のスターティングティアを提供します。

## TeamCityパイプラインの作成 {id="create-the-teamcity-pipeline"}

### IDEからCIセットアップを開始する {id="start-ci-setup-from-the-ide"}

1. プロジェクトの変更をコミットしてプッシュします。CIがまだ構成されていない場合、Kotlin Multiplatform IDEプラグインはCIセットアップの開始を促すツールチップを表示します。
2. **Configure CI** をクリックします。
   ![Configure CIツールチップは変更をプッシュした後に表示されます](ios-pipeline-Configure-CI.png){width=450 style="block"}
   プラグインは、ホストされたmacOSエージェント上でiOSアプリをビルドおよびテストするために必要なファイルを生成します。これらのファイルはローカルプロジェクトに追加されますが、まだコミットされません。
3. TeamCityプラグインがインストールされていない場合、IDEはインストールを促します。
   **Install TeamCity plugin** をクリックし、セットアップフローに戻ります。
   ![CI/CDセットアップのためにプラグインをインストールする](ios-pipeline-install-plugin.png){width=700 style="block"}

    > [TeamCity](https://plugins.jetbrains.com/plugin/25142)プラグインは、JetBrains Marketplaceから直接インストールすることもできます。
    >
    {style="note"}

4. IDEに **Pipeline is ready** と表示されたら、初期のパイプライン構成は完了です。
   **Continue** をクリックし、プロンプトが表示されたら、IDEが生成されたファイルをGitに追加することを許可します。これらのファイルは、リポジトリにコミットするまでローカルに残ります。

### TeamCity Cloudワークスペースの作成または接続 {id="create-or-connect-a-teamcity-cloud-workspace"}

TeamCityでホストされたmacOSエージェント上でビルドを実行するには、Cloudワークスペースが必要です。

1. TeamCity Cloudの利用規約を確認し、同意します。
2. **Create free account** をクリックして、TeamCity Cloudアカウントを作成します。

    > TeamCity CloudはJetBrainsによってホストされており、無料のスターティングティアを提供しています。
    > 無料ティアには月間のビルド時間とストレージの許容量が含まれており、コストをかけずにこのパイプラインを開始してテストするのに十分です。
    > CI/CDのニーズが高まった場合は、いつでもプランをアップグレードできます。
    >
    {style="note"}

3. ブラウザで **Authorize JetBrains** をクリックして、統合を承認します。

TeamCityがワークスペースを作成または接続し、ビルド環境を準備します。これには通常30秒もかかりません。

## iOSアプリのビルド {id="build-the-ios-app"}

ワークスペースの準備ができると、IDEは自動的に **TeamCity** タブを開き、最初のビルドを開始します。

この最初の実行では、TeamCityはローカルにある未コミットのプロジェクトファイルを使用します。ホストされたmacOSエージェント上でiOSアプリケーションをビルドし、構成されたテストを実行します。これにより、生成されたファイルをリポジトリにコミットする前に、パイプラインが期待通りに動作することを確認できます。

![iOSビルド成功](ios-pipeline-first-build.png){width=700 style="block"}

自動ビルドが成功したら、**Publish to TestFlight** をクリックして署名とデプロイを構成します。

## Apple署名とTestFlightの構成 {id="configure-apple-signing-and-testflight"}

TestFlightにビルドをアップロードするには、TeamCityにApp Store ConnectとAppleコード署名の資格情報が必要です。

### App Store Connect APIキーの作成 {id="create-an-app-store-connect-api-key"}

1. [App Store Connect](https://appstoreconnect.apple.com/)にサインインします。
2. **ユーザとアクセス** に移動し、**キー** を選択します。
3. アプリをアップロードするために必要な権限を持つAPIキーを作成します。
4. 非公開鍵（`.p8` ファイル）をダウンロードします。
5. キーに対して表示される **Issuer ID** と **キーID** をメモします。

`.p8` ファイルは一度しかダウンロードできないため、安全に保管してください。

### Apple Distribution証明書の書き出し {id="export-an-apple-distribution-certificate"}

1. Xcodeで **Settings** | **Accounts** に移動するか、[Apple Developer Portal](https://developer.apple.com/account/)を開き、Apple Distribution証明書を作成または探します。
2. Macで **キーチェーンアクセス** を開き、**自分の証明書** の下にある証明書を見つけます。
3. 証明書を右クリックし、**書き出す** を選択して `.p12` ファイルとして保存します。
4. 書き出し用パスワードを設定し、安全に保管してください。後で必要になります。

> Macを利用できない場合は、WindowsまたはLinux上のOpenSSLを使用して、証明書署名要求（CSR）を[生成](https://www.ssl.com/how-to/manually-generate-a-certificate-signing-request-csr-using-openssl/)し、作成された証明書を `.p12` ファイルに[変換](https://www.ssl.com/how-to/create-a-pfx-p12-certificate-file-using-openssl/)することができます。
>
{style="note"}

### IDEでApple資格情報を追加する {id="add-apple-credentials-in-the-ide"}

IDEに戻り、**Add Apple signing credentials** フォームを入力します。
TeamCityはこれらの値を安全なデプロイ資格情報として保存します。これらはプロジェクトのソースファイルには追加されません。

|-------------------|----------------------------------------------------------------------------------------------------------------------------------|
| **Issuer ID**     | App Store Connect API統合を識別します。                                                                               |
| **Key ID**        | 作成したAPIキーを識別します。                                                                                         |
| **Private Key**   | App Store Connectからダウンロードした `.p8` ファイル。                                                                                |
| **Team ID**       | Apple Developerのチーム識別子。                                                                                            |
| **Bundle ID**     | アプリの固有の識別子（例: `com.company.app`）。アプリターゲットで設定され、App Store Connectにリストされているもの。 |
| **Certificate**   | 非公開鍵を含む `.p12` 配布用証明書。                                                                                             |
| **.p12 password** | 証明書を書き出す際に指定したパスワード。                                                                                                |
{style="none"}

### 最初のビルドをTestFlightにアップロードする {id="upload-the-first-build-to-testflight"}

資格情報を追加すると、パイプラインに署名とデプロイのステップが含まれるようになります。

1. **Deploy to TestFlight** をクリックします。
    TeamCityがパイプラインを再実行し、署名済みのiOSビルドを作成してApp Store Connectにアップロードします。
2. App Store ConnectまたはTestFlightを開き、ビルドが表示されることを確認します。

## ビルドと公開の自動化 {id="automate-builds-and-publishing"}

### リポジトリの接続 {id="connect-the-repository"}

このプロセスを自動化するには、GitHubリポジトリをTeamCityに接続し、プッシュのたびに新しいビルドがトリガーされるようにします。

1. 最初のデプロイパイプラインが正常に終了したら、IDEで **Connect repository** をクリックします。
   TeamCityがブラウザで開き、リポジトリが承認されたことを確認します。リポジトリとブランチが自動的に検出され、パイプラインにアタッチされます。
2. IDEに戻り、生成されたパイプライン構成ファイルをコミットしてプッシュします。

これで、構成されたブランチに変更をプッシュするたびに、TeamCityがパイプラインをトリガーするようになります。

### パイプラインの確認 {id="verify-the-pipeline"}

これでiOSデリバリーパイプラインの準備が整いました！構成されたブランチへのプッシュごとに、TeamCityは以下を実行します：

1. ホストされたmacOSエージェント上でビルドを開始する。
2. Kotlin Multiplatformプロジェクトをビルドする。
3. 構成されたテストを実行する。
4. iOSアプリケーションに署名する。
5. 新しいビルドをTestFlightにアップロードする。

![iOSデリバリーパイプラインの準備完了](ios-pipeline-success.png){width=700 style="block"}

**Done** をクリックしてセットアップフローを閉じます。

これからは、コードをプッシュするだけで、残りの処理はTeamCityが行います。

## 次のステップ {id="what-s-next"}

* セットアップをさらにカスタマイズするために、[TeamCity Cloudパイプライン](https://www.jetbrains.com/help/teamcity/cloud/create-and-edit-pipelines.html)について詳しく読む：プロジェクトの追加、ビルドエージェントの要件設定など。
* [マルチプラットフォームアプリの公開](multiplatform-publish-apps.md)方法を学ぶ。
* Kotlin Multiplatformアプリケーションの継続的インテグレーションのために[GitHub Actionsを構成](github-actions-for-kmp.md)する。