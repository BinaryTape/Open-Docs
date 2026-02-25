[//]: # (title: Maven Centralへのライブラリの公開 – チュートリアル)

このチュートリアルでは、Kotlinマルチプラットフォームライブラリを[Maven Central](https://central.sonatype.com/)リポジトリに公開する方法を学びます。

ライブラリを公開するには、以下の手順が必要です。

1. Maven Centralのアカウントや署名用のPGPキーなど、認証情報を設定する。
2. ライブラリのプロジェクトで公開用プラグインを構成する。
3. アーティファクトの署名とアップロードができるように、認証情報を公開用プラグインに提供する。
4. ローカルまたは継続的インテグレーション（CI）を使用して、公開タスクを実行する。

このチュートリアルでは、以下を前提としています。

* オープンソースライブラリを作成している。
* ライブラリのコードをGitHubリポジトリに保存している。
* macOSまたはLinuxを使用している。Windowsユーザーの場合は、[GnuPGまたはGpg4win](https://gnupg.org/download)を使用してキーペアを生成してください。
* Maven Centralにまだ登録していないか、[Central Portalへの公開](https://central.sonatype.org/publish-ea/publish-ea-guide/)に適した既存のアカウントを持っている（2024年3月12日以降に作成されたもの、またはサポートによってCentral Portalに移行されたもの）。
* 継続的インテグレーションにGitHub Actionsを使用している。

> 異なるセットアップを使用している場合でも、ここでの手順のほとんどは適用可能ですが、考慮すべきいくつかの違いがある場合があります。
> 
> [重要な制限](multiplatform-publish-lib-setup.md#host-requirements)として、AppleターゲットはmacOSを搭載したマシンでビルドする必要があります。
> 
{style="note"}

## サンプルライブラリ

このチュートリアルでは、例として[fibonacci](https://github.com/Kotlin/multiplatform-library-template/)ライブラリを使用します。
公開設定がどのように機能するかについては、そのリポジトリのコードを参照してください。

コードを再利用する場合は、**すべてのサンプル値を自身のプロジェクト固有の値に置き換える必要があります**。

## アカウントと認証情報の準備

Maven Centralへの公開を開始するには、[Maven Central](https://central.sonatype.com/)ポータルでサインイン（または新しいアカウントを作成）してください。

### ネームスペースの選択と確認

Maven Centralでライブラリのアーティファクトを一意に識別するために、確認済みのネームスペース（名前空間）が必要です。

Mavenのアーティファクトは、[座標（coordinates）](https://central.sonatype.org/publish/requirements/#correct-coordinates)によって識別されます。例えば、`com.example:fibonacci-library:1.0.0` のようになります。これらの座標は、コロンで区切られた3つの部分で構成されます。

* `groupId`: 逆DNS形式。例: `com.example`
* `artifactId`: ライブラリ自体のユニークな名前。例: `fibonacci-library`
* `version`: バージョン文字列。例: `1.0.0`。バージョンは任意の文字列にできますが、`-SNAPSHOT` で終わることはできません。

登録されたネームスペースを使用すると、Maven Centralでの `groupId` の形式を設定できます。例えば、`com.example` ネームスペースを登録すると、`groupId` を `com.example`、`com.example.libraryname`、`com.example.module.feature` などに設定してアーティファクトを公開できます。

Maven Centralにサインインしたら、[Namespaces](https://central.sonatype.com/publishing/namespaces)ページに移動します。次に、**Add Namespace**ボタンをクリックして、ネームスペースを登録します。

<Tabs>
<TabItem id="github" title="GitHubリポジトリを使用する場合">

ドメイン名を所有していない場合は、GitHubアカウントを使用してネームスペースを作成するのが良い選択肢です。

1. ネームスペースとして `io.github.<your username>` を入力します（例: `io.github.kotlinhandson`）。その後、**Submit**をクリックします。
2. 新しく作成されたネームスペースの下に表示される**Verification Key**（確認キー）をコピーします。
3. GitHubで、使用したユーザー名でログインし、確認キーをリポジトリ名とした新しいパブリックリポジトリを作成します（例: `http://github.com/kotlin-hands-on/ex4mpl3c0d`）。
4. Maven Centralに戻り、**Verify Namespace**ボタンをクリックします。確認に成功したら、作成したリポジトリは削除して構いません。

</TabItem>
<TabItem id="domain" title="ドメイン名を使用する場合">

所有しているドメイン名をネームスペースとして使用するには：

1. ドメインを逆DNS形式でネームスペースとして入力します。ドメインが `example.com` の場合は、`com.example` と入力します。
2. 表示された**Verification Key**をコピーします。
3. その確認キーを内容とする新しいTXT DNSレコードを作成します。

   さまざまなドメイン登録業者での設定方法については、[Maven CentralのFAQ](https://central.sonatype.org/faq/how-to-set-txt-record/)を参照してください。
4. Maven Centralに戻り、**Verify Namespace**ボタンをクリックします。確認に成功したら、作成したTXTレコードは削除して構いません。

</TabItem>
</Tabs>

#### キーペアの生成

Maven Centralに何かを公開する前に、[PGP署名](https://central.sonatype.org/publish/requirements/gpg/)でアーティファクトに署名する必要があります。これにより、ユーザーはアーティファクトの出所を検証できます。

署名を開始するには、キーペアを生成する必要があります。

* **秘密鍵（private key）**はアーティファクトの署名に使用され、決して他人に共有してはいけません。
* **公開鍵（public key）**は、他人がアーティファクトの署名を検証できるように共有できます。

<Tabs group ="key-pair-tools">
<TabItem title="Kotlin Gradleプラグインを使用する場合" group-key="kgp">

Kotlin Gradleプラグインには、キーペアの生成に使用できるGradleタスクがあります。

1. 次のコマンドを使用してキーペアを生成します。秘密鍵ストアのパスワードと名前を次の形式で指定してください。

    ```bash
    ./gradlew -Psigning.password=example-password generatePgpKeys --name "John Smith <john@example.com>"
    ```

   キーペアは `build/pgp` ディレクトリに保存されます。

2. 誤った削除や不正なアクセスを防ぐため、キーペアを `build/pgp` ディレクトリから安全な場所に移動してください。

</TabItem>
<TabItem title="gpgツールを使用する場合" group-key="gpg">

署名を管理できる `gpg` ツールは、[GnuPGのWebサイト](https://gnupg.org/download/index.html)から入手できます。[Homebrew](https://brew.sh/)などのパッケージマネージャーを使用してインストールすることもできます。

```bash 
brew install gpg
```

1. 次のコマンドを使用してキーペアの生成を開始し、プロンプトが表示されたら必要な詳細情報を入力します。

    ```bash
    gpg --full-generate-key
    ```

2. 作成するキーのタイプとして、推奨されるデフォルトを選択します。
   選択項目を空のままにして <shortcut>Enter</shortcut> を押すと、デフォルト値が受け入れられます。

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

   > 執筆時点では、これは `Curve 25519` を使用した `ECC (sign and encrypt)` です。
   > 古いバージョンの `gpg` では、キーサイズが `3072` ビットの `RSA` がデフォルトになる場合があります。
   >
   {style="note"}

3. キーの有効期限を指定するよう求められたら、デフォルトの無期限を選択できます。

   一定期間後に自動的に期限切れになるキーを作成することを選択した場合は、期限が切れたときに[有効期限を延長](https://central.sonatype.org/publish/requirements/gpg/#dealing-with-expired-keys)する必要があります。

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

4. キーをIDに関連付けるための名前、メールアドレス、およびオプションのコメントを入力します（コメントフィールドは空のままにできます）。

    ```text
    GnuPG needs to construct a user ID to identify your key.

    Real name: Jane Doe
    Email address: janedoe@example.com
    Comment:
    You selected this USER-ID:
        "Jane Doe <janedoe@example.com>"
    ```

5. キーを暗号化するためのパスフレーズを入力し、プロンプトが表示されたらもう一度入力します。

   このパスフレーズは安全かつプライベートに保管してください。後でアーティファクトに署名する際に秘密鍵にアクセスするために必要になります。

6. 次のコマンドで作成したキーを確認します。

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

    次のステップでは、出力に表示されるキーの長い英数字の識別子（キーID）を使用する必要があります。

</TabItem>
</Tabs>

#### 公開鍵のアップロード

Maven Centralに受け入れられるためには、[公開鍵をキーサーバーにアップロード](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)する必要があります。利用可能なキーサーバーは複数ありますが、デフォルトの選択肢として `keyserver.ubuntu.com` を使用しましょう。

<Tabs group ="key-pair-tools">
<TabItem title="Kotlin Gradleプラグインを使用する場合" group-key="kgp">

Kotlin Gradleプラグインには、公開鍵のアップロードに使用できるGradleタスクがあります。

次のコマンドを実行して、パスを指定して公開鍵をアップロードします。

```bash
./gradlew uploadPublicPgpKey --keyring /path_to/build/pgp/public_KEY_ID.asc
```

</TabItem>
<TabItem title="gpgツールを使用する場合" group-key="gpg">

Maven Centralに受け入れられるためには、[公開鍵をキーサーバーにアップロード](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)する必要があります。利用可能なキーサーバーは複数ありますが、デフォルトの選択肢として `keyserver.ubuntu.com` を使用しましょう。

次のコマンドを実行して、`gpg` を使用して公開鍵をアップロードします。パラメータには**自身のキーIDを代入**してください。

```bash
gpg --keyserver keyserver.ubuntu.com --send-keys F175482952A225BFC4A07A715EE6B5F76620B385CE
```

**秘密鍵のエクスポート** {id="export-your-private-key"}

Gradleプロジェクトが秘密鍵にアクセスできるようにするには、秘密鍵をファイルにエクスポートする必要があります。
キーを作成したときに使用したパスフレーズの入力を求められます。

次のコマンドを使用し、パラメータとして**自身のキーIDを渡して**ください。

```bash
gpg --armor --export-secret-keys F175482952A225BFC4A07A715EE6B5F76620B385CE > key.gpg
```

このコマンドにより、秘密鍵を含む `key.gpg` テキストファイルが作成されます。

> 秘密鍵ファイルは決して誰とも共有しないでください。秘密鍵を使用すると、あなたの認証情報でファイルに署名できてしまうため、あなただけがアクセスできるようにする必要があります。
>
{style="warning"}

</TabItem>
</Tabs>

## プロジェクトの構成

### ライブラリプロジェクトの準備

テンプレートプロジェクトからライブラリの開発を開始した場合は、プロジェクト内のデフォルトの名前を自分のライブラリの名前に変更するのに適したタイミングです。これには、ライブラリモジュールの名前と、トップレベルの `build.gradle.kts` ファイル内のルートプロジェクトの名前が含まれます。

プロジェクトにAndroidターゲットがある場合は、[Androidライブラリリリースの準備手順](https://developer.android.com/build/publish-library/prep-lib-release)に従ってください。最低限、リソースがコンパイルされる際に一意の `R` クラスが生成されるよう、[ライブラリに適切なネームスペースを指定](https://developer.android.com/build/publish-library/prep-lib-release#choose-namespace)する必要があります。
このネームスペースは、[先ほど作成した](#choose-and-verify-a-namespace)Mavenのネームスペースとは異なることに注意してください。

```kotlin
// build.gradle.kts

android {
    namespace = "io.github.kotlinhandson.fibonacci"
}
```

### 公開用プラグインのセットアップ

このチュートリアルでは、Maven Centralへの公開を支援するために [vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin) を使用します。
このプラグインの利点については、[こちら](https://vanniktech.github.io/gradle-maven-publish-plugin/#advantages-over-maven-publish)で詳しく読むことができます。
使用方法や利用可能な構成オプションの詳細については、[プラグインのドキュメント](https://vanniktech.github.io/gradle-maven-publish-plugin/central/)を参照してください。

プロジェクトにプラグインを追加するには、ライブラリモジュールの `build.gradle.kts` ファイルの `plugins {}` ブロックに次の行を追加します。

```kotlin
// <module directory>/build.gradle.kts

plugins {
    id("com.vanniktech.maven.publish") version "%vanniktechPublishPlugin%" 
}
```

> プラグインの最新バージョンについては、[リリースページ](https://github.com/vanniktech/gradle-maven-publish-plugin/releases)を確認してください。
> 
{style="note"}

同じファイルに次の構成を追加し、すべての値をライブラリに合わせてカスタマイズしてください。

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

> これを構成するために、[Gradleプロパティ](https://docs.gradle.org/current/userguide/build_environment.html)を使用することもできます。
> 
{style="tip"}

ここでの最も重要な設定は以下の通りです。

* `coordinates`: ライブラリの `groupId`、`artifactId`、および `version` を指定します。
* [ライセンス（license）](https://central.sonatype.org/publish/requirements/#license-information): ライブラリが公開されるライセンスを指定します。
* [開発者情報（developer information）](https://central.sonatype.org/publish/requirements/#developer-information): ライブラリの作者をリストします。
* [SCM（Source Code Management）情報](https://central.sonatype.org/publish/requirements/#scm-information): ライブラリのソースコードがホストされている場所を指定します。

### ローカルチェックの実行

Maven Centralに公開する前に、プロジェクトが正しく構成されているかローカルで確認することをお勧めします。

#### 署名のローカル確認

次のコマンドを実行して、署名のためにキーが正しく構成されていることを確認します。

```bash
./gradlew checkSigningConfiguration
```

このGradleタスクは、公開鍵が `keyserver.ubuntu.com` または `keys.openpgp.org` のいずれかのキーサーバーにアップロードされていることを確認します。

タスクがエラーを報告した場合は、出力を確認して修正方法の詳細を確認してください。

#### `pom.xml` ファイルのローカル確認

ライブラリをMaven Centralに公開するには、`pom.xml` ファイルがMaven Centralの[要件](https://central.sonatype.org/publish/requirements/#required-pom-metadata)を満たしている必要があります。

公開予定の各ライブラリについて、`<PUBLICATION_NAME>` をパブリケーション名に置き換えて、次のコマンドを実行します。

```bash
./gradlew checkPomFileFor<PUBLICATION_NAME>Publication
```

[vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin) を使用している場合、通常パブリケーション名は `Maven` です。この場合、タスクは次のようになります。

```bash
./gradlew checkPomFileForMavenPublication
```

タスクがエラーを報告した場合は、出力を確認して修正方法の詳細を確認してください。

## 継続的インテグレーションを使用したMaven Centralへの公開

### ユーザートークンの生成

公開リクエストを承認するために、Maven Central用のMavenアクセストークンが必要です。
[Setup Token-Based Authentication](https://central.sonatype.com/usertoken) ページを開き、**Generate User Token** ボタンをクリックします。

出力は以下の例のようになり、ユーザー名とパスワードが含まれています。
これらの認証情報はMaven Centralには保存されないため、紛失した場合は後で新しいものを生成する必要があります。

```xml
<server>
    <id>${server}</id>
    <username>l2nfaPmz</username>
    <password>gh9jT9XfnGtUngWTZwTu/8141keYdmQpipqLPRKeDLTh</password>
</server>
```

### GitHubへのシークレットの追加

公開に必要なキーや認証情報を非公開に保ちつつGitHub Actionワークフローで使用するには、これらの値をシークレットとして保存する必要があります。

1. GitHubリポジトリの **Settings** ページで、**Security** | **Secrets and variables** | **Actions** をクリックします。
2. `New repository secret` ボタンをクリックし、以下のシークレットを追加します。

   * `MAVEN_CENTRAL_USERNAME` と `MAVEN_CENTRAL_PASSWORD`: Central PortalのWebサイトで[ユーザートークン用に生成された値](#generate-the-user-token)です。
   * `SIGNING_KEY_ID`: 署名キーの識別子の**下8桁**です。例えば、`F175482952A225BFC4A07A715EE6B5F76620B385CE` の場合は `20B385CE` です。
   * `SIGNING_PASSWORD`: GPGキーの生成時に指定したパスフレーズです。
   * `GPG_KEY_CONTENTS`: [作成した `key.gpg` ファイル](#export-your-private-key)の内容全体を含める必要があります。

   ![GitHubへのシークレットの追加](github_secrets.png){width=700}

次のステップのCI構成で、これらのシークレットの名前を使用します。

### プロジェクトへのGitHub Actionsワークフローの追加

継続的インテグレーションを設定して、ライブラリのビルドと公開を自動的に行うことができます。
ここでは例として [GitHub Actions](https://docs.github.com/en/actions) を使用します。

まず、リポジトリの `.github/workflows/publish.yml` ファイルに次のワークフローを追加します。

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

このファイルをコミットしてプッシュすると、プロジェクトをホストしているGitHubリポジトリでリリース（プレリリースを含む）が作成されるたびに、ワークフローが自動的に実行されます。ワークフローは、現在のバージョンのコードをチェックアウトし、JDKをセットアップしてから、`publishToMavenCentral` Gradleタスクを実行します。

`publishToMavenCentral` タスクを使用する場合、Maven CentralのWebサイトでデプロイメントを確認し、[手動でリリース（release）](#create-a-release-on-github)する必要があります。あるいは、`publishAndReleaseToMavenCentral` タスクを使用して、リリースプロセスを完全に自動化することもできます。

また、[タグがプッシュされたときにトリガーされる](https://stackoverflow.com/a/61892639)ようにワークフローを構成することも可能です。

> 上記のスクリプトでは、公開用プラグインがGradleの[構成キャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)をサポートしていないため（この[オープンイシュー](https://github.com/gradle/gradle/issues/22779)を参照）、Gradleコマンドに `--no-configuration-cache` を追加して、公開タスクの構成キャッシュを無効にしています。
>
{style="tip"}

このアクションには、署名の詳細とMaven Centralの認証情報が必要であり、これらは[リポジトリシークレット](#add-secrets-to-github)として作成済みです。

ワークフローの構成により、これらのシークレットは自動的に環境変数に転送され、Gradleのビルドプロセスで利用可能になります。

### GitHubでのリリースの作成

ワークフローとシークレットがセットアップされたので、ライブラリの公開をトリガーする[リリースを作成](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)する準備が整いました。

1. ライブラリの `build.gradle.kts` ファイルで指定されているバージョン番号が、公開したいものであることを確認してください。
2. GitHubリポジトリのメインページに移動します。
3. 右側のサイドバーで、**Releases** をクリックします。
4. **Draft a new release** ボタン（このリポジトリでこれまでにリリースを作成したことがない場合は **Create a new release** ボタン）をクリックします。
5. 各リリースにはタグがあります。タグのドロップダウンで新しいタグを作成し、リリースのタイトルを設定します（タグ名とタイトルは同じでも構いません）。
   
   これらは通常、`build.gradle.kts` ファイルで指定したライブラリのバージョン番号と同じにします。

   ![GitHubでのリリースの作成](create_release_and_tag.png){width=700}

6. リリースの対象となるブランチを再確認し（特にデフォルトブランチでない場合）、新しいバージョンの適切なリリースノートを追加します。
7. 説明の下にあるチェックボックスを使用して、リリースをプレリリースとしてマークします（アルファ、ベータ、RCなどの早期アクセスバージョンに役立ちます）。
   
   また、このリリースを最新（Latest）としてマークすることもできます（以前にこのリポジトリでリリースを作成したことがある場合）。
8. **Publish release** ボタンをクリックして、新しいリリースを作成します。
9. GitHubリポジトリのページ上部にある **Actions** タブをクリックします。ここで、新しいリリースが公開ワークフローをトリガーしたことを確認できます。
    
   ワークフローをクリックすると、公開タスクの出力を表示できます。
10. ワークフローの実行が完了したら、Maven Centralの [Deployments](https://central.sonatype.com/publishing/deployments) ダッシュボードに移動します。ここに新しいデプロイメントが表示されるはずです。

    このデプロイメントは、Maven Centralがチェックを実行している間、しばらくの間 _pending_（保留中）または _validating_（検証中）の状態になることがあります。

11. デプロイメントが _validated_（検証済み）の状態になったら、アップロードしたすべてのアーティファクトが含まれていることを確認します。
    すべてが正しければ、**Publish** ボタンをクリックしてこれらのアーティファクトをリリースします。

    ![公開設定](published_on_maven_central.png){width=700}

    > リリース後、アーティファクトがMaven Centralリポジトリで一般に利用可能になるまでには、しばらく時間がかかります（通常は約15〜30分ですが、数時間かかる場合もあります）。[Maven CentralのWebサイト](https://central.sonatype.com/)でインデックスが作成され、検索可能になるまでには、さらに時間がかかる場合があります。
    >
    {style="tip"}

デプロイメントが確認されたら自動的にアーティファクトをリリースするようにするには、ワークフローの `publishToMavenCentral` タスクを `publishAndReleaseToMavenCentral` に置き換えてください。

## 次のステップ

* [マルチプラットフォームライブラリの公開設定と要件についての詳細を確認する](multiplatform-publish-lib-setup.md)
* [READMEにshield.ioのバッジを追加する](https://shields.io/badges/maven-central-version)
* [Dokkaを使用してプロジェクトのAPIドキュメントを公開する](https://kotl.in/dokka)
* [依存関係を自動的に更新するためにRenovateを追加する](https://docs.renovatebot.com/)
* [JetBrainsの検索プラットフォームでライブラリを宣伝する](https://klibs.io/)
* [Kotlin Slackの `#feed` チャンネルでコミュニティとライブラリを共有する](https://kotlinlang.slack.com/)
  （サインアップは https://kotl.in/slack から）