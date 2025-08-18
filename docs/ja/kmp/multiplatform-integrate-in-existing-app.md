[//]: # (title: AndroidアプリケーションをiOSで動作させる – チュートリアル)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>このチュートリアルではAndroid Studioを使用しますが、IntelliJ IDEAでも進めることができます。<Links href="/kmp/quickstart" summary="undefined">適切にセットアップ</Links>されていれば、両方のIDEは同じコア機能とKotlin Multiplatformのサポートを共有します。</p>
</tldr>

このチュートリアルでは、既存のAndroidアプリケーションをAndroidとiOSの両方で動作するクロスプラットフォームアプリケーションにする方法を説明します。
これにより、AndroidとiOS両方のコードを一度に、同じ場所で記述できるようになります。

このチュートリアルでは、ユーザー名とパスワードを入力する単一画面を持つ[サンプルAndroidアプリケーション](https://github.com/Kotlin/kmp-integration-sample)を使用します。入力された認証情報は検証され、インメモリデータベースに保存されます。

アプリケーションをiOSとAndroidの両方で動作させるには、
まず、コードの一部を共有モジュールに移動してクロスプラットフォーム化します。
その後、Androidアプリケーションでそのクロスプラットフォームコードを使用し、さらに新しいiOSアプリケーションでも同じコードを使用します。

> Kotlin Multiplatformに不慣れな場合は、まず[ゼロからクロスプラットフォームアプリケーションを作成する方法](quickstart.md)を学習してください。
>
{style="tip"}

## 開発環境の準備

1. クイックスタートで、[Kotlin Multiplatform開発の環境設定](quickstart.md#set-up-the-environment)の手順を完了します。

   > iOSアプリケーションの実行など、このチュートリアルの一部の手順を完了するには、macOSがインストールされたMacが必要です。
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

   ![プロジェクトビュー](switch-to-project.png){width="513"}

## コードをクロスプラットフォーム化する

コードをクロスプラットフォーム化するには、次の手順を実行します。

1. [どのコードをクロスプラットフォームにするか決定する](#decide-what-code-to-make-cross-platform)
2. [クロスプラットフォームコード用の共有モジュールを作成する](#create-a-shared-module-for-cross-platform-code)
3. [コード共有をテストする](#add-code-to-the-shared-module)
4. [Androidアプリケーションに共有モジュールへの依存関係を追加する](#add-a-dependency-on-the-shared-module-to-your-android-application)
5. [ビジネスロジックをクロスプラットフォーム化する](#make-the-business-logic-cross-platform)
6. [クロスプラットフォームアプリケーションをAndroidで実行する](#run-your-cross-platform-application-on-android)

### どのコードをクロスプラットフォームにするか決定する

AndroidアプリケーションのどのコードをiOSと共有し、どのコードをネイティブとして保持するかを決定します。シンプルなルールは、
可能な限り再利用したいものを共有するというものです。ビジネスロジックはAndroidとiOSの両方で同じであることが多いため、
再利用の有力な候補となります。

サンプルAndroidアプリケーションでは、ビジネスロジックは`com.jetbrains.simplelogin.androidapp.data`パッケージに保存されています。
将来のiOSアプリケーションも同じロジックを使用するため、これもクロスプラットフォーム化する必要があります。

![共有するビジネスロジック](business-logic-to-share.png){width=366}

### クロスプラットフォームコード用の共有モジュールを作成する

iOSとAndroidの両方で使用されるクロスプラットフォームコードは、共有モジュールに保存されます。
Android StudioとIntelliJ IDEAの両方に、Kotlin Multiplatform用の共有モジュールを作成するウィザードが用意されています。

既存のAndroidアプリケーションと将来のiOSアプリケーションの両方に接続するための共有モジュールを作成します。

1. Android Studioで、メインメニューから**File** | **New** | **New Module**を選択します。
2. テンプレートのリストから**Kotlin Multiplatform Shared Module**を選択します。
   ライブラリ名は`shared`のままにし、パッケージ名を入力します。

   ```text
   com.jetbrains.simplelogin.shared
   ```

3. **Finish**をクリックします。ウィザードが共有モジュールを作成し、ビルドスクリプトをそれに応じて変更し、Gradle同期を開始します。
4. セットアップが完了すると、`shared`ディレクトリに次のファイル構造が表示されます。

   ![sharedディレクトリ内の最終ファイル構造](shared-directory-structure.png){width="341"}

5. `shared/build.gradle.kts`ファイル内の`kotlin.androidLibrary.minSdk`プロパティの値が、`app/build.gradle.kts`ファイル内の同じプロパティの値と一致していることを確認します。

### 共有モジュールにコードを追加する

共有モジュールが作成できたので、
`commonMain/kotlin/com.jetbrains.simplelogin.shared`ディレクトリに共有する共通コードを追加します。

1. 次のコードで新しい`Greeting`クラスを作成します。

    ```kotlin
    package com.jetbrains.simplelogin.shared

    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2. 作成されたファイルのコードを次のように置き換えます。

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

作成されるプロジェクトのレイアウトについてより深く理解したい場合は、
[Kotlin Multiplatformプロジェクト構造の基本](multiplatform-discover-project.md)を参照してください。

### Androidアプリケーションに共有モジュールへの依存関係を追加する

Androidアプリケーションでクロスプラットフォームコードを使用するには、共有モジュールを接続し、ビジネスロジックコードをそこに移動して、このコードをクロスプラットフォームにします。

1. `app/build.gradle.kts`ファイルに共有モジュールへの依存関係を追加します。

    ```kotlin
    dependencies {
        // ...
        implementation(project(":shared"))
    }
    ```

2. IDEの提案に従うか、**File** | **Sync Project with Gradle Files**メニュー項目を使用してGradleファイルを同期します。
3. `app/src/main/java/`ディレクトリで、`com.jetbrains.simplelogin.androidapp.ui.login`パッケージ内の`LoginActivity.kt`ファイルを開きます。
4. 共有モジュールがアプリケーションに正常に接続されていることを確認するには、`onCreate()`メソッドに`Log.i()`呼び出しを追加して、`greet()`関数の結果をログに出力します。

    ```kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Log.i("Login Activity", "Hello from shared module: " + (Greeting().greet()))
   
        // ...
    }
    ```
5. IDEの提案に従って、不足しているクラスをインポートします。
6. ツールバーで、`app`ドロップダウンをクリックし、デバッグアイコンをクリックします。

   ![デバッグするアプリのリスト](app-list-android.png){width="300"}

7. **Logcat**ツールウィンドウでログから「Hello」を検索すると、共有モジュールからの挨拶が見つかります。

   ![共有モジュールからの挨拶](shared-module-greeting.png){width="700"}

### ビジネスロジックをクロスプラットフォーム化する

これで、ビジネスロジックコードをKotlin Multiplatform共有モジュールに抽出し、プラットフォーム非依存にすることができます。
これは、AndroidとiOSの両方でコードを再利用するために必要です。

1. ビジネスロジックコード`com.jetbrains.simplelogin.androidapp.data`を`app`ディレクトリから
   `shared/src/commonMain`ディレクトリ内の`com.jetbrains.simplelogin.shared`パッケージに移動します。

   ![ビジネスロジックコードを含むパッケージをドラッグアンドドロップ](moving-business-logic.png){width=300}

2. Android Studioが何をしたいか尋ねてきたら、パッケージを移動することを選択し、リファクタリングを承認します。

   ![ビジネスロジックパッケージをリファクタリング](refactor-business-logic-package.png){width=300}

3. プラットフォーム依存コードに関するすべての警告を無視し、**Refactor Anyway**をクリックします。

   ![プラットフォーム依存コードに関する警告](warnings-android-specific-code.png){width=450}

4. Android固有のコードを、クロスプラットフォームのKotlinコードに置き換えるか、[expectとactual宣言](multiplatform-connect-to-apis.md)を使用してAndroid固有のAPIに接続することで削除します。詳細については、以下のセクションを参照してください。

   #### Android固有のコードをクロスプラットフォームコードに置き換える {initial-collapse-state="collapsed" collapsible="true"}
   
   コードをAndroidとiOSの両方でうまく動作させるには、移動した`data`ディレクトリ内で、可能な限りすべてのJVM依存関係をKotlinの依存関係に置き換えます。

   1. `LoginDataValidator`クラスで、`android.utils`パッケージの`Patterns`クラスを、メール検証のパターンに一致するKotlinの正規表現に置き換えます。
   
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
   
   `LoginDataSource`クラスでは、`fakeUser`の汎用一意識別子（UUID）が
   `java.util.UUID`クラスを使用して生成されますが、これはiOSでは利用できません。
   
   ```kotlin
   val fakeUser = LoggedInUser(java.util.UUID.randomUUID().toString(), "Jane Doe")
   ```
   
   Kotlin標準ライブラリには[UUID生成のための実験的なクラス](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/)が提供されていますが、
   ここではその練習のためにプラットフォーム固有の機能を使用してみましょう。
   
   共有コードで`randomUUID()`関数の`expect`宣言を提供し、対応するソースセットで
   各プラットフォーム（AndroidとiOS）向けの`actual`実装を提供します。
   [プラットフォーム固有のAPIへの接続](multiplatform-connect-to-apis.md)について詳しく学ぶことができます。
   
   1. `login()`関数内の`java.util.UUID.randomUUID()`呼び出しを、各プラットフォーム向けに実装する`randomUUID()`呼び出しに変更します。
   
       ```kotlin
       val fakeUser = LoggedInUser(randomUUID(), "Jane Doe")
       ```
   
   2. `shared/src/commonMain`ディレクトリの`com.jetbrains.simplelogin.shared`パッケージに`Utils.kt`ファイルを作成し、`expect`宣言を提供します。
   
       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       expect fun randomUUID(): String
       ```
   
   3. `shared/src/androidMain`ディレクトリの`com.jetbrains.simplelogin.shared`パッケージに`Utils.android.kt`ファイルを作成し、Androidでの`randomUUID()`の`actual`実装を提供します。
   
       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       import java.util.*
      
       actual fun randomUUID() = UUID.randomUUID().toString()
       ```
   
   4. `shared/src/iosMain`ディレクトリの`com.jetbrains.simplelogin.shared`に`Utils.ios.kt`ファイルを作成し、
      iOSでの`randomUUID()`の`actual`実装を提供します。
   
       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       import platform.Foundation.NSUUID
      
       actual fun randomUUID(): String = NSUUID().UUIDString()
       ```
   
   5. `shared/src/commonMain`ディレクトリの`LoginDataSource.kt`ファイルで`randomUUID`関数をインポートします。
   
      ```kotlin
      import com.jetbrains.simplelogin.shared.randomUUID
      ```
   
これで、KotlinはAndroidとiOSに対して、プラットフォーム固有のUUID実装を使用するようになります。

### クロスプラットフォームアプリケーションをAndroidで実行する

クロスプラットフォームアプリケーションをAndroidで実行し、以前と同様に動作することを確認します。

![Androidログインアプリケーション](android-login.png){width=300}

## クロスプラットフォームアプリケーションをiOSで動作させる

Androidアプリケーションをクロスプラットフォーム化した後、iOSアプリケーションを作成し、その中で共有ビジネスロジックを再利用できます。

1. [XcodeでiOSプロジェクトを作成する](#create-an-ios-project-in-xcode)
2. [KMPフレームワークを使用するようにiOSプロジェクトを設定する](#configure-the-ios-project-to-use-a-kmp-framework)
3. [Android StudioでiOS実行構成を設定する](#set-up-an-ios-run-configuration-in-android-studio)
4. [iOSプロジェクトで共有モジュールを使用する](#use-the-shared-module-in-the-ios-project)

### XcodeでiOSプロジェクトを作成する

1. Xcodeで、**File** | **New** | **Project**をクリックします。
2. iOSアプリのテンプレートを選択し、**Next**をクリックします。

   ![iOSプロジェクトテンプレート](ios-project-wizard-1.png){width=700}

3. プロダクト名として「simpleLoginIOS」を指定し、**Next**をクリックします。

   ![iOSプロジェクト設定](ios-project-wizard-2.png){width=700}

4. プロジェクトの場所として、クロスプラットフォームアプリケーションが保存されているディレクトリ（例：`kmp-integration-sample`）を選択します。

Android Studioでは、以下の構造が得られます。

![Android StudioでのiOSプロジェクト](ios-project-in-as.png){width=194}

クロスプラットフォームプロジェクトの他のトップレベルディレクトリとの一貫性のために、`simpleLoginIOS`ディレクトリを`iosApp`にリネームできます。
そのためには、Xcodeを閉じてから、`simpleLoginIOS`ディレクトリを`iosApp`にリネームします。
Xcodeを開いたままフォルダをリネームすると、警告が表示され、プロジェクトが破損する可能性があります。

![Android StudioでリネームされたiOSプロジェクトディレクトリ](ios-directory-renamed-in-as.png){width=194}

### KMPフレームワークを使用するようにiOSプロジェクトを設定する

iOSアプリとKotlin Multiplatformによってビルドされたフレームワーク間の統合を直接設定できます。
この方法以外の代替手段については、[iOS統合方法の概要](multiplatform-ios-integration-overview.md)で説明されていますが、このチュートリアルの範囲外です。

1. Android Studioで、`iosApp/simpleLoginIOS.xcodeproj`ディレクトリを右クリックし、
   **Open In** | **Open In Associated Application**を選択して、XcodeでiOSプロジェクトを開きます。
2. Xcodeで、**Project**ナビゲーターのプロジェクト名をダブルクリックして、iOSプロジェクト設定を開きます。

3. 左側の**Targets**セクションで**simpleLoginIOS**を選択し、**Build Phases**タブをクリックします。

4. **+**アイコンをクリックし、**New Run Script Phase**を選択します。

    ![Run Scriptフェーズを追加](xcode-run-script-phase-1.png){width=700}

4. ランスクリプトフィールドに以下のスクリプトを貼り付けます。

    ```text
    cd "$SRCROOT/.."
    ./gradlew :shared:embedAndSignAppleFrameworkForXcode
    ```

   ![スクリプトを追加](xcode-run-script-phase-2.png){width=700}

5. **Based on dependency analysis**オプションを無効にします。

   これにより、Xcodeがビルドごとにスクリプトを実行し、出力依存関係の欠落に関する警告が毎回表示されないようになります。

6. **Run Script**フェーズを**Compile Sources**フェーズの前に移動させます。

   ![Run Scriptフェーズを移動](xcode-run-script-phase-3.png){width=700}

7. **Build Settings**タブで、**Build Options**の下にある**User Script Sandboxing**オプションを無効にします。

   ![ユーザー・スクリプト・サンドボックス化](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > デフォルトの`Debug`または`Release`とは異なるカスタムビルド設定を使用している場合、**Build Settings**タブの**User-Defined**の下に`KOTLIN_FRAMEWORK_BUILD_TYPE`設定を追加し、`Debug`または`Release`に設定します。
   >
   {style="note"}

8. Xcodeでプロジェクトをビルドします（メインメニューの**Product** | **Build**）。
    すべてが正しく設定されていれば、プロジェクトは正常にビルドされます
    （「build phase will be run during every build」という警告は安全に無視できます）。
   
    > **User Script Sandboxing**オプションを無効にする前にプロジェクトをビルドした場合、ビルドが失敗する可能性があります。
    > Gradleデーモンプロセスがサンドボックス化されている可能性があり、再起動が必要です。
    > プロジェクトディレクトリ（例: `kmp-integration-sample`）でこのコマンドを実行して、再度プロジェクトをビルドする前に停止してください。
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

2. 実行構成のリストで**simpleLoginIOS**を選択します。
   iOSエミュレーターを選択し、**Run**をクリックしてiOSアプリが正しく実行されることを確認します。

   ![実行構成のリストにあるiOS実行構成](ios-run-configuration-simplelogin.png){width="400"}

### iOSプロジェクトで共有モジュールを使用する

`shared`モジュールの`build.gradle.kts`ファイルは、各iOSターゲットの`binaries.framework.baseName`プロパティを`sharedKit`として定義しています。
これは、Kotlin MultiplatformがiOSアプリが利用するためにビルドするフレームワークの名前です。

統合をテストするために、Swiftコードで共通コードを呼び出します。

1. Android Studioで、`iosApp/simpleloginIOS/ContentView.swift`ファイルを開き、フレームワークをインポートします。

   ```swift
   import sharedKit
   ```

2. 正しく接続されていることを確認するには、`ContentView`構造をクロスプラットフォームアプリの共有モジュールから`greet()`関数を使用するように変更します。

   ```swift
   struct ContentView: View {
       var body: some View {
           Text(Greeting().greet())
           .padding()
       }
   }
   ```

3. Android StudioのiOS実行構成を使用してアプリを実行し、結果を確認します。

   ![共有モジュールからの挨拶](xcode-iphone-hello.png){width=300}

4. `ContentView.swift`ファイルのコードを再度更新し、共有モジュールのビジネスロジックを使用してアプリケーションUIをレンダリングします。

   ```kotlin
   
   ```

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
7. ユーザー名に「Jane」を、パスワードに「password」を入力します。
8. [以前に統合を設定した](#configure-the-ios-project-to-use-a-kmp-framework)ため、iOSアプリは共通コードを使用して入力を検証します。

   ![シンプルなログインアプリケーション](xcode-iphone-login.png){width=300}

## 結果を楽しむ – ロジックの更新は一度だけ

これでアプリケーションはクロスプラットフォームになりました。`shared`モジュールのビジネスロジックを更新すると、AndroidとiOSの両方で結果を確認できます。

1. ユーザーのパスワードの検証ロジックを変更します。「password」が有効なオプションであってはなりません。
    そのためには、`LoginDataValidator`クラスの`checkPassword()`関数を更新します（すばやく見つけるには、<shortcut>Shift</shortcut>を2回押し、クラス名を貼り付けて**Classes**タブに切り替えます）。

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

2. Android StudioからiOSおよびAndroidアプリケーションの両方を実行し、変更を確認します。

   ![AndroidおよびiOSアプリケーションのパスワードエラー](android-iphone-password-error.png){width=600}

このチュートリアルの[最終コード](https://github.com/Kotlin/kmp-integration-sample/tree/final)を確認できます。

## 他に共有できるものは？

アプリケーションのビジネスロジックを共有しましたが、アプリケーションの他のレイヤーも共有することに決定できます。
たとえば、`ViewModel`クラスのコードは[Android](https://github.com/Kotlin/kmp-integration-sample/blob/final/app/src/main/java/com/jetbrains/simplelogin/androidapp/ui/login/LoginViewModel.kt)と[iOSアプリケーション](https://github.com/Kotlin/kmp-integration-sample/blob/final/iosApp/SimpleLoginIOS/ContentView.swift#L84)でほとんど同じであり、モバイルアプリケーションが同じプレゼンテーション層を持つべきであれば、それを共有できます。

## 次のステップ

Androidアプリケーションをクロスプラットフォーム化した後、さらに次のことができます。

* [マルチプラットフォームライブラリへの依存関係を追加する](multiplatform-add-dependencies.md)
* [Androidの依存関係を追加する](multiplatform-android-dependencies.md)
* [iOSの依存関係を追加する](multiplatform-ios-dependencies.md)

Compose Multiplatformを使用して、すべてのプラットフォームで統一されたUIを作成できます。

* [Compose MultiplatformとJetpack Composeについて学ぶ](compose-multiplatform-and-jetpack-compose.md)
* [Compose Multiplatformで利用可能なリソースを探す](compose-multiplatform-resources.md)
* [共有ロジックとUIを持つアプリを作成する](compose-multiplatform-create-first-app.md)

コミュニティリソースも確認できます。

* [動画: AndroidプロジェクトをKotlin Multiplatformに移行する方法](https://www.youtube.com/watch?v=vb-Pt8SdfEE&t=1s)
* [動画: Kotlin JVMコードをKotlin Multiplatform向けに準備する3つの方法](https://www.youtube.com/watch?v=X6ckI1JWjqo)