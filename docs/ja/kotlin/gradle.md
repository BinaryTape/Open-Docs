---
title: Gradle
---
Gradle は、ビルドプロセスを自動化および管理するのに役立つビルドシステムです。必要な依存関係をダウンロードし、コードをパッケージ化し、コンパイルの準備をします。[Gradle のウェブサイト](https://docs.gradle.org/current/userguide/userguide.html)で、Gradle の基本と詳細について学んでください。

さまざまなプラットフォーム向けの[これらの手順](gradle-configure-project)で独自のプロジェクトをセットアップしたり、Kotlin で簡単なバックエンド "Hello World" アプリケーションを作成する方法を示す小さな[ステップバイステップチュートリアル](get-started-with-jvm-gradle-project)を実行したりできます。

:::tip
Kotlin、Gradle、および Android Gradle plugin のバージョンの互換性に関する情報は、[こちら](gradle-configure-project#apply-the-plugin)をご覧ください。

:::

この章では、以下についても学習できます。
* [コンパイラオプションとその渡し方](gradle-compiler-options)。
* [インクリメンタルコンパイル、キャッシュのサポート、ビルドレポート、および Kotlin daemon](gradle-compilation-and-caches)。
* [Gradle plugin バリアントのサポート](gradle-plugin-variants)。

## 次は何を学びますか？

以下について学びます。
* **Gradle Kotlin DSL**。[Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html) は、ビルドスクリプトを迅速かつ効率的に記述するために使用できるドメイン固有言語です。
* **アノテーション処理**。Kotlin は、[Kotlin Symbol processing API](ksp-reference)を介してアノテーション処理をサポートします。
* **ドキュメントの生成**。Kotlin プロジェクトのドキュメントを生成するには、[Dokka](https://github.com/Kotlin/dokka) を使用します。構成手順については、[Dokka README](https://github.com/Kotlin/dokka/blob/master/README#using-the-gradle-plugin) を参照してください。Dokka は混合言語プロジェクトをサポートし、標準の Javadoc を含む複数の形式で出力を生成できます。
* **OSGi**。OSGi のサポートについては、[Kotlin OSGi page](kotlin-osgi) を参照してください。