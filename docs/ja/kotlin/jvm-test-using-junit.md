---
title: "JVM で JUnit を使用してテスト コードを作成する – チュートリアル"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

このチュートリアルでは、Kotlin/JVM プロジェクトで簡単なユニットテストを作成し、Gradle ビルドツールで実行する方法を説明します。

このプロジェクトでは、[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/index.html) ライブラリを使用し、JUnit を使用してテストを実行します。
マルチプラットフォームアプリで作業している場合は、[Kotlin Multiplatform tutorial](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html) を参照してください。

まず、[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) の最新バージョンをダウンロードしてインストールします。

## 依存関係を追加する

1. IntelliJ IDEA で Kotlin プロジェクトを開きます。プロジェクトがない場合は、
   [作成してください](https://www.jetbrains.com/help/idea/create-your-first-kotlin-app.html#create-project)。

2. `build.gradle(.kts)` ファイルを開き、`testImplementation` 依存関係が存在することを確認します。
   この依存関係により、`kotlin.test` および JUnit を使用できます。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   dependencies {
       // Other dependencies.
       testImplementation(kotlin("test"))
   }
   ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

   ```groovy
   dependencies {
       // Other dependencies.
       testImplementation 'org.jetbrains.kotlin:kotlin-test'
   }
   ```

   </TabItem>
   </Tabs>

3. `test` タスクを `build.gradle(.kts)` ファイルに追加します。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   tasks.test {
       useJUnitPlatform()
   }
   ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

   ```groovy
   test {
       useJUnitPlatform()
   }
   ```

   </TabItem>
   </Tabs>

   > ビルドスクリプトで `useJUnitPlatform()` 関数を使用すると、
   > `kotlin-test` ライブラリには JUnit 5 が依存関係として自動的に含まれます。
   > この設定により、`kotlin-test` API とともに、すべての JUnit 5 API にアクセスできます。
   > JVM 専用のプロジェクト、および Kotlin Multiplatform (KMP) プロジェクトの JVM テストで。
   >
   

`build.gradle.kts` の完全なコードを以下に示します。

```kotlin
plugins {
    kotlin("jvm") version "2.1.20"
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

## テストするコードを追加する

1. `src/main/kotlin` の `Main.kt` ファイルを開きます。

   `src` ディレクトリには、Kotlin のソースファイルとリソースが含まれています。
   `Main.kt` ファイルには、`Hello, World!` を出力するサンプルコードが含まれています。

2. 2 つの整数を加算する `sum()` 関数を持つ `Sample` クラスを作成します。

   ```kotlin
   class Sample() {

       fun sum(a: Int, b: Int): Int {
           return a + b
       }
   }
   ```

## テストを作成する

1. IntelliJ IDEA で、**Code** | **Generate** | **Test...** を `Sample` クラスに対して選択します。

   <img src="/img/generate-test.png" alt="Create a test" style={{verticalAlign: 'middle'}}/>

2. テストクラスの名前を指定します。たとえば、`SampleTest` です。

   <img src="/img/create-test.png" alt="Create a test" style={{verticalAlign: 'middle'}}/>

   IntelliJ IDEA は、`test` ディレクトリに `SampleTest.kt` ファイルを作成します。
   このディレクトリには、Kotlin のテストソースファイルとリソースが含まれています。

   > テスト用の `*.kt` ファイルを `src/test/kotlin` に手動で作成することもできます。
   >
   

3. `SampleTest.kt` の `sum()` 関数にテストコードを追加します。

   * [`@Test` annotation](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-test/index.html) を使用して、テスト `testSum()` 関数を定義します。
   * [`assertEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-equals.html) 関数を使用して、`sum()` 関数が期待値を返すことを確認します。

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

## テストを実行する

1. ガターアイコンを使用してテストを実行します。

   <img src="/img/run-test.png" alt="Run the test" style={{verticalAlign: 'middle'}}/>

   > コマンドラインインターフェイスで `./gradlew check` コマンドを使用すると、プロジェクトのすべてのテストを実行することもできます。
   >
   

2. **Run** ツールウィンドウで結果を確認します。

   <img src="/img/test-successful.png" alt="Check the test result. The test passed successfully" style={{verticalAlign: 'middle'}}/>

   テスト関数は正常に実行されました。

3. `expected` 変数の値を 43 に変更して、テストが正しく動作することを確認します。

   ```kotlin
   @Test
   fun testSum() {
       val expected = 43
       assertEquals(expected, classForTesting.sum(40, 2))
   }
   ```

4. テストを再度実行し、結果を確認します。

   <img src="/img/test-failed.png" alt="Check the test result. The test has failed" style={{verticalAlign: 'middle'}}/>

   テストの実行に失敗しました。

## 次のステップ

最初のテストが完了したら、次のことができます。

* その他の [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/) 関数を使用して、より多くのテストを作成します。
   たとえば、[`assertNotEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-not-equals.html) 関数を使用します。
* [Kotlin Power-assert compiler plugin](power-assert) でテスト出力を改善します。
   このプラグインは、コンテキスト情報を含むテスト出力を強化します。
* Kotlin と Spring Boot で [最初のサーバーサイドアプリケーションを作成する](jvm-get-started-spring-boot)。
  ```