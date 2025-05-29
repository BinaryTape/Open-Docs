[//]: # (title: Gradle)

Gradleは、ビルドプロセスを自動化および管理するのに役立つビルドシステムです。必要な依存関係をダウンロードし、コードをパッケージ化し、コンパイルのために準備します。Gradleの基本と詳細については、[Gradleウェブサイト](https://docs.gradle.org/current/userguide/userguide.html)で学ぶことができます。

さまざまなプラットフォーム向けに[これらの手順](gradle-configure-project.md)で独自のプロジェクトをセットアップするか、Kotlinでシンプルなバックエンドの「Hello World」アプリケーションを作成する方法を示す簡単な[ステップバイステップチュートリアル](get-started-with-jvm-gradle-project.md)を進めることができます。

> Kotlin、Gradle、およびAndroid Gradleプラグインのバージョンの互換性については、[こちら](gradle-configure-project.md#apply-the-plugin)で情報を見つけることができます。
> 
{style="tip"}

この章では、以下についても学ぶことができます:
* [コンパイラオプションとそれらを渡す方法](gradle-compiler-options.md)。
* [インクリメンタルコンパイル、キャッシュサポート、ビルドレポート、およびKotlinデーモン](gradle-compilation-and-caches.md)。
* [Gradleプラグインバリアントのサポート](gradle-plugin-variants.md)。

## 次のステップ

以下について学びましょう:
* **Gradle Kotlin DSL**。[Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)は、ビルドスクリプトを迅速かつ効率的に記述するために使用できるドメイン固有言語です。
* **アノテーション処理**。Kotlinは、[Kotlin Symbol Processing API](ksp-reference.md)を介してアノテーション処理をサポートしています。
* **ドキュメントの生成**。Kotlinプロジェクトのドキュメントを生成するには、[Dokka](https://github.com/Kotlin/dokka)を使用します。設定手順については、[Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin)を参照してください。Dokkaは混在言語プロジェクトをサポートし、標準のJavadocを含む複数の形式で出力を生成できます。
* **OSGi**。OSGiのサポートについては、[Kotlin OSGiページ](kotlin-osgi.md)を参照してください。