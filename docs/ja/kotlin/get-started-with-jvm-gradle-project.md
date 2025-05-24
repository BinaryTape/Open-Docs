---
title: GradleとKotlin/JVMを始めよう
---
IntelliJ IDEAとGradleを使用してJVMコンソールアプリケーションを作成する方法を説明します。

まず、最新バージョンの[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)をダウンロードしてインストールします。

## プロジェクトを作成する

1. IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
2. 左側のパネルで、**Kotlin**を選択します。
3. 必要に応じて、新しいプロジェクトに名前を付け、その場所を変更します。

   > **Create Git repository**チェックボックスをオンにして、新しいプロジェクトをバージョン管理下に置きます。
   > これはいつでも後から実行できます。
   >
   

   <img src="/img/jvm-new-gradle-project.png" alt="コンソールアプリケーションを作成する" width="700" style={{verticalAlign: 'middle'}}/>

4. **Gradle**ビルドシステムを選択します。
5. **JDK list**から、プロジェクトで使用する[JDK](https://www.oracle.com/java/technologies/downloads/)を選択します。
    * JDKがコンピューターにインストールされていても、IDEで定義されていない場合は、**Add JDK**を選択して、JDKホームディレクトリへのパスを指定します。
    * コンピューターに必要なJDKがない場合は、**Download JDK**を選択します。

6. Gradleの**Kotlin** DSLを選択します。
7. **Add sample code**チェックボックスをオンにして、サンプルの`"Hello World!"`アプリケーションを含むファイルを作成します。

   > **Generate code with onboarding tips**オプションを有効にして、役立つコメントをサンプルコードに追加することもできます。
   >
   

8. **Create**をクリックします。

Gradleでプロジェクトが正常に作成されました。

#### プロジェクトのGradleバージョンを指定する

**Advanced Settings**セクションで、Gradle WrapperまたはGradleのローカルインストールを使用することにより、プロジェクトのGradleバージョンを明示的に指定できます。

* **Gradle Wrapper:**
   1. **Gradle distribution**リストから、**Wrapper**を選択します。
   2. **Auto-select**チェックボックスをオフにします。
   3. **Gradle version**リストから、Gradleバージョンを選択します。
* **Local installation:**
   1. **Gradle distribution**リストから、**Local installation**を選択します。
   2. **Gradle location**に、ローカルのGradleバージョンのパスを指定します。

   <img src="/img/jvm-new-gradle-project-advanced.png" alt="詳細設定" width="700" style={{verticalAlign: 'middle'}}/>

## ビルドスクリプトを調べる

`build.gradle.kts`ファイルを開きます。これはGradle Kotlinビルドスクリプトであり、Kotlin関連のアーティファクトとアプリケーションに必要なその他の部分が含まれています。

```kotlin
plugins {
    kotlin("jvm") version "2.1.20" // Kotlin version to use
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

* 1️⃣ [sources of dependencies](https://docs.gradle.org/current/userguide/declaring_repositories.html)の詳細をご覧ください。
* 2️⃣ [Maven Central Repository](https://central.sonatype.com/)。 [Google's Maven repository](https://maven.google.com/)または会社のプライベートリポジトリでもかまいません。
* 3️⃣ [declaring dependencies](https://docs.gradle.org/current/userguide/declaring_dependencies.html)の詳細をご覧ください。
* 4️⃣ [tasks](https://docs.gradle.org/current/dsl/org.gradle.api.Task.html)の詳細をご覧ください。
* 5️⃣ [JUnitPlatform for tests](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)。

ご覧のとおり、GradleビルドファイルにはいくつかのKotlin固有のアーティファクトが追加されています。

1. `plugins {}`ブロックには、`kotlin("jvm")`アーティファクトがあります。このプラグインは、プロジェクトで使用するKotlinのバージョンを定義します。

2. `dependencies {}`ブロックには、`testImplementation(kotlin("test"))`があります。
   [テストライブラリへの依存関係の設定](gradle-configure-project#set-dependencies-on-test-libraries)の詳細をご覧ください。

## アプリケーションを実行する

1. **View** | **Tool Windows** | **Gradle**を選択して、Gradleウィンドウを開きます。

   <img src="/img/jvm-gradle-view-build.png" alt="main funを含むMain.kt" width="700" style={{verticalAlign: 'middle'}}/>

2. `Tasks\build\`で**build** Gradleタスクを実行します。 **Build**ウィンドウに、`BUILD SUCCESSFUL`が表示されます。
   これは、Gradleがアプリケーションを正常に構築したことを意味します。

3. `src/main/kotlin`で、`Main.kt`ファイルを開きます。
   * `src`ディレクトリには、Kotlinソースファイルとリソースが含まれています。
   * `Main.kt`ファイルには、`Hello World!`を出力するサンプルコードが含まれています。

4. ガターにある緑色の**Run**アイコンをクリックしてアプリケーションを実行し、**Run 'MainKt'**を選択します。

   <img src="/img/jvm-run-app-gradle.png" alt="コンソールアプリの実行" width="350" style={{verticalAlign: 'middle'}}/>

**Run**ツールウィンドウに結果が表示されます。

<img src="/img/jvm-output-gradle.png" alt="Kotlinの実行出力" width="600" style={{verticalAlign: 'middle'}}/>

おめでとうございます！ 最初のKotlinアプリケーションを実行しました。

## 次のステップ

詳細については、以下をご覧ください。
* [Gradleビルドファイルのプロパティ](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N14E9A)。
* [異なるプラットフォームをターゲットにしてライブラリの依存関係を設定する](gradle-configure-project)。
* [コンパイラオプションとその渡し方](gradle-compiler-options)。
* [インクリメンタルコンパイル、キャッシュサポート、ビルドレポート、およびKotlinデーモン](gradle-compilation-and-caches)。