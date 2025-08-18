[//]: # (title: Compose Multiplatform UI を JUnit でテストする)

デスクトップ版Compose Multiplatformは、JUnitおよびJetpack ComposeテストAPIに基づいたテストAPIを提供します。
実装の詳細については、Jetpack Composeドキュメント内の「[Test your Compose layout](https://developer.android.com/develop/ui/compose/testing)」ガイドを参照してください。

> サポートされているすべてのプラットフォームで利用可能なUIテスト機能については、「[Testing Compose Multiplatform UI](compose-test.md)」の記事を参照してください。
>
{style="tip"}

JUnitベースのテストを実際に見てみるには、[Kotlin Multiplatform wizard](https://kmp.jetbrains.com/)で生成されたプロジェクトから始めましょう。
既存のプロジェクトにテストを追加する場合、パスやコマンド内の`composeApp`を、テストしているモジュール名（例えば`shared`）に置き換える必要があるかもしれません。

テストソースセットを作成し、必要な依存関係を追加します。

1.  テスト用のディレクトリを作成します: `composeApp/src/desktopTest/kotlin`。
2.  `composeApp/build.gradle.kts`ファイルに、以下の依存関係を追加します。

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

3.  `ExampleTest.kt`というテストファイルを作成し、以下のコードをコピーします。

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

4.  テストを実行するには、`myTest()`関数の隣のガターにある実行アイコンをクリックするか、ターミナルで以下のコマンドを実行します。

    ```shell
    ./gradlew desktopTest
    ```
    
## 次のステップ

*   [マルチプラットフォームテストの作成と実行方法](multiplatform-run-tests.md)を参照してください。
*   KotlinプロジェクトでのJUnitベースのテストの概要については、「[JVMでJUnitを使用してコードをテストする](https://kotlinlang.org/docs/jvm-test-using-junit.html)」チュートリアルを参照してください。