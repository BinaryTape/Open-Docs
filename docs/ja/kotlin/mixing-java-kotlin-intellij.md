[//]: # (title: JavaプロジェクトにKotlinを追加する – チュートリアル)

KotlinはJavaと完全に相互運用可能であるため、すべてを書き換えることなく、既存のJavaプロジェクトに段階的に導入できます。

このチュートリアルでは、次のことを学習します。

*   MavenまたはGradleビルドツールをセットアップし、JavaとKotlinの両方のコードをコンパイルする方法。
*   プロジェクトディレクトリ内でJavaとKotlinのソースファイルを整理する方法。
*   IntelliJ IDEAを使用してJavaファイルをKotlinに変換する方法。

> このチュートリアルでは、既存のJavaプロジェクトを使用するか、MavenとGradleのビルドファイルがすでに設定されている公開[サンプルプロジェクト](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)をクローンできます。
>
{style="tip"}

## プロジェクト設定

JavaプロジェクトにKotlinを追加するには、使用するビルドツールに応じて、KotlinとJavaの両方を使用するようにプロジェクトを設定する必要があります。

プロジェクト設定により、KotlinとJavaの両方のコードが適切にコンパイルされ、互いをシームレスに参照できるようになります。

### Maven

> **IntelliJ IDEA 2025.3**以降、MavenベースのJavaプロジェクトに最初のKotlinファイルを追加すると、IDEは自動的に`pom.xml`ファイルを更新し、Kotlin Mavenプラグインと標準の依存関係を含めます。バージョンやビルドフェーズをカスタマイズしたい場合は、引き続き手動で設定できます。
>
{style="note"}

MavenプロジェクトでKotlinとJavaを一緒に使用するには、Kotlin Mavenプラグインを適用し、`pom.xml`ファイルにKotlinの依存関係を追加します。

1.  `<properties>`セクションに、Kotlinのバージョンプロパティを追加します。

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" ignore-vars="false" include-lines="13,17,18"}

2.  `<dependencies>`セクションに、必要な依存関係を追加します。

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="32,38-43,45-49,62"}

3.  `<build><plugins>`セクションに、Kotlinプラグインを追加します。

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="64-66,102-104,105-137"}

   この設定では：

    *   `<extensions>true</extensions>`により、MavenはKotlinプラグインをビルドライフサイクルに統合できます。
    *   カスタム実行フェーズにより、KotlinプラグインはKotlinを先にコンパイルし、次にJavaをコンパイルできます。
    *   設定された`sourceDirs`ディレクトリを介して、KotlinとJavaのコードは互いを参照できます。
    *   拡張機能を備えたKotlin Mavenプラグインを使用する場合、`<build><pluginManagement>`セクションに個別の`maven-compiler-plugin`は必要ありません。

4.  IDEでMavenプロジェクトをリロードします。
5.  設定を確認するためにテストを実行します。

    ```bash
    ./mvnw clean test
    ```

### Gradle

GradleプロジェクトでKotlinとJavaを一緒に使用するには、Kotlin JVMプラグインを適用し、`build.gradle.kts`ファイルにKotlinの依存関係を追加します。

1.  `plugins {}`ブロックに、Kotlin JVMプラグインを追加します。

    ```kotlin
    plugins {
        // Other plugins
        kotlin("jvm") version "%kotlinVersion%"
    }
    ```

2.  JVMツールチェインのバージョンをJavaのバージョンと一致させます。

    ```kotlin
    kotlin {
        jvmToolchain(17)
    }
    ```

   これにより、KotlinがJavaコードと同じJDKバージョンを使用するようになります。

3.  `dependencies {}`ブロックに、Kotlinテストユーティリティを提供し、JUnitと統合する`kotlin("test")`ライブラリを追加します。

    ```kotlin
    dependencies {
        // Other dependencies
    
        testImplementation(kotlin("test"))
        // Other test dependencies
    }
    ```

4.  IDEでGradleプロジェクトをリロードします。
5.  設定を確認するためにテストを実行します。

    ```bash
    ./gradlew clean test
    ```

## プロジェクト構造

この設定により、JavaとKotlinのファイルを同じソースディレクトリに混在させることができます。

```none
src/
  ├── main/
  │    ├── java/          # JavaとKotlinのプロダクションコード
  │    └── kotlin/        # 追加のKotlinプロダクションコード (任意)
  └── test/
       ├── java/          # JavaとKotlinのテストコード
       └── kotlin/        # 追加のKotlinテストコード (任意)
```

これらのディレクトリは手動で作成することも、最初のKotlinファイルを追加する際にIntelliJ IDEAに作成させることもできます。

Kotlinプラグインは`src/main/java`と`src/test/java`の両方のディレクトリを自動的に認識するため、`.kt`ファイルと`.java`ファイルを同じディレクトリに保持できます。

## JavaファイルをKotlinに変換する

Kotlinプラグインには、JavaファイルをKotlinに自動変換するJavaからKotlinへのコンバーター（_J2K_）も同梱されています。
ファイルでJ2Kを使用するには、そのコンテキストメニューまたはIntelliJ IDEAの**Code**メニューで**Convert Java File to Kotlin File**をクリックします。

![JavaからKotlinへ変換](convert-java-to-kotlin.png){width=500}

このコンバーターは完璧ではありませんが、ほとんどのJavaのボイラープレートコードをKotlinに変換するのに十分な働きをします。ただし、手動での調整が時々必要になります。

## 次のステップ

JavaプロジェクトでKotlinを使い始める最も簡単な方法は、最初にKotlinテストを追加することです。

[Javaプロジェクトに最初のKotlinテストを追加する](jvm-test-using-junit.md)

### 関連項目

*   [KotlinとJavaの相互運用性の詳細](java-to-kotlin-interop.md)
*   [Mavenビルド設定リファレンス](maven.md)