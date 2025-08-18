[//]: # (title: Compose Multiplatform UIのテスト)

Compose MultiplatformにおけるUIテストは、Jetpack ComposeのテストAPIと同じ**ファインダー**、**アサーション**、**アクション**、および**マッチャー**を使用して実装されます。これらに馴染みがない場合は、この記事を読み進める前に[Jetpack Composeガイド](https://developer.android.com/jetpack/compose/testing)を参照してください。

> APIは[実験的](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)です。
> 今後変更される可能性があります。
>
{style="warning"}

## Compose MultiplatformテストとJetpack Composeテストの違い

Compose Multiplatformの共通テストAPIは、JUnitの`TestRule`クラスに依存しません。代わりに、`runComposeUiTest`関数を呼び出し、`ComposeUiTest`レシーバー上でテスト関数を呼び出します。

ただし、JUnitベースのAPIは[デスクトップターゲット](compose-desktop-ui-testing.md)で利用できます。

## Compose Multiplatformでテストを記述および実行する

まず、テスト用のソースセットと必要な依存関係をモジュールに追加します。次に、サンプルテストを記述して実行し、カスタマイズを試します。

### テストソースセットを作成し、テストライブラリを依存関係に追加する

具体的な例を示すために、このページの指示は[Kotlin Multiplatform wizard](https://kmp.jetbrains.com/)によって生成されたプロジェクト構造に従っています。既存のプロジェクトにテストを追加する場合、パスやコマンド内の`composeApp`を、テスト対象のモジュール名（例: `shared`）に置き換える必要があるかもしれません。

共通テストソースセットを作成し、必要な依存関係を追加します。

1.  共通テストソースセット用のディレクトリを作成します: `composeApp/src/commonTest/kotlin`。
2.  `composeApp/build.gradle.kts`ファイルに、以下の依存関係を追加します。

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

3.  Android向けのインストルメンテッド（エミュレーター）テストを実行する必要がある場合は、Gradle設定を以下のように修正してください。
    1.  `androidTarget {}`ブロックに以下のコードを追加して、インストルメンテッドテストソースセットが共通テストソースセットに依存するように設定します。その後、IDEの提案に従って不足しているインポートを追加してください。

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

    2.  `android.defaultConfig {}`ブロックに以下のコードを追加して、Androidテストインストルメンテーションランナーを設定します。

        ```kotlin
        android {
            //...
            defaultConfig {
                //...
                testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
            }
        }
        ```

    3.  `androidTarget`に必要な依存関係を追加します。

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

これで、Compose Multiplatform UIの共通テストを記述し、実行する準備ができました。

### 共通テストを記述および実行する

`composeApp/src/commonTest/kotlin`ディレクトリに`ExampleTest.kt`という名前のファイルを作成し、以下のコードをコピーします。

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

テストを実行するには:

<Tabs>
<TabItem title="iOSシミュレーター">

2つのオプションがあります:
* Android Studioで、`myTest()`関数の隣のガターにある緑色の実行アイコンをクリックし、**Run**とテスト用のiOSターゲットを選択します。
* ターミナルで以下のコマンドを実行します:

   ```shell
   ./gradlew :composeApp:iosSimulatorArm64Test
   ```

</TabItem>
<TabItem title="Androidエミュレーター">

ターミナルでこのコマンドを実行します:

```shell
./gradlew :composeApp:connectedAndroidTest
```

現在、`android (local)`テスト構成を使用して共通のCompose Multiplatformテストを実行することはできません。そのため、例えばAndroid Studioのガターアイコンは役立ちません。

</TabItem>
<TabItem title="デスクトップ">

2つのオプションがあります:
* `myTest()`関数の隣のガターにある緑色の実行アイコンをクリックし、**Run&nbsp;|&nbsp;desktop**を選択します。
* ターミナルで以下のコマンドを実行します:

   ```shell
   ./gradlew :composeApp:desktopTest
   ```

</TabItem>
<TabItem title="Wasm（ヘッドレスブラウザ）">

ターミナルでこのコマンドを実行します:

```shell
./gradlew :composeApp:wasmJsTest
```

</TabItem>
</Tabs>

## 次のステップ

Compose Multiplatform UIテストのコツを掴んだところで、さらにテスト関連のリソースをチェックすることをお勧めします:
* Kotlin Multiplatformプロジェクトにおけるテストの概要については、[基本的なプロジェクト構造を理解する](multiplatform-discover-project.md#integration-with-tests)と[マルチプラットフォームアプリをテストする](multiplatform-run-tests.md)チュートリアルを参照してください。
* デスクトップターゲット向けのJUnitベースのテストの設定と実行の詳細については、[JUnitでCompose Multiplatform UIをテストする](compose-desktop-ui-testing.md)を参照してください。
* ローカライゼーションテストについては、[undefined](compose-localization-tests.md#testing-locales-on-different-platforms)を参照してください。
* 自動化を含むAndroid Studioでのより高度なテストについては、Android Studioドキュメントの[アプリをテストする](https://developer.android.com/studio/test)記事で説明されています。