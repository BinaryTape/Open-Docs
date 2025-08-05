[//]: # (title: KotlinプロジェクトをCocoaPodsの依存関係として使用する)

<tldr>

* Pod依存関係を追加する前に、[初期設定を完了します](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
* サンプルプロジェクトは、当社の[GitHubリポジトリ](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)で確認できます。

</tldr>

Kotlinプロジェクト全体をPodの依存関係として使用できます。そのためには、プロジェクトのPodfileにその依存関係を含め、その名前と、生成されたPodspecがあるプロジェクトディレクトリへのパスを指定する必要があります。

この依存関係は、このプロジェクトとともに自動的にビルド（および再ビルド）されます。このようなアプローチにより、対応するGradleタスクやXcodeのビルドステップを手動で記述する必要がなくなるため、Xcodeへのインポートが簡素化されます。

Kotlinプロジェクトと、1つまたは複数のターゲットを持つXcodeプロジェクトとの間に依存関係を追加できます。また、Kotlinプロジェクトと複数のXcodeプロジェクトとの間に依存関係を追加することも可能です。ただし、この場合、各Xcodeプロジェクトに対して手動で`pod install`を呼び出す必要があります。単一のXcodeプロジェクトの場合は、自動的に行われます。

> * 依存関係をKotlin/Nativeモジュールに正しくインポートするには、Podfileに[`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang)または[`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang)ディレクティブのいずれかが含まれている必要があります。
> * 最小デプロイメントターゲットバージョンを指定せず、依存関係Podがより高いデプロイメントターゲットを要求する場合、エラーが発生します。
>
{style="note"}

## 単一ターゲットのXcodeプロジェクト

単一ターゲットのXcodeプロジェクトでKotlinプロジェクトをPodの依存関係として使用するには、次の手順を実行します。

1.  Xcodeプロジェクトがない場合は作成します。
2.  Xcodeで、アプリケーションターゲットの**Build Options**配下にある**User Script Sandboxing**を無効にしてください。

    ![Disable sandboxing CocoaPods](disable-sandboxing-cocoapods.png)

3.  KotlinプロジェクトのiOS部分にPodfileを作成します。
4.  共有モジュールの`build.gradle(.kts)`ファイルに、`podfile = project.file()`でPodfileへのパスを追加します。

    このステップは、Podfileに対して`pod install`を呼び出すことで、XcodeプロジェクトとKotlinプロジェクトの依存関係を同期するのに役立ちます。
5.  Podライブラリの最小デプロイメントターゲットバージョンを指定します。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"
   
            pod("SDWebImage") {
                version = "5.20.0"
            }
            podfile = project.file("../ios-app/Podfile")
        }
    }
    ```

6.  Podfileに、Xcodeプロジェクトに含めたいKotlinプロジェクトの名前とパスを追加します。

    ```ruby
    target 'ios-app' do
        use_frameworks!
        platform :ios, '16.0'
    
        # Pods for iosApp
        pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7.  プロジェクトディレクトリで`pod install`を実行します。

    初めて`pod install`を実行すると、`.xcworkspace`ファイルが作成されます。このファイルには、元の`.xcodeproj`とCocoaPodsプロジェクトが含まれます。
8.  `.xcodeproj`を閉じ、代わりに新しい`.xcworkspace`ファイルを開きます。これにより、プロジェクトの依存関係に関する問題を回避できます。
9.  IntelliJ IDEAで**Build** | **Reload All Gradle Projects**を実行（またはAndroid Studioで**File** | **Sync Project with Gradle Files**を実行）して、プロジェクトを再インポートします。

## 複数のターゲットを持つXcodeプロジェクト

複数のターゲットを持つXcodeプロジェクトでKotlinプロジェクトをPodの依存関係として使用するには、次の手順を実行します。

1.  Xcodeプロジェクトがない場合は作成します。
2.  KotlinプロジェクトのiOS部分にPodfileを作成します。
3.  共有モジュールの`build.gradle(.kts)`ファイルに、`podfile = project.file()`でプロジェクトのPodfileへのパスを追加します。

    このステップは、Podfileに対して`pod install`を呼び出すことで、XcodeプロジェクトとKotlinプロジェクトの依存関係を同期するのに役立ちます。
4.  プロジェクトで使用したいPodライブラリへの依存関係を`pod()`で追加します。
5.  各ターゲットについて、Podライブラリの最小デプロイメントターゲットバージョンを指定します。

    ```kotlin
    kotlin {
        iosArm64()
        tvosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"
            tvos.deploymentTarget = "16.0"

            pod("SDWebImage") {
                version = "5.20.0"
            }
            // Specify the path to the Podfile
            podfile = project.file("../severalTargetsXcodeProject/Podfile")
        }
    }
    ```

6.  Podfileに、Xcodeプロジェクトに含めたいKotlinプロジェクトの名前とパスを追加します。

    ```ruby
    target 'iosApp' do
      use_frameworks!
      platform :ios, '16.0'
   
      # Pods for iosApp
      pod 'kotlin_library', :path => '../kotlin-library'
    end

    target 'TVosApp' do
      use_frameworks!
      platform :tvos, '16.0'

      # Pods for TVosApp
      pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7.  プロジェクトディレクトリで`pod install`を実行します。

    初めて`pod install`を実行すると、`.xcworkspace`ファイルが作成されます。このファイルには、元の`.xcodeproj`とCocoaPodsプロジェクトが含まれます。
8.  `.xcodeproj`を閉じ、代わりに新しい`.xcworkspace`ファイルを開きます。これにより、プロジェクトの依存関係に関する問題を回避できます。
9.  IntelliJ IDEAで**Build** | **Reload All Gradle Projects**を実行（またはAndroid Studioで**File** | **Sync Project with Gradle Files**を実行）して、プロジェクトを再インポートします。

## 次のステップ

*   [KotlinプロジェクトでPodライブラリへの依存関係を追加する](multiplatform-cocoapods-libraries.md)
*   [フレームワークをiOSプロジェクトに接続する方法を確認する](multiplatform-direct-integration.md)
*   [CocoaPods GradleプラグインのDSLリファレンス全体を確認する](multiplatform-cocoapods-dsl-reference.md)