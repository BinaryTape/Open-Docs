[//]: # (title: Maven)

Mavenは、Kotlinのみのプロジェクト、またはKotlinとJavaの混在プロジェクトを管理し、ビルドプロセスを自動化するのに役立つビルドシステムです。
JVMベースのプロジェクトで動作し、必要な依存関係をダウンロードし、コードをコンパイルしてパッケージ化します。
その基本と詳細については、[Maven](https://maven.apache.org/)ウェブサイトで学ぶことができます。

Kotlin Mavenプロジェクトで作業する際の一般的なワークフローは次のとおりです。

1. [Kotlin Mavenプラグインを適用する](maven-configure-project.md#enable-and-configure-the-plugin)。
2. [リポジトリを宣言する](maven-configure-project.md#declare-repositories)。
3. [プロジェクトの依存関係を設定する](maven-configure-project.md#set-dependencies)。
4. [ソースコードのコンパイルを構成する](maven-compile-package.md#configure-source-code-compilation)。
5. [Kotlinコンパイラを構成する](maven-compile-package.md#configure-kotlin-compiler)。
6. [アプリケーションをパッケージ化する](maven-compile-package.md#package-your-project)。

開始するには、以下のステップバイステップチュートリアルも参照してください。

* [Kotlinで動作するようにJavaプロジェクトを構成する](mixing-java-kotlin-intellij.md)
* [KotlinとJUnit5を使用してJava Mavenプロジェクトをテストする](jvm-test-using-junit.md)

> Kotlin/Java混在プロジェクト向けにMavenとGradleの両方のビルドファイルが既に設定されている、当社の公開[サンプルプロジェクト](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)をチェックアウトできます。
>
{style="tip"}

## 次は何をしますか？

* [`power-assert` プラグイン](power-assert.md#maven)で**デバッグ体験を向上させましょう**。
* [`kover-maven-plugin`](https://kotlin.github.io/kotlinx-kover/maven-plugin/)で**テストカバレッジを測定し、レポートを生成しましょう**。
* [`kapt` プラグイン](kapt.md#use-in-maven)で**アノテーション処理を構成しましょう**。
* [Dokkaドキュメントエンジン](dokka-maven.md)で**ドキュメントを生成しましょう**。
  これは混在言語プロジェクトをサポートし、標準Javadocを含む複数の形式で出力を生成できます。
* [`kotlin-osgi-bundle`](kotlin-osgi.md#maven)を追加して**OSGiサポートを有効にしましょう**。