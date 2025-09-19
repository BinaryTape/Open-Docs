[//]: # (title: Kotlin/JavaScript)

Kotlin/JavaScript (Kotlin/JS) を使用すると、Kotlinコード、Kotlin標準ライブラリ、および互換性のあるすべての依存関係をJavaScriptにトランスパイルできます。これにより、KotlinアプリケーションはJavaScriptをサポートするあらゆる環境で実行できます。

Kotlin/JSは、[Kotlin Multiplatform Gradleプラグイン](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html) (`kotlin.multiplatform`) を介して使用し、JavaScriptをターゲットとするKotlinプロジェクトを一元的に設定および管理できます。

Kotlin Multiplatform Gradleプラグインは、アプリケーションのバンドル制御やnpmからのJavaScript依存関係の直接追加などの機能を提供します。利用可能な設定オプションの概要については、[Kotlin/JSプロジェクトのセットアップ](js-project-setup.md)を参照してください。

> Kotlin/JSの現在の実装は、[ES5](https://www.ecma-international.org/ecma-262/5.1/) および [ES2015](https://262.ecma-international.org/6.0/) 標準をターゲットとしています。
>
{style="tip"}

## Kotlin/JSのユースケース

Kotlin/JSの一般的な使用方法をいくつか紹介します。

*   **フロントエンドとJVMバックエンド間での共通ロジックの共有**

    バックエンドがKotlinまたは他のJVM互換言語で記述されている場合、ウェブアプリケーションとバックエンド間で共通コードを共有できます。これには、データ転送オブジェクト (DTO)、バリデーションおよび認証ルール、REST APIエンドポイントの抽象化などが含まれます。

*   **Android、iOS、およびウェブクライアント間での共通ロジックの共有**

    ウェブインターフェースとAndroidおよびiOSのモバイルアプリケーション間でビジネスロジックを共有しつつ、ネイティブのユーザーインターフェースを維持できます。これにより、REST APIの抽象化、ユーザー認証、フォームバリデーション、ドメインモデルなどの一般的な機能の重複を避けることができます。

*   **Kotlin/JSを使用したフロントエンドWebアプリケーションの構築**

    既存のツールやライブラリと統合しながら、Kotlinを使用して従来のWebフロントエンドを開発できます。

    *   Android開発に慣れている場合、[Kobweb](https://kobweb.varabyte.com/) や [Kilua](https://kilua.dev/) のようなComposeベースのフレームワークでWebアプリケーションを構築できます。
    *   JetBrainsが提供する[一般的なJavaScriptライブラリ用のKotlinラッパー](https://github.com/JetBrains/kotlin-wrappers)を使用して、Kotlin/JSで完全に型安全なReactアプリケーションを構築できます。Kotlinラッパー (`kotlin-wrappers`) は、Reactやその他のJavaScriptフレームワークのための抽象化と統合を提供します。

        これらのラッパーは、[React Redux](https://react-redux.js.org/)、[React Router](https://reactrouter.com/)、[styled-components](https://styled-components.com/) などの補完的なライブラリもサポートしています。JavaScriptエコシステムとの相互運用性を通じて、サードパーティのReactコンポーネントやコンポーネントライブラリを使用することもできます。

    *   Kotlinエコシステムと統合し、簡潔で表現力豊かなコードをサポートする[Kotlin/JSフレームワーク](js-frameworks.md)を使用します。

*   **古いブラウザをサポートするマルチプラットフォームアプリケーションの構築**

    Compose Multiplatformを使用すると、Kotlinでアプリケーションを構築し、ウェブプロジェクトでモバイルおよびデスクトップのユーザーインターフェースを再利用できます。この目的の主要なターゲットは[Kotlin/Wasm](wasm-overview.md)ですが、Kotlin/JSもターゲットとすることで、古いブラウザへのサポートを拡張できます。

*   **Kotlin/JSを使用したサーバーサイドおよびサーバーレスアプリケーションの構築**

    Kotlin/JSのNode.jsターゲットを使用すると、JavaScriptランタイム上でサーバーサイドまたはサーバーレス環境向けのアプリケーションを作成できます。これにより、高速な起動と低いメモリ使用量が得られます。[`kotlinx-nodejs`](https://github.com/Kotlin/kotlinx-nodejs)ライブラリは、Kotlinから[Node.js API](https://nodejs.org/docs/latest/api/)への型安全なアクセスを提供します。

ユースケースに応じて、Kotlin/JSプロジェクトはKotlinエコシステムの互換ライブラリや、JavaScriptおよびTypeScriptエコシステムのサードパーティライブラリを使用できます。

Kotlinコードからサードパーティライブラリを使用するには、独自の型安全なラッパーを作成するか、コミュニティがメンテナンスしているラッパーを使用できます。さらに、Kotlin/JSの[動的型](dynamic-type.md)を使用することもできます。これは、型安全性を犠牲にして、厳密な型付けやライブラリラッパーをスキップすることを可能にします。

Kotlin/JSは、最も一般的なモジュールシステムである[ESM](https://tc39.es/ecma262/#sec-modules)、[CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules)、[UMD](https://github.com/umdjs/umd)、および[AMD](https://github.com/amdjs/amdjs-api)とも互換性があります。これにより、[モジュールを生成および利用](js-modules.md)し、構造化された方法でJavaScriptエコシステムと統合できます。

### ユースケースを共有する

[Kotlin/JSのユースケース](#use-cases-for-kotlin-js)に記載されているリストは網羅的なものではありません。さまざまなアプローチを自由に試して、プロジェクトに最適なものを見つけてください。

[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69)チャンネルで、ユースケース、経験、質問をKotlin/JSコミュニティと共有してください。

## Kotlin/JSを始める

Kotlin/JSの作業を開始するための基本と最初のステップを探ります。

*   Kotlinを初めて使用する場合は、まず[基本構文](basic-syntax.md)を確認し、[Kotlinツアー](kotlin-tour-welcome.md)を探索してください。
*   インスピレーションを得るために、[Kotlin/JSサンプルプロジェクト](#sample-projects-for-kotlin-js)のリストをチェックしてください。これらのサンプルには、プロジェクトを開始するのに役立つ有用なコードスニペットとパターンが含まれています。
*   Kotlin/JSを初めて使用する場合は、より高度なトピックを探索する前に、セットアップガイドから始めてください。

<a href="js-project-setup.md"><img src="js-set-up-project.svg" width="600" alt="Kotlin/JSプロジェクトのセットアップ" style="block"/></a>

## Kotlin/JSのサンプルプロジェクト

次の表は、さまざまなKotlin/JSのユースケース、アーキテクチャ、およびコード共有戦略を示す一連のサンプルプロジェクトをリストしています。

| プロジェクト                                                                                                                          | 説明                                                                                                                                                                                                                                                                                                                      |
|:----------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Petclinic with common code between Spring and Angular](https://github.com/Kotlin/kmp-spring-petclinic/#readme)                   | エンタープライズアプリケーションでコードの重複を避けるために、データ転送オブジェクト、バリデーションおよび認証ルール、REST APIエンドポイントの抽象化を共有する方法を示します。コードは[Spring Boot](https://spring.io/projects/spring-boot)バックエンドと[Angular](https://angular.dev/)フロントエンド間で共有されます。 |
| [Fullstack Conference CMS](https://github.com/Kotlin/kmp-fullstack-conference-cms/#readme)                                        | [Ktor](https://ktor.io/)、[Jetpack Compose](https://developer.android.com/compose)、[Vue.js](https://vuejs.org/)アプリケーション間での、最もシンプルなものからオールインのコード共有まで、複数のコード共有アプローチを紹介します。                                                                                             |
| [Todo App on a Compose-HTML-based Kobweb framework](https://github.com/varabyte/kobweb-templates/tree/main/examples/todo/#readme) | Android開発者にはおなじみのアプローチを再利用して、ToDoリストアプリケーションを作成する方法を示します。[Kobwebフレームワーク](https://kobweb.varabyte.com/)を搭載したクライアントUIアプリケーションを構築します。                                                                                                                           |
| [Simple logic sharing between Android, iOS, and web](https://github.com/Kotlin/kmp-logic-sharing-simple-example/#readme)          | Kotlinで共通ロジックを持つプロジェクトを構築するためのテンプレートが含まれており、Android ([Jetpack Compose](https://developer.android.com/compose))、iOS ([SwiftUI](https://developer.apple.com/tutorials/swiftui/))、およびウェブ ([React](https://react.dev/)) のプラットフォームネイティブUIアプリケーションで利用されます。      |
| [Full-stack collaborative to-do list](https://github.com/kotlin-hands-on/jvm-js-fullstack/#readme)                                | JSおよびJVMターゲットを持つKotlin Multiplatformを使用して、共同作業用のToDoリストアプリケーションを作成する方法を示します。バックエンドには[Ktor](https://ktor.io/)を、フロントエンドにはKotlin/JSとReactを使用します。                                                                                                             |

## Kotlin/JSフレームワーク

Kotlin/JSフレームワークは、すぐに使えるコンポーネント、ルーティング、状態管理、および最新のWebアプリケーションを構築するためのその他のツールを提供することで、Web開発を簡素化します。

[異なる作者によって書かれたKotlin/JSの利用可能なフレームワークをチェックする](js-frameworks.md)。

## Kotlin/JSコミュニティに参加する

公式の[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69)チャンネルに参加して、コミュニティやKotlin/JSチームとチャットできます。

## 次のステップ

*   [Kotlin/JSプロジェクトのセットアップ](js-project-setup.md)
*   [Kotlin/JSプロジェクトの実行](running-kotlin-js.md)
*   [Kotlin/JSコードのデバッグ](js-debugging.md)
*   [Kotlin/JSでのテストの実行](js-running-tests.md)