[//]: # (title: iOS依存関係の追加)

Apple SDKの依存関係（FoundationやCore Bluetoothなど）は、Kotlin Multiplatformプロジェクトにおいて事前ビルド済みのライブラリセットとして利用可能です。これらには追加の設定は必要ありません。

また、iOSソースセットでは、iOSエコシステムの他のライブラリやフレームワークを再利用することもできます。Kotlinは、APIが `@objc` 属性によってObjective-Cにエクスポートされている場合、Objective-CおよびSwiftの依存関係との相互運用をサポートしています。純粋な（Pure）Swiftの依存関係はまだサポートされていません。

Kotlin MultiplatformプロジェクトでiOSの依存関係を処理するには、[cinteropツール](#with-cinterop)で管理するか、[CocoaPods依存関係マネージャー](#with-cocoapods)を使用します（純粋なSwiftのPodはサポートされていません）。

### cinteropを使用する

cinteropツールを使用して、Objective-CまたはSwiftの宣言に対するKotlinバインディングを作成できます。これにより、Kotlinコードからそれらを呼び出すことができるようになります。

手順は[ライブラリ](#add-a-library)と[フレームワーク](#add-a-framework)で若干異なりますが、一般的なワークフローは以下の通りです：

1. 依存関係をダウンロードする。
2. バイナリを取得するためにビルドする。
3. この依存関係をcinteropに説明するための特別な `.def` [定義ファイル](https://kotlinlang.org/docs/native-definition-file.html)を作成する。
4. ビルド中にバインディングを生成するようにビルドスクリプトを調整する。

#### ライブラリを追加する

1. ライブラリのソースコードをダウンロードし、プロジェクトから参照できる場所に配置します。
2. ライブラリをビルドし（通常、ライブラリの作成者がビルド方法のガイドを提供しています）、バイナリへのパスを取得します。
3. プロジェクト内に、例えば `DateTools.def` のような `.def` ファイルを作成します。
4. このファイルに最初の文字列を追加します：`language = Objective-C`。純粋なCの依存関係を使用する場合は、`language` プロパティを省略してください。
5. 2つの必須プロパティの値を指定します：

    * `headers` は、cinteropによって処理されるヘッダーを記述します。
    * `package` は、これらの宣言を配置するパッケージ名を設定します。

   例：

    ```none
    headers = DateTools.h
    package = DateTools
    ```

6. ビルドスクリプトにこのライブラリとの相互運用に関する情報を追加します：

    * `.def` ファイルへのパスを渡します。`.def` ファイルがcinteropと同じ名前で、`src/nativeInterop/cinterop/` ディレクトリに配置されている場合、このパスは省略可能です。
    * `includeDirs` オプションを使用して、cinteropにヘッダーファイルを探す場所を伝えます。
    * ライブラリバイナリへのリンクを設定します。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .defファイルへのパス
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    // ヘッダー検索のためのディレクトリ（コンパイラオプションの -I<path> に相当）
                    includeDirs("include/this/directory", "path/to/another/directory")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // ライブラリにリンクするために必要なリンカーオプション
                linkerOpts("-L/path/to/library/binaries", "-lbinaryname")
            }
        }
    }
    ```

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .defファイルへのパス
                        definitionFile = project.file("src/nativeInterop/cinterop/DateTools.def")

                        // ヘッダー検索のためのディレクトリ（コンパイラオプションの -I<path> に相当）
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // ライブラリにリンクするために必要なリンカーオプション
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. プロジェクトをビルドします。

これで、Kotlinコードでこの依存関係を使用できるようになります。そのためには、`.def` ファイルの `package` プロパティで設定したパッケージをインポートします。上記の例の場合、以下のようになります：

```kotlin
import DateTools.*
```

> [cinteropツールとlibcurlライブラリを使用したサンプルプロジェクト](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native)を参照してください。
>
{style="tip"}

#### フレームワークを追加する

1. フレームワークのソースコードをダウンロードし、プロジェクトから参照できる場所に配置します。
2. フレームワークをビルドし（通常、フレームワークの作成者がビルド方法のガイドを提供しています）、バイナリへのパスを取得します。
3. プロジェクト内に、例えば `MyFramework.def` のような `.def` ファイルを作成します。
4. このファイルに最初の文字列を追加します：`language = Objective-C`。純粋なCの依存関係を使用する場合は、`language` プロパティを省略してください。
5. これら2つの必須プロパティの値を指定します：

    * `modules` – cinteropによって処理されるフレームワークの名前。
    * `package` – これらの宣言を配置するパッケージ名。

    例：
    
    ```none
    modules = MyFramework
    package = MyFramework
    ```

6. ビルドスクリプトにフレームワークとの相互運用に関する情報を追加します：

    * `.def` ファイルへのパスを渡します。`.def` ファイルがcinteropと同じ名前で、`src/nativeInterop/cinterop/` ディレクトリに配置されている場合、このパスは省略可能です。
    * `-framework` オプションを使用して、コンパイラとリンカーにフレームワーク名を渡します。`-F` オプションを使用して、コンパイラとリンカーにフレームワークのソースとバイナリへのパスを渡します。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .defファイルへのパス
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // リンカーにフレームワークの場所を伝える
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
       }
    }
    ```

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .defファイルへのパス
                        definitionFile = project.file("src/nativeInterop/cinterop/MyFramework.def")

                        compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // リンカーにフレームワークの場所を伝える
                linkerOpts "-framework", "MyFramework", "-F/path/to/framework/"
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. プロジェクトをビルドします。

これで、Kotlinコードでこの依存関係を使用できるようになります。そのためには、`.def` ファイルの `package` プロパティで設定したパッケージをインポートします。上記の例の場合、以下のようになります：

```kotlin
import MyFramework.*
```

[Swift/Objective-Cの相互運用](https://kotlinlang.org/docs/native-objc-interop.html)および[Gradleからのcinteropの設定](multiplatform-dsl-reference.md#cinterops)の詳細をご覧ください。

### CocoaPodsを使用する

1. [CocoaPods統合の初期セットアップ](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)を実行します。
2. プロジェクトの `build.gradle(.kts)` に `pod()` 関数の呼び出しを含めることで、使用したいCocoaPodsリポジトリのPodライブラリへの依存関係を追加します。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        cocoapods {
            version = "2.0"
            //..
            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        cocoapods {
            version = '2.0'
            //..
            pod('SDWebImage') {
                version = '5.20.0'
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

   Podライブラリに対して、以下の依存関係を追加できます：

   * [CocoaPodsリポジトリから](multiplatform-cocoapods-libraries.md#from-the-cocoapods-repository)
   * [ローカルに保存されたライブラリに対して](multiplatform-cocoapods-libraries.md#on-a-locally-stored-library)
   * [カスタムGitリポジトリから](multiplatform-cocoapods-libraries.md#from-a-custom-git-repository)
   * [カスタムPodspecリポジトリから](multiplatform-cocoapods-libraries.md#from-a-custom-podspec-repository)
   * [カスタムcinteropオプションを使用する場合](multiplatform-cocoapods-libraries.md#with-custom-cinterop-options)

3. IntelliJ IDEAで **Build** | **Reload All Gradle Projects** を実行（またはAndroid Studioで **File** | **Sync Project with Gradle Files** を実行）して、プロジェクトを再インポートします。

Kotlinコードで依存関係を使用するには、パッケージ `cocoapods.<library-name>` をインポートします。上記の例の場合、以下のようになります：

```kotlin
import cocoapods.SDWebImage.*
```

> * [Kotlinプロジェクトで設定されたさまざまなPod依存関係](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)のサンプルプロジェクトをご覧ください。
> * [複数のターゲットを持つXcodeプロジェクトがKotlinライブラリに依存している](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)サンプルプロジェクトを確認してください。
> 
{style="tip"}

## 次のステップ

マルチプラットフォームプロジェクトでの依存関係の追加に関する他のリソースを確認し、以下について詳しく学びましょう：

* [プラットフォームライブラリの接続](https://kotlinlang.org/docs/native-platform-libs.html)
* [マルチプラットフォームライブラリまたは他のマルチプラットフォームプロジェクトへの依存関係の追加](multiplatform-add-dependencies.md)
* [Android依存関係の追加](multiplatform-android-dependencies.md)