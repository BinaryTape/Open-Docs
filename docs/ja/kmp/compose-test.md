[//]: # (title: Compose Multiplatform UI のテスト)

Compose Multiplatform における UI テストは、Jetpack Compose のテスト API と同じファインダー、アサーション、アクション、マッチャーを使用して実装されます。これらの使用に慣れていない場合は、この記事を読み進める前に [Jetpack Compose ガイド](https://developer.android.com/jetpack/compose/testing) を参照してください。

> この API は [実験的 (Experimental)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) です。
> 将来的に変更される可能性があります。
>
{style="warning"}

## Compose Multiplatform のテストが Jetpack Compose と異なる点

Compose Multiplatform の共通テスト API は、JUnit の `TestRule` クラスに依存していません。代わりに、`runComposeUiTest` 関数を呼び出し、`ComposeUiTest` レシーバー上でテスト関数を呼び出します。

ただし、JUnit ベースの API は [デスクトップターゲット](compose-desktop-ui-testing.md) で利用可能です。

## Compose Multiplatform でテストを記述して実行する

まず、テスト用のソースセットと必要な依存関係をモジュールに追加します。その後、サンプルテストを記述して実行し、カスタマイズを試みます。

### テストソースセットを作成し、テストライブラリを依存関係に追加する

具体的な例を示すため、このページの手順は [Kotlin Multiplatform ウィザード](https://kmp.jetbrains.com/) によって生成されたプロジェクト構造に従っています。既存のプロジェクトにテストを追加する場合は、パスやコマンド内の `composeApp` をテスト対象のモジュール名（例: `shared`）に置き換える必要があるかもしれません。

共通テストソースセットを作成し、必要な依存関係を追加します。

1.  共通テストソースセットのディレクトリを作成します: `composeApp/src/commonTest/kotlin`。
2.  `composeApp/build.gradle.kts` ファイルに、以下の依存関係を追加します。

    ```kotlin
    kotlin {
        //...
        sourceSets { 
            val desktopTest by getting
   
            // Adds common test dependencies
            commonTest.dependencies {
                implementation(kotlin("test"))
            
                @OptIn(org.jetbrains.compose.ExperimentalComposeLibrary::class)
                implementation(compose.uiTest)
            }
   
            // Adds the desktop test dependency
            desktopTest.dependencies { 
                implementation(compose.desktop.currentOs)
            }
        }
    }
    ```

3.  Android のインストゥルメンテッド (エミュレーター) テストを実行する必要がある場合は、Gradle 設定を次のように修正します。
    1.  `androidTarget {}` ブロックに以下のコードを追加して、インストゥルメンテッドテストソースセットが共通テストソースセットに依存するように構成します。その後、IDE の提案に従って不足しているインポートを追加します。

        ```kotlin
        kotlin {
            //...
            androidTarget { 
                @OptIn(ExperimentalKotlinGradlePluginApi::class)
                instrumentedTestVariant.sourceSetTree.set(KotlinSourceSetTree.test)
                //...
            }
            //... 
        }
        ```

    2.  `android.defaultConfig {}` ブロックに以下のコードを追加して、Android テストインストゥルメンテーションランナーを設定します。

        ```kotlin
        android {
            //...
            defaultConfig {
                //...
                testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
            }
        }
        ```

    3.  `androidTarget` に必要な依存関係を追加します。

        ```kotlin
        kotlin {
             // ...
             androidTarget {
                 // ...
                 dependencies { 
                     androidTestImplementation("androidx.compose.ui:ui-test-junit4-android:%androidx.compose%")
                     debugImplementation("androidx.compose.ui:ui-test-manifest:%androidx.compose%")
                 }
             }
         }
        ```

これで、Compose Multiplatform UI の共通テストを記述して実行する準備が整いました。

### 共通テストを記述して実行する

`composeApp/src/commonTest/kotlin` ディレクトリに `ExampleTest.kt` という名前のファイルを作成し、以下のコードをコピーします。

```kotlin
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.test.*
import kotlin.test.Test

class ExampleTest {

    @OptIn(ExperimentalTestApi::class)
    @Test
    fun myTest() = runComposeUiTest {
        // Declares a mock UI to demonstrate API calls
        //
        // Replace with your own declarations to test the code of your project
        setContent {
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

        // Tests the declared UI with assertions and actions of the Compose Multiplatform testing API
        onNodeWithTag("text").assertTextEquals("Hello")
        onNodeWithTag("button").performClick()
        onNodeWithTag("text").assertTextEquals("Compose")
    }
}
```

テストを実行するには：

<tabs>
<tab title="iOSシミュレーター">

2つの選択肢があります。
* Android Studio で、`myTest()` 関数の隣にあるガターの緑色の実行アイコンをクリックし、**Run** とテストの iOS ターゲットを選択します。
* ターミナルで以下のコマンドを実行します。

   ```shell
   ./gradlew :composeApp:iosSimulatorArm64Test
   ```

</tab>
<tab title="Androidエミュレーター">

ターミナルでこのコマンドを実行します。

```shell
./gradlew :composeApp:connectedAndroidTest
```

現在、`android (local)` テスト設定を使用して共通の Compose Multiplatform テストを実行することはできません。そのため、例えば Android Studio のガターアイコンは役に立ちません。

</tab>
<tab title="デスクトップ">

2つの選択肢があります。
* `myTest()` 関数の隣にあるガターの緑色の実行アイコンをクリックし、**Run&nbsp;|&nbsp;desktop** を選択します。
* ターミナルで以下のコマンドを実行します。

   ```shell
   ./gradlew :composeApp:desktopTest
   ```

</tab>
<tab title="Wasm (ヘッドレスブラウザ)">

ターミナルでこのコマンドを実行します。

```shell
./gradlew :composeApp:wasmJsTest
```

</tab>
</tabs>

## 次のステップ

Compose Multiplatform UI テストのコツを掴んだところで、さらにテスト関連のリソースを確認することをお勧めします。
* Kotlin Multiplatform プロジェクトでのテストの概要については、「[基本的なプロジェクト構造を理解する](multiplatform-discover-project.md#integration-with-tests)」と「[マルチプラットフォームアプリをテストする](multiplatform-run-tests.md)」チュートリアルを参照してください。
* デスクトップターゲットの JUnit ベースのテストの設定と実行の詳細については、「[](compose-desktop-ui-testing.md)」を参照してください。
* ローカライゼーションテストについては、「[](compose-localization-tests.md#testing-locales-on-different-platforms)」を参照してください。
* 自動化を含む Android Studio でのより高度なテストについては、Android Studio ドキュメントの「[アプリをテストする](https://developer.android.com/studio/test)」記事で説明されています。