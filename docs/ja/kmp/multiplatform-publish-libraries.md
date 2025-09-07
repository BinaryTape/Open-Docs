[//]: # (title: ライブラリをMaven Centralに公開する – チュートリアル)

このチュートリアルでは、Kotlin Multiplatformライブラリを[Maven Central](https://central.sonatype.com/)リポジトリに公開する方法を学習します。

ライブラリを公開するには、次の作業が必要です。

1.  Maven Centralのアカウントや署名用のPGP鍵など、クレデンシャルを設定する。
2.  ライブラリのプロジェクトで公開プラグインを設定する。
3.  公開プラグインにクレデンシャルを提供し、アーティファクトを署名してアップロードできるようにする。
4.  ローカルまたは継続的インテグレーションを使用して、公開タスクを実行する。

このチュートリアルは、以下の前提条件を満たしていることを想定しています。

*   オープンソースライブラリを作成している。
*   ライブラリのコードをGitHubリポジトリに保存している。
*   macOSまたはLinuxを使用している。Windowsユーザーの場合は、[GnuPGまたはGpg4win](https://gnupg.org/download)を使用して鍵ペアを生成してください。
*   Maven Centralにまだ登録していないか、[Central Portalへの公開](https://central.sonatype.org/publish-ea/publish-ea-guide/)に適した既存のアカウント（2024年3月12日以降に作成された、またはサポートによってCentral Portalに移行されたもの）を所有している。
*   継続的インテグレーションにGitHub Actionsを使用している。

> ここでの手順のほとんどは、異なるセットアップを使用している場合でも適用できますが、考慮すべきいくつかの違いがある場合があります。
>
> [重要な制約](multiplatform-publish-lib-setup.md#host-requirements)は、AppleターゲットはmacOSを搭載したマシンでビルドする必要があることです。
>
{style="note"}

## サンプルライブラリ

このチュートリアルでは、例として[fibonacci](https://github.com/Kotlin/multiplatform-library-template/)ライブラリを使用します。
このリポジトリのコードを参照して、公開設定がどのように機能するかを確認できます。

コードを再利用したい場合は、**すべての例の値を**プロジェクト固有の値に**置き換える**必要があります。

## アカウントとクレデンシャルの準備

Maven Centralへの公開を開始するには、[Maven Central](https://central.sonatype.com/)ポータルにサインイン（または新しいアカウントを作成）します。

### ネームスペースの選択と検証

Maven Centralでライブラリのアーティファクトを一意に識別するには、検証済みのネームスペースが必要です。

Mavenアーティファクトは、その[座標](https://central.sonatype.org/publish/requirements/#correct-coordinates)によって識別されます。例えば、`com.example:fibonacci-library:1.0.0`です。これらの座標は、コロンで区切られた3つの部分で構成されています。

*   `groupId`: リバースDNS形式。例えば、`com.example`
*   `artifactId`: ライブラリ自体の一意の名前。例えば、`fibonacci-library`
*   `version`: バージョン文字列。例えば、`1.0.0`。バージョンは任意の文字列ですが、`-SNAPSHOT`で終わることはできません。

登録済みのネームスペースを使用すると、Maven Centralでの`groupId`の形式を設定できます。例えば、`com.example`ネームスペースを登録した場合、`groupId`を`com.example`、`com.example.libraryname`、`com.example.module.feature`などに設定してアーティファクトを公開できます。

Maven Centralにサインインしたら、[Namespaces](https://central.sonatype.com/publishing/namespaces)ページに移動します。
次に、**Add Namespace**ボタンをクリックしてネームスペースを登録します。

<Tabs>
<TabItem id="github" title="GitHubリポジトリを使用する場合">

GitHubアカウントを使用してネームスペースを作成することは、ドメイン名を所有していない場合に良い選択肢です。

1.  ネームスペースとして`io.github.<あなたのユーザー名>`を入力します（例: `io.github.kotlinhandson`）。**Submit**をクリックします。
2.  新しく作成されたネームスペースの下に表示される**Verification Key**をコピーします。
3.  GitHubで、使用したユーザー名でログインし、検証キーをリポジトリ名とする新しい公開リポジトリを作成します（例: `http://github.com/kotlin-hands-on/ex4mpl3c0d`）。
4.  Maven Centralに戻り、**Verify Namespace**ボタンをクリックします。検証が成功したら、作成したリポジトリを削除できます。

</TabItem>
<TabItem id="domain" title="ドメイン名を使用する場合">

所有するドメイン名をネームスペースとして使用するには:

1.  ドメインをリバースDNS形式でネームスペースとして入力します。ドメインが`example.com`の場合、`com.example`と入力します。
2.  表示された**Verification Key**をコピーします。
3.  検証キーを内容とする新しいTXT DNSレコードを作成します。

    さまざまなドメイン登録業者での設定方法については、[Maven CentralのFAQ](https://central.sonatype.org/faq/how-to-set-txt-record/)を参照してください。
4.  Maven Centralに戻り、**Verify Namespace**ボタンをクリックします。検証が成功したら、作成したTXTレコードを削除できます。

</TabItem>
</Tabs>

#### 鍵ペアを生成する

Maven Centralに何かを公開する前に、アーティファクトを[PGP署名](https://central.sonatype.org/publish/requirements/gpg/)で署名する必要があります。これにより、ユーザーはアーティファクトの出所を検証できます。

署名を開始するには、鍵ペアを生成する必要があります。

*   _秘密鍵_はアーティファクトの署名に使用され、他者と決して共有してはなりません。
*   _公開鍵_は他者と共有できるため、彼らはアーティファクトの署名を検証できます。

署名を管理できる`gpg`ツールは、[GnuPGウェブサイト](https://gnupg.org/download/index.html)で入手できます。
[Homebrew](https://brew.sh/)などのパッケージマネージャーを使用してインストールすることもできます。

```bash
brew install gpg
```

1.  次のコマンドを使用して鍵ペアの生成を開始し、プロンプトが表示されたら必要な詳細情報を提供します。

    ```bash
    gpg --full-generate-key
    ```

2.  作成する鍵の種類の推奨デフォルトを選択します。
    選択を空のまま<shortcut>Enter</shortcut>を押して、デフォルト値を受け入れることができます。

    ```text
    Please select what kind of key you want:
        (1) RSA and RSA
        (2) DSA and Elgamal
        (3) DSA (sign only)
        (4) RSA (sign only)
        (9) ECC (sign and encrypt) *default*
        (10) ECC (sign only)
        (14) Existing key from card
    Your selection? 9

    Please select which elliptic curve you want:
        (1) Curve 25519 *default*
        (4) NIST P-384
        (6) Brainpool P-256
    Your selection? 1
    ```

    > 本稿執筆時点では、これは`Curve 25519`を使用した`ECC (sign and encrypt)`です。
    > 古いバージョンの`gpg`では、`3072`ビットの鍵サイズを持つ`RSA`がデフォルトになる場合があります。
    >
    {style="note"}

3.  鍵の有効期間を指定するよう求められたら、有効期限なしのデフォルトオプションを選択できます。

    設定された期間後に自動的に期限切れになる鍵を作成することを選択した場合、期限切れになったときに[その有効性を延長する](https://central.sonatype.org/publish/requirements/gpg/#dealing-with-expired-keys)必要があります。

    ```text
    Please specify how long the key should be valid.
        0 = key does not expire
        <n>  = key expires in n days
        <n>w = key expires in n weeks
        <n>m = key expires in n months
        <n>y = key expires in n years
    Key is valid for? (0) 0
    Key does not expire at all

    Is this correct? (y/N) y
    ```

4.  名前、メールアドレス、および鍵をIDに関連付けるためのオプションのコメントを入力します（コメントフィールドは空のままで構いません）。

    ```text
    GnuPG needs to construct a user ID to identify your key.

    Real name: Jane Doe
    Email address: janedoe@example.com
    Comment:
    You selected this USER-ID:
        "Jane Doe <janedoe@example.com>"
    ```

5.  鍵を暗号化するためのパスフレーズを入力し、プロンプトが表示されたらそれを繰り返します。

    このパスフレーズは安全かつプライベートに保管してください。後でアーティファクトに署名する際に秘密鍵にアクセスするために必要になります。

6.  次のコマンドを使用して、作成した鍵を確認します。

    ```bash
    gpg --list-keys
    ```

出力は次のようになります。

```text
pub   ed25519 2024-10-06 [SC]
      F175482952A225BFD4A07A713EE6B5F76620B385CE
uid   [ultimate] Jane Doe <janedoe@example.com>
      sub   cv25519 2024-10-06 [E]
```

次の手順では、出力に表示される鍵の長い英数字の識別子を使用する必要があります。

#### 公開鍵をアップロードする

Maven Centralに承認されるためには、[公開鍵をキーサーバーにアップロードする](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)必要があります。利用可能なキーサーバーは複数ありますが、ここではデフォルトの選択として`keyserver.ubuntu.com`を使用します。

`gpg`を使用して公開鍵をアップロードするには、次のコマンドを実行します。パラメーター内の**自身の鍵IDを置き換えて**ください。

```bash
gpg --keyserver keyserver.ubuntu.com --send-keys F175482952A225BFC4A07A715EE6B5F76620B385CE
```

#### 秘密鍵をエクスポートする

Gradleプロジェクトから秘密鍵にアクセスできるようにするには、秘密鍵をバイナリファイルにエクスポートする必要があります。
鍵を作成した際に使用したパスフレーズを入力するよう求められます。

次のコマンドを使用し、**自身の鍵IDをパラメーターとして渡して**ください。

```bash
gpg --no-armor --export-secret-keys F175482952A225BFC4A07A715EE6B5F76620B385CE > key.gpg
```

このコマンドは、秘密鍵を含む`key.gpg`バイナリファイルを作成します（プレーンテキストバージョンのみを作成する`--armor`フラグを**使用しない**ようにしてください）。

> 秘密鍵ファイルは誰とも共有しないでください。秘密鍵はあなたのクレデンシャルでファイルに署名することを可能にするため、あなただけがアクセスできるべきです。
>
{style="warning"}

## プロジェクトを設定する

### ライブラリプロジェクトを準備する

テンプレートプロジェクトからライブラリの開発を開始した場合、プロジェクト内のデフォルトの名前をすべて、自身のライブラリの名前に合わせる良い機会です。これには、ライブラリモジュールの名前や、トップレベルの`build.gradle.kts`ファイル内のルートプロジェクトの名前が含まれます。

プロジェクトにAndroidターゲットがある場合は、[Androidライブラリリリースを準備するための手順](https://developer.android.com/build/publish-library/prep-lib-release)に従う必要があります。
最低限、このプロセスでは、リソースがコンパイルされる際に一意の`R`クラスが生成されるように、ライブラリの[適切なネームスペースを指定する](https://developer.android.com/build/publish-library/prep-lib-release#choose-namespace)必要があります。
このネームスペースは、[先に作成した](#choose-and-verify-a-namespace)Mavenネームスペースとは異なることに注意してください。

```kotlin
// build.gradle.kts

android {
    namespace = "io.github.kotlinhandson.fibonacci"
}
```

### 公開プラグインを設定する

このチュートリアルでは、Maven Centralへの公開を支援するために[vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin)を使用します。
プラグインの利点については[こちら](https://vanniktech.github.io/gradle-maven-publish-plugin/#advantages-over-maven-publish)をご覧ください。
使用法や利用可能な設定オプションについては、[プラグインのドキュメント](https://vanniktech.github.io/gradle-maven-publish-plugin/central/)を参照してください。

プロジェクトにプラグインを追加するには、ライブラリモジュールの`build.gradle.kts`ファイルの`plugins {}`ブロックに次の行を追加します。

```kotlin
// <module directory>/build.gradle.kts

plugins {
    id("com.vanniktech.maven.publish") version "%vanniktechPublishPlugin%"
}
```

> プラグインの最新の利用可能なバージョンについては、[リリース](https://github.com/vanniktech/gradle-maven-publish-plugin/releases)ページを確認してください。
>
{style="note"}

同じファイルに、すべての値をライブラリに合わせてカスタマイズするように、次の設定を追加します。

```kotlin
// <module directory>/build.gradle.kts

mavenPublishing {
    publishToMavenCentral()

    signAllPublications()

    coordinates(group.toString(), "fibonacci", version.toString())

    pom {
        name = "Fibonacci library"
        description = "A mathematics calculation library."
        inceptionYear = "2024"
        url = "https://github.com/kotlin-hands-on/fibonacci/"
        licenses {
            license {
                name = "The Apache License, Version 2.0"
                url = "https://www.apache.org/licenses/LICENSE-2.0.txt"
                distribution = "https://www.apache.org/licenses/LICENSE-2.0.txt"
            }
        }
        developers {
            developer {
                id = "kotlin-hands-on"
                name = "Kotlin Developer Advocate"
                url = "https://github.com/kotlin-hands-on/"
            }
        }
        scm {
            url = "https://github.com/kotlin-hands-on/fibonacci/"
            connection = "scm:git:git://github.com/kotlin-hands-on/fibonacci.git"
            developerConnection = "scm:git:ssh://git@github.com/kotlin-hands-on/fibonacci.git"
        }
    }
}
```

> これを設定するには、[Gradle properties](https://docs.gradle.org/current/userguide/build_environment.html)を使用することもできます。
>
{style="tip"}

ここで最も重要な設定は次のとおりです。

*   ライブラリの`groupId`、`artifactId`、および`version`を指定する`coordinates`。
*   ライブラリが公開される[ライセンス](https://central.sonatype.org/publish/requirements/#license-information)。
*   ライブラリの作者を一覧表示する[開発者情報](https://central.sonatype.org/publish/requirements/#developer-information)。
*   ライブラリのソースコードがホストされている場所を指定する[SCM（ソースコード管理）情報](https://central.sonatype.org/publish/requirements/#scm-information)。

## 継続的インテグレーションを使用してMaven Centralに公開する

### ユーザー生成トークン

Maven Centralが公開リクエストを認証するために、Mavenアクセストークンが必要です。
[Setup Token-Based Authentication](https://central.sonatype.com/account)ページを開き、**Generate User Token**ボタンをクリックします。

出力は次の例のようになり、ユーザー名とパスワードが含まれています。
これらのクレデンシャルを紛失した場合、Maven Centralによって保存されないため、後で新しいものを生成する必要があります。

```xml
<server>
    <id>${server}</id>
    <username>l2nfaPmz</username>
    <password>gh9jT9XfnGtUngWTZwTu/8141keYdmQpipqLPRKeDLTh</password>
</server>
```

### GitHubにシークレットを追加する

公開に必要な鍵とクレデンシャルをGitHub Actionsワークフローで使用し、それらをプライベートに保つには、これらの値をシークレットとして保存する必要があります。

1.  GitHubリポジトリの**Settings**ページで、**Security** | **Secrets and variables** | **Actions**をクリックします。
2.  `New repository secret`ボタンをクリックし、次のシークレットを追加します。

    *   `MAVEN_CENTRAL_USERNAME`と`MAVEN_CENTRAL_PASSWORD`は、Central Portalウェブサイトで[ユーザー生成トークン用に生成された](#generate-the-user-token)値です。
    *   `SIGNING_KEY_ID`は、署名鍵の識別子の**最後の8文字**です。例えば、`F175482952A225BFC4A07A715EE6B5F76620B385CE`の場合は`20B385CE`です。
    *   `SIGNING_PASSWORD`は、GPG鍵を生成した際に提供したパスフレーズです。
    *   `GPG_KEY_CONTENTS`には、[`key.gpg`ファイル](#export-your-private-key)の全内容を含める必要があります。

    ![GitHubにシークレットを追加](github_secrets.png){width=700}

これらのシークレットの名前は、次のステップでCI設定に使用します。

### プロジェクトにGitHub Actionsワークフローを追加する

ライブラリを自動的にビルドして公開するために、継続的インテグレーションを設定できます。
ここでは例として[GitHub Actions](https://docs.github.com/en/actions)を使用します。

開始するには、`.github/workflows/publish.yml`ファイルに次のワークフローをリポジトリに追加します。

```yaml
# .github/workflows/publish.yml

name: Publish
on:
  release:
    types: [released, prereleased]
jobs:
  publish:
    name: Release build and publish
    runs-on: macOS-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v4
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: 21
      - name: Publish to MavenCentral
        run: ./gradlew publishToMavenCentral --no-configuration-cache
        env:
          ORG_GRADLE_PROJECT_mavenCentralUsername: ${{ secrets.MAVEN_CENTRAL_USERNAME }}
          ORG_GRADLE_PROJECT_mavenCentralPassword: ${{ secrets.MAVEN_CENTRAL_PASSWORD }}
          ORG_GRADLE_PROJECT_signingInMemoryKeyId: ${{ secrets.SIGNING_KEY_ID }}
          ORG_GRADLE_PROJECT_signingInMemoryKeyPassword: ${{ secrets.SIGNING_PASSWORD }}
          ORG_GRADLE_PROJECT_signingInMemoryKey: ${{ secrets.GPG_KEY_CONTENTS }}
```

このファイルをコミットしてプッシュすると、プロジェクトをホストするGitHubリポジトリでリリース（プレリリースを含む）を作成するたびに、ワークフローが自動的に実行されます。ワークフローは現在のコードバージョンをチェックアウトし、JDKをセットアップしてから、`publishToMavenCentral` Gradleタスクを実行します。

`publishToMavenCentral`タスクを使用する場合でも、Maven Centralウェブサイトでデプロイメントを[手動で確認してリリースする](#create-a-release-on-github)必要があります。あるいは、`publishAndReleaseToMavenCentral`タスクを使用すると、リリースプロセスを完全に自動化できます。

また、ワークフローを、タグがリポジトリにプッシュされたときに[トリガーする](https://stackoverflow.com/a/61892639)ように設定することもできます。

> 上記のスクリプトは、公開プラグインが設定キャッシュをサポートしていないため（この[オープンな課題](https://github.com/gradle/gradle/issues/22779)を参照）、Gradleコマンドに`--no-configuration-cache`を追加することで、公開タスクのGradleの[設定キャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)を無効にしています。
>
{style="tip"}

このアクションには、[リポジトリシークレット](#add-secrets-to-github)として作成した署名の詳細とMaven Centralクレデンシャルが必要です。

ワークフロー設定はこれらのシークレットを自動的に環境変数に転送し、Gradleビルドプロセスで利用可能にします。

### GitHubでリリースを作成する

ワークフローとシークレットの設定が完了したら、ライブラリの公開をトリガーする[リリースを作成する](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)準備が整いました。

1.  ライブラリの`build.gradle.kts`ファイルで指定されているバージョン番号が、公開したいものであることを確認します。
2.  GitHubリポジトリのメインページに移動します。
3.  右側のサイドバーで、**Releases**をクリックします。
4.  **Draft a new release**ボタン（または、このリポジトリでまだリリースを作成していない場合は**Create a new release**ボタン）をクリックします。
5.  各リリースにはタグがあります。タグのドロップダウンで新しいタグを作成し、リリースタイトルを設定します（タグ名とタイトルは同一で構いません）。

    これらは、`build.gradle.kts`ファイルで指定したライブラリのバージョン番号と同じにしたいでしょう。

    ![GitHubでリリースを作成](create_release_and_tag.png){width=700}

6.  リリース対象とするブランチを再確認し（特にデフォルトブランチではない場合）、新しいバージョンに適したリリースノートを追加します。
7.  説明の下にあるチェックボックスを使用して、リリースをプレリリースとしてマークします（アルファ、ベータ、RCなどの早期アクセスバージョンに役立ちます）。

    また、リリースを最新としてマークすることもできます（このリポジトリで以前にリリースを作成したことがある場合）。
8.  **Publish release**ボタンをクリックして、新しいリリースを作成します。
9.  GitHubリポジトリページの上部にある**Actions**タブをクリックします。ここで、新しいリリースが公開ワークフローをトリガーしたことがわかります。

    ワークフローをクリックすると、公開タスクの出力を確認できます。
10. ワークフローの実行が完了したら、Maven Centralの[Deployments](https://central.sonatype.com/publishing/deployments)ダッシュボードに移動します。ここに新しいデプロイメントが表示されるはずです。

    このデプロイメントは、Maven Centralがチェックを実行している間、しばらくの間_pending_または_validating_状態のままになる場合があります。

11. デプロイメントが_validated_状態になったら、アップロードしたすべてのアーティファクトが含まれていることを確認します。
    すべてが正しいように見える場合は、**Publish**ボタンをクリックしてこれらのアーティファクトをリリースします。

    ![公開設定](published_on_maven_central.png){width=700}

    > リリース後、アーティファクトがMaven Centralリポジトリで公開に利用可能になるまでには時間がかかります（通常15〜30分）。[Maven Centralウェブサイト](https://central.sonatype.com/)でインデックス化され、検索可能になるまでにはさらに時間がかかる場合があります。
    >
    {style="tip"}

デプロイメントが検証されたらアーティファクトを自動的にリリースするには、ワークフロー内の`publishToMavenCentral`タスクを`publishAndReleaseToMavenCentral`に置き換えます。

## 次のステップ

*   [マルチプラットフォームライブラリの公開設定と要件について詳しく学ぶ](multiplatform-publish-lib-setup.md)
*   [READMEにshield.ioバッジを追加する](https://shields.io/badges/maven-central-version)
*   [Dokkaを使用してプロジェクトのAPIドキュメントを共有する](https://kotl.in/dokka)
*   [Renovateを追加して依存関係を自動的に更新する](https://docs.renovatebot.com/)
*   [JetBrainsの検索プラットフォームでライブラリを宣伝する](https://klibs.io/)
*   [Kotlin Slackチャンネルの`#feed`でコミュニティとライブラリを共有する](https://kotlinlang.slack.com/)
    （サインアップするには、https://kotl.in/slackにアクセスしてください）