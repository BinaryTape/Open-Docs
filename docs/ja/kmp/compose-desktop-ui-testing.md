[//]: # (title: JUnit を使用した Compose Multiplatform UI のテスト)

デスクトップ版 Compose Multiplatform は、JUnit と Jetpack Compose テスト API に基づくテスト API を提供します。
実装の詳細については、Jetpack Compose ドキュメントの [Compose レイアウトをテストする](https://developer.android.com/develop/ui/compose/testing) ガイドを参照してください。

> すべてのサポート対象プラットフォームで利用可能な UI テスト機能については、[Compose Multiplatform UI のテスト](compose-test.md) の記事を参照してください。
>
{style="tip"}

JUnit ベースのテストが動作するのを見るために、[Kotlin Multiplatform wizard](https://kmp.jetbrains.com/) で生成されたプロジェクトから始めましょう。既存のプロジェクトにテストを追加する場合、パスやコマンドの `composeApp` を、テスト対象のモジュール名（例: `shared`）に置き換える必要があるかもしれません。

テストソースセットを作成し、必要な依存関係を追加します。

1. テスト用のディレクトリ `composeApp/src/desktopTest/kotlin` を作成します。
2. `composeApp/build.gradle.kts` ファイルに、次の依存関係を追加します。

   ```kotlin
   kotlin { 
       //...
       sourceSets { 
           //...
           val desktopTest by getting { 
               dependencies {
                   implementation(compose.desktop.uiTestJUnit4)
                   implementation(compose.desktop.currentOs)
               }
           }
       }
   }
   ```

3. `ExampleTest.kt` というテストファイルを作成し、次のコードをコピーします。

    ```kotlin
    import androidx.compose.material.*
    import androidx.compose.runtime.*
    import androidx.compose.ui.Modifier
    import androidx.compose.ui.test.*
    import androidx.compose.ui.platform.testTag
    import androidx.compose.ui.test.junit4.createComposeRule
    import org.junit.Rule
    import org.junit.Test
    
    class ExampleTest {
        @get:Rule
        val rule = createComposeRule()
    
        @Test
        fun myTest(){
            // Declares a mock UI to demonstrate API calls
            //
            // Replace with your own declarations to test the code in your project
            rule.setContent {
                var text by remember { mutableStateOf("Hello") }
   
                Text(
                    text = text,
                    modifier = Modifier.testTag("text")
                )
                Button(
                    onClick = { text = "Compose" },
                    modifier = Modifier.testTag("button")
                ) {
                    Text("Click me")
                }
            }
    
            // Tests the declared UI with assertions and actions of the JUnit-based testing API
            rule.onNodeWithTag("text").assertTextEquals("Hello")
            rule.onNodeWithTag("button").performClick()
            rule.onNodeWithTag("text").assertTextEquals("Compose")
        }
    }
    ```

4. テストを実行するには、`myTest()` 関数の横のガターにある実行アイコンをクリックするか、ターミナルで次のコマンドを実行します。

   ```shell
   ./gradlew desktopTest
   ```
   
## 次に

* [マルチプラットフォームテストを作成および実行する](multiplatform-run-tests.md) 方法を参照してください。
* Kotlin プロジェクトでの JUnit ベースのテストの概要については、[JVM で JUnit を使用してコードをテストする](https://kotlinlang.org/docs/jvm-test-using-junit.html) チュートリアルを参照してください。