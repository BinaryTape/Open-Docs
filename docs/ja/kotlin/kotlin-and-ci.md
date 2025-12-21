[//]: # (title: KotlinとTeamCityでの継続的インテグレーション)

このページでは、[TeamCity](https://www.jetbrains.com/teamcity/) を設定してKotlinプロジェクトをビルドする方法を学びます。
TeamCityの詳細と基本については、インストール、基本設定などに関する情報が掲載されている[ドキュメントページ](https://www.jetbrains.com/teamcity/documentation/)をご確認ください。

Kotlinはさまざまなビルドツールで動作するため、MavenやGradleなどの標準的なツールを使用している場合、Kotlinプロジェクトのセットアッププロセスは、これらのツールと統合される他の言語やライブラリと何ら変わりありません。
いくつかの小さな要件と違いがあるのは、IntelliJ IDEAの内部ビルドシステムを使用する場合であり、これはTeamCityでもサポートされています。

## GradleとMaven

MavenまたはGradleを使用する場合、セットアッププロセスは簡単です。必要なのは、ビルドステップを定義することだけです。
たとえば、Gradleを使用している場合は、ステップ名やランナータイプで実行する必要があるGradleタスクなど、必要なパラメーターを定義するだけです。

<img src="teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

Kotlinに必要なすべての依存関係はGradleファイルで定義されているため、Kotlinが正しく実行されるように特に他を設定する必要はありません。

Mavenを使用する場合も、同じ設定が適用されます。唯一の違いは、ランナータイプがMavenになることです。

## IntelliJ IDEAビルドシステム

TeamCityでIntelliJ IDEAビルドシステムを使用する場合は、IntelliJ IDEAが使用しているKotlinのバージョンが、TeamCityが実行しているバージョンと同じであることを確認してください。特定のバージョンのKotlinプラグインをダウンロードしてTeamCityにインストールする必要がある場合があります。

幸いなことに、ほとんどの手作業を処理するメタランナーがすでに利用可能です。TeamCityのメタランナーの概念に慣れていない場合は、[ドキュメント](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html)をご確認ください。これらは、プラグインを記述することなく、カスタムランナーを導入するための非常に簡単で強力な方法です。

### メタランナーをダウンロードしてインストールする

Kotlin用メタランナーは[GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity)で利用可能です。
そのメタランナーをダウンロードし、TeamCityのユーザーインターフェースからインポートします。

<img src="teamcity-metarunner.png" alt="Meta-runner" width="700"/>

### Kotlinコンパイラのフェッチステップを設定する

基本的に、このステップはステップ名と必要なKotlinのバージョンを定義することに限定されます。タグを使用できます。

<img src="teamcity-setupkotlin.png" alt="Setup Kotlin Compiler" width="700"/>

ランナーは、IntelliJ IDEAプロジェクトからのパス設定に基づいて、プロパティ`system.path.macro.KOTLIN.BUNDLED`の値を正しいものに設定します。
ただし、この値はTeamCityで定義する必要があり（任意の値に設定できます）、そのためシステム変数として定義する必要があります。

### Kotlinコンパイルステップを設定する

最後のステップは、標準のIntelliJ IDEAランナータイプを使用する、プロジェクトの実際のコンパイルを定義することです。

<img src="teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

これにより、プロジェクトはビルドされ、対応する成果物が生成されるはずです。

## その他のCIサーバー

TeamCityとは異なる継続的インテグレーションツールを使用している場合でも、いずれかのビルドツール、またはコマンドラインツールの呼び出しをサポートしている限り、KotlinのコンパイルとCIプロセスの一部としての自動化は可能であるはずです。