[//]: # (title: GradleとKotlin/JVMを始める)

このチュートリアルでは、IntelliJ IDEAとGradleを使用してJVMコンソールアプリケーションを作成する方法を説明します。

始めるには、まず[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)の最新バージョンをダウンロードしてインストールしてください。

## プロジェクトを作成する

1. IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
2. 左側のパネルで、**Kotlin**を選択します。
3. 必要に応じて、新しいプロジェクトに名前を付け、その場所を変更します。

   > **Create Git repository**チェックボックスを選択すると、新しいプロジェクトをバージョン管理下に置くことができます。これはいつでも後から実行できます。
   >
   {style="tip"}

   ![Create a console application](jvm-new-gradle-project.png){width=700}

4. **Gradle**ビルドシステムを選択します。
5. **JDK**リストから、プロジェクトで使用する[JDK](https://www.oracle.com/java/technologies/downloads/)を選択します。
    * JDKがコンピューターにインストールされているもののIDEに定義されていない場合は、**Add JDK**を選択してJDKホームディレクトリへのパスを指定します。
    * コンピューターにJDKがない場合は、**Download JDK**を選択します。

6. Gradle用の**Kotlin** DSLを選択します。
7. サンプルとして`"Hello World!"`アプリケーションを含むファイルを作成するために、**Add sample code**チェックボックスを選択します。

   > **Generate code with onboarding tips**オプションを有効にすると、サンプルコードに役立つコメントを追加できます。
   >
   {style="tip"}

8. **Create**をクリックします。

Gradleでプロジェクトの作成に成功しました！

#### プロジェクトのGradleバージョンを指定する {initial-collapse-state="collapsed" collapsible="true"}

**Advanced Settings**セクションで、Gradle Wrapperを使用するか、Gradleをローカルインストールするかにより、プロジェクトのGradleバージョンを明示的に指定できます。

* **Gradle Wrapper:**
   1. **Gradle distribution**リストから、**Wrapper**を選択します。
   2. **Auto-select**チェックボックスを無効にします。
   3. **Gradle version**リストから、Gradleバージョンを選択します。
* **ローカルインストール:**
   1. **Gradle distribution**リストから、**Local installation**を選択します。
   2. **Gradle location**には、ローカルのGradleバージョンのパスを指定します。

   ![Advanced settings](jvm-new-gradle-project-advanced.png){width=700}

## ビルドスクリプトを確認する

`build.gradle.kts`ファイルを開きます。これはGradle Kotlinビルドスクリプトで、Kotlin関連のアーティファクトやアプリケーションに必要なその他の部分が含まれています。

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%" // Kotlin version to use
}

group = "org.example" // A company name, for example, `org.jetbrains`
version = "1.0-SNAPSHOT" // Version to assign to the built artifact

repositories { // Sources of dependencies. See 1️⃣
    mavenCentral() // Maven Central Repository. See 2️⃣
}

dependencies { // All the libraries you want to use. See 3️⃣
    // Copy dependencies' names after you find them in a repository
    testImplementation(kotlin("test")) // The Kotlin test library
}

tasks.test { // See 4️⃣
    useJUnitPlatform() // JUnitPlatform for tests. See 5️⃣
}
```

* 1️⃣ [依存関係のソース](https://docs.gradle.org/current/userguide/declaring_repositories.html)について詳しく学習します。
* 2️⃣ [Maven Central Repository](https://central.sonatype.com/)。これは[GoogleのMavenリポジトリ](https://maven.google.com/)または会社のプライベートリポジトリである場合もあります。
* 3️⃣ [依存関係の宣言](https://docs.gradle.org/current/userguide/declaring_dependencies.html)について詳しく学習します。
* 4️⃣ [タスク](https://docs.gradle.org/current/dsl/org.gradle.api.Task.html)について詳しく学習します。
* 5️⃣ [テスト用のJUnitPlatform](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)。

ご覧のとおり、GradleビルドファイルにはいくつかのKotlin固有のアーティファクトが追加されています。

1. `plugins {}`ブロックには、`kotlin("jvm")`アーティファクトがあります。このプラグインは、プロジェクトで使用するKotlinのバージョンを定義します。

2. `dependencies {}`ブロックには、`testImplementation(kotlin("test"))`があります。
   [テストライブラリへの依存関係の設定](gradle-configure-project.md#set-dependencies-on-test-libraries)について詳しく学習します。

## アプリケーションを実行する

1. **View** | **Tool Windows** | **Gradle**を選択して、Gradleウィンドウを開きます。

   ![Main.kt with main fun](jvm-gradle-view-build.png){width=700}

2. `Tasks\build\`にある**build** Gradleタスクを実行します。**Build**ウィンドウに`BUILD SUCCESSFUL`が表示されます。
   これはGradleがアプリケーションを正常にビルドしたことを意味します。

3. `src/main/kotlin`にある`Main.kt`ファイルを開きます。
   * `src`ディレクトリにはKotlinソースファイルとリソースが含まれています。
   * `Main.kt`ファイルには、`Hello World!`と出力するサンプルコードが含まれています。

4. ガターにある緑色の**Run**アイコンをクリックし、**Run 'MainKt'**を選択してアプリケーションを実行します。

   ![Running a console app](jvm-run-app-gradle.png){width=350}

結果は**Run**ツールウィンドウで確認できます。

![Kotlin run output](jvm-output-gradle.png){width=600}

おめでとうございます！初めてのKotlinアプリケーションを実行しました。

## 次のステップ

詳細については、以下を参照してください。
* [Gradleビルドファイルのプロパティ](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N14E9A)。
* [異なるプラットフォームのターゲット設定とライブラリ依存関係の設定](gradle-configure-project.md)。
* [コンパイラオプションとその渡し方](gradle-compiler-options.md)。
* [インクリメンタルコンパイル、キャッシュサポート、ビルドレポート、およびKotlinデーモン](gradle-compilation-and-caches.md)。