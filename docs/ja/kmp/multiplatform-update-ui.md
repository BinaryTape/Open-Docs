[//]: # (title: ユーザーインターフェースを更新する)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>このチュートリアルではIntelliJ IDEAを使用しますが、Android Studioでも同様に進めることができます。どちらのIDEもコア機能とKotlin Multiplatformのサポートを共有しています。</p>
    <br/>
    <p>これは「<strong>共有ロジックとネイティブUIを持つKotlin Multiplatformアプリを作成する</strong>」チュートリアルの第2部です。次に進む前に、前の手順を完了していることを確認してください。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <Links href="/kmp/multiplatform-create-first-app" summary="このチュートリアルではIntelliJ IDEAを使用しますが、Android Studioでも同様に進めることができます。どちらのIDEもコア機能とKotlin Multiplatformのサポートを共有しています。これは「共有ロジックとネイティブUIを持つKotlin Multiplatformアプリを作成する」チュートリアルの第1部です。Kotlin Multiplatformアプリを作成する ユーザーインターフェースを更新する 依存関係を追加する ロジックをさらに共有する プロジェクトをまとめる">Kotlin Multiplatformアプリを作成する</Links><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>ユーザーインターフェースを更新する</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> 依存関係を追加する<br/>       
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> ロジックをさらに共有する<br/>
       <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> プロジェクトをまとめる<br/>
    </p>
</tldr>

ユーザーインターフェースを構築するには、プロジェクトのAndroid部分には[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)ツールキットを、iOS部分には[SwiftUI](https://developer.apple.com/xcode/swiftui/)を使用します。これらはどちらも宣言型UIフレームワークであり、UIの実装に類似点が見られます。どちらの場合も、データを`phrases`変数に格納し、後でそれを反復処理して`Text`アイテムのリストを生成します。

## Android部分を更新する

`composeApp`モジュールにはAndroidアプリケーションが含まれており、そのメインアクティビティとUIビューを定義し、`shared`モジュールを通常のAndroidライブラリとして使用します。アプリケーションのUIはCompose Multiplatformフレームワークを使用しています。

いくつかの変更を加えて、それらがUIにどのように反映されるかを確認してください。

1. `composeApp/src/androidMain/.../greetingkmp`ディレクトリにある`App.kt`ファイルに移動します。
2. `Greeting`クラスの呼び出しを見つけます。`greet()`関数を選択して右クリックし、**Go To** | **Declaration or Usages**を選択します。これは、前の手順で編集した`shared`モジュールと同じクラスであることがわかります。
3. `Greeting.kt`ファイルで、`greet()`関数が文字列のリストを返すように`Greeting`クラスを更新します。

   ```kotlin
   class Greeting {
   
       private val platform: Platform = getPlatform()
   
       fun greet(): List<String> = buildList {
           add(if (Random.nextBoolean()) "Hi!" else "Hello!")
           add("Guess what this is! > ${platform.name.reversed()}!")
       }
   }
   ```

4. `App.kt`ファイルに戻り、`App()`の実装を更新します。

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

   ここでは、`Column`コンポーザブルが`Text`アイテムのそれぞれを表示し、それらの周りにパディングを、それらの間にスペースを追加します。

5. IntelliJ IDEAの提案に従って、不足している依存関係をインポートします。
6. これでAndroidアプリを実行して、文字列のリストがどのように表示されるかを確認できます。

   ![Android Multiplatformアプリの更新されたUI](first-multiplatform-project-on-android-2.png){width=300}

## iOSモジュールを操作する

`iosApp`ディレクトリはiOSアプリケーションとしてビルドされます。これは`shared`モジュールに依存し、それをiOSフレームワークとして使用します。アプリのUIはSwiftで記述されています。

Androidアプリと同様の変更を実装します。

1. IntelliJ IDEAで、**Project**ツールウィンドウでプロジェクトのルートにある`iosApp/iosApp`フォルダーを見つけます。
2. `iosApp/ContentView.swift`ファイルを開き、`Greeting().greet()`呼び出しを右クリックし、**Go To** | **Definition**を選択します。

    `shared`モジュールで定義されたKotlin関数のObjective-C宣言が表示されます。Kotlinの型は、Objective-C/Swiftから使用されるときにObjective-Cの型として表現されます。ここでは、`greet()`関数はKotlinでは`List<String>`を返し、Swiftからは`NSArray<NSString>`を返すものとして見なされます。型マッピングの詳細については、[Swift/Objective-Cとの相互運用](https://kotlinlang.org/docs/native-objc-interop.html)を参照してください。

3. Androidアプリと同様の方法でアイテムのリストを表示するようにSwiftUIコードを更新します。

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

    * `greet()`呼び出しの結果は`phrases`変数に格納されます（Swiftの`let`はKotlinの`val`に似ています）。
    * `List`関数は`Text`アイテムのリストを生成します。

4. 変更を確認するためにiOS実行構成を開始します。

    ![iOS Multiplatformアプリの更新されたUI](first-multiplatform-project-on-ios-2.png){width=300}

## 発生しうる問題と解決策

### 共有フレームワークを呼び出すコードでXcodeがエラーを報告する場合

Xcodeを使用している場合、Xcodeプロジェクトがまだ古いバージョンのフレームワークを使用している可能性があります。これを解決するには、IntelliJ IDEAに戻りプロジェクトを再ビルドするか、iOS実行構成を開始してください。

### 共有フレームワークをインポートする際にXcodeがエラーを報告する場合

Xcodeを使用している場合、キャッシュされたバイナリをクリアする必要があるかもしれません。メインメニューで**Product | Clean Build Folder**を選択して環境をリセットしてみてください。

## 次のステップ

チュートリアルの次のパートでは、依存関係について学び、サードパーティライブラリを追加してプロジェクトの機能を拡張します。

**[次のパートに進む](multiplatform-dependencies.md)**

## ヘルプ

* **Kotlin Slack**。 [招待状を取得](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)して、[#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU)チャンネルに参加してください。
* **Kotlinイシュートラッカー**。[新しいイシューを報告する](https://youtrack.jetbrains.com/newIssue?project=KT)。