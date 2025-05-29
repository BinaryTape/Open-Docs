[//]: # (title: KotlinとTeamCityによる継続的インテグレーション)

このページでは、[TeamCity](https://www.jetbrains.com/teamcity/) を設定してKotlinプロジェクトをビルドする方法を学びます。
TeamCityの詳しい情報や基本については、インストールや基本設定などの情報が掲載されている[ドキュメントページ](https://www.jetbrains.com/teamcity/documentation/)をご覧ください。

Kotlinはさまざまなビルドツールに対応しているため、Ant、Maven、Gradleなどの標準ツールを使用している場合、Kotlinプロジェクトのセットアッププロセスは、これらのツールと統合する他の言語やライブラリと何ら変わりません。
ただし、TeamCityでもサポートされているIntelliJ IDEAの内部ビルドシステムを使用する場合は、いくつかのわずかな要件と違いがあります。

## Gradle、Maven、およびAnt

Ant、Maven、またはGradleを使用している場合、セットアッププロセスは簡単です。必要なのはビルドステップを定義することだけです。
たとえば、Gradleを使用する場合、ステップ名やランナータイプで実行する必要があるGradleタスクなど、必要なパラメータを定義するだけです。

<img src="teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

Kotlinに必要なすべての依存関係はGradleファイルで定義されているため、Kotlinを正しく実行するために、他に特別な設定は必要ありません。

AntまたはMavenを使用する場合も、同じ設定が適用されます。唯一の違いは、ランナータイプがそれぞれAntまたはMavenになることです。

## IntelliJ IDEAビルドシステム

IntelliJ IDEAビルドシステムをTeamCityと連携して使用する場合、IntelliJ IDEAで使用されているKotlinのバージョンが、TeamCityで実行されているものと同じであることを確認してください。
特定のバージョンのKotlinプラグインをダウンロードし、TeamCityにインストールする必要があるかもしれません。

幸いなことに、ほとんどの手作業を処理してくれるメタランナーが既に利用可能です。TeamCityメタランナーの概念に慣れていない場合は、[ドキュメント](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html)をご確認ください。
これらは、プラグインを記述することなく、カスタムランナーを導入するための非常に簡単で強力な方法です。

### メタランナーのダウンロードとインストール

Kotlin用のメタランナーは[GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity)で入手できます。
そのメタランナーをダウンロードし、TeamCityのユーザーインターフェースからインポートします。

<img src="teamcity-metarunner.png" alt="Meta-runner" width="700"/>

### Kotlinコンパイラ取得ステップの設定

基本的にこのステップは、ステップ名と必要なKotlinのバージョンを定義することに限定されます。タグを使用できます。

<img src="teamcity-setupkotlin.png" alt="Setup Kotlin Compiler" width="700"/>

ランナーは、IntelliJ IDEAプロジェクトのパス設定に基づいて、プロパティ `system.path.macro.KOTLIN.BUNDLED` の値を正しいものに設定します。
しかし、この値はTeamCityで定義する必要があります（そして任意の値を設定できます）。
したがって、これをシステム変数として定義する必要があります。

### Kotlinコンパイルステップの設定

最後のステップは、プロジェクトの実際のコンパイルを定義することです。これは標準のIntelliJ IDEAランナータイプを使用します。

<img src="teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

これで、プロジェクトはビルドされ、対応する成果物が生成されるはずです。

## その他のCIサーバー

TeamCityとは異なる継続的インテグレーション（CI）ツールを使用している場合でも、いずれかのビルドツールをサポートしているか、コマンドラインツールを呼び出せる限り、KotlinのコンパイルとCIプロセスの一部としての自動化は可能であるはずです。