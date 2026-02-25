[//]: # (title: JavaプロジェクトにKotlinを追加する – チュートリアル)

KotlinはJavaと完全に相互運用可能であるため、すべてを書き直すことなく、既存のJavaプロジェクトに段階的に導入できます。

このチュートリアルでは、以下の方法を学びます：

* JavaとKotlinの両方のコードをコンパイルするようにMavenまたはGradleビルドツールをセットアップする。
* プロジェクトディレクトリ内でJavaとKotlinのソースファイルを整理する。
* IntelliJ IDEAを使用してJavaファイルをKotlinに変換する。

> このチュートリアルでは、既存の任意のJavaプロジェクトを使用するか、MavenとGradleの両方のビルドファイルが既にセットアップされている公開[サンプルプロジェクト](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)をクローンして使用できます。
>
{style="tip"}

## プロジェクトの構成

JavaプロジェクトにKotlinを追加するには、使用するビルドツールに応じて、KotlinとJavaの両方を使用するようにプロジェクトを構成する必要があります。

プロジェクトを構成することで、KotlinとJavaの両方のコードが適切にコンパイルされ、相互にシームレスに参照できるようになります。

### Maven

> **IntelliJ IDEA 2025.3** 以降、MavenベースのJavaプロジェクトに最初のKotlinファイルを追加すると、IDEは自動的に `pom.xml` ファイルを更新してKotlin Mavenプラグインと標準の依存関係を含めます。バージョンのカスタマイズやビルドフェーズの調整が必要な場合は、手動で構成することもできます。
>
{style="note"}

MavenプロジェクトでKotlinとJavaを併用するには、`pom.xml` ファイルにKotlin Mavenプラグインを適用し、Kotlinの依存関係を追加します。

1. `<properties>` セクションに、Kotlinバージョンのプロパティを追加します：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" ignore-vars="false" include-lines="13,17,18"}

2. `<dependencies>` セクションに必要な依存関係を追加し、`<plugins>` セクションにも必要な構成を追加します：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="32,38-43,45-49,62"}

3. `<build><plugins>` セクションにKotlinプラグインを追加します：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="64-66,102-104,105-137"}

   この構成では：

    * `<extensions>true</extensions>` により、MavenはビルドライフサイクルにKotlinプラグインを統合できます。
    * カスタム実行フェーズにより、Kotlinプラグインが最初にKotlinをコンパイルし、その後にJavaをコンパイルできるようになります。
    * KotlinとJavaのコードは、構成された `sourceDirs` ディレクトリを通じて相互に参照できます。
    * extensionsを有効にしたKotlin Mavenプラグインを使用する場合、`<build><pluginManagement>` セクションに個別の `maven-compiler-plugin` は必要ありません。

4. IDEでMavenプロジェクトを再ロードします。
5. テストを実行して構成を確認します：

    ```bash
    ./mvnw clean test
    ```

### Gradle

GradleプロジェクトでKotlinとJavaを併用するには、`build.gradle.kts` ファイルにKotlin JVMプラグインを適用し、Kotlinの依存関係を追加します：

1. `plugins {}` ブロックに、Kotlin JVMプラグインを追加します：

    ```kotlin
    plugins {
        // 他のプラグイン
        kotlin("jvm") version "%kotlinVersion%"
    }
    ```

2. JVMツールチェーンのバージョンをJavaのバージョンと一致するように設定します：

    ```kotlin
    kotlin {
        jvmToolchain(17)
    }
    ```

   これにより、KotlinはJavaコードと同じJDKバージョンを使用するようになります。

3. `dependencies {}` ブロックに、Kotlinテストユーティリティを提供しJUnitと統合する `kotlin("test")` ライブラリを追加します：

    ```kotlin
    dependencies {
        // 他の依存関係
    
        testImplementation(kotlin("test"))
        // 他のテスト用依存関係
    }
    ```

4. IDEでGradleプロジェクトを再ロードします。
5. テストを実行して構成を確認します：

    ```bash
    ./gradlew clean test
    ```

## プロジェクト構造

この構成により、同じソースディレクトリ内にJavaファイルとKotlinファイルを混在させることができます：

```none
src/
  ├── main/
  │    ├── java/          # JavaおよびKotlinのプロダクションコード
  │    └── kotlin/        # 追加のKotlinプロダクションコード（任意）
  └── test/
       ├── java/          # JavaおよびKotlinのテストコード
       └── kotlin/        # 追加のKotlinテストコード（任意）
```

これらのディレクトリは手動で作成することも、最初のKotlinファイルを追加する際にIntelliJ IDEAに作成させることもできます。

Kotlinプラグインは `src/main/java` と `src/test/java` の両方のディレクトリを自動的に認識するため、`.kt` ファイルと `.java` ファイルを同じディレクトリに保持できます。

## JavaファイルをKotlinに変換する

Kotlinプラグインには、JavaファイルをKotlinに自動的に変換するJava to Kotlinコンバーター（_J2K_）も同梱されています。ファイルに対してJ2Kを使用するには、そのファイルのコンテキストメニューまたはIntelliJ IDEAの **Code** メニューで **Convert Java File to Kotlin File** をクリックします。

![JavaからKotlinへの変換](convert-java-to-kotlin.png){width=500}

このコンバーターは万能ではありませんが、JavaからKotlinへのほとんどのボイラープレートコードの変換において、かなり優れた働きをします。ただし、場合によっては手動での微調整が必要になることがあります。

## 次のステップ

JavaプロジェクトでKotlinを使い始める最も簡単な方法は、最初にKotlinのテストを追加することです：

[Javaプロジェクトに最初のKotlinテストを追加する](jvm-test-using-junit.md)

### 関連項目

* [KotlinとJavaの相互運用性の詳細](java-to-kotlin-interop.md)
* [Mavenビルド構成リファレンス](maven.md)