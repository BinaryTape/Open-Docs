[//]: # (title: Kotlin と TeamCity による継続的インテグレーション)

このページでは、Kotlin プロジェクトをビルドするために [TeamCity](https://www.jetbrains.com/teamcity/) をセットアップする方法について説明します。
TeamCity の詳細や基本については、インストールや基本設定などの情報が記載されている [ドキュメントページ](https://www.jetbrains.com/teamcity/documentation/) を参照してください。

Kotlin はさまざまなビルドツールに対応しているため、Maven や Gradle などの標準的なツールを使用している場合、Kotlin プロジェクトのセットアッププロセスは、これらのツールと統合される他の言語やライブラリと何ら変わりません。
わずかな要件と違いがあるのは、IntelliJ IDEA の内部ビルドシステムを使用する場合であり、これも TeamCity でサポートされています。

## Gradle と Maven

Maven または Gradle を使用する場合、セットアッププロセスは簡単です。必要なのは、ビルドステップ（Build Step）を定義することだけです。
例えば、Gradle を使用する場合、ランナータイプ（Runner Type）に対して、ステップ名（Step Name）や実行が必要な Gradle タスクなどの必要なパラメータを定義するだけです。

<img src="teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

Kotlin に必要なすべての依存関係は Gradle ファイルで定義されているため、Kotlin が正しく動作するために特別に設定する必要があるものは他にありません。

Maven を使用する場合も、同様の設定が適用されます。唯一の違いは、ランナータイプ（Runner Type）が Maven になることです。

## IntelliJ IDEA ビルドシステム

IntelliJ IDEA ビルドシステムを TeamCity で使用する場合は、IntelliJ IDEA で使用されている Kotlin のバージョンが、TeamCity で実行されるものと同じであることを確認してください。特定のバージョンの Kotlin プラグインをダウンロードして TeamCity にインストールする必要がある場合があります。

幸いなことに、手動作業の大部分を処理するメタランナー（meta-runner）が既に利用可能です。TeamCity メタランナーの概念に慣れていない場合は、[ドキュメント](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html) を確認してください。これは、プラグインを作成することなくカスタムランナーを導入できる、非常に簡単で強力な方法です。

### メタランナーのダウンロードとインストール

Kotlin 用のメタランナーは [GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity) で公開されています。そのメタランナーをダウンロードし、TeamCity のユーザーインターフェースからインポートしてください。

<img src="teamcity-metarunner.png" alt="Meta-runner" width="700"/>

### Kotlin コンパイラ取得ステップのセットアップ

基本的に、このステップはステップ名と必要な Kotlin のバージョンを定義するだけに限定されています。タグを使用することも可能です。

<img src="teamcity-setupkotlin.png" alt="Setup Kotlin Compiler" width="700"/>

ランナーは、IntelliJ IDEA プロジェクトのパス設定に基づいて、プロパティ `system.path.macro.KOTLIN.BUNDLED` の値を適切なものに設定します。ただし、この値は TeamCity 側で定義されている必要があります（任意の値に設定可能です）。そのため、システム変数（system variable）として定義する必要があります。

### Kotlin コンパイルステップのセットアップ

最後のステップは、標準の IntelliJ IDEA ランナータイプ（Runner Type）を使用して、プロジェクトの実際のコンパイルを定義することです。

<img src="teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

これで、プロジェクトがビルドされ、対応するアーティファクト（artifacts）が生成されるはずです。

## その他の CI サーバー

TeamCity 以外の継続的インテグレーションツールを使用している場合でも、そのツールがビルドツールのいずれかをサポートしているか、コマンドラインツールの呼び出しをサポートしている限り、Kotlin のコンパイルや CI プロセスの一環としての自動化は可能です。