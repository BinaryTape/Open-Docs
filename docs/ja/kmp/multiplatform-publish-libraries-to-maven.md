[//]: # (title: ライブラリを Maven Central に公開する – チュートリアル)

このチュートリアルでは、Kotlin マルチプラットフォームライブラリを [Maven Central](https://central.sonatype.com/) リポジトリに公開する方法を学びます。

ライブラリを公開するには、以下の手順が必要です。

1. Maven Central のアカウントや署名用の PGP キーを含む、認証情報の設定。
2. ライブラリプロジェクトでの公開用プラグインの設定。
3. アーティファクトの署名とアップロードができるように、公開用プラグインに認証情報を提供。
4. ローカルまたは継続的インテグレーション（CI）を使用して公開タスクを実行。

このチュートリアルでは、以下を前提としています。

* オープンソースライブラリを作成していること。
* ライブラリのコードを GitHub リポジトリで管理していること。
* macOS または Linux を使用していること。Windows ユーザーの場合は、[GnuPG または Gpg4win](https://gnupg.org/download) を使用してキーペアを生成してください。
* Maven Central に未登録であるか、[Central Portal への公開](https://central.sonatype.org/publish-ea/publish-ea-guide/)に適した既存のアカウント（2024年3月12日以降に作成されたもの、またはサポートによって Central Portal に移行されたもの）を持っていること。
* 継続的インテグレーションに GitHub Actions を使用していること。

> セットアップが異なる場合でも、ここでの手順のほとんどは適用可能ですが、考慮すべき相違点がある場合があります。
> 
> [重要な制限事項](multiplatform-publish-lib-setup.md#host-requirements)として、Apple ターゲットは macOS を搭載したマシンでビルドする必要があります。
> 
{style="note"}

## サンプルライブラリ

このチュートリアルでは、例として [fibonacci](https://github.com/Kotlin/multiplatform-library-template/) ライブラリを使用します。
公開設定がどのように機能するかについては、そのリポジトリのコードを参照してください。

コードを再利用する場合は、**すべての例の値をプロジェクト固有の値に置き換える**必要があります。

## アカウントと認証情報の準備

Maven Central への公開を開始するには、[Maven Central](https://central.sonatype.com/) ポータルにサインイン（または新しいアカウントを作成）します。

### ネームスペースの選択と検証

Maven Central 上でライブラリのアーティファクトを一意に識別するために、検証済みのネームスペースが必要です。

Maven のアーティファクトは、[座標 (Coordinates)](https://central.sonatype.org/publish/requirements/#correct-coordinates) によって識別されます（例: `com.example:fibonacci-library:1.0.0`）。これらの座標は、コロンで区切られた3つの部分で構成されます。

* `groupId`: `com.example` のような逆ドメイン形式。
* `artifactId`: ライブラリ自体のユニークな名前（例: `fibonacci-library`）。
* `version`: バージョン文字列（例: `1.0.0`）。バージョンは任意の文字列にできますが、`-SNAPSHOT` で終わることはできません。

登録したネームスペースによって、Maven Central での `groupId` の形式を設定できます。例えば、`com.example` というネームスペースを登録すると、`groupId` を `com.example`、`com.example.libraryname`、`com.example.module.feature` などに設定してアーティファクトを公開できます。

Maven Central にサインインしたら、[Namespaces](https://central.sonatype.com/publishing/namespaces) ページに移動します。次に、**Add Namespace** ボタンをクリックしてネームスペースを登録します。

<Tabs>
<TabItem id="github" title="GitHub リポジトリを使用する場合">

ドメイン名を所有していない場合は、GitHub アカウントを使用してネームスペースを作成するのが良い選択肢です。

1. ネームスペースとして `io.github.<あなたのユーザー名>`（例: `io.github.kotlinhandson`）を入力し、**Submit** をクリックします。
2. 新しく作成されたネームスペースの下に表示される **Verification Key** をコピーします。
3. GitHub で、使用したユーザー名でログインし、検証キーをリポジトリ名とした新しいパブリックリポジトリを作成します（例: `http://github.com/kotlin-hands-on/ex4mpl3c0d`）。
4. Maven Central に戻り、**Verify Namespace** ボタンをクリックします。検証に成功したら、作成したリポジトリは削除して構いません。

</TabItem>
<TabItem id="domain" title="ドメイン名を使用する場合">

所有しているドメイン名をネームスペースとして使用する場合：

1. 逆ドメイン形式を使用して、ドメインをネームスペースとして入力します。ドメインが `example.com` の場合は、`com.example` と入力します。
2. 表示された **Verification Key** をコピーします。
3. 検証キーを内容とする新しい TXT DNS レコードを作成します。

   各種ドメイン登録業者での設定方法については、[Maven Central の FAQ](https://central.sonatype.org/faq/how-to-set-txt-record/) を参照してください。
4. Maven Central に戻り、**Verify Namespace** ボタンをクリックします。検証に成功したら、作成した TXT レコードは削除して構いません。

</TabItem>
</Tabs>

#### キーペアの生成

Maven Central に何かを公開する前に、アーティファクトに [PGP 署名](https://central.sonatype.org/publish/requirements/gpg/)を付与する必要があります。これにより、ユーザーはアーティファクトの出所を検証できるようになります。

署名を始めるには、キーペアを生成する必要があります。

* **秘密鍵 (Private key)** はアーティファクトの署名に使用され、他人に共有してはいけません。
* **公開鍵 (Public key)** は、他人がアーティファクトの署名を検証できるように共有することができます。

<Tabs group ="key-pair-tools">
<TabItem title="Kotlin Gradle プラグインを使用する場合" group-key="kgp">

Kotlin Gradle プラグインには、キーペアを生成するために使用できる Gradle タスクがあります。

1. 次のコマンドを使用してキーペアを生成します。秘密鍵ストアのパスワードと、あなたの名前を次の形式で入力してください。

    ```bash
    ./gradlew -Psigning.password=example-password generatePgpKeys --name "John Smith <john@example.com>"
    ```

   キーペアは `build/pgp` ディレクトリに保存されます。

2. 誤った削除や不正アクセスを防ぐため、キーペアを `build/pgp` ディレクトリから安全な場所に移動してください。

</TabItem>
<TabItem title="gpg ツールを使用する場合" group-key="gpg">

署名を管理できる `gpg` ツールは、[GnuPG のウェブサイト](https://gnupg.org/download/index.html)から入手できます。[Homebrew](https://brew.sh/) などのパッケージマネージャーを使用してインストールすることもできます。

```bash 
brew install gpg
```

1. 次のコマンドを使用してキーペアの生成を開始し、プロンプトが表示されたら必要な詳細情報を入力します。

    ```bash
    gpg --full-generate-key
    ```

2. 作成するキーのタイプとして、推奨されるデフォルト値を選択します。
   選択を空のままにして <shortcut>Enter</shortcut> を押すと、デフォルト値が適用されます。

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

   > 本稿執筆時点では、これは `ECC (sign and encrypt)` で `Curve 25519` です。
   > 古いバージョンの `gpg` では、デフォルトが `RSA` で `3072` ビットのキーサイズになっている場合があります。
   >
   {style="note"}

3. キーの有効期間を指定するプロンプトが表示されたら、デフォルトの無期限を選択できます。

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

4. キーを ID に関連付けるために、名前、メールアドレス、およびオプションのコメントを入力します（コメントフィールドは空のままでも構いません）。

    ```text
    GnuPG needs to construct a user ID to identify your key.

    Real name: Jane Doe
    Email address: janedoe@example.com
    Comment:
    You selected this USER-ID:
        "Jane Doe <janedoe@example.com>"
    ```

5. キーを暗号化するためのパスフレーズを入力し、確認のためにもう一度入力します。

   このパスフレーズは安全かつプライベートに保管してください。後でアーティファクトに署名する際、秘密鍵にアクセスするために必要になります。

6. 次のコマンドで作成したキーを確認します。

   ```bash
   gpg --list-keys
   ```

   出力は以下のようになります。

    ```text
    pub   ed25519 2024-10-06 [SC]
          F175482952A225BFD4A07A713EE6B5F76620B385CE
    uid   [ultimate] Jane Doe <janedoe@example.com>
          sub   cv25519 2024-10-06 [E]
    ```

    次のステップでは、出力に表示されるキーの長い英数字の識別子を使用する必要があります。

</TabItem>
</Tabs>

#### 公開鍵のアップロード

Maven Central に受け入れられるためには、[公開鍵をキーサーバーにアップロード](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)する必要があります。利用可能なキーサーバーは複数ありますが、デフォルトとして `keyserver.ubuntu.com` を使用しましょう。

<Tabs group ="key-pair-tools">
<TabItem title="Kotlin Gradle プラグインを使用する場合" group-key="kgp">

Kotlin Gradle プラグインには、公開鍵をアップロードするために使用できる Gradle タスクがあります。

次のコマンドを実行して、公開鍵のパスを指定してアップロードします。

```bash
./gradlew uploadPublicPgpKey --keyring /path_to/build/pgp/public_KEY_ID.asc
```

</TabItem>
<TabItem title="gpg ツールを使用する場合" group-key="gpg">

Maven Central に受け入れられるためには、[公開鍵をキーサーバーにアップロード](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key)する必要があります。利用可能なキーサーバーは複数ありますが、デフォルトとして `keyserver.ubuntu.com` を使用しましょう。

次のコマンドを実行して、`gpg` を使用して公開鍵をアップロードします。パラメータには**自身のキー ID を指定**してください。

```bash
gpg --keyserver keyserver.ubuntu.com --send-keys F175482952A225BFC4A07A715EE6B5F76620B385CE
```

**秘密鍵のエクスポート** {id="export-your-private-key"}

Gradle プロジェクトが秘密鍵にアクセスできるようにするには、秘密鍵をファイルにエクスポートする必要があります。
キーの作成時に使用したパスフレーズの入力を求められます。

次のコマンドを使用し、パラメータとして**自身のキー ID を渡して**ください。

```bash
gpg --armor --export-secret-keys F175482952A225BFC4A07A715EE6B5F76620B385CE > key.gpg
```

このコマンドは、秘密鍵を含む `key.gpg` テキストファイルを作成します。

> 秘密鍵ファイルを決して他人に共有しないでください。秘密鍵があれば、あなたの認証情報でファイルに署名できてしまうため、あなただけがアクセスできるようにする必要があります。
>
{style="warning"}

</TabItem>
</Tabs>

## プロジェクトの設定

### ライブラリプロジェクトの準備

テンプレートプロジェクトからライブラリの開発を始めた場合は、このタイミングでプロジェクト内のデフォルト名を自身のライブラリ名に合わせるのが良いでしょう。これには、ライブラリモジュールの名前や、トップレベルの `build.gradle.kts` ファイル内のルートプロジェクト名が含まれます。

プロジェクトに Android ターゲットが含まれている場合は、[Android ライブラリリリースの準備手順](https://developer.android.com/build/publish-library/prep-lib-release)に従う必要があります。最低限、リソースがコンパイルされたときに一意の `R` クラスが生成されるように、ライブラリに[適切なネームスペースを指定](https://developer.android.com/build/publish-library/prep-lib-release#choose-namespace)する必要があります。
このネームスペースは、[先ほど作成した](#choose-and-verify-a-namespace) Maven のネームスペースとは異なることに注意してください。

```kotlin
// build.gradle.kts

android {
    namespace = "io.github.kotlinhandson.fibonacci"
}
```

### 公開用プラグインのセットアップ

このチュートリアルでは、Maven Central への公開を支援するために [vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin) を使用します。
このプラグインの利点については、[こちら](https://vanniktech.github.io/gradle-maven-publish-plugin/#advantages-over-maven-publish)で詳しく読むことができます。使用方法や利用可能な設定オプションの詳細については、[プラグインのドキュメント](https://vanniktech.github.io/gradle-maven-publish-plugin/central/)を参照してください。

プロジェクトにプラグインを追加するには、ライブラリモジュールの `build.gradle.kts` ファイルの `plugins {}` ブロックに次の行を追加します。

```kotlin
// <モジュールディレクトリ>/build.gradle.kts

plugins {
    id("com.vanniktech.maven.publish") version "%vanniktechPublishPlugin%" 
}
```

> プラグインの最新バージョンについては、[リリースページ](https://github.com/vanniktech/gradle-maven-publish-plugin/releases)を確認してください。
> 
{style="note"}

同じファイルに次の設定を追加し、すべての値を自身のライブラリに合わせてカスタマイズしてください。

```kotlin
// <モジュールディレクトリ>/build.gradle.kts

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

> これを設定するために、[Gradle プロパティ](https://docs.gradle.org/current/userguide/build_environment.html)を使用することもできます。
> 
{style="tip"}

ここでの最も重要な設定は以下の通りです。

* `coordinates`: ライブラリの `groupId`、`artifactId`、および `version` を指定します。
* [ライセンス (License)](https://central.sonatype.org/publish/requirements/#license-information): ライブラリが公開されるライセンス。
* [開発者情報 (Developer information)](https://central.sonatype.org/publish/requirements/#developer-information): ライブラリの作者のリスト。
* [SCM (Source Code Management) 情報](https://central.sonatype.org/publish/requirements/#scm-information): ライブラリのソースコードがホストされている場所を指定します。

### ローカルでのチェック

Maven Central に公開する前に、プロジェクトが正しく設定されているかローカルで確認することをお勧めします。

#### 署名のローカルチェック

次のコマンドを実行して、署名用のキーが正しく設定されているか確認します。

```bash
./gradlew checkSigningConfiguration
```

この Gradle タスクは、公開鍵が `keyserver.ubuntu.com` または `keys.openpgp.org` のいずれかのキーサーバーにアップロードされていることを確認します。

タスクがエラーを報告した場合は、出力内容を確認して修正方法を確認してください。

#### `pom.xml` ファイルのローカルチェック

ライブラリを Maven Central に公開するには、`pom.xml` ファイルが Maven Central の[要件](https://central.sonatype.org/publish/requirements/#required-pom-metadata)を満たしている必要があります。

公開予定の各ライブラリに対して、`<PUBLICATION_NAME>` を公開名に置き換えて次のコマンドを実行します。

```bash
./gradlew checkPomFileFor<PUBLICATION_NAME>Publication
```

[vanniktech/gradle-maven-publish-plugin](https://github.com/vanniktech/gradle-maven-publish-plugin) を使用している場合、公開名は通常 `Maven` になります。その場合、タスクは以下のようになります。

```bash
./gradlew checkPomFileForMavenPublication
```

タスクがエラーを報告した場合は、出力内容を確認して修正方法を確認してください。

## 継続的インテグレーションを使用した Maven Central への公開

### ユーザートークンの生成

公開リクエストを承認するために、Maven Central 用の Maven アクセストークンが必要です。
[Setup Token-Based Authentication](https://central.sonatype.com/usertoken) ページを開き、**Generate User Token** ボタンをクリックします。

出力は以下の例のようになり、ユーザー名とパスワードが含まれています。
これらの認証情報は Maven Central に保存されないため、紛失した場合は後で新しく生成する必要があります。

```xml
<server>
    <id>${server}</id>
    <username>l2nfaPmz</username>
    <password>gh9jT9XfnGtUngWTZwTu/8141keYdmQpipqLPRKeDLTh</password>
</server>
```

### GitHub へのシークレットの追加

公開に必要なキーや認証情報を GitHub Actions ワークフローで使用しつつ非公開に保つために、これらの値をシークレットとして保存する必要があります。

1. GitHub リポジトリの **Settings** ページで、**Security** | **Secrets and variables** | **Actions** をクリックします。
2. `New repository secret` ボタンをクリックし、次のシークレットを追加します。

   * `MAVEN_CENTRAL_USERNAME` と `MAVEN_CENTRAL_PASSWORD`: Central Portal のウェブサイトで[生成されたユーザートークン](#generate-the-user-token)の値。
   * `SIGNING_KEY_ID`: 署名キーの識別子の**末尾 8 文字**。例えば、`F175482952A225BFC4A07A715EE6B5F76620B385CE` の場合は `20B385CE` になります。
   * `SIGNING_PASSWORD`: GPG キーの生成時に指定したパスフレーズ。
   * `GPG_KEY_CONTENTS`: [自身の `key.gpg` ファイル](#export-your-private-key)の全内容。

   ![GitHub へのシークレットの追加](github-secrets.png){width=700}

次のステップの CI 設定で、これらのシークレットの名前を使用します。

### プロジェクトへの GitHub Actions ワークフローの追加

継続的インテグレーションを設定して、ライブラリのビルドと公開を自動的に行うことができます。ここでは [GitHub Actions](https://docs.github.com/en/actions) を例として使用します。

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

このファイルをコミットしてプッシュすると、プロジェクトをホストしている GitHub リポジトリでリリース（プレリリースを含む）を作成するたびに、ワークフローが自動的に実行されます。ワークフローは、コードの現在のバージョンをチェックアウトし、JDK をセットアップし、`publishToMavenCentral` Gradle タスクを実行します。

`publishToMavenCentral` タスクを使用する場合、Maven Central のウェブサイトでデプロイを確認し、[手動でリリース](#create-a-release-on-github)する必要があります。あるいは、`publishAndReleaseToMavenCentral` タスクを使用して、リリースプロセスを完全に自動化することもできます。

リポジトリに[タグがプッシュされたときにトリガーされる](https://stackoverflow.com/a/61892639)ようにワークフローを設定することも可能です。

> 上記のスクリプトでは、公開用プラグインが [構成キャッシュ (Configuration cache)](https://docs.gradle.org/current/userguide/configuration_cache.html) をサポートしていないため（この [オープンな issue](https://github.com/gradle/gradle/issues/22779) を参照）、Gradle コマンドに `--no-configuration-cache` を追加して、公開タスクの構成キャッシュを無効にしています。
>
{style="tip"}

このアクションには、[リポジトリのシークレット](#add-secrets-to-github)として作成した署名の詳細と Maven Central の認証情報が必要です。

ワークフロー設定により、これらのシークレットが自動的に環境変数に転送され、Gradle のビルドプロセスで利用可能になります。

### GitHub でのリリース作成

ワークフローとシークレットが設定されたので、ライブラリの公開をトリガーする [リリースを作成](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release) する準備が整いました。

1. ライブラリの `build.gradle.kts` ファイルで指定されているバージョン番号が、公開したいものであることを確認してください。
2. GitHub リポジトリのメインページに移動します。
3. 右側のサイドバーで **Releases** をクリックします。
4. **Draft a new release** ボタンをクリックします（このリポジトリでまだリリースを作成したことがない場合は **Create a new release** ボタンをクリックします）。
5. 各リリースにはタグがあります。タグのドロップダウンで新しいタグを作成し、リリースのタイトルを設定します（タグ名とタイトルは同じでも構いません）。
   
   これらは、`build.gradle.kts` ファイルで指定したライブラリのバージョン番号と同じにすることをお勧めします。

   ![GitHub でのリリース作成](create-release-and-tag.png){width=700}

6. リリースの対象となるブランチ（特にデフォルトブランチ以外の場合）を再確認し、新しいバージョンの適切なリリースノートを追加します。
7. 説明の下にあるチェックボックスを使用して、リリースをプレリリース（アルファ、ベータ、RC などの早期アクセスバージョンに役立ちます）としてマークします。
   
   また、そのリリースを最新（Latest）としてマークすることもできます（以前にこのリポジトリでリリースを作成したことがある場合）。
8. **Publish release** ボタンをクリックして、新しいリリースを作成します。
9. GitHub リポジトリのページ上部にある **Actions** タブをクリックします。ここで、新しいリリースによって公開ワークフローがトリガーされたことが確認できます。
    
   ワークフローをクリックすると、公開タスクの出力を確認できます。
10. ワークフローの実行が完了したら、Maven Central の [Deployments](https://central.sonatype.com/publishing/deployments) ダッシュボードに移動します。ここに新しいデプロイメントが表示されているはずです。

    Maven Central がチェックを実行している間、このデプロイメントは一定時間 *pending* または *validating* 状態のままになることがあります。

11. デプロイメントが *validated* 状態になったら、アップロードしたすべてのアーティファクトが含まれていることを確認します。
    すべて正しければ、**Publish** ボタンをクリックして、これらのアーティファクトをリリースします。

    ![公開設定](published-on-maven-central.png){width=700}

    > リリース後、アーティファクトが Maven Central リポジトリで公開されるまでには、しばらく時間がかかります（通常は約15〜30分ですが、数時間かかる場合もあります）。[Maven Central のウェブサイト](https://central.sonatype.com/)でインデックスが作成され、検索可能になるまでには、さらに時間がかかる場合があります。
    >
    {style="tip"}

デプロイが検証されたら自動的にアーティファクトをリリースするには、ワークフローの `publishToMavenCentral` タスクを `publishAndReleaseToMavenCentral` に置き換えてください。

## 次のステップ

* [マルチプラットフォームライブラリの公開設定と要件について詳しく学ぶ](multiplatform-publish-lib-setup.md)
* [README に shield.io バッジを追加する](https://shields.io/badges/maven-central-version)
* [Dokka を使用してプロジェクトの API ドキュメントを共有する](https://kotl.in/dokka)
* [Renovate を追加して依存関係を自動的に更新する](https://docs.renovatebot.com/)
* [JetBrains の検索プラットフォームでライブラリを宣伝する](https://klibs.io/)
* [Kotlin Slack の `#feed` チャネルでコミュニティとライブラリを共有する](https://kotlinlang.slack.com/)
  （サインアップは https://kotl.in/slack を参照）