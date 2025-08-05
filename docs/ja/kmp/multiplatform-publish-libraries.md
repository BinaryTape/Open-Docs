[//]: # (title: ライブラリをMaven Centralに公開する – チュートリアル)

このチュートリアルでは、Kotlin Multiplatformライブラリを[Maven Central](https://central.sonatype.com/)リポジトリに公開する方法を学びます。

ライブラリを公開するには、以下の作業が必要です。

1.  Maven Centralのアカウントと署名用のPGPキーを含む、認証情報を設定します。
2.  ライブラリのプロジェクトで公開プラグインを設定します。
3.  成果物（アーティファクト）に署名してアップロードできるよう、公開プラグインに認証情報を提供します。
4.  ローカルまたは継続的インテグレーション（CI）を使用して公開タスクを実行します。

このチュートリアルは、以下の前提条件を満たしていることを想定しています。

*   オープンソースライブラリを作成していること。
*   ライブラリのコードをGitHubリポジトリに保存していること。
*   macOSまたはLinuxを使用していること。Windowsユーザーの場合は、キーペアの生成に[GnuPGまたはGpg4win](https://gnupg.org/download)を使用してください。
*   Maven Centralにまだ登録していないか、[Central Portalへの公開](https://central.sonatype.org/publish-ea/publish-ea-guide/)に適した既存のアカウント（2024年3月12日以降に作成された、またはサポートによってCentral Portalに移行されたもの）を持っていること。
*   継続的インテグレーションにGitHub Actionsを使用していること。

> ここに記載されている手順のほとんどは、異なるセットアップを使用している場合でも適用可能ですが、考慮すべきいくつかの違いがあるかもしれません。
>
> 重要な制限事項として、AppleターゲットはmacOSを搭載したマシンでビルドする必要があるという点が挙げられます。
>
{style="note"}

## サンプルライブラリ

このチュートリアルでは、例として[fibonacci](https://github.com/Kotlin/multiplatform-library-template/)ライブラリを使用します。
そのリポジトリのコードを参照して、公開設定がどのように機能するかを確認できます。

コードを再利用したい場合は、**すべてのサンプル値を**ご自身のプロジェクトに固有の値に**置き換える必要があります**。

## アカウントと認証情報の準備

Maven Centralへの公開を開始するには、[Maven Central](https://central.sonatype.com/)ポータルにサインイン（または新しいアカウントを作成）してください。

### 名前空間の選択と検証

Maven Central上でライブラリの成果物（アーティファクト）を一意に識別するために、検証済みの名前空間が必要です。

Mavenの成果物（アーティファクト）は、[座標](https://central.sonatype.org/publish/requirements/#correct-coordinates)によって識別されます。例：`com.example:fibonacci-library:1.0.0`。これらの座標は、コロンで区切られた3つの部分で構成されます。

*   `groupId`（逆DNS形式）。例：`com.example`
*   `artifactId`：ライブラリ自体の一意の名前。例：`fibonacci-library`
*   `version`：バージョン文字列。例：`1.0.0`。バージョンは任意の文字列にできますが、`-SNAPSHOT`で終わることはできません。

登録された名前空間により、Maven Centralでの`groupId`の形式を設定できます。たとえば、`com.example`名前空間を登録すると、`groupId`を`com.example`、`com.example.libraryname`、`com.example.module.feature`などに設定して成果物を公開できます。

Maven Centralにサインインしたら、[Namespaces](https://central.sonatype.com/publishing/namespaces)ページに移動します。次に、**Add Namespace**ボタンをクリックして名前空間を登録します。

<tabs>
<tab id="github" title="GitHubリポジトリを使用">

ドメイン名を持っていない場合、GitHubアカウントを使用して名前空間を作成するのが良い選択肢です。

1.  `io.github.<あなたのユーザー名>`を名前空間として入力します。例：`io.github.kotlinhandson`。次に、**Submit**をクリックします。
2.  新しく作成された名前空間の下に表示される**Verification Key**をコピーします。
3.  GitHubで、使用したユーザー名でログインし、検証キーをリポジトリ名として新しい公開リポジトリを作成します。例：`http://github.com/kotlin-hands-on/ex4mpl3c0d`。
4.  Maven Centralに戻り、**Verify Namespace**ボタンをクリックします。検証が成功したら、作成したリポジトリを削除できます。

</tab>
<tab id="domain" title="ドメイン名を使用">

所有するドメイン名を名前空間として使用するには：

1.  逆DNS形式を使用してドメインを名前空間として入力します。ドメインが`example.com`の場合、`com.example`と入力します。
2.  表示される**Verification Key**をコピーします。
3.  検証キーを内容として、新しいTXT DNSレコードを作成します。

    これを様々なドメインレジストラで実行する方法については、[Maven CentralのFAQ](https://central.sonatype.org/faq/how-to-set-txt-record/)を参照してください。
4.  Maven Centralに戻り、**Verify Namespace**ボタンをクリックします。検証が成功したら、作成したTXTレコードを削除できます。

</tab>
</tabs>

#### キーペアの生成

Maven Centralに何かを公開する前に、成果物（アーティファクト）の出所をユーザーが検証できるように、[PGP署名](https://central.sonatype.org/publish/requirements/gpg/)で署名する必要があります。

署名を開始するには、キーペアを生成する必要があります。

*   _秘密鍵_は成果物に署名するために使用され、他者と共有してはなりません。
*   _公開鍵_は、成果物の署名を検証できるよう、他者と共有できます。

署名を管理できる`gpg`ツールは、[GnuPGのウェブサイト](https://gnupg.org/download/index.html)で入手できます。また、[Homebrew](https://brew.sh/)などのパッケージマネージャーを使用してインストールすることもできます。

```bash
brew install gpg
```

1.  以下のコマンドを使用してキーペアの生成を開始し、プロンプトが表示されたら必要な詳細情報を提供します。

    ```bash
    gpg --full-generate-key
    ```

2.  作成するキーの種類の推奨されるデフォルトを選択します。選択を空のままにして<shortcut>Enter</shortcut>を押すと、デフォルト値が採用されます。

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

    > 執筆時点では、これは`Curve 25519`を用いた`ECC (sign and encrypt)`です。
    > `gpg`の古いバージョンでは、`3072`ビットキーサイズの`RSA`がデフォルトとなる場合があります。
    >
    {style="note"}

3.  キーの有効期間を指定するよう促されたら、有効期限なしのデフォルトオプションを選択できます。

    設定された期間が経過すると自動的に期限切れになるキーを作成することを選択した場合、期限切れになった際に[その有効期間を延長する](https://central.sonatype.org/publish/requirements/gpg/#dealing-with-expired-keys)必要があります。

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

4.  名前、メールアドレス、およびオプションのコメントを入力して、キーをIDに関連付けます（コメントフィールドは空のままで構いません）。

    ```text
    GnuPG needs to construct a user ID to identify your key.

    Real name: Jane Doe
    Email address: janedoe@example.com
    Comment:
    You selected this USER-ID:
        "Jane Doe <janedoe@example.com>"
    ```

5.  キーを暗号化するためのパスフレーズを入力し、プロンプトが表示されたら繰り返します。

    このパスフレーズは安全かつプライベートに保管してください。後で成果物に署名する際に秘密鍵にアクセスするために必要になります。

6.  以下のコマンドで作成したキーを確認します。

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

次のステップでは、出力に表示されるキーの長い英数字の識別子を使用する必要があります。

#### 公開鍵のアップロード

Maven Centralに受け入れられるように、[公開鍵をキーサーバーにアップロードする](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)必要があります。利用可能なキーサーバーは複数ありますが、ここでは`keyserver.ubuntu.com`をデフォルトの選択肢とします。

`gpg`を使用して公開鍵をアップロードするには、以下のコマンドを実行します。**パラメータにはご自身のキーIDを代入してください**。

```bash
gpg --keyserver keyserver.ubuntu.com --send-keys F175482952A225BFC4A07A715EE6B5F76620B385CE
```

#### 秘密鍵のエクスポート

Gradleプロジェクトが秘密鍵にアクセスできるようにするには、秘密鍵をバイナリファイルにエクスポートする必要があります。キーを作成したときに使用したパスフレーズを入力するよう促されます。

以下のコマンドを使用し、**ご自身のキーIDをパラメータとして渡します**。

```bash
gpg --no-armor --export-secret-keys F175482952A225BFC4A07A715EE6B5F76620B385CE > key.gpg
```

このコマンドは、秘密鍵を含む`key.gpg`バイナリファイルを作成します（プレーンテキスト版のキーのみを作成する--armorフラグを**使用しないように**してください）。

> 秘密鍵ファイルは誰とも共有しないでください。秘密鍵はあなたの認証情報でファイルに署名することを可能にするため、あなただけがアクセスできるべきです。
>
{style="warning"}

## プロジェクトの設定

### ライブラリプロジェクトの準備

テンプレートプロジェクトからライブラリの開発を開始した場合、プロジェクト内のデフォルト名を自身のライブラリ名に一致させる良い機会です。これには、ライブラリモジュールの名前と、トップレベルの`build.gradle.kts`ファイルにあるルートプロジェクトの名前が含まれます。

プロジェクトにAndroidターゲットがある場合、[Androidライブラリのリリース準備の手順](https://developer.android.com/build/publish-library/prep-lib-release)に従う必要があります。最低限、このプロセスでは、リソースがコンパイルされたときに一意の`R`クラスが生成されるように、ライブラリの[適切な名前空間を指定する](https://developer.android.com/build/publish-library/prep-lib-release#choose-namespace)必要があります。この名前空間は、[以前作成した](#choose-and-verify-a-namespace)Mavenの名前空間とは異なることに注意してください。

```kotlin
// build.gradle.kts

android {
    namespace = "io.github.kotlinhandson.fibonacci"
}
```

### 公開プラグインの設定

このチュートリアルでは、Maven Centralへの公開を支援するために[vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin)を使用します。このプラグインの利点については、[こちら](https://vanniktech.github.io/gradle-maven-publish-plugin/#advantages-over-maven-publish)をご覧ください。その使用法と利用可能な設定オプションの詳細については、[プラグインのドキュメント](https://vanniktech.github.io/gradle-maven-publish-plugin/central/)を参照してください。

プロジェクトにプラグインを追加するには、ライブラリモジュールの`build.gradle.kts`ファイルの`plugins {}`ブロックに以下の行を追加します。

```kotlin
// <module directory>/build.gradle.kts

plugins {
    id("com.vanniktech.maven.publish") version "0.30.0"
}
```

> プラグインの最新バージョンについては、[リリースページ](https://github.com/vanniktech/gradle-maven-publish-plugin/releases)を確認してください。
>
{style="note"}

同じファイルに以下の設定を追加し、ライブラリのすべての値を必ずカスタマイズしてください。

```kotlin
// <module directory>/build.gradle.kts

mavenPublishing {
    publishToMavenCentral(SonatypeHost.CENTRAL_PORTAL)

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

> これを設定するには、[Gradleプロパティ](https://docs.gradle.org/current/userguide/build_environment.html)も使用できます。
>
{style="tip"}

ここで最も重要な設定は次のとおりです。

*   ライブラリの`groupId`、`artifactId`、`version`を指定する`coordinates`。
*   ライブラリが公開される[ライセンス](https://central.sonatype.org/publish/requirements/#license-information)。
*   ライブラリの著者をリストする[開発者情報](https://central.sonatype.org/publish/requirements/#developer-information)。
*   ライブラリのソースコードがどこでホストされているかを指定する[SCM (Source Code Management) 情報](https://central.sonatype.org/publish/requirements/#scm-information)。

## 継続的インテグレーションを使用してMaven Centralに公開する

### ユーザーアクセストークンの生成

Maven Centralが公開リクエストを認証するために、Mavenアクセストークンが必要です。[Setup Token-Based Authentication](https://central.sonatype.com/account)ページを開き、**Generate User Token**ボタンをクリックします。

出力は以下の例のようになり、ユーザー名とパスワードが含まれます。これらの認証情報を失った場合、Maven Centralには保存されないため、後で新しいものを生成する必要があります。

```xml
<server>
    <id>${server}</id>
    <username>l2nfaPmz</username>
    <password>gh9jT9XfnGtUngWTZwTu/8141keYdmQpipqLPRKeDLTh</password>
</server>
```

### GitHubにシークレットを追加する

公開に必要なキーと認証情報をGitHub Actionsワークフローでプライベートに保ちつつ使用するには、これらの値をシークレットとして保存する必要があります。

1.  GitHubリポジトリの**Settings**ページで、**Security** | **Secrets and variables** | **Actions**をクリックします。
2.  `New repository secret`ボタンをクリックし、以下のシークレットを追加します。

    *   `MAVEN_CENTRAL_USERNAME`と`MAVEN_CENTRAL_PASSWORD`は、Central Portalウェブサイトによって[ユーザーアクセストークン用に生成された](#generate-the-user-token)値です。
    *   `SIGNING_KEY_ID`は、署名キーの識別子の**最後の8文字**です。例：`F175482952A225BFC4A07A715EE6B5F76620B385CE`の場合、`20B385CE`。
    *   `SIGNING_PASSWORD`は、GPGキーの生成時に提供したパスフレーズです。
    *   `GPG_KEY_CONTENTS`には、[あなたの`key.gpg`ファイル](#export-your-private-key)の全内容を含める必要があります。

    ![Add secrets to GitHub](github_secrets.png){width=700}

これらのシークレットの名前は、次のステップでCI設定で使用します。

### プロジェクトにGitHub Actionsワークフローを追加する

ライブラリを自動的にビルドして公開する継続的インテグレーションを設定できます。例として[GitHub Actions](https://docs.github.com/en/actions)を使用します。

開始するには、以下のワークフローをリポジトリの`.github/workflows/publish.yml`ファイルに追加します。

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

このファイルをコミットしてプッシュすると、プロジェクトをホストするGitHubリポジトリでリリース（プレリリースを含む）を作成するたびに、ワークフローが自動的に実行されます。ワークフローは、現在のバージョンのコードをチェックアウトし、JDKをセットアップし、`publishToMavenCentral` Gradleタスクを実行します。

`publishToMavenCentral`タスクを使用する場合、Maven Centralウェブサイトでデプロイメントを手動で確認し、[リリースする必要](#create-a-release-on-github)があります。あるいは、`publishAndReleaseToMavenCentral`タスクを使用して、リリースプロセスを完全に自動化することもできます。

ワークフローを、リポジトリに[タグがプッシュされたときにトリガーされるように](https://stackoverflow.com/a/61892639)設定することもできます。

> 上記のスクリプトは、公開プラグインが[設定キャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)をサポートしていないため（[この未解決の問題](https://github.com/gradle/gradle/issues/22779)を参照）、Gradleコマンドに`--no-configuration-cache`を追加することで、公開タスクにおけるGradleの設定キャッシュを無効にしています。
>
{style="tip"}

このアクションには、[リポジトリシークレット](#add-secrets-to-github)として作成した署名情報とMaven Centralの認証情報が必要です。ワークフロー設定は、これらのシークレットを自動的に環境変数に転送し、Gradleビルドプロセスで利用できるようにします。

### GitHubでリリースを作成する

ワークフローとシークレットが設定されたら、ライブラリの公開をトリガーする[リリースを作成する](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)準備が整いました。

1.  ライブラリの`build.gradle.kts`ファイルに指定されているバージョン番号が、公開したいものであることを確認します。
2.  GitHubリポジトリのメインページに移動します。
3.  右側のサイドバーで、**Releases**をクリックします。
4.  **Draft a new release**ボタンをクリックします（このリポジトリでリリースをまだ作成していない場合は、**Create a new release**ボタンをクリックします）。
5.  各リリースにはタグがあります。タグのドロップダウンで新しいタグを作成し、リリースタイトルを設定します（タグ名とタイトルは同じで構いません）。

    これらは、`build.gradle.kts`ファイルで指定したライブラリのバージョン番号と同じにするのが良いでしょう。

    ![Create a release on GitHub](create_release_and_tag.png){width=700}

6.  リリース対象とするブランチを再確認し（特にデフォルトブランチでない場合）、新しいバージョンの適切なリリースノートを追加します。
7.  説明の下にあるチェックボックスを使用して、リリースをプレリリース（アルファ、ベータ、RCなどの早期アクセスバージョンに有用）としてマークします。

    また、リリースを最新のものとしてマークすることもできます（このリポジトリで以前にリリースを作成したことがある場合）。
8.  **Publish release**ボタンをクリックして、新しいリリースを作成します。
9.  GitHubリポジトリのページ上部にある**Actions**タブをクリックします。ここで、新しいリリースが公開ワークフローをトリガーしたことがわかります。

    ワークフローをクリックすると、公開タスクの出力を確認できます。
10. ワークフローの実行が完了したら、Maven Centralの[Deployments](https://central.sonatype.com/publishing/deployments)ダッシュボードに移動します。ここに新しいデプロイメントが表示されるはずです。

    このデプロイメントは、Maven Centralがチェックを実行している間、_pending_（保留中）または_validating_（検証中）の状態がしばらく続くことがあります。

11. デプロイメントが_validated_（検証済み）状態になったら、アップロードしたすべての成果物（アーティファクト）が含まれていることを確認します。すべてが正しいように見える場合は、**Publish**ボタンをクリックしてこれらの成果物をリリースします。

    ![Publishing settings](published_on_maven_central.png){width=700}

    > リリース後、成果物がMaven Centralリポジトリで公開されるまでにはしばらく時間（通常15〜30分程度）がかかります。[Maven Centralウェブサイト](https://central.sonatype.com/)でインデックス化され、検索可能になるまでにはさらに時間がかかる場合があります。
    >
{style="tip"}

デプロイメントが検証されたら成果物を自動的にリリースするには、ワークフロー内の`publishToMavenCentral`タスクを`publishAndReleaseToMavenCentral`に置き換えます。

## 次のステップ

*   [マルチプラットフォームライブラリの公開設定と要件について詳しく学ぶ](multiplatform-publish-lib-setup.md)
*   [READMEにshield.ioバッジを追加する](https://shields.io/badges/maven-central-version)
*   [Dokkaを使用してプロジェクトのAPIドキュメントを共有する](https://kotl.in/dokka)
*   [Renovateを追加して依存関係を自動的に更新する](https://docs.renovatebot.com/)
*   [JetBrainsの検索プラットフォームでライブラリを宣伝する](https://klibs.io/)
*   [Kotlin Slackの`#feed`チャンネルでコミュニティとライブラリを共有する](https://kotlinlang.slack.com/)（参加するにはhttps://kotl.in/slackにアクセスしてください）