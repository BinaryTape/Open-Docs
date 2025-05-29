[//]: # (title: JVMでJUnitを使ってテストコードを書く – チュートリアル)

このチュートリアルでは、Kotlin/JVMプロジェクトでシンプルな単体テストを記述し、Gradleビルドツールを使って実行する方法を説明します。

このプロジェクトでは、[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/index.html)ライブラリを使用し、JUnitを使ってテストを実行します。
マルチプラットフォームアプリに取り組んでいる場合は、[Kotlin Multiplatformチュートリアル](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)を参照してください。

始めるには、まず[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)の最新バージョンをダウンロードしてインストールしてください。

## 依存関係の追加

1. IntelliJ IDEAでKotlinプロジェクトを開きます。プロジェクトがない場合は、
   [作成してください](https://www.jetbrains.com/help/idea/create-your-first-kotlin-app.html#create-project)。

2. `build.gradle(.kts)`ファイルを開き、`testImplementation`依存関係が存在することを確認します。
   この依存関係により、`kotlin.test`と`JUnit`を扱うことができます。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       // その他の依存関係。
       testImplementation(kotlin("test"))
   }
   ```

    </tab>
    <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       // その他の依存関係。
       testImplementation 'org.jetbrains.kotlin:kotlin-test'
   }
   ```

   </tab>
   </tabs>

3. `build.gradle(.kts)`ファイルに`test`タスクを追加します。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   tasks.test {
       useJUnitPlatform()
   }
   ```

    </tab>
    <tab title="Groovy" group-key="groovy">

   ```groovy
   test {
       useJUnitPlatform()
   }
   ```

   </tab>
   </tabs>

   > ビルドスクリプトで`useJUnitPlatform()`関数を使用すると、
   > `kotlin-test`ライブラリは自動的にJUnit 5を依存関係として含めます。
   > この設定により、JVM専用プロジェクトやKotlin Multiplatform (KMP)プロジェクトのJVMテストにおいて、
   > `kotlin-test` APIとともにすべてのJUnit 5 APIにアクセスできるようになります。
   >
   {style="note"}

以下に、`build.gradle.kts`の完全なコードを示します。

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
```
{initial-collapse-state="collapsed" collapsible="true"}

## テスト対象コードの追加

1. `src/main/kotlin`内の`Main.kt`ファイルを開きます。

   `src`ディレクトリには、Kotlinのソースファイルとリソースが含まれています。
   `Main.kt`ファイルには、`Hello, World!`を出力するサンプルコードが含まれています。

2. 2つの整数を合計する`sum()`関数を持つ`Sample`クラスを作成します。

   ```kotlin
   class Sample() {
       fun sum(a: Int, b: Int): Int {
           return a + b
       }
   }
   ```

## テストの作成

1. IntelliJ IDEAで、`Sample`クラスに対して**Code** | **Generate** | **Test...**を選択します。

   ![Generate a test](generate-test.png)

2. テストクラスの名前を指定します。例えば、`SampleTest`とします。

   ![Create a test](create-test.png)

   IntelliJ IDEAは、`test`ディレクトリ内に`SampleTest.kt`ファイルを作成します。
   このディレクトリには、Kotlinのテストソースファイルとリソースが含まれています。

   > `src/test/kotlin`にテスト用の`*.kt`ファイルをD手動で作成することもできます。
   >
   {style="note"}

3. `SampleTest.kt`ファイルに`sum()`関数のテストコードを追加します。

   * [`@Test`アノテーション](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-test/index.html)を使って、テスト関数`testSum()`を定義します。
   * [`assertEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-equals.html)関数を使って、`sum()`関数が期待する値を返すことを確認します。

   ```kotlin
   import org.example.Sample
   import org.junit.jupiter.api.Assertions.*
   import kotlin.test.Test

   class SampleTest {
       private val testSample: Sample = Sample()

       @Test
       fun testSum() {
           val expected = 42
           assertEquals(expected, testSample.sum(40, 2))
       }
   }
   ```

## テストの実行

1. ガターアイコンを使ってテストを実行します。

   ![Run the test](run-test.png)

   > `./gradlew check`コマンドを使用して、コマンドラインインターフェース経由でプロジェクトのすべてのテストを実行することもできます。
   >
   {style="note"}

2. **Run**ツールウィンドウで結果を確認します。

   ![Check the test result. The test passed successfully](test-successful.png)

   テスト関数は正常に実行されました。

3. `expected`変数の値を43に変更して、テストが正しく動作するか確認します。

   ```kotlin
   @Test
   fun testSum() {
       val expected = 43
       assertEquals(expected, classForTesting.sum(40, 2))
   }
   ```

4. もう一度テストを実行し、結果を確認します。

   ![Check the test result. The test has failed](test-failed.png)

   テストの実行は失敗しました。

## 次のステップ

最初のテストを終えたら、次のことができます。

* 他の`kotlin.test`関数を使って、さらにテストを記述します。
   例えば、[`assertNotEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-not-equals.html)関数を使用します。
* [Kotlin Power-assertコンパイラプラグイン](power-assert.md)を使って、テスト出力を改善します。
   このプラグインは、テスト出力にコンテキスト情報（contextual information）を付加します。
* KotlinとSpring Bootを使って、[最初のサーバーサイドアプリケーションを作成](jvm-get-started-spring-boot.md)します。