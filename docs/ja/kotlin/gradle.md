[//]: # (title: Gradle)

Gradle は、ビルドプロセスの自動化と管理を支援するビルドシステムです。必要な依存関係をダウンロードし、コードをパッケージ化し、コンパイルの準備を整えます。Gradle の基本と詳細については、[Gradle の Web サイト](https://docs.gradle.org/current/userguide/userguide.html)を確認してください。

[こちらの手順](gradle-configure-project.md)に従って、さまざまなプラットフォーム向けに独自のプロジェクトをセットアップするか、Kotlin でシンプルなバックエンドの「Hello World」アプリケーションを作成する方法を紹介する、短い[ステップバイステップのチュートリアル](get-started-with-jvm-gradle-project.md)を進めることができます。

> Kotlin、Gradle、および Android Gradle プラグインのバージョンの互換性に関する情報は、[こちら](gradle-configure-project.md#apply-the-plugin)で確認できます。
> 
{style="tip"}

この章では、以下の内容についても学ぶことができます：
* [コンパイラオプションとその指定方法](gradle-compiler-options.md)
* [インクリメンタルコンパイル、キャッシュのサポート、ビルドレポート、および Kotlin デーモン](gradle-compilation-and-caches.md)
* [Gradle プラグインバリアントのサポート](gradle-plugin-variants.md)

## 次のステップ

以下の項目について学習しましょう：
* **Gradle Kotlin DSL**：[Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html) は、ビルドスクリプトを迅速かつ効率的に記述するために使用できるドメイン固有言語（DSL）です。
* **アノテーション処理**：Kotlin は、[Kotlin Symbol Processing（KSP）API](ksp-reference.md) を通じてアノテーション処理をサポートしています。
* **ドキュメントの生成**：Kotlin プロジェクトのドキュメントを生成するには、[Dokka](https://github.com/Kotlin/dokka) を使用します。設定手順については、[Dokka の README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin) を参照してください。Dokka は複数言語が混在するプロジェクトをサポートしており、標準的な Javadoc を含む複数の形式で出力を生成できます。
* **OSGi**：OSGi のサポートについては、[Kotlin OSGi ページ](kotlin-osgi.md)を参照してください。