---
title: KotlinとTeamCityによる継続的インテグレーション
---
このページでは、Kotlinプロジェクトをビルドするために[TeamCity](https://www.jetbrains.com/teamcity/)をセットアップする方法を学びます。TeamCityの詳細と基本については、インストール、基本的な構成などの情報が記載されている[ドキュメントページ](https://www.jetbrains.com/teamcity/documentation/)を確認してください。

Kotlinはさまざまなビルドツールと連携するため、Ant、Maven、Gradleなどの標準ツールを使用している場合、Kotlinプロジェクトのセットアッププロセスは、これらのツールと統合する他の言語やライブラリと変わりません。IntelliJ IDEAの内部ビルドシステムを使用する場合に、いくつかのわずかな要件と違いがあります。これもTeamCityでサポートされています。

## Gradle、Maven、およびAnt

Ant、Maven、またはGradleを使用する場合、セットアッププロセスは簡単です。必要なのはBuild Stepを定義することだけです。たとえば、Gradleを使用している場合は、Runner Typeに必要なパラメータ（Step Nameや実行する必要のあるGradleタスクなど）を定義するだけです。

<img src="/img/teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

Kotlinに必要なすべての依存関係はGradleファイルで定義されているため、Kotlinを正しく実行するために特に構成する必要があるものは他にありません。

AntまたはMavenを使用する場合も、同じ構成が適用されます。唯一の違いは、Runner TypeがそれぞれAntまたはMavenになることです。

## IntelliJ IDEA Build System

TeamCityでIntelliJ IDEAビルドシステムを使用する場合、IntelliJ IDEAで使用されているKotlinのバージョンが、TeamCityが実行しているバージョンと同じであることを確認してください。特定のバージョンのKotlinプラグインをダウンロードして、TeamCityにインストールする必要がある場合があります。

幸いなことに、ほとんどの手作業を処理するメタランナーがすでに利用可能です。TeamCityメタランナーの概念に慣れていない場合は、[ドキュメント](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html)を確認してください。プラグインを作成しなくても、カスタムRunnerを導入できる非常に簡単で強力な方法です。

### メタランナーのダウンロードとインストール

Kotlinのメタランナーは[GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity)で入手できます。そのメタランナーをダウンロードし、TeamCityのユーザーインターフェースからインポートします。

<img src="/img/teamcity-metarunner.png" alt="Meta-runner" width="700"/>

### Kotlinコンパイラフェッチステップのセットアップ

基本的に、このステップはStep Nameと必要なKotlinのバージョンを定義することに限定されます。タグを使用できます。

<img src="/img/teamcity-setupkotlin.png" alt="Setup Kotlin Compiler" width="700"/>

このランナーは、プロパティ`system.path.macro.KOTLIN.BUNDLED`の値を、IntelliJ IDEAプロジェクトのパス設定に基づいて正しい値に設定します。ただし、この値はTeamCityで定義する必要があり（任意の値に設定できます）、システム変数として定義する必要があります。

### Kotlinコンパイルステップのセットアップ

最後のステップは、プロジェクトの実際のコンパイルを定義することです。これには、標準のIntelliJ IDEA Runner Typeを使用します。

<img src="/img/teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

これで、プロジェクトがビルドされ、対応するアーティファクトが生成されるはずです。

## その他のCIサーバー

TeamCityとは異なる継続的インテグレーションツールを使用している場合でも、ビルドツールのいずれかをサポートしているか、コマンドラインツールを呼び出すことができる限り、Kotlinをコンパイルし、CIプロセスの一部として物事を自動化することが可能です。