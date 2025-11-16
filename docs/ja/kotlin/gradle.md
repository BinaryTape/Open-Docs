[//]: # (title: Gradle)

Gradleは、ビルドプロセスを自動化および管理するのに役立つビルドシステムです。必要な依存関係をダウンロードし、コードをパッケージ化し、コンパイルの準備をします。Gradleの基本と詳細については、[GradleのWebサイト](https://docs.gradle.org/current/userguide/userguide.html)をご覧ください。

さまざまなプラットフォーム向けに[これらの手順](gradle-configure-project.md)で独自のプロジェクトをセットアップするか、Kotlinでシンプルなバックエンドの「Hello World」アプリケーションを作成する方法を示す小さな[ステップバイステップのチュートリアル](get-started-with-jvm-gradle-project.md)を試すことができます。

> Kotlin、Gradle、およびAndroid Gradleプラグインのバージョンの互換性に関する情報は[こちら](gradle-configure-project.md#apply-the-plugin)で確認できます。
>
{style="tip"}

この章では、以下についても学習できます。
* [コンパイラオプションとその渡し方](gradle-compiler-options.md)。
* [インクリメンタルコンパイル、キャッシュサポート、ビルドレポート、およびKotlinデーモン](gradle-compilation-and-caches.md)。
* [Gradleプラグインのバリアントのサポート](gradle-plugin-variants.md)。

## 次のステップ

以下について学習します。
* **Gradle Kotlin DSL**。[Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)は、ビルドスクリプトを迅速かつ効率的に記述するために使用できるドメイン固有言語です。
* **アノテーション処理**。Kotlinは、[Kotlin Symbol Processing API](ksp-reference.md)を介したアノテーション処理をサポートしています。
* **ドキュメントの生成**。Kotlinプロジェクトのドキュメントを生成するには、[Dokka](https://github.com/Kotlin/dokka)を使用します。設定手順については、[Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin)を参照してください。Dokkaは混在言語プロジェクトをサポートし、標準Javadocを含む複数の形式で出力を生成できます。
* **OSGi**。OSGiのサポートについては、[Kotlin OSGiページ](kotlin-osgi.md)を参照してください。