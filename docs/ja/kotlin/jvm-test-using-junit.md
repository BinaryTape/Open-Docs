[//]: # (title: KotlinとJUnitを使ってJavaコードをテストする – チュートリアル)

KotlinはJavaと完全に相互運用可能であり、Kotlinを使ってJavaコードのテストを書き、既存のJavaテストと同じプロジェクトで一緒に実行できます。

このチュートリアルでは、以下の方法を学びます。

*   JavaとKotlinが混在するプロジェクトで[JUnit 5](https://junit.org/junit5/)を使用してテストを実行するように設定する。
*   Javaコードを検証するKotlinのテストを追加する。
*   MavenまたはGradleを使用してテストを実行する。

> 開始する前に、以下があることを確認してください。
>
> *   Kotlinプラグインがバンドルされた[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) (CommunityまたはUltimateエディション) または、[Kotlin拡張機能](https://github.com/Kotlin/kotlin-lsp/tree/main?tab=readme-ov-file#vs-code-quick-start)がインストールされた[VS Code](https://code.visualstudio.com/Download)。
> *   Java 17以降
>
{style="note"}

## プロジェクトを設定する

1.  お使いのIDEで、バージョン管理からサンプルプロジェクトをクローンします。

    ```text
    https://github.com/kotlin-hands-on/kotlin-junit-sample.git
    ```

2.  `initial`モジュールに移動し、プロジェクト構造を確認します。

    ```text
    kotlin-junit-sample/
    ├── initial/
    │   ├── src/
    │   │   ├── main/java/    # Java source code
    │   │   └── test/java/    # JUnit test in Java
    │   ├── pom.xml           # Maven configuration
    │   └── build.gradle.kts  # Gradle configuration
    ```

    `initial`モジュールには、単一のテストを含むシンプルなJavaのTodoアプリケーションが含まれています。

3.  同じディレクトリで、Mavenの場合は`pom.xml`、Gradleの場合は`build.gradle.kts`のビルドファイルを開き、Kotlinをサポートするように内容を更新します。

    <tabs group="build-system">
    <tab title="Maven" group-key="maven">

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" initial-collapse-state="collapsed" collapsible="true" ignore-vars="false" collapsed-title="pom.xmlファイル"}

    *   `<properties>`セクションで、Kotlinのバージョンを設定します。
    *   `<dependencies>`セクションで、JUnit Jupiterの依存関係と、Kotlinテストのコンパイルおよび実行のために`kotlin-stdlib` (testスコープ) を追加します。
    *   `<build><plugins>`セクションで、`extensions`を有効にして`kotlin-maven-plugin`を適用し、KotlinとJavaの両方に対して`sourceDirs`で`compile`および`test-compile`の実行を設定します。
    *   拡張機能付きのKotlin Mavenプラグインを使用する場合、`<build><pluginManagement>`セクションに`maven-compiler-plugin`を追加する必要はありません。

    </tab>
    <tab title="Gradle" group-key="gradle">

    ```kotlin
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
   {initial-collapse-state="collapsed" collapsible="true" collapsed-title="build.gradle.ktsファイル"}

    *   `plugins {}`ブロックに、`kotlin("jvm")`プラグインを追加します。
    *   JVMツールチェーンのバージョンをJavaのバージョンと一致させます。
    *   `dependencies {}`ブロックに、Kotlinのテストユーティリティを提供し、JUnitと統合する`kotlin.test`ライブラリを追加します。

    </tab>
    </tabs>

4.  IDEでビルドファイルをリロードします。

ビルドファイルの設定に関する詳細な手順については、[プロジェクト構成](mixing-java-kotlin-intellij.md#project-configuration)を参照してください。

## 最初のKotlinテストを追加する

`initial/src/test/java`にある`TodoItemTest.java`テストは、アイテムの作成、デフォルト値、一意のID、状態変更といったアプリの基本機能をすでに検証しています。

リポジトリレベルの動作を検証するKotlinテストを追加することで、テストカバレッジを拡張できます。

1.  同じテストソースディレクトリ`initial/src/test/java`に移動します。
2.  Javaテストと同じパッケージに`TodoRepositoryTest.kt`ファイルを作成します。
3.  フィールド宣言とセットアップ関数を持つテストクラスを作成します。

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

    *   JUnit 5のアノテーションは、Javaと同様にKotlinでも同じように機能します。
    *   Kotlinでは、[`lateinit`キーワード](properties.md#late-initialized-properties-and-variables)を使用すると、後で初期化される非nullプロパティを宣言できます。これにより、テストでnullable型 (`TodoRepository?`) を使用する必要がなくなります。

4.  `TodoRepositoryTest`クラス内に、初期リポジトリの状態とそのサイズをチェックするテストを追加します。

    ```kotlin
    @Test
    @DisplayName("Should start with empty repository")
    fun shouldStartEmpty() {
        Assertions.assertEquals(0, repository.size())
        Assertions.assertTrue(repository.all.isEmpty())
    }
    ```

    *   Javaの静的インポートとは異なり、Jupiterの`Assertions`はクラスとしてインポートされ、アサーション関数の修飾子として使用されます。
    *   `.getAll()`呼び出しの代わりに、Kotlinでは`repository.all`でJavaのゲッターにプロパティとしてアクセスできます。

5.  すべてのアイテムのコピー動作を検証する別のテストを作成します。

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

    *   KotlinクラスからJavaクラスオブジェクトを取得するには、`::class.java`を使用します。
    *   特別な継続文字を使用せずに、複雑なアサーションを複数行に分割できます。

6.  IDでアイテムを検索するテストを追加します。

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

    KotlinはJavaの[`Optional` API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Optional.html)とスムーズに連携します。ゲッターメソッドは自動的にプロパティに変換されるため、ここでは`isPresent()`メソッドにプロパティとしてアクセスされています。

7.  アイテム削除メカニズムを検証するテストを作成します。

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

    Kotlinでは、`repository.getById(id).isEmpty`のように、メソッド呼び出しとプロパティアクセスをチェーンできます。

> 追加機能をカバーするために、`TodoRepositoryTest`テストクラスにさらにテストを追加できます。
> サンプルプロジェクトの[`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/blob/main/complete/src/test/java/org/jetbrains/kotlin/junit/TodoRepositoryTest.kt)モジュールで完全なソースコードを参照してください。
>
{style="tip"}

## テストを実行する

プロジェクトが期待どおりに動作することを確認するために、JavaとKotlinの両方のテストを実行します。

1.  ガターアイコンを使用してテストを実行します。

    ![Run the test](run-test.png)

    また、`initial`ディレクトリからコマンドラインを使用してすべてのプロジェクトテストを実行することもできます。

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

2.  変数の値を1つ変更して、テストが正しく機能することを確認します。たとえば、`shouldAddItem`テストを修正して、誤ったリポジトリサイズを期待するようにします。

    ```kotlin
    @Test
    @DisplayName("Should add item to repository")
    fun shouldAddItem() {
        repository.add(testItem1)

        Assertions.assertEquals(2, repository.size())  // 1から2に変更
        Assertions.assertTrue(repository.all.contains(testItem1))
    }
    ```

3.  テストを再度実行し、失敗することを確認します。

    ![Check the test result. The test has failed](test-failed.png)

> テストを含む完全に設定されたプロジェクトは、サンプルプロジェクトの[`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)モジュールにあります。
>
{style="tip"}

## その他のテストライブラリを探索する

JUnit以外にも、KotlinとJavaの両方をサポートする他のライブラリを使用できます。

| ライブラリ                                                      | 説明                                                                                                          |
|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| [AssertJ](https://github.com/assertj/assertj)               | チェーン可能なアサーションを備えた流暢なアサーションライブラリ。                                                                |
| [Mockito-Kotlin](https://github.com/mockito/mockito-kotlin) | MockitoのKotlinラッパーで、ヘルパー関数とKotlin型システムとのより良い統合を提供します。          |
| [MockK](https://github.com/mockk/mockk)                     | コルーチンや拡張関数を含むKotlin固有の機能をサポートするネイティブKotlinモックライブラリ。 |
| [Kotest](https://github.com/kotest/kotest)                  | 複数のアサーションスタイルと広範なマッチャーサポートを提供するKotlin用アサーションライブラリ。                     |
| [Strikt](https://github.com/robfletcher/strikt)             | 型安全なアサーションとデータクラスのサポートを備えたKotlin用アサーションライブラリ。                               |

## 次のステップ

*   [KotlinのPower-assertコンパイラプラグイン](power-assert.md)でテスト出力を改善する。
*   KotlinとSpring Bootを使って[最初のサーバーサイドアプリケーションを作成する](jvm-get-started-spring-boot.md)。
*   [`kotlin.test`ライブラリ](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/)の機能を探索する。