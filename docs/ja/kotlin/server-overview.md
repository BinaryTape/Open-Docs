[//]: # (title: サーバーサイドにおけるKotlin)

Kotlinはサーバーサイドアプリケーション開発に非常に適しています。既存のJavaベースの技術スタックとの完全な互換性を保ちながら、簡潔で表現力豊かなコードを書くことができ、学習曲線も緩やかです。

*   **表現力**: Kotlinの革新的な言語機能、例えば[型安全ビルダー](type-safe-builders.md)や[デリゲートプロパティ](delegated-properties.md)のサポートは、強力で使いやすい抽象化の構築に役立ちます。
*   **スケーラビリティ**: Kotlinの[コルーチン](coroutines-overview.md)のサポートは、控えめなハードウェア要件で多数のクライアントにスケールするサーバーサイドアプリケーションの構築に役立ちます。
*   **相互運用性**: KotlinはすべてのJavaベースのフレームワークと完全に互換性があるため、慣れ親しんだ技術スタックを使用しながら、よりモダンな言語の利点を享受できます。
*   **移行**: Kotlinは、大規模なコードベースをJavaからKotlinへ段階的に移行することをサポートしています。システムの古い部分をJavaのままにしながら、新しいコードをKotlinで書き始めることができます。
*   **ツール**: 一般的な優れたIDEサポートに加え、KotlinはIntelliJ IDEA Ultimateのプラグインにおいて、(例えばSpringやKtor向けの)フレームワーク固有のツールを提供しています。
*   **学習曲線**: Java開発者にとって、Kotlinを始めるのは非常に簡単です。Kotlinプラグインに含まれる自動Java-to-Kotlinコンバーターは、最初のステップを支援します。[Kotlin Koans](koans.md)は、一連のインタラクティブな演習を通して主要な言語機能を案内します。[Ktor](https://ktor.io/)のようなKotlin固有のフレームワークは、大規模なフレームワークの隠れた複雑さなしに、シンプルで分かりやすいアプローチを提供します。

## Kotlinによるサーバーサイド開発のためのフレームワーク

以下に、Kotlin向けのサーバーサイドフレームワークの例をいくつか示します。

*   [Spring](https://spring.io)は、バージョン5.0からKotlinの言語機能を活用して、[より簡潔なAPI](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0)を提供しています。[オンラインプロジェクトジェネレーター](https://start.spring.io/#!language=kotlin)を使えば、Kotlinで新しいプロジェクトを素早く生成できます。

*   [Ktor](https://github.com/kotlin/ktor)は、JetBrainsが開発したKotlinでWebアプリケーションを作成するためのフレームワークで、高いスケーラビリティを実現するためにコルーチンを活用し、使いやすく慣用的なAPIを提供します。

*   [Quarkus](https://quarkus.io/guides/kotlin)は、Kotlinの使用に対するファーストクラスのサポートを提供します。このフレームワークはオープンソースであり、Red Hatによってメンテナンスされています。QuarkusはKubernetes向けにゼロから構築されており、増え続ける数百もの優れたライブラリを活用することで、まとまりのあるフルスタックフレームワークを提供します。

*   JVM上でリアクティブなWebアプリケーションを構築するためのフレームワークである[Vert.x](https://vertx.io)は、[完全なドキュメント](https://vertx.io/docs/vertx-core/kotlin/)を含むKotlin向けの[専用サポート](https://github.com/vert-x3/vertx-lang-kotlin)を提供しています。

*   [kotlinx.html](https://github.com/kotlin/kotlinx.html)は、WebアプリケーションでHTMLを構築するために使用できるDSLです。
    これはJSPやFreeMarkerのような従来のテンプレートシステムに代わるものです。

*   [Micronaut](https://micronaut.io/)は、モジュール式でテストしやすいマイクロサービスやサーバーレスアプリケーションを構築するための、モダンなJVMベースのフルスタックフレームワークです。多くの便利な組み込み機能が付属しています。

*   [http4k](https://http4k.org/)は、純粋なKotlinで書かれた、Kotlin HTTPアプリケーション向けのフットプリントの小さい関数型ツールキットです。このライブラリは、Twitterの「Your Server as a Function」という論文に基づいており、HTTPサーバーとクライアントの両方を、組み合わせ可能なシンプルなKotlin関数としてモデリングすることを表しています。

*   [Javalin](https://javalin.io)は、WebSockets、HTTP2、非同期リクエストをサポートする、KotlinおよびJava向けの非常に軽量なWebフレームワークです。

*   永続化のための利用可能なオプションには、直接JDBCアクセス、JPA、およびJavaドライバーを介したNoSQLデータベースの使用が含まれます。
    JPAの場合、[kotlin-jpaコンパイラプラグイン](no-arg-plugin.md#jpa-support)はKotlinでコンパイルされたクラスをフレームワークの要件に適合させます。
    
> [https://kotlin.link/](https://kotlin.link/resources)でより多くのフレームワークを見つけることができます。
>
{style="note"}

## Kotlinサーバーサイドアプリケーションのデプロイ

Kotlinアプリケーションは、Amazon Web Services、Google Cloud Platformなど、Java Webアプリケーションをサポートする任意のホストにデプロイできます。

[Heroku](https://www.heroku.com)にKotlinアプリケーションをデプロイするには、[公式のHerokuチュートリアル](https://devcenter.heroku.com/articles/getting-started-with-kotlin)に従うことができます。

AWS Labsは、[AWS Lambda](https://aws.amazon.com/lambda/)関数を記述するためのKotlinの使用を示す[サンプルプロジェクト](https://github.com/awslabs/serverless-photo-recognition)を提供しています。

Google Cloud Platformは、KotlinアプリケーションをGCPにデプロイするためのチュートリアルシリーズを提供しており、[KtorとApp Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8)向けと[SpringとApp Engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8)向けの両方があります。さらに、Kotlin Springアプリケーションをデプロイするための[インタラクティブなコードラボ](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin)もあります。

## サーバーサイドでKotlinを使用している製品

[Corda](https://www.corda.net/)は、主要銀行にサポートされ、完全にKotlinで構築されたオープンソースの分散型台帳プラットフォームです。

JetBrainsにおけるライセンス販売および検証プロセス全体を担うシステムである[JetBrains Account](https://account.jetbrains.com/)は、100% Kotlinで書かれており、2015年以来、大きな問題なく本番稼働しています。

[Chess.com](https://www.chess.com/)は、チェスと、このゲームを愛する世界中の何百万人ものプレイヤーに特化したウェブサイトです。Chess.comは、複数のHTTPクライアントのシームレスな構成のためにKtorを使用しています。

[Adobe](https://blog.developer.adobe.com/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a)のエンジニアは、サーバーサイドアプリ開発にKotlinを、Adobe Experience Platformでのプロトタイプ作成にKtorを使用しています。Adobe Experience Platformは、組織がデータサイエンスや機械学習を適用する前に顧客データを一元化および標準化することを可能にします。

## 次のステップ

*   言語についてより深く知りたい場合は、このサイトのKotlinドキュメントと[Kotlin Koans](koans.md)を参照してください。
*   Kotlinコルーチンを使用するフレームワークである[Ktorで非同期サーバーアプリケーションを構築する方法](https://ktor.io/docs/server-create-a-new-project.html)を探求してください。
*   ウェビナー「[Micronaut for microservices with Kotlin](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/)」を視聴し、Micronautフレームワークで[Kotlin拡張関数](extensions.md#extension-functions)を使用する方法を示す詳細な[ガイド](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html)を探求してください。
*   http4kは、完全に形成されたプロジェクトを生成するための[CLI](https://toolbox.http4k.org)と、GitHub、Travis、Herokuを使用して単一のbashコマンドでCDパイプライン全体を生成するための[スターターリポジトリ](https://start.http4k.org)を提供します。
*   JavaからKotlinへ移行したいですか？[JavaとKotlinで文字列を使った一般的なタスクを実行する方法](java-to-kotlin-idioms-strings.md)を学びましょう。