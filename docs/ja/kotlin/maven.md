[//]: # (title: Maven)

Mavenは、Kotlinのみ、あるいはKotlinとJavaが混在したプロジェクトの管理や、ビルドプロセスの自動化を支援するビルドシステムです。
JVMベースのプロジェクトに対応しており、必要な依存関係のダウンロード、コードのコンパイル、およびパッケージングを行います。
基本事項や詳細については、[Maven](https://maven.apache.org/)のWebサイトをご覧ください。

Kotlin Mavenプロジェクトを扱う際の一般的なワークフローは以下の通りです。

1. [Kotlin Mavenプラグインの適用](maven-configure-project.md#enable-and-configure-the-plugin)
2. [リポジトリの宣言](maven-configure-project.md#declare-repositories)
3. [プロジェクトの依存関係の設定](maven-configure-project.md#set-dependencies)
4. [ソースコードのコンパイル設定](maven-compile-package.md#configure-source-code-compilation)
5. [Kotlinコンパイラの設定](maven-compile-package.md#configure-kotlin-compiler)
6. [アプリケーションのパッケージング](maven-compile-package.md#package-your-project)

導入として、以下のステップバイステップのチュートリアルも参考にしてください。

* [JavaプロジェクトでKotlinを使用するための設定](mixing-java-kotlin-intellij.md)
* [Java MavenプロジェクトをKotlinとJUnitでテストする](jvm-test-using-junit.md)

> MavenとGradleの両方のビルドファイルがすでにセットアップされている、Kotlin/Java混在プロジェクトの公開[サンプルプロジェクト](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)を確認できます。
>
{style="tip"}

## 次のステップ

* [`power-assert`プラグイン](power-assert.md#maven)を使用して**デバッグ体験を向上させる**。
* [`kover-maven-plugin`](https://kotlin.github.io/kotlinx-kover/maven-plugin/)を使用して**テストカバレッジの測定とレポートの生成を行う**。
* [`kapt`プラグイン](kapt.md#use-in-maven)を使用して**アノテーション処理を設定する**。
* [Dokkaドキュメントエンジン](dokka-maven.md)を使用して**ドキュメントを生成する**。
  混在言語プロジェクトをサポートしており、標準的なJavadocを含む複数のフォーマットで出力できます。
* [`kotlin-osgi-bundle`](kotlin-osgi.md#maven)を追加して**OSGiサポートを有効にする**。