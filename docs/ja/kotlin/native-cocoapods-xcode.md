---
title: "Kotlin Gradle プロジェクトを CocoaPods の依存関係として使用する"
---
Kotlin Multiplatformプロジェクトをネイティブターゲットとして CocoaPods の依存関係で使用するには、[初期構成を完了させてください](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)。
生成された Podspec が含まれるプロジェクトディレクトリへの名前とパスで、Xcode プロジェクトの `Podfile` にそのような依存関係を含めることができます。

この依存関係は、このプロジェクトとともに自動的にビルド（およびリビルド）されます。このようなアプローチにより、対応する Gradle タスクと Xcode のビルド手順を手動で記述する必要がなくなり、Xcode へのインポートが簡素化されます。

Kotlin Gradle プロジェクトと、1つまたは複数のターゲットを持つ Xcode プロジェクトとの間に依存関係を追加できます。Gradle プロジェクトと複数の Xcode プロジェクトの間に依存関係を追加することも可能です。ただし、この場合、各 Xcode プロジェクトに対して手動で `pod install` を呼び出すことによって依存関係を追加する必要があります。それ以外の場合は、自動的に実行されます。

:::note
* Kotlin/Native モジュールに依存関係を正しくインポートするには、`Podfile` に
  [`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang) ディレクティブまたは
  [`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang) ディレクティブのいずれかが含まれている必要があります。
* 最小デプロイメントターゲットバージョンを指定せず、依存関係 Pod がより高いデプロイメントターゲットを必要とする場合は、
  エラーが発生します。

:::

## 1つのターゲットを持つ Xcode プロジェクト

1. まだ Xcode プロジェクトを作成していない場合は、`Podfile` を使用して作成します。
2. アプリケーションターゲットの **Build Options** で **User Script Sandboxing** が無効になっていることを確認します。

   <img src="/img/disable-sandboxing-cocoapods.png" alt="Disable sandboxing CocoaPods" style={{verticalAlign: 'middle'}}/>

3. Kotlin プロジェクトの `build.gradle(.kts)` ファイルに、Xcode プロジェクトの `Podfile` へのパスを `podfile = project.file(..)` で追加します。
   この手順は、`Podfile` に対して `pod install` を呼び出すことによって、Xcode プロジェクトを Gradle プロジェクトの依存関係と同期させるのに役立ちます。
4. Pod ライブラリの最小デプロイメントターゲットバージョンを指定します。

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

5. Xcode プロジェクトに含める Gradle プロジェクトの名前とパスを `Podfile` に追加します。

    ```ruby
    use_frameworks!

    platform :ios, '16.0'

    target 'ios-app' do
            pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

6. プロジェクトディレクトリで `pod install` を実行します。

   `pod install` を初めて実行すると、`.xcworkspace` ファイルが作成されます。このファイルには、元の `.xcodeproj` と CocoaPods プロジェクトが含まれています。
7. `.xcodeproj` を閉じて、代わりに新しい `.xcworkspace` ファイルを開きます。こうすることで、プロジェクトの依存関係に関する問題を回避できます。
8. IntelliJ IDEA で **Reload All Gradle Projects**（または Android Studio で **Sync Project with Gradle Files**）を実行して、プロジェクトを再度インポートします。

## 複数のターゲットを持つ Xcode プロジェクト

1. まだ Xcode プロジェクトを作成していない場合は、`Podfile` を使用して作成します。
2. Kotlin プロジェクトの `build.gradle(.kts)` に、Xcode プロジェクトの `Podfile` へのパスを `podfile = project.file(..)` で追加します。
   この手順は、`Podfile` に対して `pod install` を呼び出すことによって、Xcode プロジェクトを Gradle プロジェクトの依存関係と同期させるのに役立ちます。
3. プロジェクトで使用する Pod ライブラリへの依存関係を `pod()` で追加します。
4. ターゲットごとに、Pod ライブラリの最小デプロイメントターゲットバージョンを指定します。

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
            podfile = project.file("../severalTargetsXcodeProject/Podfile") // specify the path to the Podfile
        }
    }
    ```

5. Xcode プロジェクトに含める Gradle プロジェクトの名前とパスを `Podfile` に追加します。

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

6. プロジェクトディレクトリで `pod install` を実行します。

   `pod install` を初めて実行すると、`.xcworkspace` ファイルが作成されます。このファイルには、元の `.xcodeproj` と CocoaPods プロジェクトが含まれています。
7. `.xcodeproj` を閉じて、代わりに新しい `.xcworkspace` ファイルを開きます。こうすることで、プロジェクトの依存関係に関する問題を回避できます。
8. IntelliJ IDEA で **Reload All Gradle Projects**（または Android Studio で **Sync Project with Gradle Files**）を実行して、プロジェクトを再度インポートします。

サンプルプロジェクトは[こちら](https://github.com/Kotlin/kmm-with-cocoapods-multitarget-xcode-sample)にあります。

## 次のステップ

Xcode プロジェクトのビルドフェーズにカスタムビルドスクリプトを追加する方法については、[フレームワークを iOS プロジェクトに接続する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html#connect-the-framework-to-your-ios-project)を参照してください。