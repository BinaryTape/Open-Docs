[//]: # (title: JavaプロジェクトにKotlinを追加する – チュートリアル)

<web-summary>Kotlinを既存のJavaプロジェクトに統合する − MavenまたはGradleビルドファイルを構成し、ソースファイルを整理して、IntelliJ IDEAでJavaコードをKotlinに変換します。</web-summary>

KotlinはJavaと完全に相互運用可能であるため、すべてを書き直すことなく、既存のJavaプロジェクトに段階的に導入できます。

このチュートリアルでは、以下の方法を学びます：

* JavaとKotlinの両方のコードをコンパイルするようにMavenまたはGradleビルドツールをセットアップする。
* プロジェクトディレクトリ内でJavaとKotlinのソースファイルを整理する。
* IntelliJ IDEAを使用してJavaファイルをKotlinに変換する。

> このチュートリアルでは、既存の任意のJavaプロジェクトを使用するか、MavenとGradleの両方のビルドファイルが既にセットアップされている公開[サンプルプロジェクト](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)をクローンして使用できます。
> 
> また、[用意されたスキル](https://github.com/Kotlin/kotlin-agent-skills/blob/main/skills/kotlin-tooling-java-to-kotlin/SKILL.md)を使用して、お好みのAIエージェントに変換を任せることもできます。AIによる処理結果は完全には予測可能ではないことに注意してください。
>
{style="tip"}

## プロジェクトの構成

JavaプロジェクトにKotlinを追加するには、使用するビルドツールに応じて、KotlinとJavaの両方を使用するようにプロジェクトを構成する必要があります。

プロジェクトを構成することで、KotlinとJavaの両方のコードが適切にコンパイルされ、相互にシームレスに参照できるようになります。

### Maven

> **IntelliJ IDEA 2025.3** 以降、MavenベースのJavaプロジェクトに最初のKotlinファイルを追加すると、IDEは自動的に `pom.xml` ファイルを更新してKotlin Mavenプラグインと標準の依存関係を含めます。バージョンのカスタマイズやビルドフェーズの調整が必要な場合は、手動で構成することもできます。
>
{style="note"}

MavenプロジェクトでKotlinとJavaを併用するには、`pom.xml` ファイルにKotlin Mavenプラグインを適用し、Kotlinの依存関係を追加します：

1. `<properties>` セクションに、Kotlinバージョンのプロパティを追加します：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" ignore-vars="false" include-lines="13,17,18"}

2. `<dependencies>` セクションに必要な依存関係を追加し、`<plugins>` セクションにも必要な構成を追加します：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="32,38-43,45-49,55"}

3. `<build><plugins>` セクションにKotlinプラグインを追加します：

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="57-58,95-96,99-107"}

   Kotlin Mavenプラグインで `<extensions>true</extensions>` を有効にすると、以下に役立ちます：

   * `kotlin-stdlib` 依存関係をプロジェクトに自動的に追加する。
   * Kotlinを最初にコンパイルし、次にJavaをコンパイルするように実行フェーズを構成する。
   * Javaコード内でKotlinコードを参照し、その逆も可能にする。
   * JVMターゲットバージョンをJavaコンパイラのバージョンと自動的に合わせる。

   extensionsを有効にしたKotlin Mavenプラグインを使用する場合、`<build><pluginManagement>` セクションに個別の `maven-compiler-plugin` は必要ありません。

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

## コンパイラプラグインを詳しく見る {initial-collapse-state="collapsed" collapsible="true"}

[Spring](https://spring.io/) や Java Persistence API (JPA) を使用するより複雑なプロジェクトがある場合は、Kotlin の言語機能をフレームワークの期待に自動的に適合させ、ボイラープレートを削減する Kotlin コンパイラプラグインを使用できます：

* **[`all-open`](all-open-plugin.md)** プラグインは、特定の注釈（アノテーション）が使用されている場合に、クラスとそのメンバーを自動的に `open` にします。これは、クラスが non-final であることを必要とする Spring のようなフレームワークに特に便利です。

  Spring の場合、`all-open` の上に構築されたラッパーである専用の [`kotlin-spring`](all-open-plugin.md#spring-support) プラグインを使用できます。これは Spring のアノテーションを自動的に指定します。
* **[`no-arg`](no-arg-plugin.md)** プラグインは、特定の注釈を持つクラスに対して引数なしのコンストラクタ（zero-argument constructor）を追加で生成します。これにより、デフォルトコンストラクタを持たないクラスを JPA がインスタンス化できるようになります。

  [`kotlin-jpa`](no-arg-plugin.md#jpa-support) プラグインも使用できます。これは `no-arg` の上に構築されたラッパーであり、no-arg アノテーションを自動的に指定します。
* **[`power-assert`](power-assert.md)** プラグインは、アサーションに対してコンテキスト情報を含む詳細な失敗メッセージを提供することで、デバッグ体験を向上させます。中間値を表示し、テストが失敗した理由を理解するのに役立ちます。

## 次のステップ

JavaプロジェクトでKotlinを使い始める最も簡単な方法は、最初にKotlinのテストを追加することです：

[Javaプロジェクトに最初のKotlinテストを追加する](jvm-test-using-junit.md)

### 関連項目

* [KotlinとJavaの相互運用性の詳細](java-to-kotlin-interop.md)
* [Mavenビルド構成リファレンス](maven.md)