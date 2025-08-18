[//]: # (title: GradleとKotlin/JVMを始めよう)

このチュートリアルでは、IntelliJ IDEAとGradleを使用してJVMコンソールアプリケーションを作成する方法を説明します。

まず、[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)の最新バージョンをダウンロードしてインストールしてください。

## プロジェクトの作成

1. IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
2. 左側のパネルで、**Kotlin**を選択します。
3. 必要に応じて、新しいプロジェクトに名前を付け、場所を変更します。

   > **Create Git repository**チェックボックスを選択すると、新しいプロジェクトをバージョン管理下に置くことができます。これはいつでも後で行うことができます。
   >
   {style="tip"}

   ![Create a console application](jvm-new-gradle-project.png){width=700}

4. **Gradle**ビルドシステムを選択します。
5. **JDK**リストから、プロジェクトで使用したい[JDK](https://www.oracle.com/java/technologies/downloads/)を選択します。
    * JDKがお使いのコンピューターにインストールされているが、IDEで定義されていない場合は、**Add JDK**を選択し、JDKホームディレクトリへのパスを指定します。
    * 必要なJDKがお使いのコンピューターにない場合は、**Download JDK**を選択します。

6. Gradleの**Kotlin** DSLを選択します。
7. **Add sample code**チェックボックスを選択すると、サンプルアプリケーション`"Hello World!"`を含むファイルが作成されます。

   > **Generate code with onboarding tips**オプションを有効にすると、サンプルコードに役立つコメントを追加できます。
   >
   {style="tip"}

8. **Create**をクリックします。

Gradleを使用したプロジェクトの作成に成功しました！

#### プロジェクトのGradleバージョンを指定する {initial-collapse-state="collapsed" collapsible="true"}

**Advanced Settings**セクションで、Gradle WrapperまたはGradleのローカルインストールを使用することで、プロジェクトのGradleバージョンを明示的に指定できます。

*   **Gradle Wrapper:**
    1.  **Gradle distribution**リストから、**Wrapper**を選択します。
    2.  **Auto-select**チェックボックスを無効にします。
    3.  **Gradle version**リストから、使用するGradleバージョンを選択します。
*   **ローカルインストール:**
    1.  **Gradle distribution**リストから、**Local installation**を選択します。
    2.  **Gradle location**に、ローカルのGradleバージョンのパスを指定します。

   ![Advanced settings](jvm-new-gradle-project-advanced.png){width=700}

## ビルドスクリプトを探索する

`build.gradle.kts`ファイルを開きます。これはGradle Kotlinビルドスクリプトで、Kotlin関連のアーティファクトとアプリケーションに必要なその他の部分が含まれています。

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%" // 使用するKotlinのバージョン
}

group = "org.example" // 例: `org.jetbrains`のような会社名
version = "1.0-SNAPSHOT" // ビルドされたアーティファクトに割り当てるバージョン

repositories { // 依存関係のソース。1️⃣参照
    mavenCentral() // Maven Central Repository。2️⃣参照
}

dependencies { // 使用したいすべてのライブラリ。3️⃣参照
    // リポジトリで依存関係の名前を見つけた後にコピーする
    testImplementation(kotlin("test")) // Kotlinテストライブラリ
}

tasks.test { // 4️⃣参照
    useJUnitPlatform() // テスト用のJUnitPlatform。5️⃣参照
}
```

*   1️⃣ [依存関係のソース](https://docs.gradle.org/current/userguide/declaring_repositories.html)について詳しく学ぶ。
*   2️⃣ [Maven Central Repository](https://central.sonatype.com/)。これは[GoogleのMavenリポジトリ](https://maven.google.com/)、または会社のプライベートリポジトリである場合もあります。
*   3️⃣ [依存関係の宣言](https://docs.gradle.org/current/userguide/declaring_dependencies.html)について詳しく学ぶ。
*   4️⃣ [タスク](https://docs.gradle.org/current/dsl/org.gradle.api.Task.html)について詳しく学ぶ。
*   5️⃣ [テスト用のJUnitPlatform](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)。

ご覧のとおり、GradleビルドファイルにはいくつかのKotlin固有のアーティファクトが追加されています。

1.  `plugins {}`ブロックには、`kotlin("jvm")`アーティファクトがあります。このプラグインは、プロジェクトで使用されるKotlinのバージョンを定義します。

2.  `dependencies {}`ブロックには、`testImplementation(kotlin("test"))`があります。[テストライブラリの依存関係の設定](gradle-configure-project.md#set-dependencies-on-test-libraries)について詳しく学びましょう。

## アプリケーションの実行

1.  **View** | **Tool Windows** | **Gradle**を選択して、Gradleウィンドウを開きます。

   ![Main.kt with main fun](jvm-gradle-view-build.png){width=700}

2.  `Tasks\build\`にある**build** Gradleタスクを実行します。**Build**ウィンドウに`BUILD SUCCESSFUL`が表示されます。これは、Gradleがアプリケーションを正常にビルドしたことを意味します。

3.  `src/main/kotlin`にある`Main.kt`ファイルを開きます。
    *   `src`ディレクトリにはKotlinのソースファイルとリソースが含まれています。
    *   `Main.kt`ファイルには`Hello World!`を出力するサンプルコードが含まれています。

4.  ガターの緑色の**Run**アイコンをクリックし、**Run 'MainKt'**を選択してアプリケーションを実行します。

   ![Running a console app](jvm-run-app-gradle.png){width=350}

結果は**Run**ツールウィンドウで確認できます。

![Kotlin run output](jvm-output-gradle.png){width=600}

おめでとうございます！初めてのKotlinアプリケーションを実行しました。

## 次のステップ

詳細については、以下を参照してください。
*   [Gradleビルドファイルのプロパティ](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N14E9A)。
*   [異なるプラットフォームをターゲットにする方法とライブラリの依存関係の設定](gradle-configure-project.md)。
*   [コンパイラオプションとその渡し方](gradle-compiler-options.md)。
*   [増分コンパイル、キャッシュサポート、ビルドレポート、Kotlinデーモン](gradle-compilation-and-caches.md)。