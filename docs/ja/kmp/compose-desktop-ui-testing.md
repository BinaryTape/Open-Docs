[//]: # (title: JUnit を使用した Compose Multiplatform UI のテスト)

デスクトップ向けの Compose Multiplatform は、JUnit と Jetpack Compose テスト API に基づくテスト API を提供します。
実装の詳細については、Jetpack Compose ドキュメントの [Compose レイアウトをテストする](https://developer.android.com/develop/ui/compose/testing) 
ガイドを参照してください。

> サポートされているすべてのプラットフォームで利用可能な UI テスト機能については、[Compose Multiplatform UI のテスト](compose-test.md) の記事を参照してください。
>
{style="tip"}

JUnit ベースのテストを実際に見てみるために、[Kotlin Multiplatform ウィザード](https://kmp.jetbrains.com/) で生成されたプロジェクトから始めましょう。
既存のプロジェクトにテストを追加する場合は、パスやコマンド内の `composeApp` を、テスト対象のモジュール名（例: `shared`）に置き換える必要があるかもしれません。

テストソースセットを作成し、必要な依存関係を追加します。

1. テスト用のディレクトリ `composeApp/src/desktopTest/kotlin` を作成します。
2. `composeApp/build.gradle.kts` ファイルに、以下の依存関係を追加します。

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

3. `ExampleTest.kt` という名前のテストファイルを作成し、以下のコードをそこにコピーします。

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
            // API 呼び出しを実演するためのモック UI を宣言します
            //
            // プロジェクト内のコードをテストするために、独自の宣言に置き換えてください
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
    
            // JUnit ベースのテスト API のアサーションとアクションを使用して、宣言された UI をテストします
            rule.onNodeWithTag("text").assertTextEquals("Hello")
            rule.onNodeWithTag("button").performClick()
            rule.onNodeWithTag("text").assertTextEquals("Compose")
        }
    }
    ```

4. テストを実行するには、`myTest()` 関数の横にあるガターの実行アイコンをクリックするか、ターミナルで以下のコマンドを実行します。

   ```shell
   ./gradlew desktopTest
   ```
   
## 次は？

* [マルチプラットフォームテストの作成と実行](multiplatform-run-tests.md) 方法を確認する。
* Kotlin プロジェクトにおける JUnit ベースのテストの一般的な概要については、[JVM で JUnit を使用してコードをテストする](https://kotlinlang.org/docs/jvm-test-using-junit.html) チュートリアルを参照してください。