[//]: # (title: AndroidアプリをiOSで動作させる – チュートリアル)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>このチュートリアルではAndroid Studioを使用しますが、IntelliJ IDEAでも同様の手順で進めることができます。<a href="quickstart.md">適切にセットアップ</a>されていれば、
   どちらのIDEも同じコア機能とKotlin Multiplatformサポートを共有しています。</p>
</tldr>

このチュートリアルでは、既存のAndroidアプリケーションをAndroidとiOSの両方で動作するようにクロスプラットフォーム化する方法を説明します。
これにより、AndroidとiOSの両方のコードを同じ場所で一度に記述できるようになります。

このチュートリアルでは、ユーザー名とパスワードを入力する単一画面を持つ[サンプルAndroidアプリケーション](https://github.com/Kotlin/kmp-integration-sample)を使用します。入力された認証情報は検証され、インメモリデータベースに保存されます。

アプリケーションをiOSとAndroidの両方で動作させるには、
まずコードの一部を共有モジュールに移動してクロスプラットフォーム化します。
その後、Androidアプリケーションでクロスプラットフォームコードを使用し、さらに新しいiOSアプリケーションでも同じコードを使用します。

> Kotlin Multiplatformに慣れていない場合は、まず[クロスプラットフォームアプリケーションをゼロから作成する](quickstart.md)方法を学びましょう。
>
{style="tip"}

## 開発環境の準備

1. クイックスタートで、[Kotlin Multiplatform開発用の環境をセットアップする](quickstart.md#set-up-the-environment)手順を完了します。

   > このチュートリアルでは、iOSアプリケーションの実行など、特定の手順を完了するためにmacOSを搭載したMacが必要です。
   > これはAppleの要件によるものです。
   >
   {style="note"}

2. Android Studioで、バージョン管理から新しいプロジェクトを作成します。

   ```text
   https://github.com/Kotlin/kmp-integration-sample
   ```

   > `master`ブランチには、プロジェクトの初期状態であるシンプルなAndroidアプリケーションが含まれています。
   > iOSアプリケーションと共有モジュールを含む最終状態を確認するには、`final`ブランチに切り替えてください。
   >
   {style="tip"}

3. **Project**ビューに切り替えます。

   ![Project view](switch-to-project.png){width="513"}

## コードのクロスプラットフォーム化

コードをクロスプラットフォームにするには、以下の手順に従います。

1. [クロスプラットフォームにするコードを決定する](#decide-what-code-to-make-cross-platform)
2. [クロスプラットフォームコード用の共有モジュールを作成する](#create-a-shared-module-for-cross-platform-code)
3. [コード共有をテストする](#add-code-to-the-shared-module)
4. [Androidアプリケーションに共有モジュールの依存関係を追加する](#add-a-dependency-on-the-shared-module-to-your-android-application)
5. [ビジネスロジックをクロスプラットフォームにする](#make-the-business-logic-cross-platform)
6. [Androidでクロスプラットフォームアプリケーションを実行する](#run-your-cross-platform-application-on-android)

### クロスプラットフォームにするコードを決定する

AndroidアプリケーションのどのコードをiOSと共有し、どのコードをネイティブとして保持するかを決定します。簡単なルールは、可能な限り再利用したいものを共有することです。ビジネスロジックはAndroidとiOSの両方で同じであることが多いため、再利用の有力な候補となります。

サンプルAndroidアプリケーションでは、ビジネスロジックはパッケージ`com.jetbrains.simplelogin.androidapp.data`に保存されています。
将来のiOSアプリケーションでも同じロジックを使用するため、これもクロスプラットフォーム化する必要があります。

![Business logic to share](business-logic-to-share.png){width=366}

### クロスプラットフォームコード用の共有モジュールを作成する

iOSとAndroidの両方で使用されるクロスプラットフォームコードは、共有モジュールに保存されます。
Android StudioとIntelliJ IDEAはどちらも、Kotlin Multiplatform用の共有モジュールを作成するためのウィザードを提供しています。

既存のAndroidアプリケーションと将来のiOSアプリケーションの両方に接続するための共有モジュールを作成します。

1. Android Studioで、メインメニューから**File** | **New** | **New Module**を選択します。
2. テンプレートのリストから**Kotlin Multiplatform Shared Module**を選択します。
   ライブラリ名は`shared`のままにし、パッケージ名を入力します。

   ```text
   com.jetbrains.simplelogin.shared
   ```

3. **Finish**をクリックします。ウィザードは共有モジュールを作成し、それに応じてビルドスクリプトを変更し、Gradle同期を開始します。
4. セットアップが完了すると、`shared`ディレクトリに以下のファイル構造が表示されます。

   ![Final file structure inside the shared directory](shared-directory-structure.png){width="341"}

5. `shared/build.gradle.kts`ファイルの`kotlin.androidLibrary.minSdk`プロパティが、`app/build.gradle.kts`ファイルの同じプロパティの値と一致していることを確認してください。

### 共有モジュールにコードを追加する

共有モジュールができたので、
`commonMain/kotlin/com.jetbrains.simplelogin.shared`ディレクトリに共有する共通コードを追加します。

1. 以下のコードで新しい`Greeting`クラスを作成します。

    ```kotlin
    package com.jetbrains.simplelogin.shared

    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2. 作成されたファイルのコードを以下に置き換えます。

     * `commonMain/Platform.kt`で:

         ```kotlin
         package com.jetbrains.simplelogin.shared
       
         interface Platform {
             val name: String
         }
        
         expect fun getPlatform(): Platform
         ```
     
     * `androidMain/Platform.android.kt`で:

         ```kotlin
         package com.jetbrains.simplelogin.shared
         
         import android.os.Build

         class AndroidPlatform : Platform {
             override val name: String = "Android ${Build.VERSION.SDK_INT}"
         }

         actual fun getPlatform(): Platform = AndroidPlatform()
         ```
     * `iosMain/Platform.ios.kt`で:

         ```kotlin
         package com.jetbrains.simplelogin.shared
       
         import platform.UIKit.UIDevice

         class IOSPlatform: Platform {
             override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
         }

         actual fun getPlatform(): Platform = IOSPlatform()
         ```

結果として得られるプロジェクトのレイアウトをよりよく理解したい場合は、
[Kotlin Multiplatformプロジェクト構造の基礎](multiplatform-discover-project.md)を参照してください。

### Androidアプリケーションに共有モジュールの依存関係を追加する

Androidアプリケーションでクロスプラットフォームコードを使用するには、共有モジュールをアプリケーションに接続し、ビジネスロジックコードをそこへ移動し、このコードをクロスプラットフォームにします。

1. `app/build.gradle.kts`ファイルに共有モジュールの依存関係を追加します。

    ```kotlin
    dependencies {
        // ...
        implementation(project(":shared"))
    }
    ```

2. IDEの指示に従って、または**File** | **Sync Project with Gradle Files**メニュー項目を使用して、Gradleファイルを同期します。
3. `app/src/main/java/`ディレクトリで、`com.jetbrains.simplelogin.androidapp.ui.login`パッケージ内の`LoginActivity.kt`ファイルを開きます。
4. 共有モジュールがアプリケーションに正常に接続されていることを確認するために、`onCreate()`メソッドに`Log.i()`呼び出しを追加して、`greet()`関数の結果をログに出力します。

    ```kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Log.i("Login Activity", "Hello from shared module: " + (Greeting().greet()))
   
        // ...
    }
    ```
5. 不足しているクラスをインポートするために、IDEの提案に従います。
6. ツールバーで`app`ドロップダウンをクリックし、次にデバッグアイコンをクリックします。

   ![App from list to debug](app-list-android.png){width="300"}

7. **Logcat**ツールウィンドウでログから「Hello」を検索すると、共有モジュールからの挨拶が見つかります。

   ![Greeting from the shared module](shared-module-greeting.png){width="700"}

### ビジネスロジックをクロスプラットフォームにする

これで、ビジネスロジックコードをKotlin Multiplatform共有モジュールに抽出し、プラットフォーム非依存にすることができます。
これは、AndroidとiOSの両方でコードを再利用するために必要です。

1. ビジネスロジックコード`com.jetbrains.simplelogin.androidapp.data`を`app`ディレクトリから
   `shared/src/commonMain`ディレクトリ内の`com.jetbrains.simplelogin.shared`パッケージに移動します。

   ![Drag and drop the package with the business logic code](moving-business-logic.png){width=300}

2. Android Studioが何をしたいか尋ねてきたら、パッケージの移動を選択し、リファクタリングを承認します。

   ![Refactor the business logic package](refactor-business-logic-package.png){width=300}

3. プラットフォーム依存のコードに関するすべての警告を無視し、**Refactor Anyway**をクリックします。

   ![Warnings about platform-dependent code](warnings-android-specific-code.png){width=450}

4. Android固有のコードを、クロスプラットフォームのKotlinコードに置き換えるか、[expectedおよびactual宣言](multiplatform-connect-to-apis.md)を使用してAndroid固有のAPIに接続することで削除します。詳細は以下のセクションを参照してください。

   #### Android固有のコードをクロスプラットフォームコードに置き換える {initial-collapse-state="collapsed" collapsible="true"}
   
   コードがAndroidとiOSの両方でうまく動作するように、移動した`data`ディレクトリ内のすべてのJVM依存関係を可能な限りKotlin依存関係に置き換えます。

   1. `LoginDataValidator`クラスで、`android.utils`パッケージの`Patterns`クラスを、メール検証パターンに一致するKotlinの正規表現に置き換えます。
   
       ```kotlin
       // Before
       private fun isEmailValid(email: String) = Patterns.EMAIL_ADDRESS.matcher(email).matches()
       ```
   
       ```kotlin
       // After
       private fun isEmailValid(email: String) = emailRegex.matches(email)
       
       companion object {
           private val emailRegex = 
               ("[a-zA-Z0-9\\+\\.\\_\\%\\-\\+]{1,256}" +
                   "\\@" +
                   "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,64}" +
                   "(" +
                   "\\." +
                   "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,25}" +
                   ")+").toRegex()
       }
       ```
   
   2. `Patterns`クラスのimportディレクティブを削除します。
   
       ```kotlin
       import android.util.Patterns
       ```

   3. `LoginDataSource`クラスで、`login()`関数内の`IOException`を`RuntimeException`に置き換えます。
      `IOException`はKotlin/JVMでは利用できません。

          ```kotlin
          // Before
          return Result.Error(IOException("Error logging in", e))
          ```

          ```kotlin
          // After
          return Result.Error(RuntimeException("Error logging in", e))
          ```

   4. `IOException`のimportディレクティブも削除します。

       ```kotlin
       import java.io.IOException
       ```

   #### クロスプラットフォームコードからプラットフォーム固有のAPIに接続する {initial-collapse-state="collapsed" collapsible="true"}
   
   `LoginDataSource`クラスでは、`fakeUser`用の汎用一意識別子（UUID）が`java.util.UUID`クラスを使用して生成されていますが、これはiOSでは利用できません。
   
   ```kotlin
   val fakeUser = LoggedInUser(java.util.UUID.randomUUID().toString(), "Jane Doe")
   ```
   
   Kotlin標準ライブラリには[UUID生成用の実験的なクラス](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/)が提供されていますが、
   ここではその練習としてプラットフォーム固有の機能を使用してみましょう。
   
   共有コードで`randomUUID()`関数の`expect`宣言を提供し、対応するソースセットで各プラットフォーム（AndroidとiOS）向けの`actual`実装を提供します。
   [プラットフォーム固有のAPIへの接続](multiplatform-connect-to-apis.md)について、さらに詳しく学ぶことができます。
   
   1. `login()`関数内の`java.util.UUID.randomUUID()`呼び出しを、各プラットフォームで実装する`randomUUID()`呼び出しに変更します。
   
       ```kotlin
       val fakeUser = LoggedInUser(randomUUID(), "Jane Doe")
       ```
   
   2. `shared/src/commonMain`ディレクトリ内の`com.jetbrains.simplelogin.shared`パッケージに`Utils.kt`ファイルを作成し、`expect`宣言を提供します。
   
       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       expect fun randomUUID(): String
       ```
   
   3. `shared/src/androidMain`ディレクトリ内の`com.jetbrains.simplelogin.shared`パッケージに`Utils.android.kt`ファイルを作成し、Androidでの`randomUUID()`の`actual`実装を提供します。
   
       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       import java.util.*
      
       actual fun randomUUID() = UUID.randomUUID().toString()
       ```
   
   4. `shared/src/iosMain`ディレクトリ内の`com.jetbrains.simplelogin.shared`に`Utils.ios.kt`ファイルを作成し、iOSでの`randomUUID()`の`actual`実装を提供します。
   
       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       import platform.Foundation.NSUUID
      
       actual fun randomUUID(): String = NSUUID().UUIDString()
       ```
   
   5. `shared/src/commonMain`ディレクトリの`LoginDataSource.kt`ファイルで`randomUUID`関数をインポートします。
   
      ```kotlin
      import com.jetbrains.simplelogin.shared.randomUUID
      ```
   
これで、KotlinはAndroidとiOSでプラットフォーム固有のUUID実装を使用するようになります。

### Androidでクロスプラットフォームアプリケーションを実行する

クロスプラットフォームアプリケーションをAndroidで実行し、以前と同じように動作することを確認します。

![Android login application](android-login.png){width=300}

## クロスプラットフォームアプリケーションをiOSで動作させる

Androidアプリケーションをクロスプラットフォームにしたら、iOSアプリケーションを作成し、その中で共有ビジネスロジックを再利用できます。

1. [XcodeでiOSプロジェクトを作成する](#create-an-ios-project-in-xcode)
2. [KMPフレームワークを使用するようにiOSプロジェクトを構成する](#configure-the-ios-project-to-use-a-kmp-framework)
3. [Android StudioでiOS実行構成を設定する](#set-up-an-ios-run-configuration-in-android-studio)
4. [iOSプロジェクトで共有モジュールを使用する](#use-the-shared-module-in-the-ios-project)

### XcodeでiOSプロジェクトを作成する

1. Xcodeで、**File** | **New** | **Project**をクリックします。
2. iOSアプリのテンプレートを選択し、**Next**をクリックします。

   ![iOS project template](ios-project-wizard-1.png){width=700}

3. プロダクト名に「simpleLoginIOS」を指定し、**Next**をクリックします。

   ![iOS project settings](ios-project-wizard-2.png){width=700}

4. プロジェクトの場所として、クロスプラットフォームアプリケーションを格納しているディレクトリ（例: `kmp-integration-sample`）を選択します。

Android Studioでは、以下の構造が得られます。

![iOS project in Android Studio](ios-project-in-as.png){width=194}

クロスプラットフォームプロジェクトの他のトップレベルディレクトリとの整合性を保つため、`simpleLoginIOS`ディレクトリを`iosApp`に名前変更できます。
これを行うには、Xcodeを閉じてから`simpleLoginIOS`ディレクトリを`iosApp`に名前変更します。
Xcodeを開いたままフォルダ名を変更すると、警告が表示され、プロジェクトが破損する可能性があります。

![Renamed iOS project directory in Android Studio](ios-directory-renamed-in-as.png){width=194}

### KMPフレームワークを使用するようにiOSプロジェクトを構成する

iOSアプリとKotlin Multiplatformでビルドされたフレームワークとの統合を直接設定できます。
この方法以外の選択肢は[iOS統合方法の概要](multiplatform-ios-integration-overview.md)で説明されていますが、それらはこのチュートリアルの範囲外です。

1. Android Studioで、`iosApp/simpleLoginIOS.xcodeproj`ディレクトリを右クリックし、**Open In** | **Open In Associated Application**を選択して、XcodeでiOSプロジェクトを開きます。
2. Xcodeで、**Project**ナビゲータでプロジェクト名をダブルクリックしてiOSプロジェクト設定を開きます。

3. 左側の**Targets**セクションで、**simpleLoginIOS**を選択し、**Build Phases**タブをクリックします。

4. **+**アイコンをクリックし、**New Run Script Phase**を選択します。

    ![Add a run script phase](xcode-run-script-phase-1.png){width=700}

4. 以下のスクリプトをランスクリプトフィールドに貼り付けます。

    ```text
    cd "$SRCROOT/.."
    ./gradlew :shared:embedAndSignAppleFrameworkForXcode
    ```

   ![Add the script](xcode-run-script-phase-2.png){width=700}

5. **Based on dependency analysis**オプションを無効にします。

   これにより、Xcodeはビルドごとにスクリプトを実行し、出力依存関係の欠落について毎回警告を表示しないようになります。

6. **Run Script**フェーズを**Compile Sources**フェーズの前に配置し、より高い位置に移動します。

   ![Move the Run Script phase](xcode-run-script-phase-3.png){width=700}

7. **Build Settings**タブで、**Build Options**の下にある**User Script Sandboxing**オプションを無効にします。

   ![User Script Sandboxing](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > デフォルトの`Debug`または`Release`とは異なるカスタムビルド構成を使用している場合は、**Build Settings**
   > タブの**User-Defined**の下に`KOTLIN_FRAMEWORK_BUILD_TYPE`設定を追加し、`Debug`または`Release`に設定してください。
   >
   {style="note"}

8. Xcodeでプロジェクトをビルドします（メインメニューの**Product** | **Build**）。
    すべてが正しく構成されていれば、プロジェクトは正常にビルドされるはずです
    （「build phase will be run during every build」という警告は無視しても安全です）。
   
    > **User Script Sandboxing**オプションを無効にする前にプロジェクトをビルドした場合、ビルドが失敗することがあります。
    > Gradleデーモンプロセスがサンドボックス化され、再起動が必要になる場合があります。
    > プロジェクトディレクトリ（この例では`kmp-integration-sample`）で以下のコマンドを実行して、再度プロジェクトをビルドする前に停止してください。
    > 
    > ```shell
    > ./gradlew --stop
    > ```
    > 
    {style="note"}

### Android StudioでiOS実行構成を設定する

Xcodeが正しく設定されていることを確認したら、Android Studioに戻ります。

1. メインメニューで**File | Sync Project with Gradle Files**を選択します。Android Studioは自動的に**simpleLoginIOS**という実行構成を生成します。

   Android Studioは自動的に**simpleLoginIOS**という実行構成を生成し、`iosApp`ディレクトリをリンクされたXcodeプロジェクトとしてマークします。

2. 実行構成のリストで、**simpleLoginIOS**を選択します。
   iOSエミュレータを選択し、**Run**をクリックしてiOSアプリが正しく実行されることを確認します。

   ![The iOS run configuration in the list of run configurations](ios-run-configuration-simplelogin.png){width=400}

### iOSプロジェクトで共有モジュールを使用する

`shared`モジュールの`build.gradle.kts`ファイルは、各iOSターゲットの`binaries.framework.baseName`プロパティを`sharedKit`として定義しています。
これは、Kotlin MultiplatformがiOSアプリで消費するためにビルドするフレームワークの名前です。

統合をテストするために、Swiftコードで共通コードへの呼び出しを追加します。

1. Android Studioで、`iosApp/simpleloginIOS/ContentView.swift`ファイルを開き、フレームワークをインポートします。

   ```swift
   import sharedKit
   ```

2. 正しく接続されていることを確認するために、`ContentView`構造体を変更して、クロスプラットフォームアプリの共有モジュールから`greet()`関数を使用するようにします。

   ```swift
   struct ContentView: View {
       var body: some View {
           Text(Greeting().greet())
           .padding()
       }
   }
   ```

3. Android StudioのiOS実行構成を使用してアプリを実行し、結果を確認します。

   ![Greeting from the shared module](xcode-iphone-hello.png){width=300}

4. `ContentView.swift`ファイルのコードを再度更新し、共有モジュールからのビジネスロジックを使用してアプリケーションUIをレンダリングします。

   ```kotlin
   ```
   {src="android-ios-tutorial/ContentView.swift" initial-collapse-state="collapsed" collapsible="true"}

5. `simpleLoginIOSApp.swift`ファイルで、`sharedKit`モジュールをインポートし、`ContentView()`関数の引数を指定します。

    ```swift
    import SwiftUI
    import sharedKit
    
    @main
    struct SimpleLoginIOSApp: App {
        var body: some Scene {
            WindowGroup {
                ContentView(viewModel: .init(loginRepository: LoginRepository(dataSource: LoginDataSource()), loginValidator: LoginDataValidator()))
            }
        }
    }
    ```

6. iOS実行構成を再度実行し、iOSアプリがログインフォームを表示することを確認します。
7. ユーザー名に「Jane」、パスワードに「password」と入力します。
8. [以前に統合を設定した](#configure-the-ios-project-to-use-a-kmp-framework)ため、
    iOSアプリは共通コードを使用して入力を検証します。

   ![Simple login application](xcode-iphone-login.png){width=300}

## 結果を楽しむ – ロジックの更新は一度だけ

これでアプリケーションはクロスプラットフォームになりました。`shared`モジュールでビジネスロジックを更新すると、AndroidとiOSの両方で結果を確認できます。

1. ユーザーのパスワード検証ロジックを変更します。「password」は有効なオプションではないようにします。
    これを行うには、`LoginDataValidator`クラスの`checkPassword()`関数を更新します
    （すばやく見つけるには、<shortcut>Shift</shortcut>を2回押し、クラス名を貼り付けて**Classes**タブに切り替えます）。

   ```kotlin
   package com.jetbrains.simplelogin.shared.data
   
   class LoginDataValidator {
   //...
       fun checkPassword(password: String): Result {
           return when {
               password.length < 5 -> Result.Error("Password must be >5 characters")
               password.lowercase() == "password" -> Result.Error("Password shouldn't be \"password\"")
               else -> Result.Success
           }
       }
   //...
   }
   ```

2. Android StudioからiOSとAndroidの両方のアプリケーションを実行し、変更を確認します。

   ![Android and iOS applications password error](android-iphone-password-error.png){width=600}

このチュートリアルの[最終コード](https://github.com/Kotlin/kmp-integration-sample/tree/final)を確認できます。

## 他に何を共有できますか？

アプリケーションのビジネスロジックを共有しましたが、アプリケーションの他のレイヤーも共有することを決定できます。
例えば、`ViewModel`クラスのコードは[Android](https://github.com/Kotlin/kmp-integration-sample/blob/final/app/src/main/java/com/jetbrains/simplelogin/androidapp/ui/login/LoginViewModel.kt)と
[iOSアプリケーション](https://github.com/Kotlin/kmp-integration-sample/blob/final/iosApp/SimpleLoginIOS/ContentView.swift#L84)でほとんど同じであり、
モバイルアプリケーションが同じプレゼンテーション層を持つべきであれば、それを共有できます。

## 次のステップは？

Androidアプリケーションをクロスプラットフォームにしたら、さらに進んで以下のことができます。

* [マルチプラットフォームライブラリに依存関係を追加する](multiplatform-add-dependencies.md)
* [Androidの依存関係を追加する](multiplatform-android-dependencies.md)
* [iOSの依存関係を追加する](multiplatform-ios-dependencies.md)

Compose Multiplatformを使用して、すべてのプラットフォームで統一されたUIを作成できます。

* [Compose MultiplatformとJetpack Composeについて学ぶ](compose-multiplatform-and-jetpack-compose.md)
* [Compose Multiplatformで利用可能なリソースを探索する](compose-multiplatform-resources.md)
* [共有ロジックとUIを持つアプリを作成する](compose-multiplatform-create-first-app.md)

コミュニティリソースも確認できます。

* [ビデオ: AndroidプロジェクトをKotlin Multiplatformに移行する方法](https://www.youtube.com/watch?v=vb-Pt8SdfEE&t=1s)
* [ビデオ: Kotlin JVMコードをKotlin Multiplatform向けに準備する3つの方法](https://www.youtube.com/watch?v=X6ckI1JWjqo)