[//]: # (title: ユーザーインターフェースを更新する)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用していますが、Android Studioでも同じように進めることができます。両方のIDEは同じコア機能とKotlin Multiplatformサポートを共有しています。</p>
    <br/>
    <p>これは、<strong>共有ロジックとネイティブUIを持つKotlin Multiplatformアプリを作成する</strong>チュートリアルの第2部です。先に進む前に、前の手順を完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-create-first-app.md">Kotlin Multiplatformアプリを作成する</a><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>ユーザーインターフェースを更新する</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> 依存関係を追加する<br/>       
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> ロジックをさらに共有する<br/>
       <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> プロジェクトを完了する<br/>
    </p>
</tldr>

ユーザーインターフェースを構築するために、プロジェクトのAndroid部分には[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)ツールキットを、iOS部分には[SwiftUI](https://developer.apple.com/xcode/swiftui/)を使用します。
これらは両方とも宣言型UIフレームワークであり、UIの実装に類似点が見られます。どちらの場合も、データを`phrases`変数に格納し、後でそれを反復処理して`Text`アイテムのリストを生成します。

## Android部分を更新する

`composeApp`モジュールはAndroidアプリケーションを含み、そのメインアクティビティとUIビューを定義し、`shared`モジュールを通常のAndroidライブラリとして使用します。アプリケーションのUIはCompose Multiplatformフレームワークを使用しています。

いくつかの変更を加えて、それらがUIにどのように反映されるかを確認してください：

1.  `composeApp/src/androidMain/kotlin`にある`App.kt`ファイルに移動します。
2.  `Greeting`クラスの呼び出しを見つけます。`greet()`関数を選択し、右クリックして**Go To** | **Declaration or Usages**を選択します。
    これが前のステップで編集した`shared`モジュール内の同じクラスであることがわかります。
3.  `Greeting.kt`ファイルで、`greet()`関数を更新します。

   ```kotlin
   import kotlin.random.Random
   
   fun greet(): List<String> = buildList {
       add(if (Random.nextBoolean()) "Hi!" else "Hello!")
       add("Guess what this is! > ${platform.name.reversed()}!")
   }
   ```

   これで文字列のリストを返すようになりました。

4.  `App.kt`ファイルに戻り、`App()`の実装を更新します。

   ```kotlin
   @Composable
   @Preview
   fun App() {
       MaterialTheme {
           val greeting = remember { Greeting().greet() }
   
           Column(
               modifier = Modifier
                   .padding(all = 10.dp)
                   .safeContentPadding()
                   .fillMaxSize(),
               verticalArrangement = Arrangement.spacedBy(8.dp),
           ) {
               greeting.forEach { greeting ->
                   Text(greeting)
                   HorizontalDivider()
               }
           }
       }
   }
   ```

   ここでは、`Column`コンポーザブルが各`Text`アイテムを表示し、それらの周りにパディングを、項目間にスペースを追加しています。

5.  IntelliJ IDEAの提案に従って、不足している依存関係をインポートします。
6.  これでAndroidアプリを実行し、文字列のリストがどのように表示されるかを確認できます。

   ![Updated UI of Android multiplatform app](first-multiplatform-project-on-android-2.png){width=300}

## iOSモジュールを操作する

`iosApp`ディレクトリはiOSアプリケーションとしてビルドされます。これは`shared`モジュールに依存し、iOSフレームワークとして使用します。アプリのUIはSwiftで書かれています。

Androidアプリと同じ変更を実装します。

1.  IntelliJ IDEAで、**Project**ツールウィンドウのプロジェクトのルートにある`iosApp`フォルダーを見つけます。
2.  `ContentView.swift`ファイルを開き、`Greeting().greet()`呼び出しを右クリックして、**Go To** | **Definition**を選択します。

    `shared`モジュールで定義されたKotlin関数のObjective-C宣言が表示されます。Kotlinの型はObjective-C/Swiftから使用される際にObjective-Cの型として表現されます。ここでは、`greet()`関数はKotlinでは`List<String>`を返し、Swiftからは`NSArray<NSString>`を返すものとして見られます。型マッピングの詳細については、[Swift/Objective-Cとの相互運用](https://kotlinlang.org/docs/native-objc-interop.html)を参照してください。

3.  SwiftUIコードを更新して、Androidアプリと同じ方法でアイテムのリストを表示します。

    ```Swift
    struct ContentView: View {
       let phrases = Greeting().greet()
    
       var body: some View {
           List(phrases, id: \.self) {
               Text($0)
           }
       }
    }
    ```

    *   `greet()`呼び出しの結果は`phrases`変数に格納されます（Swiftの`let`はKotlinの`val`に似ています）。
    *   `List`関数は`Text`アイテムのリストを生成します。

4.  iOS実行構成を開始して変更を確認します。

    ![Updated UI of your iOS multiplatform app](first-multiplatform-project-on-ios-2.png){width=300}

## 起こりうる問題と解決策

### Xcodeが共有フレームワークを呼び出すコードでエラーを報告する

Xcodeを使用している場合、Xcodeプロジェクトがまだフレームワークの古いバージョンを使用している可能性があります。
これを解決するには、IntelliJ IDEAに戻り、プロジェクトを再ビルドするか、iOS実行構成を開始してください。

### Xcodeが共有フレームワークのインポート時にエラーを報告する

Xcodeを使用している場合、キャッシュされたバイナリをクリアする必要があるかもしれません。メインメニューで**Product | Clean Build Folder**を選択して、環境のリセットを試してください。

## 次のステップ

チュートリアルの次のパートでは、依存関係について学び、サードパーティライブラリを追加してプロジェクトの機能を拡張します。

**[次のパートに進む](multiplatform-dependencies.md)**

## ヘルプを得る

*   **Kotlin Slack**。[招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を受け取り、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。
*   **Kotlinイシュートラッカー**。[新しい問題を報告する](https://youtrack.jetbrains.com/newIssue?project=KT)。