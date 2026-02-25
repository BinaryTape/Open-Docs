[//]: # (title: サーバーサイドにおける Kotlin)

Kotlinは、サーバーサイドアプリケーションの開発に非常に適しています。既存のJavaベースのテクノロジースタックとの完全な互換性を維持しながら、簡潔で表現力豊かなコードを書くことができ、学習曲線も緩やかです。

* **表現力**: [型セーフビルダー](type-safe-builders.md)や[委譲プロパティ](delegated-properties.md)といったKotlinの革新的な言語機能は、強力で使いやすい抽象化を構築するのに役立ちます。
* **スケーラビリティ**: Kotlinの[コルーチン](coroutines-overview.md)のサポートにより、控えめなハードウェア要件で、膨大な数のクライアントに対応できるサーバーサイドアプリケーションを構築できます。
* **相互運用性**: KotlinはすべてのJavaベースのフレームワークと完全に互換性があるため、使い慣れたテクノロジースタックをそのまま使用しながら、よりモダンな言語のメリットを享受できます。
* **移行**: Kotlinは、JavaからKotlinへの大規模なコードベースの段階的な移行をサポートしています。システムの古い部分はJavaのままにして、新しいコードをKotlinで書き始めることができます。
* **ツール**: 一般的な優れたIDEサポートに加え、KotlinはIntelliJ IDEA Ultimateのプラグインで、特定のフレームワーク（たとえばSpringやKtorなど）向けのツールを提供しています。
* **学習曲線**: Java開発者にとって、Kotlinを使い始めるのは非常に簡単です。Kotlinプラグインに含まれる自動Java-to-Kotlinコンバーターが、最初の一歩をサポートします。[Kotlin Koans](koans.md)では、一連の対話型演習を通じて、主要な言語機能をガイドします。[Ktor](https://ktor.io/)のようなKotlin特有のフレームワークは、大規模なフレームワークのような隠れた複雑さがなく、シンプルでわかりやすいアプローチを提供します。

## Kotlinによるサーバーサイド開発のためのフレームワーク

Kotlin向けのサーバーサイドフレームワークの例をいくつか紹介します。

* [Spring](https://spring.io)は、バージョン5.0以降、Kotlinの言語機能を活用して[より簡潔なAPI](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0)を提供しています。[オンラインプロジェクトジェネレーター](https://start.spring.io/#!language=kotlin)を使用すると、Kotlinの新しいプロジェクトを素早く生成できます。

* [Ktor](https://github.com/kotlin/ktor)は、JetBrainsによって構築された、KotlinでWebアプリケーションを作成するためのフレームワークです。高いスケーラビリティのためにコルーチンを利用し、使いやすく慣用的な（idiomatic）APIを提供します。

* [Quarkus](https://quarkus.io/guides/kotlin)は、Kotlinの使用をファーストクラスでサポートしています。このフレームワークはオープンソースであり、Red Hatによってメンテナンスされています。QuarkusはKubernetesのためにゼロから構築されており、数百もの最高クラスのライブラリを活用して、まとまりのあるフルスタックフレームワークを提供します。

* [Vert.x](https://vertx.io)は、JVM上でリアクティブなWebアプリケーションを構築するためのフレームワークで、[完全なドキュメント](https://vertx.io/docs/vertx-core/kotlin/)を含む、Kotlin向けの[専用サポート](https://github.com/vert-x3/vertx-lang-kotlin)を提供しています。

* [kotlinx.html](https://github.com/kotlin/kotlinx.html)は、WebアプリケーションでHTMLを構築するために使用できるDSLです。JSPやFreeMarkerなどの従来のテンプレートシステムの代替として機能します。

* [Micronaut](https://micronaut.io/)は、モジュール式でテストが容易なマイクロサービスやサーバーレスアプリケーションを構築するための、モダンなJVMベースのフルスタックフレームワークです。多くの便利な組み込み機能が備わっています。

* [http4k](https://http4k.org/)は、純粋なKotlinで書かれた、Kotlin HTTPアプリケーション用のフットプリントが非常に小さい関数型ツールキットです。このライブラリはTwitterの「Your Server as a Function」という論文に基づいており、HTTPサーバーとクライアントの両方を、組み合わせて構成できるシンプルなKotlin関数としてモデリングしています。

* [Javalin](https://javalin.io)は、KotlinおよびJava向けの非常に軽量なWebフレームワークで、WebSocket、HTTP2、および非同期リクエストをサポートしています。

* 永続化（Persistence）の選択肢には、直接のJDBCアクセス、JPA、およびJavaドライバーを介したNoSQLデータベースの使用が含まれます。JPAの場合、[kotlin-jpa コンパイラプラグイン](no-arg-plugin.md#jpa-support)が、Kotlinでコンパイルされたクラスをフレームワークの要件に適合させます。
  
> その他のフレームワークは [https://kotlin.link/](https://kotlin.link/resources) で確認できます。
>
{style="note"}

## Kotlinサーバーサイドアプリケーションのデプロイ

Kotlinアプリケーションは、Amazon Web Services、Google Cloud Platformなどを含む、Java Webアプリケーションをサポートする任意のホストにデプロイできます。

[Heroku](https://www.heroku.com)にKotlinアプリケーションをデプロイするには、[公式のHerokuチュートリアル](https://devcenter.heroku.com/articles/getting-started-with-kotlin)に従ってください。

AWS Labsは、[AWS Lambda](https://aws.amazon.com/lambda/)関数の記述にKotlinを使用する例を示す[サンプルプロジェクト](https://github.com/awslabs/serverless-photo-recognition)を提供しています。

Google Cloud Platformは、KotlinアプリケーションをGCPにデプロイするための一連のチュートリアルを提供しています。これには[KtorとApp Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8)および[SpringとApp Engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8)の両方が含まれます。さらに、Kotlin Springアプリケーションをデプロイするための[対話型コードラボ](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin)もあります。

## サーバーサイドでKotlinを使用している製品

[Corda](https://www.corda.net/)は、主要な銀行によってサポートされ、完全にKotlinで構築されたオープンソースの分散型台帳プラットフォームです。

[JetBrains Account](https://account.jetbrains.com/)は、JetBrainsにおけるライセンス販売および検証プロセス全体を支えるシステムであり、100% Kotlinで記述されています。2015年から本番環境で稼働しており、大きな問題は発生していません。

[Chess.com](https://www.chess.com/)は、チェスと、このゲームを愛する世界中の何百万人ものプレイヤーのためのウェブサイトです。Chess.comは、複数のHTTPクライアントのシームレスな構成のためにKtorを使用しています。

[Adobe](https://medium.com/adobetech/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a)のエンジニアは、Adobe Experience Platformにおけるサーバーサイドアプリ開発にKotlinを、プロトタイピングにKtorを使用しています。このプラットフォームにより、組織はデータサイエンスや機械学習を適用する前に、顧客データを一元化および標準化できます。

## 次のステップ

* 言語のより詳細な概要については、このサイトのKotlinドキュメントおよび[Kotlin Koans](koans.md)を確認してください。
* Kotlinコルーチンを使用するフレームワークである[Ktorで非同期サーバーアプリケーションを構築する方法](https://ktor.io/docs/server-create-a-new-project.html)を探索してください。
* ウェビナー[「Micronaut for microservices with Kotlin」](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/)を視聴し、Micronautフレームワークで[Kotlin拡張関数](extensions.md#extension-functions)を使用する方法を示す詳細な[ガイド](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)を探索してください。
* http4kは、完全に形成されたプロジェクトを生成するための[CLI](https://toolbox.http4k.org)と、単一のbashコマンドでGitHub、Travis、Herokuを使用した完全なCDパイプラインを生成するための[スターター](https://start.http4k.org)リポジトリを提供しています。
* JavaからKotlinに移行したいですか？[JavaとKotlinでの文字列に関する典型的なタスク](java-to-kotlin-idioms-strings.md)の実行方法を学びましょう。