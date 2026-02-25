[//]: # (title: KotlinとJUnitを使用してJavaコードをテストする – チュートリアル)

KotlinはJavaと完全に相互運用可能です。つまり、Kotlinを使用してJavaコードのテストを記述し、同じプロジェクト内の既存のJavaテストと一緒に実行することができます。

このチュートリアルでは、以下の方法を学びます：

* JUnitを使用してテストを実行するために、JavaとKotlinが混在するプロジェクトを構成する。
* Javaコードを検証するKotlinテストを追加する。
* MavenまたはGradleを使用してテストを実行する。

> 開始する前に、以下が用意されていることを確認してください：
>
> * Kotlinプラグインが同梱されている [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)（CommunityまたはUltimateエディション）、あるいは [Kotlin拡張機能](https://github.com/Kotlin/kotlin-lsp/tree/main?tab=readme-ov-file#vs-code-quick-start) がインストールされた [VS Code](https://code.visualstudio.com/Download)。
> * Java 17 以降
>
{style="note"}

## プロジェクトの構成

1. IDEで、バージョン管理からサンプルプロジェクトをクローンします：

   ```text
   https://github.com/kotlin-hands-on/kotlin-junit-sample.git
   ```

2. `initial` モジュールに移動し、プロジェクト構造を確認します：

    ```text
    kotlin-junit-sample/
    ├── initial/
    │   ├── src/
    │   │   ├── main/java/    # Javaソースコード
    │   │   └── test/java/    # Javaで記述されたJUnitテスト
    │   ├── pom.xml           # Maven設定
    │   └── build.gradle.kts  # Gradle設定
    ```

   `initial` モジュールには、単一のテストを含むJavaで記述されたシンプルなTodoアプリケーションが含まれています。

3. 同じディレクトリでビルドファイルを開き、Kotlinをサポートするように内容を更新します：

    <tabs group="build-system">
    <tab title="Maven" group-key="maven">

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" initial-collapse-state="collapsed" collapsible="true" ignore-vars="false" collapsed-title="pom.xml file"}

    * `<properties>` セクションで、Kotlinのバージョンを設定します。
    * `<dependencies>` セクションに、JUnit Jupiterの依存関係と、Kotlinテストをコンパイルして実行するための `kotlin-stdlib`（testスコア）を追加します。
    * `<build><plugins>` セクションで、`extensions` を有効にした `kotlin-maven-plugin` を適用し、KotlinとJavaの両方の `sourceDirs` を指定して `compile` および `test-compile` の実行を構成します。
    * extensionsを有効にしたKotlin Mavenプラグインを使用する場合、`<build><pluginManagement>` セクションに `maven-compiler-plugin` を追加する必要はありません。

    </tab>
    <tab title="Gradle" group-key="gradle">

    ```kotlin
   // build.gradle.kts
    group = "org.jetbrains.kotlin"
    version = "1.0-SNAPSHOT"
    description = "kotlin-junit-complete"
    java.sourceCompatibility = JavaVersion.VERSION_17
    
    plugins {
        application
        kotlin("jvm") version "%kotlinVersion%"
    }

    kotlin {
        jvmToolchain(17)
    }

    application {
        mainClass.set("org.jetbrains.kotlin.junit.App")
    }

    repositories {
        mavenCentral()
    }

    dependencies {
        implementation("com.gitlab.klamonte:jexer:1.6.0")

        testImplementation(kotlin("test"))
        testImplementation(libs.org.junit.jupiter.junit.jupiter.api)
        testImplementation(libs.org.junit.jupiter.junit.jupiter.params)
        testRuntimeOnly(libs.org.junit.jupiter.junit.jupiter.engine)
        testRuntimeOnly(libs.org.junit.platform.junit.platform.launcher)
    }

    tasks.test {
        useJUnitPlatform()
    }
    ```
   {initial-collapse-state="collapsed" collapsible="true" collapsed-title="build.gradle.kts"}

    * `plugins {}` ブロックに `kotlin("jvm")` プラグインを追加します。
    * JVMツールチェーンのバージョンを、使用しているJavaのバージョンに合わせます。
    * `dependencies {}` ブロックに、Kotlinのテストユーティリティを提供し、JUnitと統合する `kotlin.test` ライブラリを追加します。
      
    Kotlin/JVMは、最新の安定したJUnitバージョンであるJUnit 6をサポートしています。これは `gradle/libs.versions.toml` バージョンカタログで見つけることができます。
   
    一般的にバージョンカタログを使用することを好む場合は、そこに `kotlin("jvm")` プラグインを追加することもできます：

    ```toml
    # gradle/libs.versions.toml
    [versions]
    kotlin = "%kotlinVersion%"
    junit = "6.0.2"

    [libraries]
    org-junit-jupiter-junit-jupiter-api = { module = "org.junit.jupiter:junit-jupiter-api", version.ref = "junit" }
    org-junit-jupiter-junit-jupiter-params = { module = "org.junit.jupiter:junit-jupiter-params", version.ref = "junit" }
    org-junit-jupiter-junit-jupiter-engine = { module = "org.junit.jupiter:junit-jupiter-engine", version.ref = "junit" }
    org-junit-platform-junit-platform-launcher = { module = "org.junit.platform:junit-platform-launcher" }
      
    [plugins]
    kotlinJvm = { id = "org.jetbrains.kotlin.jvm", version.ref = "kotlin" }
    ```
    {initial-collapse-state="collapsed" collapsible="true" collapsed-title="libs.versions.toml"}

    </tab>
    </tabs>

4. IDEでビルドファイルを再読み込みします。

ビルドファイルの設定に関する詳細な手順については、[プロジェクトの構成](mixing-java-kotlin-intellij.md#project-configuration) を参照してください。

## 最初のKotlinテストを追加する

`initial/src/test/java` にある `TodoItemTest.java` テストは、アイテムの作成、デフォルト値、一意のID、状態の変化といったアプリの基本をすでに検証しています。

リポジトリレベルの動作を検証するKotlinテストを追加することで、テストの範囲を広げることができます：

1. 同じテストソースディレクトリ `initial/src/test/java` に移動します。
2. Javaテストと同じパッケージ内に `TodoRepositoryTest.kt` ファイルを作成します。
3. フィールド宣言とセットアップ関数を含むテストクラスを作成します：

   ```kotlin
   package org.jetbrains.kotlin.junit

   import org.junit.jupiter.api.BeforeEach
   import org.junit.jupiter.api.Assertions
   import org.junit.jupiter.api.Test
   import org.junit.jupiter.api.DisplayName

   internal class TodoRepositoryTest {
       lateinit var repository: TodoRepository
       lateinit var testItem1: TodoItem
       lateinit var testItem2: TodoItem

       @BeforeEach
       fun setUp() {
           repository = TodoRepository()
           testItem1 = TodoItem("Task 1", "Description 1")
           testItem2 = TodoItem("Task 2", "Description 2")
       }
   }
   ```

    * JUnit 5のアノテーションは、KotlinでもJavaと同じように動作します。
    * Kotlinでは、[`lateinit` キーワード](properties.md#late-initialized-properties-and-variables) を使用することで、後で初期化される非nullプロパティを宣言できます。これにより、テスト内で nullable 型 (`TodoRepository?`) を使用する必要がなくなります。

4. リポジトリの初期状態とそのサイズを確認するためのテストを `TodoRepositoryTest` クラス内に追加します：

   ```kotlin
   @Test
   @DisplayName("Should start with empty repository")
   fun shouldStartEmpty() {
       Assertions.assertEquals(0, repository.size())
       Assertions.assertTrue(repository.all.isEmpty())
   }
   ```

    * Javaの static インポートとは異なり、Jupiterの `Assertions` はクラスとしてインポートされ、アサーション関数の修飾子として使用されます。
    * `.getAll()` の呼び出しの代わりに、Kotlinでは `repository.all` のようにJavaのゲッターにプロパティとしてアクセスできます。

5. 全アイテムのコピー動作を検証する別のテストを記述します：

   ```kotlin
   @Test
   @DisplayName("Should return defensive copy of items")
   fun shouldReturnDefensiveCopy() {
       repository.add(testItem1)

       val items1 = repository.all
       val items2 = repository.all

       Assertions.assertNotSame(items1, items2)
       Assertions.assertThrows(
           UnsupportedOperationException::class.java
       ) { items1.clear() }
       Assertions.assertEquals(1, repository.size())
   }
   ```

    * KotlinクラスからJavaのクラスオブジェクトを取得するには、`::class.java` を使用します。
    * 複雑なアサーションは、特別な継続文字を使用せずに複数行に分割できます。

6. IDによるアイテムの検索を検証するテストを追加します：

   ```kotlin
   @Test
   @DisplayName("Should find item by ID")
   fun shouldFindItemById() {
       repository.add(testItem1)
       repository.add(testItem2)

        val found = repository.getById(testItem1.id())

        Assertions.assertTrue(found.isPresent)
        Assertions.assertEquals(testItem1, found.get())
   }
   ```

   KotlinはJavaの [`Optional` API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Optional.html) とスムーズに連携します。ゲッターメソッドは自動的にプロパティに変換されるため、ここでは `isPresent()` メソッドにプロパティとしてアクセスしています。

7. アイテム削除の仕組みを検証するテストを記述します：

   ```kotlin
    @Test
    @DisplayName("Should remove item by ID")
    fun shouldRemoveItemById() {
        repository.add(testItem1)
        repository.add(testItem2)

        val removed = repository.remove(testItem1.id())

        Assertions.assertTrue(removed)
        Assertions.assertEquals(1, repository.size())
        Assertions.assertTrue(repository.getById(testItem1.id()).isEmpty)
        Assertions.assertTrue(repository.getById(testItem2.id()).isPresent)
    }
   
    @Test
    @DisplayName("Should return false when removing non-existent item")
    fun shouldReturnFalseForNonExistentRemoval() {
        repository.add(testItem1)

        val removed = repository.remove("non-existent-id")

        Assertions.assertFalse(removed)
        Assertions.assertEquals(1, repository.size())
    }
   ```

   Kotlinでは、`repository.getById(id).isEmpty` のように、メソッド呼び出しとプロパティアクセスをチェーンさせることができます。

> 追加の機能をカバーするために、さらに多くのテストを `TodoRepositoryTest` クラスに追加することができます。
> 完全なソースコードについては、サンプルプロジェクトの [`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/blob/main/complete/src/test/java/org/jetbrains/kotlin/junit/TodoRepositoryTest.kt) モジュールを確認してください。
>
{style="tip"}

## テストの実行

JavaとKotlinの両方のテストを実行して、プロジェクトが期待通りに動作することを確認します：

1. ガターアイコンを使用してテストを実行します：

   ![テストを実行する](run-test.png)

   コマンドラインを使用して、`initial` ディレクトリからプロジェクトのすべてのテストを実行することもできます：

    <tabs group="build-system">
    <tab title="Maven" group-key="maven">

    ```bash
    mvn test
    ```

    </tab>
    <tab title="Gradle" group-key="gradle">

    ```bash
    ./gradlew test
    ```

    </tab>
    </tabs>

2. 変数の値の一つを変更して、テストが正しく動作することを確認します。
   例えば、`shouldAddItem` テストを修正して、誤ったリポジトリサイズを期待するようにします：

   ```kotlin
   @Test
   @DisplayName("Should add item to repository")
   fun shouldAddItem() {
       repository.add(testItem1)

       Assertions.assertEquals(2, repository.size())  // 1 から 2 に変更
       Assertions.assertTrue(repository.all.contains(testItem1))
   }
   ```

3. テストを再度実行し、失敗することを確認します：

   ![テスト結果の確認。テストが失敗しました](test-failed.png)

> テストが含まれた完全に構成済みのプロジェクトは、サンプルプロジェクトの
> [`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete) モジュールにあります。
>
{style="tip"}

## 他のテストライブラリを探索する

JUnitの他に、KotlinとJavaの両方をサポートする他のライブラリを使用することもできます：

| ライブラリ                                                     | 説明                                                                                                        |
|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| [AssertJ](https://github.com/assertj/assertj)               | チェーン可能なアサーションを備えた、流暢な（Fluent）アサーションライブラリ。                                                                |
| [Mockito-Kotlin](https://github.com/mockito/mockito-kotlin) | ヘルパー関数を提供し、Kotlinの型システムとの親和性を高めたMockitoのKotlinラッパー。          |
| [MockK](https://github.com/mockk/mockk)                     | コルーチンや拡張関数を含むKotlin固有の機能をサポートする、ネイティブのKotlinモックライブラリ。 |
| [Kotest](https://github.com/kotest/kotest)                  | 複数のアサーションスタイルと広範なマッチャーのサポートを提供する、Kotlin用のアサーションライブラリ。                     |
| [Strikt](https://github.com/robfletcher/strikt)             | 型安全なアサーションとデータクラスのサポートを備えた、Kotlin用のアサーションライブラリ。                               |

## 次のステップ

* [KotlinのPower-assertコンパイラプラグイン](power-assert.md) を使用して、テスト出力を改善する。
* [KotlinとSpring Bootを使用して最初のサーバーサイドアプリケーション](jvm-get-started-spring-boot.md) を作成する。
* [`kotlin.test` ライブラリ](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/) の機能を探索する。